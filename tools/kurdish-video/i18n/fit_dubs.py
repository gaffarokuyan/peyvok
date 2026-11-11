"""Hazir dublaj ses dosyalarini (16:52'lik eski surum) videonun guncel haline (11:50) oturtur.

    python3 i18n/fit_dubs.py <kaynak_klasoru> <cikis_klasoru>

Kaynak klasorde *_en_*.m4a, *_de_*.m4a, *_ar_*.m4a, *_ku_*.m4a, *_ckb_*.m4a dosyalari olmalidir.
Her dil icin:
  - videoda olmayan kisimlar atilir (karsilama, ek bolum, dogrulanmamis alintilar, abone cagrisi),
  - hatali okunan kelimeler (Feqiyê Teyran -> "Tahran") ayni sesin dogru okudugu parcayla degistirilir,
  - tekrarlanan / bozuk cumleler cikarilir,
  - her bolum, videodaki bolumun baslangic anina yerlestirilir (gerekirse hafif hizlandirilir).
Zaman kodlari dublaj dosyalarinin ortak zaman cizelgesine gore ElevenLabs STT ile belirlendi.
"""
import json, os, subprocess, sys, glob
import numpy as np

SR = 48000
HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)

ALIGNED = json.load(open(os.path.join(HERE, "..", "data", "aligned.json")))
SECS = list(ALIGNED["sections"])
STARTS = [ALIGNED["sections"][s]["start"] for s in SECS]
VIDEO_DUR = 710.133


def find(tag):
    return glob.glob(os.path.join(SRC, f"*_{tag}_*.m4a"))[0]


_cache = {}


def load(tag):
    if tag not in _cache:
        r = subprocess.run(["ffmpeg", "-v", "error", "-i", find(tag), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                           capture_output=True, check=True)
        _cache[tag] = np.frombuffer(r.stdout, np.float32).copy()
    return _cache[tag]


def snap(x, t, win=0.10):
    """t civarinda (+-win) en sessiz 10 ms'lik noktayi bulur."""
    a, b = int((t - win) * SR), int((t + win) * SR)
    a = max(a, 0); n = int(0.01 * SR)
    best, bt = 1e9, t
    for i in range(a, b - n, n // 2):
        e = float(np.mean(x[i:i + n] ** 2))
        if e < best:
            best, bt = e, (i + n / 2) / SR
    return bt


def piece(tag, a, b, exact=False):
    x = load(tag)
    if not exact:
        a, b = snap(x, a), snap(x, b)
    y = x[int(a * SR):int(b * SR)].copy()
    f = int(0.012 * SR)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y


# Ayni ses klonunun "Teyran" kelimesini dogru okudugu yer (Ingilizce dublaj, Qewlê Hespê Reş cumlesi)
TEYRAN = ("en", 498.50, 499.04, True)
# "Ziman jiyan e." (Almanca dublajdaki Kurtce okunusu, ayni ses)
ZIMAN = ("de", 943.98, 945.02, True)

# Her bolum: [(dil|None, bas, son)] parcalari; dil None ise o dilin kendi dosyasi.
# 'cut' listeleri bolum icinden atilacak araliklar, 'rep' listeleri (bas, son, kaynak) degisimleri.
COMMON = {
    "01_giris":       (0.0, None),
    "02_dil_ailesi":  (47.5, None),
    "03_arkaik":      (151.8, None),
    "04_eril_disil":  (168.85, None),
    "05_seslenme":    (233.3, None),
    "06_lehceler":    (278.9, None),
    "07_petersburg":  (417.4, None),
    "08_medreseler":  (773.12, None),
    "09_bediuzzaman": (829.15, 916.68),
    "10_kapanis":     (926.0, None),
}
LANG = {
    "en": {
        "end": {"01_giris": 33.86, "02_dil_ailesi": 146.95, "03_arkaik": 162.45, "04_eril_disil": 227.7,
                "05_seslenme": 273.5, "07_petersburg": 614.05, "08_medreseler": 824.5, "10_kapanis": 947.0},
        "06": [(278.9, 354.85), (404.8, 414.1)],
        "cut": [(102.22, 103.58), (428.85, 432.25), (902.25, 904.5)],
        "rep": [(807.33, 807.86, TEYRAN)],
    },
    "de": {
        "end": {"01_giris": 33.86, "02_dil_ailesi": 146.5, "03_arkaik": 164.5, "04_eril_disil": 228.85,
                "05_seslenme": 274.1, "07_petersburg": 614.6, "08_medreseler": 824.2, "10_kapanis": 947.0},
        "06": [(278.9, 354.88), (404.8, 413.25)],
        # "Schweden wurde einer der groessten Foerderer des kurdischen Rundfunks." -> yanlis (radyo); cumle atildi,
        # bir sonraki cumle (Isvec'te yuzlerce Kurtce kitap basildi) bilgiyi zaten veriyor.
        "cut": [(606.27, 609.8), (902.3, 904.62)],  # + tekrar: "und verfasste sie auf Osmanisch-Tuerkisch."
        "rep": [(497.9, 498.24, TEYRAN), (552.14, 552.6, TEYRAN), (807.45, 808.05, TEYRAN)],
    },
    "ar": {
        "end": {"01_giris": 33.86, "02_dil_ailesi": 148.5, "03_arkaik": 163.3, "04_eril_disil": 228.05,
                "05_seslenme": 274.95, "07_petersburg": 614.67, "08_medreseler": 826.15, "10_kapanis": 947.35},
        "06": [(278.9, 354.8), (404.75, 412.95)],
        "cut": [(102.0, 103.56)],
        "rep": [(500.26, 500.75, TEYRAN), (552.16, 552.64, TEYRAN), (809.17, 809.9, TEYRAN),
                (943.88, 945.25, ZIMAN)],  # ilk "اللغة هي الحياة" yerine Kurtce "Ziman jiyan e."
    },
    "ku": {
        "end": {"01_giris": 33.86, "02_dil_ailesi": 143.6, "03_arkaik": 164.15, "04_eril_disil": 229.3,
                "05_seslenme": 274.3, "07_petersburg": 614.66, "08_medreseler": 826.1, "10_kapanis": 945.05},
        "06": [(278.9, 354.82), (404.9, 413.6)],
        "cut": [(859.7, 861.12)],   # "di sala 1980an de" (yanlis yil, dogrusu 1908) cikarildi
        "rep": [],
    },
    "ckb": {
        "end": {"01_giris": 33.7, "02_dil_ailesi": 144.9, "03_arkaik": 162.55, "04_eril_disil": 228.4,
                "05_seslenme": 273.9, "07_petersburg": 614.2, "08_medreseler": 824.85, "10_kapanis": 944.85},
        "06": [(278.9, 354.9), (404.9, 412.2)],
        "cut": [(857.3, 858.86)],   # "لە ساڵی ..." (yanlis yil) cikarildi
        "rep": [],
    },
}


def section_audio(tag, sec):
    cfg = LANG[tag]
    if sec == "06_lehceler":
        ranges = list(cfg["06"])
    else:
        a, b = COMMON[sec]
        ranges = [(a, b if b is not None else cfg["end"][sec])]
    # kesim ve degisimleri araliklara uygula
    events = sorted([(c[0], c[1], None) for c in cfg["cut"]] + list(cfg["rep"]))
    parts = []
    for a, b in ranges:
        cur = a
        for ea, eb, src in events:
            if ea >= a and eb <= b:
                parts.append(piece(tag, cur, ea))
                if src:
                    parts.append(piece(*src))
                cur = eb
        parts.append(piece(tag, cur, b))
        parts.append(np.zeros(int(0.35 * SR), np.float32))
    return np.concatenate(parts[:-1])


def atempo(y, r):
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                        "-af", f"atempo={r:.4f}", "-f", "f32le", "-"], input=y.tobytes(), capture_output=True, check=True)
    return np.frombuffer(p.stdout, np.float32).copy()


NAMES = {"en": "English", "de": "Deutsch", "ar": "Arabic", "ku": "Kurmanci", "ckb": "Sorani"}
for tag in (sys.argv[3:] or LANG):
    full = np.zeros(int(VIDEO_DUR * SR), np.float32)
    report = []
    for i, sec in enumerate(SECS):
        y = section_audio(tag, sec)
        slot = (STARTS[i + 1] if i + 1 < len(SECS) else VIDEO_DUR) - STARTS[i] - 0.25
        r = len(y) / SR / slot
        if r > 1.0:
            y = atempo(y, r)
        s = int(STARTS[i] * SR)
        full[s:s + len(y)] = y[:len(full) - s]
        report.append(f"{sec}: {len(y)/SR:6.1f}s / yuva {slot:6.1f}s" + (f"  (x{r:.3f})" if r > 1 else ""))
    dst = os.path.join(OUT, f"Kurtce_Ses_{tag}_{NAMES[tag]}.m4a")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-ac", "2", "-c:a", "aac", "-b:a", "192k", dst], input=full.tobytes(), check=True)
    print(f"== {tag} -> {dst}\n  " + "\n  ".join(report), flush=True)
