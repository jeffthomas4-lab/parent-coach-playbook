// Tests for POST /api/admin/link-health/suggest-replacement — three-test minimum: happy path, bad input, auth.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';
import { makeFakeD1 } from '../helpers/d1';

import { POST } from '../../src/pages/api/admin/link-health/suggest-replacement';

const ADMIN_EMAILS = 'eepskalla@gmail.com,jeffthomas4@gmail.com';
const TRACKED_URL = 'https://example.com/some-page';
const REPLACEMENT_URL = 'https://example.com/new-page';

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
  wayback_snapshot: 'https://web.archive.org/web/2025/https://example.com/some-page',
  suggested_search: null,
  notes: null,
  first_seen: '2026-01-01T00:00:00.000Z',
  resolved_at: null,
  resolved_by: null,
  suggested_replacement: null,
};

function adminRequest(body: unknown = { url: TRACKED_URL, suggestedReplacement: REPLACEMENT_URL }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/link-health/suggest-replacement', {
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

describe('POST /api/admin/link-health/suggest-replacement', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const { db } = makeFakeD1();
    const req = new Request('https://parentcoachdesk.com/api/admin/link-health/suggest-replacement', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ url: TRACKED_URL, suggestedReplacement: REPLACEMENT_URL }),
    });
    const ctx = makeContext({ request: req, params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
  });

  it('happy path: saving a replacement stores it without touching content', async () => {
    const { db, queueFirst, queueRun, calls } = makeFakeD1();
    queueFirst(TRACKED_ROW);
    queueRun({ meta: { changes: 1 } });

    const ctx = makeContext({ request: adminRequest(), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    const body = await readJson(res);

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.suggestedReplacement).toBe(REPLACEMENT_URL);

    const updateCall = calls.find((c) => c.sql.includes('UPDATE link_health SET suggested_replacement'));
    expect(updateCall).toBeDefined();
    expect(updateCall!.params).toContain(REPLACEMENT_URL);
    expect(updateCall!.params).toContain(TRACKED_URL);
  });

  it('failure path: a non-url replacement value is rejected', async () => {
    const { db, calls } = makeFakeD1();
    const ctx = makeContext({
      request: adminRequest({ url: TRACKED_URL, suggestedReplacement: 'not a url' }),
      params: {},
      env: { DB: db, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(calls.length).toBe(0);
  });

  it('failure path: a missing suggestedReplacement is rejected', async () => {
    const { db } = makeFakeD1();
    const ctx = makeContext({ request: adminRequest({ url: TRACKED_URL }), params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: a url not tracked in link_health returns 404', async () => {
    const { db, queueFirst } = makeFakeD1();
    queueFirst(null);
    const ctx = makeContext({
      request: adminRequest({ url: 'https://example.com/untracked', suggestedReplacement: REPLACEMENT_URL }),
      params: {},
      env: { DB: db, ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const { db } = makeFakeD1();
    const req = adminRequest(undefined, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: {}, env: { DB: db, ADMIN_EMAILS } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });
});
