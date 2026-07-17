export type ChallengeStatus = 'pending' | 'consumed' | 'revoked' | 'expired' | 'locked';

export function evaluateOneTimeChallenge(input: {
  status: ChallengeStatus;
  now: Date;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  contextMatches: boolean;
}): 'valid' | 'expired' | 'locked' | 'consumed' | 'revoked' | 'context_mismatch' {
  if (input.status === 'consumed') return 'consumed';
  if (input.status === 'revoked') return 'revoked';
  if (input.status === 'locked' || input.attempts >= input.maxAttempts) return 'locked';
  const expiry = Date.parse(input.expiresAt);
  if (!Number.isFinite(expiry) || expiry <= input.now.getTime() || input.status === 'expired') return 'expired';
  if (!input.contextMatches) return 'context_mismatch';
  return 'valid';
}

export function invitationMayBeAccepted(input: {
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  now: Date;
  expiresAt: string;
  invitedEmailNormalized: string;
  authenticatedEmailNormalized: string;
  authenticatedEmailVerified: boolean;
}): 'authorized' | 'not_pending' | 'expired' | 'verified_email_required' | 'email_mismatch' {
  if (input.status !== 'pending') return 'not_pending';
  const expiry = Date.parse(input.expiresAt);
  if (!Number.isFinite(expiry) || expiry <= input.now.getTime()) return 'expired';
  if (!input.authenticatedEmailVerified) return 'verified_email_required';
  if (input.invitedEmailNormalized !== input.authenticatedEmailNormalized) return 'email_mismatch';
  return 'authorized';
}

export function nextChallengeFailure(input: { attempts: number; maxAttempts: number }): { attempts: number; status: 'pending' | 'locked' } {
  const attempts = input.attempts + 1;
  return { attempts, status: attempts >= input.maxAttempts ? 'locked' : 'pending' };
}
