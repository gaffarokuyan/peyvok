# Newroz Legends — Android (Expo)

Oyunun kaynağı `../games/agire-kawa/index.html`. Bu klasör onu WebView içinde çalışan bir Expo uygulamasına paketler.
Paket adı: `com.okuyanstudio.agirekawa` · EAS: `@uservys-team/userbey` (projectId 4bfa7ac9-…).

## Akış
```bash
cd kawa
npm install
npm run build:game          # ../games/agire-kawa/index.html -> assets/web/game.html (three.js + fontlar gömülü, tamamen offline)
npx expo start              # test
npx eas-cli@latest init     # ilk sefer: EAS projesi oluşturur, app.json'a projectId yazar
npx eas-cli@latest build -p android --profile preview      # APK (telefona kur, dene)
npx eas-cli@latest build -p android --profile production   # AAB (Play Console)
```
`assets/web/game.html`'i elle düzenleme; oyunu kaynakta değiştir, `npm run build:game` çalıştır.

## Play Store
- Mağaza görselleri: `store/` (512 ikon, 1024×500 tanıtım görseli, TR/EN telefon ekran görüntüleri).
- Gizlilik politikası: `https://newroz-legends.netlify.app/privacy.html` (`../site/kawa-privacy.html`; Netlify sitesi `newroz-legends` (peyvokkurdi@gmail.com hesabı)).
- Veri güvenliği formu: veri toplanmıyor, paylaşılmıyor. Reklam yok. Hedef yaş: 13+.
- Kategori: Oyun › Aksiyon. İçerik derecelendirmesi anketinde: fantastik şiddet (insan olmayan yaratıklar), kan yok.

## Satın alma / reklam
`App.tsx` içinde `window.KAWA_NATIVE={iap:false,ads:false}`. Kapalıyken oyun gerçek fiyatlı ürünleri gizler,
reklam butonları ücretsiz ödül verir. Açmak için:
1. Play Console'da ürünleri oluştur: `starter_pack`, `gems_80`, `gems_500`, `gems_1200`, `gems_3000`, `no_ads`.
2. `react-native-purchases` (RevenueCat) ve/veya `react-native-google-mobile-ads` ekle (`npx expo install`).
3. `onMessage` içinde `iap:buy` / `ad:rewarded` mesajlarını gerçekten işle, sonuçta `window.__nativeReply(id, true)` çağır.
4. Bayrakları `true` yap, gizlilik politikasını reklam/satın alma bölümüyle güncelle.
