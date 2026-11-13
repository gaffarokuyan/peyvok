// ================= ANNAZÎLER — shot list (cue = word in narration) =================
window.TITLEP = { title: 'ANNAZÎLER', sub: 'MEZOPOTAMYA’NIN DOĞU KAPISINDAKİ KÜRT EMİRLERİ', tag: 'Hulvan · 990 – 1117' };
PORTRAIT.badr = Object.assign({}, PORTRAIT.muhalhil, { robe: ['#123a22', '#2f8a4a'], mantle: '#0c2416', cap: '#1f6a3a', beard: ['#8a8278', '#4a443c', '#1a1612'], age: .8, hollow: .2 });
const HUL = [45.86, 34.46], BAG = [44.36, 33.31], HEM = [48.51, 34.80], KER = [47.07, 34.31], DIN = [47.43, 34.60], SEH = [45.90, 35.25], DAK = [44.45, 35.13], BEN = [45.55, 33.75],
  MUS = [43.13, 36.34], HIL = [44.42, 32.48], ISF = [51.67, 32.65], AMD = [40.23, 37.91], GEN = [46.36, 40.68], DIYJ = [44.55, 33.55];
const SHOTS = {
 ch00: [
  { at: 0, type: 'terrain3d', p: { cam: [[0, 43.6, 32.9, 40, 46.0, 34.6], ['bağdattan', 44.6, 33.5, 28, 46.4, 34.7]], pins: [['kürt', ...HUL, 'HULVAN', 'Mezopotamya’nın doğu kapısı'], ['bağdattan', ...BAG, 'BAĞDAT', ''], ['horasana', ...HEM, 'HEMEDAN', 'Horasan yolu']] } },
  { at: 'yüz otuz@-0.3', type: 'caravan', p: { title: 'HORASAN YOLU', sub: 'Bağdat – Hulvan – Horasan', road: 'yüz otuz' } },
  { at: 'saraylar@-0.2', type: 'court', p: { title: 'ANNAZÎ SARAYI', sub: 'Hulvan' } },
  { at: 'süvari@-0.2', type: 'cavalry', p: { title: 'ŞAZENCAN SÜVARİLERİ', sub: 'Kürt aşiret ordusu' } },
  { at: 'komşu@-0.2', type: 'clash', p: { left: ANN.ann, right: ANN.hsn, vs: true } },
  { at: 'onların@-0.2', type: 'portrait', p: { who: 'emir', name: 'ANNAZÎLER', sub: 'Mezopotamya’nın doğu kapısındaki Kürt emirleri', nsize: 110 } },
  { at: 'dîrok@-0.2', type: 'scenic', p: { warm: .2, lines: [['dîrok', 'DÎROK', 170, .36], ['kaçırmamak', 'ABONE OL', 110, .56], ['unutulmuş', 'Kürt tarihinin unutulmuş sayfaları için', 56, .68, 'corm']] } }],
 ch01: [
  { at: 0, type: 'map', p: { cam: [[0, 45.2, 33.6, 14], ['işte', 45.6, 34.1, 9]], rivers: 'dicle', cities: [['Bağdat', ...BAG, 0, true], ['Hulvan', ...HUL, 'hulvan', true]],
      text: [['mezopotamya', 'MEZOPOTAMYA', null, 110]], labels: [['dağlarla', 47.0, 34.9, 'ZAGROS', 'Dağların eşiği', '']] } },
  { at: 'bugün@-0.2', type: 'scenic', p: { warm: .15, lines: [['serpol-i', 'SERPOL-İ ZEHAB', 120, .3], ['son', 'Mezopotamya’nın son şehri', 64, .45, 'corm']] } },
  { at: 'hulvandan@-0.2', type: 'map', p: { cam: [['hulvandan@-0.2', 45.2, 33.9, 8]], cities: [['Hulvan', ...HUL, 0, true], ['Bağdat', ...BAG, 0, true]],
      arrows: [['elvend', HUL, DIYJ, '#7fe0ff', 1.3], ['dicleye', DIYJ, BAG, '#7fe0ff', 1.3]], text: [['diyala', 'ELVEND → DİYALA → DİCLE', null, 72]] } },
  { at: 'dört@-0.3', type: 'anubanini', p: {} },
  { at: 'kassitler@-0.2', type: 'city', p: { title: 'BABİL', sub: 'Kassit kralları', sub2: 'MÖ 1595 – 1155' } },
  { at: 'kürtlerin@-0.2', type: 'list', p: { title: 'KAPININ KADİM SAHİPLERİ', colors: ['#fff3d0', '#ffc06a', '#c8402a'], items: [['ataları', 'LULLUBİLER · MÖ ~2300'], ['binlerce', 'KASSİTLER · MÖ ~1600'], ['mezopotamya', 'MEDLER · MÖ ~700'], ['kapıda', 'ANNAZÎLER · MS ~990']] } }],
 ch02: [
  { at: 0, type: 'map', p: { year: '~990', cam: [[0, 46.0, 34.6, 10]], show: [['annE', 'hikâyesi']], glow: [['annE', 'hikâyesi']], cities: [['Hulvan', ...HUL, 'hikâyesi', true]],
      labels: [['şazencan', 46.9, 35.4, 'ŞAZENCAN', 'Kürt aşireti', '']] } },
  { at: 'ebul@-0.3', type: 'portrait', p: { who: 'founder', name: 'MUHAMMED BİN ANNAZ', nsize: 96, sub: 'Ebu’l-Feth · Hanedanın kurucusu', notes: [['hanedan', 'ANNAZ’IN OĞULLARI', 'Hanedan adını babasından aldı']] } },
  { at: 'mezopotamya@-0.2', type: 'council', p: { title: 'ŞAZENCAN AŞİRETİ', sub: 'Ova ile dağ arasında', vote: 'güçlü' } },
  { at: 'aşiretinin@-0.2', type: 'cavalry', p: { title: 'ŞAZENCAN SÜVARİLERİ', sub: 'Yirmi yıl Hulvan’da' } },
  { at: 'böylece@-0.2', type: 'map', p: { cam: [['böylece@-0.2', 45.6, 34.1, 9]], rivers: 'böylece', show: ['annE'], glow: [['annE', 'kapısı']], cities: [['Bağdat', ...BAG, 0, true], ['Hulvan', ...HUL, 0, true]], text: [['kapısı', 'MEZOPOTAMYA’NIN DOĞU KAPISI', null, 84]] } }],
 ch03: [
  { at: 0, type: 'map', p: { cam: [[0, 47.0, 34.3, 13]], show: ['annE'], cities: [['Bağdat', ...BAG, 0, true], ['Hulvan', ...HUL, 0, true], ['Kirmanşah', ...KER, 'hemedana', true], ['Hemedan', ...HEM, 'hemedana', true]],
      arrows: [['bağdatı', BAG, HUL, '#ffcf3a', 1.4], ['hemedana', HUL, HEM, '#ffcf3a', 1.4], ['horasana', HEM, [51.5, 35.7], '#ffcf3a', 1.4]], text: [['tırmanırdı', 'HORASAN YOLU', null, 100]] } },
  { at: 'ipek@-0.2', type: 'caravan', p: { title: 'İPEK · BAHARAT · AT · KUMAŞ', sub: 'Kervanlar ve hacı kafileleri', road: 'ipek' } },
  { at: 'yolu@-0.2', type: 'cavalry', p: { warm: .2, title: 'YOLUN BEKÇİLERİ', sub: 'Geçiş vergisi' } },
  { at: 'zenginliği@-0.2', type: 'scenic', p: { warm: .1, lines: [['diyala', 'DİYALA OVASI', 130, .3], ['buğday', 'Sulak topraklar · buğday ve arpa', 62, .45, 'corm']] } },
  { at: 'aşiretler@-0.2', type: 'map', p: { cam: [['aşiretler@-0.2', 45.9, 34.4, 8]], show: ['annE'], cities: [['Hulvan', ...HUL, 0, true]],
      arrows: [['kışı', [46.7, 35.0], [45.2, 33.9], '#7fe0ff', 1.3], ['yazı', [45.3, 34.0], [46.8, 35.1], '#ffcf3a', 1.3]],
      labels: [['kışı', 44.9, 33.7, 'KIŞLA', 'Mezopotamya ovası', ''], ['yazı', 47.1, 35.3, 'YAYLA', 'Serin dağlar', '']] } },
  { at: 'bu yayla@-0.2', type: 'scenic', p: { warm: .3, lines: [['yayla', 'YAYLA VE KIŞLA', 130, .3], ['yurt', 'Ova ve dağ: tek bir yurt', 62, .45, 'corm']] } }],
 ch04: [
  { at: 0, type: 'org', p: { title: 'ANNAZÎ YÖNETİMİ', sub: 'Aşiret düzeni', nodes: [['süvarilerinden', 'ŞAZENCAN SÜVARİLERİ', 'Gücün kaynağı', .2, .68, 'horse'], ['paylaşılırdı', 'HANEDAN ÜYELERİ', 'Toprak paylaşımı', .4, .74, 'city'], ['mühelhil', 'MÜHELHİL', 'Kardeş · Şehrizor', .6, .74, 'city'], ['surhab', 'SURHAB', 'Kardeş · Bendenicin', .8, .68, 'city']] } },
  { at: 'sarayda@-0.2', type: 'court', p: { title: 'SARAY', sub: 'Elçiler · vergiler · meclis', envoy: 'sarayda', bow: 'kabul', notes: [['vergiler', 'VERGİLER TOPLANIRDI'], ['meclis', 'AŞİRET MECLİSİ']] } },
  { at: 'önemli@-0.2', type: 'council', p: { title: 'AŞİRET BÜYÜKLERİ', sub: 'Kararlar onayla alınırdı', vote: 'onayıyla' } },
  { at: 'bu düzen@-0.2', type: 'cavalry', p: { warm: .35, title: 'KÜRT AŞİRET GELENEĞİ', sub: 'Yüzyıllarca süren düzen' } }],
 ch05: [
  { at: 0, type: 'cavalry', p: { title: 'KÜRT SÜVARİLERİ', sub: 'Mızrak · ok · hafif zırh' } },
  { at: 'dağ@-0.2', type: 'clash', p: { left: ANN.ann, right: Object.assign({}, ANN.sel, { name: 'DÜŞMAN ORDUSU', sub: 'Geçitte pusuya düştü', rider: Object.assign({}, ANN.sel.rider, { hat: 'helmet', tunic: '#5a3a26', bow: false }) }), vs: true, clash: 'pusu' } },
  { at: 'hanedanın@-0.2', type: 'castle', p: { lines: [['kalelerdi', 'DAĞ KALELERİ', 130, .3], ['sirvan', 'Sirvan · hazine ve sığınak', 60, .42, 'corm']] } },
  { at: 'ovada yenilen@-0.2', type: 'scenic', p: { warm: .45, lines: [['yenilen', 'OVAYI KAYBETSE BİLE', 110, .3], ['yok', 'dağlar onları korurdu', 62, .45, 'corm']] } }],
 ch06: [
  { at: 0, type: 'map', p: { cam: [[0, 46.9, 34.5, 8.5]], show: ['annE', ['hsn', 'dinever']], tags: [['annE'], ['hsn', 'dinever']], cities: [['Hulvan', ...HUL, 0, true], ['Dinever', ...DIN, 'dinever', true]] } },
  { at: 'iki hanedan@-0.2', type: 'houses', p: { left: ['emir', 'ANNAZÎLER', 'Hulvan'], right: ['badr', 'HASANVEYHÎLER', 'Dinever'], ring: 'evlilik', rival: 'rakiptiler' } },
  { at: 'iki kürt@-0.2', type: 'clash', p: { left: ANN.ann, right: ANN.hsn, vs: true, clash: 'geldi' } },
  { at: 'hasanveyhî emiri@-0.2', type: 'portrait', p: { who: 'badr', name: 'BEDR BİN HASANVEYH', nsize: 96, sub: 'Hasanveyhî emiri', year: '1014', notes: [['öldüğünde', 'ÖLÜMÜYLE', 'Hasanveyhî gücü dağıldı']] } },
  { at: 'onların@-0.2', type: 'map', p: { cam: [['onların@-0.2', 46.4, 34.7, 8]], show: ['ann'], glow: [['ann', 'annazîlere']], cities: [['Hulvan', ...HUL, 0, true], ['Dinever', ...DIN, 0, true]], text: [['annazîlere', 'TOPRAKLAR GENİŞLEDİ', null, 100]] } }],
 ch07: [
  { at: 0, type: 'portrait', p: { who: 'emir', name: 'EBUŞŞEVK FARİS', sub: 'Hüsameddevle', year: '1011 – 1046', notes: [['otuz', '35 YIL', 'Hanedanın en parlak dönemi']] } },
  { at: 'onun@-0.2', type: 'map', p: { year: '~1030', cam: [['onun@-0.2', 46.0, 34.5, 8]], show: ['ann'], glow: [['ann', 'onun']], cities: [['Hulvan', ...HUL, 'hulvandan', true], ['Kirmanşah', ...KER, 'kirmanşaha', true], ['Dinever', ...DIN, 'dineverden', true], ['Şehrizor', ...SEH, 'şehrizora', true], ['Dakuk', ...DAK, 'dakuktan', true], ['Bendenicin', ...BEN, 'bendenicine', true]] } },
  { at: 'bu toprakların@-0.2', type: 'map', p: { cam: [['bu toprakların@-0.2', 45.0, 33.9, 12]], rivers: 'ovasının', show: ['ann'], cities: [['Bağdat', ...BAG, 0, true], ['Hulvan', ...HUL, 0, true]], text: [['kenarında', 'MEZOPOTAMYA’NIN DOĞU KENARI', null, 80]] } },
  { at: 'bağdat ile@-0.2', type: 'cavalry', p: { warm: .3, title: 'ANNAZÎ SÜVARİLERİ', sub: 'Bağdat ile Hemedan arasında' } }],
 ch08: [
  { at: 0, type: 'map', p: { cam: [[0, 47.4, 34.0, 19]], show: ['ann'], cities: [['Hulvan', ...HUL, 0, true], ['Bağdat', ...BAG, 'bağdattaki', true], ['Musul', ...MUS, 'musulu', true], ['Hille', ...HIL, 'hillede', true], ['İsfahan', ...ISF, 'isfahan', true]],
      labels: [['abbasi', 42.3, 34.2, 'ABBASİ HALİFELİĞİ', 'Bağdat', ''], ['ukaylîler', 42.0, 37.0, 'UKAYLÎLER', 'Musul', ''], ['mezyedîler', 43.0, 31.7, 'MEZYEDÎLER', 'Hille', ''], ['kâkûyîler', 51.6, 33.5, 'KÂKÛYÎLER', 'İsfahan', '']] } },
  { at: 'ebuşşevk@-0.2', type: 'court', p: { title: 'İTTİFAK VE SAVAŞ', sub: 'Komşu hanedanlarla', envoy: 'ebuşşevk', bow: 'ittifak', envoyRobe: '#26345a' } },
  { at: 'elçiler@-0.2', type: 'list', p: { title: 'DİPLOMASİNİN SİLAHLARI', colors: ['#fff3d0', '#ffc06a', '#3fa0e0'], items: [['elçiler', 'ELÇİLER'], ['hediyeler', 'HEDİYELER'], ['evlilik', 'EVLİLİK BAĞLARI'], ['kılıç', 'VE KILIÇ']] } },
  { at: 'uzaktaki@-0.2', type: 'map', p: { cam: [['uzaktaki@-0.2', 43.8, 38.0, 19]], show: ['ann'], cities: [['Hulvan', ...HUL, 0, true], ['Amed', ...AMD, 'mervânîler', true], ['Gence', ...GEN, 'şeddâdîler', true]],
      labels: [['mervânîler', 40.2, 38.5, 'MERVÂNÎLER', 'Amed', ''], ['şeddâdîler', 46.4, 41.3, 'ŞEDDÂDÎLER', 'Gence', '']] } }],
 ch09: [
  { at: 0, type: 'feud', p: { left: ['emir', 'EBUŞŞEVK', 'Emir'], right: ['muhalhil', 'MÜHELHİL', 'Kardeş · Şehrizor'], crack: 'rekabet', text: ['aşiretleri', 'AŞİRETLER BÖLÜNDÜ'] } },
  { at: 'daha@-0.2', type: 'feud', p: { left: ['muhalhil', 'MÜHELHİL', 'Amca'], right: ['sadi', 'SADİ', 'Ebuşşevk’in oğlu'], crack: 'karşı', text: ['dışarıdan', 'TAHT KAVGASI'] } },
  { at: 'bu bölünme@-0.2', type: 'map', p: { cam: [['bu bölünme@-0.2', 49.5, 34.8, 15]], show: ['ann', ['selj', 'doğudan']], tags: [['selj', 'doğudan']], glow: [['selj', 'fırtınanın']], text: [['fırtınanın', 'DOĞUDAN GELEN FIRTINA', null, 90]] } }],
 ch10: [
  { at: 0, type: 'map', p: { year: '1046', cam: [[0, 49.0, 34.8, 14], ['bin kırk', 47.2, 34.5, 9]], show: ['ann', 'selj'], tags: [['selj']], cities: [['Hulvan', ...HUL, 0, true], ['Hemedan', ...HEM, 0, true]],
      armies: [['bin kırk', [51.5, 35.4], HUL, '#26345a', '#0a0e1c', 2.6]] } },
  { at: 'selçuklu komutanı@-0.2', type: 'portrait', p: { who: 'inal', name: 'İBRAHİM YINAL', sub: 'Selçuklu komutanı', year: '1046', bg: '#2a3a6a' } },
  { at: 'şehir@-0.2', type: 'siege', p: { title: 'HULVAN · 1046', sub: 'Kuşatma', burn: 'düştü' } },
  { at: 'aynı@-0.2', type: 'castle', p: { lines: [['sirvan', 'SİRVAN KALESİ', 120, .3], ['kaybetti', 'Ebuşşevk burada hayatını kaybetti · 1046', 56, .42, 'corm']] } },
  { at: 'annazîler@-0.2', type: 'cavalry', p: { warm: .5, title: 'DAĞLARDAN VAZGEÇMEDİLER', sub: '' } }],
 ch11: [
  { at: 0, type: 'castle', p: { lines: [['yetmiş', 'YETMİŞ YIL DAHA', 130, .3], ['dağlarda', 'Kalelerde ve dağlarda', 62, .42, 'corm']] } },
  { at: 'mühelhil@-0.2', type: 'map', p: { cam: [['mühelhil@-0.2', 45.3, 34.9, 8]], show: ['annE'], cities: [['Şehrizor', ...SEH, 'şehrizor', true], ['Dakuk', ...DAK, 'dakuk', true], ['Hulvan', ...HUL, 0, true]] } },
  { at: 'bin yüz@-0.2', type: 'map', p: { year: '~1117', cam: [['bin yüz@-0.2', 45.6, 34.3, 10]], show: ['annE'], cities: [['Hulvan', ...HUL, 0, true]], text: [['sahnesinden', 'TARİH SAHNESİNDEN ÇEKİLDİ', null, 84]] } },
  { at: 'bu,@-0.2', type: 'scenic', p: { warm: .25, lines: [['mezopotamya’nın', 'MEZOPOTAMYA’NIN DOĞU KAPISI', 104, .32], ['son', 'son büyük Kürt hanedanlarından biri', 60, .48, 'corm']] } }],
 ch12: [
  { at: 0, type: 'quote', p: { title: 'VLADIMIR MINORSKY', text: 'İran ara dönemi', src: '— DEYLEMLİ VE KÜRT HANEDANLARININ ÇAĞI', colors: ['#fff6d8', '#ffcf7a', '#d27a3a'] } },
  { at: 'annazîler@-0.2', type: 'list', p: { title: 'ORTA ÇAĞ KÜRT HANEDANLARI', colors: ['#fff3d0', '#ffc06a', '#c8402a'], items: [['mervânîler', 'MERVÂNÎLER · Amed'], ['şeddâdîler', 'ŞEDDÂDÎLER · Gence'], ['hasanveyhîlerle', 'HASANVEYHÎLER · Dinever'], ['halkasıydı', 'ANNAZÎLER · Hulvan']] } },
  { at: 'bugün@-0.2', type: 'scenic', p: { warm: .2, lines: [['serpol-i', 'SERPOL-İ ZEHAB · ŞEHRİZOR · DAKUK', 76, .32], ['mirasçılarıdır', 'bin yıllık hikâyenin mirasçıları', 62, .46, 'corm']] } }],
 ch13: [
  { at: 0, type: 'scenic', p: { warm: .3, lines: [['bir aşiret', 'BİR AŞİRET · BİR GEÇİT', 100, .3], ['yüz', '130 YILLIK EMİRLİK', 130, .45], ['kürt', 'Kürt tarihinin unutulmuş sayfaları', 60, .6, 'corm']] } },
  { at: 'bu videoyu@-0.2', type: 'scenic', p: { warm: .2, lines: [['videoyu', 'ABONE OL', 140, .38], ['yorumlarda', 'Görüşlerinizi yorumlarda paylaşın', 62, .55, 'corm']] } }]
};
window.CREDITS = ['# Kaynaklar', 'İbnü’l-Esîr — el-Kâmil fi’t-Târîh', 'V. Minorsky — “ʿAnnāzids”, Encyclopaedia of Islam (2. baskı)', 'Encyclopaedia Iranica — “ʿAnnazids”', 'C. E. Bosworth — The New Islamic Dynasties, Edinburgh, 1996', 'Encyclopaedia Britannica — “ʿAnnazid dynasty”',
 'Anubanini kabartması — Serpol-i Zehab', '# Not', 'Kaynaklarda bazı tarihler ve sınırlar farklılık gösterir', 'Portreler temsilîdir', '# Yapım', 'DÎROK'];
