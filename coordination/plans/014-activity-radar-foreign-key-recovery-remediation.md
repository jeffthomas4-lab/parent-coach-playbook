# Plan: Activity Radar foreign-key recovery remediation

**Plan ID:** 014  
**Author:** Codex  
**Date:** 2026-07-17  
**Status:** Awaiting Jeff

## Objective

Restore a demonstrably consistent `activity-radar` backup without exposing customer rows or making an unapproved production change. If the isolated rehearsal proves the safe, derived-data disposition, apply a narrowly preconditioned production repair only after Jeff separately approves it.

## Tier

Tier 3. The failed recovery exercise concerns the shared production data lineage. Any eventual repair is a production D1 mutation and therefore requires a tested recovery path and explicit approval under D-001.

## Business outcome

Parent Coach Desk has a recovery artifact that restores with no foreign-key violations, rather than a backup that is merely exportable. The public directory remains unaffected while the derived camp-scan queue is made internally consistent.

## Current-state evidence

- **Verified by a controlled local restore, 2026-07-17:** the most recent `activity-radar` export passed SQLite integrity checking but reported five `camp_scan_queue.org_id -> organizations.id` foreign-key violations. The aggregate-only record is `coordination/release-evidence/database-backup-restore-proving-2026-07-17.json`.
- **Verified in code:** `migrations-activity-radar/0012_camp_scan.sql` defines `camp_scan_queue` as a secondary, website-derived enrichment queue and makes `org_id` unique with a foreign key to `organizations.id`.
- **Verified in code:** the recovery-proof script is local SQLite only; it has no Cloudflare client and cannot mutate remote D1.
- **Not verified:** why the five parent organizations disappeared, whether the queue rows hold any currently useful processing state, or whether any other export has the same condition.

## Scope

- Add a redacted, aggregate-only local analysis step to establish the orphan count and queue-status distribution without retaining organization IDs, URLs, or customer data in tracked files.
- Create a disposable local recovery clone from a fresh export and test the proposed queue-only disposition there.
- Require a fresh backup, exact preconditions, atomic transaction, post-repair foreign-key check, and another independent local restore before considering production recovery ready.
- Establish an approved immutable offsite backup location and verify a retrieval procedure.

## Non-goals

- No production D1 mutation, remote restore, migration, deployment, or schedule change in this plan without a separate written approval.
- No deletion or reconstruction of organizations, programs, user submissions, records of consent, or financial/security evidence.
- No disclosure of rows, organization identifiers, URLs, or backup contents in Git, chat, or release evidence.
- No claim that a successful local clone repair closes the production backup or restore gate.

## Files likely affected

- `scripts/prove-d1-restore.py` and a focused test fixture, if aggregate FK classification is added to the proof output.
- `scripts/BACKUP-PROVING-LOG.md`
- `coordination/release-evidence/database-backup-restore-proving-*.json`
- `coordination/release-evidence/rc01.json`
- A new immutable offsite-backup runbook/evidence record after the storage decision.

## Step-by-step implementation

1. On the already-created local restore only, calculate and record aggregate counts by foreign-key relationship and queue status. Do not print or persist row identifiers or payloads.
2. Classify `camp_scan_queue` as derived/reconstructible only if the aggregate analysis confirms it contains no customer-controlled or legal-record state. If that cannot be established, stop and obtain a data-owner decision.
3. Export a fresh read-only backup and restore it to a new disposable local SQLite target. Preserve the existing failed proof; never overwrite it.
4. In the disposable target, run a single transaction that deletes only queue rows whose parent organization does not exist. Capture precondition count, deleted count, `PRAGMA integrity_check`, and `PRAGMA foreign_key_check` as aggregates.
5. Restore the same untouched source export to a second disposable target and repeat the analysis to prove the result is deterministic. If the orphan count differs, stop; do not infer a production repair command.
6. Prepare a production-change request that contains the exact expected orphan count, the transaction, a fresh-backup identifier/checksum, a rollback/recovery procedure, a monitoring window, and an operator sign-off requirement.
7. Only after Jeff approves that production request, run the transaction remotely with a hard precondition that the count still matches. A mismatch aborts with no write.
8. Take and locally restore a new post-repair export. Require zero foreign-key violations before updating the backup and restore gates.
9. Select an immutable offsite backup provider, retention period, encryption/access model, and retrieval test owner. Implement and exercise this independently; local copies alone do not close the backup gate.

## Testing strategy

- Unit-test any new aggregate-proof parser against synthetic fixtures containing zero, one, and multiple orphan relationships; fixture data must be synthetic.
- Run the local proof script against the fresh export before and after the disposable clone disposition.
- Require `PRAGMA integrity_check = ok` and zero rows from `PRAGMA foreign_key_check` after the clone transaction and again after the post-repair export restore.
- Validate release-evidence structure after evidence changes.
- No test or proof may treat an altered clone as a substitute for a fresh source export.

## Acceptance criteria

- The known failure is represented as aggregate evidence only, with no data rows committed or disclosed.
- A disposable clone demonstrates either a zero-violation queue-only repair or a documented reason the disposition is unsafe.
- Any production transaction is guarded by an exact, current precondition and aborts on drift.
- A fresh post-repair production export restores locally with `integrity_check = ok` and zero foreign-key violations.
- Immutable offsite backup storage and a successful retrieval exercise have evidence before the database-backup gate becomes `pass`.

## Human approval gates

1. Jeff approval is required before inspecting any non-aggregate orphan data, deciding to delete/recreate/relink records, or running an altered-clone experiment if it would surface customer data.
2. Jeff approval is required before creating/configuring offsite storage, transmitting backup data to it, or setting retention/access policies.
3. Jeff must separately approve the exact production D1 transaction, its expected count, backup checksum, rollback procedure, and observation window. The existing backup/recovery rehearsal approval does not authorize this production mutation.
4. A production release remains gated independently on the other items in `rc01.json`; completing this plan does not authorize deployment or customer launch.

## Open questions

1. Is the derived queue-only disposition acceptable to the data owner if the local clone proves it has no customer/legal record impact?
2. Which approved immutable backup provider, region, retention period, and restoration owner should be used?
3. Should the associated enrichment writer remain paused until the foreign-key condition is resolved, or is its deployed state already safely disabled?

## Dependencies

- A fresh read-only D1 export and sufficient local encrypted storage for two disposable SQLite restores.
- Access to an approved immutable offsite storage provider before the backup gate can close.
- A named human operator for the production transaction and recovery observation.

## Data model or migration changes

No schema migration is proposed. The candidate repair addresses derived queue data only. Do not add a migration or disable foreign-key enforcement to make the proof pass.

## Security and privacy requirements

Keep all backup contents ignored and local unless an approved offsite backup design is in place. Evidence may contain checksums, aggregate counts, table/relationship names, timestamps, and commands, but never identifiers, URLs, personal data, tokens, or credentials.

## Failure modes

- Fresh export has a different orphan count: abort the repair path; data is changing or the condition is not stable.
- Clone repair exposes a non-derived dependency: stop and obtain a data-owner/counsel decision.
- Remote precondition differs from the approved expected count: abort with no write and generate fresh aggregate evidence.
- Post-repair export still fails FK validation: leave the recovery gates pending and investigate other relationships; do not broaden deletion criteria.
- Offsite backup upload/retrieval fails: retain the valid local backup, record the failure, and do not claim a backup gate pass.

## Rollback plan

For any future approved production repair: retain a fresh, checksummed pre-repair export and prove it restores locally before the transaction. If the queue-only repair produces an unexpected operational result, stop the writer and restore into a separately approved non-production target for investigation; no remote restore occurs automatically. The production rollback decision belongs to Jeff and the designated operator.
