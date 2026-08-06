# Link Health Report — 2026-08-03

**Summary: 65 slugs checked · 18 confirmed issues (13 dead ASINs, 1 out-of-stock, 3 product mismatches, 1 non-Amazon 404) · 0 false positives dismissed (no curl pre-screen used this run) · 0 unconfirmed · 10/10 sampled pages clean.**

## Scope note

The daily-cron link-checker Worker (`worker-link-checker/`) still could not be confirmed deployed this run — the Cloudflare/D1 MCP tools used in prior runs to check the `link_health` table directly were disconnected/unavailable in this session, so I could not re-verify the table's status myself. Per standing instructions, absent that confirmation I continued to treat hard 404s as in-scope. Jeff: once you can confirm the daily worker is live and the `link_health` table is populating with recent dates, future runs can drop back to degradation-only.

## Batch selection

Per `STATE.md`'s "Next run" note, this run pulled:

- All **50 slugs still dated 2026-07-18** (the oldest remaining pool), plus
- The **15 highest-traffic slugs** from the next-oldest pool (2026-07-19, 65 slugs), ranked by `placementCount` from `reports/affiliate/lifecycle.json` (a precomputed content-placement count — more reliable than a fresh grep across `src/content`, which times out in this environment against the mounted repo). Top of that list: `agility-cones` (96 placements), `baseball-catchers-gear-youth` (30), `baseball-bat-28in` (18).

Batch = 50 + 15 = 65 (48 Amazon product-page destinations, 12 Amazon search-URL destinations, 5 non-Amazon: 2 Bookshop.org in the 07-19 pool, plus book-changing-the-game/photo-book-service/square-card-reader in the 07-18 pool).

**Important context for this run:** the 50-slug 07-18 pool was the same batch that produced 23 confirmed issues when it was originally checked on 2026-07-18. Of those 23, 20 remained assigned to this slug pool (the other 3 — `wrestling-headgear`, `hockey-pads-starter`, `basketball-shoes-youth`/`gymnastics-slippers-youth`/`lacrosse-shoulder-pads-youth` — were already re-flagged and queued in the 2026-07-27 run and are being worked by the replacement-sourcer separately). This run re-verified all 20 of those carry-over suspects directly in-browser, plus browser-checked the other 30 pool_18 slugs and all 15 pool_19 picks for the first time since their last clean check.

Every destination was verified directly in a live browser session (Claude in Chrome), spaced ~7 seconds apart on Amazon domains. No CAPTCHA/bot-detection page was encountered at any point this run, so there is nothing to write off as a throttling artifact — every flag below is a genuine, browser-confirmed finding.

**Redirect-layer check (Step 3):** every `/go/[slug]/` redirect was checked independently via a direct single-hop HTTP request (`--max-redirs 0`) against the exact `destination` value in `affiliates.json`. **65/65 matched byte-for-byte** (accounting for expected UTM params Bookshop/Shutterfly/Square append on top of the base URL) — the redirect layer itself is fully healthy across this batch.

---

## Headline for Jeff

**Of the 20 issues carried over from the 2026-07-18 run into this batch, 18 are still broken today — none were fixed in the intervening 2+ weeks.** The one exception is `foam-roller-standard`, which came back in stock on its own. This isn't a new problem; it's the same 07-18 findings sitting unactioned. Recommend treating the queue below as the priority punch list rather than waiting for another cycle to confirm it again.

## Confirmed issues (browser-confirmed)

### A. Dead ASINs — Amazon "Page Not Found" (13)

All 13 are byte-for-byte the same ASINs flagged dead on 2026-07-18, still dead today.

| slug | dead ASIN | placements | note |
|---|---|---|---|
| coach-clipboard-dry-erase | B003L23NJ4 | 1 | Unchanged since 07-18 |
| coach-stopwatch | B00Y1XJYJY | 1 | Unchanged since 07-18 |
| scrimmage-pennies | B004MJ0Y2Y | 1 | Unchanged since 07-18 |
| portable-whiteboard | B07QYJB3GS | 1 | Unchanged since 07-18 |
| first-aid-fanny-pack | B09Q3P2ZJN | 1 | Unchanged since 07-18 |
| ball-pump-with-gauge | B07YRJPQVB | 1 | Unchanged since 07-18 |
| wrestling-knee-pad | B001LJ4IQO | 2 | Unchanged since 07-18 |
| pickleball-paddle-youth | B0CLSHQW2F | 1 | Unchanged since 07-18 |
| pickleball-balls-outdoor | B09BZZDC3D | 1 | Unchanged since 07-18 |
| speed-ladder-agility | B00BXJXO8I | 1 | Unchanged since 07-18 |
| agility-cones-set | B01BKIQJAY | 1 | Unchanged since 07-18 |
| jump-rope-speed | B07BFKRX3Y | 1 | Unchanged since 07-18 |
| rebounder-net-baseball | B08B4HLQDH | 1 | Unchanged since 07-18 |

### B. Out-of-stock (1)

| slug | ASIN | product | note |
|---|---|---|---|
| cash-box-lockable | B07R7D49LX | Stalwart Locking Petty Cash Box | "Currently unavailable" — unchanged since 07-18 |

### C. Product mismatches — live & in-stock, wrong product (3)

All 3 unchanged since 07-18.

| slug | ASIN | what it actually resolves to | reason |
|---|---|---|---|
| football-neck-roll | B0C62ZYRF3 | "Football Shiesty Mask" ski mask/balaclava | Off-brand, wrong product category |
| softball-pitching-jacket | B08HSJ6DNL | EvoShield compression arm sleeve | Not a jacket |
| lacrosse-stick-girls-youth | B07ZDJB1TY | Sportybella lacrosse-themed hair scrunchie (~$8) | Not a stick |

### D. Non-Amazon (1)

| slug | destination | status | note |
|---|---|---|---|
| square-card-reader | squareup.com/us/en/hardware/readers | ERROR 404 ("This page is out of stock") | Unchanged since 07-18. `https://squareup.com/us/en/hardware` (no `/readers`) is live and lists current Square readers — a one-line fix. |

---

## What changed since last week

- **foam-roller-standard** (flagged OOS on 07-18) is now **back in stock** — Amazon Basics 36" foam roller, 4.6★/31,632 ratings, healthy. No action needed.
- Every other 07-18 finding in this batch (17 of 18 remaining confirmed issues, plus the still-open `square-card-reader` fix) is **exactly where it was two weeks ago**. Nothing appears to have been remediated between 07-18 and today for this slug pool.
- One new borderline signal worth a mention (not queued — see below): **volleyball-backpack** now resolves to a Mizuno backpack explicitly categorized "Baseball/Softball" on Amazon, though customer reviews repeatedly confirm it's bought and used for volleyball (Mizuno is a major volleyball brand, and it's frequently bought alongside Mizuno volleyball kneepads/shorts). Flagging for awareness in case Amazon's categorization drifts further, but not treating as a mismatch this run.

## Borderline / minor (not counted as confirmed issues — Jeff's call, not queued)

- **wrestling-rashguard** (B081Z2L6SW) — same DEVOROPA compression thermal baselayer noted as borderline on 07-18 (marketed for soccer/baseball, not wrestling-specific, but functionally usable). Unchanged, still not treated as a mismatch.
- **volleyball-backpack** (B0FR5BXLQ7) — see "what changed" above. In stock, correct brand, functionally fits the intent per reviews; Amazon's own category tag just says Baseball/Softball.
- **baseball-bat-28in** (B0D6QPSW3X) — In stock, correct Victus Vibe Pencil Bat family; the page defaults to displaying the 30"/20oz variant, but 28"/18oz is selectable and purchasable on the same listing. Not a mismatch.
- **baseball-bat-teeball** (amzn.to/3OE8ob3 → B0CSTGP24N) — same note as 07-19: in stock, correct Rawlings Remix bat family, but the displayed default is the 28"/-10 drop USA bat rather than a true tee-ball -12 drop. Unchanged.
- **baseball-batting-gloves-youth** (amzn.to/4ugLk14 → B07GJZ1D4G) — in stock, correct Franklin Shok-Sorb glove family with youth sizes selectable on the same listing; page defaults to displaying "Adult Large." Not a mismatch.

## Healthy (42 of 65 slugs confirmed good)

book-changing-the-game, coach-backpack, foam-roller-standard (recovered, see above), folding-table-6ft, frame-8x10, gear-bag-small, golf-glove-youth, golf-starter-set-youth, hockey-mouthguard, hockey-skates-youth, label-maker-handheld, martial-arts-gi-youth, photo-book-service, pickleball-bag, pickleball-shoes, pop-up-tent-sunscreen, portable-pa-speaker, rugby-cleats, rugby-mouthguard, rugby-scrum-cap, rugby-shoulder-pads, seat-cushion, softball-bat-hs, softball-bat-intermediate, softball-sliding-shorts, volleyball-ball-youth-light, volleyball-shoes-gel-rocket, wrestling-bag, wrestling-shoes-youth, wrestling-singlet-youth, agility-cones, baseball-catchers-gear-youth, baseball-bases-rubber, book-mindset, book-range, swim-cap-silicone-youth, swimsuit-training-youth, athletic-shorts-black-youth, ballet-slippers-canvas-youth, ballet-tights-youth, baseball-balls-teeball, baseball-catchers-mitt-32in.

All confirmed correct product, in stock (or a working live results page for search-URL slugs), `/go/[slug]/` redirect resolving correctly.

---

## Internal link spot-check (10 random pages from sitemap-content.xml)

Sampled from 2,002 total indexed URLs:

1. /drive-home/the-teammates-parent-who-asks-you-to-talk-to-coach/ — 80 internal links checked, 0 broken
2. /recruiting/scholarship-odds-the-honest-math/ — 73 checked, 0 broken
3. /coaching-tips/baseball-jog-and-stretch-line/
4. /coaching-tips/basketball-block-to-block-finish/
5. /coaching-tips/volleyball-serve-target-zone/
6. /team-parent/how-to-build-leadership-on-youth-team/
7. /drive-there/the-kid-who-refuses-to-go-to-tryouts/
8. /news/nfhs-football-equipment-rules-2026/
9. /what-to-buy/sideline-kit/
10. /pathways/basketball/

(Pages 3–10: 100 unique internal links extracted and checked, 0 broken.)

**10/10 pages clean, all internal links returned 200.** No Cloudflare email-obfuscation link false positives encountered (`/cdn-cgi/l/email-protection` links and `/go/` affiliate redirects excluded from this check as expected/already covered).

---

## Governance cross-check

All 18 confirmed-issue slugs were checked against `reports/affiliate/lifecycle.json` and `src/data/affiliate-governance.json` before queuing:

- All 18 sit in the generic `researchAndProductMapping`-style bucket (`lifecycleState: legacy_offer_unclassified`, `nextAction: research_and_map_product`) shared by most unclassified offers site-wide — none are owned, retired, or special-cased elsewhere in governance or the lifecycle file.
- Placement counts for all 18 are very low (1–2 each) per `lifecycle.json` — this is a low-traffic slug pool, consistent with it being the oldest/least-recently-refreshed rotation bucket.
- No conflict with the monthly reconciler. Safe to hand off to Arnie.

---

## Recommendations (Jeff's call — nothing edited, nothing deployed)

1. **13 dead ASINs have now sat broken for 2+ weeks with zero action.** These are permanent failures (not stock fluctuations) — recommend prioritizing this batch over waiting for the next monthly cycle. Queued high priority.
2. **square-card-reader** is a trivial fix — the correct destination (`squareup.com/us/en/hardware`, dropping `/readers`) was already identified on 07-18 and verified live again this run. This could be applied without any product sourcing at all.
3. **cash-box-lockable**, **football-neck-roll**, **softball-pitching-jacket**, **lacrosse-stick-girls-youth** — all unchanged from 07-18, queued medium priority given low placement counts (1 each).
4. No action needed on **foam-roller-standard** — resolved itself via restock.
5. Consider whether this 07-18 pool needs a faster recheck cadence than monthly, since this run shows fixes aren't landing between cycles — 18 broken links sat live on the site for 2+ weeks after being identified.

STATE.md has been updated with today's date for all 65 checked slugs.
