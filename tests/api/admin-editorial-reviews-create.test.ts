import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/editorial-records', () => ({ recordReview: vi.fn() }));
import { POST } from '../../src/pages/api/admin/editorial/reviews/create';
import * as records from '../../src/lib/editorial-records';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const VALID = { opportunity_id: 'opportunity_1', review_type: 'editorial', outcome: 'pass' };
const request = (body: unknown, origin = 'https://parentcoachdesk.com', auth = true) =>
  new Request('https://parentcoachdesk.com/api/admin/editorial/reviews/create', {
    method: 'POST', body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', origin, ...(auth ? { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' } : {}) },
  });
const ctx = (body: unknown, origin?: string, auth?: boolean) => makeContext({ request: request(body, origin, auth), env: { PCD_OPS_DB: {}, ADMIN_EMAILS, EDITORIAL_LIFECYCLE_ENABLED: 'true' } });

describe('POST /api/admin/editorial/reviews/create', () => {
  beforeEach(() => vi.clearAllMocks());

  it('requires Cloudflare Access identity and same-origin', async () => {
    expect((await POST(ctx(VALID, undefined, false))).status).toBe(401);
    expect((await POST(ctx(VALID, 'https://evil.example'))).status).toBe(403);
    expect(records.recordReview).not.toHaveBeenCalled();
  });

  it('rejects an invalid review_type or outcome', async () => {
    expect((await POST(ctx({ ...VALID, review_type: 'legal' }))).status).toBe(400);
    expect((await POST(ctx({ ...VALID, outcome: 'maybe' }))).status).toBe(400);
    expect(records.recordReview).not.toHaveBeenCalled();
  });

  it('records the reviewer as the authenticated actor, never a client-supplied identity', async () => {
    (records.recordReview as any).mockResolvedValue({ id: 'review_1', ...VALID });
    const res = await POST(ctx({ ...VALID, reviewer: 'someone-else@example.com' }));
    const body = await readJson(res);
    expect(res.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(records.recordReview).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ reviewer: 'jeffthomas@pugetsound.edu', actor: 'jeffthomas@pugetsound.edu' }));
  });

  it('surfaces a state-mismatch error from the lib layer as 409', async () => {
    (records.recordReview as any).mockRejectedValueOnce(new Error('opportunity must be in editorial_review to record a editorial review'));
    const res = await POST(ctx(VALID));
    expect(res.status).toBe(409);
  });
});
