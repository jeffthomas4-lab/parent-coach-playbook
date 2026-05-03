// D1 query helpers for the camps repository.
// Single file, clean separation. All SQL goes through here so callers don't
// need to know about D1 quirks (binding, Date serialization, etc).

import type { D1Database } from '@cloudflare/workers-types';

export type CampStatus = 'pending' | 'approved' | 'rejected';
export type TrustLevel = 'new' | 'trusted' | 'banned';
export type DayOrOvernight = 'day' | 'overnight';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'all';
export type SpotsStatus = 'open' | 'waitlist' | 'full';
export type ProgramType = 'camp' | 'league';

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
  verified: 0 | 1;
  hero_photo_key: string | null;
  is_claimed: 0 | 1;
  claimed_by_email: string | null;
  claim_paid_until: string | null;
  logo_key: string | null;
  gallery_keys: string | null;
  registration_url: string | null;
  last_edited_at: string | null;
  last_edited_by: string | null;
  program_type: ProgramType;
  registration_deadline: string | null;
  schedule_text: string | null;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CampReview {
  id: string;
  camp_id: string;
  reviewer_email: string;
  reviewer_display_name: string | null;
  rating: number;
  body: string;
  status: ReviewStatus;
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
  program_type?: ProgramType;
  registration_deadline?: string | null;
  schedule_text?: string | null;
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

export async function insertCamp(
  db: D1Database,
  camp: NewCampInput,
  status: CampStatus = 'pending',
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO camps (
         id, slug, name, sport, age_min, age_max, start_date, end_date,
         address, city, state, zip, latitude, longitude,
         description, price_text, day_or_overnight, skill_level, spots_status,
         contact_email, contact_phone, website_url, lunch_included, aftercare_available,
         status, submitted_by_email, submitted_at, reviewed_by, reviewed_at,
         program_type, registration_deadline, schedule_text
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      status,
      camp.submitted_by_email,
      camp.submitted_at,
      status === 'approved' ? 'auto-approve (trusted submitter)' : null,
      status === 'approved' ? camp.submitted_at : null,
      camp.program_type ?? 'camp',
      camp.registration_deadline ?? null,
      camp.schedule_text ?? null,
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

/**
 * Spot-check queue: camps that are live (approved) but Jeff hasn't personally
 * verified yet. Newest first so the latest imports surface at the top.
 */
export async function listApprovedUnverifiedCamps(db: D1Database): Promise<Camp[]> {
  const result = await db
    .prepare("SELECT * FROM camps WHERE status = 'approved' AND verified = 0 ORDER BY submitted_at DESC")
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

// ---------- Phase 4: admin edit ----------

/**
 * Fields an admin is allowed to edit after a camp is live. Status, audit
 * timestamps, geocode cache, photo keys, and claim state are NOT editable
 * here — those have their own endpoints or are managed automatically.
 */
export interface CampEditFields {
  name?: string;
  slug?: string;
  sport?: string;
  age_min?: number;
  age_max?: number;
  start_date?: string;
  end_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string;
  price_text?: string | null;
  day_or_overnight?: DayOrOvernight;
  skill_level?: SkillLevel;
  spots_status?: SpotsStatus;
  contact_email?: string | null;
  contact_phone?: string | null;
  website_url?: string | null;
  lunch_included?: boolean;
  aftercare_available?: boolean;
  program_type?: ProgramType;
  registration_deadline?: string | null;
  schedule_text?: string | null;
}

const EDITABLE_TEXT_COLUMNS: ReadonlyArray<keyof CampEditFields> = [
  'name', 'slug', 'sport', 'start_date', 'end_date',
  'address', 'city', 'state', 'zip',
  'description', 'price_text', 'day_or_overnight', 'skill_level', 'spots_status',
  'contact_email', 'contact_phone', 'website_url',
  'program_type', 'registration_deadline', 'schedule_text',
];
const EDITABLE_INT_COLUMNS: ReadonlyArray<keyof CampEditFields> = [
  'age_min', 'age_max',
];
const EDITABLE_BOOL_COLUMNS: ReadonlyArray<keyof CampEditFields> = [
  'lunch_included', 'aftercare_available',
];
const EDITABLE_REAL_COLUMNS: ReadonlyArray<keyof CampEditFields> = [
  'latitude', 'longitude',
];

/**
 * Update one or more fields on an existing camp. Only fields explicitly
 * provided in `fields` are written. Stamps last_edited_at and last_edited_by.
 */
export async function updateCamp(
  db: D1Database,
  id: string,
  fields: CampEditFields,
  editorEmail: string,
): Promise<Camp | null> {
  const sets: string[] = [];
  const values: unknown[] = [];

  const push = (col: keyof CampEditFields, value: unknown) => {
    sets.push(`${col} = ?`);
    values.push(value);
  };

  for (const col of EDITABLE_TEXT_COLUMNS) {
    if (col in fields) push(col, fields[col] ?? null);
  }
  for (const col of EDITABLE_INT_COLUMNS) {
    if (col in fields) push(col, fields[col] ?? null);
  }
  for (const col of EDITABLE_REAL_COLUMNS) {
    if (col in fields) push(col, fields[col] ?? null);
  }
  for (const col of EDITABLE_BOOL_COLUMNS) {
    if (col in fields) {
      const v = fields[col];
      push(col, v ? 1 : 0);
    }
  }

  if (sets.length === 0) {
    // Nothing to do. Return the row unchanged.
    return getCampById(db, id);
  }

  // Audit columns always written when any edit happens.
  sets.push('last_edited_at = ?');
  values.push(nowIso());
  sets.push('last_edited_by = ?');
  values.push(editorEmail);

  values.push(id);
  await db
    .prepare(`UPDATE camps SET ${sets.join(', ')} WHERE id = ?`)
    .bind(...values)
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

// ---------- Phase 2.5: claim listings ----------

export type ClaimStatus = 'pending' | 'verified' | 'paid' | 'rejected';

export interface CampClaim {
  id: string;
  camp_id: string;
  claimant_email: string;
  claimant_name: string | null;
  organization: string | null;
  phone: string | null;
  notes: string | null;
  status: ClaimStatus;
  payment_amount_cents: number | null;
  payment_method: string | null;
  submitted_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

export interface NewClaimInput {
  id: string;
  camp_id: string;
  claimant_email: string;
  claimant_name: string | null;
  organization: string | null;
  phone: string | null;
  notes: string | null;
  submitted_at: string;
}

export async function insertClaim(db: D1Database, claim: NewClaimInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO camp_claims (id, camp_id, claimant_email, claimant_name, organization, phone, notes, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(
      claim.id,
      claim.camp_id,
      claim.claimant_email,
      claim.claimant_name,
      claim.organization,
      claim.phone,
      claim.notes,
      claim.submitted_at,
    )
    .run();
}

export async function listPendingClaims(db: D1Database): Promise<CampClaim[]> {
  const result = await db
    .prepare("SELECT * FROM camp_claims WHERE status IN ('pending', 'verified') ORDER BY submitted_at ASC")
    .all<CampClaim>();
  return result.results ?? [];
}

export async function getClaimById(db: D1Database, id: string): Promise<CampClaim | null> {
  const row = await db.prepare('SELECT * FROM camp_claims WHERE id = ?').bind(id).first<CampClaim>();
  return row ?? null;
}

export async function updateClaimStatus(
  db: D1Database,
  id: string,
  status: ClaimStatus,
  reviewer: string,
  notes: string | null = null,
): Promise<CampClaim | null> {
  await db
    .prepare(
      `UPDATE camp_claims
         SET status = ?, reviewed_by = ?, reviewed_at = ?, review_notes = ?
         WHERE id = ?`,
    )
    .bind(status, reviewer, nowIso(), notes, id)
    .run();
  return getClaimById(db, id);
}

/**
 * Mark a camp as claimed. Sets the email, marks is_claimed=1, and records the paid-until date
 * (defaulting to 1 year from today). Called when admin marks a claim as 'paid'.
 */
export async function markCampClaimed(
  db: D1Database,
  campId: string,
  claimantEmail: string,
  paidUntilISO?: string,
): Promise<void> {
  const oneYear = new Date();
  oneYear.setFullYear(oneYear.getFullYear() + 1);
  const paidUntil = paidUntilISO ?? oneYear.toISOString().slice(0, 10);
  await db
    .prepare(
      `UPDATE camps
         SET is_claimed = 1, claimed_by_email = ?, claim_paid_until = ?
         WHERE id = ?`,
    )
    .bind(claimantEmail, paidUntil, campId)
    .run();
}

export function generateClaimId(): string {
  return crypto.randomUUID();
}

// ---------- Phase 2: shared-address handling ----------

/**
 * Find other approved camps at the same address (matches address + city + zip, case-insensitive).
 * Optionally exclude a specific camp id (used on the detail page so the camp doesn't list itself).
 */
export async function listOtherCampsAtAddress(
  db: D1Database,
  address: string,
  city: string,
  zip: string,
  excludeId?: string,
): Promise<Camp[]> {
  const result = await db
    .prepare(
      `SELECT * FROM camps
         WHERE status = 'approved'
           AND LOWER(TRIM(address)) = LOWER(TRIM(?))
           AND LOWER(TRIM(city)) = LOWER(TRIM(?))
           AND TRIM(zip) = TRIM(?)
           ${excludeId ? 'AND id != ?' : ''}
         ORDER BY name ASC`,
    )
    .bind(...(excludeId ? [address, city, zip, excludeId] : [address, city, zip]))
    .all<Camp>();
  return result.results ?? [];
}

/**
 * Find approved + pending camps at this address (for the submit-flow duplicate warning).
 * Used to warn submitters before they create what might be a duplicate listing.
 */
export async function listCampsAtAddressForSubmit(
  db: D1Database,
  address: string,
  city: string,
  zip: string,
): Promise<Camp[]> {
  const result = await db
    .prepare(
      `SELECT * FROM camps
         WHERE status IN ('approved', 'pending')
           AND LOWER(TRIM(address)) = LOWER(TRIM(?))
           AND LOWER(TRIM(city)) = LOWER(TRIM(?))
           AND TRIM(zip) = TRIM(?)
         ORDER BY name ASC`,
    )
    .bind(address, city, zip)
    .all<Camp>();
  return result.results ?? [];
}

// ---------- Phase 2: verified flag + hero photo ----------

export async function setVerified(db: D1Database, id: string, verified: boolean): Promise<void> {
  await db
    .prepare('UPDATE camps SET verified = ? WHERE id = ?')
    .bind(verified ? 1 : 0, id)
    .run();
}

export async function setHeroPhotoKey(db: D1Database, id: string, key: string | null): Promise<void> {
  await db
    .prepare('UPDATE camps SET hero_photo_key = ? WHERE id = ?')
    .bind(key, id)
    .run();
}

// ---------- Phase 2: geocoding cache ----------

const canonicalizeAddress = (address: string, city: string, state: string, zip: string): string =>
  `${address.trim().toLowerCase()}|${city.trim().toLowerCase()}|${state.trim().toUpperCase()}|${zip.trim()}`;

// Hash an address string to a stable 64-char hex digest using SubtleCrypto (available in the Workers runtime).
async function hashAddress(canonical: string): Promise<string> {
  const data = new TextEncoder().encode(canonical);
  const hashBuf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function getCachedGeocode(
  db: D1Database,
  address: string,
  city: string,
  state: string,
  zip: string,
): Promise<{ lat: number; lon: number } | null> {
  const canonical = canonicalizeAddress(address, city, state, zip);
  const hash = await hashAddress(canonical);
  const row = await db
    .prepare('SELECT latitude, longitude FROM geocoded_addresses WHERE address_hash = ?')
    .bind(hash)
    .first<{ latitude: number; longitude: number }>();
  if (!row) return null;
  return { lat: row.latitude, lon: row.longitude };
}

export async function putCachedGeocode(
  db: D1Database,
  address: string,
  city: string,
  state: string,
  zip: string,
  lat: number,
  lon: number,
): Promise<void> {
  const canonical = canonicalizeAddress(address, city, state, zip);
  const hash = await hashAddress(canonical);
  await db
    .prepare(
      `INSERT INTO geocoded_addresses (address_hash, address_canonical, latitude, longitude, cached_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(address_hash) DO UPDATE SET latitude = excluded.latitude, longitude = excluded.longitude, cached_at = excluded.cached_at`,
    )
    .bind(hash, canonical, lat, lon, nowIso())
    .run();
}

/**
 * Cached geocode: hits the local cache first, falls back to Nominatim,
 * stores the new result for future submissions of the same address.
 */
export async function geocodeCached(
  db: D1Database,
  address: string,
  city: string,
  state: string,
  zip: string,
): Promise<{ lat: number; lon: number } | null> {
  const cached = await getCachedGeocode(db, address, city, state, zip);
  if (cached) return cached;
  const fresh = await geocode(address, city, state, zip);
  if (fresh) {
    try {
      await putCachedGeocode(db, address, city, state, zip, fresh.lat, fresh.lon);
    } catch {
      // ignore cache write failures
    }
  }
  return fresh;
}

// ---------- Phase 2: trust-tier auto-approve ----------

/**
 * Decide whether a new submission from this email should auto-approve.
 * Rule: trust_level = 'trusted' AND submitter has no banned status. Banned never auto-approves.
 * New submitters always queue. Admin promotes to trusted after a few approved camps.
 */
export async function shouldAutoApprove(db: D1Database, email: string): Promise<boolean> {
  const submitter = await getSubmitter(db, email);
  if (!submitter) return false;
  return submitter.trust_level === 'trusted';
}

// ---------- Phase 2: zip-code radius search ----------

/**
 * Haversine distance in miles between two lat/lon pairs.
 */
export function haversineMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Filter approved camps to those within `radiusMiles` of (lat, lon). Returns sorted nearest-first.
 */
export async function approvedCampsWithinRadius(
  db: D1Database,
  lat: number,
  lon: number,
  radiusMiles: number,
): Promise<Camp[]> {
  const all = await listApprovedCamps(db);
  return all
    .filter((c) => typeof c.latitude === 'number' && typeof c.longitude === 'number')
    .map((c) => ({
      camp: c,
      distance: haversineMiles(lat, lon, c.latitude as number, c.longitude as number),
    }))
    .filter((x) => x.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance)
    .map((x) => x.camp);
}

// ---------- Phase 2: reviews ----------

export interface NewReviewInput {
  id: string;
  camp_id: string;
  reviewer_email: string;
  reviewer_display_name: string | null;
  rating: number;
  body: string;
  submitted_at: string;
}

export async function insertReview(db: D1Database, review: NewReviewInput): Promise<void> {
  await db
    .prepare(
      `INSERT INTO camp_reviews (id, camp_id, reviewer_email, reviewer_display_name, rating, body, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(
      review.id,
      review.camp_id,
      review.reviewer_email,
      review.reviewer_display_name,
      review.rating,
      review.body,
      review.submitted_at,
    )
    .run();
}

export async function listApprovedReviewsForCamp(db: D1Database, campId: string): Promise<CampReview[]> {
  const result = await db
    .prepare("SELECT * FROM camp_reviews WHERE camp_id = ? AND status = 'approved' ORDER BY submitted_at DESC")
    .bind(campId)
    .all<CampReview>();
  return result.results ?? [];
}

export async function listPendingReviews(db: D1Database): Promise<CampReview[]> {
  const result = await db
    .prepare("SELECT * FROM camp_reviews WHERE status = 'pending' ORDER BY submitted_at ASC")
    .all<CampReview>();
  return result.results ?? [];
}

export async function getReviewById(db: D1Database, id: string): Promise<CampReview | null> {
  const row = await db.prepare('SELECT * FROM camp_reviews WHERE id = ?').bind(id).first<CampReview>();
  return row ?? null;
}

export async function approveReview(
  db: D1Database,
  id: string,
  reviewer: string,
  notes: string | null = null,
): Promise<CampReview | null> {
  await db
    .prepare(
      `UPDATE camp_reviews
         SET status = 'approved', reviewed_by = ?, reviewed_at = ?, review_notes = ?
         WHERE id = ?`,
    )
    .bind(reviewer, nowIso(), notes, id)
    .run();
  return getReviewById(db, id);
}

export async function rejectReview(
  db: D1Database,
  id: string,
  reviewer: string,
  notes: string | null = null,
): Promise<CampReview | null> {
  await db
    .prepare(
      `UPDATE camp_reviews
         SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, review_notes = ?
         WHERE id = ?`,
    )
    .bind(reviewer, nowIso(), notes, id)
    .run();
  return getReviewById(db, id);
}

export function generateReviewId(): string {
  return crypto.randomUUID();
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
