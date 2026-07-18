import nodeFs from 'node:fs';
import nodePath from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import {
  sentryEnabled,
  stripUrl,
  scrubSentryEvent,
  buildSentryOptions,
  createInstrumentedHandler,
  type WorkerHandler,
} from '../src/lib/sentry-worker';

// Covers the Codex NO-GO required items at the composition layer:
// - a genuine no-DSN raw-handler fast path (no Sentry involvement)
// - server/client request-data minimization + event/transaction scrubbing
// - exception propagation, streaming, and ExecutionContext pass-through
// SDK-internal behaviors (HEAD/OPTIONS bypass, waitUntil flush) belong to
// @sentry/cloudflare and are exercised in the wrapped path via an injected
// double here; full runtime verification would need a workerd/Miniflare harness.

const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
const req = (url = 'https://parentcoachdesk.com/admin', method = 'GET') => new Request(url, { method });

describe('sentryEnabled', () => {
  it('is false without a usable DSN', () => {
    expect(sentryEnabled(undefined)).toBe(false);
    expect(sentryEnabled(null)).toBe(false);
    expect(sentryEnabled({})).toBe(false);
    expect(sentryEnabled({ SENTRY_DSN: '' })).toBe(false);
    expect(sentryEnabled({ SENTRY_DSN: '   ' })).toBe(false);
  });
  it('is true with a real DSN', () => {
    expect(sentryEnabled({ SENTRY_DSN: 'https://k@o1.ingest.us.sentry.io/2' })).toBe(true);
  });
});

describe('stripUrl', () => {
  it('drops query strings and fragments, keeps the path', () => {
    expect(stripUrl('https://x.com/a/b?email=a@b.com&t=1')).toBe('https://x.com/a/b');
    expect(stripUrl('https://x.com/a#frag')).toBe('https://x.com/a');
    expect(stripUrl('/admin/camps?q=secret')).toBe('/admin/camps');
    expect(stripUrl('/admin/camps')).toBe('/admin/camps');
  });
  it('is safe on non-strings', () => {
    expect(stripUrl(undefined)).toBeUndefined();
    expect(stripUrl(null)).toBeUndefined();
  });
});

describe('scrubSentryEvent', () => {
  it('minimizes request metadata and user/IP in place', () => {
    const event = {
      request: {
        url: 'https://parentcoachdesk.com/admin/camps?token=abc&email=a@b.com',
        query_string: 'token=abc&email=a@b.com',
        headers: { Cookie: 'CF_Authorization=xyz', 'User-Agent': 'x' },
        cookies: { CF_Authorization: 'xyz' },
        data: { password: 'p' },
        env: { SECRET: 's' },
      },
      user: { ip_address: '1.2.3.4', email: 'a@b.com' },
      transaction: 'GET /admin/camps?token=abc',
      breadcrumbs: [
        { category: 'navigation', data: { from: '/x?a=1', to: '/y?b=2' } },
        { category: 'fetch', data: { url: '/api/z?secret=1' } },
      ],
    };
    const out = scrubSentryEvent(event);
    expect(out).toBe(event); // in place
    expect(out.request.url).toBe('https://parentcoachdesk.com/admin/camps');
    expect(out.request).not.toHaveProperty('query_string');
    expect(out.request).not.toHaveProperty('headers');
    expect(out.request).not.toHaveProperty('cookies');
    expect(out.request).not.toHaveProperty('data');
    expect(out.request).not.toHaveProperty('env');
    expect(out).not.toHaveProperty('user');
    expect(out.transaction).toBe('GET /admin/camps');
    expect(out.breadcrumbs[0].data).toEqual({ from: '/x', to: '/y' });
    expect(out.breadcrumbs[1].data).toEqual({ url: '/api/z' });
  });
  it('is safe on empty/degenerate events', () => {
    expect(scrubSentryEvent(null)).toBeNull();
    expect(scrubSentryEvent(undefined)).toBeUndefined();
    expect(scrubSentryEvent({})).toEqual({});
  });
});

describe('buildSentryOptions', () => {
  it('sets privacy-safe defaults and scrubbing hooks', () => {
    const opts = buildSentryOptions({ SENTRY_DSN: 'https://k@o1.ingest.us.sentry.io/2' });
    expect(opts.dsn).toBe('https://k@o1.ingest.us.sentry.io/2');
    expect(opts.sendDefaultPii).toBe(false);
    expect(opts.environment).toBe('production');
    expect(typeof opts.beforeSend).toBe('function');
    expect(typeof opts.beforeSendTransaction).toBe('function');
    // beforeSend actually scrubs.
    const scrubbed = (opts.beforeSend as (e: any) => any)({ request: { url: '/a?x=1', headers: {} } });
    expect(scrubbed.request.url).toBe('/a');
    expect(scrubbed.request).not.toHaveProperty('headers');
  });
  it('honors SENTRY_ENVIRONMENT', () => {
    const opts = buildSentryOptions({ SENTRY_DSN: 'd', SENTRY_ENVIRONMENT: 'staging' });
    expect(opts.environment).toBe('staging');
  });
});

describe('createInstrumentedHandler', () => {
  it('no DSN: genuine pass-through, withSentry is never invoked', async () => {
    const raw: WorkerHandler = { fetch: vi.fn(async () => new Response('raw')) };
    const withSentry = vi.fn();
    const handler = createInstrumentedHandler(raw, withSentry as any);
    const res = await handler.fetch(req(), {}, ctx);
    expect(await res.text()).toBe('raw');
    expect(raw.fetch).toHaveBeenCalledTimes(1);
    expect(withSentry).not.toHaveBeenCalled();
  });

  it('no DSN: all methods (incl. HEAD/OPTIONS) reach the raw handler', async () => {
    const raw: WorkerHandler = { fetch: vi.fn(async () => new Response(null, { status: 204 })) };
    const handler = createInstrumentedHandler(raw, vi.fn() as any);
    for (const m of ['HEAD', 'OPTIONS', 'POST']) {
      await handler.fetch(req('https://x/a', m), {}, ctx);
    }
    expect(raw.fetch).toHaveBeenCalledTimes(3);
  });

  it('no DSN: raw-handler exceptions propagate (not swallowed)', async () => {
    const boom = new Error('gate failed');
    const raw: WorkerHandler = { fetch: vi.fn(async () => { throw boom; }) };
    const handler = createInstrumentedHandler(raw, vi.fn() as any);
    await expect(handler.fetch(req(), {}, ctx)).rejects.toBe(boom);
  });

  it('with DSN: withSentry is built once and reused across requests', async () => {
    const raw: WorkerHandler = { fetch: vi.fn(async () => new Response('astro')) };
    const wrapped: WorkerHandler = { fetch: vi.fn(async () => new Response('wrapped')) };
    const withSentry = vi.fn((_cb: any, _h: any) => wrapped);
    const handler = createInstrumentedHandler(raw, withSentry as any);
    const env = { SENTRY_DSN: 'https://k@o1.ingest.us.sentry.io/2' };
    const a = await handler.fetch(req(), env, ctx);
    const b = await handler.fetch(req(), env, ctx);
    expect(await a.text()).toBe('wrapped');
    expect(await b.text()).toBe('wrapped');
    expect(withSentry).toHaveBeenCalledTimes(1); // memoized per isolate
    expect(wrapped.fetch).toHaveBeenCalledTimes(2);
    // options callback returns the scrubbing-enabled options for this env.
    const optsCb = withSentry.mock.calls[0][0] as (e: any) => any;
    const opts = optsCb(env);
    expect(opts.dsn).toBe(env.SENTRY_DSN);
    expect(opts.sendDefaultPii).toBe(false);
  });

  it('with DSN: streaming bodies and the ExecutionContext pass through unchanged', async () => {
    const stream = new ReadableStream();
    const streamRes = new Response(stream);
    let seenCtx: unknown;
    const wrapped: WorkerHandler = {
      fetch: vi.fn(async (_r, _e, c) => { seenCtx = c; return streamRes; }),
    };
    const handler = createInstrumentedHandler({ fetch: vi.fn() }, ((_cb: any, _h: any) => wrapped) as any);
    const res = await handler.fetch(req(), { SENTRY_DSN: 'd' }, ctx);
    expect(res).toBe(streamRes);
    expect(res.body).toBe(stream);
    expect(seenCtx).toBe(ctx);
  });

  it("DSN then no-DSN in one isolate: step 2 hits pristine raw, never the SDK-mutated handler", async () => {
    const localCtx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext;
    const rawFetch = vi.fn(async () => new Response("raw"));
    const raw: WorkerHandler = { fetch: rawFetch };
    const instrumentedFetch = vi.fn(async (_r: Request, _e: any, c: ExecutionContext) => {
      c.waitUntil(Promise.resolve()); // SDK schedules event flush on the wrapped path
      return new Response("instrumented");
    });
    let inits = 0;
    // Double faithful to @sentry/cloudflare: mutates the handler it receives IN
    // PLACE and returns the same object.
    const withSentry = vi.fn((cb: any, handler: WorkerHandler) => {
      inits++;
      cb({ SENTRY_DSN: "d" });
      (handler as any).fetch = instrumentedFetch;
      return handler;
    });
    const handler = createInstrumentedHandler(raw, withSentry as any);

    // Step 1 — with DSN: instruments and uses the wrapped handler.
    const r1 = await handler.fetch(req(), { SENTRY_DSN: "d" }, localCtx);
    expect(await r1.text()).toBe("instrumented");
    expect(instrumentedFetch).toHaveBeenCalledTimes(1);
    expect(inits).toBe(1);
    expect(localCtx.waitUntil as any).toHaveBeenCalledTimes(1);

    // Step 2 — no DSN, same isolate: MUST hit the pristine raw handler.
    const r2 = await handler.fetch(req(), {}, localCtx);
    expect(await r2.text()).toBe("raw");
    expect(rawFetch).toHaveBeenCalledTimes(1);
    // No instrumented fetch, no re-init, no new waitUntil on step 2.
    expect(instrumentedFetch).toHaveBeenCalledTimes(1);
    expect(inits).toBe(1);
    expect(localCtx.waitUntil as any).toHaveBeenCalledTimes(1);
  });
});

describe('worker.ts wiring (source guard)', () => {
  it('keeps the CSP pinned to the exact ingest origin, not broad wildcards', () => {
    // (imported lazily to avoid pulling worker types into this suite)
    const root = nodePath.resolve(import.meta.dirname, '..');
    for (const f of ['src/lib/security-headers.ts', 'public/_headers']) {
      const src = nodeFs.readFileSync(nodePath.join(root, f), 'utf8');
      expect(src).toContain('https://o4511599982346240.ingest.us.sentry.io');
      expect(src).not.toContain('*.ingest.sentry.io');
      expect(src).not.toContain('*.ingest.us.sentry.io');
    }
  });
});
