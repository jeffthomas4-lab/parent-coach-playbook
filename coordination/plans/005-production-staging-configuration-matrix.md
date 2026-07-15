# Plan: Production and staging configuration matrix

**Plan ID:** 005  
**Author:** Codex  
**Date:** 2026-07-15  
**Status:** Approved and complete

## Objective

Establish an evidence-based matrix of the Cloudflare configuration currently attached to production Pages and deployed Workers, compare it with the current branch's requirements, and identify the configuration work required before staging acceptance or production cutover.

## Tier

Tier 3. The work inspects live Cloudflare metadata and security-sensitive binding/secret names, but makes no remote or application changes.

## Business outcome

Jeff can approve configuration remediation from a concrete list without treating the old production Pages deployment and the current migration branch as if they require the same environment.

## Current-state evidence

- Confirmed live, 2026-07-15: `parentcoachdesk.com` and `www.parentcoachdesk.com` are attached to Pages project `parent-coach-playbook`.
- Confirmed live, 2026-07-15: its latest production deployment is sourced from commit `3e125bc51f339e47f11ca17cd7a5264a6a693ee6`, which predates the current migration work.
- Confirmed live, 2026-07-15: production Pages and the staging, enrichment, Yelp, and cron Workers expose the binding and secret names recorded in `coordination/PRODUCTION_STAGING_MATRIX.md`; no secret values were read.
- Verified in code, 2026-07-15: current application and Worker environment references were inventoried from source and Wrangler configuration.

## Scope

Production Pages, staging Worker, enrichment Worker, Yelp Worker, cron Worker, and repository-only link-checker/redirect configs; binding, variable, and secret names only; documentation and review commit only.

## Non-goals

No secret values or changes, binding changes, deploys, migrations, remote writes, schedule/domain changes, push, or production HTTP mutation. No remediation until Jeff approves a separate batch.

## Files affected

- `coordination/PRODUCTION_STAGING_MATRIX.md`
- `coordination/CURRENT_STATE.md`
- This plan and its review record.

## Step-by-step implementation

1. Identify the production Pages deployment source commit and compare it with the current branch.
2. Download production Pages configuration into an isolated temporary directory and list secret names separately.
3. Inspect active versions, bindings, schedules, and secret names for each relevant deployed Worker.
4. Inventory environment references in current source and Wrangler configs.
5. Separate present-production requirements from future-cutover requirements.
6. Record defects, drift, and remediation gates without changing remote state.
7. Scan the documentation diff and commit explicit files.

## Testing strategy

Use read-only Cloudflare commands. Validate claims against code and command output, scan tracked documentation for credential-like values, and inspect the final diff. No application tests are required because executable code is unchanged.

## Acceptance criteria

- Production and staging are separate and every entry is evidence-labeled.
- Secret values are neither requested nor recorded.
- The old production deployment is not described as the current branch.
- Remediation items identify their approval gate.
- No remote state changes occur.

## Human approval gates

Jeff approved read-only verification. Every secret, variable, binding, schedule, deployment, migration, production write, or push remains separately gated.

## Open questions

- Whether Yelp enrichment remains intended to run daily.
- Which current-branch automation capabilities should be enabled in staging before cutover.

## Dependencies

Authenticated read-only Wrangler access and the current local repository.

## Architecture and data flow

Cloudflare metadata and deployment configuration -> local code comparison -> tracked matrix. No data flows back to Cloudflare.

## Data model or migration changes

None.

## Security and privacy requirements

Secret names only; no values. Admin authentication remains fail-closed. Database, storage, and provider credentials remain server-side bindings or secrets.

## Failure modes and edge cases

Pages and Workers have different configuration surfaces; a name can exist on one deployment but not another, and repository config can differ from an active version. Each claim therefore carries an evidence status and date. Public build variables must be present at build time rather than only runtime.

## Observability

The matrix records deployment provenance and name presence. Remediation must verify the new active deployment metadata and behavior.

## Deployment plan

None.

## Rollback plan

Documentation can be reverted by commit. Remote state is unchanged.
