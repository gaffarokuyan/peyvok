# English styled subtitles (.ytt for YouTube) + .srt, from narration word timings
import json,html,math,itertools
tl=json.loads(open('timeline.js').read()[len('window.TL='):-1])
def ts(x): ms=int(round(x*1000));return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
def wrap(s,lim=42):
  if len(s)<=lim: return s
  ws=s.split();best=None
  for c in range(1,len(ws)):
    a,b=' '.join(ws[:c]),' '.join(ws[c:]);sc=max(len(a),len(b))
    if best is None or sc<best[0]: best=(sc,a+'\n'+b)
  return best[1]
cues=[]
for ch in tl['chapters']:
  if not ch.get('words'): continue
  cur=[]
  for i,(w,s,e) in enumerate(ch['words']):
    cur.append((w,ch['start']+s,ch['start']+e));txt=' '.join(x[0] for x in cur)
    nxt=ch['words'][i+1][0] if i+1<len(ch['words']) else ''
    if i==len(ch['words'])-1 or (w[-1] in '.!?' and len(txt)>12) or (w[-1] in ',:;' and len(txt)>40) or len(txt)+1+len(nxt)>80:
      cues.append([cur[0][1],cur[-1][2],txt]);cur=[]
for i,c in enumerate(cues):
  nx=cues[i+1][0] if i+1<len(cues) else c[1]+1.5;c[1]=min(max(c[1]+.3,c[0]+1.0),nx-.04)
HEAD='''<?xml version="1.0" encoding="utf-8"?>
<timedtext format="3">
<head>
<pen id="1" b="1" fc="#FFFFFF" fo="254" bc="#0A0810" bo="170" et="4" ec="#000000" fs="4" sz="110"/>
<pen id="2" b="1" fc="#F6D23A" fo="254" bc="#0A0810" bo="190" et="4" ec="#000000" fs="4" sz="110"/>
<wp id="1" ap="7" ah="50" av="92"/>
<ws id="1" ju="2"/>
</head>
<body>
'''
def body(t):
  # song/album titles in quotes -> yellow pen segments
  out=[];parts=t.split('"')
  for k,pz in enumerate(parts):
    if not pz: continue
    out.append(f'<s p="{2 if k%2 else 1}">{html.escape(("“"+pz+"”") if k%2 else pz,quote=False)}</s>')
  return ''.join(out)
import os;os.makedirs('out',exist_ok=True)
open('out/xxxtentacion_en.srt','w').write('\n'.join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{wrap(t)}\n" for i,(a,b,t) in enumerate(cues)))
open('out/xxxtentacion_en.ytt','w').write(HEAD+'\n'.join(f'<p t="{int(a*1000)}" d="{int((b-a)*1000)}" wp="1" ws="1">{body(wrap(t))}</p>' for a,b,t in cues)+'\n</body>\n</timedtext>\n')
print(len(cues),'cues')
