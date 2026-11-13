"""Kapak görseli (YouTube küçük resmi, 1280x720): python3 kapak.py render/kapak.png"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "boxce", "2d"))
from karakter import gule, ciwan, place, DEFS, INK, GOLD          # noqa: E402
from sahneler import W, H, EXTRA_DEFS, camera, text, rect, path    # noqa: E402
sys.argv = sys.argv[:2]
import oyun                                                        # noqa: E402  (nehir arka planı)

out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "render", "kapak.png")

scene = (oyun.river_bg(3.0)
         + place(gule(mouth="smile", look=0.4, turn=0.8, arm="down", dress=oyun.DRESS), 780, 1010, 1.0)
         + place(ciwan(mouth="smile", look=0.4, turn=0.8, arm="heart"), 1140, 1010, 1.0, flip=True))
heart = path("M960 420 C930 378 878 410 960 478 C1042 410 990 378 960 420 Z", "#e0485a", sw=6)

body = [camera(scene, 1.55, 960, 560),
        f'<rect width="{W}" height="{H}" fill="url(#vinyet)"/>',
        # üst başlık bandı
        text(960, 170, "BERFÎN û RONÎ", 150, "#fffaf0", "Cinzel", 900, stroke="#1b1512", stroke_width=16,
             paint_order="stroke"),
        text(960, 262, "Kurmancî fêr bibe · Kürtçe öğren", 62, GOLD, "Nunito", 900, stroke="#1b1512",
             stroke_width=12, paint_order="stroke"),
        heart,
        # seviye rozeti
        rect(40, 900, 470, 130, GOLD, 26, sw=8),
        text(275, 990, "A1 · A2 · B1", 76, INK, "Cinzel", 900),
        # sağ alt: altyazı vurgusu
        rect(1390, 900, 490, 130, "#1b1512", 26, sw=8, stroke="#fffaf0"),
        text(1635, 958, "KU + TR", 56, "#fffaf0", "Nunito", 900),
        text(1635, 1008, "altyazılı", 38, "#f1d9a0", "Nunito", 800)]

defs = DEFS.replace("</defs>", EXTRA_DEFS + oyun.MORE_DEFS + "</defs>")
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">{defs}'
       f'<rect width="{W}" height="{H}" fill="#f3e6c9"/>{"".join(body)}</svg>')
subprocess.run(["rsvg-convert", "-w", "1280", "-h", "720", "-o", out], input=svg.encode(), check=True)
print("OK", out)
