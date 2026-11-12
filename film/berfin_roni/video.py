"""BERFÎN û RONÎ — Kurmancî konuşma videosu (A1 · A2 · B1), ~4 dk.

  python3 video.py --out berfin_roni.mp4
  python3 video.py --stills 20,90,200 --scale 0.5 --out kareler/

Çizim modülleri ../boxce/2d'den gelir. Diyalog: diyalog.json, sesler: ses/NN_kim.mp3
"""
import argparse, json, math, os, subprocess, sys, tempfile, wave
from multiprocessing import Pool
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "boxce", "2d"))
from karakter import gule, ciwan, place, DEFS, INK, GOLD                      # noqa: E402
from sahneler import (W, H, EXTRA_DEFS, koy_dis, ev_ici, camera, ease, lerp,  # noqa: E402
                      rect, text, ellipse, circle, line, path)
import film as F                                                               # noqa: E402  (müzik)

FPS = 24
TOTAL = 240.0
DRESS = "#4a3a7a"           # Berfîn'in mor kirası
NAMES = {"berfin": "BERFÎN", "roni": "RONÎ"}
NCOL = {"berfin": "#c9b6f0", "roni": "#f2c46b"}

SECTIONS = {
    "A1": ("Silav û nasîn", "Selamlaşma ve tanışma",
           ["Silav! · Tu çawa yî?", "Navê te çi ye?", "Tu ji ku derê yî?", "Tu çend salî yî? · Malbat"]),
    "A2": ("Li çayxaneyê", "Çay ocağında",
           ["Tu çay vedixwî an qehwe?", "Her roj… (geniş zaman)", "Ez ji … hez dikim", "Duh… (geçmiş zaman)"]),
    "B1": ("Plan û raman", "Planlar ve düşünceler",
           ["Sibê ez ê… (gelecek zaman)", "Ger tu bixwazî… (şart)", "Li gorî min… (fikir)", "… ji min bêtir (karşılaştırma)"]),
}

DLG = json.load(open(os.path.join(HERE, "diyalog.json")))


def dur(fn):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", fn],
                                capture_output=True, text=True).stdout)


def build_timeline():
    """Her replik için (başlangıç, süre, …) ve bölüm kartları; toplam TOTAL sn olacak şekilde aralar ayarlanır."""
    INTRO, CARD, OUTRO = 7.0, 5.0, 8.0
    files = [os.path.join(HERE, "ses", f"{i + 1:02d}_{d[1]}.mp3") for i, d in enumerate(DLG)]
    ds = [dur(f) for f in files]
    gap = (TOTAL - INTRO - 3 * CARD - OUTRO - sum(ds) - 3 * 0.8) / len(DLG)
    t, lines, cards, cur = INTRO, [], [], None
    for i, (lvl, who, tag, ku, tr) in enumerate(DLG):
        if lvl != cur:
            cards.append((t, CARD, lvl))
            t += CARD + 0.8
            cur = lvl
        lines.append(dict(i=i, st=t, d=ds[i], who=who, ku=ku, tr=tr, lvl=lvl, fn=files[i]))
        t += ds[i] + gap
    return lines, cards, INTRO, t, OUTRO


LINES, CARDS, INTRO, END_DLG, OUTRO = build_timeline()
ENV = {}


def load_envs():
    for L in LINES:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", L["fn"], "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
                             capture_output=True, check=True).stdout
        a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
        hop = 16000 // FPS
        e = np.array([np.sqrt(np.mean(a[k * hop:(k + 1) * hop] ** 2)) for k in range(len(a) // hop)])
        ENV[L["i"]] = np.clip(e / (np.percentile(e, 95) + 1e-6), 0, 1.2)


def active(T):
    for L in LINES:
        if L["st"] <= T < L["st"] + L["d"]:
            return L
    return None


def last_line(T):
    prev = None
    for L in LINES:
        if L["st"] <= T:
            prev = L
    return prev


def mouth(who, T, rest="smile"):
    L = active(T)
    if L and L["who"] == who:
        e = ENV[L["i"]][min(len(ENV[L["i"]]) - 1, int((T - L["st"]) * FPS))]
        return "open" if e > 0.5 else "o" if e > 0.2 else "flat"
    return rest


def blink(T, ph):
    return ((T + ph) % 3.9) < 0.13


def bob(T, ph, a=3.0):
    return math.sin(T * 2.0 + ph) * a


def pose(who, T, default):
    """Konuşurken el hareketi; ilk/son replikte el sallama; Ronî 39'da elini göğsüne koyar."""
    L = active(T)
    if L is None:
        return default
    if L["who"] == who and L["i"] in (0, 1, 42, 43):
        return "wave"
    if L["who"] == who and who == "roni" and L["i"] == 38:
        return "heart"
    if L["who"] == who and (T - L["st"]) < L["d"] * 0.85:
        return "gesture"
    return default


def chars(T, xb, xr, y, s, default="down"):
    L = last_line(T)
    speaker = L["who"] if L else None
    bl = mouth("berfin", T, "smile")
    rl = mouth("roni", T, "smile")
    b = gule(mouth=bl, blink=blink(T, 0.0), look=0.9, arm=pose("berfin", T, default), dress=DRESS)
    r = ciwan(mouth=rl, blink=blink(T, 1.7), look=0.9, arm=pose("roni", T, default))
    out = place(b, xb, y + bob(T, 0), s) + place(r, xr, y + bob(T, 2), s, flip=True)
    return out, speaker


def cam_on(speaker, T, xb, xr, base_z=1.22):
    tx = {"berfin": xb + 120, "roni": xr - 120}.get(speaker, (xb + xr) / 2)
    return base_z, lerp(960, tx, 0.35)


# ------------------------------------------------------------ sahneler
def scene_park(T):
    bg = koy_dis("safak", T, mist=0.2)
    c, sp = chars(T, 700, 1220, 1020, 1.0)
    z, cx = cam_on(sp, T, 700, 1220)
    return camera(bg + c, z, cx, 650)


def scene_cafe(T):
    bg = ev_ici(False, T)
    c, sp = chars(T, 700, 1220, 1060, 1.0, default="front")
    tbl = (rect(430, 820, 1060, 50, "#8a5a34", 12) + rect(470, 870, 40, 220, "#6b4428", 4)
           + rect(1410, 870, 40, 220, "#6b4428", 4))
    for gx in (820, 1100):     # istikan + tabak
        tbl += ellipse(gx, 822, 48, 10, "#d9d9dc", sw=4)
        tbl += path(f"M{gx - 20} 818 Q{gx - 26} 780 {gx - 16} 758 L{gx + 16} 758 Q{gx + 26} 780 {gx + 20} 818 Z",
                    "#b4542a", sw=4, op=0.95)
        tbl += path(f"M{gx - 16} 758 L{gx + 16} 758", "none", stroke="#f1e4c6", sw=4)
        for k in range(3):     # buhar
            ph = T * 1.5 + k + gx
            tbl += path(f"M{gx - 8 + k * 8} 740 q{6 * math.sin(ph)} -14 0 -28 q{-6 * math.sin(ph)} -14 0 -28",
                        "none", stroke="#ffffff", sw=3, op=0.5)
    tbl += ellipse(960, 820, 60, 12, "#c87f3c", sw=4)   # şekerlik
    z, cx = cam_on(sp, T, 700, 1220)
    return camera(bg + c + tbl, z, cx, 650)


def scene_sunset(T):
    bg = koy_dis("gunbatimi", T)
    c, sp = chars(T, 700, 1220, 1020, 1.0)
    z, cx = cam_on(sp, T, 700, 1220)
    return camera(bg + c, z, cx, 650)


SCENE = {"A1": scene_park, "A2": scene_cafe, "B1": scene_sunset}


def card(lvl, t):
    title, tr, items = SECTIONS[lvl]
    a = ease(t / 0.6) * (1 - ease((t - 4.4) / 0.6))
    g = [f'<rect width="{W}" height="{H}" fill="#1b1512" opacity="{0.78 * a:.2f}"/>', f'<g opacity="{a:.2f}">']
    g.append(circle(960, 300, 110, GOLD, sw=8))
    g.append(text(960, 340, lvl, 110, INK, "Cinzel", 900))
    g.append(text(960, 500, title, 84, "#fffaf0", "Cinzel", 900))
    g.append(text(960, 560, tr, 40, "#f1d9a0", "Nunito", 800))
    for k, it in enumerate(items):
        g.append(text(960, 660 + k * 62, "• " + it, 40, "#fffaf0", "Nunito", 800))
    g.append("</g>")
    return "\n".join(g)


def intro(t):
    a = ease((t - 0.8) / 1.2) * (1 - ease((t - 6.0) / 0.8))
    return (camera(koy_dis("safak", t, mist=1.0), lerp(1.0, 1.05, t / 7), 960, 560)
            + f'<g opacity="{a:.2f}">'
            + text(960, 430, "BERFÎN û RONÎ", 130, "#fffaf0", "Cinzel", 900, stroke="#2b211c", stroke_width=12, paint_order="stroke")
            + text(960, 510, "Kurmancî bi axaftinê · A1 · A2 · B1", 46, "#fffaf0", "Nunito", 900, stroke="#2b211c",
                   stroke_width=8, paint_order="stroke")
            + text(960, 566, "Konuşarak Kurmancî", 36, "#f1d9a0", "Nunito", 800, stroke="#2b211c", stroke_width=7,
                   paint_order="stroke")
            + "</g>")


def outro(t):
    a = ease(t / 1.2)
    return (f'<rect width="{W}" height="{H}" fill="#1b1512"/><g opacity="{a:.2f}">'
            + text(960, 420, "BERFÎN û RONÎ", 110, "#f1e4c6", "Cinzel", 900)
            + text(960, 500, "Heta sibê!  ·  Yarına kadar!", 46, GOLD, "Nunito", 900)
            + text(960, 640, "Deng: ElevenLabs  ·  Kontrola zimên: Mazdek", 30, "#bfae94", "Nunito", 800)
            + text(960, 690, "Okuyan Studio  ·  Peyvok", 34, "#f1e4c6", "Nunito", 900)
            + "</g>")


def subtitle(T):
    for L in LINES:
        if L["st"] - 0.1 <= T < L["st"] + L["d"] + 0.9:
            who = L["who"]
            return (text(960, 930, NAMES[who], 34, NCOL[who], "Nunito", 900, stroke="#1b1512", stroke_width=8,
                         paint_order="stroke")
                    + text(960, 990, L["ku"], 52, "#fffaf0", "Nunito", 900, stroke="#1b1512", stroke_width=10,
                           paint_order="stroke", stroke_linejoin="round")
                    + text(960, 1044, L["tr"], 34, "#f1d9a0", "Nunito", 800, stroke="#1b1512", stroke_width=8,
                           paint_order="stroke", stroke_linejoin="round"))
    return ""


def badge(lvl):
    title = SECTIONS[lvl][0]
    return (rect(36, 30, 92, 64, GOLD, 14, sw=5) + text(82, 76, lvl, 38, INK, "Cinzel", 900)
            + text(146, 74, title, 34, "#fffaf0", "Nunito", 900, anchor="start", stroke="#1b1512", stroke_width=7,
                   paint_order="stroke"))


def level_at(T):
    lvl = None
    for st, d, l in CARDS:
        if T >= st:
            lvl = l
    return lvl


def frame_svg(T):
    if T < INTRO:
        body = intro(T)
    elif T >= END_DLG + 1.0:
        body = outro(T - END_DLG - 1.0)
    else:
        lvl = level_at(T) or "A1"
        body = SCENE[lvl](T) + badge(lvl)
        for st, d, l in CARDS:
            if st <= T < st + d:
                body += card(l, T - st)
        body += subtitle(T)
    # sahne geçişlerinde karartma (bölüm başları + son)
    marks = [INTRO] + [st + 2.5 for st, d, l in CARDS[1:]] + [END_DLG + 1.0]
    dd = min(abs(T - m) for m in marks)
    fade = max(0.0, 1 - dd / 0.5) if T > 1 else 1 - ease(T)
    defs = DEFS.replace("</defs>", EXTRA_DEFS + "</defs>")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{defs}'
            f'<rect width="{W}" height="{H}" fill="#f3e6c9"/>{body}<rect width="{W}" height="{H}" fill="url(#vinyet)"/>'
            f'<rect width="{W}" height="{H}" fill="#000" opacity="{fade:.3f}"/></svg>')


SCALE = 1.0


def _init(sc):
    global SCALE
    SCALE = sc
    load_envs()


def render(i):
    return subprocess.run(["rsvg-convert", "-z", str(SCALE)], input=frame_svg(i / FPS).encode(), capture_output=True,
                          check=True).stdout


def build_audio(out):
    tmp = tempfile.mkdtemp()
    mus = os.path.join(tmp, "m.wav")
    F.music(mus, dur=TOTAL)
    args = ["ffmpeg", "-y", "-v", "error", "-i", mus]
    flt = ["[0:a]volume=0.4[m]"]
    for k, L in enumerate(LINES):
        args += ["-i", L["fn"]]
        ms = int(L["st"] * 1000)
        flt.append(f"[{k + 1}:a]aresample=44100,loudnorm=I=-17:TP=-2:LRA=7,aresample=44100,adelay={ms}|{ms}[d{k}]")
    flt.append("[m]" + "".join(f"[d{k}]" for k in range(len(LINES)))
               + f"amix=inputs={len(LINES) + 1}:normalize=0:duration=first[a]")
    args += ["-filter_complex", ";".join(flt), "-map", "[a]", "-ac", "2", "-ar", "44100", out]
    subprocess.run(args, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--stills")
    a = ap.parse_args()
    if a.stills:
        os.makedirs(a.out, exist_ok=True)
        _init(a.scale)
        for s in a.stills.split(","):
            open(os.path.join(a.out, f"kare_{float(s):06.1f}.png"), "wb").write(render(int(float(s) * FPS)))
        print("OK stills; diyalog sonu", round(END_DLG, 1))
        return
    tmp = tempfile.mkdtemp()
    video = os.path.join(tmp, "v.mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png", "-i", "-",
                           "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", video],
                          stdin=subprocess.PIPE)
    with Pool(os.cpu_count(), initializer=_init, initargs=(a.scale,)) as pool:
        for k, png in enumerate(pool.imap(render, range(int(TOTAL * FPS)), chunksize=6)):
            ff.stdin.write(png)
            if k % (FPS * 20) == 0:
                print(f"  {k / FPS:.0f} sn", flush=True)
    ff.stdin.close()
    ff.wait()
    aud = os.path.join(tmp, "a.wav")
    build_audio(aud)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", video, "-i", aud, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", a.out], check=True)
    print("OK", a.out)


if __name__ == "__main__":
    main()
