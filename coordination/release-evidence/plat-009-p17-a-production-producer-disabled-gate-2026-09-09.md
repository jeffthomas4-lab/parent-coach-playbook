# PLAT-009 Gate 9C-P17-A production producer schema and disabled release

Status: **APPROVAL REQUIRED / NO PRODUCTION MUTATION AUTHORIZED BY THIS RECEIPT**

Recorded: 2026-09-09 America/Los_Angeles / UTC

## Purpose

Prepare Parent Coach Desk production as the canonical CRM organization/contact producer while
keeping both producer modes disabled. This gate installs the already-reviewed projection schema,
the exact adapter secret that matches the receiver, and the exact disabled production Worker
artifact. It deliberately stops before selecting an activation boundary, generating a production
backfill manifest, copying an organization or contact, or starting the historical backfill.

Gate 9C-P16-C-R5-B must first finish with a PASS: the production receiver must exist, its two
owner memberships must be active, its PCD source must retain the approved identity-only policy,
and it must still contain no organization or contact projections. If that prerequisite is not
proved at action time, this gate is a no-action stop.

## Exact immutable inputs

### Producer candidate and prebuilt artifact

- Parent Coach Desk candidate: `b4ea1cf04a40e8c579b880bda724d0e087c083da`
- candidate tree: `2ad3deb60fcca5ddcc13639965d973e79e1efc0b`
- deterministic production artifact SHA-256:
  `ec480a93be3dd215bc12dcbd6ff96ee56b3cc5e62b3608d3944f7c55b24ac8e9`
- generated `dist/server/wrangler.json` SHA-256:
  `8483b96bb32a621322aefa4a8c544d503fb1997836a1cf0fbf16032bf907cacb`
- `wrangler.production.jsonc` SHA-256:
  `a7bb8f8a897104fc1e67eed072fa5ea5b7d7067eb6ae7b50998a7324eb4a3758`
- disabled-release PowerShell guard SHA-256:
  `d2816ecde92b1d777b027e64847acbead04a64c8d5c0cfcbc5f273fb55e7c9c4`
- disabled-manifest verifier SHA-256:
  `2e336d7ec33892a61e12b00e91a3ea09a0aaf9ff2b04cef68c65065b11ba0d59`
- production-manifest generator SHA-256:
  `bc0dc0233b518545a1a9101422c58a8bbec5e443292f4ede4efa5f201c495524`

The prebuilt artifact reports source commit
`b4ea1cf04a40e8c579b880bda724d0e087c083da`, build origin `local`, and contains the exact
production D1, R2, KV, rate-limit, asset, schedule, and `CRM_ADAPTER` service bindings. Its
`PCD_CRM_ADAPTER_ENABLED` and `PCD_CRM_BACKFILL_ENABLED` values are both exactly `false`, and
`PCD_CRM_SOURCE_NOT_BEFORE_MS` is absent.

### Directory migrations

The aggregate is SHA-256 over UTF-8 rows formatted as
`<sorted filename> <file SHA-256>\n`.

- `0017_crm_projection_cursor.sql`:
  `e38b65af6aaef0c1cf3b7999ddf206fbf64d42ab770f37b802ee658d6bc5f4ec`
- `0018_crm_projection_revisions.sql`:
  `9b288af0e70890017e876a1f7f96f829679b4981e6b074038827c4e0cc43bcc2`
- `0019_crm_backfill_created_cursor.sql`:
  `fa822c02f74226073e503e9d08f670b87e9100b2a6f640880dd8dab2eef1f95c`
- three-file aggregate:
  `b2aa42d7270a882cfff4ee37a0408b806b19701070c7d00004a58202f9cdb36c`

### Operations migrations

Wrangler's authenticated production ledger reports exactly these 17 files pending, in this order:

1. `0028_org_contacts.sql`
2. `0029_admin_action_receipts.sql`
3. `0029_external_article_receipts.sql`
4. `0030_directory_acquisition.sql`
5. `0031_crm_adapter_outbox.sql`
6. `0032_crm_adapter_historical_backfill.sql`
7. `0033_crm_adapter_backfill_reconciliation.sql`
8. `0034_crm_adapter_outbox_claim_order.sql`
9. `0035_org_contact_context.sql`
10. `0036_crm_adapter_safety_indexes.sql`
11. `0037_crm_adapter_safety_state.sql`
12. `0038_crm_adapter_safety_upgrade.sql`
13. `0039_crm_adapter_atomic_send_cancellation.sql`
14. `0040_crm_adapter_bounded_retractions.sql`
15. `0041_crm_backfill_created_cursor_and_public_contact_safety.sql`
16. `0042_crm_backfill_approval_manifest.sql`
17. `0043_org_contact_dnc_identity.sql`

The 17-file aggregate is
`0daa9bf25c4457289f51f7fc0b905943325b0be8bf6d56facc7dd77aec2d72e5`.
The action-time check must recompute that aggregate and require the pending list to match exactly;
it must not apply a newly added or differently ordered file.

## Exact production identities and current baseline

- directory D1 `activity-radar`: `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`
- operations D1 `parent-coach-desk-ops-production`:
  `b38d5f37-54df-4e0f-9706-023edc12c7fe`
- CRM receiver Worker: `field-forge-crm`
- CRM target D1: `9ea593e2-b5ca-40d8-b7fa-8172e02edb3d`
- PCD Worker: `parent-coach-desk`
- current rollback deployment: created `2026-09-09T16:31:20.410Z`
- current rollback version: `608f4a21-482e-49b4-af85-b24fdb2b34f6`
- receiver secret pack SHA-256:
  `d35e2b02da2fa61669a39df8eb601110467f1303e017292d377801e575b21bf0`
- matching PCD adapter secret fingerprint:
  `d332f102ffeb118f000199fe77e1e45f50f379266b8b86f59f722d5ab3c1ba73`

The authenticated aggregate-only baseline is:

- 198,287 total and live organizations; zero tombstoned organizations;
- 141 live extracted contacts; zero tombstones and zero suppressions;
- 35 contacts have an email or phone channel;
- all 141 retain a source URL;
- zero contacts are currently public-reviewed and therefore zero are currently eligible for CRM
  contact projection;
- all six directory CRM schema objects are absent and the directory ledger has zero entries for
  migrations 0017 through 0019;
- the exact 17 operations migrations above remain pending;
- active PCD version `608f4a21-482e-49b4-af85-b24fdb2b34f6` has no CRM service binding, no CRM
  secret, no producer flags, and no activation boundary.

Every live database read returned `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`. No organization or contact row was exported.

## Local acceptance evidence

- The backfill-manifest generator now requires an explicit `staging` or `production` environment;
  retained regressions prove it no longer hardcodes staging for a production packet.
- The disabled-release verifier rejects a wrong production D1 identity, staging receiver binding,
  either enabled producer flag, and any activation boundary.
- Focused manifest and disabled-release tests: 11 passed, 0 failed.
- Repository check: 645 files, 0 errors, 0 warnings, 384 pre-existing hints.
- Exact production build and manifest verification: passed.
- The guard's authenticated current-user DPAPI validation matched the pack and adapter-secret
  fingerprints above and left zero `pcd-crm-production-secret-*.json` files.

Dependency decision: the release retains first-party Wrangler, the existing manifest verifier,
Node cryptography, and Windows DPAPI. No new package is needed.

## Exact authorized sequence

Approval authorizes one attempt, in this order.

### 1. Final prerequisite and preflight

1. Require a PASS receipt for Gate 9C-P16-C-R5-B and revalidate the receiver's exact Worker,
   version, D1/R2/Queue bindings, two owner memberships, approved PCD source policy, empty Queue,
   and zero organization/contact projections.
2. Revalidate the exact producer candidate, tree, artifact, manifest, config, guards, migration
   components and aggregates, secret-pack hash, adapter-secret fingerprint, PCD rollback version,
   database identities, pending migration list, and aggregate source counts above.
3. Abort before mutation on any mismatch, any newly pending migration, any contact count greater
   than 141 without a separately refreshed manifest, or any public-reviewed contact count other
   than zero.
4. Capture one fresh Time Travel bookmark for each production source D1. Do not export source
   rows or copy a database locally.

### 2. Apply exact forward-only source schema

1. Apply directory migrations 0017, 0018, and 0019 directly, individually, and in order. Do not
   run the unrelated root migration directory and do not alter the existing legacy directory
   ledger.
2. Require the exact new directory column, counter row, three indexes, and two triggers. Require
   every pre-existing organization to retain `crm_projection_revision=0`, the revision counter to
   equal 1, and the organization/tombstone counts to match the frozen baseline.
3. Apply exactly the 17 pending operations migrations through Wrangler's production migration
   ledger. Require no remaining pending operations migration afterward.
4. Require the complete CRM adapter/backfill schema and safety indexes, exactly 141 contacts, 35
   channel-bearing contacts, 141 source-backed contacts, zero tombstones, zero suppressions, zero
   public-reviewed contacts, zero outbox/receipt/backfill/reconciliation rows, and no raw contact
   values in any readback.

### 3. Deploy the exact disabled producer once

1. Run the exact disabled-release guard once with its exact candidate, artifact hash, manifest
   hash, encrypted pack, `-Execute`, and typed confirmation
   `DEPLOY parent-coach-desk CRM DISABLED TO PRODUCTION`.
2. The guard must recheck all local identities, decrypt only the matching adapter value under the
   current Windows DPAPI user, create a one-key delete-on-close Wrangler secrets file, and deploy
   only the prebuilt artifact. No secret value may appear in stdout, arguments, environment,
   persistent plaintext, evidence, or source control.
3. Require one active production PCD version at 100 percent with the exact source candidate,
   directory and ops D1s, `CRM_ADAPTER` bound to `field-forge-crm`, the named adapter secret,
   existing schedules, both producer flags exactly `false`, and no activation boundary.

### 4. Prove disabled no-op and stop

1. Wait across one one-minute scheduled boundary.
2. Require zero CRM outbox events, receipts, backfill runs/chunks/subjects, reconciliation rows,
   retractions, dead events, and receiver Queue messages; require zero receiver organization and
   contact projections.
3. Recheck the source aggregates, schema, migration ledger, exact active Worker bindings and
   flags, encrypted-pack hash, and zero ephemeral plaintext files.
4. Record bookmarks, migration receipts, version/deployment IDs, secret-name fingerprint,
   aggregate-only readbacks, and the final disabled no-op result. Stop.

## Abort and rollback

Before the first mutation, any mismatch is a no-action stop. The two source migrations are
forward-only and both producer modes remain disabled, so a successfully applied compatible
migration is retained if a later independent step fails; this avoids erasing legitimate
production writes made after a bookmark merely to make the release look atomic.

If a migration command reports partial application or an incompatible schema, stop the producer,
inspect whether legitimate post-bookmark writes exist, and restore only the affected D1 to its
fresh bookmark when doing so cannot erase a legitimate write. Otherwise retain the additive
schema and hold for exact reconciliation. Never guess.

If deployment or its readback fails, immediately return 100 percent traffic to version
`608f4a21-482e-49b4-af85-b24fdb2b34f6` and prove the CRM service, secret, producer flags, and
activation boundary are absent. Do not remove or recreate a D1, Queue, R2 bucket, Access object,
Turnstile widget, or CRM receiver.

Any unexpected outbox, receipt, backfill, Queue, or receiver projection while the flags are false
requires the same Worker rollback and a stop. No production historical manifest may be generated
from a failed or partially verified P17-A run.

## Exclusions

This gate does not authorize a CRM receiver change; source-policy change; activation boundary;
production backfill manifest; enabling either producer flag; organization or contact copy;
historical transfer; creating or applying a synthetic packet; direct row seed; contact
public-review decision; source-data export; R2 object write; outbound send; communication
provider; payment; privacy/legal text; production outreach; consent inference; SightSmash
producer change; or any MedConfRadar resource. It authorizes only the exact production source
schema, the matching PCD adapter secret transport inside the guarded disabled deployment, and the
disabled PCD Worker release described above.

## Performance review

- approximate algorithmic complexity: `O(198287 + 141)` for additive index construction and the
  bounded existing-contact identity backfill
- DB query count on primary path: three exact directory migration files, one 17-file operations
  migration apply, bounded schema/ledger/aggregate reads, and one disabled no-op readback
- external API calls: two Time Travel bookmarks, four migration actions, one guarded Worker
  deploy, and bounded Worker/D1/receiver readbacks
- queue jobs created: zero by contract
- expected memory behavior: bounded migration/config metadata and one small adapter secret held
  only in the guarded process; source rows remain in D1
- likely scaling bottleneck: production index construction over 198,287 organizations, not this
  disabled Worker release

## Approval statement

> Approve CRM Gate 9C-P17-A exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using PCD
> candidate `b4ea1cf04a40e8c579b880bda724d0e087c083da`, production artifact SHA-256
> `ec480a93be3dd215bc12dcbd6ff96ee56b3cc5e62b3608d3944f7c55b24ac8e9`, generated manifest
> SHA-256 `8483b96bb32a621322aefa4a8c544d503fb1997836a1cf0fbf16032bf907cacb`, directory migration
> aggregate `b2aa42d7270a882cfff4ee37a0408b806b19701070c7d00004a58202f9cdb36c`, operations migration
> aggregate `0daa9bf25c4457289f51f7fc0b905943325b0be8bf6d56facc7dd77aec2d72e5`, disabled-release guard
> SHA-256 `d2816ecde92b1d777b027e64847acbead04a64c8d5c0cfcbc5f273fb55e7c9c4`, encrypted secret-pack
> SHA-256 `d35e2b02da2fa61669a39df8eb601110467f1303e017292d377801e575b21bf0`, production directory D1
> `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`, production operations D1
> `b38d5f37-54df-4e0f-9706-023edc12c7fe`, and rollback version
> `608f4a21-482e-49b4-af85-b24fdb2b34f6`. Authorize the prerequisite checks, two source D1
> bookmarks, exactly directory migrations 0017-0019, exactly the 17 recorded operations
> migrations, one guarded exact disabled PCD deployment carrying only the matching adapter secret,
> the one-boundary disabled no-op proof, readbacks, rollback, abort thresholds, and exclusions
> recorded there. Execute only after Gate 9C-P16-C-R5-B has a current PASS receipt.
