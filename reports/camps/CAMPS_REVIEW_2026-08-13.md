# Camps Review — 2026-08-13

**Summary:** 72 pending items across only 34 distinct programs — the evergreen extractor is minting a new organization per re-scrape (Nike Volleyball Camp at University of Portland alone has 12 duplicate org rows); recommend approving one instance of 33 programs and holding the other 38 as merge candidates, needs-info on the 3-row Camp STAR cluster (its own registration search returns zero results). 1,208 live listings are past their end date (up from 960 two reviews ago). New/escalated this week: 41 duplicate-org groups (140 rows) are publishing the identical program+URL under separate organizations, and 20 live listings (up from 5) show raw scraped code or garbled text as their program name. Contact coverage: 1,158 of the 1,307 organizations behind live listings (88.6%) have no email or phone on file, and the newly-live named-contact layer has only 58 contacts covering 36 orgs — 57 of those 58 rows are missing both email and phone.

## Database note

Same `programs`/`organizations` D1 (`8cc3694a-...`) as prior reviews. D1 access failed entirely on 2026-08-06 (no connector, no wrangler credentials); this run has a working `d1_database_query` connector and could pull live data. Note the counts below shifted *during* this run — a discovery/evergreen agent appears to be writing to the database concurrently (pending went 64→72 and expired-live 1,191→1,208 between the first and second read a few minutes apart). Figures quoted are the last read taken for each metric, not perfectly simultaneous.

## 1. Directory counts

- `pcd_status`: approved 1,972 / pending 72 / rejected 857 (total 2,901)
- Approved with `session_end_date` in the past: **1,208** (61% of approved)
- Pending: **72**, but only **34 distinct** program name + registration_url combinations — 38 rows are duplicate re-extractions of an already-represented program under a new `organization_id`.

## 2. Pending queue triage (n=72, 34 distinct programs)

All 72 rows are `evergreen_extract` with null `session_start_date` — no scraped or manual submissions this week. Per the EVERGREEN RULE, none were judged on date currency; each was judged on whether the org is real, its site is live, and the program is a legitimate youth activity. Spot-checked live in Claude-in-Chrome this run: `loggerfootballcamps.com`, `tacomacapoeiracenter.com`, `soundlifedaycamp.com`, `parkstacoma.gov`, `charleswright.org`, `hisawyer.com` (Annie Wright Schools), and the three `anc.apm.activecommunities.com` (Metro Parks Tacoma) search links. The `ussportscamps.com` (Nike camps), `mountaineers.org`, and `pdza.org` domains were not re-checked live — they're previously-verified repeat domains flagged clean in the 2026-07-30 review.

| Program | Domain | Dupe org rows | Rec. | Why |
|---|---|---|---|---|
| Nike Volleyball Camp at University of Portland | ussportscamps.com | 12 | Approve 1, hold 11 | Previously-verified domain; same name+URL under 12 separate orgs |
| Nike Tennis Camp at Lewis & Clark College | ussportscamps.com | 7 | Approve 1, hold 6 | Same as above |
| Nike Baseball Camp at University of Puget Sound | ussportscamps.com | 4 | Approve 1, hold 3 | Same as above |
| Nike Soccer Camp at Pioneer Park | ussportscamps.com | 4 | Approve 1, hold 3 | Same as above |
| Nike Tennis Camp at University of Puget Sound | ussportscamps.com | 4 | Approve 1, hold 3 | Same as above |
| Camp STAR | anc.apm.activecommunities.com (Metro Parks Tacoma) | 3 | **Needs-info** | Spot-checked live: searching "Camp STAR" on Parks Tacoma's own site returns "No results found." "STAR Ctr" is a facility name on other confirmed listings (Bricks 4 Kidz, Around the World Cooking Camp both found live at that venue) — likely the extractor mistook a venue label for a program name. Needs a manual re-check of what's actually offered before approving any instance. |
| Nike Boys Soccer Camp at University of Portland | ussportscamps.com | 3 | Approve 1, hold 2 | Previously-verified domain |
| Nike Soccer Camp at Oregon State University | ussportscamps.com | 3 | Approve 1, hold 2 | Previously-verified domain; watch for the Corvallis/33174 zip defect already present on the approved instances of this program (see §3d) before approving |
| Nike Girls Soccer Camp at University of Portland | ussportscamps.com | 2 | Approve 1, hold 1 | Previously-verified domain |
| Nike Soccer Camp at Hilltop Heritage MS (+ 2 sub-variants: ECD, Player Development) | ussportscamps.com | 2 each | Approve 1 each, hold 1 each | Previously-verified domain |
| Nike Soccer Camp at University of Puget Sound | ussportscamps.com | 2 | Approve 1, hold 1 | Previously-verified domain |
| Nike Volleyball Camp at The Courts in Beaverton | ussportscamps.com | 2 | Approve 1, hold 1 | Previously-verified domain |
| Nike Baseball Camp at George Fox University (Day + Half Day) | ussportscamps.com | 1 each | Approve | Previously-verified domain |
| Nike Baseball Camp in Bend (Day + Overnight) | ussportscamps.com | 1 each | Approve | Previously-verified domain |
| Early Childhood Development (session-83951 and session-83952, both Pioneer Park) | ussportscamps.com | 1 each | Approve, rename | Live and real, but the generic name is indistinguishable from other "Early Childhood Development" rows already approved elsewhere in the directory (see §3d) — recommend renaming to include the venue, e.g. "Nike Soccer Camp at Pioneer Park – Early Childhood Development," before publishing |
| Bricks 4 Kidz LEGO Adventure Camp - Afternoon | anc.apm.activecommunities.com | 1 | **Approve** | Spot-checked live: exact match found, #33455, Aug 24–28 2026, STAR Ctr |
| Around the World Cooking Camp | anc.apm.activecommunities.com | 1 | **Approve** | Spot-checked live: exact match found, #33764, Aug 24–28 2026, STAR Ctr |
| CWA Summer Sports Camp - Volleyball | charleswright.org | 1 | **Approve** | Spot-checked live: Charles Wright Academy's own 2026 camp page confirms sports camps including volleyball |
| Mixed Athletics: Swimming & Volleyball, Finders/Makers, Little Artist World Tour & Music From Art, Painting The PNW, Athletics: Soccer (5 rows) | hisawyer.com (Annie Wright Schools) | 1 each | Approve | Annie Wright is a real, known Tacoma private school. The specific `activity-set` links currently redirect to a generic "New schedules are being added — check back soon" page rather than showing this activity, consistent with a pre-season placeholder state on the booking platform, not a dead org/site. |
| Logger Football Camps | loggerfootballcamps.com | 1 | **Approve** | Spot-checked live: real UPS Football camps page; currently reads "no camps scheduled at this time," consistent with the evergreen/off-season state (org itself is legitimate — this is the host program's own site) |
| Skyhawks Mini-Hawk Camp (Baseball, Basketball & Soccer) | parkstacoma.gov | 1 | Approve, backfill dates | Spot-checked live: confirmed on Parks Tacoma's own camp table with real dates (Aug 10–14, 2026, Titlow Park). The .gov source already has dates — recommend backfilling `session_start_date`/`session_end_date` onto this record at approval instead of leaving it dateless |
| Youth Capoeira Classes | tacomacapoeiracenter.com | 1 | **Approve** | Spot-checked live: real nonprofit capoeira program, ages 6+, City of Tacoma/ArtsFund funded |
| Sound Life Day Camp - Tacoma | soundlifedaycamp.com | 1 | Approve, backfill dates | Spot-checked live: full 2026 weekly calendar and pricing present on the org's own site — dates exist at the source, just not captured in this record |
| Summer Camp - Rock and Ropes (Tacoma) | mountaineers.org | 1 | **Approve** | Previously-verified domain; this season's session already ran/sold out, consistent with an evergreen record |
| Little Lemurs | pdza.org | 1 | **Approve** | Previously-verified domain (Point Defiance Zoo) |

**Net recommendation:** approve one canonical row for 33 of the 34 distinct programs (33 rows), hold the other 36 rows as duplicate-org merge candidates, needs-info the 3-row Camp STAR cluster. None recommended for reject this week.

## 3. Live listing QA (approved, n=1,972)

**a. Expired sessions.** 1,208 approved listings have a past `session_end_date` (61% of approved), up from 960 in the last successful review. By approval batch (`reviewed_by`):

| Batch | Total | Expired | Expired % |
|---|---|---|---|
| `sonnet-bulk-approval` | 931 | 616 | 66% |
| `system-recovery-2026-07-05` | 621 | 542 | **87%** |
| `enrichment-worker (auto-approve)` | 227 | 50 | 22% |
| (unreviewed / null) | 193 | 0 | 0% |

`system-recovery-2026-07-05` is still the fastest-aging batch by far and has gotten materially worse (58% expired as of 07-30, now 87%) — this is the highest-leverage bulk refresh-or-unpublish target. The daily cron sweep that should auto-archive these has reportedly been broken since before 2026-07-09 (root cause not independently re-verified this run — the `scheduler_attempts` table lives outside this task's D1 scope).

**b. Duplicates.**

- **Exact duplicates** (same `organization_id` + same name, literal double-insert): **11 pairs / 22 rows**, up from 5 pairs in the last review. New this week: Hundred Acre Adventures Theatre Camp, Auburn Theatre Camp Junior, Disney Creative Drama Theatre Camp, Logger Baseball Skills Camp, Auburn Theatre Camp, Hit the Road Adventure Camp. Carried forward: Camp Create Week 1/3/4/5, Skagit Valley Tennis Association Camp.
- **Cross-org duplicates** (identical name + registration_url published under *different* organizations — matches the quality framework's "same website host" fuzzy-dup criterion): **41 groups / 140 rows total**. This is a more complete measurement than prior reviews ran and is the largest duplication finding to date. Worst offenders: a malformed JS-snippet "name" (12 orgs, `null` registration_url — likely from `teamsportshq`), "Camp Yougottawanna" (10 orgs, Puyallup Parks & Rec), "All Skills Day Camp" and "Elite Day Camp" (7 orgs each, Nike Soccer Camp at Seattle University), "Nike Baseball Camp at Seattle University" (6 orgs), "Nike Soccer Camp" at Bellevue College (6 orgs), the Lakewood "Camp Create" cluster (5 orgs, tied to the dead `activity_id=5272` link below).

**c. Dead/stale links.** Spot-checked 14 live sources this run (9 shared with the pending-queue check above, plus 5 dedicated approved-listing checks):

- **Confirmed still dead/broken, unfixed for 3+ consecutive weeks:**
  - Lakewood `activity_id=5272` (Camp Create Week 1/3/4/5, 5 rows) — search returns "No results found."
  - i9 Sports Todd Beamer venue link — redirects off the specific venue page to the generic Tacoma/Lakewood/Federal Way franchise landing page.
- **New: generic catalog link, not program-specific** — `apm.activecommunities.com/auburnwa/Activity_Search` (Auburn Adventure Camp, Hundred Acre Adventures Theatre Camp, Auburn Theatre Camp/Junior) loads but shows an empty, unfiltered search with no results by default — same pattern as the `tdrpd.org` "functional but not program-specific" finding from 07-30.
- **Live and matching:** `breakthroughbasketball.com` (Auburn, real 2026 dates/pricing), `pugetsoundguitarworkshop.org` (real registration page — confirms the org itself is legitimate despite its live listing's garbled scraped name, see §3d), plus the 9 domains checked in §2.

**d. Quality-framework violations.**

- **Escalating — raw scraped code/garbled text as the program name:** **20 live listings**, up from 5 in the last review (4x). Domains: `lgsawa.com`, `tacomatigers.com`, `campbuildher.com`, `taloali.org`, `lamesaparks.org`, `bigsurfiddlecamp.org`, `losportscamps.com`, `tdrpd.org`, `camphopeca.com`, `wyomtbcamps.org`, `sumnerjrpanthers.com`, `rivertreearts.org` (3 rows), `musicworksnw.org` (4 rows), `theatre33wa.org`. This is the single highest-visibility defect in the directory and needs a rename-or-unpublish pass.
- **Fire Mountain Staff Alumni Association Camp** — already live and approved, `registration_url` points to a Facebook page, not a program page. Same underlying problem (staff-alumni content, not a bookable youth camp) that was recommended for rejection when a near-identical row surfaced in the pending queue two reviews ago — this one is already published.
- Corvallis, OR / zip 33174 mismatch: still **3** rows ("Nike Soccer Camp at Oregon State University" carrying a Miami, FL zip) — unchanged from last review, still open.
- `registration_url` missing: 523 of 1,972 approved (27%) — roughly flat vs. 498/1,777 (28%) last review.
- `domain_quality` table status not re-verified this run (out of this task's query scope this week).

## 4. Contact coverage (STEP 3e)

### Organizations table (`8cc3694a-...`)

| Metric | Count | % |
|---|---|---|
| Total organizations | 198,287 | — |
| With email | 199 | 0.1% |
| With phone | 428 | 0.2% |
| No channel at all | 197,810 | 99.8% |
| **Live-listing orgs with no channel** (org backs an approved program, has neither email nor phone) | **1,158 of 1,307** | **88.6%** |

The 198K figure is the full org-discovery pool, not just orgs behind published listings — 1,307 distinct organizations currently back the 1,972 approved programs (consistent with the duplicate-org pattern in §3b: many orgs per real-world program). Of those 1,307, 1,158 — nearly 9 in 10 — are published to the public with no way to reach them.

### Named-contact layer (`parent-coach-desk-ops-production`, `b38d5f37-...`)

The `org_contacts` table **exists** (migration 0028 is live — this is the first run where this section could execute rather than report the table missing).

| Metric | Value |
|---|---|
| Total contacts (not deleted) | 58 |
| Distinct orgs with a contact | 36 |
| Confidence: high / medium / low | 22 / 20 / 16 |
| Do-not-contact flagged | 0 |
| **Defect — missing both email and phone** | **57 of 58 (98%)** |
| **Defect — `is_public=1` with no `verified_at`** | 0 |

The near-total absence of email/phone on the contact rows themselves is the standout defect: 36 orgs have a named contact record, but only ~1 of those 58 rows actually carries a reachable channel. Whatever field the discovery/evergreen agents are populating on `org_contacts` right now, it isn't email or phone — worth checking what those 57 rows do contain (name only? a social handle?) since as constructed they don't accomplish the stated goal of reachability.

No previous week's report captured this section with working data — 2026-08-06 failed entirely on D1 access, and 2026-07-30 (the last successful run) predates this section's practical execution. This is the first real baseline; week-over-week deltas start next run.

## What changed since last week

- Since the last successful review (2026-07-30): approved grew 1,777 → 1,972 (+195), pending fell 151 → 72 (net, despite continued inflow — some of last week's evergreen batch appears to have cleared), rejected held flat at 857.
- Expired-live got materially worse: 960 → 1,208 (+248, now 61% of approved vs. 54%). The `system-recovery-2026-07-05` batch is the fastest-aging by far (58% → 87% expired).
- New/escalated: cross-org duplicate publishing measured precisely for the first time — 41 groups / 140 rows. Raw-code/garbled-name violations quadrupled (5 → 20). Exact-duplicate pairs more than doubled (5 → 11).
- Carried forward, still unfixed: dead Lakewood `activity_id=5272` link, dead i9 Sports Todd Beamer redirect, Corvallis/33174 zip mismatch (3 rows), broken daily cron sweep.
- New this week: the named-contact layer (`org_contacts`) is live for the first time (migration 0028 applied) — 58 contacts / 36 orgs, but 98% of those rows are missing both email and phone, so the layer isn't yet delivering reachable contacts.
- 2026-08-06's review could not run at all (no D1 access that week) — this review is the first full data pull since 2026-07-30, so some of the above deltas span two weeks rather than one.

## Recommendations (not acted on — read-only review)

1. Triage the 72-item pending queue per §2: approve 33 canonical rows, hold 36 duplicate-org rows for merge, needs-info the Camp STAR cluster (3 rows).
2. Fix the duplicate-organization-per-scrape bug in the evergreen extractor — it's generating a new `organization_id` on every re-run instead of matching to the existing org (12x on one program this week).
3. Bulk-review or bulk-archive the `system-recovery-2026-07-05` batch — 87% expired, the single biggest cleanup opportunity in the directory.
4. Rename or unpublish the 20 live listings with raw scraped code as their name (§3d) — quadrupled since last review, now the most visible defect.
5. Resolve the 41-group cross-org duplicate cluster (§3b) — likely the same root cause as #2, just already published.
6. Fix the two carried-forward dead links: Lakewood `activity_id=5272` and the i9 Sports Todd Beamer redirect.
7. Investigate what the 57 contact-less `org_contacts` rows actually contain — the named-contact layer went live this week but isn't capturing email/phone as intended.
8. Fix the Corvallis/33174 zip mismatch (3 rows, unchanged for 3+ weeks).
9. Create the `scheduler_attempts` table to unblock the daily cron sweep (unchanged ask from prior reviews).
