# GSC Review, parentcoachdesk.com

**Date:** 2026-08-03
**Window:** last 7 days (~Jul 27-Aug 2) vs prior 7 days (~Jul 20-26)
**Prior file:** `reports/seo/gsc-review-2026-07-28.md`

## Takeaways

Clicks are still 0 both windows. Same as every review since launch.

Impressions dipped from 6 to 4, still too thin to read anything into. Average position swung from 5.3 to 43.5, but that's not a ranking crash, it's noise from one new query. A new search term, "youth football parent meeting agenda," picked up 2 of this week's 4 impressions at position 77. Blended with the homepage's usual couple of impressions at position 1, the average lands at 43.5. Total impressions are still under 5 a week, so one new low-ranking query is enough to swing the average this hard. Worth watching, not worth reacting to.

Indexing and sitemap health show no real change from last week. The Page Indexing report itself hasn't refreshed since 7/23, eleven days now, so this week's numbers are the same snapshot as the last review: 90 indexed, 2.88K not indexed. Re-confirmed the camps expired-listing policy is working: spot-checked two more flagged 404 URLs live, both 301 to their state hub page, neither a bare 404.

## Recommended actions

Pull Crawl Stats next review. This is the second review running I haven't gotten to it. The /adaptive/ silo backlog (1,208 pages sitting in "discovered, not crawled") is still unexplained, and Crawl Stats is the only place that would show a 5xx spike or a crawl-budget ceiling.

No fix needed on the camps redirect policy. Confirmed again, live.

Watch "youth football parent meeting agenda" next week. If it starts pulling real impressions instead of 2, it's a signal worth a dedicated page.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 4 vs 6. Average CTR: 0% both windows. Average position: 43.5 vs 5.3 (see takeaways for why).

## Pages worth a look (position 8-20)

None. No page carries enough impressions for a meaningful position read this window. The site's own top-pages table shows single-impression noise scattered between position 1 and 77, not a real 8-20 band.

## The queries

One query clears Google's anonymization threshold: "youth football parent meeting agenda," new this week, 2 impressions, 0 clicks, position 77. Everything else stays below the threshold, same as every review since launch.

## Indexing and sitemap

Page Indexing report is still showing the 7/23 snapshot, unchanged from last week: 90 indexed, 2.88K not indexed across 8 reasons. Not found (404): 100. Alternate page with proper canonical tag: 72. Blocked by robots.txt: 31. Page with redirect: 4. Soft 404: 1. Crawled - currently not indexed: 1,429. Discovered - currently not indexed: 1,208 (the /adaptive/ silo backlog flagged last review). Duplicate, Google chose different canonical: 31. None of this moved, because the underlying data hasn't refreshed, not because the site stood still.

Spot-checked two of the flagged 404 URLs live: `/camps/bricks-4-kidz-advanced-robotics-camp/` and `/camps/nike-baseball-camp-in-bend-day-camp-july-20-23-2026/`. Both 301 to their state hub page (`/camps/wa/` and `/camps/or/`), neither a bare 404. The expired-camp policy in `camps-db.ts` is doing its job.

Both sitemaps read Success. `sitemap.xml` (index): 2,310 discovered, down from 2,455. `sitemap-camps.xml`: 311 discovered, down from 480. Both drops track with the ongoing camp pruning, same pattern as prior weeks.

## Errors needing action

None on parentcoachdesk.com this week.

parentcoachplaybook.com (old domain, Change of Address) still shows "This site is currently moving to parentcoachdesk.com," date started June 10, 2026. No errors, not cancelled.

## Content ideas

Nothing new to mine from query data yet, still below the anonymization threshold. The one exception is the new "youth football parent meeting agenda" query named above, worth a look if it holds next week.

## Single highest-impact fix this week

Nothing new. Keep executing the plan. Pull Crawl Stats next review to close the /adaptive/ open thread before it's a third review in a row.

## Run notes

Two governance checks this run's SKILL.md calls for could not be completed: confirming `agent_registry.status = 'active'` for `nora` in the `forge-command` D1, and checking the `PCD_MAINTENANCE_MODE` toggle. Both require either the Cloudflare D1 MCP or a shell session; neither was reachable this run (the D1 MCP was disconnected and the sandbox shell would not start). The GSC pull itself does not depend on either, so the report above is real, live data. No `agent_runs` row was written for the same reason, plus the standing gap named in the PCD Operating Manual's Open Item 3: production's `AGENT_RUNS_TOKEN` is still absent, so `POST /api/agent-runs` would refuse the write regardless.
