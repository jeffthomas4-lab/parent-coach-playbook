# GSC Review, parentcoachdesk.com

**Date:** 2026-09-28
**Window:** last 7 days (Sep 19-25) vs prior 7 days (Sep 12-18)
**Prior file:** `reports/seo/gsc-review-2026-09-21.md`
**Mode:** Aug-Nov maintenance / report-only. Kill switch: `nora` = active. No site fixes, no outreach drafts, no Class B/C work.

## Takeaways

Last week's `needs_you` on the stale camps sitemap is cleared. GSC now shows `sitemap-camps.xml` as **Success**, **118** discovered, last read **Sep 23** (was 37 / Aug 28). Main `sitemap.xml` Success, **2,176** discovered, last read **Sep 26**. Live fetch today: camps sitemap still **117** `<loc>` URLs (minor 118-vs-117 drift vs GSC count; within noise).

Indexed count ticked **57 -> 56** (Page Indexing last update Sep 20). Not-indexed held at **3.03K** across 8 reasons. 404 reason count flat at **121**. Crawled-not-indexed **1,512** (+1 from 1,511). Discovered-not-indexed **1,308** (unchanged).

Search performance is still noise: **0 clicks / 2 impressions** this week vs **1 / 2** prior. Homepage took both impressions. Average position 109 vs 1.5 prior is not meaningful on two impressions. One query cleared anonymization over a longer window earlier today (`youth football parent meeting agenda`, 0 clicks / 2 impressions on the 3-month view) - not in the 7-day query table.

External links report shows **Total 0** (was 7 from `parentcoachplaybook.com` last week). No new third-party backlinks. Treat as retiring-domain link drop / GSC lag, not a new acquisition. Core Web Vitals: not enough CrUX field data on mobile or desktop (last updated Sep 26).

## Recommended actions

No bare-404 expired-camp policy gap this week (spot-checks 301 correctly). Sitemap camps re-read is done.

**Needs you (light).** Indexed count edged down one page (57->56) with indexing report last update still Sep 20 - watch next week; no dashboard action required unless it keeps falling. External links dropping 7->0 is worth a glance in GSC -> Links to confirm the retiring-domain set disappeared rather than a reporting bug.

Otherwise: nothing new - keep executing the Organic Search Audit 30/60/90 plan. Maintenance mode held (report-only).

## What moved

| Metric | Last 7 days (Sep 19-25) | Prior 7 days (Sep 12-18) |
| --- | --- | --- |
| Clicks | 0 | 1 |
| Impressions | 2 | 2 |
| Avg CTR | 0% | 50% |
| Avg position | 109 | 1.5 |

(Single-digit impression windows - CTR and position are not meaningful on their own.)

## Pages worth a look

| Page | Notes |
| --- | --- |
| `/` | Both L7 impressions; 0 clicks |

Spot-checked live: homepage 200.

## The queries

7-day query table empty under Compare. No actionable query mining this week.

## Indexing and sitemap

Indexed: **56** (was 57). Not indexed: **3.03K** across 8 reasons (held).

By reason (vs Sep 21 report):
- Not found (404): 121 (unchanged)
- Alternate page with proper canonical tag: 36 (unchanged)
- Blocked by robots.txt: 31 (unchanged)
- Page with redirect: 8 (unchanged)
- Soft 404: 1 (unchanged)
- Crawled - currently not indexed: 1,512 (was 1,511)
- Discovered - currently not indexed: 1,308 (unchanged)
- Duplicate, Google chose different canonical: 15 (unchanged)

### Spot-checks on GSC 404 examples

| URL | Live behavior |
| --- | --- |
| Gettysburg volleyball (expired) | 301 -> `/camps/` -> 200 |
| West Monroe basketball (expired) | 301 -> `/camps/` -> 200 |
| Webster volleyball (expired) | 301 -> `/camps/` -> 200 |
| Reno soccer (expired) | 301 -> `/camps/nv/` -> 200 |
| Stillwater soccer (expired) | 301 -> `/camps/mn/` -> 200 |

No bare 404s on these camp slugs. Policy still holding.

### Crawled-not-indexed examples

Known thin/filtered category: `/cost-calculator/?sport=band`, `/camps/?format=overnight`, `/camps/?sport=multi-sport`, state hubs `/camps/wi/` and `/camps/ma/` (both live 200), expired camp slugs, filtered `/coaching-tips/?sport=...`. Nothing new that looks like a broken indexable page.

### Discovered-not-indexed examples

Adaptive and body evergreen URLs (e.g. `/adaptive/adapted-sports-programs/` - live 200, Last crawled N/A). Known discovery backlog, not a new regression.

### Sitemaps (GSC UI)

| Sitemap | Status | Discovered | Last read |
| --- | --- | --- | --- |
| `sitemap.xml` | Success | 2,176 | Sep 26, 2026 |
| `sitemap-camps.xml` | Success | 118 | Sep 23, 2026 |

Live fetch today: `sitemap.xml` index -> content (~2,076) + camps (**117** `<loc>`). Camps re-read lag from last week is resolved.

## Errors needing action

None Critical. Light watch: indexed down 1; external links 7->0. No sitemap Error. No bare-404 policy gap.

## Content ideas

Still almost nothing to mine from 7-day queries. Keep 30/60/90 distribution work - not a Nora code action under maintenance mode.

## Single highest-impact fix this week

Nothing new - keep executing the 30/60/90 plan. Last week's camps sitemap re-read landed; wait for indexing to absorb the 118-camp inventory before scoping new SEO code work (and Aug-Nov maintenance forbids opportunistic fixes anyway).

## Run notes

- Kill switch confirmed active via `forge-command` D1 `agent_registry` (`nora` = active; `last_run_at` still 2026-08-10 UTC until this run logs).
- Maintenance: Aug-Nov report-only held. No Class B/C, no site writes beyond this report + attempted agent-run log.
- Live camps inventory via sitemap fetch (117 `<loc>`), GSC discovered 118.
- Raw capture on box: `/workspace/gsc-nora-2026-09-28-raw.txt` (+ perf/indexing/sitemap/links screenshots).
- Agent-run logging: `PCD_AGENT_RUNS_TOKEN` absent from DESKTOP Shell env this session (same gap as Sep 13 / Sep 21). Preflight not run; D1 `agent_runs` row may be missing again.
