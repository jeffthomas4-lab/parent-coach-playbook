# PLAT-009 Gate 9C-C1-A regenerated after renewed packet expiry

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED COMMAND-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-07T03:20:37Z` (`2026-09-06` Pacific)

## Approved identity

- regeneration approval evidence commit: `fc282ef6f5f652ae22030bf6ea3e8460babe4fb5`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- candidate tree: `90467d4032bb9906be5414088df261b7e94789e7`
- CRM candidate retained by the pilot contract:
  `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- boundary: `1788751237000`
- boundary ISO: `2026-09-07T03:20:37.000Z`
- immutable expiry: `2026-09-07T03:35:37.000Z`

The generator was invoked exactly once from the clean detached PCD candidate and wrote only
beneath ignored `backups/`. The candidate worktree remained clean and the packet directory
contained exactly eight files after readback. The packet at boundary `1788724991000` remains
permanently expired and was not reused.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `f30b4bfce0c0bcc8404df441b74495c53ed1b95ca8183084b01d30537bf9cb55` |
| `00-ops-preflight.sql` | 463 | `02dace7441d7a094b292e8b50b1317f9588b7c3dfd4bbc2f3bc9fd29dc085715` |
| `01-directory-organizations.sql` | 823 | `abfbeffcf5bfef4882bad9eece69cdd2fef68c12f10bfc775699c41a6d82b01e` |
| `02-ops-contacts.sql` | 5167 | `f5f42498e5ecb0e9886ffedc3db23012b799b698ef3160391e392be801c5240b` |
| `90-directory-verification.sql` | 462 | `3f639a09059cd78b733256f3a57742b4ea37c1971caa8d2710d6353d20219d74` |
| `91-ops-verification.sql` | 3959 | `c1d99f0aee6a6e280a694832fd036f3d4fdb13b4a43e3f9f61dffbc2157884b3` |
| `92-crm-verification.sql` | 1154 | `74ff1a370392d9aa856ba1996ac836417b2bbde0541e21fb743858fa32bc3e9a` |
| `manifest.json` | 4846 | `3e06d1b95938713031de27331c2398342dbfaf5d1a258becb9b262196ad633af` |

Eight-file aggregate, computed as
`sha256(utf8(compact-json(sorted [{name,sha256}])))`:

`2d01f8879700899659f312f71964355a11cac42db236abcbaee977381bc0017a`

The manifest identifies the fixed three fictional organizations and eight fictional contacts,
has `remoteExecutionAuthorized=false`, requires `--command`, prohibits `--file`, and requires
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false` for read-only D1 calls.
Wrangler logs were written to an ignored sibling path, never inside the packet directory.

## Authenticated staging revalidation

Completed by `2026-09-07T03:24:19Z` with authenticated Wrangler `4.118.0`, before packet expiry.

- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea`, disabled version
  `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%; its deployment message continues to name exact
  deployed candidate `f1bc696720d65c578b513165e2f62756da2fe2f5` with adapter and backfill disabled;
- the PCD version still binds directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD ops D1
  `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, and `CRM_ADAPTER` to
  `field-forge-crm-staging`; `PCD_CRM_ADAPTER_ENABLED=false`,
  `PCD_CRM_BACKFILL_ENABLED=false`, and `PCD_CRM_SOURCE_NOT_BEFORE_MS` remains absent;
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, version
  `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%; its deployment message continues to name exact
  CRM candidate `d810612d5c8f55f97e7e04596cca2af4128049eb`, producers disabled, and no activation boundary;
- the CRM version still binds CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33` and its recorded
  staging Queue, R2, Access, workspace, environment, and secret-name bindings.

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
> `9d5e91d3-683b-4070-b511-623e5173ba33`, boundary `1788751237000`, frozen artifact hashes
> `f30b4bfce0c0bcc8404df441b74495c53ed1b95ca8183084b01d30537bf9cb55`,
> `02dace7441d7a094b292e8b50b1317f9588b7c3dfd4bbc2f3bc9fd29dc085715`,
> `abfbeffcf5bfef4882bad9eece69cdd2fef68c12f10bfc775699c41a6d82b01e`,
> `f5f42498e5ecb0e9886ffedc3db23012b799b698ef3160391e392be801c5240b`,
> `3f639a09059cd78b733256f3a57742b4ea37c1971caa8d2710d6353d20219d74`,
> `c1d99f0aee6a6e280a694832fd036f3d4fdb13b4a43e3f9f61dffbc2157884b3`,
> `74ff1a370392d9aa856ba1996ac836417b2bbde0541e21fb743858fa32bc3e9a`, and
> `3e06d1b95938713031de27331c2398342dbfaf5d1a258becb9b262196ad633af`, with aggregate
> `2d01f8879700899659f312f71964355a11cac42db236abcbaee977381bc0017a`, including its exact
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

If Gate 9C-C1-B is not approved and activation begun before `2026-09-07T03:35:37.000Z`, this
packet is permanently invalid for remote use and another separately approved C1-A regeneration
is required.
