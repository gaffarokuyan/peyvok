// ================= 3D SCENES (three.js, WebGL) — composited into the 2D film canvas =================
const G3 = (() => {
  const cvs = document.createElement('canvas'); cvs.width = W; cvs.height = H;
  const rd = new THREE.WebGLRenderer({ canvas: cvs, antialias: true, preserveDrawingBuffer: true, alpha: false });
  rd.setSize(W, H, false); rd.setPixelRatio(1); rd.outputColorSpace = THREE.SRGBColorSpace; rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.05;
  rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap;
  return { cvs, rd };
})();
function skyTex(c1, c2, c3) { const c = mk(16, 512), x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, c1); g.addColorStop(.6, c2); g.addColorStop(1, c3); x.fillStyle = g; x.fillRect(0, 0, 16, 512); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t }
function canvasTex(w, h, draw, rep) { const c = mk(w, h), x = c.getContext('2d'); draw(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep) } return t }
function lerpKeys(keys, T, n) { const K = keys.map(k => [R(k[0]), ...k.slice(1)]); let i = 0; while (i < K.length - 2 && T > K[i + 1][0]) i++; if (K.length === 1) return K[0].slice(1);
  const a = K[i], b = K[i + 1], f = eio(clamp((T - a[0]) / Math.max(.01, b[0] - a[0]))); return a.slice(1).map((v, j) => lerp(v, b[j + 1], f)) }
function project3(v, cam) { const p = v.clone().project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H, p.z] }
// ---------- TERRAIN ----------
const TER = (() => {
  const B = window.ZAGROS_B; const N = 256 * 256; const gx = lon => (lon + 180) / 360 * N; const gy = lat => { const r = lat * Math.PI / 180; return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * N };
  const PW = 400, PD = PW * (gy(B.lat1) - gy(B.lat0)) / (gx(B.lon1) - gx(B.lon0)), HS = 13;
  const toXZ = (lon, lat) => [(gx(lon) - gx(B.lon0)) / (gx(B.lon1) - gx(B.lon0)) * PW - PW / 2, (gy(lat) - gy(B.lat0)) / (gy(B.lat1) - gy(B.lat0)) * PD - PD / 2];
  let hd = null; const hAt = (x, z) => { if (!hd) return 0; const u = clamp((x + PW / 2) / PW), v = clamp((z + PD / 2) / PD); const i = Math.min(1023, Math.floor(v * 1023)) * 1024 + Math.min(1023, Math.floor(u * 1023)); return hd[i * 4] / 255 * HS };
  let scene = null, cam = null, sun = null;
  function build() {
    const hc = mk(1024, 1024), hx = hc.getContext('2d'); hx.drawImage(window.ZHEIGHT, 0, 0, 1024, 1024); hd = hx.getImageData(0, 0, 1024, 1024).data;
    scene = new THREE.Scene(); scene.background = skyTex('#4f9de0', '#a8d4f2', '#d6e8f2'); scene.fog = new THREE.Fog(0xbcdcf2, 150, 420);
    const geo = new THREE.PlaneGeometry(PW, PD, 400, Math.round(400 * PD / PW)); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position; for (let i = 0; i < pos.count; i++) pos.setY(i, hAt(pos.getX(i), pos.getZ(i))); geo.computeVertexNormals();
    const col = new THREE.Texture(window.ZCOLOR); col.needsUpdate = true; col.colorSpace = THREE.SRGBColorSpace; col.anisotropy = 8;
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: col, roughness: .95, metalness: 0 })); mesh.receiveShadow = true; mesh.castShadow = true; scene.add(mesh);

    scene.add(new THREE.HemisphereLight(0xdff0ff, 0x8a6a40, .9)); sun = new THREE.DirectionalLight(0xfff0d0, 2.4); sun.position.set(-160, 140, -60); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -260, right: 260, top: 260, bottom: -260, near: 1, far: 800 }); scene.add(sun);
    cam = new THREE.PerspectiveCamera(42, W / H, .5, 2000) }
  function draw(T, p) { if (!scene) build(); const [lon, lat, alt, llon, llat] = lerpKeys(p.cam, T); const [x, z] = toXZ(lon, lat); const [lx, lz] = toXZ(llon, llat);
    cam.position.set(x, Math.max(alt, hAt(x, z) + 4), z); cam.lookAt(lx, hAt(lx, lz), lz); G3.rd.render(scene, cam); X.drawImage(G3.cvs, 0, 0);
    // warm grade + vignette in 2D
    X.save(); X.globalCompositeOperation = 'soft-light'; X.fillStyle = 'rgba(255,190,110,.25)'; X.fillRect(0, 0, W, H); X.restore();
    (p.pins || []).forEach(([q, lon2, lat2, name, sub]) => { const a = q == null ? ss(SH.t0 + .3, SH.t0 + .9, T) : A(q, .4); if (a <= 0) return; const [px, pz] = toXZ(lon2, lat2); const v = new THREE.Vector3(px, hAt(px, pz) + .3, pz); const [sx, sy, sz] = project3(v, cam); if (sz > 1) return;
      X.save(); X.globalAlpha = a; X.strokeStyle = '#fff'; X.lineWidth = 3; X.beginPath(); X.moveTo(sx, sy); X.lineTo(sx, sy - 70); X.stroke(); X.fillStyle = '#d2322a'; X.beginPath(); X.arc(sx, sy, 8, 0, TAU); X.fill(); X.strokeStyle = '#fff'; X.lineWidth = 3; X.stroke(); X.restore();
      labelBoxB(sx, sy - 110, name, sub || '', '', a, '#ffb23a', clamp((T - (q == null ? SH.t0 : R(q))) / .5), .9) });
    (p.text || []).forEach(([q, txt, end, size]) => { let a = A(q, .4); if (end != null) a *= 1 - A(end, .4); if (a <= 0) return; X.save(); X.globalAlpha = a; X.translate(W / 2, H * .2); goldHeadB(txt, 0, 0, fitTxt(txt, '900 {s}px CinzelH', 1600, size || 120)); X.restore() });
    (p.badges || []).forEach(([q, big, small]) => { const a = A(q, .4); if (a <= 0) return; X.save(); X.globalAlpha = a; X.translate(W / 2, H - 250); X.fillStyle = 'rgba(170,20,24,.93)'; X.beginPath(); X.roundRect(-380, -70, 760, 140, 20); X.fill(); X.strokeStyle = '#ffd27a'; X.lineWidth = 3; X.stroke();
      X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '900 60px CinzelH'; X.fillStyle = goldGrad(X, -50, 10); X.fillText(big, 0, -14); X.font = '800 28px InterB'; X.fillStyle = '#fff'; X.fillText(small, 0, 40); X.restore() }) }
  return { draw };
})();
function s3dTerrain(T, p) { TER.draw(T, p) }
// ---------- ZIGGURAT ----------
const ZIG = (() => {
  let scene, cam;
  function brick(c1, c2) { return canvasTex(512, 512, (x, w, h) => { x.fillStyle = c1; x.fillRect(0, 0, w, h); for (let r = 0; r < 32; r++) for (let c = 0; c < 16; c++) { const o = r % 2 ? 16 : 0; x.fillStyle = `rgba(${120 + hash(r * 31 + c) * 60 | 0},${70 + hash(r * 7 + c) * 40 | 0},${30 + hash(r + c * 9) * 20 | 0},.35)`; x.fillRect(c * 32 + o, r * 16, 30, 14) }
    x.strokeStyle = c2; x.lineWidth = 2; for (let r = 0; r <= 32; r++) { x.beginPath(); x.moveTo(0, r * 16); x.lineTo(w, r * 16); x.stroke() } }, [4, 2]) }
  function build() { scene = new THREE.Scene(); scene.background = skyTex('#4f9de0', '#bfe2f6', '#ffe6b8'); scene.fog = new THREE.Fog(0xf2e2c4, 120, 420);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200), new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#d9b878'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(150,110,60,${hash(i) * .25})`; x.fillRect(hash(i + 1) * w, hash(i + 2) * h, 2, 2) } }, [60, 60]), roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    const mat = new THREE.MeshStandardMaterial({ map: brick('#d8a060', 'rgba(90,50,20,.45)'), roughness: .9 });
    [[60, 12], [46, 11], [34, 10], [22, 9]].reduce((y, [s, h]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(s, h, s * .8), mat); m.position.y = y + h / 2; m.castShadow = m.receiveShadow = true; scene.add(m); return y + h }, 0);
    const shrine = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 10), new THREE.MeshStandardMaterial({ color: 0x2a6fd0, roughness: .5 })); shrine.position.y = 42 + 3.5; shrine.castShadow = true; scene.add(shrine);
    { const st = new THREE.Mesh(new THREE.BoxGeometry(7, 1.6, 28.6), mat); st.position.set(0, 6, 37.5); st.rotation.x = .43; st.castShadow = true; scene.add(st) }
    const palmM = new THREE.MeshStandardMaterial({ color: 0x7a4a22 }), leafM = new THREE.MeshStandardMaterial({ color: 0x3f9a3a, side: THREE.DoubleSide });
    for (let i = 0; i < 22; i++) { const a = hash(i) * TAU, r = 70 + hash(i + 3) * 80; const g = new THREE.Group(); const tr = new THREE.Mesh(new THREE.CylinderGeometry(.6, .9, 14, 6), palmM); tr.position.y = 7; g.add(tr);
      for (let k = 0; k < 7; k++) { const lf = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.2), leafM); lf.position.set(Math.cos(k) * 3.5, 14, Math.sin(k) * 3.5); lf.rotation.set(-.5, -k, .3); g.add(lf) } g.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); g.traverse(o => o.castShadow = true); scene.add(g) }
    const river = new THREE.Mesh(new THREE.PlaneGeometry(1200, 26), new THREE.MeshStandardMaterial({ color: 0x3aa8e0, roughness: .2 })); river.rotation.x = -Math.PI / 2; river.position.set(0, .05, -110); scene.add(river);
    scene.add(new THREE.HemisphereLight(0xe8f4ff, 0x9a7a4a, .8)); const sun = new THREE.DirectionalLight(0xfff0d0, 2.6); sun.position.set(80, 120, 60); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -120, right: 120, top: 120, bottom: -120, near: 1, far: 500 }); scene.add(sun); cam = new THREE.PerspectiveCamera(40, W / H, .5, 2000) }
  return { draw(T, p) { if (!scene) build(); const lt = T - SH.t0; const a = .9 + lt * .09, r = 150 - lt * 3.2; cam.position.set(Math.sin(a) * r, 34 + lt * 1.2, Math.cos(a) * r); cam.lookAt(0, 22, 0); G3.rd.render(scene, cam); X.drawImage(G3.cvs, 0, 0);
    labelBoxB(W * .78, H * .2, 'DUR-KURİGALZU', 'Kassit başkenti', 'ZİGGURAT · BAĞDAT YAKINI', ss(.4, .8, lt), '#ffb23a', clamp((lt - .4) / .5));
    if (p.badge) { const q = A(p.badge[0], .5); if (q > 0) { X.save(); X.globalAlpha = q; X.translate(W / 2, H - 230); X.fillStyle = 'rgba(170,20,24,.93)'; X.beginPath(); X.roundRect(-380, -62, 760, 124, 20); X.fill(); X.strokeStyle = '#ffd27a'; X.lineWidth = 3; X.stroke(); X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '900 54px CinzelH'; X.fillStyle = goldGrad(X, -40, 10); X.fillText(p.badge[1], 0, -12); X.font = '800 26px InterB'; X.fillStyle = '#fff'; X.fillText(p.badge[2], 0, 36); X.restore() } } } };
})();
function s3dZiggurat(T, p) { ZIG.draw(T, p) }
// ---------- STONE (kudurru / stele) ----------
function stoneScene(kind) {
  let scene, cam, obj;
  function faceTex() { return canvasTex(1024, 2048, (x, w, h) => {
    const dark = kind === 'stele'; x.fillStyle = dark ? '#1e2126' : '#6e665e'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 4000; i++) { x.fillStyle = `rgba(${dark ? 255 : 0},${dark ? 255 : 0},${dark ? 255 : 0},${hash(i) * .05})`; x.fillRect(hash(i + 1) * w, hash(i + 2) * h, 3, 3) }
    const ink = dark ? 'rgba(150,160,172,.8)' : 'rgba(235,222,190,.9)'; x.fillStyle = ink; x.strokeStyle = ink; x.lineWidth = 10; x.lineCap = 'round';
    if (kind === 'stele') { // relief at top: seated Shamash + Hammurabi
      x.fillStyle = 'rgba(110,118,128,.9)'; x.beginPath(); x.arc(600, 260, 60, 0, TAU); x.fill(); x.fillRect(540, 320, 140, 260); x.fillRect(500, 580, 220, 40); x.beginPath(); x.arc(360, 270, 50, 0, TAU); x.fill(); x.fillRect(315, 320, 90, 300);
      x.fillStyle = ink; for (let r = 0; r < 40; r++) for (let c = 0; c < 16; c++) { if (hash(r * 7 + c * 3) < .12) continue; const xx = 120 + c * 52, yy = 720 + r * 32; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 22, yy + 7); x.lineTo(xx, yy + 14); x.fill(); x.fillRect(xx + 8, yy + 5, 22, 4) } }
    else { // kudurru: registers of divine symbols + cuneiform
      const reg = (y, items) => { x.strokeStyle = ink; x.lineWidth = 4; x.beginPath(); x.moveTo(60, y + 150); x.lineTo(w - 60, y + 150); x.stroke(); items.forEach((f, i) => { x.save(); x.translate(w * (i + 1) / (items.length + 1), y + 70); x.lineWidth = 10; f(x); x.restore() }) };
      const star = x2 => { x2.beginPath(); for (let j = 0; j < 16; j++) { const r = j % 2 ? 16 : 50, an = j * Math.PI / 8; x2.lineTo(Math.cos(an) * r, Math.sin(an) * r) } x2.closePath(); x2.fill() };
      const moon = x2 => { x2.beginPath(); x2.arc(0, 0, 44, .3, Math.PI - .3); x2.stroke(); x2.beginPath(); x2.arc(0, -6, 30, 0, TAU); x2.stroke() };
      const sunS = x2 => { x2.beginPath(); x2.arc(0, 0, 22, 0, TAU); x2.fill(); for (let j = 0; j < 8; j++) { const an = j * Math.PI / 4; x2.beginPath(); x2.moveTo(Math.cos(an) * 30, Math.sin(an) * 30); x2.lineTo(Math.cos(an) * 54, Math.sin(an) * 54); x2.stroke() } };
      const spade = x2 => { x2.beginPath(); x2.moveTo(0, 60); x2.lineTo(0, -20); x2.stroke(); x2.beginPath(); x2.moveTo(-20, -20); x2.lineTo(0, -60); x2.lineTo(20, -20); x2.closePath(); x2.fill() };
      const horse = x2 => { x2.beginPath(); x2.moveTo(-30, 60); x2.quadraticCurveTo(-38, 0, -8, -16); x2.quadraticCurveTo(20, -36, 44, -10); x2.quadraticCurveTo(46, 6, 28, 8); x2.quadraticCurveTo(12, 10, 6, 24); x2.quadraticCurveTo(12, 46, 18, 60); x2.closePath(); x2.fill() };
      const stylus = x2 => { x2.beginPath(); x2.moveTo(-12, 60); x2.lineTo(-12, -50); x2.moveTo(12, 60); x2.lineTo(12, -50); x2.stroke() };
      const snake = x2 => { x2.beginPath(); for (let j = 0; j <= 40; j++) { const t = j / 40; x2.lineTo(lerp(-300, 300, t), Math.sin(t * 11) * 26) } x2.stroke() };
      reg(80, [star, moon, sunS]); reg(260, [spade, stylus, horse]); reg(440, [snake]);
      for (let r = 0; r < 34; r++) for (let c = 0; c < 15; c++) { if (hash(r * 13 + c) < .15) continue; const xx = 110 + c * 54, yy = 700 + r * 38; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + 22, yy + 7); x.lineTo(xx, yy + 14); x.fill(); x.fillRect(xx + 8, yy + 5, 22, 4) } } }) }
  function build() { scene = new THREE.Scene(); scene.background = kind === 'stele' ? skyTex('#e8eef4', '#c8d4e0', '#9aa8b8') : skyTex('#fff6e6', '#f0cf9c', '#c89a5a');
    const tex = faceTex(); const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: kind === 'stele' ? .35 : .9, metalness: kind === 'stele' ? .15 : 0 });
    let geo; if (kind === 'stele') { const s = new THREE.Shape(); s.moveTo(-5, -11); s.lineTo(-5, 8); s.quadraticCurveTo(0, 13.5, 5, 8); s.lineTo(5, -11); s.lineTo(-5, -11); geo = new THREE.ExtrudeGeometry(s, { depth: 3.2, bevelEnabled: true, bevelSize: .6, bevelThickness: .6, bevelSegments: 6, curveSegments: 32 }); geo.center() }
    else { const pts = []; for (let i = 0; i <= 40; i++) { const t = i / 40; const y = lerp(-10, 9, t); const r = t < .8 ? 4.6 + .4 * Math.sin(t * 3) : 4.9 * Math.sqrt(Math.max(0, 1 - Math.pow((t - .8) / .2, 2))); pts.push(new THREE.Vector2(Math.max(.01, r), y)) } geo = new THREE.LatheGeometry(pts, 96) }
    // UVs: front planar projection
    const pos = geo.attributes.position, uv = geo.attributes.uv; geo.computeBoundingBox(); const bb = geo.boundingBox; for (let i = 0; i < pos.count; i++) { uv.setXY(i, (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y)) } uv.needsUpdate = true;
    obj = new THREE.Mesh(geo, mat); obj.castShadow = true; scene.add(obj);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(9, 10, 2, 48), new THREE.MeshStandardMaterial({ color: kind === 'stele' ? 0x8a96a4 : 0xb8905a, roughness: .7 })); ped.position.y = -12; ped.receiveShadow = true; scene.add(ped);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7050, .9)); const key = new THREE.DirectionalLight(0xfff0d8, 2.6); key.position.set(-14, 18, 22); key.castShadow = true; scene.add(key);
    const rim = new THREE.DirectionalLight(0xffc880, 1.4); rim.position.set(16, 8, -14); scene.add(rim); cam = new THREE.PerspectiveCamera(32, W / H, .5, 400) }
  return { mesh() { if (!scene) build(); return obj.clone() }, draw(T, p) { if (!scene) build(); const lt = T - SH.t0; obj.rotation.y = -.9 + Math.min(lt, 4) * .22 + Math.max(0, lt - 4) * .05; cam.position.set(17, 1 + lt * .2, 62 - lt * .7); cam.lookAt(12, -1, 0); obj.position.x = 0;
    G3.rd.render(scene, cam); X.drawImage(G3.cvs, 0, 0);
    labelBoxB(W * .72, H * .2, p.title, p.sub || '', p.sub2 || '', ss(.3, .7, lt), '#ffb23a', clamp((lt - .3) / .5));
    (p.notes || []).forEach(([q, txt], i) => { const a = A(q, .4); if (a <= 0) return; X.save(); parchment(W * .53, H * .42 + i * 170, 760, 140, a); X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle'; const s = fitTxt(txt, '700 {s}px Cinzel', 680, 46); X.font = `700 ${s}px Cinzel`; X.fillStyle = '#4a2a10'; X.fillText(txt, W * .53 + 380, H * .42 + i * 170 + 72); X.restore() }) } };
}
const KUD3 = stoneScene('kudurru'), STE3 = stoneScene('stele');
function s3dKudurru(T, p) { KUD3.draw(T, p) }
function s3dStele(T, p) { STE3.draw(T, p) }
// ---------- HERO COVER: 3D Kassite warrior + black stele ----------
function makeWarrior3D() {
  const g = new THREE.Group(); const M = (c, r = .6, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
  const skin = M(0xc98d5f, .7), tunic = M(0xe0b13a, .8), kilt = M(0xb8261e, .8), bronze = M(0xc08a3a, .35, .75), red = M(0xd2322a, .7), steel = new THREE.MeshStandardMaterial({ color: 0xe8eaf0, roughness: .2, metalness: .6, emissive: 0x6a6a72 }), dark = M(0x2a1a10, .9), teal = M(0x2f9f8f, .5, .2);
  const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); m.scale.set(sx, sy, sz); m.castShadow = true; m.receiveShadow = true; g.add(m); return m };
  // legs + boots (wide stance)
  add(new THREE.CapsuleGeometry(.32, 2.4, 6, 12), skin, -.75, 1.6, 0, 0, 0, .18); add(new THREE.CapsuleGeometry(.32, 2.4, 6, 12), skin, .8, 1.6, .2, -.15, 0, -.2);
  add(new THREE.BoxGeometry(.7, .5, 1.0), dark, -1.0, .25, .15); add(new THREE.BoxGeometry(.7, .5, 1.0), dark, 1.05, .25, .35);
  // kilt + tunic + belt
  add(new THREE.CylinderGeometry(1.0, 1.45, 1.4, 20, 1, true), kilt, 0, 3.1, 0); add(new THREE.CapsuleGeometry(.95, 1.9, 8, 20), tunic, 0, 4.7, 0, -.08, 0, 0);
  add(new THREE.TorusGeometry(1.0, .12, 8, 28), bronze, 0, 3.8, 0, Math.PI / 2);
  add(new THREE.SphereGeometry(.42, 16, 12), bronze, 1.05, 5.75, 0); add(new THREE.SphereGeometry(.42, 16, 12), bronze, -1.05, 5.75, 0); add(new THREE.CylinderGeometry(.3, .34, .5, 12), skin, 0, 6.25, 0);
  add(new THREE.BoxGeometry(1.5, 1.4, .25), bronze, 0, 5.0, .9, -.1); for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(1.3, .08, .05), dark, 0, 4.5 + i * .32, 1.04, -.1);
  // cape
  const cape = new THREE.PlaneGeometry(2.6, 4.2, 10, 10); const cp = cape.attributes.position; for (let i = 0; i < cp.count; i++) { const x = cp.getX(i), y = cp.getY(i); cp.setZ(i, -Math.pow(x / 1.3, 2) * .6 - (2.1 - y) * .35 + Math.sin(y * 1.6 + x) * .18) } cape.computeVertexNormals();
  const cm = new THREE.Mesh(cape, new THREE.MeshStandardMaterial({ color: 0xd2322a, roughness: .75, side: THREE.DoubleSide })); cm.position.set(0, 4.0, -1.0); cm.rotation.set(.18, 0, 0); cm.castShadow = true; g.add(cm);
  // head, beard, helmet, plume
  add(new THREE.SphereGeometry(.62, 24, 18), skin, 0, 6.85, .05); add(new THREE.SphereGeometry(.5, 18, 14), dark, 0, 6.45, .32, 0, 0, 0, .95, 1.1, .7);
  add(new THREE.ConeGeometry(.72, 1.25, 24), bronze, 0, 7.75, 0); add(new THREE.TorusGeometry(.68, .09, 8, 24), bronze, 0, 7.2, 0, Math.PI / 2);
  const pl = add(new THREE.SphereGeometry(.4, 16, 12), red, -.15, 8.4, -.5, .6, 0, .3, .5, 1.6, .9);
  // right arm raised with sword
  const ra = new THREE.Group(); ra.position.set(1.15, 5.7, 0); ra.rotation.set(.25, 0, -.55); g.add(ra);
  const a1 = new THREE.Mesh(new THREE.CapsuleGeometry(.26, 1.8, 6, 12), skin); a1.position.y = 1.0; a1.castShadow = true; ra.add(a1);
  const hilt = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .6, 8), bronze); hilt.position.set(0, 2.2, 0); ra.add(hilt);
  const guard = new THREE.Mesh(new THREE.BoxGeometry(.7, .12, .2), bronze); guard.position.set(0, 2.5, 0); ra.add(guard);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(.22, 3.2, .05), steel); blade.position.set(.18, 4.1, 0); blade.rotation.z = -.12; blade.castShadow = true; ra.add(blade);
  // left arm forward with round shield
  const la = new THREE.Group(); la.position.set(-1.1, 5.5, .2); la.rotation.set(1.35, 0, .35); g.add(la);
  const a2 = new THREE.Mesh(new THREE.CapsuleGeometry(.26, 1.6, 6, 12), skin); a2.position.y = .9; la.add(a2);
  const sh = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, .18, 40), teal); sh.position.set(0, 1.9, .3); sh.rotation.set(0, 0, 0); sh.castShadow = true; la.add(sh);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.45, .1, 8, 40), bronze); rim.position.copy(sh.position); rim.rotation.set(Math.PI / 2, 0, 0); la.add(rim);
  const boss = new THREE.Mesh(new THREE.SphereGeometry(.32, 16, 12), bronze); boss.position.set(0, 2.0, .3); la.add(boss);
  g.traverse(o => { if (o.isMesh) { o.castShadow = true } });
  return g;
}
const HERO3 = (() => {
  let scene, cam;
  function build() {
    scene = new THREE.Scene(); scene.background = skyTex('#2a2050', '#d8643a', '#ffc070'); scene.fog = new THREE.Fog(0xe8905a, 40, 140);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0xc89a5a, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    // distant mountains
    for (let i = 0; i < 9; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(14 + hash(i) * 12, 14 + hash(i + 2) * 14, 5), new THREE.MeshStandardMaterial({ color: 0x8a5a4a, roughness: 1, flatShading: true })); m.position.set(-70 + i * 18, 5, -70 - hash(i + 4) * 20); scene.add(m) }
    // stele (reuse stone builder)
    const st = STE3.mesh(); st.scale.setScalar(.62); st.position.set(-4.2, 6.4, -4); st.rotation.y = .45; scene.add(st);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, .8, 40), new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: .8 })); ped.position.set(-4.2, .4, -4); ped.receiveShadow = true; scene.add(ped);
    const w = makeWarrior3D(); w.position.set(3.0, 0, 2.0); w.rotation.y = -.35; scene.add(w);
    scene.add(new THREE.HemisphereLight(0xffd8b0, 0x5a3a2a, .7));
    const sun = new THREE.DirectionalLight(0xffb070, 3.2); sun.position.set(-20, 18, 14); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 100 }); scene.add(sun);
    const rim = new THREE.DirectionalLight(0xffe0a0, 2.2); rim.position.set(18, 10, -16); scene.add(rim);
    const spot = new THREE.SpotLight(0xfff2e0, 260, 60, .55, .4, 1.6); spot.position.set(-2, 12, 14); spot.target.position.set(-4.2, 6, -4); scene.add(spot, spot.target);
    const wl = new THREE.PointLight(0xffe8c8, 35, 40, 1.6); wl.position.set(6, 8, 10); scene.add(wl);
    cam = new THREE.PerspectiveCamera(36, W / H, .5, 600) }
  return { draw(T, p) { if (!scene) build(); const lt = T - SH.t0; cam.position.set(4 + lt * .2, 3.2, 21 - lt * .3); cam.lookAt(.4, 5.8, -1); G3.rd.render(scene, cam); X.drawImage(G3.cvs, 0, 0) } };
})();
function s3dHero(T, p) { HERO3.draw(T, p) }
