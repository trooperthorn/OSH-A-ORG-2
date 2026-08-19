// ═══════════════════════════════════════════════════════════════════════════════
// s3-search.js — A-ORG-2 shell: THE ONE SEARCH (charter law: one selection model,
// one search). Index over sites (base + unit + st) at boot; #searchPill input
// filters as-you-type; #searchResults shows the top TWO results as large rows
// (MAP-FIRST grammar) + an honest count line; Enter/tap selects.
// (PORTED from A-ORG-1 index.html — the source is truth; names kept where ported.)
//
// Ported from A-ORG-1 (function/state names kept where the code came across):
//   sfsResults          (~L22779)  the stage-search results law: trim, <2 chars → no
//                                  results, TOP TWO ONLY (owner v18.4.0: "only allow
//                                  for 2 organizations to drop down based off what's
//                                  input"), prefix-beats-substring, shorter wins ties.
//   sfsRender           (~L22788)  dropdown rows via innerHTML of <button data-sfs>
//                                  rows with attribute/body escaping; the v21.5.1
//                                  zero-result state that never dead-ends silently.
//   _usRun ranking      (~L22141)  the v22.3.1 word-start scoring ladder: exact 100 ·
//                                  prefix 80 · word-start 60 (token regex
//                                  (^|[\s(\-\/]) + regex-escaped query) · expansion
//                                  word-start · bare substring floor; +8 whole-word
//                                  bonus; −min(10, len/12) shorter-name tiebreak.
//   Enter-selects       (~L22805)  Enter clicks a '#searchResults [data-sfs]' row.
//   Esc clears          (~L22772)  Esc with text: clear value + empty the dropdown
//                                  (and ONLY that — the event stops there).
//   tap-select cleanup  (~L22845)  after a row tap: i.value=''; i.blur(); render([]).
//   blur collapse       (~L23570)  blur + 150ms: an empty field folds its results.
//   esc / _escA         (~L14030/14129)  HTML body / attribute escaping (renamed
//                                  _srEsc/_srEscA here — see deviation 8).
//   boot idiom          (~L23544)  addEventListener('load', setTimeout(try{}catch))
//                                  + the __mdWired-style once-guard.
//   row grammar (CSS)   (~L5365 .sfs-dd, ~L1856 .us-row)  dropdown = flex column,
//                                  gap 6px; rows = borderless radius cards, bold
//                                  name + dim sub, hairline ring, accent ring on
//                                  hover/highlight. Colors → A-ORG-2 tokens.
//
// NEW (A-ORG-2 contracts, no direct A-ORG-1 counterpart):
//   buildSearchIndex()   boot index over SITES: {base, unit(+unitFull), st} folded
//                        once (m5's _siteIndex identity-cache idiom, so a SITES
//                        swap re-indexes lazily and boot order can't break it).
//   searchSelect(id)     THE select: GlobeState.sel = site id + dirty (m5 deviation
//                        6 lazy-follow picks up the arcs), flyToLatLon(site), then
//                        the showDossier(id) hook — all guarded typeof, order-safe.
//   initSearch()         shell boot hook: build index + inject the search CSS. Also
//                        self-arms on 'load' (once-guarded) so the search works
//                        even if the shell forgets to call it.
//   _srFold()            diacritic/case folding (NFD strip) — mission-mandated;
//                        A-ORG-1 never folded ("Chièvres" was unfindable as
//                        "chievres"; 276-site A-ORG-2 is international by charter).
//
// DEVIATIONS (everything changed vs. A-ORG-1, and why):
//   1. ONE search, not three. A-ORG-1 grew a stage pill (sfs*), a universal overlay
//      (_usRun/openUSearch) and a workspace filter; the sfs zero-result row escaped
//      into universal search. A-ORG-2's single-brain law collapses them: sfsResults
//      carries _usRun's ranking directly, and the zero-result state is a plain
//      "No matches" card (there is no second search to escape to).
//   2. sfsResults(q) searches SITES (flat array, parent pointer only) instead of
//      walking ARMY_DATA's tree, and returns {list, total, q} instead of an array
//      of names: the count line needs the TRUE match count, so the source's
//      40-hit walk cap is gone (276 sites, one O(n) pass — no cap needed).
//   3. Scoring ladder extended per mission: BASE-NAME HITS BEAT UNIT HITS. Base
//      keeps the source rungs (exact 100 · prefix 80 · word-start 60, +8 whole
//      word); unit rungs sit strictly below the lowest base rung (exact 50 ·
//      prefix 44 · word-start 38), unitFull word-start 30 (the source's fl rung),
//      st exact 26 / word-start 22 (st is a searchable field per mission — "NC"
//      must find North Carolina posts), bare substring floor 10. Length tiebreak
//      ported unchanged, on the base name.
//   4. Rows carry data-sfs="<site id>" (A-ORG-1 carried the org NAME because
//      selectOrgNode took names). A-ORG-2's selection model is GlobeState.sel =
//      site id (shell contract), and ids are machine-safe slugs.
//   5. Arrow-key highlight is NEW (mission): _sfsHi moves over the rows,
//      re-rendering classes only; Enter clicks the highlighted row where A-ORG-1
//      always clicked the first. With no arrows pressed _sfsHi is 0 — identical
//      behavior to the source.
//   6. searchSelect does NOT call _syncSelArcs: m5's lazy follow (_selSyncCheck,
//      its deviation 6) rebuilds arcs from GlobeState.sel on the next dirty frame.
//      Setting sel + globeMark() is the entire selection contract.
//   7. Input/keydown/click land as document-level DELEGATED listeners installed at
//      script eval (A-ORG-1's own pattern for sfsInput, ~L22802-22808) — they need
//      no DOM at install time, so concatenation order and shell build order can't
//      race them. The field is matched by 'input inside #searchPill' instead of
//      id==='sfsInput' (shell contract names the pill, not the input).
//   8. esc/_escA are renamed _srEsc/_srEscA: the canonical names are app-wide
//      utilities that belong to the shell core at concatenation; a second
//      top-level `function esc(` would collide. Bodies are the source's, verbatim.
//   9. CSS ships as a JS-injected <style id="s3SearchCSS"> — construction-phase
//      only. m-modules are canvas-side and own no CSS; this module builds DOM. At
//      final assembly the block moves verbatim into index.html's single <style>
//      (dead-lint expects one style block) and the injector no-ops via its
//      already-present guard. Tokens only; phone-first; the sole desktop tweak
//      sits inside @media(min-width:1100px); no position:fixed, no transforms
//      (the results stack can scroll — transform-free per the reliability
//      contract). Pill/dropdown GEOMETRY (where the search sits on the stage) is
//      the shell owner's; this block styles only what this module renders.
//  10. tenants are NOT indexed — mission scopes the index to base + unit + st
//      (unitFull rides along as the unit's expansion, exactly like _usRun's
//      n.full). Tenant search is a backlog item for the dossier owner.
//
// OWNERSHIP (concatenation law — no duplicate top-level declarations):
//   - DECLARED HERE: buildSearchIndex, sfsResults, sfsRender, searchSelect,
//     initSearch, _searchEntries, _srFold, _srEsc, _srEscA, _sfsField,
//     _isSearchField, _srInjectCSS, _srEntries, _srSrc, _sfsHi, _srBooted.
//   - USED, declared elsewhere (ALL guarded typeof at call time): GlobeState
//     (shell), SITES (shell data loader), siteById (m5), globeMark (m2),
//     flyToLatLon (m4), showDossier (dossier owner's hook — optional).
//
// CONTRACTS HONORED:
//   - Reads SITES / GlobeState at call time only — concatenation-order safe.
//   - Redraw law: selection marks GlobeState.dirty once per select (an event,
//     never per-frame); nothing here touches the render loop.
//   - No frameworks, no webfonts, sloppy-mode top-level function declarations.
//   - Brief tier tokens (--t1..--t4) untouched; no green near data.
// ═══════════════════════════════════════════════════════════════════════════════

// ---- Escaping (PORT of esc ~L14030 / _escA ~L14129 — renamed, deviation 8) -----
function _srEsc(s){ return String(s).replace(/[&<>]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c]; }); }
function _srEscA(v){ return String(v).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// ---- Diacritic/case fold (NEW — mission-mandated; deviation in header) ---------
function _srFold(s){
  s=String(s==null?'':s).toLowerCase();
  try{ s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,''); }catch(_){}
  return s;
}

// ---- The index: SITES folded once, rebuilt only when SITES identity changes ----
// (m5 _siteIndex idiom — boot builds it, a data swap re-indexes lazily.)
let _srEntries=null, _srSrc=null;

function _searchEntries(){
  const arr=(typeof SITES!=='undefined' && SITES && SITES.length!=null) ? SITES : [];
  if(_srSrc===arr && _srEntries) return _srEntries;
  _srEntries=[];
  for(const s of arr){
    if(!s || s.id==null) continue;
    const base=String(s.base||s.id), unit=String(s.unit||''), full=String(s.unitFull||''), st=String(s.st||'');
    _srEntries.push({
      id:s.id, base:base,
      sub:(unit?unit:'')+((unit&&st)?' · ':'')+st,          // "III Armored Corps · TX"
      baseF:_srFold(base), unitF:_srFold(unit), fullF:_srFold(full), stF:_srFold(st),
      allF:_srFold(base+' '+unit+' '+full+' '+st)
    });
  }
  _srSrc=arr;
  return _srEntries;
}

function buildSearchIndex(){ _srSrc=null; return _searchEntries(); }

// ---- Results (PORT of sfsResults + _usRun's v22.3.1 ranking; deviations 2-3) ---
// Returns {list:[entry,entry], total:N, q:foldedQuery}. list is the TOP TWO.
function sfsResults(q){
  q=_srFold((q||'').trim());
  if(q.length<2) return {list:[], total:0, q:q};
  // v22.3.1 ranking (ported): rank word-starts above mid-word noise — 'bragg'
  // finds Fort Bragg before anything that merely CONTAINS the letters; base-name
  // matches beat unit matches; shorter names win ties.
  const tk=new RegExp('(^|[\\s(\\-\\/])'+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  const hits=[];
  for(const e of _searchEntries()){
    let s2=0;
    if(e.baseF===q) s2=100;
    else if(e.baseF.indexOf(q)===0) s2=80;
    else if(tk.test(e.baseF)) s2=60;
    else if(e.unitF && e.unitF===q) s2=50;
    else if(e.unitF && e.unitF.indexOf(q)===0) s2=44;
    else if(e.unitF && tk.test(e.unitF)) s2=38;
    else if(e.fullF && tk.test(e.fullF)) s2=30;
    else if(e.stF && e.stF===q) s2=26;
    else if(e.stF && tk.test(e.stF)) s2=22;
    else if(e.allF.indexOf(q)>=0) s2=10;
    if(!s2) continue;
    if(e.baseF.split(/[\s()\-\/,]+/).indexOf(q)>=0) s2+=8;   // whole-word bonus (ported)
    hits.push({e:e, _s:s2 - Math.min(10, e.baseF.length/12)});
  }
  hits.sort(function(a,b){
    return (b._s-a._s) || (a.e.baseF.length-b.e.baseF.length) || (a.e.baseF<b.e.baseF?-1:1);
  });
  return {list:hits.slice(0,2).map(function(h){ return h.e; }), total:hits.length, q:q};
}

// ---- Render (PORT of sfsRender — rows via innerHTML <button data-sfs>) ---------
// res = {list,total,q} from sfsResults, or null/'' query → dropdown folds shut.
let _sfsHi=0;   // keyboard highlight over the (at most two) rows — deviation 5

function sfsRender(res){
  const dd=document.getElementById('searchResults'); if(!dd) return;
  _sfsHi=0;
  if(!res || !res.q || res.q.length<2){ dd.innerHTML=''; return; }
  // v21.5.1 flow law (ported): zero results never dead-end SILENTLY. There is no
  // second search to escape to (deviation 1) — say so, plainly.
  if(!res.list.length){
    dd.innerHTML='<div class="sr-none">No matches for “'+_srEsc(res.q)+'”.</div>';
    return;
  }
  const count = res.total===1 ? '1 site'
    : res.total<=2 ? res.total+' sites'
    : res.total+' sites — top 2 shown';
  dd.innerHTML=res.list.map(function(e,i){
    return '<button type="button" class="sr-row'+(i===_sfsHi?' hi':'')+'" role="option"'
      +' aria-selected="'+(i===_sfsHi?'true':'false')+'" data-sfs="'+_srEscA(e.id)+'">'
      +'<b>'+_srEsc(e.base)+'</b><span class="sr-sub">'+_srEsc(e.sub)+'</span></button>';
  }).join('')+'<div class="sr-count">'+_srEsc(count)+'</div>';
}

// ---- THE select (mission contract; deviation 6 — m5 lazy-follows sel) ----------
function searchSelect(id){
  const s=(typeof siteById==='function') ? siteById(id) : null;
  if(!s) return;
  GlobeState.sel=s.id;
  if(typeof globeMark==='function') globeMark(); else GlobeState.dirty=true;
  if(typeof flyToLatLon==='function' && s.lat!=null && s.lon!=null){
    // the base-dossier fly (~L15089): never zoom OUT to meet a selection
    try{ flyToLatLon(s.lat, s.lon, Math.max(GlobeState.zoom||1, 2.6)); }catch(_){}
  }
  try{ if(typeof showDossier==='function') showDossier(s.id); }catch(_){}
}

// ---- Field lookup (shell contract names the PILL; the input lives inside) ------
function _sfsField(){
  const p=document.getElementById('searchPill'); if(!p) return null;
  return (p.tagName==='INPUT') ? p : p.querySelector('input');
}
function _isSearchField(t){
  return !!(t && t.tagName==='INPUT' && t.closest && t.closest('#searchPill'));
}

// ---- Delegated wiring (A-ORG-1's document-level pattern, ~L22802 — deviation 7) -
document.addEventListener('input', function(e){
  if(e.target && _isSearchField(e.target)) sfsRender(sfsResults(e.target.value));
});

document.addEventListener('keydown', function(e){
  const t=e.target;
  if(!t || !_isSearchField(t)) return;
  if(e.key==='Enter'){                                   // ported (~L22805): Enter = pick
    const rows=document.querySelectorAll('#searchResults [data-sfs]');
    const b=rows[_sfsHi]||rows[0]; if(b) b.click();
    e.preventDefault(); return;
  }
  if(e.key==='ArrowDown' || e.key==='ArrowUp'){          // deviation 5: move the highlight
    const rows=document.querySelectorAll('#searchResults [data-sfs]');
    if(!rows.length) return;
    _sfsHi=Math.max(0, Math.min(rows.length-1, _sfsHi+(e.key==='ArrowDown'?1:-1)));
    for(let i=0;i<rows.length;i++){
      rows[i].classList.toggle('hi', i===_sfsHi);
      rows[i].setAttribute('aria-selected', i===_sfsHi?'true':'false');
    }
    e.preventDefault(); return;
  }
  if(e.key==='Escape'){                                  // ported (~L22772): Esc clears
    if(t.value){ t.value=''; sfsRender(null); }
    else{ try{ t.blur(); }catch(_){} }
    return;
  }
});

document.addEventListener('click', function(e){
  if(!e.target.closest) return;
  const sb=e.target.closest('#searchResults [data-sfs]');
  if(sb){                                                // ported (~L22845): tap = pick
    searchSelect(sb.getAttribute('data-sfs'));
    const i=_sfsField(); if(i){ i.value=''; try{ i.blur(); }catch(_){} }
    sfsRender(null);
    return;
  }
});

// ---- Boot (A-ORG-1 load+setTimeout idiom ~L23544; __mdWired-style once-guard) --
let _srBooted=false;

function initSearch(){
  if(_srBooted) return;
  _srBooted=true;
  buildSearchIndex();
  _srInjectCSS();
  const dd=document.getElementById('searchResults');
  if(dd){ dd.setAttribute('role','listbox'); dd.setAttribute('aria-label','Search results'); }
  const i=_sfsField();
  if(i && !i.__srWired){
    i.__srWired=1;
    // blur collapse (ported ~L23570): an emptied field folds its results after 150ms
    // (the delay lets a row tap land before the dropdown disappears under it).
    i.addEventListener('blur', function(){
      setTimeout(function(){ if(!(i.value||'').trim()) sfsRender(null); }, 150);
    });
  }
}

addEventListener('load', function(){ setTimeout(function(){ try{ initSearch(); }catch(_){} }, 0); });

// ---- CSS (deviation 9 — construction-phase injection; tokens only; phone-first;
//      row grammar ported from .sfs-dd ~L5365 + .us-row ~L1856) -------------------
function _srInjectCSS(){
  if(document.getElementById('s3SearchCSS')) return;     // the final-assembly no-op guard
  // (M1 verify: the construction-phase injected CSS was removed — s1-tokens.css
  //  owns the #searchResults/.sr-row recipe; dual ownership was fighting it.)
}
