import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ addSource: vi.fn() }));
import { POST } from '../../src/pages/api/admin/editorial/sources/create';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const VALID = { entity_type: 'brief', entity_id: 'brief_1', source_type: 'governing_body', source_url: 'https://www.usafootball.com/rules', source_quality: 90, claim_scope: 'Age rules.', verified_at: '2026-07-18T00:00:00Z' };
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/sources/create', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) => makeContext({ request: request(body, origin, auth), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/sources/create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity and same-origin', async () => {
    expect((await POST(ctx(VALID, undefined, false))).status).toBe(401);
    expect((await POST(ctx(VALID, 'https://evil.example'))).status).toBe(403);
    expect(records.addSource).not.toHaveBeenCalled();
  });

  it('rejects a non-https source_url', async () => {
    const res = await POST(ctx({ ...VALID, source_url: 'http://insecure.example' }));
    expect(res.status).toBe(400);
    expect(records.addSource).not.toHaveBeenCalled();
  });

  it('rejects an out-of-range source_quality', async () => {
    const res = await POST(ctx({ ...VALID, source_quality: 150 }));
    expect(res.status).toBe(400);
  });

  it('creates a source with the authenticated actor recorded', async () => {
    (records.addSource as any).mockResolvedValue({ id: 'source_1', ...VALID });
    const res = await POST(ctx(VALID));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(records.addSource).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ actor: 'jeffthomas@pugetsound.edu' }));
  });
});
