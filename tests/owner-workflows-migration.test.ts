import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('owner workflow migration', () => {
  it('contains auditable claims, evidence, edits, events, and disputes', async () => {
    const sql = await readFile(new URL('../migrations-pcd-ops/0017_owner_claims_and_proposed_edits.sql', import.meta.url), 'utf8');
    for (const table of ['owner_claims', 'owner_claim_evidence', 'owner_claim_events', 'owner_proposed_edits', 'owner_disputes']) expect(sql).toContain(`CREATE TABLE ${table}`);
    expect(sql).toContain('UNIQUE(owner_claim_id, idempotency_key)');
    expect(sql).toContain('base_record_sha256');
    expect(sql).toContain('proposed_patch_sha256');
    expect(sql).not.toMatch(/CREATE TABLE (orders|payment_events|entitlements)/);
  });
});
