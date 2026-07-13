# Link Health Report — 2026-07-13

**Summary: 65 affiliate links checked, 2 confirmed issues (1 unavailable, 1 temporarily out of stock), 0 false-positive flags dismissed. 780 internal links across 10 pages checked, 0 broken.**

## Scope

- Affiliate redirects: 65 of 245 total slugs — the batch with the oldest / never-checked `last_checked` dates in the slug-based rotation (see `STATE.md`). This is the second monthly-rotation batch; the first 65 (checked 2026-07-08) were the baseball/soccer/football gear cluster. This run covers the volleyball, cross-country, cheer, first-aid, nutrition, travel, and sideline-gear clusters.
- Retailer breakdown of this batch: 61 Amazon, 4 SoccerGarage (Commission Junction / tkqlhce.com deep links).
- Internal links: 10 randomly sampled live pages (drawn from the 1,970 URLs in `sitemap-content.xml`), 780 unique internal absolute-path links checked.

## Method note

Every affiliate destination this run was checked in a **real logged-in Chrome session** (Claude in Chrome), following each `/go/[slug]/` meta-refresh through to the final Amazon/merchant page and reading the live buy-box availability. Because a real browser was used for the first pass (not plain HTTP requests), **Amazon's bot-detection interstitial was never triggered** — so unlike the 2026-07-06/07-08 runs, there were no "currently unavailable" false positives to dismiss this week. A handful of `find` calls returned early while the meta-refresh was still resolving; each was re-checked and confirmed in stock (timing artifacts, not availability flags).

Redirect-layer integrity was additionally verified structurally: all 65 `/go/[slug]/` pages in the current build (`dist/go/`) exist and their `<meta http-equiv="refresh">` targets exactly match the `destination` values in `src/data/affiliates.json` (Amazon and CJ links are correctly left un-UTM'd per the Associates/CJ rules in `src/pages/go/[slug].astro`).

## Affiliate redirect checks

**63 of 65 destinations resolved cleanly to the correct, in-stock product or merchant page.** The 4 SoccerGarage CJ links all resolved live to their intended pages (goalkeeping category, clearance category, `garage10`/$100-min coupon landing, and store home) with a valid `cjevent` tracking param attached.

### Confirmed issues (browser-verified)

| Slug | ASIN | Product | Status | Recommendation |
|---|---|---|---|---|
| `foam-roller-medium` | B071P2MQ5D | Amazon Basics High Density Foam Roller, 24" | **Currently unavailable** — buy box reads "Currently unavailable. We don't know when or if this item will be back in stock." No new/used offers. Likely delisted. | **Swap.** Verified in-stock replacement: **TriggerPoint GRID 1.0 Foam Roller** — ASIN `B0040EGNIU` (`https://www.amazon.com/dp/B0040EGNIU?tag=parentcoachpl-20`). Note it's a 13" roller vs. the old 24"; if full-length matters, a 24" high-density alternative can be subbed instead. |
| `stadium-chair-premium` | B084BPQR1S | GCI Outdoor Kickback Rocker | **Temporarily out of stock** — main new buy box (all color variants) reads "Temporarily out of stock… we'll email you when we have an estimate." Listing is alive and shows "New & Used (8) from $58.80" plus an add-to-cart for a Used–Very Good offer, so it is expected to restock. | **Monitor, don't swap yet.** "Temporarily" + live third-party offers means this is likely to recover. Re-check next run; only swap if still OOS. |

### Low stock (not issues — still purchasable)

- `volleyball-shoes-upcourt` (ASICS Upcourt 6, B0CNKVRYM7) — "Only 1 left in stock" on the default size variant. Other sizes available. No action.
- `xc-running-gloves` (TrailHeads Running Gloves, B07Q5V12XY) — "Only 5 left in stock." No action.

### Minor content nit (not a link-health issue)

- `hard-cooler-55qt` resolves to a Coleman Classic **52qt** Marine Cooler (B08TYGMCJ8), in stock. The slug/label says 55qt but the product is 52qt — a naming mismatch worth correcting in copy at some point, but the link works and the product is valid.

## Internal link spot-check

Sampled pages (all returned 200; two spot-verified live in-browser, headings correct):
- `/drive-home/the-case-for-one-sport-per-season/`
- `/drive-there/tennis-recruiting-guide-parents/`
- `/adaptive/adhd-medication-and-sports/`
- `/coaching-tips/basketball-block-to-block-finish/`
- `/coaching-tips/lacrosse-face-off-intro-ages-11-12/`
- `/season-calendar/hs-marching-band-fall/`
- `/sports/choir/`
- `/what-to-buy/video-tracking-gear/`
- `/coaching-tips/soccer-shoelace-touches/`
- `/coaching-tips/golf-tee-up-tempo/`

Across these 10 pages, **780 unique internal absolute-path links were checked against the build; 0 were broken.** No Cloudflare email-obfuscation (`/cdn-cgi/l/email-protection#…`) links appeared in this sample, so none to disregard this run.

**No broken internal links found.**

## Suggested affiliates.json changes (for Jeff to review — not applied)

1. `foam-roller-medium`: replace destination `https://www.amazon.com/dp/B071P2MQ5D?tag=parentcoachpl-20` → `https://www.amazon.com/dp/B0040EGNIU?tag=parentcoachpl-20` (TriggerPoint GRID 1.0, verified in stock). Optionally pick a 24" roller if length parity matters.
2. `stadium-chair-premium`: leave as-is for now; re-check next run. Swap only if still out of stock.

No edits were made to `affiliates.json` and nothing was deployed — Jeff reviews and pushes.

## Rotation status

Second batch of the slug-based rotation. 65 slugs checked this run; their `last_checked` dates updated to 2026-07-13 in `STATE.md`. That leaves ~115 slugs still never-checked, plus the 65 from 2026-07-08. Next run should pick the ~65 oldest again (the remaining never-checked slugs first). Full list cycles roughly every 4 weeks.

## Reminder: optional worker enhancement (not done here)

The standing idea to extend `scripts/build-link-manifest.mjs` to pull destinations from `affiliates.json` — which would let the daily Cloudflare worker cover affiliate links and eventually retire this weekly task — remains open. It's a real code change requiring review and was intentionally not implemented as part of this scheduled run.
