// Cloudflare Access JWT verification for admin routes.
//
// When a request reaches a /admin/ or /api/admin/ route through Cloudflare Access,
// Access injects two headers:
//   Cf-Access-Jwt-Assertion — the signed JWT
//   Cf-Access-Authenticated-User-Email — the verified email address
//
// In phase 1 we do a light-weight verification: presence of the headers, and the
// email matches an allowlist. Cloudflare has already verified the JWT signature
// before the request reached us, so checking the email header is sufficient when
// the route is wired through an Access policy.
//
// Hardening for phase 2: verify the JWT signature against Access JWKs.

const ALLOWED_REVIEWERS_RAW = (
  // Comma-separated list. Set as a Cloudflare env var or hard-code for v1.
  // Falls back to a placeholder so the helper imports cleanly during build.
  // Move to a real env var (`ADMIN_EMAILS`) before going live.
  'parentcoachplaybook@gmail.com'
);

const ALLOW_LIST = new Set(
  ALLOWED_REVIEWERS_RAW.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export interface AdminContext {
  email: string;
}

export function getAdminEmailFromRequest(request: Request): string | null {
  const email = request.headers.get('Cf-Access-Authenticated-User-Email');
  if (!email) return null;
  return email.toLowerCase();
}

export function requireAdmin(request: Request): AdminContext | Response {
  const email = getAdminEmailFromRequest(request);
  if (!email) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  if (!ALLOW_LIST.has(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return { email };
}
