# Cut user's narration takes into chapters, removing spoken headings; build word timings from STT.
import json, subprocess
def W(n): return [w for w in json.load(open(f'gu{n}.stt.json'))['words'] if w['type']=='word']
def find(ws,text,start=0):
    for i in range(start,len(ws)):
        if ws[i]['text'].strip('.,:;"?!').lower().startswith(text.lower()): return i
    raise Exception('nf '+text)
# piece = (file n, from word text (or None=start), to word text inclusive (or None=end))
CH={0:[(1,None,'geldiniz')],1:[(1,'Dicle','diyordu'),(2,None,'gelecekti')],2:[(2,'Mezopotamya','geçti')],3:[(2,'Sümer#dv',None),(3,None,None)],
    4:[(4,'Yaklaşık','olmadı')],5:[(4,'Sonraki','etti.#')],6:[(4,'Gutiler#gk',None),(7,None,'kılıyor')],7:[(7,'Mezopotamya#kl',None)]}
def idx(ws,spec,start=0):
    if '#' in spec:
        t,k=spec.split('#')
        if k=='2':
            i=find(ws,t,start); return find(ws,t,i+1)
        if k=='': # 'etti.' after 'tanımlamaya'
            i=find(ws,'tanımlamaya',start); return find(ws,'etti',i)
        if k=='gk':
            i=find(ws,'Kürtler',find(ws,'tanımlamaya')); return i+1
        if k=='dv':
            return find(ws,t,find(ws,'Devleti'))
        if k=='kl':
            return find(ws,t,find(ws,'kılıyor'))
    return find(ws,spec,start)
out={}
PAD=0.12
for c,pieces in CH.items():
    segs=[];words=[];t=0.0
    for (n,a,b) in pieces:
        ws=W(n); ia=0 if a is None else idx(ws,a); ib=len(ws)-1 if b is None else idx(ws,b,ia)
        s=max(0,ws[ia]['start']-PAD); e=ws[ib]['end']+0.25
        if a is None: s=0
        segs.append((n,s,e))
        for w in ws[ia:ib+1]: words.append([w['text'],round(w['start']-s+t,3),round(w['end']-s+t,3)])
        t+=e-s+0.45
    # ffmpeg concat with 0.45s silence between pieces
    inp=[];flt=[];lab=[]
    for k,(n,s,e) in enumerate(segs):
        inp+=['-ss',f'{s:.3f}','-to',f'{e:.3f}','-i',f'gu{n}.mp3']
        flt.append(f'[{k}]aresample=48000,aformat=channel_layouts=mono,afade=t=in:d=0.03,afade=t=out:st={e-s-0.08:.3f}:d=0.08,apad=pad_dur=0.45[p{k}]');lab.append(f'[p{k}]')
    flt.append(''.join(lab)+f'concat=n={len(segs)}:v=0:a=1,atrim=0:{t-0.2:.3f}[o]')
    subprocess.run(['ffmpeg','-y','-loglevel','error',*inp,'-filter_complex',';'.join(flt),'-map','[o]',f'ch{c:02d}.wav'],check=True)
    json.dump(words,open(f'ch{c:02d}.words.json','w'),ensure_ascii=False)
    print(c,round(t,1),'s',words[0][0],'...',words[-1][0])
