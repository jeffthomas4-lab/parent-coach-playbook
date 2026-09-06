# PLAT-009 Gate 9C-C1-A command-only packet hash freeze

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED COMMAND-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-06T17:47:56Z` (`2026-09-06` Pacific)

## Approved identity

- command-only regeneration evidence commit:
  `1f315bd90c25ba26336fc11bbe85f83179c1889b`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- candidate tree: `90467d4032bb9906be5414088df261b7e94789e7`
- CRM candidate retained by the hosted pilot contract:
  `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- exact boundary: `1788716876000`
- exact boundary ISO: `2026-09-06T17:47:56.000Z`
- expiry under the approved 15-minute guard: `2026-09-06T18:02:56.000Z`

The generator was invoked exactly once from a clean detached worktree at the exact PCD candidate.
It wrote only beneath the repository's ignored `backups/` directory. The candidate worktree
remained clean after generation.

The packet at boundary `1788711908000` remains permanently invalid and is not reused or
referenced as an executable packet by this receipt.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `1f9eacba69779c8a23c1ac54e9ff6ec3113bd7eaabc2ec7e4a2b752b03bd1df2` |
| `00-ops-preflight.sql` | 463 | `03a5d910d619c5350623dbc5256af4737dfbe02277c27de9289cc6857ca2eab5` |
| `01-directory-organizations.sql` | 823 | `fcf93966dbe5416e5d5a9134322c29a696441fc8105dbfb5ad763642b16d9ace` |
| `02-ops-contacts.sql` | 5167 | `5d799db1c175e28cd6a950915c6fb98044a4c372ba29e6d6ebec6e975745451d` |
| `90-directory-verification.sql` | 462 | `72dd324050e896c5d8b0a5a822bf737058853072fe876edb3aa73103d8d06e37` |
| `91-ops-verification.sql` | 3959 | `54f39e8c4d5bedfe94dc26954f641aca9814a3ec2eb792351e3952884766ed8c` |
| `92-crm-verification.sql` | 1154 | `88879dd67d9d31592c9cf22fd8657537108fa3734f69522f3b7aeb32e20ab0e3` |
| `manifest.json` | 4846 | `bd738f365e4d06236535d4f4c27f48132caa00816f9c98b85aa6d570e39c2c03` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`4c47a473d6bf27e55de54bfe1dda381fed95e1e1d6d959a805c1182cbf376e0e`

The packet directory contained exactly these eight files after the readback. Wrangler logs were
written to an ignored sibling path, never inside the packet directory.

## Manifest validation

- schema version: 1
- kind: `pcd-crm-staging-synthetic-pilot`
- environment: `staging`
- classification: `synthetic_nonproduction`
- `remoteExecutionAuthorized=false`
- organizations: exactly three fixed fictional fixtures
- contacts: exactly eight fixed fictional fixtures
- `readOnlyD1Transport.requiredFlag=--command`
- `readOnlyD1Transport.prohibitedFlags=[--file]`
- required metadata: `success=true`, `changes=0`, `rows_written=0`, and
  `changed_db=false`
- hard stop: Wrangler remote file-mode import is prohibited for every read-only D1 preflight

The seven embedded SQL hashes and byte counts exactly matched the physical files. No substitution
or manual edit occurred.

## Authenticated Worker readback

Authenticated Wrangler `4.118.0` revalidation completed before the packet expiry.

### Parent Coach Desk

- deployment: `019eec55-9cf0-4881-acd0-24ab0441c0ea`
- disabled version: `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%
- deployment message names exact deployed candidate
  `f1bc696720d65c578b513165e2f62756da2fe2f5` with adapter and backfill disabled
- `DB` remains D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`
- `PCD_OPS_DB` remains D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`
- `CRM_ADAPTER` remains bound to `field-forge-crm-staging`
- `PCD_CRM_ADAPTER_ENABLED=false`
- `PCD_CRM_BACKFILL_ENABLED=false`
- `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent

The active disabled version is intentionally the mandatory rollback target. Gate 9C-C1-A did not
deploy the newly frozen PCD candidate.

### Central CRM

- deployment: `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`
- version: `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%
- deployment message names exact candidate
  `d810612d5c8f55f97e7e04596cca2af4128049eb`, producers disabled, and no activation boundary
- `DB` remains D1 `9d5e91d3-683b-4070-b511-623e5173ba33`
- staging Queue, R2, Access, workspace, environment, and secret-name bindings remain exact

## Authenticated command-only D1 revalidation

Completed at `2026-09-06T17:52:08Z`. Every remote D1 statement was a direct SELECT supplied with
Wrangler's `--command` flag. No D1 statement used `--file`.

- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: exact fixture rows 3,
  live fixture rows 3, unprojected fixture rows 3, total organizations 10, and total projection
  revision sum 0;
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: existing pilot contacts 0;
  contacts, controls, outbox, projection receipts, reconciliation receipts, backfill runs, chunks,
  windows, subjects, and contact-retraction runs all 0;
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: organizations, people,
  contact points, workspace links, campaigns, imports, exports, touches, outcomes, inbox receipts,
  and dead letters all 0.

All four returned result objects reported `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`.

A preliminary authentication check from the detached worktree resolved its older Wrangler
`4.106.0` package and failed locally before any staging query could execute. The revalidation then
used the already-verified Wrangler `4.118.0` runtime, authenticated successfully, and completed the
Worker and command-only D1 checks above. The failed client attempt performed no D1 statement and
changed no remote state.

## Mutation accounting

No Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, non-backup export, outbound send,
privacy-policy text, payment activity, or secret/provider/resource change occurred under Gate
9C-C1-A.

## Gate decision and exact C1-B contract

Gate 9C-C1-A is PASS. This receipt grants no remote mutation authority. Only a separate Gate
9C-C1-B approval may authorize the hosted synthetic pilot, and it must name this evidence commit
after it is created plus every identity and hash below.

> Approve CRM Gate 9C-C1-B exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using PCD
> candidate `aef3385e254b5eb6cf4a483436da91297e5fb39d`, CRM candidate
> `d810612d5c8f55f97e7e04596cca2af4128049eb`, disabled PCD rollback version
> `6f2aef37-a320-4d78-a186-d9f6e599fd55`, active CRM version
> `97bfa867-b9c0-4846-9307-6cca0a93febc`, staging directory D1
> `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD ops D1
> `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, CRM D1
> `9d5e91d3-683b-4070-b511-623e5173ba33`, boundary `1788716876000`, frozen artifact hashes
> `1f9eacba69779c8a23c1ac54e9ff6ec3113bd7eaabc2ec7e4a2b752b03bd1df2`,
> `03a5d910d619c5350623dbc5256af4737dfbe02277c27de9289cc6857ca2eab5`,
> `fcf93966dbe5416e5d5a9134322c29a696441fc8105dbfb5ad763642b16d9ace`,
> `5d799db1c175e28cd6a950915c6fb98044a4c372ba29e6d6ebec6e975745451d`,
> `72dd324050e896c5d8b0a5a822bf737058853072fe876edb3aa73103d8d06e37`,
> `54f39e8c4d5bedfe94dc26954f641aca9814a3ec2eb792351e3952884766ed8c`,
> `88879dd67d9d31592c9cf22fd8657537108fa3734f69522f3b7aeb32e20ab0e3`, and
> `bd738f365e4d06236535d4f4c27f48132caa00816f9c98b85aa6d570e39c2c03`, with aggregate
> `4c47a473d6bf27e55de54bfe1dda381fed95e1e1d6d959a805c1182cbf376e0e`, including its exact
> execution sequence, mandatory rollback, abort thresholds, and exclusions.

The retained sequence is exact preflight and three Time Travel bookmarks; exact-candidate
adapter-only activation with historical backfill false; hash-verified organization application and
its exact delivery, receipt, and projection gate; hash-verified contact application and its exact
two observations plus one raw-free do-not-contact result; aggregate-only final readbacks; and
mandatory rollback to the disabled PCD version on pass, failure, or timeout.

All recorded abort thresholds and exclusions from
`plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md`, as amended by
`plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md`, remain binding. This includes no
production change, historical organization/contact copying or seeding, 198,000-plus organization
transfer, backfill run, source-inventory export, non-backup export, outbound send, privacy-policy
text, payment activity, secret/provider/resource change, or synthetic-row deletion.

If Gate 9C-C1-B is not approved and activation begun before `2026-09-06T18:02:56.000Z`, this
packet is permanently invalid for remote use and another separately approved C1-A generation is
required.
