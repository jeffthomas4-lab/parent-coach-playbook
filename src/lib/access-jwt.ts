// Cloudflare Access JWT signature verification.
//
// Closes the phase-2 debt flagged in admin-auth.ts: the admin cookie path used
// to decode the CF_Authorization JWT and trust its `email` claim without ever
// checking who signed it. Anything that can put a JWT-shaped string in front of
// the Worker could name itself an admin.
//
// What this does instead: fetch the Access team's public keys, verify the
// RS256 signature, then check issuer, audience, and expiry before any claim is
// read. Keys are cached in module scope for KEY_TTL_MS so a warm isolate does
// not refetch on every admin request.
//
// Config (both required, or verification is skipped — see admin-auth.ts):
//   ACCESS_TEAM_DOMAIN — e.g. "jeffthomas.cloudflareaccess.com"
//   ACCESS_AUD         — the Application Audience tag from the Access app
//
// Docs: https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/

export interface AccessJwtConfig {
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
}

export interface AccessClaims {
  email: string;
  sub?: string;
  aud: string[];
  iss: string;
  exp: number;
  iat?: number;
  nbf?: number;
}

interface Jwk {
  kid: string;
  kty: string;
  alg?: string;
  use?: string;
  n: string;
  e: string;
}

// Small clock-skew allowance so a correct token is not refused because the
// Access edge and this isolate disagree by a second.
const CLOCK_SKEW_SEC = 60;
const KEY_TTL_MS = 60 * 60 * 1000; // 1 hour
const KEY_FETCH_TIMEOUT_MS = 5000;

interface KeyCacheEntry {
  keys: Map<string, CryptoKey>;
  fetchedAt: number;
}

const keyCache = new Map<string, KeyCacheEntry>();

/** Test seam: drop the cached JWKS so a test can control what gets fetched. */
export function __resetAccessKeyCache(): void {
  keyCache.clear();
}

function normalizeTeamDomain(raw: string): string {
  let d = raw.trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  if (!d.includes('.')) d = `${d}.cloudflareaccess.com`;
  return d.toLowerCase();
}

// Annotated `Uint8Array<ArrayBuffer>`, not the bare `Uint8Array` (which
// TS 5.7+ defaults to `Uint8Array<ArrayBufferLike>`). `new Uint8Array(length)`
// is always backed by a real ArrayBuffer, never a SharedArrayBuffer — the
// runtime value already matches this type. The bare annotation was throwing
// that precision away, which is what made the result unassignable to
// `BufferSource` at the crypto.subtle.verify call below: a lib-variance gap,
// not a signature-verification bug.
function b64urlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const pad = input.length % 4 === 2 ? '==' : input.length % 4 === 3 ? '=' : '';
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64urlToString(input: string): string {
  return new TextDecoder().decode(b64urlToBytes(input));
}

async function importJwk(jwk: Jwk): Promise<CryptoKey | null> {
  if (jwk.kty !== 'RSA') return null;
  try {
    return await crypto.subtle.importKey(
      'jwk',
      { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
  } catch {
    return null;
  }
}

/**
 * Fetch and cache the Access team's signing keys, keyed by `kid`.
 * A fetch failure returns an empty map rather than throwing — the caller
 * treats "no key" as "cannot verify", which fails closed.
 */
async function getSigningKeys(teamDomain: string): Promise<Map<string, CryptoKey>> {
  const cached = keyCache.get(teamDomain);
  if (cached && Date.now() - cached.fetchedAt < KEY_TTL_MS) return cached.keys;

  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  const keys = new Map<string, CryptoKey>();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(KEY_FETCH_TIMEOUT_MS) });
    if (!res.ok) {
      console.error('[access-jwt] certs fetch returned', res.status);
      return cached?.keys ?? keys;
    }
    const body = (await res.json()) as { keys?: Jwk[] };
    for (const jwk of body.keys ?? []) {
      if (!jwk.kid) continue;
      const key = await importJwk(jwk);
      if (key) keys.set(jwk.kid, key);
    }
  } catch (e) {
    console.error('[access-jwt] certs fetch failed', e);
    // Serve the stale cache rather than locking every admin out on one blip.
    return cached?.keys ?? keys;
  }

  if (keys.size > 0) keyCache.set(teamDomain, { keys, fetchedAt: Date.now() });
  return keys;
}

export type VerifyFailure =
  | 'malformed'
  | 'unsupported-alg'
  | 'unknown-kid'
  | 'bad-signature'
  | 'expired'
  | 'not-yet-valid'
  | 'bad-issuer'
  | 'bad-audience'
  | 'no-email';

export type VerifyResult =
  | { ok: true; claims: AccessClaims }
  | { ok: false; reason: VerifyFailure };

/**
 * Verify a Cloudflare Access JWT end to end: signature against the team's
 * published keys, then alg, iss, aud, nbf, exp. Returns the claims only when
 * every check passes.
 *
 * Fails closed. If the keys cannot be fetched, no key matches the token's kid,
 * or anything about the token is off, the answer is a refusal with a reason
 * for the server log. The reason never reaches the caller's response body.
 */
export async function verifyAccessJwt(
  token: string,
  config: { teamDomain: string; aud: string },
): Promise<VerifyResult> {
  const parts = token.split('.');
  if (parts.length !== 3) return { ok: false, reason: 'malformed' };

  let header: { alg?: string; kid?: string };
  let payload: Partial<AccessClaims> & { aud?: string | string[] };
  try {
    header = JSON.parse(b64urlToString(parts[0]));
    payload = JSON.parse(b64urlToString(parts[1]));
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  // Pin the algorithm. Accepting whatever the token names is how alg-confusion
  // and alg:none bypasses work.
  if (header.alg !== 'RS256') return { ok: false, reason: 'unsupported-alg' };
  if (!header.kid) return { ok: false, reason: 'unknown-kid' };

  const teamDomain = normalizeTeamDomain(config.teamDomain);
  const keys = await getSigningKeys(teamDomain);
  const key = keys.get(header.kid);
  if (!key) return { ok: false, reason: 'unknown-kid' };

  let signatureValid = false;
  try {
    signatureValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      b64urlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
  } catch {
    return { ok: false, reason: 'bad-signature' };
  }
  if (!signatureValid) return { ok: false, reason: 'bad-signature' };

  const nowSec = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp + CLOCK_SKEW_SEC < nowSec) {
    return { ok: false, reason: 'expired' };
  }
  if (typeof payload.nbf === 'number' && payload.nbf - CLOCK_SKEW_SEC > nowSec) {
    return { ok: false, reason: 'not-yet-valid' };
  }

  const expectedIssuer = `https://${teamDomain}`;
  if (payload.iss !== expectedIssuer) return { ok: false, reason: 'bad-issuer' };

  const audList = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
  if (!audList.includes(config.aud)) return { ok: false, reason: 'bad-audience' };

  if (typeof payload.email !== 'string' || !payload.email.includes('@')) {
    return { ok: false, reason: 'no-email' };
  }

  return {
    ok: true,
    claims: {
      email: payload.email.toLowerCase(),
      sub: payload.sub,
      aud: audList,
      iss: payload.iss,
      exp: payload.exp,
      iat: payload.iat,
      nbf: payload.nbf,
    },
  };
}
