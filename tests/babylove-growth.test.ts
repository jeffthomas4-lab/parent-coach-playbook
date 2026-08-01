import { afterEach, describe, expect, it, vi } from 'vitest';
import type { D1Database, ExecutionContext } from '@cloudflare/workers-types';
import {
  articleFingerprint,
  buildBabyLoveArticleMarkdown,
  handleBabyLoveWebhook,
  parseBabyLoveArticle,
  reconcileBabyLoveArticles,
  sanitizeExternalMarkdown,
  type BabyLoveEnv,
} from '../src/lib/babylove-growth';
import { makeFakeD1 } from './helpers/d1';

const LONG_BODY = `
# A provider heading

Youth sports can put parents in difficult moments. The useful response starts with curiosity, a calm question, and enough silence for a child to answer honestly.

This article gives parents a practical framework for separating their own emotions from the child's experience, choosing words that preserve the relationship, and deciding whether action is actually needed.
`.repeat(2);

const PAYLOAD = {
  id: 'article-123',
  title: 'What Parents Should Say After a Difficult Game',
  slug: 'what-to-say-after-a-difficult-game',
  content_markdown: LONG_BODY,
  meta_description: 'A practical guide for parents handling the ride home after a difficult youth sports game without damaging trust or turning the moment into a lecture.',
  excerpt: 'Calm, relationship-first guidance for the ride home after a difficult game.',
  language_code: 'en-US',
  created_at: '2026-08-01T12:00:00.000Z',
};

function executionContext(pending: Promise<unknown>[]): ExecutionContext {
  return {
    waitUntil(promise: Promise<unknown>) {
      pending.push(promise);
    },
    passThroughOnException() {},
  } as unknown as ExecutionContext;
}

function webhookRequest(body: string, headers: Record<string, string> = {}): Request {
  return new Request('https://parentcoachdesk.com/api/integrations/babylovegrowth/articles', {
    method: 'POST',
    headers: {
      authorization: 'Bearer webhook-test-token',
      'content-type': 'application/json',
      ...headers,
    },
    body,
  });
}

function env(db: unknown, overrides: Partial<BabyLoveEnv> = {}): BabyLoveEnv {
  return {
    PCD_OPS_DB: db as D1Database,
    BABYLOVE_WEBHOOK_TOKEN: 'webhook-test-token',
    BABYLOVE_AUTOPUBLISH_ENABLED: 'false',
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('BabyLoveGrowth article normalization', () => {
  it('accepts direct and article-envelope payloads with stable fingerprints', async () => {
    const direct = parseBabyLoveArticle(PAYLOAD);
    const wrapped = parseBabyLoveArticle({ article: PAYLOAD });
    expect(wrapped).toEqual(direct);
    expect(await articleFingerprint(wrapped)).toBe(await articleFingerprint(direct));
    expect(direct.slug).toBe(PAYLOAD.slug);
    expect(direct.languageCode).toBe('en-us');
  });

  it('converts HTML when markdown is absent', () => {
    const article = parseBabyLoveArticle({
      ...PAYLOAD,
      content_markdown: undefined,
      content_html: `<h1>One title</h1><p>${LONG_BODY}</p>`,
    });
    expect(article.contentMarkdown).toContain('## One title');
    expect(article.contentMarkdown).not.toContain('<h1>');
  });

  it('removes active content, embedded images, and unsafe links while preserving later dividers', () => {
    const safe = sanitizeExternalMarkdown(`---
provider: value
---
# Main
<script>alert('x')</script>
![tracking pixel](data:image/png;base64,abc)
[bad](javascript:alert(1))

---

Keep this section.
`);
    expect(safe).not.toContain('provider: value');
    expect(safe).not.toContain('<script>');
    expect(safe).not.toContain('data:image');
    expect(safe).not.toContain('javascript:');
    expect(safe).toContain('## Main');
    expect(safe).toContain('---\n\nKeep this section.');
  });

  it.each([
    [{ ...PAYLOAD, id: '../bad' }, 'invalid_article_id'],
    [{ ...PAYLOAD, title: 'short' }, 'invalid_title'],
    [{ ...PAYLOAD, language_code: 'fr' }, 'unsupported_language'],
    [{ ...PAYLOAD, content_markdown: 'too short' }, 'content_too_short'],
  ])('rejects invalid provider payloads', (payload, message) => {
    expect(() => parseBabyLoveArticle(payload)).toThrow(message);
  });

  it('uses a deterministic date when the provider omits one', async () => {
    const withoutDate = { ...PAYLOAD, created_at: undefined };
    const first = parseBabyLoveArticle(withoutDate);
    const second = parseBabyLoveArticle(withoutDate);
    expect(first.createdAt).toBe('1970-01-01T00:00:00.000Z');
    expect(await articleFingerprint(first)).toBe(await articleFingerprint(second));
  });

  it('builds valid main-site frontmatter with provenance and audit-sized metadata', async () => {
    const article = parseBabyLoveArticle(PAYLOAD);
    const fingerprint = await articleFingerprint(article);
    const markdown = buildBabyLoveArticleMarkdown(article, fingerprint, '2026-08-01T13:00:00.000Z');
    const seoTitle = markdown.match(/^seoTitle: "(.+)"$/m)?.[1] ?? '';
    const seoDescription = markdown.match(/^seoDescription: "(.+)"$/m)?.[1] ?? '';

    expect(seoTitle.length).toBeGreaterThanOrEqual(20);
    expect(seoTitle.length).toBeLessThanOrEqual(60);
    expect(seoDescription.length).toBeGreaterThanOrEqual(140);
    expect(seoDescription.length).toBeLessThanOrEqual(160);
    expect(markdown).toContain('provider: "babylovegrowth"');
    expect(markdown).toContain('articleId: "article-123"');
    expect(markdown).toContain(`payloadSha256: "${fingerprint}"`);
    expect(markdown).toContain('draft: false');
    expect(markdown).toContain('status: published');
  });
});

describe('BabyLoveGrowth webhook boundary', () => {
  it('rejects unauthenticated, non-JSON, oversized, and malformed requests', async () => {
    const fake = makeFakeD1();
    const pending: Promise<unknown>[] = [];
    const ctx = executionContext(pending);

    const unauthorized = webhookRequest(JSON.stringify(PAYLOAD), { authorization: 'Bearer wrong' });
    expect((await handleBabyLoveWebhook(unauthorized, env(fake.db), ctx)).status).toBe(401);

    const nonJson = webhookRequest(JSON.stringify(PAYLOAD), { 'content-type': 'text/plain' });
    expect((await handleBabyLoveWebhook(nonJson, env(fake.db), ctx)).status).toBe(415);

    const oversized = webhookRequest('{}', { 'content-length': String(512 * 1024 + 1) });
    expect((await handleBabyLoveWebhook(oversized, env(fake.db), ctx)).status).toBe(413);

    const chunkedOversized = webhookRequest('x'.repeat(512 * 1024 + 1));
    expect((await handleBabyLoveWebhook(chunkedOversized, env(fake.db), ctx)).status).toBe(413);

    expect((await handleBabyLoveWebhook(webhookRequest('{'), env(fake.db), ctx)).status).toBe(400);
    expect(pending).toHaveLength(0);
  });

  it('acknowledges after durable receipt creation and completes disabled publishing in the background', async () => {
    const fake = makeFakeD1();
    const pending: Promise<unknown>[] = [];
    const response = await handleBabyLoveWebhook(
      webhookRequest(JSON.stringify(PAYLOAD)),
      env(fake.db),
      executionContext(pending),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, accepted: true, replayed: false });
    expect(pending).toHaveLength(1);
    await Promise.all(pending);
    expect(fake.calls.some((call) =>
      call.sql.includes('UPDATE external_article_receipts') && call.params[0] === 'held'
    )).toBe(true);
  });

  it('does not schedule a second publish for an already-published fingerprint', async () => {
    const fake = makeFakeD1();
    const article = parseBabyLoveArticle(PAYLOAD);
    fake.queueFirst({
      id: 'receipt-existing',
      status: 'published',
      provider_article_id: article.id,
      payload_sha256: await articleFingerprint(article),
      received_at: '2026-08-01T13:00:00.000Z',
    });
    const pending: Promise<unknown>[] = [];
    const response = await handleBabyLoveWebhook(
      webhookRequest(JSON.stringify(PAYLOAD)),
      env(fake.db),
      executionContext(pending),
    );

    expect(await response.json()).toMatchObject({ ok: true, replayed: true });
    expect(pending).toHaveLength(0);
  });
});

describe('BabyLoveGrowth API reconciliation', () => {
  it('fetches full content and commits a regular article to the protected main branch', async () => {
    const fake = makeFakeD1();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ articles: [{ id: PAYLOAD.id }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ article: PAYLOAD }), { status: 200 }))
      .mockResolvedValueOnce(new Response('not found', { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ commit: { sha: 'commit-123' } }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await reconcileBabyLoveArticles(env(fake.db, {
      BABYLOVE_AUTOPUBLISH_ENABLED: 'true',
      BABYLOVE_API_KEY: 'api-test-key',
      GITHUB_TOKEN: 'github-test-token',
    }));

    expect(result).toEqual({ scanned: 1, published: 1, skipped: 0, failed: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.babylovegrowth.ai/api/integrations/v1/articles');
    expect(fetchMock.mock.calls[0][1].headers['X-API-Key']).toBe('api-test-key');
    expect(fetchMock.mock.calls[2][0]).toContain('/contents/src/content/articles/what-to-say-after-a-difficult-game.md?ref=main');
    const putBody = JSON.parse(fetchMock.mock.calls[3][1].body);
    expect(putBody.branch).toBe('main');
    expect(Buffer.from(putBody.content, 'base64').toString('utf8')).toContain('externalSource:');
    expect(fake.calls.some((call) =>
      call.sql.includes('UPDATE external_article_receipts') && call.params[0] === 'published'
    )).toBe(true);
  });

  it('quarantines a slug collision instead of overwriting a human-authored article', async () => {
    const fake = makeFakeD1();
    const existingHumanArticle = Buffer.from('---\ntitle: Human article\ndraft: false\n---\nBody\n').toString('base64');
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: PAYLOAD.id }]), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(PAYLOAD), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ content: existingHumanArticle, sha: 'human-sha' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await reconcileBabyLoveArticles(env(fake.db, {
      BABYLOVE_AUTOPUBLISH_ENABLED: 'true',
      BABYLOVE_API_KEY: 'api-test-key',
      GITHUB_TOKEN: 'github-test-token',
    }));

    expect(result).toEqual({ scanned: 1, published: 0, skipped: 0, failed: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fake.calls.some((call) =>
      call.sql.includes('UPDATE external_article_receipts')
      && call.params[0] === 'quarantined'
      && call.params[3] === 'slug_collision'
    )).toBe(true);
  });
});
