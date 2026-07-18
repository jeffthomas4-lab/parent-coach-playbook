import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ createOpportunity: vi.fn() }));
import { POST } from '../../src/pages/api/admin/editorial/opportunities/create';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/opportunities/create', {
    method: 'POST', body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json', origin,
      ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}),
    },
  });

describe('POST /api/admin/editorial/opportunities/create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (records.createOpportunity as any).mockResolvedValue({ id: 'opportunity_1', status: 'opportunity_discovered' });
  });

  it('defaults closed: is unavailable when EDITORIAL_LIFECYCLE_ENABLED is unset', async () => {
    const res = await POST(makeContext({ request: request({ source: 'gsc', summary: 'x' }), env: { PCD_OPS_DB: {}, ADMIN_EMAILS } }));
    expect(res.status).toBe(404);
    expect(records.createOpportunity).not.toHaveBeenCalled();
  });

  it('requires Cloudflare Access identity', async () => {
    const res = await POST(makeContext({ request: request({ source: 'gsc', summary: 'x' }, undefined, false), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(401);
    expect(records.createOpportunity).not.toHaveBeenCalled();
  });

  it('requires same-origin mutation', async () => {
    const res = await POST(makeContext({ request: request({ source: 'gsc', summary: 'x' }, 'https://evil.example'), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(403);
    expect(records.createOpportunity).not.toHaveBeenCalled();
  });

  it('rejects an unrecognized opportunity source', async () => {
    const res = await POST(makeContext({ request: request({ source: 'made_up', summary: 'x' }), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(400);
    expect(records.createOpportunity).not.toHaveBeenCalled();
  });

  it('rejects a summary that sanitizes to nothing', async () => {
    const res = await POST(makeContext({ request: request({ source: 'gsc', summary: '   ' }), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } }));
    expect(res.status).toBe(400);
    expect(records.createOpportunity).not.toHaveBeenCalled();
  });

  it('sanitizes the signal before it reaches the record layer, then creates it', async () => {
    const res = await POST(makeContext({
      request: request({ source: 'no_result', summary: 'Contact jane@example.com about "flag football" -- 12 searches.' }),
      env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' },
    }));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    const call = (records.createOpportunity as any).mock.calls[0][1];
    expect(call.signalSummary).not.toContain('example.com');
    expect(call.actor).toBe('jeffthomas@pugetsound.edu');
  });
});
