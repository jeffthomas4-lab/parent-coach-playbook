// Tests for POST /api/admin/editorial/publish — the admin-UI half of the
// approve-to-publish pipeline. Three-test minimum plus the gate cases.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';
import { POST } from '../../src/pages/api/admin/editorial/publish';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu';
const ENV = { ADMIN_EMAILS, GITHUB_TOKEN: 'gh_fake' };

const DRAFT_MD = `---
title: A Test Post
draft: true
editorial:
  status: claude-reviewed
---
Body.
`;

const b64 = (s: string) => Buffer.from(s, 'utf-8').toString('base64');

function adminRequest(body: unknown = { collection: 'articles', slug: 'a-test-post' }, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/editorial/publish', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://parentcoachdesk.com',
      'Cf-Access-Authenticated-User-Email': ADMIN_EMAILS,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function githubOk() {
  return vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(DRAFT_MD), sha: 'sha1' }), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'sha2' } }), { status: 200 }))
    .mockResolvedValueOnce(new Response('{}', { status: 200 }));
}

describe('POST /api/admin/editorial/publish', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const req = new Request('https://parentcoachdesk.com/api/admin/editorial/publish', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ collection: 'articles', slug: 'a-test-post' }),
    });
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('auth: refuses an email off the allowlist', async () => {
    const req = adminRequest(undefined, { 'Cf-Access-Authenticated-User-Email': 'nobody@example.com' });
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
  });

  it('auth: refuses a cross-origin request even with a valid admin identity', async () => {
    const req = adminRequest(undefined, { origin: 'https://evil.example.com' });
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
  });

  it('happy path: publishes and reports protected CI/CD queued', async () => {
    const fetchMock = githubOk();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({ request: adminRequest(), env: ENV }));
    const body = await readJson(res);
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ ok: true, status: 'published', deploy: 'queued', publishedBy: ADMIN_EMAILS });
    const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(Buffer.from(putBody.content, 'base64').toString('utf-8')).toContain('draft: false');
    expect(putBody.message).toContain('Publish: articles/a-test-post');
  });

  it('failure path: missing collection or slug returns 400 without touching GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({ request: adminRequest({ collection: 'articles' }), env: ENV }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('failure path: an already-published post returns 409', async () => {
    const live = `---\ntitle: Live\ndraft: false\neditorial:\n  status: published\n  jeffReviewedAt: 2020-01-01\n---\nBody.\n`;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(live), sha: 's' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({ request: adminRequest({ collection: 'articles', slug: 'live' }), env: ENV }));
    expect(res.status).toBe(409);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('failure path: a missing draft returns 404', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('nope', { status: 404 })));
    const res = await POST(makeContext({ request: adminRequest({ collection: 'articles', slug: 'ghost' }), env: ENV }));
    expect(res.status).toBe(404);
  });

  it('failure path: GITHUB_TOKEN not configured returns 500 without calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({ request: adminRequest(), env: { ADMIN_EMAILS } }));
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects an invalid JSON body', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/editorial/publish', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://parentcoachdesk.com',
        'Cf-Access-Authenticated-User-Email': ADMIN_EMAILS,
      },
      body: 'nope',
    });
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(400);
  });
});
