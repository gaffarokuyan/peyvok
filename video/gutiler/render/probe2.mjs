import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('playwright'); import path from 'path'; import fs from 'fs';
const b=await chromium.launch({args:['--allow-file-access-from-files']});const p=await b.newPage({viewport:{width:1920,height:1080}});p.on('console',m=>{if(/ERR/.test(m.text()))console.log(m.text())});
await p.goto('file://'+path.resolve('film.html'));await p.evaluate(()=>window.ready);
const m=await p.evaluate(()=>{for(let t=0;t<window.TL.total;t+=0.5)renderFrame(t);return [...new Set(window.MISSING)]});console.log('MISSING',JSON.stringify(m));await b.close();
