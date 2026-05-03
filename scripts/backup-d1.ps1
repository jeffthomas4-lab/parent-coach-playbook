# backup-d1.ps1
#
# Pulls a SQL dump of every table in the parent-coach-playbook D1 database
# and writes it to backups\d1\camps-YYYY-MM-DD.sql.
#
# Run manually:
#   .\scripts\backup-d1.ps1
#
# Schedule nightly via Task Scheduler:
#   Action: Start a program
#   Program: powershell.exe
#   Arguments: -NoProfile -ExecutionPolicy Bypass -File "C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook\scripts\backup-d1.ps1"
#   Start in:  C:\Users\jeffthomas\Desktop\Claude Cowork\Outputs\parent-coach-playbook
#
# After the script writes the file, it commits and pushes to GitHub so
# the backup lives offsite, not just on this machine.

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$date = Get-Date -Format "yyyy-MM-dd"
$backupDir = Join-Path $projectRoot "backups\d1"
$backupFile = Join-Path $backupDir "camps-$date.sql"

New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

Write-Host "Dumping D1 tables to $backupFile"

# Dump each table that holds real data. Skip the geocode cache because it
# rebuilds itself, and skip empty tables.
$tables = @("submitters", "camps", "camp_reviews", "camp_claims")
$header = @"
-- Backup of parent-coach-playbook D1
-- Generated: $(Get-Date -Format "o")
-- Tables: $($tables -join ', ')

"@
Set-Content -Path $backupFile -Value $header -Encoding UTF8

foreach ($table in $tables) {
    Write-Host "  exporting $table..."
    $cmd = "SELECT * FROM $table"
    $out = npx wrangler@latest d1 execute parent-coach-playbook --remote --command "$cmd" --json 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "  failed to export $table (continuing)"
        continue
    }
    Add-Content -Path $backupFile -Value "`n-- Table: $table" -Encoding UTF8
    Add-Content -Path $backupFile -Value "-- $($out)" -Encoding UTF8
}

Write-Host "wrote $backupFile"

# Commit + push the backup so it lives on GitHub too.
try {
    git add backups/d1/
    $changes = git status --porcelain backups/d1/
    if ($changes) {
        git commit -m "D1 backup $date"
        git push
        Write-Host "committed and pushed backup to GitHub"
    } else {
        Write-Host "no changes to commit (backup unchanged from last run)"
    }
} catch {
    Write-Warning "git push failed: $_"
    Write-Warning "backup is safe locally at $backupFile but not yet on GitHub"
}
