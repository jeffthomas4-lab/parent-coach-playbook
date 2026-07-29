# Camps Review — 2026-07-23

**Summary:** 107 pending programs to triage (up from 0 last week) — recommend approve ~88, reject 2, needs-info 17. Expired-but-live approved listings grew to 796 (from 604), because the cron-sweep root cause from last week still isn't fixed. Found a dead deep-link pattern on Lakewood's ActiveNet booking site affecting 4 approved duplicate pairs and 7 pending "Camp Create" items, plus 5 duplicate program pairs to merge.

## Database note

Confirmed against the same `activity-radar` D1 (`programs` joined to `organizations`, `pcd_status`, database_id `8cc3694a-...`) used in the two prior reviews. The `CAMPS_QUALITY_FRAMEWORK.md` file found in the repo (both `parent-coach-desk` and `parent-coach-desk-automation` copies, identical text) describes a different, older schema — a standalone `camps` table with `confidence`/`url_health_status` columns tied to `parentcoachplaybook.com` — that does not match this database. This mismatch was flagged in the 2026-07-09 review and is still uncorrected. Judgments below use the actual schema and the quality bar implied by this task's own instructions (org legitimacy, live site, required fields, date currency where dates exist) rather than the stale doc.

## 1. Directory counts

- `pcd_status`: approved 1,777 / pending 107 / rejected 857 (total 2,741)
- Approved with `session_end_date` in the past: **796** (45% of approved)
- Pending: **107**

## 2. Pending queue triage (n=107)

**84 evergreen_extract, 23 scraped.** Per the EVERGREEN RULE, none of the 107 pending rows carry `session_start_date`/`session_end_date` (all NULL) — none were judged on date currency. Spot-checked 8 evergreen source domains directly (ussportscamps.com, breakthroughbasketball.com, challengersports.com, i9sports.com, sahaleoutdoors.org, ymcapkc.org, anc.apm.activecommunities.com, and bothellvbc.org for a scraped org) — all are real, live organizations running real youth programs.

**Evergreen batch (84) — recommend APPROVE**, with two carve-outs:

- **7 "Camp Create Week 1–7" items** (Lakewood Parks & Rec, `activity_id=5272` registration URL) — approve the program, but the registration link is dead (see §3c); needs a working URL before/at approval.
- **3 i9 Sports "Todd Beamer" items** (baseball + soccer leagues) — approve, but the registration URL now redirects to a generic franchise page rather than the specific venue; flag for a link refresh.
- Remaining ~74 evergreen items (Nike/ussportscamps.com, Breakthrough Basketball, Challenger Sports, PenMet Parks, Auburn WA parks & rec, YMCA, Sahale Outdoors, other municipal ActiveNet camps): approve, no issues found in the sample checked.

**Scraped batch (23) — mixed:**

| Org | Program | Rec. | Why |
|---|---|---|---|
| Fire Mountain Staff Alumni Association | "Helped staff the 2022 Council Camporee" | **Reject** | Verified live site is a Scout-camp staff-alumni donor page, not a bookable youth program — this is a scraped bullet point from an activities list, not a real listing. |
| Susan L Curtis Charitable Foundation | "2026 Campfire Under The Stars Gala" | **Reject** | Verified live site is a legitimate camp (Maine), but out of region for this WA-focused directory, and the scraped item is their adult fundraising gala, not a camper program. |
| Bothell Vbc (x4: Advanced Summer Camp, Summer Camp I, Middle School Camp, Summer Camp II) | — | **Approve** | Verified live — org site lists all 4 camps with real 2026 dates. Backfill `registration_url` from the org's site (currently null on all 4). |
| Soccer For Change, Puget Sound Guitar Workshop (x2), Bearnstow (x2), Samena Club Inc (x2), Curtain Up Enterprises, Bainbridge Ballet Performance Group, Ketcha Outdoors, Evergreen Chess Club, Music Works Northwest, Northwest Theatre Productions, Theatre33, Kids In Concert, Nextgen Youth Empowerment, River Tree Arts | — | **Needs-info** (17 rows) | Not individually browser-verified this run. All are missing `registration_url` and have scraper-artifact names — e.g. Bearnstow's second row is literally "Session 2: July 6 – July 17" as the program name, Samena Club's second row is garbled nav text ("Junior Counselors... Click here... Learn More"), River Tree Arts' name is a bare date string, Kids In Concert's title says "2025" for what should be a 2026 listing. Likely several of these are duplicate/fragment rows of their sibling entry rather than distinct programs. Recommend a manual pass to confirm the org, backfill a registration URL, and clean up the program name before approving. |

## 3. Live listing QA (approved, n=1,777)

**a. Expired sessions.** 796 approved listings have a past `session_end_date`, up from 604 last week. Breakdown by who approved them:

- `sonnet-bulk-approval` (2026-07-13 batch): 931 total, 535 now expired (was 503 last week — 32 more aged into expiry this week)
- `system-recovery-2026-07-05`: 621 total, 235 already expired — this bucket wasn't broken out by name in last week's report
- `enrichment-worker (auto-approve)` (new this week, 2026-07-17 through 07-23): 225 total, only 26 already expired at approval time — a much better hit rate than the prior two batches, but still not zero

Root cause is unchanged from the 2026-07-09/07-16 reviews: the `scheduler_attempts` table still does not exist in the `forge-command` D1 database (confirmed via `sqlite_master` this run), so the daily cron sweep still throws before it can call the sweep endpoint. `url_last_checked_at` across all approved rows is still frozen at 2026-05-09 — 75 days with no URL health refresh or auto-archive.

**b. Duplicates.** 5 organization+name pairs (10 programs), all exact name matches within the same org:

- Camp Create Week 1, Week 3, Week 4, Week 5 (Lakewood Parks & Rec) — each pair has slightly different `session_end_date` (one day apart) and a different `registration_url` query string; recommend merge, keep the row with the more complete URL and verify the correct end date against the org site.
- Skagit Valley Tennis Association Camp — one row is entirely null (no dates, no registration_url), the other has real 2026 dates; recommend merge, drop the null shell.

**c. Dead/stale links.** Spot-checked 10 live sources:

- **Dead:** `anc.apm.activecommunities.com/lakewoodparksandrec/activity/search?activity_id=5272` (the Camp Create deep link used by 4 of the approved duplicate pairs and all 7 pending Camp Create rows) returns "No results found" — the specific activity ID no longer resolves.
- **Stale redirect:** `i9sports.com/venues/federal-way-todd-beamer-high-school-youth-sports-programs/10118` redirects to a generic franchise landing page instead of the specific venue.
- **Live and matching:** ussportscamps.com (Nike Soccer, Bellevue), breakthroughbasketball.com (Auburn), challengersports.com (DuPont), sahaleoutdoors.org, ymcapkc.org (Lakewood YMCA), bothellvbc.org, firemtn.org/alumni, susancurtis.org — all 8 resolved and content matched or explained the underlying listing (firemtn.org and susancurtis.org resolved but do not support the pending program as scraped — see §2).

**d. Quality-framework violations.**

- The Corvallis, OR / zip 33174 mismatch flagged in the 2026-07-16 review is still present — 5 "Nike Soccer Camp at Oregon State University" rows still carry the Miami, FL zip code.
- `domain_quality` table is still completely empty (0 rows), unaddressed across three consecutive reviews — `/admin/source-quality` cannot render approval rates for any domain, including the 1,013-listing ussportscamps.com concentration (57% of all approved listings).
- 498 of 1,777 approved programs (28%) have no `registration_url` at all — not previously quantified in prior reviews.

## What changed since last week (2026-07-16)

- Approved grew 1,554 → 1,777 (+223), entirely from a new `enrichment-worker (auto-approve)` pathway that wasn't running last week.
- Pending went from 0 (bulk-approved away) to 107 — a real queue exists again this week.
- Expired-live got worse, not better: 604 → 796, because the scheduler_attempts fix was not made.
- A previously-unlabeled approval batch, `system-recovery-2026-07-05` (621 rows, 235 expired), surfaced in this week's breakdown.
- Still open, carried forward from prior reviews: missing `scheduler_attempts` table (root cause), empty `domain_quality` table, Corvallis/33174 zip mismatch.

## Recommendations (not acted on — read-only review)

1. Create the `scheduler_attempts` table in `forge-command` D1 to unblock the daily cron sweep — highest leverage fix, unchanged ask from the last two reviews.
2. Triage the 107-item pending queue per §2 above (approve ~88, reject 2, needs-info 17).
3. Fix the dead `activity_id=5272` Lakewood registration link before approving any more Camp Create rows; refresh the i9 Sports Todd Beamer venue link.
4. Merge the 5 duplicate pairs identified in §3b.
5. Manually archive (or bulk re-review) the growing expired-live backlog (796) as a stopgap until #1 lands.
6. Backfill/populate `domain_quality` so source-quality reporting can function.
7. Fix the Corvallis/33174 zip mismatch (5 rows), still open since 2026-07-09.
8. Reconcile or replace `CAMPS_QUALITY_FRAMEWORK.md` — it documents a different database/schema than the one this review actually runs against.
