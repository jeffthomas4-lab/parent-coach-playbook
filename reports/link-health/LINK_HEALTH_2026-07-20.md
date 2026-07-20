# Link Health Report — 2026-07-20

**Summary: 65 slugs checked · 2 confirmed issues (1 Amazon out-of-stock, 1 degraded buy path) · 0 false positives dismissed · 0 unconfirmed · 10/10 sampled pages clean.**

## Scope note

The daily-cron link-checker Worker (`worker-link-checker/`) was still **not confirmed deployed** as of this run — no `link_health` table found live and populating. Per standing instructions, this run continued to treat hard 404s as in-scope rather than assuming a Worker covers them. Jeff: once that Worker is confirmed live and dated, future runs can drop back to degradation-only.

## Batch selection

The never-checked backlog has been fully drained since 2026-07-19 (245/245 dated). This run pulled from the oldest-dated pool per `STATE.md`:

- All 50 remaining slugs still dated **2026-07-08** (the oldest in rotation), plus
- The **15 highest-traffic slugs** from the next-oldest pool (2026-07-13, 65 slugs), ranked by a content-link-frequency proxy (how many guide/article pages in `src/content` reference each slug — the closest available signal to page traffic without direct analytics access). Top of that list: `volleyball-volley-lite` (33 refs), `xc-trainers-youth` (21), `multi-sport-water-bottle` (11), `cheer-shoes-youth` (10).

Batch = 50 + 15 = 65, all Amazon destinations. Amazon requests were spaced ~7 seconds apart via live browser navigation throughout — no CAPTCHA/bot-block page was encountered at any point, so there is nothing to write off as throttling noise this run.

Every one of the 65 checks was done via direct Claude-in-Chrome navigation to the live `/go/[slug]/` redirect and a read of the resulting page — meaning the redirect layer and the destination were verified together, in-browser, in a single pass. There was no separate "raw fetch" stage to reconcile against, so there are no unconfirmed flags this run.

---

## Confirmed issues (browser-confirmed)

| slug | destination | issue | priority | reason |
|---|---|---|---|---|
| soccer-ball-size4 | amazon.com/dp/B001L3URAS (WILSON Traditional Soccer Ball, Size 4) | out_of_stock | **high** | Page reads "Currently unavailable. We don't know when or if this item will be back in stock." Correct product, dead buy box. Cross-checked `reports/affiliate/lifecycle.json` — this offer carries **66 placements**, by far the most-used slug in this run's batch, so this is a real revenue-relevant gap, not a minor one. |
| soccer-shin-guards-ankle-youth | amazon.com/dp/B006IXH79A (Vizari Malaga Shin Guards) | redirect_to_search (degraded buy path) | low | No default Add to Cart/Buy Now — Amazon shows only "See All Buying Options" plus a "High price" flag, meaning the primary offer lost the buy box and buyers are pushed to third-party sellers at an elevated price. Not a hard 404/OOS, but the one-click purchase path is broken. Lifecycle file shows only 2 placements for this slug — lower priority. |

## Borderline / minor (not counted as confirmed issues — Jeff's call, not queued)

- **multi-sport-cleats-youth** (amzn.to → Sooneeya cleats, ASIN B0DRC1HJN8) — In stock, but Amazon's own title/category tags it "Baseball & Softball" rather than multi-sport. Same lightweight FG cleat could reasonably serve either use; not treated as a mismatch.
- **tennis-net** (amazon.com/dp/B074RFJHB4) — In stock, but the listing is a general "Badminton/Pickleball Net — also usable for Tennis," not a dedicated tennis net. Functionally fine for the slug's purpose; flagging for awareness only.

## What changed since last week

- **foam-roller-medium** (flagged out-of-stock on 2026-07-13) is now **back in stock** — Amazon Basics 24" foam roller, healthy. No action needed.
- No dead ASINs and no product mismatches this run — mildest run since the backlog drain began. Only one hard OOS and one soft buy-box degradation.

## Healthy (63 of 65 slugs confirmed good)

baseball-glove-youth, baseball-glove-9in-youth, baseball-helmet-youth, baseball-glove-breakin-kit, baseball-glove-laces, baseball-pants-youth, baseball-cup-youth, baseball-sliding-mitt, baseball-trainer, baseball-throwback-net, softball-glove-11in, softball-face-mask, lacrosse-ball, lacrosse-goggles-youth, lacrosse-starter-kit-youth, soccer-cones-12pk, soccer-rebound-net, soccer-cleats-youth, multi-sport-cleats-youth (see note above), basketball-ball-rubber, basketball-ball-forge, basketball-ball-authentic, multi-sport-sunglasses-youth, multi-sport-socks-crew, football-rubber-youth, football-leather-youth, football-leather-college, football-qb-wristbands, football-qb-throwing-net, hockey-helmet-youth, hockey-puck, hockey-stick-youth, swim-goggles-youth, volleyball-net, tennis-racquet-junior, tennis-balls-orange, tennis-net (see note above), multi-sport-mouthguard-youth, football-gloves-receiver-youth, football-cleats-youth, football-girdle-youth, football-cup-shorts-youth, football-mouthguard-sisu, multi-sport-duffle-bag, flag-football-belt-set, soccer-shin-guards-youth, soccer-ball-size3, soccer-ball-size5, volleyball-volley-lite, xc-trainers-youth, multi-sport-water-bottle, cheer-shoes-youth, mouthguard-boil-bite, foam-roller-medium, volleyball-knee-pads-youth, volleyball-shoes-upcourt, multi-sport-athletic-tape, soccer-socks-youth, volleyball-ankle-brace, sunscreen-travel, ankle-brace-reusable, phone-tripod, action-camera.

All confirmed correct product, in stock, Add to Cart / Buy Now present, `/go/[slug]/` redirect resolving correctly.

---

## Internal link spot-check (10 random pages from sitemap-content.xml)

Sampled from 1,937 total indexed URLs:

1. /coaching-tips/tennis-backhand-from-feed/ — 25 internal links checked, 0 broken
2. /coaching-tips/track-even-pace-200m/ — 25 checked, 0 broken
3. /drive-there/13-14-cost-benefit/ — 25 checked, 0 broken
4. /drive-there/drum-major-and-section-leader-the-real-odds/ — 25 checked, 0 broken
5. /coaching-tips/track-long-jump-approach-ages-13-14/ — 25 checked, 0 broken
6. /drive-there/youth-swimming-cost-breakdown/ — 25 checked, 0 broken
7. /drive-there/the-first-travel-tournament/ — 25 checked, 0 broken
8. /drive-there/how-to-net-a-soccer-goal/ — 25 checked, 0 broken
9. /what-to-buy/choir/sizing/ — 25 checked, 0 broken
10. /coaching-tips/baseball-rundown-cover-base/ — 25 checked, 0 broken

**10/10 clean.** No Cloudflare email-obfuscation link false positives encountered in this sample (none of the sampled pages linked one).

---

## Governance cross-check

Both confirmed-issue slugs were checked against `reports/affiliate/lifecycle.json` before queuing:

- `soccer-ball-size4`: `lifecycleState: legacy_offer_unclassified`, `nextAction: research_and_map_product`, 66 placements — not owned/retired elsewhere, safe to queue.
- `soccer-shin-guards-ankle-youth`: same lifecycle state, 2 placements — not owned/retired elsewhere, safe to queue.

Neither appears in `src/data/affiliate-governance.json` as a special-cased account. No conflict with the monthly reconciler.

---

## Recommendations (Jeff's call — nothing edited, nothing deployed)

1. Source a replacement or new ASIN for **soccer-ball-size4** — high placement count makes this the priority item. Queued for Arnie below.
2. Lower priority: **soccer-shin-guards-ankle-youth** — either accept the "See All Buying Options" path or source an alternative ASIN with a healthy buy box. Queued for Arnie below.
3. No action needed on foam-roller-medium — confirmed resolved on its own.

STATE.md has been updated with today's date for all 65 checked slugs.
