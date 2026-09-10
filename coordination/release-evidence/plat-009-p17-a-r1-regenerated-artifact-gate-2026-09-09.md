# PLAT-009 Gate 9C-P17-A-R1 regenerated production-disabled artifact

Status: **APPROVAL REQUIRED / NO P17 PRODUCTION MUTATION AUTHORIZED BY THIS RECEIPT**

Recorded: 2026-09-09 America/Los_Angeles / 2026-09-10 UTC

## Why the approved P17-A attempt did not mutate production

The owner approved Gate P17-A at evidence commit
`e2d070f3f7a3a084764606b5868d95e56b6725f6`, conditional on the receiver gate passing. Gate
P16-C-R6 subsequently passed and was recorded at local evidence commit
`61b5ea1` with two active owner admin memberships, zero pending invitations, and zero rows across
the receiver's exact 47-table business-data aggregate.

The P17-A action-time preflight then found that the approved prebuilt artifact no longer existed in
any retained PCD worktree. The surviving `dist` manifest still matched approved SHA-256
`8483b96bb32a621322aefa4a8c544d503fb1997836a1cf0fbf16032bf907cacb`, but its complete artifact
hash was `6c142abef0e8279dc52e67d563f407a1f45d6cbec3354a24b82d4dddd4c78164` instead of approved
`ec480a93be3dd215bc12dcbd6ff96ee56b3cc5e62b3608d3944f7c55b24ac8e9`, and its build metadata
named later candidate `a01e225e287b68b933116cba6b223565e1fbc528` rather than the approved candidate.

That mismatch triggered the mandatory pre-mutation abort. No PCD or CRM Worker, secret, D1,
Queue, R2, flag, boundary, source row, contact row, or provider resource was changed under the
original P17-A authorization.

## Replacement exact local artifact

A temporary isolated worktree was checked out at exact candidate
`b4ea1cf04a40e8c579b880bda724d0e087c083da`, tree
`2ad3deb60fcca5ddcc13639965d973e79e1efc0b`. The repository's governed
`npm run build:production` path generated one new local production artifact. Its build metadata is:

- source commit: `b4ea1cf04a40e8c579b880bda724d0e087c083da`;
- build origin: `local`;
- build time: `2026-09-10T00:32:57.715Z`;
- complete artifact SHA-256:
  `0eadf9da8e43d20d3b7ab1e015e38d52937978047db4fbb7d16ba69bb6d156b9`; and
- generated `dist/server/wrangler.json` SHA-256:
  `4e9cbeaa06dd10e344cb15908a71f82a183fa7deeda0f20194b0e06665dda70a`.

The existing production-manifest verifier passed. It proves Worker `parent-coach-desk`, production
config provenance, production D1/R2/KV/rate-limit/asset/schedule bindings, service binding
`CRM_ADAPTER=field-forge-crm`, both producer flags exactly `false`, and no
`PCD_CRM_SOURCE_NOT_BEFORE_MS` activation boundary.

All other immutable local inputs retain their original P17-A values:

- `wrangler.production.jsonc` SHA-256:
  `a7bb8f8a897104fc1e67eed072fa5ea5b7d7067eb6ae7b50998a7324eb4a3758`;
- disabled-release PowerShell guard SHA-256:
  `d2816ecde92b1d777b027e64847acbead04a64c8d5c0cfcbc5f273fb55e7c9c4`;
- disabled-manifest verifier SHA-256:
  `2e336d7ec33892a61e12b00e91a3ea09a0aaf9ff2b04cef68c65065b11ba0d59`;
- production-manifest generator SHA-256:
  `bc0dc0233b518545a1a9101422c58a8bbec5e443292f4ede4efa5f201c495524`;
- directory migration aggregate:
  `b2aa42d7270a882cfff4ee37a0408b806b19701070c7d00004a58202f9cdb36c`;
- operations migration aggregate:
  `0daa9bf25c4457289f51f7fc0b905943325b0be8bf6d56facc7dd77aec2d72e5`;
- encrypted receiver secret-pack SHA-256:
  `d35e2b02da2fa61669a39df8eb601110467f1303e017292d377801e575b21bf0`; and
- PCD adapter secret fingerprint:
  `d332f102ffeb118f000199fe77e1e45f50f379266b8b86f59f722d5ab3c1ba73`.

The exact disabled-release guard's `-ValidatePack` path passed against the replacement artifact and
existing DPAPI pack, returning only the pack hash and adapter fingerprint above. No secret value
was printed, persisted, placed in an argument or environment variable, or recorded in evidence.

## Authenticated read-only production refresh

The action-time refresh returned:

- directory D1 `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`: 198,287 total and live
  organizations, zero tombstones, zero CRM projection-revision columns, and zero of the six CRM
  schema objects;
- operations D1 `b38d5f37-54df-4e0f-9706-023edc12c7fe`: 141 total/live contacts,
  zero tombstones, 35 channel-bearing contacts, 141 source-backed contacts, zero public-reviewed
  contacts, and zero suppressions;
- the exact original 17-file operations pending list from `0028_org_contacts.sql` through
  `0043_org_contact_dnc_identity.sql`, with no new or reordered migration;
- active PCD deployment `40df4767-9b3f-42b4-b2f5-296298197682` routing 100 percent to rollback
  version `608f4a21-482e-49b4-af85-b24fdb2b34f6`; and
- the R6 production CRM receiver still at version
  `d3bdb1d6-5aa7-41ff-893c-502dcd9be7f7`, with two active owner admin memberships and zero
  organization/contact projections.

The successful D1 reads returned `success=true`, `changes=0`, `rows_written=0`, and
`changed_db=false`. One initial directory query deliberately referenced the required-absent
`crm_projection_revision` column and was rejected before SQL execution; the corrected
schema-introspection SELECT then returned the successful zero-write metadata and exact absence
above. No source row was exported or copied.

## Exact authorized sequence

Approval authorizes one P17-A-R1 attempt using only the replacement artifact hashes above. The
complete prerequisite checks, two source D1 Time Travel bookmarks, directory migrations
0017-0019, exact 17 operations migrations, one guarded disabled PCD deployment, one-minute
disabled no-op proof, final readbacks, rollback requirements, abort thresholds, and exclusions are
exactly those recorded in the original P17-A gate at evidence commit
`e2d070f3f7a3a084764606b5868d95e56b6725f6`.

This amendment changes only the complete artifact and generated-manifest hashes after the original
prebuilt artifact was overwritten. It does not authorize either producer flag, an activation
boundary, a production backfill manifest, organization/contact copying, source approval, contact
public-review decisions, export, send, privacy text, provider/resource change, or any other action
excluded by the original gate.

## Approval statement

> Approve CRM Gate 9C-P17-A-R1 exactly as recorded at evidence commit `<EVIDENCE_COMMIT>`, using
> PCD candidate `b4ea1cf04a40e8c579b880bda724d0e087c083da`, regenerated production artifact SHA-256
> `0eadf9da8e43d20d3b7ab1e015e38d52937978047db4fbb7d16ba69bb6d156b9`, generated manifest
> SHA-256 `4e9cbeaa06dd10e344cb15908a71f82a183fa7deeda0f20194b0e06665dda70a`, production config
> SHA-256 `a7bb8f8a897104fc1e67eed072fa5ea5b7d7067eb6ae7b50998a7324eb4a3758`, disabled-release guard
> SHA-256 `d2816ecde92b1d777b027e64847acbead04a64c8d5c0cfcbc5f273fb55e7c9c4`, directory migration
> aggregate `b2aa42d7270a882cfff4ee37a0408b806b19701070c7d00004a58202f9cdb36c`, operations migration
> aggregate `0daa9bf25c4457289f51f7fc0b905943325b0be8bf6d56facc7dd77aec2d72e5`, encrypted secret-pack
> SHA-256 `d35e2b02da2fa61669a39df8eb601110467f1303e017292d377801e575b21bf0`, production directory D1
> `8cc3694a-26f8-4a56-b131-d5d3a68c49ef`, production operations D1
> `b38d5f37-54df-4e0f-9706-023edc12c7fe`, and rollback version
> `608f4a21-482e-49b4-af85-b24fdb2b34f6`. Authorize the exact original P17-A execution sequence,
> mandatory rollback, abort thresholds, and exclusions, substituting only these regenerated
> artifact and manifest hashes.
