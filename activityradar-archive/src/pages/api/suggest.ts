// D6: Autocomplete endpoint — calls searchSuggest, returns JSON array.
// GET /api/suggest?q=soccer
// Response: [{ label: string, kind: 'organization' | 'category', slug: string }]

import type { APIRoute } from 'astro';
import { searchSuggest } from '../../lib/db';

export const prerender = false;

const CORS = { 'Access-Control-Allow-Origin': 'https://activityradar.com' };

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') ?? '').trim();

  if (q.length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }

  try {
    const db = (locals as any).runtime.env.DB as D1Database;
    const results = await searchSuggest(db, q, 8);
    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        ...CORS,
      },
    });
  } catch (err) {
    console.error('suggest error', err);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
