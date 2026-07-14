# RETIRED 2026-07-13. Superseded by scripts\backup-activity-radar.ps1, which adds
# a keep-last-8 retention rule and a documented restore procedure
# (scripts\RESTORE-activity-radar.md). This file has neither. Kept for history
# per the RETIREMENT RULE, not deleted. Use the new script.
#
# Original header below.
#
# Backup the shared activity-radar D1 to a timestamped SQL dump. Local-only —
# does NOT commit or push. Fixed 2026-07-13: this database is now 245MB+
# exported, well past GitHub's 100MB file limit, so committing the dump broke
# `git push` for every change in the repo, not just this script's own commit.
# `backups/` is .gitignore'd; this script no longer fights that.
# Run manually any time, or schedule nightly via Windows Task Scheduler (see BACKUP.md).
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$date = Get-Date -Format "yyyy-MM-dd"
$dir = Join-Path $root "backups\d1"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$out = Join-Path $dir "activity-radar-$date.sql"

# wrangler d1 export dumps schema + data for the whole database.
npx wrangler d1 export activity-radar --remote --output $out

Write-Host "Backed up activity-radar to $out (local only, not committed — see BACKUP.md Layer 2)."
