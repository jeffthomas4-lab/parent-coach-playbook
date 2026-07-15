# Plan: Cloudflare verification and D1 recovery proof

**Plan ID:** 004
**Author:** Codex
**Date:** 2026-07-15
**Status:** In progress — current-day work complete; two separate-day proving runs remain

## Objective

Verify the current Cloudflare resources, deployed Worker bindings, and secret-name presence without changing remote state; then prove that a real `activity-radar` export can be restored and queried in an isolated local D1 target.

## Tier

Tier 3. This accesses live Cloudflare metadata and production D1 for a read-only export, and exercises a database restore locally. No remote write or restore is permitted.

## Business outcome

Jeff gets evidence of what is actually configured in Cloudflare and a demonstrated recovery path for the database that autonomous jobs mutate.

## Current-state evidence

- Verified in code, 2026-07-15: root config binds `DB`, `PHOTOS`, `SESSION`, and `ASSETS` to `parent-coach-desk-staging`.
- Verified in code, 2026-07-15: `activityradar-enrichment` binds the same `activity-radar` D1.
- Verified in code, 2026-07-15: the link-checker still contains placeholder D1 IDs and must not be deployed from this config.
- Verified in code, 2026-07-15: `scripts/backup-activity-radar.ps1` exports remotely, validates size, retains eight files, and records proving runs.
- Verified against current Cloudflare documentation, 2026-07-15: D1 SQL exports can be replayed with `wrangler d1 execute --file`; Time Travel retention is plan-dependent and a restore is destructive.
- Not verified: remote resource/binding/secret presence, export success, and restore success.

## Scope

- Inspect Cloudflare identity, D1/KV/R2/Pages/Worker resource metadata, active Worker versions, binding metadata, and secret names.
- Run one genuine manual backup proving run today.
- Import that SQL dump into a fresh isolated local Wrangler D1 state and compare schema and key row counts.
- Correct recovery documentation where current Cloudflare behavior disproves it.
- Record evidence and commit repository documentation/log changes.

## Non-goals

- No deploy, push, migration, remote SQL mutation, Time Travel restore, secret value access/change, schedule change, custom-domain change, or production HTTP write.
- No claim that multiple same-day exports satisfy the three-separate-day proving gate.
- No scheduling of the backup task until three separate-day runs are recorded.

## Files likely affected

- `scripts/BACKUP-PROVING-LOG.md`
- `scripts/RESTORE-activity-radar.md`
- `coordination/CURRENT_STATE.md`
- This plan and a review/handoff record.

## Step-by-step implementation

1. Verify Wrangler version and authenticated account identity.
2. Inventory remote D1, R2, KV, Pages, and relevant Worker versions/deployments using read-only commands.
3. Compare deployed binding metadata and secret names against repository config and code references.
4. Run `scripts/backup-activity-radar.ps1` once and preserve its generated proving-log row.
5. Create a fresh temporary local Wrangler state directory and import the export into local `activity-radar`.
6. Compare table inventory and key row counts between remote read-only queries, the export-restored local target, and expected schema.
7. Correct stale recovery documentation and record verified facts and remaining gaps.
8. Review diffs, run relevant validation, and commit explicit paths.

## Testing strategy

- Every remote command is list/info/view/secret-list, SELECT-only SQL, or D1 export.
- Backup must exit 0 and produce a file at least 1 MB.
- Local restore must exit 0 in an isolated persistence path.
- Table inventory and counts for `organizations` and `programs` must match the remote snapshot or any timing difference must be explained.
- PowerShell backup script must parse after any edit.
- Repository test/type gates run if executable code changes; documentation-only corrections require diff and secret scans.

## Acceptance criteria

- Remote resources and deployed bindings are evidence-labeled by actual command output.
- Secret values are never printed or recorded; names only may be recorded.
- One separate-day proving run is logged with a valid export size.
- The export is restored to a non-production local target and queried successfully.
- No remote state is mutated.
- Remaining two separate-day proving runs are explicitly tracked.

## Human approval gates

Jeff approved read-only Cloudflare verification, backup exports, and a non-production restore exercise in this task. Any remote restore, migration, deploy, schedule, secret/binding change, production write, or push remains separately gated.

## Dependencies

- Authenticated Wrangler 4.x access to the intended Cloudflare account.
- Sufficient local disk for the export plus isolated restored D1 state.

## Architecture and data flow

`activity-radar` remote D1 (read-only export) -> ignored SQL dump under `backups/d1` -> isolated local Wrangler D1 persistence -> SELECT verification. No arrow returns to Cloudflare.

## Data model or migration changes

None. No migration is created or applied.

## Security and privacy requirements

Only metadata, secret names, schema names, aggregate row counts, and local backup artifacts are handled. Backup contents remain ignored and local; no data rows are copied into tracked documentation.

## Failure modes

- Authentication unavailable: stop before export and record the blocker.
- Export race: existing script retries four times and preserves prior backups.
- Insufficient disk: stop without deleting the most recent valid backup.
- Local import failure: preserve logs and export; do not attempt a remote restore.
- Remote/local count drift: identify whether writes occurred after the export timestamp; do not alter either database.

## Edge cases

- Export files may include statements Wrangler transforms for D1 import.
- Autonomous writers can change remote counts immediately after the snapshot.
- Same-day reruns overwrite the dated dump and do not count as separate-day proof.

## Observability

Backup transcript stays under ignored `backups/d1/logs`; successful run metadata is appended to the tracked proving log. Verification evidence is summarized in coordination records without secrets or row data.

## Deployment plan

None. This phase does not deploy.

## Rollback plan

Remote state is read-only. Local restore state can be discarded. Documentation changes can be reverted by commit. The ignored SQL export is retained as the recovery artifact.

## 2026-07-15 execution evidence

- Confirmed the production Pages custom domains, the staging Worker bindings, the shared D1/R2/KV resources, the enrichment and cron deployments, and secret names only.
- Confirmed the link-checker and redirect Workers are absent.
- Captured a SELECT-only remote snapshot: 23 tables, 198,287 organizations, 2,411 programs, and no rows written by verification queries.
- Completed proving run 1 of 3: 245.3 MB, one attempt.
- Restored the export to a fresh isolated SQLite target in 32.5 seconds; integrity was `ok` and both key counts matched.
- Two Wrangler-local full-dump attempts were stopped after making no practical progress; no remote state was involved.
- No deploy, migration, remote restore/write, secret/binding/schedule change, production HTTP write, or push occurred.
