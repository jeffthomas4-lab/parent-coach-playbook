# PCD backup worker

Weekly, off-machine, verified backup of the `activity-radar` D1 (the shared camp/organization
database — organizations, programs, camp_claims, camp_reviews, submitters, and the rest) to the
`pcd-db-backups` R2 bucket.

## Why this exists

The Cowork `pcd-backup` scheduled task (weekly, Saturday) dumped the D1 to `backups/` in this
repo and tried to `git add` + push it. `parent-coach-desk/.gitignore` line 45 is `backups/` —
gitignored specifically because a prior 200MB+ commit of this exact kind of dump broke `git push`
for the whole repo once already (see `BACKUP.md`). `git add backups/` on a gitignored path silently
stages nothing, so the task reported success every week while carrying zero data off the machine.
This Worker replaces the git step with R2: no size limit, no gitignore conflict, no local-machine
dependency.

## What it backs up, and where

- **Source:** D1 `activity-radar` (`database_id 8cc3694a-26f8-4a56-b131-d5d3a68c49ef`), read-only —
  every query in `src/index.ts` is a `SELECT`.
- **Destination:** R2 bucket `pcd-db-backups`, one dated folder per run:
  - `backups/<YYYY-MM-DD>/schema.sql` — every `CREATE TABLE` statement.
  - `backups/<YYYY-MM-DD>/<table>.json` — every row in that table, one JSON array.
  - `backups/<YYYY-MM-DD>/manifest.json` — per-table dumped/counted row counts and a `verified`
    flag for the whole run.
  - `backups/backup-log.json` — one row appended per run (date, table count, total rows, verified,
    worker version) — the proving-clock.
- **Retention:** the newest 8 dated folders are kept; older ones are deleted by the handler itself
  after a successful write. The just-written folder is always among the newest, so it is never a
  deletion candidate.

## Verification

Every table is paginated via `SELECT ... WHERE rowid > ? ORDER BY rowid LIMIT 1000` and the total
rows actually returned are compared against an independent `SELECT COUNT(*)`. Any table where those
two numbers disagree marks the whole run `verified: false` in the manifest and the backup-log row,
and sends a Slack alert — this is a genuine data-integrity check, not a stub: `src/index.test.ts`
proves it with an intentionally miscounted fixture (see Testing below).

A **successful, verified run posts nothing to Slack** — matching the existing agent convention (the
`pcd-deletion-monitor` and `pcd-backup`'s own original prompt both do proving-clock-only on success,
alert-only-on-failure). Only a verification failure or a genuine crash (missing binding, D1/R2
error) triggers `sendSlackAlert`.

## Cron

`0 14 * * 6` — Saturdays at 14:00 UTC, which is **7:00 AM Pacific Daylight Time**. Cloudflare Cron
Triggers are always UTC and do not observe DST, so this drifts to 6:00 AM Pacific Standard Time in
winter (the same accepted limitation as `worker-link-checker`'s cron comment). Re-check the offset
each spring/fall if an exact wake time matters.

## No public surface

This Worker has **no `fetch` handler** — its only entry point is the Cron Trigger. There is nothing
here reachable from a browser, no admin route, no response body to leak anything into. D1 and R2
are bound only to this Worker's scheduled context.

## Secret

`SLACK_WEBHOOK_URL` — the incoming webhook for `#pcd-agent-notications`. Set it interactively
(never in source, wrangler.toml, or a shell history):

```powershell
cd worker-backup
npm run secret:webhook
```

If the secret is unset, a failure still logs (`console.error`, no PII/secret in the message) but
cannot reach Slack — set it before relying on this Worker.

## Restoring from a dump

1. Pick the dated folder to restore from (`backups/<YYYY-MM-DD>/` in `pcd-db-backups`), or check
   `backups/backup-log.json` for the most recent `verified: true` date.
2. Download `schema.sql` and every `<table>.json` for that date (`wrangler r2 object get
   pcd-db-backups/backups/<date>/<file>` per file, or the R2 dashboard).
3. Recreate the schema: `wrangler d1 execute <target-db> --file=schema.sql`.
4. For each table, convert its JSON array back to `INSERT` statements (batched) and execute against
   the target D1. There is no bundled restore script yet — this has not been needed in production;
   write one before the first real restore is needed, and dry-run it against a throwaway D1 first.

## Local validation

```powershell
cd worker-backup
npm install
npm run typecheck
npm test
npm run build
```

`npm test` runs the full suite against in-memory D1/R2 fakes (no live Cloudflare resources
touched): pagination past 1000 rows, an unsafe-table-name refusal, the happy path (schema + every
table + manifest + backup-log written, verified true, no alert), the verification-failure path
(miscounted fixture → `verified: false` + the mocked webhook called with a message naming the
table), a webhook-unreachable case (a real backup problem is never masked by an alert-delivery
problem), and the retention prune (9 dated folders in, oldest 1 deleted, newest always kept).

`npm run build` is `wrangler deploy --dry-run --outdir ./dist` — compiles and bundles without
touching production, and prints the bindings it resolved (confirm `env.DB (activity-radar)` and
`env.BACKUPS (pcd-db-backups)` before ever deploying for real).

## Deployment (Jeff runs this — not Claude Code)

See the completion report for the exact paste-ready commands: create the R2 bucket, set the
`SLACK_WEBHOOK_URL` secret, deploy. After 2–3 verified runs land in `backup-log.json`, disable the
Cowork `pcd-backup` task — until then it keeps firing into the void (harmless; it backs up nothing)
alongside this Worker.
