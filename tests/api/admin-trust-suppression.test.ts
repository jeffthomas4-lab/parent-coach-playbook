import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/trust-cases', () => ({ proposeContentSuppression: vi.fn() }));
import { POST } from '../../src/pages/api/admin/trust/[id]/suppression';
import * as trustCases from '../../src/lib/trust-cases';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) => new Request(
  'https://parentcoachdesk.com/api/admin/trust/case_1/suppression',
  { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': ADMIN_EMAILS } : {}) } },
);

describe('POST /api/admin/trust/:id/suppression', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (trustCases.proposeContentSuppression as any).mockResolvedValue({ id: 'suppression_1', status: 'proposed' });
  });

  it('requires admin identity and same origin', async () => {
    expect((await POST(makeContext({ request: request({}, undefined, false), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(401);
    expect((await POST(makeContext({ request: request({}, 'https://evil.example'), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }))).status).toBe(403);
    expect(trustCases.proposeContentSuppression).not.toHaveBeenCalled();
  });

  it('creates only a proposal with an audit actor', async () => {
    const response = await POST(makeContext({ request: request({ reason_code: 'operator_request' }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(response.status).toBe(200);
    expect(await readJson(response)).toMatchObject({ ok: true, activation: 'separate approval required' });
    expect(trustCases.proposeContentSuppression).toHaveBeenCalledWith(expect.anything(), 'case_1', 'operator_request', ADMIN_EMAILS);
  });

  it('rejects an unrecognized reason', async () => {
    const response = await POST(makeContext({ request: request({ reason_code: 'delete_everything' }), params: { id: 'case_1' }, env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(response.status).toBe(400);
    expect(trustCases.proposeContentSuppression).not.toHaveBeenCalled();
  });
});
