# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.7.0** — 767,248 bytes, 11,413 lines, 372 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5242–8313 | 196.1 KB |
| s7-records | 8314–9968 | 91.4 KB |
| <style> — all CSS | 173–1294 | 72.8 KB |
| m5-markers | 3105–4306 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2180–2186 | 49.0 KB |
| s5-clocks | 10557–11413 | 46.7 KB |
| s6-export | 9969–10556 | 44.2 KB |
| s3-search | 4694–5241 | 28.9 KB |
| CHANGELOG (in-file release ledger) | 1770–2179 | 28.8 KB |
| m2-render | 2406–2689 | 24.7 KB |
| m6-mapdata | 4307–4693 | 19.8 KB |
| m3-input | 2690–2956 | 16.1 KB |
| <body> — markup | 1604–1768 | 13.5 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1429–1584 | 10.8 KB |
| m4-camera | 2957–3104 | 9.8 KB |
| m1-geom | 2262–2405 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1295–1399 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2187–2261 | 3.6 KB |
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
| 2180 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2187 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2262 | m1-geom | module |
| 2406 | m2-render | module |
| 2690 | m3-input | module |
| 2957 | m4-camera | module |
| 3105 | m5-markers | module |
| 4307 | m6-mapdata | module |
| 4694 | s3-search | module |
| 5242 | s4-dossier | module |
| 8314 | s7-records | module |
| 9969 | s6-export | module |
| 10557 | s5-clocks | module |

## Functions by section

### 1770 · CHANGELOG (in-file release ledger)

- `2087` **APP_VERSION**
- `2088` **APP_UPDATED**

### 2180 · DATA: SITES literal (inline copy of data/sites.json)

- `2180` **SITES**

### 2187 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2187` **A1ORGS**
- `2230` `_ogBuild()`
- `2243` `orgOf(id)`
- `2244` `ogKids(id)`
- `2245` `ogEffSite(id)`
- `2246` `ogAtSite(siteId)`
- `2248` `ogPrimary(siteId)`
- `2253` `ogChainUp(id)`

### 2262 · m1-geom

- `2311` `_qMul(a,b)`
- `2321` `_qNorm(q)`
- `2323` `_qFromAxisAngle(ax,ay,az,ang)`
- `2327` `lonLatToVec(lon, lat)`
- `2335` `_setGlobeRot(rotLon, rotLat)`
- `2348` `_projectLonLat(lon, lat, m)`
- `2359` `_projectVec(v, m)`
- `2372` `_visibleLonLat(lon, lat, tol)`
- `2382` `globeMetrics(cv)`
- `2394` `_ringXYZ(ring)`

### 2406 · m2-render

- `2459` **GLOBE_FALLBACK_RINGS**
- `2460` **GLOBE_RINGS**
- `2462` **GLOBE_STATE_RINGS**
- `2463` **GLOBE_SHORE_RINGS**
- `2467` **US_STATES**
- `2494` **GLOBE_STATE_SHAPES**
- `2497` **GLOBE_COUNTRY_RINGS**
- `2505` `startGlobeLoop(cv)`
- `2538` `drawGlobe(cv, ctx)`
- `2609` `latRing(lat)`
- `2611` `lonRing(lon)`
- `2613` `drawGlobePath(ctx,m,ring,fill)`
- `2664` `_smoothRing(r, iters)`
- `2680` `smoothFallbackOnce()`

### 2690 · m3-input

- `2754` `globeMark()`
- `2758` `_rebuildGlobeQ()`
- `2767` `_faceLonLatAngles(lon,lat)`
- `2775` `setupGlobeInteraction(cv)`
- `2947` `globeGlideStep(dt)`

### 2957 · m4-camera

- `3053` `cameraCancel()`
- `3066` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3105 · m5-markers

- `3211` `_sitesArr()`
- `3215` `_siteIndex()`
- `3229` `siteById(id)`
- `3240` **CLS_META**
- `3247` `clsOf(id)`
- `3261` `_disc(id, title, bodyHtml, opts)`
- `3286` `_famOffSet()`
- `3299` **LY_MODES**
- `3306` `lyCounts()`
- `3311` `lyShown(off)`
- `3312` `lyModeN(m)`
- `3313` `lyKey()`
- `3320` `lySync()`
- `3335` `_lyRingPaint()`
- `3364` `lyRing(open)`
- `3374` `lyMode(k)`
- `3379` `lyFam(k)`
- `3383` `lyView(v)`
- `3391` `_lyEnsure(id)`
- `3403` `_shPaneLay()`
- `3442` `renderLegend()`
- `3456` `_cssRGB(c, fb)`
- `3467` `_mTok()`
- `3494` `_syncSelArcs(selId)`
- `3563` `_selSyncCheck()`
- `3575` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3613` `drawGlobeLinks(ctx, m)`
- `3638` `_gChromeZones(m)`
- `3664` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3691` `drawGlobeMarkers(ctx, m)`
- `3890` `_glowDot(ctx, x, y, fd, k)`
- `3905` **BF_STREAMS**
- `3920` `_bfNodeLbl(nd)`
- `3921` `_bfAbbr(name)`
- `3937` `_bfFanShort(lbls)`
- `3956` **BF_STAR**
- `3957` `_bfStarKind(n)`
- `3972` `_bfParentOf(id)`
- `3979` `_briefChainMap(opts)`
- `4034` `drawBriefStates(ctx, m, labels)`
- `4128` `_hexTrip(hex)`
- `4134` `drawBriefArcs(ctx, m)`
- `4154` `drawBriefNodes(ctx, m)`
- `4275` `drawMarkersHook(ctx, m)`
- `4298` `siteHitTest(x, y)`

### 4307 · m6-mapdata

- `4378` `_fetchRetry(src, tries)`
- `4391` `_basemapLoad()`
- `4397` `_basemapNetUp()`
- `4403` `loadGlobeCoastlinesHi()`
- `4430` `loadStateBorders()`
- `4461` `_albersUsaInvert(x, y)`
- `4480` `_ringsLookGeographic(rings)`
- `4503` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4548` `_topoSingleUse(topo, objName, projInvert)`
- `4572` `_shoreHarvest()`
- `4610` `loadCountryBorders()`
- `4634` `_decodeTopoLonLat(topo, objName)`
- `4648` `decodeTopoLand(topo)`
- `4674` `_namedStateShapes(topo, geographic)`

### 4694 · s3-search

- `4820` `_srEsc(s)`
- `4821` `_srEscA(v)`
- `4824` `_srFold(s)`
- `4834` `_searchEntries()`
- `4883` `buildSearchIndex()`
- `4887` `_srUserEntries()`
- `4932` `_srBriefEntries()`
- `4943` `sfsResults(q)`
- `4987` `_srFuse()`
- `4994` `sfsRender(res)`
- `4998` `_sfsPaint(res)`
- `5030` `_srRefresh()`
- `5039` `searchSelect(id)`
- `5162` `_sfsField()`
- `5166` `_isSearchField(t)`
- `5214` `initSearch()`
- `5236` `_srInjectCSS()`

### 5242 · s4-dossier

- `5383` `_odEsc(s)`
- `5384` `_odEscA(v)`
- `5398` `_camSnap()`
- `5402` `_camApply(st, o)`
- `5424` `_undoPush()`
- `5443` `tpLive()`
- `5450` `tpSync()`
- `5462` `tpZoom(dir, ramp)`
- `5476` `tpUndo()`
- `5481` `tpClear()`
- `5482` `_tpStop(e)`
- `5489` `_tpRamp()`
- `5494` `_tpWire()`
- `5518` `selectSite(id, o)`
- `5567` `setMode(m)`
- `5607` `renderBrief(view)`
- `5796` `_bdSync()`
- `5808` `_bfTint(hex)`
- `5822` `_bfLeaderTrack()`
- `5869` `_bfFlipCapture(el)`
- `5881` `_bfFlipPlay(el, old)`
- `5918` `_bfSceneDepth()`
- `5922` `_bfViewCapture(point)`
- `5933` `_bfMirrorFit(w,t,L)`
- `5942` `_bfFit(view)`
- `5973` `_bfZoomTo(value,point,finish)`
- `5984` `_bfNavPush()`
- `5992` `bfBack()`
- `6010` `bfPresent(on)`
- `6033` `_bfHistArm()`
- `6073` `_bfFlyFocus()`
- `6099` `_bfExplore(k)`
- `6110` `_bfChartWire(el)`
- `6225` `_trailPush(id)`
- `6233` `_trailClear()`
- `6244` `_flyFitChain()`
- `6276` `_clearBand()`
- `6296` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6310` `_flyPair(aLat,aLon,bLat,bLon)`
- `6328` `clearAll()`
- `6363` `_trailRender()`
- `6370` `tapAtScreen(x, y)`
- `6418` `showDossier(id)`
- `6442` `_sheetFlag()`
- `6449` `hideDossier()`
- `6477` **RC_KINDS**
- `6483` `_odSetTab(t)`
- `6492` `_odRender(s)`
- `6613` `calloutShow(id, at)`
- `6622` `calloutHide()`
- `6627` `_coRefresh()`
- `6628` `_coRender()`
- `6847` `_coAnchor()`
- `6866` `_coPlace()`
- `6907` `_bfPickFoot()`
- `6919` `_bfToast(msg)`
- `7013` **BF_PALETTE**
- `7019` `_bfArmHint()`
- `7030` `_bfTakeParent(fallback)`
- `7042` `_bfPickCandidates(pk,q,kind)`
- `7067` `_bfAddSheet(pk)`
- `7122` `_bfGroupSheet(pk)`
- `7152` **BF_PLACES**
- `7166` `bfPlaceOf(k)`
- `7178` `_bfBranchPlan(rootId, cap)`
- `7194` `bfAddBranch(rootId)`
- `7212` `bfAddMany(ids, parent)`
- `7244` `_bfSelections(k)`
- `7293` `_bfAddUnderBtn(k)`
- `7302` `_bfInvHTML(k)`
- `7327` `_bfPlainSheet(k)`
- `7381` `_bfObjSheet(id)`
- `7509` `_rcContext(id)`
- `7510` `_rcTitle(r,x)`
- `7511` `_rcLabel(id,x)`
- `7512` `_rcRefresh()`
- `7518` `_rcResume(id)`
- `7522` `_rcStart(kind,rid)`
- `7530` `recordURL(value)`
- `7535` `recordCopy(value)`
- `7539` `_rcActions(kind,it)`
- `7551` `_rcCard(id,kind,it)`
- `7563` `_rcOptions(id,cur,allowNew)`
- `7567` `_rcIdPane(id)`
- `7576` `_rcRender(id)`
- `7605` `_rcFormHTML(kind,it,rid)`
- `7624` `_rcFit()`
- `7633` `_rcReadForm()`
- `7640` `_rcCommit()`
- `7659` `_rcDelete(rid)`
- `7666` `_rcUndoDelete()`
- `7675` `_rcOpen(id,rid,xid)`
- `7704` `_odStageClearSync(on)`
- `8220` `initDossier()`
- `8234` `_odInjectCSS()`

### 8314 · s7-records

- `8324` **RECORDS**
- `8327` `_recBlank(id)`
- `8328` `_recFingerprint(value)`
- `8331` `_recNormalize(r)`
- `8355` `recordOf(id)`
- `8356` `recAll()`
- `8357` `_recIndex(r,kind,index)`
- `8358` `_recRid()`
- `8359` `recCount(id)`
- `8366` `_recPersist(r)`
- `8377` `_recSave(id)`
- `8384` `_recStatusText(id)`
- `8394` `recordSaveStatus(id)`
- `8397` `_recStatusPaint()`
- `8400` `_recCloudAck(records)`
- `8404` `_recLoaded(r)`
- `8407` `recAdd(id, kind, item)`
- `8414` `recUpdate(id, kind, idx, item)`
- `8420` `recRemove(id, kind, idx)`
- `8429` `recIds(id)`
- `8430` `_recNextId(id)`
- `8435` `recAddId(id, label)`
- `8445` `recTitleId(id,label,title)`
- `8449` `recDelId(id, label)`
- `8458` `recIdCount(id, label)`
- `8464` `_rdbOpen()`
- `8612` **BRIEF**
- `8614` `_bfSync()`
- `8619` `_bfSave()`
- `8632` `_bfInvClean(a)`
- `8638` `bfNode(k)`
- `8639` `bfKids(k)`
- `8642` `_bfOrgId(id)`
- `8648` `bfHas(id)`
- `8650` `_bfStateKey(name)`
- `8651` `bfStateName(k)`
- `8656` `_bfFrame()`
- `8680` `_xpPulse()`
- `8692` `_bfPush(node)`
- `8703` `bfAdd(id, parent)`
- `8717` `bfAddState(name, parent)`
- `8726` `bfAddCustom(name, parent)`
- `8733` `bfRename(k, name)`
- `8740` `bfRemove(id)`
- `8756` `bfMove(k, newParent)`
- `8770` `bfPlace(k, targetK, after)`
- `8784` `bfReorder(k, dir)`
- `8797` `bfColor(k, hex)`
- `8807` `bfColorTree(k, hex)`
- `8819` `bfStripe(k)`
- `8825` `bfNote(id, text)`
- `8840` `_bfStackPopHide()`
- `8841` `_bfStackPop(lvl)`
- `8877` `bfStack(n)`
- `8886` `bfEye(rootId)`
- `8894` `bfDepth(n)`
- `8917` `_ssTick()`
- `8937` **ORGS**
- `8938` `_orgSave()`
- `8939` `orgById(id)`
- `8940` `orgKidsOf(pid)`
- `8941` `orgAdd(name, parent, base)`
- `8957` `orgRemove(id)`
- `8973` **SAVEDV**
- `8975` `_svSave()`
- `8989` `_shId(r, save)`
- `8993` `_shList(kind)`
- `8994` `_shFind(kind,id)`
- `9001` `_shTrim(A)`
- `9011` `_shScope(v)`
- `9022` `_shGlyph(kind,r)`
- `9038` `_shRow(kind,r,P,i)`
- `9067` `_shPaneShelf(kind,P)`
- `9115` `_shOpen(tab)`
- `9150` `_svOpenSheet()`
- `9151` `svCapture(name)`
- `9162` `svUpdate()`
- `9170` `svRename(id,n)`
- `9174` `svPin(id)`
- `9175` `svRecall(id)`
- `9185` `svRemove(id)`
- `9200` **SAVEDB**
- `9202` `_sbSave()`
- `9207` `sbCapture(name)`
- `9226` `sbUpdate()`
- `9236` `sbLoad(i)`
- `9252` `sbRename(id,n)`
- `9256` `sbPin(id)`
- `9257` `sbRemove(i)`
- `9269` `_sbOpenSheet()`
- `9282` `_lgSiteName(id)`
- `9287` `_ldCounts(c)`
- `9295` `_ldItem(kind,it,id)`
- `9307` `_ldSet(t)`
- `9309` `_ldTabs()`
- `9316` `_ledgerHTML()`
- `9361` `_ledgerEl()`
- `9387` `_inResolve(q)`
- `9402` `_inResolveExact(txt)`
- `9412` **IN_KINDMAP**
- `9415` `_inKind(txt)`
- `9416` `_inItem(kind, name, detail)`
- `9422` `_inCommit(kind, name, detail)`
- `9429` `_inBulkParse(text)`
- `9442` `_inBulkCommit(rows)`
- `9453` `_inGo()`
- `9462` `_inSheet()`
- `9532` `_ledgerRender()`
- `9536` `_ledgerOpen()`
- `9541` `_ledgerClose()`
- `9542` `_repoDoorSync(open)`
- `9545` `_ledgerTap(e)`
- `9558` `_ledgerPaint()`
- `9564` `recBackup()`
- `9568` `recRestore(obj)`
- `9602` **DB_TABLE**
- `9603` `_dbSetState(st, msg)`
- `9613` `_dbCfgSave(cfg)`
- `9617` `_dbIsNet(e)`
- `9624` `_dbWhy(what, e)`
- `9630` `ensureSupabase()`
- `9657` `_dbFetch(input, init)`
- `9663` `_dbSnapshot()`
- `9672` `_dbApply(data)`
- `9721` `_dbChipShow()`
- `9747` `dbPush()`
- `9755` `_dbFlush()`
- `9790` `_dbRetryArm()`
- `9797` `dbPullOnce()`
- `9816` `_dbConnectRun()`
- `9857` `dbConnect()`
- `9869` `_dbAutoBoot()`
- `9879` `dbDisconnect(silent)`
- `9893` `_dbNetUp(why)`
- `9905` `_dbHideFlush()`
- `9913` `_netUp(why)`
- `9931` `_dbSheet()`

### 9969 · s6-export

- `9981` `buildSnapshot(scope, recordFilter)`
- `10042` `_xpRecordSnapshot(rows,filter)`
- `10059` `_xpRecordChoices()`
- `10078` `_xpRecordIds()`
- `10087` `_xpReadFilter()`
- `10094` `_xpRecordBody(sn)`
- `10125` `_xpDownload(name, mime, data)`
- `10134` `_xpStamp()`
- `10136` `_xpSlug(sn)`
- `10152` `_zipStore(parts)`
- `10173` `_pkx(v)`
- `10174` `_pkHex(c)`
- `10175` `_pkInk(hex)`
- `10179` `_deckLayout(C, roots)`
- `10194` `_deckChartXML(C, roots, title, ids)`
- `10228` `_deckSlideXML(inner)`
- `10235` `_pptxParts()`
- `10317` `_pptxBuild()`
- `10318` `xpPptx()`
- `10334` `_xlCol(i)`
- `10335` `_xlSheet(rows, widths)`
- `10351` `_xlsxParts()`
- `10422` `_xlsxBuild()`
- `10423` `xpXlsx()`
- `10432` `exportPNG()`
- `10452` `_xpDossierBody(sn)`
- `10507` `exportPDF(recordFilter)`
- `10517` `exportHTML(recordFilter)`
- `10528` `exportJSON(recordFilter)`

### 10557 · s5-clocks

- `10609` `_tzAbbr(tz, d)`
- `10617` `_ledTime(tz, d, secs)`
- `10627` `civilianTime(tz, d)`
- `10638` `_ckEsc(v)`
- `10641` **CLOCK_REGIONS**
- `10659` `_selSave()`
- `10679` `nearRegion(lat, lon)`
- `10728` `_tzForSite(site)`
- `10737` `autoFillSelect(site)`
- `10746` `pickZone(tz, label)`
- `10755` `tickClocks()`
- `10777` `_ckBeat()`
- `10788` `_ckArm()`
- `10794` `_ckWake()`
- `10802` `_tzOpenSheet()`
- `10830` `initClocks()`
- `10862` `bootShell()`
- `11229` `_bootPaint(ctx, m)`
- `11311` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `Intake` · `_inQT` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `_pptxParts` · `_pptxBuild` · `xpPptx` · `_zipCRC` · `_zipStore` · `_xlsxParts` · `_xlsxBuild` · `xpXlsx` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#inSiteQ` · `#inF1` · `#inF2` · `#inBulk` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbCode` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#rId1` · `#snapshot`
