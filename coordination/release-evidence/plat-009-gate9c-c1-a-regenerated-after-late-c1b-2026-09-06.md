# PLAT-009 Gate 9C-C1-A regenerated after late C1-B approval

Status: **PASS — LOCAL PACKET FROZEN / AUTHENTICATED COMMAND-ONLY BASELINE PASS / C1-B HOLD**

Generated: `2026-09-06T20:03:11Z`

## Approved identity

- regeneration approval evidence commit: `a8808b428a43b35a19f13879e93f7d8c6f9c3990`
- PCD candidate: `aef3385e254b5eb6cf4a483436da91297e5fb39d`
- candidate tree: `90467d4032bb9906be5414088df261b7e94789e7`
- CRM candidate retained by the pilot contract:
  `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `c3620e51331f932b20a9f54e676d016a0e75565d042caeaba0185bea693f3fa0`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- boundary: `1788724991000`
- boundary ISO: `2026-09-06T20:03:11.000Z`
- immutable expiry: `2026-09-06T20:18:11.000Z`

The generator was invoked exactly once from the clean detached PCD candidate and wrote only
beneath ignored `backups/`. The candidate worktree remained clean. The earlier packet at boundary
`1788716876000` remains permanently expired and was not reused.

## Frozen artifacts

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `98ca11b973be025adfaa504e85cef571902f42313e2dd1ecaf25aff8b5f28730` |
| `00-ops-preflight.sql` | 463 | `2390df9b8cfac85ec88bc30ecc78055abd77aa39cfe8f2d052e3ca70b1f715f9` |
| `01-directory-organizations.sql` | 823 | `ed46d80eb4ec1c512a2fb7dfb04d13027a3c5561382a5a45c6f496b41e1e5fd1` |
| `02-ops-contacts.sql` | 5167 | `18cf4df08588432eb96e780d153eac3f67070836615d5e7de915fa5d80edb325` |
| `90-directory-verification.sql` | 462 | `e017159aa8000e770a8f6d752e5084bfe1b8c3c05c0d2ffe17a92edea66e5ce6` |
| `91-ops-verification.sql` | 3959 | `b930c074e0c52b81508eb2402474ed8cd891a9c9b6ae78ad6912c7526146dcf0` |
| `92-crm-verification.sql` | 1154 | `47d789459331dc0672bfb59fb641b3cb972d3665ed2bcd267f97a9c0c7878db0` |
| `manifest.json` | 4846 | `920e12ae04e25f5c7da1ed7e5d68ec44f68fee0bd07166303b02c9596bf9d286` |

Eight-file aggregate:

`6f0762f94521d90064814a38130c6602fac76aeabb8eeca4929425f2145ad1a6`

The packet directory contains exactly these eight files. The manifest identifies the fixed three
fictional organizations and eight fictional contacts, has
`remoteExecutionAuthorized=false`, requires `--command`, prohibits `--file`, and requires
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false` for read-only D1 calls.

## Authenticated staging revalidation

Completed at `2026-09-06T20:04:09Z` with authenticated Wrangler `4.118.0`.

- PCD deployment `019eec55-9cf0-4881-acd0-24ab0441c0ea`, disabled version
  `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%;
- CRM deployment `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`, version
  `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%;
- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: exact/live/unprojected
  fixture organizations 3/3/3, ten organizations total, projection revision sum zero;
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: pilot contacts and all
  contact/control/outbox/receipt/backfill/retraction aggregates zero;
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: all organization, person,
  contact-point, workspace-link, campaign, import, export, touch, outcome, inbox-receipt, and
  dead-letter aggregates zero.

Every D1 statement was a direct SELECT supplied with `--command`. All four result objects reported
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`.

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
> `9d5e91d3-683b-4070-b511-623e5173ba33`, boundary `1788724991000`, frozen artifact hashes
> `98ca11b973be025adfaa504e85cef571902f42313e2dd1ecaf25aff8b5f28730`,
> `2390df9b8cfac85ec88bc30ecc78055abd77aa39cfe8f2d052e3ca70b1f715f9`,
> `ed46d80eb4ec1c512a2fb7dfb04d13027a3c5561382a5a45c6f496b41e1e5fd1`,
> `18cf4df08588432eb96e780d153eac3f67070836615d5e7de915fa5d80edb325`,
> `e017159aa8000e770a8f6d752e5084bfe1b8c3c05c0d2ffe17a92edea66e5ce6`,
> `b930c074e0c52b81508eb2402474ed8cd891a9c9b6ae78ad6912c7526146dcf0`,
> `47d789459331dc0672bfb59fb641b3cb972d3665ed2bcd267f97a9c0c7878db0`, and
> `920e12ae04e25f5c7da1ed7e5d68ec44f68fee0bd07166303b02c9596bf9d286`, with aggregate
> `6f0762f94521d90064814a38130c6602fac76aeabb8eeca4929425f2145ad1a6`, including its exact
> execution sequence, mandatory rollback, abort thresholds, and exclusions.

The retained sequence, rollback, abort thresholds, and exclusions are those recorded in
`plat-009-gate9c-c1-synthetic-pilot-proposal-2026-09-05.md`, as amended by
`plat-009-gate9c-c1-hash-gate-amendment-2026-09-05.md`. If activation has not begun before
`2026-09-06T20:18:11.000Z`, this packet is permanently invalid and a separately approved C1-A
regeneration is required.
