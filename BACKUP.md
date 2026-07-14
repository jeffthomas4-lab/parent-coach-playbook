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

The script `scripts\backup-activity-radar.ps1` dumps the whole shared `activity-radar` D1 (the one camp database) to `backups\d1\activity-radar-YYYY-MM-DD.sql`, keeps the 8 most recent runs, and deletes older ones. **Local only — it does not commit or push.** (The dump runs 200MB+ and growing with the org table at ~198,000 rows, well past GitHub's 100MB file limit. Committing it broke `git push` for the whole repo once already. `backups/` is `.gitignore`'d; recovering from a live incident where this file exceeds "local disk only" isn't currently solved — see Open items below.)

This is the Open Item 10 fix (PCD-OPERATING-MANUAL.md): `org-discovery-daily-worklist` writes to this database every night with no prior backup path. Per decision 6, the script stays manual-run only until it has run by hand three times, then a Cowork scheduled task gets proposed. See the script's own header for the run count and the MedConfRadar D-026 precedent it follows.

The prior script, `scripts\backup-d1-activity-radar.ps1`, had no retention rule and no restore doc. It is retired in favor of the one above and kept only for history. The `backup-d1.ps1` before that dumped the retired flat `camps` table and is also retired — see `activityradar-archive/README.md`.

Run manually any time:

```powershell
cd "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-desk"
.\scripts\backup-activity-radar.ps1
```

Do not schedule this yet. Once three manual runs are logged clean, scheduling instructions go here (Windows Task Scheduler, daily 2:00 AM, same pattern as the retired script used).

### Restoring from a snapshot

Full restore steps, single-table restore, D1 Time Travel, and post-restore verification all live in `scripts\RESTORE-activity-radar.md`, next to the backup script. Read that before restoring anything; a full restore overwrites live data.

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
2. Did `.\scripts\backup-activity-radar.ps1` run successfully today? Check `backups\d1\` has today's file.
3. R2 versioning enabled?

If yes to all three, your work is recoverable from at least two different machines/services if anything fails.
