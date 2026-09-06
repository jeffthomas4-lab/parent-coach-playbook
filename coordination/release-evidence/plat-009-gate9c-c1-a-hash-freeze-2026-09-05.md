# PLAT-009 Gate 9C-C1-A synthetic packet hash freeze

Status: **PASS — LOCAL PACKET FROZEN / REMOTE PILOT HOLD**

Generated: `2026-09-06T04:20:26Z` (2026-09-05 Pacific)

## Approved identity

- retry evidence commit: `08cfef3eae6a137169510f3f221de327dfc04b04`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- packet-generator SHA-256:
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- exact boundary: `1788668426000`
- exact boundary ISO: `2026-09-06T04:20:26.000Z`
- expiry under the approved 15-minute guard: `2026-09-06T04:35:26.000Z`

The replacement generator was invoked exactly once from a clean detached worktree at the exact
candidate. It wrote only beneath the recorded ignored `backups/` directory.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `5045a42433bdb068da6fa275d2963c2f3a63e9c176ff3d77cbd66d7ecf099308` |
| `00-ops-preflight.sql` | 463 | `55c913d868cb68e1923af7052b2687013429e56587793aa1a99fc22a6a08e215` |
| `01-directory-organizations.sql` | 823 | `c022b72a48eaa5d8818fe27315306686f99c469e988af730b16e0e1335c3fc39` |
| `02-ops-contacts.sql` | 5167 | `8c2b0f9bdbbbf3922e248d123f0c6598a0aa24caa8925cb6afb4cc71669c7817` |
| `90-directory-verification.sql` | 462 | `1318421166737801446ac146369dd3cc4d1302dcda23125e22492f63e3ef56ee` |
| `91-ops-verification.sql` | 3959 | `7d1661279ba06d55a0bb583d2a6e0d6b2104c3c6856fdc5ea9f479b297dc40d0` |
| `92-crm-verification.sql` | 1154 | `5a75d1f634478cc6eb4a107c666e53ad7b33acdcb585cb73b9dd7c3752383372` |
| `manifest.json` | 4495 | `e0d2f3eb63f9d302aff7caf6592706c6f5a1463dfa4e67ca3efb2a3e10753c87` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`2b232e9399e42f4a28bf5ce1f4989839d6b3637c56cd2b645f5703a8a43812ce`

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

The manifest's seven embedded artifact hashes and byte counts exactly match the physical SQL
files. No substitution or manual edit occurred.

## Read-only starting state

- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea`, disabled version
  `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, version
  `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%
- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: three live unprojected
  fixture organizations, ten organizations total, revision sum zero
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: all pilot, adapter, receipt,
  backfill, reconciliation, and retraction aggregates zero
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: all named customer-data aggregates
  zero

Every D1 statement reported `changes=0`, `rows_written=0`, and `changed_db=false`.

## Gate decision

Gate 9C-C1-A is PASS. This receipt grants no remote authority. Gate 9C-C1-B must separately name
this evidence commit, both exact candidates, both active Worker versions, all three staging D1
UUIDs, the exact boundary, every artifact hash, and the aggregate above. It must retain the ordered
preflight/bookmark, adapter-only activation, two conditional pilot phases, bounded aggregate-only
observation, mandatory rollback, abort thresholds, and exclusions recorded in
`plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md` and
`plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md`.

If Gate 9C-C1-B is not approved and activation begun before the exact expiry above, this packet is
permanently invalid for remote use and a newly approved C1-A generation is required.

