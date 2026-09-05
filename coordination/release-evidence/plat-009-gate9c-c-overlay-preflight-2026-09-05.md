# PLAT-009 Gate 9C-C activation overlay and action-time preflight

Status: **LOCAL PASS / REMOTE ACTIVATION HOLD**
Recorded: 2026-09-05T08:12:15-07:00

## Candidate identity

- PCD activation-overlay and synthetic-pilot candidate: `100347e48a411387964065d5a6a700332688a370`
- Candidate tree: `a42cec3611986665b52c1f912061cf12bcef466f`
- Parent evidence commit: `bfa493c364db788b64b7189fc96c6c58bb6f068e`
- CRM staging receiver remains candidate: `25342fffba8d3cfc9a8272211c8f0763ed404f7d`

## Action-time aggregate inventory

All database commands were `SELECT`-only Wrangler D1 readbacks. They returned aggregate counts,
not organization rows or contact values. Every successful response reported `changes: 0`,
`rows_written: 0`, and `changed_db: false`.

Production authorities:

- `activity-radar` D1 `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`: **198,287** organizations,
  0 tombstoned, 0 invalid `updated_at` values.
- `parent-coach-desk-ops-production` D1
  `b38d5f37-54df-4e0f-9706-023edc12c7fe`: **141** extracted contacts,
  0 tombstoned, 0 suppressed, 35 with email or phone, 141 with a source URL, 0 public rows,
  and 0 invalid `updated_at` values.
- Since the 2026-09-04 snapshot, organizations are unchanged while contacts increased from 108
  to 141 and channel-bearing contacts increased from 16 to 35. Extraction is active, so these
  counts remain a preflight snapshot rather than a future load receipt.

Staging authorities:

- Directory D1 `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`: 10 synthetic organizations and
  0 invalid `updated_at` values.
- Ops D1 `7f0da00d-bc98-464f-8702-ce0fb381dd5e`: 0 contacts, controls, outbox rows,
  projection receipts, reconciliation receipts, backfill runs, backfill chunks, reconciliation
  windows, backfill subjects, or contact-retraction runs.
- CRM D1 `9d5e91d3-683b-4070-b511-623e5173ba33`: 0 organizations, people, contact points,
  workspace organizations, workspace contacts, campaigns, import batches, export artifacts,
  touches, outcomes, inbox receipts, or dead letters.

The action-time readback corrected two stale names in the earlier prose-only query description:
the migrated tables are `crm_contact_retraction_runs`, `import_batches`, and `export_artifacts`.
No schema or row was changed while correcting the aggregate queries.

## Active staging versions

- PCD Worker `parent-coach-desk-staging`: version
  `16e35632-f159-47a1-8c05-6e6a327340b2`, message
  `Gate 9C-B exact candidate e0dc5f89; adapter and backfill disabled`.
- CRM Worker `field-forge-crm-staging`: version
  `37569291-24e8-45ae-8230-4bc593349684`, message
  `Gate 9C-B exact candidate 25342fff; infrastructure only`.
- Fresh PCD version inspection confirms the exact staging D1, R2, KV, and CRM Service Binding;
  `PCD_CRM_ADAPTER_ENABLED=false`, `PCD_CRM_BACKFILL_ENABLED=false`, required secret name
  present, and no activation boundary.
- Fresh CRM version inspection confirms staging D1, artifacts R2, jobs Queue, adapter secret
  name, target workspace, and staging environment bindings. No secret value was read or recorded.

## Activation-overlay repair

The committed `wrangler.jsonc` and generated base manifest remain disabled and boundary-free.
For an explicitly supplied positive second-aligned boundary, the verified deploy tool now:

1. builds and validates the exact disabled base manifest;
2. derives a new manifest in memory that changes only the adapter flag and boundary while forcing
   backfill false;
3. validates the complete derived resource/flag contract;
4. after the distinct activation confirmation, exclusively opens a uniquely named config under
   `dist/server`, writes the derived manifest, deploys only that file, and unconditionally removes
   the owned file after success or any post-open failure.

An open failure owns no file and therefore removes nothing. Write, close, and deployment failures
all stop before false success and attempt owned-file cleanup. The caller cannot supply the temporary
path or filename suffix.

Dependency decision: no dependency was added. Native Node file handles and JSON plus the existing
Wrangler command path provide the smallest testable implementation.

## Synthetic pilot package readiness

`scripts/build-crm-staging-pilot.mjs` now creates a new local directory containing six
SHA-256-pinned SQL artifacts and a manifest. It accepts no implicit/default boundary: the supplied
boundary must be a positive safe integer, second-aligned, and within 15 minutes of generation.
Duplicate CLI flags fail rather than silently replacing the first value. The generated SQL has no
Wrangler, deployment, or feature-flag command and uses only fictional `example.invalid` channels.

The fixed pilot is intentionally small and two-phase:

1. update the three existing staging fixture organizations (soccer, basketball, swimming) after
   the exact boundary, yielding three live organization revisions;
2. only after the current-boundary events for all three exact organizations are delivered and
   receipted, insert eight synthetic contacts;
3. expect two eligible observations (one email, one phone) and one fail-closed result for each of
   private, suppressed, minor/nonprofessional, unknown-context hold, missing source, and missing
   channel.

Phase two enforces its own receipt precondition in SQL. Receipt and event must match on event ID,
subject type, subject ID, and authority timestamp, and the event must also match the exact producer,
target workspace, event type, boundary-derived timestamp, and delivered status. Zero, partial,
forged/shared-event, wrong-type, wrong-subject, wrong-authority, wrong-producer, wrong-target, and
non-delivered receipt sets insert zero contacts. The SQL remains a no-op instead of partially
seeding when the gate is not satisfied.

A local CLI dry run generated the full packet successfully. Its boundary and hashes are validation
evidence only and are deliberately not an activation approval: the 15-minute action window has
expired, so Gate 9C-C must generate and hash a fresh packet at execution time.

## Red-first and verification evidence

- Activation derivation test: **1 failed / 9 total** before the overlay existed.
- Derived-path and cleanup tests: **2 failed / 11 total** before the exclusive-handle repair.
- Final focused suite: **PASS, 11/11**.
- Synthetic-pilot red-first sequence: missing generator failed; the first implementation then
  failed three retained cases for epoch boundary, duplicate CLI arguments, and early phase-two
  insertion; the first receipt repair then failed the forged/shared-event case before subject
  equality was added.
- Final combined pilot/activation suite: **PASS, 14/14**.
- Full CRM adapter integration suite: **PASS, 63/63** in 213.30 seconds.
- TypeScript (`tsc --noEmit`): **PASS**. The activation-guard mocks were narrowed to the Node
  `PathLike`/`FileHandle` test seam without changing runtime code; the 11 activation tests remained
  green.
- Full local activation dry run with fixed test boundary `1788566400000`: application build PASS,
  exact derived manifest PASS, no deploy performed, and exact activation-confirmation instruction
  printed. The build-generated manifest and seven untracked image artifacts were removed/restored;
  no activation config remained.
- `git diff --check`: PASS before candidate commit.
- Independent QA: **CLEAN**, including injected open, write, close, and deploy failure probes.
- Independent Security: **CLEAN**, including exact manifest, confirmation, cleanup, and path checks.
- Independent pilot QA: **CLEAN** after finding the phase-order, epoch-boundary, duplicate-argument,
  and forged-receipt defects. Its final negative matrix confirmed zero contact inserts for every
  inexact receipt case and eight only for the exact gate.
- Independent pilot data-safety review: **CLEAN** after independently reproducing and closing the
  forged-receipt defect.
- Efficiency: no material finding; shallow manifest copy and compact temporary JSON retained
  bounded memory and file size. Pilot test artifact reads were reduced from 14 to 6.
- Simplicity: removed the ownership boolean and test-only suffix input; the deployment seam remains
  because it is required to prove cleanup failure paths locally without a provider action. The
  pilot pass removed duplicate boundary parsing, a redundant date-range check, and unnecessary
  `DISTINCT` work under the receipt primary key.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: `O(a + m)` over bounded CLI arguments and generated
  manifests; pilot cardinality is fixed at 3 organizations, 8 contacts, and 6 artifacts; no source
  dataset is scanned
- DB query count on primary path: `0` for both local generators; the generated pilot packet contains
  10 bounded statements (6 reads and 4 writes); the separate provider preflight used five
  successful aggregate `SELECT` readbacks plus three non-mutating failed attempts with stale
  schema names before the corrected statements ran
- external API calls: `0` for invalid input and local dry run; a confirmed activation performs
  exactly one existing Wrangler deploy invocation, not exercised here; preflight used bounded D1
  and Worker-version readbacks
- queue jobs created: `0`
- expected memory behavior: `O(m)`, one shallow deployment-manifest copy plus six small SQL strings
  and one pilot manifest; all pilot structures have fixed cardinality
- likely scaling bottleneck: the existing full application build and later 10-event-per-minute
  receiver pump, not overlay preparation

## Retained gate boundary

No staging or production row was copied or seeded. No activation boundary was chosen for real use,
no producer flag was enabled, no Worker was deployed, and no export, send, secret, provider, or
production change occurred.

Gate 9C-C still requires explicit authorization for an action-time boundary, backup/bookmarks,
the freshly generated exact pilot artifact hashes, deployment of candidate
`100347e48a411387964065d5a6a700332688a370`, applying the two synthetic pilot phases, bounded
activation observation, abort thresholds,
and return to the disabled version. Full historical transfer remains a later gate and must refresh
the complete production inventory at its own boundary.
