# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v1.30.0** — 886,957 bytes, 10,468 lines, 343 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| DATA: A1ORGS literal (inline copy of data/orgs.json) | 1979–2033 | 187.4 KB |
| s4-dossier | 5014–7855 | 182.2 KB |
| s7-records | 7856–9318 | 79.5 KB |
| <style> — all CSS | 173–1272 | 71.2 KB |
| m5-markers | 2877–4078 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 1972–1978 | 49.0 KB |
| s5-clocks | 9612–10468 | 46.6 KB |
| s3-search | 4466–5013 | 28.9 KB |
| m2-render | 2178–2461 | 24.7 KB |
| m6-mapdata | 4079–4465 | 19.8 KB |
| s6-export | 9319–9611 | 18.7 KB |
| m3-input | 2462–2728 | 16.1 KB |
| CHANGELOG (in-file release ledger) | 1744–1971 | 15.4 KB |
| <body> — markup | 1582–1742 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1407–1562 | 10.8 KB |
| m4-camera | 2729–2876 | 9.8 KB |
| m1-geom | 2034–2177 | 7.5 KB |
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
| 1972 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 1979 | DATA: A1ORGS literal (inline copy of data/orgs.json) | data |
| 2034 | m1-geom | module |
| 2178 | m2-render | module |
| 2462 | m3-input | module |
| 2729 | m4-camera | module |
| 2877 | m5-markers | module |
| 4079 | m6-mapdata | module |
| 4466 | s3-search | module |
| 5014 | s4-dossier | module |
| 7856 | s7-records | module |
| 9319 | s6-export | module |
| 9612 | s5-clocks | module |

## Functions by section

### 1744 · CHANGELOG (in-file release ledger)

- `1879` **APP_VERSION**
- `1880` **APP_UPDATED**

### 1972 · DATA: SITES literal (inline copy of data/sites.json)

- `1972` **SITES**

### 1979 · DATA: A1ORGS literal (inline copy of data/orgs.json)

- `1979` **A1ORGS**
- `2002` `_ogBuild()`
- `2015` `orgOf(id)`
- `2016` `ogKids(id)`
- `2017` `ogEffSite(id)`
- `2018` `ogAtSite(siteId)`
- `2020` `ogPrimary(siteId)`
- `2025` `ogChainUp(id)`

### 2034 · m1-geom

- `2083` `_qMul(a,b)`
- `2093` `_qNorm(q)`
- `2095` `_qFromAxisAngle(ax,ay,az,ang)`
- `2099` `lonLatToVec(lon, lat)`
- `2107` `_setGlobeRot(rotLon, rotLat)`
- `2120` `_projectLonLat(lon, lat, m)`
- `2131` `_projectVec(v, m)`
- `2144` `_visibleLonLat(lon, lat, tol)`
- `2154` `globeMetrics(cv)`
- `2166` `_ringXYZ(ring)`

### 2178 · m2-render

- `2231` **GLOBE_FALLBACK_RINGS**
- `2232` **GLOBE_RINGS**
- `2234` **GLOBE_STATE_RINGS**
- `2235` **GLOBE_SHORE_RINGS**
- `2239` **US_STATES**
- `2266` **GLOBE_STATE_SHAPES**
- `2269` **GLOBE_COUNTRY_RINGS**
- `2277` `startGlobeLoop(cv)`
- `2310` `drawGlobe(cv, ctx)`
- `2381` `latRing(lat)`
- `2383` `lonRing(lon)`
- `2385` `drawGlobePath(ctx,m,ring,fill)`
- `2436` `_smoothRing(r, iters)`
- `2452` `smoothFallbackOnce()`

### 2462 · m3-input

- `2526` `globeMark()`
- `2530` `_rebuildGlobeQ()`
- `2539` `_faceLonLatAngles(lon,lat)`
- `2547` `setupGlobeInteraction(cv)`
- `2719` `globeGlideStep(dt)`

### 2729 · m4-camera

- `2825` `cameraCancel()`
- `2838` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2877 · m5-markers

- `2983` `_sitesArr()`
- `2987` `_siteIndex()`
- `3001` `siteById(id)`
- `3012` **CLS_META**
- `3019` `clsOf(id)`
- `3033` `_disc(id, title, bodyHtml, opts)`
- `3058` `_famOffSet()`
- `3071` **LY_MODES**
- `3078` `lyCounts()`
- `3083` `lyShown(off)`
- `3084` `lyModeN(m)`
- `3085` `lyKey()`
- `3092` `lySync()`
- `3107` `_lyRingPaint()`
- `3136` `lyRing(open)`
- `3146` `lyMode(k)`
- `3151` `lyFam(k)`
- `3155` `lyView(v)`
- `3163` `_lyEnsure(id)`
- `3175` `_shPaneLay()`
- `3214` `renderLegend()`
- `3228` `_cssRGB(c, fb)`
- `3239` `_mTok()`
- `3266` `_syncSelArcs(selId)`
- `3335` `_selSyncCheck()`
- `3347` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3385` `drawGlobeLinks(ctx, m)`
- `3410` `_gChromeZones(m)`
- `3436` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3463` `drawGlobeMarkers(ctx, m)`
- `3662` `_glowDot(ctx, x, y, fd, k)`
- `3677` **BF_STREAMS**
- `3692` `_bfNodeLbl(nd)`
- `3693` `_bfAbbr(name)`
- `3709` `_bfFanShort(lbls)`
- `3728` **BF_STAR**
- `3729` `_bfStarKind(n)`
- `3744` `_bfParentOf(id)`
- `3751` `_briefChainMap(opts)`
- `3806` `drawBriefStates(ctx, m, labels)`
- `3900` `_hexTrip(hex)`
- `3906` `drawBriefArcs(ctx, m)`
- `3926` `drawBriefNodes(ctx, m)`
- `4047` `drawMarkersHook(ctx, m)`
- `4070` `siteHitTest(x, y)`

### 4079 · m6-mapdata

- `4150` `_fetchRetry(src, tries)`
- `4163` `_basemapLoad()`
- `4169` `_basemapNetUp()`
- `4175` `loadGlobeCoastlinesHi()`
- `4202` `loadStateBorders()`
- `4233` `_albersUsaInvert(x, y)`
- `4252` `_ringsLookGeographic(rings)`
- `4275` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4320` `_topoSingleUse(topo, objName, projInvert)`
- `4344` `_shoreHarvest()`
- `4382` `loadCountryBorders()`
- `4406` `_decodeTopoLonLat(topo, objName)`
- `4420` `decodeTopoLand(topo)`
- `4446` `_namedStateShapes(topo, geographic)`

### 4466 · s3-search

- `4592` `_srEsc(s)`
- `4593` `_srEscA(v)`
- `4596` `_srFold(s)`
- `4606` `_searchEntries()`
- `4655` `buildSearchIndex()`
- `4659` `_srUserEntries()`
- `4704` `_srBriefEntries()`
- `4715` `sfsResults(q)`
- `4759` `_srFuse()`
- `4766` `sfsRender(res)`
- `4770` `_sfsPaint(res)`
- `4802` `_srRefresh()`
- `4811` `searchSelect(id)`
- `4934` `_sfsField()`
- `4938` `_isSearchField(t)`
- `4986` `initSearch()`
- `5008` `_srInjectCSS()`

### 5014 · s4-dossier

- `5155` `_odEsc(s)`
- `5156` `_odEscA(v)`
- `5170` `_camSnap()`
- `5174` `_camApply(st, o)`
- `5196` `_undoPush()`
- `5215` `tpLive()`
- `5222` `tpSync()`
- `5234` `tpZoom(dir, ramp)`
- `5248` `tpUndo()`
- `5253` `tpClear()`
- `5254` `_tpStop(e)`
- `5261` `_tpRamp()`
- `5266` `_tpWire()`
- `5290` `selectSite(id, o)`
- `5338` `setMode(m)`
- `5377` `renderBrief(view)`
- `5565` `_bdSync()`
- `5577` `_bfTint(hex)`
- `5591` `_bfLeaderTrack()`
- `5638` `_bfFlipCapture(el)`
- `5650` `_bfFlipPlay(el, old)`
- `5687` `_bfSceneDepth()`
- `5691` `_bfViewCapture(point)`
- `5699` `_bfFit(view)`
- `5729` `_bfZoomTo(value,point,finish)`
- `5740` `_bfNavPush()`
- `5748` `bfBack()`
- `5766` `bfPresent(on)`
- `5789` `_bfHistArm()`
- `5821` `_bfExplore(k)`
- `5831` `_bfChartWire(el)`
- `5867` `_trailPush(id)`
- `5875` `_trailClear()`
- `5886` `_flyFitChain()`
- `5918` `_clearBand()`
- `5938` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `5952` `_flyPair(aLat,aLon,bLat,bLon)`
- `5970` `clearAll()`
- `6005` `_trailRender()`
- `6012` `tapAtScreen(x, y)`
- `6051` `showDossier(id)`
- `6075` `_sheetFlag()`
- `6082` `hideDossier()`
- `6110` **RC_KINDS**
- `6116` `_odSetTab(t)`
- `6125` `_odRender(s)`
- `6246` `calloutShow(id, at)`
- `6255` `calloutHide()`
- `6260` `_coRefresh()`
- `6261` `_coRender()`
- `6471` `_coAnchor()`
- `6490` `_coPlace()`
- `6531` `_bfPickFoot()`
- `6543` `_bfToast(msg)`
- `6637` **BF_PALETTE**
- `6643` `_bfArmHint()`
- `6654` `_bfTakeParent(fallback)`
- `6666` `_bfPickCandidates(pk,q,kind)`
- `6691` `_bfAddSheet(pk)`
- `6738` `_bfGroupSheet(pk)`
- `6768` **BF_PLACES**
- `6782` `bfPlaceOf(k)`
- `6785` `bfAddMany(ids, parent)`
- `6817` `_bfSelections(k)`
- `6866` `_bfAddUnderBtn(k)`
- `6875` `_bfInvHTML(k)`
- `6900` `_bfPlainSheet(k)`
- `6954` `_bfObjSheet(id)`
- `7082` `_rcContext(id)`
- `7083` `_rcTitle(r,x)`
- `7084` `_rcLabel(id,x)`
- `7085` `_rcRefresh()`
- `7091` `_rcResume(id)`
- `7095` `_rcStart(kind,rid)`
- `7103` `recordURL(value)`
- `7108` `recordCopy(value)`
- `7112` `_rcActions(kind,it)`
- `7124` `_rcCard(id,kind,it)`
- `7136` `_rcOptions(id,cur,allowNew)`
- `7140` `_rcIdPane(id)`
- `7149` `_rcRender(id)`
- `7178` `_rcFormHTML(kind,it,rid)`
- `7197` `_rcFit()`
- `7206` `_rcReadForm()`
- `7213` `_rcCommit()`
- `7232` `_rcDelete(rid)`
- `7239` `_rcUndoDelete()`
- `7248` `_rcOpen(id,rid,xid)`
- `7277` `_odStageClearSync(on)`
- `7762` `initDossier()`
- `7776` `_odInjectCSS()`

### 7856 · s7-records

- `7866` **RECORDS**
- `7869` `_recBlank(id)`
- `7870` `_recFingerprint(value)`
- `7873` `_recNormalize(r)`
- `7897` `recordOf(id)`
- `7898` `recAll()`
- `7899` `_recIndex(r,kind,index)`
- `7900` `_recRid()`
- `7901` `recCount(id)`
- `7908` `_recPersist(r)`
- `7919` `_recSave(id)`
- `7926` `_recStatusText(id)`
- `7936` `recordSaveStatus(id)`
- `7939` `_recStatusPaint()`
- `7942` `_recCloudAck(records)`
- `7946` `_recLoaded(r)`
- `7949` `recAdd(id, kind, item)`
- `7956` `recUpdate(id, kind, idx, item)`
- `7962` `recRemove(id, kind, idx)`
- `7971` `recIds(id)`
- `7972` `_recNextId(id)`
- `7977` `recAddId(id, label)`
- `7987` `recTitleId(id,label,title)`
- `7991` `recDelId(id, label)`
- `8000` `recIdCount(id, label)`
- `8006` `_rdbOpen()`
- `8154` **BRIEF**
- `8156` `_bfSync()`
- `8161` `_bfSave()`
- `8174` `_bfInvClean(a)`
- `8180` `bfNode(k)`
- `8181` `bfKids(k)`
- `8184` `_bfOrgId(id)`
- `8190` `bfHas(id)`
- `8192` `_bfStateKey(name)`
- `8193` `bfStateName(k)`
- `8198` `_bfFrame()`
- `8222` `_xpPulse()`
- `8234` `_bfPush(node)`
- `8245` `bfAdd(id, parent)`
- `8259` `bfAddState(name, parent)`
- `8268` `bfAddCustom(name, parent)`
- `8275` `bfRename(k, name)`
- `8282` `bfRemove(id)`
- `8298` `bfMove(k, newParent)`
- `8311` `bfReorder(k, dir)`
- `8324` `bfColor(k, hex)`
- `8334` `bfColorTree(k, hex)`
- `8346` `bfStripe(k)`
- `8352` `bfNote(id, text)`
- `8367` `_bfStackPopHide()`
- `8368` `_bfStackPop(lvl)`
- `8404` `bfStack(n)`
- `8413` `bfEye(rootId)`
- `8421` `bfDepth(n)`
- `8442` `_ssTick()`
- `8462` **ORGS**
- `8463` `_orgSave()`
- `8464` `orgById(id)`
- `8465` `orgKidsOf(pid)`
- `8466` `orgAdd(name, parent, base)`
- `8482` `orgRemove(id)`
- `8498` **SAVEDV**
- `8500` `_svSave()`
- `8514` `_shId(r, save)`
- `8518` `_shList(kind)`
- `8519` `_shFind(kind,id)`
- `8526` `_shTrim(A)`
- `8536` `_shScope(v)`
- `8547` `_shGlyph(kind,r)`
- `8563` `_shRow(kind,r,P,i)`
- `8592` `_shPaneShelf(kind,P)`
- `8640` `_shOpen(tab)`
- `8675` `_svOpenSheet()`
- `8676` `svCapture(name)`
- `8687` `svUpdate()`
- `8695` `svRename(id,n)`
- `8699` `svPin(id)`
- `8700` `svRecall(id)`
- `8710` `svRemove(id)`
- `8725` **SAVEDB**
- `8727` `_sbSave()`
- `8732` `sbCapture(name)`
- `8751` `sbUpdate()`
- `8761` `sbLoad(i)`
- `8777` `sbRename(id,n)`
- `8781` `sbPin(id)`
- `8782` `sbRemove(i)`
- `8794` `_sbOpenSheet()`
- `8807` `_lgSiteName(id)`
- `8812` `_ldCounts(c)`
- `8820` `_ldItem(kind,it,id)`
- `8832` `_ldSet(t)`
- `8834` `_ldTabs()`
- `8841` `_ledgerHTML()`
- `8885` `_ledgerEl()`
- `8897` `_ledgerRender()`
- `8901` `_ledgerOpen()`
- `8906` `_ledgerClose()`
- `8907` `_repoDoorSync(open)`
- `8910` `_ledgerTap(e)`
- `8922` `_ledgerPaint()`
- `8928` `recBackup()`
- `8932` `recRestore(obj)`
- `8965` **DB_TABLE**
- `8966` `_dbSetState(st, msg)`
- `8976` `_dbCfgSave(cfg)`
- `8980` `_dbIsNet(e)`
- `8987` `_dbWhy(what, e)`
- `8993` `ensureSupabase()`
- `9020` `_dbFetch(input, init)`
- `9026` `_dbSnapshot()`
- `9035` `_dbApply(data)`
- `9084` `_dbChipShow()`
- `9110` `dbPush()`
- `9117` `_dbFlush()`
- `9142` `_dbRetryArm()`
- `9149` `dbPullOnce()`
- `9168` `_dbConnectRun()`
- `9208` `dbConnect()`
- `9220` `_dbAutoBoot()`
- `9230` `dbDisconnect(silent)`
- `9244` `_dbNetUp(why)`
- `9256` `_dbHideFlush()`
- `9264` `_netUp(why)`
- `9281` `_dbSheet()`

### 9319 · s6-export

- `9331` `buildSnapshot(scope, recordFilter)`
- `9392` `_xpRecordSnapshot(rows,filter)`
- `9409` `_xpRecordChoices()`
- `9428` `_xpRecordIds()`
- `9437` `_xpReadFilter()`
- `9444` `_xpRecordBody(sn)`
- `9475` `_xpDownload(name, mime, data)`
- `9484` `_xpStamp()`
- `9486` `_xpSlug(sn)`
- `9489` `exportPNG()`
- `9509` `_xpDossierBody(sn)`
- `9564` `exportPDF(recordFilter)`
- `9574` `exportHTML(recordFilter)`
- `9585` `exportJSON(recordFilter)`

### 9612 · s5-clocks

- `9664` `_tzAbbr(tz, d)`
- `9672` `_ledTime(tz, d, secs)`
- `9682` `civilianTime(tz, d)`
- `9693` `_ckEsc(v)`
- `9696` **CLOCK_REGIONS**
- `9714` `_selSave()`
- `9734` `nearRegion(lat, lon)`
- `9783` `_tzForSite(site)`
- `9792` `autoFillSelect(site)`
- `9801` `pickZone(tz, label)`
- `9810` `tickClocks()`
- `9832` `_ckBeat()`
- `9843` `_ckArm()`
- `9849` `_ckWake()`
- `9857` `_tzOpenSheet()`
- `9885` `initClocks()`
- `9917` `bootShell()`
- `10284` `_bootPaint(ctx, m)`
- `10366` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
