# Plan: Editorial opportunity lifecycle durable records (migration 0024)

**Plan ID:** 020
**Author:** Claude Code
**Date:** 2026-07-18
**Status:** Local design and rehearsal complete, code committed. Awaiting Jeff's approval to apply migration `0024_editorial_opportunity_lifecycle.sql` to the isolated staging PCD operational database. Production application is a separate, later gate per `migrations-pcd-ops/README.md`'s activation sequence and is not requested by this plan.

## Objective

Give the editorial content lifecycle (`strategy/EDITORIAL-CONTENT-LIFECYCLE.md`, `src/lib/editorial-lifecycle.ts`) durable, evidence-backed records instead of only an in-memory state machine and a legacy-corpus snapshot: opportunities, sources, briefs, claims, relationships, reviews, approvals, and maintenance proposals, all in the existing `PCD_OPS_DB` operational database lineage.

## Tier

3. New migration, new admin write surface, spans schema + lib + API + tests. Per the coordination protocol, "when in doubt, tier up," and a new migration is explicitly Tier 3 regardless of size.

## Business outcome

Once staged and later approved for production: an editor can create an opportunity from a real signal, score and classify it, record sources and validated claims, pass it through editorial and SEO review, map its internal relationships, classify its monetization/disclosure status, and get Jeff's recorded approval -- with every step backed by a durable, auditable D1 row instead of a spreadsheet or an unstated assumption. Nothing in this plan changes production today; it is groundwork.

## Current-state evidence

- **Verified in code:** `migrations-pcd-ops/` contains `0011` through `0023`, none applied to production (`migrations-pcd-ops/README.md`, current as of this plan's authorship). `0023` (affiliate lifecycle) is the most recent precedent for a large local-only design migration.
- **Verified in code:** `src/lib/editorial-lifecycle.ts` already defines `EDITORIAL_STATES`, `canTransition`, `approvalGates`, and `chooseCannibalizationDecision`. This plan's migration and lib layer enforce exactly that existing state machine against real rows; it does not redefine it.
- **Verified by tests:** `npm.cmd run report:editorial-lifecycle`, `npm.cmd run check:editorial-lifecycle`, and `vitest run tests/editorial-lifecycle.test.ts` all passed at the start of this session, confirming the 1,852-item legacy corpus snapshot and the state-machine unit tests were green before any change in this plan.
- **Not verified:** production `PCD_OPS_DB` migration state. `migrations-pcd-ops/README.md` records a 2026-07-17 read-only finding that production has migrations `0011`-`0022` pending (unapplied); this plan does not change that finding and does not apply anything remotely.

## Scope

- New migration `migrations-pcd-ops/0024_editorial_opportunity_lifecycle.sql`: `editorial_opportunities`, `editorial_lifecycle_events` (append-only), `editorial_sources`, `editorial_briefs`, `editorial_claims`, `editorial_claim_sources`, `editorial_relationships`, `editorial_reviews`, `editorial_approvals`, `editorial_maintenance_proposals`.
- New lib layer `src/lib/editorial-records.ts`: every state transition goes through `canTransition`/`approvalGates` from the existing `editorial-lifecycle.ts`; every write is a `db.batch` with an optimistic-concurrency `WHERE` guard plus an append-only event row, matching the `trust-cases.ts` pattern already in this repo.
- New provider-neutral opportunity-intake layer `src/lib/editorial-opportunity-intake.ts`: a write-time PII/URL/phone redaction gate (`sanitizeOpportunitySignal`) every signal must pass before storage, plus two adapters wired to real, already-in-repo, privacy-safe data (`demand_events_v1` aggregates and the public corrections log) and explicit `NotImplementedAdapterError` stubs for the remaining seven signal sources named in `editorial-governance.json`'s `opportunity_sources`.
- New authenticated admin routes under `src/pages/api/admin/editorial/{opportunities,sources,briefs,claims,reviews,relationships,approvals,maintenance}/`, gated by a new default-off flag `EDITORIAL_LIFECYCLE_ENABLED` (in addition to the existing Cloudflare Access + same-origin checks every admin route already requires).
- Unit tests for the intake sanitizer and every admin route's auth/origin/validation boundary; a disposable-D1 Miniflare integration test walking a full opportunity through the entire lifecycle including the evidence-gate failure and maintenance-proposal paths.

## Non-goals

- Does not apply the migration to staging or production. That is the next, separately approved step (see Human approval gates).
- Does not build the seven unimplemented opportunity-intake adapters (GSC, camp-gap, affiliate-gap, seasonal, newsletter, support, competitor, emerging-trend). Each needs its own data connection or provider credentials and is out of scope here.
- Does not reconcile any of the 1,852 legacy content items against the new evidence schema. That is a separate, later batch-reconciliation effort (see the corpus-reconciliation design note).
- Does not touch the deferred production trust migration packet (`0011`-`0014` trust tables) or any existing migration file.
- Does not publish, delete, redirect, or change any affiliate mapping. No admin route in this slice can do any of those things.

## Files likely affected

- `migrations-pcd-ops/0024_editorial_opportunity_lifecycle.sql` (new)
- `migrations-pcd-ops/README.md` (updated to describe `0024`)
- `src/lib/editorial-records.ts`, `src/lib/editorial-opportunity-intake.ts` (new)
- `src/pages/api/admin/editorial/{opportunities,sources,briefs,claims,reviews,relationships,approvals,maintenance}/*.ts` (new)
- `wrangler.jsonc`, `wrangler.production.jsonc` (new `EDITORIAL_LIFECYCLE_ENABLED: "false"` var)
- `scripts/check-deployment-manifest.mjs` (new flag added to the safe-default release gate)
- `test-classification.ts` (new integration test registered)
- `tests/editorial-records-migration.test.ts`, `tests/editorial-opportunity-intake.test.ts`, `tests/api/admin-editorial-*.test.ts` (new)

## Step-by-step implementation

1. Write migration `0024` following the `0023` structural conventions (TEXT primary keys, ISO-8601 TEXT timestamps, `CHECK`-enforced state enums and evidence gates, append-only event log). Done.
2. Write `editorial-records.ts` so every transition calls the existing `canTransition`/`approvalGates` functions rather than re-implementing the state machine. Done.
3. Write `editorial-opportunity-intake.ts` with the write-time sanitization gate and the two real adapters. Done.
4. Prove the migration applies cleanly to a fresh, isolated, local D1 (Miniflare) and that a full opportunity lifecycle -- including the evidence-gate rejection path and the propose-but-never-execute maintenance path -- behaves as designed. Done; see rehearsal evidence below.
5. Wire the eight admin routes behind Cloudflare Access, same-origin checks, and the new default-off flag. Done.
6. Add the flag to both wrangler configs and to the production-manifest safe-default gate so a production deploy fails closed if the flag were ever accidentally flipped. Done; `npm run check:production-manifest` passes with the flag at `"false"`.
7. **Awaiting approval:** apply `0024` to the isolated staging PCD operational database (`parent-coach-desk-ops-staging`) and re-run the staging rehearsal, mirroring the `2026-07-16 staging PCD operational database rehearsal` precedent in `CURRENT_STATE.md`.
8. **Awaiting approval, later:** exact-target review and explicit approval for the production migration range, per `migrations-pcd-ops/README.md`'s activation sequence. Not requested by this plan.

## Testing strategy

- `tests/editorial-records-migration.test.ts` (disposable D1 via Miniflare, registered in `test-classification.ts` as an integration test): applies every file in `migrations-pcd-ops/` including `0024`, asserts a clean `PRAGMA foreign_key_check`, and walks a full opportunity through discovery -> scoring -> classification -> brief -> claims -> sources -> claims-validated -> editorial review -> SEO review -> relationship mapping -> monetization classification -> human approval, plus the insufficient-evidence early-stop path, the missing-evidence-gate rejection path, and the propose/decide maintenance path (including the recorded fact that a retirement proposal never itself changes opportunity status -- only an explicit human decision does).
- `tests/editorial-opportunity-intake.test.ts`: sanitizer redaction/bounding/rejection cases, the two real adapters, and the seven unimplemented-adapter stubs.
- `tests/api/admin-editorial-*.test.ts` (9 files): every route's 401 (no Access identity), 403 (cross-origin), 404 (flag disabled by default), and validation-boundary behavior, plus the approvals route's evidence-gate 409 with the specific missing-gate list and the maintenance route's decision-authority checks.
- What cannot be tested here: live staging/production D1 behavior, and anything involving the seven unimplemented intake adapters, since they have no data source yet.

## Acceptance criteria

- `npx vitest run --config vitest.integration.config.ts tests/editorial-records-migration.test.ts` exits 0 (9/9 passing).
- `npx vitest run --config vitest.unit.config.ts tests/editorial-opportunity-intake.test.ts tests/api/admin-editorial-*.test.ts` exits 0 (77/77 passing across 13 files, including the 4 pre-existing `editorial-lifecycle.test.ts` cases).
- `npm run check:production-manifest` exits 0 with `EDITORIAL_LIFECYCLE_ENABLED` verified `"false"`.
- `npm.cmd run check:editorial-lifecycle` continues to exit 0 (this plan does not touch the legacy corpus snapshot).

## Human approval gates

- Applying `0024` to the isolated staging operational database (step 7 above).
- Any future production migration of `0024` (step 8 above) -- separate plan, exact-target review, per the existing activation sequence.
- Flipping `EDITORIAL_LIFECYCLE_ENABLED` to `true` anywhere.
- Building or credentialing any of the seven unimplemented intake adapters, especially any that calls an external provider (GSC, a competitor-observation source, a trend-scanning source).
- The eventual corpus-reconciliation batches against the 1,852-item legacy corpus (separate design note, pilot batch first).

## Open questions

- Should `editorial_sources`, `editorial_claims`, etc. eventually gain a foreign key to the actual `src/content/` markdown item (once a content piece exists) so the durable evidence record and the published page are provably linked? Not resolved here; today linkage is by `target_route`/`related_route` string fields, which is weaker than an ID reference. Flagging for a follow-up plan rather than solving it speculatively.
- Should the `editorial_maintenance_proposals` "retire" path eventually get its own `retirement_proposed` state in `EDITORIAL_STATES` (in `src/lib/editorial-lifecycle.ts`) so a proposed-but-undecided retirement is visible on the opportunity record itself, rather than only in the `editorial_maintenance_proposals` table? Today it deliberately does not change opportunity status until decided, per this plan's Non-goals ("automation may propose but never execute"). This is a defensible modeling choice but not the only one; Jeff's call if the desk workflow wants it surfaced differently.

---

## Dependencies

None beyond the already-provisioned `PCD_OPS_DB` binding (staging: `parent-coach-desk-ops-staging`; production: `parent-coach-desk-ops-production`, empty).

## Architecture and data flow

Signal (adapter, still mostly unimplemented) -> `sanitizeOpportunitySignal` (write-time PII/URL/phone redaction gate) -> `createOpportunity` -> staff-driven `scoreOpportunity`/`classifyOpportunity`/`createBrief`/`addSource`/`addClaim`/`validateClaim`/`advanceOpportunityToClaimsValidated`/`beginReview`/`recordReview`/`mapRelationship`/`markRelationshipMappingComplete`/`classifyMonetization`/`recordHumanApproval` -> every transition writes one guarded row update plus one append-only `editorial_lifecycle_events` row in the same `db.batch`. Nothing in this chain writes to `src/content/`, GitHub, or any published surface.

## Data model or migration changes

See Scope above for the full table list. No collision with the legacy `migrations/` lineage's duplicate `0009` prefix -- this migration lives only in `migrations-pcd-ops/`, which the repository's CI contract already keeps separate from `migrations/`.

## Security and privacy requirements

Pre-Launch Security Gate item 2 (no client-side database access): every write goes through an Access-protected admin route backed by `requireAdmin`, matching every other `PCD_OPS_DB` route in this repo. Item 6 (server-side validation): every route re-validates its input against the same allowed-value lists as the lib layer, not just client-side. Item 11 (no leaked errors): route error responses return the lib layer's typed error message (e.g. "opportunity not found," "invalid opportunity transition") and never a raw exception or stack trace.

## Failure modes

- A route call with a stale expected state (e.g. two staff members classifying the same opportunity at once) gets a 409 with a specific message ("opportunity changed concurrently") from the optimistic-concurrency `WHERE` guard, not a silent double-write.
- A human-approval attempt missing any evidence gate gets a 409 naming exactly which gates are missing (`EvidenceGateError.missing`), never a generic 500.
- If `PCD_OPS_DB` is unbound, every route returns 503 before touching `requireAdmin`.

## Edge cases

- A source attached directly to a brief and also linked to one of that brief's claims is the same evidence, reached two ways; `countOpportunityEvidence` deduplicates via `UNION` so it is not double-counted toward the source-count evidence gate (this exact bug was caught and fixed by the integration test during this session).
- Retirement proposals require an `incoming_link_audit_ref` at propose time and never move the opportunity to `retired` except through the explicit, separate `decideMaintenanceProposal(decision: 'accepted')` call.

## Observability

Every state transition is visible in `editorial_lifecycle_events` (`entity_type`, `entity_id`, `from_state`, `to_state`, `reason_code`, `actor_ref`, `occurred_at`), queryable without a dashboard build. No dashboard page was added in this slice.

## Deployment plan

None yet. Migration `0024` is committed, local-only, and unapplied. See Human approval gates.

## Rollback plan

Nothing is deployed, so there is nothing to roll back yet. Once staging application is approved (step 7), rollback is: the migration only adds new tables (no `ALTER` of existing tables), so the staging database can be re-created from a pre-`0024` export if needed, following the same export/restore mechanics already proven for this operational database lineage (`coordination/release-evidence/staging-pcd-ops-rehearsal-2026-07-16.json`).
