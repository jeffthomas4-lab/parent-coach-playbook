# prune-local-backups.ps1
#
# Plans (or, with -Apply, performs) retention cleanup for local recovery-test
# packages. It deliberately does NOT delete D1 SQL exports: the active export
# script owns their eight-copy retention policy and checksum sidecars.
#
# Recovery packages are verification artifacts, not production backups. Keep
# the newest packages plus a defined age window; retain the active export set
# until an approved restore/offsite-recovery plan says otherwise.
#
# Default mode is read-only. Destructive deletion requires -Apply.

[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [ValidateRange(1, 3650)]
  [int]$RecoveryRetentionDays = 30,

  [ValidateRange(1, 100)]
  [int]$KeepNewestRecoveryPackages = 2,

  [switch]$Apply
)

$ErrorActionPreference = 'Stop'

$repo = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backupsRoot = Join-Path $repo 'backups'
$recoveryRoot = Join-Path $backupsRoot 'recovery'

if (-not (Test-Path -LiteralPath $recoveryRoot -PathType Container)) {
  Write-Host "No recovery packages found at $recoveryRoot. Nothing to prune."
  exit 0
}

function Assert-ChildPath([string]$candidate, [string]$parent) {
  $resolvedCandidate = [IO.Path]::GetFullPath($candidate)
  $resolvedParent = [IO.Path]::GetFullPath($parent).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  if (-not $resolvedCandidate.StartsWith($resolvedParent, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing to operate outside recovery root: $candidate"
  }
}

$cutoff = (Get-Date).AddDays(-$RecoveryRetentionDays)
$packages = Get-ChildItem -LiteralPath $recoveryRoot -Directory |
  Sort-Object LastWriteTimeUtc -Descending

$candidates = @(
  $packages |
    Select-Object -Skip $KeepNewestRecoveryPackages |
    Where-Object { $_.LastWriteTime -lt $cutoff }
)

$summary = [ordered]@{
  mode = if ($Apply) { 'apply' } else { 'dry-run' }
  recovery_root = $recoveryRoot
  retention_days = $RecoveryRetentionDays
  newest_packages_kept = $KeepNewestRecoveryPackages
  cutoff_local = $cutoff.ToString('o')
  package_count = @($packages).Count
  candidate_count = @($candidates).Count
  candidate_bytes = 0
  candidates = @()
}

foreach ($package in $candidates) {
  Assert-ChildPath -candidate $package.FullName -parent $recoveryRoot
  $bytes = (Get-ChildItem -LiteralPath $package.FullName -Recurse -Force -File |
    Measure-Object -Property Length -Sum).Sum
  if ($null -eq $bytes) { $bytes = 0 }
  $summary.candidate_bytes += [int64]$bytes
  $summary.candidates += [ordered]@{
    name = $package.Name
    path = $package.FullName
    last_write_utc = $package.LastWriteTimeUtc.ToString('o')
    bytes = [int64]$bytes
  }
}

$summary | ConvertTo-Json -Depth 4

if (-not $Apply) {
  Write-Host 'Dry run only. Re-run with -Apply after reviewing the candidate list.'
  exit 0
}

foreach ($package in $candidates) {
  Assert-ChildPath -candidate $package.FullName -parent $recoveryRoot
  if ($PSCmdlet.ShouldProcess($package.FullName, 'Delete expired recovery-test package')) {
    Remove-Item -LiteralPath $package.FullName -Recurse -Force
  }
}
