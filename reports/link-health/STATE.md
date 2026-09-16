# Link Health Rotation State

Tracks each affiliate slug's **last-checked date** individually. This replaced an earlier index-range approach (checked slugs 0–64, next run 65–129, etc.) because index ranges silently skip or double-check slugs whenever `affiliates.json` gains, loses, or reorders entries — which happens often on this site.

**Selection rule for each run:** pick the ~65 slugs with the oldest `last_checked` date, treating any slug not listed below as never-checked (highest priority). This mirrors how the production `worker-link-checker` D1 table prioritizes checks, and keeps every slug covered roughly once a month regardless of list churn.

Total slugs in affiliates.json as of last run: **245**

## Last-checked dates

Only slugs that have been checked at least once are listed. Anything in `affiliates.json` not in this table has never been checked and should be prioritized first.

| slug | last checked |
|---|---|
| baseball-glove-youth | 2026-09-14 |
| baseball-glove-9in-youth | 2026-08-17 |
| baseball-bat-teeball | 2026-09-14 |
| baseball-helmet-youth | 2026-08-17 |
| baseball-balls-teeball | 2026-09-14 |
| baseball-bases-rubber | 2026-09-14 |
| baseball-balls-wiffle | 2026-08-10 |
| baseball-blitzball-set | 2026-08-10 |
| baseball-glove-breakin-kit | 2026-08-17 |
| baseball-glove-laces | 2026-08-17 |
| baseball-pants-youth | 2026-08-17 |
| baseball-belt-youth | 2026-08-10 |
| baseball-catchers-mitt-32in | 2026-09-14 |
| baseball-batting-gloves-youth | 2026-09-14 |
| baseball-cup-youth | 2026-08-17 |
| baseball-catchers-gear-youth | 2026-09-14 |
| baseball-catchers-bag | 2026-08-10 |
| baseball-sliding-mitt | 2026-08-17 |
| baseball-arm-sleeve | 2026-08-10 |
| baseball-bat-28in | 2026-09-14 |
| baseball-trainer | 2026-08-17 |
| baseball-throwback-net | 2026-08-17 |
| softball-glove-11in | 2026-09-14 |
| softball-face-mask | 2026-08-17 |
| lacrosse-ball | 2026-09-14 |
| lacrosse-goggles-youth | 2026-08-17 |
| lacrosse-starter-kit-youth | 2026-09-14 |
| soccer-cones-12pk | 2026-09-14 |
| soccer-rebound-net | 2026-08-17 |
| soccer-cleats-youth | 2026-08-17 |
| multi-sport-cleats-youth | 2026-08-17 |
| basketball-ball-rubber | 2026-09-14 |
| basketball-ball-forge | 2026-08-17 |
| basketball-ball-authentic | 2026-08-17 |
| multi-sport-sunglasses-youth | 2026-08-17 |
| multi-sport-socks-crew | 2026-08-17 |
| baseball-batting-gloves-adult | 2026-08-10 |
| agility-cones | 2026-09-14 |
| agility-training-pole | 2026-08-10 |
| football-rubber-youth | 2026-09-14 |
| football-leather-youth | 2026-08-17 |
| football-leather-college | 2026-08-17 |
| football-qb-wristbands | 2026-08-17 |
| football-qb-throwing-net | 2026-08-17 |
| hockey-helmet-youth | 2026-08-17 |
| hockey-puck | 2026-09-14 |
| hockey-stick-youth | 2026-09-14 |
| swim-goggles-youth | 2026-08-17 |
| volleyball-net | 2026-09-14 |
| tennis-racquet-junior | 2026-08-17 |
| tennis-balls-orange | 2026-08-17 |
| tennis-net | 2026-08-17 |
| multi-sport-mouthguard-youth | 2026-08-17 |
| football-gloves-receiver-youth | 2026-08-17 |
| football-cleats-youth | 2026-08-17 |
| football-girdle-youth | 2026-08-17 |
| football-cup-shorts-youth | 2026-08-17 |
| football-mouthguard-sisu | 2026-08-17 |
| multi-sport-duffle-bag | 2026-08-17 |
| flag-football-belt-set | 2026-09-14 |
| soccer-shin-guards-youth | 2026-08-17 |
| soccer-shin-guards-ankle-youth | 2026-08-17 |
| soccer-ball-size3 | 2026-09-14 |
| soccer-ball-size4 | 2026-09-14 |
| soccer-ball-size5 | 2026-08-17 |
| soccer-ball-size5-match | 2026-09-07 |
| soccer-socks-youth | 2026-08-17 |
| soccer-goalie-gloves-youth | 2026-08-17 |
| soccer-clearance-cleats | 2026-09-07 |
| soccer-coupon-10-off-100 | 2026-09-07 |
| soccer-garage-shop | 2026-09-07 |
| multi-sport-shoe-bag | 2026-09-07 |
| volleyball-knee-pads-youth | 2026-08-17 |
| volleyball-shoes-upcourt | 2026-08-17 |
| volleyball-volley-lite | 2026-09-14 |
| volleyball-flistatec | 2026-09-07 |
| volleyball-spandex-youth | 2026-08-17 |
| volleyball-ankle-brace | 2026-08-17 |
| xc-trainers-youth | 2026-09-14 |
| xc-spikes-kilkenny | 2026-08-17 |
| xc-base-layer-set-youth | 2026-09-07 |
| xc-running-gloves | 2026-09-07 |
| cheer-shoes-youth | 2026-08-17 |
| cheer-bow-jumbo | 2026-08-17 |
| cheer-hair-gel | 2026-09-07 |
| multi-sport-athletic-tape | 2026-08-17 |
| multi-sport-water-bottle | 2026-08-17 |
| adhesive-bandages | 2026-09-07 |
| gauze-pads | 2026-09-07 |
| athletic-tape-roll | 2026-08-17 |
| butterfly-bandages | 2026-09-07 |
| antibiotic-ointment-travel | 2026-09-07 |
| saline-wipes | 2026-08-17 |
| instant-cold-pack | 2026-08-17 |
| ace-wrap | 2026-09-07 |
| kinesio-tape-precut | 2026-08-17 |
| antihistamine-child | 2026-09-07 |
| bug-bite-stick | 2026-09-07 |
| saline-rinse | 2026-09-07 |
| tweezers-small | 2026-09-07 |
| scissors-blunt-tip | 2026-09-07 |
| sunscreen-travel | 2026-08-17 |
| lip-balm-spf | 2026-09-07 |
| electrolyte-tablets | 2026-09-07 |
| foam-roller-medium | 2026-08-17 |
| ankle-brace-reusable | 2026-08-17 |
| compression-socks | 2026-09-07 |
| water-bottle-32oz | 2026-09-07 |
| electrolyte-powder | 2026-09-07 |
| protein-powder-vanilla | 2026-09-07 |
| hard-cooler-55qt | 2026-08-17 |
| soft-cooler-25qt | 2026-09-07 |
| packing-cubes | 2026-09-07 |
| travel-sport-wash | 2026-09-07 |
| travel-power-strip | 2026-09-07 |
| athletic-socks-multipack | 2026-09-07 |
| mouthguard-boil-bite | 2026-08-17 |
| batting-gloves-pair | 2026-09-07 |
| phone-tripod | 2026-08-17 |
| action-camera | 2026-08-17 |
| shadow-box-jersey | 2026-09-07 |
| stadium-chair-budget | 2026-09-07 |
| stadium-chair-midrange | 2026-09-07 |
| stadium-chair-premium | 2026-09-07 |
| sideline-blanket | 2026-09-07 |
| battery-fan-handheld | 2026-09-07 |
| bug-spray-travel | 2026-09-07 |
| hand-warmers | 2026-09-07 |
| rain-poncho | 2026-09-07 |
| folding-wagon | 2026-09-07 |
| gear-bag-small | 2026-09-07 |
| pop-up-tent-sunscreen | 2026-09-07 |
| seat-cushion | 2026-09-14 |
| frame-8x10 | 2026-09-14 |
| photo-book-service | 2026-09-14 |
| coach-clipboard-dry-erase | 2026-09-14 |
| coach-stopwatch | 2026-09-14 |
| scrimmage-pennies | 2026-09-14 |
| coach-backpack | 2026-09-14 |
| portable-whiteboard | 2026-09-14 |
| first-aid-fanny-pack | 2026-09-14 |
| ball-pump-with-gauge | 2026-09-14 |
| wrestling-headgear | 2026-09-07 |
| wrestling-shoes-youth | 2026-09-07 |
| wrestling-singlet-youth | 2026-09-07 |
| wrestling-knee-pad | 2026-09-07 |
| wrestling-bag | 2026-09-14 |
| pickleball-paddle-youth | 2026-09-14 |
| pickleball-balls-outdoor | 2026-09-14 |
| pickleball-bag | 2026-09-14 |
| pickleball-shoes | 2026-09-14 |
| rugby-mouthguard | 2026-09-14 |
| rugby-cleats | 2026-09-14 |
| rugby-scrum-cap | 2026-09-14 |
| rugby-shoulder-pads | 2026-09-14 |
| foam-roller-standard | 2026-09-14 |
| resistance-bands-set | 2026-08-17 |
| speed-ladder-agility | 2026-09-14 |
| agility-cones-set | 2026-09-14 |
| jump-rope-speed | 2026-09-14 |
| rebounder-net-baseball | 2026-09-14 |
| folding-table-6ft | 2026-09-14 |
| portable-pa-speaker | 2026-09-14 |
| cash-box-lockable | 2026-09-14 |
| label-maker-handheld | 2026-09-14 |
| square-card-reader | 2026-09-14 |
| volleyball-ball-youth-light | 2026-09-14 |
| volleyball-shoes-gel-rocket | 2026-09-14 |
| volleyball-knee-pads-lr6 | 2026-09-07 |
| volleyball-backpack | 2026-09-14 |
| baseball-bat-youth | 2026-08-17 |
| baseball-bat-bbcor | 2026-08-17 |
| baseball-cleats-metal | 2026-09-07 |
| basketball-shoes-youth | 2026-08-17 |
| football-neck-roll | 2026-09-14 |
| hockey-skates-youth | 2026-09-14 |
| hockey-pads-starter | 2026-09-07 |
| hockey-mouthguard | 2026-09-14 |
| softball-bat-youth | 2026-09-07 |
| softball-bat-intermediate | 2026-09-14 |
| softball-bat-hs | 2026-09-14 |
| softball-sliding-shorts | 2026-09-14 |
| softball-pitching-jacket | 2026-09-14 |
| wrestling-rashguard | 2026-09-14 |
| golf-starter-set-youth | 2026-09-14 |
| golf-glove-youth | 2026-09-14 |
| gymnastics-leotard-youth | 2026-08-17 |
| gymnastics-slippers-youth | 2026-08-17 |
| martial-arts-gi-youth | 2026-09-14 |
| lacrosse-stick-boys-youth | 2026-09-07 |
| lacrosse-helmet-boys-youth | 2026-09-07 |
| lacrosse-gloves-youth | 2026-09-07 |
| lacrosse-shoulder-pads-youth | 2026-09-07 |
| lacrosse-stick-girls-youth | 2026-09-14 |
| book-changing-the-game | 2026-09-14 |
| book-whose-game-is-it-anyway | 2026-08-10 |
| book-beyond-winning | 2026-08-10 |
| book-positive-coaching | 2026-08-10 |
| book-mindset | 2026-09-07 |
| book-grit | 2026-08-10 |
| book-mind-gym | 2026-08-10 |
| book-champions-mind | 2026-08-10 |
| book-talent-code | 2026-08-10 |
| book-range | 2026-09-07 |
| book-peak | 2026-08-10 |
| book-inner-game-of-tennis | 2026-08-10 |
| book-little-book-of-talent | 2026-08-10 |
| script-binder-1inch | 2026-08-10 |
| theater-monologue-book | 2026-08-10 |
| music-folder-performance | 2026-09-07 |
| music-stand-foldable | 2026-09-07 |
| gymnastics-grips-youth | 2026-09-07 |
| martial-arts-sparring-gear-youth | 2026-08-10 |
| swim-cap-silicone-youth | 2026-09-07 |
| swimsuit-training-youth | 2026-09-07 |
| tennis-shoes-court-youth | 2026-08-10 |
| tennis-balls-standard | 2026-08-10 |
| athletic-shorts-black-youth | 2026-09-07 |
| foam-roller-triggerpoint-13 | 2026-08-10 |
| foam-roller-basics-24 | 2026-08-10 |
| percussion-massager-renpho-r3 | 2026-08-10 |
| theragun-relief | 2026-08-10 |
| resistance-bands-loop-fit-simplify | 2026-08-10 |
| theraband-flat-band-light-medium | 2026-08-10 |
| ice-pack-arctic-flex-gel | 2026-08-10 |
| ace-bandage-3inch-set | 2026-08-10 |
| blackout-curtains-nicetown | 2026-08-10 |
| white-noise-lectrofan-classic | 2026-08-10 |
| ballet-slippers-canvas-youth | 2026-09-07 |
| ballet-tights-youth | 2026-09-07 |
| dance-jazz-shoes-youth | 2026-08-10 |
| dance-tap-shoes-youth | 2026-08-10 |
| dance-character-shoes-youth | 2026-08-10 |
| dance-bun-kit | 2026-08-10 |
| dance-leg-warmers | 2026-08-10 |
| stage-makeup-kit | 2026-08-10 |
| band-reeds-clarinet | 2026-08-10 |
| band-valve-oil | 2026-08-10 |
| band-practice-pad | 2026-08-10 |
| band-marching-shoes | 2026-08-10 |
| football-helmet-youth | 2026-08-10 |
| football-shoulder-pads-youth | 2026-08-10 |
| lacrosse-arm-pads-youth | 2026-08-10 |
| baseball-bat-backpack | 2026-08-10 |
| cheer-poms | 2026-08-10 |

## Run log

| Date | Slugs checked | Report | Issues |
|---|---|---|---|
| 2026-07-08 | 65 (see table above) | LINK_HEALTH_2026-07-08.md | 0 confirmed (6 bot-detection false positives) |
| 2026-07-13 | 65 (see table above) | LINK_HEALTH_2026-07-13.md | 2 confirmed: foam-roller-medium (unavailable), stadium-chair-premium (temp OOS) |
| 2026-07-18 | 65 (never-checked backlog) | LINK_HEALTH_2026-07-18.md | 23 confirmed: 14 dead ASINs, 3 OOS, 5 product mismatches, 1 non-Amazon 404 (square-card-reader). 0 false positives, 0 unconfirmed. |
| 2026-07-19 | 65 (last 50 never-checked + 15 oldest 07-08) | LINK_HEALTH_2026-07-19.md | 8 confirmed: 6 Amazon out-of-stock (football-helmet-youth, lacrosse-arm-pads-youth, dance-jazz-shoes-youth, dance-tap-shoes-youth, band-valve-oil, band-practice-pad), 2 Bookshop.org catalog-missing ISBNs (book-positive-coaching, book-talent-code). 0 false positives, 0 unconfirmed. No dead ASINs/mismatches. |
| 2026-07-20 | 65 (remaining 50 oldest-dated 07-08 + 15 highest-traffic 07-13) | LINK_HEALTH_2026-07-20.md | 2 confirmed: soccer-ball-size4 (out-of-stock, high priority — 66 placements), soccer-shin-guards-ankle-youth (degraded buy box — "See All Buying Options" only, low priority). 0 false positives, 0 unconfirmed. foam-roller-medium (flagged 07-13) confirmed resolved/back in stock. |
| 2026-07-27 | 65 (remaining 50 oldest-dated 07-13 + 15 highest-traffic 07-18) | LINK_HEALTH_2026-07-27.md | 5 confirmed: wrestling-headgear (dead ASIN/404), hockey-pads-starter (mismatch + out-of-stock), basketball-shoes-youth (out-of-stock, 3 placements), gymnastics-slippers-youth (mismatch), lacrosse-shoulder-pads-youth (mismatch). 5 false positives dismissed (Amazon bot-detection page via curl pre-screen, all confirmed clean in-browser). 0 unconfirmed. |
| 2026-08-03 | 65 (remaining 50 oldest-dated 07-18 + 15 highest-traffic 07-19) | LINK_HEALTH_2026-08-03.md | 18 confirmed (13 dead ASINs, 1 OOS, 3 mismatches, 1 non-Amazon 404) — all but 1 are unresolved carry-overs from the original 07-18 findings on this same slug pool (foam-roller-standard self-resolved via restock). 0 false positives, 0 unconfirmed. |
| 2026-08-10 | 65 (remaining 50 oldest-dated 07-19 + 15 highest-traffic 07-20) | LINK_HEALTH_2026-08-10.md | 10 confirmed (2 non-Amazon 404 on Bookshop.org, 8 Amazon out-of-stock/unbuyable) — 8/10 are unresolved carry-overs from 07-19 (football-helmet-youth, lacrosse-arm-pads-youth, dance-jazz-shoes-youth, dance-tap-shoes-youth, band-valve-oil, band-practice-pad, book-positive-coaching, book-talent-code), 2 newly discovered (football-shoulder-pads-youth OOS, soccer-ball-size3 no new-condition offer). soccer-ball-size4 (flagged 07-20) confirmed resolved/back in stock. 0 false positives, 0 unconfirmed. |
| 2026-08-17 | 65 (remaining 50 oldest-dated 07-20 + 15 highest-traffic 07-27) | LINK_HEALTH_2026-08-17.md | 7 confirmed (6 Amazon out-of-stock/unbuyable, 1 non-Amazon redirect-to-category mismatch) — 1 is a re-degraded carry-over (soccer-shin-guards-ankle-youth, flagged "See All Buying Options" 07-20, now fully "Currently unavailable"), 1 is a repeat offender (foam-roller-medium, flagged 07-13, resolved by 07-20, broken again today), 5 newly discovered this run (multi-sport-socks-crew, hockey-helmet-youth, tennis-racquet-junior, football-cup-shorts-youth, soccer-goalie-gloves-youth). All 65 destinations checked live in-browser (Claude in Chrome) via the /go/[slug]/ redirect, so this run's numbers are already fully browser-confirmed — 0 false positives, 0 unconfirmed. soccer-ball-size3 (flagged 08-10 as no-new-offer) was outside this run's pool and not rechecked. |
| 2026-09-07 | 65 (remaining 50 oldest-dated 07-27 + 15 highest-traffic pulled forward from 08-03/08-10) | LINK_HEALTH_2026-09-07.md | 4 confirmed, all Amazon "no featured offer"/out-of-stock, all newly discovered this run: batting-gloves-pair (Currently unavailable, 1 placement), cheer-hair-gel (no featured offer either size, 1 placement), bug-spray-travel (no featured offer, 1 placement), ballet-tights-youth (no featured offer, 2 placements — highest priority this run). 2 false positives dismissed (Bookshop.org curl 403s — book-mindset, book-range — both confirmed live/in-stock in browser). 0 unconfirmed. All 65 /go/ redirects confirmed correct via HEAD-only check (redirect layer fully healthy). None of the 08-17 report's 7 open items were in this run's pool, so no fresh read on their status; see replacement-queue.json history/report for Arnie's 08-27 work on those. Internal link spot-check: 10/10 pages clean, 121 unique links, 120 resolved clean, 1 curl-only artifact (softball-glove-11in's amzn.to target has a stray unescaped quote character in its query string — real browsers handle it fine, curl doesn't) dismissed after browser confirmation; that slug is outside this run's batch. |
| 2026-09-14 | 68 (remaining 53 oldest-dated 08-03 + 15 highest-traffic pulled forward from 08-10) | LINK_HEALTH_2026-09-14.md | 8 confirmed, all browser-verified directly (no curl pre-screen used, so 0 false positives to dismiss): hockey-skates-youth (dead ASIN/"Currently unavailable", high priority), football-neck-roll (mismatch — resolves to a ski mask/balaclava, high priority), volleyball-backpack (mismatch — resolves to a baseball/softball backpack, high priority), portable-pa-speaker (degraded — new offer gone, only a $544 used unit from a third-party seller vs. a normal ~$100-150 speaker, high priority), baseball-batting-gloves-youth (out-of-stock — lands on an Adult Large variant marked "Currently unavailable" even though youth sizes exist on the same listing, medium priority), foam-roller-standard (degraded — new offer gone, only 1 used unit left, medium priority), folding-table-6ft (degraded — no featured new offer, "See All Buying Options" only with a "High price" flag, medium priority), wrestling-rashguard (mismatch — resolves to a generic soccer/baseball fleece thermal baselayer, not a rashguard, medium priority). 0 unconfirmed. soccer-ball-size3 (flagged 08-10 as no-new-offer) confirmed resolved — back to a normal Amazon.com new-condition Buy Now listing (1 left in stock). soccer-ball-size4 re-checked clean. Internal link spot-check: 10/10 pages loaded correctly, no 404s. Two low-confidence naming/spec observations noted in the report but NOT added to the queue (football-rubber-youth resolves to an "Official Size" composite ball rather than an explicitly youth/rubber one; soccer-cones-12pk resolves to a 25-pack — both pre-existing, ambiguous whether intentional, and in stock). |

## Next run

As of 2026-09-14, the 07-08 through 08-03 pools are fully cleared (all now dated 2026-09-07 or later). The next-oldest pool is **2026-08-10, with 47 slugs remaining** (15 of its original 62 were pulled forward in this run for traffic weighting). Next run should pick the remaining **47 slugs still dated 2026-08-10** (oldest remaining), then fill out to ~65 with an ~18-slug traffic-weighted pull from the **2026-08-17 pool**, ranked by `placementCount` in `reports/affiliate/lifecycle.json` (re-pull the ranking fresh next run — it shifts). Continue the ~monthly cadence.

**For next run — 4 open queue items to re-check status on:** hockey-skates-youth, football-neck-roll, volleyball-backpack, and portable-pa-speaker are the high-priority items from this run; check with Jeff/Arnie whether replacements have been sourced and pushed before assuming they're still broken.

**Carried forward:** the pattern of unresolved carry-overs (see 08-03/08-10/08-17 history) means it's worth periodically confirming Arnie is actually clearing `replacement-queue.json` items rather than assuming the backlog shrinks on its own. Also still unverified: whether `worker-link-checker` has been deployed (last confirmed state, carried since 07-19: not deployed, `link_health` D1 table stale). Treat hard 404s as in-scope again next run unless Jeff confirms otherwise.
