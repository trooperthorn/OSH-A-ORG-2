# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.0.0** — 702,911 bytes, 10,541 lines, 343 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5069–7928 | 183.6 KB |
| s7-records | 7929–9391 | 79.5 KB |
| <style> — all CSS | 173–1272 | 71.2 KB |
| m5-markers | 2932–4133 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2007–2013 | 49.0 KB |
| s5-clocks | 9685–10541 | 46.6 KB |
| s3-search | 4521–5068 | 28.9 KB |
| m2-render | 2233–2516 | 24.7 KB |
| m6-mapdata | 4134–4520 | 19.8 KB |
| s6-export | 9392–9684 | 18.7 KB |
| CHANGELOG (in-file release ledger) | 1744–2006 | 18.0 KB |
| m3-input | 2517–2783 | 16.1 KB |
| <body> — markup | 1582–1742 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1407–1562 | 10.8 KB |
| m4-camera | 2784–2931 | 9.8 KB |
| m1-geom | 2089–2232 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1273–1377 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2014–2088 | 3.6 KB |
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
| 2007 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2014 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2089 | m1-geom | module |
| 2233 | m2-render | module |
| 2517 | m3-input | module |
| 2784 | m4-camera | module |
| 2932 | m5-markers | module |
| 4134 | m6-mapdata | module |
| 4521 | s3-search | module |
| 5069 | s4-dossier | module |
| 7929 | s7-records | module |
| 9392 | s6-export | module |
| 9685 | s5-clocks | module |

## Functions by section

### 1744 · CHANGELOG (in-file release ledger)

- `1914` **APP_VERSION**
- `1915` **APP_UPDATED**

### 2007 · DATA: SITES literal (inline copy of data/sites.json)

- `2007` **SITES**

### 2014 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2014` **A1ORGS**
- `2057` `_ogBuild()`
- `2070` `orgOf(id)`
- `2071` `ogKids(id)`
- `2072` `ogEffSite(id)`
- `2073` `ogAtSite(siteId)`
- `2075` `ogPrimary(siteId)`
- `2080` `ogChainUp(id)`

### 2089 · m1-geom

- `2138` `_qMul(a,b)`
- `2148` `_qNorm(q)`
- `2150` `_qFromAxisAngle(ax,ay,az,ang)`
- `2154` `lonLatToVec(lon, lat)`
- `2162` `_setGlobeRot(rotLon, rotLat)`
- `2175` `_projectLonLat(lon, lat, m)`
- `2186` `_projectVec(v, m)`
- `2199` `_visibleLonLat(lon, lat, tol)`
- `2209` `globeMetrics(cv)`
- `2221` `_ringXYZ(ring)`

### 2233 · m2-render

- `2286` **GLOBE_FALLBACK_RINGS**
- `2287` **GLOBE_RINGS**
- `2289` **GLOBE_STATE_RINGS**
- `2290` **GLOBE_SHORE_RINGS**
- `2294` **US_STATES**
- `2321` **GLOBE_STATE_SHAPES**
- `2324` **GLOBE_COUNTRY_RINGS**
- `2332` `startGlobeLoop(cv)`
- `2365` `drawGlobe(cv, ctx)`
- `2436` `latRing(lat)`
- `2438` `lonRing(lon)`
- `2440` `drawGlobePath(ctx,m,ring,fill)`
- `2491` `_smoothRing(r, iters)`
- `2507` `smoothFallbackOnce()`

### 2517 · m3-input

- `2581` `globeMark()`
- `2585` `_rebuildGlobeQ()`
- `2594` `_faceLonLatAngles(lon,lat)`
- `2602` `setupGlobeInteraction(cv)`
- `2774` `globeGlideStep(dt)`

### 2784 · m4-camera

- `2880` `cameraCancel()`
- `2893` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2932 · m5-markers

- `3038` `_sitesArr()`
- `3042` `_siteIndex()`
- `3056` `siteById(id)`
- `3067` **CLS_META**
- `3074` `clsOf(id)`
- `3088` `_disc(id, title, bodyHtml, opts)`
- `3113` `_famOffSet()`
- `3126` **LY_MODES**
- `3133` `lyCounts()`
- `3138` `lyShown(off)`
- `3139` `lyModeN(m)`
- `3140` `lyKey()`
- `3147` `lySync()`
- `3162` `_lyRingPaint()`
- `3191` `lyRing(open)`
- `3201` `lyMode(k)`
- `3206` `lyFam(k)`
- `3210` `lyView(v)`
- `3218` `_lyEnsure(id)`
- `3230` `_shPaneLay()`
- `3269` `renderLegend()`
- `3283` `_cssRGB(c, fb)`
- `3294` `_mTok()`
- `3321` `_syncSelArcs(selId)`
- `3390` `_selSyncCheck()`
- `3402` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3440` `drawGlobeLinks(ctx, m)`
- `3465` `_gChromeZones(m)`
- `3491` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3518` `drawGlobeMarkers(ctx, m)`
- `3717` `_glowDot(ctx, x, y, fd, k)`
- `3732` **BF_STREAMS**
- `3747` `_bfNodeLbl(nd)`
- `3748` `_bfAbbr(name)`
- `3764` `_bfFanShort(lbls)`
- `3783` **BF_STAR**
- `3784` `_bfStarKind(n)`
- `3799` `_bfParentOf(id)`
- `3806` `_briefChainMap(opts)`
- `3861` `drawBriefStates(ctx, m, labels)`
- `3955` `_hexTrip(hex)`
- `3961` `drawBriefArcs(ctx, m)`
- `3981` `drawBriefNodes(ctx, m)`
- `4102` `drawMarkersHook(ctx, m)`
- `4125` `siteHitTest(x, y)`

### 4134 · m6-mapdata

- `4205` `_fetchRetry(src, tries)`
- `4218` `_basemapLoad()`
- `4224` `_basemapNetUp()`
- `4230` `loadGlobeCoastlinesHi()`
- `4257` `loadStateBorders()`
- `4288` `_albersUsaInvert(x, y)`
- `4307` `_ringsLookGeographic(rings)`
- `4330` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4375` `_topoSingleUse(topo, objName, projInvert)`
- `4399` `_shoreHarvest()`
- `4437` `loadCountryBorders()`
- `4461` `_decodeTopoLonLat(topo, objName)`
- `4475` `decodeTopoLand(topo)`
- `4501` `_namedStateShapes(topo, geographic)`

### 4521 · s3-search

- `4647` `_srEsc(s)`
- `4648` `_srEscA(v)`
- `4651` `_srFold(s)`
- `4661` `_searchEntries()`
- `4710` `buildSearchIndex()`
- `4714` `_srUserEntries()`
- `4759` `_srBriefEntries()`
- `4770` `sfsResults(q)`
- `4814` `_srFuse()`
- `4821` `sfsRender(res)`
- `4825` `_sfsPaint(res)`
- `4857` `_srRefresh()`
- `4866` `searchSelect(id)`
- `4989` `_sfsField()`
- `4993` `_isSearchField(t)`
- `5041` `initSearch()`
- `5063` `_srInjectCSS()`

### 5069 · s4-dossier

- `5210` `_odEsc(s)`
- `5211` `_odEscA(v)`
- `5225` `_camSnap()`
- `5229` `_camApply(st, o)`
- `5251` `_undoPush()`
- `5270` `tpLive()`
- `5277` `tpSync()`
- `5289` `tpZoom(dir, ramp)`
- `5303` `tpUndo()`
- `5308` `tpClear()`
- `5309` `_tpStop(e)`
- `5316` `_tpRamp()`
- `5321` `_tpWire()`
- `5345` `selectSite(id, o)`
- `5394` `setMode(m)`
- `5433` `renderBrief(view)`
- `5621` `_bdSync()`
- `5633` `_bfTint(hex)`
- `5647` `_bfLeaderTrack()`
- `5694` `_bfFlipCapture(el)`
- `5706` `_bfFlipPlay(el, old)`
- `5743` `_bfSceneDepth()`
- `5747` `_bfViewCapture(point)`
- `5755` `_bfFit(view)`
- `5785` `_bfZoomTo(value,point,finish)`
- `5796` `_bfNavPush()`
- `5804` `bfBack()`
- `5822` `bfPresent(on)`
- `5845` `_bfHistArm()`
- `5877` `_bfExplore(k)`
- `5887` `_bfChartWire(el)`
- `5923` `_trailPush(id)`
- `5931` `_trailClear()`
- `5942` `_flyFitChain()`
- `5974` `_clearBand()`
- `5994` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6008` `_flyPair(aLat,aLon,bLat,bLon)`
- `6026` `clearAll()`
- `6061` `_trailRender()`
- `6068` `tapAtScreen(x, y)`
- `6115` `showDossier(id)`
- `6139` `_sheetFlag()`
- `6146` `hideDossier()`
- `6174` **RC_KINDS**
- `6180` `_odSetTab(t)`
- `6189` `_odRender(s)`
- `6310` `calloutShow(id, at)`
- `6319` `calloutHide()`
- `6324` `_coRefresh()`
- `6325` `_coRender()`
- `6544` `_coAnchor()`
- `6563` `_coPlace()`
- `6604` `_bfPickFoot()`
- `6616` `_bfToast(msg)`
- `6710` **BF_PALETTE**
- `6716` `_bfArmHint()`
- `6727` `_bfTakeParent(fallback)`
- `6739` `_bfPickCandidates(pk,q,kind)`
- `6764` `_bfAddSheet(pk)`
- `6811` `_bfGroupSheet(pk)`
- `6841` **BF_PLACES**
- `6855` `bfPlaceOf(k)`
- `6858` `bfAddMany(ids, parent)`
- `6890` `_bfSelections(k)`
- `6939` `_bfAddUnderBtn(k)`
- `6948` `_bfInvHTML(k)`
- `6973` `_bfPlainSheet(k)`
- `7027` `_bfObjSheet(id)`
- `7155` `_rcContext(id)`
- `7156` `_rcTitle(r,x)`
- `7157` `_rcLabel(id,x)`
- `7158` `_rcRefresh()`
- `7164` `_rcResume(id)`
- `7168` `_rcStart(kind,rid)`
- `7176` `recordURL(value)`
- `7181` `recordCopy(value)`
- `7185` `_rcActions(kind,it)`
- `7197` `_rcCard(id,kind,it)`
- `7209` `_rcOptions(id,cur,allowNew)`
- `7213` `_rcIdPane(id)`
- `7222` `_rcRender(id)`
- `7251` `_rcFormHTML(kind,it,rid)`
- `7270` `_rcFit()`
- `7279` `_rcReadForm()`
- `7286` `_rcCommit()`
- `7305` `_rcDelete(rid)`
- `7312` `_rcUndoDelete()`
- `7321` `_rcOpen(id,rid,xid)`
- `7350` `_odStageClearSync(on)`
- `7835` `initDossier()`
- `7849` `_odInjectCSS()`

### 7929 · s7-records

- `7939` **RECORDS**
- `7942` `_recBlank(id)`
- `7943` `_recFingerprint(value)`
- `7946` `_recNormalize(r)`
- `7970` `recordOf(id)`
- `7971` `recAll()`
- `7972` `_recIndex(r,kind,index)`
- `7973` `_recRid()`
- `7974` `recCount(id)`
- `7981` `_recPersist(r)`
- `7992` `_recSave(id)`
- `7999` `_recStatusText(id)`
- `8009` `recordSaveStatus(id)`
- `8012` `_recStatusPaint()`
- `8015` `_recCloudAck(records)`
- `8019` `_recLoaded(r)`
- `8022` `recAdd(id, kind, item)`
- `8029` `recUpdate(id, kind, idx, item)`
- `8035` `recRemove(id, kind, idx)`
- `8044` `recIds(id)`
- `8045` `_recNextId(id)`
- `8050` `recAddId(id, label)`
- `8060` `recTitleId(id,label,title)`
- `8064` `recDelId(id, label)`
- `8073` `recIdCount(id, label)`
- `8079` `_rdbOpen()`
- `8227` **BRIEF**
- `8229` `_bfSync()`
- `8234` `_bfSave()`
- `8247` `_bfInvClean(a)`
- `8253` `bfNode(k)`
- `8254` `bfKids(k)`
- `8257` `_bfOrgId(id)`
- `8263` `bfHas(id)`
- `8265` `_bfStateKey(name)`
- `8266` `bfStateName(k)`
- `8271` `_bfFrame()`
- `8295` `_xpPulse()`
- `8307` `_bfPush(node)`
- `8318` `bfAdd(id, parent)`
- `8332` `bfAddState(name, parent)`
- `8341` `bfAddCustom(name, parent)`
- `8348` `bfRename(k, name)`
- `8355` `bfRemove(id)`
- `8371` `bfMove(k, newParent)`
- `8384` `bfReorder(k, dir)`
- `8397` `bfColor(k, hex)`
- `8407` `bfColorTree(k, hex)`
- `8419` `bfStripe(k)`
- `8425` `bfNote(id, text)`
- `8440` `_bfStackPopHide()`
- `8441` `_bfStackPop(lvl)`
- `8477` `bfStack(n)`
- `8486` `bfEye(rootId)`
- `8494` `bfDepth(n)`
- `8515` `_ssTick()`
- `8535` **ORGS**
- `8536` `_orgSave()`
- `8537` `orgById(id)`
- `8538` `orgKidsOf(pid)`
- `8539` `orgAdd(name, parent, base)`
- `8555` `orgRemove(id)`
- `8571` **SAVEDV**
- `8573` `_svSave()`
- `8587` `_shId(r, save)`
- `8591` `_shList(kind)`
- `8592` `_shFind(kind,id)`
- `8599` `_shTrim(A)`
- `8609` `_shScope(v)`
- `8620` `_shGlyph(kind,r)`
- `8636` `_shRow(kind,r,P,i)`
- `8665` `_shPaneShelf(kind,P)`
- `8713` `_shOpen(tab)`
- `8748` `_svOpenSheet()`
- `8749` `svCapture(name)`
- `8760` `svUpdate()`
- `8768` `svRename(id,n)`
- `8772` `svPin(id)`
- `8773` `svRecall(id)`
- `8783` `svRemove(id)`
- `8798` **SAVEDB**
- `8800` `_sbSave()`
- `8805` `sbCapture(name)`
- `8824` `sbUpdate()`
- `8834` `sbLoad(i)`
- `8850` `sbRename(id,n)`
- `8854` `sbPin(id)`
- `8855` `sbRemove(i)`
- `8867` `_sbOpenSheet()`
- `8880` `_lgSiteName(id)`
- `8885` `_ldCounts(c)`
- `8893` `_ldItem(kind,it,id)`
- `8905` `_ldSet(t)`
- `8907` `_ldTabs()`
- `8914` `_ledgerHTML()`
- `8958` `_ledgerEl()`
- `8970` `_ledgerRender()`
- `8974` `_ledgerOpen()`
- `8979` `_ledgerClose()`
- `8980` `_repoDoorSync(open)`
- `8983` `_ledgerTap(e)`
- `8995` `_ledgerPaint()`
- `9001` `recBackup()`
- `9005` `recRestore(obj)`
- `9038` **DB_TABLE**
- `9039` `_dbSetState(st, msg)`
- `9049` `_dbCfgSave(cfg)`
- `9053` `_dbIsNet(e)`
- `9060` `_dbWhy(what, e)`
- `9066` `ensureSupabase()`
- `9093` `_dbFetch(input, init)`
- `9099` `_dbSnapshot()`
- `9108` `_dbApply(data)`
- `9157` `_dbChipShow()`
- `9183` `dbPush()`
- `9190` `_dbFlush()`
- `9215` `_dbRetryArm()`
- `9222` `dbPullOnce()`
- `9241` `_dbConnectRun()`
- `9281` `dbConnect()`
- `9293` `_dbAutoBoot()`
- `9303` `dbDisconnect(silent)`
- `9317` `_dbNetUp(why)`
- `9329` `_dbHideFlush()`
- `9337` `_netUp(why)`
- `9354` `_dbSheet()`

### 9392 · s6-export

- `9404` `buildSnapshot(scope, recordFilter)`
- `9465` `_xpRecordSnapshot(rows,filter)`
- `9482` `_xpRecordChoices()`
- `9501` `_xpRecordIds()`
- `9510` `_xpReadFilter()`
- `9517` `_xpRecordBody(sn)`
- `9548` `_xpDownload(name, mime, data)`
- `9557` `_xpStamp()`
- `9559` `_xpSlug(sn)`
- `9562` `exportPNG()`
- `9582` `_xpDossierBody(sn)`
- `9637` `exportPDF(recordFilter)`
- `9647` `exportHTML(recordFilter)`
- `9658` `exportJSON(recordFilter)`

### 9685 · s5-clocks

- `9737` `_tzAbbr(tz, d)`
- `9745` `_ledTime(tz, d, secs)`
- `9755` `civilianTime(tz, d)`
- `9766` `_ckEsc(v)`
- `9769` **CLOCK_REGIONS**
- `9787` `_selSave()`
- `9807` `nearRegion(lat, lon)`
- `9856` `_tzForSite(site)`
- `9865` `autoFillSelect(site)`
- `9874` `pickZone(tz, label)`
- `9883` `tickClocks()`
- `9905` `_ckBeat()`
- `9916` `_ckArm()`
- `9922` `_ckWake()`
- `9930` `_tzOpenSheet()`
- `9958` `initClocks()`
- `9990` `bootShell()`
- `10357` `_bootPaint(ctx, m)`
- `10439` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
