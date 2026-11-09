// "Kürtçe mi daha zengin, Türkçe mi?" — vertical short (1080x1920), pure canvas
const W=1080,H=1920,TAU=Math.PI*2,cv=document.getElementById('c'),X=cv.getContext('2d');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,eout=t=>1-Math.pow(1-clamp(t),3),eback=t=>{t=clamp(t);const c=2.2;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const OFF=.5,NAR=WORDS[WORDS.length-1][2],END=OFF+NAR+.5,TOTAL=END+3.6;window.TOTAL=TOTAL;
const norm=w=>w.toLowerCase().replace(/[^a-zçğıöşü0-9]/g,'');
const MISS=[];function cue(q,n=1,o=0){const ps=q.split(' ').map(norm);for(let i=0;i<WORDS.length;i++){if(ps.every((p,j)=>WORDS[i+j]&&norm(WORDS[i+j][0]).startsWith(p))){if(--n===0)return OFF+WORDS[i][1]+o}}MISS.push(q);return 0}
const K={c1:'#ffcf3a',c2:'#ff7a1a',bg:['#3b0d1e','#8a1f2a','#e2572a']},T_={c1:'#4ae0d0',c2:'#1a8cff',bg:['#06203a','#0b4a7a','#16a3b8']};
const LOGO=new Image();LOGO.src='logo.png';const KLOGO=new Image();KLOGO.src='logo_kurdi.jpg';
window.ready=Promise.all([...['400 40px Anton','800 40px InterB','900 40px CinzelD','800 40px Kufi'].map(f=>document.fonts.load(f,'Kürtçeşğİ سۆرانی')),LOGO.decode(),KLOGO.decode()]).then(()=>true);
function bg(cols,t,seed=0){const g=X.createLinearGradient(0,0,W*.3,H);g.addColorStop(0,cols[0]);g.addColorStop(.6,cols[1]);g.addColorStop(1,cols[2]);X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.globalCompositeOperation='screen';for(let i=0;i<26;i++){const x=hash(i+seed)*W,y=(hash(i+seed+9)*H+t*(20+hash(i)*40))%H,r=40+hash(i+3)*160;const rg=X.createRadialGradient(x,H-y,0,x,H-y,r);rg.addColorStop(0,'rgba(255,255,255,.10)');rg.addColorStop(1,'rgba(255,255,255,0)');X.fillStyle=rg;X.fillRect(x-r,H-y-r,r*2,r*2)}X.restore();
  X.save();X.translate(W/2,H*.42);X.rotate(t*.06);X.globalAlpha=.06;X.fillStyle='#fff';for(let i=0;i<18;i++){X.rotate(TAU/18);X.beginPath();X.moveTo(-50,0);X.lineTo(0,-1600);X.lineTo(50,0);X.fill()}X.restore()}
function tx(s,x,y,size,fill,o={}){X.save();X.font=`${o.w||''} ${size}px ${o.f||'Anton'}`;X.textAlign=o.al||'center';X.textBaseline=o.bl||'middle';if(o.ls)X.letterSpacing=o.ls+'px';let sz=size;while(o.maxW&&X.measureText(s).width>o.maxW){sz-=4;X.font=`${o.w||''} ${sz}px ${o.f||'Anton'}`}
  X.globalAlpha*=o.a??1;X.lineJoin='round';if(o.st!==0){X.shadowColor='rgba(0,0,0,.55)';X.shadowBlur=30;X.shadowOffsetY=8;X.lineWidth=o.st||sz*.14;X.strokeStyle=o.sc||'#1a0a10';X.strokeText(s,x,y);X.shadowColor='transparent'}
  if(Array.isArray(fill)){const g=X.createLinearGradient(0,y-sz*.5,0,y+sz*.5);g.addColorStop(0,fill[0]);g.addColorStop(1,fill[1]);X.fillStyle=g}else X.fillStyle=fill;X.fillText(s,x,y);X.restore();return sz}
function pop(t,t0,d=.45){return eback((t-t0)/d)}
function chip(s,x,y,k,cols,o={}){if(k<=0)return;X.save();X.translate(x,y);X.scale(k,k);X.font=`${o.size||64}px ${o.f||'Anton'}`;const w=(o.w||X.measureText(s).width+90),h=o.h||120;X.shadowColor='rgba(0,0,0,.45)';X.shadowBlur=30;X.shadowOffsetY=12;const g=X.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);X.fillStyle=g;X.beginPath();X.roundRect(-w/2,-h/2,w,h,h*.3);X.fill();X.shadowColor='transparent';X.lineWidth=5;X.strokeStyle='rgba(255,255,255,.7)';X.stroke();X.restore();
  X.save();X.translate(x,y);X.scale(k,k);tx(s,0,4,o.size||64,o.fg||'#1a0a10',{st:0,f:o.f});if(o.sub){tx(o.sub,0,h/2+44,40,'#fff',{f:'InterB',w:800,st:8})}X.restore()}
function header(s,cols,k){X.save();X.translate(W/2,330);X.scale(lerp(1.6,1,k),lerp(1.6,1,k));X.globalAlpha=clamp(k*2);tx(s,0,0,230,cols,{ls:4,st:30});X.restore()}
function sHook(t){ // split
  X.save();X.beginPath();X.moveTo(0,0);X.lineTo(W,0);X.lineTo(W,H*.44);X.lineTo(0,H*.56);X.clip();bg(K.bg,t,1);X.restore();
  X.save();X.beginPath();X.moveTo(0,H*.56);X.lineTo(W,H*.44);X.lineTo(W,H);X.lineTo(0,H);X.clip();bg(T_.bg,t,7);X.restore();
  X.save();X.strokeStyle='#fff';X.lineWidth=14;X.shadowColor='#fff';X.shadowBlur=40;X.beginPath();X.moveTo(-20,H*.56+1);X.lineTo(W+20,H*.44-1);X.stroke();X.restore();
  const k1=pop(t,.15),k2=pop(t,.55);X.save();X.translate(W/2,560);X.rotate(-.11);X.scale(k1,k1);tx('KURDISH',0,0,250,[K.c1,K.c2],{ls:4,st:34});X.restore();
  X.save();X.translate(W/2,1340);X.rotate(-.11);X.scale(Math.max(0,k2),Math.max(0,k2));tx('TURKISH',0,0,250,[T_.c1,T_.c2],{ls:4,st:34,sc:'#04121e'});X.restore();
  const kv=pop(t,.95,.5);if(kv>0){X.save();X.translate(W/2,H/2);X.scale(kv*(1+.05*Math.sin(t*8)),kv*(1+.05*Math.sin(t*8)));X.rotate(-.11);X.fillStyle='#fff';X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=40;X.beginPath();X.arc(0,0,120,0,TAU);X.fill();X.shadowColor='transparent';tx('VS',0,8,130,'#d0122a',{st:0});X.restore()}
  const kq=clamp((t-1.5)/.4);if(kq>0){X.save();X.globalAlpha=kq;chip('WHICH IS RICHER?',W/2,270,1,['#fff','#ffe9a8'],{size:74,h:140});X.restore()}
}
const DIA=[['KURMANCÎ',290,720,-.03,'Behdînî · Botanî · Serhedî'],['SORANÎ',790,720,.03,'Silêmanî · Mukrî · Erdelanî'],['KELHURÎ',290,990,.02,'Feylî · Kirmaşanî'],['ZAZAKÎ',790,990,-.02,'Kirmanckî · Dimilkî'],['GORANÎ',290,1260,-.02,'Hewramî'],['LEKÎ',790,1260,.03,'']];
// ---------- scenes (v2: Bakiler + Vikisözlük) ----------
const C={once:cue('first'),yavuz:cue('yavuz'),nediyor:cue('bakiler'),bak:cue('in his'),kas:cue('the dictionary'),r1:cue('nine thousand'),sem:cue('şemsettin'),r2:cue('eighteen'),tdk:cue('the turkish language'),r3:cue('eighty'),oz:cue('and the pure'),r4:cue('only three'),
 soru:cue('and bakiler'),q:cue('three thousand',2),simdi:cue('now lets'),rud:cue('according'),sek:cue('eighth'),geri:cue('turkish persian'),ust:cue('and kurdish is'),haz:cue('treasury'),d:[cue('kurmanji'),cue('sorani'),cue('kelhuri'),cue('zazaki'),cue('gorani'),cue('laki')],
 nasil:cue('so how'),dev:cue('no state'),okul:cue('no schools'),yas:cue('banned'),resmi:cue('pass the'),bugun:cue('one of the largest'),sizce:cue('which one'),yorum:cue('tell us'),fazla:cue('for more')};
const INK=['#0a1a2e','#123a5a','#1a6a7a'];
function sBakIntro(t){bg(INK,t,3);const k=pop(t,C.once,.45);tx('FIRST, LET’S ASK A TURKISH POET',W/2,470,62,'#bfeaff',{st:10,a:clamp(k),ls:3,maxW:980,sc:'#04121e'});
  const k2=pop(t,C.yavuz-.1,.5);if(k2>0){X.save();X.translate(W/2,860);X.scale(k2,k2);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=50;X.shadowOffsetY=18;const g=X.createLinearGradient(0,-260,0,260);g.addColorStop(0,'#fbf1da');g.addColorStop(1,'#e8d2a0');X.fillStyle=g;X.beginPath();X.roundRect(-460,-260,920,520,36);X.fill();X.shadowColor='transparent';X.lineWidth=8;X.strokeStyle='#b8862b';X.stroke();
    tx('“',-360,-150,260,'#b8862b',{st:0});tx('YAVUZ BÜLENT',0,-70,120,'#3a2410',{st:0});tx('BAKİLER',0,70,170,'#7a2a10',{st:0,ls:4});tx('Poet and writer · 1936–2025',0,190,46,'#5a3a1a',{st:0,f:'InterB',w:800});X.restore()}
  const k3=pop(t,C.nediyor,.4);if(k3>0)chip('WHAT DOES HE SAY?',W/2,1330,k3,['#fff36a','#ffb01a'],{size:92,h:180})}
const BARS=[['Dîvânu Lugâti’t-Türk','1072 · Kaşgarlı Mahmud',9200,'kas','r1',['#7fd8ff','#2a8aff']],['Kâmûs-ı Türkî','1901 · Şemsettin Sami',18000,'sem','r2',['#8af0c0','#1fa878']],['TDK Turkish Dictionary','Turkish Language Association',80000,'tdk','r3',['#fff36a','#ffb01a']],['Pure Turkish Dictionary','',3175,'oz','r4',['#ff7a7a','#d0122a']]];
function sBak(t){bg(INK,t,3);
  if(t<C.soru){const a=clamp((C.soru-t)/.3);X.save();X.globalAlpha=a;tx('BAKILER’S NUMBERS',W/2,290,92,['#fff','#bfeaff'],{st:16,sc:'#04121e',maxW:980,a:clamp((t-C.bak)/.4)});
    X.save();X.globalAlpha=a*clamp((t-C.bak-.5)/.4);chip('Source: Türkiye newspaper · “Türkçe mi, Öz Türkçe mi?”',W/2,420,1,['rgba(255,255,255,.95)','#d8ecff'],{size:34,h:76,f:'InterB'});X.restore();
    BARS.forEach((b,i)=>{const y=640+i*235,k=clamp((t-C[b[3]])/.35);if(k<=0)return;X.save();X.globalAlpha=a*k;tx(b[0],80,y-58,58,'#fff',{al:'left',st:10,sc:'#04121e'});if(b[1])tx(b[1],80,y+2,34,'#bfeaff',{al:'left',st:6,sc:'#04121e',f:'InterB',w:800});
      const g=eout((t-C[b[4]])/.9),full=920*b[2]/80000,w=Math.max(10,full*g);X.fillStyle='rgba(255,255,255,.12)';X.beginPath();X.roundRect(80,y+40,920,62,31);X.fill();const gg=X.createLinearGradient(80,0,80+Math.max(w,60),0);gg.addColorStop(0,b[5][0]);gg.addColorStop(1,b[5][1]);X.fillStyle=gg;X.shadowColor=b[5][1];X.shadowBlur=24;X.beginPath();X.roundRect(80,y+40,Math.max(w,24),62,31);X.fill();X.shadowColor='transparent';
      if(t>C[b[4]]){const n=Math.round(b[2]*g);tx(n.toLocaleString('en-US'),1000,y-40,i===3?120:92,i===3?['#ff8a8a','#ff2a3a']:b[5],{al:'right',st:14,sc:'#04121e'})}X.restore()});
    const kz=pop(t,C.r4+.35,.4);if(kz>0)chip('ONLY 3,175 WORDS',W/2,1500,kz,['#ff7a7a','#d0122a'],{size:64,h:110,fg:'#fff'});X.restore()}
  else{const k=pop(t,C.soru,.45);X.save();X.translate(W/2,900);X.scale(k,k);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=50;X.shadowOffsetY=18;const g=X.createLinearGradient(0,-380,0,380);g.addColorStop(0,'#fbf1da');g.addColorStop(1,'#e8d2a0');X.fillStyle=g;X.beginPath();X.roundRect(-480,-380,960,760,40);X.fill();X.shadowColor='transparent';X.lineWidth=8;X.strokeStyle='#b8862b';X.stroke();
    tx('“',-370,-250,300,'#b8862b',{st:0});const kq=clamp((t-C.q)/.3);tx('3175',0,-150,300,['#ff5a5a','#b0101a'],{st:0,a:kq});tx('WORDS',0,40,130,'#3a2410',{st:0,a:kq});tx('WHAT CAN WE DO?',0,180,116,'#3a2410',{st:0,maxW:860,a:clamp((t-C.q-.9)/.3)});tx('— Yavuz Bülent Bakiler',0,310,48,'#7a2a10',{st:0,f:'InterB',w:800});X.restore()}}
const RANK=['English','French','Malagasy','Chinese','Russian','Greek','German','KURDISH'];
function sKurd(t){bg(K.bg,t,1);header('KURDISH',[K.c1,'#fff6d0'],eout((t-C.simdi)/.5));
  if(t<C.ust){const a=clamp((C.ust-t)/.3);X.save();X.globalAlpha=a;const kv=clamp((t-C.rud)/.4);tx('WIKTIONARY RANKING',W/2,520,70,'#fff',{st:12,a:kv,ls:3});
    X.save();X.globalAlpha=a*kv;chip('Source: Rudaw',W/2,610,1,['rgba(255,255,255,.95)','#ffe9c0'],{size:36,h:70,f:'InterB'});X.restore();
    RANK.forEach((r,i)=>{const t0=C.rud+.5+i*((C.sek-C.rud-.5)/8),k=clamp((t-t0)/.25);if(k<=0)return;const y=720+i*86,hi=i===7;X.save();X.globalAlpha=a*k;X.translate((1-eout(k))*-80,0);
      if(hi){const p=pop(t,C.sek,.4);X.translate(W/2,y+14);X.scale(1+.18*Math.max(0,p),1+.18*Math.max(0,p));X.translate(-W/2,-y-14);X.shadowColor='rgba(255,220,90,.9)';X.shadowBlur=40;const g=X.createLinearGradient(0,y-36,0,y+64);g.addColorStop(0,'#fff36a');g.addColorStop(1,'#ffa01a');X.fillStyle=g;X.beginPath();X.roundRect(150,y-36,780,100,26);X.fill();X.shadowColor='transparent';tx('8.',220,y+18,84,'#7a1a10',{st:0});tx(r,W/2+30,y+18,92,'#3a0a10',{st:0,ls:4})}
      else{X.fillStyle='rgba(20,6,14,.6)';X.beginPath();X.roundRect(190,y-30,700,66,18);X.fill();tx((i+1)+'.',240,y+6,46,'#ffd98a',{st:0});tx(r,W/2+20,y+6,46,'#fff',{st:0,f:'InterB',w:800})}X.restore()});
    if(t>C.geri){['Turkish','Persian','Arabic'].forEach((n,i)=>{const k=pop(t,C.geri+i*.35,.35);if(k<=0)return;X.save();X.globalAlpha=a*.95;chip(n+' ↓',250+i*290,1440,k,['#cfd6e0','#8a94a8'],{size:42,h:92,f:'InterB',fg:'#1a2030'});X.restore()});tx('LEFT BEHIND',W/2,1545,58,'#fff',{st:10,a:clamp((t-C.geri-1)/.3)})}X.restore()}
  else{const a=clamp((t-C.ust)/.3);X.save();X.globalAlpha=a;tx('NOT A SINGLE LANGUAGE',W/2,520,78,'#fff',{st:14,ls:3});
    const kz=pop(t,C.haz-.3,.5);if(kz>0){X.save();X.translate(W/2,1010);X.globalCompositeOperation='screen';const rg=X.createRadialGradient(0,0,0,0,0,560*kz);rg.addColorStop(0,'rgba(255,220,90,.55)');rg.addColorStop(1,'rgba(255,160,20,0)');X.fillStyle=rg;X.fillRect(-600,-600,1200,1200);X.restore();
      if(t<C.d[0]){X.save();X.translate(W/2,960);X.scale(kz,kz);tx('A TREASURY',0,-90,150,'#fff',{st:22});tx('OF LANGUAGES',0,100,200,['#fff36a','#ffa01a'],{st:28,maxW:980});X.restore()}}
    DIA.forEach((d,i)=>{const k=pop(t,C.d[i],.4);if(k>0){X.save();X.translate(d[1],d[2]+Math.sin(t*2+i)*8);X.rotate(d[3]);chip(d[0],0,0,k,(i+(i>>1))%2?['#fff','#ffe2a0']:['#ffe14a','#ff9a1a'],{size:78,h:136,w:440});if(d[4])tx(d[4],0,112,34,'#fff',{f:'InterB',w:800,st:7,a:clamp((t-C.d[i]-.25)/.3),maxW:470});X.restore()}});tx('6 DIALECTS',W/2,1470,90,['#fff36a','#ffa01a'],{st:16,a:clamp((t-C.d[5]-.3)/.3),ls:4});X.restore()}}
function sNasil(t){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#14061e');g.addColorStop(.5,'#3a1040');g.addColorStop(1,'#7a1a22');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.translate(W/2,H*.45);X.rotate(t*.05);X.globalAlpha=.07;X.fillStyle='#fff';for(let i=0;i<18;i++){X.rotate(TAU/18);X.beginPath();X.moveTo(-50,0);X.lineTo(0,-1600);X.lineTo(50,0);X.fill()}X.restore();
  const kn=pop(t,C.nasil,.45);X.save();X.translate(W/2,330);X.scale(kn,kn);tx('HOW IS IT POSSIBLE?',0,0,150,['#fff36a','#ffb01a'],{st:24,maxW:1000});X.restore();
  if(t<C.resmi){[['NO STATE',C.dev,-.05],['NO SCHOOLS',C.okul,.04],['BANNED',C.yas,-.03]].forEach((s,i)=>{const k=clamp((t-s[1])/.22);if(k<=0)return;X.save();X.globalAlpha=k*clamp((C.resmi-t)/.25);X.translate(W/2,700+i*260);X.rotate(s[2]);X.scale(lerp(2.2,1,eout(k)),lerp(2.2,1,eout(k)));X.lineWidth=12;X.strokeStyle='#ff4a5a';X.beginPath();X.roundRect(-400,-100,800,200,24);X.stroke();tx(s[0],0,8,150,'#ff5a6a',{st:0,ls:4,maxW:740});X.restore()})}
  else{const k1=pop(t,C.resmi,.4);X.save();X.translate(W/2,720);X.scale(k1,k1);tx('IT PASSED THE',0,-70,130,'#fff',{st:20});tx('OFFICIAL LANGUAGE',0,80,120,[K.c1,K.c2],{st:20});X.restore();
    const k2=pop(t,C.bugun,.45);if(k2>0){X.save();X.translate(W/2,1180);X.scale(k2,k2);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=50;X.shadowOffsetY=18;X.rotate(-.04);X.fillStyle='#b01828';X.beginPath();X.roundRect(-330,-200,660,400,24);X.fill();X.shadowColor='transparent';X.fillStyle='#f4ead2';X.fillRect(-306,170,612,30);X.fillStyle='#7a0c18';X.fillRect(-330,-200,56,400);tx('FERHENG',26,-50,120,'#ffd98a',{st:0,ls:4});tx('Kurdî',26,80,100,'#fff',{st:0});X.restore();
      tx('ONE OF THE WORLD’S LARGEST DICTIONARIES',W/2,1480,50,'#fff',{st:10,maxW:1000,a:clamp((t-C.bugun-.6)/.4)})}}}
function sSizce(t){const lt=t-C.sizce;sHook(lt);X.fillStyle='rgba(8,4,12,.35)';X.fillRect(0,0,W,H);const k=pop(t,C.yorum,.4);if(k>0)chip('💬 TELL US IN THE COMMENTS',W/2,1510,k,['#fff','#ffe9a8'],{size:52,h:110,f:'InterB'})}
function sEnd(t){const lt=t-C.fazla;const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a0a14');g.addColorStop(.55,'#7a1a22');g.addColorStop(1,'#e2572a');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.translate(W/2,700);X.rotate(lt*.1);X.globalAlpha=.1;X.fillStyle='#ffe08a';for(let i=0;i<20;i++){X.rotate(TAU/20);X.beginPath();X.moveTo(-60,0);X.lineTo(0,-1500);X.lineTo(60,0);X.fill()}X.restore();
  const k=pop(lt,.1,.5);X.save();X.translate(W/2,700);X.scale(k,k);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=60;X.beginPath();X.arc(0,0,250,0,TAU);X.closePath();X.fillStyle='#000';X.fill();X.shadowColor='transparent';X.save();X.clip();X.drawImage(LOGO,-250,-250,500,500);X.restore();X.lineWidth=12;X.strokeStyle='#ffd98a';X.stroke();X.restore();
  tx('DÎROK',W/2,1050,150,['#fff3b0','#e0a02a'],{f:'CinzelD',w:900,st:18,a:clamp((lt-.4)/.4),ls:10});tx('@dirokakurd',W/2,1170,64,'#fff',{f:'InterB',w:800,st:10,a:clamp((lt-.6)/.4)});
  const kb=pop(lt,.9,.4);if(kb>0){X.save();X.translate(W/2,1340);X.scale(kb*(1+.04*Math.sin(lt*7)),kb*(1+.04*Math.sin(lt*7)));X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=30;X.shadowOffsetY=10;X.fillStyle='#e8202a';X.beginPath();X.roundRect(-270,-70,540,140,70);X.fill();X.shadowColor='transparent';tx('SUBSCRIBE',0,6,84,'#fff',{st:0,ls:4});X.restore()}
  const kk=clamp((lt-1.6)/.5);if(kk>0){X.save();X.globalAlpha=kk;X.save();X.beginPath();X.arc(330,1560,58,0,TAU);X.clip();X.drawImage(KLOGO,272,1502,116,116);X.restore();tx('Learn Kurdish: @dirokkurdii',410,1562,46,'#fff',{f:'InterB',w:800,st:8,al:'left'});X.restore()}}
// ---------- captions ----------
const FIX={Dirok:'Dîrok'};
const CAPS=[];{let cur=[];WORDS.forEach((w,i)=>{const b=w[0].replace(/[.,:;!?]/g,'');let d=w[0];Object.keys(FIX).forEach(k=>{if(b===k)d=w[0].replace(k,FIX[k])});cur.push({w:d,s:OFF+w[1],e:OFF+w[2]});if(/[.,:;!?]$/.test(w[0])||cur.length>=4||i===WORDS.length-1){CAPS.push(cur);cur=[]}})}
function captions(t){const c=CAPS.find(c=>t>=c[0].s-.05&&t<c[c.length-1].e+.3);if(!c)return;X.save();X.font='800 58px InterB';const sp=X.measureText(' ').width,ws=c.map(w=>X.measureText(w.w).width),tot=ws.reduce((a,b)=>a+b,0)+sp*(c.length-1);const sc=Math.min(1,960/tot),y=1660;X.translate(W/2,y);X.scale(sc,sc);
  X.fillStyle='rgba(12,6,14,.82)';X.beginPath();X.roundRect(-tot/2-34,-52,tot+68,104,26);X.fill();X.textBaseline='middle';X.textAlign='left';let x=-tot/2;c.forEach((w,i)=>{X.fillStyle=t>=w.s-.03?'#ffd83a':'#fff';X.fillText(w.w,x,3);x+=ws[i]+sp});X.restore()}
function renderFrame(t){X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.shadowColor='transparent';
  if(t<C.once)sHook(t);else if(t<C.bak)sBakIntro(t);else if(t<C.simdi)sBak(t);else if(t<C.nasil)sKurd(t);else if(t<C.sizce)sNasil(t);else if(t<C.fazla)sSizce(t);else sEnd(t);
  [C.once,C.bak,C.simdi,C.nasil,C.sizce,C.fazla].forEach(c=>{const d=t-c;if(d>-.12&&d<.3){X.fillStyle=`rgba(255,255,255,${.85*(d<0?1+d/.12:1-d/.3)})`;X.fillRect(0,0,W,H)}});
  if(t<C.fazla){captions(t);tx('DÎROK',W/2,120,54,['#fff3b0','#e0a02a'],{f:'CinzelD',w:900,st:10,ls:10,a:.95})}
  const vg=X.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');X.fillStyle=vg;X.fillRect(0,0,W,H);
  if(t>TOTAL-.5){X.fillStyle=`rgba(0,0,0,${clamp((t-TOTAL+.5)/.5)})`;X.fillRect(0,0,W,H)}}
window.renderFrame=renderFrame;window.MISS=MISS;window.SFX=[['boom',.15],['boom',.55],['whoosh',.9],['whoosh',C.once-.1],['boom',C.yavuz],['whoosh',C.bak-.1],['boom',C.r1],['boom',C.r2],['boom',C.r3],['boom',C.r4],['shimmer',C.soru],['boom',C.q],['whoosh',C.simdi-.1],['boom',C.simdi],['shimmer',C.sek],['boom',C.sek],['shimmer',C.haz-.3],['whoosh',C.nasil-.1],['boom',C.dev],['boom',C.okul],['boom',C.yas],['shimmer',C.bugun],['whoosh',C.sizce-.1],['whoosh',C.fazla-.1],['boom',C.fazla+.1]];
// ---------- cover (hook) ----------
window.drawCover=function(){X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.shadowColor='transparent';sHook(5);
  tx('DÎROK',W/2,120,54,['#fff3b0','#e0a02a'],{f:'CinzelD',w:900,st:10,ls:10});
  X.save();X.translate(W/2,790);X.rotate(-.11);chip('8TH IN THE WORLD ON WIKTIONARY',0,0,1,['#fff36a','#ffa01a'],{size:58,h:136});X.restore();
  X.save();X.translate(W/2,1560);X.rotate(-.11);chip('PURE TURKISH: 3,175 WORDS?',0,0,1,['#ff6a6a','#c8101e'],{size:66,h:136,fg:'#fff'});X.restore();
  chip('A TURKISH POET EXPLAINS',W/2,1760,1,['#fff','#ffe9a8'],{size:56,h:104});
  const vg=X.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');X.fillStyle=vg;X.fillRect(0,0,W,H)};
