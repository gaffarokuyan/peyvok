const T={
  ku:{sub:"Rêwîtiya peyvan",j:"Ast temam",lvl:"Ast",found:"Berê hat dîtin",coins:"Zêr têrê nake!",cnt:"Peyv",bonus:"Peyva bonus",
      praise:["Baş e!","Pir baş!","Mezin!","Bêhempa!","Şahane!"],done:"Pîroz be!",gl:"Peyvên vê astê",next:"Asta din",set:"Mîheng",
      music:"Muzîk",sound:"Deng",reset:"Ji serî ve dest pê bike",fin:"Te hemû rêwîtî qedand!",post:"Kartpostala nû",coll:"Kartpostal",collSub:"ji 20 kartan",back:"Vegere"},
  tr:{sub:"Kelime yolculuğu",j:"Bölüm bitti",lvl:"Bölüm",found:"Zaten bulundu",coins:"Yeterli altın yok",cnt:"Kelime",bonus:"Bonus kelime",
      praise:["Güzel!","Çok iyi!","Müthiş!","Süper!","Efsane!"],done:"Tebrikler!",gl:"Bu bölümün kelimeleri",next:"Sonraki bölüm",set:"Ayarlar",
      music:"Müzik",sound:"Ses",reset:"Baştan başla",fin:"Tüm yolculuğu bitirdin!",post:"Yeni kartpostal",coll:"Kartpostallar",collSub:"20 kartpostaldan",back:"Geri"},
  en:{sub:"A journey in words",j:"Completed",lvl:"Level",found:"Already found",coins:"Not enough coins",cnt:"Words",bonus:"Bonus word",
      praise:["Good!","Great!","Awesome!","Brilliant!","Legendary!"],done:"Well done!",gl:"Words in this level",next:"Next level",set:"Settings",
      music:"Music",sound:"Sound",reset:"Start over",fin:"You finished the whole journey!",post:"New postcard",coll:"Postcards",collSub:"of 20 postcards",back:"Back"}
};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function load(){try{return JSON.parse(localStorage.getItem("peyvok:v5"))||{}}catch(e){return{}}}
const S=Object.assign({lang:"ku",lvl:0,coins:200,found:{},hint:{},bonus:{},cards:[],music:true,sound:true},load());
function save(){try{localStorage.setItem("peyvok:v5",JSON.stringify(S))}catch(e){}}
const L=()=>T[S.lang]||T.ku;
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
const N=LEVELS.length,sceneOf=i=>Math.min(SCENES.length-1,Math.floor(i/10));

// ================= AUDIO =================
const A={ctx:null,reg:0};
function initAudio(){
  try{
    if(A.ctx){if(A.ctx.state==="suspended")A.ctx.resume();return}
    const C=new (window.AudioContext||window.webkitAudioContext)();A.ctx=C;
    A.out=C.createDynamicsCompressor();A.out.threshold.value=-14;A.out.ratio.value=4;A.out.connect(C.destination);
    A.sfx=C.createGain();A.sfx.gain.value=.9;A.sfx.connect(A.out);
    A.mus=C.createGain();A.mus.gain.value=S.music?.5:0;A.mus.connect(A.out);
    const len=Math.floor(C.sampleRate*2.4),ir=C.createBuffer(2,len,C.sampleRate);
    for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2)}
    A.rev=C.createConvolver();A.rev.buffer=ir;const rg=C.createGain();rg.gain.value=.5;A.rev.connect(rg);rg.connect(A.out);
    A.noise=C.createBuffer(1,C.sampleRate,C.sampleRate);const nd=A.noise.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
    startMusic();
  }catch(e){A.ctx=null}
}
const now=()=>A.ctx.currentTime;
function tone(f,t,dur,o={}){
  const C=A.ctx,osc=C.createOscillator(),g=C.createGain(),{type="sine",vol=.2,att=.004,rev=.25,bus=A.sfx,glide,cents=0,filt}=o;
  osc.type=type;osc.frequency.setValueAtTime(f,t);osc.detune.value=cents;if(glide)osc.frequency.exponentialRampToValueAtTime(glide,t+dur);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  let src=osc;if(filt){const bf=C.createBiquadFilter();bf.type=filt[0];bf.frequency.value=filt[1];bf.Q.value=filt[2]||1;osc.connect(bf);src=bf}
  src.connect(g);g.connect(bus);if(rev){const s=C.createGain();s.gain.value=rev;g.connect(s);s.connect(A.rev)}
  osc.start(t);osc.stop(t+dur+.05);return osc;
}
function noiseHit(t,freq,dur,vol,bus=A.mus,q=1.5){const C=A.ctx,s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=A.noise;f.type="bandpass";f.frequency.value=freq;f.Q.value=q;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(bus);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
const marimba=(f,t,v=.22,bus)=>{tone(f,t,.55,{type:"sine",vol:v,bus});tone(f*4,t,.07,{vol:v*.35,rev:.1,bus});tone(f*2,t,.25,{type:"triangle",vol:v*.25,bus})};
const bell=(f,t,v=.14,d=1.4)=>{tone(f,t,d,{vol:v,rev:.5});tone(f*2.76,t,d*.5,{vol:v*.35,rev:.5});tone(f*5.4,t,d*.25,{vol:v*.15,rev:.5})};
const PENTA=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1567.98,1760];
const ok=()=>S.sound&&A.ctx&&A.ctx.state==="running";
function sparkle(t,n){for(let i=0;i<n;i++)bell(PENTA[5+Math.floor(Math.random()*5)],t+i*.045,.05,.6)}
const SFX={
  select:n=>{if(!ok())return;marimba(PENTA[Math.min(n,PENTA.length-1)],now())},
  found:()=>{if(!ok())return;const t=now();[0,4,7,12].forEach((s,i)=>bell(523.25*2**(s/12),t+i*.07,.12));sparkle(t+.25,5)},
  land:k=>{if(!ok())return;marimba(PENTA[Math.min(k+2,PENTA.length-1)]*2,now(),.12)},
  wrong:()=>{if(!ok())return;const t=now();tone(240,t,.16,{type:"triangle",vol:.2,rev:.1,glide:200});tone(180,t+.11,.26,{type:"triangle",vol:.2,rev:.1,glide:150})},
  dup:()=>{if(!ok())return;const t=now();tone(880,t,.07,{vol:.12});tone(880,t+.1,.07,{vol:.12})},
  coin:(d=0)=>{if(!ok())return;const t=now()+d;tone(1318.5,t,.07,{type:"square",vol:.05,rev:.15});tone(1975.5,t+.06,.3,{type:"square",vol:.05,rev:.2})},
  tap:()=>{if(!ok())return;tone(660,now(),.06,{vol:.12,rev:.05,glide:990})},
  whoosh:()=>{if(!ok())return;const C=A.ctx,t=now(),s=C.createBufferSource(),f=C.createBiquadFilter(),g=C.createGain();s.buffer=A.noise;f.type="bandpass";f.Q.value=1.2;
    f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(2600,t+.35);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.25,t+.12);g.gain.exponentialRampToValueAtTime(.001,t+.4);
    s.connect(f);f.connect(g);g.connect(A.sfx);s.start(t);s.stop(t+.45)},
  hint:()=>{if(!ok())return;sparkle(now(),8)},
  fanfare:()=>{if(!ok())return;const t=now(),ch=[[0,4,7],[5,9,12],[7,11,14],[12,16,19,24]];
    ch.forEach((c,i)=>c.forEach(s=>{const f=261.63*2**(s/12);tone(f,t+i*.22,i===3?2:.45,{type:"triangle",vol:.09,rev:.45});if(i===3)bell(f*2,t+i*.22,.06,2.2)}));sparkle(t+.7,10)},
  card:()=>{if(!ok())return;const t=now();[0,7,12,16,19].forEach((s,i)=>bell(392*2**(s/12),t+i*.09,.08,1.6))}
};
// Regional music: Bakur tembûr in Hicaz · Başûr bilûr in Kürdî · Rojhilat santur in Şûr · Rojava zurna + def in Rast
const D4=293.66,sc=(ints,cents)=>ints.map((s,i)=>({f:D4*2**(s/12),c:cents?cents[i]:0}));
const MODES=[
  {scale:sc([0,1,4,5,7,8,10,12]),tempo:76},
  {scale:sc([0,1,3,5,7,8,10,12]),tempo:60},
  {scale:sc([0,2,3,5,7,8,10,12],[0,-50,0,0,0,0,0,0]),tempo:84},
  {scale:sc([0,2,4,5,7,9,10,12],[0,0,-50,0,0,0,-50,0]),tempo:96}
];
let beat=0,mi=0;
function startMusic(){
  const C=A.ctx;[146.83,220,293.66].forEach((f,i)=>{const o=C.createOscillator(),g=C.createGain(),lfo=C.createOscillator(),lg=C.createGain(),lp=C.createBiquadFilter();
    o.type=i===2?"triangle":"sine";o.frequency.value=f;g.gain.value=[.045,.03,.01][i];lfo.frequency.value=.07+i*.05;lg.gain.value=g.gain.value*.5;lfo.connect(lg);lg.connect(g.gain);
    lp.type="lowpass";lp.frequency.value=900;o.connect(lp);lp.connect(g);g.connect(A.mus);o.start();lfo.start()});
  let next=C.currentTime+.3;
  setInterval(()=>{if(!A.ctx)return;while(next<A.ctx.currentTime+.4){const m=MODES[A.reg];schedule(next,m);next+=60/m.tempo/2}},100);
}
function step(m){mi=Math.max(0,Math.min(m.scale.length-1,mi+[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)]));if(beat%32===0)mi=0;return m.scale[mi]}
function schedule(t,m){
  beat++;if(!S.music)return;const r=A.reg,B=A.mus;
  if(beat%16===1)tone(73.42,t,3.2,{vol:.08,rev:.3,bus:B});
  if(r===0){if(Math.random()<(beat%4===1?.75:.38)){const n=step(m),v=beat%4===1?.11:.07;tone(n.f,t,.9,{type:"triangle",vol:v,rev:.55,bus:B,cents:n.c});tone(n.f*2,t,.18,{vol:v*.4,rev:.4,bus:B,cents:n.c})}}
  else if(r===1){if(beat%2===1&&Math.random()<.7){const n=step(m),d=60/m.tempo*(Math.random()<.4?2:1),o=tone(n.f*2,t,d,{vol:.07,att:.09,rev:.6,bus:B,cents:n.c});
      const lfo=A.ctx.createOscillator(),lg=A.ctx.createGain();lfo.frequency.value=5.4;lg.gain.value=n.f*.02;lfo.connect(lg);lg.connect(o.frequency);lfo.start(t+.15);lfo.stop(t+d);noiseHit(t,n.f*4,.12,.012,B,4)}}
  else if(r===2){if(Math.random()<(beat%2===1?.8:.35)){const n=step(m);for(const k of [0,.07,.14]){tone(n.f,t+k,.6,{type:"triangle",vol:.06*(1-k*3),rev:.5,bus:B,cents:n.c+2});tone(n.f,t+k,.6,{type:"triangle",vol:.05*(1-k*3),rev:.5,bus:B,cents:n.c-3})}}}
  else{const p=beat%8;if(p===1||p===5)noiseHit(t,160,.25,.18,B,1),tone(70,t,.25,{vol:.12,rev:.1,bus:B,glide:50});if(p===3||p===7||p===0)noiseHit(t,2400,.08,.05,B,3);
    if(Math.random()<(p%2?.6:.3)){const n=step(m);tone(n.f*2,t,.32,{type:"sawtooth",vol:.025,att:.02,rev:.4,bus:B,cents:n.c,filt:["bandpass",n.f*5,2.5]})}}
}
function setMusic(on){S.music=on;save();if(A.ctx)A.mus.gain.setTargetAtTime(on?.5:0,A.ctx.currentTime,.3)}
document.addEventListener("pointerdown",initAudio,{capture:true});
document.addEventListener("visibilitychange",()=>{if(!A.ctx)return;document.hidden?A.ctx.suspend():A.ctx.resume()});
const buzz=ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(_){}};

// ================= living scene =================
// photo scenes: real images replace painted ones where available
const IMG={};
const cover=(c,im,W,H,fy=.5)=>{const s=Math.max(W/im.width,H/im.height),iw=im.width*s,ih=im.height*s;c.drawImage(im,(W-iw)/2,(H-ih)*fy,iw,ih)};
function photo(c,W,H,si){cover(c,IMG[si],W,H,.55);
  let g=c.createLinearGradient(0,0,0,H*.2);g.addColorStop(0,"rgba(8,10,24,.35)");g.addColorStop(1,"rgba(8,10,24,0)");c.fillStyle=g;c.fillRect(0,0,W,H*.2);
  g=c.createLinearGradient(0,H*.62,0,H);g.addColorStop(0,"rgba(8,10,24,0)");g.addColorStop(1,"rgba(8,10,24,.4)");c.fillStyle=g;c.fillRect(0,H*.62,W,H*.38)}
Object.entries(typeof IMGSRC==="object"?IMGSRC:{}).forEach(([k,src])=>{const im=new Image();im.onload=()=>{IMG[k]=im;if(String(SI)===k||k==="c"){SI=-1;if($("#home").classList.contains("show"))setScene(sceneOf(Math.min(S.lvl,N-1)),true);else setScene(sceneOf(Math.min(S.lvl,N-1)))}};im.src=src});

const cv=$("#scene"),cx=cv.getContext("2d"),bgc=document.createElement("canvas");
let SI=-1,parts=[],clouds=[],birds=[],W0=0,H0=0,PT="";
function setScene(si,home){
  const sc=SCENES[si],R=REG[sc.r],st=document.documentElement.style;st.setProperty("--tile",R.tile);st.setProperty("--tile-hi",R.hi);st.setProperty("--tile-deep",R.deep);A.reg=R.mus;
  const K=home&&IMG.c?"c":si;if(K===SI&&W0===innerWidth&&H0===innerHeight)return;SI=K;
  const dpr=Math.min(2,devicePixelRatio||1);W0=innerWidth;H0=innerHeight;bgc.width=cv.width=W0*dpr;bgc.height=cv.height=H0*dpr;
  const b=bgc.getContext("2d");b.setTransform(dpr,0,0,dpr,0,0);cx.setTransform(dpr,0,0,dpr,0,0);(IMG[K]?photo(b,W0,H0,K):SC.draw(b,W0,H0,si));
  PT=K==="c"?"dust":sc.pt;const r=srand(si*11+2);clouds=si===14||IMG[K]?[]:Array.from({length:4},()=>({x:r()*W0,y:H0*(.06+r()*.2),s:40+r()*60,v:.08+r()*.12,a:.14+r()*.16}));
  parts=Array.from({length:PT==="snow"?55:36},()=>newPart(true));birds=[];if(RM)frame();
}
function newPart(init){const w=W0,h=H0,k=PT;
  if(k==="snow")return{x:Math.random()*w,y:init?Math.random()*h:-10,r:Math.random()*2+1,vy:.3+Math.random()*.6,ph:Math.random()*7};
  if(k==="petal"||k==="leaf")return{x:Math.random()*w,y:init?Math.random()*h:-10,r:Math.random()*3+2,vy:.4+Math.random()*.5,ph:Math.random()*7};
  if(k==="ember")return{x:Math.random()*w,y:init?h*(.4+Math.random()*.6):h+10,r:Math.random()*1.8+.8,vy:.35+Math.random()*.6,ph:Math.random()*7};
  if(k==="mist")return{x:Math.random()*w,y:h*(.35+Math.random()*.4),r:60+Math.random()*80,vx:.15+Math.random()*.2,ph:Math.random()*7};
  return{x:Math.random()*w,y:h*(.2+Math.random()*.7),r:Math.random()*1.6+.6,ph:Math.random()*7,sp:.02+Math.random()*.04}}
function frame(){
  if(W0){cx.drawImage(bgc,0,0,W0,H0);
    clouds.forEach(c=>{c.x+=c.v;if(c.x-c.s*2>W0)c.x=-c.s*2;cx.fillStyle=`rgba(255,255,255,${c.a})`;for(let i=0;i<4;i++){cx.beginPath();cx.ellipse(c.x+i*c.s*.45,c.y+(i%2?-c.s*.12:0),c.s*.55,c.s*.26,0,0,7);cx.fill()}});
    if(PT==="bird"&&Math.random()<.006&&birds.length<4)birds.push({x:-20,y:H0*(.12+Math.random()*.2),v:.6+Math.random()*.5,ph:0});
    birds=birds.filter(b=>b.x<W0+30);birds.forEach(b=>{b.x+=b.v;b.ph+=.15;const f=Math.sin(b.ph)*5;cx.strokeStyle="rgba(30,30,50,.55)";cx.lineWidth=1.6;cx.beginPath();cx.moveTo(b.x-8,b.y-f);cx.quadraticCurveTo(b.x-3,b.y-2,b.x,b.y);cx.quadraticCurveTo(b.x+3,b.y-2,b.x+8,b.y-f);cx.stroke()});
    parts.forEach((p,i)=>{p.ph+=.03;
      if(PT==="snow"){p.y+=p.vy;p.x+=Math.sin(p.ph)*.4;if(p.y>H0+10)parts[i]=newPart();cx.fillStyle="rgba(255,255,255,.8)";cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}
      else if(PT==="petal"||PT==="leaf"){p.y+=p.vy;p.x+=Math.sin(p.ph)*.8;if(p.y>H0+10)parts[i]=newPart();cx.save();cx.translate(p.x,p.y);cx.rotate(p.ph);cx.fillStyle=PT==="petal"?"rgba(255,205,225,.85)":SI==="c"?"rgba(255,165,50,.9)":"rgba(150,200,120,.75)";cx.beginPath();cx.ellipse(0,0,p.r,p.r*.55,0,0,7);cx.fill();cx.restore()}
      else if(PT==="ember"){p.y-=p.vy;p.x+=Math.sin(p.ph)*.5;if(p.y<H0*.25)parts[i]=newPart();const a=.4+Math.sin(p.ph*3)*.3;cx.fillStyle=`rgba(255,${150+Math.floor(a*80)},80,${a})`;cx.beginPath();cx.arc(p.x,p.y,p.r,0,7);cx.fill()}
      else if(PT==="mist"){p.x+=p.vx;if(p.x-p.r>W0)p.x=-p.r;const g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,"rgba(255,255,255,.07)");g.addColorStop(1,"rgba(255,255,255,0)");cx.fillStyle=g;cx.fillRect(p.x-p.r,p.y-p.r,p.r*2,p.r*2)}
      else{p.ph+=p.sp;const a=Math.max(0,Math.sin(p.ph));cx.fillStyle=PT==="dust"?`rgba(255,235,190,${a*.6})`:`rgba(255,250,220,${a*.9})`;cx.beginPath();cx.arc(p.x,p.y,p.r*(.5+a),0,7);cx.fill()}});
  }
  if(!RM)requestAnimationFrame(frame);
}
function miniScene(canvas,si){const d=Math.min(2,devicePixelRatio||1),w=canvas.clientWidth||300,h=canvas.clientHeight||225;canvas.width=w*d;canvas.height=h*d;const c=canvas.getContext("2d");c.scale(d,d);if(IMG[si]){cover(c,IMG[si],w,h,.62);return}
  const TH=Math.max(h/.36,w*1.5),tmp=document.createElement("canvas");tmp.width=w*d;tmp.height=TH*d;const t=tmp.getContext("2d");t.scale(d,d);SC.draw(t,w,TH,si);c.drawImage(tmp,0,TH*.3*d,w*d,h*d,0,0,w,h)}

// ================= screens =================
function show(id){["home","game","done"].forEach(s=>$("#"+s).classList.toggle("show",s===id))}
let shownCoins=S.coins;
function coins(anim){const to=S.coins,from=shownCoins;shownCoins=to;
  if(!anim||RM){$$(".cn").forEach(e=>e.textContent=to);return}
  const t0=performance.now();(function st(t){const k=Math.min(1,(t-t0)/700),v=Math.round(from+(to-from)*(1-(1-k)**3));$$(".cn").forEach(e=>e.textContent=v);if(k<1)requestAnimationFrame(st)})(t0);
  $$(".coins").forEach(c=>{c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump")});
}
function goHome(){
  const li=Math.min(S.lvl,N-1),t=L();setScene(sceneOf(li),true);show("home");coins();
  $("#logoTiles").innerHTML=[..."PEYVOK"].map((c,i)=>`<div class="lt" style="--i:${i}">${c}</div>`).join("");
  $("#hSub").textContent=t.sub;$("#hNum").textContent=Math.min(S.lvl,N);$("#hJ").textContent=t.j;$("#hPlace").textContent=IMGSRC.c?"Girê Miraza":SCENES[sceneOf(li)].n;
  $("#ringArc").style.strokeDashoffset=427*(1-Math.min(S.lvl,N)/N);$("#collN").textContent=S.cards.length;$("#collN").hidden=!S.cards.length;
  $("#playBtn").textContent=S.lvl>=N?t.reset.toUpperCase():`${t.lvl.toUpperCase()} ${S.lvl+1}`;
}
$("#playBtn").addEventListener("click",()=>{SFX.tap();if(S.lvl>=N){S.lvl=0;S.found={};S.hint={};S.bonus={};save()}startLevel(S.lvl)});
$("#homeBtn").addEventListener("click",()=>{SFX.tap();goHome()});
$("#collBtn").addEventListener("click",()=>{SFX.tap();openColl()});

// ================= game =================
let lv,X,letters,found,hinted,bonusSet,sel=[],drag=false,streak=0,pt=null;
const gridEl=$("#grid"),wheel=$("#wheel"),wpath=$("#wpath");
function startLevel(i){
  lv=LEVELS[i];setScene(sceneOf(i));show("game");coins();
  X={rows:lv.x.r,cols:lv.x.c,place:lv.x.p.map(p=>({r:p[0],c:p[1],d:p[2]}))};letters=[...lv.l];shuffleArr(letters);
  found=new Set(S.found[i]||[]);hinted=new Set(S.hint[i]||[]);bonusSet=new Set(S.bonus[i]||[]);streak=0;sel=[];
  $("#gLvl").textContent=`${L().lvl.toUpperCase()} ${i+1}`;$("#gPlace").textContent=SCENES[sceneOf(i)].n;
  requestAnimationFrame(()=>{renderGrid();renderWheel();updateBubble();updateCnt()});
}
const cellsOf=wi=>{const p=X.place[wi];return [...lv.w[wi][0]].map((ch,k)=>({r:p.r+(p.d?k:0),c:p.c+(p.d?0:k),ch,k:(p.r+(p.d?k:0))+","+(p.c+(p.d?0:k))}))};
const cellEl=k=>gridEl.querySelector(`[data-k="${k}"]`);
function onSet(){const s=new Set();found.forEach(wi=>cellsOf(wi).forEach(x=>s.add(x.k)));return s}
function renderGrid(){
  const area=$(".cross"),W=area.clientWidth,H=Math.min(area.clientHeight-12,$(".praise").getBoundingClientRect().top-area.getBoundingClientRect().top-12),gap=3;
  const cs=Math.floor(Math.min(46,(W-gap*(X.cols-1))/X.cols,(H-gap*(X.rows-1))/X.rows));
  gridEl.style.setProperty("--cs",cs+"px");gridEl.style.width=(X.cols*cs+(X.cols-1)*gap)+"px";gridEl.style.height=(X.rows*cs+(X.rows-1)*gap)+"px";
  const map=new Map();lv.w.forEach((w,wi)=>cellsOf(wi).forEach(x=>map.set(x.k,x.ch)));const on=onSet();
  gridEl.innerHTML=[...map].map(([k,ch])=>{const [r,c]=k.split(",");return `<div class="c${on.has(k)?" on":hinted.has(k)?" hinted":""}" data-k="${k}" style="left:${c*(cs+gap)}px;top:${r*(cs+gap)}px;animation:none">${ch}</div>`}).join("");
}
function shuffleArr(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
let WD=0,LS=0,order=[];
function renderWheel(){
  const vw=Math.min(innerWidth-32,480),vh=innerHeight;WD=Math.round(Math.min(vw*.6,vh*.29,260));
  const n=letters.length;LS=Math.round(Math.min(WD*.3,WD*1.9/n+8));
  wheel.style.setProperty("--wd",WD+"px");wheel.style.setProperty("--ls",LS+"px");
  $$(".L").forEach(e=>e.remove());letters.forEach((ch,i)=>{const el=document.createElement("div");el.className="L";el.dataset.i=i;el.textContent=ch;wheel.appendChild(el)});
  order=letters.map((_,i)=>i);placeLetters();drawLine();
}
function placeLetters(){const n=letters.length,rad=WD/2-LS*.64;order.forEach((li,slot)=>{const a=-Math.PI/2+slot/n*Math.PI*2,el=wheel.querySelector(`.L[data-i="${li}"]`);el.style.left=(WD/2+Math.cos(a)*rad)+"px";el.style.top=(WD/2+Math.sin(a)*rad)+"px"})}
const lpos=i=>{const el=wheel.querySelector(`.L[data-i="${i}"]`);return[parseFloat(el.style.left),parseFloat(el.style.top)]};
function drawLine(){
  if(!sel.length){wpath.innerHTML="";return}
  const pts=sel.map(lpos);if(pt)pts.push(pt);const col=getComputedStyle(document.documentElement).getPropertyValue("--tile-deep").trim(),sw=Math.max(9,LS*.18);
  wpath.innerHTML=`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" opacity=".95" filter="url(#glow)"/>`;
}
function hit(x,y){let best=-1,bd=1e9;$$(".L").forEach(el=>{const r=el.getBoundingClientRect(),d=Math.hypot(x-(r.left+r.width/2),y-(r.top+r.height/2));if(d<r.width*.62&&d<bd){bd=d;best=+el.dataset.i}});return best}
function updateBubble(cls){const b=$("#bubble");b.className="w"+(cls?" "+cls:"");b.innerHTML=sel.map(i=>`<span>${letters[i]}</span>`).join("");$$(".L").forEach(el=>el.classList.toggle("sel",sel.includes(+el.dataset.i)))}
function updateCnt(){$("#cnt").innerHTML=`${found.size}/${lv.w.length}<small>${L().cnt}</small>`}
wheel.addEventListener("pointerdown",e=>{if(e.target.closest(".shuffle"))return;const i=hit(e.clientX,e.clientY);if(i<0)return;initAudio();
  drag=true;sel=[i];wheel.setPointerCapture(e.pointerId);const b=wheel.getBoundingClientRect();pt=[e.clientX-b.left,e.clientY-b.top];updateBubble();drawLine();SFX.select(0);buzz(8)});
wheel.addEventListener("pointermove",e=>{if(!drag)return;const b=wheel.getBoundingClientRect();pt=[e.clientX-b.left,e.clientY-b.top];const i=hit(e.clientX,e.clientY);
  if(i>=0){if(sel.length>1&&i===sel[sel.length-2]){sel.pop();updateBubble();SFX.select(sel.length-1)}else if(!sel.includes(i)){sel.push(i);updateBubble();SFX.select(sel.length-1);buzz(6)}}drawLine()});
const release=()=>{if(!drag)return;drag=false;pt=null;submit()};
wheel.addEventListener("pointerup",release);wheel.addEventListener("pointercancel",release);
$("#shuffleBtn").addEventListener("click",()=>{SFX.whoosh();shuffleArr(order);placeLetters();const s=$("#shuffleBtn");s.classList.remove("spin");void s.offsetWidth;s.classList.add("spin")});

function submit(){
  const word=sel.map(i=>letters[i]).join("");const spans=[...$("#bubble").children];sel=[];drawLine();$$(".L").forEach(el=>el.classList.remove("sel"));
  if(word.length<2){updateBubble();return}
  const wi=lv.w.findIndex(w=>w[0]===word);
  if(wi>=0&&!found.has(wi)){
    const before=onSet();found.add(wi);persist();streak++;praise();SFX.found();buzz([12,40,12]);updateCnt();
    const rects=spans.map(s=>s.getBoundingClientRect());$("#bubble").classList.add("go");
    flyIn(wi,rects,before);setTimeout(()=>updateBubble(),cellsOf(wi).length*80+420);
    checkDone();return;
  }
  if(wi>=0){cellsOf(wi).forEach(x=>{const el=cellEl(x.k);el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake")});SFX.dup();toast(L().found);setTimeout(()=>updateBubble(),350);return}
  if(lv.b.includes(word)){
    if(bonusSet.has(word)){SFX.dup();toast(L().found)}
    else{bonusSet.add(word);S.coins+=2;persist();coins(true);SFX.coin();const el=document.createElement("div");el.className="bonus";el.textContent=`${L().bonus} +2`;document.body.appendChild(el);setTimeout(()=>el.remove(),1200)}
    setTimeout(()=>updateBubble(),350);return;
  }
  streak=0;const b=$("#bubble");b.classList.remove("bad");void b.offsetWidth;b.classList.add("bad");SFX.wrong();buzz(30);setTimeout(()=>updateBubble(),420);
}
function flyIn(wi,rects,before){
  cellsOf(wi).forEach((x,k)=>{const el=cellEl(x.k);if(before.has(x.k))return;
    const from=rects[k]||rects[rects.length-1],to=el.getBoundingClientRect();
    const f=document.createElement("div");f.className="fly";f.textContent=x.ch;
    Object.assign(f.style,{left:from.left+"px",top:from.top+"px",width:from.width+"px",height:from.height+"px",fontSize:(from.height*.7)+"px",opacity:0});document.body.appendChild(f);
    const anim=f.animate([{left:from.left+"px",top:from.top+"px",width:from.width+"px",height:from.height+"px",fontSize:(from.height*.7)+"px",opacity:1,transform:"scale(1)"},
      {offset:.6,transform:"scale(1.15)"},
      {left:to.left+"px",top:to.top+"px",width:to.width+"px",height:to.height+"px",fontSize:(to.height*.64)+"px",opacity:1,transform:"scale(1)"}],
      {duration:RM?1:420,delay:k*80,easing:"cubic-bezier(.45,0,.25,1)",fill:"forwards"});
    anim.onfinish=()=>{el.classList.remove("hinted");el.style.animation="";el.classList.add("on");f.remove();SFX.land(k)};
  });
}
function praise(){const r=$("#ribbon"),p=L().praise;r.textContent=p[Math.min(streak-1,p.length-1)];r.classList.remove("show");void r.offsetWidth;r.classList.add("show")}
function persist(){S.found[S.lvl]=[...found];S.hint[S.lvl]=[...hinted];S.bonus[S.lvl]=[...bonusSet];save()}
$("#hintBtn").addEventListener("click",()=>{
  if(S.coins<100){toast(L().coins);SFX.wrong();return}
  const on=onSet(),opts=[];lv.w.forEach((w,wi)=>{if(!found.has(wi))cellsOf(wi).forEach(x=>{if(!hinted.has(x.k)&&!on.has(x.k))opts.push(x.k)})});if(!opts.length)return;
  const k=opts[Math.floor(Math.random()*opts.length)];hinted.add(k);S.coins-=100;coins(true);SFX.hint();
  const el=cellEl(k);el.style.animation="";el.classList.add("hinted");el.animate([{transform:"scale(.6) rotate(-10deg)"},{transform:"scale(1.15)"},{transform:"none"}],{duration:450,easing:"cubic-bezier(.3,1.6,.5,1)"});
  lv.w.forEach((w,wi)=>{if(!found.has(wi)&&cellsOf(wi).every(x=>hinted.has(x.k)||onSet().has(x.k))){found.add(wi);cellsOf(wi).forEach(x=>{const c=cellEl(x.k);c.classList.remove("hinted");c.classList.add("on")})}});
  persist();updateCnt();checkDone();
});
function checkDone(){
  if(found.size<lv.w.length)return;
  const li=S.lvl,reward=10+lv.w.length*5,used=(S.hint[li]||[]).length,stars=used===0?3:used<3?2:1;S.coins+=reward;
  let card=-1;if((li+1)%10===0||li===N-1){card=sceneOf(li);if(!S.cards.includes(card))S.cards.push(card)}
  S.lvl++;save();
  setTimeout(()=>{if(!RM)$$(".c.on").forEach((el,i)=>el.animate([{transform:"none"},{transform:"translateY(-12px) scale(1.08)"},{transform:"none"}],{duration:500,delay:i*40,easing:"ease-in-out"}))},cellsOf(0).length*80+500);
  setTimeout(()=>{confetti();SFX.fanfare()},1300);
  setTimeout(()=>openDone(reward,stars,card),2300);
}
function postHTML(si,isNew){const t=L(),f=SCENES[si].f[S.lang==="en"?1:S.lang==="tr"?0:2];
  return `<div class="post"><canvas data-si="${si}"></canvas><div class="pt"><b>${SCENES[si].n}</b>${isNew?`<span class="new">${t.post}</span>`:""}</div><p>${f}</p></div>`}
function openDone(reward,stars,card){
  const t=L(),last=S.lvl>=N;show("done");shownCoins=S.coins-reward;coins();
  const star=(on,k)=>`<svg viewBox="0 0 24 24" style="animation-delay:${.3+k*.18}s"><path d="M12 2.6l2.9 5.9 6.4.9-4.7 4.5 1.1 6.4L12 17.3l-5.7 3 1.1-6.4-4.7-4.5 6.4-.9z" fill="${on?"#ffd23f":"rgba(255,255,255,.35)"}" stroke="${on?"#d98a00":"rgba(255,255,255,.5)"}" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  $("#stars").innerHTML=[0,1,2].map(k=>star(k<stars,k)).join("");
  $("#dT").textContent=last?t.fin:t.done;$("#dR").textContent=reward;
  if(card>=0){$("#doneBody").innerHTML=postHTML(card,true);const c=$("#doneBody canvas");requestAnimationFrame(()=>miniScene(c,card));setTimeout(()=>SFX.card(),700)}
  else $("#doneBody").innerHTML=`<div class="card">`+`<div class="t">${t.gl}</div>`+lv.w.map(w=>`<div class="r"><b>${w[0]}</b><span>${w[1]}</span></div>`).join("")+`</div>`;
  $("#nextBtn").textContent=last?t.reset.toUpperCase():t.next.toUpperCase();
  setTimeout(()=>flyCoins(reward),900);
}
function flyCoins(reward){
  const from=$("#reward").getBoundingClientRect(),to=$("#doneCoins .coin").getBoundingClientRect();
  for(let i=0;i<8;i++){const c=document.createElement("div");c.className="coin";Object.assign(c.style,{position:"fixed",left:from.left+10+"px",top:from.top+6+"px",zIndex:8});document.body.appendChild(c);
    const mx=(from.left+to.left)/2+(Math.random()-.5)*140,my=Math.min(from.top,to.top)-40-Math.random()*60;
    c.animate([{left:from.left+10+"px",top:from.top+6+"px"},{left:mx+"px",top:my+"px",offset:.5},{left:to.left+"px",top:to.top+"px"}],{duration:RM?1:700,delay:i*70,easing:"ease-in",fill:"forwards"}).onfinish=()=>{c.remove();SFX.coin();if(i===7)coins(true)}}
}
$("#nextBtn").addEventListener("click",()=>{SFX.tap();if(S.lvl>=N){S.lvl=0;S.found={};S.hint={};S.bonus={};save();goHome()}else startLevel(S.lvl)});

// collection
function openColl(){const t=L();
  $("#layer").innerHTML=`<div class="scrim" id="scrim"><div class="sheet big"><h3>${t.coll}</h3><div class="sub">${S.cards.length} ${t.collSub}</div><div class="coll">${SCENES.map((s,i)=>true?`<button class="cc" data-c="${i}"><canvas data-si="${i}"></canvas><span>${s.n}</span></button>`:`<div class="cc lock">?<span>${t.lvl} ${i*10+1}–${i*10+10}</span></div>`).join("")}</div></div></div>`;
  $("#scrim").addEventListener("click",e=>{if(e.target.id==="scrim")$("#layer").innerHTML=""});
  requestAnimationFrame(()=>$$(".coll canvas").forEach(c=>miniScene(c,+c.dataset.si)));
  $$(".cc[data-c]").forEach(b=>b.addEventListener("click",()=>{SFX.tap();const i=+b.dataset.c;$("#layer").innerHTML=`<div class="scrim" id="scrim"><div style="display:grid;gap:16px;justify-items:center">${postHTML(i,false)}<button class="btn3d" id="goLv" style="min-width:210px;height:54px">${L().lvl.toUpperCase()} ${i*10+1}</button></div></div>`;$("#scrim").addEventListener("click",e=>{if(e.target.id==="goLv"){$("#layer").innerHTML="";S.lvl=i*10;save();startLevel(i*10)}else openColl()});requestAnimationFrame(()=>miniScene($("#scrim canvas"),i))}));
}
// settings
$$("[data-set]").forEach(b=>b.addEventListener("click",()=>{SFX.tap();openSet()}));
function openSet(){const t=L();
  $("#layer").innerHTML=`<div class="scrim" id="scrim"><div class="sheet"><h3>${t.set}</h3>
  <div class="row">${t.music}<button class="sw" id="swM" role="switch" aria-checked="${S.music}" aria-label="${t.music}"></button></div>
  <div class="row">${t.sound}<button class="sw" id="swS" role="switch" aria-checked="${S.sound}" aria-label="${t.sound}"></button></div>
  <div class="langs">${["ku","tr","en"].map(c=>`<button data-l="${c}" class="${S.lang===c?"on":""}">${{ku:"Kurmancî",tr:"Türkçe",en:"English"}[c]}</button>`).join("")}</div>
  <button class="reset" id="resetBtn">${t.reset}</button></div></div>`;
  $("#scrim").addEventListener("click",e=>{if(e.target.id==="scrim")$("#layer").innerHTML=""});
  $("#swM").addEventListener("click",e=>{setMusic(!S.music);e.currentTarget.setAttribute("aria-checked",S.music)});
  $("#swS").addEventListener("click",e=>{S.sound=!S.sound;save();e.currentTarget.setAttribute("aria-checked",S.sound);SFX.tap()});
  $$("[data-l]").forEach(b=>b.addEventListener("click",()=>{S.lang=b.dataset.l;save();SFX.tap();$("#layer").innerHTML="";goHome()}));
  $("#resetBtn").addEventListener("click",()=>{S.lvl=0;S.found={};S.hint={};S.bonus={};S.cards=[];S.coins=200;save();$("#layer").innerHTML="";goHome()});
}
let tt;function toast(m){const el=$("#toast");el.textContent=m;el.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("show"),1200)}
function confetti(){
  if(RM)return;const c=document.createElement("canvas");c.className="fx";document.body.appendChild(c);const x=c.getContext("2d"),d=devicePixelRatio||1;c.width=innerWidth*d;c.height=innerHeight*d;x.scale(d,d);
  const cols=["#ffd23f","#ffffff","#ff7aa8","#7ee0b5","#8fb8ff",REG[SCENES[sceneOf(Math.max(0,S.lvl-1))].r].hi],ps=[];
  for(const side of [-1,1])for(let i=0;i<90;i++)ps.push({x:side<0?-10:innerWidth+10,y:innerHeight*.7,vx:-side*(4+Math.random()*9),vy:-(8+Math.random()*12),r:Math.random()*7+4,c:cols[Math.floor(Math.random()*cols.length)],a:Math.random()*6,va:(Math.random()-.5)*.35,w:Math.random()*Math.PI});
  let f=0;(function tick(){x.clearRect(0,0,innerWidth,innerHeight);ps.forEach(p=>{p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;p.w+=.15;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.scale(1,Math.cos(p.w));x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/3,p.r,p.r*.66);x.restore()});if(++f<190)requestAnimationFrame(tick);else c.remove()})();
}
addEventListener("resize",()=>{SI=-1;if($("#game").classList.contains("show")){setScene(sceneOf(S.lvl));renderGrid();renderWheel()}else setScene(sceneOf(Math.min(S.lvl,N-1)),$("#home").classList.contains("show"))});
try{new ResizeObserver(()=>{if(lv&&$("#game").classList.contains("show"))renderGrid()}).observe($(".cross"))}catch(e){}
goHome();frame();
