# PLAT-009 producer 200k scale evidence

Status: **LOCAL PASS; HOSTED AND DATA-MOVEMENT GATES REMAIN HOLD**
Observed: 2026-09-04 through 2026-09-05
PCD implementation candidate: `f96abf77fd6707a328a6a5ba5fc3a1b23dc26cd5`
Candidate tree: `011fe506c5d080d5fec2c5f251e30d95994ce781`
Ops migration `0041` SHA-256: `551ad75ad3dde5844535d808d28cd62ae28dfce34c646533e757ec6012477e4d`
Directory migration `0019` SHA-256: `fa822c02f74226073e503e9d08f670b87e9100b2a6f640880dd8dab2eef1f95c`
Pending 20-file ops aggregate: `e06a06ec1f0effa9756b19a9895add862d042d3b40849772746cd7787dc7f930`
Directory `0017`/`0018`/`0019` aggregate: `bd2994a2cdbca16b9c023dc8c4ed2621dfb840b28909cca7a5ae6dbc83a692ae`

No remote database, Worker, binding, secret, flag, activation watermark, organization, or contact was
changed by this gate.

## Requirement exercised

The gate uses the production projection, dispatch, historical reconciliation, and finalization
functions against file-backed disposable databases. It creates 200,000 canonical organization rows
and 108 extracted professional-contact rows. Sixteen fixtures are intentionally public,
professional, source-backed, and channel-bearing. The other 92 exercise private/restricted or
missing-channel paths and must receive a hash-only terminal disposition without entering the
receiver.

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
- A native Node SQLite plan test then exposed `MULTI-INDEX OR` and `USE TEMP B-TREE` in the
  created-time keyset query, despite the Miniflare plan test being green. The implementation now
  uses two bounded indexed reads: the remainder of the current created second followed by later
  created seconds. The native cross-engine regression remains retained because it uniquely caught
  the O(n-squared) scale failure.

## Final evidence

`npm.cmd run test:crm-scale` exited 0 and emitted:

```json
{"event":"pcd_crm_scale_final","stages":47,"durationMs":9282710,"complete":true,"organizations":200000,"contacts":108,"eligibleContacts":16,"rejectedContacts":92,"events":200016,"delivered":200016,"reconciliationWindows":4002,"simulatedResponseLosses":1,"detectedAndRecoveredMissingEvents":1}
```

The final producer suite, using the stable single-worker thread pool, exited 0:

```text
Test Files  1 passed (1)
Tests       63 passed (63)
Duration    215.85s
```

The migration-upgrade test and native SQLite keyset-plan test each passed. Focused TypeScript
checking passed for the CRM adapter, contact access layer, scale harness, and native plan test.
The repository-wide raw `tsc --noEmit` remains blocked by pre-existing absent Astro-generated
modules (`astro:content`, `astro:middleware`, and `ImportMeta.env`); that unrelated environment
failure is not represented as a green CRM result. `git diff --check` passed.

## Review and cost profile

- QA: exact source/event/disposition totals, crash-resumable stages, ambiguous-response replay,
  missing-event non-advancement, and two complete manifest passes all passed locally.
- Security: no family lead, roster, guardian, minor, note, inferred identity, unrestricted channel,
  or secret is present in the synthetic receiver contract. Restricted and missing-channel contacts
  remain fail-closed in the existing adapter tests.
- Efficiency: both source keyset branches are bounded indexed searches and the outbox claim uses
  the partial source-sequence index. No N+1 external calls were added; sequential sends are
  deliberate to preserve the receiver audit chain. The receiver's three sequential conflict
  probes per event remain a non-blocking Medium optimization opportunity after safe activation.
- Simplicity: no runtime dependency, queue, new adapter layer, or alternative authority was added.
  The scale harness directly calls the existing product functions.
- approximate algorithmic complexity: O(o + c) projection; O(log n + 50) per source page;
  O(log n + 10) per indexed claim; O(e)
  delivery; O(e) for each complete reconciliation pass.
- DB query count on the measured paths: a steady projection page uses 11-12 D1 calls / 162-163
  statements; delivery uses 85 calls / 134 statements per ten events; reconciliation uses 9 calls /
  11 statements per 100-event window.
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
