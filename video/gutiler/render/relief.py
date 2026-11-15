# Builds a shaded-relief Web-Mercator mosaic (zoom 7, tiles x72-86, y44-55) from Terrarium DEM tiles.
import sys, json, math, numpy as np
from PIL import Image, ImageDraw, ImageChops, ImageFilter
TD=sys.argv[1]; Z=7; X0,X1,Y0,Y1=72,86,44,55; T=256
W=(X1-X0+1)*T; H=(Y1-Y0+1)*T
e=np.zeros((H,W),np.float32)
for x in range(X0,X1+1):
  for y in range(Y0,Y1+1):
    a=np.asarray(Image.open(f'{TD}/{x}_{y}.png').convert('RGB')).astype(np.float32)
    e[(y-Y0)*T:(y-Y0+1)*T,(x-X0)*T:(x-X0+1)*T]=a[...,0]*256+a[...,1]+a[...,2]/256-32768
N=2**Z*T
def px(lon,lat): return ((lon+180)/360*N-X0*T, (1-math.log(math.tan(math.pi/4+math.radians(lat)/2))/math.pi)/2*N-Y0*T)
land=json.loads(open('land.js').read()[len('window.LAND='):-1])
mask=Image.new('1',(W,H),0)
for ring in land:
  m=Image.new('1',(W,H),0); ImageDraw.Draw(m).polygon([px(*p) for p in ring],fill=1); mask=ImageChops.logical_xor(mask,m)
L=np.asarray(mask.convert('L').filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)/255
# latitude per row
rows=np.arange(H)+Y0*T; lat=np.degrees(np.arctan(np.sinh(math.pi*(1-2*rows/N))))[:,None]
# hillshade
ez=e.copy(); ez[ez<0]*=0.15
gy,gx=np.gradient(ez); k=1/ (156543.03*np.cos(np.radians(lat))/2**Z)*2.2  # m per px -> exaggeration
gx*=k; gy*=k
az,alt=math.radians(315),math.radians(40)
slope=np.arctan(np.hypot(gx,gy)); aspect=np.arctan2(-gx,gy)
hs=np.sin(alt)*np.cos(slope)+np.cos(alt)*np.sin(slope)*np.cos(az-aspect); hs=np.clip(hs,0,1)
def ramp(v,stops):
  xs=[s[0] for s in stops]; out=np.zeros(v.shape+(3,),np.float32)
  for c in range(3): out[...,c]=np.interp(v,xs,[s[1][c] for s in stops])
  return out
hx=lambda h:[int(h[i:i+2],16) for i in (1,3,5)]
landc=ramp(e,[(-50,hx('#5d8f3c')),(0,hx('#5d8f3c')),(250,hx('#79a049')),(600,hx('#a3a95e')),(1100,hx('#b39a62')),(1700,hx('#9a7850')),(2500,hx('#876547')),(3300,hx('#b9ab98')),(4300,hx('#f2efe8'))])
desert=np.clip((35.5-lat)/4.5,0,1)*np.clip(1-(e-900)/900,0,1)
landc=landc*(1-desert[...,None]*.75)+np.array(hx('#d6bb80'),np.float32)*(desert[...,None]*.75)
shade=(0.50+0.75*hs)[...,None]; landc*=shade
dep=-e.copy()
from PIL import ImageFilter as F
far=np.asarray(Image.fromarray((L*255).astype(np.uint8)).filter(F.GaussianBlur(40))).astype(np.float32)/255
cx0,cy0=px(46.0,47.5); cx1,cy1=px(55.5,36.2); box=np.zeros_like(e,bool); box[int(cy0):int(cy1),int(cx0):int(cx1)]=True
dep[box]=np.clip((1-far[box])*1400-40,0,None)
seac=ramp(dep,[(0,hx('#78c0e6')),(60,hx('#4f9fd4')),(400,hx('#2f78bb')),(1500,hx('#1d559c')),(3000,hx('#123f7c'))])*(0.85+0.25*hs)[...,None]
img=landc*L[...,None]+seac*(1-L[...,None])
Image.fromarray(np.clip(img,0,255).astype(np.uint8)).save('relief.jpg',quality=92)
lon0=X0*T/N*360-180; lon1=(X1+1)*T/N*360-180
lat0=math.degrees(math.atan(math.sinh(math.pi*(1-2*Y0*T/N)))); lat1=math.degrees(math.atan(math.sinh(math.pi*(1-2*(Y1+1)*T/N))))
open('relief_bounds.js','w').write(f'window.RELIEF={{lon0:{lon0},lon1:{lon1},lat0:{lat0},lat1:{lat1}}};')
print(W,H,lon0,lon1,lat0,lat1)
