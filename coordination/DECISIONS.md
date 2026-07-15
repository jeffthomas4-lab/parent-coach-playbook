# Architecture Decision Records

## Scope

This file records decisions that are not already governed elsewhere.

The Pre-Launch Security Gate and the Website Build Standard (workspace root, `About Me/`) already bind this repository. They govern fail-closed behavior, no client-side database access, no API keys in the frontend, server-side validation, security headers, rate limits on paid endpoints, Turnstile and CORS on public forms, non-leaking error messages, and mandatory human approval for outbound and destructive actions.

Those rules are already binding. They are not restated here and they are not "Proposed." Restating a rule creates a second copy that drifts from the first, and then neither is trusted. Where a decision below touches a gate item, it cites the gate rather than repeating it.

## Format

Each record carries: ID, Title, Status, Date, Context, Decision, Consequences, Alternatives considered, Approval.

Status is one of: **Proposed**, **Approved**, **Superseded**, **Rejected**.

Nothing here is Approved until Jeff says so explicitly. Neither agent may promote a decision to Approved on its own.

---

## D-001: Autonomous D1 mutations require rollback proportionate to the mutation

**Status:** Approved
**Date:** 2026-07-15

**Context.**

The executable writer inventory below is **Verified in code** as of 2026-07-15. Deployed or enabled state remains **Not verified** unless separately labeled; a Wrangler schedule proves configured intent, not a live deployment.

| Entrypoint and trigger | Bound database | Mutations | Gate and batch behavior | D-001 class |
|---|---|---|---|---|
| `POST /api/search-event` | `DB` | Append to `search_events` | Public HTTP; validates and bounds fields; one row per request. No human gate. | Append-only, discardable telemetry. |
| `POST /api/agent-runs` | `FORGE_DB` | Insert/upsert `agent_runs`; update `agent_registry.last_run_at`; CANARY may set registry status to `paused` | Requires `AGENT_RUNS_TOKEN`; one reported run per request. Pausing is automated except for exempt agents. | Run rows are append/reconstructible; registry updates are reconstructible control state. |
| `worker-link-checker/src/index.ts` scheduled daily at `0 9 * * *`, or manual HTTP | Worker `DB` | Insert/upsert and update `link_health` | Cron has no human gate; manual HTTP requires `ADMIN_API_KEY`; configured batch defaults to 50 and a 180-day rotation. | Reconstructible external-check results. |
| `workers-activity-radar/enrichment-worker.ts` scheduled hourly, or manual HTTP | `activity-radar` as `DB` | Insert/upsert `programs`; update `organizations`; update queue status/attempts in `camp_scan_queue` | Cron has no human gate; manual HTTP requires `RUN_KEY`; up to 20 pending queue rows per run; retries up to three. | Bulk, externally derived, difficult to reconstruct exactly. |
| `workers-activity-radar/yelp-worker.ts` scheduled daily at `0 3 * * *` | `activity-radar` as `DB` | Update organization Yelp/enrichment/status fields; insert `trust_signals` | No human gate in the scheduled handler; capped by `DAILY_LIMIT`; skips rows with an existing `yelp_id`. | Bulk, paid/external and difficult to reconstruct exactly. |
| `worker-cron` scheduled daily at `0 13 * * *` calls `POST /api/cron/camps-sweep` | Site `DB` through the HTTP endpoint | Updates program URL-health fields; bulk archives past-date approved camps by changing status to rejected | Endpoint requires matching `CRON_KEY`; up to 25 URL checks, then an uncapped date-based archive query. No human approval per run. `worker-cron` invokes but does not bind D1 directly. | URL health is reconstructible; stale archive is bulk/destructive status mutation. |
| Public/admin camp APIs through `src/lib/camps-db.ts` | Site `DB` | Inserts/updates submitters, organizations, programs, claims, suggestions, reviews, geocodes, domain quality and moderation fields | Public submission/review/suggestion routes validate inputs; admin mutations call `requireAdmin`; cron path is separately keyed. Human gate exists for admin moderation, not public intake or cron archive. | Mixed: append-only intake, curated human updates, and destructive/bulk cron status changes. |
| `buildout/hit-rate-test/import_results.py` | None directly | Generates SQL that updates organization website fields | Manual command creates SQL; no execution path is present in the script. Applying generated SQL is a separate, **Not verified** action. | Bulk if applied; generation alone is not a D1 mutation. |

`src/lib/publish.ts`, agent specification files, and the deploy-hook branch of `worker-cron` do not directly write D1 (**Verified in code**). They must not be labeled D1 writers merely because they participate in automation.

The backup script at `scripts/backup-activity-radar.ps1` now parses successfully under Windows PowerShell after checkpoint `e547357` (**Verified in code**). **Not verified:** that it has completed a real export, that three proving runs exist, or that any restore has been exercised. Therefore the autonomous enrichment, Yelp, and bulk stale-archive paths do not yet have the demonstrated rollback evidence this proposed decision would require.

The Pre-Launch Security Gate governs who may trigger an action. It does not govern whether a mutation can be undone. That is the gap this record fills.

**Decision.** Autonomous D1 mutations that are destructive, bulk, or difficult to reconstruct require a tested backup and rollback strategy proportionate to the mutation. Proportionate means:

| Mutation class | Requirement |
|---|---|
| Destructive (delete, overwrite of curated fields) or bulk (multi-row writes from an automated source) | Tested backup and a rollback exercised against a non-production target, result recorded in a handoff. |
| Difficult to reconstruct (data whose source is external, paid, or non-deterministic) | Tested backup. Rollback strategy documented and shown to work. |
| Append-only telemetry, reconstructible or discardable (for example `search_events`, `agent_runs`) | No restore exercise required. Rollback is deletion of the appended rows. |

Append-only telemetry does not require a full database restore exercise before operating. Requiring one would be ceremony that buys nothing, and a rule that costs more than it protects gets ignored, which then erodes the rules that matter.

**Consequences.** Bulk and destructive writers block until rollback is demonstrated. Telemetry ships freely. The tradeoff is that classifying a mutation becomes a judgment call, and the classification must be stated in the plan and dispositioned in the review rather than assumed.

**Alternatives considered.** A blanket restore requirement on every autonomous write. Rejected as disproportionate: it would gate `search_events` behind a database restore drill. No requirement, relying on the existing backup script. Rejected: an untested backup is an assumption, not a rollback path.

**Approval.** Approved by Jeff on 2026-07-15 after review of the traced writer inventory.

---

## D-002: Operational facts use structured records; prose may summarize but not govern

**Status:** Proposed
**Date:** 2026-07-15

**Context.** The repository contains multiple agent definitions (`automation/agents/ed`, `frida`, `nora`, and untracked `hal`, `ranger`, `sunny`, `vera`), an untracked `PCD-AI-OS/` directory, and seven untracked prose lane reports dated 2026-07-15 under `reports/` (**Verified in code**). A structured surface exists: `migrations/0010_search_events.sql`, `src/pages/api/agent-runs.ts`, and `tests/api/agent-runs.test.ts` (**Verified in code**).

**Not verified**: whether any agent currently reads a prose report as input.

Prose can be queried, diffed, reviewed, and tested for selected properties, but its meaning is less constrained than a purpose-built structured record. A consequential automated action taken solely on the basis of prose can silently inherit ambiguity or factual error. Prose is still the right medium for research, context, and human-facing summary, and a rule that bans it outright would throw away the part that works.

**Decision.** Operational facts, state transitions, measurements, approvals, and agent-control signals must use structured records. Prose may summarize structured records and provide contextual research. Prose may not silently override structured state, and may not be the sole source for a consequential automated action.

Concretely:

- Whether a camp was verified, when, and by whom: structured.
- Whether a run succeeded, what it touched, what it cost: structured.
- Whether Jeff approved something: structured.
- A signal that starts, stops, or redirects an agent: structured.
- A measurement any decision depends on: structured.
- A lane report explaining what the numbers mean and what to do about them: prose, welcome, and not authoritative.

Where prose and structured state disagree, structured state wins and the disagreement is surfaced rather than silently resolved.

**Consequences.** Agents that consume prose as fact need rework, once the inventory establishes which do. New agent work defines its structured record shape before it is built. Prose reporting continues unchanged for human consumption, which is most of what the current lane reports appear to be.

**Alternatives considered.** Blanket prohibition on prose inputs. Rejected as disproportionate: it bans contextual research alongside the actual hazard, and the hazard is prose driving consequential action, not prose existing. Allow prose inputs with a validation step. Rejected: validating prose requires exactly the judgment the validation is meant to supply.

**Approval.** Pending Jeff.

---

## D-003: Production state is never inferred from local documentation

**Status:** Proposed
**Date:** 2026-07-15

**Context.** This repository contains extensive planning and status documentation, including `PCD-OPERATING-MANUAL.md` (59KB), `PCD-AUTOMATION-BUILD-PLAN.md`, `STANDARD-AUDIT.md`, and the untracked `PCD-AUTOMATION-AUDIT-2026-07-14.md` (**Verified in code**). Documents describe deployments. Documents are also written before deployments, and survive after deployments are reverted.

The worker in `wrangler.jsonc` is named `parent-coach-desk-staging` and the branch is `migration/pages-to-workers-staging`, but what serves parentcoachdesk.com right now is **Not verified** from this repository.

**Decision.** No plan, review, or handoff may assert production state on the basis of a document in this repository. Claims about production carry the label **Documented as deployed** until checked against the running system, at which point they become **Confirmed live**. The two labels are never merged. Where a decision depends on production state, live verification is a prerequisite of the plan, not a step inside it.

**Consequences.** Some plans will block on verification Jeff must perform or authorize, since neither agent may reach production unattended. This is the intended cost.

**Alternatives considered.** Trust documentation that is recent enough. Rejected: recency is not accuracy, and the documents most likely to be wrong are the ones written in advance of the work.

**Approval.** Pending Jeff.

---

## D-004: In-repository instruction files

**Status:** Proposed
**Date:** 2026-07-15

**Context.** This repository contains neither `AGENTS.md` nor `CLAUDE.md` (**Verified in code**, 2026-07-15). The coordination setup task assumed both existed and asked which takes precedence. The question has no subject.

The only governance currently reaching this repository is the `CLAUDE.md` at the Cowork workspace root, which spans every project in the workspace rather than this one. Codex reads `AGENTS.md` by convention and would currently find nothing. This means the two agents in this protocol are operating from different, and in one case absent, instruction sources.

**Decision.** Deferred to Jeff. Per his instruction, neither agent creates, modifies, or points either file, and no precedence rule is established without his explicit decision. This record exists to surface the gap, not to close it.

The open questions for Jeff:

1. Should this repository carry its own instruction file at all, or continue inheriting workspace-root `CLAUDE.md`?
2. If yes, one file read by both agents, or one per agent?
3. If one per agent, which governs on conflict?

**Consequences.** Until this is decided, `coordination/README.md` is the only repository-local governance, and it was authored by Claude, one of the two agents it governs. That is a weakness worth naming: the rules of the protocol are currently written by a party to it.

**Alternatives considered.** None proposed. This record is a question for Jeff, not a recommendation from either agent.

**Approval.** Pending Jeff.
