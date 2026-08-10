# GSC Review, parentcoachdesk.com

**Date:** 2026-08-09
**Window:** last 7 days (~Aug 2-8) vs prior 7 days (~Jul 26-Aug 1)
**Prior file:** `reports/seo/gsc-review-2026-08-03.md`

## Takeaways

Impressions dropped to zero this week. That's the third straight week down: 6, then 4, then 0. Clicks are still zero, same as every review since launch. Total volume is so thin that zero doesn't mean the site fell out of search, it means one query with 2 impressions at position 77 didn't show up again this week. Worth naming three weeks running, not worth a fire drill.

Page Indexing refreshed for the first time since July 23. Indexed count fell from 90 to 61. But total not-indexed fell too, by about 974 pages, almost all of it from the "Discovered - currently not indexed" reason dropping from 1,208 to 187. That's the /adaptive/ silo backlog that's sat unexplained for two reviews running. It cleared on its own without ever pulling Crawl Stats. Pulled the list of the 61 currently-indexed pages to check what's still there: homepage crawled Aug 7, plus a mix of camp listings and blog content (team-parent, body, game sections). Nothing core missing.

Spot-checked two of the new 404-flagged camp URLs live. `nike-baseball-camp-at-villanova-university-aug-3-6-2026` 301s to the PA hub. `nike-soccer-camp-at-ridgefield-academy-aug-10-13-2026` returns a clean 410 Gone. Both are policy-correct outcomes, the camps-db.ts expired-listing policy still catches them. GSC's "Not found (404)" label on both is just running behind what the site currently serves.

## Recommended actions

No fix needed on the camps redirect policy. Confirmed again, live, both a 301 and a 410 outcome.

Watch next week whether the indexed count (61) keeps falling or holds. One data point after a five-week-stale snapshot isn't a trend yet.

Crawl Stats drops off the list. The /adaptive/ backlog it would have explained closed itself this week.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 0 vs 4. Average CTR: 0% both windows. Average position: no data this week (zero impressions) vs 43.5 prior week.

## Pages worth a look (position 8-20)

None. Zero impressions this week means no page has enough data for a position read.

## The queries

Nothing clears Google's anonymization threshold this week. "youth football parent meeting agenda," the new query from last review (2 impressions, position 77), didn't show up again. Everything else stays below threshold, same as every review since launch.

## Indexing and sitemap

Page Indexing report refreshed 8/6/26, the first refresh since 7/23. Indexed: 61 (down from 90). Not indexed: 1.91K across 8 reasons (down from 2.88K). By reason: Not found (404) 114, up from 100. Alternate page with proper canonical tag 39, down from 72. Blocked by robots.txt 31, unchanged. Page with redirect 2, down from 4. Soft 404: 1, unchanged. Crawled - currently not indexed: 1,508, up from 1,429. Discovered - currently not indexed: 187, down from 1,208, the backlog that closed. Duplicate, Google chose different canonical: 24, down from 31.

Spot-checked two flagged 404 URLs live: `/camps/nike-baseball-camp-at-villanova-university-aug-3-6-2026/` (301 to `/camps/pa/`) and `/camps/nike-soccer-camp-at-ridgefield-academy-aug-10-13-2026/` (410 Gone). Both policy-correct, neither a bare 404.

Both sitemaps read Success. `sitemap.xml` (index): 2,321 discovered, up slightly from 2,310. `sitemap-camps.xml`: 311 discovered, unchanged from last week.

## Errors needing action

None on parentcoachdesk.com this week.

parentcoachplaybook.com (old domain, Change of Address) still shows "This site is currently moving to parentcoachdesk.com." No errors, not cancelled.

## Content ideas

Nothing new to mine. The one query worth watching from last week dropped out entirely this week.

## Single highest-impact fix this week

Watch the indexed count. It moved for the first time in five weeks of stale snapshots, from 90 to 61, but the drop tracks with the same camp-pruning pattern that's been shrinking the sitemaps for a month, not a loss of real content. Homepage and blog pages are still in the indexed set. If it keeps falling next week instead of holding, that's the thing to dig into.
