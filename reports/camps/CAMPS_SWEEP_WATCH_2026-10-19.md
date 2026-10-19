# Camps sweep watch - 2026-10-19

**Agent:** camps sweep watch
**Machine:** DESKTOP (catch-up after offline since Fri 10/16 evening)
**Scheduler:** Cloudflare Worker parent-coach-playbook-cron (authoritative). Production sweep not manually invoked.

## Public checks

| Check | Result |
| --- | --- |
| /api/camps/lite | HTTP 200 - **108** camps, **37** sports (above 50 blackout floor) |
| sitemap-camps.xml | HTTP 200 - **108** `<url>` tags (matches lite) |
| /camps/ | HTTP 200 |

## Read-only D1 (activity-radar `programs`, `changes: 0`, `changed_db: false`)

| pcd_status | n |
| --- | --- |
| approved | 1,215 |
| rejected | 1,755 |
| pending | 0 |

Total rows 2,970. Pending queue 0. Approved count down from 1,315 on 10/15 (expiry cron; expected).

## Backup clock

Newest export `activity-radar-2026-10-19-080615.sql`, 349.2 MB (366,203,999 bytes), sha256 `fb6fc128606a448d6395056f0272586ec0a072d86fa48dd8ad02899956c3aa79`, age **0 days** (pass, 7-day clock).
R2 offsite (worker-backup): newest verified `backups/2026-10-16` — 28 tables, 426,237 rows, 334.0 MB JSON parts, `verified: true`. Also `2026-10-11` verified. Oct 17 Saturday local PS1 skipped (offline); worker still landed Oct 16 verified copy.

## Status

success - floor healthy, sitemap healthy, pending queue 0, backup clock pass. needs_you: none.
