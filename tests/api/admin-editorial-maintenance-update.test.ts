import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ proposeMaintenance: vi.fn(), decideMaintenanceProposal: vi.fn() }));
import { POST } from '../../src/pages/api/admin/editorial/maintenance/update';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/maintenance/update', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) => makeContext({ request: request(body, origin, auth), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/maintenance/update', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity and same-origin', async () => {
    const body = { action: 'propose', opportunity_id: 'opportunity_1', proposal_type: 'refresh', reason: 'Rule change reported.' };
    expect((await POST(ctx(body, undefined, false))).status).toBe(401);
    expect((await POST(ctx(body, 'https://evil.example'))).status).toBe(403);
    expect(records.proposeMaintenance).not.toHaveBeenCalled();
  });

  it('rejects an invalid proposal_type and a missing reason', async () => {
    expect((await POST(ctx({ action: 'propose', opportunity_id: 'opportunity_1', proposal_type: 'delete', reason: 'x'.repeat(10) }))).status).toBe(400);
    expect((await POST(ctx({ action: 'propose', opportunity_id: 'opportunity_1', proposal_type: 'refresh', reason: 'hi' }))).status).toBe(400);
    expect(records.proposeMaintenance).not.toHaveBeenCalled();
  });

  it('proposes maintenance with the authenticated actor recorded', async () => {
    (records.proposeMaintenance as any).mockResolvedValue({ id: 'maintenance_1', proposal_type: 'refresh', decision: null });
    const res = await POST(ctx({ action: 'propose', opportunity_id: 'opportunity_1', proposal_type: 'refresh', reason: 'Rule change reported by parents.' }));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(records.proposeMaintenance).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ actor: 'jeffthomas@pugetsound.edu' }));
  });

  it('requires a valid decision value and always records the authenticated admin as the decider', async () => {
    const bad = await POST(ctx({ action: 'decide', proposal_id: 'maintenance_1', decision: 'maybe' }));
    expect(bad.status).toBe(400);
    expect(records.decideMaintenanceProposal).not.toHaveBeenCalled();

    (records.decideMaintenanceProposal as any).mockResolvedValue({ id: 'maintenance_1', decision: 'accepted' });
    const res = await POST(ctx({ action: 'decide', proposal_id: 'maintenance_1', decision: 'accepted', decided_by: 'someone-else@example.com' }));
    expect(res.status).toBe(200);
    expect(records.decideMaintenanceProposal).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ decidedBy: 'jeffthomas@pugetsound.edu', actor: 'jeffthomas@pugetsound.edu' }));
  });
});
