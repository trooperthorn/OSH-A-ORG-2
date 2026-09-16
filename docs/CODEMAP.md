# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v2.5.0** — 751,010 bytes, 11,176 lines, 363 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| s4-dossier | 5196–8251 | 194.8 KB |
| s7-records | 8252–9731 | 80.2 KB |
| <style> — all CSS | 173–1292 | 72.7 KB |
| m5-markers | 3059–4260 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 2134–2140 | 49.0 KB |
| s5-clocks | 10320–11176 | 46.6 KB |
| s6-export | 9732–10319 | 44.2 KB |
| s3-search | 4648–5195 | 28.9 KB |
| CHANGELOG (in-file release ledger) | 1768–2133 | 25.6 KB |
| m2-render | 2360–2643 | 24.7 KB |
| m6-mapdata | 4261–4647 | 19.8 KB |
| m3-input | 2644–2910 | 16.1 KB |
| <body> — markup | 1602–1766 | 13.5 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1427–1582 | 10.8 KB |
| m4-camera | 2911–3058 | 9.8 KB |
| m1-geom | 2216–2359 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1293–1397 | 7.4 KB |
| DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | 2141–2215 | 3.6 KB |
| <script> — the application | 16–56 | 2.2 KB |

## Sections in file order

| Line | Section | Kind |
|---|---|---|
| 16 | <script> — the application | boundary |
| 57 | <script> — the application | boundary |
| 173 | <style> — all CSS | boundary |
| 1293 | v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | css |
| 1398 | v0.5.0 BRIEF 2.0 — add action · annotations · selected box | css |
| 1427 | THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | css |
| 1583 | GOOGLE-FEEL FUSION — open results and the pill become ONE surface | css |
| 1591 | <style> — all CSS | boundary |
| 1602 | <body> — markup | boundary |
| 1767 | <script> — the application | boundary |
| 1768 | CHANGELOG (in-file release ledger) | prose |
| 2134 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 2141 | DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json) | data |
| 2216 | m1-geom | module |
| 2360 | m2-render | module |
| 2644 | m3-input | module |
| 2911 | m4-camera | module |
| 3059 | m5-markers | module |
| 4261 | m6-mapdata | module |
| 4648 | s3-search | module |
| 5196 | s4-dossier | module |
| 8252 | s7-records | module |
| 9732 | s6-export | module |
| 10320 | s5-clocks | module |

## Functions by section

### 1768 · CHANGELOG (in-file release ledger)

- `2041` **APP_VERSION**
- `2042` **APP_UPDATED**

### 2134 · DATA: SITES literal (inline copy of data/sites.json)

- `2134` **SITES**

### 2141 · DATA: A1ORGS placeholder + fetched-spine loader (rows ride data/orgs.json)

- `2141` **A1ORGS**
- `2184` `_ogBuild()`
- `2197` `orgOf(id)`
- `2198` `ogKids(id)`
- `2199` `ogEffSite(id)`
- `2200` `ogAtSite(siteId)`
- `2202` `ogPrimary(siteId)`
- `2207` `ogChainUp(id)`

### 2216 · m1-geom

- `2265` `_qMul(a,b)`
- `2275` `_qNorm(q)`
- `2277` `_qFromAxisAngle(ax,ay,az,ang)`
- `2281` `lonLatToVec(lon, lat)`
- `2289` `_setGlobeRot(rotLon, rotLat)`
- `2302` `_projectLonLat(lon, lat, m)`
- `2313` `_projectVec(v, m)`
- `2326` `_visibleLonLat(lon, lat, tol)`
- `2336` `globeMetrics(cv)`
- `2348` `_ringXYZ(ring)`

### 2360 · m2-render

- `2413` **GLOBE_FALLBACK_RINGS**
- `2414` **GLOBE_RINGS**
- `2416` **GLOBE_STATE_RINGS**
- `2417` **GLOBE_SHORE_RINGS**
- `2421` **US_STATES**
- `2448` **GLOBE_STATE_SHAPES**
- `2451` **GLOBE_COUNTRY_RINGS**
- `2459` `startGlobeLoop(cv)`
- `2492` `drawGlobe(cv, ctx)`
- `2563` `latRing(lat)`
- `2565` `lonRing(lon)`
- `2567` `drawGlobePath(ctx,m,ring,fill)`
- `2618` `_smoothRing(r, iters)`
- `2634` `smoothFallbackOnce()`

### 2644 · m3-input

- `2708` `globeMark()`
- `2712` `_rebuildGlobeQ()`
- `2721` `_faceLonLatAngles(lon,lat)`
- `2729` `setupGlobeInteraction(cv)`
- `2901` `globeGlideStep(dt)`

### 2911 · m4-camera

- `3007` `cameraCancel()`
- `3020` `flyToLatLon(lat, lon, zoom, onArrive)`

### 3059 · m5-markers

- `3165` `_sitesArr()`
- `3169` `_siteIndex()`
- `3183` `siteById(id)`
- `3194` **CLS_META**
- `3201` `clsOf(id)`
- `3215` `_disc(id, title, bodyHtml, opts)`
- `3240` `_famOffSet()`
- `3253` **LY_MODES**
- `3260` `lyCounts()`
- `3265` `lyShown(off)`
- `3266` `lyModeN(m)`
- `3267` `lyKey()`
- `3274` `lySync()`
- `3289` `_lyRingPaint()`
- `3318` `lyRing(open)`
- `3328` `lyMode(k)`
- `3333` `lyFam(k)`
- `3337` `lyView(v)`
- `3345` `_lyEnsure(id)`
- `3357` `_shPaneLay()`
- `3396` `renderLegend()`
- `3410` `_cssRGB(c, fb)`
- `3421` `_mTok()`
- `3448` `_syncSelArcs(selId)`
- `3517` `_selSyncCheck()`
- `3529` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3567` `drawGlobeLinks(ctx, m)`
- `3592` `_gChromeZones(m)`
- `3618` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3645` `drawGlobeMarkers(ctx, m)`
- `3844` `_glowDot(ctx, x, y, fd, k)`
- `3859` **BF_STREAMS**
- `3874` `_bfNodeLbl(nd)`
- `3875` `_bfAbbr(name)`
- `3891` `_bfFanShort(lbls)`
- `3910` **BF_STAR**
- `3911` `_bfStarKind(n)`
- `3926` `_bfParentOf(id)`
- `3933` `_briefChainMap(opts)`
- `3988` `drawBriefStates(ctx, m, labels)`
- `4082` `_hexTrip(hex)`
- `4088` `drawBriefArcs(ctx, m)`
- `4108` `drawBriefNodes(ctx, m)`
- `4229` `drawMarkersHook(ctx, m)`
- `4252` `siteHitTest(x, y)`

### 4261 · m6-mapdata

- `4332` `_fetchRetry(src, tries)`
- `4345` `_basemapLoad()`
- `4351` `_basemapNetUp()`
- `4357` `loadGlobeCoastlinesHi()`
- `4384` `loadStateBorders()`
- `4415` `_albersUsaInvert(x, y)`
- `4434` `_ringsLookGeographic(rings)`
- `4457` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4502` `_topoSingleUse(topo, objName, projInvert)`
- `4526` `_shoreHarvest()`
- `4564` `loadCountryBorders()`
- `4588` `_decodeTopoLonLat(topo, objName)`
- `4602` `decodeTopoLand(topo)`
- `4628` `_namedStateShapes(topo, geographic)`

### 4648 · s3-search

- `4774` `_srEsc(s)`
- `4775` `_srEscA(v)`
- `4778` `_srFold(s)`
- `4788` `_searchEntries()`
- `4837` `buildSearchIndex()`
- `4841` `_srUserEntries()`
- `4886` `_srBriefEntries()`
- `4897` `sfsResults(q)`
- `4941` `_srFuse()`
- `4948` `sfsRender(res)`
- `4952` `_sfsPaint(res)`
- `4984` `_srRefresh()`
- `4993` `searchSelect(id)`
- `5116` `_sfsField()`
- `5120` `_isSearchField(t)`
- `5168` `initSearch()`
- `5190` `_srInjectCSS()`

### 5196 · s4-dossier

- `5337` `_odEsc(s)`
- `5338` `_odEscA(v)`
- `5352` `_camSnap()`
- `5356` `_camApply(st, o)`
- `5378` `_undoPush()`
- `5397` `tpLive()`
- `5404` `tpSync()`
- `5416` `tpZoom(dir, ramp)`
- `5430` `tpUndo()`
- `5435` `tpClear()`
- `5436` `_tpStop(e)`
- `5443` `_tpRamp()`
- `5448` `_tpWire()`
- `5472` `selectSite(id, o)`
- `5521` `setMode(m)`
- `5561` `renderBrief(view)`
- `5750` `_bdSync()`
- `5762` `_bfTint(hex)`
- `5776` `_bfLeaderTrack()`
- `5823` `_bfFlipCapture(el)`
- `5835` `_bfFlipPlay(el, old)`
- `5872` `_bfSceneDepth()`
- `5876` `_bfViewCapture(point)`
- `5887` `_bfMirrorFit(w,t,L)`
- `5896` `_bfFit(view)`
- `5927` `_bfZoomTo(value,point,finish)`
- `5938` `_bfNavPush()`
- `5946` `bfBack()`
- `5964` `bfPresent(on)`
- `5987` `_bfHistArm()`
- `6027` `_bfFlyFocus()`
- `6053` `_bfExplore(k)`
- `6064` `_bfChartWire(el)`
- `6179` `_trailPush(id)`
- `6187` `_trailClear()`
- `6198` `_flyFitChain()`
- `6230` `_clearBand()`
- `6250` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `6264` `_flyPair(aLat,aLon,bLat,bLon)`
- `6282` `clearAll()`
- `6317` `_trailRender()`
- `6324` `tapAtScreen(x, y)`
- `6372` `showDossier(id)`
- `6396` `_sheetFlag()`
- `6403` `hideDossier()`
- `6431` **RC_KINDS**
- `6437` `_odSetTab(t)`
- `6446` `_odRender(s)`
- `6567` `calloutShow(id, at)`
- `6576` `calloutHide()`
- `6581` `_coRefresh()`
- `6582` `_coRender()`
- `6801` `_coAnchor()`
- `6820` `_coPlace()`
- `6861` `_bfPickFoot()`
- `6873` `_bfToast(msg)`
- `6967` **BF_PALETTE**
- `6973` `_bfArmHint()`
- `6984` `_bfTakeParent(fallback)`
- `6996` `_bfPickCandidates(pk,q,kind)`
- `7021` `_bfAddSheet(pk)`
- `7076` `_bfGroupSheet(pk)`
- `7106` **BF_PLACES**
- `7120` `bfPlaceOf(k)`
- `7132` `_bfBranchPlan(rootId, cap)`
- `7148` `bfAddBranch(rootId)`
- `7166` `bfAddMany(ids, parent)`
- `7198` `_bfSelections(k)`
- `7247` `_bfAddUnderBtn(k)`
- `7256` `_bfInvHTML(k)`
- `7281` `_bfPlainSheet(k)`
- `7335` `_bfObjSheet(id)`
- `7463` `_rcContext(id)`
- `7464` `_rcTitle(r,x)`
- `7465` `_rcLabel(id,x)`
- `7466` `_rcRefresh()`
- `7472` `_rcResume(id)`
- `7476` `_rcStart(kind,rid)`
- `7484` `recordURL(value)`
- `7489` `recordCopy(value)`
- `7493` `_rcActions(kind,it)`
- `7505` `_rcCard(id,kind,it)`
- `7517` `_rcOptions(id,cur,allowNew)`
- `7521` `_rcIdPane(id)`
- `7530` `_rcRender(id)`
- `7559` `_rcFormHTML(kind,it,rid)`
- `7578` `_rcFit()`
- `7587` `_rcReadForm()`
- `7594` `_rcCommit()`
- `7613` `_rcDelete(rid)`
- `7620` `_rcUndoDelete()`
- `7629` `_rcOpen(id,rid,xid)`
- `7658` `_odStageClearSync(on)`
- `8158` `initDossier()`
- `8172` `_odInjectCSS()`

### 8252 · s7-records

- `8262` **RECORDS**
- `8265` `_recBlank(id)`
- `8266` `_recFingerprint(value)`
- `8269` `_recNormalize(r)`
- `8293` `recordOf(id)`
- `8294` `recAll()`
- `8295` `_recIndex(r,kind,index)`
- `8296` `_recRid()`
- `8297` `recCount(id)`
- `8304` `_recPersist(r)`
- `8315` `_recSave(id)`
- `8322` `_recStatusText(id)`
- `8332` `recordSaveStatus(id)`
- `8335` `_recStatusPaint()`
- `8338` `_recCloudAck(records)`
- `8342` `_recLoaded(r)`
- `8345` `recAdd(id, kind, item)`
- `8352` `recUpdate(id, kind, idx, item)`
- `8358` `recRemove(id, kind, idx)`
- `8367` `recIds(id)`
- `8368` `_recNextId(id)`
- `8373` `recAddId(id, label)`
- `8383` `recTitleId(id,label,title)`
- `8387` `recDelId(id, label)`
- `8396` `recIdCount(id, label)`
- `8402` `_rdbOpen()`
- `8550` **BRIEF**
- `8552` `_bfSync()`
- `8557` `_bfSave()`
- `8570` `_bfInvClean(a)`
- `8576` `bfNode(k)`
- `8577` `bfKids(k)`
- `8580` `_bfOrgId(id)`
- `8586` `bfHas(id)`
- `8588` `_bfStateKey(name)`
- `8589` `bfStateName(k)`
- `8594` `_bfFrame()`
- `8618` `_xpPulse()`
- `8630` `_bfPush(node)`
- `8641` `bfAdd(id, parent)`
- `8655` `bfAddState(name, parent)`
- `8664` `bfAddCustom(name, parent)`
- `8671` `bfRename(k, name)`
- `8678` `bfRemove(id)`
- `8694` `bfMove(k, newParent)`
- `8708` `bfPlace(k, targetK, after)`
- `8722` `bfReorder(k, dir)`
- `8735` `bfColor(k, hex)`
- `8745` `bfColorTree(k, hex)`
- `8757` `bfStripe(k)`
- `8763` `bfNote(id, text)`
- `8778` `_bfStackPopHide()`
- `8779` `_bfStackPop(lvl)`
- `8815` `bfStack(n)`
- `8824` `bfEye(rootId)`
- `8832` `bfDepth(n)`
- `8855` `_ssTick()`
- `8875` **ORGS**
- `8876` `_orgSave()`
- `8877` `orgById(id)`
- `8878` `orgKidsOf(pid)`
- `8879` `orgAdd(name, parent, base)`
- `8895` `orgRemove(id)`
- `8911` **SAVEDV**
- `8913` `_svSave()`
- `8927` `_shId(r, save)`
- `8931` `_shList(kind)`
- `8932` `_shFind(kind,id)`
- `8939` `_shTrim(A)`
- `8949` `_shScope(v)`
- `8960` `_shGlyph(kind,r)`
- `8976` `_shRow(kind,r,P,i)`
- `9005` `_shPaneShelf(kind,P)`
- `9053` `_shOpen(tab)`
- `9088` `_svOpenSheet()`
- `9089` `svCapture(name)`
- `9100` `svUpdate()`
- `9108` `svRename(id,n)`
- `9112` `svPin(id)`
- `9113` `svRecall(id)`
- `9123` `svRemove(id)`
- `9138` **SAVEDB**
- `9140` `_sbSave()`
- `9145` `sbCapture(name)`
- `9164` `sbUpdate()`
- `9174` `sbLoad(i)`
- `9190` `sbRename(id,n)`
- `9194` `sbPin(id)`
- `9195` `sbRemove(i)`
- `9207` `_sbOpenSheet()`
- `9220` `_lgSiteName(id)`
- `9225` `_ldCounts(c)`
- `9233` `_ldItem(kind,it,id)`
- `9245` `_ldSet(t)`
- `9247` `_ldTabs()`
- `9254` `_ledgerHTML()`
- `9298` `_ledgerEl()`
- `9310` `_ledgerRender()`
- `9314` `_ledgerOpen()`
- `9319` `_ledgerClose()`
- `9320` `_repoDoorSync(open)`
- `9323` `_ledgerTap(e)`
- `9335` `_ledgerPaint()`
- `9341` `recBackup()`
- `9345` `recRestore(obj)`
- `9378` **DB_TABLE**
- `9379` `_dbSetState(st, msg)`
- `9389` `_dbCfgSave(cfg)`
- `9393` `_dbIsNet(e)`
- `9400` `_dbWhy(what, e)`
- `9406` `ensureSupabase()`
- `9433` `_dbFetch(input, init)`
- `9439` `_dbSnapshot()`
- `9448` `_dbApply(data)`
- `9497` `_dbChipShow()`
- `9523` `dbPush()`
- `9530` `_dbFlush()`
- `9555` `_dbRetryArm()`
- `9562` `dbPullOnce()`
- `9581` `_dbConnectRun()`
- `9621` `dbConnect()`
- `9633` `_dbAutoBoot()`
- `9643` `dbDisconnect(silent)`
- `9657` `_dbNetUp(why)`
- `9669` `_dbHideFlush()`
- `9677` `_netUp(why)`
- `9694` `_dbSheet()`

### 9732 · s6-export

- `9744` `buildSnapshot(scope, recordFilter)`
- `9805` `_xpRecordSnapshot(rows,filter)`
- `9822` `_xpRecordChoices()`
- `9841` `_xpRecordIds()`
- `9850` `_xpReadFilter()`
- `9857` `_xpRecordBody(sn)`
- `9888` `_xpDownload(name, mime, data)`
- `9897` `_xpStamp()`
- `9899` `_xpSlug(sn)`
- `9915` `_zipStore(parts)`
- `9936` `_pkx(v)`
- `9937` `_pkHex(c)`
- `9938` `_pkInk(hex)`
- `9942` `_deckLayout(C, roots)`
- `9957` `_deckChartXML(C, roots, title, ids)`
- `9991` `_deckSlideXML(inner)`
- `9998` `_pptxParts()`
- `10080` `_pptxBuild()`
- `10081` `xpPptx()`
- `10097` `_xlCol(i)`
- `10098` `_xlSheet(rows, widths)`
- `10114` `_xlsxParts()`
- `10185` `_xlsxBuild()`
- `10186` `xpXlsx()`
- `10195` `exportPNG()`
- `10215` `_xpDossierBody(sn)`
- `10270` `exportPDF(recordFilter)`
- `10280` `exportHTML(recordFilter)`
- `10291` `exportJSON(recordFilter)`

### 10320 · s5-clocks

- `10372` `_tzAbbr(tz, d)`
- `10380` `_ledTime(tz, d, secs)`
- `10390` `civilianTime(tz, d)`
- `10401` `_ckEsc(v)`
- `10404` **CLOCK_REGIONS**
- `10422` `_selSave()`
- `10442` `nearRegion(lat, lon)`
- `10491` `_tzForSite(site)`
- `10500` `autoFillSelect(site)`
- `10509` `pickZone(tz, label)`
- `10518` `tickClocks()`
- `10540` `_ckBeat()`
- `10551` `_ckArm()`
- `10557` `_ckWake()`
- `10565` `_tzOpenSheet()`
- `10593` `initClocks()`
- `10625` `bootShell()`
- `10992` `_bootPaint(ctx, m)`
- `11074` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `__orgsReady` · `__orgsLoad` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coChainCtx` · `_coSec` · `setMode` · `_bfLeaderTrack` · `bfBack` · `_bfHist` · `bfPresent` · `__bfKeysWired` · `_bfFlyFocus` · `__bfHandLive` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `_bfClrCascade` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `_pptxParts` · `_pptxBuild` · `xpPptx` · `_zipCRC` · `_zipStore` · `_xlsxParts` · `_xlsxBuild` · `xpXlsx` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#podium` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#rId1` · `#snapshot`
