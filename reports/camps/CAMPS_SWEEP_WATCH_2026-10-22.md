# Camps sweep watch - 2026-10-22

**Agent:** camps sweep watch
**Machine:** DESKTOP (catch-up after the morning usage outage; run ~8:30 AM PT 10/22)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (`0 13 * * *` UTC = 6:00 AM PT). Production sweep not manually invoked.

## Did the sweep run? Yes.

Read-only D1 `forge-command.scheduler_attempts` (`workflow_id = 'pcd-camps-sweep'`, `changes: 0`, `changed_db: false`):

| scheduled (UTC) | PT | status | result | metrics |
| --- | --- | --- | --- | --- |
| 2026-10-22T13:00:12Z | 10/22 6:00 AM | succeeded (finished 13:00:54Z) | sweep_completed | approved_future 108, stale_archived 25, has_more true |
| 2026-10-21T13:00:12Z | 10/21 6:00 AM | succeeded (finished 13:01:17Z) | sweep_completed | approved_future 108, stale_archived 25, has_more true |

## Public checks (from DESKTOP, ~8:30 AM PT 10/22)

| Check | Result |
| --- | --- |
| /api/camps/lite | HTTP 200, ok true, 108 camps, 37 sports (above 50 blackout floor) |
| sitemap-camps.xml | HTTP 200 - 108 `<url>` tags (matches lite) |
| /camps/ | HTTP 200 |

## Notes

- `stale_archive_has_more: true` again: stale-archive stage caps at 25 per sweep; backlog still draining (approved rows with past session_end_date now 376, down from 548 on 10/15). Not a failure.
- Backup clock checked in today's Ranger S8 report (pass, newest export 2026-10-19, hash verified).

## Status

success - sweep ran on schedule, floor healthy, sitemap matches. needs_you: none.
