// Execute the shipped search module: live records, exact destinations, saved
// content, and keyboard access all use the same result list and click path.
const fs=require('fs'), path=require('path'), vm=require('vm'), assert=require('assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const start=html.indexOf('/* ══════════ module: s3-search ══════════ */');
const end=html.indexOf('/* ══════════ module: s4-dossier ══════════ */',start);
assert(start>=0 && end>start,'shipped search module boundaries');
const handlers={}, calls=[], records={}, writes={brief:0,view:0};
function classes(){ const values=new Set(); return {
  add:k=>values.add(k), contains:k=>values.has(k),
  toggle(k,on){ on?values.add(k):values.delete(k); }
}; }
const field={tagName:'INPUT',id:'searchInput',value:'',closest:s=>s==='#searchPill'?pill:null,
  blur(){ calls.push(['blur']); },addEventListener(){}};
const pill={classList:classes(),querySelector:()=>field};
const results={innerHTML:'',classList:classes(),setAttribute(){}};
let rows=[];
const document={body:{classList:classes()},activeElement:field,
  getElementById:id=>id==='searchPill'?pill:id==='searchResults'?results:null,
  addEventListener(type,fn){ (handlers[type]||(handlers[type]=[])).push(fn); },
  querySelectorAll:()=>rows};
const ctx={console,document,setTimeout(){},addEventListener(){},innerHeight:800,
  SITES:[{id:'bragg',base:'Fort Bragg',st:'NC'},{id:'liberty',base:'Camp Liberty',st:'TX'}],
  A1ORGS:[{id:'signals',name:'Fort Bragg Signal Brigade'}],US_STATES:[],
  ogPrimary:()=>({name:'Signal Brigade'}),ogEffSite:()=> 'bragg',
  bfStateName:()=>null,_lyEnsure:id=>calls.push(['layers',id]),
  selectSite:id=>calls.push(['site',id]),GlobeState:{zoom:1},
  RecordUI:{open:(...args)=>calls.push(['record',...args])},
  Records:{all:()=>records},SAVEDV:[],SAVEDB:[],_sbLoadArm:-1,
  _shScope:()=> 'Bases · labels on',_shOpen:tab=>calls.push(['shelf',tab]),
  svRecall:i=>calls.push(['view',ctx.SAVEDV[i].n]),
  sbLoad(){ throw new Error('Search must never replace the working brief'); },
  _sbSave(){ writes.brief++; },
  _svSave(){ writes.view++; },
  _bfToast:message=>calls.push(['toast',message])};
ctx.siteById=id=>ctx.SITES.find(s=>s.id===id)||null;
ctx.window=ctx;
vm.createContext(ctx); vm.runInContext(html.slice(start,end),ctx,{filename:'s3-search'});
vm.runInContext(html.slice(html.indexOf('function _shId('),html.indexOf('// a pin is a real guarantee')),ctx,{filename:'saved-identities'});
const search=q=>ctx.sfsResults(q);
function paint(q){
  const found=search(q); field.value=q; ctx.sfsRender(found);
  rows=found.list.map(entry=>({classList:classes(),setAttribute(){},
    click(){ const row={getAttribute:()=>entry.id};
      (handlers.click||[]).forEach(fn=>fn({target:{closest:s=>s==='#searchResults [data-sfs]'?row:null}})); }
  }));
  return found;
}
function key(value){ let prevented=false;
  (handlers.keydown||[]).forEach(fn=>fn({target:field,key:value,preventDefault(){prevented=true;}}));
  assert(prevented,'keyboard action consumed');
}

assert.equal(ctx._searchEntries().length,3,'static index remains usable by Brief picker');
assert.equal(search('bragg').list[0].id,'bragg','base outranks longer org name');
assert.equal(search('x').list.length,0,'two-character search floor');
records.bragg={ids:['OPP-42'],idMeta:{'OPP-42':{title:'Orion renewal'}},
  people:[{rid:'person-1',xid:'OPP-42',name:'Zoë Case',role:'Network engineer',
    email:'zoe@example.mil',phone:'+1 555 0100',org:'NETCOM',section:'G6'}],
  notes:[{rid:'note-1',xid:'OPP-42',text:'Opening context\n'+'.'.repeat(160)+' Check renewal deadline'}],
  links:[{rid:'link-1',label:'Evaluation guide',url:'https://example.mil/guide'}],
  specs:[{rid:'spec-1',label:'Router model',value:'MX-960'}]};
const expected=[['OPP-42','id'],['orion renewal','id'],['zoe','contact'],['network engineer','contact'],
  ['zoe@example.mil','contact'],['netcom','contact'],['555 0100','contact'],['g6','contact'],
  ['renewal deadline','note'],['evaluation guide','link'],['example.mil/guide','link'],['mx-960','detail']];
for(const [query,kind] of expected) assert.equal(search(query).list[0]?.kind,kind,query+' retrieves its record kind');
assert.equal(ctx._searchEntries().length,3,'records never enter the Brief subject index');
ctx.SAVEDV.push({id:'view-1',n:'Deployment view'});
assert.equal(paint('Deployment view').list[0].kind,'view','saved-only query is not a false no-match');
key('Enter');
assert(calls.some(call=>call[0]==='view'&&call[1]==='Deployment view'),'Enter recalls saved view');
assert.equal(results.innerHTML,'','selection folds search');

ctx.SAVEDB.push({id:'brief-1',n:'Renewal briefing',nodes:[{k:'kept-node'}]});
const before=JSON.stringify(ctx.SAVEDB);
paint('Renewal briefing'); key('Enter');
assert(calls.some(call=>call[0]==='shelf'&&call[1]==='bf'),'brief opens canonical replacement confirmation');
assert.equal(ctx._sbLoadArm,'brief-1','correct saved brief ID armed for explicit second tap');
assert.equal(JSON.stringify(ctx.SAVEDB),before,'search never changes the saved diagram');

ctx.SAVEDV.push({n:'Legacy camera'});
paint('Legacy camera'); ctx.SAVEDV.unshift({id:'newer',n:'Other camera'}); key('Enter');
assert.deepEqual(calls.at(-2),['view','Legacy camera'],'legacy result follows object through reordering');
assert.equal(ctx.SAVEDV.find(v=>v.n==='Legacy camera').id,undefined,'search does not mint IDs for legacy views');
paint('Renewal briefing'); ctx.SAVEDB.unshift({id:'new-brief',n:'Another brief',nodes:[]}); key('Enter');
assert.equal(ctx._sbLoadArm,'brief-1','confirmation remains tied to the saved ID after reordering');
paint('Renewal briefing'); ctx.SAVEDB=ctx.SAVEDB.filter(b=>b.id!=='brief-1'); key('Enter');
assert(calls.at(-2)?.[0]==='toast','removed saved result reports that it changed');

document.body.classList.add('brief-mode');
paint('zoe@example.mil'); key('Enter');
assert.deepEqual(calls.at(-2),['record','bragg','person-1','OPP-42'],'contact opens canonical exact item even from Brief');
paint('OPP-42'); key('Enter');
assert.deepEqual(calls.at(-2),['record','bragg',null,'OPP-42'],'ID result opens the same filing context');
const recordBefore=JSON.stringify(records);
paint('Network engineer');
records.bragg.people[0].role='Program manager'; ctx._srRefresh();
assert(results.innerHTML.includes('No matches'),'record update refreshes an open query without an index rebuild');
assert.equal(search('program manager').list[0].kind,'contact');
records.bragg.people=[];
assert.equal(search('zoe@example.mil').total,0,'deleted record disappears from the next query');
assert.notEqual(JSON.stringify(records),recordBefore,'fixture changed to exercise freshness');

records.bragg.notes.push({rid:'unsafe-note',text:'<script>alert("x")</script> & review'});
paint('alert(');
assert(!results.innerHTML.includes('<script>'),'record content cannot inject markup');
assert(results.innerHTML.includes('&lt;script&gt;'),'record content is escaped');
assert.equal(search('[?').total,0,'query regex syntax remains literal');
paint('guide'); const first=search('guide').list[0];
assert(first && results.innerHTML.includes('LINK'),'record kinds are printed');
assert(results.innerHTML.includes('Fort Bragg')&&results.innerHTML.includes('Unfiled'),'installation and filing context are printed');
ctx.SAVEDV.push({id:'review-view',n:'Review view'});
assert.equal(paint('review').list.length,2);
key('ArrowDown'); key('Enter');
assert.deepEqual(calls.at(-2),['record','bragg','unsafe-note',null],'arrows and Enter reach record rows after saved rows');
ctx.SAVEDB.push({n:'Legacy brief',nodes:[]});
paint('Legacy brief');
assert.deepEqual(writes,{brief:0,view:0},'rendering and ordinary selection never save or mint IDs');
key('Enter');
assert.equal(writes.brief,1,'explicit legacy brief opening uses existing identity migration');
assert.equal(ctx._sbLoadArm,ctx.SAVEDB.at(-1).id,'legacy brief confirms by its new stable ID');

// Execute the actual shelf confirmation handler as well as its row renderer.
// A board update between taps must never load or delete a different document.
ctx._odEsc=s=>String(s); ctx._shRnId=null; ctx._shRmArm=null;
ctx._shGlyph=()=>''; ctx.hideDossier=()=>{};
ctx._shVal=(button,attribute)=>button.getAttribute(attribute);
ctx.sbLoad=i=>{calls.push(['load',ctx.SAVEDB[i].id]);return true;};
ctx.sbRemove=i=>{calls.push(['remove',ctx.SAVEDB[i].id]);ctx.SAVEDB.splice(i,1);};
const rowStart=html.indexOf('function _shRow('), rowEnd=html.indexOf('function _shPaneShelf(',rowStart);
vm.runInContext(html.slice(rowStart,rowEnd),ctx,{filename:'saved-row'});
const loadStart=html.indexOf('    // ---- BRIEFS: the LOAD arm is KEPT'), loadEnd=html.indexOf('    const bsx2=',loadStart);
assert(loadStart>0 && loadEnd>loadStart,'shipped Brief shelf handler boundary');
vm.runInContext('function _testShelf(e){'+html.slice(loadStart,loadEnd)+'}',ctx,{filename:'saved-confirmation'});
function shelf(action,id){ ctx._testShelf({target:{closest:selector=>selector==='[data-sb'+action+']'
  ?{getAttribute:()=>id}:null}}); }
ctx.SAVEDB=[{id:'alpha',n:'Alpha',nodes:[]},{id:'beta',n:'Beta',nodes:[]}];
ctx._sbLoadArm=-1;
shelf('load','alpha');
const row=ctx._shRow('bf',ctx.SAVEDB[0],'sb',0);
assert(row.includes('data-sbload="alpha"')&&row.includes('data-sbrm="alpha"'),'load and delete controls carry stable IDs');
assert(row.includes('replace current?'),'armed replacement is visible');
ctx.SAVEDB.reverse(); shelf('load','alpha');
assert(calls.some(call=>call[0]==='load'&&call[1]==='alpha'),'load follows intended brief through a shelf reorder');
shelf('load','alpha'); ctx.SAVEDB=ctx.SAVEDB.filter(b=>b.id!=='alpha');
const loadCount=calls.filter(call=>call[0]==='load').length;
shelf('load','alpha');
assert.equal(calls.filter(call=>call[0]==='load').length,loadCount,'removed confirmation target cannot load replacement slot');
ctx.SAVEDB.push({id:'gamma',n:'Gamma',nodes:[]}); shelf('rm','beta');
ctx.SAVEDB.reverse(); shelf('rm','beta');
assert.equal(ctx.SAVEDB.length,1); assert.equal(ctx.SAVEDB[0].id,'gamma','delete follows stable ID through reorder');
ctx.SAVEDB.push({id:'retained',n:'Retained',nodes:[]});
assert.equal(ctx._shFind('bf','1abc'),-1,'missing numeric-looking ID never becomes a positional lookup');
assert.equal(ctx._shFind('bf','1'),-1,'missing numeric ID never substitutes another identified record');

// The Repository is lazy: exercise the actual shelf-opening door from a first
// search pick before any ledger element exists, not the earlier shelf spy.
let ledger=null, repoOpens=0;
const getElementById=document.getElementById;
document.getElementById=id=>id==='ledger'?ledger:getElementById(id);
ctx._ldTab='views'; ctx._ledgerPaint=()=>{};
ctx.Repo={open(){ repoOpens++; if(!ledger) ledger={classList:classes()}; ledger.classList.add('on'); }};
const openStart=html.indexOf('function _shOpen('), openEnd=html.indexOf('function _svOpenSheet(',openStart);
assert(openStart>0 && openEnd>openStart,'shipped shelf-opening function boundary');
vm.runInContext(html.slice(openStart,openEnd),ctx,{filename:'saved-shelf-open'});
ctx.SAVEDB=[{id:'cold-start-brief',n:'Cold start briefing',nodes:[]}];
ctx._sbLoadArm=-1;
assert.equal(document.getElementById('ledger'),null,'Repository has not been created before first search pick');
paint('Cold start briefing'); key('Enter');
assert(ledger?.classList.contains('on'),'first saved brief search creates and opens the Repository');
assert.equal(ctx._ldTab,'briefs','first search opens the Briefs section');
assert.equal(ctx._sbLoadArm,'cold-start-brief','first search keeps the intended stable confirmation ID');
ledger.classList.toggle('on',false);
paint('Cold start briefing'); key('Enter');
assert(ledger.classList.contains('on'),'a later search reopens the closed Repository');
assert.equal(repoOpens,2,'both first-use and closed-shelf paths invoke the canonical open door');
console.log('UX SEARCH PASS — live fields, exact destinations, saved recall, keyboard access, stable confirmations, first-use Repository, freshness and escaping');
