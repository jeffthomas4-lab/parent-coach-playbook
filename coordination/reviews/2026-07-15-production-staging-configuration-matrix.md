# Review: Production and staging configuration matrix

**Reviewer:** Codex  
**Date:** 2026-07-15  
**Reviewed plan:** `coordination/plans/005-production-staging-configuration-matrix.md`  
**Reviewed handoff:** Direct execution; no separate handoff  
**Branch:** `migration/pages-to-workers-staging`  
**Commit range:** Working tree after `495851c`

## Executive result

Approved as a documentation-only, read-only verification. The matrix separates the older production deployment from current-branch cutover requirements and exposes one confirmed live defect—the Yelp schedule has no required API key—without changing Cloudflare state.

## Plan assessment

The plan was correctly scoped. Independent comparison of repository references with live deployment metadata confirmed that a single “production versus staging” checklist would have been misleading unless it separated current production code from future cutover requirements.

## Blocking findings

None in the documentation change. The Yelp defect and missing staging Access configuration block their respective operational/remediation phases, not this read-only record.

## Important findings

- Production Pages is deployed from older commit `3e125bc51f339e47f11ca17cd7a5264a6a693ee6`; current-branch variables must be treated as cutover requirements.
- Staging shares the production D1 and R2 resources, so acceptance testing must avoid destructive or synthetic-data assumptions.
- `activityradar-yelp` has no secret names live while current code requires `YELP_API_KEY`; its 401 branch aborts the scheduled run.
- The active cron deployment and repository disagree about whether `SWEEP_URL` is a secret or plain variable.

## Non-blocking improvements

After approved remediation, add a dated follow-up review with active-version IDs and behavioral acceptance evidence rather than editing this immutable review.

## Security and privacy assessment

Passed for this phase. Only binding, variable, and secret names were handled; values were omitted. No client bundle, route behavior, database access, or remote configuration was changed. The matrix preserves fail-closed admin behavior as a staging/cutover requirement.

## Migration and data assessment

No migrations or data writes. Applied migration state was outside scope. The production D1 binding identity was verified by immutable database ID; its contents were not queried in this phase.

## Tests and validation performed

| Command | Exit code | Result |
|---|---:|---|
| Wrangler Pages project/deployment/config and secret-name inspection | 0 | Production deployment provenance and configuration names captured; values omitted |
| Wrangler Worker deployments/versions/secret-name inspection | 0 | Active bindings, handlers, schedules, and name presence captured |
| Targeted source search and line inspection | 0 | Current env requirements and Yelp 401/abort behavior verified |
| `git diff --check` | 0 | No whitespace errors |
| credential-pattern scan over `coordination/` | 0 | No credential values found; worker/branch-name matches were false positives |

## Unverified assumptions

- Cloudflare secret values are correct and usable.
- Scheduled invocation logs reflect the deterministic configuration defect; invocation history was not read.
- Missing optional integrations are still desired product scope.
- External Cloudflare Access policies are correctly configured.

## Final disposition

**Approved**
