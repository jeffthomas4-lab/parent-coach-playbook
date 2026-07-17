import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/trust-cases', () => ({ updateTrustCaseStatus: vi.fn() }));
import { POST } from '../../src/pages/api/admin/trust/[id]/update';
import * as trustCases from '../../src/lib/trust-cases';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown = { status: 'in_review', notes: 'Reviewing sources.' }, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/trust/case_1/update', {
    method: 'POST', body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json', origin,
      ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}),
    },
  });

describe('POST /api/admin/trust/:id/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (trustCases.updateTrustCaseStatus as any).mockResolvedValue({ id: 'case_1', status: 'in_review' });
  });

  it('requires Cloudflare Access identity', async () => {
    const res = await POST(makeContext({ request: request({}, undefined, false), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(res.status).toBe(401);
    expect(trustCases.updateTrustCaseStatus).not.toHaveBeenCalled();
  });

  it('requires same-origin mutation', async () => {
    const res = await POST(makeContext({ request: request({}, 'https://evil.example'), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(res.status).toBe(403);
    expect(trustCases.updateTrustCaseStatus).not.toHaveBeenCalled();
  });

  it('updates an allowed status with an audit actor', async () => {
    const res = await POST(makeContext({ request: request(), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(trustCases.updateTrustCaseStatus).toHaveBeenCalledWith(expect.anything(), 'case_1', 'in_review', 'jeffthomas@pugetsound.edu', 'Reviewing sources.', null);
  });

  it('requires a resolution code and meaningful notes for terminal states', async () => {
    const missing = await POST(makeContext({ request: request({ status: 'resolved', notes: 'done' }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(missing.status).toBe(400);
    expect(trustCases.updateTrustCaseStatus).not.toHaveBeenCalled();

    const valid = await POST(makeContext({ request: request({ status: 'resolved', notes: 'Corrected the source-backed dates.', resolution_code: 'corrected' }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(valid.status).toBe(200);
    expect(trustCases.updateTrustCaseStatus).toHaveBeenCalledWith(expect.anything(), 'case_1', 'resolved', 'jeffthomas@pugetsound.edu', 'Corrected the source-backed dates.', 'corrected');
  });

  it('rejects invalid status transitions', async () => {
    const res = await POST(makeContext({ request: request({ status: 'deleted' }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(res.status).toBe(400);
    expect(trustCases.updateTrustCaseStatus).not.toHaveBeenCalled();
  });
});
