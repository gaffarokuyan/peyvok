"""Script metnini seslendirmedeki kelime zamanlariyla eslestirir."""
import json, re, subprocess, difflib, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "narration"))
from sections import SECTIONS  # noqa: E402


def norm(t):
    t = t.lower()
    for a, b in {"ê": "e", "î": "i", "û": "u", "â": "a", "q": "k", "ı": "i", "w": "v", "x": "h", "ü": "u",
                 "ö": "o", "ç": "c", "ş": "s", "ğ": "g", "i̇": "i"}.items():
        t = t.replace(a, b)
    return "".join(c for c in t if c.isalnum())


def section_times():
    L = [l.split("'")[1] for l in open(os.path.join(HERE, "..", "build", "list.txt"))]
    t = 0.0
    out = {}
    for p in L:
        d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
                                 capture_output=True, text=True).stdout)
        if os.path.basename(p) != "sil.mp3":
            out[os.path.basename(p)[:-4]] = (t, t + d)
        t += d
    return out, t


def build():
    stt = [w for w in json.load(open(os.path.join(HERE, "..", "data", "narration_words.json")))["words"] if w["type"] == "word"]
    secs, total = section_times()
    result = {}
    for name, text in SECTIONS:
        text = re.sub(r"\s*<break[^>]*/>", "", text)
        toks = text.split()
        s0, s1 = secs[name]
        sw = [w for w in stt if s0 - 0.2 <= w["start"] <= s1 + 0.2]
        a = [norm(t) for t in toks]
        b = [norm(w["text"]) for w in sw]
        times = [None] * len(toks)
        sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            if tag == "equal" or (tag == "replace" and (i2 - i1) == (j2 - j1)):
                for k in range(i2 - i1):
                    times[i1 + k] = (sw[j1 + k]["start"], sw[j1 + k]["end"])
            elif tag == "replace" and j2 > j1:
                # orantili dagit
                st, en = sw[j1]["start"], sw[j2 - 1]["end"]
                n = i2 - i1
                for k in range(n):
                    times[i1 + k] = (st + (en - st) * k / n, st + (en - st) * (k + 1) / n)
        # bosluklari interpolasyonla doldur
        known = [i for i, t in enumerate(times) if t]
        for i in range(len(times)):
            if times[i] is None:
                prev = max([k for k in known if k < i], default=None)
                nxt = min([k for k in known if k > i], default=None)
                if prev is None:
                    times[i] = (s0, s0 + 0.2)
                elif nxt is None:
                    times[i] = (times[prev][1], times[prev][1] + 0.2)
                else:
                    gap0, gap1 = times[prev][1], times[nxt][0]
                    n = nxt - prev
                    f = (i - prev) / n
                    times[i] = (gap0 + (gap1 - gap0) * f, gap0 + (gap1 - gap0) * f + 0.1)
        result[name] = {"start": s0, "end": s1, "tokens": [(t, a_, b_) for t, (a_, b_) in zip(toks, times)]}
    return result, total


if __name__ == "__main__":
    r, total = build()
    json.dump({"total": total, "sections": r}, open(os.path.join(HERE, "..", "data", "aligned.json"), "w"), ensure_ascii=False)
    for k, v in r.items():
        print(k, round(v["start"], 2), round(v["end"], 2), len(v["tokens"]), v["tokens"][0], v["tokens"][-1])
    print("total", total)
