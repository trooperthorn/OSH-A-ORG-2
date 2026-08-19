// ═══════════════════════════════════════════════════════════════════════════════
// m1-geom.js — A-ORG-2 M1 sphere math + canvas metrics (PORTED from A-ORG-1)
//
// Ported from A-ORG-1 index.html (source of truth — math survived 22 major versions):
//   _qMul            (~L16027)  quaternion product a*b
//   _qNorm           (~L16037)  quaternion normalize
//   _qFromAxisAngle  (~L16039)  axis-angle → quaternion
//   lonLatToVec      (~L16042)  geographic degrees → unit vector [x,y,z]
//   _setGlobeRot     (~L16048)  GlobeState.q → 3x3 rotation matrix _gM (once per frame)
//   _gM / _qFrame    (~L13922)  per-frame rotation matrix + the quaternion it came from
//   _projectLonLat   (~L16069)  lon/lat → [screenX, screenY, depth]
//   _projectVec      (~L16078)  precomputed unit vector → [screenX, screenY, depth]
//   globeMetrics     (~L16751)  canvas metrics: DPR clamp 2, backing-store sync,
//                               radius law R = min(w,h)/2 * zoom * baseK (0.72 fallback)
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. _visibleLonLat(lon, lat, tol) is NEW-NAMED: A-ORG-1 has no named front-hemisphere
//      test — the gate is inline everywhere (drawGlobePath: rz>=0; marker loop: p[2]<0 →
//      skip; arc paths: v[2] >= -0.02 limb tolerance). This function is that exact inline
//      math (depth = _gM row 3 · vec) hoisted behind a name so M1+ callers stop
//      re-deriving it. tol defaults to 0 (the strict dot/ring gate); pass 0.02 to get the
//      arcs' limb tolerance. Depth sign convention unchanged: >= 0 faces the viewer.
//   2. No inverse projection is ported because NONE EXISTS in A-ORG-1: picking hit-tests
//      the forward-projected marker cache (GlobeState._screen) — handleGlobeTap
//      (~L17893) — never a screen→lon/lat unproject. Do not invent one here.
//   3. _setGlobeRot keeps its legacy (rotLon, rotLat) signature UNUSED, exactly as in
//      A-ORG-1: orientation comes solely from GlobeState.q. Callers pass anything.
//   4. NOT ported here (owned by other M1 files, kept out to avoid duplicate top-level
//      declarations at concatenation): GlobeState literal, _rebuildGlobeQ /
//      _faceLonLatAngles / applyDrag (interaction), drawGlobePath /
//      latRing / lonRing (render loop), GLOBE_RINGS data.
//
// CONTRACTS HONORED:
//   - Reads GlobeState.{q, zoom, baseK} at CALL time only — concatenation-order safe;
//     no DOM beyond the canvas param of globeMetrics; zero rendering; no per-frame work
//     here (render loop redraws only on GlobeState.dirty — that gate lives elsewhere).
//   - Plain sloppy-mode JS: top-level function declarations, no ES modules, no classes.
//   - Screen mapping is A-ORG-1's exact [cx - rx*R, cy - ry*R] (both axes negated) —
//     this is what makes east-right / north-up true under _rebuildGlobeQ's quaternion
//     convention. Do not "fix" the signs.
// ═══════════════════════════════════════════════════════════════════════════════

// ---- Per-frame rotation matrix (quaternion expanded once per frame; hot loops do
//      9 mults per vertex, no trig, no gimbal lock) ----
let _qFrame=[0,0,0,1];
let _gM={ m00:1,m01:0,m02:0, m10:0,m11:1,m12:0, m20:0,m21:0,m22:1 };

// ---- Quaternion helpers (minimal) ----
function _qMul(a,b){ // a*b
  const ax=a[0],ay=a[1],az=a[2],aw=a[3], bx=b[0],by=b[1],bz=b[2],bw=b[3];
  return [
    aw*bx+ax*bw+ay*bz-az*by,
    aw*by-ax*bz+ay*bw+az*bx,
    aw*bz+ax*by-ay*bx+az*bw,
    aw*bw-ax*bx-ay*by-az*bz
  ];
}

function _qNorm(q){ const l=Math.hypot(q[0],q[1],q[2],q[3])||1; return [q[0]/l,q[1]/l,q[2]/l,q[3]/l]; }

function _qFromAxisAngle(ax,ay,az,ang){ const h=ang/2, s=Math.sin(h); return [ax*s,ay*s,az*s,Math.cos(h)]; }

// Geographic degrees → unit sphere vector. Axis convention (load-bearing):
// x = cos(lat)cos(lon), y = sin(lat) [north up], z = cos(lat)sin(lon).
function lonLatToVec(lon, lat){
  const la=lat*Math.PI/180, lo=lon*Math.PI/180;
  const cl=Math.cos(la);
  return [ cl*Math.cos(lo), Math.sin(la), cl*Math.sin(lo) ];
}

// Expand GlobeState.q into _gM. Call ONCE per frame before any projection.
// (rotLon, rotLat) are legacy A-ORG-1 params and are intentionally unused.
function _setGlobeRot(rotLon, rotLat){
  const q=GlobeState.q||[0,0,0,1];
  const x=q[0],y=q[1],z=q[2],w=q[3];
  const xx=x*x, yy=y*y, zz=z*z, xy=x*y, xz=x*z, yz=y*z, wx=w*x, wy=w*y, wz=w*z;
  // standard quaternion→matrix
  _gM.m00=1-2*(yy+zz); _gM.m01=2*(xy-wz);   _gM.m02=2*(xz+wy);
  _gM.m10=2*(xy+wz);   _gM.m11=1-2*(xx+zz); _gM.m12=2*(yz-wx);
  _gM.m20=2*(xz-wy);   _gM.m21=2*(yz+wx);   _gM.m22=1-2*(xx+yy);
  _qFrame=q;
}

// lon/lat → [screenX, screenY, depth]. depth (rz) >= 0 means front hemisphere.
// m is a globeMetrics(cv) result ({cx, cy, R}).
function _projectLonLat(lon, lat, m){
  const lo=lon*Math.PI/180, la=lat*Math.PI/180, cl=Math.cos(la);
  const x=cl*Math.cos(lo), y=Math.sin(la), z=cl*Math.sin(lo);
  const rx=_gM.m00*x+_gM.m01*y+_gM.m02*z;
  const ry=_gM.m10*x+_gM.m11*y+_gM.m12*z;
  const rz=_gM.m20*x+_gM.m21*y+_gM.m22*z;
  return [m.cx - rx*m.R, m.cy - ry*m.R, rz];
}

// Same projection for a precomputed unit vector (arc interpolation feeds this —
// skips the per-point trig of _projectLonLat).
function _projectVec(v, m){
  const x=v[0],y=v[1],z=v[2];
  const rx=_gM.m00*x+_gM.m01*y+_gM.m02*z;
  const ry=_gM.m10*x+_gM.m11*y+_gM.m12*z;
  const rz=_gM.m20*x+_gM.m21*y+_gM.m22*z;
  return [m.cx - rx*m.R, m.cy - ry*m.R, rz];
}

// Front-hemisphere visibility: true when (lon,lat) faces the viewer under the current
// _gM. This is A-ORG-1's inline gate (depth = _gM row 3 · unit vector, >= 0 visible)
// given a name — see header deviation 1. tol (optional, default 0): pass 0.02 for the
// arc-path limb tolerance (A-ORG-1 draws arc segments down to depth >= -0.02 so curves
// kiss the limb instead of popping).
function _visibleLonLat(lon, lat, tol){
  const lo=lon*Math.PI/180, la=lat*Math.PI/180, cl=Math.cos(la);
  const x=cl*Math.cos(lo), y=Math.sin(la), z=cl*Math.sin(lo);
  return (_gM.m20*x+_gM.m21*y+_gM.m22*z) >= -(tol||0);
}

// Canvas metrics + the radius law. DPR clamped to 2; backing store synced to CSS size
// (the one canvas mutation this module performs — metrics, not rendering).
// R = min(w,h)/2 * zoom * baseK (baseK: 0.72 phone / 0.88 desktop, set by the shell;
// 0.72 fallback preserved from A-ORG-1).
function globeMetrics(cv){
  const dpr=Math.min(2, window.devicePixelRatio||1);
  const w=cv.clientWidth, h=cv.clientHeight;
  if(cv.width!==w*dpr||cv.height!==h*dpr){ cv.width=w*dpr; cv.height=h*dpr; }
  const R=Math.min(w,h)/2*GlobeState.zoom*(GlobeState.baseK||0.72);
  return { dpr, w, h, cx:w/2, cy:h/2, R };
}


// Ring → cached Cartesian vertices (PORT of A-ORG-1 L16059-16068; cache re-keyed
// by ring identity — m6 and smoothFallbackOnce always swap whole arrays, so a
// WeakMap can never go stale). Consumed every frame by m2's drawGlobePath.
const _ringXYZCache=new WeakMap();
function _ringXYZ(ring){
  let a=_ringXYZCache.get(ring);
  if(a) return a;
  a=new Float64Array(ring.length*3);
  for(let i=0;i<ring.length;i++){
    const lo=ring[i][0]*Math.PI/180, la=ring[i][1]*Math.PI/180, cl=Math.cos(la);
    a[3*i]=cl*Math.cos(lo); a[3*i+1]=Math.sin(la); a[3*i+2]=cl*Math.sin(lo);
  }
  _ringXYZCache.set(ring,a);
  return a;
}
