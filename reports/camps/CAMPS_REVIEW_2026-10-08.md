# Camps Review — 2026-10-08

**Summary:** S8 weekly catch-up after Thursday morning loud-skip. Live directory healthy at **111** lite camps / **37** sports (floor 50). D1 MCP not available this session — no pending-queue SQL, no staged D1 statements. Report-only from live page + lite API + backup clock.

## Backup watch

- scripts/BACKUP-PROVING-LOG.md: **missing**
- backups/d1/: **missing / empty**
- Gap: **undefined** (no export on file). Remains a needs_you every run until three clean proving rows exist. Ranger does not run the export.

## Live directory (S8 steps 1–2, public)

- https://parentcoachdesk.com/camps/ → 200
- Lite API → 111 approved/future-shaped rows across 37 sports (was 111 after Oct 6 floor catch-up)
- Page copy still notes PNW density vs lighter national listings
- Spot-check sample from lite cards (name/city/state present): Nike Soccer Camp at Pioneer Park (Tumwater, WA); Nike Volleyball Camp at The Courts (Beaverton, OR); PVBC Youth Club (Pewaukee, WI); Nike Soccer Camp in Northbrook (IL). Lite payload does not expose website URLs in this session, so outbound website liveness was not re-probed beyond the directory surface.

## Expired-camp policy / 404 gap

Not re-audited with GSC this run. Nora's 2026-10-05 review still held expired-camp examples as 301 to hubs. No new bare-404 camp slug found from this public pass.

## Admin queue

Browser admin queue not granted this session. No approve/reject/edit performed (skill forbids it anyway). Prior backlog from CAMPS_REVIEW_2026-09-03.md / blocked 2026-09-10.md remains open and unmeasured without D1.

## Fixes staged

**None.** No D1 statements written. Class C staging requires exact SQL against live rows; inventing SQL without a query would be unsafe.

## needs_you

1. Backup proving clock still at zero — Jeff to run scripts/backup-activity-radar.ps1 paste from BACKUP.md until three separate days are logged.
2. Reconnect Cloudflare D1 MCP (or equivalent query path) so Thursday S8 can triage the pending queue again.

<run-summary>S8 catch-up: live floor healthy (111/37). No D1 tool → no staged fixes. Backup gap still undefined. Prior Sept backlog unchanged.</run-summary>


---

## Addendum 2026-10-08 (Rex desk resolution, D1 via wrangler on DESKTOP)

**Correction to the backup watch above.** The "missing" lines were a read error: the report's path strings carried `\b` and `\n` escapes, so `backups/d1` was never actually listed. Real state at 08:05 PT: `scripts/BACKUP-PROVING-LOG.md` present, proving gate cleared 2026-07-17 (runs on 07-15, 07-16, 07-17). Exports on disk from 2026-09-19 (339 MB) and 2026-09-26 (340 MB), so the newest was **12 days old**, a fail under the 7-day freshness clock now defined in the Ranger skill and BACKUP.md.

**Fresh export run.** `scripts/backup-activity-radar.ps1` on DESKTOP (wrangler OAuth eepskalla, CF tokens cleared) at 08:13 PT: 347.9 MB, 1 attempt, sha256 `a74070028579a491dbf50eb34153314d60737dfc44e380fac23a046514a57366`, ledger row appended. Clock: **0 days**.

**S8 queries (read-only, `npx wrangler d1 execute activity-radar --remote --json`, every call `changes: 0`):**

| Metric | 2026-09-03 | 2026-10-08 |
|---|---|---|
| Approved | 1,972 | 1,515 |
| Pending | 119 | **0** |
| Rejected | 857 | 1,455 |
| Approved with past `session_end_date` | 1,295 (65.7%) | 748 (49.4%) |
| `system-recovery-2026-07-05` expired | 605 / 621 | 573 / 583 (98.3%) |
| Exact duplicates (same org + name, approved) | 11 pairs / 22 rows | 9 groups / 18 rows |
| Approved missing `registration_url` | 523 (26.5%) | 497 (32.8%) |

**Pending-queue triage: nothing to triage.** The 119-row backlog from 09-03 was worked off: `pcd-p1-evergreen-2026-09-17` approved 98 and rejected 3, `pcd-jeff-ussportscamps-reject-2026-09-19` rejected the 40 ussportscamps duplicate-org rows, and `cron` has rejected 550 expired rows since 09-04 (latest review 2026-10-08 06:01 PT). Camp STAR: all 3 rows now `rejected`, closing the four-review carry-over. `programs_staging`: 311 rows, all promoted.

**Carry-overs, report-only, no SQL staged this run:**

1. 23 approved listings still carry `awaiting_review = 1` from the 2026-07-31 field audit (17 domains, led by bothellvbc.org with 4). Already live; flag for the next S8 spot-check rather than a Jeff decision.
2. `system-recovery-2026-07-05` is 98.3% expired. The cron reject sweep is shrinking the total expired count, but it has not reached this batch. Expired rows do not render on the live directory (111 future-shaped cards), so no parent-facing harm today.
3. Exact duplicates down to 9 groups. Missing registration URL is flat in absolute terms; the rate rose only because the approved base shrank.

**needs_you after this addendum: none.** Both items above are closed. The backup clock passes, and S8 has a working D1 query path documented in `automation/agents/ranger/SKILL.md`.
