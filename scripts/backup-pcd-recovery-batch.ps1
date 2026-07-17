# Produce one local, immutable-style recovery batch for all authoritative PCD
# D1 databases. This script intentionally stops before any provider upload.
#
# A remote D1 export can contain customer and operational data. The required
# -Confirm switch makes that source-read action deliberate; -PlanOnly is the
# default and never creates a directory or invokes Wrangler.
[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)]
  [string]$BatchId = (Get-Date).ToUniversalTime().ToString('yyyy-MM-dd-HHmmssZ'),
  [switch]$Confirm,
  [switch]$PlanOnly
)

$ErrorActionPreference = 'Stop'

if ($BatchId -notmatch '^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$') {
  throw 'BatchId must use 3-128 safe filename characters.'
}

$databases = @(
  @{ Id = 'activity_radar'; Name = 'activity-radar'; MinimumBytes = 1MB },
  @{ Id = 'forge_command'; Name = 'forge-command'; MinimumBytes = 1KB },
  @{ Id = 'pcd_ops'; Name = 'parent-coach-desk-ops-production'; MinimumBytes = 1KB }
)

if ($PlanOnly -or -not $Confirm) {
  [pscustomobject]@{
    mode = 'plan_only'
    batch_id = $BatchId
    authoritative_d1 = $databases | ForEach-Object { $_.Id }
    external_upload_attempted = $false
    cloudflare_export_attempted = $false
    next_command = 'Re-run with -Confirm only after an approved source-read backup run.'
  } | ConvertTo-Json -Compress
  exit 0
}

$repo = Resolve-Path (Join-Path $PSScriptRoot '..')
$batchRoot = Join-Path $repo "backups\recovery\$BatchId"
$sourceRoot = Join-Path $batchRoot 'sources'
if (Test-Path -LiteralPath $batchRoot) {
  throw "Refusing to reuse existing recovery batch: $batchRoot"
}

New-Item -ItemType Directory -Force -Path $sourceRoot | Out-Null
$artifactArgs = @('--batch-id', $BatchId)

try {
  foreach ($database in $databases) {
    $output = Join-Path $sourceRoot "$($database.Id).sql"
    $partial = "$output.partial"
    $complete = $false
    for ($attempt = 1; $attempt -le 3 -and -not $complete; $attempt++) {
      if (Test-Path -LiteralPath $partial) { Remove-Item -LiteralPath $partial -Force }
      & npx.cmd wrangler d1 export $database.Name --remote --config wrangler.production.jsonc --output $partial
      if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $partial) -and (Get-Item -LiteralPath $partial).Length -ge $database.MinimumBytes) {
        $complete = $true
      }
    }
    if (-not $complete) {
      if (Test-Path -LiteralPath $partial) { Remove-Item -LiteralPath $partial -Force }
      throw "Export failed or was below its minimum size for $($database.Id). No manifest will be created."
    }
    Move-Item -LiteralPath $partial -Destination $output
    $digest = (Get-FileHash -LiteralPath $output -Algorithm SHA256).Hash.ToLowerInvariant()
    Set-Content -LiteralPath "$output.sha256" -Value "$digest  $($database.Id).sql" -Encoding Ascii
    $artifactArgs += @('--artifact', "d1_export:$($database.Id)=$output")
  }

  & node (Join-Path $repo 'scripts\build-recovery-batch-manifest.mjs') @artifactArgs
  if ($LASTEXITCODE -ne 0) { throw 'Recovery manifest creation failed.' }
  [pscustomobject]@{
    mode = 'local_export_complete'
    batch_id = $BatchId
    batch_root = $batchRoot
    external_upload_attempted = $false
    restore_attempted = $false
    retention_changed = $false
    next_step = 'Use the separately approved independent-provider upload and retrieval procedure.'
  } | ConvertTo-Json -Compress
}
catch {
  # The source files are intentionally preserved for diagnosis and a later,
  # explicitly approved retry. This script never deletes a prior batch.
  throw
}
