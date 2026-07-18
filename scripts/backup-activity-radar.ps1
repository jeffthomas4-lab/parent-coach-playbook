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
# that gate clears.
#
# PROVING-RUN GATE: three clean runs on three separate local calendar days. The
# authoritative evidence is the append-only ledger below.
#
# The count is no longer tracked by memory. Every successful run appends one row
# to scripts\BACKUP-PROVING-LOG.md (git-tracked). Read that file for the real
# count; repeated runs on one local calendar day count once.
# Do not schedule this script yet.
#
# Restore procedure: RESTORE-activity-radar.md, same folder as this script.
#
# Usage:
#   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\backup-activity-radar.ps1
#
# Retention: keeps the 8 most recent timestamped backups in backups\d1\ and
# deletes the rest plus their checksum sidecars. Local only. backups\ is
# .gitignore'd (the export
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

$dir = Join-Path $repo "backups\d1"
$logDir = Join-Path $dir "logs"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$timeStamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
Start-Transcript -Path (Join-Path $logDir "backup-$timeStamp.log") | Out-Null

try {
  $out = Join-Path $dir "activity-radar-$timeStamp.sql"
  $partial = "$out.partial"
  Write-Host "Exporting activity-radar to $out ..."

  # wrangler d1 export --remote intermittently returns "Not currently exporting
  # anything" on the first status poll (a known workers-sdk race). Retry a few
  # times before giving up. No -y flag: d1 export does not take one, and CI=true
  # above makes it auto-proceed past the confirmation prompt.
  $attempt = 0
  $ok = $false
  while (-not $ok -and $attempt -lt 4) {
    $attempt++
    if (Test-Path $partial) { Remove-Item $partial -Force }
    npx wrangler d1 export activity-radar --remote --output $partial
    if ($LASTEXITCODE -eq 0 -and (Test-Path $partial) -and (Get-Item $partial).Length -ge 1MB) {
      $ok = $true
    } else {
      Write-Host "  export attempt $attempt failed, retrying in 20s ..."
      Start-Sleep -Seconds 20
    }
  }
  if (-not $ok) {
    if (Test-Path $partial) { Remove-Item $partial -Force }
    throw "wrangler export failed for activity-radar after $attempt attempts. Prior backups left intact."
  }

  $bytes = (Get-Item $partial).Length
  Write-Host ("  export: {0} MB" -f [math]::Round($bytes / 1MB, 1))
  if ($bytes -lt 1MB) {
    throw "Export is under 1 MB. Almost certainly a failure. Keeping prior backups."
  }

  # Publish only a complete, size-checked artifact. A retry never touches any
  # prior .sql file, including one created earlier on the same day.
  Move-Item -LiteralPath $partial -Destination $out
  $digest = (Get-FileHash -LiteralPath $out -Algorithm SHA256).Hash.ToLowerInvariant()
  Set-Content -LiteralPath "$out.sha256" -Value "$digest  $([IO.Path]::GetFileName($out))" -Encoding Ascii
  Write-Host "  sha256: $digest"

  # Keep the 8 most recent dated backups, delete the rest.
  $keep = 8
  $all = Get-ChildItem $dir -Filter "activity-radar-*.sql" -File | Sort-Object LastWriteTime -Descending
  if ($all.Count -gt $keep) {
    $toDelete = $all | Select-Object -Skip $keep
    foreach ($f in $toDelete) {
      Write-Host "  pruning old backup: $($f.Name)"
      Remove-Item -LiteralPath $f.FullName -Force
      $sidecar = "$($f.FullName).sha256"
      if (Test-Path -LiteralPath $sidecar) { Remove-Item -LiteralPath $sidecar -Force }
    }
  }

  $remaining = (Get-ChildItem $dir -Filter "activity-radar-*.sql" -File).Count
  Write-Host "Done. $remaining backup(s) on disk in $dir (keeping last $keep)."

  # Proving-run ledger (decision 6). Append one row per clean run. This file is
  # git-tracked, unlike backups\ and its transcripts, so the three-run gate is
  # auditable from the repo instead of from memory. Only a run that got all the
  # way here -- real export, size sanity check passed -- counts.
  $ledger = Join-Path $PSScriptRoot "BACKUP-PROVING-LOG.md"
  if (-not (Test-Path $ledger)) {
    @(
      "# activity-radar backup: proving-run log",
      "",
      "Appended to automatically by ``backup-activity-radar.ps1`` on each clean run.",
      "Decision 6: three clean manual runs on three separate local dates before scheduling.",
      "Do not hand-edit. Do not schedule until this table has entries for three local dates.",
      "",
      "| # | Run (local) | Size MB | Attempts | Backups on disk |",
      "|---|---|---|---|---|"
    ) | Set-Content -Path $ledger -Encoding UTF8
  }
  $priorRuns = (Select-String -Path $ledger -Pattern '^\| \d+ \|' -AllMatches).Count
  $runNo = $priorRuns + 1
  $mb = [math]::Round($bytes / 1MB, 1)
  $when = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $ledger -Value "| $runNo | $when | $mb | $attempt | $remaining |" -Encoding UTF8

  $completedDates = @(
    Get-Content -LiteralPath $ledger |
      ForEach-Object {
        if ($_ -match '^\| \d+ \| (\d{4}-\d{2}-\d{2}) ') { $Matches[1] }
      } |
      Sort-Object -Unique
  )
  $completedDays = $completedDates.Count

  Write-Host ""
  Write-Host "Proving run $runNo logged to $ledger ($completedDays of 3 distinct local days)"
  if ($completedDays -lt 3) {
    Write-Host "GATE: $((3 - $completedDays)) more clean manual run day(s) before this script may be scheduled. Do not schedule yet." -ForegroundColor Yellow
  } else {
    Write-Host "GATE CLEARED: three clean runs logged. Scheduling is now allowed -- see BACKUP.md for the Task Scheduler command." -ForegroundColor Green
  }
}
finally {
  Stop-Transcript | Out-Null
}
