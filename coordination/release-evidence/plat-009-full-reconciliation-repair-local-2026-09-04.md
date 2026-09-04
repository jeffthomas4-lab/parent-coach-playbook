# PLAT-009 full-run reconciliation repair — local evidence

Status: **LOCAL PASS / RELEASE HOLD**  
Recorded: 2026-09-04  
Implementation candidate: `5b68af4b6fd14b7093efe680ed1fe5b12aca5d3a`  
Candidate tree: `11a702791a0b908f93a9820ba32f36600ffaccec`  
Parent candidate: `daf4d94717e8526337a1b610ec80812345f56333`  
Migration `0033` SHA-256: `b06535eb8b374f4a69106b371cb89680f0219251a54244d4b07cb30c46d8120d`

## Finding repaired

The prior candidate reconciled only the latest 100 outbox events. `finalizePcdCrmBackfill` accepted
two green generic receipts whose declared high water reached the run tail, even when their
manifests covered only one event each. On a 198,000-row load this could falsely mark almost the
entire historical transfer complete without comparing it to the receiver.

## Red-first evidence

The retained regression creates a three-event historical run, marks all three delivered, inserts
two green one-event tail receipts, and asks finalization to close the run. Against parent candidate
`c4a4cb1b200c6915b7ef041a6b50f6dbfd8b12ca`, the test failed because the implementation returned
`completed: true, reconciled: true`; the required result is false/false.

## Repair

- Migration `0033` adds a durable reconciliation pass, sequence cursor, window ordinal, completion
  marker, and bounded per-window receipt table.
- A minute tick does no full-run count while delivery remains incomplete; two indexed existence
  checks detect pending or dead events.
- After delivery, each call compares at most 100 run-linked event hashes through the existing
  signed Service Binding reconciliation contract.
- A failed receiver window is retained in the existing reconciliation receipt ledger and does not
  advance coverage.
- The second pass restarts at sequence zero. Finalization requires both passes to cover the exact
  eligible event count, the same first/last sequences, the expected number of windows, identical
  per-window manifests, zero findings, and a receiver high water at or beyond each window.
- Generic rolling or tail-only reconciliation receipts cannot satisfy historical completion.

Both adapter switches remain false. No remote migration, resource, secret, schedule, source row,
CRM row, export, or outbound message was changed.

## Verification

- Retained red-first regression: PASS after repair.
- CRM adapter integration: **20/20 PASS** in 66.83 seconds.
- Multi-window proof: 101 run-linked events produced two windows per pass and 101 covered events in
  each pass before finalization succeeded.
- Failed-window proof: one missing receiver event retained a failure receipt, left both coverage
  cursors at zero, and created no green window receipt.
- Scheduled isolation and generated Wrangler manifest: **10/10 PASS**.
- `tsc --noEmit`: PASS.
- `npm run check`: **0 errors, 0 warnings, 384 pre-existing hints** across 633 files.
- `git diff --check`: PASS before the implementation commit.

One intervening integration attempt ended after eight passing tests because a Vitest worker process
exited unexpectedly. It produced no assertion or application failure. The same complete suite was
rerun in a fresh worker and passed 20/20; the transient process failure is retained here rather than
silently omitted.

## Performance review

- Approximate algorithmic complexity: O(o + c + e), where source projection and each of two event
  reconciliation passes are linear in bounded windows.
- DB query count on the minute path: while scanning, one bounded source read plus control/batch
  writes; while delivery is pending, two indexed existence checks; during reconciliation, one
  100-row event read, one high-water read, and one atomic receipt/cursor batch.
- External API calls: 0 while disabled; at most 10 event calls plus at most 1 reconciliation call on
  an enabled minute tick.
- Queue jobs created: 0; the existing D1 outbox remains authoritative.
- Expected memory: O(100), bounded by the reconciliation manifest; responses remain capped at
  4 KiB.
- Likely scaling bottleneck: the intentionally conservative 10-event/minute delivery pump. At the
  2026-09-04 inventory, delivery remains a roughly 13.8-day no-retry lower bound. Two 100-event
  reconciliation passes add about 3,968 bounded windows, or roughly 2.8 days at one window/minute.

## Remaining gates

This is not an independent cold review or permission to deploy. Remote work still requires an
exact action-time candidate, migration aggregate, source inventory/boundary, target ring, binding,
secret-name, pilot/load, backup/rebuild, observation-window, and abort-threshold approval. Full
completion remains HOLD until live receiver receipts and both complete passes reconcile the frozen
source inventory exactly.
