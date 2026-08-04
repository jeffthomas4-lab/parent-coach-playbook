# Directory index policy, 2026-08

**Agent:** Dex (`pcd-directory-index-policy`)
**Run date:** 2026-08-03 (preview pass, ahead of the scheduled cron), with a verification addendum from the actual scheduled fire on 2026-08-04. See the addendum at the bottom for what changed between the two (short answer: nothing in the data, GSC is still frozen).
**Prior Dex report:** none. This is run 1 for the August cycle, so every trend below is measured against Nora's GSC reviews, not against me.
**Raw capture:** `reports/seo/data/2026-08-03-dex-gsc-capture.json`, `reports/seo/data/2026-08-03-dex-camp-differentiation-sample.json`
**Data source:** Google Search Console UI via Claude in Chrome. `scripts/seo/pull-gsc.mjs` still does not exist, so the fallback path in my task prompt is the path I took.

---

## 1. The ratio

| | Jul 12 | Jul 20 | Jul 28 | Aug 3 (this run) |
|---|---|---|---|---|
| Indexed pages | 288 | 228 | 90 | **90** |
| Not indexed (total) | 1,427 | ~1,503 | ~2,880 | **~2,880** |
| Crawled, not indexed | 1,206 | 1,261 | 1,429 | **1,429** |
| Discovered, not indexed | 0 | 0 | 1,208 | **1,208** |
| Sitemap URLs (GSC index) | 3,024 | 2,479 | 2,455 | **2,310** |

**Ratio: 90 accepted out of 2,310 submitted. 3.9 percent.**

The ratio did not move. Neither did any of the eight not-indexed buckets. All eight are identical to the numbers Nora reported on July 28, to the page.

That is because **the Page Indexing report has not refreshed since July 23.** The dashboard stamp reads `Last update: 7/23/26` today, August 3. Eleven days. Normal GSC lag is one to three.

This matters more than the flat numbers do. The July 28 review presented 90-indexed as that week's news; it was already five-day-old data at the time. So the real published history is: 288 (Jul 12) → 228 (Jul 20) → 90 (Jul 23) → **no observation since**. Nobody knows what the index count has done for eleven days, and the escalation thresholds proposed in `SEO-OS-ARCHITECTURE.md` section 6 cannot fire against a frozen dashboard.

One thing did move, and it moved through a different report that is current. The Sitemaps page was last read July 31 and shows **2,310 URLs** in the index sitemap, down from 2,455, and **311** in `sitemap-camps.xml`, down from 480. I fetched both sitemaps live today: 2,002 content URLs and 218 camp URLs, 2,220 total. So publishing volume is falling fast, mostly through camp pruning, and Google has not caught up.

**Trend verdict: unmeasurable this month, through no fault of the site.** The ratio number I am reporting is the same number as last month because it is literally the same observation.

---

## 2. Attribution by template

This is the part that changes the picture.

### Crawled, currently not indexed (1,429)

Sample: 493 URLs, from the 1,000 examples GSC exposes, sorted by last-crawled descending. Not alphabetical, so this slice is broadly representative of the bucket.

| Template | In sample | Share | Extrapolated to 1,429 |
|---|---|---|---|
| `/camps/` listing + state hub | 215 | 43.6% | ~623 |
| `/coaching-tips/` | 99 | 20.1% | ~287 |
| `/body/` | 64 | 13.0% | ~186 |
| `/drive-home/` + `/drive-there/` + `/team-parent/` + `/game/` (articles) | 79 | 16.0% | ~229 |
| everything else (what-to-buy, sports, scripts, rules, pathways, decisions, recruiting, adaptive, resources, season-calendar, cost-calculator) | 36 | 7.3% | ~104 |

Camps break down as 195 listings, 18 state hubs, 1 deeper page.

**So camps are the largest single template in the largest not-indexed bucket, at roughly 44 percent.** My own charter says the camps directory is "both the largest page-count source and the largest not-indexed source." Half of that is now wrong and needs correcting in `SEO-OS-ARCHITECTURE.md`: camps are the largest *refusal* source but they are no longer the largest *page-count* source. 218 camp URLs are live today against 2,002 content URLs. Camps are 9.8 percent of what the site publishes and 44 percent of what Google crawls and declines.

There is a second reading of that gap worth stating plainly. Roughly 623 camp URLs sit in crawled-not-indexed while only 218 camp URLs are published. Google is holding refusals on around 400 camp URLs the site no longer serves. The 410/301 expired-camp policy in `camps-db.ts` is working (Nora confirmed five live on July 28), but the churn is large enough that the directory's index footprint is mostly memory of pages that are gone.

### Discovered, currently not indexed (1,208)

Sample: 500 URLs sorted alphabetically ascending, which covers `/adaptive/` through `/drive-there/first-season-of-cross-country/` and nothing after the letter d. **This slice cannot be extrapolated** and I am not going to pretend otherwise. What it does establish is section 3.

| Template | In sample (a–d only) |
|---|---|
| `/coaching-tips/` | 323 |
| `/drive-home/` | 85 |
| `/drive-there/` | 48 |
| `/body/` | 23 |
| `/adaptive/` | 10 |
| `/decisions/` | 9 |
| `/camps/` | 1 |

The one durable finding: camps are essentially absent from the discovered-not-crawled bucket. Camp URLs get crawled and then refused. Content URLs get discovered and then ignored. Those are two different failures and they need two different fixes.

---

## 3. The `/adaptive/` question, closed

Open since 2026-07-28. Closing it now with an answer neither of the two proposed options predicted.

**The premise was wrong.** The July 28 review reported that the 1,208 pages in "Discovered - currently not indexed" were the `/adaptive/` content silo. They are not. The `/adaptive/` collection contains **18 markdown files**, and the sitemap carries **19** `/adaptive/` URLs including the index. It cannot account for 1,208 of anything.

What happened: the GSC examples table for that bucket sorts alphabetically, `/adaptive/` sorts first, and the visible top of the list is entirely adaptive URLs. It was a sampling artifact. In my 500-row slice, exactly **10** `/adaptive/` URLs appear.

**Now the real answer, in two parts.**

**Part one, on timing.** The silo is not new. Four files landed 2026-05-03 (commit `6e6eddc6`) and fourteen landed 2026-06-12 (commit `a12f542d`, "Add 250 batch content files and 60 parent-coach cornerstone articles"). GSC records the bucket's **first detected date as 6/12/26**, which is the same day as that 250-file batch. So the 1,208 is that content batch and its successors, not the adaptive section, and it has been sitting uncrawled for **seven and a half weeks**. A crawl backlog that has not drained in seven weeks is not a backlog. It is a crawl-budget ceiling on a two-month-old domain with zero external backlinks, which is exactly what root causes 1 and 2 in `ORGANIC-SEARCH-AUDIT.md` predict.

**Part two, on orphaning, and this one is a real defect.** `/adaptive/` is in the sitemap and in `/search`. It is **not in the NavBar and not in the Footer.** I checked every `href` in `NavBar.astro`, `Footer.astro`, and the layouts: `/body`, `/camps`, `/coaching-tips`, `/decisions`, `/news`, `/pathways`, `/recruiting`, `/rules`, `/scripts`, `/season-calendar`, `/sports`, `/reads`, `/tools` and about twenty more are all there. `/adaptive` is not. The only files that reference the path are the collection config, the publish helper, the two page templates, two admin routes, the search page, and the sitemap builder.

So the silo has been live for three months with zero navigational internal links. That is the same class of failure as open item #32, where all 17 Ultimate Parent Guides shipped live and invisible. The sitemap drift guard added on 2026-07-31 catches a collection missing from the *sitemap*. Nothing catches a collection missing from the *navigation*.

**Recorded. Stop re-asking.** Open item 1 in `SEO-OS-ARCHITECTURE.md` section 12 and item 6 in section 10 can both be closed with this answer.

---

## 4. Differentiation scoring, 50 camp pages

Sample: every 4th URL from the live `sitemap-camps.xml`, 50 of 218, a 23 percent sample. All 50 returned 200. Fetched with a self-identifying agent at 0.6s spacing, own domain only.

The scoring question is the one my charter sets: does this page carry anything a parent would want that the source site does not already have?

### What a camp page actually contains

A representative page (`/camps/nike-soccer-camp-at-university-of-wisconsin-parkside-aug-3-6-2026/`, 340 words) is:

- A 227-word "About this camp" block that is **the provider's own marketing copy, verbatim**. It opens "Give your young athlete an unforgettable week of soccer development and fun this summer" and includes a pull quote from the head coach. That text is on the provider's page.
- Normalized fields: format, skill level, spots, listed price, age band, exact dates, address, map link, provider link.
- A logistics line: "Bring lunch. No aftercare."
- A footer: "Listing reviewed by the Parent Coach Desk on July 5, 2026," plus a correction link.

### What the sample says about each of those

| Signal | Result across 50 |
|---|---|
| Logistics line "Bring lunch. No aftercare." | 46 of 50 |
| Any variant of that line ("Aftercare available", "Lunch included") | 50 of 50 |
| "Listing reviewed by the Parent Coach Desk on ..." | 50 of 50 |
| ... but dated **July 5, 2026** | 35 of 50 |
| ... or **July 13, 2026** | 11 of 50 |
| Parent reviews on the listing | **0 of 50** |
| "Other camps at this address" cross-listing | 31 of 50 |
| Sport-specific equipment guidance block | 13 of 50 |
| Raw category token (`Camp_sports`, `Other`) visible in the breadcrumb and UI | **27 of 50** |
| "ages not provided" | 7 of 50 |
| About block under 40 words | 9 of 50 |
| Listed price present | 43 of 50 |
| Page word count, median | 227 |

Three of those rows are the finding.

**The logistics line is a template, not editorial judgment.** It renders on 50 of 50 pages from three field values. It is not a human note. On a Boys & Girls Club **free summer meals** listing, the page says "Bring lunch." That is not a differentiation asset, it is a correctness bug, and it belongs to Ranger.

**The verification stamp is a bulk stamp.** 46 of 50 carry one of two dates. "Reviewed on July 5" on 70 percent of the directory is a batch operation being presented to parents in the voice of an individual editorial review. It is the single most trust-bearing line on the page and it is the least earned.

**The category token leaks on 27 of 50 pages.** `Camp_sports` appears in the breadcrumb and the subtitle, in raw database-enum form. This is the 59-percent-generic-category problem already documented in the `[slug].astro` redirect comment, surfacing in the UI rather than staying in the data layer.

### Scores

Rubric (traceable per-page in `reports/seo/data/2026-08-03-dex-camp-differentiation-sample.json`): +20 complete normalized record, +20 cross-listing at address, +15 sport gear layer, +15 substantive description, +10 verification stamp; −15 category token in UI, −15 description under 40 words, −15 title is a scraped fragment, −10 ages not provided.

| | |
|---|---|
| Median | **40** |
| Mean | 41.1 |
| Range | 0 to 80 |
| Distribution | 0–29: 8 pages · 30–39: 16 · 40–59: 17 · 60–79: 5 · 80: 4 |

Nothing scored above 80. The ceiling exists because no page in the directory carries a parent review, and the prose on every page belongs to somebody else.

---

## 5. Keep, improve, pull

**Keep (score ≥ 60): 9 of 50, ~18 percent.** Complete records with a real price, a real age band, sport-specific gear guidance, and cross-listings at the same address. These earn their slot: a parent comparing four Nike soccer weeks in one metro gets something from the normalized view that four provider tabs do not give them.

**Improve (35–59): 23 of 50, ~46 percent.** Every one of these is fixable without touching the camp record, because the defects are template defects:

1. **Stop rendering the raw category token.** Map `camp_sports`, `camp_general`, `other` to a human label or suppress the line. Fixes 27 of 50 pages, one template edit, no data change.
2. **Make the review stamp honest.** Either show the date the record was last verified against the source, or drop to "Listing on file since ..." Do not present a bulk pass as an individual review.
3. **Extend the equipment block to every sport.** It runs on 13 of 50. It is the strongest genuinely-PCD layer on the page and it is missing from three quarters of the directory.
4. **Suppress the logistics line when the underlying fields are unknown or contradictory.** "Bring lunch" on a free-meals program is the tell.

Those four changes move most of the improve tier over 60 without adding a word of new content.

**Pull from the sitemap (< 35): 18 of 50, ~36 percent.** And here I want to stop and hand something to you rather than recommend it.

---

## 6. The threshold, and why I am not giving you a number yet

My charter says propose a publish threshold with evidence. Here is the evidence that changes the proposal.

I grouped the 50 by provider type:

| Provider type | n | Median score | Range |
|---|---|---|---|
| Commercial brand (Nike / US Sports Camps) | 31 | **40.0** | 20–80 |
| Community and nonprofit (Boys & Girls Clubs, YMCA, parks and rec, youth clubs, arts, disability-serving) | 8 | **17.5** | 0–55 |
| Other | 11 | 35.0 | 30–65 |

**The differentiation score is tracking the provider's marketing budget, not the page's usefulness to a parent.** Nike writes 227 words of polished copy with a coach quote, publishes a clean price and a clean age band, and the page scores 80. A county club that publishes a two-line PDF and no age band scores 0 — for a free program, which is the thing a family under financial pressure most needs to find.

Applying a naive threshold would systematically delist free programs, community programs, and disability-serving programs, and keep the ones with the best ad copy. In the sample, all three listings that are free, adaptive, or serving medically fragile kids fell in the bottom four. Pulling them would make the directory measurably worse for the parents PCD exists for, while improving a Google metric.

**So the threshold needs two numbers, not one, and both are yours to set:**

- **Proposed commercial threshold: 45.** Below 45, a commercial-provider listing is reproduced marketing copy with a name and a date, and does not earn a public URL. In this sample that gates roughly a third of the commercial listings.
- **Proposed community and nonprofit threshold: none. Publish, and fix the template.** A thin page for a free program is a page PCD should be *enriching*, not withholding. The right response to a two-line source is for PCD to add the ages, the cost, and the logistics the source omitted, which is real differentiation and the only kind the directory can honestly claim.

I am flagging this rather than deciding it. It is decision 5 in `SEO-OS-ARCHITECTURE.md` section 10 ("the single biggest lever on the index ratio"), and my charter says an agent should not pick how many pages the site stops publishing. It says nothing about an agent noticing that the obvious version of that lever has an equity problem, so I am saying it here.

**Related recommendation, no threshold needed:** the ~400 camp URLs in crawled-not-indexed that no longer resolve to a live listing are index debt from directory churn, not a quality problem. They are already 410ing or 301ing correctly. Leave them alone and let them age out. Do not request removal, do not add redirects.

---

## 7. What I did not do, and open items

- **No writes.** No camp record touched, no `pcd_status` changed, no sitemap edited, no redirect, no `noindex`, no `robots.txt` change. Report only, per Class A/B.
- **Agent run not logged.** `scripts/agent-run-client.mjs` requires `PCD_AGENT_RUNS_TOKEN`, which is not present in this runtime. I could not POST a start or a finish. This is open item 5 in `SEO-OS-ARCHITECTURE.md` section 12, still open, now with a second agent unable to log.
- **Crawl Stats still not pulled.** Nora's open thread from July 28. I did not get to it either. It is the report that would confirm the crawl-budget ceiling I inferred in section 3, and it should be first in line once the GSC API lands.
- **The `discovered_not_indexed` attribution is alphabetically biased** and should be redone once the API can return the full 1,208 rather than a UI-capped, UI-sorted 1,000.

### Corrections owed to other files

1. `SEO-OS-ARCHITECTURE.md` agent D description: camps are the largest not-indexed source but not the largest page-count source. 218 of 2,220.
2. `SEO-OS-ARCHITECTURE.md` section 12 item 1 and section 10 item 6: `/adaptive/` question is closed, answer in section 3 above.
3. `reports/seo/gsc-review-2026-07-28.md`: the `/adaptive/` attribution was a sort artifact. Worth a one-line note so the next reader does not inherit it.

### For Jeff

1. The camps publish threshold, split commercial vs community. Section 6.
2. `/adaptive/` is orphaned from site navigation. One nav entry fixes three months of invisibility.
3. GSC Page Indexing has been frozen for eleven days. Worth a look at whether that is a Google-side processing delay or something about the property, and worth knowing that the escalation thresholds in the SEO OS design cannot fire while it stays frozen.

---

## Addendum: Run 2, 2026-08-04 (the actual scheduled cron fire)

**Run date:** 2026-08-04, 7:51 AM Pacific. Triggered by the real `pcd-directory-index-policy` cron (day 4, 7:45 AM), not a manual invocation. Everything above this line ran the night before, 2026-08-03 at 8:55 PM, ahead of the scheduled fire — `SEO-OS-ARCHITECTURE.md` line 466 says "Dex fires first, on August 4," so that Aug 3 pass was an early/preview run of this same monthly cycle, not a prior month's report.

**What I checked before deciding whether to redo the full pass:**

- Nora's GSC review dated 2026-08-03, 8:48 PM (`reports/seo/gsc-review-2026-08-03.md`, filed after my Aug 3 run) — Page Indexing is still the frozen 7/23 snapshot: 90 indexed, 2.88K not indexed, same eight-reason breakdown to the number. No new data exists to pull.
- `.env` — `PCD_AGENT_RUNS_TOKEN` still absent. Run logging still can't POST to `/api/agent-runs`, same gap noted in section 7 above and in `SEO-OS-ARCHITECTURE.md` section 12 item 5.
- `git log` since my Aug 3 commit (`2b576e00`) — four commits landed (a BabyLoveGrowth cleanup, a Penny publish/hold batch, an Arnie affiliate pass, a Sasha social-draft batch). None touch `NavBar.astro`, `Footer.astro`, `CAMPS_QUALITY_FRAMEWORK.md`, `CAMPS_APPROVAL_THRESHOLD.md`, or anything under `src/pages/camps`.
- `NavBar.astro` / `Footer.astro` directly — re-grepped for `adaptive`, zero matches, same as the finding in section 3. Still orphaned.

**Decision: no second 50-page scrape this run.** The charter asks for a rotating slice each monthly run so coverage builds over time, but rotating implies each pass should land on a different month's cron fire, not two passes nineteen hours apart against a site and a GSC snapshot that have not changed. Re-scraping the same 218-URL camp sitemap today would either re-sample overlapping URLs or burn a chunk of the rotation early for no new signal, and the underlying index numbers Google would score it against are still the same frozen 7/23 read. Nothing in section 1 through 6 above needs revision. The next rotating slice is scheduled for the September 4 run, drawing from the roughly 168 camp URLs not already sampled in the August batch (`reports/seo/data/2026-08-03-dex-camp-differentiation-sample.json` has the 50 already covered).

**Ratio, re-confirmed, not re-measured:** still 90 / 2,310, still frozen at the 7/23 snapshot. No change to report.

**Open items, unchanged:** the three corrections owed to other files (section 7 above) are still owed — I have not applied them, since editing `SEO-OS-ARCHITECTURE.md` or `reports/seo/gsc-review-2026-07-28.md` is outside what this run's charter asks me to do (recommend, don't act on files outside my own reports). Flagging again rather than re-flagging as new: this is the same three items, not additional ones.

**Agent run logging:** attempted, same failure as Aug 3 — `scripts/agent-run-client.mjs` needs `PCD_AGENT_RUNS_TOKEN`, not present in this runtime. Logged as failed in the commit message instead, per instruction 8's "log failures as failed."

**Slack:** none. Nothing moved, no new decision is ready for Jeff beyond what's already sitting in section 6 and this addendum from a run less than a day old. Per the maintenance-mode instruction, staying quiet.
