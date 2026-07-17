import { describe, expect, it, vi } from 'vitest';
import { approveTrustResponseDraft, createTrustResponseDraft, deliverApprovedTrustResponseDraft, expireTrustResponseDrafts, insertTrustCase, reconcileTrustDraftDelivery, validateApprovedTrustResponseDraft, type TrustCase } from '../../src/lib/trust-cases';
import { makeFakeD1 } from '../helpers/d1';

const trustCase: TrustCase = {
  id: 'case_1', category: 'listing_correction', target_url: null, camp_slug: 'sample-camp',
  requester_email: 'parent@example.com', requester_name: null,
  description: 'The listed date does not match the current provider page.', desired_resolution: null,
  priority: 'normal', due_at: '2026-07-23T00:00:00.000Z', status: 'open',
  submitted_at: '2026-07-16T00:00:00.000Z', updated_at: '2026-07-16T00:00:00.000Z',
  acknowledged_at: null, acknowledged_by: null, resolved_at: null, resolved_by: null,
  resolution_code: null, resolution_notes: null,
  intake_key: '12345678-1234-1234-1234-123456789abc',
  request_fingerprint: 'a'.repeat(64),
};

describe('trust case durable support records', () => {
  it('creates the case, immutable event, and opaque notification in one batch', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ id: trustCase.id, request_fingerprint: trustCase.request_fingerprint });
    await insertTrustCase(fake.db, trustCase);
    expect(fake.calls).toHaveLength(4);
    expect(fake.calls[0].sql).toContain('ON CONFLICT(intake_key) WHERE intake_key IS NOT NULL DO NOTHING');
    expect(fake.calls[1].sql).toContain('INSERT INTO trust_case_events');
    expect(fake.calls[2].sql).toContain('INSERT INTO notification_outbox');
    const serializedOutbox = JSON.stringify(fake.calls[2]);
    expect(serializedOutbox).not.toContain(trustCase.requester_email);
    expect(serializedOutbox).not.toContain(trustCase.description);
  });

  it('returns a replay for the same payload and rejects key reuse with a different payload', async () => {
    const replay = makeFakeD1();
    replay.queueRun({ meta: { changes: 0 } });
    replay.queueFirst({ id: trustCase.id, request_fingerprint: trustCase.request_fingerprint });
    await expect(insertTrustCase(replay.db, trustCase)).resolves.toEqual({ outcome: 'replayed', id: trustCase.id });

    const conflict = makeFakeD1();
    conflict.queueRun({ meta: { changes: 0 } });
    conflict.queueFirst({ id: trustCase.id, request_fingerprint: 'b'.repeat(64) });
    await expect(insertTrustCase(conflict.db, trustCase)).resolves.toEqual({ outcome: 'conflict' });
  });

  it('creates a new protected draft revision and only an opaque outbox pointer', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    fake.queueFirst({ revision: 2 });
    const draft = await createTrustResponseDraft(
      fake.db, 'case_1', 'jeffthomas@pugetsound.edu',
      'Correction request update', 'We are reviewing the source evidence you provided.',
    );
    expect(draft).toMatchObject({ case_id: 'case_1', revision: 3, status: 'draft' });
    const outbox = fake.calls.find((call) => call.sql.includes('INSERT INTO notification_outbox'));
    expect(outbox).toBeDefined();
    expect(JSON.stringify(outbox)).not.toContain('parent@example.com');
    expect(JSON.stringify(outbox)).not.toContain('We are reviewing');
  });

  it('refuses to draft for a closed case', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'closed' });
    expect(await createTrustResponseDraft(fake.db, 'case_1', 'admin@example.com', 'A subject', 'A sufficiently long response body.')).toBeNull();
    expect(fake.calls.some((call) => call.sql.includes('INSERT INTO trust_response_drafts'))).toBe(false);
  });

  it('binds human approval to the unexpired immutable payload hash', async () => {
    const creation = makeFakeD1();
    creation.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    creation.queueFirst({ revision: 0 });
    const draft = await createTrustResponseDraft(creation.db, 'case_1', 'drafter@example.com', 'A correction update', 'We reviewed the evidence and are preparing the next step.');
    expect(draft).not.toBeNull();

    const approval = makeFakeD1();
    approval.queueFirst(draft);
    approval.queueFirst({ ...draft, status: 'approved', approved_by: 'approver@example.com' });
    const approved = await approveTrustResponseDraft(approval.db, 'case_1', draft!.id, 'approver@example.com', 'Evidence and full payload reviewed.');
    expect(approved).toMatchObject({ status: 'approved', approved_by: 'approver@example.com' });
    const update = approval.calls.find((call) => call.sql.includes('UPDATE trust_response_drafts'));
    expect(update?.sql).toContain("status = 'draft'");
    expect(update?.sql).toContain('expires_at > ?');
    expect(update?.params).toContain(draft!.content_hash);
  });

  it('rejects an expired or modified draft before approval writes', async () => {
    const creation = makeFakeD1();
    creation.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    creation.queueFirst({ revision: 0 });
    const draft = await createTrustResponseDraft(creation.db, 'case_1', 'drafter@example.com', 'A correction update', 'We reviewed the evidence and are preparing the next step.');

    const expired = makeFakeD1();
    expired.queueFirst({ ...draft, expires_at: '2020-01-01T00:00:00.000Z' });
    await expect(approveTrustResponseDraft(expired.db, 'case_1', draft!.id, 'approver@example.com', 'Reviewed evidence.')).rejects.toThrow('draft expired');

    const modified = makeFakeD1();
    modified.queueFirst({ ...draft, body_text: `${draft!.body_text} changed` });
    await expect(approveTrustResponseDraft(modified.db, 'case_1', draft!.id, 'approver@example.com', 'Reviewed evidence.')).rejects.toThrow('draft payload hash mismatch');
  });

  it('revalidates approval, case state, expiry, and payload hash immediately before send', async () => {
    const creation = makeFakeD1();
    creation.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    creation.queueFirst({ revision: 0 });
    const draft = await createTrustResponseDraft(creation.db, 'case_1', 'drafter@example.com', 'A correction update', 'We reviewed the evidence and are preparing the next step.');
    const approved = { ...draft!, status: 'approved' as const, case_status: 'in_review', approved_content_hash: draft!.content_hash };

    const valid = makeFakeD1();
    valid.queueFirst(approved);
    expect(await validateApprovedTrustResponseDraft(valid.db, 'case_1', draft!.id, draft!.created_at)).toMatchObject({ ok: true });

    for (const [change, reason] of [
      [{ status: 'draft' }, 'not_approved'],
      [{ expires_at: '2020-01-01T00:00:00.000Z' }, 'expired'],
      [{ case_status: 'closed' }, 'case_inactive'],
      [{ approved_content_hash: null }, 'approval_hash_missing'],
      [{ body_text: `${draft!.body_text} altered` }, 'payload_hash_mismatch'],
    ] as const) {
      const fake = makeFakeD1();
      fake.queueFirst({ ...approved, ...change });
      expect(await validateApprovedTrustResponseDraft(fake.db, 'case_1', draft!.id, draft!.created_at)).toEqual({ ok: false, reason });
    }
  });

  it('voids only bounded expired drafts and appends expiry evidence', async () => {
    const fake = makeFakeD1();
    fake.queueAll([
      { id: 'draft_1', case_id: 'case_1', content_hash: 'a'.repeat(64) },
      { id: 'draft_2', case_id: 'case_2', content_hash: 'b'.repeat(64) },
    ]);
    fake.queueRun({ meta: { changes: 1 } });
    fake.queueRun({ meta: { changes: 1 } });
    fake.queueRun({ meta: { changes: 0 } });
    fake.queueRun({ meta: { changes: 0 } });
    expect(await expireTrustResponseDrafts(fake.db, '2026-07-23T00:00:00.000Z')).toBe(1);
    expect(fake.calls[0].sql).toContain("status = 'draft' AND expires_at <= ?");
    expect(fake.calls.filter((call) => call.sql.includes("'expired'"))).toHaveLength(2);
    expect(fake.calls.every((call) => !JSON.stringify(call).includes('parent@example.com'))).toBe(true);
  });

  it('claims one immutable payload before provider delivery and persists success evidence', async () => {
    const creation = makeFakeD1();
    creation.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    creation.queueFirst({ revision: 0 });
    const draft = await createTrustResponseDraft(creation.db, 'case_1', 'drafter@example.com', 'A correction update', 'We reviewed the evidence and are preparing the next step.');
    const approved = { ...draft!, status: 'approved' as const, case_status: 'in_review', approved_content_hash: draft!.content_hash };
    const fake = makeFakeD1();
    fake.queueFirst(null);
    fake.queueFirst(approved);
    const deliver = vi.fn().mockResolvedValue({ outcome: 'sent', providerMessageId: 'provider_123' });
    const result = await deliverApprovedTrustResponseDraft(fake.db, 'case_1', draft!.id, 'sender@example.com', { name: 'fake', deliver }, draft!.created_at);
    expect(result).toEqual({ outcome: 'sent', providerMessageId: 'provider_123' });
    expect(deliver).toHaveBeenCalledWith(expect.objectContaining({
      idempotencyKey: `trust-draft:${draft!.id}:${draft!.content_hash}`,
      to: 'parent@example.com',
    }));
    expect(fake.calls.some((call) => call.sql.includes('INSERT OR IGNORE INTO trust_response_delivery_attempts'))).toBe(true);
    expect(fake.calls.some((call) => call.sql.includes("status = 'sent'"))).toBe(true);
  });

  it('never calls the provider again for sent, claimed, failed, or ambiguous attempts', async () => {
    for (const prior of [
      { status: 'sent', provider_message_id: 'provider_123', error_code: null, draft_status: 'sent' },
      { status: 'claimed', provider_message_id: null, error_code: null, draft_status: 'approved' },
      { status: 'failed_retryable', provider_message_id: null, error_code: 'rejected', draft_status: 'approved' },
      { status: 'delivery_unknown', provider_message_id: null, error_code: 'timeout', draft_status: 'approved' },
    ] as const) {
      const fake = makeFakeD1();
      fake.queueFirst(prior);
      const deliver = vi.fn();
      const result = await deliverApprovedTrustResponseDraft(fake.db, 'case_1', 'draft_1', 'sender@example.com', { name: 'fake', deliver });
      expect(deliver).not.toHaveBeenCalled();
      expect(result.outcome).toBe(prior.status === 'sent' ? 'already_sent' : 'reconciliation_required');
    }
  });

  it('surfaces provider/draft persistence mismatch and missing provider ids for reconciliation', async () => {
    const mismatch = makeFakeD1();
    mismatch.queueFirst({ status: 'sent', provider_message_id: 'provider_123', error_code: null, draft_status: 'approved' });
    expect(await deliverApprovedTrustResponseDraft(mismatch.db, 'case_1', 'draft_1', 'sender@example.com', { name: 'fake', deliver: vi.fn() })).toEqual({
      outcome: 'reconciliation_required', status: 'delivery_unknown', errorCode: 'post_delivery_persistence_failed',
    });

    const creation = makeFakeD1();
    creation.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    creation.queueFirst({ revision: 0 });
    const draft = await createTrustResponseDraft(creation.db, 'case_1', 'drafter@example.com', 'A correction update', 'We reviewed the evidence and are preparing the next step.');
    const missingId = makeFakeD1();
    missingId.queueFirst(null);
    missingId.queueFirst({ ...draft!, status: 'approved', case_status: 'in_review', approved_content_hash: draft!.content_hash });
    expect(await deliverApprovedTrustResponseDraft(missingId.db, 'case_1', draft!.id, 'sender@example.com', {
      name: 'fake', deliver: vi.fn().mockResolvedValue({ outcome: 'sent', providerMessageId: '   ' }),
    }, draft!.created_at)).toEqual({ outcome: 'reconciliation_required', status: 'delivery_unknown', errorCode: 'missing_provider_message_id' });
  });

  it('turns provider exceptions into ambiguous delivery requiring reconciliation', async () => {
    const creation = makeFakeD1();
    creation.queueFirst({ id: 'case_1', requester_email: 'parent@example.com', status: 'open' });
    creation.queueFirst({ revision: 0 });
    const draft = await createTrustResponseDraft(creation.db, 'case_1', 'drafter@example.com', 'A correction update', 'We reviewed the evidence and are preparing the next step.');
    const fake = makeFakeD1();
    fake.queueFirst(null);
    fake.queueFirst({ ...draft!, status: 'approved', case_status: 'in_review', approved_content_hash: draft!.content_hash });
    const result = await deliverApprovedTrustResponseDraft(fake.db, 'case_1', draft!.id, 'sender@example.com', {
      name: 'fake', deliver: async () => { throw new Error('timeout after acceptance'); },
    }, draft!.created_at);
    expect(result).toEqual({ outcome: 'reconciliation_required', status: 'delivery_unknown', errorCode: 'provider_exception' });
  });

  it('reconciles confirmed-not-sent by voiding the draft without retry', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({
      id: 'delivery_1', case_id: 'case_1', draft_id: 'draft_1', content_hash: 'a'.repeat(64),
      status: 'delivery_unknown', draft_status: 'approved',
    });
    fake.queueFirst({ id: 'delivery_1', status: 'reconciled_not_sent' });
    const result = await reconcileTrustDraftDelivery(
      fake.db, 'case_1', 'delivery_1', 'admin@example.com', 'confirmed_not_sent',
      'provider-event-123', 'Provider confirms no message was accepted.', '2026-07-16T12:00:00.000Z',
    );
    expect(result).toMatchObject({ status: 'reconciled_not_sent' });
    const draftUpdate = fake.calls.find((call) => call.sql.includes('UPDATE trust_response_drafts'));
    expect(draftUpdate?.params[0]).toBe('void');
    expect(fake.calls.some((call) => call.params.includes('delivery_reconciled_not_sent'))).toBe(true);
    expect(fake.calls.some((call) => /deliver\s*\(/i.test(call.sql))).toBe(false);
  });

  it('reconciles confirmed-sent by recording the provider evidence once', async () => {
    const fake = makeFakeD1();
    fake.queueFirst({
      id: 'delivery_1', case_id: 'case_1', draft_id: 'draft_1', content_hash: 'a'.repeat(64),
      status: 'sent', draft_status: 'approved',
    });
    fake.queueFirst({ id: 'delivery_1', status: 'reconciled_sent' });
    const result = await reconcileTrustDraftDelivery(
      fake.db, 'case_1', 'delivery_1', 'admin@example.com', 'confirmed_sent',
      'provider-message-123', 'Provider confirms the message was accepted.', '2026-07-16T12:00:00.000Z',
    );
    expect(result).toMatchObject({ status: 'reconciled_sent' });
    const draftUpdate = fake.calls.find((call) => call.sql.includes('UPDATE trust_response_drafts'));
    expect(draftUpdate?.params[0]).toBe('sent');
    expect(draftUpdate?.params).toContain('provider-message-123');
  });
});
