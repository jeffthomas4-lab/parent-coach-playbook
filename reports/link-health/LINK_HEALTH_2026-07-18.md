# Link Health Report — 2026-07-18

**Summary: 65 slugs checked · 23 confirmed issues (14 dead ASINs, 3 out-of-stock, 5 product mismatches, 1 non-Amazon 404) · 0 false-positive flags dismissed · 0 unconfirmed · 10/10 sampled pages clean.**

All 65 slugs this run were **never-checked backlog** slugs (the oldest-priority bucket). Every affiliate destination was verified directly in a live browser session (Claude in Chrome), so every issue below is browser-confirmed — there was no raw-fetch tier to reconcile and **no CAPTCHA/bot-block page was encountered at any point** (healthy products interleaved with dead ones throughout, confirming these are genuine, not throttling artifacts).

> **Headline for Jeff:** ~35% of the never-checked backlog is bad. This strongly suggests these slugs were bulk-added with unverified/placeholder ASINs and never validated. The daily worker only catches hard 404s, so the out-of-stock and (especially) the *product-mismatch* cases — where a live, in-stock ASIN silently points at the wrong product — would never have surfaced without this content check. Recommend prioritizing a replacement-sourcing pass over the full never-checked backlog (50 slugs still unchecked after this run).

---

## Confirmed issues (browser-confirmed)

### A. Dead ASINs — Amazon "Page Not Found" (14)

These return Amazon's not-found page. Worker may also catch some as 4xx; listed here for completeness.

| slug | dead ASIN | suggested interim fix (search-URL fallback, matching existing site pattern) |
|---|---|---|
| coach-clipboard-dry-erase | B003L23NJ4 | `s?k=coaching+clipboard+dry+erase` |
| coach-stopwatch | B00Y1XJYJY | `s?k=coach+stopwatch` |
| scrimmage-pennies | B004MJ0Y2Y | `s?k=scrimmage+pinnies+youth` |
| portable-whiteboard | B07QYJB3GS | `s?k=portable+dry+erase+whiteboard` |
| first-aid-fanny-pack | B09Q3P2ZJN | `s?k=first+aid+fanny+pack` |
| ball-pump-with-gauge | B07YRJPQVB | `s?k=ball+pump+with+pressure+gauge` |
| wrestling-headgear | B003BSRB3U | `s?k=youth+wrestling+headgear` |
| wrestling-knee-pad | B001LJ4IQO | `s?k=wrestling+knee+pad` |
| pickleball-paddle-youth | B0CLSHQW2F | `s?k=youth+pickleball+paddle` |
| pickleball-balls-outdoor | B09BZZDC3D | `s?k=outdoor+pickleball+balls` |
| speed-ladder-agility | B00BXJXO8I | `s?k=agility+speed+ladder` |
| agility-cones-set | B01BKIQJAY | `s?k=agility+cones+set` |
| jump-rope-speed | B07BFKRX3Y | `s?k=speed+jump+rope` |
| rebounder-net-baseball | B08B4HLQDH | `s?k=baseball+rebounder+net` |

### B. Out-of-stock — live product, "Currently unavailable" (3)

May recover on their own. Recommend monitor; swap only if still OOS next cycle.

| slug | ASIN | product | note |
|---|---|---|---|
| foam-roller-standard | B00XM2MRGI | Amazon Basics High-Density Foam Roller 36" | "Currently unavailable." (sibling slug `foam-roller-medium` was also flagged OOS on 2026-07-13) |
| cash-box-lockable | B07R7D49LX | Stalwart Locking Petty Cash Box | "Currently unavailable." |
| basketball-shoes-youth | B0F14NVK54 | Nike Giannis Immortality 4 (Big Kid) | OOS on the pinned size variant (6.5Y). Suggest linking the parent/unpinned listing or `s?k=youth+basketball+shoes`. |

### C. Product mismatches — live & in-stock, but the ASIN serves the WRONG product (5)

**Most important category** — these look healthy to the worker (200 + in stock) but send readers to an unrelated item. Several are also off-brand for a youth-sports parent audience.

| slug | ASIN | what it actually resolves to | suggested fix |
|---|---|---|---|
| football-neck-roll | B0C62ZYRF3 | "Football Shiesty Mask / ski mask" balaclava (off-brand) | `s?k=football+neck+roll+youth` or source a real neck roll/collar |
| hockey-pads-starter | B0CQTM2SBD | V-Grip hockey **stick grip tape** (not pads) | `s?k=youth+hockey+protective+gear+set` |
| softball-pitching-jacket | B08HSJ6DNL | EvoShield compression **arm sleeve** (not a jacket) | `s?k=fastpitch+softball+pitching+jacket` |
| lacrosse-shoulder-pads-youth | B0DFWMZJRS | AceList **elbow pad arm sleeves** (not shoulder pads) | `s?k=youth+lacrosse+shoulder+pads` |
| lacrosse-stick-girls-youth | B07ZDJB1TY | Sportybella lacrosse-themed **hair scrunchie** (~$8, not a stick) | `s?k=girls+youth+lacrosse+stick` |

### D. Non-Amazon (1)

| slug | old destination | status | suggested replacement |
|---|---|---|---|
| square-card-reader | squareup.com/us/en/hardware/**readers** | 404 ("This page is out of stock") | **`https://squareup.com/us/en/hardware`** — verified live, lists all current Square readers |

---

## Borderline / minor (not counted as confirmed issues — Jeff's call)

- **wrestling-rashguard** (B081Z2L6SW) — In stock, but resolves to a generic DEVOROPA youth compression *thermal fleece baselayer* marketed for soccer/baseball, not a true wrestling rashguard. Acceptable-ish; swap if you want an exact match.
- **gymnastics-slippers-youth** (B0GC3TTFQN) — In stock; resolves to Sooneeya cheer/gymnastics *sneakers*, not soft gymnastics slippers. Product is marketed for gymnastics, so probably fine.

---

## Healthy (39 slugs confirmed good)

Non-Amazon healthy: `photo-book-service` (Shutterfly category page, live), `book-changing-the-game` (Bookshop.org, "Available", affiliate ID 125074 intact).

Amazon search-URL slugs — all returned live product results (32–62 results each), working as designed, **not** degradations: `coach-backpack`, `wrestling-shoes-youth`, `wrestling-singlet-youth`, `wrestling-bag`, `pickleball-bag`, `pickleball-shoes`, `rugby-cleats`, `rugby-scrum-cap`, `rugby-shoulder-pads`.

Amazon product pages confirmed In Stock with correct product: `gear-bag-small`, `pop-up-tent-sunscreen`, `seat-cushion`, `frame-8x10`, `rugby-mouthguard`, `hockey-mouthguard` (same ASIN B00I1BDKPC), `resistance-bands-set`, `folding-table-6ft`, `portable-pa-speaker`, `label-maker-handheld`, `volleyball-ball-youth-light`, `volleyball-shoes-gel-rocket`, `volleyball-knee-pads-lr6`, `volleyball-backpack`, `baseball-bat-youth`, `baseball-bat-bbcor`, `baseball-cleats-metal`, `hockey-skates-youth`, `softball-bat-youth`, `softball-bat-intermediate`, `softball-bat-hs`, `softball-sliding-shorts`, `golf-starter-set-youth`, `golf-glove-youth`, `gymnastics-leotard-youth`, `martial-arts-gi-youth`, `lacrosse-stick-boys-youth`, `lacrosse-helmet-boys-youth`, `lacrosse-gloves-youth`.

---

## Internal-link spot-check (10 random live pages from sitemap-content.xml)

**Result: 0 broken internal links** across ~690 links checked (same-origin fetch). `mailto:`/`tel:` and Cloudflare `/cdn-cgi/l/email-protection` links excluded as expected non-breaks; `/go/` affiliate redirects excluded (covered by the affiliate check above).

Pages sampled: read-a-summer-camp-brochure, why-every-player-needs-a-job, the-first-overnight-camp-at-9, varsity-crew-boat-selection-the-real-odds, baseball-glove-side-only-catch, recruiting/hockey, what-you-actually-need-for-first-year-hockey, volunteer-vs-paid-coach-vetting, baseball-tee-work-ages-5-7, soccer-juggling-ladder.

---

## Notes & handoff

- **Do not auto-apply.** Per task scope, affiliates.json was NOT edited and nothing was deployed. All swaps above are suggestions flagged for Jeff's review.
- The affiliate **governance/lifecycle system** (`affiliate-governance.json`, `reports/affiliate/lifecycle.json`, monthly `pcd-affiliate-reconciler`) may already own or have retired some of these slugs — reconcile before editing.
- The search-URL "interim fix" suggestions mirror the pattern already used by 9 healthy slugs on the site; they're a safe stopgap until specific ASINs are sourced and validated (ideally by a dedicated replacement-sourcing task).
- Rotation: all 65 checked slugs dated 2026-07-18 in STATE.md. **50 never-checked slugs remain** for the next run — recommend continuing to drain the backlog before returning to the dated slugs.
