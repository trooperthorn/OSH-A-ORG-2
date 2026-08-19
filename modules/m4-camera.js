// ═══════════════════════════════════════════════════════════════════════════════
// m4-camera.js — A-ORG-2 M4 camera moves (PORTED from A-ORG-1)
//
// Ported from A-ORG-1 index.html (source of truth — flight feel is v21.1.0
// "CINEMATIC flight", controls-council approved):
//   flyToLatLon      (~L16560)  eased yaw/pitch/zoom tween to face (lat,lon):
//                               duration scales with angular distance
//                               (550+500·min(1,dist/π) ms), easeInOutQuad, and long
//                               hops (>~30°) get a van Wijk-style zoom dip so the eye
//                               keeps its bearings instead of smearing at full zoom.
//   fitGlobeToSites  (~L15784)  frame a set of sites: average their 3-D unit vectors
//                               (correct across the date line) → centroid lat/lon,
//                               maxSep = greatest angular separation from centroid,
//                               then the maxSep→zoom ladder
//                               (>120°:1.05 · >80°:1.3 · >45°:1.7 · >20°:2.3 ·
//                                else 2.8, or 3.2 for a single site), optional
//                               tightenBias multiplier, final clamp 1.0..14.
//   geoAngularSep    (~L18032)  angular separation (degrees) between two lat/lon
//                               points — verbatim (fitGlobeToSites' only dependency
//                               not already in m1–m3).
//   _zoomAnim        (~L16336)  zoom step control: animated ×f (180ms easeOut),
//                               clamp 1.0..16.
//   _wireZoomHold    (~L16342)  zoom button wiring: click → _zoomAnim(f); press-and-
//                               hold 300ms → repeat ×1.06 (or ÷1.06) every 50ms.
//                               A-ORG-1 wires #globeZoomIn/#globeZoomOut at f=1.35.
//   reset-view       (~L16476, ~L23001)  inline `flyToLatLon(38,-98,2.3)` — the 'h'/'0'
//                               key and the #gRecenter FAB ("home flies, never snaps").
//                               Hoisted here as resetGlobeView() — see deviation 4.
//
// OWNERSHIP (concatenation law — no duplicate top-level declarations):
//   - DECLARED HERE: flyToLatLon, fitGlobeToSites, geoAngularSep,
//     _zoomAnim, _wireZoomHold, resetGlobeView, cameraCancel. (zoomAt and the
//     fitToSites alias were cut at M1 integration — zero call sites.)
//   - USED, declared elsewhere: GlobeState (shell), globeMark + _rebuildGlobeQ +
//     GlobeState._applyDrag (m3-input.js), globeMetrics (m1-geom.js).
//     No DOM at load time; zoomAt looks up #globeCanvas (shell contract id) at CALL
//     time only; _wireZoomHold receives its buttons from the shell.
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. CANCELLATION IS NEW — mission-mandated. A-ORG-1's flyToLatLon rAF loop runs
//      unconditionally to p=1 (a drag mid-flight fights the tween frame-for-frame;
//      there is no `_fly` token anywhere in the 2 MB source — verified by grep).
//      Here every camera tween captures a generation token (module-scoped _camGen)
//      at start; cameraCancel() bumps the token, and a stale step returns without
//      touching GlobeState. m3 should call cameraCancel() in its pointerdown.
//      BELT + SUSPENDERS: each tween step ALSO self-cancels when
//      GlobeState.dragging or GlobeState._pinching is true, so user drag kills the
//      tween even before m3 wires the call. GlobeState._fly (new state, true only
//      while a fly tween is live) lets other modules see flight-in-progress.
//   2. Starting any camera tween cancels the previous one (each entry point bumps
//      _camGen). In A-ORG-1 a zoom-button press mid-flight left the fly running and
//      the two rAF loops fought over GlobeState.zoom; last-writer-per-frame won.
//      One camera, one authority. Same for _wireZoomHold's hold-repeat interval:
//      it calls cameraCancel() when the repeat starts.
//   3. GlobeState._lastInteract is NOT touched (A-ORG-1 set it in flyToLatLon and
//      _zoomAnim for idle-spin resume; A-ORG-2 has no idle spin — same call m3 made,
//      its deviation 7). The GlobeState.spin=false / _gliding=false resets ARE kept
//      verbatim so ported state names survive.
//   4. resetGlobeView() is NEW-NAMED: A-ORG-1 has no named reset — the home fly is
//      inline in two handlers (keydown 'h'/'0' ~L16476, #gRecenter click ~L23001),
//      both `flyToLatLon(38,-98,2.3)` with the comment "home flies, never snaps".
//      This is that exact call hoisted behind a name for the #stageBar reset pill.
//   5. fitGlobeToSites input ADAPTED: A-ORG-1 took a Set of installation NAMES and
//      filtered the INSTALLATIONS global (neither exists in A-ORG-2). Here it takes
//      an Array or Set of A-ORG-2 site objects ({lat, lon, ...} per data/sites.json)
//      and also accepts id strings, resolved against a global SITES array when one
//      is defined (typeof-guarded). Centroid math, maxSep loop, zoom ladder, bias,
//      and clamps are byte-for-byte A-ORG-1. fitToSites(list) is the M4 public
//      alias named by the A-ORG-2 work order; fitGlobeToSites keeps the source name.
//   6. zoomAt(f, cx, cy) is NEW-NAMED for the globe: A-ORG-1's only `zoomAt` is the
//      org-chart SVG pan-zoom (~L21085), not the globe camera. This one is
//      _zoomAnim's 180ms easeOut tween composed with the focal-anchor math the
//      source uses everywhere else on the globe (wheel zoom ~L16681 and _dblZoom
//      ~L16657: per-frame k=z/zPrev, then _applyDrag(-(k-1)*ox, -(k-1)*oy) dives
//      the camera at the point). cx/cy are client (viewport) px; omit them and it
//      degrades to a pure center zoom identical to _zoomAnim.
//   7. _wireZoomHold's hold-repeat marks dirty via globeMark() per 50ms tick exactly
//      as in source — no forced per-frame redraw; every visual change here routes
//      through GlobeState.dirty and the render loop's gate.
//
// CONTRACTS HONORED:
//   - Reads GlobeState at call time only — concatenation-order safe. Plain
//     sloppy-mode JS: top-level function declarations, no classes, no modules.
//   - No position:fixed, no pointer capture, no CSS transforms — this file touches
//     no layout at all. Phone-first: no DOM assumptions beyond shell-contract ids.
//   - Zoom clamps as in source: steps 1.0..16, fit ladder 1.0..14, in-flight floor
//     1.05. Radius law untouched (lives in m1's globeMetrics).
// ═══════════════════════════════════════════════════════════════════════════════

// ---- Camera tween generation token (deviation 1). Every tween entry point bumps it
//      and captures the new value; cameraCancel() bumps it so stale steps go inert. ----
let _camGen=0;

// Cancel any in-flight camera tween (fly, fit, zoom step). m3 calls this on
// pointerdown so a user drag always wins instantly; safe to call when idle.
function cameraCancel(){
  _camGen++;
  GlobeState._fly=false;
}

// Angular separation (degrees) between two lat/lon points.
function geoAngularSep(lat1,lon1,lat2,lon2){
  const d=Math.PI/180;
  const a=[Math.cos(lat1*d)*Math.cos(lon1*d), Math.cos(lat1*d)*Math.sin(lon1*d), Math.sin(lat1*d)];
  const b=[Math.cos(lat2*d)*Math.cos(lon2*d), Math.cos(lat2*d)*Math.sin(lon2*d), Math.sin(lat2*d)];
  let dot=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; dot=Math.max(-1,Math.min(1,dot));
  return Math.acos(dot)/d;
}

// Generalized fly-to: rotate the globe so (lat,lon) faces the viewer and zoom in.
// onArrive (optional) runs when the animation completes (not when cancelled).
// v21.1.0 CINEMATIC flight, ported intact: duration scales with angular distance
// (short hops stay quick, cross-globe travel gets time to read), and long hops
// (>~30°) get a van Wijk-style zoom dip — the camera pulls back mid-flight then
// descends onto the target. Every camera jump in the app routes through here.
function flyToLatLon(lat, lon, zoom, onArrive){
  GlobeState.spin=false; GlobeState._gliding=false;
  const gen=++_camGen;                       // starting a fly cancels any prior tween (deviations 1–2)
  GlobeState._fly=true;
  const startYaw=GlobeState.yaw||0, startPitch=GlobeState.pitch||0, startZ=GlobeState.zoom;
  // Target yaw/pitch that centers (lon,lat) — same convention as _faceLonLatAngles.
  const lim=Math.PI/2-0.001;
  let tgtYaw=(lon-90)*Math.PI/180;
  let tgtPitch=Math.max(-lim,Math.min(lim, lat*Math.PI/180));
  const tgtZ=(zoom!=null?zoom:GlobeState.zoom);
  // take the shortest way around for yaw (wrap to ±π)
  let dYaw=tgtYaw-startYaw;
  dYaw=((dYaw+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
  const dist=Math.max(Math.abs(dYaw), Math.abs(tgtPitch-startPitch));
  const dur=550+500*Math.min(1, dist/Math.PI);
  const dip=(dist>0.52)?Math.min(startZ,tgtZ)*0.22:0;
  const t0=performance.now();
  function ease(p){ return p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2; }
  function step(now){
    if(gen!==_camGen) return;                                    // cancelled (deviation 1)
    if(GlobeState.dragging || GlobeState._pinching){ cameraCancel(); return; }   // user wins
    let p=Math.min(1,(now-t0)/dur); const e=ease(p);
    GlobeState.yaw   = startYaw + dYaw*e;
    GlobeState.pitch = startPitch + (tgtPitch-startPitch)*e;
    GlobeState.zoom  = Math.max(1.05, startZ + (tgtZ-startZ)*e - dip*Math.sin(e*Math.PI));
    _rebuildGlobeQ();
    globeMark();
    if(p<1) requestAnimationFrame(step);
    else{ GlobeState.zoom=tgtZ; GlobeState._fly=false; globeMark(); if(onArrive) onArrive(); }
  }
  requestAnimationFrame(step);
}

// Frame the camera to fit a set of sites (by averaging their 3-D vectors so it's
// correct across the date line) and pick a zoom from their angular spread.
// list: Array or Set of site objects from data/sites.json ({lat, lon, ...}); id
// strings are resolved against a global SITES array when one exists (deviation 5).
function fitGlobeToSites(list, tightenBias){
  if(!list) return;
  const arr = (typeof Set!=='undefined' && list instanceof Set) ? Array.from(list) : list;
  if(!arr || !arr.length) return;
  const pts=[];
  arr.forEach(s=>{
    let it=s;
    if(typeof s==='string'){
      it=null;
      if(typeof SITES!=='undefined' && SITES && SITES.length){
        for(let i=0;i<SITES.length;i++){ if(SITES[i].id===s){ it=SITES[i]; break; } }
      }
    }
    if(it && it.lat!=null && it.lon!=null) pts.push(it);
  });
  if(!pts.length) return;
  const d=Math.PI/180; let x=0,y=0,z=0;
  pts.forEach(p=>{ x+=Math.cos(p.lat*d)*Math.cos(p.lon*d); y+=Math.cos(p.lat*d)*Math.sin(p.lon*d); z+=Math.sin(p.lat*d); });
  const L=Math.hypot(x,y,z)||1;
  const cLat=Math.asin(Math.max(-1,Math.min(1,z/L)))/d, cLon=Math.atan2(y,x)/d;
  // max angular separation from the centroid → spread
  let maxSep=0;
  pts.forEach(p=>{ maxSep=Math.max(maxSep, geoAngularSep(cLat,cLon,p.lat,p.lon)); });
  let zoom = maxSep>120 ? 1.05 : maxSep>80 ? 1.3 : maxSep>45 ? 1.7 : maxSep>20 ? 2.3 : (pts.length===1? 3.2 : 2.8);
  if(tightenBias) zoom*=tightenBias;
  flyToLatLon(cLat, cLon, Math.max(1.0, Math.min(14, zoom)));
}

// M4 public alias per the A-ORG-2 work order; the ported name above stays canonical.

// v15.14.0: zoom keys animate (180ms easeOut) and repeat on hold; keyboard +/- reuses .click()
function _zoomAnim(f){ const z0=GlobeState.zoom, zT=Math.max(1.0,Math.min(16,z0*f));
  const t0=performance.now(), dur=180;
  GlobeState.spin=false;
  const gen=++_camGen;                       // a zoom step cancels a fly mid-flight (deviation 2)
  GlobeState._fly=false;
  (function step(now){
    if(gen!==_camGen) return;
    if(GlobeState.dragging || GlobeState._pinching){ cameraCancel(); return; }
    const p=Math.min(1,(now-t0)/dur), ez=1-(1-p)*(1-p);
    GlobeState.zoom=z0+(zT-z0)*ez; globeMark(); if(p<1) requestAnimationFrame(step); })(t0);
}

// Animated zoom step anchored at a screen point: ×f toward client coords (cx,cy),
// diving the camera at that point exactly like the source's wheel/double-tap zooms
// (per-frame focal anchor through GlobeState._applyDrag — deviation 6). Omit cx/cy
// (zoomAt — the focal-anchored zoom step — was cut at M1 integration: zero call
// sites; the M1 zoom pills use _zoomAnim via _wireZoomHold. Recover from git
// history when a consumer arrives.)

// Zoom button wiring: click animates ×f; press-and-hold (300ms) repeats ×1.06 per
// 50ms tick. The shell passes its own buttons (A-ORG-1 used #globeZoomIn/#globeZoomOut
// at f=1.35 / 1/1.35). addEventListener only — no pointer capture.
function _wireZoomHold(btn, f){
  if(!btn) return;
  btn.onclick=()=>_zoomAnim(f);
  let ht=null, rt=null;
  btn.addEventListener('pointerdown', ()=>{ ht=setTimeout(()=>{ rt=setInterval(()=>{ cameraCancel(); GlobeState.zoom=Math.max(1.0,Math.min(16,GlobeState.zoom*(f>1?1.06:1/1.06))); globeMark(); },50); },300); });
  const stop=()=>{ clearTimeout(ht); clearInterval(rt); ht=rt=null; };
  btn.addEventListener('pointerup',stop); btn.addEventListener('pointerleave',stop); btn.addEventListener('pointercancel',stop);
}

// Reset view — A-ORG-1's home camera, hoisted from its two inline call sites
// ('h'/'0' key and the recenter FAB): CONUS at ease. Home flies, never snaps.
function resetGlobeView(){
  flyToLatLon(38, -98, 2.3);
}
