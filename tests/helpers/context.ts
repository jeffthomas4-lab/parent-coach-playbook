// Shared test helper: builds a minimal Astro APIContext-shaped object for
// calling an API route's exported POST handler directly, without spinning up
// a dev server or a Workers runtime.
//
// Each route now imports its env from 'cloudflare:workers', which vitest.config.ts
// aliases to tests/mocks/cloudflare-workers.ts — a single mutable object.
// makeContext() repopulates that shared object on every call, so pass
// whatever fake env (DB, ADMIN_EMAILS, CRON_KEY, etc.) the test needs; routes
// that never touch env.DB can pass an empty object and it still satisfies the
// `env?.DB` guard check (undefined -> the route's own 500 "database not
// available" branch, which is itself a test case for the happy-path suites
// below).

import type { APIContext } from 'astro';
import { env as cfEnvMock } from 'cloudflare:workers';
import { __primeAccessKeyCache } from '../../src/lib/access-jwt';
import { makeAccessToken, getPublicJwk, TEAM_DOMAIN, AUD } from './access-token';

const TEST_ACCESS_EMAILS = [
  'jeffthomas@pugetsound.edu',
  'stranger@example.com',
  'nobody@example.com',
] as const;
const TEST_ACCESS_TOKENS = new Map<string, string>();
for (const email of TEST_ACCESS_EMAILS) {
  TEST_ACCESS_TOKENS.set(email, await makeAccessToken({ email }));
}
await __primeAccessKeyCache(TEAM_DOMAIN, [await getPublicJwk()]);

export function makeContext(opts: {
  request: Request;
  params?: Record<string, string | undefined>;
  env?: Record<string, unknown>;
}): APIContext {
  const testEnv = { ...(opts.env ?? {}) };
  // Route tests model a fully bound deployed Worker unless a test explicitly
  // supplies a limiter override. Missing-binding fail-closed behavior is
  // exercised directly in rate-limit-contract.test.ts.
  const allow = { limit: async () => ({ success: true }) };
  testEnv.PUBLIC_SUBMISSION_RATE_LIMITER ??= allow;
  testEnv.TRUST_RATE_LIMITER ??= allow;
  testEnv.COMMUNITY_RATE_LIMITER ??= allow;
  testEnv.DEMAND_RATE_LIMITER ??= allow;
  testEnv.OWNER_RATE_LIMITER ??= allow;
  if ('ADMIN_EMAILS' in testEnv) {
    testEnv.ACCESS_TEAM_DOMAIN ??= TEAM_DOMAIN;
    testEnv.ACCESS_AUD ??= AUD;
  }

  const legacyEmail = opts.request.headers.get('Cf-Access-Authenticated-User-Email')?.toLowerCase();
  let request = opts.request;
  if (legacyEmail) {
    const token = TEST_ACCESS_TOKENS.get(legacyEmail);
    if (!token) throw new Error(`No signed Access test token registered for ${legacyEmail}`);
    const headers = new Headers(opts.request.headers);
    headers.delete('Cf-Access-Authenticated-User-Email');
    headers.set('Cf-Access-Jwt-Assertion', token);
    request = new Request(opts.request, { headers });
  }

  for (const key of Object.keys(cfEnvMock)) delete (cfEnvMock as any)[key];
  Object.assign(cfEnvMock, testEnv);

  return {
    request,
    params: opts.params ?? {},
    locals: {
      runtime: {
        env: testEnv,
      },
    },
    // Fields below are unused by every route under test today. Cast through
    // `unknown` rather than filling in the full Astro APIContext shape.
  } as unknown as APIContext;
}

export function jsonRequest(url: string, body: unknown, opts: { method?: string; headers?: Record<string, string> } = {}): Request {
  return new Request(url, {
    method: opts.method ?? 'POST',
    headers: { 'content-type': 'application/json', ...(opts.headers ?? {}) },
    body: JSON.stringify(body),
  });
}

export async function readJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
