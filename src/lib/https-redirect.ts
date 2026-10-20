// HTTP -> HTTPS at the Worker (2026-10-20 portfolio security audit, H3).
//
// http://parentcoachdesk.com answered 200 instead of redirecting, while
// www already 301s. Cloudflare custom domains pass plain-http requests
// through to the Worker, so the Worker issues the 301 itself. Modeled on
// MedConfRadar's site/worker.js isPlainHttp/httpsRedirect.
//
// Local dev hosts are left alone so `wrangler dev` / `astro dev` on
// http://localhost keep working.
//
// Coverage note: this only runs for requests that reach the Worker. With the
// current `assets.run_worker_first` list, prerendered static pages are served
// straight from the asset store and never reach this code, so a full fix for
// static pages still needs either `run_worker_first: true` or the zone-level
// "Always Use HTTPS" setting. See the PR description.

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1', '0.0.0.0']);

function isLocalHost(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname) || hostname.endsWith('.localhost');
}

export function isPlainHttp(request: Request, url: URL = new URL(request.url)): boolean {
  if (isLocalHost(url.hostname)) return false;
  if (url.protocol === 'http:') return true;
  if ((request.headers.get('X-Forwarded-Proto') ?? '').trim().toLowerCase() === 'http') return true;
  const visitor = request.headers.get('CF-Visitor');
  if (visitor) {
    try {
      const parsed = JSON.parse(visitor) as { scheme?: unknown };
      if (parsed && parsed.scheme === 'http') return true;
    } catch {
      // Malformed header: ignore it rather than redirect on bad input.
    }
  }
  return false;
}

// GET/HEAD get a 301 (what crawlers and the audit expect). Any other method
// gets a 308 so a misconfigured webhook POST is not silently turned into a GET.
export function httpsRedirect(url: URL, method = 'GET'): Response {
  const target = new URL(url.href);
  target.protocol = 'https:';
  target.port = '';
  const status = method === 'GET' || method === 'HEAD' ? 301 : 308;
  return new Response(null, { status, headers: { Location: target.href } });
}

/** Returns a 301 to the https URL when the request arrived over plain http, otherwise null. */
export function httpsRedirectFor(request: Request, url: URL = new URL(request.url)): Response | null {
  return isPlainHttp(request, url) ? httpsRedirect(url, request.method) : null;
}
