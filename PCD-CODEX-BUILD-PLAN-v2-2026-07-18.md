# PCD Cloudflare Workers Revamp: Full Build Plan v2 (post-Codex)

**Date:** 2026-07-18
**Author:** Claude (orchestrator session, in Jeff's rules)
**Supersedes:** `PCD-CODEX-BUILD-PLAN-2026-07-18.md` (v1). v1's diagnosis stands. v1's plan was returned NO-GO by Codex on four stop-ship findings and a set of CI/CD corrections. This v2 folds all of them in.
**Governed by:** the Forge Command constitution and the ten named rules, `PCD-AI-OS/00-FOUNDATIONS.md`, subordinate to `PCD-OPERATING-MANUAL.md` (v1.5) and `PCD-AI-OS/08-roadmaps.md`. Those win on conflict. Nothing here overrides the HUMAN GATE, RED WALL, FAMILY FIREWALL, or maintenance mode.

## Changelog from v1 (what Codex changed)

Codex verdict: diagnosis PASS with a historical-causality caveat, plan NO-GO. Accepted in full. The deltas:

1. Production SOP reordered. v1 committed, deployed, then pushed, and used `git add -A`. Unsafe. Section 6.1 replaces it with review-first ordering and a separately labeled emergency path.
2. "Staging then promote" was a false model. Staging and production bake different config into different artifacts, so there is nothing to promote unchanged. Renamed to same-commit dual-target deployment. Section 6.2.
3. Production deploy must run inside a protected GitHub `production` Environment with the Cloudflare credential scoped into that environment, not repo-wide, bound to `github.sha`, `main` only. Section 6.3.
4. The existing CI is already strong (pinned actions, history secret scan, protected-route and policy contracts, release-evidence, rollback and recovery checks, production-manifest verification, integration tests, `astro check`). Preserve it. Do not replace it with a generic list. Section 6.4.
5. Deploy entrypoint is ambiguous: Astro generates `dist/server/wrangler.json` and a `.wrangler/deploy/config.json` redirect, and the repo already validates that generated manifest. The SOP must pick one entrypoint. Section 6.5, open decision D1.
6. Phase 0.2 needs a secure token-distribution design, not "use one canonical value." Never paste the shared secret into prompts or version-controlled skill files. Section 5, item 0.2.
7. Admin criteria corrected: Access 302 is already present on the live domain, and the "no LEGACY warning" test is stale because the code now fails closed. Section 3 and item 0.1.
8. Cron source and live disagree: the deployed `parent-coach-playbook-cron` (last modified 2026-07-15 22:38 UTC) predates the source cleanup (commit `21f282d`, 2026-07-16), so it still carries `DEPLOY_HOOK_URL`/`fireDeploy`. Independently confirmed from this session's `workers_list`. Keep the GitHub workflow as a gated manual diagnostic; deploy the reviewed cron revision. Section 6.6.
9. Added acceptance criteria across the board: rollback drill, post-deploy health set, DB backward-compatibility gate, a check that CI does not delete dashboard-managed secrets, observability version and SHA recording, static-asset version-skew handling, and idle-boundary maintenance-mode checks. Sections 6.7 and 8.
10. One stale doc string: `src/pages/admin/search-signals.astro:69` still tells developers to run `wrangler pages dev`; make it the Worker-local command. Section 5, item 0.5.

## What Codex is asked to do with v2

Re-review sections 5, 6, and 8, and confirm the four stop-ship findings are resolved. Rule on open decisions D1 and D2 in section 7. Do not build.

---

## 1. Verified current state (2026-07-18)

Unchanged from v1 except the corrections Codex supplied. Held to designed / built / running.

**Host.** Production is Worker `parent-coach-desk` (`1da317290bea4069b83f6df9c13b3c7a`), serving `parentcoachdesk.com`, 200 off that Worker. Cutover done. Pages project and `parent-coach-playbook` Worker are rollback only.

**Bindings on the live Worker.** `DB` (activity-radar), `FORGE_DB` (forge-command, bound 2026-07-18 00:35 UTC), `PCD_OPS_DB`, `PHOTOS` R2, `SESSION` KV, five rate limiters, and vars including `ADMIN_EMAILS` (`eepskalla@gmail.com,jeffthomas4@gmail.com`), `ACCESS_TEAM_DOMAIN` (`fieldforge.cloudflareaccess.com`), `ACCESS_AUD`. Access config is baked as vars.

**Secrets on the live Worker.** `AGENT_RUNS_TOKEN` (set this session), `BULK_IMPORT_TOKEN`, `CRON_KEY`, `GITHUB_TOKEN`.

**Access is attached to the live domain.** Codex confirmed `/admin` returns a Cloudflare Access 302 to the configured team domain and matching production audience. So Access attachment is done; the pending work is a real login, not the attachment.

**Stack.** Astro 7.0.9, `@astrojs/cloudflare` 14.1.3, Tailwind 4 (`@tailwindcss/vite`, v3-to-v4 landed), WorkOS AuthKit, Sentry, Vitest, Wrangler 4, custom entrypoint `src/worker.ts`.

**CI, as it actually exists (corrected).** The repo already runs, via `package.json` `check:*` scripts, pinned-action verification, history secret scanning, protected-route checks, public-policy and intake contracts, release-evidence validation, rollback-target and recovery-tabletop and failure-isolation checks, production-manifest verification, production-schema-compatibility, integration tests, and `astro check`. It does not yet deploy staging or production. v2 adds deploy, it does not replace these checks.

**Debt carried in, honestly.**
- `About Me/Deployments.md` still shows the old `wrangler pages deploy` command. Stale. Section 6.1.
- The deployed `parent-coach-playbook-cron` predates the source cleanup; live still fires the Pages deploy hook. Section 6.6.
- `.env` has a duplicated `OPENAI_API_KEY` with a stray fragment; the key is burned and unrotated.
- `src/pages/admin/search-signals.astro:69` tells devs to run `wrangler pages dev`.
- Nine deployed scheduled-task prompts still do not log through the endpoint.
- Backup proving log: one clean run of three.

---

## 2. The diagnosis (verified by Codex, PASS with caveat)

**Root cause.** Pre-cutover, on Cloudflare Pages, D1/R2/KV bindings populated the `cloudflare:workers` runtime env but secrets set with `wrangler pages secret put` did not surface there. On a real Worker, `wrangler secret put` populates that env normally. The residual 503 on `/api/agent-runs` was `AGENT_RUNS_TOKEN` absent on the new Worker (Pages secrets do not carry across a cutover).

**Fix.** Set `AGENT_RUNS_TOKEN` as a Worker secret. No redeploy needed; `FORGE_DB` was already bound and secrets take effect on next request.

**Proof, now with Codex's added evidence.**
- `POST /api/agent-runs` with a valid bearer returned `ok: true`, `status: success`, `run_id 0e6057af-...`.
- The row exists exactly once in live `forge-command`; `run_id` is the table PK (idempotent), so it is not a duplicate or cached write.
- A request with a deliberately invalid bearer returns 403, not 503. That independently proves the deployed Worker now sees `AGENT_RUNS_TOKEN`.

**The caveat, accepted.** The historical Pages mechanism cannot be independently replayed without mutating or reconstructing the retired Pages deployment. It is credible and consistent with all evidence, but what is conclusively verified is the Worker secret fix, not the old Pages behavior. Nobody should treat the historical explanation as reproduced.

**Residual `.slug`/Pages-shaped access check.** Codex found no active `context.env`, `runtime.env`, or `Astro.locals.runtime.env` access under `src`, `scripts`, `.github`, `worker-cron`, `worker-link-checker`. The one hit is the stale dev-instruction string above, not a runtime path.

---

## 3. Success test status

| Half | Test | Status |
|---|---|---|
| A | `POST /api/agent-runs` with bearer returns 200 and writes to FORGE_DB | **Pass**, proven live |
| B | `/admin` loads and authenticates a fully working dashboard | **Pending**, criteria corrected below |

Half B corrected acceptance (Access is already attached):
- Successful login by an allowlisted identity (`eepskalla@gmail.com` or `jeffthomas4@gmail.com`).
- Dashboard renders.
- A safe authenticated `/api/admin` read succeeds.
- A non-allowlisted identity is denied.
- Worker logs show no JWT rejection and no `ACCESS_TEAM_DOMAIN/ACCESS_AUD not set; refusing authentication` warning (the code fails closed; there is no legacy mode to warn about).

---

## 4. The Claude and Codex handoff protocol

Per 08-roadmaps section 3: Claude specs, Claude Code builds on a branch with tests, automated tests run, Codex reviews the diff against the spec, Claude addresses findings, `/web:commit-check` on the diff, Jeff approves the HUMAN GATE items, then merge, deploy to staging Worker, smoke test, promote to production.

Definition of done: deployable, tested, documented, recoverable, logged, gated, standard-clean. Miss one and it is in progress.

---

## 5. Phase 0: stabilize and make observable

**Done and proven:** the 296-page 500 fix (commit `6ec713b`), the cutover, `FORGE_DB` bound, `AGENT_RUNS_TOKEN` set and the run-log write path proven.

**Open items:**

| # | Work | Acceptance criteria | Verify |
|---|---|---|---|
| 0.1 | Admin login (success test half B) | The five corrected criteria in section 3 | Log in via Access as an allowlisted identity; `npx wrangler tail --config wrangler.production.jsonc` while loading `/admin` and hitting one `/api/admin` read; confirm a non-allowlisted identity is denied |
| 0.2 | Secure run-log token distribution, then point the nine prompts at their skill files | Each roster agent writes start and finish rows through the endpoint, using a token delivered securely, never in a prompt or a committed skill file | Section 5.1 design met; one-agent canary logs a row; then the rest |
| 0.3 | Backup proving clock | Three rows on three separate days in `scripts/BACKUP-PROVING-LOG.md` | Open the log |
| 0.4 | Correct `Deployments.md` to the chosen Worker deploy path | The parentcoachdesk block matches section 6, not `wrangler pages deploy` | Diff review |
| 0.5 | Doc and key cleanup | `.env` has one clean `OPENAI_API_KEY`, old key revoked; `search-signals.astro:69` uses the Worker-local dev command | Text search; the OpenAI dashboard shows the old key revoked |

### 5.1 Phase 0.2 secure token distribution (Codex requirement)

The token is a shared secret. Do not "just use one canonical value" in a way that lands it in a prompt or a committed skill file. Specify:
- **Store.** Which scheduled-task secret store holds the value, and that it is the single source.
- **Identity.** Which identity may read it at run time.
- **Rotation.** How a rotation updates both the callers and the Worker secret without logging plaintext, and who owns the cadence.
- **Preflight.** A redacted preflight each caller runs that distinguishes a 403 (bad or missing token) from success, without printing the token.
- **Canary.** One agent switches to the endpoint first and logs a clean row before any other caller changes. Only then roll the rest.

Skill files describe the bearer contract; they do not carry the value.

**Teaches.** Deploy pipeline, secrets and bindings, git discipline, secure credential distribution.
**Pillars.** Ops, Test, Security.
**Graduation.** Manual task inventory reconciles with what runs; Open Item 3 closes.

---

## 6. Platform: deploy pipeline and GitHub Actions CI/CD (rebuilt per Codex)

Phase 0.5. Hardens the floor before the feature phases stack on it.

### 6.1 Production deploy SOP, corrected ordering

The v1 order (commit, deploy, push, with `git add -A`) is retired. The normal path is review-first:

1. Clean-worktree check.
2. Build and test the exact SHA.
3. PR review and CI green.
4. Merge to `main` (this is the push).
5. Production Environment approval (the HUMAN GATE, section 6.3).
6. Deploy the approved SHA's already-built artifact (section 6.2).
7. Smoke test the post-deploy health set (section 6.7).
8. Record the Worker version id, the Git SHA, and the rollback target.

A separate, clearly labeled emergency manual SOP exists for when CI is down. It is not mixed into the normal path. It still requires the approval and the health set.

### 6.2 Same-commit dual-target deployment (not artifact promotion)

Staging and production are two different Worker configs with different bindings, databases, R2 buckets, Access audiences, vars, and build paths. Staging builds through `wrangler.jsonc`; production builds through `build-production.mjs` and `wrangler.production.jsonc`. A staging artifact therefore cannot be promoted unchanged.

CI proves, for one immutable Git SHA:
- both artifacts were built from that same SHA;
- each generated manifest matches its intended target;
- staging smoke tests passed for that SHA;
- the production deploy consumes the already-built production artifact for that same SHA, not a rebuild after approval;
- artifact and manifest hashes are recorded.

If literal immutable promotion is ever required, the architecture must stop baking environment config into different artifacts. That is a larger change and out of scope now.

### 6.3 Protected production Environment

The production deploy job references a protected GitHub `production` Environment. The Cloudflare production credential lives in that Environment, not as a repository-wide secret, so the job cannot receive it before approval. Restrict the Environment to `main`, disable administrator bypass where available, and confirm the repository plan supports required reviewers (GitHub notes plan and visibility limitations). Bind the deploy to `github.sha`, never a mutable branch head discovered after approval. Add workflow concurrency so only one production deploy runs at a time and an older queued run cannot overwrite a newer one.

### 6.4 Preserve the existing checks

CI keeps every current `check:*` gate. On PR and non-main push: fast unit tests, `astro check`, secret scan, protected-route and policy contracts, pinned-action check, release-evidence and rollback and recovery checks. Do not run `npm run build:production` on every branch; it is expensive and tests production config rather than the staging artifact. Reserve the full dual-target build for PR and `main`. Use `npm ci` and `npm exec wrangler`, never a floating global CLI; pin Node and Wrangler through the lockfile. Use commit-pinned third-party actions, matching the repo's existing policy. Consider adding `wrangler types --check` and a Worker startup validation if the custom Astro entrypoint supports it cleanly.

### 6.5 Deploy entrypoint decision (open decision D1)

Astro generates `dist/server/wrangler.json` and a `.wrangler/deploy/config.json` redirect, and the repo already validates the generated manifest (`check:production-manifest`, `deploy-staging-verified.mjs`). Wrangler supports the Worker-plus-static-assets shape declared in `wrangler.production.jsonc` (`main: ./src/worker.ts`, `assets.directory: ./dist`, `ASSETS`). But there are now two candidate entrypoints. The SOP must choose one and test it:
- **Preferred:** deploy the verified generated production manifest, mirroring what the staging verified script already does.
- **Alternative:** prove that deploying the root `wrangler.production.jsonc` produces a byte-identical effective manifest.

The `wrangler deploy --dry-run` runs after the build and manifest validation, immediately before the real deploy, with the exact same config and flags. Codex rules D1.

### 6.6 Reconcile the cron (gated)

The deployed `parent-coach-playbook-cron` predates the source cleanup, so live still contains `DEPLOY_HOOK_URL`/`fireDeploy`. The GitHub `camps-sweep-cron.yml` is now manual-only in source, so it is a gated diagnostic, not a scheduled competitor. Do not delete it. The gated action: deploy the already-reviewed cron Worker revision, then verify the active version id changed, only the Cloudflare cron schedule remains, the live Worker no longer calls the Pages hook, the next natural scheduled run records one durable attempt, and no manual production sweep was fired merely as a smoke test.

### 6.7 Deploy acceptance criteria (Codex additions)

- **Cloudflare token scope.** `Workers Scripts Write`, the specific account only, production token in the protected Environment, a separate staging-only token where Cloudflare scoping permits, no DNS, Pages, D1 data, R2 object, Access, or account-admin permissions. Document that Workers Script permissions are generally account-scoped, so a compromised token's blast radius is other Workers in the account. Name a rotation owner and cadence. A read-only preflight proves the token targets the intended account and Worker before any deploy.
- **Health set, post-deploy.** Homepage, one camp page, `/ready`, the Access redirect, an authenticated admin read, a static-asset load, and one non-mutating API path.
- **DB compatibility gate.** Block a production deploy unless migrations are backward-compatible with both the old and new Worker versions.
- **Secret preservation.** Assert CI deployment does not delete dashboard-managed runtime secrets or vars; check secret names after the first CI deploy.
- **Observability.** Record deployment version id and Git SHA; query error rates after deploy. Address static-asset version skew before any gradual rollout (mixed Worker versions can serve HTML and hashed assets from different versions).
- **Rollback drill.** Perform a staging rollback drill and record the exact command and version before enabling production CI. `versions list` is not a recovery test.

### 6.8 Graduation

Phase 0.5 is running only after three clean production deployments through the pipeline, one of which includes a rollback drill. Until then it is built, not running.

---

## 7. Open decisions for Jeff and Codex

- **D1 (Codex rules).** Deploy the generated production manifest, or prove the root config yields an identical manifest. Section 6.5.
- **D2 (Jeff's call).** Cron ownership: keep the Cloudflare Worker cron as the scheduler and the GitHub workflow as a gated manual diagnostic (Codex's recommendation), confirmed. Retire the Pages deploy hook either way.

---

## 8. Phases 1 through 8 (feature program)

Unchanged in substance from v1 and 08-roadmaps, with these Codex-driven corrections threaded in. All still **designed**, not built.

- **Phase 1 (shipping loop, keystone).** The Slack approve-to-publish path must speak in protected Worker deployment triggers, not Pages-style "deploy hook" language. Approve-to-publish is not considered designed until section 6 defines that protected trigger. Otherwise as v1: Approval Queue, `events` table, Access JWT signature verification.
- **Phase 2 (distribution).** As v1: Kit welcome automation and Friday Letter, per-article OG images, JSON-LD and 404-to-redirect fixer, one social channel on draft-and-stage.
- **Phase 3 (camp data quality and provenance).** As v1: provenance schema, URL-health sweep on the correct DB, submitter confirmations, scheduled backup after the clock closes. D1 identity already resolved (site reads `activity-radar`).
- **Phase 4 (affiliate integrity and revenue).** As v1.
- **Phase 5 (search, geography, public UX).** As v1.
- **Phase 6 (intelligence, analytics, AI gateway).** As v1.
- **Phase 7 (observability, security, DR).** As v1, now folding in the rollback drill, health set, and version-skew handling from section 6.7 as standing practice.
- **Phase 8 (Forge OS extraction, second brand).** As v1.

**Idle boundary, encoded (Codex).** No production workflow may remain capable of ungated automatic writes during August through November. The deployment and scheduler acceptance tests must include a maintenance-mode check, not just the S4 deletion watch exception. The one standing Act-class writer, org-discovery, stops for the season per the manual.

---

## 9. What never relaxes

Payments gated permanently. RED WALL and FAMILY FIREWALL, always. The S4 deletion and opt-out SLA runs year-round, exempt from CANARY.

---

## 10. Timing against the idle

Pre-August, realistic: Phase 0, the section 6 platform and CI/CD work, and the Phase 1 keystone. During the idle: report-only; the season and the Chain Reaction manuscript own the calendar. December forward: Phases 2 through 8, distribution first.

---

## 11. What Codex returns on v2

1. Confirm the four stop-ship findings are resolved in sections 5, 6, and 8.
2. Rule on D1 (deploy entrypoint).
3. Flag any remaining gap that would ship a Critical or move a live-downtime risk before it is proven. Do not build.
