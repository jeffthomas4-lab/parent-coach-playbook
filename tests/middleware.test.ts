import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  CONTENT_SECURITY_POLICY,
  withWorkerSecurityHeaders,
} from '../src/lib/security-headers';

describe('Worker response security middleware', () => {
  it('keeps the static-asset CSP aligned with the Worker response CSP', () => {
    const headersFile = readFileSync('public/_headers', 'utf8');
    expect(headersFile).toContain(`Content-Security-Policy: ${CONTENT_SECURITY_POLICY}`);
    expect(`  Content-Security-Policy: ${CONTENT_SECURITY_POLICY}`.length).toBeLessThanOrEqual(2000);
  });

  it('adds the browser security policy to an SSR response', async () => {
    const response = withWorkerSecurityHeaders(new Response('ok', {
      headers: { 'Cache-Control': 'public, max-age=30' },
    }), '/camps/');

    expect(response.headers.get('Content-Security-Policy')).toBe(CONTENT_SECURITY_POLICY);
    expect(response.headers.get('Strict-Transport-Security')).toContain('includeSubDomains');
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=30');
  });

  it.each(['/admin/', '/admin/camps/preview/example/', '/api/admin/camps/1/photo']) (
    'forces protected response %s to no-store and noindex',
    async (path) => {
      const response = withWorkerSecurityHeaders(
        new Response('protected', {
          headers: { 'Cache-Control': 'public, max-age=300' },
        }),
        path,
      );
      expect(response.headers.get('Cache-Control')).toBe('private, no-store');
      expect(response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    },
  );
});
