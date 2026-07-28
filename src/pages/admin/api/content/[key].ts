// Inline editor: the save and revert endpoint.
//
// POST   /admin/api/content/:key   { value, expectedRevision }  -> update
// DELETE /admin/api/content/:key                                -> revert to repo fallback
//
// Lives under /admin/* deliberately, matching the camps endpoints: that prefix
// is already covered by the Cloudflare Access policy and by run_worker_first.
//
// Gate order matters and is asserted by tests:
//   1. admin identity  (verified Access JWT + ADMIN_EMAILS allowlist)
//   2. same-origin     (CSRF)
//   3. manifest allowlist  <- unregistered keys die here, before any parsing
//   4. server-side sanitize
//   5. optimistic-concurrency check
//   6. write, then receipt
//
// A spoofed Cf-Access-Authenticated-User-Email header gets nowhere, because
// requireAdmin reads the email from the signature-verified JWT claims.

import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin, type AdminAuthEnv } from '../../../../lib/admin-auth';
import { getRegion } from '../../../../lib/editable-regions';
import { sanitize } from '../../../../lib/overlay-sanitize';
import { readRegion, writeRegion, clearRegion, overlayEnabled, type OverlayEnv } from '../../../../lib/content-overlay';
import { writeReceiptOrFail } from '../../../../lib/overlay-receipts';

export const prerender = false;

type RouteEnv = AdminAuthEnv & OverlayEnv & {
  PCD_OPS_DB?: D1Database;
  ENVIRONMENT?: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

/** Correlation ID for the receipt and for the client's error surface. */
const requestIdOf = (request: Request) =>
  request.headers.get('CF-Ray') ?? `gen-${crypto.randomUUID()}`;

export const POST: APIRoute = async ({ params, request }) => {
  const env = cfEnv as RouteEnv | undefined;
  const requestId = requestIdOf(request);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  if (!overlayEnabled(env)) {
    return json({ ok: false, code: 'overlay_disabled', message: 'Inline editing is switched off.', requestId }, 503);
  }
  if (!env?.PCD_OPS_DB) {
    // No receipt store means no provable record, so the mutation does not happen.
    return json({ ok: false, code: 'receipts_unavailable', message: 'Cannot record this change right now.', requestId }, 503);
  }

  // 3. Manifest allowlist. Unregistered keys never reach KV.
  const region = getRegion(params.key ?? '');
  if (!region) {
    return json({ ok: false, code: 'unknown_region', message: 'That is not an editable region.', requestId }, 404);
  }

  let body: { value?: unknown; expectedRevision?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ ok: false, code: 'bad_request', message: 'Expected a JSON body.', requestId }, 400);
  }

  // 4. Server-side sanitize. The browser's opinion is not consulted.
  const cleaned = sanitize(typeof body.value === 'string' ? body.value : '', region);
  if (!cleaned.ok) {
    await recordSafely(env.PCD_OPS_DB, {
      environment: env.ENVIRONMENT ?? 'unknown',
      requestId,
      actorEmail: auth.email,
      authVerified: auth.verified,
      action: 'overlay.update',
      regionKey: region.key,
      regionLabel: region.label,
      revision: -1,
      before: null,
      after: null,
      result: 'rejected',
      reason: cleaned.code,
    });
    return json({ ok: false, code: cleaned.code, message: cleaned.message, requestId }, 422);
  }

  const previous = await readRegion(region.key, env);
  const expectedRevision =
    typeof body.expectedRevision === 'number' ? body.expectedRevision : undefined;

  // 5 + 6. Write, then receipt.
  const written = await writeRegion(region.key, cleaned.value, await digestOf(auth.email), env, expectedRevision);

  if (!written.ok) {
    const code = written.code;
    await recordSafely(env.PCD_OPS_DB, {
      environment: env.ENVIRONMENT ?? 'unknown',
      requestId,
      actorEmail: auth.email,
      authVerified: auth.verified,
      action: 'overlay.update',
      regionKey: region.key,
      regionLabel: region.label,
      revision: previous?.revision ?? 0,
      before: previous?.value ?? null,
      after: cleaned.value,
      result: code === 'conflict' ? 'conflict' : 'failed',
      reason: code,
    });

    if (code === 'conflict') {
      return json({
        ok: false,
        code: 'conflict',
        message: 'Someone else saved this region since you started editing.',
        current: written.current?.value ?? null,
        currentRevision: written.current?.revision ?? 0,
        requestId,
      }, 409);
    }
    // Explicitly NOT a success shape. The editor must not render "Saved".
    return json({ ok: false, code: 'write_failed', message: 'That change did not save. Nothing was published.', requestId }, 502);
  }

  try {
    await writeReceiptOrFail(env.PCD_OPS_DB, {
      environment: env.ENVIRONMENT ?? 'unknown',
      requestId,
      actorEmail: auth.email,
      authVerified: auth.verified,
      action: 'overlay.update',
      regionKey: region.key,
      regionLabel: region.label,
      revision: written.entry.revision,
      before: previous?.value ?? null,
      after: written.entry.value,
      result: 'applied',
    });
  } catch (error) {
    // Receipt failure cannot silently leave the mutation standing (Pillar 13).
    // Roll the value back to what it was and report failure.
    console.error('[overlay] receipt write failed, rolling back', { key: region.key, error: String(error) });
    if (previous) {
      await writeRegion(region.key, previous.value, await digestOf(auth.email), env);
    } else {
      await clearRegion(region.key, env);
    }
    return json({
      ok: false,
      code: 'receipt_failed',
      message: 'That change was rolled back because it could not be recorded.',
      requestId,
    }, 500);
  }

  return json({
    ok: true,
    value: written.entry.value,
    revision: written.entry.revision,
    updatedAt: written.entry.updatedAt,
    requestId,
  });
};

/** Revert a region to its in-repo fallback. */
export const DELETE: APIRoute = async ({ params, request }) => {
  const env = cfEnv as RouteEnv | undefined;
  const requestId = requestIdOf(request);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const region = getRegion(params.key ?? '');
  if (!region) {
    return json({ ok: false, code: 'unknown_region', message: 'That is not an editable region.', requestId }, 404);
  }
  if (!env?.PCD_OPS_DB) {
    return json({ ok: false, code: 'receipts_unavailable', message: 'Cannot record this change right now.', requestId }, 503);
  }

  const previous = await readRegion(region.key, env);
  const cleared = await clearRegion(region.key, env);
  if (!cleared) {
    return json({ ok: false, code: 'write_failed', message: 'That revert did not go through.', requestId }, 502);
  }

  await recordSafely(env.PCD_OPS_DB, {
    environment: env.ENVIRONMENT ?? 'unknown',
    requestId,
    actorEmail: auth.email,
    authVerified: auth.verified,
    action: 'overlay.revert',
    regionKey: region.key,
    regionLabel: region.label,
    revision: previous?.revision ?? 0,
    before: previous?.value ?? null,
    after: null,
    result: 'applied',
  });

  return json({ ok: true, reverted: true, requestId });
};

async function digestOf(email: string): Promise<string> {
  const { digestEmail } = await import('../../../../lib/overlay-receipts');
  return digestEmail(email);
}

/**
 * Receipt write for paths where the mutation already did or did not happen and
 * a throw would only make the response worse. Logged loudly on failure so the
 * ops watch can catch a receipt store that has gone quiet.
 */
async function recordSafely(db: D1Database, input: Parameters<typeof writeReceiptOrFail>[1]) {
  try {
    await writeReceiptOrFail(db, input);
  } catch (error) {
    console.error('[overlay] receipt write failed', { key: input.regionKey, error: String(error) });
  }
}
