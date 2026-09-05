# Parent Coach Desk portfolio CRM adapter

Status: staging infrastructure deployed; default off; production remains unconfigured; no data moved.

Read-only production inventory refreshed on 2026-09-05 found 198,287 canonical organizations and
141 extracted contact rows. Of those contacts, 35 currently have an email or phone channel, all 141
have a source URL, none is suppressed, and none is tombstoned. These counts are an action-time
snapshot, not a load receipt; extraction continues and the activation gate must refresh them.
Production predates the contact-context migration and current writers set every discovered row to
`is_public = 0`, so all 141 are presently private/unreviewed. Every row will receive a terminal
backfill disposition, but zero may become an active CRM contact until the public-professional
eligibility gate is satisfied.

PCD is the organization and professional-contact producer. Activity Radar `organizations.id`
and `org_contacts.id` are the only subject identifiers. Names, domains, addresses and contact
channels are never used to infer identity.

## Runtime contract

The producer emits the Ventures contract v2 events described by
`organization-crm/docs/contracts/adapter-events.md`:

- `organization.upserted.v1` and `organization.deleted.v1`;
- `contact.observed.v1` and `contact.deleted.v1`.

The exact serialized body is persisted before delivery. HMAC-SHA256 covers:

`v2.<timestamp>.parent-coach-desk.<producer-workspace>.<scope>.<idempotency-key>.<raw-body>`

Required runtime bindings. Gate 9C-B provisioned and verified these in staging with both producer
flags false; production remains unconfigured:

- `CRM_ADAPTER`: Cloudflare Service Binding to the Ventures receiver;
- `PCD_CRM_ADAPTER_ENABLED`: must equal `true`; absent/other values disable all work;
- `PCD_CRM_BACKFILL_ENABLED`: a second switch for rows older than the activation watermark;
- `PCD_CRM_ADAPTER_HMAC_SECRET`: secret, never stored in source;
- `PCD_CRM_PRODUCER_WORKSPACE_ID`: fixed producer workspace;
- `PCD_CRM_TARGET_WORKSPACE_ID`: server-allowlisted CRM workspace;
- `PCD_CRM_SOURCE_ID`: governed contact source ID;
- `PCD_CRM_SOURCE_NOT_BEFORE_MS`: positive Unix-millisecond activation watermark. An enabled
  adapter fails closed without it and will not scan or emit organization/contact source rows whose
  `updated_at` precedes it.

The committed configuration and active staging version keep both switches false. A dedicated
minute cron is declared but returns without source reads, receiver calls, or writes while the
adapter switch is false. When enabled, that minute pump performs the historical scan, bounded
delivery, and at most one 100-event historical reconciliation window; the existing six-hour job
owns the live mixed-timestamp scan, rolling reconciliation, and completion check. Staging now has
the reviewed schema, Service Binding, and secret name. Enabling either switch, changing the
schedule, or applying the corresponding production resources remains a separately approved
provider/data action.

## Guarantees and recovery

- same-D1 contact create/update/suppression/tombstone plus outbox insert commits in one batch;
- cross-D1 organization projection uses a durable bounded cursor and deterministic event IDs;
- first activation applies the reviewed watermark before either cursor, preventing an implicit
  historical backfill from an existing producer database;
- the historical run freezes exact counts of rows created before the boundary, scans each source in
  created-second plus ID order in chunks of at most 50 using two bounded indexed branches, and
  records only counts plus a hash of each chunk's
  dispositions; later `updated_at` changes stay in that frozen membership and also flow through the
  live event cursor;
- historical organizations are queued before either historical or live contacts, preventing a
  contact from reaching the CRM before its organization;
- a 60-second lease prevents concurrent cursor advancement, and every chunk/cursor update verifies
  that the same unexpired lease still owns the run;
- completion fails closed if the frozen source inventory changed, source rows do not equal chunk
  rows, eligible dispositions do not equal outbox events, any event is pending/dead or lacks a
  receiver receipt, or two complete post-scan reconciliation passes do not cover the same exact
  run-linked event manifests with zero receiver findings;
- dispatcher leases at most 10 rows in source-sequence order through the partial actionable-status
  index, sends them sequentially, times out after five seconds and stops after eight attempts;
- 4xx is terminal; missing receiver, timeout and 5xx back off and retry;
- reconciliation sends at most 100 hashes per request, durably advances only a green window, and
  restarts the second pass from sequence zero after every first-pass event has been covered;
- scheduled execution is isolated from the existing publishing and intelligence jobs;
- contact notes are never exported; channel data stays inside the strict professional-contact schema.

## Performance review

- approximate algorithmic complexity: O(o + c) over a complete projection, with O(50) projection
  work per minute tick and O(log n + 10) indexed claim work for each delivery tick;
- DB query count: 0 when disabled; the first historical tick adds 2 aggregate source-count reads;
  an ordinary historical tick reads one source chunk and performs bounded control, dedupe, receipt,
  and cursor work; a post-delivery minute tick adds one 100-row reconciliation read and bounded
  receipt/cursor writes; while delivery is incomplete, indexed existence checks replace a repeated
  full-run count; finalization adds 2 source-count reads, 1 accounting read, and 2 coverage reads on
  the six-hour job only;
- external API calls: 0 when disabled; at most 10 sequential Service Binding event calls per minute,
  plus at most 1 historical reconciliation call per minute and 1 rolling reconciliation call on
  each six-hour job;
- queue jobs created: 0;
- expected memory: O(100), bounded by a 50-row source chunk, one in-flight delivery response, or one
  100-hash reconciliation window; every receiver response is capped at 4 KiB;
- likely scaling bottleneck: the 10-event-per-minute receiver pump. At the 2026-09-05 inventory,
  198,287 organizations plus zero currently public-reviewed contacts is 198,287 initially eligible
  upsert events and a conservative 13.8-day initial drain with no retries. The 141 contact rows are
  still dispositioned, while the 35 channel-bearing rows remain inactive pending human review. A
  bounded staging pilot must measure receiver/D1 behavior before that limit changes; completion is
  based on accounting and reconciliation, never elapsed time.

The fixed-scale local gate processed 200,000 synthetic organizations plus 108 synthetic contacts,
classified all 108 contacts, delivered all 200,016 eligible events, completed 4,002 reconciliation
windows, recovered one ambiguous response by replay, and detected/restored one deliberately missing
receiver event. It completed in 9,282,710 ms across 47 restartable stages. This proves application
accounting and bounded-memory behavior at the 2026-09-04 contact snapshot, not current exact-source
cardinality, hosted D1 latency, or physical durability; the disposable
SQLite harness disables host fsync while retaining transaction boundaries.

Dependency decision: npm and GitHub were checked for maintained HTTP load tools such as Autocannon;
they benchmark HTTP concurrency but do not exercise this product's D1 cursor, durable outbox,
idempotent replay, contact-disposition, and two-pass reconciliation contract. Native Web Crypto,
Node SQLite, D1 batch and Service Binding fetch were therefore used with no new package.
