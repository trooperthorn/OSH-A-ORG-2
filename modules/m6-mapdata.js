/* ============================================================================
   modules/m6-mapdata.js — A-ORG-2 M6: map data — same-origin TopoJSON load+decode
   PORTED from A-ORG-1 index.html (globe data loaders ~L18337–18525, and
   _namedStateShapes ~L16889 — the decode is ported, not rewritten).

   A-ORG-1 functions ported (names kept):
     loadGlobeCoastlinesHi   — coastline loader (deviation 2: 110m→50m ladder)
     loadStateBorders        — US state borders (auto-detect lon/lat vs Albers)
     loadCountryBorders      — world country borders (thin context layer)
     decodeTopoLand          — land TopoJSON → lon/lat rings
     _decodeTopoLonLat       — generic TopoJSON → lon/lat rings (named object)
     decodeStatesTopo        — Albers-projected states → lon/lat rings (AK/HI
                               insets skipped by FIPS id)
     _albersUsaInvert        — inverse d3 Albers-USA (975x610 viewport)
     _ringsLookGeographic    — geographic-vs-projected coordinate sniff
     _namedStateShapes       — states decode KEEPING per-state identity;
                               fills GLOBE_STATE_SHAPES for the brief layer

   Writes into m2-render.js state (ASSIGN-ONLY — the `let` declarations live in
   m2-render.js; redeclaring them here would be a SyntaxError once all modules
   concatenate into the ONE <script>):
     GLOBE_RINGS, _globeLoadedHi,
     GLOBE_STATE_RINGS, GLOBE_STATE_SHAPES, _statesLoaded,
     GLOBE_COUNTRY_RINGS, _countriesLoaded
   After each swap it only sets GlobeState.dirty=true — the m2 render loop
   redraws on dirty; nothing here forces a frame or touches the DOM.

   DEVIATIONS from A-ORG-1 (each one deliberate):
   1. SAME-ORIGIN ONLY. A-ORG-1's SOURCES lists carried jsdelivr/unpkg CDN
      fallbacks after each data/ entry; A-ORG-2 ships all four TopoJSON files
      in data/ (land-110m, land-50m, states-10m, countries-110m) and never
      fetches cross-origin. The CDN rungs are deleted, not commented out.
   2. Coastline ladder INVERTED to 110m-first→50m-upgrade. A-ORG-1 tried 50m
      first and used 110m only as a fallback, returning on first success.
      Here land-110m (~100KB, 130 arcs) loads and draws first, then land-50m
      (~600KB, 1425 arcs) replaces it in place: the loop keeps walking after a
      successful rung, and each rung swaps GLOBE_RINGS + sets dirty.
      If 110m fails the 50m rung still runs; if 50m fails the 110m rings stay.
      _globeLoadedHi keeps its A-ORG-1 meaning ("real coastlines occupy
      GLOBE_RINGS — smoothFallbackOnce must no longer touch them") and the
      entry guard still makes a completed load a no-op on re-call.
   3. loadStateBorders drops A-ORG-1's fourth source (states-albers-10m.json —
      CDN-only, never shipped in data/). The geographic/Albers auto-detect and
      _albersUsaInvert are kept verbatim: they are the ported decode, and
      data/states-10m.json is the unprojected variant (objects.states,
      geographic bbox, real Alaska/Hawaii outlines), so the detect takes the
      geographic path with the inverse as a data-swap safety net.
   4. _namedStateShapes is ported HERE (A-ORG-1 defines it in its brief-states
      section, not next to the loaders) so GLOBE_STATE_SHAPES fills as soon as
      the states topo decodes; m2's `typeof _namedStateShapes==='function'`
      guard in its interim loader becomes always-true.
   5. m2-render.js currently carries interim copies of these three loaders and
      five decoders (with the CDN lists). Under single-script concatenation in
      module order (m1…m6), m6's function declarations hoist LAST and win
      everywhere, so m2's copies are inert text; decode bodies are identical,
      loaders differ only per deviations 1–3. m2's owner can drop its copies
      at merge time — nothing else changes.

   Boot integration (owner: shell/boot module) — after startGlobeLoop(cv):
     loadGlobeCoastlinesHi(); loadStateBorders(); loadCountryBorders();
   ============================================================================ */

async function loadGlobeCoastlinesHi(){
  if(_globeLoadedHi) return;
  // A-ORG-1 v8.9.1 lineage: the real coastlines ship WITH the app (data/,
  // same-origin, SW-precached). A-ORG-2 ladder (deviations 1–2): 110m first
  // for a fast first paint, then 50m upgrades the same GLOBE_RINGS in place.
  const SOURCES=[
    'data/land-110m.json',
    'data/land-50m.json'
  ];
  for(const SRC of SOURCES){
    try{
      const r=await fetch(SRC); if(!r.ok) continue;
      const topo=await r.json();
      const rings=decodeTopoLand(topo);
      if(rings && rings.length>20){
        GLOBE_RINGS=rings; _globeLoadedHi=true;
        if(window.GlobeState){ GlobeState.dirty=true; }   // redraw with real coastlines
      }
    }catch(e){ /* rung failed → keep current rings, try the next rung */ }
  }
  /* both rungs failed → keep embedded fallback */
}

// Load US state borders and decode to lon/lat rings for the globe. Same-origin
// data/ only (deviation 1). The us-atlas states file MAY be in Albers USA
// projection, so the projected case inverts that projection back to lon/lat.
async function loadStateBorders(){
  if(_statesLoaded) return;
  const SOURCES=[
    'data/states-10m.json'
  ];
  for(const SRC of SOURCES){
    try{
      const r=await fetch(SRC); if(!r.ok) continue;
      const topo=await r.json();
      // us-atlas ships two variants: states-10m.json is UNPROJECTED lon/lat, while the -albers-
      // file is pre-projected to a 975x610 canvas. Auto-detect: decode raw first — if the
      // coordinates are already geographic, use them directly (this also keeps REAL Alaska &
      // Hawaii outlines); only run the Albers inverse when the data is actually projected.
      let rings=_decodeTopoLonLat(topo,'states');
      const _geo=_ringsLookGeographic(rings);
      if(!_geo) rings=decodeStatesTopo(topo);
      if(rings && rings.length>=40){
        GLOBE_STATE_RINGS=rings; _statesLoaded=true;
        try{ GLOBE_STATE_SHAPES=_namedStateShapes(topo, _geo); }catch(_){ GLOBE_STATE_SHAPES=null; }
        if(window.GlobeState){ GlobeState.dirty=true; }
        return;
      }
    }catch(e){ /* try next */ }
  }
}

// Invert the d3 Albers-USA projection (approx) to recover lon/lat from projected x/y.
// us-atlas states-10m.json is pre-projected to a 975x610 viewport in Albers USA.
function _albersUsaInvert(x, y){
  // Inverse of d3.geoAlbersUsa as used by us-atlas v3 (975x610 viewport): scale 1300,
  // translate [487.5, 305], screen y-down. Verified: US center → canvas center, coasts span
  // the full width, and it round-trips exactly.
  const scale=1300, tx=487.5, ty=305;
  const phi0=37.5*Math.PI/180, lam0=-96*Math.PI/180;
  const p1=29.5*Math.PI/180, p2=45.5*Math.PI/180;
  const n=(Math.sin(p1)+Math.sin(p2))/2;
  const C=Math.cos(p1)*Math.cos(p1)+2*n*Math.sin(p1);
  const rho0=Math.sqrt(C-2*n*Math.sin(phi0))/n;
  const px=(x - tx)/scale, py=-(y - ty)/scale;   // negated: screen-up = north (matches on-device result)
  const rho0my=rho0 - py;
  const rho=Math.sqrt(px*px + rho0my*rho0my);
  const theta=Math.atan2(px, rho0my);
  const phi=Math.asin(Math.max(-1,Math.min(1,(C - rho*rho*n*n)/(2*n))));
  const lam=lam0 + theta/n;
  return [lam*180/Math.PI, phi*180/Math.PI];
}

function _ringsLookGeographic(rings){
  if(!rings || !rings.length) return false;
  let n=0, okc=0, minLon=999;
  for(const ring of rings){
    for(const p of ring){ n++; if(p[0]>=-180&&p[0]<=180&&p[1]>=-90&&p[1]<=90) okc++; if(p[0]<minLon) minLon=p[0]; if(n>400) break; }
    if(n>400) break;
  }
  return okc>n*0.98 && minLon<-60;   // US longitudes are negative; projected pixels sit in 0..975
}

function decodeStatesTopo(topo){
  const tr=topo.transform;
  const arcs=topo.arcs;
  const obj=topo.objects && (topo.objects.states || topo.objects.states_10m || topo.objects['states-10m']);
  if(!obj) return [];
  function decodeArc(arc){
    let x=0,y=0; const out=[];
    for(const d of arc){
      if(tr){ x+=d[0]; y+=d[1]; out.push([x*tr.scale[0]+tr.translate[0], y*tr.scale[1]+tr.translate[1]]); }
      else { out.push([d[0], d[1]]); }
    }
    return out;
  }
  const decoded=arcs.map(decodeArc);
  function ringFor(arcIdxs){
    let pts=[];
    for(let k=0;k<arcIdxs.length;k++){
      let idx=arcIdxs[k], arc;
      if(idx<0){ arc=decoded[~idx].slice().reverse(); } else { arc=decoded[idx]; }
      if(k>0) arc=arc.slice(1);
      pts=pts.concat(arc);
    }
    // convert projected x/y → lon/lat
    return pts.map(p=>_albersUsaInvert(p[0], p[1]));
  }
  const out=[]; const geoms=obj.geometries||[];
  for(const g of geoms){
    // Skip Alaska (FIPS 02) & Hawaii (15): the Albers-USA layout fakes them into INSETS whose
    // inverse lands over Mexico/Texas. Their true outlines come from the global country layer.
    if(g.id==='02'||g.id==='15'||g.id===2||g.id===15) continue;
    if(g.type==='Polygon'){ for(const r of g.arcs) out.push(ringFor(r)); }
    else if(g.type==='MultiPolygon'){ for(const poly of g.arcs) for(const r of poly) out.push(ringFor(r)); }
  }
  return out;
}

// Load WORLD country borders (lon/lat TopoJSON — no projection inversion needed) from the
// same-origin data/ file (deviation 1). Drawn as a thin global context layer.
async function loadCountryBorders(){
  if(_countriesLoaded) return;
  const SOURCES=[
    'data/countries-110m.json'
  ];
  for(const SRC of SOURCES){
    try{
      const r=await fetch(SRC); if(!r.ok) continue;
      const topo=await r.json();
      const rings=_decodeTopoLonLat(topo,'countries');
      if(rings && rings.length>100){
        GLOBE_COUNTRY_RINGS=rings; _countriesLoaded=true;
        if(window.GlobeState){ GlobeState.dirty=true; }
        return;
      }
    }catch(e){ /* try next */ }
  }
}

// Generic TopoJSON→lon/lat ring decoder (delta-decoded arcs + transform; data already geographic).
function _decodeTopoLonLat(topo, objName){
  const tr=topo.transform, arcs=topo.arcs;
  const obj=topo.objects && topo.objects[objName]; if(!obj) return [];
  function dec(a){ let x=0,y=0; const o=[]; for(const d of a){ if(tr){ x+=d[0]; y+=d[1]; o.push([x*tr.scale[0]+tr.translate[0], y*tr.scale[1]+tr.translate[1]]); } else o.push([d[0],d[1]]); } return o; }
  const D=arcs.map(dec);
  function ringFor(ix){ let p=[]; for(let k=0;k<ix.length;k++){ let i=ix[k],a; if(i<0){a=D[~i].slice().reverse();} else {a=D[i];} if(k>0) a=a.slice(1); p=p.concat(a); } return p; }
  const out=[];
  for(const g of (obj.geometries||[])){
    if(g.type==='Polygon'){ for(const r of g.arcs) out.push(ringFor(r)); }
    else if(g.type==='MultiPolygon'){ for(const poly of g.arcs) for(const r of poly) out.push(ringFor(r)); }
  }
  return out;
}

function decodeTopoLand(topo){
  const tr=topo.transform, arcs=topo.arcs;
  const sx=tr.scale[0], sy=tr.scale[1], tx=tr.translate[0], ty=tr.translate[1];
  function decodeArc(arc){ let x=0,y=0; const out=[]; for(const d of arc){ x+=d[0]; y+=d[1]; out.push([x*sx+tx, y*sy+ty]); } return out; }
  const decoded=arcs.map(decodeArc);
  function ringFor(arcIdxs){
    let pts=[];
    for(let k=0;k<arcIdxs.length;k++){
      let idx=arcIdxs[k], arc;
      if(idx<0){ arc=decoded[~idx].slice().reverse(); } else { arc=decoded[idx]; }
      if(k>0) arc=arc.slice(1);
      pts=pts.concat(arc);
    }
    return pts;
  }
  const out=[]; const geoms=topo.objects.land.geometries;
  for(const g of geoms){
    if(g.type==='Polygon'){ for(const r of g.arcs) out.push(ringFor(r)); }
    else if(g.type==='MultiPolygon'){ for(const poly of g.arcs) for(const r of poly) out.push(ringFor(r)); }
  }
  return out;
}

// Decode the states topojson KEEPING per-state identity (the border layer flattens it).
// Ported from A-ORG-1's brief-states section (deviation 4): it is pure topo→rings decode,
// so it lives with the other decoders; GLOBE_STATE_SHAPES fills the moment states load.
function _namedStateShapes(topo, geographic){
  const obj=topo.objects && (topo.objects.states || topo.objects['states-10m']); if(!obj) return null;
  const tr=topo.transform, arcs=topo.arcs;
  function dec(a){ let x=0,y=0; const o=[]; for(const d of a){ if(tr){ x+=d[0]; y+=d[1]; o.push([x*tr.scale[0]+tr.translate[0], y*tr.scale[1]+tr.translate[1]]); } else o.push([d[0],d[1]]); } return o; }
  const D=arcs.map(dec);
  function ringFor(ix){ let p=[]; for(let k=0;k<ix.length;k++){ let i=ix[k],a; if(i<0){a=D[~i].slice().reverse();} else {a=D[i];} if(k>0) a=a.slice(1); p=p.concat(a); } return p; }
  const out={};
  for(const g of (obj.geometries||[])){
    const nm=g.properties && g.properties.name; if(!nm) continue;
    const rings=[];
    if(g.type==='Polygon'){ for(const r of g.arcs) rings.push(ringFor(r)); }
    else if(g.type==='MultiPolygon'){ for(const poly of g.arcs) for(const r of poly) rings.push(ringFor(r)); }
    out[nm]=geographic? rings : rings.map(function(r){ return r.map(function(pt){ const v=_albersUsaInvert(pt[0],pt[1]); return (v&&v.length===2)?v:null; }).filter(Boolean); });
  }
  return out;
}
