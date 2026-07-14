# Restoring activity-radar from a backup

Companion to `backup-activity-radar.ps1`. Read this before you run anything below. A
full restore is destructive: it overwrites live data that `org-discovery-daily-worklist`
and the two ActivityRadar Workers write to every day.

## When you need this

- `org-discovery-daily-worklist` writes a bad batch (wrong confidence scoring, a bug
  that corrupts organizations or programs rows).
- A table gets dropped or rows get deleted by accident, by hand or by script.
- Any other case where the live `activity-radar` D1 needs to go back to a known-good
  point.

## Before you restore anything

1. Check whether D1 Time Travel covers it first. It is faster than a dump replay and
   does not need a local backup file at all:

```powershell
npx wrangler d1 time-travel restore activity-radar
```

   Time Travel gives point-in-time recovery within its retention window (30 days on
   the free tier). If the bad write happened recently, this is the first thing to try,
   not the dump replay below.

2. If Time Travel does not cover it (older than the window, or you need a specific
   dated snapshot), pick the right backup file:

```powershell
Get-ChildItem backups\d1\activity-radar-*.sql | Sort-Object LastWriteTime -Descending
```

   Backups keep the last 8 runs. Confirm the date you want is still on disk before you
   start.

3. `org-discovery-daily-worklist` runs at 9:02 PM every night and writes to this same
   database. Do not run a restore in the hour before or during that window. Check the
   scheduled-tasks list if you are not sure what time it is relative to that run.

4. Take a fresh export first, even if it is the bad one. If the restore goes wrong, you
   want a way back to where you started:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
.\scripts\backup-activity-radar.ps1
```

## Full restore (destructive)

This replays every statement in the dump file against the live database. Anything
written after that dump's timestamp is gone unless it is also in the dump.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
npx wrangler@latest d1 execute activity-radar --remote --file=backups\d1\activity-radar-2026-07-13.sql
```

Swap the date for the backup you picked in step 2.

## Restoring a single table

A full replay is overkill if only one table is bad, for example `organizations` got a
corrupted batch but `programs`, `sessions`, and the rest are fine.

1. Open the dump file and find the `CREATE TABLE` and `INSERT INTO` statements for
   just that table. `wrangler d1 export` writes one table's statements as a
   contiguous block, so this is a plain text search, not a parse job.
2. Copy those statements into a new `.sql` file.
3. Drop and recreate just that table against live, then replay the copied inserts:

```powershell
npx wrangler d1 execute activity-radar --remote --command "DROP TABLE IF EXISTS organizations;"
npx wrangler d1 execute activity-radar --remote --file=organizations-only.sql
```

Check the schema migration files in `migrations-activity-radar/` first if the table
has foreign keys or triggers. A single-table restore that skips a dependent table can
leave orphaned rows.

## Verify after any restore

Run a count check against what you expect, not just "did the command exit clean":

```powershell
npx wrangler d1 execute activity-radar --remote --command "SELECT count(*) FROM organizations;"
npx wrangler d1 execute activity-radar --remote --command "SELECT count(*) FROM programs;"
```

Compare against the count in the Operating Manual (section 1.1, 196,252 organizations,
910 enriched) or against the backup file's own row count if the manual is stale. A
number far off from expected means the restore landed wrong, not that the count moved
naturally.

## What this does not cover

- **R2 photos.** Camp hero photos live in the `activityradar-photos` bucket, not this
  D1. See BACKUP.md Layer 3.
- **Offsite copies.** These backups are local-only, same gap BACKUP.md Layer 2 already
  names. If this machine's disk fails the same day as a bad write, there is no second
  copy. D1 Time Travel does not depend on this machine, which is why step 1 above
  checks it first.
- **The two Cloudflare Workers.** `activityradar-enrichment` and `activityradar-yelp`
  read and write the same D1 on their own crons. A restore does not pause them. If you
  are mid-restore near their run times, expect them to write against whatever state
  the database is in at that moment.
