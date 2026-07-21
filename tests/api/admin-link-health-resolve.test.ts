// Tests for POST /api/admin/link-health/resolve — three-test minimum: happy path, bad input, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';
import { makeFakeD1 } from '../helpers/d1';

import { POST } from '../../src/pages/api/admin/link-health/resolve';

const ADMIN_EMAILS = 'eepskalla@gmail.com,jeffthomas4@gmail.com';
const TRACKED_URL = 'https://example.com/some-page';

const TRACKED_ROW = {
  url: TRACKED_URL,
  source_files: '["src/content/articles/some-post.md"]',
  last_checked: '2026-07-01T00:00:00.000Z',
  last_status_code: 404,
  final_url: null,
  is_broken: 1,
  is_redirect: 0,
  redirected_off_host: 0,
  consecutive_failures: 3,
  last_broken_at: '2026-07-01T00:00:00.000Z',
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
  return new Request('https://parentcoachdesk.com/api/admin/link-health/resolve', {
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

describe('POST /api/admin/link-health/resolve', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://parentcoachdesk.com/api/admin/link-health/resolve', {
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

  it('happy path: marking a tracked broken url resolved stamps resolved_at/resolved_by', async () => {
    const { db, queueFirst, queueRun, calls } = makeFakeD1();
    queueFirst(TRACKED_ROW); // getLinkHealthByUrl
    queueRun({ meta: { changes: 1 } }); // markLinkResolved's UPDATE

    const ctx = makeContext({ request: adminRequest(), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.resolvedBy).toBe('eepskalla@gmail.com');

    const updateCall = calls.find((c) => c.sql.includes('UPDATE link_health SET resolved_at'));
    expect(updateCall).toBeDefined();
    expect(updateCall!.params).toContain(TRACKED_URL);
    expect(updateCall!.params).toContain('eepskalla@gmail.com');
  });

  it('failure path: a missing url is rejected without touching the database', async () => {
    const { db, calls } = makeFakeD1();
    const ctx = makeContext({ request: adminRequest({}), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(calls.length).toBe(0);
  });

  it('failure path: invalid json body is rejected', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://parentcoachdesk.com/api/admin/link-health/resolve', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://parentcoachdesk.com',
        'Cf-Access-Authenticated-User-Email': 'eepskalla@gmail.com',
      },
      body: 'not json',
    });
    const ctx = makeContext({ request: req, params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a url not tracked in link_health returns 404', async () => {
    const { db, queueFirst } = makeFakeD1();
    queueFirst(null);
    const ctx = makeContext({ request: adminRequest({ url: 'https://example.com/untracked' }), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
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
