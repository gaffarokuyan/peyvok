// ================= ANNAZÎLER — medieval Kurdish emirate scenes (court, cavalry, siege, caravan, org chart) =================
// ---- portrait presets (portraits.js) ----
Object.assign(PORTRAIT, {
  emir: { skinL: '#d8a27a', skinD: '#5a3420', age: .55, hollow: 0, beard: ['#6a625a', '#3a322c', '#1a1612'], beardLen: 250, beardW: 118, brow: '#2a1c12', browAng: .2, turban: ['#fbf3e2', '#e2d2b4', '#9a8a68'], turbanH: 215, cap: '#8a1a14', robe: ['#4a1410', '#a8301e'], mantle: '#3a0e0a', trim: '#e0b84a', nose: 'hook', iris: '#2a1608', mail: true },
  founder: { skinL: '#d3a07a', skinD: '#4a2c1e', age: .85, hollow: .4, beard: ['#e8e2d8', '#aaa498', '#6a645a'], beardLen: 310, beardW: 122, brow: '#c8c0b2', browAng: .25, turban: ['#f6f1e6', '#d8cfbe', '#8a8070'], turbanH: 225, cap: '#1f5a3a', robe: ['#142a1e', '#2f6a4a'], mantle: '#10241a', trim: '#d8b04c', nose: 'hook', iris: '#2a1608', mail: false },
  muhalhil: { skinL: '#d6a078', skinD: '#55321e', age: .5, hollow: .1, beard: ['#5a3a24', '#3a2414', '#1a0e06'], beardLen: 230, beardW: 112, brow: '#24160c', browAng: .3, turban: ['#f0e6d0', '#cdbf9e', '#857455'], turbanH: 205, cap: '#1e3a7a', robe: ['#141e3a', '#2f4a8a'], mantle: '#0e1630', trim: '#c8a24a', nose: 'straight', iris: '#2a1608', mail: true },
  sadi: { skinL: '#dcaa82', skinD: '#5a3622', age: .15, hollow: 0, beard: ['#2a1c12', '#18100a', '#0a0604'], beardLen: 150, beardW: 104, brow: '#1a0e06', browAng: .35, turban: ['#fbf6ea', '#e2d8c4', '#9a8e78'], turbanH: 195, cap: '#a8301e', robe: ['#4a1410', '#c0402a'], mantle: '#300a08', trim: '#e0b84a', nose: 'straight', iris: '#3a2210', mail: true },
  inal: { skinL: '#e0b48a', skinD: '#6a4026', age: .4, hollow: 0, beard: ['#3a2a1a', '#22160c', '#100a04'], beardLen: 120, beardW: 80, brow: '#1a0e06', browAng: .4, turban: ['#f4ecd6', '#d8c8a8', '#8a7a5a'], turbanH: 200, cap: null, hat: 'bork', robe: ['#10162a', '#26345a'], mantle: '#0a0e1c', trim: '#c8a24a', nose: 'straight', iris: '#1a0e06', mail: true }
});
// ---- shared drawing ----
const OLN = 'rgba(28,14,6,.9)';
function annGold(y0, y1) { return goldGrad(X, y0, y1) }
function horseRider(ctx, x, y, s, t, o = {}) {
  const f = o.f || 1, g = t * (o.rate || 9) + (o.ph || 0), gal = o.gallop ?? 1;
  ctx.save(); ctx.translate(x, y + Math.abs(Math.sin(g)) * -.05 * s * gal); ctx.scale(f * s, s); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const hc = o.horse || '#5a3a24', hd = shadeC(hc, -.35), cloth = o.cloth || '#a8301e';
  const leg = (bx, by, ph, back) => { const a = Math.sin(g + ph) * .7 * gal, b = (back ? -1 : 1) * (.35 + Math.max(0, Math.sin(g + ph + 1.2)) * .9 * gal);
    const kx = bx + Math.sin(a) * .55, ky = by + Math.cos(a) * .55, fx = kx + Math.sin(a + b) * .55, fy = ky + Math.cos(a + b) * .55;
    ctx.strokeStyle = OLN; ctx.lineWidth = .2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke(); ctx.strokeStyle = back ? hd : hc; ctx.lineWidth = .14; ctx.stroke(); ctx.fillStyle = '#1a120c'; ctx.beginPath(); ctx.ellipse(fx + .02, fy, .09, .06, 0, 0, TAU); ctx.fill() };
  leg(-.7, -1.05, 2.4, 1); leg(.65, -1.05, .6, 0);
  // tail
  ctx.strokeStyle = shadeC(hc, -.5); ctx.lineWidth = .16; ctx.beginPath(); ctx.moveTo(-.95, -1.35); ctx.quadraticCurveTo(-1.45, -1.3 + Math.sin(g) * .1, -1.55, -.85 + Math.sin(g * .5) * .1); ctx.stroke();
  // body
  const bg = ctx.createLinearGradient(0, -1.6, 0, -.8); bg.addColorStop(0, shadeC(hc, .2)); bg.addColorStop(1, hd); ctx.fillStyle = bg; ctx.strokeStyle = OLN; ctx.lineWidth = .05;
  ctx.beginPath(); ctx.ellipse(-.05, -1.2, 1.0, .4, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // neck + head
  ctx.beginPath(); ctx.moveTo(.55, -1.45); ctx.quadraticCurveTo(.95, -2.05, 1.18, -2.15); ctx.lineTo(1.72, -1.7); ctx.quadraticCurveTo(1.78, -1.58, 1.62, -1.55); ctx.lineTo(1.2, -1.72); ctx.quadraticCurveTo(1.05, -1.2, .8, -1.0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#100a06'; ctx.beginPath(); ctx.arc(1.32, -1.98, .035, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.moveTo(1.15, -2.15); ctx.lineTo(1.12, -2.36); ctx.lineTo(1.24, -2.18); ctx.fill();
  ctx.strokeStyle = shadeC(hc, -.55); ctx.lineWidth = .09; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(.62 + i * .12, -1.5 - i * .13); ctx.lineTo(.5 + i * .1 + Math.sin(g + i) * .03, -1.35 - i * .1); ctx.stroke() }
  leg(-.55, -1.0, 3.3, 0); leg(.8, -1.0, 1.5, 0);
  // saddle cloth
  ctx.fillStyle = cloth; ctx.strokeStyle = OLN; ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(-.55, -1.55); ctx.lineTo(.35, -1.55); ctx.lineTo(.3, -.98); ctx.lineTo(-.5, -.98); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.strokeStyle = '#e0b84a'; ctx.lineWidth = .05; ctx.beginPath(); ctx.moveTo(-.5, -1.02); ctx.lineTo(.3, -1.02); ctx.stroke();
  // rider
  const tun = o.tunic || '#c0402a', sk = o.skin || '#c98d5f'; const lean = o.lance === 'down' ? .25 : 0;
  ctx.save(); ctx.translate(-.05, -1.55); ctx.rotate(lean);
  if (o.cloak) { ctx.fillStyle = o.cloak; ctx.beginPath(); ctx.moveTo(-.05, -.75); ctx.quadraticCurveTo(-.7, -.6 + Math.sin(g * .7) * .08, -.95 - gal * .25, -.15 + Math.sin(g) * .1); ctx.lineTo(-.15, -.05); ctx.closePath(); ctx.fill() }
  ctx.strokeStyle = OLN; ctx.lineWidth = .17; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(.25, .35); ctx.lineTo(.18, .6); ctx.stroke(); ctx.strokeStyle = o.boot || '#3a2414'; ctx.lineWidth = .12; ctx.stroke();
  ctx.fillStyle = tun; ctx.strokeStyle = OLN; ctx.lineWidth = .04; ctx.beginPath(); ctx.moveTo(-.2, .05); ctx.lineTo(-.15, -.72); ctx.lineTo(.2, -.72); ctx.lineTo(.25, .05); ctx.closePath(); ctx.fill(); ctx.stroke();
  if (o.mail) { ctx.fillStyle = 'rgba(200,205,215,.35)'; ctx.fillRect(-.16, -.7, .38, .3) } ctx.fillStyle = '#e0b84a'; ctx.fillRect(-.19, -.18, .44, .06);
  if (o.shield) { ctx.fillStyle = o.shield; ctx.strokeStyle = '#e0b84a'; ctx.lineWidth = .04; ctx.beginPath(); ctx.arc(-.12, -.42, .26, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#e0b84a'; ctx.beginPath(); ctx.arc(-.12, -.42, .06, 0, TAU); ctx.fill() }
  // head
  ctx.fillStyle = sk; ctx.strokeStyle = OLN; ctx.lineWidth = .035; ctx.beginPath(); ctx.arc(.04, -.9, .15, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = o.beard || '#2a1a10'; ctx.beginPath(); ctx.moveTo(-.06, -.88); ctx.quadraticCurveTo(.08, -.62, .19, -.86); ctx.fill();
  if (o.hat === 'helmet') { ctx.fillStyle = '#c8ccd2'; ctx.beginPath(); ctx.moveTo(-.13, -.94); ctx.quadraticCurveTo(.04, -1.32, .21, -.94); ctx.fill(); ctx.stroke(); ctx.fillStyle = 'rgba(170,175,185,.9)'; ctx.fillRect(-.14, -.94, .08, .2) }
  else if (o.hat === 'bork') { ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-.15, -1.0, .38, .08); ctx.fillStyle = o.hatc || '#1e2a4a'; ctx.beginPath(); ctx.moveTo(-.11, -1.0); ctx.lineTo(.04, -1.32); ctx.lineTo(.2, -1.0); ctx.fill() }
  else { ctx.fillStyle = o.turban || '#f2ead6'; ctx.beginPath(); ctx.ellipse(.04, -1.02, .19, .12, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(.04, -1.0, .19, .06, 0, 0, TAU); ctx.fill(); ctx.stroke(); if (o.kulah) { ctx.fillStyle = o.kulah; ctx.beginPath(); ctx.ellipse(.04, -1.1, .07, .06, 0, Math.PI, 0); ctx.fill() } }
  // arm + weapon
  if (o.bow) { ctx.strokeStyle = OLN; ctx.lineWidth = .1; ctx.beginPath(); ctx.moveTo(.1, -.6); ctx.lineTo(.6, -.62); ctx.stroke(); ctx.strokeStyle = '#6a3a14'; ctx.lineWidth = .05; ctx.beginPath(); ctx.arc(.55, -.62, .32, -1.3, 1.3); ctx.stroke(); ctx.strokeStyle = '#e8e2d4'; ctx.lineWidth = .015; ctx.beginPath(); ctx.moveTo(.6, -.93); ctx.lineTo(.12 + Math.max(0, Math.sin(t * 2.2 + (o.ph || 0))) * .2, -.62); ctx.lineTo(.6, -.31); ctx.stroke() }
  else { const up = o.lance !== 'down'; ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = .05; ctx.beginPath(); if (up) { ctx.moveTo(.3, .25); ctx.lineTo(.42, -2.0) } else { ctx.moveTo(-.5, -.55); ctx.lineTo(2.4, -.95) } ctx.stroke();
    ctx.fillStyle = '#e8e2d4'; ctx.beginPath(); if (up) { ctx.moveTo(.42, -2.25); ctx.lineTo(.37, -1.98); ctx.lineTo(.47, -1.99) } else { ctx.moveTo(2.65, -.99); ctx.lineTo(2.38, -1.0); ctx.lineTo(2.4, -.9) } ctx.fill();
    if (o.pennant && up) { ctx.fillStyle = o.pennant; ctx.beginPath(); ctx.moveTo(.41, -1.95); ctx.lineTo(.75, -1.86 + Math.sin(g * .8) * .04); ctx.lineTo(.4, -1.75); ctx.fill() }
    ctx.strokeStyle = OLN; ctx.lineWidth = .1; ctx.beginPath(); ctx.moveTo(.12, -.6); ctx.lineTo(up ? .38 : .5, up ? -.4 : -.78); ctx.stroke() }
  ctx.restore(); ctx.restore()
}
function shadeC(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const f = v => Math.max(0, Math.min(255, Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k)))); return `rgb(${f(r)},${f(g)},${f(b)})` }
function person(ctx, x, y, s, t, o = {}) { // standing / walking / bowing / seated figure, feet at y, height s
  const f = o.f || 1, walk = o.walk || 0, bow = o.bow || 0, sit = o.sit;
  ctx.save(); ctx.translate(x, y); ctx.scale(f * s / 100, s / 100); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const robe = o.robe || '#7a2a1a', sk = o.skin || '#c98d5f', st = Math.sin(t * 6) * 18 * walk, br = Math.sin(t * 1.6 + (o.ph || 0)) * .8;
  if (!sit) { ctx.strokeStyle = OLN; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-6, -46); ctx.lineTo(-6 + st * .4, -4); ctx.moveTo(6, -46); ctx.lineTo(6 - st * .4, -4); ctx.stroke(); ctx.strokeStyle = o.boot || '#3a2414'; ctx.lineWidth = 6.5; ctx.stroke() }
  ctx.save(); ctx.translate(0, sit ? -30 : -44); ctx.rotate(bow * .55);
  const rg = ctx.createLinearGradient(-20, 0, 20, 0); rg.addColorStop(0, shadeC(robe, -.3)); rg.addColorStop(1, shadeC(robe, .15)); ctx.fillStyle = rg; ctx.strokeStyle = OLN; ctx.lineWidth = 2.2;
  ctx.beginPath(); ctx.moveTo(-15, -50 + br); ctx.lineTo(15, -50 + br); ctx.lineTo(sit ? 26 : 20, sit ? 10 : 6); ctx.lineTo(sit ? -26 : -20, sit ? 10 : 6); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = o.belt || '#e0b84a'; ctx.fillRect(-16, -22, 32, 5);
  if (o.mail) { ctx.fillStyle = 'rgba(200,205,215,.4)'; ctx.fillRect(-14, -48 + br, 28, 20) }
  // arms
  ctx.strokeStyle = OLN; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-14, -46 + br); ctx.lineTo(-18, -20); ctx.moveTo(14, -46 + br); ctx.lineTo(o.spear ? 22 : (o.raise ? 26 : 18), o.raise ? -62 : -20); ctx.stroke(); ctx.strokeStyle = shadeC(robe, -.1); ctx.lineWidth = 5.5; ctx.stroke();
  if (o.spear) { ctx.strokeStyle = '#5a3a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(24, 40); ctx.lineTo(24, -120); ctx.stroke(); ctx.fillStyle = '#e8e2d4'; ctx.beginPath(); ctx.moveTo(24, -136); ctx.lineTo(19, -118); ctx.lineTo(29, -118); ctx.fill() }
  if (o.shield) { ctx.fillStyle = o.shield; ctx.strokeStyle = '#e0b84a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-20, -24, 15, 0, TAU); ctx.fill(); ctx.stroke() }
  if (o.scroll) { ctx.fillStyle = '#f4ead2'; ctx.fillRect(12, -30, 16, 9); ctx.strokeStyle = '#b8862b'; ctx.lineWidth = 1.5; ctx.strokeRect(12, -30, 16, 9) }
  // head
  ctx.fillStyle = sk; ctx.strokeStyle = OLN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -62 + br, 11, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = o.beard || '#2a1a10'; ctx.beginPath(); ctx.moveTo(-8, -60 + br); ctx.quadraticCurveTo(0, -42 + br, 9, -60 + br); ctx.fill();
  if (o.hat === 'helmet') { ctx.fillStyle = '#c8ccd2'; ctx.beginPath(); ctx.moveTo(-11, -64 + br); ctx.quadraticCurveTo(0, -90 + br, 11, -64 + br); ctx.fill(); ctx.stroke() }
  else if (o.hat === 'bork') { ctx.fillStyle = o.hatc || '#1e2a4a'; ctx.beginPath(); ctx.moveTo(-9, -68 + br); ctx.lineTo(0, -92 + br); ctx.lineTo(9, -68 + br); ctx.fill(); ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-12, -70 + br, 24, 6) }
  else { ctx.fillStyle = o.turban || '#f2ead6'; ctx.beginPath(); ctx.ellipse(0, -70 + br, 14, 9, 0, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -69 + br, 14, 4.5, 0, 0, TAU); ctx.fill(); ctx.stroke(); if (o.kulah) { ctx.fillStyle = o.kulah; ctx.beginPath(); ctx.ellipse(0, -77 + br, 6, 5, 0, Math.PI, 0); ctx.fill() } }
  ctx.restore(); ctx.restore()
}
function banner(x, y, h, col, t, ph = 0, emblem = true) { X.save(); X.strokeStyle = '#3a2414'; X.lineWidth = 6; X.beginPath(); X.moveTo(x, y); X.lineTo(x, y - h); X.stroke(); X.fillStyle = col; X.beginPath(); X.moveTo(x + 3, y - h + 4);
  for (let i = 0; i <= 8; i++) X.lineTo(x + 3 + i * 16, y - h + 4 + 9 * Math.sin(t * 3 + i * .7 + ph)); for (let i = 8; i >= 0; i--) X.lineTo(x + 3 + i * 16, y - h + 96 + 9 * Math.sin(t * 3 + i * .7 + ph) + (i === 8 ? -20 : 0)); X.fill();
  if (emblem) { X.fillStyle = '#ffd65a'; X.beginPath(); X.arc(x + 66, y - h + 52 + 9 * Math.sin(t * 3 + 4 * .7 + ph), 18, 0, TAU); X.fill() } X.restore() }
function dustCloud(t, y0, n = 30, col = '210,180,130') { X.save(); for (let i = 0; i < n; i++) { const x = (hash(i) * W * 1.4 - t * (60 + hash(i + 2) * 120)) % (W * 1.4); const xx = x < -200 ? x + W * 1.4 : x, r = 60 + hash(i + 5) * 140; const g = X.createRadialGradient(xx, y0 - hash(i + 3) * 80, 0, xx, y0 - hash(i + 3) * 80, r); g.addColorStop(0, `rgba(${col},.22)`); g.addColorStop(1, `rgba(${col},0)`); X.fillStyle = g; X.fillRect(xx - r, y0 - r - 80, r * 2, r * 2) } X.restore() }
function zagrosBack(t, warm = .25, cam = 0) { landscape(t, cam, warm) }
// ---------------- scenes ----------------
function sCavalry(T, p) { // Kurdish horsemen riding through the Zagros
  const lt = T - SH.t0; zagrosBack(lt, p.warm ?? .3, lt * 40);
  const rows = [[.62, .55, 7, 1.0], [.74, .72, 6, 1.3], [.9, .95, 5, 1.6]];
  rows.forEach(([yy, sc, n, sp], ri) => { for (let i = 0; i < n; i++) { const span = W + 600; const x = ((i / n) * span + lt * 160 * sp + hash(i + ri * 9) * 120) % span - 300; horseRider(X, x, H * yy, 100 * sc, lt, { ph: i * 1.7 + ri, horse: ['#5a3a24', '#2a1c14', '#8a6a4a', '#d8d0c4'][(i + ri) % 4], tunic: ['#a8301e', '#c0402a', '#7a2a1a'][i % 3], cloth: ['#a8301e', '#1f5a3a', '#e0b84a'][(i + ri) % 3], turban: '#f2ead6', kulah: i % 2 ? '#8a1a14' : null, shield: ['#e0b84a', '#a8301e', '#2f6a4a'][i % 3], cloak: i % 2 ? '#e0703a' : null, pennant: i % 3 === 0 ? '#ffd65a' : null, hat: i % 4 === 3 ? 'helmet' : null, mail: true }) } });
  dustCloud(lt, H * .95, 26); sparkles(lt, 30);
  if (p.title) labelBoxB(W / 2, H * .12, p.title, p.sub || '', p.sub2 || '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5)) }
function sCourt(T, p) { // the emir's court at Hulvan
  const lt = T - SH.t0, z = 1 + .012 * lt; X.save(); X.translate(W / 2, H / 2); X.scale(z, z); X.translate(-W / 2, -H / 2);
  const wg = X.createLinearGradient(0, 0, 0, H); wg.addColorStop(0, '#3a1e12'); wg.addColorStop(.6, '#6a3a20'); wg.addColorStop(1, '#2a140a'); X.fillStyle = wg; X.fillRect(0, 0, W, H);
  // iwan arches
  const arch = (cx, w, h, y0) => { X.beginPath(); X.moveTo(cx - w / 2, y0); X.lineTo(cx - w / 2, y0 - h * .62); X.quadraticCurveTo(cx - w / 2, y0 - h, cx, y0 - h * 1.08); X.quadraticCurveTo(cx + w / 2, y0 - h, cx + w / 2, y0 - h * .62); X.lineTo(cx + w / 2, y0); X.closePath() };
  [[W * .17, 300, 560], [W * .83, 300, 560], [W * .5, 520, 760]].forEach(([cx, w, h], i) => { X.save(); arch(cx, w + 60, h + 50, 760); X.fillStyle = '#c99a62'; X.fill(); arch(cx, w + 30, h + 25, 760); X.fillStyle = '#1f6a7a'; X.fill();
    X.save(); X.clip(); for (let k = 0; k < 40; k++) { X.fillStyle = k % 2 ? 'rgba(255,255,255,.15)' : 'rgba(255,210,90,.25)'; X.beginPath(); X.arc(cx - w + (k % 8) * w / 3.5, 760 - h - 40 + Math.floor(k / 8) * 70, 14, 0, TAU); X.fill() } X.restore();
    arch(cx, w, h, 760); const ig = X.createLinearGradient(0, 760 - h, 0, 760); ig.addColorStop(0, i === 2 ? '#1a0e08' : '#24140c'); ig.addColorStop(1, '#4a2a16'); X.fillStyle = ig; X.fill(); X.restore() });
  // light shafts
  X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = 560 + i * 260; const g = X.createLinearGradient(x, 0, x + 160, H); g.addColorStop(0, 'rgba(255,220,150,.16)'); g.addColorStop(1, 'rgba(255,220,150,0)'); X.fillStyle = g; X.beginPath(); X.moveTo(x, 0); X.lineTo(x + 70, 0); X.lineTo(x + 260, H); X.lineTo(x + 120, H); X.fill() } X.restore();
  // floor + carpet
  const fg = X.createLinearGradient(0, 760, 0, H); fg.addColorStop(0, '#7a4a28'); fg.addColorStop(1, '#3a2010'); X.fillStyle = fg; X.fillRect(0, 760, W, H - 760);
  X.fillStyle = '#8a1a14'; X.beginPath(); X.moveTo(W / 2 - 150, 770); X.lineTo(W / 2 + 150, 770); X.lineTo(W / 2 + 420, H); X.lineTo(W / 2 - 420, H); X.fill(); X.strokeStyle = '#e0b84a'; X.lineWidth = 6; X.stroke();
  X.strokeStyle = 'rgba(255,214,90,.5)'; X.lineWidth = 3; for (let i = 1; i < 6; i++) { const y = 770 + i * 55; const hw = 150 + (y - 770) * .87; X.beginPath(); X.moveTo(W / 2 - hw + 30, y); X.lineTo(W / 2 + hw - 30, y); X.stroke() }
  // lamps
  [[520, 160], [W - 520, 160], [W / 2, 90]].forEach(([x, y], i) => { const f = 1 + .08 * Math.sin(lt * 9 + i); X.strokeStyle = '#3a2414'; X.lineWidth = 3; X.beginPath(); X.moveTo(x, 0); X.lineTo(x, y); X.stroke(); X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createRadialGradient(x, y + 20, 0, x, y + 20, 160 * f); g.addColorStop(0, 'rgba(255,190,80,.6)'); g.addColorStop(1, 'rgba(255,150,40,0)'); X.fillStyle = g; X.fillRect(x - 170, y - 150, 340, 340); X.restore(); X.fillStyle = '#e0b84a'; X.beginPath(); X.moveTo(x - 24, y); X.lineTo(x + 24, y); X.lineTo(x + 12, y + 40); X.lineTo(x - 12, y + 40); X.fill() });
  // throne + emir
  const tx0 = W / 2, ty0 = 760; X.fillStyle = '#5a3418'; X.fillRect(tx0 - 190, ty0 - 40, 380, 60); X.fillStyle = annGold(ty0 - 320, ty0); X.beginPath(); X.moveTo(tx0 - 150, ty0 - 40); X.lineTo(tx0 - 150, ty0 - 300); X.quadraticCurveTo(tx0, ty0 - 380, tx0 + 150, ty0 - 300); X.lineTo(tx0 + 150, ty0 - 40); X.fill();
  X.fillStyle = '#8a1a14'; X.fillRect(tx0 - 120, ty0 - 280, 240, 220);
  person(X, tx0, ty0 - 40, 230, lt, { sit: true, robe: '#a8301e', turban: '#fbf3e2', kulah: '#8a1a14', beard: '#3a322c', mail: true, belt: '#e0b84a' });
  // guards
  [[W / 2 - 330, 1], [W / 2 + 330, -1], [W / 2 - 480, 1], [W / 2 + 480, -1]].forEach(([x, f], i) => person(X, x, 840 + (i > 1 ? 30 : 0), 240, lt, { f, spear: true, shield: i % 2 ? '#2f6a4a' : '#a8301e', robe: i > 1 ? '#5a2a1a' : '#7a2a1a', hat: i > 1 ? 'helmet' : null, turban: '#f2ead6', mail: true, ph: i }));
  // scribe
  person(X, W / 2 + 230, 900, 170, lt, { sit: true, robe: '#2f4a8a', turban: '#f4ecd6', scroll: true });
  // envoy approaching & bowing
  if (p.envoy) { const k = clamp((T - R(p.envoy)) / 2.6), b = p.bow ? ss(R(p.bow), R(p.bow) + .6, T) : 0; person(X, lerp(-120, W / 2 - 200, eout(k)), 1000, 260, lt, { f: 1, walk: k < 1 ? 1 : 0, bow: b, robe: p.envoyRobe || '#1f5a3a', turban: '#f4ecd6', scroll: true }) }
  // incense
  X.save(); X.globalAlpha = .2; for (let i = 0; i < 6; i++) { const yy = 700 - ((lt * 50 + i * 80) % 420); X.strokeStyle = '#e8e0d0'; X.lineWidth = 8; X.beginPath(); X.moveTo(W / 2 + 260 + Math.sin(lt + i) * 15, yy + 60); X.quadraticCurveTo(W / 2 + 280 + 30 * Math.sin(lt * 1.3 + i), yy + 30, W / 2 + 260 + Math.sin(lt * 2 + i) * 25, yy); X.stroke() } X.restore();
  X.restore(); sparkles(lt, 30);
  if (p.title) labelBoxB(W / 2, H * .1, p.title, p.sub || '', p.sub2 || '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5));
  (p.notes || []).forEach(([q, txt], i) => { const a = A(q, .4); if (a > 0) labelBoxB(i % 2 ? W * .82 : W * .18, H * .32 + Math.floor(i / 2) * 120, txt, '', '', a, '#ffd65a', clamp((T - R(q)) / .4), .8) }) }
function sClash(T, p) { // two cavalry lines charge and collide
  const lt = T - SH.t0, clashAt = p.clash ? R(p.clash) - SH.t0 : 2.4; zagrosBack(lt, p.warm ?? .35, 0);
  const L = p.left || ANN.ann, Rt = p.right || ANN.sel; const k = clamp(lt / clashAt);
  for (let row = 0; row < 3; row++) { const y = H * (.66 + row * .12), sc = .62 + row * .2;
    for (let i = 0; i < 5; i++) { const xl = lerp(-300 - i * 150, W / 2 - 120 - i * 150, eout(k)) + (lt > clashAt ? Math.sin(lt * 10 + i) * 12 : 0); horseRider(X, xl, y, 100 * sc, lt, Object.assign({ ph: i + row * 2 }, L.rider, { lance: 'down' }));
      const xr = lerp(W + 300 + i * 150, W / 2 + 120 + i * 150, eout(k)) + (lt > clashAt ? Math.sin(lt * 11 + i) * 12 : 0); horseRider(X, xr, y, 100 * sc, lt, Object.assign({ f: -1, ph: i * 1.3 + row }, Rt.rider)) } }
  if (Rt.rider.bow && lt < clashAt + 1) { X.save(); X.strokeStyle = 'rgba(40,24,10,.8)'; X.lineWidth = 3; for (let i = 0; i < 26; i++) { const u = ((lt * .9 + hash(i)) % 1); const x0 = W * .9 - hash(i + 2) * 300, x1 = W * .25 + hash(i + 5) * 300; const x = lerp(x0, x1, u), y = H * .6 - Math.sin(u * Math.PI) * 300 - hash(i + 7) * 80; X.beginPath(); X.moveTo(x, y); X.lineTo(x + 30, y - 6 + u * 12); X.stroke() } X.restore() }
  if (lt > clashAt) { const c = clamp((lt - clashAt) / .5); X.save(); X.globalCompositeOperation = 'lighter'; const g = X.createRadialGradient(W / 2, H * .72, 0, W / 2, H * .72, 500 * c); g.addColorStop(0, `rgba(255,230,160,${.6 * (1 - c)})`); g.addColorStop(1, 'rgba(255,200,120,0)'); X.fillStyle = g; X.fillRect(0, 0, W, H); X.restore() }
  dustCloud(lt, H * .98, 34); banner(120, H * .62, 260, L.col, lt); banner(W - 260, H * .62, 260, Rt.col, lt, 2, Rt.emblem !== false);
  const a = ss(.2, .6, lt); labelBoxB(W * .2, H * .12, L.name, L.sub, '', a, '#ffb23a', clamp((lt - .2) / .5)); labelBoxB(W * .8, H * .12, Rt.name, Rt.sub, '', a, Rt.tc || '#7fb0ff', clamp((lt - .3) / .5));
  if (p.vs) { X.save(); X.globalAlpha = a; goldHeadB('VS', W / 2, H * .17, 90); X.restore() } if (p.year) yearBadge(p.year, ss(.1, .5, lt)) }
function sSiege(T, p) { // Hulvan besieged and burning
  const lt = T - SH.t0, burn = p.burn ? A(p.burn, 1.2) : 0; const sg = X.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, lerpC('#3a4a8a', '#2a0a10', burn)); sg.addColorStop(.6, lerpC('#e88a5a', '#c8401a', burn)); sg.addColorStop(1, '#ffd0a0'); X.fillStyle = sg; X.fillRect(0, 0, W, H);
  DAY.forEach((r, i) => { if (i < 2) X.drawImage(r, -200 - lt * [3, 6][i], 0) });
  const wallY = 690, z = 1 + .015 * lt; X.save(); X.translate(W / 2, wallY); X.scale(z, z); X.translate(-W / 2, -wallY);
  // city behind walls: domes & minaret
  X.fillStyle = '#b88a5a'; [[620, 120], [900, 160], [1240, 110]].forEach(([x, r]) => { X.beginPath(); X.arc(x, wallY - 150, r * .6, Math.PI, 0); X.fill(); X.fillRect(x - r * .6, wallY - 150, r * 1.2, 150) }); X.fillRect(1080, wallY - 420, 34, 420); X.beginPath(); X.moveTo(1080, wallY - 420); X.lineTo(1097, wallY - 470); X.lineTo(1114, wallY - 420); X.fill();
  // walls + towers
  const wg = X.createLinearGradient(0, wallY - 200, 0, wallY); wg.addColorStop(0, '#d8b080'); wg.addColorStop(1, '#9a7048'); X.fillStyle = wg; X.fillRect(180, wallY - 170, W - 360, 170); for (let x = 180; x < W - 180; x += 40) X.fillRect(x, wallY - 196, 24, 26);
  [240, 600, 960, 1320, 1680].forEach(x => { X.fillStyle = '#c89a68'; X.fillRect(x - 60, wallY - 260, 120, 260); for (let k = 0; k < 4; k++) X.fillRect(x - 60 + k * 34, wallY - 284, 20, 24); X.fillStyle = '#2a140a'; X.fillRect(x - 10, wallY - 200, 20, 40) });
  X.fillStyle = '#3a1e0e'; X.beginPath(); X.moveTo(W / 2 - 70, wallY); X.lineTo(W / 2 - 70, wallY - 110); X.quadraticCurveTo(W / 2, wallY - 170, W / 2 + 70, wallY - 110); X.lineTo(W / 2 + 70, wallY); X.fill();
  X.restore();
  // fires & smoke
  if (burn > 0) { [[600, 1], [960, .8], [1320, 1.1], [820, .7], [1180, .9]].forEach(([x, s], i) => { for (let k = 0; k < 6; k++) { const ph = (lt * .5 + k / 6 + i * .13) % 1; X.save(); X.globalAlpha = burn * .35 * (1 - ph); X.fillStyle = '#2a1a14'; X.beginPath(); X.arc(x + Math.sin(ph * 6 + i) * 40 + ph * 120, wallY - 300 - ph * 600, 60 + ph * 160 * s, 0, TAU); X.fill(); X.restore() }
      X.save(); X.globalCompositeOperation = 'lighter'; for (let k = 0; k < 10; k++) { const h = (80 + hash(k + i) * 140) * s * (1 + .2 * Math.sin(lt * 12 + k)); X.fillStyle = `rgba(255,${120 + hash(k) * 100 | 0},40,${.5 * burn})`; X.beginPath(); X.moveTo(x - 30 + k * 6, wallY - 250); X.quadraticCurveTo(x - 10 + k * 4 + Math.sin(lt * 8 + k) * 14, wallY - 250 - h, x + k * 6, wallY - 250 - h * 1.2); X.quadraticCurveTo(x + 10 + k * 4, wallY - 250 - h * .5, x + 30 + k * 2, wallY - 250); X.fill() } X.restore() }) }
  // attackers in front
  const gy = 1040; const gg = X.createLinearGradient(0, wallY, 0, H); gg.addColorStop(0, '#8a6a40'); gg.addColorStop(1, '#3a2614'); X.fillStyle = gg; X.fillRect(0, wallY, W, H - wallY);
  for (let i = 0; i < 9; i++) horseRider(X, 80 + i * 210 + Math.sin(lt + i) * 10, gy - (i % 2) * 40, 92, lt, { f: 1, gallop: .2, rate: 3, ph: i, horse: ['#3a2a1c', '#5a3a24', '#2a1c14'][i % 3], tunic: '#26345a', cloth: '#10162a', hat: 'bork', hatc: '#1e2a4a', bow: i % 2 === 0, mail: true });
  banner(70, gy - 120, 260, '#141a2a', lt, 0, false); banner(W - 220, gy - 120, 260, '#141a2a', lt, 2, false);
  if (burn > 0) { X.save(); X.strokeStyle = 'rgba(255,170,60,.9)'; X.lineWidth = 3; for (let i = 0; i < 14; i++) { const u = (lt * .7 + hash(i)) % 1, x0 = 200 + hash(i + 1) * 1500, x = lerp(x0, x0 + 260, u), y = 900 - Math.sin(u * Math.PI) * 360; X.beginPath(); X.moveTo(x, y); X.lineTo(x + 26, y - 10 + u * 20); X.stroke() } X.restore() }
  embers(lt, Math.round(80 * burn) + 10); if (p.title) labelBoxB(W / 2, H * .1, p.title, p.sub || '', p.sub2 || '', ss(.2, .6, lt), '#ff7a3a', clamp((lt - .2) / .5)); if (p.year) yearBadge(p.year, ss(.1, .5, lt)) }
function sCaravan(T, p) { // the great Khorasan road through the Hulvan gate
  const lt = T - SH.t0; landscape(lt, lt * 25, p.warm ?? .35);
  const rg = X.createLinearGradient(0, 760, 0, H); rg.addColorStop(0, '#d8b888'); rg.addColorStop(1, '#a88458'); X.fillStyle = rg; X.beginPath(); X.moveTo(0, H); X.quadraticCurveTo(W * .5, 760, W, 800); X.lineTo(W, H); X.fill();
  // gate
  const gx = W * .8; X.fillStyle = '#c89a68'; X.fillRect(gx - 220, 430, 440, 380); X.fillStyle = '#3a1e0e'; X.beginPath(); X.moveTo(gx - 80, 810); X.lineTo(gx - 80, 620); X.quadraticCurveTo(gx, 520, gx + 80, 620); X.lineTo(gx + 80, 810); X.fill(); for (let k = 0; k < 11; k++) { X.fillStyle = '#c89a68'; X.fillRect(gx - 220 + k * 40, 404, 24, 26) }
  [gx - 250, gx + 250].forEach(x => { X.fillStyle = '#b8885a'; X.fillRect(x - 50, 380, 100, 430) }); banner(gx - 250, 380, 160, '#a8301e', lt); banner(gx + 250, 380, 160, '#a8301e', lt, 2);
  // camels
  for (let i = 0; i < 6; i++) { const x = ((lt * 70 + i * 260) % (W + 400)) - 300, y = 900 + (i % 2) * 30; camel(x, y, .9 + (i % 2) * .15, lt, i); if (i % 2 === 0) person(X, x + 150, y + 6, 150, lt, { walk: 1, robe: ['#7a2a1a', '#2f4a8a', '#5a5a2a'][i % 3], turban: '#f4ecd6', ph: i }) }
  dustCloud(lt, H * .98, 16); sparkles(lt, 30);
  if (p.title) labelBoxB(W / 2, H * .1, p.title, p.sub || '', p.sub2 || '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5));
  if (p.road) { const a = A(p.road, .5); X.save(); X.globalAlpha = a; X.font = '900 44px CinzelH'; X.textAlign = 'center'; X.lineWidth = 8; X.strokeStyle = '#2a1206'; X.fillStyle = '#fff'; [['← BAĞDAT', W * .14], ['HORASAN →', W * .58]].forEach(([s, x]) => { X.strokeText(s, x, H * .62); X.fillText(s, x, H * .62) }); X.restore() } }
function camel(x, y, s, t, i) { X.save(); X.translate(x, y); X.scale(s, s); const g = t * 3 + i; X.strokeStyle = '#6a4a2a'; X.lineWidth = 12; X.lineCap = 'round';
  [[-60, 0], [-40, 2], [50, 1], [70, 3]].forEach(([lx, ph]) => { X.beginPath(); X.moveTo(lx, -90); X.lineTo(lx + Math.sin(g + ph) * 18, -10); X.stroke() });
  X.fillStyle = '#b8884a'; X.beginPath(); X.ellipse(0, -110, 95, 45, 0, 0, TAU); X.fill(); X.beginPath(); X.ellipse(-10, -150, 40, 32, 0, 0, TAU); X.fill();
  X.beginPath(); X.moveTo(80, -120); X.quadraticCurveTo(130, -150, 125, -200); X.lineTo(150, -205); X.lineTo(150, -190); X.quadraticCurveTo(150, -140, 95, -95); X.fill();
  X.fillStyle = '#a8301e'; X.fillRect(-60, -190, 100, 40); X.fillStyle = '#e0b84a'; X.fillRect(-60, -160, 100, 8); X.fillStyle = '#2f4a8a'; X.fillRect(-40, -215, 60, 28); X.restore() }
function sCastle(T, p) { // a mountain castle at night (Sirvan)
  const lt = T - SH.t0; const sg = X.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, '#0a0c22'); sg.addColorStop(.6, '#2a2050'); sg.addColorStop(1, '#5a3a5a'); X.fillStyle = sg; X.fillRect(0, 0, W, H);
  X.save(); for (let i = 0; i < 160; i++) { X.fillStyle = `rgba(255,255,240,${.3 + .5 * hash(i + 3) * (.6 + .4 * Math.sin(lt * 2 + i))})`; X.fillRect(hash(i) * W, hash(i + 1) * H * .5, 2, 2) } X.restore();
  X.fillStyle = '#f4ecd6'; X.beginPath(); X.arc(W * .8, H * .18, 50, 0, TAU); X.fill();
  const mnt = (col, base, amp, s) => { X.fillStyle = col; X.beginPath(); X.moveTo(0, H); for (let x = 0; x <= W; x += 20) X.lineTo(x, base - amp * (.6 * Math.abs(Math.sin(x * .003 + s)) + .4 * Math.abs(Math.sin(x * .011 + s * 2)))); X.lineTo(W, H); X.fill() };
  mnt('#1e1a3a', 760, 300, 1); X.save(); X.translate(W * .5, 690); const zc = 1 + .012 * lt; X.scale(zc, zc); fortressA(0, 0, 1.05, 1, lt); X.restore(); X.save(); X.globalCompositeOperation = 'multiply'; X.fillStyle = 'rgba(70,70,140,.55)'; X.fillRect(0, 0, W, H); X.restore();
  X.save(); X.globalCompositeOperation = 'lighter'; [[-210, -60], [180, -70], [-20, -160], [90, -60]].forEach(([x, y], i) => { const f = .7 + .3 * Math.sin(lt * 6 + i); const gx = W * .5 + x * 1.05, gy = 690 + y * 1.05; const g = X.createRadialGradient(gx, gy, 0, gx, gy, 90); g.addColorStop(0, `rgba(255,170,70,${.55 * f})`); g.addColorStop(1, 'rgba(255,140,40,0)'); X.fillStyle = g; X.fillRect(gx - 90, gy - 90, 180, 180) }); X.restore();
  mnt('#100c1e', 940, 160, 4); const fog = X.createLinearGradient(0, 760, 0, 1000); fog.addColorStop(0, 'rgba(160,150,200,0)'); fog.addColorStop(.5, 'rgba(160,150,200,.18)'); fog.addColorStop(1, 'rgba(160,150,200,0)'); X.fillStyle = fog; X.fillRect(0, 760, W, 240);
  if (p.title) labelBoxB(W / 2, H * .1, p.title, p.sub || '', p.sub2 || '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5));
  (p.lines || []).forEach(([q, txt, size, y, font]) => { const a = A(q, .5); if (a <= 0) return; X.save(); X.globalAlpha = a; X.translate(W / 2, y * H); if (font === 'corm') { X.font = `italic 600 ${size}px Corm`; X.textAlign = 'center'; X.lineWidth = 8; X.strokeStyle = 'rgba(10,6,20,.8)'; X.strokeText(txt, 0, 0); X.fillStyle = '#fff'; X.fillText(txt, 0, 0) } else goldHeadB(txt, 0, 0, fitTxt(txt, '900 {s}px CinzelH', 1700, size)); X.restore() }) }
function portraitBG(lt, warm) { const g = X.createRadialGradient(W * .5, H * .55, 0, W * .5, H * .55, W * .7); g.addColorStop(0, warm || '#7a4a20'); g.addColorStop(1, '#120a06'); X.fillStyle = g; X.fillRect(0, 0, W, H); sparkles(lt, 40) }
function sPortrait(T, p) { // painterly ruler portrait with title plate
  const lt = T - SH.t0; portraitBG(lt, p.bg); const z = 1 + .015 * lt; X.save(); X.translate(p.x || W * .32, H * .5); X.scale(z, z); drawPortrait(p.who, 0, 80, p.s || .95, lt, { light: 1.1 }); X.restore();
  const a = ss(.2, .7, lt); X.save(); X.globalAlpha = a; const tx = p.tx || W * .68; goldHeadB(p.name, tx, H * .4, fitTxt(p.name, '900 {s}px CinzelH', 900, p.nsize || 110)); X.restore();
  if (p.sub) { X.save(); X.globalAlpha = ss(.5, 1, lt); X.font = 'italic 600 54px Corm'; X.textAlign = 'center'; X.lineWidth = 6; X.strokeStyle = 'rgba(20,8,4,.8)'; X.strokeText(p.sub, p.tx || W * .68, H * .4 + 80); X.fillStyle = '#ffe9a8'; X.fillText(p.sub, p.tx || W * .68, H * .4 + 80); X.restore() }
  (p.notes || []).forEach(([q, t1, s1], i) => { const k = A(q, .4); if (k > 0) labelBoxB(p.tx || W * .68, H * .62 + i * 130, t1, s1 || '', '', k, '#ffd65a', clamp((T - R(q)) / .4), .9) });
  if (p.year) yearBadge(p.year, ss(.1, .5, lt)) }
function sFeud(T, p) { // uncle vs nephew, cracked split screen
  const lt = T - SH.t0; X.save(); X.beginPath(); X.moveTo(0, 0); X.lineTo(W * .52, 0); X.lineTo(W * .48, H); X.lineTo(0, H); X.clip(); portraitBG(lt, '#2a3a6a'); drawPortrait(p.left[0], W * .25, H * .58, .78, lt, { tilt: .03 }); X.restore();
  X.save(); X.beginPath(); X.moveTo(W * .52, 0); X.lineTo(W, 0); X.lineTo(W, H); X.lineTo(W * .48, H); X.clip(); portraitBG(lt, '#6a2a1a'); drawPortrait(p.right[0], W * .75, H * .58, .78, lt, { tilt: -.03 }); X.restore();
  const c = p.crack ? A(p.crack, .5) : 1; X.save(); X.strokeStyle = '#fff6d8'; X.lineWidth = 8; X.shadowColor = '#ff5a3a'; X.shadowBlur = 30; X.beginPath(); const pts = [[W * .52, 0], [W * .5, 180], [W * .53, 360], [W * .49, 560], [W * .52, 760], [W * .48, H]]; const n = Math.max(1, Math.floor(pts.length * c)); X.moveTo(...pts[0]); for (let i = 1; i < n; i++) X.lineTo(...pts[i]); X.stroke(); X.restore();
  labelBoxB(W * .25, H * .1, p.left[1], p.left[2], '', ss(.2, .6, lt), '#7fb0ff', clamp((lt - .2) / .5)); labelBoxB(W * .75, H * .1, p.right[1], p.right[2], '', ss(.4, .8, lt), '#ff7a5a', clamp((lt - .4) / .5));
  if (p.text) { const a = A(p.text[0], .5); if (a > 0) { X.save(); X.globalAlpha = a; goldHeadB(p.text[1], W / 2, H * .9, 96); X.restore() } } }
function sOrg(T, p) { // governance: emir, family governors, tribe, castles, caravan road
  const lt = T - SH.t0; brightBG(lt, '#fff3d8', '#ffc98a', '#c86a3a'); sparkles(lt, 30); parchment(W * .06, H * .14, W * .88, H * .8, ss(0, .4, lt));
  const top = [W / 2, H * .3]; const k0 = A(0, .5); if (k0 > 0) { X.save(); X.globalAlpha = k0; medalA('emir', top[0], top[1], 110, lt); X.restore(); labelBoxB(top[0], top[1] + 150, 'EMİR', 'Hanedanın başı', '', k0, '#ffb23a', 1, .8) }
  (p.nodes || []).forEach(([q, title, sub, x, y, icon], i) => { const a = A(q, .4); if (a <= 0) return; const nx = W * x, ny = H * y; X.save(); X.globalAlpha = a; X.strokeStyle = '#7a2a10'; X.lineWidth = 5; X.setLineDash([14, 10]); X.beginPath(); X.moveTo(top[0], top[1] + 110); X.lineTo(nx, ny - 70); X.stroke(); X.setLineDash([]); X.restore();
    X.save(); X.globalAlpha = a; X.translate(nx, ny - 20); X.scale(lerp(.6, 1, eback(clamp((T - R(q)) / .4))), lerp(.6, 1, eback(clamp((T - R(q)) / .4)))); orgIcon(icon, lt); X.restore(); labelBoxB(nx, ny + 80, title, sub, '', a, '#ffd65a', clamp((T - R(q)) / .4), .75) });
  if (p.title) labelBoxB(W / 2, H * .08, p.title, p.sub || '', '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5)) }
function orgIcon(kind, t) { X.save(); X.fillStyle = 'rgba(42,20,10,.92)'; X.beginPath(); X.arc(0, 0, 62, 0, TAU); X.fill(); X.lineWidth = 5; X.strokeStyle = annGold(-62, 62); X.stroke();
  if (kind === 'horse') horseRider(X, -10, 42, 30, t, { gallop: .5, lance: 'up', pennant: '#ffd65a', tunic: '#a8301e' });
  else if (kind === 'castle') { X.fillStyle = '#d8b088'; X.fillRect(-36, -10, 72, 40); X.fillRect(-40, -34, 20, 64); X.fillRect(20, -34, 20, 64); X.fillRect(-10, -44, 20, 74) }
  else if (kind === 'caravan') { X.scale(.32, .32); camel(-10, 120, 1, t, 0) }
  else if (kind === 'city') { X.fillStyle = '#d8b088'; X.beginPath(); X.arc(0, 8, 30, Math.PI, 0); X.fill(); X.fillRect(-30, 8, 60, 26); X.fillRect(30, -34, 10, 68) }
  else if (kind === 'coin') { X.fillStyle = annGold(-30, 30); X.beginPath(); X.arc(0, 0, 32, 0, TAU); X.fill(); X.fillStyle = '#7a4a10'; X.font = '900 30px CinzelH'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('✦', 0, 2) }
  else if (kind === 'envoy') { person(X, 0, 46, 90, t, { robe: '#1f5a3a', turban: '#f4ecd6', scroll: true }) } X.restore() }
function medalA(who, x, y, r, t) { X.save(); X.translate(x, y); X.fillStyle = '#120a06'; X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fill(); X.save(); X.beginPath(); X.arc(0, 0, r - 5, 0, TAU); X.clip(); const g = X.createRadialGradient(r * .3, 0, 0, 0, 0, r * 1.2); g.addColorStop(0, '#7a4a20'); g.addColorStop(1, '#140a06'); X.fillStyle = g; X.fillRect(-r, -r, 2 * r, 2 * r); drawPortrait(who, 0, r * .22, r / 330, t); X.restore(); X.lineWidth = 8; X.strokeStyle = annGold(-r, r); X.beginPath(); X.arc(0, 0, r, 0, TAU); X.stroke(); X.restore() }
function sHouses(T, p) { // two Kurdish houses: marriage ties, then rivalry
  const lt = T - SH.t0; brightBG(lt, '#fff3d8', '#ffb06a', '#8a3a5a'); sparkles(lt, 40);
  const ka = ss(.2, .7, lt), kb = ss(.5, 1, lt); X.save(); X.globalAlpha = ka; medalA(p.left[0], W * .27, H * .48, 190, lt); X.restore(); X.save(); X.globalAlpha = kb; medalA(p.right[0], W * .73, H * .48, 190, lt); X.restore();
  labelBoxB(W * .27, H * .82, p.left[1], p.left[2], '', ka, '#ffb23a', clamp((lt - .2) / .5)); labelBoxB(W * .73, H * .82, p.right[1], p.right[2], '', kb, '#8ae0a0', clamp((lt - .5) / .5));
  if (p.ring) { const a = A(p.ring, .5) * (p.rival ? 1 - A(p.rival, .3) : 1); if (a > 0) { X.save(); X.globalAlpha = a; X.strokeStyle = annGold(H * .4, H * .56); X.lineWidth = 12; X.beginPath(); X.arc(W / 2 - 40, H * .48, 60, 0, TAU); X.stroke(); X.beginPath(); X.arc(W / 2 + 40, H * .48, 60, 0, TAU); X.stroke(); X.restore(); labelBoxB(W / 2, H * .25, 'EVLİLİK BAĞI', '', '', a, '#ffd65a', 1, .8) } }
  if (p.rival) { const a = A(p.rival, .4); if (a > 0) { X.save(); X.globalAlpha = a; X.translate(W / 2, H * .48); X.rotate(Math.sin(lt * 6) * .02); X.strokeStyle = '#e8e2d4'; X.lineWidth = 16; X.lineCap = 'round'; X.beginPath(); X.moveTo(-90, -90); X.lineTo(90, 90); X.moveTo(90, -90); X.lineTo(-90, 90); X.stroke(); X.strokeStyle = '#e0b84a'; X.lineWidth = 22; X.beginPath(); X.moveTo(-90, -90); X.lineTo(-70, -70); X.moveTo(90, -90); X.lineTo(70, -70); X.stroke(); X.restore(); labelBoxB(W / 2, H * .25, 'REKABET', 'Zagros geçitleri için', '', a, '#ff7a5a', 1, .8) } } }
function fortressA(cx,cy,s,lit=1,t=0){X.save();X.translate(cx,cy);X.scale(s,s);
  // crag
  const g=X.createLinearGradient(0,-60,0,520);g.addColorStop(0,'#6a4a3a');g.addColorStop(1,'#1e120c');X.fillStyle=g;X.beginPath();X.moveTo(-430,520);X.lineTo(-300,240);X.lineTo(-240,120);X.lineTo(-150,40);X.lineTo(-40,10);X.lineTo(90,20);X.lineTo(210,60);X.lineTo(290,150);X.lineTo(350,300);X.lineTo(460,520);X.fill();
  X.strokeStyle='rgba(255,190,120,.25)';X.lineWidth=4;for(let i=0;i<9;i++){X.beginPath();X.moveTo(-280+i*70,160+hash(i)*60);X.lineTo(-300+i*75,500);X.stroke()}
  // walls
  const wc='#c99a6a',wd='#8a6040';const wall=(x,y,w,h)=>{X.fillStyle=wc;X.fillRect(x,y-h,w,h);X.fillStyle=wd;X.fillRect(x+w*.7,y-h,w*.3,h);X.fillStyle=wc;for(let k=0;k<w;k+=22)X.fillRect(x+k,y-h-14,13,14)};
  wall(-200,40,400,90);wall(-240,60,90,170);wall(150,50,90,190);wall(-60,10,120,230);wall(60,20,70,150);
  X.fillStyle='#2a1810';X.beginPath();X.roundRect(-30,-30,60,70,[30,30,0,0]);X.fill();
  // windows glow
  if(lit){X.save();X.globalCompositeOperation='lighter';[[-210,-60],[-180,-100],[180,-70],[200,-110],[-20,-160],[20,-120],[90,-60]].forEach(([x,y],i)=>{const f=.6+.4*Math.sin(t*3+i*2);X.fillStyle=`rgba(255,190,80,${.9*f*lit})`;X.fillRect(x,y,14,22);const rg=X.createRadialGradient(x+7,y+11,0,x+7,y+11,60);rg.addColorStop(0,`rgba(255,170,60,${.35*f*lit})`);rg.addColorStop(1,'rgba(255,170,60,0)');X.fillStyle=rg;X.fillRect(x-60,y-60,130,140)});X.restore()}
  // banner
  X.strokeStyle='#2a1810';X.lineWidth=5;X.beginPath();X.moveTo(0,-240);X.lineTo(0,-330);X.stroke();X.fillStyle='#e8e2d4';X.beginPath();X.moveTo(0,-330);for(let i=0;i<=8;i++)X.lineTo(i*12,-330+8*Math.sin(t*4+i)+(i===8?40:0));X.lineTo(0,-290);X.fill();X.restore()}
// ---- factions ----
const ANN = {
  ann: { name: 'ANNAZÎLER', sub: 'Şazencan süvarileri', col: '#a8301e', rider: { horse: '#5a3a24', tunic: '#a8301e', cloth: '#a8301e', turban: '#f2ead6', kulah: '#8a1a14', shield: '#e0b84a', cloak: '#e0703a', mail: true } },
  hsn: { name: 'HASANVEYHÎLER', sub: 'Dinever çevresi', col: '#1f6a3a', tc: '#8ae0a0', rider: { horse: '#8a6a4a', tunic: '#1f6a3a', cloth: '#1f5a3a', turban: '#f2ead6', kulah: '#1f5a3a', shield: '#e0b84a', mail: true } },
  sel: { name: 'SELÇUKLULAR', sub: 'İbrahim Yınal · 1046', col: '#141a2a', emblem: false, tc: '#9ab0e0', rider: { horse: '#2a1c14', tunic: '#26345a', cloth: '#10162a', hat: 'bork', hatc: '#1e2a4a', bow: true, mail: true } }
};
// ---- map polities ----
Object.assign(PK, {
  ann: { n: 'ANNAZÎLER', c: '#c8402a', l: [46.0, 34.9], r: [[44.2, 35.5], [45.4, 35.95], [46.4, 35.65], [47.0, 35.05], [47.85, 34.6], [47.6, 34.0], [46.6, 33.85], [45.6, 34.0], [44.8, 34.45], [44.1, 34.9]] },
  annE: { n: 'ANNAZÎLER', c: '#c8402a', l: [45.6, 34.9], r: [[44.9, 35.6], [46.2, 35.7], [46.5, 34.9], [46.2, 34.2], [45.4, 34.1], [44.9, 34.6]] },
  hsn: { n: 'HASANVEYHÎLER', c: '#2f9a5a', l: [47.9, 34.2], r: [[46.7, 34.95], [47.9, 35.15], [48.8, 34.65], [48.6, 33.55], [47.6, 33.25], [46.7, 33.75]] },
  selj: { n: 'SELÇUKLULAR', c: '#3a4a7a', l: [52.5, 34.6], r: [[49.4, 38.4], [56, 38.6], [60, 35.5], [58.5, 30.5], [52, 30.2], [49.2, 32.8], [48.9, 35.6]] }
});
// ---- 7-language menu (TR, KMR, CKB, AR, EN, FR, DE) ----
LANGMENU.ui.push({ rtl: 0, title: 'AUDIO ET SOUS-TITRES EN 7 LANGUES', head: 'Piste audio', items: [], foot: 'Sous-titres : français' }, { rtl: 0, title: 'TON & UNTERTITEL IN 7 SPRACHEN', head: 'Tonspur', items: [], foot: 'Untertitel: Deutsch' });
(function () { const ex = [['Fransızca', 'Almanca'], ['Fransî', 'Almanî'], ['فەڕەنسی', 'ئەڵمانی'], ['الفرنسية', 'الألمانية'], ['French', 'German'], ['Turc (original)', 'Kurmandji', 'Sorani', 'Arabe', 'Anglais', 'Français', 'Allemand'], ['Türkisch (Original)', 'Kurmandschi', 'Sorani', 'Arabisch', 'Englisch', 'Französisch', 'Deutsch']];
  LANGMENU.ui.forEach((u, i) => { if (i < 5) { u.items = u.items.concat(ex[i]); u.title = u.title.replace('5 DİLDE', '7 DİLDE').replace('5 ZIMANAN', '7 ZIMANAN').replace('٥', '٧').replace('بخمس لغات', 'بسبع لغات').replace('5 LANGUAGES', '7 LANGUAGES') } else u.items = ex[i] }) })();
LANGMENU.strip = ['Türkçe', 'Kurmancî', 'سۆرانی', 'العربية', 'English', 'Français', 'Deutsch']; LANGMENU.step = 1.5; LANGMENU.out = 12.2; LANGMENU.left = true;
function drawLangMenu(T) {
  const M = LANGMENU, NL = 7; if (T < M.t0 - .1 || T > M.out + .6) return;
  const aIn = eout(clamp((T - M.t0) / .5)), aOut = 1 - clamp((T - M.out) / .5), a = aIn * aOut; if (a <= 0) return;
  const k = Math.min(NL - 1, Math.max(0, Math.floor((T - M.t0) / M.step))), lt = T - M.t0 - k * M.step;
  const U = M.ui[k], ar = !!U.rtl, F = ar ? 'KufiB' : 'InterB', ih = 42;
  const w = 470, h = 120 + NL * ih + 56, x = M.left ? 46 : W - 46 - w, y = 110 + (1 - aIn) * -30;
  X.save(); X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = `800 ${ar ? 24 : 22}px ${F}`; X.letterSpacing = ar ? '0px' : '2px';
  X.lineJoin = 'round'; X.lineWidth = 6; X.strokeStyle = 'rgba(20,8,4,.85)'; X.strokeText(U.title, x + w / 2, y + 2); X.fillStyle = goldGrad(X, y - 14, y + 16); X.fillText(U.title, x + w / 2, y + 2);
  const py = y + 26; X.shadowColor = 'rgba(0,0,0,.55)'; X.shadowBlur = 26; X.fillStyle = 'rgba(22,12,8,.88)'; X.beginPath(); X.roundRect(x, py, w, h - 26, 16); X.fill(); X.shadowBlur = 0; X.lineWidth = 2.5; X.strokeStyle = '#d9a640'; X.stroke();
  const L = ar ? x + w - 26 : x + 26, al = ar ? 'right' : 'left', dir = ar ? -1 : 1; X.letterSpacing = '0px'; X.textAlign = al; X.direction = ar ? 'rtl' : 'ltr';
  const hy = py + 34; X.font = `800 ${ar ? 24 : 23}px ${F}`; X.fillStyle = '#fff'; X.save(); X.strokeStyle = '#ffd65a'; X.lineWidth = 3; X.beginPath(); X.arc(L + dir * 12, hy + 2, 9, Math.PI, 0); X.stroke(); X.fillStyle = '#ffd65a'; X.fillRect(L + dir * 12 - 11, hy, 5, 9); X.fillRect(L + dir * 12 + 6, hy, 5, 9); X.restore(); X.fillText(U.head, L + dir * 34, hy + 2);
  X.strokeStyle = 'rgba(217,166,64,.45)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 16, hy + 24); X.lineTo(x + w - 16, hy + 24); X.stroke();
  const iy0 = hy + 56; U.items.forEach((it, i) => { const yy = iy0 + i * ih, sel = i === k; if (sel) { const pop = 1 + .06 * Math.sin(Math.PI * clamp(lt / .35)); X.save(); X.translate(x + w / 2, yy); X.scale(pop, pop); X.fillStyle = '#c8201a'; X.beginPath(); X.roundRect(-w / 2 + 14, -18, w - 28, 36, 9); X.fill(); X.strokeStyle = '#ffd65a'; X.lineWidth = 2; X.stroke(); X.restore();
      X.save(); X.strokeStyle = '#fff'; X.lineWidth = 4; X.lineCap = 'round'; const cx = L + dir * 8; X.beginPath(); X.moveTo(cx - 8 * dir, yy); X.lineTo(cx - 2 * dir, yy + 7); X.lineTo(cx + 10 * dir, yy - 8); X.stroke(); X.restore() }
    X.font = `${sel ? 800 : 600} ${ar ? 22 : 21}px ${F}`; X.fillStyle = sel ? '#fff' : 'rgba(255,240,220,.78)'; X.fillText(it, L + dir * 34, yy + 1) });
  if (lt < .6) { const yy = iy0 + k * ih; X.save(); X.globalAlpha = a * (1 - lt / .6); X.strokeStyle = '#ffd65a'; X.lineWidth = 3; X.beginPath(); X.arc(x + w / 2 + dir * 120, yy, 10 + 40 * lt, 0, TAU); X.stroke(); X.restore() }
  const fy = iy0 + NL * ih + 2; X.strokeStyle = 'rgba(217,166,64,.45)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + 16, fy - 20); X.lineTo(x + w - 16, fy - 20); X.stroke();
  X.save(); X.strokeStyle = '#ffd65a'; X.lineWidth = 2.5; X.strokeRect(ar ? L - 24 : L, fy - 9, 24, 18); X.restore(); X.font = `700 ${ar ? 21 : 20}px ${F}`; X.fillStyle = '#ffd65a'; X.fillText(U.foot, L + dir * 34, fy + 1);
  X.direction = 'ltr'; X.textAlign = 'left'; const sy = py + h - 26 + 24; const parts = M.strip.map((s, i) => { X.font = `${i === k ? 800 : 600} 17px ${/[؀-ۿ]/.test(s) ? 'KufiB' : 'InterB'}`; return [s, X.measureText(s).width, X.font] });
  const tot = parts.reduce((q, p) => q + p[1], 0) + 16 * (parts.length - 1); let sx = x + w / 2 - tot / 2; parts.forEach(([s, pw, f], i) => { X.font = f; X.lineWidth = 4; X.strokeStyle = 'rgba(20,8,4,.8)'; X.strokeText(s, sx, sy); X.fillStyle = i === k ? '#ffd65a' : '#fff'; X.fillText(s, sx, sy); if (i < parts.length - 1) { X.fillStyle = '#d9a640'; X.fillText('·', sx + pw + 4, sy) } sx += pw + 16 });
  X.restore()
}
