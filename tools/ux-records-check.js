// Focused behavior probes against the shipped record functions (no browser substitute).
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const span=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const elements={},events={};
const decode=s=>String(s||'').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const el=()=>({value:'',checked:false,hidden:false,scrollTop:0,style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},scrollIntoView(){},focus(){}});
elements.dossier=el();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const c={URL,Date,Math,JSON,Number,String,Object,Array,crypto:require('crypto').webcrypto,console,
  GlobeState:{sel:'test-site'},navigator:{clipboard:{writeText:()=>Promise.resolve()}},
  document:{getElementById:id=>elements[id]||null,addEventListener:(t,fn)=>(events[t]||(events[t]=[])).push(fn)},
  siteById:id=>id==='test-site'||id==='other-site'?{id,base:id}:null,orgOf:()=>null,orgById:()=>null,ogAtSite:()=>[],
  _odEsc:esc,_odEscA:esc,_lgSiteName:id=>id,_ledgerClose(){},_ledgerPaint(){},_srRefresh(){},_bfToast(){},dbPush(){},
  _odShowRec:true,_odTab:'records',mode:'map',brief:{nodes:[{id:'unchanged'}]},
  setMode:m=>c.mode=m,selectSite:id=>c.GlobeState.sel=id,
  _xpDownload:(name,type,data)=>c.backup=JSON.parse(data),_xpStamp:()=>'',
  showDossier(){const rendered=vm.runInContext('_rcRender(GlobeState.sel)',c);c.rendered=rendered;
    Object.keys(elements).filter(k=>k.startsWith('rcF')).forEach(k=>delete elements[k]);
    for(const m of rendered.matchAll(/<(input|select|textarea)\b([^>]*?)\bid="([^"]+)"([^>]*)>([\s\S]*?)(?=<\/(?:select|textarea)>|<label|<input|<div|$)/g)){
      const x=el(),attrs=m[2]+m[4];x.value=decode((attrs.match(/value="([^"]*)"/)||[])[1]);x.checked=/\bchecked\b/.test(attrs);
      if(m[1]==='textarea')x.value=decode(m[5]);
      if(m[1]==='select'){const opts=[...m[5].matchAll(/<option value="([^"]*)"([^>]*)>/g)];const chosen=opts.find(o=>/selected/.test(o[2]))||opts[0];x.value=decode(chosen&&chosen[1]);}
      elements[m[3]]=x;
    }
  }
};c.window=c;vm.createContext(c);
vm.runInContext(span('function _odEsc(s){','// ---- THE SINGLE BRAIN')+"let _rcForm=null;"+span('const RC_KINDS={','function _odSetTab')+span('// One record workspace,','// ---- (v0.3.0) the clear/fit pills')+span('let RECORDS=Object.create(null);','function _rdbOpen(){')+span('function recBackup(){','/* v2.9.0 — THE DATABASE DOOR'),c);
const run=src=>vm.runInContext(src,c);
assert.equal(c._odEscA('A&amp;B'),'A&amp;amp;B');
const input=(id,value)=>{assert(elements[id],id+' exists');elements[id].value=value;};
const start=kind=>{run('_rcStart('+JSON.stringify(kind)+');_rcRefresh();');};
const field=(key,value)=>{run('_rcForm.item['+JSON.stringify(key)+']='+JSON.stringify(value));};
const before={v:1,id:'test-site',mod:1234,people:[{name:'Legacy',role:'G6',custom:'preserve'}],notes:[{text:'Older note',ts:12}]};
c.legacy=before;
run('Records.restore({records:{"test-site":legacy}})');
const r=run('Records.of("test-site")');assert.equal(r.v,1);assert(Array.isArray(r.specs)&&Array.isArray(r.links));
assert(r.people[0].rid);assert.equal(r.people[0].created,1234);assert(!r.people[0].orgId);
const stable=r.people[0].rid;
const reordered=JSON.parse(JSON.stringify(before));reordered.people[0]={custom:'preserve',role:'G6',name:'Legacy'};c.reordered=reordered;run('Records.restore({records:{"test-site":reordered}})');assert.equal(run('Records.of("test-site").people[0].rid'),stable);
run('Records.restore({records:{"test-site":legacy}})');assert.equal(run('Records.of("test-site").people[0].rid'),stable);
assert.equal(run('Records.addId("test-site","Alpha")'),'Alpha');assert.equal(run('Records.addId("test-site","alpha")'),'Alpha');
run('Records.titleId("test-site","Alpha","Customer context");_rcContext("test-site").xid="Alpha";');
start('notes');input('rcF1','Draft line one\nDraft line two');run('_rcReadForm();');
run('_rcContext("test-site").filter="people";_rcResume("test-site");_rcRefresh();');assert.equal(run('_rcForm'),null);
run('_rcContext("test-site").xid="";_rcContext("test-site").filter="all";_rcResume("test-site");');
run('_rcContext("test-site").xid="Alpha";_rcResume("test-site");_rcRefresh();');
assert.equal(elements.rcF1.value,'Draft line one\nDraft line two');assert.equal(elements.rcFid.value,'Alpha');
input('rcF1','');run('_rcCommit()');assert(run('_rcForm.error').includes('before saving'));assert.equal(run('Records.of("test-site").notes.length'),1);
input('rcF1','Saved note\nMore details');elements.rcF_pinned.checked=true;run('_rcCommit()');
const note=run('Records.of("test-site").notes[1]');assert.equal(note.xid,'Alpha');assert(note.pinned&&note.rid&&note.created&&note.updated);
start('people');input('rcF1','Casey');input('rcF2','Engineer');input('rcF_email','casey@example.test');input('rcF_phone','+1 (555) 123-4567');input('rcF_org','Network &quot;section&quot;');run('_rcCommit()');
const person=run('Records.of("test-site").people[1]');assert.equal(person.email,'casey@example.test');assert.equal(person.org,'Network &quot;section&quot;');assert(!person.orgId);
assert(run('_rcCard("test-site","people",Records.of("test-site").people[1])').includes('mailto:casey%40example.test'));
assert(run('_rcCard("test-site","people",Records.of("test-site").people[1])').includes('tel:+15551234567'));
// Resolve a draft by stable ID even after a preceding array element is removed.
c.target=person.rid;run('_rcStart("people",target);_rcRefresh();');assert.equal(elements.rcF_org.value,'Network &quot;section&quot;');input('rcF2','Updated engineer');run('Records.remove("test-site","people",0);_rcCommit();');
assert.equal(run('Records.of("test-site").people[0].rid'),person.rid);assert.equal(run('Records.of("test-site").people[0].role'),'Updated engineer');
// jsonb may reorder object keys without changing a record: it is not an edit conflict.
run('_rcStart("people",target);_rcRefresh();');input('rcF2','After reordered sync');run('Records.of("test-site").people[0]=JSON.parse(_recFingerprint(Records.of("test-site").people[0]));_rcCommit();');assert.equal(run('_rcForm'),null);assert.equal(run('Records.of("test-site").people[0].role'),'After reordered sync');
run('_rcStart("people",target);_rcRefresh();');input('rcF2','Unsaved edit');run('Records.update("test-site","people",target,{role:"Remote change"});_rcCommit();');
assert(run('_rcForm.error').includes('changed'));assert.equal(run('_rcForm.item.role'),'Unsaved edit');assert.equal(run('Records.of("test-site").people[0].role'),'Remote change');
run('delete _rcDrafts[_rcForm.key];_rcForm=null;_rcStart("people",target);_rcRefresh();Records.remove("test-site","people",target);_rcCommit();');assert(run('_rcForm.error').includes('removed'));
run('delete _rcDrafts[_rcForm.key];_rcForm=null;');c.noteId=note.rid;run('_rcStart("notes",noteId);_rcRefresh();_rcDelete(noteId);');assert.equal(run('Records.of("test-site").notes.length'),1);
run('Records.add("test-site","notes",{text:"Concurrent note",xid:"Alpha"});_rcUndoDelete();');assert.equal(run('Records.of("test-site").notes.length'),3);assert(run('Records.of("test-site").notes.some(n=>n.text==="Concurrent note")'));
for(const u of ['javascript:alert(1)','data:text/html,test','https://user:secret@example.test','file:///etc/passwd','https://bad host'])assert.equal(c.recordURL(u),'');
assert.equal(c.recordURL('example.test/path'),'https://example.test/path');
run('Records.backup();');assert.equal(c.backup.records['test-site'].idMeta.Alpha.title,'Customer context');assert(c.backup.records['test-site'].notes.find(n=>n.rid===note.rid).pinned);
run('Records.restore(backup);');assert.equal(run('Records.of("test-site").notes.find(n=>n.rid===noteId).text'),'Saved note\nMore details');
run('Records.delId("test-site","Alpha");');assert.equal(run('Records.of("test-site").idMeta.Alpha'),undefined);assert(run('Records.of("test-site").notes.every(n=>!n.xid)'));
const brief=JSON.stringify(c.brief);c.mode='brief';assert(c.RecordUI.open('test-site',note.rid));assert.equal(c.mode,'map');assert.equal(JSON.stringify(c.brief),brief);assert.equal(run('_rcForm.rid'),note.rid);
assert(c.rendered.includes('Installation records'));assert(c.rendered.includes('<textarea'));assert(c.rendered.includes('data-rcsave'));
console.log('UX RECORDS PASS — legacy migration, persistent ID drafts, validation, contact actions, stable edit/conflict handling, Undo, URL schemes, backup round trip and separate rooms');
