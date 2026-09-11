import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/contact-review', () => ({ reviewOrgContact: vi.fn() }));

import { POST } from '../../src/pages/api/admin/contacts/review';
import { reviewOrgContact } from '../../src/lib/contact-review';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const VALID_BODY = {
  id: 'contact-1',
  expected_updated_at: '2026-09-10T12:00:00.000Z',
  expected_content_hash: 'a'.repeat(64),
  decision: 'approve_professional',
};

function request(body: unknown = VALID_BODY, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/contacts/review', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function context(req: Request, extraEnv: Record<string, unknown> = {}) {
  return makeContext({ request: req, env: { DB: {}, PCD_OPS_DB: {}, ADMIN_EMAILS, SITE_URL: 'production', ...extraEnv } });
}

describe('POST /api/admin/contacts/review', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(reviewOrgContact).mockResolvedValue({
      ok: true,
      id: 'contact-1',
      decision: 'approve_professional',
      isPublic: true,
      contactContext: 'professional',
    });
  });

  it('requires a signature-verified admin identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/contacts/review', {
      method: 'POST', headers: { origin: 'https://parentcoachdesk.com', 'content-type': 'application/json' }, body: JSON.stringify(VALID_BODY),
    });
    const res = await POST(context(req));
    expect(res.status).toBe(401);
    expect(reviewOrgContact).not.toHaveBeenCalled();
  });

  it('rejects cross-origin writes before reading the body', async () => {
    const res = await POST(context(request(VALID_BODY, { origin: 'https://evil.example' })));
    expect(res.status).toBe(403);
    expect(reviewOrgContact).not.toHaveBeenCalled();
  });

  it('fails closed when either required database binding is absent', async () => {
    const res = await POST(makeContext({ request: request(), env: { DB: {}, ADMIN_EMAILS } }));
    expect(res.status).toBe(503);
    expect(reviewOrgContact).not.toHaveBeenCalled();
  });

  it.each([
    [null],
    [[]],
    [{ ...VALID_BODY, id: '' }],
    [{ ...VALID_BODY, expected_updated_at: '' }],
    [{ ...VALID_BODY, expected_content_hash: 'nope' }],
    [{ ...VALID_BODY, decision: 'approve_all' }],
    [{ ...VALID_BODY, decision: 'classify_private' }],
    [{ ...VALID_BODY, decision: 'classify_private', private_context: 'professional' }],
  ])('rejects invalid input without calling the mutation helper', async (body) => {
    const res = await POST(context(request(body)));
    expect(res.status).toBe(400);
    expect(reviewOrgContact).not.toHaveBeenCalled();
  });

  it('applies exactly one version-pinned review and returns no raw contact fields', async () => {
    const res = await POST(context(request()));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      id: 'contact-1',
      decision: 'approve_professional',
      is_public: true,
      contact_context: 'professional',
    });
    expect(reviewOrgContact).toHaveBeenCalledWith(expect.objectContaining({ DB: {}, PCD_OPS_DB: {} }), expect.objectContaining({
      id: 'contact-1',
      expectedUpdatedAt: VALID_BODY.expected_updated_at,
      expectedContentHash: VALID_BODY.expected_content_hash,
      decision: 'approve_professional',
      actorEmail: 'jeffthomas@pugetsound.edu',
    }));
  });

  it.each([
    ['not_found', 404],
    ['state_changed', 409],
    ['not_eligible', 422],
  ] as const)('maps %s to a fail-closed response', async (code, status) => {
    vi.mocked(reviewOrgContact).mockResolvedValue({ ok: false, code, reason: code });
    const res = await POST(context(request()));
    const body = await readJson(res);
    expect(res.status).toBe(status);
    expect(body.ok).toBe(false);
    expect(body.code).toBe(code);
  });
});
