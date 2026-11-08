// ===== XXX film core: canvas, three renderer, helpers, characters =====
const W = 1920, H = 1080, TAU = Math.PI * 2;
const cv = document.getElementById('c'); let X = cv.getContext('2d');
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, t) => { t = clamp((t - a) / (b - a)); return t * t * (3 - 2 * t) };
const eio = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const eout = t => 1 - Math.pow(1 - clamp(t), 3);
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) };
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c };
let SH = { t0: 0, t1: 1, T: 0, R: q => 0 };
const A = (q, d = .6) => { if (q == null) return 1; const t = typeof q === 'number' ? SH.t0 + q : SH.R(q); return clamp((SH.T - t) / d) };

// ---------- three ----------
const GL = mk(W, H);
const RD = new THREE.WebGLRenderer({ canvas: GL, antialias: true, preserveDrawingBuffer: true, alpha: false });
RD.setSize(W, H, false); RD.outputColorSpace = THREE.SRGBColorSpace; RD.toneMapping = THREE.ACESFilmicToneMapping; RD.toneMappingExposure = 1.15;
RD.shadowMap.enabled = true; RD.shadowMap.type = THREE.PCFSoftShadowMap;
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const M = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .7, metalness: 0 }, o));
const MB = (c, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ color: c }, o));
function mesh(g, m, x = 0, y = 0, z = 0, par) { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; if (par) par.add(o); return o }
const box = (w, h, d, m, x, y, z, par) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, par);
const cyl = (r1, r2, h, m, x, y, z, par, seg = 20) => mesh(new THREE.CylinderGeometry(r1, r2, h, seg), m, x, y, z, par);
const sph = (r, m, x, y, z, par, seg = 24) => mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg * .7 | 0)), m, x, y, z, par);
const cap = (r, l, m, x, y, z, par) => mesh(new THREE.CapsuleGeometry(r, l, 6, 14), m, x, y, z, par);
function texCanvas(w, h, draw) { const c = mk(w, h); draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.canvas = c; t.userData.draw = draw; return t }
function redraw(t, ...a) { const c = t.userData.canvas, x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height); t.userData.draw(x, c.width, c.height, ...a); t.needsUpdate = true }
function textPlane(txt, o = {}) {
  const fs = o.size || 120, font = `${o.weight || ''} ${fs}px ${o.font || 'Anton'}`;
  const m0 = mk(10, 10).getContext('2d'); m0.font = font; const tw = Math.ceil(m0.measureText(txt).width) + fs * .6, th = Math.ceil(fs * 1.5);
  const t = texCanvas(tw, th, (x, w, h) => { x.font = font; x.textAlign = 'center'; x.textBaseline = 'middle'; if (o.glow) { x.shadowColor = o.glow; x.shadowBlur = fs * .25 } x.fillStyle = o.color || '#fff'; x.fillText(txt, w / 2, h / 2 + fs * .05) });
  const sc = (o.h || 1) / th; const p = new THREE.Mesh(new THREE.PlaneGeometry(tw * sc, th * sc), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, toneMapped: false }));
  return p
}
function skyTex(stops) { return texCanvas(16, 512, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); stops.forEach(([o, c]) => g.addColorStop(o, c)); x.fillStyle = g; x.fillRect(0, 0, w, h) }) }
function palm(par, x, z, h = 6, lean = .15, seed = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); par.add(g); const trunk = M('#7a5a3a', { roughness: .95 });
  let px = 0, py = 0; for (let i = 0; i < 8; i++) { const s = cyl(.17 - i * .01, .2 - i * .01, h / 8 + .05, trunk, px, py + h / 16, 0, g, 8); px += lean * h / 8 * (i / 8); py += h / 8 }
  const fr = M('#2f7a3a', { roughness: .8, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + seed; const f = new THREE.Mesh(new THREE.ConeGeometry(.35, 3, 4, 1, true), fr); f.scale.set(1, 1, .18); f.position.set(px + Math.cos(a) * 1.2, py - .2, Math.sin(a) * 1.2); f.rotation.set(Math.sin(a) * 1.9, 0, -Math.cos(a) * 1.9); f.castShadow = true; g.add(f) }
  return g
}

// ---------- characters ----------
const SKIN = '#5b3a27';
function limb(par, r, l, m, x, y, z) { const piv = new THREE.Group(); piv.position.set(x, y, z); par.add(piv); const c = cap(r, l, m, 0, -l / 2 - r * .3, 0, piv); return piv }
function makePerson(o = {}) {
  const g = new THREE.Group(), skin = M(o.skin || SKIN, { roughness: .55 }), top = M(o.top || '#1b1b20', { roughness: .85 }), pants = M(o.pants || '#2c3a55', { roughness: .9 });
  const root = new THREE.Group(); g.add(root); root.position.y = 0;
  const hips = new THREE.Group(); hips.position.y = 1.2; root.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  cap(.27, .42, top, 0, .5, 0, torso).scale.set(1, 1, .66); cap(.12, .5, top, 0, .86, 0, torso).rotation.z = Math.PI / 2;
  if (o.hood !== false) { const hd = new THREE.Mesh(new THREE.TorusGeometry(.22, .1, 10, 20, Math.PI * 1.3), top); hd.position.set(0, 1.0, -.1); hd.rotation.set(-1.2, 0, Math.PI * -.15 + Math.PI); hd.castShadow = true; torso.add(hd) }
  const neck = cyl(.09, .1, .16, skin, 0, 1.03, 0, torso);
  const head = new THREE.Group(); head.position.set(0, 1.27, 0); torso.add(head);
  const hm = sph(.24, skin, 0, 0, 0, head, 32); hm.scale.set(.92, 1.08, .98);
  const dark = MB('#120a06'), white = MB('#f4efe8');
  for (const s of [-1, 1]) {
    sph(.035, white, s * .085, .03, .2, head, 12).scale.set(1.2, .8, .5); sph(.02, dark, s * .085, .03, .225, head, 10);
    box(.08, .018, .02, MB('#1a0f0a'), s * .085, .085, .215, head).rotation.z = -s * .12; sph(.04, skin, s * .225, 0, 0, head, 10).scale.set(.5, 1, .8)
  }
  sph(.04, skin, 0, -.03, .235, head, 12).scale.set(1, .8, .9); box(.09, .014, .02, MB('#3a1a12'), 0, -.11, .215, head);
  if (o.tattoo) { box(.04, .006, .01, dark, -.1, .15, .2, head).rotation.z = .4; box(.035, .006, .01, dark, .13, -.07, .2, head).rotation.z = -.5; box(.006, .05, .01, dark, 0, .17, .225, head) }
  // hair
  if (o.hair === 'dreads') {
    const ca = M(o.hairA || '#f4cf2a', { roughness: .8 }), cb = M(o.hairB || '#121212', { roughness: .8 });
    for (let i = 0; i < 120; i++) {
      const th = hash(i * 3.1) * TAU, ph = hash(i * 7.7) * 1.45, side = Math.sin(th) >= 0 ? 1 : -1; if (Math.cos(th) > .35 && ph > .75) continue;
      const len = (.07 + hash(i * 1.3) * .11) * (o.long ? 1.25 : 1), px = .25 * Math.sin(ph) * Math.sin(th), py = .25 * Math.cos(ph) + .03, pz = .25 * Math.sin(ph) * Math.cos(th) - .02;
      const dir = V3(px * 1.1, py + .1 + .05 * hash(i), pz).normalize();
      const d = cap(.028, len, (side > 0) === !o.flip ? ca : cb, px + dir.x * len * .5, py + dir.y * len * .5, pz + dir.z * len * .5, head);
      d.quaternion.setFromUnitVectors(V3(0, 1, 0), dir)
    }
    const capm = new THREE.Mesh(new THREE.SphereGeometry(.255, 24, 16, Math.PI / 2, Math.PI, 0, 1.05), ca); capm.position.y = .03; head.add(capm);
    const capb = new THREE.Mesh(new THREE.SphereGeometry(.255, 24, 16, -Math.PI / 2, Math.PI, 0, 1.05), cb); capb.position.y = .03; head.add(capb); capm.castShadow = capb.castShadow = true
  } else if (o.hair === 'short') { const hm2 = new THREE.Mesh(new THREE.SphereGeometry(.252, 24, 16, 0, TAU, 0, 1.25), M(o.hairColor || '#151010', { roughness: .95 })); hm2.position.y = .02; head.add(hm2) }
  else if (o.hair === 'bun') { const hc = M(o.hairColor || '#d8d2c8', { roughness: .9 }); const h2 = new THREE.Mesh(new THREE.SphereGeometry(.255, 24, 16, 0, TAU, 0, 1.4), hc); head.add(h2); sph(.11, hc, 0, .18, -.18, head, 14) }
  if (o.chain) { const ch = new THREE.Mesh(new THREE.TorusGeometry(.2, .018, 8, 32), M('#d8d8e0', { metalness: 1, roughness: .2 })); ch.position.set(0, .93, .08); ch.rotation.x = 1.25; torso.add(ch); sph(.04, M('#e8c050', { metalness: 1, roughness: .25 }), 0, .78, .25, torso, 12) }
  const arms = []; for (const s of [-1, 1]) { const ua = limb(torso, .095, .3, top, s * .36, .86, 0); const fa = limb(ua, .085, .28, top, 0, -.48, 0); sph(.085, skin, 0, -.45, 0, fa, 12); ua.rotation.z = s * .12; arms.push({ ua, fa }) }
  const legs = []; for (const s of [-1, 1]) { const th = limb(hips, .14, .38, pants, s * .17, 0, 0); const sh = limb(th, .12, .36, pants, 0, -.55, 0); box(.2, .12, .34, M(o.shoe || '#f2f2f2', { roughness: .6 }), 0, -.6, .07, sh); legs.push({ th, sh }) }
  g.userData = { root, hips, torso, head, arms, legs };
  if (o.mic) { const mic = new THREE.Group(); cyl(.03, .022, .24, M('#222', { metalness: .6, roughness: .3 }), 0, 0, 0, mic); sph(.05, M('#999', { metalness: .8, roughness: .35 }), 0, .14, 0, mic, 12); mic.position.set(0, -.5, .05); arms[1].fa.add(mic); g.userData.mic = mic }
  if (o.scale) g.scale.setScalar(o.scale);
  return g
}
// pose helpers
function pose(p, o) {
  const u = p.userData; const d = (v, k) => v[k] != null ? v[k] : 0;
  u.torso.rotation.set(d(o, 'tx'), d(o, 'ty'), d(o, 'tz')); u.head.rotation.set(d(o, 'hx'), d(o, 'hy'), d(o, 'hz')); u.hips.position.y = 1.2 + d(o, 'dy');
  const a = o.arms || [[0, 0, -.12, 0], [0, 0, .12, 0]]; u.arms.forEach((ar, i) => { ar.ua.rotation.set(a[i][0], a[i][1], a[i][2]); ar.fa.rotation.set(a[i][3], 0, 0) });
  const l = o.legs || [[0, 0], [0, 0]]; u.legs.forEach((lg, i) => { lg.th.rotation.set(l[i][0], 0, 0); lg.sh.rotation.set(l[i][1], 0, 0) })
}
const SIT = { dy: -.45, legs: [[-1.5, 1.5], [-1.5, 1.5]], arms: [[-.6, 0, -.1, -.9], [-.6, 0, .1, -.9]] };
const MICPOSE = (t, e = 1) => ({ ty: Math.sin(t * 1.3) * .15 * e, tx: .05 + Math.sin(t * 4.6) * .04 * e, hx: Math.sin(t * 4.6 + 1) * .08 * e, dy: -Math.abs(Math.sin(t * 2.3)) * .08 * e, arms: [[-.3 - Math.sin(t * 2.3) * .5 * e, 0, -.5, -.4], [-1.25, -.25, .2, -1.6]], legs: [[.12, .05], [-.12, .05]] });
// ---------- portrait of the subject (stylized) ----------
const makeJah = (o = {}) => makePerson(Object.assign({ hair: 'dreads', tattoo: true, chain: true, top: '#141418', pants: '#27324a', long: true }, o));
// ---------- film grain ----------
const GRAIN = mk(512, 512); { const g = GRAIN.getContext('2d'), id = g.createImageData(512, 512); for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 18 } g.putImageData(id, 0, 0) }
