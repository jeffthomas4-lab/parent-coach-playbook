import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('customer identity and tenancy migration', () => {
  it('creates the provider-neutral identity and tenant authority without commerce', async () => {
    const sql = await readFile(new URL('../migrations-pcd-ops/0016_customer_identity_and_tenancy.sql', import.meta.url), 'utf8');
    for (const table of ['customer_users', 'customer_identities', 'customer_organizations', 'organization_memberships', 'customer_session_revocations', 'identity_provider_events']) {
      expect(sql).toContain(`CREATE TABLE ${table}`);
    }
    expect(sql).toContain('UNIQUE(provider_code, provider_subject)');
    expect(sql).toContain('UNIQUE(organization_id, customer_user_id)');
    expect(sql).toContain('UNIQUE(provider_code, provider_event_id)');
    expect(sql).not.toMatch(/CREATE TABLE (orders|payment_events|entitlements)/);
  });

  it('makes deactivation, revocation, lifecycle deduplication, and membership states explicit', async () => {
    const sql = await readFile(new URL('../migrations-pcd-ops/0016_customer_identity_and_tenancy.sql', import.meta.url), 'utf8');
    expect(sql).toContain("'deactivation_pending','deactivated'");
    expect(sql).toContain("'logout','recovery','security','suspension','deactivation','privacy_request'");
    expect(sql).toContain("'pending','processed','ignored','failed','dead_letter'");
    expect(sql).toContain("'invited','active','suspended','revoked'");
  });
});
