# PLAT-009 adapter audit-contention repair — local evidence

Status: **LOCAL PASS / RELEASE HOLD**
Recorded: 2026-09-04
PCD implementation candidate: `c23b6e4baf950748e216906b995abbe463388dea`
Candidate tree: `5088032c68724686b987891a410099abfc02abcb`
Receiver source reviewed: outer commit `79c41d9f1ed95bb59e6c95e1a31cde0bff81e8df`

## Finding

The producer leased ten outbox rows and delivered them concurrently with `Promise.all`. Each CRM
receiver request read the current audit-chain head before its D1 batch. Concurrent requests could
therefore select the same parent. The receiver's unique previous-hash index correctly prevented a
fork, but rejected the losing requests. This preserved audit integrity while collapsing the
intended initial-load throughput into retries.

## Red-first reproduction

A temporary receiver-side attack sent ten correctly signed, distinct organization events
concurrently against the real adapter route. The statuses were three `202` responses followed by
seven `500` responses. Every failure reported
`idx_audit_previous_hash_unique: SQLITE_CONSTRAINT_UNIQUE`.

A retained producer regression then measured fetch concurrency for a claimed ten-row delivery
batch. Before the repair it failed with `expected 10 to be 1`, proving that all ten Service Binding
calls were in flight together.

## Repair

`dispatchPcdCrmOutbox` still claims at most ten rows and preserves the existing lease, response
cap, five-second timeout, retry classification, exponential backoff, and eight-attempt ceiling. It
now calls the receiver once at a time in source-sequence order. This matches the receiver's single
tamper-evident audit chain and makes the normal ten-row minute tick ten useful attempts rather than
a contention burst.

No schema, migration, dependency, binding, secret, schedule, flag, remote resource, or data row
changed.

## Verification

- retained producer regression: maximum observed receiver concurrency `1`, with 10 claimed and 10
  delivered;
- full PCD CRM adapter integration suite: **21/21 PASS** in 68.47 seconds;
- `npx tsc --noEmit`: PASS;
- `git diff --check`: PASS before commit;
- CRM receiver worktree returned clean after the temporary red-only attack was removed.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: O(n), bounded to n <= 10 deliveries per invocation;
- DB query count on primary path: unchanged; one claim query plus one bounded outcome-update batch;
- external API calls: unchanged at at most 10 per minute, now sequential;
- queue jobs created: 0;
- expected memory behavior: O(10) outcome metadata and at most one 4 KiB response in flight;
- likely scaling bottleneck: cumulative receiver latency across ten sequential calls. The existing
  five-second per-call timeout is an upper bound, so the staging pilot must measure whether the
  minute invocation remains within its wall-time budget before either batch size or schedule is
  changed.

Dependency decision: the existing D1 outbox and Service Binding path were sufficient; no new
dependency was added.

## Gate effect

The prior Gate 9C-B1 candidate is superseded. No remote action is authorized by this evidence
file. Any approval must name this exact candidate and the unchanged pending-migration aggregate.
