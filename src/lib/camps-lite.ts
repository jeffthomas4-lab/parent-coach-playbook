// Shared campsLite projection — the slim per-camp record the /camps/ page's
// client-side search, filters, and Leaflet map run against.
//
// Until 2026-07-31 this array was built inline in src/pages/camps/index.astro's
// frontmatter and serialized into an inline <script type="application/json">
// island on every page load (~253,500 bytes projected at 311 approved camps —
// see reports/CAMPS-RENDERING-REBUILD-2026-07-31.md, the session that closed
// out STANDARD-AUDIT.md item #23). That island shipped on first paint even
// though the client only needs it once JavaScript is ready to filter or map
// anything, and the server-rendered cards on the same page need none of it at
// all. It now lives behind GET /api/camps/lite (src/pages/api/camps/lite.ts),
// which the client fetches in the background after first paint. This module
// is the one place the projection is built, so the endpoint's shape can never
// drift from what the client's LiteCamp interface (src/pages/camps/index.astro)
// expects.
//
// Kept intentionally slim: bounded to the fields the client filters, the map,
// and the shared card renderer (src/lib/camp-card.ts) actually read. The full
// D1 row (the `Camp` interface in camps-db.ts) carries many more admin-only
// columns a public reader's browser never needs to see.

import type { Camp } from './camps-db';

export interface CampsLiteRecord {
  id: string;
  name: string;
  slug: string;
  sport: string;
  age_min: number;
  age_max: number;
  age_known: 0 | 1;
  start_date: string | null;
  end_date: string | null;
  city: string;
  state: string;
  day_or_overnight: string;
  spots_status: string;
  verified: 0 | 1;
  last_verified_at: string | null;
  program_type: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string;
  hero_photo_key: string | null;
  price_text: string | null;
  date_added: string | null;
}

// Matches the description truncation the inline island always applied —
// enough for the search/filter substring match and the map popup, not the
// full editorial copy (which lives on the camp's own /camps/:slug/ page).
const DESCRIPTION_MAX_CHARS = 200;

export function toCampsLite(camps: Camp[]): CampsLiteRecord[] {
  return camps.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    sport: c.sport,
    age_min: c.age_min,
    age_max: c.age_max,
    age_known: c.age_known,
    start_date: c.start_date,
    end_date: c.end_date,
    city: c.city,
    state: c.state,
    day_or_overnight: c.day_or_overnight,
    spots_status: c.spots_status,
    verified: c.verified,
    last_verified_at: c.last_verified_at,
    program_type: c.program_type,
    latitude: c.latitude,
    longitude: c.longitude,
    description: (c.description || '').slice(0, DESCRIPTION_MAX_CHARS),
    hero_photo_key: c.hero_photo_key,
    price_text: c.price_text,
    date_added: c.date_added,
  }));
}
