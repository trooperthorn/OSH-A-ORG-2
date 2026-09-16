# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.3.0** — 721,337 bytes, 10,836 lines, 348 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5151–8206 | 194.8 KB |
| s7-records | 8207–9686 | 80.2 KB |
| <style> — all CSS | 173–1292 | 72.7 KB |
| m5-markers | 3014–4215 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2089–2095 | 49.0 KB |
| s5-clocks | 9980–10836 | 46.6 KB |
| s3-search | 4603–5150 | 28.9 KB |
| m2-render | 2315–2598 | 24.7 KB |
| CHANGELOG (in-file release ledger) | 1764–2088 | 22.6 KB |
| m6-mapdata | 4216–4602 | 19.8 KB |
| s6-export | 9687–9979 | 18.7 KB |
| m3-input | 2599–2865 | 16.1 KB |
| <body> — markup | 1602–1762 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1427–1582 | 10.8 KB |
| m4-camera | 2866–3013 | 9.8 KB |
| m1-geom | 2171–2314 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1293–1397 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2096–2170 | 3.6 KB |
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
| 1763 | <script> — the application | boundary |
| 1764 | CHANGELOG (in-file release ledger) | prose |
| 2089 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2096 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2171 | m1-geom | module |
| 2315 | m2-render | module |
| 2599 | m3-input | module |
| 2866 | m4-camera | module |
| 3014 | m5-markers | module |
| 4216 | m6-mapdata | module |
| 4603 | s3-search | module |
| 5151 | s4-dossier | module |
| 8207 | s7-records | module |
| 9687 | s6-export | module |
| 9980 | s5-clocks | module |

## Functions by section

### 1764 · CHANGELOG (in-file release ledger)

- `1996` **APP_VERSION**
- `1997` **APP_UPDATED**

### 2089 · DATA: SITES literal (inline copy of data/sites.json)

- `2089` **SITES**

### 2096 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2096` **A1ORGS**
- `2139` `_ogBuild()`
- `2152` `orgOf(id)`
- `2153` `ogKids(id)`
- `2154` `ogEffSite(id)`
- `2155` `ogAtSite(siteId)`
- `2157` `ogPrimary(siteId)`
- `2162` `ogChainUp(id)`

### 2171 · m1-geom

- `2220` `_qMul(a,b)`
- `2230` `_qNorm(q)`
- `2232` `_qFromAxisAngle(ax,ay,az,ang)`
- `2236` `lonLatToVec(lon, lat)`
- `2244` `_setGlobeRot(rotLon, rotLat)`
- `2257` `_projectLonLat(lon, lat, m)`
- `2268` `_projectVec(v, m)`
- `2281` `_visibleLonLat(lon, lat, tol)`
- `2291` `globeMetrics(cv)`
- `2303` `_ringXYZ(ring)`

### 2315 · m2-render

- `2368` **GLOBE_FALLBACK_RINGS**
- `2369` **GLOBE_RINGS**
- `2371` **GLOBE_STATE_RINGS**
- `2372` **GLOBE_SHORE_RINGS**
- `2376` **US_STATES**
- `2403` **GLOBE_STATE_SHAPES**
- `2406` **GLOBE_COUNTRY_RINGS**
- `2414` `startGlobeLoop(cv)`
- `2447` `drawGlobe(cv, ctx)`
- `2518` `latRing(lat)`
- `2520` `lonRing(lon)`
- `2522` `drawGlobePath(ctx,m,ring,fill)`
- `2573` `_smoothRing(r, iters)`
- `2589` `smoothFallbackOnce()`

### 2599 · m3-input

- `2663` `globeMark()`
- `2667` `_rebuildGlobeQ()`
- `2676` `_faceLonLatAngles(lon,lat)`
- `2684` `setupGlobeInteraction(cv)`
- `2856` `globeGlideStep(dt)`

### 2866 · m4-camera

- `2962` `cameraCancel()`
- `2975` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3014 · m5-markers

- `3120` `_sitesArr()`
- `3124` `_siteIndex()`
- `3138` `siteById(id)`
- `3149` **CLS_META**
- `3156` `clsOf(id)`
- `3170` `_disc(id, title, bodyHtml, opts)`
- `3195` `_famOffSet()`
- `3208` **LY_MODES**
- `3215` `lyCounts()`
- `3220` `lyShown(off)`
- `3221` `lyModeN(m)`
- `3222` `lyKey()`
- `3229` `lySync()`
- `3244` `_lyRingPaint()`
- `3273` `lyRing(open)`
- `3283` `lyMode(k)`
- `3288` `lyFam(k)`
- `3292` `lyView(v)`
- `3300` `_lyEnsure(id)`
- `3312` `_shPaneLay()`
- `3351` `renderLegend()`
- `3365` `_cssRGB(c, fb)`
- `3376` `_mTok()`
- `3403` `_syncSelArcs(selId)`
- `3472` `_selSyncCheck()`
- `3484` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3522` `drawGlobeLinks(ctx, m)`
- `3547` `_gChromeZones(m)`
- `3573` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3600` `drawGlobeMarkers(ctx, m)`
- `3799` `_glowDot(ctx, x, y, fd, k)`
- `3814` **BF_STREAMS**
- `3829` `_bfNodeLbl(nd)`
- `3830` `_bfAbbr(name)`
- `3846` `_bfFanShort(lbls)`
- `3865` **BF_STAR**
- `3866` `_bfStarKind(n)`
- `3881` `_bfParentOf(id)`
- `3888` `_briefChainMap(opts)`
- `3943` `drawBriefStates(ctx, m, labels)`
- `4037` `_hexTrip(hex)`
- `4043` `drawBriefArcs(ctx, m)`
- `4063` `drawBriefNodes(ctx, m)`
- `4184` `drawMarkersHook(ctx, m)`
- `4207` `siteHitTest(x, y)`

### 4216 · m6-mapdata

- `4287` `_fetchRetry(src, tries)`
- `4300` `_basemapLoad()`
- `4306` `_basemapNetUp()`
- `4312` `loadGlobeCoastlinesHi()`
- `4339` `loadStateBorders()`
- `4370` `_albersUsaInvert(x, y)`
- `4389` `_ringsLookGeographic(rings)`
- `4412` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4457` `_topoSingleUse(topo, objName, projInvert)`
- `4481` `_shoreHarvest()`
- `4519` `loadCountryBorders()`
- `4543` `_decodeTopoLonLat(topo, objName)`
- `4557` `decodeTopoLand(topo)`
- `4583` `_namedStateShapes(topo, geographic)`

### 4603 · s3-search

- `4729` `_srEsc(s)`
- `4730` `_srEscA(v)`
- `4733` `_srFold(s)`
- `4743` `_searchEntries()`
- `4792` `buildSearchIndex()`
- `4796` `_srUserEntries()`
- `4841` `_srBriefEntries()`
- `4852` `sfsResults(q)`
- `4896` `_srFuse()`
- `4903` `sfsRender(res)`
- `4907` `_sfsPaint(res)`
- `4939` `_srRefresh()`
- `4948` `searchSelect(id)`
- `5071` `_sfsField()`
- `5075` `_isSearchField(t)`
- `5123` `initSearch()`
- `5145` `_srInjectCSS()`

### 5151 · s4-dossier

- `5292` `_odEsc(s)`
- `5293` `_odEscA(v)`
- `5307` `_camSnap()`
- `5311` `_camApply(st, o)`
- `5333` `_undoPush()`
- `5352` `tpLive()`
- `5359` `tpSync()`
- `5371` `tpZoom(dir, ramp)`
- `5385` `tpUndo()`
- `5390` `tpClear()`
- `5391` `_tpStop(e)`
- `5398` `_tpRamp()`
- `5403` `_tpWire()`
- `5427` `selectSite(id, o)`
- `5476` `setMode(m)`
- `5516` `renderBrief(view)`
- `5705` `_bdSync()`
- `5717` `_bfTint(hex)`
- `5731` `_bfLeaderTrack()`
- `5778` `_bfFlipCapture(el)`
- `5790` `_bfFlipPlay(el, old)`
- `5827` `_bfSceneDepth()`
- `5831` `_bfViewCapture(point)`
- `5842` `_bfMirrorFit(w,t,L)`
- `5851` `_bfFit(view)`
- `5882` `_bfZoomTo(value,point,finish)`
- `5893` `_bfNavPush()`
- `5901` `bfBack()`
- `5919` `bfPresent(on)`
- `5942` `_bfHistArm()`
- `5982` `_bfFlyFocus()`
- `6008` `_bfExplore(k)`
- `6019` `_bfChartWire(el)`
- `6134` `_trailPush(id)`
- `6142` `_trailClear()`
- `6153` `_flyFitChain()`
- `6185` `_clearBand()`
- `6205` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6219` `_flyPair(aLat,aLon,bLat,bLon)`
- `6237` `clearAll()`
- `6272` `_trailRender()`
- `6279` `tapAtScreen(x, y)`
- `6327` `showDossier(id)`
- `6351` `_sheetFlag()`
- `6358` `hideDossier()`
- `6386` **RC_KINDS**
- `6392` `_odSetTab(t)`
- `6401` `_odRender(s)`
- `6522` `calloutShow(id, at)`
- `6531` `calloutHide()`
- `6536` `_coRefresh()`
- `6537` `_coRender()`
- `6756` `_coAnchor()`
- `6775` `_coPlace()`
- `6816` `_bfPickFoot()`
- `6828` `_bfToast(msg)`
- `6922` **BF_PALETTE**
- `6928` `_bfArmHint()`
- `6939` `_bfTakeParent(fallback)`
- `6951` `_bfPickCandidates(pk,q,kind)`
- `6976` `_bfAddSheet(pk)`
- `7031` `_bfGroupSheet(pk)`
- `7061` **BF_PLACES**
- `7075` `bfPlaceOf(k)`
- `7087` `_bfBranchPlan(rootId, cap)`
- `7103` `bfAddBranch(rootId)`
- `7121` `bfAddMany(ids, parent)`
- `7153` `_bfSelections(k)`
- `7202` `_bfAddUnderBtn(k)`
- `7211` `_bfInvHTML(k)`
- `7236` `_bfPlainSheet(k)`
- `7290` `_bfObjSheet(id)`
- `7418` `_rcContext(id)`
- `7419` `_rcTitle(r,x)`
- `7420` `_rcLabel(id,x)`
- `7421` `_rcRefresh()`
- `7427` `_rcResume(id)`
- `7431` `_rcStart(kind,rid)`
- `7439` `recordURL(value)`
- `7444` `recordCopy(value)`
- `7448` `_rcActions(kind,it)`
- `7460` `_rcCard(id,kind,it)`
- `7472` `_rcOptions(id,cur,allowNew)`
- `7476` `_rcIdPane(id)`
- `7485` `_rcRender(id)`
- `7514` `_rcFormHTML(kind,it,rid)`
- `7533` `_rcFit()`
- `7542` `_rcReadForm()`
- `7549` `_rcCommit()`
- `7568` `_rcDelete(rid)`
- `7575` `_rcUndoDelete()`
- `7584` `_rcOpen(id,rid,xid)`
- `7613` `_odStageClearSync(on)`
- `8113` `initDossier()`
- `8127` `_odInjectCSS()`

### 8207 · s7-records

- `8217` **RECORDS**
- `8220` `_recBlank(id)`
- `8221` `_recFingerprint(value)`
- `8224` `_recNormalize(r)`
- `8248` `recordOf(id)`
- `8249` `recAll()`
- `8250` `_recIndex(r,kind,index)`
- `8251` `_recRid()`
- `8252` `recCount(id)`
- `8259` `_recPersist(r)`
- `8270` `_recSave(id)`
- `8277` `_recStatusText(id)`
- `8287` `recordSaveStatus(id)`
- `8290` `_recStatusPaint()`
- `8293` `_recCloudAck(records)`
- `8297` `_recLoaded(r)`
- `8300` `recAdd(id, kind, item)`
- `8307` `recUpdate(id, kind, idx, item)`
- `8313` `recRemove(id, kind, idx)`
- `8322` `recIds(id)`
- `8323` `_recNextId(id)`
- `8328` `recAddId(id, label)`
- `8338` `recTitleId(id,label,title)`
- `8342` `recDelId(id, label)`
- `8351` `recIdCount(id, label)`
- `8357` `_rdbOpen()`
- `8505` **BRIEF**
- `8507` `_bfSync()`
- `8512` `_bfSave()`
- `8525` `_bfInvClean(a)`
- `8531` `bfNode(k)`
- `8532` `bfKids(k)`
- `8535` `_bfOrgId(id)`
- `8541` `bfHas(id)`
- `8543` `_bfStateKey(name)`
- `8544` `bfStateName(k)`
- `8549` `_bfFrame()`
- `8573` `_xpPulse()`
- `8585` `_bfPush(node)`
- `8596` `bfAdd(id, parent)`
- `8610` `bfAddState(name, parent)`
- `8619` `bfAddCustom(name, parent)`
- `8626` `bfRename(k, name)`
- `8633` `bfRemove(id)`
- `8649` `bfMove(k, newParent)`
- `8663` `bfPlace(k, targetK, after)`
- `8677` `bfReorder(k, dir)`
- `8690` `bfColor(k, hex)`
- `8700` `bfColorTree(k, hex)`
- `8712` `bfStripe(k)`
- `8718` `bfNote(id, text)`
- `8733` `_bfStackPopHide()`
- `8734` `_bfStackPop(lvl)`
- `8770` `bfStack(n)`
- `8779` `bfEye(rootId)`
- `8787` `bfDepth(n)`
- `8810` `_ssTick()`
- `8830` **ORGS**
- `8831` `_orgSave()`
- `8832` `orgById(id)`
- `8833` `orgKidsOf(pid)`
- `8834` `orgAdd(name, parent, base)`
- `8850` `orgRemove(id)`
- `8866` **SAVEDV**
- `8868` `_svSave()`
- `8882` `_shId(r, save)`
- `8886` `_shList(kind)`
- `8887` `_shFind(kind,id)`
- `8894` `_shTrim(A)`
- `8904` `_shScope(v)`
- `8915` `_shGlyph(kind,r)`
- `8931` `_shRow(kind,r,P,i)`
- `8960` `_shPaneShelf(kind,P)`
- `9008` `_shOpen(tab)`
- `9043` `_svOpenSheet()`
- `9044` `svCapture(name)`
- `9055` `svUpdate()`
- `9063` `svRename(id,n)`
- `9067` `svPin(id)`
- `9068` `svRecall(id)`
- `9078` `svRemove(id)`
- `9093` **SAVEDB**
- `9095` `_sbSave()`
- `9100` `sbCapture(name)`
- `9119` `sbUpdate()`
- `9129` `sbLoad(i)`
- `9145` `sbRename(id,n)`
- `9149` `sbPin(id)`
- `9150` `sbRemove(i)`
- `9162` `_sbOpenSheet()`
- `9175` `_lgSiteName(id)`
- `9180` `_ldCounts(c)`
- `9188` `_ldItem(kind,it,id)`
- `9200` `_ldSet(t)`
- `9202` `_ldTabs()`
- `9209` `_ledgerHTML()`
- `9253` `_ledgerEl()`
- `9265` `_ledgerRender()`
- `9269` `_ledgerOpen()`
- `9274` `_ledgerClose()`
- `9275` `_repoDoorSync(open)`
- `9278` `_ledgerTap(e)`
- `9290` `_ledgerPaint()`
- `9296` `recBackup()`
- `9300` `recRestore(obj)`
- `9333` **DB_TABLE**
- `9334` `_dbSetState(st, msg)`
- `9344` `_dbCfgSave(cfg)`
- `9348` `_dbIsNet(e)`
- `9355` `_dbWhy(what, e)`
- `9361` `ensureSupabase()`
- `9388` `_dbFetch(input, init)`
- `9394` `_dbSnapshot()`
- `9403` `_dbApply(data)`
- `9452` `_dbChipShow()`
- `9478` `dbPush()`
- `9485` `_dbFlush()`
- `9510` `_dbRetryArm()`
- `9517` `dbPullOnce()`
- `9536` `_dbConnectRun()`
- `9576` `dbConnect()`
- `9588` `_dbAutoBoot()`
- `9598` `dbDisconnect(silent)`
- `9612` `_dbNetUp(why)`
- `9624` `_dbHideFlush()`
- `9632` `_netUp(why)`
- `9649` `_dbSheet()`

### 9687 · s6-export

- `9699` `buildSnapshot(scope, recordFilter)`
- `9760` `_xpRecordSnapshot(rows,filter)`
- `9777` `_xpRecordChoices()`
- `9796` `_xpRecordIds()`
- `9805` `_xpReadFilter()`
- `9812` `_xpRecordBody(sn)`
- `9843` `_xpDownload(name, mime, data)`
- `9852` `_xpStamp()`
- `9854` `_xpSlug(sn)`
- `9857` `exportPNG()`
- `9877` `_xpDossierBody(sn)`
- `9932` `exportPDF(recordFilter)`
- `9942` `exportHTML(recordFilter)`
- `9953` `exportJSON(recordFilter)`

### 9980 · s5-clocks

- `10032` `_tzAbbr(tz, d)`
- `10040` `_ledTime(tz, d, secs)`
- `10050` `civilianTime(tz, d)`
- `10061` `_ckEsc(v)`
- `10064` **CLOCK_REGIONS**
- `10082` `_selSave()`
- `10102` `nearRegion(lat, lon)`
- `10151` `_tzForSite(site)`
- `10160` `autoFillSelect(site)`
- `10169` `pickZone(tz, label)`
- `10178` `tickClocks()`
- `10200` `_ckBeat()`
- `10211` `_ckArm()`
- `10217` `_ckWake()`
- `10225` `_tzOpenSheet()`
- `10253` `initClocks()`
- `10285` `bootShell()`
- `10652` `_bootPaint(ctx, m)`
- `10734` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
