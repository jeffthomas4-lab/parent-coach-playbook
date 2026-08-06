// POST /api/admin/intel/runs/:id/approve
//
// The human approval gate. approveRun() flips a 'proposed' run to 'approved'
// (409 if it is not currently 'proposed' — no re-approving, no approving a
// run that's already running/complete/failed/cancelled). Once approved, this
// route is also the ONLY place in the admin surface that ever calls
// runApprovedRun — never the cron path (src/worker.ts calls runOrgSweep
// only), and never runs.ts's POST (which only proposes). A competitor_property
// run therefore always requires two separate human admin calls: POST
// /runs to propose it, then this route to approve AND execute it.
//
// Execution runs behind ctx.waitUntil when the platform context is available
// (production/preview Workers), or is awaited directly otherwise (local dev
// outside wrangler, or a unit test) — same pattern as
// src/pages/api/camps/lite.ts's background refresh. Either way, a failure in
// runApprovedRun is logged and does not change the response: approveRun's own
// success is what this route reports, since by the time execution runs the
// approval itself is already durably committed and receipted.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../../../lib/admin-auth';
import { approveRun } from '../../../../../../lib/intel/store';
import { runApprovedRun } from '../../../../../../lib/intel/pipeline';
import { withAdminReceipt, type MutationOutcome } from '../../../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../../../lib/log';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

// DB is required (not optional) here, deliberately: the `env?.DB` guard just
// below only needs to rule out `env` itself being undefined, and passing the
// narrowed `env` on to runApprovedRun (which needs the whole env, not just
// DB) then typechecks without a separate non-null assertion at each call
// site — same idiom src/pages/api/admin/camps/[id]/approve.ts uses.
type ApproveEnv = { DB: D1Database; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string };

type RuntimeLocals = { runtime?: { ctx?: { waitUntil?: (p: Promise<unknown>) => void } } };

export const POST: APIRoute = async ({ params, request, locals }) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'POST' });

  const env = cfEnv as ApproveEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/runs/[id]/approve', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const id = params.id;
  if (!id) return json({ ok: false, error: 'missing id' }, 400);

  const requestId = logger.requestId;

  const receipted = await withAdminReceipt(
    {
      env,
      environment: env.SITE_URL ?? 'unknown',
      actorEmail: auth.email,
      action: 'intel.run.approve',
      resourceType: 'intel_run',
      resourceId: id,
      requestId,
      authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    },
    async (): Promise<MutationOutcome<{ run: Awaited<ReturnType<typeof approveRun>> }>> => {
      let run;
      try {
        run = await approveRun(env.DB, id, auth.email);
      } catch (error) {
        logger.error('intel_run_approve_failed', error, { runId: id });
        return {
          outcome: 'error',
          reason: 'approve_threw',
          response: json({ ok: false, error: 'run could not be approved' }, 500),
        };
      }
      if (!run) {
        return {
          outcome: 'blocked',
          reason: 'run_not_found_or_not_proposed',
          response: json({ ok: false, error: 'run not found or not in proposed status' }, 409),
        };
      }
      return {
        outcome: 'success',
        value: { run },
        beforeSummary: 'status=proposed',
        afterSummary: `status=approved run_type=${run.run_type}`,
      };
    },
  );

  if ('response' in receipted) return receipted.response;
  const { run } = receipted.value;
  // The receipt callback already returns 409 when approveRun yields null, but the
  // receipt wrapper widens the value type, so narrow again before use.
  if (!run) {
    return json({ ok: false, error: 'run not found or not in proposed status' }, 409);
  }

  const execution = runApprovedRun(env, id).catch((error) => {
    logger.error('intel_run_execution_failed', error, { runId: id, runType: run.run_type });
  });

  const runtimeCtx = (locals as RuntimeLocals | undefined)?.runtime?.ctx;
  if (typeof runtimeCtx?.waitUntil === 'function') {
    runtimeCtx.waitUntil(execution);
  } else {
    await execution;
  }

  return json({ ok: true, run });
};
