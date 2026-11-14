// ================= VERTICAL WRAPPER 1080x1920 =================
(function () {
  const VW = 1080, VH = 1920, V = document.createElement('canvas'); V.id = 'v'; V.width = VW; V.height = VH; document.body.appendChild(V); const Y = V.getContext('2d');
  const tiny = document.createElement('canvas'); tiny.width = 54; tiny.height = 96; const TY = tiny.getContext('2d');
  const band = document.createElement('canvas'); band.width = VW; band.height = 1240; const BY = band.getContext('2d');
  const anton = new FontFace('Anton', 'url(../../alamut/fonts/anton-latin-400-normal.woff2)'), anton2 = new FontFace('Anton', 'url(../../alamut/fonts/anton-latin-ext-400-normal.woff2)', { unicodeRange: 'U+0100-024F,U+1E00-1EFF' });
  document.fonts.add(anton); document.fonts.add(anton2);
  window.ready = Promise.all([window.ready, anton.load(), anton2.load()]).then(() => true);
  const ch = window.TL.chapters[0], WS = ch.words, OFF = ch.start, END = window.TL.narEnd, TOT = window.TL.total;
  const cu = q => { const [k, o] = q.split('@'); return cueT(ch, k) + (+o || 0) };
  const pop = (t, t0, d = .4) => eback((t - t0) / d);
  // ---- top titles ----
  const TOPS = [[0.15, 'BAĞDAT’IN', 'ANAHTARI', 'g'], [cu('bugün@-0.1'), 'KİMSE ADINI', 'BİLMİYOR', 'r'], [cu('annazîler@-0.1'), 'ANNAZÎLER', 'Kürt hanedanı · 990 – 1117', 'g'],
    [cu('mezopotamya’nın@-0.1'), 'MEZOPOTAMYA’NIN', 'DOĞU KAPISI', 'g'], [cu('kürt#2@-0.1'), 'ŞAZENCAN', 'Kürt aşireti · Hulvan', 'w'], [cu('bağdat’tan@-0.1'), 'BAĞDAT → HORASAN', 'Her kervan bu kapıdan geçti', 'g'],
    [cu('bu yolu@-0.1'), 'KÜRT', 'SÜVARİLERİ', 'r'], [cu('emir@-0.1'), 'EBUŞŞEVK', 'Hüsameddevle · 1011 – 1046', 'g'], [cu('toprakları@-0.1'), 'HULVAN’DAN', 'DAKUK’A', 'g'],
    [cu('sonra@-0.1'), '1046', 'SELÇUKLU ORDUSU', 'r'], [cu('hulvan#3@-0.1'), 'HULVAN', 'DÜŞTÜ', 'r'], [cu('ebuşşevk#2@-0.1'), 'SİRVAN KALESİ', 'Ebuşşevk burada öldü', 'w'],
    [cu('ama@-0.1'), 'AMA', 'YOK OLMADILAR', 'g'], [cu('yetmiş@-0.1'), '70 YIL', 'DAHA', 'g'], [cu('yüz otuz@-0.1'), '130 YIL', 'MEZOPOTAMYA’NIN KAPISI', 'g']];
  const PAL = { g: ['#fff8cf', '#ffd65a', '#f29a1c', '#c4620a'], r: ['#fff0e8', '#ff8a6a', '#e8321e', '#9a1408'], w: ['#ffffff', '#fff3d0', '#ffe2a0', '#e0b060'] };
  function grad(y0, y1, k) { const g = Y.createLinearGradient(0, y0, 0, y1); PAL[k].forEach((c, i) => g.addColorStop(i / 3, c)); return g }
  function big(s, x, y, size, k, maxW = 1000) { Y.save(); Y.font = `${size}px Anton`; let sz = size; while (Y.measureText(s).width > maxW) { sz -= 4; Y.font = `${sz}px Anton` } Y.textAlign = 'center'; Y.textBaseline = 'alphabetic'; Y.lineJoin = 'round';
    Y.shadowColor = 'rgba(0,0,0,.75)'; Y.shadowBlur = 30; Y.lineWidth = sz * .14; Y.strokeStyle = '#1a0703'; Y.strokeText(s, x, y); Y.shadowBlur = 0; Y.fillStyle = grad(y - sz * .8, y, k); Y.fillText(s, x, y); Y.restore() }
  function small(s, x, y, size) { Y.save(); Y.font = `${size}px Anton`; Y.letterSpacing = "1px"; Y.textAlign = "center"; Y.lineJoin = "round"; Y.lineWidth = 10; Y.strokeStyle = 'rgba(20,8,4,.9)'; Y.strokeText(s, x, y); Y.fillStyle = '#fff'; Y.fillText(s, x, y); Y.restore() }
  function drawTop(t) { let cur = null, nxt = null; for (let i = 0; i < TOPS.length; i++) if (t >= TOPS[i][0]) { cur = TOPS[i]; nxt = TOPS[i + 1] } if (!cur || t > END - .2) return;
    const k = pop(t, cur[0], .38), out = nxt ? clamp((nxt[0] - t) / .12) : 1; if (k <= 0) return; Y.save(); Y.globalAlpha = clamp(k * 3) * out; Y.translate(VW / 2, 250); Y.scale(k, k); Y.translate(-VW / 2, -250);
    const twoBig = cur[2] && cur[2] === cur[2].toLocaleUpperCase('tr') && cur[2].length < 22;
    if (twoBig) { big(cur[1], VW / 2, 215, 150, cur[3]); big(cur[2], VW / 2, 365, 150, cur[3] === 'w' ? 'g' : cur[3]) } else { big(cur[1], VW / 2, 270, 165, cur[3]); if (cur[2]) small(cur[2], VW / 2, 360, 46) } Y.restore() }
  // ---- captions ----
  const CAPV = []; { let cur = []; WS.forEach((w, i) => { cur.push({ w: w[0], s: OFF + w[1], e: OFF + w[2] }); if (/[.,:;!?]$/.test(w[0]) || cur.length >= 3 || i === WS.length - 1) { CAPV.push(cur); cur = [] } }) }
  function caps(t) { const c = CAPV.find(c => t >= c[0].s - .06 && t < c[c.length - 1].e + .25); if (!c) return; Y.save(); Y.textBaseline = 'middle'; const size = 80; Y.font = `${size}px Anton`;
    const txt = c.map(w => w.w.replace(/[",]/g, '').toLocaleUpperCase('tr')); const sp = Y.measureText(' ').width + 22; let ws = txt.map(s => Y.measureText(s).width); let total = ws.reduce((a, b) => a + b, 0) + sp * (txt.length - 1); const sc = Math.min(1, 960 / total);
    Y.translate(VW / 2, 1745); Y.scale(sc, sc); let x = -total / 2; Y.lineJoin = 'round';
    txt.forEach((s, i) => { const on = t >= c[i].s - .03, act = on && t < c[i].e + .05, kk = act ? 1 + .12 * Math.max(0, 1 - (t - c[i].s) / .18) : 1; Y.save(); Y.translate(x + ws[i] / 2, 0); Y.scale(kk, kk); Y.textAlign = 'center';
      Y.lineWidth = 14; Y.strokeStyle = '#120804'; Y.strokeText(s, 0, 0); Y.fillStyle = act ? '#ffd23a' : on ? '#ffffff' : 'rgba(255,255,255,.55)'; Y.fillText(s, 0, 0); Y.restore(); x += ws[i] + sp }); Y.restore() }
  // ---- end card ----
  function endCard(t) { const lt = t - cu('daha fazlası@-0.3'); if (lt < 0) return; const k = eio(lt / .5); Y.save(); Y.globalAlpha = k; Y.fillStyle = 'rgba(12,6,4,.55)'; Y.fillRect(0, 0, VW, VH); Y.restore();
    const a = pop(t, cu('daha fazlası@-0.3') + .1, .5); if (a > 0) { Y.save(); Y.translate(VW / 2, 760); Y.scale(a, a); Y.font = '900 190px CinzelD'; Y.textAlign = 'center'; Y.lineWidth = 22; Y.lineJoin = 'round'; Y.strokeStyle = '#1a0703'; Y.shadowColor = 'rgba(255,170,40,.8)'; Y.shadowBlur = 60; Y.strokeText('DÎROK', 0, 0); Y.shadowBlur = 0; Y.fillStyle = grad(-150, 0, 'g'); Y.fillText('DÎROK', 0, 0); Y.restore() }
    const b = pop(t, cu('abone@-0.2'), .45); if (b > 0) { Y.save(); Y.translate(VW / 2, 1000); Y.scale(b, b); const pul = 1 + .04 * Math.sin(t * 8); Y.scale(pul, pul); Y.fillStyle = '#e3201b'; Y.shadowColor = 'rgba(0,0,0,.5)'; Y.shadowBlur = 30; Y.beginPath(); Y.roundRect(-330, -85, 660, 170, 40); Y.fill(); Y.shadowBlur = 0;
      Y.font = '110px Anton'; Y.textAlign = 'center'; Y.textBaseline = 'middle'; Y.fillStyle = '#fff'; Y.fillText('ABONE OL', 0, 6); Y.restore();
      Y.save(); Y.globalAlpha = clamp(b); Y.font = 'italic 600 58px Corm'; Y.textAlign = 'center'; Y.lineWidth = 8; Y.strokeStyle = 'rgba(10,6,4,.8)'; Y.strokeText('Kürt tarihinin unutulmuş sayfaları', VW / 2, 1180); Y.fillStyle = '#ffe9a8'; Y.fillText('Kürt tarihinin unutulmuş sayfaları', VW / 2, 1180); Y.restore() } }
  // hide engine label boxes in action scenes (titles live in the vertical overlay)
  ['cavalry', 'clash', 'caravan', 'siege', 'court', 'castle', 'portrait'].forEach(k => { const f0 = SCENE[k]; SCENE[k] = function (T, p) { const lb = labelBoxB; labelBoxB = () => { }; try { f0(T, p) } finally { labelBoxB = lb } } });
  // ---- compose ----
  const BH = 1240, BY0 = 400, SC = BH / 1080;
  const base = window.renderFrame; let lastShot = null;
  function shotAt(t) { let s = ALL[0]; for (const x of ALL) if (t >= x.t0) s = x; return s }
  function fxOf(s) { const o = (SHOTS.ch00.find(q => q.type === s.type && Math.abs(cueT(ch, q.at) - s.t0) < .01) || {}); return o.fx ?? .5 }
  window.renderFrame = function (t) {
    base(Math.min(t, TOT - .9)); const src = cv; const s = shotAt(t), prev = ALL[ALL.indexOf(s) - 1]; const kx = prev ? eio((t - s.t0) / .45) : 1; const fx = prev ? lerp(fxOf(prev), fxOf(s), kx) : fxOf(s);
    // background: blurred cover
    TY.drawImage(src, (1920 - 1080 * 1080 / 1920 * 1.0) / 2, 0, 1080 * 1080 / 1920 * 1.78, 1080, 0, 0, 54, 96);
    Y.imageSmoothingEnabled = true; Y.imageSmoothingQuality = 'high'; Y.drawImage(tiny, 0, 0, VW, VH); Y.fillStyle = 'rgba(10,5,3,.45)'; Y.fillRect(0, 0, VW, VH);
    // band with punch zoom on cut
    const punch = 1 + .06 * Math.max(0, 1 - (t - s.t0) / .35) * (prev ? 1 : 0); const sw = VW / (SC * punch), sx = clamp(fx * 1920 - sw / 2, 0, 1920 - sw), sh = 1080 / punch, sy = (1080 - sh) / 2;
    BY.globalCompositeOperation = 'source-over'; BY.clearRect(0, 0, VW, BH); BY.drawImage(src, sx, sy, sw, sh, 0, 0, VW, BH);
    BY.globalCompositeOperation = 'destination-in'; const g = BY.createLinearGradient(0, 0, 0, BH); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(.07, '#000'); g.addColorStop(.93, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)'); BY.fillStyle = g; BY.fillRect(0, 0, VW, BH);
    Y.drawImage(band, 0, BY0);
    // cut flash
    const fl = prev ? Math.max(0, 1 - (t - s.t0) / .22) : 0; if (fl > 0) { Y.fillStyle = `rgba(255,245,220,${.35 * fl})`; Y.fillRect(0, 0, VW, VH) }
    // top gradient for titles
    const tg = Y.createLinearGradient(0, 0, 0, 520); tg.addColorStop(0, 'rgba(10,4,2,.75)'); tg.addColorStop(1, 'rgba(10,4,2,0)'); Y.fillStyle = tg; Y.fillRect(0, 0, VW, 520);
    const bg = Y.createLinearGradient(0, 1500, 0, VH); bg.addColorStop(0, 'rgba(10,4,2,0)'); bg.addColorStop(1, 'rgba(10,4,2,.85)'); Y.fillStyle = bg; Y.fillRect(0, 1500, VW, VH - 1500);
    drawTop(t); endCard(t); if (t < END) caps(t);
    if (t < cu('daha fazlası@-0.3')) { Y.save(); Y.globalAlpha = .9; Y.font = '900 40px CinzelD'; Y.textAlign = 'center'; Y.letterSpacing = '6px'; Y.lineWidth = 6; Y.strokeStyle = 'rgba(30,10,4,.8)'; Y.strokeText('DÎROK', VW / 2, 1878); Y.fillStyle = grad(1845, 1880, 'g'); Y.fillText('DÎROK', VW / 2, 1878); Y.restore() }
    if (t < .25) { Y.fillStyle = `rgba(0,0,0,${1 - t / .25})`; Y.fillRect(0, 0, VW, VH) } if (t > TOT - .5) { Y.fillStyle = `rgba(0,0,0,${clamp((t - TOT + .5) / .5)})`; Y.fillRect(0, 0, VW, VH) } };
  window.CANVAS_ID = 'v';
  const C2 = q => cu(q); window.SFXV = [['boom', .1], ['whoosh', C2('bugün@-0.2')], ['boom', C2('annazîler@-0.1')], ...ALL.slice(1).map(s => ['whoosh', s.t0 - .1]),
    ['army', C2('kürt#2@-0.2')], ['clash', C2('korurdu@0')], ['boom', C2('sonra@-0.1')], ['army', C2('selçuklu@0')], ['boom', C2('düştü@0')], ['boom', C2('ama@-0.1')], ['shimmer', C2('daha fazlası@-0.6')], ['boom', C2('daha fazlası@-0.2')], ['boom', C2('abone@-0.1')]];
})();
