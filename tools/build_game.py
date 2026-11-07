"""source/peyvok.html -> assets/web/game.html (offline: Google Fonts linkleri gömülü fontlarla değiştirilir)."""
import re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
src = (R/'source/peyvok.html').read_text(encoding='utf-8')
fonts = (R/'source/fonts-inline.html').read_text(encoding='utf-8')
src = re.sub(r'<link rel="preconnect"[^>]*>\s*', '', src)
src, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', lambda m: fonts, src)
assert n == 1, 'Google Fonts linki bulunamadı'
head = ('<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,'
        'maximum-scale=1,user-scalable=no,viewport-fit=cover"><style>:root{color-scheme:light;box-sizing:border-box;'
        'padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:'
        'env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;'
        'background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>\n')
out = head + src.replace('<meta name="claude:viewport-fit-sides" content="cover">', '') + '\n</body></html>'
(R/'assets/web/game.html').write_text(out, encoding='utf-8')
print('assets/web/game.html', len(out))
