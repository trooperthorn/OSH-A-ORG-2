// ═══════════════════════════════════════════════════════════════════════════════
// m3-input.js — A-ORG-2 M3 pointer interaction (PORTED from A-ORG-1)
//
// Ported from A-ORG-1 index.html (source of truth — movement feel survived 22 major
// versions; "v1.23.0 movement feel (known-good) on a no-roll yaw+pitch core"):
//   globeMark              (~L13934)  request a redraw (sets GlobeState.dirty)
//   _rebuildGlobeQ         (~L16009)  yaw+pitch → orientation quaternion GlobeState.q
//   _faceLonLatAngles      (~L16017)  set yaw/pitch so (lon,lat) faces the viewer
//   setupGlobeInteraction  (~L16592)  drag-to-orbit (applyDrag), flick velocity,
//                                     tap-vs-drag, double-tap zoom (_dblZoom),
//                                     ctrl/cmd-wheel zoom, two-finger pinch+pan
//   glide block            (~L16733)  momentum glide from startGlobeLoop's frame(),
//                                     hoisted here as globeGlideStep(dt) — see dev 2
//
// OWNERSHIP NOTES (concatenation law — no duplicate top-level declarations):
//   - globeMark and _rebuildGlobeQ/_faceLonLatAngles are DECLARED HERE (m1-geom.js
//     header explicitly deferred the interaction trio to this file; globeMark's first
//     consumer is input). The render module must NOT redeclare them.
//   - Uses (declared elsewhere): GlobeState (shell), _qMul/_qNorm/_qFromAxisAngle/
//     globeMetrics (m1-geom.js), startGlobeLoop (render module, called guarded),
//     tapAtScreen (selection/dossier module hook, called guarded).
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. NO POINTER CAPTURE (reliability contract). A-ORG-1 calls setPointerCapture/
//      releasePointerCapture on the canvas and listens for lostpointercapture; capture
//      is what kept a drag alive once the pointer left the canvas. Here pointermove/
//      pointerup/pointercancel attach to window instead (addEventListener only), and
//      the handlers no-op unless this drag's pointerId is active — same drag-outside-
//      canvas behavior, zero capture API. The lostpointercapture safety-reset is gone
//      with the capture; window pointercancel covers it.
//   2. globeGlideStep(dt) is NEW-NAMED: in A-ORG-1 the glide integrator is an inline
//      block of startGlobeLoop's frame(). The render loop is not this file (exclusive
//      ownership), so the block is hoisted behind a name. The render module MUST call
//      globeGlideStep(dt) once per frame BEFORE its dirty check; the step sets
//      GlobeState.dirty itself, so the redraws-only-when-dirty law holds.
//   3. Glide constants are the CURRENT source's: decay Math.pow(0.94, dt/16.67),
//      stop < 0.005 (the mission brief's grep hooks 0.78 / 0.02 are a pre-Apple-settle
//      version — the source comment at ~L16739 literally says "was 0.78"; source wins).
//   4. Tap fires the M3 hook tapAtScreen(x, y) — canvas-relative px/py, the exact
//      coords A-ORG-1's handleGlobeTap derives from e.clientX/Y minus the canvas rect.
//      handleGlobeTap itself (tips, stack popups, brief taps) is NOT ported: it is
//      selection/dossier UI owned elsewhere; only the hook boundary lives here.
//   5. endPointer's stale-pointer guard is TIGHTENED for the window listeners:
//      A-ORG-1's (e.pointerId!==activeId && activeId!==null) let a pointerup with no
//      active drag fall through to tap logic — harmless when the listener sat on the
//      canvas, but on window it would fire taps for clicks anywhere in the app. Now
//      activeId===null returns early too.
//   6. startGlobeLoop call on release is guarded (typeof) — the render module may not
//      be concatenated yet during construction; A-ORG-1 called it bare.
//   7. GlobeState._lastInteract is NOT touched here (A-ORG-1 sets it in fly-to paths
//      for idle-spin resume; A-ORG-2 has no idle spin). The spin=false /_spinAxis /
//      _spinVel resets in pointerdown ARE kept verbatim so ported state names survive.
//
// CONTRACTS HONORED:
//   - Reads GlobeState at event/call time only — concatenation-order safe. No DOM
//     beyond the canvas passed in (+ window listeners). Plain sloppy-mode JS, no
//     classes, no modules. Nothing here draws; every visual change routes through
//     GlobeState.dirty (globeMark) and the render loop's dirty gate.
//   - Zoom clamps as in source: wheel Math.max(1.0, Math.min(16, …)), pinch
//     Math.max(1.0, Math.min(16, …)), double-tap Math.min(16, z0*2) with the
//     at-max reset to 2.0. Radius law via GlobeState.baseK (0.72 fallback).
// ═══════════════════════════════════════════════════════════════════════════════

function globeMark(){ GlobeState.dirty=true; }   // request a redraw

// Rebuild the orientation quaternion from yaw + pitch: pitch about the camera X axis, then yaw
// about the world Y (polar) axis. Verified to reach ±90° latitude with north up and no roll.
function _rebuildGlobeQ(){
  GlobeState.q = _qNorm(_qMul(
    _qFromAxisAngle(1,0,0, GlobeState.pitch||0),
    _qFromAxisAngle(0,1,0, GlobeState.yaw||0)
  ));
}

// Set yaw/pitch so geographic (lon,lat) sits at screen center (used by fly-to). Verified:
// yaw = lon-90 and pitch = lat center the point with east-right and north-up in this projection.
function _faceLonLatAngles(lon,lat){
  GlobeState.yaw   = (lon-90)*Math.PI/180;
  GlobeState.pitch =  lat*Math.PI/180;
  const lim=Math.PI/2-0.001;
  GlobeState.pitch=Math.max(-lim,Math.min(lim,GlobeState.pitch));
  _rebuildGlobeQ();
}

function setupGlobeInteraction(cv){
  // ===== v1.23.0 movement feel (known-good) on a no-roll yaw+pitch core. =====
  // Drag left/right spins around the polar axis (yaw); up/down tilts latitude (pitch). We keep
  // yaw & pitch as plain numbers and rebuild the orientation each drag: pitch wraps freely so
  // you can spin continuously over the poles, but the globe never rolls. This is the simplest
  // model that reaches the poles AND keeps north up — no drift, no guards, no lock.
  let activeId=null, lastX=0, lastY=0, lastT=0, sx0=0, sy0=0;
  function applyDrag(dx, dy){
    const R = Math.min(cv.clientWidth, cv.clientHeight)/2 * Math.max(1e-3,GlobeState.zoom) * (GlobeState.baseK||0.72);
    const sensDeg = Math.max(0.02, Math.min(0.5, 57.2958 / R));   /* ~54% of finger speed at rest */
    GlobeState.yaw   = (GlobeState.yaw||0)   - dx * sensDeg * Math.PI/180;   // drag right → turn right
    GlobeState.pitch = (GlobeState.pitch||0) + dy * sensDeg * Math.PI/180;   // drag up → globe follows finger up
    // NO clamp — pitch wraps freely so you can spin continuously over the poles and all the way
    // around, like a real globe. (Keep pitch bounded to ±2π just so the number never grows huge.)
    if(GlobeState.pitch >  Math.PI*2) GlobeState.pitch -= Math.PI*2;
    if(GlobeState.pitch < -Math.PI*2) GlobeState.pitch += Math.PI*2;
    _rebuildGlobeQ();
  }
  cv.addEventListener('pointerdown', e=>{
    if(e.pointerType==='touch' && GlobeState._pinching) return;
    try{ if(typeof cameraCancel==='function') cameraCancel(); }catch(_){}   // user wins over any live fly tween
    activeId=e.pointerId;
    GlobeState.dragging=true; GlobeState.moved=false;
    GlobeState.spin=false; GlobeState._gliding=false;
    GlobeState._spinAxis=null; GlobeState._spinVel=0;
    lastX=e.clientX; lastY=e.clientY; lastT=performance.now(); sx0=e.clientX; sy0=e.clientY;
    GlobeState.dirty=true;
  });
  // Move/up/cancel live on window (NOT the canvas): with pointer capture banned, this is
  // what keeps a drag alive when the pointer leaves the canvas. Handlers no-op unless
  // OUR pointer is mid-drag, so app-wide events cost one compare. (Deviations 1 & 5.)
  window.addEventListener('pointermove', e=>{
    if(!GlobeState.dragging || e.pointerId!==activeId) return;
    if(e.cancelable) e.preventDefault();
    const dx=e.clientX-lastX, dy=e.clientY-lastY;
    if(Math.hypot(e.clientX-sx0, e.clientY-sy0) > (e.pointerType==='touch'?6:3)) GlobeState.moved=true;
    applyDrag(dx, dy);
    // track drag velocity in px/ms for a v1.23.0-style flick glide (smoothed)
    const now=performance.now(); const dt=Math.max(8, now-lastT);
    GlobeState._velDX = 0.7*(dx/dt) + 0.3*(GlobeState._velDX||0);
    GlobeState._velDY = 0.7*(dy/dt) + 0.3*(GlobeState._velDY||0);
    lastX=e.clientX; lastY=e.clientY; lastT=now;
    globeMark();
  }, {passive:false});
  function endPointer(e){
    if(activeId===null || e.pointerId!==activeId) return;   // tightened vs. A-ORG-1 (deviation 5)
    const wasMoved=GlobeState.moved;
    GlobeState.dragging=false; activeId=null;
    let speed=Math.hypot(GlobeState._velDX||0, GlobeState._velDY||0);
    const CAP=1.6;   /* fling cap: a hard flick can't launch a multi-rev spin */
    if(speed>CAP){ const _s=CAP/speed; GlobeState._velDX*=_s; GlobeState._velDY*=_s; speed=CAP; }
    if(wasMoved && speed>0.05 && !GlobeState._pinching){ GlobeState._gliding=true; }
    else { GlobeState._gliding=false; GlobeState._velDX=0; GlobeState._velDY=0; }
    if(!wasMoved && !GlobeState._pinching){
      // Tap-vs-drag already settled (moved thresholds above); now tap-vs-DOUBLE-tap:
      // two stationary releases within 300ms and 24px = double-tap zoom, else a tap.
      const nowT=performance.now();
      if(nowT-(GlobeState._dtT||0)<300 && Math.hypot(e.clientX-(GlobeState._dtX||0), e.clientY-(GlobeState._dtY||0))<24){
        GlobeState._dtT=0; try{ _dblZoom(e); }catch(_){}
      } else {
        GlobeState._dtT=nowT; GlobeState._dtX=e.clientX; GlobeState._dtY=e.clientY;
        // M3 hook boundary: canvas-relative coords, exactly what A-ORG-1's
        // handleGlobeTap derived before hit-testing GlobeState._screen. (Deviation 4.)
        try{
          if(typeof tapAtScreen==='function'){
            const r=cv.getBoundingClientRect();
            tapAtScreen(e.clientX-r.left, e.clientY-r.top);
          }
        }catch(_){}
      }
    }
    GlobeState.dirty=true;
    if(!GlobeState.raf && typeof startGlobeLoop==='function') startGlobeLoop(cv);   // guarded (deviation 6)
  }
  // v15.14.0 double-tap: animated x2 toward the tap point (at max: reset to 2.0, Apple-style)
  function _dblZoom(e){
    try{ if(typeof cameraCancel==='function') cameraCancel(); }catch(_){}   // don't fight a live fly tween
    const m=globeMetrics(cv), r=cv.getBoundingClientRect();
    const ox=(e.clientX-r.left)-m.cx, oy=(e.clientY-r.top)-m.cy;
    const z0=GlobeState.zoom, zT=(z0>=15.9)?2.0:Math.min(16, z0*2);
    const t0=performance.now(), dur=260;
    let zPrev=z0;
    (function step(now){
      const p=Math.min(1,(now-t0)/dur), ez=1-(1-p)*(1-p);
      const z=z0+(zT-z0)*ez, k=z/zPrev; zPrev=z;
      GlobeState.zoom=z;
      if(GlobeState._applyDrag && k!==1) GlobeState._applyDrag(-(k-1)*ox, -(k-1)*oy);
      globeMark();
      if(p<1) requestAnimationFrame(step);
    })(t0);
  }
  // expose applyDrag so the glide loop can reuse the exact same no-roll rotation
  GlobeState._applyDrag = applyDrag;
  window.addEventListener('pointerup', endPointer);
  window.addEventListener('pointercancel', endPointer);

  // ZOOM via wheel: Ctrl/Cmd+wheel (or trackpad pinch) zooms; plain wheel scrolls page.
  cv.addEventListener('wheel', e=>{
    if(!(e.ctrlKey || e.metaKey)) return;               // gesture ownership unchanged
    e.preventDefault();
    try{ if(typeof cameraCancel==='function') cameraCancel(); }catch(_){}   // wheel zoom wins over a live fly
    const m=globeMetrics(cv), r=cv.getBoundingClientRect();
    const ox=(e.clientX-r.left)-m.cx, oy=(e.clientY-r.top)-m.cy;
    const z0=GlobeState.zoom;
    const z1=Math.max(1.0, Math.min(16, z0*Math.exp(-e.deltaY*0.0015)));
    if(z1===z0) return;
    GlobeState.zoom=z1;
    const k=z1/z0;
    if(GlobeState._applyDrag) GlobeState._applyDrag(-(k-1)*ox, -(k-1)*oy);   // zoom dives at the cursor
    globeMark();
  }, {passive:false});

  // ZOOM via two-finger pinch — incremental, focal-anchored, and it PANS (v15.14.0).
  let pinchPrevD=0, pinchPrevX=0, pinchPrevY=0;
  function dist(t){ const dx=t[0].clientX-t[1].clientX, dy=t[0].clientY-t[1].clientY; return Math.hypot(dx,dy); }
  function mid(t){ return [(t[0].clientX+t[1].clientX)/2, (t[0].clientY+t[1].clientY)/2]; }
  cv.addEventListener('touchstart', e=>{
    if(e.touches.length===2){ GlobeState._pinching=true; GlobeState.dragging=false; GlobeState._gliding=false;
      pinchPrevD=dist(e.touches); const c=mid(e.touches); pinchPrevX=c[0]; pinchPrevY=c[1]; }
  }, {passive:true});
  cv.addEventListener('touchmove', e=>{
    if(GlobeState._pinching && e.touches.length===2){
      if(e.cancelable) e.preventDefault();
      const d=dist(e.touches), c=mid(e.touches);
      if(pinchPrevD>0){
        const m=globeMetrics(cv), r=cv.getBoundingClientRect();
        const ox=(c[0]-r.left)-m.cx, oy=(c[1]-r.top)-m.cy;
        const z0=GlobeState.zoom;
        const z1=Math.max(1.0, Math.min(16, z0*(d/pinchPrevD)));
        GlobeState.zoom=z1;
        const k=z1/z0;
        if(GlobeState._applyDrag){
          if(k!==1) GlobeState._applyDrag(-(k-1)*ox, -(k-1)*oy);   // focal anchor
          GlobeState._applyDrag(c[0]-pinchPrevX, c[1]-pinchPrevY); // two-finger pan
        }
        globeMark();
      }
      pinchPrevD=d; pinchPrevX=c[0]; pinchPrevY=c[1];
    }
  }, {passive:false});
  cv.addEventListener('touchend', e=>{
    if(e.touches.length<2 && GlobeState._pinching){ GlobeState._pinching=false; pinchPrevD=0; }
  }, {passive:true});
}

// v1.23.0-style momentum glide, hoisted out of A-ORG-1's startGlobeLoop frame() (deviation 2).
// The render module calls this once per frame with dt (ms, already capped at 64 by the loop)
// BEFORE its dirty check. Keeps applying the released drag velocity through the same no-roll
// rotation (GlobeState._applyDrag), decaying smoothly — reusing applyDrag guarantees the glide
// can't roll the globe either. Sets GlobeState.dirty itself: the redraw law stays dirty-gated.
function globeGlideStep(dt){
  if(GlobeState._gliding && !GlobeState.dragging && !GlobeState._pinching && GlobeState._applyDrag){
    GlobeState._applyDrag((GlobeState._velDX||0)*dt, (GlobeState._velDY||0)*dt);
    const decay=Math.pow(0.94, dt/16.67);   /* was 0.78 — Apple-length settle: half-life ~187ms, ~1s glide */
    GlobeState._velDX*=decay; GlobeState._velDY*=decay;
    if(Math.hypot(GlobeState._velDX||0, GlobeState._velDY||0) < 0.005){ GlobeState._gliding=false; GlobeState._velDX=0; GlobeState._velDY=0; }
    GlobeState.dirty=true;
  }
}
