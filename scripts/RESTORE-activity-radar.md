# Restoring `activity-radar`

Companion to `backup-activity-radar.ps1`. A remote restore is destructive and is
never authorized merely because this document exists. Stop autonomous writers,
take a fresh export, identify the exact recovery point, and obtain Jeff's explicit
approval before changing the remote database.

## Recovery options

### 1. D1 Time Travel for a recent incident

Time Travel is the preferred in-place recovery mechanism for the current D1
production storage system. Retention is plan-dependent: Cloudflare currently
documents 7 days on Workers Free and 30 days on Workers Paid. Do not assume which
window applies; inspect the account and the requested timestamp.

Read-only inspection:

```powershell
npx wrangler d1 time-travel info activity-radar
npx wrangler d1 time-travel info activity-radar --timestamp="2026-07-15T12:00:00-07:00"
```

The output provides a stable bookmark. Preserve the current bookmark before any
restore because it is the undo point.

Destructive restore — explicit approval required:

```powershell
npx wrangler d1 time-travel restore activity-radar --bookmark=<APPROVED_BOOKMARK>
```

Never run a restore without a bookmark or timestamp chosen from incident evidence.

### 2. SQL export for recovery outside the Time Travel window

Exports live under ignored `backups\d1\activity-radar-YYYY-MM-DD.sql` files. They
are standard SQLite SQL dumps containing `CREATE TABLE`, `INSERT`, and index
statements. They do **not** begin by dropping an existing schema.

Therefore this is unsafe and is not a restore procedure:

```powershell
# DO NOT RUN against the existing remote database.
npx wrangler d1 execute activity-radar --remote --file=<backup.sql>
```

It can fail on existing tables and does not provide an atomic replacement of the
live database. A dump recovery must first be proved on a fresh target. Promoting a
fresh remote D1 target would also require a separately approved binding cutover.

## Tested non-production proof

On 2026-07-15, a 245.3 MB export with 417,917 `INSERT` statements was restored to
a fresh local SQLite database in one transaction. `PRAGMA integrity_check` returned
`ok`; the restored counts matched the remote export snapshot exactly: 198,287
`organizations` and 2,411 `programs`.

The raw dump took an impractical amount of time through `wrangler d1 execute
--local`, even after wrapping it in a transaction, and that route was stopped
without a successful D1-local result. The tested local proof used Python's standard
SQLite driver because D1 exports standard SQLite SQL:

```powershell
python -c "import sqlite3,pathlib; src=pathlib.Path(r'backups\d1\activity-radar-YYYY-MM-DD.sql'); dst=pathlib.Path(r'backups\d1\restore-proof.sqlite3'); sql=src.read_text(encoding='utf-8'); con=sqlite3.connect(dst); con.execute('PRAGMA journal_mode=OFF'); con.execute('PRAGMA synchronous=OFF'); con.executescript('BEGIN;\n'+sql+'\nCOMMIT;'); con.close()"
```

Then verify aggregate facts, not row contents:

```powershell
python -c "import sqlite3; con=sqlite3.connect(r'backups\d1\restore-proof.sqlite3'); print(con.execute('PRAGMA integrity_check').fetchone()); print(con.execute('SELECT COUNT(id) FROM organizations').fetchone()); print(con.execute('SELECT COUNT(id) FROM programs').fetchone()); con.close()"
```

The proof database stays under ignored `backups\d1`. It is not a substitute for a
fresh non-production D1 import before any future dump-based binding cutover.

## Incident checklist before any remote restore

1. Identify the bad write's timestamp and affected tables.
2. Stop or disable every writer that can touch `activity-radar`, including the
   enrichment and Yelp Workers and any local scheduled discovery task.
3. Run `backup-activity-radar.ps1` to preserve the pre-restore state.
4. Record the current Time Travel bookmark.
5. Choose Time Travel or a fresh-target dump recovery; do not mix procedures.
6. Obtain explicit approval naming the database, recovery point, and method.
7. Restore.
8. Verify integrity, schema presence, key row counts, and application reads before
   re-enabling writers.

## Single-table recovery

Do not drop a live table and paste part of a dump ad hoc. Foreign keys, triggers,
indexes, and concurrent writers can make a partial replay inconsistent. Build and
verify the table recovery against a fresh non-production target, document dependent
objects, and obtain explicit approval for the exact remote SQL.

## What this does not cover

- R2 photos in `activityradar-photos`.
- Offsite copies; the SQL dumps remain local-only.
- Automatic pausing of Workers or local scheduled tasks.
- A remote non-production D1 clone. Cloudflare Time Travel currently restores in
  place; it does not clone the database.
