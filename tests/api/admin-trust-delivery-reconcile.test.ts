import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/trust-cases', () => ({ reconcileTrustDraftDelivery: vi.fn() }));
import { POST } from '../../src/pages/api/admin/trust/[id]/deliveries/[attemptId]/reconcile';
import * as trustCases from '../../src/lib/trust-cases';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown = {
  outcome: 'confirmed_not_sent', evidence_reference: 'provider-event-123',
  note: 'Provider event log confirms that no message was accepted.', confirm_no_retry: true,
}, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/trust/case_1/deliveries/delivery_1/reconcile', {
    method: 'POST', body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json', origin,
      ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}),
    },
  });

describe('POST /api/admin/trust/:id/deliveries/:attemptId/reconcile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (trustCases.reconcileTrustDraftDelivery as any).mockResolvedValue({ id: 'delivery_1', status: 'reconciled_not_sent' });
  });

  it('requires Access identity and same-origin mutation', async () => {
    expect((await POST(makeContext({ request: request({}, undefined, false), params: { id: 'case_1', attemptId: 'delivery_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(401);
    expect((await POST(makeContext({ request: request({}, 'https://evil.example'), params: { id: 'case_1', attemptId: 'delivery_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(403);
    expect(trustCases.reconcileTrustDraftDelivery).not.toHaveBeenCalled();
  });

  it('requires a bounded outcome, evidence, note, and explicit no-retry confirmation', async () => {
    for (const body of [
      { outcome: 'retry', evidence_reference: 'event-123', note: 'A sufficiently long note.', confirm_no_retry: true },
      { outcome: 'confirmed_sent', evidence_reference: 'contains spaces', note: 'A sufficiently long note.', confirm_no_retry: true },
      { outcome: 'confirmed_sent', evidence_reference: 'event-123', note: 'short', confirm_no_retry: true },
      { outcome: 'confirmed_sent', evidence_reference: 'event-123', note: 'A sufficiently long note.', confirm_no_retry: false },
    ]) {
      const res = await POST(makeContext({ request: request(body), params: { id: 'case_1', attemptId: 'delivery_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
      expect(res.status).toBe(400);
    }
    expect(trustCases.reconcileTrustDraftDelivery).not.toHaveBeenCalled();
  });

  it('records evidence-bound reconciliation without retrying', async () => {
    const res = await POST(makeContext({ request: request(), params: { id: 'case_1', attemptId: 'delivery_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.retry).toBe('not performed');
    expect(trustCases.reconcileTrustDraftDelivery).toHaveBeenCalledWith(
      expect.anything(), 'case_1', 'delivery_1', 'jeffthomas@pugetsound.edu',
      'confirmed_not_sent', 'provider-event-123',
      'Provider event log confirms that no message was accepted.',
    );
  });

  it('fails closed on stale or concurrent reconciliation', async () => {
    for (const message of ['delivery attempt is not reconcilable', 'delivery is already consistent', 'delivery reconciliation changed concurrently']) {
      (trustCases.reconcileTrustDraftDelivery as any).mockRejectedValueOnce(new Error(message));
      const res = await POST(makeContext({ request: request(), params: { id: 'case_1', attemptId: 'delivery_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
      expect(res.status).toBe(409);
    }
  });
});
