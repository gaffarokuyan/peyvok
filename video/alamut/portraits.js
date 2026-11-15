// ===== Painterly portraits: Hasan Sabbah (traditional depiction) & Saladin =====
// Drawn in local units: head centre (0,0), face ~190 wide. Light comes from the right (candle / sun).
const PORTRAIT = {
  hasan: { skinL: '#d3a07a', skinD: '#4a2c1e', age: 1, hollow: 1, beard: ['#f4f1ea', '#cfc8bc', '#9a9288'], beardLen: 430, beardW: 128, brow: '#d8d2c6', browAng: .32, turban: ['#f6f1e6', '#d8cfbe', '#8a8070'], turbanH: 240, cap: null, hood: '#16110e', robe: ['#1e1814', '#3e2e22'], mantle: '#2a221c', trim: '#6a5236', nose: 'hook', iris: '#2a1608', mail: false },
  saladin: { skinL: '#d8a27a', skinD: '#5a3420', age: .35, hollow: 0, beard: ['#3a2a1e', '#22160e', '#120a06'], beardLen: 210, beardW: 112, brow: '#24160c', browAng: .12, turban: ['#fbf6ea', '#e2d8c4', '#9a8e78'], turbanH: 205, cap: '#c0302a', robe: ['#1e4a34', '#2f7a52'], mantle: '#1a3a28', trim: '#d8b04c', nose: 'straight', iris: '#3a2210', mail: true }
};
function drawPortrait(who, cx, cy, S, t, o = {}) {
  const P = PORTRAIT[who], c = X; const light = o.light ?? 1, flick = 1 + .06 * Math.sin(t * 9.3) + .04 * Math.sin(t * 23.1);
  const breath = Math.sin(t * 1.6) * 3, tilt = Math.sin(t * .5) * .015 + (o.tilt || 0), blink = (t % (o.blinkEvery || 4.3)) < .13;
  const lg = (x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([p, col]) => g.addColorStop(p, col)); return g };
  const rg = (x, y, r0, r1, stops) => { const g = c.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([p, col]) => g.addColorStop(p, col)); return g };
  c.save(); c.translate(cx, cy); c.scale(S, S);
  // ---------- body / robe ----------
  c.save(); c.translate(0, breath);
  c.fillStyle = lg(-420, 0, 420, 0, [[0, P.robe[0]], [.62, P.robe[0]], [1, P.robe[1]]]);
  c.beginPath(); c.moveTo(-120, 150); c.bezierCurveTo(-260, 170, -400, 230, -440, 420); c.lineTo(-480, 1100); c.lineTo(480, 1100); c.lineTo(440, 420); c.bezierCurveTo(400, 230, 260, 170, 120, 150); c.closePath(); c.fill();
  if (P.mail) { c.save(); c.clip(); c.strokeStyle = 'rgba(190,200,210,.16)'; c.lineWidth = 2; for (let r = 0; r < 60; r++) for (let q = 0; q < 70; q++) { const x = -460 + q * 13.5 + (r % 2) * 6.7, y = 170 + r * 11; c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.stroke() } c.restore();
    c.fillStyle = lg(-300, 0, 300, 0, [[0, '#4a5058'], [.6, '#6a7078'], [1, '#c0c6cc']]); c.beginPath(); c.moveTo(-150, 160); c.quadraticCurveTo(-330, 210, -380, 330); c.lineTo(-250, 330); c.quadraticCurveTo(-200, 230, -100, 200); c.fill(); c.beginPath(); c.moveTo(150, 160); c.quadraticCurveTo(330, 210, 380, 330); c.lineTo(250, 330); c.quadraticCurveTo(200, 230, 100, 200); c.fill() }
  // mantle edges + inner tunic
  c.fillStyle = P.mantle; c.beginPath(); c.moveTo(-70, 160); c.lineTo(-170, 1100); c.lineTo(170, 1100); c.lineTo(70, 160); c.fill();
  c.strokeStyle = P.trim; c.lineWidth = 12; c.beginPath(); c.moveTo(-72, 165); c.lineTo(-175, 1100); c.moveTo(72, 165); c.lineTo(175, 1100); c.stroke();
  c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 6; for (const [x0, x1] of [[-260, -300], [-200, -230], [230, 280], [300, 350]]) { c.beginPath(); c.moveTo(x0, 300); c.quadraticCurveTo((x0 + x1) / 2 - 20, 600, x1, 1100); c.stroke() }
  c.restore();
  // ---------- head ----------
  c.save(); c.rotate(tilt);
  if (P.hood) { c.fillStyle = lg(-220, 0, 220, 0, [[0, '#0a0806'], [.7, P.hood], [1, '#3a2a20']]); c.beginPath(); c.moveTo(-150, 200); c.bezierCurveTo(-230, 40, -220, -220, -120, -300); c.bezierCurveTo(-40, -360, 40, -360, 120, -300); c.bezierCurveTo(220, -220, 230, 40, 150, 200); c.closePath(); c.fill(); c.fillStyle = 'rgba(0,0,0,.55)'; c.beginPath(); c.ellipse(0, -40, 150, 210, 0, 0, Math.PI * 2); c.fill() }
  // ears
  c.fillStyle = P.skinD; c.beginPath(); c.ellipse(-100, -20, 18, 36, .1, 0, Math.PI * 2); c.fill(); c.fillStyle = lg(90, 0, 120, 0, [[0, P.skinL], [1, '#a8704a']]); c.beginPath(); c.ellipse(100, -20, 18, 36, -.1, 0, Math.PI * 2); c.fill();
  // face shape
  const face = new Path2D(); face.moveTo(-88, -120); face.bezierCurveTo(-104, -60, -100, 0, -88, 40); face.bezierCurveTo(-78, 90 - P.hollow * 10, -60, 140, 0, 160); face.bezierCurveTo(60, 140, 78, 90 - P.hollow * 10, 88, 40); face.bezierCurveTo(100, 0, 104, -60, 88, -120); face.closePath();
  c.fillStyle = lg(-110, 0, 110, 0, [[0, P.skinD], [.42, mix(P.skinD, P.skinL, .55)], [1, P.skinL]]); c.fill(face);
  c.save(); c.clip(face);
  c.fillStyle = rg(55, -15, 5, 95, [[0, `rgba(255,214,170,${.45 * light * flick})`], [1, 'rgba(255,214,170,0)']]); c.fillRect(-120, -140, 240, 320);
  if (P.hollow) { [[-58, 52], [58, 52]].forEach(([x, y], i) => { c.fillStyle = rg(x, y, 2, 46, [[0, `rgba(40,20,10,${i ? .38 : .55})`], [1, 'rgba(40,20,10,0)']]); c.fillRect(x - 60, y - 60, 120, 120) }) }
  // eye sockets
  [[-40, -30], [40, -30]].forEach(([x, y], i) => { c.fillStyle = rg(x, y, 4, 42, [[0, `rgba(30,14,6,${i ? .45 : .7})`], [1, 'rgba(30,14,6,0)']]); c.fillRect(x - 50, y - 50, 100, 100) });
  // wrinkles
  c.strokeStyle = 'rgba(60,30,15,.45)'; c.lineCap = 'round';
  for (let i = 0; i < 3 * P.age; i++) { c.lineWidth = 2.4; c.beginPath(); c.moveTo(-58, -92 + i * 11); c.quadraticCurveTo(0, -100 + i * 11, 58, -92 + i * 11); c.stroke() }
  if (P.age > .5) { for (const s of [-1, 1]) { c.lineWidth = 2; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(s * 66, -26 + i * 8); c.lineTo(s * 84, -32 + i * 12); c.stroke() } c.lineWidth = 3; c.beginPath(); c.moveTo(s * 20, 22); c.quadraticCurveTo(s * 42, 50, s * 40, 84); c.stroke(); c.lineWidth = 2.2; c.beginPath(); c.moveTo(s * 22, -10); c.quadraticCurveTo(s * 40, -2, s * 56, -8); c.stroke() } }
  c.restore();
  // eyes
  const gaze = Math.sin(t * .7) * 3 + (o.gaze || 0);
  [[-40, -30, 0], [40, -30, 1]].forEach(([x, y, i]) => {
    if (blink) { c.strokeStyle = '#2a140a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 20, y); c.quadraticCurveTo(x, y + 5, x + 20, y); c.stroke(); return }
    const eye = new Path2D(); eye.moveTo(x - 21, y); eye.quadraticCurveTo(x, y - 13, x + 21, y - 1); eye.quadraticCurveTo(x, y + 9, x - 21, y); c.fillStyle = i ? '#e8dcc8' : '#8a7a68'; c.fill(eye);
    c.save(); c.clip(eye); c.fillStyle = P.iris; c.beginPath(); c.arc(x + gaze, y - 2, 9.5, 0, Math.PI * 2); c.fill(); c.fillStyle = '#050302'; c.beginPath(); c.arc(x + gaze, y - 2, 4.5, 0, Math.PI * 2); c.fill();
    c.fillStyle = `rgba(255,240,210,${.9 * flick})`; c.beginPath(); c.arc(x + gaze + 3.5, y - 5, 2.6, 0, Math.PI * 2); c.fill(); c.restore();
    c.strokeStyle = '#1a0a04'; c.lineWidth = 4.5; c.beginPath(); c.moveTo(x - 22, y + 1); c.quadraticCurveTo(x, y - 15, x + 22, y - 1); c.stroke();
    c.strokeStyle = 'rgba(60,30,15,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 17, y + 10); c.quadraticCurveTo(x, y + 17, x + 17, y + 9); c.stroke() });
  // eyebrows (stroked hair)
  for (const s of [-1, 1]) { for (let k = 0; k < 26; k++) { const u = k / 25, x = s * (14 + u * 50), y = -54 - Math.sin(u * Math.PI) * 6 + (1 - u) * P.browAng * 26 * (P.age > .5 ? 1 : .6); c.strokeStyle = k % 3 ? P.brow : mix(P.brow, '#000000', .35); c.lineWidth = P.age > .5 ? 3.4 : 4; c.beginPath(); c.moveTo(x, y + 4); c.lineTo(x + s * 9, y - 6 + hashP(k + s) * 6); c.stroke() } }
  // nose
  c.fillStyle = lg(-20, 0, 25, 0, [[0, mix(P.skinD, P.skinL, .25)], [1, P.skinL]]);
  c.beginPath(); if (P.nose === 'hook') { c.moveTo(-6, -36); c.bezierCurveTo(-4, -10, 4, 10, 16, 34); c.quadraticCurveTo(22, 50, 6, 54); c.quadraticCurveTo(-10, 56, -22, 46); c.quadraticCurveTo(-14, 30, -10, -36) } else { c.moveTo(-6, -36); c.bezierCurveTo(-6, -6, 2, 20, 10, 38); c.quadraticCurveTo(14, 50, 2, 52); c.quadraticCurveTo(-12, 54, -22, 44); c.quadraticCurveTo(-14, 26, -12, -36) } c.fill();
  c.strokeStyle = 'rgba(50,25,12,.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-10, -30); c.bezierCurveTo(-12, 0, -16, 26, -24, 44); c.stroke();
  c.fillStyle = 'rgba(255,225,190,.5)'; c.beginPath(); c.ellipse(6, 6, 4, 22, -.2, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#2a1408'; c.beginPath(); c.ellipse(-12, 50, 7, 3.5, .3, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(8, 50, 6, 3, -.3, 0, Math.PI * 2); c.fill();
  // beard mass
  const BL = P.beardLen, BW = P.beardW, sway = Math.sin(t * 1.1) * 6;
  const beard = new Path2D(); beard.moveTo(-90, 10); beard.bezierCurveTo(-100, 90, -BW - 10, 160, -BW * .8, BL * .55); beard.bezierCurveTo(-BW * .6, BL * .8, -30 + sway, BL * .95, sway * .6, BL); beard.bezierCurveTo(30 + sway, BL * .95, BW * .6, BL * .8, BW * .8, BL * .55); beard.bezierCurveTo(BW + 10, 160, 100, 90, 90, 10);
  beard.bezierCurveTo(80, 60, 50, 74, 26, 72); beard.quadraticCurveTo(0, 82, -26, 72); beard.bezierCurveTo(-50, 74, -80, 60, -90, 10);
  c.fillStyle = lg(-BW, 0, BW, BL, [[0, P.beard[2]], [.45, P.beard[1]], [.75, P.beard[0]], [1, P.beard[1]]]); c.fill(beard);
  c.save(); c.clip(beard); for (let k = 0; k < 140; k++) { const u = hashP(k * 1.3), x0 = (u - .5) * BW * 2, y0 = 30 + hashP(k * 2.1) * 80, L = BL * (.45 + hashP(k * 3.7) * .55); c.strokeStyle = k % 4 === 0 ? 'rgba(0,0,0,.25)' : (hashP(k) > .5 ? P.beard[0] : P.beard[1]); c.globalAlpha = .55; c.lineWidth = 2 + hashP(k * 5) * 2;
    c.beginPath(); c.moveTo(x0, y0); c.bezierCurveTo(x0 * 1.05, y0 + L * .3, x0 * .7 + sway * .5, y0 + L * .7, x0 * .35 + sway, y0 + L); c.stroke() } c.globalAlpha = 1;
  c.fillStyle = rg(70, 120, 10, 200, [[0, `rgba(255,220,170,${.35 * light * flick})`], [1, 'rgba(255,220,170,0)']]); c.fillRect(-BW - 20, 0, BW * 2 + 40, BL); c.restore();
  // mustache
  for (const s of [-1, 1]) { c.fillStyle = s > 0 ? P.beard[0] : P.beard[1]; c.beginPath(); c.moveTo(0, 58); c.bezierCurveTo(s * 20, 54, s * 44, 66, s * 58, 96); c.bezierCurveTo(s * 40, 84, s * 20, 76, 0, 72); c.fill() }
  c.strokeStyle = 'rgba(40,15,10,.7)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-16, 82); c.quadraticCurveTo(0, 86, 16, 82); c.stroke();
  // hat (Seljuk fur-brimmed börk) instead of turban
  if (P.hat === 'bork') { c.save(); c.fillStyle = lg(-120, 0, 120, 0, [[0, '#0e1430'], [.6, '#1e2a5a'], [1, '#3a4a8a']]); c.beginPath(); c.moveTo(-104, -96); c.bezierCurveTo(-90, -230, -30, -330, 10, -340); c.bezierCurveTo(50, -330, 100, -230, 104, -96); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(216,176,76,.8)'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, -330); c.lineTo(0, -110); c.stroke();
    c.fillStyle = lg(0, -140, 0, -80, [[0, '#8a6a44'], [1, '#4a3420']]); c.beginPath(); c.ellipse(0, -100, 132, 34, 0, 0, Math.PI * 2); c.fill(); c.strokeStyle = 'rgba(30,18,8,.5)'; c.lineWidth = 3; for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2; c.beginPath(); c.moveTo(Math.cos(a) * 120, -100 + Math.sin(a) * 28); c.lineTo(Math.cos(a) * 132, -100 + Math.sin(a) * 36); c.stroke() } c.restore() }
  else {
  // turban
  const TH = P.turbanH; c.save();
  const tb = new Path2D(); tb.moveTo(-112, -82); tb.bezierCurveTo(-150, -120, -160, -TH * .75, -110, -TH * .95); tb.bezierCurveTo(-60, -TH * 1.1, 60, -TH * 1.1, 110, -TH * .95); tb.bezierCurveTo(160, -TH * .75, 150, -120, 112, -82); tb.bezierCurveTo(60, -104, -60, -104, -112, -82);
  c.fillStyle = lg(-160, 0, 160, 0, [[0, P.turban[2]], [.45, P.turban[1]], [1, P.turban[0]]]); c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowBlur = 30; c.fill(tb); c.shadowColor = 'transparent';
  c.clip(tb); for (let i = 0; i < 10; i++) { const y = -90 - i * TH * .1, a = .18; c.strokeStyle = 'rgba(90,80,64,.45)'; c.lineWidth = 5; c.beginPath(); c.moveTo(-170, y + 40 * a * 4); c.quadraticCurveTo(0, y - 16, 170, y - 40 * a * 4); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 3; c.beginPath(); c.moveTo(-170, y + 40 * a * 4 - 7); c.quadraticCurveTo(0, y - 23, 170, y - 40 * a * 4 - 7); c.stroke() }
  if (P.cap) { c.fillStyle = lg(-40, 0, 40, 0, [[0, '#7a1a14'], [1, P.cap]]); c.beginPath(); c.ellipse(0, -TH * .98, 50, 34, 0, Math.PI, 0); c.fill(); c.fillStyle = '#d8b04c'; c.fillRect(-150, -112, 300, 10) }
  c.restore();
  if (P.cap) { c.fillStyle = '#ffd86a'; c.beginPath(); c.arc(0, -110, 10, 0, Math.PI * 2); c.fill() }
  }
  c.restore(); // head
  c.restore(); // root
  function mix(a, b, k) { const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('') }
}
function hashP(n) { const s = Math.sin(n * 91.7 + 13.3) * 43758.5453; return s - Math.floor(s) }
