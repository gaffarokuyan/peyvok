// ================= DÎROK SHORT — GUTİLER (1080x1920, vertical, same design language as the film) =================
const VW = 1080, VH = 1920, OFF = 0.4;
const VC = document.getElementById('v'), VX = VC.getContext('2d');
const SB = document.createElement('canvas'); SB.width = VW; SB.height = VH; const SBX = SB.getContext('2d');
PK.med = Object.assign({}, PK.med, { n: 'MEDLER' });
// extra polygon: Korduene
PK.kor = { n: 'KORDUENE', c: '#e3322b', l: [43.1, 37.55], r: [[41.9, 37.9], [42.8, 38.25], [43.9, 38.05], [44.5, 37.4], [43.7, 36.95], [42.4, 37.05]] };
// ---- words from ElevenLabs alignment
const SW = (() => { const a = window.SALIGN, out = []; let w = '', s = 0, e = 0; for (let i = 0; i < a.characters.length; i++) { const c = a.characters[i];
  if (c === ' ') { if (w) out.push({ w, s: s + OFF, e: e + OFF }); w = '' } else { if (!w) s = a.character_start_times_seconds[i]; w += c; e = a.character_end_times_seconds[i] } }
  if (w) out.push({ w, s: s + OFF, e: e + OFF }); return out })();
const nW = w => w.toLocaleLowerCase('tr').replace(/[^a-zçğıöşüâîûê0-9-]/g, '');
const SMISS = [];
function cue(q) { if (typeof q === 'number') return q; let [key, off] = q.split('@'); off = +(off || 0); let [w, n] = key.split('#'); n = +(n || 1); const parts = w.split(' ').map(nW);
  for (let i = 0; i < SW.length; i++) { if (parts.every((pp, j) => SW[i + j] && nW(SW[i + j].w).startsWith(pp))) { if (--n === 0) return SW[i].s + off } } SMISS.push(q); return 0 }
const SEND = SW[SW.length - 1].e, STOTAL = +(SEND + 2.3).toFixed(2);
// ---- shot list
const FS = { map: drawFilmMap, duel: sDuel, tablet: sTablet, council: sCouncil, terrain3d: s3dTerrain, nineveh: sNineveh, amarna: sAmarna, gold: sGold, zig3d: s3dZiggurat, pass: sPass };
const SHOTS2 = [
  { at: 0, type: 'map', crop: [960, 1150], p: { cam: [[0, 44.0, 33.6, 18], ['ama', 44.6, 32.7, 9]], show: ['kas'], spread: ['babili', 'kas'], cities: [['Babil', 44.42, 32.54, null, true], ['Nippur', 45.23, 32.13], ['Uruk', 45.64, 31.32]] },
    hook: [[0, '400 YIL\nBABİL’İ YÖNETTİLER'], ['ama', 'NE SÜMERLİ\nNE AKADLI']] },
  { at: 'zagros@-0.3', type: 'terrain3d', crop: [960, 1150], p: { cam: [['zagros@-0.3', 44.2, 31.9, 40, 46.8, 34.0], ['yani', 45.6, 32.9, 26, 48.0, 34.5]], pins: [[null, 44.42, 32.54, 'BABİL', ''], ['inen', 47.6, 34.3, 'ZAGROS', 'Kassitlerin yurdu']] },
    hook: [[0, 'ZAGROS’TAN\nİNEN HALK'], ['kassitlerdi', 'KASSİTLER'], ['yani', 'KÜRTLERİN\nKADİM ATALARI']] },
  { at: 'milattan@-0.3', type: 'nineveh', crop: [960, 1300], p: { pal: 'hitit', noArmy: true, title: 'BABİL', sub: 'MÖ 1595 · YAĞMALANDI' }, hook: [[0, 'MÖ 1595'], ['tahta', 'TAHTA\nKASSİTLER OTURDU']] },
  { at: 'otuz@-0.3', type: 'tablet', crop: [1060, 1700], p: { seed: 11, title: 'BABİL KRAL LİSTESİ', sub: 'Kassit hanedanı', names: [['otuz', 'GANDAŞ'], ['otuz@0.25', 'AGUM II'], ['otuz@0.5', 'BURNABURİAŞ'], ['otuz@0.75', 'KURİGALZU'], ['otuz@1', 'KADAŞMAN-ENLİL'], ['otuz@1.25', 'KAŞTİLİAŞ IV']], badges: [['babil#3', '430 YIL', 'BABİL’İN EN UZUN HANEDANI']] },
    hook: [[0, '36 KRAL'], ['dört#2', '430 YIL'], ['babil#3', 'EN UZUN\nHANEDAN']] },
  { at: 'mısır@-0.3', type: 'amarna', crop: [960, 1700], p: { left: ['kas', 'KASSİT BABİL', 'Burnaburiaş'], right: ['egy', 'MISIR', 'Firavun'] }, hook: [[0, 'FİRAVUNLARLA\nEŞİT MASADA']] },
  { at: 'gönderdiğin@-0.3', type: 'gold', crop: [900, 1600], p: { melt: 'fırına', quote: ['gönderdiğin', '“Kırk mina altını fırına koydum, on mina bile çıkmadı.”'] }, hook: [[0, 'BURNABURİAŞ’IN\nŞİKÂYETİ'], ['on mina', '40 MİNADAN\n10 MİNA BİLE ÇIKMADI']] },
  { at: 'bağdat@-0.3', type: 'zig3d', crop: [820, 1400], p: {}, hook: [[0, 'DUR-KURİGALZU'], ['bugün', 'BUGÜN HÂLÂ\nAYAKTA']] },
  { at: 'babil#4@-0.3', type: 'terrain3d', crop: [960, 1150], p: { cam: [['babil#4@-0.3', 43.8, 31.6, 40, 46.0, 33.6], ['kossaioi', 45.6, 32.8, 26, 47.8, 34.4]], pins: [[null, 44.42, 32.54, 'BABİL', ''], ['zagros', 47.6, 34.3, 'ZAGROS', '']] },
    hook: [[0, 'DAĞLARA\nDÖNÜŞ'], ['kossaioi', 'YUNANLILARA GÖRE\nKOSSAİOİ']] },
  { at: 'pers@-0.3', type: 'pass', crop: [960, 1500], p: { title: 'SUSA – EKBATANA YOLU', sub: 'Kossaioi’nin dağ geçidi' }, hook: [[0, 'PERS KRALLARI\nVERGİ ÖDEDİ']] },
  { at: 'speiser@-0.3', type: 'v_sources', p: {}, hook: [[0, 'KAYNAKLAR\nNE DİYOR?']] },
  { at: 'tarihimizi@-0.3', type: 'v_end', p: {} }
];
SHOTS2.forEach((s, i) => { s.t0 = cue(s.at); }); SHOTS2.sort((a, b) => a.t0 - b.t0);
SHOTS2.forEach((s, i) => { s.t1 = i < SHOTS2.length - 1 ? SHOTS2[i + 1].t0 : STOTAL; });
window.SHOTLIST2 = SHOTS2.map(s => [s.type, +s.t0.toFixed(2), +s.t1.toFixed(2)]);
// ---- SFX (for the mixer)
window.SSFX = [];
SHOTS2.forEach((s, i) => { if (i > 0) SSFX.push(['whoosh', s.t0 - 0.1]); });
SSFX.push(['boom', cue('kassitlerdi')], ['boom', cue('ataları')], ['boom', cue('yağmalanınca')], ['shimmer', cue('fırına')], ['boom', cue('atalarıdır')], ['shimmer', cue('dirok') - .5], ['boom', cue('dirok')]);
// ================= drawing helpers (vertical) =================
function vBG(ctx, t, c1 = '#fff1c4', c2 = '#ffa65a', c3 = '#c2453a') { const g = ctx.createLinearGradient(0, 0, VW * .4, VH); g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c3); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
  ctx.save(); ctx.translate(VW / 2, VH * .36); ctx.rotate(t * .04); ctx.globalAlpha = .13; for (let i = 0; i < 21; i++) { ctx.rotate(TAU / 21); ctx.fillStyle = '#fff6d8'; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(0, -1500); ctx.lineTo(40, 0); ctx.fill() } ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 50; i++) { const life = (t * .12 * (.5 + hash(i)) + hash(i + 7)) % 1; const x = hash(i + 11) * VW, y = VH - life * VH; ctx.fillStyle = `rgba(255,240,190,${.5 * Math.sin(Math.PI * life)})`; ctx.beginPath(); ctx.arc(x, y, 2 + hash(i + 3) * 4, 0, TAU); ctx.fill() } ctx.restore() }
function hookText(ctx, txt, a, k, y0 = 330) {
  if (a <= 0) return; const lines = txt.split('\n'); ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let size = 104; ctx.font = `900 ${size}px CinzelH`; ctx.letterSpacing = '2px'; while (Math.max(...lines.map(l => ctx.measureText(l).width)) > 990 && size > 40) { size -= 4; ctx.font = `900 ${size}px CinzelH` }
  const lh = size * 1.08, y = y0 - (lines.length - 1) * lh / 2; const s = lerp(.82, 1, eback(clamp(k)));
  ctx.translate(VW / 2, y0); ctx.scale(s, s); ctx.translate(-VW / 2, -y0);
  lines.forEach((l, i) => { const yy = y + i * lh; ctx.lineJoin = 'round'; ctx.lineWidth = size * .16; ctx.strokeStyle = 'rgba(30,10,4,.9)'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.strokeText(l, VW / 2, yy); ctx.shadowBlur = 0;
    ctx.fillStyle = i === lines.length - 1 && lines.length > 1 ? '#ffffff' : goldGrad(ctx, yy - size * .45, yy + size * .45); ctx.fillText(l, VW / 2, yy) }); ctx.restore() }
function drawHook(ctx, s, T) { if (!s.hook) return; const hs = s.hook.map(([q, t]) => [q === 0 ? s.t0 : cue(q), t]).filter(h => T >= h[0] - .05); if (!hs.length) return; const [t0, txt] = hs[hs.length - 1];
  const prev = hs.length > 1 ? hs[hs.length - 2] : null; const k = (T - t0) / .45;
  if (prev && k < 1) hookText(ctx, prev[1], 1 - clamp(k * 2), 1); hookText(ctx, txt, clamp(k * 1.6), k) }
function wm(ctx) { ctx.save(); ctx.font = '900 34px CinzelD'; ctx.textAlign = 'center'; ctx.letterSpacing = '6px'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(30,10,4,.7)'; ctx.strokeText('DÎROK', VW / 2, 150); ctx.fillStyle = goldGrad(ctx, 120, 152); ctx.fillText('DÎROK', VW / 2, 150); ctx.restore() }
// captions: 3-4 word groups, current word gold
const CAPG = []; if (window.CAP_CUES) { window.CAP_CUES.forEach(([a, b, t]) => { const ws = t.split(/\s+/).filter(Boolean); const tot = ws.reduce((q, w) => q + w.length + 1, 0); let x = a; CAPG.push(ws.map(w => { const d = (b - .15 - a) * (w.length + 1) / tot; const o = { w, s: x, e: x + d }; x += d; return o })) }) } else (() => { let cur = []; SW.forEach((w, i) => { cur.push(w); const len = cur.map(x => x.w).join(' ').length; if (/[.,:;!?]$/.test(w.w) || cur.length >= 4 || len > 20 || i === SW.length - 1) { CAPG.push(cur); cur = [] } }) })();
function captions(ctx, T, y = 1590) { const g = CAPG.find(c => T >= c[0].s - .08 && T < c[c.length - 1].e + .25); if (!g) return; ctx.save(); ctx.font = '800 72px InterB'; ctx.textBaseline = 'middle'; ctx.letterSpacing = '0px';
  const FIXW = { 'Babili': 'Babil’i', 'Dirok': 'Dîrok', 'Kurdi': 'Kurdî' }; const txt = g.map(w => { const t = w.w.replace(/["“”]/g, ''); const m = t.match(/^([^.,:;!?]+)(.*)$/); return m && FIXW[m[1]] ? FIXW[m[1]] + m[2] : t }); const sp = ctx.measureText(' ').width * 1.7; const ws = txt.map(t => ctx.measureText(t).width); const total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1);
  const sc = Math.min(1, 900 / total); ctx.translate(VW / 2, y); ctx.scale(sc, sc); let x = -total / 2;
  txt.forEach((t, i) => { const on = T >= g[i].s - .03, cur = on && T < g[i].e + .05; ctx.save(); ctx.translate(x + ws[i] / 2, 0); const pop = cur ? 1 + .05 * Math.sin(Math.PI * clamp((T - g[i].s) / .2)) : 1; ctx.scale(pop, pop);
    ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = 'rgba(15,6,2,.95)'; ctx.strokeText(t, 0, 0); ctx.fillStyle = on ? '#ffd23a' : '#ffffff'; ctx.fillText(t, 0, 0); ctx.restore(); x += ws[i] + sp }); ctx.restore() }
// ================= native vertical scenes =================
function nodeBox(ctx, x, y, w, h, title, sub, a, k, final) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); const s = lerp(.6, 1, eback(clamp(k))); ctx.scale(s, s);
  ctx.shadowColor = final ? 'rgba(255,200,60,.9)' : 'rgba(0,0,0,.45)'; ctx.shadowBlur = final ? 50 : 22; ctx.fillStyle = final ? '#b8161a' : 'rgba(42,18,8,.94)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 22); ctx.fill(); ctx.shadowBlur = 0;
  ctx.lineWidth = 4; ctx.strokeStyle = goldGrad(ctx, -h / 2, h / 2); ctx.stroke(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `900 ${final ? 92 : 70}px CinzelH`; ctx.letterSpacing = '4px'; ctx.fillStyle = goldGrad(ctx, -h * .4, h * .15); ctx.fillText(title, 0, sub ? -h * .14 : 4);
  if (sub) { ctx.font = '700 32px InterB'; ctx.letterSpacing = '1px'; ctx.fillStyle = '#fff3dc'; ctx.fillText(sub, 0, h * .27) } ctx.restore() }
function v_etym(ctx, T, s) { const lt = T - s.t0; vBG(ctx, lt, '#fff3cf', '#ffb35a', '#b4402e');
  const N = [[0, 'GUTİUM', 'Sümer ve Akad · MÖ 2200'], ['kurti', 'KURTİ', 'Asur kayıtları'], ['kardukh', 'KARDUKH', 'Ksenofon · MÖ 401'], ['korduene', 'KORDUENE', 'Roma dönemi'], ['bugün', 'KÜRT', 'Bugün']];
  const y0 = 560, dy = 190; N.forEach(([q, t, sub], i) => { const tq = q === 0 ? s.t0 + .2 : cue(q) - .1; const a = ss(tq, tq + .3, T); const y = y0 + i * dy;
    if (i > 0 && a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#7a1a10'; ctx.lineWidth = 8; ctx.lineCap = 'round'; const yA = y - dy + 70, yB = lerp(yA, y - 72, eout(clamp((T - tq) / .3))); ctx.beginPath(); ctx.moveTo(VW / 2, yA); ctx.lineTo(VW / 2, yB); ctx.stroke();
      ctx.fillStyle = '#7a1a10'; ctx.beginPath(); ctx.moveTo(VW / 2 - 18, yB - 16); ctx.lineTo(VW / 2 + 18, yB - 16); ctx.lineTo(VW / 2, yB + 6); ctx.fill(); ctx.restore() }
    nodeBox(ctx, VW / 2, y, i === 4 ? 760 : 700, i === 4 ? 150 : 130, t, sub, a, (T - tq) / .4, i === 4) }) }
function card(ctx, x, y, w, h, name, book, meta, a, k) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x + (1 - eout(clamp(k))) * 160, y); X = ctx; parchment(-w / 2, -h / 2, w, h, 1); X = FX0;
  ctx.fillStyle = '#7a2a10'; ctx.beginPath(); ctx.arc(-w / 2 + 70, 0, 44, 0, TAU); ctx.fill(); ctx.strokeStyle = '#e8b04a'; ctx.lineWidth = 4; ctx.stroke(); ctx.fillStyle = '#ffe6a8'; ctx.font = '900 40px CinzelH'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(name.split(' ').map(z => z[0]).join('').slice(0, 2), -w / 2 + 70, 3);
  ctx.textAlign = 'left'; ctx.font = '900 44px CinzelH'; ctx.letterSpacing = '1px'; ctx.fillStyle = '#5a1e0c'; ctx.fillText(name, -w / 2 + 135, -h * .24);
  ctx.font = 'italic 600 38px Corm'; ctx.letterSpacing = '0px'; ctx.fillStyle = '#3a2410'; ctx.fillText(book, -w / 2 + 135, h * .05); ctx.font = '700 28px InterB'; ctx.fillStyle = '#a2361e'; ctx.fillText(meta, -w / 2 + 135, h * .3); ctx.restore() }
let FX0 = null;
function v_sources(ctx, T, s) { const lt = T - s.t0; vBG(ctx, lt, '#fff6d8', '#ffc777', '#d9663a');
  const C = [['speiser', 'E. A. SPEISER', 'Mesopotamian Origins', 'ABD · 1930'], ['safrastian', 'ARŞAK SAFRASTIAN', 'Kurds and Kurdistan', 'LONDRA · 1948'], ['izady', 'MEHRDAD R. İZADY', 'The Kurds: A Concise Handbook', 'WASHINGTON · 1992']];
  C.forEach(([q, n, b, m], i) => { const tq = cue(q) - .15; card(ctx, VW / 2, 640 + i * 215, 960, 185, n, b, m, ss(tq, tq + .3, T), (T - tq) / .45) });
  const tq = cue('atalarıdır') - .6; const a = ss(tq, tq + .2, T); if (a > 0) { const k = clamp((T - tq) / .35); ctx.save(); ctx.globalAlpha = a; ctx.translate(VW / 2, 1010); ctx.rotate(-.08); const sc = lerp(2.2, 1, eout(k)); ctx.scale(sc, sc);
    ctx.fillStyle = 'rgba(190,20,24,.92)'; ctx.beginPath(); ctx.roundRect(-430, -95, 860, 190, 18); ctx.fill(); ctx.lineWidth = 8; ctx.strokeStyle = '#ffd23a'; ctx.stroke(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '900 58px CinzelH'; ctx.fillStyle = '#fff'; ctx.fillText('KASSİTLER', 0, -38); ctx.font = '900 54px CinzelH'; ctx.fillStyle = goldGrad(ctx, 10, 60); ctx.fillText('KÜRTLERİN ATALARI', 0, 40); ctx.restore() } }
function chanCard(ctx, y, a, k, icon, title, handle, sub, col) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(VW / 2 + (1 - eout(clamp(k))) * 200, y); const w = 920, h = 230;
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30; ctx.fillStyle = 'rgba(30,12,5,.92)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.shadowBlur = 0; ctx.lineWidth = 5; ctx.strokeStyle = goldGrad(ctx, -h / 2, h / 2); ctx.stroke();
  ctx.save(); ctx.translate(-w / 2 + 120, 0); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, 80, 0, TAU); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#ffe6a8'; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  if (icon === 'scroll') { ctx.fillStyle = '#f6e6c6'; ctx.fillRect(-34, -44, 68, 88); ctx.fillStyle = '#c89a5a'; ctx.beginPath(); ctx.arc(-34, -44, 10, 0, TAU); ctx.arc(34, -44, 10, 0, TAU); ctx.fill(); ctx.strokeStyle = '#7a4a22'; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-22, -24 + i * 18); ctx.lineTo(22, -24 + i * 18); ctx.stroke() } }
  else { ctx.beginPath(); ctx.roundRect(-46, -40, 92, 64, 14); ctx.fill(); ctx.beginPath(); ctx.moveTo(-18, 22); ctx.lineTo(-30, 46); ctx.lineTo(4, 22); ctx.fill(); ctx.fillStyle = col; ctx.font = '900 30px InterB'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('Kurdî', 0, -8) }
  ctx.restore(); ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '900 54px CinzelH'; ctx.letterSpacing = '2px'; ctx.fillStyle = goldGrad(ctx, -80, -20); ctx.fillText(title, -w / 2 + 230, -55);
  ctx.letterSpacing = '0px'; ctx.font = '800 52px InterB'; ctx.fillStyle = '#ffffff'; ctx.fillText(handle, -w / 2 + 230, 12); ctx.font = '600 32px InterB'; ctx.fillStyle = '#ffd9a0'; ctx.fillText(sub, -w / 2 + 230, 70); ctx.restore() }
function v_end(ctx, T, s) { const lt = T - s.t0; vBG(ctx, lt, '#fff3c0', '#ffb02a', '#e0402a'); const cy = 470;
  ctx.save(); ctx.translate(VW / 2, cy); ctx.rotate(lt * .3); for (let i = 0; i < 21; i++) { ctx.rotate(TAU / 21); ctx.fillStyle = 'rgba(255,236,120,.9)'; ctx.beginPath(); ctx.moveTo(-18, -170); ctx.lineTo(0, -235 - 12 * Math.sin(lt * 3 + i)); ctx.lineTo(18, -170); ctx.fill() } ctx.restore();
  const k = eback(clamp(lt / .6)); ctx.save(); ctx.translate(VW / 2, cy); ctx.scale(k, k); ctx.fillStyle = '#fff6dc'; ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.fill(); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 160, 0, TAU); ctx.clip(); const lw = 320; ctx.drawImage(LOGO, -lw / 2, -lw / 2 * LOGO.height / LOGO.width, lw, lw * LOGO.height / LOGO.width); ctx.restore(); ctx.lineWidth = 7; ctx.strokeStyle = goldGrad(ctx, -170, 170); ctx.beginPath(); ctx.arc(0, 0, 170, 0, TAU); ctx.stroke(); ctx.restore();
  const t1 = cue('dirok') - .2, t2 = cue('dirok#2') - .2;
  chanCard(ctx, 840, ss(t1, t1 + .3, T), (T - t1) / .45, 'scroll', 'TARİH', '@dirokakurd', 'Kürt tarihini öğren', '#b8161a');
  chanCard(ctx, 1110, ss(t2, t2 + .3, T), (T - t2) / .45, 'speech', 'KÜRTÇE', '@dirokkurdii', 'Kürtçe öğren', '#1f8a5a');
  const b = ss(cue('abone') - .3, cue('abone'), T); if (b > 0) { const pulse = 1 + .05 * Math.sin(lt * 6); ctx.save(); ctx.globalAlpha = b; ctx.translate(VW / 2, 1330); ctx.scale(pulse, pulse); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 24; ctx.fillStyle = '#d0201a'; ctx.beginPath(); ctx.roundRect(-300, -62, 600, 124, 62); ctx.fill(); ctx.shadowBlur = 0;
    ctx.font = '900 50px InterB'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('TAKİP ET · ABONE OL', 0, 4); ctx.restore() } }
const VS = { v_sources, v_end };
// ================= compositing =================
const PANEL_Y = 520;
function drawFilmShot(ctx, s, T) { const main = X; X = cv.getContext('2d'); X.setTransform(1, 0, 0, 1, 0, 0); X.filter = 'none'; X.globalAlpha = 1; X.shadowBlur = 0; X.setLineDash([]);
  SH = { t0: s.t0, t1: s.t1, T, R: cue, ch: null }; try { X.save(); FS[s.type](T, s.p); X.restore() } catch (e) { console.log('ERRSHOT', s.type, e.message); try { for (let i = 0; i < 20; i++) X.restore() } catch (_) { } } X = main;
  const [cx, cw] = s.crop; const ph = H * VW / cw;
  ctx.save(); ctx.filter = 'blur(26px) saturate(1.25) brightness(.9)'; const bs = VH / H * 1.08; ctx.drawImage(cv, VW / 2 - W * bs / 2, -VH * .04, W * bs, H * bs); ctx.restore();
  const vg = ctx.createLinearGradient(0, 0, 0, VH); vg.addColorStop(0, 'rgba(40,14,4,.55)'); vg.addColorStop(.28, 'rgba(40,14,4,.15)'); vg.addColorStop(.72, 'rgba(40,14,4,.15)'); vg.addColorStop(1, 'rgba(40,14,4,.6)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);
  const py = PANEL_Y + (s.type === 'tablet' ? 120 : 0) - (ph > 1000 ? (ph - 1000) * .35 : 0);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.fillStyle = '#000'; ctx.fillRect(0, py, VW, ph); ctx.restore();
  ctx.drawImage(cv, cx - cw / 2, 0, cw, H, 0, py, VW, ph);
  ctx.fillStyle = goldGrad(ctx, py - 4, py + 4); ctx.fillRect(0, py - 5, VW, 6); ctx.fillStyle = goldGrad(ctx, py + ph - 2, py + ph + 6); ctx.fillRect(0, py + ph - 1, VW, 6);
  return py + ph }
function peopleTags(ctx, s, T, yb) { if (!s.peoples) return; const shown = s.peoples.filter(([q]) => T >= cue(q) - .1); if (!shown.length) return; const last = shown[shown.length - 1]; const k = (T - cue(last[0]) + .1) / .35;
  ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const isG = last[1] === 'GUTİLER'; const txt = isG ? 'HEPSİ AYNI KÖKTEN' : last[1]; ctx.translate(VW / 2, yb + 95); const sc = lerp(.6, 1, eback(clamp(k))); ctx.scale(sc, sc);
  ctx.font = '900 64px CinzelH'; ctx.letterSpacing = '3px'; const w = ctx.measureText(txt).width + 90; ctx.fillStyle = isG ? '#b8161a' : 'rgba(42,18,8,.92)'; ctx.beginPath(); ctx.roundRect(-w / 2, -58, w, 116, 18); ctx.fill(); ctx.lineWidth = 4; ctx.strokeStyle = goldGrad(ctx, -58, 58); ctx.stroke(); ctx.fillStyle = goldGrad(ctx, -30, 30); ctx.fillText(txt, 0, 4); ctx.restore() }
function drawShotV(ctx, s, T) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.shadowBlur = 0; let yb = null;
  if (VS[s.type]) { FX0 = X; VS[s.type](ctx, T, s); X = FX0 } else { yb = drawFilmShot(ctx, s, T) }
  if (s.peoples && yb) peopleTags(ctx, s, T, PANEL_Y - 20); drawHook(ctx, s, T) }
const XF2 = .3;
function renderShort(T) { VX.setTransform(1, 0, 0, 1, 0, 0); VX.fillStyle = '#000'; VX.fillRect(0, 0, VW, VH);
  const act = SHOTS2.filter(s => T >= s.t0 && T < s.t1 + XF2); act.forEach((s, i) => { if (i === 0) drawShotV(VX, s, T); else { SBX.setTransform(1, 0, 0, 1, 0, 0); SBX.clearRect(0, 0, VW, VH); drawShotV(SBX, s, T); const k = clamp((T - s.t0) / XF2); VX.save(); VX.globalAlpha = eio(k); VX.drawImage(SB, 0, 0); VX.restore(); VX.fillStyle = `rgba(255,248,225,${.35 * Math.sin(Math.PI * k)})`; VX.fillRect(0, 0, VW, VH) } });
  VX.setTransform(1, 0, 0, 1, 0, 0); VX.globalAlpha = 1; if (T < SEND + .3) captions(VX, T); if (T < cue('tarihimizi') - .3) wm(VX);
  // progress bar
  VX.fillStyle = 'rgba(255,255,255,.25)'; VX.fillRect(0, VH - 8, VW, 8); VX.fillStyle = '#ffd23a'; VX.fillRect(0, VH - 8, VW * clamp(T / STOTAL), 8);
  if (T < .35) { VX.fillStyle = `rgba(0,0,0,${1 - T / .35})`; VX.fillRect(0, 0, VW, VH) } if (T > STOTAL - .5) { VX.fillStyle = `rgba(0,0,0,${clamp((T - STOTAL + .5) / .5)})`; VX.fillRect(0, 0, VW, VH) } }
window.renderFrame = T => { renderShort(T); };
window.SMISS = SMISS; window.STOTAL = STOTAL;
