# PLAT-009 Gate 9C-B staging producer preflight

Status: **HOLD — READ-ONLY PREFLIGHT ONLY**  
Observed: 2026-09-04  
PCD implementation candidate: `c23b6e4baf950748e216906b995abbe463388dea`
Candidate tree: `5088032c68724686b987891a410099abfc02abcb`

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

The ops staging D1 has no `org_contacts` table. Wrangler reports 12 pending migration files:

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

Pending-set aggregate:
`12129ae2a3dfd84d6d5ee9e8c221be2c34fa7e4c1c293f08329729f6adc31357`

Aggregate algorithm:
`sha256(utf8(compact-json(sorted [{name,sha256}])))`.

The two CRM-specific migration hashes are:

- `0032`: `48a96fbccc0984af8ea435b27d1c0d3ad8d5956354f976643d3574e454a4d842`
- `0033`: `b06535eb8b374f4a69106b371cb89680f0219251a54244d4b07cb30c46d8120d`

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

The next remote gate should remain infrastructure-only:

1. retain a staging D1 backup/bookmark;
2. authorize and apply exactly the observed 12-file pending migration set;
3. deploy exact candidate `c23b6e4baf950748e216906b995abbe463388dea` with both adapter flags false;
4. prove migration ledger/schema, binding, secret-name, schedule, and disabled no-op behavior;
5. stop before setting an activation boundary, seeding/copying pilot data, enabling either flag, or
   moving any organization/contact row.

Pilot selection/data handling, activation watermark, full backfill, production, export, and send
remain later exact gates.
