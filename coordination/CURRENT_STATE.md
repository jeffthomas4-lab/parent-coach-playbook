# Current State

**Verified as of:** 2026-07-15
**Verified by:** Claude Code (initial evidence-based snapshot)
**Independent verification:** Performed by Codex for the Cloudflare and D1 recovery scope on 2026-07-15; other baseline claims remain scoped by their own evidence labels.

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
