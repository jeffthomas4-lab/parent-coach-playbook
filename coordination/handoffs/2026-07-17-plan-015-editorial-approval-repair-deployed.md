# Handoff: Plan 015 editorial approval repair deployed

**Date:** 2026-07-17
**From:** Codex
**To:** Jeff
**Task:** Verify the human-gated live editorial approval after the repository-target repair.
**Tier:** 2
**Approved plan path:** `coordination/plans/015-editorial-approval-repository-target-repair.md`
**Branch:** `main`
**Commit or commit range:** `bf4c424` (`fix: repair editorial approval repository target`)

## Files changed

- `src/pages/api/admin/editorial/approve.ts`
  - Uses the canonical repository, branch, and collection allowlist exported by `src/lib/publish.ts`.
  - Returns bounded `github_read_rejected` / `github_write_rejected` errors and logs only aggregate operation/status.
- `tests/api/admin-editorial-approve.test.ts`
  - Asserts both Contents API URLs target `jeffthomas4-lab/parent-coach-playbook`, asserts `main`, and proves read/write provider text is not exposed.

## Validation

| Command | Exit code | Result |
|---|---:|---|
| `npm.cmd run test:unit -- tests/api/admin-editorial-approve.test.ts` | 0 | 1 file, 8 tests passed. |
| `npm.cmd run test:unit:coverage` | 0 | 104 files, 554 tests; all coverage thresholds passed. |
| `npm.cmd run test:integration` | 0 | 10 files, 44 tests passed. |
| `npm.cmd run check` | 0 | 0 errors; 354 existing hints. |
| `npm.cmd run check:production-manifest` | 0 | Production Worker/build contract passed. |
| `npm.cmd run check:secrets` | 0 | Current files and Git history passed. |
| `npm.cmd audit --audit-level=high` | 0 | 0 vulnerabilities. |
| `npx.cmd wrangler deploy --config dist\\server\\wrangler.json --dry-run --keep-vars` | 0 | Generated Worker bundle, assets, and bindings passed. |

## Pre-existing failures

None in this repair. The initial direct `wrangler.production.jsonc` dry run is not the production deployment path for this Astro build: it tries to bundle uncompiled Astro virtual modules. The approved `npm run build:production` output generates `dist/server/wrangler.json` with `no_bundle: true`; its dry run passed and it was the deployed artifact.

## Deviations from the plan

Added explicit coverage for both GitHub read and write rejection bodies rather than only one provider-rejection test. No authorization, origin, or optimistic-concurrency behavior changed.

## Plan defects discovered during implementation

The plan's dry-run command named `wrangler.production.jsonc` directly. For the current Astro 7 adapter output, that config names source `src/worker.ts`; Wrangler cannot resolve the adapter's virtual build modules directly. The corrected release command uses the generated, production-config-derived `dist/server/wrangler.json`. This is now documented as deployment evidence; no source behavior changed to work around it.

## Risks and uncertainties

- The deployed `GITHUB_TOKEN` scope is not inspectable. If the protected write returns `github_read_rejected` or `github_write_rejected`, stop and obtain Jeff's separate approval for a least-privilege replacement credential.
- The live write path deliberately remains unexercised because it creates a GitHub content commit.

## Requested review focus

Review the direct shared-config import, bounded provider-error handling, exact API URL assertions, and the generated-config deployment path.

## Deployment status

Deployed to production. Worker `parent-coach-desk` version `35449367-a085-4096-bb7b-6886c048cea5` is active at 100%. GET-only acceptance passed: apex 200, `www` canonical 301, security.txt 200 text/plain, and anonymous `/admin/` plus `/api/admin/editorial/approve` Access 302.

## Production data impact

No D1/R2 mutation, migration, secret change, email/Slack delivery, or GitHub content write occurred. The Worker/asset version changed only.

## Do not modify

- `buildout/hit-rate-test/out/` and `buildout/hit-rate-test/out/results.jsonl`: unrelated user artifacts.
- Cloudflare Access/DNS, D1/R2, Resend/Slack, Stripe, and GitHub credentials: outside the deployed repair.

## Human approval required

Yes. Jeff must select a designated non-customer test article and perform the one protected Editorial Approve click. That click creates a GitHub content commit. If it returns a bounded rejection, do not retry broadly or rotate credentials without a new approval.
