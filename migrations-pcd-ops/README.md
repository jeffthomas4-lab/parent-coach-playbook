# PCD operational D1 migrations

This is the canonical migration lineage for the planned `PCD_OPS_DB` binding. It contains trust, support, demand, notification, and future PCD-specific operational state. It must never be applied to the shared Activity Radar `DB` binding or the Forge Command `FORGE_DB` binding.

Current state: an empty isolated staging database was provisioned and rehearsed through `0014`, but the binding is not live on a staging Worker and no production binding exists. Migration `0015` is local preparation only; migrations `0016` through `0022` are likewise local preparation only and none has been applied. `0015` defines the privacy-request lifecycle substrate. `0016` defines provider-neutral customer identity and tenancy authority. `0017` defines auditable owner claims, disputes, and proposed edits. `0018` adds hashed, one-time invitations/recovery challenges and minimized security events. `0019` adds append-only proposed-edit history. `0020` adds append-only dispute history and recovery lookup support. `0021` adds idempotent cascade execution and expiring export-artifact evidence. `0022` adds a provider-neutral, test-mode commerce ledger. None enables login, owner access, direct directory writes, provider calls, or commerce. Adding a live binding, applying another migration, or enabling a feature requires exact-target review and explicit approval.

Until the legacy `migrations/` lineage is retired or split through a separately reviewed repository migration, CI requires migrations `0011` through `0014` to remain byte-identical to their legacy locations. New PCD operational migrations, beginning with `0015`, belong only here and must not be added to the directory-data lineage.

Required activation sequence:

1. Approve the database name, account, region/jurisdiction assumptions, retention policy, owners, and recovery class.
2. Create a dedicated D1 database without customer data.
3. Add `PCD_OPS_DB` with `migrations_dir: "migrations-pcd-ops"` to staging only.
4. Apply and rehearse this lineage in that isolated target.
5. Run Access, failure-isolation, backup/restore, retention, and customer-journey gates.
6. Add the production binding only in a separately approved release.
7. Keep `TRUST_INTAKE_ENABLED` and `DEMAND_TELEMETRY_ENABLED` false until their independent launch gates pass.
