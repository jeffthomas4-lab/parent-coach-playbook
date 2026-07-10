// N2: Click-tracking endpoint.
// POST /api/log-click
// Body (JSON): { event_id: string, org_id: string }
// Updates the search_events row to append the clicked org to clicked_org_ids.

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { event_id, org_id } = await request.json();
    if (!event_id || !org_id) {
      return new Response(JSON.stringify({ ok: false }), { status: 400 });
    }

    const db = (locals as any).runtime.env.DB as D1Database;

    // Read current clicked_org_ids, append, write back.
    const row = await db
      .prepare('SELECT clicked_org_ids FROM search_events WHERE id = ? LIMIT 1')
      .bind(event_id)
      .first<{ clicked_org_ids: string | null }>();

    if (!row) {
      return new Response(JSON.stringify({ ok: false }), { status: 404 });
    }

    let ids: string[] = [];
    try { ids = JSON.parse(row.clicked_org_ids ?? '[]'); } catch {}
    if (!ids.includes(org_id)) ids.push(org_id);

    await db
      .prepare('UPDATE search_events SET clicked_org_ids = ? WHERE id = ?')
      .bind(JSON.stringify(ids), event_id)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('log-click error', err);
    return new Response(JSON.stringify({ ok: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
