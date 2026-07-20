# Link Health Report — 2026-07-19

**Summary: 65 slugs checked · 8 confirmed issues (6 Amazon out-of-stock, 2 Bookshop.org catalog-missing) · 0 false-positive flags dismissed · 0 unconfirmed · 10/10 sampled pages clean.**

This run drained the rest of the **never-checked backlog** (50 slugs) plus the **15 oldest dated slugs** (last checked 2026-07-08). Batch = 50 never-checked + 15 oldest = 65. Every flag below was re-verified in a live browser (Claude in Chrome). **No CAPTCHA / bot-block page was encountered at any point** — healthy and unavailable products interleaved throughout, confirming these are genuine, not throttling artifacts. There is therefore **nothing unconfirmed** this run.

> **Headline for Jeff:** The never-checked backlog is now fully drained (245/245 slugs dated). This run's degradation is milder than 2026-07-18 — no dead ASINs and no product mismatches this time, just 6 genuine out-of-stock listings and 2 Bookshop.org books that Bookshop no longer carries under the ISBN we linked. The football helmet is the one that matters most (high-traffic sport, safety-relevant hero product) — flagged high priority.

---

## Confirmed issues (browser-confirmed)

### A. Amazon — "Currently unavailable" / out-of-stock (6)

Correct product, live listing, but no buy option — Amazon shows "Currently unavailable. We don't know when or if this item will be back in stock." Verified in-browser (buy box gone, add-to-cart absent).

| slug | ASIN | product | reason |
|---|---|---|---|
| football-helmet-youth | B08ZKR5PDJ | Riddell Victor Youth Helmet | Currently unavailable (**high priority** — top sport, safety item) |
| lacrosse-arm-pads-youth | B00S1BHHWY | Maverik Lacrosse Charger Arm Pad | Currently unavailable |
| dance-jazz-shoes-youth | B002CQTZAG | Capezio E-Series Jazz Slip-On Shoe | Currently unavailable |
| dance-tap-shoes-youth | B0039NNBWE | Capezio Jr. Tyette Tap Shoe (N625C) | Currently unavailable |
| band-valve-oil | B000RVYN46 | Al Cass Fast Valve, Slide & Key Oil | Currently unavailable (buy box; a list price still renders but no ATC) |
| band-practice-pad | B09S3452MM | AAGUT 12" Drum Practice Pad w/ sticks | Currently unavailable |

### B. Bookshop.org — book no longer in catalog under the linked ISBN (2)

The \`/a/125074/[isbn]\` affiliate link no longer resolves to a book page. Bookshop returns zero results for the ISBN, and the \`/go/[slug]/\` redirect (verified live) drops the reader on the **generic "Parent Coach Desk" Bookshop storefront** instead of the book — an invisible-to-status-check degradation.

| slug | destination (ISBN) | product intent | reason |
|---|---|---|---|
| book-positive-coaching | bookshop.org/a/125074/**9780982131701** | *Positive Coaching* (Jim Thompson) | ISBN not in Bookshop catalog -> /go/ lands on generic storefront |
| book-talent-code | bookshop.org/a/125074/**9780553385335** | *The Talent Code* (Daniel Coyle) | ISBN not in Bookshop catalog -> /go/ lands on generic storefront |

Both likely exist at Bookshop under a different/current ISBN — this is a re-ISBN job for the sourcer, not necessarily a retire.

---

## Borderline / minor (not counted as confirmed issues — Jeff's call)

- **baseball-bat-teeball** (amzn.to/3OE8ob3 -> Rawlings Remix, ASIN B0CSTGP24N) — In stock, correct product family, but the variation now displayed is the **28" / -10 drop** USA bat rather than a true tee-ball (-11/-12) bat. Same listing, in stock; swap the pinned variant if you want an exact tee-ball match. Not queued.

---

## Healthy (57 slugs confirmed good)

**Bookshop.org books, resolve to correct product page, affiliate 125074 + UTM intact (10):** book-whose-game-is-it-anyway, book-beyond-winning, book-mindset, book-grit, book-mind-gym, book-champions-mind, book-range, book-peak, book-inner-game-of-tennis, book-little-book-of-talent.

**Amazon search-URL slugs — return live results (~62 each), working as designed, NOT degradations (21):** script-binder-1inch, theater-monologue-book, music-folder-performance, music-stand-foldable, gymnastics-grips-youth, martial-arts-sparring-gear-youth, swim-cap-silicone-youth, swimsuit-training-youth, tennis-shoes-court-youth, tennis-balls-standard, athletic-shorts-black-youth, foam-roller-triggerpoint-13, foam-roller-basics-24, percussion-massager-renpho-r3, theragun-relief, resistance-bands-loop-fit-simplify, theraband-flat-band-light-medium, ice-pack-arctic-flex-gel, ace-bandage-3inch-set, blackout-curtains-nicetown, white-noise-lectrofan-classic. *(Spot-verified theragun-relief and renpho-r3 = 62 results each, no CAPTCHA; rest are the same pattern.)*

**Amazon direct / amzn.to product pages confirmed In Stock + correct product (26):** ballet-slippers-canvas-youth, ballet-tights-youth, dance-character-shoes-youth, dance-bun-kit, dance-leg-warmers, stage-makeup-kit, band-reeds-clarinet, band-marching-shoes, football-shoulder-pads-youth, baseball-bat-backpack, cheer-poms, baseball-balls-wiffle, baseball-bat-28in, baseball-batting-gloves-adult, agility-cones, agility-training-pole, baseball-arm-sleeve, baseball-balls-teeball, baseball-bases-rubber, baseball-bat-teeball (minor note above), baseball-batting-gloves-youth, baseball-belt-youth, baseball-blitzball-set, baseball-catchers-bag, baseball-catchers-gear-youth, baseball-catchers-mitt-32in.

---

## /go/[slug]/ redirect check

The redirect layer itself is healthy: spot-checked \`/go/football-helmet-youth/\` (-> amazon.com/dp/B08ZKR5PDJ?tag=parentcoachpl-20, correct), \`/go/book-mindset/\` (-> bookshop.org product page, affiliate=125074 + UTM, correct), and the two flagged books \`/go/book-positive-coaching/\` and \`/go/book-talent-code/\` (both correctly pass through to the Bookshop destination — but that destination is the dead-ISBN storefront, which is the issue). Redirect worker is fine; the destinations are the problem.

---

## Internal-link spot-check (10 random pages from sitemap-content.xml)

**Result: 0 broken internal links.** All 10 sampled pages returned HTTP 200; 100 unique same-origin internal links extracted and fetched, all 200. \`/go/\` affiliate redirects and Cloudflare \`/cdn-cgi/l/email-protection\` links excluded as expected non-breaks.

Pages sampled: /, team-parent/band-marching-band-uniform-fitting, team-parent/how-to-coach-your-own-child, drive-there/the-bored-off-season-kid, team-parent/when-kids-dont-listen-at-practice, team-parent/maxpreps-what-it-is, coaching-tips/basketball-two-line-layup-intro-ages-5-7, coaching-tips/soccer-keeper-w-stance, coaching-tips/volleyball-window-shape-overhead, body/youth-martial-arts-safety-briefing. (Sitemap now lists 1,974 URLs.)

---

## What changed since last week

- **2026-07-18** found 23 issues in the never-checked backlog (14 dead ASINs, 3 OOS, 5 mismatches, 1 non-Amazon 404) — a ~35% degradation rate.
- **This run (2026-07-19)** cleared the remaining 50 never-checked slugs + 15 oldest: **8 issues, all out-of-stock or catalog-missing, no dead ASINs and no mismatches.** Lower severity — these are recoverable (OOS may restock; books just need a current ISBN) rather than the bulk-added-bad-ASIN pattern seen on 07-18.
- The **never-checked backlog is now fully exhausted** (245/245 slugs dated). Next runs return to the oldest-dated rotation (2026-07-08 slugs, ~monthly cadence).
- Still no \`link_health\` D1 table / live link-checker worker confirmed, so **hard 404s remained in-scope this run** (none found).

---

## Notes & handoff

- **Report-only.** affiliates.json was NOT edited; nothing deployed. All swaps are suggestions for Jeff's review.
- The **governance/lifecycle system** (\`src/data/affiliate-governance.json\`, \`reports/affiliate/lifecycle.json\`, monthly reconciler) may already own or have retired some of these slugs — reconcile before editing. Both files are present in the repo.
- Machine-readable handoff for the sourcer (Arnie): \`reports/link-health/replacement-queue.json\` — 8 open items (1 high, 7 medium).
- Rotation: all 65 checked slugs dated 2026-07-19 in STATE.md.
