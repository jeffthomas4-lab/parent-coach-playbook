# Immutable recovery-batch manifest

This helper prepares a local manifest for the first independent recovery batch. It does not call Cloudflare or a storage provider, export a database, upload a file, read credentials, or schedule a job.

The manifest is written only below ignored `backups/recovery/<batch-id>/`. It stores artifact class, stable identifier, byte count, SHA-256, and format. It deliberately omits source paths, R2 object names, customer records, and provider details.

## Prepare the local artifacts

First create complete local exports and an R2 inventory/payload-manifest using separately approved source-read steps. Do not place credentials or an inventory containing customer object names in Git.

For the three authoritative D1 databases, `scripts/backup-pcd-recovery-batch.ps1` provides the approved local-export shape. With no switch (or with `-PlanOnly`), it only prints the intended batch and touches neither Cloudflare nor disk. It refuses to export unless a human supplies `-Confirm`, writes each complete export to a new ignored batch, emits SHA-256 sidecars, and calls the manifest helper. Provider command output, including temporary download URLs, is captured rather than printed. It never uploads, restores, schedules, or changes provider retention.

```powershell
# Safe inspection only: no export, no local files, no provider action.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\backup-pcd-recovery-batch.ps1 -PlanOnly

# Requires a separately approved source-read backup run.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\backup-pcd-recovery-batch.ps1 -Confirm
```

Artifacts use `type:id=path` notation. Valid types are:

- `d1_export` — a complete SQL export.
- `r2_inventory` — a local NDJSON/CSV-equivalent inventory prepared for the approved R2 recovery scope.
- `r2_payload_manifest` — a local content/hash manifest for copied R2 payloads.
- `recovery_document` — a bounded local recovery instruction or provider-retention receipt.

## Build a batch manifest

```powershell
node scripts\build-recovery-batch-manifest.mjs `
  --batch-id 2026-07-17-initial `
  --artifact d1_export:activity_radar=backups\d1\activity-radar-YYYY-MM-DD-HHMMSS.sql `
  --artifact d1_export:forge_command=backups\d1\forge-command-YYYY-MM-DD-HHMMSS.sql `
  --artifact d1_export:pcd_ops=backups\d1\parent-coach-desk-ops-YYYY-MM-DD-HHMMSS.sql `
  --artifact r2_inventory:photos=backups\recovery-input\photos-inventory.ndjson `
  --artifact r2_payload_manifest:photos=backups\recovery-input\photos-payloads.ndjson
```

The command refuses empty, duplicate, missing, non-regular artifacts and never overwrites an existing batch manifest. Review its SHA-256 values before any upload.

## External handoff, only after approval

After the recovery account, retention policy, and least-privilege credentials are explicitly approved:

1. Create a new immutable destination prefix for the batch; never update a prior prefix.
2. Upload each artifact and the manifest using a writer that cannot delete or reduce retention.
3. Verify provider retention for every uploaded object and retrieve a bounded set with the separate recovery-verifier identity.
4. Restore a D1 export only into a new disposable local SQLite file using `scripts/prove-d1-restore.py`; verify the result against the manifest SHA-256.
5. Record only aggregate counts, hashes, timestamps, and elapsed recovery time in release evidence.

No upload, retention change, or external-account action is authorized by this helper.
