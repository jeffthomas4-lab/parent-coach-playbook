<#
.SYNOPSIS
    Build and deploy Parent Coach Desk to Cloudflare Pages, then push to GitHub.

.DESCRIPTION
    Cloudflare Pages on this project is wrangler-deployed (direct upload),
    NOT git-connected. Pushing to GitHub does not trigger a deploy. This
    script does both, in the right order: wrangler is the step that actually
    ships the site; the git steps are version-history housekeeping.

    If wrangler succeeds and git push fails, the site is still live. The
    script will tell you to retry the push later instead of error-blocking.

.PARAMETER Message
    Custom commit message. Defaults to a timestamped message if omitted.

.PARAMETER NoCommit
    Skip the git commit + push steps entirely.

.PARAMETER SkipBuild
    Skip npm install + build. Useful when dist/ already has a fresh build
    you want to push live without rebuilding.

.EXAMPLE
    .\deploy.ps1
.EXAMPLE
    .\deploy.ps1 -Message "Rebrand to Parent Coach Desk"
.EXAMPLE
    .\deploy.ps1 -NoCommit
.EXAMPLE
    .\deploy.ps1 -SkipBuild
#>

param(
    [string]$Message = "",
    [switch]$NoCommit,
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$projectName = "parent-coach-playbook"
$targetBranch = "main"

function Write-Step($title) {
    Write-Host "`n=== $title ===" -ForegroundColor Cyan
}

function Write-Done($msg) {
    Write-Host $msg -ForegroundColor Green
}

function Write-Warn($msg) {
    Write-Host $msg -ForegroundColor Yellow
}

# 1. Verify repo
Write-Step "Verifying repo"
git rev-parse --is-inside-work-tree | Out-Null
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "Branch: $currentBranch"
if ($currentBranch -ne $targetBranch) {
    Write-Warn "You are on '$currentBranch', not '$targetBranch'. Continuing anyway."
}

# 2. Build
if ($SkipBuild) {
    Write-Step "Skipping build (using existing dist/)"
    if (-not (Test-Path "dist/index.html")) {
        throw "dist/index.html not found. Cannot deploy without a build. Re-run without -SkipBuild."
    }
} else {
    Write-Step "Installing dependencies"
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm install failed." }

    Write-Step "Building site (manifest, OG images, Astro build)"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "npm run build failed." }
    if (-not (Test-Path "dist/index.html")) {
        throw "Build did not produce dist/index.html. Aborting."
    }
    $pageCount = (Get-ChildItem -Path dist -Recurse -Filter *.html | Measure-Object).Count
    Write-Done "Built $pageCount HTML pages."
}

# 3. THE STEP THAT ACTUALLY DEPLOYS THE SITE
# wrangler uploads dist/ to Cloudflare Pages. Pages on this project is
# direct-upload (not git-connected), so this is non-optional.
Write-Step "Deploying to Cloudflare Pages via wrangler"
npx wrangler pages deploy ./dist --project-name=$projectName --branch=$targetBranch
if ($LASTEXITCODE -ne 0) {
    throw "wrangler deploy failed (exit code $LASTEXITCODE). Site NOT updated. Fix and rerun."
}
Write-Done "Site deployed to Cloudflare Pages."

# 4. Commit + push (best-effort)
if ($NoCommit) {
    Write-Step "Skipping commit/push (-NoCommit set)"
    Write-Done "Deploy complete. GitHub not updated."
} else {
    Write-Step "Staging changes"
    git add .
    $staged = git diff --cached --name-only
    if (-not $staged) {
        Write-Warn "Nothing to commit. Working tree clean."
    } else {
        Write-Host "Files staged:"
        $staged | ForEach-Object { Write-Host "  $_" }

        if (-not $Message) {
            $Message = "Deploy $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }

        Write-Step "Committing: $Message"
        git commit -m $Message
        if ($LASTEXITCODE -ne 0) { Write-Warn "git commit failed but site is already deployed." }
    }

    Write-Step "Pushing to GitHub (version history only, site is already live)"
    try {
        git push origin $targetBranch
        if ($LASTEXITCODE -ne 0) {
            Write-Warn "git push exited non-zero but site IS deployed."
            Write-Warn "Retry later with:   git push origin $targetBranch"
        } else {
            Write-Done "Pushed to GitHub."
        }
    } catch {
        Write-Warn "git push failed but site IS deployed."
        Write-Warn "Retry later with:   git push origin $targetBranch"
        Write-Warn "Error was: $_"
    }
}

# 5. Verification URLs
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "  DEPLOY COMPLETE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Verify the live site:"
Write-Host "  https://parentcoachdesk.com/"
Write-Host "  https://parentcoachdesk.com/about/"
Write-Host "  https://parentcoachdesk.com/disclosure/"
Write-Host "  https://parentcoachdesk.com/accessibility/"
Write-Host "  https://parentcoachdesk.com/what-to-buy/baseball/"
Write-Host "  https://parentcoachdesk.com/cost-calculator/"
Write-Host "  https://parentcoachdesk.com/camps/"
Write-Host ""
Write-Host "If still stale: hard-refresh (Ctrl+F5), or purge cache in Cloudflare dashboard."
Write-Host ""
Write-Host "Pages deployments dashboard:"
Write-Host "  https://dash.cloudflare.com -> Workers and Pages -> $projectName -> Deployments"
Write-Host ""
