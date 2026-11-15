// ===== ALAMUT 3D: real Alborz terrain (Terrarium z12) + fortress on the rock =====
const A3 = (() => {
  const GW = 1080, GH = 1920, N = 512, STEP = .38, VEX = 1.35; // 1 unit = 100 m
  const glc = document.createElement('canvas'); glc.width = GW; glc.height = GH;
  const rd = new THREE.WebGLRenderer({ canvas: glc, antialias: true, preserveDrawingBuffer: true });
  rd.setSize(GW, GH, false); rd.outputColorSpace = THREE.SRGBColorSpace; rd.toneMapping = THREE.ACESFilmicToneMapping; rd.toneMappingExposure = 1.15;
  rd.shadowMap.enabled = true; rd.shadowMap.type = THREE.PCFSoftShadowMap;
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(42, GW / GH, .05, 900);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const hh = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) };
  let H0 = 0, heights = null, ready = false, castleY = 0;
  const sky = { top: new THREE.Color('#23286a'), mid: new THREE.Color('#c0506a'), hor: new THREE.Color('#ffb878') };
  // sky dome
  const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: { top: { value: sky.top }, mid: { value: sky.mid }, hor: { value: sky.hor }, sunDir: { value: V(-.97, .1, .1).normalize() }, night: { value: 0 } },
    vertexShader: 'varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `uniform vec3 top,mid,hor,sunDir;uniform float night;varying vec3 vp;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){float y=clamp(vp.y,0.,1.);vec3 c=mix(hor,mid,smoothstep(0.,.18,y));c=mix(c,top,smoothstep(.18,.6,y));
      float s=max(dot(vp,sunDir),0.);c+=vec3(1.,.75,.45)*pow(s,40.)*1.4+vec3(1.,.55,.3)*pow(s,6.)*.35;
      vec2 g=floor(vp.xz/(vp.y+.3)*260.);float st=step(.9975,h(g))*smoothstep(.15,.6,y)*night;c+=vec3(st);
      gl_FragColor=vec4(c,1.);}` });
  sc.add(new THREE.Mesh(new THREE.SphereGeometry(600, 32, 16), skyMat));
  sc.fog = new THREE.FogExp2('#d8a088', .0035);
  const hemi = new THREE.HemisphereLight('#c8c0ff', '#6a4a30', 1.1); sc.add(hemi);
  const sun = new THREE.DirectionalLight('#ffb070', 3.2); sun.position.set(-80, 22, -60); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  const scam = sun.shadow.camera; scam.left = scam.bottom = -12; scam.right = scam.top = 12; scam.near = 1; scam.far = 260; sun.shadow.bias = -.0005; sc.add(sun, sun.target);
  // ---------- terrain ----------
  function buildTerrain(img) {
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
    const cx = 654, cy = 555, o0 = cx - N / 2, p0 = cy - N / 2; heights = new Float32Array(N * N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const k = ((p0 + j) * c.width + (o0 + i)) * 4; heights[j * N + i] = d[k] * 256 + d[k + 1] + d[k + 2] / 256 - 32768 }
    // light smoothing to remove tile noise
    const sm = new Float32Array(N * N); for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0, w = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const ii = Math.min(N - 1, Math.max(0, i + a)), jj = Math.min(N - 1, Math.max(0, j + b)); const ww = a || b ? 1 : 2; s += heights[jj * N + ii] * ww; w += ww } sm[j * N + i] = s / w } heights = sm;
    H0 = 1000; const g = new THREE.PlaneGeometry((N - 1) * STEP, (N - 1) * STEP, N - 1, N - 1); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, col = new Float32Array(pos.count * 3);
    for (let k = 0; k < pos.count; k++) pos.setY(k, (heights[k] - H0) / 100 * VEX);
    g.computeVertexNormals(); const nr = g.attributes.normal;
    const C = (h) => new THREE.Color(h), cGrass = C('#4f7a34'), cDry = C('#9a7a4e'), cRock = C('#7e746c'), cDark = C('#4a3a32'), cSnow = C('#f2f0ec'), tmp = new THREE.Color();
    for (let k = 0; k < pos.count; k++) {
      const h = heights[k], slope = 1 - nr.getY(k), n = hh(k * .37) * .12;
      tmp.copy(cGrass).lerp(cDry, Math.min(1, Math.max(0, (h - 1750) / 500 + n)));
      tmp.lerp(cRock, Math.min(1, Math.max(0, (slope - .18) * 3.2)));
      if (slope > .45) tmp.lerp(cDark, Math.min(1, (slope - .45) * 2));
      tmp.lerp(cSnow, Math.min(1, Math.max(0, (h - 3300) / 500 - slope * .8 + n)));
      col[k * 3] = tmp.r; col[k * 3 + 1] = tmp.g; col[k * 3 + 2] = tmp.b
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, metalness: 0 })); m.receiveShadow = true; sc.add(m);
    castleY = hAt(0, 0)
  }
  function hAt(x, z) { const i = x / STEP + (N - 1) / 2, j = z / STEP + (N - 1) / 2; const i0 = Math.max(0, Math.min(N - 2, Math.floor(i))), j0 = Math.max(0, Math.min(N - 2, Math.floor(j))), fx = i - i0, fz = j - j0;
    const h = (a, b) => (heights[b * N + a] - H0) / 100 * VEX; return (h(i0, j0) * (1 - fx) + h(i0 + 1, j0) * fx) * (1 - fz) + (h(i0, j0 + 1) * (1 - fx) + h(i0 + 1, j0 + 1) * fx) * fz }
  // ---------- crag + castle ----------
  const stone = new THREE.MeshStandardMaterial({ color: '#c2a27a', roughness: .85 }), stoneD = new THREE.MeshStandardMaterial({ color: '#9a7a58', roughness: .9 }), rockM = new THREE.MeshStandardMaterial({ color: '#9a8672', roughness: 1 });
  const glow = new THREE.MeshBasicMaterial({ color: '#ffb44a' }), wood = new THREE.MeshStandardMaterial({ color: '#4a3020', roughness: .9 });
  const CG = new THREE.Group(); sc.add(CG); const lights = []; const flames = [];
  function box(w, h, d, m, x, y, z, p = CG) { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o }
  function cyl(r, h, m, x, y, z, p = CG, s = 14) { const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.04, h, s), m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o }
  function merlonsLine(x0, z0, x1, z1, y, step = .09) { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.floor(L / step); const a = Math.atan2(z1 - z0, x1 - x0);
    for (let i = 0; i < n; i += 2) { const t = (i + .5) / n; const b = box(step * .9, .07, .07, stone, lerp3(x0, x1, t), y, lerp3(z0, z1, t)); b.rotation.y = -a } }
  const lerp3 = (a, b, t) => a + (b - a) * t;
  function tower(x, z, y0, r, h) { cyl(r, h, stone, x, y0 + h / 2, z); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; if (i % 2) continue; box(.07, .08, .07, stone, x + Math.cos(a) * r * .92, y0 + h + .04, z + Math.sin(a) * r * .92) }
    for (let i = 0; i < 2; i++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(.035, .06), glow); const a = .6 + i * 2.2; w.position.set(x + Math.cos(a) * (r + .005), y0 + h * (.55 + i * .2), z + Math.sin(a) * (r + .005)); w.lookAt(x + Math.cos(a) * 3, w.position.y, z + Math.sin(a) * 3); CG.add(w) } }
  function buildCastle() {
    // ridge rock: elongated E-W, steep
    const rg = new THREE.Group(); CG.add(rg); const top = castleY + 1.2;
    const sg = new THREE.SphereGeometry(1, 72, 40); const p = sg.attributes.position;
    for (let k = 0; k < p.count; k++) { let x = p.getX(k), y = p.getY(k), z = p.getZ(k);
      const n = .08 * Math.sin(x * 7.1 + z * 3.3) + .06 * Math.sin(z * 9.7 - x * 4.1 + y * 5) + .04 * Math.sin(y * 13 + x * 11);
      x *= 1.75; z *= .62; y = y > .55 ? .55 + (y - .55) * .15 : y; if (y < 0) { const f = 1 - y * .9; x *= f; z *= f; y *= 3.2 } y *= 1.45; const r = 1 + n; p.setXYZ(k, x * r, y * (1 + n * .5), z * r) }
    sg.computeVertexNormals(); const rock = new THREE.Mesh(sg, rockM); rock.position.y = top - .82; rock.castShadow = rock.receiveShadow = true; rg.add(rock);
    const y0 = top + .02;
    // curtain wall following the ridge
    const wall = [[-1.45, -.18], [-.9, -.36], [0, -.42], [.9, -.34], [1.5, -.12], [1.45, .2], [.8, .36], [0, .4], [-.9, .34], [-1.45, .18]];
    for (let i = 0; i < wall.length; i++) { const [xa, za] = wall[i], [xb, zb] = wall[(i + 1) % wall.length]; const L = Math.hypot(xb - xa, zb - za); const w = box(L, .22, .06, stone, (xa + xb) / 2, y0 + .11, (za + zb) / 2); w.rotation.y = -Math.atan2(zb - za, xb - xa); merlonsLine(xa, za, xb, zb, y0 + .26) }
    // towers
    [[-1.45, 0, .14, .5], [-.9, -.36, .1, .36], [.9, -.34, .1, .38], [1.5, .04, .15, .55], [.8, .36, .1, .34], [-.9, .34, .1, .36], [0, -.42, .09, .3]].forEach(([x, z, r, h]) => tower(x, z, y0, r, h));
    // keep + halls
    box(.42, .55, .32, stone, -.35, y0 + .275, 0); box(.5, .28, .28, stoneD, .35, y0 + .14, .02); box(.3, .2, .22, stone, 1.0, y0 + .1, 0); box(.26, .22, .2, stoneD, -1.0, y0 + .11, .02);
    merlonsLine(-.56, -.16, -.14, -.16, y0 + .59, .06); merlonsLine(-.56, .16, -.14, .16, y0 + .59, .06);
    // windows on keep
    for (let i = 0; i < 3; i++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(.035, .06), glow); w.position.set(-.48 + i * .13, y0 + .36, .161); CG.add(w); const w2 = w.clone(); w2.position.z = -.161; w2.rotation.y = Math.PI; CG.add(w2) }
    // flag
    cyl(.008, .35, wood, -.35, y0 + .72, 0, CG, 6); const fl = new THREE.Mesh(new THREE.PlaneGeometry(.22, .13, 8, 2), new THREE.MeshStandardMaterial({ color: '#e8e0cc', side: THREE.DoubleSide, roughness: .8 })); fl.position.set(-.24, y0 + .83, 0); CG.add(fl); CG.userData.flag = fl;
    // torches
    [[-1.45, .16, .55], [1.5, .17, .6], [-.35, .17, .6]].forEach(([x, z, h], i) => { const L = new THREE.PointLight('#ff9a3a', 2.4, 3.5, 1.6); L.position.set(x, y0 + h + .08, z); CG.add(L); lights.push(L); const f = new THREE.Mesh(new THREE.SphereGeometry(.025, 8, 6), glow); f.position.copy(L.position); CG.add(f); flames.push(f) });
    // path up the rock
    sun.target.position.set(0, top, 0); sun.position.set(-90, top + 20, 10)
  }
  const IMG = new Image(); IMG.src = '3d/alamut_terrarium.png';
  const init = IMG.decode().then(() => { buildTerrain(IMG); buildCastle(); ready = true });
  // ---------- frame ----------
  function setMood(m) { // m: 0 dusk, 1 night
    sky.top.set('#23286a').lerp(new THREE.Color('#05060f'), m); sky.mid.set('#c0506a').lerp(new THREE.Color('#141a34'), m); sky.hor.set('#ffb878').lerp(new THREE.Color('#2a2a4a'), m);
    skyMat.uniforms.night.value = m; sc.fog.color.set('#d8a088').lerp(new THREE.Color('#1a1a2e'), m); sun.intensity = 3.6 * (1 - m) + .25; hemi.intensity = 1.1 - .75 * m; rd.toneMappingExposure = 1.15 + .25 * m }
  function render(t, keys, o = {}) {
    if (!ready) return glc; setMood(o.night || 0); sc.fog.density = o.fog ?? .0035;
    // camera keys: [time, [x,y,z rel castle top], [lx,ly,lz]]
    const top = castleY + 1.2; let i = 0; while (i < keys.length - 1 && t > keys[i + 1][0]) i++; const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
    let k = b === a ? 0 : Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))); k = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const P = a[1].map((v, j) => v + (b[1][j] - v) * k), L = a[2].map((v, j) => v + (b[2][j] - v) * k);
    const cy = Math.max(P[1] + top, hAt(P[0], P[2]) + .4); cam.position.set(P[0], cy, P[2]); cam.lookAt(L[0], L[1] + top, L[2]); cam.fov = o.fov || 42; cam.updateProjectionMatrix();
    lights.forEach((L, i) => L.intensity = 2.2 + Math.sin(t * 13 + i * 2) * .4 + Math.sin(t * 29 + i) * .3); flames.forEach((f, i) => f.scale.setScalar(1 + .3 * Math.sin(t * 17 + i)));
    const fl = CG.userData.flag; if (fl) { const p = fl.geometry.attributes.position; for (let k2 = 0; k2 < p.count; k2++) { const x = p.getX(k2); p.setZ(k2, Math.sin(t * 5 + x * 30) * .015 * (x + .11) * 6) } p.needsUpdate = true }
    rd.render(sc, cam); return glc }
  return { init, render, glc }
})();
