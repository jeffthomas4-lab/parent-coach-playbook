# GSC Review, parentcoachdesk.com

**Date:** 2026-07-08
**Window:** last 7 days (~Jun 30–Jul 6) vs prior 7 days (~Jun 23–Jun 29)
**Access:** Restored. jeffthomas4@gmail.com now has access to sc-domain:parentcoachdesk.com — the ownership gap flagged in the last two reviews is fixed.

## Takeaways

- Clicks are still 0 in both windows. Impressions dipped slightly (5 vs 7) and average position looks worse on paper (12.6 vs 4.9), but that's a page rotation effect, not a ranking loss — see below.
- Four camp/body pages are new entries sitting at position 9–10, one push from page 1. Each has exactly one impression so far — worth watching, not yet worth acting on.
- Indexing coverage shifted more than usual this week: indexed pages fell from 390 to 288, the "Discovered – currently not indexed" bucket collapsed from 1,539 to 0, and 404s jumped from 15 to 53. Nothing is flagged as a critical error, but the 404 jump and the homepage going quiet both deserve a look.

## Recommended actions

1. Check the 53 pages now returning 404 (Indexing → Pages → "Not found (404)"), up from 15 last review. Confirm these are camp listings that aged out/were removed on purpose, not accidental breakage.
2. The homepage had 0 impressions in both this window and the prior one — a break from its usual pattern (it pulled 3 impressions at position 1.7 as of the 6/22 review). Worth a quick check that it's still indexed and nothing changed on canonical/noindex tags.
3. If /body/transporting-other-peoples-kids/ (new this week, position 9) keeps holding or gaining impressions, it's a candidate for a title tweak or content refresh to push it onto page 1 — same logic flagged for the water-polo safety page on 6/22.

## What moved

Clicks: 0 last 7 days vs 0 prior 7 days. Impressions: 5 vs 7. Average CTR: 0% both windows. Average position: 12.6 vs 4.9.

The position swing looks bad but it's not a real decline — it's which pages showed up. Last window's impressions came from higher-ranking pages (a camp page at 2.5, another at 5.5, another at 13). This window, those same pages had zero impressions, replaced by five different camp/body pages ranking lower (9, 9, 9, 10, and one at 26). This is consistent with how the Nike camp listing pages rotate as event dates approach and pass — not a site-wide ranking drop. Total impressions are still single digits either way; the property remains data-thin.

## The queries

Still no query-level data. Both the 7-day and prior-7-day query tables come back empty — every search is below Google's anonymization threshold. Same finding as every review since launch. Revisit once impressions climb.

## Pages worth a look (position 8-15)

Five pages had impressions this window; four sit in the 8-15 band:

- /body/transporting-other-peoples-kids/ — position 9, 1 impression (new)
- /camps/nike-baseball-camp-at-adelphi-university-july-27-30-2026/ — position 9, 1 impression (new)
- /camps/nike-soccer-camp-in-west-seattle-all-skills-iii-july-20-24-2026/ — position 9, 1 impression (new)
- /camps/nike-baseball-camp-at-edgewood-university-aug-10-13-2026-9i81/ — position 10, 1 impression (new)

A fifth page, /camps/nike-soccer-camp-at-carroll-university-july-13-17-2026-irtf/, showed up at position 26 — outside the band, not actionable yet.

The transporting-other-peoples-kids page is the one worth tracking: it's a "body" section page (not a dated camp listing), so unlike the camp pages it won't age out and can be expanded with real content if it keeps showing up.

## Indexing and sitemap

Two sitemaps now, both submitted and last read Jul 5, both status Success: sitemap.xml (index, 2,932 discovered pages) and a new sitemap-camps.xml (1,059 discovered pages). No processing errors on either. Discovered-page count on the main index sitemap is down from 3,261 on 6/22 — worth noting but not itself an error.

Coverage: 288 pages indexed (down from 390), 1,427 not indexed across 7 reasons (down from 2,820 across 8). Breakdown: Crawled – currently not indexed (1,206, up from 1,105), Duplicate with Google-chosen canonical (40, was 39), Alternate page with proper canonical (94, was 93), Not found/404 (53, up sharply from 15), Blocked by robots.txt (31, was 30), Page with redirect (2, unchanged), Soft 404 (1, unchanged), and Discovered – currently not indexed (0, down from 1,539).

That last one is the biggest shift: the "discovered but not yet crawled" backlog essentially cleared out, while indexed pages actually dropped and "crawled — not indexed" grew. Read together, this looks like Google worked through the backlog of discovered URLs and made indexing decisions on them — mostly deciding not to index (yet), which is normal for a site this size, but the size of the swing is bigger than a typical week and worth keeping an eye on next review rather than a one-time note.

## Errors needing action

Nothing critical on parentcoachdesk.com itself. Security issues: none detected.

The 404 jump (15 → 53) is the one item worth checking by hand — see recommended action #1.

Same flag as last review, still unresolved: parentcoachplaybook.com (the old domain, mid-move via Change of Address) has 3 of its 4 robots.txt file variants showing "Not Fetched – N/A" as of this check (http://parentcoachplaybook.com/robots.txt, https://parentcoachplaybook.com/robots.txt, https://www.parentcoachplaybook.com/robots.txt). Only http://www.parentcoachplaybook.com/robots.txt fetched successfully, last checked 6/12. Low priority since it's the source domain mid-migration, but worth a look if the domain move needs to keep passing signal cleanly.

## Content ideas

Still nothing new to mine from query data. The camp pages continue to be the ones pulling impressions, which fits the current build. Once query data starts unlocking (past the anonymization threshold), that's when retitle/content-gap ideas become actionable — not yet.
