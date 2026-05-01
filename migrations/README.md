# Migrations

Cloudflare D1 schema migrations for the camps repository.

Each file is a forward-only SQL migration. Filenames are sequence-prefixed (`0001_`, `0002_`, etc.) so Wrangler applies them in order.

## First-time setup (production)

Run once on the Windows dev machine.

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

## Querying production directly

```powershell
# Show pending camps.
npx wrangler d1 execute parent-coach-playbook --remote --command "SELECT id, name, city, state, submitted_at FROM camps WHERE status='pending' ORDER BY submitted_at DESC;"

# Approve a camp manually (if the admin UI is unavailable).
npx wrangler d1 execute parent-coach-playbook --remote --command "UPDATE camps SET status='approved', reviewed_at=datetime('now') WHERE id='CAMP_ID_HERE';"

# Show submitter trust levels.
npx wrangler d1 execute parent-coach-playbook --remote --command "SELECT email, trust_level, submission_count, approved_count FROM submitters;"
```
