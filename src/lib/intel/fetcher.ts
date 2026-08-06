// Polite, bounded fetch of a single public page for the competitor
// intelligence crawler.
//
// Every guard here exists because of Jeff's policy decision, enforced in
// code rather than left as a doc someone can forget to read: prospect org
// websites may be crawled on a schedule, competitor-owned properties may
// never be fetched by an automated run, and every fetch this module makes
// is public, robots-respecting, rate-limited, and declares who is asking.
//
// Nothing in fetchPublicPage or isAllowedByRobots ever throws. Every
// failure path returns a FetchOutcome with a skippedReason instead, because
// one bad target website can never be allowed to take down a sweep of forty
// others.
//
// KNOWN SIMPLIFICATION: robots.txt is fetched and parsed per domain, and the
// resulting allow/disallow decision is cached at domain granularity (not
// per-path) both in memory and in intel_fetch_log's robots_allowed column.
// The schema has no column to persist the parsed rule set itself (only a
// content_hash), so a cold Worker isolate that sees a same-day cached check
// trusts that coarse decision rather than re-fetching robots.txt to
// re-derive a path-specific answer. This subsystem only ever fetches one
// URL per organization (its stored website_url), so domain-level and
// URL-level are the same thing in practice for this crawler's real usage.

import type { D1Database } from '@cloudflare/workers-types';
import { isDomainSkipListed } from '../domain-skip-list';
import { log } from '../log';
import { RECHECK_AFTER_DAYS, isCompetitorProperty, registrableDomain, type IntelPolicy } from './config';
import type { CompetitorDefinition } from './fingerprints';

export type FetchSkipReason =
  | 'robots_disallowed'
  | 'rate_limited'
  | 'competitor_property'
  | 'recently_fetched'
  | 'not_html'
  | 'too_large'
  | 'timeout'
  | 'error'
  | 'policy_incomplete'
  | 'skip_list';

export interface FetchOutcome {
  ok: boolean;
  status: number | null;
  finalUrl: string | null;
  html: string | null;
  headers: Record<string, string>;
  contentHash: string | null;
  notModified: boolean;
  skippedReason: FetchSkipReason | null;
}

interface FetchLogRow {
  domain: string;
  path: string;
  last_fetched_at: string;
  status_code: number | null;
  etag: string | null;
  last_modified: string | null;
  content_hash: string | null;
  robots_allowed: 0 | 1;
  robots_checked_at: string | null;
}

const ROBOTS_PATH = '/robots.txt';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const RECHECK_AFTER_MS = RECHECK_AFTER_DAYS * ONE_DAY_MS;
const MAX_REDIRECTS = 5;

function emptyOutcome(reason: FetchSkipReason | null, ok = false): FetchOutcome {
  return { ok, status: null, finalUrl: null, html: null, headers: {}, contentHash: null, notModified: false, skippedReason: reason };
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function safeUrl(url: string): URL | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null;
    return parsed;
  } catch {
    return null;
  }
}

function pathOf(url: URL): string {
  return url.pathname || '/';
}

function policyIsIncomplete(policy: IntelPolicy): boolean {
  return !policy.userAgent || !policy.operatorContact;
}

async function getFetchLogRow(db: D1Database, domain: string, path: string): Promise<FetchLogRow | null> {
  const row = await db.prepare(`SELECT * FROM intel_fetch_log WHERE domain = ? AND path = ?`).bind(domain, path).first<FetchLogRow>();
  return row ?? null;
}

async function upsertFetchLog(db: D1Database, row: Omit<FetchLogRow, never>): Promise<void> {
  await db
    .prepare(
      `INSERT INTO intel_fetch_log (domain, path, last_fetched_at, status_code, etag, last_modified, content_hash, robots_allowed, robots_checked_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(domain, path) DO UPDATE SET
         last_fetched_at = excluded.last_fetched_at,
         status_code = excluded.status_code,
         etag = excluded.etag,
         last_modified = excluded.last_modified,
         content_hash = excluded.content_hash,
         robots_allowed = excluded.robots_allowed,
         robots_checked_at = excluded.robots_checked_at`,
    )
    .bind(
      row.domain,
      row.path,
      row.last_fetched_at,
      row.status_code,
      row.etag,
      row.last_modified,
      row.content_hash,
      row.robots_allowed,
      row.robots_checked_at,
    )
    .run();
}

// ---------------------------------------------------------------------------
// robots.txt: a conservative, in-memory-cached, once-a-day-per-domain parser.
// ---------------------------------------------------------------------------

interface RobotsRules {
  disallow: string[];
  allow: string[];
}

const ALLOW_ALL: RobotsRules = { disallow: [], allow: [] };

interface RobotsCacheEntry {
  rules: RobotsRules;
  fetchedAt: number;
}

const robotsCache = new Map<string, RobotsCacheEntry>();

/** Splits robots.txt into User-agent groups and returns the best-matching group's rules. */
function parseRobots(text: string, userAgent: string): RobotsRules {
  const token = userAgent.toLowerCase();
  const groups: Array<{ agents: string[]; disallow: string[]; allow: string[] }> = [];
  let current: { agents: string[]; disallow: string[]; allow: string[] } | null = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.split('#')[0]!.trim();
    if (!line) continue;
    const sepIndex = line.indexOf(':');
    if (sepIndex === -1) continue;
    const field = line.slice(0, sepIndex).trim().toLowerCase();
    const value = line.slice(sepIndex + 1).trim();

    if (field === 'user-agent') {
      // A fresh User-agent line starts a new group unless the previous line
      // was also a User-agent line (several UAs sharing one rule block).
      if (!current || current.disallow.length > 0 || current.allow.length > 0) {
        current = { agents: [], disallow: [], allow: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
    } else if (field === 'disallow' && current) {
      current.disallow.push(value);
    } else if (field === 'allow' && current) {
      current.allow.push(value);
    }
    // crawl-delay, sitemap, and anything else are ignored on purpose: this
    // parser only ever answers "is this path allowed", nothing more.
  }

  const specific = groups.find((group) => group.agents.some((agent) => agent !== '*' && token.includes(agent)));
  const wildcard = groups.find((group) => group.agents.includes('*'));
  const chosen = specific ?? wildcard ?? null;
  if (!chosen) return ALLOW_ALL;
  return { disallow: chosen.disallow, allow: chosen.allow };
}

/** Longest-matching-prefix wins; an Allow rule beats a Disallow of equal or shorter length. */
function evaluateRobots(rules: RobotsRules, path: string): boolean {
  let bestDisallow = -1;
  let bestAllow = -1;
  for (const rule of rules.disallow) {
    if (rule === '') continue; // an empty Disallow value means "nothing is disallowed"
    if (path.startsWith(rule) && rule.length > bestDisallow) bestDisallow = rule.length;
  }
  for (const rule of rules.allow) {
    if (rule === '') {
      if (bestAllow < 0) bestAllow = 0;
      continue;
    }
    if (path.startsWith(rule) && rule.length > bestAllow) bestAllow = rule.length;
  }
  if (bestDisallow === -1) return true;
  return bestAllow >= bestDisallow;
}

/** robots.txt files are tiny; 128 KB is generous. Anything bigger fails closed. */
const ROBOTS_MAX_BYTES = 128 * 1024;

async function fetchRobotsText(
  domain: string,
  policy: IntelPolicy,
  definitions: CompetitorDefinition[],
): Promise<{ statusCode: number | null; text: string | null; contentHash: string | null }> {
  // Same manual-redirect, competitor-property-aware hop resolution as the
  // page fetch uses, so a robots.txt redirect can never slip an ungated
  // request to a competitor host through -- a hop landing on (or starting
  // on) a blocked host fails closed, same as any other ambiguous outcome.
  const hop = await controlledFetch(`https://${domain}${ROBOTS_PATH}`, policy, definitions, { accept: 'text/plain,*/*' });

  if (hop.blockedCompetitor || hop.timedOut || hop.networkError || !hop.response) {
    return { statusCode: null, text: null, contentHash: null };
  }

  const response = hop.response;
  if (response.status === 404) {
    // No robots.txt at all is the standard "no restrictions" signal, not ambiguous.
    return { statusCode: response.status, text: '', contentHash: null };
  }
  if (!response.ok) {
    // Any other non-2xx (5xx, other 4xx) is ambiguous: we cannot safely
    // read the real rules, so this comes back as text: null and the
    // caller treats that as disallowed.
    return { statusCode: response.status, text: null, contentHash: null };
  }

  // Streaming-capped, same helper the page fetch uses, just with a much
  // smaller ceiling. A truncated robots.txt is never parsed -- exceeding
  // the cap fails closed (disallowed) instead of reading a partial file.
  const body = await readBodyCapped(response, ROBOTS_MAX_BYTES);
  if (body.tooLarge || body.text === null) {
    return { statusCode: response.status, text: null, contentHash: null };
  }

  const contentHash = await sha256Hex(body.text);
  return { statusCode: response.status, text: body.text, contentHash };
}

/**
 * True when policy.userAgent is allowed to fetch `url` per that domain's
 * robots.txt. Fetches robots.txt at most once a day per domain (persisted
 * via intel_fetch_log's (domain, '/robots.txt') row and mirrored in an
 * in-process cache); any parse or fetch failure is treated as disallowed,
 * per the "when ambiguous, treat as disallowed" instruction.
 */
export async function isAllowedByRobots(
  db: D1Database,
  url: string,
  policy: IntelPolicy,
  definitions: CompetitorDefinition[],
): Promise<boolean> {
  if (policyIsIncomplete(policy)) return false;
  const parsed = safeUrl(url);
  if (!parsed) return false;
  const domain = parsed.hostname.toLowerCase();
  const path = pathOf(parsed);
  const now = Date.now();

  const cached = robotsCache.get(domain);
  if (cached && now - cached.fetchedAt < ONE_DAY_MS) {
    return evaluateRobots(cached.rules, path);
  }

  const existingRow = await getFetchLogRow(db, domain, ROBOTS_PATH);
  const checkedRecently = !!existingRow?.robots_checked_at && now - Date.parse(existingRow.robots_checked_at) < ONE_DAY_MS;
  if (checkedRecently && !cached) {
    // Checked within the last day from another isolate/run: trust the
    // persisted coarse decision instead of hitting the network again.
    return existingRow!.robots_allowed === 1;
  }

  const fetched = await fetchRobotsText(domain, policy, definitions);
  const rules = fetched.text !== null ? parseRobots(fetched.text, policy.userAgent) : null;
  const allowed = rules ? evaluateRobots(rules, path) : false;
  const nowIso = new Date(now).toISOString();

  if (rules) robotsCache.set(domain, { rules, fetchedAt: now });

  await upsertFetchLog(db, {
    domain,
    path: ROBOTS_PATH,
    last_fetched_at: nowIso,
    status_code: fetched.statusCode,
    etag: null,
    last_modified: null,
    content_hash: fetched.contentHash,
    robots_allowed: allowed ? 1 : 0,
    robots_checked_at: nowIso,
  });

  return allowed;
}

// ---------------------------------------------------------------------------
// The controlled fetch itself: redirect-aware, competitor-property-aware.
// ---------------------------------------------------------------------------

interface Hop {
  response: Response | null;
  finalUrl: string;
  blockedCompetitor: boolean;
  timedOut: boolean;
  networkError: boolean;
}

async function controlledFetch(
  startUrl: string,
  policy: IntelPolicy,
  definitions: CompetitorDefinition[],
  opts: { accept: string; conditionalHeaders?: Record<string, string> },
): Promise<Hop> {
  let currentUrl = startUrl;
  const conditionalHeaders = opts.conditionalHeaders ?? {};

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const parsed = safeUrl(currentUrl);
    if (!parsed) return { response: null, finalUrl: currentUrl, blockedCompetitor: false, timedOut: false, networkError: true };

    if (isCompetitorProperty(parsed.hostname, definitions) && !policy.allowCompetitorProperties) {
      return { response: null, finalUrl: currentUrl, blockedCompetitor: true, timedOut: false, networkError: false };
    }

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': policy.userAgent,
          Accept: opts.accept,
          ...(hop === 0 ? conditionalHeaders : {}),
        },
        signal: AbortSignal.timeout(policy.timeoutMs),
      });
    } catch (err) {
      const name = (err as { name?: string } | undefined)?.name;
      const timedOut = name === 'TimeoutError' || name === 'AbortError';
      return { response: null, finalUrl: currentUrl, blockedCompetitor: false, timedOut, networkError: !timedOut };
    }

    const isRedirect = response.status >= 300 && response.status < 400;
    if (isRedirect) {
      const location = response.headers.get('location');
      if (!location) return { response, finalUrl: currentUrl, blockedCompetitor: false, timedOut: false, networkError: false };
      try {
        currentUrl = new URL(location, currentUrl).toString();
      } catch {
        return { response: null, finalUrl: currentUrl, blockedCompetitor: false, timedOut: false, networkError: true };
      }
      continue;
    }

    return { response, finalUrl: currentUrl, blockedCompetitor: false, timedOut: false, networkError: false };
  }

  return { response: null, finalUrl: currentUrl, blockedCompetitor: false, timedOut: false, networkError: true };
}

async function readBodyCapped(response: Response, maxBytes: number): Promise<{ text: string | null; tooLarge: boolean }> {
  const reader = response.body?.getReader?.();
  if (!reader) {
    const text = await response.text();
    if (new TextEncoder().encode(text).length > maxBytes) return { text: null, tooLarge: true };
    return { text, tooLarge: false };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        return { text: null, tooLarge: true };
      }
      chunks.push(value);
    }
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { text: new TextDecoder('utf-8').decode(merged), tooLarge: false };
}

function headersToRecord(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

/**
 * Fetches one public page, applying every politeness and policy gate in
 * order: policy completeness, the skip list, competitor-property refusal,
 * the per-domain rate limit, the recently-fetched dedupe window, and
 * robots.txt. Only after all of those pass does it make an outbound
 * request, following redirects manually so a hop into a competitor
 * property can be refused mid-chain instead of only after the fact.
 *
 * Never throws. Always writes back to intel_fetch_log for a "completed
 * attempt" (a real outbound request was made, or robots.txt explicitly
 * refused it) so the rate limiter and dedupe window work on the next call
 * even when this one failed. Rate-limited and recently-fetched refusals are
 * derived FROM the log and do not write to it again.
 */
export async function fetchPublicPage(
  db: D1Database,
  url: string,
  policy: IntelPolicy,
  definitions: CompetitorDefinition[],
): Promise<FetchOutcome> {
  try {
    if (policyIsIncomplete(policy)) return emptyOutcome('policy_incomplete');

    const parsed = safeUrl(url);
    if (!parsed) return emptyOutcome('error');
    const domain = registrableDomain(url);
    if (!domain) return emptyOutcome('error');
    const path = pathOf(parsed);

    if (await isDomainSkipListed(db, domain)) return emptyOutcome('skip_list');

    if (isCompetitorProperty(parsed.hostname, definitions) && !policy.allowCompetitorProperties) {
      return emptyOutcome('competitor_property');
    }

    const minGapMs = 60_000 / policy.maxRequestsPerMinutePerDomain;
    const lastDomainFetch = await db
      .prepare(`SELECT MAX(last_fetched_at) AS last_fetched_at FROM intel_fetch_log WHERE domain = ?`)
      .bind(domain)
      .first<{ last_fetched_at: string | null }>();
    if (lastDomainFetch?.last_fetched_at) {
      const elapsed = Date.now() - Date.parse(lastDomainFetch.last_fetched_at);
      if (elapsed < minGapMs) return emptyOutcome('rate_limited');
    }

    const existing = await getFetchLogRow(db, domain, path);
    if (existing?.last_fetched_at) {
      const elapsed = Date.now() - Date.parse(existing.last_fetched_at);
      if (elapsed < RECHECK_AFTER_MS) return emptyOutcome('recently_fetched');
    }

    const robotsAllowed = await isAllowedByRobots(db, url, policy, definitions);
    if (!robotsAllowed) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: new Date().toISOString(),
        status_code: null,
        etag: existing?.etag ?? null,
        last_modified: existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 0,
        robots_checked_at: new Date().toISOString(),
      });
      return emptyOutcome('robots_disallowed');
    }

    const conditionalHeaders: Record<string, string> = {};
    if (existing?.etag) conditionalHeaders['If-None-Match'] = existing.etag;
    if (existing?.last_modified) conditionalHeaders['If-Modified-Since'] = existing.last_modified;

    const hop = await controlledFetch(url, policy, definitions, { accept: 'text/html,application/xhtml+xml', conditionalHeaders });

    if (hop.blockedCompetitor) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: new Date().toISOString(),
        status_code: null,
        etag: existing?.etag ?? null,
        last_modified: existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 1,
        robots_checked_at: new Date().toISOString(),
      });
      return emptyOutcome('competitor_property');
    }

    if (hop.timedOut || hop.networkError || !hop.response) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: new Date().toISOString(),
        status_code: null,
        etag: existing?.etag ?? null,
        last_modified: existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 1,
        robots_checked_at: new Date().toISOString(),
      });
      return emptyOutcome(hop.timedOut ? 'timeout' : 'error');
    }

    const response = hop.response;
    const nowIso = new Date().toISOString();

    if (response.status === 304) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: nowIso,
        status_code: 304,
        etag: response.headers.get('etag') ?? existing?.etag ?? null,
        last_modified: response.headers.get('last-modified') ?? existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 1,
        robots_checked_at: nowIso,
      });
      return {
        ok: true,
        status: 304,
        finalUrl: hop.finalUrl,
        html: null,
        headers: headersToRecord(response.headers),
        contentHash: existing?.content_hash ?? null,
        notModified: true,
        skippedReason: null,
      };
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().includes('text/html')) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: nowIso,
        status_code: response.status,
        etag: existing?.etag ?? null,
        last_modified: existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 1,
        robots_checked_at: nowIso,
      });
      return emptyOutcome('not_html');
    }

    const contentLengthHeader = response.headers.get('content-length');
    if (contentLengthHeader && Number(contentLengthHeader) > policy.maxBytes) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: nowIso,
        status_code: response.status,
        etag: existing?.etag ?? null,
        last_modified: existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 1,
        robots_checked_at: nowIso,
      });
      return emptyOutcome('too_large');
    }

    const body = await readBodyCapped(response, policy.maxBytes);
    if (body.tooLarge || body.text === null) {
      await upsertFetchLog(db, {
        domain,
        path,
        last_fetched_at: nowIso,
        status_code: response.status,
        etag: existing?.etag ?? null,
        last_modified: existing?.last_modified ?? null,
        content_hash: existing?.content_hash ?? null,
        robots_allowed: 1,
        robots_checked_at: nowIso,
      });
      return emptyOutcome('too_large');
    }

    const contentHash = await sha256Hex(body.text);
    await upsertFetchLog(db, {
      domain,
      path,
      last_fetched_at: nowIso,
      status_code: response.status,
      etag: response.headers.get('etag'),
      last_modified: response.headers.get('last-modified'),
      content_hash: contentHash,
      robots_allowed: 1,
      robots_checked_at: nowIso,
    });

    return {
      ok: response.ok,
      status: response.status,
      finalUrl: hop.finalUrl,
      html: body.text,
      headers: headersToRecord(response.headers),
      contentHash,
      notModified: false,
      skippedReason: null,
    };
  } catch (err) {
    log('error', { requestId: crypto.randomUUID(), route: 'lib/intel/fetcher', action: 'fetch_public_page_unhandled', error: err });
    return emptyOutcome('error');
  }
}
