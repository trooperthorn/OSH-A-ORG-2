# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v1.29.0** — 883,408 bytes, 10,415 lines, 342 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| DATA: A1ORGS literal (inline copy of data/orgs.json) | 1967–2021 | 187.4 KB |
| s4-dossier | 5002–7816 | 180.3 KB |
| s7-records | 7817–9265 | 78.8 KB |
| <style> — all CSS | 173–1272 | 71.2 KB |
| m5-markers | 2865–4066 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 1960–1966 | 49.0 KB |
| s5-clocks | 9559–10415 | 46.6 KB |
| s3-search | 4454–5001 | 28.9 KB |
| m2-render | 2166–2449 | 24.7 KB |
| m6-mapdata | 4067–4453 | 19.8 KB |
| s6-export | 9266–9558 | 18.7 KB |
| m3-input | 2450–2716 | 16.1 KB |
| CHANGELOG (in-file release ledger) | 1744–1959 | 14.5 KB |
| <body> — markup | 1582–1742 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1407–1562 | 10.8 KB |
| m4-camera | 2717–2864 | 9.8 KB |
| m1-geom | 2022–2165 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1273–1377 | 7.4 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1273 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1378 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1407 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1563 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1571 | <style> — all CSS | boundary |
| 1582 | <body> — markup | boundary |
| 1743 | <script> — the application | boundary |
| 1744 | CHANGELOG (in-file release ledger) | prose |
| 1960 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 1967 | DATA: A1ORGS literal (inline copy of data/orgs.json) | data |
| 2022 | m1-geom | module |
| 2166 | m2-render | module |
| 2450 | m3-input | module |
| 2717 | m4-camera | module |
| 2865 | m5-markers | module |
| 4067 | m6-mapdata | module |
| 4454 | s3-search | module |
| 5002 | s4-dossier | module |
| 7817 | s7-records | module |
| 9266 | s6-export | module |
| 9559 | s5-clocks | module |

## Functions by section

### 1744 · CHANGELOG (in-file release ledger)

- `1867` **APP_VERSION**
- `1868` **APP_UPDATED**

### 1960 · DATA: SITES literal (inline copy of data/sites.json)

- `1960` **SITES**

### 1967 · DATA: A1ORGS literal (inline copy of data/orgs.json)

- `1967` **A1ORGS**
- `1990` `_ogBuild()`
- `2003` `orgOf(id)`
- `2004` `ogKids(id)`
- `2005` `ogEffSite(id)`
- `2006` `ogAtSite(siteId)`
- `2008` `ogPrimary(siteId)`
- `2013` `ogChainUp(id)`

### 2022 · m1-geom

- `2071` `_qMul(a,b)`
- `2081` `_qNorm(q)`
- `2083` `_qFromAxisAngle(ax,ay,az,ang)`
- `2087` `lonLatToVec(lon, lat)`
- `2095` `_setGlobeRot(rotLon, rotLat)`
- `2108` `_projectLonLat(lon, lat, m)`
- `2119` `_projectVec(v, m)`
- `2132` `_visibleLonLat(lon, lat, tol)`
- `2142` `globeMetrics(cv)`
- `2154` `_ringXYZ(ring)`

### 2166 · m2-render

- `2219` **GLOBE_FALLBACK_RINGS**
- `2220` **GLOBE_RINGS**
- `2222` **GLOBE_STATE_RINGS**
- `2223` **GLOBE_SHORE_RINGS**
- `2227` **US_STATES**
- `2254` **GLOBE_STATE_SHAPES**
- `2257` **GLOBE_COUNTRY_RINGS**
- `2265` `startGlobeLoop(cv)`
- `2298` `drawGlobe(cv, ctx)`
- `2369` `latRing(lat)`
- `2371` `lonRing(lon)`
- `2373` `drawGlobePath(ctx,m,ring,fill)`
- `2424` `_smoothRing(r, iters)`
- `2440` `smoothFallbackOnce()`

### 2450 · m3-input

- `2514` `globeMark()`
- `2518` `_rebuildGlobeQ()`
- `2527` `_faceLonLatAngles(lon,lat)`
- `2535` `setupGlobeInteraction(cv)`
- `2707` `globeGlideStep(dt)`

### 2717 · m4-camera

- `2813` `cameraCancel()`
- `2826` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2865 · m5-markers

- `2971` `_sitesArr()`
- `2975` `_siteIndex()`
- `2989` `siteById(id)`
- `3000` **CLS_META**
- `3007` `clsOf(id)`
- `3021` `_disc(id, title, bodyHtml, opts)`
- `3046` `_famOffSet()`
- `3059` **LY_MODES**
- `3066` `lyCounts()`
- `3071` `lyShown(off)`
- `3072` `lyModeN(m)`
- `3073` `lyKey()`
- `3080` `lySync()`
- `3095` `_lyRingPaint()`
- `3124` `lyRing(open)`
- `3134` `lyMode(k)`
- `3139` `lyFam(k)`
- `3143` `lyView(v)`
- `3151` `_lyEnsure(id)`
- `3163` `_shPaneLay()`
- `3202` `renderLegend()`
- `3216` `_cssRGB(c, fb)`
- `3227` `_mTok()`
- `3254` `_syncSelArcs(selId)`
- `3323` `_selSyncCheck()`
- `3335` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3373` `drawGlobeLinks(ctx, m)`
- `3398` `_gChromeZones(m)`
- `3424` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3451` `drawGlobeMarkers(ctx, m)`
- `3650` `_glowDot(ctx, x, y, fd, k)`
- `3665` **BF_STREAMS**
- `3680` `_bfNodeLbl(nd)`
- `3681` `_bfAbbr(name)`
- `3697` `_bfFanShort(lbls)`
- `3716` **BF_STAR**
- `3717` `_bfStarKind(n)`
- `3732` `_bfParentOf(id)`
- `3739` `_briefChainMap(opts)`
- `3794` `drawBriefStates(ctx, m, labels)`
- `3888` `_hexTrip(hex)`
- `3894` `drawBriefArcs(ctx, m)`
- `3914` `drawBriefNodes(ctx, m)`
- `4035` `drawMarkersHook(ctx, m)`
- `4058` `siteHitTest(x, y)`

### 4067 · m6-mapdata

- `4138` `_fetchRetry(src, tries)`
- `4151` `_basemapLoad()`
- `4157` `_basemapNetUp()`
- `4163` `loadGlobeCoastlinesHi()`
- `4190` `loadStateBorders()`
- `4221` `_albersUsaInvert(x, y)`
- `4240` `_ringsLookGeographic(rings)`
- `4263` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4308` `_topoSingleUse(topo, objName, projInvert)`
- `4332` `_shoreHarvest()`
- `4370` `loadCountryBorders()`
- `4394` `_decodeTopoLonLat(topo, objName)`
- `4408` `decodeTopoLand(topo)`
- `4434` `_namedStateShapes(topo, geographic)`

### 4454 · s3-search

- `4580` `_srEsc(s)`
- `4581` `_srEscA(v)`
- `4584` `_srFold(s)`
- `4594` `_searchEntries()`
- `4643` `buildSearchIndex()`
- `4647` `_srUserEntries()`
- `4692` `_srBriefEntries()`
- `4703` `sfsResults(q)`
- `4747` `_srFuse()`
- `4754` `sfsRender(res)`
- `4758` `_sfsPaint(res)`
- `4790` `_srRefresh()`
- `4799` `searchSelect(id)`
- `4922` `_sfsField()`
- `4926` `_isSearchField(t)`
- `4974` `initSearch()`
- `4996` `_srInjectCSS()`

### 5002 · s4-dossier

- `5143` `_odEsc(s)`
- `5144` `_odEscA(v)`
- `5158` `_camSnap()`
- `5162` `_camApply(st, o)`
- `5184` `_undoPush()`
- `5203` `tpLive()`
- `5210` `tpSync()`
- `5222` `tpZoom(dir, ramp)`
- `5236` `tpUndo()`
- `5241` `tpClear()`
- `5242` `_tpStop(e)`
- `5249` `_tpRamp()`
- `5254` `_tpWire()`
- `5278` `selectSite(id, o)`
- `5326` `setMode(m)`
- `5365` `renderBrief(view)`
- `5553` `_bdSync()`
- `5565` `_bfTint(hex)`
- `5579` `_bfLeaderTrack()`
- `5626` `_bfFlipCapture(el)`
- `5638` `_bfFlipPlay(el, old)`
- `5675` `_bfSceneDepth()`
- `5679` `_bfViewCapture(point)`
- `5687` `_bfFit(view)`
- `5717` `_bfZoomTo(value,point,finish)`
- `5728` `_bfNavPush()`
- `5736` `bfBack()`
- `5754` `bfPresent(on)`
- `5777` `_bfHistArm()`
- `5809` `_bfExplore(k)`
- `5819` `_bfChartWire(el)`
- `5855` `_trailPush(id)`
- `5863` `_trailClear()`
- `5874` `_flyFitChain()`
- `5906` `_clearBand()`
- `5926` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `5940` `_flyPair(aLat,aLon,bLat,bLon)`
- `5958` `clearAll()`
- `5993` `_trailRender()`
- `6000` `tapAtScreen(x, y)`
- `6039` `showDossier(id)`
- `6063` `_sheetFlag()`
- `6070` `hideDossier()`
- `6098` **RC_KINDS**
- `6104` `_odSetTab(t)`
- `6113` `_odRender(s)`
- `6234` `calloutShow(id, at)`
- `6243` `calloutHide()`
- `6248` `_coRefresh()`
- `6249` `_coRender()`
- `6459` `_coAnchor()`
- `6478` `_coPlace()`
- `6519` `_bfPickFoot()`
- `6531` `_bfToast(msg)`
- `6625` **BF_PALETTE**
- `6631` `_bfArmHint()`
- `6642` `_bfTakeParent(fallback)`
- `6654` `_bfPickCandidates(pk,q,kind)`
- `6679` `_bfAddSheet(pk)`
- `6719` `_bfGroupSheet(pk)`
- `6749` **BF_PLACES**
- `6763` `bfPlaceOf(k)`
- `6766` `bfAddMany(ids, parent)`
- `6798` `_bfSelections(k)`
- `6839` `_bfAddUnderBtn(k)`
- `6848` `_bfInvHTML(k)`
- `6873` `_bfPlainSheet(k)`
- `6927` `_bfObjSheet(id)`
- `7055` `_rcContext(id)`
- `7056` `_rcTitle(r,x)`
- `7057` `_rcLabel(id,x)`
- `7058` `_rcRefresh()`
- `7064` `_rcResume(id)`
- `7068` `_rcStart(kind,rid)`
- `7076` `recordURL(value)`
- `7081` `recordCopy(value)`
- `7085` `_rcActions(kind,it)`
- `7097` `_rcCard(id,kind,it)`
- `7109` `_rcOptions(id,cur,allowNew)`
- `7113` `_rcIdPane(id)`
- `7122` `_rcRender(id)`
- `7151` `_rcFormHTML(kind,it,rid)`
- `7170` `_rcFit()`
- `7179` `_rcReadForm()`
- `7186` `_rcCommit()`
- `7205` `_rcDelete(rid)`
- `7212` `_rcUndoDelete()`
- `7221` `_rcOpen(id,rid,xid)`
- `7250` `_odStageClearSync(on)`
- `7723` `initDossier()`
- `7737` `_odInjectCSS()`

### 7817 · s7-records

- `7827` **RECORDS**
- `7830` `_recBlank(id)`
- `7831` `_recFingerprint(value)`
- `7834` `_recNormalize(r)`
- `7858` `recordOf(id)`
- `7859` `recAll()`
- `7860` `_recIndex(r,kind,index)`
- `7861` `_recRid()`
- `7862` `recCount(id)`
- `7869` `_recPersist(r)`
- `7880` `_recSave(id)`
- `7887` `_recStatusText(id)`
- `7897` `recordSaveStatus(id)`
- `7900` `_recStatusPaint()`
- `7903` `_recCloudAck(records)`
- `7907` `_recLoaded(r)`
- `7910` `recAdd(id, kind, item)`
- `7917` `recUpdate(id, kind, idx, item)`
- `7923` `recRemove(id, kind, idx)`
- `7932` `recIds(id)`
- `7933` `_recNextId(id)`
- `7938` `recAddId(id, label)`
- `7948` `recTitleId(id,label,title)`
- `7952` `recDelId(id, label)`
- `7961` `recIdCount(id, label)`
- `7967` `_rdbOpen()`
- `8115` **BRIEF**
- `8117` `_bfSync()`
- `8122` `_bfSave()`
- `8135` `_bfInvClean(a)`
- `8141` `bfNode(k)`
- `8142` `bfKids(k)`
- `8145` `_bfOrgId(id)`
- `8151` `bfHas(id)`
- `8153` `_bfStateKey(name)`
- `8154` `bfStateName(k)`
- `8159` `_bfFrame()`
- `8183` `_xpPulse()`
- `8195` `_bfPush(node)`
- `8206` `bfAdd(id, parent)`
- `8220` `bfAddState(name, parent)`
- `8229` `bfAddCustom(name, parent)`
- `8236` `bfRename(k, name)`
- `8243` `bfRemove(id)`
- `8259` `bfMove(k, newParent)`
- `8272` `bfReorder(k, dir)`
- `8285` `bfColor(k, hex)`
- `8293` `bfStripe(k)`
- `8299` `bfNote(id, text)`
- `8314` `_bfStackPopHide()`
- `8315` `_bfStackPop(lvl)`
- `8351` `bfStack(n)`
- `8360` `bfEye(rootId)`
- `8368` `bfDepth(n)`
- `8389` `_ssTick()`
- `8409` **ORGS**
- `8410` `_orgSave()`
- `8411` `orgById(id)`
- `8412` `orgKidsOf(pid)`
- `8413` `orgAdd(name, parent, base)`
- `8429` `orgRemove(id)`
- `8445` **SAVEDV**
- `8447` `_svSave()`
- `8461` `_shId(r, save)`
- `8465` `_shList(kind)`
- `8466` `_shFind(kind,id)`
- `8473` `_shTrim(A)`
- `8483` `_shScope(v)`
- `8494` `_shGlyph(kind,r)`
- `8510` `_shRow(kind,r,P,i)`
- `8539` `_shPaneShelf(kind,P)`
- `8587` `_shOpen(tab)`
- `8622` `_svOpenSheet()`
- `8623` `svCapture(name)`
- `8634` `svUpdate()`
- `8642` `svRename(id,n)`
- `8646` `svPin(id)`
- `8647` `svRecall(id)`
- `8657` `svRemove(id)`
- `8672` **SAVEDB**
- `8674` `_sbSave()`
- `8679` `sbCapture(name)`
- `8698` `sbUpdate()`
- `8708` `sbLoad(i)`
- `8724` `sbRename(id,n)`
- `8728` `sbPin(id)`
- `8729` `sbRemove(i)`
- `8741` `_sbOpenSheet()`
- `8754` `_lgSiteName(id)`
- `8759` `_ldCounts(c)`
- `8767` `_ldItem(kind,it,id)`
- `8779` `_ldSet(t)`
- `8781` `_ldTabs()`
- `8788` `_ledgerHTML()`
- `8832` `_ledgerEl()`
- `8844` `_ledgerRender()`
- `8848` `_ledgerOpen()`
- `8853` `_ledgerClose()`
- `8854` `_repoDoorSync(open)`
- `8857` `_ledgerTap(e)`
- `8869` `_ledgerPaint()`
- `8875` `recBackup()`
- `8879` `recRestore(obj)`
- `8912` **DB_TABLE**
- `8913` `_dbSetState(st, msg)`
- `8923` `_dbCfgSave(cfg)`
- `8927` `_dbIsNet(e)`
- `8934` `_dbWhy(what, e)`
- `8940` `ensureSupabase()`
- `8967` `_dbFetch(input, init)`
- `8973` `_dbSnapshot()`
- `8982` `_dbApply(data)`
- `9031` `_dbChipShow()`
- `9057` `dbPush()`
- `9064` `_dbFlush()`
- `9089` `_dbRetryArm()`
- `9096` `dbPullOnce()`
- `9115` `_dbConnectRun()`
- `9155` `dbConnect()`
- `9167` `_dbAutoBoot()`
- `9177` `dbDisconnect(silent)`
- `9191` `_dbNetUp(why)`
- `9203` `_dbHideFlush()`
- `9211` `_netUp(why)`
- `9228` `_dbSheet()`

### 9266 · s6-export

- `9278` `buildSnapshot(scope, recordFilter)`
- `9339` `_xpRecordSnapshot(rows,filter)`
- `9356` `_xpRecordChoices()`
- `9375` `_xpRecordIds()`
- `9384` `_xpReadFilter()`
- `9391` `_xpRecordBody(sn)`
- `9422` `_xpDownload(name, mime, data)`
- `9431` `_xpStamp()`
- `9433` `_xpSlug(sn)`
- `9436` `exportPNG()`
- `9456` `_xpDossierBody(sn)`
- `9511` `exportPDF(recordFilter)`
- `9521` `exportHTML(recordFilter)`
- `9532` `exportJSON(recordFilter)`

### 9559 · s5-clocks

- `9611` `_tzAbbr(tz, d)`
- `9619` `_ledTime(tz, d, secs)`
- `9629` `civilianTime(tz, d)`
- `9640` `_ckEsc(v)`
- `9643` **CLOCK_REGIONS**
- `9661` `_selSave()`
- `9681` `nearRegion(lat, lon)`
- `9730` `_tzForSite(site)`
- `9739` `autoFillSelect(site)`
- `9748` `pickZone(tz, label)`
- `9757` `tickClocks()`
- `9779` `_ckBeat()`
- `9790` `_ckArm()`
- `9796` `_ckWake()`
- `9804` `_tzOpenSheet()`
- `9832` `initClocks()`
- `9864` `bootShell()`
- `10231` `_bootPaint(ctx, m)`
- `10313` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
