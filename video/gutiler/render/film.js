// ================= FILM MASTER =================
function sAnthem(T,p){const lt=T-SH.t0;brightBG(lt,'#fff6c0','#ffb02a','#e0402a');const cx=W/2,cy=H*.36;
  X.save();X.translate(cx,cy);X.rotate(lt*.05);for(let i=0;i<21;i++){X.rotate(TAU/21);X.fillStyle='rgba(255,236,120,.95)';X.beginPath();X.moveTo(-26,-120);X.lineTo(0,-200-14*Math.sin(lt*2+i));X.lineTo(26,-120);X.fill()}X.restore();
  X.fillStyle='#ffd23a';X.beginPath();X.arc(cx,cy,120,0,TAU);X.fill();X.strokeStyle='#fff6c0';X.lineWidth=6;X.stroke();
  const a=A(p.kurd,.5);if(a>0){X.save();X.globalAlpha=a;X.translate(W/2,H*.72);goldHeadB('Em xortên Medya û Keyxusrew in',0,0,fitTxt('Em xortên Medya û Keyxusrew in','900 {s}px CinzelH',1700,92));X.restore()}
  const b=A(p.tr,.5);if(b>0){X.save();X.globalAlpha=b;X.textAlign='center';X.font='italic 600 60px Corm';X.lineJoin='round';X.lineWidth=8;X.strokeStyle='rgba(60,20,5,.7)';X.strokeText('“Biz Medya’nın ve Keyxusrew’in gençleriyiz”',W/2,H*.84);X.fillStyle='#fff';X.fillText('“Biz Medya’nın ve Keyxusrew’in gençleriyiz”',W/2,H*.84);X.restore()}
  labelBoxB(W/2,H*.09,'EY REQÎB','Kürt ulusal marşı','',ss(.2,.6,lt),'#ffb23a',clamp(lt/.5))}
const _scenic=sScenicText;sScenicText=function(T,p){_scenic(T,p);if(p.hero){const lt=T-SH.t0;const pp={x:W*.74,y:0,f:-1,h:420,torso:.02,head:-.05,ua:[.25,.1],ba:[.15,-.2],fl:[.12,-.05],bl:[-.12,-.02]};ground(pp,900);
  X.save();X.shadowColor='rgba(0,0,0,.35)';X.shadowBlur=14;warriorC(X,pp,PAL.guti,{helmet:'cone',shield:'round',spear:1.45,cloak:true,wind:lt*1.5});X.restore()}};
const SCENE={map:drawFilmMap,duel:sDuel,battle:sBattle,stele:sStele,anubanini:sAnubanini,tablet:sTablet,cylinder:sCylinder,lion:sLion,amarna:sAmarna,chariots:sChariots,ziggurat:sZiggurat,ekbatana:sEkbatana,
 eclipse:sEclipse,nineveh:sNineveh,van:sVan,gudea:sGudea,quote:sQuote,compare:sCompare,authors:sAuthors,etym:sEtym,lineage:sLineage,timeline:sTimeline,scenic:sScenicText,anthem:sAnthem,
 card:sChapterCard,council:sCouncil,governor:sGovernor,list:sList,city:sCity,title:sTitle,credits:sCredits,logo:(T,p)=>drawLogo(T-SH.t0)};
function normW(w){return w.toLocaleLowerCase('tr').replace(/[^a-zçğıöşüâîûê0-9-]/g,'')}
const MISSING=[];
function cueT(ch,q){if(typeof q==='number')return ch.start+q;let [key,off]=q.split('@');off=+(off||0);let [w,n]=key.split('#');n=+(n||1);const parts=w.split(' ').map(normW);const ws=ch.words;
  for(let i=0;i<ws.length;i++){if(parts.every((pp,j)=>ws[i+j]&&normW(ws[i+j][0]).startsWith(pp))){if(--n===0)return ch.start+ws[i][1]+off}}MISSING.push(ch.id+':'+q);return ch.start}
// build global shot list
const ALL=[];const TLc=window.TL.chapters;
TLc.forEach((ch,ci)=>{if(ch.id==='TITLE'){ALL.push({t0:ch.card,type:'title',p:{},ch:TLc[ci+1]});return}
  if(ch.card!=null)ALL.push({t0:ch.card,type:'card',p:{num:ch.num,title:ch.title,sub:ch.sub},ch});
  (SHOTS[ch.id]||[]).forEach(s=>ALL.push({t0:cueT(ch,s.at),type:s.type,p:s.p,ch}))});
ALL.push({t0:window.TL.credits,type:'credits',p:{},ch:TLc[TLc.length-1]});ALL.push({t0:window.TL.logo,type:'logo',p:{},ch:TLc[TLc.length-1]});
ALL.sort((a,b)=>a.t0-b.t0);ALL.forEach((s,i)=>{s.t1=i<ALL.length-1?ALL[i+1].t0:window.TL.total;s.R=q=>cueT(s.ch,q)});
// validate cues used inside params (resolve all strings that look like cues)
ALL.forEach(s=>{const walk=v=>{if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk)};walk(s.p)});
window.SHOTLIST=ALL.map(s=>[s.type,+s.t0.toFixed(2),+s.t1.toFixed(2)]);
// SFX events
window.SFX=[];ALL.forEach(s=>{if(s.type==='card'||s.type==='title')SFX.push(['whoosh',s.t0],['boom',s.t0+.15]);if(s.type==='duel'&&s.p.clash)SFX.push(['clash',s.R(s.p.clash)]);if(s.type==='battle'||s.type==='chariots')SFX.push(['army',s.t0]);
  if(s.type==='eclipse')SFX.push(['boom',s.R(s.p.dark)]);if(s.type==='logo')SFX.push(['shimmer',s.t0-.6],['boom',s.t0]);if(s.type==='map'&&s.p.fall)s.p.fall.forEach(f=>SFX.push(['boom',s.R(f[1])]))});
// captions
const CAPS=[];TLc.forEach(ch=>{if(!ch.words)return;let cur=[];ch.words.forEach((w,i)=>{cur.push({w:w[0],s:ch.start+w[1],e:ch.start+w[2]});if(/[.,:;!?…"]$/.test(w[0])&&cur.length>=3||cur.length>=8||i===ch.words.length-1){CAPS.push(cur);cur=[]}})});
function filmCaptions(T){const c=CAPS.find(c=>T>=c[0].s-.05&&T<c[c.length-1].e+.35);if(!c)return;X.save();X.font='800 40px InterB';X.textBaseline='middle';const txt=c.map(w=>w.w.replace(/"/g,''));const sp=X.measureText(' ').width;
  const ws=txt.map(t=>X.measureText(t).width);const total=ws.reduce((a,b)=>a+b,0)+sp*(txt.length-1);const x0=W/2-total/2,y=1018;X.fillStyle='rgba(15,8,4,.62)';X.beginPath();X.roundRect(x0-24,y-30,total+48,62,14);X.fill();
  let x=x0;txt.forEach((t,i)=>{const on=T>=c[i].s-.03;X.fillStyle=on?'#ffd65a':'#ffffff';X.fillText(t,x,y+2);x+=ws[i]+sp});X.restore()}
// render
const FB=mk(W,H),FX=FB.getContext('2d');
function drawShot(s,T,ctx){const main=X;X=ctx;ctx.filter='none';ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.setLineDash([]);SH={t0:s.t0,t1:s.t1,T,R:s.R,ch:s.ch};try{X.save();X.globalAlpha=1;X.globalCompositeOperation='source-over';SCENE[s.type](T,s.p);X.restore()}catch(e){console.log('ERRSHOT',s.type,e.message);try{for(let i=0;i<20;i++)X.restore()}catch(_){}}finally{X=main}}
const XF=.45;
function renderFrame(T){X.setTransform(1,0,0,1,0,0);X.filter='none';X.shadowBlur=0;X.shadowOffsetX=0;X.shadowOffsetY=0;X.setLineDash([]);X.globalAlpha=1;X.globalCompositeOperation='source-over';X.fillStyle='#000';X.fillRect(0,0,W,H);
  const act=ALL.filter(s=>T>=s.t0&&T<s.t1+XF);
  act.forEach((s,i)=>{if(i===0){drawShot(s,T,X)}else{FX.setTransform(1,0,0,1,0,0);FX.clearRect(0,0,W,H);drawShot(s,T,FX);const k=clamp((T-s.t0)/XF);X.save();X.globalAlpha=eio(k);X.drawImage(FB,0,0);X.restore();
    if(s.type==='card'||s.type==='title'){X.fillStyle=`rgba(255,250,230,${.5*Math.sin(Math.PI*k)})`;X.fillRect(0,0,W,H)}}});
  X.setTransform(1,0,0,1,0,0);X.globalAlpha=1;X.globalCompositeOperation='source-over';
  const vg=X.createRadialGradient(W/2,H/2,H*.45,W/2,H/2,H*1.05);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.28)');X.fillStyle=vg;X.fillRect(0,0,W,H);
  if(T<window.TL.credits)filmCaptions(T);
  if(T<window.TL.logo-.5){X.save();X.globalAlpha=.85;X.font='900 30px CinzelD';X.textAlign='right';X.letterSpacing='4px';X.lineWidth=5;X.lineJoin='round';X.strokeStyle='rgba(40,15,5,.6)';X.strokeText('DÎROK',W-50,70);X.fillStyle=goldGrad(X,45,75);X.fillText('DÎROK',W-50,70);X.restore()}
  if(T<.5){X.fillStyle=`rgba(0,0,0,${1-T/.5})`;X.fillRect(0,0,W,H)}if(T>window.TL.total-.8){X.fillStyle=`rgba(0,0,0,${clamp((T-window.TL.total+.8)/.8)})`;X.fillRect(0,0,W,H)}}
window.renderFrame=renderFrame;window.MISSING=MISSING;
