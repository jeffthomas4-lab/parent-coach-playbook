# Parent Coach Desk portfolio CRM adapter

Status: local implementation only; default off; no provider or remote resource configured.

Read-only production inventory on 2026-09-04 found 198,287 canonical organizations and 108
extracted contact rows. Of those contacts, 16 currently have an email or phone channel, all 108
have a source URL, none is suppressed, and none is tombstoned. These counts are an action-time
snapshot, not a load receipt; extraction continues and the activation gate must refresh them.

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

Required runtime bindings, none of which are declared or provisioned by Packet 6:

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

The committed configuration keeps both switches false. A dedicated minute cron is declared but
returns without source reads, receiver calls, or writes while the adapter switch is false. When
enabled, that minute pump performs the historical scan, bounded delivery, and at most one
100-event historical reconciliation window; the existing six-hour job owns the live
mixed-timestamp scan, rolling reconciliation, and completion check. Changing the schedule,
applying migrations `0032` or `0033`, adding the Service Binding or secret, or enabling either
switch remains a separately approved provider/data action.

## Guarantees and recovery

- same-D1 contact create/update/suppression/tombstone plus outbox insert commits in one batch;
- cross-D1 organization projection uses a durable bounded cursor and deterministic event IDs;
- first activation applies the reviewed watermark before either cursor, preventing an implicit
  historical backfill from an existing producer database;
- the historical run freezes exact counts of rows created before the boundary, scans each source in
  stable ID order in chunks of at most 50, and records only counts plus a hash of each chunk's
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
- dispatcher leases at most 10 rows, times out after five seconds and stops after eight attempts;
- 4xx is terminal; missing receiver, timeout and 5xx back off and retry;
- reconciliation sends at most 100 hashes per request, durably advances only a green window, and
  restarts the second pass from sequence zero after every first-pass event has been covered;
- scheduled execution is isolated from the existing publishing and intelligence jobs;
- contact notes are never exported; channel data stays inside the strict professional-contact schema.

## Performance review

- approximate algorithmic complexity: O(o + c), with O(50) projection work and O(10) delivery
  work per minute tick;
- DB query count: 0 when disabled; the first historical tick adds 2 aggregate source-count reads;
  an ordinary historical tick reads one source chunk and performs bounded control, dedupe, receipt,
  and cursor work; a post-delivery minute tick adds one 100-row reconciliation read and bounded
  receipt/cursor writes; while delivery is incomplete, indexed existence checks replace a repeated
  full-run count; finalization adds 2 source-count reads, 1 accounting read, and 2 coverage reads on
  the six-hour job only;
- external API calls: 0 when disabled; at most 10 parallel Service Binding event calls per minute,
  plus at most 1 historical reconciliation call per minute and 1 rolling reconciliation call on
  each six-hour job;
- queue jobs created: 0;
- expected memory: O(100), bounded by a 50-row source chunk, 10 delivery responses, or one
  100-hash reconciliation window; every receiver response is capped at 4 KiB;
- likely scaling bottleneck: the 10-event-per-minute receiver pump. At the 2026-09-04 inventory,
  198,287 organizations plus 16 currently channel-bearing contacts is approximately 198,303
  eligible upsert events and a conservative 13.8-day initial drain with no retries. A bounded
  staging pilot must measure receiver/D1 behavior before that limit changes; completion is based on
  accounting and reconciliation, never elapsed time.

Dependency decision: native Web Crypto, D1 batch and Service Binding fetch were used; no new
package cleared the repository's seven dependency questions or improved this bounded path.
