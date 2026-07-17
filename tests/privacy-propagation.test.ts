import { describe, expect, it, vi } from 'vitest';
import { executePrivacyPropagation, type PrivacyCascadeWorkItem, type PrivacyPropagationAdapter } from '../src/lib/privacy-propagation';

const item: PrivacyCascadeWorkItem = { id: 'item-1', requestId: 'request-1', systemCode: 'identity', disposition: 'delete', holdState: 'clear', attemptCount: 0 };
const adapter = (overrides: Partial<PrivacyPropagationAdapter> = {}): PrivacyPropagationAdapter => ({
  systemCode: 'identity',
  execute: vi.fn().mockResolvedValue({ state: 'confirmed', retryable: false, providerReference: 'provider-1', verificationReference: 'verify-1' }),
  verify: vi.fn().mockResolvedValue(true),
  ...overrides,
});

describe('privacy provider propagation', () => {
  it('requires an independent verification result before completion', async () => {
    await expect(executePrivacyPropagation({ item, adapter: adapter(), now: new Date('2026-07-16T00:00:00Z') })).resolves.toEqual({ state: 'verified', verificationReference: 'verify-1', providerReference: 'provider-1', checkpoint: undefined });
    await expect(executePrivacyPropagation({ item, adapter: adapter({ verify: vi.fn().mockResolvedValue(false) }), now: new Date('2026-07-16T00:00:00Z') })).resolves.toEqual({ state: 'dead_letter', errorCode: 'verification_failed', checkpoint: undefined });
  });

  it('blocks legal holds and adapter scope mismatch before any provider call', async () => {
    const heldAdapter = adapter();
    await expect(executePrivacyPropagation({ item: { ...item, holdState: 'held' }, adapter: heldAdapter, now: new Date() })).resolves.toEqual({ state: 'blocked', errorCode: 'legal_hold_blocks_destructive_disposition' });
    expect(heldAdapter.execute).not.toHaveBeenCalled();
    await expect(executePrivacyPropagation({ item, adapter: adapter({ systemCode: 'email' }), now: new Date() })).resolves.toEqual({ state: 'blocked', errorCode: 'adapter_scope_mismatch' });
  });

  it('retries bounded failures and dead-letters ambiguous thrown outcomes', async () => {
    await expect(executePrivacyPropagation({ item, adapter: adapter({ execute: vi.fn().mockResolvedValue({ state: 'timeout', retryable: true, errorCode: 'timeout' }) }), now: new Date('2026-07-16T00:00:00Z') })).resolves.toEqual({ state: 'retry_wait', nextAttemptAt: '2026-07-16T00:15:00.000Z', errorCode: 'timeout', checkpoint: undefined });
    await expect(executePrivacyPropagation({ item, adapter: adapter({ execute: vi.fn().mockRejectedValue(new Error('unknown')) }), now: new Date('2026-07-16T00:00:00Z') })).resolves.toEqual({ state: 'dead_letter', errorCode: 'adapter_outcome_unknown', checkpoint: undefined });
  });
});
