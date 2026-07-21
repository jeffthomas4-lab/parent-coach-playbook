// Tests for POST /api/admin/link-health/recheck — three-test minimum: happy path, bad input, auth.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';
import { makeFakeD1 } from '../helpers/d1';

import { POST } from '../../src/pages/api/admin/link-health/recheck';

const ADMIN_EMAILS = 'eepskalla@gmail.com,jeffthomas4@gmail.com';
const TRACKED_URL = 'https://example.com/some-page';

const TRACKED_ROW = {
  url: TRACKED_URL,
  source_files: '["src/content/articles/some-post.md"]',
  last_checked: null,
  last_status_code: null,
  final_url: null,
  is_broken: 0,
  is_redirect: 0,
  redirected_off_host: 0,
  consecutive_failures: 0,
  last_broken_at: null,
  last_ok_at: null,
  wayback_snapshot: null,
  suggested_search: null,
  notes: null,
  first_seen: '2026-01-01T00:00:00.000Z',
  resolved_at: null,
  resolved_by: null,
  suggested_replacement: null,
};

function adminRequest(body: unknown = { url: TRACKED_URL }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/link-health/recheck', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': 'eepskalla@gmail.com',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/link-health/recheck', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://parentcoachdesk.com/api/admin/link-health/recheck', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ url: TRACKED_URL }),
    });
    const ctx = makeContext({ request: req, params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
  });

  it('auth: rejects an identity not on the allowlist', async () => {
    const { db } = makeFakeD1();
    const ctx = makeContext({
      request: adminRequest(undefined, { 'Cf-Access-Authenticated-User-Email': 'stranger@example.com' }),
      params: {},
      env: { DB: db, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });

  it('happy path: rechecking a tracked broken url updates it back to reachable', async () => {
    const { db, queueFirst, calls } = makeFakeD1();
    queueFirst(TRACKED_ROW); // getLinkHealthByUrl before the check
    queueFirst({ ...TRACKED_ROW, last_status_code: 200, is_broken: 0, last_checked: '2026-07-20T00:00:00.000Z' }); // getLinkHealthByUrl after the update

    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const ctx = makeContext({ request: adminRequest(), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.result.last_status_code).toBe(200);
    expect(body.result.is_broken).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(TRACKED_URL);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('HEAD');

    // An UPDATE statement ran with bound params, not string-built SQL.
    const updateCall = calls.find((c) => c.sql.includes('UPDATE link_health'));
    expect(updateCall).toBeDefined();
    expect(updateCall!.params).toContain(TRACKED_URL);
  });

  it('happy path: a HEAD 405 falls back to GET', async () => {
    const { db, queueFirst } = makeFakeD1();
    queueFirst(TRACKED_ROW);
    queueFirst({ ...TRACKED_ROW, last_status_code: 200 });

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 405 }))
      .mockResolvedValueOnce(new Response('ok', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const ctx = makeContext({ request: adminRequest(), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][1]?.method).toBe('GET');
  });

  it('failure path: a missing url is rejected without touching the database', async () => {
    const { db, calls } = makeFakeD1();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const ctx = makeContext({ request: adminRequest({}), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(calls.length).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('failure path: a non-http(s) url is rejected', async () => {
    const { db } = makeFakeD1();
    const ctx = makeContext({ request: adminRequest({ url: 'javascript:alert(1)' }), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a url not tracked in link_health returns 404 and never calls fetch', async () => {
    const { db, queueFirst } = makeFakeD1();
    queueFirst(null); // getLinkHealthByUrl finds nothing
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const ctx = makeContext({ request: adminRequest({ url: 'https://example.com/untracked' }), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const { db } = makeFakeD1();
    const req = adminRequest({ url: TRACKED_URL }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });

  it('failure path: database not available returns 500', async () => {
    const ctx = makeContext({ request: adminRequest(), params: {}, env: { ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
  });
});
