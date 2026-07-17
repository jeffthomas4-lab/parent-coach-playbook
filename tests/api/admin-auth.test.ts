// Unit tests for src/lib/admin-auth.ts — the gate every /api/admin/* route
// depends on. Covers the three things Pillar 9 requires for an auth check:
// a caller with no credentials is refused, a caller with the wrong
// credentials is refused, and a caller who is actually allowed gets through.
//
// requireAdmin went async on 2026-07-15 when Access JWT signature verification
// landed. Missing verification settings fail closed; no unsigned fallback is
// permitted.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  requireAdmin,
  requireSameOrigin,
  getAdminEmailFromRequest,
  getAccessToken,
  accessVerificationConfigured,
  adminAllowListConfigured,
} from '../../src/lib/admin-auth';
import { __resetAccessKeyCache } from '../../src/lib/access-jwt';
import { makeAccessToken, getPublicJwk, jwksResponse, TEAM_DOMAIN, AUD } from '../helpers/access-token';

const ADMIN_EMAILS = 'eepskalla@gmail.com,jeffthomas4@gmail.com';
const ADMIN = 'jeffthomas4@gmail.com';
const URL_ADMIN = 'https://parentcoachdesk.com/api/admin/camps/abc/approve';

describe('requireAdmin (Access vars unset)', () => {
  it('fails closed when verification configuration is missing', async () => {
    const req = new Request(URL_ADMIN, { method: 'POST' });
    const result = await requireAdmin(req, { ADMIN_EMAILS });
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(503);
  });

  it('SECURITY: never trusts a spoofed Access email header when configuration is missing', async () => {
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { 'Cf-Access-Authenticated-User-Email': ADMIN },
    });
    const result = await requireAdmin(req, { ADMIN_EMAILS });
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(503);
  });

  it('SECURITY: never trusts an unsigned cookie when configuration is missing', async () => {
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: 'CF_Authorization=header.unsigned.signature' },
    });
    const result = await requireAdmin(req, { ADMIN_EMAILS });
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(503);
  });
});

describe('requireAdmin (verified mode: Access vars set)', () => {
  const env = { ADMIN_EMAILS, ACCESS_TEAM_DOMAIN: TEAM_DOMAIN, ACCESS_AUD: AUD };

  beforeEach(async () => {
    __resetAccessKeyCache();
    const jwk = await getPublicJwk();
    vi.stubGlobal('fetch', vi.fn(async () => jwksResponse(jwk)));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('SECURITY: a spoofed Cf-Access-Authenticated-User-Email header alone gets nothing', async () => {
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { 'Cf-Access-Authenticated-User-Email': ADMIN },
    });
    const result = await requireAdmin(req, env);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  it('fails closed when the administrator allowlist is missing', async () => {
    const token = await makeAccessToken({ email: ADMIN });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: `CF_Authorization=${token}` },
    });
    const result = await requireAdmin(req, { ACCESS_TEAM_DOMAIN: TEAM_DOMAIN, ACCESS_AUD: AUD });
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(503);
  });

  it('SECURITY: a JWT signed by someone other than the Access team is refused', async () => {
    const token = await makeAccessToken({ email: ADMIN, signWithWrongKey: true });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: `CF_Authorization=${token}` },
    });
    const result = await requireAdmin(req, env);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });

  it('allows a properly signed Access JWT from the cookie', async () => {
    const token = await makeAccessToken({ email: ADMIN });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: `CF_Authorization=${token}` },
    });
    const result = await requireAdmin(req, env);
    expect(result).not.toBeInstanceOf(Response);
    if (!(result instanceof Response)) {
      expect(result.email).toBe(ADMIN);
      expect(result.verified).toBe(true);
    }
  });

  it('allows a properly signed Access JWT from the assertion header', async () => {
    const token = await makeAccessToken({ email: ADMIN });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { 'Cf-Access-Jwt-Assertion': token },
    });
    expect(await requireAdmin(req, env)).not.toBeInstanceOf(Response);
  });

  it('a valid signature for a non-allowlisted email is still forbidden', async () => {
    const token = await makeAccessToken({ email: 'someone-else@example.com' });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: `CF_Authorization=${token}` },
    });
    const result = await requireAdmin(req, env);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(403);
  });

  it('does not restore the retired administrator when configuration is valid', async () => {
    const token = await makeAccessToken({ email: 'parentcoachplaybook@gmail.com' });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: `CF_Authorization=${token}` },
    });
    const result = await requireAdmin(req, env);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(403);
  });

  it('an expired but correctly signed token is refused', async () => {
    const token = await makeAccessToken({ email: ADMIN, expiresInSec: -3600 });
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { cookie: `CF_Authorization=${token}` },
    });
    const result = await requireAdmin(req, env);
    expect(result).toBeInstanceOf(Response);
    expect((result as Response).status).toBe(401);
  });
});

describe('accessVerificationConfigured', () => {
  it('is false when either var is missing or blank', () => {
    expect(accessVerificationConfigured({})).toBe(false);
    expect(accessVerificationConfigured({ ACCESS_TEAM_DOMAIN: TEAM_DOMAIN })).toBe(false);
    expect(accessVerificationConfigured({ ACCESS_AUD: AUD })).toBe(false);
    expect(accessVerificationConfigured({ ACCESS_TEAM_DOMAIN: '  ', ACCESS_AUD: AUD })).toBe(false);
  });

  it('is true when both are set', () => {
    expect(accessVerificationConfigured({ ACCESS_TEAM_DOMAIN: TEAM_DOMAIN, ACCESS_AUD: AUD })).toBe(true);
  });
});

describe('adminAllowListConfigured', () => {
  it('is false when the allowlist is absent or blank', () => {
    expect(adminAllowListConfigured({})).toBe(false);
    expect(adminAllowListConfigured({ ADMIN_EMAILS: ' , ' })).toBe(false);
  });

  it('is true only for a non-empty administrator list', () => {
    expect(adminAllowListConfigured({ ADMIN_EMAILS })).toBe(true);
  });
});

describe('getAccessToken', () => {
  it('prefers the assertion header over the cookie', () => {
    const req = new Request('https://parentcoachdesk.com/admin/', {
      headers: { 'Cf-Access-Jwt-Assertion': 'from-header', cookie: 'CF_Authorization=from-cookie' },
    });
    expect(getAccessToken(req)).toBe('from-header');
  });

  it('reads the CF_Authorization cookie when there is no assertion header', () => {
    const req = new Request('https://parentcoachdesk.com/admin/', {
      headers: { cookie: 'other=1; CF_Authorization=from-cookie; more=2' },
    });
    expect(getAccessToken(req)).toBe('from-cookie');
  });

  it('returns null when neither is present', () => {
    expect(getAccessToken(new Request('https://parentcoachdesk.com/admin/'))).toBeNull();
  });
});

describe('getAdminEmailFromRequest', () => {
  it('returns null rather than trusting an Access header without verification config', async () => {
    const req = new Request('https://parentcoachdesk.com/admin/', {
      headers: {
        'Cf-Access-Authenticated-User-Email': 'header@example.com',
        cookie: 'CF_Authorization=not-a-real-jwt',
      },
    });
    expect(await getAdminEmailFromRequest(req)).toBeNull();
  });

  it('returns null when neither header nor cookie is present', async () => {
    expect(await getAdminEmailFromRequest(new Request('https://parentcoachdesk.com/admin/'))).toBeNull();
  });
});

describe('requireSameOrigin', () => {
  it('rejects a request with a cross-origin Origin header', () => {
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { origin: 'https://evil.example.com' },
    });
    const result = requireSameOrigin(req);
    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(403);
  });

  it('rejects a request with no Origin and no Referer', () => {
    const result = requireSameOrigin(new Request(URL_ADMIN, { method: 'POST' }));
    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(403);
  });

  it('allows a same-origin Origin header through', () => {
    const req = new Request(URL_ADMIN, {
      method: 'POST',
      headers: { origin: 'https://parentcoachdesk.com' },
    });
    expect(requireSameOrigin(req)).toBeNull();
  });
});
