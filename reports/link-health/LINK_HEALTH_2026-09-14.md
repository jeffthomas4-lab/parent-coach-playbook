# Link Health Report — 2026-09-14

**68 checked, 8 confirmed issues, 0 false positives dismissed, 0 unconfirmed. Queue: 8 open.**

Batch: remaining 53 slugs oldest-dated 2026-08-03, plus a 15-slug traffic-weighted pull from the 2026-08-10 pool (ranked by `placementCount` in `reports/affiliate/lifecycle.json`, per the 09-07 report's guidance). All checks were done live in a real browser (Claude Browser) via the production `/go/[slug]/` redirect — no curl/raw-fetch pre-screen was used this run, so there is nothing to dismiss as a bot-detection false positive; every flag below is a direct, confirmed observation.

## Confirmed broken / degraded links

| Slug | Current destination shows | Issue | Priority |
|---|---|---|---|
| `hockey-skates-youth` | "Currently unavailable. We don't know when or if this item will be back in stock." | Dead ASIN (Bauer X Ice Hockey Skates Junior) | High |
| `football-neck-roll` | Resolves to "Sports Unlimited Adult/Kids Hood, Football Shiesty Mask, Ski Mask" | Off-brand mismatch — a neck roll listing now points to an unrelated ski mask/balaclava product | High |
| `volleyball-backpack` | Resolves to "Mizuno Unisex Organizer 26 Baseball/Softball Backpack" | Mismatch — wrong sport entirely; in stock, but not a volleyball bag | High |
| `portable-pa-speaker` | "Buy Used: $544.00," 10–11 day shipping, "Sold by US Seller/We ship from USA" — no new-condition offer | Degraded buy box — new offer gone; only a third-party used unit remains, priced far above a normal PA speaker | High |
| `baseball-batting-gloves-youth` | Lands on the "Adult Large" size variant, marked "Currently unavailable" | Out-of-stock on the specific variant the link resolves to, even though Youth Small/Medium/Large exist on the same listing | Medium |
| `foam-roller-standard` | "Buy Used: $22.69," "Only 1 left in stock," no new-condition offer | Degraded buy box — new offer gone, one used unit remaining | Medium |
| `folding-table-6ft` | "High price" flag, "See All Buying Options" only, no direct Buy Now at a normal price | Degraded buy box | Medium |
| `wrestling-rashguard` | Resolves to "DEVOROPA Youth Boys Compression Thermal Shirt... Fleece Baselayer Soccer Baseball Undershirt" | Mismatch — a generic soccer/baseball fleece baselayer, not a wrestling rashguard | Medium |

All eight are in `replacement-queue.json` for Arnie with `status: "open"`.

## Resolved since last check

- `soccer-ball-size3` (flagged 2026-08-10 as "no new-condition offer") is now a normal Amazon.com Buy Now listing, new condition, 1 left in stock. Confirmed resolved.
- `soccer-ball-size4` (part of this run's traffic-weighted pull) re-checked clean — still in stock, correct product.

## Noted but NOT added to the queue (low-confidence, not clearly degradation)

- `football-rubber-youth` resolves to "Wilson NCAA Composite Football - Official Size" — the slug implies a youth-sized rubber ball, and the live product is an official-size composite ball. This could be a pre-existing intentional mapping (Wilson sells this as an all-ages ball) rather than new drift, and the product is in stock. Flagging for Jeff's eyes, not the sourcer's queue, since acting on it without knowing original intent risks swapping in a worse link.
- `soccer-cones-12pk` resolves to a 25-pack of disc cones (same ASIN as `agility-cones`), not a 12-pack. Same caveat — in stock, plausibly a pre-existing naming/count mismatch rather than something that changed this week.

## Intentional Amazon search-redirect slugs (verified working, not degradation)

`coach-backpack`, `wrestling-bag`, `pickleball-bag`, `pickleball-shoes`, `rugby-cleats`, `rugby-scrum-cap`, `rugby-shoulder-pads` are designed to point at Amazon search results rather than a single ASIN. All seven returned live, populated search results pages — working as designed.

## Internal link spot-check (Step 5)

10 pages sampled from `sitemap-content.xml`: `/`, `/what-to-buy/football/`, `/what-to-buy/baseball/`, `/what-to-buy/hockey/`, `/coaching-tips/`, `/reads/`, `/camps/`, `/resources/`, `/season-calendar/`, `/about/corrections/`, `/parent-coach-approved/`. All 10 loaded with correct titles and content — no 404s, no broken internal links found in this sample.

## What changed since last week (2026-09-07)

- This run's pool (53 remaining 08-03 slugs + 15 traffic-weighted 08-10 slugs) does not overlap with the 09-07 report's pool, so this is a fresh read on a different set of slugs, not a re-check of last week's 4 open items (`batting-gloves-pair`, `cheer-hair-gel`, `bug-spray-travel`, `ballet-tights-youth`) — those remain open in the queue history until they come back into rotation or Arnie/Jeff clears them.
- Two brand-new mismatches this run (`football-neck-roll`, `volleyball-backpack`) are notable because they're clean wrong-product swaps rather than stock/pricing drift — worth a quick manual look at how these ASINs got reassigned, since it suggests something upstream (a bulk edit, a copy-paste error in `affiliates.json`, or an Amazon-side ASIN reuse) rather than organic marketplace churn.
- `hockey-skates-youth` going fully dead is the highest-revenue-risk item this run if hockey gear guide traffic is meaningful — it sits on `/what-to-buy/hockey/`, which was spot-checked clean for internal links but obviously still serves the dead affiliate link.

## Open process notes carried forward

- `worker-link-checker` deployment status is still unconfirmed as of this run (no Cloudflare/wrangler access available). Continuing to treat hard 404s as in-scope per standing instruction until Jeff confirms the daily worker is live and the `link_health` D1 table is populating.
- Recommend checking with Jeff/Arnie on whether the 4 open items from the 2026-09-07 queue, and the 08-17 batch's proposals, have been reviewed and pushed to `affiliates.json` — the carry-over pattern in STATE.md's run log suggests the queue may not be getting worked as fast as it fills.
