# Kürtçe: Mezopotamya'nın Kadim Dili — video üretim hattı

Kürtçenin dil ailesi, gramer özellikleri, lehçeleri, Rus Kürdolojisi, medrese geleneği ve
Bediüzzaman Said Nursi üzerine 8 dakikalık bir anlatım videosu. Bütün görseller ve
animasyonlar kodla (Pillow + ffmpeg) üretilir; hazır görsel kullanılmaz.

## Akış

| Adım | Dosya | Ne yapar |
|---|---|---|
| 1 | `narration/sections.py` | Bölüm bölüm seslendirme metni |
| 2 | `narration/generate_tts.py` | ElevenLabs **Eleven v4**, **Yunus C** sesiyle bölümleri üretir → `build/tts/` |
| 3 | `narration/splice_kurdish.py` | Mazdek'in Kurmancî telaffuzunu (Yunus C sesine çevrilmiş) Kürtçe kelimelerin yerine yerleştirir → `build/spliced/` |
| 4 | `video/align.py` | Metni seslendirmenin kelime zamanlarıyla eşleştirir → `data/aligned.json` |
| 5 | `video/render.py` | Sahneleri, animasyonları ve altyazıları kare kare çizer |
| 6 | `build.sh` | Seslendirmeyi birleştirir, videoyu 4 paralel parçada render eder, sesle birleştirir |

## Kullanım

```bash
./fetch_fonts.sh                       # Playfair Display, Inter, Amiri (OFL) → video/fonts/
python3 narration/generate_tts.py      # ElevenLabs anahtarı gerekir
# Mazdek TTS kaydını ElevenLabs speech-to-speech (eleven_multilingual_sts_v2) ile
# Yunus C sesine çevirip build/mazdek_yunusc.mp3 olarak koyun
python3 narration/splice_kurdish.py
./build.sh                             # output/Kurtce_Mezopotamyanin_Kadim_Dili.mp4
```

Altyazı varsayılan olarak videoya gömülmez; `output/Kurtce_Video_Altyazi.srt` ayrı dosya olarak üretilir.
Gömülü altyazılı sürüm için: `BURN_SUBS=1 ./build.sh`

Yalnızca görselleri değiştirmek için 2–3. adımlara gerek yok: `build/narration.mp3` hazırsa
`./build.sh` videoyu yeniden üretir. Tek karelik önizleme:

```bash
python3 video/render.py still 26 140 425   # build/stills/ altına PNG
```

## Veri dosyaları

- `data/narration_words.json` — son seslendirmenin kelime zaman damgaları (ElevenLabs Scribe)
- `data/section_words/*.json` — bölüm seslerinin kelime zaman damgaları (yerleştirme için)
- `data/mazdek_yunusc_words.json` — Mazdek kaydındaki Kürtçe kelimelerin zamanları
- `data/aligned.json` — metin ↔ zaman eşleşmesi (render bunu kullanır)
- `output/Kurtce_Video_Altyazi.srt` — altyazı dosyası

## Notlar

- Seslendirme metninde sayılar ve bazı isimler okunuşa göre yazılmıştır
  (ör. "bin sekiz yüz yetmiş dokuz", "İşaratül İcaz"). Altyazıda `render.py` içindeki
  `DISPLAY` tablosu bunları doğru yazıma çevirir.
- Türkçe ek almış Kürtçe kelimeler (ör. *Xanî'nin*) Mazdek kaydıyla değiştirilmez;
  ek ses kaydından ayrılamadığı için ElevenLabs okuması kalır.
- Cormorant Garamond fontu ê/î/û harflerini bozuk gösterdiği için Playfair Display kullanılır.
