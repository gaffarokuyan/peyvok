import { createRequire } from 'module'; const { chromium } = createRequire('/home/user/peyvok/video/gutiler/render/x.js')('playwright'); import path from 'path'; import fs from 'fs';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('short.html')); await p.evaluate(() => window.ready);
const info = await p.evaluate(() => ({ miss: MISS, total: TOTAL, sfx: SFX })); console.log(JSON.stringify(info.miss), info.total); fs.writeFileSync('sfx.json', JSON.stringify({ total: +info.total.toFixed(2), sfx: info.sfx }));
for (const t of process.argv.slice(3)) { const d = await p.evaluate(t => { renderFrame(t); return cv.toDataURL('image/jpeg', .85) }, +t); fs.writeFileSync(`${process.argv[2]}/f${t}.jpg`, Buffer.from(d.split(',')[1], 'base64')) } await b.close();
