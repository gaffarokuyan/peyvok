"""Mazdek'in Kurmanci telaffuzunu (Yunus C sesine cevrilmis) seslendirmeye yerlestirir.

Girdi:  build/tts/<bolum>.mp3, build/mazdek_yunusc.mp3,
        data/section_words/<bolum>.json, data/mazdek_yunusc_words.json
Cikti:  build/spliced/<bolum>.mp3
"""
import json, os, subprocess, difflib, sys
import numpy as np

SR = 44100
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
os.makedirs(f"{D}/build/spliced", exist_ok=True)

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def save(path, a):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                    "-c:a", "libmp3lame", "-b:a", "192k", path], input=a.astype(np.float32).tobytes(), check=True)

def words(js):
    return [w for w in json.load(open(js))["words"] if w["type"] == "word"]

def norm(t):
    t = t.lower()
    for a, b in {"ê": "e", "î": "i", "û": "u", "â": "a", "q": "k", "ı": "i", "w": "v", "x": "h"}.items():
        t = t.replace(a, b)
    return "".join(c for c in t if c.isalnum())

# Mazdek -> Yunus C kaydindaki kelime indeksleri
CLIP = {
    "Ehmedê Xanî": (0, 1), "Xanî": (1, 1), "Melayê Cizîrî": (2, 4), "Feqiyê Teyran": (8, 9),
    "Mela Xelîlê Sêrtî": (11, 13), "Nûbihara Biçûkan": (14, 15), "Nûbihar": (16, 16),
    "Kurmancî": (23, 23), "Soranî": (24, 24), "Kelhurî": (25, 25), "Feylî": (26, 26), "Lekî": (27, 27),
    "Zazakî": (28, 28), "Kirmanckî": (29, 29), "Dimilî": (30, 30), "Goranî": (31, 31), "Hewramî": (33, 33),
    "stêr": (36, 36), "nû": (37, 37), "nav": (38, 38),
    "Kurê min": (39, 40), "Keça min": (41, 42), "Ez mêrî dibînim": (43, 45), "Ez jinê dibînim": (46, 48),
    "Kuro were": (49, 50), "Bavo": (51, 51), "Keçê": (52, 52), "Hevalno": (53, 53), "Ziman jiyan e": (54, 56),
}
# Narration'da aranacak hali (kelime sayisi), bolume gore
PLAN = {
    "02_dil_ailesi": ["stêr", "nû", "nav"],
    "04_eril_disil": ["Ez mêrî dibînim", "Ez jinê dibînim", "Kurê min", "Keça min", "Kurmancî", "Zazakî", "Goranî"],
    "05_seslenme": ["Kuro were", "Bavo", "Keçê", "Hevalno"],
    "06_lehceler": ["Kurmancî", "Soranî", "Kelhurî", "Feylî", "Lekî", "Zazakî", "Kirmanckî", "Dimilî", "Goranî", "Hewramî"],
    "07_petersburg": ["Nûbihara Biçûkan", "Xanî"],
    "08_medreseler": ["Melayê Cizîrî", "Feqiyê Teyran", "Ehmedê Xanî", "Mela Xelîlê Sêrtî", "Nûbihar"],
    "10_kapanis": [("Ziman jiyan e", 37, 38)],
}

kw = words(f"{D}/data/mazdek_yunusc_words.json")
kaudio = load(f"{D}/build/mazdek_yunusc.mp3")

def span(ws, i, j, maxpad):
    s, e = ws[i]["start"], ws[j]["end"]
    ps = ws[i - 1]["end"] if i > 0 else 0
    ne = ws[j + 1]["start"] if j + 1 < len(ws) else e + 0.3
    return s - min(maxpad, (s - ps) / 2), e + min(maxpad, (ne - e) / 2)

def rms(a):
    return float(np.sqrt(np.mean(a ** 2)) + 1e-9)

def fade(a, ms=8):
    n = min(int(SR * ms / 1000), len(a) // 2)
    r = np.linspace(0, 1, n, dtype=np.float32)
    a[:n] *= r; a[-n:] *= r[::-1]
    return a

report = []
for sec, terms in PLAN.items():
    nw = words(f"{D}/data/section_words/{sec}.json")
    audio = load(f"{D}/build/tts/{sec}.mp3")
    toks = [norm(w["text"]) for w in nw]
    used = set(); reps = []
    for term in terms:
        if isinstance(term, tuple):
            term, i0, j0 = term
            reps.append((i0, j0, term)); used.update(range(i0, j0 + 1))
            report.append((sec, term, "ELLE " + " ".join(nw[k]["text"] for k in range(i0, j0 + 1)))); continue
        tt = [norm(t) for t in term.split()]
        # "Melayê" STT'de "Mela yê" gibi bolunebilir: hem birlesik hem ayrik dene
        found = False
        for n in range(len(tt), len(tt) + 2):
            for i in range(len(toks) - n + 1):
                if any(k in used for k in range(i, i + n)):
                    continue
                if "'" in nw[i + n - 1]["text"] or "’" in nw[i + n - 1]["text"]:
                    continue  # Turkce ekli -> atla
                cand = "".join(toks[i:i + n]); target = "".join(tt)
                if abs(len(cand) - len(target)) > 1:
                    continue
                if difflib.SequenceMatcher(None, cand, target).ratio() >= 0.75:
                    reps.append((i, i + n - 1, term)); used.update(range(i, i + n)); found = True
                    break
            if found:
                break
        report.append((sec, term, "OK " + " ".join(nw[k]["text"] for k in range(reps[-1][0], reps[-1][1] + 1)) if found else "BULUNAMADI"))
    reps.sort()
    out = []; cur = 0
    for i, j, term in reps:
        ns, ne = span(nw, i, j, 0.04)
        ci, cj = CLIP[term]
        cs, ce = span(kw, ci, cj, 0.05)
        seg_n = audio[int(ns * SR):int(ne * SR)]
        seg_k = kaudio[int(cs * SR):int(ce * SR)].copy()
        seg_k *= rms(seg_n) / rms(seg_k)
        out.append(audio[cur:int(ns * SR)]); out.append(fade(seg_k)); cur = int(ne * SR)
    out.append(audio[cur:])
    res = np.concatenate(out)
    res = np.clip(res, -1, 1)
    save(f"{D}/build/spliced/{sec}.mp3", res)

for r in report:
    print(*r, sep=" | ")
