[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$ExpectedCandidate,
  [Parameter(Mandatory = $true)][string]$ExpectedArtifactSha256,
  [Parameter(Mandatory = $true)][string]$ExpectedManifestSha256,
  [Parameter(Mandatory = $true)][string]$SecretPackPath,
  [switch]$Execute,
  [switch]$ValidatePack,
  [string]$TypeConfirmation
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$expectedConfigSha256 = 'a7bb8f8a897104fc1e67eed072fa5ea5b7d7067eb6ae7b50998a7324eb4a3758'
$expectedSecretPackSha256 = 'd35e2b02da2fa61669a39df8eb601110467f1303e017292d377801e575b21bf0'
$expectedSecretFingerprint = 'd332f102ffeb118f000199fe77e1e45f50f379266b8b86f59f722d5ab3c1ba73'
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

function Get-ValueFingerprint([string]$Value) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($Value)
  $sha = [Security.Cryptography.SHA256]::Create()
  try {
    $digest = $sha.ComputeHash($bytes)
    try {
      return (($digest | ForEach-Object { $_.ToString('x2') }) -join '')
    } finally {
      [Array]::Clear($digest, 0, $digest.Length)
    }
  } finally {
    $sha.Dispose()
    [Array]::Clear($bytes, 0, $bytes.Length)
  }
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

if ($Execute -and $ValidatePack) { throw '-Execute and -ValidatePack are mutually exclusive' }
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
Assert-Equal (Get-Sha256 (Resolve-Path -LiteralPath $SecretPackPath).Path) $expectedSecretPackSha256 'secret pack SHA-256'

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

if (-not $Execute -and -not $ValidatePack) {
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

Add-Type -AssemblyName System.Security
$storedCipher = $null
$secretBytes = $null
$secretJson = $null
$adapterSecret = $null
$ephemeralPath = Join-Path $projectRoot ("backups\pcd-crm-production-secret-{0}.json" -f [Guid]::NewGuid().ToString('N'))
$stream = $null
$writer = $null

try {
  $storedCipher = [IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $SecretPackPath).Path)
  $secretBytes = [Security.Cryptography.ProtectedData]::Unprotect(
    $storedCipher, $null, [Security.Cryptography.DataProtectionScope]::CurrentUser
  )
  $secretJson = [Text.Encoding]::UTF8.GetString($secretBytes)
  $parsed = $secretJson | ConvertFrom-Json
  $expectedNames = @(
    'CONTACT_ENCRYPTION_KEY_BASE64', 'CONTACT_DIGEST_HMAC_SECRET',
    'NOTE_ENCRYPTION_KEY_BASE64', 'PRIVACY_ENCRYPTION_KEY_BASE64',
    'PRIVACY_TURNSTILE_SECRET', 'PCD_ADAPTER_HMAC_SECRET',
    'SIGHTSMASH_ADAPTER_HMAC_SECRET'
  )
  if (@(Compare-Object ($expectedNames | Sort-Object) (@($parsed.PSObject.Properties.Name) | Sort-Object)).Count -ne 0) {
    throw 'production secret pack name set mismatch'
  }
  $adapterSecret = [string]$parsed.PCD_ADAPTER_HMAC_SECRET
  if ([string]::IsNullOrWhiteSpace($adapterSecret)) { throw 'PCD adapter secret is empty' }
  Assert-Equal (Get-ValueFingerprint $adapterSecret) $expectedSecretFingerprint 'PCD adapter secret fingerprint'

  if ($ValidatePack) {
    [ordered]@{
      validated = $true
      secretPackSha256 = $expectedSecretPackSha256
      pcdAdapterSecretFingerprint = $expectedSecretFingerprint
    } | ConvertTo-Json -Compress
    return
  }

  $directory = Split-Path -Parent $ephemeralPath
  if (-not (Test-Path -LiteralPath $directory)) { New-Item -ItemType Directory -Path $directory | Out-Null }
  $stream = [IO.FileStream]::new(
    $ephemeralPath, [IO.FileMode]::CreateNew, [IO.FileAccess]::ReadWrite,
    [IO.FileShare]::Read, 4096, [IO.FileOptions]::DeleteOnClose
  )
  $writer = [IO.StreamWriter]::new($stream, [Text.UTF8Encoding]::new($false), 4096, $true)
  $writer.Write((@{ PCD_CRM_ADAPTER_HMAC_SECRET = $adapterSecret } | ConvertTo-Json -Compress))
  $writer.Flush()
  $stream.Flush($true)

  $versionTag = "crm-p17-disabled-$ExpectedCandidate"
  $versionMessage = 'CRM production producer exact candidate; adapter and backfill disabled'
  $existingVersions = @(Invoke-WranglerJson @(
    'versions', 'list', '--name', $workerName, '--config', $manifestPath, '--json'
  ) 'Wrangler pre-upload version list')
  $existingTagMatches = @($existingVersions | Where-Object {
    $_.annotations.'workers/tag' -ceq $versionTag
  })
  if ($existingTagMatches.Count -ne 0) { throw 'exact candidate version tag already exists' }

  & node.exe $wranglerPath versions upload --config $manifestPath --secrets-file $ephemeralPath `
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
    secretFingerprint = $expectedSecretFingerprint
    adapterEnabled = $false
    backfillEnabled = $false
    ephemeralPlaintextDeletedOnClose = $true
  } | ConvertTo-Json -Compress
} finally {
  if ($writer) { $writer.Dispose() }
  if ($stream) { $stream.Dispose() }
  if (Test-Path -LiteralPath $ephemeralPath) { Remove-Item -Force -LiteralPath $ephemeralPath }
  if ($storedCipher) { [Array]::Clear($storedCipher, 0, $storedCipher.Length) }
  if ($secretBytes) { [Array]::Clear($secretBytes, 0, $secretBytes.Length) }
  $adapterSecret = $null
  $secretJson = $null
  $parsed = $null
  [GC]::Collect()
}
