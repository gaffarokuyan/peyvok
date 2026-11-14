import fs from 'fs';
import { feature } from 'topojson-client';
const topo = JSON.parse(fs.readFileSync('node_modules/world-atlas/countries-50m.json'));
const fc = feature(topo, topo.objects.countries);
const out = [];
const r = v => Math.round(v*100)/100;
for (const f of fc.features) {
  const g = f.geometry; if (!g) continue;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  const keep = [];
  for (const p of polys) {
    const ring = p[0];
    let minx=1e9,maxx=-1e9,miny=1e9,maxy=-1e9;
    for (const [x,y] of ring){minx=Math.min(minx,x);maxx=Math.max(maxx,x);miny=Math.min(miny,y);maxy=Math.max(maxy,y);}
    if (maxx<-15||minx>100||maxy<0||miny>65) continue;
    keep.push(ring.map(([x,y])=>[r(x),r(y)]));
  }
  if (keep.length) out.push({id:f.id, name:f.properties.name, rings:keep});
}


const lt = JSON.parse(fs.readFileSync('node_modules/world-atlas/land-50m.json'));
const lf = feature(lt, lt.objects.land);
const land=[];
for (const f of (lf.type==='FeatureCollection'?lf.features:[lf])) { const g=f.geometry; const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;
  for (const p of polys) for (const ring of p) { let ok=false; for (const [x,y] of ring) if (x>10&&x<75&&y>15&&y<55){ok=true;break} if(ok) land.push(ring.map(([x,y])=>[r(x),r(y)])); } }
fs.writeFileSync('land.js','window.LAND='+JSON.stringify(land)+';'); console.log('land rings',land.length, fs.statSync('land.js').size);
