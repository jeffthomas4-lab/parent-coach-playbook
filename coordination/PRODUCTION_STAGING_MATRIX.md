# Production and staging configuration matrix

Verified 2026-07-15 with Wrangler 4.110.0 and current repository source. Secret values were not requested or recorded.

## The important boundary

Production Pages is not running the current migration branch. Its latest deployment (`3ee0e373-04ef-4540-90ac-b8f41e8ebec5`) was built from commit `3e125bc51f339e47f11ca17cd7a5264a6a693ee6`. That commit is an ancestor of the current branch, while the current branch is not an ancestor of the deployed commit. Requirements introduced later are therefore **cutover requirements**, not proof that the old production deployment is presently broken.

Labels: **Confirmed live** means returned by a read-only Cloudflare command on 2026-07-15; **Verified in code** means referenced by current source/config; **Absent live** means not returned by the relevant inspection; **Cutover requirement** means required by current code but not applicable to the older production source; **Not verified** means intentionally not inspected.

## Production Pages: `parent-coach-playbook`

| Name | Kind | Live state | Current-branch significance |
|---|---|---|---|
| `DB` | D1 | Confirmed live; ID matches `activity-radar` | Required |
| `PHOTOS` | R2 | Confirmed live; `activityradar-photos` | Required |
| `ADMIN_EMAILS`, `SITE_URL` | Variables | Confirmed live; values omitted | Required |
| `BULK_IMPORT_TOKEN` | Secret | Confirmed live; name only | Required for bulk import |
| `CRON_KEY` | Secret | Confirmed live; name only | Required for protected sweep |
| `GITHUB_TOKEN` | Secret | Confirmed live; name only | Required for publishing |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | Auth configuration | Absent live | Cutover blockers: current admin auth returns 503 without them |
| `FORGE_DB`, `AGENT_RUNS_TOKEN` | D1 + secret | Absent live | Cutover requirements for agent-run logging |
| `SLACK_WEBHOOK_URL`, `SLACK_SIGNING_SECRET`, `SLACK_APPROVER_IDS` | Mixed | Absent live | Cutover requirements if Slack is enabled |
| `DEPLOY_HOOK_URL` | Secret | Absent live | Cutover requirement for current publishing |
| `PUBLISH_COMMITTER_EMAIL` | Variable | Absent live | Optional cutover setting |
| `EMAIL_MODE`, `EMAIL_ADMIN_MODE` | Variables | Absent live | Cutover decisions for email behavior |
| `RESEND_API_KEY`, `EMAIL_FROM` | Secret + variable | Absent live | Cutover requirements if outbound email is enabled |
| `EMAIL_REPLY_TO` | Variable | Absent live | Optional cutover setting |
| `PUBLIC_KIT_LEAD_MAGNET_FORM_ID` | Build variable | Absent from downloaded Pages config | Build requirement if the Kit form is enabled |
| `OPS_HEARTBEAT_URL` | Secret/variable | Absent live | Optional observability setting |

No production Pages KV binding was returned. The downloaded D1 entry labels the database name as `DB`, but its immutable ID matches the verified `activity-radar` database; the ID is the reliable identity evidence.

## Staging Worker: `parent-coach-desk-staging`

| Name | Live state | Assessment |
|---|---|---|
| `DB`, `PHOTOS`, `SESSION`, `ASSETS` | Confirmed live | Present; DB and R2 are shared with production resources |
| `ADMIN_EMAILS`, `SITE_URL` | Confirmed live; values omitted | Present |
| all secret names | Wrangler returned an empty list | Protected workflows are not configured |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | Absent live | Staging acceptance blocker for admin routes |
| `CRON_KEY` | Absent live | Sweep endpoint cannot be exercised as configured |
| `FORGE_DB`, `AGENT_RUNS_TOKEN` | Absent live | Agent-run logging is unavailable |
| Slack, publish, and email settings | Absent live | Corresponding workflows are unavailable until explicitly enabled |

Staging currently shares the production `activity-radar` D1 and `activityradar-photos` R2 resources, so “staging” does not imply isolated data.

## Supporting Workers

| Worker/config | Confirmed live state | Gap or drift |
|---|---|---|
| `activityradar-enrichment` | Scheduled and fetch handlers; `DB` present; secret list empty | `RUN_KEY` is optional. Scheduled execution can operate; protected manual trigger is unavailable without it. |
| `activityradar-yelp` | **Retired 2026-07-15; Worker deleted** | Source/config removed. Historical Yelp-derived D1 fields remain but are no longer refreshed. |
| `parent-coach-playbook-cron` | Secret names: `CRON_KEY`, `DEPLOY_HOOK_URL`, `MANUAL_TRIGGER_KEY`, `SWEEP_URL` | Active deployment predates the repo change making `SWEEP_URL` a plain variable; live and repository config have drifted. |
| `parent-coach-playbook-link-checker` | Worker does not exist | Config contains placeholder D1 IDs and must not be deployed. |
| `parentcoachplaybook-redirect` | Worker does not exist | Deployment intent is not verified. |

## Recommended remediation order

Each item is a separate approval gate because it changes Cloudflare state.

1. Configure staging Access authentication (`ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`) and verify authorized, unauthorized, and missing-claim behavior.
2. Decide which automation surfaces belong in staging acceptance: sweep, agent-run logging, Slack, publishing, email, and Kit.
3. Provision only approved staging configuration, redeploy staging, and run acceptance tests. Treat shared D1/R2 as production data.
4. Create the production cutover checklist from the approved staging set; never copy staging values blindly.

## Still not verified

- Secret values, correctness, age, or provider-side permissions.
- Recent scheduled-invocation history; only configuration and deterministic code behavior were checked.
- Cloudflare Access application/policy configuration outside Worker/Pages environment settings.
- Whether missing optional integrations remain intended product scope.
- Current-branch production behavior, because that branch is not deployed there.
