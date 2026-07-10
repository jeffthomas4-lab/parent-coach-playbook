# Backup playbook

Three layers, same as the other site repos. Each protects against a different failure.

## Layer 1: GitHub (code + history)

The repo pushes to a private GitHub repo at `github.com/jeffthomas4-lab/activityradar`.
After every change session, commit and push.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\ActivityRadar"
git add -A
git commit -m "describe what changed"
git push
```

If the hard drive dies tomorrow, every line is recoverable from `git clone`.

## Layer 2: D1 database snapshots

Cloudflare D1 has no built-in backups on the free tier. If a table gets dropped or
rows get deleted, the only path back is your own snapshots.

`scripts\backup-d1.ps1` exports the whole `activity-radar` D1 to
`backups\d1\activity-radar-YYYY-MM-DD.sql`, commits it, and pushes.

Run manually any time:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\ActivityRadar"
.\scripts\backup-d1.ps1
```

Or schedule it nightly via Windows Task Scheduler:

1. Open Task Scheduler. Create Basic Task.
2. Name: "ActivityRadar D1 backup". Trigger: Daily at 2:15 AM.
3. Action: Start a program.
4. Program: `powershell.exe`
5. Arguments: `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\ActivityRadar\scripts\backup-d1.ps1"`
6. Start in: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\ActivityRadar`
7. Finish. Properties → Run whether user is logged on or not, Run with highest privileges.

### Restoring from a snapshot

```powershell
# Wipe the graph (FK-safe order), then re-import from a dated dump
npx wrangler d1 execute activity-radar --remote --command "DELETE FROM trust_signals; DELETE FROM sessions; DELETE FROM programs; DELETE FROM organizations;"
npx wrangler d1 execute activity-radar --remote --file=backups\d1\activity-radar-2026-06-14.sql
```

The export is full schema + data, so it restores standalone.

## Layer 3: R2 photo bucket

Org logos and program hero photos live in the `activityradar-photos` R2 bucket.
Enable object versioning so accidental deletes do not permanently lose files:
Cloudflare dashboard → R2 → activityradar-photos → Settings → Object Versioning → Enable.

## What's NOT covered

- The Cloudflare account itself. If you lose access, everything Cloudflare-hosted goes
  with it. Keep the billing email and 2FA recovery codes somewhere safe.
- The `activity-radar` D1 is shared with parent-coach-playbook (phase 5). A restore here
  affects both front doors. Coordinate before restoring.

## Quick check

1. Repo pushed? `git status` clean, `git remote -v` shows the github.com URL.
2. `.\scripts\backup-d1.ps1` ran today? `backups\d1\` has today's file.
3. R2 versioning enabled?
