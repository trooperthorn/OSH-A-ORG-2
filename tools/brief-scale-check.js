#!/usr/bin/env node
'use strict';

// Run the shipped chart/layout/gesture functions with controlled DOM dimensions.
// These are source and geometry regressions, not browser rendering or iOS QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { sourceFunction } = require('./ux-persistence-check');

function fixture(source, width = 390) {
  const listeners = {}, winListeners = {}, timers = new Map();
  let nextTimer = 0, wrapper = null, markup = '', saves = 0;
  const classes = new Set(['brief-mode']);
  const classList = {
    contains(name) { return classes.has(name); },
    add(name) { classes.add(name); }, remove(name) { classes.delete(name); },
  };
  const percentage = { textContent: '' };
  const stage = {
    addEventListener(name, callback, options) {
      (listeners[name] || (listeners[name] = [])).push({ callback, options });
    },
    get innerHTML() { return markup; },
    set innerHTML(value) {
      if (wrapper && c.document.activeElement === wrapper) c.document.activeElement = c.document.body;
      markup = value;
      const found = value.match(/class="bf-tree" style="width:([\d.]+)px;height:([\d.]+)px;zoom:([\d.]+);"/);
      if (!found) { wrapper = null; return; }
      const tree = { style: { zoom: +found[3] }, scrollWidth: +found[1], scrollHeight: +found[2] };
      // Deliberately expose unzoomed scrollWidth, matching the layout helper's
      // declared contract. Actual engine zoom metrics remain a browser gate.
      wrapper = {
        clientWidth: width - 80, clientHeight: 230, scrollLeft: 0, scrollTop: 0,
        classList: { contains(name) { return name === 'bf-wrap'; } },
        matches(selector) { return selector === '.bf-wrap'; },
        focus() { c.document.activeElement = this; },
        querySelector(selector) { return selector === '.bf-tree' ? tree : null; },
        closest(selector) { return selector === '.bf-wrap' ? this : null; },
        getBoundingClientRect() { return { left: 10, top: 150, width: this.clientWidth, height: this.clientHeight }; },
      };
    },
  };
  const c = {
    BRIEF: { nodes: [], hide: [], vert: [] }, GlobeState: {},
    BF_STREAMS: { 1: ['#fff'], 2: ['#fff'], 3: ['#fff'], 4: ['#fff'] },
    document: {
      body: { classList },
      getElementById(name) { return name === 'briefStage' ? stage : null; },
      querySelectorAll() { return []; },
      querySelector(selector) {
        if (selector === '#briefStage .bf-wrap') return wrapper;
        if (selector === '#briefStage .bf-zpct') return percentage;
        return null;
      },
    },
    matchMedia(query) { return { matches: query.includes('max-width:1099px') && width < 1100 }; },
    orgById() { return null; }, ogEffSite() { return null; }, siteById() { return null; },
    _bfFlipCapture() { return null; }, _bfFlipPlay() {}, _bdSync() {},
    _bfSave() { saves++; }, globeMark() {}, calloutHide() {}, hideDossier() {},
    setTimeout(callback) { const id = ++nextTimer; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener(name, callback) { (winListeners[name] || (winListeners[name] = [])).push(callback); },
  };
  c.window = c;
  c.document.activeElement = c.document.body;
  vm.createContext(c);
  const names = ['_odEsc', '_odEscA', '_briefChainMap', '_bfStarKind', '_bfTint', 'bfNode', 'bfPlaceOf', 'bfStack',
    '_bfSceneDepth', '_bfViewCapture', '_bfFit', '_bfZoomTo', '_bfExplore', '_bfChartWire', 'renderBrief',
    // v1.29.0 — the back spine rides _bfExplore/bfDepth, so the sandbox needs it
    '_bfNavPush', 'bfBack'];
  const places = source.match(/const BF_PLACES=\[[\s\S]*?\n\];/);
  assert.ok(places, 'shipped brief-place roster missing');
  // v1.29.0: _bfHist is module state the spine functions close over
  vm.runInContext('var _bfHist=[];\n' + places[0] + '\n' + names.map(name => sourceFunction(source, name)).join('\n'), c);
  function fire(name, fields = {}, windowEvent = false) {
    const event = Object.assign({ target: wrapper, prevented: false, defaultPrevented: false, stopped: false,
      preventDefault() { this.prevented = true; this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; } }, fields);
    for (const entry of (windowEvent ? winListeners[name] : listeners[name]) || []) {
      (windowEvent ? entry : entry.callback)(event);
    }
    return event;
  }
  return { c, stage, listeners, timers, fire, get wrapper() { return wrapper; }, get saves() { return saves; } };
}

function node(k, p = null, name = k) { return { k, p, n: name, t: 'custom', r: null, tx: '', c: '' }; }
function cards(markup) {
  return [...markup.matchAll(/<button\b[^>]*class="bf-box [^"]*"[^>]*style="([^"]+)"[^>]*data-bfobj="([^"]+)"[^>]*>([\s\S]*?)<\/button>/g)].map(m => {
    const style = {};
    for (const part of m[1].split(';')) { const [key, value] = part.split(':'); if (value) style[key] = parseFloat(value); }
    return { key: m[2], content: m[3], ...style };
  });
}
function near(actual, expected, message) { assert.ok(Math.abs(actual - expected) < .001, message + ': ' + actual + ' vs ' + expected); }
function center(f, key) {
  const p = f.c.GlobeState.__bfLayout.nodes[key], z = f.c.GlobeState._bfZoom || 1;
  return { x: p.cx * z - f.wrapper.scrollLeft, y: (p.y + f.c.GlobeState.__bfLayout.bh / 2) * z - f.wrapper.scrollTop };
}

function installGlobalKeys(source, context) {
  // Parse the actual document listener containing the camera/search shortcuts;
  // use the JS parser to delimit its call, including all nested branches.
  const marker = source.lastIndexOf('var ae=document.activeElement;');
  assert.ok(marker >= 0, 'global keyboard handler missing');
  const start = source.lastIndexOf("document.addEventListener('keydown',", marker);
  assert.ok(start >= 0, 'global keyboard listener missing');
  let callback = null;
  context.document.addEventListener = (kind, handler) => { assert.equal(kind, 'keydown'); callback = handler; };
  for (let end = source.indexOf('\n', marker); end >= 0; end = source.indexOf('\n', end + 1)) {
    const candidate = source.slice(start, end);
    try { new vm.Script(candidate); }
    catch (_) { continue; }
    vm.runInContext(candidate, context);
    assert.equal(typeof callback, 'function');
    return callback;
  }
  throw new Error('Cannot isolate global keyboard listener');
}

function run(source = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8')) {
  let checks = 0;
  const pass = name => { checks++; console.log('  ✓ ' + name); };
  {
    const f = fixture(source);
    for (let root = 0; root < 12; root++) {
      f.c.BRIEF.nodes.push(node('r' + root));
      for (let child = 0; child < 10; child++) {
        const k = 'r' + root + ':' + child;
        f.c.BRIEF.nodes.push(node(k, 'r' + root), node(k + ':leaf', k));
      }
    }
    const original = JSON.stringify(f.c.BRIEF);
    f.c.renderBrief();
    assert.equal(cards(f.stage.innerHTML).length, 132, 'overview should initially show exactly two levels');
    const fullWidth = f.wrapper.querySelector('.bf-tree').scrollWidth;
    assert.match(cards(f.stage.innerHTML).find(n => n.key === 'r0').content, /20 below/, 'counts must include descendants beyond display depth');
    assert.match(f.stage.innerHTML, /data-bfbranch="r0:0"/, 'limited branch must remain explorable after counting');
    f.c._bfExplore('r0:0');
    assert.deepEqual(cards(f.stage.innerHTML).map(n => n.key), ['r0:0', 'r0:0:leaf']);
    assert.ok(f.wrapper.querySelector('.bf-tree').scrollWidth < fullWidth / 4, 'focused layout must exclude unrelated widths');
    assert.equal(JSON.stringify(f.c.BRIEF), original, 'view changes must not change membership or stored parents');
    f.c._bfExplore(null);
    assert.equal(cards(f.stage.innerHTML).length, 132, 'overview should restore all root branches');
    pass('large forest: semantic overview, full descendant counts, true focus pruning, no source mutation');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = Array.from({ length: 7 }, (_, i) => node('deep' + i, i ? 'deep' + (i - 1) : null));
    const original = JSON.stringify(f.c.BRIEF);
    f.c._bfExplore('deep4');
    assert.deepEqual(cards(f.stage.innerHTML).map(n => n.key), ['deep4', 'deep5'], 'L5 focus needs relative depth');
    assert.match(f.stage.innerHTML, /data-bfbranch="deep3"/, 'ancestry must stay reachable');
    let globe = f.c._briefChainMap();
    assert.ok(globe.nodes.deep4 && globe.nodes.deep5 && !globe.nodes.deep6, 'globe should follow relative semantic depth from L5 focus');
    f.c._bfZoomTo(1.4, null, true);
    assert.deepEqual(cards(f.stage.innerHTML).map(n => n.key), ['deep4', 'deep5', 'deep6']);
    assert.equal(JSON.stringify(f.c.BRIEF), original);
    f.c.GlobeState._bfManualDepth = true; f.c.GlobeState._bfDepth = 1; f.c.renderBrief();
    globe = f.c._briefChainMap();
    assert.deepEqual(cards(f.stage.innerHTML).map(n => n.key), ['deep4']);
    assert.ok(globe.nodes.deep4 && !globe.nodes.deep5, 'manual one-level setting must remain relative to the focused node');
    assert.ok(globe.nodes.deep0 && globe.nodes.deep3, 'globe keeps lineage context');
    f.c.GlobeState._bfDepth = 3; f.c.renderBrief();
    assert.ok(f.c._briefChainMap().nodes.deep6, 'manual relative levels must reveal deeper nodes');
    pass('deep L5+ branch remains visible, with deeper semantic detail and ancestry navigation');
  }
  {
    for (const width of [320, 390, 414, 1280]) {
      const f = fixture(source, width);
      const names = ['California RSN', 'Fort Bragg ECCSP', 'Regional Network Operations & Support Command'];
      f.c.BRIEF.nodes = names.map((name, i) => node('name' + i, null, name));
      f.c.renderBrief(); f.c._bfZoomTo(.01, null, true);
      near(f.c.GlobeState._bfZoom, .85, 'readability floor');
      for (const card of cards(f.stage.innerHTML)) {
        assert.ok(Number.isFinite(card.width) && card.width > 0, 'each card needs explicit layout width');
        assert.ok(card.width * .85 >= 44 && card.height * .85 >= 44, 'card targets below44 at minimum zoom');
      }
      for (const name of names) assert.ok(f.stage.innerHTML.includes(f.c._odEsc(name)), 'full names must be present, including escaping');
      f.c._bfZoomTo(1.4, null, true);
      assert.match(f.stage.innerHTML, /class="bf-location"/, 'detail scale must reveal location');
      const card = cards(f.stage.innerHTML)[0];
      const minimumTextHeight = 2 * (width >= 1100 ? 15 : 14) * 1.3 + 12 + 15 + 12 + 3 * 5;
      assert.ok(card.height - 24 >= minimumTextHeight, 'detail card must fit two name lines, metadata and padding');
    }
    pass('320/390/414/1280 geometry: explicit widths, full names, 85% target floor, detail text capacity');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = [node('root'), ...Array.from({ length: 15 }, (_, i) => node('child' + i, 'root'))];
    f.c.renderBrief();
    const p = f.c.GlobeState.__bfLayout.nodes.child7;
    f.wrapper.scrollLeft = p.cx - 120; f.wrapper.scrollTop = 40;
    const captured = f.c._bfViewCapture();
    const old = center(f, captured.key);
    f.c.renderBrief();
    near(center(f, captured.key).x, old.x, 'ordinary redraw preserves nearest node x');
    near(center(f, captured.key).y, old.y, 'ordinary redraw preserves nearest node y');
    f.c._bfZoomTo(1.15, null, true);
    near(center(f, captured.key).x + captured.dx * 1.15, captured.x, 'zoom preserves offset from anchor node x');
    near(center(f, captured.key).y + captured.dy * 1.15, captured.y, 'zoom preserves offset from anchor node y');
    f.c._bfZoomTo(1.4, null, true);
    near(center(f, captured.key).x + captured.dx * 1.4, captured.x, 'semantic threshold preserves anchor offset x');
    near(center(f, captured.key).y + captured.dy * 1.4, captured.y, 'semantic threshold preserves anchor offset y');
    pass('pan and zoom preserve the nearest visible node through redraw and semantic threshold');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = [node('root'), ...Array.from({ length: 10 }, (_, i) => node('child' + i, 'root'))];
    f.c.renderBrief();
    f.wrapper.scrollLeft = 320; f.wrapper.scrollTop = 60;
    const rect = f.wrapper.getBoundingClientRect(), local = { x: 77, y: 102 };
    const point = { x: rect.left + local.x, y: rect.top + local.y };
    const world = { x: f.wrapper.scrollLeft + local.x, y: f.wrapper.scrollTop + local.y };
    f.c._bfZoomTo(1.2, point, false);
    near((f.wrapper.scrollLeft + local.x) / 1.2, world.x, 'pointer zoom preserves exact world x under midpoint');
    near((f.wrapper.scrollTop + local.y) / 1.2, world.y, 'pointer zoom preserves exact world y under midpoint');
    pass('pointer zoom anchors the actual touched world point, not a nearby node center');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = [node('px:california-rsn', null, 'Western Network Hub'), node('px:jblm-eccsp', null, 'Northwest Service Hub')];
    const chain = f.c._briefChainMap({ all: true });
    assert.equal(f.c._bfStarKind(chain.nodes['px:california-rsn']), 'rsn', 'renamed RSN retains stable globe type');
    assert.equal(f.c._bfStarKind(chain.nodes['px:jblm-eccsp']), 'eccsp', 'renamed ECCSP retains stable globe type');
    f.c.renderBrief();
    assert.match(cards(f.stage.innerHTML).find(n => n.key === 'px:california-rsn').content, />RSN</);
    assert.match(cards(f.stage.innerHTML).find(n => n.key === 'px:jblm-eccsp').content, />ECCSP</);
    pass('renamed RSN/ECCSP nodes retain type in chart and globe rendering paths');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = [node('parent'), node('a', 'parent'), node('a1', 'a'), node('b', 'parent')];
    f.c.GlobeState._bfManualDepth = true; f.c.GlobeState._bfDepth = 4;
    const original = JSON.stringify(f.c.BRIEF.nodes);
    f.c.renderBrief();
    const before = JSON.parse(JSON.stringify(f.c.GlobeState.__bfLayout.nodes));
    assert.notEqual(before.a.cx, before.b.cx, 'default siblings are horizontal');
    f.c.bfStack(2);
    const stacked = f.c.GlobeState.__bfLayout.nodes;
    for (const key of ['a', 'a1', 'b']) assert.equal(stacked[key].cx, stacked.parent.cx, 'stack uses parent center');
    assert.ok(stacked.parent.y < stacked.a.y && stacked.a.y < stacked.a1.y && stacked.a1.y < stacked.b.y, 'stack preserves depth-first order');
    assert.equal(JSON.stringify(f.c.BRIEF.nodes), original, 'stack must not rewrite parents/order');
    assert.ok(f.c.BRIEF.vert.includes(2) && f.saves === 1, 'stack must use persistence hook');
    f.c.bfStack(2);
    assert.equal(JSON.stringify(f.c.GlobeState.__bfLayout.nodes), JSON.stringify(before), 'unstack restores exact positions');
    pass('legacy stack geometry: common center, ordered descent, persistence, exact unstack restoration');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = [node('root')]; f.c.renderBrief();
    const head = f.stage.innerHTML.slice(0, f.stage.innerHTML.indexOf('</div>'));
    assert.match(head, /^<div class="ch-head">/);
    assert.match(head, /<button[^>]*class="bf-headtoggle"[^>]*data-chmin="1"[^>]*aria-expanded="true"/);
    assert.equal((head.match(/data-chmin=/g) || []).length, 1);
    assert.ok(!/<button\b[^>]*>[\s\S]*?<button\b/.test(head.split('</button>')[0]), 'head actions must be sibling buttons');
    pass('native standalone collapse button keeps toolbar actions independent');
  }
  {
    const f = fixture(source);
    f.c.BRIEF.nodes = [node('root'), node('child', 'root')]; f.c.renderBrief();
    assert.equal(f.listeners.touchmove[0].options.passive, false, 'pinch handler must be allowed to prevent native zoom');
    const touch = (x, y = 210) => ({ clientX: x, clientY: y });
    assert.equal(f.fire('touchstart', { touches: [touch(40)] }).prevented, false, 'one-finger start stays native');
    assert.equal(f.fire('touchmove', { touches: [touch(45)] }).prevented, false, 'one-finger scroll stays native');
    assert.equal(f.fire('touchstart', { touches: [touch(40), touch(140)] }).prevented, true);
    f.fire('touchmove', { touches: [touch(30), touch(150)] });
    near(f.c.GlobeState._bfZoom, 1.2, 'pinch ratio');
    f.fire('touchcancel');
    const zoom = f.c.GlobeState._bfZoom;
    const stale = f.fire('touchmove', { touches: [touch(0), touch(200)] });
    assert.equal(stale.prevented, false); assert.equal(f.c.GlobeState._bfZoom, zoom, 'cancel must clear pinch state');
    assert.equal(f.fire('wheel', { deltaY: -20 }).prevented, false, 'plain wheel remains scrolling');
    assert.equal(f.fire('wheel', { deltaY: -20, ctrlKey: true, clientX: 100, clientY: 210 }).prevented, true);
    assert.ok(f.c.GlobeState._bfZoom > zoom);
    for (const [id, callback] of [...f.timers]) { f.timers.delete(id); callback(); }
    const originalTop = f.wrapper.scrollTop;
    f.fire('keydown', { key: 'ArrowDown' });
    assert.equal(f.wrapper.scrollTop, originalTop + 100, 'keyboard arrow pans diagram');
    f.wrapper.focus();
    f.fire('keydown', { key: '+', target: f.c.document.activeElement });
    assert.equal(f.c.document.activeElement, f.wrapper, 'keyboard zoom must focus the replacement diagram');
    const firstKeyZoom = f.c.GlobeState._bfZoom;
    f.fire('keydown', { key: '+', target: f.c.document.activeElement });
    assert.ok(f.c.GlobeState._bfZoom > firstKeyZoom, 'second keyboard zoom works without refocusing');
    const header = { closest() { return null; } };
    f.fire('pointerdown', { pointerType: 'mouse', button: 0, clientX: 100, clientY: 220 });
    f.fire('pointermove', { clientX: 130, clientY: 240 }, true);
    f.fire('pointerup', { target: header }, true);
    assert.equal(f.fire('click', { target: header }).prevented, false, 'drag ending outside chart must not consume a later header click');
    assert.equal(f.listeners.touchstart.length, 1, 'redraw must not duplicate gesture listeners');
    pass('real gestures: native scroll, pinch/cancel, modifier wheel, repeated keyboard zoom, outside drag release, one binding');
  }
  {
    const f = fixture(source), zooms = [];
    f.c.tpZoom = direction => zooms.push(direction); f.c.tpUndo = () => {};
    const globalKeys = installGlobalKeys(source, f.c);
    f.c.BRIEF.nodes = [node('root')]; f.c.renderBrief(); f.wrapper.focus();
    for (const key of ['+', '-']) {
      const handled = f.fire('keydown', { key, target: f.c.document.activeElement });
      assert.equal(handled.defaultPrevented, true, 'chart consumes its own zoom key');
      globalKeys(handled);
    }
    assert.deepEqual(zooms, [], 'handled chart zoom must not also zoom the globe');
    f.c.document.activeElement = { tagName: 'SELECT' };
    globalKeys({ key: '+', defaultPrevented: false }); globalKeys({ key: '-', defaultPrevented: false });
    assert.deepEqual(zooms, [], 'native select must own its keyboard input');
    f.c.document.activeElement = f.c.document.body;
    globalKeys({ key: '+', defaultPrevented: false }); globalKeys({ key: '-', defaultPrevented: false });
    assert.deepEqual(zooms, [1, -1], 'positive control: unhandled page shortcuts still zoom the globe');
    pass('real global shortcuts respect chart-handled zoom and native selects, preserving page shortcuts');
  }
  console.log('BRIEF SCALE PASS (' + checks + '; source/VM geometry, browser/device not exercised)');
  return { checks };
}

module.exports = { run, fixture, cards };
if (require.main === module) {
  try { run(); }
  catch (error) { console.error('BRIEF SCALE FAIL: ' + error.stack); process.exitCode = 1; }
}
