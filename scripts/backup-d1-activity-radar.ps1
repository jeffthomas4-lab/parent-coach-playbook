# Backup the shared activity-radar D1 to a timestamped SQL dump, commit, and push.
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

git add $out
git commit -m "D1 backup $date"
git push

Write-Host "Backed up activity-radar to $out and pushed."
