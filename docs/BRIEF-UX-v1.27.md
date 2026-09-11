# Brief workspace — v1.27.0

Implements the owner's request for visible RSN/ECCSP information and a Brief
workspace that reveals information at useful scales on desktop and iOS.
Base: main `554ebf9f7eaff16aee615c9c5346c49840425d14`.

## Working with a brief

| Action | Result |
| --- | --- |
| Add item | Browse organizations, states/territories, RSN locations or ECCSP locations; select several and add together. |
| Tap a card | Focus its branch at readable scale. Tap the focused card again for details and editing. |
| Overview / Back / branch selector | Return to roots, move up one ancestor, or jump directly to any stored node, including deep branches. |
| Zoom | Keep the point you are examining in place while progressively revealing descendants and context. |
| Layout | Choose Auto or 1–4 levels, stack actual tiers, or enter full screen. |
| Save / open | Open the existing Briefs section of the Repository with its replacement confirmation. |

The chart opens expanded. One finger scrolls the diagram; two fingers zoom.
Desktop users can scroll, drag the background, or use Ctrl/Cmd + wheel to zoom.
With the diagram focused, arrows pan, +/− zoom and Home opens Overview. Escape
leaves full screen when an editing sheet is not open. Global search also leaves
full screen so its input and results stay reachable.

## Information at each scale

| Auto zoom | Visible levels from current branch | Card information |
| --- | --- | --- |
| 85% to below 95% | 1 | Name, type, descendant count |
| 95% to below 135% | 2 | Name, type, descendant count |
| 135% to below 175% | 3 | Also location and note/asset indicators |
| 175% to 220% | 4 | Same contextual information, larger reading scale |

Manual depth stays fixed until Auto, scale reset, branch navigation or a successful
batch addition. Full text, notes, assets and editing controls stay in the existing
object sheet. Names wrap to two lines on cards; the sheet has the full name.
Counts include descendants beyond the displayed levels. Large diagrams pan
instead of shrinking every label to fit the screen. Focus omits unrelated branches
from the chart without removing any saved objects.

## RSN / ECCSP and compatibility

All 10 RSN and 2 ECCSP presets already in the repository are available through
explicit picker categories and global search in Brief. Location sections show
the existing installation anchor and saved coordinates. Renaming a preset retains
its type and marker meaning. No additional service, contact or operational facts
are inferred.

The hand-built tree, parent pointers, actual tier colors, folding/stacking, saved
brief replacement confirmation and snapshot export contract remain. Viewing a
branch does not change membership, notes, assets or saved parents. No Army roster,
geography, database schema, external dependency or boot process change is included.

## Verification and remaining release gate

The standard five Node tools are the automated gate. Smoke now includes two
focused suites exercising shipped functions: dense 252-node trees, deep branches,
all preset categories/search, filtering and batch selection, destination visibility,
renamed preset types, native chart controls, zoom anchoring, gesture cancellation,
keyboard isolation, stack persistence and room separation. Controlled dimensions
cover 320, 390, 414 and 1280px; they do not certify browser layout or real touch hits.

The cloud browser URL policy blocked the local preview. Before merging this draft,
check the following on a desktop browser and iOS Safari:

1. Open empty and dense briefs; confirm 44px controls, wrapped names and accessible
   Layout options at portrait and landscape sizes, including a 320px-wide viewport.
2. Pan and pinch across Auto thresholds; confirm the viewed point stays anchored,
   hidden branches remain discoverable and a focused deep node stays visible.
3. Add RSN/ECCSP objects from the root and under a parent, across filters; reopen
   their Location section and edit multiline notes with the keyboard visible.
4. Open details, Add, Save/open and export from full screen; confirm overlays appear
   above the chart. Open global search, then switch rooms and return.
5. Save/reopen a brief and inspect its PDF/HTML output. Display depth must not
   silently discard stored content from exported snapshots.

Actual desktop/iOS rendering, browser zoom metrics and print output remain
unverified in this environment. The draft PR records this boundary explicitly.
