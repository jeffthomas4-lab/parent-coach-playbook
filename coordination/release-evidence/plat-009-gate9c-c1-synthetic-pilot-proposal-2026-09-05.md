# PLAT-009 Gate 9C-C1 synthetic staging pilot proposal

Status: **LOCAL PLAN PASS / REMOTE PILOT HOLD**

Recorded: 2026-09-05 Pacific / 2026-09-06 UTC

## Purpose

Gate 9C-C0.1 closed the staging directory schema blocker. Gate 9C-C1 is the smallest hosted test
that can now prove the complete PCD-directory -> PCD-ops -> central-CRM projection path, including
the raw-free do-not-contact event, before any historical organization or contact transfer.

This proposal does not itself authorize or create a synthetic packet, choose an activation
boundary, deploy an enabled producer, or change a remote row.

## Exact code and active staging state

- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- PCD candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- Packet generator: `scripts/build-crm-staging-pilot.mjs`
- Packet-generator SHA-256:
  `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`
- Verified deploy guard: `scripts/deploy-staging-verified.mjs`
- Deploy-guard SHA-256:
  `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`
- Both scripts match the exact PCD candidate above.
- Active disabled PCD deployment: `019eec55-9cf0-4881-acd0-24ab0441c0ea`
- Active disabled PCD Worker version: `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%
- PCD deployment message:
  `exact candidate f1bc696720d65c578b513165e2f62756da2fe2f5; adapter and backfill disabled`
- Central CRM candidate: `d810612d5c8f55f97e7e04596cca2af4128049eb`
- Central CRM candidate tree: `0275934a98d9ee1caadc20b004568d774a0b3703`
- Active CRM deployment: `20e95a24-e9f3-4ab8-9002-cc6bcfe9771c`
- Active CRM Worker version: `97bfa867-b9c0-4846-9307-6cca0a93febc` at 100%
- CRM deployment message:
  `exact candidate d810612d5c8f55f97e7e04596cca2af4128049eb; Gate 9C-C0; producers disabled; no activation boundary`

The exact disabled PCD Worker version above is the mandatory rollback target. The CRM Worker is
not redeployed by this gate.

## Current read-only preflight snapshot

Read at 2026-09-06T03:49:53Z. Every successful D1 response reported zero changes, zero rows
written, and `changed_db: false`.

- Directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: all three exact fixture organizations exist,
  are live, and have `crm_projection_revision=0`.
- PCD ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: zero contacts, adapter controls, outbox rows,
  projection receipts, reconciliation receipts, backfill runs, backfill chunks, backfill
  reconciliation windows, backfill subjects, and contact-retraction runs.
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: zero organizations, people, contact points,
  workspace organizations, workspace contacts, campaigns, import batches, export artifacts,
  touches, outcomes, inbox receipts, and dead letters.
- PCD bindings remain the exact directory D1, ops D1, and `field-forge-crm-staging` Service
  Binding. Both producer flags are false and `PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent.

Two earlier aggregate queries used stale prose-only table names. They failed read-only. Schema-only
readback established the canonical live names `crm_adapter_controls`,
`crm_adapter_backfill_reconciliation_windows`, `inbox_receipts`, and `dead_letters`; the corrected
aggregate queries then passed. Gate execution must use these names.

## Proposed authorization contract

Approval of Gate 9C-C1 authorizes only the following ordered staging actions.

### 1. Revalidate and retain recovery points

1. Recheck the exact commits, trees, script hashes, active versions, D1 UUIDs, bindings, disabled
   flags, absent boundary, directory schema, migration ledgers, and the aggregate-zero state above.
2. Capture fresh pre-action Time Travel bookmarks for the exact directory, PCD ops, and CRM D1
   databases.
3. Abort before mutation on any mismatch. A bookmark permits a later separately approved restore;
   this gate does not authorize Time Travel restoration.

### 2. Generate and freeze an action-time packet

1. Choose one positive, second-aligned Unix-millisecond boundary within the generator and deploy
   guard's 15-minute window.
2. From a clean worktree detached at the exact PCD candidate, generate one new packet into a unique
   temporary directory using the exact packet-generator hash above.
3. Require exactly seven SQL artifacts plus `manifest.json`; no manual edit or substitution is
   allowed.
4. Compute and record each artifact SHA-256, the manifest SHA-256, and the aggregate
   `sha256(utf8(compact-json(sorted [{name,sha256}])))` across all eight files.
5. Abort unless the manifest is the fixed `pcd-crm-staging-synthetic-pilot` contract, is classified
   `synthetic_nonproduction`, has `remoteExecutionAuthorized=false`, contains the exact boundary,
   names exactly three fixture organizations and eight fictional contacts, and reports the exact
   expected results below.

The action-time hashes cannot be truthfully known before the packet and boundary exist. Approval
therefore binds execution to the exact candidate, exact generator hash, exact fixed contract, and
the hashes captured before any remote packet file is applied. Any post-generation hash drift is an
immediate stop.

### 3. Activate only the live adapter

Deploy the exact PCD candidate with the exact action-time boundary using the verified activation
mode. The derived deployment must change only:

- `PCD_CRM_ADAPTER_ENABLED` from `false` to `true`; and
- add `PCD_CRM_SOURCE_NOT_BEFORE_MS` equal to the exact boundary.

`PCD_CRM_BACKFILL_ENABLED` must remain `false`. All resource identities, bindings, secret names,
and other variables must remain exact. Read back the new version at 100% before applying phase 1.

### 4. Apply and verify phase 1

1. Run both packet preflights and require exactly three live, unprojected fixture organizations and
   zero existing pilot contacts.
2. Apply only the hash-verified `01-directory-organizations.sql` to the exact directory D1.
3. Require exactly three boundary-current organization revisions.
4. Poll aggregate-only PCD ops and CRM readbacks no more than once per minute for at most ten
   minutes. Proceed only after exactly three `organization.upserted.v1` events are delivered with
   matched PCD projection receipts and exactly three active CRM workspace-organization projections.

### 5. Apply and verify phase 2

1. Apply only the hash-verified `02-ops-contacts.sql` to the exact PCD ops D1. Its embedded receipt
   gate must insert either all eight fictional contacts or zero; any other result is a stop.
2. Poll aggregate-only PCD ops and CRM readbacks no more than once per minute for at most ten
   minutes.
3. Require exactly:
   - two delivered `contact.observed.v1` events, one email and one phone;
   - one delivered raw-free `contact.deleted.v1` event for the do-not-contact identity;
   - five deferred, held, or rejected contact rows with the manifest's exact dispositions;
   - three active CRM organization projections;
   - two active CRM contact projections;
   - one adapter-origin do-not-contact restriction; and
   - zero CRM contact points for the denied identity.
4. Require event and receiver receipt equality on event ID, subject type, subject ID, authority
   time, content hash, and source sequence, plus the exact producer, target workspace, event type,
   boundary, delivered status, non-null receiver receipt ID, 2xx receiver status, and delivery time.

### 6. Mandatory disable and final readback

Whether the pilot passes, fails, or times out after activation, immediately roll the PCD Worker
back to exact disabled version `6f2aef37-a320-4d78-a186-d9f6e599fd55`. Verify it is again at 100%,
both producer flags are false, the activation boundary is absent, and all bindings are unchanged.

On success, record post-action bookmarks and aggregate-only directory, ops, and CRM counts. On
failure, record the last consistent phase and aggregate-only diagnostic counts. Do not restore a
D1 database, delete pilot rows, retry a mutating phase, or continue into historical transfer under
this gate.

## Abort thresholds

Disable immediately and stop if any of the following occurs:

- candidate, tree, script hash, artifact hash, version, binding, D1 UUID, schema, ledger, flag, or
  boundary mismatch;
- any preflight count differs from the exact snapshot contract;
- a phase writes a partial cardinality or is invoked more than once;
- an unexpected subject, event type, payload key, raw contact value in the DNC event, duplicate,
  pending item after the observation window, dead event, dead letter, non-2xx receiver response,
  missing/mismatched receipt, or projection-count excess appears;
- either phase fails to reach its complete exact result within ten minutes; or
- the activation boundary becomes stale before the enabled deployment begins.

No failed state is permission to use `force`, widen the packet, enable historical backfill, restore
from Time Travel, or substitute production data.

## Exclusions retained

This gate does not authorize production changes, historical organization/contact copying or
seeding, the 198,000-plus organization transfer, a backfill manifest/run, source-inventory export,
non-backup export, outbound sends, privacy-policy text, payment activity, or secret/provider/resource
changes. It does not authorize deleting the synthetic pilot rows after execution.

Full historical transfer remains Gate 9C-D and must use a fresh production inventory, explicit
backfill manifest, bounded batches, resumability, reconciliation, suppression/provenance checks,
observation windows, abort thresholds, and a separately approved production release path.

## Performance review

- approximate algorithmic complexity: O(3 + 8 + 7), fixed synthetic cardinality; no source corpus
  scan
- DB query count on the primary path: two fixed mutating phases containing four total writes, plus
  bounded schema/aggregate preflight and verification reads
- external API calls: three pre-action bookmark calls, one enabled Worker deployment, one mandatory
  rollback deployment, two phase executions, fixed version/binding readbacks, and at most two D1
  aggregate calls per one-minute observation cycle for ten cycles per phase
- queue jobs created: 0; at most six bounded adapter events are expected
- expected memory behavior: fixed tens of kilobytes for seven SQL files and one manifest; aggregate
  reads only
- likely scaling bottleneck: the one-minute producer pump and receiver retry latency; the 20-minute
  combined observation ceiling is deliberately far above the six-event nominal workload

## Approval wording

> Approve CRM Gate 9C-C1 exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using PCD
> candidate `f1bc696720d65c578b513165e2f62756da2fe2f5`, CRM candidate
> `d810612d5c8f55f97e7e04596cca2af4128049eb`, packet-generator SHA-256
> `6e3c54da0f3cff5ac681f5d8453b82463938b812092e3864ab17efd34698e89e`, deploy-guard SHA-256
> `aec4d7bdb577d659bdf7345fdebc5632d017b91928835b537978c886a3abd517`, disabled PCD rollback
> version `6f2aef37-a320-4d78-a186-d9f6e599fd55`, active CRM version
> `97bfa867-b9c0-4846-9307-6cca0a93febc`, staging directory D1
> `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, staging PCD ops D1
> `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, and staging CRM D1
> `9d5e91d3-683b-4070-b511-623e5173ba33`. Authorize the ordered preflight and three Time Travel
> bookmarks, creation and hash-freezing of one fresh deterministic synthetic packet at one fresh
> second-aligned boundary, exact-candidate adapter-only activation with backfill false, the two
> conditional pilot phases, bounded aggregate-only observation and readback, and mandatory rollback
> to the exact disabled PCD version on pass, failure, or timeout. All exclusions and abort thresholds
> recorded in the evidence remain unchanged.
