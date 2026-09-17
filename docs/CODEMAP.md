# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.6.0** — 764,029 bytes, 11,375 lines, 372 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5218–8289 | 196.1 KB |
| s7-records | 8290–9930 | 90.1 KB |
| <style> — all CSS | 173–1294 | 72.8 KB |
| m5-markers | 3081–4282 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2156–2162 | 49.0 KB |
| s5-clocks | 10519–11375 | 46.6 KB |
| s6-export | 9931–10518 | 44.2 KB |
| s3-search | 4670–5217 | 28.9 KB |
| CHANGELOG (in-file release ledger) | 1770–2155 | 27.0 KB |
| m2-render | 2382–2665 | 24.7 KB |
| m6-mapdata | 4283–4669 | 19.8 KB |
| m3-input | 2666–2932 | 16.1 KB |
| <body> — markup | 1604–1768 | 13.5 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1429–1584 | 10.8 KB |
| m4-camera | 2933–3080 | 9.8 KB |
| m1-geom | 2238–2381 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1295–1399 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2163–2237 | 3.6 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1295 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1400 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1429 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1585 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1593 | <style> — all CSS | boundary |
| 1604 | <body> — markup | boundary |
| 1769 | <script> — the application | boundary |
| 1770 | CHANGELOG (in-file release ledger) | prose |
| 2156 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2163 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2238 | m1-geom | module |
| 2382 | m2-render | module |
| 2666 | m3-input | module |
| 2933 | m4-camera | module |
| 3081 | m5-markers | module |
| 4283 | m6-mapdata | module |
| 4670 | s3-search | module |
| 5218 | s4-dossier | module |
| 8290 | s7-records | module |
| 9931 | s6-export | module |
| 10519 | s5-clocks | module |

## Functions by section

### 1770 · CHANGELOG (in-file release ledger)

- `2063` **APP_VERSION**
- `2064` **APP_UPDATED**

### 2156 · DATA: SITES literal (inline copy of data/sites.json)

- `2156` **SITES**

### 2163 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2163` **A1ORGS**
- `2206` `_ogBuild()`
- `2219` `orgOf(id)`
- `2220` `ogKids(id)`
- `2221` `ogEffSite(id)`
- `2222` `ogAtSite(siteId)`
- `2224` `ogPrimary(siteId)`
- `2229` `ogChainUp(id)`

### 2238 · m1-geom

- `2287` `_qMul(a,b)`
- `2297` `_qNorm(q)`
- `2299` `_qFromAxisAngle(ax,ay,az,ang)`
- `2303` `lonLatToVec(lon, lat)`
- `2311` `_setGlobeRot(rotLon, rotLat)`
- `2324` `_projectLonLat(lon, lat, m)`
- `2335` `_projectVec(v, m)`
- `2348` `_visibleLonLat(lon, lat, tol)`
- `2358` `globeMetrics(cv)`
- `2370` `_ringXYZ(ring)`

### 2382 · m2-render

- `2435` **GLOBE_FALLBACK_RINGS**
- `2436` **GLOBE_RINGS**
- `2438` **GLOBE_STATE_RINGS**
- `2439` **GLOBE_SHORE_RINGS**
- `2443` **US_STATES**
- `2470` **GLOBE_STATE_SHAPES**
- `2473` **GLOBE_COUNTRY_RINGS**
- `2481` `startGlobeLoop(cv)`
- `2514` `drawGlobe(cv, ctx)`
- `2585` `latRing(lat)`
- `2587` `lonRing(lon)`
- `2589` `drawGlobePath(ctx,m,ring,fill)`
- `2640` `_smoothRing(r, iters)`
- `2656` `smoothFallbackOnce()`

### 2666 · m3-input

- `2730` `globeMark()`
- `2734` `_rebuildGlobeQ()`
- `2743` `_faceLonLatAngles(lon,lat)`
- `2751` `setupGlobeInteraction(cv)`
- `2923` `globeGlideStep(dt)`

### 2933 · m4-camera

- `3029` `cameraCancel()`
- `3042` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3081 · m5-markers

- `3187` `_sitesArr()`
- `3191` `_siteIndex()`
- `3205` `siteById(id)`
- `3216` **CLS_META**
- `3223` `clsOf(id)`
- `3237` `_disc(id, title, bodyHtml, opts)`
- `3262` `_famOffSet()`
- `3275` **LY_MODES**
- `3282` `lyCounts()`
- `3287` `lyShown(off)`
- `3288` `lyModeN(m)`
- `3289` `lyKey()`
- `3296` `lySync()`
- `3311` `_lyRingPaint()`
- `3340` `lyRing(open)`
- `3350` `lyMode(k)`
- `3355` `lyFam(k)`
- `3359` `lyView(v)`
- `3367` `_lyEnsure(id)`
- `3379` `_shPaneLay()`
- `3418` `renderLegend()`
- `3432` `_cssRGB(c, fb)`
- `3443` `_mTok()`
- `3470` `_syncSelArcs(selId)`
- `3539` `_selSyncCheck()`
- `3551` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3589` `drawGlobeLinks(ctx, m)`
- `3614` `_gChromeZones(m)`
- `3640` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3667` `drawGlobeMarkers(ctx, m)`
- `3866` `_glowDot(ctx, x, y, fd, k)`
- `3881` **BF_STREAMS**
- `3896` `_bfNodeLbl(nd)`
- `3897` `_bfAbbr(name)`
- `3913` `_bfFanShort(lbls)`
- `3932` **BF_STAR**
- `3933` `_bfStarKind(n)`
- `3948` `_bfParentOf(id)`
- `3955` `_briefChainMap(opts)`
- `4010` `drawBriefStates(ctx, m, labels)`
- `4104` `_hexTrip(hex)`
- `4110` `drawBriefArcs(ctx, m)`
- `4130` `drawBriefNodes(ctx, m)`
- `4251` `drawMarkersHook(ctx, m)`
- `4274` `siteHitTest(x, y)`

### 4283 · m6-mapdata

- `4354` `_fetchRetry(src, tries)`
- `4367` `_basemapLoad()`
- `4373` `_basemapNetUp()`
- `4379` `loadGlobeCoastlinesHi()`
- `4406` `loadStateBorders()`
- `4437` `_albersUsaInvert(x, y)`
- `4456` `_ringsLookGeographic(rings)`
- `4479` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4524` `_topoSingleUse(topo, objName, projInvert)`
- `4548` `_shoreHarvest()`
- `4586` `loadCountryBorders()`
- `4610` `_decodeTopoLonLat(topo, objName)`
- `4624` `decodeTopoLand(topo)`
- `4650` `_namedStateShapes(topo, geographic)`

### 4670 · s3-search

- `4796` `_srEsc(s)`
- `4797` `_srEscA(v)`
- `4800` `_srFold(s)`
- `4810` `_searchEntries()`
- `4859` `buildSearchIndex()`
- `4863` `_srUserEntries()`
- `4908` `_srBriefEntries()`
- `4919` `sfsResults(q)`
- `4963` `_srFuse()`
- `4970` `sfsRender(res)`
- `4974` `_sfsPaint(res)`
- `5006` `_srRefresh()`
- `5015` `searchSelect(id)`
- `5138` `_sfsField()`
- `5142` `_isSearchField(t)`
- `5190` `initSearch()`
- `5212` `_srInjectCSS()`

### 5218 · s4-dossier

- `5359` `_odEsc(s)`
- `5360` `_odEscA(v)`
- `5374` `_camSnap()`
- `5378` `_camApply(st, o)`
- `5400` `_undoPush()`
- `5419` `tpLive()`
- `5426` `tpSync()`
- `5438` `tpZoom(dir, ramp)`
- `5452` `tpUndo()`
- `5457` `tpClear()`
- `5458` `_tpStop(e)`
- `5465` `_tpRamp()`
- `5470` `_tpWire()`
- `5494` `selectSite(id, o)`
- `5543` `setMode(m)`
- `5583` `renderBrief(view)`
- `5772` `_bdSync()`
- `5784` `_bfTint(hex)`
- `5798` `_bfLeaderTrack()`
- `5845` `_bfFlipCapture(el)`
- `5857` `_bfFlipPlay(el, old)`
- `5894` `_bfSceneDepth()`
- `5898` `_bfViewCapture(point)`
- `5909` `_bfMirrorFit(w,t,L)`
- `5918` `_bfFit(view)`
- `5949` `_bfZoomTo(value,point,finish)`
- `5960` `_bfNavPush()`
- `5968` `bfBack()`
- `5986` `bfPresent(on)`
- `6009` `_bfHistArm()`
- `6049` `_bfFlyFocus()`
- `6075` `_bfExplore(k)`
- `6086` `_bfChartWire(el)`
- `6201` `_trailPush(id)`
- `6209` `_trailClear()`
- `6220` `_flyFitChain()`
- `6252` `_clearBand()`
- `6272` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6286` `_flyPair(aLat,aLon,bLat,bLon)`
- `6304` `clearAll()`
- `6339` `_trailRender()`
- `6346` `tapAtScreen(x, y)`
- `6394` `showDossier(id)`
- `6418` `_sheetFlag()`
- `6425` `hideDossier()`
- `6453` **RC_KINDS**
- `6459` `_odSetTab(t)`
- `6468` `_odRender(s)`
- `6589` `calloutShow(id, at)`
- `6598` `calloutHide()`
- `6603` `_coRefresh()`
- `6604` `_coRender()`
- `6823` `_coAnchor()`
- `6842` `_coPlace()`
- `6883` `_bfPickFoot()`
- `6895` `_bfToast(msg)`
- `6989` **BF_PALETTE**
- `6995` `_bfArmHint()`
- `7006` `_bfTakeParent(fallback)`
- `7018` `_bfPickCandidates(pk,q,kind)`
- `7043` `_bfAddSheet(pk)`
- `7098` `_bfGroupSheet(pk)`
- `7128` **BF_PLACES**
- `7142` `bfPlaceOf(k)`
- `7154` `_bfBranchPlan(rootId, cap)`
- `7170` `bfAddBranch(rootId)`
- `7188` `bfAddMany(ids, parent)`
- `7220` `_bfSelections(k)`
- `7269` `_bfAddUnderBtn(k)`
- `7278` `_bfInvHTML(k)`
- `7303` `_bfPlainSheet(k)`
- `7357` `_bfObjSheet(id)`
- `7485` `_rcContext(id)`
- `7486` `_rcTitle(r,x)`
- `7487` `_rcLabel(id,x)`
- `7488` `_rcRefresh()`
- `7494` `_rcResume(id)`
- `7498` `_rcStart(kind,rid)`
- `7506` `recordURL(value)`
- `7511` `recordCopy(value)`
- `7515` `_rcActions(kind,it)`
- `7527` `_rcCard(id,kind,it)`
- `7539` `_rcOptions(id,cur,allowNew)`
- `7543` `_rcIdPane(id)`
- `7552` `_rcRender(id)`
- `7581` `_rcFormHTML(kind,it,rid)`
- `7600` `_rcFit()`
- `7609` `_rcReadForm()`
- `7616` `_rcCommit()`
- `7635` `_rcDelete(rid)`
- `7642` `_rcUndoDelete()`
- `7651` `_rcOpen(id,rid,xid)`
- `7680` `_odStageClearSync(on)`
- `8196` `initDossier()`
- `8210` `_odInjectCSS()`

### 8290 · s7-records

- `8300` **RECORDS**
- `8303` `_recBlank(id)`
- `8304` `_recFingerprint(value)`
- `8307` `_recNormalize(r)`
- `8331` `recordOf(id)`
- `8332` `recAll()`
- `8333` `_recIndex(r,kind,index)`
- `8334` `_recRid()`
- `8335` `recCount(id)`
- `8342` `_recPersist(r)`
- `8353` `_recSave(id)`
- `8360` `_recStatusText(id)`
- `8370` `recordSaveStatus(id)`
- `8373` `_recStatusPaint()`
- `8376` `_recCloudAck(records)`
- `8380` `_recLoaded(r)`
- `8383` `recAdd(id, kind, item)`
- `8390` `recUpdate(id, kind, idx, item)`
- `8396` `recRemove(id, kind, idx)`
- `8405` `recIds(id)`
- `8406` `_recNextId(id)`
- `8411` `recAddId(id, label)`
- `8421` `recTitleId(id,label,title)`
- `8425` `recDelId(id, label)`
- `8434` `recIdCount(id, label)`
- `8440` `_rdbOpen()`
- `8588` **BRIEF**
- `8590` `_bfSync()`
- `8595` `_bfSave()`
- `8608` `_bfInvClean(a)`
- `8614` `bfNode(k)`
- `8615` `bfKids(k)`
- `8618` `_bfOrgId(id)`
- `8624` `bfHas(id)`
- `8626` `_bfStateKey(name)`
- `8627` `bfStateName(k)`
- `8632` `_bfFrame()`
- `8656` `_xpPulse()`
- `8668` `_bfPush(node)`
- `8679` `bfAdd(id, parent)`
- `8693` `bfAddState(name, parent)`
- `8702` `bfAddCustom(name, parent)`
- `8709` `bfRename(k, name)`
- `8716` `bfRemove(id)`
- `8732` `bfMove(k, newParent)`
- `8746` `bfPlace(k, targetK, after)`
- `8760` `bfReorder(k, dir)`
- `8773` `bfColor(k, hex)`
- `8783` `bfColorTree(k, hex)`
- `8795` `bfStripe(k)`
- `8801` `bfNote(id, text)`
- `8816` `_bfStackPopHide()`
- `8817` `_bfStackPop(lvl)`
- `8853` `bfStack(n)`
- `8862` `bfEye(rootId)`
- `8870` `bfDepth(n)`
- `8893` `_ssTick()`
- `8913` **ORGS**
- `8914` `_orgSave()`
- `8915` `orgById(id)`
- `8916` `orgKidsOf(pid)`
- `8917` `orgAdd(name, parent, base)`
- `8933` `orgRemove(id)`
- `8949` **SAVEDV**
- `8951` `_svSave()`
- `8965` `_shId(r, save)`
- `8969` `_shList(kind)`
- `8970` `_shFind(kind,id)`
- `8977` `_shTrim(A)`
- `8987` `_shScope(v)`
- `8998` `_shGlyph(kind,r)`
- `9014` `_shRow(kind,r,P,i)`
- `9043` `_shPaneShelf(kind,P)`
- `9091` `_shOpen(tab)`
- `9126` `_svOpenSheet()`
- `9127` `svCapture(name)`
- `9138` `svUpdate()`
- `9146` `svRename(id,n)`
- `9150` `svPin(id)`
- `9151` `svRecall(id)`
- `9161` `svRemove(id)`
- `9176` **SAVEDB**
- `9178` `_sbSave()`
- `9183` `sbCapture(name)`
- `9202` `sbUpdate()`
- `9212` `sbLoad(i)`
- `9228` `sbRename(id,n)`
- `9232` `sbPin(id)`
- `9233` `sbRemove(i)`
- `9245` `_sbOpenSheet()`
- `9258` `_lgSiteName(id)`
- `9263` `_ldCounts(c)`
- `9271` `_ldItem(kind,it,id)`
- `9283` `_ldSet(t)`
- `9285` `_ldTabs()`
- `9292` `_ledgerHTML()`
- `9337` `_ledgerEl()`
- `9363` `_inResolve(q)`
- `9378` `_inResolveExact(txt)`
- `9388` **IN_KINDMAP**
- `9391` `_inKind(txt)`
- `9392` `_inItem(kind, name, detail)`
- `9398` `_inCommit(kind, name, detail)`
- `9405` `_inBulkParse(text)`
- `9418` `_inBulkCommit(rows)`
- `9429` `_inGo()`
- `9438` `_inSheet()`
- `9508` `_ledgerRender()`
- `9512` `_ledgerOpen()`
- `9517` `_ledgerClose()`
- `9518` `_repoDoorSync(open)`
- `9521` `_ledgerTap(e)`
- `9534` `_ledgerPaint()`
- `9540` `recBackup()`
- `9544` `recRestore(obj)`
- `9577` **DB_TABLE**
- `9578` `_dbSetState(st, msg)`
- `9588` `_dbCfgSave(cfg)`
- `9592` `_dbIsNet(e)`
- `9599` `_dbWhy(what, e)`
- `9605` `ensureSupabase()`
- `9632` `_dbFetch(input, init)`
- `9638` `_dbSnapshot()`
- `9647` `_dbApply(data)`
- `9696` `_dbChipShow()`
- `9722` `dbPush()`
- `9729` `_dbFlush()`
- `9754` `_dbRetryArm()`
- `9761` `dbPullOnce()`
- `9780` `_dbConnectRun()`
- `9820` `dbConnect()`
- `9832` `_dbAutoBoot()`
- `9842` `dbDisconnect(silent)`
- `9856` `_dbNetUp(why)`
- `9868` `_dbHideFlush()`
- `9876` `_netUp(why)`
- `9893` `_dbSheet()`

### 9931 · s6-export

- `9943` `buildSnapshot(scope, recordFilter)`
- `10004` `_xpRecordSnapshot(rows,filter)`
- `10021` `_xpRecordChoices()`
- `10040` `_xpRecordIds()`
- `10049` `_xpReadFilter()`
- `10056` `_xpRecordBody(sn)`
- `10087` `_xpDownload(name, mime, data)`
- `10096` `_xpStamp()`
- `10098` `_xpSlug(sn)`
- `10114` `_zipStore(parts)`
- `10135` `_pkx(v)`
- `10136` `_pkHex(c)`
- `10137` `_pkInk(hex)`
- `10141` `_deckLayout(C, roots)`
- `10156` `_deckChartXML(C, roots, title, ids)`
- `10190` `_deckSlideXML(inner)`
- `10197` `_pptxParts()`
- `10279` `_pptxBuild()`
- `10280` `xpPptx()`
- `10296` `_xlCol(i)`
- `10297` `_xlSheet(rows, widths)`
- `10313` `_xlsxParts()`
- `10384` `_xlsxBuild()`
- `10385` `xpXlsx()`
- `10394` `exportPNG()`
- `10414` `_xpDossierBody(sn)`
- `10469` `exportPDF(recordFilter)`
- `10479` `exportHTML(recordFilter)`
- `10490` `exportJSON(recordFilter)`

### 10519 · s5-clocks

- `10571` `_tzAbbr(tz, d)`
- `10579` `_ledTime(tz, d, secs)`
- `10589` `civilianTime(tz, d)`
- `10600` `_ckEsc(v)`
- `10603` **CLOCK_REGIONS**
- `10621` `_selSave()`
- `10641` `nearRegion(lat, lon)`
- `10690` `_tzForSite(site)`
- `10699` `autoFillSelect(site)`
- `10708` `pickZone(tz, label)`
- `10717` `tickClocks()`
- `10739` `_ckBeat()`
- `10750` `_ckArm()`
- `10756` `_ckWake()`
- `10764` `_tzOpenSheet()`
- `10792` `initClocks()`
- `10824` `bootShell()`
- `11191` `_bootPaint(ctx, m)`
- `11273` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `Intake` · `_inQT` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `_pptxParts` · `_pptxBuild` · `xpPptx` · `_zipCRC` · `_zipStore` · `_xlsxParts` · `_xlsxBuild` · `xpXlsx` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#inSiteQ` · `#inF1` · `#inF2` · `#inBulk` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#rId1` · `#snapshot`
