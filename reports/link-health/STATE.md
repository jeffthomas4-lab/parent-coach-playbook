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

## Run log

| Date | Slugs checked | Report | Issues |
|---|---|---|---|
| 2026-07-08 | 65 (see table above) | LINK_HEALTH_2026-07-08.md | 0 confirmed (6 bot-detection false positives) |
| 2026-07-13 | 65 (see table above) | LINK_HEALTH_2026-07-13.md | 2 confirmed: foam-roller-medium (unavailable), stadium-chair-premium (temp OOS) |

## Next run

Pick the ~65 slugs with the oldest last-checked date (all slugs not in the table above first, since they've never been checked), check them, then update their dates here.
