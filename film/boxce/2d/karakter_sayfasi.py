"""Karakter tasarım sayfası: python3 karakter_sayfasi.py <cikti.png>"""
import sys, subprocess, os
from karakter import gule, hevi, roni, svg_doc, place, INK

W, H = 1920, 1080
body = []
# zemin şeridi
body.append(f'<rect x="0" y="880" width="{W}" height="200" fill="#e6d3ad"/>')
body.append(f'<line x1="0" y1="880" x2="{W}" y2="880" stroke="{INK}" stroke-width="5"/>')
body.append(place(gule(mouth="smile"), 330, 900, 1.25))
body.append(place(hevi(mouth="smile", arm="point", phone=True), 700, 900, 1.25))
body.append(place(roni(mouth="flat", outfit="is"), 1110, 900, 1.25))
body.append(place(roni(mouth="smile", outfit="sal"), 1560, 900, 1.25))
labels = [(330, "GULÊ", "genç kız · başı açık"), (700, "HÊVÎ", "10 · küçük kız kardeşi"),
          (1110, "RONÎ", "İstanbul · iş kıyafeti"), (1560, "RONÎ", "final · şal û şapik")]
for x, n, d in labels:
    body.append(f'<text x="{x}" y="960" text-anchor="middle" font-family="Cinzel" font-weight="900" '
                f'font-size="46" fill="{INK}">{n}</text>')
    body.append(f'<text x="{x}" y="1004" text-anchor="middle" font-family="Nunito" font-weight="800" '
                f'font-size="28" fill="#5a4a3e">{d}</text>')
body.append(f'<text x="60" y="90" font-family="Cinzel" font-weight="900" font-size="64" fill="{INK}">BOXÇE</text>')
body.append(f'<text x="62" y="134" font-family="Nunito" font-weight="800" font-size="28" fill="#5a4a3e">karakterler</text>')

out = sys.argv[1] if len(sys.argv) > 1 else "karakterler.png"
svg = out.rsplit(".", 1)[0] + ".svg"
open(svg, "w").write(svg_doc(W, H, "\n".join(body)))
subprocess.run(["rsvg-convert", "-o", out, svg], check=True)
os.remove(svg)
print("OK", out)
