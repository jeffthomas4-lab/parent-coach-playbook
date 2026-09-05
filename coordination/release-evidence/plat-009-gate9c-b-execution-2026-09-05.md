# PLAT-009 Gate 9C-B staging infrastructure execution

Status: **PASS — APPROVED INFRASTRUCTURE SLICE ONLY**  
Executed: 2026-09-05  
Environment: staging

Gate 9C-B applied the approved staging database migrations and deployed the exact approved PCD
producer and CRM receiver candidates. Both producer flags remained false throughout. No
organization or contact data was copied, no activation boundary was set, and no export, send,
production, secret, or provider action was performed.

## Approved immutable inputs

- PCD candidate: `e0dc5f8932a8246eddaaad3622aae67ba8b370c1`
- PCD candidate tree: `c5e085fd13f5bb4fec05c318bbbfb6d16d61ba82`
- CRM candidate: `25342fffba8d3cfc9a8272211c8f0763ed404f7d`
- CRM candidate tree: `82d9681cdc146cc00b9e8c086c51e8a2409106d6`
- PCD ops 20-file migration aggregate:
  `e06a06ec1f0effa9756b19a9895add862d042d3b40849772746cd7787dc7f930`
- Directory migrations `0017` through `0019` aggregate:
  `bd2994a2cdbca16b9c023dc8c4ed2621dfb840b28909cca7a5ae6dbc83a692ae`
- CRM migrations `0026` through `0027` aggregate:
  `4be1cc555913c9dc84490651709347f5d53904b1b34d633d04917d86215c546d`

The action-time hash recheck matched all three approved aggregates. The exact current component
hash for `0034_crm_adapter_outbox_claim_order.sql` is
`7498fc7c7836724e8ce73d65f0baf9d6e304f22c93ec51037c0fdc06a157330d`; this corrects the stale
component hash in the earlier preflight narrative without changing its approved aggregate or file
set.

Dependency decision: no dependency was added. Existing Wrangler and Cloudflare D1/Workers
primitives covered the bounded migration, backup, deployment, and readback work.

## Targets and recovery evidence

| Database | D1 ID | Pre-gate full export | SHA-256 | Post-gate Time Travel bookmark |
|---|---|---:|---|---|
| `parent-coach-desk-directory-staging` | `6aa26d4d-d545-4eb7-bf50-34d45f2182ad` | 56,682 bytes | `bdfd30c28992c1b26ba5034a57b439c6fcf765864621bf8063036bb62b8fd0ee` | `00000058-00000000-000050dd-d0ce40863881195284fafa63c7c7cc2e` |
| `parent-coach-desk-ops-staging` | `7f0da00d-bc98-464f-8702-ce0fb381dd5e` | 34,238 bytes | `220a7a338d2da806566aeb457fbe58d221d7c69dba8a4b89830ac981b1635f6a` | `00000013-00000000-000050dd-97b43a8210f98eb12f7a18c633d0abe4` |
| `field-forge-crm-staging` | `9d5e91d3-683b-4070-b511-623e5173ba33` | 143,841 bytes | `ede2b7e83a07ac57dbfef63c2448a00fa8c7961d213d9c6ac29861504e6ae9c5` | `00000046-00000000-000050dd-d58ee4fbb6c3ef04d8c66b9ad88a8c3c` |

The protected exports are retained under `C:\tmp\crm-gate9cb-20260905`. No presigned URL or
database contents are recorded in this receipt. The bookmarks were captured after migration and
deployment readback; no Time Travel restore was performed.

## Migration execution and readback

### Directory staging

The empty legacy migration ledger made a full `wrangler d1 migrations apply` unsafe. Only the
three reviewed forward-only files were executed, individually and in order:

1. `0017_crm_organization_projection_revision.sql`
2. `0018_crm_organization_projection_triggers.sql`
3. `0019_crm_organization_backfill_cursor.sql`

All three executions succeeded. Readback found 10 existing synthetic organizations, revision sum
zero, and next revision one. It also verified these exact objects:

- table `crm_organization_projection_revisions`
- triggers `crm_organization_projection_insert` and `crm_organization_projection_update`
- indexes `idx_organizations_crm_projection_cursor`,
  `idx_organizations_crm_projection_revision`, and `idx_organizations_crm_backfill_created`

The readback reported `changed_db: false`.

### PCD ops staging

Wrangler applied exactly the 20 files frozen in the approved aggregate, from
`0023_affiliate_clicks.sql` through
`0041_crm_backfill_created_cursor_and_public_contact_safety.sql`. Every migration reported
success, and the post-run ledger reported `No migrations to apply`.

### CRM staging

Wrangler applied exactly:

- `0026_contact_provenance_index.sql`
- `0027_audit_chain_head_index.sql`

Both reported success, and the post-run ledger reported `No migrations to apply`.

## Exact-candidate deployments

### CRM receiver

- Worker: `field-forge-crm-staging`
- Version ID: `37569291-24e8-45ae-8230-4bc593349684`
- Traffic: 100 percent
- Message: `Gate 9C-B exact candidate 25342fff; infrastructure only`
- Existing queue producer, queue consumer, schedule `17 * * * *`, D1, R2, and asset bindings
  remained attached.

### PCD producer

- Worker: `parent-coach-desk-staging`
- Version ID: `16e35632-f159-47a1-8c05-6e6a327340b2`
- Traffic: 100 percent
- Message: `Gate 9C-B exact candidate e0dc5f89; adapter and backfill disabled`
- Directory D1: `parent-coach-desk-directory-staging`
- Ops D1: `parent-coach-desk-ops-staging`
- Service binding: `CRM_ADAPTER` to `field-forge-crm-staging`
- Schedules: `17 */6 * * *` and `* * * * *`
- `PCD_CRM_ADAPTER_ENABLED`: `false`
- `PCD_CRM_BACKFILL_ENABLED`: `false`

The hosted PCD build receipt returned commit
`e0dc5f8932a8246eddaaad3622aae67ba8b370c1`, build origin `local`, and built-at timestamp
`2026-09-05T08:51:23.686Z`. The CRM root remained protected by Cloudflare Access and returned a
redirect rather than anonymous application content; sensitive redirect material was not retained.

## Disabled no-op and zero-copy proof

After a minute cron boundary, the PCD ops readback remained:

| Authority | Count |
|---|---:|
| contacts | 0 |
| controls | 0 |
| outbox | 0 |
| projections | 0 |
| reconciliations | 0 |
| backfill runs | 0 |
| backfill chunks | 0 |
| reconciliation windows | 0 |
| backfill subjects | 0 |
| retraction runs | 0 |

The query reported `changed_db: false`.

CRM staging remained empty for organizations, people, contact points, workspace organizations,
workspace contacts, campaigns, imports, exports, touches, outcomes, inbox receipts, and dead
letters. Its readback also reported `changed_db: false`.

This proves the disabled producer did not copy or enqueue source data during this gate.

## Performance review

- approximate algorithmic complexity: O(m) for each finite migration file; O(1) bounded
  aggregate readbacks
- DB query count on primary path: three exact directory file executions, one 20-file ops migration
  apply, one two-file CRM migration apply, plus bounded schema/ledger/count readbacks
- external API calls: three D1 exports, three directory executions, two migration-apply operations,
  two Worker deployments, and bounded version/schema/bookmark readbacks
- queue jobs created: 0
- expected memory behavior: bounded to Wrangler migration bundles, deployment bundles, and small
  aggregate result sets; no organization/contact dataset was loaded into memory
- likely scaling bottleneck: the later organization/contact backfill and reconciliation workload,
  not this infrastructure-only gate

## Decision and retained boundary

Gate 9C-B is **PASS** for the approved staging infrastructure slice. The exact candidates are live,
the exact migrations are applied, recovery evidence exists, and both producer flags are false.

The following remain **HOLD** and were not performed:

- copying any organization or contact data
- setting the activation boundary or watermark
- enabling either producer flag
- running a pilot or full backfill
- production changes
- campaign or privacy export
- outbound sends
- secret or provider changes

The planned transfer of the full organization registry and extracted contacts therefore remains a
later, separately approved data-activation gate with frozen counts, bounded pilot evidence,
reconciliation, suppression/provenance preservation, and rollback criteria.
