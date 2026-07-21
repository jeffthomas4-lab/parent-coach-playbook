// Cloudflare Turnstile verification, shared by every public write route that
// carries a `cf-turnstile-response` token (camp submit, camp suggest, review
// submit, claim submit).
//
// Fails closed: if TURNSTILE_SECRET_KEY is not set in the environment, the
// submission is rejected with a 503 rather than silently skipping
// verification. Matches the house pattern in the Kelly Dr site's
// functions/api/contact.js and Pre-Launch Security Gate item 10 ("Turnstile
// on every public form... the Function fails closed until the secret is
// set").
//
// Required Pages secret:
//   TURNSTILE_SECRET_KEY — paired with the site key baked into each public
//                           form's cf-turnstile widget (PUBLIC_TURNSTILE_SITE_KEY)

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteverifyResponse {
  success?: boolean;
  'error-codes'?: string[];
}

/**
 * Calls Cloudflare's siteverify endpoint directly. Returns true only when
 * Cloudflare confirms the token is valid; any network failure, non-2xx
 * response, or malformed body is treated as a failed verification, never
 * as success.
 */
export async function verifyTurnstile(
  secretKey: string,
  token: string,
  remoteip?: string | null,
): Promise<boolean> {
  const body = new URLSearchParams({ secret: secretKey, response: token });
  if (remoteip) body.set('remoteip', remoteip);

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) return false;
    const result = (await res.json()) as SiteverifyResponse;
    return result.success === true;
  } catch {
    return false;
  }
}

/**
 * Drop-in guard for public POST routes, matching the shape of
 * `enforcePublicRequestBoundary` / `enforcePublicWriteRateLimit`: returns a
 * ready-to-send Response when the request should be rejected, or null when
 * the caller should keep going.
 *
 * - No secret configured -> 503 (fail closed, not a silent pass-through).
 * - No token on the submission -> 400.
 * - Token present but Cloudflare rejects it -> 400.
 */
export async function enforcePublicTurnstile(
  secretKey: string | undefined,
  token: string | undefined,
  request: Request,
): Promise<Response | null> {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };

  if (!secretKey) {
    console.error('[turnstile] TURNSTILE_SECRET_KEY not set, rejecting submission.');
    return new Response(JSON.stringify({ ok: false, error: 'verification unavailable' }), { status: 503, headers });
  }
  if (!token || typeof token !== 'string' || !token.trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'verification required' }), { status: 400, headers });
  }

  const remoteip = request.headers.get('cf-connecting-ip');
  const verified = await verifyTurnstile(secretKey, token, remoteip);
  if (!verified) {
    return new Response(JSON.stringify({ ok: false, error: 'verification failed' }), { status: 400, headers });
  }
  return null;
}
