/* ============================================================================
   modules/m2-render.js — A-ORG-2 M2: render loop + world drawing
   PORTED from A-ORG-1 index.html (the globe engine is ported, not rewritten).

   A-ORG-1 functions/state ported (names kept):
     GLOBE_FALLBACK_RINGS, GLOBE_RINGS, GLOBE_STATE_RINGS, GLOBE_COUNTRY_RINGS,
     GLOBE_STATE_SHAPES, _globeLoadedHi, _statesLoaded, _countriesLoaded,
     _fallbackSmoothed, globeMark, _latRingCache/_lonRingCache,
     startGlobeLoop (inner frame(now): dirty gate + momentum glide),
     globeMetrics, drawGlobe, latRing, lonRing, drawGlobePath,
     _smoothRing, smoothFallbackOnce,
     loadGlobeCoastlinesHi, loadStateBorders, _albersUsaInvert,
     _ringsLookGeographic, decodeStatesTopo, loadCountryBorders,
     _decodeTopoLonLat, decodeTopoLand.

   Consumes from m1-geom (A-ORG-1 names — NOT defined here):
     GlobeState (global state: q, zoom, baseK, dirty, sel, raf, rotLon/rotLat,
     _gliding/_velDX/_velDY/_applyDrag set by input wiring),
     _setGlobeRot, _ringXYZ, _gM.

   m5 hook: drawGlobe calls drawMarkersHook(ctx, m) if defined — ALL marker,
   label, link-line and brief overlay drawing belongs to m5, not here.

   DEVIATIONS from A-ORG-1 (each one deliberate):
   1. drawGlobe: drawGlobeMarkers(ctx,m) -> optional drawMarkersHook(ctx,m),
      called inside the sphere clip exactly where markers drew in A-ORG-1.
   2. drawGlobe: dropped the drawGlobeLinks / drawBriefChain / drawBriefStates
      branches and the __bfC/__bfHQ/__bfLab bookkeeping. Cross-org link arcs are
      OUT of A-ORG-2 scope (parent pointer is the only relationship); any
      parent-child/brief overlay drawing rides the m5 hook.
   3. frame: the ~14fps pulse throttle (GlobeState._lp, 70ms) moved here from
      A-ORG-1 drawGlobeMarkers, keyed on GlobeState.sel != null, so the idle
      loop breathes for the selection pulse without m5 self-marking dirty.
      (Minor change: it also ticks while the selected site is on the back
      hemisphere; A-ORG-1 only ticked when the pulse actually drew.)
   4. loadStateBorders: the GLOBE_STATE_SHAPES fill is guarded with
      typeof _namedStateShapes === 'function' — that per-state decoder ships
      with the brief-states owner; until it lands the shapes stay null.
   5. _smoothRing is defined here (its only consumer is smoothFallbackOnce);
      if m1-geom also ports it the duplicate declaration is identical-body and
      harmless under single-script concatenation.

   Boot integration (owner: shell/boot module) — call once #globeCanvas exists:
     smoothFallbackOnce(); startGlobeLoop(cv);
     loadGlobeCoastlinesHi(); loadStateBorders(); loadCountryBorders();
   ============================================================================ */

/* ============================================================
   3D ROTATING GLOBE — orthographic, canvas, no external libs.
   Drag to rotate, scroll/pinch to zoom, markers projected onto
   the sphere by the m5 hook.
   ============================================================ */
const GLOBE_FALLBACK_RINGS = [[[-168, 65.5], [-166, 68.5], [-161, 70.3], [-156, 71.4], [-148, 70.2], [-141, 69.6], [-133, 69.5], [-128, 70.6], [-124, 70.2], [-115, 68.9], [-105, 68.8], [-95, 69.0], [-85, 69.5], [-81, 73.0], [-78, 73.5], [-74, 68.6], [-79, 62.4], [-86, 60.0], [-78, 56.0], [-76, 52.6], [-79, 51.0], [-83, 55.3], [-82, 59.0], [-79, 62.0], [-72, 60.0], [-69, 58.0], [-64, 60.3], [-64, 58.0], [-67, 55.0], [-61, 56.4], [-57, 54.0], [-56, 51.4], [-59, 48.0], [-53, 47.0], [-53, 49.0], [-58, 52.0], [-64, 49.0], [-66, 49.0], [-61, 46.0], [-64, 46.4], [-67, 44.7], [-70, 43.6], [-70, 41.6], [-74, 40.4], [-74, 38.9], [-76, 37.0], [-76, 34.5], [-78, 33.9], [-81, 31.0], [-80, 28.5], [-80, 25.2], [-81, 25.1], [-82, 27.5], [-83, 29.7], [-84, 29.7], [-85, 29.7], [-88, 30.3], [-90, 29.2], [-89, 29.0], [-91, 29.2], [-94, 29.6], [-97, 27.8], [-97, 25.9], [-98, 22.5], [-95, 18.7], [-91, 18.6], [-87, 21.5], [-87, 20.0], [-88, 18.5], [-88, 16.0], [-83, 15.0], [-83, 9.0], [-77, 7.2], [-79, 9.3], [-82, 9.0], [-83, 11.0], [-87, 13.0], [-92, 14.0], [-96, 16.0], [-101, 17.0], [-105, 20.4], [-106, 23.0], [-110, 24.0], [-109, 26.0], [-112, 27.0], [-110, 23.5], [-112, 29.0], [-114, 31.0], [-117, 32.5], [-120, 34.4], [-122, 37.0], [-124, 40.4], [-124, 43.3], [-124, 46.3], [-124, 48.4], [-123, 48.3], [-125, 50.0], [-128, 51.7], [-131, 52.2], [-133, 54.0], [-130, 55.5], [-131, 57.0], [-135, 58.0], [-138, 59.0], [-141, 60.0], [-146, 60.8], [-150, 61.3], [-148, 60.0], [-152, 58.0], [-154, 57.0], [-152, 59.0], [-156, 58.0], [-158, 56.5], [-160, 55.5], [-162, 55.0], [-165, 54.5], [-166, 53.5], [-162, 55.0], [-159, 57.0], [-158, 58.5], [-162, 58.5], [-164, 60.0], [-166, 61.5], [-162, 63.0], [-161, 64.5], [-166, 65.5], [-168, 65.5]], [[-81, 7.5], [-77, 7.5], [-77, 4.5], [-80, 2.0], [-80, -2.0], [-81, -4.5], [-79, -7.0], [-77, -12.0], [-75, -15.0], [-71, -17.5], [-70, -19.0], [-70, -22.0], [-71, -25.0], [-71, -30.0], [-72, -34.0], [-73, -37.0], [-74, -40.0], [-74, -43.0], [-75, -46.0], [-75, -48.5], [-74, -51.0], [-70, -53.0], [-69, -54.5], [-66, -55.2], [-64, -54.7], [-65, -52.0], [-68, -50.0], [-69, -47.0], [-66, -45.0], [-64, -42.5], [-62, -40.0], [-62, -38.5], [-58, -38.5], [-57, -36.0], [-57, -34.5], [-53, -34.0], [-51, -31.0], [-48, -28.5], [-48, -26.0], [-44, -23.0], [-40, -21.0], [-39, -17.5], [-37, -13.0], [-35, -9.0], [-35, -7.0], [-38, -5.0], [-42, -3.0], [-44, -2.5], [-48, -1.0], [-50, -0.5], [-50, 1.0], [-51, 4.0], [-54, 6.0], [-58, 6.5], [-60, 8.5], [-62, 10.5], [-64, 10.5], [-67, 11.5], [-70, 11.5], [-72, 11.8], [-72, 9.0], [-75, 9.0], [-77, 8.5], [-79, 9.3], [-81, 7.5]], [[-17, 15.0], [-16, 12.0], [-13, 9.0], [-9, 5.0], [-3, 5.0], [3, 6.5], [8, 4.5], [9, 2.0], [9, -1.0], [12, -6.0], [14, -11.0], [12, -17.0], [15, -22.0], [18, -27.0], [18, -31.0], [20, -34.5], [23, -34.0], [27, -33.5], [30, -31.0], [32, -29.0], [33, -26.0], [35, -23.0], [35, -18.0], [40, -15.0], [41, -11.0], [40, -6.0], [42, -1.5], [44, 2.0], [48, 5.0], [51, 11.0], [51, 12.0], [48, 12.5], [44, 11.5], [43, 11.0], [40, 12.0], [37, 14.5], [37, 18.0], [38, 21.0], [35, 24.0], [34, 28.0], [32, 31.0], [28, 31.0], [24, 32.0], [20, 31.0], [15, 32.5], [11, 34.0], [10, 37.0], [8, 37.0], [3, 36.5], [-1, 35.5], [-6, 35.5], [-9, 32.0], [-10, 29.0], [-13, 27.5], [-16, 21.0], [-17, 18.0], [-17, 15.0]], [[-9, 38.7], [-9, 42.0], [-9, 43.8], [-2, 43.5], [-2, 48.5], [-5, 48.5], [-1, 49.5], [2, 51.0], [4, 52.0], [7, 53.5], [8, 56.5], [10, 57.5], [8, 58.0], [11, 59.0], [5, 61.0], [5, 58.5], [8, 63.0], [14, 65.0], [14, 68.0], [21, 70.0], [28, 71.2], [31, 70.0], [28, 69.0], [33, 69.5], [40, 67.8], [33, 66.5], [40, 66.0], [44, 66.5], [44, 68.0], [52, 69.0], [60, 69.8], [68, 68.5], [69, 66.8], [73, 66.5], [78, 68.0], [73, 71.5], [80, 73.5], [90, 75.5], [100, 77.0], [105, 78.0], [113, 76.5], [114, 73.5], [126, 73.5], [129, 76.0], [139, 76.0], [140, 73.0], [152, 72.0], [160, 70.0], [170, 69.5], [180, 68.5], [180, 65.0], [172, 66.0], [170, 60.5], [163, 60.0], [163, 62.0], [160, 61.5], [156, 57.0], [163, 57.5], [156, 51.5], [160, 53.5], [157, 51.0], [156, 50.5], [155, 48.5], [143, 46.0], [142, 49.0], [141, 46.0], [140, 52.0], [142, 54.0], [136, 55.0], [137, 53.0], [131, 47.0], [131, 43.0], [130, 42.5], [128, 38.0], [126, 40.0], [122, 40.0], [121, 38.0], [122, 37.0], [120, 34.0], [121, 32.0], [122, 30.5], [121, 28.0], [120, 24.5], [117, 23.5], [113, 22.0], [110, 21.0], [108, 16.0], [106, 11.0], [105, 9.5], [103, 10.0], [100, 13.5], [100, 16.0], [98, 17.0], [99, 14.0], [98, 12.0], [98, 8.0], [100, 7.0], [103, 5.5], [104, 2.0], [104, 1.5], [100, 3.0], [98, 8.0], [94, 16.0], [91, 22.0], [89, 22.0], [87, 21.0], [84, 19.0], [80, 16.0], [80, 13.0], [77, 8.5], [75, 8.0], [73, 16.0], [73, 21.0], [70, 21.0], [67, 24.0], [62, 25.0], [58, 24.5], [57, 25.5], [50, 30.0], [48, 30.0], [49, 28.0], [57, 21.0], [59, 22.5], [56, 17.0], [53, 16.5], [48, 14.0], [43, 12.5], [44, 16.0], [43, 19.0], [39, 23.0], [35, 28.0], [34, 28.0], [35, 31.5], [36, 36.5], [30, 36.5], [36, 36.0], [36, 37.0], [27, 40.5], [26, 40.0], [26, 41.5], [29, 41.0], [28, 43.0], [40, 43.0], [41, 44.5], [38, 44.0], [40, 46.5], [31, 46.5], [33, 45.0], [31, 46.0], [28, 45.5], [31, 46.5], [30, 44.0], [33, 42.0], [28, 41.0], [27, 40.5], [26, 40.5], [23, 40.0], [24, 40.5], [20, 39.5], [20, 42.5], [16, 42.5], [19, 40.0], [18, 42.0], [16, 43.5], [13, 44.0], [13, 45.5], [12, 44.0], [12, 46.5], [14, 45.0], [14, 42.0], [16, 41.5], [17, 41.0], [15, 40.0], [18, 40.0], [16, 38.0], [16, 40.0], [13, 38.0], [15, 37.0], [15, 38.5], [12, 38.0], [10, 42.5], [3, 43.5], [3, 42.0], [-2, 43.5], [-9, 43.5], [-9, 40.0], [-10, 38.7], [-9, 38.7]], [[114, -22.0], [114, -26.0], [114, -29.0], [116, -32.0], [119, -34.0], [123, -34.0], [126, -32.0], [129, -31.5], [132, -32.0], [134, -33.0], [136, -35.0], [138, -35.0], [138, -36.5], [140, -38.0], [143, -38.8], [146, -39.0], [148, -38.0], [150, -37.5], [150, -35.0], [153, -31.0], [153, -28.0], [153, -25.0], [150, -22.0], [146, -19.0], [146, -17.0], [142, -11.0], [141, -12.5], [139, -17.0], [137, -16.0], [136, -12.0], [133, -11.5], [130, -12.5], [126, -14.0], [123, -17.0], [122, -18.0], [121, -20.0], [114, -22.0]], [[-46, 60.0], [-50, 62.0], [-53, 65.0], [-54, 67.0], [-56, 69.0], [-54, 71.0], [-58, 72.0], [-60, 75.0], [-58, 78.0], [-50, 80.0], [-40, 82.0], [-25, 82.5], [-18, 81.0], [-12, 82.0], [-22, 80.0], [-18, 76.0], [-22, 72.0], [-26, 70.0], [-30, 68.0], [-38, 65.5], [-42, 62.0], [-43, 60.5], [-46, 60.0]], [[-180, -71.5], [-160, -74.5], [-140, -74.0], [-120, -73.5], [-100, -72.5], [-80, -72.0], [-60, -64.0], [-58, -63.5], [-62, -66.0], [-50, -66.0], [-40, -68.0], [-20, -70.5], [0, -69.5], [20, -69.5], [40, -67.5], [60, -67.0], [80, -66.5], [100, -66.0], [120, -66.5], [140, -66.5], [160, -70.5], [170, -72.0], [180, -71.5], [180, -78.0], [-180, -78.0], [-180, -71.5]], [[44, -12.5], [48, -13.0], [50, -15.0], [50, -19.0], [48, -22.0], [47, -25.0], [45, -25.0], [44, -22.0], [43, -17.0], [44, -15.0], [44, -12.5]], [[131, 31.0], [132, 33.5], [135, 34.0], [137, 34.5], [140, 36.0], [141, 38.0], [142, 40.0], [141, 41.0], [140, 40.0], [139, 38.0], [137, 37.0], [136, 36.5], [133, 35.5], [131, 34.0], [130, 32.0], [131, 31.0]], [[140, 42.0], [141, 41.5], [144, 43.0], [145, 44.0], [144, 45.5], [141, 45.0], [140, 43.5], [140, 42.0]], [[-5, 50.0], [-3, 50.5], [0, 51.5], [1, 53.0], [-1, 54.0], [-3, 55.0], [-5, 57.5], [-6, 58.5], [-5, 56.0], [-6, 55.0], [-4, 54.0], [-5, 53.0], [-5, 51.5], [-5, 50.0]], [[-10, 52.0], [-6, 52.0], [-6, 54.0], [-7, 55.5], [-10, 54.5], [-10, 53.0], [-10, 52.0]], [[173, -34.5], [176, -37.0], [178, -38.0], [177, -39.5], [175, -41.5], [174, -41.0], [173, -39.0], [172, -37.0], [173, -34.5]], [[167, -46.5], [170, -44.0], [173, -43.0], [174, -41.5], [171, -44.0], [168, -46.5], [167, -47.0], [167, -46.5]], [[-24, 65.5], [-20, 66.5], [-14, 66.0], [-13, 64.5], [-18, 63.5], [-22, 64.0], [-24, 65.5]], [[95, 5.5], [98, 3.5], [100, 0.0], [103, -2.0], [106, -5.5], [104, -5.5], [101, -2.0], [98, 1.0], [95, 5.5]], [[109, 2.0], [113, 3.5], [117, 4.5], [119, 1.0], [117, -3.5], [114, -4.0], [110, -2.5], [109, 0.5], [109, 2.0]], [[131, -1.0], [136, -2.0], [141, -2.5], [147, -6.0], [150, -9.0], [147, -8.0], [143, -9.0], [138, -8.5], [134, -5.0], [131, -3.0], [131, -1.0]], [[120, 18.5], [122, 17.0], [124, 13.0], [126, 9.5], [126, 7.0], [122, 7.5], [120, 13.0], [120, 16.0], [120, 18.5]], [[-85, 22.0], [-80, 23.0], [-76, 21.5], [-74, 20.5], [-78, 20.0], [-82, 21.5], [-85, 22.0]], [[80, 9.5], [82, 8.0], [82, 6.0], [80, 6.5], [80, 9.5]], [[12, 38.0], [15, 38.0], [15, 37.0], [12, 37.5], [12, 38.0]], [[8, 41.0], [10, 41.0], [9, 39.0], [8, 39.5], [8, 41.0]], [[-74, 20.0], [-69, 19.5], [-68, 18.5], [-72, 18.0], [-74, 18.5], [-74, 20.0]], [[10, 77.0], [18, 77.5], [22, 79.0], [16, 80.0], [11, 79.0], [10, 77.0]], [[120, 25.0], [122, 24.5], [121, 22.5], [120, 23.5], [120, 25.0]]];
let GLOBE_RINGS = GLOBE_FALLBACK_RINGS;   // [[ [lon,lat],... ], ... ]
let GLOBE_STATE_RINGS = [];               // US state borders (lat/lon), loaded at runtime
let GLOBE_STATE_SHAPES=null;               // {stateName:[rings]} — filled by loadStateBorders
let _globeLoadedHi=false;
let _statesLoaded=false;
let GLOBE_COUNTRY_RINGS = [];             // world country borders (lon/lat), loaded at runtime
let _countriesLoaded=false;
let _fallbackSmoothed=false;

function globeMark(){ GlobeState.dirty=true; }   // request a redraw

const _latRingCache={}, _lonRingCache={};

function startGlobeLoop(cv){
  const ctx=cv.getContext('2d');
  GlobeState.dirty=true;
  let last=performance.now();
  function frame(now){
    try{ GlobeState.__lastF=performance.now(); }catch(_){}
    if(!cv.isConnected){ GlobeState.raf=null; return; }
    if(cv.offsetParent===null && cv.getClientRects().length===0){
      GlobeState.raf=requestAnimationFrame(frame); return;   // hidden → idle, don't draw
    }
    const dt=Math.min(64, now-last); last=now;
    // Momentum glide — m3 owns the integrator (globeGlideStep sets dirty itself,
    // so the dirty-gate law holds; the inline duplicate this replaced was flagged
    // at M1 verify as a constants fork waiting to drift).
    if(typeof globeGlideStep==='function') globeGlideStep(dt);
    // pulse redraw throttled: idle loop breathes at ~14fps instead of every frame.
    // (A-ORG-1 kept this inside drawGlobeMarkers next to the selection pulse; m5 owns
    // markers here, so the loop re-marks dirty while a site is selected — deviation 3.)
    if(GlobeState.sel!=null){
      if(!GlobeState._lp || performance.now()-GlobeState._lp>70){ GlobeState.dirty=true; GlobeState._lp=performance.now(); }
    }
    if(GlobeState.dirty){ drawGlobe(cv, ctx); GlobeState.dirty=false; }
    GlobeState.raf=requestAnimationFrame(frame);
  }
  if(GlobeState.raf) cancelAnimationFrame(GlobeState.raf);
  GlobeState.raf=requestAnimationFrame(frame);
}

function globeMetrics(cv){
  const dpr=Math.min(2, window.devicePixelRatio||1);
  const w=cv.clientWidth, h=cv.clientHeight;
  if(cv.width!==w*dpr||cv.height!==h*dpr){ cv.width=w*dpr; cv.height=h*dpr; }
  const R=Math.min(w,h)/2*GlobeState.zoom*(GlobeState.baseK||0.72);
  return { dpr, w, h, cx:w/2, cy:h/2, R };
}

function drawGlobe(cv, ctx){
  const m=globeMetrics(cv);
  _setGlobeRot(GlobeState.rotLon, GlobeState.rotLat);   // camera matrix once per frame
  ctx.setTransform(m.dpr,0,0,m.dpr,0,0);
  ctx.clearRect(0,0,m.w,m.h);
  // v14.2.0 ATMOSPHERE — a soft teal limb glow ringing the sphere so the hero reads as a
  // lit body, not a flat wireframe. Drawn first; the sphere fills over the inner half,
  // leaving a rim halo. Additive, no geometry change.
  (function(){
    const ag=ctx.createRadialGradient(m.cx,m.cy,m.R*0.88, m.cx,m.cy,m.R*1.20);
    ag.addColorStop(0,'rgba(92,238,210,0)');
    ag.addColorStop(0.66,'rgba(92,238,210,.06)');
    ag.addColorStop(0.84,'rgba(92,238,210,.15)');
    ag.addColorStop(1,'rgba(92,238,210,0)');
    ctx.beginPath(); ctx.arc(m.cx,m.cy,m.R*1.20,0,Math.PI*2); ctx.fillStyle=ag; ctx.fill();
  })();
  const grad=ctx.createRadialGradient(m.cx-m.R*0.3,m.cy-m.R*0.3,m.R*0.2, m.cx,m.cy,m.R);
  grad.addColorStop(0,'#0f1d1a'); grad.addColorStop(1,'#091110');   // v12.4: graphite-teal sphere
  ctx.beginPath(); ctx.arc(m.cx,m.cy,m.R,0,Math.PI*2); ctx.fillStyle=grad; ctx.fill();
  ctx.lineWidth=1.2; ctx.strokeStyle='rgba(92,238,210,.6)'; ctx.stroke();
  // Clip all overlay drawing to the sphere disc (prevents any chord/limb artifacts).
  ctx.save();
  ctx.beginPath(); ctx.arc(m.cx,m.cy,m.R,0,Math.PI*2); ctx.clip();
  ctx.strokeStyle='rgba(92,238,210,.17)'; ctx.lineWidth=0.6;
  for(let lat=-60; lat<=60; lat+=30){ drawGlobePath(ctx,m, latRing(lat)); }
  for(let lon=-180; lon<180; lon+=30){ drawGlobePath(ctx,m, lonRing(lon)); }
  ctx.strokeStyle='rgba(92,238,210,1)'; ctx.lineWidth=1.4;   // v12.1: coastlines wear the mint accent
  ctx.fillStyle='rgba(64,178,152,.36)';
  for(const ring of GLOBE_RINGS){ drawGlobePath(ctx,m, ring, true); }
  // World COUNTRY borders — very thin, dim, global context layer.
  if(GLOBE_COUNTRY_RINGS && GLOBE_COUNTRY_RINGS.length){
    ctx.strokeStyle='rgba(126,232,208,.34)'; ctx.lineWidth=0.55;
    for(const ring of GLOBE_COUNTRY_RINGS){ drawGlobePath(ctx,m, ring, false); }
  }
  // US state borders — thin, light lines drawn over the land fill (no fill, no glow).
  if(GLOBE_STATE_RINGS && GLOBE_STATE_RINGS.length){
    ctx.strokeStyle='rgba(150,240,220,.62)'; ctx.lineWidth=0.8;
    for(const ring of GLOBE_STATE_RINGS){ drawGlobePath(ctx,m, ring, false); }
  }
  // m5 owns every marker/label/link/brief overlay (A-ORG-1: drawGlobeMarkers et al).
  if(typeof drawMarkersHook==='function') drawMarkersHook(ctx, m);
  ctx.restore();
}

function latRing(lat){ if(_latRingCache[lat]) return _latRingCache[lat]; const a=[]; for(let lon=-180;lon<=180;lon+=6) a.push([lon,lat]); return (_latRingCache[lat]=a); }

function lonRing(lon){ if(_lonRingCache[lon]) return _lonRingCache[lon]; const a=[]; for(let lat=-90;lat<=90;lat+=6) a.push([lon,lat]); return (_lonRingCache[lon]=a); }

function drawGlobePath(ctx,m,ring,fill){
  // Draw each contiguous front-hemisphere run as its own sub-path. Uses the
  // ring's cached Cartesian vectors + the per-frame camera sin/cos, so there is
  // no trig per vertex. Runs that wrap the limb never draw a chord across the globe.
  const xyz=_ringXYZ(ring);
  const m00=_gM.m00,m01=_gM.m01,m02=_gM.m02, m10=_gM.m10,m11=_gM.m11,m12=_gM.m12, m20=_gM.m20,m21=_gM.m21,m22=_gM.m22;
  const cx=m.cx, cy=m.cy, R=m.R;
  let run=null;
  const flush=()=>{
    if(run && run.length>=4){
      ctx.beginPath(); ctx.moveTo(run[0],run[1]);
      for(let k=2;k<run.length;k+=2) ctx.lineTo(run[k],run[k+1]);
      if(fill) ctx.fill();
      ctx.stroke();
    }
    run=null;
  };
  for(let i=0;i<xyz.length;i+=3){
    const x=xyz[i], y=xyz[i+1], z=xyz[i+2];
    // rotate by the per-frame matrix (quaternion-derived)
    const rz=m20*x+m21*y+m22*z;        // depth (toward viewer when >=0)
    if(rz>=0){
      const rx=m00*x+m01*y+m02*z;
      const ry=m10*x+m11*y+m12*z;
      if(!run) run=[];
      run.push(cx-rx*R, cy-ry*R);
    } else { flush(); }
  }
  flush();
}

function _smoothRing(r, iters){
  // Chaikin corner-cutting: rounds the polyline so straight hand-traced
  // segments read as natural coastline. Applied only to the embedded fallback.
  for(let it=0; it<iters; it++){
    const out=[r[0]];
    for(let i=0;i<r.length-1;i++){
      const a=r[i], b=r[i+1];
      out.push([a[0]*0.75+b[0]*0.25, a[1]*0.75+b[1]*0.25]);
      out.push([a[0]*0.25+b[0]*0.75, a[1]*0.25+b[1]*0.75]);
    }
    out.push(r[r.length-1]);
    r=out;
  }
  return r;
}

function smoothFallbackOnce(){
  if(_fallbackSmoothed || _globeLoadedHi) return;
  GLOBE_RINGS = GLOBE_RINGS.map(r=> r.length>=4 ? _smoothRing(r,2) : r);
  _fallbackSmoothed=true;
}

// Map-data loading + topojson decode live in m6-mapdata.js (same-origin only —
// the interim CDN-rung copies that briefly lived here were removed at M1
// integration so no cross-origin fetch can survive concatenation order).
