# Camps sweep watch - 2026-10-10

**Agent:** camps sweep watch (catch-up after DESKTOP offline skip, Oct 9 night to Oct 10 morning)
**Machine:** DESKTOP (run 2026-10-10 ~06:40 PT)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (authoritative). Production sweep not manually invoked.

## Public checks

| Check | Result |
| --- | --- |
| /api/camps/lite | HTTP 200 - **111** camps, **37** sports (above 50 blackout floor) |
| sitemap-camps.xml | HTTP 200 - **111** <url> tags |
| Unauth POST /api/cron/camps-sweep | Rejected 403 (expected; auth required) |
| Wrangler whoami | eepskalla OAuth OK (CF tokens cleared) |

## Read-only D1 (activity-radar `programs`, `changes: 0`, `changed_db: false`)

| pcd_status | 2026-10-09 | 2026-10-10 |
| --- | --- | --- |
| approved | 1,490 | 1,465 |
| pending | 0 | 0 |
| rejected | 1,480 | 1,505 |

25-row approved-to-rejected shift, same pattern as the cron expired-row reject sweep on 10-09. Total rows unchanged (2,970).

## Backup clock

Newest export `activity-radar-2026-10-08-081311.sql`, 364.8 MB, age **2 days** (pass, 7-day clock). Weekly backup scheduled 07:12 PT today; not run by this catch-up.

## Status

success - floor healthy, sitemap healthy, pending queue 0, backup clock pass. needs_you: none.
