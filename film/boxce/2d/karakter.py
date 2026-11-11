"""BOXÇE — 2D karakterler (SVG).

Tarz: düz renk, kalın koyu kontur, beyaz yuvarlak kafa, nokta göz.
Her fonksiyon ayakları (0,0)'da duran bir <g> döndürür; sahnede
translate/scale ile yerleştirilir.

Ortak parametreler:
  mouth  : "smile" | "flat" | "open" | "sad" | "o"   (dudak senkronu için)
  blink  : True → gözler kapalı çizgi
  look   : göz bebeği yatay kayması (-1..1)
"""
import math

INK = "#2b211c"          # kontur
SW = 6                   # kontur kalınlığı
SKIN = "#fbf8f1"         # beyaz kafa
P = dict(stroke=INK, sw=SW)


def _a(**kw):
    out = []
    for k, v in kw.items():
        k = {"sw": "stroke-width", "fill_rule": "fill-rule", "lj": "stroke-linejoin",
             "lc": "stroke-linecap", "op": "opacity"}.get(k, k.replace("_", "-"))
        out.append(f'{k}="{v}"')
    return " ".join(out)


def path(d, fill, **kw):
    kw.setdefault("stroke", INK)
    kw.setdefault("sw", SW)
    kw.setdefault("lj", "round")
    kw.setdefault("lc", "round")
    return f'<path d="{d}" {_a(fill=fill, **kw)}/>'


def circle(cx, cy, r, fill, **kw):
    kw.setdefault("stroke", INK)
    kw.setdefault("sw", SW)
    return f'<circle {_a(cx=cx, cy=cy, r=r, fill=fill, **kw)}/>'


def ellipse(cx, cy, rx, ry, fill, **kw):
    kw.setdefault("stroke", INK)
    kw.setdefault("sw", SW)
    return f'<ellipse {_a(cx=cx, cy=cy, rx=rx, ry=ry, fill=fill, **kw)}/>'


def line(x1, y1, x2, y2, **kw):
    kw.setdefault("stroke", INK)
    kw.setdefault("sw", SW)
    kw.setdefault("lc", "round")
    return f'<line {_a(x1=x1, y1=y1, x2=x2, y2=y2, **kw)}/>'


DEFS = f"""
<defs>
  <pattern id="puşi" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="14" height="14" fill="#f4f1ea"/>
    <rect width="7" height="7" fill="#2a2a2e"/>
    <rect x="7" y="7" width="7" height="7" fill="#2a2a2e"/>
  </pattern>
  <pattern id="kiras" width="34" height="34" patternUnits="userSpaceOnUse">
    <rect width="34" height="34" fill="#7b2b33"/>
    <circle cx="8" cy="8" r="3.2" fill="#d6a94a"/>
    <circle cx="25" cy="25" r="3.2" fill="#e7d9b8"/>
    <circle cx="25" cy="8" r="1.6" fill="#4f7a4a"/>
    <circle cx="8" cy="25" r="1.6" fill="#4f7a4a"/>
  </pattern>
  <pattern id="sal" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect width="10" height="10" fill="#6b4a32"/>
    <path d="M0 10 L10 0" stroke="#5a3d29" stroke-width="2"/>
  </pattern>
  <pattern id="pist" width="40" height="14" patternUnits="userSpaceOnUse">
    <rect width="40" height="14" fill="#b3262e"/>
    <rect y="5" width="40" height="3" fill="#d9a93a"/>
    <path d="M0 2 L5 0 L10 2 L15 0 L20 2 L25 0 L30 2 L35 0 L40 2" stroke="#6e1520" stroke-width="1.5" fill="none"/>
    <path d="M0 12 L5 14 L10 12 L15 14 L20 12 L25 14 L30 12 L35 14 L40 12" stroke="#6e1520" stroke-width="1.5" fill="none"/>
  </pattern>
  <pattern id="pusi_sor" width="16" height="16" patternUnits="userSpaceOnUse">
    <rect width="16" height="16" fill="#b3262e"/>
    <circle cx="4" cy="4" r="2.2" fill="#f4f1ea"/>
    <circle cx="12" cy="12" r="2.2" fill="#2a2a2e"/>
  </pattern>
</defs>
"""


def face(cx, cy, r, mouth="smile", blink=False, look=0.0, age=0, sx=1.0):
    """Göz + ağız (+ yaşlı için kırışık). sx: kafa yönü (-1 sola bakar)."""
    ex = r * 0.31
    ey = cy - r * 0.05
    dx = look * r * 0.06
    g = []
    for s in (-1, 1):
        x = cx + s * ex + dx
        if blink:
            g.append(line(x - 7, ey, x + 7, ey, sw=5))
        else:
            g.append(f'<circle cx="{x}" cy="{ey}" r="{r * 0.085}" fill="{INK}"/>')
        if age:
            # göz kenarı kırışıkları
            ox = cx + s * (ex + r * 0.17)
            g.append(line(ox, ey - 5, ox + s * 9, ey - 9, sw=3))
            g.append(line(ox, ey + 3, ox + s * 9, ey + 6, sw=3))
    my = cy + r * 0.38
    mw = r * 0.22
    if mouth == "smile":
        g.append(path(f"M{cx - mw} {my - 4} Q{cx} {my + 12} {cx + mw} {my - 4}", "none", sw=5))
    elif mouth == "sad":
        g.append(path(f"M{cx - mw} {my + 6} Q{cx} {my - 8} {cx + mw} {my + 6}", "none", sw=5))
    elif mouth == "flat":
        g.append(line(cx - mw * 0.7, my, cx + mw * 0.7, my, sw=5))
    elif mouth == "o":
        g.append(ellipse(cx, my, mw * 0.4, mw * 0.5, "#5a2a2a", sw=4))
    elif mouth == "open":
        g.append(path(f"M{cx - mw} {my - 4} Q{cx} {my + 24} {cx + mw} {my - 4} Z", "#5a2a2a", sw=4))
    if age:
        g.append(path(f"M{cx - r * 0.35} {cy - r * 0.42} Q{cx} {cy - r * 0.5} {cx + r * 0.35} {cy - r * 0.42}",
                      "none", sw=3, op=0.6))
    # yanak
    for s in (-1, 1):
        g.append(f'<ellipse cx="{cx + s * r * 0.5}" cy="{my - r * 0.12}" rx="{r * 0.13}" ry="{r * 0.07}" fill="#f2b8a8" opacity="0.55"/>')
    return "\n".join(g)


def limb(x1, y1, x2, y2, color, w):
    """Konturlu kol: önce koyu kalın çizgi, üstüne renk."""
    return line(x1, y1, x2, y2, stroke=INK, sw=w + 2 * SW) + line(x1, y1, x2, y2, stroke=color, sw=w)


def hand(x, y, r=19):
    return circle(x, y, r, SKIN, sw=5)


# ---------------------------------------------------------------- GULÊ
GOLD, GOLD_D = "#d9a93a", "#a87a22"
KIRAS = "#8e1f2a"


def _kember(y, w):
    """Geniş, çok bantlı altın kemer."""
    g = [path(f"M{-w} {y - 16} Q0 {y - 6} {w} {y - 16} L{w + 2} {y + 16} Q0 {y + 26} {-w - 2} {y + 16} Z", GOLD, sw=5)]
    for k in (-8, 0, 8):
        g.append(path(f"M{-w + 2} {y + k} Q0 {y + k + 10} {w - 2} {y + k}", "none", stroke=GOLD_D, sw=2.5))
    return "".join(g)


def gule(mouth="smile", blink=False, look=0.0, arm="down", writing=False):
    """Genç, uzun boylu kız, ~575 px. Başı açık: bele kadar uzun siyah saç.
    Kırmızı kiras (sarkan kollar, altın sırma), geniş altın kemer, para kolye."""
    TALL = 1.22                      # vücut dikey uzatma
    hy = -392 * TALL - 8             # kafa merkezi
    hr = 70
    g = []
    # arka saç: bele kadar
    g.append(path(f"M{-hr + 2} {hy - 10} Q{-hr - 34} {hy + 120} {-hr - 18} {hy + 250} "
                  f"Q0 {hy + 280} {hr + 18} {hy + 250} Q{hr + 34} {hy + 120} {hr - 2} {hy - 10} Z", "#1d1a1c"))
    b = []
    # ayaklar
    b.append(ellipse(-34, -10, 30, 14, "#3a2a22", sw=5))
    b.append(ellipse(34, -10, 30, 14, "#3a2a22", sw=5))
    # kiras (yere kadar)
    b.append(path(f"M-74 -296 Q-118 -150 -130 -22 L130 -22 Q118 -150 74 -296 Z", KIRAS))
    b.append(path("M0 -200 L0 -26", "none", stroke="#6e1520", sw=3))
    # göğüs sırma işlemesi (altın kıvrımlar)
    for sgn in (-1, 1):
        b.append(path(f"M{sgn * 8} -292 Q{sgn * 40} -270 {sgn * 26} -246 Q{sgn * 10} -228 {sgn * 34} -212",
                      "none", stroke=GOLD, sw=4))
        b.append(path(f"M{sgn * 50} -284 Q{sgn * 66} -250 {sgn * 52} -218", "none", stroke=GOLD, sw=3))
    # para kolye
    for i in range(7):
        t = (i - 3) / 3
        b.append(circle(t * 34, -284 + (1 - t * t) * 22, 6.5, GOLD, sw=2.5))
    b.append(_kember(-196, 92))
    # kollar: geniş, sarkan kiras kolları
    if arm == "down":
        for s in (-1, 1):
            b.append(path(f"M{s * 72} -292 Q{s * 128} -230 {s * 132} -120 Q{s * 112} -96 {s * 86} -118 "
                          f"Q{s * 84} -190 {s * 58} -262 Z", KIRAS))
            b.append(path(f"M{s * 130} -126 Q{s * 112} -100 {s * 88} -120", "none", stroke=GOLD, sw=4))
            b.append(hand(s * 98, -132))
            b.append(path(f"M{s * 86} -144 L{s * 110} -144", "none", stroke=GOLD, sw=5))  # bilezik
    elif arm == "front":
        for s in (-1, 1):
            b.append(path(f"M{s * 72} -292 Q{s * 130} -230 {s * 110} -150 Q{s * 80} -140 {s * 40} -188 "
                          f"Q{s * 60} -230 {s * 56} -262 Z", KIRAS))
            b.append(path(f"M{s * 108} -156 Q{s * 76} -144 {s * 44} -186", "none", stroke=GOLD, sw=4))
            b.append(hand(s * 42, -196))
        if writing:
            b.append(line(52, -210, 78, -246, stroke="#c79a3a", sw=7))
            b.append(line(52, -210, 48, -202, stroke=INK, sw=4))
    elif arm == "phone":
        b.append(path("M-72 -292 Q-128 -230 -132 -120 Q-112 -96 -86 -118 Q-84 -190 -58 -262 Z", KIRAS))
        b.append(hand(-98, -132))
        b.append(path("M72 -292 Q126 -310 104 -362 L70 -352 Q82 -316 56 -276 Z", KIRAS))
        b.append(f'<rect x="66" y="-420" width="26" height="52" rx="6" fill="#30343a" stroke="{INK}" stroke-width="5"/>')
        b.append(hand(84, -372))
    # boyun (arka saçın önünde, elbisenin arkasında)
    g.append(path(f"M-20 {hy + hr - 14} L-22 {-296 * TALL + 14} L22 {-296 * TALL + 14} L20 {hy + hr - 14} Z", SKIN, sw=5))
    g.append(f'<g transform="scale(1,{TALL})">' + "\n".join(b) + "</g>")
    # kafa
    g.append(circle(0, hy, hr, SKIN))
    # ön saç: ortadan ayrık, omuzlara düşen iki tutam
    g.append(path(f"M{-hr - 2} {hy + 6} Q{-hr} {hy - hr - 12} 0 {hy - hr - 8} Q{hr} {hy - hr - 12} {hr + 2} {hy + 6} "
                  f"Q{hr - 12} {hy - 34} 4 {hy - hr + 6} Q{-hr + 12} {hy - 34} {-hr - 2} {hy + 6} Z", "#1d1a1c"))
    for sgn in (-1, 1):
        g.append(path(f"M{sgn * (hr - 4)} {hy - 6} Q{sgn * (hr + 16)} {hy + 70} {sgn * (hr - 6)} {hy + 150}",
                      "none", stroke=INK, sw=26))
        g.append(path(f"M{sgn * (hr - 4)} {hy - 6} Q{sgn * (hr + 16)} {hy + 70} {sgn * (hr - 6)} {hy + 150}",
                      "none", stroke="#1d1a1c", sw=15))
        g.append(circle(sgn * (hr - 2), hy + 22, 6, GOLD, sw=2.5))   # altın küpe
    g.append(face(0, hy + 8, hr, mouth, blink, look, age=0))
    return "<g>" + "\n".join(g) + "</g>"


# ---------------------------------------------------------------- HÊVÎ
def hevi(mouth="smile", blink=False, look=0.0, arm="down", phone=False):
    """Torun, ~330 px. İki örgü (kırmızı iplik), krem tişört, işlemeli kırmızı êlek."""
    g = []
    hy, hr = -262, 62
    # örgüler (kafanın arkasında)
    for s in (-1, 1):
        g.append(path(f"M{s * 50} {hy + 10} Q{s * 70} {hy + 70} {s * 58} {hy + 120}", "none", stroke=INK, sw=24))
        g.append(path(f"M{s * 50} {hy + 10} Q{s * 70} {hy + 70} {s * 58} {hy + 120}", "none", stroke="#1d1a1c", sw=14))
        g.append(f'<rect x="{s * 58 - 9}" y="{hy + 112}" width="18" height="8" rx="3" fill="#B3262E" stroke="{INK}" stroke-width="3"/>')
    # bacaklar + ayakkabı
    g.append(line(-18, -96, -20, -16, sw=14))
    g.append(line(18, -96, 20, -16, sw=14))
    g.append(ellipse(-24, -10, 20, 11, "#B3262E", sw=5))
    g.append(ellipse(24, -10, 20, 11, "#B3262E", sw=5))
    # etek
    g.append(path("M-46 -160 L-62 -84 L62 -84 L46 -160 Z", "#2c3a5a"))
    # tişört gövde
    g.append(path("M-48 -196 Q-52 -170 -48 -150 L48 -150 Q52 -170 48 -196 Q0 -206 -48 -196 Z", "#efe6d2"))
    # êlek (kırmızı, işlemeli)
    g.append(path("M-50 -198 Q-56 -170 -50 -146 L-14 -146 L-14 -200 Z", "#B3262E"))
    g.append(path("M50 -198 Q56 -170 50 -146 L14 -146 L14 -200 Z", "#B3262E"))
    for s in (-1, 1):
        cx = s * 32
        g.append(path(f"M{cx} -186 L{cx + 8} -174 L{cx} -162 L{cx - 8} -174 Z", "#d9a93a", sw=2.5))
        g.append(f'<circle cx="{cx}" cy="-174" r="2.6" fill="#2f5a3c"/>')
    # kollar
    if arm == "down":
        g.append(limb(-50, -192, -64, -132, "#efe6d2", 16))
        g.append(limb(50, -192, 64, -132, "#efe6d2", 16))
        g.append(hand(-66, -124, 15))
        g.append(hand(66, -124, 15))
    elif arm == "point":        # sağ el ileri (telefon gösterir / öğretir)
        g.append(limb(-50, -192, -64, -132, "#efe6d2", 16))
        g.append(limb(50, -192, 92, -196, "#efe6d2", 16))
        g.append(hand(-66, -124, 15))
        g.append(hand(100, -198, 15))
        if phone:
            g.append(f'<rect x="96" y="-240" width="34" height="58" rx="6" fill="#30343a" stroke="{INK}" stroke-width="5"/>')
            g.append(f'<rect x="101" y="-234" width="24" height="44" rx="3" fill="#9fd0e8"/>')
    # kafa + saç
    g.append(circle(0, hy, hr, SKIN))
    g.append(path(f"M{-hr} {hy + 2} Q{-hr + 2} {hy - hr - 8} 0 {hy - hr - 6} Q{hr - 2} {hy - hr - 8} {hr} {hy + 2} "
                  f"Q{hr - 14} {hy - 30} 10 {hy - 40} Q-30 {hy - 44} {-hr} {hy + 2} Z", "#1d1a1c"))
    g.append(face(0, hy + 8, hr, mouth, blink, look))
    return "<g>" + "\n".join(g) + "</g>"


# ---------------------------------------------------------------- RONÎ
def roni(mouth="flat", blink=False, look=0.0, outfit="is", arm="down"):
    """Oğul, ~510 px. outfit: 'is' (iş tulumu + puşî) | 'sal' (şal û şapik + pişt + puşî)."""
    g = []
    hy, hr = -428, 72
    if outfit == "is":
        body, legs, boot = "#8a8c88", "#7d7f7b", "#3a2a22"
    else:
        body, legs, boot = "#8fb0cf", "#8fb0cf", "#2c211b"
    # bacaklar
    if outfit == "is":
        g.append(path("M-56 -220 L-60 -24 L-10 -24 L-6 -200 L6 -200 L10 -24 L60 -24 L56 -220 Z", legs))
    else:   # şal: bol paça, bileğe doğru daralır
        g.append(path("M-60 -220 Q-78 -110 -50 -24 L-12 -24 Q-14 -110 0 -196 Q14 -110 12 -24 L50 -24 "
                      "Q78 -110 60 -220 Z", legs))
    g.append(ellipse(-36, -14, 32, 15, boot, sw=5))
    g.append(ellipse(36, -14, 32, 15, boot, sw=5))
    # gövde
    g.append(path("M-70 -350 Q-80 -280 -62 -214 L62 -214 Q80 -280 70 -350 Q0 -366 -70 -350 Z", body))
    if outfit == "is":
        # tulum askıları + cep
        g.append(line(-40, -352, -34, -250, stroke="#6c6e6a", sw=12))
        g.append(line(40, -352, 34, -250, stroke="#6c6e6a", sw=12))
        g.append(f'<rect x="-30" y="-292" width="60" height="44" rx="5" fill="#7d7f7b" stroke="{INK}" stroke-width="4"/>')
        g.append(f'<circle cx="-34" cy="-258" r="5" fill="#c9c9c2" stroke="{INK}" stroke-width="2"/>')
        g.append(f'<circle cx="34" cy="-258" r="5" fill="#c9c9c2" stroke="{INK}" stroke-width="2"/>')
        # toz lekeleri
        for x, y in ((-48, -120), (30, -80), (44, -300), (-20, -60)):
            g.append(f'<ellipse cx="{x}" cy="{y}" rx="12" ry="6" fill="#a9aaa4" opacity="0.7"/>')
    else:
        # şapik yaka çizgileri + pişt (çok renkli kuşak)
        g.append(path("M0 -360 L-22 -300 M0 -360 L22 -300", "none", sw=4))
        g.append(path("M-26 -358 L0 -300 L26 -358 Z", "#2a2a2e", sw=4))   # siyah gömlek
        g.append(path("M-70 -262 Q0 -246 70 -262 L68 -206 Q0 -192 -68 -206 Z", "url(#pist)", sw=5))
        g.append(path("M40 -214 Q60 -160 44 -120", "none", stroke="#8e1f2a", sw=3))  # pişt püskülü
    # kollar
    sleeve = "#5a6e86" if outfit == "is" else "#8fb0cf"
    if arm == "down":
        g.append(limb(-70, -340, -88, -228, sleeve, 26))
        g.append(limb(70, -340, 88, -228, sleeve, 26))
        g.append(hand(-90, -214, 20))
        g.append(hand(90, -214, 20))
    elif arm == "phone":
        g.append(limb(-70, -340, -88, -228, sleeve, 26))
        g.append(limb(70, -340, 104, -400, sleeve, 26))
        g.append(hand(-90, -214, 20))
        g.append(f'<rect x="72" y="-470" width="26" height="54" rx="6" fill="#30343a" stroke="{INK}" stroke-width="5"/>')
        g.append(hand(90, -420, 20))
    elif arm == "front":
        g.append(limb(-70, -340, -40, -250, sleeve, 26))
        g.append(limb(70, -340, 40, -250, sleeve, 26))
        g.append(hand(-34, -238, 20))
        g.append(hand(34, -238, 20))
    # puşî (boyun)
    g.append(path("M-58 -362 Q0 -330 58 -362 Q50 -338 0 -318 Q-50 -338 -58 -362 Z", "url(#puşi)"))
    g.append(path("M18 -334 L34 -282 L6 -296 Z", "url(#puşi)", sw=4))
    # kafa + saç + sakal
    g.append(circle(0, hy, hr, SKIN))
    g.append(path(f"M{-hr + 2} {hy - 8} Q{-hr + 4} {hy - hr - 10} 0 {hy - hr - 10} Q{hr - 4} {hy - hr - 10} {hr - 2} {hy - 8} "
                  f"L{hr - 14} {hy - 26} L{hr - 30} {hy - 34} L20 {hy - 38} L0 {hy - 32} L-24 {hy - 38} "
                  f"L{-hr + 26} {hy - 32} L{-hr + 12} {hy - 22} Z", "#1d1a1c"))
    for i in range(22):
        a = math.radians(30 + i * 120 / 21)
        rr = hr * (0.72 + 0.12 * ((i * 7) % 3) / 2)
        g.append(f'<circle cx="{math.cos(a) * rr:.1f}" cy="{hy + 8 + math.sin(a) * rr * 0.92:.1f}" r="2" fill="#6f6a66"/>')
    if outfit == "sal":
        g.append(path(f"M{-hr - 4} {hy - 20} Q{-hr} {hy - hr - 40} 0 {hy - hr - 44} Q{hr} {hy - hr - 40} {hr + 4} {hy - 20} "
                      f"Q0 {hy - 46} {-hr - 4} {hy - 20} Z", "url(#pusi_sor)"))
        g.append(path(f"M{-hr + 6} {hy - 40} Q0 {hy - 66} {hr - 6} {hy - 40}", "none", stroke="#6e1520", sw=3))
        g.append(path(f"M{hr - 10} {hy - 30} Q{hr + 20} {hy + 10} {hr + 8} {hy + 50}", "none", stroke="#b3262e", sw=10))
    g.append(face(0, hy + 4, hr, mouth, blink, look))
    return "<g>" + "\n".join(g) + "</g>"


def svg_doc(w, h, body, bg="#f3e6c9"):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'{DEFS}<rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>')


def place(g, x, y, s=1.0, flip=False):
    sx = -s if flip else s
    return f'<g transform="translate({x},{y}) scale({sx},{s})">{g}</g>'
