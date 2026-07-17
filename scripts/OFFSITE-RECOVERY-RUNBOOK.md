# Offsite recovery runbook

Operator steps for Plan 016 (`coordination/plans/016-independent-immutable-offsite-backup-and-recovery.md`).
This closes the `database_backup` release-evidence gate with an independently
controlled, immutable offsite copy plus a measured, non-production restore
rehearsal.

This document is instructions only. It contains no credentials, no object
names, and no backup contents. **Never commit or paste credentials, object
names, or backup contents anywhere** -- not in this repo, not in chat, not in
release evidence. Release evidence records only aggregate counts, hashes,
timestamps, and elapsed time (see the template at
`coordination/release-evidence/_TEMPLATE-offsite-backup-proving.json`).

Two new scripts implement this runbook:

- `scripts/offsite-backup-upload.mjs` -- backup-writer identity. Dry-run by
  default; `--confirm` uploads.
- `scripts/offsite-backup-retrieve-verify.mjs` -- recovery-verifier identity.
  Dry-run by default; `--confirm` downloads, verifies SHA-256, and restores
  each D1 export into an isolated local SQLite database.

Both scripts require `@aws-sdk/client-s3`. **This is not currently a
dependency of this project** (`package.json` does not list it). Before the
first real run:

```
npm install @aws-sdk/client-s3
```

If the package is missing when either script is run with `--confirm`, the
script fails loudly with this exact instruction rather than silently doing
nothing.

## 1. Choose and prepare the provider (human approval required)

Plan 016 requires human approval before any external account, bucket, or
credential is created (see "Human approvals required" in the plan). Do not
proceed past this section until Jeff has approved the provider, the 90-day
daily / 12-month monthly retention model, and external account creation.

### Option A: AWS S3 (recommended)

1. Create a **new, separate AWS account** -- not the account behind any
   Cloudflare/production access -- dedicated to backup recovery.
2. In that account, create one S3 bucket with **Versioning enabled** and
   **Object Lock enabled at bucket creation** (Object Lock cannot be added to
   an existing bucket). Set the bucket default retention to **Compliance
   mode**, 90 days.
3. Add a bucket lifecycle rule: expire/transition daily recovery points after
   90 days; separately retain one recovery point per calendar month for 12
   months (a lifecycle rule targeting a `monthly/` prefix, or a manual
   monthly copy into a longer-retention prefix, both satisfy this).
4. Create three separate IAM identities, each with an access key:
   - **source-reader** -- Cloudflare-side, not AWS. This is the Wrangler/D1
     export credential already governed by `scripts/backup-pcd-recovery-batch.ps1`.
     It has no AWS permissions at all.
   - **backup-writer** -- AWS IAM user/role scoped to `s3:PutObject` and
     `s3:PutObjectRetention` (only to extend, never shorten) on this bucket's
     backup prefix only. Explicitly deny `s3:DeleteObject`,
     `s3:DeleteObjectVersion`, `s3:PutBucketObjectLockConfiguration`, and any
     action that could shorten or remove retention. This identity's keys go
     into `OFFSITE_BACKUP_ACCESS_KEY_ID` / `OFFSITE_BACKUP_SECRET_ACCESS_KEY`.
   - **recovery-verifier** -- AWS IAM user/role scoped to `s3:GetObject` and
     `s3:ListBucket` only, on the same prefix. No write, no delete. This
     identity's keys go into `OFFSITE_RECOVERY_ACCESS_KEY_ID` /
     `OFFSITE_RECOVERY_SECRET_ACCESS_KEY`.
5. Store all three credentials in a secrets manager or password manager, not
   in this repo, not in `.env` files that get committed, not in chat.

### Option B: Backblaze B2 (acceptable lower-cost alternative)

1. Create a **separate Backblaze account** (not tied to the primary
   Cloudflare account).
2. Create one B2 bucket with **Object Lock enabled** (also must be set at
   bucket creation; B2's Object Lock is S3 API-compatible). Set default
   retention to Compliance mode, 90 days.
3. B2's S3-compatible endpoint looks like
   `https://s3.<region>.backblazeb2.com` (for example
   `https://s3.us-west-004.backblazeb2.com`). Set `OFFSITE_BACKUP_ENDPOINT`
   / `OFFSITE_RECOVERY_ENDPOINT` to that value; leave both unset for real AWS
   S3.
4. Create three separate B2 application keys mirroring the AWS role split
   above: backup-writer (write, no delete, cannot alter retention) and
   recovery-verifier (read-only). B2 application keys can be scoped to a
   single bucket and to specific capabilities -- use that scoping.
5. `OFFSITE_BACKUP_FORCE_PATH_STYLE=true` / `OFFSITE_RECOVERY_FORCE_PATH_STYLE=true`
   is typically required for B2's S3-compatible endpoint.

## 2. Environment variable contract

Set these as local, non-committed environment variables (shell session,
`.env.local` that is gitignored, or a secrets manager) before running either
script with `--confirm`. Both scripts print a full dry-run plan with no
environment variables set at all, so you can review the plan before deciding
where credentials come from.

### `offsite-backup-upload.mjs` (backup-writer identity)

| Variable | Required | Notes |
|---|---|---|
| `OFFSITE_BACKUP_BUCKET` | yes | Destination bucket name. |
| `OFFSITE_BACKUP_REGION` | yes | AWS region, or the region encoded in the B2 endpoint. |
| `OFFSITE_BACKUP_ACCESS_KEY_ID` | yes | Backup-writer access key. |
| `OFFSITE_BACKUP_SECRET_ACCESS_KEY` | yes | Backup-writer secret key. |
| `OFFSITE_BACKUP_SESSION_TOKEN` | no | AWS STS temporary session token, if used. |
| `OFFSITE_BACKUP_ENDPOINT` | no | Unset for AWS S3. Set for B2 (see above). |
| `OFFSITE_BACKUP_FORCE_PATH_STYLE` | no | `true`/`false`, default `false`. Usually `true` for B2. |
| `OFFSITE_BACKUP_PREFIX` | no | Key prefix under the bucket root, e.g. `pcd-recovery`. Default empty. |
| `OFFSITE_BACKUP_RETENTION_DAYS` | no | Integer days. Default `90` per Plan 016. |
| `OFFSITE_BACKUP_OBJECT_LOCK_MODE` | no | `COMPLIANCE` or `GOVERNANCE`. Default `COMPLIANCE` per Plan 016. |

### `offsite-backup-retrieve-verify.mjs` (recovery-verifier identity)

| Variable | Required | Notes |
|---|---|---|
| `OFFSITE_RECOVERY_BUCKET` | yes | Source bucket name (same bucket as above). |
| `OFFSITE_RECOVERY_REGION` | yes | Same region as upload. |
| `OFFSITE_RECOVERY_ACCESS_KEY_ID` | yes | Recovery-verifier access key. **Not the backup-writer key.** |
| `OFFSITE_RECOVERY_SECRET_ACCESS_KEY` | yes | Recovery-verifier secret key. |
| `OFFSITE_RECOVERY_SESSION_TOKEN` | no | AWS STS temporary session token, if used. |
| `OFFSITE_RECOVERY_ENDPOINT` | no | Same value as `OFFSITE_BACKUP_ENDPOINT`. |
| `OFFSITE_RECOVERY_FORCE_PATH_STYLE` | no | Same value as `OFFSITE_BACKUP_FORCE_PATH_STYLE`. |
| `OFFSITE_RECOVERY_PREFIX` | no | Must match `OFFSITE_BACKUP_PREFIX` used at upload time. |

Never log or paste the value of any `*_ACCESS_KEY_ID`, `*_SECRET_ACCESS_KEY`,
or `*_SESSION_TOKEN` variable. Neither script prints them.

## 3. Full command sequence

### 3.1 Build the local batch (existing tooling, unchanged)

```powershell
# Plan the batch, no side effects.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\backup-pcd-recovery-batch.ps1 -PlanOnly

# After approval, actually export all three authoritative D1 databases.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\backup-pcd-recovery-batch.ps1 -Confirm
```

This writes `backups\recovery\<batch-id>\sources\<id>.sql` and
`backups\recovery\<batch-id>\manifest.json`. If the approved scope includes
R2 objects, also place `r2_inventory` / `r2_payload_manifest` artifacts under
the same `sources` directory and re-run
`node scripts\build-recovery-batch-manifest.mjs` with the additional
`--artifact` flags, per `scripts/RECOVERY-BATCH.md`.

### 3.2 Review the upload plan (no network call, no credentials needed)

```
node scripts/offsite-backup-upload.mjs --manifest backups/recovery/<batch-id>/manifest.json
```

Confirm the object list, sizes, hashes, and retention (mode + retain-until
date) match expectations before setting any credential.

### 3.3 Upload (requires `OFFSITE_BACKUP_*` env vars and provider approval)

```
node scripts/offsite-backup-upload.mjs --manifest backups/recovery/<batch-id>/manifest.json --confirm
```

Each object is uploaded with Object Lock retention, then immediately
read back and SHA-256 verified. The script fails loudly (non-zero exit) if
any read-back hash does not match. It never deletes or overwrites an
existing object at that key.

### 3.4 Review the retrieval plan (no network call, no credentials needed)

```
node scripts/offsite-backup-retrieve-verify.mjs --manifest backups/recovery/<batch-id>/manifest.json
```

### 3.5 Retrieve, verify, and restore (requires `OFFSITE_RECOVERY_*` env vars)

```
node scripts/offsite-backup-retrieve-verify.mjs --manifest backups/recovery/<batch-id>/manifest.json --confirm
```

This downloads every artifact plus the manifest object into a fresh
`/tmp/pcd-offsite-verify-<random>` directory on the VM (never under the
mounted repo), verifies each SHA-256 against the trusted local manifest, and
for every `d1_export` artifact restores it into a new isolated SQLite file
via `scripts/prove-d1-restore.py`, which runs `PRAGMA integrity_check` and
`PRAGMA foreign_key_check` and reports table counts. The script's own exit
code is non-zero if any hash or integrity check fails.

Review the printed `work_dir` path, then clean it up:

```
rm -rf /tmp/pcd-offsite-verify-<random>
```

(`/tmp` is VM-local and outside the mount's delete restriction, so `rm` is
safe there. Never attempt to `rm` anything under the mounted repo.)

## 4. Three separate-day proving runs

Plan 016 requires three manual export -> upload -> retrieve -> restore
cycles on three **separate calendar days** before any scheduled/automated
backup is proposed. For each day's run, capture:

1. The date and a batch ID.
2. `object_count` and `total_bytes` from the upload dry-run/confirm output.
3. The manifest SHA-256 (from the upload/retrieve JSON output's manifest
   verification).
4. `retention_mode` and the computed `retain_until` timestamp from the
   upload output.
5. `manifest_verified: true` and `all_verified: true` from the retrieve
   script's output.
6. For each D1 export: `integrity_check: "ok"` and
   `foreign_key_violation_count: 0` from the restore report.
7. Elapsed wall-clock time for the retrieve+restore step (time the command).
8. Any anomaly, retry, or manual intervention, in plain language.

Fill one copy of
`coordination/release-evidence/_TEMPLATE-offsite-backup-proving.json` per
day (rename it to a dated filename such as
`offsite-backup-proving-2026-MM-DD.json`) with these values. Do not put
object names, credential values, or backup contents in that file --
aggregate counts and hashes only, matching the existing evidence files under
`coordination/release-evidence/`.

Only after three separate-day runs all pass does the `database_backup`
release gate close, per Plan 016's acceptance criteria. Automation/scheduling
requires a separate follow-up plan and Jeff's explicit approval (Plan 016,
"Human approvals required" #4).

## 5. What this runbook does not authorize

Consistent with Plan 016's non-goals: no production D1 restore, no R2
overwrite/delete, no credential rotation, no Cloudflare Access/DNS change, no
schedule enablement, and no claim of a legal retention period (counsel
decides any regulatory/contractual retention beyond the 90-day/12-month
operating default).
