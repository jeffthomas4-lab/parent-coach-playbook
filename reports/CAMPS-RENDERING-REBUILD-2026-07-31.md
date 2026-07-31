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

## Background data load for campsLite, 2026-07-31 (session 4, anchor: CAMPS-LITE-ENDPOINT-2026-07-31)

Closes STANDARD-AUDIT.md item #23 (Pillar 8: "Camp-listing pages read D1 on
every request with no Cache API or KV layer in front of them"). The prior
two sessions on this page cut the DOM node count from 323 cards to a
windowed first paint. They left one thing untouched: the full `campsLite`
array, projected at ~253,000-254,000 bytes for 311 camps, still shipped as
an inline `<script type="application/json" id="camps-data">` island on
every page load. This session moves that payload to a background fetch.

### The design

Jeff's directive was explicit: small batch on first paint, full set arrives
shortly after, filters and the map never silently return wrong answers by
seeing a partial dataset. The build has three pieces.

**1. `GET /api/camps/lite`** (`src/pages/api/camps/lite.ts`). Returns the
full `campsLite` array plus the sports list, projected from `Camp[]` by a
single shared function (`toCampsLite`, `src/lib/camps-lite.ts`) so the
endpoint and the old inline-JSON path can never drift in shape. The route
checks method (GET only, 405 otherwise), applies the existing
`PUBLIC_READ_RATE_LIMITER` tier (same as `/api/camps/nearest` and
`/api/camps/search-priority`), and serves from an edge cache before ever
touching D1.

**2. Edge cache** (`src/lib/camps-lite-cache.ts`). Uses the Cache API
(`caches.default`), not KV. This repo has one KV namespace (`SESSION`,
auto-provisioned for Astro sessions) and none bound for general caching;
the Cache API needs no wrangler binding at all, so caching this one read
adds zero infrastructure. TTL: 5 minutes fresh
(`CAMPS_LITE_CACHE_TTL_SECONDS`), then up to 1 hour
stale-while-revalidate (`CAMPS_LITE_STALE_WHILE_REVALIDATE_SECONDS`)
before an entry is unusable. Chosen tighter than `/camps/`'s own 10-minute
HTML cache because an admin who just approved or edited a camp is a more
time-sensitive reader than a parent browsing.

**3. Client fetch** (`src/pages/camps/index.astro`, the bundled
`<script>`). `scheduleCampsLiteLoad()` uses `requestIdleCallback` with a
`setTimeout(…, 200)` fallback for Safari (which has never shipped
`requestIdleCallback`). The fetch runs after first paint, never blocking
render.

### Why not paginate campsLite

Explicitly ruled out per the brief. The client's sport/age/date/day-overnight/
spots/ZIP-radius filters and the Leaflet map all read the full array on
every filter change (`applyFilters()` in the client script). A paginated
lite endpoint would mean a sport filter in a low-inventory state could
silently miss camps sitting on an unfetched page. The endpoint returns
everything `listApprovedCamps()` returns (bounded only by its existing
1,000-row hard cap), same as the inline island did.

### Cache invalidation: the stated path

Pillar 8 requires a stated invalidation path, not just a TTL. Every admin
mutation that can change what this endpoint returns calls
`purgeCampsLiteEdgeCache()` after its write commits:
`admin/camps/[id]/{approve,reject,verify,update,photo}.ts`, and
`cron/camps-sweep.ts`'s stale-archive stage (only when it actually archived
something).

**Honest limitation, stated plainly:** Cloudflare's Cache API is per-colo,
not global. A purge from the colo that handled an admin's request clears
that colo's copy only, not every edge location worldwide. The 5-minute TTL
is the real cross-edge staleness bound; the purge call is a best-effort
optimization, not a global-invalidation guarantee. This is written directly
into `src/lib/camps-lite-cache.ts`'s file header so a future reader doesn't
have to rediscover it.

The endpoint also does its own background revalidation, independent of the
admin-triggered purge: on a cache hit older than 4 minutes
(`CAMPS_LITE_REVALIDATE_AFTER_SECONDS`), it kicks a non-blocking
`waitUntil()` refresh so the next request in that colo is more likely to
find a fresh copy already in place. This is the "revalidate in the
background" half of stale-while-revalidate; the `Cache-Control` header on
every response is the half that governs any downstream cache (a browser,
a CDN layer) that reads this endpoint directly.

### States between paint and data arrival

A visible, `aria-live="polite"` status banner (`#camps-data-status`) sits
above the filter bar. It starts in a pending state that matches the
client's first synchronous call, so there is no flash of the wrong state.
Every filter control, both "Show more" buttons, and the map container are
gated:

- **Pending:** every control in `#camp-filters` plus both "Show more"
  buttons gets `disabled = true` (native, not just visual) and a `0.55`
  opacity rule so the state is drawn, not only announced. The map container
  keeps static text ("Map loads once the full camp directory finishes
  loading") until `initMap()` actually runs.
- **Ready:** controls re-enable, the banner hides, and the map/grids render
  from the fetched data.
- **Error:** controls stay disabled, the banner turns rust-bordered with a
  "Try again" button, and the text states plainly that search, filters, and
  the map are unavailable while the server-rendered cards above still work.
  No raw error detail reaches the page. That follows Pillar 13's rule that
  raw exceptions never reach the customer.

If the fetch never succeeds, the page stays fully useful: every
server-rendered card, the results count, and every link on the page came
from SSR and needs nothing from this fetch.

### First-paint bytes: projection, not a measurement

This branch is not deployed, so nothing below is a live number. It is
arithmetic built on the prior session's own projection (itself unmeasured),
plus source-level byte counts of what this session actually added or
removed, measured directly with `wc -c` against the current source.

| Component | Bytes |
|---|---|
| Prior session's projected total page weight | ~358,000 |
| Of which, the `camps-data` JSON island (removed entirely this session) | ~253,000–254,000 |
| Status banner + map fallback markup added (source, `wc -c`) | 2,223 |
| Pending-state CSS rule added (source, `wc -c`) | 678 |
| New client-side JS for the background load/pending-state logic (source, `wc -c`, pre-minification) | 7,311 |

Net: 358,000 − 253,500 (midpoint) + 2,223 + 678 + 7,311 ≈ **114,700 bytes**,
call it **~105,000–115,000 bytes projected**. The 7,311-byte JS figure is
raw source with comments; Astro's Vite bundling minifies and strips
comments from bundled `<script>` tags in a real build, so the real shipped
number is very likely lower than this arithmetic implies. That direction of
error (this projection running a little high, not low) is the safer one to
be wrong in.

**Inline JSON remaining on first paint: zero.** The server-rendered cards
(Featured, Recently Added, and the first window of PNW/National) need no
client data at all. Their markup is complete HTML from
`src/lib/camp-card.ts`, unchanged by this session. Nothing was inlined to
replace the removed island; the brief's "or nothing if nothing is needed"
option is what fit.

### What was tested

`tests/api/camps-lite.test.ts`: happy path (200, full `camps`/`sports`
returned, admin-only fields like `contact_email` confirmed absent from the
lite projection), failure path (a D1 read failure returns 500 with no raw
error string in the body), refusal (a non-GET method returns 405 without
ever calling `listApprovedCamps`), plus a bonus DB-unavailable case.

**Found and fixed a real pre-existing gap while writing these tests:**
`tests/helpers/context.ts`'s `makeContext()` defaulted five rate-limiter
bindings to an always-allow stub but not `PUBLIC_READ_RATE_LIMITER`, which
`enforcePublicWriteRateLimit()` (`src/lib/public-rate-limit.ts`) fails
closed on with a 503 when undefined. Both `tests/api/camps-nearest.test.ts`
and `tests/api/camps-search-priority.test.ts` are pre-existing tests on
this same rate-limit tier, and both would get a 503 instead of the status
each test actually asserts, on any real `npm test` run. Fixed by adding the same
default the other five limiters already get. This was found by reading
`enforcePublicWriteRateLimit`'s source, not by a red test run: vitest
cannot execute in this sandbox (`@rolldown/binding-linux-x64-gnu` missing,
confirmed again this session, same as the prior session's note). Jeff
should confirm this fix actually goes green on a real `npm test`.

### Validation performed (no `npm install`/`astro build`/`vitest` available)

`@astrojs/compiler`'s `transform()` against `src/pages/camps/index.astro`:
0 error-level diagnostics, 2 pre-existing informational hints on the
unrelated JSON-LD `<script slot="head">` tags (down from 3 in the prior
session's baseline; the removed `camps-data` island was the third).
`tsc --noEmit` against narrow throwaway tsconfigs (deleted after use, not
committed): `src/lib/camps-lite.ts` + `src/lib/camps-lite-cache.ts`, the
`/api/camps/lite` route with its full dependency chain, all five admin
routes plus `cron/camps-sweep.ts`, the extracted client `<script>` block
against a DOM-lib config, and the new test file plus the fixed
`context.ts`. All six passes returned 0 errors.

One real bug surfaced by that process, not by inspection: this project's
tsconfig has no explicit `"lib"` override, so TypeScript's default lib for
its target silently includes the DOM lib alongside
`@cloudflare/workers-types`. DOM's own `CacheStorage`/`Cache` types (the
browser Service Worker Cache API, which has no `.default`) shadow
Cloudflare's declarations for the same global names, so `caches.default`
does not typecheck under this project's real settings even though it is a
genuine, documented Cloudflare Workers API that works at runtime.
Confirmed with an isolated one-line repro against this repo's own
`node_modules` before concluding it was real. Fixed in
`src/lib/camps-lite-cache.ts` with local interfaces describing only the
Cloudflare shape this file uses, cast through `unknown`. That is a
compile-time workaround for the type collision, not a runtime change.
Nothing else in
this codebase used the Cache API before this session, so this collision
was never hit until now.

### Escalating to Jeff

1. Run `npm install && npm run build && npm run check && npm test` before
   this branch ships, same standing note as the rest of this file. The
   `PUBLIC_READ_RATE_LIMITER` test-default fix above and the `caches.default`
   type fix were both verified by reading source and by narrow `tsc`
   passes, not by a real green test run.
2. Once deployed, confirm the cache actually behaves: `curl -i` the
   endpoint twice in a row and check `cf-cache-status` / age between the
   two responses, then approve a camp in `/admin/` and confirm the next
   read reflects it (or explains the up-to-5-minute cross-colo staleness
   window if it doesn't).
3. The byte-weight arithmetic above is unmeasured. A real Lighthouse or
   `curl | wc -c` pass against the deployed page would confirm or correct
   the ~105,000–115,000-byte figure the same way Pillar 14's mobile-height
   number in the section above still needs a live pass.

## CI run #239 fix, 2026-07-31 (session 5)

CI run #239 on this branch reported 8 test failures across 5 files, all
caused by earlier work in this branch. Fixed all 8. No production code
changed except the regenerated route inventory artifact.

**`tests/camp-truthfulness.test.ts` (2 failures) — test fix.** Both
assertions checked literal strings (`ages not provided`, `Listed price:`)
that used to live directly in `src/pages/camps/index.astro` and moved into
`src/lib/camp-card.ts` when card rendering was extracted (session 1, item
#74). Confirmed both strings are still rendered by reading `camp-card.ts`
directly, not by trusting the diff. Fixed by loading `camp-card.ts`
alongside `index.astro` in both tests and checking the combined surface —
the directory guarantee still holds, the assertions just needed to look at
the file the markup actually lives in now.

**`tests/camp-verification-methodology.test.ts` (1 failure) — test fix.**
Same root cause: the verified-badge link moved into `camp-card.ts`. But the
expected count (2) was also wrong once pointed at the right file. Before
the extraction, `index.astro` carried two separate inline copies of the
link (one in the standard card renderer, one in the Featured renderer). The
extraction consolidated both onto one shared helper, `verifiedHtml()`,
called by both renderers — so the source now contains the link once, not
twice, even though every verified card at runtime still links out exactly
as before. Fixed the test to assert zero occurrences in `index.astro` and
one in `camp-card.ts`.

**`tests/events.test.ts` (3 failures) — test fix, no regression.**
The structured-logging rollout changed `emitEventSafely`'s failure log from
a hand-rolled `console.error(JSON.stringify({event, event_type, code}))` to
`log('error', {...})` from `src/lib/log.ts`. Checked whether the new line
still carries the same information: `event` → `action` (same value,
`pcd_event_emit_failed`), `event_type` → `eventType` (same value), `code` →
`errorMessage` (same value for both the D1-failure and bad-event-type
cases, since both are thrown `Error`s and `errorMessage` is `Error.message`).
One real behavior change, not a loss: a non-`Error` throw used to collapse
to a generic `'unknown_error'` marker; the new logger's `errorFields()`
`String()`s whatever was actually thrown, so the real value now reaches the
log line instead of being discarded. That is more information reaching
Cloudflare Worker logs, not less, and it never reaches the caller or a
customer-facing response either way. Updated all three assertions to the
new field names and the new (more informative) non-Error case.

**`tests/route-control-inventory.test.ts` (1 failure) — code fix (generated
artifact).** `automation/route-control-inventory.json` was stale after this
branch added `GET /api/camps/lite`. Ran
`node scripts/build-route-control-inventory.mjs` to regenerate it (162 →
163 routes), then reran `--check`, which now passes. Inspected the new
route's classification before accepting it: `cache_class: "api"`,
`auth_boundary: "public"`, `methods: ["GET"]`, `public_write_limiter: null`.
Confirmed this is honest, not a generator default masking a POST-shaped
route: `src/pages/api/camps/lite.ts` exports only `GET`, so it isn't in
scope for the anonymous-POST limiter-review rule, and its `api` cache class
is correct even though the route itself sets its own edge-cache headers —
there's no separate "cached API" bucket in this classifier and there
doesn't need to be one.

**`tests/unsafe-html-contract.test.ts` (1 failure) — security review, then
a contract update (no sink was unsafe).** `src/pages/camps/index.astro`
gained three `.innerHTML` sinks when the client filter script started
rendering cards itself (session 1): `mapEl.innerHTML = ''` in `initMap()`,
and `pnwGrid.innerHTML` / `nationalGrid.innerHTML` in `renderGrids()`.
Reviewed each individually rather than assuming the extraction was safe
because `camp-card.ts` says it escapes:

- `mapEl.innerHTML = ''` assigns a literal empty string to clear the
  static no-JS fallback markup before Leaflet mounts. No interpolation, no
  sink risk.
- Both grid sinks are set from `renderCardHtml(c, sportsList).join('')`.
  Read `renderCardHtml`, `renderFeaturedCardHtml`, `photoHtml`,
  `verifiedHtml`, `priceHtml`, and `addedLineHtml` directly in
  `camp-card.ts` line by line: every camp-derived field (id, slug, name,
  city, state, sport, hero_photo_key, price_text, date_added, the
  verification/freshness label) passes through `escHtml()` at its
  interpolation point. `sportsList` itself is `CAMP_SPORTS` from
  `src/data/site.ts`, served back through `GET /api/camps/lite`, and is
  also escaped at the call site regardless of its source. No unescaped
  path found in either the base "Show more" render or the sport-label
  fallback path.

No code fix was needed — both sinks were already safe. Added
`src/pages/camps/index.astro` to `automation/unsafe-html-contract.json`'s
`reviewed_inner_html_files` with a note naming all three sinks and why each
is safe. Separately, the Leaflet popup in the same script
(`marker.bindPopup`) is not matched by this contract (it doesn't use
`.innerHTML`) but was already fixed for the same class of bug in the
session-1 QA pass; noted in the contract entry so a future reader isn't
left wondering why it isn't listed.

**Could not verify by running tests.** `npx vitest run` cannot execute in
this sandbox (missing native module, same standing limitation as every
prior session in this file) and `astro build`/`npm install` were off-limits
per this session's brief. Verified instead by: reading every changed
source/test file directly rather than trusting the diagnosis, running
`scripts/build-route-control-inventory.mjs` for real (plain Node, no Astro
dependency) and inspecting its JSON output with a throwaway Node script,
validating the JSON contract file parses, confirming with a targeted grep
that exactly the 4 files listed in `reviewed_inner_html_files` actually
contain `.innerHTML`, and running `tsc --noEmit` against the three edited
test files (0 new errors beyond a pre-existing, unrelated `D1Database`
global-type gap that exists with or without these changes). Jeff should run
`npm test` for real before merging to confirm all 8 go green.

## 2026-07-31, fixing the 3 full-suite failures CI never ran

`npm test` (full vitest, `vitest.config.ts`) failed in 3 files on
`audit/full-standard-2026-07-30`: 6 failures in `tests/api/trust-request.test.ts`
plus suite-level errors in `tests/customer-lifecycle.integration.test.ts` and
`tests/editorial-records-migration.test.ts`. `test-classification.ts`
excludes all three from `vitest.unit.config.ts` (the project CI's unit job
runs), which is why CI never caught them. Both root causes were pre-diagnosed;
this session fixed them without touching the security controls that caused
the failures.

### Cause 1, Turnstile added, test not updated

`src/pages/api/trust/request.ts` correctly gained `enforcePublicTurnstile`
under this branch's Pillar 1 lane. `tests/api/trust-request.test.ts` never
got the matching update, so every test hit the fail-closed 503 before
reaching validation. Fixed the test file only, following the exact pattern
already used in `camps-submit.test.ts` / `camps-suggest.test.ts` /
`camps-claim.test.ts`: added `TURNSTILE_SECRET`, `TURNSTILE_TOKEN`, a
`stubTurnstileSuccess()` helper, `beforeEach`/`afterEach` wiring, and
`'cf-turnstile-response': TURNSTILE_TOKEN` on the shared `valid` payload.
Added `TURNSTILE_SECRET_KEY` to every `env` that needs to pass the gate.
The two tests that resolve before the gate (feature-disabled 404 and the
honeypot 200) correctly still don't need it. Added the missing house-style
test, "security: fails closed with no TURNSTILE_SECRET_KEY set", matching
the other three files' wording and shape.

**Verdict on `replayed`:** fell out on its own, not a separate bug. Reading
`request.ts` line by line, the idempotency-key lookup runs after the
Turnstile gate, and the mocked `insertTrustCase` always resolves
`{ outcome: 'created', ... }` on first insert, so `inserted.outcome ===
'replayed'` is `false` on the first call once Turnstile stops short-circuiting
at 503. No code change needed beyond the test env fix above.

File: `tests/api/trust-request.test.ts`.

### Cause 2, migration 0029's triggers vs. a naive SQL splitter

Both integration test files defined an identical `createDisposableOpsDatabase()`
that did `sql.split(';')` against every migration file's text. Migration
`0029_admin_action_receipts.sql` (Pillar 13 tamper-evidence: append-only
receipts, hash-chained, enforced by `trg_admin_receipts_no_update` and
`trg_admin_receipts_no_delete`) has 2 `CREATE TRIGGER ... BEGIN ... END`
blocks whose bodies carry their own semicolons, which the naive splitter
shredded. The triggers stayed untouched; only the test harness changed.

Extracted the duplicated helper into `tests/helpers/disposable-ops-db.ts`,
matching this repo's existing convention of one named-export helper file per
concern (`tests/helpers/access-token.ts`, `context.ts`, `d1.ts`). Rewrote the
split as `splitSqlStatements()`, a character-by-character scanner that
tracks BEGIN/END depth (only treating `;` as a terminator at depth zero) and
quote state (`'` and `"`, with doubled-quote escaping), so semicolons or
BEGIN/END-shaped text inside a string never affect statement boundaries.
`tests/customer-lifecycle.integration.test.ts` and
`tests/editorial-records-migration.test.ts` now both import
`createDisposableOpsDatabase` from the shared helper instead of defining
their own copy. Each still passes its own Miniflare D1 database ID so the
two suites stay isolated from each other; `customer-lifecycle` also spins up
a third, disposable one for its commerce sub-block, updated to a distinct
ID too.

While building the standalone verification below, found a second, real bug
in the pre-existing comment-stripping regex (`sql.replace(/^--.*$/gm, '')`):
it only strips comment lines with zero leading whitespace. 0029's column
comments are indented two spaces (e.g. `  -- 'staging' | 'production' |
'local'`), so they survived stripping, and their apostrophes fed straight
into the new quote-aware splitter as if they opened real string literals.
That corrupted statement boundaries worse than the original naive splitter
did. Fixed by widening the regex to `/^\s*--.*$/gm`. This is a real fix, not
scope creep: the BEGIN/END-aware splitter is more sensitive to unstripped
comment text than a dumb `split(';')` was, so it needed the same fix to
actually work.

Files: `tests/helpers/disposable-ops-db.ts` (new),
`tests/customer-lifecycle.integration.test.ts`,
`tests/editorial-records-migration.test.ts`.

**Standalone node verification.** Ran the exact `splitSqlStatements()` logic
against the real `migrations-pcd-ops/0029_admin_action_receipts.sql` text
with plain `node`. Result: 7 statements, including both `CREATE TRIGGER`
statements fully intact, each with matching `BEGIN`/`END`, full body, and
correct boundaries. Then ran the same function against all 19 files in
`migrations-pcd-ops/`. Every file split with 0 BEGIN/END-count mismatches,
and the trigger count across the entire directory came back as exactly 2,
both from 0029, matching the known schema. This is a change from what a
first pass without the comment-stripping fix produced (2 statements from
0029, the second one starting mid-comment, garbled), confirming the second
bug was real and the fix corrects it.

**Do the two suites still skip?** No `it.skip`/`describe.skip` or
environment-gated skip exists in either file (checked directly, no matches).
Both suites' tests reporting as SKIPPED under the old code was a side effect
of `beforeAll` throwing `D1_ERROR: incomplete input: SQLITE_ERROR` before any
test body ran. Vitest marks tests in a suite as skipped when their
`beforeAll` hook errors. With `beforeAll` now completing (migrations apply
cleanly per the standalone verification above), the suites should execute
for real rather than staying skipped. This could not be confirmed by
actually running vitest in this sandbox (see below).

### What could not be verified here

Per this session's constraints: `astro build`/`npm run build`/`npm install`
were off-limits, and `npx vitest run` cannot execute in this sandbox
(missing native binding, the same standing limitation noted throughout this
file). Verified instead by: reading `src/pages/api/trust/request.ts` and
`src/lib/turnstile.ts` line by line to confirm the `replayed` verdict rather
than guessing; running the splitter logic standalone against the real
migration files with plain `node` (output above); and running TypeScript's
`transpileModule` (syntax-only, no project-wide resolution, since a full
`tsc --noEmit` against this project timed out past the sandbox's 45-second
command limit) against all 4 changed/created files, which came back with 0
diagnostics. Jeff should run `npm test` for real before merging to confirm
all 3 files go green and the two integration suites actually execute their
tests instead of reporting skipped.
