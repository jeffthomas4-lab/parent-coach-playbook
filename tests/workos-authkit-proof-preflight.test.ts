import { describe, expect, it } from 'vitest';
import { verifyWorkosProofEnvironment } from '../scripts/workos-authkit-proof-preflight.mjs';

const valid = {
  PCD_WORKOS_PROOF_ACK: 'disposable-non-production-workos-proof',
  PCD_OWNER_AUTH_PROOF_ENABLED: 'true',
  WORKOS_CLIENT_ID: 'client_test_only',
  WORKOS_API_KEY: 'sk_test_redacted_test_only',
  WORKOS_REDIRECT_URI: 'http://127.0.0.1:4321/owner-proof/callback',
  WORKOS_COOKIE_PASSWORD: 'test-only-cookie-password-32-chars-minimum',
};

describe('WorkOS disposable runtime-proof preflight', () => {
  it('accepts an explicitly acknowledged localhost-only test environment', () => {
    expect(verifyWorkosProofEnvironment(valid)).toEqual([]);
  });

  it('rejects production keys, remote callbacks, weak cookies, and production config', () => {
    expect(verifyWorkosProofEnvironment({
      ...valid,
      WORKOS_API_KEY: 'sk_live_redacted',
      WORKOS_REDIRECT_URI: 'https://parentcoachdesk.com/owner-proof/callback?next=/admin',
      WORKOS_COOKIE_PASSWORD: 'short',
      WRANGLER_CONFIG_PATH: 'wrangler.production.jsonc',
    })).toEqual(expect.arrayContaining([
      expect.stringContaining('test key'),
      expect.stringContaining('http for the local proof'),
      expect.stringContaining('localhost'),
      expect.stringContaining('query'),
      expect.stringContaining('32 characters'),
      expect.stringContaining('must not use wrangler.production.jsonc'),
    ]));
  });

  it('rejects an implicit or partially configured proof', () => {
    const failures = verifyWorkosProofEnvironment({});
    expect(failures).toHaveLength(6);
    expect(failures).toEqual(expect.arrayContaining([
      expect.stringContaining('PCD_WORKOS_PROOF_ACK'),
      expect.stringContaining('PCD_OWNER_AUTH_PROOF_ENABLED'),
      expect.stringContaining('WORKOS_CLIENT_ID'),
      expect.stringContaining('WORKOS_API_KEY'),
      expect.stringContaining('WORKOS_REDIRECT_URI'),
      expect.stringContaining('WORKOS_COOKIE_PASSWORD'),
    ]));
  });
});
