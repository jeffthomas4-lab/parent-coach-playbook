# GSC Review, parentcoachdesk.com

**Date:** 2026-09-21
**Window:** last 7 days (Sep 13-19) vs prior 7 days (Sep 6-12)
**Prior file:** `reports/seo/gsc-review-2026-09-13.md`
**Mode:** full Class A review. Section 3.4 automatic Aug-Nov idle is gone; `PCD_MAINTENANCE_MODE` unset this run. Kill switch: `nora` = active.

## Takeaways

Last week's camps-directory stall is cleared on the live site. `sitemap-camps.xml` now lists **118** URLs (was 37 discovered in GSC on Sep 13, matching the ~17-camp collapse). `/camps/mn/` returns 200 again. The Sep 14 expired-camp redirect fix is live in production behavior: Gettysburg (PA, empty-state) 301s to `/camps/` and lands 200, not a bare 404. Stillwater (MN) 301s to `/camps/mn/` and that hub is healthy.

Google Search Console has not caught up on the camps sitemap. GSC still shows `sitemap-camps.xml` as Success with **37** discovered and last read **Aug 28** — three-plus weeks stale — while the live file has 118. Main `sitemap.xml` last read Sep 16 (Success, 2,095 discovered). Until Google re-reads camps, indexing of the recovered directory will lag the real inventory.

Indexed count held at **57** for a second straight week (was 90 → 61 → 57). That freezes the three-week slide. Not-indexed ticked up slightly to 3.03K (from 2.98K): Discovered-not-indexed 1,308 (up from 1,261), Crawled-not-indexed 1,511 (up from 1,507). 404 reason count held flat at 121.

Search performance is still noise: **1 click / 2 impressions** this week vs 0 / 1 prior. Homepage took the single click. Two article URLs and one camp URL each showed a single impression. No queries cleared Google's anonymization threshold.

External links still total **7**, all from `parentcoachplaybook.com` (the retiring domain). No new third-party backlinks. Core Web Vitals: not enough CrUX field data on mobile or desktop (last updated Sep 18).

## Recommended actions

**Needs you (light).** In GSC → Sitemaps, open `sitemap-camps.xml` and trigger a re-read / validate if the UI offers it, so discovered climbs off the stale 37 toward the live 118. No code change required — Google just has not fetched the updated file since Aug 28.

Otherwise: keep executing the Organic Search Audit 30/60/90 plan. No new regression that needs a code session this week.

## What moved

| Metric | Last 7 days (Sep 13-19) | Prior 7 days (Sep 6-12) |
| --- | --- | --- |
| Clicks | 1 | 0 |
| Impressions | 2 | 1 |
| Avg CTR | 50% | 0% |
| Avg position | 1.5 | 11 |

(Single-digit impression windows — CTR and position are not meaningful on their own.)

## Pages worth a look

| Page | Clicks (L7 / P7) | Impr (L7 / P7) |
| --- | --- | --- |
| `/` | 1 / 0 | 2 / 0 |
| `/team-parent/dance-studio-shopping-year-one/` | 0 / 0 | 1 / 0 |
| `/drive-home/when-the-cuts-list-goes-up/` | 0 / 0 | 1 / 0 |
| `/camps/nike-soccer-camp-at-pioneer-park-early-childhood-development-july-13-17-2026/` | 0 / 0 | 1 / 0 |
| `/camps/nike-tennis-camp-amherst-at-mount-holyoke-college-all-skills-program-all-skills--mxoa/` | 0 / 0 | 0 / 1 |

Spot-checked both article URLs live: both 200.

## The queries

Nothing clears Google's anonymization threshold in either 7-day window. Query table empty.

## Indexing and sitemap

Indexed: **57**, unchanged week-over-week (second hold after the 90→61→57 slide).
Not indexed: **3.03K** across 8 reasons (was 2.98K).

By reason (vs Sep 13):
- Not found (404): 121 (unchanged)
- Alternate page with proper canonical tag: 36 (was 38)
- Blocked by robots.txt: 31 (unchanged)
- Page with redirect: 8 (unchanged)
- Soft 404: 1 (unchanged)
- Crawled - currently not indexed: 1,511 (was 1,507)
- Discovered - currently not indexed: 1,308 (was 1,261)
- Duplicate, Google chose different canonical: 15 (was 17)

### Spot-checks on GSC 404 examples

| URL | Live behavior |
| --- | --- |
| Gettysburg volleyball (expired PA) | 301 → `/camps/` → 200 (empty-state fallback working) |
| Stillwater soccer (expired MN) | 301 → `/camps/mn/` → 200 (MN hub healthy again) |
| West Monroe basketball (expired) | 301 → `/camps/` → OK |
| Webster volleyball (expired) | 301 → `/camps/` → OK |
| Reno soccer (expired) | 301 → `/camps/nv/` (NV hub present) |

`/camps/pa/` itself still 404 — expected with zero live PA listings — but expired PA camps no longer dead-end there. That closes last week's needs-you on the redirect policy gap.

Crawled-not-indexed examples include live state hubs `/camps/wi/` and `/camps/ma/` (both return 200) plus expired camp slugs and a filtered coaching-tips URL. Thin/filtered variants remain the known category; nothing new that looks like a broken indexable page.

### Sitemaps (GSC UI)

| Sitemap | Status | Discovered | Last read |
| --- | --- | --- | --- |
| `sitemap.xml` | Success | 2,095 | Sep 16, 2026 |
| `sitemap-camps.xml` | Success | 37 | Aug 28, 2026 |

Live fetch today: `sitemap.xml` is a sitemap index pointing at `sitemap-content.xml` (~2,072 URLs) and `sitemap-camps.xml` (**118** URLs). Camps discovered in GSC is the lag to watch.

## Errors needing action

Only the stale camps sitemap re-read (dashboard). No bare-404 expired-camp policy gap this week. No new backlink or CWV issue.

## Content ideas

Still almost nothing to mine from queries. The two impressed article URLs (`dance-studio-shopping-year-one`, `when-the-cuts-list-goes-up`) are worth keeping fresh if Flo/Ed touch them later — not a Nora action this week.

## Single highest-impact fix this week

Get Google to re-read `sitemap-camps.xml` so the recovered 118-camp inventory enters the index queue. Everything else is "nothing new, keep executing the 30/60/90 plan."

## Run notes

- Kill switch confirmed active via `forge-command` D1 `agent_registry`.
- Maintenance: calendar idle removed 2026-08-01; env `PCD_MAINTENANCE_MODE` unset → full report.
- Live camps inventory confirmed via sitemap fetch (118), not D1 column guessing.
- Raw capture: also saved on box as `/workspace/gsc-nora-2026-09-21.txt` for this run.
- Agent-run logging: `PCD_AGENT_RUNS_TOKEN` absent from the DESKTOP Shell env this session, so `scripts/agent-run-client.mjs` preflight could not run. Report file is the durable artifact; D1 `agent_runs` row may be missing again (same gap as Sep 13).