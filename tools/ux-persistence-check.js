#!/usr/bin/env node
'use strict';

// Execute the shipped persistence functions in an isolated VM. Transactions
// and server replies are controlled here; app logic is always read from source.
// This verifies revision receipts, not browser layout or real network access.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function sourceFunction(source, name) {
  const match = new RegExp('^(?:async\\s+)?function\\s+' + name + '\\s*\\(', 'm').exec(source);
  assert.ok(match, 'Shipped function missing: ' + name);
  // Ask the JavaScript parser where this function ends. This handles braces in
  // strings, regular expressions, templates and comments without a homemade lexer.
  let end = source.indexOf('\n', match.index);
  while (end >= 0) {
    const candidate = source.slice(match.index, end);
    try { new vm.Script('(' + candidate + '\n)'); return candidate; }
    catch (_) { end = source.indexOf('\n', end + 1); }
  }
  throw new Error('Cannot isolate shipped function: ' + name);
}

function fixture(source) {
  let clock = 2000;
  let timerId = 0;
  const timers = new Map();
  const transactions = [];
  const statusNode = { textContent: '', getAttribute() { return 'probe'; } };
  const context = {
    Date: class extends Date { static now() { return clock; } },
    RECORDS: Object.create(null), _recReceipts: Object.create(null), _recCloud: Object.create(null),
    _rdb: null, _db: null, _dbCfg: null, _dbState: 'off', _dbMsg: '',
    _dbPushT: null, _dbDirty: false, _dbPushBusy: false, _dbRetryT: null,
    _dbRetryN: 0, _dbSyncT: 0, _dbFailNet: false, _dbClientId: 'test-device',
    _dbViewer: false,   /* v2.7.0 THE WORKSPACE: the sandbox mirrors the module's real dependency set */
    DB_TABLE: 'a2_records', SAVEDV: [], _svMod: 0, SAVEDB: [], _sbMod: 0,
    navigator: { onLine: true },
    document: {
      querySelectorAll() { return [statusNode]; },
      querySelector() { return null; }, getElementById() { return null; },
    },
    setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    // This probe exercises first-device seeding. An unexpected remote-record
    // merge must fail loudly instead of silently taking a stubbed success path.
    _dbApply() { throw new Error('Unexpected remote-record merge in seed probe'); },
    // Export fixtures are complete records; storage migration is covered by
    // the records suite. These adapters expose only the prepared fixture data.
    recordOf(id) { return context.RECORDS[id] || null; },
    recCount(id) {
      const r = context.RECORDS[id];
      return r ? ['people', 'specs', 'notes', 'links'].reduce((sum, kind) => sum + r[kind].length, 0) : 0;
    },
  };
  context.window = context;
  vm.createContext(context);
  const names = [
    '_odEsc', '_odEscA', '_recPersist', '_recSave', '_recStatusText',
    'recordSaveStatus', '_recStatusPaint', '_recCloudAck', '_recLoaded', '_dbSetState',
    '_dbIsNet', '_dbWhy', '_dbSnapshot', 'dbPush', '_dbFlush', '_dbRetryArm', 'dbPullOnce',
    '_xpRecordSnapshot', '_xpRecordBody',
  ];
  vm.runInContext(names.map(name => sourceFunction(source, name)).join('\n'), context);

  function record() {
    const item = { v: 1, id: 'probe', people: [], specs: [], notes: [{ text: 'First revision' }], links: [], ids: [], mod: 1 };
    context.RECORDS.probe = item;
    return item;
  }
  function storage(throwOnPut) {
    context._rdb = {
      transaction(store, mode) {
        assert.equal(store, 'records'); assert.equal(mode, 'readwrite');
        const tx = {
          objectStore(name) {
            assert.equal(name, 'records');
            return { put(value) {
              if (throwOnPut) throw new Error('Quota exceeded');
              tx.value = JSON.parse(JSON.stringify(value));
            } };
          },
        };
        transactions.push(tx);
        return tx;
      },
    };
  }
  function connect() {
    const writes = [];
    context._dbCfg = { board: 'probe-board' };
    context._db = {
      from(table) {
        assert.equal(table, 'a2_records');
        return {
          select() { return { eq() { return { maybeSingle() { return Promise.resolve({ data: null, error: null }); } }; } }; },
        };
      },
      // v2.7.0 THE WORKSPACE: every write rides the a2_save RPC (the write-code
      // door). The fixture captures the RPC and normalizes its args to the old
      // payload shape so every downstream assertion still reads the truth.
      rpc(name, args) {
        assert.equal(name, 'a2_save');
        assert.equal(args.p_board, 'probe-board');
        const payload = { id: args.p_board, data: args.p_data, updated_by: args.p_client };
        return new Promise((resolve, reject) => writes.push({ payload, resolve, reject }));
      },
    };
    return writes;
  }
  return { c: context, transactions, timers, statusNode, record, storage, connect,
    advance(ms = 1) { clock += ms; } };
}

async function run(options = {}) {
  const file = options.file || path.join(__dirname, '..', 'index.html');
  const source = fs.readFileSync(file, 'utf8');
  const log = options.log || console.log;
  let checks = 0;
  function pass(label) { checks++; log('  ✓ ' + label); }

  {
    const f = fixture(source), r = f.record();
    f.storage();
    assert.match(f.c._recStatusText(r.id), /^Device save not yet confirmed/);
    f.c._recLoaded(r);
    assert.match(f.c._recStatusText(r.id), /^Saved on this device/);
    pass('an open database alone proves nothing; a loaded record earns its local receipt');
  }

  {
    const f = fixture(source), r = f.record();
    f.storage(); f.c._recSave(r.id);
    assert.match(f.c._recStatusText(r.id), /^Saving on this device/);
    assert.match(f.statusNode.textContent, /^Saving on this device/);
    assert.doesNotMatch(f.c.recordSaveStatus(r.id), /Saved on this device/);
    assert.equal(f.transactions[0].value.mod, r.mod);
    f.transactions[0].oncomplete();
    assert.match(f.c._recStatusText(r.id), /^Saved on this device/);
    assert.match(f.c.recordSaveStatus(r.id), /role="status"[\s\S]*Saved on this device/);
    pass('local save is pending until its IndexedDB transaction completes');
  }

  for (const failure of ['onerror', 'onabort', 'throw']) {
    const f = fixture(source), r = f.record();
    f.storage(failure === 'throw'); f.c._recSave(r.id);
    if (failure !== 'throw') f.transactions[0][failure]();
    assert.match(f.c._recStatusText(r.id), /^Device save failed/);
    assert.doesNotMatch(f.c._recStatusText(r.id), /Saved on this device/);
    pass('local ' + failure + ' never reports a durable save');
  }

  {
    const f = fixture(source), r = f.record();
    f.c._recSave(r.id);
    assert.match(f.c._recStatusText(r.id), /^Session only/);
    assert.match(f.c._recStatusText(r.id), /Not synced this session/);
    pass('unavailable IndexedDB reports session-only storage');
  }

  {
    const f = fixture(source), r = f.record();
    f.storage(); f.c._recSave(r.id);
    const firstMod = r.mod;
    // Same wall clock is deliberate: two quick edits still need distinct mods.
    r.notes[0].text = 'Second revision'; f.c._recSave(r.id);
    assert.ok(r.mod > firstMod);
    f.transactions[0].oncomplete();
    assert.match(f.c._recStatusText(r.id), /^Saving on this device/);
    f.transactions[1].oncomplete();
    f.transactions[0].onerror();
    assert.match(f.c._recStatusText(r.id), /^Saved on this device/);
    assert.equal(f.c._recReceipts.probe.mod, r.mod);
    pass('stale completion and error callbacks cannot certify or invalidate a newer revision');
  }

  {
    const f = fixture(source), r = f.record();
    f.storage(); const writes = f.connect();
    f.c._recSave(r.id); f.transactions[0].oncomplete();
    const firstMod = r.mod, firstFlight = f.c._dbFlush();
    assert.equal(writes.length, 1);
    assert.equal(f.c._dbPushBusy, true);
    assert.match(f.c._recStatusText(r.id), /Sync pending/);
    assert.doesNotMatch(f.c._recStatusText(r.id), / · Synced /);
    r.notes[0].text = 'Edited during upload'; f.c._recSave(r.id);
    f.transactions[1].oncomplete();
    assert.equal(writes[0].payload.data.records.probe.mod, firstMod);
    assert.equal(writes[0].payload.data.records.probe.notes[0].text, 'First revision');
    writes[0].resolve({ error: null });
    assert.equal(await firstFlight, true);
    assert.equal(f.c._recCloud.probe.mod, firstMod);
    assert.match(f.c._recStatusText(r.id), /Sync pending/);
    assert.doesNotMatch(f.c._recStatusText(r.id), / · Synced /);
    assert.equal(f.c._dbDirty, true);
    const secondFlight = f.c._dbFlush();
    assert.equal(writes.length, 2);
    assert.equal(writes[1].payload.data.records.probe.notes[0].text, 'Edited during upload');
    writes[1].resolve({ error: null });
    assert.equal(await secondFlight, true);
    assert.equal(f.c._recCloud.probe.mod, r.mod);
    assert.match(f.c._recStatusText(r.id), / · Synced /);
    assert.equal(f.c._dbDirty, false);
    pass('an old upload acknowledges its immutable snapshot; the newest edit needs its own successful upload');
  }

  {
    const f = fixture(source), r = f.record();
    const writes = f.connect(); f.c._recSave(r.id);
    const flight = f.c._dbFlush();
    writes[0].resolve({ error: { message: 'Failed to fetch' } });
    assert.equal(await flight, false);
    assert.equal(f.c._dbDirty, true);
    assert.equal(f.c._dbPushBusy, false);
    assert.equal(f.c._recCloud.probe, undefined);
    assert.match(f.c._recStatusText(r.id), /Sync pending/);
    assert.ok([...f.timers.values()].some(timer => timer.delay === 4000));
    pass('failed upload keeps unsynced work queued for retry');
  }

  for (const changed of ['disconnect', 'board', 'client']) {
    const f = fixture(source), r = f.record();
    const writes = f.connect(); f.c._recSave(r.id);
    const flight = f.c._dbFlush();
    if (changed === 'disconnect') { f.c._db = null; f.c._dbCfg = null; }
    else if (changed === 'board') f.c._dbCfg.board = 'other-board';
    else f.connect();
    writes[0].resolve({ error: null });
    await flight;
    assert.equal(f.c._recCloud.probe, undefined);
    assert.doesNotMatch(f.c._recStatusText(r.id), / · Synced /);
    pass('an upload completed after a ' + changed + ' change cannot certify the current connection');
  }

  {
    const f = fixture(source), r = f.record();
    r.mod = 3; f.c._recCloudAck({ probe: { mod: 3 } });
    f.c._recCloudAck({ probe: { mod: 2 } });
    assert.equal(f.c._recCloud.probe.mod, 3);
    pass('out-of-order acknowledgements do not replace a newer cloud receipt');
  }

  {
    const f = fixture(source), r = f.record();
    const writes = f.connect();
    const pull = f.c.dbPullOnce();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(writes.length, 1);
    assert.equal(writes[0].payload.id, 'probe-board');
    writes[0].resolve({ error: { message: 'Row-level security denied insert' } });
    assert.equal(await pull, false);
    assert.equal(f.c._recCloud[r.id], undefined);
    assert.equal(f.c._dbState, 'error');
    assert.match(f.c._dbMsg, /Row-level security denied insert/);
    pass('first-device seed error returns false and never claims cloud acknowledgement');
  }

  {
    const f = fixture(source), r = f.record();
    r.ids = ['ID-A', 'ID-B'];
    r.idMeta = { 'ID-A': { title: 'Selected customer' }, 'ID-B': { title: 'Excluded customer' } };
    r.people = [{ rid: 'contact-a', name: 'Selected contact', xid: 'ID-A', email: 'selected@example.test' },
      { rid: 'contact-b', name: 'Excluded contact', xid: 'ID-B' }];
    r.notes = [{ rid: 'note-a', text: 'Selected note', xid: 'ID-A' },
      { rid: 'note-b', text: 'Excluded note', xid: 'ID-B' },
      { rid: 'note-free', text: 'Unfiled note', xid: '' }];
    r.links = [{ label: 'Excluded type', url: 'https://example.test', xid: 'ID-A' }];
    f.c.RECORDS.other = { v: 1, id: 'other', ids: [], mod: 1,
      people: [], specs: [], notes: [{ text: 'Excluded installation', xid: 'ID-A' }], links: [] };
    const before = JSON.stringify(f.c.RECORDS);
    const rows = [{ id: 'probe' }, { id: 'other' }];
    const filter = { siteId: 'probe', xid: 'ID-A', kinds: ['people', 'notes'] };
    const snapshot = f.c._xpRecordSnapshot(rows, filter);
    assert.deepEqual(Object.keys(snapshot), ['probe']);
    assert.equal(snapshot.probe.people.length, 1);
    assert.equal(snapshot.probe.notes.length, 1);
    assert.equal(snapshot.probe.links.length, 0);
    assert.deepEqual(Array.from(snapshot.probe.ids), ['ID-A']);
    assert.deepEqual(Object.keys(snapshot.probe.idMeta), ['ID-A']);
    assert.doesNotMatch(JSON.stringify(snapshot), /Excluded|Unfiled/);
    snapshot.probe.people[0].email = 'modified@example.test';
    snapshot.probe.notes.splice(0, 1);
    snapshot.probe.idMeta['ID-A'].title = 'Modified title';
    snapshot.probe.ids.push('NEW-ID');
    assert.equal(JSON.stringify(f.c.RECORDS), before);
    const unfiled = f.c._xpRecordSnapshot(rows, { siteId: 'probe', xid: '', kinds: ['notes'] });
    assert.equal(unfiled.probe.notes[0].text, 'Unfiled note');
    assert.equal(unfiled.probe.ids.length, 0);
    assert.equal(Object.keys(unfiled.probe.idMeta).length, 0);
    assert.equal(Object.keys(f.c._xpRecordSnapshot(rows, { none: true })).length, 0);
    assert.equal(Object.keys(f.c._xpRecordSnapshot(rows, { kinds: [] })).length, 0);
    pass('export site, ID and section filters exclude other data and metadata; snapshots are deep copies');
  }

  {
    const f = fixture(source), r = f.record();
    r.ids = ['__proto__'];
    r.idMeta = JSON.parse('{"__proto__":{"title":"Literal tracking code"}}');
    r.notes = [{ text: 'Code is user data', xid: '__proto__' }];
    const snapshot = f.c._xpRecordSnapshot([{ id: 'probe' }], { xid: '__proto__', kinds: ['notes'] });
    const restored = JSON.parse(JSON.stringify(snapshot));
    assert.deepEqual(Object.keys(restored.probe.idMeta), ['__proto__']);
    assert.equal(restored.probe.idMeta.__proto__.title, 'Literal tracking code');
    pass('selected export preserves literal prototype-like ID titles through JSON');
  }

  {
    const f = fixture(source), r = f.record();
    r.ids = ['ID-A']; r.idMeta = { 'ID-A': { title: '<Customer> & renewal' } };
    r.people = [{ rid: 'contact-a', name: '<Contact>', role: 'G-6 & S-6', org: '<Section>',
      email: 'contact@example.test', phone: '+1 202 555 0100', primary: true,
      xid: 'ID-A', orgId: 'unit-a', updated: 1000 }];
    r.notes = [{ rid: 'note-a', text: 'First line\n<script>alert(1)</script>', pinned: true,
      xid: 'ID-A', updated: 1000 }];
    const filter = { siteId: 'probe', xid: 'ID-A', kinds: ['people', 'notes'] };
    const snapshot = { selection: { id: 'elsewhere' }, extras: {
      records: f.c._xpRecordSnapshot([{ id: 'probe' }], filter), recordFilter: filter,
      recordNames: { probe: '<Installation>' }, recordOrgNames: { 'unit-a': '<Unit> & command' },
    } };
    const body = f.c._xpRecordBody(snapshot);
    for (const expected of ['Contacts (1)', 'contact@example.test', '+1 202 555 0100',
      'Primary contact', 'G-6 &amp; S-6', '&lt;Section&gt;', '&lt;Customer&gt; &amp; renewal',
      '&lt;Unit&gt; &amp; command', '&lt;Installation&gt;', 'Installation-wide', 'Pinned note',
      'First line\n&lt;script&gt;alert(1)&lt;/script&gt;', 'Updated ']) {
      assert.ok(body.includes(expected), 'Human export lost: ' + expected);
    }
    assert.doesNotMatch(body, /<script>|<Contact>|<Unit>|<Customer>|<Installation>/);
    pass('human-readable export keeps contact fields, ID title, ownership, note pin/date and escaped multiline text');
  }

  log('UX PERSISTENCE / EXPORT PASS (' + checks + ')');
  return { checks };
}

module.exports = { run, sourceFunction, fixture };
if (require.main === module) run().catch(error => {
  console.error('UX PERSISTENCE FAIL: ' + error.stack);
  process.exitCode = 1;
});
