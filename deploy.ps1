# Full deploy script for Parent Coach Playbook.
# Usage:  .\deploy.ps1
# Stops on first error. Will not push if the build fails.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "`n=== 1/6  Verifying repo ===" -ForegroundColor Cyan
git rev-parse --is-inside-work-tree | Out-Null
$branch = git rev-parse --abbrev-ref HEAD
Write-Host "Branch: $branch"

Write-Host "`n=== 2/6  Installing dependencies ===" -ForegroundColor Cyan
npm install --no-audit --no-fund

Write-Host "`n=== 3/6  Generating per-article OG images ===" -ForegroundColor Cyan
python scripts/build-og-images.py

Write-Host "`n=== 4/6  Building site ===" -ForegroundColor Cyan
npm run build
if (-not (Test-Path "dist/index.html")) {
    throw "Build did not produce dist/index.html. Aborting before push."
}
$pageCount = (Get-ChildItem -Path dist -Recurse -Filter *.html | Measure-Object).Count
Write-Host "Built $pageCount HTML pages." -ForegroundColor Green

Write-Host "`n=== 5/6  Committing changes ===" -ForegroundColor Cyan
git add .
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "Nothing to commit. Already clean." -ForegroundColor Yellow
} else {
    Write-Host "Files staged:"
    $staged | ForEach-Object { Write-Host "  $_" }
    git commit -m "Site upgrades: GA4, Web Vitals, FTC disclosures, accessibility, OG images, favicons, redirects"
}

Write-Host "`n=== 6/6  Pushing to GitHub (Cloudflare Pages auto-deploys) ===" -ForegroundColor Cyan
git push origin $branch

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "  PUSH COMPLETE" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Cloudflare Pages will rebuild in ~60-90s."
Write-Host ""
Write-Host "Verify when deploy completes:"
Write-Host "  https://parentcoachplaybook.com/"
Write-Host "  https://parentcoachplaybook.com/disclosure/"
Write-Host "  https://parentcoachplaybook.com/accessibility/"
Write-Host "  https://parentcoachplaybook.com/privacy/        (should 301 to /disclosure/)"
Write-Host "  https://parentcoachplaybook.com/contact/        (should 301 to /about/)"
Write-Host "  https://parentcoachplaybook.com/what-to-buy/baseball/"
Write-Host "  https://parentcoachplaybook.com/cost-calculator/"
Write-Host "  https://parentcoachplaybook.com/og/are-youth-sports-worth-it.jpg"
Write-Host ""
Write-Host "Then check GA4 Realtime: https://analytics.google.com"
