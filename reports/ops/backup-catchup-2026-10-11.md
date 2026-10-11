# Weekly PCD backup - catch-up 2026-10-11 (Sat 07:12 run skipped, DESKTOP offline)

- `scripts\backup-activity-radar.ps1` on DESKTOP, wrangler OAuth eepskalla, CF tokens cleared.
- Export `backups\d1\activity-radar-2026-10-11-124353.sql`, 348.6 MB (365,570,925 bytes), single attempt.
- sha256 `94eb7ac90ec0e086032c17bd0369b12ff1f1ffb598303b399155148acac94d10`, `.sha256` sidecar present.
- 4 exports on disk (retention 8). Ledger row appended to `scripts/BACKUP-PROVING-LOG.md`.

## R2 check (Layer 2b, worker-backup)

- Bucket `pcd-db-backups` exists: **15 objects, 268 kB total**.
- `backups/backup-log.json` (and root `backup-log.json`): **key does not exist**.
- A full activity-radar export is ~350 MB, so the bucket cannot hold a complete offsite copy. Layer 2b offsite backup is **not proven / likely not working** (Saturday 07:00 PT cron `pcd-backup-worker`). needs_you: Jeff to look at the worker (cron firing? Slack alert secret set?). No changes made.
