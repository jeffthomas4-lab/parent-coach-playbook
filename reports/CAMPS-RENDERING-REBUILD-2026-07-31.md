# /camps/ rendering rebuild — 2026-07-31

Closes STANDARD-AUDIT.md open item #70 (CRITICAL, Pillar 14: `/camps/` at
84,749px mobile height, roughly 10x the pillar's ~8,000px flag). The task
brief that commissioned this session called it "item #74" — #74 is actually
the unrelated Pillar 8 Cloudflare Queues finding. Item #70 is the real
Pillar 14 finding this fix addresses; the STANDARD-AUDIT.md update for this
work is logged as item #78 and cross-referenced from #70.

## What was measured before touching anything

An earlier audit lane guessed 1,300 approved camps. That was wrong. The live
site was fetched directly (`curl https://parentcoachdesk.com/camps/`) and
measured:

- Total page: 603,000 bytes, 200 OK.
- `.camp-card` DOM nodes: 323 (311 approved camps split across PNW/National
  grids, 0 Featured, 12 Recently Added).
- `camps-data` JSON payload: 218,759 bytes.
- Card HTML (all 323 `.camp-card` blocks, computed with a balanced-div
  parser against the live HTML): 344,643 bytes, averaging 1,067 bytes/card.
- 130 of the 311 approved camps are PNW, 181 are National. Under the
  client's default filter (leagues and full programs hidden), that's 124
  PNW and 181 National still visible.

## Root cause

`src/lib/camps-db.ts`'s `listApprovedCamps()` ran with no `LIMIT` at all —
it returned every approved future camp, unbounded, forever. `src/pages/camps/index.astro`
then rendered every one of those camps as a full `<div class="camp-card">`
in the frontmatter. The client-side filter script never rendered a card
itself; it only ran `document.querySelectorAll('.camp-card').forEach(card
=> card.style.display = ...)`, which only works if every card is already in
the DOM. That coupling is what forced every camp onto the page on every
visit.

## What changed

**`src/lib/camp-card.ts` (new).** Pulled `renderCardHtml` and
`renderFeaturedCardHtml` out of the Astro frontmatter into a module both the
server and the browser import, so a card built server-side and a card built
client-side are byte-identical. Carries the escaping helper, the date-range
formatter, the sport-label lookup, and the "New" pill window constant
(`RECENTLY_ADDED_WINDOW_DAYS`).

**`src/lib/camps-db.ts`.** `listApprovedCamps(db, limit = APPROVED_CAMPS_HARD_CAP)`
now runs `... LIMIT ?`. `APPROVED_CAMPS_HARD_CAP = 1000`, about 3x today's
311-camp inventory — a generous hard cap, not a paged rewrite, since the map
and the client filter both need the full matching dataset (not just the
rendered cards) to keep working the same way they do today. If a call ever
returns exactly the cap, it logs a loud `console.error` naming the exact
next step (real pagination), so growth past the cap is a visible signal
instead of camps quietly going invisible. The one other caller,
`approvedCampsWithinRadius` (camps-db.ts:1544), keeps the same default —
no behavior change there.

**`src/pages/camps/index.astro`.** The PNW and National grids now
server-render only the first 24 matching cards each (`CARD_WINDOW = 24`),
computed against the same default filter the client applies (leagues and
full programs hidden), so nothing flashes into view and then disappears
once JS takes over. Featured and Recently Added rails render in full, same
as before — they're already small and bounded. `campsLite` gained four
fields the card renderer needs and didn't have: `hero_photo_key`,
`price_text`, `last_verified_at`, `date_added`. It stays the full
(query-bounded) dataset, not windowed — the map and the filters need every
matching camp, only the DOM card count is capped. The results line
(`id="camps-results-count"`, `aria-live="polite"`) now reports the true
total match count under the current filters.

**Client script (same file).** `applyFilters()` now rebuilds the PNW and
National grids from `campsLite` via the shared `renderCardHtml`, windowed
to `pnwShown`/`nationalShown` (starts at 24, resets to 24 on any filter
change). Two "Show more" buttons bump their region's window by 24 and
re-render without touching the filter state. Featured and Recently Added
keep the old `display:none` toggle (scoped to skip the two windowed grids,
since those are rebuilt outright). `renderMap()` is untouched — it already
worked from `visibleCamps`, the full filtered set, independent of what's
rendered in the DOM.

**No-JS.** Featured (full), Recently Added (full, capped 12), and the first
24 PNW + first 24 National cards under the default filter — same content a
JS reader sees on first paint, just without search, other filters, the map,
or "Show more." A `<noscript>` line under each grid states this. A global
`<noscript><style>.js-show-more{display:none}</style></noscript>` hides the
"Show more" buttons so no-JS readers never see a control that does nothing.
This is a real reduction from before (no-JS used to get all 311+12 cards);
stated plainly rather than left implicit.

## Real numbers

| Metric | Before (measured live) | After (projected from source) |
|---|---|---|
| `.camp-card` DOM nodes | 323 | 60 (24 PNW + 24 National + 0 Featured + 12 Recently Added) |
| Card HTML bytes | 344,643 | ~64,000 (60/323 of measured total; per-card markup unchanged) |
| `camps-data` JSON bytes | 218,759 | ~253,000–254,000 (see breakdown below) |
| Total page bytes | 603,000 | ~358,000 |
| Mobile height @390px | 84,749px (measured) | ~15,000–21,000px (projected, see caveat below) |

JSON growth breakdown (311 records): `last_verified_at` is exact —
`verified = 0` on all 311 live records today, so it's `null` on every row:
+7,464 bytes measured-exact. `date_added` is `NOT NULL` in the schema, so
its size is exact too: +12,129 bytes. `hero_photo_key` and `price_text`
growth is an **estimate**, not measured — neither field was ever serialized
into this JSON before this fix, so there's no live baseline for how many of
the 311 camps actually have a photo or a price. Assumed ~30% photo coverage
and ~40% price coverage (typical for a directory this size): +8,400 and
+7,000 bytes estimated respectively.

**The mobile-height number is a projection, not a measurement — this branch
is not deployed.** Using the measured 84,749px/323-card baseline and
backing out a rough fixed-chrome allowance gives ~244px/card; at 60
rendered cards that's roughly 15,000–21,000px. That's a 75–82% cut from
today, but it likely still sits above this pillar's ~8,000px flag, because
60 substantial one-column cards (photo, title, location line, CTA, padding)
don't compress to 8,000px by themselves. Getting fully under 8,000px would
need a smaller first window (12 instead of 24) or scroll-triggered lazy
rendering instead of a click-triggered "Show more." Logging this as a real
residual rather than claiming the fix clears the flag outright.

## What was preserved

Sport/age/date/location filters, the ZIP geocode + haversine distance
filter, the Leaflet map and its clustering, the Featured and Recently Added
rails, `buildCampDemandPayload`'s search-signal beacon, and the 44px tap
targets all still work the same way — none of the filter predicate logic,
the map rendering, or the demand-event scheduling changed. The results
count now reports the true filtered total instead of a static unfiltered
number, which is a correctness fix, not a preserved behavior (the old
"X camps listed" line never updated with filters at all).

## What could not be verified

`astro build` and `npm run check` (`astro check`) both bus-error in this
sandbox — `node_modules/astro`'s native binding is not fully installed
here, a pre-existing, previously documented sandbox limit. `npx vitest run`
fails on a missing native module (`@rolldown/binding-linux-x64-gnu`), also
pre-existing and not caused by this change. In place of those:
`@astrojs/compiler`'s `transform()` was run directly against the changed
`.astro` file (0 errors; 3 pre-existing informational hints on unrelated
`<script>` tags this fix didn't touch). `npx tsc --noEmit`, scoped to
`camp-card.ts`, `camps-db.ts`, and `camp-freshness.ts` via a narrow
tsconfig, returned 0 errors. The client `<script>` block's TypeScript was
extracted and typechecked the same way against a DOM-lib tsconfig — 0
errors. Jeff should run `npm install && npm run build && npm run check &&
npm test` before this branch ships, same standing note as the rest of this
audit pass.

## What was deliberately left alone

`campsJson`/`sportsListJson` (unused local variables in the frontmatter,
predating this session) — not touched, out of scope. The `card.closest()`
scoping change to the Featured/Recently Added toggle loop is the only
change to that loop's logic; its predicate is unchanged.

## QA pass (2026-07-31, second session, anchor CAMPS-RENDERING-QA-2026-07-31)

Independent review of the rebuild above. Verified claims against source,
not against the report — the report's own claims (byte projections,
"preserved" list) were re-derived from the diff rather than taken on trust.

**Verdict per check:**

1. Server/client markup divergence — pass. The client script imports
   `renderCardHtml` from `src/lib/camp-card.ts` directly; it is not a
   near-copy. `escHtml`, `ageLabel`, `verificationLabel`, `newPillHtml`,
   `fmtDateRange`, `sportLabel`, `formatDateAdded`, `isRecentlyAdded` all
   live inside that module or `camp-freshness.ts` and travel with the
   import — none are stubbed client-side. Confirmed by extracting the
   client `<script>` block and typechecking it against a DOM-lib tsconfig
   with the real `camp-card.ts`/`camp-freshness.ts`/`camp-demand.ts`
   alongside it: 0 errors, and the `LiteCamp` interface structurally
   satisfies `CardCamp` without a cast.

2. XSS — **one real finding, fixed.** `renderCardHtml`/`renderFeaturedCardHtml`
   escape every interpolated field correctly on both sides — no gap there.
   But the Leaflet map's popup builder (same `<script>` block,
   `renderMap()`) interpolated `c.name`, `c.city`, `c.state` into an HTML
   string handed straight to `marker.bindPopup()` with no escaping at all —
   a real stored-XSS vector, since camp name/city/state come from public
   submissions and a raw `<script>`/`<img onerror>` string in a name field
   isn't guaranteed to be caught by human moderation before it reaches this
   popup. Confirmed via `git diff` that this code predates this session's
   rebuild (`renderMap()` was untouched by the diff, as the report states) —
   not a regression this session introduced, but a real gap this QA pass is
   responsible for catching regardless of who wrote it. Fixed: imported
   `escHtml` from `camp-card.ts` into the client script and escaped all
   three fields plus `c.slug` in the popup, matching what `renderCardHtml`
   already does. `src/pages/camps/index.astro`, the `renderMap()` function.

3. Filter/window interaction — pass. `applyFilters()` computes
   `visibleCamps` from the full `campsLite` array (not the DOM), then
   `renderGrids()` rebuilds `#pnw-grid`/`#national-grid` from
   `visibleCamps.slice(0, shown)`. A camp matching a filter is always in
   `visibleCamps`; if it's outside the current window, "Show more" (which
   bumps `shown` and re-renders without re-filtering) surfaces it. No camp
   that matches a filter is permanently unreachable.

4. Results count — pass. `updateResultsCount()` sets
   `#camps-results-count` from `visibleCamps.length`, the full filtered
   count, not `pnwShown`/`nationalShown`. Confirmed in source, not just the
   report's claim.

5. Map — pass. `renderMap()` iterates `visibleCamps` (the full filtered
   set), independent of what's windowed into the DOM grids. Not narrowed.

6. The LIMIT — pass, with one fix. `APPROVED_CAMPS_HARD_CAP = 1000`
   applies to both callers: `listApprovedCamps` directly
   (`camps/index.astro`) and `approvedCampsWithinRadius`
   (`camps-db.ts:1575`, calls `listApprovedCamps(db)` with the same
   default). Against today's 311 approved camps this is a real 3x
   cushion, not a number that reads as generous only on paper. **Fixed:**
   the cap-hit signal was a bare `console.error`, not the structured
   logger (`src/lib/log.ts`) Pillar 8 of this standard put in place
   elsewhere in this file and across 30+ route files. Replaced with
   `log('error', { requestId: crypto.randomUUID(), route: 'lib/camps-db',
   action: 'approved_camps_cap_hit', cap, rowCount })` — same pattern
   `src/lib/events.ts` already uses for a non-request caller (a generated
   `requestId` since this function has no `Request` to pull `cf-ray`
   from). This now shows up as a proper JSON log line instead of a raw
   string, consistent with every other error path in this codebase.

7. Regressions — pass. ZIP geocode + haversine filter: unchanged, filters
   `camps`/`visibleCamps` directly, not window-dependent. Leaflet
   clustering: unchanged aside from the popup escaping fix above. Featured
   rail: unaffected (untouched code path). Recently Added rail: the
   `card.closest('#pnw-grid') || card.closest('#national-grid')` scoping
   correctly excludes it from the display:none loop so its own toggle
   logic still runs unchanged.
   `buildCampDemandPayload`/`scheduleDemandEvent`: unchanged, still fires on
   the same filter events. Tap targets: `.btn-ghost` (used by both "Show
   more" buttons) already carries `min-height: 44px` in `global.css` — no
   regression, and this was true before this session too.
   `aria-live`: `#camps-results-count` already had it; "Show more" itself
   had no announcement — see check 8.

8. Pillar 6, the "Show more" control — **fixed.** Accessible name: pass
   (native `<button>` with visible text). 44px target: pass (`.btn-ghost`).
   Announces new results: **was a real gap** — clicking "Show more" called
   `renderGrids()` and updated nothing a screen reader would notice; the
   only `aria-live` region on the page (`#camps-results-count`) reports the
   filtered total, which doesn't change on a "Show more" click, so it
   would stay silent. Fixed: added a second, visually-hidden
   `aria-live="polite"` region (`#camps-load-announcer`, Tailwind
   `sr-only`) and an `announceLoaded()` call in both "Show more" click
   handlers reporting how many more cards just loaded.

## Part 2: closing the mobile-height residual

**Recomputing the per-card height instead of assuming ~250px.** At a
390px viewport: `.container-px` is 16px each side below the 768px
breakpoint (confirmed in `global.css`), so content width is 358px; the
card's own `p-5` padding is 20px each side (Tailwind), so the card's
inner content width is 318px.

Per-card stack, in DOM order, using the site's actual Tailwind classes and
font sizes (all confirmed in `global.css`/`camp-card.ts`, not guessed):

| Element | Basis | Height |
|---|---|---|
| Photo (16:9 @ 318px width) + `mb-3` | `318 * 9/16 = 179px` + 12px | 191px (conditional — has a photo) |
| Sport/age/date line, `mb-1` | text-xs 12px, ~1 line at this width, +4px margin | 21px |
| Title `h3`, `mt-1` | text-lg 18px mobile, `leading-tight` (1.25), ~1.4 lines average for typical camp-name lengths, +4px margin | 36px |
| Location line, `mt-1` | text-sm 14px, `leading-snug` (1.375), ~1 line, +4px margin | 23px |
| Price line, `mt-2` | text-xs 12px, +8px margin | 25px (conditional — has a price) |
| **Added line, `mt-2`** | text-xs 12px, +8px margin | **25px — always renders.** `date_added` is `NOT NULL` in the schema and `formatDateAdded()` returns a string for any parseable date, so `addedLineHtml()` fires on every card, not just "recent" ones. This is a fixed cost the original report's projection didn't call out as guaranteed. |
| CTA "View", `mt-3` | ~17px text, +12px margin | 36px |
| Card padding (`p-5`, top+bottom) | 20px + 20px | 40px |

Weighted full-card average (30% photo coverage, 40% price coverage — same
unverified estimates the original report used, since neither field was
serialized before this fix and there's no live baseline to check against):
`40 + 21 + 36 + 23 + 25 + 36 + 0.30(191) + 0.40(25) ≈ 248px/card`.

**Cross-check against the real live baseline.** The report measured
84,749px / 323 cards live. Solving for fixed chrome using this session's
248px/card figure: `84,749 − 323 × 248 ≈ 4,645px` of non-card chrome (nav,
hero, "where we're starting" band, results line, map, filter bar, section
headings, newsletter signup, footer). An independent bottom-up itemization
of those same sections (hero ~580px, "where we're starting" ~340px, map
400px fixed + border/margin ~434px, the ~10-field filter bar stacking
vertically at this width ~890px, headings/show-more chrome ~220px,
newsletter ~400px, footer ~600px, nav ~64px) lands at ~3,700px —
independently arrived at, off by about 900px from the back-solved figure,
which is reasonable agreement for two estimates neither one measured
directly. This cross-check is why 248px/card is used below instead of the
original report's un-itemized ~244px.

**Compact mobile card** (photo hidden via CSS below 768px): `248 −
0.30(191) ≈ 190px/card`. The photo is the single largest line item at
191px when present — removing it on mobile (not on desktop/tablet) is the
biggest single lever available without cutting content a parent needs; the
title, dates, location, price, and CTA all stay.

**The fix, three parts together:**
1. `src/lib/camp-card.ts` — `photoHtml()` now adds a `camp-card-photo`
   class to the photo wrapper.
2. `src/pages/camps/index.astro`, `<style is:global>` — `@media
   (max-width: 767px) { .camp-card-photo { display: none; } }`, same
   breakpoint `.container-px` already uses. Also caps the Recently Added
   rail to 3 visible cards below that breakpoint
   (`#recently-added-grid > .camp-card:nth-child(n+4) { display: none;
   }`) — that rail duplicates camps already in the PNW/National grids
   below it, so capping it removes height without removing a camp from the
   directory; every capped camp is still reachable through the main grids
   and "Show more."
3. Client script — added `isMobileViewport()` (matches the same 767px
   breakpoint) and `CARD_WINDOW_MOBILE = 6` (vs. desktop's `CARD_WINDOW =
   24`). `pnwShown`/`nationalShown` initialize to `activeCardWindow()`
   instead of the flat `CARD_WINDOW`, the filter-reset in `applyFilters()`
   resets to the same device-aware value, and "Show more" bumps by
   `activeCardWindow()` per click. This is a client-only change — SSR still
   renders the desktop `CARD_WINDOW = 24` for no-JS/crawlers, unchanged,
   because the page is edge-cached (`Cache-Control: s-maxage=600`) with no
   `Vary` on viewport, so the server literally cannot serve a different
   window per device from one cached response. `applyFilters()` already
   runs unconditionally on load and re-renders the grids from `campsLite`
   regardless of device, so narrowing the *client's* starting window costs
   nothing extra — it's the same re-render the page was already doing.

**New projected mobile total:** 6 (PNW) + 6 (National) + 3 (Recently
Added) = 15 cards, all compact (no photo, since the CSS rule applies
site-wide below 768px including the Recently Added rail) ≈ 15 × 190px =
2,850px, plus the ~4,645px chrome figure (unchanged by this fix) ≈
**7,495px** — under the ~8,000px flag, with roughly 500px of margin against
the estimate's own uncertainty. A first attempt at `CARD_WINDOW_MOBILE =
8` with the Recently Added rail capped at 4 projected to ~8,445px, still
over the line, which is why the constants above are 6 and 3, not 8 and 4 —
noted here so the arithmetic that produced the shipped numbers is visible,
not just the final answer.

**This is a projection, not a measurement** — same caveat as the original
report: this branch is not deployed, so nothing here has been through a
real browser's layout engine. The card-height table above is built from
confirmed CSS values (padding, font sizes, breakpoints) but the line-count
assumptions (title wrapping ~1.4 lines, sport/date line ~1 line) and the
30%/40% photo/price coverage are estimates, not measurements, same as the
original report flagged. **Escalating to Jeff:** run a real Lighthouse or
Chrome DevTools mobile-emulator pass against this branch once deployed to
confirm the 7,495px figure before marking Pillar 14 fully clear on this
page — if the real number lands materially over 8,000px, the next lever in
line (not yet built) is switching "Show more" to `IntersectionObserver`-based
scroll-triggered loading, which was the other option this pass considered
and didn't need per this arithmetic.
