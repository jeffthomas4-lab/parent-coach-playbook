# Plan: staging release rehearsal

**Plan ID:** 009
**Author:** Codex
**Date:** 2026-07-15
**Status:** Complete

## Objective

Validate the complete current migration branch, deploy that exact validated source to the existing staging Worker, and perform read-only acceptance checks before presenting the separate production cutover gate.

## Tier

Tier 3 because it includes an external staging deployment and verifies authentication-protected administrative surfaces bound to shared D1/R2 resources.

## Business outcome

Jeff receives current evidence that the release candidate builds, deploys, and serves its public and protected staging surfaces before deciding whether to authorize production cutover.

## Current-state evidence

- **Verified in code, 2026-07-15:** branch `migration/pages-to-workers-staging` is clean at `0736451` before this plan checkpoint.
- **Verified by tests:** Plan 008 completed two full builds without a heap override and retained all 4,060 HTML pages.
- **Confirmed live, 2026-07-15:** `parent-coach-desk-staging` newest version is `88711555-7f3b-4123-bec6-098075f2a095`.
- **Confirmed live, 2026-07-15:** Cloudflare OAuth authentication is valid for the intended account.

## Scope

Checkpoint this plan, run the repository validation gates, perform a Wrangler dry run, deploy to `parent-coach-desk-staging`, inspect active version/bindings metadata, and verify public plus Access-protected routes read-only.

## Non-goals

- No production deployment, custom-domain change, Pages project change, DNS change, migration, secret/binding mutation, Access policy change, shared D1/R2 write, outbound communication, cron invocation, bot setting, or DMARC change.
- Do not exercise admin actions, forms, mutating APIs, scheduled handlers, or write-path acceptance tests.
- Do not push or merge.

## Files likely affected

- `coordination/plans/009-staging-release-rehearsal.md`
- `coordination/CURRENT_STATE.md`
- `coordination/HANDOFF.md`
- `coordination/handoffs/2026-07-15-plan-009-staging-release-rehearsal.md`
- `coordination/reviews/2026-07-15-staging-release-rehearsal.md`

## Step-by-step implementation

1. Commit this approved plan locally and confirm a clean worktree and exact commit SHA.
2. Run dependency audit, unit tests, TypeScript checks, Astro check, and a full default-heap build.
3. Revert generated timestamp-only manifest churn and confirm no unexplained source changes.
4. Run `wrangler deploy --dry-run` against the fresh generated configuration and verify expected binding names.
5. Deploy the existing staging Worker, record the new version and prior rollback version, and verify active deployment metadata.
6. Perform read-only HTTP/browser checks for the public homepage, security.txt, anonymous Access redirects, authenticated admin dashboard, and authenticated editorial preview.
7. Record evidence, independently review results, commit coordination updates, and leave the worktree clean.
8. Present the production cutover as a separate explicit approval gate.

## Testing strategy

- `npm audit --audit-level=high`
- `npm test`
- `npx tsc -p tsconfig.verify.json --noEmit`
- `npx tsc -p worker-cron/tsconfig.json --noEmit`
- `npm run check`
- `npm run build` with `NODE_OPTIONS` absent
- `npx wrangler deploy --dry-run`
- Read-only staging HTTP and authenticated browser acceptance checks

## Acceptance criteria

- Every local validation command exits 0.
- The full build succeeds without a heap override and generated-only timestamp churn is not committed.
- Dry-run and deployment contain the expected `DB`, `FORGE_DB`, `PHOTOS`, `SESSION`, `ASSETS`, `SITE_URL`, `ADMIN_EMAILS`, `ACCESS_TEAM_DOMAIN`, and `ACCESS_AUD` names.
- A new staging version is active and the previous active version is documented for rollback.
- Public routes return expected successful responses; anonymous protected routes redirect to Access; authenticated protected pages render without any mutating action.
- Nothing is pushed or deployed to production, and shared data is not mutated.
- Coordination evidence is committed locally and the worktree is clean.

## Human approval gates

Jeff approved this staging rehearsal on 2026-07-15. Production deployment remains a separate explicit approval gate after the rehearsal evidence is presented.

## Dependencies

Valid Wrangler OAuth authentication, the existing staging Worker and bindings, and an already authenticated in-app browser session for protected-page verification.

## Architecture and data flow

The local Astro build produces static assets and a Worker bundle. Wrangler deploys them only to `parent-coach-desk-staging`. HTTP checks read static pages and protected SSR/admin pages; no action endpoint, form submission, D1 mutation, R2 mutation, or scheduled handler is invoked.

## Data model or migration changes

None.

## Security and privacy requirements

Preserve Cloudflare Access on `/admin` and `/api/admin`, never log credentials or tokens, and keep acceptance checks read-only because staging shares production D1/R2 resources.

## Failure modes

- Any validation failure stops deployment.
- Dry-run binding mismatch stops deployment.
- Deployment failure leaves the current staging version active.
- Acceptance regression triggers rollback to the recorded prior version; no data rollback is required because checks are read-only.

## Edge cases

- An expired Access browser session may require Jeff to authenticate interactively; this blocks only authenticated checks, not safe local validation.
- Cloudflare may create a new version before traffic assignment finishes; verify the active deployment rather than assuming the newest upload is serving.
- Generated `public/link-manifest.json` timestamp churn must be reverted after the final build.

## Observability

Use command exit codes, Wrangler version/deployment metadata, response status/content type, page titles, and visible protected-page landmarks. Do not invoke live tailing unless a read-only acceptance check fails.

## Deployment plan

Deploy only the root Worker configuration to `parent-coach-desk-staging` after a fresh build and successful dry run. Do not specify or alter any production route or custom domain.

## Rollback plan

If staging acceptance fails, roll back `parent-coach-desk-staging` to version `88711555-7f3b-4123-bec6-098075f2a095` and repeat the failing read-only check. No schema or data rollback is needed.

## Execution evidence

- Release candidate: clean commit `13bfec6c2f13e77f31e2d17832018e05d50863f4`.
- `npm.cmd audit --audit-level=high`: exit 0; 0 vulnerabilities. Jeff explicitly approved sending dependency metadata to npm after the environment disclosed that behavior.
- Focused publish tests: 32/32 passed. Full unit suite: 27 files and 232/232 tests passed.
- `npx.cmd tsc -p tsconfig.verify.json --noEmit`: exit 0.
- `npx.cmd tsc -p worker-cron/tsconfig.json --noEmit`: exit 0.
- `npm.cmd run check` with `NODE_OPTIONS` absent: exit 0; 0 errors, 0 warnings, 349 hints.
- `npm.cmd run build` with `NODE_OPTIONS` absent: exit 0 in 58.6 seconds; 4,060 HTML pages and 1,816 admin previews retained. Timestamp-only manifest churn was reverted.
- `npx.cmd wrangler deploy --dry-run`: exit 0; 9,233 assets and all expected bindings present.
- Staging deployment: version `6078f32b-bfde-4c43-bb94-20601702d9c0`, active at 100%; Worker startup time 23 ms. Rollback target remains `88711555-7f3b-4123-bec6-098075f2a095`.
- Anonymous `/` and `/.well-known/security.txt`: 200. Anonymous `/admin` and `/api/admin/editorial`: Cloudflare Access 302.
- Authenticated read-only checks: `/admin/` rendered `Desk operations` with seven workspace links; `/admin/editorial/` rendered `Editorial review board`; `/admin/preview/articles/night-before-tryouts/` rendered `The night before tryouts`.
- No production deployment, push, migration, shared-data write, outbound publish action, secret/binding change, cron invocation, bot change, or DMARC change occurred.
