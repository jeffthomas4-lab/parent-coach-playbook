# Camps sweep watch - 2026-10-20

**Agent:** camps sweep watch
**Machine:** DESKTOP (catch-up after offline overnight 10/19-10/20)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (`0 13 * * *` UTC = 6:00 AM PT). Production sweep not manually invoked.

## Did the sweep run? Yes.

Read-only D1 `forge-command.scheduler_attempts` (`workflow_id = 'pcd-camps-sweep'`, `changes: 0`, `changed_db: false`):

| scheduled (UTC) | PT | status | result | metrics |
| --- | --- | --- | --- | --- |
| 2026-10-20T13:00:12Z | 10/20 6:00 AM | succeeded (finished 13:00:56Z) | sweep_completed | approved_future 108, stale_archived 25, has_more true |
| 2026-10-19T13:00:10Z | 10/19 6:00 AM | succeeded | sweep_completed | approved_future 108, stale_archived 25, has_more true |
| 2026-10-18T13:00:10Z | 10/18 6:00 AM | succeeded | sweep_completed | approved_future 110, stale_archived 25, has_more true |
| 2026-10-17T13:00:32Z | 10/17 6:00 AM | succeeded | sweep_completed | approved_future 111, stale_archived 25, has_more true |

## Public checks (from DESKTOP, ~6:36 AM PT)

| Check | Result |
| --- | --- |
| /api/camps/lite | 108 camps (above 50 blackout floor) |
| sitemap-camps.xml | HTTP 200 - 108 `<url>` tags (matches lite) |
| /camps/ | HTTP 200 |

## Notes

- `stale_archive_has_more: true` on every run: the stale-archive stage caps at 25 per sweep and the backlog is not cleared yet. Not a failure; it drains 25/day.
- Backup clock not re-run this watch (last pass 2026-10-19, export age 0d then).

## Status

success - sweep ran on schedule, floor healthy, sitemap matches. needs_you: none.
