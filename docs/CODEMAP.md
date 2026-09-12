# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v1.27.0** — 911,854 bytes, 10,202 lines, 338 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| DATA: A1ORGS literal (inline copy of data/orgs.json) | 1899–1932 | 226.3 KB |
| s4-dossier | 4913–7605 | 174.2 KB |
| s7-records | 7606–9052 | 78.7 KB |
| <style> — all CSS | 173–1235 | 68.9 KB |
| m5-markers | 2776–3977 | 65.2 KB |
| CHANGELOG (in-file release ledger) | 1690–1898 | 62.4 KB |
| s5-clocks | 9346–10202 | 46.6 KB |
| s3-search | 4365–4912 | 28.9 KB |
| m2-render | 2077–2360 | 24.7 KB |
| m6-mapdata | 3978–4364 | 19.8 KB |
| s6-export | 9053–9345 | 18.7 KB |
| m3-input | 2361–2627 | 16.1 KB |
| <body> — markup | 1545–1688 | 11.4 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1370–1525 | 10.8 KB |
| m4-camera | 2628–2775 | 9.8 KB |
| m1-geom | 1933–2076 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1236–1340 | 7.4 KB |
| <script> — the application | 16–56 | 2.2 KB |
| v0.5.0 BRIEF 2.0 — add action · annotations · selected box | 1341–1369 | 1.8 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1236 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1341 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1370 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1526 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1534 | <style> — all CSS | boundary |
| 1545 | <body> — markup | boundary |
| 1689 | <script> — the application | boundary |
| 1690 | CHANGELOG (in-file release ledger) | prose |
| 1899 | DATA: A1ORGS literal (inline copy of data/orgs.json) | data |
| 1933 | m1-geom | module |
| 2077 | m2-render | module |
| 2361 | m3-input | module |
| 2628 | m4-camera | module |
| 2776 | m5-markers | module |
| 3978 | m6-mapdata | module |
| 4365 | s3-search | module |
| 4913 | s4-dossier | module |
| 7606 | s7-records | module |
| 9053 | s6-export | module |
| 9346 | s5-clocks | module |

## Functions by section

### 1690 · CHANGELOG (in-file release ledger)

- `1799` **APP_VERSION**
- `1800` **APP_UPDATED**
- `1892` **SITES**

### 1899 · DATA: A1ORGS literal (inline copy of data/orgs.json)

- `1899` **A1ORGS**
- `1901` `_ogBuild()`
- `1914` `orgOf(id)`
- `1915` `ogKids(id)`
- `1916` `ogEffSite(id)`
- `1917` `ogAtSite(siteId)`
- `1919` `ogPrimary(siteId)`
- `1924` `ogChainUp(id)`

### 1933 · m1-geom

- `1982` `_qMul(a,b)`
- `1992` `_qNorm(q)`
- `1994` `_qFromAxisAngle(ax,ay,az,ang)`
- `1998` `lonLatToVec(lon, lat)`
- `2006` `_setGlobeRot(rotLon, rotLat)`
- `2019` `_projectLonLat(lon, lat, m)`
- `2030` `_projectVec(v, m)`
- `2043` `_visibleLonLat(lon, lat, tol)`
- `2053` `globeMetrics(cv)`
- `2065` `_ringXYZ(ring)`

### 2077 · m2-render

- `2130` **GLOBE_FALLBACK_RINGS**
- `2131` **GLOBE_RINGS**
- `2133` **GLOBE_STATE_RINGS**
- `2134` **GLOBE_SHORE_RINGS**
- `2138` **US_STATES**
- `2165` **GLOBE_STATE_SHAPES**
- `2168` **GLOBE_COUNTRY_RINGS**
- `2176` `startGlobeLoop(cv)`
- `2209` `drawGlobe(cv, ctx)`
- `2280` `latRing(lat)`
- `2282` `lonRing(lon)`
- `2284` `drawGlobePath(ctx,m,ring,fill)`
- `2335` `_smoothRing(r, iters)`
- `2351` `smoothFallbackOnce()`

### 2361 · m3-input

- `2425` `globeMark()`
- `2429` `_rebuildGlobeQ()`
- `2438` `_faceLonLatAngles(lon,lat)`
- `2446` `setupGlobeInteraction(cv)`
- `2618` `globeGlideStep(dt)`

### 2628 · m4-camera

- `2724` `cameraCancel()`
- `2737` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2776 · m5-markers

- `2882` `_sitesArr()`
- `2886` `_siteIndex()`
- `2900` `siteById(id)`
- `2911` **CLS_META**
- `2918` `clsOf(id)`
- `2932` `_disc(id, title, bodyHtml, opts)`
- `2957` `_famOffSet()`
- `2970` **LY_MODES**
- `2977` `lyCounts()`
- `2982` `lyShown(off)`
- `2983` `lyModeN(m)`
- `2984` `lyKey()`
- `2991` `lySync()`
- `3006` `_lyRingPaint()`
- `3035` `lyRing(open)`
- `3045` `lyMode(k)`
- `3050` `lyFam(k)`
- `3054` `lyView(v)`
- `3062` `_lyEnsure(id)`
- `3074` `_shPaneLay()`
- `3113` `renderLegend()`
- `3127` `_cssRGB(c, fb)`
- `3138` `_mTok()`
- `3165` `_syncSelArcs(selId)`
- `3234` `_selSyncCheck()`
- `3246` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3284` `drawGlobeLinks(ctx, m)`
- `3309` `_gChromeZones(m)`
- `3335` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3362` `drawGlobeMarkers(ctx, m)`
- `3561` `_glowDot(ctx, x, y, fd, k)`
- `3576` **BF_STREAMS**
- `3591` `_bfNodeLbl(nd)`
- `3592` `_bfAbbr(name)`
- `3608` `_bfFanShort(lbls)`
- `3627` **BF_STAR**
- `3628` `_bfStarKind(n)`
- `3643` `_bfParentOf(id)`
- `3650` `_briefChainMap(opts)`
- `3705` `drawBriefStates(ctx, m, labels)`
- `3799` `_hexTrip(hex)`
- `3805` `drawBriefArcs(ctx, m)`
- `3825` `drawBriefNodes(ctx, m)`
- `3946` `drawMarkersHook(ctx, m)`
- `3969` `siteHitTest(x, y)`

### 3978 · m6-mapdata

- `4049` `_fetchRetry(src, tries)`
- `4062` `_basemapLoad()`
- `4068` `_basemapNetUp()`
- `4074` `loadGlobeCoastlinesHi()`
- `4101` `loadStateBorders()`
- `4132` `_albersUsaInvert(x, y)`
- `4151` `_ringsLookGeographic(rings)`
- `4174` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4219` `_topoSingleUse(topo, objName, projInvert)`
- `4243` `_shoreHarvest()`
- `4281` `loadCountryBorders()`
- `4305` `_decodeTopoLonLat(topo, objName)`
- `4319` `decodeTopoLand(topo)`
- `4345` `_namedStateShapes(topo, geographic)`

### 4365 · s3-search

- `4491` `_srEsc(s)`
- `4492` `_srEscA(v)`
- `4495` `_srFold(s)`
- `4505` `_searchEntries()`
- `4554` `buildSearchIndex()`
- `4558` `_srUserEntries()`
- `4603` `_srBriefEntries()`
- `4614` `sfsResults(q)`
- `4658` `_srFuse()`
- `4665` `sfsRender(res)`
- `4669` `_sfsPaint(res)`
- `4701` `_srRefresh()`
- `4710` `searchSelect(id)`
- `4833` `_sfsField()`
- `4837` `_isSearchField(t)`
- `4885` `initSearch()`
- `4907` `_srInjectCSS()`

### 4913 · s4-dossier

- `5054` `_odEsc(s)`
- `5055` `_odEscA(v)`
- `5069` `_camSnap()`
- `5073` `_camApply(st, o)`
- `5095` `_undoPush()`
- `5114` `tpLive()`
- `5121` `tpSync()`
- `5133` `tpZoom(dir, ramp)`
- `5147` `tpUndo()`
- `5152` `tpClear()`
- `5153` `_tpStop(e)`
- `5160` `_tpRamp()`
- `5165` `_tpWire()`
- `5189` `selectSite(id, o)`
- `5237` `setMode(m)`
- `5275` `renderBrief(view)`
- `5463` `_bdSync()`
- `5475` `_bfTint(hex)`
- `5489` `_bfLeaderTrack()`
- `5536` `_bfFlipCapture(el)`
- `5548` `_bfFlipPlay(el, old)`
- `5585` `_bfSceneDepth()`
- `5589` `_bfViewCapture(point)`
- `5597` `_bfFit(view)`
- `5607` `_bfZoomTo(value,point,finish)`
- `5611` `_bfExplore(k)`
- `5619` `_bfChartWire(el)`
- `5655` `_trailPush(id)`
- `5663` `_trailClear()`
- `5674` `_flyFitChain()`
- `5706` `_clearBand()`
- `5726` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `5740` `_flyPair(aLat,aLon,bLat,bLon)`
- `5758` `clearAll()`
- `5793` `_trailRender()`
- `5800` `tapAtScreen(x, y)`
- `5839` `showDossier(id)`
- `5863` `_sheetFlag()`
- `5870` `hideDossier()`
- `5898` **RC_KINDS**
- `5904` `_odSetTab(t)`
- `5913` `_odRender(s)`
- `6034` `calloutShow(id, at)`
- `6043` `calloutHide()`
- `6048` `_coRefresh()`
- `6049` `_coRender()`
- `6259` `_coAnchor()`
- `6278` `_coPlace()`
- `6319` `_bfPickFoot()`
- `6331` `_bfToast(msg)`
- `6425` **BF_PALETTE**
- `6431` `_bfArmHint()`
- `6442` `_bfTakeParent(fallback)`
- `6454` `_bfPickCandidates(pk,q,kind)`
- `6479` `_bfAddSheet(pk)`
- `6519` `_bfGroupSheet(pk)`
- `6549` **BF_PLACES**
- `6563` `bfPlaceOf(k)`
- `6566` `bfAddMany(ids, parent)`
- `6598` `_bfSelections(k)`
- `6639` `_bfAddUnderBtn(k)`
- `6648` `_bfInvHTML(k)`
- `6673` `_bfPlainSheet(k)`
- `6727` `_bfObjSheet(id)`
- `6855` `_rcContext(id)`
- `6856` `_rcTitle(r,x)`
- `6857` `_rcLabel(id,x)`
- `6858` `_rcRefresh()`
- `6864` `_rcResume(id)`
- `6868` `_rcStart(kind,rid)`
- `6876` `recordURL(value)`
- `6881` `recordCopy(value)`
- `6885` `_rcActions(kind,it)`
- `6897` `_rcCard(id,kind,it)`
- `6909` `_rcOptions(id,cur,allowNew)`
- `6913` `_rcIdPane(id)`
- `6922` `_rcRender(id)`
- `6951` `_rcFormHTML(kind,it,rid)`
- `6970` `_rcFit()`
- `6979` `_rcReadForm()`
- `6986` `_rcCommit()`
- `7005` `_rcDelete(rid)`
- `7012` `_rcUndoDelete()`
- `7021` `_rcOpen(id,rid,xid)`
- `7050` `_odStageClearSync(on)`
- `7512` `initDossier()`
- `7526` `_odInjectCSS()`

### 7606 · s7-records

- `7616` **RECORDS**
- `7619` `_recBlank(id)`
- `7620` `_recFingerprint(value)`
- `7623` `_recNormalize(r)`
- `7647` `recordOf(id)`
- `7648` `recAll()`
- `7649` `_recIndex(r,kind,index)`
- `7650` `_recRid()`
- `7651` `recCount(id)`
- `7658` `_recPersist(r)`
- `7669` `_recSave(id)`
- `7676` `_recStatusText(id)`
- `7686` `recordSaveStatus(id)`
- `7689` `_recStatusPaint()`
- `7692` `_recCloudAck(records)`
- `7696` `_recLoaded(r)`
- `7699` `recAdd(id, kind, item)`
- `7706` `recUpdate(id, kind, idx, item)`
- `7712` `recRemove(id, kind, idx)`
- `7721` `recIds(id)`
- `7722` `_recNextId(id)`
- `7727` `recAddId(id, label)`
- `7737` `recTitleId(id,label,title)`
- `7741` `recDelId(id, label)`
- `7750` `recIdCount(id, label)`
- `7756` `_rdbOpen()`
- `7904` **BRIEF**
- `7906` `_bfSync()`
- `7911` `_bfSave()`
- `7924` `_bfInvClean(a)`
- `7930` `bfNode(k)`
- `7931` `bfKids(k)`
- `7934` `_bfOrgId(id)`
- `7940` `bfHas(id)`
- `7942` `_bfStateKey(name)`
- `7943` `bfStateName(k)`
- `7948` `_bfFrame()`
- `7972` `_xpPulse()`
- `7984` `_bfPush(node)`
- `7995` `bfAdd(id, parent)`
- `8009` `bfAddState(name, parent)`
- `8018` `bfAddCustom(name, parent)`
- `8025` `bfRename(k, name)`
- `8032` `bfRemove(id)`
- `8048` `bfMove(k, newParent)`
- `8061` `bfReorder(k, dir)`
- `8074` `bfColor(k, hex)`
- `8082` `bfStripe(k)`
- `8088` `bfNote(id, text)`
- `8103` `_bfStackPopHide()`
- `8104` `_bfStackPop(lvl)`
- `8140` `bfStack(n)`
- `8149` `bfEye(rootId)`
- `8157` `bfDepth(n)`
- `8176` `_ssTick()`
- `8196` **ORGS**
- `8197` `_orgSave()`
- `8198` `orgById(id)`
- `8199` `orgKidsOf(pid)`
- `8200` `orgAdd(name, parent, base)`
- `8216` `orgRemove(id)`
- `8232` **SAVEDV**
- `8234` `_svSave()`
- `8248` `_shId(r, save)`
- `8252` `_shList(kind)`
- `8253` `_shFind(kind,id)`
- `8260` `_shTrim(A)`
- `8270` `_shScope(v)`
- `8281` `_shGlyph(kind,r)`
- `8297` `_shRow(kind,r,P,i)`
- `8326` `_shPaneShelf(kind,P)`
- `8374` `_shOpen(tab)`
- `8409` `_svOpenSheet()`
- `8410` `svCapture(name)`
- `8421` `svUpdate()`
- `8429` `svRename(id,n)`
- `8433` `svPin(id)`
- `8434` `svRecall(id)`
- `8444` `svRemove(id)`
- `8459` **SAVEDB**
- `8461` `_sbSave()`
- `8466` `sbCapture(name)`
- `8485` `sbUpdate()`
- `8495` `sbLoad(i)`
- `8511` `sbRename(id,n)`
- `8515` `sbPin(id)`
- `8516` `sbRemove(i)`
- `8528` `_sbOpenSheet()`
- `8541` `_lgSiteName(id)`
- `8546` `_ldCounts(c)`
- `8554` `_ldItem(kind,it,id)`
- `8566` `_ldSet(t)`
- `8568` `_ldTabs()`
- `8575` `_ledgerHTML()`
- `8619` `_ledgerEl()`
- `8631` `_ledgerRender()`
- `8635` `_ledgerOpen()`
- `8640` `_ledgerClose()`
- `8641` `_repoDoorSync(open)`
- `8644` `_ledgerTap(e)`
- `8656` `_ledgerPaint()`
- `8662` `recBackup()`
- `8666` `recRestore(obj)`
- `8699` **DB_TABLE**
- `8700` `_dbSetState(st, msg)`
- `8710` `_dbCfgSave(cfg)`
- `8714` `_dbIsNet(e)`
- `8721` `_dbWhy(what, e)`
- `8727` `ensureSupabase()`
- `8754` `_dbFetch(input, init)`
- `8760` `_dbSnapshot()`
- `8769` `_dbApply(data)`
- `8818` `_dbChipShow()`
- `8844` `dbPush()`
- `8851` `_dbFlush()`
- `8876` `_dbRetryArm()`
- `8883` `dbPullOnce()`
- `8902` `_dbConnectRun()`
- `8942` `dbConnect()`
- `8954` `_dbAutoBoot()`
- `8964` `dbDisconnect(silent)`
- `8978` `_dbNetUp(why)`
- `8990` `_dbHideFlush()`
- `8998` `_netUp(why)`
- `9015` `_dbSheet()`

### 9053 · s6-export

- `9065` `buildSnapshot(scope, recordFilter)`
- `9126` `_xpRecordSnapshot(rows,filter)`
- `9143` `_xpRecordChoices()`
- `9162` `_xpRecordIds()`
- `9171` `_xpReadFilter()`
- `9178` `_xpRecordBody(sn)`
- `9209` `_xpDownload(name, mime, data)`
- `9218` `_xpStamp()`
- `9220` `_xpSlug(sn)`
- `9223` `exportPNG()`
- `9243` `_xpDossierBody(sn)`
- `9298` `exportPDF(recordFilter)`
- `9308` `exportHTML(recordFilter)`
- `9319` `exportJSON(recordFilter)`

### 9346 · s5-clocks

- `9398` `_tzAbbr(tz, d)`
- `9406` `_ledTime(tz, d, secs)`
- `9416` `civilianTime(tz, d)`
- `9427` `_ckEsc(v)`
- `9430` **CLOCK_REGIONS**
- `9448` `_selSave()`
- `9468` `nearRegion(lat, lon)`
- `9517` `_tzForSite(site)`
- `9526` `autoFillSelect(site)`
- `9535` `pickZone(tz, label)`
- `9544` `tickClocks()`
- `9566` `_ckBeat()`
- `9577` `_ckArm()`
- `9583` `_ckWake()`
- `9591` `_tzOpenSheet()`
- `9619` `initClocks()`
- `9651` `bootShell()`
- `10018` `_bootPaint(ctx, m)`
- `10100` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coSec` · `setMode` · `_bfLeaderTrack` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
