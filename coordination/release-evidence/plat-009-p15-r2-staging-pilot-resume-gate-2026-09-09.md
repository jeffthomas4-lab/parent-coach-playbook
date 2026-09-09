# PLAT-009 Gate 9C-P15-R2 hosted staging pilot resume

Status: **APPROVAL REQUIRED / NO ADDITIONAL REMOTE MUTATION AUTHORIZED BY THIS RECEIPT**

Recorded: 2026-09-09 America/Los_Angeles / UTC

## Purpose

Resume only phase 2 of the fixed synthetic Parent Coach Desk to portfolio-CRM staging pilot after
the approved P15-R attempt stopped at its first abort threshold and completed mandatory rollback.
The three fictional organizations already reached the CRM exactly once. No contact mutation,
contact event, replay, historical transfer, or production action occurred.

This replacement gate preserves that valid phase-1 state. It authorizes one fresh action-time
producer activation and a phase-two-only packet that proves the existing three organization
receipts before inserting the same eight fixed fictional contacts. It does not authorize deleting,
restoring, or replaying the three organization projections.

## P15-R abort and rollback receipt

The approved attempt used boundary `1788973413000` and deployed PCD candidate
`e118783a5d8b8896076dcf029665509097e35c4b` as enabled version
`70610c73-ee21-4e9c-acdd-cbc44d9ce07e`, deployment
`2248d81c-9a06-4c0d-86d8-c4a4890064be`.

After hash-verified preflights, only `01-directory-organizations.sql` was applied. The result was
exactly three delivered `organization.upserted.v1` events, three distinct 2xx receiver receipts,
and three active CRM organization projections. The packet's organization receipt gate then
reported zero instead of three. Investigation established that receiver
`crm_adapter_projection_receipts.content_hash` canonically equals
`json_extract(crm_adapter_outbox.payload_json,'$.payload.sourceVersion')`; the generator had
incorrectly compared it with the envelope `crm_adapter_outbox.payload_hash`.

The abort threshold fired before `02-ops-contacts.sql`. The executor did not apply contacts or
replay, did not generate a substitute packet, and did not restore or delete data. Mandatory
rollback immediately returned the producer to exact disabled version
`6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100% in deployment
`217db612-4ae2-4a4b-b49a-a42b86d89a1b`.

Post-action bookmarks recorded by the consumed attempt were:

- directory: `0000007c-00000000-000050e1-481a8b123e55cca6bc9e88b50090ca8a`
- PCD operations: `00000034-00000000-000050e1-60de312fd018beceb5b34cccba00eec7`
- CRM: `000000d3-00000000-000050e1-1537df1023c159470768fec9018d1108`

These bookmarks are evidence only. This gate does not authorize a Time Travel restore.

## Exact immutable inputs

### PCD producer repair

- source candidate: `9558d358c800c79fbad0cba3a7226dd8cdd5ce26`
- candidate tree: `7773908955984b81e85f221b0771c1bbbc031e98`
- packet generator: `scripts/build-crm-staging-pilot.mjs`
- packet-generator SHA-256:
  `184ec97d130c66fec18cb3fbe8ca80343f1ec5a6f94c016e4a2b3d326496c669`
- deploy guard: `scripts/deploy-staging-verified.mjs`
- deploy-guard SHA-256:
  `44d4fc95afc04cc752784c499096b42d387e3b154d12700a5d5eca8e2b5a3119`
- complete prepared `dist` SHA-256:
  `1da2baa5c440d5b09ee30855d32b8d7de77fd56a892a75bf36645ddd0fdea37c`
- mandatory disabled rollback version:
  `6f2aef37-a320-4d78-a186-d9f6e599fd55`

The repair changes only the synthetic pilot generator, its deployment guard transport, and
retained tests. It binds receipt equality to the canonical source-version hash, allows an explicit
older organization-receipt boundary, emits no directory mutation in resume mode, and invokes the
repository's first-party Wrangler binary directly so Windows npm-exec banners cannot corrupt JSON
or split direct D1 commands.

### CRM receiver

- receiver candidate: `4dd8794b8006c075bcda6905f5a4dda283a0378a`
- current active staging version: `55a821c2-8d5b-4265-a70a-bf8c2df11c70`
- current deployment: `9e8a0daa-6647-4882-bbf9-c3a13f283492`
- source: `source-pcd-activity-radar`
- current source policy: approved
- allowed uses: `["identity_projection","professional_research"]`
- prohibited uses: `["infer_consent","automated_sending"]`

### Exact staging resources

- directory D1: `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`
- PCD operations D1: `7f0da00d-bc98-464f-8702-ce0fb381dd5e`
- CRM D1: `9d5e91d3-683b-4070-b511-623e5173ba33`
- receiver Worker: `field-forge-crm-staging`
- producer Worker: `parent-coach-desk-staging`
- producer workspace: `pcd-activity-radar`
- target workspace: `ws-sightsmash`
- completed organization packet boundary: `1788973413000`
- completed organization authority time: `1788973414000`

## Authenticated read-only resume baseline

Authenticated direct `d1 execute --command` SELECTs on 2026-09-09 each returned
`success=true`, `changes=0`, `rows_written=0`, and `changed_db=false`:

- directory: exactly three live fixture organizations; all three have positive projection
  revisions, with the fixed revisions ranging from 1 through 3
- PCD operations: zero pilot contacts, one adapter-control row, exactly three fixture-organization
  outbox rows, zero pilot-contact outbox rows, three organization projection receipts, and exactly
  three canonical source-version-matched delivered organization receipts at authority time
  `1788973414000`
- CRM: exactly three active PCD adapter organization projections, zero active pilot contact
  projections, zero pilot DNC restrictions, and zero suppressed pilot contact points
- source review: approved with both required allowed uses and both fail-closed prohibited uses,
  plus a recorded reviewer and review time
- deployments: producer disabled rollback version and receiver version above are each active at
  100%

One CRM SELECT launched concurrently with the other two lost the local Wrangler authentication
lease and returned before SQL execution. Its immediate serial retry returned the successful
read-only metadata above. No failed or successful baseline command contained a mutation.

## Exact authorized sequence

Approval authorizes one staging-only resume attempt, in this order.

### 1. Revalidate and capture recovery points

1. Recheck the exact candidates, trees, physical script hashes, complete prepared producer
   artifact, active versions, D1 identities, bindings, secret names without values, approved source
   policy, and the authenticated aggregate baseline above.
2. Capture fresh pre-action Time Travel bookmarks for the three exact staging D1 databases.
3. Abort before mutation on any mismatch. A bookmark does not authorize a restore.

### 2. Generate and freeze one phase-two resume packet

1. Choose one fresh positive second-aligned activation boundary inside the unchanged 15-minute
   generator/deploy-guard window.
2. Run the exact generator once with that fresh boundary, exact
   `--organization-receipt-boundary-ms 1788973413000`, and a new ignored `backups/` directory.
3. Require manifest mode `phase_two_resume`, classification `synthetic_nonproduction`,
   `remoteExecutionAuthorized=false`, the old organization receipt boundary, the fresh activation
   boundary, the fixed three fictional organizations, and the fixed eight fictional contacts.
4. Require exactly five SQL files plus `manifest.json`: `00-ops-preflight.sql`,
   `02-ops-contacts.sql`, `03-ops-replay.sql`, `91-ops-verification.sql`, and
   `92-crm-verification.sql`. No directory preflight, directory mutation, or directory verification
   file may exist.
5. Before remote use, independently recompute and record all six physical byte SHA-256 values and
   the sorted compact-JSON aggregate. Require every SQL byte count and hash to equal the manifest.

No user round trip occurs between generation and execution. If the fresh boundary leaves the
guard window before enabled deployment begins, this attempt ends; no second packet is authorized.

### 3. Activate only the repaired producer and prove prerequisites

1. Use the exact repaired deploy guard and prebuilt artifact hash to deploy only candidate
   `9558d358c800c79fbad0cba3a7226dd8cdd5ce26` with
   `PCD_CRM_ADAPTER_ENABLED=true`, `PCD_CRM_PILOT_MODE=true`,
   `PCD_CRM_BACKFILL_ENABLED=false`, and
   `PCD_CRM_SOURCE_NOT_BEFORE_MS=<fresh boundary>`.
2. Keep every unrelated flag, binding, secret name, resource, schedule, and identity unchanged;
   require the new version at 100%.
3. Run packet and CRM preflights through direct `--command` SELECTs only. Require zero pilot
   contacts, three exact canonical delivered organization receipts at the old boundary, three
   active CRM organization projections, zero active pilot contact projections, zero pilot DNC
   restrictions, and zero suppressed pilot contact points.
4. Do not apply any directory SQL and do not re-approve the source.

### 4. Apply contacts and prove exact projection behavior

1. Apply only hash-verified `02-ops-contacts.sql` to the exact PCD operations D1. Its embedded
   receipt gate must insert all eight fixed fictional contacts or zero; a partial cardinality is an
   abort.
2. Poll no more than once per minute for at most ten minutes.
3. Require exactly two delivered `contact.observed.v1` events, one email and one phone; one
   delivered raw-free `contact.deleted.v1` event for the do-not-contact identity; five terminal
   deferred/held/rejected controls; three active CRM organizations; two active CRM contacts; one
   adapter-origin do-not-contact restriction; and zero CRM contact points for the denied identity.
4. Require producer/receiver equality on event ID, subject type and ID, authority time, canonical
   source-version content hash, source sequence, producer, target workspace, event type, boundary,
   delivery status, receiver receipt ID, 2xx status, and delivery time.
5. Record the three contact event IDs, idempotency keys, source sequences, payload hashes,
   receiver receipt IDs, attempt counts, and send-attempt counts. Require three distinct event,
   idempotency, and receipt IDs with both counters equal to 1.

### 5. Prove replay and reconciliation

1. Apply only hash-verified `03-ops-replay.sql` once. Require exactly three changed rows; zero or
   any other value is an abort and does not authorize an edit or reapplication.
2. Poll no more than once per minute for at most ten minutes while the normal signed dispatcher
   replays the two observations and raw-free DNC event.
3. Require the same event IDs, idempotency keys, sequences, payload hashes, and receiver receipt
   IDs, each with `attempt_count=2` and `send_attempt_count=2`; require no duplicate organization,
   contact, contact-point, restriction, inbox, or audit row and unchanged projection counts.
4. Observe the bounded reconciliation contract over the three completed organization events and
   three contact events. Require one new receipt with zero missing, duplicate, stale,
   unauthorized, or mismatched events and receiver high water at or beyond the pilot tail.

### 6. Mandatory rollback and final evidence

Whether phase 2 passes, fails, or times out after activation, immediately deploy exact disabled
PCD version `6f2aef37-a320-4d78-a186-d9f6e599fd55` at 100%. Require both producer flags false,
pilot mode absent as recorded on that version, no activation boundary, and unchanged bindings.
Capture post-action bookmarks and aggregate-only readbacks for all three staging databases. Record
packet hashes, phase receipts, replay, reconciliation, rollback version, and final pending/dead
aggregates.

Do not restore D1, delete synthetic rows, repeat a mutating phase, or continue into historical
transfer under this gate. Recovery requires a separately recorded incident gate.

## Abort thresholds

Abort before mutation, or disable immediately after activation, on any candidate, tree, physical
hash, artifact, account, D1 UUID, binding, secret-name, source-policy, flag, boundary, version,
schema, or cardinality mismatch; any directory mutation file; any partial contact write; duplicate
invocation; unexpected event; raw contact value in the DNC payload; pending or dead event after the
observation ceiling; non-2xx receiver response; missing or mismatched canonical receipt; projection
excess; replay identity change; reconciliation finding; or failure to reach exact results inside
ten minutes.

No failure authorizes `force`, a second packet, a wider contact set, historical backfill, database
restore, production substitution, or policy relaxation.

## Exclusions

This gate does not authorize a directory mutation; reapplying organization phase 1; source-policy
change; synthetic-row deletion; database restore; production change; production PCD deployment or
secret; historical organization/contact copying or seeding; the 198,287-organization transfer; a
backfill run; real extracted contact projection; non-backup export; outbound send; communication
provider; consent inference; privacy/legal text; payment activity; secret value read, creation,
replacement, or rotation; new provider/resource creation; or any MedConfRadar access. Pilot success
does not implicitly approve those actions.

## Local acceptance evidence

- Retained red-first receipt test reproduced the live defect by proving envelope `payload_hash`
  differs from canonical `payload.sourceVersion`; the old join rejected all three valid receipts.
- Final synthetic pilot integration suite passed 4/4, including explicit resume mode, old-boundary
  receipt gating, no directory artifacts, all-or-zero insertion, dispositions, and replay.
- Deployment guard and read-only transport suites passed 31/31; adapter integration passed 74/74.
- Typecheck completed across 643 files with 0 errors and 0 warnings.
- The complete candidate build succeeded, `build-info.json` names the full source candidate, and
  its complete artifact hashes to the immutable value above.

## Performance review

- approximate algorithmic complexity: `O(8)` at fixed synthetic contact cardinality; no corpus scan
- DB query count on primary path: two preflight SELECTs, one fixed eight-row contact mutation, one
  three-row replay mutation, bounded observation SELECTs, and one six-event reconciliation tick
- external API calls: three pre-action bookmarks, one enabled producer deploy, two D1 mutations,
  bounded once-per-minute readbacks, one mandatory rollback deploy, and three post-action bookmarks
- queue jobs created: zero; the producer creates exactly three contact outbox events
- expected memory behavior: `O(1)` at fixed packet and six-event reconciliation size
- likely scaling bottleneck: one-minute producer scheduling and receiver retry latency, bounded by
  two ten-minute observation ceilings

## Dependency decision

Live npm, PyPI, and GitHub searches retained the maintained first-party Wrangler already in the
repository. No additional package fits or is needed for the fixed SQL, hashing, or deployment
transport, so this repair adds no dependency.

## Approval statement

> Approve CRM Gate 9C-P15-R2 exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using
> PCD candidate `9558d358c800c79fbad0cba3a7226dd8cdd5ce26`, candidate tree
> `7773908955984b81e85f221b0771c1bbbc031e98`, complete PCD artifact SHA-256
> `1da2baa5c440d5b09ee30855d32b8d7de77fd56a892a75bf36645ddd0fdea37c`, packet-generator
> SHA-256 `184ec97d130c66fec18cb3fbe8ca80343f1ec5a6f94c016e4a2b3d326496c669`, and deploy-guard
> SHA-256 `44d4fc95afc04cc752784c499096b42d387e3b154d12700a5d5eca8e2b5a3119`, with CRM candidate
> `4dd8794b8006c075bcda6905f5a4dda283a0378a`, active CRM version
> `55a821c2-8d5b-4265-a70a-bf8c2df11c70`, disabled PCD rollback version
> `6f2aef37-a320-4d78-a186-d9f6e599fd55`, completed organization boundary
> `1788973413000`, staging directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`, PCD operations
> D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`, and CRM D1
> `9d5e91d3-683b-4070-b511-623e5173ba33`. Authorize the exact authenticated preflight, three
> fresh bookmarks, one immediate action-time generation and hash-freeze of the six-file
> phase-two-only packet, exact artifact-verified adapter-only activation, contact phase, replay,
> reconciliation, bounded observations, mandatory rollback, final readbacks, abort thresholds,
> and exclusions recorded there.
