# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.9.0** — 759,118 bytes, 11,108 lines, 356 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5358–8429 | 199.1 KB |
| <style> — all CSS | 173–1294 | 73.9 KB |
| m5-markers | 3140–4422 | 70.6 KB |
| s7-records | 8430–9693 | 69.1 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2207–2213 | 49.0 KB |
| s5-clocks | 10282–11108 | 45.5 KB |
| s6-export | 9694–10281 | 44.8 KB |
| CHANGELOG (in-file release ledger) | 1743–2206 | 33.1 KB |
| s3-search | 4810–5357 | 29.5 KB |
| m2-render | 2433–2724 | 25.6 KB |
| m6-mapdata | 4423–4809 | 20.1 KB |
| m3-input | 2725–2991 | 16.3 KB |
| <body> — markup | 1577–1741 | 13.6 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1402–1557 | 10.9 KB |
| m4-camera | 2992–3139 | 9.9 KB |
| m1-geom | 2289–2432 | 7.7 KB |
| <script> — the application | 57–172 | 7.6 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1295–1372 | 5.6 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2214–2288 | 3.7 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1295 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1373 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1402 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1558 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1566 | <style> — all CSS | boundary |
| 1577 | <body> — markup | boundary |
| 1742 | <script> — the application | boundary |
| 1743 | CHANGELOG (in-file release ledger) | prose |
| 2207 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2214 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2289 | m1-geom | module |
| 2433 | m2-render | module |
| 2725 | m3-input | module |
| 2992 | m4-camera | module |
| 3140 | m5-markers | module |
| 4423 | m6-mapdata | module |
| 4810 | s3-search | module |
| 5358 | s4-dossier | module |
| 8430 | s7-records | module |
| 9694 | s6-export | module |
| 10282 | s5-clocks | module |

## Functions by section

### 1743 · CHANGELOG (in-file release ledger)

- `2114` **APP_VERSION**
- `2115` **APP_UPDATED**

### 2207 · DATA: SITES literal (inline copy of data/sites.json)

- `2207` **SITES**

### 2214 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2214` **A1ORGS**
- `2257` `_ogBuild()`
- `2270` `orgOf(id)`
- `2271` `ogKids(id)`
- `2272` `ogEffSite(id)`
- `2273` `ogAtSite(siteId)`
- `2275` `ogPrimary(siteId)`
- `2280` `ogChainUp(id)`

### 2289 · m1-geom

- `2338` `_qMul(a,b)`
- `2348` `_qNorm(q)`
- `2350` `_qFromAxisAngle(ax,ay,az,ang)`
- `2354` `lonLatToVec(lon, lat)`
- `2362` `_setGlobeRot(rotLon, rotLat)`
- `2375` `_projectLonLat(lon, lat, m)`
- `2386` `_projectVec(v, m)`
- `2399` `_visibleLonLat(lon, lat, tol)`
- `2409` `globeMetrics(cv)`
- `2421` `_ringXYZ(ring)`

### 2433 · m2-render

- `2486` **GLOBE_FALLBACK_RINGS**
- `2487` **GLOBE_RINGS**
- `2489` **GLOBE_STATE_RINGS**
- `2490` **GLOBE_SHORE_RINGS**
- `2494` **US_STATES**
- `2521` **GLOBE_STATE_SHAPES**
- `2524` **GLOBE_COUNTRY_RINGS**
- `2532` `startGlobeLoop(cv)`
- `2570` `drawGlobe(cv, ctx)`
- `2644` `latRing(lat)`
- `2646` `lonRing(lon)`
- `2648` `drawGlobePath(ctx,m,ring,fill)`
- `2699` `_smoothRing(r, iters)`
- `2715` `smoothFallbackOnce()`

### 2725 · m3-input

- `2789` `globeMark()`
- `2793` `_rebuildGlobeQ()`
- `2802` `_faceLonLatAngles(lon,lat)`
- `2810` `setupGlobeInteraction(cv)`
- `2982` `globeGlideStep(dt)`

### 2992 · m4-camera

- `3088` `cameraCancel()`
- `3101` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3140 · m5-markers

- `3246` `_sitesArr()`
- `3250` `_siteIndex()`
- `3264` `siteById(id)`
- `3275` **CLS_META**
- `3282` `clsOf(id)`
- `3296` `_disc(id, title, bodyHtml, opts)`
- `3321` `_famOffSet()`
- `3334` **LY_MODES**
- `3341` `lyCounts()`
- `3346` `lyShown(off)`
- `3347` `lyModeN(m)`
- `3348` `lyKey()`
- `3355` `lySync()`
- `3370` `_lyRingPaint()`
- `3407` `lyRing(open)`
- `3417` `lyMode(k)`
- `3422` `lyFam(k)`
- `3426` `lyView(v)`
- `3441` **LIVE_POLL_MS**
- `3442` **LIVE_ENDPOINT**
- `3444` `liveAssetsToggle()`
- `3448` `_liveStart()`
- `3453` `_liveStop()`
- `3458` `_liveFetch()`
- `3481` `_drawLiveAssets(ctx, m)`
- `3507` `_lyEnsure(id)`
- `3519` `_shPaneLay()`
- `3558` `renderLegend()`
- `3572` `_cssRGB(c, fb)`
- `3583` `_mTok()`
- `3610` `_syncSelArcs(selId)`
- `3679` `_selSyncCheck()`
- `3691` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3729` `drawGlobeLinks(ctx, m)`
- `3754` `_gChromeZones(m)`
- `3780` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3807` `drawGlobeMarkers(ctx, m)`
- `4006` `_glowDot(ctx, x, y, fd, k)`
- `4021` **BF_STREAMS**
- `4036` `_bfNodeLbl(nd)`
- `4037` `_bfAbbr(name)`
- `4053` `_bfFanShort(lbls)`
- `4072` **BF_STAR**
- `4073` `_bfStarKind(n)`
- `4088` `_bfParentOf(id)`
- `4095` `_briefChainMap(opts)`
- `4150` `drawBriefStates(ctx, m, labels)`
- `4244` `_hexTrip(hex)`
- `4250` `drawBriefArcs(ctx, m)`
- `4270` `drawBriefNodes(ctx, m)`
- `4391` `drawMarkersHook(ctx, m)`
- `4414` `siteHitTest(x, y)`

### 4423 · m6-mapdata

- `4494` `_fetchRetry(src, tries)`
- `4507` `_basemapLoad()`
- `4513` `_basemapNetUp()`
- `4519` `loadGlobeCoastlinesHi()`
- `4546` `loadStateBorders()`
- `4577` `_albersUsaInvert(x, y)`
- `4596` `_ringsLookGeographic(rings)`
- `4619` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4664` `_topoSingleUse(topo, objName, projInvert)`
- `4688` `_shoreHarvest()`
- `4726` `loadCountryBorders()`
- `4750` `_decodeTopoLonLat(topo, objName)`
- `4764` `decodeTopoLand(topo)`
- `4790` `_namedStateShapes(topo, geographic)`

### 4810 · s3-search

- `4936` `_srEsc(s)`
- `4937` `_srEscA(v)`
- `4940` `_srFold(s)`
- `4950` `_searchEntries()`
- `4999` `buildSearchIndex()`
- `5003` `_srUserEntries()`
- `5048` `_srBriefEntries()`
- `5059` `sfsResults(q)`
- `5103` `_srFuse()`
- `5110` `sfsRender(res)`
- `5114` `_sfsPaint(res)`
- `5146` `_srRefresh()`
- `5155` `searchSelect(id)`
- `5278` `_sfsField()`
- `5282` `_isSearchField(t)`
- `5330` `initSearch()`
- `5352` `_srInjectCSS()`

### 5358 · s4-dossier

- `5499` `_odEsc(s)`
- `5500` `_odEscA(v)`
- `5514` `_camSnap()`
- `5518` `_camApply(st, o)`
- `5540` `_undoPush()`
- `5559` `tpLive()`
- `5566` `tpSync()`
- `5578` `tpZoom(dir, ramp)`
- `5592` `tpUndo()`
- `5597` `tpClear()`
- `5598` `_tpStop(e)`
- `5605` `_tpRamp()`
- `5610` `_tpWire()`
- `5634` `selectSite(id, o)`
- `5683` `setMode(m)`
- `5723` `renderBrief(view)`
- `5912` `_bdSync()`
- `5924` `_bfTint(hex)`
- `5938` `_bfLeaderTrack()`
- `5985` `_bfFlipCapture(el)`
- `5997` `_bfFlipPlay(el, old)`
- `6034` `_bfSceneDepth()`
- `6038` `_bfViewCapture(point)`
- `6049` `_bfMirrorFit(w,t,L)`
- `6058` `_bfFit(view)`
- `6089` `_bfZoomTo(value,point,finish)`
- `6100` `_bfNavPush()`
- `6108` `bfBack()`
- `6126` `bfPresent(on)`
- `6149` `_bfHistArm()`
- `6189` `_bfFlyFocus()`
- `6215` `_bfExplore(k)`
- `6226` `_bfChartWire(el)`
- `6341` `_trailPush(id)`
- `6349` `_trailClear()`
- `6360` `_flyFitChain()`
- `6392` `_clearBand()`
- `6412` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6426` `_flyPair(aLat,aLon,bLat,bLon)`
- `6444` `clearAll()`
- `6479` `_trailRender()`
- `6486` `tapAtScreen(x, y)`
- `6534` `showDossier(id)`
- `6558` `_sheetFlag()`
- `6565` `hideDossier()`
- `6593` **RC_KINDS**
- `6599` `_odSetTab(t)`
- `6608` `_odRender(s)`
- `6729` `calloutShow(id, at)`
- `6738` `calloutHide()`
- `6743` `_coRefresh()`
- `6744` `_coRender()`
- `6963` `_coAnchor()`
- `6982` `_coPlace()`
- `7023` `_bfPickFoot()`
- `7035` `_bfToast(msg)`
- `7129` **BF_PALETTE**
- `7135` `_bfArmHint()`
- `7146` `_bfTakeParent(fallback)`
- `7158` `_bfPickCandidates(pk,q,kind)`
- `7183` `_bfAddSheet(pk)`
- `7238` `_bfGroupSheet(pk)`
- `7268` **BF_PLACES**
- `7282` `bfPlaceOf(k)`
- `7294` `_bfBranchPlan(rootId, cap)`
- `7310` `bfAddBranch(rootId)`
- `7328` `bfAddMany(ids, parent)`
- `7360` `_bfSelections(k)`
- `7409` `_bfAddUnderBtn(k)`
- `7418` `_bfInvHTML(k)`
- `7443` `_bfPlainSheet(k)`
- `7497` `_bfObjSheet(id)`
- `7625` `_rcContext(id)`
- `7626` `_rcTitle(r,x)`
- `7627` `_rcLabel(id,x)`
- `7628` `_rcRefresh()`
- `7634` `_rcResume(id)`
- `7638` `_rcStart(kind,rid)`
- `7646` `recordURL(value)`
- `7651` `recordCopy(value)`
- `7655` `_rcActions(kind,it)`
- `7667` `_rcCard(id,kind,it)`
- `7679` `_rcOptions(id,cur,allowNew)`
- `7683` `_rcIdPane(id)`
- `7692` `_rcRender(id)`
- `7721` `_rcFormHTML(kind,it,rid)`
- `7740` `_rcFit()`
- `7749` `_rcReadForm()`
- `7756` `_rcCommit()`
- `7775` `_rcDelete(rid)`
- `7782` `_rcUndoDelete()`
- `7791` `_rcOpen(id,rid,xid)`
- `7820` `_odStageClearSync(on)`
- `8336` `initDossier()`
- `8350` `_odInjectCSS()`

### 8430 · s7-records

- `8440` **RECORDS**
- `8443` `_recBlank(id)`
- `8444` `_recFingerprint(value)`
- `8447` `_recNormalize(r)`
- `8471` `recordOf(id)`
- `8472` `recAll()`
- `8473` `_recIndex(r,kind,index)`
- `8474` `_recRid()`
- `8475` `recCount(id)`
- `8482` `_recPersist(r)`
- `8493` `_recSave(id)`
- `8499` `_recStatusText(id)`
- `8505` `recordSaveStatus(id)`
- `8508` `_recStatusPaint()`
- `8511` `_recLoaded(r)`
- `8514` `recAdd(id, kind, item)`
- `8521` `recUpdate(id, kind, idx, item)`
- `8527` `recRemove(id, kind, idx)`
- `8536` `recIds(id)`
- `8537` `_recNextId(id)`
- `8542` `recAddId(id, label)`
- `8552` `recTitleId(id,label,title)`
- `8556` `recDelId(id, label)`
- `8565` `recIdCount(id, label)`
- `8571` `_rdbOpen()`
- `8708` **BRIEF**
- `8710` `_bfSync()`
- `8715` `_bfSave()`
- `8728` `_bfInvClean(a)`
- `8734` `bfNode(k)`
- `8735` `bfKids(k)`
- `8738` `_bfOrgId(id)`
- `8744` `bfHas(id)`
- `8746` `_bfStateKey(name)`
- `8747` `bfStateName(k)`
- `8752` `_bfFrame()`
- `8776` `_xpPulse()`
- `8788` `_bfPush(node)`
- `8799` `bfAdd(id, parent)`
- `8813` `bfAddState(name, parent)`
- `8822` `bfAddCustom(name, parent)`
- `8829` `bfRename(k, name)`
- `8836` `bfRemove(id)`
- `8852` `bfMove(k, newParent)`
- `8866` `bfPlace(k, targetK, after)`
- `8880` `bfReorder(k, dir)`
- `8893` `bfColor(k, hex)`
- `8903` `bfColorTree(k, hex)`
- `8915` `bfStripe(k)`
- `8921` `bfNote(id, text)`
- `8936` `_bfStackPopHide()`
- `8937` `_bfStackPop(lvl)`
- `8973` `bfStack(n)`
- `8982` `bfEye(rootId)`
- `8990` `bfDepth(n)`
- `9013` `_ssTick()`
- `9033` **ORGS**
- `9034` `_orgSave()`
- `9035` `orgById(id)`
- `9036` `orgKidsOf(pid)`
- `9037` `orgAdd(name, parent, base)`
- `9053` `orgRemove(id)`
- `9069` **SAVEDV**
- `9071` `_svSave()`
- `9084` `_shId(r, save)`
- `9088` `_shList(kind)`
- `9089` `_shFind(kind,id)`
- `9096` `_shTrim(A)`
- `9106` `_shScope(v)`
- `9117` `_shGlyph(kind,r)`
- `9133` `_shRow(kind,r,P,i)`
- `9162` `_shPaneShelf(kind,P)`
- `9207` `_shOpen(tab)`
- `9242` `_svOpenSheet()`
- `9243` `svCapture(name)`
- `9254` `svUpdate()`
- `9262` `svRename(id,n)`
- `9266` `svPin(id)`
- `9267` `svRecall(id)`
- `9277` `svRemove(id)`
- `9292` **SAVEDB**
- `9294` `_sbSave()`
- `9298` `sbCapture(name)`
- `9317` `sbUpdate()`
- `9327` `sbLoad(i)`
- `9343` `sbRename(id,n)`
- `9347` `sbPin(id)`
- `9348` `sbRemove(i)`
- `9360` `_sbOpenSheet()`
- `9373` `_lgSiteName(id)`
- `9378` `_ldCounts(c)`
- `9386` `_ldItem(kind,it,id)`
- `9398` `_ldSet(t)`
- `9400` `_ldTabs()`
- `9407` `_ledgerHTML()`
- `9452` `_ledgerEl()`
- `9478` `_inResolve(q)`
- `9493` `_inResolveExact(txt)`
- `9503` **IN_KINDMAP**
- `9506` `_inKind(txt)`
- `9507` `_inItem(kind, name, detail)`
- `9513` `_inCommit(kind, name, detail)`
- `9520` `_inBulkParse(text)`
- `9533` `_inBulkCommit(rows)`
- `9544` `_inGo()`
- `9553` `_inSheet()`
- `9623` `_ledgerRender()`
- `9627` `_ledgerOpen()`
- `9632` `_ledgerClose()`
- `9633` `_repoDoorSync(open)`
- `9636` `_ledgerTap(e)`
- `9649` `_ledgerPaint()`
- `9655` `recBackup()`
- `9659` `recRestore(obj)`
- `9686` `_netUp(why)`

### 9694 · s6-export

- `9706` `buildSnapshot(scope, recordFilter)`
- `9767` `_xpRecordSnapshot(rows,filter)`
- `9784` `_xpRecordChoices()`
- `9803` `_xpRecordIds()`
- `9812` `_xpReadFilter()`
- `9819` `_xpRecordBody(sn)`
- `9850` `_xpDownload(name, mime, data)`
- `9859` `_xpStamp()`
- `9861` `_xpSlug(sn)`
- `9877` `_zipStore(parts)`
- `9898` `_pkx(v)`
- `9899` `_pkHex(c)`
- `9900` `_pkInk(hex)`
- `9904` `_deckLayout(C, roots)`
- `9919` `_deckChartXML(C, roots, title, ids)`
- `9953` `_deckSlideXML(inner)`
- `9960` `_pptxParts()`
- `10042` `_pptxBuild()`
- `10043` `xpPptx()`
- `10059` `_xlCol(i)`
- `10060` `_xlSheet(rows, widths)`
- `10076` `_xlsxParts()`
- `10147` `_xlsxBuild()`
- `10148` `xpXlsx()`
- `10157` `exportPNG()`
- `10177` `_xpDossierBody(sn)`
- `10232` `exportPDF(recordFilter)`
- `10242` `exportHTML(recordFilter)`
- `10253` `exportJSON(recordFilter)`

### 10282 · s5-clocks

- `10334` `_tzAbbr(tz, d)`
- `10342` `_ledTime(tz, d, secs)`
- `10352` `civilianTime(tz, d)`
- `10363` `_ckEsc(v)`
- `10366` **CLOCK_REGIONS**
- `10384` `_selSave()`
- `10404` `nearRegion(lat, lon)`
- `10453` `_tzForSite(site)`
- `10462` `autoFillSelect(site)`
- `10471` `pickZone(tz, label)`
- `10480` `tickClocks()`
- `10502` `_ckBeat()`
- `10513` `_ckArm()`
- `10519` `_ckWake()`
- `10527` `_tzOpenSheet()`
- `10555` `initClocks()`
- `10587` `bootShell()`
- `10924` `_bootPaint(ctx, m)`
- `11006` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `Intake` · `_inQT` · `_ledgerPaint` · `Repo` · `Records` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `_pptxParts` · `_pptxBuild` · `xpPptx` · `_zipCRC` · `_zipStore` · `_xlsxParts` · `_xlsxBuild` · `xpXlsx` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#inSiteQ` · `#inF1` · `#inF2` · `#inBulk` · `#xpRecordSite` · `#xpRecordId` · `#rId1` · `#snapshot`
