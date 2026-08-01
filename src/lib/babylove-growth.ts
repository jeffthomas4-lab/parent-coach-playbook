import { bearerCredential, secretsMatch } from './secrets';
import { decodeBase64, encodeBase64, isSafeSlug, REPO, BRANCH } from './publish';

const PROVIDER = 'babylovegrowth';
const MAX_WEBHOOK_BYTES = 512 * 1024;
const MAX_MARKDOWN_CHARS = 240_000;
const GITHUB_TIMEOUT_MS = 15_000;
const API_TIMEOUT_MS = 12_000;
const API_BASE = 'https://api.babylovegrowth.ai/api/integrations/v1/articles';

export interface BabyLoveEnv {
  PCD_OPS_DB?: D1Database;
  BABYLOVE_WEBHOOK_TOKEN?: string;
  BABYLOVE_API_KEY?: string;
  BABYLOVE_AUTOPUBLISH_ENABLED?: string;
  GITHUB_TOKEN?: string;
  PUBLISH_COMMITTER_EMAIL?: string;
}

export interface BabyLoveArticle {
  id: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  metaDescription: string;
  excerpt: string;
  languageCode: string;
  createdAt: string;
}

interface ReceiptRow {
  id: string;
  status: string;
  provider_article_id: string;
  payload_sha256: string;
  received_at: string;
}

interface GitHubFile {
  content: string;
  sha: string;
}

class BabyLoveFailure extends Error {
  constructor(readonly code: string, message = code) {
    super(message);
  }
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  },
});

async function readBoundedText(request: Request, maxBytes: number): Promise<string> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBytes) {
      await reader.cancel();
      throw new BabyLoveFailure('payload_too_large');
    }
    chunks.push(decoder.decode(value, { stream: true }));
  }
  chunks.push(decoder.decode());
  return chunks.join('');
}

function enabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function stringValue(value: unknown, max: number): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max)
    : '';
}

function idValue(value: unknown): string {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return String(value);
  if (typeof value !== 'string') return '';
  const normalized = value.trim();
  return /^[A-Za-z0-9_-]{1,80}$/.test(normalized) ? normalized : '';
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

export function sanitizeExternalMarkdown(markdown: string): string {
  let value = markdown.slice(0, MAX_MARKDOWN_CHARS);
  value = value.replace(/^---\s*[\s\S]*?\s*---\s*/, '');
  value = value.replace(/<!--[\s\S]*?-->/g, '');
  value = value.replace(/<(script|style|iframe|form|object|embed|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  value = value.replace(/<(script|style|iframe|form|object|embed|svg)\b[^>]*\/?\s*>/gi, '');
  value = value.replace(/<[^>]+>/g, '');
  value = value.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  value = value.replace(/\[([^\]]+)\]\(\s*(?:javascript|data|vbscript):[^)]*\)/gi, '$1');
  value = value.replace(/^#\s+/gm, '## ');
  value = decodeEntities(value);
  value = value.replace(/\r\n/g, '\n').replace(/\n{4,}/g, '\n\n\n').trim();
  return `${value}\n`;
}

function htmlToMarkdown(html: string): string {
  const converted = html
    .replace(/<h1\b[^>]*>/gi, '\n## ')
    .replace(/<h[2-6]\b[^>]*>/gi, '\n### ')
    .replace(/<\/(h[1-6]|p|div|section|article|blockquote)>/gi, '\n\n')
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '')
    .replace(/<(strong|b)\b[^>]*>/gi, '**')
    .replace(/<\/(strong|b)>/gi, '**')
    .replace(/<(em|i)\b[^>]*>/gi, '*')
    .replace(/<\/(em|i)>/gi, '*');
  return sanitizeExternalMarkdown(converted);
}

function normalizeSlug(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '');
  return isSafeSlug(slug) ? slug : '';
}

export function parseBabyLoveArticle(payload: unknown): BabyLoveArticle {
  const envelope = objectValue(payload);
  if (!envelope) throw new BabyLoveFailure('object_required');
  const input = objectValue(envelope.article) ?? envelope;
  const id = idValue(input.id);
  const title = stringValue(input.title, 120);
  const slug = normalizeSlug(stringValue(input.slug, 140) || title);
  const languageCode = stringValue(input.languageCode ?? input.language_code ?? 'en', 12).toLowerCase();
  const rawMarkdown = typeof input.content_markdown === 'string' ? input.content_markdown : '';
  const rawHtml = typeof input.content_html === 'string' ? input.content_html : '';
  const contentMarkdown = rawMarkdown
    ? sanitizeExternalMarkdown(rawMarkdown)
    : rawHtml
      ? htmlToMarkdown(rawHtml)
      : '';
  const metaDescription = stringValue(input.metaDescription ?? input.meta_description, 180);
  const excerpt = stringValue(input.excerpt, 240);
  const createdCandidate = stringValue(input.createdAt ?? input.created_at, 64);
  const created = createdCandidate ? new Date(createdCandidate) : null;
  const createdAt = created && !Number.isNaN(created.getTime())
    ? created.toISOString()
    : '1970-01-01T00:00:00.000Z';

  if (!id) throw new BabyLoveFailure('invalid_article_id');
  if (title.length < 8) throw new BabyLoveFailure('invalid_title');
  if (!slug) throw new BabyLoveFailure('invalid_slug');
  if (languageCode !== 'en' && !languageCode.startsWith('en-')) throw new BabyLoveFailure('unsupported_language');
  if (contentMarkdown.trim().length < 200) throw new BabyLoveFailure('content_too_short');
  return { id, title, slug, contentMarkdown, metaDescription, excerpt, languageCode, createdAt };
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function articleFingerprint(article: BabyLoveArticle): Promise<string> {
  return sha256Hex(JSON.stringify({
    id: article.id,
    title: article.title,
    slug: article.slug,
    contentMarkdown: article.contentMarkdown,
    metaDescription: article.metaDescription,
    excerpt: article.excerpt,
    languageCode: article.languageCode,
    createdAt: article.createdAt,
  }));
}

function inferClassification(article: BabyLoveArticle): { phase: 'drive-there' | 'game' | 'drive-home' | 'team-parent'; topic: string } {
  const haystack = `${article.title} ${article.metaDescription} ${article.excerpt}`.toLowerCase();
  if (/team parent|snack|fundrais|picture day|roster|carpool|volunteer/.test(haystack)) {
    return { phase: 'team-parent', topic: 'season-ops' };
  }
  if (/post[- ]?game|ride home|after (the )?game|loss|lost|mistake|bad game/.test(haystack)) {
    return { phase: 'drive-home', topic: 'communication' };
  }
  if (/tryout|registration|prepare|before (the )?game|pregame|travel (ball|team)|rec vs|specializ/.test(haystack)) {
    return { phase: 'drive-there', topic: /tryout/.test(haystack) ? 'tryouts' : 'rec-vs-travel' };
  }
  if (/equipment|bat|cleat|helmet|gear/.test(haystack)) return { phase: 'game', topic: 'equipment' };
  if (/rule|penalt|official|referee|umpire/.test(haystack)) return { phase: 'game', topic: 'rules-of-play' };
  if (/coach|say|conversation|communicat/.test(haystack)) return { phase: 'game', topic: 'communication' };
  return { phase: 'game', topic: 'game-day' };
}

function seoTitle(title: string): string {
  const clean = title.replace(/[\*_`#]+/g, '').trim();
  const expanded = clean.length >= 20 ? clean : `${clean}: a parent guide`;
  const shortened = expanded.length <= 60
    ? expanded
    : expanded.slice(0, 60).replace(/\s+\S*$/, '').replace(/[,:;.!?\s]+$/, '');
  return shortened.length >= 20 ? shortened : 'Youth sports guidance for parents';
}

function seoDescription(article: BabyLoveArticle): string {
  const candidate = article.metaDescription || article.excerpt;
  const fallback = `Practical guidance for parents navigating ${article.title.toLowerCase()} in youth sports, with clear next steps for the family.`;
  let value = (candidate || fallback).replace(/\s+/g, ' ').trim();
  if (value.length < 140) {
    value = `${value.replace(/[.\s]+$/, '')}. Practical guidance and clear next steps for youth sports parents and families.`;
  }
  return value.slice(0, 160).replace(/\s+\S*$/, '').replace(/[,:;\s]+$/, '');
}

function yamlQuote(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ')}"`;
}

export function buildBabyLoveArticleMarkdown(article: BabyLoveArticle, payloadSha256: string, importedAt: string): string {
  const classification = inferClassification(article);
  const description = seoDescription(article);
  const dek = (article.excerpt || description).slice(0, 220).replace(/\s+\S*$/, '').replace(/[,:;\s]+$/, '');
  const publishedAt = article.createdAt.slice(0, 10);
  return `---\n` +
    `title: ${yamlQuote(article.title)}\n` +
    `seoTitle: ${yamlQuote(seoTitle(article.title))}\n` +
    `seoDescription: ${yamlQuote(description)}\n` +
    `dek: ${yamlQuote(dek)}\n` +
    `topic: ${yamlQuote(classification.topic)}\n` +
    `format: "essay"\n` +
    `phase: ${yamlQuote(classification.phase)}\n` +
    `publishedAt: ${publishedAt}\n` +
    `draft: false\n` +
    `externalSource:\n` +
    `  provider: "babylovegrowth"\n` +
    `  articleId: ${yamlQuote(article.id)}\n` +
    `  payloadSha256: ${yamlQuote(payloadSha256)}\n` +
    `  importedAt: ${yamlQuote(importedAt)}\n` +
    `editorial:\n` +
    `  status: published\n` +
    `  reviewerNotes: "Automatically imported from authenticated BabyLoveGrowth publishing."\n` +
    `---\n\n${article.contentMarkdown}`;
}

async function findReceipt(db: D1Database, articleId: string, fingerprint: string): Promise<ReceiptRow | null> {
  return db.prepare(`SELECT id, status, provider_article_id, payload_sha256, received_at
    FROM external_article_receipts
    WHERE provider = ? AND provider_article_id = ? AND payload_sha256 = ?
    LIMIT 1`).bind(PROVIDER, articleId, fingerprint).first<ReceiptRow>();
}

async function createOrFindReceipt(db: D1Database, article: BabyLoveArticle, fingerprint: string, source: 'webhook' | 'api_reconciliation'): Promise<ReceiptRow> {
  const existing = await findReceipt(db, article.id, fingerprint);
  if (existing) return existing;
  const id = `ext_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO external_article_receipts
    (id, provider, provider_article_id, source, payload_sha256, provider_created_at, received_at, status, target_slug, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)`)
    .bind(id, PROVIDER, article.id, source, fingerprint, article.createdAt, now, article.slug, now)
    .run();
  return { id, status: 'received', provider_article_id: article.id, payload_sha256: fingerprint, received_at: now };
}

async function updateReceipt(db: D1Database, receiptId: string, status: string, fields: { route?: string; commitSha?: string; errorCode?: string } = {}): Promise<void> {
  const now = new Date().toISOString();
  await db.prepare(`UPDATE external_article_receipts
    SET status = ?, target_route = COALESCE(?, target_route), github_commit_sha = COALESCE(?, github_commit_sha),
        last_error_code = ?, published_at = CASE WHEN ? = 'published' THEN ? ELSE published_at END, updated_at = ?
    WHERE id = ?`)
    .bind(status, fields.route ?? null, fields.commitSha ?? null, fields.errorCode ?? null, status, now, now, receiptId)
    .run();
}

function githubHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'parent-coach-desk-babylove-importer',
  };
}

function existingProviderId(markdown: string): string | null {
  const block = markdown.match(/^externalSource:\r?\n((?: {2}[^\n]*\r?\n?)+)/m)?.[1] ?? '';
  const provider = block.match(/^ {2}provider:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  const articleId = block.match(/^ {2}articleId:\s*["']?([^"'\n]+)["']?\s*$/m)?.[1]?.trim();
  return provider === PROVIDER && articleId ? articleId : null;
}

async function upsertGitHubArticle(env: BabyLoveEnv, article: BabyLoveArticle, markdown: string): Promise<{ commitSha?: string; noChange: boolean }> {
  if (!env.GITHUB_TOKEN) throw new BabyLoveFailure('github_token_missing');
  const path = `src/content/articles/${article.slug}.md`;
  const headers = githubHeaders(env.GITHUB_TOKEN);
  let sha: string | undefined;
  const get = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`, {
    headers,
    signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
  });
  if (get.ok) {
    const file = await get.json() as GitHubFile;
    const current = decodeBase64(file.content);
    const currentProviderId = existingProviderId(current);
    if (currentProviderId !== article.id) throw new BabyLoveFailure('slug_collision');
    if (current === markdown) return { noChange: true };
    sha = file.sha;
  } else if (get.status !== 404) {
    throw new BabyLoveFailure(`github_read_${get.status}`);
  }

  const committerEmail = env.PUBLISH_COMMITTER_EMAIL?.trim() || 'parentcoachplaybook@gmail.com';
  const put = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Publish BabyLoveGrowth article ${article.id}: ${article.slug}`,
      content: encodeBase64(markdown),
      ...(sha ? { sha } : {}),
      branch: BRANCH,
      committer: { name: 'Parent Coach Desk Editorial', email: committerEmail },
    }),
    signal: AbortSignal.timeout(GITHUB_TIMEOUT_MS),
  });
  if (!put.ok) throw new BabyLoveFailure(`github_write_${put.status}`);
  const result = await put.json() as { commit?: { sha?: string } };
  return { commitSha: result.commit?.sha, noChange: false };
}

async function publishReceipt(env: BabyLoveEnv, receipt: ReceiptRow, article: BabyLoveArticle): Promise<void> {
  const db = env.PCD_OPS_DB;
  if (!db) throw new BabyLoveFailure('database_missing');
  if (!enabled(env.BABYLOVE_AUTOPUBLISH_ENABLED)) {
    await updateReceipt(db, receipt.id, 'held', { errorCode: 'autopublish_disabled' });
    return;
  }
  await updateReceipt(db, receipt.id, 'processing');
  try {
    const importedAt = receipt.received_at;
    const markdown = buildBabyLoveArticleMarkdown(article, receipt.payload_sha256, importedAt);
    const outcome = await upsertGitHubArticle(env, article, markdown);
    await updateReceipt(db, receipt.id, 'published', {
      route: `/${inferClassification(article).phase}/${article.slug}/`,
      commitSha: outcome.commitSha,
    });
    console.log(JSON.stringify({ event: 'babylove_article_published', article_id: article.id, receipt_id: receipt.id, no_change: outcome.noChange }));
  } catch (error) {
    const code = error instanceof BabyLoveFailure ? error.code : 'publish_failed';
    const quarantined = code === 'slug_collision' || code.startsWith('invalid_') || code === 'unsupported_language';
    await updateReceipt(db, receipt.id, quarantined ? 'quarantined' : 'retryable_failure', { errorCode: code });
    console.error(JSON.stringify({ event: 'babylove_article_failed', article_id: article.id, receipt_id: receipt.id, code }));
    throw error;
  }
}

async function acceptArticle(env: BabyLoveEnv, article: BabyLoveArticle, source: 'webhook' | 'api_reconciliation'): Promise<{ receipt: ReceiptRow; replay: boolean }> {
  if (!env.PCD_OPS_DB) throw new BabyLoveFailure('database_missing');
  const fingerprint = await articleFingerprint(article);
  const before = await findReceipt(env.PCD_OPS_DB, article.id, fingerprint);
  const receipt = before ?? await createOrFindReceipt(env.PCD_OPS_DB, article, fingerprint, source);
  return { receipt, replay: Boolean(before) };
}

export async function handleBabyLoveWebhook(request: Request, env: BabyLoveEnv, _context: ExecutionContext): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);
  if (!env.BABYLOVE_WEBHOOK_TOKEN || !env.PCD_OPS_DB) return json({ ok: false, error: 'integration_unavailable' }, 503);
  if (!(await secretsMatch(bearerCredential(request), env.BABYLOVE_WEBHOOK_TOKEN))) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') return json({ ok: false, error: 'json_required' }, 415);
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BYTES) return json({ ok: false, error: 'payload_too_large' }, 413);

  let raw: string;
  try {
    raw = await readBoundedText(request, MAX_WEBHOOK_BYTES);
  } catch (error) {
    if (error instanceof BabyLoveFailure && error.code === 'payload_too_large') {
      return json({ ok: false, error: error.code }, 413);
    }
    return json({ ok: false, error: 'body_unavailable' }, 400);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  let article: BabyLoveArticle;
  try {
    article = parseBabyLoveArticle(parsed);
  } catch (error) {
    const code = error instanceof BabyLoveFailure ? error.code : 'invalid_payload';
    return json({ ok: false, error: code }, 400);
  }

  try {
    const accepted = await acceptArticle(env, article, 'webhook');
    if (accepted.receipt.status !== 'published') {
      try {
        await publishReceipt(env, accepted.receipt, article);
      } catch {
        return json({ ok: false, error: 'publish_failed', retryable: true }, 503);
      }
    }
    return json({ ok: true, accepted: true, replayed: accepted.replay });
  } catch {
    return json({ ok: false, error: 'receipt_unavailable' }, 503);
  }
}

async function fetchApiJson(url: string, apiKey: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });
  if (!response.ok) throw new BabyLoveFailure(`api_${response.status}`);
  return response.json();
}

export async function reconcileBabyLoveArticles(env: BabyLoveEnv): Promise<{ scanned: number; published: number; skipped: number; failed: number }> {
  if (!enabled(env.BABYLOVE_AUTOPUBLISH_ENABLED)) return { scanned: 0, published: 0, skipped: 0, failed: 0 };
  if (!env.BABYLOVE_API_KEY || !env.PCD_OPS_DB || !env.GITHUB_TOKEN) throw new BabyLoveFailure('reconciliation_unavailable');
  const listingPayload = await fetchApiJson(API_BASE, env.BABYLOVE_API_KEY);
  const listingEnvelope = objectValue(listingPayload);
  const listing = Array.isArray(listingPayload)
    ? listingPayload
    : Array.isArray(listingEnvelope?.articles)
      ? listingEnvelope.articles
      : null;
  if (!listing) throw new BabyLoveFailure('api_list_invalid');
  let scanned = 0;
  let published = 0;
  let skipped = 0;
  let failed = 0;
  for (const summary of listing.slice(0, 20)) {
    const record = objectValue(summary);
    const id = idValue(record?.id);
    if (!id) { failed += 1; continue; }
    scanned += 1;
    try {
      const detail = await fetchApiJson(`${API_BASE}/${encodeURIComponent(id)}`, env.BABYLOVE_API_KEY);
      const article = parseBabyLoveArticle(detail);
      const accepted = await acceptArticle(env, article, 'api_reconciliation');
      if (accepted.receipt.status === 'published') {
        skipped += 1;
        continue;
      }
      await publishReceipt(env, accepted.receipt, article);
      published += 1;
    } catch (error) {
      failed += 1;
      const code = error instanceof BabyLoveFailure ? error.code : 'reconciliation_item_failed';
      console.error(JSON.stringify({ event: 'babylove_reconciliation_item_failed', article_id: id, code }));
    }
  }
  console.log(JSON.stringify({ event: 'babylove_reconciliation_completed', scanned, published, skipped, failed }));
  return { scanned, published, skipped, failed };
}
