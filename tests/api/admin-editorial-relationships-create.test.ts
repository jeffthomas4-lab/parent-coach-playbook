import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ mapRelationship: vi.fn() }));
import { POST } from '../../src/pages/api/admin/editorial/relationships/create';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const VALID = { opportunity_id: 'opportunity_1', related_route: '/camps/', relationship_type: 'hub_child' };
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/relationships/create', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) => makeContext({ request: request(body, origin, auth), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/relationships/create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity and same-origin', async () => {
    expect((await POST(ctx(VALID, undefined, false))).status).toBe(401);
    expect((await POST(ctx(VALID, 'https://evil.example'))).status).toBe(403);
    expect(records.mapRelationship).not.toHaveBeenCalled();
  });

  it('rejects a related_route that is not a site-relative path', async () => {
    const res = await POST(ctx({ ...VALID, related_route: 'https://external.example/camps/' }));
    expect(res.status).toBe(400);
    expect(records.mapRelationship).not.toHaveBeenCalled();
  });

  it('rejects an invalid relationship_type', async () => {
    const res = await POST(ctx({ ...VALID, relationship_type: 'friendship' }));
    expect(res.status).toBe(400);
  });

  it('maps a relationship with the authenticated actor recorded', async () => {
    (records.mapRelationship as any).mockResolvedValue({ id: 'relationship_1', ...VALID });
    const res = await POST(ctx(VALID));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(records.mapRelationship).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ actor: 'jeffthomas@pugetsound.edu' }));
  });
});
