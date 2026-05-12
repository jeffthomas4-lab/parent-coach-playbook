// URL liveness checker. Used at submit time and by a weekly cron sweep.
//
// Strategy: HEAD with a short timeout. Many small-camp WordPress sites
// reject HEAD or return wrong status, so we fall back to GET on 4xx/5xx.
// We only care about reachable vs. dead — not full HTML.

import type { UrlHealthStatus } from './camps-db';

export interface UrlHealthResult {
  status: UrlHealthStatus;
  statusCode: number | null;
  finalUrl: string | null;
}

const DEFAULT_TIMEOUT_MS = 6000;

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
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { status: 'dead', statusCode: null, finalUrl: null };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { status: 'dead', statusCode: null, finalUrl: null };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Try HEAD first — cheap, no body.
    let res = await fetch(url.toString(), {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'parentcoachdesk.com link checker' },
    });

    // Some servers don't support HEAD properly. Fall back to GET on 4xx/5xx.
    if (res.status >= 400) {
      res = await fetch(url.toString(), {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'parentcoachdesk.com link checker' },
      });
    }

    clearTimeout(timer);

    const code = res.status;
    const finalUrl = res.url || url.toString();
    if (code >= 200 && code < 300) {
      return { status: 'live', statusCode: code, finalUrl };
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
