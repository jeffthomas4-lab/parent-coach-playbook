# Current State

## 2026-07-18 - seasonal zero-write maintenance enforcement

- **Implemented locally:** both the authoritative camp-sweep scheduler and the protected site mutation endpoint now hold before any D1 write or outbound sweep request from August 1 through November 30 UTC. An operator `PCD_MAINTENANCE_MODE` switch can impose the same hold year-round; setting it false cannot override the calendar boundary.
- **Observable behavior:** scheduler readiness reports maintenance state, held scheduled runs emit a structured zero-write event, and direct/manual endpoint calls return `{ held: true, code: "maintenance_mode", writes: 0 }`. Liveness and readiness remain available.
- **Verified locally:** 29 focused scheduler, endpoint, maintenance, and failure-isolation tests pass; the cron Worker TypeScript project compiles; Astro diagnostics report zero errors. Deployment of the reviewed cron revision and production configuration remains a protected external action.

## 2026-07-18 - newsletter provider activation proof contract

- **Implemented locally:** a redacted evidence contract and release check now require consent notice, confirmation, welcome delivery, redirect, unsubscribe, suppression, failure handling, provider receipt reference, and Jeff approval before newsletter activation may be called verified.
- **Privacy boundary:** the evidence record must contain neither subscriber data nor secret material. The current receipt is valid but intentionally `pending`; the hosted Kit form is not represented as end-to-end proven.
- **Verified locally:** the proof structure check and four focused newsletter tests pass. A controlled provider test remains an external approval gate in the launch authorization matrix.

## 2026-07-18 - evidence-backed camp discovery and verification

- **Implemented locally:** the public directory can now combine verified-only and open-only filters with its existing age, date, state, ZIP, and radius controls. Verification status is included in the minimized client-side directory projection, and the detail page displays `last_verified_at` rather than conflating verification with editorial review.
- **Trust control:** setting `verified = 1` now requires an approved record, a source domain, and an HTTPS registration or organization source. The verification flag and `last_verified_at` timestamp are written together. Missing records are rejected before mutation, and evidence-policy failures return a bounded conflict response from both protected verification endpoints.
- **Verified locally:** focused camp discovery, API, and verification-governance tests pass (3 files / 9 tests); `astro check` completes with zero errors (existing repository hints remain). No directory record, migration, deployment, or external system was changed.

## 2026-07-18 - governed affiliate inventory and release control

- **Implemented locally:** a deterministic inventory control maps every referenced `/go/` slug to its content sources, requires HTTPS destinations plus retailer/campaign metadata, and enforces the associate tag on direct Amazon URLs. The report contains destination hosts and content paths, not reader or click identifiers.
- **Current evidence:** 245 affiliate destinations validate; 236 are currently referenced; no content slug is missing from the inventory and no direct-Amazon tag-policy error remains. The control is part of `ci:release`.
- **Boundary:** this is repository integrity and attribution metadata, not proof of live merchant availability, redirect expansion, conversion receipt, or revenue. Those remain provider/live-account gates.

## 2026-07-18 - overnight implementation validation baseline

- **Verified locally:** after the repository, SEO, sitemap, demand, and affiliate increments, the complete Vitest suite passed 132 files / 721 tests. Later camp-trust increments passed their focused suites and Astro diagnostics at zero errors.
- **Worktree boundary:** unrelated hit-rate-test outputs and scratch files remain unmodified by this program. Focused commits stage only the files owned by each slice.

## 2026-07-18 — camp sitemap Worker-first routing repair

- **Confirmed live/read-only:** production `activity-radar` contains 1,588 approved programs, including 507 with `session_end_date` on or after 2026-07-18; the sitemap query's referenced columns exist and the same query succeeds remotely with zero writes. The live empty sitemap is therefore inconsistent with authoritative D1 supply.
- **Implemented locally:** staging and production asset manifests now require `/sitemap-camps.xml` to invoke the Worker before static-asset resolution. The production-manifest verifier fails if that route is omitted. This follows Cloudflare's documented `assets.run_worker_first` contract and prevents a colliding or stale asset from bypassing the D1-backed handler.
- **Gate:** this is build/config evidence, not live recovery proof. The protected staging deployment must show a populated sitemap from its own fixture (or an intentional retryable 503 if its isolated DB has no approved supply), and production deployment must then show the 507-record query surface rather than an empty 200 response.

## 2026-07-18 — governed demand-opportunity reporting slice

- **Implemented locally:** `/admin/search-signals` now reads the same isolated `PCD_OPS_DB.demand_events_v1` model used by the default-off telemetry endpoint instead of the obsolete `DB.search_events` table. It renders aggregates only, excludes expired and likely-bot events, and prioritizes zero-result queries before overall frequency.
- **Privacy boundary:** the dashboard does not fetch or expose event IDs, user agents, referrers, IP addresses, or raw event rows. Collection remains default-off and still requires an explicit bounded retention value and separate activation approval.
- **Verified by tests:** focused reporting tests cover the SQL privacy/retention contract, binding parameters, result mapping, and input bounds. Live telemetry activation and customer-data collection did not occur.

## 2026-07-18 — camp sitemap blackout fail-closed response

- **Implemented locally:** the D1-backed camp sitemap now returns retryable HTTP 503 with `Cache-Control: no-store` and `Retry-After: 3600` when it cannot produce any approved current/future camp URLs. A populated sitemap remains HTTP 200 with a bounded five-minute cache.
- **Behavioral boundary:** this prevents an empty operational/data state from being published and cached as an authoritative successful sitemap. It does not restore camp supply, change any camp record, or prove how a search engine will react.
- **Verified by tests:** three focused tests cover empty, populated, and invalid-count behavior. Deployment and live recovery evidence remain pending behind the protected release workflow.

## 2026-07-18 — full content crawl and camp-sitemap blackout evidence

- **Confirmed live/read-only:** all 1,971 URLs in `sitemap-content.xml` returned 200 during a full crawl with zero timeouts, redirects, or 404/410 responses. This proves only the current content sitemap surface.
- **Confirmed live/read-only critical gap:** `sitemap-camps.xml` returns HTTP 200 but contains zero URLs. The known SERA Sports Complex camp URL returns 404; `/camps/wa/` also returns 404 while `/camps/` returns 200. The staged redirect therefore targets the honest directory landing page, not an invented equivalent camp or unavailable state hub.
- **Implemented locally:** Nora's redirect auditor accepts project-contained GSC CSV/text watchlists, rejects external origins and path escapes, and fails loudly when a required sitemap is empty or unavailable. Five focused tests pass. The SERA redirect is code-complete but not deployed; the empty camp supply/sitemap remains a live data/operations incident, not fixed by this redirect.

## 2026-07-18 — repository ownership and operator-entrypoint repair

- **Verified in code:** the tracked root contains multiple runtime systems, three non-interchangeable migration lineages, generated evidence, archives, and many referenced historical root documents. A canonical placement policy now names the authority for current state, plans, handoffs, releases, approvals, and business priorities without pretending the legacy tree has already moved.
- **Repaired locally:** the root README now identifies Astro 7 and Cloudflare Workers, points releases to `DEPLOYMENT-RUNBOOK.md`, points status to this ledger, and marks its old layout/Kit/status sections as historical. Two embedded NUL bytes were removed so future diffs are text-reviewable.
- **Verified by tests:** the repository-structure contract passes 3 tests covering operator authority and the separation of `DB`, `PCD_OPS_DB`, and the legacy camps migrations. No file was deleted or bulk-moved, and no runtime or external state changed.

## 2026-07-18 — evidence-based coaching-tip HowTo schema

- **Implemented locally:** coaching-tip `HowTo` JSON-LD now uses the numbered instructions visibly published under each article's `How to run it` section. Markdown presentation syntax and link destinations are removed from step text; extraction stops at the next visible section.
- **Truthfulness boundary:** tips without that section or with fewer than two real instructions emit no `HowTo` claim. The former generic one-step `Run the drill` claim and its invented step URL were removed.
- **Verified locally:** focused Vitest coverage passes (1 file / 3 tests), and `astro check` completes with 0 errors and 0 warnings (existing hints remain). No deployment, external validation, content mutation, or production action occurred.

## 2026-07-17 (session 2) — worktree repair, code hardening, and gate-progress update

- **Repaired:** the corrupted working tree (48 truncated files restored in place from HEAD; 8 genuine edits preserved). `check:release-evidence` and `check:secrets` pass again. Commit is a Windows-host step (git write fails over the cloud bridge).
- **Release state:** rc01 gate tally is now 11 pass / 1 not_applicable / 7 pending. `r2_recovery` accepted by owner as an empty-scope not_applicable exception (disposition A, 2026-07-17). Remaining seven gates stay owner/human/counsel-gated.
- **Hardening (unverified until Windows suite run):** JSON-LD output escaping (26 files + helper + test), Worker-based incident runbook, idempotent camp reject, admin open-redirect validation, timing-safe cron key compare.
- **Gate prep:** offsite backup tooling + runbook + template; exact production-migration change request (Plan 018); 19-risk counsel disposition worksheet; readiness runbooks for the access probe, notification receipt, and failure-isolation rehearsal. Full detail + per-gate remaining actions in `coordination/GATE-PROGRESS-2026-07-17-claude.md`.
- **Next:** hand to Codex for independent critique, then Jeff-gated live actions, then deploy.

## 2026-07-17 current release-readiness update

- **Confirmed live, read-only:** production Worker `parent-coach-desk` is back on the approved Plan 015 version `35449367-a085-4096-bb7b-6886c048cea5` at 100% traffic. Bounded GET checks of `/`, `/api/health`, and `/api/ready` returned 200. The brief unintended deployment target at `8dd97cde-3dfc-410b-b458-6bf6d9848e52` was restored; its scope, limitations, and prevention control are recorded in `coordination/release-evidence/production-deployment-scope-incident-2026-07-17.json`.
- **Confirmed live, read-only:** isolated staging Worker `parent-coach-desk-staging` is version `b66d47cc-7531-4d1d-99b4-4b194eeee61b`. Its generated manifest was verified before deployment to use only its staging directory and operations D1 databases, staging R2 bucket, staging origin, and default-off customer feature flags. See `coordination/release-evidence/verified-staging-deployment-2026-07-17.json`.
- **Verified locally:** Plan 015's canonical editorial repository-target repair is deployed. Its one intentional live verification remains a human-selected, protected GitHub content write; it has not been automated. See `coordination/plans/015-editorial-approval-repository-target-repair.md`.
- **Verified locally:** the complete current suite passed with 109 unit files / 565 tests and 10 integration files / 44 tests; Astro check reported 0 errors and 354 existing hints. The release-evidence structure is valid but correctly reports eight unpassed gates.
- **Release state:** Parent Coach Desk is not yet customer-ready. The authoritative current gate packet is `coordination/release-evidence/rc01.json`; `coordination/LAUNCH-AUTHORIZATION-MATRIX.md` names every remaining owner choice and external proof. Pending items include authenticated Access results, independent immutable backup/retrieval, R2 disposition, manual accessibility/journey evidence, notification provider/channel receipt, environment-level failure rehearsal, counsel/risk disposition, and production migration approval.
- **Implementation status:** the public-directory, trust-intake, owner-authorization, demand-loop, and commerce foundations are implemented as default-off and separately scoped local/staging capabilities. No camp-owner customer authentication, paid checkout, payment provider, production operational migration, or customer workflow has been activated.

The older dated sections below are historical snapshots. When they conflict with this release-readiness update, the dated evidence packet above controls.

## 2026-07-16 rollback exposure and Worker defense-in-depth update

- **Confirmed live, read-only:** the active `parent-coach-desk` Worker version is `92516f62-b891-4903-94e1-204a972ee2ae` at 100%; it is the only fully configured Worker code line currently proven.
- **Confirmed live, read-only:** all 32 local administrative contract paths on `parentcoachdesk.com` redirect anonymous requests to the expected Cloudflare Access origin.
- **Confirmed live, read-only:** retained Pages deployment `3ee0e373-04ef-4540-90ac-b8f41e8ebec5` still serves core public pages but returns 200 anonymously for 11 historical administrative pages on its `pages.dev` hostname. It is not a safe rollback target. No sensitive matched values were retained.
- **Verified locally:** production/staging asset configuration now runs the Worker first for exact and nested admin paths. A custom Worker entrypoint performs application-level Access JWT and allowlist verification before delegating to Astro's static-asset handler. The exact production build preserves previews, contains the guard ahead of the delegate, generated the expected Worker-first manifest, and passed focused tests.
- **Not deployed:** the runtime defense does not affect production or the historical Pages artifact until separately approved. No Pages, Access, DNS, Worker, D1/R2, schedule, secret, email/Slack, Git or deployment mutation occurred.

## 2026-07-15 production cutover preflight update

- **Verified in code:** branch `migration/pages-to-workers-staging` is clean at commit `b7afc2e` before Plan 011 implementation.
- **Confirmed live:** production remains Pages project `parent-coach-playbook`, deployment `3ee0e373-04ef-4540-90ac-b8f41e8ebec5`; no `parent-coach-desk` production Worker exists.
- **Confirmed live:** production apex returns 200, `www` redirects to apex, while `/admin`, `/api/admin/editorial`, and `/.well-known/security.txt` return 404.
- **Confirmed live:** no Access application protects `parentcoachdesk.com`. Existing relevant applications protect staging, workers.dev, or the legacy `parentcoachplaybook.com` hostname. This is a hard gate before domain cutover because the current build contains static protected admin pages.
- **Confirmed live:** Pages exposes secret names `BULK_IMPORT_TOKEN`, `CRON_KEY`, and `GITHUB_TOKEN`, but Cloudflare does not expose their values. Secure value transfer is a cutover dependency; values must never enter repository evidence or chat.
- **Approved by Jeff:** production Access setup, Worker deployment, Pages-to-Workers domain cutover, validation, rollback if required, and local evidence commit under Plan 011. No production data mutation or Git push is approved.

## 2026-07-15 production Pages-to-Workers cutover update

- **Verified in code:** production build selection is explicit and cross-platform through `npm run build:production`, which directs the Astro Cloudflare adapter to `wrangler.production.jsonc` while leaving the root staging config unchanged.
- **Verified by tests/build:** 27 files and 232 tests passed; both TypeScript checks passed; Astro check reported 0 errors; npm audit reported 0 vulnerabilities; the production build passed without `NODE_OPTIONS` in 62.5 seconds; the exact generated Worker dry run read 9,233 assets and showed the expected bindings.
- **Confirmed live, 2026-07-15:** Access application `Parent Coach Desk Production Admin` protects `parentcoachdesk.com/admin*` and `parentcoachdesk.com/api/admin*` with the proven owner-email allow policy and application AUD used by Worker JWT validation.
- **Confirmed live:** production Worker `parent-coach-desk` is active at 100% on version `92516f62-b891-4903-94e1-204a972ee2ae` (code upload `dd8c1d17-f81e-41e9-b116-f56bae3eb318` plus three secret-change versions). Secret names are `BULK_IMPORT_TOKEN`, `CRON_KEY`, and `GITHUB_TOKEN`; values were not inspected or recorded.
- **Confirmed live:** `parentcoachdesk.com` and `www.parentcoachdesk.com` are Worker Custom Domains. Apex returns 200, `www` returns 301 to apex, and `/.well-known/security.txt` returns 200 as `text/plain`.
- **Confirmed live:** anonymous `/admin`, `/admin/`, and `/api/admin/editorial` return Cloudflare Access 302 redirects. Authenticated read-only checks rendered `Desk operations`, `Editorial review board`, and an article preview.
- **Confirmed live:** Pages project `parent-coach-playbook` remains available at `parent-coach-playbook.pages.dev` with rollback deployment `3ee0e373-04ef-4540-90ac-b8f41e8ebec5`; its custom domains were removed but the project was not deleted.
- **Confirmed unchanged:** no D1/R2 write, migration, cron invocation, publish/email/Slack action, bot/DMARC change, Git push, or Pages deletion occurred.

**Verified as of:** 2026-07-15
**Verified by:** Claude Code (initial evidence-based snapshot)
**Independent verification:** Performed by Codex for the Cloudflare and D1 recovery scope on 2026-07-15; other baseline claims remain scoped by their own evidence labels.

## Production/staging matrix update

The read-only comparison is recorded in `coordination/PRODUCTION_STAGING_MATRIX.md` under Plan 005. **Confirmed live, 2026-07-15:** production Pages is sourced from older commit `3e125bc51f339e47f11ca17cd7a5264a6a693ee6`, not the current migration branch. **Confirmed live:** staging lacks current admin Access settings and all Worker secrets. **Confirmed live plus verified in code:** the scheduled Yelp Worker lacks its required `YELP_API_KEY` and aborts on the resulting authorization failure. No remote configuration was changed.

**Confirmed live, 2026-07-15, Plan 006:** cron Worker version `9af6e107-1a51-402f-9748-884326ca1445` is active with fail-loud code, scheduled and fetch handlers, plain `SWEEP_URL`, and retained `CRON_KEY`, `DEPLOY_HOOK_URL`, and `MANUAL_TRIGGER_KEY` secret names. **Verified in code and by build:** staging config now includes `FORGE_DB` -> `forge-command`; the staging deployment remains pending the unavailable Access team domain and application AUD. Production Pages and staging were not deployed.

**Confirmed live, 2026-07-15:** Jeff retired Yelp enrichment. The `activityradar-yelp` Worker and its daily schedule were deleted from Cloudflare, and `workers-activity-radar/yelp-worker.ts` plus `yelp-wrangler.toml` were removed. No D1 data was deleted; existing Yelp-derived fields are historical and no longer refreshed.

## Cloudflare and recovery verification update

**Confirmed live, 2026-07-15:** `parentcoachdesk.com` and `www.parentcoachdesk.com` are attached to the `parent-coach-playbook` Pages project. The `parent-coach-desk-staging` Worker is deployed separately and has `SESSION`, `DB`, `PHOTOS`, `ASSETS`, `ADMIN_EMAILS`, and `SITE_URL` bindings. Its `DB` is `activity-radar`; `PHOTOS` is `activityradar-photos`. Secret values were not accessed.

**Confirmed live, 2026-07-15:** `activityradar-enrichment` is deployed with scheduled and fetch handlers and binds the same `activity-radar` D1. `parent-coach-playbook-cron` is deployed and has `CRON_KEY`, `DEPLOY_HOOK_URL`, `MANUAL_TRIGGER_KEY`, and `SWEEP_URL` as secrets by name. The deployed cron version predates the repository change that makes `SWEEP_URL` a plain variable, so that change is not live.

**Confirmed live, 2026-07-15:** Pages production has secret names `BULK_IMPORT_TOKEN`, `CRON_KEY`, and `GITHUB_TOKEN`. `parent-coach-playbook-link-checker` and `parentcoachplaybook-redirect` do not exist as Workers in the account. The link-checker config still contains placeholder D1 IDs and must not be deployed.

**Verified by recovery exercise, 2026-07-15:** `activity-radar` had 23 tables, size 185,696,256 bytes, 198,287 organizations, and 2,411 programs at the read-only snapshot. Backup proving run 1 exported 245.3 MB on its first attempt. A fresh isolated SQLite restore passed `PRAGMA integrity_check` and matched both key counts exactly. Raw Wrangler-local replay did not complete in a practical time and is not claimed as proven. Two separate-day backup proving runs remain before scheduling is allowed.

**Not verified:** Pages production non-secret binding inventory, matching values of the two `CRON_KEY` secrets, a successful fresh remote non-production D1 import, and any custom-domain attachment for the absent redirect Worker.

## Plan 001 baseline recovery update

**Verified in code, 2026-07-15:** the previously dirty working set was preserved in bounded local commits `1a9b122` through `5c4c56f` on `migration/pages-to-workers-staging`. Only the explicitly excluded scratch path `tests/probe.txt` remains untracked. No push or deployment was performed.

**Verified by tests, after checkpointing:** 27 test files and 233 tests pass; `tsconfig.verify.json` and `worker-cron/tsconfig.json` type checks pass; `npm audit --audit-level=high` reports zero vulnerabilities. `astro check` remains failing with four content-body errors, 352 hints, and the duplicate dynamic camps-route warning.

**Verified in code:** D1 mutation entrypoints are now inventoried in D-001. **Not verified:** deployed/enabled state, current production bindings, successful backup exports, or an exercised restore.

Sections below preserve the initial snapshot evidence and may describe the pre-checkpoint dirty state. Where they conflict with this update, this newer dated update governs local repository state only.

Every claim below carries an evidence label: Verified in code, Verified by tests, Documented as deployed, Confirmed live, or Not verified. Documentation is not proof of deployment.

## Freshness

Fourteen days is the maximum age of this snapshot, not a guarantee of freshness. Re-verify before any Tier 3 plan, and after any deployment, migration, major merge, binding change, or material change in worktree state. A snapshot inside its fourteen days can still be stale if any of those events happened after the verified date above.

This snapshot was taken while the worktree was substantially dirty (see Worktree state). It describes committed code plus uncommitted local modifications, and it does not describe production. Either agent may propose corrections. Corrections must cite current evidence.

## Worktree state

### The worktree was unstable during inspection

**Verified in code.** The untracked count changed while this snapshot was being taken, without action by Claude. Observed sequence on 2026-07-15:

| Time | Modified | Untracked | Event |
|---|---|---|---|
| ~11:05 | 123 | 41 | Initial inspection. Neither `tsconfig.check.json` nor `tsconfig.nocron.tmp.json` present. |
| ~11:25 | 123 | 44 | `coordination/` (Claude's, expected), plus `tsconfig.check.json` and `tsconfig.nocron.tmp.json` appeared. Neither created by Claude. |
| 11:30 | 123 | 43 | `tsconfig.nocron.tmp.json` no longer exists. Deleted by something other than Claude. |

Another process created and then deleted a file in this worktree during the inspection window. **No count in this document may be treated as authoritative.** They are observations at a moment, and the moment moved.

### Quiet-worktree check

**Verified in code.** Three `git status` samples taken at 11:30:43, 11:32:10, and 11:33:38 produced an identical status hash (`dc8c6455`), 123 modified and 43 untracked each time. Last observed mutation was the deletion of `tsconfig.nocron.tmp.json`, between roughly 11:25 and 11:30. `tsconfig.check.json` carries an mtime of 11:17:37.

Three matching samples across roughly three minutes is consistent with a quiet worktree. It does not prove one. A process that writes every ten minutes would pass this check. Treat the worktree as quiet-but-unconfirmed until the provenance question below is answered by a human.

No normalization, checkpointing, branching, or worktree creation has been performed, and none may be until this is settled.

### Provenance of the temporary tsconfig files

**Verified in code**, as to what they are:

- `tsconfig.verify.json` (mtime 07:37:40, untracked at first inspection): extends `tsconfig.json`, excludes `dist`, `studio`, `activityradar-archive`, `worker-cron`.
- `tsconfig.check.json` (mtime 11:17:37, appeared mid-session): extends `tsconfig.json`, includes `.astro/types.d.ts` and `**/*`, excludes the same four plus `node_modules`, `src/lib/agent-runs.ts`, `tests/api/agent-runs.test.ts`, `src/pages/api/agent-runs.ts`.
- `tsconfig.nocron.tmp.json`: existed at ~11:25, gone by 11:30. Contents never read. The name implies a `worker-cron` exclusion.

None of the three is referenced by `package.json` scripts or by any file in the repository (**Verified in code**). The `check` script is plain `astro build`-adjacent `astro check` with no `-p` flag.

The pattern is a narrowing sequence of type-check scopes, each excluding more of the surface than the last, ending with one that excludes the `agent-runs` files specifically. That is consistent with somebody iterating toward a clean type check by excluding what fails.

**Not verified: which actor created them.** Candidates are a Codex session, another Claude session, or Jeff working directly. Nothing in the repository distinguishes them, and file ownership in this environment does not either. This must be answered by Jeff, not inferred.

### Committed baseline

**Verified in code** (2026-07-15):

- Branch: `migration/pages-to-workers-staging`.
- HEAD: `b02dce4` "Card M4: migrate Tailwind v3 -> v4 (@astrojs/tailwind -> @tailwindcss/vite)".
- Raw diff of modified tracked files: 35,464 insertions, 35,079 deletions across 123 files.
- Diff ignoring whitespace and blank lines: 51 files, 1,043 insertions, 658 deletions.

### Git remote and history preservation

**Verified in code**:

- A remote is configured: `origin` at `https://github.com/jeffthomas4-lab/parent-coach-playbook.git`.
- Remote-tracking branches present locally: `origin/main`, `origin/cloudflare/workers-autoconfig`.
- This branch has no configured upstream (`git rev-parse @{u}` returns "no upstream configured for branch 'migration/pages-to-workers-staging'").
- Uncommitted changes are not preserved in Git history.

**Not verified**: whether equivalent remote branches or commits exist. No fetch or remote inspection beyond local refs was performed, so the remote-tracking refs above may themselves be stale. Nothing here supports a claim that this work does or does not exist remotely.

The gap between those last two numbers means roughly 72 of the 123 modified files differ only by line endings. There is no `.gitattributes` in the repository and `core.autocrlf` is unset (**Verified in code**). Until that is resolved, any commit taken from this worktree carries tens of thousands of lines of end-of-line churn, and any review diff built on it is unreadable. This is an operational blocker for the review half of this protocol.

Normalization has not been started and must not be started until the worktree is confirmed quiet and the provenance question above is answered. Normalizing a worktree that another process is actively writing to is how work gets destroyed.

Untracked paths include what appears to be active, recent work: `PCD-AI-OS/`, seven lane reports dated 2026-07-15 under `reports/`, and new modules at `src/lib/access-jwt.ts`, `src/lib/agent-runs.ts`, `src/lib/email.ts`, `src/lib/publish.ts`, `src/lib/slack.ts` with corresponding tests. **Not verified**: what workstream produced these, whether they are complete, and whether they are intended for the current branch.

## Application architecture

**Verified in code** (`package.json`, directory listing):

- Astro 7 (`astro ^7.0.9`) with `@astrojs/cloudflare ^14.1.3` adapter.
- Tailwind 4 via `@tailwindcss/vite`, migrated from `@astrojs/tailwind` at HEAD.
- TypeScript 5.6, Vitest 4, Wrangler 4.88.
- Leaflet with markercluster for mapping.
- Build chain: `build:manifest` (Node) then `build:og:safe` (Python, Pillow, non-fatal if unavailable) then `astro build`.
- Package name `parent-coach-desk`, version 0.1.0, private.

Python is a soft dependency of the build. `build:og:safe` swallows its own failure and ships committed cards from `public/og/`. **Not verified**: whether the deploy environment has Python and Pillow, and therefore whether OG cards regenerate or ship stale.

## Cloudflare architecture

**Verified in code** (`wrangler.jsonc` and sibling wrangler files):

- Root worker name: `parent-coach-desk-staging`.
- Bindings declared in `wrangler.jsonc`, by name only: `ASSETS`, `DB`, `PHOTOS`, `SESSION`.
- D1 `database_name`: `activity-radar`.
- R2 `bucket_name`: `activityradar-photos`.
- Additional wrangler configs: `legacy-domain-redirect/wrangler.jsonc`, `worker-cron/wrangler.toml`, `worker-link-checker/wrangler.toml`, `workers-activity-radar/wrangler.toml`.
- `worker-cron` is named `parent-coach-playbook-cron`, entry `src/index.ts`, schedule `crons = ["0 13 * * *"]`.

The Cloudflare project and D1 database retain the older `parent-coach-playbook` naming while the folder and package use `parent-coach-desk`. This is expected per the workspace deployment norm, not a defect.

**Not verified** for every binding above: whether it exists in the Cloudflare account, whether it is bound in the deployed environment, and whether staging and production bindings differ.

## Pages to Workers migration status

**Documented as deployed**, not confirmed: the branch name `migration/pages-to-workers-staging` and the commit series `d9e7b8c` (Card M1, "Pages->Workers staging proof: Astro 7 + Content Layer + Workers deploy") through `b02dce4` (Card M4) describe a staging migration in progress.

**Verified in code**: commits M1 through M4 exist and touch the adapter, bindings, and Tailwind pipeline. Card M3 checkpoints 1 and 2 swap read-path and write-path D1/R2 bindings off `locals.runtime.env`.

**Not verified**: whether the staging worker is live, whether production still runs on Pages, and what the cutover criteria are. The worker name carries a `-staging` suffix, which suggests but does not establish that production is a separate deployment.

**Not verified**: the current production surface for parentcoachdesk.com.

## Secrets and environment variables

Names only. No values are recorded here, and none may be added.

**Verified in code** (referenced in `src/` and `worker-cron/src/`): `AGENT_RUNS_TOKEN`, `BULK_IMPORT_TOKEN`, `CRON_KEY`, `DEPLOY_HOOK_URL`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `FORGE_DB`, `GITHUB_TOKEN`, `OPS_HEARTBEAT_URL`, `PHOTOS`, `PUBLIC_KIT_LEAD_MAGNET_FORM_ID`, `RESEND_API_KEY`, `SITE_URL`.

**Not verified**: whether each is present in staging, in production, or in neither. `FORGE_DB` is referenced in code but does not appear as a binding in `wrangler.jsonc` (**Verified in code**), which is either a missing binding or a binding declared elsewhere. This needs live verification before anything depends on it.

## Migrations

**Verified in code** (`migrations/`, `migrations-activity-radar/`):

- `migrations/` holds `0001` through `0010`, plus a README.
- Two files share the `0009` prefix: `0009_featured_listings.sql` and `0009_org_suggestions.sql`. Ordering between them is ambiguous by filename.
- `migrations-activity-radar/` is a separate migration set; `0009_enrichment_queue.sql` and `0010_enrichment_org_fields.sql` are both locally modified and uncommitted.

**Not verified**: which migrations have been applied to staging, which to production, and whether the duplicate `0009` prefix has already caused divergence between environments. Applied-migration state cannot be established from this repository alone and requires live verification.

## Testing state

**Verified in code**: 27 test files under `tests/api/`, plus helpers at `tests/helpers/` (`access-token.ts`, `context.ts`, `d1.ts`, `slack-sign.ts`). Runner is Vitest via `npm test`. `npm run check` runs `astro check`. `npm run audit:gate` runs `npm audit --audit-level=high`. `npm run test:links` runs linkinator against `./dist`.

Coverage skews to admin and API surfaces: admin auth, admin camps approve/reject/update/verify/photo, admin claims, admin editorial approve and publish, admin reviews, admin suggestions, camps submit/claim/check/suggest/nearest/search-priority, cron camps sweep, search events, access JWT, agent runs, email, publish lib, slack lib, slack actions.

**Not verified**: whether the suite passes. No validation commands were executed during this setup task. Seven of the test files are untracked and uncommitted, so the committed suite and the local suite differ.

## Operational blockers

1. **The worktree was observed changing without Claude's action**, and the provenance of `tsconfig.check.json` and the since-deleted `tsconfig.nocron.tmp.json` is unresolved. Until a human answers this, no agent should assume it is the only writer here. This blocks normalization, checkpointing, and any operation that rewrites files in bulk. **Verified in code**.
2. Line-ending churn across roughly 72 files makes review diffs unusable until a `.gitattributes` and renormalization land. Blocked behind item 1. **Verified in code**.
3. The worktree carries 123 modified and a shifting count of untracked paths of unattributed work. Baseline for any plan is therefore uncertain. **Verified in code**.
4. Duplicate `0009` migration prefix. **Verified in code**.
5. `FORGE_DB` referenced without a visible binding. **Verified in code**.
6. No in-repo `AGENTS.md` or `CLAUDE.md`, so neither agent has repository-local governance. **Verified in code**.
7. This branch has no configured upstream, and uncommitted changes are not preserved in Git history. A remote (`origin`) exists. Whether equivalent remote branches or commits exist is **Not verified**.

## Do not change without a separate approved plan

- `src/lib/admin-auth.ts` and `tests/api/admin-auth.test.ts`. Auth surface, currently modified locally.
- Anything under `migrations/` or `migrations-activity-radar/`.
- `wrangler.jsonc` and every sibling wrangler config. Binding changes are Tier 3.
- `worker-cron/`, `worker-link-checker/`, `workers-activity-radar/`. Scheduled and autonomous surfaces.
- `src/lib/publish.ts`, `src/lib/email.ts`, `src/lib/slack.ts`. Outbound and publishing surfaces subject to mandatory human approval.
- The uncommitted working set described above, until Jeff decides what it is.

## Uncertainties requiring live verification

- Production versus staging surface for parentcoachdesk.com.
- Applied migration state in each environment.
- Binding and secret presence in each environment.
- Whether the `parent-coach-playbook` Cloudflare project and the `activity-radar` D1 database are the production instances.
- Whether the daily `0 13 * * *` cron is live, and against which environment.

## 2026-07-15 live staging verification update

- **Confirmed live:** `parent-coach-desk-staging` version `a95f7b5d-74a8-4b1e-a1da-4f96eb285e04` is deployed with `SESSION`, `DB` (`activity-radar`), `FORGE_DB` (`forge-command`), `PHOTOS`, `ASSETS`, `SITE_URL`, `ADMIN_EMAILS`, `ACCESS_TEAM_DOMAIN`, and `ACCESS_AUD` bindings.
- **Confirmed live:** anonymous `/` returns 200; anonymous `/admin` and `/api/admin/editorial` are redirected to Cloudflare Access.
- **Confirmed live:** after email-OTP authentication, `/admin/editorial/` renders the editorial dashboard. The authenticated test was read-only.
- **Verified in code/live:** `/admin` has no index route and therefore returns the site's own 404 after Access succeeds. Existing admin entry points are subroutes such as `/admin/editorial/` and `/admin/camps/`.
- **Confirmed live:** cron version `9af6e107-1a51-402f-9748-884326ca1445` is deployed with fetch and scheduled handlers and the intended `SWEEP_URL` variable.
- **Confirmed live:** the former `activityradar-yelp` Worker is retired. Historical Yelp-derived database fields remain intact.

## 2026-07-15 build-stability update

- **Verified in code:** the build contains 4,060 prerendered HTML pages, including 1,816 protected admin preview pages, from 1,852 Markdown content entries. Astro uses its default build concurrency of one, and the application does not use `astro:assets`.
- **Verified in code:** `@astrojs/cloudflare` now uses its supported `prerenderEnvironment: 'node'` option. This affects build-time generation only; on-demand routes continue to execute in workerd and prerendered pages remain static assets.
- **Verified by tests:** `npm run check` passes with 0 errors. Two consecutive full `npm run build` runs passed with `NODE_OPTIONS` explicitly absent, in 95.4 and 68.3 seconds. Both retained 4,060 HTML files and 1,816 admin preview files.
- **Verified by build evidence:** the prior default-heap failures were caused by workerd-based prerendering across the large static route set, not elevated build concurrency, admin preview expansion alone, or Astro image processing. Admin previews materially increase scale but remain intentionally prerendered to keep the runtime Worker small.
- **Confirmed live, unchanged:** staging remains version `88711555-7f3b-4123-bec6-098075f2a095`. Plan 008 did not deploy because the change affects only the build-time prerender environment and generated route counts were unchanged. Production was not deployed.

## 2026-07-15 staging release rehearsal update

- **Verified in code:** commit `13bfec6` makes explicit `draft: false` publishing idempotent before editorial-date stamping, preventing a later repeated approval from issuing a second GitHub PUT or deploy-hook request.
- **Verified by tests:** focused publish tests pass 32/32; the full suite passes 232/232; both TypeScript checks pass; Astro check reports 0 errors; dependency audit reports 0 vulnerabilities.
- **Verified by build:** the exact clean commit built without `NODE_OPTIONS` in 58.6 seconds and retained 4,060 HTML pages, including 1,816 admin previews. The Wrangler dry run read 9,233 assets and contained every expected binding.
- **Confirmed live, 2026-07-15:** `parent-coach-desk-staging` version `6078f32b-bfde-4c43-bb94-20601702d9c0` is active at 100% with fetch handler, 23 ms startup, and the expected `SESSION`, `DB`, `FORGE_DB`, `PHOTOS`, `ASSETS`, `SITE_URL`, `ADMIN_EMAILS`, `ACCESS_TEAM_DOMAIN`, and `ACCESS_AUD` names. Prior version `88711555-7f3b-4123-bec6-098075f2a095` is the rollback target.
- **Confirmed live:** anonymous `/` and `/.well-known/security.txt` return 200; anonymous `/admin` and `/api/admin/editorial` return Cloudflare Access 302 responses.
- **Confirmed live, authenticated and read-only:** `/admin/` renders `Desk operations` with seven links, `/admin/editorial/` renders `Editorial review board`, and an article preview renders successfully.
- **Confirmed live, unchanged:** production Pages was not deployed or altered. No shared D1/R2 write, migration, outbound publish action, secret/binding change, cron invocation, bot change, or DMARC change occurred.
## 2026-07-16 protected support-draft boundary

- **Implemented locally, not migrated or deployed:** migration `0012_trust_drafts_and_notification_outbox.sql` defines Access-protected response drafts separately from a metadata-only notification outbox. Outbox rows contain opaque aggregate IDs, event class, priority and delivery state—not requester identity or message bodies.
- **Implemented locally, not migrated or deployed:** additive migration `0014_trust_intake_idempotency.sql` and the public trust route bind a validated browser retry key to a normalized SHA-256 request fingerprint. An exact retry returns the original case reference before consuming another rate-limit unit; reuse with changed content returns `409`. Conditional event/outbox inserts prevent duplicate lifecycle and notification work under concurrent retries. The browser retains its key across uncertain failures and rotates it only after confirmed success.
- **Implemented locally:** trust intake creates its case, append-only submission event and pending opaque notification in one D1 batch. Staff can save a bounded response draft through a same-origin, Access-authenticated admin endpoint. Drafts carry a SHA-256 payload binding and seven-day expiry; a separate protected queue requires explicit recipient/subject/body/hash/expiry confirmation and a meaningful note before immutable human approval. Saving or approving explicitly does not send.
- **Implemented locally:** a bounded maintenance primitive voids at most 200 expired pending drafts per run with conditional updates and append-only expiry evidence. A provider-neutral, read-only send-time gate rechecks exact case/draft identity, approved state, active case, expiry, stored payload hash and approved hash immediately before any future executor could use the returned payload.
- **Implemented locally:** a provider-neutral delivery state machine claims a unique immutable payload before calling an injected provider, never auto-retries claimed/failed/ambiguous attempts, and requires reconciliation after provider exceptions, missing provider IDs, or post-delivery persistence mismatch. It has no route, scheduler, or real-provider adapter.
- **Implemented locally:** an Access-protected reconciliation queue exposes ambiguous, failed, stuck, and provider/draft-inconsistent attempts. A same-origin decision endpoint requires an authoritative provider evidence reference, meaningful note, explicit no-retry confirmation, verified admin identity, and a conditional one-time state transition. Confirmed-not-sent voids the approved draft and requires a fresh draft/approval; confirmed-sent records provider evidence and append-only history.
- **Verified locally:** focused support/security/governance, demand-privacy, content-coverage and camp-approval tests pass; the full suite passes 63 files / 406 tests, Astro check reports zero errors and zero warnings, and the production build completes. The unapplied additive `0013_demand_events_v1.sql` migration and default-off ingestion contract require an explicit 1–90 day retention variable in addition to the feature flag, store no IP/referrer/user-agent field, derive result bands and ephemeral bot class, and leave geography null. A five-entry exact partial content registry now generates a minimized content-addressed artifact and CI fails on stale artifacts; no artifact was uploaded or bound. Camp approval now blocks missing, malformed, reversed and ended dates and performs the guarded program/organization transition in one D1 batch. Public and CSV bulk imports always enter pending moderation; the historical bearer-token auto-approve behavior is removed locally. These controls prevent recurrence of the July expired-listing bulk-approval class after deployment. No migration was applied, telemetry enabled, expiry maintenance invoked against D1, provider called outside fakes, message sent, artifact uploaded, listing changed or delivery worker enabled.
- **Verified live/read-only 2026-07-16 13:03-13:07 UTC:** the configured production `activity-radar` D1 returned all nine queued remediation records; all remain approved. Query metadata reported 27 rows read, zero written and `changed_db=false`. Current official Everett, Breakthrough and Challenger pages reproduce the material price conflicts/context. A local ten-item proposal packet preserves minimized before evidence, permits only three dated, owner-gated price proposals, contains no executable SQL, and validates with canonical SHA-256 `e90527d40de0bff07f4ab98c7d467bda5eef5a81303798b21d65a0b15a11d3b2`. No correction or other production mutation was performed.
- **Verified live/read-only 2026-07-16 13:28 UTC:** Worker versions and deployments still contain one code-upload version followed by three secret-change versions. Active version `92516f62-b891-4903-94e1-204a972ee2ae` receives 100% traffic and has the same script ETag as original version `dd8c1d17-f81e-41e9-b116-f56bae3eb318`, but only the active version contains the three required secret binding names. A sanitized, expiring, CI-validated receipt pins the active fully bound version as the exact rollback target for the *next* approved release. It does not authorize rollback and does not cover D1/R2/KV state. No deployment or rollback occurred.
- **Verified locally, no side effects:** a machine-validated recovery tabletop covers Worker regression, D1 bad write, D1 schema failure, R2 object loss, currently unused `SESSION` KV loss, and attempted Pages fallback. It preserves R2 and operational rollback as gaps, requires separate approvals for code/data/config actions, and rejects any inference that Worker rollback restores storage. No rollback, restore, copy, bucket/namespace operation or writer shutdown occurred.
- **Verified locally, no side effects:** integrated failure simulation proves D1 failure leaves liveness available while readiness returns 503, operational status becomes `unknown` without leaking exceptions, missing Forge durability prevents scheduler invocation, unhealthy scheduled work rejects rather than false-greens, ambiguous notification delivery requires reconciliation, and the public monitor remains read-only. A strict pending receipt cannot become `received` without provider evidence, recipient role, acknowledgement reference and Jeff's approval. No alert was sent or acknowledged, so environment failure-isolation and notification receipt gates remain pending.
- **Verified locally, no external side effects, 2026-07-16:** an isolated Wrangler D1 rehearsal first reproduced that the historical repository chain could not bootstrap a fresh database: `0006_camp_quality_framework.sql` indexed `source_domain` and other columns added outside the migration framework, and `0008_awaiting_review.sql` had the same dependency. `0001_init_camps.sql` now defines all 15 legacy columns only for databases where `0001` has never run. A second empty-database rehearsal applied all 15 repository migrations through `0014`, found all 15 legacy columns, all seven trust tables and both idempotency columns, and returned a clean `PRAGMA foreign_key_check`. This repairs fresh bootstrap locally but does not compare or restore the current production schema, does not clear the migration gate, and applied nothing remotely. Evidence: `coordination/release-evidence/trust-migration-rehearsal-2026-07-16.json`.
- **Verified live/read-only plus locally, no external mutation, 2026-07-16:** production `DB` is the shared Activity Radar graph lineage: its 11 applied migration names run from `0001_core_graph.sql` through `0012_camp_scan.sql`, `camps` is absent, four names used by the legacy PCD lineage already exist as differently shaped shared tables, and none of the eight candidate operational tables exists. Query metadata reported zero rows written and `changed_db=false`. The PCD migration chain must not run against `DB`. Trust, support, demand and PCD operational state now require the fail-closed, currently unprovisioned `PCD_OPS_DB` binding in code. A distinct `migrations-pcd-ops/` lineage containing only `0011`-`0014` applied successfully to an empty isolated local D1. No D1 was created or bound remotely and both feature flags remain off. Evidence: `coordination/release-evidence/production-schema-compatibility-2026-07-16.json`.
- **Verified locally, live evidence pending:** redacted Access-policy and authenticated-probe contracts now fail closed. A policy packet cannot pass without current team/audience match, coverage for `/admin*` and `/api/admin*`, ordered application policies, and bounded allow selectors; allow-everyone is rejected. Authenticated evidence derives the required route count from the current protected-route contract and cannot pass without all 37 current routes for both allowed and denied identity classes, no mutation invocation, and no retained cookies/tokens. Existing JWT/application tests do not replace the missing live export and identity probes.
- **Still required:** review of the local canonical D1 bootstrap repair plus a representative candidate restore/schema-comparison rehearsal, separately approved scheduling of expiry maintenance, provider selection and a separately reviewed adapter/event receiver, named primary/backup owners, independent receipt/failure drills, legal rules and retention decisions.

## 2026-07-16 staging PCD operational database rehearsal

- **Approved and completed within staging-only scope:** created isolated D1 `parent-coach-desk-ops-staging` in WNAM and added `PCD_OPS_DB` only to `wrangler.jsonc`. `wrangler.production.jsonc` remains without a production operational-database binding.
- **Verified remotely in staging:** migrations `0011` through `0014` applied successfully; all eight expected operational tables exist; migration count is four; trust and demand tables are empty; `PRAGMA foreign_key_check` is clean. Read-only verification reported zero writes and `changed_db=false`.
- **Verified recovery mechanics locally:** exported the empty staging database to `C:\tmp\pcd-ops-staging-20260716.sql` (SHA-256 `c997e44c27437c2aa6f4025e83f1188e7a08333e380caccef8d17ddbf29fc5bc`) and restored it to an isolated SQLite file. Integrity, schema, row-count and migration-lineage checks pass. This proves export/restore mechanics for the empty staging lineage, not recovery of representative customer data.
- **Not deployed or activated:** the staging Worker was not deployed with the new binding; trust intake, demand telemetry and notification delivery remain disabled; no production D1/R2/configuration changed. Evidence: `coordination/release-evidence/staging-pcd-ops-rehearsal-2026-07-16.json`.

## 2026-07-16 cache, rate-limit, assurance and mobile baseline

- **Implemented locally:** route-class cache policy sets protected/admin responses to `private, no-store`, API responses to `no-store`, and public HTML to revalidation-first caching. Aggressive shared caching remains deferred until route inventory, freshness and invalidation evidence exist.
- **Implemented locally:** public writes use separate Cloudflare rate-limit bindings for submissions, trust, community, demand telemetry and owner claims. Required limiters fail closed when absent, preventing one low-value traffic class from exhausting trust/correction capacity. Edge/WAF policy and live alert evidence remain pending.
- **Verified locally:** focused cache/rate-limit coverage passes 10 files / 60 tests. No deployment occurred.
- **Recorded in the Business OS:** mobile web is now a cross-cutting release gate at 320/360/390/430 CSS-pixel widths, landscape, 200% zoom, touch, virtual keyboard, safe-area, reduced-motion and constrained-network conditions. WCAG 2.2 AA evidence, mobile performance budgets and primary-journey adverse paths remain required before customer readiness.
- **Claim boundary:** the assurance plan is aligned to SOC 2, ISO/IEC 27001, ISO/IEC 42001, NIST, OWASP, CIS and WCAG practices, but PCD must not describe itself as certified, attested or legally compliant until scoped independent evidence supports the exact statement.
- **Verified route inventory:** a generated, stale-checked artifact classifies all 134 source routes by cache class and authorization boundary. It identifies 28 POST surfaces: 18 Access-and-app-authorized admin mutations, three shared-secret routes, one provider-signature route and six anonymous rate-limited writes. No anonymous POST remains unreviewed. The protected-route contract was repaired to include five trust draft/delivery routes and now passes for all 37 `/admin*` and `/api/admin*` sources.
- **Verified dependency and secret baseline:** the registry-backed dependency audit reports zero known vulnerabilities at the moderate threshold; current-tree plus complete-history secret scanning passes. These results are point-in-time evidence, not continuous assurance.
- **Public-claim correction:** the accessibility statement now accurately presents WCAG 2.2 AA as a target and discloses that independent conformance assessment is incomplete. A dated technical legal/privacy/consumer-claim audit records high-priority live-provider, retention, directory-substantiation, Nominatim, affiliate, copyright, child-image, entity and consent-preference gaps without presenting legal conclusions.
- **Verified live mobile gap:** read-only production rendering at 320px and 390px shows page-level horizontal scrolling on `/camps/` (approximately 430/426px document width respectively) caused by filter controls. Five other sampled public pages reflow at 320px for the limited horizontal-overflow check. Local source contains newer wrapping/grid constraints not present in the live DOM, but the isolated browser could not reach the local candidate; therefore the issue remains open until a rendered staging/candidate proof passes. Evidence: `coordination/reviews/2026-07-16-rendered-mobile-web-audit.md`.
- **Implemented locally:** the footer now provides an always-available Privacy choices control. Reopening focuses the first choice; declining dispatches an explicit withdrawal event, sets GA's page-level disable flag and removes accessible first-party `_ga*` cookies. Public notice text explains the behavior. The global footer no longer makes the unsubstantiated claim that all affiliate products are personally used. Focused privacy/claim tests pass and Astro reports zero errors/warnings; rendered and live behavior remain unproved.
- **Release-packet correction and refresh:** RC-01 records the live mobile overflow failure and correctly treats the empty staging PCD operational restore as narrower than representative customer/directory recovery proof. A fresh anonymous GET-only probe now covers all 37 current protected routes; every route returned a redacted 302 to the expected Cloudflare Access origin. RC-01 therefore returns this exact gate to pass and reports five passes with fourteen pending.

## 2026-07-16 disposable customer-identity proof boundary

- **Implemented locally and default-off:** exact WorkOS Astro/Node SDK versions are pinned, all injected proof endpoints are isolated under `/owner-proof`, and the only proof page grants no organization access. The integration exists only when `PCD_OWNER_AUTH_PROOF_ENABLED` is exactly `true` at build time.
- **Production fail-closed correction:** `build:production` now forces `PCD_OWNER_AUTH_PROOF_ENABLED=false` instead of inheriting a developer shell. The deployment-manifest verifier rejects any `WORKOS_*` or proof-enable variable and rejects injected login, signup, callback, logout or session endpoints in the server artifact. An adversarial local production build with the parent-shell flag intentionally true passed because the wrapper forced it off.
- **Runtime preflight prepared:** `npm run proof:workos:preflight` requires the exact disposable-proof acknowledgement, enabled proof flag, `client_` identifier, `sk_test_` key, localhost-only callback ending at `/owner-proof/callback`, a 32-character-or-longer cookie secret, and a non-production Wrangler config. Failure output contains no secret values. With no approved credentials present, the command fails closed as expected.
- **Verified locally:** 87 test files / 498 tests pass. The local production manifest/artifact contract passes after the adversarial build. Evidence: `coordination/release-evidence/workos-authkit-local-proof-2026-07-16.json`.
- **Still gated:** no WorkOS account/environment or credentials were created; no login, callback, cookie, logout, revocation, recovery, deletion/export, outage, accessibility or lifecycle-event behavior was exercised. Provider selection, customer identity schema implementation, staging deployment and production activation remain unapproved.

## 2026-07-16 customer identity, tenancy, and owner-workflow foundation

- **Implemented locally and default-inert:** PCD operational migrations `0016` and `0017` define provider-neutral customer users/identities, organizations, memberships, session-revocation requests, deduplicated provider lifecycle events, owner claims/evidence/events, proposed edits, and disputes. They create no login route, credential, cookie, entitlement, payment state, direct directory write, or live binding.
- **Authorization boundary:** organization access derives only from an exact active PCD user, organization, and membership. Provider organization, role, and permission claims grant no PCD access. The policy fails closed for inactive users, tenants and memberships; applies least-privilege roles; blocks non-owner self-escalation and removal of the final owner.
- **Owner workflow boundary:** claim verification requires staff action, accepted evidence, and a reason. Verification remains suspendable and disputable. Owner edits are provenance-bound proposals with base/patch hashes and review/conflict/supersession states; identity, verification, rank, payment, and entitlement fields are outside the proposal contract.
- **Verified locally:** migrations `0015` through `0017` execute together in isolated in-memory SQLite with foreign keys enabled and a clean foreign-key check. Focused identity, tenancy, owner workflow, commerce-boundary, WorkOS-proof, and privacy tests pass. No D1 migration, provider call, customer route, external configuration, or deployment occurred.
- **Still gated:** provider selection/runtime proof, authenticated routes, session-cookie design, lifecycle receiver, recovery, invitations, customer-facing owner UI, storage adapters, integration tests against a disposable D1, deletion/provider executors, and staging activation remain required before customer use.
- **Additional local foundation:** migration `0018` adds hashed one-time invitation and recovery challenges plus minimized security events. Challenge policy rejects replay, expiry, lockout, unverified/mismatched invitation identities and request-context mismatch. A provider-neutral privacy propagation contract blocks legal holds and adapter-scope mismatch, requires independent verification before completion, bounds retries and dead-letters ambiguous outcomes.
- **D1 adapter boundary:** invitation acceptance uses a prepared-statement D1 batch so membership creation and one-time invitation consumption are transactional. Authorized-organization reads join active internal user, organization and membership state. Provider lifecycle ingestion deduplicates provider event IDs and rejects same-ID/different-payload replay. No raw invitation/recovery token is stored.
- **Verified locally:** all operational migrations `0011` through `0018` execute together in isolated SQLite with foreign keys enabled and no violations; focused challenge, propagation, store, authorization and owner workflow tests pass; Astro check reports zero errors and zero warnings. These are local code/schema proofs, not a live identity-provider or D1 runtime proof.
- **Disposable D1 integration proof:** a Miniflare-backed integration suite applies operational migrations `0011`-`0018` to a fresh D1 implementation, seeds two users and one organization, atomically accepts a matching invitation, denies replay, filters access through active internal membership state, removes access after suspension, deduplicates provider events and rejects same-ID/different-payload conflicts. This is local ephemeral storage and changes no configured D1 database.
- **Signed receiver composition:** a provider-neutral raw-body receiver requires JSON, enforces a 256 KiB limit, delegates signature verification to a separately selected provider adapter, applies a five-minute replay window, hashes the exact verified payload, and persists it only after verification. Invalid signatures, stale/invalid envelopes, oversized/malformed bodies and payload conflicts fail closed. No provider-specific verifier or route is enabled yet.
- **Transactional owner workflow:** migration `0019` adds append-only proposed-edit events. D1 operations now create and submit claims only through active PCD user/organization/membership state, require staff identity plus accepted evidence for verification, require exact expected source states to prevent stale or false audit transitions, and couple every mutation to its event in one D1 batch. Proposed edits require verified ownership, allow only reviewed fields, and move through separate customer and verified-staff functions; customers cannot choose a staff actor type or self-approve. Approval changes proposal state only and never writes directory truth.
- **Expanded disposable journey:** Miniflare now proves authorized claim creation, denial after membership suspension, exact-state submission, denial of edits before verification, accepted-evidence staff verification, proposal creation/submission/review/approval, and expected immutable event counts across migrations `0011`-`0019`. Focused owner tests pass and Astro check remains at zero errors and zero warnings.
- **Recovery and dispute execution:** migration `0020` adds immutable dispute history. A recovery challenge now consumes atomically with a request to revoke all provider sessions and a minimized security event; failed attempts are versioned, bounded and auditable. A customer dispute requires an active owner/admin membership, moves the affected claim to `disputed`, blocks new edits, and records both claim and dispute history. A separately verified staff resolver supplies an explicit reason and restores or suspends the claim without changing directory data or commercial status.
- **Privacy execution and export evidence:** migration `0021` adds idempotent cascade-attempt records and expiring export-artifact metadata. Execution claims only clear, due, bounded work; settlement requires provider code plus independent verification reference for success, and records a provider receipt in the same D1 batch. Exports are represented as separately stored, integrity-hashed, human- and machine-readable artifacts with expiry and staff verification; no export payload is retained in D1. A Miniflare D1 journey proves claim, verified settlement, confirmed receipt and both export formats. No actual provider, R2 object, identity record or customer data was changed.
- **Default-off customer boundary:** `/owner/` is a server route that returns a private, noindex 404 unless `PCD_CUSTOMER_FOUNDATION_ENABLED` is exactly `true`. When enabled, it accepts only a provider-middleware-populated `Astro.locals.customer` principal and never treats request headers, query parameters, cookies or provider organization claims as authorization. It queries only active PCD memberships through `PCD_OPS_DB`, returns 401 without the trusted principal and 503 without the dedicated binding. Both staging and production config set the flag false; the production-manifest verifier rejects any other value. Astro check reports zero errors and zero warnings.
- **Test-mode commerce and reconciliation foundation:** migration `0022` adds a provider-neutral commerce ledger for products, prices, checkout attempts, orders, verified payment events, entitlements, refunds and immutable audit events. It stores no card or bank data, is disabled by `PCD_COMMERCE_TEST_MODE_ENABLED=false` in both manifests, and has no checkout, webhook, provider account, secret or live route. Disposable D1 proof covers idempotent verified-event recording and payload-conflict detection, pending-to-paid reconciliation, denial of customer-controlled entitlement grants, staff refund requests, provider-receipted refund settlement and entitlement revocation. Commercial records may affect only entitlements and paid disclosureâ€”never organic ranking, directory verification or editorial judgment. Local provider verification is still a future adapter boundary; no charge, refund, entitlement, directory or customer mutation occurred outside an ephemeral test database.

## 2026-07-16 Forge Command retired-dispatch hardening

- **Implemented locally, not deployed:** the legacy Forge Command Worker schedule and queue consumer now return without any dispatcher call unless `LEGACY_AGENT_RUNTIME_ENABLED` is exactly `true`; the checked-in configuration sets it to `false`. Disabled queue messages are acknowledged without dispatch so an old handoff cannot revive retired automation. This is independent defense in depth in addition to the existing inactive-agent state and canonical-runtime controls.
- **Verified locally:** Forge Command's 106 Node tests pass. A Wrangler `--dry-run` bundles the Worker successfully (192.28 KiB upload / 45.71 KiB gzip) and exposes the legacy enablement flag as `false`; no deployment, trigger change, remote queue acknowledgement, D1/R2 mutation, credential access, agent execution, email, or Slack action occurred.

## 2026-07-16 public-copy and newsletter-provider evidence boundary

- **Implemented locally:** removed unsupported personal-use assertions from affiliate disclosure, guide and About-page copy. Clear affiliate identification remains; regression coverage rejects the old claims. This does not establish active affiliate-program membership, product accuracy, link placement or FTC/counsel sufficiency.
- **Verified read-only:** the existing Kit hosted URL renders name and email fields, a Subscribe control, and an unsubscribe-at-any-time notice. No personal data was entered or submitted. This narrow observation does not prove consent records, confirmation/redirect behavior, unsubscribe processing, suppression, delivery failures, provider configuration or a live newsletter program.
- **Implemented locally:** newsletter/disclosure copy now describes the hosted-provider boundary honestly and requires controlled proof that future marketing sends are suppressed before delivery activation; suppression is distinct from deletion. The public-policy contract and focused newsletter, consent, affiliate and service-promise tests pass. Provider/counsel validation and customer-journey evidence remain release gates.

## 2026-07-16 release-evidence refresh

- **Verified locally:** the release packet records the current 101-file / 539-test unit suite, 10-file / 42-test disposable-D1 integration suite, and coverage of 70.00% statements, 61.46% branches, 70.87% functions and 73.54% lines. Its structural verifier passes while retaining all 14 operational gates as unpassed. The public-policy verifier and direct generated production-manifest verifier also pass after the public-copy changes.
- **Verified locally:** the refreshed exact production build completed in 1 minute 31 seconds and its generated deployment manifest passed. The PowerShell wrapper reported a nonzero status solely because Astro wrote a deprecation warning to stderr; the build log contains both `Complete!` and the successful manifest-verification message. No deployment, migration, provider call, account change, or customer-data mutation occurred.

## 2026-07-17 isolated staging execution

- **Executed with explicit approval:** created an isolated staging directory D1, loaded three fictional fixture organizations/programs and ZIP centroids, and changed the staging Worker binding so it cannot reach the production `activity-radar` database or production photos bucket. The staging Worker version `4e71310b-e3a5-4ca7-8200-346e4cf4946c` is live at `https://parent-coach-desk-staging.eepskalla.workers.dev`; all customer/commerce feature flags remain false.
- **Executed with explicit approval:** operations migrations `0015` through `0022` now run on the dedicated staging operations D1. Its pre-migration 8,128-byte SQL export has SHA-256 `c997e44c27437c2aa6f4025e83f1188e7a08333e380caccef8d17ddbf29fc5bc` and restored successfully into a separate recovery D1 with the pre-migration ledger and clean foreign keys. A synthetic R2 probe restored between isolated staging and recovery buckets with matching SHA-256 `0dbe86b818d4b7781e841406723e5b8943b4f147ef3873e8398c8d27b7acd625`.
- **Executed with explicit approval:** the current post-migration staging operations export (33,122 bytes; SHA-256 `a8fe330d119903c57ec259bdc83e10dcdaa0a9d4a93e3dd1e55fe69dd43bae96`) restored into another isolated staging recovery D1. It contains the expected `0011` through `0022` migration ledger and has a clean foreign-key check. This is stronger staging recovery evidence, but does not stand in for a representative production restore drill.
- **Verified staging/read-only:** public monitor checks for home, directory, privacy, terms, health and readiness all returned 200. A GET-only probe found all 37 protected routes redirect to Cloudflare Access. Populated fixture directory reflow has zero page overflow at 320/360/390/430px; fixture detail reflow passes at 320px portrait and 568px landscape, and sport/league/full/ZIP filtering plus detail navigation were exercised. Browser zoom, screen reader, real-touch, reliable keyboard activation, constrained-network, completed form/subscription/payment and authenticated-identity journeys remain pending.
- **Provider/access limit:** the staging Worker has no secret names configured. The available Cloudflare OAuth token lacks an Access-management scope, so WorkOS/email/payment setup, Access-policy export, and allowed/denied authenticated probes have not been performed. No production deployment, production migration, customer identity activation, payment, email, marketing send, or legal/insurance action occurred.

## 2026-07-17 integration-suite execution correction

- **Fixed and verified locally:** the default Vitest fork pool could exit a disposable-D1/Miniflare worker unexpectedly, while the command process incorrectly returned success after only 9 of 10 integration files and 34 of 42 tests. The integration configuration now uses one deterministic worker thread with file parallelism disabled. A normal `npm run test:integration` completes 10 files / 42 tests, and the test-engineering contract verifies this setting. This corrects local CI evidence only; it does not close any external release gate.

## 2026-07-17 local release and shared-runtime verification refresh

- **Verified locally:** the PCD unit suite completes 102 files / 541 tests at 70.00% statements, 61.46% branches, 70.87% functions and 73.54% lines. The PCD integration suite completes 10 files / 42 tests with no unhandled worker error. Astro diagnostics, generated production deployment-manifest verification, public-policy validation and current-tree plus Git-history secret scanning pass. The optional Open Graph generator correctly falls back to committed assets because this Windows environment has no `python3`; it is not a generated-artifact proof.
- **Verified locally:** the PCD Business OS validator reports 43 numbered/indexed documents and 36 SOPs with no failures; the reusable production-quality validator reports all 15 required sections with no failures.
- **Verified locally, no deployment:** Forge Command's 106 Node tests pass. An elevated `wrangler deploy --dry-run` bundles the Worker (192.28 KiB / 45.71 KiB gzip) with `LEGACY_AGENT_RUNTIME_ENABLED=false` and the expected Durable Object, queue, D1, R2 and rate-limit bindings. A non-elevated dry-run was blocked only by the local filesystem sandbox's Wrangler log-file path; it was not a Worker build failure.

## 2026-07-17 complete staging-resource isolation candidate

- **Corrected locally and dry-run validated:** the older live staging Worker kept a writable `FORGE_DB` binding to the shared Forge Command database. Although its staging features had no secret and were default-off, that was not full resource isolation. The replacement candidate removes this binding. Its generated deployment manifest and Wrangler dry-run expose only the dedicated staging directory and PCD operations D1 databases, dedicated staging photo bucket, staging session namespace, assets, and rate limiters.
- **Executed with explicit approval and verified read-only:** staging version `b2264767-b54b-4a20-938a-aba59f715ff3` is now live at `https://parent-coach-desk-staging.eepskalla.workers.dev`. The Worker application allowlist is exactly `eepskalla@gmail.com` and `jeffthomas4@gmail.com`; all customer and commerce flags remain false and the Worker has no configured secret names. A fresh public monitor returned six 200 responses, and all 37 protected admin routes returned redacted `302` redirects to Cloudflare Access. This verifies application configuration and anonymous protection, not the Cloudflare Access policy's allowed/denied identity rules; available OAuth still lacks Access-management scope.

## 2026-07-17 release-verification refresh

- **Verified locally:** the unit suite completes 102 files / 542 tests at 70.00% statements, 61.46% branches, 70.87% functions and 73.54% lines; the single-threaded disposable-D1 integration suite completes 10 files / 44 tests. Astro diagnostics, public-policy validation, current-tree plus Git-history secret scanning, release-evidence structure validation, and an exact non-deploying production build/manifest validation pass. The production manifest preserves the two-email application administrator allowlist and safe feature defaults.
- **Verified locally:** the reusable production-quality standard validates all 15 required sections; the PCD Business OS binder validates 43 indexed documents and 36 SOPs. The legal packet remains explicitly internal counsel-review drafts and the standards/binder do not represent customer launch approval.
- **Mobile-proof limitation:** an attempted staging browser check requested a 320px viewport, but the browser surface reported a 1280px layout despite the override. It is not counted as new 320px evidence. The existing staged rendered fixture evidence remains narrower than a full mobile, assistive-technology, constrained-network and completed-customer-journey proof.

## 2026-07-17 fail-closed administrator allowlist correction

- **Implemented and staging deployed with explicit approval:** `requireAdmin` no longer has a hardcoded legacy administrator fallback. Missing or blank `ADMIN_EMAILS` is now a `503` deployment configuration error; a signature-verified identity is authorized only when it is in the explicit two-address application allowlist. Focused tests prove missing-list failure and denial of the former address; the full unit suite is 102 files / 546 tests at 61.53% branch coverage. The exact production manifest passes, but this source correction has not been deployed to production.
- **Verified staging/read-only:** version `4ff8371d-d460-4652-9eb3-c37d4d2e0b9c` is live with the isolated staging bindings, no configured secret names, the two-email `ADMIN_EMAILS` value, and all customer/commerce flags false. The six public monitor checks returned 200 and all 37 protected routes redirect anonymously to Cloudflare Access. This does not prove the live Access policy's allowed/denied identity set or authorize a production deploy.

## 2026-07-17 production operational database provisioned

- **Executed with explicit approval:** created empty dedicated D1 `parent-coach-desk-ops-production` (`b38d5f37-54df-4e0f-9706-023edc12c7fe`) in WNAM. Read-only inspection immediately after creation found zero tables, zero reads/writes and 12.3 kB of platform metadata. The source production configuration now declares `PCD_OPS_DB` with the isolated operational migration directory; it has not been deployed, migrated or used by the production Worker. No customer data or existing production database was changed. Evidence: `coordination/release-evidence/production-pcd-ops-provisioning-2026-07-17.json`.
# 2026-07-18 - human-gated social distribution contract

- **Implemented locally:** the existing Pinterest draft-and-stage pattern now has an executable release contract. It requires one governed first-party HTTPS link per staged pin, Pinterest/social/campaign attribution, an explicit human publication gate, and the documented prohibitions on account creation and auto-posting. It rejects credential material and executable publication calls.
- **Verified locally:** the current five-pin seasonal queue passes the contract and its focused Vitest suite passes 1 file / 3 tests. The check is included in `ci:release`.
- **External boundary preserved:** no social account was created, no credential was accessed, and no post was published or scheduled.
# 2026-07-18 - overnight completion audit and final validation

- **Verified locally:** after all overnight slices, the full Vitest suite passes 139 files / 749 tests. Astro diagnostics complete with 0 errors, 0 warnings, and 356 existing non-blocking hints.
- **Reconciled:** `coordination/BUILD-PLAN-COMPLETION-AUDIT-2026-07-18.md` maps the pasted brief, the Codex build plan, and the 24-month business plan into implemented/verified, awaiting runtime evidence, and Jeff/external-gated categories. It records D1 as the verified generated-manifest path and D2 as Cloudflare-cron ownership with GitHub manual-only diagnostics.
- **Claim boundary:** the bounded local overnight build is complete. Production deployment, secrets/provider actions, authenticated Access proof, multi-day/multi-deployment clocks, and 24-month business outcomes are not represented as complete.
# 2026-07-18 - exhaustive root ownership registry

- **Implemented locally:** all 85 tracked root documents, spreadsheets, CSVs, and text artifacts are classified exactly once as current authority, current business input, active work queue, historical/superseded, or generated/diagnostic. The registry check fails on new unclassified root artifacts, duplicate classifications, and stale entries, and is included in `ci:release`.
- **Verified locally:** the exhaustive current registry passes and its focused contract test passes 1 file / 1 test.
- **Organization boundary:** classification makes ownership and future migrations safe; it does not silently move referenced legacy files or delete user scratch outputs. Existing unrelated `buildout/hit-rate-test/out` changes, `body.json`, and `worker-cron/schema/` remain untouched.
# 2026-07-18 - public camp verification methodology

- **Implemented locally:** `/camps/verification/` now explains the Parent Coach Approved concept through the existing public `Verified` badge: minimum evidence, recorded review date, explicit non-endorsement limits, freshness triggers, moderated correction/removal workflow, and commercial separation. Directory badges and verified detail pages link to the methodology.
- **Verified locally:** focused camp methodology, truthfulness, and verification-governance coverage passes 3 files / 10 tests. The regenerated route-control inventory classifies the new page as public, cacheable, read-only HTML. The post-change full suite passes 141 files / 752 tests; Astro diagnostics complete with 0 errors, 0 warnings, and 356 existing hints.
- **Claim boundary:** this documents and exposes the existing governed verification workflow. It does not assert inspection, accreditation, safety, quality, provider identity proof, or live deployment.
# 2026-07-18 - evidence-backed operations dashboard expansion

- **Implemented locally:** the protected read-only operations dashboard now exposes verified-listing coverage, distinct cited source domains, oldest/latest recorded verification review, and an explicit evidence-based confidence basis. Trust metrics now include resolved correction cases, corrections actually applied, and the latest correction resolution time.
- **Verified locally:** focused operations and failure-isolation coverage passes 2 files / 9 tests; Astro diagnostics complete with 0 errors, 0 warnings, and 356 existing hints.
- **Claim boundary:** metrics are computed from directory and protected trust records. No public unexplained confidence score was added, no correction content or requester identity is exposed, and no remote database was queried or changed.
# 2026-07-18 - trusted relationship research registry

- **Implemented locally:** a protected, read-only relationship workspace now distinguishes public-source research candidates from actual relationships. The versioned registry requires HTTPS evidence, blocks relationship claims before an active stage, blocks contact attempts without human outreach approval, enforces inert do-not-contact state, and rejects direct email/phone/credential fields.
- **Current honest state:** two existing first-party source references (Little League International and NCAA) are classified as unreviewed research candidates. Both show zero outreach approval, zero contact attempts, and zero claimed active relationships.
- **Verified locally and live/read-only:** the protected-route contract covers 38 routes; focused relationship, protected-route, and generated route-inventory coverage passes 2 files / 7 tests; Astro diagnostics complete with 0 errors, 0 warnings, and 356 existing hints. A fresh anonymous GET-only production probe returned the expected redacted Cloudflare Access 302 for all 38 routes, including `/admin/relationships`; authenticated allow/deny proof remains pending.
- **External boundary:** no relationship, endorsement, contact identity, outreach draft, message, account, or external mutation was created.
# 2026-07-18 - single deployment authority and legacy-guide retirement

- **Implemented locally:** `DEPLOY.md` is now a short historical compatibility pointer instead of an executable Pages guide. Obsolete Pages setup, deploy-hook revival, direct local release steps, repository reinitialization, and the dangerous `.git` deletion instruction are removed. It points operators to the protected Worker runbook, workflow, current state, approval matrix, and recovery evidence.
- **Verified locally:** the deployment-authority contract proves the workflow uses one immutable SHA on `main`, protected `staging`/`production` Environments, SHA-addressed artifacts, the verified generated manifest, non-cancelling production concurrency, and `--keep-vars`; it rejects Pages commands and broad Git staging. Focused deployment/root tests pass 2 files / 3 tests, all four workflows remain commit-pinned, and all 85 root artifacts remain classified.
- **External boundary:** the workflow is built but no GitHub Environment, credential, workflow run, deployment, secret, binding, or Cloudflare resource was changed.
# 2026-07-18 - production Access completeness gate

- **Implemented locally:** normal CI still accepts a structurally valid pending authenticated Access packet, but the protected production deployment job now runs a stricter completeness mode after Environment approval and before artifact download/deploy. Production cannot deploy until the exported policy and all allowed/denied authenticated route probes are complete.
- **Verified locally:** focused CLI, evidence-validator, and deployment-authority coverage passes 3 files / 7 tests. Current evidence reports the policy complete and authenticated probes pending; the normal check passes and the production-only mode fails closed as intended. All workflow actions remain commit-pinned. The post-change full suite passes 144 files / 759 tests.
- **External boundary:** no identity, cookie, token, GitHub Environment, workflow, or deployment was accessed or changed. Jeff-controlled allowed/denied identity evidence remains the explicit blocker.
# 2026-07-18 - declarative production secret preservation

- **Implemented locally:** production now declares exactly four required runtime secret names (`AGENT_RUNS_TOKEN`, `BULK_IMPORT_TOKEN`, `CRON_KEY`, `GITHUB_TOKEN`) through Wrangler's value-free `secrets.required` contract. Wrangler validates presence before deploy; the generated production-manifest verifier independently rejects missing, extra, or changed names. Staging remains intentionally secret-optional.
- **Verified locally:** focused deployment-authority and manifest coverage passes 2 files / 6 tests. An exact non-deploying production build preserved the required-secret declaration in the generated manifest and passed the production manifest verifier.
- **External boundary:** secret values were not read, printed, changed, or stored. This control prevents a deploy with missing names; the first approved CI deployment still needs a before/after operational receipt.
# 2026-07-18 - durable post-deploy smoke evidence

- **Implemented locally:** staging and production smoke checks now cover homepage HTML, the camp directory, `/api/health`, `/api/ready`, a static asset, the non-mutating `HEAD /api/agent-runs` boundary, and the production Access redirect. Checks use only GET/HEAD and produce sanitized JSON receipts that retain no credentials or redirect locations.
- **Workflow evidence:** successful staging receipts are retained for 30 days and production receipts for 90 days under SHA-addressed artifact names. Missing receipts fail the job; all upload actions remain commit-pinned.
- **Verified locally:** focused smoke and deployment-workflow coverage passes 2 files / 6 tests, including staging's intentional token-absent 503 and failure on unsafe origins or unhealthy responses. The first full-suite attempt passed 144 files but failed overall when one Vitest fork exited unexpectedly; an immediate clean rerun passed 145 files / 763 tests. The failed attempt is retained in the evidence narrative rather than hidden.
- **External boundary:** this builds the evidence mechanism; it does not claim any deployment or post-deploy health observation occurred.
# 2026-07-18 - local backup proving clock reconciled

- **Corrected from current evidence:** `scripts/BACKUP-PROVING-LOG.md` contains six positive activity-radar export runs across three separate local dates: July 15, 16, and 17. The local export proving clock is satisfied and no longer belongs in the pending list.
- **Implemented locally:** a release check parses the append-only table, requires positive artifact size/attempt/retained-backup evidence, contiguous run numbering, and at least three distinct clean dates. Focused coverage passes 1 file / 2 tests and the check is part of `ci:release`.
- **Remaining boundary:** this does not satisfy the independent immutable offsite gate, multi-database/R2 recovery scope, separate-verifier retrieval, or offsite restore proof. Those remain pending and owner/provider gated.
# 2026-07-18 - exact-artifact static asset proof

- **Implemented locally:** each staging and production build now selects a non-empty content-hashed Astro CSS/JS asset and records its exact path, byte length, SHA-256, and Git SHA alongside the immutable artifact. Post-deploy smoke fetches that exact path and fails unless status, length, and content hash match.
- **Version-skew boundary:** the normal workflow remains a full deployment. Gradual or mixed-version traffic is explicitly prohibited until a separate asset-skew design and rehearsal are approved.
- **Verified locally:** focused asset-selector, deployment-smoke, and workflow-authority coverage passes 3 files / 8 tests; the complete suite passes 147 files / 767 tests; the workflow remains fully action-pinned. The selector ran against the actual current production build and produced a 149,794-byte hashed JS proof in temporary local storage. No remote fetch or deployment occurred.
# 2026-07-18 - scheduled-task reconciliation and final review handoff

- **Implemented locally:** the placeholder scheduled-task reconciliation now enumerates all ten PCD-owned callers from the authoritative operating-manual inventory, maps each to its committed skill contract, records maintenance behavior, and leaves every unobserved runtime receipt explicitly pending. Portfolio and Worker-cron tasks are separated from PCD scheduled-task callers.
- **Verified locally:** the focused inventory contract passes 1 file / 2 tests and prevents a return to the placeholder or manufactured start/finish/failure evidence. The first full-suite attempt failed overall after one Vitest worker exited unexpectedly despite 147 files completing; an immediate clean rerun passed 148 files / 769 tests.
- **Handoff:** `coordination/handoffs/2026-07-18-overnight-build-handoff.md` separates verified local work, runtime-evidence gaps, owner/external gates, and the next ten highest-value tasks, with specific Claude review questions.
- **External boundary:** no scheduled-task prompt, cadence, secret, run, registry row, or external system was read or changed. The recorded live inventory is repository evidence dated 2026-07-15 and must be refreshed against the external scheduler before runtime rollout.
# 2026-07-18 - current developer entrypoint reconciliation

- **Implemented locally:** `README.md` now presents the canonical directory map instead of an explicitly obsolete tree, points every release statement to the protected Worker workflow, documents the hosted Kit boundary without the removed email-logging fallback, and keeps Markdown as the sole current editorial authority unless a reviewed Sanity cutover occurs.
- **Verified locally:** the focused entrypoint contract passes 1 file / 2 tests; the complete suite passes 149 files / 771 tests.
- **Organization boundary:** retained historical plans and inactive tooling remain discoverable under the repository structure policy; this change removes misleading instructions without deleting historical evidence or activating any external system.
# 2026-07-18 - coherent structured-data entity graph

- **Implemented locally:** Organization, WebSite, anonymous editorial author, gated Person, shared Article, main Article layout, and team-parent Article markup now use stable absolute `@id` values. Publisher and anonymous author references resolve to the one canonical Organization node instead of creating disconnected lookalike entities. The existing November Person reveal remains default-off and emits no personal identity today.
- **Verified locally:** focused schema and HowTo coverage passes 2 files / 6 tests; Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints; the real production build completes; emitted homepage and article HTML contain the expected canonical graph identifiers. The complete suite passes 150 files / 774 tests.
- **Semantic boundary:** existing Article, FAQPage, HowTo, BreadcrumbList, Organization, WebSite, and gated Person types were inventoried before this change. No new schema type was added to a page whose visible content does not support it, and no author identity was revealed.
# 2026-07-18 - emitted public internal-link integrity

- **Implemented locally:** six public links were repaired from retired phase paths to their actual article routes; Wrestling is now part of the canonical sport-hub taxonomy; and the shared Lacrosse rules page links to both supported boys and girls hubs instead of a nonexistent generic hub. A deterministic emitted-HTML checker now fails the release contract on unresolved root-relative public links while naming the separately owned camps, trust, redirect, media, and API runtime surfaces. Protected future-content previews are excluded because their public routes intentionally do not exist before publication.
- **Verified locally:** focused checker and schema coverage passes 2 files / 6 tests; the real production build completes and `check:built-links` passes against the emitted public artifact; the complete suite passes 151 files / 777 tests.
- **Evidence boundary:** this proves internal targets in the local production artifact. It does not replace the live sitemap/redirect crawl, the GSC Not Found export, or post-deploy HTTP evidence for runtime-owned routes.
# 2026-07-18 - exhaustive top-level directory ownership

- **Implemented locally:** all 36 tracked top-level directories now have exactly one operational classification: product runtime, independently deployed runtime, data lineage/fixtures, tests/quality evidence, operations/governance, business/editorial/reporting, or inactive/historical. The same release check that governs 85 root artifacts now fails on an unclassified, duplicate, stale, invalid, or nested directory registry entry.
- **Verified locally:** `check:root-organization` passes with 85 artifacts and 36 directories classified; focused coverage passes 1 file / 2 tests; the complete suite passes 151 files / 778 tests.
- **Organization boundary:** generated and dependency directories with no tracked files are intentionally outside the registry. Classification does not activate inactive systems, validate report freshness, move legacy paths, or authorize deletion.
# 2026-07-18 - privacy-minimized camp directory demand analytics

- **Implemented locally:** the camp directory now emits debounced search/filter demand events through the existing governed `/api/search-event` boundary. Events contain only a sanitized query or generic filter label, result band, surface, collection, sport, and broad age selection. ZIP, coordinates, radius, state, IP address, referrer, and raw user agent are not included.
- **Verified locally:** focused privacy and endpoint coverage passes 2 files / 16 tests; Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints; the complete suite passes 152 files / 782 tests; and the real production build completes.
- **Runtime boundary:** collection remains default-off unless `DEMAND_TELEMETRY_ENABLED=true` with an explicit 1-90 day retention setting and the operations D1 binding. No migration was applied and no event was collected during this slice; live retention and reporting evidence remain pending.
# 2026-07-18 - explicit camp verification freshness

- **Implemented locally:** verified directory cards and detail pages now translate the recorded `last_verified_at` evidence into an explicit 90-day state: Review current, Review due, or Review date unavailable. The public methodology defines the policy and explains that a due badge records the earlier comparison rather than asserting the facts remain current.
- **Verified locally:** boundary tests cover the exact 90-day cutoff plus missing, invalid, future-dated, and unverified records; focused trust/freshness coverage passes 3 files / 11 tests; Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints; the complete suite passes 153 files / 785 tests; and the production build completes.
- **Truthfulness boundary:** freshness does not silently revoke a historical verification, invent a confidence score, imply safety or endorsement, or mutate directory data. Operational re-review and any automatic badge-expiry policy remain separate governed decisions.
# 2026-07-18 - operator-visible verification freshness backlog

- **Implemented locally:** the protected operations status now reports aggregate counts for current and due verification reviews and separately detects missing, invalid, and future-dated verification timestamps. Future or invalid evidence makes the directory-quality component fail instead of being counted as current.
- **Verified locally:** focused operations/freshness coverage passes 2 files / 11 tests; the complete suite passes 153 files / 786 tests; Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints.
- **Data boundary:** this is a read-only aggregate over the existing directory binding. It exposes no provider contact data, performs no automatic reverification or badge removal, and does not claim the production backlog has been observed until the protected dashboard runs against live D1.
# 2026-07-18 - continuous exact-duplicate candidate visibility

- **Implemented locally:** the protected directory-quality aggregate now reports excess approved records sharing the same normalized name, city, state, address, and session dates. Any candidate degrades the component and creates an operator-visible cleanup signal.
- **Verified locally:** focused operations coverage passes 1 file / 9 tests and the complete suite passes 153 files / 787 tests.
- **Safety boundary:** this is a conservative read-only candidate count, not proof that two programs are duplicates. It performs no merge, rejection, suppression, rank change, or deletion; an operator must inspect source evidence and distinct-session context before acting. Live candidate counts remain unobserved until the protected dashboard queries production D1.
# 2026-07-18 - consent-gated affiliate click intent

- **Implemented locally:** clicks on governed same-origin `/go/{slug}/` affiliate redirects now queue a GA4 `affiliate_outbound_click` event only after analytics consent and only while analytics is enabled. The event contains the allowlisted inventory slug and beacon transport hint; it excludes the retailer destination, link text, price, query/fragment data, and reader identifiers, and never delays navigation.
- **Verified locally:** focused affiliate privacy/inventory/disclosure coverage passes 3 files / 5 tests; Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints; and the production build completes. The first full-suite attempt failed overall when one Vitest worker exited unexpectedly after 153 of 154 files completed; an immediate clean rerun passed 154 files / 789 tests.
- **Runtime boundary:** no live click, retailer redirect, external analytics console, affiliate account, or conversion was exercised. DNT/GPC and consent denial retain the existing no-load/disable behavior; runtime receipt and aggregate reporting remain post-deploy evidence.
# 2026-07-18 - protected affiliate editorial snapshot

- **Implemented locally:** the existing authenticated admin desk now shows the release-gated affiliate inventory totals and the unreferenced destination candidates with slug, retailer, host, and campaign metadata. It imports the aggregate report rather than raw retailer URLs and clearly directs changes back through reviewed source files.
- **Verified locally:** focused workspace, inventory, protected-route, and route-control coverage passes 4 files / 10 tests; Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints; and the production build completes. Two complete-suite attempts ended with the recurring Vitest fork exit after 154 of 155 files; a verbose single-worker rerun completed all 155 files / 791 tests.
- **Safety boundary:** this is added to the already protected `/admin/` route, so it creates no new Access surface or stale live-probe claim. It has no POST/fetch action, contains no retailer destination URL, and cannot activate an affiliate account, change a destination, approve placement, or publish content.
# 2026-07-18 - governed Facebook group draft lane

- **Implemented locally:** the release-gated social-stage validator now governs both the existing five-pin Pinterest batch and a three-draft Facebook group-help batch. Facebook drafts require a stated group/thread fit, useful standalone copy, one first-party HTTPS link with Facebook/social/campaign attribution, and the same explicit human publication gate.
- **Verified locally:** focused multi-channel contract coverage passes 1 file / 4 tests; `check:social-stage` passes 5 Pinterest and 3 Facebook drafts with 8 governed links; and a verbose single-worker complete suite passes 155 files / 792 tests.
- **External boundary:** the Facebook file prohibits automated joins, scraping, direct messages, credentials, scheduling, auto-posting, concealed affiliation, and using child-safety/medical/legal situations for distribution. No account, group, member data, credential, post, message, or external request was created or accessed.
# 2026-07-18 - drift-proof authenticated Access runbook

- **Corrected from current evidence:** the authenticated Access runbook mixed stale 37-route instructions with the validator's current 38-route requirement. It now treats `automation/protected-route-contract.json` as the only count authority, requires one allowed and denied result per current route, and explicitly marks a dated anonymous receipt stale when its recorded count differs.
- **Verified locally:** focused runbook, evidence, CLI, and anonymous-probe coverage passes 4 files / 11 tests; the Access structure gate passes with policy complete and authenticated probes honestly pending; and the complete verbose single-worker suite passes 156 files / 794 tests.
- **External boundary:** no browser session, identity, cookie, token, Access policy, or live route was accessed. This prevents an operator from collecting a partial packet; it does not manufacture the still-pending authenticated allowed/denied observations.
# 2026-07-18 - machine-checkable agent token canary evidence

- **Implemented locally:** the agent-run rollout runbook now uses a redacted, versioned pending/complete/rolled-back evidence packet. Its expected caller set is derived from the current ten-task reconciliation inventory, and completion requires the allowlisted 204 preflight, Nora `weekly-gsc-review` start/finish/controlled-failure receipts, exact unique caller coverage, an evidence hash, and confirmation that the prior credential was revoked only after reconciliation.
- **Verified locally:** focused rollout, reconciliation, and caller coverage passes 3 files / 8 tests; the pending packet passes `check:agent-token-rollout`; the complete verbose single-worker suite passes 157 files / 797 tests; and Astro diagnostics report 0 errors, 0 warnings, and 356 existing hints.
- **External boundary:** the committed packet contains secret names but no secret values. No credential, scheduled-task store, canary run, registry row, deployment, or external system was read or changed. The live packet remains honestly pending until an approved operator performs and receipts the rollout.
# 2026-07-18 - detached deployment smoke receipt integrity

- **Implemented locally:** both protected deployment jobs now create a detached SHA-256 sidecar for the sanitized post-deploy smoke receipt, verify the sidecar before upload, and retain the receipt and checksum together. This extends the immutable build-artifact chain through the observation record itself.
- **Verified locally:** focused deployment-authority and smoke coverage passes 2 files / 6 tests, and the complete verbose single-worker suite passes 157 files / 797 tests. This does not claim a workflow ran, a deployment occurred, or a remote receipt exists.
