import numpy as np, wave
SR=44100; T=30.5; N=int(SR*T)
out=np.zeros(N)
def ks(f,dur,amp=0.3,bright=0.5):
    n=int(SR*dur); p=int(SR/f); buf=(np.random.rand(p)*2-1)
    y=np.zeros(n)
    for i in range(n):
        y[i]=buf[i%p]; buf[i%p]=0.5*(buf[i%p]+buf[(i+1)%p])*0.996
    env=np.exp(-np.arange(n)/SR*1.6)
    return y*env*amp
D=146.83
hij=[0,1,4,5,7,8,10,12,13,16]
f=lambda s:D*2**(s/12)
# drone
t=np.arange(N)/SR
drone=(0.06*np.sin(2*np.pi*D/2*t)+0.04*np.sin(2*np.pi*D*t)+0.02*np.sin(2*np.pi*D*1.5*t))*(0.8+0.2*np.sin(2*np.pi*0.1*t))
out+=drone
# melody (tembûr-like plucks)
rng=np.random.default_rng(7);beat=60/72
mel=[7,8,7,5,4,5,4,1,0,1,4,5,7,8,10,8,7,5,4,1,0,0,4,5,7,10,12,10,8,7,5,4,5,7,4,1,0]
tt=0.6;k=0
while tt<T-2:
    s=mel[k%len(mel)];dur=beat*(2 if k%4==3 else 1)
    note=ks(f(s+12),min(2.5,T-tt),0.22)
    i=int(tt*SR);out[i:i+len(note)]+=note[:N-i]
    if k%2==0:
        n2=ks(f(s),min(2.5,T-tt),0.08); out[i:i+len(n2)]+=n2[:N-i]
    tt+=dur/2*(1 if k%3 else 1.0);k+=1
# soft daf on beats from 4s
for b in np.arange(4,T-2,beat*2):
    i=int(b*SR);n=int(0.25*SR);env=np.exp(-np.arange(n)/SR*18)
    hit=np.sin(2*np.pi*70*np.arange(n)/SR)*env*0.12+(rng.random(n)*2-1)*np.exp(-np.arange(n)/SR*40)*0.03
    out[i:i+n]+=hit[:N-i]
# reverb
ir=(rng.random(int(SR*1.8))*2-1)*np.exp(-np.arange(int(SR*1.8))/SR*3)*0.02
from numpy.fft import rfft,irfft
L=1<<int(np.ceil(np.log2(N+len(ir))))
wet=irfft(rfft(out,L)*rfft(ir,L),L)[:N]
mix=out*0.8+wet*0.6
fade=np.ones(N);fi=int(1.5*SR);fo=int(2.5*SR);fade[:fi]=np.linspace(0,1,fi);fade[-fo:]=np.linspace(1,0,fo)
mix*=fade; mix/=np.max(np.abs(mix))*1.15
st=np.stack([mix,np.roll(mix,300)],1)
w=wave.open("music.wav","wb");w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype(np.int16).tobytes());w.close()
print("ok")
