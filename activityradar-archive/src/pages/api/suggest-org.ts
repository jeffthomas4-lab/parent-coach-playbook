// Suggest-org API endpoint.
// POST /api/suggest-org
// Body: { org_name, org_website?, org_city?, org_state?, activity_type?, submitter_email?, notes? }
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

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: JSON_HEADERS,
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

  const {
    org_name,
    org_website,
    org_city,
    org_state,
    activity_type,
    submitter_email,
    notes,
  } = body;

  if (!org_name || !org_name.trim()) {
    return new Response(JSON.stringify({ ok: false, error: 'missing_org_name' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const id = crypto.randomUUID();
  const submitted_at = new Date().toISOString();

  try {
    await db
      .prepare(
        `INSERT INTO org_suggestions
          (id, org_name, org_website, org_city, org_state, activity_type, submitter_email, notes, status, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
      )
      .bind(
        id,
        org_name.trim(),
        org_website?.trim() || null,
        org_city?.trim() || null,
        org_state?.trim() || null,
        activity_type?.trim() || null,
        submitter_email?.trim() || null,
        notes?.trim() || null,
        submitted_at
      )
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    console.error('suggest-org insert error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'db_error' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
};
