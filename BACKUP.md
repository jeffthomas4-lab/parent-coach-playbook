# Backup playbook

Three layers. Each protects against a different failure.

## Layer 1: GitHub (code + history)

Both site source trees push to private GitHub repos. After every change session, commit and push.

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook"
git add -A
git commit -m "describe what changed"
git push
```

If your hard drive dies tomorrow, every line of code is recoverable from `git clone`.

## Layer 2: D1 database snapshots

Cloudflare D1 has no built-in backups on the free tier. If a table gets dropped or rows get deleted by accident, the only path to recovery is your own snapshots.

The script `scripts\backup-d1-activity-radar.ps1` dumps the whole shared `activity-radar` D1 (the one camp database) to `backups\d1\activity-radar-YYYY-MM-DD.sql`. **Local only — it does not commit or push.** (Changed 2026-07-13: the dump is now 245MB+ and growing with the org table at ~198,000 rows, well past GitHub's 100MB file limit. Committing it broke `git push` for the whole repo, not just the backup commit. `backups/` is `.gitignore`'d; recovering from a live incident where this file exceeds "local disk only" isn't currently solved — see Open items below.) The old `backup-d1.ps1` dumped the retired flat `camps` table and is retired — see `activityradar-archive/README.md`.

Run manually any time:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
.\scripts\backup-d1-activity-radar.ps1
```

Or schedule it nightly via Windows Task Scheduler:

1. Open Task Scheduler. Create Basic Task.
2. Name: "Parent Coach Desk D1 backup". Trigger: Daily at 2:00 AM.
3. Action: Start a program.
4. Program: `powershell.exe`
5. Arguments: `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk\scripts\backup-d1-activity-radar.ps1"`
6. Start in: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk`
7. Finish. Right-click the task, Properties, Run whether user is logged on or not, Run with highest privileges.

The task only runs when the machine is on. If you go three days without a backup, the next run picks up where it left off, no harm.

### Restoring from a snapshot

If you need to restore from a specific date:

```powershell
# Inspect the backup first
cat backups\d1\activity-radar-2026-07-13.sql

# Full restore of the shared D1 (destructive — only for real disaster recovery)
npx wrangler@latest d1 execute activity-radar --remote --file=backups\d1\activity-radar-2026-07-13.sql
```

For restoring a single table rather than the whole database, extract just that table's statements from the dump before running it, or use D1 Time Travel (`npx wrangler d1 time-travel restore activity-radar`) for point-in-time recovery within its retention window, usually faster than a manual dump replay.

## Layer 3: R2 photo bucket

Camp hero photos live in the `activityradar-photos` R2 bucket (bound as `PHOTOS`; corrected 2026-07-13 — this file previously named it `parent-coach-playbook-photos`, which was never the real bucket name). Enable object versioning so accidental deletes don't permanently lose files.

Cloudflare dashboard → R2 → activityradar-photos → Settings → Object Versioning → Enable.

Versioning is free for the first 30 days of object history. Old versions count against your storage but the free tier is 10 GB, plenty for your scale.

## What's NOT covered

- Cloudflare account itself: if you lose access to the account, everything Cloudflare-hosted (Pages, D1, R2) goes with it. Document your billing email and 2FA recovery codes somewhere safe (1Password, Bitwarden, or even a paper printout in a fireproof box).
- The Coach Jeff Thomas site: doesn't use D1 or R2, so layer 1 (GitHub) covers it fully.
- Notion content: separate system, separate backup. Notion has built-in version history but no offline export by default. Periodically export your Notion workspace to ZIP via Notion → Settings → Workspace → Export.
- **D1 snapshots are local-only as of 2026-07-13** (see Layer 2 above) — if this machine's hard drive dies the same day as a bad D1 write, there's no offsite copy of the dump. D1's own Time Travel (30-day point-in-time restore, no export needed) covers the "bad write" case without depending on this machine at all, which is probably the real answer here. If you want a true offsite copy of the full dump, that needs somewhere other than this GitHub repo — an R2 bucket (`wrangler r2 object put`) or a cloud drive folder, not decided yet.

## Quick check

Right now, before you walk away from this:

1. Both repos pushed to GitHub? `git status` shows clean, `git remote -v` shows a github.com URL.
2. Did `.\scripts\backup-d1-activity-radar.ps1` run successfully today? Check `backups\d1\` has today's file.
3. R2 versioning enabled?

If yes to all three, your work is recoverable from at least two different machines/services if anything fails.
