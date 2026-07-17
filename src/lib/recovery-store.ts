import type { D1Database, D1Result } from '@cloudflare/workers-types';

function changes(result: D1Result<unknown> | undefined): number {
  return Number(result?.meta?.changes ?? 0);
}

function coupled(results: D1Result<unknown>[], expected: number, operation: string): 'completed' | 'denied' {
  const counts = results.map(changes);
  if (counts.length === expected && counts.every((count) => count === 1)) return 'completed';
  if (counts.every((count) => count === 0)) return 'denied';
  throw new Error(`${operation} transaction invariant violated`);
}

export async function consumeRecoveryChallenge(db: D1Database, input: {
  challengeId: string;
  tokenSha256: string;
  requestContextHash: string;
  expectedAttempts: number;
  occurredAt: string;
  providerCode: string;
  revocationId: string;
  securityEventId: string;
  idempotencyKey: string;
}): Promise<'completed' | 'denied'> {
  const consume = db.prepare(
    `UPDATE customer_recovery_challenges
        SET status = 'consumed', consumed_at = ?1
      WHERE id = ?2 AND token_sha256 = ?3 AND request_context_hash = ?4
        AND status = 'pending' AND expires_at > ?1
        AND attempts = ?5 AND attempts < max_attempts`,
  ).bind(input.occurredAt, input.challengeId, input.tokenSha256,
    input.requestContextHash, input.expectedAttempts);
  const revoke = db.prepare(
    `INSERT INTO customer_session_revocations
       (id, customer_user_id, provider_code, provider_session_ref_hash,
        scope, reason_code, requested_at, attempts)
     SELECT ?1, customer_user_id, ?2, NULL, 'all_user_sessions',
            'recovery', ?3, 0
       FROM customer_recovery_challenges
      WHERE id = ?4 AND status = 'consumed' AND consumed_at = ?3`,
  ).bind(input.revocationId, input.providerCode, input.occurredAt, input.challengeId);
  const audit = db.prepare(
    `INSERT INTO customer_security_events
       (id, customer_user_id, event_type, actor_type, actor_ref, outcome,
        reason_code, context_hash, occurred_at, idempotency_key)
     SELECT ?1, customer_user_id, 'recovery_challenge_consumed', 'customer',
            customer_user_id, 'completed', 'recovery_verified',
            request_context_hash, ?2, ?3
       FROM customer_recovery_challenges
      WHERE id = ?4 AND status = 'consumed' AND consumed_at = ?2`,
  ).bind(input.securityEventId, input.occurredAt, input.idempotencyKey, input.challengeId);
  return coupled(await db.batch([consume, revoke, audit]), 3, 'recovery consumption');
}

export async function recordRecoveryFailure(db: D1Database, input: {
  challengeId: string;
  expectedAttempts: number;
  occurredAt: string;
  securityEventId: string;
  idempotencyKey: string;
  reasonCode: 'token_mismatch' | 'context_mismatch';
}): Promise<'completed' | 'denied'> {
  const nextAttempts = input.expectedAttempts + 1;
  const update = db.prepare(
    `UPDATE customer_recovery_challenges
        SET attempts = ?1,
            status = CASE WHEN ?1 >= max_attempts THEN 'locked' ELSE 'pending' END
      WHERE id = ?2 AND status = 'pending' AND attempts = ?3
        AND expires_at > ?4`,
  ).bind(nextAttempts, input.challengeId, input.expectedAttempts, input.occurredAt);
  const audit = db.prepare(
    `INSERT INTO customer_security_events
       (id, customer_user_id, event_type, actor_type, actor_ref, outcome,
        reason_code, context_hash, occurred_at, idempotency_key)
     SELECT ?1, customer_user_id, 'recovery_challenge_failed', 'customer',
            customer_user_id, 'denied', ?2, request_context_hash, ?3, ?4
       FROM customer_recovery_challenges
      WHERE id = ?5 AND attempts = ?6
        AND status IN ('pending','locked')`,
  ).bind(input.securityEventId, input.reasonCode, input.occurredAt,
    input.idempotencyKey, input.challengeId, nextAttempts);
  return coupled(await db.batch([update, audit]), 2, 'recovery failure');
}
