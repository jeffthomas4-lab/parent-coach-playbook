import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import {
  reviewOrgContact,
  type ContactReviewDecision,
  type ContactReviewEnv,
  type PrivateContactContext,
} from '../../../../lib/contact-review';
import { createRequestLogger } from '../../../../lib/log';

export const prerender = false;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

const fail = (error: string, status: number, code = error) => json({ ok: false, error, code }, status);
const DECISIONS = new Set<ContactReviewDecision>(['approve_professional', 'classify_private']);
const PRIVATE_CONTEXTS = new Set<PrivateContactContext>(['family', 'guardian', 'minor', 'roster']);

interface ReviewBody {
  id?: unknown;
  expected_updated_at?: unknown;
  expected_content_hash?: unknown;
  decision?: unknown;
  private_context?: unknown;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as (ContactReviewEnv & {
    ADMIN_EMAILS?: string;
    ACCESS_TEAM_DOMAIN?: string;
    ACCESS_AUD?: string;
    SITE_URL?: string;
  }) | undefined;
  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  if (!env?.DB || !env.PCD_OPS_DB) return fail('CRM review databases are unavailable', 503, 'binding_unavailable');
  const logger = createRequestLogger(request, { route: 'admin/contacts/review', userId: auth.email });

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 4096) return fail('request body too large', 413, 'body_too_large');

  let body: ReviewBody;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return fail('JSON body must be an object', 400, 'invalid_json');
    }
    body = parsed as ReviewBody;
  } catch {
    return fail('invalid JSON body', 400, 'invalid_json');
  }
  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const expectedUpdatedAt = typeof body.expected_updated_at === 'string' ? body.expected_updated_at.trim() : '';
  const expectedContentHash = typeof body.expected_content_hash === 'string' ? body.expected_content_hash.trim().toLowerCase() : '';
  const decision = typeof body.decision === 'string' ? body.decision as ContactReviewDecision : null;
  const privateContext = typeof body.private_context === 'string' ? body.private_context as PrivateContactContext : undefined;

  if (!id || id.length > 200) return fail('valid id is required', 400, 'invalid_id');
  if (!expectedUpdatedAt || expectedUpdatedAt.length > 64 || !Number.isFinite(Date.parse(expectedUpdatedAt))) {
    return fail('valid expected_updated_at is required', 400, 'invalid_updated_at');
  }
  if (!/^[0-9a-f]{64}$/.test(expectedContentHash)) return fail('valid expected_content_hash is required', 400, 'invalid_content_hash');
  if (!decision || !DECISIONS.has(decision)) return fail('unknown decision', 400, 'invalid_decision');
  if (decision === 'classify_private' && (!privateContext || !PRIVATE_CONTEXTS.has(privateContext))) {
    return fail('a protected private_context is required', 400, 'invalid_private_context');
  }
  if (decision === 'approve_professional' && privateContext) {
    return fail('private_context is not valid for approval', 400, 'invalid_private_context');
  }

  try {
    const result = await reviewOrgContact(env, {
      id,
      expectedUpdatedAt,
      expectedContentHash,
      decision,
      privateContext,
      actorEmail: auth.email,
      environment: env.SITE_URL ?? 'unknown',
      requestId: logger.requestId,
    });
    if (!result.ok) {
      const status = result.code === 'not_found' ? 404 : result.code === 'state_changed' ? 409 : 422;
      return fail(result.reason, status, result.code);
    }
    return json({
      ok: true,
      id: result.id,
      decision: result.decision,
      is_public: result.isPublic,
      contact_context: result.contactContext,
    });
  } catch (error) {
    logger.error('contact_review_commit_failed', error, { contactId: id });
    return fail('contact review did not commit', 503, 'review_commit_failed');
  }
};
