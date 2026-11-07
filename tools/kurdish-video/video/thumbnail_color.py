"""Renkli YouTube kapagi (4K, 3840x2160) — tamamen kodla cizilir.

    python3 video/thumbnail_color.py -> output/Kapak2_4K.png, output/Kapak2_4K.jpg, output/Kapak2_YouTube_1280.jpg
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "..", "output")
W, H = 3840, 2160
SUN = (1180, 1420)

YELLOW = (255, 214, 64)
RED = (232, 42, 48)
GREEN = (64, 232, 120)
WHITE = (255, 255, 255)
INK = (14, 8, 20)


def F(name, size):
    return ImageFont.truetype(os.path.join(FD, name), size)


def lerp(a, b, f):
    f = max(0.0, min(1.0, f))
    return tuple(int(a[i] + (b[i] - a[i]) * f) for i in range(len(a)))


def blur_layer(size, draw_fn, radius):
    l = Image.new("RGBA", size, (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(l))
    return l.filter(ImageFilter.GaussianBlur(radius))


def sky():
    """Gunes merkezli radyal gun batimi: altin -> turuncu -> magenta -> mor -> lacivert."""
    small = Image.new("RGB", (W // 4, H // 4))
    px = small.load()
    stops = [(0.00, (255, 246, 196)), (0.08, (255, 206, 92)), (0.20, (255, 128, 44)),
             (0.36, (226, 52, 92)), (0.55, (120, 30, 120)), (0.78, (42, 18, 84)), (1.00, (10, 8, 34))]
    sx, sy = SUN[0] / 4, SUN[1] / 4
    maxd = math.hypot(W / 4, H / 4)
    for y in range(H // 4):
        for x in range(W // 4):
            d = math.hypot((x - sx) * 0.85, (y - sy) * 1.15) / maxd
            for i in range(len(stops) - 1):
                if stops[i][0] <= d <= stops[i + 1][0]:
                    f = (d - stops[i][0]) / (stops[i + 1][0] - stops[i][0])
                    px[x, y] = lerp(stops[i][1], stops[i + 1][1], f)
                    break
            else:
                px[x, y] = stops[-1][1]
    return small.resize((W, H), Image.BICUBIC).convert("RGBA")


def rays(img):
    def fn(d):
        cx, cy = SUN
        for k in range(28):
            a = k * math.tau / 28 + 0.05
            a2 = a + 0.06
            d.polygon([(cx, cy), (cx + math.cos(a) * 4200, cy + math.sin(a) * 4200),
                       (cx + math.cos(a2) * 4200, cy + math.sin(a2) * 4200)], fill=(255, 230, 160, 34))
    img.alpha_composite(blur_layer(img.size, fn, 22))


def sun(img):
    cx, cy = SUN
    img.alpha_composite(blur_layer(img.size, lambda d: d.ellipse((cx - 900, cy - 900, cx + 900, cy + 900),
                                                                  fill=(255, 190, 80, 110)), 180))
    img.alpha_composite(blur_layer(img.size, lambda d: d.ellipse((cx - 560, cy - 560, cx + 560, cy + 560),
                                                                  fill=(255, 220, 120, 200)), 60))
    ImageDraw.Draw(img).ellipse((cx - 470, cy - 470, cx + 470, cy + 470), fill=(255, 236, 170, 255))


def mountains(img):
    layers = [(1520, 420, (150, 40, 90), 1), (1700, 360, (92, 26, 84), 2), (1880, 300, (52, 16, 60), 3),
              (2030, 200, (22, 8, 32), 4)]
    for base, amp, col, seed in layers:
        rr = random.Random(seed)
        pts = [(0, H)]
        x, y = 0, base
        while x <= W + 300:
            y = max(base - amp, min(base + amp * 0.35, y + rr.uniform(-amp * 0.4, amp * 0.4)))
            pts.append((x, y))
            x += rr.randint(120, 300)
        pts.append((W, H))
        m = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(m).polygon(pts, fill=col + (255,))
        img.alpha_composite(m)


def gradient_text(img, xy, text, f, top, bottom, stroke=0, stroke_col=INK, anchor="mm", glow=None, shadow=True):
    W_, H_ = img.size
    mask = Image.new("L", (W_, H_), 0)
    ImageDraw.Draw(mask).text(xy, text, font=f, fill=255, anchor=anchor)
    l, t, r, b = mask.getbbox()
    if glow:
        img.alpha_composite(blur_layer(img.size, lambda d: d.text(xy, text, font=f, fill=glow + (200,), anchor=anchor,
                                                                    stroke_width=stroke + 30,
                                                                    stroke_fill=glow + (200,)), 70))
    if shadow:
        img.alpha_composite(blur_layer(img.size, lambda d: d.text((xy[0] + 18, xy[1] + 26), text, font=f,
                                                                    fill=(0, 0, 0, 210), anchor=anchor,
                                                                    stroke_width=stroke, stroke_fill=(0, 0, 0, 210)), 14))
    if stroke:
        ImageDraw.Draw(img).text(xy, text, font=f, fill=stroke_col + (255,), anchor=anchor, stroke_width=stroke,
                                 stroke_fill=stroke_col + (255,))
    grad = Image.new("RGBA", (W_, H_), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    for y in range(t, b + 1):
        gd.line([(l, y), (r, y)], fill=lerp(top, bottom, (y - t) / max(1, b - t)) + (255,))
    img.paste(grad, (0, 0), mask)


def chain_link(w, h, thick, angle):
    """Metalik zincir halkasi (acilmis/kirik)."""
    pad = 40
    im = Image.new("RGBA", (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    box = (pad, pad, pad + w, pad + h)
    d.rounded_rectangle(box, h // 2, outline=(40, 30, 40, 255), width=thick + 10)
    d.rounded_rectangle(box, h // 2, outline=(150, 140, 150, 255), width=thick)
    d.rounded_rectangle((pad + 8, pad + 8, pad + w - 8, pad + h - 8), h // 2 - 8, outline=(235, 230, 235, 255),
                        width=max(4, thick // 4))
    # kirik bosluk
    d.rectangle((pad + w - thick * 2 - 30, pad - 5, pad + w - 30, pad + h // 2 - 10), fill=(0, 0, 0, 0))
    return im.rotate(angle, expand=True, resample=Image.BICUBIC)


def _link(face, angle, L=230, Hh=120, T=30):
    """Tek zincir halkasi: face=True ise acik halka (on yuz), degilse yandan gorunen ince halka."""
    pad = 50
    im = Image.new("RGBA", (L + pad * 2, Hh + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if face:
        box = (pad, pad, pad + L, pad + Hh)
        d.rounded_rectangle(box, Hh // 2, outline=(30, 22, 34, 255), width=T + 12)
        d.rounded_rectangle(box, Hh // 2, outline=(128, 122, 136, 255), width=T)
        d.rounded_rectangle((pad + 6, pad + 6, pad + L - 6, pad + Hh - 6), Hh // 2 - 6, outline=(214, 210, 222, 255),
                            width=max(5, T // 3))
        d.rounded_rectangle((pad + 10, pad + 10, pad + L - 10, pad + Hh // 2), Hh // 3, outline=(250, 248, 255, 200),
                            width=4)
    else:
        bh = T + 10
        y0 = pad + Hh // 2 - bh // 2
        d.rounded_rectangle((pad, y0 - 6, pad + L, y0 + bh + 6), bh, fill=(30, 22, 34, 255))
        d.rounded_rectangle((pad + 4, y0, pad + L - 4, y0 + bh), bh, fill=(140, 134, 148, 255))
        d.rounded_rectangle((pad + 16, y0 + 5, pad + L - 16, y0 + bh // 2), bh, fill=(232, 228, 238, 255))
    return im.rotate(angle, expand=True, resample=Image.BICUBIC)


def _paste_shadowed(img, im, x, y):
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sh.alpha_composite(im, (int(x - im.width / 2 + 18), int(y - im.height / 2 + 26)))
    sh.putalpha(sh.getchannel("A").point(lambda v: int(v * 0.55)))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    img.alpha_composite(im, (int(x - im.width / 2), int(y - im.height / 2)))


def chains(img):
    rnd = random.Random(21)
    step = 168
    # sol zincir: kenardan yaziya dogru gelir, yazinin yaninda kopar
    for (x0, y0), (x1, y1) in (((-60, 760), (330, 900)), ((2330, 760), (2060, 900))):
        ang = math.degrees(math.atan2(-(y1 - y0), x1 - x0))
        n = max(2, int(math.dist((x0, y0), (x1, y1)) / step))
        for i in range(n + 1):
            f = i / n
            x, y = x0 + (x1 - x0) * f, y0 + (y1 - y0) * f
            _paste_shadowed(img, _link(i % 2 == 0, ang), x, y)
    # kopan halkalar: yazinin cevresine sacilir
    for x, y, a, face in ((470, 1130, 35, True), (1890, 1150, -40, True), (560, 700, -20, False), (1820, 690, 25, False)):
        _paste_shadowed(img, _link(face, a, L=200, Hh=104, T=26), x, y)
    # kivilcimlar
    sp = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sp)
    for _ in range(160):
        a = rnd.uniform(0, math.tau)
        r = rnd.uniform(420, 1100)
        x, y = 1180 + math.cos(a) * r * 1.2, 1010 + math.sin(a) * r * 0.6
        sz = rnd.uniform(3, 11)
        sd.ellipse((x - sz, y - sz, x + sz, y + sz), fill=lerp((255, 200, 80), (255, 255, 230), rnd.random()) + (230,))
    img.alpha_composite(sp.filter(ImageFilter.GaussianBlur(1.5)))
    img.alpha_composite(sp.filter(ImageFilter.GaussianBlur(14)))


def banner(img, cx, cy, text, f, angle=-4):
    l, t, r, b = f.getbbox(text)
    tw, th = r - l, b - t
    bw, bh = tw + 180, th + 120
    im = Image.new("RGBA", (bw + 120, bh + 120), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle((60, 60, 60 + bw, 60 + bh), fill=RED + (255,))
    d.rectangle((60, 60, 60 + bw, 60 + 22), fill=(255, 90, 80, 255))
    d.rectangle((60, 60 + bh - 22, 60 + bw, 60 + bh), fill=(150, 18, 24, 255))
    d.text((60 + bw / 2, 60 + bh / 2), text, font=f, fill=WHITE + (255,), anchor="mm")
    im = im.rotate(angle, expand=True, resample=Image.BICUBIC)
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sh.alpha_composite(im, (int(cx - im.width / 2 + 24), int(cy - im.height / 2 + 34)))
    sh.putalpha(sh.getchannel("A").point(lambda v: int(v * 0.6)))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(18)))
    img.alpha_composite(im, (int(cx - im.width / 2), int(cy - im.height / 2)))


def fit(text, name, maxw, size):
    while size > 40:
        f = F(name, size)
        l, t, r, b = f.getbbox(text)
        if r - l <= maxw:
            return f
        size -= 8
    return F(name, size)


def main():
    img = sky()
    rays(img)
    sun(img)
    mountains(img)
    chains(img)

    # KURTCE: gunesin onunde altin, parlayan
    fk = F("PlayfairDisplay_700Bold.ttf", 400)
    gradient_text(img, (1180, 1010), "KÜRTÇE", fk, (255, 248, 200), (230, 140, 30), stroke=14, stroke_col=(70, 20, 30),
                  glow=(255, 150, 40))
    fsub = F("PlayfairDisplay_600SemiBold_Italic.ttf", 110)
    gradient_text(img, (1180, 1290), "Mezopotamya'nın kadim dili", fsub, (255, 255, 255), (255, 225, 190),
                  stroke=6, stroke_col=(80, 20, 50))

    # HOOK (sag)
    cx = 3010
    f1 = fit("100 YIL", "Inter_900Black.ttf", 1500, 470)
    gradient_text(img, (cx, 430), "100 YIL", f1, (255, 240, 120), (255, 176, 20), stroke=22, stroke_col=INK,
                  glow=(255, 200, 40))
    fb = fit("YASAKLANDI", "Inter_900Black.ttf", 1450, 300)
    banner(img, cx, 900, "YASAKLANDI", fb, angle=-4)
    fa = F("Inter_900Black.ttf", 200)
    gradient_text(img, (cx, 1270), "AMA", fa, (255, 255, 255), (235, 225, 240), stroke=16, stroke_col=INK)
    f3 = fit("YOK OLMADI!", "Inter_900Black.ttf", 1560, 340)
    gradient_text(img, (cx, 1520), "YOK OLMADI!", f3, (170, 255, 190), (30, 200, 100), stroke=20, stroke_col=INK,
                  glow=(60, 255, 140))

    # alt serit
    d = ImageDraw.Draw(img)
    d.text((cx, 1850), "ZIMAN JIYAN E", font=F("Inter_800ExtraBold.ttf", 92), fill=(255, 226, 150, 255), anchor="mm")
    d.line([(cx - 420, 1920), (cx + 420, 1920)], fill=(255, 200, 90, 220), width=6)

    os.makedirs(OUT, exist_ok=True)
    rgb = img.convert("RGB")
    rgb.save(os.path.join(OUT, "Kapak2_4K.png"), optimize=True)
    rgb.save(os.path.join(OUT, "Kapak2_4K.jpg"), quality=93)
    rgb.resize((1280, 720), Image.LANCZOS).save(os.path.join(OUT, "Kapak2_YouTube_1280.jpg"), quality=92)
    print("ok")


if __name__ == "__main__":
    main()
