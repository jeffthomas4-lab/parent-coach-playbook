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

The script `scripts\backup-d1.ps1` dumps every table to `backups\d1\camps-YYYY-MM-DD.sql`, commits the file, and pushes to GitHub.

Run manually any time:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook"
.\scripts\backup-d1.ps1
```

Or schedule it nightly via Windows Task Scheduler:

1. Open Task Scheduler. Create Basic Task.
2. Name: "Parent Coach Playbook D1 backup". Trigger: Daily at 2:00 AM.
3. Action: Start a program.
4. Program: `powershell.exe`
5. Arguments: `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook\scripts\backup-d1.ps1"`
6. Start in: `C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook`
7. Finish. Right-click the task, Properties, Run whether user is logged on or not, Run with highest privileges.

The task only runs when the machine is on. If you go three days without a backup, the next run picks up where it left off, no harm.

### Restoring from a snapshot

If you need to restore the camps table from a specific date:

```powershell
# Inspect the backup first
cat backups\d1\camps-2026-05-03.sql

# Wipe and re-import the camps table specifically
npx wrangler@latest d1 execute parent-coach-playbook --remote --command "DELETE FROM camps"
npx wrangler@latest d1 execute parent-coach-playbook --remote --file=backups\d1\camps-2026-05-03.sql
```

The backup file dumps as JSON inside SQL comments. For a true restore from snapshot, use the same `imports/import-camps.py` workflow against a regenerated CSV. Or for emergency restore, write a small Python script that converts the JSON dump to INSERT statements. (Future improvement: have `backup-d1.ps1` emit ready-to-run INSERTs directly.)

## Layer 3: R2 photo bucket

Camp hero photos live in the `parent-coach-playbook-photos` R2 bucket. Enable object versioning so accidental deletes don't permanently lose files.

Cloudflare dashboard → R2 → parent-coach-playbook-photos → Settings → Object Versioning → Enable.

Versioning is free for the first 30 days of object history. Old versions count against your storage but the free tier is 10 GB, plenty for your scale.

## What's NOT covered

- Cloudflare account itself: if you lose access to the account, everything Cloudflare-hosted (Pages, D1, R2) goes with it. Document your billing email and 2FA recovery codes somewhere safe (1Password, Bitwarden, or even a paper printout in a fireproof box).
- The Coach Jeff Thomas site: doesn't use D1 or R2, so layer 1 (GitHub) covers it fully.
- Notion content: separate system, separate backup. Notion has built-in version history but no offline export by default. Periodically export your Notion workspace to ZIP via Notion → Settings → Workspace → Export.

## Quick check

Right now, before you walk away from this:

1. Both repos pushed to GitHub? `git status` shows clean, `git remote -v` shows a github.com URL.
2. Did `.\scripts\backup-d1.ps1` run successfully today? Check `backups\d1\` has today's file.
3. R2 versioning enabled?

If yes to all three, your work is recoverable from at least two different machines/services if anything fails.
