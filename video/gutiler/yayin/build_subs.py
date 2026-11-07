import json,html,sys
cues=json.load(open('cues.json'));groups=json.load(open('groups.json'))
import itertools,math
def wrap(s,lim=42):
  if len(s)<=lim: return s
  ws=s.split();n=min(len(ws),max(2,math.ceil(len(s)/(lim+2))))
  best=None
  for cuts in itertools.combinations(range(1,len(ws)),n-1):
    b=(0,)+cuts+(len(ws),);ls=[' '.join(ws[b[i]:b[i+1]]) for i in range(n)];sc=max(map(len,ls))
    if best is None or sc<best[0]: best=(sc,ls)
  return '\n'.join(best[1])
def ts(x):
  ms=int(round(x*1000));return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
HEAD='''<?xml version="1.0" encoding="utf-8"?>
<timedtext format="3">
<head>
<pen id="1" b="1" fc="#FFFFFF" fo="254" bc="#140804" bo="170" et="4" ec="#000000" fs="4" sz="110"/>
<pen id="2" b="1" i="1" fc="#FFD65A" fo="254" bc="#140804" bo="190" et="4" ec="#000000" fs="4" sz="115"/>
<wp id="1" ap="7" ah="50" av="92"/>
<ws id="1" ju="2"/>
</head>
<body>
'''
gold=[('çiyan' in c[2] or c[2][:1] in '"“') for c in cues]
for lang in sys.argv[1:]:
  lines=open(f'sentences_{lang}.txt').read().strip('\n').split('\n');assert len(lines)==len(groups),(lang,len(lines))
  text=[None]*len(cues)
  for g,tr in zip(groups,lines):
    ws=tr.split()
    if len(g)==1: text[g[0]]=tr;continue
    lens=[len(cues[i][2]) for i in g];tot=sum(lens);cum=0;cuts=[]
    for L in lens[:-1]:
      cum+=L;cuts.append(round(len(ws)*cum/tot))
    # ensure strictly increasing, non-empty pieces
    prev=0;fixed=[]
    for k,c in enumerate(cuts):
      c=max(c,prev+1);c=min(c,len(ws)-(len(cuts)-k));fixed.append(c);prev=c
    b=[0]+fixed+[len(ws)]
    for k,i in enumerate(g): text[i]=' '.join(ws[b[k]:b[k+1]])
  lim=42
  with open(f'dirok_gutiler_{lang}.srt','w') as f:
    f.write('\n'.join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{wrap(text[i],lim)}\n" for i,(a,b,_) in enumerate(cues)))
  rows=[f'<p t="{int(a*1000)}" d="{int((b-a)*1000)}" wp="1" ws="1"><s p="{2 if gold[i] else 1}">{html.escape(wrap(text[i],lim),quote=False)}</s></p>' for i,(a,b,_) in enumerate(cues)]
  open(f'dirok_gutiler_{lang}.ytt','w').write(HEAD+'\n'.join(rows)+'\n</body>\n</timedtext>\n')
  print(lang,'ok',max(len(l) for t in text for l in wrap(t,lim).split('\n')))
