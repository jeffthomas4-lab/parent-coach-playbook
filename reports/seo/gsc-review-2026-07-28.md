# GSC Review, parentcoachdesk.com

**Date:** 2026-07-28
**Window:** last 7 days (~Jul 20-26) vs prior 7 days (~Jul 13-19)
**Prior file:** `reports/seo/gsc-review-2026-07-20.md`

## Takeaways

Clicks are still 0 both windows. Impressions held at 4 vs 4, CTR 0% both, average position eased from 5.5 to 5.3. Still too thin for query or page-level data, same as every review since launch.

Indexed pages dropped from 228 to 90. That's a 138-page fall in one week, on top of the 288 to 228 drop the week before. This is the real story this week.

The reason shows up in the indexing breakdown. "Discovered - currently not indexed" went from 0 last week to 1,208 this week. I sampled the flagged URLs and they're not camp listings, they're the /adaptive/ content silo: adapted-sports-programs, adhd-and-youth-sports, autistic-athlete, special-olympics-guide-for-parents, and more. Every one I checked shows "Last crawled: N/A." Google knows these pages exist (sitemap or internal links) but hasn't crawled a single one yet.

I also spot-checked five of the "Not found (404)" URLs live: nike-baseball-camp-at-university-of-puget-sound, nike-soccer-camp-in-schaumburg, nike-indoor-soccer-camp-at-rancho-solano, bricks-4-kidz-advanced-robotics-camp, around-the-world-cooking-camp. All five return 410 Gone right now. The expired-camp policy in `camps-db.ts` is working. GSC's 404 bucket (100, up from 82) is dashboard lag on already-resolved URLs, the same pattern as the last two reviews, not a live gap.

## Recommended actions

Confirm whether the /adaptive/ silo went live recently. If it's new content, a 1,200-page backlog sitting in "discovered, not crawled" is normal, Google just hasn't gotten to it yet, and the indexed-count drop is a temporary side effect of a large batch landing at once. If those pages have been live for a while and just got orphaned from crawling, that's a different problem and worth a session.

Pull Crawl Stats for parentcoachdesk.com next review. I didn't get to it this run, the Chrome connection dropped mid-session before I could check for 5xx spikes or a crawl-budget ceiling that would explain why 1,200+ pages aren't getting crawled. That's the one open thread.

No fix needed on the camps 301/410 policy. It's doing its job, confirmed live.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 4 vs 4. Average CTR: 0% both windows. Average position: 5.3 vs 5.5.

## Pages worth a look (position 8-20)

No page-level data this window, impressions are below Google's anonymization threshold. Same finding as every review since launch.

## The queries

Still no query-level data. Same as every review since launch.

## Indexing and sitemap

Coverage: 90 indexed (down from 228), 2.88K not indexed across 8 reasons. Breakdown: Not found/404 (100, up from 82, confirmed lag via live spot-check above), Alternate page with proper canonical tag (72, down from 90), Blocked by robots.txt (31, unchanged), Page with redirect (4, up from 2), Soft 404 (1, unchanged), Crawled - currently not indexed (1,429, up from 1,261, long-running category first detected 6/8), Discovered - currently not indexed (1,208, up from 0, first detected 6/12 but effectively all new volume this week, see takeaways), Duplicate - Google chose different canonical (31, down from 36).

Both sitemaps read Success. sitemap.xml: 2,455 discovered, down from 2,479. sitemap-camps.xml: 480 discovered, down from 507. Both drops track with the camp pruning still running, consistent with prior weeks.

## Errors needing action

The indexed-count drop and the /adaptive/ crawl backlog are the real items this week, named above. Nothing else critical on parentcoachdesk.com.

parentcoachplaybook.com (old domain, mid Change of Address move) still shows "This site is currently moving to parentcoachdesk.com," no errors, not cancelled. Its robots.txt report shows 3 of 4 URL variants "Not fetched," which is expected for a domain being wound down mid-migration and isn't something to act on.

## Content ideas

Nothing new to mine from query data yet. Same as every review since launch, revisit once impressions climb past the anonymization threshold.
