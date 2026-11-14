// ===== XXX film master: shots, overlays, render =====
const TLc = window.TL.chapters;
function normW(w) { return w.toLowerCase().replace(/[^a-z0-9]/g, '') }
const MISSING = [];
function cueT(ch, q) { if (typeof q === 'number') return ch.start + q; let [key, off] = q.split('@'); off = +(off || 0); let [w, n] = key.split('#'); n = +(n || 1); const parts = w.split(' ').map(normW); const ws = ch.words;
  for (let i = 0; i < ws.length; i++) { if (parts.every((pp, j) => ws[i + j] && normW(ws[i + j][0]).startsWith(pp))) { if (--n === 0) return ch.start + ws[i][1] + off } } MISSING.push(ch.id + ':' + q); return ch.start }
const ALL = [];
TLc.forEach((ch, ci) => { if (ch.id === 'TITLE') { ALL.push({ t0: ch.card, type: 'title', p: {}, ch: TLc[ci + 1] }); return }
  if (ch.card != null) ALL.push({ t0: ch.card, type: 'card', p: { num: ch.num, title: ch.title, sub: ch.sub }, ch });
  (SHOTS[ch.id] || []).forEach(s => ALL.push({ t0: cueT(ch, s.at), type: s.type, p: s.p || {}, ch })) });
ALL.push({ t0: window.TL.credits, type: 'credits', p: {}, ch: TLc[TLc.length - 1] }); ALL.push({ t0: window.TL.logo, type: 'logo', p: {}, ch: TLc[TLc.length - 1] });
ALL.sort((a, b) => a.t0 - b.t0); ALL.forEach((s, i) => { s.t1 = i < ALL.length - 1 ? ALL[i + 1].t0 : window.TL.total; s.R = q => cueT(s.ch, q) });
ALL.forEach(s => { const walk = v => { if (typeof v === 'string' && /^[a-z]/.test(v) && !['p', 'led'].includes(v)) { } else if (Array.isArray(v)) v.forEach(walk) }; walk(s.p) });
window.SHOTLIST = ALL.map(s => [s.type, +s.t0.toFixed(2), +s.t1.toFixed(2)]);
window.SFX = []; ALL.forEach(s => { if (s.type === 'card' || s.type === 'title') SFX.push(['whoosh', s.t0], ['boom', s.t0 + .15]); if (s.type === 'logo') SFX.push(['shimmer', s.t0 - .6], ['boom', s.t0]) });
// ---------- 2D overlay helpers ----------
const YEL = '#f6d23a';
function txt(t, x, y, font, fill, o = {}) { X.save(); X.font = font; X.textAlign = o.al || 'left'; X.textBaseline = o.bl || 'alphabetic'; if (o.ls) X.letterSpacing = o.ls + 'px'; X.globalAlpha *= o.a ?? 1; if (o.sh !== false) { X.shadowColor = 'rgba(0,0,0,.75)'; X.shadowBlur = o.blur ?? 18 } if (o.stroke) { X.lineWidth = o.stroke; X.strokeStyle = o.sc || '#000'; X.lineJoin = 'round'; X.strokeText(t, x, y) } X.fillStyle = fill; X.fillText(t, x, y); X.restore() }
function glitchText(t, x, y, size, k, T) { const j = (Math.sin(T * 37) > .7 ? 1 : 0) * 8; X.save(); X.font = `${size}px Anton`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.globalAlpha = k; X.letterSpacing = size * .02 + 'px';
  X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,30,70,.75)'; X.fillText(t, x - 6 - j, y); X.fillStyle = 'rgba(30,140,255,.75)'; X.fillText(t, x + 6 + j, y); X.globalCompositeOperation = 'source-over'; X.shadowColor = 'rgba(0,0,0,.7)'; X.shadowBlur = 30; X.fillStyle = '#fff'; X.fillText(t, x, y); X.restore() }
function lowerThird(a, b, k) { if (k <= 0) return; const x = 110, y = 860, e = eout(k); X.save(); X.globalAlpha = clamp(k * 2);
  X.font = '62px Anton'; X.letterSpacing = '1px'; const w = Math.max(X.measureText(a).width, 300) + 60; X.fillStyle = 'rgba(10,8,14,.78)'; X.fillRect(x - 30, y - 70, w * e, 96); X.fillStyle = YEL; X.fillRect(x - 30, y - 70, 10, 96 + (b ? 56 : 0));
  X.save(); X.beginPath(); X.rect(x - 30, y - 80, w * e, 200); X.clip(); txt(a, x, y, '62px Anton', '#fff', { sh: false, ls: 1 });
  if (b) { X.font = '600 34px Inter'; const w2 = X.measureText(b).width + 60; X.fillStyle = 'rgba(246,210,58,.95)'; X.fillRect(x - 20, y + 26, w2 * e, 50); txt(b, x + 8, y + 62, '800 32px InterB', '#14100a', { sh: false }) } X.restore(); X.restore() }
function dateStamp(t, k, T) { if (k <= 0) return; const n = Math.floor(t.length * clamp(k * 1.6)); X.save(); txt(t.slice(0, n) + (Math.sin(T * 8) > 0 && n < t.length + 1 ? '▌' : ''), 110, 150, '800 40px InterB', '#fff', { ls: 4, blur: 14 }); X.fillStyle = '#ff2a3a'; X.beginPath(); X.arc(86, 136, 9, 0, TAU); X.globalAlpha = Math.sin(T * 5) > 0 ? 1 : .3; X.fill(); X.restore() }
function bigCenter(t, sub, k, T) { if (k <= 0) return; const e = eout(k); X.save(); X.globalAlpha = clamp(k * 2); X.fillStyle = 'rgba(0,0,0,.35)'; X.fillRect(0, H / 2 - 150, W, 300); X.restore();
  glitchText(t, W / 2, H / 2 - 10 + (1 - e) * 30, t.length > 16 ? 120 : 170, clamp(k * 2), T); if (sub) txt(sub, W / 2, H / 2 + 100, '800 40px InterB', YEL, { al: 'center', a: clamp(k * 2 - .5), ls: 6 }) }
function overlays(s, T) { const p = s.p; const at = q => q == null ? 0 : (typeof q === 'number' ? s.t0 + q : s.R(q)); const fade = (t0) => clamp((T - t0) / .5) * clamp((s.t1 - T) / .4);
  if (p.date) dateStamp(p.date, clamp((T - at(p.dateAt ?? 0.2)) / 1.4) * clamp((s.t1 - T) / .4), T);
  if (p.lt) lowerThird(p.lt[0], p.lt[1], clamp((T - at(p.lt[2] ?? .6)) / .8) * clamp((s.t1 - T) / .5));
  if (p.big) bigCenter(p.big[0], p.big[1], fade(at(p.big[2] ?? .3)), T) }
// ---------- special shots ----------
function sCard(T, p) { const lt = T - SH.t0; draw3('portrait', T, { mode: 'full', turn: .4, cam: [[0, [-2.5, 2.2, 5], [0, 1.8, 0]], [4.2, [-1.6, 2, 4.2], [0, 1.9, 0]]] }); X.fillStyle = 'rgba(4,3,8,.72)'; X.fillRect(0, 0, W, H);
  X.save(); X.translate(W * .5, H * .5); X.rotate(-.12); const k = eout(clamp(lt / .7)); X.fillStyle = YEL; X.fillRect(-W, -170, W * 2 * k, 14); X.fillStyle = '#111'; X.fillRect(W - W * 2 * k, 160, W * 2 * k, 14); X.restore();
  const n = String(p.num).padStart(2, '0'); X.save(); X.font = '220px Anton'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.lineWidth = 4; X.strokeStyle = 'rgba(246,210,58,.55)'; X.globalAlpha = clamp(lt / .5); X.strokeText(n, W / 2, H / 2 - 250); X.restore();
  glitchText(p.title, W / 2, H / 2 - 10, p.title.length > 18 ? 120 : 150, clamp((lt - .2) / .5), T); txt(p.sub.toUpperCase(), W / 2, H / 2 + 120, '800 40px InterB', YEL, { al: 'center', a: clamp((lt - .5) / .5), ls: 8 }) }
function sTitle(T) { const lt = T - SH.t0; draw3('portrait', T, { mode: 'full', turn: 0, cam: [[0, [0, 1.5, 9], [0, 1.6, 0]], [7, [0, 1.9, 5.2], [0, 1.9, 0]]] }); const g = X.createLinearGradient(0, H * .45, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.85)'); X.fillStyle = g; X.fillRect(0, 0, W, H);
  glitchText('XXXTENTACION', W / 2, H * .72, 210, clamp((lt - .4) / .8), T); txt('THE SHORT LIFE OF JAHSEH ONFROY', W / 2, H * .84, '800 44px InterB', '#fff', { al: 'center', a: clamp((lt - 1.2) / .8), ls: 10 }); txt('1998  —  2018', W / 2, H * .91, '800 36px InterB', YEL, { al: 'center', a: clamp((lt - 1.8) / .8), ls: 12 }) }
const CREDITS = [['XXXTENTACION', 'Jahseh Dwayne Ricardo Onfroy · 1998 – 2018'], ['NARRATION', 'AI voice · ElevenLabs'], ['MUSIC', 'Original score composed for this film'], ['3D ANIMATION', 'Stylized, code-generated'], ['NOTE', 'A tribute documentary based on public reporting'], ['', 'No music by the artist is used in this video'], ['A TRIBUTE BY', 'R.I.P · @xxxtentacion1234ripym'], ['', 'LLJ']];
function sCredits(T) { const lt = T - SH.t0; draw3('memorial', T, { cam: [[0, [0, 3, 7], [0, 2.2, -2]], [24, [0, 2.6, 5], [0, 2.2, -2]]] }); X.fillStyle = 'rgba(0,0,0,.62)'; X.fillRect(0, 0, W, H);
  const y0 = H + 40 - lt * 62; CREDITS.forEach(([a, b], i) => { const y = y0 + i * 190; if (y < -100 || y > H + 100) return; if (a) txt(a, W / 2, y, '800 30px InterB', YEL, { al: 'center', ls: 10 }); txt(b, W / 2, y + 60, b === 'LLJ' ? '110px Marker' : '52px Anton', '#fff', { al: 'center', ls: 1 }) }) }
function sLogo(T) { const lt = T - SH.t0; X.fillStyle = '#050407'; X.fillRect(0, 0, W, H); const k = eout(clamp(lt / .8));
  X.save(); X.translate(W / 2, H / 2 - 60); X.scale(.9 + .1 * k, .9 + .1 * k); glitchText('R.I.P', 0, 0, 260, k, T); X.restore(); txt('@xxxtentacion1234ripym', W / 2, H / 2 + 130, '800 46px InterB', '#fff', { al: 'center', a: clamp((lt - .4) / .6), ls: 4 });
  const b = clamp((lt - .9) / .5); X.save(); X.globalAlpha = b; X.fillStyle = '#e8202a'; X.beginPath(); X.roundRect(W / 2 - 190, H / 2 + 190, 380, 84, 42); X.fill(); X.restore(); txt('SUBSCRIBE', W / 2, H / 2 + 246, '800 40px InterB', '#fff', { al: 'center', a: b, ls: 4, sh: false }) }
// ---------- render ----------
const FB = mk(W, H), FX = FB.getContext('2d');
function drawShot(s, T, ctx) { const main = X; X = ctx; SH = { t0: s.t0, t1: s.t1, T, R: s.R, ch: s.ch };
  try { X.save(); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.filter = 'none';
    if (s.type === 'card') sCard(T, s.p); else if (s.type === 'title') sTitle(T); else if (s.type === 'credits') sCredits(T); else if (s.type === 'logo') sLogo(T); else { draw3(s.type, T, s.p); overlays(s, T) }
    X.restore() } catch (e) { console.log('ERRSHOT', s.type, e.message, e.stack) } X = main }
const XF = .5;
function renderFrame(T) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; X.fillStyle = '#000'; X.fillRect(0, 0, W, H);
  const act = ALL.filter(s => T >= s.t0 && T < s.t1 + XF);
  act.forEach((s, i) => { if (i === 0) drawShot(s, T, X); else { FX.setTransform(1, 0, 0, 1, 0, 0); FX.clearRect(0, 0, W, H); drawShot(s, T, FX); const k = clamp((T - s.t0) / XF); X.save(); X.globalAlpha = eio(k); X.drawImage(FB, 0, 0); X.restore();
    if (s.type === 'card' || s.type === 'title') { X.fillStyle = `rgba(255,255,255,${.35 * Math.sin(Math.PI * k)})`; X.fillRect(0, 0, W, H) } } });
  const vg = X.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, H * 1.05); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); X.fillStyle = vg; X.fillRect(0, 0, W, H);
  X.save(); X.globalCompositeOperation = 'overlay'; const ox = (hash(Math.floor(T * 25)) * 512) | 0, oy = (hash(Math.floor(T * 25) + 3) * 512) | 0; for (let x = -ox; x < W; x += 512) for (let y = -oy; y < H; y += 512) X.drawImage(GRAIN, x, y); X.restore();
  if (T < window.TL.logo - .5) { X.save(); X.globalAlpha = .75; txt('R.I.P', W - 60, 76, '40px Anton', '#fff', { al: 'right', ls: 3, blur: 10 }); X.restore() }
  if (T < .6) { X.fillStyle = `rgba(0,0,0,${1 - T / .6})`; X.fillRect(0, 0, W, H) } if (T > window.TL.total - 1) { X.fillStyle = `rgba(0,0,0,${clamp((T - window.TL.total + 1) / 1)})`; X.fillRect(0, 0, W, H) } }
window.renderFrame = renderFrame; window.MISSING = MISSING;
window.PREBUILD = () => { Object.keys(S3).forEach(n => get3(n)); portraitTexture() };
