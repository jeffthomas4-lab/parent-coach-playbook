# /build-task

Build exactly one task from SITE_IMPROVEMENTS.md.

**Usage:** `/build-task [task-number]` (e.g. `/build-task 5` for RSS expansion)

## Steps

1. Read the task entry in `SITE_IMPROVEMENTS.md` — the tier, description, and any notes
2. Delegate to `engineering-manager` subagent:

   > Build task [n] from SITE_IMPROVEMENTS.md on parentcoachdesk.com. Stack: Astro hybrid on Cloudflare Pages, TypeScript, Tailwind, content collections in src/content/, data files in src/data/. Read the task description exactly and implement only what it says — no adjacent scope. When done: run npm run build (zero errors required), list files changed, and output the deploy block per About Me/Deployments.md (build → git add/commit → wrangler pages deploy dist --project-name parent-coach-playbook --branch main → git push). Commit message must be specific and one line.

3. Review the output before running the deploy block
4. After deploy: mark the task complete in SITE_IMPROVEMENTS.md with the date

**Hard rules:**
- Build must pass before deploying
- Scope is the task description only — no adjacent cleanup, no refactoring
- If a security issue is found while building, stop and run /security-check first

**Output:** FILES_CHANGED | BUILD_STATUS | DEPLOY_BLOCK (paste-ready PowerShell)
