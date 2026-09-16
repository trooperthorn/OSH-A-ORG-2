# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.4.0** — 741,260 bytes, 11,052 lines, 358 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5175–8230 | 194.8 KB |
| s7-records | 8231–9710 | 80.2 KB |
| <style> — all CSS | 173–1292 | 72.7 KB |
| m5-markers | 3038–4239 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2113–2119 | 49.0 KB |
| s5-clocks | 10196–11052 | 46.6 KB |
| s6-export | 9711–10195 | 36.3 KB |
| s3-search | 4627–5174 | 28.9 KB |
| m2-render | 2339–2622 | 24.7 KB |
| CHANGELOG (in-file release ledger) | 1766–2112 | 24.2 KB |
| m6-mapdata | 4240–4626 | 19.8 KB |
| m3-input | 2623–2889 | 16.1 KB |
| <body> — markup | 1602–1764 | 13.2 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1427–1582 | 10.8 KB |
| m4-camera | 2890–3037 | 9.8 KB |
| m1-geom | 2195–2338 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1293–1397 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2120–2194 | 3.6 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1293 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1398 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1427 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1583 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1591 | <style> — all CSS | boundary |
| 1602 | <body> — markup | boundary |
| 1765 | <script> — the application | boundary |
| 1766 | CHANGELOG (in-file release ledger) | prose |
| 2113 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2120 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2195 | m1-geom | module |
| 2339 | m2-render | module |
| 2623 | m3-input | module |
| 2890 | m4-camera | module |
| 3038 | m5-markers | module |
| 4240 | m6-mapdata | module |
| 4627 | s3-search | module |
| 5175 | s4-dossier | module |
| 8231 | s7-records | module |
| 9711 | s6-export | module |
| 10196 | s5-clocks | module |

## Functions by section

### 1766 · CHANGELOG (in-file release ledger)

- `2020` **APP_VERSION**
- `2021` **APP_UPDATED**

### 2113 · DATA: SITES literal (inline copy of data/sites.json)

- `2113` **SITES**

### 2120 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2120` **A1ORGS**
- `2163` `_ogBuild()`
- `2176` `orgOf(id)`
- `2177` `ogKids(id)`
- `2178` `ogEffSite(id)`
- `2179` `ogAtSite(siteId)`
- `2181` `ogPrimary(siteId)`
- `2186` `ogChainUp(id)`

### 2195 · m1-geom

- `2244` `_qMul(a,b)`
- `2254` `_qNorm(q)`
- `2256` `_qFromAxisAngle(ax,ay,az,ang)`
- `2260` `lonLatToVec(lon, lat)`
- `2268` `_setGlobeRot(rotLon, rotLat)`
- `2281` `_projectLonLat(lon, lat, m)`
- `2292` `_projectVec(v, m)`
- `2305` `_visibleLonLat(lon, lat, tol)`
- `2315` `globeMetrics(cv)`
- `2327` `_ringXYZ(ring)`

### 2339 · m2-render

- `2392` **GLOBE_FALLBACK_RINGS**
- `2393` **GLOBE_RINGS**
- `2395` **GLOBE_STATE_RINGS**
- `2396` **GLOBE_SHORE_RINGS**
- `2400` **US_STATES**
- `2427` **GLOBE_STATE_SHAPES**
- `2430` **GLOBE_COUNTRY_RINGS**
- `2438` `startGlobeLoop(cv)`
- `2471` `drawGlobe(cv, ctx)`
- `2542` `latRing(lat)`
- `2544` `lonRing(lon)`
- `2546` `drawGlobePath(ctx,m,ring,fill)`
- `2597` `_smoothRing(r, iters)`
- `2613` `smoothFallbackOnce()`

### 2623 · m3-input

- `2687` `globeMark()`
- `2691` `_rebuildGlobeQ()`
- `2700` `_faceLonLatAngles(lon,lat)`
- `2708` `setupGlobeInteraction(cv)`
- `2880` `globeGlideStep(dt)`

### 2890 · m4-camera

- `2986` `cameraCancel()`
- `2999` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3038 · m5-markers

- `3144` `_sitesArr()`
- `3148` `_siteIndex()`
- `3162` `siteById(id)`
- `3173` **CLS_META**
- `3180` `clsOf(id)`
- `3194` `_disc(id, title, bodyHtml, opts)`
- `3219` `_famOffSet()`
- `3232` **LY_MODES**
- `3239` `lyCounts()`
- `3244` `lyShown(off)`
- `3245` `lyModeN(m)`
- `3246` `lyKey()`
- `3253` `lySync()`
- `3268` `_lyRingPaint()`
- `3297` `lyRing(open)`
- `3307` `lyMode(k)`
- `3312` `lyFam(k)`
- `3316` `lyView(v)`
- `3324` `_lyEnsure(id)`
- `3336` `_shPaneLay()`
- `3375` `renderLegend()`
- `3389` `_cssRGB(c, fb)`
- `3400` `_mTok()`
- `3427` `_syncSelArcs(selId)`
- `3496` `_selSyncCheck()`
- `3508` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3546` `drawGlobeLinks(ctx, m)`
- `3571` `_gChromeZones(m)`
- `3597` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3624` `drawGlobeMarkers(ctx, m)`
- `3823` `_glowDot(ctx, x, y, fd, k)`
- `3838` **BF_STREAMS**
- `3853` `_bfNodeLbl(nd)`
- `3854` `_bfAbbr(name)`
- `3870` `_bfFanShort(lbls)`
- `3889` **BF_STAR**
- `3890` `_bfStarKind(n)`
- `3905` `_bfParentOf(id)`
- `3912` `_briefChainMap(opts)`
- `3967` `drawBriefStates(ctx, m, labels)`
- `4061` `_hexTrip(hex)`
- `4067` `drawBriefArcs(ctx, m)`
- `4087` `drawBriefNodes(ctx, m)`
- `4208` `drawMarkersHook(ctx, m)`
- `4231` `siteHitTest(x, y)`

### 4240 · m6-mapdata

- `4311` `_fetchRetry(src, tries)`
- `4324` `_basemapLoad()`
- `4330` `_basemapNetUp()`
- `4336` `loadGlobeCoastlinesHi()`
- `4363` `loadStateBorders()`
- `4394` `_albersUsaInvert(x, y)`
- `4413` `_ringsLookGeographic(rings)`
- `4436` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4481` `_topoSingleUse(topo, objName, projInvert)`
- `4505` `_shoreHarvest()`
- `4543` `loadCountryBorders()`
- `4567` `_decodeTopoLonLat(topo, objName)`
- `4581` `decodeTopoLand(topo)`
- `4607` `_namedStateShapes(topo, geographic)`

### 4627 · s3-search

- `4753` `_srEsc(s)`
- `4754` `_srEscA(v)`
- `4757` `_srFold(s)`
- `4767` `_searchEntries()`
- `4816` `buildSearchIndex()`
- `4820` `_srUserEntries()`
- `4865` `_srBriefEntries()`
- `4876` `sfsResults(q)`
- `4920` `_srFuse()`
- `4927` `sfsRender(res)`
- `4931` `_sfsPaint(res)`
- `4963` `_srRefresh()`
- `4972` `searchSelect(id)`
- `5095` `_sfsField()`
- `5099` `_isSearchField(t)`
- `5147` `initSearch()`
- `5169` `_srInjectCSS()`

### 5175 · s4-dossier

- `5316` `_odEsc(s)`
- `5317` `_odEscA(v)`
- `5331` `_camSnap()`
- `5335` `_camApply(st, o)`
- `5357` `_undoPush()`
- `5376` `tpLive()`
- `5383` `tpSync()`
- `5395` `tpZoom(dir, ramp)`
- `5409` `tpUndo()`
- `5414` `tpClear()`
- `5415` `_tpStop(e)`
- `5422` `_tpRamp()`
- `5427` `_tpWire()`
- `5451` `selectSite(id, o)`
- `5500` `setMode(m)`
- `5540` `renderBrief(view)`
- `5729` `_bdSync()`
- `5741` `_bfTint(hex)`
- `5755` `_bfLeaderTrack()`
- `5802` `_bfFlipCapture(el)`
- `5814` `_bfFlipPlay(el, old)`
- `5851` `_bfSceneDepth()`
- `5855` `_bfViewCapture(point)`
- `5866` `_bfMirrorFit(w,t,L)`
- `5875` `_bfFit(view)`
- `5906` `_bfZoomTo(value,point,finish)`
- `5917` `_bfNavPush()`
- `5925` `bfBack()`
- `5943` `bfPresent(on)`
- `5966` `_bfHistArm()`
- `6006` `_bfFlyFocus()`
- `6032` `_bfExplore(k)`
- `6043` `_bfChartWire(el)`
- `6158` `_trailPush(id)`
- `6166` `_trailClear()`
- `6177` `_flyFitChain()`
- `6209` `_clearBand()`
- `6229` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6243` `_flyPair(aLat,aLon,bLat,bLon)`
- `6261` `clearAll()`
- `6296` `_trailRender()`
- `6303` `tapAtScreen(x, y)`
- `6351` `showDossier(id)`
- `6375` `_sheetFlag()`
- `6382` `hideDossier()`
- `6410` **RC_KINDS**
- `6416` `_odSetTab(t)`
- `6425` `_odRender(s)`
- `6546` `calloutShow(id, at)`
- `6555` `calloutHide()`
- `6560` `_coRefresh()`
- `6561` `_coRender()`
- `6780` `_coAnchor()`
- `6799` `_coPlace()`
- `6840` `_bfPickFoot()`
- `6852` `_bfToast(msg)`
- `6946` **BF_PALETTE**
- `6952` `_bfArmHint()`
- `6963` `_bfTakeParent(fallback)`
- `6975` `_bfPickCandidates(pk,q,kind)`
- `7000` `_bfAddSheet(pk)`
- `7055` `_bfGroupSheet(pk)`
- `7085` **BF_PLACES**
- `7099` `bfPlaceOf(k)`
- `7111` `_bfBranchPlan(rootId, cap)`
- `7127` `bfAddBranch(rootId)`
- `7145` `bfAddMany(ids, parent)`
- `7177` `_bfSelections(k)`
- `7226` `_bfAddUnderBtn(k)`
- `7235` `_bfInvHTML(k)`
- `7260` `_bfPlainSheet(k)`
- `7314` `_bfObjSheet(id)`
- `7442` `_rcContext(id)`
- `7443` `_rcTitle(r,x)`
- `7444` `_rcLabel(id,x)`
- `7445` `_rcRefresh()`
- `7451` `_rcResume(id)`
- `7455` `_rcStart(kind,rid)`
- `7463` `recordURL(value)`
- `7468` `recordCopy(value)`
- `7472` `_rcActions(kind,it)`
- `7484` `_rcCard(id,kind,it)`
- `7496` `_rcOptions(id,cur,allowNew)`
- `7500` `_rcIdPane(id)`
- `7509` `_rcRender(id)`
- `7538` `_rcFormHTML(kind,it,rid)`
- `7557` `_rcFit()`
- `7566` `_rcReadForm()`
- `7573` `_rcCommit()`
- `7592` `_rcDelete(rid)`
- `7599` `_rcUndoDelete()`
- `7608` `_rcOpen(id,rid,xid)`
- `7637` `_odStageClearSync(on)`
- `8137` `initDossier()`
- `8151` `_odInjectCSS()`

### 8231 · s7-records

- `8241` **RECORDS**
- `8244` `_recBlank(id)`
- `8245` `_recFingerprint(value)`
- `8248` `_recNormalize(r)`
- `8272` `recordOf(id)`
- `8273` `recAll()`
- `8274` `_recIndex(r,kind,index)`
- `8275` `_recRid()`
- `8276` `recCount(id)`
- `8283` `_recPersist(r)`
- `8294` `_recSave(id)`
- `8301` `_recStatusText(id)`
- `8311` `recordSaveStatus(id)`
- `8314` `_recStatusPaint()`
- `8317` `_recCloudAck(records)`
- `8321` `_recLoaded(r)`
- `8324` `recAdd(id, kind, item)`
- `8331` `recUpdate(id, kind, idx, item)`
- `8337` `recRemove(id, kind, idx)`
- `8346` `recIds(id)`
- `8347` `_recNextId(id)`
- `8352` `recAddId(id, label)`
- `8362` `recTitleId(id,label,title)`
- `8366` `recDelId(id, label)`
- `8375` `recIdCount(id, label)`
- `8381` `_rdbOpen()`
- `8529` **BRIEF**
- `8531` `_bfSync()`
- `8536` `_bfSave()`
- `8549` `_bfInvClean(a)`
- `8555` `bfNode(k)`
- `8556` `bfKids(k)`
- `8559` `_bfOrgId(id)`
- `8565` `bfHas(id)`
- `8567` `_bfStateKey(name)`
- `8568` `bfStateName(k)`
- `8573` `_bfFrame()`
- `8597` `_xpPulse()`
- `8609` `_bfPush(node)`
- `8620` `bfAdd(id, parent)`
- `8634` `bfAddState(name, parent)`
- `8643` `bfAddCustom(name, parent)`
- `8650` `bfRename(k, name)`
- `8657` `bfRemove(id)`
- `8673` `bfMove(k, newParent)`
- `8687` `bfPlace(k, targetK, after)`
- `8701` `bfReorder(k, dir)`
- `8714` `bfColor(k, hex)`
- `8724` `bfColorTree(k, hex)`
- `8736` `bfStripe(k)`
- `8742` `bfNote(id, text)`
- `8757` `_bfStackPopHide()`
- `8758` `_bfStackPop(lvl)`
- `8794` `bfStack(n)`
- `8803` `bfEye(rootId)`
- `8811` `bfDepth(n)`
- `8834` `_ssTick()`
- `8854` **ORGS**
- `8855` `_orgSave()`
- `8856` `orgById(id)`
- `8857` `orgKidsOf(pid)`
- `8858` `orgAdd(name, parent, base)`
- `8874` `orgRemove(id)`
- `8890` **SAVEDV**
- `8892` `_svSave()`
- `8906` `_shId(r, save)`
- `8910` `_shList(kind)`
- `8911` `_shFind(kind,id)`
- `8918` `_shTrim(A)`
- `8928` `_shScope(v)`
- `8939` `_shGlyph(kind,r)`
- `8955` `_shRow(kind,r,P,i)`
- `8984` `_shPaneShelf(kind,P)`
- `9032` `_shOpen(tab)`
- `9067` `_svOpenSheet()`
- `9068` `svCapture(name)`
- `9079` `svUpdate()`
- `9087` `svRename(id,n)`
- `9091` `svPin(id)`
- `9092` `svRecall(id)`
- `9102` `svRemove(id)`
- `9117` **SAVEDB**
- `9119` `_sbSave()`
- `9124` `sbCapture(name)`
- `9143` `sbUpdate()`
- `9153` `sbLoad(i)`
- `9169` `sbRename(id,n)`
- `9173` `sbPin(id)`
- `9174` `sbRemove(i)`
- `9186` `_sbOpenSheet()`
- `9199` `_lgSiteName(id)`
- `9204` `_ldCounts(c)`
- `9212` `_ldItem(kind,it,id)`
- `9224` `_ldSet(t)`
- `9226` `_ldTabs()`
- `9233` `_ledgerHTML()`
- `9277` `_ledgerEl()`
- `9289` `_ledgerRender()`
- `9293` `_ledgerOpen()`
- `9298` `_ledgerClose()`
- `9299` `_repoDoorSync(open)`
- `9302` `_ledgerTap(e)`
- `9314` `_ledgerPaint()`
- `9320` `recBackup()`
- `9324` `recRestore(obj)`
- `9357` **DB_TABLE**
- `9358` `_dbSetState(st, msg)`
- `9368` `_dbCfgSave(cfg)`
- `9372` `_dbIsNet(e)`
- `9379` `_dbWhy(what, e)`
- `9385` `ensureSupabase()`
- `9412` `_dbFetch(input, init)`
- `9418` `_dbSnapshot()`
- `9427` `_dbApply(data)`
- `9476` `_dbChipShow()`
- `9502` `dbPush()`
- `9509` `_dbFlush()`
- `9534` `_dbRetryArm()`
- `9541` `dbPullOnce()`
- `9560` `_dbConnectRun()`
- `9600` `dbConnect()`
- `9612` `_dbAutoBoot()`
- `9622` `dbDisconnect(silent)`
- `9636` `_dbNetUp(why)`
- `9648` `_dbHideFlush()`
- `9656` `_netUp(why)`
- `9673` `_dbSheet()`

### 9711 · s6-export

- `9723` `buildSnapshot(scope, recordFilter)`
- `9784` `_xpRecordSnapshot(rows,filter)`
- `9801` `_xpRecordChoices()`
- `9820` `_xpRecordIds()`
- `9829` `_xpReadFilter()`
- `9836` `_xpRecordBody(sn)`
- `9867` `_xpDownload(name, mime, data)`
- `9876` `_xpStamp()`
- `9878` `_xpSlug(sn)`
- `9894` `_zipStore(parts)`
- `9915` `_pkx(v)`
- `9916` `_pkHex(c)`
- `9917` `_pkInk(hex)`
- `9921` `_deckLayout(C, roots)`
- `9936` `_deckChartXML(C, roots, title, ids)`
- `9970` `_deckSlideXML(inner)`
- `9977` `_pptxParts()`
- `10059` `_pptxBuild()`
- `10060` `xpPptx()`
- `10072` `exportPNG()`
- `10092` `_xpDossierBody(sn)`
- `10147` `exportPDF(recordFilter)`
- `10157` `exportHTML(recordFilter)`
- `10168` `exportJSON(recordFilter)`

### 10196 · s5-clocks

- `10248` `_tzAbbr(tz, d)`
- `10256` `_ledTime(tz, d, secs)`
- `10266` `civilianTime(tz, d)`
- `10277` `_ckEsc(v)`
- `10280` **CLOCK_REGIONS**
- `10298` `_selSave()`
- `10318` `nearRegion(lat, lon)`
- `10367` `_tzForSite(site)`
- `10376` `autoFillSelect(site)`
- `10385` `pickZone(tz, label)`
- `10394` `tickClocks()`
- `10416` `_ckBeat()`
- `10427` `_ckArm()`
- `10433` `_ckWake()`
- `10441` `_tzOpenSheet()`
- `10469` `initClocks()`
- `10501` `bootShell()`
- `10868` `_bootPaint(ctx, m)`
- `10950` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `_pptxParts` · `_pptxBuild` · `xpPptx` · `_zipCRC` · `_zipStore` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#rId1` · `#snapshot`
