# Deploys the lacrosse-boys / lacrosse-girls split via Wrangler.
# Run from inside the parent-coach-playbook folder.

# 1. Build the site
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed. Stopping."; exit 1 }

# 2. Push to Cloudflare Pages
npx wrangler pages deploy ./dist --project-name=parent-coach-playbook --branch=main
