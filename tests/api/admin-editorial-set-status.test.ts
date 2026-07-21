// Tests for POST /api/admin/editorial/set-status — send-back, reopen-draft,
// and resolve-flag. Same GitHub-commit-via-fetch shape as
// admin-editorial-approve.test.ts: no D1 dependency, mock fetch for the
// GitHub Contents API GET+PUT pair.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { makeContext, readJson } from '../helpers/context';

import { POST } from '../../src/pages/api/admin/editorial/set-status';

const ADMIN_EMAILS = 'eepskalla@gmail.com,jeffthomas4@gmail.com';
const GITHUB_TOKEN = 'gh_fake_token';
const ENV = { ADMIN_EMAILS, GITHUB_TOKEN };

const DRAFT_MD = `---
title: Test Article
editorial:
  status: draft
---
Body content here.
`;

const NEEDS_REVISION_MD = `---
title: Test Article
editorial:
  status: needs-revision
---
Body content here.
`;

const PUBLISHED_MD = `---
title: Test Article
editorial:
  status: published
---
Body content here.
`;

const FLAGGED_MD = `---
title: Test Article
editorial:
  status: claude-reviewed
  flagInappropriateness: true
  citationCheckPassed: false
---
Body content here.
`;

function b64(str: string): string {
  return Buffer.from(str, 'utf-8').toString('base64');
}

function adminRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://parentcoachdesk.com/api/admin/editorial/set-status', {
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

function githubOk(fileContent: string) {
  return vi
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(fileContent), sha: 'abc123' }), { status: 200 }))
    .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'def456' } }), { status: 200 }));
}

describe('POST /api/admin/editorial/set-status', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('auth: refuses a request with no Cloudflare Access identity', async () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/editorial/set-status', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://parentcoachdesk.com' },
      body: JSON.stringify({ action: 'send-back', collection: 'articles', slug: 'test-article' }),
    });
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(401);
  });

  it('auth: rejects an email off the allowlist', async () => {
    const req = adminRequest(
      { action: 'send-back', collection: 'articles', slug: 'test-article' },
      { 'Cf-Access-Authenticated-User-Email': 'nobody@example.com' },
    );
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
  });

  it('auth: rejects a cross-origin request even with a valid admin identity', async () => {
    const req = adminRequest(
      { action: 'send-back', collection: 'articles', slug: 'test-article' },
      { origin: 'https://evil.example.com' },
    );
    const res = await POST(makeContext({ request: req, env: ENV }));
    expect(res.status).toBe(403);
  });

  it('rejects an unknown action', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({ request: adminRequest({ action: 'delete-everything', collection: 'articles', slug: 'x' }), env: ENV }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  describe('send-back', () => {
    it('happy path: a claude-reviewed piece moves to needs-revision with a note', async () => {
      const fetchMock = githubOk(DRAFT_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'send-back', collection: 'articles', slug: 'test-article', note: 'Voice is off, rewrite the lede.' }),
        env: ENV,
      }));
      const body = await readJson(res);
      expect(res.status).toBe(200);
      expect(body).toMatchObject({ ok: true, status: 'needs-revision' });

      const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      const newContent = Buffer.from(putBody.content, 'base64').toString('utf-8');
      expect(newContent).toContain('status: needs-revision');
      expect(newContent).toContain('revisionNote: "Voice is off, rewrite the lede."');
    });

    it('forbidden transition: a published piece cannot be sent back', async () => {
      const fetchMock = githubOk(PUBLISHED_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'send-back', collection: 'articles', slug: 'live-article' }),
        env: ENV,
      }));
      const body = await readJson(res);
      expect(res.status).toBe(400);
      expect(body.error).toMatch(/invalid transition/);
      // Only the GET happened; no PUT was attempted for a rejected transition.
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('forbidden transition: a piece already in needs-revision cannot be sent back again', async () => {
      const fetchMock = githubOk(NEEDS_REVISION_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'send-back', collection: 'articles', slug: 'test-article' }),
        env: ENV,
      }));
      expect(res.status).toBe(400);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('reopen-draft', () => {
    it('happy path: needs-revision moves to draft', async () => {
      const fetchMock = githubOk(NEEDS_REVISION_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'reopen-draft', collection: 'articles', slug: 'test-article' }),
        env: ENV,
      }));
      const body = await readJson(res);
      expect(res.status).toBe(200);
      expect(body).toMatchObject({ ok: true, status: 'draft' });
      const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      const newContent = Buffer.from(putBody.content, 'base64').toString('utf-8');
      expect(newContent).toContain('status: draft');
    });

    it('forbidden transition: a plain draft cannot be "reopened" (it is not in needs-revision)', async () => {
      const fetchMock = githubOk(DRAFT_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'reopen-draft', collection: 'articles', slug: 'test-article' }),
        env: ENV,
      }));
      expect(res.status).toBe(400);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('resolve-flag', () => {
    it('happy path: clears an active flag and records who/why/when', async () => {
      const fetchMock = githubOk(FLAGGED_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'resolve-flag', collection: 'articles', slug: 'test-article', flag: 'INAPPROP', reason: 'Reviewed, not political.' }),
        env: ENV,
      }));
      const body = await readJson(res);
      expect(res.status).toBe(200);
      expect(body).toMatchObject({ ok: true, flag: 'INAPPROP' });

      const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      const newContent = Buffer.from(putBody.content, 'base64').toString('utf-8');
      expect(newContent).toContain('flagInappropriateness: false');
      expect(newContent).toContain('flagResolutions:');
      expect(newContent).toContain('flag: INAPPROP');
      expect(newContent).toContain('reason: "Reviewed, not political."');
      expect(newContent).toContain('admin: eepskalla@gmail.com');
    });

    it('happy path: NOCITE resolves by flipping citationCheckPassed to true', async () => {
      const fetchMock = githubOk(FLAGGED_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'resolve-flag', collection: 'articles', slug: 'test-article', flag: 'NOCITE', reason: 'Added sourcing.' }),
        env: ENV,
      }));
      expect(res.status).toBe(200);
      const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
      const newContent = Buffer.from(putBody.content, 'base64').toString('utf-8');
      expect(newContent).toContain('citationCheckPassed: true');
    });

    it('forbidden: an unknown flag name is rejected', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'resolve-flag', collection: 'articles', slug: 'test-article', flag: 'MADE-UP', reason: 'x' }),
        env: ENV,
      }));
      expect(res.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('forbidden: resolving a flag that is not currently active is rejected', async () => {
      const fetchMock = githubOk(DRAFT_MD);
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'resolve-flag', collection: 'articles', slug: 'test-article', flag: 'INAPPROP', reason: 'not flagged' }),
        env: ENV,
      }));
      const body = await readJson(res);
      expect(res.status).toBe(400);
      expect(body.error).toMatch(/flag not active/);
    });

    it('rejects a reason under 3 characters', async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);
      const res = await POST(makeContext({
        request: adminRequest({ action: 'resolve-flag', collection: 'articles', slug: 'test-article', flag: 'INAPPROP', reason: 'ok' }),
        env: ENV,
      }));
      expect(res.status).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  it('failure path: an unknown collection is rejected', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({
      request: adminRequest({ action: 'send-back', collection: 'not-a-real-collection', slug: 'x' }),
      env: ENV,
    }));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('failure path: GITHUB_TOKEN not configured returns 500 without calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await POST(makeContext({
      request: adminRequest({ action: 'send-back', collection: 'articles', slug: 'test-article' }),
      env: { ADMIN_EMAILS },
    }));
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
