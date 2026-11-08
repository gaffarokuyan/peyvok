// ================= KASSİTLER — shot list (cue = word in narration) =================
LANGMENU.left = true;
window.TITLEP = { title: 'KASSİTLER', sub: 'BABİL’İ YÖNETEN KÜRT ATALARI', tag: 'Zagros’tan Babil’e' };
const BAB = [44.42, 32.54], ZAG = [47.4, 34.3], SUSA = [48.25, 32.19], EKB = [48.52, 34.8];
const G = { kas: { name: 'KASSİTLER', sub: 'Zagros’un atlıları', pal: PAL.kassit, helmet: 'cone', shield: 'round' }, asur: { name: 'ASUR', sub: 'Kral Sanherib · MÖ 702', pal: PAL.asur, helmet: 'cone', shield: 'rect' },
  mak: { name: 'MAKEDONYA', sub: 'Büyük İskender · MÖ 324', pal: PAL.mak, helmet: 'dome', shield: 'round' } };
const CIT_BAB = [['Babil', ...BAB, null, true], ['Nippur', 45.23, 32.13], ['Uruk', 45.64, 31.32], ['Ur', 46.1, 30.96], ['Sippar', 44.25, 33.06]];
const SHOTS = {
 ch00: [
  { at: 0, type: 'nineveh', p: { pal: 'hitit', noArmy: true, title: 'BABİL', sub: 'MÖ 1595 · YAĞMALANDI' } },
  { at: 'tahta@-0.3', type: 'map', p: { cam: [['tahta@-0.3', 44.5, 34.6, 22], ['zagros', 46.0, 33.6, 11]], show: [['kasO', 'zagros']], glow: [['kasO', 'zagros']],
      cities: [['Babil', ...BAB, null, true]], armies: [['inmiş', ZAG, BAB, '#e0b13a', '#5a3a08', 2.2]], labels: [['zagros', 48.6, 35.4, 'KASSİTLER', 'Zagros’un atlı halkı', '']] } },
  { at: 'babili@-0.3', type: 'map', p: { year: 'MÖ 1595 – 1155', cam: [['babili@-0.3', 45.2, 32.9, 11]], show: ['kasO', ['kas', 'babili']], spread: ['babili', 'kas'], cities: CIT_BAB,
      badges: [['hanedanıydı', '430 YIL', 'BABİL TARİHİNİN EN UZUN HANEDANI']] } },
  { at: 'mısır@-0.3', type: 'amarna', p: { left: ['kas', 'KASSİT BABİL', 'Zagros’tan inen krallar'], right: ['egy', 'MISIR', 'Firavunlar'], quote: ['altın', 'Mektuplar, evlilikler ve altın'] } },
  { at: 'onların@-0.3', type: 'scenic', p: { warm: .25, hero: true, heroPal: 'kassit', lines: [['onların', 'KASSİTLER', 170, .3], ['kürtlerin', 'Kürtlerin kadim ataları', 70, .46, 'corm']] } },
  { at: 'dîroka@-0.2', type: 'scenic', p: { warm: .2, lines: [['dîroka', 'DÎROK', 170, .38]] } }],
 ch01: [
  { at: 0, type: 'terrain3d', p: { cam: [[0, 43.3, 31.0, 42, 45.4, 33.4], ['zagros', 45.4, 32.6, 34, 47.6, 34.3], ['kürtler', 46.0, 33.0, 26, 48.0, 34.5]],
      pins: [[null, 44.42, 32.54, 'BABİL', ''], ['dicle', 44.4, 33.35, 'DİCLE', ''], ['zagros', 47.6, 34.3, 'ORTA ZAGROS', 'Kassitlerin yurdu']], badges: [['bugün', 'BUGÜN', 'KÜRTLER VE LURLAR YAŞAR']] } },
  { at: 'kassitler#2@-0.3', type: 'tablet', p: { seed: 7, title: 'BABİL YILLIKLARI', sub: 'Samsu-iluna · MÖ ~1740', quotes: [['kassit ordusunun', 'Kassit ordusunun yenildiği yıl']], hl: 'kassit ordusunun' } },
  { at: 'yani@-0.3', type: 'map', p: { year: 'MÖ ~1740', cam: [['yani@-0.3', 45.6, 33.4, 10]], show: ['kasO'], cities: [['Babil', ...BAB, null, true], ['Sippar', 44.25, 33.06]],
      arrows: [['kassitler#3', [47.0, 34.0], [45.0, 32.9], '#e0b13a', 1.6]], text: [['kapısındaydı', 'MEZOPOTAMYA’NIN KAPISINDA', null, 90]] } },
  { at: 'kassitlerin#2@-0.3', type: 'chariots', p: { pal: 'kassit', title: 'ATLAR VE SAVAŞ ARABALARI', sub: 'Zagros yaylalarının gücü' } },
  { at: 'babil#3@-0.3', type: 'quote', p: { title: 'BABİL METİNLERİ', text: 'At yetiştiriciliği terimleri\nKassitçeden geçti', src: '— KASSİT MİRASI', colors: ['#fff6d8', '#ffcf7a', '#d27a3a'] } }],
 ch02: [
  { at: 0, type: 'map', p: { year: 'MÖ 1595', cam: [[0, 39.5, 36.2, 24]], show: ['hit'], tags: [['hit']], cities: [['Babil', ...BAB, null, true], ['Hattuşa', 34.6, 40.0, 0]],
      armies: [['yürüdü', [34.8, 39.6], [44.2, 32.8], '#7a5a3a', '#2a1a10', 2.4]], fall: [['Babil', 'yağmaladı']] } },
  { at: 'hammurabinin@-0.3', type: 'nineveh', p: { pal: 'hitit', title: 'BABİL YAĞMALANDI', sub: 'MÖ 1595 · HİTİT KRALI I. MURŞİLİ' } },
  { at: 'işte@-0.3', type: 'map', p: { year: 'MÖ 1595', cam: [['işte@-0.3', 45.4, 33.4, 12]], show: ['kasO', ['kas', 'doldurdu']], spread: ['doldurdu', 'kas'], cities: CIT_BAB,
      armies: [['kassitler', ZAG, BAB, '#e0b13a', '#5a3a08', 2.4]], text: [['tahtına', 'KASSİT HANEDANI', 'otuz', 120]], badges: [['otuz', '430 YIL', 'MÖ 1595 – 1155']] } },
  { at: 'babil#4@-0.3', type: 'tablet', p: { seed: 11, title: 'BABİL KRAL LİSTESİ', sub: 'Kassit hanedanı', names: [['otuz', 'GANDAŞ'], ['otuz@0.3', 'AGUM II'], ['otuz@0.6', 'BURNABURİAŞ'], ['otuz@0.9', 'KURİGALZU'], ['otuz@1.2', 'KADAŞMAN-ENLİL'], ['otuz@1.5', 'KAŞTİLİAŞ IV']],
      badges: [['hanedanın', '36 KRAL', 'MEZOPOTAMYA’NIN EN UZUN HANEDANI']] } },
  { at: 'kassitler#2@-0.3', type: 'map', p: { cam: [['kassitler#2@-0.3', 45.3, 32.9, 9]], show: ['kas'], glow: [['kas', 'karduniaş']], cities: CIT_BAB,
      text: [['karduniaş', 'KARDUNİAŞ', 'bazı', 150]], labels: [['bazı', 47.9, 34.6, 'KARDU · KÜRT?', 'Bazı Kürt yazarlara göre', 'ADIN İZİ']] } },
  { at: 'kassitler#3@-0.3', type: 'map', p: { cam: [['kassitler#3@-0.3', 45.3, 32.6, 9.5]], show: ['kas'], spread: ['getirdiler', 'kas'], cities: CIT_BAB,
      badges: [['getirdiler', 'TEK ÜLKE', 'DAĞINIK ŞEHİRLER BİRLEŞTİ', 'barış'], ['barış', 'YÜZYILLARCA BARIŞ', 'GÜNEY MEZOPOTAMYA']] } }],
 ch03: [
  { at: 0, type: 'map', p: { year: 'MÖ 1350', cam: [[0, 38.5, 33.5, 36]], show: [['misY', 'mısır'], ['hit', 'hitit'], ['mit', 'mitanni'], ['asurM', 'asur'], ['kas', 'kassit']],
      tags: [['misY', 'mısır'], ['hit', 'hitit'], ['mit', 'mitanni'], ['asurM', 'asur'], ['kas', 'kassit']], glow: [['kas', 'babili']] } },
  { at: 'bu@-0.3', type: 'scenic', p: { warm: .2, lines: [['kardeşim', '“KARDEŞİM”', 150, .36], ['hitap', 'Büyük krallar birbirine böyle seslenirdi', 56, .52, 'corm']] } },
  { at: 'mısırda@-0.3', type: 'amarna', p: { left: ['kas', 'BURNABURİAŞ II', 'Kassit kralı'], right: ['egy', 'AHENATON', 'Mısır firavunu'] } },
  { at: 'gönderdiğin@-0.4', type: 'gold', p: { melt: 'fırına', quote: ['gönderdiğin', '“Gönderdiğin kırk mina altını fırına koydum, on mina bile çıkmadı.”'] } },
  { at: 'kassit#3@-0.3', type: 'amarna', p: { left: ['kas', 'KADAŞMAN-ENLİL', 'Kassit kralı'], right: ['egy', 'AMENHOTEP III', 'Mısır firavunu'], quote: ['kızını', 'Kassit prensesi Mısır sarayına gelin gitti'] } },
  { at: 'zagrostan@-0.3', type: 'scenic', p: { warm: .25, hero: true, heroPal: 'kassit', lines: [['zagrostan', 'EŞİT MASADA', 140, .3], ['güçlü', 'Dünyanın en güçlü kralları arasında', 58, .46, 'corm']] } }],
 ch04: [
  { at: 0, type: 'zig3d', p: {} },
  { at: 'kassitler#2@-0.3', type: 'map', p: { cam: [['kassitler#2@-0.3', 45.0, 32.3, 7.5]], cities: [['Babil', ...BAB, null, true], ['Nippur', 45.23, 32.13, 'nippur', true], ['Uruk', 45.64, 31.32, 'uruk', true], ['Dur-Kurigalzu', 44.2, 33.35, 0, true]],
      text: [['tapınaklarını', 'TAPINAKLAR YENİDEN YÜKSELDİ', null, 84]] } },
  { at: 'gılgamış@-0.3', type: 'tablet', p: { seed: 13, title: 'GILGAMIŞ DESTANI', sub: 'Standart metin · Kassit dönemi', quotes: [['gılgamış', 'Derinliği gören o adam…']], hl: 'gılgamış' } },
  { at: 'kassitler#3@-0.3', type: 'kud3d', p: { title: 'KUDURRU', sub: 'Kassit sınır taşı', sub2: 'TOPRAK BAĞIŞLARI · TANRI SEMBOLLERİ', notes: [['kudurru', 'KUDURRU · SINIR TAŞI'], ['bağışladıkları', 'KRAL TOPRAK BAĞIŞLAR'], ['sembollerini', 'TANRILARIN SEMBOLLERİ']] } },
  { at: 'kassitler#4@-0.3', type: 'scenic', p: { warm: .15, hero: true, heroPal: 'kassit', lines: [['babilin', 'KASSİT TANRILARI', 110, .22], ['şukamuna', 'ŞUKAMUNA', 120, .36], ['şumaliya', 'ŞUMALİYA', 120, .49], ['zagros', 'Zagros dağlarının koruyucuları', 54, .6, 'corm']] } }],
 ch05: [
  { at: 0, type: 'map', p: { year: 'MÖ 1158', cam: [[0, 46.3, 32.6, 11]], show: ['kas', ['elam', 'elam']], tags: [['elam', 'elam']], cities: [['Babil', ...BAB, null, true], ['Susa', ...SUSA, 'elam', true]],
      armies: [['saldırıya', [48.0, 32.2], [44.7, 32.6], '#8a4ab8', '#2a0a3a', 2.4]], fall: [['Babil', 'yağmaladı']], arrows: [['steli', BAB, SUSA, '#ffcf3a', 1.6]] } },
  { at: 'hammurabi@-0.3', type: 'stele3d', p: { title: 'HAMMURABİ STELİ', sub: 'Babil’den Susa’ya', notes: [['susa', 'SUSA’YA GÖTÜRÜLDÜ'], ['louvre', 'BUGÜN LOUVRE · PARİS']] } },
  { at: 'milattan#2@-0.3', type: 'nineveh', p: { pal: 'elam', noArmy: true, title: 'MÖ 1155', sub: 'BABİL’DE KASSİT HANEDANI SONA ERDİ' } }],
 ch06: [
  { at: 0, type: 'terrain3d', p: { cam: [[0, 43.8, 31.6, 44, 46.0, 33.6], ['zagros', 45.6, 32.8, 28, 47.8, 34.4]], pins: [[null, 44.42, 32.54, 'BABİL', ''], ['zagros', 47.6, 34.3, 'ZAGROS', 'Kassitlerin yurdu']], text: [['yok', 'YOK OLMADILAR', 'zagros', 110]] } },
  { at: 'asur@-0.3', type: 'battle', p: { left: G.kas, right: G.asur, vs: true, year: 'MÖ 702' } },
  { at: 'bin@-0.3', type: 'map', p: { year: 'MÖ 324', cam: [['bin@-0.3', 47.6, 33.6, 9]], show: ['kasO'], glow: [['kasO', 'kossaioi']], cities: [['Susa', ...SUSA, null, true], ['Ekbatana', ...EKB, null, true]],
      labels: [['kossaioi', 49.6, 33.3, 'KOSSAİOİ', 'Yunan kaynaklarında Kassitler', '']] } },
  { at: 'strabon@-0.3', type: 'scenic', p: { warm: .2, hero: true, heroPal: 'kassit', lines: [['strabon', 'STRABON', 110, .28], ['usta', '“Usta okçular”', 76, .44, 'corm']] } },
  { at: 'arrianos@-0.3', type: 'battle', p: { left: G.kas, right: G.mak, vs: true, year: 'MÖ 324' } },
  { at: 'pers@-0.3', type: 'pass', p: { title: 'SUSA – EKBATANA YOLU', sub: 'Kossaioi’nin dağ geçidi', badge: ['geçiş', 'GEÇİŞ VERGİSİ', 'PERS KRALLARI KOSSAİOSLARA ÖDERDİ'] } },
  { at: 'zagros#2@-0.3', type: 'scenic', p: { warm: .2, lines: [['zagros#2', 'ZAGROS', 170, .36], ['korumuştu', 'Bir halkı bir kez daha korudu', 62, .52, 'corm']] } }],
 ch07: [
  { at: 0, type: 'map', p: { cam: [[0, 43.6, 35.9, 22]], show: ['kasO', ['gut', 'gutiler'], ['lul', 'lullubiler'], ['hur', 'hurriler'], ['mit', 'mitanniler'], ['med', 'medler']],
      tags: [['kasO'], ['gut', 'gutiler'], ['lul', 'lullubiler'], ['hur', 'hurriler', 41.4, 38.2], ['mit', 'mitanniler'], ['med', 'medler', 50.5, 37.5]], glow: [['kasO', 0], ['gut', 'gutiler'], ['lul', 'lullubiler'], ['hur', 'hurriler'], ['mit', 'mitanniler'], ['med', 'medler']] } },
  { at: 'pek@-0.3', type: 'lineage', p: { hl: ['kas'], cues: { kurd: 'katmanlardır' } } },
  { at: 'bu görüşü@-0.3', type: 'scenic', p: { warm: .2, lines: [['bu görüşü', 'YABANCI KAYNAKLAR', 120, .34], ['araştırmacılar', 'Bu görüşü savunan araştırmacılar', 60, .5, 'corm']] } },
  { at: 'amerikalı@-0.3', type: 'authors', p: { list: [['E. A. SPEISER', 'Mesopotamian Origins', 'ABD · 1930', 'Kassitler, Gutiler ve Lullubiler:\nZagros’un yerli halkları']] } },
  { at: 'arşak@-0.3', type: 'authors', p: { list: [['ARŞAK SAFRASTIAN', 'Kurds and Kurdistan', 'LONDRA · 1948', 'Zagros halkları\nKürtlerin ataları']] } },
  { at: 'mehrdad@-0.3', type: 'authors', p: { list: [['MEHRDAD R. İZADY', 'The Kurds: A Concise Handbook', 'WASHINGTON · 1992', 'Kassitler: Kürt halkının\nen önemli katmanlarından']] } },
  { at: 'kürt tarihçi@-0.3', type: 'authors', p: { list: [['MUHAMMED EMİN ZEKİ BEG', 'Xulasey Tarîxî Kurd û Kurdistan', 'BAĞDAT · 1931', 'Kassitler\nKürtlerin kadim ataları']] } },
  { at: 'elbette@-0.3', type: 'quote', p: { title: 'KARŞIT GÖRÜŞLER', text: 'Kassit dilinden günümüze\nçok az belge kaldı', src: '— ELİMİZDE İKİ DİLLİ BİR SÖZLÜK VE KRAL ADLARI VAR', colors: ['#e8f8ff', '#8fd0ff', '#5a7fe0'] } },
  { at: 'ancak@-0.3', type: 'scenic', p: { warm: .25, hero: true, heroPal: 'kassit', lines: [['coğrafya', 'ZAGROS’TAN BUGÜNE', 110, .28], ['süreklilik', 'Binlerce yıllık süreklilik', 62, .44, 'corm']] } }],
 ch08: [
  { at: 0, type: 'map', p: { cam: [[0, 45.6, 33.4, 14]], show: ['kasO', 'kas'], glow: [['kas', 'babili'], ['kasO', 'dağlarına']], cities: [['Babil', ...BAB, null, true]],
      text: [['yönetti', 'BABİL’İ 400 YIL YÖNETTİLER', 'firavunlarla', 84]], arrows: [['dağlarına', BAB, [47.3, 34.2], '#e0b13a', 1.6]] } },
  { at: 'kassitlerin@-0.3', type: 'scenic', p: { warm: .25, hero: true, heroPal: 'kassit', lines: [['kassitlerin', 'KÜRT TARİHİNİN', 110, .28], ['sayfalarından', 'En eski sayfalarından biri', 62, .44, 'corm']] } },
  { at: 'videoyu@-0.3', type: 'scenic', p: { warm: .2, lines: [['videoyu', 'ABONE OL', 140, .38], ['yorumlarda', 'Görüşlerinizi yorumlarda paylaşın', 62, .55, 'corm']] } }]
};
window.CREDITS = ['# Birincil Kaynaklar', 'Amarna Mektupları — W. L. Moran, The Amarna Letters, Baltimore, 1992', 'Babil Kral Listesi ve kronikler — A. K. Grayson, Assyrian and Babylonian Chronicles, 1975',
  'Hammurabi Kanunları — M. T. Roth, Law Collections from Mesopotamia, 1997', 'Sanherib yazıtları — A. K. Grayson & J. Novotny, RINAP 3, 2012', 'Strabon, Geographika · Arrianos, Anabasis',
  '# Kürt Atalarına Dair Araştırmalar', 'E. A. Speiser — Mesopotamian Origins, Philadelphia, 1930', 'Arshak Safrastian — Kurds and Kurdistan, London, 1948', 'Mehrdad R. Izady — The Kurds: A Concise Handbook, 1992',
  'Muhammed Emin Zeki Beg — Xulasey Tarîxî Kurd û Kurdistan, Bağdat, 1931', 'V. Minorsky — Kurds, Encyclopaedia of Islam, 1927',
  '# Kassitler Üzerine Akademik Çalışmalar', 'J. A. Brinkman — Materials for a Political History of the Kassite Dynasty, 1976', 'L. Sassmannshausen — Beiträge zur Verwaltung und Gesellschaft Babyloniens in der Kassitenzeit, 2001',
  'A. Bartelmus & K. Sternitzke (ed.) — Karduniaš: Babylonia under the Kassites, 2017', 'K. E. Slanski — The Babylonian Entitlement narûs (kudurrus), 2003', 'M. Van De Mieroop — A History of the Ancient Near East, 2015',
  '# Yapım', 'DÎROK'];
