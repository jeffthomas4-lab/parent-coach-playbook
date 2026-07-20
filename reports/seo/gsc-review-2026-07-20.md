# GSC Review, parentcoachdesk.com

**Date:** 2026-07-20
**Window:** last 7 days (~Jul 12-18) vs prior 7 days (~Jul 5-11)
**Note:** first report at this consolidated path (`reports/seo/`). Prior week's numbers pulled from the last legacy file, `gsc-reviews/GSC_REVIEW_2026-07-08.md`, since nothing exists yet at the new location.

## Takeaways

Clicks are still 0 both windows. Impressions ticked up from 2 to 3, average position eased from 9 to 16. Three impressions in a week is still data-thin, not a trend either direction.

Indexed pages fell from 288 to 228, and the "Not found (404)" bucket jumped from 53 to 82. Both numbers move together with the sitemap-camps.xml discovered count, which dropped from 1,059 to 507 over the same stretch. That's the expired-camp pruning doing its job, not a technical break. I spot-checked two of the flagged 404 URLs live: nike-soccer-camp-at-winsor-school and nike-baseball-camp-at-charleston-southern-university. Both 301 to their state hub (/camps/ma/ and /camps/sc/) right now. GSC's crawl on these ran Jul 8-10, before the redirect had caught up, so the 404 count in the dashboard is a lag artifact, not a live gap.

Both sitemaps read Success (sitemap.xml, 2,479 discovered, down from 2,932, consistent with camp expiry; sitemap-camps.xml, 507 discovered). parentcoachplaybook.com still shows the "currently moving to parentcoachdesk.com" banner with no errors.

## Recommended actions

Nothing needs a fix this week. Keep executing the 30/60/90 plan from the Organic Search Audit.

Recheck the indexed and 404 counts next Monday. GSC should have recrawled the flagged URLs by then. If the 404 count is still climbing after that recrawl, the redirect policy has a real gap and it's worth a session. If it comes back down toward the 15-53 range from prior reviews, this was lag, confirmed.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 3 vs 2. Average CTR: 0% both windows. Average position: 16 vs 9.

## Pages worth a look (position 8-20)

Three pages had impressions this window:

- parentcoachdesk.com/ — position 3.0, 1 impression
- /camps/nike-soccer-camp-at-sofive-elkins-park-day-camp-july-27-31-2026/ — position 8.0, 1 impression
- /camps/breakthrough-basketball-elite-skills-playmaking-camp-auburn/ — position 37.0, 1 impression, outside the band

Only the sofive page sits in the retitle/expand band, and it's one impression. Not actionable yet.

## The queries

Still no query-level data. Every search this window is below Google's anonymization threshold. Same finding as every review since launch.

## Indexing and sitemap

Coverage: 228 indexed (down from 288), roughly 1.5K not indexed across 7 reasons. Breakdown: Crawled - currently not indexed (1,261, up from 1,206), Alternate page with proper canonical tag (90, was 94), Not found/404 (82, up from 53, see takeaways), Duplicate - Google chose different canonical (36, was 40), Blocked by robots.txt (31, unchanged), Page with redirect (2, unchanged), Soft 404 (1, unchanged), Discovered - currently not indexed (0, unchanged).

The GSC indexing dashboard itself is dated Jul 9, ten days stale as of this review. That's Google's data lag, not a site problem, but it means this week's indexed/404 read should be treated as a snapshot from before the camp-pruning batch fully settled.

## Errors needing action

Nothing critical on parentcoachdesk.com. The 404 jump looks resolved on live spot-check, see takeaways. No security issues detected.

parentcoachplaybook.com (old domain, mid Change of Address move) shows no new errors this week. Banner confirms the move is still active.

## Content ideas

Nothing new to mine from query data yet. Same as every review since launch, revisit once impressions climb past the anonymization threshold.
