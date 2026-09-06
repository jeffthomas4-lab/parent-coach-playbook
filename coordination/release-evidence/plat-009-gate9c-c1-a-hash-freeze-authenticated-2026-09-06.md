# PLAT-009 Gate 9C-C1-A authenticated packet hash freeze

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED READ-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-06T15:53:08Z` (`2026-09-06` Pacific)

## Approved identity

- regeneration evidence commit: `681a4490731a0d8c82ec845b7eb661eb01904205`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- exact boundary: `1788709988000`
- exact boundary ISO: `2026-09-06T15:53:08.000Z`
- expiry under the approved 15-minute guard: `2026-09-06T16:08:08.000Z`

The generator was invoked exactly once from a clean detached worktree at the exact candidate. It
wrote only beneath the repository's ignored `backups/` directory. The candidate worktree remained
clean after generation.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `e154bcf18b8249a9c9b2d222466eaf0afc689d82fe34c177345460e46f804c88` |
| `00-ops-preflight.sql` | 463 | `d89ac1009f1a92c09049c119d422aa9ccd859e87397ce5de7e93d8c8765a734e` |
| `01-directory-organizations.sql` | 823 | `7475438ec4e9fca427c19e0feee3d67de9615935f1c2bdcf0906c17162b09b0c` |
| `02-ops-contacts.sql` | 5167 | `d55c6744716696bfa0b96b7b3a907e5987d873a97f2c31de71b27577f7d0482b` |
| `90-directory-verification.sql` | 462 | `e154a297e1b88cbea0beb50142ad0e91be57c3a214ac17520b0515d214ef5530` |
| `91-ops-verification.sql` | 3959 | `6b7a5cb3a7dcb04b2247058197db19581487d8286cf0e397afe8f941b2690f8b` |
| `92-crm-verification.sql` | 1154 | `fa7bc623335d3ea4d3b9f12eee0a96aad8b93698989d97dddbbc6d1c43f7f8f9` |
| `manifest.json` | 4495 | `d031b1b25f440000ebc616604571ffff8d0714508f5649180f56a31725c9698b` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`7bc2f2a71c9cb3de729143c8a38fbb0b13975efcd6f792b6d27558684d15a520`

## Manifest validation

- schema version: 1
- kind: `pcd-crm-staging-synthetic-pilot`
- environment: `staging`
- classification: `synthetic_nonproduction`
- `remoteExecutionAuthorized=false`
- organizations: exactly `fixture-org-soccer`, `fixture-org-basketball`, and
  `fixture-org-swim`
- contacts: exactly eight fictional contacts
- expected contact dispositions: two projected and one each rejected-private,
  rejected-suppressed, rejected-nonprofessional-context, held-context-review,
  rejected-missing-source, and rejected-missing-channel
- expected CRM result: three active organization projections, two active contact projections,
  one source-contact do-not-contact restriction, and zero suppressed contact points

The manifest's seven embedded SQL hashes and byte counts exactly match the physical files. No
substitution or manual edit occurred.

## Authenticated read-only staging revalidation

Completed at `2026-09-06T15:55:14Z`, before the exact expiry.

- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea`, disabled version
  `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%
- exact PCD service binding `CRM_ADAPTER` targets `field-forge-crm-staging`
- `PCD_CRM_ADAPTER_ENABLED=false`
- `PCD_CRM_BACKFILL_ENABLED=false`
- `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, version
  `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%
- CRM deployment message identifies exact candidate
  `d810612d5c8f55f97e7e04596cca2af4128049eb`, producers disabled, and no activation boundary
- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: exactly three live unprojected
  fixture organizations, ten organizations total, projection revision sum zero
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: contacts, adapter controls,
  outbox, projection receipts, reconciliation receipts, all backfill aggregates, and retraction
  runs are zero
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: organizations, people, contact
  points, workspace links, campaigns, import batches, export artifacts, touches, outcomes, inbox
  receipts, and dead letters are zero

Every D1 statement reported `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`. Worker bindings, flags, versions, and the three D1 identifiers matched the
recorded staging baseline.

## Mutation accounting

No Worker deploy, D1 mutation, packet application, producer flag change, remote-boundary change,
rollback, historical transfer, data copy, seed, non-backup export, outbound send, privacy-policy
text, or secret/provider/resource change occurred under Gate 9C-C1-A.

## Gate decision and exact C1-B contract

Gate 9C-C1-A is PASS. This receipt grants no remote authority. Only a separate Gate 9C-C1-B
approval may authorize the hosted synthetic pilot, and it must name this evidence commit after it
is created plus:

- PCD candidate `f1bc696720d65c578b513165e2f62756da2fe2f5`;
- CRM candidate `d810612d5c8f55f97e7e04596cca2af4128049eb`;
- disabled PCD rollback version `6f2aef37-a320-4d78-a186-d9f6e599fd55`;
- active CRM version `97bfa867-b9c0-4846-9307-6cca0a93febc`;
- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD ops D1
  `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, and CRM D1
  `9d5e91d3-683b-4070-b511-623e5173ba33`;
- boundary `1788709988000`;
- every file hash and aggregate frozen above; and
- the complete execution sequence, rollback, abort thresholds, and exclusions recorded in
  `plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md`, as amended by
  `plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md`.

The retained ordered execution is exact preflight and three Time Travel bookmarks; exact-candidate
adapter-only activation with historical backfill false; hash-verified organization application and
its exact delivery/receipt/projection gate; hash-verified contact application and its exact two
observations plus one raw-free do-not-contact result; aggregate-only final readbacks; and mandatory
rollback to the disabled PCD version on pass, failure, or timeout.

All recorded abort thresholds remain binding. All recorded exclusions remain binding, including no
production changes, historical organization/contact copying or seeding, 198,000-plus organization
transfer, backfill run, source-inventory export, non-backup export, outbound sends, privacy-policy
text, payment activity, secret/provider/resource changes, or synthetic-row deletion.

If Gate 9C-C1-B is not approved and activation begun before `2026-09-06T16:08:08.000Z`, this
packet is permanently invalid for remote use and a newly approved C1-A generation is required.
