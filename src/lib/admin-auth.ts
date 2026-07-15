// Cloudflare Access authentication for admin routes.
//
// When a request reaches a /admin/ or /api/admin/ route through Cloudflare Access,
// Access injects two headers:
//   Cf-Access-Jwt-Assertion — the signed JWT
//   Cf-Access-Authenticated-User-Email — the verified email address
// and the browser also carries a CF_Authorization cookie holding the same JWT.
//
// Two modes, chosen by whether ACCESS_TEAM_DOMAIN and ACCESS_AUD are set:
//
// VERIFIED (both set): the JWT is pulled from the Cf-Access-Jwt-Assertion header
// or the CF_Authorization cookie and its RS256 signature is checked against the
// Access team's published keys, along with iss, aud, and exp. The email is read
// only from the verified payload. Headers alone prove nothing in this mode, so
// a spoofed Cf-Access-Authenticated-User-Email gets nowhere.
//
// LEGACY (either unset): the pre-2026-07-15 behavior — trust the Access header,
// fall back to decoding the cookie without checking its signature. This is the
// old hole, kept only so an unconfigured deploy does not lock the admin out on
// the way to setting the two vars. It logs a warning on every request, and the
// handoff treats setting the vars as the P0 item. Delete this branch once
// production has run verified for a week.
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
function b64urlDecode(input: string): string {
  const pad = input.length % 4 === 2 ? '==' : input.length % 4 === 3 ? '=' : '';
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  // atob exists in the Workers runtime.
  return atob(b64);
}

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
function getAdminEmailFromCookieUnverified(request: Request): string | null {
  const token = getAccessToken(request);
  if (!token) return null;
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
  if (accessVerificationConfigured(env)) {
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

  console.warn(
    '[admin-auth] ACCESS_TEAM_DOMAIN/ACCESS_AUD not set — running unverified legacy auth. Set both.',
  );
  const headerEmail = request.headers.get('Cf-Access-Authenticated-User-Email');
  if (headerEmail) return { email: headerEmail.toLowerCase(), verified: false };
  return { email: getAdminEmailFromCookieUnverified(request), verified: false };
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
