// Navigation regression checks without a browser. Derived CSS rectangles are
// layout checks, not proof of browser hit-testing; device sanity remains a gate.
const assert=require('assert/strict'), fs=require('fs'), path=require('path'), vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');

function cssRules(source,width){
  const out=[];
  function walk(text){
    let pos=0;
    while(pos<text.length){
      const start=text.indexOf('{',pos); if(start<0) break;
      const key=text.slice(pos,start).trim(); let end=start+1, depth=1;
      for(;end<text.length&&depth;end++){ if(text[end]==='{') depth++; if(text[end]==='}') depth--; }
      const body=text.slice(start+1,end-1); pos=end;
      if(key.startsWith('@media')){
        const min=+(key.match(/min-width\s*:\s*(\d+)px/)||[])[1], max=+(key.match(/max-width\s*:\s*(\d+)px/)||[])[1];
        if((min||max) && (!min||width>=min) && (!max||width<=max)) walk(body);
      }else if(!key.startsWith('@')){
        const props={}; for(const bit of body.split(';')){ const p=bit.indexOf(':'); if(p>=0) props[bit.slice(0,p).trim()]=bit.slice(p+1).trim(); }
        for(const sel of key.split(',')) out.push({sel:sel.trim(),props});
      }
    }
  }
  for(const m of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) walk(m[1].replace(/\/\*[\s\S]*?\*\//g,''));
  return function(...selectors){
    const matches=out.filter(r=>selectors.includes(r.sel));
    const weight=s=>(s.match(/#/g)||[]).length*100+(s.match(/[.:]/g)||[]).length*10;
    matches.sort((a,b)=>weight(a.sel)-weight(b.sel));
    return Object.assign({},...matches.map(r=>r.props));
  };
}
const num=s=>{ assert.match(s||'',/^\d+(?:\.\d+)?px$/); return parseFloat(s); };
const pad=s=>{ const n=s.split(/\s+/).map(num); return [n[0],n[1]??n[0],n[2]??n[0],n[3]??n[1]??n[0]]; };
const inset=s=>{ const m=s.match(/\+\s*(\d+)px\)/); assert.ok(m,'safe-area inset missing: '+s); return +m[1]; };

function geometry(source){
  for(const width of [320,390,414,1280]){
    const css=cssRules(source,width), root=css(':root'), desktop=width>=1100;
    const hit=css('.nv-sat::after','#navPod .nv-sat::after');
    const rock=css('.tp-rock'), half=css('.tp-half'), halfHit=css('.tp-half::after');
    const halfH=+half.flex.split(/\s+/)[2].replace('px','');
    assert.ok(num(hit.width)>=44 && num(hit.height)>=44,'navigation target too small');
    assert.ok(num(halfHit.width)>=44 && num(halfHit.height)>=44,'zoom target too small');
    assert.equal(rock.overflow,'visible','zoom targets clipped by rocker');
    assert.ok(halfH>=num(halfHit.height),'zoom halves overlap');
    assert.equal(num(rock.height),2*halfH,'rocker clips or compresses its two halves');
    for(const brief of [false,true]){
      const host=brief?'#briefDock':'#navPod';
      const dock=css(brief?'.ch-dock':'#navPod',brief?'body.brief-mode #briefDock':'#navPod');
      const cell=css('.nv-sat',host+' .nv-sat');
      const target=css('.nv-sat::after',host+' .nv-sat::after');
      const gap=num(dock.gap), h=num(cell.height), p=pad(dock.padding);
      assert.ok(h+gap>=num(target.height),width+'px adjacent '+host+' hit targets overlap');
      const plate=num(cell.width)+p[1]+p[3];
      assert.equal(plate,num(root['--rail-w']),host+' disagrees with content gutter');
      const edge=desktop?num(root['--rail-r']):inset(root['--safe-r']);
      assert.ok(edge+plate/2-num(target.width)/2>=0,'target crosses screen edge');
      assert.ok(p[0]>=(num(target.height)-h)/2,'top target exceeds plate');
      if(!brief) assert.ok(gap+(h+halfH)/2>=(num(target.height)+num(halfHit.height))/2,'undo and zoom overlap');
    }
    const mode=css('.ms-cell'), seg=css('#modeSeg'), chart=css('body.brief-mode #briefStage');
    assert.ok(num(mode['min-height'])>=44 && num(mode['min-width'])>=44,'room switch too small');
    const segBottom=inset(seg.top)+pad(seg.padding)[0]*2+num(mode['min-height']);
    assert.ok(inset(chart.top)>=segBottom+6,'chart overlaps room switch');
    const time=css('#timeLedger');
    assert.ok(num(time['min-height'])>=44,'time selector target too small');
    if(!desktop){
      assert.ok(inset(time.top)>=segBottom+6,'time selector overlaps room switch');
      const card=css('#calloutCard.co-docked');
      assert.ok(inset(card.top)>=inset(time.top)+num(time['min-height'])+8,'card overlaps time selector');
    }
    const layers=css('#lyPanel'), row=css('.ly-cb'), modes=css('.ly-md'), saved=css('.sp-star');
    assert.ok(num(row['min-height'])>=44 && num(modes['min-height'])>=44,'layer choices too small');
    assert.equal(layers['overflow-y'],'auto','layer list cannot scroll');
    assert.ok(layers['max-height'].includes('100dvh'),'layer list not bounded by viewport');
    assert.ok(!layers.transform||layers.transform==='none','scrolling layer list must not transform');
    assert.ok(num(saved['min-width'])>=44&&num(saved.height)>=44,'Saved door too small');
  }
}
geometry(html);
// Prove the checks reject the actual regressions this change addresses.
assert.throws(()=>geometry(html.replace(/gap:14px/g,'gap:8px')),/overlap/);
assert.throws(()=>geometry(html.replace('overflow:visible; background:rgba(0,0,0,.30)','overflow:hidden; background:rgba(0,0,0,.30)')),/clipped/);
console.log('✓ Derived navigation geometry: 320/390/414/1280px, independent targets, gutters, header bands, bounded layers');

function fn(name){
  const at=html.indexOf('function '+name+'('); assert.ok(at>=0,name+' missing');
  const start=html.indexOf('{',at); let end=start+1, depth=1;
  for(;depth&&end<html.length;end++){ if(html[end]==='{') depth++; if(html[end]==='}') depth--; }
  return html.slice(at,end);
}
const values=new Map(), storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};
function prefs(localStorage){ const c=vm.createContext({localStorage}); vm.runInContext(fn('_introSkip'),c); return c; }
const first=prefs(storage); assert.equal(first._introSkip(),false); assert.equal(first._introSkip(true),true);
const second=prefs(storage); assert.equal(second._introSkip(),true,'preference lost on reload');
const intro=html.slice(html.indexOf('(function(){',html.indexOf('function _introSkip(')),html.lastIndexOf('</script>'));
let removed=0, frames=0;
Object.assign(second,{window:second,requestAnimationFrame:()=>frames++,document:{getElementById:()=>({classList:{},remove:()=>removed++})},GlobeState:{sel:null,selOrg:null,zoom:1.8}});
const before=JSON.stringify(second.GlobeState); vm.runInContext(intro,second);
assert.equal(removed,1); assert.equal(frames,0); assert.equal(JSON.stringify(second.GlobeState),before,'skip restores or changes the working state');
assert.equal(second._introSkip(false),false); assert.equal(prefs(storage)._introSkip(),false);
assert.equal(prefs({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}})._introSkip(true),false);
console.log('✓ Skip intro: opt-in persistence, reload, opt-out, storage refusal, blank-slate state retained');

const states=[], door={setAttribute:(k,v)=>states.push([k,v]),classList:{toggle:(k,v)=>states.push([k,v])}};
const repo=vm.createContext({document:{querySelector:()=>door}}); vm.runInContext(fn('_repoDoorSync'),repo);
repo._repoDoorSync(true); repo._repoDoorSync(false);
assert.deepEqual(states,[['aria-expanded','true'],['on',true],['aria-expanded','false'],['on',false]]);
assert.match(html, /data-svdoor="1"[^>]*aria-controls="ledger"[^>]*aria-label="Saved — Repository:/);
assert.match(fn('_ledgerOpen'),/_repoDoorSync\(true\)/); assert.match(fn('_ledgerClose'),/_repoDoorSync\(false\)/);
assert.match(html,/data-odclose="1" aria-label="Close details"/);
assert.match(html,/data-bfclear="1" aria-label="Reset brief view — keep diagram"/);
console.log('✓ Repository expanded state and scoped close/reset names');

const controls={}, zoom=[];
const transport=vm.createContext({window:{addEventListener(){}},document:{getElementById:id=>controls[id]},navigator:{},
  _tpId:null,_tpDir:0,_tpHold:null,tpZoom:(...x)=>zoom.push(x),tpSync(){},tpLive(){},_tpStop(){},_tpRamp(){},setTimeout(){}});
for(const id of ['navSat-zoomin','navSat-zoomout']) controls[id]={events:{},addEventListener(k,f){this.events[k]=f;}};
vm.runInContext(fn('_tpWire'),transport); transport._tpWire();
const plus=controls['navSat-zoomin']; plus.events.pointerdown({pointerId:1}); plus.events.click({detail:1});
assert.equal(zoom.length,1,'pointer tap double-fired'); plus.events.click({detail:0}); assert.equal(zoom.length,2,'keyboard zoom did not fire');
plus.disabled=true; plus.events.click({detail:0}); assert.equal(zoom.length,2,'disabled keyboard zoom fired');
console.log('✓ Zoom: pointer tap fires once, keyboard click works, disabled state honored');
console.log('UX NAVIGATION CHECK PASS (source geometry and unit behavior; browser/device geometry not exercised)');
