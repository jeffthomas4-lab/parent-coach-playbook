# Environment manifest — parent-coach-desk

Website Build Standard Pillar 13, row 2 (Strict Environment Isolation). Names
only, no secret values, no database contents. Written 2026-07-30 against live
source (`wrangler.jsonc`, `wrangler.production.jsonc`,
`wrangler.pcd-ops.local.jsonc`) and a read-only Cloudflare D1 API check
against every database id named below. Update this file whenever an
environment gains, loses, or renames a bound resource — the point is that a
reader can tell "does staging touch production data" from this file alone,
without opening the Cloudflare dashboard.

Supersedes `coordination/PRODUCTION_STAGING_MATRIX.md` (2026-07-15), which
described the pre-cutover state (production still Cloudflare Pages, staging
sharing the production `activity-radar` D1 and `activityradar-photos` R2).
That file is left in place as a historical incident record — the "shared
D1/R2" finding it documents is exactly why this manifest exists now — but it
is no longer the current state and should not be read as one.

## Production

| Property | Value |
|---|---|
| Worker name | `parent-coach-desk` |
| Config file | `wrangler.production.jsonc` |
| Live domain | `parentcoachdesk.com` |
| Owner | Jeff Thomas |
| Deploy path | GitHub Actions (`.github/workflows/deploy-workers.yml`) on merge to `main`, gated by the protected `production` GitHub Environment. No local deploy command — see `DEPLOYMENT-RUNBOOK.md`. |
| D1 (`DB`) | `activity-radar`, id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`. Shared on purpose with two other production Workers (`activityradar-enrichment`, `worker-link-checker`) and the weekly `pcd-backup-worker` — all production, all intentional. **Live-verified 2026-07-30** via the Cloudflare D1 API: this id exists and is distinct from every non-production id below. |
| D1 (`FORGE_DB`) | `forge-command`, id `747cf988-a557-48bd-9d03-bea09e184f94`. |
| D1 (`PCD_OPS_DB`) | `parent-coach-desk-ops-production`, id `b38d5f37-54df-4e0f-9706-023edc12c7fe`. **Live-verified 2026-07-30**: 76 tables present, migrations `0011`-`0027` applied (17 files; `d1_migrations` table read directly). `0028_org_contacts.sql` confirmed **not** applied — `org_contacts` does not appear in the live table list, matching its own migration header ("additive and intentionally unapplied") and `migrations-pcd-ops/README.md`. No PII from that table is live in production today. |
| R2 (`PHOTOS`) | `activityradar-photos`. |
| KV (`SESSION`) | id `1e0eb975e7784b799ecedc05ab754096`. |
| Rate limiters | `PUBLIC_SUBMISSION_RATE_LIMITER`, `TRUST_RATE_LIMITER`, `COMMUNITY_RATE_LIMITER`, `DEMAND_RATE_LIMITER`, `OWNER_RATE_LIMITER` — namespace ids `9102xx`, distinct from staging's `9101xx`. |
| Access | `ACCESS_TEAM_DOMAIN=fieldforge.cloudflareaccess.com`, distinct `ACCESS_AUD` per environment (staging and production audiences differ; verified by direct string comparison of the two wrangler configs). |
| Secrets (names only) | `AGENT_RUNS_TOKEN`, `BULK_IMPORT_TOKEN`, `CRON_KEY`, `GITHUB_TOKEN` — declared as `secrets.required` in `wrangler.production.jsonc`, so `wrangler deploy` refuses to ship without them bound. Values live only in Cloudflare, never in this repo. |
| Verification state | **Read-back verified 2026-07-30** against live Cloudflare D1 (table list, migration list, and database-id cross-reference). This is the standard's "exact target read-back," not source-only proof. |

## Staging

| Property | Value |
|---|---|
| Worker name | `parent-coach-desk-staging` |
| Config file | `wrangler.jsonc` (header marks it staging-only, "do not attach a custom domain") |
| Live domain | `parent-coach-desk-staging.eepskalla.workers.dev` (no custom domain) |
| Owner | Jeff Thomas |
| Deploy path | `npx wrangler deploy --config wrangler.jsonc` (manual, from this repo). Automated pre-deploy check: `npm run check:staging-manifest` (`scripts/check-staging-deployment-manifest.mjs`), which fails closed if the built manifest names any production resource. |
| D1 (`DB`) | `parent-coach-desk-directory-staging`, id `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`. **Isolated** — a synthetic-fixture-only database, never a copy of production. **Live-verified 2026-07-30**: id is distinct from `activity-radar`. |
| D1 (`PCD_OPS_DB`) | `parent-coach-desk-ops-staging`, id `7f0da00d-bc98-464f-8702-ce0fb381dd5e`. Distinct from the production ops database. |
| R2 (`PHOTOS`) | `parent-coach-desk-staging-photos`. Dedicated empty bucket, distinct from `activityradar-photos`. |
| KV (`SESSION`) | id `59cbf275ba16459c8f76ff39b033f748`. Distinct from production's SESSION KV. |
| Rate limiters | Same five names as production, namespace ids `9101xx` (distinct from production's `9102xx`). |
| Feature flags | All `*_ENABLED` vars default `false` in staging, same as production — staging does not silently turn on a feature production has gated off. |
| Automated isolation gate | `scripts/deploy-staging-verified.mjs`'s `validateStagingDeploymentManifest()` explicitly **forbids** the D1 database names `activity-radar`, `forge-command`, and `parent-coach-desk-ops-production` from appearing anywhere in the built staging manifest, and requires the isolated staging names instead. This is the standard's "automated validation fails closed when a lower ring points at a production data-bearing resource" requirement, already implemented — confirmed by reading the script's source, not by inference. |
| Verification state | **Read-back verified 2026-07-30**: staging D1/PCD_OPS_DB ids cross-checked against the live Cloudflare D1 database list and confirmed distinct from every production id above. |

## Local

| Property | Value |
|---|---|
| Config file | `wrangler.pcd-ops.local.jsonc` |
| Name | `pcd-ops-local-proof-do-not-deploy` (header states it is not a deploy target) |
| D1 (`PCD_OPS_DB`) | `pcd-ops-local-proof`, with a placeholder `database_id` (`00000000-...`) that only resolves under `wrangler dev --local`'s own sqlite file, never a real Cloudflare D1. |
| Verification state | Source-verified only (placeholder id makes a live read-back meaningless — there is no live remote resource to check). |

## Related, non-PCD production databases seen during this audit's live check

Recorded here only because they surfaced in the same read-only account-level
database list and are worth knowing are NOT bound anywhere in this repo's
wrangler configs: `parent-coach-playbook` (id `8336fa9f-...`, the original
retired Pages project's own D1 — distinct from `activity-radar`, orphaned,
not referenced by any current config in this repo), and several
`parent-coach-desk-ops-*-staging`/`-recovery-staging` ids from prior recovery
rehearsals (`5cbb8b09-...`, `02b737ee-...`) that are not bound in any current
wrangler config either. Neither is a live isolation risk today because
nothing currently deployed points at them, but a future session should not
assume an unfamiliar `parent-coach-desk-ops-*` id is safe to bind without
checking this manifest first.

## What "verified" means here

- **Source-verified**: read directly from the wrangler config file in this repo.
- **Live-verified / read-back verified**: confirmed against a live, read-only Cloudflare D1 API call during this audit session (`SELECT name FROM sqlite_master`, `SELECT * FROM d1_migrations`, and the account's database list cross-referenced by id). No write, no DDL, no migration was run as part of this verification.

## Owner and review cadence

Owner: Jeff Thomas. Review this file whenever a wrangler config's bindings
change, or at minimum alongside every `/web:protect` or `/web:stack` pass.
Last full read-back verification: 2026-07-30.
