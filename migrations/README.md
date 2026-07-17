# Migrations

Cloudflare D1 schema migrations for the camps repository.

Each file is a forward-only SQL migration. Filenames are sequence-prefixed (`0001_`, `0002_`, etc.) so Wrangler applies them in order.

## Canonical fresh-database bootstrap

Migration `0001_init_camps.sql` is the canonical starting schema for a database that has never run PCD migrations. On 2026-07-16, an isolated rehearsal proved the prior chain failed at `0006` because legacy production columns had been added outside Wrangler's migration ledger. `0001` now includes those legacy columns so later index-only migrations can run on a genuinely empty database.

This repair has deliberately narrow semantics:

- it affects only a database where `0001` is not already recorded as applied;
- it does not repair, alter, or reconcile an existing database;
- it does not authorize any local schema to be promoted remotely;
- an existing target still requires a redacted schema comparison, current backup, representative restore rehearsal, exact migration list, and explicit production approval.

Never delete or rewrite an existing remote migration ledger to force this bootstrap path.

## Production safety boundary

Production and staging bindings contain production data. Listing, generating, or applying a remote migration is an external production action and requires an exact reviewed target plus explicit approval immediately before execution. Repository instructions are not approval. Never paste generated mutation SQL into production as a shortcut.

## First-time setup (production)

The following commands are examples only. Do not run them without the production approval described above.

```powershell
# Authenticate wrangler if you haven't.
npx wrangler login

# Create the production database.
npx wrangler d1 create parent-coach-playbook
```

Wrangler prints a `database_id`. Paste it into `wrangler.jsonc` in place of `REPLACE_WITH_D1_DATABASE_ID`.

```powershell
# Apply all migrations to production.
npx wrangler d1 migrations apply parent-coach-playbook --remote

# Sanity check: list tables.
npx wrangler d1 execute parent-coach-playbook --remote --command "SELECT name FROM sqlite_master WHERE type='table';"
```

You should see `submitters` and `camps` listed.

## Local development

Cloudflare's platform proxy (enabled in `astro.config.mjs`) gives `astro dev` access to a local D1 instance that uses the same migrations.

```powershell
# Apply all migrations to the local database.
npx wrangler d1 migrations apply parent-coach-playbook --local

# Verify locally.
npx wrangler d1 execute parent-coach-playbook --local --command "SELECT name FROM sqlite_master WHERE type='table';"
```

The local database lives under `.wrangler/state/v3/d1/` and is not committed.

## Adding a new migration

1. Create `migrations/000N_short_name.sql` with the next sequence number.
2. Forward-only. Do not edit a migration that has shipped to production.
3. Apply locally first: `npx wrangler d1 migrations apply parent-coach-playbook --local`.
4. Test against `astro dev`.
5. Apply to production: `npx wrangler d1 migrations apply parent-coach-playbook --remote`.

## Rolling back

D1 migrations are forward-only. To revert, write a new migration that undoes the change.

For schema-experiments before they ship, use `--local` and the local DB can be reset:

```powershell
Remove-Item -Recurse -Force .wrangler\state\v3\d1
npx wrangler d1 migrations apply parent-coach-playbook --local
```

## Read-only production inspection

```powershell
# Show pending camps.
npx wrangler d1 execute parent-coach-playbook --remote --command "SELECT id, name, city, state, submitted_at FROM camps WHERE status='pending' ORDER BY submitted_at DESC;"

# Show submitter trust levels.
npx wrangler d1 execute parent-coach-playbook --remote --command "SELECT email, trust_level, submission_count, approved_count FROM submitters;"
```

Do not use direct ad hoc production updates as an administrative fallback. Prepare a bounded before/after change packet, preserve rollback values, use the reviewed application or migration path, and obtain separate production-data approval.

## Demand telemetry boundary

`0013_demand_events_v1.sql` is intentionally unapplied and collection remains default-off. It must not be applied or enabled until the demand fields, retention period, public disclosure, cohort/geography policy, legacy `search_events` disposition, bounded deletion job, exact database target, restore evidence, and production approvals are recorded. The ingestion route also requires an explicit retention-days variable; the feature flag alone is insufficient.

## Trust-intake idempotency boundary

`0014_trust_intake_idempotency.sql` is additive and intentionally unapplied. It binds a caller retry key to a normalized request fingerprint so an uncertain browser retry returns the original case reference without creating a second case, lifecycle event, or notification. Apply it only together with the matching application release and the normal migration approval/evidence gates.

## Directory public-write idempotency boundary

`0015_public_write_idempotency.sql` is additive and intentionally unapplied. It belongs only to the directory database bound as `DB`, not `PCD_OPS_DB`. The table stores hashed operation keys, normalized payload hashes and bounded stable result metadata so a mobile/browser retry can return the original resource without duplicating the domain write. Full camp submissions, organization suggestions, claims and reviews now require the same primitive locally; browser forms and both repository import tools send keys, with imports deriving stable content-based keys. Real-D1 concurrency, restore, rendered-mobile and release evidence remain open. Do not apply this migration remotely until those gates are complete and separately approved.
