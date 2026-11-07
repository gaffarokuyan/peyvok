"""Kurtce videosu: butun gorseller ve animasyonlar kodla uretilir (Pillow + ffmpeg)."""
import json, math, os, random, re, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from align import norm  # noqa: E402

W, H, FPS = 1920, 1080, 30
# Altyazi videoya gomulsun mu? Varsayilan: hayir (ayri .srt dosyasi verilir). BURN_SUBS=1 ile gomulur.
BURN_SUBS = os.environ.get("BURN_SUBS", "0") == "1"
FD = os.path.join(HERE, "fonts")
F = {
    "serif": f"{FD}/PlayfairDisplay_600SemiBold.ttf",
    "serif_b": f"{FD}/PlayfairDisplay_700Bold.ttf",
    "serif_i": f"{FD}/PlayfairDisplay_600SemiBold_Italic.ttf",
    "serif_m": f"{FD}/PlayfairDisplay_500Medium.ttf",
    "sans": f"{FD}/Inter_500Medium.ttf",
    "sans_r": f"{FD}/Inter_400Regular.ttf",
    "sans_b": f"{FD}/Inter_600SemiBold.ttf",
    "arabic": f"{FD}/Amiri_700Bold.ttf",
}
_fc = {}


def font(k, s):
    if (k, s) not in _fc:
        _fc[(k, s)] = ImageFont.truetype(F[k], int(s * 0.84) if k.startswith("serif") else s)
    return _fc[(k, s)]


BG_TOP, BG_BOT = (11, 16, 32), (24, 28, 44)
BGC = (16, 21, 37)
GOLD = (214, 166, 82)
GOLD_D = (150, 112, 52)
CREAM = (238, 229, 210)
MUTED = (146, 156, 178)
RED = (198, 78, 62)
BLUE = (96, 150, 206)
GREEN = (118, 178, 124)
INK = (24, 22, 30)
PARCH = (226, 210, 174)

DATA = json.load(open(os.path.join(HERE, "..", "data", "aligned.json")))
SECS = DATA["sections"]
TOTAL = DATA["total"]
DUR = TOTAL + 1.2


# ---------------------------------------------------------------- zaman yardimcilari
def _find(sec, phrase, occ=1):
    toks = [norm(t[0]) for t in SECS[sec]["tokens"]]
    ph = [norm(p) for p in phrase.split()]
    ph = [p for p in ph if p]
    c = 0
    for i in range(len(toks) - len(ph) + 1):
        ok = all(toks[i + k] == ph[k] for k in range(len(ph) - 1)) and toks[i + len(ph) - 1].startswith(ph[-1])
        if ok:
            c += 1
            if c == occ:
                return i, i + len(ph) - 1
    raise KeyError(f"{sec}: '{phrase}' bulunamadi")


def T(sec, phrase, occ=1):
    i, _ = _find(sec, phrase, occ)
    return SECS[sec]["tokens"][i][1]


def TE(sec, phrase, occ=1):
    _, j = _find(sec, phrase, occ)
    return SECS[sec]["tokens"][j][2]


def S0(sec):
    return SECS[sec]["start"]


def S1(sec):
    return SECS[sec]["end"]


def ease(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def lerp(a, b, f):
    return tuple(int(a[i] + (b[i] - a[i]) * f) for i in range(3))


# ---------------------------------------------------------------- sprite uretimi
def text_img(text, k, size, color, shadow=True, spacing=0):
    f = font(k, size)
    l, t, r, b = f.getbbox(text)
    pad = 24
    w, h = r - l + pad * 2, b - t + pad * 2
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    if shadow:
        sh = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((pad - l, pad - t + 3), text, font=f, fill=(0, 0, 0, 170))
        im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6)))
    ImageDraw.Draw(im).text((pad - l, pad - t), text, font=f, fill=color + (255,))
    return im


def rich_img(parts, k, size, shadow=True):
    """parts: [(metin, renk), ...] tek satir, karisik renkli."""
    f = font(k, size)
    full = "".join(p[0] for p in parts)
    l, t, r, b = f.getbbox(full)
    pad = 24
    w, h = r - l + pad * 2, b - t + pad * 2
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    if shadow:
        sh = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        ImageDraw.Draw(sh).text((pad - l, pad - t + 3), full, font=f, fill=(0, 0, 0, 170))
        im = Image.alpha_composite(im, sh.filter(ImageFilter.GaussianBlur(6)))
    d = ImageDraw.Draw(im)
    x = pad - l
    for txt, col in parts:
        d.text((x, pad - t), txt, font=f, fill=col + (255,))
        x += f.getlength(txt)
    return im


def stack(imgs, gap=0, align="center"):
    w = max(i.width for i in imgs)
    h = sum(i.height for i in imgs) + gap * (len(imgs) - 1)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    y = 0
    for i in imgs:
        x = (w - i.width) // 2 if align == "center" else 0
        out.alpha_composite(i, (x, y))
        y += i.height + gap
    return out


def card(content, pad=(40, 28), fill=(26, 32, 52, 230), border=GOLD_D, radius=22, bw=2, w=None, h=None):
    cw = w or content.width + pad[0] * 2
    ch = h or content.height + pad[1] * 2
    im = Image.new("RGBA", (cw + 40, ch + 40), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((20, 26, 20 + cw, 26 + ch), radius, fill=(0, 0, 0, 150))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)))
    ImageDraw.Draw(im).rounded_rectangle((20, 20, 20 + cw, 20 + ch), radius, fill=fill,
                                         outline=border + (255,) if border else None, width=bw)
    im.alpha_composite(content, (20 + (cw - content.width) // 2, 20 + (ch - content.height) // 2))
    return im


def pill(text, fill, tcol, border=None, size=34, k="sans_b", padx=34, pady=16):
    t = text_img(text, k, size, tcol, shadow=False)
    return card(t, pad=(padx - 20, pady - 16), fill=fill + (255,) if len(fill) == 3 else fill,
                border=border, radius=40, bw=2)


# ---------------------------------------------------------------- elemanlar
class Sprite:
    def __init__(self, img, x, y, t0, t1, fade=0.6, dy=24, fout=0.5, scale_in=None):
        self.img, self.x, self.y, self.t0, self.t1 = img, x, y, t0, t1
        self.fade, self.dy, self.fout, self.scale_in = fade, dy, fout, scale_in
        self.alpha = img.getchannel("A")
        self.cache = {}

    def mask(self, a):
        lv = int(round(a * 20))
        if lv not in self.cache:
            f = lv / 20
            self.cache[lv] = self.alpha.point(lambda v: int(v * f))
        return self.cache[lv]

    def draw(self, fr, t):
        if t < self.t0 or t > self.t1 + self.fout:
            return
        ai = ease((t - self.t0) / self.fade)
        ao = 1 - ease((t - self.t1) / self.fout) if t > self.t1 else 1
        a = ai * ao
        if a <= 0.02:
            return
        img = self.img
        if self.scale_in and t - self.t0 < 0.35:
            s = self.scale_in + (1 - self.scale_in) * ease((t - self.t0) / 0.35)
            img = img.resize((max(1, int(img.width * s)), max(1, int(img.height * s))), Image.BILINEAR)
            m = img.getchannel("A").point(lambda v: int(v * a))
        else:
            m = self.mask(a)
        y = self.y + int(self.dy * (1 - ai))
        fr.paste(img, (int(self.x - img.width / 2), int(y - img.height / 2)), m)


class Line:
    """Kademeli cizilen cizgi; renk arka plana dogru solarak kaybolur."""

    def __init__(self, pts, t0, t1, color=GOLD_D, width=3, dur=0.7, fout=0.5):
        self.pts, self.t0, self.t1, self.color, self.width, self.dur, self.fout = pts, t0, t1, color, width, dur, fout
        L = [0]
        for i in range(1, len(pts)):
            L.append(L[-1] + math.dist(pts[i - 1], pts[i]))
        self.L = L

    def draw(self, fr, t, d):
        if t < self.t0 or t > self.t1 + self.fout:
            return
        p = ease((t - self.t0) / self.dur)
        ao = 1 - ease((t - self.t1) / self.fout) if t > self.t1 else 1
        col = lerp(BGC, self.color, ao * min(1, (t - self.t0) / 0.15))
        target = self.L[-1] * p
        out = [self.pts[0]]
        for i in range(1, len(self.pts)):
            if self.L[i] <= target:
                out.append(self.pts[i])
            else:
                seg = self.L[i] - self.L[i - 1]
                f = (target - self.L[i - 1]) / seg if seg else 0
                a, b = self.pts[i - 1], self.pts[i]
                out.append((a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
                break
        if len(out) > 1:
            d.line(out, fill=col, width=self.width, joint="curve")


class Fx:
    """Kare kare cizim yapan ozel efekt (fonksiyon)."""

    def __init__(self, fn, t0, t1, fout=0.6):
        self.fn, self.t0, self.t1, self.fout = fn, t0, t1, fout

    def draw(self, fr, t, d):
        if t < self.t0 or t > self.t1 + self.fout:
            return
        ai = ease((t - self.t0) / 0.6)
        ao = 1 - ease((t - self.t1) / self.fout) if t > self.t1 else 1
        self.fn(fr, d, t, ai * ao)


SPRITES, LINES = [], []


def add(img, x, y, t0, t1, **kw):
    SPRITES.append(Sprite(img, x, y, t0, t1, **kw))


def line(pts, t0, t1, **kw):
    LINES.append(Line(pts, t0, t1, **kw))


def fx(fn, t0, t1, **kw):
    LINES.append(Fx(fn, t0, t1, **kw))


def bezier(p0, p1, p2, p3, n=60):
    out = []
    for i in range(n + 1):
        u = i / n
        x = (1 - u) ** 3 * p0[0] + 3 * (1 - u) ** 2 * u * p1[0] + 3 * (1 - u) * u ** 2 * p2[0] + u ** 3 * p3[0]
        y = (1 - u) ** 3 * p0[1] + 3 * (1 - u) ** 2 * u * p1[1] + 3 * (1 - u) * u ** 2 * p2[1] + u ** 3 * p3[1]
        out.append((x, y))
    return out


def chapter(sec, num, title):
    t0, t1 = S0(sec), S1(sec)
    im = rich_img([(f"{num}  ", GOLD), (title, MUTED)], "sans_b", 26, shadow=False)
    add(im, 110 + im.width // 2, 82, t0 + 0.1, t1, dy=0)
    line([(130, 108), (330, 108)], t0 + 0.2, t1, color=GOLD_D, width=2, dur=0.8)


# ---------------------------------------------------------------- arka plan
def make_bg():
    bg = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(H):
        d.line([(0, y), (W, y)], fill=lerp(BG_TOP, BG_BOT, y / H))
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-W * 0.25, -H * 0.35, W * 1.25, H * 1.35), fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(160))
    dark = Image.new("RGB", (W, H), (4, 6, 12))
    return Image.composite(bg, dark, vig)


BG = None
rnd = random.Random(7)
PARTS = [(rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(0.6, 2.2), rnd.uniform(4, 14), rnd.uniform(0, 6.28))
         for _ in range(70)]


def particles(d, t):
    for x0, y0, r, sp, ph in PARTS:
        x = (x0 + math.sin(t * 0.13 + ph) * 30) % W
        y = (y0 - t * sp) % H
        tw = 0.25 + 0.25 * (1 + math.sin(t * 1.3 + ph))
        c = lerp(BGC, GOLD, tw * 0.55)
        d.ellipse((x - r, y - r, x + r, y + r), fill=c)


# ---------------------------------------------------------------- altyazi
SUBS = []
NOSUB = []  # altyazi gosterilmeyecek zaman araliklari


DISPLAY = [("Xelîl-ê", "Xelîlê"), ("İşaratül İcaz", "İşaratü'l-İ'caz"), ("Medresetüz Zehra", "Medresetü'z-Zehra"),
           ('"Arabi vacib, Kürdi caiz, Türki lazım."', "“Arabî vâcib, Kürdî câiz, Türkî lâzım.”"),
           ("Pyotr Lerh", "Pyotr Lerch"), ("Bin sekiz yüz elli yedide", "1857'de"), ("bin altı yüz seksen üçte", "1683'te"), ("Yirminci yüzyılda", "20. yüzyılda"), ("bin dokuz yüz on altıda", "1916'da"), ("Vladimir Minorski", "Vladimir Minorsky"), ("bin dokuz yüz otuz beşte", "1935'te"), ("bin dokuz yüz altmış birde", "1961'de"), ("bin yedi yüz seksen yedide", "1787'de"), ("Albert Sotsin", "Albert Socin"), ("Ferdinand Yusti", "Ferdinand Justi"), ("Rojer Lesko", "Roger Lescot"), ("bin dokuz yüz seksen üçte", "1983'te"), ("David Makenzi", "D. N. MacKenzie"), ("bin dokuz yüz yetmişlerden", "1970'lerden"), ("bin sekiz yüz ellili yıllarda", "1850'li yıllarda"),
           ("bin sekiz yüz yetmiş dokuzda", "1879'da"), ("bin altı yüz seksen üç yılında", "1683 yılında"),
           ("Bin dokuz yüz sekizde", "1908'de"), ("on dokuzuncu yüzyılda", "19. yüzyılda"),
           ("kırk milyonu", "40 milyonu"), ('"nyu"', '"new"'), ('"neym"', '"name"'),
           ("Kürd Teavün ve Terakki", "Kürd Teâvün ve Terakkî"), ("Sankt Peterburg", "Sankt-Peterburg"),
           ("Arabi", "Arabî"), ("yirmi üç ila yirmi beş milyon", "23-25 milyon"), ("kırk ila elli milyon", "40-50 milyon"), ("sekiz ila on milyon", "8-10 milyon"),
           ("altı ila sekiz milyon", "6-8 milyon"), ("iki ila üç milyon", "2-3 milyon")]


def disp(txt):
    for a_, b_ in DISPLAY:
        txt = txt.replace(a_, b_)
    out, op = [], True
    for c in txt:
        if c == '"':
            out.append("“" if op else "”")
            op = not op
        else:
            out.append(c)
    return "".join(out)


def build_subs():
    for name, sec in SECS.items():
        toks = sec["tokens"]
        chunk = []
        for i, (w, a, b) in enumerate(toks):
            chunk.append((w, a, b))
            txt = " ".join(c[0] for c in chunk)
            end_sent = re.search(r'[.!?:]["”]?$', w) is not None
            soft = w.endswith(",") or w.endswith(";")
            if end_sent or (soft and len(txt) > 55) or len(txt) > 95:
                SUBS.append([disp(txt), chunk[0][1], chunk[-1][2]])
                chunk = []
        if chunk:
            SUBS.append([disp(" ".join(c[0] for c in chunk)), chunk[0][1], chunk[-1][2]])
    for i, s in enumerate(SUBS):
        nxt = SUBS[i + 1][1] if i + 1 < len(SUBS) else s[2] + 1.0
        s[2] = min(nxt - 0.05, s[2] + 0.9)


def wrap(text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        test = (cur + " " + w).strip()
        if f.getlength(test) <= maxw:
            cur = test
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


_sub_cache = {}


def sub_img(text):
    if text not in _sub_cache:
        f = font("sans", 38)
        lines = wrap(text, f, 1500)
        lh = 52
        w = int(max(f.getlength(l) for l in lines)) + 64
        h = lh * len(lines) + 30
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, w, h), 14, fill=(6, 8, 16, 170))
        for i, l in enumerate(lines):
            lw = f.getlength(l)
            d.text(((w - lw) / 2, 14 + i * lh), l, font=f, fill=(245, 240, 228, 255))
        _sub_cache[text] = Sprite(im, W // 2, 0, 0, 0)
    return _sub_cache[text]


def draw_sub(fr, t):
    if any(a <= t < b for a, b in NOSUB):
        return
    for txt, a, b in SUBS:
        if a - 0.1 <= t <= b + 0.15:
            sp = sub_img(txt)
            fa = min(1, (t - a + 0.1) / 0.15, (b + 0.15 - t) / 0.15)
            m = sp.mask(max(0, fa))
            fr.paste(sp.img, (W // 2 - sp.img.width // 2, 1030 - sp.img.height), m)
            break


def write_srt(path):
    def ts(x):
        h, m = int(x // 3600), int(x % 3600 // 60)
        s = x % 60
        return f"{h:02}:{m:02}:{int(s):02},{int((s % 1) * 1000):03}"
    with open(path, "w") as f:
        for i, (txt, a, b) in enumerate(SUBS, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{txt}\n\n")


# ================================================================ SAHNELER
def scene_01():
    s = "01_giris"
    e = S1(s) + 0.3
    add(text_img("Bir dil düşünün...", "serif_i", 104, CREAM), W // 2, 470, T(s, "Bir dil"), T(s, "Son yüz") - 0.3, fout=0.4)

    # el yazmasi
    rnd = random.Random(3)
    pw, ph = 760, 500
    man = Image.new("RGBA", (pw + 60, ph + 60), (0, 0, 0, 0))
    sh = Image.new("RGBA", man.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle((30, 38, 30 + pw, 38 + ph), fill=(0, 0, 0, 160))
    man.alpha_composite(sh.filter(ImageFilter.GaussianBlur(14)))
    d = ImageDraw.Draw(man)
    d.rectangle((30, 30, 30 + pw, 30 + ph), fill=PARCH + (255,), outline=(150, 120, 80, 255), width=3)
    d.rectangle((52, 52, 8 + pw, 8 + ph), outline=(170, 135, 90, 255), width=1)
    for row in range(13):
        y = 92 + row * 32
        x = 90
        while x < pw - 40:
            ln = rnd.randint(30, 110)
            pts = [(x + i * 4, y + math.sin(i * 0.9 + rnd.random()) * 3) for i in range(ln // 4)]
            d.line(pts, fill=(92, 70, 50, 200), width=2)
            x += ln + rnd.randint(10, 22)
    t_m0, t_m1 = T(s, "Son yüz") + 0.15, T(s, "Annelerin") - 0.2
    add(man, W // 2, 470, t_m0, t_m1, dy=30)

    st = Image.new("RGBA", (520, 200), (0, 0, 0, 0))
    sd = ImageDraw.Draw(st)
    sd.rounded_rectangle((10, 10, 510, 190), 16, outline=RED + (235,), width=10)
    f = font("sans_b", 120)
    sd.text((260, 102), "YASAK", font=f, fill=RED + (235,), anchor="mm")
    st = st.rotate(-12, expand=True, resample=Image.BICUBIC)
    add(st, W // 2 + 30, 470, T(s, "yasaklandı"), T(s, "Ama o dil") + 0.4, fade=0.15, dy=0, scale_in=2.2)
    add(text_img("Ama o dil susmadı.", "serif_i", 88, GOLD), W // 2, 470, T(s, "Ama o dil"), T(s, "Annelerin") - 0.1)

    xs = [W // 2 - 520, W // 2, W // 2 + 520]
    labels = [("Ninniler", "annelerin sesinde"), ("Klamlar", "dengbêjlerin dilinde"), ("Medreseler", "loş odalarda")]
    keys = ["ninnilerinde", "klamlarında", "medreselerin"]
    for x, (a, b), k in zip(xs, labels, keys):
        c = card(stack([text_img(a, "serif_b", 64, GOLD, shadow=False),
                        text_img(b, "sans_r", 28, MUTED, shadow=False)], gap=-10), w=420, h=200)
        add(c, x, 470, T(s, k), T(s, "Baskıya") - 0.1)

    for i, (wd, k) in enumerate([("baskı", "Baskıya,"), ("yasak", "yasağa"), ("asimilasyon", "asimilasyona")]):
        x = W // 2 - 480 + i * 480
        im = text_img(wd, "serif", 76, lerp(MUTED, RED, 0.6))
        add(im, x, 420, T(s, k), T(s, "Bu dil,") - 0.1)
        tk = TE(s, "olmadı.")
        line([(x - im.width // 2 + 30, 420), (x + im.width // 2 - 30, 420)], tk - 0.9, T(s, "Bu dil,") - 0.1,
             color=RED, width=5, dur=0.5)
    add(text_img("yok olmadı.", "serif_i", 92, GOLD), W // 2, 600, T(s, "yok olmadı"), T(s, "Bu dil,") - 0.1)

    # Dicle ve Firat
    t_r = T(s, "Bu dil,")
    firat = bezier((200, 150), (180, 420), (560, 520), (700, 830))
    dicle = bezier((620, 120), (820, 330), (640, 600), (700, 830))
    sat = bezier((700, 830), (740, 880), (800, 900), (860, 960), n=20)
    for pts in (firat, dicle):
        line(pts, t_r, e, color=(70, 120, 170), width=7, dur=3.0)
        line(pts, t_r + 0.1, e, color=(120, 175, 220), width=2, dur=3.0)
    line(sat, t_r + 2.6, e, color=(70, 120, 170), width=9, dur=0.8)
    add(text_img("Fırat", "serif_i", 44, (150, 190, 225)), 300, 330, t_r + 1.2, e, dy=0)
    add(text_img("Dicle", "serif_i", 44, (150, 190, 225)), 860, 330, t_r + 1.5, e, dy=0)
    add(text_img("MEZOPOTAMYA", "sans_b", 24, MUTED), 470, 650, t_r + 2.2, e, dy=0)
    t_k = T(s, "Kürtçedir.")
    add(text_img("KÜRTÇE", "serif_b", 190, GOLD), 1330, 420, t_k, e, dy=40)
    add(text_img("Mezopotamya'nın Kadim Dili", "serif_i", 60, CREAM), 1330, 545, t_k + 0.5, e)
    t_c = T(s, "kırk milyonu")

    def counter(fr, d, t, a):
        p = ease((t - t_c) / 1.6)
        n = int(40 * p)
        txt = f"{n} milyon+"
        f1 = font("serif_b", 96)
        col = lerp(BGC, CREAM, a)
        d.text((1330, 720), txt, font=f1, fill=col, anchor="mm")
        d.text((1330, 800), "konuşur", font=font("sans", 30), fill=lerp(BGC, MUTED, a), anchor="mm")
    fx(counter, t_c, e)


def node(text, hl=False):
    if hl:
        return pill(text, GOLD, INK, size=36)
    return pill(text, (30, 38, 62), CREAM, border=GOLD_D, size=30)


def scene_02():
    s = "02_dil_ailesi"
    e = S1(s) + 0.3
    chapter(s, "01", "DİL AİLESİ")
    t_end = T(s, "Bu aile bağının") - 0.2
    N = {
        "Hint-Avrupa": ((960, 210), T(s, "Hint-Avrupa"), None),
        "Hint-İran": ((960, 330), T(s, "Hint-İran"), "Hint-Avrupa"),
        "İrani diller": ((960, 450), T(s, "İrani diller grubunda"), "Hint-İran"),
        "Kuzeybatı İrani": ((560, 590), T(s, "Kuzeybatı"), "İrani diller"),
        "Kürtçe": ((380, 740), TE(s, "dalına girer."), "Kuzeybatı İrani"),
        "Beluççe": ((610, 740), T(s, "Beluççe"), "Kuzeybatı İrani"),
        "Taliş": ((800, 740), T(s, "Taliş"), "Kuzeybatı İrani"),
        "Güneybatı İrani": ((1090, 590), T(s, "Farsça aynı"), "İrani diller"),
        "Farsça": ((1090, 740), T(s, "Güneybatı İrani grubuna"), "Güneybatı İrani"),
        "Doğu İrani": ((1520, 590), T(s, "Peştuca"), "İrani diller"),
        "Peştuca": ((1400, 740), T(s, "Peştuca") + 0.3, "Doğu İrani"),
        "Osetçe": ((1650, 850), T(s, "Osetçe"), "Doğu İrani"),
    }
    for name, ((x, y), t0, par) in N.items():
        add(node(name, hl=(name == "Kürtçe")), x, y, t0, t_end, dy=14)
        if par:
            px, py = N[par][0]
            my = (py + y) / 2
            line([(px, py + 30), (px, my), (x, my), (x, y - 30)], t0 - 0.35, t_end, color=GOLD_D, width=3, dur=0.5)
    # Iskitce: Dogu Irani ile Osetce arasina, tarihi dil olarak yerlesir
    t_sk = T(s, "İskitlerdir.")
    sk = rich_img([("İskitçe", CREAM), ("  tarihî", MUTED)], "sans_b", 28, shadow=False)
    sk = card(sk, pad=(10, 0), fill=(22, 26, 40, 255), border=MUTED, radius=40, bw=2)
    add(sk, 1650, 752, t_sk, t_end, dy=14)
    add(rich_img([("Türk değil", RED), ("  ·  Doğu İrani", GOLD)], "sans_b", 26), 1340, 815,
        T(s, "desteklenmez."), t_end, dy=8)
    add(text_img("İskit → Sarmat → Alan → Oset", "sans", 24, GOLD), 1340, 862, T(s, "Osetçe, İskit"), t_end, dy=0)
    tk = T(s, "kuzen")
    add(text_img("kuzen", "serif_i", 44, GOLD), 735, 840, tk, t_end, dy=10)
    line(bezier((380, 790), (500, 880), (980, 880), (1090, 790)), tk - 0.2, t_end, color=GOLD, width=2, dur=0.8)

    rows = [('"stêr"', "stêr", "yıldız", [("star", "İngilizce"), ("stella", "Latince")], 330),
            ('"nû"', "nû", "yeni", [("new", "İngilizce")], 520),
            ('"nav"', "nav", "isim", [("name", "İngilizce")], 710)]
    t_c = T(s, "Bu aile bağının")
    add(text_img("Ortak kökler", "serif_i", 54, MUTED), W // 2, 190, t_c, e)
    for key, kw, mean, others, y in rows:
        t0 = T(s, key)
        k_im = card(stack([text_img(kw, "serif_b", 78, GOLD, shadow=False),
                           text_img("Kürtçe · " + mean, "sans_r", 24, MUTED, shadow=False)], gap=-14), w=330, h=150)
        add(k_im, 520, y, t0, e)
        for i, (o, lang) in enumerate(others):
            ox = 980 + i * 380
            o_im = card(stack([text_img(o, "serif_b", 70, CREAM, shadow=False),
                               text_img(lang, "sans_r", 24, MUTED, shadow=False)], gap=-14),
                        fill=(26, 32, 52, 200), border=(70, 80, 110), w=300, h=150)
            add(o_im, ox, y, t0 + 0.5 + i * 0.4, e)
            line([(700 if i == 0 else ox - 380 + 160, y), (ox - 160, y)], t0 + 0.3 + i * 0.4, e, color=GOLD_D, width=2,
                 dur=0.4)


def scene_03():
    s = "03_arkaik"
    e = S1(s) + 0.3
    chapter(s, "02", "ARKAİK BİR DİL")
    t0 = S0(s)

    def orn(fr, d, t, a):
        cx, cy = 470, 470
        for i, r in enumerate((250, 205, 160, 115)):
            rot = (t - t0) * (12 if i % 2 == 0 else -9) * (1 + i * 0.2)
            col = lerp(BGC, GOLD if i % 2 == 0 else GOLD_D, a * (0.9 - i * 0.12))
            for k in range(6 + i * 2):
                st = rot + k * 360 / (6 + i * 2)
                d.arc((cx - r, cy - r, cx + r, cy + r), st, st + 360 / (6 + i * 2) * 0.62, fill=col, width=3)
        col = lerp(BGC, GOLD, a)
        d.regular_polygon((cx, cy, 60), 8, rotation=(t - t0) * 20, outline=col, width=3)
    fx(orn, t0, e)
    add(text_img("Kadim İrani dillerin", "serif_i", 64, MUTED), 1250, 300, t0 + 0.2, e)
    add(text_img("mirası", "serif_i", 64, MUTED), 1250, 375, t0 + 0.6, e)
    tq = T(s, "Bazı dilbilimciler")
    q = stack([text_img("“Kürtçe, arkaik kelime dağarcığı", "serif", 58, CREAM),
               text_img("bakımından Farsçadan", "serif", 58, CREAM),
               text_img("daha eski olabilir.”", "serif", 58, GOLD)], gap=-18)
    add(q, 1250, 560, tq, e)
    add(text_img("— bazı dilbilimcilere göre", "sans_r", 28, MUTED), 1250, 730, tq + 1.2, e)


def scene_04():
    s = "04_eril_disil"
    e = S1(s) + 0.3
    chapter(s, "03", "ERİL VE DİŞİL")
    t_tab = T(s, "Peki bu özellik") - 0.2
    add(text_img("Dilbilgisel cinsiyet", "serif_i", 66, CREAM), W // 2, 220, S0(s) + 0.3, t_tab)
    tl, tr = T(s, '"Kurê'), T(s, '"Keça')
    L = card(stack([text_img("ERİL", "sans_b", 26, BLUE, shadow=False),
                    rich_img([("Kur", CREAM), ("ê", GOLD), (" min", CREAM)], "serif_b", 84, shadow=False),
                    text_img("oğlum", "sans_r", 28, MUTED, shadow=False)], gap=-8),
             border=BLUE, w=520, h=230)
    R = card(stack([text_img("DİŞİL", "sans_b", 26, RED, shadow=False),
                    rich_img([("Keç", CREAM), ("a", GOLD), (" min", CREAM)], "serif_b", 84, shadow=False),
                    text_img("kızım", "sans_r", 28, MUTED, shadow=False)], gap=-8),
             border=RED, w=520, h=230)
    add(L, 640, 430, tl, t_tab)
    add(R, 1280, 430, tr, t_tab)
    t1, t2 = T(s, '"Ez mêrî'), T(s, '"Ez jinê')
    a1 = stack([rich_img([("Ez mêr", CREAM), ("î", BLUE), (" dibînim", CREAM)], "serif_b", 56, shadow=False),
                text_img("adamı görüyorum", "sans_r", 26, MUTED, shadow=False)], gap=-10)
    a2 = stack([rich_img([("Ez jin", CREAM), ("ê", RED), (" dibînim", CREAM)], "serif_b", 56, shadow=False),
                text_img("kadını görüyorum", "sans_r", 26, MUTED, shadow=False)], gap=-10)
    add(a1, 640, 700, t1, t_tab)
    add(a2, 1280, 700, t2, t_tab)

    t_erg = T(s, "Kürtçe gramerinin") - 0.2
    add(text_img("Cinsiyet ayrımı bugün nerede yaşıyor?", "serif_i", 58, CREAM), W // 2, 200, t_tab + 0.2, t_erg)
    rows = [("Farsça", "kayboldu", RED, T(s, "Farsça,")),
            ("Eski Farsça · Avestçe", "vardı", MUTED, T(s, "Oysa")),
            ("Kurmancî", "yaşıyor", GREEN, T(s, "Kürtçenin Kurmancî,")),
            ("Zazakî", "yaşıyor", GREEN, T(s, "Zazakî")),
            ("Goranî", "yaşıyor", GREEN, T(s, "Goranî")),
            ("Peştuca", "yaşıyor", GREEN, T(s, "Peştuca"))]
    for i, (lng, st, col, t0) in enumerate(rows):
        y = 320 + i * 92
        add(text_img(lng, "serif_b", 50, CREAM), 760, y, t0, t_erg, dy=10)
        add(pill(st, (24, 30, 48), col, border=col, size=26), 1220, y, t0 + 0.2, t_erg, dy=10)
        line([(960, y), (1120, y)], t0 + 0.1, t_erg, color=(60, 70, 100), width=2, dur=0.4)

    add(text_img("Ergatif yapı", "serif_i", 66, CREAM), W // 2, 210, T(s, "ergatif"), e)
    tg = T(s, "Geçmiş zamanda")
    r1 = card(stack([rich_img([("Ez", GOLD), (" hatim.", CREAM)], "serif_b", 72, shadow=False),
                     text_img("Ben geldim.  ·  geçişsiz", "sans_r", 26, MUTED, shadow=False)], gap=-10), w=560, h=200)
    r2 = card(stack([rich_img([("Min", GOLD), (" nan xwar.", CREAM)], "serif_b", 72, shadow=False),
                     text_img("Ben ekmek yedim.  ·  geçişli, geçmiş zaman", "sans_r", 26, MUTED, shadow=False)],
                    gap=-10), w=640, h=200, border=GOLD)
    add(r1, 560, 470, T(s, "ergatif") + 0.6, e)
    add(r2, 1320, 470, tg, e)
    line([(860, 470), (980, 470)], tg + 0.2, e, color=GOLD, width=3, dur=0.4)
    add(rich_img([("Ez", GOLD), (" yerine ", MUTED), ("Min", GOLD), (":  özne biçim değiştirir", CREAM)], "serif", 50),
        W // 2, 690, tg + 1.0, e)


def scene_05():
    s = "05_seslenme"
    e = S1(s) + 0.3
    chapter(s, "04", "SESLENME HÂLİ")
    t_ch = T(s, "Dilbilimde") - 0.2
    items = [("Kur", "o", "were!  ·  Oğlan, gel!", '"Kuro,', BLUE, (620, 330)),
             ("Bav", "o", "Baba!", '"Bavo!', BLUE, (1300, 330)),
             ("Keç", "ê", "Kız!", '"Keçê!', RED, (620, 640)),
             ("Heval", "no", "Arkadaşlar!", '"Hevalno!', GREEN, (1300, 640))]
    for a, b, tr, k, col, (x, y) in items:
        c = card(stack([rich_img([(a, CREAM), (b, GOLD), ("!", CREAM)], "serif_b", 110, shadow=False),
                        text_img(tr, "sans_r", 28, MUTED, shadow=False)], gap=-14),
                 border=col, w=560, h=250)
        add(c, x, y, T(s, k), t_ch)
    t_cmp = T(s, "Bu küçük ek") - 0.2
    add(text_img("Vokatif · seslenme hâli", "serif_i", 66, CREAM), W // 2, 220, T(s, "Dilbilimde"), t_cmp)
    for i, (lab, suf, col, k) in enumerate([("ERİL", "-o", BLUE, "Erkeklere"), ("DİŞİL", "-ê", RED, "kadınlara"),
                                            ("ÇOĞUL", "-no", GREEN, "çoğula")]):
        c = card(stack([text_img(lab, "sans_b", 28, col, shadow=False),
                        text_img(suf, "serif_b", 140, GOLD, shadow=False)], gap=-20), border=col, w=380, h=300)
        add(c, 480 + i * 480, 520, T(s, k), t_cmp)
    add(text_img("Hint-Avrupa ana dilinden kalan miras", "serif_i", 58, GOLD), W // 2, 230, T(s, "Hint-Avrupa"), e)
    f1 = card(stack([text_img("Farsça", "sans_b", 28, MUTED, shadow=False),
                     rich_img([("ey", RED), (" + isim", CREAM)], "serif_b", 80, shadow=False),
                     text_img("ek kayboldu, ayrı kelime geldi", "sans_r", 26, MUTED, shadow=False)], gap=-10),
              border=(80, 90, 120), w=620, h=260)
    f2 = card(stack([text_img("Kürtçe", "sans_b", 28, GOLD, shadow=False),
                     rich_img([("isim + ", CREAM), ("-o / -ê / -no", GOLD)], "serif_b", 80, shadow=False),
                     text_img("binlerce yıldır korunuyor", "sans_r", 26, MUTED, shadow=False)], gap=-10),
              border=GOLD, w=620, h=260)
    add(f1, 600, 540, T(s, "Farsça gibi"), e)
    add(f2, 1320, 540, T(s, "Kürtçe ise"), e)


def scene_06():
    s = "06_lehceler"
    e = S1(s) + 0.3
    chapter(s, "05", "LEHÇELER")
    t_cl = T(s, "Bu lehçe çeşitliliği") - 0.2

    # Kurdistan cografyasi: dort parca
    t_dl = T(s, "Kürtçenin başlıca") - 0.2
    cx, cy = 960, 500
    def compass(fr, d, t, a):
        col = lerp(BGC, GOLD_D, a)
        r = 175
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=col, width=2)
        d.ellipse((cx - r + 14, cy - r + 14, cx + r - 14, cy + r - 14), outline=lerp(BGC, GOLD_D, a * 0.5), width=1)
        for k in range(4):
            ang = math.radians(k * 90 + (t - S0(s)) * 3)
            x1, y1 = cx + math.cos(ang) * (r - 30), cy + math.sin(ang) * (r - 30)
            x2, y2 = cx + math.cos(ang + 0.12) * 40, cy + math.sin(ang + 0.12) * 40
            x3, y3 = cx + math.cos(ang - 0.12) * 40, cy + math.sin(ang - 0.12) * 40
            d.polygon([(x1, y1), (x2, y2), (x3, y3)], outline=col)
    fx(compass, S0(s) + 0.2, t_dl)
    NOSUB.append((S0(s) - 0.3, t_dl + 0.2))  # bolgeler ve nufus sahnesinde altyazi yok
    t_tot = T(s, "Kafkasya, Orta Asya")
    add(pill("KÜRTÇE", GOLD, INK, size=34, padx=40, pady=16), cx, cy, S0(s) + 0.6, t_tot)
    add(card(stack([text_img("40–50 milyon", "serif_b", 50, GOLD, shadow=False),
                    text_img("toplam · tahmini", "sans_r", 22, MUTED, shadow=False)], gap=-14),
             fill=(20, 24, 40, 255), border=GOLD, w=290, h=130), cx, cy, t_tot, t_dl, dy=0, scale_in=0.85)
    Rg = [("Bakur", "kuzey", "23–25 milyon", (cx, cy - 268), "Bakur,", "Bakur'da"),
          ("Başûr", "güney", "6–8 milyon", (cx, cy + 268), "Başûr,", "Başûr'da"),
          ("Rojava", "batı", "2–3 milyon", (cx - 470, cy), "Rojava", "Rojava'da"),
          ("Rojhelat", "doğu", "8–10 milyon", (cx + 470, cy), "Rojhelat'ta", ("Rojhelat'ta", 2))]
    for nm, yon, pop, (x, y), k, kp in Rg:
        t_p = T(s, kp[0], occ=kp[1]) if isinstance(kp, tuple) else T(s, kp)
        c1 = card(stack([text_img(nm, "serif_b", 60, GOLD, shadow=False),
                         text_img(yon, "sans_r", 26, MUTED, shadow=False)], gap=-14), w=300, h=140)
        c2 = card(stack([text_img(nm, "serif_b", 60, GOLD, shadow=False),
                         text_img(pop, "sans_b", 28, CREAM, shadow=False)], gap=-14), w=300, h=140, border=GOLD)
        add(c1, x, y, T(s, k), t_p, dy=0, scale_in=0.85, fout=0.25)
        add(c2, x, y, t_p, t_dl, fade=0.3, dy=0)

    add(pill("KÜRTÇE", GOLD, INK, size=46, padx=50, pady=22), cx, 470, T(s, "Kürtçenin başlıca"), t_cl)
    cy = 470
    D = [("Kurmancî", ["Kuzey Kürtçesi", "Bakur · Rojava · Başûr · Rojhelat · Kafkasya"], (430, 250), "Kurmancî,"),
         ("Soranî", ["Orta Kürtçe", "Başûr · Rojhelat"], (1490, 250), "Soranî,"),
         ("Güney Kürtçesi", ["Kelhurî · Feylî · Lekî"], (1500, 600), "Güney Kürtçesi."),
         ("Zazakî", ["Kirmanckî · Dimilî", "Dersim · Çewlîg · Xarpêt · Amed · Sêwreg"], (420, 620), "Zazakî,"),
         ("Goranî", ["Hewramî", "Erdelan ve Baban sarayları"], (960, 760), "Goranî,")]
    for name, lines_, (x, y), k in D:
        t0 = T(s, k)
        line([(cx, cy), (x, y)], t0 - 0.3, t_cl, color=GOLD_D, width=3, dur=0.5)
        parts = [text_img(name, "serif_b", 58, GOLD, shadow=False)]
        parts += [text_img(l, "sans_r", 25, MUTED if i else CREAM, shadow=False) for i, l in enumerate(lines_)]
        add(card(stack(parts, gap=-12)), x, y, t0, t_cl)
    words = [("çiya", "dağ"), ("kanî", "pınar"), ("zozan", "yayla"), ("baran", "yağmur"), ("befr", "kar"),
             ("gund", "köy"), ("zevî", "tarla"), ("mêrg", "çayır"), ("şivan", "çoban"), ("berx", "kuzu"),
             ("rez", "bağ"), ("dar", "ağaç"), ("gul", "gül"), ("av", "su"), ("pez", "sürü")]
    add(text_img("Kelime zenginliği", "serif_i", 66, CREAM), W // 2, 200, T(s, "Bu lehçe çeşitliliği"), e)
    rnd = random.Random(11)
    ta, tb = T(s, "Aynı kavram"), T(s, "Doğaya")
    for i, (k, tr) in enumerate(words):
        col, row = i % 5, i // 5
        x = 330 + col * 315 + rnd.randint(-30, 30)
        y = 360 + row * 170 + rnd.randint(-20, 20)
        im = stack([text_img(k, "serif_b", rnd.choice([60, 68, 76]), GOLD if i % 3 == 0 else CREAM),
                    text_img(tr, "sans_r", 24, MUTED, shadow=False)], gap=-14)
        add(im, x, y, ta + (tb - ta + 2.5) * i / len(words), e, dy=30)


def info_card(top, name, lines, w=400, border=GOLD_D, name_size=46, top_col=GOLD):
    parts = []
    if top:
        parts.append(text_img(top, "sans_b", 24, top_col, shadow=False))
    parts.append(text_img(name, "serif_b", name_size, CREAM, shadow=False))
    parts += [text_img(l, "sans_r", 23, MUTED, shadow=False) for l in lines]
    return card(stack(parts, gap=-12), w=w, border=border)


def manuscript_book(lines, author, col):
    im = Image.new("RGBA", (300, 440), (0, 0, 0, 0))
    dd = ImageDraw.Draw(im)
    dd.rounded_rectangle((20, 20, 280, 420), 10, fill=col + (255,), outline=GOLD_D + (255,), width=3)
    dd.rectangle((20, 70, 280, 80), fill=GOLD_D + (255,))
    dd.rectangle((20, 360, 280, 370), fill=GOLD_D + (255,))
    n = len(lines)
    for i, l in enumerate(lines):
        dd.text((150, 200 - (n - 1) * 30 + i * 60), l, font=font("serif_b", 50), fill=GOLD + (255,), anchor="mm")
    dd.text((150, 320), author, font=font("sans_r", 22), fill=CREAM + (255,), anchor="mm")
    return im


def scene_07():
    s = "07_petersburg"
    e = S1(s) + 0.3
    chapter(s, "06", "KÜRT EDEBİYATINA SAHİP ÇIKANLAR")
    tB = T(s, "Rus akademisyen") - 0.2
    tC = T(s, "Bu koleksiyonlar") - 0.2
    tD = T(s, "Yirminci yüzyılda") - 0.2
    tE = T(s, "Sovyet döneminde de") - 0.2
    tF = T(s, "Kürt edebiyatına sahip") - 0.2
    tG = T(s, "Güçlü bir bilim") - 0.2

    # A: Sankt-Peterburg silueti
    def skyline(fr, d, t, a):
        col = lerp(BGC, (60, 70, 100), a)
        gcol = lerp(BGC, GOLD, a)
        base = 700
        d.rectangle((260, base - 120, 1660, base), fill=col)
        for x in range(300, 1640, 70):
            d.rectangle((x, base - 100, x + 30, base - 50), fill=lerp(BGC, (90, 100, 130), a))
        d.rectangle((890, base - 260, 1030, base - 120), fill=col)
        d.polygon([(940, base - 260), (960, base - 560), (980, base - 260)], fill=gcol)
        d.ellipse((1260, base - 300, 1440, base - 120), fill=col)
        d.rectangle((1340, base - 360, 1360, base - 290), fill=gcol)
        d.ellipse((440, base - 250, 560, base - 130), fill=col)
        d.line([(200, base), (1720, base)], fill=gcol, width=3)
    fx(skyline, T(s, "Oysa çok"), tB)
    add(text_img("Sankt-Peterburg", "serif_b", 96, GOLD), W // 2, 810, T(s, "Sankt"), tB)
    add(text_img("19. yüzyılın Kürdoloji merkezi", "serif_i", 44, CREAM), W // 2, 900, TE(s, "Peterburg,"), tB)

    # B: 19. yuzyil zaman cizelgesi
    y0 = 520
    line([(180, y0), (1740, y0)], tB + 0.1, tC, color=GOLD_D, width=3, dur=1.2)
    P = [("1857", "Pyotr Lerch", ["Kürtçe gramer ve folklor", "Kürt şairlerini Avrupa'ya tanıttı"], T(s, "Pyotr"), 370, -1),
         ("Erzurum konsolosu", "Aleksandr Jaba", ["Kürtçe el yazmalarını topladı"], T(s, "Aleksandr"), 800, 1),
         ("Kürt âlim", "Mela Mehmûdê Bazîdî", ["Kürt şairlerinin hayatları", "Kürt örf ve âdetleri"],
          T(s, "Kürt âlim"), 1235, -1),
         ("1879", "Kürtçe-Fransızca Sözlük", ["Bilimler Akademisi, Petersburg"], T(s, "Jaba'nın Kürtçe-Fransızca"),
          1620, 1)]
    for top, who, ls, t0, x, side in P:
        def dot(fr, d, t, a, x=x):
            d.ellipse((x - 12, y0 - 12, x + 12, y0 + 12), fill=lerp(BGC, GOLD, a))
        fx(dot, t0, tC)
        c = info_card(top, who, ls, w=400, name_size=40)
        add(c, x, y0 + side * (c.height // 2 + 40), t0, tC, dy=12 * side)
        line([(x, y0 + side * 14), (x, y0 + side * 40)], t0, tC, color=GOLD_D, width=2, dur=0.3)

    # C: koleksiyondaki el yazmalari
    add(text_img("Sankt-Peterburg koleksiyonları", "serif_i", 60, CREAM), W // 2, 190, tC + 0.2, tD)
    books = [(["Mem û Zîn"], "Ehmedê Xanî", (120, 60, 50), T(s, '"Mem')),
             (["Nûbihara", "Biçûkan"], "Ehmedê Xanî · 1683", (40, 80, 90), T(s, '"Nûbihara')),
             (["Eqîdeya", "Îmanê"], "Ehmedê Xanî", (70, 60, 110), T(s, '"Eqîdeya')),
             (["Qewlê", "Hespê Reş"], "Feqiyê Teyran", (60, 90, 60), T(s, '"Qewlê'))]
    for i, (ls, au, col, t0) in enumerate(books):
        add(manuscript_book(ls, au, col), 420 + i * 360, 540, t0, tD, dy=40)

    # D: 20. yuzyil
    add(text_img("20. yüzyıl: kurumsallaşma", "serif_i", 60, CREAM), W // 2, 200, tD + 0.2, tE)
    add(info_card("1916 · Petersburg Üniversitesi", "İosif Orbeli", ["Kürtçe dersleri başladı",
                                                                     "Kürdoloji akademik disiplin oldu"],
                  w=600, name_size=58), 600, 500, T(s, "İosif"), tE)
    add(info_card("İslam Ansiklopedisi", "Vladimir Minorsky", ["“Kürtler” maddesi",
                                                               "Kürt tarihinde dünya otoritesi"],
                  w=600, name_size=58), 1320, 500, T(s, "Rus kökenli"), tE)

    # E: Sovyet donemi
    add(text_img("Sovyet dönemi", "serif_i", 56, CREAM), W // 2, 135, tE + 0.2, tF)
    E = [("1920'lerin sonu", "Latin alfabesi", ["“Riya Teze” gazetesi"], T(s, "Kürtçe için Latin"), 420, 380),
         ("1935 · Erivan", "Şivanê Kurmanca", ["Erebê Şemo", "ilk Kürtçe romanlardan"], T(s, "Erebê"), 960, 380),
         ("Leningrad", "Qanatê Kurdo", ["Kürtçe gramer ve sözlük"], T(s, "Leningrad'da"), 1500, 380),
         ("1961", "Margarita Rudenko", ["El yazmaları kataloğu", "Mem û Zîn · Feqiyê Teyran çevirileri"],
          T(s, "Margarita"), 690, 710),
         ("Bugün", "Doğu Yazmaları Enstitüsü", ["Rusya Bilimler Akademisi"], T(s, "Bugün Rusya"), 1230, 710)]
    for top, name, ls, t0, x, y in E:
        add(info_card(top, name, ls, w=480, name_size=40), x, y, t0, tF)

    # F: diger ulkeler
    add(text_img("Kürt edebiyatına sahip çıkanlar", "serif_i", 60, CREAM), W // 2, 170, tF + 0.2, tG)
    C = [("İTALYA · 1787", "Maurizio Garzoni", ["İlk Kürtçe gramer ve sözlük"], T(s, "İtalyan"), 420, 380),
         ("ALMANYA", "Socin · Prym · Justi", ["Halk anlatıları, Kürtçe gramer"], T(s, "Alman"), 960, 380),
         ("FRANSA", "Roger Lescot", ["Celadet ve Kamuran Bedirxan", "Paris Kürt Enstitüsü · 1983"], T(s, "Fransız"),
          1500, 380),
         ("İNGİLTERE", "D. N. MacKenzie", ["Kürt lehçeleri çalışmaları"], T(s, "İngiliz"), 690, 660),
         ("İSVEÇ · 1970'ler", "Kürtçe yayıncılık", ["Yüzlerce Kürtçe kitap"], T(s, "İsveç ise"), 1230, 660)]
    for top, name, ls, t0, x, y in C:
        add(info_card(top, name, ls, w=480, name_size=42), x, y, t0, tG)

    # G: kapanis
    add(text_img("Güçlü bir bilim merkezi olmak işte böyle olur:", "serif_i", 54, CREAM), W // 2, 300, tG + 0.2, e)
    add(text_img("Kendi dilin olmasa bile, bir halkın hafızasını", "serif", 50, CREAM), W // 2, 400, tG + 1.2, e)
    add(text_img("kayıt altına alıp gelecek kuşaklara aktarabilmek.", "serif", 50, CREAM), W // 2, 470, tG + 1.8, e)
    add(text_img("O dili yasaklamak, baskı altına almak değil.", "serif_b", 64, GOLD), W // 2, 640,
        T(s, "O dili yasaklamak"), e)


def arch_fx(cx, base, w, h):
    def f(fr, d, t, a):
        col = lerp(BGC, GOLD_D, a)
        fill = lerp(BGC, (30, 30, 46), a)
        L, R = cx - w // 2, cx + w // 2
        pts = [(L, base)] + [(L, base - h * 0.55)]
        for i in range(21):
            u = i / 20
            x = L + (cx - L) * u
            y = base - h * 0.55 - (h * 0.45) * math.sin(u * math.pi / 2) ** 0.9
            pts.append((x, y))
        right = [(2 * cx - x, y) for x, y in reversed(pts[1:])]
        poly = pts + right[1:] + [(R, base)]
        d.polygon(poly, fill=fill)
        d.line(poly + [poly[0]], fill=col, width=4)
        fl = 1 + 0.08 * math.sin(t * 9) + 0.05 * math.sin(t * 23)
        for r, c in ((90, (60, 46, 30)), (55, (120, 86, 40)), (28, (220, 170, 90))):
            rr = r * fl
            d.ellipse((cx - rr, base - 190 - rr, cx + rr, base - 190 + rr), fill=lerp(fill, c, a))
        d.rectangle((cx - 12, base - 175, cx + 12, base - 80), fill=lerp(fill, CREAM, a * 0.9))
        d.polygon([(cx, base - 220 - 14 * fl), (cx - 9, base - 185), (cx + 9, base - 185)], fill=lerp(fill, (255, 220, 140), a))
    return f


def scene_08():
    s = "08_medreseler"
    e = S1(s) + 0.3
    chapter(s, "07", "MEDRESELER")
    fx(arch_fx(430, 860, 440, 640), S0(s) + 0.2, e)
    t_bk = T(s, "Öğrenciler") - 0.2
    add(text_img("Kürt medreseleri", "serif_i", 66, CREAM), 1240, 230, S0(s) + 0.4, t_bk)
    for i, (w_, k) in enumerate([("Dil", "dil,"), ("Edebiyat", "edebiyat,"), ("Mantık", "mantık"), ("Astronomi", "astronomi")]):
        add(pill(w_, (30, 38, 62), CREAM, border=GOLD_D, size=30), 880 + i * 245, 380, T(s, k), t_bk)
    add(text_img("Ders kitapları: Arapça", "serif", 52, MUTED), 1240, 540, T(s, "Ders kitaplarının"), t_bk)
    add(rich_img([("Eğitim dili: ", CREAM), ("Kürtçe", GOLD)], "serif_b", 84), 1240, 660, T(s, "eğitimin,"), t_bk)

    t_sc = T(s, "Bu medreseler") - 0.2
    books = [("Nûbihar", "Ehmedê Xanî", (120, 60, 50), "Nûbihar"), ("Dîwan", "Melayê Cizîrî", (40, 80, 90), "Dîwan'ını"),
             ("Mewlûd", "Melayê Bateyî", (70, 60, 110), "Mewlûd'unu")]
    for i, (b, a, col, k) in enumerate(books):
        im = Image.new("RGBA", (300, 440), (0, 0, 0, 0))
        dd = ImageDraw.Draw(im)
        dd.rounded_rectangle((20, 20, 280, 420), 10, fill=col + (255,), outline=GOLD_D + (255,), width=3)
        dd.rectangle((20, 70, 280, 80), fill=GOLD_D + (255,))
        dd.rectangle((20, 360, 280, 370), fill=GOLD_D + (255,))
        dd.text((150, 200), b, font=font("serif_b", 62), fill=GOLD + (255,), anchor="mm")
        dd.text((150, 270), a, font=font("sans_r", 24), fill=CREAM + (255,), anchor="mm")
        add(im, 960 + i * 330, 520, T(s, k), t_sc, dy=40)
    add(text_img("Bu gelenekten yetişenler", "serif_i", 60, CREAM), 1240, 200, T(s, "Bu medreseler"), e)
    sch = [("Melayê Cizîrî", "", T(s, "Melayê Cizîrî,", occ=2)), ("Feqiyê Teyran", "", T(s, "Feqiyê")),
           ("Ehmedê Xanî", "", T(s, "Ehmedê Xanî gibi")),
           ("Molla Gürani", "Fatih Sultan Mehmed'in hocası", T(s, "Molla Gürani")),
           ("Mela Xelîlê Sêrtî", "yakın dönem", T(s, "Mela Xelîl-ê"))]
    for i, (n, sub, t0) in enumerate(sch):
        y = 330 + i * 105
        im = rich_img([(n, GOLD if i < 3 else CREAM)] + ([("   " + sub, MUTED)] if sub else []), "serif_b", 54)
        add(im, 860 + im.width // 2, y, t0, e, dy=0)
        def dia(fr, d, t, a, y=y):
            d.regular_polygon((830, y, 9), 4, fill=lerp(BGC, GOLD, a))
        fx(dia, t0, e)


def scene_09():
    s = "09_bediuzzaman"
    e = S1(s) + 0.3
    chapter(s, "08", "BEDİÜZZAMAN SAİD NURSİ")
    t_mz = T(s, "Doğu'da") - 0.2
    add(text_img("Bediüzzaman", "serif_i", 80, CREAM), W // 2, 380, S0(s) + 0.5, t_mz)
    add(text_img("Said Nursi", "serif_b", 140, GOLD), W // 2, 500, S0(s) + 1.0, t_mz)
    add(text_img("Nurs · Bedlîs", "sans_b", 30, MUTED), W // 2, 640, T(s, "Nurs köyünde"), t_mz)
    add(text_img("Kürtçe eğitim veren medreselerde yetişti", "serif_i", 48, CREAM), W // 2, 720, T(s, "eğitimini"), t_mz)

    t_np = T(s, "Said Nursi'nin Kürtçe") - 0.2
    add(text_img("Medresetü'z-Zehra", "serif_b", 80, GOLD), W // 2, 230, T(s, "Medresetüz"), t_np)
    add(text_img("Doğu'da kurulması hayal edilen üniversite", "sans_r", 28, MUTED), W // 2, 305, T(s, "Medresetüz") + 0.4, t_np)
    Q = [("Arabî vâcib", "Arapça zorunlu", "Arabi"), ("Kürdî câiz", "Kürtçe serbest", "Kürdi"),
         ("Türkî lâzım", "Türkçe gerekli", "Türki")]
    ty = T(s, "Yani:")
    for i, (a, b, k) in enumerate(Q):
        x = 480 + i * 480
        col = GOLD if i == 1 else CREAM
        add(card(text_img(a, "serif_b", 66, col, shadow=False), w=420, h=150, border=GOLD if i == 1 else GOLD_D),
            x, 500, T(s, k), t_np)
        add(text_img(b, "sans", 30, MUTED), x, 640, ty + i * 0.7, t_np)

    t_ie = T(s, "Kürtçenin onun") - 0.2
    npw, nph = 900, 520
    npim = Image.new("RGBA", (npw + 40, nph + 40), (0, 0, 0, 0))
    dd = ImageDraw.Draw(npim)
    dd.rectangle((20, 20, 20 + npw, 20 + nph), fill=(232, 222, 198, 255), outline=(120, 100, 70, 255), width=3)
    dd.text((20 + npw // 2, 80), "KÜRD TEÂVÜN VE TERAKKÎ", font=font("serif_b", 56), fill=INK + (255,), anchor="mm")
    dd.text((20 + npw // 2, 130), "GAZETESİ", font=font("serif_b", 40), fill=INK + (255,), anchor="mm")
    dd.line([(50, 165), (npw - 10, 165)], fill=INK + (255,), width=3)
    dd.text((20 + npw // 2, 190), "İstanbul · 1908", font=font("sans_b", 22), fill=(80, 70, 60, 255), anchor="mm")
    rr = random.Random(5)
    for c in range(3):
        x0 = 60 + c * 290
        for r in range(14):
            y = 230 + r * 22
            dd.line([(x0, y), (x0 + rr.randint(200, 260), y)], fill=(110, 100, 90, 255), width=3)
    dd.rectangle((60, 220, 330, 540), outline=RED + (255,), width=4)
    dd.text((195, 545), "Kürtçe makale", font=font("sans_b", 22), fill=RED + (255,), anchor="mm")
    add(npim, W // 2, 470, T(s, "Said Nursi'nin Kürtçe"), t_ie, dy=40)

    t_fl = T(s, "Talebelerinin") - 0.2
    add(text_img("إشارات الإعجاز", "arabic", 130, GOLD), W // 2, 380, T(s, "İşaratül"), t_fl)
    add(text_img("İşaratü'l-İ'caz", "serif_i", 64, CREAM), W // 2, 540, T(s, "İşaratül") + 0.6, t_fl)
    add(text_img("Birinci Dünya Savaşı · cephede yazılan tefsir", "sans", 30, MUTED), W // 2, 630, T(s, "Birinci"), t_fl)

    t_ot = T(s, "Sonraki yıllarda") - 0.2
    F3 = [("Ayet", "Kur'an", T(s, "ayetleri"), 380), ("Kürtçe açıklama", "Said Nursi", T(s, "Kürtçe olarak"), 960),
          ("Arapça yazım", "Molla Habib", T(s, "Molla Habib"), 1540)]
    for i, (a, b, t0, x) in enumerate(F3):
        c = card(stack([text_img(a, "serif_b", 54, GOLD if i == 1 else CREAM, shadow=False),
                        text_img(b, "sans_r", 26, MUTED, shadow=False)], gap=-10), w=440, h=170,
                 border=GOLD if i == 1 else GOLD_D)
        add(c, x, 430, t0, t_ot)
        if i:
            line([(F3[i - 1][3] + 230, 430), (x - 230, 430)], t0 - 0.4, t_ot, color=GOLD, width=3, dur=0.4)
            line([(x - 245, 418), (x - 230, 430), (x - 245, 442)], t0, t_ot, color=GOLD, width=3, dur=0.2)
    add(text_img("Tercümeye gerek kalmadan, geniş İslam dünyasına", "serif_i", 46, CREAM), W // 2, 650,
        T(s, "Rivayet"), t_ot)

    t_ch = T(s, "Ancak külliyatındaki") - 0.2
    add(rich_img([("Sonraki eserler: ", MUTED), ("Osmanlı Türkçesi", CREAM)], "serif_b", 60), W // 2, 430,
        T(s, "Sonraki yıllarda"), t_ch)
    add(text_img("daha geniş bir kitleye ulaşmak için", "serif_i", 44, MUTED), W // 2, 530, T(s, "daha geniş"), t_ch)
    C = [("Külliyatın derinliği", T(s, "külliyatındaki"), 260, CREAM),
         ("Fikir dünyasının derinliği", T(s, "fikir dünyasının derinliğinden"), 450, CREAM),
         ("Eğitim dili: Kürtçe", T(s, "Kürtçeydi."), 680, GOLD)]
    for i, (txt, t0, y, col) in enumerate(C):
        add(card(text_img(txt, "serif_b", 64 if i < 2 else 80, col, shadow=False), w=880, h=140,
                 border=GOLD if i == 2 else GOLD_D), W // 2, y, t0, e)
        if i:
            line([(W // 2, C[i - 1][2] + 75), (W // 2, y - 75)], t0 - 0.3, e, color=GOLD, width=3, dur=0.3)


def scene_10():
    s = "10_kapanis"
    e = DUR
    t_z = T(s, '"Ziman') - 0.3
    tags = [("kadim kelimeler", "Antik"), ("eril ve dişil", "eril"), ("seslenme ekleri", "seslenme"),
            ("zengin lehçeler", "zengin"), ("yazılı gelenek", "yazılı")]
    for i, (tg, k) in enumerate(tags):
        x = 290 + i * 335
        add(pill(tg, (30, 38, 62), CREAM, border=GOLD_D, size=28), x, 380, T(s, k), t_z)
    add(text_img("binlerce yıllık bir hafıza", "serif_i", 80, GOLD), W // 2, 560, T(s, "O, binlerce"), t_z)
    add(text_img("Ziman jiyan e.", "serif_b", 170, GOLD), W // 2, 450, T(s, '"Ziman'), e, fade=1.2)
    add(text_img("Dil hayattır.", "serif_i", 74, CREAM), W // 2, 610, T(s, "Dil,"), e, fade=1.2)


# ================================================================ 5 DIL KARTI (YouTube ses/altyazi menusu)
MENU = [
    ("tr", False, "5 DİLDE SESLİ ANLATIM VE ALTYAZI", "Ses parçası",
     ["Türkçe (orijinal)", "Kurmancî", "Soranî", "Arapça", "İngilizce"], "Altyazı: Türkçe", 0),
    ("ku", False, "BI 5 ZIMANAN DENG Û BINNIVÎS", "Şopa deng",
     ["Tirkî (orîjînal)", "Kurmancî", "Soranî", "Erebî", "Îngilîzî"], "Binnivîs: Kurmancî", 1),
    ("ckb", True, "دەنگ و ژێرنووس بە ٥ زمان", "تراکی دەنگ",
     ["تورکی (ئەسڵی)", "کورمانجی", "سۆرانی", "عەرەبی", "ئینگلیزی"], "ژێرنووس: سۆرانی", 2),
    ("ar", True, "صوت وترجمة بخمس لغات", "المسار الصوتي",
     ["التركية (الأصلية)", "الكردية الكرمانجية", "الكردية السورانية", "العربية", "الإنجليزية"], "الترجمة: العربية", 3),
    ("en", False, "AUDIO & SUBTITLES IN 5 LANGUAGES", "Audio track",
     ["Turkish (original)", "Kurmanji", "Sorani", "Arabic", "English"], "Subtitles: English", 4),
]
FOOTER = [("Türkçe", False), ("Kurmancî", False), ("سۆرانی", True), ("العربية", True), ("English", False)]


def _mfont(rtl, size, bold=False):
    if rtl:
        return font("arabic", int(size * 1.15))
    return font("sans_b" if bold else "sans", size)


def _icon_gear(d, x, y, col):
    for k in range(8):
        a = k * math.pi / 4
        d.line([(x + math.cos(a) * 7, y + math.sin(a) * 7), (x + math.cos(a) * 12, y + math.sin(a) * 12)], fill=col, width=4)
    d.ellipse((x - 9, y - 9, x + 9, y + 9), outline=col, width=3)


def _icon_phones(d, x, y, col):
    d.arc((x - 11, y - 12, x + 11, y + 10), 180, 360, fill=col, width=3)
    d.rounded_rectangle((x - 13, y - 1, x - 7, y + 10), 2, fill=col)
    d.rounded_rectangle((x + 7, y - 1, x + 13, y + 10), 2, fill=col)


def _icon_cc(d, x, y, col):
    d.rounded_rectangle((x - 15, y - 10, x + 15, y + 10), 4, outline=col, width=2)
    d.text((x, y), "CC", font=font("sans_b", 13), fill=col, anchor="mm")


def lang_panel(entry):
    _, rtl, head, title, items, sub, sel = entry
    PW, RH = 460, 50
    ph = 66 + len(items) * RH + 16 + 58
    im = Image.new("RGBA", (PW + 40, ph + 90), (0, 0, 0, 0))
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((20, 66, 20 + PW, 66 + ph), 16, fill=(0, 0, 0, 170))
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(12)))
    d = ImageDraw.Draw(im)
    L, R = 20, 20 + PW

    def put(txt, y, f, col, inset=0):
        w = f.getlength(txt)
        x = (R - 24 - inset - w) if rtl else (L + 24 + inset)
        d.text((x, y), txt, font=f, fill=col + (255,), anchor="lm")

    hf = _mfont(rtl, 21, bold=True)
    hw = hf.getlength(head)
    d.text((R - hw if not rtl else R - hw, 30), head, font=hf, fill=GOLD + (255,), anchor="lm")
    top = 60
    d.rounded_rectangle((L, top, R, top + ph), 16, fill=(14, 18, 30, 238), outline=(78, 88, 120, 255), width=2)
    # baslik satiri
    ty = top + 34
    if rtl:
        _icon_gear(d, R - 30, ty, CREAM); _icon_phones(d, R - 62, ty, CREAM)
        put(title, ty, _mfont(rtl, 24, True), CREAM, inset=60)
    else:
        _icon_gear(d, L + 30, ty, CREAM); _icon_phones(d, L + 62, ty, CREAM)
        put(title, ty, _mfont(rtl, 24, True), CREAM, inset=60)
    d.line([(L + 14, top + 66), (R - 14, top + 66)], fill=(60, 70, 100, 255), width=1)
    for i, it in enumerate(items):
        cy = top + 66 + 8 + i * RH + RH // 2
        if i == sel:
            d.rounded_rectangle((L + 12, cy - 22, R - 12, cy + 22), 8, fill=RED + (255,))
            cx = (R - 34) if rtl else (L + 34)
            d.line([(cx - 9, cy), (cx - 3, cy + 7), (cx + 10, cy - 8)], fill=(255, 255, 255, 255), width=4)
            put(it, cy, _mfont(rtl, 23, True), (255, 255, 255), inset=36)
        else:
            put(it, cy, _mfont(rtl, 23), (190, 196, 212), inset=36)
    yb = top + 66 + 8 + len(items) * RH + 8
    d.line([(L + 14, yb), (R - 14, yb)], fill=(60, 70, 100, 255), width=1)
    cy = yb + 29
    if rtl:
        _icon_cc(d, R - 36, cy, GOLD)
    else:
        _icon_cc(d, L + 36, cy, GOLD)
    put(sub, cy, _mfont(rtl, 22, True), GOLD, inset=44)
    # alt serit: dil adlari
    x = L + 6
    fy = top + ph + 22
    parts = []
    for i, (nm, r) in enumerate(FOOTER):
        parts.append((nm, r))
        if i < len(FOOTER) - 1:
            parts.append(("·", False))
    tot = sum(_mfont(r, 19).getlength(t) + 12 for t, r in parts)
    x = R - tot
    for t, r in parts:
        f = _mfont(r, 19)
        d.text((x, fy), t, font=f, fill=(MUTED if t == "·" else CREAM) + (255,), anchor="lm")
        x += f.getlength(t) + 12
    return im


def scene_00(final_lang="tr"):
    t0, step = 0.6, 1.7
    order = [m[0] for m in MENU]
    seq = order + [final_lang]
    imgs = {m[0]: lang_panel(m) for m in MENU}
    end = t0 + step * len(seq) + 0.2
    for i, lg in enumerate(seq):
        a, b = t0 + i * step, t0 + (i + 1) * step
        last = i == len(seq) - 1
        im = imgs[lg]
        add(im, W - 36 - im.width // 2, H // 2 - 20, a, (end if last else b), fade=0.6 if i == 0 else 0.25,
            fout=0.6 if last else 0.25, dy=-14 if i == 0 else 0)


def build():
    global BG
    BG = make_bg()
    for f in (scene_00, scene_01, scene_02, scene_03, scene_04, scene_05, scene_06, scene_07, scene_08, scene_09, scene_10):
        f()
    build_subs()


def frame(t):
    fr = BG.copy()
    d = ImageDraw.Draw(fr)
    particles(d, t)
    for L in LINES:
        L.draw(fr, t, d)
    for sp in SPRITES:
        sp.draw(fr, t)
    if BURN_SUBS:
        draw_sub(fr, t)
    g = 1.0
    if t < 1.0:
        g = t / 1.0
    if t > DUR - 1.5:
        g = max(0, (DUR - t) / 1.5)
    if g < 1:
        fr = Image.blend(Image.new("RGB", (W, H)), fr, g)
    return fr


def render_range(i0, i1, out):
    build()
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                          "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                          "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    for i in range(i0, i1):
        p.stdin.write(frame(i / FPS).tobytes())
    p.stdin.close()
    p.wait()


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "still":
        build()
        for ts in sys.argv[2:]:
            os.makedirs(os.path.join(HERE, "..", "build", "stills"), exist_ok=True)
            frame(float(ts)).save(os.path.join(HERE, "..", "build", "stills", f"t{float(ts):07.2f}.png"))
    elif cmd == "range":
        render_range(int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
    elif cmd == "srt":
        build()
        write_srt(sys.argv[2])
        print(len(SUBS), "altyazi")
    elif cmd == "nframes":
        print(int(DUR * FPS))
