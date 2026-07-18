# PCD Cloudflare Workers Revamp: Full Build Plan (Codex handoff)

**Date:** 2026-07-18
**Author:** Claude (orchestrator session, in Jeff's rules)
**For:** Codex, as the verify-and-review second set of eyes
**Governed by:** the Forge Command constitution and the ten named rules, `PCD-AI-OS/00-FOUNDATIONS.md`, and subordinate to `PCD-OPERATING-MANUAL.md` (v1.5) and `PCD-AI-OS/08-roadmaps.md`. Where any of those conflict with this file, they win. This document does not override the HUMAN GATE, the RED WALL, the FAMILY FIREWALL, or maintenance mode.

## What Codex is being asked to do

Two jobs, in order. Do not build.

1. **Verify the diagnosis** in section 2 against live Cloudflare and the repo. Confirm or refute the root cause and the fix, with evidence, not agreement.
2. **Review the plan** in sections 5 through 9 for gaps, wrong sequencing, missing acceptance criteria, and platform risk, especially the GitHub Actions CI/CD design in section 6. Flag anything that would ship a Critical or move a live-downtime risk before it is proven.

Return the two outputs named in section 10. Building is a later, separately-gated handoff.

## How to read this

The 08-roadmaps file already holds the phase program. This file does not replace it. It concretizes it around the platform revamp Jeff called: PCD now lives on a Cloudflare Worker instead of Pages, and the deploy path, CI, secrets, and observability get rebuilt to match. Everything here is held to the designed / built / running rule. A finished-looking table that implies more than shipped is itself a defect.

---

## 1. Verified current state (2026-07-18)

All of this was checked live this session, against Cloudflare and the running site, not inferred from docs. Two docs disagreed on the host (the Operating Manual v1.5 said the cutover was done; the 07-15 handoff said Pages). The live account settled it: the cutover is done.

**Host.** Production is Cloudflare Worker `parent-coach-desk` (worker id `1da317290bea4069b83f6df9c13b3c7a`), serving `parentcoachdesk.com`. The homepage returns 200 off that Worker. Pages project `parent-coach-playbook` and Worker `parent-coach-playbook` remain as rollback only.

**Bindings on the live Worker** (from `wrangler.production.jsonc`, and the deploy history confirms the D1 bindings were pushed 2026-07-18 00:35 to 00:36 UTC):
- `DB` -> `activity-radar` (`8cc3694a-26f8-4a56-b131-d5d3a68c49ef`)
- `FORGE_DB` -> `forge-command` (`747cf988-a557-48bd-9d03-bea09e184f94`), added to the live Worker 2026-07-18 00:35 UTC
- `PCD_OPS_DB` -> `parent-coach-desk-ops-production` (`b38d5f37-54df-4e0f-9706-023edc12c7fe`)
- `PHOTOS` R2 -> `activityradar-photos`
- `SESSION` KV -> `1e0eb975e7784b799ecedc05ab754096`
- five rate limiters (public submission, trust, community, demand, owner)
- `vars`: `SITE_URL`, `ADMIN_EMAILS` (`eepskalla@gmail.com,jeffthomas4@gmail.com`), `ACCESS_TEAM_DOMAIN` (`fieldforge.cloudflareaccess.com`), `ACCESS_AUD`, and seven feature flags all defaulting false. Access config is baked as vars, not secrets.

**Secrets on the live Worker** (`wrangler secret list --config wrangler.production.jsonc`, 2026-07-18): `BULK_IMPORT_TOKEN`, `CRON_KEY`, `GITHUB_TOKEN`, and `AGENT_RUNS_TOKEN` (set this session).

**Stack.** Astro 7.0.9, `@astrojs/cloudflare` 14.1.3, Tailwind 4 via `@tailwindcss/vite` (the v3 to v4 migration landed, `@astrojs/tailwind` is gone), WorkOS AuthKit, Sentry (`@sentry/cloudflare`), Vitest, Wrangler 4. Custom Worker entrypoint `src/worker.ts`.

**Configs.** `wrangler.production.jsonc` is the production Worker config (name `parent-coach-desk`). `wrangler.jsonc` is staging-only (name `parent-coach-desk-staging`, isolated D1/R2, never the production data). `npm run build:production` runs `scripts/build-production.mjs`, which sets `WRANGLER_CONFIG_PATH=wrangler.production.jsonc` so the production bindings and vars bake into `dist`. Plain `npm run build` bakes the staging config and must never ship to production.

**Related workers.** `parent-coach-desk-staging` (the migration proof Worker, live on `*.workers.dev`), `parent-coach-playbook` and `parent-coach-playbook-cron` (rollback and the camps-sweep cron; the cron still fires the old Pages deploy hook).

**Known debt carried into this plan, stated honestly:**
- `About Me/Deployments.md` still lists the old `npx wrangler pages deploy` command for this project. It is stale post-cutover and must be corrected (section 6). Do not deploy from it as written.
- `.env` carries a duplicated `OPENAI_API_KEY` with a stray key fragment on its own line. This is the burned-key thread from the 07-15 handoff, still in plaintext on disk. Cleanup item.
- Nine of the deployed scheduled-task prompts still run their own older text and do not log through the endpoint. Only Barnabus and Vera write rows today, and both write to `forge-command` D1 directly, not through the PCD Worker endpoint.
- The backup proving log has one clean run of three required.

---

## 2. The diagnosis to verify

**Symptom (Phase 0 blocker, pre-fix).** `POST /api/agent-runs` returned 503 (token absent) though a secret was in the store, while camp pages read `env.DB` fine. `/admin` was reported dead, the run log empty, the cron frozen. The working hypothesis was one root cause behind a cluster of audit findings: production secrets not reaching `import { env } from 'cloudflare:workers'`.

**Root cause, refined this session.** The symptom was a pre-cutover artifact. On the old Cloudflare Pages project, D1, R2, and KV bindings populated the `cloudflare:workers` runtime env, but secrets set with `wrangler pages secret put` did not surface there. That is why bindings worked and the token did not. Once production became a real Worker, secrets set with `wrangler secret put` populate that same runtime env normally. The residual 503 was simply that `AGENT_RUNS_TOKEN` had never been set on the new `parent-coach-desk` Worker (Pages secrets do not carry across to a Worker, and the cutover created a fresh secret store).

**Fix applied.** Set `AGENT_RUNS_TOKEN` as a Worker secret on `parent-coach-desk` via `wrangler secret put ... --config wrangler.production.jsonc`. No redeploy was needed: `FORGE_DB` was already bound (07-18 00:35) and Worker secrets take effect on the next request.

**Proof (live, this session).**
- `POST https://parentcoachdesk.com/api/agent-runs` with the bearer returned `ok: true`, `status: success`, `run_id 0e6057af-2836-4de8-99e9-6aadf4632778`. Not 503.
- Direct query against `forge-command` confirmed the row landed: `agent = manual-test`, `venture = parent-coach-desk`, `status = success`, `started/finished 2026-07-18T02:08:56`. The FORGE_DB write path is proven end to end.

**What Codex should independently check:**
1. That no runtime path still reads secrets the Pages way. Grep the app for any residual `wrangler pages`, `context.env` Pages-shaped access, or `runtime.env` patterns that the Astro 6+ migration should have removed (the migration brief's Card M3 claims all 38 were swapped to `import { env } from 'cloudflare:workers'`; confirm none regressed).
2. That the `manual-test` proof row is real and not a cached or duplicated write (`run_id` is a PK, idempotent).
3. That the token the roster callers will present (section 5, Phase 0) is planned to match the secret value, since there is no live PCD-endpoint caller today to have already fixed the value.
4. Whether the `manual-test` row should be deleted before it confuses Barnabus's briefing (it is a test artifact; deletion is Jeff's gate).

---

## 3. Success test status

Jeff's stated success test for the secret-injection fix has two halves.

| Half | Test | Status |
|---|---|---|
| A | `POST /api/agent-runs` with bearer returns 200 | **Pass**, proven live 2026-07-18 |
| B | `parentcoachdesk.com/admin` loads and authenticates as a fully working dashboard | **Pending** (Phase 0, item below) |

Half B depends on the Cloudflare Access app being attached to the live domain's `/admin` and `/api/admin` routes with a policy allowing one of the `ADMIN_EMAILS` identities (`eepskalla@gmail.com` or `jeffthomas4@gmail.com`, not `jeffthomas@pugetsound.edu`). The ACCESS vars are already baked into the production config, and the admin-auth code path was migrated, so the likely remaining work is the dashboard-side Access attachment plus a real login, verified against `wrangler tail` showing no `[admin-auth]` LEGACY or not-set warning.

---

## 4. The Claude and Codex handoff protocol

Per 08-roadmaps section 3, each capability runs this loop:

1. Claude writes the spec as a work item: goal, acceptance criteria, pillars in scope, known risks, the commands to verify.
2. Claude Code builds on a feature branch and writes the tests.
3. Automated tests run (Vitest unit and integration, Playwright where a page changed).
4. Codex reviews the diff against the spec, adds missing tests, flags defects, with full context.
5. Claude addresses findings. `/web:commit-check` runs on the diff.
6. Jeff approves anything the HUMAN GATE covers.
7. Merge, deploy to the staging Worker, smoke test, promote to production.

**Definition of done, global.** Deployable, tested, documented, recoverable, logged, gated, standard-clean. Seven words. Miss one and it is in progress, not done.

---

## 5. Phase 0: stabilize the live system and make it observable

**Status: mostly landed this session, four items open.** This is the floor. It depends on nothing.

**Done and proven.**
- The 296-page `session_end_date` 500 fixed and live (commit `6ec713b`).
- Pages to Workers cutover complete; production is Worker `parent-coach-desk`.
- `FORGE_DB` bound live.
- `AGENT_RUNS_TOKEN` set; `POST /api/agent-runs` returns 200 and writes to `forge-command` (section 2).

**Open items, each with an acceptance test:**

| # | Work | Acceptance criteria | Verify |
|---|---|---|---|
| 0.1 | Admin auth (success test half B) | `/admin` loads, authenticates an allowlisted identity, renders the dashboard, no LEGACY warning | Log in via Access; `npx wrangler tail --config wrangler.production.jsonc` shows no `[admin-auth]` warning while loading `/admin` |
| 0.2 | Point the nine deployed prompts at their version-controlled skill files | Each roster agent (`nora`, `ed`, `hal`, `ranger`, `frida`) writes a start and finish row to `agent_runs` through `POST /api/agent-runs` with the shared token | After each task fires (or a manual trigger), a row appears in `forge-command.agent_runs` for that agent |
| 0.3 | Backup proving clock | `scripts/BACKUP-PROVING-LOG.md` reads three rows on three separate days | Open the log; three distinct dates |
| 0.4 | Correct `Deployments.md` to the Worker deploy path | The parentcoachdesk block shows the Worker deploy, not `wrangler pages deploy` | Diff review; the command in section 6 is present |
| 0.5 | `.env` OpenAI key cleanup | No duplicated key, no stray fragment; the burned key rotated | Text search finds one clean entry; old key revoked at platform.openai.com |

**Teaches.** Deploy pipeline, secrets and bindings, git discipline, what governed-in-production actually requires.

**Pillars in scope.** Ops, Test, Security (admin auth path).

**Known risks.** Item 0.2 is the one with real stakes: the token in each deployed prompt must match the Worker secret exactly, or agents get 401. Establish one canonical value, store it where the scheduled-task runtime reads it, thread it into every caller in the same change.

**Graduation.** The manual's task inventory reconciles with what runs. Open Item 3 closes.

---

## 6. Platform: deploy pipeline and GitHub Actions CI/CD

This is the spine of the revamp Jeff named, and it does not have a clean home in the original 08-roadmaps because that file predates the completed cutover. Treat it as Phase 0.5: it hardens the floor before the feature phases stack on it.

**6.1 The corrected deploy SOP (pending Jeff's confirmation into `Deployments.md`).**

Production is a Worker now, so the deploy is `wrangler deploy`, not `wrangler pages deploy`. Derived from `wrangler.production.jsonc` and Operating Manual S2 (which already says "deploy Worker `parent-coach-desk` using the production config" and "`wrangler deploy --dry-run` against `wrangler.production.jsonc`"). Proposed canonical block, PowerShell:

```powershell
cd "$HOME\Desktop\Claude Cowork\Outputs\parent-coach-desk"
npm run build:production
npm test
npx wrangler deploy --config wrangler.production.jsonc --dry-run
git add -A
git commit -m "ONE-LINE SUMMARY OF WHAT CHANGED THIS SESSION"
npx wrangler deploy --config wrangler.production.jsonc
git push
```

Codex: confirm `--config wrangler.production.jsonc` is the right invocation for this repo's `build-production.mjs` flow, and that `wrangler deploy` uploads `dist` as the `ASSETS` binding correctly given `main: ./src/worker.ts`. Flag if the dry-run belongs before or after the build.

**6.2 GitHub Actions CI/CD, the target design.**

Today the deploy is a manual PowerShell paste. The revamp moves build, test, and staging deploy into CI, keeps production deploy gated.

- **On pull request and on push to any non-main branch:** install, `npm run build:production` (dry, to catch config bakes), `npm test` (Vitest unit and integration), `astro check`, `npm audit --audit-level=high`, and the repo's `check:*` scripts. No deploy.
- **On push to a feature branch tagged for staging:** deploy to `parent-coach-desk-staging` with `wrangler deploy` (staging config), smoke test the workers.dev URL.
- **On push to `main`:** build, test, then deploy to `parent-coach-desk` production. Production deploy runs inside a GitHub Environment with a required reviewer, so the HUMAN GATE is expressed as an environment approval rather than a habit. CI never promotes to production without Jeff's click.
- **Secrets in CI:** `CLOUDFLARE_API_TOKEN` (scoped to Workers Scripts edit and the specific account), `CLOUDFLARE_ACCOUNT_ID`. Worker runtime secrets (`AGENT_RUNS_TOKEN`, `GITHUB_TOKEN`, `CRON_KEY`, `BULK_IMPORT_TOKEN`) stay set on the Worker via `wrangler secret put`, never in CI, never in the repo.
- **Rollback:** `wrangler versions list` and `wrangler rollback` on `parent-coach-desk`; the `parent-coach-playbook` Pages project and Worker stay as the deeper rollback target until the Worker has run clean for a defined window.

**6.3 Reconcile the two camps-sweep schedulers.**

Both `.github/workflows/camps-sweep-cron.yml` and Worker `parent-coach-playbook-cron` hit the same production sweep endpoint, and the Worker cron also still fires the old Pages deploy hook. This is a live control defect named in the Operating Manual (3.2). Decision to make: keep the Cloudflare Worker cron (owns the deploy hook, needs no GitHub secret) and delete the GitHub workflow, or the reverse. Retire the obsolete Pages deploy hook either way. Do not invoke, disable, or change either scheduler without Jeff's explicit approval.

**Acceptance criteria.** A PR runs the full check suite and blocks on red. A merge to main builds, tests, and stops at a production approval gate. A staging push serves the change on `parent-coach-desk-staging`. One sweep scheduler remains, the Pages deploy hook is gone.

**Pillars in scope.** Ops, Test, Security (CI secret scoping).

**Known risks.** A CI `CLOUDFLARE_API_TOKEN` is a standing production credential; scope it minimally and rotate it on a schedule. An auto-deploy on main without the environment gate would silently break the HUMAN GATE; the gate is the whole point.

---

## 7. Phases 1 through 8 (the feature program)

Ordered by dependency, then by the distribution-is-the-constraint rule from 08-roadmaps. Each phase names its acceptance test and the gates it clears. Status is honest: everything below is **designed**, not built, except where noted. Only Phase 0 and the platform work above are in flight.

### Phase 1: the shipping loop (keystone, pre-August)

**Goal.** One Stage-class change becomes a shipped change on one approval, built once, correctly.

**Real work.** Slack approve-to-publish (a Slack action flips `draft: false`, commits the markdown to GitHub, fires the deploy hook); the Approval Queue as one queue with one card format (evidence, recommended action, confidence, one-tap approve or reject) across Slack and a Notion row; the `events` table and the first namespaced events (`pcd.editorial.draft_ready`, `pcd.editorial.published`); verify the Access JWT signature on the admin cookie path (closes the phase-2 auth debt).

**Acceptance.** A rules-watcher draft goes flagged to live on one Slack tap, with the commit on GitHub, a new deployment, and the outcome posted back to the thread. Admin auth runs the verified path, no LEGACY warning.

**Depends on.** Phase 0 (logging and secrets live) and the CI pipeline (section 6) for the deploy hook.

**Gates.** HUMAN GATE is the point: publication requires the tap. Security pillar re-audited (auth changed). QA happy and chaos path on publish.

### Phase 2: distribution wiring (the binding constraint)

**Goal.** Turn on the channels that move subscribers and traffic. Distribution is 10 percent built and it is the constraint, so this outranks deeper platform work.

**Real work.** Kit welcome automation delivering the 28-page guide and the six-email sequence, sender-domain verification, Friday Letter No. 1; per-article OG image generation through the imagegen skill and the Pillow card system; JSON-LD emission verified and a 404-to-redirect fixer that stages rules for approval; one social channel on draft-and-stage.

**Acceptance.** A new subscriber receives the guide automatically. The newsletter has a real issue history. Every new article ships a unique OG image. Crawled-not-indexed shrinks. One social channel posts on draft-and-stage.

**Gates.** Consent and privacy pillars. HUMAN GATE on every send. Amazon-links-in-email ban enforced.

### Phase 3: camp data quality and provenance

**Goal.** Make the directory trustworthy at the record level.

**Real work.** Confirm the live D1 identity (already verified this program: the site reads `activity-radar`, the legacy `parent-coach-playbook` DB is a dead snapshot; retirement is Jeff's gated delete); provenance on every time-sensitive claim (source, confidence, last-verified, method, recheck date, change history) with R2 holding the raw evidence capture; revive the URL-health sweep against the correct DB with loud failure; transactional email for submitter confirmations; backup on a schedule once the proving clock closes.

**Acceptance.** Every published camp claim has provenance and a recheck date. Failed verification makes uncertainty visible. One database. Submitters get a confirmation.

**Gates.** Privacy pillar and `DATA-MAP.md`. RED WALL and FAMILY FIREWALL on any child-adjacent data. Ranger's R3 write scope stays gated until backup and audit conditions hold.

### Phase 4: affiliate integrity and revenue tracking

**Goal.** Make the money layer correct and measured.

**Real work.** Confirm `/what-to-buy/` runs the current build; verify one `/go/` link lands on the merchant with the tag intact end to end; stage link swaps as approvals; record clicks and conversions per link, article, merchant for a first revenue-per-content number; check FTC disclosures on every guide.

**Acceptance.** Every `/go/` link verified live with tag. Link swaps flow through approval. Revenue-per-article exists as a number. Disclosures pass.

**Gates.** Legal pillar. HUMAN GATE on link changes at scale. Payments never move autonomously, permanently.

### Phase 5: search, geography, public experience

**Goal.** The one thing a directory can do that an AI summary cannot: verified, filterable, local, current.

**Real work.** D1-backed search with normalized fields and filters (location, distance, activity, age, date, day or overnight, price, registration status, verified status); geohash or equivalent, precomputed city, county, metro relationships, geocoding cached; the parent query experience on verified data with visible verification dates.

**Acceptance.** A parent can filter to verified, open, nearby camps by age and date, and see when each was last checked. Latency and relevance measured.

**Gates.** Accessibility pillar (filters, results, keyboard, screen reader). UI pillar. QA emotion check with the parent personas.

### Phase 6: intelligence, analytics, experiments

**Goal.** Give the company memory and a feedback loop.

**Real work.** The AI gateway (no workflow calls a model directly; the gateway decides tier, cache, budget; Level 0 code before any paid call); no-result search analysis, content-opportunity scoring, coverage gaps feeding the editorial and directory queues; GA4 wired into a workflow; the "What Changed Overnight" briefing; the first tracked experiment.

**Acceptance.** The morning briefing lands daily. One experiment has a result. GA4 feeds one real decision. Every AI call routes through the gateway with a per-day budget cap.

**Gates.** Privacy pillar. Intelligence store honors the FAMILY FIREWALL. Prompt-injection defenses on any agent reading fetched web text.

### Phase 7: observability, security hardening, disaster recovery

**Goal.** Make the whole thing survivable and auditable.

**Real work.** Uptime and synthetic monitoring on the live URLs; Sentry (already wired in the stack) tuned; a backup restore test actually run; OWASP top ten review, rate limits on paid endpoints (five limiters already exist), Turnstile and CORS on public forms, non-leaking errors, dependency scanning and Dependabot; audit logs and a data-retention policy.

**Acceptance.** A restore has been performed and logged. Every paid endpoint is rate-limited. Uptime alerting fires on a real outage in a test. Ops, Security, Test pillars pass with no open Critical.

**Gates.** Security and Ops pillars, full. Incident runbook updated.

### Phase 8: Forge OS extraction and the second brand

**Goal.** Only after a pattern has worked twice inside PCD, lift it into a reusable package and prove a second brand stands on it.

**Real work.** Extract the proven shared modules (run log and registry, approval queue, event bus, AI gateway, observability, security baseline) into brand-neutral packages; brand configuration and tenant boundaries with separate secrets, data, access; stand up the second brand (LegisRadar, per the priority stack) on the shared spine.

**Acceptance.** A second brand runs a real workflow on the shared packages. PCD gets the feature first; Forge OS receives the reusable abstraction after it has worked twice.

**Gates.** Every pillar, per brand. Separate secrets, separate data, separate access.

---

## 8. What never relaxes (through every phase, forever)

1. **Payments.** Money movement stays gated permanently. No confidence score buys autonomy.
2. **RED WALL and FAMILY FIREWALL.** Recruits, players, children, families route to Jeff only. Their data never enters drafts, logs, briefings, or the intelligence store.
3. **Deletions and the S4 legal clock.** The 30-day deletion and opt-out SLA runs year-round, through the idle, exempt from CANARY.

---

## 9. Timing against the idle

It is 2026-07-18. PCD idles August through November (report-only, no writes, no build; the S4 deletion watch is the only exception).

- **Pre-August, realistic:** Phase 0, the platform CI/CD work (section 6), and the Phase 1 keystone. That is the highest-value pre-idle work: it stops the silent burn and builds the pathway everything reuses.
- **During the idle:** report-only. The season and the Chain Reaction manuscript own the calendar.
- **December forward:** Phases 2 through 8 in order, distribution first.

Do not compress the feature phases against the idle.

---

## 10. What Codex returns

1. **Diagnosis verdict.** Confirmed or refuted, with the evidence you ran. Specifically address the four independent checks in section 2. If confirmed, say what else in the "cluster of audit findings" the fix does and does not resolve.
2. **Plan review.** Gaps, wrong sequencing, missing acceptance criteria, and platform risk. Give the GitHub Actions CI/CD design in section 6 a real critique: token scoping, the production approval gate, the two-scheduler reconciliation, and whether staging-then-promote is wired correctly for a repo whose production and staging are two different Worker configs. Name anything that would ship a Critical or move a live-downtime risk before it is proven.

Do not build. The build is a later handoff, one capability at a time, per section 4.
