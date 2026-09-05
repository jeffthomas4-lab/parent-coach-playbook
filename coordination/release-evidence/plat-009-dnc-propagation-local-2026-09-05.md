# PLAT-009 durable contact-suppression propagation — local evidence

Date: 2026-09-05

Status: **PASS-LOCAL / REMOTE HOLD**

## Exact local candidate

- PCD candidate: `9e10d9fd059ab0392389d849ce92d1171cd7bb26`
- PCD tree: `a6a1dc89906b33e64c8a361dca38c200ecc27425`
- `0042_crm_backfill_approval_manifest.sql` SHA-256:
  `59a191e9ff8d1629117be50ad2b55d2b0788c01077c1c1624e1c07341de65566`
- `0043_org_contact_dnc_identity.sql` SHA-256:
  `cf57e93ebb1de11adeb5f81072709178967f351edbc4bdc574be4f03eb3db8ce`
- Pending 0042-0043 aggregate:
  `068f3b420347378b14d2f81bd8738dfc0c1ee2973a1dfeac0a7f134f37ee6b77`
- All 34 PCD ops migrations aggregate:
  `a7c6dea059519b2452d73b3a2fccc0ccd55c74dfd81e89fb45de57c653592bff`

The aggregate is SHA-256 over UTF-8 rows formatted as
`<sorted filename> <file SHA-256>\n`.

## Accepted behavior

- Every PCD do-not-contact mutation produces a stable raw-PII-free
  `contact.deleted.v1` event for the configured CRM target even when no contact
  observation was previously sent.
- Retraction reconciliation merges the configured target with previously attempted
  contact targets, deduplicates them and advances through at most ten targets per pass.
- Normalized email, phone and same-organization name identities prevent a suppressed
  contact from being recreated under a new UUID after channel or soft-delete churn.
- The migration backfills indexed identities, including digit-only normalization of
  Unicode-spaced and Unicode-hyphenated phone values.
- A missing contact returns false instead of reporting a successful DNC mutation.
- Tombstone payloads use opaque revision/authority markers rather than a predictable
  hash of contact PII.

## Retained red-first evidence

The retained regressions were observed failing before their corresponding repairs:

- DNC without a prior observation emitted no event.
- DNC event identity changed after a safety downgrade and duplicated delivery.
- phone-only, soft-deleted email and cross-channel same-name rediscovery created a new
  unsuppressed contact ID.
- a missing contact returned successful DNC.
- the transmitted source version exposed a deterministic PII-derived SHA-256 value.
- the first Unicode phone backfill retained non-ASCII punctuation.
- the first full post-migration adapter run exposed two legacy/direct rows whose null
  identity columns caused duplicate-email insert attempts; both cases failed before
  the null-identity compatibility path was added.

## Verification

- Focused legacy/direct-row reconciliation regressions: 2 passed.
- PCD CRM adapter integration: 74 passed, 0 failed, 231.40 seconds.
- PCD migration upgrade: 1 passed, 0 failed, 16.59 seconds.
- `tsc --noEmit`: passed.
- `git diff --check`: passed before commit.
- Independent QA: CLEAN after repair.
- Independent Security: CLEAN after repair.
- Independent Efficiency and Simplicity: CLEAN after deleting the unused receiver
  suppression index.

Library decision: the required live npm, PyPI and GitHub search found no appropriately
scoped event-sourcing dependency that improved this bounded adapter repair; the existing
Zod, D1 and adapter primitives were retained and no dependency was added.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: O(t), where target fan-out `t <= 10`; migration
  0043 is O(c * p), where `c` is existing contacts and phone length `p <= 40`
- DB query count on primary path: one-target DNC mutation uses 9 D1 calls / 19 SQL
  statements (6 reads and 13 writes or no-op-capable writes) and creates one outbox row
- external API calls: zero during the mutation; later delivery makes one sequential
  Service Binding call per target
- queue jobs created: zero
- expected memory behavior: O(t), bounded to ten target drafts
- likely scaling bottleneck: the existing ten-deliveries-per-minute adapter tick and D1
  write throughput, not the indexed identity lookup

## Remote boundary

No migration was applied, no data was copied or seeded, no activation boundary was set,
neither producer flag was enabled, and no deployment, production change, export, send,
secret, provider or resource change occurred. The prior Gate 9C-B exclusions remain in
force. This evidence commit is not remote authorization.
