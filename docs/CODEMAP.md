# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.8.0** — 785,061 bytes, 11,522 lines, 377 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5351–8422 | 199.1 KB |
| s7-records | 8423–10077 | 93.0 KB |
| <style> — all CSS | 173–1294 | 73.9 KB |
| m5-markers | 3133–4415 | 70.6 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2200–2206 | 49.0 KB |
| s5-clocks | 10666–11522 | 47.5 KB |
| s6-export | 10078–10665 | 44.8 KB |
| CHANGELOG (in-file release ledger) | 1767–2199 | 30.9 KB |
| s3-search | 4803–5350 | 29.5 KB |
| m2-render | 2426–2717 | 25.6 KB |
| m6-mapdata | 4416–4802 | 20.1 KB |
| m3-input | 2718–2984 | 16.3 KB |
| <body> — markup | 1601–1765 | 13.6 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1426–1581 | 10.9 KB |
| m4-camera | 2985–3132 | 9.9 KB |
| m1-geom | 2282–2425 | 7.7 KB |
| <script> — the application | 57–172 | 7.6 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1295–1396 | 7.2 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2207–2281 | 3.7 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1295 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1397 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1426 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1582 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1590 | <style> — all CSS | boundary |
| 1601 | <body> — markup | boundary |
| 1766 | <script> — the application | boundary |
| 1767 | CHANGELOG (in-file release ledger) | prose |
| 2200 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2207 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2282 | m1-geom | module |
| 2426 | m2-render | module |
| 2718 | m3-input | module |
| 2985 | m4-camera | module |
| 3133 | m5-markers | module |
| 4416 | m6-mapdata | module |
| 4803 | s3-search | module |
| 5351 | s4-dossier | module |
| 8423 | s7-records | module |
| 10078 | s6-export | module |
| 10666 | s5-clocks | module |

## Functions by section

### 1767 · CHANGELOG (in-file release ledger)

- `2107` **APP_VERSION**
- `2108` **APP_UPDATED**

### 2200 · DATA: SITES literal (inline copy of data/sites.json)

- `2200` **SITES**

### 2207 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2207` **A1ORGS**
- `2250` `_ogBuild()`
- `2263` `orgOf(id)`
- `2264` `ogKids(id)`
- `2265` `ogEffSite(id)`
- `2266` `ogAtSite(siteId)`
- `2268` `ogPrimary(siteId)`
- `2273` `ogChainUp(id)`

### 2282 · m1-geom

- `2331` `_qMul(a,b)`
- `2341` `_qNorm(q)`
- `2343` `_qFromAxisAngle(ax,ay,az,ang)`
- `2347` `lonLatToVec(lon, lat)`
- `2355` `_setGlobeRot(rotLon, rotLat)`
- `2368` `_projectLonLat(lon, lat, m)`
- `2379` `_projectVec(v, m)`
- `2392` `_visibleLonLat(lon, lat, tol)`
- `2402` `globeMetrics(cv)`
- `2414` `_ringXYZ(ring)`

### 2426 · m2-render

- `2479` **GLOBE_FALLBACK_RINGS**
- `2480` **GLOBE_RINGS**
- `2482` **GLOBE_STATE_RINGS**
- `2483` **GLOBE_SHORE_RINGS**
- `2487` **US_STATES**
- `2514` **GLOBE_STATE_SHAPES**
- `2517` **GLOBE_COUNTRY_RINGS**
- `2525` `startGlobeLoop(cv)`
- `2563` `drawGlobe(cv, ctx)`
- `2637` `latRing(lat)`
- `2639` `lonRing(lon)`
- `2641` `drawGlobePath(ctx,m,ring,fill)`
- `2692` `_smoothRing(r, iters)`
- `2708` `smoothFallbackOnce()`

### 2718 · m3-input

- `2782` `globeMark()`
- `2786` `_rebuildGlobeQ()`
- `2795` `_faceLonLatAngles(lon,lat)`
- `2803` `setupGlobeInteraction(cv)`
- `2975` `globeGlideStep(dt)`

### 2985 · m4-camera

- `3081` `cameraCancel()`
- `3094` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3133 · m5-markers

- `3239` `_sitesArr()`
- `3243` `_siteIndex()`
- `3257` `siteById(id)`
- `3268` **CLS_META**
- `3275` `clsOf(id)`
- `3289` `_disc(id, title, bodyHtml, opts)`
- `3314` `_famOffSet()`
- `3327` **LY_MODES**
- `3334` `lyCounts()`
- `3339` `lyShown(off)`
- `3340` `lyModeN(m)`
- `3341` `lyKey()`
- `3348` `lySync()`
- `3363` `_lyRingPaint()`
- `3400` `lyRing(open)`
- `3410` `lyMode(k)`
- `3415` `lyFam(k)`
- `3419` `lyView(v)`
- `3434` **LIVE_POLL_MS**
- `3435` **LIVE_ENDPOINT**
- `3437` `liveAssetsToggle()`
- `3441` `_liveStart()`
- `3446` `_liveStop()`
- `3451` `_liveFetch()`
- `3474` `_drawLiveAssets(ctx, m)`
- `3500` `_lyEnsure(id)`
- `3512` `_shPaneLay()`
- `3551` `renderLegend()`
- `3565` `_cssRGB(c, fb)`
- `3576` `_mTok()`
- `3603` `_syncSelArcs(selId)`
- `3672` `_selSyncCheck()`
- `3684` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3722` `drawGlobeLinks(ctx, m)`
- `3747` `_gChromeZones(m)`
- `3773` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3800` `drawGlobeMarkers(ctx, m)`
- `3999` `_glowDot(ctx, x, y, fd, k)`
- `4014` **BF_STREAMS**
- `4029` `_bfNodeLbl(nd)`
- `4030` `_bfAbbr(name)`
- `4046` `_bfFanShort(lbls)`
- `4065` **BF_STAR**
- `4066` `_bfStarKind(n)`
- `4081` `_bfParentOf(id)`
- `4088` `_briefChainMap(opts)`
- `4143` `drawBriefStates(ctx, m, labels)`
- `4237` `_hexTrip(hex)`
- `4243` `drawBriefArcs(ctx, m)`
- `4263` `drawBriefNodes(ctx, m)`
- `4384` `drawMarkersHook(ctx, m)`
- `4407` `siteHitTest(x, y)`

### 4416 · m6-mapdata

- `4487` `_fetchRetry(src, tries)`
- `4500` `_basemapLoad()`
- `4506` `_basemapNetUp()`
- `4512` `loadGlobeCoastlinesHi()`
- `4539` `loadStateBorders()`
- `4570` `_albersUsaInvert(x, y)`
- `4589` `_ringsLookGeographic(rings)`
- `4612` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4657` `_topoSingleUse(topo, objName, projInvert)`
- `4681` `_shoreHarvest()`
- `4719` `loadCountryBorders()`
- `4743` `_decodeTopoLonLat(topo, objName)`
- `4757` `decodeTopoLand(topo)`
- `4783` `_namedStateShapes(topo, geographic)`

### 4803 · s3-search

- `4929` `_srEsc(s)`
- `4930` `_srEscA(v)`
- `4933` `_srFold(s)`
- `4943` `_searchEntries()`
- `4992` `buildSearchIndex()`
- `4996` `_srUserEntries()`
- `5041` `_srBriefEntries()`
- `5052` `sfsResults(q)`
- `5096` `_srFuse()`
- `5103` `sfsRender(res)`
- `5107` `_sfsPaint(res)`
- `5139` `_srRefresh()`
- `5148` `searchSelect(id)`
- `5271` `_sfsField()`
- `5275` `_isSearchField(t)`
- `5323` `initSearch()`
- `5345` `_srInjectCSS()`

### 5351 · s4-dossier

- `5492` `_odEsc(s)`
- `5493` `_odEscA(v)`
- `5507` `_camSnap()`
- `5511` `_camApply(st, o)`
- `5533` `_undoPush()`
- `5552` `tpLive()`
- `5559` `tpSync()`
- `5571` `tpZoom(dir, ramp)`
- `5585` `tpUndo()`
- `5590` `tpClear()`
- `5591` `_tpStop(e)`
- `5598` `_tpRamp()`
- `5603` `_tpWire()`
- `5627` `selectSite(id, o)`
- `5676` `setMode(m)`
- `5716` `renderBrief(view)`
- `5905` `_bdSync()`
- `5917` `_bfTint(hex)`
- `5931` `_bfLeaderTrack()`
- `5978` `_bfFlipCapture(el)`
- `5990` `_bfFlipPlay(el, old)`
- `6027` `_bfSceneDepth()`
- `6031` `_bfViewCapture(point)`
- `6042` `_bfMirrorFit(w,t,L)`
- `6051` `_bfFit(view)`
- `6082` `_bfZoomTo(value,point,finish)`
- `6093` `_bfNavPush()`
- `6101` `bfBack()`
- `6119` `bfPresent(on)`
- `6142` `_bfHistArm()`
- `6182` `_bfFlyFocus()`
- `6208` `_bfExplore(k)`
- `6219` `_bfChartWire(el)`
- `6334` `_trailPush(id)`
- `6342` `_trailClear()`
- `6353` `_flyFitChain()`
- `6385` `_clearBand()`
- `6405` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6419` `_flyPair(aLat,aLon,bLat,bLon)`
- `6437` `clearAll()`
- `6472` `_trailRender()`
- `6479` `tapAtScreen(x, y)`
- `6527` `showDossier(id)`
- `6551` `_sheetFlag()`
- `6558` `hideDossier()`
- `6586` **RC_KINDS**
- `6592` `_odSetTab(t)`
- `6601` `_odRender(s)`
- `6722` `calloutShow(id, at)`
- `6731` `calloutHide()`
- `6736` `_coRefresh()`
- `6737` `_coRender()`
- `6956` `_coAnchor()`
- `6975` `_coPlace()`
- `7016` `_bfPickFoot()`
- `7028` `_bfToast(msg)`
- `7122` **BF_PALETTE**
- `7128` `_bfArmHint()`
- `7139` `_bfTakeParent(fallback)`
- `7151` `_bfPickCandidates(pk,q,kind)`
- `7176` `_bfAddSheet(pk)`
- `7231` `_bfGroupSheet(pk)`
- `7261` **BF_PLACES**
- `7275` `bfPlaceOf(k)`
- `7287` `_bfBranchPlan(rootId, cap)`
- `7303` `bfAddBranch(rootId)`
- `7321` `bfAddMany(ids, parent)`
- `7353` `_bfSelections(k)`
- `7402` `_bfAddUnderBtn(k)`
- `7411` `_bfInvHTML(k)`
- `7436` `_bfPlainSheet(k)`
- `7490` `_bfObjSheet(id)`
- `7618` `_rcContext(id)`
- `7619` `_rcTitle(r,x)`
- `7620` `_rcLabel(id,x)`
- `7621` `_rcRefresh()`
- `7627` `_rcResume(id)`
- `7631` `_rcStart(kind,rid)`
- `7639` `recordURL(value)`
- `7644` `recordCopy(value)`
- `7648` `_rcActions(kind,it)`
- `7660` `_rcCard(id,kind,it)`
- `7672` `_rcOptions(id,cur,allowNew)`
- `7676` `_rcIdPane(id)`
- `7685` `_rcRender(id)`
- `7714` `_rcFormHTML(kind,it,rid)`
- `7733` `_rcFit()`
- `7742` `_rcReadForm()`
- `7749` `_rcCommit()`
- `7768` `_rcDelete(rid)`
- `7775` `_rcUndoDelete()`
- `7784` `_rcOpen(id,rid,xid)`
- `7813` `_odStageClearSync(on)`
- `8329` `initDossier()`
- `8343` `_odInjectCSS()`

### 8423 · s7-records

- `8433` **RECORDS**
- `8436` `_recBlank(id)`
- `8437` `_recFingerprint(value)`
- `8440` `_recNormalize(r)`
- `8464` `recordOf(id)`
- `8465` `recAll()`
- `8466` `_recIndex(r,kind,index)`
- `8467` `_recRid()`
- `8468` `recCount(id)`
- `8475` `_recPersist(r)`
- `8486` `_recSave(id)`
- `8493` `_recStatusText(id)`
- `8503` `recordSaveStatus(id)`
- `8506` `_recStatusPaint()`
- `8509` `_recCloudAck(records)`
- `8513` `_recLoaded(r)`
- `8516` `recAdd(id, kind, item)`
- `8523` `recUpdate(id, kind, idx, item)`
- `8529` `recRemove(id, kind, idx)`
- `8538` `recIds(id)`
- `8539` `_recNextId(id)`
- `8544` `recAddId(id, label)`
- `8554` `recTitleId(id,label,title)`
- `8558` `recDelId(id, label)`
- `8567` `recIdCount(id, label)`
- `8573` `_rdbOpen()`
- `8721` **BRIEF**
- `8723` `_bfSync()`
- `8728` `_bfSave()`
- `8741` `_bfInvClean(a)`
- `8747` `bfNode(k)`
- `8748` `bfKids(k)`
- `8751` `_bfOrgId(id)`
- `8757` `bfHas(id)`
- `8759` `_bfStateKey(name)`
- `8760` `bfStateName(k)`
- `8765` `_bfFrame()`
- `8789` `_xpPulse()`
- `8801` `_bfPush(node)`
- `8812` `bfAdd(id, parent)`
- `8826` `bfAddState(name, parent)`
- `8835` `bfAddCustom(name, parent)`
- `8842` `bfRename(k, name)`
- `8849` `bfRemove(id)`
- `8865` `bfMove(k, newParent)`
- `8879` `bfPlace(k, targetK, after)`
- `8893` `bfReorder(k, dir)`
- `8906` `bfColor(k, hex)`
- `8916` `bfColorTree(k, hex)`
- `8928` `bfStripe(k)`
- `8934` `bfNote(id, text)`
- `8949` `_bfStackPopHide()`
- `8950` `_bfStackPop(lvl)`
- `8986` `bfStack(n)`
- `8995` `bfEye(rootId)`
- `9003` `bfDepth(n)`
- `9026` `_ssTick()`
- `9046` **ORGS**
- `9047` `_orgSave()`
- `9048` `orgById(id)`
- `9049` `orgKidsOf(pid)`
- `9050` `orgAdd(name, parent, base)`
- `9066` `orgRemove(id)`
- `9082` **SAVEDV**
- `9084` `_svSave()`
- `9098` `_shId(r, save)`
- `9102` `_shList(kind)`
- `9103` `_shFind(kind,id)`
- `9110` `_shTrim(A)`
- `9120` `_shScope(v)`
- `9131` `_shGlyph(kind,r)`
- `9147` `_shRow(kind,r,P,i)`
- `9176` `_shPaneShelf(kind,P)`
- `9224` `_shOpen(tab)`
- `9259` `_svOpenSheet()`
- `9260` `svCapture(name)`
- `9271` `svUpdate()`
- `9279` `svRename(id,n)`
- `9283` `svPin(id)`
- `9284` `svRecall(id)`
- `9294` `svRemove(id)`
- `9309` **SAVEDB**
- `9311` `_sbSave()`
- `9316` `sbCapture(name)`
- `9335` `sbUpdate()`
- `9345` `sbLoad(i)`
- `9361` `sbRename(id,n)`
- `9365` `sbPin(id)`
- `9366` `sbRemove(i)`
- `9378` `_sbOpenSheet()`
- `9391` `_lgSiteName(id)`
- `9396` `_ldCounts(c)`
- `9404` `_ldItem(kind,it,id)`
- `9416` `_ldSet(t)`
- `9418` `_ldTabs()`
- `9425` `_ledgerHTML()`
- `9470` `_ledgerEl()`
- `9496` `_inResolve(q)`
- `9511` `_inResolveExact(txt)`
- `9521` **IN_KINDMAP**
- `9524` `_inKind(txt)`
- `9525` `_inItem(kind, name, detail)`
- `9531` `_inCommit(kind, name, detail)`
- `9538` `_inBulkParse(text)`
- `9551` `_inBulkCommit(rows)`
- `9562` `_inGo()`
- `9571` `_inSheet()`
- `9641` `_ledgerRender()`
- `9645` `_ledgerOpen()`
- `9650` `_ledgerClose()`
- `9651` `_repoDoorSync(open)`
- `9654` `_ledgerTap(e)`
- `9667` `_ledgerPaint()`
- `9673` `recBackup()`
- `9677` `recRestore(obj)`
- `9711` **DB_TABLE**
- `9712` `_dbSetState(st, msg)`
- `9722` `_dbCfgSave(cfg)`
- `9726` `_dbIsNet(e)`
- `9733` `_dbWhy(what, e)`
- `9739` `ensureSupabase()`
- `9766` `_dbFetch(input, init)`
- `9772` `_dbSnapshot()`
- `9781` `_dbApply(data)`
- `9830` `_dbChipShow()`
- `9856` `dbPush()`
- `9864` `_dbFlush()`
- `9899` `_dbRetryArm()`
- `9906` `dbPullOnce()`
- `9925` `_dbConnectRun()`
- `9966` `dbConnect()`
- `9978` `_dbAutoBoot()`
- `9988` `dbDisconnect(silent)`
- `10002` `_dbNetUp(why)`
- `10014` `_dbHideFlush()`
- `10022` `_netUp(why)`
- `10040` `_dbSheet()`

### 10078 · s6-export

- `10090` `buildSnapshot(scope, recordFilter)`
- `10151` `_xpRecordSnapshot(rows,filter)`
- `10168` `_xpRecordChoices()`
- `10187` `_xpRecordIds()`
- `10196` `_xpReadFilter()`
- `10203` `_xpRecordBody(sn)`
- `10234` `_xpDownload(name, mime, data)`
- `10243` `_xpStamp()`
- `10245` `_xpSlug(sn)`
- `10261` `_zipStore(parts)`
- `10282` `_pkx(v)`
- `10283` `_pkHex(c)`
- `10284` `_pkInk(hex)`
- `10288` `_deckLayout(C, roots)`
- `10303` `_deckChartXML(C, roots, title, ids)`
- `10337` `_deckSlideXML(inner)`
- `10344` `_pptxParts()`
- `10426` `_pptxBuild()`
- `10427` `xpPptx()`
- `10443` `_xlCol(i)`
- `10444` `_xlSheet(rows, widths)`
- `10460` `_xlsxParts()`
- `10531` `_xlsxBuild()`
- `10532` `xpXlsx()`
- `10541` `exportPNG()`
- `10561` `_xpDossierBody(sn)`
- `10616` `exportPDF(recordFilter)`
- `10626` `exportHTML(recordFilter)`
- `10637` `exportJSON(recordFilter)`

### 10666 · s5-clocks

- `10718` `_tzAbbr(tz, d)`
- `10726` `_ledTime(tz, d, secs)`
- `10736` `civilianTime(tz, d)`
- `10747` `_ckEsc(v)`
- `10750` **CLOCK_REGIONS**
- `10768` `_selSave()`
- `10788` `nearRegion(lat, lon)`
- `10837` `_tzForSite(site)`
- `10846` `autoFillSelect(site)`
- `10855` `pickZone(tz, label)`
- `10864` `tickClocks()`
- `10886` `_ckBeat()`
- `10897` `_ckArm()`
- `10903` `_ckWake()`
- `10911` `_tzOpenSheet()`
- `10939` `initClocks()`
- `10971` `bootShell()`
- `11338` `_bootPaint(ctx, m)`
- `11420` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `Intake` · `_inQT` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `_pptxParts` · `_pptxBuild` · `xpPptx` · `_zipCRC` · `_zipStore` · `_xlsxParts` · `_xlsxBuild` · `xpXlsx` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#inSiteQ` · `#inF1` · `#inF2` · `#inBulk` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbCode` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#rId1` · `#snapshot`
