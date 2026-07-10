/**
 * Shared activity-database read layer.
 *
 * This is the single read API both ActivityRadar and Parent Coach Desk call
 * (OS chapter 07-02, "API Design"). ActivityRadar reads the whole graph;
 * Parent Coach Desk reads it filtered to program_type='camp'. Same database,
 * two front doors.
 *
 * D1 is SQLite. JSON columns (categories, program_types, social_urls) are stored
 * as TEXT and parsed here. Radius search uses the haversine formula carried
 * forward from the camps build.
 */

export interface Env {
  DB: D1Database;
  PHOTOS: R2Bucket;
  SITE_URL: string;
}

export interface Organization {
  id: string;
  slug: string;
  name: string;
  organization_type: string;
  website_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  categories: string[];
  age_min: number | null;
  age_max: number | null;
  program_types: string[];
  description: string | null;
  is_claimed: boolean;
  record_source: string;
  confidence_score: number;
  distance_miles?: number;
}

export interface Program {
  id: string;
  organization_id: string;
  slug: string;
  name: string;
  program_type: string;
  activity_category: string;
  description: string | null;
  age_min: number | null;
  age_max: number | null;
  price: number | null;
  price_type: string | null;
  price_text: string | null;
  registration_url: string | null;
  availability_status: string;
  session_start_date: string | null;
  session_end_date: string | null;
  record_status: string;
  // Extended fields from the full schema
  skill_level: string | null;
  schedule_text: string | null;
  days_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  season: string | null;
  day_or_overnight: string | null;
  lunch_included: number | null;
  aftercare_available: number | null;
  location_notes: string | null;
}

export interface OrgSearchParams {
  q?: string;            // free-text search over org name, description, categories
  lat?: number;
  lng?: number;
  radiusMiles?: number;
  age?: number;
  category?: string;     // activity_category slug
  programType?: string;  // 'camp' filters to the Parent Coach Desk view
  minPrice?: number;
  maxPrice?: number;
  availableNow?: boolean;
  limit?: number;
  offset?: number;
}

const EARTH_MILES = 3958.8;

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseJsonArray(v: unknown): string[] {
  if (!v) return [];
  try {
    const p = JSON.parse(v as string);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

// Replace Mojibake sequences that result from UTF-8 bytes stored as Windows-1252.
// Applies to any text field coming out of D1.
function fixMojibake(s: string | null | undefined): string | null {
  if (!s) return s ?? null;
  return s
    .replace(/ΓÇô/g, '–')  // en dash –
    .replace(/ΓÇö/g, '—')  // em dash —
    .replace(/ΓÇÿ/g, '‘')  // left single quote '
    .replace(/ΓÇÖ/g, '’')  // right single quote '
    .replace(/ΓÇ£/g, '“')  // left double quote "
    .replace(/ΓÇ¥/g, '”')  // right double quote "
    .replace(/Γäó/g, '™')  // trademark ™
    .replace(/\xE2\x80\x93/g, '–') // UTF-8 bytes misread as Latin-1
    .replace(/\xE2\x80\x94/g, '—');
}

function rowToOrg(r: Record<string, unknown>): Organization {
  return {
    id: r.id as string,
    slug: r.slug as string,
    name: r.name as string,
    organization_type: r.organization_type as string,
    website_url: (r.website_url as string) ?? null,
    email: (r.email as string) ?? null,
    phone: (r.phone as string) ?? null,
    address: (r.address as string) ?? null,
    city: (r.city as string) ?? null,
    state: (r.state as string) ?? null,
    zip: (r.zip as string) ?? null,
    latitude: (r.latitude as number) ?? null,
    longitude: (r.longitude as number) ?? null,
    categories: parseJsonArray(r.categories),
    age_min: (r.age_min as number) ?? null,
    age_max: (r.age_max as number) ?? null,
    program_types: parseJsonArray(r.program_types),
    description: fixMojibake(r.description as string),
    is_claimed: !!r.is_claimed,
    record_source: r.record_source as string,
    confidence_score: (r.confidence_score as number) ?? 0,
  };
}

/**
 * GET /organizations/search — the full parent search.
 * Joins programs so age/category/price/availability filters apply at the
 * program level (an org matches if it has at least one program that matches).
 * Radius filtering is applied in JS after a bounding-box prefilter in SQL.
 */
export async function searchOrganizations(db: D1Database, p: OrgSearchParams) {
  const where: string[] = ['o.record_status = ?'];
  const args: unknown[] = ['active'];

  // Free-text filter over org name, description, and stored categories JSON.
  if (p.q) {
    const like = `%${p.q}%`;
    where.push('(LOWER(o.name) LIKE LOWER(?) OR LOWER(o.description) LIKE LOWER(?) OR LOWER(o.categories) LIKE LOWER(?))');
    args.push(like, like, like);
  }

  // Program-level filters via EXISTS so an org is returned once.
  const progConds: string[] = ["pr.organization_id = o.id", "pr.record_status != 'inactive'"];
  if (p.age != null) { progConds.push('pr.age_min <= ? AND pr.age_max >= ?'); args.push(p.age, p.age); }
  if (p.category) { progConds.push('pr.activity_category = ?'); args.push(p.category); }
  if (p.programType) { progConds.push('pr.program_type = ?'); args.push(p.programType); }
  if (p.minPrice != null) { progConds.push('(pr.price IS NULL OR pr.price >= ?)'); args.push(p.minPrice); }
  if (p.maxPrice != null) { progConds.push('(pr.price IS NULL OR pr.price <= ?)'); args.push(p.maxPrice); }
  if (p.availableNow) { progConds.push("pr.availability_status = 'open'"); }
  where.push(`EXISTS (SELECT 1 FROM programs pr WHERE ${progConds.join(' AND ')})`);

  // Bounding-box prefilter for radius (cheap in SQL; exact haversine in JS).
  if (p.lat != null && p.lng != null && p.radiusMiles) {
    const dLat = p.radiusMiles / 69;
    const dLng = p.radiusMiles / (69 * Math.cos((p.lat * Math.PI) / 180) || 1);
    where.push('o.latitude BETWEEN ? AND ?'); args.push(p.lat - dLat, p.lat + dLat);
    where.push('o.longitude BETWEEN ? AND ?'); args.push(p.lng - dLng, p.lng + dLng);
  }

  const sql = `SELECT * FROM organizations o WHERE ${where.join(' AND ')}
    ORDER BY o.confidence_score DESC LIMIT ? OFFSET ?`;
  args.push(p.limit ?? 50, p.offset ?? 0);

  const res = await db.prepare(sql).bind(...args).all();
  let orgs = (res.results as Record<string, unknown>[]).map(rowToOrg);

  if (p.lat != null && p.lng != null && p.radiusMiles) {
    orgs = orgs
      .filter((o) => o.latitude != null && o.longitude != null)
      .map((o) => ({ ...o, distance_miles: haversine(p.lat!, p.lng!, o.latitude!, o.longitude!) }))
      .filter((o) => o.distance_miles <= p.radiusMiles!)
      .sort((a, b) => a.distance_miles! - b.distance_miles!);
  }
  return orgs;
}

/** GET /organizations/{id} — full org record with programs and trust signals. */
export async function getOrganization(db: D1Database, idOrSlug: string) {
  const org = await db
    .prepare('SELECT * FROM organizations WHERE id = ? OR slug = ? LIMIT 1')
    .bind(idOrSlug, idOrSlug)
    .first<Record<string, unknown>>();
  if (!org) return null;

  const programs = await db
    .prepare("SELECT * FROM programs WHERE organization_id = ? AND record_status != 'inactive' ORDER BY session_start_date")
    .bind(org.id)
    .all();
  const trust = await db
    .prepare('SELECT signal_type, signal_value, signal_source, verified_at FROM trust_signals WHERE organization_id = ?')
    .bind(org.id)
    .all();

  const sanitizedPrograms = (programs.results as unknown as Program[]).map((pr) => ({
    ...pr,
    description: fixMojibake(pr.description) ?? null,
    price_text: fixMojibake(pr.price_text) ?? null,
    schedule_text: fixMojibake(pr.schedule_text) ?? null,
    location_notes: fixMojibake(pr.location_notes) ?? null,
  }));

  return {
    organization: rowToOrg(org),
    programs: sanitizedPrograms,
    trust_signals: trust.results,
  };
}

/** GET /programs/search — program-level search (the camps view uses this). */
export async function searchPrograms(db: D1Database, programType?: string, limit = 50, offset = 0) {
  const where: string[] = ["record_status != 'inactive'"];
  const args: unknown[] = [];
  if (programType) { where.push('program_type = ?'); args.push(programType); }
  args.push(limit, offset);
  const res = await db
    .prepare(`SELECT * FROM programs WHERE ${where.join(' AND ')} ORDER BY confidence_score DESC LIMIT ? OFFSET ?`)
    .bind(...args)
    .all();
  return res.results as unknown as Program[];
}

/** GET /search-suggest — autocomplete over org names, categories, cities. */
export async function searchSuggest(db: D1Database, q: string, limit = 8) {
  const like = `%${q}%`;
  const res = await db
    .prepare(
      `SELECT id, name AS label, 'organization' AS kind, slug FROM organizations WHERE name LIKE ? AND record_status='active'
       UNION ALL
       SELECT '' AS id, name AS label, 'category' AS kind, slug FROM activity_categories WHERE name LIKE ?
       LIMIT ?`
    )
    .bind(like, like, limit)
    .all();
  return res.results;
}

/** GET /programs/{id} — full program record with its parent organization. */
export async function getProgram(db: D1Database, idOrSlug: string) {
  const prog = await db
    .prepare('SELECT * FROM programs WHERE id = ? OR slug = ? LIMIT 1')
    .bind(idOrSlug, idOrSlug)
    .first<Record<string, unknown>>();
  if (!prog) return null;

  const org = await db
    .prepare('SELECT * FROM organizations WHERE id = ? LIMIT 1')
    .bind(prog.organization_id)
    .first<Record<string, unknown>>();

  return {
    program: prog as unknown as Program,
    organization: org ? rowToOrg(org) : null,
  };
}

/**
 * Demand-intelligence write. Logs one parent search (OS 07-02 search_events).
 * Accepts an optional `id` field so the caller can capture the event UUID for
 * N2 click-through tracking. Returns the inserted UUID.
 */
export async function logSearchEvent(db: D1Database, ev: Record<string, unknown>): Promise<string> {
  const id = (ev.id as string | undefined) ?? crypto.randomUUID();
  await db
    .prepare(
      `INSERT INTO search_events
       (id, created_at, query, location_searched, latitude, longitude, radius_miles,
        age_searched, categories_searched, price_min, price_max, available_now,
        result_count, clicked_org_ids, source)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .bind(
      id,
      new Date().toISOString(),
      ev.query ?? null,
      ev.location_searched ?? null,
      ev.latitude ?? null,
      ev.longitude ?? null,
      ev.radius_miles ?? null,
      ev.age_searched ?? null,
      ev.categories_searched ? JSON.stringify(ev.categories_searched) : null,
      ev.price_min ?? null,
      ev.price_max ?? null,
      ev.available_now ?? null,
      ev.result_count ?? null,
      ev.clicked_org_ids ? JSON.stringify(ev.clicked_org_ids) : null,
      ev.source ?? 'activityradar'
    )
    .run();
  return id;
}

/**
 * Demand-triggered enrichment queue.
 * Called after every search that returns org results. One queue slot per org
 * (enforced by UNIQUE on org_id). Each additional search hit increments priority
 * so high-demand orgs are enriched first. Orgs already marked 'done' stay done.
 */
export async function enqueueOrgsForEnrichment(db: D1Database, orgIds: string[]): Promise<void> {
  if (orgIds.length === 0) return;
  const now = new Date().toISOString();
  const stmts = orgIds.map(id =>
    db.prepare(`
      INSERT INTO enrichment_queue (id, org_id, priority, status, attempts, created_at)
      VALUES (?, ?, 1, 'pending', 0, ?)
      ON CONFLICT(org_id) DO UPDATE SET
        priority = priority + 1,
        status   = CASE WHEN status = 'done' THEN 'done' ELSE 'pending' END
    `).bind(crypto.randomUUID(), id, now)
  );
  await db.batch(stmts);
}
