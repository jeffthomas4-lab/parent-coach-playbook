# PLAT-009 full registry and contact backfill — local evidence

Status: **LOCAL PASS / RELEASE HOLD**
Recorded: 2026-09-04 through 2026-09-05
Implementation candidate: `f96abf77fd6707a328a6a5ba5fc3a1b23dc26cd5`
Candidate tree: `011fe506c5d080d5fec2c5f251e30d95994ce781`
Base: `329709e400cf3e254c3c808f6513d92494f2a459`
Ops migration `0041` SHA-256: `551ad75ad3dde5844535d808d28cd62ae28dfce34c646533e757ec6012477e4d`
Directory migration `0019` SHA-256: `fa822c02f74226073e503e9d08f670b87e9100b2a6f640880dd8dab2eef1f95c`

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
- Production predates the contact-context migration and its existing writers set `is_public = 0`.
  Therefore all 108 rows are currently private/unreviewed and zero may become active CRM contact
  points until a human review establishes public professional eligibility. All 108 nevertheless
  remain in the run's terminal-disposition equation.
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
- created-second plus ID keyset scan, maximum 50 rows, using two bounded indexed reads so rows
  sharing a timestamp cannot be skipped and later-created rows cannot enter the frozen snapshot;
  resumable 60-second lease;
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
- the first created-time keyset implementation passed Miniflare but native SQLite exposed
  `MULTI-INDEX OR` plus a temporary order B-tree; retained native plan evidence drove the split
  same-second/later-second query repair.

## Verification

- final producer CRM suite: **63/63 PASS** in 215.85 seconds using one thread worker;
- migration upgrade: **1/1 PASS**;
- native SQLite keyset plan: **1/1 PASS**, with both branches indexed and no multi-index OR or
  temporary sort;
- focused TypeScript compile for the changed CRM implementation and tests: PASS;
- repository-wide raw TypeScript remains blocked by pre-existing missing Astro-generated modules;
- `git diff --check`: PASS before the candidate commit;
- the full migration lineage through `0041` was exercised by the integration suite.
- exact-scale: **200,000 organizations + 108 contacts / 200,016 deliveries / 4,002 reconciliation
  windows**, including one simulated lost response recovered exactly once, exited 0 in 9,282,710 ms.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: O(o + c), processed in O(50) source chunks and O(10)
  delivery batches;
- DB query count on measured paths: 0 when disabled; a steady projection page uses 11-12 D1 calls /
  162-163 statements; a ten-event delivery stage uses 85 calls / 134 statements; a 100-event
  reconciliation window uses 9 calls / 11 statements;
- external API calls: 0 when disabled; at most 10 sequential Service Binding event calls per minute
  and at most 1 reconciliation call per six-hour tick;
- queue jobs created: 0 (the durable D1 outbox remains the existing transport);
- expected memory behavior: O(100), bounded to 50 source rows, one receiver response capped at
  4 KiB, or one 100-event reconciliation manifest;
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
