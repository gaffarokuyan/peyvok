// games/agire-kawa/index.html -> kawa/assets/web/game.html
// Fully offline: three.js bundled into one classic script, fonts inlined as base64 woff2.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const APP=join(dirname(fileURLToPath(import.meta.url)),'..');
const SRC=join(APP,'../games/agire-kawa/index.html');
let html=readFileSync(SRC,'utf8');

// 1) JS: bundle the module script with three
const m=html.match(/<script type="module">([\s\S]*?)<\/script>/);
if(!m)throw new Error('module script not found');
const res=await build({stdin:{contents:m[1],resolveDir:APP,loader:'js',sourcefile:'game.js'},bundle:true,format:'iife',
  minify:true,target:'es2020',write:false,legalComments:'none',logLevel:'warning',tsconfigRaw:'{}'});
const js=res.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
html=html.replace(/<script type="importmap">[\s\S]*?<\/script>\s*/,'');
html=html.replace(m[0],()=>'<script>'+js+'</script>');

// 2) Fonts: replace Google Fonts with inlined latin + latin-ext woff2
const faces=[];
const addCss=(pkg,file)=>{const dir=join(APP,'node_modules/@fontsource',pkg);const css=readFileSync(join(dir,file),'utf8');
  for(const block of css.match(/@font-face\s*{[^}]*}/g)){
    const u=block.match(/url\(\.\/files\/([^)]+?-(latin|latin-ext)-\d+-normal\.woff2)\)/);if(!u)continue;
    const b64=readFileSync(join(dir,'files',u[1])).toString('base64');
    faces.push(block.replace(/src:[^;]+;/,`src:url(data:font/woff2;base64,${b64}) format("woff2");`).replace(/font-display:[^;]+;/,'font-display:block;'))}};
addCss('marcellus-sc','400.css');
for(const w of[500,600,700,800,900])addCss('rubik',`${w}.css`);
html=html.replace(/<link rel="preconnect"[^>]*>\s*/g,'');
let n=0;html=html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>/,()=>{n++;return '<style>'+faces.join('\n')+'</style>'});
if(n!==1)throw new Error('Google Fonts link not found');
if(/https?:\/\/(cdn|fonts)\./.test(html.replace(/<script>[\s\S]*<\/script>/,'')))throw new Error('external reference left');

// 3) Document shell (the source is an artifact fragment without <html>/<head>)
const out='<!doctype html><html><head><meta charset="utf-8">\n'+html.replace(/(<\/style>\s*\n)(?=\s*<div id="stage">)/,'$1</head><body>\n')+'\n</body></html>';
mkdirSync(join(APP,'assets/web'),{recursive:true});
writeFileSync(join(APP,'assets/web/game.html'),out);
console.log('assets/web/game.html',(out.length/1024).toFixed(0)+' KB, fonts:',faces.length);
