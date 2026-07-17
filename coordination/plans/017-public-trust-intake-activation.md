# Plan: Public trust-intake activation

**Plan ID:** 017
**Author:** Codex
**Date:** 2026-07-17
**Status:** Production read-only preflight complete; awaiting recovery coverage, rehearsal, and exact production-write/feature-activation approval
**Tier:** 3

## Objective

Enable the public correction, removal, privacy, copyright, accessibility, and safety-concern request form only after its dedicated operational database, spam controls, human review workflow, notification receipt, and recovery path have been proved. Replace the current email-only fallback with a durable, privacy-bounded intake path without permitting automatic directory changes or outbound replies.

## Verified current state

- `src/pages/trust.astro` contains the complete public form, prefilled trusted PCD URL/category support, a honeypot, browser-generated idempotency key, field limits, and an email fallback. It renders the fallback because `TRUST_INTAKE_ENABLED` is false.
- The production browser currently renders the safety notice, explicit sensitive-data warning, and `support@parentcoachdesk.com` fallback. It has no enabled form, so the correction/removal journey does not yet satisfy the structured-intake requirement.
- `src/pages/api/trust/request.ts` is default-off, requires `PCD_OPS_DB`, enforces request-size/origin protections and rate limiting, validates only `parentcoachdesk.com` target URLs, writes an idempotent `trust_cases` record, and enqueues a notification. It never changes a directory listing itself.
- Unit tests cover enabled/disabled behavior, validation, honeypot, and idempotency. The migration lineage includes the trust-case and idempotency schema but requires exact-target review before any remote application.
- The current production Worker declares `PCD_OPS_DB`. A 2026-07-17 read-only preflight proved that its exact production database exists in WNAM, has only the `d1_migrations` ledger, and has all migrations `0011` through `0022` pending. The trust and notification tables are absent; no customer operational data was read. The live `/trust/` page renders the email fallback with zero forms. See `coordination/release-evidence/production-pcd-ops-preflight-2026-07-17.json`.

## Non-goals

- No automatic correction, removal, suppression activation, public publishing, response sending, or data deletion.
- No collection of child, medical, payment, government-ID, or attachment data.
- No production migration, feature-flag enablement, public test submission, notification delivery, or operator account/Access change without the explicit approvals below.
- Do not replace the email fallback until the structured path proves durable and its operator receipt is working.

## Activation sequence

1. **Read-only production preflight.** Verify the `PCD_OPS_DB` binding, database identifier, applied migration ledger, required `trust_*` and `notification_outbox` tables/indexes, and zero/non-zero case count as aggregate metadata only. Verify the live Worker still exposes `TRUST_INTAKE_ENABLED=false` before any change.
2. **Recovery and retention preflight.** Before the production write path opens, record which immutable offsite backup batch covers `PCD_OPS_DB`, how a trust case is retrieved/restored, retention/deletion ownership, and the incident response owner. Plan 016 must provide the independent backup path; a local or same-account copy is insufficient.
3. **Isolated staging rehearsal.** Use the already-isolated operational staging database only after confirming it is not shared with production. Apply/rehearse the exact trust migrations if absent, submit one synthetic non-personal test request, verify duplicate replay, rate limit, honeypot, operator queue visibility, and no automatic external delivery or directory mutation.
4. **Human review readiness.** Verify the protected admin trust queue can list a case, create a response draft, require a separate human approval, and leave delivery disabled. Define named on-call ownership and SLA handling for urgent privacy/copyright/safety requests.
5. **Notification receipt rehearsal.** Run one separately authorized synthetic staging case notification to the configured administrator paths. Confirm provider delivery and human acknowledgement. Do not treat an accepted HTTP response as a receipt.
6. **Production migration/change request.** Prepare the exact database ID, migration range/hash, pre-backup identifier, rollback constraints, expected schema precondition, observation window, and feature flag change. A mismatch aborts before any write.
7. **Production enablement.** After Jeff approves the exact request, apply only the reviewed migration range if needed, verify schema, deploy the reviewed `TRUST_INTAKE_ENABLED=true` change with no other config changes, and use `--keep-vars --strict`.
8. **Production synthetic proof.** Submit one Jeff-approved, non-personal synthetic request with a unique idempotency key. Verify it creates exactly one case and one outbox record, does not alter directory data, appears in the protected queue, and is acknowledged by an operator. Do not send a reply unless separately approved.
9. **Post-enable monitoring.** Observe public GET behavior, public request failures/abuse signals, queue aging, rate-limit responses, notification receipts, and no unintended directory writes for the agreed window. Keep feature flag rollback and email fallback runbook available.

## Acceptance criteria

- The request form is visible only when the dedicated database schema and public-write controls are proved ready.
- Every submission has server-side validation, same-origin/size defense, rate limiting, honeypot protection, payload-bound idempotency, and a durable audit/outbox record.
- A public request never changes a camp listing or sends an outbound response automatically.
- The human operator queue and response-draft approval boundary are reachable only through protected administration.
- The synthetic proof records exactly one case and one notification event, with no customer information in Git/chat/evidence.
- Independent recovery, notification receipt, retention owner, and escalation timing are documented before production enablement.
- The email fallback remains available and visible if the feature is disabled or the public intake endpoint becomes unavailable.

## Required verification

| Area | Evidence |
|---|---|
| Schema | Read-only migration/table/index inventory and exact-target precondition |
| Boundary | Focused unit and integration tests for disabled, origin, size, validation, rate limit, honeypot, and idempotency behavior |
| Staging | One synthetic record, replay, zero directory writes, protected queue visibility, no external reply |
| Notification | Provider/channel receipt plus named human acknowledgement |
| Production | Explicit approval, backup/recovery identifier, feature-flag deployment receipt, one approved synthetic proof, aggregate-only post-observation |
| Rollback | Disable flag/deploy known Worker rollback; no automatic deletion of submitted requests |

## Human approvals required

1. Read-only inventory of the live `PCD_OPS_DB` migration/schema state if a Cloudflare credential prompt or production query is needed.
2. Staging synthetic request and notification rehearsal.
3. Immutable offsite backup/retrieval coverage for the operational database under Plan 016.
4. Exact production database migration (if any), deployment of `TRUST_INTAKE_ENABLED=true`, and one synthetic production request. The approval must name the database ID, migration range, backup identifier, expected precondition, observation period, and test payload class.
5. Counsel or a designated policy owner review of privacy/copyright/removal handling, retention, deletion, and urgent safety-request escalation before public activation.

## Rollback

If the public form causes unsafe writes, abuse, missing operator visibility, or a notification failure, deploy the reviewed false flag immediately. Preserve submitted records for the approved retention/incident process; do not delete or silently suppress them. Return the page to the email fallback, investigate from aggregate evidence, and require a new approval before re-enabling.
