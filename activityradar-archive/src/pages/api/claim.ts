// POST /api/claim
// Inserts a claim request into org_claims. Returns JSON { ok, error }.
export const prerender = false;

import type { APIRoute } from 'astro';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://activityradar.com',
};

export const OPTIONS: APIRoute = () =>
  new Response(null, { status: 204, headers: JSON_HEADERS });

export const POST: APIRoute = async ({ request, locals }) => {
  const db = (locals as any).runtime.env.DB as D1Database;

  // Parse body once upfront.
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400, headers: JSON_HEADERS,
    });
  }

  // Verify Turnstile token when secret key is configured (skip in dev).
  const turnstileSecret = (locals as any).runtime?.env?.TURNSTILE_SECRET_KEY as string | undefined;
  if (turnstileSecret) {
    const token = body['cf-turnstile-response'];
    if (!token) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_captcha' }), {
        status: 400, headers: JSON_HEADERS,
      });
    }
    const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(token)}`,
    });
    const result = await verify.json() as { success: boolean };
    if (!result.success) {
      return new Response(JSON.stringify({ ok: false, error: 'captcha_failed' }), {
        status: 403, headers: JSON_HEADERS,
      });
    }
  }

  const { organization_id, claimant_name, claimant_email, claimant_role, evidence } = body;

  if (!organization_id || !claimant_name || !claimant_email) {
    return new Response(
      JSON.stringify({ ok: false, error: 'missing_fields' }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  // Confirm the org exists
  const org = await db
    .prepare('SELECT id, name, is_claimed FROM organizations WHERE id = ? LIMIT 1')
    .bind(organization_id)
    .first<{ id: string; name: string; is_claimed: number }>();

  if (!org) {
    return new Response(
      JSON.stringify({ ok: false, error: 'org_not_found' }),
      { status: 404, headers: JSON_HEADERS },
    );
  }

  if (org.is_claimed) {
    return new Response(
      JSON.stringify({ ok: false, error: 'already_claimed' }),
      { status: 409, headers: JSON_HEADERS },
    );
  }

  // Check for an existing pending claim from this email
  const existing = await db
    .prepare(
      "SELECT id FROM org_claims WHERE organization_id = ? AND claimant_email = ? AND status = 'pending' LIMIT 1",
    )
    .bind(organization_id, claimant_email)
    .first();

  if (existing) {
    return new Response(
      JSON.stringify({ ok: false, error: 'duplicate_claim' }),
      { status: 409, headers: JSON_HEADERS },
    );
  }

  const id = crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO org_claims
         (id, organization_id, claimant_email, claimant_name, claimant_role, evidence, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(
      id,
      organization_id,
      claimant_email.trim().toLowerCase(),
      claimant_name.trim(),
      claimant_role?.trim() ?? null,
      evidence?.trim() ?? null,
      new Date().toISOString(),
    )
    .run();

  return new Response(JSON.stringify({ ok: true, claim_id: id }), {
    status: 201,
    headers: JSON_HEADERS,
  });
};
