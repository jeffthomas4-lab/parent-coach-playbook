// GET  /api/admin/intel/runs   — list runs (paginated, optional status filter)
// POST /api/admin/intel/runs   — propose a new run. Body: { runType: 'org_sweep' | 'competitor_property' | 'manual', notes?: string }
//
// A created run is ALWAYS status 'proposed' — createRun never starts
// anything, and this route never calls approveRun or runApprovedRun. A
// competitor_property run in particular must go through two separate human
// admin calls: this POST (propose), then a separate call to
// runs/[id]/approve.ts (approve + execute). Never auto-approved here.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { createRun, listRuns } from '../../../../lib/intel/store';
import type { RunStatus, RunType } from '../../../../lib/intel/types';
import { recordAdminReceipt } from '../../../../lib/admin-receipts';
import { createRequestLogger } from '../../../../lib/log';
import { parseEnumParam, parseLimit, parseOffset } from '../../../../lib/intel-admin-http';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200, extraHeaders?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

const RUN_STATUSES: readonly RunStatus[] = ['proposed', 'approved', 'running', 'complete', 'failed', 'cancelled'];
const RUN_TYPES = new Set<RunType>(['org_sweep', 'competitor_property', 'manual']);

type RunsEnv = { DB?: D1Database; ADMIN_EMAILS?: string; PCD_OPS_DB?: D1Database; SITE_URL?: string };

export const GET: APIRoute = async ({ request }) => {
  if (request.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'GET' });

  const env = cfEnv as RunsEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/runs', userId: auth.email });

  const url = new URL(request.url);
  const limit = parseLimit(url.searchParams.get('limit'));
  if (!limit.ok) return json({ ok: false, error: limit.error }, 400);
  const offset = parseOffset(url.searchParams.get('offset'));
  if (!offset.ok) return json({ ok: false, error: offset.error }, 400);
  const status = parseEnumParam(url.searchParams.get('status'), RUN_STATUSES, 'status');
  if (!status.ok) return json({ ok: false, error: status.error }, 400);

  try {
    const runs = await listRuns(env.DB, { status: status.value, limit: limit.value, offset: offset.value });
    return json({ ok: true, runs, limit: limit.value, offset: offset.value });
  } catch (error) {
    logger.error('intel_runs_list_failed', error);
    return json({ ok: false, error: 'runs query failed' }, 500);
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405, { Allow: 'POST' });

  const env = cfEnv as RunsEnv | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const logger = createRequestLogger(request, { route: 'admin/intel/runs', userId: auth.email });

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  let body: { runType?: string; notes?: string };
  try {
    body = (await request.json()) as { runType?: string; notes?: string };
  } catch {
    return json({ ok: false, error: 'invalid json body' }, 400);
  }

  const runType = typeof body.runType === 'string' ? (body.runType.trim() as RunType) : undefined;
  if (!runType || !RUN_TYPES.has(runType)) {
    return json({ ok: false, error: 'runType must be org_sweep, competitor_property, or manual' }, 400);
  }
  const notes = typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim().slice(0, 500) : undefined;

  const requestId = logger.requestId;

  // createRun mints the run's own id, so — unlike an approve/reject on an
  // existing resource — there is no resourceId to hand withAdminReceipt
  // before the mutation runs. Receipt this one manually, after the id
  // exists, but with the same "never report success without a durable
  // receipt" discipline withAdminReceipt enforces elsewhere.
  let run: Awaited<ReturnType<typeof createRun>>;
  try {
    run = await createRun(env.DB, { runType, requestedBy: auth.email, notes });
  } catch (error) {
    logger.error('intel_run_create_failed', error, { runType });
    return json({ ok: false, error: 'run could not be created' }, 500);
  }

  if (!env.PCD_OPS_DB) {
    return json(
      { ok: false, code: 'RECEIPT_WRITE_FAILED', error: 'run created but could not be receipted (PCD_OPS_DB not bound)', request_id: requestId },
      500,
    );
  }

  const receipt = await recordAdminReceipt(env.PCD_OPS_DB, {
    environment: env.SITE_URL ?? 'unknown',
    actorEmail: auth.email,
    action: 'intel.run.propose',
    resourceType: 'intel_run',
    resourceId: run.id,
    requestId,
    authorizationContext: 'cloudflare-access-jwt:admin-allowlist',
    result: 'success',
    afterSummary: `run_type=${runType} status=${run.status}`,
  });
  if (!receipt.ok) {
    return json(
      { ok: false, code: 'RECEIPT_WRITE_FAILED', error: 'run created but the receipt failed to write; retry or contact support', request_id: requestId },
      500,
    );
  }

  // createRun's own contract is "a created run is always status 'proposed'" —
  // this route never starts anything, so the response simply reports what the
  // store handed back rather than re-asserting it.
  return json({ ok: true, run });
};
