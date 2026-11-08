import json,numpy as np,subprocess,wave
SR=44100;TM=json.load(open("timing.json"));N=int(TM["end"]*SR)+SR;t=np.arange(N)/SR
m=np.zeros(N)
def env(n,a=.01,r=.3):
    e=np.ones(n);ai=int(a*SR);e[:ai]=np.linspace(0,1,ai);e*=np.exp(-np.arange(n)/SR/r);return e
# drone (D minor) with slow swell
for f,g in [(73.42,.10),(110,.06),(146.83,.04),(174.6,.025)]:
    m+=g*np.sin(2*np.pi*f*t+0.3*np.sin(2*np.pi*.07*t))*(.75+.25*np.sin(2*np.pi*.05*t+f))
# plucked mystery motif, 0.5s per step
mot=[293.7,349.2,440,415.3,293.7,349.2,392,349.2]
rng=np.random.default_rng(3)
for i,st in enumerate(np.arange(2.0,TM["end"]-3.5,0.5)):
    f=mot[i%8]*(0.5 if (i//16)%2 else 1);n=int(.9*SR);s=int(st*SR)
    x=np.sin(2*np.pi*f*np.arange(n)/SR)+.3*np.sin(4*np.pi*f*np.arange(n)/SR)
    m[s:s+n]+=.07*x*env(n,.005,.22)
# low pulse heartbeat
for st in np.arange(2.0,TM["end"]-3.5,1.0):
    n=int(.4*SR);s=int(st*SR);m[s:s+n]+=.16*np.sin(2*np.pi*55*np.arange(n)/SR)*env(n,.005,.09)
# train chug in scene 3 first half
L=TM["lines"];a=L[3]["start"]-.35;b=a+(L[4]["start"]-.35-a)*.48
for st in np.arange(a,b,0.19):
    n=int(.15*SR);s=int(st*SR);m[s:s+n]+=.12*rng.standard_normal(n)*env(n,.003,.04)
s=int((a+.2)*SR);n=int(1.2*SR);tt=np.arange(n)/SR;m[s:s+n]+=.05*(np.sin(2*np.pi*587*tt)+np.sin(2*np.pi*740*tt))*np.minimum(1,tt*8)*np.minimum(1,(1.2-tt)*4)
# end chord
s=int((TM["end"]-3.2)*SR);n=int(3.2*SR);tt=np.arange(n)/SR
for f in [146.83,220,293.7,349.2]:m[s:s+n]+=.06*np.sin(2*np.pi*f*tt)*np.minimum(1,tt*3)*np.minimum(1,(3.2-tt)*1.5)
m[:int(.8*SR)]*=np.linspace(0,1,int(.8*SR))
m=m/np.abs(m).max()*.5
w=wave.open("music.wav","wb");w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((m*32767).astype(np.int16).tobytes());w.close()
# narration mix with ffmpeg
ins=[];flt=[]
for i,l in enumerate(L):
    ins+=["-i",f"v{i}.mp3"];d=int(l["start"]*1000);flt.append(f"[{i}]adelay={d}|{d},volume=1.6[a{i}]")
k=len(L);ins+=["-i","music.wav"]
flt.append(f"[{k}]volume=0.55[m]")
flt.append("".join(f"[a{i}]" for i in range(k))+f"amix=inputs={k}:normalize=0[v];[v]asplit[v1][v2];[m][v1]sidechaincompress=threshold=0.05:ratio=4:release=400[md];[md][v2]amix=inputs=2:normalize=0,alimiter=limit=0.95[out]")
subprocess.run(["ffmpeg","-y","-v","error",*ins,"-filter_complex",";".join(flt),"-map","[out]","-ac","2","-ar","44100","mix.wav"],check=True)
