# PLAT-009 Gate 9C-C1-A regenerated packet expiry receipt

Status: **EXPIRED UNUSED / AUTHENTICATED BASELINE PASS / FRESH C1-A HOLD**

Recorded: `2026-09-06T15:48:24Z` (2026-09-06 Pacific)

## Expired packet identity

- generation receipt commit: `f38e7b9bf40e7a2b77ef338bea7023e22a555885`
- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- boundary: `1788708329000`
- boundary ISO: `2026-09-06T15:25:29.000Z`
- hard expiry: `2026-09-06T15:40:29.000Z`
- eight-file aggregate:
  `f3525a3de5e6f15f63df88ed62b547c1fb4b157b6ce7e1540647982d0f5a9b8c`

The local packet was generated exactly once and remained byte-for-byte frozen. Wrangler OAuth
became usable at `2026-09-06T15:46:19Z`, after the hard expiry. The execution-time guard then
refused the revalidation sequence before its first D1 query because the boundary had expired.
The packet is permanently invalid for remote execution and must not be applied or renamed as a
fresh artifact.

## Authenticated read-only baseline

After the packet had expired, the owner-authenticated Wrangler session was used only to refresh
the next-gate baseline. These reads cannot revive the expired packet.

### Parent Coach Desk Worker

- deployment: `019eec55-9cf0-4881-acd0-24ab0441c0ea`
- version: `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%
- message names exact candidate `f1bc696720d65c578b513165e2f62756da2fe2f5`
- `CRM_ADAPTER` remains bound to `field-forge-crm-staging`
- directory D1 remains `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`
- PCD ops D1 remains `7f0da00d-bc98-464f-8702-ce0fb381dd5e`
- `PCD_CRM_ADAPTER_ENABLED=false`
- `PCD_CRM_BACKFILL_ENABLED=false`
- `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent

### Central CRM Worker

- deployment: `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`
- version: `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%
- message names exact candidate `d810612d5c8f55f97e7e04596cca2af4128049eb`
- CRM D1 remains `9d5e91d3-683b-4070-b511-623e5173ba33`
- staging artifacts bucket, jobs Queue, adapter secret name, target workspace, environment, and
  protected public origin remain present and unchanged

### Directory D1 aggregate

- exact fixture rows: 3
- live fixture rows: 3
- unprojected fixture rows: 3
- total organizations: 10
- CRM projection revision sum: 0

### PCD ops D1 aggregate

Contacts, adapter controls, outbox rows, projection receipts, reconciliation receipts, backfill
runs, backfill chunks, backfill reconciliation windows, backfill subjects, and contact-retraction
runs are all zero.

### Central CRM D1 aggregate

Organizations, people, contact points, workspace organizations, workspace contacts, campaigns,
import batches, export artifacts, touches, outcomes, inbox receipts, and dead letters are all zero.

Every D1 statement returned `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`. No secret value was read.

## Gate decision

The authenticated staging baseline is PASS and has not drifted. The expired packet remains
unusable, so Gate 9C-C1-B is HOLD. A new owner-approved C1-A generation is required. With OAuth
now active, the replacement generation and its required read-only revalidation can run in the
same short window.

No Worker deploy, D1 mutation, packet application, producer flag or remote-boundary change,
rollback, historical transfer, production change, export, send, privacy-policy text, or
secret/provider/resource change occurred.

## Exact next approval

> Approve CRM Gate 9C-C1-A regeneration after authentication exactly as recorded at evidence
> commit `<EVIDENCE_COMMIT>`, using PCD candidate
> `f1bc696720d65c578b513165e2f62756da2fe2f5`, packet-generator SHA-256
> `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`, and deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`. Acknowledge that the
> packet at boundary `1788708329000` expired unused before OAuth became usable and is permanently
> invalid for remote execution. Authorize exactly one new local-only generation and hash-freeze of
> the fixed eight-file synthetic staging packet at one fresh second-aligned boundary, writing only
> beneath the recorded ignored `backups/` directory, plus immediate authenticated read-only
> staging revalidation. Stop before any Worker deploy, D1 mutation, packet application, producer
> flag or remote-boundary change, rollback, historical transfer, production change, export, send,
> privacy-policy text, or secret/provider/resource change.
