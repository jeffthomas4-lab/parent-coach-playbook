# GSC Review: parentcoachdesk.com — July 13, 2026

## Access
Confirmed today: jeffthomas4@gmail.com still has zero properties in Search Console ("No matching property") — the fix from the 6/29 review (add it as a Full user) hasn't been done. But GSC access itself isn't actually blocked: parentcoachplaybook@gmail.com has full owner access to sc-domain:parentcoachdesk.com and was used to pull everything below. Either keep using that account for these reviews, or sign in as parentcoachplaybook@gmail.com → Settings → Users and permissions → add jeffthomas4@gmail.com with Full access so Jeff's own login works too.

## The numbers
Last 7 days: 0 clicks, 2 impressions, 0% CTR, average position 9.0.
Previous 7 days: 0 clicks, 7 impressions, 0% CTR, average position 7.9.

Impressions dropped from 7 to 2 week over week. Zero clicks both weeks. Average position slipped almost a full spot, from 7.9 to 9.0.

None of this is a real signal yet. The property was created June 10. Five weeks in, we're talking about single-digit impressions on any given week. Read it as noise, not trend.

## Query data: not available yet
The Queries tab is returning "No data" at every date range I checked, including the full 3-month window since the property started. This isn't a bug. Google withholds individual query rows when volume is too thin to do without risking anonymity.

35 total impressions over three months isn't enough for Google to break out by search term. So there's no top 10 queries list this week, and no queries sitting at position 8-20 to name. I'm not going to invent numbers to fill that gap. That opens up once volume picks up.

## Where the impressions came from
Since queries are blocked, pages are the only lens available. Over the trailing 3 months, 31 pages got at least one impression.

The soccer camp page (Sera Sports Complex, full day) leads with 7 impressions. The homepage is next at 6. The heat cramps protocol page pulled 5.

A cluster of camps and script pages (after-a-win, before-a-game, after-a-bad-game, football 7v7 gear) each pulled 3. Everything else is at 1-2.

The two highest performers are a camp listing and a heat safety page, not a script or gear guide. If that holds up as more data comes in, camps and body/safety content might be pulling more search interest than the parenting script content the site is built around.

## Pages sitting at position 8-15
Nine pages are one push from page 1: /what-to-buy/football-7v7/ (8.3), /camps/nike-baseball-camp-at-sierra-canyon-school-june-22-25-2026/ (8.5), /camps/nike-soccer-camp-with-jm-soccer-academy-in-las-vegas-june-8-12-2026-sv2q/ (9.5), /body/transporting-other-peoples-kids/ (9.0), /camps/nike-baseball-camp-at-adelphi-university-july-27-30-2026/ (9.0), /camps/nike-soccer-camp-in-west-seattle-all-skills-iii-july-20-24-2026/ (9.0), /camps/nike-baseball-camp-at-edgewood-university-aug-10-13-2026-9i81/ (10.0), /camps/nike-baseball-camp-at-university-of-denver-day-camp-june-22-25-2026-0pqm/ (10.0), and /body/water-polo-specific-safety/ (12.0).

The football-7v7 buying guide is the closest and the best internal-link target — a link or two from the homepage or the Sera Sports Complex camp page (both getting more impressions already) could be enough to nudge it onto page 1.

## Indexing: the real story this week
288 pages indexed. 1,430 pages not indexed. That's the number that needs attention, not the click count.

Breakdown of the non-indexed pages: 1,206 are "Crawled - currently not indexed," meaning Google looked and passed. 94 are "Alternate page with proper canonical tag," which is expected and not a problem. 53 are flat "Not found (404)."

40 are "Duplicate, Google chose different canonical than user." 31 are "Blocked by robots.txt." 2 are redirects, 1 is a soft 404.

The 53 404s are worth a look this week. Something in the sitemap or internal links is pointing at pages that don't exist.

The 1,206 crawled-not-indexed is the bigger structural question. That's a lot of pages Google looked at and decided weren't worth adding to the index. The sitemap has 3,024 discovered URLs and most of those look like auto-generated camp listings.

This smells like thin or near-duplicate content at scale: camp pages that are functionally the same page with a different location or date swapped in. Worth checking whether the camp pages carry enough unique copy to earn indexing, or whether they need consolidating.

## Sitemaps
Both submitted sitemaps are processing clean. sitemap.xml (the index) shows Success, last read today, 3,024 pages discovered. sitemap-camps.xml also shows Success, last read today, 659 pages discovered.

No errors to fix here.

## Domain move
parentcoachplaybook.com still shows "This site is currently moving" to parentcoachdesk.com, date started June 10, 2026. No error, not cancelled. On track.

## Bottom line
Nothing to fix on the technical side except the 404s. The number worth watching going forward isn't clicks, it's the 1,206 crawled-not-indexed pages.

If that number keeps growing as more camp pages get added, it's going to cap how much of the site actually shows up in search regardless of how much content gets published.
