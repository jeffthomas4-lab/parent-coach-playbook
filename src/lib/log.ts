// Structured logging, Pillar 8 of the Website Build Standard.
//
// Every log line is one JSON object with a timestamp, a severity used on
// purpose, a request ID, and an action name, not a plain string. The request
// ID is Cloudflare's own `cf-ray` header where one exists (falling back to a
// generated UUID for requests that never reach the edge, e.g. local dev or a
// unit test calling a handler directly). Using `cf-ray` means the same ID
// already appears in Cloudflare's own edge logs, so a support ticket becomes
// one grep across both layers instead of a guessing game.
//
// Usage in a route:
//   const logger = createRequestLogger(request, { route: 'admin/camps/approve', userId: auth.email });
//   logger.error('parse_body_failed', error);
//   logger.info('camp_approved', { campId: id });

export type LogSeverity = 'debug' | 'info' | 'warn' | 'error';

export interface LogRecord {
  timestamp: string;
  severity: LogSeverity;
  requestId: string;
  action: string;
  route?: string;
  userId?: string | null;
  [key: string]: unknown;
}

type LogSink = (line: string) => void;

const SINKS: Record<LogSeverity, LogSink> = {
  debug: (line) => console.log(line),
  info: (line) => console.log(line),
  warn: (line) => console.warn(line),
  error: (line) => console.error(line),
};

/**
 * Resolve the correlation ID for a request. `cf-ray` is set by Cloudflare's
 * edge on every request that reaches a Worker, so it is already visible in
 * the Cloudflare dashboard's own logs and in `wrangler tail`. Falls back to a
 * generated UUID for requests built by hand (unit tests, local `astro dev`).
 */
export function requestIdFrom(request: Request): string {
  return request.headers.get('cf-ray') ?? crypto.randomUUID();
}

function errorFields(error: unknown): { errorMessage?: string; errorStack?: string; errorName?: string } {
  if (error === undefined) return {};
  if (error instanceof Error) {
    return { errorName: error.name, errorMessage: error.message, errorStack: error.stack };
  }
  return { errorMessage: String(error) };
}

/**
 * Emit one structured log line. Prefer `createRequestLogger` inside a route
 * handler; this is the primitive it and any non-request context (a cron
 * handler, a queue consumer) build on.
 */
export function log(
  severity: LogSeverity,
  fields: { requestId: string; action: string; route?: string; userId?: string | null; error?: unknown; [key: string]: unknown },
): void {
  const { error, ...rest } = fields;
  const record: LogRecord = {
    timestamp: new Date().toISOString(),
    severity,
    ...rest,
    ...(error !== undefined ? errorFields(error) : {}),
  } as LogRecord;
  SINKS[severity](JSON.stringify(record));
}

export interface RequestLogger {
  requestId: string;
  debug: (action: string, extra?: Record<string, unknown>) => void;
  info: (action: string, extra?: Record<string, unknown>) => void;
  warn: (action: string, extra?: Record<string, unknown>) => void;
  error: (action: string, error?: unknown, extra?: Record<string, unknown>) => void;
}

/**
 * Bind a request's correlation ID, route name, and (when known) the acting
 * user once, so every call site in the route is a one-line structured log
 * instead of a hand-built object. `userId` should be an actor identity that
 * is already safe to log at this pillar's bar (an admin email for
 * Access-gated routes, `null` for anonymous public routes) — never a raw
 * token or session secret.
 */
export function createRequestLogger(
  request: Request,
  defaults: { route: string; userId?: string | null },
): RequestLogger {
  const requestId = requestIdFrom(request);
  const base = { requestId, route: defaults.route, userId: defaults.userId ?? null };
  return {
    requestId,
    debug: (action, extra) => log('debug', { ...base, action, ...extra }),
    info: (action, extra) => log('info', { ...base, action, ...extra }),
    warn: (action, extra) => log('warn', { ...base, action, ...extra }),
    error: (action, error, extra) => log('error', { ...base, action, error, ...extra }),
  };
}
