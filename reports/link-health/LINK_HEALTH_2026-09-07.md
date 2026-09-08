# Link Health Report — 2026-09-07

**Summary: 65 slugs checked · 4 confirmed issues (all Amazon out-of-stock/no-featured-offer) · 2 false positives dismissed (Bookshop.org bot-detection via curl pre-screen) · 0 unconfirmed · 10/10 sampled pages clean (121 unique internal links; 120 resolved clean, 1 curl-methodology artifact dismissed after browser confirmation).**

## Scope note

The daily-cron link-checker Worker (`worker-link-checker/`) is still not deployed as a live production service — its `README.md` is unchanged from prior runs and still states "Status: paused / not deployable" with the same five unmet prerequisites (placeholder-era D1 wiring never finished, no `schema.sql` applied against a verified target, no `ADMIN_API_KEY` secret, no staging smoke test, no cron approval). `wrangler.toml` still points its cron trigger at the `activity-radar` D1 database (binding `DB`, id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`), same as the last correction noted 2026-07-20.

This run had no Cloudflare account or `wrangler` CLI access available in its environment, so — unlike the 2026-08-17 run — the `link_health` D1 table's row count and `last_checked` freshness could not be independently re-checked this cycle. Carrying forward the last confirmed state from 2026-08-17: 681 rows, `last_checked` topping out at 2026-07-22 (stale, no ongoing population). Jeff: if you want a current read on that table, someone with Cloudflare dashboard/API access will need to pull it — this run couldn't reach it.

## Batch selection

Per the pre-selected batch handed off for this run (rotation rule: remaining slugs still dated 2026-07-27, plus the 15 highest-traffic slugs pulled forward from the 2026-08-03 pool by `placementCount` in `reports/affiliate/lifecycle.json`):

- 50 slugs dated 2026-07-27 (all of that pool — fully cleared by this run)
- 15 slugs pulled forward for traffic weighting (mix of 2026-08-03- and 2026-08-10-dated entries at selection time)

Batch = 65 total: 60 Amazon, 3 SoccerGarage (via `tkqlhce.com` CJ affiliate links), 2 Bookshop.org.

8 of the 60 Amazon destinations (`swim-cap-silicone-youth`, `swimsuit-training-youth`, `wrestling-shoes-youth`, `wrestling-singlet-youth`, `athletic-shorts-black-youth`, `music-folder-performance`, `music-stand-foldable`, `gymnastics-grips-youth`) are `amazon.com/s?k=...` search-result pages by design — not yet mapped to a specific product (tracked separately in lifecycle.json's `researchAndProductMapping` queue). All 8 returned live, populated search results this run; none were flagged.

## Methodology (Steps 3–4)

1. **Redirect layer check**: HEAD-only requests (no `-L` follow) to all 65 `https://parentcoachdesk.com/go/[slug]/` URLs, comparing the `Location` header against the batch's expected destination. All 65 matched byte-for-byte. The redirect layer is fully healthy this run — no separate redirect-layer issue to report.
2. **Raw-fetch pre-screen**: curl pass against all 65 destinations (non-Amazon unthrottled; the 60 Amazon destinations spaced 8 seconds apart, split across 4 batches). An initial naive text-match pass over-flagged nearly all 60 Amazon pages on a false "currently unavailable" signal (boilerplate text present elsewhere on Amazon's large product pages, e.g. sponsored-widget copy — not the actual buy-box state). Refined the check to read the specific `id="availability"` span and buy-box button markers (`add-to-cart-button`, `buy-now-button`, `outOfStock`), which cut this down to 4 genuine candidates. No Amazon bot-detection/CAPTCHA pages were hit during the pre-screen pass.
3. **Browser verification (two-tier)**: all 4 flagged Amazon candidates, plus both Bookshop.org destinations (which returned curl-level 403s), were checked live in Claude in Chrome, Amazon requests spaced ~9 seconds apart. Every reported issue below is browser-confirmed; nothing was reported from raw-fetch alone.

## Confirmed issues (browser-confirmed)

### Amazon — no featured offer / out-of-stock (4)

| slug | ASIN | placements | note |
|---|---|---|---|
| batting-gloves-pair | B07GJZ1D4G (via amzn.to/4ugLk14) | 1 | "Currently unavailable. We don't know when or if this item will be back in stock." for the Adult Large / Black-Black variant. Hardest-down of this run's finds. |
| cheer-hair-gel | B005AKKSE8 | 1 | Both size variants (Pack of 2, Pack of 3) show "See 2 options with no featured offers" — no Add to Cart / Buy Now, only "See All Buying Options." |
| bug-spray-travel | B0009EXM3E | 1 | "See All Buying Options" with a "High price" flag — no featured offer for the 12-wipe travel pack. |
| ballet-tights-youth | B00KM2MT28 | 2 | "See All Buying Options" with a "High price" flag — no featured offer for Ballet Pink / One Size. Highest-placement issue this run (2). |

No hard 404s found this run. No product mismatches (wrong item entirely) found. No merchant-domain changes found. No SoccerGarage or search-by-design degradations found.

## False positives dismissed (2)

| slug | signal | resolution |
|---|---|---|
| book-mindset | curl returned HTTP 403 on `bookshop.org/a/125074/9780345472328` | Browser-confirmed live: full product page, Paperback $18.64, ADD TO CART present. Bookshop.org bot-detection against the raw curl request, not a real issue. |
| book-range | curl returned HTTP 403 on `bookshop.org/a/125074/9780735214507` | Browser-confirmed live: full product page, Paperback $18.64, ADD TO CART present. Same bot-detection pattern as above. |

## Unconfirmed flags

None. Chrome was connected and every candidate this run reached a live browser verification — nothing fell back to unconfirmed status.

## What changed since last week

- None of the 7 items on the 2026-08-17 confirmed-issues list (worked by Arnie into `replacement-queue.json` on 2026-08-27: `tennis-racquet-junior`, `foam-roller-medium`, `hockey-helmet-youth`, `football-cup-shorts-youth`, `soccer-shin-guards-ankle-youth`, `multi-sport-socks-crew`, `soccer-goalie-gloves-youth`) were in this run's slug pool, so there's no fresh read on their status. Per the prior queue, 5 of those 7 already have `status: proposed` replacements from Arnie's 2026-08-27 pass (tennis-racquet-junior, foam-roller-medium, football-cup-shorts-youth, soccer-shin-guards-ankle-youth, multi-sport-socks-crew — the last one, `multi-sport-socks-crew`, is actually confirmed self-resolved: same ASIN back in stock), 1 is `retire-recommended` (hockey-helmet-youth — no adequately-reviewed true-youth candidate found), and 1 (`soccer-goalie-gloves-youth`) is still `open`, blocked on a soccergarage.com timeout and on CJ dashboard access to mint a new tracking link. Those items are Arnie's to keep working — not re-checked here since they're outside this run's batch.
- All 4 issues confirmed this run (`batting-gloves-pair`, `cheer-hair-gel`, `bug-spray-travel`, `ballet-tights-youth`) are newly discovered — none were flagged in any prior report.
- This run's replacement-queue.json is a **fresh snapshot of only this run's 4 findings** — it does not carry over the 7 items above; those live in Arnie's in-progress queue history and were overwritten per this run's write-only-fresh-findings instruction. Jeff/Arnie: if the 7 prior items still need tracking, make sure they're captured somewhere before this overwrite's queue file supersedes the record Arnie was working from.

## Internal link spot-check (Step 5)

10 random live pages sampled from `sitemap-content.xml`: `rules/crew`, `game/making-it-fun-for-everyone-when-your-own-kid-is-struggling`, `recruiting/recruiting-film-what-coaches-actually-watch`, `drive-there/high-school-volleyball-what-to-expect`, `drive-there/when-the-team-says-wear-all-black`, `team-parent/how-to-talk-to-the-coach`, `season-calendar/little-league-rec-baseball-spring`, `coaching-tips/softball-stance-and-load`, `coaching-tips/flag-football-grip-and-throw`, `recruiting/when-to-start-the-recruiting-process`.

All 10 pages fetched clean (200). 121 unique internal links extracted (deduped, `cdn-cgi/l/email-protection` links excluded as expected-404 by design). 120 of 121 resolved 200/3xx cleanly.

The 1 exception: `/go/softball-glove-11in/` returned curl HTTP 400 when following its full redirect chain. Root cause: the `/go/` redirect itself is healthy (302 to `amzn.to/4f1x87E`), but that short link's target Amazon URL contains a literal, un-encoded `"` character embedded in its `keywords=` query parameter (`keywords=softball%2Bglove%2B10"&qid=...`) — curl passes that raw character through and Amazon's CloudFront rejects the malformed request with a 400. Browser-verified this is **not** a real-world broken link: a real browser automatically percent-encodes the stray quote and lands cleanly on an in-stock Rawlings youth softball glove product page ($34.77, In Stock, Add to Cart present). Dismissed as a curl-methodology artifact, not a genuine break. `softball-glove-11in` is not part of this run's 65-slug batch (last checked 2026-08-10 per `STATE.md`) so it wasn't added to `replacement-queue.json`, but it's worth a note for whoever next checks that slug — the underlying affiliate link itself has a malformed character in it that's currently harmless (browsers handle it) but worth cleaning up since it could break under stricter link-checking tools or some in-app browsers.

## Handoff

Recommendations only — nothing in `src/data/affiliates.json` was edited, nothing deployed, nothing committed or pushed. The 4 browser-confirmed issues above are written to `reports/link-health/replacement-queue.json` (fresh snapshot, this run only) for the replacement-sourcer (Arnie) to work. All 4 are low-traffic (1–2 placements each) — `ballet-tights-youth` is flagged `medium` priority (2 placements), the other 3 are `low` (1 placement each, per the priority guidance that traffic/severity — not just presence of an issue — drives priority).

`STATE.md` has been updated with today's check dates for all 65 slugs in this batch and a refreshed "Next run" pointer. The 2026-07-27 pool is now fully cleared; next run should pick the remaining slugs from the 2026-08-03 pool (53 remaining after this run) plus a traffic-weighted top-15 pull from the 2026-08-10 pool.

**Open item carried forward:** as noted above, this run could not verify current Cloudflare Worker/D1 state (no account access in this environment) — someone with dashboard or `wrangler` CLI access should confirm whether `link_health` has had any new writes since 2026-07-22, since that would materially change whether hard 404s should keep being treated as fully in-scope for this manual process going forward.
