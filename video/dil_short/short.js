// "Kürtçe mi daha zengin, Türkçe mi?" — vertical short (1080x1920), pure canvas
const W=1080,H=1920,TAU=Math.PI*2,cv=document.getElementById('c'),X=cv.getContext('2d');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,eout=t=>1-Math.pow(1-clamp(t),3),eback=t=>{t=clamp(t);const c=2.2;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const OFF=.5,NAR=WORDS[WORDS.length-1][2],END=OFF+NAR+.5,TOTAL=END+3.6;window.TOTAL=TOTAL;
const norm=w=>w.toLocaleLowerCase('tr').replace(/[^a-zçğıöşü0-9]/g,'');
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
// ---------- scenes ----------
const C={cevap:cue('cevap'),once:cue('önce türkçe'),tdk:cue('türk dil'),yuz:cue('yüz bini'),ama:cue('ama türkçenin'),tek:cue('tek bir kelimeyle'),evl:cue('evlerinizdeymişiz'),simdi:cue('şimdi kürtçe'),tekdil:cue('kürtçe tek'),haz:cue('hazinesi'),
 d:[cue('kurmanci'),cue('sorani'),cue('zazaki'),cue('gorani'),cue('kelhuri')],her:cue('her lehçenin'),cins:cue('kelimelerin cinsiyeti'),hint:cue('ve kürtçe'),ster:cue('ster'),nu:cue('nu ile'),bira:cue('bıra'),ayni:cue('aynı kökten'),
 peki:cue('peki'),dilb:cue('dilbilimciler'),daha:cue('daha zengin dil'),yok:cue('yoktur'),tz:cue('türkçenin zenginliği'),kz:cue('kürtçenin zenginliği'),asil:cue('asıl zenginlik'),fazla:cue('daha fazlası')};
function sHook(t){ // split
  X.save();X.beginPath();X.moveTo(0,0);X.lineTo(W,0);X.lineTo(W,H*.44);X.lineTo(0,H*.56);X.clip();bg(K.bg,t,1);X.restore();
  X.save();X.beginPath();X.moveTo(0,H*.56);X.lineTo(W,H*.44);X.lineTo(W,H);X.lineTo(0,H);X.clip();bg(T_.bg,t,7);X.restore();
  X.save();X.strokeStyle='#fff';X.lineWidth=14;X.shadowColor='#fff';X.shadowBlur=40;X.beginPath();X.moveTo(-20,H*.56+1);X.lineTo(W+20,H*.44-1);X.stroke();X.restore();
  const k1=pop(t,.15),k2=pop(t,.55);X.save();X.translate(W/2,560);X.rotate(-.11);X.scale(k1,k1);tx('KÜRTÇE',0,0,250,[K.c1,K.c2],{ls:4,st:34});X.restore();
  X.save();X.translate(W/2,1340);X.rotate(-.11);X.scale(Math.max(0,k2),Math.max(0,k2));tx('TÜRKÇE',0,0,250,[T_.c1,T_.c2],{ls:4,st:34,sc:'#04121e'});X.restore();
  const kv=pop(t,.95,.5);if(kv>0){X.save();X.translate(W/2,H/2);X.scale(kv*(1+.05*Math.sin(t*8)),kv*(1+.05*Math.sin(t*8)));X.rotate(-.11);X.fillStyle='#fff';X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=40;X.beginPath();X.arc(0,0,120,0,TAU);X.fill();X.shadowColor='transparent';tx('VS',0,8,130,'#d0122a',{st:0});X.restore()}
  const kq=clamp((t-1.5)/.4)*(t<C.cevap?1:clamp(1-(t-C.cevap)/.25));if(kq>0){X.save();X.globalAlpha=kq;chip('HANGİSİ DAHA ZENGİN?',W/2,270,1,['#fff','#ffe9a8'],{size:74,h:140});X.restore()}
  const ka=pop(t,C.cevap,.4);if(t>C.cevap){X.fillStyle=`rgba(8,4,12,${.9*clamp((t-C.cevap)/.3)})`;X.fillRect(0,0,W,H);X.save();X.translate(W/2+Math.sin(t*40)*6*clamp(1-(t-C.cevap)/.6),880);X.scale(ka,ka);tx('CEVAP',0,-110,190,'#fff',{st:26});tx('SANDIĞINIZ GİBİ',0,70,130,[K.c1,K.c2],{st:22});tx('DEĞİL!',0,260,230,'#ff3a4a',{st:30});X.restore()}}
function sTurk(t){bg(T_.bg,t,7);header('TÜRKÇE',[T_.c1,'#e8fbff'],eout((t-C.once)/.5));
  if(t<C.ama+.2){const a=clamp((t-C.tdk)/.4)*clamp((C.ama+.2-t)/.3);X.save();X.globalAlpha=a; // dictionary + counter
    X.save();X.translate(W/2,760);X.rotate(-.05);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=50;X.shadowOffsetY=20;X.fillStyle='#b01828';X.beginPath();X.roundRect(-230,-150,460,300,18);X.fill();X.shadowColor='transparent';X.fillStyle='#f4ead2';X.fillRect(-212,128,424,26);X.fillStyle='#7a0c18';X.fillRect(-230,-150,44,300);tx('TDK',14,-36,110,'#ffd98a',{st:0});tx('SÖZLÜK',14,60,64,'#fff',{st:0,ls:6});X.restore();
    const n=Math.round(lerp(0,100000,eout((t-C.yuz)/1.6))/1000)*1000;tx(n.toLocaleString('tr-TR')+'+',W/2,1130,230,['#fff','#a8f4ff'],{st:28,sc:'#04121e'});tx('SÖZ',W/2,1310,110,T_.c1,{st:18,sc:'#04121e',ls:10});X.restore()}
  if(t>C.ama){const a=clamp((t-C.ama)/.3);X.save();X.globalAlpha=a;tx('ASIL GÜCÜ:',W/2,590,84,'#fff',{st:14,sc:'#04121e',ls:4});tx('EKLER',W/2,760,190,['#fff36a','#ffb01a'],{st:26,sc:'#04121e',ls:6});X.restore();
    const parts=[['ev','#fff'],['ler','#ffd23a'],['iniz','#ff8a5a'],['de','#7af0a0'],['ymiş','#c79aff'],['iz','#5ad0ff']];const t0=C.tek,st=(C.evl-C.tek)/6;X.save();X.font='150px Anton';const ws=parts.map(p=>X.measureText(p[0]).width);const tot=ws.reduce((a,b)=>a+b,0);const sc=Math.min(1,980/tot);X.restore();
    let x=W/2-tot*sc/2;parts.forEach((p,i)=>{const k=pop(t,t0+i*st,.35);if(k>0){X.save();X.translate(x+ws[i]*sc/2,1080-(1-Math.min(1,k))*80);X.scale(sc*k,sc*k);tx(p[0],0,0,150,p[1],{st:20,sc:'#04121e'});X.restore();
      if(i>0&&t<C.evl){X.save();X.globalAlpha=clamp(k)*.9;tx('+',x-2,1080-120,60,'#fff',{st:8});X.restore()}}x+=ws[i]*sc});
    const kf=pop(t,C.evl+.5,.4);if(kf>0){chip('1 KELİME = 1 CÜMLE',W/2,1330,kf,['#fff36a','#ffb01a'],{size:78,h:150})}}}
const DIA=[['KURMANCÎ',300,720,-.06],['SORANÎ',760,800,.05],['ZAZAKÎ',320,1010,.04],['GORANÎ',770,1090,-.05],['KELHURÎ',540,1290,.02]];
function sKurd(t){bg(K.bg,t,1);header('KÜRTÇE',[K.c1,'#fff6d0'],eout((t-C.simdi)/.5));
  if(t<C.cins){const a=clamp((C.cins-t)/.3);X.save();X.globalAlpha=a;
    const kh=clamp((t-C.tekdil)/.4);tx('TEK BİR DİL DEĞİL',W/2,520,78,'#fff',{st:14,a:kh,ls:3});
    const kz=pop(t,C.haz-.3,.5);if(kz>0){X.save();X.translate(W/2,1010);X.globalCompositeOperation='screen';const rg=X.createRadialGradient(0,0,0,0,0,560*kz);rg.addColorStop(0,'rgba(255,220,90,.55)');rg.addColorStop(1,'rgba(255,160,20,0)');X.fillStyle=rg;X.fillRect(-600,-600,1200,1200);X.restore();
      if(t<C.d[0]){X.save();X.translate(W/2,960);X.scale(kz,kz);tx('BİR DİL',0,-90,150,'#fff',{st:22});tx('HAZİNESİ',0,100,200,['#fff36a','#ffa01a'],{st:28});X.restore()}}
    DIA.forEach((d,i)=>{const k=pop(t,C.d[i],.4);if(k>0){X.save();X.translate(d[1],d[2]+Math.sin(t*2+i)*8);X.rotate(d[3]);chip(d[0],0,0,k,i%2?['#fff','#ffe2a0']:['#ffe14a','#ff9a1a'],{size:88,h:150});X.restore()}});
    const ke=clamp((t-C.her)/.4);if(ke>0)tx('HER BİRİNİN KENDİ EDEBİYATI',W/2,1470,62,'#fff',{st:12,a:ke,maxW:980,ls:2});X.restore()}
  else if(t<C.hint){const a=clamp((t-C.cins)/.3)*clamp((C.hint-t)/.25);X.save();X.globalAlpha=a;tx('KELİMELERİN',W/2,580,100,'#fff',{st:16});tx('CİNSİYETİ VAR',W/2,710,130,[K.c1,K.c2],{st:20});
    const k1=pop(t,C.cins+.5,.4),k2=pop(t,C.cins+1.0,.4);chip('hevalê min',W/2,960,k1,['#6ad0ff','#2a8aff'],{size:110,h:180,fg:'#fff',sub:'erkek arkadaşım  ♂'});chip('hevala min',W/2,1270,k2,['#ff8ac0','#ff3a8a'],{size:110,h:180,fg:'#fff',sub:'kız arkadaşım  ♀'});X.restore()}
  else{const a=clamp((t-C.hint)/.3);X.save();X.globalAlpha=a;tx('HİNT-AVRUPA',W/2,560,130,'#fff',{st:20,ls:3});tx('DİL AİLESİ',W/2,690,96,[K.c1,K.c2],{st:16,ls:6});
    [['STÊR','STAR',C.ster,'★'],['NÛ','NEW',C.nu,'✦'],['BIRA','BROTHER',C.bira,'♥']].forEach((r,i)=>{const k=pop(t,r[2],.4),y=900+i*190;if(k<=0)return;X.save();X.translate(W/2,y);X.scale(k,k);X.shadowColor='rgba(0,0,0,.45)';X.shadowBlur=30;X.shadowOffsetY=10;X.fillStyle='rgba(20,6,14,.78)';X.beginPath();X.roundRect(-480,-80,960,160,40);X.fill();X.shadowColor='transparent';X.lineWidth=5;X.strokeStyle='rgba(255,220,120,.8)';X.stroke();
      tx(r[0],-250,6,104,[K.c1,K.c2],{st:0});tx('=',0,2,90,'#fff',{st:0});tx(r[1],250,6,r[1].length>5?80:104,'#8fe4ff',{st:0});X.restore()});
    const kk=pop(t,C.ayni,.4);if(kk>0)chip('AYNI KÖKTEN',W/2,1490,kk,['#fff36a','#ffb01a'],{size:84,h:150});X.restore()}}
function sVerdict(t){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0a2e');g.addColorStop(.5,'#3a1560');g.addColorStop(1,'#0a2a4a');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.translate(W/2,H*.45);X.rotate(t*.05);X.globalAlpha=.07;X.fillStyle='#fff';for(let i=0;i<18;i++){X.rotate(TAU/18);X.beginPath();X.moveTo(-50,0);X.lineTo(0,-1600);X.lineTo(50,0);X.fill()}X.restore();
  if(t<C.tz){const a=clamp((C.tz-t)/.3);X.save();X.globalAlpha=a;
    if(t<C.daha){tx('PEKİ HANGİSİ',W/2,560,120,'#fff',{st:18,a:clamp((t-C.peki)/.3)});tx('DAHA ZENGİN?',W/2,710,150,['#fff36a','#ffb01a'],{st:22,a:clamp((t-C.peki-.3)/.3)});
      const tilt=Math.sin(t*2.2)*.16;X.save();X.translate(W/2,1080);X.strokeStyle='#ffe08a';X.lineWidth=16;X.lineCap='round';X.beginPath();X.moveTo(0,-170);X.lineTo(0,230);X.moveTo(-110,230);X.lineTo(110,230);X.stroke();X.rotate(tilt);X.beginPath();X.moveTo(-330,-170);X.lineTo(330,-170);X.stroke();
      [[-330,'K',K],[330,'T',T_]].forEach(([px,l,c])=>{X.save();X.translate(px,-170);X.rotate(-tilt);X.lineWidth=6;X.beginPath();X.moveTo(0,0);X.lineTo(-90,170);X.moveTo(0,0);X.lineTo(90,170);X.stroke();const gg=X.createLinearGradient(0,150,0,230);gg.addColorStop(0,c.c1);gg.addColorStop(1,c.c2);X.fillStyle=gg;X.beginPath();X.ellipse(0,180,120,34,0,0,TAU);X.fill();tx(l,0,110,110,'#fff',{st:14});X.restore()});X.restore();
      const kd=clamp((t-C.dilb)/.3);if(kd>0)chip('DİLBİLİMCİLER NET:',W/2,1480,pop(t,C.dilb,.4),['#fff','#d8e8ff'],{size:66,h:130})}
    else{const k=pop(t,C.daha,.4);X.save();X.translate(W/2,900);X.scale(k,k);tx('“DAHA ZENGİN DİL”',0,-260,104,'#fff',{st:16,maxW:1000});tx('DİYE BİR ŞEY',0,-110,104,'#fff',{st:16});X.restore();
      const ky=pop(t,C.yok-.1,.45);if(ky>0){X.save();X.translate(W/2+Math.sin(t*40)*8*clamp(1-(t-C.yok)/.5),1130);X.scale(ky,ky);X.rotate(-.05);tx('YOKTUR',0,0,300,['#ff5a6a','#d0122a'],{st:36,sc:'#fff'});X.restore()}}X.restore()}
  else if(t<C.asil){const k1=pop(t,C.tz,.4),k2=pop(t,C.kz,.4);
    X.save();X.translate(W/2,640);X.scale(k1,k1);tx('TÜRKÇE',0,-80,150,[T_.c1,T_.c2],{st:22,sc:'#04121e'});X.restore();chip('EKLERİYLE ZENGİN',W/2,760,k1,[T_.c1,T_.c2],{size:76,h:140,fg:'#04121e'});
    if(k2>0){X.save();X.translate(W/2,1180);X.scale(k2,k2);tx('KÜRTÇE',0,-80,150,[K.c1,K.c2],{st:22});X.restore();chip('LEHÇELERİYLE ZENGİN',W/2,1300,k2,[K.c1,K.c2],{size:72,h:140})}}
  else{const k=pop(t,C.asil,.45);tx('ASIL ZENGİNLİK',W/2,560,124,'#fff',{st:18,a:clamp(k)});X.save();X.translate(W/2,960);X.scale(k,k);tx('KÜRTÇE',0,-150,190,[K.c1,K.c2],{st:26});tx('+',0,10,150,'#fff',{st:18});tx('TÜRKÇE',0,170,190,[T_.c1,T_.c2],{st:26,sc:'#04121e'});X.restore();
    const kb=pop(t,C.asil+.9,.4);if(kb>0)chip('İKİSİNİ DE BİLMEK',W/2,1420,kb,['#fff36a','#ffb01a'],{size:84,h:150})}}
function sEnd(t){const lt=t-C.fazla;const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a0a14');g.addColorStop(.55,'#7a1a22');g.addColorStop(1,'#e2572a');X.fillStyle=g;X.fillRect(0,0,W,H);
  X.save();X.translate(W/2,700);X.rotate(lt*.1);X.globalAlpha=.1;X.fillStyle='#ffe08a';for(let i=0;i<20;i++){X.rotate(TAU/20);X.beginPath();X.moveTo(-60,0);X.lineTo(0,-1500);X.lineTo(60,0);X.fill()}X.restore();
  const k=pop(lt,.1,.5);X.save();X.translate(W/2,700);X.scale(k,k);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=60;X.beginPath();X.arc(0,0,250,0,TAU);X.closePath();X.fillStyle='#000';X.fill();X.shadowColor='transparent';X.save();X.clip();X.drawImage(LOGO,-250,-250,500,500);X.restore();X.lineWidth=12;X.strokeStyle='#ffd98a';X.stroke();X.restore();
  tx('DÎROK',W/2,1050,150,['#fff3b0','#e0a02a'],{f:'CinzelD',w:900,st:18,a:clamp((lt-.4)/.4),ls:10});tx('@dirokakurd',W/2,1170,64,'#fff',{f:'InterB',w:800,st:10,a:clamp((lt-.6)/.4)});
  const kb=pop(lt,.9,.4);if(kb>0){X.save();X.translate(W/2,1340);X.scale(kb*(1+.04*Math.sin(lt*7)),kb*(1+.04*Math.sin(lt*7)));X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=30;X.shadowOffsetY=10;X.fillStyle='#e8202a';X.beginPath();X.roundRect(-270,-70,540,140,70);X.fill();X.shadowColor='transparent';tx('ABONE OL',0,6,84,'#fff',{st:0,ls:4});X.restore()}
  const kk=clamp((lt-1.6)/.5);if(kk>0){X.save();X.globalAlpha=kk;X.save();X.beginPath();X.arc(330,1560,58,0,TAU);X.clip();X.drawImage(KLOGO,272,1502,116,116);X.restore();tx('Kürtçe öğren: @dirokkurdii',410,1562,46,'#fff',{f:'InterB',w:800,st:8,al:'left'});X.restore()}}
// ---------- captions ----------
const FIX={Dirok:'Dîrok',Kurmanci:'Kurmancî',Sorani:'Soranî',Zazaki:'Zazakî',Gorani:'Goranî',Kelhuri:'Kelhurî',Ster:'Stêr',Nu:'Nû',Bıra:'Bira',Kurumunun:'Kurumu’nun',Hint:'Hint-'};
const CAPS=[];{let cur=[];WORDS.forEach((w,i)=>{const b=w[0].replace(/[.,:;!?]/g,'');let d=w[0];Object.keys(FIX).forEach(k=>{if(b===k)d=w[0].replace(k,FIX[k])});cur.push({w:d,s:OFF+w[1],e:OFF+w[2]});if(/[.,:;!?]$/.test(w[0])||cur.length>=4||i===WORDS.length-1){CAPS.push(cur);cur=[]}})}
function captions(t){const c=CAPS.find(c=>t>=c[0].s-.05&&t<c[c.length-1].e+.3);if(!c)return;X.save();X.font='800 58px InterB';const sp=X.measureText(' ').width,ws=c.map(w=>X.measureText(w.w).width),tot=ws.reduce((a,b)=>a+b,0)+sp*(c.length-1);const sc=Math.min(1,960/tot),y=1660;X.translate(W/2,y);X.scale(sc,sc);
  X.fillStyle='rgba(12,6,14,.82)';X.beginPath();X.roundRect(-tot/2-34,-52,tot+68,104,26);X.fill();X.textBaseline='middle';X.textAlign='left';let x=-tot/2;c.forEach((w,i)=>{X.fillStyle=t>=w.s-.03?'#ffd83a':'#fff';X.fillText(w.w,x,3);x+=ws[i]+sp});X.restore()}
function renderFrame(t){X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.shadowColor='transparent';
  if(t<C.once)sHook(t);else if(t<C.simdi)sTurk(t);else if(t<C.peki)sKurd(t);else if(t<C.fazla)sVerdict(t);else sEnd(t);
  [C.once,C.simdi,C.peki,C.fazla].forEach(c=>{const d=t-c;if(d>-.12&&d<.3){X.fillStyle=`rgba(255,255,255,${.85*(d<0?1+d/.12:1-d/.3)})`;X.fillRect(0,0,W,H)}});
  if(t<C.fazla){captions(t);tx('DÎROK',W/2,120,54,['#fff3b0','#e0a02a'],{f:'CinzelD',w:900,st:10,ls:10,a:.95})}
  const vg=X.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.35)');X.fillStyle=vg;X.fillRect(0,0,W,H);
  if(t>TOTAL-.5){X.fillStyle=`rgba(0,0,0,${clamp((t-TOTAL+.5)/.5)})`;X.fillRect(0,0,W,H)}}
window.renderFrame=renderFrame;window.MISS=MISS;window.SFX=[['boom',.15],['boom',.55],['whoosh',.9],['boom',C.cevap],['whoosh',C.once-.1],['boom',C.once],['shimmer',C.yuz],['boom',C.evl+.5],['whoosh',C.simdi-.1],['boom',C.simdi],['shimmer',C.haz-.3],['boom',C.ayni],['whoosh',C.peki-.1],['boom',C.peki],['boom',C.yok-.1],['shimmer',C.asil],['whoosh',C.fazla-.1],['boom',C.fazla+.1]];
