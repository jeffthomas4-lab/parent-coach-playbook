# PLAT-009 Gate 9C-C1-A readback transport hold

Status: **PACKET FROZEN / APPLICATION STATE MATCH / C1-A HOLD / C1-B PROHIBITED**

Recorded: `2026-09-06T16:31:09Z`

## Approved identity

- approval evidence commit: `54fb38ce8458032534e0007b3a484a993e94a11e`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- packet-generator SHA-256:
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`
- deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`

## One authorized generation

The generator was invoked exactly once from the clean detached PCD candidate. It wrote beneath the
recorded ignored `backups/` directory.

- boundary: `1788711908000`
- boundary ISO: `2026-09-06T16:25:08Z`
- nominal expiry: `2026-09-06T16:40:08Z`
- `remoteExecutionAuthorized=false`
- organizations: 3 synthetic fixtures
- contacts: 8 synthetic fixtures

| File | Bytes | SHA-256 |
|---|---:|---|
| `00-directory-preflight.sql` | 460 | `98f80d06b3292897f40542703ae3821f09ba6877bb7b628832946f083677a5e4` |
| `00-ops-preflight.sql` | 463 | `dc1b3ac85973441e840c7d2b18a9b56a0277b1b5e70ca7d8db63f98ca8382faa` |
| `01-directory-organizations.sql` | 823 | `cf231b15ea0028ad543f60bfce58d67a0c02f13947779e641892545e39deeab0` |
| `02-ops-contacts.sql` | 5167 | `6c4431a162f9b2fbcdc16c63e4617089f78e425275936205fbdfa8446e2949f2` |
| `90-directory-verification.sql` | 462 | `aadf1c69c2b12fb056bdd60a5714976c0832fedcb386797260cb38a5b3676b25` |
| `91-ops-verification.sql` | 3959 | `b2625cb3a137dd6740738809dfd25ee289ed86df7791dabcd300b0f7020b69bf` |
| `92-crm-verification.sql` | 1154 | `99913e9e94fc6956389753b8f5d393e873337bbaa2cf1f8675a85e30225793ee` |
| `manifest.json` | 4495 | `9fdc65cf24a918d8976779328fd82d154ade06baf0cdbfb42d9a3d450f40422c` |

Eight-file aggregate:

`4e3faa58daf34b29adecd12aae58756aea5b8a2fa49eea3f6d9df79ccbed73be`

The seven embedded SQL hashes and byte counts matched the physical files. Nineteen Wrangler log
files were moved intact from the packet directory to a sibling ignored readback directory; the
packet directory was then verified to contain exactly the eight files above. No packet file was
edited. The candidate worktree remained clean.

## Application-state readback

Direct `--command` SELECTs returned `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`:

- directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: exact fixture rows 3,
  live fixture rows 3, unprojected fixture rows 3, total organizations 10, projection revision sum
  0;
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: existing pilot contacts 0;
  contacts, controls, outbox, projection receipts, reconciliation receipts, backfill runs, chunks,
  windows, subjects, and contact-retraction runs all 0;
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: organizations, people,
  contact points, workspace links, campaigns, imports, exports, touches, outcomes, inbox receipts,
  and dead letters all 0.

## Worker readback

- PCD deployment message names exact candidate
  `f1bc696720d65c578b513165e2f62756da2fe2f5`;
- PCD version `6f2aef37-a320-4d78-a186-d9f6e599fd55` is 100%;
- exact directory and ops D1 bindings and `CRM_ADAPTER` service binding match;
- `PCD_CRM_ADAPTER_ENABLED=false` and `PCD_CRM_BACKFILL_ENABLED=false`;
- no activation boundary variable is present;
- CRM deployment message names exact candidate
  `d810612d5c8f55f97e7e04596cca2af4128049eb`, producers disabled, no boundary;
- CRM version `97bfa867-b9c0-4846-9307-6cca0a93febc` is 100%;
- exact CRM D1, Queue, R2, Access, workspace, environment, and secret-name bindings match.

## Blocking anomaly

Before the successful direct-command reads, the generated directory and ops preflight SELECT files
were passed to Wrangler with `d1 execute --file`. The Cloudflare response reported zero rows
written, but also reported `changes=1`, `changed_db=true`, and returned a new `finalBookmark` for
each database. Database size and every application aggregate remained unchanged.

The approved gate required read-only staging revalidation and excluded D1 mutation. The transport
metadata is therefore a hard procedural mismatch even though no application row changed. This
receipt does not reinterpret it as harmless and does not award C1-A PASS.

## Decision

This packet is permanently invalid for remote use. Gate 9C-C1-B must not name or apply it. No
Worker deployment, packet application, producer flag or boundary change, rollback, historical
transfer, production change, non-backup export, outbound send, privacy-policy text, payment
activity, or secret/provider/resource change occurred.

A replacement C1-A must explicitly require direct `--command` SELECT execution only and prohibit
Wrangler `d1 execute --file` for readback. Before another short-lived packet is generated, the
readback procedure should be repaired locally and regression-tested so this transport cannot recur.
