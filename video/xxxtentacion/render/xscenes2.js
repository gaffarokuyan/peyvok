// ===== XXX film: more 3D scenes =====
function makeCar(col = '#0c0c10', o = {}) {
  const g = new THREE.Group(), paint = M(col, { metalness: .8, roughness: .25 }), glass = M('#0a0e14', { metalness: .9, roughness: .1 });
  const L = o.suv ? 4.8 : 4.6, Hh = o.suv ? 1.1 : .75;
  box(L, Hh, 1.9, paint, 0, .45 + Hh / 2, 0, g); box(o.suv ? 3.4 : 2.5, o.suv ? .8 : .6, 1.75, glass, o.suv ? -.4 : -.2, .45 + Hh + (o.suv ? .4 : .3), 0, g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const w = cyl(.38, .38, .3, M('#111', { roughness: .9 }), sx * L * .32, .38, sz * .92, g, 18); w.rotation.x = Math.PI / 2 }
  for (const sz of [-.65, .65]) { box(.05, .14, .4, MB('#fffbe8'), L / 2 + .01, .45 + Hh * .6, sz, g); box(.05, .12, .45, MB('#ff2020'), -L / 2 - .01, .45 + Hh * .6, sz, g) }
  if (o.police) { const bar = new THREE.Group(); bar.position.set(-.2, .45 + Hh + .66, 0); g.add(bar); const r = box(.3, .12, .7, MB('#ff1530'), 0, 0, -.38, bar), b = box(.3, .12, .7, MB('#1550ff'), 0, 0, .38, bar); g.userData.bar = [r, b];
    box(L * .5, .3, 1.92, M('#f2f2f2', { metalness: .5, roughness: .3 }), .3, .45 + Hh * .55, 0, g) }
  return g
}
function lamp(par, x, z, h = 6, light = true) { const m = M('#2a2a30', { metalness: .6, roughness: .4 }); cyl(.08, .1, h, m, x, h / 2, z, par, 10); box(1.2, .12, .3, m, x + .5, h, z, par); box(.5, .06, .26, MB('#ffd9a0'), x + .9, h - .07, z, par);
  if (light) { const l = new THREE.PointLight('#ffb870', 40, 18, 1.6); l.position.set(x + .9, h - .4, z); par.add(l) } }
// ---------------- STREET (Deerfield Beach, dusk) ----------------
def3('street', (sc, cam) => {
  sc.background = skyTex([[0, '#1b1440'], [.45, '#6a2a5a'], [.75, '#e0603a'], [1, '#ffb070']]); sc.fog = new THREE.Fog('#5a2a48', 30, 120);
  stdLights(sc, { sky: '#ffb0a0', ground: '#30202a', hemi: 1.0, sun: '#ff9a60', sunI: 1.6, sunP: [-30, 10, -20], sh: 30 });
  const road = mesh(new THREE.PlaneGeometry(240, 14), M('#1d1d22', { roughness: .85 })); road.rotation.x = -Math.PI / 2; sc.add(road);
  for (let i = -30; i < 30; i++) box(2, .01, .15, MB('#e8d070'), i * 4, .01, 0, sc);
  const side = mesh(new THREE.PlaneGeometry(240, 40), M('#6a625a', { roughness: .95 })); side.rotation.x = -Math.PI / 2; side.position.set(0, -.01, -27); sc.add(side);
  const lot = mesh(new THREE.PlaneGeometry(30, 12), M('#2a2a30', { roughness: .9 })); lot.rotation.x = -Math.PI / 2; lot.position.set(-4, .005, -13); sc.add(lot);
  // dealership
  const bld = new THREE.Group(); bld.position.set(-4, 0, -24); sc.add(bld); box(24, 6.5, 9, M('#e9e4dc', { roughness: .8 }), 0, 3.25, 0, bld);
  const win = texCanvas(512, 128, (x, w, h) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#fff2d0'); g.addColorStop(1, '#ffc880'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(40,30,30,.55)'; for (let i = 0; i < 6; i++) { const cx = 40 + i * 80; x.beginPath(); x.arc(cx, 100, 14, 0, TAU); x.arc(cx + 44, 100, 14, 0, TAU); x.fill(); x.fillRect(cx, 78, 44, 10) } x.fillStyle = 'rgba(0,0,0,.35)'; for (let i = 0; i < 8; i++) x.fillRect(i * 64, 0, 4, h) });
  const wm = mesh(new THREE.PlaneGeometry(20, 4.2), new THREE.MeshBasicMaterial({ map: win, toneMapped: false })); wm.position.set(0, 2.4, 4.51); bld.add(wm);
  const sign = textPlane('MOTORSPORTS', { size: 140, h: 1.3, color: '#ff3a3a', glow: '#ff3a3a' }); sign.position.set(0, 7.2, 4.6); bld.add(sign);
  for (let i = 0; i < 6; i++) palm(sc, -26 + i * 10, -18 + (i % 2) * 2, 7 + hash(i) * 2, .2, i);
  for (let i = 0; i < 3; i++) palm(sc, -40 + i * 11, 12, 8, -.15, i + 9);
  lamp(sc, -14, -8); lamp(sc, 6, -8); lamp(sc, 26, -8, 6, false);
  const car = makeCar('#08080c'); sc.add(car); const suv = makeCar('#2c2e33', { suv: 1 }); sc.add(suv);
  const pol = [makeCar('#101826', { police: 1 }), makeCar('#101826', { police: 1 })]; pol[0].position.set(16, 0, 3.5); pol[1].position.set(-10, 0, 3.6); pol[1].rotation.y = Math.PI; pol.forEach(p => { p.visible = false; sc.add(p) });
  const pr = new THREE.PointLight('#ff2030', 0, 30, 1.4), pb = new THREE.PointLight('#2050ff', 0, 30, 1.4); pr.position.set(14, 2.5, 3); pb.position.set(-8, 2.5, 3); sc.add(pr, pb);
  return {
    exp: 1.35, update(lt, p) {
      // car leaves lot -> road
      const k = p.carGo == null ? 0 : A(p.carGo, 5); const path = t => t < .5 ? V3(lerp(-8, -2, t * 2), 0, lerp(-13, -4, t * 2)) : V3(lerp(-2, 6, (t - .5) * 2), 0, lerp(-4, -2.2, (t - .5) * 2));
      const k2 = eio(k); car.position.copy(path(k2 * .999)); const nx = path(Math.min(1, k2 + .01)); if (k > 0 && k < 1) car.lookAt(nx.x, 0, nx.z); car.rotation.y += Math.PI / 2 * (k > 0 ? 1 : 0); if (k <= 0) { car.rotation.y = Math.PI * .35 }
      if (k >= 1) { car.position.set(6, 0, -2.2); car.rotation.y = -0.22 }
      const ks = eout(A(p.suvGo, 2.2)); suv.position.set(lerp(40, 11.2, ks), 0, lerp(2.5, -1.4, ks)); suv.rotation.y = Math.PI + lerp(0, .5, ks); suv.visible = p.suvGo != null && ks > 0;
      const on = p.police != null && A(p.police, .1) > 0; pol.forEach(q => q.visible = on); const f = Math.sin(lt * 18) > 0; pr.intensity = on ? (f ? 260 : 20) : 0; pb.intensity = on ? (f ? 20 : 260) : 0;
      if (on) pol.forEach(q => { q.userData.bar[0].visible = f; q.userData.bar[1].visible = !f });
      camPath(cam, lt, p.cam, [[0, [18, 3.2, 12], [-2, 1.5, -10]], [14, [10, 2.6, 10], [0, 1.2, -6]]])
    }
  }
});
// ---------------- HOUSE (Plantation suburb) ----------------
def3('house', (sc, cam) => {
  sc.background = skyTex([[0, '#3a7ad8'], [.6, '#8cc0f0'], [1, '#ffd9a0']]); sc.fog = new THREE.Fog('#bcd4f0', 40, 140);
  stdLights(sc, { sun: '#ffe2b0', sunI: 3, sunP: [12, 16, 10], sh: 18, hemi: .9 });
  const lawn = mesh(new THREE.PlaneGeometry(200, 200), M('#5aa04a', { roughness: 1 })); lawn.rotation.x = -Math.PI / 2; sc.add(lawn);
  const road = mesh(new THREE.PlaneGeometry(200, 7), M('#3a3a3e')); road.rotation.x = -Math.PI / 2; road.position.set(0, .01, 10); sc.add(road);
  const walk = mesh(new THREE.PlaneGeometry(1.6, 8), M('#cfc6b6')); walk.rotation.x = -Math.PI / 2; walk.position.set(0, .015, 3); sc.add(walk);
  const hs = new THREE.Group(); hs.position.set(0, 0, -4); sc.add(hs); const wall = M('#f2e2c4', { roughness: .9 });
  box(10, 3.4, 7, wall, 0, 1.7, 0, hs); const roof = mesh(new THREE.ConeGeometry(7.6, 2.6, 4), M('#b8573a', { roughness: .8 }), 0, 4.7, 0, hs); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, .72);
  box(1.1, 2.2, .1, M('#6a3a22'), 0, 1.1, 3.52, hs); for (const x of [-3, 3]) { box(1.8, 1.2, .1, M('#9fd0ff', { emissive: '#2a4a6a', roughness: .1, metalness: .3 }), x, 1.9, 3.52, hs); box(2, .12, .2, MB('#ffffff'), x, 1.25, 3.56, hs) }
  for (let i = -12; i <= 12; i++) { if (Math.abs(i) < 1) continue; box(.12, .9, .12, M('#ffffff'), i * .6, .45, 6.5, sc) } box(14.4, .1, .1, M('#fff'), 0, .75, 6.5, sc);
  palm(sc, -7.5, 1, 7.5, .25, 2); palm(sc, 7, -1, 8.5, -.2, 5); palm(sc, -14, -6, 9, .1, 7); palm(sc, 15, -8, 7, .1, 3);
  box(.2, 1.1, .2, M('#555'), 3.5, .55, 7.2, sc); box(.5, .35, .7, M('#2a5a9a'), 3.5, 1.2, 7.2, sc);
  const gma = makePerson({ hair: 'bun', top: '#8a4a9a', pants: '#4a3a5a', shoe: '#ddd', hood: false }); gma.position.set(-1.2, 0, 3.2); sc.add(gma);
  const kid = makePerson({ hair: 'short', top: '#d23a3a', pants: '#2a3a6a', scale: .6, hood: false }); kid.position.set(.8, 0, 4.2); sc.add(kid);
  return {
    exp: 1.05, update(lt, p) {
      pose(gma, { hy: -.3, arms: [[0, 0, -.15, 0], [-.4, 0, .5, -.6]] }); gma.rotation.y = .5;
      const b = Math.abs(Math.sin(lt * 3)); pose(kid, { dy: b * .05, arms: [[Math.sin(lt * 3) * .6, 0, -.3, -.3], [-Math.sin(lt * 3) * .6, 0, .3, -.3]], legs: [[Math.sin(lt * 3) * .4, .1], [-Math.sin(lt * 3) * .4, .1]] }); kid.rotation.y = -.6;
      camPath(cam, lt, p.cam, [[0, [10, 3, 16], [0, 2, 0]], [12, [6, 2.4, 12], [0, 1.6, 2]]])
    }
  }
});
// ---------------- CHURCH (choir + piano) ----------------
def3('church', (sc, cam) => {
  sc.background = new THREE.Color('#1a120c');
  const room = mesh(new THREE.BoxGeometry(16, 9, 24), M('#7a5a40', { side: THREE.BackSide, roughness: .95 }), 0, 4.5, 0); room.receiveShadow = true; sc.add(room);
  sc.add(new THREE.HemisphereLight('#ffe0b0', '#3a2410', .7));
  const glass = texCanvas(256, 512, (x, w, h) => { const cs = ['#ff3a3a', '#3a6aff', '#ffd23a', '#3ad27a', '#b03aff']; for (let i = 0; i < 40; i++) { x.fillStyle = cs[i % 5]; x.beginPath(); x.moveTo(hash(i) * w, hash(i + 1) * h); x.lineTo(hash(i + 2) * w, hash(i + 3) * h); x.lineTo(hash(i + 4) * w, hash(i + 5) * h); x.fill() } x.strokeStyle = '#111'; x.lineWidth = 6; x.strokeRect(0, 0, w, h); x.beginPath(); x.moveTo(w / 2, 0); x.lineTo(w / 2, h); x.moveTo(0, h / 2); x.lineTo(w, h / 2); x.stroke() });
  const gw = mesh(new THREE.PlaneGeometry(3, 6), new THREE.MeshBasicMaterial({ map: glass, toneMapped: false })); gw.position.set(0, 4.6, -11.9); sc.add(gw);
  const sp = new THREE.SpotLight('#fff0d0', 400, 40, .5, .5); sp.position.set(0, 8, -11); sp.target.position.set(0, 0, 0); sp.castShadow = true; sc.add(sp, sp.target);
  const shaft = new THREE.Mesh(new THREE.ConeGeometry(3.5, 14, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe8c0', transparent: true, opacity: .07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); shaft.position.set(0, 3.5, -5); shaft.rotation.x = -1.0; sc.add(shaft);
  const wood = M('#5a3420', { roughness: .7 }); for (let r = 0; r < 6; r++) for (const sx of [-1, 1]) { box(5.5, .5, .5, wood, sx * 4, .5, 2 + r * 2, sc); box(5.5, 1.1, .12, wood, sx * 4, .9, 2.3 + r * 2, sc) }
  box(10, .6, 5, M('#6a4028'), 0, .3, -8, sc);
  const piano = new THREE.Group(); piano.position.set(-3.2, .6, -6.2); sc.add(piano); const pb = M('#0a0a0a', { roughness: .2, metalness: .3 });
  box(2.2, 1.3, .7, pb, 0, .65, 0, piano); box(2, .08, .35, MB('#f5f5f0'), 0, .85, .45, piano); for (let i = 0; i < 14; i++) if ([1, 2, 4, 5, 6].includes(i % 7)) box(.06, .05, .2, pb, -1 + i * .14 + .07, .91, .38, piano);
  const kid = makePerson({ hair: 'short', top: '#ffffff', pants: '#222', scale: .62, hood: false }); kid.position.set(-3.2, .6, -5.2); kid.rotation.y = Math.PI; sc.add(kid);
  const choir = []; for (let i = 0; i < 7; i++) { const c = makePerson({ hair: i % 3 ? 'short' : 'bun', hairColor: i % 3 ? '#151010' : '#2a2020', top: '#6a2a8a', pants: '#6a2a8a', skin: ['#5b3a27', '#7a4a30', '#4a2e20'][i % 3], hood: false }); c.position.set(-1 + i * .9, .6, -9.4); sc.add(c); choir.push(c) }
  return {
    exp: 1.15, update(lt, p) {
      pose(kid, Object.assign({}, SIT, { arms: [[-1.2, 0, -.15, -.2 + Math.sin(lt * 7) * .1], [-1.2, 0, .15, -.2 + Math.sin(lt * 7 + 2) * .1]], hx: .25 })); kid.position.y = .6 + .2;
      choir.forEach((c, i) => { pose(c, { tz: Math.sin(lt * 1.6 + i) * .05, hx: -.1, arms: [[-.5, 0, -.3, -1.4], [-.5, 0, .3, -1.4]] }) });
      camPath(cam, lt, p.cam, [[0, [4, 2.6, 6], [-1.5, 1.6, -7]], [12, [1, 2.2, 2], [-2.5, 1.4, -6]]])
    }
  }
});
// ---------------- CELL (juvenile detention) ----------------
def3('cell', (sc, cam) => {
  sc.background = new THREE.Color('#0c0d10');
  const room = mesh(new THREE.BoxGeometry(7, 3.6, 6), M('#8a8a84', { side: THREE.BackSide, roughness: .95 }), 0, 1.8, 0); sc.add(room);
  sc.add(new THREE.HemisphereLight('#a0b0c8', '#303030', .9)); const fill = new THREE.PointLight('#ffd8b0', 14, 8, 1.2); fill.position.set(1.8, 2.2, 3); sc.add(fill);
  const win = mesh(new THREE.PlaneGeometry(1.2, .5), MB('#e8f0ff')); win.position.set(1.2, 3, -2.99); sc.add(win);
  const sun = new THREE.SpotLight('#dfe8ff', 300, 20, .35, .4); sun.position.set(1.2, 4.5, -5); sun.target.position.set(-.5, 0, 1); sun.castShadow = true; sc.add(sun, sun.target);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(.5, 1.4, 5, 20, 1, true), new THREE.MeshBasicMaterial({ color: '#cfe0ff', transparent: true, opacity: .08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); shaft.position.set(.4, 1.6, -1.2); shaft.rotation.x = .6; shaft.rotation.z = .2; sc.add(shaft);
  const met = M('#4a4e55', { metalness: .7, roughness: .4 }); for (let i = 0; i < 12; i++) cyl(.035, .035, 3.6, met, 3.45, 1.8, -2.7 + i * .48, sc, 8); box(.1, .1, 6, met, 3.45, 3.5, 0, sc);
  box(3, .15, 1, met, -1.6, .55, -2.4, sc); box(3, .15, 1, met, -1.6, 2.1, -2.4, sc); box(2.8, .12, .9, M('#d8d0c0'), -1.6, .66, -2.4, sc);
  box(2.6, .45, .5, M('#9a9a92'), -.4, .22, 1.4, sc);
  const a = makePerson({ hair: 'short', top: '#d8701a', pants: '#d8701a', shoe: '#eee', hood: false, scale: .8 }), b = makePerson({ hair: 'short', top: '#d8701a', pants: '#d8701a', shoe: '#eee', hood: false, scale: .8, skin: '#6a442c' });
  a.position.set(-1.0, .1, 1.3); b.position.set(.2, .1, 1.3); a.rotation.y = .35; b.rotation.y = -.35; sc.add(a, b);
  const notes = []; for (let i = 0; i < 10; i++) { const n = textPlane(['♪', '♫'][i % 2], { size: 120, h: .35, color: '#ffd23a', glow: '#ffb000', font: 'Inter', weight: 600 }); n.visible = false; sc.add(n); notes.push(n) }
  const pad = box(.3, .02, .4, M('#f2efe2'), -.65, .78, 1.6, sc);
  return {
    exp: 1.1, update(lt, p) {
      pose(a, Object.assign({}, SIT, { dy: -.52, hy: .4, arms: [[-.9, 0, -.1, -1], [-.5, 0, .4, -1.2]] })); pose(b, Object.assign({}, SIT, { dy: -.52, hy: -.4 + Math.sin(lt * 4) * .05, hx: Math.sin(lt * 4) * .08, arms: [[-.5, 0, -.3, -1.6 + Math.sin(lt * 4) * .3], [-.6, 0, .3, -1]] }));
      const on = p.notes != null ? A(p.notes, .8) : 0; notes.forEach((n, i) => { const ph = (lt * .25 + i / 10) % 1; n.visible = on > 0; n.position.set(-.4 + Math.sin(i * 2.1 + lt) * .9, 1.6 + ph * 1.6, 1 + Math.cos(i) * .5); n.material.opacity = on * Math.sin(ph * Math.PI); n.lookAt(cam.position) });
      camPath(cam, lt, p.cam, [[0, [2.6, 1.6, 2.8], [-.6, 1.1, 1]], [12, [1.6, 1.3, 3.2], [-.3, 1.1, 1.2]]])
    }
  }
});
// ---------------- BEDROOM STUDIO ----------------
function waveTex(prog = .4, col = '#ff6a1a') {
  return texCanvas(640, 400, (x, w, h, pr = prog) => { x.fillStyle = '#121216'; x.fillRect(0, 0, w, h); x.fillStyle = '#1e1e26'; x.fillRect(0, 0, w, 54); x.fillStyle = col; x.beginPath(); x.arc(40, 27, 14, 0, TAU); x.fill(); x.fillStyle = '#ddd'; x.font = '800 22px InterB'; x.fillText('new_track_final.mp3', 64, 35);
    for (let i = 0; i < 120; i++) { const a = .25 + .7 * Math.abs(Math.sin(i * .37) * Math.cos(i * .11)) * (.5 + hash(i) * .5); x.fillStyle = i / 120 < pr ? col : '#5a5a66'; x.fillRect(20 + i * 5, 220 - a * 110, 3.4, a * 150) }
    x.fillStyle = '#aaa'; x.font = '600 20px Inter'; x.fillText('▶  ' + (Math.floor(pr * 1e6)).toLocaleString('en-US') + ' plays', 20, 370) })
}
def3('bedroom', (sc, cam) => {
  sc.background = new THREE.Color('#05040a');
  const room = mesh(new THREE.BoxGeometry(6, 3, 6), M('#2a1f3a', { side: THREE.BackSide, roughness: .9 }), 0, 1.5, 0); sc.add(room);
  sc.add(new THREE.HemisphereLight('#7050ff', '#100818', .35));
  const led1 = new THREE.PointLight('#ff2ad8', 25, 8, 1.5), led2 = new THREE.PointLight('#3a5aff', 25, 8, 1.5); led1.position.set(-2.4, 2.8, -2.4); led2.position.set(2.4, 2.8, -2.4); sc.add(led1, led2);
  box(6, .04, .04, MB('#ff3ae0'), 0, 2.95, -2.95, sc); box(.04, .04, 6, MB('#4a6aff'), -2.95, 2.95, 0, sc);
  const desk = M('#3a2a20', { roughness: .6 }); box(2.4, .08, 1, desk, .4, .9, -2.3, sc); for (const x of [-.7, 1.5]) box(.06, .9, .9, desk, x, .45, -2.3, sc);
  const lap = new THREE.Group(); lap.position.set(.5, .95, -2.35); sc.add(lap); box(.9, .03, .6, M('#888', { metalness: .8, roughness: .3 }), 0, 0, 0, lap);
  const wt = waveTex(.3); const scr = mesh(new THREE.PlaneGeometry(.88, .55), new THREE.MeshBasicMaterial({ map: wt, toneMapped: false })); scr.position.set(0, .3, -.3); scr.rotation.x = -.2; lap.add(scr);
  const sl = new THREE.PointLight('#ff8a40', 4, 3); sl.position.set(.5, 1.3, -1.9); sc.add(sl);
  const st = M('#222', { metalness: .7, roughness: .3 }); cyl(.015, .015, 1.5, st, -.4, .75 + .9, -2.0, sc, 8); const micg = new THREE.Group(); micg.position.set(-.4, 1.75, -1.85); sc.add(micg); cyl(.06, .05, .22, st, 0, 0, 0, micg); sph(.07, M('#bbb', { metalness: .8, roughness: .35 }), 0, .14, 0, micg);
  const pop = new THREE.Mesh(new THREE.CircleGeometry(.15, 24), new THREE.MeshStandardMaterial({ color: '#111', transparent: true, opacity: .55, side: THREE.DoubleSide })); pop.position.set(-.4, 1.85, -1.6); sc.add(pop);
  box(1.6, .45, 2.4, M('#3a3a5a'), -1.9, .25, .8, sc); box(1.6, .1, 2.4, M('#6a5a9a'), -1.9, .52, .8, sc);
  const post = texCanvas(300, 420, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2a0a3a'); g.addColorStop(1, '#ff3a6a'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.strokeStyle = '#fff'; x.lineWidth = 6; x.beginPath(); x.arc(w / 2, h / 2, 90, 0, TAU); x.stroke(); x.font = '120px Marker'; x.fillStyle = '#fff'; x.textAlign = 'center'; x.fillText('?', w / 2, h / 2 + 44) });
  for (const [px, ry] of [[-2.99, Math.PI / 2], [2.99, -Math.PI / 2]]) { const pp = mesh(new THREE.PlaneGeometry(.9, 1.26), new THREE.MeshBasicMaterial({ map: post })); pp.position.set(px, 1.9, -1); pp.rotation.y = ry; sc.add(pp) }
  const j = makeJah(); j.position.set(.2, 0, -1.4); j.rotation.y = Math.PI; sc.add(j); j.scale.setScalar(.78);
  const chair = new THREE.Group(); chair.position.set(.2, 0, -1.25); sc.add(chair); box(.6, .08, .6, M('#111'), 0, .55, 0, chair); box(.6, .7, .08, M('#111'), 0, .95, .3, chair); cyl(.03, .03, .5, st, 0, .28, 0, chair, 8);
  return {
    exp: 1.25, update(lt, p) {
      const bob = Math.sin(lt * 4.6); pose(j, Object.assign({}, SIT, { dy: -.58, hx: .12 + bob * .06, arms: [[-1.1, 0, -.15, -.5], [-1.1, 0, .15, -.5]] }));
      if (Math.floor(lt * 5) !== wt.userData.last) { wt.userData.last = Math.floor(lt * 5); redraw(wt, clamp((p.prog0 ?? .1) + lt * (p.progRate ?? .03))) }
      camPath(cam, lt, p.cam, [[0, [2.2, 1.7, 1.6], [.2, 1.1, -2]], [12, [1.4, 1.4, .4], [.3, 1.1, -2.2]]])
    }
  }
});
// ---------------- PHONES (viral spread) ----------------
def3('phones', (sc, cam) => {
  sc.background = skyTex([[0, '#0a0614'], [1, '#1a0a1a']]); sc.fog = new THREE.Fog('#0a0614', 6, 30);
  sc.add(new THREE.HemisphereLight('#ffffff', '#202020', .6)); const kl = new THREE.DirectionalLight('#ffd0b0', 1.5); kl.position.set(3, 5, 6); sc.add(kl);
  const on = new THREE.MeshBasicMaterial({ map: waveTex(.65), toneMapped: false }), off = MB('#0a0a0e'), body = M('#1a1a20', { metalness: .6, roughness: .3 });
  const ph = []; for (let i = 0; i < 160; i++) { const g = new THREE.Group(); const r = Math.sqrt(hash(i) * 1) * 9, a = hash(i + 7) * TAU; g.position.set(Math.cos(a) * r * 1.5, Math.sin(a) * r * .8 + 2, -hash(i + 3) * 26); g.rotation.set((hash(i + 1) - .5) * .5, (hash(i + 2) - .5) * .8, (hash(i + 4) - .5) * .4);
    box(.62, 1.22, .06, body, 0, 0, 0, g); const s = mesh(new THREE.PlaneGeometry(.56, 1.12), off); s.position.z = .032; g.add(s); sc.add(g); ph.push({ g, s, d: Math.hypot(g.position.x, g.position.y - 2, g.position.z * .3) }) }
  return {
    exp: 1.2, update(lt, p) {
      const R = (lt - (p.at0 || 0)) * (p.rate || 2.2); ph.forEach((q, i) => { q.s.material = q.d < R ? on : off; q.g.rotation.y += .002; q.g.position.y += Math.sin(lt + i) * .0008 });
      camPath(cam, lt, p.cam, [[0, [0, 2, 10], [0, 2, 0]], [14, [1.5, 2.3, 2], [0, 2, -12]]])
    }
  }
});
// ---------------- CHART ----------------
def3('chart', (sc, cam) => {
  sc.background = skyTex([[0, '#06040c'], [1, '#160a24']]); sc.fog = new THREE.Fog('#0a0612', 14, 50);
  sc.add(new THREE.HemisphereLight('#9a8aff', '#100810', .5)); const kl = new THREE.SpotLight('#fff0d0', 500, 40, .6, .6); kl.position.set(0, 14, 10); kl.castShadow = true; sc.add(kl);
  const grid = new THREE.GridHelper(80, 80, '#5a2a8a', '#2a1440'); sc.add(grid);
  const bars = []; const gold = M('#ffc63a', { metalness: .9, roughness: .25, emissive: '#5a3a00' }), grey = M('#3a3448', { metalness: .3, roughness: .6 });
  for (let i = 0; i < 9; i++) { const x = (i - 4) * 2.2, hgt = 1.5 + (4 - Math.abs(i - 4)) * .5 + hash(i) * .8; const b = box(1.4, 1, 1.4, i === 4 ? gold : grey, x, .5, 0, sc); b.userData = { h: hgt }; bars.push(b) }
  const lab = textPlane('#1', { size: 200, h: 2.4, color: '#ffe08a', glow: '#ffb000' }); sc.add(lab);
  const title = textPlane(' ', { size: 110, h: 1.1, color: '#fff' }); sc.add(title); const chart = textPlane(' ', { size: 90, h: .7, color: '#c8b8ff' }); sc.add(chart);
  let cur = '';
  return {
    exp: 1.15, update(lt, p) {
      const key = (p.rank || '#1') + '|' + (p.title || '') + '|' + (p.chart || ''); if (key !== cur) { cur = key; [[lab, p.rank || '#1', 200, 2.4, '#ffe08a', '#ffb000'], [title, p.title || ' ', 110, 1.1, '#fff'], [chart, p.chart || ' ', 90, .7, '#c8b8ff']].forEach(([m, t, s, h, c, gl]) => { const n = textPlane(t, { size: s, h, color: c, glow: gl }); m.geometry.dispose(); m.geometry = n.geometry; m.material = n.material }) }
      const g = eout(A(p.grow ?? 0, 2.5)); bars.forEach((b, i) => { const hh = i === 4 ? lerp(1, p.top || 9, g) : b.userData.h; b.scale.y = hh; b.position.y = hh / 2 });
      lab.position.set(0, (lerp(1, p.top || 9, g)) + 1.6, 0); lab.material.opacity = g; title.visible = chart.visible = false;
      camPath(cam, lt, p.cam, [[0, [9, 5, 24], [0, 5, 0]], [10, [-4, 7, 19], [0, 6, 0]]])
    }
  }
});
// ---------------- COURT ----------------
def3('court', (sc, cam) => {
  sc.background = new THREE.Color('#120c08');
  const room = mesh(new THREE.BoxGeometry(18, 8, 18), M('#4a3020', { side: THREE.BackSide, roughness: .8 }), 0, 4, 0); sc.add(room);
  sc.add(new THREE.HemisphereLight('#ffe8c8', '#2a1a10', .55)); const kl = new THREE.SpotLight('#ffe8c8', 600, 40, .55, .5); kl.position.set(3, 7.5, 6); kl.castShadow = true; sc.add(kl);
  const wood = M('#6a3a1a', { roughness: .45 }); box(8, 2.6, 2, wood, 0, 1.3, -6, sc); box(8.4, .2, 2.3, wood, 0, 2.7, -6, sc); box(3, 3.5, .4, M('#2a1a10'), 0, 3.8, -8.6, sc);
  const seal = texCanvas(512, 512, (x, w, h) => { x.fillStyle = '#c9a24a'; x.beginPath(); x.arc(256, 256, 250, 0, TAU); x.fill(); x.fillStyle = '#5a3a10'; x.beginPath(); x.arc(256, 256, 200, 0, TAU); x.fill(); x.fillStyle = '#e8c870'; x.font = '900 46px InterB'; x.textAlign = 'center'; x.fillText('STATE OF FLORIDA', 256, 140); x.font = '160px Anton'; x.fillText('⚖', 256, 330) });
  const sm = mesh(new THREE.CircleGeometry(1.3, 48), new THREE.MeshBasicMaterial({ map: seal })); sm.position.set(0, 5.6, -8.95); sc.add(sm);
  const flag = texCanvas(390, 260, (x, w, h) => { for (let i = 0; i < 13; i++) { x.fillStyle = i % 2 ? '#fff' : '#b22234'; x.fillRect(0, i * h / 13, w, h / 13 + 1) } x.fillStyle = '#3c3b6e'; x.fillRect(0, 0, w * .4, h * 7 / 13) });
  const fl = mesh(new THREE.PlaneGeometry(2.1, 1.4), new THREE.MeshStandardMaterial({ map: flag, side: THREE.DoubleSide })); fl.position.set(5.4, 4.6, -8); sc.add(fl); cyl(.05, .05, 5.5, M('#c9a24a', { metalness: 1, roughness: .3 }), 4.3, 2.75, -8, sc);
  const gm = M('#d8b050', { metalness: 1, roughness: .25 }); const sca = new THREE.Group(); sca.position.set(-2.4, 2.8, -5.6); sc.add(sca); cyl(.04, .06, 1.2, gm, 0, .6, 0, sca); const beam = box(1.4, .05, .05, gm, 0, 1.2, 0, sca);
  for (const s of [-1, 1]) { const pan = cyl(.28, .2, .06, gm, s * .65, .75, 0, sca); }
  const gav = new THREE.Group(); gav.position.set(1.8, 2.85, -5.4); sc.add(gav); const gh = new THREE.Group(); gav.add(gh); cyl(.03, .03, .7, wood, .35, 0, 0, gh).rotation.z = Math.PI / 2; const hd = cyl(.11, .11, .32, wood, 0, 0, 0, gh); hd.rotation.x = Math.PI / 2; cyl(.2, .2, .06, wood, 0, -.12, 0, gav);
  const table = box(4, .1, 1.6, wood, 0, 1.2, 1, sc); const paper = box(.8, .01, 1.1, M('#f4f0e6'), 0, 1.26, 1, sc); paper.rotation.y = .1;
  const stamp = textPlane('PENDING', { size: 140, h: .32, color: '#d01818' }); stamp.rotation.x = -Math.PI / 2; stamp.position.set(0, 1.28, 1.05); stamp.rotation.z = .25; sc.add(stamp); let cur = '';
  return {
    exp: 1.1, update(lt, p) {
      if ((p.stamp || 'PENDING') !== cur) { cur = p.stamp || 'PENDING'; const n = textPlane(cur, { size: 140, h: .3, color: '#d01818' }); stamp.geometry = n.geometry; stamp.material = n.material }
      stamp.material.opacity = p.stampAt != null ? A(p.stampAt, .15) : 1; stamp.scale.setScalar(p.stampAt != null ? lerp(1.8, 1, A(p.stampAt, .15)) : 1);
      const gt = p.gavel != null ? SH.T - SH.R(p.gavel) : -1; gh.rotation.z = gt > 0 && gt < .5 ? Math.sin(gt / .5 * Math.PI) * .9 : 0;
      beam.rotation.z = Math.sin(lt * .8) * .06;
      camPath(cam, lt, p.cam, [[0, [5, 3.2, 8], [0, 2.4, -4]], [12, [2, 2.4, 4], [-.5, 1.8, -2]]])
    }
  }
});
