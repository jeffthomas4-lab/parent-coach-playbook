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
import { isFeatureEnabled } from './lib/intel/config';
import { runOrgSweep } from './lib/intel/pipeline';

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

// Competitor-intelligence sweep: prospect organization websites only. A
// competitor_property run requires two separate human admin calls (propose,
// then approve) — see src/pages/api/admin/intel/runs.ts and
// runs/[id]/approve.ts. The scheduled path never calls runApprovedRun and
// never touches a competitor-owned property; it calls runOrgSweep only, and
// only when the feature is turned on for this environment.
export async function runIntelOrgSweep(env: PcdIntegrationEnv, context: ExecutionContext): Promise<void> {
  if (!isFeatureEnabled(env)) return;
  // The ambient Cloudflare `Env` type this repo's tsconfig pulls in is
  // deliberately empty (no project augments it — every route casts its own
  // local env shape from `cfEnv` instead), so PcdIntegrationEnv carries no
  // typed `DB` field at all. runOrgSweep needs the whole env (not just DB)
  // to read its own policy vars, so this is a plain runtime-env assertion,
  // not a narrowing of anything guarded above — this function is the
  // Worker's real scheduled handler, so DB is always bound in practice.
  const intelEnv = env as unknown as { DB: D1Database } & Record<string, unknown>;
  context.waitUntil(runOrgSweep(intelEnv).catch((error) => {
    console.error(JSON.stringify({
      event: 'intel_org_sweep_failed',
      code: error instanceof Error ? error.message.slice(0, 80) : 'unknown',
    }));
    throw error;
  }));
}

// The Worker's real scheduled handler: runs the existing BabyLove
// reconciliation and the intel org sweep on every cron tick, each in its own
// try/catch so a failure (or an unconfigured environment) in one can never
// stop the other from firing.
export async function scheduledReconciliationAndIntelSweep(
  controller: ScheduledController,
  env: PcdIntegrationEnv,
  context: ExecutionContext,
): Promise<void> {
  try {
    await scheduledBabyLoveReconciliation(controller, env, context);
  } catch (error) {
    console.error(JSON.stringify({
      event: 'babylove_reconciliation_dispatch_failed',
      code: error instanceof Error ? error.message.slice(0, 80) : 'unknown',
    }));
  }

  try {
    await runIntelOrgSweep(env, context);
  } catch (error) {
    console.error(JSON.stringify({
      event: 'intel_org_sweep_dispatch_failed',
      code: error instanceof Error ? error.message.slice(0, 80) : 'unknown',
    }));
  }
}

export default {
  fetch: (request: Request, env: PcdIntegrationEnv, context: ExecutionContext) => instrumentedHandler.fetch(request, env, context),
  scheduled: scheduledReconciliationAndIntelSweep,
};
