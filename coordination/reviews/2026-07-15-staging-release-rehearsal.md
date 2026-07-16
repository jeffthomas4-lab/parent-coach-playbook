# Review: staging release rehearsal

**Date:** 2026-07-15
**Reviewer:** Codex
**Plans:** 009 and 010
**Verdict:** Approved for production approval gate

## Independent assessment

The rehearsal correctly stopped on the first failed unit gate rather than deploying a superficially buildable release. The two failures exposed a real date-boundary defect: an already-published file could have its review date refreshed and be committed again on a later UTC day. Plan 010 fixed the invariant at the source rather than weakening time-sensitive fixtures.

The corrected commit passed every local gate, a fresh default-heap build, and a Wrangler dry run before deployment. The deployed version is active at 100%, retains the required binding inventory, and passed both anonymous and authenticated read-only checks. No staging acceptance action exercised a mutating admin endpoint or shared data.

## Evidence

| Gate | Result |
|---|---|
| Dependency audit | 0 vulnerabilities |
| Focused publish tests | 32/32 passed |
| Full unit suite | 27 files, 232/232 passed |
| Application and cron TypeScript checks | Exit 0 |
| Astro check | 0 errors, 0 warnings, 349 hints |
| Full default-heap build | Exit 0; 58.6 seconds |
| Generated output | 4,060 HTML; 1,816 admin previews; 9,233 deployed assets |
| Wrangler dry run | Expected bindings present |
| Active staging version | `6078f32b-bfde-4c43-bb94-20601702d9c0` at 100% |
| Anonymous checks | Public routes 200; protected routes Access 302 |
| Authenticated checks | Admin desk, editorial board, and article preview rendered read-only |

## Risk disposition

- The publish-path source change is covered at both library and API levels, including proof that no second outbound request occurs.
- Staging shares production D1/R2, but all live checks were GET/navigation only; no form, action, cron, or mutation endpoint was invoked.
- The Node prerender environment affects build time only. The deployed Worker still runs on workerd and its fetch handler/bindings were confirmed live.
- Production remains on the older Pages deployment. Staging proof does not itself authorize or execute custom-domain cutover.

## Approval boundary

The release candidate is approved to be presented to Jeff for explicit production cutover authorization. This review does not authorize production deployment, Pages/domain detachment, DNS changes, or production data/configuration mutation.
