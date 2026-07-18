# Claude review + Chrome handoff — PCD Worker revamp

## What Codex implemented

- Added `HEAD /api/agent-runs`: bearer-authenticated, non-mutating readiness
  probe. It returns `204` only when the token and `FORGE_DB` are present; `403`
  for a missing or mismatched bearer; and `503` if server configuration is
  incomplete. It does not write a synthetic `agent_runs` row.
- Added immutable same-commit dual-target deployment workflow:
  `.github/workflows/deploy-workers.yml`.
  - verifies a full SHA is already contained in `main`;
  - builds staging and production artifacts separately from that SHA;
  - records and verifies SHA-256 hashes before deployment;
  - deploys staging first, then waits for protected production Environment
    approval;
  - uses the generated `dist/server/wrangler.json` manifest for dry-run and
    deploy;
  - supports a gated, exact-SHA `workflow_dispatch` emergency path.
- Added generated-manifest staging validation and target-specific smoke script.
- Added `DEPLOYMENT-RUNBOOK.md` and
  `automation/TASK-RUN-LOG-RECONCILIATION.md`.
- Corrected stale Worker-local development wording, the `/admin` route-control
  classification, and an intermittent disposable-D1 test timeout.

## Codex validation evidence

- `npm test`: 126 test files, 705 tests passing.
- `npm run check`: 0 errors (existing warnings/hints only).
- `npm run check:staging-manifest`: passed.
- `npm run check:production-manifest`: passed.
- `npm run check:workflow-pins`: passed.
- Workflow YAML parses and `git diff --check` passes.

## Claude review request

Review the complete diff, with special attention to:

1. `HEAD /api/agent-runs` ordering and status-code behavior. Confirm it does
   not reveal or write credentials/data.
2. `deploy-workers.yml` GitHub Actions syntax, artifact path semantics, and
   whether the pinned `actions/download-artifact` commit is correct.
3. The use of `dist/server/wrangler.json` for both dry-run and deployment.
4. Environment gate behavior. The workflow intentionally refuses to deploy
   unless `vars.DEPLOY_GATE_CONFIGURED == 'true'` in the target Environment.
5. The existing untracked PCD build-plan files are user artifacts; do not
   delete or rewrite them as part of this change.

## Chrome tasks for Jeff / Claude

Perform these in GitHub and Cloudflare; do not expose any secret value in chat,
screenshots, commit messages, logs, or repository files.

### GitHub repository Environments

Create or verify `staging` and `production` Environments.

For `production`:

1. Restrict deployments to `main` / protected branches.
2. Add Jeff as a required reviewer; disable administrator bypass if the plan
   supports it.
3. Set environment variable `DEPLOY_GATE_CONFIGURED` to `true` only after the
   preceding controls are confirmed.
4. Add environment secrets `CLOUDFLARE_API_TOKEN` and
   `CLOUDFLARE_ACCOUNT_ID`. The token must be Cloudflare account-scoped only as
   narrowly as Cloudflare permits and limited to Workers deployment capability;
   do not grant DNS, Pages, D1 data, R2 object, Access, or account-admin access.

For `staging`:

1. Add its separate least-privilege Cloudflare token and account ID.
2. Set `DEPLOY_GATE_CONFIGURED=true` only after confirming it cannot reach
   production resources.

### Cloudflare verification

1. Review the `parent-coach-desk-staging` and `parent-coach-desk` binding
   separation before enabling CI.
2. Confirm Worker runtime secrets remain present by **name only** after the
   first CI deploy. Never copy their values into GitHub.
3. Deploy the already-reviewed `worker-cron` revision through the separately
   approved process. It must remove the obsolete Pages deploy hook; do not
   manually fire the production sweep as a smoke test.
4. Perform and record a staging Worker rollback drill before enabling normal
   production delivery.

## Explicitly out of scope for this handoff

- Rotating/removing the burned OpenAI key and editing `.env` values.
- Real Cloudflare Access login testing with an allowlisted identity.
- Changing scheduled-task secret stores or enabling all nine task callers.
- Deploying any Worker, editing runtime secrets, disabling/deleting schedules,
  or deleting the `manual-test` D1 row.

Those actions remain separately gated by Jeff.
