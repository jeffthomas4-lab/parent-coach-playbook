# PCD operational D1 migrations

This is the canonical migration lineage for the planned `PCD_OPS_DB` binding. It contains trust, support, demand, notification, and future PCD-specific operational state. It must never be applied to the shared Activity Radar `DB` binding or the Forge Command `FORGE_DB` binding.

Current state: an isolated staging database is migrated and rehearsed through `0022`. The production Worker now declares the separate `PCD_OPS_DB` binding, but a 2026-07-17 read-only remote inventory proved that the production database has all migrations `0011` through `0022` pending and no trust-intake tables. The binding alone does not enable any feature. `0015` defines the privacy-request lifecycle substrate. `0016` defines provider-neutral customer identity and tenancy authority. `0017` defines auditable owner claims, disputes, and proposed edits. `0018` adds hashed, one-time invitations/recovery challenges and minimized security events. `0019` adds append-only proposed-edit history. `0020` adds append-only dispute history and recovery lookup support. `0021` adds idempotent cascade execution and expiring export-artifact evidence. `0022` adds a provider-neutral, test-mode commerce ledger. `0023` defines the provider-neutral affiliate product, merchant, recommendation, evidence, health, incident, aggregate revenue, and equipment-intelligence lifecycle. Migration `0023` is committed local design only: it has not been applied to staging or production and activates no API, account, product claim, link, publication, or revenue collection. None enables login, owner access, direct directory writes, provider calls, or commerce. Adding a production migration or enabling a feature requires exact-target review and explicit approval.

Until the legacy `migrations/` lineage is retired or split through a separately reviewed repository migration, CI requires migrations `0011` through `0014` to remain byte-identical to their legacy locations. New PCD operational migrations, beginning with `0015`, belong only here and must not be added to the directory-data lineage.

Remaining activation sequence:

1. Approve the database name, account, region/jurisdiction assumptions, retention policy, owners, and recovery class.
2. Maintain the isolated staging rehearsal and exact migration inventory; the production binding already exists, but it has no applied PCD migration.
3. Run Access, failure-isolation, independent backup/retrieval, retention, and customer-journey gates.
4. Obtain exact-target approval for the production migration range, backup identifier, observation window, and any feature flag change.
5. Apply only the approved production migration range, then prove schema and a bounded synthetic workflow before public enablement.
6. Keep `TRUST_INTAKE_ENABLED` and `DEMAND_TELEMETRY_ENABLED` false until their independent launch gates pass.
