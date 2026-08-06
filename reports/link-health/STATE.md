# Link Health Rotation State

Tracks each affiliate slug's **last-checked date** individually. This replaced an earlier index-range approach (checked slugs 0–64, next run 65–129, etc.) because index ranges silently skip or double-check slugs whenever `affiliates.json` gains, loses, or reorders entries — which happens often on this site.

**Selection rule for each run:** pick the ~65 slugs with the oldest `last_checked` date, treating any slug not listed below as never-checked (highest priority). This mirrors how the production `worker-link-checker` D1 table prioritizes checks, and keeps every slug covered roughly once a month regardless of list churn.

Total slugs in affiliates.json as of last run: **245**

## Last-checked dates

Only slugs that have been checked at least once are listed. Anything in `affiliates.json` not in this table has never been checked and should be prioritized first.

| slug | last checked |
|---|---|
| baseball-glove-youth | 2026-07-20 |
| baseball-glove-9in-youth | 2026-07-20 |
| baseball-bat-teeball | 2026-08-03 |
| baseball-helmet-youth | 2026-07-20 |
| baseball-balls-teeball | 2026-08-03 |
| baseball-bases-rubber | 2026-08-03 |
| baseball-balls-wiffle | 2026-07-19 |
| baseball-blitzball-set | 2026-07-19 |
| baseball-glove-breakin-kit | 2026-07-20 |
| baseball-glove-laces | 2026-07-20 |
| baseball-pants-youth | 2026-07-20 |
| baseball-belt-youth | 2026-07-19 |
| baseball-catchers-mitt-32in | 2026-08-03 |
| baseball-batting-gloves-youth | 2026-08-03 |
| baseball-cup-youth | 2026-07-20 |
| baseball-catchers-gear-youth | 2026-08-03 |
| baseball-catchers-bag | 2026-07-19 |
| baseball-sliding-mitt | 2026-07-20 |
| baseball-arm-sleeve | 2026-07-19 |
| baseball-bat-28in | 2026-08-03 |
| baseball-trainer | 2026-07-20 |
| baseball-throwback-net | 2026-07-20 |
| softball-glove-11in | 2026-07-20 |
| softball-face-mask | 2026-07-20 |
| lacrosse-ball | 2026-07-20 |
| lacrosse-goggles-youth | 2026-07-20 |
| lacrosse-starter-kit-youth | 2026-07-20 |
| soccer-cones-12pk | 2026-07-20 |
| soccer-rebound-net | 2026-07-20 |
| soccer-cleats-youth | 2026-07-20 |
| multi-sport-cleats-youth | 2026-07-20 |
| basketball-ball-rubber | 2026-07-20 |
| basketball-ball-forge | 2026-07-20 |
| basketball-ball-authentic | 2026-07-20 |
| multi-sport-sunglasses-youth | 2026-07-20 |
| multi-sport-socks-crew | 2026-07-20 |
| baseball-batting-gloves-adult | 2026-07-19 |
| agility-cones | 2026-08-03 |
| agility-training-pole | 2026-07-19 |
| football-rubber-youth | 2026-07-20 |
| football-leather-youth | 2026-07-20 |
| football-leather-college | 2026-07-20 |
| football-qb-wristbands | 2026-07-20 |
| football-qb-throwing-net | 2026-07-20 |
| hockey-helmet-youth | 2026-07-20 |
| hockey-puck | 2026-07-20 |
| hockey-stick-youth | 2026-07-20 |
| swim-goggles-youth | 2026-07-20 |
| volleyball-net | 2026-07-20 |
| tennis-racquet-junior | 2026-07-20 |
| tennis-balls-orange | 2026-07-20 |
| tennis-net | 2026-07-20 |
| multi-sport-mouthguard-youth | 2026-07-20 |
| football-gloves-receiver-youth | 2026-07-20 |
| football-cleats-youth | 2026-07-20 |
| football-girdle-youth | 2026-07-20 |
| football-cup-shorts-youth | 2026-07-20 |
| football-mouthguard-sisu | 2026-07-20 |
| multi-sport-duffle-bag | 2026-07-20 |
| flag-football-belt-set | 2026-07-20 |
| soccer-shin-guards-youth | 2026-07-20 |
| soccer-shin-guards-ankle-youth | 2026-07-20 |
| soccer-ball-size3 | 2026-07-20 |
| soccer-ball-size4 | 2026-07-20 |
| soccer-ball-size5 | 2026-07-20 |
| soccer-ball-size5-match | 2026-07-27 |
| soccer-socks-youth | 2026-07-20 |
| soccer-goalie-gloves-youth | 2026-07-27 |
| soccer-clearance-cleats | 2026-07-27 |
| soccer-coupon-10-off-100 | 2026-07-27 |
| soccer-garage-shop | 2026-07-27 |
| multi-sport-shoe-bag | 2026-07-27 |
| volleyball-knee-pads-youth | 2026-07-20 |
| volleyball-shoes-upcourt | 2026-07-20 |
| volleyball-volley-lite | 2026-07-20 |
| volleyball-flistatec | 2026-07-27 |
| volleyball-spandex-youth | 2026-07-27 |
| volleyball-ankle-brace | 2026-07-20 |
| xc-trainers-youth | 2026-07-20 |
| xc-spikes-kilkenny | 2026-07-27 |
| xc-base-layer-set-youth | 2026-07-27 |
| xc-running-gloves | 2026-07-27 |
| cheer-shoes-youth | 2026-07-20 |
| cheer-bow-jumbo | 2026-07-27 |
| cheer-hair-gel | 2026-07-27 |
| multi-sport-athletic-tape | 2026-07-20 |
| multi-sport-water-bottle | 2026-07-20 |
| adhesive-bandages | 2026-07-27 |
| gauze-pads | 2026-07-27 |
| athletic-tape-roll | 2026-07-27 |
| butterfly-bandages | 2026-07-27 |
| antibiotic-ointment-travel | 2026-07-27 |
| saline-wipes | 2026-07-27 |
| instant-cold-pack | 2026-07-27 |
| ace-wrap | 2026-07-27 |
| kinesio-tape-precut | 2026-07-27 |
| antihistamine-child | 2026-07-27 |
| bug-bite-stick | 2026-07-27 |
| saline-rinse | 2026-07-27 |
| tweezers-small | 2026-07-27 |
| scissors-blunt-tip | 2026-07-27 |
| sunscreen-travel | 2026-07-20 |
| lip-balm-spf | 2026-07-27 |
| electrolyte-tablets | 2026-07-27 |
| foam-roller-medium | 2026-07-20 |
| ankle-brace-reusable | 2026-07-20 |
| compression-socks | 2026-07-27 |
| water-bottle-32oz | 2026-07-27 |
| electrolyte-powder | 2026-07-27 |
| protein-powder-vanilla | 2026-07-27 |
| hard-cooler-55qt | 2026-07-27 |
| soft-cooler-25qt | 2026-07-27 |
| packing-cubes | 2026-07-27 |
| travel-sport-wash | 2026-07-27 |
| travel-power-strip | 2026-07-27 |
| athletic-socks-multipack | 2026-07-27 |
| mouthguard-boil-bite | 2026-07-20 |
| batting-gloves-pair | 2026-07-27 |
| phone-tripod | 2026-07-20 |
| action-camera | 2026-07-20 |
| shadow-box-jersey | 2026-07-27 |
| stadium-chair-budget | 2026-07-27 |
| stadium-chair-midrange | 2026-07-27 |
| stadium-chair-premium | 2026-07-27 |
| sideline-blanket | 2026-07-27 |
| battery-fan-handheld | 2026-07-27 |
| bug-spray-travel | 2026-07-27 |
| hand-warmers | 2026-07-27 |
| rain-poncho | 2026-07-27 |
| folding-wagon | 2026-07-27 |
| gear-bag-small | 2026-08-03 |
| pop-up-tent-sunscreen | 2026-08-03 |
| seat-cushion | 2026-08-03 |
| frame-8x10 | 2026-08-03 |
| photo-book-service | 2026-08-03 |
| coach-clipboard-dry-erase | 2026-08-03 |
| coach-stopwatch | 2026-08-03 |
| scrimmage-pennies | 2026-08-03 |
| coach-backpack | 2026-08-03 |
| portable-whiteboard | 2026-08-03 |
| first-aid-fanny-pack | 2026-08-03 |
| ball-pump-with-gauge | 2026-08-03 |
| wrestling-headgear | 2026-07-27 |
| wrestling-shoes-youth | 2026-08-03 |
| wrestling-singlet-youth | 2026-08-03 |
| wrestling-knee-pad | 2026-08-03 |
| wrestling-bag | 2026-08-03 |
| pickleball-paddle-youth | 2026-08-03 |
| pickleball-balls-outdoor | 2026-08-03 |
| pickleball-bag | 2026-08-03 |
| pickleball-shoes | 2026-08-03 |
| rugby-mouthguard | 2026-08-03 |
| rugby-cleats | 2026-08-03 |
| rugby-scrum-cap | 2026-08-03 |
| rugby-shoulder-pads | 2026-08-03 |
| foam-roller-standard | 2026-08-03 |
| resistance-bands-set | 2026-07-27 |
| speed-ladder-agility | 2026-08-03 |
| agility-cones-set | 2026-08-03 |
| jump-rope-speed | 2026-08-03 |
| rebounder-net-baseball | 2026-08-03 |
| folding-table-6ft | 2026-08-03 |
| portable-pa-speaker | 2026-08-03 |
| cash-box-lockable | 2026-08-03 |
| label-maker-handheld | 2026-08-03 |
| square-card-reader | 2026-08-03 |
| volleyball-ball-youth-light | 2026-08-03 |
| volleyball-shoes-gel-rocket | 2026-08-03 |
| volleyball-knee-pads-lr6 | 2026-07-27 |
| volleyball-backpack | 2026-08-03 |
| baseball-bat-youth | 2026-07-27 |
| baseball-bat-bbcor | 2026-07-27 |
| baseball-cleats-metal | 2026-07-27 |
| basketball-shoes-youth | 2026-07-27 |
| football-neck-roll | 2026-08-03 |
| hockey-skates-youth | 2026-08-03 |
| hockey-pads-starter | 2026-07-27 |
| hockey-mouthguard | 2026-08-03 |
| softball-bat-youth | 2026-07-27 |
| softball-bat-intermediate | 2026-08-03 |
| softball-bat-hs | 2026-08-03 |
| softball-sliding-shorts | 2026-08-03 |
| softball-pitching-jacket | 2026-08-03 |
| wrestling-rashguard | 2026-08-03 |
| golf-starter-set-youth | 2026-08-03 |
| golf-glove-youth | 2026-08-03 |
| gymnastics-leotard-youth | 2026-07-27 |
| gymnastics-slippers-youth | 2026-07-27 |
| martial-arts-gi-youth | 2026-08-03 |
| lacrosse-stick-boys-youth | 2026-07-27 |
| lacrosse-helmet-boys-youth | 2026-07-27 |
| lacrosse-gloves-youth | 2026-07-27 |
| lacrosse-shoulder-pads-youth | 2026-07-27 |
| lacrosse-stick-girls-youth | 2026-08-03 |
| book-changing-the-game | 2026-08-03 |
| book-whose-game-is-it-anyway | 2026-07-19 |
| book-beyond-winning | 2026-07-19 |
| book-positive-coaching | 2026-07-19 |
| book-mindset | 2026-08-03 |
| book-grit | 2026-07-19 |
| book-mind-gym | 2026-07-19 |
| book-champions-mind | 2026-07-19 |
| book-talent-code | 2026-07-19 |
| book-range | 2026-08-03 |
| book-peak | 2026-07-19 |
| book-inner-game-of-tennis | 2026-07-19 |
| book-little-book-of-talent | 2026-07-19 |
| script-binder-1inch | 2026-07-19 |
| theater-monologue-book | 2026-07-19 |
| music-folder-performance | 2026-07-19 |
| music-stand-foldable | 2026-07-19 |
| gymnastics-grips-youth | 2026-07-19 |
| martial-arts-sparring-gear-youth | 2026-07-19 |
| swim-cap-silicone-youth | 2026-08-03 |
| swimsuit-training-youth | 2026-08-03 |
| tennis-shoes-court-youth | 2026-07-19 |
| tennis-balls-standard | 2026-07-19 |
| athletic-shorts-black-youth | 2026-08-03 |
| foam-roller-triggerpoint-13 | 2026-07-19 |
| foam-roller-basics-24 | 2026-07-19 |
| percussion-massager-renpho-r3 | 2026-07-19 |
| theragun-relief | 2026-07-19 |
| resistance-bands-loop-fit-simplify | 2026-07-19 |
| theraband-flat-band-light-medium | 2026-07-19 |
| ice-pack-arctic-flex-gel | 2026-07-19 |
| ace-bandage-3inch-set | 2026-07-19 |
| blackout-curtains-nicetown | 2026-07-19 |
| white-noise-lectrofan-classic | 2026-07-19 |
| ballet-slippers-canvas-youth | 2026-08-03 |
| ballet-tights-youth | 2026-08-03 |
| dance-jazz-shoes-youth | 2026-07-19 |
| dance-tap-shoes-youth | 2026-07-19 |
| dance-character-shoes-youth | 2026-07-19 |
| dance-bun-kit | 2026-07-19 |
| dance-leg-warmers | 2026-07-19 |
| stage-makeup-kit | 2026-07-19 |
| band-reeds-clarinet | 2026-07-19 |
| band-valve-oil | 2026-07-19 |
| band-practice-pad | 2026-07-19 |
| band-marching-shoes | 2026-07-19 |
| football-helmet-youth | 2026-07-19 |
| football-shoulder-pads-youth | 2026-07-19 |
| lacrosse-arm-pads-youth | 2026-07-19 |
| baseball-bat-backpack | 2026-07-19 |
| cheer-poms | 2026-07-19 |

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

## Next run

Pick the ~65 slugs with the oldest last-checked date. As of 2026-08-03, the 07-08, 07-13, and 07-18 pools are fully cleared (all now dated 2026-08-03 or later). The 07-19 pool has 50 slugs remaining (dated 2026-07-19; 15 of its 65 were pulled forward this run for traffic weighting via `placementCount` in `reports/affiliate/lifecycle.json`). Next run should pick the remaining **50 slugs still dated 2026-07-19** (oldest remaining), then move to the 07-20 pool. Continue the ~monthly cadence.

**Important for next run:** this run's 18 confirmed issues were nearly all (17/18) unresolved carry-overs from 2026-07-18 — the fixes recommended two cycles ago never landed. Recommend checking whether the replacement-sourcer (Arnie) actually picked up `replacement-queue.json` from this run before the next monthly cycle rolls around, rather than assuming the queue is being worked.
