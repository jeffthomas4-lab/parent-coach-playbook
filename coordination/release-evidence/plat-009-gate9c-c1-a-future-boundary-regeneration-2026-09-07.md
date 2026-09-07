# PLAT-009 Gate 9C-C1-A future-boundary regeneration

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED BASELINE PASS / C1-B HOLD**

Generated: `2026-09-07T06:44:49Z`

## Reason and authorization boundary

The exact C1-B approval for evidence commit
`9ff564316790bbe68d36c4ca47b55245f52c1141` arrived after its packet was no longer safely
executable within the recorded window. It was not used. No deployment or D1 mutation occurred.

The owner then directed Codex to continue and finish the CRM without repeating the expiry loop.
The replacement local-only packet uses a second-aligned boundary ten minutes after generation,
which is accepted by the unchanged generator and guard and gives the exact remote gate roughly
twenty-five minutes from generation. Remote execution remains separately exact-hash gated.

## Exact identities

- PCD candidate: `9952678e639eab0a260618134275647929c7129f`
- complete prepared `dist` SHA-256:
  `04f951a0228091f70275c41ef123f6549a41e5aedee16ee472ba2907b066f87b`
- deploy-guard SHA-256:
  `460b12a79de97e30acc38636e14df1dfd50b68787f877c9ef5dd5495f692db2b`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- disabled PCD rollback version: `6f2aef37-a320-4d78-a186-d9f6e599fd55`
- active CRM version: `97bfa867-b9c0-4846-9307-6cca0a93febc`
- directory D1: `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`
- PCD ops D1: `7f0da00d-bc98-464f-8702-ce0fb381dd5e`
- CRM D1: `9d5e91d3-683b-4070-b511-623e5173ba33`

## Frozen packet

- boundary: `1788764089000`
- boundary ISO: `2026-09-07T06:54:49.000Z`
- guard expiry: `2026-09-07T07:09:49.000Z`
- ignored local directory: `backups/crm-c1a-packet-1788764089000`

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `45a4e65dfcfd778b51557a6c3945ab8314119ba047e568a454c7027e62475267` |
| `00-ops-preflight.sql` | 463 | `bacb5323350186216620efadf751e36e23f95a79f278a6c9a9bfb14a300b4a7a` |
| `01-directory-organizations.sql` | 823 | `4c8b527c52b66de4a577ee1c990a2bc3005e6cbccd10ae6d10271dcfdd54839f` |
| `02-ops-contacts.sql` | 5167 | `1c8aebc526d007e94f87fb2156ec38a95f1e61fc22faa6c38687f97bc99e1cef` |
| `90-directory-verification.sql` | 462 | `c3d3028de37ed5fb8aac36938f0c2f7d2cc3cfdac26878fe47b94045ba08a613` |
| `91-ops-verification.sql` | 3959 | `7ac4978de1ff23dceb832bbd04fcf7c6eac61b4f57541743a6370f7e545f7017` |
| `92-crm-verification.sql` | 1154 | `b265fabb8881685ca504f246467a34d04671a49c5cb8d5853869c42f3a4f2b00` |
| `manifest.json` | 4846 | `45e1b1cc46d97b230ac5da297dab6a7f62701d91f8dd7b35dc557dffdc3522b3` |

Eight-file aggregate using the recorded compact sorted name/hash formula:

`8544f51c04dde57fbf4cb0e90ddbc0babb876c883a03f67d28705f99dfbc57db`

## Authenticated read-only revalidation

Every D1 command used direct `--command` SELECTs and returned `success=true`, `changes=0`,
`rows_written=0`, and `changed_db=false`:

- directory: exactly 3 fixture rows, 3 live, 3 unprojected;
- PCD ops: 0 existing pilot contacts;
- CRM: 0 pilot organizations, 0 pilot contacts, 0 pilot restrictions.

The active Worker baseline remains the exact state recorded in evidence commit `9ff56431`: PCD
version `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%, both CRM producer flags false, no
activation boundary, exact D1 and Service bindings; CRM version
`97bfa867-b9c0-4846-9307-6cca0a93febc` at 100% with its exact staging resources.

## Exact C1-B scope

The retained sequence is exact preflight and three Time Travel bookmarks; complete-artifact-hash
verified PCD activation with only the live adapter enabled and historical backfill false;
hash-verified organization application and exact delivery/receipt/projection gate; hash-verified
contact application and exact two-observation plus one raw-free-DNC gate; aggregate-only final
readbacks; and mandatory rollback to disabled PCD version
`6f2aef37-a320-4d78-a186-d9f6e599fd55` on pass, failure, or timeout.

All abort thresholds and exclusions in
`plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md` and
`plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md` remain binding. In particular this pilot
does not authorize historical transfer, production changes, non-backup export, outbound sends,
privacy-policy text, payment activity, secret/provider/resource changes, synthetic-row deletion,
or any MedConfRadar access.

No remote mutation occurred while generating or validating this packet. If activation does not
begin before `2026-09-07T07:09:49.000Z`, the packet is permanently invalid for remote use.
