import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import * as Sentry from '@sentry/cloudflare';
import type { AdminAuthEnv } from './lib/admin-auth';
import { enforceAdministrativeRequest } from './lib/admin-runtime-gate';
import { withWorkerSecurityHeaders } from './lib/security-headers';
import { applyOverlay } from './lib/overlay-rewriter';
import type { OverlayEnv } from './lib/content-overlay';
import {
  createInstrumentedHandler,
  type SentryWorkerEnv,
  type WithSentryFn,
  type WorkerHandler,
} from './lib/sentry-worker';

type AstroWorkerEnv = Parameters<typeof astroWorker.fetch>[1];
type PcdWorkerEnv = AstroWorkerEnv & AdminAuthEnv & SentryWorkerEnv & OverlayEnv;

export async function fetchWithAdminGate(
  request: Request,
  env: PcdWorkerEnv,
  context: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const authFailure = await enforceAdministrativeRequest(request, env);
  if (authFailure) return withWorkerSecurityHeaders(authFailure, url.pathname);

  const response = await astroWorker.fetch(request, env, context);

  // Inline editor: swap overlay values into prerendered HTML on the routes that
  // carry editable regions. Fails open by design — if KV is off, empty or
  // unreachable, applyOverlay returns the response untouched and the page
  // renders its in-repo fallbacks. It never throws into this path.
  return applyOverlay(response, url.pathname, env, request);
}

// The admin-gated composition root is the Worker's real handler.
const rawHandler: WorkerHandler = { fetch: fetchWithAdminGate };

// Sentry is wrapped MANUALLY here (not via @sentry/astro's automatic server
// integration) because the @astrojs/cloudflare v14 adapter emits
// `virtual:cloudflare/worker-entry`, so the automatic wrap does not apply
// (getsentry/sentry-javascript #21901). This repo owns its entry, so
// createInstrumentedHandler applies @sentry/cloudflare's withSentry ONLY when a
// SENTRY_DSN secret is bound. With no DSN, requests bypass Sentry entirely and
// run the raw admin-gated handler — a true pass-through (no waitUntil rebinding,
// no HEAD/OPTIONS bypass). withSentry captures exceptions from both the admin
// gate and the Astro handler and rethrows them; the SDK binds the passed
// ExecutionContext.waitUntil for post-response event flushing.
export default createInstrumentedHandler(rawHandler, Sentry.withSentry as unknown as WithSentryFn);
