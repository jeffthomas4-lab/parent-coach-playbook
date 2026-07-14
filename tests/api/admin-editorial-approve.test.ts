// Tests for POST /api/admin/editorial/approve — three-test minimum: happy path, failure path, auth.
// This route has no D1 dependency; it calls the GitHub Contents API directly via fetch.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

import { POST } from '../../src/pages/api/admin/editorial/approve';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const GITHUB_TOKEN = 'gh_fake_token';

const SAMPLE_MD = `---
title: Test Article
editorial:
  status: pending
---
Body content here.
`;

function encodeBase64(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function adminRequest(body: unknown = { collection: 'articles', slug: 'test-article' }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/editorial/approve', {
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

describe('POST /api/admin/editorial/approve', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/editorial/approve', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ collection: 'articles', slug: 'test-article' }),
    });
    const ctx = makeContext({ request: req, params: {}, env: { ADMIN_EMAILS, GITHUB_TOKEN } });
    const res = await POST(ctx);
    expect(res.status).toBe(401);
  });

  it('happy path: approving an article updates frontmatter and commits via GitHub', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ content: encodeBase64(SAMPLE_MD), sha: 'abc123' }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'def456' } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const ctx = makeContext({
      request: adminRequest({ collection: 'articles', slug: 'test-article' }),
      params: {},
      env: { ADMIN_EMAILS, GITHUB_TOKEN },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.status).toBe('jeff-approved');
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const putCall = fetchMock.mock.calls[1];
    const putBody = JSON.parse(putCall[1].body);
    const newContent = Buffer.from(putBody.content, 'base64').toString('utf-8');
    expect(newContent).toContain('status: jeff-approved');
  });

  it('failure path: missing collection or slug returns 400', async () => {
    const ctx = makeContext({ request: adminRequest({ collection: 'articles' }), params: {}, env: { ADMIN_EMAILS, GITHUB_TOKEN } });
    const res = await POST(ctx);
    expect(res.status).toBe(400);
  });

  it('failure path: an unknown collection is rejected', async () => {
    const ctx = makeContext({
      request: adminRequest({ collection: 'not-a-real-collection', slug: 'x' }),
      params: {},
      env: { ADMIN_EMAILS, GITHUB_TOKEN },
    });
    const res = await POST(ctx);
    const body = await readJson(res);
    expect(res.status).toBe(400);
    expect(body.error).toMatch(/unknown collection/);
  });

  it('failure path: GITHUB_TOKEN not configured returns 500 without calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const ctx = makeContext({
      request: adminRequest({ collection: 'articles', slug: 'test-article' }),
      params: {},
      env: { ADMIN_EMAILS },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('failure path: a file GitHub cannot find returns 404', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('not found', { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);
    const ctx = makeContext({
      request: adminRequest({ collection: 'articles', slug: 'missing-article' }),
      params: {},
      env: { ADMIN_EMAILS, GITHUB_TOKEN },
    });
    const res = await POST(ctx);
    expect(res.status).toBe(404);
  });

  it('failure path: a cross-origin request is rejected even with valid admin auth', async () => {
    const req = adminRequest({ collection: 'articles', slug: 'test-article' }, { origin: 'https://evil.example.com' });
    const ctx = makeContext({ request: req, params: {}, env: { ADMIN_EMAILS, GITHUB_TOKEN } });
    const res = await POST(ctx);
    expect(res.status).toBe(403);
  });
});
