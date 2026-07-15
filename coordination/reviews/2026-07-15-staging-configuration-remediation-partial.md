# Review: Staging configuration remediation — partial execution

**Reviewer:** Codex  
**Date:** 2026-07-15  
**Reviewed plan:** `coordination/plans/006-staging-configuration-remediation.md`  
**Reviewed handoff:** Direct execution  
**Branch:** `migration/pages-to-workers-staging`  
**Commit range:** Working tree after `50eacc4`

## Executive result

Approved for the completed subset. The cron drift is repaired live and staging has the known `FORGE_DB` binding in source, but staging deployment and Yelp remediation are correctly withheld until their real external values or disposition are supplied.

## Plan assessment

The plan correctly treated missing Access identifiers as a deployment blocker. A fresh build was essential: the first dry-run consumed stale `dist` output and omitted the new binding; rebuilding regenerated redirected Wrangler configuration with `FORGE_DB` present.

## Blocking findings

- Staging deploy: `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are unavailable. Current code intentionally returns 503 for admin authentication without both.
- Yelp repair: no valid `YELP_API_KEY` is available and retirement has not been selected.

## Important findings

None beyond the recorded external blockers.

## Non-blocking improvements

Add a deterministic build check that compares repository binding names with `dist/server/wrangler.json` after every build, preventing stale redirected configuration from misleading a deploy dry-run.

## Security and privacy assessment

Passed. No secret values were printed or committed. Cron retained its three required secret names; public `SWEEP_URL` replaced its obsolete secret form. Production Pages and shared D1/R2 data were untouched. Email remains fail-safe staged by default.

## Migration and data assessment

No migration or data write occurred. `FORGE_DB` is configuration only and staging was not deployed.

## Tests and validation performed

| Command | Exit code | Result |
|---|---:|---|
| `npm.cmd run check` with telemetry disabled | 0 | 215 files; 0 errors |
| `npm.cmd run build` with normal Wrangler cache access | 0 | 9,229 assets; full prerender/build complete |
| root `wrangler deploy --dry-run` after fresh build | 0 | `DB` and `FORGE_DB` both present |
| cron `wrangler deploy --dry-run` | 0 | Bundle and `SWEEP_URL` variable valid |
| cron deploy | 0 | Version `9af6e107-1a51-402f-9748-884326ca1445` active |
| cron secret list/version view | 0 | Three expected secrets retained; `SWEEP_URL` is a variable |

The attempted cron `npm test` was not a code failure: that package defines no test script.

## Unverified assumptions

- The next scheduled cron invocation will authenticate successfully; triggering it now would cause production-side sweep/build actions and was not used as a verification probe.
- The existing cron secret values are correct; only names were verified.
- Yelp remains desired product behavior.

## Final disposition

**Approved** for the completed subset; Plan 006 remains in progress.
