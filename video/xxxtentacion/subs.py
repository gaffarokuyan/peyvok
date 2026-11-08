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
# ---- burned-in karaoke ASS (spoken words turn yellow, song titles pink) ----
def at(x): cs=int(round(x*100));return f"{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}"
words=[]
for ch in tl['chapters']:
  if ch.get('words'): words+=[(w,ch['start']+s,ch['start']+e) for w,s,e in ch['words']]
ASS=['[Script Info]','ScriptType: v4.00+','PlayResX: 1920','PlayResY: 1080','WrapStyle: 2','','[V4+ Styles]',
 'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
 'Style: K,Inter ExtraBold,52,&H003AD2F6,&H00FFFFFF,&H00140A12,&H00000000,0,0,0,0,100,100,0.5,0,3,16,0,2,160,160,64,1','','[Events]','Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
wi=0
for a,b,t in cues:
  toks=t.split();seg=[]
  # locate words of this cue in global list
  while wi<len(words) and abs(words[wi][1]-a)>.02: wi+=1
  ws=words[wi:wi+len(toks)];wi+=len(toks)
  lines=wrap(t).split('\n');brk=len(lines[0].split()) if len(lines)>1 else -1
  inq=False;out=''
  for k,(w,s,e) in enumerate(ws):
    nxt=ws[k+1][1] if k+1<len(ws) else max(e,b-.05);d=max(1,int(round((nxt-s)*100)))
    q0=w.startswith('"');q1=w.rstrip('.,!?:;').endswith('"') or w.endswith('"')
    if q0: inq=True
    col='{\\1c&H6A4AFF&\\2c&H8A6AFF&}' if inq else '{\\1c&H3AD2F6&\\2c&HFFFFFF&}'
    if k==brk: out+='\\N'
    out+=f'{col}{{\\k{d}}}'+w.replace('"','')+(' ' if k+1<len(ws) and k+1!=brk else '')
    if q1 and not (q0 and len(w)<2): inq=False
  ASS.append(f'Dialogue: 0,{at(a)},{at(b)},K,,0,0,0,,{out}')
open('out/xxxtentacion_en.ass','w').write('\n'.join(ASS)+'\n');print('ass',len(cues))
