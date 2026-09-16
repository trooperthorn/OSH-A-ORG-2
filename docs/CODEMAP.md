# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.2.0** — 713,757 bytes, 10,708 lines, 347 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5118–8094 | 190.4 KB |
| s7-records | 8095–9558 | 79.6 KB |
| <style> — all CSS | 173–1280 | 71.9 KB |
| m5-markers | 2981–4182 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2056–2062 | 49.0 KB |
| s5-clocks | 9852–10708 | 46.6 KB |
| s3-search | 4570–5117 | 28.9 KB |
| m2-render | 2282–2565 | 24.7 KB |
| CHANGELOG (in-file release ledger) | 1752–2055 | 21.0 KB |
| m6-mapdata | 4183–4569 | 19.8 KB |
| s6-export | 9559–9851 | 18.7 KB |
| m3-input | 2566–2832 | 16.1 KB |
| <body> — markup | 1590–1750 | 13.0 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1415–1570 | 10.8 KB |
| m4-camera | 2833–2980 | 9.8 KB |
| m1-geom | 2138–2281 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1281–1385 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2063–2137 | 3.6 KB |
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
| 2056 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2063 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2138 | m1-geom | module |
| 2282 | m2-render | module |
| 2566 | m3-input | module |
| 2833 | m4-camera | module |
| 2981 | m5-markers | module |
| 4183 | m6-mapdata | module |
| 4570 | s3-search | module |
| 5118 | s4-dossier | module |
| 8095 | s7-records | module |
| 9559 | s6-export | module |
| 9852 | s5-clocks | module |

## Functions by section

### 1752 · CHANGELOG (in-file release ledger)

- `1963` **APP_VERSION**
- `1964` **APP_UPDATED**

### 2056 · DATA: SITES literal (inline copy of data/sites.json)

- `2056` **SITES**

### 2063 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2063` **A1ORGS**
- `2106` `_ogBuild()`
- `2119` `orgOf(id)`
- `2120` `ogKids(id)`
- `2121` `ogEffSite(id)`
- `2122` `ogAtSite(siteId)`
- `2124` `ogPrimary(siteId)`
- `2129` `ogChainUp(id)`

### 2138 · m1-geom

- `2187` `_qMul(a,b)`
- `2197` `_qNorm(q)`
- `2199` `_qFromAxisAngle(ax,ay,az,ang)`
- `2203` `lonLatToVec(lon, lat)`
- `2211` `_setGlobeRot(rotLon, rotLat)`
- `2224` `_projectLonLat(lon, lat, m)`
- `2235` `_projectVec(v, m)`
- `2248` `_visibleLonLat(lon, lat, tol)`
- `2258` `globeMetrics(cv)`
- `2270` `_ringXYZ(ring)`

### 2282 · m2-render

- `2335` **GLOBE_FALLBACK_RINGS**
- `2336` **GLOBE_RINGS**
- `2338` **GLOBE_STATE_RINGS**
- `2339` **GLOBE_SHORE_RINGS**
- `2343` **US_STATES**
- `2370` **GLOBE_STATE_SHAPES**
- `2373` **GLOBE_COUNTRY_RINGS**
- `2381` `startGlobeLoop(cv)`
- `2414` `drawGlobe(cv, ctx)`
- `2485` `latRing(lat)`
- `2487` `lonRing(lon)`
- `2489` `drawGlobePath(ctx,m,ring,fill)`
- `2540` `_smoothRing(r, iters)`
- `2556` `smoothFallbackOnce()`

### 2566 · m3-input

- `2630` `globeMark()`
- `2634` `_rebuildGlobeQ()`
- `2643` `_faceLonLatAngles(lon,lat)`
- `2651` `setupGlobeInteraction(cv)`
- `2823` `globeGlideStep(dt)`

### 2833 · m4-camera

- `2929` `cameraCancel()`
- `2942` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2981 · m5-markers

- `3087` `_sitesArr()`
- `3091` `_siteIndex()`
- `3105` `siteById(id)`
- `3116` **CLS_META**
- `3123` `clsOf(id)`
- `3137` `_disc(id, title, bodyHtml, opts)`
- `3162` `_famOffSet()`
- `3175` **LY_MODES**
- `3182` `lyCounts()`
- `3187` `lyShown(off)`
- `3188` `lyModeN(m)`
- `3189` `lyKey()`
- `3196` `lySync()`
- `3211` `_lyRingPaint()`
- `3240` `lyRing(open)`
- `3250` `lyMode(k)`
- `3255` `lyFam(k)`
- `3259` `lyView(v)`
- `3267` `_lyEnsure(id)`
- `3279` `_shPaneLay()`
- `3318` `renderLegend()`
- `3332` `_cssRGB(c, fb)`
- `3343` `_mTok()`
- `3370` `_syncSelArcs(selId)`
- `3439` `_selSyncCheck()`
- `3451` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3489` `drawGlobeLinks(ctx, m)`
- `3514` `_gChromeZones(m)`
- `3540` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3567` `drawGlobeMarkers(ctx, m)`
- `3766` `_glowDot(ctx, x, y, fd, k)`
- `3781` **BF_STREAMS**
- `3796` `_bfNodeLbl(nd)`
- `3797` `_bfAbbr(name)`
- `3813` `_bfFanShort(lbls)`
- `3832` **BF_STAR**
- `3833` `_bfStarKind(n)`
- `3848` `_bfParentOf(id)`
- `3855` `_briefChainMap(opts)`
- `3910` `drawBriefStates(ctx, m, labels)`
- `4004` `_hexTrip(hex)`
- `4010` `drawBriefArcs(ctx, m)`
- `4030` `drawBriefNodes(ctx, m)`
- `4151` `drawMarkersHook(ctx, m)`
- `4174` `siteHitTest(x, y)`

### 4183 · m6-mapdata

- `4254` `_fetchRetry(src, tries)`
- `4267` `_basemapLoad()`
- `4273` `_basemapNetUp()`
- `4279` `loadGlobeCoastlinesHi()`
- `4306` `loadStateBorders()`
- `4337` `_albersUsaInvert(x, y)`
- `4356` `_ringsLookGeographic(rings)`
- `4379` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4424` `_topoSingleUse(topo, objName, projInvert)`
- `4448` `_shoreHarvest()`
- `4486` `loadCountryBorders()`
- `4510` `_decodeTopoLonLat(topo, objName)`
- `4524` `decodeTopoLand(topo)`
- `4550` `_namedStateShapes(topo, geographic)`

### 4570 · s3-search

- `4696` `_srEsc(s)`
- `4697` `_srEscA(v)`
- `4700` `_srFold(s)`
- `4710` `_searchEntries()`
- `4759` `buildSearchIndex()`
- `4763` `_srUserEntries()`
- `4808` `_srBriefEntries()`
- `4819` `sfsResults(q)`
- `4863` `_srFuse()`
- `4870` `sfsRender(res)`
- `4874` `_sfsPaint(res)`
- `4906` `_srRefresh()`
- `4915` `searchSelect(id)`
- `5038` `_sfsField()`
- `5042` `_isSearchField(t)`
- `5090` `initSearch()`
- `5112` `_srInjectCSS()`

### 5118 · s4-dossier

- `5259` `_odEsc(s)`
- `5260` `_odEscA(v)`
- `5274` `_camSnap()`
- `5278` `_camApply(st, o)`
- `5300` `_undoPush()`
- `5319` `tpLive()`
- `5326` `tpSync()`
- `5338` `tpZoom(dir, ramp)`
- `5352` `tpUndo()`
- `5357` `tpClear()`
- `5358` `_tpStop(e)`
- `5365` `_tpRamp()`
- `5370` `_tpWire()`
- `5394` `selectSite(id, o)`
- `5443` `setMode(m)`
- `5483` `renderBrief(view)`
- `5672` `_bdSync()`
- `5684` `_bfTint(hex)`
- `5698` `_bfLeaderTrack()`
- `5745` `_bfFlipCapture(el)`
- `5757` `_bfFlipPlay(el, old)`
- `5794` `_bfSceneDepth()`
- `5798` `_bfViewCapture(point)`
- `5809` `_bfMirrorFit(w,t,L)`
- `5818` `_bfFit(view)`
- `5849` `_bfZoomTo(value,point,finish)`
- `5860` `_bfNavPush()`
- `5868` `bfBack()`
- `5886` `bfPresent(on)`
- `5909` `_bfHistArm()`
- `5949` `_bfFlyFocus()`
- `5975` `_bfExplore(k)`
- `5986` `_bfChartWire(el)`
- `6022` `_trailPush(id)`
- `6030` `_trailClear()`
- `6041` `_flyFitChain()`
- `6073` `_clearBand()`
- `6093` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6107` `_flyPair(aLat,aLon,bLat,bLon)`
- `6125` `clearAll()`
- `6160` `_trailRender()`
- `6167` `tapAtScreen(x, y)`
- `6215` `showDossier(id)`
- `6239` `_sheetFlag()`
- `6246` `hideDossier()`
- `6274` **RC_KINDS**
- `6280` `_odSetTab(t)`
- `6289` `_odRender(s)`
- `6410` `calloutShow(id, at)`
- `6419` `calloutHide()`
- `6424` `_coRefresh()`
- `6425` `_coRender()`
- `6644` `_coAnchor()`
- `6663` `_coPlace()`
- `6704` `_bfPickFoot()`
- `6716` `_bfToast(msg)`
- `6810` **BF_PALETTE**
- `6816` `_bfArmHint()`
- `6827` `_bfTakeParent(fallback)`
- `6839` `_bfPickCandidates(pk,q,kind)`
- `6864` `_bfAddSheet(pk)`
- `6919` `_bfGroupSheet(pk)`
- `6949` **BF_PLACES**
- `6963` `bfPlaceOf(k)`
- `6975` `_bfBranchPlan(rootId, cap)`
- `6991` `bfAddBranch(rootId)`
- `7009` `bfAddMany(ids, parent)`
- `7041` `_bfSelections(k)`
- `7090` `_bfAddUnderBtn(k)`
- `7099` `_bfInvHTML(k)`
- `7124` `_bfPlainSheet(k)`
- `7178` `_bfObjSheet(id)`
- `7306` `_rcContext(id)`
- `7307` `_rcTitle(r,x)`
- `7308` `_rcLabel(id,x)`
- `7309` `_rcRefresh()`
- `7315` `_rcResume(id)`
- `7319` `_rcStart(kind,rid)`
- `7327` `recordURL(value)`
- `7332` `recordCopy(value)`
- `7336` `_rcActions(kind,it)`
- `7348` `_rcCard(id,kind,it)`
- `7360` `_rcOptions(id,cur,allowNew)`
- `7364` `_rcIdPane(id)`
- `7373` `_rcRender(id)`
- `7402` `_rcFormHTML(kind,it,rid)`
- `7421` `_rcFit()`
- `7430` `_rcReadForm()`
- `7437` `_rcCommit()`
- `7456` `_rcDelete(rid)`
- `7463` `_rcUndoDelete()`
- `7472` `_rcOpen(id,rid,xid)`
- `7501` `_odStageClearSync(on)`
- `8001` `initDossier()`
- `8015` `_odInjectCSS()`

### 8095 · s7-records

- `8105` **RECORDS**
- `8108` `_recBlank(id)`
- `8109` `_recFingerprint(value)`
- `8112` `_recNormalize(r)`
- `8136` `recordOf(id)`
- `8137` `recAll()`
- `8138` `_recIndex(r,kind,index)`
- `8139` `_recRid()`
- `8140` `recCount(id)`
- `8147` `_recPersist(r)`
- `8158` `_recSave(id)`
- `8165` `_recStatusText(id)`
- `8175` `recordSaveStatus(id)`
- `8178` `_recStatusPaint()`
- `8181` `_recCloudAck(records)`
- `8185` `_recLoaded(r)`
- `8188` `recAdd(id, kind, item)`
- `8195` `recUpdate(id, kind, idx, item)`
- `8201` `recRemove(id, kind, idx)`
- `8210` `recIds(id)`
- `8211` `_recNextId(id)`
- `8216` `recAddId(id, label)`
- `8226` `recTitleId(id,label,title)`
- `8230` `recDelId(id, label)`
- `8239` `recIdCount(id, label)`
- `8245` `_rdbOpen()`
- `8393` **BRIEF**
- `8395` `_bfSync()`
- `8400` `_bfSave()`
- `8413` `_bfInvClean(a)`
- `8419` `bfNode(k)`
- `8420` `bfKids(k)`
- `8423` `_bfOrgId(id)`
- `8429` `bfHas(id)`
- `8431` `_bfStateKey(name)`
- `8432` `bfStateName(k)`
- `8437` `_bfFrame()`
- `8461` `_xpPulse()`
- `8473` `_bfPush(node)`
- `8484` `bfAdd(id, parent)`
- `8498` `bfAddState(name, parent)`
- `8507` `bfAddCustom(name, parent)`
- `8514` `bfRename(k, name)`
- `8521` `bfRemove(id)`
- `8537` `bfMove(k, newParent)`
- `8550` `bfReorder(k, dir)`
- `8563` `bfColor(k, hex)`
- `8573` `bfColorTree(k, hex)`
- `8585` `bfStripe(k)`
- `8591` `bfNote(id, text)`
- `8606` `_bfStackPopHide()`
- `8607` `_bfStackPop(lvl)`
- `8643` `bfStack(n)`
- `8652` `bfEye(rootId)`
- `8660` `bfDepth(n)`
- `8682` `_ssTick()`
- `8702` **ORGS**
- `8703` `_orgSave()`
- `8704` `orgById(id)`
- `8705` `orgKidsOf(pid)`
- `8706` `orgAdd(name, parent, base)`
- `8722` `orgRemove(id)`
- `8738` **SAVEDV**
- `8740` `_svSave()`
- `8754` `_shId(r, save)`
- `8758` `_shList(kind)`
- `8759` `_shFind(kind,id)`
- `8766` `_shTrim(A)`
- `8776` `_shScope(v)`
- `8787` `_shGlyph(kind,r)`
- `8803` `_shRow(kind,r,P,i)`
- `8832` `_shPaneShelf(kind,P)`
- `8880` `_shOpen(tab)`
- `8915` `_svOpenSheet()`
- `8916` `svCapture(name)`
- `8927` `svUpdate()`
- `8935` `svRename(id,n)`
- `8939` `svPin(id)`
- `8940` `svRecall(id)`
- `8950` `svRemove(id)`
- `8965` **SAVEDB**
- `8967` `_sbSave()`
- `8972` `sbCapture(name)`
- `8991` `sbUpdate()`
- `9001` `sbLoad(i)`
- `9017` `sbRename(id,n)`
- `9021` `sbPin(id)`
- `9022` `sbRemove(i)`
- `9034` `_sbOpenSheet()`
- `9047` `_lgSiteName(id)`
- `9052` `_ldCounts(c)`
- `9060` `_ldItem(kind,it,id)`
- `9072` `_ldSet(t)`
- `9074` `_ldTabs()`
- `9081` `_ledgerHTML()`
- `9125` `_ledgerEl()`
- `9137` `_ledgerRender()`
- `9141` `_ledgerOpen()`
- `9146` `_ledgerClose()`
- `9147` `_repoDoorSync(open)`
- `9150` `_ledgerTap(e)`
- `9162` `_ledgerPaint()`
- `9168` `recBackup()`
- `9172` `recRestore(obj)`
- `9205` **DB_TABLE**
- `9206` `_dbSetState(st, msg)`
- `9216` `_dbCfgSave(cfg)`
- `9220` `_dbIsNet(e)`
- `9227` `_dbWhy(what, e)`
- `9233` `ensureSupabase()`
- `9260` `_dbFetch(input, init)`
- `9266` `_dbSnapshot()`
- `9275` `_dbApply(data)`
- `9324` `_dbChipShow()`
- `9350` `dbPush()`
- `9357` `_dbFlush()`
- `9382` `_dbRetryArm()`
- `9389` `dbPullOnce()`
- `9408` `_dbConnectRun()`
- `9448` `dbConnect()`
- `9460` `_dbAutoBoot()`
- `9470` `dbDisconnect(silent)`
- `9484` `_dbNetUp(why)`
- `9496` `_dbHideFlush()`
- `9504` `_netUp(why)`
- `9521` `_dbSheet()`

### 9559 · s6-export

- `9571` `buildSnapshot(scope, recordFilter)`
- `9632` `_xpRecordSnapshot(rows,filter)`
- `9649` `_xpRecordChoices()`
- `9668` `_xpRecordIds()`
- `9677` `_xpReadFilter()`
- `9684` `_xpRecordBody(sn)`
- `9715` `_xpDownload(name, mime, data)`
- `9724` `_xpStamp()`
- `9726` `_xpSlug(sn)`
- `9729` `exportPNG()`
- `9749` `_xpDossierBody(sn)`
- `9804` `exportPDF(recordFilter)`
- `9814` `exportHTML(recordFilter)`
- `9825` `exportJSON(recordFilter)`

### 9852 · s5-clocks

- `9904` `_tzAbbr(tz, d)`
- `9912` `_ledTime(tz, d, secs)`
- `9922` `civilianTime(tz, d)`
- `9933` `_ckEsc(v)`
- `9936` **CLOCK_REGIONS**
- `9954` `_selSave()`
- `9974` `nearRegion(lat, lon)`
- `10023` `_tzForSite(site)`
- `10032` `autoFillSelect(site)`
- `10041` `pickZone(tz, label)`
- `10050` `tickClocks()`
- `10072` `_ckBeat()`
- `10083` `_ckArm()`
- `10089` `_ckWake()`
- `10097` `_tzOpenSheet()`
- `10125` `initClocks()`
- `10157` `bootShell()`
- `10524` `_bootPaint(ctx, m)`
- `10606` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
