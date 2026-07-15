// Tests for src/lib/access-jwt.ts — the Cloudflare Access JWT signature check.
//
// This is the fix for the phase-2 debt flagged in the automation audit: the
// admin cookie path used to read the email claim out of a JWT without ever
// checking who signed it. These tests sign real tokens with a real key pair, so
// the forged-token cases are actually forged, not asserted to be.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { verifyAccessJwt, __resetAccessKeyCache } from '../../src/lib/access-jwt';
import { makeAccessToken, getPublicJwk, jwksResponse, TEAM_DOMAIN, AUD } from '../helpers/access-token';

const config = { teamDomain: TEAM_DOMAIN, aud: AUD };

async function stubJwks(): Promise<ReturnType<typeof vi.fn>> {
  const jwk = await getPublicJwk();
  const fetchMock = vi.fn(async () => jwksResponse(jwk));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('verifyAccessJwt', () => {
  beforeEach(() => {
    __resetAccessKeyCache();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('happy path: accepts a correctly signed, in-date token and returns the email claim', async () => {
    await stubJwks();
    const token = await makeAccessToken({ email: 'Jeff@Example.com' });
    const result = await verifyAccessJwt(token, config);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.claims.email).toBe('jeff@example.com');
      expect(result.claims.aud).toContain(AUD);
    }
  });

  it('SECURITY: refuses a token signed with a key the team never published', async () => {
    await stubJwks();
    const token = await makeAccessToken({ signWithWrongKey: true });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'bad-signature' });
  });

  it('SECURITY: refuses alg:none — the classic signature bypass', async () => {
    await stubJwks();
    const token = await makeAccessToken({ algNone: true });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'unsupported-alg' });
  });

  it('SECURITY: refuses a token whose payload was edited after signing', async () => {
    await stubJwks();
    const token = await makeAccessToken({ email: 'nobody@example.com' });
    const [h, , s] = token.split('.');
    const forgedPayload = Buffer.from(
      JSON.stringify({
        aud: [AUD],
        iss: `https://${TEAM_DOMAIN}`,
        exp: Math.floor(Date.now() / 1000) + 3600,
        email: 'jeffthomas@pugetsound.edu',
      }),
    )
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const result = await verifyAccessJwt(`${h}.${forgedPayload}.${s}`, config);
    expect(result).toEqual({ ok: false, reason: 'bad-signature' });
  });

  it('SECURITY: refuses a token whose kid is not in the JWKS', async () => {
    await stubJwks();
    const token = await makeAccessToken({ kid: 'some-other-kid' });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'unknown-kid' });
  });

  it('refuses an expired token even though the signature is good', async () => {
    await stubJwks();
    const token = await makeAccessToken({ expiresInSec: -3600 });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'expired' });
  });

  it('refuses a not-yet-valid token', async () => {
    await stubJwks();
    const token = await makeAccessToken({ notBeforeSec: 600 });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'not-yet-valid' });
  });

  it('SECURITY: refuses a token minted for a different Access application (wrong aud)', async () => {
    await stubJwks();
    const token = await makeAccessToken({ aud: 'some-other-apps-audience-tag' });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'bad-audience' });
  });

  it('SECURITY: refuses a token from a different Access team (wrong iss)', async () => {
    await stubJwks();
    const token = await makeAccessToken({ iss: 'https://someone-else.cloudflareaccess.com' });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'bad-issuer' });
  });

  it('refuses a signed token that carries no email claim', async () => {
    await stubJwks();
    const token = await makeAccessToken({ omitEmail: true });
    const result = await verifyAccessJwt(token, config);
    expect(result).toEqual({ ok: false, reason: 'no-email' });
  });

  it('refuses a string that is not a JWT at all', async () => {
    await stubJwks();
    expect(await verifyAccessJwt('not-a-jwt', config)).toEqual({ ok: false, reason: 'malformed' });
    expect(await verifyAccessJwt('a.b.c', config)).toEqual({ ok: false, reason: 'malformed' });
  });

  it('fails closed when the certs endpoint is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }));
    const token = await makeAccessToken();
    const result = await verifyAccessJwt(token, config);
    expect(result.ok).toBe(false);
  });

  it('fails closed when the certs endpoint returns an error status', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('nope', { status: 500 })));
    const token = await makeAccessToken();
    const result = await verifyAccessJwt(token, config);
    expect(result.ok).toBe(false);
  });

  it('caches the JWKS instead of refetching on every verify', async () => {
    const fetchMock = await stubJwks();
    const token = await makeAccessToken();
    await verifyAccessJwt(token, config);
    await verifyAccessJwt(token, config);
    await verifyAccessJwt(token, config);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes a bare team name into the full cloudflareaccess.com host', async () => {
    const fetchMock = await stubJwks();
    const token = await makeAccessToken();
    const result = await verifyAccessJwt(token, { teamDomain: 'jefftest', aud: AUD });
    expect(result.ok).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toBe(`https://${TEAM_DOMAIN}/cdn-cgi/access/certs`);
  });
});
