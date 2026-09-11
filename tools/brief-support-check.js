#!/usr/bin/env node
'use strict';
// Execute shipped picker/search/add/sheet code. Fixtures isolate UI state; the
// preset roster and installation coordinates are read from the actual app/data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {sourceFunction}=require('./ux-persistence-check.js');
const root=path.join(__dirname,'..'), html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sites=JSON.parse(fs.readFileSync(path.join(root,'data/sites.json'))).sites;
const roster=html.slice(html.indexOf('const BF_PLACES=['),html.indexOf('function bfPlaceOf('));
const classes=new Set(['brief-mode']),calls=[],orgs=[{id:'parent',name:'Parent command'},{id:'child',name:'Child signal unit'}];
const host={innerHTML:'',hidden:true,className:'',scrollTop:0,style:{setProperty(){}},
  setAttribute(){},querySelector(){return null;},classList:{add(){},remove(){},toggle(){}}};
const ctx={console,Set,Map,BRIEF:{nodes:[]},GlobeState:{zoom:1},_sfsShown:[],_bfRnEdit:null,_bfAnnEdit:null,
  _odShowRec:false,_odTab:'overview',_rcForm:null,
  _OG_CATS:{},US_STATES:[{n:'Texas',lat:31,lon:-99}],_srEntries:null,_srSrc:null,
  document:{body:{classList:{contains:k=>classes.has(k)}},getElementById:id=>id==='dossier'?host:null},
  SITES:sites,A1ORGS:orgs,ogPrimary:()=>null,ogEffSite:()=> 'fort-bragg',ogKids:id=>id==='parent'?[orgs[1]]:[],
  orgOf:id=>orgs.find(o=>o.id===id)||null,orgById:()=>null,
  siteById:id=>sites.find(s=>s.id===id)||null,
  bfNode:id=>ctx.BRIEF.nodes.find(n=>n.k===id)||null,
  bfStateName:id=>id==='st:Texas'?'Texas':null,_bfStateKey:n=>'st:'+n,
  _srUserEntries:()=>[],_bfSave:()=>calls.push('save'),renderBrief:()=>calls.push('render'),
  globeMark:()=>calls.push('globe'),_bfFrame:()=>calls.push('frame'),_xpPulse:()=>{},
  _odInjectCSS(){},calloutHide(){},_sheetFlag(){},_bfAbbr:s=>s,
  _bfToast:message=>calls.push(['toast',message]),_bfObjSheet:id=>calls.push(['sheet',id]),
  _bfExplore:id=>{ctx.GlobeState._bfFocus=id;calls.push(['explore',id]);},
  _bfArmHint(){},_bfAddUnderBtn:()=>'',_bfSelections:()=>'',_bfInvHTML:()=>'<p>Assets</p>',
  _disc:(id,title,body)=>'<details><summary>'+title+'</summary>'+body+'</details>'};
ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(roster+'\nthis.roster=BF_PLACES;',ctx);
const funcs=['_srFold','_searchEntries','_srBriefEntries','sfsResults','searchSelect','bfPlaceOf','bfAddMany',
  '_bfPickCandidates','_bfAddSheet','_bfTakeParent','_bfNodeLbl','_odEsc','_odEscA','_bfPlainSheet','_rcFit'];
vm.runInContext(funcs.map(n=>sourceFunction(html,n)).join('\n'),ctx);
assert.equal(ctx.roster.length,12,'existing 12 presets are preserved');
assert.equal(ctx._bfPickCandidates(null,'','rsn').rows.length,10,'all ten RSNs are reachable from an empty brief');
assert.equal(ctx._bfPickCandidates(null,'','eccsp').rows.length,2,'both ECCSPs are reachable from an empty brief');
assert.equal(ctx._bfPickCandidates(null,'JBLM','').rows.filter(x=>x.id.startsWith('px:')).length,2,'same-anchor RSN and ECCSP remain distinct');
ctx._bfAddSheet(null);
assert(host.innerHTML.includes('RSN locations')&&host.innerHTML.includes('ECCSP locations'),'explicit category doors render at the root');
assert(host.innerHTML.includes('data-bfpickadd=""'),'root add has a valid empty parent key');
assert(host.innerHTML.includes('bf-picksticky'),'batch commit stays in the existing sticky footer');
ctx._bfPick.add('px:jblm-eccsp');ctx._bfPickQ='California';ctx._bfPickKind='rsn';ctx._bfAddSheet(null);
assert.equal(ctx._bfPick.size,1,'changing filters does not drop off-screen selections');
assert(host.innerHTML.includes('Add 1 to the brief'),'commit counts all selected objects');
assert(!host.innerHTML.includes('data-bfpick="px:jblm-eccsp"'),'filter does hide unrelated rows');
ctx.BRIEF.nodes.push({k:'parent',r:'parent',n:'Parent command',t:'org'});ctx._bfAddSheet('parent');
assert.equal(ctx._bfPick.size,0,'changing parent context clears pending selections');
assert.equal(ctx._bfPickCandidates('parent','','')["rows"][0].id,'child','real subordinates appear first');
ctx.GlobeState._bfFocus='other-branch';ctx.GlobeState._bfManualDepth=true;ctx.GlobeState._bfZoom=2;
assert.equal(ctx.bfAddMany(['px:jblm-rsn','px:jblm-eccsp'],'parent'),2,'batch adds both sibling support locations');
assert.equal(calls.filter(x=>x==='save').length,1,'multi-add saves once');
assert.equal(ctx.GlobeState._bfFocus,'parent','new child batch reveals its destination branch');
assert.equal(ctx.GlobeState._bfManualDepth,false,'new child batch restores automatic detail');
assert.equal(ctx.GlobeState._bfZoom,1,'new child batch uses readable scale');
const anchor=ctx.siteById('jblm');
for(const id of ['px:jblm-rsn','px:jblm-eccsp']){
  const node=ctx.bfNode(id);assert.equal(node.p,'parent');assert.equal(node.la,anchor.lat);assert.equal(node.lo,anchor.lon);
}
ctx.GlobeState._bfFocus='unchanged';ctx.GlobeState._bfZoom=2;ctx.GlobeState._bfManualDepth=true;
assert.equal(ctx.bfAddMany(['px:jblm-rsn'],'parent'),0,'repeated additions are idempotent');
assert.equal(ctx.GlobeState._bfFocus,'unchanged','no-op add keeps current view');
assert.equal(ctx.GlobeState._bfZoom,2);assert.equal(ctx.GlobeState._bfManualDepth,true);
assert.equal(ctx.bfAddMany(['px:utah-rsn'],null),1,'root add succeeds from a focused branch');
assert.equal(ctx.GlobeState._bfFocus,null,'root add opens Overview so its result is visible');
assert.equal(ctx._bfPickCandidates(null,'','eccsp').rows.length,1,'placed objects leave the picker');
assert.equal(ctx.bfAddMany(['px:california-rsn'],'deleted-parent'),0,'a stale parent cannot produce an orphan');
assert.equal(ctx.sfsResults('ECCSP').total,2,'Brief search finds both support types');
ctx.searchSelect('px:jblm-eccsp');assert.deepEqual(calls.at(-1),['sheet','px:jblm-eccsp'],'existing search result opens its own information');
assert.deepEqual(calls.at(-2),['explore','px:jblm-eccsp'],'existing search result reveals its branch before details');
ctx.GlobeState._bfAddUnder='parent';ctx.searchSelect('px:fort-bragg-eccsp');
assert.equal(ctx.bfNode('px:fort-bragg-eccsp').p,'parent','search honors the explicit armed parent');
assert.equal(ctx.GlobeState._bfFocus,'px:fort-bragg-eccsp','new preset search reveals the exact added object');
assert.deepEqual(calls.at(-1),['sheet','px:fort-bragg-eccsp'],'new preset search opens its location details');
assert.equal(ctx.GlobeState._bfAddUnder,null,'armed parent is consumed once');
const before=JSON.stringify(ctx.BRIEF);classes.delete('brief-mode');
assert.equal(ctx.sfsResults('ECCSP').total,0,'preset results disappear immediately in Map');
ctx.searchSelect('px:california-rsn');assert.equal(JSON.stringify(ctx.BRIEF),before,'stale Brief result cannot write from Map');
assert(!ctx._searchEntries().some(e=>e.id.startsWith('px:')),'Map index stays free of support presets');
classes.add('brief-mode');ctx._bfPlainSheet('px:jblm-eccsp');
assert(host.innerHTML.includes('ECCSP')&&host.innerHTML.includes(anchor.base),'node sheet identifies type and saved anchor');
assert(host.innerHTML.includes('Pinned position:')&&host.innerHTML.includes('<details>'),'full location details are available on demand');
ctx.bfNode('px:jblm-eccsp').bs='<img src=x>';ctx._bfPlainSheet('px:jblm-eccsp');
assert(!host.innerHTML.includes('<img'),'imported anchor text cannot inject markup');
let keyboard;host.classList.toggle=(name,on)=>{if(name==='rc-keyboard')keyboard=on;};
const insets={};host.style.setProperty=(name,value)=>{insets[name]=value;};
ctx.visualViewport={height:420,offsetTop:10};ctx.innerHeight=844;host.hidden=false;
host.querySelector=selector=>selector.includes('#bfPickQ')?{}:null;ctx._rcFit();
assert.equal(keyboard,true,'Brief form participates in the existing keyboard-aware sheet');
assert.equal(insets['--rc-visible-bottom'],'422px','footer is lifted above the iOS keyboard');
classes.delete('brief-mode');ctx._rcFit();assert.equal(keyboard,false,'Brief keyboard treatment does not leak into Map');
console.log('BRIEF SUPPORT PASS — root access, categories, multiselect, anchored batch adds, room-safe search, details and keyboard viewport');
