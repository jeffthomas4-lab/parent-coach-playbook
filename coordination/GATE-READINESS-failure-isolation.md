# Gate readiness: failure_isolation

**Gate:** `failure_isolation` (see `coordination/LAUNCH-AUTHORIZATION-MATRIX.md` row 6 and `coordination/release-evidence/rc01.json` → `gates.failure_isolation`, currently `pending`).

**Verdict:** ready. `scripts/failure-isolation-evidence.mjs` and `scripts/check-failure-isolation-evidence.mjs` parse cleanly and execute correctly against the current local-simulation evidence (`node scripts/check-failure-isolation-evidence.mjs coordination/release-evidence/integrated-failure-isolation-2026-07-16.json` → exit 0, `"Local failure-isolation evidence passed. Environment drill and human alert receipt remain pending."`, confirmed 2026-07-17). No script edits needed.

---

## Sequencing — this gate is second, not first

Per the matrix: `failure_isolation` is only approved "after staging Slack is ready." Do this gate after `coordination/GATE-READINESS-notification-receipt.md` Step 1 is complete (fresh `SLACK_WEBHOOK_URL` on staging proven to post into `#pcd-alerts`), because one of the five required failure scenarios (`notification_delivery_uncertain`) and the human-alert-receipt requirement below both depend on a working staging Slack path.

## What already exists — the local half is done

`coordination/release-evidence/integrated-failure-isolation-2026-07-16.json` already passes `validateFailureIsolationEvidence` with `exercise_type: "local_integrated_simulation"`. It covers all five required scenarios (`REQUIRED_FAILURES` in `scripts/failure-isolation-evidence.mjs`), each `state: "pass"` with an `invariant` string and non-empty `evidence` array pointing at real test files:

| Scenario | Invariant proved locally | Evidence |
|---|---|---|
| `d1_unavailable` | Liveness stays up, readiness returns 503, ops go unknown, no exception text leaks | `tests/integrated-failure-isolation.test.ts`, `tests/api/health.test.ts`, `tests/api/operations-status.test.ts` |
| `forge_unavailable` | Agent/scheduler health go unknown; scheduler refuses to call the mutating endpoint before a durable attempt opens | `tests/integrated-failure-isolation.test.ts`, `tests/worker-cron.test.ts` |
| `scheduler_target_unhealthy` | A non-`ok:true` target response rejects the scheduled invocation, never recorded as success | `tests/integrated-failure-isolation.test.ts`, `tests/worker-cron.test.ts` |
| `notification_delivery_uncertain` | Provider exceptions/ambiguous results enter reconciliation-required state, not auto-retried or auto-marked-sent | `tests/integrated-failure-isolation.test.ts`, `tests/api/trust-cases-lib.test.ts` |
| `public_monitor_dependency_failure` | The independent monitor reports failure via bounded GETs, no mutation | `tests/integrated-failure-isolation.test.ts`, `tests/customer-journey-monitor.test.ts` |

This file's own `remaining_evidence` field already names exactly what's left: `"Approved environment-level failure drill"`, `"Independent provider receipt and human acknowledgement"`, `"Post-deploy health/readiness and customer-monitor observation"`. `human_alert_received: false` and `release_gate_closed: false` are both intentionally still false — do not flip either until the live rehearsal below actually produces them.

## Step 1 — Approval

Jeff approves a bounded staging failure/receipt rehearsal (per the matrix, this approval is the trigger — nothing runs before it).

## Step 2 — Bounded staging rehearsal (synthetic only, no production writes)

For each of the same five scenarios, on **staging only**, exercise the equivalent real-environment condition and observe the same invariant holds outside of unit tests:

1. `d1_unavailable` — force or simulate a D1 connectivity failure on the staging Worker; confirm liveness stays up, `/api/health`-equivalent readiness reports non-healthy (503-class), operations status goes "unknown" (not a false "healthy"), and the response body carries no raw exception/stack text.
2. `forge_unavailable` — simulate the Forge/agent dependency being unreachable from staging; confirm agent/scheduler health surface as unknown and the scheduler does not call a mutating endpoint before a durable attempt record exists.
3. `scheduler_target_unhealthy` — point the staging scheduler at a target that returns non-`ok:true`; confirm the scheduled invocation is rejected, not recorded as a success.
4. `notification_delivery_uncertain` — this is where the staging Slack/Resend path from `GATE-READINESS-notification-receipt.md` gets reused: force an ambiguous/erroring notification attempt and confirm it lands in a reconciliation-required state rather than being silently retried or marked sent.
5. `public_monitor_dependency_failure` — confirm the independent public monitor (bounded GETs, no mutation — see `scripts/probe-anonymous-admin.mjs` and `run-customer-journey-monitor.mjs` for the same bounded-GET pattern) correctly reports a component failure when a dependency is down, without mutating anything.

All five happen against the isolated staging Worker/environment. No production data write, at any point, in any scenario.

## Step 3 — Receipt and human acknowledgement

Because `notification_delivery_uncertain` in this rehearsal exercises the real staging Slack/email path (not a unit-test double), it should produce a real receipt — same three-part evidence as the notification_receipt gate (Resend provider delivery + visible `#pcd-alerts` post + Jeff's acknowledgement), tied to this rehearsal's own event, not reused from the separate notification drill. This is what turns `human_alert_received` from `false` to `true`.

## What `failure-isolation-evidence.mjs` emits and what `check-failure-isolation-evidence.mjs` asserts

`scripts/failure-isolation-evidence.mjs` is a schema module, not a live-runner — it exports `REQUIRED_FAILURES` (the five scenario IDs above), `validateFailureIsolationEvidence(value)`, and `loadFailureIsolationEvidence(file)`. There is no `run-failure-isolation-*.mjs` in this repo; the live rehearsal in Step 2 is a human/Codex-driven exercise against staging infrastructure, and its results get hand-assembled into the same JSON shape this module validates.

`validateFailureIsolationEvidence` requires:

- `schema_version === 1`
- `exercise_type === 'local_integrated_simulation'` — note this literal string is required even for what is conceptually an environment-level rehearsal; the schema does not currently have a distinct `exercise_type` for a staging/live drill. Do not invent a new value here — it would fail validation. If an environment-distinguishing field is wanted later, that is a script change, not a data change, and is out of scope for this session (no bug — just flagging so the live evidence file matches the existing contract rather than getting hand-rejected).
- `external_changes` is an **empty array** — the same tension: a true staging rehearsal does cause external changes (synthetic submissions, real Slack/email sends). Keep `external_changes: []` on the *evidence-file-level* field only if that field is meant to describe changes outside the isolated staging environment (i.e., "no production/customer impact"), consistent with how `notification-receipt-pending.json` and `failure-isolation-evidence.mjs`'s own template use `external_changes` as a "blast radius outside the sandbox" list, not a "nothing happened" list. State this interpretation explicitly in whatever evidence file replaces or supplements `integrated-failure-isolation-2026-07-16.json`, since the field name alone is ambiguous.
- `human_alert_received` — must be exactly `false` in the *current* file; the live rehearsal evidence should set this `true` once Step 3's acknowledgement exists, and that changed value is exactly what proves the gate.
- `scenarios` — array covering all five `REQUIRED_FAILURES` IDs, each `state: 'pass'`, non-empty `invariant` string, non-empty `evidence` array. For the live rehearsal, `evidence` entries should point at the observation artifacts from Step 2 (logs, screenshots, receipt JSON paths) rather than test file paths, since this is proving the environment, not the unit tests.
- `release_gate_closed` — must be exactly `false` until this evidence exists; the live evidence file is what is allowed to flip it, and only after all five scenarios plus the human alert are real.

`scripts/check-failure-isolation-evidence.mjs <file>` just loads the file and calls this validator; on failure it prints every error prefixed with `-` and exits 1; on success it prints `"Local failure-isolation evidence passed. Environment drill and human alert receipt remain pending."` unconditionally — note that success message is static text baked into the script, not derived from `human_alert_received`, so it will keep printing "remain pending" even after a passing environment-level file is supplied. That is not a validation bug (the schema fields are still checked correctly) but do not read the console message as a live status indicator — check `human_alert_received` and `release_gate_closed` in the JSON itself for the real state.

## How results replace/extend the evidence

Either update `coordination/release-evidence/integrated-failure-isolation-2026-07-16.json` in place with the environment-level scenario evidence and set `human_alert_received: true` once Step 3 is real, or add a new dated file (e.g. `coordination/release-evidence/staging-failure-isolation-rehearsal-<date>.json`) and update `rc01.json`'s `failure_isolation.evidence` array to include it, following the same pattern used for `notification_receipt` (which already lists six supporting evidence files rather than one). Either approach is schema-compatible; do not delete or rename the existing 2026-07-16 file, since `tests/failure-isolation-evidence.test.ts` imports it directly by path.

## Absolute rule

Synthetic staging only. No production data write in any of the five scenarios or in the notification path exercised inside scenario 4.
