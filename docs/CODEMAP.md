# A-ORG-2 — CODEMAP

**Generated file — do not hand-edit.** Regenerate with `node tools/codemap.js`.

Index of `index.html` at **v1.28.0** — 870,873 bytes, 10,208 lines, 338 top-level functions.

Line numbers move every release. Confirm by searching the banner or the
`function name(` text, not by trusting the number.

## Weight by section

Where the bytes are. The file is under a hard 900 KB CI gate, so this table
is the starting point for any prune.

| Section | Lines | Size |
|---|---|---|
| DATA: A1ORGS literal (inline copy of data/orgs.json) | 1884–1938 | 187.4 KB |
| s4-dossier | 4919–7611 | 174.2 KB |
| s7-records | 7612–9058 | 78.7 KB |
| <style> — all CSS | 173–1235 | 68.9 KB |
| m5-markers | 2782–3983 | 65.2 KB |
| DATA: SITES literal (inline copy of data/sites.json) | 1877–1883 | 49.0 KB |
| s5-clocks | 9352–10208 | 46.6 KB |
| s3-search | 4371–4918 | 28.9 KB |
| m2-render | 2083–2366 | 24.7 KB |
| m6-mapdata | 3984–4370 | 19.8 KB |
| s6-export | 9059–9351 | 18.7 KB |
| m3-input | 2367–2633 | 16.1 KB |
| CHANGELOG (in-file release ledger) | 1690–1876 | 12.2 KB |
| <body> — markup | 1545–1688 | 11.4 KB |
| THE ANCHORED CALLOUT (v0.9.0): identity at the pin, depth in the sheet | 1370–1525 | 10.8 KB |
| m4-camera | 2634–2781 | 9.8 KB |
| m1-geom | 1939–2082 | 7.5 KB |
| <script> — the application | 57–172 | 7.5 KB |
| v0.4.0 DATASTORE — sheet tabs · record rows · one add/edit form | 1236–1340 | 7.4 KB |
| <script> — the application | 16–56 | 2.2 KB |

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
| 1877 | DATA: SITES literal (inline copy of data/sites.json) | data |
| 1884 | DATA: A1ORGS literal (inline copy of data/orgs.json) | data |
| 1939 | m1-geom | module |
| 2083 | m2-render | module |
| 2367 | m3-input | module |
| 2634 | m4-camera | module |
| 2782 | m5-markers | module |
| 3984 | m6-mapdata | module |
| 4371 | s3-search | module |
| 4919 | s4-dossier | module |
| 7612 | s7-records | module |
| 9059 | s6-export | module |
| 9352 | s5-clocks | module |

## Functions by section

### 1690 · CHANGELOG (in-file release ledger)

- `1784` **APP_VERSION**
- `1785` **APP_UPDATED**

### 1877 · DATA: SITES literal (inline copy of data/sites.json)

- `1877` **SITES**

### 1884 · DATA: A1ORGS literal (inline copy of data/orgs.json)

- `1884` **A1ORGS**
- `1907` `_ogBuild()`
- `1920` `orgOf(id)`
- `1921` `ogKids(id)`
- `1922` `ogEffSite(id)`
- `1923` `ogAtSite(siteId)`
- `1925` `ogPrimary(siteId)`
- `1930` `ogChainUp(id)`

### 1939 · m1-geom

- `1988` `_qMul(a,b)`
- `1998` `_qNorm(q)`
- `2000` `_qFromAxisAngle(ax,ay,az,ang)`
- `2004` `lonLatToVec(lon, lat)`
- `2012` `_setGlobeRot(rotLon, rotLat)`
- `2025` `_projectLonLat(lon, lat, m)`
- `2036` `_projectVec(v, m)`
- `2049` `_visibleLonLat(lon, lat, tol)`
- `2059` `globeMetrics(cv)`
- `2071` `_ringXYZ(ring)`

### 2083 · m2-render

- `2136` **GLOBE_FALLBACK_RINGS**
- `2137` **GLOBE_RINGS**
- `2139` **GLOBE_STATE_RINGS**
- `2140` **GLOBE_SHORE_RINGS**
- `2144` **US_STATES**
- `2171` **GLOBE_STATE_SHAPES**
- `2174` **GLOBE_COUNTRY_RINGS**
- `2182` `startGlobeLoop(cv)`
- `2215` `drawGlobe(cv, ctx)`
- `2286` `latRing(lat)`
- `2288` `lonRing(lon)`
- `2290` `drawGlobePath(ctx,m,ring,fill)`
- `2341` `_smoothRing(r, iters)`
- `2357` `smoothFallbackOnce()`

### 2367 · m3-input

- `2431` `globeMark()`
- `2435` `_rebuildGlobeQ()`
- `2444` `_faceLonLatAngles(lon,lat)`
- `2452` `setupGlobeInteraction(cv)`
- `2624` `globeGlideStep(dt)`

### 2634 · m4-camera

- `2730` `cameraCancel()`
- `2743` `flyToLatLon(lat, lon, zoom, onArrive)`

### 2782 · m5-markers

- `2888` `_sitesArr()`
- `2892` `_siteIndex()`
- `2906` `siteById(id)`
- `2917` **CLS_META**
- `2924` `clsOf(id)`
- `2938` `_disc(id, title, bodyHtml, opts)`
- `2963` `_famOffSet()`
- `2976` **LY_MODES**
- `2983` `lyCounts()`
- `2988` `lyShown(off)`
- `2989` `lyModeN(m)`
- `2990` `lyKey()`
- `2997` `lySync()`
- `3012` `_lyRingPaint()`
- `3041` `lyRing(open)`
- `3051` `lyMode(k)`
- `3056` `lyFam(k)`
- `3060` `lyView(v)`
- `3068` `_lyEnsure(id)`
- `3080` `_shPaneLay()`
- `3119` `renderLegend()`
- `3133` `_cssRGB(c, fb)`
- `3144` `_mTok()`
- `3171` `_syncSelArcs(selId)`
- `3240` `_selSyncCheck()`
- `3252` `drawSubtleArcs(ctx, m, arcs, rgb, width, alpha, arrow, dash)`
- `3290` `drawGlobeLinks(ctx, m)`
- `3315` `_gChromeZones(m)`
- `3341` `_placeGlobeLabel(ctx, sx, sy, w, m, rects, opts)`
- `3368` `drawGlobeMarkers(ctx, m)`
- `3567` `_glowDot(ctx, x, y, fd, k)`
- `3582` **BF_STREAMS**
- `3597` `_bfNodeLbl(nd)`
- `3598` `_bfAbbr(name)`
- `3614` `_bfFanShort(lbls)`
- `3633` **BF_STAR**
- `3634` `_bfStarKind(n)`
- `3649` `_bfParentOf(id)`
- `3656` `_briefChainMap(opts)`
- `3711` `drawBriefStates(ctx, m, labels)`
- `3805` `_hexTrip(hex)`
- `3811` `drawBriefArcs(ctx, m)`
- `3831` `drawBriefNodes(ctx, m)`
- `3952` `drawMarkersHook(ctx, m)`
- `3975` `siteHitTest(x, y)`

### 3984 · m6-mapdata

- `4055` `_fetchRetry(src, tries)`
- `4068` `_basemapLoad()`
- `4074` `_basemapNetUp()`
- `4080` `loadGlobeCoastlinesHi()`
- `4107` `loadStateBorders()`
- `4138` `_albersUsaInvert(x, y)`
- `4157` `_ringsLookGeographic(rings)`
- `4180` `_topoInteriorMesh(topo, objName, projInvert, exclGeom)`
- `4225` `_topoSingleUse(topo, objName, projInvert)`
- `4249` `_shoreHarvest()`
- `4287` `loadCountryBorders()`
- `4311` `_decodeTopoLonLat(topo, objName)`
- `4325` `decodeTopoLand(topo)`
- `4351` `_namedStateShapes(topo, geographic)`

### 4371 · s3-search

- `4497` `_srEsc(s)`
- `4498` `_srEscA(v)`
- `4501` `_srFold(s)`
- `4511` `_searchEntries()`
- `4560` `buildSearchIndex()`
- `4564` `_srUserEntries()`
- `4609` `_srBriefEntries()`
- `4620` `sfsResults(q)`
- `4664` `_srFuse()`
- `4671` `sfsRender(res)`
- `4675` `_sfsPaint(res)`
- `4707` `_srRefresh()`
- `4716` `searchSelect(id)`
- `4839` `_sfsField()`
- `4843` `_isSearchField(t)`
- `4891` `initSearch()`
- `4913` `_srInjectCSS()`

### 4919 · s4-dossier

- `5060` `_odEsc(s)`
- `5061` `_odEscA(v)`
- `5075` `_camSnap()`
- `5079` `_camApply(st, o)`
- `5101` `_undoPush()`
- `5120` `tpLive()`
- `5127` `tpSync()`
- `5139` `tpZoom(dir, ramp)`
- `5153` `tpUndo()`
- `5158` `tpClear()`
- `5159` `_tpStop(e)`
- `5166` `_tpRamp()`
- `5171` `_tpWire()`
- `5195` `selectSite(id, o)`
- `5243` `setMode(m)`
- `5281` `renderBrief(view)`
- `5469` `_bdSync()`
- `5481` `_bfTint(hex)`
- `5495` `_bfLeaderTrack()`
- `5542` `_bfFlipCapture(el)`
- `5554` `_bfFlipPlay(el, old)`
- `5591` `_bfSceneDepth()`
- `5595` `_bfViewCapture(point)`
- `5603` `_bfFit(view)`
- `5613` `_bfZoomTo(value,point,finish)`
- `5617` `_bfExplore(k)`
- `5625` `_bfChartWire(el)`
- `5661` `_trailPush(id)`
- `5669` `_trailClear()`
- `5680` `_flyFitChain()`
- `5712` `_clearBand()`
- `5732` `_bandAim(midLat, midLon, sepDeg, zMin, zMax)`
- `5746` `_flyPair(aLat,aLon,bLat,bLon)`
- `5764` `clearAll()`
- `5799` `_trailRender()`
- `5806` `tapAtScreen(x, y)`
- `5845` `showDossier(id)`
- `5869` `_sheetFlag()`
- `5876` `hideDossier()`
- `5904` **RC_KINDS**
- `5910` `_odSetTab(t)`
- `5919` `_odRender(s)`
- `6040` `calloutShow(id, at)`
- `6049` `calloutHide()`
- `6054` `_coRefresh()`
- `6055` `_coRender()`
- `6265` `_coAnchor()`
- `6284` `_coPlace()`
- `6325` `_bfPickFoot()`
- `6337` `_bfToast(msg)`
- `6431` **BF_PALETTE**
- `6437` `_bfArmHint()`
- `6448` `_bfTakeParent(fallback)`
- `6460` `_bfPickCandidates(pk,q,kind)`
- `6485` `_bfAddSheet(pk)`
- `6525` `_bfGroupSheet(pk)`
- `6555` **BF_PLACES**
- `6569` `bfPlaceOf(k)`
- `6572` `bfAddMany(ids, parent)`
- `6604` `_bfSelections(k)`
- `6645` `_bfAddUnderBtn(k)`
- `6654` `_bfInvHTML(k)`
- `6679` `_bfPlainSheet(k)`
- `6733` `_bfObjSheet(id)`
- `6861` `_rcContext(id)`
- `6862` `_rcTitle(r,x)`
- `6863` `_rcLabel(id,x)`
- `6864` `_rcRefresh()`
- `6870` `_rcResume(id)`
- `6874` `_rcStart(kind,rid)`
- `6882` `recordURL(value)`
- `6887` `recordCopy(value)`
- `6891` `_rcActions(kind,it)`
- `6903` `_rcCard(id,kind,it)`
- `6915` `_rcOptions(id,cur,allowNew)`
- `6919` `_rcIdPane(id)`
- `6928` `_rcRender(id)`
- `6957` `_rcFormHTML(kind,it,rid)`
- `6976` `_rcFit()`
- `6985` `_rcReadForm()`
- `6992` `_rcCommit()`
- `7011` `_rcDelete(rid)`
- `7018` `_rcUndoDelete()`
- `7027` `_rcOpen(id,rid,xid)`
- `7056` `_odStageClearSync(on)`
- `7518` `initDossier()`
- `7532` `_odInjectCSS()`

### 7612 · s7-records

- `7622` **RECORDS**
- `7625` `_recBlank(id)`
- `7626` `_recFingerprint(value)`
- `7629` `_recNormalize(r)`
- `7653` `recordOf(id)`
- `7654` `recAll()`
- `7655` `_recIndex(r,kind,index)`
- `7656` `_recRid()`
- `7657` `recCount(id)`
- `7664` `_recPersist(r)`
- `7675` `_recSave(id)`
- `7682` `_recStatusText(id)`
- `7692` `recordSaveStatus(id)`
- `7695` `_recStatusPaint()`
- `7698` `_recCloudAck(records)`
- `7702` `_recLoaded(r)`
- `7705` `recAdd(id, kind, item)`
- `7712` `recUpdate(id, kind, idx, item)`
- `7718` `recRemove(id, kind, idx)`
- `7727` `recIds(id)`
- `7728` `_recNextId(id)`
- `7733` `recAddId(id, label)`
- `7743` `recTitleId(id,label,title)`
- `7747` `recDelId(id, label)`
- `7756` `recIdCount(id, label)`
- `7762` `_rdbOpen()`
- `7910` **BRIEF**
- `7912` `_bfSync()`
- `7917` `_bfSave()`
- `7930` `_bfInvClean(a)`
- `7936` `bfNode(k)`
- `7937` `bfKids(k)`
- `7940` `_bfOrgId(id)`
- `7946` `bfHas(id)`
- `7948` `_bfStateKey(name)`
- `7949` `bfStateName(k)`
- `7954` `_bfFrame()`
- `7978` `_xpPulse()`
- `7990` `_bfPush(node)`
- `8001` `bfAdd(id, parent)`
- `8015` `bfAddState(name, parent)`
- `8024` `bfAddCustom(name, parent)`
- `8031` `bfRename(k, name)`
- `8038` `bfRemove(id)`
- `8054` `bfMove(k, newParent)`
- `8067` `bfReorder(k, dir)`
- `8080` `bfColor(k, hex)`
- `8088` `bfStripe(k)`
- `8094` `bfNote(id, text)`
- `8109` `_bfStackPopHide()`
- `8110` `_bfStackPop(lvl)`
- `8146` `bfStack(n)`
- `8155` `bfEye(rootId)`
- `8163` `bfDepth(n)`
- `8182` `_ssTick()`
- `8202` **ORGS**
- `8203` `_orgSave()`
- `8204` `orgById(id)`
- `8205` `orgKidsOf(pid)`
- `8206` `orgAdd(name, parent, base)`
- `8222` `orgRemove(id)`
- `8238` **SAVEDV**
- `8240` `_svSave()`
- `8254` `_shId(r, save)`
- `8258` `_shList(kind)`
- `8259` `_shFind(kind,id)`
- `8266` `_shTrim(A)`
- `8276` `_shScope(v)`
- `8287` `_shGlyph(kind,r)`
- `8303` `_shRow(kind,r,P,i)`
- `8332` `_shPaneShelf(kind,P)`
- `8380` `_shOpen(tab)`
- `8415` `_svOpenSheet()`
- `8416` `svCapture(name)`
- `8427` `svUpdate()`
- `8435` `svRename(id,n)`
- `8439` `svPin(id)`
- `8440` `svRecall(id)`
- `8450` `svRemove(id)`
- `8465` **SAVEDB**
- `8467` `_sbSave()`
- `8472` `sbCapture(name)`
- `8491` `sbUpdate()`
- `8501` `sbLoad(i)`
- `8517` `sbRename(id,n)`
- `8521` `sbPin(id)`
- `8522` `sbRemove(i)`
- `8534` `_sbOpenSheet()`
- `8547` `_lgSiteName(id)`
- `8552` `_ldCounts(c)`
- `8560` `_ldItem(kind,it,id)`
- `8572` `_ldSet(t)`
- `8574` `_ldTabs()`
- `8581` `_ledgerHTML()`
- `8625` `_ledgerEl()`
- `8637` `_ledgerRender()`
- `8641` `_ledgerOpen()`
- `8646` `_ledgerClose()`
- `8647` `_repoDoorSync(open)`
- `8650` `_ledgerTap(e)`
- `8662` `_ledgerPaint()`
- `8668` `recBackup()`
- `8672` `recRestore(obj)`
- `8705` **DB_TABLE**
- `8706` `_dbSetState(st, msg)`
- `8716` `_dbCfgSave(cfg)`
- `8720` `_dbIsNet(e)`
- `8727` `_dbWhy(what, e)`
- `8733` `ensureSupabase()`
- `8760` `_dbFetch(input, init)`
- `8766` `_dbSnapshot()`
- `8775` `_dbApply(data)`
- `8824` `_dbChipShow()`
- `8850` `dbPush()`
- `8857` `_dbFlush()`
- `8882` `_dbRetryArm()`
- `8889` `dbPullOnce()`
- `8908` `_dbConnectRun()`
- `8948` `dbConnect()`
- `8960` `_dbAutoBoot()`
- `8970` `dbDisconnect(silent)`
- `8984` `_dbNetUp(why)`
- `8996` `_dbHideFlush()`
- `9004` `_netUp(why)`
- `9021` `_dbSheet()`

### 9059 · s6-export

- `9071` `buildSnapshot(scope, recordFilter)`
- `9132` `_xpRecordSnapshot(rows,filter)`
- `9149` `_xpRecordChoices()`
- `9168` `_xpRecordIds()`
- `9177` `_xpReadFilter()`
- `9184` `_xpRecordBody(sn)`
- `9215` `_xpDownload(name, mime, data)`
- `9224` `_xpStamp()`
- `9226` `_xpSlug(sn)`
- `9229` `exportPNG()`
- `9249` `_xpDossierBody(sn)`
- `9304` `exportPDF(recordFilter)`
- `9314` `exportHTML(recordFilter)`
- `9325` `exportJSON(recordFilter)`

### 9352 · s5-clocks

- `9404` `_tzAbbr(tz, d)`
- `9412` `_ledTime(tz, d, secs)`
- `9422` `civilianTime(tz, d)`
- `9433` `_ckEsc(v)`
- `9436` **CLOCK_REGIONS**
- `9454` `_selSave()`
- `9474` `nearRegion(lat, lon)`
- `9523` `_tzForSite(site)`
- `9532` `autoFillSelect(site)`
- `9541` `pickZone(tz, label)`
- `9550` `tickClocks()`
- `9572` `_ckBeat()`
- `9583` `_ckArm()`
- `9589` `_ckWake()`
- `9597` `_tzOpenSheet()`
- `9625` `initClocks()`
- `9657` `bootShell()`
- `10024` `_bootPaint(ctx, m)`
- `10106` `_introSkip(value)`

## Globals on `window`

The headless-drive surface: what a probe or a browser console can call.

`__SANDBOX` · `origin` · `__errLog` · `__swAsk` · `__swVer` · `__swVerCheck` · `__swHeal` · `__updKick` · `__updCheck` · `__swReg` · `__updReloading` · `GlobeState` · `SITES` · `A1ORGS` · `_OG` · `US_STATES` · `clsOf` · `__discWired` · `lyRing` · `renderLegend` · `Layers` · `Basemap` · `__coSearchFold` · `__sbKbWired` · `tpZoom` · `tpUndo` · `tpClear` · `tpSync` · `_coSec` · `setMode` · `_bfLeaderTrack` · `renderBrief` · `_bfGrpForm` · `_bfPick` · `clearAll` · `selectSite` · `_bfSubFor` · `_bfSubQ` · `_odUI` · `_odSetTab` · `_coDrillFor` · `_coDrillQ` · `__bfToastT` · `__bfPickWired` · `_bfPickQ` · `__bfMoveWired` · `_bfPickKind` · `__dzDragWired` · `__coDrillWired` · `_coTrack` · `Callout` · `_bfPickParent` · `__bfSubWired` · `_rcLastXid` · `recordURL` · `recordCopy` · `RecordUI` · `_odWired` · `recordSaveStatus` · `recordSaveText` · `_selZone` · `__bfLpWired` · `Brief` · `Orgs` · `Views` · `_shOpen` · `lyFam` · `lyView` · `lySync` · `Briefs` · `_ldSet` · `_ledgerPaint` · `Repo` · `Records` · `DB` · `buildSnapshot` · `_xpDossierBody` · `_xpRecordSnapshot` · `_xpRecordBody` · `onload` · `__xpWired` · `_setSelZone` · `__ckT` · `__tzLbl` · `__visT` · `_nvSet` · `_renderAppMenu` · `_errToast` · `__errT` · `_diagDump` · `_updCheckUI`

## Element IDs

`#globeCanvas` · `#titleBar` · `#wordmark` · `#verTag` · `#modeSeg` · `#introVeil` · `#searchPill` · `#searchInput` · `#searchResults` · `#appMenu` · `#navPod` · `#navSat-clear` · `#navSat-back` · `#navSat-zoomin` · `#navSat-zoomout` · `#navDock` · `#navGlobe` · `#nvRing` · `#nvMark` · `#lyState` · `#briefDock` · `#bfLeader` · `#exportSheet` · `#dossier` · `#lyPanel` · `#calloutCard` · `#briefStage` · `#timeLedger` · `#s3SearchCSS` · `#s4DossierCSS` · `#exportBtn` · `#coDrillQ` · `#bfPickKind` · `#bfPickQ` · `#bfGrpNm` · `#bfInvQ` · `#bfInvD` · `#rcFRn` · `#rcF1` · `#bfSubQ` · `#ogF1` · `#ogF2` · `#orgBaseList` · `#rcIdNew` · `#rcIdTitle` · `#rcContextId` · `#rcF_primary` · `#rcF_pinned` · `#rcSpecLabels` · `#rcForg` · `#rcFid` · `#rcDestination` · `#rcError` · `#shName` · `#dbUrl` · `#dbKey` · `#dbBoard` · `#dbStatus` · `#xpRecordSite` · `#xpRecordId` · `#snapshot`
