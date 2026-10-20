// HTTP -> HTTPS redirect at the Worker (2026-10-20 security audit, H3).
// Good, bad, and malformed cases per the evidence-rules ledger standard.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { httpsRedirect, httpsRedirectFor, isPlainHttp } from '../src/lib/https-redirect';

function req(url: string, headers: Record<string, string> = {}): Request {
  return new Request(url, { headers });
}

describe('isPlainHttp', () => {
  it('flags plain http on the production host', () => {
    expect(isPlainHttp(req('http://parentcoachdesk.com/'))).toBe(true);
    expect(isPlainHttp(req('http://parentcoachdesk.com/drive-home/when-the-cuts-list-goes-up/?a=1'))).toBe(true);
  });

  it('does not flag https', () => {
    expect(isPlainHttp(req('https://parentcoachdesk.com/'))).toBe(false);
  });

  it('honours X-Forwarded-Proto and CF-Visitor when the URL already says https', () => {
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'X-Forwarded-Proto': 'http' }))).toBe(true);
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'X-Forwarded-Proto': 'HTTP' }))).toBe(true);
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'CF-Visitor': '{"scheme":"http"}' }))).toBe(true);
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'CF-Visitor': '{"scheme":"https"}' }))).toBe(false);
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'X-Forwarded-Proto': 'https' }))).toBe(false);
  });

  it('ignores malformed CF-Visitor headers', () => {
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'CF-Visitor': 'not-json' }))).toBe(false);
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'CF-Visitor': 'null' }))).toBe(false);
    expect(isPlainHttp(req('https://parentcoachdesk.com/', { 'CF-Visitor': '{"scheme":42}' }))).toBe(false);
  });

  it('leaves local dev hosts alone', () => {
    for (const u of [
      'http://localhost:8787/',
      'http://localhost:4321/admin/',
      'http://127.0.0.1:8787/',
      'http://[::1]:8787/',
      'http://pcd.localhost:8787/',
    ]) {
      expect(isPlainHttp(req(u)), u).toBe(false);
      expect(isPlainHttp(req(u, { 'CF-Visitor': '{"scheme":"http"}' })), u).toBe(false);
    }
  });
});

describe('httpsRedirect', () => {
  it('301s to the same host, path, and query on https, dropping any port', () => {
    const res = httpsRedirect(new URL('http://parentcoachdesk.com:80/drive-there/x/?sport=soccer&format=team#h'));
    expect(res.status).toBe(301);
    expect(res.headers.get('Location')).toBe('https://parentcoachdesk.com/drive-there/x/?sport=soccer&format=team#h');
  });

  it('keeps the www host as-is (the www -> apex hop stays in middleware)', () => {
    const res = httpsRedirect(new URL('http://www.parentcoachdesk.com/camps/'));
    expect(res.headers.get('Location')).toBe('https://www.parentcoachdesk.com/camps/');
  });
});

describe('httpsRedirect method handling', () => {
  it('uses 308 for non-GET methods so the method and body are preserved', () => {
    expect(httpsRedirect(new URL('http://parentcoachdesk.com/api/x'), 'POST').status).toBe(308);
    expect(httpsRedirect(new URL('http://parentcoachdesk.com/'), 'HEAD').status).toBe(301);
  });
});

describe('httpsRedirectFor', () => {
  it('returns null for https and local requests', () => {
    expect(httpsRedirectFor(req('https://parentcoachdesk.com/'))).toBeNull();
    expect(httpsRedirectFor(req('http://localhost:8787/'))).toBeNull();
  });

  it('returns a 301 for plain http', () => {
    const res = httpsRedirectFor(req('http://parentcoachdesk.com/api/admin/x?y=1', { 'CF-Visitor': '{"scheme":"http"}' }));
    expect(res?.status).toBe(301);
    expect(res?.headers.get('Location')).toBe('https://parentcoachdesk.com/api/admin/x?y=1');
  });
});

describe('Worker entry wiring', () => {
  it('checks for plain http before the BabyLove webhook, admin gate, and Astro handler', () => {
    const source = readFileSync('src/worker.ts', 'utf8');
    const redirect = source.indexOf('httpsRedirectFor(request, url)');
    const webhook = source.indexOf("url.pathname === '/api/integrations/babylovegrowth/articles'");
    const gate = source.indexOf('await enforceAdministrativeRequest(request, env)');
    const delegate = source.indexOf('await astroWorker.fetch(request, env, context)');
    expect(redirect).toBeGreaterThan(0);
    expect(webhook).toBeGreaterThan(redirect);
    expect(gate).toBeGreaterThan(redirect);
    expect(delegate).toBeGreaterThan(redirect);
  });
});
