# Camps Review — 2026-09-03

**Summary:** Pending jumped 87→119 (+32) — 24 of those rows are the same ussportscamps.com duplicate-org-per-scrape bug getting worse (70→77 rows on 37 distinct programs), and a genuinely new source cluster (16 domains, 25 rows) of Minnesota junior-olympic volleyball clubs entered the queue; spot-checked 3 of the 16 live and all are real. Expired-live grew again to 1,295 (65.7% of approved, up from 64.8%), with the `system-recovery-2026-07-05` batch now 97.4% dead (605/621) — a bulk-unpublish call, not a refresh one. Duplicates and missing-registration-url are exactly flat vs. 08-27. Camp STAR failed a live check for the 4th consecutive review — recommend an actual reject this time, not another hold. The one real bright spot: the named-contact layer's core defect (rows missing both email and phone) dropped from 98.6% to 85.2% after 37 new contact rows landed — first movement in three reviews.

## Database note

Same `programs`/`organizations` D1 (`8cc3694a-...`) as prior reviews, queried live this run. The correlated-subquery version of the live-orgs-no-channel query hit D1's CPU limit again (same wall hit on 08-27); rewritten as a join and it completed. One earlier attempt at counting the cross-org-duplicate total came up 6 groups / 26 rows short of the true figure because it excluded groups where `registration_url IS NULL` — recomputed including those and it lands exactly on 08-27's 41/140, confirming flat rather than improved.

## 1. Directory counts

- `pcd_status`: approved 1,972 / pending 119 / rejected 857 (total 2,948)
- Approved with `session_end_date` in the past: **1,295** (65.7% of approved, up from 64.8%)
- Pending: **119** rows. All 119 are `evergreen_extract` with null `session_start_date` — no scraped or manual submissions this run, so the full pending queue is judged under the EVERGREEN RULE (org legitimacy and site liveness only, no date checks).

**The story this run is inflow, not cleanup.** Approved, rejected, exact-dup, cross-org-dup, and missing-registration-url counts are all exactly what they were on 08-27 — none of the last three reviews' recommendations have been actioned on the live side. What moved: +32 pending rows and +18 more listings aging into expired. The named-contact layer is the one place actual write activity happened this week.

## 2. Pending queue triage (n=119)

| Source cluster | Domains | Rows | Rec. | Why |
|---|---|---|---|---|
| ussportscamps.com (Nike camps) | 1 | 77 (37 distinct programs) | Approve 37 canonical, hold 40 as dup-org merge | Previously-verified domain. The duplicate-org-per-scrape bug is worse this run — was 70 rows/32 distinct on 08-27, now 77/37. Unfixed across 5 consecutive reviews. |
| anc.apm.activecommunities.com — Camp STAR | 1 | 3 | **Reject** (`unverifiable-address`) | Spot-checked live a 4th consecutive time: Parks Tacoma's own activity search still returns "No results found" for "Camp STAR." Three straight needs-info/reject recommendations have produced zero action — this should be an actual reject this run, not a fourth hold. |
| anc.apm.activecommunities.com — Bricks 4 Kidz, Around the World Cooking Camp | 1 | 2 | Approve | Confirmed real and live in prior reviews; unchanged. |
| hisawyer.com (Annie Wright Schools) | 1 | 5 (5 distinct) | Approve all 5 | Real Tacoma private school; same pre-season "new schedules being added" placeholder noted in prior reviews, not a dead org. |
| New: MN-area Junior Olympic volleyball clubs | 16 | 25 | Approve all 25 (18 distinct orgs) | New source cluster this run — Blaine, Centennial (Circle Pines), De Eagles (Eyota), Farmington, Hastings Heat, Hutchinson, Laker JOVB (Howard Lake), Marshall, Melrose, MN Premier (Andover), Moorhead, Northfield, SAJO (Lake Elmo), Sauk Rapids, South St. Paul, and 3 SportsEngine-hosted clubs (Lakes Lightning/Frazee, Hibbing JO, Giants VBC/Le Sueur) — all Minnesota. Spot-checked 3 live (Blaine, Hutchinson, South St. Paul): all real, active USAV/JVA-affiliated club sites with working contact info. Note: this is **not** a scope violation — the live directory already carries approved orgs in MN (7), WY (19), CA (295), MA (99), and 40+ other states, so multi-state coverage is the existing norm, not new drift. Recommend approving the full cluster on the strength of the 3/16 spot-check pattern; flag the other 13 for a lighter confirm-only pass next run since they're the same site template (SportsEngine/Wix/Weebly club pages) as the ones verified. |
| 7 previously-verified single-row WA domains (charleswright.org, loggerfootballcamps.com, mountaineers.org, parkstacoma.gov, pdza.org, soundlifedaycamp.com, tacomacapoeiracenter.com) | 7 | 7 | Approve all 7 | Confirmed real in prior reviews, unchanged. `parkstacoma.gov` and `soundlifedaycamp.com` should get dates backfilled at approval — both have real 2026 dates on their own sites, per 08-13. |

**Net recommendation:** approve 76 rows (37 ussportscamps canonical + 2 anc.apm + 5 hisawyer + 25 new MN cluster + 7 WA singles), hold 40 ussportscamps rows as duplicate-org merge candidates, reject the 3-row Camp STAR cluster. 76 + 40 + 3 = 119.

## 3. Live listing QA (approved, n=1,972)

**a. Expired sessions.** 1,295 approved listings have a past `session_end_date` (65.7% of approved, up from 64.8% on 08-27). By approval batch (`reviewed_by`):

| Batch | Total | Expired | Expired % | vs. 08-27 |
|---|---|---|---|---|
| `system-recovery-2026-07-05` | 621 | 605 | **97.4%** | up from 96.1% |
| `sonnet-bulk-approval` | 931 | 632 | 67.9% | up from 67.2% |
| `enrichment-worker (auto-approve)` | 227 | 58 | 25.6% | up from 23.8% |
| (unreviewed / null) | 193 | 0 | 0% | flat |

`system-recovery-2026-07-05` has gone from "worst batch" to essentially entirely dead across four reviews (58% → 87% → 96% → 97.4%). At 605 of 621 rows expired, calling this a refresh candidate no longer makes sense — it should be treated as a bulk-unpublish batch.

**b. Duplicates.** Both figures are exactly flat vs. 08-27 (recomputed and reconciled — see database note above):

- **Exact duplicates** (same `organization_id` + same name): **11 pairs / 22 rows**, unchanged. Same set as prior reviews (Camp Create Week 1/3/4/5, Hundred Acre Adventures Theatre Camp, Auburn Theatre Camp/Junior, Disney Creative Drama Theatre Camp, Logger Baseball Skills Camp, Hit the Road Adventure Camp, Skagit Valley Tennis Association Camp).
- **Cross-org duplicates** (identical name + registration_url under different organizations): **41 groups / 140 rows**, unchanged. Same worst offenders as prior reviews — the malformed JS-snippet name (12 orgs, null `registration_url`), "Camp Yougottawanna" (10 orgs, Puyallup Parks & Rec), "All Skills Day Camp"/"Elite Day Camp" (7 orgs each, Nike Soccer Camp at Seattle University), "Nike Baseball Camp at Seattle University" (6 orgs), Nike Soccer Camp at Bellevue College (6 orgs), the Lakewood "Camp Create" cluster (5 orgs, tied to the dead `activity_id=5272` link below), the Auburn `Activity_Search` cluster (3 orgs).

**c. Dead/stale links.** Spot-checked live this run via Claude-in-Chrome:

- **Still dead, 4th consecutive review:** Lakewood `activity_id=5272` (Camp Create Week 1/3/4/5, 5 approved rows) — search still returns "No results found."
- **Still generic, unresolved:** `apm.activecommunities.com/auburnwa/Activity_Search` — loads and now returns 224 results, but it's an unfiltered venue-wide catalog, not the specific program page any of the 3 affected listings claim to be.
- **Still dead, 4th consecutive review:** Camp STAR search on Parks Tacoma's own site — "No results found" (see §2; this is the basis for the reject recommendation).
- **New this run — wyomtbcamps.org** (already live/approved, Wyoming Mountain Bike Camps Inc): confirmed real and active. Currently shows "2027 dates TBD" — a genuine off-season/evergreen state for a legitimate org, not a defect. No action needed.
- **New this run — 3 of the pending MN volleyball domains** (blainevolleyball.com, hutchinsonjovolleyball.org, sspvb.com): all live, real, current contact info and active seasons. See §2.

**d. Quality-framework violations.**

- **Raw scraped code/garbled text as program name:** still present and not shrinking. The specific domains flagged in the 08-13 and 08-27 reviews (`rivertreearts.org`, `musicworksnw.org`, `i9sports.com`, `tdrpd.org`, `camphopeca.com`, `wyomtbcamps.org`, `lgsawa.com`, `tacomatigers.com`, `campbuildher.com`, `taloali.org`, `lamesaparks.org`, `bigsurfiddlecamp.org`, `losportscamps.com`, `sumnerjrpanthers.com`, `theatre33wa.org`, `lakestevenslittleleague.org`, `lynnwoodparksfoundation.org`, `leagues.bluesombrero.com`, `teamflygirls.com`, `samena.com`) all still carry live rows at similar or greater volume (`i9sports.com` now has 24 approved rows on that domain, `musicworksnw.org` 19, `rivertreearts.org` 18 — flat vs. 08-27's escalation to 18). **Caveat:** I could not exactly reproduce the prior reviews' code-token regex, so I'm reporting per-domain row counts rather than a fresh single "N garbled listings" figure — don't treat this as a clean like-for-like number against the 20-then-22 counts in prior reports. What's clear: none of these domains have been cleaned up, and the affected row count is not shrinking.
- `registration_url` missing: **523 of 1,972 approved (26.5%)** — exactly flat vs. 08-27.
- **profootballcamp.com:** still carries a near-blank-name row ("profootballcamp") and a 2027-dated listing amid an otherwise-2026 directory — unresolved since flagged on 08-27.
- Corvallis, OR / zip 33174 mismatch and `domain_quality` table status: not re-verified this run (out of this task's query scope again, 4th consecutive review unverified).

## 4. Contact coverage (STEP 3e)

### Organizations table (`8cc3694a-...`)

| Metric | Count | % | vs. 08-27 |
|---|---|---|---|
| Total organizations | 198,287 | — | flat |
| With email | 221 | 0.11% | +20 |
| With phone | 439 | 0.22% | +4 |
| No channel at all | 197,780 | 99.74% | −21 |
| **Live-listing orgs with no channel** | **1,149 of 1,307** | **87.9%** | flat (exactly unchanged) |

Total org email/phone coverage ticked up slightly, but the metric that matters most — orgs backing a *live* listing with zero contact channel — didn't move at all this week, despite the small gains elsewhere.

### Named-contact layer (`parent-coach-desk-ops-production`, `b38d5f37-...`)

| Metric | Value | vs. 08-27 |
|---|---|---|
| Total contacts (not deleted) | 108 | +37 |
| Distinct orgs with a contact | 56 | +12 |
| Confidence: high / medium / low | 50 / 42 / 16 | high +15, medium +22, low flat |
| Do-not-contact flagged | 0 | flat |
| **Defect — missing both email and phone** | **92 of 108 (85.2%)** | improved from 98.6% |
| **Defect — `is_public=1` with no `verified_at`** | 0 | flat |

This is the first real movement on the named-contact defect in three reviews. 37 new rows landed this week, split across high and medium confidence, and the missing-both-channels rate dropped 13.4 points. It's still bad — 85% of named contacts can't actually be reached — but whatever changed in the extraction pipeline this week is worth identifying and keeping, since it's the first sign this layer is closing its core gap rather than just growing wider.

## What changed since last week

- Pending grew 87 → 119 (+32): +7 rows from the worsening ussportscamps.com dup-org bug, +25 rows from a brand-new 16-domain Minnesota JO-volleyball source cluster (spot-checked 3/16, all legitimate).
- Expired-live grew 1,277 → 1,295 (+18, 64.8% → 65.7%). `system-recovery-2026-07-05` is now 97.4% expired (up from 96.1%) — recommend reclassifying this batch from refresh to bulk-unpublish.
- Camp STAR failed its 4th consecutive live check — escalating from "recommend reject" to "reject this one, it's overdue."
- Duplicates (exact and cross-org) and missing-registration-url: all exactly flat vs. 08-27, confirmed after correcting a query error that had understated the cross-org figure.
- Named-contact layer improved meaningfully: +37 contacts, +12 orgs, missing-both-channels defect down from 98.6% to 85.2%. First real progress on this metric since it started being tracked.
- Org-level contact coverage on live listings (1,149/1,307 orgs with no channel) did not move at all.
- New this run: confirmed wyomtbcamps.org (already live) is a legitimate org in a genuine evergreen off-season state, not a defect.
- Carried forward, still unfixed: dead Lakewood `activity_id=5272` link, generic Auburn catalog link, the code-as-name/garbled-name defect across ~19 domains, the 41-group cross-org-dup cluster, the 11-pair exact-dup cluster, profootballcamp.com's blank-name/2027-date rows, the Corvallis/33174 zip mismatch (still unverified), the broken daily cron sweep, and the ussportscamps.com duplicate-organization-per-scrape bug (now worse, not better).

## Recommendations (not acted on — read-only review)

1. Triage the 119-item pending queue per §2: approve 76 rows, hold 40 ussportscamps rows for merge, reject the 3-row Camp STAR cluster outright this time.
2. Fix the duplicate-organization-per-scrape bug in the evergreen extractor — 5 consecutive reviews flagged, and it's getting worse (70→77 rows on ussportscamps.com alone this week).
3. Reclassify `system-recovery-2026-07-05` from "bulk-review" to "bulk-unpublish" — 97.4% expired (605 of 621) is past the point where a refresh pass makes sense.
4. Actually reject the Camp STAR cluster — 4 straight reviews of zero live verification and zero admin action.
5. Run a rename-or-unpublish pass on the ~19 domains carrying raw-scraped-code or garbled-text names as their program name — unresolved for 3+ reviews running.
6. Fix the two persistent dead/generic links: Lakewood `activity_id=5272` and the Auburn `Activity_Search` catalog fallback.
7. Resolve the 41-group cross-org-duplicate cluster and the 11-pair exact-duplicate cluster.
8. Check the profootballcamp.com blank-name and 2027-dated rows for a scrape error.
9. Verify the Corvallis/33174 zip mismatch — unverified for 4 consecutive reviews now; worth just doing it next run rather than deferring again.
10. Create the `scheduler_attempts` table to unblock the daily cron sweep (recurring ask, still open).
11. Find out what changed in the named-contact extraction pipeline this week — it produced the first real improvement (98.6% → 85.2% missing-both) after three flat reviews. Worth understanding so it can be replicated or scaled.
12. **Process backlog risk, now in its 4th review cycle:** live-side metrics (approved count, duplicates, missing-URL, dead links) have not moved in a month of reviews despite four consecutive rounds of specific, actionable recommendations. The only metric that moved this week is one nobody in this process directly controls (the contact-extraction pipeline). If the admin queue isn't going to be worked, that's worth raising directly with whoever owns it — this report can keep finding the same problems every week, but finding them isn't the same as fixing them.
