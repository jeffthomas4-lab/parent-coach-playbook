# PCD ops turn-on — run once. Sets Cloudflare Pages secrets + the GitHub CRON_KEY.
# Lives outside the git repo on purpose; nothing here gets committed.
# I can't type secret values into web fields, so this script (which YOU run) is how they get set.
$ErrorActionPreference = "Stop"
$Project = "parent-coach-playbook"          # live Pages project per CLAUDE.md deploy norm
$Repo    = "jeffthomas4-lab/parent-coach-playbook"
Set-Location "$HOME\Desktop\Claude Cowork\Outputs\Field and Forge\parent-coach-desk"

Write-Host "`n== Confirm the live project below is '$Project' before continuing ==" -ForegroundColor Cyan
npx wrangler pages project list
Read-Host "`nPress Enter to continue (Ctrl+C to abort if the project name is different)"

# 1) CRON_KEY — fresh value, identical in Cloudflare and GitHub
$cron = -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Minimum 0 -Maximum 256) })
$cron | npx wrangler pages secret put CRON_KEY --project-name $Project
gh secret set CRON_KEY --repo $Repo --body $cron
Write-Host "CRON_KEY set (Cloudflare + GitHub)." -ForegroundColor Green

# 2) Heartbeat (Healthchecks.io ping URL)
"https://hc-ping.com/b219b840-726e-4421-b5d7-a42df980b0e7" | npx wrangler pages secret put OPS_HEARTBEAT_URL --project-name $Project
Write-Host "OPS_HEARTBEAT_URL set." -ForegroundColor Green

# 3) Access — harvested from your dashboard (identifiers, not secrets). Stops admin auth running unverified.
"fieldforge.cloudflareaccess.com" | npx wrangler pages secret put ACCESS_TEAM_DOMAIN --project-name $Project
"f62ae793e5e4685b8490c8f16ab196069649420860eec79d860921ae4b65aa23" | npx wrangler pages secret put ACCESS_AUD --project-name $Project
Write-Host "ACCESS_TEAM_DOMAIN + ACCESS_AUD set." -ForegroundColor Green

# 4) Sentry — DSN from your parallel Sentry session (safe to be public)
$dsn = Read-Host "`nPaste your Sentry DSN (or leave blank to skip)"
if ($dsn) {
  $dsn | npx wrangler pages secret put SENTRY_DSN --project-name $Project
  Add-Content .env "`nPUBLIC_SENTRY_DSN=$dsn`nPUBLIC_SENTRY_ENVIRONMENT=production"
  Write-Host "SENTRY_DSN set + PUBLIC_SENTRY_DSN written to .env." -ForegroundColor Green
} else { Write-Host "Sentry skipped." -ForegroundColor Yellow }

# 5) Resend — optional, go live now only if the sending domain is verified in Resend
$resend = Read-Host "`nPaste RESEND_API_KEY to take email live now (or leave blank to skip)"
if ($resend) {
  $adminEmail = Read-Host "Admin email for alerts (e.g. eepskalla@gmail.com)"
  $resend | npx wrangler pages secret put RESEND_API_KEY --project-name $Project
  "Parent Coach Desk <hello@parentcoachdesk.com>" | npx wrangler pages secret put EMAIL_FROM --project-name $Project
  $adminEmail | npx wrangler pages secret put ADMIN_EMAILS --project-name $Project
  "send" | npx wrangler pages secret put EMAIL_ADMIN_MODE --project-name $Project
  Write-Host "Resend admin-alert path live." -ForegroundColor Green
} else { Write-Host "Resend skipped (still staged to Slack)." -ForegroundColor Yellow }

Write-Host "`n== Secrets now on $Project ==" -ForegroundColor Cyan
npx wrangler pages secret list --project-name $Project
Write-Host "`nNOTE: Cloudflare Pages applies secret changes on the next deploy." -ForegroundColor Yellow
Write-Host "Deploy ONLY once the Sentry code is a clean, intended commit:" -ForegroundColor Yellow
Write-Host "  npm run build; git add -A; git commit -m 'Wire ops stack'; npx wrangler pages deploy dist --project-name $Project --branch main; git push"
