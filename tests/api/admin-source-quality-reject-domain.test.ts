// Tests for POST /api/admin/source-quality/reject-domain — the bulk
// destructive "reject all pending from this domain" action. Covers the
// affected count, auth, and the server-side confirm gate (the UI arms then
// confirms; the server refuses an unconfirmed request regardless of the UI).

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

vi.mock('../../src/lib/domain-skip-list', () => ({
  bulkRejectPendingByDomain: vi.fn(),
}));

import { POST } from '../../src/pages/api/admin/source-quality/reject-domain';
import * as domainSkipList from '../../src/lib/domain-skip-list';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';

function adminRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/source-quality/reject-domain', {
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

describe('POST /api/admin/source-quality/reject-domain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (domainSkipList.bulkRejectPendingByDomain as any).mockResolvedValue(7);
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/source-quality/reject-domain', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ domain: 'bad.example.com', confirm: true }),
    });
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
    expect(domainSkipList.bulkRejectPendingByDomain).not.toHaveBeenCalled();
  });

  it('happy path: a confirmed bulk reject returns the affected count', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'bad.example.com', confirm: true }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.rejected_count).toBe(7);
    expect(domainSkipList.bulkRejectPendingByDomain).toHaveBeenCalledWith(
      expect.anything(),
      'bad.example.com',
      'jeffthomas@pugetsound.edu',
      'other',
      expect.stringContaining('bad.example.com'),
    );
  });

  it('failure path: confirm gate — an unconfirmed request is refused server-side, no rows touched', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'bad.example.com' }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(domainSkipList.bulkRejectPendingByDomain).not.toHaveBeenCalled();
  });

  it('failure path: confirm: false is refused the same as a missing confirm', async () => {
    const ctx = makeContext({
      request: adminRequest({ domain: 'bad.example.com', confirm: false }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(domainSkipList.bulkRejectPendingByDomain).not.toHaveBeenCalled();
  });

  it('failure path: a missing domain is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ confirm: true }),
      env: { DB: {}, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
    expect(domainSkipList.bulkRejectPendingByDomain).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ domain: 'bad.example.com', confirm: true }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, env: { DB: {}, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
    expect(domainSkipList.bulkRejectPendingByDomain).not.toHaveBeenCalled();
  });
});
