// D1 query helpers for the camps repository.
// Single file, clean separation. All SQL goes through here so callers don't
// need to know about D1 quirks (binding, Date serialization, etc).

import type { D1Database } from '@cloudflare/workers-types';

export type CampStatus = 'pending' | 'approved' | 'rejected';
export type TrustLevel = 'new' | 'trusted' | 'banned';
export type DayOrOvernight = 'day' | 'overnight';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';
export type SpotsStatus = 'open' | 'waitlist' | 'full';

export interface Camp {
  id: string;
  slug: string;
  name: string;
  sport: string;
  age_min: number;
  age_max: number;
  start_date: string; // ISO date YYYY-MM-DD
  end_date: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  price_text: string | null;
  day_or_overnight: DayOrOvernight;
  skill_level: SkillLevel;
  spots_status: SpotsStatus;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  lunch_included: 0 | 1;
  aftercare_available: 0 | 1;
  status: CampStatus;
  submitted_by_email: string;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

export interface Submitter {
  email: string;
  trust_level: TrustLevel;
  submission_count: number;
  approved_count: number;
  first_submitted_at: string;
  last_submitted_at: string;
  notes: string | null;
}

export interface NewCampInput {
  id: string;
  slug: string;
  name: string;
  sport: string;
  age_min: number;
  age_max: number;
  start_date: string;
  end_date: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  price_text: string | null;
  day_or_overnight: DayOrOvernight;
  skill_level: SkillLevel;
  spots_status: SpotsStatus;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  lunch_included: boolean;
  aftercare_available: boolean;
  submitted_by_email: string;
  submitted_at: string;
}

const nowIso = () => new Date().toISOString();

// ---------- Submitters ----------

export async function getSubmitter(db: D1Database, email: string): Promise<Submitter | null> {
  const row = await db
    .prepare('SELECT * FROM submitters WHERE email = ?')
    .bind(email)
    .first<Submitter>();
  return row ?? null;
}

export async function upsertSubmitterOnSubmission(
  db: D1Database,
  email: string,
  notes: string | null = null,
): Promise<Submitter> {
  const now = nowIso();
  // Insert with defaults if not present, otherwise increment counters and bump last_submitted.
  await db
    .prepare(
      `INSERT INTO submitters (email, trust_level, submission_count, approved_count, first_submitted_at, last_submitted_at, notes)
       VALUES (?, 'new', 1, 0, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         submission_count = submission_count + 1,
         last_submitted_at = excluded.last_submitted_at`,
    )
    .bind(email, now, now, notes)
    .run();
  const updated = await getSubmitter(db, email);
  if (!updated) throw new Error(`Submitter upsert failed for ${email}`);
  return updated;
}

export async function incrementSubmitterApproved(db: D1Database, email: string): Promise<void> {
  await db
    .prepare('UPDATE submitters SET approved_count = approved_count + 1 WHERE email = ?')
    .bind(email)
    .run();
}

export async function setSubmitterTrustLevel(
  db: D1Database,
  email: string,
  trust: TrustLevel,
): Promise<void> {
  await db
    .prepare('UPDATE submitters SET trust_level = ? WHERE email = ?')
    .bind(trust, email)
    .run();
}

// ---------- Camps ----------

export async function insertCamp(db: D1Database, camp: NewCampInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO camps (
         id, slug, name, sport, age_min, age_max, start_date, end_date,
         address, city, state, zip, latitude, longitude,
         description, price_text, day_or_overnight, skill_level, spots_status,
         contact_email, contact_phone, website_url, lunch_included, aftercare_available,
         status, submitted_by_email, submitted_at
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    )
    .bind(
      camp.id,
      camp.slug,
      camp.name,
      camp.sport,
      camp.age_min,
      camp.age_max,
      camp.start_date,
      camp.end_date,
      camp.address,
      camp.city,
      camp.state,
      camp.zip,
      camp.latitude,
      camp.longitude,
      camp.description,
      camp.price_text,
      camp.day_or_overnight,
      camp.skill_level,
      camp.spots_status,
      camp.contact_email,
      camp.contact_phone,
      camp.website_url,
      camp.lunch_included ? 1 : 0,
      camp.aftercare_available ? 1 : 0,
      camp.submitted_by_email,
      camp.submitted_at,
    )
    .run();
}

export async function getCampById(db: D1Database, id: string): Promise<Camp | null> {
  const row = await db
    .prepare('SELECT * FROM camps WHERE id = ?')
    .bind(id)
    .first<Camp>();
  return row ?? null;
}

export async function getCampBySlug(db: D1Database, slug: string): Promise<Camp | null> {
  const row = await db
    .prepare('SELECT * FROM camps WHERE slug = ?')
    .bind(slug)
    .first<Camp>();
  return row ?? null;
}

export async function listApprovedCamps(db: D1Database): Promise<Camp[]> {
  const result = await db
    .prepare('SELECT * FROM camps WHERE status = ? ORDER BY start_date ASC')
    .bind('approved')
    .all<Camp>();
  return result.results ?? [];
}

export async function listPendingCamps(db: D1Database): Promise<Camp[]> {
  const result = await db
    .prepare('SELECT * FROM camps WHERE status = ? ORDER BY submitted_at ASC')
    .bind('pending')
    .all<Camp>();
  return result.results ?? [];
}

export async function listAllCampSlugsApproved(db: D1Database): Promise<string[]> {
  const result = await db
    .prepare('SELECT slug FROM camps WHERE status = ?')
    .bind('approved')
    .all<{ slug: string }>();
  return (result.results ?? []).map((r) => r.slug);
}

export async function approveCamp(
  db: D1Database,
  id: string,
  reviewer: string,
  notes: string | null = null,
): Promise<Camp | null> {
  const camp = await getCampById(db, id);
  if (!camp) return null;
  await db
    .prepare(
      `UPDATE camps
         SET status = 'approved', reviewed_by = ?, reviewed_at = ?, review_notes = ?
         WHERE id = ?`,
    )
    .bind(reviewer, nowIso(), notes, id)
    .run();
  await incrementSubmitterApproved(db, camp.submitted_by_email);
  return getCampById(db, id);
}

export async function rejectCamp(
  db: D1Database,
  id: string,
  reviewer: string,
  notes: string | null = null,
): Promise<Camp | null> {
  await db
    .prepare(
      `UPDATE camps
         SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, review_notes = ?
         WHERE id = ?`,
    )
    .bind(reviewer, nowIso(), notes, id)
    .run();
  return getCampById(db, id);
}

// ---------- Slug + ID helpers ----------

export function generateCampId(): string {
  // crypto.randomUUID is available in the Workers runtime.
  return crypto.randomUUID();
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function uniqueSlug(db: D1Database, base: string): Promise<string> {
  let slug = slugify(base);
  if (!slug) slug = 'camp';
  const existing = await getCampBySlug(db, slug);
  if (!existing) return slug;
  // Append a short suffix until unique.
  for (let i = 0; i < 50; i += 1) {
    const candidate = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    const conflict = await getCampBySlug(db, candidate);
    if (!conflict) return candidate;
  }
  // Last-ditch: append a UUID slice.
  return `${slug}-${crypto.randomUUID().slice(0, 8)}`;
}

// ---------- Geocoding (Nominatim, OpenStreetMap) ----------

/**
 * Free geocoding via Nominatim. Subject to their usage policy: 1 req/sec,
 * include a User-Agent that identifies the application.
 *
 * Returns null if no result. Caller decides whether to require coordinates.
 */
export async function geocode(
  address: string,
  city: string,
  state: string,
  zip: string,
): Promise<{ lat: number; lon: number } | null> {
  const q = `${address}, ${city}, ${state} ${zip}`;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', q);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'parentcoachplaybook.com camps directory (parentcoachplaybook@gmail.com)',
      'Accept-Language': 'en',
    },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Array<{ lat: string; lon: string }>;
  if (!data.length) return null;
  const [first] = data;
  const lat = Number.parseFloat(first.lat);
  const lon = Number.parseFloat(first.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}
