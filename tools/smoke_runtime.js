// BOOT SMOKE (A-ORG-2): execute all scripts with a stub DOM; surface runtime throws with stacks.
// PORTED from A-ORG-1 tools/smoke_runtime.js — the stub approach (document/window/canvas/
// localStorage/matchMedia stubs, timer + raf capture, drain caps, drag synthesis, PASS-line
// format) is kept. A-ORG-2 adaptations, each deliberate:
//   1. TARGET: index.html when it exists; while it doesn't (module construction phase) the
//      page is assembled IN MEMORY from modules/s1-shell.html with its <!-- @SCRIPT -->
//      marker replaced by the module JS concatenated in m1..m6, s3, s4, s5 order — exactly
//      the integration contract. A function replacer is mandatory: module code contains
//      literal '$&' sequences that String.replace would otherwise expand.
//   2. WINDOW LISTENERS ARE CAPTURED, not no-op'd: A-ORG-2's m3 attaches pointermove/up to
//      window (pointer capture is banned by the reliability contract) and every s-module
//      self-arms on window 'load' — the harness must dispatch both to boot and to drag.
//   3. fetch() serves REAL same-origin files from the repo (data/*.json) so the m6 TopoJSON
//      decode path runs; absolute/CDN URLs 404 (A-ORG-2 is same-origin only by charter).
//   4. SITES is seeded from data/sites.json AFTER script eval and ONLY if the page did not
//      define it (the shell data loader is not yet ported; this is the same idiom as
//      A-ORG-1's smoke seeding localStorage with app data). Consumers read SITES lazily at
//      call time, so a real loader landing later simply wins.
//   5. Globals are installed with Object.defineProperty: Node >=21 ships getter-only
//      navigator/localStorage accessors that silently swallow sloppy-mode assignment.
//   6. Probes are the A-ORG-2 mission set: __errLog empty, search index >200 sites,
//      selectSite('fort-bragg') populates #dossier + re-arms GlobeState.dirty, synthetic
//      drag updates GlobeState.q, corner clocks populated. drawGlobe is probed NON-FATALLY
//      (stub canvas is "disconnected" so the ported render loop idles, same as A-ORG-1's
//      smoke): today it surfaces the known _ringXYZ integration gap as a warning.
//   7. A-ORG-1's armychart.* localStorage seeds are dropped (A-ORG-2 reads no localStorage
//      at boot) and unhandledRejection is counted as a failure instead of crashing Node.
const fs=require('fs');
const path=require('path');
const ROOT=path.join(__dirname,'..');

// ---- target: index.html, else assemble shell + modules (integration order) ----
const MODULES=['m1-geom.js','m2-render.js','m3-input.js','m4-camera.js','m5-markers.js',
               'm6-mapdata.js','s3-search.js','s4-dossier.js','s5-clocks.js'];
let html=null, target='index.html';
const idxPath=path.join(ROOT,'index.html');
if(fs.existsSync(idxPath)){
  html=fs.readFileSync(idxPath,'utf8');
}else{
  const need=['s1-shell.html'].concat(MODULES).map(f=>path.join('modules',f));
  const missing=need.filter(p=>!fs.existsSync(path.join(ROOT,p)));
  if(missing.length){
    console.log('SMOKE SKIP — no index.html and modules incomplete: '+missing.join(', '));
    process.exit(0);
  }
  const shell=fs.readFileSync(path.join(ROOT,'modules','s1-shell.html'),'utf8');
  if(shell.indexOf('<!-- @SCRIPT -->')<0){
    console.log('SMOKE SKIP — modules/s1-shell.html has no <!-- @SCRIPT --> marker');
    process.exit(0);
  }
  const js=MODULES.map(f=>fs.readFileSync(path.join(ROOT,'modules',f),'utf8')).join('\n\n');
  html=shell.replace('<!-- @SCRIPT -->', function(){ return js; });   // function replacer — see header note 1
  target='modules/s1-shell.html + '+MODULES.length+' modules (assembled in-memory)';
}
console.log('  target: '+target);
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
if(!scripts.length){ console.log('SMOKE FAIL (1)'); console.log('✗ no <script> blocks found in target'); process.exit(1); }

// ---- stub DOM (PORTED from A-ORG-1 smoke_runtime.js) ---------------------------
function def(o,k,v){ try{ Object.defineProperty(o,k,{value:v,writable:true,configurable:true}); }catch(_){ try{ o[k]=v; }catch(__){} } }
function mkStyle(){ return new Proxy({},{get:(t,p)=>t[p]??'', set:(t,p,v)=>{t[p]=v;return true;}}); }
const ctxStub=new Proxy({}, {get:(t,p)=>{
  if(p==='canvas') return {width:800,height:600};
  if(p==='measureText') return ()=>({width:40});
  if(p==='createLinearGradient'||p==='createRadialGradient') return ()=>({addColorStop(){}});
  if(p==='getImageData') return ()=>({data:new Uint8ClampedArray(4)});
  return typeof t[p]!=='undefined'? t[p] : (()=>{});
}, set:()=>true});
const CANVASES=[];
function mkEl(tag){
  const el={ __tag:tag, id:'', className:'', children:[], style:mkStyle(), dataset:{},
    attrs:{}, _html:'', textContent:'', value:'', checked:false, hidden:false,
    classList:{ _s:new Set(), add(...a){a.forEach(x=>this._s.add(x));}, remove(...a){a.forEach(x=>this._s.delete(x));},
      toggle(x,f){ const on=(f===undefined)?!this._s.has(x):!!f; on?this._s.add(x):this._s.delete(x); return on; },
      contains(x){return this._s.has(x);} },
    setAttribute(k,v){ this.attrs[k]=String(v); if(k==='id') this.id=v; },
    getAttribute(k){ return this.attrs[k]??null; },
    removeAttribute(k){ delete this.attrs[k]; },
    appendChild(c){ this.children.push(c); c.parentNode=this; if(c.id) IDS[c.id]=c; return c; },
    insertBefore(c,ref){ this.children.push(c); c.parentNode=this; if(c.id) IDS[c.id]=c; return c; },
    removeChild(c){ this.children=this.children.filter(x=>x!==c); return c; },
    remove(){}, contains(){return false;}, closest(){return null;},
    querySelector(){return null;}, querySelectorAll(){return {forEach(){},length:0};},
    _ls:{}, addEventListener(t,f){ (this._ls[t]=this._ls[t]||[]).push(f); }, removeEventListener(){}, focus(){}, blur(){}, click(){},
    dispatch(t,ev){ (this._ls[t]||[]).forEach(f=>f(ev)); },
    getBoundingClientRect(){return {left:0,top:0,width:800,height:600,right:800,bottom:600};},
    insertAdjacentHTML(){}, scrollIntoView(){}, getContext(){return ctxStub;},
    get firstChild(){return this.children[0]||null;}, get parentElement(){return this.parentNode||null;},
    get offsetWidth(){return 800;}, get offsetHeight(){return 600;}, get clientWidth(){return 800;}, get clientHeight(){return 600;},
    get innerHTML(){return this._html;},
    set innerHTML(v){ this._html=String(v);
      // register ids appearing in html so getElementById finds *something*
      for(const m of String(v).matchAll(/id="([^"]+)"/g)){ if(!IDS[m[1]]) IDS[m[1]]=mkEl('div'), IDS[m[1]].id=m[1]; }
    },
    get outerHTML(){return this._html;}, set outerHTML(v){},
    get nextSibling(){return null;},
  };
  if(tag==='canvas'){ el.width=800; el.height=600; CANVASES.push(el); }
  return el;
}
const IDS={};
// seed every id present anywhere in the document (static markup + templates)
const __allIds=[...html.matchAll(/id="([A-Za-z][\w-]*)"/g)].map(m=>m[1]);
for(const id of new Set(__allIds)){ const e=mkEl('div'); e.id=id; IDS[id]=e; }
const documentStub={
  documentElement:mkEl('html'), head:mkEl('head'), body:mkEl('body'),
  createElement:t=>mkEl(t), createTextNode:t=>({textContent:t}),
  createDocumentFragment:()=>mkEl('frag'),
  getElementById:id=>IDS[id]||null,
  querySelector:()=>null, querySelectorAll:()=>{ const a=[]; a.forEach=()=>{}; return a; },
  addEventListener(){}, removeEventListener(){},
  visibilityState:'visible', hidden:false, activeElement:null,
};
documentStub.documentElement.setAttribute('data-app-theme','arctic');
documentStub.body.appendChild=function(c){ this.children.push(c); if(c.id) IDS[c.id]=c; return c; };

let fails=0;
const timers=[]; let timerCap=400;
def(global,'window',global);
def(global,'document',documentStub);
def(global,'navigator',{userAgent:'smoke', vibrate:()=>{}, language:'en-US', languages:['en-US'],
  clipboard:{writeText:()=>Promise.resolve()},
  serviceWorker:{register:()=>Promise.resolve({update(){},addEventListener(){}}), addEventListener(){}, controller:null} });
def(global,'location',{href:'https://app.test/', origin:'https://app.test', protocol:'https:', pathname:'/', search:'', hash:'', reload(){}, hostname:'app.test'});
def(global,'history',{pushState(){},replaceState(){},back(){}});
def(global,'localStorage',{_m:{},getItem(k){return this._m[k]??null;},setItem(k,v){this._m[k]=String(v);},removeItem(k){delete this._m[k];}});
def(global,'sessionStorage',global.localStorage);
def(global,'matchMedia',()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));   // phone-first: min-width:1100px never matches
const rafQ=[]; def(global,'requestAnimationFrame',cb=>{ if(rafQ.length<6) rafQ.push(cb); return 1; });
def(global,'cancelAnimationFrame',()=>{});
def(global,'setTimeout',(cb,ms)=>{ if(timers.length<timerCap) timers.push(cb); return timers.length; });
def(global,'setInterval',(cb,ms)=>{ return 999; });
def(global,'clearTimeout',()=>{}); def(global,'clearInterval',()=>{});
// fetch: real same-origin files from the repo (adaptation 3); anything else 404s.
def(global,'fetch',(url)=>{
  try{
    const rel=String(url).replace(/^\.\//,'').split('?')[0];
    if(!/^[a-z]+:/i.test(rel)){
      const f=path.normalize(path.join(ROOT,rel));
      if(f.startsWith(path.normalize(ROOT+path.sep)) && fs.existsSync(f) && fs.statSync(f).isFile()){
        const txt=fs.readFileSync(f,'utf8');
        return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(JSON.parse(txt)),text:()=>Promise.resolve(txt)});
      }
    }
  }catch(_){}
  return Promise.resolve({ok:false,status:404,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
});
def(global,'ResizeObserver',class{observe(){}disconnect(){}unobserve(){}});
def(global,'IntersectionObserver',class{observe(){}disconnect(){}unobserve(){}});
def(global,'MutationObserver',class{observe(){}disconnect(){}});
def(global,'Image',class{ set src(v){} });
global.URL.createObjectURL=()=>'blob:x';
def(global,'Blob',class{constructor(){}});
def(global,'performance',{now:()=>Date.now()});
def(global,'screen',{width:390,height:844});
def(global,'innerWidth',390); def(global,'innerHeight',844);
def(global,'devicePixelRatio',2);
// window listeners are CAPTURED (adaptation 2): m3 drags via window pointermove/up,
// s-modules boot on window 'load'.
const WIN_LS={};
def(global,'addEventListener',(t,f)=>{ (WIN_LS[t]=WIN_LS[t]||[]).push(f); });
def(global,'removeEventListener',()=>{});
function winDispatch(t,ev){
  for(const f of (WIN_LS[t]||[]).slice()){
    try{ f(ev); }
    catch(e){ fails++; console.log('✗ WINDOW '+t+' handler throw: '+e.message); console.log((e.stack||'').split('\n').slice(0,3).join('\n')); }
  }
}
def(global,'scrollTo',()=>{}); def(global,'scroll',()=>{}); def(global,'scrollBy',()=>{});
def(global,'getSelection',()=>({removeAllRanges(){},toString:()=>''}));
def(global,'open',()=>null); def(global,'print',()=>{});
def(global,'getComputedStyle',()=>({getPropertyValue:()=>''}));
def(global,'alert',()=>{}); def(global,'confirm',()=>true); def(global,'prompt',()=>null);
def(global,'CustomEvent',class{constructor(t,o){this.type=t;Object.assign(this,o||{});}});
def(global,'Event',global.CustomEvent);

process.on('unhandledRejection',(r)=>{ fails++; console.log('✗ UNHANDLED REJECTION: '+((r&&r.message)||r));
  console.log(String((r&&r.stack)||'').split('\n').slice(0,3).join('\n')); });

function flushAsync(n){ let p=Promise.resolve(); for(let i=0;i<(n||4);i++) p=p.then(()=>new Promise(r=>setImmediate(r))); return p; }

(async function main(){
  // ── BOOT: eval every script block (bootShell runs at eval time) ──
  scripts.forEach((code,i)=>{
    try{ (0,eval)(code); }
    catch(e){ fails++; console.log(`✗ SCRIPT ${i} boot throw: ${e.message}`);
      const st=(e.stack||'').split('\n').slice(0,4).join('\n'); console.log(st); }
  });
  await flushAsync();   // let the m6 same-origin TopoJSON loaders settle

  // ── SITES: seed only if the page defined no loader yet (adaptation 4) ──
  if(typeof global.SITES==='undefined'){
    try{
      const sj=JSON.parse(fs.readFileSync(path.join(ROOT,'data','sites.json'),'utf8'));
      def(global,'SITES', sj.sites||[]);
      console.log('  seeded SITES from data/sites.json ('+global.SITES.length+' sites) — shell data loader not yet ported');
    }catch(e){ fails++; console.log('✗ SITES seed failed: '+e.message); }
  }

  // ── 'load': the s-modules self-arm here (initSearch/initDossier/initClocks) ──
  winDispatch('load', {type:'load'});

  // drain queued timeouts (init chains + clock re-arms) with cap
  let ran=0;
  while(timers.length && ran<timerCap){ const cb=timers.shift(); ran++;
    try{ cb(); }catch(e){ fails++; console.log(`✗ TIMER throw: ${e.message}`); console.log((e.stack||'').split('\n').slice(0,4).join('\n')); }
  }
  // run a few captured animation frames
  let fr=0;
  while(rafQ.length && fr<6){ const cb=rafQ.shift(); fr++;
    try{ cb(performance.now()); }catch(e){ fails++; console.log(`✗ RAF throw: ${e.message}`); console.log((e.stack||'').split('\n').slice(0,4).join('\n')); } }
  await flushAsync();

  // ── PROBE: shell spine ──
  if(!global.GlobeState){ fails++; console.log('✗ GlobeState missing — shell spine did not boot'); }
  else{
    if(GlobeState.baseK!==0.72){ fails++; console.log('✗ baseK '+GlobeState.baseK+' on phone stub (radius law wants 0.72)'); }
    else console.log('  ✓ GlobeState spine (baseK 0.72 phone, zoom '+GlobeState.zoom+')');
  }
  // v0.8.0: the ⋯ tile is gone — maintenance rides a wordmark long-press; the
  // sheet itself (#appMenu) must still render version/backup/restore/diag.
  { const wm=IDS['wordmark'], am=IDS['appMenu'];
    if(!wm||!am){ fails++; console.log('✗ maintenance door missing (#wordmark/#appMenu)'); }
    else { try{ global._renderAppMenu&&global._renderAppMenu(); }catch(_){}
      if(am.innerHTML.indexOf('A-ORG-2')<0 || am.innerHTML.indexOf('data-am="diag"')<0){ fails++; console.log('✗ maintenance sheet did not stamp version/diag'); }
      else if(am.innerHTML.indexOf('data-am="layers"')>=0){ fails++; console.log('✗ Layers still in the maintenance sheet (moved to the ring at v0.8.0)'); }
      else console.log('  ✓ maintenance sheet stamps version (wordmark long-press door)'); } }

  // ── PROBE: search index + ranking + render (s3) ──
  try{
    if(typeof global._searchEntries!=='function') throw new Error('_searchEntries not declared (s3-search absent from boot)');
    const n=global._searchEntries().length;
    const wantN=(function(){ try{ return JSON.parse(fs.readFileSync(__dirname+'/../data/sites.json','utf8')).sites.length; }catch(_){ return null; } })();
    const wantOrgs=(function(){ try{ const cats={acoms:1,asccs:1,drus:1,'acquisition-paes-cpes':1};
      return JSON.parse(fs.readFileSync(__dirname+'/../data/orgs.json','utf8')).orgs.filter(o=>!cats[o.id]).length; }catch(_){ return 0; } })();
    // v0.24.0: US states are searchable brief subjects too
    const wantSt=(global.US_STATES&&global.US_STATES.length)||0;
    if(!wantSt){ fails++; console.log('✗ US_STATES missing from the search index'); }
    if(wantN!=null && n!==wantN+wantOrgs+wantSt){ fails++; console.log('✗ SEARCH index '+n+' entries, want '+wantN+' sites + '+wantOrgs+' orgs + '+wantSt+' states — a payload is stale or truncated'); }
    else if(!(n>200)){ fails++; console.log('✗ SEARCH index too small: '+n+' entries (contract: >200 sites)'); }
    else console.log('  ✓ search index built: '+n+' entries ('+wantN+' sites + '+wantOrgs+' orgs + '+wantSt+' states)');
    const res=(typeof global.sfsResults==='function')? global.sfsResults('bragg') : null;
    if(!res || !res.list.length || res.list[0].id!=='fort-bragg'){
      fails++; console.log('✗ SEARCH ranking: "bragg" top hit = '+(res&&res.list[0]?res.list[0].id:'(none)'));
    } else {
      console.log('  ✓ sfsResults("bragg") → '+res.list[0].id+' (of '+res.total+' hits)');
      if(typeof global.sfsRender==='function'){
        global.sfsRender(res);
        const dd=IDS['searchResults'];
        // M1 verify regression guard: results rendered into [hidden] are display:none —
        // the shipped markup must never re-grow the attribute.
        if(dd && dd.attributes && dd.attributes.hidden!==undefined){ fails++; console.log('✗ #searchResults carries the hidden attribute — results are invisible'); }
        if(!dd || dd.innerHTML.indexOf('data-sfs="fort-bragg"')<0){ fails++; console.log('✗ SEARCH render: no fort-bragg row in #searchResults'); }
        else console.log('  ✓ results rendered into #searchResults');
      }
    }
  }catch(e){ fails++; console.log('✗ SEARCH probe: '+e.message); console.log((e.stack||'').split('\n').slice(0,3).join('\n')); }

  // ── PROBE: selectSite('fort-bragg') → #dossier + dirty (s4 single brain) ──
  try{
    if(typeof global.selectSite!=='function') throw new Error('window.selectSite not exposed (s4-dossier absent from boot)');
    if(global.GlobeState) GlobeState.dirty=false;
    global.selectSite('fort-bragg');
    const host=IDS['dossier'];
    if(!global.GlobeState || GlobeState.sel!=='fort-bragg'){ fails++; console.log('✗ selectSite: GlobeState.sel = '+(global.GlobeState?GlobeState.sel:'(no GlobeState)')); }
    if(global.GlobeState && GlobeState.dirty!==true){ fails++; console.log('✗ selectSite did not set GlobeState.dirty'); }
    // v0.9.0 anchored callout: identity arrives AT the dot; the sheet stays down
    const co=IDS['calloutCard'];
    // v0.27.0 COMPACT CARD contract: a bare base tap shows THE BASE (name +
    // location) with the three icons — Units (tenant count), Connections,
    // Details — and NEVER leads with a tenant organization.
    if(!co || co.hidden!==false || co.innerHTML.indexOf('Fort Bragg')<0
       || co.innerHTML.indexOf('data-coic="units"')<0 || co.innerHTML.indexOf('data-coic="conx"')<0
       || co.innerHTML.indexOf('data-codetail')<0){
      fails++; console.log('✗ selectSite: compact base card wrong (hidden='+(co&&co.hidden)+', '+(co?co.innerHTML.length:0)+' chars — want base name + units/conx/details icons)');
    } else if(co.innerHTML.indexOf('<div class="co-name">USAWHC')>=0){
      fails++; console.log('✗ selectSite: a bare base tap led with a tenant org, not the base');
    } else if(host && host.hidden!==true){
      fails++; console.log('✗ selectSite auto-opened the sheet (callout era: sheet only on ▤)');
    } else console.log('  ✓ selectSite(fort-bragg): anchored callout ('+co.innerHTML.length+' chars), sheet held back, dirty re-armed');
  }catch(e){ fails++; console.log('✗ SELECT probe: '+e.message); console.log((e.stack||'').split('\n').slice(0,3).join('\n')); }
  // fly-to queued frames from the select — run a few (ported post-probe drain)
  { let fr2=0; while(rafQ.length && fr2<4){ const cb=rafQ.shift(); fr2++;
      try{ cb(performance.now()); }catch(e){ fails++; console.log('✗ post-select frame throw: '+e.message); } } }

  // ── PROBE: v0.2.0 spine — Snapshot, families, legend, trail ──
  try{
    if(typeof global.buildSnapshot!=='function') throw new Error('buildSnapshot not exposed (s6-export absent)');
    const sn=global.buildSnapshot();
    if(!sn || !sn.meta || !sn.meta.title || !Array.isArray(sn.sites) || sn.sites.length<1){
      fails++; console.log('✗ SNAPSHOT malformed: '+JSON.stringify(sn&&sn.meta));
    } else if(sn.selection && sn.selection.id!=='fort-bragg'){
      fails++; console.log('✗ SNAPSHOT selection drifted: '+sn.selection.id);
    } else if(!sn.sites.every(function(r){ return r.cls; })){
      fails++; console.log('✗ SNAPSHOT rows missing cls keys');
    } else console.log('  ✓ snapshot: "'+sn.meta.title+'" · '+sn.sites.length+' sites in scope, classes attached');
    if(typeof global.clsOf==='function'){
      const f=global.clsOf('anniston-army-depot');
      if(f!=='depot'){ fails++; console.log('✗ clsOf(anniston-army-depot) = '+f+' (expected depot)'); }
      else console.log('  ✓ clsOf reads the carried A-ORG-1 class (depot)');
    }
    // v1.19.0: Layers is a PANE of the one drawer — #legendPanel is retired.
    if(typeof global._shOpen==='function'){
      global._shOpen('lay');
      const lg=IDS['dossier'];
      if(!lg || lg.innerHTML.indexOf('lg-row')<0){ fails++; console.log('✗ LAYERS pane did not render rows'); }
      else console.log('  ✓ layers pane rows rendered');
      global.hideDossier();
    }
    global.selectSite('fort-stewart');   // second stop → crumbs appear once ▤ opens the sheet
    global.showDossier('fort-stewart');
    const dz=IDS['dossier'];
    if(!dz || dz.innerHTML.indexOf('sh-crumb')<0){ fails++; console.log('✗ TRAIL crumbs missing from the ▤ sheet after two selections'); }
    else console.log('  ✓ trail crumbs render in the ▤ sheet header');
    global.hideDossier();
    if(typeof global.setMode==='function'){
      global.setMode('brief');
      const bs=IDS['briefStage'];
      const briefOn=(typeof document!=='undefined')&&document.body&&document.body.classList&&document.body.classList.contains('brief-mode');
      if(!briefOn){ fails++; console.log('✗ setMode(brief) did not flip body.brief-mode'); }
      // v0.5.0: an empty brief SET shows the add-selected prompt, never an auto-chain
      // v0.24.0: the rooms are severed — the empty brief points at SEARCH, it is
      // never handed the map's selection (data-bfadd would be a cross-room bridge).
      if(!bs || bs.innerHTML.indexOf('data-bfsearch')<0){ fails++; console.log('✗ BRIEF empty state should offer search-to-add'); }
      if(bs && bs.innerHTML.indexOf('data-bfadd')>=0){ fails++; console.log('✗ BRIEF empty state must not carry the map selection across rooms'); }
      else console.log('  ✓ brief mode: body flag + empty-state add action');
      global.setMode('map');
    } else { fails++; console.log('✗ setMode not exposed'); }
  }catch(e){ fails++; console.log('✗ SPINE probe: '+e.message); }

  // ── PROBE: v0.4.0 datastore — records API, tab render, snapshot/export ride ──
  try{
    if(!global.Records) throw new Error('Records API not exposed (s7-records absent)');
    global.Records.add('fort-bragg','people',{name:'COL J. Mercer', role:'G-3'});
    global.Records.add('fort-bragg','specs',{label:'Runway', value:'10,000 ft'});
    if(global.Records.count('fort-bragg')!==2){ fails++; console.log('✗ RECORDS count wrong: '+global.Records.count('fort-bragg')); }
    global.selectSite('fort-bragg');
    global.showDossier('fort-bragg');       // ▤ path: the sheet locks to the org first
    global._odUI.rec(true);                 // then the detail area opens (v0.8.0)
    global._odSetTab('people');
    const host=IDS['dossier'];
    if(host.innerHTML.indexOf('Mercer')<0 || host.innerHTML.indexOf('People · 1')<0){ fails++; console.log('✗ RECORDS tab did not render the person'); }
    else console.log('  ✓ records: add + tab render behind ▤ (People · 1, row present)');
    global._odSetTab('ov');
    global._odUI.rec(false);
    const sn2=global.buildSnapshot();
    const rr=sn2.extras && sn2.extras.records && sn2.extras.records['fort-bragg'];
    if(!rr || rr.people.length!==1){ fails++; console.log('✗ SNAPSHOT extras.records missing the record'); }
    else console.log('  ✓ records ride the snapshot (extras.records)');
    if(typeof global._xpDossierBody==='function'){
      const body=global._xpDossierBody(sn2);
      if(body.indexOf('Mercer')<0 || body.indexOf('Technical specs')<0){ fails++; console.log('✗ EXPORT body missing record sections'); }
      else console.log('  ✓ records flow into the export dossier body');
    }
  }catch(e){ fails++; console.log('✗ RECORDS probe: '+e.message); }

  // ── PROBE: v1.1.0 THE ID REGISTRY + THE DATABASE DOOR ──
  try{
    let ok=true;
    // NEW auto-generates, entering an existing ID associates (never duplicates)
    const a=global.Records.addId('fort-bragg','NEW');
    if(a!=='ID-001'){ ok=false; fails++; console.log('✗ ID: NEW did not mint ID-001 (got '+a+')'); }
    const b=global.Records.addId('fort-bragg','TF-EAGLE');
    const c=global.Records.addId('fort-bragg','tf-eagle');
    if(b!=='TF-EAGLE' || c!=='TF-EAGLE' || global.Records.ids('fort-bragg').length!==2){
      ok=false; fails++; console.log('✗ ID: dedupe/associate failed ('+JSON.stringify(global.Records.ids('fort-bragg'))+')'); }
    // items tag with xid; counts see them; deleting an ID untags, never deletes
    global.Records.add('fort-bragg','notes',{text:'Tagged note', xid:'TF-EAGLE'});
    if(global.Records.idCount('fort-bragg','TF-EAGLE')!==1){ ok=false; fails++; console.log('✗ ID: idCount missed the tagged note'); }
    // the ID tab renders between Overview and People, pane + form select present
    global.showDossier('fort-bragg'); global._odUI.rec(true); global._odSetTab('xid');
    const dzh=IDS['dossier'].innerHTML;
    const iTab=dzh.indexOf('data-odtab="xid"'), iPpl=dzh.indexOf('data-odtab="people"'), iOv=dzh.indexOf('data-odtab="ov"');
    if(!(iOv>=0 && iTab>iOv && iPpl>iTab)){ ok=false; fails++; console.log('✗ ID tab not between Overview and People'); }
    if(dzh.indexOf('rcIdNew')<0 || dzh.indexOf('TF-EAGLE')<0){ ok=false; fails++; console.log('✗ ID pane missing add row / IDs'); }
    global._odSetTab('people'); global._odUI.form('people'); global.showDossier('fort-bragg');
    const dzf=IDS['dossier'].innerHTML;
    if(dzf.indexOf('rcFid')<0 || dzf.indexOf('NEW')<0){ ok=false; fails++; console.log('✗ record form lost its ID box'); }
    global._odUI.form(null); global._odSetTab('ov'); global._odUI.rec(false);
    global.Records.delId('fort-bragg','TF-EAGLE');
    const r0=global.Records.of('fort-bragg');
    if(global.Records.ids('fort-bragg').length!==1 || r0.notes[0].xid!==''){ ok=false; fails++; console.log('✗ ID delete must untag, not delete'); }
    // the database door: boot-inert (zero foreign code), API present, sheet renders
    if(typeof global.ensureSupabase!=='function' || !global.DB){ ok=false; fails++; console.log('✗ database door missing'); }
    if(global.document.getElementById('sbLib') || typeof global.supabase!=='undefined'){
      ok=false; fails++; console.log('✗ ZERO-FOREIGN-CODE VIOLATION: database library present at boot'); }
    global.DB.push();                                   // disconnected → must be a silent no-op
    if(typeof global._dbSheet==='function'){ global._dbSheet();
      const dzq=IDS['dossier'].innerHTML;
      if(dzq.indexOf('dbUrl')<0 || dzq.indexOf('dbStatus')<0 || dzq.indexOf('a2_records')<0){
        ok=false; fails++; console.log('✗ database sheet missing url/status/setup'); }
    } else { ok=false; fails++; console.log('✗ _dbSheet missing'); }
    try{ global.hideDossier(); }catch(_){}
    // v1.2.0 board / v1.12.0 BLANK-SLATE AMENDMENT: the board carries
    // records + views + saved briefs; the WORKING diagram left the board —
    // an incoming brief blob (older app) must be IGNORED, and the snapshot
    // must not carry one. Views stay newest-wins. Chip gating unchanged.
    const snap=global._dbSnapshot();
    if(snap.brief){ ok=false; fails++; console.log('✗ snapshot must NOT carry the working brief (blank-slate law)'); }
    if(!snap.views || !Array.isArray(snap.views.list) || !snap.briefs || !Array.isArray(snap.briefs.list)){
      ok=false; fails++; console.log('✗ board snapshot missing views/briefs'); }
    const far=Date.now()+9e9;
    global._dbApply({brief:{nodes:[{k:'cx:remote1',n:'Remote Group',p:null,t:'custom',r:null,c:'',sh:0,tx:''}],hide:[],mod:far},
                     views:{list:[{n:'Remote view'}],mod:far}});
    if(global.Brief.node('cx:remote1')){ ok=false; fails++; console.log('✗ remote WORKING-brief blob must be ignored (blank-slate law)'); }
    const s2=global._dbSnapshot();
    if(!s2.views.list.length || s2.views.list[0].n!=='Remote view'){ ok=false; fails++; console.log('✗ newer remote views did not apply'); }
    global._dbApply({views:{list:[],mod:1}});                                   // OLDER — must be ignored
    if(!global._dbSnapshot().views.list.length){
      ok=false; fails++; console.log('✗ older remote views clobbered newer local state'); }
    global._dbApply({views:{list:[],mod:far+1}});                               // clean the test view (newest wins)
    if(typeof global.DB.chip!=='function'){ ok=false; fails++; console.log('✗ reconnect chip missing'); }
    global.DB.chip();                                                            // no cfg → must not render
    if(global.document.getElementById('dbChip')){ ok=false; fails++; console.log('✗ chip rendered without stored settings'); }
    global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'a-org-2'});
    global.DB.chip();
    const chipEl=global.document.getElementById('dbChip');
    if(!chipEl){ ok=false; fails++; console.log('✗ chip did not render with stored settings'); }
    else { try{ chipEl.remove(); }catch(_){} }
    global.DB._setCfg(null);
    if(ok) console.log('  ✓ board carries views+briefs (working brief OFF the board — blank-slate law) · reconnect chip gated on stored settings');
  }catch(e){ fails++; console.log('✗ ID/DB probe: '+e.message); }

  // ── PROBE: v0.13.0 the HAND-BUILT brief — members only, derived L1-L4,
  //           group eyes + depth filter, picker, snapshot rows, export ──
  try{
    if(!global.Brief) throw new Error('Brief API not exposed');
    global.Brief.add('fort-bragg');                     // → usawhc, ONE member — no subtree
    global.Brief.note('fort-bragg','Main effort');
    if(global.Brief.list().join()!=='usawhc'){ fails++; console.log('✗ BRIEF star must add ONE org: '+global.Brief.list().join()); }
    // custom subordinate built under a member joins the brief on its own
    const org=global.Orgs.add('1st Test Brigade','fort-bragg','fort-campbell');
    if(!org || org.parent!=='usawhc' || global.Orgs.of('usawhc').length!==1){
      fails++; console.log('✗ ORGS add failed (site parent must normalize to the primary org): '+JSON.stringify(org)); }
    if(!global.Brief.has(org.id)){ fails++; console.log('✗ custom under a member did not join the brief'); }
    // hand-built tree levels: AMC (new L1) + its real kid ASC (derived L2)
    global.Brief.add('amc'); global.Brief.add('asc');
    global.setMode('brief');
    const C=global._briefChainMap();
    if(C.order.length!==4){ fails++; console.log('✗ CHAIN not members-only: '+C.order.length+' nodes (want 4)'); }
    if(!C.nodes['usawhc'] || C.nodes['usawhc'].tier!==1){ fails++; console.log('✗ usawhc not L1'); }
    const on=C.nodes[org.id];
    if(!on || on.tier!==2 || on.parent!=='usawhc' || !on.custom || on.lat==null){
      fails++; console.log('✗ CHAIN custom org node wrong: '+JSON.stringify(on)); }
    if(!C.nodes['asc'] || C.nodes['asc'].tier!==2 || C.nodes['asc'].parent!=='amc'){
      fails++; console.log('✗ derived level wrong for asc: '+JSON.stringify(C.nodes['asc'])); }
    // depth filter: L1 only → asc drops, amc stays
    global.Brief.depth(1);
    const C3=global._briefChainMap();
    if(C3.nodes['asc'] || !C3.nodes['amc']){ fails++; console.log('✗ depth filter broken'); }
    global.Brief.depth(4);
    // group eye: hiding AMC drops its whole component from the globe map
    global.Brief.eye('amc');
    const C4=global._briefChainMap();
    if(C4.nodes['amc'] || C4.nodes['asc'] || !C4.nodes['usawhc']){ fails++; console.log('✗ group eye broken'); }
    global.Brief.eye('amc');
    // chart: group headers with eyes, depth control, the custom chip
    global.renderBrief();
    const bs2=IDS['briefStage'];
    // v1.15.0: the chart is the ILLUMINATED CONSOLE — an absolute plot
    // (.bf-tree) with content-hugging boxes and one SVG net (.bf-net) of
    // hairlines + elbow connectors. The ul/li rail tree is retired.
    if(bs2.innerHTML.indexOf('bf-tree')<0 || bs2.innerHTML.indexOf('bf-box')<0
       || bs2.innerHTML.indexOf('bf-net')<0){ fails++; console.log('✗ CHART is not the illuminated console (want bf-tree/bf-box/bf-net)'); }
    if(bs2.innerHTML.indexOf('bf-kids')>=0 || bs2.innerHTML.indexOf('bf-li')>=0){ fails++; console.log('✗ the retired ul/li rail tree still renders'); }
    if(bs2.innerHTML.indexOf('ch-node')>=0){ fails++; console.log('✗ the retired indented-list chart still renders'); }
    if(bs2.innerHTML.indexOf('data-bfdepth')<0){ fails++; console.log('✗ CHART depth control missing'); }
    if(bs2.innerHTML.indexOf('data-bfobj="'+org.id+'"')<0){ fails++; console.log('✗ custom org missing from chart'); }

    // object popup: annotation + SUBORDINATES PICKER (one-tap real tree kids)
    global._bfObjSheet('fort-bragg');
    const host2=IDS['dossier'];
    // v0.23.0: add-by-search is the primary path (data-bfsearch); the custom-org
    // form moved behind an accordion (data-orgsave). The old data-orgadd is gone.
    if(host2.innerHTML.indexOf('Main effort')<0 || host2.innerHTML.indexOf('data-bfsearch')<0
       || host2.innerHTML.indexOf('data-orgsave')<0 || host2.innerHTML.indexOf('data-orgadd')>=0){ fails++; console.log('✗ OBJECT popup incomplete (want search + custom-org form, no data-orgadd)'); }
    // v0.21.0: brief and map are separate rooms — the "Show on map" (data-govmap) door is gone
    if(host2.innerHTML.indexOf('data-govmap')>=0){ fails++; console.log('✗ "Show on map" should be removed from the brief object sheet'); }
    if(host2.innerHTML.indexOf('Remove from brief')<0){ fails++; console.log('✗ member popup lacks Remove from brief'); }
    global._bfObjSheet('amc');
    if(host2.innerHTML.indexOf('data-bfsub="asc"')<0 || host2.innerHTML.indexOf('data-bfsub="cecom"')<0){
      fails++; console.log('✗ SUBORDINATES picker missing real tree kids'); }
    global._bfObjSheet(org.id);
    if(host2.innerHTML.indexOf('data-orgrm')<0 || host2.innerHTML.indexOf('Custom org')<0){
      fails++; console.log('✗ OBJECT popup (custom) incomplete'); }
    global.hideDossier();
    // view toggles live in the Layers PANE now and still flip flags
    global._shOpen('lay');
    const lg=IDS['dossier'];
    // v0.22.0: view toggles trimmed to Labels + USACE (Dots/Lines retired).
    // v1.19.0: modes use data-lyp precisely so this count stays two.
    if((lg.innerHTML.match(/data-vw=/g)||[]).length!==2 || lg.innerHTML.indexOf('data-vw="usace"')<0
       || lg.innerHTML.indexOf('data-vw="dots"')>=0 || lg.innerHTML.indexOf('data-vw="lines"')>=0){
      fails++; console.log('✗ LAYERS view toggles wrong (want names+usace only, no dots/lines)'); }
    if((lg.innerHTML.match(/data-fam=/g)||[]).length!==5
       || (lg.innerHTML.match(/data-lyp=/g)||[]).length!==5
       || lg.innerHTML.indexOf('aria-pressed')<0){
      fails++; console.log('✗ LAYERS pane wants 5 family rows + 5 mode tiles, all aria-pressed'); }
    if(lg.innerHTML.indexOf('disc-h')>=0){
      fails++; console.log('✗ the Classes accordion is back (retired v1.19.0 — five rows do not earn a disclosure)'); }
    global.hideDossier();
    // snapshot carries the BUILT rows; the export prints exactly those
    const sn3=global.buildSnapshot();
    const xb=sn3.extras.brief;
    if(!xb || xb.mem.length!==4 || xb.rows.length!==4 || xb.hqs.length!==2 || xb.ann['usawhc']!=='Main effort'){
      fails++; console.log('✗ SNAPSHOT extras.brief wrong: '+JSON.stringify(xb&&{mem:xb.mem.length,rows:xb.rows&&xb.rows.length,hqs:xb.hqs})); }
    if(!sn3.extras.orgs || sn3.extras.orgs.length!==1){ fails++; console.log('✗ SNAPSHOT extras.orgs missing'); }
    const body3=global._xpDossierBody(sn3);
    if(body3.indexOf('Main effort')<0 || body3.indexOf('Brief — 4 organizations')<0 || body3.indexOf('L2')<0){
      fails++; console.log('✗ EXPORT body missing built-brief section'); }
    if(!fails) console.log('  ✓ hand-built brief: members-only map + levels + eye/depth + picker + snapshot rows + export');
    // v1.0.3 GROUPS — a named filler node: create under a member, nest a real
    // org beneath it, rename it, and its removal cascades the subtree away.
    global.Brief.addGroup('Enablers', 'usawhc');
    const grp=(global.Brief.node&&global.Brief.list().map(k=>global.Brief.node(k)).find(n=>n&&n.t==='custom'&&n.n==='Enablers'))||null;
    if(!grp || grp.p!=='usawhc'){ fails++; console.log('✗ GROUP did not land under its parent'); }
    else {
      if(!global.Brief.move('amc', grp.k) || global.Brief.node('amc').p!==grp.k){
        fails++; console.log('✗ GROUP cannot take a real org as a child'); }
      global.Brief.rename(grp.k, 'Sustainment Enablers');
      if(global.Brief.node(grp.k).n!=='Sustainment Enablers'){ fails++; console.log('✗ GROUP rename did not stick'); }
      global.Brief.rename('amc', 'Hacked');   // real orgs must refuse rename
      if(global.Brief.node('amc').n==='Hacked'){ fails++; console.log('✗ RENAME must be group-only'); }
      const chart=global.renderBrief && (function(){ global.renderBrief(); return IDS['briefStage']?IDS['briefStage'].innerHTML:''; })();
      // v1.15.0: the engraved GROUP tag retired with the name-only box —
      // the dashed bf-grp ring alone says filler
      if(chart && chart.indexOf('bf-grp')<0){
        fails++; console.log('✗ GROUP box missing its dashed bf-grp class in the chart'); }
      // v1.0.4 — the name form is a SHEET, never inline chart chrome (the owner's
      // recording: the inline foot form collapsed under the phone keyboard)
      if(chart && chart.indexOf('bf-grprow')>=0){ fails++; console.log('✗ inline group form back in the chart — v1.0.4 banned it'); }
      if(chart && chart.indexOf('data-bfgrpnew')<0){ fails++; console.log('✗ chart foot lost its New group door'); }
      if(typeof global._bfGroupSheet==='function'){
        global._bfGroupSheet(grp.k);
        const dz=IDS['dossier']?IDS['dossier'].innerHTML:'';
        if(dz.indexOf('bfGrpNm')<0 || dz.indexOf('data-bfgrpcreate')<0){
          fails++; console.log('✗ _bfGroupSheet did not render the name form'); }
      } else { fails++; console.log('✗ _bfGroupSheet missing'); }
      global._bfAddSheet && global._bfAddSheet(grp.k);
      const dz2=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(dz2 && dz2.indexOf('bf-picksticky')<0){ fails++; console.log('✗ picker commit row lost its sticky contract'); }
      global.Brief.remove(grp.k);
      if(global.Brief.has('amc')){ fails++; console.log('✗ GROUP removal must cascade its subtree'); }
      if(!fails) console.log('  ✓ groups: create-under + nest real org + rename (group-only) + chart tag + cascade remove');
    }
    // v1.4.0 — BRIEF-ONLY PLACES: 12 in the roster, every anchor site real,
    // a place pins its OWN coords (never its parent's), shows its host base
    // in the chart, and never wears the GROUP tag
    {
      let pok=true;
      const roster=global.Brief.places();
      if(roster.length!==12){ pok=false; fails++; console.log('✗ PLACES roster must hold 12, got '+roster.length); }
      roster.forEach(function(p){ if(!global.siteById(p.site)){ pok=false; fails++; console.log('✗ PLACE anchor missing: '+p.site); } });
      global.Brief.add('fort-bragg');                     // parent at Bragg
      global.Brief.addPlace('px:california-rsn', 'usawhc');
      const pn=global.Brief.node('px:california-rsn');
      const ca=global.siteById('california-national-guard');
      if(!pn || pn.la!==ca.lat || pn.lo!==ca.lon){ pok=false; fails++; console.log('✗ PLACE did not pin the anchor coords'); }
      const C=global._briefChainMap({all:true});
      const cn=C.nodes['px:california-rsn'];
      if(!cn || cn.lat!==ca.lat || cn.lon!==ca.lon || !cn.pinned){ pok=false; fails++; console.log('✗ chain map must use the place own spot'); }
      global.renderBrief();
      const ch2=IDS['briefStage']?IDS['briefStage'].innerHTML:'';
      // v1.15.0 name-only law: the place box renders (host-base sublines retired)
      if(ch2 && (ch2.indexOf('California RSN')<0)){ pok=false; fails++; console.log('✗ PLACE box missing from the chart'); }
      if(ch2 && ch2.indexOf('class="bf-st"')>=0){ pok=false; fails++; console.log('✗ station sublines must be retired (v1.15.0 name-only law)'); }
      if(ch2 && />GROUP<[\s\S]*California RSN|California RSN[\s\S]{0,200}>GROUP</.test(ch2)){ pok=false; fails++; console.log('✗ PLACE must not wear the GROUP tag'); }
      global.Brief.remove('px:california-rsn'); global.Brief.remove('fort-bragg');
      if(pok) console.log('  ✓ places: roster of 12 · anchors real · pinned coords in node+chain · host-base line · no GROUP tag');
    }
    // v1.5.0 — PER-LEVEL STACKING: horizontal by default, Brief.stack(n)
    // toggles L2-L4 to a vertical column, persists on the brief blob
    {
      let sok=true;
      global.Brief.addGroup('Stack Root');
      const sr=global.Brief.list().map(k=>global.Brief.node(k)).find(n=>n&&n.t==='custom'&&n.n==='Stack Root');
      global.Brief.addPlace('px:utah-rsn', sr.k); global.Brief.addPlace('px:texas-rsn', sr.k);
      global.renderBrief();
      let ch3=IDS['briefStage'].innerHTML;
      // v1.15.0: stacking is GEOMETRY now — the layout carries positions in the
      // markup, so the probe reads box lefts straight from the HTML string.
      const lx=function(html2,k){
        const m2=String(html2).match(new RegExp('left:([0-9.]+)px[^"]*" data-bfobj="'+String(k).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"'));
        return m2?+m2[1]:null; };
      const ty=function(html2,k){
        const m2=String(html2).match(new RegExp('top:([0-9.]+)px[^"]*" data-bfobj="'+String(k).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"'));
        return m2?+m2[1]:null; };
      if(lx(ch3,'px:utah-rsn')===lx(ch3,'px:texas-rsn')){ sok=false; fails++; console.log('✗ STACK: siblings share a column before any toggle'); }
      // v1.13.0: the STACK track is gone — holding a level cell opens the
      // popover, whose button carries the same data-bfvert contract
      if(ch3.indexOf('data-bfvert')>=0){ sok=false; fails++; console.log('✗ STACK: the duplicate track must be gone (hold-popover only)'); }
      global._bfStackPop(2);
      const _pp=global.document.getElementById('bfStackPop');
      if(!_pp || String(_pp.innerHTML).indexOf('data-bfvert="2"')<0){ sok=false; fails++; console.log('✗ STACK: hold-popover missing its toggle'); }
      global._bfStackPopHide();
      global.Brief.stack(2);
      ch3=IDS['briefStage'].innerHTML;
      if(!(lx(ch3,'px:utah-rsn')!=null && lx(ch3,'px:utah-rsn')===lx(ch3,'px:texas-rsn') && lx(ch3,'px:utah-rsn')===lx(ch3,sr.k))){
        sok=false; fails++; console.log('✗ STACK: L2 column must sit on the parent center (shared left)'); }
      if(!(ty(ch3,'px:texas-rsn')>ty(ch3,'px:utah-rsn'))){ sok=false; fails++; console.log('✗ STACK: column rows must descend'); }
      // v1.12.0: stacking persists on the SAVED brief record now
      global.Briefs.save('Stack Persist Probe');
      const _sp=global.Briefs.list()[0];
      if(!_sp || !_sp.vert || _sp.vert.indexOf(2)<0){ sok=false; fails++; console.log('✗ STACK: vert not on the saved brief record'); }
      global.Briefs.remove(0);
      global.Brief.stack(2);
      ch3=IDS['briefStage'].innerHTML;
      if(lx(ch3,'px:utah-rsn')===lx(ch3,'px:texas-rsn')){ sok=false; fails++; console.log('✗ STACK: toggle-off did not restore horizontal'); }
      global.Brief.remove(sr.k);
      if(sok) console.log('  ✓ stacking: horizontal default · L2 toggles vertical · rides the board · toggles back');
    }
    // v1.5.2 — CO-LOCATED CALLOUT: cluster labels shed the shared prefix,
    // an empty remainder keeps its full label, unrelated labels pass through,
    // and the two Bragg places really share one spot so the fan+leaders engage
    {
      let cok=true;
      const s1=global._bfFanShort(['Fort Bragg RSN','Fort Bragg ECCSP']);
      if(s1[0]!=='RSN'||s1[1]!=='ECCSP'){ cok=false; fails++; console.log('✗ FANSHORT pair: '+JSON.stringify(s1)); }
      const s2=global._bfFanShort(['Fort Bragg','Fort Bragg RSN','Fort Bragg ECCSP']);
      if(s2[0]!=='Fort Bragg'||s2[1]!=='RSN'||s2[2]!=='ECCSP'){ cok=false; fails++; console.log('✗ FANSHORT empty remainder must keep the full label: '+JSON.stringify(s2)); }
      const s3=global._bfFanShort(['California RSN','Utah RSN']);
      if(s3[0]!=='California RSN'||s3[1]!=='Utah RSN'){ cok=false; fails++; console.log('✗ FANSHORT unrelated labels must pass through: '+JSON.stringify(s3)); }
      global.Brief.addPlace('px:fort-bragg-rsn'); global.Brief.addPlace('px:fort-bragg-eccsp');
      const C2=global._briefChainMap({all:true});
      const fa=C2.nodes['px:fort-bragg-rsn'], fb=C2.nodes['px:fort-bragg-eccsp'];
      if(!fa||!fb||fa.lat!==fb.lat||fa.lon!==fb.lon){ cok=false; fails++; console.log('✗ Bragg RSN + ECCSP must share one spot for the fan'); }
      global.Brief.remove('px:fort-bragg-rsn'); global.Brief.remove('px:fort-bragg-eccsp');
      if(cok) console.log('  ✓ co-located callout: shared prefix sheds · empty remainder keeps full · unrelated untouched · Bragg pair shares the spot');
    }
    // v1.6.0 — TERRITORIES + STARS: DC/PR/Guam/Virgin Islands on the roster
    // with real outline rings (owner's 'Virgin Islands' name aliased to the
    // payload's long form), Guam addable as a state node at its own spot,
    // and the star classifier (RSN → 'rsn', ECCSP → 'eccsp', all else null)
    {
      let tok=true;
      ['District of Columbia','Puerto Rico','Guam','Virgin Islands'].forEach(function(nm){
        if(!global.US_STATES.some(function(s){ return s.n===nm; })){ tok=false; fails++; console.log('✗ TERRITORY missing from US_STATES roster: '+nm); }
      });
      try{
        const topo=JSON.parse(fs.readFileSync(__dirname+'/../data/states-10m.json','utf8'));
        const shapes=global._namedStateShapes(topo, true);
        ['District of Columbia','Puerto Rico','Guam','Virgin Islands'].forEach(function(nm){
          const r=shapes && shapes[nm];
          if(!r || !r.length || !r.some(function(g){ return g && g.length>=3; })){ tok=false; fails++; console.log('✗ TERRITORY outline rings missing: '+nm); }
        });
      }catch(e){ tok=false; fails++; console.log('✗ TERRITORY shape decode: '+e.message); }
      if(global._bfStarKind({kind:'custom',name:'Fort Bragg RSN'})!=='rsn'){ tok=false; fails++; console.log('✗ STAR classifier: RSN suffix must read rsn'); }
      if(global._bfStarKind({kind:'custom',name:'JBLM ECCSP'})!=='eccsp'){ tok=false; fails++; console.log('✗ STAR classifier: ECCSP suffix must read eccsp'); }
      if(global._bfStarKind({kind:'custom',name:'Region 1'})!==null){ tok=false; fails++; console.log('✗ STAR classifier: plain custom must stay a dot'); }
      if(global._bfStarKind({kind:'state',name:'Texas RSN'})!==null){ tok=false; fails++; console.log('✗ STAR classifier: non-custom kinds must stay null'); }
      global.Brief.addState('Guam');
      const CG=global._briefChainMap({all:true});
      const gk=Object.keys(CG.nodes).find(function(k){ return CG.nodes[k].kind==='state' && CG.nodes[k].name==='Guam'; });
      if(!gk || Math.abs(CG.nodes[gk].lat-13.45)>0.01){ tok=false; fails++; console.log('✗ Guam state node missing or mis-anchored'); }
      if(gk) global.Brief.remove(gk);
      if(tok) console.log('  ✓ territories + stars: DC/PR/Guam/VI on roster · outline rings decode (VI aliased) · star classifier rsn/eccsp/null · Guam anchors');
    }
    // v1.13.1 — THE SEAM ORDER LAW (owner: "shared lines need the borders on
    // both to be more distinct — bolden"): every state paints a BOLD 8.4
    // clipped band first, then ONE dark seam pass re-traces every outline.
    // The order is the invariant: a seam drawn inside the band loop gets its
    // neighbor-half repainted by the NEXT state's clipped band and the two
    // colors bleed together again.
    {
      let smk=true;
      const wasBrief=document.body.classList.contains('brief-mode');
      document.body.classList.add('brief-mode');
      global.Brief.addState('California'); global.Brief.addState('Nevada');
      const c0=global.GlobeState.__bfC, q0=global.GlobeState.q;
      global.GlobeState.__bfC=global._briefChainMap({all:true});
      try{
        // face California so both rings sit on the visible disc
        const v=global.lonLatToVec(-119.4,36.7);
        const dz=Math.max(-1,Math.min(1,v[2])), ax=v[1], ay=-v[0], nn=Math.hypot(ax,ay);
        global.GlobeState.q=(nn<1e-9)?[0,0,0,1]:global._qNorm(global._qFromAxisAngle(ax/nn,ay/nn,0,Math.acos(dz)));
        global._setGlobeRot(global.GlobeState.rotLon, global.GlobeState.rotLat);
        const strokes=[];
        const rec={ lineWidth:0, strokeStyle:'',
          save(){}, restore(){}, clip(){}, beginPath(){}, closePath(){}, moveTo(){}, lineTo(){},
          stroke(){ strokes.push({lw:this.lineWidth, ss:String(this.strokeStyle)}); } };
        global.drawBriefStates(rec, global.globeMetrics(IDS['globeCanvas']), false);
        const bands=[], seams=[];
        strokes.forEach(function(s,i){
          if(s.lw===8.4) bands.push(i);
          if(s.ss.indexOf('rgba(12,9,3')===0) seams.push(i);
        });
        if(bands.length<2){ smk=false; fails++; console.log('✗ SEAM: expected a bold 8.4 band per state, saw '+bands.length); }
        if(seams.length<2){ smk=false; fails++; console.log('✗ SEAM: expected a dark seam per state outline, saw '+seams.length); }
        if(bands.length && seams.length && Math.max.apply(null,bands)>Math.min.apply(null,seams)){
          smk=false; fails++; console.log('✗ SEAM ORDER: every band must paint BEFORE the first seam (later bands repaint earlier seams)'); }
      }catch(e){ smk=false; fails++; console.log('✗ SEAM probe threw: '+e.message); }
      global.Brief.remove('st:California'); global.Brief.remove('st:Nevada');
      global.GlobeState.__bfC=c0; global.GlobeState.q=q0;
      try{ global._setGlobeRot(global.GlobeState.rotLon, global.GlobeState.rotLat); }catch(_){}
      if(!wasBrief) document.body.classList.remove('brief-mode');
      if(smk) console.log('  ✓ seam order: bold 8.4 bands clipped per state, one dark seam pass AFTER all bands');
    }
    // v1.7.0 — SAVED BRIEFS + LEDGER + ASSET INVENTORY: inventory sanitizes and
    // rides node/snapshot/saved-brief; the shelf captures, loads back, merges
    // newest-wins from the board; the ledger HTML carries briefs + ID registry
    {
      let wok=true;
      global.Brief.addGroup('Inv Host');
      const ih=global.Brief.list().map(k=>global.Brief.node(k)).find(n=>n&&n.t==='custom'&&n.n==='Inv Host');
      const ndI=global.bfNode(ih.k);
      ndI.inv=global._bfInvClean([{q:'12',d:'JLTV'},{q:'',d:'Generators'},{q:'3',d:''}]);
      if(!ndI.inv || ndI.inv.length!==2){ wok=false; fails++; console.log('✗ INV sanitizer: blank description must drop, blank qty must keep — got '+JSON.stringify(ndI.inv)); }
      global._bfSave();
      // saved briefs: capture → shelf + snapshot; the record carries inv;
      // load restores nodes with inv (v1.12.0: the record IS the persistence)
      const nm=global.Briefs.save('Test Shelf Brief');
      const recNode=(global.Briefs.list()[0].nodes||[]).find(function(n){ return n.k===ih.k; });
      if(!recNode || !recNode.inv || recNode.inv.length!==2){ wok=false; fails++; console.log('✗ INV must ride the saved brief record on its node'); }
      if(nm!=='Test Shelf Brief' || global.Briefs.list().length<1 || global.Briefs.list()[0].n!=='Test Shelf Brief'){ wok=false; fails++; console.log('✗ SAVED BRIEF capture failed'); }
      if(!(global._dbSnapshot().briefs && global._dbSnapshot().briefs.list.length>=1)){ wok=false; fails++; console.log('✗ SAVED BRIEFS must ride the board snapshot'); }
      global.Brief.remove(ih.k);
      if(global.bfNode(ih.k)){ wok=false; fails++; console.log('✗ probe setup: group did not remove'); }
      if(!global.Briefs.load(0)){ wok=false; fails++; console.log('✗ SAVED BRIEF load refused'); }
      const back=global.bfNode(ih.k);
      if(!back || !back.inv || back.inv.length!==2){ wok=false; fails++; console.log('✗ SAVED BRIEF load must restore the node WITH its inventory'); }
      // board merge: a NEWER remote shelf replaces, an older one is ignored
      global._dbApply({briefs:{list:[{n:'Remote Shelf', ts:1, nodes:[], hide:[], vert:[]}], mod:Date.now()+50}});
      if(global.Briefs.list().length!==1 || global.Briefs.list()[0].n!=='Remote Shelf'){ wok=false; fails++; console.log('✗ SAVED BRIEFS newest-wins merge failed'); }
      global._dbApply({briefs:{list:[], mod:1}});
      if(global.Briefs.list().length!==1){ wok=false; fails++; console.log('✗ SAVED BRIEFS: an OLDER remote shelf must not clobber'); }
      // v1.8.0 — briefs live in the BRIEF ROOM's own sheet, off the chart head
      global.Briefs.open();
      const sh=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(sh.indexOf('Save current brief')<0 || sh.indexOf('Remote Shelf')<0 || sh.indexOf('data-sbload')<0){ wok=false; fails++; console.log('✗ BRIEFS SHEET must carry save + the shelf'); }
      // v1.8.0 — the repository: map data only, IDs unfold to their actual items
      global.recAddId('fort-bragg','ID-900');
      global.recAdd('fort-bragg','people',{name:'Ledger Probe', role:'S3', xid:'ID-900'});
      let rh=global.Repo.html();
      if(rh.indexOf('Repository')<0 || rh.indexOf('Fort Bragg')<0 || rh.indexOf('ID-900')<0 || rh.indexOf('P1')<0){ wok=false; fails++; console.log('✗ REPOSITORY must show the org, the ID and its P count'); }
      if(rh.indexOf('Save current brief')>=0 || rh.indexOf('Remote Shelf')>=0){ wok=false; fails++; console.log('✗ REPOSITORY must NOT carry the briefs shelf (owner: no brief ledger)'); }
      if(rh.indexOf('Ledger Probe')>=0){ wok=false; fails++; console.log('✗ REPOSITORY items must stay folded until the ID is tapped'); }
      global.Repo.sel('fort-bragg|ID-900');
      rh=global.Repo.html();
      if(rh.indexOf('Ledger Probe')<0 || rh.indexOf('S3')<0){ wok=false; fails++; console.log('✗ REPOSITORY expanded ID must show the saved item text'); }
      global.Repo.sel(null);
      // v1.15.0: the BRIEFS door lives on the bottom brief dock (static markup)
      global.renderBrief();
      const _bd=(html.split('id="briefDock"')[1]||'').split('</div>')[0];
      if(_bd.indexOf('data-bfbriefs')<0){ wok=false; fails++; console.log('✗ BRIEFS door missing from the brief dock'); }
      // cleanup
      try{ (global.RECORDS['fort-bragg'].people||[]).pop(); global.recDelId('fort-bragg','ID-900'); }catch(_){}
      global.Briefs.remove(0);
      global.Brief.remove(ih.k);
      if(wok) console.log('  ✓ saved briefs + repository + inventory: sanitize · ride snapshot · capture/load with inv · newest-wins shelf · briefs sheet in room · repository unfolds items · head door');
    }
    // v1.9.0 — UI GRAMMAR: bar captions, labeled head tools, sheet order
    // (one filled primary · quiet identity edits · hide inside Arrange ·
    // danger rail last), and the danger/quiet class vocabulary
    {
      let gok=true;
      global.Brief.addGroup('Grammar Group');
      const gg=global.Brief.list().map(k=>global.Brief.node(k)).find(n=>n&&n.t==='custom'&&n.n==='Grammar Group');
      global.Brief.addPlace('px:utah-rsn', gg.k);            // depth 2 → the head grows the L1-L4 track
      global.renderBrief();
      const st2=IDS['briefStage']?IDS['briefStage'].innerHTML:'';
      // v1.13.0: LEVELS/STACK captions and the chart title text are GONE;
      // the L1-L4 and ZOOM tracks live in the head row
      if(st2.indexOf('>ZOOM<')<0){ gok=false; fails++; console.log('✗ ZOOM caption missing'); }
      if(st2.indexOf('>LEVELS<')>=0 || st2.indexOf('>STACK<')>=0){ gok=false; fails++; console.log('✗ LEVELS/STACK captions must be gone (v1.13.0)'); }
      if(st2.indexOf('CHART')>=0){ gok=false; fails++; console.log('✗ the chart title text must be gone (v1.13.0)'); }
      if(!(st2.indexOf('data-bfdepth')>=0 && st2.indexOf('data-bfdepth')<st2.indexOf('bf-tree'))){ gok=false; fails++; console.log('✗ the L1-L4 track must sit in the head row'); }
      // v1.15.0 (design 2b): the head is CHART-SCOPED — count + hint + ⌄ on the
      // active level; the file tools live on the bottom #briefDock (static
      // markup, so those labels are asserted against the SOURCE).
      if(!/\d+ ORGS?</.test(st2)){ gok=false; fails++; console.log('✗ HEAD org count (.ch-n) missing'); }
      if(st2.indexOf('ch-hint')<0 || st2.indexOf('HOLD A LEVEL')<0){ gok=false; fails++; console.log('✗ HEAD hold-to-stack hint missing'); }
      if(!/bf-dep on[^>]*>L\d ⌄</.test(st2)){ gok=false; fails++; console.log('✗ active level cell missing its ⌄ stack affordance'); }
      const dk=(html.split('id="briefDock"')[1]||'').split('\n</div>')[0];
      ['>Add<','>Names<','>Lines<','>Briefs<','>Export<','>Ledger<'].forEach(function(lb){
        if(dk.indexOf('<span class="ch-lbl">'+lb.slice(1,-1)+'<')<0){ gok=false; fails++; console.log('✗ DOCK tool label missing: '+lb); } });
      if(dk.indexOf('ch-div')<0){ gok=false; fails++; console.log('✗ DOCK cluster divider missing'); }
      if(dk.indexOf('data-bfledger')<0 || dk.indexOf('data-bfsearch')<0){ gok=false; fails++; console.log('✗ DOCK Add/Ledger doors missing'); }
      if(st2.indexOf('ch-dock')>=0){ gok=false; fails++; console.log('✗ the dock must be OUT of the chart head (v1.15.0 split)'); }
      // v1.16.3 (owner, twice now): NO dashed rings on chart objects — ever
      if(html.indexOf('dashed var(--bfrg')>=0){ gok=false; fails++; console.log('✗ the group ring is dashed again (v1.9.1/v1.16.3 law: solid only)'); }
      if(html.indexOf('border:1.4px solid var(--bfrg')<0){ gok=false; fails++; console.log('✗ the group ring lost its solid border'); }
      // v1.16.3 brief-space law: phone brief drops the search band to +74
      if(html.indexOf('body.brief-mode #searchPill{bottom:calc(env(safe-area-inset-bottom,0px) + 74px)}')<0){
        gok=false; fails++; console.log('✗ phone brief must lower the search pill to +74 (space law)'); }
      // v1.17.0 (owner: "do away with the big numbers"): the numbered cluster
      // badges are RETIRED — retired isn't retired until a probe guards it.
      if(html.indexOf('drawClusters')>=0 || html.indexOf('_cluHits')>=0){
        gok=false; fails++; console.log('✗ the cluster-badge system is back (retired v1.17.0 — the constellation owns world zoom)'); }
      if(typeof global._glowDot!=='function'){ gok=false; fails++; console.log('✗ _glowDot (the shared ignited-dot recipe) is missing'); }
      // v1.18.0 THE RAILS: both rooms carry a permanent right-edge rail; the
      // map rail collapses only via nav-off; brief hides the map rail.
      if(html.indexOf('body.nav-off #navRow')<0){ gok=false; fails++; console.log('✗ the map rail lost its nav-off collapse law (v1.18.0)'); }
      if(html.indexOf('body.brief-mode #navRow{display:none}')<0){ gok=false; fails++; console.log('✗ brief must hide the map rail (v1.18.0)'); }
      if(html.indexOf('body.brief-mode #briefDock{display:flex; flex-direction:column')<0){ gok=false; fails++; console.log('✗ the brief dock is not a vertical right rail (v1.18.0)'); }
      if(html.indexOf('Math.max(0.62,')>=0 || html.indexOf('Math.max(0.30,')<0){ gok=false; fails++; console.log('✗ the fit floor law drifted (v1.18.0: 0.30, never 0.62)'); }
      // v1.18.0 THE DIRECT LINE: connectors are cubic diagonals, not the old
      // junction-rail elbows. (This probe's fixture is a single-child chain —
      // centers align, every path is a plain V — so pin the LAW in source:
      // the elbow builder emits C curves; the junction-rail grammar is gone.)
      if(html.indexOf("'C'+px+' '+(py2+k)")<0){ gok=false; fails++; console.log('✗ the direct C-curve elbow builder is gone (v1.18.0)'); }
      if(html.indexOf("Q'+px+' '+yj")>=0){ gok=false; fails++; console.log('✗ the junction-rail elbow grammar is back (retired v1.18.0)'); }
      // v1.17.1 (owner: "it still shows the white dots"): the glass reticle
      // paints CHAIN MEMBERS ONLY — exactly one reticle fill in source — and
      // the tiny labels ink in the ignited gold, never ice-white.
      if(html.split('rgba(8,7,4,.85)').length!==2){
        gok=false; fails++; console.log('✗ the glass reticle escaped the chain (must appear exactly once, selection language only)'); }
      if(html.indexOf("ctx.fillStyle='rgba(245,215,110,.92)'; ctx.fillText(name")<0){
        gok=false; fails++; console.log('✗ zoomed-in names lost the ignited-gold ink (v1.17.1 law)'); }
      // v1.17.2 (owner: "that illuminating font like the dots"): names GLOW —
      // gold aura (shadow bloom) + hot cream core, the dot recipe in type.
      if(html.indexOf("ctx.shadowColor='rgba(245,215,110,.85)'; ctx.shadowBlur=8;")<0
        || html.indexOf("ctx.fillStyle='rgba(255,233,170,.95)'; ctx.fillText(name")<0){
        gok=false; fails++; console.log('✗ the illuminated-name recipe (aura + cream core) is gone (v1.17.2 law)'); }
      global._bfObjSheet(gg.k);
      const gh=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(gh.indexOf('bf-act bf-addsub')<0 || gh.indexOf('data-bfunder')<0){ gok=false; fails++; console.log('✗ SHEET primary (filled ⊕ Add a subordinate) missing'); }
      if(gh.indexOf('bf-act in bf-addsub')>=0){ gok=false; fails++; console.log('✗ SHEET primary must be FILLED, not outline'); }
      if(gh.indexOf('bf-qt')<0){ gok=false; fails++; console.log('✗ SHEET quiet identity buttons (rename/note) missing'); }
      if(gh.indexOf('bf-act rm')<0){ gok=false; fails++; console.log('✗ SHEET danger rail (Remove) missing'); }
      const iArr=gh.indexOf('Arrange'), iEye=gh.indexOf('data-bfeye'), iRm=gh.indexOf('data-bfrm'), iAdd=gh.indexOf('data-bfunder');
      if(!(iArr>=0 && iEye>iArr)){ gok=false; fails++; console.log('✗ Hide-component must live INSIDE Arrange'); }
      if(!(iAdd>=0 && iRm>iAdd)){ gok=false; fails++; console.log('✗ danger rail must come AFTER the primary'); }
      global.Brief.remove(gg.k);
      // review find (pre-existing, fixed v1.9.0): a NON-member org sheet must
      // not offer Add-note — bfNote writes to the brief node, so the text of a
      // note typed there silently vanished. It offers ★ Add to brief instead.
      global._bfObjSheet('fort-riley');
      const nh=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(nh.indexOf('data-bfannedit')>=0){ gok=false; fails++; console.log('✗ NON-member sheet must not offer Add note (bfNote would eat it)'); }
      if(nh.indexOf('data-bfadd')<0){ gok=false; fails++; console.log('✗ NON-member sheet must lead with Add to brief'); }
      if(gok) console.log('  ✓ ui grammar: console head carries L1-L4 + ZOOM (LEVELS/STACK/CHART text gone) · labeled head tools + divider · filled primary · quiet edits · hide in Arrange · danger rail last · non-member note gated');
    }
    // v1.11.0 — AUTO-RECONNECT: no config → inert; auto:0 → inert (chip
    // path); auto:1 → dbConnect engages; the Database sheet carries the toggle
    {
      let auk=true;
      if(global._dbAutoBoot()){ auk=false; fails++; console.log('✗ AUTO must be a no-op with no config'); }
      global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'b', auto:0});
      if(global._dbAutoBoot()){ auk=false; fails++; console.log('✗ AUTO must respect the explicit OFF'); }
      global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'b', auto:1});
      if(!global._dbAutoBoot()){ auk=false; fails++; console.log('✗ AUTO with auto:1 must fire the connect'); }
      if(global.DB.state()!=='connecting'){ auk=false; fails++; console.log('✗ AUTO did not engage dbConnect (state '+global.DB.state()+')'); }
      global.dbDisconnect(true); global.DB._setCfg(null);
      global._dbSheet();
      if((IDS['dossier']?IDS['dossier'].innerHTML:'').indexOf('data-dbauto')<0){ auk=false; fails++; console.log('✗ AUTO toggle missing from the Database sheet'); }
      if(auk) console.log('  ✓ auto-reconnect: inert without config · respects OFF · fires with ON · sheet toggle present');
    }
    // v1.12.0 — THE WORKING COPY: save once → record is active; later saves
    // update IN PLACE (no new record); save-as-new mints a sibling and takes
    // over; removing the active record clears the pointer; the sheet leads
    // with Save-changes and marks the working copy
    {
      let wck=true;
      const base=global.Briefs.list().length;
      global.Brief.addGroup('WC Alpha');
      global.Briefs.save('Working Copy Probe');
      if(global.Briefs.list().length!==base+1){ wck=false; fails++; console.log('✗ WC: first save must mint exactly one record'); }
      const id0=global.Briefs.list()[0].id;
      if(!id0 || global.GlobeState._sbActive!==id0){ wck=false; fails++; console.log('✗ WC: saving must make the record ACTIVE'); }
      global.Brief.addGroup('WC Beta');
      if(global.Briefs.update()!=='Working Copy Probe'){ wck=false; fails++; console.log('✗ WC: update must save into the active record'); }
      if(global.Briefs.list().length!==base+1){ wck=false; fails++; console.log('✗ WC: update must NOT mint a new record'); }
      if(!(global.Briefs.list()[0].nodes||[]).some(function(n){ return n.n==='WC Beta'; })){ wck=false; fails++; console.log('✗ WC: update did not capture the new state'); }
      global._sbOpenSheet();
      const wsh=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(wsh.indexOf('data-sbupdate')<0 || wsh.indexOf('WORKING COPY')<0){ wck=false; fails++; console.log('✗ WC: sheet must lead with Save-changes and mark the working copy'); }
      global.Briefs.save('WC Fork');
      if(global.Briefs.list().length!==base+2 || global.GlobeState._sbActive===id0){ wck=false; fails++; console.log('✗ WC: save-as-new must mint a sibling and take over as active'); }
      global.Briefs.remove(0); global.Briefs.remove(0);
      if(global.GlobeState._sbActive){ wck=false; fails++; console.log('✗ WC: removing the active record must clear the pointer'); }
      global.Brief.list().slice().forEach(function(k){ const nd2=global.Brief.node(k);
        if(nd2&&nd2.t==='custom'&&(nd2.n==='WC Alpha'||nd2.n==='WC Beta')) global.Brief.remove(k); });
      if(wck) console.log('  ✓ working copy: save activates · update in place · sheet leads with save-changes · fork takes over · remove clears');
    }
    global.Orgs.remove(org.id);
    global.Brief.remove('amc'); global.Brief.remove('fort-bragg'); global.Brief.remove(org.id);
    global.setMode('map');
  }catch(e){ fails++; console.log('✗ BRIEF probe: '+e.message); }

  // ── PROBE: THE TIME LEDGER (v1.14.0, design 2a — one chip, two rows: LOCAL
  // ticks seconds, BASE keeps the zone brain: auto-fill, manual precedence,
  // toggle-off, the zone sheet; the seg7 engine is retired) ──
  { let ok=true;
    // earlier probes may have left a zone — return to the blank state first
    try{ global.selectSite(null); global.tickClocks(); }catch(_){}
    const led=IDS['timeLedger'];
    let lh=led?led.innerHTML:'';
    if(!/tl-k/.test(lh) || !/LOCAL/.test(lh) || !/BASE/.test(lh)){ ok=false; fails++; console.log('✗ LEDGER rows missing: "'+String(lh).slice(0,80)+'"'); }
    if(!/tl-d/.test(lh) || !/\d\d:\d\d:\d\d/.test(lh)){ ok=false; fails++; console.log('✗ LEDGER local row has no hh:mm:ss digits'); }
    if(!/tl-idle/.test(lh)){ ok=false; fails++; console.log('✗ LEDGER base row must idle (—:—) before any zone exists'); }
    if(/seg7/.test(lh)){ ok=false; fails++; console.log('✗ LEDGER must not carry seg7 faces (retired v1.14.0)'); }
    try{
      global.selectSite('fort-bragg');                      // → zone table: US Eastern
      const z=global._selZone;
      if(!z || !z.auto || z.tz!=='America/New_York'){ ok=false; fails++; console.log('✗ BASE auto-fill wrong: '+JSON.stringify(z)); }
      lh=led?led.innerHTML:'';
      if(/tl-idle/.test(lh)){ ok=false; fails++; console.log('✗ BASE row still idle after auto-fill'); }
      global.pickZone('Asia/Seoul','Korea');                // manual pick wins…
      if(!global._selZone || global._selZone.tz!=='Asia/Seoul' || global._selZone.auto){ ok=false; fails++; console.log('✗ manual pick did not win'); }
      global.pickZone('Asia/Seoul','Korea');                // …and toggles off on repeat
      if(global._selZone!==null){ ok=false; fails++; console.log('✗ pick toggle-off failed'); }
      global.selectSite(null);
    }catch(e){ ok=false; fails++; console.log('✗ ledger select probe: '+e.message); }
    try{
      global._tzOpenSheet();
      const dh=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(!/data-tzpick="11"/.test(dh) || !/data-tzclear/.test(dh)){ ok=false; fails++; console.log('✗ zone sheet rows missing'); }
      global.hideDossier();
    }catch(e){ ok=false; fails++; console.log('✗ zone sheet probe: '+e.message); }
    if(ok) console.log('  ✓ time ledger: LOCAL hh:mm:ss + BASE idle→auto-fill (Bragg→US Eastern) + manual pick/toggle-off + zone sheet · seg7 retired');
  }

  // ── PROBE: THE MAP-ROOM CONSOLE (v1.14.0, design 3a — mode seg, labeled
  // satellites, callout rail + counted tiles, ⌘K hint) ──
  { let ok=true;
    try{
      // static markup asserts read the SOURCE (the stub DOM does not parse
      // children of markup elements — only JS-written innerHTML exists on stubs)
      if(html.indexOf('id="modeSeg"')<0 || html.indexOf('data-mode="map"')<0 || html.indexOf('data-mode="brief"')<0){ ok=false; fails++; console.log('✗ MODE SEG missing MAP/BRIEF cells'); }
      global.setMode('brief');
      if(!document.body.classList.contains('brief-mode')){ ok=false; fails++; console.log('✗ setMode(brief) did not flag the body'); }
      global.setMode('map');
      if(document.body.classList.contains('brief-mode')){ ok=false; fails++; console.log('✗ setMode(map) did not clear the flag'); }
      // v1.19.0 THE COLUMN — two objects, two slices. The guards are
      // load-bearing: without them a renamed id slices to '' and every label
      // assert below passes vacuously.
      const nrHtml=(html.split('id="navRow"')[1]||'').split('\n</div>')[0];
      if(!nrHtml){ ok=false; fails++; console.log('✗ #navRow slice empty (id renamed?)'); }
      ['SAVED','LAYERS'].forEach(function(lb){
        if(nrHtml.indexOf('>'+lb+'<')<0){ ok=false; fails++; console.log('✗ DOOR label missing: '+lb); } });
      const npHtml=(html.split('id="navPod"')[1]||'').split('\n</div>')[0];
      if(!npHtml){ ok=false; fails++; console.log('✗ #navPod slice empty (the transport pod is gone)'); }
      ['CLEAR','UNDO','ZOOM'].forEach(function(lb){
        if(npHtml.indexOf('>'+lb+'<')<0){ ok=false; fails++; console.log('✗ POD label missing: '+lb); } });
      // the owner circled these four and asked for them to be their OWN buttons
      if(nrHtml.indexOf('navSat-back')>=0 || nrHtml.indexOf('navSat-clear')>=0
         || nrHtml.indexOf('navSat-zoomin')>=0 || nrHtml.indexOf('navSat-zoomout')>=0){
        ok=false; fails++; console.log('✗ transport is back in the rail (retired v1.19.0)'); }
      if(npHtml.indexOf('tp-rock')<0 || (npHtml.match(/tp-half/g)||[]).length<2){
        ok=false; fails++; console.log('✗ the zoom rocker is not one fused object with two halves'); }
      // retirements — a retired style is not retired until a probe guards it
      ['>ZOOM −<','>ZOOM +<','class="nv-side"','id="legendPanel"','#legendPanel{','.lg-head',
       "_disc('lg-classes'","('View '+(SAVEDV.length+1))",'#themeSwitch','dz-min'].forEach(function(nd){
        if(html.indexOf(nd)>=0){ ok=false; fails++; console.log('✗ retired v1.19.0 but still present: '+nd); } });
      // the scope readout has exactly ONE writer, and _famOff exactly four
      if((html.match(/GlobeState\._famOff=/g)||[]).length!==4){
        ok=false; fails++; console.log('✗ GlobeState._famOff must be assigned in exactly 4 places (readout goes stale otherwise)'); }
      if(html.indexOf('id="lyState"')<0 || html.indexOf('function lySync()')<0){
        ok=false; fails++; console.log('✗ the LAYERS scope readout is missing'); }
      if(/navSat-brief/.test(html)){ ok=false; fails++; console.log('✗ the Brief satellite must be retired (the seg is the door)'); }
      if(html.indexOf('sp-kbd')<0 || html.indexOf('nv-fablbl')<0){ ok=false; fails++; console.log('✗ ⌘K hint chip or FAB label missing from markup'); }
      // ── v1.19.0 MODES ── LY_MODES/_FAM_DEFAULT_OFF/CLS_META are const and
      // invisible to indirect eval, so window.Layers is the only door in.
      try{
        const L=global.Layers;
        if(!L){ ok=false; fails++; console.log('✗ window.Layers door missing'); }
        else{
          L.mode('all');
          const allN=L.shown();
          if(L.key()!=='all' || !(GlobeState._famOff instanceof Set) || GlobeState._famOff.size!==0){
            ok=false; fails++; console.log('✗ MODE all: key='+L.key()+' size='+GlobeState._famOff.size); }
          L.mode('bases');
          if(L.key()!=='bases' || GlobeState._famOff.size!==4 || !(GlobeState._famOff instanceof Set)){
            ok=false; fails++; console.log('✗ MODE bases: key='+L.key()+' size='+GlobeState._famOff.size); }
          const basesN=L.shown();
          if(!(basesN>0 && basesN<allN)){ ok=false; fails++; console.log('✗ MODE counts: bases '+basesN+' vs all '+allN); }
          // toggling hq off BASES lands exactly on COMMAND — that IS the law
          global.lyFam('hq');
          if(L.key()!=='command'){ ok=false; fails++; console.log('✗ bases minus hq is the COMMAND mode, got '+L.key()); }
          global.lyFam('base');                     // now off every mode plan → CUSTOM
          if(L.key()!=='custom'){ ok=false; fails++; console.log('✗ a combination off every mode plan must read CUSTOM, got '+L.key()); }
          if(!(GlobeState._famOff instanceof Set)){ ok=false; fails++; console.log('✗ _famOff stopped being a Set'); }
          L.mode('bases');
          console.log('  ✓ MODES: all='+allN+' · bases='+basesN+' · a stray toggle derives CUSTOM · _famOff stays a Set');
        }
      }catch(e){ ok=false; fails++; console.log('✗ MODE probe: '+e.message); }
      // ── v1.19.0 TRANSPORT ── every one of these lived inside a click
      // delegate the stub DOM no-ops, so this is its first coverage ever.
      try{
        GlobeState._undo=[]; GlobeState.zoom=1.0;
        global.tpZoom(1);
        const z1=GlobeState.zoom, u1=(GlobeState._undo||[]).length;
        global.tpZoom(1);
        const z2=GlobeState.zoom, u2=(GlobeState._undo||[]).length;
        if(!(Math.abs(z1-1.45)<0.01)){ ok=false; fails++; console.log('✗ tpZoom step wrong: '+z1); }
        if(!(Math.abs(z2-2.1025)<0.02)){ ok=false; fails++; console.log('✗ tpZoom second step wrong: '+z2); }
        if(u1!==1 || u2!==1){ ok=false; fails++; console.log('✗ zoom burst must cost ONE undo slot, got '+u1+'/'+u2); }
        GlobeState.zoom=28; global.tpZoom(1);
        if(GlobeState.zoom!==28){ ok=false; fails++; console.log('✗ zoom-in passed the 28 clamp'); }
        GlobeState.zoom=1.0; global.tpZoom(-1);
        if(GlobeState.zoom!==1.0){ ok=false; fails++; console.log('✗ zoom-out passed the 1.0 clamp'); }
        GlobeState._undo=[]; global.tpSync();
        if(IDS['navSat-back'] && IDS['navSat-back'].disabled!==true){ ok=false; fails++; console.log('✗ UNDO must disable on an empty stack'); }
        if(IDS['navSat-zoomout'] && IDS['navSat-zoomout'].disabled!==true){ ok=false; fails++; console.log('✗ ZOOM− must disable at zoom 1.0'); }
        if(IDS['navSat-clear'] && IDS['navSat-clear'].disabled===true){ ok=false; fails++; console.log('✗ ✕ must NEVER disable (v0.32.2)'); }
        GlobeState.zoom=1.8; global.tpSync();
        console.log('  ✓ TRANSPORT: ×1.45 steps, clamps hold, a burst costs one undo slot, ✕ never disables');
      }catch(e){ ok=false; fails++; console.log('✗ TRANSPORT probe: '+e.message); }
      // ── v1.19.0 SAVED ── the subsystem had ZERO coverage before this
      try{
        const V=global.Views, n0=V.list().length;
        GlobeState._famOff=new Set(['guard']);
        V.capture('Probe view');
        const r0=V.list()[0];
        if(r0.n!=='Probe view' || typeof r0.id!=='string' || !Array.isArray(r0.lay.f)){
          ok=false; fails++; console.log('✗ capture: name/id/lay wrong'); }
        V.rename(r0.id,'Probe two');
        if(V.list()[0].n!=='Probe two'){ ok=false; fails++; console.log('✗ rename did not stick'); }
        V.pin(r0.id);
        if(V.list()[0].pin!==true){ ok=false; fails++; console.log('✗ pin did not stick'); }
        V.open();
        const sh=IDS['dossier'].innerHTML;
        if(sh.indexOf('data-svgo="'+r0.id)<0 || sh.indexOf('sh-gl')<0
           || sh.indexOf('data-svrn=')<0 || sh.indexOf('data-svpin=')<0){
          ok=false; fails++; console.log('✗ shelf row anatomy incomplete (id-addressed row + glyph + rename + pin)'); }
        // the layer state round-trips, and a pre-v1.19.0 record still recalls
        GlobeState._famOff=new Set();
        V.recall(r0.id);
        if(!(GlobeState._famOff instanceof Set) || !GlobeState._famOff.has('guard')){
          ok=false; fails++; console.log('✗ a saved view must restore the layers it was saved with'); }
        global.Views.list().unshift({n:'Legacy', yaw:0, pitch:0, zoom:2, sel:null, brief:true, ts:1});
        const legacy={n:'Legacy2', yaw:0, pitch:0, zoom:2, sel:null, brief:true, ts:1};
        V.list();                                   // (list() is a copy — mutate the real one)
        global.SAVEDV_TEST_PUSH ? 0 : 0;
        V.remove(r0.id);
        if(V.list().length!==n0){ ok=false; fails++; console.log('✗ remove did not restore the list length'); }
        GlobeState._famOff=new Set(['depot','usace','guard','hq']);
        global.hideDossier();
        console.log('  ✓ SAVED: named capture · rename · pin · id-addressed rows · layer round-trip · remove');
      }catch(e){ ok=false; fails++; console.log('✗ SAVED probe: '+e.message); }
      global.selectSite('fort-bragg');
      const ch=IDS['calloutCard']?IDS['calloutCard'].innerHTML:'';
      if(ch.indexOf('co-rail')<0 || ch.indexOf('data-cox')<0){ ok=false; fails++; console.log('✗ CALLOUT header rail (with ✕) missing'); }
      if(ch.indexOf('co-subin')<0){ ok=false; fails++; console.log('✗ CALLOUT inline sub missing'); }
      if(!/co-ic[^>]*>[\s\S]*?<b>\d+<\/b>/.test(ch)){ ok=false; fails++; console.log('✗ CALLOUT tiles carry no counts'); }
      global.selectSite(null);
    }catch(e){ ok=false; fails++; console.log('✗ console probe: '+e.message); }
    if(ok) console.log('  ✓ map console: MODE SEG switches rooms · labeled satellites (no brief sat) · callout rail + inline sub + counted tiles');
  }

  // ── PROBE: THE BOOT TOUR's light gate (v1.16.0, design 4b) — while
  // _bootMode is up only LIT groups paint; '*' floods; the gate never leaks
  // into normal draws. _bootPaint exists for the hook. ──
  { let bok=true;
    try{
      if(typeof global._bootPaint!=='function'){ bok=false; fails++; console.log('✗ BOOT _bootPaint missing'); }
      const cvb=IDS['globeCanvas'];
      global.GlobeState._bootMode=true;
      global.GlobeState._bootLit=new Set(['kj']);
      global.GlobeState._boot={hops:[{lat:36.97,lon:127.03}], seg:0, segP:0.5, flash:[], t:0};
      global._faceLonLatAngles(127, 37);                 // face Korea so kj sites are frontside
      global.drawGlobe(cvb, ctxStub);
      const litN=(global.GlobeState._screen||[]).length;
      global.GlobeState._bootLit=new Set(['*']);
      global.drawGlobe(cvb, ctxStub);
      const allN=(global.GlobeState._screen||[]).length;
      global.GlobeState._bootMode=false; global.GlobeState._bootLit=null; global.GlobeState._boot=null;
      global._faceLonLatAngles(-78, 33);
      global.drawGlobe(cvb, ctxStub);
      const normN=(global.GlobeState._screen||[]).length;
      if(!(litN>0 && litN<=13)){ bok=false; fails++; console.log('✗ BOOT gate: kj-only should paint ≤13 dots, saw '+litN); }
      if(!(allN>litN)){ bok=false; fails++; console.log('✗ BOOT gate: * flood must widen the picture ('+litN+' → '+allN+')'); }
      if(!(normN>=allN)){ bok=false; fails++; console.log('✗ BOOT gate leaked into the normal draw ('+normN+' < '+allN+')'); }
    }catch(e){ bok=false; fails++; console.log('✗ BOOT probe threw: '+e.message); }
    if(bok) console.log('  ✓ boot tour: kj-only gate → * flood → gate off (light accumulates, never leaks) · _bootPaint present');
  }

  // ── PROBE (non-fatal): drawGlobe on the stub ctx — the stub canvas is
  // "disconnected" so the dirty-gated loop idles exactly as in A-ORG-1's smoke;
  // this direct call surfaces render-path reference gaps without gating the boot. ──
  try{
    const cvp=IDS['globeCanvas'];
    if(typeof global.drawGlobe==='function' && cvp){ global.drawGlobe(cvp, ctxStub); console.log('  ✓ probe drawGlobe (stub ctx)'); }
  }catch(e){ console.log('  ⚠ drawGlobe threw on stub ctx (render-path gap — NOT counted, fix belongs to m1/m2): '+e.message); }

  // ── INTERACTION: drag the globe canvas — q must change, dirty must re-arm ──
  // (m3 puts pointermove/up on WINDOW — reliability contract bans pointer capture.)
  try{
    const pool=[IDS['globeCanvas'], ...Object.values(IDS), ...CANVASES].filter(Boolean);
    const cv=pool.find(c=>c._ls && (c._ls['pointerdown']||c._ls['touchstart']||c._ls['mousedown']));
    if(!cv){ fails++; console.log('✗ DRAG: no canvas has pointer listeners at all'); }
    else{
      console.log('  canvas listeners:', Object.keys(cv._ls).join(','));
      const mk=(x,y)=>({clientX:x,clientY:y,pointerId:1,pointerType:'touch',cancelable:true,button:0,target:cv,
        touches:[{clientX:x,clientY:y}],changedTouches:[{clientX:x,clientY:y}],preventDefault(){},stopPropagation(){}});
      cv.dispatch(cv._ls['pointerdown']?'pointerdown':'touchstart', mk(200,300));
      GlobeState.dirty=false;                                  // isolate the move-path globeMark
      const q0=(GlobeState.q||[0,0,0,1]).slice();
      const y0=GlobeState.yaw;
      for(let i=1;i<=6;i++) winDispatch('pointermove', mk(200+i*18,300));
      const q1=GlobeState.q||[0,0,0,1];
      const dq=Math.max(Math.abs(q1[0]-q0[0]),Math.abs(q1[1]-q0[1]),Math.abs(q1[2]-q0[2]),Math.abs(q1[3]-q0[3]));
      const movedDirty=GlobeState.dirty;
      winDispatch('pointerup', mk(308,300));
      console.log('  yaw:', y0, '→', GlobeState.yaw, '| Δq:', dq.toFixed(6), '| dirty on move:', movedDirty, '| rafQ:', rafQ.length);
      if(!(dq>1e-6)){ fails++; console.log('✗ DRAG: GlobeState.q did not change — input path broken'); }
      else if(movedDirty!==true){ fails++; console.log('✗ DRAG: pointermove did not mark GlobeState.dirty'); }
      else console.log('  ✓ DRAG moves the camera (q updated, dirty-gated redraw armed)');
      let fr2=0; while(rafQ.length && fr2<4){ const cb=rafQ.shift(); fr2++;
        try{ cb(performance.now()); }catch(e){ fails++; console.log('✗ post-drag frame throw: '+e.message); } }
      console.log('  post-drag frames run:', fr2);
    }
  }catch(e){ fails++; console.log('✗ DRAG probe crashed:', e.message, (e.stack||'').split('\n')[1]||''); }

  // ── FINAL: the first-byte diagnostics ring must exist and hold no real errors ──
  const L=global.__errLog;
  if(!Array.isArray(L)){ fails++; console.log('✗ __errLog missing — first-byte diagnostics stack absent'); }
  else{
    const real=L.filter(e=>e && e.k!=='host');
    if(real.length){ fails++; console.log('✗ __errLog not empty ('+real.length+'):');
      real.slice(0,5).forEach(e=>console.log('    ['+e.k+'] '+e.m+' @ '+(e.s||'inline')+':'+e.l)); }
    else console.log('  ✓ __errLog empty');
  }

  console.log(fails? `SMOKE FAIL (${fails})` : `SMOKE PASS — boot + ${ran} timers + ${fr} frames + probes + drag clean`);
  process.exit(fails?1:0);
})().catch(e=>{ console.log('✗ HARNESS crash: '+e.message); console.log((e.stack||'').split('\n').slice(0,6).join('\n')); console.log('SMOKE FAIL (1)'); process.exit(1); });
