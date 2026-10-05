# GSC Review, parentcoachdesk.com

**Date:** 2026-10-05
**Window:** last 7 days vs prior 7 days (GSC compare view does not print ranges; data ends Oct 3, so likely Sep 27-Oct 3 vs Sep 20-26)
**Prior file:** `reports/seo/gsc-review-2026-09-28.md`
**Mode:** report-only (Class A). Kill switch: `nora` = active in `forge-command` D1 `agent_registry`. No site fixes, no outreach drafts.

## Takeaways

Quiet week, nothing regressed. Impressions rose **2 -> 6** with **0 clicks** both weeks. Six impressions is still noise, but for the first time they spread past the homepage: an article (`/drive-home/when-the-cuts-list-goes-up/`), a body page, and three camp URLs each picked up 1-2.

Page Indexing has **not refreshed since Sep 20** (15 days), so indexed **56** and not-indexed **3,032** are the same snapshot as last week. Every reason count is unchanged.

The camps sitemap was re-read **Oct 4**: Success, **54** discovered (was 118 / Sep 23). That matches the camps inventory cleanup (Dex Oct 4: live camps 118 -> 54; five adult Nike tennis camps removed after that). Live fetch today: `sitemap-camps.xml` has **48** `<loc>` URLs. Main `sitemap.xml` index Success, **2,112** discovered, last read Sep 26 (was 2,176). Live `sitemap-content.xml` has 2,083 URLs.

External links came back to **3** (all from `parentcoachplaybook.com`, anchor "parent coach desk"), after showing 0 last week. That's the retiring-domain Change of Address residue, not a new backlink. Core Web Vitals: still not enough CrUX field data on mobile or desktop (updated Oct 2).

## What moved

| Metric | Last 7 days | Prior 7 days |
| --- | --- | --- |
| Clicks | 0 | 0 |
| Impressions | 6 | 2 |
| Avg CTR | 0% | 0% |
| Avg position | 1.5 | 109 |

Longer windows: last 28 days (Sep 6-Oct 3) 1 click / 11 impressions / 9.1% CTR / position 21.9. Three months (Jul 4-Oct 3) 1 click / 30 impressions / 3.3% CTR / position 17.6.

Note: last week's report showed prior-7 clicks 1 / CTR 50%; GSC now shows the overlapping Sep 20-26 period at 0 clicks, so that click fell on Sep 19 or earlier.

## Pages worth a look

| Page | Impr. L7 / P7 | Live check |
| --- | --- | --- |
| `/` | 4 / 2 | 200 |
| `/drive-home/when-the-cuts-list-goes-up/` | 2 / 0 | 200 |
| `/camps/nike-baseball-camp-at-boise-state-university-day-camp-june-15-18-2026-ycif/` | 2 / 0 | 301 -> `/camps/` |
| `/body/bus-and-banquet-conduct/` | 1 / 0 | 200 |
| `/camps/nike-soccer-swim-camp-with-hub-sports-at-windgate-ranch-july-27-31-2026/` | 1 / 0 | 301 -> `/camps/az/` |
| `https://www.parentcoachdesk.com/` | 1 / 0 | 301 -> apex |
| `/camps/nike-tennis-camp-amherst-at-mount-holyoke-college-all-skills-program-all-skills--mxoa/` | 1 / 0 | 301 -> `/camps/ma/` |

The camp URLs earning impressions are expired or removed listings that now 301 to a hub, which is the intended policy. Google will swap them out as it recrawls.

## The queries

7-day Queries tab: no data (all anonymized). The only query visible on the 3-month view is still `youth football parent meeting agenda` (0 clicks / 2 impressions).

## Indexing and sitemap

Indexed: **56** (unchanged). Not indexed: **3,032** across 8 reasons. Last update **Sep 20**. All validations "Not Started".

| Reason | Pages | vs Sep 28 |
| --- | --- | --- |
| Not found (404) | 121 | flat |
| Alternate page with proper canonical tag | 36 | flat |
| Blocked by robots.txt | 31 | flat |
| Page with redirect | 8 | flat |
| Soft 404 | 1 | flat |
| Crawled - currently not indexed | 1,512 | flat |
| Discovered - currently not indexed | 1,308 | flat |
| Duplicate, Google chose different canonical | 15 | flat |

No new reason, no spike. Both drill-downs show first detected 6/8/26 and flat trends.

### Spot-checks on GSC 404 examples

| URL (under `/camps/`) | Live behavior |
| --- | --- |
| Gettysburg volleyball (expired) | 301 -> `/camps/` -> 200 |
| Reno soccer (expired) | 301 -> `/camps/` -> 200 |
| Seattle U baseball (expired) | 301 -> `/camps/wa/` -> 200 |
| Ridgefield Academy soccer (expired) | 301 -> `/camps/` -> 200 |
| Lipscomb tennis (expired) | 301 -> `/camps/` -> 200 |

No bare 404s. Expired-camp policy still holding; the 121 count is old crawl data (last crawls Aug 3-Sep 4).

### Crawled-not-indexed examples

Same known categories as last week: filtered variants (`/cost-calculator/?sport=band`, `/camps/?format=overnight`, `/camps/?sport=multi-sport`, `/coaching-tips/?sport=...`), state hubs `/camps/wi/` and `/camps/ma/` (both live 200), and expired camp slugs. Nothing new.

### Sitemaps (GSC UI)

| Sitemap | Status | Discovered | Last read |
| --- | --- | --- | --- |
| `sitemap.xml` (index) | Success | 2,112 | Sep 26, 2026 |
| `sitemap-camps.xml` | Success | 54 | Oct 4, 2026 |

Live today: index -> `sitemap-content.xml` (2,083) + `sitemap-camps.xml` (48). Note `sitemap-index.xml` returns 404 live; the submitted index is `sitemap.xml`, so this is a naming note in the SKILL, not a site problem.

## Links

External: **3** (parentcoachplaybook.com, all to `/`). Internal: **14** (top linked `/`). No new third-party backlinks.

## Errors needing action

None. No sitemap Error, no bare-404 policy gap, no regression. Indexing report staleness (since Sep 20) is GSC lag, nothing to do on our side.

## Single highest-impact fix this week

Nothing new. Keep executing the 30/60/90 plan. Let Google absorb the 54-camp sitemap and the Oct 4 recrawl before scoping any SEO code work. External links are still the binding constraint, which is Lonnie's lane.

## Run notes

- Kill switch confirmed active (`nora`, `last_run_at` still 2026-08-10 UTC because no agent-run row is written).
- Report-only held. Only writes: this report, plus restoring `reports/seo/gsc-review-2026-09-28.md` from the box copy (it never landed in the repo last week).
- Raw capture on box: `/workspace/gsc-nora-2026-10-05/` (8 PNG + TXT pairs: perf 7d compare, perf 28d, page indexing, 404, crawled-not-indexed, sitemaps, links, CWV).
- Agent-run logging: `PCD_AGENT_RUNS_TOKEN` absent from DESKTOP Shell env again (same gap as Sep 13 / 21 / 28). Preflight not run; no D1 `agent_runs` row.
