# Link Health Report — 2026-08-10

**Summary: 65 slugs checked · 10 confirmed issues (2 non-Amazon 404s, 8 Amazon out-of-stock/unbuyable) · 0 false positives dismissed · 0 unconfirmed · 10/10 sampled pages clean (164 unique internal links, all 200).**

## Scope note

The daily-cron link-checker Worker (`worker-link-checker/`) is still not deployed. Its own `README.md` states plainly: **"Status: paused / not deployable"** — deployment is blocked behind five unmet prerequisites (placeholder D1 IDs in `wrangler.toml`, no `schema.sql` applied, no `ADMIN_API_KEY` secret, no staging smoke test, no approval to enable the cron trigger). I also queried the `activity-radar` D1 database directly (the binding the worker's `wrangler.toml` targets) — it has **0 tables**, confirming no `link_health` data is being populated anywhere. Per standing instructions, this run continued to treat hard 404s as in-scope. Jeff: nothing has changed here since the 07-18/08-03 notes — this isn't close to deployed.

## Batch selection

Per `STATE.md`'s "Next run" note, this run pulled:

- All **50 slugs still dated 2026-07-19** (the oldest remaining pool), plus
- The **15 highest-traffic slugs** from the next-oldest pool (2026-07-20, 65 slugs), ranked by `placementCount` from `reports/affiliate/lifecycle.json`. Top of that list: `baseball-glove-youth` (117 placements), `basketball-ball-rubber` (79), `soccer-ball-size4` (66).

Batch = 50 + 15 = 65 (49 Amazon product-page/amzn.to destinations, 12 Amazon search-URL destinations, 10 Bookshop.org).

Every destination was checked directly in a live browser session (Claude in Chrome) via the production `/go/[slug]/` redirect endpoint, which exercises the redirect layer and lands on the real destination in one step — this doubles as the redirect-health check (Step 3) and the two-tier browser verification (Step 4) at once. Amazon-domain requests were paced 8–10+ seconds apart; no persistent bot-detection/CAPTCHA page was hit during the run, so nothing needed to be written off as a throttling artifact.

## Headline for Jeff

**8 of this run's 10 confirmed issues are the same 6 Amazon out-of-stock items and 2 Bookshop.org dead links flagged on 2026-07-19 — still broken three weeks later.** This mirrors the pattern the 08-03 run called out (18/18 carry-overs that cycle). Two new issues also surfaced in this batch. On the positive side, `soccer-ball-size4` — flagged out-of-stock back on 07-20 and never rechecked since — is now confirmed back in stock.

## Confirmed issues (browser-confirmed)

### A. Non-Amazon — Bookshop.org dead links (2)

Both unchanged since 2026-07-19.

| slug | destination | status | note |
|---|---|---|---|
| book-positive-coaching | bookshop.org/a/125074/9780982131701 | 404 | Bookshop.org generic "404" page. Same ISBN flagged catalog-missing on 07-19, still dead today. |
| book-talent-code | bookshop.org/a/125074/9780553385335 | 404 | Bookshop.org generic "404" page. Same ISBN flagged catalog-missing on 07-19, still dead today. |

### B. Amazon — out-of-stock / unbuyable, carried over from 07-19 (6)

All 6 unchanged since first flagged 2026-07-19 (3 weeks broken).

| slug | ASIN | product | note |
|---|---|---|---|
| dance-jazz-shoes-youth | B002CQTZAG | Capezio E-Series Jazz Slip-On | "Currently unavailable" |
| dance-tap-shoes-youth | B0039NNBWE | Capezio Jr. Tyette N625C Tap Shoe | "Currently unavailable" |
| band-valve-oil | B000RVYN46 | Al Cass Fast Valve, Slide and Key Oil | "Currently unavailable" |
| band-practice-pad | B09S3452MM | AAGUT 12" Drum Practice Pad | "Currently unavailable" |
| football-helmet-youth | B08ZKR5PDJ | Riddell Victor Youth Helmet | "Currently unavailable" |
| lacrosse-arm-pads-youth | B00S1BHHWY | Maverik Lacrosse Charger Arm Pad | "Currently unavailable" |

### C. Amazon — out-of-stock / unbuyable, newly discovered (2)

| slug | ASIN | product | placements | note |
|---|---|---|---|---|
| soccer-ball-size3 | B001C3O8O8 | WILSON Traditional Soccer Ball, Size 3 | 19 | No new-condition offer — buy box shows only "Buy Used: $16.10," 2 used options, no featured new offer. Effectively unbuyable as new. Highest-traffic issue this run. |
| football-shoulder-pads-youth | B07MW25GBC | Riddell Pursuit Youth Shoulder Pad, X-Small | 1 | "Currently unavailable," no Add to Cart/Buy Now. Re-verified twice to rule out a stale page read. |

---

## What changed since last week

- **soccer-ball-size4** (B007ZQWLZE, flagged out-of-stock 2026-07-20, never rechecked since) is now **confirmed back in stock** — Champion Sports Retro Soccer Ball, Add to Cart and Buy Now both active. No action needed.
- The 6 Amazon OOS items and 2 Bookshop.org dead links from 07-19 are **exactly where they were three weeks ago** — nothing was remediated in that window for this slug pool.
- 2 new issues surfaced: `soccer-ball-size3` (no new-condition Amazon offer, 19 placements — this is the priciest miss this run) and `football-shoulder-pads-youth` (newly out of stock).

## Borderline / minor (not counted as confirmed issues)

- `dance-character-shoes-youth` and `dance-leg-warmers` — both landed on a different ASIN than configured in `affiliates.json` (Amazon-side variant/ASIN consolidation), but the product shown still matches the slug's intent and is in stock. Not treated as broken; worth a note in case Amazon retires the old ASIN outright later.
- `football-rubber-youth` — lands on a normal Amazon size/price variant-picker ("See All Buying Options") rather than a single Buy button; a Youth-size option is listed and purchasable. Not a mismatch.

## Healthy (55 of 65 slugs confirmed good)

baseball-balls-wiffle, baseball-blitzball-set, baseball-belt-youth, baseball-catchers-bag, baseball-arm-sleeve, baseball-batting-gloves-adult, agility-training-pole, book-whose-game-is-it-anyway, book-beyond-winning, book-grit, book-mind-gym, book-champions-mind, book-peak, book-inner-game-of-tennis, book-little-book-of-talent, script-binder-1inch, theater-monologue-book, music-folder-performance, music-stand-foldable, gymnastics-grips-youth, martial-arts-sparring-gear-youth, tennis-shoes-court-youth, tennis-balls-standard, foam-roller-triggerpoint-13, foam-roller-basics-24, percussion-massager-renpho-r3, theragun-relief, resistance-bands-loop-fit-simplify, theraband-flat-band-light-medium, ice-pack-arctic-flex-gel, ace-bandage-3inch-set, blackout-curtains-nicetown, white-noise-lectrofan-classic, dance-character-shoes-youth, dance-bun-kit, dance-leg-warmers, stage-makeup-kit, band-reeds-clarinet, band-marching-shoes, baseball-bat-backpack, cheer-poms, baseball-glove-youth, basketball-ball-rubber, soccer-ball-size4 (recovered, see above), lacrosse-ball, softball-glove-11in, lacrosse-starter-kit-youth, football-rubber-youth, soccer-cones-12pk, hockey-puck, volleyball-volley-lite, flag-football-belt-set, hockey-stick-youth, xc-trainers-youth, volleyball-net.

All confirmed correct product, in stock (or a working live results/search page for search-URL slugs), `/go/[slug]/` redirect resolving correctly.

---

## Internal link spot-check (10 random pages from sitemap-content.xml)

Sampled from 2,015 total indexed URLs:

1. /drive-there/summer-tournament-vacation/
2. /coaching-tips/soccer-thigh-trap-with-toss/
3. /body/recovery-basics/
4. /body/wildfire-smoke-aqi/
5. /coaching-tips/lacrosse-girls-give-and-go-pass/
6. /what-to-buy/pickleball/sizing/
7. /body/bus-and-banquet-conduct/
8. /sports/football/
9. /rules/soccer/
10. /coaching-tips/basketball-speed-dribble-full-court/

Extracted **164 unique internal links** across all 10 pages (Cloudflare email-obfuscation links and `/go/` affiliate redirects excluded as expected/already covered). **All 164 returned HTTP 200.** 10/10 pages clean.

---

## Governance cross-check

All 10 confirmed-issue slugs were checked against `reports/affiliate/lifecycle.json` and `src/data/affiliate-governance.json` before queuing:

- All 10 sit in the generic `legacy_offer_unclassified` / `research_and_map_product` bucket shared by most unclassified offers site-wide — none are owned, retired, or special-cased elsewhere in governance or the lifecycle file.
- Placement counts: 9 of 10 are low-traffic (1 each); `soccer-ball-size3` is the outlier at 19 placements.
- No conflict with the monthly reconciler. Safe to hand off to Arnie.

---

## Recommendations (Jeff's call — nothing edited, nothing deployed)

1. **The 07-19 backlog (6 Amazon OOS + 2 Bookshop.org dead links) has now sat broken for 3+ weeks.** Same pattern as the 08-03 run's carry-over problem — recommend prioritizing this batch rather than waiting on the next monthly cycle, and checking whether Arnie is actually consuming `replacement-queue.json` at all.
2. **soccer-ball-size3** is the highest-priority new find (19 placements, no new-condition offer) — queued high.
3. **book-positive-coaching** and **book-talent-code** are hard 404s on Bookshop.org (not stock fluctuations) — queued high alongside soccer-ball-size3.
4. No action needed on **soccer-ball-size4** — resolved itself via restock.
5. Consider a faster recheck cadence for slugs that have been broken across 2+ consecutive cycles, since the current monthly rotation means known-broken links stay live on the site for weeks between checks.

STATE.md has been updated with today's date for all 65 checked slugs.
