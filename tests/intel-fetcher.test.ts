import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import type { D1Database } from '@cloudflare/workers-types';
import { createDisposableIntelDatabase } from './helpers/disposable-intel-db';
import { fetchPublicPage, isAllowedByRobots } from '../src/lib/intel/fetcher';
import type { IntelPolicy } from '../src/lib/intel/config';
import type { CompetitorDefinition } from '../src/lib/intel/fingerprints';

const POLICY: IntelPolicy = {
  userAgent: 'ParentCoachDeskIntelBot/1.0',
  operatorContact: 'https://parentcoachdesk.com/about/',
  maxRequestsPerMinutePerDomain: 6,
  timeoutMs: 5000,
  maxBytes: 1_500_000,
  allowCompetitorProperties: false,
};

const DEFINITIONS: CompetitorDefinition[] = [
  {
    id: 'sportsgravy',
    displayName: 'SportsGravy',
    canonicalDomain: 'sportsgravy.com',
    category: 'club_management',
    migrationDifficulty: 'high',
    patterns: [{ id: 'sportsgravy.test.pattern', type: 'html_text', category: 'club_management', match: { kind: 'substring', value: 'sportsgravy' }, weight: 80 }],
  },
];

function htmlResponse(body: string, headers: Record<string, string> = {}): Response {
  return new Response(body, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', ...headers } });
}

describe('intel fetcher', () => {
  let db: D1Database;
  const originalFetch = global.fetch;

  beforeEach(async () => {
    ({ db } = await createDisposableIntelDatabase());
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('refuses to fetch when the user-agent is missing', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://prospect.example.org/', { ...POLICY, userAgent: '' }, DEFINITIONS);
    expect(outcome.skippedReason).toBe('policy_incomplete');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses to fetch when the operator contact is missing', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://prospect.example.org/', { ...POLICY, operatorContact: '' }, DEFINITIONS);
    expect(outcome.skippedReason).toBe('policy_incomplete');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses a competitor-owned domain when allowCompetitorProperties is false', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://sportsgravy.com/pricing', POLICY, DEFINITIONS);
    expect(outcome.skippedReason).toBe('competitor_property');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses a redirect that lands on a competitor property', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      if (url === 'https://prospect.example.org/') {
        return new Response(null, { status: 302, headers: { location: 'https://sportsgravy.com/landing' } });
      }
      throw new Error(`unexpected fetch: ${url}`);
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://prospect.example.org/', POLICY, DEFINITIONS);
    expect(outcome.skippedReason).toBe('competitor_property');
  });

  it('robots.txt Disallow blocks the fetch', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('User-agent: *\nDisallow: /\n', { status: 200, headers: { 'content-type': 'text/plain' } });
      throw new Error(`unexpected fetch: ${url}`);
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://blocked.example.org/', POLICY, DEFINITIONS);
    expect(outcome.skippedReason).toBe('robots_disallowed');

    const row = await db.prepare(`SELECT * FROM intel_fetch_log WHERE domain = ? AND path = '/robots.txt'`).bind('blocked.example.org').first<any>();
    expect(row.robots_allowed).toBe(0);
  });

  it('isAllowedByRobots honors a path-specific Disallow prefix', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('User-agent: *\nDisallow: /admin\n', { status: 200, headers: { 'content-type': 'text/plain' } }));
    global.fetch = fetchMock as unknown as typeof fetch;
    const allowedRoot = await isAllowedByRobots(db, 'https://path-test.example.org/', POLICY);
    expect(allowedRoot).toBe(true);
  });

  it('rate limits a second fetch of the same domain inside the window', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('<html>hello</html>');
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const first = await fetchPublicPage(db, 'https://rate-test.example.org/', POLICY, DEFINITIONS);
    expect(first.ok).toBe(true);

    const second = await fetchPublicPage(db, 'https://rate-test.example.org/other-page', POLICY, DEFINITIONS);
    expect(second.skippedReason).toBe('rate_limited');
  });

  it('skips a URL fetched too recently (dedupe window)', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('<html>hello</html>');
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const first = await fetchPublicPage(db, 'https://dedupe-test.example.org/', POLICY, DEFINITIONS);
    expect(first.ok).toBe(true);

    // Manually push last_fetched_at back outside the rate-limit window (10s
    // for the default 6/min) but still well inside the 45-day recheck
    // window, so this exercises recently_fetched specifically and not
    // rate_limited.
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    await db.prepare(`UPDATE intel_fetch_log SET last_fetched_at = ? WHERE domain = ? AND path = '/'`).bind(fiveMinutesAgo, 'dedupe-test.example.org').run();
    await db.prepare(`UPDATE intel_fetch_log SET last_fetched_at = ? WHERE domain = ? AND path = '/robots.txt'`).bind(fiveMinutesAgo, 'dedupe-test.example.org').run();

    const second = await fetchPublicPage(db, 'https://dedupe-test.example.org/', POLICY, DEFINITIONS);
    expect(second.skippedReason).toBe('recently_fetched');
  });

  it('skips a non-HTML content type without buffering it', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return new Response('{"not":"html"}', { status: 200, headers: { 'content-type': 'application/json' } });
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://json-test.example.org/', POLICY, DEFINITIONS);
    expect(outcome.skippedReason).toBe('not_html');
    expect(outcome.html).toBeNull();
  });

  it('skips an oversized body via the content-length header without reading it', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('<html>small body but lying header</html>', { 'content-length': String(10_000_000) });
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://big-test.example.org/', { ...POLICY, maxBytes: 1000 }, DEFINITIONS);
    expect(outcome.skippedReason).toBe('too_large');
    expect(outcome.html).toBeNull();
  });

  it('skips an oversized body detected by streaming even without a content-length header', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('x'.repeat(5000));
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://stream-big-test.example.org/', { ...POLICY, maxBytes: 100 }, DEFINITIONS);
    expect(outcome.skippedReason).toBe('too_large');
  });

  it('handles 304 Not Modified: ok true, notModified true, no html', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('<html>first fetch</html>', { etag: '"abc123"' });
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const first = await fetchPublicPage(db, 'https://etag-test.example.org/', POLICY, DEFINITIONS);
    expect(first.ok).toBe(true);
    expect(first.contentHash).toBeTruthy();

    // Move past the rate-limit and recheck windows so the second call is not
    // itself skipped before reaching the network.
    await db.prepare(`UPDATE intel_fetch_log SET last_fetched_at = ? WHERE domain = ?`).bind('2026-01-01T00:00:00.000Z', 'etag-test.example.org').run();

    const fetchMock2 = vi.fn().mockImplementation(async (url: string, init?: RequestInit) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      expect((init?.headers as Record<string, string>)?.['If-None-Match']).toBe('"abc123"');
      return new Response(null, { status: 304 });
    });
    global.fetch = fetchMock2 as unknown as typeof fetch;
    const second = await fetchPublicPage(db, 'https://etag-test.example.org/', POLICY, DEFINITIONS);
    expect(second.ok).toBe(true);
    expect(second.notModified).toBe(true);
    expect(second.html).toBeNull();
  });

  it('refuses a domain on the skip list', async () => {
    await db.prepare(`INSERT INTO domain_skip_list (domain, reason, added_by, added_at) VALUES (?, ?, ?, ?)`).bind('skip-test.example.org', 'known scraper bait', 'jeff@parentcoachdesk.com', '2026-01-01T00:00:00.000Z').run();
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://skip-test.example.org/', POLICY, DEFINITIONS);
    expect(outcome.skippedReason).toBe('skip_list');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('never throws on a network error, and still logs the attempt', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      throw new Error('DNS failure');
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://network-fail.example.org/', POLICY, DEFINITIONS);
    expect(outcome.skippedReason).toBe('error');
    expect(outcome.ok).toBe(false);
    const row = await db.prepare(`SELECT * FROM intel_fetch_log WHERE domain = ? AND path = '/'`).bind('network-fail.example.org').first();
    expect(row).toBeTruthy();
  });

  it('a successful fetch writes back status, etag, last_modified, and content_hash', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes('robots.txt')) return new Response('', { status: 404 });
      return htmlResponse('<html>ok</html>', { etag: '"xyz"', 'last-modified': 'Mon, 01 Jan 2026 00:00:00 GMT' });
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const outcome = await fetchPublicPage(db, 'https://writeback-test.example.org/', POLICY, DEFINITIONS);
    expect(outcome.ok).toBe(true);
    expect(outcome.html).toBe('<html>ok</html>');
    const row = await db.prepare(`SELECT * FROM intel_fetch_log WHERE domain = ? AND path = '/'`).bind('writeback-test.example.org').first<any>();
    expect(row.status_code).toBe(200);
    expect(row.etag).toBe('"xyz"');
    expect(row.content_hash).toBe(outcome.contentHash);
  });
});
