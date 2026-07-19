# Link Health Rotation State

Tracks each affiliate slug's **last-checked date** individually. This replaced an earlier index-range approach (checked slugs 0–64, next run 65–129, etc.) because index ranges silently skip or double-check slugs whenever `affiliates.json` gains, loses, or reorders entries — which happens often on this site.

**Selection rule for each run:** pick the ~65 slugs with the oldest `last_checked` date, treating any slug not listed below as never-checked (highest priority). This mirrors how the production `worker-link-checker` D1 table prioritizes checks, and keeps every slug covered roughly once a month regardless of list churn.

Total slugs in affiliates.json as of last run: **245**

## Last-checked dates

Only slugs that have been checked at least once are listed. Anything in `affiliates.json` not in this table has never been checked and should be prioritized first.

| slug | last checked |
|---|---|
| baseball-glove-youth | 2026-07-08 |
| baseball-glove-9in-youth | 2026-07-08 |
| baseball-bat-teeball | 2026-07-08 |
| baseball-helmet-youth | 2026-07-08 |
| baseball-balls-teeball | 2026-07-08 |
| baseball-bases-rubber | 2026-07-08 |
| baseball-balls-wiffle | 2026-07-08 |
| baseball-blitzball-set | 2026-07-08 |
| baseball-glove-breakin-kit | 2026-07-08 |
| baseball-glove-laces | 2026-07-08 |
| baseball-pants-youth | 2026-07-08 |
| baseball-belt-youth | 2026-07-08 |
| baseball-catchers-mitt-32in | 2026-07-08 |
| baseball-batting-gloves-youth | 2026-07-08 |
| baseball-cup-youth | 2026-07-08 |
| baseball-catchers-gear-youth | 2026-07-08 |
| baseball-catchers-bag | 2026-07-08 |
| baseball-sliding-mitt | 2026-07-08 |
| baseball-arm-sleeve | 2026-07-08 |
| baseball-bat-28in | 2026-07-08 |
| baseball-trainer | 2026-07-08 |
| baseball-throwback-net | 2026-07-08 |
| softball-glove-11in | 2026-07-08 |
| softball-face-mask | 2026-07-08 |
| lacrosse-ball | 2026-07-08 |
| lacrosse-goggles-youth | 2026-07-08 |
| lacrosse-starter-kit-youth | 2026-07-08 |
| soccer-cones-12pk | 2026-07-08 |
| soccer-rebound-net | 2026-07-08 |
| soccer-cleats-youth | 2026-07-08 |
| multi-sport-cleats-youth | 2026-07-08 |
| basketball-ball-rubber | 2026-07-08 |
| basketball-ball-forge | 2026-07-08 |
| basketball-ball-authentic | 2026-07-08 |
| multi-sport-sunglasses-youth | 2026-07-08 |
| multi-sport-socks-crew | 2026-07-08 |
| baseball-batting-gloves-adult | 2026-07-08 |
| agility-cones | 2026-07-08 |
| agility-training-pole | 2026-07-08 |
| football-rubber-youth | 2026-07-08 |
| football-leather-youth | 2026-07-08 |
| football-leather-college | 2026-07-08 |
| football-qb-wristbands | 2026-07-08 |
| football-qb-throwing-net | 2026-07-08 |
| hockey-helmet-youth | 2026-07-08 |
| hockey-puck | 2026-07-08 |
| hockey-stick-youth | 2026-07-08 |
| swim-goggles-youth | 2026-07-08 |
| volleyball-net | 2026-07-08 |
| tennis-racquet-junior | 2026-07-08 |
| tennis-balls-orange | 2026-07-08 |
| tennis-net | 2026-07-08 |
| multi-sport-mouthguard-youth | 2026-07-08 |
| football-gloves-receiver-youth | 2026-07-08 |
| football-cleats-youth | 2026-07-08 |
| football-girdle-youth | 2026-07-08 |
| football-cup-shorts-youth | 2026-07-08 |
| football-mouthguard-sisu | 2026-07-08 |
| multi-sport-duffle-bag | 2026-07-08 |
| flag-football-belt-set | 2026-07-08 |
| soccer-shin-guards-youth | 2026-07-08 |
| soccer-shin-guards-ankle-youth | 2026-07-08 |
| soccer-ball-size3 | 2026-07-08 |
| soccer-ball-size4 | 2026-07-08 |
| soccer-ball-size5 | 2026-07-08 |
| soccer-ball-size5-match | 2026-07-13 |
| soccer-socks-youth | 2026-07-13 |
| soccer-goalie-gloves-youth | 2026-07-13 |
| soccer-clearance-cleats | 2026-07-13 |
| soccer-coupon-10-off-100 | 2026-07-13 |
| soccer-garage-shop | 2026-07-13 |
| multi-sport-shoe-bag | 2026-07-13 |
| volleyball-knee-pads-youth | 2026-07-13 |
| volleyball-shoes-upcourt | 2026-07-13 |
| volleyball-volley-lite | 2026-07-13 |
| volleyball-flistatec | 2026-07-13 |
| volleyball-spandex-youth | 2026-07-13 |
| volleyball-ankle-brace | 2026-07-13 |
| xc-trainers-youth | 2026-07-13 |
| xc-spikes-kilkenny | 2026-07-13 |
| xc-base-layer-set-youth | 2026-07-13 |
| xc-running-gloves | 2026-07-13 |
| cheer-shoes-youth | 2026-07-13 |
| cheer-bow-jumbo | 2026-07-13 |
| cheer-hair-gel | 2026-07-13 |
| multi-sport-athletic-tape | 2026-07-13 |
| multi-sport-water-bottle | 2026-07-13 |
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
| sunscreen-travel | 2026-07-13 |
| lip-balm-spf | 2026-07-13 |
| electrolyte-tablets | 2026-07-13 |
| foam-roller-medium | 2026-07-13 |
| ankle-brace-reusable | 2026-07-13 |
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
| mouthguard-boil-bite | 2026-07-13 |
| batting-gloves-pair | 2026-07-13 |
| phone-tripod | 2026-07-13 |
| action-camera | 2026-07-13 |
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

## Run log

| Date | Slugs checked | Report | Issues |
|---|---|---|---|
| 2026-07-08 | 65 (see table above) | LINK_HEALTH_2026-07-08.md | 0 confirmed (6 bot-detection false positives) |
| 2026-07-13 | 65 (see table above) | LINK_HEALTH_2026-07-13.md | 2 confirmed: foam-roller-medium (unavailable), stadium-chair-premium (temp OOS) |
| 2026-07-18 | 65 (never-checked backlog) | LINK_HEALTH_2026-07-18.md | 23 confirmed: 14 dead ASINs, 3 OOS, 5 product mismatches, 1 non-Amazon 404 (square-card-reader). 0 false positives, 0 unconfirmed. High degradation rate — never-checked backlog appears bulk-added with unvalidated ASINs. |

## Next run

Pick the ~65 slugs with the oldest last-checked date (all slugs not in the table above first, since they've never been checked), check them, then update their dates here.

**~50 never-checked slugs remain** as of 2026-07-18 (195 of 245 now dated). Continue draining the never-checked backlog before returning to the 2026-07-08 dated slugs. Given the ~35% degradation rate found in the backlog, expect more dead/mismatched ASINs next run.
