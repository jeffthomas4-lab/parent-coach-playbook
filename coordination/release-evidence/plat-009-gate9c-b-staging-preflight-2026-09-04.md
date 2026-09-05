# PLAT-009 Gate 9C-B staging producer preflight

Status: **HOLD — READ-ONLY PREFLIGHT ONLY**
Observed: 2026-09-04 through 2026-09-05
PCD implementation candidate: `f96abf77fd6707a328a6a5ba5fc3a1b23dc26cd5`
Candidate tree: `011fe506c5d080d5fec2c5f251e30d95994ce781`
CRM receiver candidate: `8f489545c562b2febaa5d17b4f74f765601ee212`
CRM receiver tree: `007e0aedad1eb7b1d07fef55f5bb137066262d34`

No remote mutation was performed by this preflight.

## Current staging resources

- Worker: `parent-coach-desk-staging`
- Active deployment/version: `105669f4-b8ce-4c92-bb0d-079e0e6a9a58`, 100 percent traffic
- Active version message: `Gate 9B CRM binding candidate 1967286; adapter disabled`
- Directory staging D1: `parent-coach-desk-directory-staging`,
  `6aa26d4d-d545-4eb7-bf50-34d45f2182ad`
- Ops staging D1: `parent-coach-desk-ops-staging`,
  `7f0da00d-bc98-464f-8702-ce0fb381dd5e`
- Existing Service Binding: `CRM_ADAPTER` -> `field-forge-crm-staging`
- Existing secret name: `PCD_CRM_ADAPTER_HMAC_SECRET` (value not read)
- Active `PCD_CRM_ADAPTER_ENABLED`: `false`
- Active `PCD_CRM_BACKFILL_ENABLED`: absent, therefore fail-closed

## Source and migration readback

The directory staging D1 contains 10 organizations and a maximum `updated_at` of
`2026-07-19T05:57:35.564Z`. The aggregate query reported `changed_db: false`, 10 rows read, and
zero rows written.

The directory staging migration ledger is empty even though its isolated fixture database contains
10 organizations. Canonical Wrangler therefore reports all directory migrations pending. Blindly
running `migrations apply` would replay the full lineage against a partially shaped fixture and is
not authorized. The infrastructure gate must execute only the reviewed forward-only directory
schema changes `0017`, `0018`, and `0019`, with pre/post schema proof. Their aggregate is
`bd2994a2cdbca16b9c023dc8c4ed2621dfb840b28909cca7a5ae6dbc83a692ae`.

The ops staging D1 has no `org_contacts` table. The exact pending set is now 20 files:

1. `0023_affiliate_clicks.sql`
2. `0024_editorial_opportunity_lifecycle.sql`
3. `0025_events.sql`
4. `0026_proof_inbox.sql`
5. `0027_affiliate_recommendation_lifecycle.sql`
6. `0028_org_contacts.sql`
7. `0029_admin_action_receipts.sql`
8. `0029_external_article_receipts.sql`
9. `0030_directory_acquisition.sql`
10. `0031_crm_adapter_outbox.sql`
11. `0032_crm_adapter_historical_backfill.sql`
12. `0033_crm_adapter_backfill_reconciliation.sql`
13. `0034_crm_adapter_outbox_claim_order.sql`
14. `0035_org_contact_context.sql`
15. `0036_crm_adapter_safety_indexes.sql`
16. `0037_crm_adapter_safety_state.sql`
17. `0038_crm_adapter_safety_upgrade.sql`
18. `0039_crm_adapter_atomic_send_cancellation.sql`
19. `0040_crm_adapter_bounded_retractions.sql`
20. `0041_crm_backfill_created_cursor_and_public_contact_safety.sql`

Pending-set aggregate:
`e06a06ec1f0effa9756b19a9895add862d042d3b40849772746cd7787dc7f930`

Aggregate algorithm:
`sha256(utf8(compact-json(sorted [{name,sha256}])))`.

The newest safety migration hashes are:

- `0032`: `48a96fbccc0984af8ea435b27d1c0d3ad8d5956354f976643d3574e454a4d842`
- `0033`: `b06535eb8b374f4a69106b371cb89680f0219251a54244d4b07cb30c46d8120d`
- `0034`: `12723f74abe6123ad549ab021cde75ec1fea168671f8535f1cad456da237c092`
- `0035`: `6b440ce1392904c435fcf1e93567670a5c3dfeec7347b8844aa158f2e30dd0a3`
- `0036`: `0d316967ab6dee9e2dacb23638780ff1b79532b56718ef7f7920d0196765bb62`
- `0037`: `14489bf9f350ac8869315c660c19ef29a45b48634343c7093b247a8bfd0454bc`
- `0038`: `13758767ae12a61f29690bea1b7429fb63f3e616a8f5b918d1d5faa6054d9d39`
- `0039`: `b6a10931b33e9d6675e80e5618688c2fa05fe5e1f693a8e55b93226966cfc260`
- `0040`: `93fe648a99178e2d229af0e210ee0dc5ffd28c04bf7a741094eee343da4bae06`
- `0041`: `551ad75ad3dde5844535d808d28cd62ae28dfce34c646533e757ec6012477e4d`

The remaining component hashes, in the same sorted manifest, are:

- `0023_affiliate_clicks.sql`: `85a0c5db2524bba77d4856e85017627614e9615ab9286b76b304d891b1a25e98`
- `0024_editorial_opportunity_lifecycle.sql`: `8bc91732e839ffd85b6113fa34d59a8478021839900677f6b48ebe352b71821b`
- `0025_events.sql`: `0422ed037e90e0df57dc48f552bdfc2a75193195c95a457919dcf01d57eb0b32`
- `0026_proof_inbox.sql`: `b06bde3c8cfe016811e389796dcac29e2673aeda6f3636809315c4eb7add355e`
- `0027_affiliate_recommendation_lifecycle.sql`: `5c479f4e7140d24d6484740cb6a00eda13e4bc0c7e316ae279bf28286c27d59d`
- `0028_org_contacts.sql`: `7d171ed09b1b4efa813f817065d4839c3a24f6a2eb6f4926bc4afa6cf840776c`
- `0029_admin_action_receipts.sql`: `e9fe3a6d64cc3a3b4ba39a0ce7437bbd9d575202b365e857517cbede105fa3a3`
- `0029_external_article_receipts.sql`: `5de4e17953fc5afba8f412c0ebe0ae8493766bee1f9babf684946940d3158251`
- `0030_directory_acquisition.sql`: `478f66a183efd28310ca4e50e021fd6ae11492b9cacc2deffc85a1f5ab549e47`
- `0031_crm_adapter_outbox.sql`: `ced320a585dede1bd15b4472f25d6039c65ec46fa0773ad5de4b56e4aa1023e7`

## Decision

The existing receiver binding and shared secret name are present, but the producer schema and code
are not current. A bounded pilot cannot start: the source has only 10 organizations, the contact
authority table is absent, and the active Worker predates the repaired full-run reconciliation.

The CRM staging receiver separately has migrations `0026` and `0027` pending. Their aggregate is
`4be1cc555913c9dc84490651709347f5d53904b1b34d633d04917d86215c546d` (`0026`:
`c716db681a5169168cceeede010a141a05ccb724915f4ec7ec160ca3b1e63902`; `0027`:
`31d27de32562067d1d37f117da3712ff32637ce4e1bb335ac9cce797bd995e1c`).

The next remote gate should remain infrastructure-only:

1. retain a staging D1 backup/bookmark;
2. apply only directory migrations `0017`/`0018`/`0019` through a reviewed forward-only execution,
   not the empty-ledger full lineage;
3. apply exactly the 20-file ops pending set and receiver migrations `0026`/`0027` recorded above;
4. deploy exact producer and receiver candidates recorded above with both producer flags false;
5. prove migration ledger/schema, binding, secret-name, schedule, and disabled no-op behavior;
6. stop before setting an activation boundary, seeding/copying pilot data, enabling either flag, or
   moving any organization/contact row.

Pilot selection/data handling, activation watermark, full backfill, production, export, and send
remain later exact gates.
