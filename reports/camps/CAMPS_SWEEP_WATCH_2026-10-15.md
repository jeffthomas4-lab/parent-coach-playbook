# Camps sweep watch - 2026-10-15

**Agent:** camps sweep watch
**Machine:** DESKTOP (catch-up ~08:35 PT after overnight offline skips)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (authoritative). Production sweep not manually invoked.
**Note:** `agents/pcd-camps-sweep-watch/SKILL.md` still missing on DESKTOP; used prior report procedure.

## Public checks

| Check | Result |
| --- | --- |
| /api/camps/lite | HTTP 200 - **111** camps, **37** sports (above 50 blackout floor). Brief 500 after Dana deploy cold-start; recovered within ~2 min (CF HIT). |
| sitemap-camps.xml | HTTP 200 - **111** `<url>` tags (matches lite) |
| /camps/ | HTTP 200 |
| Unauth POST /api/cron/camps-sweep | Not re-probed this catch-up (prior days 403 expected) |
| Wrangler whoami | eepskalla OAuth OK (CF tokens cleared) |

## Read-only D1 (activity-radar `programs`, `changes: 0`, `changed_db: false`)

| pcd_status | 2026-10-14 | 2026-10-15 |
| --- | --- | --- |
| approved | 1,340 | 1,315 |
| pending | 0 | 0 |
| rejected | 1,630 | 1,655 |

25-row approved-to-rejected shift again (expiry cron). Total rows unchanged (2,970).

## Backup clock

Newest export `activity-radar-2026-10-11-124353.sql`, 348.6 MB, `.sha256` sidecar present, age **3–4 days** (pass, 7-day clock).

## Status

success - floor healthy, sitemap healthy, pending queue 0, backup clock pass. needs_you: none.
