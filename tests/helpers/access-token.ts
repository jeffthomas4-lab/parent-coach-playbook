// Test helper: mints real RS256 JWTs against a throwaway key pair so the
// Access verification tests exercise actual crypto rather than a mocked
// "trust me, it's valid" stub. A signature test that mocks the signature check
// proves nothing.
//
// Two key pairs: the "team" pair whose public half is served as the JWKS, and a
// second "attacker" pair used to sign a token that must be refused.

import type { Jwk } from '../../src/lib/access-jwt';

export const TEAM_DOMAIN = 'jefftest.cloudflareaccess.com';
export const AUD = 'test-audience-tag-0123456789abcdef';
export const KID = 'test-kid-1';

const ALG = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' } as const;

let teamPair: CryptoKeyPair | null = null;
let attackerPair: CryptoKeyPair | null = null;

async function generatePair(): Promise<CryptoKeyPair> {
  return (await crypto.subtle.generateKey(
    { ...ALG, modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]) },
    true,
    ['sign', 'verify'],
  )) as CryptoKeyPair;
}

async function getTeamPair(): Promise<CryptoKeyPair> {
  if (!teamPair) teamPair = await generatePair();
  return teamPair;
}

async function getAttackerPair(): Promise<CryptoKeyPair> {
  if (!attackerPair) attackerPair = await generatePair();
  return attackerPair;
}

function b64url(bytes: Uint8Array | string): string {
  const arr = typeof bytes === 'string' ? new TextEncoder().encode(bytes) : bytes;
  let bin = '';
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** The public half of the team key, in the JWK shape Access publishes. */
export async function getPublicJwk(): Promise<Jwk> {
  const pair = await getTeamPair();
  const jwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
  if (!jwk.kty || !jwk.n || !jwk.e) throw new Error('exported RSA JWK is incomplete');
  return { kty: jwk.kty, n: jwk.n, e: jwk.e, kid: KID, alg: 'RS256', use: 'sig' };
}

/** A Response shaped like `https://<team>/cdn-cgi/access/certs`. */
export function jwksResponse(jwk: Jwk): Response {
  return new Response(JSON.stringify({ keys: [jwk] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export interface TokenOptions {
  email?: string;
  aud?: string;
  iss?: string;
  /** Seconds from now. Negative makes an expired token. */
  expiresInSec?: number;
  notBeforeSec?: number;
  kid?: string;
  alg?: string;
  /** Sign with a key the JWKS does not carry — the forged-token case. */
  signWithWrongKey?: boolean;
  /** Drop the signature entirely and claim alg:none. */
  algNone?: boolean;
  omitEmail?: boolean;
}

/** Build a JWT that looks exactly like a Cloudflare Access one. */
export async function makeAccessToken(opts: TokenOptions = {}): Promise<string> {
  const nowSec = Math.floor(Date.now() / 1000);
  const header = {
    alg: opts.algNone ? 'none' : (opts.alg ?? 'RS256'),
    kid: opts.kid ?? KID,
    typ: 'JWT',
  };
  const payload: Record<string, unknown> = {
    aud: [opts.aud ?? AUD],
    iss: opts.iss ?? `https://${TEAM_DOMAIN}`,
    iat: nowSec,
    exp: nowSec + (opts.expiresInSec ?? 3600),
    sub: 'test-subject',
  };
  if (opts.notBeforeSec !== undefined) payload.nbf = nowSec + opts.notBeforeSec;
  if (!opts.omitEmail) payload.email = opts.email ?? 'jeffthomas@pugetsound.edu';

  const signingInput = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  if (opts.algNone) return `${signingInput}.`;

  const pair = opts.signWithWrongKey ? await getAttackerPair() : await getTeamPair();
  const sig = await crypto.subtle.sign(ALG, pair.privateKey, new TextEncoder().encode(signingInput));
  return `${signingInput}.${b64url(new Uint8Array(sig))}`;
}
