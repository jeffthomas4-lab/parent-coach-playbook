# Camps sweep watch - 2026-10-23

**Agent:** camps sweep watch
**Machine:** DESKTOP (catch-up after DESKTOP was offline overnight; run ~11:10 AM PT 10/23)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (`0 13 * * *` UTC = 6:00 AM PT). Production sweep not manually invoked.

## Did the sweep run? Yes.

Read-only D1 `forge-command.scheduler_attempts` (`workflow_id = 'pcd-camps-sweep'`, `changes: 0`, `changed_db: false`):

| scheduled (UTC) | PT | status | result | metrics |
| --- | --- | --- | --- | --- |
| 2026-10-23T13:00:12Z | 10/23 6:00 AM | succeeded (finished 13:00:48Z) | sweep_completed | approved_future 108, stale_archived 25, has_more true |
| 2026-10-22T13:00:12Z | 10/22 6:00 AM | succeeded (finished 13:00:54Z) | sweep_completed | approved_future 108, stale_archived 25, has_more true |

## Public checks (from DESKTOP, ~11:10 AM PT 10/23)

| Check | Result |
| --- | --- |
| /api/camps/lite | HTTP 200, ok true, 108 camps, 37 sports (above 50 blackout floor) |
| sitemap-camps.xml | HTTP 200 - 108 `<url>` tags (matches lite) |
| /camps/ | HTTP 200 |

## Notes

- `stale_archive_has_more: true` again: stale-archive stage caps at 25 per sweep; backlog still draining (approved rows with past session_end_date now 351, down from 376 on 10/22 and 548 on 10/15). Not a failure.
- Ranger's own S8 review and backup clock are not part of this file (Ranger's 10/22 S8 report is the latest: pass, newest export 2026-10-19).

## Status

success - sweep ran on schedule, floor healthy, sitemap matches. needs_you: none.