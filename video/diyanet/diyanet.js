// "Diyanet'in sekiz dili" — satirical vertical short (1080x1920), pure canvas
const W = 1080, H = 1920, TAU = Math.PI * 2, cv = document.getElementById('c'), X = cv.getContext('2d');
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, eout = t => 1 - Math.pow(1 - clamp(t), 3), eio = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }, eback = t => { t = clamp(t); const c = 2.2; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) };
const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) };
const OFF = .6, NAR = WORDS[WORDS.length - 1][2], END = OFF + NAR + .4, TOTAL = END + 3.4; window.TOTAL = TOTAL;
const norm = w => w.toLocaleLowerCase('tr').replace(/i̇/g, 'i').replace(/[^a-zçğıöşüêîûâ0-9]/g, '');
const MISS = []; function cue(q, n = 1, o = 0) { const ps = q.split(' ').map(norm); for (let i = 0; i < WORDS.length; i++) { if (ps.every((p, j) => WORDS[i + j] && norm(WORDS[i + j][0]).startsWith(p))) { if (--n === 0) return OFF + WORDS[i][1] + o } } MISS.push(q); return 0 }
const LOGO = new Image(); LOGO.src = 'logo.png';
window.ready = Promise.all([...['400 40px Anton', '800 40px InterB', '900 40px CinzelD', '900 40px Cinzel', 'italic 600 40px Corm', '800 40px Kufi'].map(f => document.fonts.load(f, 'Kürtçeşğİâî کوردی')), LOGO.decode()]).then(() => true);
const pop = (t, t0, d = .4) => eback((t - t0) / d), A = (t, t0, d = .3) => clamp((t - t0) / d);
// ---------- cues ----------
const C = {
  muj: OFF, dil8: cue('sekiz dilde'), alk: cue('alkışlar'), tr: cue('türkçe'), ar: cue('arapça'), en: cue('ingilizce'), de: cue('almanca'), fr: cue('fransızca'), es: cue('ispanyolca'), it: cue('italyanca'), ru: cue('rusça'), rumi: cue('rusça', 2),
  nat: cue('diyanet', 2), nata: cue('nataşayı'), sofi: cue('sofi'), heci: cue('heci'), hatir: cue('hatırlamaz'),
  mad: cue('madritte'), car: cue('karlos'), rom: cue('romada'), gio: cue('covanni'), par: cue('pariste'), pie: cue('piyer'),
  mele: cue('mele'), kirk: cue('kırk'), amin: cue('amin'),
  soru: cue('kürtçe hutbe soruldu'), cevap: cue('cevap'), dilh: cue('dil havuzunu'), devam: cue('devam'), havuz: cue('havuz yüz'), gir: cue('girilemiyor'),
  hani: cue('hani'), kardz: cue('kardeşiz tabii'), habil: cue('habil'), kabil: cue('kabil'), asil: cue('asıl'), dili: cue('dili yok'), sen: cue('sen kardeşsin'), yasa: cue('yaşa'),
  oysa: cue('oysa'), dilleriniz: cue('dillerinizin'), rum: cue('rum suresi'), bogaz: cue('boğazına'), kac: cue('kaçar'),
  veda: cue('veda'), arab: cue('arabın'), dver: cue('diyanet versiyonu'), kimse: cue('kimsenin'), amak: cue('ama kürtçe hutbe'),
  guc: cue('güçsüzken'), adalet: cue('adalet'), mazlum: cue('mazlum'), ummet: cue('ümmet'), gucl: cue('güçlenince'), zulum: cue('zulümde'), kardm: cue('kardeşim der'), ummd: cue('ümmet der'), ses: cue('sesini'),
  irk: cue('ırkçılığa'), sessiz: cue('sessiz'), sekizd: cue('sekiz dile'), etme: cue('etmemeyi'),
  hangi: cue('bu hangi din'), islam: cue('islam'), kesin: cue('kesin'), belli: cue('belli'), kurt: cue('kürtçe', 3),
  ceto: cue('sekiz dilde hutbe var'), cetod: cue('çeto da'), havb: cue('havuz da'), abone: cue('abone')
};
// ---------- helpers ----------
function tx(s, x, y, size, fill, o = {}) { X.save(); const fam = o.f || 'Anton', wt = o.w || ''; X.font = `${o.it ? 'italic ' : ''}${wt} ${size}px ${fam}`; X.textAlign = o.al || 'center'; X.textBaseline = o.bl || 'middle'; if (o.ls) X.letterSpacing = o.ls + 'px'; let sz = size; while (o.maxW && X.measureText(s).width > o.maxW) { sz -= 3; X.font = `${o.it ? 'italic ' : ''}${wt} ${sz}px ${fam}` }
  X.globalAlpha *= o.a ?? 1; X.lineJoin = 'round'; if (o.st !== 0) { X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 24; X.shadowOffsetY = 6; X.lineWidth = o.st || sz * .14; X.strokeStyle = o.sc || '#1a0a10'; X.strokeText(s, x, y); X.shadowColor = 'transparent' }
  if (Array.isArray(fill)) { const g = X.createLinearGradient(0, y - sz * .5, 0, y + sz * .5); fill.forEach((c, i) => g.addColorStop(i / (fill.length - 1), c)); X.fillStyle = g } else X.fillStyle = fill; X.fillText(s, x, y); X.restore(); return sz }
const GOLD = ['#fff8cf', '#ffd65a', '#f29a1c'], RED = ['#fff0e8', '#ff6a4a', '#d0181e'], GRN = ['#eaffd8', '#7ee05a', '#1f9a3a'];
function chip(s, x, y, k, cols, o = {}) { if (k <= 0) return; X.save(); X.translate(x, y); X.rotate(o.rot || 0); X.scale(k, k); X.font = `${o.size || 64}px ${o.f || 'Anton'}`; const w = o.w || X.measureText(s).width + 80, h = o.h || 110; X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = 26; X.shadowOffsetY = 10; const g = X.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]); X.fillStyle = g; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, h * .28); X.fill(); X.shadowColor = 'transparent'; X.lineWidth = 5; X.strokeStyle = 'rgba(255,255,255,.75)'; X.stroke(); X.restore();
  X.save(); X.translate(x, y); X.rotate(o.rot || 0); X.scale(k, k); tx(s, 0, 4, o.size || 64, o.fg || '#1a0a10', { st: 0, f: o.f }); X.restore() }
function stamp(s, x, y, t, t0, o = {}) { const lt = t - t0; if (lt < 0) return; const k = lt < .18 ? lerp(2.4, 1, eout(lt / .18)) : 1; X.save(); X.translate(x, y); X.rotate(o.rot ?? -.16); X.scale(k, k); X.globalAlpha = clamp(lt / .1) * .95; X.font = `${o.size || 92}px Anton`; X.letterSpacing = '4px'; const w = X.measureText(s).width + 60, h = (o.size || 92) * 1.35; X.lineWidth = 12; X.strokeStyle = o.col || '#d0181e'; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 16); X.stroke(); X.lineWidth = 4; X.beginPath(); X.roundRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 10); X.stroke(); X.fillStyle = o.col || '#d0181e'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(s, 0, 6); X.restore() }
function bubble(s, x, y, t, t0, o = {}) { const k = pop(t, t0, .35); if (k <= 0) return; X.save(); X.translate(x, y); X.scale(k, k); X.font = `${o.size || 60}px ${o.f || 'Anton'}`; const w = Math.max(o.minW || 0, X.measureText(s).width + 70), h = (o.size || 60) * 1.7; X.shadowColor = 'rgba(0,0,0,.35)'; X.shadowBlur = 20; X.fillStyle = o.bg || '#fff'; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, h * .45); X.fill(); X.beginPath(); const tl = o.tail ?? -1; X.moveTo(tl * w * .18, h / 2 - 6); X.lineTo(tl * w * .32, h / 2 + 46); X.lineTo(tl * w * .02, h / 2 - 6); X.fill(); X.shadowColor = 'transparent'; tx(s, 0, 4, o.size || 60, o.fg || '#1a0a10', { st: 0, f: o.f, w: o.wt }); X.restore() }
function rays(cx, cy, col, a, t, n = 20) { X.save(); X.translate(cx, cy); X.rotate(t * .08); X.globalAlpha = a; X.fillStyle = col; for (let i = 0; i < n; i++) { X.rotate(TAU / n); X.beginPath(); X.moveTo(-60, 0); X.lineTo(0, -1700); X.lineTo(60, 0); X.fill() } X.restore() }
function bgGrad(c0, c1, c2, t, seed = 0, rayCol) { const g = X.createLinearGradient(0, 0, W * .3, H); g.addColorStop(0, c0); g.addColorStop(.55, c1); g.addColorStop(1, c2); X.fillStyle = g; X.fillRect(0, 0, W, H); if (rayCol) rays(W / 2, H * .45, rayCol, .07, t);
  X.save(); X.globalCompositeOperation = 'screen'; for (let i = 0; i < 18; i++) { const x = hash(i + seed) * W, y = (hash(i + seed + 9) * H + t * (20 + hash(i) * 40)) % H, r = 40 + hash(i + 3) * 150; const rg = X.createRadialGradient(x, H - y, 0, x, H - y, r); rg.addColorStop(0, 'rgba(255,255,255,.09)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); X.fillStyle = rg; X.fillRect(x - r, H - y - r, r * 2, r * 2) } X.restore() }
function confetti(t, t0, n = 120) { const lt = t - t0; if (lt < 0 || lt > 4) return; X.save(); for (let i = 0; i < n; i++) { const x = hash(i) * W + Math.sin(lt * 3 + i) * 30, y = -50 + lt * (380 + hash(i + 7) * 420) - hash(i + 2) * 300; if (y > H) continue; X.save(); X.translate(x, y); X.rotate(lt * 5 * (hash(i + 4) - .5) * 4); X.fillStyle = ['#ffd23a', '#ff4a6a', '#3ad0ff', '#7ee05a', '#fff'][i % 5]; X.fillRect(-10, -5, 20, 10); X.restore() } X.restore() }
function title(s, t, t0, cols = GOLD, y = 300, size = 120) { const k = pop(t, t0, .4); if (k <= 0) return; X.save(); X.translate(W / 2, y); X.scale(k, k); tx(s, 0, 0, size, cols, { maxW: 980, st: size * .16 }); X.restore() }
// ---------- flags ----------
function flag(code, x, y, w, h) { X.save(); X.translate(x, y); X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 10); X.clip(); const L = -w / 2, T = -h / 2;
  const hs = c => c.forEach((col, i) => { X.fillStyle = col; X.fillRect(L, T + h * i / c.length, w, h / c.length + 1) }), vs = c => c.forEach((col, i) => { X.fillStyle = col; X.fillRect(L + w * i / c.length, T, w / c.length + 1, h) });
  if (code === 'TR') { X.fillStyle = '#e30a17'; X.fillRect(L, T, w, h); X.fillStyle = '#fff'; X.beginPath(); X.arc(-w * .08, 0, h * .3, 0, TAU); X.fill(); X.fillStyle = '#e30a17'; X.beginPath(); X.arc(-w * .02, 0, h * .24, 0, TAU); X.fill(); X.fillStyle = '#fff'; star(w * .16, 0, h * .12) }
  else if (code === 'AR') { X.fillStyle = '#0a7a3a'; X.fillRect(L, T, w, h); X.fillStyle = '#fff'; X.font = `800 ${h * .5}px Kufi`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('عربي', 0, h * .04) }
  else if (code === 'EN') { X.fillStyle = '#012169'; X.fillRect(L, T, w, h); X.strokeStyle = '#fff'; X.lineWidth = h * .2; X.beginPath(); X.moveTo(L, T); X.lineTo(-L, -T); X.moveTo(L, -T); X.lineTo(-L, T); X.stroke(); X.strokeStyle = '#c8102e'; X.lineWidth = h * .07; X.stroke(); X.fillStyle = '#fff'; X.fillRect(-w * .1, T, w * .2, h); X.fillRect(L, -h * .17, w, h * .34); X.fillStyle = '#c8102e'; X.fillRect(-w * .06, T, w * .12, h); X.fillRect(L, -h * .1, w, h * .2) }
  else if (code === 'DE') hs(['#000', '#dd0000', '#ffce00']); else if (code === 'FR') vs(['#0055a4', '#fff', '#ef4135']); else if (code === 'IT') vs(['#009246', '#fff', '#ce2b37']); else if (code === 'RU') hs(['#fff', '#0039a6', '#d52b1e']);
  else if (code === 'ES') { hs(['#aa151b', '#f1bf00', '#f1bf00', '#aa151b']) }
  else if (code === 'KU') { X.fillStyle = '#9a9a9a'; X.fillRect(L, T, w, h); X.fillStyle = '#6a6a6a'; X.font = `${h * .7}px Anton`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('?', 0, 4) }
  X.restore(); X.save(); X.translate(x, y); X.lineWidth = 4; X.strokeStyle = 'rgba(255,255,255,.85)'; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 10); X.stroke(); X.restore() }
function heart(x, y, s, col) { X.save(); X.translate(x, y); X.scale(s, s); X.fillStyle = col; X.beginPath(); X.moveTo(0, 30); X.bezierCurveTo(-70, -20, -40, -80, 0, -45); X.bezierCurveTo(40, -80, 70, -20, 0, 30); X.fill(); X.restore() }
function star(x, y, r) { X.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; X.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) } X.closePath(); X.fill() }
// ---------- cartoon people ----------
// o: skin, shirt, hat ('klaw','haci','sarik','ushanka','beret','cap','cordobes','none'), beard, mus, hair, mouth ('smile','open','o','tape','sad','grin'), eyes ('norm','closed','wide','sad'), brow
function toon(x, y, s, t, o = {}) { X.save(); X.translate(x, y); X.scale(s, s); const sk = o.skin || '#e9b48a', bob = Math.sin(t * 3 + (o.ph || 0)) * 4;
  // body
  X.fillStyle = o.shirt || '#3a6ab0'; X.beginPath(); X.moveTo(-150, 330); X.quadraticCurveTo(-150, 150, -60, 120); X.lineTo(60, 120); X.quadraticCurveTo(150, 150, 150, 330); X.closePath(); X.fill();
  if (o.vest) { X.fillStyle = o.vest; X.beginPath(); X.moveTo(-150, 330); X.quadraticCurveTo(-150, 150, -60, 120); X.lineTo(-25, 330); X.fill(); X.beginPath(); X.moveTo(150, 330); X.quadraticCurveTo(150, 150, 60, 120); X.lineTo(25, 330); X.fill() }
  if (o.sash) { X.fillStyle = o.sash; X.fillRect(-150, 250, 300, 36) }
  X.translate(0, bob);
  // neck+head
  X.fillStyle = sk; X.fillRect(-30, 80, 60, 50); X.beginPath(); X.ellipse(0, 0, 100, 118, 0, 0, TAU); X.fill();
  X.beginPath(); X.ellipse(-100, 10, 18, 28, 0, 0, TAU); X.ellipse(100, 10, 18, 28, 0, 0, TAU); X.fill();
  if (o.hair) { X.fillStyle = o.hair; X.beginPath(); X.ellipse(0, -70, 104, 60, 0, Math.PI, TAU); X.fill(); if (o.long) { X.beginPath(); X.ellipse(-92, 40, 34, 110, .1, 0, TAU); X.ellipse(92, 40, 34, 110, -.1, 0, TAU); X.fill() } }
  if (o.cheek) { X.fillStyle = 'rgba(255,90,110,.35)'; X.beginPath(); X.arc(-55, 40, 22, 0, TAU); X.arc(55, 40, 22, 0, TAU); X.fill() }
  // beard
  if (o.beard) { X.fillStyle = o.beard; X.beginPath(); X.moveTo(-95, 20); X.quadraticCurveTo(-100, 150, 0, (o.beardLen || 175)); X.quadraticCurveTo(100, 150, 95, 20); X.quadraticCurveTo(60, 70, 0, 72); X.quadraticCurveTo(-60, 70, -95, 20); X.fill() }
  // eyes
  const blink = ((t + (o.ph || 0)) % 3.7) < .12, ey = -10; X.fillStyle = '#1a1010';
  if (o.eyes === 'closed' || blink) { X.lineWidth = 7; X.strokeStyle = '#1a1010'; X.beginPath(); X.arc(-38, ey, 16, .2, Math.PI - .2); X.moveTo(54, ey); X.arc(38, ey, 16, .2, Math.PI - .2); X.stroke() }
  else { const r = o.eyes === 'wide' ? 20 : 13; X.fillStyle = '#fff'; X.beginPath(); X.arc(-38, ey, r + 7, 0, TAU); X.arc(38, ey, r + 7, 0, TAU); X.fill(); X.fillStyle = '#1a1010'; X.beginPath(); X.arc(-38 + (o.look || 0), ey + 2, r * .65, 0, TAU); X.arc(38 + (o.look || 0), ey + 2, r * .65, 0, TAU); X.fill() }
  if (o.brow !== false) { X.lineWidth = 9; X.lineCap = 'round'; X.strokeStyle = o.browCol || '#3a2418'; const bd = o.eyes === 'sad' ? -1 : o.angry ? 1 : 0; X.beginPath(); X.moveTo(-60, -44 + bd * 8); X.lineTo(-18, -44 - bd * 8); X.moveTo(60, -44 + bd * 8); X.lineTo(18, -44 - bd * 8); X.stroke() }
  // nose
  X.fillStyle = 'rgba(160,80,50,.35)'; X.beginPath(); X.ellipse(0, 22, 14, 20, 0, 0, TAU); X.fill();
  // mustache
  if (o.mus) { X.fillStyle = o.mus; X.beginPath(); X.ellipse(-28, 50, 40, 15, -.2, 0, TAU); X.ellipse(28, 50, 40, 15, .2, 0, TAU); X.fill() }
  // mouth
  X.lineCap = 'round'; const m = o.mouth || 'smile'; X.strokeStyle = '#5a1a14'; X.lineWidth = 8;
  if (m === 'smile') { X.beginPath(); X.arc(0, 62, 30, .25, Math.PI - .25); X.stroke() } else if (m === 'grin') { X.fillStyle = '#5a1a14'; X.beginPath(); X.arc(0, 62, 38, 0, Math.PI); X.fill(); X.fillStyle = '#fff'; X.fillRect(-28, 62, 56, 12) }
  else if (m === 'open') { X.fillStyle = '#5a1a14'; const oh = 16 + Math.abs(Math.sin(t * 14)) * 18; X.beginPath(); X.ellipse(0, 72, 28, oh, 0, 0, TAU); X.fill() } else if (m === 'o') { X.fillStyle = '#5a1a14'; X.beginPath(); X.ellipse(0, 74, 18, 24, 0, 0, TAU); X.fill() }
  else if (m === 'sad') { X.beginPath(); X.arc(0, 98, 30, Math.PI + .35, -.35); X.stroke() } else if (m === 'tape') { X.save(); X.rotate(-.08); X.fillStyle = '#c8c0a8'; X.fillRect(-70, 50, 140, 44); X.strokeStyle = 'rgba(0,0,0,.2)'; X.lineWidth = 3; X.strokeRect(-70, 50, 140, 44); X.restore() }
  // hats
  const h = o.hat;
  if (h === 'klaw') { X.fillStyle = o.hatCol || '#f2eee4'; X.beginPath(); X.ellipse(0, -88, 118, 58, 0, Math.PI, TAU); X.lineTo(118, -70); X.lineTo(-118, -70); X.fill(); X.strokeStyle = o.hatPat || '#2a2a2a'; X.lineWidth = 5; for (let i = -100; i <= 100; i += 26) { X.beginPath(); X.moveTo(i, -128 + Math.abs(i) * .35); X.lineTo(i + 16, -78); X.stroke() } for (let i = -110; i <= 110; i += 16) { X.fillStyle = o.hatPat || '#2a2a2a'; X.fillRect(i, -72, 6, 26 + hash(i) * 10) } }
  if (h === 'haci') { X.fillStyle = '#fff'; X.beginPath(); X.ellipse(0, -78, 100, 70, 0, Math.PI, TAU); X.fill(); X.fillStyle = '#e8e2d2'; X.fillRect(-100, -86, 200, 18) }
  if (h === 'sarik') { X.fillStyle = '#fff'; X.beginPath(); X.ellipse(0, -96, 118, 74, 0, 0, TAU); X.fill(); X.strokeStyle = '#d8d2c2'; X.lineWidth = 6; for (let i = 0; i < 4; i++) { X.beginPath(); X.ellipse(0, -96, 118, 74 - i * 14, -.12 + i * .05, Math.PI * 1.05, TAU * .97); X.stroke() } X.fillStyle = o.hatCol || '#2a8a4a'; X.beginPath(); X.ellipse(0, -150, 46, 26, 0, Math.PI, TAU); X.fill() }
  if (h === 'ushanka') { X.fillStyle = '#7a5a3a'; X.beginPath(); X.ellipse(0, -96, 116, 66, 0, Math.PI, TAU); X.fill(); X.fillStyle = '#5a3e26'; X.fillRect(-118, -100, 236, 36); X.beginPath(); X.roundRect(-140, -90, 46, 110, 20); X.roundRect(94, -90, 46, 110, 20); X.fill(); X.fillStyle = '#d4af37'; star(0, -120, 18) }
  if (h === 'beret') { X.fillStyle = '#1a1a2a'; X.beginPath(); X.ellipse(-12, -98, 112, 46, -.12, 0, TAU); X.fill(); X.fillRect(-8, -150, 12, 16) }
  if (h === 'cap') { X.fillStyle = o.hatCol || '#2a2a2a'; X.beginPath(); X.ellipse(0, -84, 106, 54, 0, Math.PI, TAU); X.fill(); X.beginPath(); X.ellipse(64, -82, 80, 18, 0, 0, TAU); X.fill() }
  if (h === 'cordobes') { X.fillStyle = '#1a1a1a'; X.beginPath(); X.ellipse(0, -84, 170, 28, 0, 0, TAU); X.fill(); X.fillRect(-84, -160, 168, 80); X.fillStyle = '#aa151b'; X.fillRect(-84, -104, 168, 16) }
  if (h === 'chef') { X.fillStyle = '#fff'; X.fillRect(-80, -130, 160, 50); X.beginPath(); X.arc(-50, -150, 48, 0, TAU); X.arc(10, -170, 56, 0, TAU); X.arc(60, -146, 44, 0, TAU); X.fill() }
  X.restore() }
const P = {
  natasha: { skin: '#f6d0b6', shirt: '#c8203a', hat: 'ushanka', hair: '#f0d070', long: 1, cheek: 1, mouth: 'grin', brow: false },
  sofi: { skin: '#d9a07a', shirt: '#5a4a3a', vest: '#3a2e24', sash: '#8a6a3a', hat: 'klaw', beard: '#f2f2f2', beardLen: 190, mus: '#f2f2f2', mouth: 'sad', eyes: 'sad', ph: 1.3 },
  heci: { skin: '#d49870', shirt: '#7a6a5a', vest: '#4a3a2e', hat: 'haci', beard: '#cfcfcf', mus: '#cfcfcf', mouth: 'sad', eyes: 'sad', ph: 2.1 },
  carlos: { skin: '#e8b48a', shirt: '#aa151b', hat: 'cordobes', mus: '#2a1a10', mouth: 'grin', ph: .4 },
  gio: { skin: '#eab88e', shirt: '#2a6a3a', hat: 'chef', mus: '#3a2010', mouth: 'grin', ph: 1.7 },
  pierre: { skin: '#f0c6a0', shirt: '#1a3a7a', hat: 'beret', mus: '#3a2a1a', mouth: 'grin', ph: 2.6 },
  mele: { skin: '#cf9670', shirt: '#4a4038', vest: '#2a241e', hat: 'sarik', hatCol: '#3a6a4a', beard: '#e8e8e8', beardLen: 200, mus: '#e8e8e8', ph: .9 },
  imam: { skin: '#e2ae86', shirt: '#1a1a1a', hat: 'sarik', hatCol: '#c8a040', beard: '#2a2018', beardLen: 130, mouth: 'open', ph: 0 },
  turk: { skin: '#eab48a', shirt: '#c8202a', hair: '#2a1a10', mus: '#2a1a10', mouth: 'grin', ph: .3 },
  kurd: { skin: '#d9a07a', shirt: '#6a5a44', vest: '#4a3c2c', sash: '#a83a2a', hat: 'klaw', hatPat: '#8a1a1a', mus: '#2a1a10', mouth: 'grin', ph: 1.1 },
  ceto: { skin: '#d9a07a', shirt: '#2a5a8a', hat: 'cap', hatCol: '#8a2a2a', hair: '#1a1210', mouth: 'sad', eyes: 'sad', ph: .6 }
};
function card(x, y, w, h, k, col = '#fff') { if (k <= 0) return; X.save(); X.translate(x, y); X.scale(k, k); X.shadowColor = 'rgba(0,0,0,.4)'; X.shadowBlur = 30; X.shadowOffsetY = 12; X.fillStyle = col; X.beginPath(); X.roundRect(-w / 2, -h / 2, w, h, 36); X.fill(); X.restore() }
function person(name, who, x, y, s, t, t0, o = {}) { const k = pop(t, t0, .45); if (k <= 0) return; X.save(); X.translate(x, y); X.scale(k, k); card(0, 0, 400 * s / .8, 560 * s / .8, 1, o.card || '#fff7e8'); X.save(); X.beginPath(); X.roundRect(-200 * s / .8, -280 * s / .8, 400 * s / .8, 560 * s / .8, 36); X.clip(); const g = X.createLinearGradient(0, -280, 0, 280); g.addColorStop(0, o.bg0 || '#ffe6a8'); g.addColorStop(1, o.bg1 || '#ffb35a'); X.fillStyle = g; X.fillRect(-300, -400, 600, 800); toon(0, -20 * s, s * .95, t, Object.assign({}, P[who], o.p || {})); X.restore();
  X.fillStyle = '#1a0a10'; X.beginPath(); X.roundRect(-200 * s / .8, 160 * s / .8, 400 * s / .8, 120 * s / .8, [0, 0, 36, 36]); X.fill(); tx(name, 0, 222 * s / .8, 64 * s / .8, o.nameCol || GOLD, { st: 0, maxW: 360 * s / .8 }); X.restore() }
// ---------- scenes ----------
function mosque(cx, by, s, col) { X.save(); X.translate(cx, by); X.scale(s, s); X.fillStyle = col; X.beginPath(); X.arc(0, -260, 220, Math.PI, 0); X.rect(-260, -260, 520, 260); X.fill(); X.beginPath(); X.moveTo(0, -560); X.lineTo(-18, -470); X.lineTo(18, -470); X.fill(); X.fillRect(-6, -520, 12, 70);
  [-380, 380].forEach(mx => { X.fillRect(mx - 30, -700, 60, 700); X.beginPath(); X.moveTo(mx - 40, -700); X.lineTo(mx, -820); X.lineTo(mx + 40, -700); X.fill(); X.fillRect(mx - 46, -520, 92, 20) }); X.restore() }
function sHook(t) { bgGrad('#0d3a2a', '#1a7a4a', '#f2b23a', t, 1, '#fff'); mosque(W / 2, 1250, 1, 'rgba(10,30,20,.55)');
  const k = pop(t, C.muj, .5); if (k > 0) { X.save(); X.translate(W / 2, 520); X.rotate(-.06 + Math.sin(t * 6) * .02); X.scale(k, k); tx('MÜJDE!', 0, 0, 240, GOLD, { st: 34 }); X.restore() }
  if (t > C.dil8 - .1) { const k2 = pop(t, C.dil8, .4); X.save(); X.translate(W / 2, 860); X.scale(k2, k2); tx('8 DİLDE', 0, 0, 200, ['#fff', '#fff6d0'], { st: 30 }); tx('HUTBE', 0, 190, 200, GOLD, { st: 30 }); X.restore() }
  if (t > C.alk - .1) { chip('ALKIŞLAR LÜTFEN!', W / 2, 1360, pop(t, C.alk, .4), ['#fff36a', '#ffa01a'], { size: 64, h: 120, rot: -.05 }); confetti(t, C.alk) } }
const LANGS = [['TR', 'TÜRKÇE', 'tr'], ['AR', 'ARAPÇA', 'ar'], ['EN', 'İNGİLİZCE', 'en'], ['DE', 'ALMANCA', 'de'], ['FR', 'FRANSIZCA', 'fr'], ['ES', 'İSPANYOLCA', 'es'], ['IT', 'İTALYANCA', 'it'], ['RU', 'RUSÇA', 'ru']];
function sLangs(t) { bgGrad('#0a2a4a', '#1a5a8a', '#3ad0c0', t, 2, '#fff'); title('HUTBE DİLLERİ', t, C.tr - .3, GOLD, 230, 110);
  const spot = A(t, C.rumi - .1, .3);
  LANGS.forEach(([c, name, key], i) => { const t0 = C[key], k = pop(t, t0, .35); if (k <= 0) return; const y = 370 + i * 118, ru = c === 'RU', dim = spot > 0 && !ru ? 1 - .55 * spot : 1, z = ru ? 1 + .18 * spot + .03 * Math.sin(t * 10) * spot : 1;
    X.save(); X.globalAlpha = dim; X.translate(W / 2, y); X.scale(k * z, k * z); X.fillStyle = 'rgba(255,255,255,.95)'; X.shadowColor = 'rgba(0,0,0,.35)'; X.shadowBlur = 18; X.beginPath(); X.roundRect(-400, -52, 800, 104, 52); X.fill(); X.shadowColor = 'transparent'; flag(c, -310, 0, 120, 76); tx(name, 40, 4, 62, '#1a1a2a', { st: 0 }); tx('✓', 330, 2, 70, '#1f9a3a', { st: 0, f: 'InterB', w: 800 }); X.restore() });
  // Kurdish slot
  const kk = pop(t, C.it + .2, .4); if (kk > 0) { const y = 370 + 8 * 118 + 26; X.save(); X.translate(W / 2, y); X.scale(kk, kk); X.globalAlpha = .9; X.setLineDash([18, 12]); X.lineWidth = 6; X.strokeStyle = 'rgba(255,255,255,.8)'; X.fillStyle = 'rgba(40,40,50,.55)'; X.beginPath(); X.roundRect(-400, -56, 800, 112, 56); X.fill(); X.stroke(); X.setLineDash([]); flag('KU', -310, 0, 120, 76); tx('KURDÎ', 40, 4, 62, '#9aa0aa', { st: 0 }); tx('✗', 330, 2, 70, '#ff4a4a', { st: 0, f: 'InterB', w: 800 }); X.restore() }
  if (spot > 0) { X.save(); X.globalAlpha = spot; tx('RUSÇA MI?!', W / 2, 1520, 120, RED, { st: 18 }); X.restore() } }
function sNatasha(t) { bgGrad('#2a0a2a', '#7a1a4a', '#ff7a5a', t, 3, '#fff');
  person('NATASHA', 'natasha', W / 2, 560, .95, t, C.nat - .1, { bg0: '#ffe0f0', bg1: '#ff9ac0' });
  if (t > C.nata) { chip('DİN KARDEŞİ · UNUTULMAZ', W / 2, 960, pop(t, C.nata + .15, .4), ['#7ee05a', '#1f9a3a'], { size: 56, h: 104, fg: '#fff', rot: -.04 }); X.save(); X.globalAlpha = .9; for (let i = 0; i < 8; i++) { const lt = (t - C.nata) * .6 + i / 8; const y = 700 - (lt % 1) * 500; X.globalAlpha = .9 * (1 - (lt % 1)); heart(W / 2 + Math.sin(i * 2 + t) * 260, y, .5 + i * .05, '#ff4a7a') } X.restore() }
  person('SOFİ ÖMER', 'sofi', 290, 1330, .72, t, C.sofi - .1, { bg0: '#e0e0e0', bg1: '#a0a0a8', card: '#ddd' });
  person('HECÎ REŞO', 'heci', 790, 1330, .72, t, C.heci - .1, { bg0: '#e0e0e0', bg1: '#a0a0a8', card: '#ddd' });
  stamp('HATIRLANMADI', W / 2, 1330, t, C.hatir, { size: 96 }) }
function sEurope(t) { bgGrad('#0a1a3a', '#2a4a9a', '#ffd06a', t, 4, '#fff'); title('HUTBEYİ ANLASINLAR', t, C.mad - .1, GOLD, 260, 104);
  [['CARLOS', 'carlos', 220, C.car, 'ES', 'MADRİD'], ['GIOVANNI', 'gio', 540, C.gio, 'IT', 'ROMA'], ['PIERRE', 'pierre', 860, C.pie, 'FR', 'PARİS']].forEach(([n, who, x, t0, fl, city], i) => { person(n, who, x, 760 + (i % 2) * 60, .62, t, t0 - .25, { bg0: '#fff3d0', bg1: '#ffc06a' }); const k = pop(t, t0 + .25, .35); if (k > 0) { X.save(); X.translate(x, 1120 + (i % 2) * 60); X.scale(k, k); flag(fl, 0, 0, 120, 76); X.restore(); chip('✓ ANLADI', x, 1230 + (i % 2) * 60, k, ['#7ee05a', '#1f9a3a'], { size: 46, h: 84, fg: '#fff' }); tx(city, x, 1330 + (i % 2) * 60, 44, '#fff', { st: 8, a: clamp(k) }) } }) }
function sMele(t) { // mosque interior
  const g = X.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a2a1a'); g.addColorStop(.6, '#7a5a3a'); g.addColorStop(1, '#a8323a'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  X.fillStyle = 'rgba(255,220,150,.08)'; for (let i = 0; i < 5; i++) { X.beginPath(); X.arc(108 + i * 216, 360, 90, Math.PI, 0); X.rect(18 + i * 216, 360, 180, 420); X.fill() }
  X.fillStyle = '#a8323a'; X.fillRect(0, 1240, W, H); X.strokeStyle = 'rgba(255,220,150,.25)'; X.lineWidth = 4; for (let y = 1280; y < H; y += 80) { X.beginPath(); X.moveTo(0, y); X.lineTo(W, y); X.stroke() }
  // minbar + imam
  X.fillStyle = '#5a3a20'; X.beginPath(); X.moveTo(700, 1240); X.lineTo(700, 700); X.lineTo(1000, 700); X.lineTo(1000, 1240); X.fill(); X.fillStyle = '#7a5230'; X.fillRect(680, 680, 340, 40); X.beginPath(); X.moveTo(690, 680); X.lineTo(850, 520); X.lineTo(1010, 680); X.fill();
  toon(850, 560, .55, t, P.imam);
  const sp = ['...ve bilhassa', 'hamd ü sena', 'ümmet-i Muhammed', 'muhterem cemaat', 'vatan millet'];
  if (t > C.mele) { const i = Math.floor((t - C.mele) / .7) % sp.length; bubble(sp[i], 760, 330, t, C.mele + Math.floor((t - C.mele) / .7) * .7, { size: 46, f: 'InterB', wt: 800, tail: .4, minW: 420 }) }
  toon(300, 1180, .95, t, Object.assign({}, P.mele, { mouth: t > C.amin ? 'open' : 'o', eyes: t > C.amin ? 'closed' : 'wide', look: 8 }));
  tx('MELE HEMO', 300, 1590, 76, GOLD, { st: 12, a: A(t, C.mele) });
  if (t > C.kirk && t < C.amin) { const k = pop(t, C.kirk, .35); X.save(); X.translate(300, 690); X.scale(k, k); for (let i = 0; i < 3; i++) tx('?', -90 + i * 90, Math.sin(t * 5 + i) * 14, 120, '#fff36a', { st: 16 }); X.restore(); chip('40 YIL', 760, 1340, pop(t, C.kirk + .2, .35), ['#fff', '#ffe0a0'], { size: 72, h: 120 }) }
  if (t > C.amin - .05) bubble('AMİN!', 330, 700, t, C.amin, { size: 110, tail: -.1 }) }
function sHavuz(t) { if (t < C.havuz - .05) { // official letter
    X.fillStyle = '#5a4030'; X.fillRect(0, 0, W, H); X.fillStyle = 'rgba(0,0,0,.18)'; for (let i = 0; i < 30; i++) X.fillRect(0, i * 70, W, 4);
    X.save(); X.translate(W / 2, 900); X.rotate(-.03); X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 40; X.fillStyle = '#fbf6ea'; X.fillRect(-400, -560, 800, 1120); X.shadowColor = 'transparent';
    tx('RESMİ CEVAP', 0, -470, 64, '#1a1a2a', { st: 0, f: 'Cinzel', w: 900 }); X.fillStyle = '#1a1a2a'; X.fillRect(-320, -420, 640, 4);
    tx('Konu: Kürtçe hutbe talebi', 0, -360, 40, '#3a3a4a', { st: 0, f: 'InterB', w: 800 });
    const full = 'Dil havuzunu geliştirme çalışmaları devam etmektedir.'; const n = Math.floor(clamp((t - C.dilh) / 2.2) * full.length); const words = full.slice(0, n).split(' '); let line = '', ly = -220; X.font = 'italic 600 64px Corm'; X.fillStyle = '#1a1a2a'; X.textAlign = 'center';
    words.forEach(w => { if (X.measureText(line + w).width > 640) { X.fillText(line, 0, ly); line = ''; ly += 84 } line += w + ' ' }); X.fillText(line, 0, ly);
    X.restore(); stamp('ÇALIŞMALAR DEVAM EDİYOR', W / 2, 1180, t, C.devam + .3, { size: 64, col: '#2a5ad0', rot: -.12 });
    if (t < C.cevap) title('KÜRTÇE HUTBE?', t, C.soru, RED, 200, 110); return }
  // empty pool
  const sk = X.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#7ac8f0'); sk.addColorStop(.5, '#c8eaff'); sk.addColorStop(1, '#e8e0d0'); X.fillStyle = sk; X.fillRect(0, 0, W, H);
  X.fillStyle = '#d8d0c0'; X.fillRect(0, 900, W, H); X.save(); X.translate(W / 2, 1300); X.fillStyle = '#4ab0d8'; X.beginPath(); X.moveTo(-460, -260); X.lineTo(460, -260); X.lineTo(400, 300); X.lineTo(-400, 300); X.fill();
  X.strokeStyle = 'rgba(255,255,255,.5)'; X.lineWidth = 3; for (let i = -460; i < 460; i += 60) { X.beginPath(); X.moveTo(i, -260); X.lineTo(i * .87, 300); X.stroke() } for (let y = -260; y < 300; y += 60) { X.beginPath(); X.moveTo(-460 + (y + 260) * .107, y); X.lineTo(460 - (y + 260) * .107, y); X.stroke() }
  // tiny puddle
  X.fillStyle = 'rgba(40,140,220,.7)'; X.beginPath(); X.ellipse(0, 260, 40 + Math.sin(t * 2) * 3, 10, 0, 0, TAU); X.fill();
  // ladder
  X.strokeStyle = '#b8b8c0'; X.lineWidth = 12; X.beginPath(); X.moveTo(300, -360); X.lineTo(300, -120); X.moveTo(370, -360); X.lineTo(370, -120); X.stroke(); X.restore();
  // tap + drip
  X.fillStyle = '#9aa0a8'; X.fillRect(150, 860, 140, 36); X.fillRect(250, 860, 36, 120); const dp = ((t - C.havuz) % 1.6) / 1.6; X.fillStyle = '#3ab0ff'; X.beginPath(); X.ellipse(268, 990 + dp * 560, 10, 16, 0, 0, TAU); X.fill();
  // sign
  X.save(); X.translate(W / 2, 620); X.rotate(.03); X.fillStyle = '#fff'; X.shadowColor = 'rgba(0,0,0,.3)'; X.shadowBlur = 20; X.beginPath(); X.roundRect(-380, -110, 760, 220, 20); X.fill(); X.shadowColor = 'transparent'; X.fillStyle = '#6a4a2a'; X.fillRect(-12, 110, 24, 160); tx('KÜRTÇE DİL HAVUZU', 0, -30, 76, '#1a3a7a', { st: 0 }); tx('DOLDURULUYOR...', 0, 50, 50, '#d0181e', { st: 0 }); X.restore();
  // year counter
  const yr = Math.floor(lerp(1924, 2026, eio((t - C.havuz) / 2.2))); chip(String(yr), W / 2, 300, pop(t, C.havuz, .35), ['#fff36a', '#ffa01a'], { size: 120, h: 170, w: 420 }); tx('DİYANET KURULDU 1924', W / 2, 420, 40, '#1a3a7a', { st: 0, f: 'InterB', w: 800, a: A(t, C.havuz) });
  if (t > C.gir) stamp('GİRİLEMİYOR', W / 2, 1330, t, C.gir, { size: 100 }) }
function sKardes(t) { bgGrad('#1a3a1a', '#4a8a3a', '#ffd06a', t, 5, '#fff');
  const hug = A(t, C.kardz - .3, .5), dx = lerp(260, 170, eout(hug)); toon(W / 2 - dx, 1050, 1.15, t, Object.assign({}, P.turk, { look: 6 })); toon(W / 2 + dx, 1050, 1.15, t, Object.assign({}, P.kurd, { look: -6, mouth: t > C.dili ? 'tape' : 'grin', eyes: t > C.dili ? 'wide' : 'norm' }));
  if (t > C.kardz) { const k = pop(t, C.kardz, .4); X.save(); X.translate(W / 2, 760); X.scale(k * (1 + .06 * Math.sin(t * 7)), k * (1 + .06 * Math.sin(t * 7))); heart(0, 0, 1.6, '#ff3a5a'); X.restore() }
  tx('TÜRK', W / 2 - dx, 1470, 70, ['#fff', '#ffd0d0'], { st: 12, a: A(t, C.hani) }); tx('KÜRT', W / 2 + dx, 1470, 70, ['#fff', '#d0ffd0'], { st: 12, a: A(t, C.hani) });
  title('KARDEŞİZ!', t, C.kardz, GOLD, 300, 140);
  if (t > C.habil - .1 && t < C.dili) { const sw = Math.floor((t - C.habil) * 2.2) % 2; chip(sw ? 'HABİL?' : 'KABİL?', W / 2 - dx, 560, pop(t, C.habil, .35), ['#fff', '#ffe0a0'], { size: 60, h: 104 }); chip(sw ? 'KABİL?' : 'HABİL?', W / 2 + dx, 560, pop(t, C.habil, .35), ['#fff', '#ffe0a0'], { size: 60, h: 104 });
    if (t > C.kabil) { X.save(); X.translate(W / 2 - dx - 170, 1180 + Math.sin(t * 4) * 6); X.fillStyle = '#8a8a8a'; X.beginPath(); X.ellipse(0, 0, 50, 40, .3, 0, TAU); X.fill(); X.fillStyle = 'rgba(0,0,0,.2)'; X.beginPath(); X.ellipse(10, 10, 30, 18, .3, 0, TAU); X.fill(); X.restore(); tx('!', W / 2 - dx - 170, 1080, 80, '#fff36a', { st: 12, a: A(t, C.kabil) }) } }
  if (t > C.dili) { chip('DİLİ YOK', W / 2, 560, pop(t, C.dili, .35), ['#ff6a6a', '#c8101e'], { size: 80, h: 130, fg: '#fff', rot: .04 }) }
  if (t > C.yasa) stamp('TÜRKÇE YAŞA', W / 2, 1640 - 120, t, C.yasa, { size: 92 }) }
function book(t, covered, coverT) { X.save(); X.translate(W / 2, 900); X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 50; X.fillStyle = '#0d5a3a'; X.beginPath(); X.roundRect(-470, -520, 940, 1040, 30); X.fill(); X.shadowColor = 'transparent'; X.fillStyle = '#fbf3dc'; X.beginPath(); X.roundRect(-440, -490, 430, 980, 16); X.roundRect(10, -490, 430, 980, 16); X.fill();
  X.strokeStyle = '#c8a040'; X.lineWidth = 6; X.strokeRect(-410, -460, 370, 920); X.strokeRect(40, -460, 370, 920);
  X.fillStyle = '#c8a040'; for (let i = 0; i < 11; i++) { X.fillRect(-380, -400 + i * 70, 310, 6); }
  tx('RUM · 22', 225, -380, 60, '#0d5a3a', { st: 0, f: 'Cinzel', w: 900 });
  const q = ['“Dillerinizin', 've renklerinizin', 'farklı olması', 'O’nun', 'ayetlerindendir.”']; q.forEach((l, i) => { const a = A(t, C.dilleriniz + i * .45, .3); tx(l, 225, -240 + i * 100, 54, '#1a1a2a', { st: 0, f: 'Corm', it: 1, w: 600, a }) });
  if (covered) { const k = clamp((t - coverT) / .25); X.save(); X.translate(225, -40); X.rotate(-.12); X.scale(lerp(1.6, 1, k), lerp(1.6, 1, k)); X.globalAlpha = k; X.fillStyle = '#c8c0a8'; X.fillRect(-260, -60, 520, 120); X.rotate(.24); X.fillRect(-260, -60, 520, 120); X.restore() }
  X.restore() }
function sKuran(t) { bgGrad('#0a2a2a', '#1a5a5a', '#d8c070', t, 6, '#fff'); title('KUR’AN', t, C.oysa, GOLD, 220, 120); book(t, t > C.bogaz, C.bogaz);
  if (t > C.rum) chip('RUM SURESİ · 22. AYET', W / 2, 1530, pop(t, C.rum, .35), ['#fff36a', '#ffa01a'], { size: 60, h: 110 });
  if (t > C.bogaz) { const sh = Math.sin(t * 40) * 8 * clamp(1 - (t - C.bogaz) / 1.2); X.save(); X.translate(sh, 0); tx('ÖHÖ! ÖHÖ!', W / 2, 1300, 130, RED, { st: 18, a: A(t, C.bogaz + .2) }); X.restore() } }
function scroll(x, y, w, h, k) { if (k <= 0) return; X.save(); X.translate(x, y); X.scale(k, k); X.shadowColor = 'rgba(0,0,0,.45)'; X.shadowBlur = 30; X.fillStyle = '#f3e2b8'; X.fillRect(-w / 2, -h / 2, w, h); X.shadowColor = 'transparent'; X.fillStyle = '#c89a5a'; X.beginPath(); X.roundRect(-w / 2 - 20, -h / 2 - 26, w + 40, 52, 26); X.roundRect(-w / 2 - 20, h / 2 - 26, w + 40, 52, 26); X.fill(); X.restore() }
function sVeda(t) { bgGrad('#3a2a0a', '#8a6a2a', '#f2d08a', t, 7, '#fff');
  if (t < C.dver) { scroll(W / 2, 900, 860, 1000, pop(t, C.veda, .4)); tx('VEDA HUTBESİ', W / 2, 480, 76, '#5a3a10', { st: 0, f: 'Cinzel', w: 900, a: A(t, C.veda + .2) });
    ['“Arabın Arap olmayana,', 'Arap olmayanın da', 'Araba üstünlüğü', 'yoktur.”'].forEach((l, i) => tx(l, W / 2, 680 + i * 110, 70, '#2a1a0a', { st: 0, f: 'Corm', it: 1, w: 600, a: A(t, C.arab + i * .6) })); return }
  scroll(W / 2, 900, 860, 1000, pop(t, C.dver, .4)); tx('DİYANET VERSİYONU', W / 2, 480, 70, '#1a3a7a', { st: 0, a: A(t, C.dver + .2) });
  ['“Kimsenin kimseye', 'üstünlüğü yoktur.”'].forEach((l, i) => tx(l, W / 2, 700 + i * 110, 74, '#2a1a0a', { st: 0, f: 'Corm', it: 1, w: 600, a: A(t, C.kimse + i * .5) }));
  if (t > C.amak) { const k = pop(t, C.amak, .35); X.save(); X.translate(W / 2, 1030); X.rotate(-.04); X.scale(k, k); tx('AMA KÜRTÇE HUTBE', 0, 0, 82, RED, { st: 12 }); tx('DE YOKTUR.', 0, 110, 96, RED, { st: 12 }); X.restore() } }
function sGuc(t) { const big = eio((t - C.gucl) / .8); bgGrad(big > .5 ? '#2a0a0a' : '#0a2a3a', big > .5 ? '#6a1a1a' : '#2a6a8a', big > .5 ? '#d0402a' : '#9ad0e0', t, 8, '#fff');
  const s = lerp(.6, 1.6, big), x = lerp(W / 2, W / 2 + 120, big), y = lerp(1200, 1260, big);
  if (big < .02) { X.fillStyle = '#6a4a2a'; X.fillRect(W / 2 - 160, 1320, 320, 400) }
  toon(x, y, s, t, Object.assign({}, P.imam, { mouth: t < C.gucl ? 'open' : 'grin', angry: t > C.gucl, shirt: big > .5 ? '#2a2a2a' : '#1a1a1a' }));
  if (t < C.gucl) { title('GÜÇSÜZKEN', t, C.guc, ['#fff', '#d0f0ff'], 260, 120); [['ADALET!', C.adalet, 270, 560], ['MAZLUM!', C.mazlum, 810, 640], ['ÜMMET!', C.ummet, 300, 780]].forEach(([s2, t0, bx, by]) => bubble(s2, bx, by, t, t0, { size: 70 })) }
  else { title('GÜÇLENİNCE', t, C.gucl, RED, 260, 130);
    if (t > C.kardm) { toon(270, 1250, 1.05, t, Object.assign({}, P.kurd, { mouth: 'tape', eyes: 'wide', look: 10 })); bubble('KARDEŞİM!', 640, 620, t, C.kardm, { size: 66 }); X.save(); X.fillStyle = P.imam.skin; X.beginPath(); X.ellipse(330, 1330, 70, 44, -.3, 0, TAU); X.fill(); X.restore() }
    if (t > C.ummd) { const k = pop(t, C.ummd, .35); X.save(); X.translate(860, 1420); X.scale(k, k); X.fillStyle = '#1a1a1a'; X.beginPath(); X.arc(0, 0, 90, 0, TAU); X.fill(); X.strokeStyle = '#fff'; X.lineWidth = 8; X.beginPath(); X.arc(0, 0, 70, Math.PI * .75, Math.PI * 2.25); X.stroke(); const a = lerp(Math.PI * 2.1, Math.PI * .85, eio((t - C.ses) / .6)); X.strokeStyle = '#ff4a4a'; X.lineWidth = 12; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(a) * 60, Math.sin(a) * 60); X.stroke(); X.restore(); tx('SES KISILDI', 860, 1560, 56, '#fff', { st: 8, a: k }) } }
  if (t > C.zulum && t < C.kardm) stamp('SINIR YOK', W / 2, 620, t, C.zulum, { size: 110 }) }
function sTercuman(t) { bgGrad('#0a0a1a', '#1a1a3a', '#3a2a6a', t, 9, '#a0a0ff'); title('TERCÜMAN KABİNİ', t, C.irk - .1, GOLD, 230, 100);
  X.save(); X.translate(W / 2, 880); X.fillStyle = '#2a2a3a'; X.beginPath(); X.roundRect(-460, -400, 920, 800, 30); X.fill(); X.strokeStyle = '#5a5a7a'; X.lineWidth = 6; X.stroke();
  const L = [...LANGS.map(l => l[0]), 'KU']; L.forEach((c, i) => { const col = i % 3, row = Math.floor(i / 3), x = -300 + col * 300, y = -250 + row * 250, on = c !== 'KU'; flag(c, x, y - 40, 150, 94); X.fillStyle = on ? (Math.sin(t * 6 + i) > -.5 ? '#3aff6a' : '#1a8a3a') : '#3a1a1a'; X.beginPath(); X.arc(x, y + 50, 20, 0, TAU); X.fill(); tx(on ? 'ON' : 'OFF', x, y + 100, 34, on ? '#9affb0' : '#ff6a6a', { st: 0, f: 'InterB', w: 800 });
    if (!on) { X.strokeStyle = '#1a1a1a'; X.lineWidth = 10; X.beginPath(); X.moveTo(x, y + 70); X.bezierCurveTo(x + 40, y + 200, x - 80, y + 260, x + 20 + Math.sin(t * 3) * 20, y + 330); X.stroke(); if (Math.sin(t * 13) > .6) { X.fillStyle = '#ffe03a'; star(x + 20 + Math.sin(t * 3) * 20, y + 340, 26) } } });
  X.restore(); if (t > C.sessiz) chip('İNKÂRIN SESSİZ TERCÜMANI', W / 2, 1420, pop(t, C.sessiz, .35), ['#ff6a6a', '#c8101e'], { size: 60, h: 110, fg: '#fff' }); if (t > C.sekizd) chip('8 DİLE ✓   1 DİLE ✗', W / 2, 1560, pop(t, C.sekizd + .4, .35), ['#fff', '#ffe0a0'], { size: 64, h: 110 }) }
function sHangi(t) { bgGrad('#1a0a2a', '#4a1a6a', '#ff6a3a', t, 10, '#fff');
  const k = pop(t, C.hangi, .4); if (k > 0) { X.save(); X.translate(W / 2, 560); X.scale(k, k); tx('BU HANGİ', 0, -90, 150, ['#fff', '#e0d0ff'], { st: 22 }); tx('DİN?', 0, 90, 220, GOLD, { st: 28 }); X.restore() }
  for (let i = 0; i < 6; i++) tx('?', 140 + i * 160, 220 + Math.sin(t * 4 + i) * 30, 90, '#fff36a', { st: 12, a: A(t, C.hangi + i * .1) });
  if (t > C.islam) { chip('İSLAM', W / 2, 960, pop(t, C.islam, .35), ['#7ee05a', '#1f9a3a'], { size: 90, h: 140, fg: '#fff' }); if (t > C.kesin) { const k2 = clamp((t - C.kesin) / .2); X.save(); X.strokeStyle = '#ff2a2a'; X.lineWidth = 22; X.lineCap = 'round'; X.beginPath(); X.moveTo(W / 2 - 220, 900); X.lineTo(W / 2 - 220 + 440 * k2, 1020); X.moveTo(W / 2 + 220, 900); X.lineTo(W / 2 + 220 - 440 * k2, 1020); X.stroke(); X.restore() } }
  if (t > C.belli) { tx('HANGİ DİLDE OLMADIĞI BELLİ:', W / 2, 1200, 60, '#fff', { st: 10, a: A(t, C.belli) }); if (t > C.kurt - .05) { const k3 = pop(t, C.kurt, .35); X.save(); X.translate(W / 2, 1370); X.rotate(-.05); X.scale(k3, k3); tx('KÜRTÇE', 0, 0, 200, RED, { st: 28 }); X.restore() } } }
function sCeto(t) { // Çeto waiting at the empty pool
  const sk = X.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, '#f08a5a'); sk.addColorStop(.5, '#f8c88a'); sk.addColorStop(1, '#e8d8c0'); X.fillStyle = sk; X.fillRect(0, 0, W, H);
  X.fillStyle = '#d8d0c0'; X.fillRect(0, 1100, W, H); X.fillStyle = '#4ab0d8'; X.beginPath(); X.moveTo(60, 1240); X.lineTo(1020, 1240); X.lineTo(960, 1800); X.lineTo(120, 1800); X.fill(); X.fillStyle = 'rgba(40,140,220,.7)'; X.beginPath(); X.ellipse(540, 1760, 50, 12, 0, 0, TAU); X.fill();
  toon(560, 980, 1.1, t, Object.assign({}, P.ceto, { look: Math.sin(t * .8) * 10 }));
  // cobweb grows
  const cw = clamp((t - C.cetod) / 2); if (cw > 0) { X.save(); X.globalAlpha = .8 * cw; X.strokeStyle = '#fff'; X.lineWidth = 3; X.translate(560, 820); for (let i = 0; i < 8; i++) { X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(i * TAU / 8 - .3) * 150 * cw, Math.sin(i * TAU / 8 - .3) * 110 * cw - 60); X.stroke() } for (let r = 40; r < 150 * cw; r += 30) { X.beginPath(); X.ellipse(0, -60, r, r * .7, 0, 0, TAU); X.stroke() } X.restore() }
  // clock
  X.save(); X.translate(880, 360); X.fillStyle = '#fff'; X.beginPath(); X.arc(0, 0, 110, 0, TAU); X.fill(); X.strokeStyle = '#1a1a2a'; X.lineWidth = 10; X.stroke(); X.lineWidth = 8; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(t * 4) * 80, Math.sin(t * 4) * 80); X.moveTo(0, 0); X.lineTo(Math.cos(t * .4) * 55, Math.sin(t * .4) * 55); X.stroke(); X.restore();
  title('ÇETO', t, C.ceto + .8, GOLD, 300, 150); if (t > C.cetod) chip('BEKLİYOR...', W / 2, 520, pop(t, C.cetod, .35), ['#fff', '#ffe0a0'], { size: 70, h: 120 }); if (t > C.havb) chip('HAVUZ DA BEKLİYOR', W / 2, 660, pop(t, C.havb, .35), ['#4ab0d8', '#1a6a9a'], { size: 64, h: 110, fg: '#fff' }) }
function sEnd(t) { const lt = t - C.abone; bgGrad('#0d3a2a', '#1a5a3a', '#f2b23a', t, 11, '#fff');
  const k = pop(t, C.abone - .1, .5); X.save(); X.translate(W / 2, 640); X.scale(k, k); if (LOGO.complete) { X.save(); X.beginPath(); X.arc(0, -160, 150, 0, TAU); X.clip(); X.drawImage(LOGO, -150, -310, 300, 300); X.restore() } tx('DÎROK', 0, 110, 170, GOLD, { f: 'CinzelD', w: 900, st: 20, ls: 10 }); X.restore();
  const b = pop(t, C.abone + .3, .45); if (b > 0) { X.save(); X.translate(W / 2, 1040); const pul = b * (1 + .05 * Math.sin(t * 8)); X.scale(pul, pul); X.fillStyle = '#e3201b'; X.shadowColor = 'rgba(0,0,0,.5)'; X.shadowBlur = 30; X.beginPath(); X.roundRect(-330, -85, 660, 170, 40); X.fill(); X.shadowColor = 'transparent'; tx('ABONE OL', 0, 6, 110, '#fff', { st: 0 }); X.restore() }
  tx('Kürtçe hutbe gelene kadar buradayız', W / 2, 1240, 60, '#fff', { f: 'Corm', it: 1, w: 600, st: 8, a: A(t, C.abone + .9, .4) });
  const dp = (lt % 1.4) / 1.4; X.fillStyle = '#3ab0ff'; X.beginPath(); X.ellipse(W / 2, 1360 + dp * 280, 10, 16, 0, 0, TAU); X.fill() }
// ---------- captions ----------
const FIX = { 'Nataşayı': 'Natasha’yı', 'Ömeri': 'Ömer’i', 'Heci': 'Hecî', 'Reşoyu': 'Reşo’yu', 'Madritte': 'Madrid’de', 'Karlos': 'Carlos', 'Romada': 'Roma’da', 'Covanni': 'Giovanni', 'Pariste': 'Paris’te', 'Piyer': 'Pierre', 'Kuranı': 'Kur’an’ı', 'Kuran': 'Kur’an', 'Hutbesinde': 'Hutbesi’nde', 'Çetonun': 'Çeto’nun', 'Onun': 'O’nun', 'Araba': 'Arab’a', 'Arabın': 'Arab’ın' };
const CAPS = []; { let cur = []; WORDS.forEach((w, i) => { const b = w[0].replace(/[.,:;!?]/g, ''); let d = w[0]; if (FIX[b]) d = w[0].replace(b, FIX[b]); cur.push({ w: d, s: OFF + w[1], e: OFF + w[2] }); if (/[.,:;!?]$/.test(w[0]) || cur.length >= 3 || i === WORDS.length - 1) { CAPS.push(cur); cur = [] } }) }
function captions(t) { const c = CAPS.find(c => t >= c[0].s - .05 && t < c[c.length - 1].e + .25); if (!c) return; X.save(); const size = 78; X.font = `${size}px Anton`; X.textBaseline = 'middle';
  const txt = c.map(w => w.w.replace(/[",]/g, '').toLocaleUpperCase('tr')); const sp = X.measureText(' ').width + 22; const ws = txt.map(s => X.measureText(s).width); const tot = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1); const sc = Math.min(1, 980 / tot);
  X.translate(W / 2, 1770); X.scale(sc, sc); let x = -tot / 2; X.lineJoin = 'round';
  txt.forEach((s, i) => { const on = t >= c[i].s - .03, act = on && t < c[i].e + .05, kk = act ? 1 + .14 * Math.max(0, 1 - (t - c[i].s) / .18) : 1; X.save(); X.translate(x + ws[i] / 2, 0); X.scale(kk, kk); X.textAlign = 'center'; X.lineWidth = 16; X.strokeStyle = '#120804'; X.strokeText(s, 0, 0); X.fillStyle = act ? '#ffd23a' : on ? '#fff' : 'rgba(255,255,255,.55)'; X.fillText(s, 0, 0); X.restore(); x += ws[i] + sp }); X.restore() }
// ---------- master ----------
const SC = [[0, sHook], [C.tr - .15, sLangs], [C.nat - .15, sNatasha], [C.mad - .15, sEurope], [C.mele - .15, sMele], [C.soru - .15, sHavuz], [C.hani - .15, sKardes], [C.oysa + .3, sKuran], [C.veda - .15, sVeda], [C.guc - .15, sGuc], [C.irk - .15, sTercuman], [C.hangi - .15, sHangi], [C.ceto - .15, sCeto], [C.abone - .2, sEnd]];
function renderFrame(t) { X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.shadowColor = 'transparent'; X.setLineDash([]);
  let cur = SC[0]; for (const s of SC) if (t >= s[0]) cur = s; const lt = t - cur[0], punch = cur[0] > 0 ? 1 + .05 * Math.max(0, 1 - lt / .3) : 1;
  X.save(); X.translate(W / 2, H / 2); X.scale(punch, punch); X.translate(-W / 2, -H / 2); cur[1](t); X.restore();
  if (cur[0] > 0 && lt < .2) { X.fillStyle = `rgba(255,250,235,${.5 * (1 - lt / .2)})`; X.fillRect(0, 0, W, H) }
  // havuz scene switch flash
  if (Math.abs(t - C.havuz) < .15) { X.fillStyle = `rgba(255,255,255,${.6 * (1 - Math.abs(t - C.havuz) / .15)})`; X.fillRect(0, 0, W, H) }
  const vg = X.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * .85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.35)'); X.fillStyle = vg; X.fillRect(0, 0, W, H);
  const bg = X.createLinearGradient(0, 1640, 0, H); bg.addColorStop(0, 'rgba(10,4,2,0)'); bg.addColorStop(1, 'rgba(10,4,2,.75)'); X.fillStyle = bg; X.fillRect(0, 1640, W, H - 1640);
  if (window.ARCAPS) { const c = ARCAPS.find(c => t >= c[0] && t < c[1]); if (c) { X.save(); X.direction = 'rtl'; X.textAlign = 'center'; X.textBaseline = 'middle'; let sz = 62; X.font = `800 ${sz}px Kufi`; while (X.measureText(c[2]).width > 1900 && sz > 40) { sz -= 2; X.font = `800 ${sz}px Kufi` }
      const words = c[2].split(' '); const lines = []; let cur = ''; words.forEach(w => { const tst = cur ? cur + ' ' + w : w; if (X.measureText(tst).width > 960 && cur) { lines.push(cur); cur = w } else cur = tst }); lines.push(cur);
      const lh = sz * 1.5, y0 = 1790 - (lines.length - 1) * lh; const mw = Math.max(...lines.map(l => X.measureText(l).width)); X.fillStyle = 'rgba(12,6,4,.72)'; X.beginPath(); X.roundRect(W / 2 - mw / 2 - 36, y0 - lh * .62, mw + 72, lh * lines.length + lh * .2, 24); X.fill();
      lines.forEach((l, i) => { X.lineJoin = 'round'; X.lineWidth = 10; X.strokeStyle = '#120804'; X.strokeText(l, W / 2, y0 + i * lh); X.fillStyle = '#fff'; X.fillText(l, W / 2, y0 + i * lh) }); X.restore() } } else if (t < END) captions(t); if (t < C.abone - .2) tx('DÎROK', W / 2, 90, 44, GOLD, { f: 'CinzelD', w: 900, st: 8, ls: 8, a: .9 });
  if (t < .25) { X.fillStyle = `rgba(0,0,0,${1 - t / .25})`; X.fillRect(0, 0, W, H) } if (t > TOTAL - .5) { X.fillStyle = `rgba(0,0,0,${clamp((t - TOTAL + .5) / .5)})`; X.fillRect(0, 0, W, H) } }
window.renderFrame = renderFrame; window.MISS = MISS;
window.SFX = [['boom', .2], ['ding', C.muj], ['boom', C.dil8], ['applause', C.alk], ...['tr', 'ar', 'en', 'de', 'fr', 'es', 'it', 'ru'].map(k => ['pop', C[k]]), ['buzz', C.it + .2], ['scratch', C.rumi - .1], ['whoosh', C.nat - .2], ['ding', C.nata + .1], ['stamp', C.hatir], ['trombone', C.hatir + .3],
  ['whoosh', C.mad - .2], ['ding', C.car + .25], ['ding', C.gio + .25], ['ding', C.pie + .25], ['whoosh', C.mele - .2], ['rimshot', C.amin + .35], ['whoosh', C.soru - .2], ['stamp', C.devam + .3], ['drip', C.havuz + .4], ['drip', C.havuz + 2], ['stamp', C.gir],
  ['whoosh', C.hani - .2], ['pop', C.kardz], ['scratch', C.kabil + .2], ['tape', C.dili], ['stamp', C.yasa], ['whoosh', C.oysa - .2], ['tape', C.bogaz], ['cough', C.bogaz + .15], ['whoosh', C.veda - .2], ['scratch', C.dver - .1], ['rimshot', C.amak + 1.0],
  ['whoosh', C.guc - .2], ['pop', C.adalet], ['pop', C.mazlum], ['pop', C.ummet], ['boom', C.gucl], ['stamp', C.zulum], ['tape', C.kardm], ['whoosh', C.irk - .2], ['buzz', C.sessiz], ['whoosh', C.hangi - .2], ['buzz', C.kesin], ['boom', C.kurt], ['whoosh', C.ceto - .2], ['tick', C.cetod], ['trombone', C.havb + .4], ['boom', C.abone], ['ding', C.abone + .3]];
// cover
window.drawCover = function () { X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; bgGrad('#0a2a4a', '#1a5a8a', '#3ad0c0', 3, 2, '#fff');
  tx('DİYANET', W / 2, 250, 170, ['#fff', '#d0f0ff'], { st: 26 }); tx('8 DİLDE HUTBE', W / 2, 430, 130, GOLD, { st: 22 });
  LANGS.forEach(([c], i) => flag(c, 150 + (i % 4) * 260, 620 + Math.floor(i / 4) * 140, 190, 118));
  X.save(); X.translate(W / 2, 1010); X.rotate(-.06); flag('KU', 0, 0, 240, 150); X.restore();
  toon(W / 2, 1360, .9, 0, Object.assign({}, P.mele, { mouth: 'o', eyes: 'wide' }));
  X.save(); X.translate(W / 2, 1720); X.rotate(-.05); chip('KÜRTÇE? ÇALIŞMALAR DEVAM EDİYOR', 0, 0, 1, ['#ff6a6a', '#c8101e'], { size: 58, h: 120, fg: '#fff' }); X.restore();
  tx('DÎROK', W / 2, 90, 44, GOLD, { f: 'CinzelD', w: 900, st: 8, ls: 8 }) };
