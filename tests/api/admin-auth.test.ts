// Unit tests for src/lib/admin-auth.ts — the gate every /api/admin/* route
// depends on. Covers the three things Pillar 9 requires for an auth check:
// a caller with no credentials is refused, a caller with the wrong
// credentials is refused, and a caller who is actually allowed gets through.

import { describe, it, expect } from 'vitest';
import { requireAdmin, requireSameOrigin, getAdminEmailFromRequest } from '../../src/lib/admin-auth';

const ADMIN_EMAILS = 'jeffthomas@pugetsound.edu,parentcoachplaybook@gmail.com';

describe('requireAdmin', () => {
  it('refuses a request with no Access header or cookie (unauthenticated)', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', { method: 'POST' });
    const result = requireAdmin(req, { ADMIN_EMAILS });
    expect(result).toBeInstanceOf(Response);
    if (result instanceof Response) {
      expect(result.status).toBe(401);
    }
  });

  it('refuses an authenticated email that is not on the allowlist (forbidden)', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', {
      method: 'POST',
      headers: { 'Cf-Access-Authenticated-User-Email': 'not-an-admin@example.com' },
    });
    const result = requireAdmin(req, { ADMIN_EMAILS });
    expect(result).toBeInstanceOf(Response);
    if (result instanceof Response) {
      expect(result.status).toBe(403);
    }
  });

  it('allows an email on the allowlist through', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', {
      method: 'POST',
      headers: { 'Cf-Access-Authenticated-User-Email': 'jeffthomas@pugetsound.edu' },
    });
    const result = requireAdmin(req, { ADMIN_EMAILS });
    expect(result).not.toBeInstanceOf(Response);
    if (!(result instanceof Response)) {
      expect(result.email).toBe('jeffthomas@pugetsound.edu');
    }
  });

  it('is case-insensitive on the allowlist match', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', {
      method: 'POST',
      headers: { 'Cf-Access-Authenticated-User-Email': 'JeffThomas@PugetSound.edu' },
    });
    const result = requireAdmin(req, { ADMIN_EMAILS });
    expect(result).not.toBeInstanceOf(Response);
  });

  it('falls back to the hardcoded default allowlist when ADMIN_EMAILS is missing', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', {
      method: 'POST',
      headers: { 'Cf-Access-Authenticated-User-Email': 'parentcoachplaybook@gmail.com' },
    });
    const result = requireAdmin(req, {});
    expect(result).not.toBeInstanceOf(Response);
  });
});

describe('getAdminEmailFromRequest', () => {
  it('prefers the Access header over the cookie', () => {
    const req = new Request('https://parentcoachdesk.com/admin/', {
      headers: {
        'Cf-Access-Authenticated-User-Email': 'header@example.com',
        cookie: 'CF_Authorization=not-a-real-jwt',
      },
    });
    expect(getAdminEmailFromRequest(req)).toBe('header@example.com');
  });

  it('returns null when neither header nor cookie is present', () => {
    const req = new Request('https://parentcoachdesk.com/admin/');
    expect(getAdminEmailFromRequest(req)).toBeNull();
  });
});

describe('requireSameOrigin', () => {
  it('rejects a request with a cross-origin Origin header', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', {
      method: 'POST',
      headers: { origin: 'https://evil.example.com' },
    });
    const result = requireSameOrigin(req);
    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(403);
  });

  it('rejects a request with no Origin and no Referer', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', { method: 'POST' });
    const result = requireSameOrigin(req);
    expect(result).toBeInstanceOf(Response);
    expect(result?.status).toBe(403);
  });

  it('allows a same-origin Origin header through', () => {
    const req = new Request('https://parentcoachdesk.com/api/admin/camps/abc/approve', {
      method: 'POST',
      headers: { origin: 'https://parentcoachdesk.com' },
    });
    expect(requireSameOrigin(req)).toBeNull();
  });
});
