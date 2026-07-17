export const TRUST_CASE_CATEGORIES = [
  'listing_correction', 'listing_removal', 'privacy', 'copyright',
  'accessibility', 'safety_concern', 'other',
] as const;
export type TrustCaseCategory = typeof TRUST_CASE_CATEGORIES[number];
export type TrustCaseStatus = 'open' | 'in_review' | 'resolved' | 'closed';
export type TrustCasePriority = 'normal' | 'high' | 'urgent';
export type TrustResolutionCode = 'corrected' | 'removed' | 'fulfilled' | 'no_action' | 'duplicate' | 'out_of_scope' | 'referred';
export type SuppressionReason = 'rights_request' | 'operator_request' | 'duplicate' | 'unsafe_source' | 'legal_hold' | 'other';

export interface ContentSuppression {
  id: string;
  case_id: string;
  camp_slug: string | null;
  target_url: string | null;
  reason_code: SuppressionReason;
  status: 'proposed' | 'active' | 'lifted';
  proposed_by: string;
  proposed_at: string;
}

const TARGET_DAYS: Record<TrustCaseCategory, number> = {
  listing_correction: 7, listing_removal: 7, privacy: 30,
  copyright: 3, accessibility: 7, safety_concern: 1, other: 7,
};
export const trustCasePriority = (category: TrustCaseCategory): TrustCasePriority =>
  category === 'safety_concern' ? 'urgent' : category === 'privacy' || category === 'copyright' ? 'high' : 'normal';
export const trustCaseDueAt = (category: TrustCaseCategory, submittedAt: string): string =>
  new Date(new Date(submittedAt).getTime() + TARGET_DAYS[category] * 86_400_000).toISOString();

export interface TrustCase {
  id: string;
  category: TrustCaseCategory;
  target_url: string | null;
  camp_slug: string | null;
  requester_email: string;
  requester_name: string | null;
  description: string;
  desired_resolution: string | null;
  priority: TrustCasePriority;
  due_at: string;
  status: TrustCaseStatus;
  submitted_at: string;
  updated_at: string;
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_code: TrustResolutionCode | null;
  resolution_notes: string | null;
  intake_key: string | null;
  request_fingerprint: string | null;
}

export interface TrustResponseDraft {
  id: string;
  case_id: string;
  revision: number;
  recipient_email: string;
  subject: string;
  body_text: string;
  content_hash: string;
  expires_at: string;
  status: 'draft' | 'approved' | 'sent' | 'void';
  created_by: string;
  created_at: string;
  approved_by?: string | null;
  approved_at?: string | null;
  approved_content_hash?: string | null;
  sent_by?: string | null;
  sent_at?: string | null;
  provider_message_id?: string | null;
  voided_by?: string | null;
  voided_at?: string | null;
}

const draftPayloadHash = async (recipient: string, subject: string, bodyText: string): Promise<string> => {
  const payload = JSON.stringify({ recipient: recipient.trim().toLowerCase(), subject, body_text: bodyText });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

export type TrustCaseInsertResult =
  | { outcome: 'created' | 'replayed'; id: string }
  | { outcome: 'conflict' };

export async function insertTrustCase(db: D1Database, value: TrustCase): Promise<TrustCaseInsertResult> {
  const writes = await db.batch([
    db.prepare(
    `INSERT INTO trust_cases
      (id, category, target_url, camp_slug, requester_email, requester_name,
       description, desired_resolution, priority, due_at, status, submitted_at,
       updated_at, acknowledged_at, acknowledged_by, resolved_at, resolved_by,
       resolution_code, resolution_notes, intake_key, request_fingerprint)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(intake_key) WHERE intake_key IS NOT NULL DO NOTHING`,
  ).bind(
    value.id, value.category, value.target_url, value.camp_slug,
    value.requester_email, value.requester_name, value.description,
    value.desired_resolution, value.priority, value.due_at, value.status,
    value.submitted_at, value.updated_at, value.acknowledged_at,
    value.acknowledged_by, value.resolved_at, value.resolved_by,
    value.resolution_code, value.resolution_notes, value.intake_key,
    value.request_fingerprint,
  ),
    db.prepare(
      `INSERT INTO trust_case_events
        (id, case_id, event_type, actor, from_status, to_status, created_at)
       SELECT ?, id, 'submitted', 'public-intake', NULL, 'open', ?
         FROM trust_cases
        WHERE intake_key = ? AND request_fingerprint = ?
          AND NOT EXISTS (SELECT 1 FROM trust_case_events
            WHERE case_id = trust_cases.id AND event_type = 'submitted')`,
    ).bind(`event_${crypto.randomUUID()}`, value.submitted_at,
      value.intake_key, value.request_fingerprint),
    db.prepare(
      `INSERT INTO notification_outbox
        (id, event_type, aggregate_type, aggregate_id, priority, status,
         attempt_count, available_at, created_at, updated_at)
       SELECT ?, 'trust_case_submitted', 'trust_case', id, priority, 'pending', 0, ?, ?, ?
         FROM trust_cases
        WHERE intake_key = ? AND request_fingerprint = ?
          AND NOT EXISTS (SELECT 1 FROM notification_outbox
            WHERE aggregate_type = 'trust_case' AND aggregate_id = trust_cases.id
              AND event_type = 'trust_case_submitted')`,
    ).bind(`notification_${crypto.randomUUID()}`, value.submitted_at,
      value.submitted_at, value.submitted_at, value.intake_key,
      value.request_fingerprint),
  ]);
  const existing = await db.prepare(
    `SELECT id, request_fingerprint FROM trust_cases WHERE intake_key = ?`,
  ).bind(value.intake_key).first<{ id: string; request_fingerprint: string }>();
  if (!existing || existing.request_fingerprint !== value.request_fingerprint) return { outcome: 'conflict' };
  return { outcome: Number(writes[0]?.meta?.changes ?? 0) === 1 ? 'created' : 'replayed', id: existing.id };
}

export async function findTrustCaseByIntakeKey(
  db: D1Database,
  intakeKey: string,
): Promise<Pick<TrustCase, 'id' | 'request_fingerprint'> | null> {
  return await db.prepare(
    `SELECT id, request_fingerprint FROM trust_cases WHERE intake_key = ?`,
  ).bind(intakeKey).first<Pick<TrustCase, 'id' | 'request_fingerprint'>>();
}

export async function createTrustResponseDraft(
  db: D1Database,
  caseId: string,
  actor: string,
  subject: string,
  bodyText: string,
): Promise<TrustResponseDraft | null> {
  const trustCase = await db.prepare(
    `SELECT id, requester_email, status FROM trust_cases WHERE id = ?`,
  ).bind(caseId).first<Pick<TrustCase, 'id' | 'requester_email' | 'status'>>();
  if (!trustCase || trustCase.status === 'closed') return null;
  const latest = await db.prepare(
    `SELECT COALESCE(MAX(revision), 0) AS revision FROM trust_response_drafts WHERE case_id = ?`,
  ).bind(caseId).first<{ revision: number }>();
  const now = new Date().toISOString();
  const contentHash = await draftPayloadHash(trustCase.requester_email, subject, bodyText);
  const draft: TrustResponseDraft = {
    id: `draft_${crypto.randomUUID()}`,
    case_id: caseId,
    revision: Number(latest?.revision ?? 0) + 1,
    recipient_email: trustCase.requester_email,
    subject,
    body_text: bodyText,
    content_hash: contentHash,
    expires_at: new Date(Date.parse(now) + 7 * 86_400_000).toISOString(),
    status: 'draft',
    created_by: actor,
    created_at: now,
  };
  await db.batch([
    db.prepare(
      `INSERT INTO trust_response_drafts
        (id, case_id, revision, recipient_email, subject, body_text, content_hash,
         expires_at, status, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
    ).bind(draft.id, draft.case_id, draft.revision, draft.recipient_email,
      draft.subject, draft.body_text, draft.content_hash, draft.expires_at,
      draft.created_by, draft.created_at),
    db.prepare(
      `INSERT INTO trust_response_draft_events
        (id, draft_id, case_id, event_type, actor, content_hash, created_at)
       VALUES (?, ?, ?, 'created', ?, ?, ?)`,
    ).bind(`draft_event_${crypto.randomUUID()}`, draft.id, draft.case_id,
      draft.created_by, draft.content_hash, draft.created_at),
    db.prepare(
      `INSERT INTO notification_outbox
        (id, event_type, aggregate_type, aggregate_id, priority, status,
         attempt_count, available_at, created_at, updated_at)
       VALUES (?, 'trust_draft_created', 'trust_response_draft', ?, 'normal', 'pending', 0, ?, ?, ?)`,
    ).bind(`notification_${crypto.randomUUID()}`, draft.id, now, now, now),
  ]);
  return draft;
}

export async function listPendingTrustResponseDrafts(db: D1Database): Promise<TrustResponseDraft[]> {
  const result = await db.prepare(
    `SELECT * FROM trust_response_drafts
      WHERE status = 'draft'
      ORDER BY expires_at ASC, created_at ASC
      LIMIT 200`,
  ).all<TrustResponseDraft>();
  return result.results ?? [];
}

export async function approveTrustResponseDraft(
  db: D1Database,
  caseId: string,
  draftId: string,
  actor: string,
  note: string,
): Promise<TrustResponseDraft | null> {
  const draft = await db.prepare(
    `SELECT * FROM trust_response_drafts WHERE id = ? AND case_id = ?`,
  ).bind(draftId, caseId).first<TrustResponseDraft>();
  if (!draft) return null;
  if (draft.status !== 'draft') throw new Error('draft is not pending');
  const now = new Date().toISOString();
  if (Date.parse(draft.expires_at) <= Date.parse(now)) throw new Error('draft expired');
  const currentHash = await draftPayloadHash(draft.recipient_email, draft.subject, draft.body_text);
  if (currentHash !== draft.content_hash) throw new Error('draft payload hash mismatch');
  const results = await db.batch([
    db.prepare(
      `UPDATE trust_response_drafts
        SET status = 'approved', approved_by = ?, approved_at = ?, approved_content_hash = ?
        WHERE id = ? AND case_id = ? AND status = 'draft'
          AND expires_at > ? AND content_hash = ?`,
    ).bind(actor, now, currentHash, draftId, caseId, now, currentHash),
    db.prepare(
      `INSERT INTO trust_response_draft_events
        (id, draft_id, case_id, event_type, actor, content_hash, note, created_at)
       SELECT ?, ?, ?, 'approved', ?, ?, ?, ?
        WHERE EXISTS (SELECT 1 FROM trust_response_drafts
          WHERE id = ? AND case_id = ? AND status = 'approved'
            AND approved_at = ? AND approved_content_hash = ?)`,
    ).bind(`draft_event_${crypto.randomUUID()}`, draftId, caseId, actor,
      currentHash, note, now, draftId, caseId, now, currentHash),
    db.prepare(
      `INSERT INTO notification_outbox
        (id, event_type, aggregate_type, aggregate_id, priority, status,
         attempt_count, available_at, created_at, updated_at)
       SELECT ?, 'trust_draft_approved', 'trust_response_draft', ?, 'normal', 'pending', 0, ?, ?, ?
        WHERE EXISTS (SELECT 1 FROM trust_response_drafts
          WHERE id = ? AND case_id = ? AND status = 'approved'
            AND approved_at = ? AND approved_content_hash = ?)`,
    ).bind(`notification_${crypto.randomUUID()}`, draftId, now, now, now,
      draftId, caseId, now, currentHash),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('draft changed concurrently');
  return await db.prepare(`SELECT * FROM trust_response_drafts WHERE id = ?`).bind(draftId).first<TrustResponseDraft>();
}

export type TrustDraftSendFailureReason = 'not_found' | 'not_approved' | 'expired' | 'case_inactive' | 'approval_hash_missing' | 'payload_hash_mismatch';
export type TrustDraftSendValidation =
  | { ok: true; draft: TrustResponseDraft }
  | { ok: false; reason: TrustDraftSendFailureReason };

/**
 * Final fail-closed gate for a future delivery executor. This function performs
 * no outbound action and no mutation. A sender must call it immediately before
 * provider delivery and use only the returned draft object.
 */
export async function validateApprovedTrustResponseDraft(
  db: D1Database,
  caseId: string,
  draftId: string,
  now = new Date().toISOString(),
): Promise<TrustDraftSendValidation> {
  const row = await db.prepare(
    `SELECT d.*, c.status AS case_status
       FROM trust_response_drafts d
       JOIN trust_cases c ON c.id = d.case_id
      WHERE d.id = ? AND d.case_id = ?`,
  ).bind(draftId, caseId).first<TrustResponseDraft & { case_status: TrustCaseStatus }>();
  if (!row) return { ok: false, reason: 'not_found' };
  if (row.status !== 'approved') return { ok: false, reason: 'not_approved' };
  if (Date.parse(row.expires_at) <= Date.parse(now)) return { ok: false, reason: 'expired' };
  if (row.case_status === 'closed') return { ok: false, reason: 'case_inactive' };
  const approvedHash = row.approved_content_hash;
  if (!approvedHash) return { ok: false, reason: 'approval_hash_missing' };
  const currentHash = await draftPayloadHash(row.recipient_email, row.subject, row.body_text);
  if (currentHash !== row.content_hash || currentHash !== approvedHash) {
    return { ok: false, reason: 'payload_hash_mismatch' };
  }
  const { case_status: _caseStatus, ...draft } = row;
  return { ok: true, draft };
}

/**
 * Bounded maintenance primitive. It voids expired drafts and writes append-only
 * evidence, but does not schedule itself and does not send notifications.
 */
export async function expireTrustResponseDrafts(
  db: D1Database,
  now = new Date().toISOString(),
  actor = 'system:draft-expiry',
): Promise<number> {
  const candidates = await db.prepare(
    `SELECT id, case_id, content_hash FROM trust_response_drafts
      WHERE status = 'draft' AND expires_at <= ?
      ORDER BY expires_at ASC
      LIMIT 200`,
  ).bind(now).all<Pick<TrustResponseDraft, 'id' | 'case_id' | 'content_hash'>>();
  let expired = 0;
  for (const draft of candidates.results ?? []) {
    const results = await db.batch([
      db.prepare(
        `UPDATE trust_response_drafts
          SET status = 'void', voided_by = ?, voided_at = ?
          WHERE id = ? AND case_id = ? AND status = 'draft' AND expires_at <= ?`,
      ).bind(actor, now, draft.id, draft.case_id, now),
      db.prepare(
        `INSERT INTO trust_response_draft_events
          (id, draft_id, case_id, event_type, actor, content_hash, note, created_at)
         SELECT ?, ?, ?, 'expired', ?, ?, 'expired_without_delivery', ?
          WHERE EXISTS (SELECT 1 FROM trust_response_drafts
            WHERE id = ? AND case_id = ? AND status = 'void'
              AND voided_by = ? AND voided_at = ?)`,
      ).bind(`draft_event_${crypto.randomUUID()}`, draft.id, draft.case_id,
        actor, draft.content_hash, now, draft.id, draft.case_id, actor, now),
    ]);
    if (Number(results[0]?.meta?.changes ?? 0) === 1) expired += 1;
  }
  return expired;
}

export interface TrustDraftDeliveryProvider {
  name: string;
  deliver(message: {
    idempotencyKey: string;
    to: string;
    subject: string;
    text: string;
  }): Promise<
    | { outcome: 'sent'; providerMessageId: string }
    | { outcome: 'failed_retryable'; errorCode: string }
    | { outcome: 'delivery_unknown'; errorCode: string }
  >;
}

export interface TrustDraftDeliveryAttempt {
  id: string;
  idempotency_key: string;
  draft_id: string;
  case_id: string;
  content_hash: string;
  provider: string;
  status: 'claimed' | 'sent' | 'failed_retryable' | 'delivery_unknown' | 'reconciled_sent' | 'reconciled_not_sent';
  claimed_by: string;
  claimed_at: string;
  provider_message_id: string | null;
  error_code: string | null;
  updated_at: string;
  draft_status?: TrustResponseDraft['status'];
  recipient_email?: string;
  subject?: string;
  body_text?: string;
}

export type TrustDraftDeliveryResult =
  | { outcome: 'sent'; providerMessageId: string }
  | { outcome: 'already_sent'; providerMessageId: string | null }
  | { outcome: 'blocked'; reason: TrustDraftSendFailureReason }
  | { outcome: 'reconciliation_required'; status: 'claimed' | 'failed_retryable' | 'delivery_unknown'; errorCode?: string };

/**
 * Provider-neutral delivery state machine. There is intentionally no route,
 * scheduler, or real-provider adapter. A crash after claiming leaves the
 * attempt blocked for reconciliation instead of risking a duplicate message.
 */
export async function deliverApprovedTrustResponseDraft(
  db: D1Database,
  caseId: string,
  draftId: string,
  actor: string,
  provider: TrustDraftDeliveryProvider,
  now = new Date().toISOString(),
): Promise<TrustDraftDeliveryResult> {
  if (!/^[a-z0-9][a-z0-9_-]{0,49}$/i.test(provider.name)) throw new Error('invalid delivery provider name');
  const prior = await db.prepare(
    `SELECT a.status, a.provider_message_id, a.error_code, d.status AS draft_status
       FROM trust_response_delivery_attempts a
       JOIN trust_response_drafts d ON d.id = a.draft_id
      WHERE d.id = ? AND d.case_id = ?
      ORDER BY a.claimed_at DESC LIMIT 1`,
  ).bind(draftId, caseId).first<{ status: 'claimed' | 'sent' | 'failed_retryable' | 'delivery_unknown'; provider_message_id: string | null; error_code: string | null; draft_status: TrustResponseDraft['status'] }>();
  if (prior?.status === 'sent' && prior.draft_status === 'sent') return { outcome: 'already_sent', providerMessageId: prior.provider_message_id };
  if (prior?.status === 'sent') return { outcome: 'reconciliation_required', status: 'delivery_unknown', errorCode: 'post_delivery_persistence_failed' };
  if (prior) return {
    outcome: 'reconciliation_required', status: prior.status,
    ...(prior.error_code ? { errorCode: prior.error_code } : {}),
  };
  const validation = await validateApprovedTrustResponseDraft(db, caseId, draftId, now);
  if (!validation.ok) return { outcome: 'blocked', reason: validation.reason };
  const draft = validation.draft;
  const idempotencyKey = `trust-draft:${draft.id}:${draft.content_hash}`;
  const attemptId = `delivery_${crypto.randomUUID()}`;
  const claim = await db.prepare(
    `INSERT OR IGNORE INTO trust_response_delivery_attempts
      (id, idempotency_key, draft_id, case_id, content_hash, provider, status,
       claimed_by, claimed_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, 'claimed', ?, ?, ?)`,
  ).bind(attemptId, idempotencyKey, draft.id, caseId, draft.content_hash,
    provider.name, actor, now, now).run();
  if (Number(claim.meta?.changes ?? 0) !== 1) {
    const existing = await db.prepare(
      `SELECT status, provider_message_id, error_code
         FROM trust_response_delivery_attempts WHERE idempotency_key = ?`,
    ).bind(idempotencyKey).first<{ status: 'claimed' | 'sent' | 'failed_retryable' | 'delivery_unknown'; provider_message_id: string | null; error_code: string | null }>();
    if (existing?.status === 'sent') return { outcome: 'already_sent', providerMessageId: existing.provider_message_id };
    return {
      outcome: 'reconciliation_required',
      status: existing?.status ?? 'delivery_unknown',
      ...(existing?.error_code ? { errorCode: existing.error_code } : {}),
    };
  }

  let result: Awaited<ReturnType<TrustDraftDeliveryProvider['deliver']>>;
  try {
    result = await provider.deliver({
      idempotencyKey,
      to: draft.recipient_email,
      subject: draft.subject,
      text: draft.body_text,
    });
  } catch {
    result = { outcome: 'delivery_unknown', errorCode: 'provider_exception' };
  }
  if (result.outcome !== 'sent') {
    const code = result.errorCode.toLowerCase().replace(/[^a-z0-9_.-]+/g, '_').slice(0, 100) || 'provider_error';
    await db.prepare(
      `UPDATE trust_response_delivery_attempts
          SET status = ?, error_code = ?, completed_at = ?, updated_at = ?
        WHERE id = ? AND status = 'claimed'`,
    ).bind(result.outcome, code, now, now, attemptId).run();
    return { outcome: 'reconciliation_required', status: result.outcome, errorCode: code };
  }

  const providerMessageId = result.providerMessageId.trim().slice(0, 500);
  if (!providerMessageId) {
    await db.prepare(
      `UPDATE trust_response_delivery_attempts
          SET status = 'delivery_unknown', error_code = 'missing_provider_message_id',
              completed_at = ?, updated_at = ?
        WHERE id = ? AND status = 'claimed'`,
    ).bind(now, now, attemptId).run();
    return { outcome: 'reconciliation_required', status: 'delivery_unknown', errorCode: 'missing_provider_message_id' };
  }
  const writes = await db.batch([
    db.prepare(
      `UPDATE trust_response_delivery_attempts
          SET status = 'sent', provider_message_id = ?, completed_at = ?, updated_at = ?
        WHERE id = ? AND status = 'claimed'`,
    ).bind(providerMessageId, now, now, attemptId),
    db.prepare(
      `UPDATE trust_response_drafts
          SET status = 'sent', sent_by = ?, sent_at = ?, provider_message_id = ?
        WHERE id = ? AND case_id = ? AND status = 'approved'
          AND approved_content_hash = ? AND content_hash = ? AND expires_at > ?`,
    ).bind(actor, now, providerMessageId, draft.id, caseId,
      draft.content_hash, draft.content_hash, now),
    db.prepare(
      `INSERT INTO trust_response_draft_events
        (id, draft_id, case_id, event_type, actor, content_hash, note, created_at)
       SELECT ?, ?, ?, 'sent', ?, ?, ?, ?
        WHERE EXISTS (SELECT 1 FROM trust_response_drafts
          WHERE id = ? AND case_id = ? AND status = 'sent' AND sent_at = ?)`,
    ).bind(`draft_event_${crypto.randomUUID()}`, draft.id, caseId, actor,
      draft.content_hash, provider.name, now, draft.id, caseId, now),
    db.prepare(
      `UPDATE notification_outbox SET status = 'delivered', delivered_at = ?,
          provider_event_id = ?, updated_at = ?
        WHERE aggregate_type = 'trust_response_draft' AND aggregate_id = ?
          AND event_type = 'trust_draft_approved' AND status IN ('pending', 'leased')`,
    ).bind(now, providerMessageId, now, draft.id),
  ]);
  if (Number(writes[0]?.meta?.changes ?? 0) !== 1 || Number(writes[1]?.meta?.changes ?? 0) !== 1) {
    return { outcome: 'reconciliation_required', status: 'delivery_unknown', errorCode: 'post_delivery_persistence_failed' };
  }
  return { outcome: 'sent', providerMessageId };
}

export async function listTrustDeliveryReconciliationQueue(db: D1Database): Promise<TrustDraftDeliveryAttempt[]> {
  const result = await db.prepare(
    `SELECT a.*, d.status AS draft_status, d.recipient_email, d.subject, d.body_text
       FROM trust_response_delivery_attempts a
       JOIN trust_response_drafts d ON d.id = a.draft_id
      WHERE a.status IN ('claimed', 'failed_retryable', 'delivery_unknown')
         OR (a.status = 'sent' AND d.status <> 'sent')
      ORDER BY a.claimed_at ASC
      LIMIT 200`,
  ).all<TrustDraftDeliveryAttempt>();
  return result.results ?? [];
}

export async function reconcileTrustDraftDelivery(
  db: D1Database,
  caseId: string,
  attemptId: string,
  actor: string,
  outcome: 'confirmed_sent' | 'confirmed_not_sent',
  evidenceReference: string,
  note: string,
  now = new Date().toISOString(),
): Promise<TrustDraftDeliveryAttempt | null> {
  const attempt = await db.prepare(
    `SELECT a.*, d.status AS draft_status
       FROM trust_response_delivery_attempts a
       JOIN trust_response_drafts d ON d.id = a.draft_id
      WHERE a.id = ? AND a.case_id = ?`,
  ).bind(attemptId, caseId).first<TrustDraftDeliveryAttempt>();
  if (!attempt) return null;
  if (!['claimed', 'failed_retryable', 'delivery_unknown', 'sent'].includes(attempt.status)) {
    throw new Error('delivery attempt is not reconcilable');
  }
  if (attempt.status === 'sent' && attempt.draft_status === 'sent') {
    throw new Error('delivery is already consistent');
  }
  const targetAttemptStatus = outcome === 'confirmed_sent' ? 'reconciled_sent' : 'reconciled_not_sent';
  const targetDraftStatus = outcome === 'confirmed_sent' ? 'sent' : 'void';
  const eventType = outcome === 'confirmed_sent' ? 'delivery_reconciled_sent' : 'delivery_reconciled_not_sent';
  const priorStatuses = "'claimed', 'failed_retryable', 'delivery_unknown', 'sent'";
  const writes = await db.batch([
    db.prepare(
      `UPDATE trust_response_delivery_attempts
          SET status = ?, reconciled_by = ?, reconciled_at = ?,
              reconciliation_evidence = ?, reconciliation_note = ?, updated_at = ?
        WHERE id = ? AND case_id = ? AND status IN (${priorStatuses})
          AND EXISTS (SELECT 1 FROM trust_response_drafts
            WHERE id = ? AND case_id = ? AND status = 'approved')`,
    ).bind(targetAttemptStatus, actor, now, evidenceReference, note, now,
      attemptId, caseId, attempt.draft_id, caseId),
    db.prepare(
      `UPDATE trust_response_drafts
          SET status = ?,
              sent_by = CASE WHEN ? = 'sent' THEN ? ELSE sent_by END,
              sent_at = CASE WHEN ? = 'sent' THEN ? ELSE sent_at END,
              provider_message_id = CASE WHEN ? = 'sent' THEN ? ELSE provider_message_id END,
              voided_by = CASE WHEN ? = 'void' THEN ? ELSE voided_by END,
              voided_at = CASE WHEN ? = 'void' THEN ? ELSE voided_at END
        WHERE id = ? AND case_id = ? AND status = 'approved'`,
    ).bind(targetDraftStatus, targetDraftStatus, actor, targetDraftStatus, now,
      targetDraftStatus, evidenceReference, targetDraftStatus, actor, targetDraftStatus, now,
      attempt.draft_id, caseId),
    db.prepare(
      `INSERT INTO trust_response_draft_events
        (id, draft_id, case_id, event_type, actor, content_hash, note, created_at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
        WHERE EXISTS (SELECT 1 FROM trust_response_delivery_attempts
          WHERE id = ? AND case_id = ? AND status = ? AND reconciled_at = ?)`,
    ).bind(`draft_event_${crypto.randomUUID()}`, attempt.draft_id, caseId, eventType,
      actor, attempt.content_hash, evidenceReference, now,
      attemptId, caseId, targetAttemptStatus, now),
  ]);
  if (Number(writes[0]?.meta?.changes ?? 0) !== 1 || Number(writes[1]?.meta?.changes ?? 0) !== 1) {
    throw new Error('delivery reconciliation changed concurrently');
  }
  return await db.prepare(
    `SELECT * FROM trust_response_delivery_attempts WHERE id = ? AND case_id = ?`,
  ).bind(attemptId, caseId).first<TrustDraftDeliveryAttempt>();
}

export async function listActiveTrustCases(db: D1Database): Promise<TrustCase[]> {
  const result = await db.prepare(
    `SELECT * FROM trust_cases
     WHERE status IN ('open', 'in_review')
     ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, submitted_at ASC
     LIMIT 200`,
  ).all<TrustCase>();
  return result.results ?? [];
}

export async function updateTrustCaseStatus(
  db: D1Database,
  id: string,
  status: TrustCaseStatus,
  actor: string,
  notes: string | null,
  resolutionCode: TrustResolutionCode | null,
): Promise<TrustCase | null> {
  const existing = await db.prepare('SELECT * FROM trust_cases WHERE id = ?').bind(id).first<TrustCase>();
  if (!existing) return null;
  const transitions: Record<TrustCaseStatus, TrustCaseStatus[]> = {
    open: ['in_review', 'resolved', 'closed'],
    in_review: ['resolved', 'closed'],
    resolved: ['closed'],
    closed: [],
  };
  if (!transitions[existing.status].includes(status)) throw new Error('invalid case transition');
  const now = new Date().toISOString();
  const terminal = status === 'resolved' || status === 'closed';
  const acknowledging = existing.status === 'open' && status === 'in_review';
  const eventType = status === 'resolved' ? 'resolved' : status === 'closed' ? 'closed' : acknowledging ? 'acknowledged' : 'status_changed';
  const results = await db.batch([
    db.prepare(
    `UPDATE trust_cases SET status = ?, updated_at = ?, resolved_at = ?,
       resolved_by = ?, resolution_code = ?, resolution_notes = ?,
       acknowledged_at = COALESCE(acknowledged_at, ?),
       acknowledged_by = COALESCE(acknowledged_by, ?)
      WHERE id = ? AND status = ?`,
  ).bind(status, now, terminal ? now : existing.resolved_at,
    terminal ? actor : existing.resolved_by,
    terminal ? resolutionCode : existing.resolution_code,
    notes ?? existing.resolution_notes,
    acknowledging ? now : null, acknowledging ? actor : null,
    id, existing.status),
    db.prepare(
      `INSERT INTO trust_case_events
        (id, case_id, event_type, actor, from_status, to_status,
         resolution_code, note, created_at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
        WHERE EXISTS (
          SELECT 1 FROM trust_cases WHERE id = ? AND status = ? AND updated_at = ?
        )`,
    ).bind(`event_${crypto.randomUUID()}`, id, eventType, actor,
      existing.status, status, resolutionCode, notes, now, id, status, now),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) throw new Error('case changed concurrently');
  return await db.prepare('SELECT * FROM trust_cases WHERE id = ?').bind(id).first<TrustCase>();
}

export async function proposeContentSuppression(
  db: D1Database,
  caseId: string,
  reason: SuppressionReason,
  actor: string,
): Promise<ContentSuppression | null> {
  const trustCase = await db.prepare('SELECT * FROM trust_cases WHERE id = ?').bind(caseId).first<TrustCase>();
  if (!trustCase || (!trustCase.camp_slug && !trustCase.target_url)) return null;
  const existing = await db.prepare(
    `SELECT * FROM content_suppressions
      WHERE status IN ('proposed', 'active')
        AND COALESCE(camp_slug, '') = COALESCE(?, '')
        AND COALESCE(target_url, '') = COALESCE(?, '')
      LIMIT 1`,
  ).bind(trustCase.camp_slug, trustCase.target_url).first<ContentSuppression>();
  if (existing) return existing;

  const now = new Date().toISOString();
  const suppression: ContentSuppression = {
    id: `suppression_${crypto.randomUUID()}`, case_id: caseId,
    camp_slug: trustCase.camp_slug, target_url: trustCase.target_url,
    reason_code: reason, status: 'proposed', proposed_by: actor, proposed_at: now,
  };
  await db.batch([
    db.prepare(
      `INSERT INTO content_suppressions
        (id, case_id, camp_slug, target_url, reason_code, status, proposed_by, proposed_at)
       VALUES (?, ?, ?, ?, ?, 'proposed', ?, ?)`,
    ).bind(suppression.id, caseId, suppression.camp_slug, suppression.target_url, reason, actor, now),
    db.prepare(
      `INSERT INTO trust_case_events
        (id, case_id, event_type, actor, from_status, to_status, note, created_at)
       VALUES (?, ?, 'suppression_proposed', ?, ?, ?, ?, ?)`,
    ).bind(`event_${crypto.randomUUID()}`, caseId, actor, trustCase.status, trustCase.status, reason, now),
  ]);
  return suppression;
}
