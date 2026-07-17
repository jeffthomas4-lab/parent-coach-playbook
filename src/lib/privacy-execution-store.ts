import type { D1Database, D1Result } from '@cloudflare/workers-types';

function changes(result: D1Result<unknown> | undefined): number {
  return Number(result?.meta?.changes ?? 0);
}

function coupled(results: D1Result<unknown>[], operation: string): 'completed' | 'denied' {
  const counts = results.map(changes);
  if (counts.every((count) => count === 1)) return 'completed';
  if (counts.every((count) => count === 0)) return 'denied';
  throw new Error(`${operation} transaction invariant violated`);
}

export async function claimPrivacyCascadeExecution(db: D1Database, input: {
  attemptId: string;
  cascadeItemId: string;
  executorRef: string;
  idempotencyKey: string;
  claimedAt: string;
}): Promise<'completed' | 'denied'> {
  const claim = db.prepare(
    `UPDATE privacy_cascade_items
        SET state = 'in_progress', attempt_count = attempt_count + 1,
            checkpoint = ?1, updated_at = ?2
      WHERE id = ?3 AND hold_state = 'clear'
        AND state IN ('pending','retry_wait')
        AND (next_attempt_at IS NULL OR next_attempt_at <= ?2)
        AND attempt_count < 20`,
  ).bind(`attempt:${input.attemptId}`, input.claimedAt, input.cascadeItemId);
  const attempt = db.prepare(
    `INSERT INTO privacy_cascade_execution_attempts
       (id, cascade_item_id, request_id, executor_ref, idempotency_key,
        status, claimed_at, checkpoint)
     SELECT ?1, i.id, i.request_id, ?2, ?3, 'claimed', ?4, i.checkpoint
       FROM privacy_cascade_items i WHERE i.id = ?5 AND i.state = 'in_progress'
         AND i.updated_at = ?4 AND i.checkpoint = ?6`,
  ).bind(input.attemptId, input.executorRef, input.idempotencyKey, input.claimedAt,
    input.cascadeItemId, `attempt:${input.attemptId}`);
  return coupled(await db.batch([claim, attempt]), 'privacy cascade claim');
}

export async function settlePrivacyCascadeExecution(db: D1Database, input: {
  attemptId: string;
  cascadeItemId: string;
  settledAt: string;
  outcome: 'verified' | 'retry_wait' | 'dead_letter' | 'blocked';
  providerCode?: string;
  providerReference?: string;
  verificationReference?: string;
  errorCode?: string;
  nextAttemptAt?: string;
  checkpoint?: string;
}): Promise<'completed' | 'denied'> {
  if (input.outcome === 'verified' && (!input.providerCode || !input.verificationReference)) return 'denied';
  if (input.outcome === 'retry_wait' && !input.nextAttemptAt) return 'denied';
  const item = db.prepare(
    `UPDATE privacy_cascade_items
        SET state = ?1, next_attempt_at = ?2, last_error_code = ?3,
            checkpoint = ?4, verification_ref = CASE WHEN ?1 = 'verified' THEN ?5 ELSE verification_ref END,
            verified_at = CASE WHEN ?1 = 'verified' THEN ?6 ELSE verified_at END,
            updated_at = ?6
      WHERE id = ?7 AND state = 'in_progress'
        AND checkpoint = (SELECT checkpoint FROM privacy_cascade_execution_attempts WHERE id = ?8 AND status = 'claimed')`,
  ).bind(input.outcome, input.nextAttemptAt ?? null, input.errorCode ?? null,
    input.checkpoint ?? null, input.verificationReference ?? null, input.settledAt,
    input.cascadeItemId, input.attemptId);
  const attempt = db.prepare(
    `UPDATE privacy_cascade_execution_attempts
        SET status = ?1, settled_at = ?2, provider_code = ?3,
            provider_reference = ?4, verification_reference = ?5,
            error_code = ?6, checkpoint = ?7
      WHERE id = ?8 AND cascade_item_id = ?9 AND status = 'claimed'`,
  ).bind(input.outcome, input.settledAt, input.providerCode ?? null,
    input.providerReference ?? null, input.verificationReference ?? null,
    input.errorCode ?? null, input.checkpoint ?? null, input.attemptId, input.cascadeItemId);
  const receipt = db.prepare(
    `INSERT INTO privacy_provider_receipts
       (id, request_id, cascade_item_id, provider_code, operation, state,
        provider_reference, payload_hash, observed_at)
     SELECT ?1, i.request_id, i.id, ?2,
            CASE i.disposition WHEN 'delete' THEN 'delete' WHEN 'anonymize' THEN 'anonymize'
              WHEN 'detach' THEN 'detach' WHEN 'retain' THEN 'retain_confirmed' ELSE 'export' END,
            CASE ?3 WHEN 'verified' THEN 'confirmed' WHEN 'retry_wait' THEN 'timeout'
              WHEN 'dead_letter' THEN 'ambiguous' ELSE 'rejected' END,
            ?4, ?5, ?6
       FROM privacy_cascade_items i WHERE i.id = ?7 AND i.state = ?3
         AND i.updated_at = ?6`,
  ).bind(`receipt:${input.attemptId}`, input.providerCode ?? 'internal', input.outcome,
    input.providerReference ?? null, '0'.repeat(64), input.settledAt,
    input.cascadeItemId);
  return coupled(await db.batch([item, attempt, receipt]), 'privacy cascade settlement');
}

export async function recordPrivacyExportArtifact(db: D1Database, input: {
  artifactId: string;
  requestId: string;
  format: 'machine_readable' | 'human_readable';
  version: number;
  storageReference: string;
  contentSha256: string;
  generatedAt: string;
  expiresAt: string;
  verifiedBy: string;
}): Promise<'completed' | 'denied'> {
  if (!input.storageReference.trim() || !input.verifiedBy.trim() || input.expiresAt <= input.generatedAt) return 'denied';
  const result = await db.prepare(
    `INSERT INTO privacy_export_artifacts
       (id, request_id, format, version, storage_reference, content_sha256,
        generated_at, expires_at, status, verified_by, verified_at)
     SELECT ?1, id, ?2, ?3, ?4, ?5, ?6, ?7, 'generated', ?8, ?6
       FROM privacy_requests
      WHERE id = ?9 AND identity_state = 'verified'
        AND status IN ('verified','deactivated','recovery_window','executing')`,
  ).bind(input.artifactId, input.format, input.version, input.storageReference,
    input.contentSha256, input.generatedAt, input.expiresAt, input.verifiedBy,
    input.requestId).run();
  return changes(result) === 1 ? 'completed' : 'denied';
}
