import { describe, expect, it } from 'vitest';
import type { D1Database, D1PreparedStatement } from '@cloudflare/workers-types';
import { claimPrivacyCascadeExecution, recordPrivacyExportArtifact, settlePrivacyCascadeExecution } from '../src/lib/privacy-execution-store';

function dbWithChanges(counts: number[]): D1Database {
  return {
    prepare() { const value = { bind: () => value, run: async () => ({ success: true, meta: { changes: 1 } }) }; return value as unknown as D1PreparedStatement; },
    batch: async () => counts.map((changes) => ({ success: true, meta: { changes } })),
  } as unknown as D1Database;
}

describe('privacy execution evidence store', () => {
  it('claims and settles one cascade item with provider verification evidence', async () => {
    await expect(claimPrivacyCascadeExecution(dbWithChanges([1, 1]), { attemptId: 'attempt-1', cascadeItemId: 'item-1', executorRef: 'worker:1', idempotencyKey: 'item-1:1', claimedAt: '2026-07-16T00:00:00Z' })).resolves.toBe('completed');
    await expect(settlePrivacyCascadeExecution(dbWithChanges([1, 1, 1]), { attemptId: 'attempt-1', cascadeItemId: 'item-1', settledAt: '2026-07-16T00:01:00Z', outcome: 'verified', providerCode: 'identity', providerReference: 'provider-1', verificationReference: 'verify-1' })).resolves.toBe('completed');
  });

  it('refuses incomplete success and retry evidence', async () => {
    await expect(settlePrivacyCascadeExecution(dbWithChanges([1, 1, 1]), { attemptId: 'attempt-1', cascadeItemId: 'item-1', settledAt: '2026-07-16T00:01:00Z', outcome: 'verified', providerCode: 'identity' })).resolves.toBe('denied');
    await expect(settlePrivacyCascadeExecution(dbWithChanges([1, 1, 1]), { attemptId: 'attempt-1', cascadeItemId: 'item-1', settledAt: '2026-07-16T00:01:00Z', outcome: 'retry_wait' })).resolves.toBe('denied');
  });

  it('records only expiring exports for identity-verified requests', async () => {
    const base = { artifactId: 'artifact-1', requestId: 'request-1', format: 'machine_readable' as const, version: 1, storageReference: 'exports/request-1.json', contentSha256: 'a'.repeat(64), generatedAt: '2026-07-16T00:00:00Z', expiresAt: '2026-07-17T00:00:00Z', verifiedBy: 'staff:1' };
    await expect(recordPrivacyExportArtifact(dbWithChanges([]), base)).resolves.toBe('completed');
    await expect(recordPrivacyExportArtifact(dbWithChanges([]), { ...base, artifactId: 'bad', expiresAt: base.generatedAt })).resolves.toBe('denied');
  });
});
