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
  // v0.3.0: version lives in the ⋯ menu — probe the menu render instead.
  { const mb=IDS['menuBtn'], am=IDS['appMenu'];
    if(!mb||!am){ fails++; console.log('✗ menu dock missing (#menuBtn/#appMenu)'); }
    else { try{ global._renderAppMenu&&global._renderAppMenu(); }catch(_){}
      if(am.innerHTML.indexOf('A-ORG-2')<0){ fails++; console.log('✗ ⋯ menu did not stamp APP_VERSION'); }
      else console.log('  ✓ ⋯ menu stamps version: ok'); } }

  // ── PROBE: search index + ranking + render (s3) ──
  try{
    if(typeof global._searchEntries!=='function') throw new Error('_searchEntries not declared (s3-search absent from boot)');
    const n=global._searchEntries().length;
    const wantN=(function(){ try{ return JSON.parse(fs.readFileSync(__dirname+'/../data/sites.json','utf8')).sites.length; }catch(_){ return null; } })();
    if(wantN!=null && n!==wantN){ fails++; console.log('✗ SEARCH index '+n+' entries but data/sites.json has '+wantN+' — the inline SITES payload is stale or truncated'); }
    else if(!(n>200)){ fails++; console.log('✗ SEARCH index too small: '+n+' entries (contract: >200 sites)'); }
    else console.log('  ✓ search index built: '+n+' sites');
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
    if(!host || host.hidden!==false || host.innerHTML.indexOf('Fort Bragg')<0){
      fails++; console.log('✗ selectSite: #dossier not populated (hidden='+(host&&host.hidden)+', '+(host?host.innerHTML.length:0)+' chars)');
    } else console.log('  ✓ selectSite(fort-bragg): #dossier populated ('+host.innerHTML.length+' chars), dirty re-armed, sel='+GlobeState.sel);
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
    } else if(!sn.sites.every(function(r){ return r.family; })){
      fails++; console.log('✗ SNAPSHOT rows missing family keys');
    } else console.log('  ✓ snapshot: "'+sn.meta.title+'" · '+sn.sites.length+' sites in scope, families attached');
    if(typeof global.famOf==='function'){
      const f=global.famOf('fort-stewart');
      if(f!=='land'){ fails++; console.log('✗ famOf(fort-stewart) = '+f+' (expected land)'); }
      else console.log('  ✓ famOf walks the branch (fort-stewart → land)');
    }
    if(typeof global.renderLegend==='function'){
      global.renderLegend();
      const lg=IDS['legendPanel'];
      if(!lg || lg.innerHTML.indexOf('lg-row')<0){ fails++; console.log('✗ LEGEND did not render rows'); }
      else console.log('  ✓ legend rows rendered');
    }
    global.selectSite('fort-stewart');   // second stop → crumbs appear in the sheet header
    const dz=IDS['dossier'];
    if(!dz || dz.innerHTML.indexOf('sh-crumb')<0){ fails++; console.log('✗ TRAIL crumbs missing from the sheet header after two selections'); }
    else console.log('  ✓ trail crumbs render in the sheet header');
    if(typeof global.setMode==='function'){
      global.setMode('brief');
      const bs=IDS['briefStage'];
      const briefOn=(typeof document!=='undefined')&&document.body&&document.body.classList&&document.body.classList.contains('brief-mode');
      if(!briefOn){ fails++; console.log('✗ setMode(brief) did not flip body.brief-mode'); }
      if(!bs || bs.innerHTML.indexOf('bf-box')<0){ fails++; console.log('✗ BRIEF stage empty with a selection active'); }
      else console.log('  ✓ brief mode: body flag + tier boxes rendered');
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
    global._odSetTab('people');
    const host=IDS['dossier'];
    if(host.innerHTML.indexOf('Mercer')<0 || host.innerHTML.indexOf('People · 1')<0){ fails++; console.log('✗ RECORDS tab did not render the person'); }
    else console.log('  ✓ records: add + tab render (People · 1, row present)');
    global._odSetTab('ov');
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

  // ── PROBE: corner clocks populated (s5) ──
  { let ok=true;
    for(const id of ['clockTL','clockTR','clockBL','clockBR']){
      const el=IDS[id]; const h=el?el.innerHTML:'';
      if(!/ck-t/.test(h) || !/\d{2}:\d{2}/.test(h)){ ok=false; fails++; console.log('✗ CLOCK #'+id+' not populated: "'+String(h).slice(0,60)+'"'); }
    }
    if(ok) console.log('  ✓ corner clocks populated (TL/TR/BL/BR, HH:MM faces)');
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
