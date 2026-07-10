# GSC Review, parentcoachdesk.com

**Date:** 2026-07-06
**Window:** last 7 days (Jun 29 to Jul 5) vs prior 7 days (Jun 22 to Jun 28)
**Property age:** 26 days (created June 10). Still thin. Read it that way.

## What moved

Clicks stayed at 0 both weeks. Impressions dropped from 12 to 7. Average position moved from 4.5 to 7.9, worse on paper, but that is 7 impressions against 12, not a real signal.

Over the full 3 months Google has logged 33 impressions and 0 clicks total. The bigger move is on the indexing side, not performance.

Two weeks ago (June 22 review) the site had 390 indexed pages and 2,820 not indexed, roughly 3,210 known URLs. Today it is 288 indexed and 1,427 not indexed, about 1,715 known URLs. That is a drop of nearly 1,500 URLs in two weeks.

Some of that is dated camp listings aging out and getting pruned, which is expected. A 404 count that grew from 15 to 53 in the same stretch is worth a look, see below.

The sitemap setup also changed. There is now a dedicated `sitemap-camps.xml` alongside the main `sitemap.xml` index, both resubmitted and last read yesterday (July 5), both status Success. That is a build change since the last review, not a Search Console issue.

## The 3 most interesting queries

Still none. Every query is anonymized, same as June 22. Both the 7-day and 3-month query tables come back empty even though the 3-month window has logged 33 impressions.

That threshold has not moved. No query-level data exists on either window, and there is nothing to mine for retitles from the query side this week either.

## Pages worth a look (position 8-20)

Two pages are sitting in the 8-20 band on 3-month data:

- `/body/heat-cramps-protocol/` at position 18.4, 5 impressions. A body-section safety page, the same kind of page the water polo safety page was last time. Real content, not a dated listing, so it can be expanded and retitled without anything aging out from under it.
- `/what-to-buy/football-7v7/` at position 8.3, 3 impressions. A gear guide page. Close to page one. Worth a look at the title and the first 100 words to see if it can move up rather than just hold.

For reference, the rest of the 3-month top pages: `/camps/soccer-camp-full-day-at-sera-sports-complex/` (7 impressions, position 3.9), the homepage (6 impressions, position 2.8), `/camps/submit` (3 impressions, position 1.3), `/scripts/after-a-win/` (3 impressions, position 4.0), `/scripts/before-a-game-5-7/` (3 impressions, position 6.0), and `/scripts/after-a-bad-game/` (3 impressions, position 6.3). All healthy, all camp or script pages that already rank well.

Last week's impressions came almost entirely from a different set of pages than the week before: `/camps/soccer-camp-full-day-at-sera-sports-complex/` picked up 4 new impressions, and three other pages picked up 1 each, all new this week. Every page that had impressions the prior week (heat cramps, camps/submit, after-a-win, homepage, the Bluey dance camp, after-a-bad-game) dropped to 0. That is just which camp listings are live and getting served that week, not a ranking problem.

## Indexing and sitemap

Sitemaps are clean. `sitemap.xml` (sitemap index) shows 2,932 discovered pages, status Success, last read July 5. The new `sitemap-camps.xml` shows 1,059 discovered pages, also status Success, also last read July 5.

No processing problems on either.

Coverage: 288 pages indexed, 1,427 not indexed. The big bucket is "Crawled, currently not indexed" at 1,206, normal for a site this size still working through the crawl queue. Alternate page with proper canonical sits at 94, flat from 93 two weeks ago.

Blocked by robots.txt sits at 31, flat from 30. Page with redirect is 2, soft 404 is 1, both flat.

Not found (404) jumped from 15 to 53. That is the one number that actually moved in a way worth checking. Worth pulling the list to see if they are old camp URLs that expired on schedule or something that broke.

## Errors needing action

Nothing critical on the main site.

parentcoachplaybook.com still shows "This site is currently moving to parentcoachdesk.com." The Change of Address is active, not cancelled, no error. Same healthy state as June 22.

Did not re-check the robots.txt flag from the old property this week. That is still open from last time and worth a look when there is a spare minute.

## Content ideas

None surfaced from queries, same reason as always: no query data yet. The two 8-20 pages above are the real action items this week, both are existing content that can be improved rather than new pages that need to get built.
