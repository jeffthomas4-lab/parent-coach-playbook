import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/trust-cases', () => ({ createTrustResponseDraft: vi.fn() }));
import { POST } from '../../src/pages/api/admin/trust/[id]/draft';
import * as trustCases from '../../src/lib/trust-cases';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown = { subject: 'Correction request update', body_text: 'We are reviewing the source evidence you provided.' }, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/trust/case_1/draft', {
    method: 'POST', body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json', origin,
      ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}),
    },
  });

describe('POST /api/admin/trust/:id/draft', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (trustCases.createTrustResponseDraft as any).mockResolvedValue({ id: 'draft_1', case_id: 'case_1', status: 'draft' });
  });

  it('requires Access identity and same-origin mutation', async () => {
    const unauthenticated = await POST(makeContext({ request: request({}, undefined, false), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(unauthenticated.status).toBe(401);
    const crossOrigin = await POST(makeContext({ request: request({}, 'https://evil.example'), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(crossOrigin.status).toBe(403);
    expect(trustCases.createTrustResponseDraft).not.toHaveBeenCalled();
  });

  it('stores a bounded protected draft without sending it', async () => {
    const res = await POST(makeContext({ request: request(), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.delivery).toContain('not authorized');
    expect(trustCases.createTrustResponseDraft).toHaveBeenCalledWith(
      expect.anything(), 'case_1', 'jeffthomas@pugetsound.edu',
      'Correction request update', 'We are reviewing the source evidence you provided.',
    );
  });

  it('rejects missing and oversized content', async () => {
    expect((await POST(makeContext({ request: request({ subject: 'x', body_text: 'short' }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(400);
    expect((await POST(makeContext({ request: request({ subject: 'Valid subject', body_text: 'x'.repeat(10_001) }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(400);
    expect(trustCases.createTrustResponseDraft).not.toHaveBeenCalled();
  });

  it('does not draft for a missing or closed case', async () => {
    (trustCases.createTrustResponseDraft as any).mockResolvedValue(null);
    const res = await POST(makeContext({ request: request(), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(res.status).toBe(404);
  });
});
