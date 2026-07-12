# Organic Search Audit: parentcoachdesk.com

**Date:** 2026-07-12
**Question this answers:** why is organic search traffic so low.
**Scope:** read-only on the site repo this session. Every finding here gets fixed in a later session, not this one.
**Data sources:** live Google Search Console (sc-domain:parentcoachdesk.com, pulled today via browser), live page fetches of the real site, `site:` search, query-demand and competitor searches, the repo's own `gsc-reviews/`, `SEO-RECOVERY-PROGRESS.md`, and `astro.config.mjs` / `public/` config. Numbers are from those sources. Nothing here is invented; where a number could not be verified live it is named as such.

---

## The one-paragraph answer

Organic traffic is near zero because the site is, for search purposes, one month old with no authority and almost nothing indexed that anyone searches for. The Search Console property was created June 10, 2026, and the old domain it replaced was allowed to die without redirects, so no prior link equity carried over. Google has crawled most of the site and chosen not to index it: 288 pages are indexed against 1,427 that are not. The site has zero external backlinks on record, so there is no signal telling Google to rank it. The traffic bet that is live, thousands of thin, scraped camp listings, mostly does not get indexed and expires into 404s, including the single best page the site ever had. None of this is a technical-SEO failure. The plumbing is good. The site is young, unlinked, and partly pointed at the wrong pages.

---

## What the numbers say (live GSC, pulled 2026-07-12)

| Metric (last 3 months) | Value |
|---|---|
| Clicks | 0 |
| Impressions | 35 |
| Average CTR | 0% |
| Average position | 7.7 |
| First day with data | ~June 9, 2026 |
| Query rows available | 0 (every query below Google's anonymization threshold) |
| Manual actions | None |
| Core Web Vitals (mobile) | Not enough field data to report |
| External backlinks (GSC Links) | 0 |
| Internal links counted (GSC Links) | 0 (see note) |

Top pages by impressions over the window, every one at 0 clicks:

| Page | Impressions | Note |
|---|---|---|
| /camps/soccer-camp-full-day-at-sera-sports-complex/ | 7 | **Now returns 404.** Verified live today. |
| / (homepage) | 6 | Indexed, healthy title and canonical |
| /body/heat-cramps-protocol/ | 5 | Real evergreen content, can be grown |
| www.parentcoachdesk.com/camps/submit/ | 3 | Served on www, not the bare domain |
| /scripts/after-a-win/ | 3 | Evergreen |
| /scripts/before-a-game-5-7/ | 3 | Evergreen |
| www.parentcoachdesk.com/scripts/after-a-bad-game/ | 3 | Served on www, not the bare domain |

Note on internal links reading 0: the site clearly carries heavy internal linking (nav, footer, the completed internal-linking sprint), confirmed by crawling the pages today. GSC showing 0 is a freshness artifact of a young property whose link graph Google has not finished building, not an actual absence of internal links. The external 0, by contrast, matches reality: no one is linking to the site yet.

### Indexing, the core of the story

Google's Page Indexing report (last updated 6/29/26): **288 indexed, 1,427 not indexed** across these reasons.

| Reason not indexed | Pages | What it means here |
|---|---|---|
| Crawled – currently not indexed | 1,206 | Google fetched the page and decided it was not worth indexing. This is a quality and authority verdict, and it is the whole game. |
| Alternate page with proper canonical | 94 | Expected. Mostly the www duplicates and paginated or filtered variants. |
| Not found (404) | 53 | Up from 15 on June 15. Expired camp listings turning into dead pages. |
| Duplicate, Google chose different canonical | 40 | Mostly www vs bare-domain overlap. |
| Blocked by robots.txt | 31 | Intentional: /go/, /admin/, /api/. Correct. |
| Page with redirect | 2 | Fine. |
| Soft 404 | 1 | Watch, not urgent. |
| Discovered – currently not indexed | 0 | Was 1,539 in June. The crawl backlog cleared, and most of it landed in "crawled, not indexed" above. |

Two sitemaps, both submitted and both reading Success as of Jul 9: the index at 3,024 discovered URLs and sitemap-camps.xml at 1,056. Submission is not the problem. Google can find the pages. It is choosing not to keep most of them.

---

## Why traffic is low, ranked by impact

Ranked by how much each one holds traffic down, against how hard it is to move.

| # | Root cause | Impact | Effort to move | Type |
|---|---|---|---|---|
| 1 | Domain is one month old with zero inherited authority; the old domain died with no 301s, so all prior link equity was thrown away | Highest | High / slow | Authority + time |
| 2 | Zero external backlinks. Nothing tells Google the site is worth ranking | Highest | High | Authority |
| 3 | Index starvation: 1,206 pages crawled and refused. Google's quality read on thin pages from a new domain | High | Medium | Content quality |
| 4 | Traffic bet rides on ephemeral, duplicative camp pages that mostly do not index and 404 on expiry | High | Medium | Strategy |
| 5 | The pages that could earn durable clicks target head terms owned by high-authority commercial sites; small hygiene leaks shave the little CTR available | Medium | Low to Medium | Positioning + hygiene |

### 1. The domain is new and starts from zero

This is the dominant cause and the least satisfying one, because the fix is mostly time. The GSC property was created June 10, 2026. The performance chart has no data before June 9. A brand-new domain earns Google's trust slowly, and this one earns it from a standing start because the predecessor, parentcoachplaybook.com, was allowed to go dark. Fetched live today, parentcoachplaybook.com returns nothing. It is not 301-redirecting to the new domain. Google's Change of Address tool needs live 301s on the old URLs to pass authority, so any links, age, or ranking the old domain had are gone rather than inherited. Letting the old brand die was a deliberate call (logged in `SEO-RECOVERY-PROMPT.md`), and it is defensible as a branding decision. The search cost of that decision is real: the site is not a rebrand that kept its history, it is a new site with none.

### 2. No backlinks means no ranking signal

The GSC Links report shows External links: Total 0. A separate web search for the brand surfaced no coverage, mentions, or links. This is the authority problem stated as a single number. Google ranks pages in large part on who vouches for them, and right now nobody does. A new domain with strong content and zero links is exactly a site that shows up at position 7 for a handful of searches and gets no clicks, which is precisely what the data shows. Until real links arrive, from parents, coaches, local press, the governing bodies the site already cites, or the author's own reveal, rankings will not climb no matter how good the pages are.

### 3. Google crawled the site and declined to index most of it

1,206 pages sit in "Crawled – currently not indexed." That status is Google saying it saw the page and judged it not worth a slot. On a young, unlinked domain, that judgment falls hardest on pages that look thin or templated, and the camp listings are both. This is not a bug to fix with a setting. It lifts as authority grows and as the indexed pages are the ones a human would actually want. The lever the site controls here is quality and focus: fewer, better, more distinct pages earn indexing faster than thousands of near-identical ones.

### 4. The camp strategy churns instead of compounding

The camp pages are the site's main impression earner and its biggest liability at the same time. Verified live today: future-dated camps render full server-side content, so they are not JavaScript shells and Google can read them. But the content is scraped Nike and ASA marketing boilerplate, near-identical across listings and duplicated from the original source (ussportscamps.com), which is exactly the profile Google refuses to index. Worse, the pages expire. The single best page the site ever had, /camps/soccer-camp-full-day-at-sera-sports-complex/ at 7 impressions, returns a bare "Not found" today. That is why the 404 count climbed from 15 to 53 in a month. The camp system generates thousands of URLs, gets most of them refused, ranks a few, and then lets the winners rot into 404s. It is a treadmill, not an asset that grows.

### 5. The durable pages aim at terms bigger sites own, and small leaks cost the rest

The pages that could earn steady clicks, the gear guides, the cost calculator, the scripts, are genuinely good. The baseball gear guide read live today is long, age-segmented, opinionated, and honest, which is close to what Google's product-review guidance rewards. The trouble is the target queries. "Youth baseball gear list" and "how much does travel baseball cost" are owned by Dick's Sporting Goods, Baseball Monkey, FieldDay, and a wall of high-authority commercial sites. Even indexed, a new site sits at position 8 to 18 there and gets nothing. The more winnable ground is the emotional long-tail the site is built for ("what to say on the drive home," "rec vs travel at 10"), where the competition is softer and the voice is the differentiator, though even that space has established names like Psychology Today and CoachUp. On top of positioning, small hygiene leaks bleed the little CTR available: some indexed camp titles carry mojibake ("July 6ΓÇô10" instead of an en dash), the www and bare domain both return 200 rather than the www 301-redirecting to canonical, and the newsletter call-to-action and a contact email still point at the dead parent-coach-playbook brand.

---

## What is actually built well

Worth saying plainly, because it changes what to do next: the technical SEO is not the problem. Fetched and checked live this session, the site has clean self-referential canonicals, correct www-to-canonical canonical tags, a full set of Open Graph and Twitter tags, JSON-LD via dedicated Article, FAQPage, and HowTo schema components across articles, gear guides, body pages, and camps, a robots.txt that allows crawlers and references the sitemap, two healthy sitemaps, a solid security-header and CSP baseline, and expired camps that return a real HTTP 404 rather than a soft 404. Titles and meta descriptions are unique and within length on the pages checked. This is a well-built site with no authority and a partly-wrong content bet, which is a much better problem to have than a broken site, because the fixes compound once authority starts to arrive.

---

## The fix plan: 30 / 60 / 90 days

Each item is sized to fit one working session. Ordered so the highest-impact, lowest-effort work lands first. Nothing here was executed this session.

### Days 0 to 30: stop the bleeding and start earning links

| Session | Fix | Why | Root cause |
|---|---|---|---|
| 1 | Fix the mojibake in camp titles and descriptions (the `ΓÇô` encoding bug from the ussportscamps scrape) and redeploy | Broken titles are live in the index and kill the little CTR the camp pages get | 5 |
| 2 | Add a www-to-bare-domain 301 redirect so only one host serves 200 | Removes the www duplicates from the "alternate/duplicate canonical" buckets and consolidates signal | 5 |
| 3 | Purge the last dead-brand leaks: point the newsletter CTA and the contact email at a live parentcoachdesk.com destination | The homepage and every camp page still send readers to a dead Kit subdomain and an old-brand Gmail | 5 |
| 4 | Decide the camp-page policy: expired camps should 301 to the relevant /camps/[state]/ or /sports/ hub, not 404 | Stops the best pages from rotting into dead ends and keeps any earned signal on the site | 4 |
| 5 | Stand up the author reveal and a first outreach push using `strategy/AUTHOR-REVEAL-CHECKLIST.md` (15 targets already drafted) | The only lever that moves cause 1 and 2 is real links; this is the first swing at them | 1, 2 |

### Days 30 to 60: earn indexing on the pages that deserve it

| Session | Fix | Why | Root cause |
|---|---|---|---|
| 6 | Rewrite the camp template to add real, non-scraped value per listing (a parent-facing "what to know," a cost line, a nearby-alternatives block) so pages stop reading as duplicates | Distinct content is what moves pages out of "crawled, not indexed" | 3, 4 |
| 7 | Thin the camp footprint: stop publishing listings that carry only scraped boilerplate; keep the ones with added value | Fewer, better pages index faster than thousands of near-identical ones | 3, 4 |
| 8 | Grow the three evergreen pages already earning impressions (heat-cramps-protocol, the scripts) into fuller, better-linked pieces | These already rank; depth and internal links push them toward page one | 3, 5 |
| 9 | Ship the Pinterest launch from `strategy/PINTEREST-LAUNCH-KIT.md` (30 pins already written) | A referral and discovery channel that does not depend on Google's trust timeline | 2 |
| 10 | Wire the Kit welcome and drip sequence (prep already in `kit-emails/`) so traffic that does arrive converts and returns | Email turns one-time search visitors into a durable audience, which lowers dependence on rankings | 2 |

### Days 60 to 90: pick winnable ground and measure

| Session | Fix | Why | Root cause |
|---|---|---|---|
| 11 | Map the ten highest-intent long-tail queries the site can realistically win (drive-home, rec-vs-travel, cost-per-sport) and align titles and first paragraphs to them | Chasing head terms owned by Dick's wastes the authority the site is slowly earning; long-tail is where a new site wins first | 5 |
| 12 | Build two or three genuinely linkable assets (the cost calculator is one; a "real cost of travel [sport]" data piece is another) and pitch them to the outreach list | Tools and data earn links in a way blog posts rarely do | 2 |
| 13 | Re-pull GSC (queries should start unlocking once impressions clear the threshold) and rebuild the target-query map from real data instead of guesses | The first real query data is the signal for what to write next | 3, 5 |
| 14 | Full re-audit against this file: recount indexed vs not-indexed, backlinks, and the 404 trend, and update the SEO row in STANDARD-AUDIT.md | Confirms the plan is working or names what still is not | all |

### The honest expectation

Nothing in the first 30 days produces a traffic jump, and that is not a sign the plan failed. Causes 1 and 2, age and links, set the ceiling, and they move over months, not weeks. The 30-day work stops active losses and plants the first links. The 60-day work earns indexing on pages worth having. The 90-day work points the earned authority at queries the site can actually win. The leading indicators to watch, in order, are: indexed count climbing back above 288, the first non-zero external backlink appearing in GSC, query rows unlocking in the performance report, and only then, clicks.

---

## Open data points this audit could not close

- **Internal links = 0 in GSC.** Almost certainly a young-property freshness artifact, not a real absence. Re-check on the day-14 GSC pull.
- **Live Lighthouse mobile numbers (LCP/CLS/INP).** GSC has no field data because traffic is too thin, so Core Web Vitals could not be graded from real users. A lab run against the deployed site would close it. This is the same open item as STANDARD-AUDIT #9.
- **Exact backlink count from a third tool.** GSC External = 0 is authoritative for what Google counts. A free check (e.g. Ahrefs Webmaster Tools) would confirm whether any uncounted links exist.

---

## Mirror and tracking

- **Notion mirror:** the brief asks to mirror this under the "PCD Command Center" page once V2 creates it. That page does not exist in the workspace yet (closest is the existing "ParentCoachDesk.com" page). Mirror is deferred until the Command Center page is created, then this file's content copies there.
- **STANDARD-AUDIT.md:** the SEO row and open item #10 get a one-line pointer to this file (done this session).
