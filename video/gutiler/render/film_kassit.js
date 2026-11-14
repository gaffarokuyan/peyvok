// ================= KASSİTLER — extra palettes, parametric overrides and new scenes =================
PAL.hitit = { skin: '#c58a5c', tunic: '#7a5a3a', kilt: '#4a3420', helmet: '#c0c6ce', plume: '#2a2a2a', shield: '#8a6a3a', rim: '#3a2410', cloak: '#5a4a8a', metal: '#e8e2d4', beard: '#2a1a10', boot: '#3a2414' };
PAL.elam = { skin: '#b97d52', tunic: '#5a2a8a', kilt: '#3a1a5a', helmet: '#d8b04c', plume: '#e8c547', shield: '#c8962e', rim: '#5a3a10', cloak: '#8a4ab8', metal: '#e8e2d4', beard: '#1a1008', boot: '#3a2414' };
PAL.mak = { skin: '#d49a6a', tunic: '#c8201a', kilt: '#7a1010', helmet: '#e0b84a', plume: '#ffffff', shield: '#d8b04c', rim: '#6a4a10', cloak: '#8a1a1a', metal: '#e8e2d4', beard: '#5a3a1a', boot: '#4a2a16' };
// ---- title with parameters
const _sTitle = sTitle;
sTitle = function (T, p) { if (!p || !p.title) return _sTitle(T, p); const lt = T - SH.t0; landscape(lt, lt * 30, .25); sparkles(lt, 80);
  X.save(); X.globalAlpha = ss(.2, .8, lt); const k = eback(clamp((lt - .2) / .7)); X.translate(W / 2, H * .42); X.scale(lerp(.5, 1, k), lerp(.5, 1, k)); goldHeadB(p.title, 0, 0, 210); X.restore();
  X.save(); X.globalAlpha = ss(.9, 1.5, lt); X.textAlign = 'center'; X.letterSpacing = '6px'; { let fs = 64; X.font = `900 ${fs}px CinzelH`; while (X.measureText(p.sub).width > 1640 && fs > 30) { fs -= 2; X.font = `900 ${fs}px CinzelH` } } X.lineJoin = 'round'; X.lineWidth = 10; X.strokeStyle = '#2a1206'; X.strokeText(p.sub, W / 2, H * .42 + 110); X.fillStyle = '#fff'; X.fillText(p.sub, W / 2, H * .42 + 110);
  X.font = 'italic 600 50px Corm'; X.letterSpacing = '2px'; X.lineWidth = 6; X.strokeText(p.tag, W / 2, H * .42 + 185); X.fillStyle = '#ffe9a8'; X.fillText(p.tag, W / 2, H * .42 + 185); X.restore();
  if (LOGO.complete) { X.save(); X.globalAlpha = ss(1.2, 1.8, lt); X.beginPath(); X.arc(W / 2, H * .83, 85, 0, TAU); X.clip(); X.drawImage(LOGO, W / 2 - 90, H * .83 - 90, 180, 180); X.restore() } };
// ---- Amarna with parameters (left/right emblems + labels)
const _emblem = emblem;
emblem = function (x, y, kind, a) { if (kind !== 'kas') return _emblem(x, y, kind, a); X.save(); X.globalAlpha = a; X.translate(x, y); X.fillStyle = '#fff6dc'; X.beginPath(); X.arc(0, 0, 130, 0, TAU); X.fill(); X.strokeStyle = '#c8962e'; X.lineWidth = 6; X.stroke();
  // Kassite emblem: horse head + 8-pointed star of Shamash
  X.fillStyle = '#e0b13a'; X.beginPath(); for (let i = 0; i < 16; i++) { const r = i % 2 ? 26 : 62, an = i * Math.PI / 8 - Math.PI / 2; X.lineTo(Math.cos(an) * r, -30 + Math.sin(an) * r * .0 + Math.sin(an) * r) } X.closePath(); X.save(); X.translate(0, -18); X.scale(.62, .62); X.fill(); X.restore();
  X.fillStyle = '#7a3a10'; X.beginPath(); X.moveTo(-40, 85); X.quadraticCurveTo(-46, 30, -10, 12); X.quadraticCurveTo(30, -2, 52, 22); X.quadraticCurveTo(58, 36, 42, 40); X.quadraticCurveTo(20, 38, 8, 48); X.quadraticCurveTo(12, 70, 20, 85); X.closePath(); X.fill();
  X.fillStyle = '#d2322a'; X.beginPath(); X.moveTo(-36, 30); X.quadraticCurveTo(-20, 0, 0, 8); X.lineTo(-30, 60); X.fill(); X.restore() };
const _sAmarna = sAmarna;
sAmarna = function (T, p) { if (!p || !p.left) return _sAmarna(T, p); const lt = T - SH.t0; brightBG(lt, '#fff3c8', '#ffc07a', '#5aa0e0'); tabletShape(W / 2, H * .52, 330, 440, .04, lt, 9);
  emblem(W * .2, H * .45, p.left[0], ss(.2, .6, lt)); emblem(W * .8, H * .45, p.right[0], ss(.4, .8, lt));
  labelBoxB(W * .2, H * .75, p.left[1], p.left[2], '', ss(.4, .8, lt), '#ffb23a', clamp((lt - .4) / .5)); labelBoxB(W * .8, H * .75, p.right[1], p.right[2], '', ss(.6, 1, lt), '#7ad06a', clamp((lt - .6) / .5));
  labelBoxB(W / 2, H * .13, 'AMARNA MEKTUPLARI', 'MÖ 14. yüzyıl', '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5));
  X.save(); X.globalAlpha = ss(1, 1.4, lt); X.strokeStyle = '#fff'; X.lineWidth = 6; X.setLineDash([18, 14]); X.lineDashOffset = -lt * 60; X.beginPath(); X.moveTo(W * .28, H * .45); X.lineTo(W * .38, H * .45); X.moveTo(W * .62, H * .45); X.lineTo(W * .72, H * .45); X.stroke(); X.restore();
  if (p.quote) { const a = A(p.quote[0], .5); if (a > 0) { parchment(W * .5 - 560, H * .8, 1120, 120, a); X.save(); X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle'; const s = fitTxt(p.quote[1], 'italic 600 {s}px Corm', 1040, 46); X.font = `italic 600 ${s}px Corm`; X.fillStyle = '#4a2a10'; X.fillText(p.quote[1], W / 2, H * .8 + 62); X.restore() } } };
// ---- city sack with palette param
const _sNineveh = sNineveh;
sNineveh = function (T, p) { if (!p || !p.pal) return _sNineveh(T, p); const save = PAL.med; PAL.med = PAL[p.pal]; try { _sNineveh(T, p) } finally { PAL.med = save } };
// ---- GOLD letter: furnace melting 40 mina -> 10 mina
function sGold(T, p) { const lt = T - SH.t0; museum(lt, '#2a1408', '#120804');
  const fx = W * .62, fy = H * .62; // furnace
  X.save(); X.fillStyle = '#5a3a22'; X.beginPath(); X.moveTo(fx - 260, fy + 240); X.lineTo(fx - 200, fy - 140); X.quadraticCurveTo(fx, fy - 260, fx + 200, fy - 140); X.lineTo(fx + 260, fy + 240); X.closePath(); X.fill();
  X.fillStyle = '#3a2414'; X.beginPath(); X.ellipse(fx, fy + 40, 130, 110, 0, 0, TAU); X.fill(); X.restore();
  const heat = ss(.4, 1.6, lt); X.save(); X.globalCompositeOperation = 'lighter'; for (let i = 0; i < 26; i++) { const h = 90 + 70 * Math.sin(lt * 7 + i * 1.3) + hash(i) * 60; const xx = fx - 100 + i * 8; const g = X.createLinearGradient(0, fy + 120 - h, 0, fy + 130); g.addColorStop(0, 'rgba(255,240,150,0)'); g.addColorStop(.4, `rgba(255,170,50,${.7 * heat})`); g.addColorStop(1, `rgba(255,80,20,${.9 * heat})`); X.fillStyle = g; X.beginPath(); X.moveTo(xx - 16, fy + 130); X.quadraticCurveTo(xx + Math.sin(lt * 8 + i) * 12, fy + 120 - h, xx + 16, fy + 130); X.fill() }
  const gl = X.createRadialGradient(fx, fy + 60, 10, fx, fy + 60, 520); gl.addColorStop(0, `rgba(255,170,60,${.45 * heat})`); gl.addColorStop(1, 'rgba(255,120,30,0)'); X.fillStyle = gl; X.fillRect(0, 0, W, H); X.restore();
  // gold ingots: 40 shrink to 10
  const melt = ss(R(p.melt) - SH.t0, R(p.melt) - SH.t0 + 2.2, lt); const n = 40, left = Math.round(lerp(40, 10, melt));
  for (let i = 0; i < n; i++) { const col = i % 8, row = Math.floor(i / 8); const x = W * .1 + col * 62, y = H * .32 + row * 46; const alive = i < left; const k = alive ? 1 : 1 - clamp((melt * 40 - (40 - i)) / 1);
    if (k <= 0) continue; X.save(); X.globalAlpha = k; X.translate(x, y); X.fillStyle = goldGrad(X, -14, 14); X.beginPath(); X.moveTo(-26, 14); X.lineTo(-18, -14); X.lineTo(18, -14); X.lineTo(26, 14); X.closePath(); X.fill(); X.strokeStyle = '#8a5a14'; X.lineWidth = 2; X.stroke(); X.restore() }
  X.save(); X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '900 120px CinzelH'; X.lineJoin = 'round'; X.lineWidth = 12; X.strokeStyle = '#1a0703'; const num = `${left} MİNA`; X.strokeText(num, W * .24, H * .74); X.fillStyle = goldGrad(X, H * .74 - 50, H * .74 + 40); X.fillText(num, W * .24, H * .74); X.restore();
  labelBoxB(W * .5, H * .12, p.title || 'BURNABURİAŞ’IN ŞİKÂYETİ', p.sub || 'Kassit kralından firavuna mektup', '', ss(.2, .6, lt), '#ffb23a', clamp((lt - .2) / .5));
  if (p.quote) { const a = A(p.quote[0], .5); if (a > 0) { parchment(W * .5 - 600, H * .84, 1200, 120, a); X.save(); X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle'; const s = fitTxt(p.quote[1], 'italic 600 {s}px Corm', 1120, 48); X.font = `italic 600 ${s}px Corm`; X.fillStyle = '#4a2a10'; X.fillText(p.quote[1], W / 2, H * .84 + 62); X.restore() } } }
// ---- KUDURRU boundary stone
function sKudurru(T, p) { const lt = T - SH.t0; museum(lt, '#fff6e6', '#f0cf9c'); const z = 1 + .025 * lt; X.save(); X.translate(W * .33, H * .54); X.scale(z, z);
  const w = 340, h = 760; X.save(); X.shadowColor = 'rgba(80,40,10,.45)'; X.shadowBlur = 50; X.shadowOffsetX = 24; X.beginPath(); X.moveTo(-w / 2, h / 2); X.lineTo(-w / 2 + 10, -h / 2 + 170); X.quadraticCurveTo(-w / 2 + 20, -h / 2 - 10, 0, -h / 2); X.quadraticCurveTo(w / 2 - 20, -h / 2 - 10, w / 2 - 10, -h / 2 + 170); X.lineTo(w / 2, h / 2); X.closePath();
  const g = X.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#4a4440'); g.addColorStop(.5, '#7a7068'); g.addColorStop(1, '#3a3430'); X.fillStyle = g; X.fill(); X.restore();
  X.save(); X.beginPath(); X.moveTo(-w / 2, h / 2); X.lineTo(-w / 2 + 10, -h / 2 + 170); X.quadraticCurveTo(-w / 2 + 20, -h / 2 - 10, 0, -h / 2); X.quadraticCurveTo(w / 2 - 20, -h / 2 - 10, w / 2 - 10, -h / 2 + 170); X.lineTo(w / 2, h / 2); X.closePath(); X.clip(); X.globalAlpha = .25; X.globalCompositeOperation = 'multiply'; X.drawImage(SMOKE, -w, -h / 2, w * 2, h); X.restore();
  // registers of divine symbols appearing one by one
  const SYM = [
    ['star', -90, -270], ['moon', 0, -285], ['sun', 90, -270],
    ['spade', -80, -140], ['stylus', 0, -150], ['horse', 80, -140],
    ['snake', 0, -20]];
  const k = p.sym ? ss(R(p.sym) - SH.t0, R(p.sym) - SH.t0 + 2.4, lt) : ss(.5, 3, lt);
  SYM.forEach(([s, x, y], i) => { const a = clamp(k * SYM.length - i); if (a <= 0) return; X.save(); X.globalAlpha = a; X.translate(x, y); const sc = lerp(1.5, 1, eout(a)); X.scale(sc, sc);
    X.strokeStyle = '#e8d8b0'; X.fillStyle = '#e8d8b0'; X.lineWidth = 6; X.lineCap = 'round'; X.shadowColor = 'rgba(255,220,140,.8)'; X.shadowBlur = 12 * (1 - a) + 4;
    if (s === 'star') { X.beginPath(); for (let j = 0; j < 16; j++) { const r = j % 2 ? 12 : 34, an = j * Math.PI / 8; X.lineTo(Math.cos(an) * r, Math.sin(an) * r) } X.closePath(); X.fill() }
    else if (s === 'moon') { X.beginPath(); X.arc(0, 0, 30, .3, Math.PI - .3, false); X.stroke(); X.beginPath(); X.arc(0, -4, 22, 0, TAU); X.stroke() }
    else if (s === 'sun') { X.beginPath(); X.arc(0, 0, 16, 0, TAU); X.fill(); for (let j = 0; j < 8; j++) { const an = j * Math.PI / 4; X.beginPath(); X.moveTo(Math.cos(an) * 22, Math.sin(an) * 22); X.quadraticCurveTo(Math.cos(an + .3) * 30, Math.sin(an + .3) * 30, Math.cos(an) * 38, Math.sin(an) * 38); X.stroke() } }
    else if (s === 'spade') { X.beginPath(); X.moveTo(0, 50); X.lineTo(0, -20); X.stroke(); X.beginPath(); X.moveTo(-14, -20); X.lineTo(0, -48); X.lineTo(14, -20); X.closePath(); X.fill() }
    else if (s === 'stylus') { X.beginPath(); X.moveTo(-8, 50); X.lineTo(-8, -40); X.moveTo(8, 50); X.lineTo(8, -40); X.stroke() }
    else if (s === 'horse') { X.beginPath(); X.moveTo(-20, 45); X.quadraticCurveTo(-26, 0, -6, -12); X.quadraticCurveTo(14, -26, 30, -8); X.quadraticCurveTo(32, 4, 20, 6); X.quadraticCurveTo(8, 8, 4, 18); X.quadraticCurveTo(8, 34, 12, 45); X.closePath(); X.fill() }
    else if (s === 'snake') { X.beginPath(); for (let j = 0; j <= 30; j++) { const t = j / 30; X.lineTo(lerp(-120, 120, t), Math.sin(t * 9) * 18) } X.stroke() }
    X.restore() });
  // cuneiform text band
  const ta = ss(1.2, 2, lt); X.save(); X.globalAlpha = ta * .9; X.fillStyle = '#d8c8a0'; for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) { if (hash(r * 13 + c) < .2) continue; const x = -130 + c * 30, y = 70 + r * 30; X.beginPath(); X.moveTo(x, y); X.lineTo(x + 14, y + 5); X.lineTo(x, y + 10); X.fill(); X.fillRect(x + 6, y + 3, 14, 3) } X.restore();
  X.restore();
  labelBoxB(W * .72, H * .2, p.title || 'KUDURRU', p.sub || 'Kassit sınır taşı', p.sub2 || 'TOPRAK BAĞIŞLARI · TANRI SEMBOLLERİ', ss(.3, .7, lt), '#ffb23a', clamp((lt - .3) / .5));
  (p.notes || []).forEach(([q, txt], i) => { const a = A(q, .4); if (a <= 0) return; X.save(); parchment(W * .53, H * .42 + i * 170, 760, 140, a); X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle'; const s = fitTxt(txt, '700 {s}px Cinzel', 680, 46); X.font = `700 ${s}px Cinzel`; X.fillStyle = '#4a2a10'; X.fillText(txt, W * .53 + 380, H * .42 + i * 170 + 72); X.restore() }) }
// ---- BLACK STELE of Hammurabi carried to Susa / Louvre
function sBlackStele(T, p) { const lt = T - SH.t0; museum(lt, p.museum ? '#f2f6fa' : '#fff6e6', p.museum ? '#c8d4e0' : '#f0cf9c'); const z = 1 + .02 * lt; X.save(); X.translate(W * .32, H * .53); X.scale(z, z);
  const w = 300, h = 800; X.save(); X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = 50; X.shadowOffsetX = 20; X.beginPath(); X.moveTo(-w / 2, h / 2); X.lineTo(-w / 2 + 6, -h / 2 + 120); X.quadraticCurveTo(0, -h / 2 - 60, w / 2 - 6, -h / 2 + 120); X.lineTo(w / 2, h / 2); X.closePath();
  const g = X.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#16181c'); g.addColorStop(.5, '#3a3f46'); g.addColorStop(1, '#101215'); X.fillStyle = g; X.fill(); X.restore();
  // relief: seated Shamash and standing Hammurabi
  X.save(); X.strokeStyle = '#6a727c'; X.fillStyle = '#525a64'; X.lineWidth = 4;
  X.beginPath(); X.arc(40, -300, 22, 0, TAU); X.fill(); X.fillRect(18, -278, 50, 90); X.fillRect(10, -190, 70, 14); for (let i = 0; i < 4; i++) { X.beginPath(); X.moveTo(18, -260 + i * 20); X.lineTo(68, -260 + i * 20); X.stroke() }
  X.beginPath(); X.moveTo(68, -300); X.lineTo(92, -296); X.lineTo(92, -260); X.stroke(); X.fillRect(70, -246, 30, 6);
  X.beginPath(); X.arc(-50, -300, 18, 0, TAU); X.fill(); X.fillRect(-66, -282, 32, 104); X.beginPath(); X.moveTo(-34, -270); X.lineTo(-10, -290); X.stroke(); X.restore();
  X.save(); X.fillStyle = '#9aa2ac'; for (let r = 0; r < 18; r++) for (let c = 0; c < 8; c++) { if (hash(r * 7 + c * 3) < .15) continue; const x = -120 + c * 30, y = -150 + r * 30; X.globalAlpha = .55; X.beginPath(); X.moveTo(x, y); X.lineTo(x + 12, y + 4); X.lineTo(x, y + 8); X.fill(); X.fillRect(x + 5, y + 2, 12, 2) } X.restore();
  X.restore();
  if (p.museum) { X.save(); X.globalAlpha = ss(.3, .8, lt); X.fillStyle = '#8a96a4'; X.fillRect(W * .32 - 200, H * .53 + 400, 400, 60); X.restore() }
  labelBoxB(W * .72, H * .2, p.title || 'HAMMURABİ STELİ', p.sub || 'Babil’den Susa’ya', p.sub2 || '', ss(.3, .7, lt), '#ffb23a', clamp((lt - .3) / .5));
  (p.notes || []).forEach(([q, txt], i) => { const a = A(q, .4); if (a <= 0) return; X.save(); parchment(W * .52, H * .42 + i * 170, 780, 140, a); X.globalAlpha = a; X.textAlign = 'center'; X.textBaseline = 'middle'; const s = fitTxt(txt, '700 {s}px Cinzel', 700, 46); X.font = `700 ${s}px Cinzel`; X.fillStyle = '#4a2a10'; X.fillText(txt, W * .52 + 390, H * .42 + i * 170 + 72); X.restore() }) }
// ---- mountain pass toll: Kossaioi on the ridge, Persian caravan below
function sPass(T, p) { const lt = T - SH.t0; landscape(lt * .4, lt * 15, .2);
  X.save(); X.fillStyle = '#7a6a5a'; X.beginPath(); X.moveTo(0, 520); X.lineTo(420, 380); X.lineTo(760, 470); X.lineTo(1150, 330); X.lineTo(1520, 450); X.lineTo(W, 360); X.lineTo(W, 640); X.lineTo(0, 700); X.closePath(); X.fill(); X.restore();
  // archers on ridge
  for (let i = 0; i < 6; i++) { const x = 300 + i * 230, y = [410, 470, 400, 360, 420, 400][i]; stick(X, x, y + 30, 120, { pose: 'hold', f: 1, t: lt, ph: i, col: PAL.kassit.tunic, hat: 'cone', hatCol: PAL.kassit.helmet, plume: PAL.kassit.plume, item: 'spear' }) }
  // caravan on road
  X.fillStyle = '#c8a46a'; X.fillRect(0, 880, W, 70); for (let i = 0; i < 5; i++) { const x = ((i * 380 + lt * 60) % (W + 400)) - 200; stick(X, x, 930, 170, { pose: 'stand', walk: true, f: 1, t: lt, ph: i, col: i === 2 ? '#7a3fb0' : '#d8c08a', hat: i === 2 ? 'crown' : 'band', hatCol: '#e0b84a', item: i === 2 ? 'staff' : null }) }
  labelBoxB(W * .5, H * .1, p.title || 'KOSSAİOİ', p.sub || 'Zagros geçitlerinin efendileri', p.sub2 || '', ss(.3, .7, lt), '#ffb23a', clamp((lt - .3) / .5));
  if (p.badge) { const a = A(p.badge[0], .5); if (a > 0) { X.save(); X.globalAlpha = a; X.translate(W / 2, H * .84); X.fillStyle = 'rgba(170,20,24,.93)'; X.beginPath(); X.roundRect(-440, -62, 880, 124, 20); X.fill(); X.strokeStyle = '#ffd27a'; X.lineWidth = 3; X.stroke(); X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '900 50px CinzelH'; X.fillStyle = goldGrad(X, -40, 10); X.fillText(p.badge[1], 0, -10); X.font = '800 26px InterB'; X.fillStyle = '#fff'; X.fillText(p.badge[2], 0, 34); X.restore() } } }
