# Camps Review — 2026-07-30

**Summary:** 151 pending programs to triage (up from 107) — recommend approve ~144, reject 2, needs-info ~17 (evergreen batch fully clean, scraped batch identical to the last two weeks and still unactioned). Expired-but-live approved listings grew to 960 (from 796). New this week: 5 approved live listings carry raw CSS/HTML code as their program name, and the "WA-focused directory" framing used in the last three reviews is contradicted by the repo's own build doc — this directory is documented as national in scope.

## Database note

Same `programs`/`organizations` D1 (`pcd_status`, database_id `8cc3694a-...`) used in the three prior reviews. `CAMPS_QUALITY_FRAMEWORK.md` still describes a different, older schema (a standalone `camps` table tied to parentcoachplaybook.com) that doesn't match this database — flagged as open since 2026-07-09, still unaddressed.

**Scope correction:** `CAMPS_BUILD_PROMPT.md` (line 34) documents the geographic scope as *"National from day one, with the Pacific Northwest as the editorial focus... National listings welcome but light coverage outside PNW for now."* The last three reviews (including this one's predecessor) described the product as a "WA-focused directory" and used out-of-region status as part of the reject rationale for at least one pending item (Susan L Curtis Charitable Foundation, Maine, 2026-07-23). That framing doesn't match the documented scope. Region should not be used as a reject reason going forward — only whether the org and program are real and legitimate.

## 1. Directory counts

- `pcd_status`: approved 1,777 / pending 151 / rejected 857 (total 2,785)
- Approved with `session_end_date` in the past: **960** (54% of approved, up from 796 / 45% last week)
- Pending: **151** (up from 107)
- Approved by state: only 604 of 1,777 (34%) are in WA; the other 66% span all 50 states (CA 295, MA 99, OR 58, IL 50, ME 47, NY 45, and smaller counts down to single digits in most other states). Not a violation given the documented national scope, but worth noting since it runs well past the build doc's "light coverage outside PNW" aspiration.

## 2. Pending queue triage (n=151)

**128 evergreen_extract, 23 scraped.** All 151 pending rows are dateless (confirmed — none carry `session_start_date`/`session_end_date`), so per the EVERGREEN RULE none were judged on date currency.

**Evergreen batch (128) — recommend APPROVE**, with three carve-outs:

- **7 "Camp Create Week 1–7" items** (Lakewood Parks & Rec, `activity_id=5272` deep link) — same dead-link issue flagged the last two reviews, still open. A newer, separate pending row for the same program now carries a cleaner registration URL (`https://cityoflakewood.us/youthprograms/`) — recommend backfilling that URL onto the other six before/at approval instead of the dead deep link.
- **8 Federal Way Community Center items** (`itallhappenshere.org`) — verified live; the site confirms Sylvan STEM, Snapology STEAM, Ballerina Dream Camp, and the K-8/DCIT/Fireflies camps are all real 2026 programs. Data issue: all 8 rows share the organization name "Federal Way K-8 Summer Camp Week 1" even though most of them are the specialty camps (Sylvan STEM, Ballerina Dream, etc.), not that K-8 program. Approve, but flag the org-name field for cleanup so each specialty camp is labeled correctly.
- **1 Enumclaw Hornets Volleyball Camp item** (`activekids.com`) — verified live, but the page title itself reads "2026 Hornets Volleyball Camp Grades 3-5th **CLOSED**" for a session that already ran (July 20–22). Approve the org/program, but flag the name for a refresh before the winter pre-season pass reuses it — otherwise "CLOSED" and last session's dates carry forward as if permanent.
- Remaining ~112 evergreen items: previously-verified repeat domains (ussportscamps.com, breakthroughbasketball.com, challengersports.com, i9sports.com, activecommunities.com/rec1.com, sahaleoutdoors.org, ymcapkc.org) plus 8 newly spot-checked single-org domains this run — wolfcamp.org (Wolf Camp, Puyallup), ramshoops.com (Ram Basketball, Puyallup), penmetparks.org (PenMet Parks), pacificlutheranvolleyballcamps.totalcamps.com (PLU Volleyball Camps), onysoccer.com (Onalaska Youth Soccer), grizzlieshoops.org (Grizzlies Select Basketball, Snohomish), cityoflakewood.us. All verified real, live, legitimate youth programs — no issues found.

**Scraped batch (23) — unchanged from 2026-07-16 and 2026-07-23.** These are the exact same 23 rows, byte-for-byte the same names/orgs, sitting untouched for a third straight week. Recommendations carried forward:

| Org | Program | Rec. | Why |
|---|---|---|---|
| Fire Mountain Staff Alumni Association | "Helped staff the 2022 Council Camporee" | **Reject** | Live site is a Scout-camp staff-alumni donor page, not a bookable youth program. (Reject stands on this basis alone — not on region, see scope correction above.) |
| Susan L Curtis Charitable Foundation | "2026 Campfire Under The Stars Gala" | **Reject** | Legitimate camp org, but the scraped item is their adult fundraising gala, not a camper program. Region is no longer part of the rationale. |
| Bothell Vbc (x4) | Advanced Summer Camp, Summer Camp I, Middle School Camp, Summer Camp II | **Approve** | Verified live — org site lists all 4 with real 2026 dates. `registration_url` still null on all 4; backfill from the org site. |
| 17 others (Soccer For Change, Puget Sound Guitar Workshop x2, Bearnstow x2, Samena Club x2, Curtain Up Enterprises, Bainbridge Ballet, Ketcha Outdoors, Evergreen Chess Club, Music Works NW, Northwest Theatre Productions, Theatre33, Kids In Concert, Nextgen Youth Empowerment, River Tree Arts) | — | **Needs-info** | Same scraper-artifact problems as last two reviews: missing `registration_url` on all 17, and several program names are still bare fragments (Bearnstow's second row is literally "Session 2: July 6 – July 17," Samena's second row is garbled nav text, River Tree Arts' name is a bare date string, Kids In Concert's title still says "2025"). Needs a manual pass before approval. |

## 3. Live listing QA (approved, n=1,777)

**a. Expired sessions.** 960 approved listings have a past `session_end_date`, up from 796 last week (+164). By approval batch (`reviewed_by`):

- `sonnet-bulk-approval`: 931 total, 561 now expired (was 535 — +26)
- `system-recovery-2026-07-05`: 621 total, 362 now expired (was 235 — **+127 in one week**, the fastest-aging batch by far; this batch appears to cluster around session dates that are now all rolling past)
- `enrichment-worker (auto-approve)`: 225 total, 37 now expired (was 26 — +11, still the best hit rate of the three)

Root cause carried forward from the last three reviews (not independently re-verified this run, since the `forge-command` D1 that hosts `scheduler_attempts` isn't in scope of this task's database access): the daily cron sweep has reportedly been broken since before 2026-07-09.

**b. Duplicates.** Same 5 organization+name pairs as the last two reviews, still unmerged: Camp Create Week 1, Week 3, Week 4, Week 5 (Lakewood Parks & Rec — see §2 for the registration-URL angle), and Skagit Valley Tennis Association Camp (one null shell row, one row with real dates).

**c. Dead/stale links.** Spot-checked 13 live sources this run (prioritizing domains not checked in the last three reviews):

- **Live and matching:** pdza.org (Pt. Defiance Zoo camps — sold out but real), mountaineers.org (Tacoma Rock & Ropes camp — session already ended, consistent with its `session_end_date`), tdrpd.org (Truckee-Donner CA rec catalog — generic catalog link, not program-specific, but functional), wolfcamp.org, ramshoops.com, penmetparks.org, pacificlutheranvolleyballcamps.totalcamps.com, onysoccer.com, grizzlieshoops.org, cityoflakewood.us, itallhappenshere.org, activekids.com (9 more, see §2).
- **Inconclusive:** bgcsps.org (Boys & Girls Club South Puget Sound) — page loaded but returned no extractable text content, likely a JS-heavy page; not confirmed dead, just not verifiable by this method. Recommend a manual look.
- **Previously flagged, not re-checked this run:** the dead `activity_id=5272` Lakewood link and the i9 Sports Todd Beamer redirect from the last two reviews — no evidence either was fixed (reviewed_by totals for the relevant batches are unchanged from last week).

**d. Quality-framework violations.**

- **New this week:** 5 approved, live listings have raw CSS/HTML fragments as their program name instead of a real title — not caught in the last three reviews:
  - `tacomatigers.com` (Tacoma, WA) — name is literally `elementor-heading-title[class*=elementor-size-]>a{color:inherit;font-size:inherit;line-height:inherit}`
  - `wyomtbcamps.org` (Cheyenne, WY) — name starts with `vcex_6a5053b194bf4{color:#4e6874;font-size:2em;}...`
  - `camphopeca.com` (San Diego, CA) — name is "October 24 & 25 For First-time Campers"
  - `rivertreearts.org` (Kennebunk, ME) — 2 rows named "Dates: August 10-14; 5 day camp (Monday-Friday)" and "Dates: August 17-21; 5 day camp (Monday-Friday)"
  - These need a manual rename or unpublish — a live public listing showing raw CSS is a visible, obvious defect regardless of region.
- The Corvallis, OR / zip 33174 mismatch is still present but down to **3** rows (was 5 last week) — "Nike Soccer Camp at Oregon State University" still carries the Miami, FL zip code. Cause of the count drop from 5→3 not determined this run (not re-verified against a change log).
- `domain_quality` table is still completely empty (0 rows) — 4th consecutive review flagging this, still unaddressed.
- 498 of 1,777 approved programs (28%) have no `registration_url` — unchanged from last week (approved set didn't change).

## What changed since last week (2026-07-23)

- Approved held flat at 1,777 and rejected held flat at 857 — **no approvals or rejections were processed against last week's recommendations.** All movement was new pending submissions (+44) and further aging of already-approved expired sessions.
- Pending grew 107 → 151 (+44), entirely new `evergreen_extract` rows; the 23 scraped rows are unchanged, byte-for-byte, for the third week running — none of the prior recommendations (2 rejects, 4 approves, 17 needs-info) have been acted on.
- Expired-live got worse: 796 → 960 (+164), with the `system-recovery-2026-07-05` batch aging fastest (+127 alone).
- New finding: 5 approved listings with raw CSS/code fragments as their name (tacomatigers.com, wyomtbcamps.org, camphopeca.com, rivertreearts.org x2).
- New finding / correction: the repo's own `CAMPS_BUILD_PROMPT.md` documents this as a national directory with a Pacific Northwest editorial focus, not a WA-only directory as the last three reviews assumed. Only 34% of approved listings are actually in WA.
- Corvallis/33174 zip mismatch: 5 → 3 rows, still open.
- Still open, unaddressed for a 4th consecutive week: missing `scheduler_attempts` table (root cause of the sweep failure, not independently re-verified this run), empty `domain_quality` table.

## Recommendations (not acted on — read-only review)

1. Triage the 151-item pending queue per §2 (approve ~144, reject 2, needs-info ~17) — none of last week's equivalent recommendations have been actioned yet either.
2. Fix the dead `activity_id=5272` Lakewood registration link by swapping in `cityoflakewood.us/youthprograms/`, and refresh the i9 Sports Todd Beamer venue link (both carried forward, unfixed).
3. Rename or unpublish the 5 approved listings whose names are raw CSS/HTML fragments (highest-visibility defect found this run).
4. Merge the 5 duplicate pairs identified in §3b (unchanged for 3 weeks).
5. Investigate the `system-recovery-2026-07-05` batch specifically — it's aging into expiry far faster than the other two approval batches (+127 expired in one week) and would give the biggest one-time cleanup if bulk-reviewed or bulk-archived.
6. Create the `scheduler_attempts` table in `forge-command` D1 to unblock the daily cron sweep — still the highest-leverage fix, unchanged ask from the last three reviews.
7. Backfill/populate the empty `domain_quality` table so source-quality reporting can function.
8. Fix the remaining Corvallis/33174 zip mismatch (3 rows).
9. Reconcile or replace `CAMPS_QUALITY_FRAMEWORK.md` (still describes a different database/schema) and correct the "WA-focused directory" framing used internally in prior reviews to match the documented national scope in `CAMPS_BUILD_PROMPT.md`.
