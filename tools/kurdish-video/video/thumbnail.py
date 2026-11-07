"""YouTube kapagi (4K, 3840x2160) — tamamen kodla cizilir.

    python3 video/thumbnail.py   -> output/Kapak_4K.png, output/Kapak_4K.jpg, output/Kapak_YouTube_1280.jpg
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "..", "output")
W, H = 3840, 2160

GOLD = (226, 176, 84)
CREAM = (246, 238, 220)
RED = (214, 58, 44)
NAVY_T, NAVY_B = (8, 12, 26), (28, 30, 50)


def F(name, size):
    return ImageFont.truetype(os.path.join(FD, name), size)


def lerp(a, b, f):
    return tuple(int(a[i] + (b[i] - a[i]) * f) for i in range(3))


def fit(text, fontfile, maxw, maxsize):
    s = maxsize
    while s > 40:
        f = F(fontfile, s)
        l, t, r, b = f.getbbox(text)
        if r - l <= maxw:
            return f
        s -= 6
    return F(fontfile, s)


def glow_text(canvas, xy, text, f, fill, glow, radius=40, stroke=0, stroke_fill=None, anchor="lm", glow_alpha=200):
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).text(xy, text, font=f, fill=glow + (glow_alpha,), anchor=anchor,
                               stroke_width=stroke + 10, stroke_fill=glow + (glow_alpha,))
    canvas.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius)))
    sh = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((xy[0] + 14, xy[1] + 22), text, font=f, fill=(0, 0, 0, 200), anchor=anchor,
                            stroke_width=stroke, stroke_fill=(0, 0, 0, 200))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
    ImageDraw.Draw(canvas).text(xy, text, font=f, fill=fill + (255,), anchor=anchor,
                                stroke_width=stroke, stroke_fill=(stroke_fill or fill) + (255,))


def background():
    bg = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        d.line([(0, y), (W, y)], fill=lerp(NAVY_T, NAVY_B, (y / H) ** 1.2))
    img = bg.convert("RGBA")
    rnd = random.Random(4)
    st = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(st)
    for _ in range(420):
        x, y, r = rnd.uniform(0, W), rnd.uniform(0, H * 0.7), rnd.uniform(1.5, 4.5)
        sd.ellipse((x - r, y - r, x + r, y + r), fill=lerp((120, 120, 140), GOLD, rnd.random()) + (int(rnd.uniform(60, 200)),))
    img.alpha_composite(st)
    # sicak isik: el yazmasinin arkasi
    gl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(gl).ellipse((150, 300, 2100, 2050), fill=(240, 160, 60, 120))
    img.alpha_composite(gl.filter(ImageFilter.GaussianBlur(260)))
    # isik huzmeleri
    rays = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    rd = ImageDraw.Draw(rays)
    cx, cy = 1100, 1080
    for k in range(18):
        a = k * math.tau / 18 + 0.15
        a2 = a + 0.07
        rd.polygon([(cx, cy), (cx + math.cos(a) * 2600, cy + math.sin(a) * 2600),
                    (cx + math.cos(a2) * 2600, cy + math.sin(a2) * 2600)], fill=(255, 200, 120, 22))
    img.alpha_composite(rays.filter(ImageFilter.GaussianBlur(30)))
    # daglar (Zagros silueti), uc katman
    for layer, (base, amp, col, seed) in enumerate([(1640, 380, (34, 34, 58), 1), (1780, 300, (24, 24, 42), 2),
                                                   (1930, 220, (14, 14, 26), 3)]):
        rr = random.Random(seed)
        pts = [(0, H)]
        x = 0
        y = base
        while x <= W:
            y = max(base - amp, min(base + amp * 0.4, y + rr.uniform(-amp * 0.35, amp * 0.35)))
            pts.append((x, y))
            x += rr.randint(110, 260)
        pts += [(W, H)]
        m = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(m).polygon(pts, fill=col + (255,))
        img.alpha_composite(m)
    # vinyet
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-W * 0.2, -H * 0.3, W * 1.2, H * 1.3), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(320))
    dark = Image.new("RGBA", (W, H), (2, 3, 8, 255))
    return Image.composite(img, dark, vig)


def manuscript():
    pw, ph = 1250, 880
    m = Image.new("RGBA", (pw + 200, ph + 200), (0, 0, 0, 0))
    sh = Image.new("RGBA", m.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle((100, 130, 100 + pw, 130 + ph), fill=(0, 0, 0, 220))
    m.alpha_composite(sh.filter(ImageFilter.GaussianBlur(40)))
    d = ImageDraw.Draw(m)
    d.rectangle((100, 100, 100 + pw, 100 + ph), fill=(232, 214, 172, 255))
    # eskitme lekeleri
    rnd = random.Random(9)
    stains = Image.new("RGBA", m.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(stains)
    for _ in range(26):
        x, y, r = rnd.uniform(120, 80 + pw), rnd.uniform(120, 80 + ph), rnd.uniform(30, 140)
        sd.ellipse((x - r, y - r, x + r, y + r), fill=(150, 110, 60, rnd.randint(20, 55)))
    m.alpha_composite(stains.filter(ImageFilter.GaussianBlur(30)))
    d = ImageDraw.Draw(m)
    d.rectangle((100, 100, 100 + pw, 100 + ph), outline=(130, 96, 58, 255), width=8)
    d.rectangle((140, 140, 60 + pw, 60 + ph), outline=(160, 120, 74, 255), width=3)
    for row in range(14):
        y = 210 + row * 52
        x = 200
        while x < pw - 20:
            ln = rnd.randint(70, 220)
            pts = [(x + i * 8, y + math.sin(i * 0.9 + rnd.random()) * 7) for i in range(ln // 8)]
            d.line(pts, fill=(80, 58, 40, 230), width=5)
            x += ln + rnd.randint(22, 46)
    # YASAK damgasi
    stw, sth = 1120, 400
    st = Image.new("RGBA", (stw, sth), (0, 0, 0, 0))
    sdd = ImageDraw.Draw(st)
    sdd.rounded_rectangle((16, 16, stw - 16, sth - 16), 30, outline=RED + (255,), width=26)
    sdd.rounded_rectangle((52, 52, stw - 52, sth - 52), 20, outline=RED + (255,), width=8)
    sdd.text((stw // 2, sth // 2 + 6), "YASAK", font=F("Inter_900Black.ttf", 250), fill=RED + (255,), anchor="mm")
    # murekkep dokusu: rastgele bosluklar
    holes = Image.new("L", (stw, sth), 255)
    hd = ImageDraw.Draw(holes)
    for _ in range(900):
        x, y, r = rnd.uniform(0, stw), rnd.uniform(0, sth), rnd.uniform(2, 9)
        hd.ellipse((x - r, y - r, x + r, y + r), fill=rnd.randint(0, 120))
    a = ImageChops.multiply(st.getchannel("A"), holes.filter(ImageFilter.GaussianBlur(1.5)))
    st.putalpha(a.point(lambda v: int(v * 0.92)))
    st = st.rotate(-16, expand=True, resample=Image.BICUBIC)
    m.alpha_composite(st, (100 + pw // 2 - st.width // 2, 100 + ph // 2 - st.height // 2))
    return m.rotate(5, expand=True, resample=Image.BICUBIC)


def main():
    img = background()
    man = manuscript()
    img.alpha_composite(man, (1110 - man.width // 2, 1060 - man.height // 2))

    # metin blogu (sag)
    X0, X1 = 2120, 3720
    maxw = X1 - X0
    f1 = fit("100 YIL", "Inter_900Black.ttf", maxw, 420)
    f2 = fit("YASAKLANDI", "Inter_900Black.ttf", maxw, 420)
    f3 = fit("AMA SUSMADI", "Inter_900Black.ttf", maxw, 360)
    glow_text(img, (X0, 470), "100 YIL", f1, CREAM, (255, 200, 130), radius=50, glow_alpha=110)
    glow_text(img, (X0, 820), "YASAKLANDI", f2, RED, (255, 70, 40), radius=60, stroke=6, stroke_fill=(120, 20, 14),
              glow_alpha=150)
    # ince altin cizgi + "..."
    d = ImageDraw.Draw(img)
    d.line([(X0 + 10, 1050), (X1, 1050)], fill=GOLD + (200,), width=8)
    glow_text(img, (X0, 1250), "AMA SUSMADI", f3, GOLD, (255, 190, 80), radius=60, glow_alpha=160)

    # alt satir: KURTCE
    fk = F("PlayfairDisplay_700Bold.ttf", 190)
    fi = F("PlayfairDisplay_600SemiBold_Italic.ttf", 96)
    glow_text(img, (X0, 1560), "KÜRTÇE", fk, CREAM, (255, 210, 140), radius=40, glow_alpha=90)
    d = ImageDraw.Draw(img)
    d.text((X0 + 6, 1730), "Mezopotamya'nın kadim dili", font=fi, fill=GOLD + (255,), anchor="lm")

    # sol ust: kucuk Kurtce imza
    d.text((150, 150), "ZIMAN JIYAN E", font=F("Inter_800ExtraBold.ttf", 64), fill=GOLD + (230,), anchor="lm")
    d.line([(150, 205), (690, 205)], fill=GOLD + (200,), width=5)

    os.makedirs(OUT, exist_ok=True)
    rgb = img.convert("RGB")
    rgb.save(os.path.join(OUT, "Kapak_4K.png"), optimize=True)
    rgb.save(os.path.join(OUT, "Kapak_4K.jpg"), quality=93)
    rgb.resize((1280, 720), Image.LANCZOS).save(os.path.join(OUT, "Kapak_YouTube_1280.jpg"), quality=92)
    print("ok")


if __name__ == "__main__":
    main()
