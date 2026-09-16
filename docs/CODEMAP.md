# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.1.0** — 708,934 bytes, 10,627 lines, 345 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5098–8014 | 187.3 KB |
| s7-records | 8015–9477 | 79.5 KB |
| <style> — all CSS | 173–1280 | 71.9 KB |
| m5-markers | 2961–4162 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2036–2042 | 49.0 KB |
| s5-clocks | 9771–10627 | 46.6 KB |
| s3-search | 4550–5097 | 28.9 KB |
| m2-render | 2262–2545 | 24.7 KB |
| m6-mapdata | 4163–4549 | 19.8 KB |
| CHANGELOG (in-file release ledger) | 1752–2035 | 19.6 KB |
| s6-export | 9478–9770 | 18.7 KB |
| m3-input | 2546–2812 | 16.1 KB |
| <body> — markup | 1590–1750 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1415–1570 | 10.8 KB |
| m4-camera | 2813–2960 | 9.8 KB |
| m1-geom | 2118–2261 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1281–1385 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2043–2117 | 3.6 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1281 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1386 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1415 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1571 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1579 | <style> — all CSS | boundary |
| 1590 | <body> — markup | boundary |
| 1751 | <script> — the application | boundary |
| 1752 | CHANGELOG (in-file release ledger) | prose |
| 2036 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2043 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2118 | m1-geom | module |
| 2262 | m2-render | module |
| 2546 | m3-input | module |
| 2813 | m4-camera | module |
| 2961 | m5-markers | module |
| 4163 | m6-mapdata | module |
| 4550 | s3-search | module |
| 5098 | s4-dossier | module |
| 8015 | s7-records | module |
| 9478 | s6-export | module |
| 9771 | s5-clocks | module |

## Functions by section

### 1752 · CHANGELOG (in-file release ledger)

- `1943` **APP_VERSION**
- `1944` **APP_UPDATED**

### 2036 · DATA: SITES literal (inline copy of data/sites.json)

- `2036` **SITES**

### 2043 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2043` **A1ORGS**
- `2086` `_ogBuild()`
- `2099` `orgOf(id)`
- `2100` `ogKids(id)`
- `2101` `ogEffSite(id)`
- `2102` `ogAtSite(siteId)`
- `2104` `ogPrimary(siteId)`
- `2109` `ogChainUp(id)`

### 2118 · m1-geom

- `2167` `_qMul(a,b)`
- `2177` `_qNorm(q)`
- `2179` `_qFromAxisAngle(ax,ay,az,ang)`
- `2183` `lonLatToVec(lon, lat)`
- `2191` `_setGlobeRot(rotLon, rotLat)`
- `2204` `_projectLonLat(lon, lat, m)`
- `2215` `_projectVec(v, m)`
- `2228` `_visibleLonLat(lon, lat, tol)`
- `2238` `globeMetrics(cv)`
- `2250` `_ringXYZ(ring)`

### 2262 · m2-render

- `2315` **GLOBE_FALLBACK_RINGS**
- `2316` **GLOBE_RINGS**
- `2318` **GLOBE_STATE_RINGS**
- `2319` **GLOBE_SHORE_RINGS**
- `2323` **US_STATES**
- `2350` **GLOBE_STATE_SHAPES**
- `2353` **GLOBE_COUNTRY_RINGS**
- `2361` `startGlobeLoop(cv)`
- `2394` `drawGlobe(cv, ctx)`
- `2465` `latRing(lat)`
- `2467` `lonRing(lon)`
- `2469` `drawGlobePath(ctx,m,ring,fill)`
- `2520` `_smoothRing(r, iters)`
- `2536` `smoothFallbackOnce()`

### 2546 · m3-input

- `2610` `globeMark()`
- `2614` `_rebuildGlobeQ()`
- `2623` `_faceLonLatAngles(lon,lat)`
- `2631` `setupGlobeInteraction(cv)`
- `2803` `globeGlideStep(dt)`

### 2813 · m4-camera

- `2909` `cameraCancel()`
- `2922` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2961 · m5-markers

- `3067` `_sitesArr()`
- `3071` `_siteIndex()`
- `3085` `siteById(id)`
- `3096` **CLS_META**
- `3103` `clsOf(id)`
- `3117` `_disc(id, title, bodyHtml, opts)`
- `3142` `_famOffSet()`
- `3155` **LY_MODES**
- `3162` `lyCounts()`
- `3167` `lyShown(off)`
- `3168` `lyModeN(m)`
- `3169` `lyKey()`
- `3176` `lySync()`
- `3191` `_lyRingPaint()`
- `3220` `lyRing(open)`
- `3230` `lyMode(k)`
- `3235` `lyFam(k)`
- `3239` `lyView(v)`
- `3247` `_lyEnsure(id)`
- `3259` `_shPaneLay()`
- `3298` `renderLegend()`
- `3312` `_cssRGB(c, fb)`
- `3323` `_mTok()`
- `3350` `_syncSelArcs(selId)`
- `3419` `_selSyncCheck()`
- `3431` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3469` `drawGlobeLinks(ctx, m)`
- `3494` `_gChromeZones(m)`
- `3520` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3547` `drawGlobeMarkers(ctx, m)`
- `3746` `_glowDot(ctx, x, y, fd, k)`
- `3761` **BF_STREAMS**
- `3776` `_bfNodeLbl(nd)`
- `3777` `_bfAbbr(name)`
- `3793` `_bfFanShort(lbls)`
- `3812` **BF_STAR**
- `3813` `_bfStarKind(n)`
- `3828` `_bfParentOf(id)`
- `3835` `_briefChainMap(opts)`
- `3890` `drawBriefStates(ctx, m, labels)`
- `3984` `_hexTrip(hex)`
- `3990` `drawBriefArcs(ctx, m)`
- `4010` `drawBriefNodes(ctx, m)`
- `4131` `drawMarkersHook(ctx, m)`
- `4154` `siteHitTest(x, y)`

### 4163 · m6-mapdata

- `4234` `_fetchRetry(src, tries)`
- `4247` `_basemapLoad()`
- `4253` `_basemapNetUp()`
- `4259` `loadGlobeCoastlinesHi()`
- `4286` `loadStateBorders()`
- `4317` `_albersUsaInvert(x, y)`
- `4336` `_ringsLookGeographic(rings)`
- `4359` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4404` `_topoSingleUse(topo, objName, projInvert)`
- `4428` `_shoreHarvest()`
- `4466` `loadCountryBorders()`
- `4490` `_decodeTopoLonLat(topo, objName)`
- `4504` `decodeTopoLand(topo)`
- `4530` `_namedStateShapes(topo, geographic)`

### 4550 · s3-search

- `4676` `_srEsc(s)`
- `4677` `_srEscA(v)`
- `4680` `_srFold(s)`
- `4690` `_searchEntries()`
- `4739` `buildSearchIndex()`
- `4743` `_srUserEntries()`
- `4788` `_srBriefEntries()`
- `4799` `sfsResults(q)`
- `4843` `_srFuse()`
- `4850` `sfsRender(res)`
- `4854` `_sfsPaint(res)`
- `4886` `_srRefresh()`
- `4895` `searchSelect(id)`
- `5018` `_sfsField()`
- `5022` `_isSearchField(t)`
- `5070` `initSearch()`
- `5092` `_srInjectCSS()`

### 5098 · s4-dossier

- `5239` `_odEsc(s)`
- `5240` `_odEscA(v)`
- `5254` `_camSnap()`
- `5258` `_camApply(st, o)`
- `5280` `_undoPush()`
- `5299` `tpLive()`
- `5306` `tpSync()`
- `5318` `tpZoom(dir, ramp)`
- `5332` `tpUndo()`
- `5337` `tpClear()`
- `5338` `_tpStop(e)`
- `5345` `_tpRamp()`
- `5350` `_tpWire()`
- `5374` `selectSite(id, o)`
- `5423` `setMode(m)`
- `5463` `renderBrief(view)`
- `5652` `_bdSync()`
- `5664` `_bfTint(hex)`
- `5678` `_bfLeaderTrack()`
- `5725` `_bfFlipCapture(el)`
- `5737` `_bfFlipPlay(el, old)`
- `5774` `_bfSceneDepth()`
- `5778` `_bfViewCapture(point)`
- `5789` `_bfMirrorFit(w,t,L)`
- `5798` `_bfFit(view)`
- `5829` `_bfZoomTo(value,point,finish)`
- `5840` `_bfNavPush()`
- `5848` `bfBack()`
- `5866` `bfPresent(on)`
- `5889` `_bfHistArm()`
- `5929` `_bfFlyFocus()`
- `5955` `_bfExplore(k)`
- `5966` `_bfChartWire(el)`
- `6002` `_trailPush(id)`
- `6010` `_trailClear()`
- `6021` `_flyFitChain()`
- `6053` `_clearBand()`
- `6073` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6087` `_flyPair(aLat,aLon,bLat,bLon)`
- `6105` `clearAll()`
- `6140` `_trailRender()`
- `6147` `tapAtScreen(x, y)`
- `6195` `showDossier(id)`
- `6219` `_sheetFlag()`
- `6226` `hideDossier()`
- `6254` **RC_KINDS**
- `6260` `_odSetTab(t)`
- `6269` `_odRender(s)`
- `6390` `calloutShow(id, at)`
- `6399` `calloutHide()`
- `6404` `_coRefresh()`
- `6405` `_coRender()`
- `6624` `_coAnchor()`
- `6643` `_coPlace()`
- `6684` `_bfPickFoot()`
- `6696` `_bfToast(msg)`
- `6790` **BF_PALETTE**
- `6796` `_bfArmHint()`
- `6807` `_bfTakeParent(fallback)`
- `6819` `_bfPickCandidates(pk,q,kind)`
- `6844` `_bfAddSheet(pk)`
- `6891` `_bfGroupSheet(pk)`
- `6921` **BF_PLACES**
- `6935` `bfPlaceOf(k)`
- `6938` `bfAddMany(ids, parent)`
- `6970` `_bfSelections(k)`
- `7019` `_bfAddUnderBtn(k)`
- `7028` `_bfInvHTML(k)`
- `7053` `_bfPlainSheet(k)`
- `7107` `_bfObjSheet(id)`
- `7235` `_rcContext(id)`
- `7236` `_rcTitle(r,x)`
- `7237` `_rcLabel(id,x)`
- `7238` `_rcRefresh()`
- `7244` `_rcResume(id)`
- `7248` `_rcStart(kind,rid)`
- `7256` `recordURL(value)`
- `7261` `recordCopy(value)`
- `7265` `_rcActions(kind,it)`
- `7277` `_rcCard(id,kind,it)`
- `7289` `_rcOptions(id,cur,allowNew)`
- `7293` `_rcIdPane(id)`
- `7302` `_rcRender(id)`
- `7331` `_rcFormHTML(kind,it,rid)`
- `7350` `_rcFit()`
- `7359` `_rcReadForm()`
- `7366` `_rcCommit()`
- `7385` `_rcDelete(rid)`
- `7392` `_rcUndoDelete()`
- `7401` `_rcOpen(id,rid,xid)`
- `7430` `_odStageClearSync(on)`
- `7921` `initDossier()`
- `7935` `_odInjectCSS()`

### 8015 · s7-records

- `8025` **RECORDS**
- `8028` `_recBlank(id)`
- `8029` `_recFingerprint(value)`
- `8032` `_recNormalize(r)`
- `8056` `recordOf(id)`
- `8057` `recAll()`
- `8058` `_recIndex(r,kind,index)`
- `8059` `_recRid()`
- `8060` `recCount(id)`
- `8067` `_recPersist(r)`
- `8078` `_recSave(id)`
- `8085` `_recStatusText(id)`
- `8095` `recordSaveStatus(id)`
- `8098` `_recStatusPaint()`
- `8101` `_recCloudAck(records)`
- `8105` `_recLoaded(r)`
- `8108` `recAdd(id, kind, item)`
- `8115` `recUpdate(id, kind, idx, item)`
- `8121` `recRemove(id, kind, idx)`
- `8130` `recIds(id)`
- `8131` `_recNextId(id)`
- `8136` `recAddId(id, label)`
- `8146` `recTitleId(id,label,title)`
- `8150` `recDelId(id, label)`
- `8159` `recIdCount(id, label)`
- `8165` `_rdbOpen()`
- `8313` **BRIEF**
- `8315` `_bfSync()`
- `8320` `_bfSave()`
- `8333` `_bfInvClean(a)`
- `8339` `bfNode(k)`
- `8340` `bfKids(k)`
- `8343` `_bfOrgId(id)`
- `8349` `bfHas(id)`
- `8351` `_bfStateKey(name)`
- `8352` `bfStateName(k)`
- `8357` `_bfFrame()`
- `8381` `_xpPulse()`
- `8393` `_bfPush(node)`
- `8404` `bfAdd(id, parent)`
- `8418` `bfAddState(name, parent)`
- `8427` `bfAddCustom(name, parent)`
- `8434` `bfRename(k, name)`
- `8441` `bfRemove(id)`
- `8457` `bfMove(k, newParent)`
- `8470` `bfReorder(k, dir)`
- `8483` `bfColor(k, hex)`
- `8493` `bfColorTree(k, hex)`
- `8505` `bfStripe(k)`
- `8511` `bfNote(id, text)`
- `8526` `_bfStackPopHide()`
- `8527` `_bfStackPop(lvl)`
- `8563` `bfStack(n)`
- `8572` `bfEye(rootId)`
- `8580` `bfDepth(n)`
- `8601` `_ssTick()`
- `8621` **ORGS**
- `8622` `_orgSave()`
- `8623` `orgById(id)`
- `8624` `orgKidsOf(pid)`
- `8625` `orgAdd(name, parent, base)`
- `8641` `orgRemove(id)`
- `8657` **SAVEDV**
- `8659` `_svSave()`
- `8673` `_shId(r, save)`
- `8677` `_shList(kind)`
- `8678` `_shFind(kind,id)`
- `8685` `_shTrim(A)`
- `8695` `_shScope(v)`
- `8706` `_shGlyph(kind,r)`
- `8722` `_shRow(kind,r,P,i)`
- `8751` `_shPaneShelf(kind,P)`
- `8799` `_shOpen(tab)`
- `8834` `_svOpenSheet()`
- `8835` `svCapture(name)`
- `8846` `svUpdate()`
- `8854` `svRename(id,n)`
- `8858` `svPin(id)`
- `8859` `svRecall(id)`
- `8869` `svRemove(id)`
- `8884` **SAVEDB**
- `8886` `_sbSave()`
- `8891` `sbCapture(name)`
- `8910` `sbUpdate()`
- `8920` `sbLoad(i)`
- `8936` `sbRename(id,n)`
- `8940` `sbPin(id)`
- `8941` `sbRemove(i)`
- `8953` `_sbOpenSheet()`
- `8966` `_lgSiteName(id)`
- `8971` `_ldCounts(c)`
- `8979` `_ldItem(kind,it,id)`
- `8991` `_ldSet(t)`
- `8993` `_ldTabs()`
- `9000` `_ledgerHTML()`
- `9044` `_ledgerEl()`
- `9056` `_ledgerRender()`
- `9060` `_ledgerOpen()`
- `9065` `_ledgerClose()`
- `9066` `_repoDoorSync(open)`
- `9069` `_ledgerTap(e)`
- `9081` `_ledgerPaint()`
- `9087` `recBackup()`
- `9091` `recRestore(obj)`
- `9124` **DB_TABLE**
- `9125` `_dbSetState(st, msg)`
- `9135` `_dbCfgSave(cfg)`
- `9139` `_dbIsNet(e)`
- `9146` `_dbWhy(what, e)`
- `9152` `ensureSupabase()`
- `9179` `_dbFetch(input, init)`
- `9185` `_dbSnapshot()`
- `9194` `_dbApply(data)`
- `9243` `_dbChipShow()`
- `9269` `dbPush()`
- `9276` `_dbFlush()`
- `9301` `_dbRetryArm()`
- `9308` `dbPullOnce()`
- `9327` `_dbConnectRun()`
- `9367` `dbConnect()`
- `9379` `_dbAutoBoot()`
- `9389` `dbDisconnect(silent)`
- `9403` `_dbNetUp(why)`
- `9415` `_dbHideFlush()`
- `9423` `_netUp(why)`
- `9440` `_dbSheet()`

### 9478 · s6-export

- `9490` `buildSnapshot(scope, recordFilter)`
- `9551` `_xpRecordSnapshot(rows,filter)`
- `9568` `_xpRecordChoices()`
- `9587` `_xpRecordIds()`
- `9596` `_xpReadFilter()`
- `9603` `_xpRecordBody(sn)`
- `9634` `_xpDownload(name, mime, data)`
- `9643` `_xpStamp()`
- `9645` `_xpSlug(sn)`
- `9648` `exportPNG()`
- `9668` `_xpDossierBody(sn)`
- `9723` `exportPDF(recordFilter)`
- `9733` `exportHTML(recordFilter)`
- `9744` `exportJSON(recordFilter)`

### 9771 · s5-clocks

- `9823` `_tzAbbr(tz, d)`
- `9831` `_ledTime(tz, d, secs)`
- `9841` `civilianTime(tz, d)`
- `9852` `_ckEsc(v)`
- `9855` **CLOCK_REGIONS**
- `9873` `_selSave()`
- `9893` `nearRegion(lat, lon)`
- `9942` `_tzForSite(site)`
- `9951` `autoFillSelect(site)`
- `9960` `pickZone(tz, label)`
- `9969` `tickClocks()`
- `9991` `_ckBeat()`
- `10002` `_ckArm()`
- `10008` `_ckWake()`
- `10016` `_tzOpenSheet()`
- `10044` `initClocks()`
- `10076` `bootShell()`
- `10443` `_bootPaint(ctx, m)`
- `10525` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
