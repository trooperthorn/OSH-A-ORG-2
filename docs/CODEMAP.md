# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v1.31.0** — 700,069 bytes, 10,505 lines, 343 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5051–7892 | 182.2 KB |
| s7-records | 7893–9355 | 79.5 KB |
| <style> — all CSS | 173–1272 | 71.2 KB |
| m5-markers | 2914–4115 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 1989–1995 | 49.0 KB |
| s5-clocks | 9649–10505 | 46.6 KB |
| s3-search | 4503–5050 | 28.9 KB |
| m2-render | 2215–2498 | 24.7 KB |
| m6-mapdata | 4116–4502 | 19.8 KB |
| s6-export | 9356–9648 | 18.7 KB |
| CHANGELOG (in-file release ledger) | 1744–1988 | 16.6 KB |
| m3-input | 2499–2765 | 16.1 KB |
| <body> — markup | 1582–1742 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1407–1562 | 10.8 KB |
| m4-camera | 2766–2913 | 9.8 KB |
| m1-geom | 2071–2214 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1273–1377 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 1996–2070 | 3.6 KB |
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
| 1989 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 1996 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2071 | m1-geom | module |
| 2215 | m2-render | module |
| 2499 | m3-input | module |
| 2766 | m4-camera | module |
| 2914 | m5-markers | module |
| 4116 | m6-mapdata | module |
| 4503 | s3-search | module |
| 5051 | s4-dossier | module |
| 7893 | s7-records | module |
| 9356 | s6-export | module |
| 9649 | s5-clocks | module |

## Functions by section

### 1744 · CHANGELOG (in-file release ledger)

- `1896` **APP_VERSION**
- `1897` **APP_UPDATED**

### 1989 · DATA: SITES literal (inline copy of data/sites.json)

- `1989` **SITES**

### 1996 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `1996` **A1ORGS**
- `2039` `_ogBuild()`
- `2052` `orgOf(id)`
- `2053` `ogKids(id)`
- `2054` `ogEffSite(id)`
- `2055` `ogAtSite(siteId)`
- `2057` `ogPrimary(siteId)`
- `2062` `ogChainUp(id)`

### 2071 · m1-geom

- `2120` `_qMul(a,b)`
- `2130` `_qNorm(q)`
- `2132` `_qFromAxisAngle(ax,ay,az,ang)`
- `2136` `lonLatToVec(lon, lat)`
- `2144` `_setGlobeRot(rotLon, rotLat)`
- `2157` `_projectLonLat(lon, lat, m)`
- `2168` `_projectVec(v, m)`
- `2181` `_visibleLonLat(lon, lat, tol)`
- `2191` `globeMetrics(cv)`
- `2203` `_ringXYZ(ring)`

### 2215 · m2-render

- `2268` **GLOBE_FALLBACK_RINGS**
- `2269` **GLOBE_RINGS**
- `2271` **GLOBE_STATE_RINGS**
- `2272` **GLOBE_SHORE_RINGS**
- `2276` **US_STATES**
- `2303` **GLOBE_STATE_SHAPES**
- `2306` **GLOBE_COUNTRY_RINGS**
- `2314` `startGlobeLoop(cv)`
- `2347` `drawGlobe(cv, ctx)`
- `2418` `latRing(lat)`
- `2420` `lonRing(lon)`
- `2422` `drawGlobePath(ctx,m,ring,fill)`
- `2473` `_smoothRing(r, iters)`
- `2489` `smoothFallbackOnce()`

### 2499 · m3-input

- `2563` `globeMark()`
- `2567` `_rebuildGlobeQ()`
- `2576` `_faceLonLatAngles(lon,lat)`
- `2584` `setupGlobeInteraction(cv)`
- `2756` `globeGlideStep(dt)`

### 2766 · m4-camera

- `2862` `cameraCancel()`
- `2875` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2914 · m5-markers

- `3020` `_sitesArr()`
- `3024` `_siteIndex()`
- `3038` `siteById(id)`
- `3049` **CLS_META**
- `3056` `clsOf(id)`
- `3070` `_disc(id, title, bodyHtml, opts)`
- `3095` `_famOffSet()`
- `3108` **LY_MODES**
- `3115` `lyCounts()`
- `3120` `lyShown(off)`
- `3121` `lyModeN(m)`
- `3122` `lyKey()`
- `3129` `lySync()`
- `3144` `_lyRingPaint()`
- `3173` `lyRing(open)`
- `3183` `lyMode(k)`
- `3188` `lyFam(k)`
- `3192` `lyView(v)`
- `3200` `_lyEnsure(id)`
- `3212` `_shPaneLay()`
- `3251` `renderLegend()`
- `3265` `_cssRGB(c, fb)`
- `3276` `_mTok()`
- `3303` `_syncSelArcs(selId)`
- `3372` `_selSyncCheck()`
- `3384` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3422` `drawGlobeLinks(ctx, m)`
- `3447` `_gChromeZones(m)`
- `3473` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3500` `drawGlobeMarkers(ctx, m)`
- `3699` `_glowDot(ctx, x, y, fd, k)`
- `3714` **BF_STREAMS**
- `3729` `_bfNodeLbl(nd)`
- `3730` `_bfAbbr(name)`
- `3746` `_bfFanShort(lbls)`
- `3765` **BF_STAR**
- `3766` `_bfStarKind(n)`
- `3781` `_bfParentOf(id)`
- `3788` `_briefChainMap(opts)`
- `3843` `drawBriefStates(ctx, m, labels)`
- `3937` `_hexTrip(hex)`
- `3943` `drawBriefArcs(ctx, m)`
- `3963` `drawBriefNodes(ctx, m)`
- `4084` `drawMarkersHook(ctx, m)`
- `4107` `siteHitTest(x, y)`

### 4116 · m6-mapdata

- `4187` `_fetchRetry(src, tries)`
- `4200` `_basemapLoad()`
- `4206` `_basemapNetUp()`
- `4212` `loadGlobeCoastlinesHi()`
- `4239` `loadStateBorders()`
- `4270` `_albersUsaInvert(x, y)`
- `4289` `_ringsLookGeographic(rings)`
- `4312` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4357` `_topoSingleUse(topo, objName, projInvert)`
- `4381` `_shoreHarvest()`
- `4419` `loadCountryBorders()`
- `4443` `_decodeTopoLonLat(topo, objName)`
- `4457` `decodeTopoLand(topo)`
- `4483` `_namedStateShapes(topo, geographic)`

### 4503 · s3-search

- `4629` `_srEsc(s)`
- `4630` `_srEscA(v)`
- `4633` `_srFold(s)`
- `4643` `_searchEntries()`
- `4692` `buildSearchIndex()`
- `4696` `_srUserEntries()`
- `4741` `_srBriefEntries()`
- `4752` `sfsResults(q)`
- `4796` `_srFuse()`
- `4803` `sfsRender(res)`
- `4807` `_sfsPaint(res)`
- `4839` `_srRefresh()`
- `4848` `searchSelect(id)`
- `4971` `_sfsField()`
- `4975` `_isSearchField(t)`
- `5023` `initSearch()`
- `5045` `_srInjectCSS()`

### 5051 · s4-dossier

- `5192` `_odEsc(s)`
- `5193` `_odEscA(v)`
- `5207` `_camSnap()`
- `5211` `_camApply(st, o)`
- `5233` `_undoPush()`
- `5252` `tpLive()`
- `5259` `tpSync()`
- `5271` `tpZoom(dir, ramp)`
- `5285` `tpUndo()`
- `5290` `tpClear()`
- `5291` `_tpStop(e)`
- `5298` `_tpRamp()`
- `5303` `_tpWire()`
- `5327` `selectSite(id, o)`
- `5375` `setMode(m)`
- `5414` `renderBrief(view)`
- `5602` `_bdSync()`
- `5614` `_bfTint(hex)`
- `5628` `_bfLeaderTrack()`
- `5675` `_bfFlipCapture(el)`
- `5687` `_bfFlipPlay(el, old)`
- `5724` `_bfSceneDepth()`
- `5728` `_bfViewCapture(point)`
- `5736` `_bfFit(view)`
- `5766` `_bfZoomTo(value,point,finish)`
- `5777` `_bfNavPush()`
- `5785` `bfBack()`
- `5803` `bfPresent(on)`
- `5826` `_bfHistArm()`
- `5858` `_bfExplore(k)`
- `5868` `_bfChartWire(el)`
- `5904` `_trailPush(id)`
- `5912` `_trailClear()`
- `5923` `_flyFitChain()`
- `5955` `_clearBand()`
- `5975` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `5989` `_flyPair(aLat,aLon,bLat,bLon)`
- `6007` `clearAll()`
- `6042` `_trailRender()`
- `6049` `tapAtScreen(x, y)`
- `6088` `showDossier(id)`
- `6112` `_sheetFlag()`
- `6119` `hideDossier()`
- `6147` **RC_KINDS**
- `6153` `_odSetTab(t)`
- `6162` `_odRender(s)`
- `6283` `calloutShow(id, at)`
- `6292` `calloutHide()`
- `6297` `_coRefresh()`
- `6298` `_coRender()`
- `6508` `_coAnchor()`
- `6527` `_coPlace()`
- `6568` `_bfPickFoot()`
- `6580` `_bfToast(msg)`
- `6674` **BF_PALETTE**
- `6680` `_bfArmHint()`
- `6691` `_bfTakeParent(fallback)`
- `6703` `_bfPickCandidates(pk,q,kind)`
- `6728` `_bfAddSheet(pk)`
- `6775` `_bfGroupSheet(pk)`
- `6805` **BF_PLACES**
- `6819` `bfPlaceOf(k)`
- `6822` `bfAddMany(ids, parent)`
- `6854` `_bfSelections(k)`
- `6903` `_bfAddUnderBtn(k)`
- `6912` `_bfInvHTML(k)`
- `6937` `_bfPlainSheet(k)`
- `6991` `_bfObjSheet(id)`
- `7119` `_rcContext(id)`
- `7120` `_rcTitle(r,x)`
- `7121` `_rcLabel(id,x)`
- `7122` `_rcRefresh()`
- `7128` `_rcResume(id)`
- `7132` `_rcStart(kind,rid)`
- `7140` `recordURL(value)`
- `7145` `recordCopy(value)`
- `7149` `_rcActions(kind,it)`
- `7161` `_rcCard(id,kind,it)`
- `7173` `_rcOptions(id,cur,allowNew)`
- `7177` `_rcIdPane(id)`
- `7186` `_rcRender(id)`
- `7215` `_rcFormHTML(kind,it,rid)`
- `7234` `_rcFit()`
- `7243` `_rcReadForm()`
- `7250` `_rcCommit()`
- `7269` `_rcDelete(rid)`
- `7276` `_rcUndoDelete()`
- `7285` `_rcOpen(id,rid,xid)`
- `7314` `_odStageClearSync(on)`
- `7799` `initDossier()`
- `7813` `_odInjectCSS()`

### 7893 · s7-records

- `7903` **RECORDS**
- `7906` `_recBlank(id)`
- `7907` `_recFingerprint(value)`
- `7910` `_recNormalize(r)`
- `7934` `recordOf(id)`
- `7935` `recAll()`
- `7936` `_recIndex(r,kind,index)`
- `7937` `_recRid()`
- `7938` `recCount(id)`
- `7945` `_recPersist(r)`
- `7956` `_recSave(id)`
- `7963` `_recStatusText(id)`
- `7973` `recordSaveStatus(id)`
- `7976` `_recStatusPaint()`
- `7979` `_recCloudAck(records)`
- `7983` `_recLoaded(r)`
- `7986` `recAdd(id, kind, item)`
- `7993` `recUpdate(id, kind, idx, item)`
- `7999` `recRemove(id, kind, idx)`
- `8008` `recIds(id)`
- `8009` `_recNextId(id)`
- `8014` `recAddId(id, label)`
- `8024` `recTitleId(id,label,title)`
- `8028` `recDelId(id, label)`
- `8037` `recIdCount(id, label)`
- `8043` `_rdbOpen()`
- `8191` **BRIEF**
- `8193` `_bfSync()`
- `8198` `_bfSave()`
- `8211` `_bfInvClean(a)`
- `8217` `bfNode(k)`
- `8218` `bfKids(k)`
- `8221` `_bfOrgId(id)`
- `8227` `bfHas(id)`
- `8229` `_bfStateKey(name)`
- `8230` `bfStateName(k)`
- `8235` `_bfFrame()`
- `8259` `_xpPulse()`
- `8271` `_bfPush(node)`
- `8282` `bfAdd(id, parent)`
- `8296` `bfAddState(name, parent)`
- `8305` `bfAddCustom(name, parent)`
- `8312` `bfRename(k, name)`
- `8319` `bfRemove(id)`
- `8335` `bfMove(k, newParent)`
- `8348` `bfReorder(k, dir)`
- `8361` `bfColor(k, hex)`
- `8371` `bfColorTree(k, hex)`
- `8383` `bfStripe(k)`
- `8389` `bfNote(id, text)`
- `8404` `_bfStackPopHide()`
- `8405` `_bfStackPop(lvl)`
- `8441` `bfStack(n)`
- `8450` `bfEye(rootId)`
- `8458` `bfDepth(n)`
- `8479` `_ssTick()`
- `8499` **ORGS**
- `8500` `_orgSave()`
- `8501` `orgById(id)`
- `8502` `orgKidsOf(pid)`
- `8503` `orgAdd(name, parent, base)`
- `8519` `orgRemove(id)`
- `8535` **SAVEDV**
- `8537` `_svSave()`
- `8551` `_shId(r, save)`
- `8555` `_shList(kind)`
- `8556` `_shFind(kind,id)`
- `8563` `_shTrim(A)`
- `8573` `_shScope(v)`
- `8584` `_shGlyph(kind,r)`
- `8600` `_shRow(kind,r,P,i)`
- `8629` `_shPaneShelf(kind,P)`
- `8677` `_shOpen(tab)`
- `8712` `_svOpenSheet()`
- `8713` `svCapture(name)`
- `8724` `svUpdate()`
- `8732` `svRename(id,n)`
- `8736` `svPin(id)`
- `8737` `svRecall(id)`
- `8747` `svRemove(id)`
- `8762` **SAVEDB**
- `8764` `_sbSave()`
- `8769` `sbCapture(name)`
- `8788` `sbUpdate()`
- `8798` `sbLoad(i)`
- `8814` `sbRename(id,n)`
- `8818` `sbPin(id)`
- `8819` `sbRemove(i)`
- `8831` `_sbOpenSheet()`
- `8844` `_lgSiteName(id)`
- `8849` `_ldCounts(c)`
- `8857` `_ldItem(kind,it,id)`
- `8869` `_ldSet(t)`
- `8871` `_ldTabs()`
- `8878` `_ledgerHTML()`
- `8922` `_ledgerEl()`
- `8934` `_ledgerRender()`
- `8938` `_ledgerOpen()`
- `8943` `_ledgerClose()`
- `8944` `_repoDoorSync(open)`
- `8947` `_ledgerTap(e)`
- `8959` `_ledgerPaint()`
- `8965` `recBackup()`
- `8969` `recRestore(obj)`
- `9002` **DB_TABLE**
- `9003` `_dbSetState(st, msg)`
- `9013` `_dbCfgSave(cfg)`
- `9017` `_dbIsNet(e)`
- `9024` `_dbWhy(what, e)`
- `9030` `ensureSupabase()`
- `9057` `_dbFetch(input, init)`
- `9063` `_dbSnapshot()`
- `9072` `_dbApply(data)`
- `9121` `_dbChipShow()`
- `9147` `dbPush()`
- `9154` `_dbFlush()`
- `9179` `_dbRetryArm()`
- `9186` `dbPullOnce()`
- `9205` `_dbConnectRun()`
- `9245` `dbConnect()`
- `9257` `_dbAutoBoot()`
- `9267` `dbDisconnect(silent)`
- `9281` `_dbNetUp(why)`
- `9293` `_dbHideFlush()`
- `9301` `_netUp(why)`
- `9318` `_dbSheet()`

### 9356 · s6-export

- `9368` `buildSnapshot(scope, recordFilter)`
- `9429` `_xpRecordSnapshot(rows,filter)`
- `9446` `_xpRecordChoices()`
- `9465` `_xpRecordIds()`
- `9474` `_xpReadFilter()`
- `9481` `_xpRecordBody(sn)`
- `9512` `_xpDownload(name, mime, data)`
- `9521` `_xpStamp()`
- `9523` `_xpSlug(sn)`
- `9526` `exportPNG()`
- `9546` `_xpDossierBody(sn)`
- `9601` `exportPDF(recordFilter)`
- `9611` `exportHTML(recordFilter)`
- `9622` `exportJSON(recordFilter)`

### 9649 · s5-clocks

- `9701` `_tzAbbr(tz, d)`
- `9709` `_ledTime(tz, d, secs)`
- `9719` `civilianTime(tz, d)`
- `9730` `_ckEsc(v)`
- `9733` **CLOCK_REGIONS**
- `9751` `_selSave()`
- `9771` `nearRegion(lat, lon)`
- `9820` `_tzForSite(site)`
- `9829` `autoFillSelect(site)`
- `9838` `pickZone(tz, label)`
- `9847` `tickClocks()`
- `9869` `_ckBeat()`
- `9880` `_ckArm()`
- `9886` `_ckWake()`
- `9894` `_tzOpenSheet()`
- `9922` `initClocks()`
- `9954` `bootShell()`
- `10321` `_bootPaint(ctx, m)`
- `10403` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
