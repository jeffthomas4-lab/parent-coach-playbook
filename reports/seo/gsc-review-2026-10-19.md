# GSC Review, parentcoachdesk.com

**Date:** 2026-10-19
**Window:** last 7 days vs prior 7 days (GSC compare view does not print ranges; data ends Oct 17, so likely Oct 11-17 vs Oct 4-10)
**Prior file:** `reports/seo/gsc-review-2026-10-05.md` (the 2026-10-12 run was a loud skip, so deltas are two weeks)
**Mode:** report-only (Class A, maintenance mode Aug-Nov). Kill switch: `nora` = active in `forge-command` D1 `agent_registry`. No site fixes, no outreach drafts.

## Takeaways

This week needs eyes. Page Indexing refreshed (last update **Oct 11**, first refresh since Sep 20) and indexed pages fell **56 -> 2**. Not indexed rose **3,032 -> 3,140**. "Crawled - currently not indexed" grew **1,512 -> 1,603**, and a validation on it was started Oct 12 and **failed** the same day.

The new crawled-not-indexed examples are core hubs, crawled Oct 12: `/camps/`, `/decisions/`, `/drive-home/`, `/game/`, `/team-parent/`, `/body/`, `/drive-there/`. All return 200 live, self-canonical, no `noindex` meta, no X-Robots-Tag, and robots.txt allows them. So this is Google declining to index, not a block on our side.

The split sitemaps from PR #100 (Oct 12) were submitted Oct 12. Pages (140), tips (577) and camps (111) read Success. **`sitemap-articles.xml` shows "Couldn't fetch" with no last-read date.** Live today it returns 200, valid XML, 207 KB, 1,378 URLs, and also 200 to a Googlebot user agent. That points to a one-time fetch failure that GSC has not retried, which leaves the 1,378 article URLs, the bulk of the site, outside a working sitemap.

Traffic is still noise: 0 clicks, 3 impressions both weeks. External links fell 3 -> 1 (still only the retiring parentcoachplaybook.com).

Timing note: the Oct 11 indexing snapshot predates the Oct 12 PR #100 deploy (noindex on thin hubs and `/search/`, wrong-section 301s), so #100 did not cause the 56 -> 2 drop. Hunch, not confirmed: Google is judging the site as a whole thin (about 3,100 known URLs, most of them camp listings and filtered variants, against a handful of articles with any signal).

## What moved

| Metric | Last 7 days | Prior 7 days | 10/05 report (L7) |
| --- | --- | --- | --- |
| Clicks | 0 | 0 | 0 |
| Impressions | 3 | 3 | 6 |
| Avg CTR | 0% | 0% | 0% |
| Avg position | 4 | 1 | 1.5 |

Longer windows: last 28 days (Sep 20-Oct 17) 0 clicks / 14 impressions / position 17.3. Three months (Jul 18-Oct 17) 1 click / 32 impressions / 3.1% CTR / position 15.

## Pages worth a look

| Page | Impr. L7 / P7 | Live check |
| --- | --- | --- |
| `/` | 3 / 3 | 200 |
| `/body/bus-and-banquet-conduct/` | 0 / 1 | 200 |
| `/drive-home/when-the-cuts-list-goes-up/` | 0 / 1 | 200 |
| `/camps/nike-baseball-camp-at-boise-state-university-day-camp-june-15-18-2026-ycif/` | 0 / 1 | 301 (expired policy, per 10/05) |

## The queries

7-day and 28-day Queries tab: no data (anonymized). 3-month view still shows only `youth football parent meeting agenda` (0 clicks / 2 impressions).

## Indexing and sitemap

Indexed: **2** (was 56). Not indexed: **3,140** across 8 reasons. Last update **Oct 11**.

| Reason | Validation | Pages | vs 10/05 |
| --- | --- | --- | --- |
| Crawled - currently not indexed | **Failed** (10/12) | 1,603 | +91 |
| Discovered - currently not indexed | Started | 1,361 | +53 |
| Not found (404) | Started (10/12) | 122 | +1 |
| Blocked by robots.txt | Not Started | 31 | flat |
| Page with redirect | Not Started | 10 | +2 |
| Alternate page with proper canonical tag | Not Started | 7 | -29 |
| Duplicate, Google chose different canonical | Not Started | 5 | -10 |
| Soft 404 | Not Started | 1 | flat |

### 404 examples

Same ten expired camp slugs as 10/05 (Gettysburg volleyball, Reno soccer, Seattle U baseball, Ridgefield soccer, Lipscomb tennis and others), last crawled Aug 3-Sep 4. On 10/05 these all 301'd to a hub; no new 404 examples, so no policy gap. The 404 count is old crawl data with a validation now running.

### Crawled-not-indexed examples

New this cycle: the section hubs listed above (crawled Oct 12) plus `/camps/` itself. Also a Portland beach volleyball camp slug (Oct 13), a `cost-calculator/?sport=choir` filter variant, and an expired Webster camp slug. Live spot-checks: `/`, `/camps/`, `/decisions/`, `/drive-home/`, `/body/` all 200, self-canonical, indexable.

### Sitemaps (GSC UI)

| Sitemap | Status | Discovered | Last read |
| --- | --- | --- | --- |
| `sitemap.xml` (index) | Success | 2,200 | Sep 26 (resubmitted Oct 12) |
| `sitemap-pages.xml` | Success | 140 | Oct 12 |
| `sitemap-articles.xml` | **Couldn't fetch** | 0 | none |
| `sitemap-tips.xml` | Success | 577 | Oct 12 |
| `sitemap-camps.xml` | Success | 111 | Oct 12 |

Live today: index lists pages (140) + articles (1,378) + tips (577) + camps (108) = 2,203 URLs. The old `sitemap-content.xml` still serves 200 with 2,058 URLs but is no longer in the index.

## Links

External: **1** (parentcoachplaybook.com to `/`, was 3). Internal: **3** (was 14). No third-party backlinks.

Core Web Vitals: not enough CrUX field data on mobile or desktop (updated Oct 16).

## Errors needing action

1. `sitemap-articles.xml` "Couldn't fetch" in GSC while it serves fine live. Dashboard-only fix.
2. Indexed 56 -> 2 with a failed crawled-not-indexed validation. Watch the next refresh; if it stays near zero, scope a content-quality session.

## Single highest-impact fix this week

Resubmit `sitemap-articles.xml` in Search Console so Google can read the 1,378 article URLs. Steps for Jeff: Search Console > parentcoachdesk.com > Indexing > Sitemaps > in "Add a new sitemap" enter `sitemap-articles.xml` > Submit. Then URL Inspection on `https://parentcoachdesk.com/` and one strong article (for example `/drive-home/when-the-cuts-list-goes-up/`) and click Request indexing. Low effort, and it removes the one fault on our side of the indexing drop. A deeper thin-content pass (more noindex on camp listings and filtered variants) is a future session, not this week, given maintenance mode.

## Run notes

- Kill switch confirmed active (`nora`, `last_run_at` still 2026-08-10 UTC).
- Report-only held. Only write: this report.
- Raw capture on box: `/workspace/gsc-nora-2026-10-19/` (8 PNG + TXT pairs).
- Agent-run logging: `PCD_AGENT_RUNS_TOKEN` absent from DESKTOP Shell env again. Preflight not run; no D1 `agent_runs` row.
