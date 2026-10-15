# Camps Review — 2026-10-15

**Summary:** Thursday S8 weekly quality pass (maintenance mode Aug–Nov: no S7 writes). Live directory healthy at **111** lite camps / **37** sports. Pending queue **0**. Backup clock **pass** (newest export 2026-10-11, ~3–4 days). Exact duplicate groups **8**. No Class C SQL staged this run.

## Maintenance mode

August–November: S7 discovery write step skipped. Logged as success with maintenance mode held. S8 report-only.

## Backup watch

- Newest: `backups/d1/activity-radar-2026-10-11-124353.sql` (365,570,925 bytes) + matching `.sha256`
- Age: **3–4 days** (pass under 7-day clock)
- Proving gate: cleared (see skill / BACKUP-PROVING-LOG)
- No export run this session (clock already passing)

## Live directory (S8 steps 1–2)

- https://parentcoachdesk.com/camps/ → 200
- Lite API → 111 camps / 37 sports (floor 50)
- sitemap-camps.xml → 111 `<url>` tags
- Brief post-deploy 500 on lite (~2 min) after Dana shipped `71187060`; recovered; camps page stayed 200 throughout

## D1 read-only (wrangler, every call `changes: 0` / `changed_db: false`)

| Metric | 2026-10-08 | 2026-10-15 |
| --- | --- | --- |
| Approved | 1,515 | 1,315 |
| Pending | 0 | **0** |
| Rejected | 1,455 | 1,655 |
| Approved with past `session_end_date` | 748 | 548 |
| Exact duplicate groups (org + name, approved) | 9 | **8** |
| `awaiting_review = 1` (approved) | 23 | **23** |
| `programs_staging` unpromoted | 0 | **0** |

Expiry cron continues to move approved → rejected (~25/day recently). Expired rows do not render on the live lite directory.

## Admin queue

Pending = 0. Nothing to triage. No approve/reject/edit performed.

## Fixes staged

**None.** Carry-overs remain report-only (same as 10-08 addendum):

1. 23 approved listings still `awaiting_review = 1` from the 2026-07-31 field audit — already live; next spot-check, not a Jeff decision today.
2. 8 exact duplicate groups — down one from 10-08; still not staging merges without Jeff Class C go.
3. 548 approved rows with past session_end_date — cron continues to shrink; not parent-facing on lite.

## needs_you

**None.**

<run-summary>S8 Thursday: maintenance mode held (no S7). Live floor 111/37. Pending 0. Backup clock pass (~3–4d). Dup groups 8. No staged SQL. needs_you none.</run-summary>
