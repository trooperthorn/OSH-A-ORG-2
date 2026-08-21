// GLOBE HARNESS — executes the REAL m1 math + m5 marker/arc code over the REAL
// data/sites.json. Mirrors A-ORG-1 tools/harness_draw.js: parse checks can't see
// runtime throws inside the dot loop, and a boot smoke's "frame" never reaches the
// marker body. This one does, by force — plus it proves the math laws the engine
// rests on (projection finiteness, antipodal front/back flip, selection arc
// synthesis, the globeMetrics radius law R = min(w,h)/2 * zoom * baseK).
//
// Source resolution (mission contract: support both, modules first when no app file):
//   1. index.html exists (integration landed) → extract the <script> that carries
//      drawGlobeMarkers, exactly like harness_draw.
//   2. otherwise → concatenate modules/m1-geom.js + m2-render.js + m5-markers.js in
//      @SCRIPT order (the same ONE-script topology integration will produce).
// Node ≥18, zero deps. Run from anywhere: paths resolve against the repo root.
const fs=require('fs'), path=require('path');
const ROOT=path.resolve(__dirname,'..');

// ── source ──────────────────────────────────────────────────────────────────────
let code=null, mode=null;
const IDX=path.join(ROOT,'index.html');
if(fs.existsSync(IDX)){
  const html=fs.readFileSync(IDX,'utf8');
  const s=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(t=>t.includes('function drawGlobeMarkers'));
  if(s){ code=s; mode='index.html'; }
}
if(!code){
  const mods=['m1-geom.js','m2-render.js','m5-markers.js'].map(f=>path.join(ROOT,'modules',f));
  if(mods.every(p=>fs.existsSync(p))){ code=mods.map(p=>fs.readFileSync(p,'utf8')).join('\n;\n'); mode='modules (m1-geom + m2-render + m5-markers)'; }
}
if(!code){
  if(!fs.existsSync(IDX) && !fs.existsSync(path.join(ROOT,'modules','m1-geom.js'))){
    console.log('GLOBE HARNESS SKIP (no index.html and no modules/m1-geom.js — nothing built yet)');
    process.exit(0);
  }
  console.log('✗ SOURCE: index.html has no drawGlobeMarkers <script> and modules/ is incomplete');
  console.log('GLOBE HARNESS FAIL (1)');
  process.exit(1);
}

// ── data ────────────────────────────────────────────────────────────────────────
const DATA=JSON.parse(fs.readFileSync(path.join(ROOT,'data','sites.json'),'utf8'));
const SITES_JSON=DATA.sites||[];

// ── DOM/canvas stubs (phone-shaped: nothing here is a real browser) ─────────────
let fails=0;
function makeCtx(counts){
  return new Proxy({},{
    get:(t,p)=>{
      if(typeof p==='symbol') return undefined;
      if(p==='canvas') return {width:400,height:400};
      if(p==='measureText') return s=>{ counts.measureText=(counts.measureText||0)+1; return {width:String(s).length*6}; };
      if(p==='createRadialGradient'||p==='createLinearGradient') return ()=>({addColorStop:()=>{}});
      return (...a)=>{ counts[p]=(counts[p]||0)+1; };
    },
    set:()=>true
  });
}
function makeCanvas(w,h){
  return { clientWidth:w, clientHeight:h, width:0, height:0, isConnected:true,
           getContext:()=>makeCtx({}), offsetParent:{}, getClientRects:()=>[{}],
           getBoundingClientRect:()=>({left:0,top:0,right:w,bottom:h,width:w,height:h}) };
}
global.window=global;
global.devicePixelRatio=1;
global.document={
  documentElement:{ getAttribute:()=>null, setAttribute:()=>{}, style:{} },
  getElementById:()=>null, querySelector:()=>null, querySelectorAll:()=>[],
  addEventListener:()=>{}, removeEventListener:()=>{},
  createElement:()=>({ style:{}, setAttribute(){}, appendChild(){}, getContext:()=>makeCtx({}) }),
  body:{ appendChild(){}, style:{} }, head:{ appendChild(){} },
  hidden:false, visibilityState:'visible'
};
global.getComputedStyle=()=>({ getPropertyValue:()=>'', display:'block', visibility:'visible' });
global.requestAnimationFrame=()=>0; global.cancelAnimationFrame=()=>{};
global.matchMedia=()=>({ matches:false, addEventListener(){}, addListener(){} });
global.navigator={ userAgent:'harness' };
global.addEventListener=()=>{}; global.removeEventListener=()=>{};
global.localStorage={ getItem:()=>null, setItem(){}, removeItem(){} };
global.fetch=()=>Promise.resolve({ ok:false, status:404, json:async()=>({}), text:async()=>'' });
// Shared-contract state, pre-seeded (index.html mode replaces it with the shell's own
// object via window.GlobeState — always re-resolve AFTER eval, mutate fields in place).
global.GlobeState={ q:[0,0,0,1], yaw:0, pitch:0, rotLon:0, rotLat:0, zoom:1.5, baseK:0.72,
                    dirty:false, sel:null, dragging:false, raf:null };
global.SITES=SITES_JSON;

// ── eval the real code (indirect eval → sloppy global Script, like the shipped tag).
// harness_draw's chameleon: provision any stray missing global and retry.
function chameleon(){ const f=function(){ return p; }; const p=new Proxy(f,{ get:(t,k)=> (k===Symbol.toPrimitive? (()=>0) : (k==='has'? (()=>false) : p)), apply:()=>p, has:()=>true }); return p; }
let tries=0, evalOK=false;
while(tries<25){
  tries++;
  try{ (0,eval)(code); evalOK=true; break; }
  catch(e){
    const m=/(\w+) is not defined/.exec(e.message||'');
    if(m && tries<25){ global[m[1]]=chameleon(); continue; }
    fails++;
    console.log('✗ EVAL THROW ['+mode+']:', e.message);
    console.log((e.stack||'').split('\n').slice(0,4).join('\n'));
    break;
  }
}
if(evalOK) console.log('✓ source loaded: '+mode+' (provisioned '+(tries-1)+' stub globals)');

const G=global, GS=global.GlobeState;
const NEED=['_setGlobeRot','_projectLonLat','_projectVec','lonLatToVec','_qNorm','_qFromAxisAngle',
            'globeMetrics','_syncSelArcs','drawGlobeLinks','drawGlobeMarkers','drawMarkersHook','siteHitTest'];
const missing=NEED.filter(n=>typeof G[n]!=='function');
if(missing.length){ fails++; console.log('✗ PORTED NAMES missing (A-ORG-1 names are the contract):', missing.join(', ')); }

// the site list the code actually sees must be the JSON (SITES injection contract)
const LIVE=(typeof G._sitesArr==='function')?G._sitesArr():(G.SITES||[]);
if(LIVE.length!==SITES_JSON.length){ fails++; console.log('✗ SITES: code sees '+LIVE.length+' sites, data/sites.json has '+SITES_JSON.length); }

if(!fails){
  const cv=makeCanvas(400,400);
  GS.zoom=1.5; GS.baseK=0.72; GS.sel=null;

  // seeded PRNG → the 8 "random" orientations are reproducible run to run
  function mulberry32(a){ return function(){ a|=0; a=(a+0x6D2B79F5)|0; let t=Math.imul(a^(a>>>15),1|a); t=(t+Math.imul(t^(t>>>7),61|t))^t; return ((t^(t>>>14))>>>0)/4294967296; }; }
  const rnd=mulberry32(0xA0B2);
  const QS=[]; while(QS.length<8){ const q=[rnd()*2-1,rnd()*2-1,rnd()*2-1,rnd()*2-1]; if(Math.hypot(...q)>1e-3) QS.push(G._qNorm(q)); }
  const LOCATED=SITES_JSON.filter(s=>s.lat!=null&&s.lon!=null&&isFinite(s.lat)&&isFinite(s.lon));

  // ── 1. PROJECTION: every located site → finite, on-disc coords, 8 orientations ──
  try{
    let n=0, bad=0, firstBad=null;
    for(const q of QS){
      GS.q=q; G._setGlobeRot(GS.rotLon,GS.rotLat);
      const m=G.globeMetrics(cv);
      for(const s of LOCATED){
        const p=G._projectLonLat(s.lon,s.lat,m); n++;
        const finite=Number.isFinite(p[0])&&Number.isFinite(p[1])&&Number.isFinite(p[2]);
        const onDisc=finite && Math.hypot(p[0]-m.cx,p[1]-m.cy)<=m.R+1e-6 && Math.abs(p[2])<=1+1e-9;
        if(!finite||!onDisc){ bad++; if(!firstBad) firstBad=s.id+' → ['+p+']'; }
      }
    }
    if(bad){ fails++; console.log('✗ PROJECTION: '+bad+'/'+n+' projections broke (first: '+firstBad+')'); }
    else console.log('✓ PROJECTION: '+LOCATED.length+' sites × 8 orientations → '+n+' finite on-disc projections (dist ≤ R, |depth| ≤ 1)');
  }catch(e){ fails++; console.log('✗ PROJECTION crashed:', e.message); }

  // ── 2. ANTIPODES: front/back flips when a site crosses to the far hemisphere ────
  try{
    let n=0, skip=0, bad=0, firstBad=null, visDisagree=0;
    for(const q of QS){
      GS.q=q; G._setGlobeRot(GS.rotLon,GS.rotLat);
      const m=G.globeMetrics(cv);
      for(const s of LOCATED){
        const d=G._projectLonLat(s.lon,s.lat,m)[2];
        const aLon=s.lon>=0?s.lon-180:s.lon+180, aLat=-s.lat;
        const da=G._projectLonLat(aLon,aLat,m)[2];
        if(Math.abs(d)<1e-7){ skip++; continue; }            // limb-grazer: sign is noise
        n++;
        if(!(d*da<0 && Math.abs(d+da)<1e-6)){ bad++; if(!firstBad) firstBad=s.id+' d='+d+' anti='+da; }
        if(typeof G._visibleLonLat==='function' && G._visibleLonLat(s.lon,s.lat)!==(d>=0)) visDisagree++;
      }
    }
    if(bad){ fails++; console.log('✗ ANTIPODES: '+bad+'/'+n+' pairs failed to flip (first: '+firstBad+')'); }
    else if(visDisagree){ fails++; console.log('✗ ANTIPODES: _visibleLonLat disagreed with projection depth '+visDisagree+'×'); }
    else console.log('✓ ANTIPODES: front/back flipped across '+n+' site↔antipode pairs (depth sums ≈ 0; '+skip+' limb-grazers skipped)'+(typeof G._visibleLonLat==='function'?'; _visibleLonLat agrees':''));
  }catch(e){ fails++; console.log('✗ ANTIPODES crashed:', e.message); }

  // ── 3. SELECTION ARCS + THE DOT LOOP over a parent+children site, faced center ──
  try{
    // independent expectation straight from the JSONs (never from the code under
    // test) — v0.11.0: the ORG TREE (data/orgs.json) is the structure.
    const byId=new Map(SITES_JSON.map(s=>[s.id,s]));
    const ORGS_JSON=JSON.parse(fs.readFileSync(path.join(ROOT,'data/orgs.json'),'utf8')).orgs;
    const oById=new Map(ORGS_JSON.map(o=>[o.id,o]));
    const loc=s=>s&&s.lat!=null&&s.lon!=null;
    function oEff(oid){ let c=oById.get(oid),h=0; while(c&&h<=8){ if(c.site) return c.site; c=oById.get(c.parent); h++; } return null; }
    function primary(siteId){ const a=ORGS_JSON.filter(o=>o.site===siteId); if(!a.length) return null; let b=a[0]; for(const o of a){ if(o.lvl<b.lvl) b=o; } return b; }
    function expUp(s){ const po=primary(s.id); if(!po) return [];
      const out=[]; let from=s; let c=oById.get(po.id); const seen=new Set([po.id]);
      while(c&&c.parent&&!seen.has(c.parent)){ seen.add(c.parent); c=oById.get(c.parent); if(!c) break;
        const ps=byId.get(oEff(c.id)||''); if(!ps||!loc(ps)) continue;
        if(ps.id!==from.id && !(ps.lat===from.lat&&ps.lon===from.lon)){ out.push(ps.id); from=ps; } }
      return out; }
    function expDown(s){ const po=primary(s.id); if(!po) return [];
      const seenK=new Set(); const out=[];
      for(const c of ORGS_JSON.filter(o=>o.parent===po.id)){
        const sid=oEff(c.id); if(!sid||seenK.has(sid)) continue; seenK.add(sid);
        const cs=byId.get(sid); if(!cs||!loc(cs)) continue;
        if(cs.lat===s.lat&&cs.lon===s.lon) continue;
        out.push(cs.id);
      } return out; }
    const sel=SITES_JSON.find(s=>loc(s)&&primary(s.id)&&expUp(s).length>0&&expDown(s).length>0);
    if(!sel) throw new Error('no located site whose primary org has located ancestors and children');
    const UP=expUp(sel), DOWN=expDown(sel);

    // face the selected site: q rotates its unit vector onto +z (depth → 1)
    const v=G.lonLatToVec(sel.lon,sel.lat);
    const dz=Math.max(-1,Math.min(1,v[2])), ax=v[1], ay=-v[0], nn=Math.hypot(ax,ay);   // axis = v × z
    GS.q=(nn<1e-9)?(dz>0?[0,0,0,1]:G._qFromAxisAngle(1,0,0,Math.PI)):G._qNorm(G._qFromAxisAngle(ax/nn,ay/nn,0,Math.acos(dz)));
    G._setGlobeRot(GS.rotLon,GS.rotLat);
    const m=G.globeMetrics(cv);
    const dSel=G._projectLonLat(sel.lon,sel.lat,m)[2];
    if(!(dSel>0.999)) throw new Error('face-quaternion failed: sel depth '+dSel);

    GS.sel=sel.id;
    GS.selOrg=primary(sel.id).id;                          // the selection's chain driver (v0.11.0)
    G._syncSelArcs(sel.id);
    const up=GS._hqArc||[], down=GS._cmdLinkArcs||[];
    if(up.length!==UP.length||down.length!==DOWN.length){
      fails++; console.log('✗ SEL ARCS: '+sel.id+' built '+up.length+' up / '+down.length+' down; data says '+UP.length+' / '+DOWN.length);
    } else if(!(GS._cmdSites&&GS._cmdSites.has(sel.id)&&UP.every(id=>GS._cmdSites.has(id))&&DOWN.every(id=>GS._cmdSites.has(id)))){
      fails++; console.log('✗ SEL ARCS: _cmdSites is missing chain members');
    } else {
      const lc={}, lctx=makeCtx(lc);
      G.drawGlobeLinks(lctx,m);
      const segs=lc.lineTo||0;
      if(!(segs>0&&(lc.stroke||0)>0)){ fails++; console.log('✗ SEL ARCS: drawGlobeLinks emitted '+segs+' segments, '+(lc.stroke||0)+' strokes — arcs never reached the canvas'); }
      else console.log('✓ SEL ARCS: '+sel.id+' → '+up.length+' gold hop(s) up ('+UP.join('→')+') + '+down.length+' blue child arc(s); drawGlobeLinks drew '+segs+' path segments, '+lc.stroke+' strokes');
    }

    // full marker pass — the v6.6.1-class landmine check: every dot body executes.
    // v0.6.0: reticle = interior+core (2 arcs) + HQ concentric ring; the selected
    // site draws a DIAMOND (rects, no arcs). Assert a floor, not an exact count.
    GS.zoom=2.0;                                           // above the cluster gate
    const front=LOCATED.filter(s=>G._projectLonLat(s.lon,s.lat,m)[2]>=0).length;
    const mc={}, mctx=makeCtx(mc);
    G.drawMarkersHook(mctx,m);
    const scr=(GS._screen||[]).length, minArc=front*2-2;   // interior+core per dot (sel draws rects instead)
    if(scr!==front){ fails++; console.log('✗ DRAW PATH: _screen cached '+scr+' dots, '+front+' sites are front-hemisphere'); }
    else if((mc.arc||0)<minArc){ fails++; console.log('✗ DRAW PATH: '+(mc.arc||0)+' ctx.arc calls, expected ≥'+minArc+' ('+front+'×2 reticle floor)'); }
    else if((mc.save||0)!==(mc.restore||0)){ fails++; console.log('✗ DRAW PATH: ctx.save/restore unbalanced ('+(mc.save||0)+'/'+(mc.restore||0)+')'); }
    else if(!((mc.fillText||0)>0)){ fails++; console.log('✗ DRAW PATH: no chain label reached fillText'); }
    else {
      const hit=G.siteHitTest(m.cx,m.cy);
      if(!hit||!(hit.id===sel.id||(hit.lat===sel.lat&&hit.lon===sel.lon))){ fails++; console.log('✗ DRAW PATH: center hit-test returned '+(hit&&hit.id)+', expected '+sel.id); }
      else console.log('✓ DRAW PATH: drawMarkersHook over '+LOCATED.length+' sites → '+scr+' front dots in _screen, '+mc.arc+' ctx.arc calls, save/restore balanced, hit-test at center → '+hit.id);
    }
    // ── CLUSTER GATE (v0.6.0): below zoom 1.6 ordinary sites divert to badges ──
    {
      GS.zoom=1.2; GS._clu=null; GS._cluHits=null;
      const cc={}, cctx=makeCtx(cc);
      G.drawMarkersHook(cctx,m);
      const badges=(GS._cluHits||[]).length;
      if(!(badges>0)){ fails++; console.log('✗ CLUSTERS: zoom 1.2 produced no badges'); }
      else if((cc.fillText||0)<1){ fails++; console.log('✗ CLUSTERS: no count text drawn'); }
      else console.log('✓ CLUSTERS: zoom 1.2 → '+badges+' badges with counts; singles return above the 1.6 gate');
      GS.zoom=2.0;
    }
    GS.sel=null; G._syncSelArcs(null);
  }catch(e){ fails++; console.log('✗ SEL/DRAW crashed:', e.message); console.log((e.stack||'').split('\n').slice(0,4).join('\n')); }

  // ── 4. RADIUS LAW: R = min(w,h)/2 * zoom * baseK, DPR clamp 2, backing sync ─────
  try{
    const T=[ [400,400,1.5,0.72,1], [800,600,2.2,0.88,3], [390,844,1.0,0.72,1] ];
    let bad=0;
    for(const [w,h,zoom,baseK,dpr] of T){
      const c=makeCanvas(w,h);
      global.devicePixelRatio=dpr; GS.zoom=zoom; GS.baseK=baseK;
      const m=G.globeMetrics(c);
      const R=Math.min(w,h)/2*zoom*baseK, dprC=Math.min(2,dpr);
      if(Math.abs(m.R-R)>1e-9||m.cx!==w/2||m.cy!==h/2||m.dpr!==dprC||c.width!==w*dprC||c.height!==h*dprC){
        bad++; console.log('✗ RADIUS LAW: ('+w+'×'+h+', zoom '+zoom+', baseK '+baseK+', dpr '+dpr+') → R='+m.R+' (law says '+R+'), backing '+c.width+'×'+c.height);
      }
    }
    // the 0.72 fallback is part of the law
    const c2=makeCanvas(400,400); global.devicePixelRatio=1; GS.zoom=1; GS.baseK=0;
    if(Math.abs(G.globeMetrics(c2).R-200*0.72)>1e-9){ bad++; console.log('✗ RADIUS LAW: baseK falsy did not fall back to 0.72'); }
    if(bad) fails+=bad;
    else console.log('✓ RADIUS LAW: 3 (w,h,zoom,baseK) triples obey R = min(w,h)/2·zoom·baseK — DPR clamped to 2, backing store synced, 0.72 fallback holds');
    GS.zoom=1.5; GS.baseK=0.72;
  }catch(e){ fails++; console.log('✗ RADIUS LAW crashed:', e.message); }
}

console.log(fails? ('GLOBE HARNESS FAIL ('+fails+')') : 'GLOBE HARNESS PASS');
process.exit(fails?1:0);
