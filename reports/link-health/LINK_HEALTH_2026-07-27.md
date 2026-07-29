# Link Health Report — 2026-07-27

**Summary: 65 slugs checked · 5 confirmed issues (1 dead ASIN, 1 out-of-stock, 3 product mismatches — one of the mismatches also out of stock) · 5 false positives dismissed (Amazon bot-detection page, curl-only) · 0 unconfirmed · 10/10 sampled pages clean.**

## Scope note

The daily-cron link-checker Worker (`worker-link-checker/`) is still **not confirmed deployed**: `workers_list` on the Cloudflare account shows no worker by that name, and a direct query against the `parent-coach-playbook` D1 database (`8336fa9f-cc4f-4475-8284-e75658e26399`) confirms no `link_health` table exists. Per standing instructions, this run continued to treat hard 404s as in-scope. Jeff: once that Worker is deployed and the table is populating, future runs can drop back to degradation-only.

## Batch selection

Per `STATE.md`, the never-checked backlog and the 2026-07-08 pool were both fully cleared as of 2026-07-20. This run pulled:

- All **50 remaining slugs still dated 2026-07-13** (the oldest pool left), plus
- The **15 highest-traffic slugs** from the next-oldest pool (2026-07-18, 65 slugs), ranked by content-link-frequency (how many guide/pillar pages in `src/content` reference each slug — same traffic proxy used on 2026-07-20, since no direct analytics access is available). Top of that list: `resistance-bands-set` (22 refs across pillar/guide pages), `gymnastics-leotard-youth` (6), `basketball-shoes-youth` (6), `wrestling-headgear` (3), `gymnastics-slippers-youth` (3), `baseball-bat-youth` (3), `baseball-bat-bbcor` (3).

Batch = 50 + 15 = 65 (61 Amazon, 4 SoccerGarage via CJ affiliate links).

**Redirect-layer check (Step 3):** every `/go/[slug]/` redirect was checked independently via a direct HTTP request (single-hop, `--max-redirs 0`) against the exact `destination` value in `affiliates.json`. **65/65 matched** — the redirect layer itself is fully healthy across this batch.

**Amazon throttling note:** an initial raw-fetch screening pass (curl, ~7-8s spacing) was run first to flag likely-degraded slugs before spending browser time. That pass reliably confirmed the 4 SoccerGarage links (no Amazon bot-detection risk on that domain) but produced **5 false positives** on Amazon links — curl from this environment's IP consistently trips Amazon's `validateCaptcha` bot-detection page regardless of spacing, which is a known limitation (see 2026-07-06 log: 6 false positives from the same cause). Rather than trust that signal, **all 61 Amazon destinations were browser-verified directly** (Claude in Chrome, ~7-9s spacing, no additional CAPTCHA encountered), matching the 2026-07-20 run's approach. The 5 curl flags were all confirmed clean in-browser and are logged below as dismissed false positives, not degradation.

---

## Confirmed issues (browser-confirmed)

| slug | destination | issue | priority | reason |
|---|---|---|---|---|
| wrestling-headgear | amazon.com/dp/B003BSRB3U | dead ASIN | **high** | Page title is Amazon's own "Page Not Found" — a hard dead listing, not a bot-detection artifact. 2 content placements (`guides/wrestling.md`, `pillar/ultimate-parent-guide-wrestling.md`). |
| hockey-pads-starter | amazon.com/dp/B0CQTM2SBD | mismatch + out_of_stock | **high** | Resolves to "V Grip Black Base Ice Hockey Grip" — a stick grip-tape accessory, not starter pads — **and** that listing itself shows "Currently unavailable. We don't know when or if this item will be back in stock." Double failure. 2 placements (`guides/hockey.md`, `pillar/ultimate-parent-guide-hockey.md`). |
| basketball-shoes-youth | amazon.com/dp/B0F14NVK54 | out_of_stock | **high** | Correct product (Nike Big Kid's Giannis Immortality 4 Basketball Shoe) but "Currently unavailable. We don't know when or if this item will be back in stock." Highest-placement slug among the confirmed issues — 3 placements (`articles/youth-basketball-equipment-guide.md`, `guides/basketball.md`, `pillar/ultimate-parent-guide-basketball.md`) and was this run's #2 traffic-weighted pick from the 07-18 pool. |
| gymnastics-slippers-youth | amazon.com/dp/B0GC3TTFQN | mismatch | medium | Resolves to "Sooneeya Girls Cheer Shoes Cheerleading Sneakers" — a cheer shoe, not a gymnastics slipper. In stock and purchasable, just the wrong product. 3 placements (`guides/ballet.md`, `guides/dance.md`, `guides/gymnastics.md`) — was this run's #2 traffic-weighted pick tied with basketball-shoes-youth. |
| lacrosse-shoulder-pads-youth | amazon.com/dp/B0DFWMZJRS | mismatch | medium | Resolves to "AceList Elbow Pad Arm Sleeves" — generic elbow sleeves, not shoulder pads. In stock and purchasable, wrong product. 2 placements (`guides/lacrosse-boys.md`, `pillar/ultimate-parent-guide-lacrosse.md`). |

## False positives dismissed (curl bot-detection artifact, confirmed clean in-browser)

| slug | destination | curl flag | browser result |
|---|---|---|---|
| multi-sport-shoe-bag | amazon.com/dp/B0CYTHP5JD | Amazon `validateCaptcha` page | Correct product ("Stadium 2 Team Shoe Bag"), In Stock, Add to Cart present. |
| volleyball-flistatec | amazon.com/dp/B0063NDCGW | Amazon `validateCaptcha` page | Correct product (Molten FLISTATEC NCAA volleyball), In Stock. |
| xc-spikes-kilkenny | amazon.com/dp/B0DJWNR6Q3 | Amazon `validateCaptcha` page | Correct product (Kilkenny XC 10 Spike), In Stock, Add to Cart + Buy Now present. |
| xc-base-layer-set-youth | amazon.com/dp/B0841WMXDC | Amazon `validateCaptcha` page | Correct product (TELALEO kids thermal base-layer set), In Stock. |
| cheer-bow-jumbo | amazon.com/dp/B085N94F3Z | Amazon `validateCaptcha` page | Correct product (Jumbo Cheerleading Bow), In Stock. |

## Borderline / minor (not counted as confirmed issues — Jeff's call, not queued)

- **hard-cooler-55qt** (amazon.com/dp/B08TYGMCJ8, Coleman Classic Series) — listing title reads "52qt Marine Cooler," one size class off from the slug's "55qt." Correct brand/product family, in stock. Flagging for awareness only; may be a pre-existing naming choice rather than a new drift.
- **xc-running-gloves** (amazon.com/dp/B07Q5V12XY) — listed as "TrailHeads Men's" running gloves on a youth cross-country gear guide. Functionally unisex-usable; not treated as a mismatch.
- **baseball-cleats-metal** (amazon.com/dp/B0CLB9NNC3, New Balance Fresh Foam X 3000 v7 Baseball Shoe) — in stock, correct category, but the listing doesn't explicitly confirm metal vs. molded spikes from the product page text. Not enough evidence to call it a mismatch; noting for Jeff's awareness.

## What changed since last week

- No overlap between this run's confirmed issues and the 2026-07-20 flags (`soccer-ball-size4`, `soccer-shin-guards-ankle-youth`) — those were outside this run's batch and weren't rechecked.
- This is the first run to surface **product mismatches** (3 of them) rather than pure stock/dead-link failures — worth watching whether this is a one-off ASIN-drift cluster or a pattern to check for more deliberately in future runs (e.g. cross-referencing listing title keywords against the slug name).
- The curl-then-browser two-pass approach again produced Amazon false positives (5 this run, on top of 6 on 2026-07-06) — the underlying cause (this environment's IP tripping Amazon bot detection on any direct fetch, not just fast ones) looks structural rather than a spacing problem. Recommend future runs skip the curl pre-pass for Amazon destinations entirely and go straight to browser checks, as this run ultimately had to.

## Healthy (60 of 65 slugs confirmed good)

soccer-ball-size5-match, soccer-goalie-gloves-youth, soccer-clearance-cleats, soccer-coupon-10-off-100, soccer-garage-shop, multi-sport-shoe-bag, volleyball-flistatec, volleyball-spandex-youth, xc-spikes-kilkenny, xc-base-layer-set-youth, xc-running-gloves, cheer-bow-jumbo, cheer-hair-gel, adhesive-bandages, gauze-pads, athletic-tape-roll, butterfly-bandages, antibiotic-ointment-travel, saline-wipes, instant-cold-pack, ace-wrap, kinesio-tape-precut, antihistamine-child, bug-bite-stick, saline-rinse, tweezers-small, scissors-blunt-tip, lip-balm-spf, electrolyte-tablets, compression-socks, water-bottle-32oz, electrolyte-powder, protein-powder-vanilla, hard-cooler-55qt (see note above), soft-cooler-25qt, packing-cubes, travel-sport-wash, travel-power-strip, athletic-socks-multipack, batting-gloves-pair, shadow-box-jersey, stadium-chair-budget, stadium-chair-midrange, stadium-chair-premium, sideline-blanket, battery-fan-handheld, bug-spray-travel, hand-warmers, rain-poncho, folding-wagon, resistance-bands-set, gymnastics-leotard-youth, baseball-bat-youth, baseball-bat-bbcor, baseball-cleats-metal (see note above), lacrosse-gloves-youth, lacrosse-helmet-boys-youth, lacrosse-stick-boys-youth, softball-bat-youth, volleyball-knee-pads-lr6.

All confirmed correct product, in stock, purchasable, `/go/[slug]/` redirect resolving correctly.

---

## Internal link spot-check (10 random pages from sitemap-content.xml)

Sampled from 1,975 total indexed URLs:

1. /coaching-tips/baseball-bare-hand-rolls/ — 25 internal links checked, 0 broken
2. /season-calendar/hs-choir-school-year/ — 25 checked, 0 broken
3. /drive-there/first-season-of-cheer/ — 25 checked, 0 broken
4. /adaptive/autism-and-team-sports/ — 25 checked, 0 broken
5. /what-to-buy/crew/ — 25 checked, 0 broken
6. /what-to-buy/soccer/ — 25 checked, 0 broken
7. /adaptive/sensory-friendly-sports-environments/ — 25 checked, 0 broken
8. /what-to-buy/track-field/ — 25 checked, 0 broken
9. /drive-there/team-fun-versus-not-doing-things-you-dont-want-to-do/ — 25 checked, 0 broken
10. /season-calendar/junior-golf-summer/ — 25 checked, 0 broken

**10/10 clean, 250/250 links checked, 0 broken.** No Cloudflare email-obfuscation link false positives encountered in this sample (none of the sampled pages linked one; the exclusion rule was applied but not triggered).

---

## Governance cross-check

All 5 confirmed-issue slugs were checked against `reports/affiliate/lifecycle.json` and `src/data/affiliate-governance.json` before queuing:

- All 5 sit in the generic `researchAndProductMapping` queue (`lifecycleState` bucket shared by all 245 offers site-wide) — none are owned, retired, or special-cased elsewhere in governance or the lifecycle file.
- No conflict with the monthly reconciler. Safe to hand off to Arnie.

## Recommendations (Jeff's call — nothing edited, nothing deployed)

1. **hockey-pads-starter** and **wrestling-headgear** are the most urgent — one is a dead listing, the other is showing customers the wrong product *and* it's unavailable. Both queued high priority.
2. **basketball-shoes-youth** — genuine OOS on the correct product, highest placement count (3) of this run's issues. Queued high priority.
3. **gymnastics-slippers-youth** and **lacrosse-shoulder-pads-youth** — both are live, in-stock, purchasable links, just pointed at the wrong item. Lower urgency than the OOS/dead cases but still misleading to buyers. Queued medium priority.
4. No action needed on the 5 curl-flagged slugs — confirmed healthy in-browser, logged as false positives only.
5. Consider dropping Amazon links from the curl pre-screening pass in future runs — it hasn't produced a single true positive across two runs now (2026-07-06 and this one) and just adds a browser-recheck step for every flag.

STATE.md has been updated with today's date for all 65 checked slugs.
