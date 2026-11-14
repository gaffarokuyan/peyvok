# Styled ASS subtitles (white bold on dark box, gold quotes; Turkish has word-by-word gold karaoke like the video)
import json,sys,itertools,math
sys.path.insert(0,'.')
cues=json.load(open('cues.json'));groups=json.load(open('groups.json'))
d=open('../film3/timeline.js').read();t=json.loads(d[d.index('{'):d.rindex('}')+1])
W=[]
for ch in t['chapters']:
  for w in (ch.get('words') or []):
    p=w[0].split();a=ch['start']+w[1];b=ch['start']+w[2]
    for k,x in enumerate(p): W.append((x,a+(b-a)*k/len(p),a+(b-a)*(k+1)/len(p)))
def wrapw(ws,lim):
  s=' '.join(ws)
  if len(s)<=lim or len(ws)<2: return [len(ws)]
  n=min(len(ws),max(2,math.ceil(len(s)/(lim+2))));best=None
  for cuts in itertools.combinations(range(1,len(ws)),n-1):
    b=(0,)+cuts+(len(ws),);sc=max(len(' '.join(ws[b[i]:b[i+1]])) for i in range(n))
    if best is None or sc<best[0]: best=(sc,[b[i+1]-b[i] for i in range(n)])
  return best[1]
def at(x):
  cs=int(round(x*100));return f"{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}"
def esc(s): return s.replace('{','(').replace('}',')')
gold=[('çiyan' in c[2] or c[2][:1] in '"“') for c in cues]
def header(font,rtl):
  return f"""[Script Info]
Title: Dîrok - Gutiler
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Dirok,{font},52,&H00FFFFFF,&H00FFFFFF,&H48040814,&H64000000,-1,0,0,0,100,100,0,0,3,14,3,2,120,120,52,1
Style: DirokKaraoke,{font},52,&H005AD6FF,&H00FFFFFF,&H48040814,&H64000000,-1,0,0,0,100,100,0,0,3,14,3,2,120,120,52,1
Style: DirokAlinti,{font},56,&H005AD6FF,&H005AD6FF,&H40040814,&H64000000,-1,-1,0,0,100,100,0,0,3,14,3,2,120,120,52,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
def texts(lang):
  if lang=='tr': return [c[2] for c in cues]
  lines=open(f'sentences_{lang}.txt').read().strip('\n').split('\n');out=[None]*len(cues)
  for g,tr in zip(groups,lines):
    ws=tr.split()
    P='Ji çiyan pê ve, hevalên me tune.'
    if P in tr and len(g)==2:
      k=tr.index(P);x=[tr[:k].strip(),P]
      for kk,i in enumerate(g): (out if 'out' in dir() else text)[i]=x[kk]
      continue
    if len(g)==1: out[g[0]]=tr;continue
    lens=[len(cues[i][2]) for i in g];tot=sum(lens);cum=0;cuts=[]
    for L in lens[:-1]: cum+=L;cuts.append(round(len(ws)*cum/tot))
    prev=0;fx=[]
    for k,c in enumerate(cuts): c=max(c,prev+1);c=min(c,len(ws)-(len(cuts)-k));fx.append(c);prev=c
    b=[0]+fx+[len(ws)]
    for k,i in enumerate(g): out[i]=' '.join(ws[b[k]:b[k+1]])
  return out
for lang in sys.argv[1:]:
  rtl=lang in ('ar','ckb');font='Arial' if rtl else 'Arial Black'
  tx=texts(lang);ev=[];wi=0
  for i,(a,b,_) in enumerate(cues):
    ws=tx[i].split();sizes=wrapw(ws,40 if not rtl else 44)
    if lang=='tr':
      tw=W[wi:wi+len(ws)];wi+=len(ws);parts=[];k=0;pos=0;tcur=a
      for n in sizes:
        seg=[]
        for j in range(pos,pos+n):
          dur=max(1,round((tw[j][2]-tcur)*100)) if j<len(tw) else 20
          seg.append(f"{{\\kf{dur}}}{esc(ws[j])}");tcur=tw[j][2] if j<len(tw) else tcur
        parts.append(' '.join(seg));pos+=n
      txt='\\N'.join(parts);st='DirokAlinti' if gold[i] else 'DirokKaraoke'
      if gold[i]: txt=txt.replace('\\kf','\\k0\\kf')  # quotes: plain gold
      if gold[i]: import re;txt=re.sub(r'\{\\k0\\kf\d+\}','',txt)
    else:
      pos=0;parts=[]
      for n in sizes: parts.append(esc(' '.join(ws[pos:pos+n])));pos+=n
      txt='\\N'.join(parts);st='DirokAlinti' if gold[i] else 'Dirok'
    ev.append(f"Dialogue: 0,{at(a)},{at(b)},{st},,0,0,0,,{txt}")
  open(f'dirok_gutiler_{lang}.ass','w',encoding='utf-8-sig').write(header(font,rtl)+'\n'.join(ev)+'\n')
  print(lang,len(ev))
