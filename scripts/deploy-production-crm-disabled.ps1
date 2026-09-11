[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$ExpectedCandidate,
  [Parameter(Mandatory = $true)][string]$ExpectedArtifactSha256,
  [Parameter(Mandatory = $true)][string]$ExpectedManifestSha256,
  [switch]$Execute,
  [string]$TypeConfirmation
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$expectedConfigSha256 = 'a7bb8f8a897104fc1e67eed072fa5ea5b7d7067eb6ae7b50998a7324eb4a3758'
$expectedConfirmation = 'DEPLOY parent-coach-desk CRM DISABLED TO PRODUCTION'
$workerName = 'parent-coach-desk'

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$configPath = Join-Path $projectRoot 'wrangler.production.jsonc'
$manifestPath = Join-Path $projectRoot 'dist\server\wrangler.json'
$buildInfoPath = Join-Path $projectRoot 'dist\client\build-info.json'
$wranglerPath = Join-Path $projectRoot 'node_modules\wrangler\bin\wrangler.js'
$verifierPath = Join-Path $projectRoot 'scripts\verify-production-crm-disabled-release.mjs'
$hashModulePath = Join-Path $projectRoot 'scripts\deploy-staging-verified.mjs'

function Get-Sha256([string]$Path) {
  return (Get-FileHash -Algorithm SHA256 -LiteralPath $Path).Hash.ToLowerInvariant()
}

function Assert-Equal([string]$Actual, [string]$Expected, [string]$Label) {
  if ($Actual -cne $Expected) { throw "$Label mismatch" }
}

function Invoke-WranglerJson([string[]]$Arguments, [string]$Label) {
  $output = @(& node.exe $wranglerPath @Arguments)
  if ($LASTEXITCODE -ne 0) { throw "$Label failed" }
  try {
    return (($output -join [Environment]::NewLine) | ConvertFrom-Json)
  } catch {
    throw "$Label returned invalid JSON"
  }
}

function Assert-LiveDisabledVersion(
  [string]$ExpectedVersionId,
  [string]$ExpectedVersionTag,
  [bool]$RequireActive
) {
  $version = Invoke-WranglerJson @(
    'versions', 'view', $ExpectedVersionId,
    '--name', $workerName, '--config', $manifestPath, '--json'
  ) 'Wrangler version readback'
  $deployments = @()
  if ($RequireActive) {
    $deployments = @(Invoke-WranglerJson @(
      'deployments', 'list', '--name', $workerName, '--config', $manifestPath, '--json'
    ) 'Wrangler deployment readback')
  }

  $snapshotPath = Join-Path $projectRoot (
    "backups\pcd-crm-production-live-snapshot-{0}.json" -f [Guid]::NewGuid().ToString('N')
  )
  try {
    $snapshot = [ordered]@{
      expectedVersionId = $ExpectedVersionId
      expectedVersionTag = $ExpectedVersionTag
      requireActive = $RequireActive
      deployments = $deployments
      version = $version
    } | ConvertTo-Json -Depth 100
    [IO.File]::WriteAllText($snapshotPath, $snapshot, [Text.UTF8Encoding]::new($false))
    & node.exe $verifierPath --live-snapshot $snapshotPath | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'disabled production CRM live-version verification failed' }
  } finally {
    if (Test-Path -LiteralPath $snapshotPath) { Remove-Item -Force -LiteralPath $snapshotPath }
  }
}

if ($Execute -and $TypeConfirmation -cne $expectedConfirmation) {
  throw "-TypeConfirmation must exactly equal '$expectedConfirmation'"
}
if ($ExpectedCandidate -notmatch '^[a-f0-9]{40}$') { throw 'expected candidate must be a full lowercase Git SHA' }
if ($ExpectedArtifactSha256 -notmatch '^[a-f0-9]{64}$') { throw 'expected artifact SHA-256 is malformed' }
if ($ExpectedManifestSha256 -notmatch '^[a-f0-9]{64}$') { throw 'expected manifest SHA-256 is malformed' }

$status = @(& git -C $projectRoot status --porcelain --untracked-files=normal)
if ($LASTEXITCODE -ne 0) { throw 'git status failed' }
$unexpectedStatus = @($status | Where-Object {
  $_ -notmatch '^ M public/link-manifest\.json$' -and $_ -notmatch '^\?\? public/og/[a-z0-9-]+\.jpg$'
})
if ($unexpectedStatus.Count -gt 0) { throw 'worktree has changes outside approved build-generated paths' }

$actualCandidate = (& git -C $projectRoot rev-parse HEAD).Trim()
if ($LASTEXITCODE -ne 0) { throw 'git rev-parse failed' }
Assert-Equal $actualCandidate $ExpectedCandidate 'checked-out candidate'
Assert-Equal (Get-Sha256 $configPath) $expectedConfigSha256 'production config SHA-256'
Assert-Equal (Get-Sha256 $manifestPath) $ExpectedManifestSha256 'generated manifest SHA-256'

$buildInfo = Get-Content -Raw -LiteralPath $buildInfoPath | ConvertFrom-Json
Assert-Equal ([string]$buildInfo.commit) $ExpectedCandidate 'build-info candidate'

Push-Location $projectRoot
try {
  $artifactHash = (& node.exe --input-type=module -e "import { hashBuildArtifact } from './scripts/deploy-staging-verified.mjs'; console.log(await hashBuildArtifact(process.cwd()));").Trim()
  if ($LASTEXITCODE -ne 0) { throw 'build artifact hashing failed' }
  Assert-Equal $artifactHash $ExpectedArtifactSha256 'build artifact SHA-256'
  & node.exe $verifierPath --manifest $manifestPath | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'disabled production CRM manifest verification failed' }
} finally {
  Pop-Location
}

if (-not $Execute) {
  [ordered]@{
    execute = $false
    candidate = $ExpectedCandidate
    artifactSha256 = $ExpectedArtifactSha256
    manifestSha256 = $ExpectedManifestSha256
    configSha256 = $expectedConfigSha256
    worker = $workerName
  } | ConvertTo-Json -Compress
  exit 0
}

$versionTag = "crm-p17-disabled-$ExpectedCandidate"
$versionMessage = 'CRM production producer exact candidate; adapter and backfill disabled'
$existingVersions = @(Invoke-WranglerJson @(
  'versions', 'list', '--name', $workerName, '--config', $manifestPath, '--json'
) 'Wrangler pre-upload version list')
$existingTagMatches = @($existingVersions | Where-Object {
  $_.annotations.'workers/tag' -ceq $versionTag
})
if ($existingTagMatches.Count -ne 0) { throw 'exact candidate version tag already exists' }

# The installed production version already owns the adapter secret. Wrangler preserves
# existing secrets on version upload; --keep-vars preserves dashboard-managed plain vars.
& node.exe $wranglerPath versions upload --config $manifestPath `
  --keep-vars --strict --tag $versionTag --message $versionMessage
if ($LASTEXITCODE -ne 0) { throw 'Wrangler production version upload failed' }

$uploadedVersions = @(Invoke-WranglerJson @(
  'versions', 'list', '--name', $workerName, '--config', $manifestPath, '--json'
) 'Wrangler post-upload version list')
$uploadedTagMatches = @($uploadedVersions | Where-Object {
  $_.annotations.'workers/tag' -ceq $versionTag
})
if ($uploadedTagMatches.Count -ne 1) { throw 'exact candidate version tag did not resolve uniquely' }
$uploadedVersionId = [string]$uploadedTagMatches[0].id
if ($uploadedVersionId -notmatch '^[a-f0-9-]{36}$') { throw 'uploaded version ID is malformed' }

Assert-LiveDisabledVersion $uploadedVersionId $versionTag $false
& node.exe $wranglerPath versions deploy --version-id $uploadedVersionId --percentage 100 `
  --name $workerName --config $manifestPath --yes --message $versionMessage
if ($LASTEXITCODE -ne 0) { throw 'Wrangler production version promotion failed' }

Assert-LiveDisabledVersion $uploadedVersionId $versionTag $true
Start-Sleep -Seconds 15
Assert-LiveDisabledVersion $uploadedVersionId $versionTag $true

[ordered]@{
  deployed = $true
  versionId = $uploadedVersionId
  versionTag = $versionTag
  candidate = $ExpectedCandidate
  artifactSha256 = $ExpectedArtifactSha256
  adapterSecretInherited = $true
  adapterEnabled = $false
  backfillEnabled = $false
} | ConvertTo-Json -Compress
