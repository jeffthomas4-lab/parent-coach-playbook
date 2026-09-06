# PLAT-009 Gate 9C-C0.1 staging directory schema repair execution

Status: **REMOTE PASS / GATE 9C-C1 HOLD**

Executed: 2026-09-05 Pacific / 2026-09-06 UTC

## Approved immutable inputs

- Approval evidence commit: `aeb8e0b7c1375476ff1548f1fbf2344a1b85d2d5`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- PCD candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- Directory migration: `0015_org_editorial_and_sync.sql`
- Migration SHA-256: `8bee241dabe4e5369f2f417b775f0d74f92a28c3a15733781274ea600a97d182`
- One-file migration aggregate: `721b8dec77d8800b72430d64ea769c2dcf233369d7e7deea6446a9a11493759c`
- Aggregate algorithm: `sha256(utf8(compact-json(sorted [{name,sha256}])))`
- Staging directory D1: `parent-coach-desk-directory-staging`
  (`6aa26d4d-d545-4eb7-bf50-34d45f2182ad`)

The evidence commit, candidate commit and tree, physical migration hash, canonical aggregate, exact
staging D1 binding, disabled producer flags, and absent activation-boundary configuration all
matched before a remote mutation was attempted.

## Pre-action recovery point and preflight

- Pre-action Time Travel bookmark:
  `0000005d-00000000-000050de-37fdf5308a7d528f0a42e466ce664f9e`
- The first UUID-selector bookmark request was rejected by Wrangler/Cloudflare authorization and
  changed nothing. The successful request used configured binding `DB`, already verified to the
  approved D1 UUID.
- The `organizations` table had the exact 46-column pre-repair fixture shape.
- All 18 migration-`0015` columns and all seven target index names were absent.
- The exact canonical migration-`0018` revision table, revision index, insert trigger, and update
  trigger were present.
- Aggregate state was 10 organizations, revision sum 0, projected rows 0, and next revision 1.
- The legacy `d1_migrations` ledger contained zero rows.
- Every preflight statement reported `changed_db: false` and zero rows written.

The complete recorded preflight therefore matched and permitted direct application of migration
`0015` only.

## Authorized remote actions

Migration `0015_org_editorial_and_sync.sql` was applied directly to binding `DB`; no legacy-ledger
entry was inserted and no other migration was run. Cloudflare reported:

- success: true
- queries executed: 25
- rows read: 2,209
- rows written: 65, representing the forward-only schema/index work
- resulting database size: 540,672 bytes
- migration completion bookmark:
  `0000005d-00000008-000050de-06e9b854854287c9729bb97dfb88010c`

The isolated worktree was then detached at the exact approved PCD candidate and the verified
staging deploy command completed with exit code 0. The deployed Worker state is:

- deployment id: `019eec55-9cf0-4881-acd0-24ab0441c0ea`
- Worker version: `6f2aef37-a320-4d78-a186-d9f6e599fd55` (version number 79)
- traffic: 100%
- deployment message:
  `exact candidate f1bc696720d65c578b513165e2f62756da2fe2f5; adapter and backfill disabled`

## Post-action readback

Worker version and binding readback proves:

- `DB` remains bound to `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`.
- `PCD_OPS_DB` remains bound to `7f0da00d-bc98-464f-8702-ce0fb381dd5e`.
- `CRM_ADAPTER` remains bound to service `field-forge-crm-staging`.
- `PCD_CRM_ADAPTER_ENABLED` is `false`.
- `PCD_CRM_BACKFILL_ENABLED` is `false`.
- `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent, so no activation boundary exists.
- The pre-existing `PCD_CRM_ADAPTER_HMAC_SECRET` binding name remains present; no secret was read
  or changed.

Final schema-only readback proves all 18 migration columns with their exact canonical types,
nullability, and defaults; all seven exact canonical indexes; and the exact migration-`0018`
revision table, revision index, and two triggers. Final aggregate-only readback returned:

| Metric | Result |
|---|---:|
| organizations | 10 |
| revision sum | 0 |
| projected rows | 0 |
| rows matching every declared migration default | 10 |
| target columns present | 18 |
| target indexes present | 7 |
| next revision | 1 |
| legacy migration ledger rows | 0 |

The final aggregate query reported `changed_db: false`, zero changes, and zero rows written. The
post-action Time Travel bookmark is
`0000005e-00000000-000050de-1197dee01139bb7b1b8bf18b254a5a0a`.

Two earlier post-action aggregate/schema query formulations were rejected read-only by SQLite
(compound-select limit and an incorrect singleton key reference), and one quoted-column schema
query was rejected at parse time. None changed the database; the corrected bounded queries above
passed.

## Retained boundary

No synthetic packet was created or applied. No organization or contact was copied or seeded. No
activation boundary was selected, neither producer flag was enabled, and no production resource,
non-backup export, outbound send, privacy-policy text, secret, provider, or resource was changed.

Gate 9C-C1 remains separately gated. It must establish fresh action-time evidence before any
synthetic pilot, data movement, or producer activation.

## Performance review

- approximate algorithmic complexity: O(c + i), bounded by one table's columns and a fixed schema
  object set
- DB query count on the execution path: one bounded preflight batch, one 25-statement forward-only
  migration, and bounded schema/aggregate readback batches
- external API calls: one successful pre-action bookmark, one migration execution, one Worker
  deployment, and bounded deployment/version/bookmark/D1 readbacks; rejected read-only attempts
  are recorded above
- queue jobs created: 0
- expected memory behavior: O(c + fixed DDL bytes), with no organization/contact payload loaded
- likely scaling bottleneck: the later bounded organization/contact backfill and reconciliation,
  not this one-file schema repair
