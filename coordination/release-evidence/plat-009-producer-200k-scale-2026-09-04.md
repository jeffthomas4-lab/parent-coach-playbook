# PLAT-009 producer 200k scale evidence

Status: **LOCAL PASS; HOSTED AND DATA-MOVEMENT GATES REMAIN HOLD**  
Observed: 2026-09-04  
PCD implementation candidate: `fc479dd7eda7c01932c25ffb7ba3a63b1e15ef76`  
Candidate tree: `ad6558e435d1f9fd8345506dd6888818abdecb26`  
Migration `0034` SHA-256: `12723f74abe6123ad549ab021cde75ec1fea168671f8535f1cad456da237c092`  
Pending 13-file migration aggregate: `0f862d2d4703aacb798393dc6a642afa465b183134031da03dcb855e0100b192`

No remote database, Worker, binding, secret, flag, activation watermark, organization, or contact was
changed by this gate.

## Requirement exercised

The gate uses the production projection, dispatch, historical reconciliation, and finalization
functions against file-backed disposable databases. It creates 200,000 canonical organization rows
and 108 extracted professional-contact rows. Sixteen contacts have a usable professional channel;
the other 92 must receive a `rejected_missing_channel` disposition without entering the receiver.

The run must:

1. scan every source row in 50-row chunks;
2. persist and deliver exactly 200,016 eligible events in source-sequence order;
3. simulate a response lost after receiver commit at sequence 100,001 and recover by idempotent replay;
4. delete receiver sequence 1, prove the failed window cannot advance coverage, then restore it;
5. reconcile the exact event manifest twice in 100-event windows; and
6. refuse completion unless frozen source counts, chunk accounting, contact dispositions, outbox
   events, delivery receipts, and both reconciliation passes agree.

## Retained red-first findings

- A temporary real receiver attack showed concurrent Service Binding sends causing seven of ten
  receiver audit-chain writes to collide. The producer was changed to keep the ten-row lease but
  send one event at a time. The retained regression measures maximum in-flight receiver calls and
  requires exactly one.
- The first 200k run exposed `SCAN crm_adapter_outbox` plus `USE TEMP B-TREE FOR ORDER BY` for every
  ten-row claim, yielding only about 16 to 23 events per second. The query-plan regression was red
  before `0034`; it now requires `idx_crm_adapter_outbox_claim_sequence` and forbids the temporary
  order B-tree.
- The first complete retained-output run delivered all rows but dead-lettered the deliberately
  ambiguous event. Diagnosis proved the disposable receiver compared a null-prototype SQLite row
  against a plain object. Field-wise equality fixed the harness. A separate product regression
  proves the ambiguous response enters retry once and then delivers with the same event ID.
- A later run reached the correct 200,016 deliveries and 4,002 windows but exited red because the
  final SQLite accounting row used the same null prototype. The receipt now normalizes that wrapper;
  the exact run was repeated and had to exit zero before this file recorded PASS.

## Final evidence

`npm.cmd run test:crm-scale` exited 0 and emitted:

```json
{"event":"pcd_crm_scale_final","stages":47,"durationMs":1091641,"complete":true,"organizations":200000,"contacts":108,"eligibleContacts":16,"rejectedContacts":92,"events":200016,"delivered":200016,"reconciliationWindows":4002,"simulatedResponseLosses":1,"detectedAndRecoveredMissingEvents":1}
```

`npx.cmd vitest run tests/crm-adapter.test.ts --reporter=verbose --hookTimeout=30000` exited 0:

```text
Test Files  1 passed (1)
Tests       23 passed (23)
Duration    72.95s
```

`npx.cmd tsc --noEmit` and `git diff --check` both exited 0. The exhaustive 101-event two-pass unit
test has its own 30-second ceiling because it took 17.27 seconds on the resource-constrained host;
the timeout was not changed globally.

## Review and cost profile

- QA: exact source/event/disposition totals, crash-resumable stages, ambiguous-response replay,
  missing-event non-advancement, and two complete manifest passes all passed locally.
- Security: no family lead, roster, guardian, minor, note, inferred identity, unrestricted channel,
  or secret is present in the synthetic receiver contract. Restricted and missing-channel contacts
  remain fail-closed in the existing adapter tests.
- Efficiency: the primary claim changed from a full scan plus sort per ten rows to the partial
  source-sequence index. No N+1 external calls were added; sequential sends are deliberate to
  preserve the receiver audit chain.
- Simplicity: no runtime dependency, queue, new adapter layer, or alternative authority was added.
  The scale harness directly calls the existing product functions.
- approximate algorithmic complexity: O(o + c) projection; O(log n + 10) per indexed claim; O(e)
  delivery; O(e) for each complete reconciliation pass.
- DB query count on the delivery primary path: one indexed claim/update-returning query and one
  bounded result-update batch per at-most-ten-row tick; reconciliation reads at most 100 events.
- external API calls: at most 10 sequential Service Binding event calls plus at most one 100-event
  reconciliation call per scheduled tick when enabled; zero while disabled.
- queue jobs created: 0.
- expected memory behavior: O(100), bounded by a 50-row projection chunk, one in-flight event body,
  or one 100-hash reconciliation manifest. The local gate restarts child processes between stages.
- likely scaling bottleneck: the intentionally conservative ten-event-per-minute staging pump. The
  full inventory would take about 13.8 days at that rate before retries; pilot evidence is required
  before raising it.

The disposable scale databases use SQLite with host fsync disabled while retaining transaction
boundaries. This gate therefore proves product accounting, ordering, resume behavior, and bounded
memory at the requested size. It does not prove hosted D1 latency, D1 durability, a staging pilot,
the production inventory at activation time, or any remote migration/deploy/data movement.

Dependency decision: maintained HTTP benchmark tools such as Autocannon were checked, but they do
not exercise the D1 cursor, durable outbox, disposition, idempotent replay, and exact two-pass
reconciliation contract. Native Node/SQLite plus existing product code was the smaller correct fit.
