// Cloudflare Access authentication for admin routes.
//
// When a request reaches a /admin/ or /api/admin/ route through Cloudflare Access,
// Access injects two headers:
//   Cf-Access-Jwt-Assertion — the signed JWT
//   Cf-Access-Authenticated-User-Email — the verified email address
// and the browser also carries a CF_Authorization cookie holding the same JWT.
//
// The JWT is pulled from the Cf-Access-Jwt-Assertion header
// or the CF_Authorization cookie and its RS256 signature is checked against the
// Access team's published keys, along with iss, aud, and exp. The email is read
// only from the verified payload. Headers alone prove nothing in this mode, so
// a spoofed Cf-Access-Authenticated-User-Email gets nowhere.
//
// Missing verification configuration fails closed. An unset variable is a
// service configuration error, never permission to trust unsigned identity.
//
// The allowlist is read from the ADMIN_EMAILS env var (comma-separated) and is
// enforced in both modes. Falls back to a single hardcoded address only if the
// var is missing, so local dev and build never fail outright.

import { verifyAccessJwt, type AccessJwtConfig } from './access-jwt';

const FALLBACK_ALLOWED_EMAILS = 'parentcoachplaybook@gmail.com';

function parseAllowList(raw: string): Set<string> {
  return new Set(
    raw.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean),
  );
}

export interface AdminContext {
  email: string;
  /** True when the email came from a signature-verified Access JWT. */
  verified: boolean;
}

export interface AdminAuthEnv extends AccessJwtConfig {
  ADMIN_EMAILS?: string;
}

/**
 * Decode a base64url string (no padding) to a UTF-8 string.
 */
/** Pull the raw Access JWT from the assertion header or the CF_Authorization cookie. */
export function getAccessToken(request: Request): string | null {
  const assertion = request.headers.get('Cf-Access-Jwt-Assertion');
  if (assertion) return assertion.trim();
  const cookieHeader = request.headers.get('cookie') ?? '';
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * LEGACY ONLY. Read the email claim from the CF_Authorization cookie's JWT
 * payload without verifying the signature. Reachable only when
 * ACCESS_TEAM_DOMAIN / ACCESS_AUD are unset. Returns null on any parse
 * failure or if the JWT is expired.
 */
/** True when the env carries everything verifyAccessJwt needs. */
export function accessVerificationConfigured(env?: AdminAuthEnv): boolean {
  return Boolean(env?.ACCESS_TEAM_DOMAIN?.trim() && env?.ACCESS_AUD?.trim());
}

export interface IdentityResult {
  email: string | null;
  verified: boolean;
}

/**
 * Resolve the caller's admin identity. Does NOT enforce the allowlist — use
 * requireAdmin for the full gate.
 */
export async function getAdminIdentity(
  request: Request,
  env?: AdminAuthEnv,
): Promise<IdentityResult> {
  if (!accessVerificationConfigured(env)) {
    console.error('[admin-auth] ACCESS_TEAM_DOMAIN/ACCESS_AUD not set; refusing authentication');
    return { email: null, verified: false };
  }
  const token = getAccessToken(request);
  if (!token) return { email: null, verified: false };
  const result = await verifyAccessJwt(token, {
    teamDomain: env!.ACCESS_TEAM_DOMAIN!,
    aud: env!.ACCESS_AUD!,
  });
  if (!result.ok) {
    console.warn('[admin-auth] Access JWT rejected:', result.reason);
    return { email: null, verified: false };
  }
  return { email: result.claims.email, verified: true };
}

/**
 * Back-compat shim for callers that only want the email string.
 * Prefer getAdminIdentity, which also reports whether the email was verified.
 */
export async function getAdminEmailFromRequest(
  request: Request,
  env?: AdminAuthEnv,
): Promise<string | null> {
  return (await getAdminIdentity(request, env)).email;
}

/**
 * Full admin gate: resolves the caller's identity (signature-verified when the
 * Access vars are configured) and checks it against ADMIN_EMAILS.
 *
 * Async as of 2026-07-15 — signature verification needs a key fetch. Callers
 * must await it.
 */
export async function requireAdmin(
  request: Request,
  env?: AdminAuthEnv,
): Promise<AdminContext | Response> {
  if (!accessVerificationConfigured(env)) {
    return new Response(JSON.stringify({ ok: false, error: 'admin authentication not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  const { email, verified } = await getAdminIdentity(request, env);
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
  return { email, verified };
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
