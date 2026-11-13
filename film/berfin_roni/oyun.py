"""BERFÎN û RONÎ — oyunlaştırılmış kısa film (hikaye.md'den).

  python3 oyun.py --out render/berfin_roni_film.mp4
  python3 oyun.py --stills 10,40 --scale 0.5 --out kareler/

Sahneler: park → çayxane (yağmur) → gece mesajlaşma → kütüphane kapısı → kütüphane içi → nehir kenarı.
"""
import argparse, json, math, os, random, subprocess, sys, tempfile
from multiprocessing import Pool
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "boxce", "2d"))
from karakter import gule, ciwan, place, DEFS, INK, GOLD, SKIN                 # noqa: E402
from sahneler import (W, H, EXTRA_DEFS, koy_dis, ev_ici, camera, ease, lerp,  # noqa: E402
                      rect, text, ellipse, circle, line, path, poly)
import film as F                                                               # noqa: E402

FPS = 24
DRESS = "#4a3a7a"
SC = json.load(open(os.path.join(HERE, "senaryo_film.json")))
FILES = [os.path.join(HERE, "film_ses", f"{i + 1:02d}_{d[1]}.mp3") for i, d in enumerate(SC)]
MORE_DEFS = """
<linearGradient id="gok_roj" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#8fc0e0"/><stop offset="1" stop-color="#e3f0f2"/></linearGradient>
<linearGradient id="gok_baran" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#6f7e8c"/><stop offset="1" stop-color="#a9b4bc"/></linearGradient>
<linearGradient id="cem_av" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#e8a06a"/><stop offset="1" stop-color="#5f6f9a"/></linearGradient>
"""


def dur(fn):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", fn],
                                capture_output=True, text=True).stdout)


DUR = [dur(f) for f in FILES]

# ------------------------------------------------------------ zaman çizelgesi
# (sahne, ön bekleme, replikler, ara, son bekleme, özel bekleme {replik: sn önce})
PLAN = [
    ("acilis", 6.0, [], 0, 0, {}),
    ("park", 4.5, range(0, 11), 0.75, 4.5, {}),
    ("cafe", 4.0, range(11, 20), 0.75, 3.0, {14: 4.0}),
    ("mesaj", 2.5, range(20, 24), 1.4, 2.0, {}),
    ("deri", 5.0, range(24, 27), 0.6, 1.0, {}),
    ("hundir", 10.0, [], 0, 0, {}),
    ("cem", 5.0, range(27, 32), 0.9, 7.0, {}),
    ("son", 7.0, [], 0, 0, {}),
]
SCENES, LINES = [], []
t = 0.0
for name, pre, idx, gap, post, special in PLAN:
    st = t
    t += pre
    for i in idx:
        t += special.get(i, 0)
        LINES.append(dict(i=i, st=t, d=DUR[i], who=SC[i][1], ku=SC[i][3], tr=SC[i][4], scene=name))
        t += DUR[i] + gap
    t += post
    SCENES.append((name, st, t))
TOTAL = t
LBY = {L["i"]: L for L in LINES}
ENV = {}


def load_envs():
    for L in LINES:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", FILES[L["i"]], "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
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


def current(T):
    """Son başlamış replik (aradaki boşlukta da)."""
    p = None
    for L in LINES:
        if L["st"] <= T:
            p = L
    return p


def at(i):
    return LBY[i]["st"]


def end(i):
    return LBY[i]["st"] + LBY[i]["d"]


def mouth(who, T, rest="smile"):
    L = active(T)
    if L and L["who"] == who:
        e = ENV[L["i"]][min(len(ENV[L["i"]]) - 1, int((T - L["st"]) * FPS))]
        return "open" if e > 0.5 else "o" if e > 0.2 else "flat"
    return rest


def blink(T, ph):
    return ((T + ph) % 3.9) < 0.13


def talking_arm(who, T, default):
    L = active(T)
    if L and L["who"] == who and (T - L["st"]) < L["d"] * 0.85 and L["i"] % 2 == 0:
        return "gesture"
    return default


def berfin(T, x, y, s=1.0, look=0.9, arm=None, flip=False, walk=0.0, rest="smile", seat=0.0):
    a = arm or talking_arm("berfin", T, "down")
    by = abs(math.sin(walk * 6)) * -8 if walk else math.sin(T * 2.0) * 3
    return place(gule(mouth=mouth("berfin", T, rest), blink=blink(T, 0.0), look=look, arm=a, dress=DRESS),
                 x, y + by + seat * 100 * s, s, flip)


def roni(T, x, y, s=1.0, look=0.9, arm=None, flip=True, walk=0.0, rest="smile", seat=0.0):
    a = arm or talking_arm("roni", T, "down")
    by = abs(math.sin(walk * 6)) * -8 if walk else math.sin(T * 2.0 + 2) * 3
    return place(ciwan(mouth=mouth("roni", T, rest), blink=blink(T, 1.7), look=look, arm=a),
                 x, y + by + seat * 115 * s, s, flip)


def shot(T, xb, xr, wide_z=1.05, close_z=1.45, cy=600):
    """Film kurgusu: replik sırasına göre geniş plan / konuşana yakın plan."""
    L = current(T)
    if L is None or L["i"] % 3 == 0:
        return wide_z, (xb + xr) / 2, cy
    sx = xb if L["who"] == "berfin" else xr
    return close_z, sx, cy - 120


def caption_card(T, t0, ku, tr):
    a = ease((T - t0) / 0.5) * (1 - ease((T - t0 - 2.6) / 0.5))
    if a <= 0:
        return ""
    return (f'<g opacity="{a:.2f}">' + rect(60, 50, 620, 108, "#1b1512", 16, sw=0, op=0.7)
            + text(90, 102, ku, 42, "#fffaf0", "Nunito", 900, anchor="start")
            + text(90, 142, tr, 28, "#f1d9a0", "Nunito", 800, anchor="start") + "</g>")


# ------------------------------------------------------------ mekânlar
def park_bg(T):
    g = [f'<rect width="{W}" height="{H}" fill="url(#gok_roj)"/>']
    rnd = random.Random(8)
    x = -20
    while x < W:            # uzak şehir
        w, h = rnd.randint(70, 150), rnd.randint(80, 220)
        g.append(rect(x, 600 - h, w, h + 20, "#b7c9d6", 2, sw=3))
        x += w + rnd.randint(4, 30)
    g.append(rect(-10, 600, W + 20, 500, "#8fbf6a", sw=5))
    g.append(path("M-10 760 Q500 700 960 740 Q1400 780 1930 720 L1930 820 Q1400 860 960 820 Q500 780 -10 840 Z", "#e8d9b0"))
    for tx, ty, r in ((180, 600, 120), (420, 560, 90), (1500, 580, 110), (1780, 610, 130)):
        g.append(rect(tx - 14, ty, 28, 140, "#7a5a3a", 4, sw=5))
        g.append(circle(tx, ty - r * 0.4, r, "#5d9a4a"))
        g.append(circle(tx - r * 0.5, ty - r * 0.1, r * 0.6, "#6aa854"))
    g.append(rect(1290, 380, 16, 380, "#3a3f45", 3, sw=4))       # fener
    g.append(path("M1270 380 L1326 380 L1314 340 L1282 340 Z", "#f6e7a8", sw=5))
    for k in range(3):     # kuşlar
        bx = (T * 60 + k * 300) % (W + 200) - 100
        by = 150 + k * 40 + math.sin(T * 2 + k) * 10
        g.append(path(f"M{bx - 16} {by} Q{bx - 8} {by - 10} {bx} {by} Q{bx + 8} {by - 10} {bx + 16} {by}", "none", sw=4))
    return "\n".join(g)


def bench_back(x0, x1, seat_y):
    g = [rect(x0, seat_y - 150, x1 - x0, 30, "#b5763f", 6), rect(x0, seat_y - 100, x1 - x0, 30, "#b5763f", 6)]
    g += [rect(x0 + 30, seat_y - 160, 22, 160, "#3a3f45", 3, sw=4), rect(x1 - 52, seat_y - 160, 22, 160, "#3a3f45", 3, sw=4)]
    return "".join(g)


def bench_front(x0, x1, seat_y):
    return (rect(x0 - 20, seat_y, x1 - x0 + 40, 36, "#c9874a", 8)
            + rect(x0, seat_y + 36, x1 - x0, 300, "#a8693a", 4)
            + "".join(line(x0 + k * 60, seat_y + 50, x0 + k * 60, seat_y + 300, stroke="#8a5530", sw=4)
                      for k in range(1, int((x1 - x0) / 60))))


def book(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">' + rect(-50, -34, 100, 68, "#2f5a8a", 6)
            + line(0, -34, 0, 34, sw=4) + "</g>")


def rain(T, x0, y0, w, h, n=40):
    rnd = random.Random(2)
    out = []
    for k in range(n):
        x = x0 + rnd.random() * w
        y = y0 + ((rnd.random() * h + T * 600) % h)
        out.append(line(x, y, x - 6, y + 22, stroke="#dfe8ef", sw=3))
    return "".join(out)


def cup(x, y, steam_t=None, color="#f4f1ea"):
    g = rect(x - 22, y - 50, 44, 52, color, 6, sw=4) + rect(x - 24, y - 58, 48, 12, "#6b4a32", 4, sw=4)
    if steam_t is not None:
        for k in range(2):
            ph = steam_t * 1.5 + k
            g += path(f"M{x - 6 + k * 12} {y - 66} q{6 * math.sin(ph)} -14 0 -28", "none", stroke="#fff", sw=3, op=0.6)
    return g


def istikan(x, y, T):
    g = ellipse(x, y + 2, 46, 10, "#d9d9dc", sw=4)
    g += path(f"M{x - 20} {y - 2} Q{x - 26} {y - 40} {x - 16} {y - 62} L{x + 16} {y - 62} Q{x + 26} {y - 40} {x + 20} {y - 2} Z",
              "#b4542a", sw=4)
    for k in range(2):
        ph = T * 1.5 + k + x
        g += path(f"M{x - 4 + k * 8} {y - 76} q{6 * math.sin(ph)} -14 0 -28", "none", stroke="#fff", sw=3, op=0.5)
    return g


def library_front(T):
    g = [f'<rect width="{W}" height="{H}" fill="url(#gok_roj)"/>',
         rect(260, 120, 1400, 760, "#d8c6a2", 6),
         rect(220, 90, 1480, 60, "#b9a37c", 6),
         text(960, 136, "PIRTÛKXANE", 50, INK, "Cinzel", 900)]
    for k in range(5):
        g.append(rect(320 + k * 270, 200, 40, 680, "#e6d8b8", 4))
    g.append(rect(820, 500, 280, 380, "#6b4a32", 8))
    g.append(line(960, 500, 960, 880, sw=5))
    for wx in (430, 1330):
        g.append(rect(wx, 330, 160, 220, "#9fc5dc", 6, sw=6))
    # saat 9:30
    g.append(circle(960, 330, 70, "#fffaf0", sw=6))
    g.append(line(960, 330, 960 - 26, 330 - 34, sw=7))       # saat ~9
    g.append(line(960, 330, 960, 330 + 52, sw=5))             # yelkovan 30
    g.append(rect(-10, 880, W + 20, 220, "#cfc6b4", sw=5))
    for k in range(3):
        g.append(rect(760 - k * 30, 880 + k * 30, 400 + k * 60, 30, "#bdb3a0", 2, sw=4))
    return "\n".join(g)


def library_in(T):
    g = [f'<rect width="{W}" height="{H}" fill="#e9dcc0"/>']
    rnd = random.Random(5)
    cols = ["#9c2f2c", "#2f5a8a", "#2f5a3c", "#d9a93a", "#6b4a32", "#7a4a8a"]
    for sx in (60, 700, 1340):
        g.append(rect(sx, 120, 520, 640, "#8a6844", 6))
        for row in range(5):
            y = 150 + row * 120
            x = sx + 20
            while x < sx + 490:
                w = rnd.randint(18, 34)
                h = rnd.randint(70, 96)
                g.append(rect(x, y + 100 - h, w, h, rnd.choice(cols), 2, sw=3))
                x += w + 2
            g.append(rect(sx, y + 100, 520, 14, "#6b4428", 0, sw=4))
    # saat: 10 → 12 hızla
    g.append(circle(960, 70, 46, "#fffaf0", sw=5))
    a = math.radians(-90 + (T % 10) * 36 * 2)
    g.append(line(960, 70, 960 + 34 * math.cos(a), 70 + 34 * math.sin(a), sw=4))
    return "\n".join(g)


def river_bg(T):
    g = [koy_dis("gunbatimi", T).split('<rect x="-10" y="720"')[0]]   # gök + dağlar
    g.append(rect(-10, 700, W + 20, 120, "url(#cem_av)", sw=5))
    for k in range(10):
        y = 720 + k * 10
        x = (k * 170 + T * 40) % W
        g.append(line(x, y, x + 90, y, stroke="#ffd8a0", sw=3))
    g.append(rect(-10, 820, W + 20, 280, "#b78a5a", sw=5))
    for k in range(14):
        x = k * 140 + 30
        g.append(path(f"M{x} 830 Q{x - 6} 790 {x - 2} 760 M{x + 8} 830 Q{x + 14} 796 {x + 18} 774", "none",
                      stroke="#6f8f4a", sw=5))
    return "\n".join(g)


# ------------------------------------------------------------ sahneler
def sc_acilis(T, t):
    a = ease((t - 0.6) / 1.0) * (1 - ease((t - 5.0) / 0.8))
    return (camera(park_bg(T), lerp(1.0, 1.05, t / 6), 960, 560)
            + f'<g opacity="{a:.2f}">'
            + text(960, 470, "BERFÎN û RONÎ", 140, "#fffaf0", "Cinzel", 900, stroke="#2b211c", stroke_width=12,
                   paint_order="stroke")
            + text(960, 548, "Fîlmeke kurt bi Kurmancî", 48, "#fffaf0", "Nunito", 900, stroke="#2b211c", stroke_width=8,
                   paint_order="stroke") + "</g>")


def sc_park(T, t):
    seat_y, x0, x1 = 860, 560, 1360
    xb = 760
    # Ronî sağdan yürüyerek gelir, 3. replikten sonra oturur
    walk_in = ease(t / 4.0)
    xr = lerp(1900, 1180, walk_in)
    r_seat = ease((T - end(2)) / 0.6)
    # Berfîn 10. replikten sonra kalkar, 11'den sonra sola yürür
    b_seat = 1 - ease((T - end(9) + 0.4) / 0.6)
    b_walk = max(0.0, T - end(10) - 0.3)
    xb_now = xb - b_walk * 260
    b_arm = "front" if b_seat > 0.5 and T < at(1) else None
    out = [park_bg(T), bench_back(x0, x1, seat_y)]
    out.append(berfin(T, xb_now, 1000, look=0.9 if b_walk == 0 else 0.0, arm=b_arm, flip=b_walk > 0,
                      walk=T if b_walk > 0 else 0, seat=b_seat))
    out.append(roni(T, xr, 1000, walk=T if walk_in < 1 else 0, seat=r_seat,
                    look=0.9, rest="sad" if b_walk > 2 else "smile"))
    if b_seat > 0.5 and T < at(1):
        out.append(book(xb + 4, 846, 0.9))
    out.append(bench_front(x0, x1, seat_y))
    z, cx, cy = shot(T, xb, 1180)
    if t < 4.5 or b_walk > 0:
        z, cx, cy = 1.0, 960, 560
    return camera("\n".join(out), z, cx, cy)


def sc_cafe(T, t):
    bg = ev_ici(False, T)
    # pencere: yağmurlu gök
    win = (f'<rect x="766" y="176" width="388" height="288" fill="url(#gok_baran)"/>' + rain(T, 766, 176, 388, 288)
           + line(960, 170, 960, 470, stroke="#7a5a3a", sw=12) + line(760, 320, 1160, 320, stroke="#7a5a3a", sw=12))
    xr, xb_final = 1180, 740
    enter = ease(t / 3.5)
    xb = lerp(-150, xb_final, enter)
    b_seat = ease((T - end(12)) / 0.6)
    out = [bg, win]
    out.append(roni(T, xr, 1000, seat=1.0, arm=None, look=0.9 if t > 3 else 0.2))
    out.append(berfin(T, xb, 1000, walk=T if enter < 1 else 0, seat=b_seat))
    tbl = rect(470, 880, 980, 46, "#8a5a34", 10) + rect(500, 926, 40, 200, "#6b4428", 4) + rect(1380, 926, 40, 200, "#6b4428", 4)
    out.append(tbl)
    tea_on = T > end(13) + 0.8
    if tea_on:
        out.append(istikan(860, 880, T) + istikan(1080, 880, T))
        # üç kaşık şeker (replik 15'ten önceki 4 sn)
        s0 = at(14) - 4.0
        for k in range(3):
            tk = T - (s0 + k * 1.1)
            if 0 < tk < 1.1:
                y = lerp(700, 840, ease(tk / 0.8))
                out.append(rect(1060, y - 10, 40, 22, "#fffaf0", 4, sw=3)
                           + text(1150, 760, str(k + 1), 70, INK, "Nunito", 900, stroke="#fffaf0", stroke_width=8,
                                  paint_order="stroke"))
    z, cx, cy = shot(T, xb_final, xr)
    if t < 3.5:
        z, cx, cy = 1.0, 960, 560
    if at(14) - 4.0 <= T < at(14):
        z, cx, cy = 1.6, 1080, 760       # şeker yakın planı
    return camera("\n".join(out), z, cx, cy) + caption_card(T, SCENE_ST["cafe"] + 0.3, "Hefteyek şûnde", "Bir hafta sonra")


def sc_mesaj(T, t):
    g = [f'<rect width="{W}" height="{H}" fill="#1c2340"/>',
         f'<circle cx="960" cy="540" r="700" fill="url(#lamba_isik)" opacity="0.5"/>',
         rect(620, 30, 680, 1020, "#30343a", 60),
         rect(650, 90, 620, 900, "#f6f2ea", 24, sw=4),
         rect(650, 90, 620, 110, "#4a3a7a", 24, sw=4),
         circle(720, 145, 34, SKIN, sw=4), text(780, 160, "Ronî", 44, "#fffaf0", "Nunito", 900, anchor="start")]
    def rows_of(words):
        rows, cur = [], ""
        for w in words.split():
            if len(cur) + len(w) + 1 > 24:
                rows.append(cur)
                cur = w
            else:
                cur = (cur + " " + w).strip()
        rows.append(cur)
        return rows

    items = []                       # (tür, i, yükseklik)
    for i in range(20, 24):
        L = LBY[i]
        if T < L["st"] - 1.0:
            break
        if T < L["st"]:
            items.append(("typing", i, 60))
            break
        items.append(("msg", i, 30 + 48 * len(rows_of(L["ku"]))))
    total = sum(h + 26 for _, _, h in items)
    y = 260 - max(0, 260 + total - 960)          # ekran dolunca yukarı kaydır
    g.append('<clipPath id="ekran"><rect x="650" y="200" width="620" height="790"/></clipPath><g clip-path="url(#ekran)">')
    for kind, i, h in items:
        L = LBY[i]
        mine = L["who"] == "berfin"
        if kind == "typing":
            bx = 1150 if mine else 700
            g.append(rect(bx - 60 if mine else bx, y, 120, 60, "#d9d4e8" if mine else "#e2e2e2", 28, sw=3))
            for k in range(3):
                g.append(circle((bx - 30 if mine else bx + 30) + k * 30, y + 30, 7 + 2 * math.sin(T * 8 + k), "#777", sw=0))
        else:
            bw = 520
            bx = 1240 - bw if mine else 680
            g.append(rect(bx, y, bw, h, "#cbbdf0" if mine else "#ffffff", 24, sw=4))
            for k, r in enumerate(rows_of(L["ku"])):
                g.append(text(bx + 26, y + 56 + k * 48, r, 36, INK, "Nunito", 800, anchor="start"))
        y += h + 26
    g.append("</g>")
    return camera("\n".join(g), 1.0) + caption_card(T, SCENE_ST["mesaj"] + 0.2, "Êvar", "Akşam")


def sc_deri(T, t):
    xr = 1140
    enter = ease(t / 4.5)
    xb = lerp(-150, 760, enter)
    out = [library_front(T)]
    out.append(roni(T, xr, 1010, arm="front", look=0.9 if t > 2 else 0.0))
    out.append(cup(xr - 40, 708, T) + cup(xr + 40, 708, T))
    out.append(berfin(T, xb, 1010, walk=T if enter < 1 else 0, rest="smile"))
    z, cx, cy = shot(T, 760, xr)
    if t < 4.5:
        z, cx, cy = lerp(1.25, 1.0, ease(t / 2.0)), lerp(960, 960, 0), lerp(380, 560, ease(t / 2.0))
    return camera("\n".join(out), z, cx, cy) + caption_card(T, SCENE_ST["deri"] + 0.3, "Roja din · 9:30", "Ertesi gün · 9:30")


def sc_hundir(T, t):
    out = [library_in(T)]
    xb, xr = 760, 1160
    glance = (t % 5) > 3.2
    out.append(berfin(T, xb, 1000, arm="front", look=0.0 if not (t % 7 > 5) else 0.9, rest="smile", seat=1.0))
    out.append(roni(T, xr, 1000, arm="front", look=0.9 if glance else 0.0, rest="smile", seat=1.0))
    out.append(rect(420, 880, 1080, 44, "#8a5a34", 8) + rect(450, 924, 40, 200, "#6b4428", 4) + rect(1430, 924, 40, 200, "#6b4428", 4))
    out.append(book(760, 866, 1.1) + book(1160, 866, 1.1))
    if glance:      # küçük kalp
        out.append(path("M1240 520 C1226 500 1204 516 1240 546 C1276 516 1254 500 1240 520 Z", "#e05a5a", sw=4))
    return camera("\n".join(out), lerp(1.0, 1.08, t / 10), 960, 560)


def sc_cem(T, t):
    out = [river_bg(T)]
    walk_in = ease(t / 5.0)
    stop = 1.0 if t > 5 else 0
    walk_out = max(0.0, T - end(31) - 0.8)
    xb = lerp(-200, 760, walk_in) + walk_out * 120
    xr = lerp(-40, 1100, walk_in) + walk_out * 120
    walking = T if (walk_in < 1 or walk_out > 0) else 0
    s = 1.0 - min(0.5, walk_out * 0.07)
    yb = 1010 - min(200, walk_out * 30)
    arm_r = "heart" if LBY[27]["st"] <= T < end(27) else None
    out.append(berfin(T, xb, yb, s, walk=walking, look=0.9))
    out.append(roni(T, xr, yb, s, walk=walking, arm=arm_r, look=0.9))
    z, cx, cy = shot(T, 760, 1100)
    if t < 5 or walk_out > 0:
        z, cx, cy = 1.0, 960, 560
    return camera("\n".join(out), z, cx, cy) + caption_card(T, SCENE_ST["cem"] + 0.3, "Piştî pirtûkxaneyê", "Kütüphaneden sonra")


def sc_son(T, t):
    a = ease(t / 1.2)
    return (f'<rect width="{W}" height="{H}" fill="#1b1512"/><g opacity="{a:.2f}">'
            + text(960, 420, "BERFÎN û RONÎ", 110, "#f1e4c6", "Cinzel", 900)
            + text(960, 500, "Dawî · Son", 46, GOLD, "Nunito", 900)
            + text(960, 640, "Deng: ElevenLabs  ·  Kontrola zimên: Mazdek", 30, "#bfae94", "Nunito", 800)
            + text(960, 690, "Okuyan Studio  ·  Peyvok", 34, "#f1e4c6", "Nunito", 900) + "</g>")


FN = {"acilis": sc_acilis, "park": sc_park, "cafe": sc_cafe, "mesaj": sc_mesaj, "deri": sc_deri,
      "hundir": sc_hundir, "cem": sc_cem, "son": sc_son}
SCENE_ST = {n: a for n, a, b in SCENES}


def subtitle(T):
    for L in LINES:
        if L["st"] - 0.1 <= T < L["st"] + L["d"] + 0.5:
            return (text(960, 990, L["ku"], 50, "#fffaf0", "Nunito", 900, stroke="#1b1512", stroke_width=10,
                         paint_order="stroke", stroke_linejoin="round")
                    + text(960, 1042, L["tr"], 34, "#f1d9a0", "Nunito", 800, stroke="#1b1512", stroke_width=8,
                           paint_order="stroke", stroke_linejoin="round"))
    return ""


def frame_svg(T):
    for name, a, b in SCENES:
        if a <= T < b:
            body = FN[name](T, T - a)
            break
    else:
        body = sc_son(T, T - SCENES[-1][1])
    marks = [a for n, a, b in SCENES[1:]]
    dd = min(abs(T - m) for m in marks)
    fade = max(0.0, 1 - dd / 0.45) if T > 1 else 1 - ease(T)
    defs = DEFS.replace("</defs>", EXTRA_DEFS + MORE_DEFS + "</defs>")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{defs}'
            f'<rect width="{W}" height="{H}" fill="#f3e6c9"/>{body}<rect width="{W}" height="{H}" fill="url(#vinyet)"/>'
            f'{subtitle(T)}<rect width="{W}" height="{H}" fill="#000" opacity="{fade:.3f}"/></svg>')


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
        args += ["-i", FILES[L["i"]]]
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
        print("OK stills; toplam", round(TOTAL, 1), {n: round(x, 1) for n, x, y in SCENES})
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
