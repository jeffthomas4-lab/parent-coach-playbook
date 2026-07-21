// POST /api/admin/source-quality/skip
//
// Adds or removes a domain from the admin skip-list (migrations/0017_domain_skip_list.sql).
// Body: { domain: string, action: 'add' | 'remove', reason?: string }
// 'add' requires a non-empty reason (the UI collects it via a prompt()).
// Enforcement of the skip-list happens separately, at POST /api/camps/submit.

import type { APIRoute } from 'astro';
import { requireAdmin, requireSameOrigin } from '../../../../lib/admin-auth';
import { addDomainToSkipList, removeDomainFromSkipList } from '../../../../lib/domain-skip-list';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

interface SkipPayload {
  domain?: string;
  action?: string;
  reason?: string;
}

async function readPayload(request: Request): Promise<SkipPayload> {
  const ct = (request.headers.get('content-type') ?? '').toLowerCase();
  if (ct.includes('application/json')) {
    return (await request.json()) as SkipPayload;
  }
  const fd = await request.formData();
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') out[k] = v;
  }
  return out as SkipPayload;
}

export const POST: APIRoute = async ({ request }) => {
  const env = cfEnv as { DB: D1Database; ADMIN_EMAILS?: string } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const auth = await requireAdmin(request, env);
  if (auth instanceof Response) return auth;

  const originErr = requireSameOrigin(request);
  if (originErr) return originErr;

  const payload = await readPayload(request);
  const domain = (payload.domain ?? '').trim().toLowerCase();
  if (!domain) return json({ ok: false, error: 'domain is required' }, 400);

  const action = payload.action === 'remove' ? 'remove' : payload.action === 'add' ? 'add' : null;
  if (!action) return json({ ok: false, error: "action must be 'add' or 'remove'" }, 400);

  if (action === 'add') {
    const reason = (payload.reason ?? '').trim();
    if (!reason) return json({ ok: false, error: 'reason is required to skip-list a domain' }, 400);
    await addDomainToSkipList(env.DB, domain, reason, auth.email);
    return json({ ok: true, domain, skip_listed: true, reason });
  }

  await removeDomainFromSkipList(env.DB, domain);
  return json({ ok: true, domain, skip_listed: false });
};
