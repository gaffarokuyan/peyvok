import numpy as np, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H,FPS=1080,1920,30
S="../img/"
clips=[
 ("../gobekli_sky.jpg","Girê Miraza","Perestgeha herî kevn a cîhanê","Dünyanın en eski tapınağı",(0.5,0.35)),
 (S+"s0.webp","Çiyayê Agirî","Çiyayê agir û berfê","Ateşin ve karın dağı",(0.5,0.5)),
 (S+"s3.webp","Hesenkêf","Bi hezaran sal li ber Dîcleyê","Dicle kıyısında binlerce yıl",(0.5,0.5)),
 (S+"s4.webp","Mêrdîn","Bajarê kevirên zêrîn","Altın taşların şehri",(0.5,0.5)),
 (S+"s8.webp","Laliş","Cihê herî pîroz ê êzidiyan","Ezidilerin en kutsal yeri",(0.5,0.5)),
 (S+"s10.webp","Hewraman","Banê her xaniyî, hewşa yê jor e","Her evin damı, üsttekinin avlusu",(0.5,0.5)),
 (S+"s6.webp","Geliyê Rewandizê","Rê di nav çiyayan re diçin","Dağların arasından geçen yollar",(0.5,0.5)),
 (S+"s7.webp","Amêdî","Bajarê li ser zinar","Kayanın üstündeki şehir",(0.5,0.5)),
]
CL=3.25; XF=0.5; OUTRO=4.5
TOTAL=len(clips)*CL+OUTRO  # ~30.5
fC=lambda s:ImageFont.truetype("fonts/cinzel-900.ttf",s)
fN=lambda s:ImageFont.truetype("fonts/nunito-800.ttf",s)
def cover(im,scale):
    w,h=im.size;s=max(W*scale/w,H*scale/h);return im.resize((int(w*s+1),int(h*s+1)),Image.LANCZOS)
srcs=[cover(Image.open(p).convert("RGB"),1.16) for p,*_ in clips]
sea=cover(Image.open(S+"cov_sea.webp").convert("RGB"),1.10)
def kb(big,k,i):
    bw,bh=big.size;z=1.0+0.13*k  # zoom from 1/1.16 view
    cw,ch=int(bw/1.16/ (1+0.13*k)*1.0),int(bh/1.16/(1+0.13*k))
    cw=int(W*bw/(W*1.16)/(1+0.12*k)*1.0);ch=int(cw*H/W)
    dx=(bw-cw)*(0.5+(0.18 if i%2 else -0.18)*(k-0.5));dy=(bh-ch)*0.45
    return big.crop((int(dx),int(dy),int(dx)+cw,int(dy)+ch)).resize((W,H),Image.BILINEAR)
# gradient overlay
g=np.zeros((H,W,1),np.float32);ys=np.linspace(0,1,H)[:,None,None]
shade=np.clip((ys-0.55)/0.45,0,1)**1.4*0.78+np.clip((0.3-ys)/0.3,0,1)**1.2*0.55
def txtlayer(name,ku,tr,a,rise):
    L=Image.new("RGBA",(W,H),(0,0,0,0));d=ImageDraw.Draw(L)
    def ctext(y,s,font,fill,sp=0):
        if sp:
            ws=[d.textlength(c,font=font)+sp for c in s];x=(W-sum(ws)+sp)/2
            for c,wc in zip(s,ws):d.text((x,y),c,font=font,fill=fill);x+=wc
        else:
            x=(W-d.textlength(s,font=font))/2;d.text((x,y),s,font=font,fill=fill)
    y0=1430+rise
    ctext(y0,name.upper(),fC(30),(255,231,168,int(255*a)),sp=7)
    d.line(((W/2-60,y0+58),(W/2+60,y0+58)),fill=(242,184,75,int(220*a)),width=3)
    ctext(y0+86,ku,fN(62),(255,255,255,int(255*a)))
    ctext(y0+172,tr,fN(38),(235,225,205,int(215*a)))
    return L
def ease(x):x=min(max(x,0),1);return 1-(1-x)**3
proc=subprocess.Popen(["ffmpeg","-y","-v","error","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),"-i","-","-i","music.wav",
  "-c:v","libx264","-preset","medium","-crf","20","-pix_fmt","yuv420p","-c:a","aac","-b:a","160k","-shortest","-movflags","+faststart","peyvok_video.mp4"],stdin=subprocess.PIPE)
nf=int(TOTAL*FPS)
cache={}
for fi in range(nf):
    t=fi/FPS
    ci=min(int(t//CL),len(clips))
    if ci<len(clips):
        lt=t-ci*CL;k=(lt+XF)/(CL+XF)
        fr=np.asarray(kb(srcs[ci],k,ci),np.float32)
        if ci>0 and lt<XF:
            pk=(lt+CL)/(CL+XF);prev=np.asarray(kb(srcs[ci-1],pk,ci-1),np.float32);a=lt/XF;fr=prev*(1-a)+fr*a
        if ci==0 and lt<0.6: fr*=lt/0.6
        fr=fr*(1-shade)
        img=Image.fromarray(fr.clip(0,255).astype(np.uint8)).convert("RGBA")
        name,ku,tr=clips[ci][1:4]
        a=ease((lt-(1.55 if ci==0 else 0.35))/0.5)*(1-ease((lt-(CL-0.45))/0.4))
        if a>0.01:
            key=(ci,round(a,2),round((1-a)*30))
            img.alpha_composite(txtlayer(name,ku,tr,a,int((1-a)*30)))
        if ci==0 and lt<CL:
            b=ease((lt-0.15)/0.6)*(1-ease((lt-1.2)/0.35))
            L=Image.new("RGBA",(W,H));d=ImageDraw.Draw(L);s="12.000 SAL BERÊ"
            x=(W-d.textlength(s,font=fC(64)))/2;d.text((x,860),s,font=fC(72),fill=(255,240,200,int(255*b)))
            img.alpha_composite(L)
    else:
        lt=t-len(clips)*CL;k=lt/OUTRO
        fr=np.asarray(kb(sea,k*0.6,0),np.float32)
        if lt<XF:
            prev=np.asarray(kb(srcs[-1],1.0,len(clips)-1),np.float32)*(1-shade);a=lt/XF;fr=prev*(1-a)+fr*a
        fade=1-ease((lt-(OUTRO-0.8))/0.8);fr*=fade
        img=Image.fromarray(fr.clip(0,255).astype(np.uint8)).convert("RGBA")
        a=ease((lt-0.4)/0.8)*fade
        L=Image.new("RGBA",(W,H));d=ImageDraw.Draw(L)
        # gold wordmark
        f=fC(190);s="PEYVOK";tw=d.textlength(s,font=f);x=(W-tw)/2;y=640
        mask=Image.new("L",(W,H));ImageDraw.Draw(mask).text((x,y),s,font=f,fill=255)
        grad=np.zeros((H,W,3),np.uint8);c1=np.array([255,246,214]);c2=np.array([232,169,67]);c3=np.array([168,106,18])
        yy=np.clip((np.arange(H)-y-30)/200,0,1)[:,None]
        col=np.where(yy<0.5,c1+(c2-c1)*(yy/0.5),c2+(c3-c2)*((yy-0.5)/0.5));grad[:]=col[:,None,:].astype(np.uint8)
        sh=mask.filter(ImageFilter.GaussianBlur(14));shl=Image.new("RGBA",(W,H),(0,0,0,0));shl.putalpha(sh.point(lambda v:int(v*0.6*a)))
        img.alpha_composite(shl)
        gl=Image.fromarray(grad).convert("RGBA");gl.putalpha(mask.point(lambda v:int(v*a)))
        img.alpha_composite(gl)
        def ct(yv,s,font,fill,sp=0):
            ws=[d.textlength(c,font=font)+sp for c in s];xx=(W-sum(ws)+sp)/2
            for c,wc in zip(s,ws):d.text((xx,yv),c,font=font,fill=fill);xx+=wc
        b=ease((lt-0.9)/0.7)*fade
        ct(900,"RÊWÎTIYA PEYVAN",fC(40),(255,231,168,int(255*b)),sp=10)
        c=ease((lt-1.5)/0.7)*fade
        ct(1500,"Lîstika peyvan a bi Kurmancî",fN(52),(255,255,255,int(255*c)))
        ct(1580,"Zû tê Google Playê",fN(44),(255,231,168,int(235*c)))
        img.alpha_composite(L)
    proc.stdin.write(np.asarray(img.convert("RGB")).tobytes())
proc.stdin.close();proc.wait();print("done",nf)
