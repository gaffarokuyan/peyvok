"""BOXÇE — 2D arka planlar, nesneler ve sahne kompozisyonları (SVG).

Her sahne fonksiyonu `(t, ctx) -> svg_body` döndürür. t: sahne içi saniye.
ctx: {"mouth": {karakter: ağız}, "blink": {karakter: bool}} — film.py doldurur.
"""
import math, random
from karakter import (gule, hevi, roni, place, path, circle, ellipse, line, limb,
                      INK, SW, SKIN, GOLD, GOLD_D, KIRAS)

W, H = 1920, 1080

EXTRA_DEFS = """
<linearGradient id="gok_safak" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#9fb8c9"/><stop offset="0.55" stop-color="#f1d3a6"/><stop offset="1" stop-color="#f6c98e"/>
</linearGradient>
<linearGradient id="gok_gunbatimi" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#5f6f9a"/><stop offset="0.5" stop-color="#e8a06a"/><stop offset="1" stop-color="#f4c27a"/>
</linearGradient>
<linearGradient id="gok_gri" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#aab3ba"/><stop offset="1" stop-color="#d3d6d5"/>
</linearGradient>
<linearGradient id="gok_gece" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1c2340"/><stop offset="1" stop-color="#3a4166"/>
</linearGradient>
<radialGradient id="lamba_isik" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#ffd58a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vinyet" cx="0.5" cy="0.5" r="0.75">
  <stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/>
</radialGradient>
<pattern id="kilim" width="80" height="60" patternUnits="userSpaceOnUse">
  <rect width="80" height="60" fill="#9c2f2c"/>
  <path d="M40 6 L66 30 L40 54 L14 30 Z" fill="#d9a93a" stroke="#2b211c" stroke-width="3"/>
  <path d="M40 18 L54 30 L40 42 L26 30 Z" fill="#2f5a3c"/>
  <path d="M0 0 L10 10 L0 20 M80 40 L70 50 L80 60 M0 40 L10 50 L0 60 M80 0 L70 10 L80 20" stroke="#f1e4c6" stroke-width="3" fill="none"/>
</pattern>
<pattern id="kilim2" width="60" height="40" patternUnits="userSpaceOnUse">
  <rect width="60" height="40" fill="#2f4a6a"/>
  <path d="M0 20 L15 5 L30 20 L45 5 L60 20 L45 35 L30 20 L15 35 Z" fill="#c9673f" stroke="#2b211c" stroke-width="2"/>
  <circle cx="30" cy="20" r="4" fill="#f1e4c6"/>
</pattern>
<pattern id="tugla" width="60" height="30" patternUnits="userSpaceOnUse">
  <rect width="60" height="30" fill="#b5643f"/>
  <path d="M0 15 H60 M30 0 V15 M0 15 V30 M60 15 V30" stroke="#8a4a2e" stroke-width="3"/>
</pattern>
<pattern id="kerpic" width="120" height="50" patternUnits="userSpaceOnUse">
  <rect width="120" height="50" fill="#d8b98a"/>
  <path d="M0 25 H120 M60 0 V25 M20 25 V50 M90 25 V50" stroke="#c4a173" stroke-width="2.5"/>
</pattern>
<pattern id="defter" width="40" height="40" patternUnits="userSpaceOnUse">
  <rect width="40" height="40" fill="#f6f2e7"/>
  <path d="M0 0 H40 M0 0 V40" stroke="#c9d7e6" stroke-width="2"/>
</pattern>
"""


def rect(x, y, w, h, fill, rx=0, **kw):
    kw.setdefault("stroke", INK)
    kw.setdefault("sw", SW)
    st = f'stroke="{kw["stroke"]}" stroke-width="{kw["sw"]}"'
    op = f' opacity="{kw["op"]}"' if "op" in kw else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" {st} stroke-linejoin="round"{op}/>'


def poly(pts, fill, **kw):
    d = "M" + " L".join(f"{x} {y}" for x, y in pts) + " Z"
    return path(d, fill, **kw)


def text(x, y, s, size, fill=INK, font="Nunito", weight=900, anchor="middle", **kw):
    extra = " ".join(f'{k.replace("_", "-")}="{v}"' for k, v in kw.items())
    s = s.replace("&", "&amp;").replace("<", "&lt;")
    return (f'<text x="{x}" y="{y}" font-family="{font}" font-weight="{weight}" font-size="{size}" '
            f'fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>')


_W = {"M": 0.86, "W": 0.92, "I": 0.34, "Î": 0.34, ".": 0.30, ",": 0.30, "…": 0.7, " ": 0.40,
      "Ç": 0.66, "Ê": 0.62, "E": 0.62, "T": 0.62, "L": 0.58, "Û": 0.72, "U": 0.72, "Y": 0.66,
      "D": 0.74, "B": 0.66, "K": 0.66, "R": 0.66, "N": 0.76, "A": 0.70}


def _adv(ch):
    if ch.isupper() or ch in _W:
        return _W.get(ch, 0.68)
    return 0.56 if ch not in "il" else 0.28


def wobble(x, y, lines, size, seed, color="#3b3a3f", spacing=1.25, jitter=12, scale_j=0.18, upto=None):
    """El yazısı: her harf ayrı, titrek. upto: çizilecek harf sayısı (yazma animasyonu)."""
    rnd = random.Random(seed)
    out, n = [], 0
    for li, ln in enumerate(lines):
        cx = x + rnd.uniform(-6, 6)
        cy = y + li * size * spacing
        for ch in ln:
            if upto is not None and n >= upto:
                return "\n".join(out)
            sz = size * rnd.uniform(1 - scale_j, 1 + scale_j)
            if ch != " ":
                out.append(f'<text x="{cx:.1f}" y="{cy + rnd.uniform(-size * .08, size * .08):.1f}" '
                           f'font-family="Nunito" font-weight="800" font-size="{sz:.1f}" fill="{color}" '
                           f'transform="rotate({rnd.uniform(-jitter, jitter):.1f} {cx:.1f} {cy:.1f})">{ch}</text>')
            cx += sz * _adv(ch) + rnd.uniform(0, size * .05)
            n += 1
    return "\n".join(out)


def camera(body, z=1.0, cx=W / 2, cy=H / 2):
    return f'<g transform="translate({W / 2},{H / 2}) scale({z}) translate({-cx},{-cy})">{body}</g>'


def ease(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def lerp(a, b, x):
    return a + (b - a) * x


# =============================================================== NESNELER
def bohca_kapali(x, y, s=1.0):
    g = [path("M-70 0 Q-92 -46 -58 -78 Q0 -100 58 -78 Q92 -46 70 0 Z", "#B3262E"),
         path("M-58 -78 L-20 -40 M58 -78 L20 -40", "none", stroke="#6e1520", sw=4),
         path("M-12 -86 Q-48 -128 -40 -100 Q-30 -84 -10 -84 Z", "#B3262E", sw=5),
         path("M12 -86 Q48 -128 40 -100 Q30 -84 10 -84 Z", "#B3262E", sw=5),
         ellipse(0, -86, 16, 12, "#B3262E", sw=5)]
    for k, xx in enumerate((-40, 0, 40)):
        c = GOLD if k != 1 else "#2f5a3c"
        g.append(path(f"M{xx} -34 L{xx + 9} -22 L{xx} -10 L{xx - 9} -22 Z", c, sw=3))
    return f'<g transform="translate({x},{y}) scale({s})">{"".join(g)}</g>'


def telefon(x, y, s=1.0, ekran="#9fd0e8"):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            + rect(-30, -56, 60, 112, "#30343a", 10) + rect(-22, -46, 44, 88, ekran, 4, sw=3) + "</g>")


def lamba(x, y, s=1.0, flick=1.0):
    g = [f'<circle cx="0" cy="-60" r="{260 * flick}" fill="url(#lamba_isik)"/>',
         path("M-26 0 Q-30 -20 -14 -30 L14 -30 Q30 -20 26 0 Z", "#b07a3a", sw=5),
         path("M-16 -30 Q-24 -70 -8 -96 L8 -96 Q24 -70 16 -30 Z", "#f3e8c8", sw=5, op=0.9),
         path(f"M0 -44 Q-9 -58 0 {-74 - 6 * flick} Q9 -58 0 -44 Z", "#ffb23a", sw=3),
         rect(-12, -104, 24, 10, "#6b5a46", 3, sw=4)]
    return f'<g transform="translate({x},{y}) scale({s})">{"".join(g)}</g>'


def dolmus(x, y, s=1.0, wheel=0.0):
    g = [path("M-200 -40 L-200 -150 Q-196 -176 -170 -180 L150 -180 Q186 -176 196 -130 L210 -60 L210 -40 Z", "#eef1f2"),
         rect(-200, -70, 410, 24, "#3d6fa8", 0, sw=5),
         path("M150 -170 Q180 -166 190 -130 L196 -100 L150 -100 Z", "#9fc5dc", sw=5)]
    for i in range(4):
        g.append(rect(-184 + i * 80, -166, 66, 60, "#9fc5dc", 6, sw=5))
    for wx in (-130, 130):
        g.append(circle(wx, -36, 34, "#2b2b2e"))
        g.append(circle(wx, -36, 14, "#9a9a9a", sw=4))
        a = wheel
        g.append(line(wx + 12 * math.cos(a), -36 + 12 * math.sin(a), wx - 12 * math.cos(a), -36 - 12 * math.sin(a), sw=3))
    g.append(circle(204, -64, 8, "#ffd36a", sw=3))
    return f'<g transform="translate({x},{y}) scale({s})">{"".join(g)}</g>'


def simit(x, y, s=1.0):
    return (f'<g transform="translate({x},{y}) scale({s})">' + circle(0, 0, 30, "#c98b45")
            + circle(0, 0, 11, "none") + "".join(
                f'<ellipse cx="{22 * math.cos(a):.1f}" cy="{22 * math.sin(a):.1f}" rx="3" ry="1.8" fill="#f4e7c8"/>'
                for a in [i * 0.7 for i in range(9)]) + "</g>")


# =============================================================== MEKÂNLAR
def koy_dis(mood="safak", t=0.0, mist=0.0):
    """Köy: gök, dağlar, düz damlı kerpiç evler, kavaklar, toprak yol."""
    sky = {"safak": "url(#gok_safak)", "gunbatimi": "url(#gok_gunbatimi)"}[mood]
    sun_c = "#fff1c4" if mood == "safak" else "#ffcf7a"
    sun_y = 520 if mood == "safak" else 470
    g = [f'<rect width="{W}" height="{H}" fill="{sky}"/>',
         f'<circle cx="1380" cy="{sun_y}" r="110" fill="{sun_c}" opacity="0.95"/>']
    # bulutlar
    for cx, cy, k in ((400, 200, 1), (1500, 150, 0.8), (980, 260, 0.6)):
        dx = (t * 6 * k) % 300
        g.append(f'<g opacity="0.75" transform="translate({dx},0)">'
                 + ellipse(cx, cy, 120 * k, 34 * k, "#fbf3e3", sw=4)
                 + ellipse(cx + 70 * k, cy - 22 * k, 70 * k, 34 * k, "#fbf3e3", sw=4) + "</g>")
    far = "#8c97b5" if mood == "safak" else "#7d6c8c"
    mid = "#b49a72" if mood == "safak" else "#9a6f5a"
    g.append(poly([(0, 640), (260, 380), (420, 470), (700, 300), (980, 470), (1240, 360), (1520, 480),
                   (1760, 350), (1920, 430), (1920, 700), (0, 700)], far, sw=5))
    g.append(poly([(700, 300), (640, 352), (690, 340), (730, 372), (770, 336)], "#f4f1ea", sw=4))
    g.append(poly([(1760, 350), (1712, 390), (1750, 380), (1790, 400), (1810, 380)], "#f4f1ea", sw=4))
    g.append(poly([(0, 700), (300, 560), (600, 640), (900, 560), (1250, 650), (1600, 570), (1920, 640),
                   (1920, 760), (0, 760)], mid, sw=5))
    ground = "#d7b57e" if mood == "safak" else "#c9935f"
    g.append(rect(-10, 720, W + 20, 380, ground, sw=5))
    # yol
    g.append(path("M820 1090 Q900 900 1010 800 Q1080 745 1180 722 L1240 722 Q1160 760 1110 810 Q1020 920 1080 1090 Z",
                  "#e6cc9c", sw=5))
    # evler (düz dam, çıkıntılı kirişler)
    houses = [(120, 760, 300, 190), (430, 740, 230, 150), (1330, 740, 260, 170), (1620, 770, 280, 200)]
    for hx, hy, hw, hh in houses:
        g.append(rect(hx, hy - hh, hw, hh, "url(#kerpic)", 4))
        g.append(rect(hx - 14, hy - hh - 18, hw + 28, 22, "#a98a62", 4))
        for k in range(5):
            g.append(circle(hx + 12 + k * (hw - 24) / 4, hy - hh + 14, 6, "#7a5a3a", sw=3))
        g.append(rect(hx + hw * 0.18, hy - hh * 0.62, hw * 0.16, hh * 0.24, "#4a5a6a", 3, sw=4))
        g.append(rect(hx + hw * 0.6, hy - hh * 0.58, hw * 0.22, hh * 0.58, "#6b4a32", 4, sw=4))
    # kavaklar
    for px, py, ph in ((60, 760, 300), (690, 730, 260), (1260, 735, 280), (1890, 770, 320)):
        g.append(line(px, py, px, py - ph * 0.3, stroke="#6b4a32", sw=10))
        g.append(ellipse(px, py - ph * 0.62, 34, ph * 0.42, "#6f8f4a", sw=5))
    # sis
    if mist > 0:
        for i, (mx, my) in enumerate(((300, 700), (900, 680), (1500, 710), (600, 760), (1300, 760))):
            ox = math.sin(t * 0.25 + i) * 60
            g.append(f'<ellipse cx="{mx + ox}" cy="{my}" rx="420" ry="46" fill="#fbf6ec" opacity="{0.55 * mist}"/>')
    if mood == "gunbatimi":
        g.append(f'<rect width="{W}" height="{H}" fill="#ff9a50" opacity="0.10"/>')
    return "\n".join(g)


def ev_ici(night=False, t=0.0):
    """Köy evi içi: sıvalı duvar, pencere, kilim, minderler, tandır."""
    wall = "#ead2a6"
    g = [rect(-10, -10, W + 20, 760, wall, sw=0),
         rect(-10, 740, W + 20, 360, "#b8895a", sw=5)]
    # tavan kirişleri
    for k in range(7):
        g.append(rect(-10 + k * 330, -10, 40, 60, "#7a5a3a", 4, sw=4))
    g.append(rect(-10, 40, W + 20, 26, "#8a6844", 0, sw=5))
    # pencere
    sky = "url(#gok_gece)" if night else "url(#gok_safak)"
    g.append(rect(760, 170, 400, 300, sky, 6, sw=10))
    if night:
        g.append(circle(1060, 240, 34, "#f6f0d0", sw=4))
        for sx, sy in ((820, 210), (900, 300), (980, 200), (1110, 330), (850, 400)):
            g.append(f'<circle cx="{sx}" cy="{sy}" r="3" fill="#f6f0d0"/>')
    else:
        g.append(poly([(766, 470), (840, 360), (920, 420), (1010, 330), (1100, 410), (1154, 380), (1154, 470)],
                      "#8c97b5", sw=4))
    g.append(line(960, 170, 960, 470, stroke="#7a5a3a", sw=12))
    g.append(line(760, 320, 1160, 320, stroke="#7a5a3a", sw=12))
    g.append(rect(740, 470, 440, 26, "#8a6844", 4, sw=5))
    # sardunyalar
    for px in (800, 1120):
        g.append(path(f"M{px - 26} 470 L{px - 20} 430 L{px + 20} 430 L{px + 26} 470 Z", "#b5643f", sw=4))
        for dx, dy in ((-14, 412), (0, 400), (14, 414), (6, 424)):
            g.append(circle(px + dx, dy, 12, "#d8433f", sw=3))
        g.append(ellipse(px - 22, 424, 14, 8, "#5d8a4a", sw=3))
    # duvar kilimi
    g.append(rect(150, 150, 420, 300, "url(#kilim)", 6, sw=6))
    for k in range(13):
        g.append(line(160 + k * 33, 450, 160 + k * 33, 476, stroke="#9c2f2c", sw=4))
    # sağda raf + bakır sahanlar
    g.append(rect(1380, 300, 380, 22, "#8a6844", 4, sw=5))
    for k, c in enumerate(("#c87f3c", "#d79a4c", "#c87f3c")):
        g.append(ellipse(1440 + k * 120, 270, 44, 30, c, sw=5))
    # minderler (duvar dibi)
    for k in range(5):
        g.append(rect(40 + k * 380, 660, 360, 90, "url(#kilim2)" if k % 2 else "#9c2f2c", 20, sw=5))
    # yer kilimi
    g.append(path("M200 1100 L420 820 L1500 820 L1720 1100 Z", "url(#kilim)", sw=6))
    if night:
        g.append(f'<rect x="-10" y="-10" width="{W + 20}" height="{H + 20}" fill="#141a38" opacity="0.55"/>')
    return "\n".join(g)


def tandir(x, y, glow=0.6):
    return (path(f"M{x - 130} {y} Q{x - 120} {y - 70} {x} {y - 76} Q{x + 120} {y - 70} {x + 130} {y} Z", "#b97c4e")
            + ellipse(x, y - 64, 70, 16, "#3a2218", sw=5)
            + f'<ellipse cx="{x}" cy="{y - 64}" rx="60" ry="11" fill="#ff8a3a" opacity="{glow}"/>')


def insaat(t=0.0):
    """İstanbul inşaatı: gri gök, şehir silüeti, beton iskelet, vinç, çimento torbaları."""
    g = [f'<rect width="{W}" height="{H}" fill="url(#gok_gri)"/>']
    # şehir silüeti
    rnd = random.Random(3)
    x = -20
    while x < W:
        w = rnd.randint(60, 140)
        h = rnd.randint(120, 330)
        g.append(rect(x, 640 - h, w, h + 20, "#b9bec2", 2, sw=3))
        for wy in range(640 - h + 18, 630, 36):
            for wx in range(x + 12, x + w - 16, 26):
                g.append(f'<rect x="{wx}" y="{wy}" width="12" height="16" fill="#cfd4d7"/>')
        x += w + rnd.randint(0, 20)
    # vinç (kol yavaşça döner)
    g.append(rect(1460, 120, 34, 560, "#d9b13a", 0, sw=5))
    for k in range(14):
        g.append(line(1460, 140 + k * 38, 1494, 158 + k * 38, sw=3))
    ang = math.sin(t * 0.08) * 6
    g.append(f'<g transform="rotate({ang} 1477 120)">' + rect(980, 104, 760, 26, "#d9b13a", 0, sw=5)
             + rect(1640, 90, 90, 50, "#8a8c88", 4, sw=5)
             + line(1150, 130, 1150, 380, sw=3) + rect(1130, 380, 40, 30, "#8a8c88", 3, sw=4) + "</g>")
    # beton iskelet bina
    g.append(rect(120, 230, 1100, 480, "none", sw=0))
    for fl in range(4):
        y = 700 - fl * 140
        g.append(rect(100, y - 26, 1140, 26, "#9a9b97", 2))
        for k in range(6):
            g.append(rect(130 + k * 210, y - 140, 34, 114, "#a7a8a4", 2))
    for k in range(6):
        for j in range(3):
            g.append(line(140 + k * 210 + j * 8, 280, 140 + k * 210 + j * 8, 230, stroke="#5a4a42", sw=3))
    # iskele
    for k in range(5):
        g.append(line(1250 + k * 50, 720, 1250 + k * 50, 260, stroke="#6c7078", sw=6))
    for k in range(7):
        g.append(line(1250, 720 - k * 70, 1450, 720 - k * 70, stroke="#6c7078", sw=5))
    # zemin
    g.append(rect(-10, 700, W + 20, 400, "#a3a29c", sw=5))
    # tuğla paleti + çimento torbaları
    g.append(rect(1460, 760, 260, 110, "url(#tugla)", 3))
    for k in range(4):
        g.append(rect(150 + k * 70, 800 - (k % 2) * 20, 90, 54, "#e5e0d2", 12, sw=5))
        g.append(text(195 + k * 70, 834 - (k % 2) * 20, "50", 20, "#7a7568"))
    return "\n".join(g)


# =============================================================== YAKIN PLANLAR
def telefon_yakin(t):
    """Telefon ekranında: bento kutusu + içinde küçük not (yazısız)."""
    g = [f'<rect width="{W}" height="{H}" fill="#e9d6ae"/>',
         rect(560, 60, 800, 1000, "#30343a", 60),
         rect(600, 120, 720, 880, "#f6efe0", 24, sw=5)]
    # bento
    g.append(rect(690, 300, 540, 420, "#2a2a2e", 26))
    g.append(rect(712, 322, 496, 376, "#b8312f", 18, sw=4))
    g.append(rect(730, 340, 220, 340, "#f8f6f0", 12, sw=4))            # pirinç
    g.append(circle(840, 470, 44, "#f8f6f0", sw=4))
    g.append(circle(822, 460, 6, INK, sw=0) + circle(858, 460, 6, INK, sw=0))   # pirinç ayıcık
    g.append(path("M826 488 Q840 498 854 488", "none", sw=4))
    g.append(ellipse(1000, 420, 64, 40, "#ffd65a", sw=4))                # yumurta
    g.append(ellipse(1100, 420, 40, 34, "#e8735a", sw=4))
    for k in range(3):
        g.append(ellipse(990 + k * 60, 560, 34, 22, "#6aa04a", sw=4))
    # not: kalp + yazı çizgileri (zamanla belirir)
    a = ease((t - 1.0) / 1.0)
    g.append(f'<g opacity="{a}" transform="rotate(-8 1080 760)">'
             + rect(960, 690, 240, 160, "#fffaf0", 6, sw=5)
             + path("M1080 742 C1060 720 1036 740 1080 772 C1124 740 1100 720 1080 742 Z", "#e05a5a", sw=4)
             + line(990, 800, 1170, 800, sw=3, stroke="#8a8a8a") + line(990, 824, 1130, 824, sw=3, stroke="#8a8a8a")
             + "</g>")
    return "\n".join(g)


def defter_yakin(t):
    """Gece dersi: defter. Hêvî'nin düzgün harfleri + Gulê'nin titrek kopyaları."""
    g = [f'<rect width="{W}" height="{H}" fill="#3a2f2a"/>',
         f'<circle cx="960" cy="420" r="900" fill="url(#lamba_isik)"/>',
         rect(300, 90, 1320, 940, "url(#defter)", 10),
         line(960, 90, 960, 1030, stroke="#c9b9a0", sw=4)]
    rows = [("A", "av"), ("B", "bav"), ("D", "dayik")]
    for i, (L, wd) in enumerate(rows):
        y = 260 + i * 250
        g.append(text(400, y, L, 120, "#2c4a7a", "Nunito", 800, "start"))
        g.append(text(520, y, "— " + wd, 80, "#2c4a7a", "Nunito", 800, "start"))
    # Gulê'nin kopyaları: zamanla yazılır; D önce ters
    prog = max(0.0, t - 1.0) * 3.2
    copies = ["A  av", "B  bav", "D  dayik"]
    n = int(prog)
    row, k_row = 0, 0
    for i, c in enumerate(copies):
        k = max(0, min(len(c), n))
        if k:
            g.append(wobble(1030, 260 + i * 250, [c], 96, seed=10 + i, color="#3b3a3f", jitter=14, upto=k))
            row, k_row = i, k
        n -= len(c) + 2
    if t > 6.0:   # ilk ters D'nin üstü çizilmiş
        g.append(f'<g transform="translate(1480,{860}) scale(-1,1)">' + text(0, 0, "D", 70, "#3b3a3f") + "</g>")
        g.append(line(1420, 810, 1490, 870, stroke="#c0392b", sw=7))
    # kalem + el (kalem ucu son yazılan harfte; kol sağ alttan gelir)
    px = 1030 + sum(_adv(ch) * 96 for ch in copies[row][:k_row]) + 10
    py = 260 + row * 250 + 6
    g.append(f'<g transform="translate({px},{py}) rotate(-35)">' + rect(-9, 0, 18, 150, "#e3b23c", 3, sw=4)
             + path("M-9 0 L0 -24 L9 0 Z", "#f1d9a8", sw=4) + "</g>")
    hx, hy = px + 80, py + 110
    g.append(path(f"M{hx + 20} {hy + 10} Q{hx + 200} {hy + 120} {hx + 330} {hy + 400} L{hx + 520} {hy + 400} "
                  f"Q{hx + 330} {hy + 60} {hx + 60} {hy - 40} Z", KIRAS))
    g.append(path(f"M{hx + 30} {hy + 16} Q{hx + 50} {hy - 10} {hx + 64} {hy - 36}", "none", stroke=GOLD, sw=5))
    g.append(ellipse(hx, hy, 58, 44, SKIN))
    return "\n".join(g)


def not_yakin(lines, seed, color="#3b3a3f", cloth=True, t=0.0, open_t=None):
    """Bohçadaki not (yukarıdan bakış). open_t verilirse bohça kanatları açılır."""
    g = [f'<rect width="{W}" height="{H}" fill="#7d7f7b"/>']
    if cloth:
        o = 1.0 if open_t is None else ease(open_t)
        # açılan kanatlar (yukarıdan: dört üçgen merkezden dışa)
        cx, cy, R = 960, 560, 470
        g.append(f'<g transform="translate({cx},{cy}) rotate(8)">')
        g.append(rect(-R * 0.62, -R * 0.62, R * 1.24, R * 1.24, "#B3262E", 8))
        for k in range(4):
            a = k * 90
            g.append(f'<g transform="rotate({a}) translate(0,{-R * 0.62}) scale(1,{lerp(-0.15, 1, o)})">'
                     + poly([(-R * 0.62, 0), (R * 0.62, 0), (0, -R * 0.55)], "#B3262E")
                     + "".join(path(f"M{xx} {-R * 0.25 - 14} L{xx + 14} {-R * 0.25} L{xx} {-R * 0.25 + 14} L{xx - 14} {-R * 0.25} Z",
                                    GOLD if xx else "#2f5a3c", sw=3) for xx in (-60, 0, 60))
                     + "</g>")
        g.append("</g>")
        # yiyecekler (açılınca görünür)
        fo = ease((o - 0.6) / 0.4)
        g.append(f'<g opacity="{fo}">')
        for k in range(3):
            g.append(circle(700 + k * 14, 390 - k * 10, 96, "#d8a35a"))
            g.append(circle(700 + k * 14, 390 - k * 10, 80, "none", sw=3))
        g.append(rect(1080, 300, 190, 140, "#efe8d2", 16))
        for i in range(10):
            g.append(ellipse(1240 + (i % 4) * 34, 600 + (i // 4) * 40, 16, 20, "#e3d3a8", sw=4))
        for i in range(14):
            g.append(circle(640 + (i % 5) * 30, 700 + (i // 5) * 30, 13, "#c79a5b", sw=3))
        g.append("</g>")
        g.append(f'<g opacity="{fo}" transform="rotate(-6 960 640)">' + rect(760, 500, 400, 300, "#efebe2", 4)
                 + wobble(800, 572, lines, 52, seed, color) + "</g>")
    else:
        g.append(f'<g transform="rotate(-4 960 540)">' + rect(560, 260, 800, 560, "url(#defter)", 6)
                 + wobble(640, 400, lines, 86, seed, color, jitter=9) + "</g>")
    return "\n".join(g)


def jenerik(t):
    a = ease(t / 1.5)
    return (f'<rect width="{W}" height="{H}" fill="#1b1512"/>'
            + f'<g opacity="{a}">'
            + bohca_kapali(960, 420, 1.3)
            + text(960, 600, "BOXÇE", 120, "#f1e4c6", "Cinzel", 900)
            + text(960, 670, "Fîlmeke kurt bi Kurmancî", 40, "#d9a93a", "Nunito", 800)
            + text(960, 790, "Deng: ElevenLabs  ·  Kontrola zimên: Mazdek", 30, "#bfae94", "Nunito", 800)
            + text(960, 840, "Okuyan Studio", 34, "#f1e4c6", "Nunito", 900)
            + "</g>")
