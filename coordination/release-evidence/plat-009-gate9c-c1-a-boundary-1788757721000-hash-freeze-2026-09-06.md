# PLAT-009 Gate 9C-C1-A boundary 1788757721000 hash freeze

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED COMMAND-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-07T05:08:41Z` (`2026-09-06` Pacific)

## Approved identity

- regeneration approval evidence commit: `c5112221f20c49246c71e20a18b90138e4ba55aa`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- candidate tree: `90467d4032bb9906be5414088df261b7e94789e7`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- boundary: `1788757721000`
- boundary ISO: `2026-09-07T05:08:41.000Z`
- immutable expiry: `2026-09-07T05:23:41.000Z`

The generator ran exactly once from the clean detached candidate and wrote only beneath ignored
`backups/`. The candidate remained clean. Boundary `1788753962000` remains permanently expired.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `20ac9a7c0a4c23d372abd6526640be9149982ccf67f45061b6c95f6326814f0a` |
| `00-ops-preflight.sql` | 463 | `7a9479c366904fbe9c405b4dcfc0b01c5f1072fc11965d1ad340894391121b7b` |
| `01-directory-organizations.sql` | 823 | `7c20cedafc75cc37ccda53177a54d74f34ad6ac6a7fea47e8f89a02f768c214f` |
| `02-ops-contacts.sql` | 5167 | `f8cc3b767cc220b989c0a85c878327dab70403aeb474f628ddaba0b716f247f4` |
| `90-directory-verification.sql` | 462 | `9c725332a269a10117a920da1434a40b13308b43fe22e7f00d5b51b396ca3815` |
| `91-ops-verification.sql` | 3959 | `86c38f4fe9ce0e0b05d9e7f3237700c0e21895204ba745c8c48d04bdcae9003a` |
| `92-crm-verification.sql` | 1154 | `b4c750f12a7dfb1560ff8b2b51a2073c8547ea0f686497dfb680d780beaad9cd` |
| `manifest.json` | 4846 | `99fd03038b734cf11b7254b9cbcde4c7c11e278b046231f4d4d632ca549d825c` |

Eight-file aggregate:

`05a8a019b61dc6efb974d3c744701157f606799d3671721eaf9d8deb0a7284a0`

The manifest has exactly three fictional organizations and eight fictional contacts,
`remoteExecutionAuthorized=false`, direct `--command` read-only transport, prohibited `--file`,
and required `success=true`, `changes=0`, `rows_written=0`, and `changed_db=false` metadata.

## Authenticated staging revalidation

Completed by `2026-09-07T05:10:52Z` using authenticated Wrangler `4.118.0`.

- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea`, disabled version
  `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%;
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, version
  `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%;
- PCD bindings remain directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD ops D1
  `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, and CRM service
  `field-forge-crm-staging`; adapter and backfill are false and no boundary binding exists;
- CRM D1 remains `9d5e91d3-683b-4070-b511-623e5173ba33`;
- directory fixture rows are exact/live/unprojected 3/3/3, total organizations 10, revision sum 0;
- every PCD ops pilot/contact/control/outbox/receipt/backfill/retraction aggregate is 0;
- every CRM organization/person/contact/workspace/campaign/import/export/touch/outcome/inbox/dead-letter aggregate is 0.

All four D1 result objects came from direct `d1 execute --command` SELECTs and reported
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`.

One initial PowerShell binding-filter expression emitted a non-terminating local syntax error after
the Worker reads. The D1 checks still completed. The binding assertion was then rerun with explicit
`Where-Object` syntax and passed at `05:10:52Z`. The error caused no remote mutation and is not
treated as evidence.

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
> `9d5e91d3-683b-4070-b511-623e5173ba33`, boundary `1788757721000`, frozen artifact hashes
> `20ac9a7c0a4c23d372abd6526640be9149982ccf67f45061b6c95f6326814f0a`,
> `7a9479c366904fbe9c405b4dcfc0b01c5f1072fc11965d1ad340894391121b7b`,
> `7c20cedafc75cc37ccda53177a54d74f34ad6ac6a7fea47e8f89a02f768c214f`,
> `f8cc3b767cc220b989c0a85c878327dab70403aeb474f628ddaba0b716f247f4`,
> `9c725332a269a10117a920da1434a40b13308b43fe22e7f00d5b51b396ca3815`,
> `86c38f4fe9ce0e0b05d9e7f3237700c0e21895204ba745c8c48d04bdcae9003a`,
> `b4c750f12a7dfb1560ff8b2b51a2073c8547ea0f686497dfb680d780beaad9cd`, and
> `99fd03038b734cf11b7254b9cbcde4c7c11e278b046231f4d4d632ca549d825c`, with aggregate
> `05a8a019b61dc6efb974d3c744701157f606799d3671721eaf9d8deb0a7284a0`, including its exact
> execution sequence, mandatory rollback, abort thresholds, and exclusions.

The retained sequence is exact preflight and three Time Travel bookmarks; exact-candidate
adapter-only activation with historical backfill false; hash-verified organization application and
its delivery, receipt, and projection gate; hash-verified contact application and its exact two
observations plus one raw-free do-not-contact result; aggregate-only final readbacks; and mandatory
rollback to the disabled PCD version on pass, failure, or timeout.

All abort thresholds and exclusions from
`plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md`, as amended by
`plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md`, remain binding. This includes no
production change, historical transfer or seed, 198,000-plus organization transfer, backfill,
non-backup export, outbound send, privacy-policy text, payment, secret/provider/resource change,
or synthetic-row deletion.

If activation has not begun before `2026-09-07T05:23:41.000Z`, this packet is permanently invalid
and another separately approved C1-A regeneration is required.
