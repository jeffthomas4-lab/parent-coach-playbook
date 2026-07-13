// GET /api/camps/nearest?lat=47.5&lon=-122.4
//
// Resolves a lat/lng to the nearest city we actually have approved camps in.
// Used by the client-side geolocation flow on /camps/.
//
// Returns: { ok: true, state: 'WA', city: 'Tacoma', city_slug: 'tacoma', count: 132 }
// or { ok: false, error: '...' } on failure / no camps within range.

import type { APIRoute } from 'astro';
import { slugifyCity } from '../../../lib/camps-db';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, s-maxage=300',
    },
  });

// Haversine, miles
function distMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const MAX_MILES = 75;

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals as any).runtime?.env as { DB?: D1Database } | undefined;
  if (!env?.DB) return json({ ok: false, error: 'database not available' }, 500);

  const url = new URL(request.url);
  const lat = parseFloat(url.searchParams.get('lat') || '');
  const lon = parseFloat(url.searchParams.get('lon') || '');
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return json({ ok: false, error: 'lat and lon required' }, 400);
  }

  // Pull every (city, state, latitude, longitude) we have. At 50K rows this would
  // be a lot to scan; for now D1 is small enough that this is fine. Future: build
  // a cities-with-centroid materialized view.
  //
  // Schema note: this reads the shared activity-radar organizations/programs graph,
  // not the retired flat `camps` table (folded in via the ActivityRadar merge,
  // 2026-07). city/state/latitude/longitude live on organizations; approval status
  // lives on programs.pcd_status.
  const result = await env.DB
    .prepare(`SELECT o.city AS city, o.state AS state, o.latitude AS latitude, o.longitude AS longitude
              FROM programs p
              JOIN organizations o ON p.organization_id = o.id
              WHERE p.pcd_status = 'approved' AND o.latitude IS NOT NULL AND o.longitude IS NOT NULL`)
    .all<{ city: string; state: string; latitude: number; longitude: number }>();
  const rows = result.results ?? [];
  if (rows.length === 0) return json({ ok: false, error: 'no camps' }, 404);

  // Group by (city, state), take centroid (avg lat/lng).
  type Group = { state: string; city: string; lat: number; lon: number; n: number };
  const groups = new Map<string, Group>();
  for (const r of rows) {
    const key = `${r.state}|${r.city}`;
    const g = groups.get(key);
    if (g) {
      g.lat = (g.lat * g.n + r.latitude) / (g.n + 1);
      g.lon = (g.lon * g.n + r.longitude) / (g.n + 1);
      g.n += 1;
    } else {
      groups.set(key, { state: r.state, city: r.city, lat: r.latitude, lon: r.longitude, n: 1 });
    }
  }

  let best: { group: Group; dist: number } | null = null;
  for (const g of groups.values()) {
    const d = distMiles(lat, lon, g.lat, g.lon);
    if (!best || d < best.dist) best = { group: g, dist: d };
  }
  if (!best || best.dist > MAX_MILES) {
    return json({ ok: false, error: 'nearest city is too far away' }, 404);
  }

  return json({
    ok: true,
    state: best.group.state,
    city: best.group.city,
    city_slug: slugifyCity(best.group.city),
    count: best.group.n,
    distance_miles: Math.round(best.dist * 10) / 10,
  });
};
