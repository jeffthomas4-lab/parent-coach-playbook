# Parent Coach Desk portfolio CRM adapter

Status: local implementation only; default off; no provider or remote resource configured.

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
- `PCD_CRM_ADAPTER_HMAC_SECRET`: secret, never stored in source;
- `PCD_CRM_PRODUCER_WORKSPACE_ID`: fixed producer workspace;
- `PCD_CRM_TARGET_WORKSPACE_ID`: server-allowlisted CRM workspace;
- `PCD_CRM_SOURCE_ID`: governed contact source ID.

## Guarantees and recovery

- same-D1 contact create/update/suppression/tombstone plus outbox insert commits in one batch;
- cross-D1 organization projection uses a durable bounded cursor and deterministic event IDs;
- dispatcher leases at most 10 rows, times out after five seconds and stops after eight attempts;
- 4xx is terminal; missing receiver, timeout and 5xx back off and retry;
- reconciliation sends at most 100 hashes and retains only bounded counts/result hash;
- scheduled execution is isolated from the existing publishing and intelligence jobs;
- contact notes are never exported; channel data stays inside the strict professional-contact schema.

## Performance review

- approximate algorithmic complexity: O(n), n <= 50 projected per authority and <= 10 dispatched;
- DB query count: one bounded source query per authority plus bounded control/existence/batch work;
- external API calls: 0 when disabled; at most 10 event calls plus 1 reconciliation call per tick;
- queue jobs created: 0;
- expected memory: O(n), bounded by the same row and 4 KiB response caps;
- likely scaling bottleneck: cross-D1 organization cursor projection and per-event receiver calls.

Dependency decision: native Web Crypto, D1 batch and Service Binding fetch were used; no new
package cleared the repository's seven dependency questions or improved this bounded path.
