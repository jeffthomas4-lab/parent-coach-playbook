import astroWorker from '@astrojs/cloudflare/entrypoints/server';
import * as Sentry from '@sentry/cloudflare';
import type { AdminAuthEnv } from './lib/admin-auth';
import { enforceAdministrativeRequest } from './lib/admin-runtime-gate';
import { withWorkerSecurityHeaders } from './lib/security-headers';
import {
  handleBabyLoveWebhook,
  reconcileBabyLoveArticles,
  type BabyLoveEnv,
} from './lib/babylove-growth';
import {
  createInstrumentedHandler,
  type SentryWorkerEnv,
  type WithSentryFn,
  type WorkerHandler,
} from './lib/sentry-worker';

type AstroWorkerEnv = Parameters<typeof astroWorker.fetch>[1];
type PcdWorkerEnv = AstroWorkerEnv & AdminAuthEnv & SentryWorkerEnv;
type PcdIntegrationEnv = PcdWorkerEnv & BabyLoveEnv;

export async function fetchWithAdminGate(
  request: Request,
  env: PcdIntegrationEnv,
  context: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/api/integrations/babylovegrowth/articles') {
    return withWorkerSecurityHeaders(await handleBabyLoveWebhook(request, env, context), url.pathname);
  }
  const authFailure = await enforceAdministrativeRequest(request, env);
  if (authFailure) return withWorkerSecurityHeaders(authFailure, url.pathname);
  return astroWorker.fetch(request, env, context);
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
const instrumentedHandler = createInstrumentedHandler(rawHandler, Sentry.withSentry as unknown as WithSentryFn);

export async function scheduledBabyLoveReconciliation(
  _controller: ScheduledController,
  env: PcdIntegrationEnv,
  context: ExecutionContext,
): Promise<void> {
  context.waitUntil(reconcileBabyLoveArticles(env).catch((error) => {
    console.error(JSON.stringify({
      event: 'babylove_reconciliation_failed',
      code: error instanceof Error ? error.message.slice(0, 80) : 'unknown',
    }));
    throw error;
  }));
}

export default {
  fetch: (request: Request, env: PcdIntegrationEnv, context: ExecutionContext) => instrumentedHandler.fetch(request, env, context),
  scheduled: scheduledBabyLoveReconciliation,
};
