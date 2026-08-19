// ═══════════════════════════════════════════════════════════════════════════════
// m5-markers.js — A-ORG-2 M5 marker layer: dots, labels, selection ring, chain arcs
// (PORTED from A-ORG-1 index.html — the source is truth; names kept where code ported)
//
// Ported from A-ORG-1 (function/state names kept):
//   drawGlobeMarkers   (~L17382)  the dot loop: GlobeState._screen rebuild per frame,
//                                 depth fade max(0.3, rz), zoom-scaled radii, the
//                                 v16.14.0 glass-reticle dot (halo fill → dark glass
//                                 interior → thin neon stroke → bright core), the
//                                 selection pulse rings, and the v20.1.0/v21.2.0
//                                 label ZOOM LADDER with v21.1.0 priority culling.
//   _placeGlobeLabel   (~L17358)  collision-cell label placement (verbatim).
//   _gChromeZones      (~L17317)  live chrome exclusion rects (selector list adapted
//                                 to the A-ORG-2 shell ids — see deviation 4).
//   drawSubtleArcs     (~L17122)  great-circle arc sampling: slerp between unit
//                                 vectors, 40 segs, lift 1+0.08·sin(πf), front gate
//                                 v[2] >= -0.02, glow only when alpha > 0.5 (verbatim,
//                                 incl. the v16.2.0 directional-arrow option).
//   drawGlobeLinks     (~L17091)  arc families under the dots: _cmdLinkArcs subtle
//                                 blue web (1.25 / 0.5) + _hqArc bright gold lineage
//                                 (2.2 / 0.92) — same widths/alphas, colors → tokens.
//   _syncSelArcs       (~L15101)  selection → arc-set rebuild (adapted: site id in,
//                                 parent-pointer chain out — see deviation 1).
//   handleGlobeTap     (~L17893)  the best-dot hit loop (18px radius over
//                                 GlobeState._screen) → siteHitTest(x, y).
//   State names kept: GlobeState._screen (+ its `inst` field), GlobeState.__gLbl,
//   GlobeState.__gChrome, GlobeState._hqArc, GlobeState._cmdLinkArcs,
//   GlobeState._cmdSites, GlobeState._namesOff.
//
// NEW (A-ORG-2 contracts, no A-ORG-1 counterpart):
//   drawMarkersHook(ctx, m)   the m2 hook — calls drawGlobeLinks + drawGlobeMarkers
//                             exactly where A-ORG-1's drawGlobe called them (links
//                             first, markers over — source order at ~L16798/16808).
//   siteHitTest(x, y)         m3 tap-hook helper → site | null.
//   childrenOf(id) / parentChainOf(id) / siteById(id)   parent-pointer helpers over
//                             the SITES global (id-indexed, cache rebuilt when the
//                             SITES array identity changes).
//   _mTok() / _cssRGB()       token cache: getComputedStyle custom props read ONCE,
//                             re-read only when html[data-app-theme] changes (the
//                             per-frame cost is one attribute compare).
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. _syncSelArcs takes a SITE ID and walks the parent pointer — A-ORG-1's version
//      walked org-node links (node.links / _findPath / ext anchors), none of which
//      exist in A-ORG-2 (charter §2: cross-org link web is OUT; the parent pointer IS
//      the link model). It fills the two ported arc stores: GlobeState._hqArc = the
//      full chain UP (every located parent hop, gold/bright — A-ORG-1's _hqArc held
//      only the single nearest-ancestor arc; the full thread home is THE feature
//      here) and GlobeState._cmdLinkArcs = arcs DOWN to direct children only
//      (blue/dimmer — A-ORG-1's echelon web descended through expanded nodes; no
//      expansion model exists here, one echelon by design). Zero-length arcs
//      (co-located parent/child) are skipped, as in cmdLinkArcsForCommand.
//   2. All colors come from CSS tokens instead of A-ORG-1's literals: dots --text
//      (A-ORG-1 ice-white #eaf8ff), grp "oib" --signal (amber #ffb454), guard family
//      --dim (#9b8cff periwinkle), selection + child web --accent (doctrine blue
//      #36b6ff), lineage/HQ gold --signal (#ffd982 family), glass interiors and
//      label outlines --ground (so the halo stays background-colored in every
//      theme). Label fonts prefer the --body token with A-ORG-1's stack as fallback.
//      Brief tier tokens (--t1..--t4) are deliberately unused: brief drawing belongs
//      to the M3 brief owner, and no green goes anywhere near marker data anyway.
//   3. NO self-marked dirty in the draw path. A-ORG-1's drawGlobeMarkers set
//      GlobeState.dirty (throttled) to keep the selection pulse breathing;
//      m2-render.js moved that throttle into the frame loop (its deviation 3, keyed
//      on GlobeState.sel != null). The pulse here just reads performance.now() —
//      re-marking dirty from inside a draw would fight the redraw-only-when-dirty
//      law. globeMark() fires only from _syncSelArcs (an event, not a frame).
//   4. _gChromeZones measures the A-ORG-2 shell contract ids (#searchPill,
//      #searchResults, #dossier, #stageBar, #clockTL/TR/BL/BR, #themeSwitch,
//      #verChip) instead of A-ORG-1's v22 selector list, and its no-DOM fallback is
//      [] (A-ORG-1 fell back to its legacy v13 static zones, which describe a layout
//      A-ORG-2 never had).
//   5. NOT ported, with reasons: CONUS thinning + cluster reticles (v17.1.0/v18.2.0)
//      — the mission contract is ALWAYS-ON dots and A-ORG-2 carries 276 sites, not
//      A-ORG-1's marker classes × filters; focus/family/locations-off filters, brief
//      branches, co-location stack badges, tie/discoverability rings, the stepper's
//      gold label, _linkedSet — all hang off A-ORG-1 features that are OUT of scope
//      (§2). The diamond/triangle shape grammar is not ported because A-ORG-1 itself
//      retired it (v16.15.0: "everything is a circle"); _markerPath is therefore
//      inlined as plain arcs. The v18.4.1 arc-endpoint labeling pass is dropped
//      because every arc endpoint here IS a drawn dot (no filters hide them) — chain
//      labels render in the dot loop instead.
//   6. Selection sync is LAZY as well as explicit: drawGlobeMarkers rebuilds the arc
//      sets when GlobeState.sel changed since the last frame (A-ORG-1 called
//      _syncSelArcs from every selection path; A-ORG-2's selection owner just sets
//      GlobeState.sel + dirty and this module follows). _syncSelArcs stays exposed
//      for callers that want the rebuild immediately.
//   7. Chain-member labels draw at ANY zoom (the picture is the product); ordinary
//      sites climb the ported ladder — roots (parent === null, the closest thing to
//      A-ORG-1's kind:"hq") at 2.0, grp "oib" at 2.8, ordinary 3.2, guardInset 3.6,
//      grp "guard" never (A-ORG-1 skipped it outright), phones (+0.7, m.w < 700).
//   8. Selection pulse radius is pr+dotR (A-ORG-1: absolute pr=5.0±0.9) — at max
//      zoom A-ORG-1's dot outgrows its own ring; anchoring on dotR keeps the ring
//      outside the dot at every zoom. Breathing rate/amplitude unchanged.
//
// CONTRACTS HONORED:
//   - Reads SITES / GlobeState at call time only — concatenation-order safe.
//   - No DOM writes, no CSS, no position:fixed, no pointer capture, no webfonts:
//     canvas drawing only, fonts via token stack with system fallback.
//   - Plain sloppy-mode JS: top-level function declarations, no modules, no classes.
//   - Redraw law: nothing here forces per-frame redraws (deviation 3).
// ═══════════════════════════════════════════════════════════════════════════════

// ---- SITES index (parent pointer is the ONLY relationship) ---------------------
let _siteIdx=null, _kidIdx=null, _idxSrc=null;

function _sitesArr(){
  return (typeof SITES!=='undefined' && SITES && SITES.length!=null) ? SITES : [];
}

function _siteIndex(){
  const arr=_sitesArr();
  if(_idxSrc===arr && _siteIdx) return _siteIdx;
  _siteIdx=new Map(); _kidIdx=new Map();
  for(const s of arr){ if(s && s.id!=null) _siteIdx.set(s.id, s); }
  for(const s of arr){
    if(!s || s.parent==null || !_siteIdx.has(s.parent)) continue;
    let L=_kidIdx.get(s.parent); if(!L){ L=[]; _kidIdx.set(s.parent, L); }
    L.push(s);
  }
  _idxSrc=arr;
  return _siteIdx;
}

function siteById(id){ if(id==null) return null; return _siteIndex().get(id)||null; }

// Direct children of a site (fresh array — callers may sort/splice for their UI).
function childrenOf(id){ _siteIndex(); return (_kidIdx.get(id)||[]).slice(); }

// Chain UP from a site: [parent, grandparent, …, root]. Cycle-guarded so a bad
// parent pointer can never hang the render loop.
function parentChainOf(id){
  const out=[]; const seen=new Set([id]);
  let s=siteById(id);
  while(s && s.parent!=null && !seen.has(s.parent)){
    seen.add(s.parent);
    const p=siteById(s.parent); if(!p) break;
    out.push(p); s=p;
  }
  return out;
}

// ---- Token cache: custom props read once, re-read on theme change (deviation 2) ----
let _mTokCache=null, _mTokTheme=null;

function _cssRGB(c, fb){
  c=(c||'').trim();
  let m=/^#([0-9a-f]{3})$/i.exec(c);
  if(m){ const h=m[1]; return parseInt(h[0]+h[0],16)+','+parseInt(h[1]+h[1],16)+','+parseInt(h[2]+h[2],16); }
  m=/^#([0-9a-f]{6})/i.exec(c);
  if(m){ const h=m[1]; return parseInt(h.slice(0,2),16)+','+parseInt(h.slice(2,4),16)+','+parseInt(h.slice(4,6),16); }
  m=/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(c);
  if(m) return Math.round(+m[1])+','+Math.round(+m[2])+','+Math.round(+m[3]);
  return fb;
}

function _mTok(){
  const root=(typeof document!=='undefined')?document.documentElement:null;
  const th=root?(root.getAttribute('data-app-theme')||'arctic'):'arctic';
  if(_mTokCache && _mTokTheme===th) return _mTokCache;
  let rd=function(){ return ''; };
  try{ if(root){ const cs=getComputedStyle(root); rd=function(n){ return (cs.getPropertyValue(n)||'').trim(); }; } }catch(_){}
  const T={};
  // A-ORG-1's literal palette survives as the fallback triples, so the layer still
  // reads if a token is missing (harness stubs, boot order).
  T.text   = _cssRGB(rd('--text'),   '234,248,255');   // dots + labels (ice-white family)
  T.dim    = _cssRGB(rd('--dim'),    '155,140,255');   // guard family (was #9b8cff)
  T.accent = _cssRGB(rd('--accent'), '54,182,255');    // selection + child web (doctrine blue)
  T.signal = _cssRGB(rd('--signal'), '255,217,130');   // lineage gold + oib amber family
  T.ground = _cssRGB(rd('--ground'), '9,17,16');       // glass interiors, label outlines
  T.body   = rd('--body') || '-apple-system,system-ui,sans-serif';
  _mTokCache=T; _mTokTheme=th;
  return T;
}

// ---- Selection → arc sets (PORT of _syncSelArcs, adapted per deviation 1) ------
function _syncSelArcs(selId){
  try{
    GlobeState._selUp=null; GlobeState._selDown=null;
    GlobeState._cmdSites=null;
    if(selId==null){
      GlobeState._hqArc=null; GlobeState._cmdLinkArcs=null;
      if(typeof globeMark==='function') globeMark();
      return;
    }
    const s=siteById(selId);
    if(!s || s.lat==null || s.lon==null){
      GlobeState._hqArc=null; GlobeState._cmdLinkArcs=null;
      if(typeof globeMark==='function') globeMark();
      return;
    }
    // UP the parent chain — every located hop, selection → … → root (bright gold).
    const up=[]; const upSet=new Set();
    let from=s;
    for(const p of parentChainOf(selId)){
      if(p.lat==null || p.lon==null) continue;              // unlocated hop: chain continues from last located site
      if(!(p.lat===from.lat && p.lon===from.lon)){          // co-located hop draws no zero-length arc
        up.push({ from:{lon:from.lon, lat:from.lat, n:from.id}, to:{lon:p.lon, lat:p.lat, n:p.id}, rel:'parent' });
      }
      upSet.add(p.id);
      from=p;
    }
    // DOWN to DIRECT children only (dimmer blue web) — one echelon by design.
    const down=[]; const downSet=new Set();
    for(const c of childrenOf(selId)){
      if(c.lat==null || c.lon==null) continue;
      downSet.add(c.id);
      if(c.lat===s.lat && c.lon===s.lon) continue;          // co-located child: dot highlights, no arc
      down.push({ from:{lon:s.lon, lat:s.lat, n:s.id}, to:{lon:c.lon, lat:c.lat, n:c.id}, rel:'subordinate' });
    }
    GlobeState._hqArc = up.length?up:null;
    GlobeState._cmdLinkArcs = down.length?down:null;
    GlobeState._selUp=upSet; GlobeState._selDown=downSet;
    // _cmdSites (ported name): the whole selection picture — drives dot emphasis + labels.
    const all=new Set(upSet); downSet.forEach(function(id){ all.add(id); }); all.add(selId);
    GlobeState._cmdSites=all;
    if(typeof globeMark==='function') globeMark();
  }catch(_){}
}

// Lazy follow (deviation 6): the selection owner just sets GlobeState.sel + dirty.
function _selSyncCheck(){
  if(GlobeState._selSynced!==GlobeState.sel || GlobeState._selSyncSrc!==_sitesArr()){
    GlobeState._selSynced=GlobeState.sel;
    GlobeState._selSyncSrc=_sitesArr();
    _syncSelArcs(GlobeState.sel);
  }
}

// ---- Great-circle arcs (PORT of drawSubtleArcs — sampling verbatim) ------------
// Lightweight arc drawer: thin, semi-transparent, glow only past alpha 0.5.
function drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow){
  function slerpPts(aLon,aLat,bLon,bLat,segs){
    const a=lonLatToVec(aLon,aLat), b=lonLatToVec(bLon,bLat);
    let dot=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; dot=Math.max(-1,Math.min(1,dot));
    const om=Math.acos(dot); const so=Math.sin(om); const pts=[];
    for(let i=0;i<=segs;i++){ const f=i/segs; let w1,w2;
      if(so<1e-6){ w1=1-f; w2=f; } else { w1=Math.sin((1-f)*om)/so; w2=Math.sin(f*om)/so; }
      const lift=1+0.08*Math.sin(Math.PI*f);
      pts.push([ (a[0]*w1+b[0]*w2)*lift, (a[1]*w1+b[1]*w2)*lift, (a[2]*w1+b[2]*w2)*lift ]); }
    return pts;
  }
  ctx.save();
  ctx.lineWidth=(width||0.7); ctx.strokeStyle='rgba('+rgb+','+(alpha!=null?alpha:0.28)+')'; ctx.lineCap='round';
  if((alpha||0)>0.5){ ctx.shadowColor='rgba('+rgb+',0.85)'; ctx.shadowBlur=7; }
  arcs.forEach(arc=>{
    const pts=slerpPts(arc.from.lon,arc.from.lat, arc.to.lon,arc.to.lat, 40);
    let s=false; ctx.beginPath();
    let lastV=null, prevV=null;
    for(let i=0;i<pts.length;i++){ const v=_projectVec(pts[i], m); const front=v[2]>=-0.02;
      if(front){ if(!s){ ctx.moveTo(v[0],v[1]); s=true; } else ctx.lineTo(v[0],v[1]); prevV=lastV; lastV=v; } else s=false; }
    ctx.stroke();
    // directional arrowhead at the target — only when the target is front-facing.
    if(arrow && lastV && prevV){
      if(_visibleLonLat(arc.to.lon, arc.to.lat)){   // same front-hemisphere math, one projection cheaper
        const ang=Math.atan2(lastV[1]-prevV[1], lastV[0]-prevV[0]), ah=6.5;
        ctx.save(); ctx.shadowBlur=0; ctx.beginPath();
        ctx.moveTo(lastV[0], lastV[1]);
        ctx.lineTo(lastV[0]-ah*Math.cos(ang-0.45), lastV[1]-ah*Math.sin(ang-0.45));
        ctx.lineTo(lastV[0]-ah*Math.cos(ang+0.45), lastV[1]-ah*Math.sin(ang+0.45));
        ctx.closePath(); ctx.fillStyle='rgba('+rgb+',0.95)'; ctx.fill(); ctx.restore();
      }
    }
  });
  ctx.restore();
}

// ---- Arc families under the dots (PORT of drawGlobeLinks) ----------------------
function drawGlobeLinks(ctx, m){
  const T=_mTok();
  // Child web first (subtle, thin, static — hints the connection without a bright
  // tangle; the highlighted dots carry the "these belong to this site" meaning).
  if(GlobeState._cmdLinkArcs && GlobeState._cmdLinkArcs.length){
    drawSubtleArcs(ctx, m, GlobeState._cmdLinkArcs, T.accent, 1.25, 0.5);
  }
  // CHAIN TO HQ over the web — the gold lineage always reads while drilling around.
  if(GlobeState._hqArc && GlobeState._hqArc.length){
    drawSubtleArcs(ctx, m, GlobeState._hqArc, T.signal, 2.2, 0.92);
  }
}

// ---- Chrome exclusion zones (PORT of _gChromeZones — A-ORG-2 shell ids, dev. 4) ----
function _gChromeZones(m){
  const W=(m&&m.w)||800, H=(m&&m.h)||600;
  try{
    const cv=(typeof document!=='undefined') && document.getElementById && document.getElementById('globeCanvas');
    const cr=(cv && cv.getBoundingClientRect) ? cv.getBoundingClientRect() : null;
    if(cr && cr.width>0 && cr.height>0){
      const kx=W/cr.width, ky=H/cr.height, live=[], PAD=4;
      const sels=['#searchPill','#searchResults','#dossier','#stageBar',
                  '#clockTL','#clockTR','#clockBL','#clockBR','#themeSwitch','#verChip'];
      for(const s of sels){
        const el=document.querySelector(s); if(!el) continue;
        const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
        const r=el.getBoundingClientRect(); if(!r.width||!r.height) continue;
        const x0=(r.left-cr.left)*kx-PAD, y0=(r.top-cr.top)*ky-PAD;
        const x1=(r.right-cr.left)*kx+PAD, y1=(r.bottom-cr.top)*ky+PAD;
        if(x1<0||y1<0||x0>W||y0>H) continue;
        live.push({x0:x0, y0:y0, x1:x1, y1:y1});
      }
      return live;
    }
  }catch(_){}
  return [];   // stubbed-DOM runs (harness): no chrome, no zones
}

// ---- Label placement (PORT of _placeGlobeLabel — verbatim) ---------------------
function _placeGlobeLabel(ctx, sx, sy, w, m, rects, opts){
  opts=opts||{};
  const W=(m&&m.w)||800, H=(m&&m.h)||600;
  const gap=opts.gap!=null?opts.gap:8, h=opts.h!=null?opts.h:13;
  const L=6, R=W-6, T=6, B=H-6;
  const chrome=(GlobeState.__gChrome||(GlobeState.__gChrome=_gChromeZones(m)));
  let ax;
  if(opts.center){ ax=sx-w/2; } else { ax=sx+gap; if(ax+w>R) ax=sx-gap-w; }
  const ys = opts.above ? [sy, sy-16, sy-32, sy+18, sy-48, sy+34]
                        : [sy+4, sy-15, sy+19, sy-30, sy+34, sy-45];
  for(const cy of ys){
    const x=Math.max(L, Math.min(ax, R-w));
    const y=Math.max(T+h, Math.min(cy, B));
    const bx={x0:x-2, y0:y-h+2, x1:x+w+2, y1:y+3};
    // a label that cannot fit inside the canvas at either anchor — or that the edge
    // clamp dragged onto its own marker — is skipped (dot-only)
    let hit=(bx.x1>R+2 || bx.x0<L-2 || Math.abs(x-ax)>4);
    if(!hit) for(const b of rects){ if(bx.x0<b.x1&&bx.x1>b.x0&&bx.y0<b.y1&&bx.y1>b.y0){ hit=true; break; } }
    if(!hit) for(const c of chrome){ if(bx.x0<c.x1&&bx.x1>c.x0&&bx.y0<c.y1&&bx.y1>c.y0){ hit=true; break; } }
    if(!hit){ rects.push(bx); return {x,y}; }
  }
  return null;
}

// ---- The dot loop (PORT of drawGlobeMarkers) ------------------------------------
function drawGlobeMarkers(ctx, m){
  const T=_mTok();
  GlobeState._screen=[];                              // hit-test cache, rebuilt per draw
  GlobeState.__gLbl=[]; GlobeState.__gChrome=null;    // shared label rects + chrome zones, per frame
  const tnow=performance.now()/1000;
  const selId=GlobeState.sel;
  const upSet=GlobeState._selUp, downSet=GlobeState._selDown;
  const cmdSites=GlobeState._cmdSites;
  const zb=Math.min(2.4, 1 + (GlobeState.zoom-1)*0.14);   // dots grow a little as you zoom in
  const rScale=Math.min(2.1, 0.85+zb*0.16);
  const bodyFont=T.body;

  for(const inst of _sitesArr()){
    if(inst.lat==null||inst.lon==null) continue;
    const p=_projectLonLat(inst.lon, inst.lat, m);
    if(p[2]<0) continue;
    const sx=p[0], sy=p[1];
    const fade=Math.max(0.3, p[2]);
    const isSel=(selId!=null && inst.id===selId);
    const isUp=!!(upSet && upSet.has(inst.id));
    const isDown=!!(downSet && downSet.has(inst.id));
    const onChain=isSel||isUp||isDown;
    const isGuard=(inst.grp==='guard'||inst.grp==='guardInset');
    const isOib=(inst.grp==='oib');
    // class hue via tokens (deviation 2): lineage gold up, doctrine blue down/selected,
    // amber industrial base, dim guard, ice-white default.
    const col = isSel||isDown ? T.accent : (isUp ? T.signal : (isOib ? T.signal : (isGuard ? T.dim : T.text)));
    const dotR=(isSel?3.4:(onChain?2.9:(isGuard?2.1:2.5)))*rScale;

    // selection pulse rings — the ring pair breathes on m2's sel-keyed throttle
    // (deviation 3: no dirty-marking here).
    if(isSel){
      const pr=5.0 + Math.sin(tnow*2.4 + sx*0.05)*0.9;
      ctx.beginPath(); ctx.arc(sx,sy, pr+dotR, 0, Math.PI*2);
      ctx.strokeStyle='rgba('+T.accent+','+(0.7*fade)+')'; ctx.lineWidth=1.6; ctx.stroke();
      ctx.beginPath(); ctx.arc(sx,sy, pr+dotR+3, 0, Math.PI*2);
      ctx.strokeStyle='rgba('+T.accent+','+(0.25*fade)+')'; ctx.lineWidth=1.2; ctx.stroke();
    }

    // GLASS RETICLE — halo, dark glass interior, thin neon stroke, bright core.
    // The halo is a low-alpha oversized fill, deliberately NOT ctx.shadowBlur: a real
    // shadow on ~276 markers costs a blur pass each and drops frames on a phone.
    const rr=dotR*1.16;                               // stroke shapes read smaller than fills
    ctx.globalAlpha=(onChain?0.22:0.10)*fade;
    ctx.fillStyle='rgb('+col+')';
    ctx.beginPath(); ctx.arc(sx, sy, rr*1.7, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha=fade*(isGuard&&!onChain?0.85:1);
    ctx.beginPath(); ctx.arc(sx, sy, rr, 0, Math.PI*2);
    ctx.fillStyle='rgba('+T.ground+',0.78)'; ctx.fill();      // dark glass interior
    ctx.lineWidth=onChain?1.8:1.5; ctx.strokeStyle='rgb('+col+')'; ctx.stroke();   // thin neon frame
    ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.9, rr*0.34), 0, Math.PI*2);
    ctx.fillStyle='rgb('+col+')'; ctx.fill();                 // bright core
    ctx.globalAlpha=1;

    // chain-member labels draw at ANY zoom — the picture is the product (deviation 7).
    if(onChain && !GlobeState._namesOff){
      const _nm=inst.unit||inst.base||inst.id;
      const _fs=(m.w<560?12:11);
      ctx.save();
      ctx.textBaseline='middle';
      ctx.font='800 '+_fs+'px '+bodyFont;
      const _tw=ctx.measureText(_nm).width;
      const _pos=_placeGlobeLabel(ctx, sx, sy, _tw, m, GlobeState.__gLbl, {gap:dotR+7, h:14});
      if(_pos){
        ctx.lineWidth=(_fs>11?3.6:3.2); ctx.strokeStyle='rgba('+T.ground+',.9)'; ctx.strokeText(_nm, _pos.x, _pos.y);
        ctx.fillStyle='rgba('+col+',1)'; ctx.fillText(_nm, _pos.x, _pos.y);
      }
      ctx.restore();
    }

    GlobeState._screen.push({inst, sx, sy, depth:p[2]});
  }

  // Tiny labels for the rest, zoom-gated (keeps world view clean).
  if(GlobeState.zoom >= 1.5 && !GlobeState._namesOff){
    ctx.save();
    try{ ctx.letterSpacing='0.35px'; }catch(_){}
    ctx.textBaseline='middle';
    // PRIORITY CULLING: placement is first-come-first-served on collision cells, so
    // iterate a priority-sorted copy — chain picture, then roots, depots, bases, guard.
    const _lblPr=function(s){ const i=s.inst;
      if(cmdSites && cmdSites.has(i.id)) return 0;
      if(i.parent==null) return 1;
      if(i.grp==='oib') return 2;
      if(i.grp==='guard'||i.grp==='guardInset') return 4;
      return 3; };
    const _lblQ=Array.from(GlobeState._screen).sort(function(a,b){ return _lblPr(a)-_lblPr(b); });
    for(const s of _lblQ){
      const inst=s.inst;
      if(inst.grp==='guard') continue;                // skip guard to reduce clutter
      if(s.depth<0.25) continue;
      if(cmdSites && cmdSites.has(inst.id)) continue; // chain labels already drew in the dot loop
      // ZOOM LADDER — density arrives as the room for it does; phones climb it 0.7
      // later because a narrow canvas has far less room per name.
      const _mzb=(m.w<700)?0.7:0;
      const _need=(inst.parent==null?2.0:(inst.grp==='oib'?2.8:(inst.grp==='guardInset'?3.6:3.2)))+_mzb;
      if(GlobeState.zoom < _need) continue;
      if(s.sx<1||s.sx>m.w-1||s.sy<1||s.sy>m.h-1) continue;   // off-map dot — don't orphan its label
      ctx.font='600 9.5px '+bodyFont;
      const name=inst.base||inst.id;
      const tw=ctx.measureText(name).width;
      const _pl=_placeGlobeLabel(ctx, s.sx, s.sy, tw, m, GlobeState.__gLbl, {h:12});
      if(!_pl) continue;
      ctx.shadowColor='rgba('+T.ground+',.9)'; ctx.shadowBlur=3; ctx.shadowOffsetY=1;
      ctx.lineWidth=2.2; ctx.strokeStyle='rgba('+T.ground+',.78)'; ctx.strokeText(name, _pl.x, _pl.y);
      ctx.shadowBlur=0; ctx.shadowOffsetY=0;
      ctx.fillStyle='rgba('+(inst.grp==='oib'?T.signal:T.text)+',.92)'; ctx.fillText(name, _pl.x, _pl.y);
    }
    ctx.restore();
  }
}

// ---- m2 hook: links under, markers over (A-ORG-1 drawGlobe order, ~L16798) -----
function drawMarkersHook(ctx, m){
  _selSyncCheck();
  drawGlobeLinks(ctx, m);
  drawGlobeMarkers(ctx, m);
}

// ---- Tap hit-test for m3 (PORT of handleGlobeTap's best-dot loop) --------------
// Canvas-relative coords in (what tapAtScreen receives); nearest front-hemisphere
// site within 18px, else null. Tests LAST FRAME's _screen — exactly A-ORG-1.
function siteHitTest(x, y){
  let best=null, bestD=18*18;
  for(const s of (GlobeState._screen||[])){
    const d=(s.sx-x)*(s.sx-x)+(s.sy-y)*(s.sy-y);
    if(d<bestD){ bestD=d; best=s; }
  }
  return best?best.inst:null;
}
