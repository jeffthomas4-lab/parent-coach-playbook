# GSC Review, parentcoachdesk.com

**Date:** 2026-08-16
**Window:** last 7 days (Aug 9-15) vs prior 7 days (Aug 2-8)
**Prior file:** `reports/seo/gsc-review-2026-08-09.md`

## Takeaways

Impressions ticked up from zero to one this week. Still nothing real to work with. Clicks stayed at zero, same as every review since launch. The one query on file, "youth football parent meeting agenda," shows 2 impressions in the 28-day window but didn't register at all in the last 7 days.

Page Indexing moved the wrong direction. Indexed count fell again, 61 to 57, the third straight drop (90, then 61, then 57). The bigger move is Discovered - currently not indexed: it jumped from 187 back to 1,423, almost exactly reversing last week's "the backlog closed" note, and it's most of the way back to the 1,208 it sat at five weeks ago. Crawl Stats doesn't explain it. parentcoachdesk.com shows zero host-level problems, 81% of the last 90 days' crawl requests came back 200, and request volume is flat. This reads like Google's own indexing queue moving on its own, not a site problem, but it's worth watching.

Spot-checked two newly-flagged 404 camp URLs live. Both redirect correctly, one to `/camps/mn/`, one to `/camps/ct/`. The expired-camp policy in `camps-db.ts` still holds. GSC's 404 count is lagging the live site again, same pattern as every review.

## Recommended actions

No fix needed on the camps redirect policy. Confirmed again, live, both resolving to state hubs.

Watch next week whether the indexed count keeps falling or holds, and whether Discovered-not-indexed keeps climbing back toward its old 1,208 peak or drops again like it did last week. Two data points moving in opposite directions across two reviews isn't a trend yet, but it's close to one.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 1 vs 0. Average CTR: 0% both windows. Average position: 5 (from the single impression) vs no data prior week (zero impressions).

## Pages worth a look (position 8-20)

None. One impression this week isn't enough data for a page-level position read.

## The queries

Nothing clears Google's anonymization threshold in the 7-day window. The one query on file, "youth football parent meeting agenda," appears in the 28-day view (2 impressions total) but didn't show up in the last 7 days.

## Indexing and sitemap

Indexed: 57, down from 61 last week and 90 two weeks back. Not indexed: 3.15K across 8 reasons, up from 1.91K last week. By reason: Not found (404) 117, up from 114. Alternate page with proper canonical tag 39, unchanged. Blocked by robots.txt 31, unchanged. Page with redirect 4, up from 2. Soft 404: 1, unchanged. Crawled - currently not indexed: 1,507, down slightly from 1,508. Discovered - currently not indexed: 1,423, up sharply from 187, the backlog that looked closed last week reopened almost to its old size. Duplicate, Google chose different canonical: 24, unchanged.

Spot-checked two live 404-flagged camp URLs from the current examples list: a Stillwater soccer camp redirects to `/camps/mn/`, a Ridgefield Academy soccer camp redirects to `/camps/ct/`. Both policy-correct, neither a bare 404.

Both sitemaps read Success. `sitemap.xml` (index): 2,321 discovered, unchanged from last week. `sitemap-camps.xml`: 311 discovered, unchanged.

Crawl Stats for parentcoachdesk.com, last 90 days: 2.19K total requests, no host-level problems flagged on either host. 81% came back 200 OK, 12% 404, 7% 301. Nothing here explains the Discovered-not-indexed jump.

## Errors needing action

None on parentcoachdesk.com this week.

parentcoachplaybook.com (old domain, Change of Address) still shows "This site is currently moving to parentcoachdesk.com." No errors, migration not cancelled. Its own robots.txt report flags 4 files with critical errors, but that's the retiring domain on its way out through the redirect, not worth chasing.

## Content ideas

Nothing new to mine. Still one query on file and it didn't show up this week.

## Single highest-impact fix this week

Watch the indexed count and the Discovered-not-indexed reversal together. Indexed count keeps sliding (90, 61, 57) and the backlog that looked closed last week is most of the way back to where it was five weeks ago. Crawl Stats shows no errors, so this isn't a broken site, it's Google's indexing queue moving on its own. Flagging it now so it doesn't turn into a quiet slide nobody looked at. Not urgent yet. Worth a real look if next week moves the same direction again.
