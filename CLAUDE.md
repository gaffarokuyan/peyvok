# Peyvok — proje notu

Peyvok, Words of Wonders tarzı bir **Kurmancî kelime bulmaca oyunu**: harf çarkı + çapraz bulmaca, 200 seviye, her 10 seviyede yeni bir yer (Kürdistan'dan 20 mekân) ve kartpostal.
Geliştirici: Gaffar (Okuyan Studio). Kısa, doğrudan Türkçe cevap tercih eder. Expo kuralları için ayrıca `AGENTS.md`'ye bak.

## Mimari
- **Oyunun tamamı tek HTML dosyası:** `source/peyvok.html` (~140 KB, vanilla JS + CSS + canvas, framework yok). **Asıl kaynak budur.**
- **Uygulama:** Expo + `react-native-webview`. `App.tsx`, `assets/web/game.html`'i `expo-asset` ile yükleyip WebView'da açar; Android geri tuşu `BACK_JS` ile oyun içine yönlendirilir.
- **Build akışı:** `source/peyvok.html` düzenle → `python3 tools/build_game.py` → `assets/web/game.html` üretilir (Google Fonts linki `source/fonts-inline.html` içindeki gömülü woff2 fontlarla değiştirilir, böylece offline çalışır). `assets/web/game.html`'i elle düzenleme.
- **Kayıt:** `localStorage["peyvok:v5"]` (seviye, altın, kartlar, ayarlar, ipucu, çark). Sunucu/hesap yok.
- **Arka planlar tamamen kodla çizilir (fotoğraf yok):** `BG` motoru + `THEMES` (8 renk paleti) × `STYLES` (6 ince çizgi kompozisyonu: silk = ipek şerit, contour = topografik dağ çizgileri, horizon = gezegen ufku, glass = cam küreler, dunes = yumuşak tepeler, kilim = ince kilim deseni). Üstünde yavaş kayan 3 yumuşak renk alanı (mesh ışık) + az sayıda parıltı. Sade ve zarif kalsın: uçuşan şekil/harf, parlak hüzme yok. Her `BG_EVERY=6` seviyede yeni "atmosfer" (`bgOf(level)`), geçişte yumuşak crossfade + bir kez "Atmosfera nû" bildirimi (`S.seenBg`). Kartpostallar `SC` ile çizilen manzaralar (`miniScene`). `source/img/` artık kullanılmıyor, sadece referans.
- **Ses/müzik:** WebAudio ile sentez (`initAudio`, `tone`, `startMusic`, `schedule`).

## Klasörler
```
App.tsx, app.json, eas.json, assets/   # Expo uygulaması
assets/web/game.html                   # ÜRETİLEN dosya (tools/build_game.py)
source/peyvok.html                     # OYUN KAYNAĞI
source/fonts-inline.html               # gömülü @font-face (Baloo 2, Cinzel, Nunito; latin+latin-ext)
source/levels56.json                   # 200 seviye (oyuna gömülü olanın kaynağı)
source/gen56.py                        # seviye üretici (max 5 sütun × 6 satır) — source/ içinden çalıştır
source/gen7.py, gen200.py              # eski üreticiler (referans)
source/peyvok-kelimeler.csv            # ~2900 Kurmancî kelime + Türkçe anlam
source/tr/o*.tsv                       # yaygın kelime listeleri (ilk 60 seviye sadece bunlar)
source/img/                            # eski sahne fotoları — oyunda KULLANILMIYOR (referans)
source/p5/                             # eski ara parçalama (style.css, main.js, spin.js…) — sadece referans
site/                                  # tanıtım sitesi + gizlilik politikası (Netlify)
vid/                                   # tanıtım videosu üretici (make.py, music.py, fonts/)
tools/build_game.py
```

## Oyun kodu — önemli yerler (`source/peyvok.html`)
| Fonksiyon | Görev |
|---|---|
| `load()/save()` | localStorage `peyvok:v5` |
| `SCENES[20]` | `{n:isim, r:bölge 0-3, f:[TR, EN, KU bilgi]}`; mekân adı/kartpostal = `Math.floor(level/10)` |
| `THEMES/STYLES/bgOf/BG.draw` | kodla arka plan; tema `--tile/--tile-hi/--tile-deep/--acc/--glow` CSS değişkenlerini de ayarlar |
| `setScene(level)` | seviyeye göre arka planı çizer (aynı atmosferdeyse yeniden çizmez), crossfade başlatır |
| `frame()` | arka plan + süzülen ışık küreleri + parıltılar (RAF) |
| `SC.draw` / `miniScene` | kartpostal manzaraları (kodla çizim) |
| `startLevel()` → `renderGrid()`, `renderWheel()` | seviye kurulumu |
| `renderGrid()` | kutu boyutu `Math.min(64,(W-gap*(cols-1))/cols,(H-gap*(rows-1))/rows)`, gap=6 |
| `drawLine/hit/submit` | çarkta parmakla seçim, kelime kontrolü |
| `flyIn/praise/checkDone/openDone` | doğru kelime animasyonu, övgü şeridi, seviye sonu kartpostal |
| `openColl()` | kartpostal koleksiyonu |
| `openSpin/doSpin/wheelSVG/updSpinUI` | günlük şans çarkı |
| `updFH()` | ücretsiz ipucu rozeti |

### Seviye formatı (`levels56.json`)
```json
{"l":"karışık harfler","w":[["kelime","türkçe"],...],"x":{"r":satır,"c":sütun,"p":[[row,col,dir],...]},"b":["bonus"]}
```
`dir`: 0 yatay, 1 dikey; `p[i]` ↔ `w[i]`. Yeniden üretim: `cd source && python3 gen56.py` (çıktı `levels.json` adını kontrol et) → oyundaki gömülü seviye dizisini değiştir.

### Onaylı tasarım kararları — bozma
- **"Zimrûd" teması (Garanti BBVA renkleri):** ana yeşil `#2C873A`, koyu `#002808`; ek tonlar BBVA lacivert `#072146`, aqua `#2DCCCD`, teal, jade, lime. Beyaz kutular/çark, yeşil gradyan bulunan kutular ve CTA. Fontlar: Baloo 2 (harfler/başlık), Nunito 800–900 (arayüz). Altın sadece coin/ödül için.
- **Kutular her seviyede 64px (1. seviyedeki gibi). Küçültme.** Bu yüzden ızgara max 5×6; övgü şeridi (`top:-58px`) ve kelime balonu ızgaranın üstüne overlay.
- Arka planlar koyu, üstte/altta karartmalı (HUD ve çark okunur kalsın); fotoğraf eklenmez, yeni görünüm = yeni `THEMES`/`STYLES` girdisi.
- Logo: PEYV yeşil + OK beyaz harf kutuları. Ana sayfada ilerleme halkası (yeşil gradyan).
- Günlük çark: 8 dilim (10–100 altın, 1–2 ipucu), günde 5 çevirme; ilki bedava, gerisi ödüllü reklam; `lvl>0` ise günde bir kez otomatik açılır. Kazanma penceresi "Te qezenc kir" (ışınlar + sayaç + "BIGIRE").
- Arayüz dili: KU / TR / EN.

## YAYIN ÖNCESİ YAPILACAKLAR
1. **Test ayarını geri al:** `openColl()` içinde `SCENES.map((s,i)=>true?` → `true` yerine kartın açık olup olmadığı kontrolü (`S.cards.includes(i)`); "seviyeye git" test butonunu kaldır.
2. **AdMob:** şu an sahte — `window.showRewardedAd=()=>new Promise(r=>setTimeout(()=>r(true),1200))`. `react-native-google-mobile-ads` ekle; WebView'dan `window.ReactNativeWebView.postMessage('ad:rewarded')`, native taraf reklamı gösterip `injectJavaScript` ile Promise'i çözsün. (Expo dev build gerekir, Expo Go'da çalışmaz.)
3. `site/` içindeki ekran görüntüleri (`s_home/s_game/s_card.webp`) eski mor/altın tasarımdan; yeni tasarımla yenilenmeli.
4. Gizlilik URL'i: `https://peyvok.netlify.app/privacy.html` (`site/` Netlify'a yüklenecek).
5. `versionCode` EAS tarafından otomatik artar (`appVersionSource: remote`, `autoIncrement`); elle değiştirme.

## Build
- `npx expo install` ile bağımlılıklar; test: `npx expo start`.
- APK: `eas build -p android --profile preview` · Play (AAB): `eas build -p android --profile production`.
- EAS projesi: owner `gaffardevs-team`, projectId `b3f473a8-4eae-4cf5-83e0-1adc102f1828`, paket `com.okuyanstudio.peyvok`.
