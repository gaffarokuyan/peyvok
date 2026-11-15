// usage: node snap.mjs out.jpg "<js expression drawing a frame>"
import { createRequire } from 'module'; const { chromium } = createRequire('/home/user/peyvok/video/gutiler/render/x.js')('playwright'); import path from 'path'; import fs from 'fs';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } }); p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('PAGE', m.text()));
await p.goto('file://' + path.resolve('xxx.html')); await p.evaluate(() => window.ready);
const outs = process.argv.slice(2); for (let i = 0; i < outs.length; i += 2) {
  const t0 = Date.now(); const d = await p.evaluate(code => { eval(code); return cv.toDataURL('image/jpeg', .9) }, outs[i + 1]);
  fs.writeFileSync(outs[i], Buffer.from(d.split(',')[1], 'base64')); console.log(outs[i], Date.now() - t0, 'ms') }
await b.close();
