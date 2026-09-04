# PLAT-009 full registry and contact backfill — local evidence

Status: **LOCAL PASS / RELEASE HOLD**  
Recorded: 2026-09-04  
Implementation candidate: `c4a4cb1b200c6915b7ef041a6b50f6dbfd8b12ca`  
Candidate tree: `af849d79f57750b3a293deb1c066e000db43e99e`  
Base: `329709e400cf3e254c3c808f6513d92494f2a459`  
Migration `0032` SHA-256: `48a96fbccc0984af8ea435b27d1c0d3ad8d5956354f976643d3574e454a4d842`

## Requirement

Move the complete canonical organization registry and every extracted professional-contact row
into the portfolio CRM without turning the CRM into a competing identity authority. Every source
row must have an accountable disposition. Only eligible professional contacts are projected;
missing-channel/missing-source rows are rejected with hash-only evidence, and tombstones remain
tombstones.

## Read-only action-time inventory

No row data or contact value was returned by these checks.

- `activity-radar` D1 `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`:
  198,287 organizations, 0 tombstoned; query metadata reported `changes: 0` and
  `changed_db: false`.
- `parent-coach-desk-ops-production` D1
  `b38d5f37-54df-4e0f-9706-023edc12c7fe`: 108 contacts, 0 tombstoned,
  0 suppressed, 16 with email or phone, 108 with a source URL; query metadata reported
  `changes: 0` and `changed_db: false`.
- Timestamp inventory: organizations contain 197,961 ISO-T values and 326 SQLite-space values;
  all 108 contacts use SQLite-space values. Both tables have 0 timestamps rejected by
  `unixepoch(updated_at)`.

These counts are a 2026-09-04 snapshot, not a load receipt. The activation gate must refresh and
freeze the exact pre-boundary counts because extraction continues.

## Implemented controls

- separately disabled historical flag plus the existing adapter flag;
- second-aligned immutable snapshot boundary;
- exact counts of rows created before the boundary frozen at run creation and rechecked at
  completion, so ordinary updates during the drain do not destabilize snapshot membership;
- stable ID keyset scan, maximum 50 rows, resumable 60-second lease;
- lease-owned atomic chunk receipt and cursor advancement;
- hash-only per-chunk disposition receipt, including rejected contacts without copying contact
  values into evidence;
- all historical organizations queued before any historical or live contact;
- numeric timestamp comparison for mixed source formats;
- completion requires source rows = chunk rows, eligible dispositions = outbox events, every event
  delivered with a receiver receipt, zero pending/dead rows, and two stable post-scan
  reconciliations with no missing, duplicate, stale, unauthorized, or mismatched events;
- minute job performs only historical scanning and at most 10 deliveries; the existing six-hour
  job owns live scanning, reconciliation, and completion checks;
- both feature flags remain `false`; no secret, Service Binding, remote migration, provider change,
  source row, CRM row, export, or outbound message was created by this local lane.

## Red-first evidence

- historical backfill tests initially failed because the backfill entry point did not exist;
- frozen-inventory drift test resolved instead of rejecting before the source-count repair;
- an existing row created before but updated after the boundary disappeared from the historical
  set before membership was corrected from mutable `updated_at` to immutable `created_at`;
- mixed-format historical boundary test incorrectly projected both post-boundary rows before the
  numeric-time repair;
- mixed-format live cursor test projected only 1 of 2 organizations and 1 of 2 contacts before the
  numeric-time repair.

## Verification

- `vitest.integration.config.ts tests/crm-adapter.test.ts`: **17/17 PASS** in 41.59 seconds;
- `vitest.unit.config.ts tests/intel-worker-scheduled.test.ts tests/generated-wrangler-manifest.test.ts`:
  **10/10 PASS**;
- `npm run check`: **0 errors, 0 warnings, 384 pre-existing hints** across 633 files;
- `git diff --check`: PASS before the candidate commit;
- migration `0032` was exercised from a fresh disposable D1 by the integration suite.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: O(o + c), processed in O(50) source chunks and O(10)
  delivery batches;
- DB query count on primary path: 0 when disabled; first historical tick adds 2 aggregate counts;
  each ordinary minute tick performs 1 bounded source scan plus bounded control/dedupe/batch work;
  the six-hour finalization path adds 2 aggregate counts, 1 accounting query, and 1 reconciliation
  query;
- external API calls: 0 when disabled; at most 10 parallel Service Binding event calls per minute
  and at most 1 reconciliation call per six-hour tick;
- queue jobs created: 0 (the durable D1 outbox remains the existing transport);
- expected memory behavior: O(50) source rows plus O(10) receiver responses capped at 4 KiB each;
- likely scaling bottleneck: the intentionally conservative 10-event/minute receiver pump. The
  present inventory implies about 198,303 eligible upserts and a no-retry lower-bound drain time of
  13.8 days. A synthetic scale run and bounded staging pilot must measure the receiver before any
  throughput increase.

## Dependency decision

Live npm, PyPI, and GitHub searches found generic migration/sync tools, but none fit the existing
D1 outbox, deterministic event, HMAC, audit, and reconciliation contract without adding a second
authority path. Native TypeScript, Web Crypto, D1 batches, and the existing Service Binding adapter
were retained; no dependency was added.

## Remaining release gates

This candidate is not approved for deployment or data movement. A later exact gate must name the
reviewed candidate, target Worker, production source and operations D1s, required producer
migrations, Service Binding, secret-name action, second-aligned boundary, refreshed aggregate
inventory, destination CRM ring/workspace, synthetic pilot limits, rollback target, and observation
window. Full completion remains HOLD until receiver counts and two stable reconciliations prove the
entire frozen inventory, including every rejected/tombstoned disposition.
