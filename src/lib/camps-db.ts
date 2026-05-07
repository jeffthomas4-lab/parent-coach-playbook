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

// ---------- Phase 6: quality framework ----------

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type UrlHealthStatus = 'unchecked' | 'live' | 'dead' | 'timeout' | 'redirect';

export type RejectReasonCode =
  | 'duplicate'
  | 'dead-url'
  | 'unverifiable-address'
  | 'missing-required-field'
  | 'off-brand'
  | 'past-date'
  | 'aggregator-source'
  | 'low-confidence'
  | 'spam'
  | 'other';

export const REJECT_REASON_CODES: ReadonlyArray<{ code: RejectReasonCode; label: string }> = [
  { code: 'duplicate', label: 'Duplicate of an existing camp' },
  { code: 'dead-url', label: 'Dead URL (registration link broken)' },
  { code: 'unverifiable-address', label: 'Address can\'t be verified' },
  { code: 'missing-required-field', label: 'Missing a required field' },
  { code: 'off-brand', label: 'Off-brand (pure travel-club operator, etc.)' },
  { code: 'past-date', label: 'Dates already past' },
  { code: 'aggregator-source', label: 'Pulled from an aggregator, not the camp\'s own page' },
  { code: 'low-confidence', label: 'Too many fields inferred or unclear' },
  { code: 'spam', label: 'Spam' },
  { code: 'other', label: 'Other' },
];

export interface DomainQuality {
  domain: string;
  submitted_count: number;
  approved_count: number;
  rejected_count: number;
  high_confidence_count: number;
  low_confidence_count: number;
  last_seen_at: string;
  notes: string | null;
}

export type DomainQualityOutcome = 'submitted' | 'approved' | 'rejected';

export interface Camp {
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
  confidence: ConfidenceLevel;
  source_domain: string | null;
  reject_reason_code: RejectReasonCode | null;
  url_health_status: UrlHealthStatus;
  url_last_checked_at: string | null;
  url_last_status_code: number | null;
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
  confidence?: ConfidenceLevel;
  source_domain?: string | null;
}

const nowIso = () => new Date().toISOString();

export function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.hostname.replace(/^www\./, '').toLowerCase() || null;
  } catch {
    return null;
  }
}

// Hosts that are shared registration platforms. Many distinct organizations
// live on the same hostname, distinguished only by the first path segment.
// For these hosts, two URLs only count as "same site" if their first path
// segment (the org slug) also matches. Bare-hostname matching is too aggressive:
// every ActiveNet camp would match every other ActiveNet camp, etc.
const SHARED_PLATFORM_HOSTS = new Set<string>([
  'anc.apm.activecommunities.com',
  'apm.activecommunities.com',
  'activecommunities.com',
  'secure.rec1.com',
  'rec1.com',
  'app.jackrabbitclass.com',
  'register.communitypass.net',
  'register.skyhawks.com',
  'campwise.com',
  'gomotionapp.com',
  'teamsnap.com',
  'leagueapps.com',
  'reg.sportsengine.com',
  'sportsengine.com',
  'readysetregister.com',
]);

/**
 * Returns a key suitable for "same organization site" comparison.
 *
 *  - For multi-tenant registration platforms (ActiveNet, Rec1, etc.) we include
 *    the first path segment, which is the org slug
 *    (e.g. `anc.apm.activecommunities.com/lakewoodparksandrec`).
 *  - For ordinary hosts we just use the bare hostname.
 *
 * Returns null if the URL is missing or unparseable.
 */
export function extractOrgKey(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (!host) return null;
    if (SHARED_PLATFORM_HOSTS.has(host)) {
      const segs = u.pathname.split('/').filter(Boolean);
      const slug = (segs[0] ?? '').toLowerCase();
      // No slug present → fall back to bare host so we still match obvious dupes.
      return slug ? `${host}/${slug}` : host;
    }
    return host;
  } catch {
    return null;
  }
}

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
  const sourceDomain =
    camp.source_domain ?? extractDomain(camp.website_url) ?? extractDomain(null);
  await db
    .prepare(
      `INSERT INTO camps (
         id, slug, name, sport, age_min, age_max, start_date, end_date,
         address, city, state, zip, latitude, longitude,
         description, price_text, day_or_overnight, skill_level, spots_status,
         contact_email, contact_phone, website_url, lunch_included, aftercare_available,
         status, submitted_by_email, submitted_at, reviewed_by, reviewed_at,
         program_type, registration_deadline, schedule_text,
         confidence, source_domain
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      camp.confidence ?? 'medium',
      sourceDomain,
    )
    .run();
}

export async function getCampById(db: D1Database, id: string): Promise<Camp | null> {
  const row = await db.prepare('SELECT * FROM camps WHERE id = ?').bind(id).first<Camp>();
  return row ?? null;
}

export async function getCampBySlug(db: D1Database, slug: string): Promise<Camp | null> {
  const row = await db.prepare('SELECT * FROM camps WHERE slug = ?').bind(slug).first<Camp>();
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
      `UPDATE camps SET status = 'approved', reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`,
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
  reasonCode: RejectReasonCode | null = null,
): Promise<Camp | null> {
  await db
    .prepare(
      `UPDATE camps SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, review_notes = ?, reject_reason_code = ? WHERE id = ?`,
    )
    .bind(reviewer, nowIso(), notes, reasonCode, id)
    .run();
  return getCampById(db, id);
}

// ---------- admin edit ----------

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
const EDITABLE_INT_COLUMNS: ReadonlyArray<keyof CampEditFields> = ['age_min', 'age_max'];
const EDITABLE_BOOL_COLUMNS: ReadonlyArray<keyof CampEditFields> = ['lunch_included', 'aftercare_available'];
const EDITABLE_REAL_COLUMNS: ReadonlyArray<keyof CampEditFields> = ['latitude', 'longitude'];

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

  if (sets.length === 0) return getCampById(db, id);

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
  for (let i = 0; i < 50; i += 1) {
    const candidate = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    const conflict = await getCampBySlug(db, candidate);
    if (!conflict) return candidate;
  }
  return `${slug}-${crypto.randomUUID().slice(0, 8)}`;
}

// ---------- claim listings ----------

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
      `UPDATE camp_claims SET status = ?, reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`,
    )
    .bind(status, reviewer, nowIso(), notes, id)
    .run();
  return getClaimById(db, id);
}

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
      `UPDATE camps SET is_claimed = 1, claimed_by_email = ?, claim_paid_until = ? WHERE id = ?`,
    )
    .bind(claimantEmail, paidUntil, campId)
    .run();
}

export function generateClaimId(): string {
  return crypto.randomUUID();
}

// ---------- shared-address handling ----------

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

// ---------- verified flag + hero photo ----------

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

// ---------- geocoding cache ----------

const canonicalizeAddress = (address: string, city: string, state: string, zip: string): string =>
  `${address.trim().toLowerCase()}|${city.trim().toLowerCase()}|${state.trim().toUpperCase()}|${zip.trim()}`;

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
    } catch {}
  }
  return fresh;
}

// ---------- trust-tier auto-approve ----------

export async function shouldAutoApprove(db: D1Database, email: string): Promise<boolean> {
  const submitter = await getSubmitter(db, email);
  if (!submitter) return false;
  return submitter.trust_level === 'trusted';
}

// ---------- zip-code radius search ----------

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

// ---------- reviews ----------

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
      `UPDATE camp_reviews SET status = 'approved', reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`,
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
      `UPDATE camp_reviews SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, review_notes = ? WHERE id = ?`,
    )
    .bind(reviewer, nowIso(), notes, id)
    .run();
  return getReviewById(db, id);
}

export function generateReviewId(): string {
  return crypto.randomUUID();
}

// ---------- Geocoding (Nominatim) ----------

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

// ---------- Phase 6: fuzzy dedup ----------

export function normalizeCampName(name: string): string {
  const stopwords = new Set([
    'camp', 'camps', 'the', 'and', '&', 'a', 'an', 'of', 'at', 'in',
    'summer', 'youth', 'kids', 'club', 'academy', 'sports', 'sport',
    'inc', 'llc', 'corp',
  ]);
  const tokens = name
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !stopwords.has(t));
  return tokens.join(' ').trim();
}

export interface FuzzyMatchResult {
  camp: Camp;
  reason:
    | 'exact-name-city'
    | 'normalized-name-city'
    | 'same-website'
    | 'same-address'
    | 'previously-rejected-dead-url';
}

export async function findFuzzyCampMatches(
  db: D1Database,
  candidate: {
    name: string;
    city: string;
    state: string;
    zip?: string | null;
    address?: string | null;
    website_url?: string | null;
  },
): Promise<FuzzyMatchResult[]> {
  // Include rejected camps too so the queue can warn about previously-killed URLs.
  const result = await db
    .prepare(`SELECT * FROM camps WHERE status IN ('approved', 'pending', 'rejected')`)
    .all<Camp>();
  const all = result.results ?? [];

  const candidateNormName = normalizeCampName(candidate.name);
  const candidateCity = candidate.city.trim().toLowerCase();
  const candidateState = candidate.state.trim().toUpperCase();
  const candidateOrgKey = extractOrgKey(candidate.website_url ?? null);
  const candidateAddress = (candidate.address ?? '').trim().toLowerCase();
  const candidateZip = (candidate.zip ?? '').trim();

  const seen = new Map<string, FuzzyMatchResult>();
  const set = (camp: Camp, reason: FuzzyMatchResult['reason']) => {
    if (!seen.has(camp.id)) seen.set(camp.id, { camp, reason });
  };

  // Pre-pass: any rejected camp with reject_reason_code='dead-url' that shares the
  // candidate's exact website_url is a high-priority warning. Surface it first so
  // the admin queue can flag "we already killed this URL once."
  for (const c of all) {
    if (
      c.status === 'rejected' &&
      c.reject_reason_code === 'dead-url' &&
      candidate.website_url &&
      c.website_url &&
      c.website_url.trim().toLowerCase() === candidate.website_url.trim().toLowerCase()
    ) {
      set(c, 'previously-rejected-dead-url');
    }
  }

  for (const c of all) {
    // Don't re-fuzzy-match rejected camps via name/address — only flag them on URL.
    if (c.status === 'rejected') continue;

    const cCity = c.city.trim().toLowerCase();
    const cState = c.state.trim().toUpperCase();
    const cName = c.name.trim().toLowerCase();
    const cNormName = normalizeCampName(c.name);
    const cOrgKey = extractOrgKey(c.website_url);

    if (cName === candidate.name.trim().toLowerCase() && cCity === candidateCity && cState === candidateState) {
      set(c, 'exact-name-city');
      continue;
    }
    if (cNormName && cNormName === candidateNormName && cCity === candidateCity && cState === candidateState) {
      set(c, 'normalized-name-city');
      continue;
    }
    if (candidateOrgKey && cOrgKey && cOrgKey === candidateOrgKey) {
      set(c, 'same-website');
      continue;
    }
    if (
      candidateAddress &&
      candidateZip &&
      c.address.trim().toLowerCase() === candidateAddress &&
      cCity === candidateCity &&
      c.zip.trim() === candidateZip
    ) {
      set(c, 'same-address');
      continue;
    }
  }

  return Array.from(seen.values());
}

// ---------- Phase 6: URL health ----------

export async function updateUrlHealth(
  db: D1Database,
  id: string,
  status: UrlHealthStatus,
  statusCode: number | null,
): Promise<void> {
  await db
    .prepare(
      `UPDATE camps SET url_health_status = ?, url_last_checked_at = ?, url_last_status_code = ? WHERE id = ?`,
    )
    .bind(status, nowIso(), statusCode, id)
    .run();
}

export async function listCampsForUrlSweep(
  db: D1Database,
  beforeIso: string,
  limit = 50,
): Promise<Camp[]> {
  const result = await db
    .prepare(
      `SELECT * FROM camps
         WHERE status = 'approved'
           AND website_url IS NOT NULL
           AND (url_last_checked_at IS NULL OR url_last_checked_at < ?)
         ORDER BY url_last_checked_at ASC NULLS FIRST
         LIMIT ?`,
    )
    .bind(beforeIso, limit)
    .all<Camp>();
  return result.results ?? [];
}

export async function listStaleCamps(
  db: D1Database,
  beforeDate: string,
): Promise<Camp[]> {
  const result = await db
    .prepare(
      `SELECT * FROM camps WHERE status = 'approved' AND end_date < ? ORDER BY end_date ASC`,
    )
    .bind(beforeDate)
    .all<Camp>();
  return result.results ?? [];
}

export async function archiveStaleCamps(db: D1Database, todayDate: string, reviewer: string): Promise<number> {
  const stale = await listStaleCamps(db, todayDate);
  for (const c of stale) {
    await rejectCamp(db, c.id, reviewer, 'auto-archived past-date', 'past-date');
  }
  return stale.length;
}

// ---------- Phase 6: domain quality ----------

export async function upsertDomainQuality(
  db: D1Database,
  domain: string | null,
  outcome: DomainQualityOutcome,
  confidence?: ConfidenceLevel,
): Promise<void> {
  if (!domain) return;
  const now = nowIso();
  const submittedDelta = outcome === 'submitted' ? 1 : 0;
  const approvedDelta = outcome === 'approved' ? 1 : 0;
  const rejectedDelta = outcome === 'rejected' ? 1 : 0;
  const highDelta = outcome === 'submitted' && confidence === 'high' ? 1 : 0;
  const lowDelta = outcome === 'submitted' && confidence === 'low' ? 1 : 0;

  await db
    .prepare(
      `INSERT INTO domain_quality
         (domain, submitted_count, approved_count, rejected_count, high_confidence_count, low_confidence_count, last_seen_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(domain) DO UPDATE SET
         submitted_count = submitted_count + ?,
         approved_count = approved_count + ?,
         rejected_count = rejected_count + ?,
         high_confidence_count = high_confidence_count + ?,
         low_confidence_count = low_confidence_count + ?,
         last_seen_at = excluded.last_seen_at`,
    )
    .bind(
      domain,
      submittedDelta,
      approvedDelta,
      rejectedDelta,
      highDelta,
      lowDelta,
      now,
      submittedDelta,
      approvedDelta,
      rejectedDelta,
      highDelta,
      lowDelta,
    )
    .run();
}

export async function listDomainQuality(db: D1Database): Promise<DomainQuality[]> {
  const result = await db
    .prepare(`SELECT * FROM domain_quality ORDER BY submitted_count DESC, last_seen_at DESC`)
    .all<DomainQuality>();
  return result.results ?? [];
}

export async function getDomainQuality(db: D1Database, domain: string): Promise<DomainQuality | null> {
  const row = await db
    .prepare('SELECT * FROM domain_quality WHERE domain = ?')
    .bind(domain)
    .first<DomainQuality>();
  return row ?? null;
}
