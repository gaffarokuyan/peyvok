"""BOXÇE — 2D film üretici.

  python3 film.py --out boxce.mp4            # tam film (1920x1080, 24 fps)
  python3 film.py --stills 12,30,50 --out d/ # seçili saniyelerden PNG kareler
  python3 film.py --scale 0.5 --out t.mp4    # hızlı düşük çözünürlük deneme

Gereken: rsvg-convert, ffmpeg, numpy. Sesler: ../ses/*.mp3
"""
import argparse, math, os, subprocess, sys, tempfile, wave
from multiprocessing import Pool
import numpy as np

import karakter as K
from karakter import gule, hevi, rezan, place, DEFS
from sahneler import (W, H, EXTRA_DEFS, koy_dis, ev_ici, insaat, tandir, lamba, dolmus, bohca_kapali,
                      telefon_yakin, defter_yakin, not_yakin, jenerik, camera, ease, lerp, rect, text,
                      ellipse, circle, line, path, simit)

HERE = os.path.dirname(os.path.abspath(__file__))
SES = os.path.join(HERE, "..", "ses")
FPS = 24
DUR = 180.0

# ------------------------------------------------------------ diyaloglar
LINES = [  # (başlangıç sn, karakter, dosya, Kurmancî, Türkçe)
    (12.0, "hevi", "01_hevi_binere.mp3", "Dapîrê, binêre! Dayikên Japonî name dinivîsin.", "Babaanne, bak! Japon anneler not yazıyor."),
    (25.0, "gule", "02_gule_nikarim.mp3", "Ez nikarim binivîsim…", "Ben yazamam…"),
    (37.0, "hevi", "03_hevi_alfabe.mp3", "A… av. Bê… bav. Dê… dayik.", "A – su. B – baba. D – anne."),
    (70.0, "gule", "04_gule_bixer.mp3", "Bi xêr here… bi xêr were.", "Sağ salim git, sağ salim gel."),
    (101.0, "gule_ds", "adaylar/05_birci_nemine.mp3", "Kurê min… birçî nemîne. Kurê min.", "Oğlum… aç kalma. Oğlum."),
    (117.5, "rezan", "06_rezan_ke.mp3", "Dayê… kê ev nivîsî?", "Anne… bunu kim yazdı?"),
    (124.0, "gule", "07_gule_min.mp3", "Min bi xwe nivîsî.", "Kendim yazdım."),
    (141.5, "gule_ds", "08_gule_okuma.mp3", "Da… yê. Ez… têr… bûm. Ez… têm… malê.", "Anne. Doydum. Eve geliyorum."),
]


def load_env(fn):
    """Ses dosyasının kare başına (24 fps) normalize genliği."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(SES, fn), "-ac", "1", "-ar", "16000",
                          "-f", "s16le", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    hop = 16000 // FPS
    n = len(a) // hop
    e = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    e = e / (np.percentile(e, 95) + 1e-6)
    return np.clip(e, 0, 1.2), len(a) / 16000


ENVS = {}


def init_env():
    for st, who, fn, *_ in LINES:
        ENVS[fn] = load_env(fn)


def mouth(who, T, rest="smile"):
    for st, w, fn, *_ in LINES:
        if w != who:
            continue
        env, d = ENVS[fn]
        if st <= T < st + d:
            e = env[min(len(env) - 1, int((T - st) * FPS))]
            return "open" if e > 0.5 else "o" if e > 0.2 else "flat"
    return rest


def blink(T, ph):
    return ((T + ph) % 3.7) < 0.13


def bob(T, ph, amp=3.0):
    return math.sin(T * 2.1 + ph) * amp


def subtitle(T):
    for st, w, fn, ku, tr in LINES:
        d = ENVS[fn][1]
        if st - 0.1 <= T < st + d + 0.6:
            return (text(960, 985, ku, 50, "#fffaf0", "Nunito", 900, stroke="#1b1512", stroke_width=10,
                         paint_order="stroke", stroke_linejoin="round")
                    + text(960, 1038, tr, 34, "#f1d9a0", "Nunito", 800, stroke="#1b1512", stroke_width=8,
                           paint_order="stroke", stroke_linejoin="round"))
    return ""


# ------------------------------------------------------------ sahneler
def ch_gule(T, x, y, s=1.0, flip=False, rest="smile", **kw):
    return place(gule(mouth=mouth("gule", T, rest), blink=blink(T, 0.0), **kw), x, y + bob(T, 0), s, flip)


def ch_hevi(T, x, y, s=1.0, flip=False, rest="smile", **kw):
    return place(hevi(mouth=mouth("hevi", T, rest), blink=blink(T, 1.3), **kw), x, y + bob(T, 1, 2.5), s, flip)


def ch_rezan(T, x, y, s=1.0, flip=False, rest="flat", **kw):
    return place(rezan(mouth=mouth("rezan", T, rest), blink=blink(T, 2.2), **kw), x, y + bob(T, 2), s, flip)


def s0_acilis(t, T):
    b = koy_dis("safak", t, mist=1.0)
    a = ease((t - 3) / 1.5) * (1 - ease((t - 8.3) / 1.2))
    title = (f'<g opacity="{a}">' + text(960, 470, "BOXÇE", 170, "#fffaf0", "Cinzel", 900, stroke="#2b211c",
                                         stroke_width=12, paint_order="stroke")
             + text(960, 540, "Bohça", 48, "#fffaf0", "Nunito", 800, stroke="#2b211c", stroke_width=8,
                    paint_order="stroke") + "</g>")
    return camera(b, lerp(1.0, 1.06, t / 10), 960, 560) + title


def ev_gunduz(t, T, z=1.0, cx=960, cy=540):
    b = [ev_ici(False, t), tandir(1640, 980, 0.5 + 0.2 * math.sin(T * 3))]
    gl = mouth("gule", T, "sad" if T > 27.0 else "smile")
    b.append(place(gule(mouth=gl, blink=blink(T, 0), arm="front", look=0.8), 640, 1000 + bob(T, 0), 1.15))
    # hamur tahtası (bacakları örter)
    b.append(ellipse(640, 900, 230, 50, "#c9a06a"))
    b.append(rect(560, 900, 160, 110, "#a87a4a", 6))
    b.append(ellipse(640, 880, 90, 30, "#f5ecd8"))
    look = -0.6 if T < 19 else 0
    b.append(place(hevi(mouth=mouth("hevi", T), blink=blink(T, 1.3), arm="point", phone=True, look=look),
                   1180, 1000 + bob(T, 1, 2.5), 1.2, True))
    return camera("\n".join(b), z, cx, cy)


def s1a(t, T):
    return ev_gunduz(t, T, lerp(1.0, 1.04, t / 9))


def s1b(t, T):
    return camera(telefon_yakin(t), lerp(1.0, 1.08, t / 5))


def s1c(t, T):
    return ev_gunduz(t + 9, T, lerp(1.04, 1.3, ease(t / 11)), lerp(960, 760, ease(t / 11)), lerp(540, 560, ease(t / 11)))


def ev_gece(t, T, laugh=False, z=1.0):
    fl = 1 + 0.04 * math.sin(T * 13) + 0.03 * math.sin(T * 7.3)
    b = [ev_ici(True, t)]
    rest = "open" if laugh and int(T * 4) % 2 else "smile"
    b.append(place(gule(mouth=mouth("gule", T, rest), blink=blink(T, 0), arm="front", writing=True, look=0.4),
                   720, 1000 + bob(T, 0), 1.1))
    b.append(place(hevi(mouth=mouth("hevi", T, rest), blink=blink(T, 1.3), arm="point", look=0.5),
                   1220, 1000 + bob(T, 1, 2.5), 1.15, True))
    # alçak masa + defter + lamba
    b.append(rect(480, 860, 960, 46, "#8a5a34", 10))
    b.append(rect(520, 900, 40, 120, "#6b4428", 4))
    b.append(rect(1360, 900, 40, 120, "#6b4428", 4))
    b.append(path("M760 860 L790 830 L960 830 L990 860 Z", "#f6f2e7", sw=4))
    b.append(lamba(1080, 862, 1.0, fl))
    return camera("\n".join(b), z, 960, 600)


def s2a(t, T):
    return ev_gece(t, T, z=lerp(1.0, 1.06, t / 10))


def s2b(t, T):
    return camera(defter_yakin(t), lerp(1.0, 1.05, t / 12))


def s2c(t, T):
    return ev_gece(t + 10, T, laugh=(1.0 < t < 3.0), z=lerp(1.08, 1.0, t / 8))


def s3_yol(t, T):
    b = [koy_dis("safak", t, mist=0.3)]
    go = max(0.0, t - 10.5)
    bx = 1500 + go * go * 28
    b.append(dolmus(bx, 960, 1.0, wheel=go * go * 2))
    if go > 0:
        for k in range(4):
            a = max(0.0, 0.6 - go * 0.12 + k * 0.05)
            b.append(f'<ellipse cx="{bx - 230 - k * 50}" cy="{940 - k * 6}" rx="{40 + go * 12}" ry="{18 + go * 4}" '
                     f'fill="#e8d3a8" opacity="{a:.2f}"/>')
    hand_out = t < 8.0
    b.append(place(gule(mouth=mouth("gule", T, "smile"), blink=blink(T, 0), arm="front" if t < 9.5 else "down",
                        look=0.8), 980, 980 + bob(T, 0), 1.1))
    # bohça: ellerde → dolmuş penceresine
    m = ease((t - 8.0) / 1.5)
    if t < 10.5:
        b.append(bohca_kapali(lerp(980, 1360, m), lerp(800, 860, m), lerp(0.85, 0.7, m)))
    return camera("\n".join(b), lerp(1.0, 1.05, t / 20), 1000, 640)


def s4_insaat(t, T, holding=False, z=1.0, cx=960, cy=560):
    b = [insaat(T)]
    arm = "front" if holding else "down"
    b.append(place(rezan(mouth=mouth("rezan", T, "sad" if holding else "flat"), blink=blink(T, 2.2), arm=arm,
                         look=(0.9 if not holding else 0)), 900, 1010 + bob(T, 2), 1.15))
    if holding:
        b.append(f'<g transform="rotate(-6 900 760)">' + rect(840, 720, 120, 86, "#efebe2", 3, sw=4)
                 + "".join(line(856, 744 + k * 18, 940 - k * 10, 744 + k * 18, stroke="#5a5a60", sw=3)
                           for k in range(3)) + "</g>")
    b.append(rect(620, 820, 640, 280, "#8d8c88", 10))     # beton blok (bacakları örter)
    b.append(line(640, 870, 1240, 870, stroke="#7a7975", sw=4))
    b.append(simit(720, 800, 1.0))
    if not holding:
        b.append(bohca_kapali(1150, 826, 0.9))
    return camera("\n".join(b), z, cx, cy)


NOT_GULE = ["KURÊ MIN.", "BIRÇÎ", "NEMÎNE.", "  DAYIKA TE"]
NOT_REZAN = ["DAYÊ,", "EZ TÊR BÛM.", "EZ TÊM MALÊ."]


def s4a(t, T):
    return s4_insaat(t, T, z=lerp(1.0, 1.08, t / 10), cx=lerp(960, 1040, t / 10))


def s4b(t, T):
    return not_yakin(NOT_GULE, 62, open_t=(t - 0.6) / 2.6)


def s4c(t, T):
    return camera(not_yakin(NOT_GULE, 62), lerp(1.0, 1.35, ease(t / 9)), 960, 650)


def s4d(t, T):
    return s4_insaat(t, T, holding=True, z=lerp(1.15, 1.3, t / 5), cx=900, cy=560)


def s5_telefon(t, T):
    left = (f'<clipPath id="solK"><rect x="0" y="0" width="956" height="{H}"/></clipPath>'
            f'<clipPath id="sagK"><rect x="964" y="0" width="956" height="{H}"/></clipPath>')
    lb = (f'<g clip-path="url(#solK)"><g transform="translate(-260,0)">{insaat(T)}</g>'
          + place(rezan(mouth=mouth("rezan", T, "smile" if t > 13 else "flat"), blink=blink(T, 2.2), arm="phone",
                        look=0.3), 480, 1060 + bob(T, 2), 1.25) + "</g>")
    gl_rest = "smile"
    rb = (f'<g clip-path="url(#sagK)"><g transform="translate(560,0)">{ev_ici(False, t)}</g>'
          + place(gule(mouth=mouth("gule", T, gl_rest), blink=blink(T, 0) or (9 < t < 10.5), arm="phone",
                       look=-0.3), 1440, 1060 + bob(T, 0), 1.25, True)
          + (f'<g opacity="{ease((t - 9) / 1)}">' + ellipse(1404, 640, 26, 12, "#f08a7a", sw=0)
             + ellipse(1476, 640, 26, 12, "#f08a7a", sw=0) + "</g>")
          + "</g>")
    return left + camera(lb + rb + rect(956, -10, 8, H + 20, "#1b1512", sw=0), lerp(1.0, 1.03, t / 20))


def koy_aksam(t, T, walker=None, z=1.0, cx=960, cy=560, paper=True):
    b = [koy_dis("gunbatimi", T)]
    b.append(rect(560, 860, 220, 26, "#7a5a3a", 4))                  # bank
    b.append(rect(574, 886, 18, 70, "#6b4428", 3) + rect(748, 886, 18, 70, "#6b4428", 3))
    b.append(path("M590 860 Q610 830 670 834 Q730 830 750 860 Z", "#B3262E", sw=5))   # katlanmış boş bohça
    if walker is not None:
        wx, wy, ws, wt = walker
        b.append(place(rezan(mouth="smile", blink=False, outfit="sal"), wx, wy + abs(math.sin(wt * 5)) * -6 * ws, ws))
    look = 1.0 if walker is not None else 0.2
    b.append(place(gule(mouth=mouth("gule", T, "smile"), blink=blink(T, 0), arm="front" if paper else "down",
                        look=look), 400, 1010 + bob(T, 0), 1.15, walker is None))
    if paper:
        b.append(f'<g transform="rotate(4 400 780)">' + rect(350, 748, 110, 80, "#f6f2e7", 3, sw=4)
                 + "".join(line(364, 768 + k * 16, 440 - k * 8, 768 + k * 16, stroke="#2c4a7a", sw=3)
                           for k in range(3)) + "</g>")
    return camera("\n".join(b), z, cx, cy)


def s6a(t, T):
    return koy_aksam(t, T, z=lerp(1.0, 1.15, ease(t / 6.5)), cx=lerp(960, 640, ease(t / 6.5)), cy=600)


def s6b(t, T):
    return camera(not_yakin(NOT_REZAN, 34, color="#2c4a7a", cloth=False), lerp(1.0, 1.08, t / 10.5))


def s6c(t, T):
    k = ease(t / 15)
    walker = (lerp(1230, 1060, k), lerp(728, 900, k), lerp(0.08, 0.42, k), t)
    return koy_aksam(t, T, walker=walker, paper=t < 4, z=lerp(1.0, 1.04, t / 18), cx=900, cy=600)


def s7(t, T):
    return jenerik(t)


SHOTS = [  # (başlangıç, bitiş, fonksiyon, sahne başında karartma)
    (0, 10, s0_acilis, True),
    (10, 19, s1a, False), (19, 24, s1b, False), (24, 35, s1c, False),
    (35, 45, s2a, True), (45, 57, s2b, False), (57, 65, s2c, False),
    (65, 85, s3_yol, True),
    (85, 95, s4a, True), (95, 101, s4b, False), (101, 110, s4c, False), (110, 115, s4d, False),
    (115, 135, s5_telefon, True),
    (135, 141.5, s6a, True), (141.5, 152, s6b, False), (152, 170, s6c, False),
    (170, 180, s7, True),
]
SCENE_STARTS = [a for a, b, f, fade in SHOTS if fade] + [DUR]


def frame_svg(T):
    for a, b, fn, _ in SHOTS:
        if a <= T < b:
            body = fn(T - a, T)
            break
    # sahne geçişlerinde karartma
    d = min(abs(T - s) for s in SCENE_STARTS)
    fade = max(0.0, 1 - d / 0.6)
    over = f'<rect width="{W}" height="{H}" fill="#000" opacity="{fade:.3f}"/>' if fade > 0 else ""
    vign = f'<rect width="{W}" height="{H}" fill="url(#vinyet)"/>'
    defs = DEFS.replace("</defs>", EXTRA_DEFS + "</defs>")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'{defs}<rect width="{W}" height="{H}" fill="#f3e6c9"/>{body}{vign}{subtitle(T)}{over}</svg>')


SCALE = 1.0


def render(i):
    svg = frame_svg(i / FPS).encode()
    return subprocess.run(["rsvg-convert", "-z", str(SCALE)], input=svg, capture_output=True, check=True).stdout


def _init(scale):
    global SCALE
    SCALE = scale
    init_env()


# ------------------------------------------------------------ müzik
def music(path, dur=DUR, sr=44100):
    """Sade, yumuşak bir müzik: D hicaz tınılı mızrap + alçak dem (drone)."""
    rng = np.random.default_rng(5)
    n = int(dur * sr)
    out = np.zeros(n, np.float32)
    t = np.arange(n) / sr
    # dem: D2 + A2, yavaş nefes
    dem = (np.sin(2 * np.pi * 73.42 * t) + 0.5 * np.sin(2 * np.pi * 110.0 * t)) * (0.5 + 0.5 * np.sin(2 * np.pi * t / 9))
    out += 0.035 * dem.astype(np.float32)
    scale = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33]

    def pluck(f, length=1.6):
        L = int(sr / f)
        buf = rng.uniform(-1, 1, L).astype(np.float32)
        m = int(length * sr)
        y = np.empty(m, np.float32)
        for i in range(m):
            y[i] = buf[i % L]
            buf[i % L] = 0.996 * 0.5 * (buf[i % L] + buf[(i + 1) % L])
        return y

    cache = {}
    beat = 60 / 66
    pos, idx = 4.0, 3
    while pos < dur - 6:
        # İstanbul sahnesinde (85-115) seyrek; son sahnede biraz daha yoğun
        dens = 0.35 if 85 <= pos < 115 else 0.75 if pos > 150 else 0.55
        if rng.random() < dens:
            idx = int(np.clip(idx + rng.choice([-2, -1, -1, 0, 1, 1, 2]), 0, len(scale) - 1))
            f = scale[idx]
            if f not in cache:
                cache[f] = pluck(f)
            y = cache[f]
            s = int(pos * sr)
            e = min(n, s + len(y))
            out[s:e] += 0.12 * y[:e - s]
        pos += beat * rng.choice([1, 1, 2, 0.5])
    # basit yankı
    d = int(0.33 * sr)
    for k in range(1, 4):
        out[d * k:] += out[:-d * k] * (0.3 ** k)
    # giriş/çıkış
    fade = np.ones(n, np.float32)
    fade[:sr * 3] = np.linspace(0, 1, sr * 3)
    fade[-sr * 4:] = np.linspace(1, 0, sr * 4)
    out *= fade
    out /= max(1e-6, np.abs(out).max()) / 0.6
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((out * 32767).astype(np.int16).tobytes())


def build_audio(path):
    tmp = tempfile.mkdtemp()
    mus = os.path.join(tmp, "muzik.wav")
    music(mus)
    args = ["ffmpeg", "-y", "-v", "error", "-i", mus]
    flt = ["[0:a]volume=0.55[m]"]
    for k, (st, w, fn, *_) in enumerate(LINES):
        args += ["-i", os.path.join(SES, fn)]
        ms = int(st * 1000)
        flt.append(f"[{k + 1}:a]aresample=44100,adelay={ms}|{ms},volume=1.6[d{k}]")
    mix = "[m]" + "".join(f"[d{k}]" for k in range(len(LINES)))
    flt.append(f"{mix}amix=inputs={len(LINES) + 1}:normalize=0:duration=first[a]")
    args += ["-filter_complex", ";".join(flt), "-map", "[a]", "-ac", "2", "-ar", "44100", path]
    subprocess.run(args, check=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--scale", type=float, default=1.0)
    ap.add_argument("--stills")
    ap.add_argument("--start", type=float, default=0)
    ap.add_argument("--end", type=float, default=DUR)
    a = ap.parse_args()
    if a.stills:
        os.makedirs(a.out, exist_ok=True)
        _init(a.scale)
        for s in a.stills.split(","):
            open(os.path.join(a.out, f"kare_{float(s):06.1f}.png"), "wb").write(render(int(float(s) * FPS)))
        print("OK stills")
        return
    frames = range(int(a.start * FPS), int(a.end * FPS))
    tmp = tempfile.mkdtemp()
    video = os.path.join(tmp, "v.mp4")
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "png",
                           "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
                           video], stdin=subprocess.PIPE)
    with Pool(os.cpu_count(), initializer=_init, initargs=(a.scale,)) as pool:
        for k, png in enumerate(pool.imap(render, frames, chunksize=6)):
            ff.stdin.write(png)
            if k % (FPS * 10) == 0:
                print(f"  {k / FPS:.0f} sn", flush=True)
    ff.stdin.close()
    ff.wait()
    audio = os.path.join(tmp, "a.wav")
    init_env()
    build_audio(audio)
    ss = a.start
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", video, "-ss", str(ss), "-t", str(a.end - a.start), "-i", audio,
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", a.out],
                   check=True)
    print("OK", a.out)


if __name__ == "__main__":
    main()
