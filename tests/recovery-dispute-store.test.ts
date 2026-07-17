import { describe, expect, it } from 'vitest';
import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';
import { consumeRecoveryChallenge, recordRecoveryFailure } from '../src/lib/recovery-store';
import { openOwnerDisputeByCustomer, resolveOwnerDisputeByStaff } from '../src/lib/owner-dispute-store';

function dbWithChanges(changes: number[], sql: string[] = []): D1Database {
  return {
    prepare(query: string) { sql.push(query); const value = { bind: () => value }; return value as unknown as D1PreparedStatement; },
    batch: async () => changes.map((count) => ({ success: true, meta: { changes: count } })),
  } as unknown as D1Database;
}

describe('recovery transaction store', () => {
  it('atomically consumes a challenge, requests all-session revocation, and audits', async () => {
    const sql: string[] = [];
    await expect(consumeRecoveryChallenge(dbWithChanges([1, 1, 1], sql), { challengeId: 'challenge-1', tokenSha256: 'a'.repeat(64), requestContextHash: 'b'.repeat(64), expectedAttempts: 0, occurredAt: '2026-07-16T00:00:00Z', providerCode: 'provider', revocationId: 'revoke-1', securityEventId: 'security-1', idempotencyKey: 'recover-1' })).resolves.toBe('completed');
    expect(sql.join('\n')).toContain("'all_user_sessions'");
    expect(sql.join('\n')).toContain("status = 'pending'");
  });

  it('records bounded failures and denies incoherent transactions', async () => {
    await expect(recordRecoveryFailure(dbWithChanges([1, 1]), { challengeId: 'challenge-1', expectedAttempts: 0, occurredAt: '2026-07-16T00:00:00Z', securityEventId: 'security-1', idempotencyKey: 'failure-1', reasonCode: 'token_mismatch' })).resolves.toBe('completed');
    await expect(recordRecoveryFailure(dbWithChanges([0, 0]), { challengeId: 'challenge-1', expectedAttempts: 0, occurredAt: '2026-07-16T00:00:00Z', securityEventId: 'security-1', idempotencyKey: 'failure-1', reasonCode: 'token_mismatch' })).resolves.toBe('denied');
  });
});

describe('owner dispute transaction store', () => {
  it('couples customer dispute opening to claim suspension boundary and audit', async () => {
    const sql: string[] = [];
    await expect(openOwnerDisputeByCustomer(dbWithChanges([1, 1, 1, 1], sql), { disputeId: 'dispute-1', eventId: 'event-1', claimEventId: 'claim-event-1', ownerClaimId: 'claim-1', customerUserId: 'user-1', reasonCode: 'ownership_contested', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'dispute-1' })).resolves.toBe('completed');
    expect(sql.join('\n')).toContain("m.role IN ('owner','admin')");
    expect(sql.join('\n')).toContain("status = 'disputed'");
  });

  it('requires verified staff and reason for resolution', async () => {
    const base = { disputeId: 'dispute-1', eventId: 'event-2', claimEventId: 'claim-event-2', verifiedStaffRef: 'staff:1', resolution: 'resolved_upheld' as const, reasonCode: 'evidence_confirmed', occurredAt: '2026-07-16T00:00:00Z', idempotencyKey: 'resolve-1' };
    await expect(resolveOwnerDisputeByStaff(dbWithChanges([1, 1, 1, 1]), base)).resolves.toBe('completed');
    await expect(resolveOwnerDisputeByStaff(dbWithChanges([1, 1, 1, 1]), { ...base, verifiedStaffRef: '' })).resolves.toBe('denied');
  });
});
