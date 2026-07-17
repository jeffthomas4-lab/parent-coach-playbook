import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/trust-cases', () => ({ approveTrustResponseDraft: vi.fn() }));
import { POST } from '../../src/pages/api/admin/trust/[id]/drafts/[draftId]/approve';
import * as trustCases from '../../src/lib/trust-cases';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown = { note: 'Reviewed against the current case evidence.', confirm_payload: true }, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/trust/case_1/drafts/draft_1/approve', {
    method: 'POST', body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json', origin,
      ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}),
    },
  });

describe('POST /api/admin/trust/:id/drafts/:draftId/approve', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (trustCases.approveTrustResponseDraft as any).mockResolvedValue({ id: 'draft_1', status: 'approved' });
  });

  it('requires Access identity and same-origin mutation', async () => {
    expect((await POST(makeContext({ request: request({}, undefined, false), params: { id: 'case_1', draftId: 'draft_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(401);
    expect((await POST(makeContext({ request: request({}, 'https://evil.example'), params: { id: 'case_1', draftId: 'draft_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(403);
    expect(trustCases.approveTrustResponseDraft).not.toHaveBeenCalled();
  });

  it('requires explicit payload confirmation and a meaningful note', async () => {
    expect((await POST(makeContext({ request: request({ note: 'Long enough note', confirm_payload: false }), params: { id: 'case_1', draftId: 'draft_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(400);
    expect((await POST(makeContext({ request: request({ note: 'short', confirm_payload: true }), params: { id: 'case_1', draftId: 'draft_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(400);
    expect(trustCases.approveTrustResponseDraft).not.toHaveBeenCalled();
  });

  it('records human approval but explicitly does not send', async () => {
    const res = await POST(makeContext({ request: request(), params: { id: 'case_1', draftId: 'draft_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.delivery).toContain('not authorized');
    expect(trustCases.approveTrustResponseDraft).toHaveBeenCalledWith(expect.anything(), 'case_1', 'draft_1', 'jeffthomas@pugetsound.edu', 'Reviewed against the current case evidence.');
  });

  it('fails closed on expiry, tampering, stale state, or concurrency', async () => {
    for (const message of ['draft expired', 'draft payload hash mismatch', 'draft is not pending', 'draft changed concurrently']) {
      (trustCases.approveTrustResponseDraft as any).mockRejectedValueOnce(new Error(message));
      const res = await POST(makeContext({ request: request(), params: { id: 'case_1', draftId: 'draft_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
      expect(res.status).toBe(409);
      expect((await readJson(res)).error).toBe(message);
    }
  });
});
