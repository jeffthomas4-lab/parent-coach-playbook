# Production ops migration change request — Plan 017 `migration_approval` gate

**DRAFT — prepared by Claude Code for the `migration_approval` gate; pending Jeff approval + Codex review. Not an authorization.**

**Change request ID:** CR-018
**Author:** Claude Code
**Date:** 2026-07-17
**Governs:** `coordination/release-evidence/rc01.json` gate `migration_approval`. Implements activation-sequence steps 6-9 of `coordination/plans/017-public-trust-intake-activation.md`.

**Reviewed commit SHA:** `<REVIEWED_SHA — fill at approval; worktree not yet committed>`

This is the **only** source revision authorized for this change request. Section 8's execution commands, the migration files enumerated in Section 3, and the deploy performed in Step C must all resolve to this exact commit SHA. No other commit, branch, tag, stash, or uncommitted worktree state may be used to execute Section 9 — if the working tree does not exactly match this SHA at execution time, stop and re-issue this request against the actual reviewed revision.

## 1. Purpose

This is the exact production change request referenced by the Launch Authorization Matrix row `migration_approval` / Plan 017: apply migrations `0011`-`0022` to the named production `PCD_OPS_DB` and deploy `TRUST_INTAKE_ENABLED=true`, and no other change. It names the database, the migration range, the precondition, the prerequisites, the rollback constraints, the observation window, and the single synthetic proof, so Jeff can approve or reject the exact bounded scope in one written reply per the matrix's approval-boundary rule.

## 2. Target database

- Binding: `PCD_OPS_DB`
- Database name: `parent-coach-desk-ops-production`
- Database id: `b38d5f37-54df-4e0f-9706-023edc12c7fe`
- Region: WNAM
- Config file: `wrangler.production.jsonc` (production commands must name this file; `wrangler.jsonc` is staging-only)

This database is bound only through `PCD_OPS_DB`. It is never the `DB` binding (`activity-radar`, id `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`) or `FORGE_DB` (`forge-command`, id `747cf988-a557-48bd-9d03-bea09e184f94`). Any command that does not name `parent-coach-desk-ops-production` / `b38d5f37-54df-4e0f-9706-023edc12c7fe` explicitly is out of scope of this request and must not run.

## 3. Exact migration range

Apply exactly the following twelve files, in order, from `migrations-pcd-ops/`, no more and no fewer. The SHA-256 column is the pinned content hash of each file as reviewed for this change request — it is the second half of the enforcement boundary (Section 3a) alongside the file list itself.

| Seq | File | SHA-256 |
|---|---|---|
| 0011 | `0011_trust_cases.sql` | `801c953eda851c37d7a53139d236d37976c73f52e7e585a5a6de340e243b5a32` |
| 0012 | `0012_trust_drafts_and_notification_outbox.sql` | `54f6f37dd0853347ebd6991f2cb6a897395009ac3aa16e3ee61ac4a964cb8178` |
| 0013 | `0013_demand_events_v1.sql` | `5102ed56cb8afc1caec33c90ecb841e4106c5a3ca77b3fef4424527f3cf09084` |
| 0014 | `0014_trust_intake_idempotency.sql` | `51e335e7c9410d0547b0f32be3687056f5e1789d5f47ebf0767880988642cb70` |
| 0015 | `0015_privacy_request_lifecycle.sql` | `6368f88d74becee44d0b327d59f5ecff5587e21ea2131805d0bde88fc08a573b` |
| 0016 | `0016_customer_identity_and_tenancy.sql` | `477437d257db67beef947a99f9b8e8963a956cdd06615bc4dc2f6194c4640cc0` |
| 0017 | `0017_owner_claims_and_proposed_edits.sql` | `3622db40859094d116795ec534fd1f1438bd7ad530a39fbb2210a3fb94950da2` |
| 0018 | `0018_customer_invitations_and_recovery.sql` | `53a192374a504b4e8a0f671ece3181c9dea78844a248d3a75b4e0f03a2bd8121` |
| 0019 | `0019_owner_workflow_hardening.sql` | `825e4c54458f7ccd5575616472c3ee1b7ef94edbf1e40f0b60746cf0716b13d9` |
| 0020 | `0020_recovery_and_dispute_audit.sql` | `9b0015601d73c33980704a55dfd8a66f60739d00ef0a2bca7c608e8c2de2fc74` |
| 0021 | `0021_privacy_execution_evidence.sql` | `3ccc34479b797d79f17753abb6cf1f463d6e459dbda23db3810ba3b8f6838e73` |
| 0022 | `0022_commerce_test_mode_ledger.sql` | `964d6e43153495a1ea586643722ab1a29d01ce30f6cedd15c6f39ca9761b2257` |

Computed 2026-07-17 via `sha256sum migrations-pcd-ops/00{11..22}_*.sql`. If any file's content changes for any reason before execution, its hash changes, the enforcement script in Section 3a fails closed, and this change request must be re-issued against the new hashes — an updated hash is never silently accepted.

This request authorizes the **schema application only**. It does not authorize enabling any feature flag beyond `TRUST_INTAKE_ENABLED` (Section 8). Migrations `0016`-`0020` and `0022` lay down schema for customer identity/tenancy, owner claims, invitations, and commerce test mode; the features those tables serve (`PCD_CUSTOMER_FOUNDATION_ENABLED`, `CAMP_CLAIMS_ENABLED`, `CAMP_REVIEWS_ENABLED`, `PCD_COMMERCE_TEST_MODE_ENABLED`) stay `false` and are out of scope here — see `coordination/COUNSEL-DISPOSITION-2026-07-17-DRAFT.md` rows R-07 through R-10.

## 3a. Enforcement mechanism — must pass immediately before applying

`scripts/check-ops-migration-boundary.mjs` (created in the same remediation as this revision) **must exit 0 immediately before Section 9 Step 3 runs.** A non-zero exit aborts the entire change request; there is no manual override. The script:

- Asserts that `migrations-pcd-ops/` contains **exactly** the twelve files listed in Section 3 — 0011 through 0022 — and no others. Any extra migration file present in the directory (e.g. a stray `0023_*.sql`, or any file outside the 0011-0022 range) fails the run.
- Recomputes the SHA-256 of each of the twelve files at run time and asserts it matches the Section 3 table **exactly**, byte for byte. Any content drift in any of the twelve files — including a whitespace-only edit — fails closed rather than silently applying a different migration than the one reviewed.
- Calls `assertPendingLedgerExactly` against the remote D1 migrations ledger for `parent-coach-desk-ops-production` (`b38d5f37-54df-4e0f-9706-023edc12c7fe`) and fails unless the pending set is **exactly** `{0011, 0012, 0013, 0014, 0015, 0016, 0017, 0018, 0019, 0020, 0021, 0022}` — no more, no fewer, no substitutions, nothing already applied.

This is the hard technical boundary behind Section 3's "no more, no fewer": the enforcement script, not operator judgment, is what stops a broader or substitute migration set from running.

## 4. Expected precondition — reverify immediately before applying

Per `coordination/release-evidence/production-pcd-ops-preflight-2026-07-17.json` (observed 2026-07-17T06:31:00Z, read-only: `wrangler d1 migrations list --remote` plus a `sqlite_master` SELECT):

- `migration_inventory.applied`: empty — only the `d1_migrations` ledger table exists.
- `migration_inventory.pending`: all twelve files in Section 3, `0011` through `0022`.
- `schema_metadata.trust_tables_present`: false.
- `schema_metadata.notification_outbox_present`: false.
- `live_public_surface.effective_trust_intake_enabled`: false; `/trust/` renders 0 forms, email fallback visible.

Immediately before executing Section 9, re-run the identical read-only preflight against `b38d5f37-54df-4e0f-9706-023edc12c7fe` and confirm the result matches the above exactly. Any already-applied migration, any present `trust_*` or `notification_outbox` table, any non-zero row count, or `TRUST_INTAKE_ENABLED=true` already live means the precondition no longer holds. Abort before any write and re-issue this request against the new state.

### 4a. Pre-migration ledger check (mandatory, immediately before Section 9 Step 3)

Query the `d1_migrations` ledger directly against `parent-coach-desk-ops-production` (`b38d5f37-54df-4e0f-9706-023edc12c7fe`) — e.g. `wrangler d1 migrations list parent-coach-desk-ops-production --config wrangler.production.jsonc --remote`. The result must show:

- **Applied:** empty — none of `0011`-`0022`, and nothing else.
- **Pending:** exactly `0011`, `0012`, `0013`, `0014`, `0015`, `0016`, `0017`, `0018`, `0019`, `0020`, `0021`, `0022` — no more, no fewer.

This is the same assertion `assertPendingLedgerExactly` makes programmatically in Section 3a; running it here is the operator-visible confirmation immediately before the write. Any deviation aborts.

### 4b. Post-migration ledger check (mandatory, immediately after Section 9 Step 3)

Re-run the identical ledger query against the same database id. The result must show:

- **Applied:** exactly `0011` through `0022`, in order — no more, no fewer, nothing else in the ledger.
- **Pending:** empty.

Additionally, directly query the ledger table (`SELECT name FROM d1_migrations ORDER BY name;` scoped strictly to `b38d5f37-54df-4e0f-9706-023edc12c7fe` / `parent-coach-desk-ops-production`) and confirm the row set is exactly the twelve migration names in Section 3 — no other row. This is Section 9 step 4's schema check performed against the ledger table itself, not just the `wrangler d1 migrations list` summary. Any row outside the expected twelve, or any of the twelve missing, means stop immediately per Section 6's partial-failure rule — do not proceed to Section 9 Step 5.

### 4c. Expected production manifest/config digest

Before Section 9 begins, run `npm run check:production-manifest` (this builds the production bundle via `scripts/build-production.mjs` and checks the generated deployment manifest via `scripts/check-deployment-manifest.mjs`). Capture and pin the resulting manifest/config digest in the release-evidence file created at the end of this change request (Section 9 step 10). Immediately before Section 9 Step 5 (the flag deploy), re-run `npm run check:production-manifest` and confirm the digest is unchanged and still passes. A digest mismatch — meaning the generated manifest, bindings, or config drifted from what was reviewed for this change request — aborts Section 9 Step 5; do not deploy against an unpinned or drifted manifest.

## 5. Prerequisites that must already be GREEN

This request cannot be executed until every row below is green. As of 2026-07-17, per `rc01.json`, none of them are:

| Prerequisite | Current gate state | What "green" looks like |
|---|---|---|
| Independent offsite backup batch covering `PCD_OPS_DB` | `database_backup`: **pending** | An immutable, independent-account offsite batch that names `parent-coach-desk-ops-production` explicitly, with a proven retrieval/restore on a separate day. Batch ID: `[PLACEHOLDER — record the approved immutable batch ID here before execution]`. |
| Notification receipt | `notification_receipt`: **pending** | Resend provider delivery plus a visible `#pcd-alerts` channel receipt for the same drill ID, plus Jeff's acknowledgement (Launch Authorization Matrix row `notification_receipt`). |
| Staging failure-isolation rehearsal | `failure_isolation`: **pending** | Environment-level (not just local-simulation) failure/recovery/receipt evidence on the isolated staging Worker, run after the staging Slack webhook is reconciled. |
| Counsel disposition | `open_risk_decision`: **pending** | A completed, signed `coordination/COUNSEL-DISPOSITION-2026-07-17-DRAFT.md` (or successor) with every risk row decisioned, plus counsel's written disposition against `coordination/COUNSEL-REVIEW-PACKET-2026-07-17.md`. |

Do not execute Section 9 while any row above is not green.

## 6. Rollback constraints

- A Worker version rollback restores code and bindings only. It does **not** revert D1 schema or data. If `0011`-`0022` are applied and later need to be undone, that requires a separate, explicitly approved down-migration or restore-from-backup — never an assumed side effect of rolling back the Worker.
- No automatic deletion of any `trust_cases` or `notification_outbox` row created during or after this change, including the Section 7 synthetic proof record. Deleting a submitted record follows the privacy-lifecycle/retention process defined in `migrations-pcd-ops/0015_privacy_request_lifecycle.sql`, never an ad hoc cleanup step.
- The known-good Worker rollback target is the currently active, fully bound version recorded in `coordination/release-evidence/worker-rollback-target-2026-07-16.json` (`rc01.json` gate `rollback_target`: pass). If the Section 9 deploy needs reverting, restore that exact version.
- If the migration-apply step (Section 9, command 1) fails partway through the `0011`-`0022` range, do not attempt to "finish" it with a different command. Stop, re-run the Section 4 read-only preflight and the Section 4b post-migration ledger check to determine actual applied state, and report before any further action.

## 7. Observation window and synthetic proof

- **Observation window:** `[PLACEHOLDER — Jeff to set, e.g. 24h / 72h]` of aggregate-only monitoring immediately following the Section 9 deploy, per Plan 017 step 9. Monitor: public GET behavior on `/trust/`, public request failures/abuse signals, `trust_cases` queue aging, `TRUST_RATE_LIMITER` (5/60s) responses, notification receipts, and confirmation of zero unintended writes to the directory (`DB`) database.
- **Synthetic proof — exactly one request, submitted once, after the observation window opens:**
  - Payload class: non-personal synthetic test case only. No real name, email, address, child data, medical data, payment data, or government ID. Target URL must validate against `parentcoachdesk.com` per `src/pages/api/trust/request.ts`. Category value must be an obvious synthetic marker (e.g. "test — do not action") an operator can recognize on sight in the queue.
  - Idempotency-key scheme: a fresh browser-generated key unique to this single submission (the existing client-side idempotency-key generation in `src/pages/trust.astro`), used exactly once. Resubmitting the identical key must be rejected/deduplicated by the `0014_trust_intake_idempotency.sql` constraint — do not reuse a staging key.
  - Expected result: exactly one new `trust_cases` row, exactly one new `notification_outbox` row, zero rows changed in any directory/camp table, the case visible in the protected admin trust queue, and an operator acknowledgement recorded. No outbound reply is sent (Plan 017 non-goals).
  - If the result differs in any respect — more than one case row, no outbox row, any directory write, or the case not visible in the protected queue — stop immediately, deploy `TRUST_INTAKE_ENABLED=false`, and treat it as an incident.

## 8. Reference commands

**REFERENCE ONLY — requires Jeff's explicit written approval naming this exact scope; DO NOT RUN.**

The raw `wrangler d1 migrations apply` / raw `wrangler deploy` invocations previously listed here are replaced below with the bounded, verified invocations. `scripts/check-ops-migration-boundary.mjs` and `scripts/deploy-production-verified.mjs` are both created in the same remediation as this document revision.

```
# Step 0 — manifest/config digest pin (Section 4c). Must pass before anything else in this section.
npm run check:production-manifest

# Step 1 — enforcement boundary (Section 3a). Must exit 0 before Step 2 runs. Asserts exactly
# these 12 files with these hashes exist in migrations-pcd-ops/, rejects any extra migration
# file, and asserts the remote pending ledger for b38d5f37-54df-4e0f-9706-023edc12c7fe is
# exactly {0011..0022} via assertPendingLedgerExactly.
node scripts/check-ops-migration-boundary.mjs

# Step 2 — apply exactly migrations 0011-0022, bounded to the named production database id.
# Do not run this against any database name/id other than the one below.
wrangler d1 migrations apply parent-coach-desk-ops-production \
  --config wrangler.production.jsonc \
  --remote
# Confirms resolution to database id b38d5f37-54df-4e0f-9706-023edc12c7fe via the PCD_OPS_DB
# binding in wrangler.production.jsonc. If that resolution is in doubt, verify first with:
#   wrangler d1 info parent-coach-desk-ops-production --config wrangler.production.jsonc

# Step 3 — the only permitted config change: TRUST_INTAKE_ENABLED "false" -> "true"
# in wrangler.production.jsonc under "vars". No other var, binding, or setting changes.

# Step 4 — deploy that single reviewed flag change, bound to the reviewed commit SHA,
# drift-checked against the pinned manifest digest, no other changes.
node scripts/deploy-production-verified.mjs \
  --sha <REVIEWED_SHA> \
  --config wrangler.production.jsonc \
  --confirm-production
```

Do not run any of the above until: (a) Section 4's precondition has been reverified and matches exactly, (a1) Section 4a's pre-migration ledger check confirms the pending set is exactly `0011`-`0022`, (b) every row in Section 5 is green, (c) Section 4c's manifest/config digest has been captured and pinned, and (d) Jeff has given written approval naming this exact change request (CR-018), this exact database id, this exact migration range, this exact reviewed commit SHA, and this exact flag change. No broader or substitute command is authorized by this document.

## 9. Execution order

Execute strictly in this order; each step is a go/no-go checkpoint for the next.

1. Reverify the Section 4 precondition. Abort on any mismatch.
2. Confirm every Section 5 prerequisite is green. Abort if any is not.
3. Capture the Section 4c manifest/config digest via `npm run check:production-manifest`. Pin it.
4. Run `node scripts/check-ops-migration-boundary.mjs` (Section 3a). Abort on any non-zero exit.
5. Run the Section 4a pre-migration ledger check. Abort on any deviation from exactly `0011`-`0022` pending / nothing applied.
6. Run Section 8 Step 2 (migration apply) only.
7. Run the Section 4b post-migration ledger check: confirm `trust_*` and `notification_outbox` tables now exist, the migration ledger shows exactly `0011`-`0022` applied and nothing else, pending is empty, and every new table has zero rows.
8. Re-run `npm run check:production-manifest`; confirm the digest still matches Section 4c's pinned value before proceeding.
9. Run Section 8 Steps 3/4 (flag change + `deploy-production-verified.mjs`) only, exactly as reviewed, bound to `<REVIEWED_SHA>`.
10. Confirm live `/trust/` renders the form and `TRUST_INTAKE_ENABLED` reads true, with no other config drift versus the reviewed `wrangler.production.jsonc`.
11. Begin the Section 7 observation window.
12. Submit the single Section 7 synthetic proof request.
13. Verify the Section 7 expected result exactly.
14. Continue Section 7 monitoring through the full observation window; log the result — including the reviewed SHA, the pinned manifest digest, and the pre/post ledger check outputs — in a new `coordination/release-evidence/` file before marking `migration_approval` passed in `rc01.json`.

## 10. Mapping to Plan 017's activation sequence

| This request | Plan 017 activation-sequence step |
|---|---|
| Section 4 (precondition reverification), Section 4a (pre-migration ledger check) | Step 1 — Read-only production preflight |
| Section 5, row "backup batch id" | Step 2 — Recovery and retention preflight |
| Section 5, row "staging failure-isolation rehearsal" | Step 3 — Isolated staging rehearsal |
| Human-review-queue readiness (tracked separately, not restated here) | Step 4 — Human review readiness |
| Section 5, row "notification receipt" | Step 5 — Notification receipt rehearsal |
| Sections 2, 3, 3a, 4, 4c, 6, 7 (this document as a whole) | Step 6 — Production migration/change request |
| Section 8 Steps 0-4; Section 9 steps 3-10 | Step 7 — Production enablement |
| Section 7 synthetic proof; Section 9 steps 12-13 | Step 8 — Production synthetic proof |
| Section 7 observation window; Section 9 step 14 | Step 9 — Post-enable monitoring |

## 11. Approval

This document is not an authorization. Execution requires:

- [ ] Jeff Thomas — written approval naming CR-018, the database id, the exact migration range, the reviewed commit SHA (Section header), and the exact flag change (Launch Authorization Matrix row `migration_approval`).
- [ ] Codex — review of this change request against current repository/release-evidence state immediately before execution.

Approved by: _____________________________  Date: _______________
Codex review by: _________________________  Date: _______________

