# Camps Review - 2026-10-22

**Summary:** Thursday S8 weekly quality pass (catch-up after the morning usage outage, run on DESKTOP ~8:30 AM PT). Live directory healthy at **108** lite camps / **37** sports. Pending queue **0**. Backup clock **pass** (newest export 2026-10-19, 3 days, hash verified). Exact duplicate groups **4** (organization_id + name, approved). No Class C SQL staged this run. Queue summary: nothing pending.

## Kill switch and S7

- `forge-command.agent_registry` ranger = `active`.
- S7 discovery write step **not run** in this catch-up. Ranger's skill step 4 still describes the old August-November hold, but `PCD-OPERATING-MANUAL.md` 3.4 (updated 2026-08-01) says maintenance is toggle-only via `PCD_MAINTENANCE_MODE`, and the manual wins. Same stale-hold mismatch as the open Sunny/Frida item (`sunny-registry-paused-2026-10-21`). S7 is the nightly Class D pass (browser discovery + live writes); a morning catch-up executor did not take unattended live writes on a contradicted rule. Owner call for Jeff: resume S7 nightly, or keep holding and fix the skill text.
- `node scripts/agent-run-client.mjs preflight`: fails, `PCD_AGENT_RUNS_TOKEN is not available in the runtime secret environment` (open item `agent-runs-token-missing-2026-10-21`). Run logged here only.

## Backup watch

- Newest: `backups/d1/activity-radar-2026-10-19-080615.sql` (366,203,999 bytes) + matching `.sha256` (SHA-256 recomputed and matches)
- Age: **3 days** (pass under 7-day clock)
- Proving gate: cleared (see skill / BACKUP-PROVING-LOG)
- No export run this session (clock already passing)

## Live directory (S8 steps 1-2)

- https://parentcoachdesk.com/camps/ -> 200
- Lite API -> 108 camps / 37 sports (floor 50)
- sitemap-camps.xml -> 108 `<url>` tags (matches lite)

### Spot-check: 10 random approved, future-dated listings' registration URLs

| HTTP | Host | Note |
| --- | --- | --- |
| 200 | anc.apm.activecommunities.com | cooking camp (evg-org-6f8f925e...) |
| 200 | www.ussportscamps.com | Nike indoor soccer, Rancho Solano (ends 2026-12-30) |
| 200 | www.ussportscamps.com | Nike boys soccer ID, Bozeman (junior elite) |
| 200 | www.ussportscamps.com | Nike baseball, George Fox (half day) |
| 403 | www.hisawyer.com | multi-sport (evg-org-289e7e05...) - bot wall, homepage also 403 to scripted fetch |
| 200 | www.ussportscamps.com | Nike girls soccer, University of Portland |
| 200 | www.ussportscamps.com | Nike boys soccer ID, Bozeman (college ID) |
| 200 | www.ussportscamps.com | Nike girls soccer ID, Bozeman |
| 200 | tacomacapoeiracenter.com | youth capoeira classes |
| 403 | www.hisawyer.com | soccer (evg-org-86de58dc...) - same bot wall |

8/10 return 200; the 2 hisawyer 403s are the vendor blocking scripted requests, not dead links. Note: 8 of the 10 carry a placeholder `session_end_date` of 2028-08-31 (evergreen org rows); not a parent-facing date problem on lite, carried as an observation.

### Expired-camp policy (S8 step 3)

Checked the 4 most recently expired slugs (rejected `past-date` by this morning's sweep):

| Slug | Result |
| --- | --- |
| san-francisco-soccer-camp-junior-premier-vi-sold-out-july-20-24-2026 | 301 -> /camps/ |
| camp-yougottawanna-week-5 | 301 -> /camps/wa/ |
| nike-baseball-camp-at-george-fox-university-all-skills-camp-july-20-24-2026-xanm | 301 -> /camps/or/ |
| nike-soccer-camp-in-minooka-july-20-24-2026 | 301 -> /camps/il/ |

No bare 404s. One redirect lands on `/camps/` root rather than a state hub (probably no `/camps/ca/` hub or no state on the row); minor, not a policy gap. For Nora: GSC-side 404 reads should reconcile against these 301s.

## D1 read-only (wrangler, every call `changes: 0` / `changed_db: false`)

| Metric | 2026-10-15 | 2026-10-22 |
| --- | --- | --- |
| Approved | 1,315 | 1,140 |
| Pending | 0 | **0** |
| Rejected | 1,655 | 1,830 |
| Approved with past `session_end_date` | 548 | 376 |
| Exact duplicate groups (approved) | 8 | **4** (organization_id + name) |
| `awaiting_review = 1` (approved) | 23 | **23** |
| `programs_staging` unpromoted | 0 | **0** |

Expiry cron continues to move approved -> rejected (25/day). Expired rows do not render on the live lite directory.

## Admin queue

Pending = 0. Nothing to triage. No approve/reject/edit performed.

## Fixes staged

**None.** Carry-overs remain report-only:

1. 23 approved listings still `awaiting_review = 1` from the 2026-07-31 field audit - already live; next spot-check, not a Jeff decision today.
2. 4 exact duplicate groups (org + name) - not staging merges without a Jeff Class C go.
3. 376 approved rows with past session_end_date - cron continues to shrink; not parent-facing on lite.

## needs_you

- Owner call (soft, not urgent): S7 hold vs manual 3.4 toggle-only rule (see Kill switch and S7). Backup clock: pass, nothing needed.

<run-summary>S8 Thursday catch-up: live floor 108/37, pending 0, backup clock pass (3d, hash ok), dup groups 4, expired slugs 301 (no 404s), no staged SQL. S7 not run; skill-vs-manual hold mismatch flagged for Jeff.</run-summary>
