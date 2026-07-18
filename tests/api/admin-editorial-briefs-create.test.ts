import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ createBrief: vi.fn() }));
import { POST } from '../../src/pages/api/admin/editorial/briefs/create';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const VALID = { opportunity_id: 'opportunity_1', intent_statement: 'Explain age cutoffs by state.', content_type: 'guide' };
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/briefs/create', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) => makeContext({ request: request(body, origin, auth), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/briefs/create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity and same-origin', async () => {
    expect((await POST(ctx(VALID, undefined, false))).status).toBe(401);
    expect((await POST(ctx(VALID, 'https://evil.example'))).status).toBe(403);
    expect(records.createBrief).not.toHaveBeenCalled();
  });

  it('rejects an invalid content_type and a missing intent_statement', async () => {
    expect((await POST(ctx({ ...VALID, content_type: 'blog_post' }))).status).toBe(400);
    expect((await POST(ctx({ ...VALID, intent_statement: 'x' }))).status).toBe(400);
    expect(records.createBrief).not.toHaveBeenCalled();
  });

  it('returns 404 when the lib layer reports the opportunity is missing', async () => {
    (records.createBrief as any).mockRejectedValueOnce(new Error('opportunity not found'));
    expect((await POST(ctx(VALID))).status).toBe(404);
  });

  it('creates a brief with the authenticated actor recorded', async () => {
    (records.createBrief as any).mockResolvedValue({ id: 'brief_1', ...VALID, status: 'draft' });
    const res = await POST(ctx(VALID));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(records.createBrief).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ actor: 'jeffthomas@pugetsound.edu' }));
  });
});
