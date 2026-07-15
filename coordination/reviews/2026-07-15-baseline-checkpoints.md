# Review: ParentCoachDesk baseline checkpoint implementation

**Reviewer:** Codex
**Date:** 2026-07-15
**Reviewed plan:** `coordination/plans/001-recover-trustworthy-repository-baseline.md`
**Reviewed handoff:** `coordination/handoffs/2026-07-15-plan-001-checkpoint-and-d1-inventory.md`
**Branch:** `migration/pages-to-workers-staging`
**Commit range:** `b02dce4..997d490`

## Executive result

**Changes Requested.** The checkpoint structure and local validation are sound, but the implementation is not deployment-ready. Admin authentication fails open when Access configuration is incomplete, and both Slack publishing paths contain defects that prevent the intended GitHub commit from succeeding reliably.

## Plan assessment

Plan 001 was correct to recover the baseline before review. Its major defect was procedural naming of Claude as implementer; Jeff explicitly reassigned implementation to Codex, with no change to the safety gates. The preservation strategy succeeded: the worktree is clean and the formerly mixed work is reviewable in bounded commits.

Plan 002 correctly established policy without manufacturing a no-op normalization commit. The retired PowerShell parsing defect was subsequently corrected in `997d490`.

## Blocking findings

### P0 — Admin authentication fails open when either Access variable is absent

**Files:** `src/lib/admin-auth.ts:109-128`; tests codify the fallback in `tests/api/admin-auth.test.ts`.

`requireAdmin()` verifies the Access JWT only when both `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are present. If either is absent, it trusts `Cf-Access-Authenticated-User-Email` directly or decodes an unsigned cookie. That means a missing or misspelled production variable silently restores the exact spoofing vulnerability this checkpoint claims to close. Logging a warning is not a security boundary.

This violates the repository's fail-closed security gate. Remove the legacy authorization path from production behavior. Missing verification configuration must return 503/401 and must never create an authenticated `AdminContext`. Local tests should use signed test JWTs or an explicit test-only seam that cannot ship enabled.

### P1 — Publishing targets a repository different from this checkout's configured remote

**File:** `src/lib/publish.ts:24`.

The library hardcodes `jeffthomas4-lab/parent-coach-desk`, while `origin` is `https://github.com/jeffthomas4-lab/parent-coach-playbook.git`. The GitHub Contents API calls will therefore read/write a different repository or return 404. The tests assert mocked URLs but never reconcile the constant with the actual deployment repository.

Use a required, validated environment setting or the confirmed canonical repository. Add a contract test asserting the configured repo used by both GET and PUT.

### P1 — Slack approvals supply an invalid Git committer email

**Files:** `src/pages/api/slack/actions.ts:133`, `src/lib/publish.ts:246`, `tests/api/slack-actions.test.ts:180`.

The Slack route sets `approvedBy` to `slack:<username-or-id>` and `publishDraft()` passes that value as `committer.email` to GitHub's Contents API. That is not an email address. The test explicitly expects the invalid value instead of modeling GitHub's validation, so the mocked workflow passes while the real PUT is expected to fail validation.

Separate the audit identity from Git author metadata. Use a configured valid bot email for `committer.email`, and retain the Slack user ID in the commit message or a distinct audit field.

## Important findings

### P1 — CANARY claims stronger enforcement than the system provides

**Files:** `src/lib/agent-runs.ts:188-251`; examples in `automation/agents/ed/SPEC.md`, `frida/SPEC.md`, and `nora/SPEC.md`.

CANARY updates `agent_registry.status` and tells Slack that the agent "will not run again." Several specifications explicitly say their underlying scheduled tasks keep firing as raw tasks until later wiring. The endpoint does not disable those schedules, and no repository code proves every scheduler checks `agent_registry` before doing work. For those tasks, the pause is advisory state, not an enforced kill switch.

Change the message and documentation immediately to state what was actually paused. Before calling this a kill switch, make the scheduler or orchestrator consult the registry before side effects, or have a separately authorized control plane disable the schedule.

### P2 — Production binding readiness is still unverified

`POST /api/agent-runs` correctly refuses writes without `FORGE_DB` and `AGENT_RUNS_TOKEN`, and verified admin mode requires the two Access variables. The root Wrangler file is staging-only, so local configuration cannot establish the production Pages bindings. This is an operational deploy blocker, not proof of a code defect. Read-only production configuration verification is required before deployment.

### P2 — Worker-to-site cron invocation uses public HTTP rather than a service binding

`worker-cron` calls the site sweep through `SWEEP_URL`. Current Cloudflare guidance prefers service bindings for Worker-to-Worker communication. The keyed public endpoint can work, but it adds public routing, duplicated-secret rotation, and failure modes a service binding avoids. Treat this as a follow-up architecture improvement, not a blocker for the current stabilization fix.

## Non-blocking improvements

- Generate Worker binding types from Wrangler configuration instead of maintaining hand-written `Env` interfaces where practical.
- Move compatibility dates forward deliberately with tests; `worker-cron` remains on `2025-04-01`.
- Add structured log objects for cron outcomes instead of only formatted strings.
- Add an integration-shaped GitHub Contents API test that validates repository, author metadata, and the 422 failure path.

## Security and privacy assessment

- **Admin fail-closed:** failed; blocking finding above.
- **D1/R2 browser exposure:** no new direct browser binding exposure found.
- **Bound parameters:** reviewed new D1 mutations use bound parameters.
- **Secrets in source/bundle:** no secret values found; names only.
- **Paid/outbound gates:** email defaults to stage and Slack publishing checks signature plus approver ID. The publishing implementation is broken, but no bypass of the human click was found.
- **Error leakage:** API responses generally return bounded generic errors; detailed provider/GitHub errors remain server-side.

## Migration and data assessment

No migration was added in this range. D-001 now correctly identifies autonomous D1 mutation classes. The backup script parses, but no real export or restore exercise is verified, so autonomous difficult-to-reconstruct/bulk writers do not yet satisfy the approved rollback gate.

## Tests and validation performed

| Command | Exit code | Result |
|---|---:|---|
| `npm.cmd test` | 0 | 27 files, 233 tests passed. |
| `npx.cmd tsc --noEmit -p tsconfig.verify.json` | 0 | Passed. |
| `npx.cmd tsc --noEmit -p worker-cron/tsconfig.json` | 0 | Passed. |
| `npm.cmd audit --audit-level=high` | 0 | Zero vulnerabilities. |
| `npm.cmd run check` | 1 | Four content-body errors, duplicate dynamic SSR route warning, 352 hints. |
| Windows PowerShell parser | 0 | All four reviewed PowerShell scripts parse after `997d490`. |

Passing unit tests do not clear the blocking findings: the tests encode the legacy auth fallback and invalid Slack committer value, and GitHub/production configuration is mocked.

## Unverified assumptions

- No production deployment or binding state was inspected.
- No real GitHub, Slack, Resend, Cloudflare Access, or deploy-hook request was sent.
- The canonical GitHub repository is inferred from the configured `origin`; confirm before fixing the publishing constant.
- Live scheduler behavior and whether each scheduled task reads `agent_registry` are not confirmed.

## Final disposition

**Changes Requested**

Do not deploy this checkpoint range until the three blocking findings are fixed and independently re-reviewed. Separately resolve the Astro route collision and four check errors before release readiness.
