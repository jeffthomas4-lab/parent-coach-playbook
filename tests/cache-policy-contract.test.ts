import { describe, expect, it } from 'vitest';
import contract from '../automation/cache-policy-contract.json';
import { withWorkerSecurityHeaders } from '../src/lib/security-headers';

describe('cache policy contract', () => {
  it('keeps every sensitive and dynamic route class explicit', () => {
    const ids = contract.classes.map((entry) => entry.id);
    expect(ids).toEqual(expect.arrayContaining(['versioned_assets', 'public_html', 'public_directory_dynamic', 'public_media_dynamic', 'api', 'admin_preview', 'trust_customer_payment', 'health_readiness', 'redirects', 'errors']));
    expect(contract.promotion_requirements).toHaveLength(5);
  });

  it('sets no-store on every API response including errors and health', () => {
    for (const path of ['/api/health', '/api/ready', '/api/trust/request', '/api/admin/trust']) {
      const response = withWorkerSecurityHeaders(Response.json({ ok: true }), path);
      expect(response.headers.get('Cache-Control')).toMatch(/no-store/);
    }
  });

  it('requires revalidation for public HTML and never overwrites admin no-store', () => {
    const html = new Response('<h1>PCD</h1>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    expect(withWorkerSecurityHeaders(html, '/camps').headers.get('Cache-Control')).toBe('public, max-age=0, must-revalidate');
    expect(withWorkerSecurityHeaders(html, '/admin').headers.get('Cache-Control')).toBe('private, no-store');
    expect(withWorkerSecurityHeaders(html, '/trust').headers.get('Cache-Control')).toBe('private, no-store');
  });
});
