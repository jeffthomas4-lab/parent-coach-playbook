// Technical readiness only. Customer-journey and business-data health require
// independent synthetic checks; SELECT 1 cannot certify useful directory data.
import type { APIRoute } from 'astro';
import { env as cfEnv } from 'cloudflare:workers';

export const prerender = false;

const json = (body: unknown, status: number) => Response.json(body, {
  status,
  headers: { 'Cache-Control': 'no-store' },
});

export const GET: APIRoute = async () => {
  const env = cfEnv as { DB?: D1Database } | undefined;
  if (!env?.DB) {
    return json({ ok: false, service: 'parent-coach-desk', check: 'readiness', code: 'db_binding_missing' }, 503);
  }

  try {
    const result = await env.DB.prepare('SELECT 1 AS ok').first<{ ok: number }>();
    if (result?.ok !== 1) {
      return json({ ok: false, service: 'parent-coach-desk', check: 'readiness', code: 'db_probe_invalid' }, 503);
    }
  } catch {
    return json({ ok: false, service: 'parent-coach-desk', check: 'readiness', code: 'db_unavailable' }, 503);
  }

  return json({ ok: true, service: 'parent-coach-desk', check: 'readiness' }, 200);
};
