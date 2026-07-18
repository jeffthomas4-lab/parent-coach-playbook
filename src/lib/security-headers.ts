export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'sha256-KaUsJOX43utTgKBraenF9mW7aob/u5NQ5RHrytHNGPs=' 'sha256-7jM0mFGpXcqAf1xCf5Qt3LqYUrtVC06wbpBqjNbd0GQ=' 'sha256-M7BKkLD4+RHrQdpMGbPQ7bdchX1CAYh5a47OJQcODGI=' 'sha256-CxXgaUN/4H6r93PhYGVaQ63kVMDT3zxHOAiCtMOxlB4=' 'sha256-V88P4X0XR5ZRpkonKjzZr+TE/DZ1jUyHTY0f79llpTw=' https://static.cloudflareinsights.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://nominatim.openstreetmap.org https://app.kit.com https://static.cloudflareinsights.com https://cloudflareinsights.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://o4511599982346240.ingest.us.sentry.io",
  "frame-ancestors 'none'",
  "form-action 'self' https://app.kit.com",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

export const WORKER_SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Content-Security-Policy': CONTENT_SECURITY_POLICY,
};

export function withWorkerSecurityHeaders(response: Response, pathname: string): Response {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(WORKER_SECURITY_HEADERS)) {
    secured.headers.set(name, value);
  }

  if (
    pathname === '/admin'
    || pathname.startsWith('/admin/')
    || pathname === '/api/admin'
    || pathname.startsWith('/api/admin/')
    || pathname === '/trust'
    || pathname.startsWith('/trust/')
  ) {
    secured.headers.set('Cache-Control', 'private, no-store');
    secured.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else if (pathname === '/api' || pathname.startsWith('/api/')) {
    // API responses are dynamic and may contain request, operational, error or
    // authorization state. Individual public endpoints may become cacheable
    // only after a route-specific key/invalidation review.
    secured.headers.set('Cache-Control', 'no-store');
  } else if ((secured.headers.get('Content-Type') ?? '').toLowerCase().includes('text/html')) {
    // Conservative correctness baseline: browsers and intermediaries must
    // revalidate public HTML. Long-lived caching is reserved for versioned
    // assets until route-specific purge/version behavior is proved.
    secured.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  return secured;
}
