# Backup playbook

Three layers. Each protects against a different failure.

## Layer 1: GitHub (code + history)

Both site source trees push to private GitHub repos. After every change session, commit and push.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
git add -A
git commit -m "describe what changed"
git push
```

(The folder is `parent-coach-desk`. The Cloudflare project and D1 database keep the older `parent-coach-playbook` name, so `--project-name parent-coach-playbook` in the deploy commands is correct and not a typo.)

If your hard drive dies tomorrow, every line of code is recoverable from `git clone`.

## Layer 2: D1 database snapshots

Cloudflare D1 Time Travel is always on for production-storage databases and currently retains point-in-time history for 7 days on Workers Free or 30 days on Workers Paid. Verify the database storage version and account plan rather than assuming the window. Independent SQL exports are still required for recovery beyond that window, Cloudflare account loss, and portable/offline evidence.

The script `scripts\backup-activity-radar.ps1` dumps the whole shared `activity-radar` D1 (the one camp database) to a timestamped `backups\d1\activity-radar-YYYY-MM-DD-HHMMSS.sql`, writes a SHA-256 sidecar, keeps the 8 most recent complete runs, and deletes older runs with their sidecars. It exports to a `.partial` path and atomically publishes only after the command and size check pass, so a retry or second run cannot delete an earlier good snapshot. **Local only. It does not commit or push.** (The dump runs 200MB+ and growing with the org table at ~198,000 rows, well past GitHub's 100MB file limit. Committing it broke `git push` for the whole repo once already. `backups/` is `.gitignore`'d; recovering from a live incident where this file exceeds "local disk only" isn't currently solved — see Open items below.)

This is the Open Item 10 fix (PCD-OPERATING-MANUAL.md): `org-discovery-daily-worklist` writes to this database every night with no prior backup path. Per decision 6, the script stays manual-run only until it has run by hand three times, then a Cowork scheduled task gets proposed. It follows the MedConfRadar D-026 precedent.

**Proving-run count as of 2026-07-16: two.** The append-only ledger records two 245.3 MB clean exports on separate days, each completed in one attempt with a SHA-256 sidecar. One clean manual run on a later day remains before scheduling may be proposed. This count does not prove an offsite copy or a live restore.

The count is now tracked in `scripts\BACKUP-PROVING-LOG.md`, which the script appends to on each clean run. That file is git-tracked; `backups\` and its transcripts are not. Read the ledger for the true count rather than trusting a header comment. Three rows in that table is the gate. Nothing schedules before then.

The prior script, `scripts\backup-d1-activity-radar.ps1`, had no retention rule and no restore doc. It is retired in favor of the one above and kept only for history. The `backup-d1.ps1` before that dumped the retired flat `camps` table and is also retired. See `activityradar-archive/README.md`.

## Layer 2b: off-machine D1 export (Cloudflare Worker, added 2026-07-22)

**The Cowork `pcd-backup` scheduled task (weekly, Saturday, separate from the PS1 script above) was a false success and is superseded as of 2026-07-22.** Its prompt dumped the D1 to `backups/<date>/` in this repo and tried to `git add` + push it, but `backups/` is `.gitignore`'d (line 45) for exactly the reason described above — `git add backups/` on a gitignored path silently stages nothing, so every run pushed zero data while reporting success. The same lesson this section already learned about the PS1 script (don't commit multi-hundred-MB dumps) never reached the scheduled task.

`worker-backup/` (a Cloudflare Worker with a Cron Trigger, see `worker-backup/README.md`) replaces it: exports `activity-radar` straight to the `pcd-db-backups` R2 bucket on the same weekly cadence, verifies every table's row count against an independent `COUNT(*)`, and alerts to Slack on any failure. No git, no size limit, no local-machine dependency. This is the offsite-copy answer the "What's NOT covered" section below used to flag as "not decided yet."

Cutover is not automatic: the Cowork task is not modified by this change and keeps firing into the void (harmless — it still backs up nothing) until Jeff disables it, planned after the Worker records 2-3 verified runs in its own `backup-log.json`.

Run manually any time:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
.\scripts\backup-activity-radar.ps1
```

### Starting the clock (Jeff, by hand)

Run that same command on three separate days. The script prints which run it just logged and how many remain. Nothing else is needed; it appends to the ledger itself.

Each run takes a few minutes and writes ~200 MB to `backups\d1\`. Watch for: an export under 1 MB (the script throws rather than overwrite a good backup), and the retry loop firing more than once (wrangler's "Not currently exporting anything" race — harmless, but note it if it happens every time).

The runs must be on different days to be worth anything. Three runs in one afternoon prove the script works; they do not prove it survives a fresh shell, an expired wrangler session, or a machine that has been rebooted. That is the failure the gate exists to catch.

### After the gate clears (not before)

Once `scripts\BACKUP-PROVING-LOG.md` has three rows, schedule it. Windows Task Scheduler, daily 2:00 AM, same pattern as the retired script:

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-NoProfile -ExecutionPolicy Bypass -File "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk\scripts\backup-activity-radar.ps1"'
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
Register-ScheduledTask -TaskName "pcd-backup-activity-radar" -Action $action -Trigger $trigger -Description "Nightly activity-radar D1 export. Open Item 10."
```

Then flip `agent_registry.pcd-backup.status` from `paused` to `active` in the `forge-command` D1.

A note on what this schedule does and does not buy you. Task Scheduler only fires when this machine is on, so a laptop that is closed at 2 AM silently skips the backup, and the failure looks exactly like a success from the repo's point of view. D1 Time Travel (30-day point-in-time restore, no export required, no dependency on this machine) is the stronger protection for the bad-write case and is already on by default. This script's real job is the offline dump Time Travel cannot give you, not primary protection.

### Restoring from a snapshot

Full restore steps, single-table restore, D1 Time Travel, and post-restore verification all live in `scripts\RESTORE-activity-radar.md`, next to the backup script. Read that before restoring anything; a full restore overwrites live data.

### Local recovery-test retention

`scripts\prune-local-backups.ps1` manages only dated packages under
`backups\recovery\`. It deliberately does **not** delete the eight active
`backups\d1\activity-radar-*.sql` exports or their checksum sidecars; the
export script owns that retention policy.

The cleanup script is dry-run by default and retains the newest two recovery
packages plus every package from the last 30 days. Review its JSON candidate
list first:

```powershell
npm run backup:prune:dry
```

After a separately approved post-deployment retention review, apply exactly
that policy with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\prune-local-backups.ps1 -Apply
```

## Layer 3: R2 photo bucket

Camp hero photos live in the `activityradar-photos` R2 bucket (bound as `PHOTOS`; corrected 2026-07-13 — this file previously named it `parent-coach-playbook-photos`, which was never the real bucket name).

**R2 recovery is not yet proved.** Cloudflare's current R2 S3 compatibility matrix does not implement bucket versioning, so the earlier instruction to enable object versioning was false and has been removed. Before customer media or autonomous deletion is enabled, establish an independent, encrypted object inventory/export with hashes and retention, then prove a representative restore to a separate non-production prefix or bucket. Creating that destination, credentials, schedule, or copy operation requires separate approval.

## What's NOT covered

- Cloudflare account itself: if you lose access to the account, everything Cloudflare-hosted (Pages, D1, R2) goes with it. Document your billing email and 2FA recovery codes somewhere safe (1Password, Bitwarden, or even a paper printout in a fireproof box).
- The Coach Jeff Thomas site: doesn't use D1 or R2, so layer 1 (GitHub) covers it fully.
- Notion content: separate system, separate backup. Notion has built-in version history but no offline export by default. Periodically export your Notion workspace to ZIP via Notion → Settings → Workspace → Export.
- **D1 snapshots are local-only as of 2026-07-13** (see Layer 2 above) — the PS1 script's dumps still never leave this machine. D1's own Time Travel (30-day point-in-time restore, no export needed) covers the "bad write" case without depending on this machine at all. **The true offsite copy is now built** (see Layer 2b, added 2026-07-22): `worker-backup/` exports weekly straight to R2, independent of this machine, verified by row count. It has not yet completed its first 2-3 verified runs as of this writing — check `backup-log.json` in the `pcd-db-backups` R2 bucket for the current count before relying on it as proven.

## Quick check

Right now, before you walk away from this:

1. Both repos pushed to GitHub? `git status` shows clean, `git remote -v` shows a github.com URL.
2. Did `.\scripts\backup-activity-radar.ps1` run successfully today? Check `backups\d1\` has today's file.
3. Is there current, independently stored and restore-tested R2 evidence? Until an approved R2 backup design is implemented, the answer is **no**.

If yes to all three, your work is recoverable from at least two different machines/services if anything fails.
