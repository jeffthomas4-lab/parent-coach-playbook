# Plan: Independent immutable offsite backup and recovery proof

**Plan ID:** 016
**Author:** Codex
**Date:** 2026-07-16
**Status:** Awaiting provider, retention, and external-account approval
**Tier:** 3

## Objective

Close the release-evidence database-backup and R2-recovery gates with an independently controlled, immutable offsite copy and a measured, non-production restore rehearsal. The result must protect the application from local-device loss and a compromise of the primary Cloudflare account.

## Current evidence

- `wrangler.production.jsonc` declares three production D1 bindings: `activity-radar`, `forge-command`, and `parent-coach-desk-ops-production`; it also declares the `activityradar-photos` R2 bucket and a regenerable `SESSION` KV namespace.
- The existing `scripts/backup-activity-radar.ps1` produces a size-checked, SHA-256 sidecar-backed local SQL export of `activity-radar` and retains eight local copies. It is not an offsite copy and does not cover every production D1 binding or R2.
- The recorded fresh export is 257,196,189 bytes and was locally restored successfully; release evidence still explicitly requires immutable offsite storage before the backup gate can pass.
- Cloudflare R2 bucket locks are useful storage controls, but an account administrator can remove lock rules. They do not meet the independent-account requirement when used as the only recovery copy.

## Recommended design

Use a dedicated AWS recovery account that is not the primary Cloudflare account, with one S3 bucket created with Versioning and Object Lock **Compliance mode** enabled at creation.

- Default immutable retention: 90 days for daily recovery artifacts.
- Lifecycle: retain 90 daily recovery points; retain one monthly recovery point for 12 months. Add annual retention only if counsel or a customer contract requires it.
- Store a timestamped, content-addressed backup batch: one SQL export per authoritative D1 database, an R2 object inventory plus object payload copies, and a signed/checksummed manifest with sizes and SHA-256 hashes.
- Use separate least-privilege identities: a Cloudflare source reader (`list`/`get` only), a backup writer that can create new locked S3 objects but cannot delete or reduce retention, and a recovery verifier with read-only access. Never commit or paste credentials.
- Encrypt in transit and use provider-managed encryption at rest. Do not introduce a customer-managed encryption key unless a later security review requires it; lost key material would turn recovery into an outage.

Backblaze B2 Object Lock is an acceptable lower-cost independent alternative with the same retention model. A second Cloudflare account/R2 bucket may be added as a convenience copy, but is not sufficient as the only immutable recovery target.

## Scope

1. Perform a read-only inventory to identify which of the three D1 databases, R2 objects, and any externally held data are authoritative for customer operations. Explicitly classify `SESSION` KV and rate-limit state as regenerable or backup-required.
2. Create a provider-neutral manifest format and a backup runner that emits complete, checksum-verified batch artifacts without recording data or credentials in Git.
3. Implement source-read/destination-write permissions using separate credentials and a dedicated recovery account.
4. Enable immutable default retention on the destination before uploading the first production-derived artifact.
5. Upload a first complete offsite batch and verify its manifest, object count, immutable retention state, and retrieval with a read-only recovery identity.
6. Restore one selected D1 export into an isolated disposable local target and restore a bounded representative R2 sample to a disposable local directory. Verify hashes, database integrity, expected aggregate counts, and elapsed recovery time.
7. Record sanitized evidence, retention policy, ownership, recovery steps, and unresolved legal-retention decision. Do not commit backup contents, object names, customer rows, or credentials.

## Non-goals

- No production D1 restore, migration, data repair, R2 overwrite/delete, credential rotation, Cloudflare Access/DNS change, schedule enablement, email/Slack send, or customer-content mutation.
- Do not treat local retention, D1 Time Travel, Git history, or a same-account R2 lock as the independent offsite backup.
- Do not claim a legal retention period. Counsel decides longer regulatory, contractual, tax, or deletion-policy retention.
- Do not automate a recurring job until the manual export/upload/restore path has passed at least three separate-day proving runs and Jeff approves scheduling.

## Expected files

- A new narrowly scoped backup orchestration script and a restore-verification script under `scripts/`
- `scripts/RESTORE-activity-radar.md` or a new cross-database recovery runbook
- A sanitized immutable handoff and `coordination/release-evidence/` JSON evidence
- `.gitignore` only if required to ensure generated archives/manifests with sensitive object names remain ignored
- No provider credential, export payload, object inventory, or `.env` file

## Implementation steps

1. Confirm all production persistence bindings from `wrangler.production.jsonc` against read-only Cloudflare metadata. Build a data-classification table: authoritative source, export method, estimated size, RPO, RTO, and whether it belongs in the recovery batch.
2. Select the approved provider and create the recovery account/bucket outside the primary Cloudflare account. For AWS, create the bucket with Versioning and Object Lock Compliance mode enabled; verify the configured default 90-day retention before any upload.
3. Create three distinct least-privilege credentials outside source control:
   - Cloudflare read-only source access limited to required D1 export and R2 list/get actions;
   - provider write-only backup access limited to the named recovery prefix and unable to delete objects or alter retention;
   - provider read-only recovery-verifier access.
4. Define a batch layout such as `YYYY/MM/DD/<batch-id>/` containing database exports, R2 object payloads, a machine-readable manifest, and hash sidecars. Write only to a new batch prefix; never update a prior recovery point.
5. Extend the existing local export safeguards to each authoritative D1 database: partial-file staging, minimum-size/schema sanity checks appropriate to that database, SHA-256, and a failure path that preserves the last known-good backup.
6. Back up R2 with a deterministic inventory and checksum manifest. Copy objects to new immutable destination keys; do not mirror deletions from the source. Record only aggregate count/bytes in tracked evidence.
7. Upload a manual first batch, validate the provider reports active Compliance/Object Lock retention for every object, then retrieve a small random verification set using only the recovery-verifier identity.
8. Rehearse recovery locally: import a selected offsite D1 export into a disposable target, run integrity and aggregate-count checks, retrieve a bounded R2 sample into a disposable directory, verify hashes, and measure elapsed time. Do not issue any Cloudflare restore/write command.
9. Repeat end-to-end manual export/upload/retrieval/restore on three separate days. Only then prepare a separate schedule-approval plan with alerting for failed backups and a documented emergency runbook.
10. Update release evidence only after independent-object retention, retrieval, and recovery proof all pass. Report the recovery-point timestamp and measured recovery time without reporting personal data.

## Acceptance criteria

- Every authoritative production D1 database and required R2 object class is explicitly included or explicitly documented as out of scope with owner approval.
- The offsite provider account is independent of the primary Cloudflare account.
- Every recovery artifact in a successful batch has a verified checksum and active immutable retention of at least 90 days.
- No backup writer can delete a recovery artifact or weaken its retention; the recovery-verifier can retrieve but not modify it.
- An isolated local recovery from the offsite copy passes database integrity, aggregate-count, R2 checksum, and manifest-completeness checks.
- The evidence records an actual recovery-point timestamp and measured recovery time, with no secret or customer-data disclosure.
- Three manual proving runs on separate days pass before any scheduled backup is proposed.

## Verification

| Check | Evidence required |
|---|---|
| Source inventory | Read-only binding inventory plus data-classification table |
| Immutable destination | Provider configuration output showing bucket/versioning/lock and default 90-day retention |
| Permission separation | Sanitized policy/role summaries and negative delete/retention-change checks where safely supported |
| Batch integrity | Manifest hash verification, object count, aggregate byte count, no partial artifacts |
| D1 recovery | Disposable local import, `PRAGMA integrity_check`, and relevant aggregate-count comparison |
| R2 recovery | Retrieved sample hash checks and manifest membership proof |
| Operational readiness | Three separate-day successful manual records, recovery runbook, and rollback/no-write proof |

## Human approvals required

1. Choose the provider and recovery-account owner. Recommended: a separate AWS account with S3 Object Lock Compliance mode; acceptable alternative: Backblaze B2 Object Lock.
2. Approve the 90-daily/12-monthly operating retention model, subject to later counsel review for any longer legal requirement.
3. Approve external account/bucket creation, immutable-retention configuration, least-privilege credential creation, and upload of production-derived backup contents to that provider.
4. Approve any later automation/schedule after the three manual proving runs.

## Rollback and failure handling

- A failed export or upload never replaces or deletes a prior recovery point.
- If the provider configuration is wrong, stop before upload; correct configuration only with a new explicit approval.
- If restoration fails, preserve the immutable batch and logs, record the failure, and do not attempt a production restore.
- Retention cannot be shortened for a failed test batch in Compliance mode; use a clearly named dedicated test prefix with the same retention before first upload.
