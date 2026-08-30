# Camps Review — 2026-08-27

**Summary:** Zero admin action on the directory in two weeks — approved (1,972), rejected (857), exact-dup pairs (11/22 rows), cross-org-dup groups (41/140 rows), and missing-registration-url count (523) are all bit-for-bit identical to the 2026-08-13 report. Meanwhile pending grew 72→87 (47 distinct programs, same duplicate-org-per-scrape bug, unabated) and expired-live grew 1,208→1,277 (65% of approved, up from 61%) — the `system-recovery-2026-07-05` batch is now 96% expired (up from 87%). Camp STAR is dead for a 3rd straight review (recommend reject, not hold). Contact coverage improved marginally: live-listing orgs with no channel fell to 1,149/1,307 (87.9%, was 88.6%), and the named-contact layer grew to 71 contacts/44 orgs (was 58/36) but still has 70 of 71 rows (99%) missing both email and phone.

## Database note

Same `programs`/`organizations` D1 (`8cc3694a-...`) as prior reviews. This run's read succeeded cleanly with no mid-run drift (all repeat counts against 2026-08-13 landed exactly on the prior figure, which is itself evidence nothing changed in between). One correlated-subquery version of the contact-coverage query hit D1's CPU limit and was reset; rewritten as a join and it completed fine — noting in case a future run hits the same wall on the `organizations` × `programs` correlation.

## 1. Directory counts

- `pcd_status`: approved 1,972 / pending 87 / rejected 857 (total 2,916)
- Approved with `session_end_date` in the past: **1,277** (64.8% of approved, up from 61.2%)
- Pending: **87** rows, but only **47 distinct** program name + registration_url combinations — 40 rows are duplicate re-extractions of an already-represented program under a new `organization_id`. Identical bug to 2026-08-13, still unfixed.

**The stagnant metrics are the story this run.** Approved count, rejected count, exact-dup count, cross-org-dup count, and missing-registration-url count are all exactly what they were two weeks ago. Nothing from the 08-13 recommendations (33 approves, the duplicate-org bug, the 87%-expired batch, the 20 garbled-name listings, the two dead links, the Corvallis zip mismatch) has been actioned. The only thing that moved is inflow: 15 more pending rows and 69 more listings aging into expired.

## 2. Pending queue triage (n=87, 47 distinct programs)

All 87 rows are `evergreen_extract` with null `session_start_date` — no scraped or manual submissions this run. Per the EVERGREEN RULE, none were judged on date currency; each was judged on org legitimacy, site liveness, and whether it's a real youth activity. Every source domain this week is a repeat of a domain already verified live in the 2026-07-30 or 2026-08-13 reviews — no brand-new domains entered the queue. Spot-checked live in Claude-in-Chrome this run to confirm two new-geography Nike camp pages and re-check the one unresolved item: `ussportscamps.com` (Boise State baseball page, Bozeman girls-soccer page) and `anc.apm.activecommunities.com` (Camp STAR search, 3rd check).

| Domain | Rows | Distinct programs | Rec. | Why |
|---|---|---|---|---|
| ussportscamps.com (Nike camps, all variants) | 70 | 32 | Approve 1 each (32), hold 38 as dupes | Previously-verified domain; same duplicate-org-per-scrape pattern as prior two reviews. Spot-checked Boise State baseball and Bozeman girls-soccer pages this run — both real, both currently show "no active sessions" or (Bozeman) actual 2026 dates on the source page. |
| hisawyer.com (Annie Wright Schools, 5 activity types) | 5 | 5 | Approve all 5 | Real Tacoma private school; same "new schedules being added" placeholder state noted in 08-13, unchanged — not a dead org/site, a pre-season booking-platform state. |
| anc.apm.activecommunities.com — Camp STAR | 3 | 1 | **Reject** (escalated from needs-info) | Spot-checked live 3rd consecutive review: searching "Camp STAR" on Parks Tacoma's own site still returns "No results found." Three straight weeks of zero verification is enough to call this — recommend `reject_reason_code = 'unverifiable-address'` rather than continuing to hold. |
| anc.apm.activecommunities.com — Bricks 4 Kidz LEGO Adventure Camp, Around the World Cooking Camp | 2 | 2 | Approve both | Confirmed live and exact-matching in the 08-13 spot-check (STAR Ctr, Aug 24–28 2026); not re-checked this run since nothing about them changed, but flagging that Aug 24–28 has now passed as of this report's date (Aug 27) — these should get dates backfilled at approval rather than left dateless, or they'll immediately need a fresh evergreen pass. |
| charleswright.org — CWA Summer Sports Camp - Volleyball | 1 | 1 | Approve | Confirmed real in 08-13 review; unchanged. |
| loggerfootballcamps.com — Logger Football Camps | 1 | 1 | Approve | Confirmed real in 08-13 review; unchanged. |
| parkstacoma.gov — Skyhawks Mini-Hawk Camp | 1 | 1 | Approve, backfill dates | 08-13 review found real dates (Aug 10–14, 2026) on the .gov source; recommend backfilling `session_start_date`/`session_end_date` at approval. |
| mountaineers.org — Summer Camp Rock and Ropes (Tacoma) | 1 | 1 | Approve | Confirmed real in 08-13 review; unchanged. |
| pdza.org — Little Lemurs | 1 | 1 | Approve | Confirmed real in 08-13 review; unchanged (Point Defiance Zoo). |
| soundlifedaycamp.com — Sound Life Day Camp | 1 | 1 | Approve, backfill dates | 08-13 review found a full 2026 calendar/pricing on the org's own site; recommend backfilling dates at approval. |
| tacomacapoeiracenter.com — Youth Capoeira Classes | 1 | 1 | Approve | Confirmed real in 08-13 review; unchanged (nonprofit, City of Tacoma/ArtsFund funded). |

**Net recommendation:** approve one canonical row for 46 of the 47 distinct programs (46 rows), hold the other 38 rows as duplicate-org merge candidates, reject the 3-row Camp STAR cluster. This is the third review in a row recommending roughly this same shape of action on a pending queue that never gets touched.

## 3. Live listing QA (approved, n=1,972)

**a. Expired sessions.** 1,277 approved listings have a past `session_end_date` (64.8% of approved), up from 1,208 (61.2%) two reviews ago. By approval batch (`reviewed_by`):

| Batch | Total | Expired | Expired % | vs. 08-13 |
|---|---|---|---|---|
| `system-recovery-2026-07-05` | 621 | 597 | **96.1%** | up from 87% |
| `sonnet-bulk-approval` | 931 | 626 | 67.2% | up from 66% |
| `enrichment-worker (auto-approve)` | 227 | 54 | 23.8% | up from 22% |
| (unreviewed / null) | 193 | 0 | 0% | flat |

`system-recovery-2026-07-05` has gone from "worst batch" to "almost entirely dead" in two reviews (58% → 87% → 96%). At this point treating this batch as a bulk-unpublish candidate rather than a refresh candidate is probably the right call — 96% of 621 rows being stale isn't a data-freshness problem, it's a batch that should not be live. The daily cron sweep that should be auto-archiving these on `end_date` continues to not run (unverified again this run — `scheduler_attempts` is outside this task's D1 scope — but the trendline is the evidence).

**b. Duplicates.** Both figures are exactly flat vs. 08-13 — no dedup work happened, but also no new duplicates were introduced this run (consistent with zero live-listing writes overall).

- **Exact duplicates** (same `organization_id` + same name): **11 pairs / 22 rows**, unchanged. Same names as 08-13: Camp Create Week 1/3/4/5, Hundred Acre Adventures Theatre Camp, Auburn Theatre Camp/Junior, Disney Creative Drama Theatre Camp, Logger Baseball Skills Camp, Hit the Road Adventure Camp, Skagit Valley Tennis Association Camp.
- **Cross-org duplicates** (identical name + registration_url under different organizations): **41 groups / 140 rows**, unchanged. Same worst offenders as 08-13: the malformed JS-snippet name (12 orgs, null registration_url), "Camp Yougottawanna" (10 orgs, Puyallup Parks & Rec), "All Skills Day Camp" / "Elite Day Camp" (7 orgs each, Nike Soccer Camp at Seattle University), "Nike Baseball Camp at Seattle University" (6 orgs), Nike Soccer Camp at Bellevue College (6 orgs), the Lakewood "Camp Create" cluster (5 orgs, tied to the dead `activity_id=5272` link below). The Auburn `apm.activecommunities.com/auburnwa/Activity_Search` cluster (3 orgs: Auburn Adventure Camp, Hundred Acre Adventures, Auburn Theatre Camp) is very likely the same root cause as the exact-dup Auburn rows above — the evergreen scraper can't find program-specific URLs on that domain and falls back to the bare catalog search page, which then collides across both duplicate types.

**c. Dead/stale links.** Spot-checked 9 live sources this run — the two carried-forward dead links, the generic-catalog carryover, and 4 not previously checked live:

- **Confirmed still dead, unfixed for 3 consecutive reviews:** Lakewood `activity_id=5272` (Camp Create Week 1/3/4/5, 5 rows) — search still returns "No results found."
- **Confirmed still broken, 3 consecutive reviews:** i9 Sports Todd Beamer venue link — still redirects off the specific venue page to the generic Tacoma/Lakewood/Federal Way franchise landing page.
- **Confirmed still generic, unresolved:** `apm.activecommunities.com/auburnwa/Activity_Search` — still an empty, unfiltered search with no results by default.
- **New this run — Fire Mountain Staff Alumni Association Camp:** confirmed the `registration_url` is a real, active Facebook page ("Fire Mountain Scout Camp," 3K followers, verified nonprofit) — the org is legitimate, but this is still staff-alumni content on a social page, not a bookable youth-camp registration flow. Same underlying defect flagged in 08-13; unresolved, still live.
- **New this run — sequoialakemusic.com:** live, real, registration open for Summer 2026. Confirms the org behind the two garbled-name listings on this domain (see §3d) is legitimate — the defect is the scraped name field, not the source.
- **New this run — profootballcamp.com:** live, real, registration open. But one listing on this domain is dated "June 21-23, **2027**" while every other listing in the directory is 2026, and a second row on the same domain has a near-empty placeholder name ("profootballcamp"). Worth a manual look — either a legitimate early 2027 posting or a scrape date error.

**d. Quality-framework violations.**

- **Raw scraped code/garbled text as the program name:** automated pattern match (JS/CSS/JSON syntax tokens in the `name` field) finds **22 live listings**, up from 20 two reviews ago. 6 domains are new to this defect since 08-13: `lakestevenslittleleague.org`, `lynnwoodparksfoundation.org`, `leagues.bluesombrero.com`, `teamflygirls.com`, `samena.com`, `i9sports.com`. Note this is a stricter, code-token-only count than the 08-13 figure, which also folded in garbled-but-not-literally-code marketing copy — so the two 20-vs-22 numbers aren't perfectly apples-to-apples; the pattern is worsening either way.
- **rivertreearts.org escalation:** this domain had 3 flagged rows on 08-13; it now has **18 approved rows**, most of them names that are dates or sentence fragments rather than program names (e.g. "Date: July 14-16; 3 day camp (Tuesday-Thursday)", "REGISTER HERE FOR ALL FOUR WEEKS Week One: Blueberries for Sal..."). This is a related but distinct defect from the code-as-name pattern above — the scraper is capturing schedule/marketing text instead of the actual camp name — and it's the single largest concentration of name-quality defects in the directory right now.
- **Fire Mountain Staff Alumni Association Camp** — confirmed still live (see §3c), unresolved since first flagged.
- **Corvallis, OR / zip 33174 mismatch:** the 3 "Nike Soccer Camp at Oregon State University" approved rows are still live under the same IDs; zip field itself not re-verified this run (out of query scope) but nothing suggests the underlying record changed given every other metric in this section is flat.
- `registration_url` missing: **523 of 1,972 approved (26.5%)** — exactly flat vs. 08-13.
- `domain_quality` table status not re-verified this run (out of this task's query scope again).

## 4. Contact coverage (STEP 3e)

### Organizations table (`8cc3694a-...`)

| Metric | Count | % | vs. 08-13 |
|---|---|---|---|
| Total organizations | 198,287 | — | flat |
| With email | 201 | 0.10% | +2 |
| With phone | 435 | 0.22% | +7 |
| No channel at all | 197,801 | 99.75% | −9 |
| **Live-listing orgs with no channel** | **1,149 of 1,307** | **87.9%** | −9 (was 88.6%) |

Small, real improvement — 9 fewer live-backing orgs are contact-less than two weeks ago, out of the same 1,307-org pool (org pool is unchanged since approved count didn't move). This is the discovery/evergreen agents' extraction working, just very slowly against a huge base.

### Named-contact layer (`parent-coach-desk-ops-production`, `b38d5f37-...`)

| Metric | Value | vs. 08-13 |
|---|---|---|
| Total contacts (not deleted) | 71 | +13 |
| Distinct orgs with a contact | 44 | +8 |
| Confidence: high / medium / low | 35 / 20 / 16 | high +13, medium/low flat |
| Do-not-contact flagged | 0 | flat |
| **Defect — missing both email and phone** | **70 of 71 (98.6%)** | flat (was 57/58, 98.3%) |
| **Defect — `is_public=1` with no `verified_at`** | 0 | flat |

The layer is growing (13 new contact rows, all landing in the `high`-confidence bucket, which is a good sign for whatever's populating it now), but the core defect from 08-13 is unchanged: virtually none of these rows carry an actual email or phone. 70 of 71 rows still don't accomplish the stated goal of reachability. Whatever field is being populated on new `org_contacts` inserts, it still isn't email or phone — this needs a direct look at what one of these rows actually contains (without copying its contents into this report, per the no-PII rule).

## What changed since last week

- **Nothing changed on the live side.** Approved (1,972), rejected (857), exact-dup pairs (11/22), cross-org-dup groups (41/140), and missing-registration-url (523) are all identical to 2026-08-13. Zero admin queue actions were taken against any of the last two reviews' recommendations.
- Pending grew 72 → 87 (+15 rows, 34 → 47 distinct programs) — the duplicate-org-per-scrape bug is still generating new org rows on every evergreen re-run.
- Expired-live grew 1,208 → 1,277 (+69, 61.2% → 64.8% of approved). `system-recovery-2026-07-05` went from 87% to 96% expired — this batch is now a de facto unpublish candidate, not a refresh candidate.
- Camp STAR escalated from needs-info to recommend-reject after a 3rd straight week of zero live verification.
- New defect concentration: rivertreearts.org grew from 3 flagged rows to 18 (schedule-text-as-name, not just code-as-name).
- Code-as-name defect grew from 20 to 22 rows (6 new domains), on a stricter counting method than last review used.
- Contact coverage improved marginally and genuinely: live-orgs-with-no-channel −9, named-contact-layer contacts +13 — but the named-contact layer's core defect (98.6% missing both email and phone) is unchanged.
- Carried forward, still unfixed: dead Lakewood `activity_id=5272` link, dead i9 Sports Todd Beamer redirect, generic Auburn catalog link, Fire Mountain Facebook-as-registration-URL, Corvallis/33174 zip mismatch, broken daily cron sweep, duplicate-organization-per-scrape bug.
- New this run: profootballcamp.com has one 2027-dated listing amid an otherwise all-2026 directory, worth a manual check for a scrape-date error.

## Recommendations (not acted on — read-only review)

1. Triage the 87-item pending queue per §2: approve 46 canonical rows, hold 38 duplicate-org rows for merge, reject the 3-row Camp STAR cluster.
2. Fix the duplicate-organization-per-scrape bug in the evergreen extractor — unfixed across three consecutive reviews now, and it's the single largest source of both pending-queue noise and the 41-group cross-org-duplicate cluster on the live side.
3. Reclassify `system-recovery-2026-07-05` from "bulk-review" to "bulk-unpublish" — 96% expired (597 of 621) is past the point where a refresh pass makes sense for most of this batch.
4. Rename or unpublish the 22 live listings with raw scraped code as their name (§3d), plus give the rivertreearts.org cluster (18 rows) a separate pass — most of those need the actual camp name pulled from a different field than whatever the scraper is currently grabbing.
5. Resolve the 41-group cross-org-duplicate cluster (§3b) and the 11-pair exact-duplicate cluster — same root cause as #2 for at least the Auburn/Lakewood portion, already published either way.
6. Fix the three carried-forward dead/broken links: Lakewood `activity_id=5272`, the i9 Sports Todd Beamer redirect, and the generic Auburn `Activity_Search` catalog link.
7. Investigate what the 70 contact-less `org_contacts` rows actually contain — three reviews in a row now with ~98% of named-contact rows missing both email and phone.
8. Check the profootballcamp.com 2027-dated listing for a scrape-date error.
9. Fix the Corvallis/33174 zip mismatch (3 rows, unverified again this run but presumptively unchanged).
10. Create the `scheduler_attempts` table to unblock the daily cron sweep (unchanged ask from prior reviews).
11. **Process backlog risk:** three consecutive reviews have now recommended substantially the same actions with zero uptake. If the admin queue isn't going to be worked, it may be worth flagging to whoever owns that queue directly rather than relying on this report to surface it — the read-only review process is doing its job; the bottleneck is downstream of it.
