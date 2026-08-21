// M1 EXTRACTION — build A-ORG-2's sites.json from A-ORG-1's literals, using A-ORG-1's
// own resolution code (same eval-extraction pattern as its data-lint). One row per
// installation: { id, base, unit, lat, lon, grp, parent } — parent is the site id of the
// owning unit's nearest ancestor stationed on a DIFFERENT installation. That pointer is
// A-ORG-2's entire link model.
const fs=require('fs');
const html=fs.readFileSync(process.argv[2]||'/home/user/A-ORG/index.html','utf8');
const src=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(t=>t.includes('function drawGlobeMarkers'));
function grabFn(n){ const i=src.indexOf('function '+n+'('); if(i<0) return null; let d=0,st=false; for(let k=i;k<src.length;k++){const c=src[k]; if(c==='{'){d++;st=true;} else if(c==='}'){d--; if(st&&d===0) return src.slice(i,k+1);} } return null; }
function grabConst(n, close){ const i=src.indexOf('const '+n+' ='); if(i<0) return null; const j=src.indexOf(close, i); return src.slice(i, j+close.length); }
const AD=grabConst('ARMY_DATA','\n};'), INST=grabConst('INSTALLATIONS','\n];');
const FNS=['_directInstallation','installationForNode','tenantsForInstallation'].map(grabFn);
if(!AD||!INST||FNS.some(f=>!f)) { console.error('extraction failed'); process.exit(1); }
// _buildParentMap may reference more; provide a minimal one instead.
globalThis._parentMap=null;
globalThis._buildParentMap=function(){ _parentMap=new Map(); (function w(n){ (n.children||[]).forEach(c=>{ _parentMap.set(c,n); w(c); }); })(ARMY_DATA); };
eval([AD,INST].map(t=>t.replace(/^const /,'globalThis.')).join('\n')+'\n'+FNS.join('\n'));

const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');   // NFD fold — MUST match data-lint.js (the derivation is the contract)
_buildParentMap();
const sites=[];
const byInst=new Map();
for(const inst of INSTALLATIONS){
  if(inst.lat==null) continue;                       // ext anchors: not bases
  const tenants=tenantsForInstallation(inst);
  // owner seed = senior DIRECT tenant: stars first, then shallower echelon. The M1
  // regional SMEs adjudicate every pick; `tenants` ships with the row for that review.
  const directs=tenants.filter(t=>t.direct);
  const pool=(directs.length?directs:tenants).slice()
    .sort((a,b)=>((b.node.star||0)-(a.node.star||0)) || (a.depth-b.depth) || a.node.name.localeCompare(b.node.name));
  const owner=pool[0]||null;
  const row={ id:slug(inst.n), base:inst.n, st:inst.st||null,
    unit: owner?owner.node.name:null, unitFull: owner?(owner.node.full||null):null,
    lat:inst.lat, lon:inst.lon, grp:inst.grp||null, parent:null, _ownerNode: owner?owner.node:null,
    tenants: tenants.slice(0,8).map(t=>t.node.name) };
  sites.push(row); byInst.set(inst, row);
}
// parent pointers: owning unit -> nearest ancestor on a different installation
for(const row of sites){
  const node=row._ownerNode; if(!node) continue;
  let cur=_parentMap.get(node), hops=0;
  while(cur&&hops<10){
    if(cur.kind!=='category'&&cur.kind!=='hqda'){
      const pi=installationForNode(cur);
      if(pi && byInst.get(pi) && byInst.get(pi)!==row){ row.parent=byInst.get(pi).id; row.parentUnit=cur.name; break; }
    }
    cur=_parentMap.get(cur); hops++;
  }
}
sites.forEach(r=>delete r._ownerNode);
const dup=new Set(), dups=[];
sites.forEach(r=>{ if(dup.has(r.id)) dups.push(r.id); dup.add(r.id); });
const stats={ total:sites.length, withUnit:sites.filter(r=>r.unit).length,
  withParent:sites.filter(r=>r.parent).length, noUnit:sites.filter(r=>!r.unit).length, dupIds:dups };
fs.writeFileSync(__dirname+'/../data/sites.json', JSON.stringify({v:1, updated:'2026-08-19', src:'A-ORG-1 v22.27.1', sites:sites.map(({id,base,st,unit,unitFull,lat,lon,grp,parent,parentUnit,tenants})=>({id,base,st,unit,unitFull,lat,lon,grp,parent,parentUnit:parentUnit||null,tenants}))},null,1));
console.log(JSON.stringify(stats,null,2));
console.log('sample:', JSON.stringify(sites.find(s=>s.id==='fort-bragg'),null,1));
