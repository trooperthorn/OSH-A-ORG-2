// ═══════════════════════════════════════════════════════════════════════════════
// s5-clocks.js — A-ORG-2 shell: FOUR CORNER ZONE CLOCKS (charter D4: corner clocks
// only, the time console is retired). #clockTL local · #clockTR Zulu/UTC ·
// #clockBL Europe/Berlin · #clockBR Asia/Seoul, each a tiny mono HH:MM over its
// zone label. Repaint happens exactly on minute boundaries (setTimeout armed to
// the next :00), instantly on visibility/focus wake, and never while the user is
// typing in an input.
// (PORTED from A-ORG-1 index.html — the source is truth; names kept where ported.)
//
// Ported from A-ORG-1 (function/state names kept where the code came across):
//   militaryTime        (~L14070)  24h "HH:MM" via Intl.DateTimeFormat formatToParts
//                                  ('en-GB', hour12:false), the '24'→'00' hour fix,
//                                  padStart, and the '--:--' failure face. Verbatim.
//   tickClocks + __k    (~L18799)  the clock repaint brain and its per-element
//                                  write-dedupe: key the rendered string on el.__k
//                                  and touch innerHTML ONLY when the face changed
//                                  (a no-op minute costs zero DOM writes).
//   __tzLbl label law   (~L18829, v12.3 owner)  the LOCAL cell shows the zone's
//                                  short NAME when the platform has one (EDT/CST…),
//                                  else the zone's own city — NEVER a Zulu/UTC
//                                  offset. Cached once on window.__tzLbl.
//   __lastMin latch     (~L22216)  minute-boundary refresh: repaint only when
//                                  getMinutes() rolled over; the latch is set even
//                                  when the paint is skipped (typing), so a skipped
//                                  minute stays skipped until the NEXT boundary.
//   typing guard        (~L22220)  ae=document.activeElement; tagName INPUT or
//                                  TEXTAREA → skip the repaint. Verbatim.
//   wake idiom + __visT (~L22186)  visibilitychange(!hidden)/focus → reset
//                                  __lastMin=-1 and repaint IMMEDIATELY (throttled
//                                  background tabs snap current the moment you
//                                  return); __visT is the wiring once-guard. The
//                                  source wake bypasses the typing guard (it only
//                                  ever protected panels that CONTAINED inputs);
//                                  kept — these chips hold no inputs.
//   time-over-label     (~L5160 .stage-clock .bar-time, ~L4293 .bt-t/.bt-z)  the
//                                  stage-corner clock grammar: digits stacked over
//                                  a micro uppercase zone label → .ck-t/.ck-z.
//   boot idiom          (~L23544)  addEventListener('load', setTimeout(try{}catch))
//                                  + once-guard (s3-search _srBooted precedent).
//
// NEW (A-ORG-2 contracts, no direct A-ORG-1 counterpart):
//   CLOCK_ZONES          the four fixed corner cells (mission contract). A-ORG-1's
//                        corners were LOCAL + a selection-driven SELECT cell backed
//                        by CLOCK_REGIONS; D4 fixes them to local/Zulu/Berlin/Seoul.
//   initClocks()         shell boot hook: resolve local tz + label, inject CSS,
//                        first paint, arm the boundary timer, wire wake. Self-arms
//                        on 'load' (once-guarded) like every s-module.
//   _ckArm()/_ckBeat()   the setTimeout-to-boundary pair (see deviation 1).
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. setTimeout-TO-BOUNDARY replaces the source's 1s __secT interval (mission
//      contract). A-ORG-1 ticked every second because seconds were on display
//      (.ts-ss); these faces show minutes only, so the timer sleeps until the next
//      wall-clock :00 (60000 − Date.now()%60000, +40ms landing guard) and re-arms
//      after each beat. The ported __lastMin latch makes an early fire a no-op and
//      the fresh re-arm computes the corrected remainder — self-healing drift.
//   2. Plain tabular HH:MM text instead of seg7HTML LCD markup — the seg7 engine
//      is not ported to A-ORG-2 and tiny glass chips want plain mono digits.
//   3. esc() renamed _ckEsc (single-script concat law: s3 already renamed its copy
//      _srEsc; duplicate top-level declarations would silently override).
//   4. The LOCAL label falls back to the literal 'LOCAL' when __tzLbl computes
//      empty (the source banner just omitted the label; a corner chip with no
//      label would read as a mystery number).
//   5. tickClocks walks the fixed 4-cell table, not the source's [data-tz] scan +
//      barLocal/barTimeSel/tbLive branches — those surfaces are retired (D4).
//   6. No GlobeState.dirty anywhere — clocks are DOM chrome, not canvas; the
//      render loop is never touched (doctrine).
//
// Exports (top-level — the final assembly concatenates into ONE <script>):
//   CLOCK_ZONES, militaryTime, tickClocks, initClocks,
//   _ckArm, _ckBeat, _ckWake, _ckEsc, _ckInjectCSS
//   window state: __lastMin (boundary latch) · __ckT (armed timeout) ·
//                 __visT (wake wiring once-guard) · __tzLbl (local label cache)
// ═══════════════════════════════════════════════════════════════════════════════

// ---- The four corner cells (mission contract: TL local · TR Zulu · BL Berlin ·
//      BR Seoul). TL's tz stays undefined until initClocks resolves it — an
//      undefined timeZone means "platform local" to Intl, so even a failed
//      resolve renders the right time under the fallback label. ----------------
const CLOCK_ZONES = [
  { id:'clockTL', tz:undefined,        label:'LOCAL'  },
  { id:'clockTR', tz:'UTC',            label:'ZULU'   },
  { id:'clockBL', tz:'Europe/Berlin',  label:'BERLIN' },
  { id:'clockBR', tz:'Asia/Seoul',     label:'SEOUL'  },
];

// Current military (24h) time string "HHMM" for an IANA zone.
// (PORTED verbatim ~L14070 — including the '24'→'00' fix and the failure faces.)
function militaryTime(tz, date, colon){
  date = date || new Date();
  try{
    const f=new Intl.DateTimeFormat('en-GB',{timeZone:tz, hour:'2-digit', minute:'2-digit', hour12:false});
    const parts=f.formatToParts(date); let hh='00',mm='00';
    parts.forEach(p=>{ if(p.type==='hour')hh=p.value; if(p.type==='minute')mm=p.value; });
    if(hh==='24') hh='00';
    hh=hh.padStart(2,'0'); mm=mm.padStart(2,'0');
    return colon ? hh+':'+mm : hh+mm;
  }catch(e){ return colon?'--:--':'----'; }
}

// text-body escape (A-ORG-1 esc ~L14030, renamed — deviation 3)
function _ckEsc(v){ return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ---- The repaint brain (PORTED name + __k write-dedupe ~L18799) ---------------
// One Date() per beat feeds all four faces; a cell whose rendered string did not
// change costs nothing (el.__k key check — the source's exact idiom).
function tickClocks(){
  const now=new Date();
  for(let i=0;i<CLOCK_ZONES.length;i++){
    const z=CLOCK_ZONES[i];
    const el=document.getElementById(z.id); if(!el) continue;
    const t=militaryTime(z.tz, now, true);
    const key=t+'|'+z.label;
    if(el.__k!==key){ el.__k=key;
      el.innerHTML='<span class="ck-t">'+t+'</span><span class="ck-z">'+_ckEsc(z.label)+'</span>';
    }
  }
}

// ---- Minute-boundary beat (latch + typing guard PORTED ~L22216-22225) ---------
function _ckBeat(){
  try{
    const d=new Date();
    const mm=d.getMinutes();
    if(window.__lastMin!==mm){
      window.__lastMin=mm;
      const ae=document.activeElement;
      const typing=ae && (ae.tagName==='INPUT'||ae.tagName==='TEXTAREA');
      if(!typing) tickClocks();
    }
  }catch(_){}
  _ckArm();
}

// setTimeout-to-boundary (deviation 1): sleep until just past the next :00.
// +40ms landing guard — timers can fire a few ms early; landing past the boundary
// guarantees getMinutes() has rolled over (and if one still lands early, the
// __lastMin latch no-ops it and the re-arm computes the tiny corrected remainder).
function _ckArm(){
  try{ clearTimeout(window.__ckT); }catch(_){}
  window.__ckT=setTimeout(_ckBeat, 60000-(Date.now()%60000)+40);
}

// ---- Wake (PORTED ~L22186): throttled background tabs snap current on return.
// Resets the latch, repaints immediately (source wake bypasses the typing guard —
// these chips contain no inputs, so a repaint can never eat a keystroke), and
// re-arms: a hidden tab's timer can be minutes late, so re-anchor to the clock.
function _ckWake(){
  try{ window.__lastMin=-1; tickClocks(); }catch(_){}
  _ckArm();
}

// ---- Boot (A-ORG-1 load+setTimeout idiom ~L23544; s3 _srBooted once-guard) ----
let _ckBooted=false;

function initClocks(){
  if(_ckBooted) return;
  _ckBooted=true;
  // LOCAL cell: resolve the platform zone + the v12.3 label law (~L18829) —
  // the zone's short NAME (EDT/CST…) else its city; NEVER a Zulu/UTC offset.
  try{
    const ltz=Intl.DateTimeFormat().resolvedOptions().timeZone;
    CLOCK_ZONES[0].tz=ltz;
    if(window.__tzLbl===undefined){
      let z=''; try{ z=(new Intl.DateTimeFormat([], {timeZoneName:'short'}).formatToParts(new Date()).find(function(p){ return p.type==='timeZoneName'; })||{}).value||''; }catch(_){}
      if(!z || /GMT|UTC/i.test(z)) z=(String(ltz).split('/').pop()||'').replace(/_/g,' ');
      if(/GMT|UTC|^Etc\b/i.test(z)) z='';   // a zone NAME or nothing — never an offset marker
      window.__tzLbl=z;
    }
    if(window.__tzLbl) CLOCK_ZONES[0].label=window.__tzLbl;   // empty → 'LOCAL' (deviation 4)
  }catch(_){}
  _ckInjectCSS();
  window.__lastMin=new Date().getMinutes();   // first paint owns the current minute
  tickClocks();
  _ckArm();
  try{ if(!window.__visT){ window.__visT=1;
    document.addEventListener('visibilitychange', function(){ if(!document.hidden) _ckWake(); });
    window.addEventListener('focus', _ckWake);
  } }catch(_){}
}

addEventListener('load', function(){ setTimeout(function(){ try{ initClocks(); }catch(_){} }, 0); });

// ---- CSS (construction-phase injection, s3 precedent; tokens only; phone-first;
//      grammar ported from .stage-clock .bar-time ~L5160 + .bt-t/.bt-z ~L4293).
//      .clock stays a CLASS selector so s1's .clock:empty{display:none} law still
//      out-specifies it — pre-boot empty chips show no dead chrome. No fixed
//      positioning, no transforms — the chips sit where s1-tokens.css put them. --
function _ckInjectCSS(){
  if(document.getElementById('s5ClockCSS')) return;      // the final-assembly no-op guard
  const st=document.createElement('style'); st.id='s5ClockCSS';
  st.textContent=
    '.clock{display:flex;flex-direction:column;align-items:center;gap:3px}'+
    /* tiny mono digits — brighter than the chip's dim base so time reads first */
    '.ck-t{font:700 12px/1 var(--mono,ui-monospace,Menlo,monospace);'+
      'font-variant-numeric:tabular-nums;letter-spacing:.06em;color:var(--text,#e7edf2)}'+
    /* micro zone label — the .bt-z voice: uppercase, tracked wide, faint */
    '.ck-z{font:700 7.5px/1 var(--mono,ui-monospace,Menlo,monospace);'+
      'letter-spacing:.16em;color:var(--faint,#5c6b76)}'+
    /* desktop layer ONLY — a touch more presence in the true corners */
    '@media(min-width:1100px){.ck-t{font-size:13px}.ck-z{font-size:8px}}';
  document.head.appendChild(st);
}
