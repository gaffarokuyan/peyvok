# Original score (code-synthesized): sad lo-fi piano + emo-trap beat, arranged per chapter
import json,numpy as np
from scipy.signal import fftconvolve, butter, sosfilt
from scipy.io import wavfile
SR=44100;tl=json.loads(open('timeline.js').read()[len('window.TL='):-1]);T=tl['total']
C={c['id']:c for c in tl['chapters']};card=lambda k:C[k]['card'];N=int(T*SR)+SR
rng=np.random.default_rng(7)
BPM=70;BEAT=60/BPM;BAR=4*BEAT
def env(n,a,d): t=np.arange(n)/SR;e=np.minimum(1,t/max(a,1e-4))*np.exp(-t/d);return e
def note(m): return 440*2**((m-69)/12)
def add(buf,x,t):
  i=int(t*SR)
  if i>=len(buf): return
  x=x[:len(buf)-i];buf[i:i+len(x)]+=x
def piano(f,dur=2.6,v=.2):
  n=int(dur*SR);t=np.arange(n)/SR;x=sum((.6**k)*np.sin(2*np.pi*f*(k+1)*t*(1+.0007*k))*np.exp(-t*(1.2+k*.9)) for k in range(6))
  return v*x*np.minimum(1,t/.004)
def pad(fs,dur,v=.05):
  n=int(dur*SR);t=np.arange(n)/SR;x=np.zeros(n)
  for f in fs:
    for dt in (-.004,.004): ph=2*np.pi*f*(1+dt)*t;x+=sum(np.sin(ph*k)/k for k in range(1,7))
  x=sosfilt(butter(2,1100,fs=SR,output='sos'),x);e=np.minimum(1,t/1.2)*np.minimum(1,(dur-t)/1.2);return v*x*e/len(fs)
def kick(v=.9):
  n=int(.5*SR);t=np.arange(n)/SR;f=50+110*np.exp(-t*30);return v*np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*7)
def b808(f,dur,v=.55):
  n=int(dur*SR);t=np.arange(n)/SR;ff=f*(1+.6*np.exp(-t*40));x=np.tanh(1.6*np.sin(2*np.pi*np.cumsum(ff)/SR));return v*x*np.exp(-t*1.1)*np.minimum(1,(dur-t)/.03+0)
HP=butter(4,7000,'hp',fs=SR,output='sos')
def hat(v=.12,d=.035):
  n=int(.12*SR);x=sosfilt(HP,rng.standard_normal(n));return v*x*np.exp(-np.arange(n)/SR/d)
def snare(v=.35):
  n=int(.35*SR);t=np.arange(n)/SR;x=sosfilt(butter(2,[900,6000],'bp',fs=SR,output='sos'),rng.standard_normal(n))*np.exp(-t*14)+.5*np.sin(2*np.pi*190*t)*np.exp(-t*25);return v*x
def pluck(f,dur=1.6,v=.16):
  n=int(dur*SR);p=max(2,int(SR/f));buf=rng.uniform(-1,1,p);out=np.zeros(n)
  for i in range(n): out[i]=buf[i%p];buf[i%p]=.996*.5*(buf[i%p]+buf[(i+1)%p])
  return v*out
# chords Am F C Em  (MIDI)
PROG=[(57,[57,60,64]),(53,[53,57,60]),(48,[55,60,64]),(52,[52,55,59])]
piano_b=np.zeros(N);pad_b=np.zeros(N);drum_b=np.zeros(N);bass_b=np.zeros(N);gtr_b=np.zeros(N)
def section(a,b,pianoOn=True,padOn=True,beat=0,gtr=False,heart=False,pv=1.0):
  t=a;bi=0
  while t<b-.5:
    root,ch=PROG[bi%4]
    if padOn: add(pad_b,pad([note(m) for m in ch],BAR+1.2),t)
    if pianoOn:
      pat=[0,1,2,1,0,2,1,2] if bi%2==0 else [0,2,1,2,0,1,2,1]
      for k,ix in enumerate(pat): add(piano_b,piano(note(ch[ix]+12),v=.12*pv*(1 if k%4==0 else .8)),t+k*BEAT/2)
      add(piano_b,piano(note(root-12),3.5,.13*pv),t)
    if gtr:
      for k,ix in enumerate([0,1,2,1,2,1,0,1]): add(gtr_b,pluck(note(ch[ix]+(12 if k%3 else 0))),t+k*BEAT/2+.01*k)
    if heart:
      for k in range(4): add(drum_b,kick(.5),t+k*BEAT);add(drum_b,kick(.3),t+k*BEAT+.22)
    if beat:
      add(drum_b,kick(),t);add(drum_b,kick(.7),t+2.5*BEAT);add(drum_b,snare(),t+2*BEAT)
      add(bass_b,b808(note(root-24),BEAT*2.4),t);add(bass_b,b808(note(root-24),BEAT*1.4,.45),t+2.5*BEAT)
      for k in range(16 if beat>1 else 8):
        st=BAR/(16 if beat>1 else 8);add(drum_b,hat(.1 if k%2 else .14),t+k*st)
        if beat>1 and bi%2==1 and k in (13,14,15):
          for r in range(3): add(drum_b,hat(.07),t+k*st+r*st/3)
    t+=BAR;bi+=1
A=lambda k:card(k) if card(k) else C[k]['start']
section(0,A('ch01')-6,pianoOn=False,heart=True)                 # cold open: drone + heartbeat
section(A('ch01')-6.5,A('ch03'),beat=0,pv=1)                     # childhood: lo-fi piano
section(A('ch03'),A('ch04'),beat=2)                              # Look at Me: beat drops
section(A('ch04'),A('ch05'),pianoOn=False)                       # charges: tense pad only
section(A('ch05'),A('ch07'),beat=1,gtr=True,pv=.8)               # 17 / ?: guitar + beat
section(A('ch07'),A('ch09'),pianoOn=True,heart=True,pv=.7)       # death & trial: somber
section(A('ch09'),tl['logo']+6,beat=1,gtr=True,pv=.9)            # legacy
# vinyl
crack=np.zeros(N);idx=rng.integers(0,N,int(T*9));crack[idx]=rng.uniform(-.25,.25,len(idx));crack=sosfilt(butter(2,3000,'hp',fs=SR,output='sos'),crack)+.004*sosfilt(butter(2,[300,3000],'bp',fs=SR,output='sos'),rng.standard_normal(N))
IR=rng.standard_normal(int(2.4*SR))*np.exp(-np.arange(int(2.4*SR))/SR/.55);IR/=np.abs(IR).sum()/6
wet=fftconvolve(piano_b+gtr_b+pad_b*.6,IR)[:N]
L=piano_b*.9+pad_b+drum_b+bass_b+gtr_b*.8+wet*.35+crack
L=sosfilt(butter(2,30,'hp',fs=SR,output='sos'),L)
# stereo widening via small delay
R=np.roll(L,int(.011*SR))*.9+L*.1;st=np.stack([L,R],1)
fo=int(4*SR);st[-fo:]*=np.linspace(1,0,fo)[:,None];st[:SR]*=np.linspace(0,1,SR)[:,None]
st=np.tanh(st/np.abs(st).max()*1.6)*.9
wavfile.write('audio/score.wav',SR,(st*32767).astype(np.int16));print('score',T)
