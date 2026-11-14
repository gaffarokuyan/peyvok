// ALAMUT VE KÜRTLER — vertical short 1080x1920
const W=1080,H=1920,TAU=Math.PI*2,cv=document.getElementById('c');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,eout=t=>1-Math.pow(1-clamp(t),3),eio=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},eback=t=>{t=clamp(t);const c=2.2;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const OFF=.5,NAR=WORDS[WORDS.length-1][2],END=OFF+NAR+.6,TOTAL=END+3.6;window.TOTAL=TOTAL;
const norm=w=>w.toLocaleLowerCase('tr').replace(/[^a-zçğıöşüâîû0-9]/g,'');
const MISS=[];function cue(q,n=1,o=0){const ps=q.split(' ').map(norm);for(let i=0;i<WORDS.length;i++){if(ps.every((p,j)=>WORDS[i+j]&&norm(WORDS[i+j][0]).startsWith(p))){if(--n===0)return OFF+WORDS[i][1]+o}}MISS.push(q);return 0}
const MAP=new Image();MAP.src='map.jpg';const LOGO=new Image();LOGO.src='logo.png';
window.ready=Promise.all([...['400 40px Anton','800 40px InterB','900 40px CinzelH','900 40px CinzelD','italic 600 40px Corm'].map(f=>document.fonts.load(f,'Kürtçeşğİâî')),MAP.decode(),LOGO.decode(),A3.init]).then(()=>true);
// ---------- helpers ----------
function goldG(y0,y1){const g=X.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#fff8cf');g.addColorStop(.35,'#ffd65a');g.addColorStop(.7,'#f29a1c');g.addColorStop(1,'#c4620a');return g}
function tx(s,x,y,size,fill,o={}){X.save();const fam=o.f||'Anton',wt=o.w||'';X.font=`${wt} ${size}px ${fam}`;X.textAlign=o.al||'center';X.textBaseline='middle';if(o.ls)X.letterSpacing=o.ls+'px';let sz=size;while(o.maxW&&X.measureText(s).width>o.maxW&&sz>12){sz-=3;X.font=`${wt} ${sz}px ${fam}`}
  X.globalAlpha*=o.a??1;X.lineJoin='round';if(o.st!==0){X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=26;X.shadowOffsetY=8;X.lineWidth=o.st||sz*.14;X.strokeStyle=o.sc||'#1a0a06';X.strokeText(s,x,y);X.shadowColor='transparent'}
  X.fillStyle=fill==='gold'?goldG(y-sz*.5,y+sz*.5):fill;X.fillText(s,x,y);X.restore();return sz}
const pop=(t,t0,d=.45)=>eback((t-t0)/d);
function chip(s,x,y,k,cols,o={}){if(k<=0)return;X.save();X.translate(x,y);X.scale(k,k);X.font=`${o.w||''} ${o.size||60}px ${o.f||'Anton'}`;const w=Math.min(o.maxW||1000,X.measureText(s).width+80),h=o.h||112;X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=30;X.shadowOffsetY=12;
  if(cols==='dark'){X.fillStyle='rgba(42,20,10,.92)'}else{const g=X.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,cols[0]);g.addColorStop(1,cols[1]);X.fillStyle=g}X.beginPath();X.roundRect(-w/2,-h/2,w,h,h*.28);X.fill();X.shadowColor='transparent';X.lineWidth=4;X.strokeStyle=cols==='dark'?goldG(-h/2,h/2):'rgba(255,255,255,.75)';X.stroke();X.restore();
  X.save();X.translate(x,y);X.scale(k,k);tx(s,0,4,o.size||60,o.fg||(cols==='dark'?'gold':'#1a0a06'),{st:0,f:o.f,w:o.w,maxW:(o.maxW||1000)-60});X.restore()}
function badge(s,k){if(k<=0)return;X.save();X.globalAlpha=clamp(k);X.font='900 54px CinzelH';X.letterSpacing='6px';const w=X.measureText(s).width+70;X.fillStyle='rgba(42,20,10,.9)';X.beginPath();X.roundRect(W/2-w/2,190,w,92,16);X.fill();X.lineWidth=4;X.strokeStyle=goldG(190,282);X.stroke();X.restore();tx(s,W/2,240,54,'gold',{f:'CinzelH',w:900,st:0,ls:6,a:clamp(k)})}
function embers(t,n=50){X.save();X.globalCompositeOperation='lighter';for(let i=0;i<n;i++){const life=(t*.12*(.5+hash(i))+hash(i+7))%1;const x=hash(i+11)*W,y=H-life*H*1.1;X.fillStyle=`rgba(255,200,120,${Math.sin(life*Math.PI)*.7})`;X.beginPath();X.arc(x,y,1.2+hash(i+3)*3,0,TAU);X.fill()}X.restore()}
function vign(a=.45){const vg=X.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${a})`);X.fillStyle=vg;X.fillRect(0,0,W,H)}
function mountains(t,cols,par=1,seed=0,base=1250,amp=260){X.fillStyle=cols;X.beginPath();X.moveTo(-50,H);for(let x=-50;x<=W+50;x+=20){const xx=x+t*par;const y=base-amp*(.55*Math.abs(Math.sin(xx*.0031+seed))+.3*Math.abs(Math.sin(xx*.0093+seed*2))+.15*Math.sin(xx*.021+seed))}X.lineTo(W+50,H);X.fill()}
function ridge(t,col,par,seed,base,amp){X.fillStyle=col;X.beginPath();X.moveTo(-60,H);for(let x=-60;x<=W+60;x+=16){const xx=x+t*par*10;const y=base-amp*(.6*Math.abs(Math.sin(xx*.0033+seed))+.3*Math.abs(Math.sin(xx*.011+seed*1.7))+.1*Math.sin(xx*.04+seed));X.lineTo(x,y)}X.lineTo(W+60,H);X.closePath();X.fill()}
function sky(c0,c1,c2){const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,c0);g.addColorStop(.55,c1);g.addColorStop(1,c2);X.fillStyle=g;X.fillRect(0,0,W,H)}
// map
const M=window.MAPB,mer=a=>Math.log(Math.tan(Math.PI/4+a*Math.PI/360));
const mx=lo=>(lo-M.lo0)/(M.lo1-M.lo0)*M.W,my=la=>(mer(M.la0)-mer(la))/(mer(M.la0)-mer(M.la1))*M.H;
let VIEW={cx:0,cy:0,s:1};
function mapView(lo,la,s){VIEW={cx:mx(lo),cy:my(la),s}}
const P=(lo,la)=>[W/2+(mx(lo)-VIEW.cx)*VIEW.s,H*.48+(my(la)-VIEW.cy)*VIEW.s];
function drawMap(lo,la,s,warm=0){mapView(lo,la,s);X.fillStyle='#0b2a4a';X.fillRect(0,0,W,H);X.drawImage(MAP,W/2-VIEW.cx*s,H*.48-VIEW.cy*s,M.W*s,M.H*s);
  if(warm){X.fillStyle=`rgba(255,170,90,${warm})`;X.globalCompositeOperation='soft-light';X.fillRect(0,0,W,H);X.globalCompositeOperation='source-over'}
  const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(10,6,4,.55)');g.addColorStop(.18,'rgba(10,6,4,0)');g.addColorStop(.78,'rgba(10,6,4,0)');g.addColorStop(1,'rgba(10,6,4,.7)');X.fillStyle=g;X.fillRect(0,0,W,H)}
function pin(lo,la,label,sub,k,col='#ffcf3a',side=1,t=0){if(k<=0)return;const[x,y]=P(lo,la);X.save();X.globalAlpha=clamp(k);const r=(t*1.1)%1;X.strokeStyle=col;X.lineWidth=5;X.globalAlpha=clamp(k)*(1-r);X.beginPath();X.arc(x,y,16+r*60,0,TAU);X.stroke();X.globalAlpha=clamp(k);
  X.fillStyle=col;X.shadowColor=col;X.shadowBlur=24;X.beginPath();X.arc(x,y,15*Math.min(1,k),0,TAU);X.fill();X.shadowColor='transparent';X.lineWidth=4;X.strokeStyle='#fff';X.stroke();X.restore();
  if(label){X.save();X.globalAlpha=clamp(k);const lx=x+side*40;tx(label,lx,y-6,58,'#fff',{al:side>0?'left':'right',st:12,sc:'#1a0a06'});if(sub)tx(sub,lx,y+46,36,col,{al:side>0?'left':'right',st:8,f:'InterB',w:800});X.restore()}}
function arrowArc(a,b,k,col='#ff5a3a',bend=-.25,dash=false){if(k<=0)return;const[x0,y0]=P(...a),[x1,y1]=P(...b);const mx_=(x0+x1)/2-(y1-y0)*bend,my_=(y0+y1)/2+(x1-x0)*bend;X.save();X.strokeStyle=col;X.lineWidth=10;X.lineCap='round';if(dash)X.setLineDash([24,18]);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=12;X.beginPath();
  const N=40,n=Math.floor(N*clamp(k));for(let i=0;i<=n;i++){const u=i/N,x=(1-u)*(1-u)*x0+2*u*(1-u)*mx_+u*u*x1,y=(1-u)*(1-u)*y0+2*u*(1-u)*my_+u*u*y1;i?X.lineTo(x,y):X.moveTo(x,y)}X.stroke();
  if(k>=1&&!dash){const u=.98,ex=x1,ey=y1,bx=(1-u)*(1-u)*x0+2*u*(1-u)*mx_+u*u*x1,by=(1-u)*(1-u)*y0+2*u*(1-u)*my_+u*u*y1;const a=Math.atan2(ey-by,ex-bx);X.setLineDash([]);X.fillStyle=col;X.beginPath();X.moveTo(ex,ey);X.lineTo(ex-40*Math.cos(a-.45),ey-40*Math.sin(a-.45));X.lineTo(ex-40*Math.cos(a+.45),ey-40*Math.sin(a+.45));X.fill()}X.restore()}
// ---------- props ----------
function fortress(cx,cy,s,lit=1,t=0){X.save();X.translate(cx,cy);X.scale(s,s);
  // crag
  const g=X.createLinearGradient(0,-60,0,520);g.addColorStop(0,'#6a4a3a');g.addColorStop(1,'#1e120c');X.fillStyle=g;X.beginPath();X.moveTo(-430,520);X.lineTo(-300,240);X.lineTo(-240,120);X.lineTo(-150,40);X.lineTo(-40,10);X.lineTo(90,20);X.lineTo(210,60);X.lineTo(290,150);X.lineTo(350,300);X.lineTo(460,520);X.fill();
  X.strokeStyle='rgba(255,190,120,.25)';X.lineWidth=4;for(let i=0;i<9;i++){X.beginPath();X.moveTo(-280+i*70,160+hash(i)*60);X.lineTo(-300+i*75,500);X.stroke()}
  // walls
  const wc='#c99a6a',wd='#8a6040';const wall=(x,y,w,h)=>{X.fillStyle=wc;X.fillRect(x,y-h,w,h);X.fillStyle=wd;X.fillRect(x+w*.7,y-h,w*.3,h);X.fillStyle=wc;for(let k=0;k<w;k+=22)X.fillRect(x+k,y-h-14,13,14)};
  wall(-200,40,400,90);wall(-240,60,90,170);wall(150,50,90,190);wall(-60,10,120,230);wall(60,20,70,150);
  X.fillStyle='#2a1810';X.beginPath();X.roundRect(-30,-30,60,70,[30,30,0,0]);X.fill();
  // windows glow
  if(lit){X.save();X.globalCompositeOperation='lighter';[[-210,-60],[-180,-100],[180,-70],[200,-110],[-20,-160],[20,-120],[90,-60]].forEach(([x,y],i)=>{const f=.6+.4*Math.sin(t*3+i*2);X.fillStyle=`rgba(255,190,80,${.9*f*lit})`;X.fillRect(x,y,14,22);const rg=X.createRadialGradient(x+7,y+11,0,x+7,y+11,60);rg.addColorStop(0,`rgba(255,170,60,${.35*f*lit})`);rg.addColorStop(1,'rgba(255,170,60,0)');X.fillStyle=rg;X.fillRect(x-60,y-60,130,140)});X.restore()}
  // banner
  X.strokeStyle='#2a1810';X.lineWidth=5;X.beginPath();X.moveTo(0,-240);X.lineTo(0,-330);X.stroke();X.fillStyle='#e8e2d4';X.beginPath();X.moveTo(0,-330);for(let i=0;i<=8;i++)X.lineTo(i*12,-330+8*Math.sin(t*4+i)+(i===8?40:0));X.lineTo(0,-290);X.fill();X.restore()}
function hooded(x,y,s,a=1){X.save();X.globalAlpha=a;X.translate(x,y);X.scale(s,s);X.fillStyle='#0d0806';X.beginPath();X.moveTo(-70,0);X.quadraticCurveTo(-80,-160,-40,-210);X.quadraticCurveTo(0,-270,40,-210);X.quadraticCurveTo(80,-160,70,0);X.fill();X.beginPath();X.ellipse(0,-215,38,46,0,0,TAU);X.fill();X.fillStyle='#ffcf8a';X.globalAlpha=a*.85;X.fillRect(-14,-218,10,4);X.fillRect(4,-218,10,4);X.restore()}
function saladin(x,y,s,a=1){X.save();X.globalAlpha=a;X.translate(x,y);X.scale(s,s);
  X.fillStyle='rgba(42,20,10,.92)';X.beginPath();X.arc(0,0,260,0,TAU);X.fill();X.lineWidth=12;X.strokeStyle=goldG(-260,260);X.stroke();X.save();X.beginPath();X.arc(0,0,250,0,TAU);X.clip();
  const bg=X.createRadialGradient(0,-40,0,0,0,260);bg.addColorStop(0,'#ffd98a');bg.addColorStop(1,'#c4620a');X.fillStyle=bg;X.fillRect(-260,-260,520,520);
  X.fillStyle='#2a6a4a';X.beginPath();X.moveTo(-200,260);X.quadraticCurveTo(-190,110,-80,90);X.lineTo(80,90);X.quadraticCurveTo(190,110,200,260);X.fill();X.fillStyle='#d8b04c';X.fillRect(-12,95,24,165);
  X.fillStyle='#c98d5f';X.beginPath();X.ellipse(0,-10,78,96,0,0,TAU);X.fill();X.fillRect(-28,60,56,40);
  X.fillStyle='#2a1a10';X.beginPath();X.moveTo(-76,0);X.quadraticCurveTo(-80,120,0,138);X.quadraticCurveTo(80,120,76,0);X.quadraticCurveTo(40,60,0,52);X.quadraticCurveTo(-40,60,-76,0);X.fill();
  X.fillStyle='#1a0e08';X.fillRect(-46,-28,26,9);X.fillRect(20,-28,26,9);X.fillRect(-40,-50,32,7);X.fillRect(10,-50,32,7);
  X.fillStyle='#f4ecd6';X.beginPath();X.ellipse(0,-92,104,62,0,Math.PI,0);X.fill();X.beginPath();X.ellipse(0,-90,100,30,0,0,TAU);X.fill();X.strokeStyle='#d8c8a4';X.lineWidth=5;for(let i=0;i<4;i++){X.beginPath();X.ellipse(0,-100-i*12,96-i*14,22,0,0,Math.PI);X.stroke()}
  X.fillStyle='#d2322a';X.beginPath();X.ellipse(0,-150,40,26,0,Math.PI,0);X.fill();X.fillStyle='#ffd23a';X.beginPath();X.arc(0,-112,10,0,TAU);X.fill();X.restore();X.restore()}
function helmet(x,y,s,t,hit){X.save();X.translate(x+(hit>0&&hit<.5?Math.sin(hit*80)*14*(1-hit*2):0),y);X.scale(s,s);
  X.fillStyle='#8a8f98';X.beginPath();X.moveTo(-210,40);X.quadraticCurveTo(-220,260,-150,340);X.lineTo(150,340);X.quadraticCurveTo(220,260,210,40);X.fill();
  X.fillStyle='rgba(30,30,40,.35)';for(let r=0;r<12;r++)for(let c=0;c<16;c++){X.beginPath();X.arc(-195+c*26+(r%2)*13,60+r*24,7,0,TAU);X.fill()}
  const g=X.createLinearGradient(-200,0,200,0);g.addColorStop(0,'#5a5f68');g.addColorStop(.45,'#e8ecf0');g.addColorStop(1,'#4a4e56');X.fillStyle=g;X.beginPath();X.moveTo(-200,60);X.quadraticCurveTo(-200,-120,0,-230);X.quadraticCurveTo(200,-120,200,60);X.closePath();X.fill();
  X.fillStyle='#d8b04c';X.fillRect(-206,40,412,30);X.fillRect(-10,-230,20,24);X.fillStyle='#b8862b';X.fillRect(-14,70,28,120);X.restore()}
function dagger(x,y,ang,s){X.save();X.translate(x,y);X.rotate(ang);X.scale(s,s);const g=X.createLinearGradient(0,-20,0,20);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#8a96a8');X.fillStyle=g;X.beginPath();X.moveTo(0,-18);X.lineTo(300,0);X.lineTo(0,18);X.fill();X.fillStyle='#d8b04c';X.fillRect(-20,-40,20,80);X.fillStyle='#3a2014';X.fillRect(-120,-14,100,28);X.fillStyle='#d8b04c';X.beginPath();X.arc(-125,0,18,0,TAU);X.fill();X.restore()}
function spark(x,y,k){if(k<=0||k>=1)return;X.save();X.globalCompositeOperation='lighter';for(let i=0;i<26;i++){const a=i/26*TAU+hash(i),r=40+k*(200+hash(i+3)*200);X.strokeStyle=`rgba(255,${200+hash(i)*55|0},120,${1-k})`;X.lineWidth=6;X.beginPath();X.moveTo(x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.6);X.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);X.stroke()}
  const rg=X.createRadialGradient(x,y,0,x,y,260*(1-k*.5));rg.addColorStop(0,`rgba(255,240,200,${1-k})`);rg.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=rg;X.fillRect(x-300,y-300,600,600);X.restore()}
function parchment(x,y,w,h,a=1,r=0){X.save();X.globalAlpha=a;X.translate(x,y);X.rotate(r);X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=40;X.shadowOffsetY=16;const g=X.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,'#fbf1da');g.addColorStop(1,'#e6cf9c');X.fillStyle=g;X.beginPath();X.roundRect(-w/2,-h/2,w,h,22);X.fill();X.shadowColor='transparent';X.lineWidth=6;X.strokeStyle='#b8862b';X.stroke();X.restore()}
function cairo(t){sky('#2a1a4a','#e8703a','#ffd08a');const sx=W*.72,sy=640;const sg=X.createRadialGradient(sx,sy,0,sx,sy,420);sg.addColorStop(0,'rgba(255,240,180,1)');sg.addColorStop(.25,'rgba(255,200,110,.6)');sg.addColorStop(1,'rgba(255,150,60,0)');X.fillStyle=sg;X.fillRect(0,0,W,H);X.fillStyle='#fff3c0';X.beginPath();X.arc(sx,sy,90,0,TAU);X.fill();
  const sil='#3a1e2a',z=1+.02*t;X.save();X.translate(W/2,1250);X.scale(z,z);X.translate(-W/2,-1250);X.fillStyle=sil;X.fillRect(0,1250,W,700);
  const dome=(x,y,r)=>{X.beginPath();X.arc(x,y,r,Math.PI,0);X.fill();X.fillRect(x-r,y,r*2,70);X.fillRect(x-2,y-r-40,4,40)},mina=(x,y,h)=>{X.fillRect(x-14,y-h,28,h);X.fillRect(x-22,y-h*.7,44,10);X.beginPath();X.moveTo(x-14,y-h);X.lineTo(x,y-h-50);X.lineTo(x+14,y-h);X.fill()};
  dome(260,1190,90);dome(470,1150,130);dome(720,1200,80);mina(120,1250,380);mina(380,1250,460);mina(600,1250,420);mina(880,1250,360);X.fillRect(0,1200,W,60);
  X.fillStyle='rgba(80,140,200,.55)';X.fillRect(0,1480,W,120);X.restore()}
function banner(x,y,col,k,t,label){X.save();X.translate(x,y);X.strokeStyle='#3a2414';X.lineWidth=10;X.beginPath();X.moveTo(0,0);X.lineTo(0,-560);X.stroke();X.fillStyle=col;X.globalAlpha=clamp(k);X.beginPath();X.moveTo(6,-550);for(let i=0;i<=10;i++)X.lineTo(6+i*30,-550+14*Math.sin(t*3+i*.7));for(let i=10;i>=0;i--)X.lineTo(6+i*30,-330+14*Math.sin(t*3+i*.7));X.fill();if(label)tx(label,160,-440,46,'#fff',{st:6,f:'InterB',w:800,maxW:280});X.restore()}
function masyaf(t,siege){sky('#203a6a','#f0a060','#ffe0b0');const sg=X.createRadialGradient(W*.25,700,0,W*.25,700,600);sg.addColorStop(0,'rgba(255,230,170,.6)');sg.addColorStop(1,'rgba(255,200,120,0)');X.fillStyle=sg;X.fillRect(0,0,W,H);
  ridge(t,'#8a7a9a',.3,1,1050,200);ridge(t,'#6a5a6a',.5,2,1220,160);
  const z=1+.012*t;X.save();X.translate(W/2,1150);X.scale(z,z);fortress(0,0,.95,.7,t);X.restore();
  const gg=X.createLinearGradient(0,1380,0,H);gg.addColorStop(0,'#8a6a40');gg.addColorStop(1,'#3a2614');X.fillStyle=gg;X.beginPath();X.moveTo(0,1420);X.quadraticCurveTo(W/2,1370,W,1420);X.lineTo(W,H);X.lineTo(0,H);X.fill();
  if(siege>0){X.save();X.globalAlpha=siege;for(let i=0;i<11;i++){const x=40+i*100+(i%2)*30,y=1530+(i%3)*70,s=.8+(i%3)*.25;X.save();X.translate(x,y);X.scale(s,s);
    const tg=X.createLinearGradient(-80,0,80,0);tg.addColorStop(0,'#c8a870');tg.addColorStop(.5,'#f6e6c0');tg.addColorStop(1,'#a88850');X.fillStyle=tg;X.beginPath();X.moveTo(-80,0);X.quadraticCurveTo(-40,-60,0,-120);X.quadraticCurveTo(40,-60,80,0);X.fill();X.fillStyle='rgba(60,30,10,.5)';X.beginPath();X.moveTo(-14,0);X.lineTo(0,-50);X.lineTo(14,0);X.fill();
    X.strokeStyle='#3a2414';X.lineWidth=3;X.beginPath();X.moveTo(0,-120);X.lineTo(0,-185);X.stroke();X.fillStyle='#ffcf3a';X.beginPath();X.moveTo(0,-185);for(let q=0;q<=6;q++)X.lineTo(q*8,-185+5*Math.sin(t*4+q+i));X.lineTo(48,-160);X.lineTo(0,-160);X.fill();X.restore()}
    for(let i=0;i<4;i++){const x=150+i*260,y=1800,f=1+.2*Math.sin(t*11+i);const rg=X.createRadialGradient(x,y,0,x,y,90*f);rg.addColorStop(0,'rgba(255,170,60,.7)');rg.addColorStop(1,'rgba(255,120,30,0)');X.fillStyle=rg;X.fillRect(x-100,y-100,200,200)}X.restore()}}
// ---------- cues ----------
const C={alamut:cue('alamut'),bin1:cue('bin doksanda'),hasan:cue('hasan'),siz:cue('sızarak'),ama:cue('ama bu'),kurt:cue('kürt tarihine'),alamuta:cue('alamuta'),sel:cue('selahaddin'),bin2:cue('bin yüz yetmiş beşte'),halep:cue('halep'),azaz1:cue('azazda'),azaz2:cue('azazda',2),darbe:cue('darbeyi'),zirh:cue('zırh'),bunu:cue('bunu'),cizre:cue('cizre'),ibn:cue('ibnül'),riv:cue('rivayete'),hanc:cue('hançer'),not:cue('not'),
 isma:cue('selahaddin ismaililere'),vez:cue('veziriydi'),amca:cue('amcası'),bin3:cue('bin yüz yetmiş birde'),hutbe:cue('hutbeyi'),sona:cue('sona'),fat:cue('aşkın'),mas:cue('bin yüz yetmiş altıda selahaddin'),masy:cue('masyafı'),dayi:cue('dayısı'),kald:cue('kaldırdı'),iki:cue('iki taraf'),
 dey:cue('alamutun'),deylem:cue('deylemdi'),zaza:cue('zazalar'),dimili:cue('dımıli'),alman:cue('alman'),tart:cue('tartışılıyor'),birk:cue('bir kale',2),hal:cue('bir halifelik'),isim:cue('bir isim'),bil:cue('kürt tarihinin'),dirok:cue('dirokta')};
// ---------- scenes ----------

function medal(who,x,y,r,t,k=1){if(k<=0)return;X.save();X.translate(x,y);X.scale(k,k);X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=40;X.fillStyle='#120a06';X.beginPath();X.arc(0,0,r,0,TAU);X.fill();X.shadowColor='transparent';X.save();X.beginPath();X.arc(0,0,r-6,0,TAU);X.clip();
  const g=X.createRadialGradient(r*.3,0,0,0,0,r*1.2);g.addColorStop(0,'#7a4a20');g.addColorStop(1,'#140a06');X.fillStyle=g;X.fillRect(-r,-r,2*r,2*r);drawPortrait(who,0,r*.22,r/330,t);X.restore();X.lineWidth=12;X.strokeStyle=goldG(-r,r);X.beginPath();X.arc(0,0,r,0,TAU);X.stroke();X.restore()}
function chamber(t,who,o={}){const f=1+.06*Math.sin(t*9.3)+.04*Math.sin(t*23);X.fillStyle='#0a0604';X.fillRect(0,0,W,H);
  // arched window with Alamut at dusk
  X.save();X.beginPath();X.moveTo(150,820);X.lineTo(150,420);X.arc(330,420,180,Math.PI,0);X.lineTo(510,820);X.closePath();X.clip();X.drawImage(A3.render(t,[[0,[-9,3,26],[0,-.2,0]]],{fog:.005}),33,60,594,1056);X.fillStyle='rgba(20,10,30,.25)';X.fillRect(0,0,W,H);X.restore();
  X.lineWidth=18;X.strokeStyle='#2a1a10';X.beginPath();X.moveTo(150,820);X.lineTo(150,420);X.arc(330,420,180,Math.PI,0);X.lineTo(510,820);X.stroke();
  const z=1+.012*t;X.save();X.translate(W/2,H/2);X.scale(z,z);X.translate(-W/2,-H/2);drawPortrait(who,600,1000,1.55,t,{light:1.2});X.restore();
  const cx=900,cy=1500;const rg=X.createRadialGradient(cx,cy-80,0,cx,cy-80,800*f);rg.addColorStop(0,'rgba(255,170,70,.35)');rg.addColorStop(1,'rgba(255,120,30,0)');X.save();X.globalCompositeOperation='lighter';X.fillStyle=rg;X.fillRect(0,0,W,H);X.restore();
  X.fillStyle='#f0e6d0';X.fillRect(cx-22,cy-40,44,180);X.fillStyle='#ffd27a';X.beginPath();X.ellipse(cx,cy-70,16*f,36*f,Math.sin(t*3)*.08,0,TAU);X.fill();X.fillStyle='#fff6d8';X.beginPath();X.ellipse(cx,cy-62,7,16,0,0,TAU);X.fill();
  X.save();X.globalAlpha=.18;for(let i=0;i<5;i++){const yy=cy-120-((t*60+i*90)%420);X.strokeStyle='#d8d0c0';X.lineWidth=6;X.beginPath();X.moveTo(cx+Math.sin(t+i)*10,yy+60);X.quadraticCurveTo(cx+30*Math.sin(t*1.3+i),yy+30,cx+Math.sin(t*2+i)*20,yy);X.stroke()}X.restore();
  const vg=X.createLinearGradient(0,H*.7,0,H);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.8)');X.fillStyle=vg;X.fillRect(0,0,W,H)}
const FLY=[[0,[-26,9,72],[0,-1,0]],[3.2,[3,3.2,20],[0,-.2,0]],[7.6,[2.4,.75,4.6],[0,.15,0]]];
function sHook(t){if(t<C.hasan-.05){X.drawImage(A3.render(t,FLY),0,0);const g=X.createLinearGradient(0,0,0,700);g.addColorStop(0,'rgba(10,6,20,.6)');g.addColorStop(1,'rgba(10,6,20,0)');X.fillStyle=g;X.fillRect(0,0,W,700);embers(t,25);
    const kt=pop(t,C.alamut-.3,.6);if(kt>0){X.save();X.translate(W/2,430);X.scale(kt,kt);tx('ALAMUT',0,0,210,'gold',{f:'CinzelH',w:900,st:24,ls:8});X.restore();tx('ELBURZ DAĞLARI · İRAN',W/2,570,44,'#ffe9c0',{f:'InterB',w:800,st:8,ls:6,a:clamp((t-C.alamut)/.4)})}badge('1090',pop(t,C.bin1,.4));return}
  chamber(t,'hasan');badge('1090',1);const kn=pop(t,C.hasan,.45);if(kn>0){X.save();X.translate(W/2,430);X.scale(kn,kn);tx('HASAN SABBAH',0,0,120,'gold',{f:'CinzelH',w:900,st:18,maxW:1000});X.restore();tx('Alamut’un efendisi',W/2,535,50,'#ffe9c0',{f:'Corm',w:'italic 600',st:8,a:clamp((t-C.hasan-.3)/.4)})}
  chip('KUŞATMADAN · İÇERİDEN',W/2,1660,pop(t,C.siz,.4),['#fff3b0','#ffb01a'],{size:56,h:104})}
function sKurt(t){X.drawImage(A3.render(t,[[C.ama,[2.4,.75,4.6],[0,.15,0]],[C.alamuta,[-1.2,1.1,4.4],[0,.2,0]]]),0,0);X.fillStyle=`rgba(10,4,6,${.7*clamp((t-C.ama)/.3)})`;X.fillRect(0,0,W,H);const k=pop(t,C.kurt-.2,.5);if(k>0){X.save();X.translate(W/2,880);X.scale(k,k);tx('BU HİKÂYE',0,-120,110,'#fff',{st:18});tx('KÜRT TARİHİNE',0,40,150,'gold',{st:24});tx('DOKUNUYOR',0,200,150,'gold',{st:24});X.restore()}}
function sMapSyria(t){const k1=eio((t-C.alamuta-.3)/2.6),k2=eio((t-C.halep+.6)/1.4),lo=lerp(lerp(48.6,40.4,k1),37.6,k2),la=lerp(35.8,35.7,k1),s=lerp(.68,.95,k2);drawMap(lo,la,s,.25);
  pin(50.58,36.44,'ALAMUT','Hasan Sabbah',pop(t,C.alamuta,.4),'#ff5a3a',-1,t);arrowArc([50.58,36.44],[36.35,35.07],clamp((t-C.alamuta-.4)/1.4),'#ff5a3a',-.18,true);
  pin(36.35,35.07,'MASYAF','Suriye fedaileri',pop(t,C.alamuta+1.5,.4),'#ff5a3a',1,t);
  pin(37.16,36.2,'HALEP','1175',pop(t,C.halep,.4),'#ffcf3a',1,t);pin(37.05,36.59,'AZAZ','1176',pop(t,C.azaz1,.4),'#ffcf3a',1,t);
  const ks=pop(t,C.sel-.2,.5);if(ks>0){medal('saladin',W/2,1350,250,t,ks);tx('SELAHADDİN EYYUBİ',W/2,1660,74,'gold',{f:'CinzelH',w:900,st:14,a:clamp(ks),maxW:1000})}
  if(t>C.alamuta&&t<C.sel)chip('HEDEF: BİR KÜRT',W/2,330,pop(t,C.alamuta+2,.4),['#ff7a5a','#c8201a'],{size:64,h:116,fg:'#fff'})}
function sStrike(t){const lt=t-C.azaz2;sky('#1a0e0a','#4a2418','#1a0e0a');embers(t,30);const hit=t-C.darbe-.1;helmet(W/2,980,1.3,t,hit);
  const da=clamp((t-C.darbe+.35)/.45),sh=hit>0&&hit<.4?Math.sin(hit*60)*8:0;dagger(lerp(1500,920,eio(da))+sh,lerp(-120,440,eio(da)),2.3,1.4);spark(W/2+90,770,clamp(hit/.7));
  badge('1176 · AZAZ',pop(t,C.azaz2,.4));const kz=pop(t,C.zirh,.4);if(kz>0)chip('ZIRH BAŞLIK DURDURDU',W/2,1580,kz,['#fff3b0','#ffb01a'],{size:66,h:120})}
function sSource(t){sky('#2a1408','#6a3a1a','#2a1408');embers(t,30);const k=pop(t,C.bunu,.5);if(k<=0)return;X.save();X.translate(W/2,900);X.scale(k,k);X.translate(-W/2,-900);parchment(W/2,900,880,820,1,-.02);
  tx('KAYNAK',W/2,580,52,'#7a2a10',{f:'CinzelH',w:900,st:0,ls:10});tx('İBNÜ’L-ESÎR',W/2,730,110,'#3a2410',{f:'CinzelH',w:900,st:0});tx('el-Kâmil fi’t-Târîh',W/2,860,76,'#7a2a10',{f:'Corm',w:'italic 600',st:0});
  X.fillStyle='#b8862b';X.fillRect(W/2-200,940,400,4);tx('Cizre doğumlu tarihçi',W/2,1030,56,'#3a2410',{f:'InterB',w:800,st:0,a:clamp((t-C.cizre)/.4)});tx('1160 – 1233',W/2,1110,48,'#7a2a10',{f:'CinzelH',w:900,st:0,a:clamp((t-C.cizre)/.4)});X.restore()}
function sNote(t){sky('#05040a','#120c18','#1a1010');const cx=760,cy=1040,f=1+.08*Math.sin(t*9)+.05*Math.sin(t*23);const rg=X.createRadialGradient(cx,cy,0,cx,cy,700*f);rg.addColorStop(0,'rgba(255,190,90,.55)');rg.addColorStop(1,'rgba(255,120,40,0)');X.fillStyle=rg;X.fillRect(0,0,W,H);
  X.fillStyle='#3a2018';X.fillRect(0,1240,W,700);X.fillStyle='#e8dcc0';X.beginPath();X.roundRect(-40,1150,760,200,30);X.fill();X.fillStyle='#b8302a';X.beginPath();X.roundRect(-40,1240,760,140,20);X.fill();
  X.fillStyle='#f4ecd6';X.fillRect(cx-22,cy-60,44,200);X.fillStyle='#ffd27a';X.beginPath();X.ellipse(cx,cy-90,18*f,38*f,0,0,TAU);X.fill();
  const kd=pop(t,C.hanc,.4);if(kd>0){X.save();X.translate(440,1150);X.scale(kd,kd);dagger(0,0,-1.35,.95);X.restore()}
  const kn=pop(t,C.not,.4);if(kn>0){parchment(330,1080,280,200,clamp(kn),-.12);tx('…',330,1070,80,'#3a2410',{st:0,a:clamp(kn)})}
  chip('RİVAYET',W/2,330,pop(t,C.riv,.4),'dark',{size:70,h:120,f:'CinzelH',w:900});tx('Masyaf kuşatması sırasında',W/2,460,46,'#ffe9c0',{f:'InterB',w:800,st:8,a:clamp((t-C.riv-.4)/.4)})}
function sCairo(t){cairo(t-C.isma);const sw=clamp((t-C.hutbe)/.6);banner(140,1230,'#1f8a4a',1-sw,t,sw<.5?'FATIMİ':'');banner(140,1230,'#111',sw,t,sw>=.5?'ABBASİ':'');
  tx('KAHİRE',W/2,330,140,'gold',{f:'CinzelH',w:900,st:18,ls:8,a:clamp((t-C.isma)/.5)*(1-clamp((t-C.bin3+.2)/.25))});
  medal('saladin',W*.62,1010,190,t,pop(t,C.isma+.2,.45)*(1-clamp((t-C.bin3+.3)/.3)));const kv=pop(t,C.vez,.4);if(kv>0&&t<C.bin3)chip('FATIMİ HALİFESİNİN VEZİRİ',W/2,520,kv,'dark',{size:56,h:104});
  const ka=pop(t,C.amca,.4);if(ka>0&&t<C.bin3)chip('AMCASI ESEDÜDDİN ŞİRKUH’TAN',W/2,660,ka,['#fff3b0','#ffb01a'],{size:50,h:96});
  if(t>C.bin3){badge('1171',pop(t,C.bin3,.4));const ks=pop(t,C.fat,.5);if(ks>0){X.save();X.translate(W/2,620);X.scale(ks,ks);tx('FATIMİ HALİFELİĞİ',0,-60,96,'#fff',{st:16});tx('SONA ERDİ',0,70,130,'#ff5a4a',{st:20});X.restore();tx('909 – 1171',W/2,800,56,'#ffe9c0',{f:'CinzelH',w:900,st:10,ls:6,a:clamp(ks)})}}}
function sMasyaf(t){const sg=clamp((t-C.masy)/.6)*(1-clamp((t-C.kald)/.8));masyaf(t-C.mas,sg);badge('1176 · MASYAF',pop(t,C.mas,.4));
  tx('FEDAİLERİN KALESİ',W/2,400,64,'#fff',{st:12,a:clamp((t-C.masy)/.4)});
  medal('saladin',W/2,690,150,t,pop(t,C.mas+.3,.45)*(1-clamp((t-C.dayi+.2)/.3)));const kd=pop(t,C.dayi,.4);if(kd>0&&t<C.iki)chip('DAYISI ŞİHABEDDİN EL-HARİMİ',W/2,560,kd,'dark',{size:50,h:100});
  const kk=pop(t,C.kald,.4);if(kk>0&&t<C.iki)chip('KUŞATMA KALKTI',W/2,700,kk,['#fff3b0','#ffb01a'],{size:62,h:112});
  const ki=pop(t,C.iki,.45);if(ki>0){X.save();X.translate(W/2,640);X.scale(ki,ki);tx('🤝',0,-30,150,'#fff',{st:0,f:'InterB'});X.restore();chip('BİR DAHA DOKUNMADILAR',W/2,800,ki,['#fff3b0','#ffb01a'],{size:60,h:112})}}
function sName(t){const k=eio((t-C.zaza+.5)/1.8),lo=lerp(49.2,45.25,k),la=lerp(37,37.25,k),s=lerp(1.1,.69,k);drawMap(lo,la,s,.2);
  const kd=pop(t,C.deylem,.4);if(kd>0){const[x,y]=P(49.9,36.9);X.save();X.globalAlpha=clamp(kd)*.55;const rg=X.createRadialGradient(x,y,0,x,y,170*VIEW.s);rg.addColorStop(0,'rgba(255,90,60,.9)');rg.addColorStop(1,'rgba(255,90,60,0)');X.fillStyle=rg;X.beginPath();X.arc(x,y,170*VIEW.s,0,TAU);X.fill();X.restore()}
  pin(50.58,36.44,'',null,pop(t,C.dey,.4),'#ff5a3a',1,t);pin(49.6,37.0,'DEYLEM','Alamut’un bölgesi',kd,'#ff5a3a',-1,t);
  pin(40.5,38.9,'ZAZALAR','“Dımılî”',pop(t,C.zaza,.4),'#ffcf3a',1,t);arrowArc([40.9,38.75],[49.3,37.15],clamp((t-C.dimili)/1.2),'#ffe9a8',-.2,true);
  const kq=pop(t,C.dimili+1.1,.4);if(kq>0){X.save();X.translate(W/2,1500);X.scale(kq,kq);tx('DEYLEM  ↔  DIMILÎ ?',0,0,96,'gold',{f:'CinzelH',w:900,st:16,maxW:1000});X.restore()}
  if(t>C.alman){chip('ALMAN İRANOLOGLAR · 20. YY BAŞI',W/2,330,pop(t,C.alman,.4),'dark',{size:44,h:92})}
  const kt=pop(t,C.tart,.35);if(kt>0){X.save();X.translate(W/2,1680);X.rotate(-.06);X.scale(kt,kt);X.lineWidth=10;X.strokeStyle='#ff5a4a';X.beginPath();X.roundRect(-300,-70,600,140,18);X.stroke();tx('TARTIŞMALI',0,6,96,'#ff5a4a',{st:0,ls:6});X.restore()}}
function sClose(t){X.drawImage(A3.render(t,[[C.birk,[4.5,1.6,6],[0,.1,0]],[END,[-4,1.3,5.5],[0,.15,0]]],{night:1,fog:.004}),0,0);X.fillStyle='rgba(6,4,12,.35)';X.fillRect(0,0,W,H);
  [['BİR KALE',C.birk,520],['BİR HALİFELİK',C.hal,700],['BİR İSİM',C.isim,880]].forEach(([s,c,y])=>{const k=pop(t,c,.4);if(k>0){X.save();X.translate(W/2,y);X.scale(k,k);tx(s,0,0,120,'gold',{f:'CinzelH',w:900,st:18});X.restore()}});
  const kb=pop(t,C.bil,.45);if(kb>0){chip('KÜRT TARİHİNİN BİLİNMEYEN KÖŞELERİ',W/2,1560,kb,['#fff3b0','#ffb01a'],{size:52,h:110,maxW:1000})}}
function sEnd(t){const lt=t-END;X.fillStyle='#0d0819';X.fillRect(0,0,W,H);const cx=W/2,cy=760,R=300;const bg=X.createRadialGradient(cx,cy,0,cx,cy,900);bg.addColorStop(0,'rgba(255,170,80,.35)');bg.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=bg;X.fillRect(0,0,W,H);
  X.save();X.translate(cx,cy);X.rotate(lt*.06);const rk=eback(clamp((lt-.2)/.9));for(let i=0;i<21;i++){const L=R+(110+30*Math.sin(lt*2.2+i))*rk;const g=X.createLinearGradient(0,-R,0,-L);g.addColorStop(0,'rgba(255,214,90,.95)');g.addColorStop(1,'rgba(255,170,40,.15)');X.fillStyle=g;X.beginPath();X.moveTo(-30,-R+10);X.lineTo(0,-L);X.lineTo(30,-R+10);X.fill();X.rotate(TAU/21)}X.restore();
  const k=eback(clamp(lt/.8));X.save();X.translate(cx,cy);X.scale(.82+.18*k,.82+.18*k);X.beginPath();X.arc(0,0,R,0,TAU);X.clip();X.drawImage(LOGO,-R*1.05,-R*1.05,R*2.1,R*2.1);X.restore();X.save();X.lineWidth=6;X.strokeStyle=goldG(cy-R,cy+R);X.beginPath();X.arc(cx,cy,R+8,0,TAU);X.stroke();X.restore();
  tx('DÎROK',W/2,1190,150,'gold',{f:'CinzelD',w:900,st:16,ls:10,a:clamp((lt-.3)/.4)});tx('@dirokakurd',W/2,1310,60,'#fff',{f:'InterB',w:800,st:10,a:clamp((lt-.5)/.4)});
  const kb=pop(lt,1,.4);if(kb>0){X.save();X.translate(W/2,1480);X.scale(kb,kb);X.fillStyle='#b8241c';X.shadowColor='rgba(0,0,0,.5)';X.shadowBlur=24;X.beginPath();X.roundRect(-260,-64,520,128,64);X.fill();X.shadowColor='transparent';tx('ABONE OL',0,4,70,'#fff',{st:0,ls:4});X.restore()}}
// ---------- captions ----------
const FIX={İranın:'İran’ın',Alamuta:'Alamut’a',Suriyedeki:'Suriye’deki',Kürttü:'Kürt’tü',Azazda:'Azaz’da',İbnül:'İbnü’l-',Esir:'Esîr',Mısırdaki:'Mısır’daki',Şirkuhtan:'Şirkuh’tan',Masyafı:'Masyaf’ı',el:'el-',Alamutun:'Alamut’un',Deylemdi:'Deylem’di',Dımıli:'Dımılî',Dirokta:'DÎROK’ta'};
const CAPS=[];{let cur=[];WORDS.forEach((w,i)=>{const b=w[0].replace(/[.,:;!?]/g,'');let d=w[0];if(FIX[b])d=w[0].replace(b,FIX[b]);cur.push({w:d,s:OFF+w[1],e:OFF+w[2]});if(/[.,:;!?]$/.test(w[0])||cur.length>=4||i===WORDS.length-1){CAPS.push(cur);cur=[]}})}
CAPS.forEach(c=>{for(let i=0;i<c.length-1;i++)if(c[i].w.endsWith('-')){c[i].w+=c[i+1].w;c[i].e=c[i+1].e;c.splice(i+1,1)}});
function captions(t){const c=CAPS.find(c=>t>=c[0].s-.05&&t<c[c.length-1].e+.3);if(!c)return;X.save();X.font='800 56px InterB';const sp=X.measureText(' ').width,ws=c.map(w=>X.measureText(w.w).width),tot=ws.reduce((a,b)=>a+b,0)+sp*(c.length-1);const sc=Math.min(1,960/tot);X.translate(W/2,1820);X.scale(sc,sc);
  X.fillStyle='rgba(20,10,6,.85)';X.beginPath();X.roundRect(-tot/2-32,-50,tot+64,100,24);X.fill();X.textBaseline='middle';X.textAlign='left';let x=-tot/2;c.forEach((w,i)=>{X.fillStyle=t>=w.s-.03?'#ffd65a':'#fff';X.fillText(w.w,x,3);x+=ws[i]+sp});X.restore()}
// ---------- master ----------
const SC=[[0,sHook],[C.ama,sKurt],[C.alamuta,sMapSyria],[C.azaz2,sStrike],[C.bunu,sSource],[C.riv,sNote],[C.isma,sCairo],[C.mas,sMasyaf],[C.dey,sName],[C.birk,sClose],[END,sEnd]];
function renderFrame(t){X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.shadowColor='transparent';X.setLineDash([]);let i=0;while(i<SC.length-1&&t>=SC[i+1][0])i++;SC[i][1](t);
  SC.slice(1).forEach(([c])=>{const d=t-c;if(d>-.1&&d<.28){X.fillStyle=`rgba(255,245,225,${.8*(d<0?1+d/.1:1-d/.28)})`;X.fillRect(0,0,W,H)}});
  vign(.4);if(t<END){captions(t);tx('DÎROK',W/2,110,50,'gold',{f:'CinzelD',w:900,st:8,ls:10,a:.95})}
  if(t>TOTAL-.5){X.fillStyle=`rgba(0,0,0,${clamp((t-TOTAL+.5)/.5)})`;X.fillRect(0,0,W,H)}}
window.renderFrame=renderFrame;window.MISS=MISS;
window.SFX=[['boom',.2],['shimmer',C.alamut-.3],['boom',C.bin1],['whoosh',C.ama-.1],['boom',C.kurt],['whoosh',C.alamuta-.1],['boom',C.sel],['whoosh',C.azaz2-.1],['clash',C.darbe+.1],['whoosh',C.bunu-.1],['whoosh',C.riv-.1],['boom',C.hanc],['whoosh',C.isma-.1],['boom',C.sona],['whoosh',C.mas-.1],['boom',C.masy],['whoosh',C.dey-.1],['boom',C.tart],['whoosh',C.birk-.1],['boom',C.birk],['boom',C.hal],['boom',C.isim],['shimmer',END-.6],['boom',END]];
// cover
window.drawCover=function(){X.setTransform(1,0,0,1,0,0);X.drawImage(A3.render(0,[[0,[3.2,1.4,7.5],[0,-.3,0]]]),0,0);const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(10,6,20,.75)');g.addColorStop(.3,'rgba(10,6,20,.1)');g.addColorStop(.62,'rgba(10,6,20,.2)');g.addColorStop(1,'rgba(10,6,20,.95)');X.fillStyle=g;X.fillRect(0,0,W,H);
  tx('DÎROK',W/2,110,50,'gold',{f:'CinzelD',w:900,st:8,ls:10});tx('ALAMUT',W/2,320,190,'gold',{f:'CinzelH',w:900,st:24,ls:8});
  medal('hasan',300,1330,230,1.2,1);medal('saladin',780,1330,230,2.3,1);X.save();X.translate(W/2,1330);X.fillStyle='#fff';X.shadowColor='rgba(0,0,0,.6)';X.shadowBlur=30;X.beginPath();X.arc(0,0,78,0,TAU);X.fill();X.shadowColor='transparent';tx('VS',0,6,84,'#c8201a',{st:0});X.restore();
  tx('HASAN SABBAH',300,1600,52,'#fff',{st:10,f:'CinzelH',w:900,maxW:440});tx('SELAHADDİN',780,1600,52,'#fff',{st:10,f:'CinzelH',w:900,maxW:440});
  X.save();X.translate(W/2,1790);X.rotate(-.03);chip('SUİKASTÇILARIN HEDEFİ: BİR KÜRT',0,0,1,['#ff7a5a','#c8201a'],{size:58,h:116,fg:'#fff',maxW:1020});X.restore();vign(.3)};
