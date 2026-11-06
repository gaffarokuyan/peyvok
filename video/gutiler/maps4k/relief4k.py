# Realistic, vivid shaded-relief maps of Mesopotamia (Web Mercator, zoom-8 Terrarium DEM).
import sys, json, math, numpy as np
from PIL import Image, ImageDraw, ImageChops, ImageFilter
Image.MAX_IMAGE_PIXELS = None
TD = sys.argv[1]; OUT = sys.argv[2]
Z = 8; X0, X1, Y0, Y1 = 141, 172, 87, 110; T = 256
W = (X1 - X0 + 1) * T; H = (Y1 - Y0 + 1) * T; N = 2 ** Z * T
def gx(lon): return (lon + 180) / 360 * N - X0 * T
def gy(lat): return (1 - math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) / math.pi) / 2 * N - Y0 * T
def lat_of(y): return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + Y0 * T) / N))))
print('mosaic', W, H, flush=True)
e = np.zeros((H, W), np.float32)
for x in range(X0, X1 + 1):
    for y in range(Y0, Y1 + 1):
        a = np.asarray(Image.open(f'{TD}/{x}_{y}.png').convert('RGB')).astype(np.float32)
        e[(y - Y0) * T:(y - Y0 + 1) * T, (x - X0) * T:(x - X0 + 1) * T] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
# ---- land mask from Natural Earth land rings (even-odd)
land = json.loads(open(sys.argv[3]).read()[len('window.LAND='):-1])
mask = Image.new('1', (W, H), 0)
for ring in land:
    m = Image.new('1', (W, H), 0); ImageDraw.Draw(m).polygon([(gx(a), gy(b)) for a, b in ring], fill=1); mask = ImageChops.logical_xor(mask, m)
hyd = json.load(open(sys.argv[4]))
lakes = Image.new('L', (W, H), 0); dl = ImageDraw.Draw(lakes)
RES=[(38.5,37.5),(39.3,38.8),(38.2,36.0),(42.8,36.8),(43.3,33.9),(43.4,33.2),(43.9,32.7),(44.9,35.95),(45.7,35.1),(44.9,34.2),(42.3,34.3),(38.9,37.7),(40.5,38.5),(41.6,38.2),(39.6,36.7),(36.6,36.4),(43.7,36.4),(42.7,36.6),(47.2,33.2),(48.9,32.4),(49.9,31.6),(45.5,37.0),(46.5,36.7)]
def area(r):
    xs=[c[0] for c in r];ys=[c[1] for c in r];return (max(xs)-min(xs))*(max(ys)-min(ys))
for p in hyd['lakes']:
    r=p[0];cx=sum(c[0] for c in r)/len(r);cy=sum(c[1] for c in r)/len(r)
    if area(r)>15: continue
    if any(abs(cx-a)<0.45 and abs(cy-b)<0.35 for a,b in RES): continue
    if 37.5<cx<46.0 and 31.0<cy<38.45: continue
    dl.polygon([(gx(a), gy(b)) for a, b in r], fill=255)
rivers = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(rivers)
for p in hyd['rivers']:
    pts = [(gx(a), gy(b)) for a, b in p[0]]
    if len(pts) > 2: dr.polygon(pts, fill=150, outline=150, width=2)
L = np.asarray(mask.convert('L').filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
LK = np.asarray(lakes.filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
RV = np.asarray(rivers.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255
from skimage.graph import route_through_array
eh = np.asarray(Image.fromarray(e, 'F').resize((W // 2, H // 2), Image.BILINEAR)).astype(np.float32)
ehf = Image.fromarray(eh, 'F'); hh, ww = eh.shape
ebl = np.asarray(ehf.resize((ww // 12, hh // 12), Image.BILINEAR).resize((ww, hh), Image.BICUBIC)).astype(np.float32)
rel = eh - ebl
cost = (0.05 + np.exp(np.clip(rel, -30, 60) / 5.0)).astype(np.float64)
MAIN = {'dicle':([[39.4,38.5],[40.24,37.91],[41.0,37.8],[41.41,37.71],[42.19,37.33],[42.7,36.95],[43.13,36.34],[43.25,35.6],[43.68,34.6],[43.87,34.2],[44.2,33.7],[44.37,33.31],[44.9,32.8],[45.82,32.5],[46.6,32.1],[47.15,31.84],[47.43,31.0],[47.8,30.5],[48.5,29.95]],7),
 'firat':([[38.5,39.3],[38.75,38.8],[38.3,38.0],[37.98,37.0],[38.3,36.5],[39.0,35.95],[40.14,35.33],[40.92,34.45],[41.5,34.4],[42.38,34.13],[43.3,33.42],[43.78,33.35],[44.42,32.48],[44.9,32.0],[45.28,31.31],[46.26,31.05],[47.43,31.0]],7),
 'bzap':([[44.0,37.4],[44.6,36.9],[44.0,36.4],[43.4,36.1],[43.3,35.95]],4),'kzap':([[45.3,36.2],[44.6,35.9],[44.0,35.5],[43.45,35.2]],4),
 'diyala':([[46.0,35.3],[45.6,34.9],[45.2,34.2],[44.8,33.6],[44.5,33.25]],4),'habur':([[40.0,36.85],[40.75,36.5],[40.75,35.6],[40.45,35.15]],4),'belih':([[39.0,36.7],[39.05,35.95]],3),
 'karun':([[50.0,32.3],[49.2,32.2],[48.7,31.8],[48.6,31.3],[48.3,30.6]],4),'kerhe':([[47.6,33.6],[47.9,32.8],[48.2,32.2],[47.9,31.6],[47.6,31.3]],4),
 'aras':([[41.2,39.9],[43.0,40.1],[44.6,39.8],[45.6,39.0],[46.5,38.9],[47.9,39.6],[48.9,39.9]],4),'kura':([[43.3,41.5],[44.8,41.6],[46.5,41.0],[47.6,40.3],[48.9,39.9],[49.3,39.3]],5),
 'kizil':([[38.2,39.8],[36.8,39.3],[35.5,38.9],[34.2,39.1],[33.6,39.9],[34.0,40.8],[35.3,41.3],[35.9,41.7]],4),
 'nil':([[31.0,25.5],[31.2,27.0],[30.9,28.2],[31.2,29.6],[31.25,30.1],[30.6,30.9],[30.4,31.45]],6),'nil2':([[31.25,30.1],[31.6,30.8],[31.8,31.45]],4)}
traced={}
for name,(pts,wd) in MAIN.items():
    path=[]
    for (a0,b0),(a1,b1) in zip(pts[:-1],pts[1:]):
        p0=(int(gy(b0)/2),int(gx(a0)/2));p1=(int(gy(b1)/2),int(gx(a1)/2))
        r0=max(0,min(p0[0],p1[0])-40);r1=min(H//2,max(p0[0],p1[0])+40);c0=max(0,min(p0[1],p1[1])-40);c1=min(W//2,max(p0[1],p1[1])+40)
        try:
            idx,_=route_through_array(cost[r0:r1,c0:c1],(p0[0]-r0,p0[1]-c0),(p1[0]-r0,p1[1]-c0),fully_connected=True,geometric=True)
            path+= [(c*2+c0*2,r*2+r0*2) for r,c in idx]
        except Exception as ex: print('route fail',name,ex)
    # smooth
    if len(path)>7:
        arr=np.array(path,np.float32);k=9;ker=np.ones(k)/k
        sm=np.stack([np.convolve(np.pad(arr[:,i],(k//2,k//2),mode='edge'),ker,'valid') for i in range(2)],1)
        path=[tuple(p) for p in sm]
    traced[name]=(path,wd)
    dr.line(path, fill=255, width=wd, joint='curve')
RV = np.asarray(rivers.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255
json.dump({k:[[round(float(x),1),round(float(y),1)] for x,y in v[0][::3]] for k,v in traced.items()},open('rivers_traced_px.json','w'))
print('masks done', flush=True)
rows = np.arange(H) + Y0 * T
lat = np.degrees(np.arctan(np.sinh(np.pi * (1 - 2 * rows / N))))[:, None]
cols = np.arange(W) + X0 * T
lon = (cols / N * 360 - 180)[None, :]
# ---- hillshade (multi-directional) with vertical exaggeration
mpp = (156543.03 * np.cos(np.radians(lat)) / 2 ** Z)
ez = np.where(L > 0.5, e, e * 0.12)
gy_, gx_ = np.gradient(ez)
k = 2.6 / mpp
gx_ = gx_ * k; gy_ = gy_ * k
slope = np.arctan(np.hypot(gx_, gy_)); aspect = np.arctan2(-gx_, gy_)
alt = math.radians(42); hs = 0
for az, w in [(315, .42), (270, .22), (0, .18), (225, .18)]:
    a = math.radians(az)
    hs = hs + w * np.clip(np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(a - aspect), 0, 1)
hs = hs.astype(np.float32)
del gy_, gx_, slope, aspect
# local relief (ambient occlusion-ish)
ef = Image.fromarray(e.astype(np.float32), 'F'); eb = np.asarray(ef.resize((W // 16, H // 16), Image.BILINEAR).resize((W, H), Image.BILINEAR)).astype(np.float32)
loc = np.clip((e - eb) / 500, -1, 1)
def ramp(v, stops):
    xs = [s[0] for s in stops]; out = np.zeros(v.shape + (3,), np.float32)
    for c in range(3): out[..., c] = np.interp(v, xs, [s[1][c] for s in stops])
    return out
hx = lambda h: [int(h[i:i + 2], 16) for i in (1, 3, 5)]
land_c = ramp(e, [(-100, hx('#5e9a3a')), (0, hx('#5e9a3a')), (150, hx('#77a647')), (450, hx('#9db35d')), (850, hx('#c2b06c')), (1300, hx('#b8935e')),
                  (1900, hx('#9c7a57')), (2600, hx('#8b7766')), (3300, hx('#b4aca3')), (4000, hx('#f3f3f5'))])
# aridity: southern lowlands & Iranian plateau -> desert tones
arid = np.clip((36.2 - lat) / 4.5, 0, 1) * np.clip(1 - (e - 1100) / 1200, 0, 1)
arid = np.maximum(arid, np.clip((lon - 48.5) / 3, 0, 1) * np.clip((e - 700) / 400, 0, 1) * np.clip((38.2 - lat) / 2.5, 0, 1) * 0.75)
moist = np.clip((lat - 40.3) / 2.0, 0, 1) * np.clip(1 - (e - 1800) / 900, 0, 1)
desert = np.array(hx('#e0c48c'), np.float32)
lush = np.array(hx('#4f8f33'), np.float32)
land_c = land_c * (1 - arid[..., None] * .8) + desert * (arid[..., None] * .8)
land_c = land_c * (1 - moist[..., None] * .45) + lush * (moist[..., None] * .45)
# fertile river corridors (irrigated Mesopotamian plain)
rv8 = Image.fromarray((RV * 255).astype(np.uint8))
f1 = np.asarray(rv8.filter(ImageFilter.GaussianBlur(10))).astype(np.float32) / 255
f2 = np.asarray(rv8.filter(ImageFilter.GaussianBlur(45))).astype(np.float32) / 255
fert = np.clip(f1 * 3.5 + f2 * 5.0, 0, 1) * np.clip(1 - (e - 450) / 400, 0, 1) * np.clip((40 - lat) / 3, 0, 1)
green = np.array(hx('#5c9b37'), np.float32)
land_c = land_c * (1 - fert[..., None] * .85) + green * (fert[..., None] * .85)
shade = (0.52 + 0.62 * hs + 0.10 * loc)[..., None]
land_c = land_c * shade
print('land color done', flush=True)
# ---- sea (bathymetry). Caspian depth from distance to shore (DEM surface is flat there)
dep = -e.copy()
far = np.asarray(Image.fromarray((L * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(60))).astype(np.float32) / 255
cas = np.zeros_like(e, bool); x0, y0, x1, y1 = int(gx(46.0)), int(gy(47.6)), int(gx(55.5)), int(gy(36.2)); cas[y0:y1, x0:x1] = True
dep[cas] = np.clip((1 - far[cas]) * 1500 - 30, 0, None)
sea_c = ramp(dep, [(0, hx('#8fe0ec')), (25, hx('#5cc6e6')), (120, hx('#35a2dc')), (600, hx('#2479c4')), (1600, hx('#1a5aa6')), (3000, hx('#11407f'))])
bh = hs * .25 + .85
sea_c = sea_c * bh[..., None]
img = land_c * L[..., None] + sea_c * (1 - L[..., None])
# lakes & rivers
lake_c = np.array(hx('#3a9ad6'), np.float32); riv_c = np.array(hx('#1f7fd6'), np.float32)
img = img * (1 - LK[..., None]) + lake_c * LK[..., None]
rvw = RV * L * .95
img = img * (1 - rvw[..., None]) + riv_c * rvw[..., None]
# shoreline highlight
edge = np.abs(np.asarray(Image.fromarray((L * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES))).astype(np.float32) / 255
img = img + np.clip(edge, 0, 1)[..., None] * 25
full = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
print('full image done', flush=True)
# ---- crops
VIEWS = [('genis', 21.0, 62.0, 47.2, 3840, 2160), ('mezopotamya', 32.0, 54.5, 41.3, 3840, 2160), ('dikey', 34.0, 48.0, 46.9, 2160, 3840)]
meta = {}
for name, lo0, lo1, latTop, OW, OH in VIEWS:
    sx0, sx1 = gx(lo0), gx(lo1); s = OW / (sx1 - sx0); sy0 = gy(latTop); sy1 = sy0 + OH / s
    crop = full.crop((int(sx0), int(sy0), int(math.ceil(sx1)), int(math.ceil(sy1)))).resize((OW, OH), Image.LANCZOS)
    crop = crop.filter(ImageFilter.UnsharpMask(radius=1.4, percent=70, threshold=2))
    crop.save(f'{OUT}/base_{name}.png', optimize=True)
    meta[name] = {'x0': sx0 + X0 * T, 'y0': sy0 + Y0 * T, 'scale': s, 'W': OW, 'H': OH, 'latBottom': lat_of(sy1)}
    print(name, 'lat bottom', round(lat_of(sy1), 2), 'scale', round(s, 3), flush=True)
json.dump(meta, open(f'{OUT}/views.json', 'w'))
