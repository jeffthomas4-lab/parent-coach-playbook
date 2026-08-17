# Link Health Report — 2026-08-17

**Summary: 65 slugs checked · 7 confirmed issues (6 Amazon out-of-stock/unbuyable, 1 non-Amazon redirect-to-category mismatch) · 0 false positives dismissed · 0 unconfirmed · 10/10 sampled pages clean (163 unique internal links, all resolving 200).**

## Scope note

The daily-cron link-checker Worker (`worker-link-checker/`) is still not deployed — it does not appear in the Cloudflare account's live Workers list, and its own `README.md` still states "Status: paused / not deployable" with the same five unmet prerequisites noted in prior runs (placeholder-era D1 wiring never finished, no `schema.sql` applied against a verified target, no `ADMIN_API_KEY` secret, no staging smoke test, no cron approval).

One thing *has* changed since the 2026-08-10 note: the `link_health` table in the `activity-radar` D1 database (binding target in `worker-link-checker/wrangler.toml`) now exists — 681 rows — where the 08-10 run found zero tables. But its `last_checked` values top out at **2026-07-22**, nearly a month stale, with nothing newer. That reads as a one-time manual/test population, not an active daily cron. Per the standing instruction, this run continued to treat hard 404s as in-scope. Jeff: worth a quick look at what wrote those 681 rows on 07-21/07-22 if you want to know whether that was a real deploy attempt that stalled, or a one-off test.

## Batch selection

Per `STATE.md`'s "Next run" note, this run pulled:

- All **50 slugs still dated 2026-07-20** (the oldest remaining pool), plus
- The **15 highest-traffic slugs** from the next-oldest pool (2026-07-27, 65 slugs), ranked by `placementCount` from `reports/affiliate/lifecycle.json`. Top of that list: `resistance-bands-set` (22 placements), `gymnastics-leotard-youth` (6), `baseball-bat-youth`/`baseball-bat-bbcor`/`basketball-shoes-youth`/`gymnastics-slippers-youth` (3 each).

Batch = 50 + 15 = 65 (64 Amazon destinations, 1 non-Amazon — SoccerGarage via a `tkqlhce.com` CJ affiliate link).

Every destination was checked directly in a live browser session (Claude in Chrome) via the production `/go/[slug]/` redirect endpoint, which exercises the redirect layer and lands on the real destination in one step — this doubles as the redirect-health check (Step 3) and the two-tier browser verification (Step 4) at once. Amazon-domain requests were paced ~7-8 seconds apart across five separate check batches; no persistent bot-detection/CAPTCHA page was hit during the run, so nothing needed to be written off as a throttling artifact.

## Confirmed issues (browser-confirmed)

### A. Amazon — out-of-stock / unbuyable (6)

| slug | ASIN | placements | note |
|---|---|---|---|
| tennis-racquet-junior | B095RJ5FR8 | 6 | Only "Buy Used" offers remain — no new-condition Buy Box. Highest-traffic issue this run. |
| foam-roller-medium | B071P2MQ5D | 5 | Only "Buy Used" offer, no new Buy Box. **Repeat offender** — flagged OOS 07-13, confirmed resolved/restocked 07-20, broken again today. |
| hockey-helmet-youth | B09KWMQ9TH | 3 | "Currently unavailable," no Add to Cart / Buy Now. |
| football-cup-shorts-youth | B00181B9TQ | 3 | Only "See All Buying Options" shown, no featured new offer. |
| soccer-shin-guards-ankle-youth | B00R2VBASG | 2 | "Currently unavailable," no buy box. **Escalated carry-over** — flagged 07-20 as degraded ("See All Buying Options" only), now fully unbuyable. Broken 4 weeks straight. |
| multi-sport-socks-crew | B086CCM86Z | 2 | "Temporarily out of stock" notice, no working purchase path. |

### B. Non-Amazon — redirect degrades to generic category page (1)

| slug | destination | note |
|---|---|---|
| soccer-goalie-gloves-youth | SoccerGarage via tkqlhce.com (CJ) | Redirects to a generic "Goalkeeping" category listing page, not the specific product. Placements: 2. |

No hard 404s found this run. No product mismatches (wrong item entirely) found. No merchant-domain changes found.

## Unconfirmed flags

None. Chrome was connected and every check in this run completed as a live browser verification — nothing fell back to raw-fetch/unconfirmed status.

## What changed since last week

- **soccer-shin-guards-ankle-youth** (flagged 07-20 as a low-priority degraded buy box) has gotten worse, not better — now fully out of stock. This is its second consecutive appearance in a report with zero remediation in between.
- **foam-roller-medium** is back to broken after resolving itself between the 07-13 and 07-20 runs — third distinct state change across the last five weeks (OOS → resolved → OOS).
- 5 new issues surfaced in this batch: multi-sport-socks-crew, hockey-helmet-youth, tennis-racquet-junior, football-cup-shorts-youth, soccer-goalie-gloves-youth.
- Nothing from the 08-10 report's confirmed-issues list was in this run's pool (different slug pool this cycle), so no read on whether those 10 items got fixed — they're due back up in a future cycle once their pool rotates around.

## Internal link spot-check (Step 5)

10 random live pages sampled from `sitemap-content.xml`: `decisions/how-many-sports`, `coaching-tips/volleyball-self-toss-and-set`, `coaching-tips/lacrosse-boys-stick-position-defense`, `what-to-buy/stunt`, `game/the-tournament-t-shirt-economy`, `sports/track-field`, `coaching-tips/soccer-mirror-the-attacker`, `what-to-buy/martial-arts/sizing`, `coaching-tips/baseball-deep-fly-over-the-shoulder`, `drive-there/college-dance-audition-prep-what-programs-actually-want`.

All 10 pages fetched clean (200). 163 unique internal links extracted across the sample (deduped, `cdn-cgi/l/email-protection` links excluded as expected-404 by design) — all 163 resolved 200. No broken internal links found.

## Handoff

Recommendations only — nothing in `src/data/affiliates.json` was edited, nothing deployed. The 7 browser-confirmed issues above are written to `reports/link-health/replacement-queue.json` for the replacement-sourcer (Arnie) to work. `STATE.md` has been updated with today's check dates for all 65 slugs in this batch and a refreshed "Next run" pointer (remaining 50 slugs dated 2026-07-27, then top-15-by-traffic from the 08-03 pool).
