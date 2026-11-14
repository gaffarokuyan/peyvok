import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('pageerror',e=>console.log('ERR',e.message));p.on('console',m=>{const t=m.text();if(/ERR|MISS/.test(t))console.log('PAGE',t)});
await p.goto('file://'+path.resolve(process.env.PAGE||'film.html'));await p.evaluate(()=>window.ready);
const info=await p.evaluate(()=>({missing:window.MISSING,shots:window.SHOTLIST,sfx:window.SFX}));
console.log('MISSING',JSON.stringify(info.missing));fs.writeFileSync((process.env.SHOTSJSON||'../film/shots.json'),JSON.stringify(info,null,0));console.log('shots',info.shots.length);
await b.close();
