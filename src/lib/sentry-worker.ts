// Pure, dependency-light composition + privacy helpers for the Sentry Worker
// integration. Deliberately imports NOTHING from @sentry/cloudflare or the
// Astro Worker entrypoint, so it is fully unit-testable in plain Vitest and
// safe to share with the browser client config. src/worker.ts wires these to
// the real @sentry/cloudflare withSentry.

export interface SentryWorkerEnv {
  SENTRY_DSN?: string;
  SENTRY_ENVIRONMENT?: string;
  SENTRY_RELEASE?: string;
}

// A minimal module-Worker handler shape. env is `any` on purpose: this module
// must not depend on the concrete Worker env type.
export interface WorkerHandler {
  fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> | Response;
}

// Signature of @sentry/cloudflare's withSentry, typed loosely so the real
// implementation can be injected without dragging its generics in here.
export type WithSentryFn = (
  optionsCallback: (env: any) => Record<string, unknown>,
  handler: WorkerHandler,
) => WorkerHandler;

// True only when a DSN is actually configured. Callers use this to take a
// genuine no-Sentry fast path: a DSN-less Worker runs the raw handler with zero
// @sentry/cloudflare instrumentation (no withSentry wrap, no waitUntil
// rebinding, no HEAD/OPTIONS bypass).
export function sentryEnabled(env: SentryWorkerEnv | undefined | null): boolean {
  return typeof env?.SENTRY_DSN === 'string' && env.SENTRY_DSN.trim().length > 0;
}

// Reduce a URL to path only, dropping the query string and fragment. Query
// strings on this site routinely carry PII (emails, tokens, search terms), so
// they must never reach Sentry.
export function stripUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return value === undefined || value === null ? undefined : String(value);
  const cut = value.search(/[?#]/);
  return cut === -1 ? value : value.slice(0, cut);
}

// In-place minimization of a Sentry event (error OR transaction): drop query
// strings, request headers, cookies, body data, env, user/IP context, and
// scrub URLs out of the transaction name and navigation/fetch breadcrumbs.
// Returns the same object so it can be used directly as beforeSend /
// beforeSendTransaction.
export function scrubSentryEvent<E>(event: E): E {
  const e = event as unknown as Record<string, any> | null | undefined;
  if (!e || typeof e !== 'object') return event;

  const req = e.request;
  if (req && typeof req === 'object') {
    if ('url' in req) req.url = stripUrl(req.url);
    delete req.query_string;
    delete req.headers;
    delete req.cookies;
    delete req.data;
    delete req.env;
  }

  // Remove any user identity / IP the SDK may have attached.
  if ('user' in e) delete e.user;

  // Transaction name can be "GET /path?token=..." — keep the path only.
  if (typeof e.transaction === 'string') e.transaction = stripUrl(e.transaction);

  // Navigation/fetch/xhr breadcrumbs stash URLs in data.{url,to,from}.
  if (Array.isArray(e.breadcrumbs)) {
    for (const crumb of e.breadcrumbs) {
      const data = crumb && crumb.data;
      if (data && typeof data === 'object') {
        for (const key of ['url', 'to', 'from']) {
          if (typeof data[key] === 'string') data[key] = stripUrl(data[key]);
        }
      }
    }
  }

  return event;
}

// Build @sentry/cloudflare init options for a DSN-configured Worker. Only ever
// called when sentryEnabled(env) is true, so env.SENTRY_DSN is present.
export function buildSentryOptions(env: SentryWorkerEnv): Record<string, unknown> {
  return {
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT ?? 'production',
    release: env.SENTRY_RELEASE,
    // PCD privacy pillar: never attach PII, AND scrub URLs/query strings/
    // headers/body the SDK would otherwise include.
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    beforeSend: (event: any) => scrubSentryEvent(event),
    beforeSendTransaction: (event: any) => scrubSentryEvent(event),
  };
}

// Wrap a raw Worker handler so Sentry instruments it ONLY when a DSN is set.
// Without a DSN, requests hit `raw` directly — a genuine pass-through with zero
// Sentry involvement (this is the fix for "disabled Sentry is not a
// pass-through"). With a DSN, the withSentry wrapper is built once per isolate
// and reused. withSentryFn is injected so this stays unit-testable without the
// Astro Worker entrypoint.
export function createInstrumentedHandler(raw: WorkerHandler, withSentryFn: WithSentryFn): WorkerHandler {
  let wrapped: WorkerHandler | null = null;
  return {
    fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> | Response {
      if (!sentryEnabled(env)) {
        return raw.fetch(request, env, ctx);
      }
      if (!wrapped) {
        // @sentry/cloudflare withSentry instruments the handler it receives IN
        // PLACE (it replaces handler.fetch and returns the same object). Hand it
        // a DISTINCT delegating clone so the shared `raw` object stays pristine
        // and the no-DSN branch above remains a genuine pass-through even after
        // instrumentation has run once in this isolate.
        const instrumentTarget: WorkerHandler = {
          fetch: (rq: Request, e: any, c: ExecutionContext) => raw.fetch(rq, e, c),
        };
        wrapped = withSentryFn((e: any) => buildSentryOptions(e), instrumentTarget);
      }
      return wrapped.fetch(request, env, ctx);
    },
  };
}
