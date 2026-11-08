// ===== XXX film: concert, memorial, map, albums =====
// ---------------- CONCERT ----------------
function ledTex() { return texCanvas(1024, 440, (x, w, h, txt = '17', t = 0, hue = 280) => {
  const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, `hsl(${hue},90%,${12 + 6 * Math.sin(t * 2)}%)`); g.addColorStop(1, `hsl(${hue + 60},90%,10%)`); x.fillStyle = g; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 14; i++) { x.fillStyle = `hsla(${hue + i * 12},100%,60%,${.12 + .1 * Math.sin(t * 3 + i)})`; x.fillRect(0, (i * 37 + t * 120) % h, w, 6) }
  let fs = h * .7; x.font = `${fs}px Anton`; while (x.measureText(txt).width > w * .86) { fs -= 8; x.font = `${fs}px Anton` } x.textAlign = 'center'; x.textBaseline = 'middle'; const jx = Math.sin(t * 23) * 6 * (Math.sin(t * 1.7) > .8 ? 1 : 0);
  x.fillStyle = 'rgba(255,40,80,.8)'; x.fillText(txt, w / 2 + jx + 6, h / 2); x.fillStyle = 'rgba(40,160,255,.8)'; x.fillText(txt, w / 2 - jx - 6, h / 2); x.fillStyle = '#fff'; x.fillText(txt, w / 2, h / 2);
  for (let i = 0; i < w; i += 4) { x.fillStyle = 'rgba(0,0,0,.25)'; x.fillRect(i, 0, 1, h) } }) }
def3('concert', (sc, cam) => {
  sc.background = new THREE.Color('#030208'); sc.fog = new THREE.FogExp2('#0a0614', .028);
  sc.add(new THREE.HemisphereLight('#6a5aff', '#0a0410', .7));
  const stage = box(18, 1.4, 9, M('#141418', { roughness: .5, metalness: .4 }), 0, .7, -4, sc);
  const lt = ledTex(); const led = mesh(new THREE.PlaneGeometry(16, 6.9), new THREE.MeshBasicMaterial({ map: lt, toneMapped: false })); led.position.set(0, 5.2, -8.4); sc.add(led);
  const tr = M('#9a9aa8', { metalness: .9, roughness: .3 }); for (const x of [-8.6, 8.6]) cyl(.12, .12, 10, tr, x, 5, -6, sc, 8); const tb = cyl(.12, .12, 17.2, tr, 0, 9.8, -6, sc, 8); tb.rotation.z = Math.PI / 2; const tb2 = cyl(.12, .12, 17.2, tr, 0, 9.8, -2, sc, 8); tb2.rotation.z = Math.PI / 2;
  for (const x of [-9.5, 9.5]) { box(2, 3.6, 1.6, M('#0a0a0c'), x, 3.2, -3, sc); for (let k = 0; k < 2; k++) { const c = cyl(.5, .5, .1, M('#222'), x, 2.4 + k * 1.6, -2.15, sc); c.rotation.x = Math.PI / 2 } }
  // moving heads
  const cols = ['#ff1a5a', '#3a5aff', '#b030ff', '#ff8a1a', '#2affd0', '#ff1a5a'], heads = [];
  cols.forEach((c, i) => { const x = -7.5 + i * 3; const sl = new THREE.SpotLight(c, 900, 45, .22, .4, 1.3); sl.position.set(x, 9.6, -4); sc.add(sl, sl.target);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(2.6, 16, 20, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); cone.geometry.translate(0, -8, 0); cone.position.copy(sl.position); sc.add(cone); heads.push({ sl, cone, i }) });
  const front = new THREE.SpotLight('#fff0e0', 700, 40, .18, .5); front.position.set(0, 12, 14); front.castShadow = true; sc.add(front, front.target); front.target.position.set(0, 2, -3);
  const j = makeJah({ mic: true }); j.position.set(0, 1.4, -2.5); sc.add(j);
  // crowd (instanced)
  const N = 520, bodyG = new THREE.CapsuleGeometry(.26, .7, 4, 8), headG = new THREE.SphereGeometry(.17, 10, 8), armG = new THREE.CapsuleGeometry(.07, .6, 3, 6);
  const bodies = new THREE.InstancedMesh(bodyG, M('#16141c', { roughness: .9 }), N), headsI = new THREE.InstancedMesh(headG, M('#3a2618', { roughness: .8 }), N), arms = new THREE.InstancedMesh(armG, M('#16141c'), N);
  const pos = []; for (let i = 0; i < N; i++) { const r = hash(i * 1.7); pos.push([(hash(i) - .5) * 30, 2 + hash(i + 5) * 22, hash(i + 2) * TAU, r < .35]) } sc.add(bodies, headsI, arms);
  const phones = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ map: DOT, color: '#e8f0ff', size: .12, transparent: true, opacity: .95, depthWrite: false })); sc.add(phones); const pp = new Float32Array(N * 3); phones.geometry.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const puff = texCanvas(64, 64, (x, w, h) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h) });
  const smoke = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ map: puff, color: '#8a6aff', size: 2.2, transparent: true, opacity: .06, depthWrite: false, blending: THREE.AdditiveBlending })); const sp = new Float32Array(300 * 3); for (let i = 0; i < 300; i++) { sp[i * 3] = (hash(i + 40) - .5) * 24; sp[i * 3 + 1] = hash(i + 41) * 6 + 1; sp[i * 3 + 2] = -7 + hash(i + 42) * 12 } smoke.geometry.setAttribute('position', new THREE.BufferAttribute(sp, 3)); sc.add(smoke);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s1 = V3(1, 1, 1);
  let lastLed = -1;
  return {
    exp: 1.45, update(lt, p, T) {
      const beat = T * 70 / 60, bpulse = Math.pow(1 - (beat % 1), 3), ch = p.chaos ? A(p.chaos, 1) : 0, en = p.energy ?? 1;
      heads.forEach(h => { const a = lt * .7 + h.i * 1.3; const tx = Math.sin(a) * 7 + (h.i - 2.5) * 1.2, tz = Math.cos(a * .8) * 6 + 6; h.sl.target.position.set(tx, 0, tz); const d = V3(tx, 0, tz).sub(h.sl.position).normalize(); h.cone.quaternion.setFromUnitVectors(V3(0, -1, 0), d); h.sl.intensity = 500 + 600 * bpulse * en; h.cone.material.opacity = .05 + .08 * bpulse * en });
      if (Math.floor(T * 12) !== lastLed) { lastLed = Math.floor(T * 12); redraw(lt, p.led || '17', T, p.hue ?? 280) }
      pose(j, MICPOSE(T, en)); j.position.x = Math.sin(lt * .4) * 1.5; j.rotation.y = Math.sin(lt * .5) * .4;
      for (let i = 0; i < N; i++) { const [x, z, ph, up] = pos[i]; const jy = Math.max(0, Math.sin(beat * Math.PI * 2 + ph)) * .18 * en + ch * Math.abs(Math.sin(T * 9 + ph)) * .3, jx = ch * Math.sin(T * 3 + ph) * .4;
        m4.compose(V3(x + jx, .7 + .35 + jy, z), q.identity(), s1); bodies.setMatrixAt(i, m4); m4.compose(V3(x + jx, 1.62 + jy, z), q, s1); headsI.setMatrixAt(i, m4);
        if (up) { e.set(0, 0, Math.sin(T * 2 + ph) * .3); q.setFromEuler(e); m4.compose(V3(x + jx + .2, 2.0 + jy + .1 * Math.sin(beat * TAU + ph), z), q, s1); q.identity() } else m4.compose(V3(x, -5, z), q, s1); arms.setMatrixAt(i, m4);
        pp[i * 3] = up && i % 3 === 0 ? x + jx + .2 : 0; pp[i * 3 + 1] = up && i % 3 === 0 ? 2.45 + jy : -9; pp[i * 3 + 2] = z }
      bodies.instanceMatrix.needsUpdate = headsI.instanceMatrix.needsUpdate = arms.instanceMatrix.needsUpdate = true; phones.geometry.attributes.position.needsUpdate = true; smoke.rotation.y = Math.sin(lt * .1) * .1;
      camPath(cam, lt, p.cam, [[0, [0, 4.2, 26], [0, 3.5, -4]], [16, [0, 3.2, 14], [0, 3, -4]]])
    }
  };
  function redraw(lt0, txt, T, hue) { lt.userData.draw(lt.userData.canvas.getContext('2d'), 1024, 440, txt, T, hue); lt.needsUpdate = true }
});
// ---------------- MEMORIAL ----------------
let PORTRAIT_RT = null;
function portraitTexture() { if (PORTRAIT_RT) return PORTRAIT_RT.texture; const s = get3('portrait'); PORTRAIT_RT = new THREE.WebGLRenderTarget(768, 1024); PORTRAIT_RT.texture.colorSpace = THREE.SRGBColorSpace;
  const c2 = new THREE.PerspectiveCamera(30, .75, .05, 100); SH = { t0: 0, t1: 1, T: 3, R: () => 0 }; s.update(3, { mode: 'bust' }, 3); c2.position.set(.3, 2.3, 2.6); c2.lookAt(0, 2.15, 0); RD.setRenderTarget(PORTRAIT_RT); RD.render(s.sc, c2); RD.setRenderTarget(null); return PORTRAIT_RT.texture }
def3('memorial', (sc, cam) => {
  sc.background = skyTex([[0, '#05050c'], [1, '#1a1020']]); sc.fog = new THREE.Fog('#0a0810', 10, 40);
  sc.add(new THREE.HemisphereLight('#4a5aaa', '#100a06', .25));
  const gr = mesh(new THREE.PlaneGeometry(80, 80), M('#2a2622', { roughness: .95 })); gr.rotation.x = -Math.PI / 2; sc.add(gr);
  box(16, 2.4, .4, M('#d8d0c4', { roughness: .9 }), 0, 1.2, -3, sc);
  const ez = new THREE.Group(); ez.position.set(0, 0, -2.2); sc.add(ez); box(1.9, 2.5, .12, M('#c9a24a', { metalness: .8, roughness: .3 }), 0, 2.35, 0, ez); const pm = mesh(new THREE.PlaneGeometry(1.65, 2.2), new THREE.MeshBasicMaterial({ map: portraitTexture(), toneMapped: false })); pm.position.set(0, 2.35, .07); ez.add(pm);
  const sgn = textPlane('LLJ', { size: 160, h: .7, font: 'Marker', color: '#ffffff' }); sgn.position.set(-3.2, 1.6, -2.75); sc.add(sgn); const sg2 = textPlane('R.I.P. X', { size: 160, h: .6, font: 'Marker', color: '#ffd23a' }); sg2.position.set(3.4, 1.7, -2.75); sc.add(sg2);
  const flames = [], lights = []; const wax = M('#f4ede0', { roughness: .6 }), fm = new THREE.MeshBasicMaterial({ color: '#ffb64a', toneMapped: false });
  for (let i = 0; i < 70; i++) { const x = (hash(i) - .5) * 9, z = -2.5 + hash(i + 1) * 2.4, hh = .15 + hash(i + 2) * .25; cyl(.05, .05, hh, wax, x, hh / 2, z, sc, 10); const f = sph(.035, fm, x, hh + .05, z, sc, 8); f.scale.y = 2; f.castShadow = false; flames.push(f) }
  for (let i = 0; i < 3; i++) { const l = new THREE.PointLight('#ff9a3a', 12, 10, 1.5); l.position.set(-3 + i * 3, .6, -1.4); sc.add(l); lights.push(l) }
  const fc = ['#ff3a5a', '#ffffff', '#ffd23a', '#c03aff', '#ff8ab0']; for (let i = 0; i < 90; i++) { const x = (hash(i + 50) - .5) * 12, z = -2.85 + hash(i + 51) * .6; sph(.09, M(fc[i % 5], { roughness: .7 }), x, .12 + hash(i + 52) * .3, z, sc, 8) }
  const ppl = []; for (let i = 0; i < 9; i++) { const pr = makePerson({ hair: i % 2 ? 'short' : 'dreads', hairA: '#1a1a1a', hairB: '#1a1a1a', top: ['#1a1a22', '#2a1a1a', '#14202a'][i % 3], skin: ['#5b3a27', '#c89a7a', '#3a2418', '#8a5a3a'][i % 4], hood: i % 2 === 0 }); const sd = i % 2 ? 1 : -1; pr.position.set(sd * (3.6 + (i >> 1) * .9), 0, -.6 + hash(i + 3) * 1.8); pr.rotation.y = Math.PI + sd * .5 + (hash(i + 4) - .5) * .3; sc.add(pr); ppl.push(pr) }
  return {
    exp: 1.3, update(lt, p) {
      flames.forEach((f, i) => { f.scale.set(1, 1.8 + Math.sin(lt * 12 + i * 3.1) * .4, 1) }); lights.forEach((l, i) => l.intensity = 10 + Math.sin(lt * 9 + i * 2) * 2 + Math.sin(lt * 23 + i) * 1.5);
      ppl.forEach((pr, i) => pose(pr, { hx: .25, arms: [[-.4, 0, -.1, -1.0], [-.6, 0, .1, -1.2]] }));
      camPath(cam, lt, p.cam, [[0, [0, 2.6, 9], [0, 1.9, -2]], [14, [0, 2.3, 5], [0, 2.1, -2]]])
    }
  }
});
// ---------------- FLORIDA MAP ----------------
const FLB = { lon0: -88, lon1: -79, lat0: 24, lat1: 31.5 }; const FLW = 32, FLH = 30;
const fl2xz = (lon, lat) => [(lon - FLB.lon0) / (FLB.lon1 - FLB.lon0) * FLW - FLW / 2, -((lat - FLB.lat0) / (FLB.lat1 - FLB.lat0) * FLH - FLH / 2)];
def3('map', (sc, cam) => {
  sc.background = new THREE.Color('#030812'); sc.fog = new THREE.Fog('#030812', 30, 80);
  sc.add(new THREE.HemisphereLight('#bcd8ff', '#0a0a14', .9)); const kl = new THREE.DirectionalLight('#ffffff', 1.2); kl.position.set(-5, 20, 10); sc.add(kl);
  const tx = texCanvas(2048, 1920, (x, w, h) => { const g = x.createRadialGradient(w * .7, h * .7, 50, w * .6, h * .6, w); g.addColorStop(0, '#0c3a6a'); g.addColorStop(1, '#03101e'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(80,180,255,.08)'; x.lineWidth = 2; for (let i = 0; i < w; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke() }
    const P = ([lo, la]) => [(lo - FLB.lon0) / (FLB.lon1 - FLB.lon0) * w, h - (la - FLB.lat0) / (FLB.lat1 - FLB.lat0) * h];
    x.beginPath(); window.FL.forEach(r => { r.forEach((pt, i) => { const [a, b] = P(pt); i ? x.lineTo(a, b) : x.moveTo(a, b) }); x.closePath() });
    const lg = x.createLinearGradient(0, 0, 0, h); lg.addColorStop(0, '#2a3a2e'); lg.addColorStop(1, '#3a5a3a'); x.fillStyle = lg; x.fill('evenodd');
    x.shadowColor = '#3ad8ff'; x.shadowBlur = 18; x.strokeStyle = '#7ae8ff'; x.lineWidth = 3; x.stroke(); x.shadowBlur = 0;
    x.font = '900 46px InterB'; x.fillStyle = 'rgba(255,255,255,.55)'; x.textAlign = 'center'; x.letterSpacing = '14px'; const [fx, fy] = P([-81.6, 28.3]); x.fillText('FLORIDA', fx, fy); x.font = '600 34px Inter'; x.fillStyle = 'rgba(150,210,255,.6)'; const [gx, gy] = P([-84.6, 26.4]); x.fillText('GULF OF MEXICO', gx, gy); const [ax, ay] = P([-79.6, 29.6]); x.save(); x.translate(ax, ay); x.rotate(-1.2); x.fillText('ATLANTIC OCEAN', 0, 0); x.restore() });
  tx.anisotropy = 16; const pl = mesh(new THREE.PlaneGeometry(FLW, FLH), new THREE.MeshStandardMaterial({ map: tx, roughness: .9 })); pl.rotation.x = -Math.PI / 2; sc.add(pl);
  const pins = {}; return {
    exp: 1.1, update(lt, p) {
      (p.pins || []).forEach(([name, lon, lat, at, col]) => { if (!pins[name]) { const g = new THREE.Group(); const [x, z] = fl2xz(lon, lat); g.position.set(x, 0, z); sc.add(g); const c = col || '#ffd23a';
        cyl(.03, .03, 1.2, MB(c), 0, .6, 0, g, 8); sph(.13, MB(c), 0, 1.25, 0, g, 16); const ring = new THREE.Mesh(new THREE.RingGeometry(.2, .3, 32), new THREE.MeshBasicMaterial({ color: c, transparent: true, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = .02; g.add(ring);
        const lab = textPlane(name, { size: 90, h: .55, font: 'InterB', weight: 800, color: '#fff', glow: 'rgba(0,0,0,.9)' }); lab.position.set(0, 1.75, 0); g.add(lab); pins[name] = { g, ring, lab } }
        const k = A(at, .6), pn = pins[name]; pn.g.scale.setScalar(Math.max(.001, eout(k))); pn.ring.scale.setScalar(1 + ((lt * .8) % 1) * 3); pn.ring.material.opacity = 1 - ((lt * .8) % 1); pn.lab.quaternion.copy(cam.quaternion) });
      Object.keys(pins).forEach(n => { if (!(p.pins || []).some(q => q[0] === n)) pins[n].g.scale.setScalar(.001) });
      camPath(cam, lt, p.cam, [[0, [0, 34, 18], [0, 0, -1]], [12, [10, 9, 12], [9.5, 0, 4]]])
    }
  }
});
// ---------------- ALBUMS ----------------
const ALBUMS = [['REVENGE', '2017', '#c01a2a'], ['17', '2017', '#f2f2f2'], ['?', '2018', '#1a1a1a'], ['SKINS', '2018', '#3a6aff'], ['BAD VIBES FOREVER', '2019', '#ffd23a']];
def3('albums', (sc, cam) => {
  sc.background = skyTex([[0, '#080610'], [1, '#18101e']]); sc.fog = new THREE.Fog('#0c0812', 10, 40);
  sc.add(new THREE.HemisphereLight('#a0a0ff', '#100810', .5)); const kl = new THREE.SpotLight('#fff', 1600, 40, .7, .6); kl.position.set(0, 10, 12); sc.add(kl); sc.add(new THREE.AmbientLight('#ffffff', .6));
  const floor = mesh(new THREE.PlaneGeometry(60, 60), M('#0c0a10', { roughness: .25, metalness: .6 })); floor.rotation.x = -Math.PI / 2; sc.add(floor);
  const recs = ALBUMS.map(([t, y, c], i) => { const g = new THREE.Group(); const a = (i - 2) * .55; g.position.set(Math.sin(a) * 9, 2.2, -Math.cos(a) * 9 + 6); g.lookAt(0, 2.2, 8); sc.add(g);
    const grooves = texCanvas(512, 512, (x, w, h) => { x.fillStyle = '#0a0a0a'; x.beginPath(); x.arc(256, 256, 256, 0, TAU); x.fill(); for (let r = 80; r < 250; r += 4) { x.strokeStyle = `rgba(255,255,255,${.04 + .03 * hash(r)})`; x.beginPath(); x.arc(256, 256, r, 0, TAU); x.stroke() }
      x.fillStyle = c; x.beginPath(); x.arc(256, 256, 78, 0, TAU); x.fill(); x.fillStyle = c === '#f2f2f2' || c === '#ffd23a' ? '#111' : '#fff'; x.textAlign = 'center'; x.font = `${t.length > 6 ? 22 : 54}px Anton`; x.fillText(t, 256, 262); x.font = '600 18px Inter'; x.fillText(y, 256, 296) });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, .04, 64), [M('#111'), new THREE.MeshStandardMaterial({ map: grooves, roughness: .3, metalness: .4 }), new THREE.MeshStandardMaterial({ map: grooves, roughness: .3, metalness: .4 })]); disc.rotation.x = Math.PI / 2; g.add(disc);
    const lab = textPlane(t + '  ·  ' + y, { size: 80, h: .45, font: 'InterB', weight: 800, color: '#fff' }); lab.position.set(0, -2.1, 0); g.add(lab); return { g, disc, base: g.position.clone() } });
  return {
    exp: 1.2, update(lt, p) {
      const f = p.focus; recs.forEach((r, i) => { r.disc.rotation.y = lt * (i === f ? 2.4 : .6); const on = f === i ? eout(A(p.focusAt ?? 0, 1)) : 0; r.g.position.copy(r.base).lerp(V3(0, 2.6, 4), on * .55); r.g.scale.setScalar(1 + on * .35) });
      camPath(cam, lt, p.cam, [[0, [0, 3, 16], [0, 2.4, 0]], [14, [0, 2.8, 12], [0, 2.4, 0]]])
    }
  }
});
