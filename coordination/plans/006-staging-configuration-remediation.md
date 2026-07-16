# Plan: Staging configuration remediation

**Plan ID:** 006  
**Author:** Codex  
**Date:** 2026-07-15  
**Status:** Complete — cron repaired, Yelp retired, staging deployed and authenticated

## Objective

Prepare and validate the current Worker branch for staging acceptance, repair deployable configuration drift, and leave unavailable third-party credentials as explicit human-supplied gates.

## Tier

Tier 3. This changes Cloudflare Worker configuration and may deploy supporting/staging Workers, but does not authorize production Pages deployment, data mutation, or secret invention.

## Business outcome

Staging can exercise authenticated administration and the approved automation surfaces without ambiguous bindings or silent scheduled failures.

## Current-state evidence

- Confirmed live, 2026-07-15: staging shares production `activity-radar` D1 and `activityradar-photos` R2 and has no secrets.
- Verified in code, 2026-07-15: `FORGE_DB` must bind `forge-command` for agent-run logging.
- Confirmed live, 2026-07-15: Yelp was retired and its Worker deleted after verification found its required key absent.
- Confirmed live, 2026-07-15: cron's prior deployed version predated the fail-loud code and repository `SWEEP_URL` variable; version `9af6e107-1a51-402f-9748-884326ca1445` repaired that drift.
- Confirmed live, 2026-07-15: the staging Access application protects `/admin` and `/api/admin`; its team domain and application audience are now version-controlled as non-secret variables.
- Not available locally, 2026-07-15: Slack credentials and agent-run shared token.

## Scope

- Add known `FORGE_DB` staging binding to repository configuration.
- Keep outbound email in its fail-safe default stage mode.
- Validate the site and cron Worker.
- Deploy the reviewed cron repair after validation.
- Deploy staging only after Access identifiers are available.
- Retire Yelp after Jeff's explicit decision, without deleting historical D1 fields.

## Non-goals

No production Pages deploy, migration, D1/R2 write, synthetic staging data, domain attachment, outbound email, Slack message, secret generation for third-party systems, or push.

## Files likely affected

- `wrangler.jsonc`
- Coordination plan/current-state/review records.

## Step-by-step implementation

1. Add the verified `forge-command` D1 binding to staging config.
2. Validate Wrangler configuration, Astro checks/tests/build, and cron tests/dry-run.
3. Deploy the reviewed cron Worker and confirm active metadata.
4. Obtain `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`; add them as staging variables.
5. Obtain/generate only the approved staging secrets and set them interactively without logging values.
6. Deploy staging and test public/admin/API failure modes without mutating shared data.
7. Retire Yelp in a separately recorded change after Jeff's decision.

## Testing strategy

Run Astro check, tests, build, Wrangler dry-runs, cron tests, and active-version inspection. Staging HTTP verification is read-only. Admin tests cover authorized, unauthorized, and missing-claim paths once Access is configured.

## Acceptance criteria

- Known bindings are version-controlled and types/build pass.
- Cron active version contains fail-loud behavior and plain `SWEEP_URL` variable.
- Staging is not deployed without both Access identifiers.
- No outbound communication or shared-data mutation occurs in acceptance tests.
- Yelp Worker, schedule, source, and deploy configuration are absent after retirement.

## Human approval gates

Jeff authorized this phase, including required staging/cron deployment, and separately approved Yelp retirement. Production Pages deploy, migrations, shared-data writes, and outbound communication remain gated. Jeff must provide or securely enter unavailable third-party credentials.

## Open questions

- Which Slack channel/app and token should staging use?

## Dependencies

Cloudflare Access team domain and application AUD; credentials for any enabled third-party integration.

## Architecture and data flow

Staging Worker -> shared read/write bindings (treated as production) and separately bound `forge-command`; supporting cron -> production site's protected sweep endpoint and deploy hook.

## Data model or migration changes

None.

## Security and privacy requirements

Admin auth remains fail-closed. Secrets are entered through Wrangler's secure secret mechanism and never committed or printed. Acceptance requests are read-only against shared resources. Email modes remain staged.

## Failure modes

Missing Access configuration yields 503 on admin routes, so deployment stops before that point. A cron secret mismatch produces a visible failed invocation after the fail-loud deployment. Yelp has no remaining runtime path.

## Observability

Cron observability is enabled. Active version/binding metadata and HTTP status evidence are recorded after deployment. No secret values enter logs.

## Deployment plan

Supporting cron first after tests; staging second only after Access configuration. Production Pages remains untouched.

## Rollback plan

Use the prior Worker version if cron behavior regresses. Staging can roll back to its prior version; no schema/data rollback is required because this plan adds no data changes.

## 2026-07-15 execution evidence

- Added the verified `FORGE_DB` -> `forge-command` binding to staging configuration.
- Astro check completed with 0 errors; full build completed; fresh staging Wrangler dry-run included both D1 bindings.
- Deployed cron version `9af6e107-1a51-402f-9748-884326ca1445`. It has fetch and scheduled handlers, plain `SWEEP_URL`, and retained secret names `CRON_KEY`, `DEPLOY_HOOK_URL`, and `MANUAL_TRIGGER_KEY`.
- The former remote `SWEEP_URL` secret was replaced by the repository's plain variable as intended.
- Added the Access team domain and application audience as non-secret staging variables.
- Deployed staging Worker version `a95f7b5d-74a8-4b1e-a1da-4f96eb285e04` with the expected KV, D1, R2, assets, site, admin allowlist, and Access bindings.
- Anonymous acceptance checks returned 200 for `/` and a Cloudflare Access 302 for both `/admin` and `/api/admin/editorial`.
- After email-OTP authentication, `/admin/editorial/` rendered the live editorial dashboard and read its content inventory. No mutation endpoint was invoked.
- `/admin` itself reaches the application after authentication but returns the site's 404 because no `src/pages/admin/index.astro` route exists. This is an application navigation gap, not an Access failure, and is recorded for a follow-up plan.
- Yelp was subsequently retired with Jeff's approval; see the addendum below.

### Yelp retirement addendum

Jeff approved retirement on 2026-07-15. The live `activityradar-yelp` Worker and schedule were deleted, its source/config were removed, and current operational documentation was updated. Historical D1 fields were intentionally retained.
