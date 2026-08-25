// Research merge — additions from research packets into orgs.json/sites.json.
// Policy: high-confidence rows only; parent resolved by name (exact-normalized, then
// unique-substring); site resolved by alias-normalized base match; new sites only when
// coords supplied; every skip is reported. Never invents anything.
//
// v1.0.1 hardening (the knowledge check): the v1.0.0 run deduped on exact
// normalized names only, so paren/punctuation variants and same-parent
// short/long names slipped through as 43 twin nodes, and rows skipped as
// dupes never had their researched parent compared to the tree's. Now:
//  - dupes are detected by AGGRESSIVE key too (parens stripped, alnum only);
//  - a skipped dupe whose researched parent differs from the tree's is
//    reported under parentConflicts — reconcile every one before shipping;
//  - a row whose aggressive key prefix-matches an existing SIBLING (data-lint
//    §7 twin rule: stem ≥10, remainder ≥4) is skipped as that sibling;
//  - after the merge, any twin group touching a newly added org trips
//    TWIN ALARM and a non-zero exit. data-lint §7 is the standing backstop.
const fs=require('fs'), path=require('path');
const ROOT='/home/user/a-org-2';
const RES=process.env.RESEARCH_DIR||'/tmp/claude-0/-home-user-A-ORG/bcfb2bfb-349d-5555-87ec-f131b6c83651/scratchpad/research';
const slug=t=>String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const norm=t=>String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/&amp;/g,'&').replace(/[^a-z0-9]+/g,' ').trim();
const akey=t=>String(t).toLowerCase().replace(/\([^)]*\)/g,'').replace(/[^a-z0-9]+/g,'');
// data-lint §7 twin rule: shorter key is a real stem of the longer one
const twinPre=(a,b)=>{ const s=a.length<=b.length?a:b, t=a.length<=b.length?b:a;
  return s.length>=10 && t.startsWith(s) && (t.length-s.length)>=4; };

const OJ=JSON.parse(fs.readFileSync(path.join(ROOT,'data/orgs.json'),'utf8'));
const SJ=JSON.parse(fs.readFileSync(path.join(ROOT,'data/sites.json'),'utf8'));
const orgs=OJ.orgs, sites=SJ.sites;
const orgById=new Map(orgs.map(o=>[o.id,o]));
const orgByNorm=new Map(); orgs.forEach(o=>{ const k=norm(o.name); if(!orgByNorm.has(k)) orgByNorm.set(k,o); });
const orgByAkey=new Map(); orgs.forEach(o=>{ const k=akey(o.name); if(!orgByAkey.has(k)) orgByAkey.set(k,o); });
const siteById=new Map(sites.map(s=>[s.id,s]));
const siteByNorm=new Map(); sites.forEach(s=>{ const k=norm(s.base); if(!siteByNorm.has(k)) siteByNorm.set(k,s); });

const ALIAS={ 'joint base lewis mcchord':'jblm','jblm':'jblm',
 'fort shafter':'fort-shafter-schofield-hawaii','schofield barracks':'fort-shafter-schofield-hawaii',
 'fort shafter schofield hawaii':'fort-shafter-schofield-hawaii',
 'fort wainwright':'fort-wainwright-greely-alaska','fort wainwright greely alaska':'fort-wainwright-greely-alaska',
 'vilseck rose barracks':'rose-barracks-vilseck','rose barracks vilseck':'rose-barracks-vilseck',
 'grafenwoehr tower barracks':'grafenwohr-vilseck','grafenwohr tower barracks':'grafenwohr-vilseck',
 'ansbach katterbach kaserne':'ansbach',
 'natick soldier systems center':'soldier-center-natick','soldier center natick':'soldier-center-natick',
 'jbsa fort sam houston':'jbsa-fort-sam-houston','birmingham al arng':null,
 'eglin afb camp bull simons':null };

function findSite(base, city, st){
  for(const cand of [base, city]){
    if(!cand) continue;
    const k=norm(cand);
    if(ALIAS[k]!==undefined){ if(ALIAS[k]===null) return null; return siteById.get(ALIAS[k])||null; }
    if(siteByNorm.has(k)) return siteByNorm.get(k);
  }
  // unique containment: candidate tokens fully inside a site base (or vice versa)
  const k=norm(base||city||''); if(!k) return null;
  const hits=sites.filter(s=>{ const b=norm(s.base); return b===k||b.startsWith(k+' ')||k.startsWith(b+' '); });
  return hits.length===1?hits[0]:null;
}
function findOrg(name){
  const k=norm(name);
  if(orgByNorm.has(k)) return orgByNorm.get(k);
  if(orgById.has(name)) return orgById.get(name);            // raw id ('drus')
  const hits=orgs.filter(o=>{ const b=norm(o.name); return b.includes(k)||k.includes(b); });
  return hits.length===1?hits[0]:null;
}

const report={dedupeApplied:[],reparented:[],added:[],newSites:[],skippedDupe:[],skippedNoParent:[],skippedNoSite:[],skippedMed:[],parentConflicts:[],twinAlarm:[]};
const addedIds=new Set();

// ── 1) dedupe (crosscheck packet) ──────────────────────────────────────────────
const cx=JSON.parse(fs.readFileSync(path.join(RES,'crosscheck.json'),'utf8'));
for(const d of cx.dedupe){
  const keep=findOrg(d.keep);
  if(!keep){ report.skippedNoParent.push('dedupe-keep-missing: '+d.keep); continue; }
  for(const dropName of d.drop){
    const dz=orgs.find(o=>norm(o.name)===norm(dropName) && o.id!==keep.id);
    if(!dz) continue;
    orgs.forEach(o=>{ if(o.parent===dz.id) o.parent=keep.id; });
    orgs.splice(orgs.indexOf(dz),1); orgById.delete(dz.id); orgByNorm.delete(norm(dz.name));
    report.dedupeApplied.push(dz.name+' -> '+keep.name);
  }
}

// ── 2) reparent ops (medcom packet) ────────────────────────────────────────────
const med=JSON.parse(fs.readFileSync(path.join(RES,'medcom.json'),'utf8'));
for(const r of (med.reparent||[])){
  const o=findOrg(r.org), np=findOrg(r.newParent);
  if(o&&np&&o.parent!==np.id){ o.parent=np.id; o.lvl=np.lvl+1; report.reparented.push(o.name+' -> '+np.name); }
}

// ── 3) additions, file by file (parents may be added by earlier rows) ─────────
const FILES=['crosscheck.json','corps_east.json','corps_west.json','usasoc.json','inscom_arcyber.json','medcom.json','arng.json'];
for(const f of FILES){
  const pkt=JSON.parse(fs.readFileSync(path.join(RES,f),'utf8'));
  for(const row of (pkt.additions||pkt.missing||[])){
    if(row.confidence && row.confidence!=='high'){ report.skippedMed.push(row.name); continue; }
    const ex=orgByNorm.get(norm(row.name))||orgByAkey.get(akey(row.name));
    if(ex){
      // dedupe WITH reconciliation: a skipped dupe whose researched parent
      // disagrees with the tree is a finding, not a silent skip
      const rp=findOrg(row.parent);
      if(rp && ex.parent!==rp.id && ex.id!==rp.id)
        report.parentConflicts.push(ex.name+'  tree: '+((orgById.get(ex.parent)||{}).name||ex.parent)+'  researched: '+rp.name);
      report.skippedDupe.push(row.name); continue;
    }
    const parent=findOrg(row.parent);
    if(!parent){ report.skippedNoParent.push(row.name+' (parent: '+row.parent+')'); continue; }
    const sib=orgs.find(o=>o.parent===parent.id && twinPre(akey(o.name),akey(row.name)));
    if(sib){ report.skippedDupe.push(row.name+' (prefix twin of sibling: '+sib.name+')'); continue; }
    // resolve or create the site
    let site=findSite(row.base,row.city,row.st);
    if(!site){
      if(row.lat!=null&&row.lon!=null){
        const isGuard=/national guard|arng/i.test(row.name)||/arng/i.test(String(row.parent))||f==='arng.json';
        const country2=/^[A-Z]{2}$/.test(row.st)&&!['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','PR','GU','VI'].includes(row.st);
        const grp=isGuard?'guard':(country2?(['KR','JP'].includes(row.st)?'kj':(row.st==='DE'?'eur':(row.st==='KW'?'swa':'eur'))):'conus');
        let base=row.base||row.city; let id=slug(base);
        if(siteById.has(id)){ base=base+' ('+row.st+')'; id=slug(base); }
        if(siteById.has(id)){ report.skippedNoSite.push(row.name+' (site id collision '+id+')'); continue; }
        site={id, base, st:row.st, lat:+(+row.lat).toFixed(2), lon:+(+row.lon).toFixed(2), grp, cls:isGuard?'guard':'base', unit:row.abbr||row.name, parent:null};
        sites.push(site); siteById.set(id,site); siteByNorm.set(norm(base),site);
        report.newSites.push(id+' ('+site.st+' '+site.grp+')');
      } else { report.skippedNoSite.push(row.name+' (station: '+(row.base||row.city)+')'); continue; }
    }
    const id0=slug(row.name); let id=id0, n=2;
    while(orgById.has(id)) id=id0+'-'+(n++);
    const org={id, name:row.name, parent:parent.id, lvl:Math.min(9,(parent.lvl||1)+1), root:parent.root||parent.id, site:site.id};
    orgs.push(org); orgById.set(id,org); orgByNorm.set(norm(row.name),org); orgByAkey.set(akey(row.name),org);
    addedIds.add(id);
    report.added.push(row.name+' < '+parent.name+' @ '+site.id);
  }
}

// ── 3b) TWIN ALARM — any twin group touching a newly added org fails the run ──
{
  const groups={};
  orgs.forEach(o=>{ const k=akey(o.name); (groups[k]=groups[k]||[]).push(o); });
  for(const k in groups){
    const g=groups[k];
    if(g.length>1 && g.some(o=>addedIds.has(o.id)))
      report.twinAlarm.push(g.map(o=>o.name+(addedIds.has(o.id)?' [NEW]':'')).join('  ||  '));
  }
  const byParent={};
  orgs.forEach(o=>{ (byParent[o.parent]=byParent[o.parent]||[]).push(o); });
  for(const pid in byParent){
    const kids=byParent[pid];
    for(let i=0;i<kids.length;i++) for(let j=i+1;j<kids.length;j++){
      const a=kids[i], b=kids[j];
      if(!addedIds.has(a.id)&&!addedIds.has(b.id)) continue;
      if(twinPre(akey(a.name),akey(b.name)))
        report.twinAlarm.push('same-parent prefix: '+a.name+'  ||  '+b.name);
    }
  }
}

// ── 4) write ────────────────────────────────────────────────────────────────────
OJ.updated='2026-08-25';
OJ.src=String(OJ.src).split(' || ')[0]+' || v1.0.0 research build-out (25 Aug 2026): +'+report.added.length+' orgs from public sources (DVIDS, army.mil, service pages) via 7-agent verified research; dedupe of 2025-26 redesignation variants; high-confidence rows only, sources logged in scratchpad/research/*.json';
SJ.updated='2026-08-25';
fs.writeFileSync(path.join(ROOT,'data/orgs.json'), JSON.stringify(OJ));
fs.writeFileSync(path.join(ROOT,'data/sites.json'), JSON.stringify(SJ));

// ── 5) regenerate the inline literals ──────────────────────────────────────────
let idx=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const reA=/var A1ORGS=window\.A1ORGS=\[[^\n]*\];/;
const reS=/var SITES=window\.SITES=\[[^\n]*\];/;
if(!reA.test(idx)||!reS.test(idx)) throw new Error('literal anchors not found');
idx=idx.replace(reA,'var A1ORGS=window.A1ORGS='+JSON.stringify(orgs)+';');
idx=idx.replace(reS,'var SITES=window.SITES='+JSON.stringify(sites)+';');
fs.writeFileSync(path.join(ROOT,'index.html'), idx);

console.log(JSON.stringify({
  totals:{orgs:orgs.length, sites:sites.length},
  added:report.added.length, newSites:report.newSites.length,
  dedupe:report.dedupeApplied, reparented:report.reparented,
  skippedDupe:report.skippedDupe, skippedNoParent:report.skippedNoParent,
  skippedNoSite:report.skippedNoSite, skippedMed:report.skippedMed,
  newSiteList:report.newSites,
  parentConflicts:report.parentConflicts, twinAlarm:report.twinAlarm
},null,1));
if(report.twinAlarm.length){
  console.error('TWIN ALARM: the merge created near-duplicate orgs — reconcile before shipping (data-lint §7 will also fail).');
  process.exitCode=1;
}
if(report.parentConflicts.length)
  console.error('PARENT CONFLICTS: '+report.parentConflicts.length+' skipped dupes disagree with the tree on parentage — verify and resolve each (dual-hats excepted), do not park.');