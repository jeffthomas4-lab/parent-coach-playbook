// URL liveness checker. Used at submit time and by a weekly cron sweep.
//
// Strategy: HEAD with a short timeout. Many small-camp WordPress sites
// reject HEAD or return wrong status, so we fall back to GET on 4xx/5xx.
// We only care about reachable vs. dead — not full HTML.

import type { UrlHealthStatus } from './camps-db';
import { normalizeExternalHttpUrl } from './public-input';

export interface UrlHealthResult {
  status: UrlHealthStatus;
  statusCode: number | null;
  finalUrl: string | null;
}

const DEFAULT_TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 5;

async function fetchWithValidatedRedirects(
  startUrl: string,
  init: RequestInit,
): Promise<{ response: Response; finalUrl: string; redirected: boolean }> {
  let current = normalizeExternalHttpUrl(startUrl);
  if (!current) throw new Error('URL is required');
  let redirected = false;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const response = await fetch(current, { ...init, redirect: 'manual' });
    if (response.status < 300 || response.status >= 400) {
      return { response, finalUrl: current, redirected };
    }

    const location = response.headers.get('location');
    if (!location) return { response, finalUrl: current, redirected };
    if (hop === MAX_REDIRECTS) throw new Error('too many redirects');

    const resolved = new URL(location, current).toString();
    current = normalizeExternalHttpUrl(resolved);
    if (!current) throw new Error('redirect URL is invalid');
    redirected = true;
  }

  throw new Error('too many redirects');
}

/**
 * Check whether a URL is reachable. Returns a normalized health status.
 *
 * Mapping:
 *   2xx          → live
 *   3xx (final)  → redirect
 *   4xx / 5xx    → dead
 *   network err  → dead
 *   abort        → timeout
 *
 * Note: Cloudflare Workers fetch follows redirects by default, so a 3xx
 * landing on a 2xx ends up as 'live'. We only mark 'redirect' if the
 * final response itself is 3xx (rare, e.g., redirect loop).
 */
export async function checkUrlHealth(
  rawUrl: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<UrlHealthResult> {
  let normalizedUrl: string | null;
  try {
    normalizedUrl = normalizeExternalHttpUrl(rawUrl);
  } catch {
    return { status: 'dead', statusCode: null, finalUrl: null };
  }
  if (!normalizedUrl) return { status: 'dead', statusCode: null, finalUrl: null };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Try HEAD first — cheap, no body.
    let result = await fetchWithValidatedRedirects(normalizedUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'parentcoachdesk.com link checker' },
    });

    // Some servers don't support HEAD properly. Fall back to GET on 4xx/5xx.
    if (result.response.status >= 400) {
      result = await fetchWithValidatedRedirects(normalizedUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': 'parentcoachdesk.com link checker' },
      });
    }

    clearTimeout(timer);

    const code = result.response.status;
    const finalUrl = result.finalUrl;
    if (code >= 200 && code < 300) {
      return { status: result.redirected ? 'redirect' : 'live', statusCode: code, finalUrl };
    }
    if (code >= 300 && code < 400) {
      return { status: 'redirect', statusCode: code, finalUrl };
    }
    return { status: 'dead', statusCode: code, finalUrl };
  } catch (err) {
    clearTimeout(timer);
    const isAbort = err instanceof Error && err.name === 'AbortError';
    return {
      status: isAbort ? 'timeout' : 'dead',
      statusCode: null,
      finalUrl: null,
    };
  }
}
