// Shared test helper: builds a minimal Astro APIContext-shaped object for
// calling an API route's exported POST handler directly, without spinning up
// a dev server or a Workers runtime.
//
// Each route reads its env via `(locals as any).runtime?.env`, so this
// mirrors that shape. Pass whatever fake env (DB, ADMIN_EMAILS, CRON_KEY,
// etc.) the test needs; routes that never touch env.DB can pass an empty
// object and it still satisfies the `env?.DB` guard check (undefined -> the
// route's own 500 "database not available" branch, which is itself a test
// case for the happy-path suites below).

import type { APIContext } from 'astro';

export function makeContext(opts: {
  request: Request;
  params?: Record<string, string | undefined>;
  env?: Record<string, unknown>;
}): APIContext {
  return {
    request: opts.request,
    params: opts.params ?? {},
    locals: {
      runtime: {
        env: opts.env ?? {},
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
