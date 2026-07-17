import { describe, expect, it } from 'vitest';
import { evaluateOneTimeChallenge, invitationMayBeAccepted, nextChallengeFailure } from '../src/lib/customer-challenges';

const now = new Date('2026-07-16T12:00:00Z');

describe('customer one-time challenges', () => {
  it('rejects replay, expiry, lockout, and context mismatch', () => {
    const base = { now, expiresAt: '2026-07-16T12:10:00Z', attempts: 0, maxAttempts: 3, contextMatches: true };
    expect(evaluateOneTimeChallenge({ ...base, status: 'pending' })).toBe('valid');
    expect(evaluateOneTimeChallenge({ ...base, status: 'consumed' })).toBe('consumed');
    expect(evaluateOneTimeChallenge({ ...base, status: 'pending', expiresAt: '2026-07-16T11:59:59Z' })).toBe('expired');
    expect(evaluateOneTimeChallenge({ ...base, status: 'pending', attempts: 3 })).toBe('locked');
    expect(evaluateOneTimeChallenge({ ...base, status: 'pending', contextMatches: false })).toBe('context_mismatch');
  });

  it('accepts invitations only for the matching verified identity', () => {
    const base = { status: 'pending' as const, now, expiresAt: '2026-07-17T12:00:00Z', invitedEmailNormalized: 'owner@example.com', authenticatedEmailNormalized: 'owner@example.com', authenticatedEmailVerified: true };
    expect(invitationMayBeAccepted(base)).toBe('authorized');
    expect(invitationMayBeAccepted({ ...base, authenticatedEmailVerified: false })).toBe('verified_email_required');
    expect(invitationMayBeAccepted({ ...base, authenticatedEmailNormalized: 'other@example.com' })).toBe('email_mismatch');
  });

  it('locks at the configured failed-attempt limit', () => {
    expect(nextChallengeFailure({ attempts: 1, maxAttempts: 3 })).toEqual({ attempts: 2, status: 'pending' });
    expect(nextChallengeFailure({ attempts: 2, maxAttempts: 3 })).toEqual({ attempts: 3, status: 'locked' });
  });
});
