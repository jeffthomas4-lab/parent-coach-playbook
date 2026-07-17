# Incident Runbook: parent-coach-desk (parentcoachdesk.com)

Pillar 8 of the Website Build Standard. One page. What to check first, how to roll back.

Production runs on the Cloudflare Worker **`parent-coach-desk`**, configured by `wrangler.production.jsonc` (not Cloudflare Pages — the project migrated off Pages; see `coordination/CURRENT_STATE.md` for the migration history). Every wrangler command below must include `--config wrangler.production.jsonc` so it targets the production Worker and not the staging one (`parent-coach-desk-staging`).

## Site is down or throwing errors

1. Check Cloudflare status: https://www.cloudflarestatus.com. If Cloudflare is down, this is not our bug, wait it out.
2. Cloudflare dashboard → Workers & Pages → `parent-coach-desk` → Deployments. Confirm the active version is the one you expect and shows healthy, not a failed or partial rollout.
3. `npx wrangler tail --config wrangler.production.jsonc` for live logs while you reproduce the issue.
4. Check the D1 database is reachable: `npx wrangler d1 execute activity-radar --command "SELECT 1" --remote`. A failure here points at D1, not the site code.
5. Check the `/api/cron/camps-sweep` route directly if the camps list looks empty or stale: `curl -X POST https://parentcoachdesk.com/api/cron/camps-sweep -H "x-cron-key: <CRON_KEY>"`. A count of 0 in the response means the data went empty, not the route.

## Roll back

Cloudflare Workers keeps a version history for `parent-coach-desk`. Rolling back does not need a new build or a git revert.

1. List recent versions and find the last known-good one: `npx wrangler deployments list --config wrangler.production.jsonc` (or `npx wrangler versions list --config wrangler.production.jsonc` on current wrangler — check `npx wrangler --version` and use whichever subcommand your installed wrangler exposes).
2. Do not paste a version ID into this runbook from memory. Confirm the target from `coordination/CURRENT_STATE.md` (search for the most recent "Confirmed live" entry naming `parent-coach-desk`) and from the dated rollback-target receipts under `coordination/release-evidence/` (e.g. files named `worker-rollback-target-*.json` or `production-deployment-scope-incident-*.json`). Those receipts record the exact fully-bound version that was proven safe at the time they were written — check the file's `observed_at`/`expires_at` fields before trusting it, a stale receipt is not a safe rollback target.
3. Roll back with `npx wrangler rollback <version-id> --config wrangler.production.jsonc` (or the dashboard: Workers & Pages → `parent-coach-desk` → Deployments → find the last known-good version → roll back to it).
4. This takes effect immediately, no build required. Confirm at parentcoachdesk.com and at `www.parentcoachdesk.com` (both are Worker Custom Domains on `parent-coach-desk`).
5. A Worker rollback only reverts code and bindings. It does **not** revert D1, R2, KV, or other stored state — see "Camps data looks wrong or empty" below and the Recovery point/time section for storage-level recovery.
6. Once rolled back, fix the actual bug locally, build, test, commit, and redeploy per the normal Deployment norm before touching production again.

## Admin access broken (can't get into /admin/)

1. Confirm Cloudflare Access is still configured on the `/admin/*` and `/api/admin/*` routes: Cloudflare dashboard → Zero Trust → Access → Applications.
2. Confirm your email is in the `ADMIN_EMAILS` var in `wrangler.production.jsonc` (comma-separated) and matches what's deployed.
3. If Access itself is misconfigured and locking everyone out, it can be removed or edited from the Zero Trust dashboard directly — that dashboard is not behind the Access policy it manages.

## Camps data looks wrong or empty

1. Run the cron sweep manually (see step 5 above) and read the `approved_future_count` in the response. If it is 0, something (a migration, a bulk import, an admin bulk-reject) moved every future camp out of `approved` status.
2. `npx wrangler d1 execute activity-radar --command "SELECT status, COUNT(*) FROM programs GROUP BY status" --remote` to see the actual distribution.
3. Remember: `activity-radar` is shared with ActivityRadar. A migration or bulk write from that repo shows up here immediately. Check ActivityRadar's recent deploys/migrations too.
4. Never run a destructive statement (`DROP`, `DELETE` without a `WHERE`, or a schema migration) against `--remote` directly. Write the SQL, run it past yourself once more, then execute.

## Newsletter / Kit signups stop showing up

1. Kit's status page: https://status.kit.com.
2. Confirm `PUBLIC_KIT_FORM_ID` still matches the live form in the Kit dashboard (form IDs can change if a form gets recreated instead of edited).
3. Check the browser console on `/newsletter/` for a failed fetch to Kit's API — this is a client-side integration, not a Worker route, so Cloudflare logs will not show it.

## Recovery point / recovery time (written down, not left to platform defaults)

- **Recovery point (how much data can be lost):** D1's point-in-time restore covers the last 30 days at roughly minute granularity (Cloudflare default). Accepted: up to a few minutes of the most recent writes on a worst-case restore.
- **Recovery time (how long the site can be down):** A Worker rollback (above) takes under 2 minutes and reverts code/bindings only. A D1 restore from a bad migration takes longer, budget 30 minutes: run the restore, verify row counts, redeploy if the schema also needs to roll back.

## Restore test log

| Date | What was restored | Result | Who ran it |
|------|-------------------|--------|------------|
| Not yet run | — | — | — |

Pillar 8 requires an actual restore to have been run, with the date logged here and in `STANDARD-AUDIT.md`. Run `npx wrangler d1 time-travel restore activity-radar --timestamp=<iso-timestamp>` against a throwaway copy of the database (not the live shared `activity-radar` DB, since ActivityRadar is live on it too) and log the result here.
