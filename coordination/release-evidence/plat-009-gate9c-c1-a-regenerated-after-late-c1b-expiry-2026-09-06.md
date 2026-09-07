# PLAT-009 Gate 9C-C1-A regenerated after late C1-B expiry

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED COMMAND-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-07T04:06:02Z` (`2026-09-06` Pacific)

## Approved identity

- regeneration approval evidence commit: `1d22785889a5ce944975bd1e94a7bc44abc9f030`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- candidate tree: `90467d4032bb9906be5414088df261b7e94789e7`
- CRM candidate retained by the pilot contract:
  `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- boundary: `1788753962000`
- boundary ISO: `2026-09-07T04:06:02.000Z`
- immutable expiry: `2026-09-07T04:21:02.000Z`

The generator was invoked exactly once from the clean detached PCD candidate and wrote only
beneath ignored `backups/`. The candidate worktree remained clean and the packet directory
contained exactly eight files after readback. The packet at boundary `1788751237000` remains
permanently expired and was not reused.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `d5dc106c60c9774bb6e10f692448bd19f06e9dff5fcda486c55ad2e4a2daef41` |
| `00-ops-preflight.sql` | 463 | `fa48103d36c8ff5b27880857faee21f5d3c5b0756fcd35f527f3515df223b0f1` |
| `01-directory-organizations.sql` | 823 | `bb2014f84318dcf7ec55ad179b987d3e4a1e67359158ded9e230680d078e3c0d` |
| `02-ops-contacts.sql` | 5167 | `0766adc649ecbb9463bfcc6c498612d3e139f8cc639b0a119c8b8e29b1b11c46` |
| `90-directory-verification.sql` | 462 | `8be866f3ce2df49dca4f9ab8fa074d040e6ea69cf4afa84134ef43a39f5aa384` |
| `91-ops-verification.sql` | 3959 | `96592a80a407ce96c04c3523f45a4c877e3f0ea2b2b24d75935afb47b29e5ee4` |
| `92-crm-verification.sql` | 1154 | `99e0e23672921090112581fafcb407f9692010e5c33d5d05941c6abd309987ad` |
| `manifest.json` | 4846 | `3f31a1ed6fd926b0709b8b867173fe00180e878908789a658b545a33d36ff855` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`e6e35787fe13194a940d97e21ee5d6eee1d88704578f5101730ce4cc3b14004a`

The manifest identifies the fixed three fictional organizations and eight fictional contacts,
has `remoteExecutionAuthorized=false`, requires `--command`, prohibits `--file`, and requires
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false` for read-only D1 calls.
Wrangler logs were written to an ignored sibling path, never inside the packet directory.

## Authenticated staging revalidation

Completed at `2026-09-07T04:07:40Z` with authenticated Wrangler `4.118.0`, before packet expiry.

- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea`, disabled version
  `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%; its deployment message continues to name exact
  deployed candidate `f1bc696720d65c578b513165e2f62756da2fe2f5` with adapter and backfill disabled;
- PCD bindings remain directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD ops D1
  `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, and `CRM_ADAPTER` to
  `field-forge-crm-staging`; `PCD_CRM_ADAPTER_ENABLED=false`,
  `PCD_CRM_BACKFILL_ENABLED=false`, and `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent;
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, version
  `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%; its deployment message continues to name exact
  CRM candidate `d810612d5c8f55f97e7e04596cca2af4128049eb`, producers disabled, and no activation boundary;
- CRM D1 remains `9d5e91d3-683b-4070-b511-623e5173ba33`.

Every remote D1 statement was a direct SELECT supplied with Wrangler's `--command` flag. No D1
statement used `--file`.

- directory D1: exact/live/unprojected fixture organizations 3/3/3, ten organizations total,
  and projection revision sum zero;
- PCD ops D1: pilot contacts and all contact/control/outbox/receipt/backfill/retraction aggregates
  zero;
- CRM D1: all organization, person, contact-point, workspace-link, campaign, import, export,
  touch, outcome, inbox-receipt, and dead-letter aggregates zero.

All four result objects reported `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`.

## Mutation accounting

No Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, non-backup export, outbound send,
privacy-policy text, payment activity, or secret/provider/resource change occurred.

## Exact next approval

> Approve CRM Gate 9C-C1-B exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using PCD
> candidate `aef3385e254b5eb6cf4a483436da91297e5fb39d`, CRM candidate
> `d810612d5c8f55f97e7e04596cca2af4128049eb`, disabled PCD rollback version
> `6f2aef37-a320-4d78-a186-d9f6e599fd55`, active CRM version
> `97bfa867-b9c0-4846-9307-6cca0a93febc`, staging directory D1
> `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD ops D1
> `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, CRM D1
> `9d5e91d3-683b-4070-b511-623e5173ba33`, boundary `1788753962000`, frozen artifact hashes
> `d5dc106c60c9774bb6e10f692448bd19f06e9dff5fcda486c55ad2e4a2daef41`,
> `fa48103d36c8ff5b27880857faee21f5d3c5b0756fcd35f527f3515df223b0f1`,
> `bb2014f84318dcf7ec55ad179b987d3e4a1e67359158ded9e230680d078e3c0d`,
> `0766adc649ecbb9463bfcc6c498612d3e139f8cc639b0a119c8b8e29b1b11c46`,
> `8be866f3ce2df49dca4f9ab8fa074d040e6ea69cf4afa84134ef43a39f5aa384`,
> `96592a80a407ce96c04c3523f45a4c877e3f0ea2b2b24d75935afb47b29e5ee4`,
> `99e0e23672921090112581fafcb407f9692010e5c33d5d05941c6abd309987ad`, and
> `3f31a1ed6fd926b0709b8b867173fe00180e878908789a658b545a33d36ff855`, with aggregate
> `e6e35787fe13194a940d97e21ee5d6eee1d88704578f5101730ce4cc3b14004a`, including its exact
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

If Gate 9C-C1-B is not approved and activation begun before `2026-09-07T04:21:02.000Z`, this
packet is permanently invalid for remote use and another separately approved C1-A regeneration
is required.
