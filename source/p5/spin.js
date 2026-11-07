// ================= daily wheel (Çerxa Bextê) =================
const SPIN_SEG=[{t:"c",v:20},{t:"c",v:50},{t:"h",v:1},{t:"c",v:25},{t:"c",v:100},{t:"c",v:10},{t:"h",v:2},{t:"c",v:40}];
const SPIN_W=[22,10,10,16,4,22,4,12];
const SPIN_COL=[["#7a2d9c","#4a1468"],["#1c8a66","#0c5a40"],["#c98a2e","#8a5410"],["#2d5fa8","#163a70"],["#b3263c","#6e1022"],["#2a8fa0","#145a66"],["#d06a1c","#8a3e08"],["#5a3fb0","#33207a"]];
const SPIN_MAX=5;
const ST={ku:{t:"Çerxa Bextê",go:"BIZIVIRÎNE",ad:"Reklam bibîne",left:"Zivirîn",won:"Te qezenc kir!",hint:"Alîkarî",close:"Baş e",soon:"Sibê dîsa were!"},
  tr:{t:"Şans Çarkı",go:"ÇEVİR",ad:"Reklam izle",left:"Çevirme",won:"Kazandın!",hint:"İpucu",close:"Tamam",soon:"Yarın tekrar gel!"},
  en:{t:"Lucky Wheel",go:"SPIN",ad:"Watch ad",left:"Spins",won:"You won!",hint:"Hint",close:"OK",soon:"Come back tomorrow!"}};
const SL=()=>ST[S.lang]||ST.ku;
const today=()=>{const d=new Date();return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()};
function spinState(){if(!S.spin||S.spin.day!==today())S.spin={day:today(),used:0};return S.spin}
const spinFree=()=>spinState().used===0;
const spinLeft=()=>SPIN_MAX-spinState().used;
// rewarded-ad hook: replaced by AdMob in the app build; web demo resolves after a short pause
window.showRewardedAd=window.showRewardedAd||(()=>new Promise(r=>setTimeout(()=>r(true),1200)));
function wheelSVG(){const n=SPIN_SEG.length,R=150,a=2*Math.PI/n;let s=`<defs>${SPIN_COL.map((c,i)=>`<radialGradient id="sg${i}" cx="50%" cy="50%" r="60%"><stop offset="35%" stop-color="${c[0]}"/><stop offset="100%" stop-color="${c[1]}"/></radialGradient>`).join("")}
  <radialGradient id="hub" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff6d0"/><stop offset=".5" stop-color="#f2c45a"/><stop offset="1" stop-color="#a86a12"/></radialGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset=".5" stop-color="#e2a640"/><stop offset="1" stop-color="#8a5410"/></linearGradient></defs>
  <circle r="${R+14}" fill="url(#rim)"/><circle r="${R+4}" fill="#2a1a10"/>`;
  SPIN_SEG.forEach((g,i)=>{const a0=i*a-Math.PI/2-a/2,a1=a0+a,x0=R*Math.cos(a0),y0=R*Math.sin(a0),x1=R*Math.cos(a1),y1=R*Math.sin(a1),mid=(a0+a1)/2,deg=mid*180/Math.PI+90;
    s+=`<path d="M0 0L${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}Z" fill="url(#sg${i})" stroke="rgba(255,230,170,.55)" stroke-width="2"/>`;
    const lx=Math.cos(mid),ly=Math.sin(mid);
    s+=`<g transform="translate(${lx*R*.66} ${ly*R*.66}) rotate(${deg})">`+(g.t==="c"
      ?`<circle cy="-14" r="11" fill="url(#hub)" stroke="#8a5410" stroke-width="1.5"/><text y="16" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="900" font-size="22" fill="#fff4d6" stroke="rgba(0,0,0,.35)" stroke-width="1" paint-order="stroke">${g.v}</text>`
      :`<path d="M-7 -24a10 10 0 1 1 14 0c-2 2-3 4-3 6h-8c0-2-1-4-3-6z" fill="#fff6d0" stroke="#8a5410" stroke-width="1.5"/><rect x="-4" y="-16" width="8" height="4" rx="1" fill="#e2a640"/><text y="16" text-anchor="middle" font-family="Cinzel,Georgia,serif" font-weight="900" font-size="20" fill="#fff4d6" stroke="rgba(0,0,0,.35)" stroke-width="1" paint-order="stroke">×${g.v}</text>`)+`</g>`});
  for(let i=0;i<n;i++){const t=i*a-Math.PI/2-a/2;s+=`<circle cx="${(R+9)*Math.cos(t)}" cy="${(R+9)*Math.sin(t)}" r="3.6" fill="#fff8e0"/>`}
  return s}
function openSpin(auto){const t=SL();spinState();
  $("#layer").innerHTML=`<div class="scrim spinScrim" id="scrim"><div class="spinBox">
    <button class="spinX" id="spinX" aria-label="Close">✕</button>
    <h3 class="spinT">${t.t}</h3>
    <div class="spinWrap"><svg class="spinPtr" viewBox="0 0 40 52"><path d="M20 50L4 14A16 16 0 1 1 36 14Z" fill="url(#pg)" stroke="#6e3e08" stroke-width="2"/><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset="1" stop-color="#c98a2e"/></linearGradient></defs><circle cx="20" cy="16" r="6" fill="#fff6d0"/></svg>
      <svg class="spinWheel" id="spinWheel" viewBox="-166 -166 332 332">${wheelSVG()}</svg>
      <div class="spinHub"></div></div>
    <div class="spinDots" id="spinDots"></div>
    <button class="btn3d spinGo" id="spinGo"></button></div></div>`;
  updSpinUI();
  $("#spinX").addEventListener("click",()=>{SFX.tap();$("#layer").innerHTML=""});
  $("#spinGo").addEventListener("click",doSpin);
}
let spinning=false,spinAngle=0;
function updSpinUI(){const t=SL(),b=$("#spinGo");if(!b)return;const left=spinLeft();
  $("#spinDots").innerHTML=Array.from({length:SPIN_MAX},(_,i)=>`<i class="${i<left?"on":""}"></i>`).join("");
  if(left<=0){b.textContent=t.soon;b.disabled=true;return}
  b.disabled=false;b.innerHTML=spinFree()?t.go:`<svg viewBox="0 0 24 24" width="20" height="20" style="vertical-align:-3px;margin-right:6px"><rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor"/><path d="M10 9v6l5-3z" fill="#f7d27a"/></svg>${t.go}`}
async function doSpin(){if(spinning||spinLeft()<=0)return;initAudio();
  if(!spinFree()){const b=$("#spinGo");b.disabled=true;b.textContent="…";const ok=await window.showRewardedAd();if(!ok){updSpinUI();return}}
  spinning=true;S.spin.used++;save();updSpinUI();$("#spinGo").disabled=true;
  let r=Math.random()*SPIN_W.reduce((a,b)=>a+b),k=0;while(r>=SPIN_W[k]){r-=SPIN_W[k];k++}
  const n=SPIN_SEG.length,seg=360/n,target=-(k*seg)+(Math.random()-.5)*seg*.6;
  spinAngle=spinAngle-(spinAngle%360)+360*6+target;const w=$("#spinWheel");
  w.style.transition="transform 4.6s cubic-bezier(.12,.75,.12,1)";w.style.transform=`rotate(${spinAngle}deg)`;
  let last=0;const t0=performance.now();(function tick(){if(!spinning)return;const m=new DOMMatrix(getComputedStyle(w).transform),ang=Math.atan2(m.b,m.a)*180/Math.PI,s=Math.floor((ang+360+seg/2)/seg);if(s!==last){last=s;if(ok())tone(1400,now(),.03,{vol:.06,rev:0});$(".spinPtr").animate([{transform:"rotate(-14deg)"},{transform:"none"}],{duration:120})}if(performance.now()-t0<4700)requestAnimationFrame(tick)})();
  setTimeout(()=>{spinning=false;const g=SPIN_SEG[k],t=SL();
    if(g.t==="c"){S.coins+=g.v}else{S.freeHints=(S.freeHints||0)+g.v}save();coins(true);updFH();SFX.fanfare();confetti();
    const pop=document.createElement("div");pop.className="spinWon";pop.innerHTML=`<b>${t.won}</b><span>${g.t==="c"?`<i class="coin"></i> +${g.v}`:`💡 ${t.hint} ×${g.v}`}</span>`;
    $(".spinBox").appendChild(pop);setTimeout(()=>{pop.remove();updSpinUI()},2200);updSpinBadge()},4700);
}
function updFH(){const p=$(".price");if(!p)return;const f=S.freeHints||0;p.innerHTML=f>0?`💡 ${f}`:`<i></i>100`;p.classList.toggle("free",f>0)}
function updSpinBadge(){const b=$("#spinBtn");if(b)b.classList.toggle("ready",spinLeft()>0&&spinFree())}
(function(){const row=$(".homeRow");if(!row)return;const b=document.createElement("button");b.className="cardBtn glass spinBtn";b.id="spinBtn";b.setAttribute("aria-label","Wheel");
  b.innerHTML=`<svg viewBox="-20 -20 40 40" width="34" height="34">${[0,1,2,3,4,5,6,7].map(i=>{const a0=(i*45-112.5)*Math.PI/180,a1=a0+Math.PI/4;return `<path d="M0 0L${16*Math.cos(a0)} ${16*Math.sin(a0)}A16 16 0 0 1 ${16*Math.cos(a1)} ${16*Math.sin(a1)}Z" fill="${SPIN_COL[i][0]}"/>`}).join("")}<circle r="16" fill="none" stroke="#f2c45a" stroke-width="2.5"/><circle r="4" fill="#f2c45a"/></svg><span class="badge">!</span>`;
  row.appendChild(b);b.addEventListener("click",()=>{SFX.tap();openSpin()});updSpinBadge();updFH()})();
