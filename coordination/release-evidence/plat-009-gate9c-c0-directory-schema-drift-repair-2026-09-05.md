# PLAT-009 Gate 9C-C0 directory schema drift repair

Status: **LOCAL PASS / REMOTE SCHEMA REPAIR HOLD**

Recorded: 2026-09-05

## Exact local candidate

- PCD candidate: `f1bc696720d65c578b513165e2f62756da2fe2f5`
- PCD candidate tree: `005e4b0370d8145acb1770d9ef79d37af81a2afb`
- Directory migration: `0015_org_editorial_and_sync.sql`
- Migration SHA-256: `8bee241dabe4e5369f2f417b775f0d74f92a28c3a15733781274ea600a97d182`
- One-file migration aggregate: `721b8dec77d8800b72430d64ea769c2dcf233369d7e7deea6446a9a11493759c`
- Aggregate algorithm: `sha256(utf8(compact-json(sorted [{name,sha256}])))`
- Staging directory D1: `parent-coach-desk-directory-staging`
  (`6aa26d4d-d545-4eb7-bf50-34d45f2182ad`)

No remote database, Worker, binding, flag, activation boundary, organization, or contact was changed
while producing this evidence.

## Finding

The controlled Gate 9C-B staging schema readback found the base `organizations` table and 10
synthetic fixture rows, but none of the 18 columns or seven indexes from canonical directory
migration `0015`. Gate 9C-B then executed only reviewed forward-only migrations `0017` through
`0019`, because the fixture's legacy migration ledger is empty and a full lineage replay is unsafe.
Those later migrations added the CRM projection cursor, revision control, and triggers, but did not
add `organizations.deleted_at` or `organizations.content_hash`.

The production adapter and the approved staging pilot both read `organizations.deleted_at`; the
adapter also reads `content_hash`. Enabling either producer against the current staging directory
would therefore fail at runtime. The schema gap was found before any synthetic packet was created
or applied and while both producer flags remained false with no activation boundary.

Migration `0015` is the canonical source for the missing fields. It is forward-only for this exact
fixture shape: all of its target columns and index names are absent, while its base table and index
inputs are present. Its defaults keep every existing row private/pending and do not assign an
external key, CRM id, content hash, reviewer, or deletion tombstone.

## Local repair

`scripts/deploy-staging-verified.mjs` now fails closed before a CRM-enabled staging deploy unless it
can read compatible metadata from the hard-pinned staging directory D1 id above. One Wrangler
invocation runs only:

1. `PRAGMA table_info("organizations")`; and
2. a filtered `sqlite_schema` read for the revision table, required indexes, and required triggers.

The guard requires every adapter-used organization column and the exact canonical normalized DDL
for the CRM revision table, revision index, insert trigger, and update trigger. It rejects a missing
column, wrong object owner, decoy object name, incomplete/no-op trigger, malformed or unsuccessful
readback, command failure, and comment-spoofed SQL. The result is rechecked before deployment and
after the existing 15-minute activation-boundary validation. A disabled deployment performs no
schema read. Callers cannot inject a replacement production schema reader.

## Retained red-first and independent review evidence

1. The first regression failed because the schema validator did not exist.
2. Security found that an injected schema-reader seam could bypass the exact D1 read; the seam was
   removed.
3. QA found that name-only decoy objects and an incomplete revision table passed; exact ownership
   and DDL checks were added.
4. QA and Security found that regex fragments could be satisfied by comments or partial/no-op
   triggers; the validator now compares complete normalized canonical DDL.
5. The Simplifier removed a redundant revision-table PRAGMA because exact table DDL already proves
   its columns and constraints.
6. Final independent QA and Security verdicts were Clean. Efficiency found no budget breach.

Verification:

- `tests/staging-deploy-guard.test.ts`: PASS, 26/26
- `tests/crm-staging-pilot.integration.test.ts`: PASS, 3/3
- `node --check scripts/deploy-staging-verified.mjs`: PASS
- `git diff --check`: PASS
- Astro check: 0 errors, 0 warnings, 384 pre-existing hints
- Full `tests/crm-adapter.test.ts`: environment harness HOLD; the native runtime stalled without an
  assertion failure and was stopped. The adapter source was not changed by this repair.

## Proposed exact remote repair gate

The next remote action must be separately approved and must execute in this order:

1. Recheck the candidate, tree, migration hash, and aggregate above.
2. Capture a pre-action Time Travel bookmark for the exact staging directory D1.
3. Run schema-only and aggregate-only preflight. Abort unless:
   - the table has exactly the expected post-`0017`/`0018` organization shape;
   - all 18 migration-`0015` columns are absent: `pcd_status`, `verified`, `reviewed_by`,
     `reviewed_at`, `review_notes`, `reject_reason_code`, `verification_method`,
     `last_edited_at`, `last_edited_by`, `pcd_confidence`, `public_contact_label`, `external_key`,
     `content_hash`, `syndication_status`, `syndicated_at`, `crm_external_id`, `crm_synced_at`, and
     `deleted_at`;
   - all seven migration-`0015` index names are absent: `idx_org_pcd_status`, `idx_org_verified`,
     `idx_org_reviewed_at`, `idx_org_external_key`, `idx_org_crm_id`, `idx_org_syndication`, and
     `idx_org_deleted_at`;
   - the exact canonical `0018` revision table, revision index, and two triggers remain present;
   - the existing aggregate organization count remains 10; and
   - both CRM producer flags remain false and no activation boundary exists.
4. Execute exactly `0015_org_editorial_and_sync.sql` directly against that D1. Do not run the empty
   ledger's full migration lineage and do not write a false legacy-ledger entry.
5. Read back the 18 column definitions, seven exact index definitions, exact `0018` revision
   objects, organization count, revision sum, next revision, and zero changed organization values
   beyond the declared non-null defaults from `0015`.
6. Deploy exact PCD candidate `f1bc696720d65c578b513165e2f62756da2fe2f5` with both CRM
   producer flags false and no activation boundary.
7. Read back the exact Worker version/candidate, bindings, disabled flags, absent activation
   boundary, directory schema, bookmark, and aggregate-only counts.

Any preflight mismatch, migration failure, post-schema mismatch, organization-count drift,
non-default value change, flag drift, boundary appearance, or candidate mismatch is a stop. A
Worker rollback does not reverse the D1 schema; restoration requires the retained Time Travel
bookmark and separate approval.

## Performance review

- approximate algorithmic complexity: O(c + i), bounded by one table's columns and a fixed set of
  schema objects
- DB query count on primary activation path: one pre-deploy metadata invocation containing two
  read-only statements; deployment remains a separate provider invocation
- external API calls: one D1 metadata invocation plus one Worker deploy for a CRM-enabled staging
  deployment; zero metadata calls in disabled mode
- queue jobs created: 0
- expected memory behavior: O(c + fixed DDL bytes), bounded metadata only
- likely scaling bottleneck: the later organization/contact backfill and reconciliation, not this
  schema guard or one-file schema repair

## Retained boundary

This evidence does not authorize a remote action. Synthetic packet creation/application, data
copying or seeding, activation-boundary selection, either producer flag, production changes,
non-backup exports, sends, privacy-policy text, and secret/provider/resource changes remain HOLD.
