# Camps sweep watch - 2026-10-14

**Agent:** camps sweep watch
**Machine:** DESKTOP (run 2026-10-14 ~06:35 PT)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (authoritative). Production sweep not manually invoked.
**Note:** `agents/pcd-camps-sweep-watch/SKILL.md` still missing on DESKTOP; used routine brief + prior report procedure.

## Public checks

| Check | Result |
| --- | --- |
| /api/camps/lite | HTTP 200 - **111** camps, **37** sports (above 50 blackout floor) |
| sitemap-camps.xml | HTTP 200 - **111** `<url>` tags (matches lite) |
| Unauth POST /api/cron/camps-sweep | Rejected 403 (expected; auth required) |
| Wrangler whoami | eepskalla OAuth OK (CF tokens cleared) |

## Read-only D1 (activity-radar `programs`, `changes: 0`, `changed_db: false`)

| pcd_status | 2026-10-13 | 2026-10-14 |
| --- | --- | --- |
| approved | 1,365 | 1,340 |
| pending | 0 | 0 |
| rejected | 1,605 | 1,630 |

25-row approved-to-rejected shift, same expiry pattern. Total rows unchanged (2,970).

## Backup clock

Newest export `activity-radar-2026-10-11-124353.sql`, 348.6 MB, `.sha256` sidecar present, age **2 days** (pass, 7-day clock).

## Status

success - floor healthy, sitemap healthy, pending queue 0, backup clock pass. needs_you: none. Cron attempt log not pulled (no forge-command / CF dashboard in this runtime); public surface and D1 expiry pattern look normal.
