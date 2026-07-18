import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', async () => {
  const actual = await vi.importActual<typeof import('../../src/lib/editorial-records')>('../../src/lib/editorial-records');
  return { ...actual, classifyMonetization: vi.fn(), recordHumanApproval: vi.fn() };
});
import { POST } from '../../src/pages/api/admin/editorial/approvals/update';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/approvals/update', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) => makeContext({ request: request(body, origin, auth), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/approvals/update', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity and same-origin', async () => {
    const body = { opportunity_id: 'opportunity_1', action: 'classify_monetization', monetization_classification: 'none' };
    expect((await POST(ctx(body, undefined, false))).status).toBe(401);
    expect((await POST(ctx(body, 'https://evil.example'))).status).toBe(403);
    expect(records.classifyMonetization).not.toHaveBeenCalled();
  });

  it('rejects an invalid monetization_classification', async () => {
    const res = await POST(ctx({ opportunity_id: 'opportunity_1', action: 'classify_monetization', monetization_classification: 'crypto' }));
    expect(res.status).toBe(400);
  });

  it('classifies monetization with the authenticated actor recorded', async () => {
    (records.classifyMonetization as any).mockResolvedValue({ id: 'approval_1', monetization_classification: 'affiliate', disclosure_required: 1 });
    const res = await POST(ctx({ opportunity_id: 'opportunity_1', action: 'classify_monetization', monetization_classification: 'affiliate', disclosure_required: true }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(records.classifyMonetization).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ actor: 'jeffthomas@pugetsound.edu' }));
  });

  it('refuses to approve without an explicit flags_resolved confirmation', async () => {
    const res = await POST(ctx({ opportunity_id: 'opportunity_1', action: 'approve' }));
    expect(res.status).toBe(400);
    expect(records.recordHumanApproval).not.toHaveBeenCalled();
  });

  it('always signs the approval with the authenticated identity, never a client-supplied approver', async () => {
    (records.recordHumanApproval as any).mockResolvedValue({ opportunity: { id: 'opportunity_1', status: 'approved' }, approval: { approved_by: 'jeffthomas@pugetsound.edu' } });
    const res = await POST(ctx({ opportunity_id: 'opportunity_1', action: 'approve', flags_resolved: true, approved_by: 'someone-else@example.com' }));
    expect(res.status).toBe(200);
    expect(records.recordHumanApproval).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ approvedBy: 'jeffthomas@pugetsound.edu', actor: 'jeffthomas@pugetsound.edu' }));
  });

  it('surfaces a missing-evidence rejection with the specific missing gates, not a generic 500', async () => {
    (records.recordHumanApproval as any).mockRejectedValueOnce(new records.EvidenceGateError(['at least one reviewed source', 'internal relationship mapping']));
    const res = await POST(ctx({ opportunity_id: 'opportunity_1', action: 'approve', flags_resolved: true }));
    const body = await readJson(res);
    expect(res.status).toBe(409);
    expect(body.missing).toEqual(['at least one reviewed source', 'internal relationship mapping']);
  });
});
