// Tests for src/lib/publish.ts — the approve-to-publish pipeline.
//
// The thing this file has to prove is not just "the happy path publishes." It
// is that the pipeline refuses to do anything on its own: no valid target, no
// publish; already published, no second commit; GitHub says no, no deploy hook.

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  flipDraftFrontmatter,
  publishDraft,
  fireDeployHook,
  isSafeSlug,
  buildApprovalBlocks,
} from '../../src/lib/publish';

const ENV = { GITHUB_TOKEN: 'gh_fake', DEPLOY_HOOK_URL: 'https://api.cloudflare.com/hook/fake' };
const OPTS = { today: '2026-07-15', approvedBy: 'jeffthomas@pugetsound.edu' };

const DRAFT_MD = `---
title: A Test Post
draft: true
editorial:
  status: claude-reviewed
---
Body copy.
`;

function b64(s: string): string {
  return Buffer.from(s, 'utf-8').toString('base64');
}

function unb64(s: string): string {
  return Buffer.from(s, 'base64').toString('utf-8');
}

describe('flipDraftFrontmatter', () => {
  it('happy path: flips draft:true to draft:false and stamps the editorial block', () => {
    const result = flipDraftFrontmatter(DRAFT_MD, OPTS);
    expect(result).not.toBeNull();
    expect(result!.changed).toBe(true);
    expect(result!.content).toContain('draft: false');
    expect(result!.content).not.toContain('draft: true');
    expect(result!.content).toContain('status: published');
    expect(result!.content).toContain('jeffReviewedAt: 2026-07-15');
    expect(result!.content).toContain('Body copy.');
  });

  it('leaves the body untouched', () => {
    const md = `---\ndraft: true\n---\nThe body has --- dashes and draft: true inside it.\n`;
    const result = flipDraftFrontmatter(md, OPTS);
    expect(result!.content).toContain('The body has --- dashes and draft: true inside it.');
  });

  it('adds an editorial block when the file has none', () => {
    const md = `---\ntitle: No Editorial Block\ndraft: true\n---\nBody.\n`;
    const result = flipDraftFrontmatter(md, OPTS);
    expect(result!.changed).toBe(true);
    expect(result!.content).toContain('editorial:\n  status: published');
  });

  it('reports changed:false for a post that is already published', () => {
    const md = `---\ntitle: Live Already\ndraft: false\neditorial:\n  status: published\n  jeffReviewedAt: 2026-07-15\n---\nBody.\n`;
    const result = flipDraftFrontmatter(md, OPTS);
    expect(result!.changed).toBe(false);
  });

  it('returns null for a file with no frontmatter at all', () => {
    expect(flipDraftFrontmatter('Just a body, no frontmatter.', OPTS)).toBeNull();
  });

  it('does not add a draft key to a file that never had one', () => {
    const md = `---\ntitle: Never Had Draft\neditorial:\n  status: claude-reviewed\n---\nBody.\n`;
    const result = flipDraftFrontmatter(md, OPTS);
    expect(result!.content).not.toContain('draft:');
    expect(result!.changed).toBe(true);
  });
});

describe('isSafeSlug', () => {
  it('SECURITY: rejects path traversal and separators', () => {
    expect(isSafeSlug('../../../etc/passwd')).toBe(false);
    expect(isSafeSlug('a/b')).toBe(false);
    expect(isSafeSlug('..')).toBe(false);
    expect(isSafeSlug('post.md')).toBe(false);
    expect(isSafeSlug('')).toBe(false);
  });

  it('accepts an ordinary slug', () => {
    expect(isSafeSlug('why-travel-ball-is-not-the-answer')).toBe(true);
  });
});

describe('publishDraft', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('happy path: reads, commits, and fires the deploy hook', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(DRAFT_MD), sha: 'sha1' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'sha2' } }), { status: 200 }))
      .mockResolvedValueOnce(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await publishDraft(ENV, {
      collection: 'articles',
      slug: 'a-test-post',
      approvedBy: 'jeffthomas@pugetsound.edu',
    });
    expect(result).toMatchObject({ ok: true, path: 'src/content/articles/a-test-post.md', deploy: 'fired' });
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const putBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(unb64(putBody.content)).toContain('draft: false');
    expect(putBody.committer.email).toBe('parentcoachplaybook@gmail.com');
    expect(fetchMock.mock.calls[0][0]).toContain('/repos/jeffthomas4-lab/parent-coach-playbook/');
    // Optimistic concurrency: the sha we read must be the sha we write against.
    expect(putBody.sha).toBe('sha1');
    expect(fetchMock.mock.calls[2][0]).toBe(ENV.DEPLOY_HOOK_URL);
  });

  it('refuses an unknown collection without calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(ENV, { collection: 'not-real', slug: 'x', approvedBy: 'a@b.com' });
    expect(result).toMatchObject({ ok: false, code: 400 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('SECURITY: refuses a traversal slug without calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(ENV, {
      collection: 'articles',
      slug: '../../../wrangler',
      approvedBy: 'a@b.com',
    });
    expect(result).toMatchObject({ ok: false, code: 400, error: 'invalid slug' });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses when GITHUB_TOKEN is not configured', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft({ DEPLOY_HOOK_URL: 'x' }, {
      collection: 'articles',
      slug: 'a-test-post',
      approvedBy: 'a@b.com',
    });
    expect(result).toMatchObject({ ok: false, code: 500 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses invalid configured committer metadata before calling GitHub', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(
      { ...ENV, PUBLISH_COMMITTER_EMAIL: 'slack:jeff' },
      { collection: 'articles', slug: 'a-test-post', approvedBy: 'slack:jeff' },
    );
    expect(result).toMatchObject({ ok: false, code: 500 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('failure path: a missing draft returns 404 and never commits', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('not found', { status: 404 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(ENV, { collection: 'articles', slug: 'ghost', approvedBy: 'a@b.com' });
    expect(result).toMatchObject({ ok: false, code: 404 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('a double-clicked button does not produce a second commit', async () => {
    const published = `---\ntitle: Live\ndraft: false\neditorial:\n  status: published\n  jeffReviewedAt: 2020-01-01\n---\nBody.\n`;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(published), sha: 'sha1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(ENV, { collection: 'articles', slug: 'live', approvedBy: 'a@b.com' });
    expect(result).toMatchObject({ ok: false, code: 409, error: 'already published' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('failure path: a rejected commit does not fire the deploy hook', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(DRAFT_MD), sha: 'stale' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('sha mismatch', { status: 409 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(ENV, { collection: 'articles', slug: 'a-test-post', approvedBy: 'a@b.com' });
    expect(result).toMatchObject({ ok: false, code: 502 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('a GitHub error does not leak GitHub error text to the caller', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('{"message":"Bad credentials","token":"ghp_secret"}', { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft(ENV, { collection: 'articles', slug: 'x-post', approvedBy: 'a@b.com' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).not.toContain('ghp_secret');
      expect(result.error).not.toContain('Bad credentials');
    }
  });

  it('commits even when no deploy hook is configured, and says so', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: b64(DRAFT_MD), sha: 'sha1' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'sha2' } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const result = await publishDraft({ GITHUB_TOKEN: 'gh_fake' }, {
      collection: 'articles',
      slug: 'a-test-post',
      approvedBy: 'a@b.com',
    });
    expect(result).toMatchObject({ ok: true, deploy: 'skipped' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('fireDeployHook', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('skips without an error when no hook is configured', async () => {
    expect(await fireDeployHook({})).toBe('skipped');
  });

  it('reports failed when the hook returns an error status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })));
    expect(await fireDeployHook(ENV)).toBe('failed');
  });

  it('reports failed rather than throwing when the hook is unreachable', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error(`network ${ENV.DEPLOY_HOOK_URL}`); }));
    expect(await fireDeployHook(ENV)).toBe('failed');
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain(ENV.DEPLOY_HOOK_URL);
  });
});

describe('buildApprovalBlocks', () => {
  it('carries collection and slug in the action value so the click is self-describing', () => {
    const blocks = buildApprovalBlocks({
      collection: 'articles',
      slug: 'a-test-post',
      title: 'A Test Post',
      reviewUrl: 'https://parentcoachdesk.com/admin/',
    }) as any[];
    const publishButton = blocks[1].elements[0];
    expect(publishButton.action_id).toBe('publish_draft');
    expect(JSON.parse(publishButton.value)).toEqual({ collection: 'articles', slug: 'a-test-post' });
  });

  it('puts a confirmation dialog on the publish button', () => {
    const blocks = buildApprovalBlocks({
      collection: 'articles',
      slug: 'a-test-post',
      title: 'A Test Post',
      reviewUrl: 'https://parentcoachdesk.com/admin/',
    }) as any[];
    expect(blocks[1].elements[0].confirm).toBeDefined();
  });
});
