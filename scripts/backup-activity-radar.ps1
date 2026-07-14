# backup-activity-radar.ps1
#
# Backs up the shared activity-radar D1, the database org-discovery-daily-worklist
# writes to autonomously every night (PCD-OPERATING-MANUAL.md section 5.3). Open
# Item 10 named the gap: that agent mutates production every night with no backup,
# no rollback, and no restore path. This script is the fix.
#
# Precedent: MedConfRadar's Backup Export Agent (Field & Forge OS chapter 04-23,
# decision D-026), Outputs/medconfradar-directory/scripts/backup-export.ps1. Same
# shape: wrangler d1 export, a retry loop for the "Not currently exporting
# anything" race wrangler hits on the first status poll, a size sanity check so a
# failed export never overwrites a good backup, and a manual-first run schedule.
#
# Decision 6 (manual-three-times gate): a recurring task does not get a schedule
# until it has been run by hand three times. This script stays manual-only until
# that gate clears:
#   Run 1: tonight, 2026-07-13.
#   Run 2 and Run 3: two more manual runs this week.
# Once all three are logged clean, propose a Cowork scheduled task. Not before.
# Do not schedule this script yet.
#
# Restore procedure: RESTORE-activity-radar.md, same folder as this script.
#
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\backup-activity-radar.ps1
#
# Retention: keeps the 8 most recent dated backups in backups\d1\ and deletes the
# rest. Local only, same as the old script. backups\ is .gitignore'd (the export
# runs 200MB+, past GitHub's 100MB limit).
#
# Supersedes scripts\backup-d1-activity-radar.ps1 (retired, no retention rule, no
# restore doc). That file is kept per the RETIREMENT RULE, not deleted.

$ErrorActionPreference = "Stop"

# Non-interactive, so a Task Scheduler run at 2 AM does not hang on wrangler's
# "Ok to proceed?" prompt.
$env:CI = "true"

$repo = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repo

$stamp = Get-Date -Format "yyyy-MM-dd"
$dir = Join-Path $repo "backups\d1"
$logDir = Join-Path $dir "logs"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$timeStamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
Start-Transcript -Path (Join-Path $logDir "backup-$timeStamp.log") | Out-Null

try {
  $out = Join-Path $dir "activity-radar-$stamp.sql"
  Write-Host "Exporting activity-radar to $out ..."

  # wrangler d1 export --remote intermittently returns "Not currently exporting
  # anything" on the first status poll (a known workers-sdk race). Retry a few
  # times before giving up. No -y flag: d1 export does not take one, and CI=true
  # above makes it auto-proceed past the confirmation prompt.
  $attempt = 0
  $ok = $false
  while (-not $ok -and $attempt -lt 4) {
    $attempt++
    if (Test-Path $out) { Remove-Item $out -Force }
    npx wrangler d1 export activity-radar --remote --output $out
    if ($LASTEXITCODE -eq 0 -and (Test-Path $out) -and (Get-Item $out).Length -ge 1MB) {
      $ok = $true
    } else {
      Write-Host "  export attempt $attempt failed, retrying in 20s ..."
      Start-Sleep -Seconds 20
    }
  }
  if (-not $ok) {
    throw "wrangler export failed for activity-radar after $attempt attempts. Prior backups left intact."
  }

  $bytes = (Get-Item $out).Length
  Write-Host ("  export: {0} MB" -f [math]::Round($bytes / 1MB, 1))
  if ($bytes -lt 1MB) {
    throw "Export is under 1 MB. Almost certainly a failure. Keeping prior backups."
  }

  # Keep the 8 most recent dated backups, delete the rest.
  $keep = 8
  $all = Get-ChildItem $dir -Filter "activity-radar-*.sql" -File | Sort-Object LastWriteTime -Descending
  if ($all.Count -gt $keep) {
    $toDelete = $all | Select-Object -Skip $keep
    foreach ($f in $toDelete) {
      Write-Host "  pruning old backup: $($f.Name)"
      Remove-Item $f.FullName -Force
    }
  }

  $remaining = (Get-ChildItem $dir -Filter "activity-radar-*.sql" -File).Count
  Write-Host "Done. $remaining backup(s) on disk in $dir (keeping last $keep)."
}
finally {
  Stop-Transcript | Out-Null
}
