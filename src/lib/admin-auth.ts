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
//
// The allowlist is read from the ADMIN_EMAILS Cloudflare Pages env var
// (comma-separated). Falls back to a single hardcoded address only if that var
// is missing — that fallback exists so local dev and build never fail outright,
// but production should always set ADMIN_EMAILS.

const FALLBACK_ALLOWED_EMAILS = 'parentcoachplaybook@gmail.com';

function parseAllowList(raw: string): Set<string> {
  return new Set(
    raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean),
  );
}

export interface AdminContext {
  email: string;
}

/**
 * Decode a base64url string (no padding) to a UTF-8 string.
 */
function b64urlDecode(input: string): string {
  const pad = input.length % 4 === 2 ? '==' : input.length % 4 === 3 ? '=' : '';
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  // atob exists in the Workers runtime.
  return atob(b64);
}

/**
 * Read the email claim from the CF_Authorization cookie's JWT payload.
 *
 * Important security note: this decodes the JWT without verifying its
 * signature. We rely on Cloudflare Access being the only entity that can mint
 * a CF_Authorization cookie for parentcoachplaybook.com (browsers enforce
 * cookie domain scoping, so foreign sites cannot set this cookie). For phase 2
 * we should verify the signature against the Access JWKs.
 *
 * Returns null on any parse failure or if the JWT is expired.
 */
function getAdminEmailFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') ?? '';
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(b64urlDecode(parts[1])) as { email?: string; exp?: number };
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    if (typeof payload.email === 'string' && payload.email.includes('@')) {
      return payload.email.toLowerCase();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Pull the verified admin email from the Cloudflare Access header. If that
 * header is missing (which happens in some Access path configurations on
 * Cloudflare Pages), fall back to decoding the CF_Authorization cookie.
 *
 * Returns null if neither source yields an email — does NOT enforce the
 * allowlist. Use requireAdmin for full auth + allowlist enforcement.
 */
export function getAdminEmailFromRequest(request: Request): string | null {
  const headerEmail = request.headers.get('Cf-Access-Authenticated-User-Email');
  if (headerEmail) return headerEmail.toLowerCase();
  return getAdminEmailFromCookie(request);
}

/**
 * Full admin gate: pulls the verified email from the Access header and checks
 * it against ADMIN_EMAILS (or the fallback). Pass `env` from the route handler
 * so we can read the Cloudflare Pages env var.
 */
export function requireAdmin(
  request: Request,
  env?: { ADMIN_EMAILS?: string },
): AdminContext | Response {
  const email = getAdminEmailFromRequest(request);
  if (!email) {
    return new Response(JSON.stringify({ ok: false, error: 'unauthenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  const allowList = parseAllowList(env?.ADMIN_EMAILS ?? FALLBACK_ALLOWED_EMAILS);
  if (!allowList.has(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return { email };
}

/**
 * Verify the request's Origin header matches the site's own host. Defends
 * against cross-site request forgery on admin POST endpoints — even with
 * Cloudflare Access in front, a malicious page elsewhere can't trick a
 * logged-in admin's browser into submitting because the Origin will be wrong.
 *
 * Returns null on success, or a Response on failure.
 */
export function requireSameOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin');
  if (!origin) {
    // No Origin header: most browsers send one on POST. Treat absence as suspicious.
    // We allow it for fetch from server-to-server (no Origin) only if there's a Referer match.
    const referer = request.headers.get('referer');
    if (!referer) {
      return new Response(JSON.stringify({ ok: false, error: 'missing origin' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
    try {
      const refUrl = new URL(referer);
      const reqUrl = new URL(request.url);
      if (refUrl.host !== reqUrl.host) {
        return new Response(JSON.stringify({ ok: false, error: 'cross-origin referer' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      return null;
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'bad referer' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
  }
  try {
    const originHost = new URL(origin).host;
    const requestHost = new URL(request.url).host;
    if (originHost !== requestHost) {
      return new Response(JSON.stringify({ ok: false, error: 'cross-origin' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }
    return null;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'bad origin' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
