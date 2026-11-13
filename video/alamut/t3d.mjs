import { createRequire } from 'module'; const { chromium } = createRequire('/home/user/peyvok/video/gutiler/render/x.js')('playwright'); import path from 'path'; import fs from 'fs';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('file://' + path.resolve('t3d.html')); await p.evaluate(() => window.ready);
const shots = eval(process.argv[3]); let i = 0;
for (const [t, keys, o] of shots) { const t0 = Date.now(); const d = await p.evaluate(([t, k, o]) => snap(t, k, o), [t, keys, o || {}]); fs.writeFileSync(`${process.argv[2]}/g${i++}.jpg`, Buffer.from(d.split(',')[1], 'base64')); console.log(i, Date.now() - t0, 'ms') } await b.close();
