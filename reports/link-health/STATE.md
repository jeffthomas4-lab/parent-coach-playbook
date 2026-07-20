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
| baseball-bat-teeball | 2026-07-19 |
| baseball-helmet-youth | 2026-07-20 |
| baseball-balls-teeball | 2026-07-19 |
| baseball-bases-rubber | 2026-07-19 |
| baseball-balls-wiffle | 2026-07-19 |
| baseball-blitzball-set | 2026-07-19 |
| baseball-glove-breakin-kit | 2026-07-20 |
| baseball-glove-laces | 2026-07-20 |
| baseball-pants-youth | 2026-07-20 |
| baseball-belt-youth | 2026-07-19 |
| baseball-catchers-mitt-32in | 2026-07-19 |
| baseball-batting-gloves-youth | 2026-07-19 |
| baseball-cup-youth | 2026-07-20 |
| baseball-catchers-gear-youth | 2026-07-19 |
| baseball-catchers-bag | 2026-07-19 |
| baseball-sliding-mitt | 2026-07-20 |
| baseball-arm-sleeve | 2026-07-19 |
| baseball-bat-28in | 2026-07-19 |
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
| agility-cones | 2026-07-19 |
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
| soccer-ball-size5-match | 2026-07-13 |
| soccer-socks-youth | 2026-07-20 |
| soccer-goalie-gloves-youth | 2026-07-13 |
| soccer-clearance-cleats | 2026-07-13 |
| soccer-coupon-10-off-100 | 2026-07-13 |
| soccer-garage-shop | 2026-07-13 |
| multi-sport-shoe-bag | 2026-07-13 |
| volleyball-knee-pads-youth | 2026-07-20 |
| volleyball-shoes-upcourt | 2026-07-20 |
| volleyball-volley-lite | 2026-07-20 |
| volleyball-flistatec | 2026-07-13 |
| volleyball-spandex-youth | 2026-07-13 |
| volleyball-ankle-brace | 2026-07-20 |
| xc-trainers-youth | 2026-07-20 |
| xc-spikes-kilkenny | 2026-07-13 |
| xc-base-layer-set-youth | 2026-07-13 |
| xc-running-gloves | 2026-07-13 |
| cheer-shoes-youth | 2026-07-20 |
| cheer-bow-jumbo | 2026-07-13 |
| cheer-hair-gel | 2026-07-13 |
| multi-sport-athletic-tape | 2026-07-20 |
| multi-sport-water-bottle | 2026-07-20 |
| adhesive-bandages | 2026-07-13 |
| gauze-pads | 2026-07-13 |
| athletic-tape-roll | 2026-07-13 |
| butterfly-bandages | 2026-07-13 |
| antibiotic-ointment-travel | 2026-07-13 |
| saline-wipes | 2026-07-13 |
| instant-cold-pack | 2026-07-13 |
| ace-wrap | 2026-07-13 |
| kinesio-tape-precut | 2026-07-13 |
| antihistamine-child | 2026-07-13 |
| bug-bite-stick | 2026-07-13 |
| saline-rinse | 2026-07-13 |
| tweezers-small | 2026-07-13 |
| scissors-blunt-tip | 2026-07-13 |
| sunscreen-travel | 2026-07-20 |
| lip-balm-spf | 2026-07-13 |
| electrolyte-tablets | 2026-07-13 |
| foam-roller-medium | 2026-07-20 |
| ankle-brace-reusable | 2026-07-20 |
| compression-socks | 2026-07-13 |
| water-bottle-32oz | 2026-07-13 |
| electrolyte-powder | 2026-07-13 |
| protein-powder-vanilla | 2026-07-13 |
| hard-cooler-55qt | 2026-07-13 |
| soft-cooler-25qt | 2026-07-13 |
| packing-cubes | 2026-07-13 |
| travel-sport-wash | 2026-07-13 |
| travel-power-strip | 2026-07-13 |
| athletic-socks-multipack | 2026-07-13 |
| mouthguard-boil-bite | 2026-07-20 |
| batting-gloves-pair | 2026-07-13 |
| phone-tripod | 2026-07-20 |
| action-camera | 2026-07-20 |
| shadow-box-jersey | 2026-07-13 |
| stadium-chair-budget | 2026-07-13 |
| stadium-chair-midrange | 2026-07-13 |
| stadium-chair-premium | 2026-07-13 |
| sideline-blanket | 2026-07-13 |
| battery-fan-handheld | 2026-07-13 |
| bug-spray-travel | 2026-07-13 |
| hand-warmers | 2026-07-13 |
| rain-poncho | 2026-07-13 |
| folding-wagon | 2026-07-13 |
| gear-bag-small | 2026-07-18 |
| pop-up-tent-sunscreen | 2026-07-18 |
| seat-cushion | 2026-07-18 |
| frame-8x10 | 2026-07-18 |
| photo-book-service | 2026-07-18 |
| coach-clipboard-dry-erase | 2026-07-18 |
| coach-stopwatch | 2026-07-18 |
| scrimmage-pennies | 2026-07-18 |
| coach-backpack | 2026-07-18 |
| portable-whiteboard | 2026-07-18 |
| first-aid-fanny-pack | 2026-07-18 |
| ball-pump-with-gauge | 2026-07-18 |
| wrestling-headgear | 2026-07-18 |
| wrestling-shoes-youth | 2026-07-18 |
| wrestling-singlet-youth | 2026-07-18 |
| wrestling-knee-pad | 2026-07-18 |
| wrestling-bag | 2026-07-18 |
| pickleball-paddle-youth | 2026-07-18 |
| pickleball-balls-outdoor | 2026-07-18 |
| pickleball-bag | 2026-07-18 |
| pickleball-shoes | 2026-07-18 |
| rugby-mouthguard | 2026-07-18 |
| rugby-cleats | 2026-07-18 |
| rugby-scrum-cap | 2026-07-18 |
| rugby-shoulder-pads | 2026-07-18 |
| foam-roller-standard | 2026-07-18 |
| resistance-bands-set | 2026-07-18 |
| speed-ladder-agility | 2026-07-18 |
| agility-cones-set | 2026-07-18 |
| jump-rope-speed | 2026-07-18 |
| rebounder-net-baseball | 2026-07-18 |
| folding-table-6ft | 2026-07-18 |
| portable-pa-speaker | 2026-07-18 |
| cash-box-lockable | 2026-07-18 |
| label-maker-handheld | 2026-07-18 |
| square-card-reader | 2026-07-18 |
| volleyball-ball-youth-light | 2026-07-18 |
| volleyball-shoes-gel-rocket | 2026-07-18 |
| volleyball-knee-pads-lr6 | 2026-07-18 |
| volleyball-backpack | 2026-07-18 |
| baseball-bat-youth | 2026-07-18 |
| baseball-bat-bbcor | 2026-07-18 |
| baseball-cleats-metal | 2026-07-18 |
| basketball-shoes-youth | 2026-07-18 |
| football-neck-roll | 2026-07-18 |
| hockey-skates-youth | 2026-07-18 |
| hockey-pads-starter | 2026-07-18 |
| hockey-mouthguard | 2026-07-18 |
| softball-bat-youth | 2026-07-18 |
| softball-bat-intermediate | 2026-07-18 |
| softball-bat-hs | 2026-07-18 |
| softball-sliding-shorts | 2026-07-18 |
| softball-pitching-jacket | 2026-07-18 |
| wrestling-rashguard | 2026-07-18 |
| golf-starter-set-youth | 2026-07-18 |
| golf-glove-youth | 2026-07-18 |
| gymnastics-leotard-youth | 2026-07-18 |
| gymnastics-slippers-youth | 2026-07-18 |
| martial-arts-gi-youth | 2026-07-18 |
| lacrosse-stick-boys-youth | 2026-07-18 |
| lacrosse-helmet-boys-youth | 2026-07-18 |
| lacrosse-gloves-youth | 2026-07-18 |
| lacrosse-shoulder-pads-youth | 2026-07-18 |
| lacrosse-stick-girls-youth | 2026-07-18 |
| book-changing-the-game | 2026-07-18 |
| book-whose-game-is-it-anyway | 2026-07-19 |
| book-beyond-winning | 2026-07-19 |
| book-positive-coaching | 2026-07-19 |
| book-mindset | 2026-07-19 |
| book-grit | 2026-07-19 |
| book-mind-gym | 2026-07-19 |
| book-champions-mind | 2026-07-19 |
| book-talent-code | 2026-07-19 |
| book-range | 2026-07-19 |
| book-peak | 2026-07-19 |
| book-inner-game-of-tennis | 2026-07-19 |
| book-little-book-of-talent | 2026-07-19 |
| script-binder-1inch | 2026-07-19 |
| theater-monologue-book | 2026-07-19 |
| music-folder-performance | 2026-07-19 |
| music-stand-foldable | 2026-07-19 |
| gymnastics-grips-youth | 2026-07-19 |
| martial-arts-sparring-gear-youth | 2026-07-19 |
| swim-cap-silicone-youth | 2026-07-19 |
| swimsuit-training-youth | 2026-07-19 |
| tennis-shoes-court-youth | 2026-07-19 |
| tennis-balls-standard | 2026-07-19 |
| athletic-shorts-black-youth | 2026-07-19 |
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
| ballet-slippers-canvas-youth | 2026-07-19 |
| ballet-tights-youth | 2026-07-19 |
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

## Next run

Pick the ~65 slugs with the oldest last-checked date. The never-checked backlog was fully drained as of 2026-07-19. As of 2026-07-20, all 50 remaining 2026-07-08 slugs plus the 15 highest-traffic 2026-07-13 slugs have been checked — **the 07-08 pool is now fully cleared.** Next run should pick from the remaining **50 slugs still dated 2026-07-13** (oldest remaining), then the rest of 07-13, then 07-18, etc. Continue the ~monthly cadence. Traffic-weighting proxy used this run: count of references to each slug across `src/content/**` (guides/articles) as a stand-in for page traffic — no direct analytics access. Consider asking Jeff whether a real analytics source (GSC/GA) can be connected for a better traffic signal.
