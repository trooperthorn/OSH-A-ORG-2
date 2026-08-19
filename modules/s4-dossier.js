// ═══════════════════════════════════════════════════════════════════════════════
// s4-dossier.js — A-ORG-2 shell: THE DOSSIER + THE SELECTION BRAIN (single-brain
// law: one selection model, one drawer). selectSite(id|null) is the ONE function
// every selection path routes through — m3's tap hook (tapAtScreen), s3's search
// (via its showDossier hook), the dossier's own crumb/child rows, the header ✕
// and the #stageBar Clear pill. showDossier(id)/hideDossier() control #dossier,
// the shell's bottom card. (PORTED from A-ORG-1 index.html — the source is truth;
// names kept where code ported.)
//
// Ported from A-ORG-1 (function/state names kept where the code came across):
//   renderBaseDossier    (~L15039)  the site-card grammar: od-head-slim header
//                                   (od-name + bd-state chip + od-sp spacer +
//                                   od-ico-x ✕ carrying data-odclose), the
//                                   bd-stats count line with the italic
//                                   right-aligned bd-hint ("tap any to open"),
//                                   od-sec section headers with a bold count,
//                                   bd-tile tappable unit rows, od-note short
//                                   empty states, and the never-zoom-OUT fly
//                                   Math.max(GlobeState.zoom, 2.6).
//   _odWired delegate    (~L12480)  ONE document-level click delegate, installed
//                                   at script eval behind the window._odWired
//                                   once-guard: [data-odclose] → select(null),
//                                   [data-odsel] → select(target) (~L13350).
//   od-crumb grammar     (~L15373 + CSS ~L1549/5836)  ancestors as live jump
//                                   chips (data-odsel); od-crumb name kept.
//   fresh-card scroll    (~L15102)  a new selection brings the card top into
//                                   view (v18.0.2 'start') — here scrollTop=0,
//                                   see deviation 7.
//   esc / _escA          (~L14030/14129)  HTML body / attribute escaping,
//                                   renamed _odEsc/_odEscA (s3's deviation-8
//                                   rule: canonical names belong to the shell
//                                   core at concatenation; bodies verbatim).
//   od-sec underline     (~L2214)   the 44px gradient underline on section
//                                   headers (currentColor here — see CSS notes).
//   :active brightness   (~L15342 idiom)  press feedback on icon buttons.
//   boot idiom           (~L23544)  addEventListener('load', setTimeout(try{}))
//                                   + once-guard, exactly as s3 boots.
//
// NEW (A-ORG-2 contracts, no direct A-ORG-1 counterpart):
//   selectSite(id|null)  THE single brain (mission contract). Sets GlobeState.sel
//                        + dirty (m5's lazy follow rebuilds the arc sets), flies,
//                        renders/hides the card, syncs the Clear pill. Exposed on
//                        window explicitly (mission: "Expose selectSite globally").
//   tapAtScreen(x, y)    m3-input's guarded tap hook, DECLARED HERE (m3 header:
//                        "selection/dossier module hook"). siteHitTest (m5) → id
//                        → selectSite. A no-hit tap keeps the selection — exactly
//                        A-ORG-1's handleGlobeTap, which only hid the tip
//                        (~L17929); clearing is a deliberate act (✕ / Clear).
//   showDossier(id)      render + reveal #dossier. RENDER ONLY — it never touches
//                        GlobeState.sel (s3's searchSelect sets sel itself, then
//                        calls this hook; the brain calls it last for the same
//                        order). hideDossier() is the symmetric close — also
//                        side-effect-free; only selectSite(null) clears state.
//   initDossier()        boot hook: inject CSS + re-agree with any GlobeState.sel
//                        that already exists (harness boots). Self-arms on 'load'.
//   _odStageClearSync()  shows/hides the shell's #stageClear pill with the
//                        selection (s1-shell: "back/clear stay hidden until the
//                        selection/search owner wires and shows them" — this
//                        module IS the selection owner; the delegate routes the
//                        pill through selectSite(null)). #stageBack/#stageReset
//                        are NOT touched (reset is shell-wired; back has no
//                        history model in M1).
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. The card is the SHELL's #dossier (bottom card, position:absolute inset
//      math per s1-tokens.css §4 — the reliability-contract translation of
//      "in-flow, never fixed" for a non-scrolling 100dvh body). This module
//      writes CONTENT ONLY: no positioning, no transforms, no fixed layers —
//      A-ORG-1's #orgDetail/host plumbing (cmd-zero sync, navTab, scrollIntoView
//      against a scrolling page) is gone with the page it served.
//   2. Selection is a SITE ID (GlobeState.sel, shell contract) — A-ORG-1 selected
//      org NODES by name (selectOrgNode/OrgSel). data-odsel therefore carries the
//      site id, not a name (same shift as s3's deviation 4). OrgSel itself is not
//      ported: GlobeState.sel IS the selection model, one source of truth.
//   3. UP is crumb ROWS, not the horizontal strip: A-ORG-1's od-crumbs-slim strip
//      packed a deep org path sideways; here each ancestor SITE is a full-width
//      44px row (phone-first tap targets), direct parent first → root last, every
//      one live (the terminal element — the selected site — is the card header,
//      so no inert od-crumb-cur is rendered). The root row wears an HQ tag
//      (m5 deviation 7: roots are "the closest thing to A-ORG-1's kind:hq").
//   4. Crumb sub-lines walk parentUnit: hop N's row shows the unit AT that hop
//      which owns hop N−1 (sel.parentUnit for the first row), falling back to the
//      hop's own headline unit — the row reads as the command line, which is the
//      section's job; A-ORG-1 crumbs had org names only. Child rows show the
//      child's own unit · st.
//   5. bd-tile's right-hand slot (bd-st) held ★ stars in A-ORG-1; A-ORG-2 sites
//      carry no star field, so the slot now carries the child's OWN subordinate
//      count ("N subs" — mission: children rows with counts). Counts come from
//      m5's childrenOf (parent pointer is the only relationship).
//   6. Arc clearing on ✕ (mission: "clears GlobeState.sel + arcs"): sel=null +
//      globeMark() already clears the arcs via m5's lazy follow (its deviation
//      6); the null path ALSO calls _syncSelArcs(null) guarded so the stores drop
//      immediately (m5: "stays exposed for callers that want the rebuild
//      immediately"). The select path relies on the lazy follow alone, exactly
//      like s3's searchSelect (its deviation 6). The duplicate null rebuild on
//      the next frame is idempotent.
//   7. Fresh render sets host.scrollTop=0 instead of scrollIntoView: #dossier IS
//      the scroll container on a non-scrolling body, so 'block:start' has no page
//      to scroll — resetting its own scroll is the same intent (v18.0.2: the
//      whole card into view), zero layout tricks.
//   8. Section voices are the ARC voices: UP rows/header speak --signal (m5 draws
//      the parent chain gold), DOWN rows/header speak --accent (child web blue) —
//      list ⇄ map always in agreement (A-ORG-1's own v10.x law). A-ORG-1's neon
//      green od-sec/od-crumb colors are NOT ported: no green near data (tier
//      law adjacency), and arctic has no neon token.
//   9. CSS ships as a JS-injected <style id="s4DossierCSS"> — s3's deviation 9
//      verbatim: construction-phase only; at final assembly the block moves into
//      index.html's single <style> and the injector no-ops via its guard. Tokens
//      only (+A-ORG-1-literal fallbacks); phone-first; desktop hovers ONLY inside
//      @media(min-width:1100px); no position:fixed; no transforms on anything
//      that scrolls (the ONLY transform is the ✕'s static 44px hit-area pseudo —
//      A-ORG-1's od-ico::after idiom ~L4580 — on a non-scrolling button).
//  10. NOT ported, with reasons: tenant grid/echelon grouping (_unitsAtInstallation,
//      _echelonOf — tenants[] ride sites.json but are the dossier backlog item s3
//      deviation 10 already parked; the mission card is base/unit/UP/DOWN only);
//      cross-org tie cards + cxRelTag (charter §2 OUT: parent pointer is the only
//      relationship); nav history/_navRecord (no tab model); stack popups + tips
//      (one drawer, single-brain law); _cmdClearSync/cmd-zero (no zero-state CSS
//      here — [hidden] does the job).
//
// OWNERSHIP (concatenation law — no duplicate top-level declarations):
//   - DECLARED HERE: selectSite, showDossier, hideDossier, tapAtScreen,
//     initDossier, _odRender, _odEsc, _odEscA, _odStageClearSync, _odInjectCSS,
//     _odBooted (+ the window._odWired delegate flag, A-ORG-1 name kept).
//   - USED, declared elsewhere (ALL guarded typeof at call time): GlobeState
//     (shell), siteById / childrenOf / parentChainOf / siteHitTest / _syncSelArcs
//     (m5), globeMark (m3), flyToLatLon (m4).
//
// CONTRACTS HONORED:
//   - Reads GlobeState/SITES-derived indexes at call time only — concatenation-
//     order safe; the delegate + load boot need no DOM at install time.
//   - Redraw law: selection marks GlobeState.dirty once per select/clear (an
//     event, never per-frame); nothing here touches the render loop.
//   - Reliability: no position:fixed, no pointer capture, no transforms on
//     scroll containers. No frameworks, no webfonts, sloppy-mode top-level
//     function declarations only.
//   - Brief tier tokens (--t1..--t4) untouched; no green on or near data.
// ═══════════════════════════════════════════════════════════════════════════════

// ---- Escaping (PORT of esc ~L14030 / _escA ~L14129 — renamed, s3 dev-8 rule) ---
function _odEsc(s){ return String(s).replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
function _odEscA(v){ return String(v).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// ---- THE SINGLE BRAIN (mission contract) ---------------------------------------
// Every selection path lands here: m3 tap → tapAtScreen → selectSite; search rows
// → searchSelect (sets sel + flies, then the showDossier hook — same net effect,
// same order); dossier crumb/child rows + ✕ + Clear pill → the delegate below.
function selectSite(id){
  if(id==null){
    GlobeState.sel=null;
    if(typeof globeMark==='function') globeMark(); else GlobeState.dirty=true;
    // arcs drop NOW (deviation 6); m5's lazy follow re-confirms next frame.
    try{ if(typeof _syncSelArcs==='function') _syncSelArcs(null); }catch(_){}
    hideDossier();
    return;
  }
  const s=(typeof siteById==='function') ? siteById(id) : null;
  if(!s) return;                       // stale id (old DOM, bad deep link): keep the current picture
  GlobeState.sel=s.id;
  if(typeof globeMark==='function') globeMark(); else GlobeState.dirty=true;
  if(typeof flyToLatLon==='function' && s.lat!=null && s.lon!=null){
    // the base-dossier fly (~L15089): never zoom OUT to meet a selection
    try{ flyToLatLon(s.lat, s.lon, Math.max(GlobeState.zoom||1, 2.6)); }catch(_){}
  }
  showDossier(s.id);
}
try{ window.selectSite=selectSite; }catch(_){}   // mission: expose the brain globally

// ---- m3's tap hook (m3-input deviation 4 boundary — DECLARED HERE) -------------
function tapAtScreen(x, y){
  const s=(typeof siteHitTest==='function') ? siteHitTest(x, y) : null;
  if(s && s.id!=null) selectSite(s.id);
  // no-hit: selection survives (A-ORG-1 ~L17929 only hid the tip) — clearing is
  // a deliberate act (✕ on the card, or the stage bar's Clear pill).
}

// ---- The card (PORT of renderBaseDossier's grammar — render only, no state) ----
function showDossier(id){
  const host=document.getElementById('dossier'); if(!host) return;
  const s=(typeof siteById==='function') ? siteById(id) : null;
  if(!s){ hideDossier(); return; }
  _odInjectCSS();                                  // order-safe if a select lands before 'load'
  host.innerHTML=_odRender(s);
  host.hidden=false;
  try{ host.setAttribute('aria-label', s.base+' — dossier'); }catch(_){}
  host.scrollTop=0;                                // deviation 7: whole card into view
  _odStageClearSync(true);
}

function hideDossier(){
  const host=document.getElementById('dossier'); if(!host) return;
  host.hidden=true;
  host.innerHTML='';
  try{ host.setAttribute('aria-label','Dossier'); }catch(_){}
  _odStageClearSync(false);
}

function _odRender(s){
  const chain=(typeof parentChainOf==='function') ? parentChainOf(s.id) : [];
  const kids=((typeof childrenOf==='function') ? childrenOf(s.id) : [])
    .sort(function(a,b){ return String(a.base).localeCompare(String(b.base)); });

  // header — od-head-slim (~L15083): name · st chip · spacer · ✕ (data-odclose)
  let h='<div class="od-head od-head-slim">'
    +'<div class="od-name">'+_odEsc(s.base)+'</div>'
    +(s.st?'<span class="bd-state">'+_odEsc(s.st)+'</span>':'')
    +'<span class="od-sp"></span>'
    +'<button class="od-ico od-ico-x" type="button" data-odclose="1" aria-label="Clear selection">✕</button>'
    +'</div>';

  // owning unit + its expansion sub-line
  if(s.unit)     h+='<div class="od-unit">'+_odEsc(s.unit)+'</div>';
  if(s.unitFull) h+='<div class="od-unit-full">'+_odEsc(s.unitFull)+'</div>';

  // stats line (bd-stats grammar ~L15087)
  h+='<div class="bd-stats">'
    +(chain.length?('<span>'+chain.length+(chain.length===1?' hop':' hops')+' up the chain</span>'):'')
    +'<span>'+kids.length+' subordinate '+(kids.length===1?'site':'sites')+'</span>'
    +((chain.length||kids.length)?'<span class="bd-hint">tap any to open</span>':'')
    +'</div>';

  // UP — the command line as crumb ROWS, direct parent first → root last
  // (deviations 3-4; gold voice = m5's parent-chain arcs).
  if(chain.length){
    h+='<div class="od-sec od-sec-up">Command line <b>'+chain.length+'</b></div>';
    let owner=s.parentUnit;                        // the unit at hop 0 that owns THIS site
    for(let i=0;i<chain.length;i++){
      const p=chain[i];
      const label=owner||p.unit||'';
      const sub=label+(p.st?((label?' · ':'')+p.st):'');
      h+='<button class="od-crumb" type="button" data-odsel="'+_odEscA(p.id)+'">'
        +'<i class="od-hop">↑</i>'
        +'<span class="bd-nm"><b>'+_odEsc(p.base)+'</b>'+(sub?'<span>'+_odEsc(sub)+'</span>':'')+'</span>'
        +'<span class="od-sp"></span>'
        +(p.parent==null?'<span class="od-crumb-tag">HQ</span>':'')
        +'</button>';
      owner=p.parentUnit;                          // hop N+1 owns hop N via ITS parentUnit
    }
  }else{
    h+='<div class="od-sec od-sec-up">Command line</div>'
      +'<div class="od-note">Top of the chain — this site reports to no one.</div>';
  }

  // DOWN — direct children as rows with counts (deviation 5; blue voice = m5's
  // child web). One echelon by design: each row is one tap deeper.
  if(kids.length){
    h+='<div class="od-sec od-sec-down">Subordinate sites <b>'+kids.length+'</b></div>'
      +kids.map(function(c){
        const n=(typeof childrenOf==='function') ? childrenOf(c.id).length : 0;
        const sub=(c.unit||'')+(c.st?((c.unit?' · ':'')+c.st):'');
        return '<button class="bd-tile" type="button" data-odsel="'+_odEscA(c.id)+'">'
          +'<i class="od-hop od-hop-dn">↓</i>'
          +'<span class="bd-nm"><b>'+_odEsc(c.base)+'</b>'+(sub?'<span>'+_odEsc(sub)+'</span>':'')+'</span>'
          +'<span class="od-sp"></span>'
          +(n?('<span class="bd-st">'+n+' sub'+(n===1?'':'s')+'</span>'):'')
          +'</button>';
      }).join('');
  }else{
    h+='<div class="od-sec od-sec-down">Subordinate sites</div>'
      +'<div class="od-note">No subordinate sites on file.</div>';
  }
  return h;
}

// ---- Clear pill sync (shell: the selection owner wires + shows #stageClear) ----
function _odStageClearSync(on){
  const b=document.getElementById('stageClear');
  if(b) b.hidden=!on;
  const f=document.getElementById('stageFit');   // ⊡ Fit frames the family — only meaningful with a selection
  if(f) f.hidden=!on;
}

// ---- ONE delegate (PORT of the _odWired idiom ~L12480; guard name kept) --------
if(!window._odWired){
  window._odWired=true;
  document.addEventListener('click', function(e){
    if(!e.target || !e.target.closest) return;
    const x=e.target.closest('[data-odclose]');
    if(x){ selectSite(null); return; }
    if(e.target.closest('#stageClear')){ selectSite(null); return; }
    const t=e.target.closest('[data-odsel]');
    if(t){ selectSite(t.getAttribute('data-odsel')); return; }
  });
}

// ---- Boot (A-ORG-1 load+setTimeout idiom ~L23544; s3's once-guard shape) -------
let _odBooted=false;

function initDossier(){
  if(_odBooted) return;
  _odBooted=true;
  _odInjectCSS();
  // agree with any selection that already exists (harness boots, early selects)
  try{
    if(typeof GlobeState!=='undefined' && GlobeState && GlobeState.sel!=null) showDossier(GlobeState.sel);
  }catch(_){}
}

addEventListener('load', function(){ setTimeout(function(){ try{ initDossier(); }catch(_){} }, 0); });

// ---- CSS (deviation 9 — construction-phase injection; content classes ONLY:
//      #dossier's geometry — bottom card, scroll container — is the shell's) -----
function _odInjectCSS(){
  if(document.getElementById('s4DossierCSS')) return;  // the final-assembly no-op guard
  const st=document.createElement('style'); st.id='s4DossierCSS';
  st.textContent=
    /* header — od-head-slim ramp (~L2881/4576, arctic-voiced) */
    '.od-head{display:flex;align-items:center;gap:8px;min-width:0}'+
    '.od-name{min-width:0;word-break:break-word;color:var(--text,#e7edf2);'+
      'font:800 17px/1.25 var(--disp,system-ui,-apple-system,"Segoe UI",sans-serif);'+
      'letter-spacing:-.018em}'+
    '.bd-state{flex:none;padding:4px 9px;border-radius:var(--r-pill,999px);'+
      'color:var(--accent,#36b6ff);background:var(--accent-wash,rgba(54,182,255,.12));'+
      'font:800 10px/1 var(--mono,ui-monospace,Menlo,monospace);letter-spacing:.08em}'+
    '.od-sp{flex:1}'+
    '.od-ico{flex:none;position:relative;width:30px;height:30px;display:inline-flex;'+
      'align-items:center;justify-content:center;border:0;cursor:pointer;'+
      'border-radius:var(--r-pill,999px);background:var(--panel-2,#16243A);'+
      'color:var(--dim,#8b98a5);font:700 13px/1 var(--body,system-ui,sans-serif);'+
      'box-shadow:0 0 0 1px var(--line,rgba(148,170,180,.18))}'+
    /* 44px hit area (od-ico::after idiom ~L4580 — static pseudo on a non-scrolling button) */
    '.od-ico::after{content:"";position:absolute;left:50%;top:50%;width:44px;height:44px;'+
      'transform:translate(-50%,-50%)}'+
    '.od-ico-x{color:var(--danger,#ff6d5a)}'+
    '.od-ico:active{filter:brightness(1.25)}'+
    /* owning unit + expansion */
    '.od-unit{margin:8px 2px 0;color:var(--text,#e7edf2);'+
      'font:700 13.5px/1.35 var(--body,system-ui,sans-serif)}'+
    '.od-unit-full{margin:2px 2px 0;color:var(--dim,#8b98a5);'+
      'font:500 11.5px/1.45 var(--body,system-ui,sans-serif)}'+
    /* stats line (~L1229) */
    '.bd-stats{display:flex;flex-wrap:wrap;gap:6px 16px;margin:10px 2px 0;'+
      'color:var(--dim,#8b98a5);font:600 11px/1.4 var(--body,system-ui,sans-serif)}'+
    '.bd-stats .bd-hint{margin-left:auto;font-weight:500;font-style:italic;'+
      'color:var(--faint,#5C7690)}'+
    /* section headers (~L2213-2214) — voices match the arc families (deviation 8) */
    '.od-sec{display:flex;align-items:center;gap:8px;position:relative;'+
      'margin:16px 2px 8px;padding-bottom:3px;text-transform:uppercase;'+
      'color:var(--dim,#8b98a5);letter-spacing:.14em;'+
      'font:800 10.5px/1.3 var(--body,system-ui,sans-serif)}'+
    '.od-sec::after{content:"";position:absolute;left:0;bottom:0;width:44px;height:2px;'+
      'border-radius:2px;background:linear-gradient(90deg,currentColor,transparent);opacity:.6}'+
    '.od-sec b{font-weight:800}'+
    '.od-sec-up{color:var(--signal,#E2B24E)}'+
    '.od-sec-down{color:var(--accent,#36b6ff)}'+
    /* rows — crumbs UP (gold) and children DOWN (blue); 44px phone targets */
    '.od-crumb,.bd-tile{display:flex;align-items:center;gap:10px;width:100%;'+
      'min-height:44px;margin-top:6px;padding:10px 12px;border:0;cursor:pointer;'+
      'text-align:left;border-radius:var(--r-chip,11px);background:var(--panel,#101B2C);'+
      'box-shadow:0 0 0 1px var(--line,rgba(148,170,180,.18));color:var(--text,#e7edf2);'+
      'font:700 13px/1.3 var(--body,system-ui,sans-serif)}'+
    '.od-hop{flex:none;font-style:normal;color:var(--signal,#E2B24E);'+
      'font:800 12px/1 var(--mono,ui-monospace,Menlo,monospace)}'+
    '.od-hop-dn{color:var(--accent,#36b6ff)}'+
    '.bd-nm{display:flex;flex-direction:column;gap:2px;min-width:0}'+
    '.bd-nm b{font-weight:800;word-break:break-word}'+
    '.bd-nm span{color:var(--dim,#8b98a5);font:500 11px/1.35 var(--body,system-ui,sans-serif)}'+
    '.od-crumb-tag{flex:none;padding:4px 7px;border-radius:var(--r-pill,999px);'+
      'color:var(--signal,#E2B24E);background:var(--signal-wash,rgba(226,178,78,.14));'+
      'font:800 9px/1 var(--mono,ui-monospace,Menlo,monospace);letter-spacing:.1em}'+
    '.bd-st{flex:none;padding:4px 8px;border-radius:var(--r-pill,999px);white-space:nowrap;'+
      'color:var(--accent,#36b6ff);background:var(--accent-wash,rgba(54,182,255,.12));'+
      'font:700 10px/1 var(--mono,ui-monospace,Menlo,monospace)}'+
    '.od-crumb:active{background:var(--signal-wash,rgba(226,178,78,.14))}'+
    '.bd-tile:active{background:var(--accent-wash,rgba(54,182,255,.12))}'+
    '.od-note{margin:4px 2px;color:var(--faint,#5C7690);'+
      'font:500 12px/1.55 var(--body,system-ui,sans-serif)}'+
    /* desktop layer ONLY — hovers live here (phone-first is sacred) */
    '@media(min-width:1100px){'+
      '.od-crumb:hover{box-shadow:0 0 0 1.5px var(--signal,#E2B24E)}'+
      '.bd-tile:hover{box-shadow:0 0 0 1.5px var(--accent,#36b6ff)}'+
      '.od-ico:hover{color:var(--text,#e7edf2);box-shadow:0 0 0 1.5px var(--accent,#36b6ff)}'+
    '}';
  document.head.appendChild(st);
}
