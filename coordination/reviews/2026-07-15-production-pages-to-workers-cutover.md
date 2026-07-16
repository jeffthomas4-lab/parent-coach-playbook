# Review: production Pages-to-Workers cutover

**Date:** 2026-07-15  
**Reviewer:** Codex  
**Plan:** 011  
**Verdict:** Approved; production cutover complete

## Independent assessment

The cutover followed the required risk order: production Access existed before routing changed; the production-only config and isolated session namespace were validated; the Worker candidate was deployed and checked before domain attachment; existing Pages secrets were transferred through interactive encrypted input; and the Pages project was preserved for rollback. The custom-domain transition retained the apex contract and existing `www` canonical redirect.

The production checks were deliberately read-only. No form was submitted, no admin action button was used, and no mutation, cron, publishing, email, or Slack endpoint was invoked.

## Evidence

| Gate | Result |
|---|---|
| Unit suite | 27 files, 232/232 passed |
| TypeScript | Application and cron checks exit 0 |
| Astro check | 0 errors, 0 warnings, 349 hints |
| Dependency audit | 0 vulnerabilities |
| Production build | Exit 0 without heap override; 62.5 seconds |
| Generated dry run | 9,233 assets; expected SESSION, DB, FORGE_DB, PHOTOS, ASSETS, vars |
| Access | Production app covers `/admin*` and `/api/admin*` |
| Worker | `92516f62-b891-4903-94e1-204a972ee2ae` active at 100% |
| Secrets | Three required names present; values not inspected |
| Public production | Apex 200; `www` 301 to apex; security.txt 200 text/plain |
| Anonymous protection | Admin page/API checks return Access 302 |
| Authenticated checks | Admin desk, editorial board, and one preview rendered read-only |
| Rollback | Pages project and deployment `3ee0e373-04ef-4540-90ac-b8f41e8ebec5` retained |

## Risk disposition

- Static admin assets are protected at the edge; runtime APIs additionally validate the matching Access AUD.
- Shared D1/R2 bindings were not mutated during acceptance.
- Secret-change versions changed encrypted bindings only and retained the uploaded code artifact.
- The production config is explicit; ordinary `npm run build` remains staging-safe and `npm run build:production` creates the production artifact.
- Rollback remains a domain reassignment to the preserved Pages project; no data restore is necessary because the cutover wrote no application data.

## Remaining gates

Nothing was pushed or merged. Those actions remain Jeff-gated. Optional integrations absent before the cutover were not enabled.
