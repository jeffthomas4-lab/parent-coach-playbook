import { describe, expect, it } from 'vitest';
import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';
import { acceptCustomerInvitation, listAuthorizedOrganizations, recordIdentityProviderEvent } from '../src/lib/customer-store';

function statement(_sql: string, firstValue: unknown = null): D1PreparedStatement {
  const self = {
    bind: () => self,
    first: async () => firstValue,
    run: async () => ({ success: true, meta: { changes: 1 } }),
    all: async () => ({ success: true, results: firstValue ?? [], meta: {} }),
    raw: async () => [],
  };
  return self as unknown as D1PreparedStatement;
}

describe('customer D1 store', () => {
  it('accepts membership and consumes its invitation in one transactional batch', async () => {
    const sql: string[] = [];
    const db = {
      prepare(query: string) { sql.push(query); return statement(query); },
      batch: async () => [{ success: true, meta: { changes: 1 } }, { success: true, meta: { changes: 1 } }],
    } as unknown as D1Database;
    await expect(acceptCustomerInvitation(db, {
      invitationId: 'invite-1', tokenSha256: 'a'.repeat(64), authenticatedCustomerUserId: 'user-2',
      authenticatedEmailNormalized: 'owner@example.com', membershipId: 'member-2', acceptedAt: '2026-07-16T00:00:00Z',
    })).resolves.toBe('accepted');
    expect(sql.join('\n')).toContain("INSERT INTO organization_memberships");
    expect(sql.join('\n')).toContain("status = 'pending'");
    expect(sql.join('\n')).toContain('invited_email_normalized');
  });

  it('fails closed when neither conditional statement changes a row', async () => {
    const db = {
      prepare: (query: string) => statement(query),
      batch: async () => [{ success: true, meta: { changes: 0 } }, { success: true, meta: { changes: 0 } }],
    } as unknown as D1Database;
    await expect(acceptCustomerInvitation(db, {
      invitationId: 'invite-1', tokenSha256: 'a'.repeat(64), authenticatedCustomerUserId: 'user-2',
      authenticatedEmailNormalized: 'wrong@example.com', membershipId: 'member-2', acceptedAt: '2026-07-16T00:00:00Z',
    })).resolves.toBe('not_eligible');
  });

  it('deduplicates provider lifecycle events and rejects changed-payload replay', async () => {
    const replayDb = { prepare: (query: string) => statement(query, { payload_sha256: 'a'.repeat(64) }) } as unknown as D1Database;
    const base = { id: 'event-1', providerCode: 'provider', providerEventId: 'evt-1', eventType: 'user.updated', payloadSha256: 'a'.repeat(64), signatureVerifiedAt: '2026-07-16T00:00:00Z', receivedAt: '2026-07-16T00:00:00Z' };
    await expect(recordIdentityProviderEvent(replayDb, base)).resolves.toBe('replay');
    await expect(recordIdentityProviderEvent(replayDb, { ...base, payloadSha256: 'b'.repeat(64) })).resolves.toBe('payload_conflict');
  });

  it('queries organizations only through active internal user, tenant, and membership state', async () => {
    const sql: string[] = [];
    const db = { prepare(query: string) { sql.push(query); return statement(query, [{ organizationId: 'org-1', displayName: 'Camp', role: 'owner' }]); } } as unknown as D1Database;
    await expect(listAuthorizedOrganizations(db, 'user-1')).resolves.toEqual([{ organizationId: 'org-1', displayName: 'Camp', role: 'owner' }]);
    expect(sql[0]).toContain("m.status = 'active'");
    expect(sql[0]).toContain("o.status = 'active'");
    expect(sql[0]).toContain("u.status = 'active'");
  });
});
