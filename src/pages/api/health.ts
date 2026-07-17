// Process liveness only. This endpoint deliberately does not touch D1, R2,
// Forge Command, email, Slack, or any other dependency.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => Response.json(
  { ok: true, service: 'parent-coach-desk', check: 'liveness' },
  { headers: { 'Cache-Control': 'no-store' } },
);

export const HEAD: APIRoute = async () => new Response(null, {
  status: 200,
  headers: { 'Cache-Control': 'no-store' },
});
