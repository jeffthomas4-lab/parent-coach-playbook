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

`scripts/restore.mjs` is the bundled restore tool. It is a local Node CLI Jeff runs by hand — a
restore is a rare, high-blast-radius DR action, never a scheduled job, never reachable from a
Worker route.

### What it does

1. Resolves `--target` to a `database_id` (`wrangler d1 info <target> --json`, or the id directly
   if `--target` is already a UUID) and runs the **production guard** before touching anything else
   (see below) — a blocked call never reads R2 or writes D1.
2. Picks the backup date: `--date YYYY-MM-DD`, or the latest date in `backups/backup-log.json` when
   omitted.
3. Downloads `manifest.json` for that date (`wrangler r2 object get`) and refuses to proceed if
   `manifest.verified !== true`, unless `--force` is passed (logs a loud warning).
4. Downloads `schema.sql`, replays every `CREATE TABLE` into the target, and works out a
   foreign-key-respecting load order by parsing each table's `REFERENCES` clauses out of the schema
   — it does not rely on `PRAGMA defer_foreign_keys`, because that state does not persist across
   separate D1 HTTP API calls.
5. Downloads each `<table>.json` and loads it in batches of 200 rows via **parameterized `INSERT`
   statements** (`?` placeholders + a bound `params` array) against the [Cloudflare D1 HTTP
   API](https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/query/) —
   never string-built SQL. Column order comes from the parsed schema, not from each row's own keys,
   so a sparse/missing key binds `NULL` instead of shifting columns.
6. Verifies each table with an independent `COUNT(*)` against the manifest's `dumped_rows` and
   prints a report (per-table restored/expected/verified, total rows, duration). Exits non-zero on
   any mismatch.

### Why the D1 HTTP API instead of `wrangler d1 execute`

`wrangler d1 execute` only accepts literal SQL text — there is no way to pass a bound parameter from
the CLI. Real parameter binding (the only acceptable way to replay untrusted row data — see the
security note below) requires either a Worker's `D1Database.prepare().bind()`, or the D1 HTTP API
directly. This script uses the HTTP API. R2 reads still go through `wrangler` (already authenticated
on this machine for every other D1/R2 operation in this repo), since no parameter binding is needed
to fetch an object.

### Setup (one-time)

```powershell
# A token scoped to D1 Edit for this account. Create at Cloudflare dashboard -> My Profile -> API Tokens.
$env:CLOUDFLARE_API_TOKEN = "<paste-token>"
$env:CLOUDFLARE_ACCOUNT_ID = "<paste-account-id>"
```

Set these in your shell session, never in source, `wrangler.toml`, or a command-line argument.
`wrangler` itself must already be authenticated (`wrangler whoami`) — it is only used for R2 reads
and `d1 info` name resolution here, not for the D1 writes.

### The production guard

`--target activity-radar` (by name **or** by `database_id`,
`8cc3694a-26f8-4a56-b131-d5d3a68c49ef`) is refused by default. To override, you must supply **both**:

```powershell
node scripts/restore.mjs --target activity-radar --overwrite-production `
  --confirm-token "RESTORE ACTIVITY-RADAR PRODUCTION" --date 2026-07-19
```

`--dry-run` disables the override entirely, regardless of what else is passed — a dry run can never
reach production. The guard runs before any R2 read, any `d1 info` resolution, or any D1 write, so a
blocked call makes zero network requests against production.

### Everyday use: dry-run into a throwaway D1

```powershell
cd worker-backup
node scripts/restore.mjs --target pcd-restore-test --dry-run
# or a specific date:
node scripts/restore.mjs --target pcd-restore-test --date 2026-07-19 --dry-run
```

`--dry-run` still performs a real restore into `--target` — the flag means "treat this target as
disposable," not "skip the write." Point it at a throwaway/test D1, never at anything that matters.
A ready-made throwaway database, `pcd-restore-test`
(`database_id e4569373-7263-443a-a860-315421cf72b6`), already exists in this Cloudflare account for
exactly this purpose — see the runbook below for how it was proved.

### Real production restore (incident time)

1. Identify the bad write's timestamp and the exact `--date` to restore from (check
   `backups/backup-log.json` for `verified: true` entries).
2. Stop or disable every writer that can touch `activity-radar` (see `INCIDENT-RUNBOOK.md` and
   `scripts/RESTORE-activity-radar.md` in the parent repo for the full incident checklist — same
   discipline applies here: preserve current state, record the D1 Time Travel bookmark, get explicit
   approval before running the override).
3. Dry-run the same date into `pcd-restore-test` (or a fresh throwaway D1) first and read the report.
4. Only then run the real restore with the production override:
   ```powershell
   node scripts/restore.mjs --target activity-radar --date <YYYY-MM-DD> `
     --overwrite-production --confirm-token "RESTORE ACTIVITY-RADAR PRODUCTION"
   ```
5. Confirm `ALL VERIFIED: true` in the printed report before re-enabling writers.

### Restore runbook: how this was proved

As of 2026-07-22, `pcd-db-backups` has never been written to (`object_count: 0` — the Worker above
has not yet been deployed/run for real; see the completion report for this packet). A true
end-to-end dry-run against a real dated backup is therefore **not yet possible** and has not been
claimed. What has been proved instead:

- 39 automated tests (`npm test`, `scripts/restore.test.mjs`) cover the production guard (refuses
  by name, by `database_id`, and when `--dry-run` is combined with a correct override; proceeds for
  any other target), the FK-respecting schema/load-order parser, and a full round-trip fixture
  (`NULL`, apostrophes/quotes, unicode, and a numeric-vs-text column pair) through a real SQLite
  engine (`node:sqlite`) via genuine bound-parameter execution.
- The same fixture was additionally replayed against a real, live Cloudflare D1
  (`pcd-restore-test`) using this script's actual schema-parsing and batch-insert functions,
  confirming the parameterized-insert approach round-trips correctly against the real D1 HTTP API
  and not just the local fake.
- `wrangler r2 object get` and `wrangler d1 info --json` were both exercised against the real
  `pcd-db-backups` bucket and the real `pcd-restore-test` database respectively.

**Follow-up required before this is a fully proven DR path:** once `worker-backup` has been deployed
and has produced at least one real `verified: true` dated backup, run
`node scripts/restore.mjs --target pcd-restore-test --dry-run` for real and log the result here and
in `INCIDENT-RUNBOOK.md`'s restore test log.

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
