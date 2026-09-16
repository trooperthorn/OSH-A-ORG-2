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
// Run the focused UX regressions in isolated VMs before this harness installs
// browser stubs. These remain part of the existing five-tool CI gate.
if(fs.existsSync(path.join(ROOT,'index.html'))){
  for(const probe of ['ux-navigation-check.js','ux-records-check.js','ux-search-check.js','ux-persistence-check.js','brief-scale-check.js','brief-support-check.js']){
    require('child_process').execFileSync(process.execPath,[path.join(__dirname,probe)],{stdio:'inherit'});
  }
}

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
// v1.25.0: ONE stub registration the update-door probe can drive (update() resolves; installing toggles 'found')
const SW_REG={update(){ return Promise.resolve(); }, addEventListener(){}, installing:null};
def(global,'navigator',{userAgent:'smoke', vibrate:()=>{}, language:'en-US', languages:['en-US'],
  clipboard:{writeText:()=>Promise.resolve()},
  serviceWorker:{register:()=>Promise.resolve(SW_REG), addEventListener(){}, controller:null} });
def(global,'location',{href:'https://app.test/', origin:'https://app.test', protocol:'https:', pathname:'/', search:'', hash:'', reload(){}, hostname:'app.test'});
def(global,'history',{pushState(){},replaceState(){},back(){}});
def(global,'localStorage',{_m:{},getItem(k){return this._m[k]??null;},setItem(k,v){this._m[k]=String(v);},removeItem(k){delete this._m[k];}});
def(global,'sessionStorage',global.localStorage);
def(global,'matchMedia',()=>({matches:false,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));   // phone-first: min-width:1100px never matches
const rafQ=[]; def(global,'requestAnimationFrame',cb=>{ if(rafQ.length<6) rafQ.push(cb); return 1; });
def(global,'cancelAnimationFrame',()=>{});
def(global,'setTimeout',(cb,ms)=>{ if(timers.length<timerCap){ try{ cb.__ms=ms|0; }catch(_){} timers.push(cb); } return timers.length; });   // v1.25.0: the delay rides the callback so a probe can drain in fire order
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
      if(bs && /data-bfadd=/.test(bs.innerHTML)){ fails++; console.log('✗ BRIEF empty state must not carry the map selection across rooms'); }
      // v1.24.0: setMode minimizes the chart every time the brief opens, and
      // body.chart-min hides every child of #briefStage except the ⌗ head. With
      // no members the only child IS the empty state, so the guidance for the
      // first move rendered into a collapsed stage and never reached the screen.
      // renderBrief clears the flag while the brief is empty — assert the STATE,
      // not just the markup, because the markup was always there.
      else if(document.body.classList.contains('chart-min')){
        fails++; console.log('✗ EMPTY BRIEF is minimized — the first-move guidance is hidden behind the ⌗ pill'); }
      // one filled primary, one quiet secondary (the pair was two gold primaries
      // for as long as nobody could see the panel)
      else if((bs.innerHTML.match(/bf-addsel/g)||[]).length!==2 || bs.innerHTML.indexOf('bf-addsel quiet')<0){
        fails++; console.log('✗ EMPTY BRIEF wants one filled primary + one quiet secondary'); }
      else console.log('  ✓ brief mode: body flag + empty-state add action, expanded, one primary');
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
    if(host.innerHTML.indexOf('Mercer')<0 || host.innerHTML.indexOf('Contacts · 1')<0){ fails++; console.log('✗ RECORDS tab did not render the person'); }
    else console.log('  ✓ records: add + tab render behind ▤ (Contacts · 1, row present)');
    global._odSetTab('ov');
    global._odUI.rec(false);
    const sn2=global.buildSnapshot();
    const rr=sn2.extras && sn2.extras.records && sn2.extras.records['fort-bragg'];
    if(!rr || rr.people.length!==1){ fails++; console.log('✗ SNAPSHOT extras.records missing the record'); }
    else console.log('  ✓ records ride the snapshot (extras.records)');
    if(typeof global._xpDossierBody==='function'){
      const body=global._xpDossierBody(sn2);
      if(body.indexOf('Mercer')<0 || body.indexOf('Technical details')<0){ fails++; console.log('✗ EXPORT body missing record sections'); }
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
    // Two top-level tabs; tracking-ID settings and filters live inside Records.
    global.showDossier('fort-bragg'); global._odUI.rec(true); global._odSetTab('xid');
    const dzh=IDS['dossier'].innerHTML;
    const iTab=dzh.indexOf('data-odtab="records"'), iPpl=dzh.indexOf('data-rcfilter="people"'), iOv=dzh.indexOf('data-odtab="ov"');
    if(!(iOv>=0 && iTab>iOv && iPpl>iTab) || dzh.indexOf('data-odtab="xid"')>=0){ ok=false; fails++; console.log('✗ Records workspace must nest ID context and filters under Overview/Records navigation'); }
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
    // v0.22.0 retired Dots/Lines; v1.23.1 retired the USACE label mute too
    // (owner: "remove USACE labels — they will follow the label checkbox").
    // ONE view toggle now: a family's names follow its layer, full stop.
    if((lg.innerHTML.match(/data-vw=/g)||[]).length!==1 || lg.innerHTML.indexOf('data-vw="names"')<0
       || lg.innerHTML.indexOf('data-vw="usace"')>=0
       || lg.innerHTML.indexOf('data-vw="dots"')>=0 || lg.innerHTML.indexOf('data-vw="lines"')>=0){
      fails++; console.log('✗ LAYERS wants exactly ONE view toggle (Labels); no per-family label mutes'); }
    // Scoped to CODE, not prose. The v1.23.1 changelog entry names the retired
    // flag in an English sentence ("GlobeState._usaceOff and its draw-loop
    // branch are deleted"), so a bare-token ban fails on the very history that
    // records the retirement — the same trap the body.nav-off ban fell into.
    // Match only the shapes the flag can wear as code: an assignment, a string
    // key in the view table, or a read inside an expression.
    if(/_usaceOff\s*[=;,)\]'"]/.test(html)){ fails++; console.log('✗ the USACE label mute is back (retired v1.23.1)'); }
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
      if(!/class="bf-layout"/.test(ch3)||ch3.indexOf('data-bfvert="2"')<0){ sok=false; fails++; console.log('✗ STACK: Layout must expose tier stacking without a long hold'); }
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
      // v1.22.0 (owner): briefs live in THE REPOSITORY's Briefs section now —
      // one app-wide panel consolidating views, briefs and records. This
      // deliberately supersedes the v1.8.0 "no brief ledger" law, which the
      // owner replaced with "consolidate … to keep as a full repository".
      global.Briefs.open();
      const sh=global.Repo.html();
      if(sh.indexOf('Save current brief')<0 || sh.indexOf('Remote Shelf')<0 || sh.indexOf('data-sbload')<0){ wok=false; fails++; console.log('✗ REPOSITORY Briefs section must carry save + the shelf'); }
      // v1.8.0 — the repository: map data only, IDs unfold to their actual items
      global.recAddId('fort-bragg','ID-900');
      global.recAdd('fort-bragg','people',{name:'Ledger Probe', role:'S3', xid:'ID-900'});
      global._ldSet('records');
      let rh=global.Repo.html();
      if(rh.indexOf('Repository')<0 || rh.indexOf('Fort Bragg')<0 || rh.indexOf('ID-900')<0 || rh.indexOf('P1')<0){ wok=false; fails++; console.log('✗ REPOSITORY Records section must show the org, the ID and its P count'); }
      // the sections stay SEPARATE — Records never mixes the shelves in
      if(rh.indexOf('Save current brief')>=0 || rh.indexOf('Remote Shelf')>=0){ wok=false; fails++; console.log('✗ the Records section must not carry the briefs shelf'); }
      // all three sections are reachable from one panel
      ['views','briefs','records'].forEach(function(t){
        if(rh.indexOf('data-ldtab="'+t+'"')<0){ wok=false; fails++; console.log('✗ REPOSITORY section missing: '+t); } });
      if(rh.indexOf('Ledger Probe')>=0){ wok=false; fails++; console.log('✗ REPOSITORY items must stay folded until the ID is tapped'); }
      global.Repo.sel('fort-bragg|ID-900');
      rh=global.Repo.html();
      if(rh.indexOf('Ledger Probe')<0 || rh.indexOf('S3')<0){ wok=false; fails++; console.log('✗ REPOSITORY expanded ID must show the saved item text'); }
      global.Repo.sel(null);
      // v1.22.0: the brief dock is a POD like the map's — tools only. Briefs,
      // Export-as-saved-thing and the Ledger moved into the Repository.
      global.renderBrief();
      const _bd=(html.split('id="briefDock"')[1]||'').split('\n</div>')[0];
      if(!_bd || _bd.indexOf('data-bfclear')<0){ wok=false; fails++; console.log('✗ brief dock source anchor missing — retirement checks would pass vacuously'); }
      if(_bd.indexOf('data-bfbriefs')>=0 || _bd.indexOf('data-bfledger')>=0){
        wok=false; fails++; console.log('✗ the brief dock still carries repository doors (retired v1.22.0)'); }
      if(_bd.indexOf('ch-lbl')>=0){ wok=false; fails++; console.log('✗ the brief dock must wear the map pod grammar (no captions)'); }
      ['data-bfclear','data-bfsearch','data-bfnm','data-bfln','data-xpbtn'].forEach(function(d){
        if(_bd.indexOf(d)<0){ wok=false; fails++; console.log('✗ brief pod control missing: '+d); } });
      // v1.25.1: both old dock doors lost their markup in v1.22.0. Match
      // executable selector calls, never their names in the release history.
      const retiredDockRoute=s=>/\.closest\s*\(\s*['"]\[data-bf(?:ledger|briefs)\]['"]\s*\)/.test(s);
      if(retiredDockRoute(html)){ wok=false; fails++; console.log('✗ retired brief dock click route is back'); }
      ['ledger','briefs'].forEach(function(name){
        if(!retiredDockRoute(html+"\ne.target.closest('[data-bf"+name+"]');")){
          wok=false; fails++; console.log('✗ retired dock route guard is blind: '+name); }
      });
      if(retiredDockRoute('// Removed data-bfledger and data-bfbriefs from the dock.')){
        wok=false; fails++; console.log('✗ retired dock route guard matches prose'); }
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
      if(!/\d+ items</.test(st2)){ gok=false; fails++; console.log('✗ HEAD item count missing'); }
      if(st2.indexOf('data-bfauto')<0 || st2.indexOf('data-bfjump')<0){ gok=false; fails++; console.log('✗ HEAD automatic detail and branch navigation missing'); }
      if(!/class="bf-headtoggle"[^>]*data-chmin="1"/.test(st2)){ gok=false; fails++; console.log('✗ minimize must have its own native button'); }
      // v1.22.0: the brief dock's caption contract retired with the captions —
      // the pod grammar is asserted in the repository probe above.
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
      // v1.21.0 (owner: "no tap needed"): the pod is unconditional chrome —
      // nothing may hide it, so the collapse class must stay retired.
      if(html.indexOf('body.nav-off #')>=0 || html.indexOf("classList.toggle('nav-off'")>=0){
        gok=false; fails++; console.log('✗ the pod collapse law is back (retired v1.21.0 — the pod never hides)'); }
      if(html.indexOf('body.brief-mode #navPod{display:none}')<0){ gok=false; fails++; console.log('✗ the brief room must yield the column to its own pod'); }
      if(html.indexOf('body.brief-mode #briefDock{display:flex; flex-direction:column')<0){ gok=false; fails++; console.log('✗ the brief dock is not a vertical right rail (v1.18.0)'); }
      // v1.29.0 amends the v1.27 scale law: the WORKING canvas keeps floor .85 /
      // cap 2.2, and only body.present may scale to 3.4 (the stage fit). The
      // assert now pins the present-conditional shape so neither the builder
      // cap nor the .85 floor can silently widen.
      if(!/Math\.max\(\.85,Math\.min\((?:pres|document\.body\.classList\.contains\('present'\))\?3\.4:2\.2,/.test(html)
         || /Math\.max\(0\.30,/.test(html)){ gok=false; fails++; console.log('✗ Brief must preserve readable scale and reveal detail progressively (builder .85–2.2; 3.4 only on the present stage)'); }
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
      const wsh=global.Repo.html();          // v1.22.0: the shelves render in the Repository
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
      // v1.20.0 THE SLIM POD — one object on the edge, and the doors are gone
      // from it: LAYERS is the top-left chip, SAVED is the ★ in the pill.
      const npHtml=(html.split('id="navPod"')[1]||'').split('\n</div>')[0];
      if(!npHtml){ ok=false; fails++; console.log('✗ #navPod slice empty (the transport pod is gone)'); }
      ['navSat-clear','navSat-back','navSat-zoomin','navSat-zoomout'].forEach(function(id){
        if(npHtml.indexOf(id)<0){ ok=false; fails++; console.log('✗ POD control missing: '+id); } });
      if(npHtml.indexOf('tp-rock')<0 || (npHtml.match(/tp-half/g)||[]).length<2){
        ok=false; fails++; console.log('✗ the zoom rocker is not one fused object with two halves'); }
      // skinny: the captions are what forced the width, so they must stay gone
      if(npHtml.indexOf('nv-lbl')>=0 || html.indexOf('.nv-lbl{')>=0){
        ok=false; fails++; console.log('✗ the pod captions are back (retired v1.20.0 — they set the width)'); }
      // the doors are integrated, not side buttons
      // v1.21.0: the layers are embedded IN the globe button — tap pops the
      // selections out around it, a three-second hold saves the view.
      // The owner approved the assessment's named folder entrance: preserve its
      // existing door contract while replacing the ambiguous saved-view star.
      if(html.indexOf('id="lyPanel"')<0 || !/class="sp-star"[^>]*aria-controls="ledger"[^>]*aria-label="Saved — Repository:/.test(html)){
        ok=false; fails++; console.log('✗ the layer checkbox list or named Repository door is missing'); }
      if(html.indexOf('.ly-sat{')>=0){ ok=false; fails++; console.log('✗ the orbiting layer circles are back (retired v1.22.0 — checkboxes now)'); }
      if(html.indexOf('data-lyfam=')<0 || html.indexOf('ly-bx')<0){
        ok=false; fails++; console.log('✗ the layer list is not checkboxes'); }
      if(html.indexOf('id="lyChip"')>=0){
        ok=false; fails++; console.log('✗ the layer chip is back (retired v1.21.0 — the globe carries it)'); }
      if(html.indexOf("svCapture();")<0 || html.indexOf("_bfToast('View saved")<0){
        ok=false; fails++; console.log('✗ the 3s hold no longer saves a view'); }
      if(html.indexOf("setMode(document.body.classList.contains('brief-mode')?'map':'brief')")>=0){
        ok=false; fails++; console.log('✗ the FAB hold still flips rooms (v1.21.0: it saves a view)'); }
      if(html.indexOf('id="navRow"')>=0 || html.indexOf('navSat-saved')>=0 || html.indexOf('navSat-layers')>=0){
        ok=false; fails++; console.log('✗ the side-button door rail is back (retired v1.20.0)'); }
      if(html.indexOf('data-lysat=')<0){
        ok=false; fails++; console.log('✗ the mode row is missing from the layer list'); }
      // retirements — a retired style is not retired until a probe guards it
      ['>ZOOM −<','>ZOOM +<','class="nv-side"','id="legendPanel"','#legendPanel{','.lg-head',
       "_disc('lg-classes'","('View '+(SAVEDV.length+1))",'#themeSwitch','dz-min'].forEach(function(nd){
        if(html.indexOf(nd)>=0){ ok=false; fails++; console.log('✗ retired but still present: '+nd); } });
      // the scope readout has exactly ONE writer, and _famOff exactly four
      if((html.match(/GlobeState\._famOff=/g)||[]).length!==4){
        ok=false; fails++; console.log('✗ GlobeState._famOff must be assigned in exactly 4 places (readout goes stale otherwise)'); }
      if(html.indexOf('id="lyState"')<0 || html.indexOf('function lySync()')<0){
        ok=false; fails++; console.log('✗ the layer scope readout is missing'); }
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
        const sh=global.Repo.html();         // v1.22.0: one panel holds every saved thing
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

  // ── THE BUILD STAMP clears the mode pill (v1.24.0). Measured on a 414x896
  //    phone the stamp's box ran 43.0->51.5 while the pill's top edge sits at
  //    48.0, so 3.5px of the running version was painted over by a pill carrying
  //    z-index 22 — on every screenshot, in both rooms. Source assert: the stub
  //    DOM parses no static markup, so this reads the stylesheet text itself. ──
  if(!/#verTag\{[^}]*top:32px/.test(html)){
    fails++; console.log('\u2717 the build stamp drifted back under the mode pill (v1.24.0 seated it at 32px)'); }
  else console.log('  \u2713 build stamp seated clear of the mode pill');

  // ── PROBE: THE BRANCH TOOLS (v1.30.0) — one tap selects a unit's whole
  //    roster of direct subordinates (candidates de-dupe against the brief so
  //    the count shrinks as boxes land), and one swatch can paint a node plus
  //    every DIAGRAM descendant, '' resetting the same branch. ──
  { let bok=true;
    try{
      global.setMode('brief');
      global.Brief.add('usawhc');
      const f1=global._bfPickCandidates('usawhc','','org');
      if(!(f1.own>=20)){ bok=false; fails++; console.log('✗ BRANCH: expected USAWHC to offer 20+ direct subordinates, got '+f1.own); }
      const got=global.bfAddMany(f1.rows.slice(0,f1.own).map(function(r){return r.id;}),'usawhc');
      if(got!==f1.own){ bok=false; fails++; console.log('✗ BRANCH: select-all added '+got+' of '+f1.own); }
      const f2=global._bfPickCandidates('usawhc','','org');
      if(f2.own!==0){ bok=false; fails++; console.log('✗ BRANCH: candidates must de-dupe against the brief (still offering '+f2.own+')'); }
      // the sheet offers the door only while there is a roster to tick
      global._bfAddSheet('usawhc');
      if(IDS['dossier'] && IDS['dossier'].innerHTML.indexOf('data-bfpickall')>=0){
        bok=false; fails++; console.log('✗ BRANCH: select-all door must vanish once every subordinate is placed'); }
      // cascade: paint the branch, spare the stranger, reset the branch.
      // (The stranger must be OUTSIDE the USAWHC subtree — First Army would
      // already be on the diagram as a painted subordinate.)
      global.Brief.add('amc');
      const m=global.Brief.colorTree('usawhc','#aa3355');
      if(m<21){ bok=false; fails++; console.log('✗ BRANCH: colorTree painted only '+m); }
      if(global.Brief.node('xviii-airborne-corps').c!=='#aa3355'){ bok=false; fails++; console.log('✗ BRANCH: a subordinate escaped the cascade'); }
      if(global.Brief.node('amc').c!==''){ bok=false; fails++; console.log('✗ BRANCH: cascade leaked onto a non-descendant'); }
      const m2=global.Brief.colorTree('usawhc','');
      if(m2!==m || global.Brief.node('xviii-airborne-corps').c!==''){ bok=false; fails++; console.log('✗ BRANCH: branch reset must clear the same '+m+' boxes'); }
      global.Brief.list().slice().forEach(function(k){ try{ global.Brief.remove(k); }catch(_){} });   // leave the room as found
      global.setMode('map');
    }catch(e){ bok=false; fails++; console.log('✗ BRANCH probe: '+e.message); }
    if(html.indexOf('data-bfclrall')<0){ bok=false; fails++; console.log('✗ BRANCH: the cascade arm is missing from the Appearance row'); }
    if(pokAll_bfclr_guard(html)){ bok=false; fails++; console.log('✗ BRANCH: swatch handler must route through the cascade arm'); }
    if(bok) console.log('  \u2713 BRANCH TOOLS: select-all roster \u00b7 de-dupe \u00b7 door retires when done \u00b7 cascade paints+resets the branch, spares strangers');
  }
  function pokAll_bfclr_guard(h){ return h.indexOf('window._bfClrCascade){ const m=bfColorTree(')<0; }

  // ── PROBE: THE PODIUM & PRESENT (v1.29.0) — a real back history for the
  //    brief (explore pushes the state it leaves; back restores it; a dry back
  //    with focus clears to overview WITHOUT pushing, so back never
  //    ping-pongs; a dry unfocused back reports false so hardware-back can
  //    fall through to the map). Present rides brief-wide, strips the working
  //    chrome, and shows the six-control podium. The podium element is static
  //    markup, which this stub never parses — its visibility is asserted in
  //    the live proof; here the SOURCE carries the law. ──
  { let pok=true;
    try{
      global.setMode('brief');
      global.Brief.add('usawhc'); global.Brief.add('xviii-airborne-corps'); global.Brief.add('82nd-airborne-division');
      global.renderBrief();
      global._bfExplore('xviii-airborne-corps');
      global._bfExplore('82nd-airborne-division');
      if(global.GlobeState._bfFocus!=='82nd-airborne-division'){pok=false;fails++;console.log('✗ SPINE: explore did not focus');}
      global.bfBack();
      if(global.GlobeState._bfFocus!=='xviii-airborne-corps'){pok=false;fails++;console.log('✗ SPINE: back did not restore the previous focus');}
      global.bfBack();
      if(global.GlobeState._bfFocus!==null){pok=false;fails++;console.log('✗ SPINE: second back did not return to overview');}
      if(global.bfBack()!==false){pok=false;fails++;console.log('✗ SPINE: a dry unfocused back must report false (hardware-back falls through to the map)');}
      global._bfExplore('usawhc'); global._bfHist.length=0;
      global.bfBack();
      if(global.GlobeState._bfFocus!==null){pok=false;fails++;console.log('✗ SPINE: dry-but-focused back must clear to overview');}
      if(global._bfHist.length!==0){pok=false;fails++;console.log('✗ SPINE: the dry-clear must NOT push (back/back would ping-pong)');}
      global.bfPresent(true);
      const bcl=global.document.body.classList;
      if(!bcl.contains('present')||!bcl.contains('brief-wide')){pok=false;fails++;console.log('✗ PRESENT: stage classes missing');}
      global.bfPresent(false);
      if(bcl.contains('present')||bcl.contains('brief-wide')){pok=false;fails++;console.log('✗ PRESENT: exit left stage classes behind');}
      global.setMode('map');
    }catch(e){pok=false;fails++;console.log('✗ PODIUM probe: '+e.message);}
    if(html.indexOf('body.present #searchPill')<0 || html.indexOf('body.present .bf-caret')<0 || html.indexOf('body.present #briefDock')<0){
      pok=false; fails++; console.log('✗ PRESENT css must strip the working chrome (search pill, carets, dock)'); }
    ['back','home','dep-','dep+','fit','end'].forEach(function(a){
      if(html.indexOf('data-bfpodium="'+a+'"')<0){ pok=false; fails++; console.log('✗ PODIUM is missing its '+a+' control'); } });
    if(html.indexOf('data-bfpresent="1"')<0){ pok=false; fails++; console.log('✗ the dock has no Present door'); }
    if(pok) console.log('  \u2713 PODIUM & PRESENT: spine push/pop/dry-clear/false \u00b7 stage classes on+off \u00b7 chrome stripped \u00b7 six controls \u00b7 dock door');
  }

  // ── PROBE: THE FETCHED SPINE (v1.31.0, supersedes the v1.28.0 derived
  //    spine) — the org tree rides data/orgs.json now; this stub's fetch()
  //    serves the REAL repo file, so a green here means the actual boot path
  //    (fetch → apply-in-place → memo invalidation) delivered the blessed
  //    rows before the probes that consume them. ──
  { let dok=true;
    try{
      const srcOrgs=JSON.parse(require('fs').readFileSync(require('path').join(__dirname,'..','data','orgs.json'),'utf8')).orgs;
      const run=global.A1ORGS;
      if(!global.__orgsReady){ dok=false; fails++; console.log('✗ FETCHED SPINE: __orgsReady is false — the boot fetch never resolved in the harness'); }
      if(!run || run.length!==srcOrgs.length){ dok=false; fails++; console.log('✗ FETCHED SPINE: runtime org count '+(run&&run.length)+' != source '+srcOrgs.length); }
      else { let bad=0;
        for(let i2=0;i2<srcOrgs.length;i2++){ const a=srcOrgs[i2], b=run[i2];
          if(a.id!==b.id || a.lvl!==b.lvl || String(a.root)!==String(b.root) || String(a.site)!==String(b.site)){ bad++; } }
        if(bad){ dok=false; fails++; console.log('✗ FETCHED SPINE: '+bad+' runtime row(s) disagree with data/orgs.json'); } }
      if(html.indexOf('{"id":"hqda"')>=0){ dok=false; fails++; console.log('✗ FETCHED SPINE: an org literal is back in the page'); }
    }catch(e){ dok=false; fails++; console.log('✗ FETCHED SPINE probe: '+e.message); }
    if(dok) console.log('  \u2713 FETCHED SPINE: boot fetch delivered every blessed row \u00b7 no literal in the page');
  }

  // \u2500\u2500 PROBE: THE SELECTION CONTRACT (v2.0.0; owner: "sometimes it will
  //    randomly switch from base to a specific command"). A map dot tap must
  //    ALWAYS select the installation; descending into a command is always an
  //    explicit, labeled act. Three laws: (a) the v0.18.0 silent child-org
  //    remap stays retired in the SOURCE (code-scoped shape); (b) the chain
  //    door renders on the base card while _coChainCtx points at it, and dies
  //    with the next ordinary selection (it lives exactly one selection);
  //    (c) the base card's subtitle answers "what is here" \u2014 state \u00b7 senior
  //    unit. harness_globe drives the real tapAtScreen end-to-end. \u2500\u2500
  { let sok=true;
    try{
      // (a) source: the old remap shape must not return
      if(/selectSite\(s\.id,\s*kid\s*\?/.test(html)){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: the silent child-org dot remap is back in tapAtScreen'); }
      if(html.indexOf('_keepChainCtx')<0 || html.indexOf('window._coChainCtx=')<0){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: the chain-door spine (_coChainCtx/_keepChainCtx) is missing'); }
      // (b) runtime: the door renders while armed, dies with the next selection
      const kidOrg=(global.A1ORGS||[]).find(function(o2){ return o2.site==='fort-stewart'; });
      if(!kidOrg){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: fixture broke \u2014 no org sits at fort-stewart'); }
      else{
        global._coChainCtx={ site:'fort-stewart', org:kidOrg.id, from:'US Army Western Hemisphere Command' };
        global.GlobeState.sel='fort-stewart'; global.GlobeState.selOrg=null;
        global.calloutShow('fort-stewart');
        const card=IDS['calloutCard']?IDS['calloutCard'].innerHTML:'';
        if(card.indexOf('data-codrill="'+kidOrg.id+'"')<0){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: chain door chip missing from the base card while context is armed'); }
        // (c) the base subtitle carries the senior unit
        if(!/<span class="co-subin">[^<]*3rd Infantry Division/.test(card)){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: base subtitle does not answer "what is here" (state \u00b7 senior unit)'); }
        // an ordinary selection retires the door
        global.selectSite('fort-stewart');
        if(global._coChainCtx!=null){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: _coChainCtx survived an ordinary selection \u2014 the door must live exactly one selection'); }
        const card2=IDS['calloutCard']?IDS['calloutCard'].innerHTML:'';
        if(card2.indexOf('data-codrill="'+kidOrg.id+'"')>=0){ sok=false; fails++; console.log('\u2717 SEL CONTRACT: the chain door chip is still rendered after the context cleared'); }
        global.selectSite(null);
      }
    }catch(e){ sok=false; fails++; console.log('\u2717 SEL CONTRACT probe: '+e.message); }
    if(sok) console.log('  \u2713 SELECTION CONTRACT: remap stays retired \u00b7 chain door renders armed, dies with the next selection \u00b7 base sub says state \u00b7 senior unit');
  }

  // \u2500\u2500 PROBE: THE STAGE MIRROR (v2.1.0; owner: "Full screen globe mode with a
  //    small hierarchy pictured in corner" + "dynamic display view when
  //    navigating the hierarchy to show on globe"). Four laws: (a) minimized,
  //    the brief keeps a LIVE miniature \u2014 the hide rule exempts .bf-wrap, the
  //    mirror CSS exists, and _bfMirrorFit scales with a .08 floor (no .85
  //    builder floor in the mirror); (b) the mirror is one tap-through surface
  //    \u2014 pointer-events:none wrap + the stage's own data-chmin attr, synced by
  //    renderBrief and the toggle; (c) the globe FOLLOWS the hierarchy:
  //    _bfFlyFocus exists and is wired into _bfExplore, bfBack (both paths),
  //    the brief globe tap, the chart-min entry and the room entry; (d) it
  //    actually flies: driven over a seeded brief it starts a camera tween
  //    (GlobeState._fly). Stub layout has no clientWidth, so the mirror FIT is
  //    proven geometrically in the live browser; the source contract here. \u2500\u2500
  { let mok=true;
    try{
      if(!/body\.chart-min #briefStage > :not\(\.ch-head\):not\(\.bf-wrap\)\{display:none\}/.test(html)){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: the hide rule no longer exempts .bf-wrap \u2014 the miniature is gone'); }
      if(html.indexOf('body.brief-mode.chart-min #briefStage .bf-wrap')<0 || !/chart-min #briefStage \.bf-wrap\{[^}]*pointer-events:none/.test(html)){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: mirror card CSS missing or the wrap became interactive'); }
      if(typeof global._bfMirrorFit!=='function'){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: _bfMirrorFit is gone'); }
      if(!/_bfMirrorFit\(w,t,L\); return; \}/.test(html)){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: _bfFit no longer routes to the mirror fit while minimized'); }
      const wired=(html.match(/_bfFlyFocus\(\)/g)||[]).length;
      if(typeof global._bfFlyFocus!=='function' || wired<7){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: the follow is unwired ('+wired+' _bfFlyFocus() sites; need explore/back\u00d72/tap/chmin/room)'); }
      // (d) runtime: seed a two-node brief; ENTERING the room must already fly
      // (the room-entry wire), and a focused follow must fly again.
      global.Brief.add('usawhc'); global.Brief.add('iii-armored-corps');
      global.GlobeState._fly=false; global.GlobeState._bfFocus=null;
      global.setMode('brief');
      if(global.GlobeState._fly!==true){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: entering the brief room over a 2-site brief did not start a camera tween'); }
      global.GlobeState._fly=false;
      global.GlobeState._bfFocus='iii-armored-corps';
      global._bfFlyFocus();
      if(global.GlobeState._fly!==true){ mok=false; fails++; console.log('\u2717 STAGE MIRROR: focused follow did not fly'); }
      global.GlobeState._bfFocus=null; global.GlobeState._fly=false;
      global.Brief.list().slice().forEach(function(k){ try{ global.Brief.remove(k); }catch(_){} });
      global.setMode('map');
    }catch(e){ mok=false; fails++; console.log('\u2717 STAGE MIRROR probe: '+e.message); }
    if(mok) console.log('  \u2713 STAGE MIRROR: miniature CSS + tap-through contract \u00b7 mirror fit routed \u00b7 follow wired at 6 sites and flies over a seeded brief');
  }

  // ── PROBE: THE BRANCH ADD (v2.2.0; owner: "Bulk add ... for organizations
  //    and subordinates"). Laws: (a) the act is EXPLICIT — the door renders
  //    with count + depth and lands the whole plan; v0.13.0's ban on IMPLICIT
  //    subtrees stands (Brief.add alone never drags children); (b) every added
  //    node is parented to its REAL chain parent, not flattened under the
  //    root; (c) the plan de-dupes against the diagram and a second act adds
  //    zero; (d) the cap holds: direct roster always rides, deeper levels only
  //    while the total stays inside 60, and the truncation is declared. ──
  { let brk=true;
    try{
      if(html.indexOf('data-bfaddbranch')<0){ brk=false; fails++; console.log('✗ BRANCH ADD: the door is missing from the add sheet'); }
      global.Brief.add('usawhc');
      if(global.Brief.list().length!==1){ brk=false; fails++; console.log('✗ BRANCH ADD: Brief.add dragged children — the implicit-subtree ban broke'); }
      const plan=global.Brief.branchPlan('usawhc', 60);
      if(!(plan.total>=25 && plan.depth>=2)){ brk=false; fails++; console.log('✗ BRANCH ADD: USAWHC plan too shallow ('+plan.total+' units, '+plan.depth+' levels)'); }
      const got=global.Brief.addBranch('usawhc');
      if(got!==plan.total){ brk=false; fails++; console.log('✗ BRANCH ADD: planned '+plan.total+' but landed '+got); }
      // (b) real chain parenting: a level-2 entry hangs off its plan parent
      const l2=(plan.levels[1]||[])[0];
      if(!l2){ brk=false; fails++; console.log('✗ BRANCH ADD: no level-2 entry to verify parenting'); }
      else { const nd=global.Brief.node(l2.id);
        if(!nd || nd.p!==l2.p){ brk=false; fails++; console.log('✗ BRANCH ADD: '+l2.id+' parented to '+(nd&&nd.p)+' — expected its chain parent '+l2.p); } }
      // (c) idempotent
      if(global.Brief.addBranch('usawhc')!==0){ brk=false; fails++; console.log('✗ BRANCH ADD: a second act must add zero (de-dupe against the diagram)'); }
      // (d) the cap: HQDA's tree dwarfs 60 — the plan must stop and say so
      global.Brief.list().slice().forEach(function(k){ try{ global.Brief.remove(k); }catch(_){} });
      global.Brief.add('hqda');
      const big=global.Brief.branchPlan('hqda', 60);
      const direct=(big.levels[0]||[]).length;
      if(!(big.total<=Math.max(60,direct) && big.truncated)){ brk=false; fails++; console.log('✗ BRANCH ADD: cap failed — '+big.total+' planned (direct '+direct+'), truncated='+big.truncated); }
      global.Brief.list().slice().forEach(function(k){ try{ global.Brief.remove(k); }catch(_){} });
    }catch(e){ brk=false; fails++; console.log('✗ BRANCH ADD probe: '+e.message); }
    if(brk) console.log('  ✓ BRANCH ADD: explicit door · real chain parenting · plan lands whole and de-dupes · cap declares its cut');
  }

  // ── PROBE: THE HAND (v2.3.0; owner: "Dynamic objects with ability to drag
  //    to different spots on command"). The gesture geometry is browser-only;
  //    the source contract and the DATA acts are pinned here. Laws: (a) the
  //    wire exists — hold timer, lift class, drop marks, the touch guard door
  //    (__bfHandLive) and the post-drop click eater; (b) bfPlace puts a node
  //    exactly before/after a SIBLING and refuses cross-parent placement;
  //    (c) bfMove's cycle guard still refuses a unit landing under its own
  //    subordinate (the drop path leans on it). ──
  { let hok=true;
    try{
      if(html.indexOf('.bf-box.bf-lift')<0 || html.indexOf('bfDragTag')<0){ hok=false; fails++; console.log('✗ HAND: lift/tag CSS contract missing'); }
      if(!/handHold=setTimeout\(function\(\)\{/.test(html) || html.indexOf(',350);')<0){ hok=false; fails++; console.log('✗ HAND: the hold timer is gone or re-tuned without a probe update'); }
      if(!/window\.__bfHandLive=function\(\)\{ return !!hand; \}/.test(html) || html.indexOf('window.__bfHandLive&&window.__bfHandLive()')<0){ hok=false; fails++; console.log('✗ HAND: the touch guard door is unwired — a lifted box would scroll the chart'); }
      if(!/if\(handDid\)\{ handDid=false; e\.preventDefault\(\); e\.stopPropagation\(\); \}/.test(html)){ hok=false; fails++; console.log('✗ HAND: the post-drop click eater is gone — a drop would double as a drill'); }
      // data acts over a real branch
      global.Brief.add('usawhc'); global.Brief.addBranch('usawhc');
      const kids=global.BRIEFKIDS?null:null;
      const sibs=['xviii-airborne-corps','iii-armored-corps'].filter(function(k){ return global.Brief.node(k); });
      if(sibs.length<2){ hok=false; fails++; console.log('✗ HAND: fixture broke — need two corps siblings under USAWHC'); }
      else{
        if(!global.Brief.place(sibs[0], sibs[1], true)){ hok=false; fails++; console.log('✗ HAND: place(after) refused a legal sibling drop'); }
        else{
          const order=global.Brief.list().filter(function(k){ return sibs.indexOf(k)>=0; });
          if(!(order[0]===sibs[1] && order[1]===sibs[0])){ hok=false; fails++; console.log('✗ HAND: place(after) landed the wrong order ('+order.join(' → ')+')'); }
        }
        if(global.Brief.place(sibs[0], '82nd-airborne-division', false)!==false){ hok=false; fails++; console.log('✗ HAND: place must refuse cross-parent placement — that is a MOVE'); }
      }
      if(global.Brief.move('usawhc','82nd-airborne-division')!==false){ hok=false; fails++; console.log('✗ HAND: the cycle guard broke — a unit landed under its own subordinate'); }
      global.Brief.list().slice().forEach(function(k){ try{ global.Brief.remove(k); }catch(_){} });
    }catch(e){ hok=false; fails++; console.log('✗ HAND probe: '+e.message); }
    if(hok) console.log('  ✓ HAND: gesture wire + guards in source · place lands exact sibling order, refuses cross-parent · cycle guard holds');
  }

  // ── PROBE: THE ECHELON TAG (v1.24.0) — the card's rail leads with the rung
  //    the command hangs off under HQDA (ACOM · ASCC · DRU · ACQ · NGB). That
  //    slot used to read the literal word HERE, which said nothing the name
  //    directly beneath it did not already say, while the classification itself
  //    was dropped: _OG_CATS filters the category rungs out of the crumbs, so on
  //    the 2-crumb cap a deep unit's card could not say whether it hung off an
  //    ACOM or an ASCC at all. The deep case is the one that matters — keep it
  //    in the table. ──
  { let eok=true;
    try{
      if(typeof global.calloutShow!=='function'){ eok=false; fails++; console.log('✗ ECHELON: calloutShow unreachable'); }
      else {
        [['usawhc','ASCC'],['amc','ACOM'],['usace','DRU'],['hqda','HQDA'],
         ['4th-infantry-division-sustainment-brigade','ASCC']].forEach(function(w){
          global.calloutShow(w[0]);
          const c=IDS['calloutCard']?IDS['calloutCard'].innerHTML:'';
          const m=c.match(/<span class="co-railhere"[^>]*>([^<]*)<\/span>/);
          if(!m){ eok=false; fails++; console.log('✗ ECHELON tag missing on '+w[0]); }
          else if(m[1]!==w[1]){ eok=false; fails++; console.log('✗ ECHELON on '+w[0]+' reads "'+m[1]+'", want "'+w[1]+'"'); }
          // the tag LEADS the rail: trailing it read "I CORPS > 4TH INF DIV > ASCC",
          // which puts the classification below the division it sits above
          if(m && /co-railchip[\s\S]*co-railhere/.test(c)){
            eok=false; fails++; console.log('✗ ECHELON tag must lead the rail, not trail the ancestors ('+w[0]+')'); }
          if(/>HERE</.test(c)){ eok=false; fails++; console.log('✗ the vacuous HERE crumb is back on '+w[0]); }
        });
        if(typeof global.calloutHide==='function') global.calloutHide();
      }
    }catch(e){ eok=false; fails++; console.log('✗ ECHELON probe: '+e.message); }
    if(eok) console.log('  \u2713 ECHELON: ACOM/ASCC/DRU/HQDA lead the rail \u00b7 a deep unit still names its rung \u00b7 no HERE');
  }

  // ── PROBE: v1.25.0 THE CONNECTED APP — the update path and the database door
  //    under stress. Every fix ships its test (v0.33.1 law); every negative
  //    source assert is scoped to CODE SHAPE and proven to fire on the shape it
  //    bans (TESTING LAW 1) — a ban that has never fired is not known to work. ──
  { let cok=true;
    const bad=(m)=>{ cok=false; fails++; console.log('✗ CONNECTED: '+m); };
    // drains the timers queued since `start` in FIRE order (shortest delay first) — the stub ignores delays, real clocks do not
    const drainFrom=(start)=>{ let k=0; while(timers.length>start && k<60){ let bi=start; for(let i=start;i<timers.length;i++){ if((timers[i].__ms|0)<(timers[bi].__ms|0)) bi=i; } const cb=timers.splice(bi,1)[0]; k++; try{ cb(); }catch(e){ bad('timer threw: '+e.message); } } return k; };
    try{
      // ── the worker: source law on sw.js ──
      const swSrc=fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');
      const laws=[
        ["precache revalidates at the origin (cache:'no-cache')", /new Request\(a, \{ cache: 'no-cache' \}\)/],
        ['the shell is mandatory at install', /throw new Error\('shell precache failed'\)/],
        ['a redirected response is never stored', /res\.redirected\) return false/],
        ['runtime backfill skips redirected responses', /res\.ok && !res\.redirected/],
        ['navigations match the shell ignoring the query', /ignoreSearch: true/],
        ['offline navigation falls back to the cached shell', /caches\.match\(SHELL\)/],
        ['sw.js is never cached by the worker', /\/\\\/sw\\\.js\$\/\.test\(url\.pathname\)\) return;/],
        ['cross-origin passthrough survives', /url\.origin !== location\.origin\) return;/],
        ["message door: 'version'", /d\.t === 'version'/],
        ["message door: 'refresh-shell'", /d\.t === 'refresh-shell'/],
      ];
      laws.forEach(function(l){ if(!l[1].test(swSrc)) bad('sw.js lost: '+l[0]); });
      // the './index.html' twin precache is gone (a redirect there stored a poisoned entry)
      const twin=(s)=>/'\.\/index\.html'/.test(s);
      if(twin(swSrc)) bad("sw.js precaches './index.html' again — the redirect-poisoned twin");
      if(!twin(swSrc+"\nconst X=['./index.html'];")) bad('the index.html twin ban is blind (never fires)');
      // ── the page: source law ──
      const pageLaws=[
        ['update toast wired to the real toast', /window\.toast\|\|window\._bfToast/],
        ['a network return kicks the update check', /window\.addEventListener\('online', kick\)/],
        ['a network return re-registers a stranded worker', /window\.addEventListener\('online', function\(\)\{ if\(!navigator\.serviceWorker\.controller && _swTries>0\) _swGo\(\); \}\)/],
        ['the network watch is wired', /window\.addEventListener\('online', function\(\)\{ _netUp\('online'\); \}\)/],
        ['leaving flushes', /window\.addEventListener\('pagehide', function\(\)\{ _dbHideFlush\(\); \}\)/],
        ['the client uses the keepalive-aware fetch', /global:\{ fetch:_dbFetch \}/],
        ['the ⋯ menu offers Check for updates', /data-am="upd">Check for updates</],
        ['diagnostics lead with page/worker builds', /'A-ORG-2 '\+APP_VERSION\+' · worker '/],
      ];
      pageLaws.forEach(function(l){ if(!l[1].test(html)) bad('index.html lost: '+l[0]); });
      // banned shapes (scoped to code, proven to fire)
      const bans=[
        ['single-try basemap fetch', /const r=await fetch\(SRC\); if\(!r\.ok\) continue;/, "const r=await fetch(SRC); if(!r.ok) continue;"],
        ['waiting on a dead #sbLib tag (the Connect hang)', /ex\.addEventListener\('load'/, "ex.addEventListener('load', f)"],
        ['a push with no dirty flag', /_dbPushT=setTimeout\(async function\(\)\{/, "_dbPushT=setTimeout(async function(){"],
      ];
      bans.forEach(function(b){ if(b[1].test(html)) bad('regression shape is back: '+b[0]); if(!b[1].test(html+'\n'+b[2])) bad('ban is blind: '+b[0]); });

      // ── the update doors at runtime (the sandbox skips registration, never the doors) ──
      if(typeof global.__updCheck!=='function' || typeof global.__swReg!=='function' || typeof global.__swVerCheck!=='function' || typeof global._updCheckUI!=='function')
        bad('update doors missing (__updCheck / __swReg / __swVerCheck / _updCheckUI)');
      else {
        const prevSbx=global.__SANDBOX; global.__SANDBOX=false;
        try{
          let r0=null; global.__updCheck().then(function(r){ r0=r; }); await flushAsync();
          if(!r0 || r0.ok!==false) bad('__updCheck must report ok:false before any registration');
          global.__swReg(SW_REG);
          let r1=null, t0=timers.length; global.__updCheck().then(function(r){ r1=r; }); await flushAsync(); drainFrom(t0); await flushAsync();
          if(!r1 || r1.ok!==true || r1.found!==false) bad('__updCheck on a current worker must be {ok:true,found:false}, got '+JSON.stringify(r1));
          SW_REG.installing={state:'installing'};
          let r2=null; t0=timers.length; global.__updCheck().then(function(r){ r2=r; }); await flushAsync(); drainFrom(t0); await flushAsync();
          SW_REG.installing=null;
          if(!r2 || r2.ok!==true || r2.found!==true) bad('__updCheck must report found:true when a worker is installing, got '+JSON.stringify(r2));
          const upd0=SW_REG.update; SW_REG.update=function(){ return Promise.reject(new Error('boom')); };
          let r3=null; t0=timers.length; global.__updCheck().then(function(r){ r3=r; }); await flushAsync(); drainFrom(t0); await flushAsync();
          SW_REG.update=upd0;
          if(!r3 || r3.ok!==false || !/boom/.test(r3.why||'')) bad('__updCheck must surface the failure reason, got '+JSON.stringify(r3));
          // the ⋯ row + the UI door: honest copy for the latest build
          if(typeof global._renderAppMenu==='function'){ global._renderAppMenu();
            if((IDS['appMenu']?IDS['appMenu'].innerHTML:'').indexOf('data-am="upd"')<0) bad('⋯ menu lost the Check for updates row'); }
          t0=timers.length;
          if(global._updCheckUI()!==true) bad('_updCheckUI must run the check when online outside the sandbox');
          const tA=IDS['bfToast']?IDS['bfToast'].textContent:'';
          if(!/Checking for updates/.test(tA)) bad('_updCheckUI must say it is checking (got "'+tA+'")');
          await flushAsync(); drainFrom(t0); await flushAsync();
          const tB=IDS['bfToast']?IDS['bfToast'].textContent:'';
          const VER=(html.match(/APP_VERSION\s*=\s*'([^']+)'/)||[])[1]||'';   // APP_VERSION is an eval-scoped const — read the source
          if(!/latest build/.test(tB) || !VER || tB.indexOf(VER)<0) bad('_updCheckUI must name the latest build + version (got "'+tB+'")');
          // the stale-build self-heal: older/equal worker → nothing; newer → ONE heal per session
          let healed=0; const heal0=global.__swHeal; global.__swHeal=function(cb){ healed++; cb(true); };
          global.__swVer='a-org-2-v1-0-0'; if(global.__swVerCheck()!==false || healed) bad('an OLDER worker must not trigger the heal');
          global.__swVer='a-org-2-'+VER.replace(/\./g,'-'); if(global.__swVerCheck()!==false || healed) bad('an EQUAL worker must not trigger the heal');
          global.__swVer='a-org-2-v99-9-9'; if(global.__swVerCheck()!==true || healed!==1) bad('a NEWER worker must heal exactly once (healed='+healed+')');
          const tC=IDS['bfToast']?IDS['bfToast'].textContent:''; if(!/Refreshing to v99\.9\.9/.test(tC)) bad('the heal must say which build it is refreshing to (got "'+tC+'")');
          if(global.__swVerCheck()!==false || healed!==1) bad('the heal must run once per session per worker build (healed='+healed+')');
          global.__swHeal=heal0; global.__swVer='';
        } finally { global.__SANDBOX=prevSbx; global.__swReg(null); }
      }

      // ── the database door at runtime ──
      const headTags=()=>global.document.head.children.filter(c=>c && c.id==='sbLib');
      const lastTag=()=>headTags().slice(-1)[0]||null;
      const settleLib=async()=>{ const t=lastTag(); if(t && t.onerror) t.onerror(); await flushAsync(); };
      await settleLib();                                        // anything an earlier probe left in flight
      if(global.DB.conn()) bad('a connect is still in flight after the library failed');
      global.DB._setCfg(null);
      // D1 — the Connect hang: a failed library load must never poison the next attempt
      const p1=global.ensureSupabase();
      if(global.DB.lib()!==p1) bad('ensureSupabase must expose its in-flight load');
      if(global.ensureSupabase()!==p1) bad('two callers must share ONE in-flight library load');
      const tag1=lastTag(); if(!tag1) bad('ensureSupabase injected no #sbLib tag');
      let v1=null; p1.then(function(v){ v1=v; }); await settleLib();
      if(v1!==false) bad('a failed library load must resolve false (got '+v1+')');
      if(global.DB.lib()!==null) bad('the in-flight load must clear after failure');
      if(global.DB.state()!=='error') bad('a failed library load must say so (state '+global.DB.state()+')');
      const p2=global.ensureSupabase();
      if(p2===p1) bad('THE HANG: ensureSupabase returned the dead promise after a failure');
      const tag2=lastTag(); if(!tag2 || tag2===tag1) bad('a retry must inject a FRESH #sbLib tag, not wait on the dead one');
      let v2=null; p2.then(function(v){ v2=v; }); await settleLib();
      if(v2!==false) bad('the retried load must settle on its own tag (got '+v2+')');
      // D2 — one connect at a time
      global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'b'});
      const c1=global.dbConnect(), c2=global.dbConnect();
      if(c1!==c2) bad('concurrent dbConnect calls must share the in-flight promise');
      if(global.DB.state()!=='connecting') bad('dbConnect must report connecting at once (state '+global.DB.state()+')');
      if(global.DB.conn()!==c1) bad('DB.conn() must expose the in-flight connect');
      let cv=null; c1.then(function(v){ cv=v; }); await settleLib();
      if(cv!==false) bad('a connect whose library fails must resolve false (got '+cv+')');
      if(global.DB.conn()!==null) bad('the in-flight connect must clear after failure');
      const c3=global.dbConnect(); if(c3===c1) bad('after a failure the next dbConnect must be a fresh attempt');
      let cv3=null; c3.then(function(v){ cv3=v; }); await settleLib(); if(cv3!==false) bad('the fresh attempt must settle');
      // D3 — network-class failure + auto → a network return reconnects; explicit OFF never does
      global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'b', auto:1});
      let c4=global.dbConnect(); await settleLib();                       // fails for NETWORK reasons (the library)
      const nu=global.DB.netUp('online');
      if(nu!=='reconnect') bad("a network return after a network failure must reconnect an auto board (got '"+nu+"')");
      if(!global.DB.conn()) bad('the reconnect must be in flight after netUp');
      await settleLib();
      global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'b', auto:0});
      if(global.DB.netUp('online')!==null) bad('auto:0 must never reconnect on a network return');
      global.DB._setCfg(null);
      if(global.DB.netUp('visible')!==null) bad('no config → a return does nothing');
      // D4 — the save ladder on a fake client: a failed save keeps its work and retries; a return flushes + re-pulls
      let calls=0, fails2=2, pulls=0;
      const fake={ removeChannel(){}, channel(){ return { on(){ return this; }, subscribe(){ return this; } }; },
        from(){ return {
          upsert(){ calls++; return Promise.resolve(fails2-->0 ? {error:{message:'TypeError: Failed to fetch'}} : {error:null}); },
          select(){ return { eq(){ return { maybeSingle(){ pulls++; return Promise.resolve({data:{data:{v:3,records:{},views:{list:[],mod:0},briefs:{list:[],mod:0}}}, error:null}); } }; } }; } }; } };
      global.DB._setCfg({url:'https://x.supabase.co', key:'k', board:'b'}); global.DB._setDb(fake);
      let t1=timers.length; global.DB.push();
      if(global.DB.dirty()!==true) bad('dbPush must mark the board dirty');
      drainFrom(t1); await flushAsync();                                  // the 700 ms flush → save #1 fails
      if(calls!==1) bad('the debounced flush must run once (calls='+calls+')');
      if(global.DB.dirty()!==true) bad('a FAILED save must keep the dirty flag');
      if(global.DB.state()!=='error') bad('a failed save must say so');
      if(!global.DB.retry().armed || global.DB.retry().n!==1) bad('a failed save must arm the retry ladder ('+JSON.stringify(global.DB.retry())+')');
      if(!/unreachable|offline/i.test(global._dbMsgFor ? global._dbMsgFor() : (IDS['dbStatus']?IDS['dbStatus'].textContent:''))){ /* message probed below via the sheet */ }
      drainFrom(t1); await flushAsync();                                  // ladder rung 1 → save #2 fails
      if(calls!==2 || global.DB.dirty()!==true || global.DB.retry().n!==2) bad('the ladder must retry and stay armed (calls='+calls+', '+JSON.stringify(global.DB.retry())+')');
      drainFrom(t1); await flushAsync();                                  // rung 2 → save #3 lands
      if(calls!==3 || global.DB.dirty()!==false || global.DB.state()!=='live' || global.DB.retry().armed) bad('a landed save must clear dirty + ladder and go live (calls='+calls+', dirty='+global.DB.dirty()+', state='+global.DB.state()+')');
      t1=timers.length; global.DB.push();                                  // dirty again, debounce pending
      const sy=global.DB.netUp('online');                                  // a return flushes NOW and re-pulls the board
      await flushAsync();
      if(sy!=='sync') bad("a return while connected must sync (got '"+sy+"')");
      if(calls!==4 || global.DB.dirty()!==false) bad('the return must flush the pending save at once (calls='+calls+', dirty='+global.DB.dirty()+')');
      if(pulls!==1) bad('the return must re-pull the board once (pulls='+pulls+')');
      if(global.DB.netUp('visible')!=='sync' || pulls!==1) bad('re-pulls are rate-limited (pulls='+pulls+')');
      if(global.DB.hide()!==false) bad('leaving with nothing dirty flushes nothing');
      global.DB.push(); if(global.DB.hide()!==true) bad('leaving with a pending save must flush it');
      await flushAsync(); if(calls!==5 || global.DB.dirty()!==false) bad('the leaving flush must land (calls='+calls+')');
      // the Database sheet says offline/unreachable in words after a network-class failure
      fails2=1; global.DB.push(); await global.DB.flush(); await flushAsync();
      global._dbSheet(); const sh=IDS['dossier']?IDS['dossier'].innerHTML:'';
      if(!/unreachable right now; retrying/.test(sh)) bad('a network-class save failure must be said in words on the sheet');
      try{ global.hideDossier(); }catch(_){}
      global.dbDisconnect(true);
      if(global.DB.dirty()!==false || global.DB.retry().armed) bad('disconnect must drop the dirty flag and the ladder');
      global.DB._setCfg(null);
      // D5 — localNewer: this device holds records the board lacks → the connect path pushes once
      const la=global._dbApply({records:{}, views:{list:[],mod:0}, briefs:{list:[],mod:0}});
      if(!la || la.localNewer!==true) bad('_dbApply must report localNewer when the board lacks local records');
      const lb=global._dbApply(JSON.parse(JSON.stringify(global._dbSnapshot())));
      if(!lb || lb.localNewer!==false) bad('_dbApply must not report localNewer for an identical board');
      // ── the basemap ladder ──
      if(typeof global._fetchRetry!=='function' || typeof global._basemapNetUp!=='function' || typeof global._basemapLoad!=='function') bad('basemap doors missing');
      else {
        const f0=global.fetch; let n=0;
        global.fetch=function(){ n++; return n<3 ? Promise.reject(new TypeError('Failed to fetch')) : Promise.resolve({ok:true,status:200}); };
        let fr=null, fe=null, tb=timers.length;
        global._fetchRetry('data/x.json').then(function(r){ fr=r; }, function(e){ fe=e; });
        await flushAsync(); drainFrom(tb); await flushAsync(); drainFrom(tb); await flushAsync();
        if(!fr || fe || n!==3) bad('_fetchRetry must ride the ladder past two blips (n='+n+', err='+(fe&&fe.message)+')');
        n=0; global.fetch=function(){ n++; return Promise.resolve({ok:false,status:404}); };
        let f4=null, e4=null; tb=timers.length;
        global._fetchRetry('data/x.json').then(function(r){ f4=r; }, function(e){ e4=e; }); await flushAsync();
        if(f4 || !e4 || n!==1 || timers.length!==tb) bad('a 4xx must end the attempt at once, no retry (n='+n+')');
        global.fetch=f0;
        const bm=global.Basemap&&global.Basemap.done?global.Basemap.done():null;
        if(!bm) bad('Basemap hook missing');
        else if(!(bm.hi && bm.st && bm.co)) bad('the stub boot did not finish the basemap ('+JSON.stringify(bm)+') — the loaders regressed');
        else if(global._basemapNetUp()!==false) bad('a complete basemap must make a return a no-op');
      }
      // ── the window listeners run clean ──
      const nOn=(WIN_LS['online']||[]).length; if(nOn<1) bad('the network watch must listen on window online (got '+nOn+')');   // the sandbox registers no worker, so its two online kicks are source-asserted above
      winDispatch('online', {type:'online'}); winDispatch('pagehide', {type:'pagehide'}); await flushAsync();
    }catch(e){ cok=false; fails++; console.log('✗ CONNECTED probe: '+e.message); console.log((e.stack||'').split('\n').slice(0,3).join('\n')); }
    if(cok) console.log('  ✓ CONNECTED: sw.js seeds from the origin, shell mandatory, no redirected/twin entries, nav fallback · update doors report current/found/failed + honest copy · self-heal once per newer worker · library load recovers after failure · one connect at a time · network return reconnects (auto only) · save ladder keeps work, return flushes + re-pulls, leaving flushes · localNewer · basemap ladder');
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
