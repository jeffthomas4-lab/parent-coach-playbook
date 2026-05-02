# Run from inside the parent-coach-playbook folder.
# Commits the lacrosse-boys / lacrosse-girls split and pushes to origin/main.
# Cloudflare Pages will auto-deploy in ~60-90 seconds.

# 1. Clear any stuck git state from prior sessions
if (Test-Path .git\rebase-apply) { git am --abort 2>$null }
Remove-Item .git\index.lock -ErrorAction SilentlyContinue

# 2. Stage ONLY the lacrosse files (leaves your other in-progress edits untouched)
git add `
  src/content/config.ts `
  src/data/site.ts `
  "src/pages/what-to-buy/[slug]/sizing.astro" `
  src/content/guides/lacrosse-boys.md `
  src/content/guides/lacrosse-girls.md `
  src/content/guides/lacrosse.md `
  src/content/coachingTips/lacrosse-boys-clearing-pattern-ages-13-14.md `
  src/content/coachingTips/lacrosse-boys-cradling-on-the-move-ages-8-10.md `
  src/content/coachingTips/lacrosse-boys-face-off-intro-ages-11-12.md `
  src/content/coachingTips/lacrosse-boys-ground-ball-scoop-battles-ages-11-12.md `
  src/content/coachingTips/lacrosse-boys-riding-pressure-ages-13-14.md `
  src/content/coachingTips/lacrosse-boys-two-line-passing-ages-8-10.md `
  src/content/coachingTips/lacrosse-girls-clearing-pattern-ages-13-14.md `
  src/content/coachingTips/lacrosse-girls-cradling-on-the-move-ages-8-10.md `
  src/content/coachingTips/lacrosse-girls-face-off-intro-ages-11-12.md `
  src/content/coachingTips/lacrosse-girls-ground-ball-scoop-battles-ages-11-12.md `
  src/content/coachingTips/lacrosse-girls-riding-pressure-ages-13-14.md `
  src/content/coachingTips/lacrosse-girls-two-line-passing-ages-8-10.md `
  src/content/coachingTips/lacrosse-clearing-pattern-ages-13-14.md `
  src/content/coachingTips/lacrosse-cradling-on-the-move-ages-8-10.md `
  src/content/coachingTips/lacrosse-face-off-intro-ages-11-12.md `
  src/content/coachingTips/lacrosse-ground-ball-scoop-battles-ages-11-12.md `
  src/content/coachingTips/lacrosse-riding-pressure-ages-13-14.md `
  src/content/coachingTips/lacrosse-two-line-passing-ages-8-10.md

# 3. Commit
git commit -m "Split lacrosse into lacrosse-boys and lacrosse-girls"

# 4. Push to GitHub. Cloudflare auto-builds.
git push origin main
