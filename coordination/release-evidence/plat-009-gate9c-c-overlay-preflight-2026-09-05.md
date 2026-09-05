# PLAT-009 Gate 9C-C activation overlay and action-time preflight

Status: **LOCAL PASS / REMOTE ACTIVATION HOLD**
Recorded: 2026-09-05T08:12:15-07:00

## Candidate identity

- PCD activation-overlay candidate: `5a3cc226661f24a6a4c7bd3dc5b997007c16ca04`
- Candidate tree: `5a7366360c0bfdd75dcb71eb679ea078326cc685`
- Parent evidence commit: `82455e6ae0b54fec1641b31791ca2519ffa873e1`
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

## Red-first and verification evidence

- Activation derivation test: **1 failed / 9 total** before the overlay existed.
- Derived-path and cleanup tests: **2 failed / 11 total** before the exclusive-handle repair.
- Final focused suite: **PASS, 11/11**.
- Full local activation dry run with fixed test boundary `1788566400000`: application build PASS,
  exact derived manifest PASS, no deploy performed, and exact activation-confirmation instruction
  printed. The build-generated manifest and seven untracked image artifacts were removed/restored;
  no activation config remained.
- `git diff --check`: PASS before candidate commit.
- Independent QA: **CLEAN**, including injected open, write, close, and deploy failure probes.
- Independent Security: **CLEAN**, including exact manifest, confirmation, cleanup, and path checks.
- Efficiency: no material finding; shallow manifest copy and compact temporary JSON retained
  bounded memory and file size.
- Simplicity: removed the ownership boolean and test-only suffix input; the deployment seam remains
  because it is required to prove cleanup failure paths locally without a provider action.

## PERFORMANCE REVIEW

- approximate algorithmic complexity: `O(a + m)` over bounded CLI arguments and the generated
  manifest; no source dataset is scanned
- DB query count on primary path: `0` for the deploy tool; the separate preflight used five
  successful aggregate `SELECT` readbacks plus three non-mutating failed attempts with stale
  schema names before the corrected statements ran
- external API calls: `0` for invalid input and local dry run; a confirmed activation performs
  exactly one existing Wrangler deploy invocation, not exercised here; preflight used bounded D1
  and Worker-version readbacks
- queue jobs created: `0`
- expected memory behavior: `O(m)`, one shallow manifest copy with a copied `vars` object and one
  compact JSON string bounded by deployment-manifest size
- likely scaling bottleneck: the existing full application build and later 10-event-per-minute
  receiver pump, not overlay preparation

## Retained gate boundary

No staging or production row was copied or seeded. No activation boundary was chosen for real use,
no producer flag was enabled, no Worker was deployed, and no export, send, secret, provider, or
production change occurred.

Gate 9C-C still requires explicit authorization for an action-time boundary, backup/bookmarks,
the exact pilot dataset and row hashes, deployment of candidate
`5a3cc226661f24a6a4c7bd3dc5b997007c16ca04`, bounded activation observation, abort thresholds,
and return to the disabled version. Full historical transfer remains a later gate and must refresh
the complete production inventory at its own boundary.
