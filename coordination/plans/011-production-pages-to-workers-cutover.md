# Plan: Production Pages-to-Workers cutover

**Plan ID:** 011  
**Author:** Codex  
**Date:** 2026-07-15  
**Status:** Approved by Jeff (explicit production deployment and cutover authorization)

## Objective

Move `parentcoachdesk.com` from the `parent-coach-playbook` Pages project to a production Worker built from this branch, while preserving the Pages project and its last deployment as an immediately available rollback target.

## Tier

Tier 3. This changes production authentication, deployment topology, bindings, secrets, DNS/custom domains, and rollback routing.

## Business outcome

The stabilized current application, protected admin desk, and security contact become the production site without writing shared D1/R2 data during deployment or acceptance.

## Current-state evidence

- **Verified in code, 2026-07-15:** `HEAD` is `b7afc2e`; the branch is clean and has no upstream push in this workflow.
- **Verified by tests/build, 2026-07-15:** the release rehearsal passed 232 tests, both TypeScript checks, Astro check, dependency audit, a default-heap full build, and a Wrangler dry run.
- **Confirmed live, 2026-07-15:** staging Worker version `6078f32b-bfde-4c43-bb94-20601702d9c0` serves the candidate with Access-protected admin routes.
- **Confirmed live, 2026-07-15:** production is Pages project `parent-coach-playbook`, deployment `3ee0e373-04ef-4540-90ac-b8f41e8ebec5`, source commit `3e125bc51f339e47f11ca17cd7a5264a6a693ee6`.
- **Confirmed live, 2026-07-15:** production apex returns 200, `www` redirects to apex, `/admin` and `/api/admin/editorial` return 404, and `security.txt` returns 404.
- **Confirmed live, 2026-07-15:** no Access application protects `parentcoachdesk.com`; existing relevant applications cover staging and legacy `parentcoachplaybook.com`/workers.dev destinations.
- **Confirmed live, 2026-07-15:** Pages has production secret names `BULK_IMPORT_TOKEN`, `CRON_KEY`, and `GITHUB_TOKEN`; their values are not retrievable and were not inspected.

## Scope

- Add an explicit production Worker configuration without weakening the staging-only configuration.
- Create production Access protection for `/admin*` and `/api/admin*` before domain cutover.
- Create and deploy `parent-coach-desk` with the verified D1/R2/Forge/Access bindings and preserved Pages secret values.
- Validate the candidate on workers.dev using public and read-only authenticated checks.
- Detach apex and `www` from Pages and attach them as Worker Custom Domains.
- Verify public, redirect, security.txt, anonymous Access, and authenticated read-only admin behavior.
- Update coordination evidence and commit locally. Do not push.

## Non-goals

- No D1/R2 writes, migrations, cron invocation, publish approval, email, Slack action, bot/DMARC change, secret rotation, Pages project deletion, production data mutation, or Git push.
- Do not enable currently absent optional integrations merely to complete the routing migration.

## Files likely affected

- `wrangler.production.jsonc` (new)
- `coordination/CURRENT_STATE.md`
- `coordination/HANDOFF.md`
- `coordination/plans/011-production-pages-to-workers-cutover.md`
- `coordination/reviews/2026-07-15-production-pages-to-workers-cutover.md`
- `coordination/handoffs/2026-07-15-plan-011-production-cutover.md`

## Step-by-step implementation

1. Reconfirm clean Git state, Pages deployment/domain inventory, Worker absence, Access inventory, and production HTTP baseline.
2. Add `wrangler.production.jsonc` for Worker `parent-coach-desk`, preserving the verified immutable D1 IDs, R2 bucket, Forge binding, Access team domain/AUD, public variables, and a SESSION namespace. Keep root `wrangler.jsonc` staging-only.
3. Run Astro check, tests, both TypeScript checks, default-heap build, and production-config Wrangler dry run. Revert generated-only manifest timestamp churn.
4. Create a production Access self-hosted application with two destinations: `parentcoachdesk.com/admin*` and `parentcoachdesk.com/api/admin*`; attach the existing approved owner email allow policy. Verify anonymous requests are intercepted before cutover.
5. Provision the production Worker and transfer the three existing Pages secrets by name and value through a secure interactive Cloudflare/Wrangler path. Never print, log, commit, or place values in chat. Confirm names only.
6. Deploy the exact built candidate to `parent-coach-desk`; record version ID and verify 100% active deployment, startup, handlers, bindings, and secret names.
7. Validate the workers.dev candidate: public home and security.txt; anonymous Access on admin paths if destinations include workers.dev, otherwise runtime 503/401 behavior as expected; authenticated checks only when protected. All D1/R2-backed checks are GET/read-only.
8. Record the exact Pages rollback deployment URL. Remove apex and `www` from Pages custom domains without deleting the Pages project.
9. Attach `parentcoachdesk.com` and `www.parentcoachdesk.com` to the production Worker as Custom Domains. Preserve apex canonical behavior and verify certificates/routes become active.
10. Run production acceptance: apex 200, `www` canonical redirect, security.txt 200 text/plain, anonymous admin/API 302 Access, authenticated `/admin/`, editorial, and one preview render read-only. Confirm no outbound or mutation endpoint was invoked.
11. If any critical criterion fails, execute rollback immediately. Otherwise update current state, review evidence, immutable handoff, and active handoff; commit locally and verify a clean worktree.

## Testing strategy

- Repeat the release suite against the exact cutover commit: `npm test`, both `tsc` commands, `npm run check`, `npm run build`, and `wrangler deploy --dry-run --config wrangler.production.jsonc`.
- Use HTTP GET/HEAD and browser-render checks only after deployment. Never submit admin forms or call write endpoints.
- Inspect Cloudflare deployments/bindings/secrets by name after deployment.

## Acceptance criteria

- All local release checks exit 0 on the exact deployed commit; default Node heap succeeds.
- Production Worker exists with expected bindings and exactly the intended preserved secret names; no value appears in evidence.
- Apex and `www` resolve through the Worker; Pages project/deployment still exists for rollback.
- Apex `/` and `security.txt` return 200; `www` retains canonical redirect behavior.
- Anonymous `/admin` and `/api/admin/editorial` return Cloudflare Access redirects.
- Authenticated `/admin/`, `/admin/editorial/`, and one preview render successfully using GET only.
- No D1/R2 mutation, outbound workflow, production migration, push, or Pages deletion occurs.
- Coordination evidence is committed and worktree is clean.

## Human approval gates

- Jeff explicitly approved the Tier 3 production deployment and cutover in this task.
- Secret values must be entered through a secure interactive path; if Codex cannot access such a path without exposing values, Jeff must perform the three secret-set commands before deployment continues.
- Any scope expansion (new integration, secret rotation, data mutation, or disabling Access) requires fresh approval.

## Open questions

- The existing Pages secret values cannot be retrieved through Cloudflare. Secure transfer availability is the only known execution dependency.
- Whether a dedicated production SESSION KV namespace is required will be resolved during config validation; create one only if the adapter requires it.

## Dependencies

- Cloudflare dashboard/Wrangler authenticated to account `d42a1d557371024c855bc44a2c4aa28c`.
- Existing Pages project and production secret holders.
- Existing production D1/R2 resources remain unchanged.

## Architecture and data flow

Cloudflare Access evaluates protected host/path requests before the Worker. Public requests reach the Worker, which serves prerendered assets through `ASSETS` and on-demand Astro routes through the server entrypoint. Existing D1/R2/Forge resources remain bindings; the migration changes the compute/routing front door, not stored data.

## Data model or migration changes

None. No migration command may run.

## Security and privacy requirements

- Access must protect both static admin assets and runtime admin APIs before custom domains move.
- Preserve least-privilege owner allow policy and the application AUD used by runtime JWT validation.
- Secret values are handled only through Cloudflare/Wrangler encrypted input and excluded from logs/evidence.
- Acceptance is GET/read-only because staging and production share data resources.

## Failure modes

- Missing/incorrect secret: protected workflow fails; do not invoke it during acceptance, and rollback if production parity is not established.
- Access gap: static admin content becomes public; stop before domain attachment or rollback immediately.
- Custom-domain certificate/DNS delay: site may be unavailable; restore Pages domains if not healthy within the cutover window.
- Worker runtime/binding failure: public or admin requests return 5xx; rollback domains to Pages.
- `www` behavior drift: attach both domains and restore the canonical redirect contract before declaring success.

## Edge cases

- Pages custom domains can conflict with Worker Custom Domains; detach from Pages before Worker attachment.
- Access path wildcards must cover `/admin`, `/admin/`, nested previews, `/api/admin`, and nested API routes.
- Custom Domain creation can be blocked by an existing CNAME; use the documented detach/delete-record order while preserving Pages.

## Observability

Record Worker version, deployment percentage/startup, binding and secret names, HTTP status/location/content-type, Access redirect presence, and authenticated page headings. Do not record tokens, cookies, email OTPs, or secret values.

## Deployment plan

Codex performs the approved production changes in order: Access, candidate Worker, candidate checks, Pages detach, Worker Custom Domains, production checks. Domain attachment is forbidden until Access and the candidate deployment pass.

## Rollback plan

Keep Pages project `parent-coach-playbook` and deployment `3ee0e373-04ef-4540-90ac-b8f41e8ebec5`. On failure: detach Worker Custom Domains, restore `parentcoachdesk.com` and `www.parentcoachdesk.com` to Pages (including required proxied DNS records), verify apex 200 and `www` redirect, and leave the failed Worker available for diagnosis. If a later Worker version alone is faulty after stable routing, use Workers version rollback to the last known-good production Worker version. No data restore is required because the cutover performs no data writes.
