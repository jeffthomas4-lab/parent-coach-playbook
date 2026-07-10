# Incident Runbook: parent-coach-desk (parentcoachdesk.com)

Pillar 8 of the Website Build Standard. One page. What to check first, how to roll back.

## Site is down or throwing errors

1. Check Cloudflare status: https://www.cloudflarestatus.com. If Cloudflare is down, this is not our bug, wait it out.
2. Cloudflare dashboard → Pages → parent-coach-playbook → Deployments. Confirm the latest deployment is the one you expect and shows "Success," not "Failed."
3. `npx wrangler pages deployment tail --project-name parent-coach-playbook` for live logs while you reproduce the issue.
4. Check the D1 database is reachable: `npx wrangler d1 execute activity-radar --command "SELECT 1" --remote`. A failure here points at D1, not the site code.
5. Check the `/api/cron/camps-sweep` route directly if the camps list looks empty or stale: `curl -X POST https://parentcoachdesk.com/api/cron/camps-sweep -H "x-cron-key: <CRON_KEY>"`. A count of 0 in the response means the data went empty, not the route.

## Roll back

Cloudflare Pages keeps every deployment. Rolling back does not need a new build or a git revert.

1. Cloudflare dashboard → Pages → parent-coach-playbook → Deployments.
2. Find the last known-good deployment (the one before the one that broke things).
3. Click the "..." menu on that deployment → Rollback to this deployment.
4. This takes effect immediately, no build required. Confirm at parentcoachdesk.com.
5. Once rolled back, fix the actual bug locally, build, test, commit, and redeploy per the normal Deployment norm before touching production again.

## Admin access broken (can't get into /admin/)

1. Confirm Cloudflare Access is still configured on the `/admin/*` and `/api/admin/*` routes: Cloudflare dashboard → Zero Trust → Access → Applications.
2. Confirm your email is in the `ADMIN_EMAILS` var in `wrangler.jsonc` (comma-separated) and matches what's deployed.
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
- **Recovery time (how long the site can be down):** A Pages rollback (above) takes under 2 minutes. A D1 restore from a bad migration takes longer, budget 30 minutes: run the restore, verify row counts, redeploy if the schema also needs to roll back.

## Restore test log

| Date | What was restored | Result | Who ran it |
|------|-------------------|--------|------------|
| Not yet run | — | — | — |

Pillar 8 requires an actual restore to have been run, with the date logged here and in `STANDARD-AUDIT.md`. Run `npx wrangler d1 time-travel restore activity-radar --timestamp=<iso-timestamp>` against a throwaway copy of the database (not the live shared `activity-radar` DB, since ActivityRadar is live on it too) and log the result here.
