// ===== XXX film: 3D scenes =====
const S3 = {};
function def3(name, build) { S3[name] = { build, built: null } }
function get3(name) { const s = S3[name]; if (!s.built) { const sc = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(40, W / H, .05, 600); s.built = Object.assign({ sc, cam }, s.build(sc, cam) || {}) } return s.built }
function draw3(name, T, p = {}) { const s = get3(name), lt = T - SH.t0; RD.toneMappingExposure = p.exp || s.exp || 1.15; s.update && s.update(lt, p, T); RD.render(s.sc, s.cam); X.drawImage(GL, 0, 0) }
const camLook = (cam, pos, look) => { cam.position.copy(pos); cam.lookAt(look) };
const lerpV = (a, b, t) => V3(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));
// camera path helper: p.cam = [[t, [px,py,pz],[lx,ly,lz]], ...] (t seconds from shot start or cue)
function camPath(cam, lt, path, dflt) {
  path = path || dflt; if (!path) return; const ts = path.map(k => typeof k[0] === 'number' ? k[0] : SH.R(k[0]) - SH.t0);
  let i = 0; while (i < path.length - 1 && lt > ts[i + 1]) i++; const a = path[i], b = path[Math.min(i + 1, path.length - 1)];
  const k = b === a ? 0 : eio(clamp((lt - ts[i]) / Math.max(.01, ts[i + 1] - ts[i])));
  camLook(cam, lerpV(a[1], b[1], k), lerpV(a[2], b[2], k))
}
function stdLights(sc, o = {}) {
  sc.add(new THREE.HemisphereLight(o.sky || '#9fb6ff', o.ground || '#3a2a20', o.hemi ?? .6));
  const d = new THREE.DirectionalLight(o.sun || '#fff1dc', o.sunI ?? 2.2); d.position.set(...(o.sunP || [8, 14, 6])); d.castShadow = true; d.shadow.mapSize.set(2048, 2048);
  const c = d.shadow.camera; c.left = c.bottom = -(o.sh || 14); c.right = c.top = o.sh || 14; c.far = 80; d.shadow.bias = -.0004; sc.add(d); return d
}

// ---------------- PORTRAIT ----------------
def3('portrait', (sc, cam) => {
  sc.background = skyTex([[0, '#140a24'], [.55, '#0a0814'], [1, '#020205']]); sc.fog = new THREE.Fog('#05050a', 8, 22);
  const j = makeJah(); sc.add(j); pose(j, {});
  sc.add(new THREE.HemisphereLight('#6a7aff', '#100808', .35));
  const key = new THREE.SpotLight('#ffe6cc', 140, 20, .45, .5); key.position.set(1.6, 3.6, 4.5); sc.add(new THREE.PointLight('#ffd8b8', 6, 6).translateZ(2.5).translateY(2.3)); key.target = j; key.castShadow = true; sc.add(key);
  const rimA = new THREE.SpotLight('#3a6bff', 90, 16, .5, .7); rimA.position.set(-3.5, 3, -2.5); rimA.target = j; sc.add(rimA);
  const rimB = new THREE.SpotLight('#ff2a4a', 80, 16, .5, .7); rimB.position.set(3.5, 2.6, -2.8); rimB.target = j; sc.add(rimB);
  const floor = mesh(new THREE.CircleGeometry(6, 48), M('#0b0b10', { roughness: .4, metalness: .3 })); floor.rotation.x = -Math.PI / 2; sc.add(floor);
  // floating dust
  const n = 400, pg = new THREE.BufferGeometry(), pos = new Float32Array(n * 3); for (let i = 0; i < n; i++) { pos[i * 3] = (hash(i) - .5) * 10; pos[i * 3 + 1] = hash(i + 9) * 5; pos[i * 3 + 2] = (hash(i + 3) - .5) * 8 - 1 }
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const pts = new THREE.Points(pg, new THREE.PointsMaterial({ map: DOT, color: '#ffd9a0', size: .04, transparent: true, opacity: .7, depthWrite: false })); sc.add(pts);
  return {
    exp: 1.2, j, update(lt, p) {
      const m = p.mode || 'bust'; pose(j, { hx: Math.sin(lt * .5) * .05 + (p.down ? .25 : 0), hy: Math.sin(lt * .3) * .12, arms: p.arms });
      pts.rotation.y = lt * .03; j.rotation.y = (p.turn ?? -.25) + Math.sin(lt * .2) * .12;
      if (p.cam) return camPath(cam, lt, p.cam);
      const z = m === 'full' ? 6.2 - lt * .06 : 2.2 - lt * .03, y = m === 'full' ? 1.4 : 2.25; camLook(cam, V3(Math.sin(lt * .1) * .6 + (p.cx || 0), y, z), V3(p.cx || 0, m === 'full' ? 1.2 : 2.2, 0))
    }
  }
});
