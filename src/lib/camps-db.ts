// D1 query helpers for the camps repository.
//
// Schema migration: parentcoachdesk.com now reads/writes the shared activity-radar D1
// (database_id 8cc3694a-26f8-4a56-b131-d5d3a68c49ef) instead of its own standalone D1.
//
// The shared schema normalizes the old flat `camps` table into:
//   organizations  — the entity a parent decides to trust (location, contact, claimed status)
//   programs       — one offering an org runs (a camp, league, class) + PCD editorial fields
//
// This file maintains the identical Camp interface and all exported function signatures
// so every Astro page and API endpoint continues to work without modification.
// Only the SQL inside has changed.
//
// Field mapping summary:
//   Camp.id               = programs.id
//   Camp.slug             = programs.slug
//   Camp.sport            = programs.activity_category
//   Camp.start_date       = programs.session_start_date
//   Camp.end_date         = programs.session_end_date
//   Camp.status           = programs.pcd_status
//   Camp.spots_status     = programs.availability_status
//   Camp.confidence       = programs.pcd_confidence
//   Camp.contact_email    = COALESCE(programs.contact_email, organizations.email)
//   Camp.contact_phone    = COALESCE(programs.contact_phone, organizations.phone)
//   Camp.website_url      = organizations.website_url
//   Camp.address/city/... = organizations.*
//   Camp.is_claimed       = organizations.is_claimed
//   Camp.claimed_by_email = organizations.claimed_by_email
//   Camp.claim_paid_until = organizations.claim_paid_until
//   Camp.logo_key         = organizations.logo_key
//   Camp.gallery_keys     = organizations.gallery_keys

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
  { code: 'unverifiable-address', label: "Address can't be verified" },
  { code: 'missing-required-field', label: 'Missing a required field' },
  { code: 'off-brand', label: 'Off-brand (pure travel-club operator, etc.)' },
  { code: 'past-date', label: 'Dates already past' },
  { code: 'aggregator-source', label: "Pulled from an aggregator, not the camp's own page" },
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
  age_known: 0 | 1;
  // Nullable in the live DB — 296 approved programs carry a null
  // session_start_date or session_end_date as of the 2026-07-15 audit. The
  // type used to claim non-null, which is what let the SSR date formatters
  // call .split() on null and throw. See camps/[slug].astro, camps/index.astro,
  // camps/[state]/[city]/index.astro, camps/[state]/[city]/[sport]/index.astro.
  start_date: string | null;
  end_date: string | null;
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
  last_verified_at: string | null;
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
  awaiting_review: 0 | 1;
  featured: 0 | 1;
  featured_order: number | null;
  featured_until: string | null;
}

export type CampApprovalBlockCode = 'dates_missing' | 'dates_invalid' | 'dates_reversed' | 'session_ended' | 'approval_state_changed';

export class CampApprovalBlockedError extends Error {
  readonly code: CampApprovalBlockCode;

  constructor(code: CampApprovalBlockCode) {
    super(`camp approval blocked: ${code}`);
    this.name = 'CampApprovalBlockedError';
    this.code = code;
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const validIsoDate = (value: string) => ISO_DATE.test(value)
  && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;

export function campApprovalBlock(camp: Pick<Camp, 'start_date' | 'end_date'>, today = todayDateISO()): CampApprovalBlockCode | null {
  if (!camp.start_date || !camp.end_date) return 'dates_missing';
  if (!validIsoDate(camp.start_date) || !validIsoDate(camp.end_date) || !validIsoDate(today)) return 'dates_invalid';
  if (camp.start_date > camp.end_date) return 'dates_reversed';
  if (camp.end_date < today) return 'session_ended';
  return null;
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

// ---------- Base SELECT ----------
// All camp read queries use this JOIN. Callers append WHERE / ORDER BY / LIMIT.
// The alias names match the Camp interface exactly so D1's row mapping works directly.

const CAMP_SELECT = `
  SELECT
    p.id,
    p.slug,
    p.name,
    p.activity_category                                   AS sport,
    COALESCE(p.age_min,  0)                               AS age_min,
    COALESCE(p.age_max, 99)                               AS age_max,
    (p.age_min IS NOT NULL AND p.age_max IS NOT NULL)     AS age_known,
    p.session_start_date                                  AS start_date,
    p.session_end_date                                    AS end_date,
    o.address,
    o.city,
    o.state,
    o.zip,
    o.latitude,
    o.longitude,
    p.description,
    p.price_text,
    COALESCE(p.day_or_overnight, 'day')                   AS day_or_overnight,
    COALESCE(p.skill_level, 'all')                        AS skill_level,
    CASE
      WHEN p.availability_status IN ('open','waitlist','full') THEN p.availability_status
      ELSE 'open'
    END                                                   AS spots_status,
    COALESCE(p.contact_email,  o.email)                   AS contact_email,
    COALESCE(p.contact_phone,  o.phone)                   AS contact_phone,
    o.website_url,
    COALESCE(p.lunch_included,      0)                    AS lunch_included,
    COALESCE(p.aftercare_available, 0)                    AS aftercare_available,
    p.pcd_status                                          AS status,
    COALESCE(p.submitted_by_email, 'system')              AS submitted_by_email,
    COALESCE(p.submitted_at,       p.created_at)          AS submitted_at,
    p.reviewed_by,
    p.reviewed_at,
    p.review_notes,
    COALESCE(p.verified, 0)                               AS verified,
    p.last_verified_at,
    p.hero_photo_key,
    o.is_claimed,
    o.claimed_by_email,
    o.claim_paid_until,
    o.logo_key,
    o.gallery_keys,
    p.registration_url,
    p.last_edited_at,
    p.last_edited_by,
    COALESCE(p.program_type, 'camp')                      AS program_type,
    p.registration_deadline,
    p.schedule_text,
    COALESCE(p.pcd_confidence, 'medium')                  AS confidence,
    p.source_domain,
    p.reject_reason_code,
    COALESCE(p.url_health_status, 'unchecked')            AS url_health_status,
    p.url_last_checked_at,
    p.url_last_status_code,
    COALESCE(p.awaiting_review, 0)                        AS awaiting_review,
    COALESCE(p.featured, 0)                               AS featured,
    p.featured_order,
    p.featured_until
  FROM programs p
  JOIN organizations o ON p.organization_id = o.id
`;

// ---------- URL/domain helpers ----------

export function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    return u.hostname.replace(/^www\./, '').toLowerCase() || null;
  } catch {
    return null;
  }
}

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

export function extractOrgKey(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    if (!host) return null;
    if (SHARED_PLATFORM_HOSTS.has(host)) {
      const segs = u.pathname.split('/').filter(Boolean);
      const slug = (segs[0] ?? '').toLowerCase();
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
  await prepareSubmitterSubmissionUpsert(db, email, now, notes).run();
  const updated = await getSubmitter(db, email);
  if (!updated) throw new Error(`Submitter upsert failed for ${email}`);
  return updated;
}

export function prepareSubmitterSubmissionUpsert(db: D1Database, email: string, at: string, notes: string | null = null): D1PreparedStatement {
  return db.prepare(
    `INSERT INTO submitters (email, trust_level, submission_count, approved_count, first_submitted_at, last_submitted_at, notes)
     VALUES (?, 'new', 1, 0, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       submission_count = submission_count + 1,
       last_submitted_at = excluded.last_submitted_at`,
  ).bind(email, at, at, notes);
}

/**
 * How many programs this email has submitted since `sinceIso`.
 *
 * Used as the rate limit on the submission confirmation email: the submit
 * endpoint is public, so without a cap one script could make us send an
 * unbounded number of messages from our own domain and burn its sending
 * reputation along with the bill.
 */
export async function countRecentSubmissionsByEmail(
  db: D1Database,
  email: string,
  sinceIso: string,
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM programs WHERE submitted_by_email = ? AND submitted_at >= ?`,
    )
    .bind(email.toLowerCase(), sinceIso)
    .first<{ n: number }>();
  return row?.n ?? 0;
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
// insertCamp creates one organizations row + one programs row.
// The camp's UUID becomes the programs.id. A new org UUID is generated here.

export async function insertCamp(
  db: D1Database,
  camp: NewCampInput,
  status: CampStatus = 'pending',
  awaitingReview: boolean = false,
): Promise<void> {
  await db.batch(prepareCampInsertStatements(db, camp, status, awaitingReview));
}

export function prepareCampInsertStatements(
  db: D1Database,
  camp: NewCampInput,
  status: CampStatus = 'pending',
  awaitingReview: boolean = false,
): D1PreparedStatement[] {
  if (status === 'approved') {
    const blocked = campApprovalBlock(camp);
    if (blocked) throw new CampApprovalBlockedError(blocked);
  }
  const sourceDomain = camp.source_domain ?? extractDomain(camp.website_url);
  const now = nowIso();
  const orgId = crypto.randomUUID();

  // Derive record_status from pcd_status so ActivityRadar display stays consistent.
  // Mapping is documented in CAMPS_APPROVAL_THRESHOLD.md: approved->active,
  // rejected->inactive, pending->unverified. pcd_status is the source of truth;
  // record_status is a derived mirror that nothing here reads for visibility.
  const recordStatus = status === 'approved' ? 'active' : status === 'rejected' ? 'inactive' : 'unverified';

  // Prepare the organization insert without executing it independently.
  const organizationInsert = db
    .prepare(
      `INSERT INTO organizations (
         id, slug, name, organization_type,
         website_url, email, phone,
         address, city, state, zip, latitude, longitude,
         description,
         record_source, record_status, is_claimed,
         confidence_score,
         created_at, updated_at
       ) VALUES (?, ?, ?, 'other', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`,
    )
    .bind(
      orgId,
      `org-${camp.id}`,          // unique slug; will be cleaned up if org is later claimed
      camp.name,
      camp.website_url,
      camp.contact_email,
      camp.contact_phone,
      camp.address,
      camp.city,
      camp.state,
      camp.zip,
      camp.latitude,
      camp.longitude,
      camp.description.slice(0, 500),
      camp.source_domain ? 'scraped' : 'manual',
      recordStatus,
      camp.confidence === 'high' ? 80 : camp.confidence === 'low' ? 20 : 50,
      now,
      now,
    );

  // Insert the program linked to that org.
  const programInsert = db
    .prepare(
      `INSERT INTO programs (
         id, organization_id, slug, name,
         program_type, activity_category,
         description,
         age_min, age_max, skill_level,
         session_start_date, session_end_date,
         price_text,
         day_or_overnight, lunch_included, aftercare_available,
         availability_status,
         registration_url,
         registration_deadline, schedule_text,
         contact_email, contact_phone,
         record_source, record_status,
         confidence_score, source_domain,
         pcd_status, submitted_by_email, submitted_at,
         reviewed_by, reviewed_at,
         pcd_confidence,
         awaiting_review,
         created_at, updated_at
       ) VALUES (
         ?, ?, ?, ?,
         ?, ?,
         ?,
         ?, ?, ?,
         ?, ?,
         ?,
         ?, ?, ?,
         ?,
         ?,
         ?, ?,
         ?, ?,
         ?, ?,
         ?, ?,
         ?, ?, ?,
         ?, ?,
         ?,
         ?,
         ?, ?
       )`,
    )
    .bind(
      camp.id,
      orgId,
      camp.slug,
      camp.name,
      camp.program_type ?? 'camp',
      camp.sport,                   // activity_category
      camp.description,
      camp.age_min,
      camp.age_max,
      camp.skill_level,
      camp.start_date,              // session_start_date
      camp.end_date,                // session_end_date
      camp.price_text,
      camp.day_or_overnight,
      camp.lunch_included ? 1 : 0,
      camp.aftercare_available ? 1 : 0,
      camp.spots_status,            // availability_status
      camp.website_url,             // registration_url (best link we have at submit time)
      camp.registration_deadline ?? null,
      camp.schedule_text ?? null,
      camp.contact_email,
      camp.contact_phone,
      camp.source_domain ? 'scraped' : 'manual',
      recordStatus,
      camp.confidence === 'high' ? 80 : camp.confidence === 'low' ? 20 : 50,
      sourceDomain,
      status,                       // pcd_status
      camp.submitted_by_email,
      camp.submitted_at,
      status === 'approved' ? 'auto-approve (trusted submitter)' : null,
      status === 'approved' ? camp.submitted_at : null,
      camp.confidence ?? 'medium',  // pcd_confidence
      awaitingReview ? 1 : 0,
      now,
      now,
    );

  // D1 batch executes transactionally. Never leave an orphan organization if
  // the program insert fails, and never report a partially accepted intake.
  return [organizationInsert, programInsert];
}

export async function insertCampSubmission(db: D1Database, camp: NewCampInput): Promise<void> {
  await db.batch([
    prepareSubmitterSubmissionUpsert(db, camp.submitted_by_email, camp.submitted_at),
    ...prepareCampInsertStatements(db, camp, 'pending', false),
  ]);
}

export async function getCampById(db: D1Database, id: string): Promise<Camp | null> {
  const row = await db
    .prepare(`${CAMP_SELECT} WHERE p.id = ?`)
    .bind(id)
    .first<Camp>();
  return row ?? null;
}

/**
 * Bulk counterpart to getCampById — one D1 round trip for any number of ids,
 * instead of one round trip per id. Added 2026-07-20 alongside
 * findFuzzyCampMatchesBulk to fix the admin queue page issuing one D1
 * subrequest per campLookup entry (reviews + claims can reference the same
 * camp repeatedly; this collapses it to a single IN (...) query).
 */
export async function getCampsByIds(db: D1Database, ids: string[]): Promise<Map<string, Camp>> {
  const unique = Array.from(new Set(ids)).filter(Boolean);
  const out = new Map<string, Camp>();
  if (unique.length === 0) return out;
  // D1/SQLite has a bound-parameter ceiling well above what this page ever
  // needs (reviews + claims, not the full camps table), but chunk defensively
  // so a future high-volume caller doesn't reintroduce a resource-limit bug.
  const CHUNK = 200;
  for (let i = 0; i < unique.length; i += CHUNK) {
    const chunk = unique.slice(i, i + CHUNK);
    const placeholders = chunk.map(() => '?').join(',');
    const result = await db
      .prepare(`${CAMP_SELECT} WHERE p.id IN (${placeholders})`)
      .bind(...chunk)
      .all<Camp>();
    for (const camp of result.results ?? []) out.set(camp.id, camp);
  }
  return out;
}

export function todayDateISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getCampBySlug(db: D1Database, slug: string): Promise<Camp | null> {
  const row = await db
    .prepare(`${CAMP_SELECT} WHERE p.slug = ?`)
    .bind(slug)
    .first<Camp>();
  if (!row) return null;
  if (row.end_date && row.end_date < todayDateISO()) return null;
  return row;
}

// Unfiltered lookup — returns the row regardless of pcd_status or whether
// session_end_date has passed. Used only by the /camps/[slug] route to decide
// what a dead slug should do (410 gone vs 301 to a hub) instead of letting a
// real, once-public camp fall through to a bare 404 (2026-07 SEO audit:
// expired/demoted camps were 404ing, including the site's best-performing
// page). getCampBySlug above stays filtered for every other caller.
export async function getCampBySlugAny(db: D1Database, slug: string): Promise<Camp | null> {
  const row = await db
    .prepare(`${CAMP_SELECT} WHERE p.slug = ?`)
    .bind(slug)
    .first<Camp>();
  return row ?? null;
}

export async function listFeaturedCamps(db: D1Database): Promise<Camp[]> {
  const today = todayDateISO();
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved'
         AND p.featured = 1
         AND p.session_end_date >= ?
         AND (p.featured_until IS NULL OR p.featured_until >= ?)
       ORDER BY p.featured_order ASC NULLS LAST, p.session_start_date ASC`,
    )
    .bind(today, today)
    .all<Camp>();
  return result.results ?? [];
}

export async function listApprovedCamps(db: D1Database): Promise<Camp[]> {
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved' AND p.session_end_date >= ?
       ORDER BY p.session_start_date ASC`,
    )
    .bind(todayDateISO())
    .all<Camp>();
  return result.results ?? [];
}

export async function listPendingCamps(db: D1Database): Promise<Camp[]> {
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'pending' OR p.awaiting_review = 1
       ORDER BY p.submitted_at ASC NULLS LAST`,
    )
    .all<Camp>();
  return result.results ?? [];
}

export async function listApprovedUnverifiedCamps(db: D1Database): Promise<Camp[]> {
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved' AND COALESCE(p.verified, 0) = 0
       ORDER BY p.submitted_at DESC NULLS LAST`,
    )
    .all<Camp>();
  return result.results ?? [];
}

export async function listAllCampSlugsApproved(db: D1Database): Promise<{ slug: string; lastmod: string }[]> {
  const result = await db
    .prepare(
      `SELECT p.slug, COALESCE(p.updated_at, p.created_at) AS lastmod FROM programs p
       WHERE p.pcd_status = 'approved' AND p.session_end_date >= ?`,
    )
    .bind(todayDateISO())
    .all<{ slug: string; lastmod: string }>();
  return result.results ?? [];
}

// Health check for the camps pipeline. Used by /api/cron/camps-sweep so a
// silent blackout (migration wipes pcd_status, D1 outage, etc.) shows up in
// the worker-cron logs instead of running unnoticed for weeks. See the
// 2026-07-05 incident: a migration default reset 1,701 approved camps to
// 'pending' and nothing alerted until GSC impressions had already fallen.
export async function countApprovedFutureCamps(db: D1Database): Promise<number> {
  const result = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM programs
       WHERE pcd_status = 'approved' AND session_end_date >= ?`,
    )
    .bind(todayDateISO())
    .first<{ n: number }>();
  return result?.n ?? 0;
}

export function slugifyCity(s: string): string {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function listCampsByState(db: D1Database, state: string): Promise<Camp[]> {
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved' AND o.state = ? AND p.session_end_date >= ?
       ORDER BY p.session_start_date ASC`,
    )
    .bind(state.toUpperCase(), todayDateISO())
    .all<Camp>();
  return result.results ?? [];
}

export async function listCampsByCity(db: D1Database, state: string, citySlug: string): Promise<Camp[]> {
  const rows = await listCampsByState(db, state);
  const want = citySlug.toLowerCase();
  return rows.filter((c) => slugifyCity(c.city) === want);
}

export async function listCampsByCitySport(
  db: D1Database,
  state: string,
  citySlug: string,
  sport: string,
): Promise<Camp[]> {
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved'
         AND o.state = ?
         AND p.activity_category = ?
         AND p.session_end_date >= ?
       ORDER BY p.session_start_date ASC`,
    )
    .bind(state.toUpperCase(), sport, todayDateISO())
    .all<Camp>();
  const rows = result.results ?? [];
  const want = citySlug.toLowerCase();
  return rows.filter((c) => slugifyCity(c.city) === want);
}

export async function listStatesWithCounts(db: D1Database): Promise<{ state: string; count: number }[]> {
  const result = await db
    .prepare(
      `SELECT o.state, COUNT(*) AS count
       FROM programs p JOIN organizations o ON p.organization_id = o.id
       WHERE p.pcd_status = 'approved' AND p.session_end_date >= ?
       GROUP BY o.state ORDER BY count DESC`,
    )
    .bind(todayDateISO())
    .all<{ state: string; count: number }>();
  return result.results ?? [];
}

export async function listCitiesInState(
  db: D1Database,
  state: string,
): Promise<{ city: string; count: number }[]> {
  const result = await db
    .prepare(
      `SELECT o.city, COUNT(*) AS count
       FROM programs p JOIN organizations o ON p.organization_id = o.id
       WHERE p.pcd_status = 'approved' AND o.state = ? AND p.session_end_date >= ?
       GROUP BY o.city ORDER BY count DESC`,
    )
    .bind(state.toUpperCase(), todayDateISO())
    .all<{ city: string; count: number }>();
  return result.results ?? [];
}

// ---------- Approve / Reject ----------
// Also updates record_status on both programs and organizations so ActivityRadar
// display stays consistent with PCD editorial decisions.

export async function approveCamp(
  db: D1Database,
  id: string,
  reviewer: string,
  notes: string | null = null,
): Promise<Camp | null> {
  const camp = await getCampById(db, id);
  if (!camp) return null;
  const blocked = campApprovalBlock(camp);
  if (blocked) throw new CampApprovalBlockedError(blocked);
  const now = nowIso();
  const results = await db.batch([
    db.prepare(
      `UPDATE programs
       SET pcd_status = 'approved', record_status = 'active',
           awaiting_review = 0, reviewed_by = ?, reviewed_at = ?, review_notes = ?
       WHERE id = ? AND session_start_date = ? AND session_end_date = ?`,
    )
    .bind(reviewer, now, notes, id, camp.start_date, camp.end_date),
    // Sync org only when the guarded program transition succeeded in the same
    // D1 batch. D1 batches are transactional, preventing a half-approved row.
    db.prepare(
      `UPDATE organizations SET record_status = 'active'
       WHERE id = (SELECT organization_id FROM programs
                    WHERE id = ? AND pcd_status = 'approved'
                      AND session_start_date = ? AND session_end_date = ?)`,
    )
    .bind(id, camp.start_date, camp.end_date),
  ]);
  if (Number(results[0]?.meta?.changes ?? 0) !== 1) {
    throw new CampApprovalBlockedError('approval_state_changed');
  }
  if (!(camp.status === 'approved' && camp.awaiting_review === 1)) {
    await incrementSubmitterApproved(db, camp.submitted_by_email);
  }
  return getCampById(db, id);
}

export interface RejectCampResult {
  camp: Camp | null;
  // True only when THIS call performed the pending/approved -> rejected
  // transition. Derived solely from the conditional UPDATE's own reported
  // change count — never from a prior SELECT — so two concurrent reject
  // requests racing on the same id can't both see "not yet rejected" and
  // both trigger a domain-quality decrement (TOCTOU).
  transitioned: boolean;
}

export async function rejectCamp(
  db: D1Database,
  id: string,
  reviewer: string,
  notes: string | null = null,
  reasonCode: RejectReasonCode | null = null,
): Promise<RejectCampResult> {
  const now = nowIso();
  // Single atomic conditional UPDATE: the WHERE clause both selects the
  // target row AND guards the transition, so the "did this call actually
  // change anything" answer comes from D1's own reported change count
  // rather than a separate read-then-write race window.
  const result = await db
    .prepare(
      `UPDATE programs
       SET pcd_status = 'rejected', record_status = 'inactive',
           awaiting_review = 0, reviewed_by = ?, reviewed_at = ?, review_notes = ?,
           reject_reason_code = ?
       WHERE id = ? AND pcd_status != 'rejected'`,
    )
    .bind(reviewer, now, notes, reasonCode, id)
    .run();
  const transitioned = Number(result?.meta?.changes ?? 0) > 0;
  const camp = await getCampById(db, id);
  return { camp, transitioned };
}

// ---------- Admin edit ----------

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

export async function updateCamp(
  db: D1Database,
  id: string,
  fields: CampEditFields,
  editorEmail: string,
): Promise<Camp | null> {
  const now = nowIso();

  // Fields that live on programs.
  const progSets: string[] = [];
  const progVals: unknown[] = [];
  const pushProg = (col: string, value: unknown) => { progSets.push(`${col} = ?`); progVals.push(value); };

  if ('name'              in fields) pushProg('name',                fields.name ?? null);
  if ('slug'              in fields) pushProg('slug',                fields.slug ?? null);
  if ('sport'             in fields) pushProg('activity_category',   fields.sport ?? null);
  if ('age_min'           in fields) pushProg('age_min',             fields.age_min ?? null);
  if ('age_max'           in fields) pushProg('age_max',             fields.age_max ?? null);
  if ('start_date'        in fields) pushProg('session_start_date',  fields.start_date ?? null);
  if ('end_date'          in fields) pushProg('session_end_date',    fields.end_date ?? null);
  if ('description'       in fields) pushProg('description',         fields.description ?? null);
  if ('price_text'        in fields) pushProg('price_text',          fields.price_text ?? null);
  if ('day_or_overnight'  in fields) pushProg('day_or_overnight',    fields.day_or_overnight ?? null);
  if ('skill_level'       in fields) pushProg('skill_level',         fields.skill_level ?? null);
  if ('spots_status'      in fields) pushProg('availability_status', fields.spots_status ?? null);
  if ('contact_email'     in fields) pushProg('contact_email',       fields.contact_email ?? null);
  if ('contact_phone'     in fields) pushProg('contact_phone',       fields.contact_phone ?? null);
  if ('website_url'       in fields) pushProg('registration_url',    fields.website_url ?? null);
  if ('lunch_included'    in fields) pushProg('lunch_included',      fields.lunch_included ? 1 : 0);
  if ('aftercare_available' in fields) pushProg('aftercare_available', fields.aftercare_available ? 1 : 0);
  if ('program_type'      in fields) pushProg('program_type',        fields.program_type ?? null);
  if ('registration_deadline' in fields) pushProg('registration_deadline', fields.registration_deadline ?? null);
  if ('schedule_text'     in fields) pushProg('schedule_text',       fields.schedule_text ?? null);

  if (progSets.length > 0) {
    progSets.push('last_edited_at = ?');  progVals.push(now);
    progSets.push('last_edited_by = ?');  progVals.push(editorEmail);
    progVals.push(id);
    await db
      .prepare(`UPDATE programs SET ${progSets.join(', ')} WHERE id = ?`)
      .bind(...progVals)
      .run();
  }

  // Fields that live on organizations.
  const orgSets: string[] = [];
  const orgVals: unknown[] = [];
  const pushOrg = (col: string, value: unknown) => { orgSets.push(`${col} = ?`); orgVals.push(value); };

  if ('address'   in fields) pushOrg('address',   fields.address ?? null);
  if ('city'      in fields) pushOrg('city',       fields.city ?? null);
  if ('state'     in fields) pushOrg('state',      fields.state ?? null);
  if ('zip'       in fields) pushOrg('zip',        fields.zip ?? null);
  if ('latitude'  in fields) pushOrg('latitude',   fields.latitude ?? null);
  if ('longitude' in fields) pushOrg('longitude',  fields.longitude ?? null);
  if ('website_url' in fields) pushOrg('website_url', fields.website_url ?? null);

  if (orgSets.length > 0) {
    orgSets.push('updated_at = ?');  orgVals.push(now);
    // Resolve organization_id from program.
    orgVals.push(id);
    await db
      .prepare(
        `UPDATE organizations SET ${orgSets.join(', ')}
         WHERE id = (SELECT organization_id FROM programs WHERE id = ?)`,
      )
      .bind(...orgVals)
      .run();
  }

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

// ---------- Claim listings ----------

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

export async function prepareClaimInsert(db: D1Database, claim: NewClaimInput): Promise<D1PreparedStatement> {
  // Resolve the organization_id so the camp_claims row can be queried by org too.
  const prog = await db
    .prepare('SELECT organization_id FROM programs WHERE id = ?')
    .bind(claim.camp_id)
    .first<{ organization_id: string }>();

  return db
    .prepare(
      `INSERT INTO camp_claims
         (id, camp_id, organization_id, claimant_email, claimant_name, organization, phone, notes, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(
      claim.id,
      claim.camp_id,
      prog?.organization_id ?? null,
      claim.claimant_email,
      claim.claimant_name,
      claim.organization,
      claim.phone,
      claim.notes,
      claim.submitted_at,
    )
    ;
}

export async function insertClaim(db: D1Database, claim: NewClaimInput): Promise<void> {
  await (await prepareClaimInsert(db, claim)).run();
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

export function generateClaimId(): string {
  return crypto.randomUUID();
}

// ---------- Org suggestions ----------
// Lighter-weight intake than insertCamp: someone knows an org runs camps or
// leagues but doesn't have full program detail (exact dates, address). Admin
// reviews the queue and either researches it into a full camps/submit-quality
// listing (status 'imported') or logs that it was looked at and isn't
// actionable yet (status 'reviewed'). Shares the `org_suggestions` table with
// ActivityRadar (same D1); this project only reads/writes it independently.

export type OrgSuggestionStatus = 'pending' | 'reviewed' | 'imported';

export interface OrgSuggestion {
  id: string;
  org_name: string;
  org_website: string | null;
  org_city: string | null;
  org_state: string | null;
  activity_type: string | null;
  submitter_email: string | null;
  notes: string | null;
  status: OrgSuggestionStatus;
  submitted_at: string;
}

export interface NewOrgSuggestionInput {
  id: string;
  org_name: string;
  org_website: string | null;
  org_city: string | null;
  org_state: string | null;
  activity_type: string | null;
  submitter_email: string | null;
  notes: string | null;
  submitted_at: string;
}

export function generateOrgSuggestionId(): string {
  return crypto.randomUUID();
}

export function prepareOrgSuggestionInsert(db: D1Database, s: NewOrgSuggestionInput): D1PreparedStatement {
  return db
    .prepare(
      `INSERT INTO org_suggestions
         (id, org_name, org_website, org_city, org_state, activity_type, submitter_email, notes, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(s.id, s.org_name, s.org_website, s.org_city, s.org_state, s.activity_type, s.submitter_email, s.notes, s.submitted_at);
}

export async function insertOrgSuggestion(db: D1Database, s: NewOrgSuggestionInput): Promise<void> {
  await prepareOrgSuggestionInsert(db, s).run();
}

export async function listPendingOrgSuggestions(db: D1Database): Promise<OrgSuggestion[]> {
  const result = await db
    .prepare("SELECT * FROM org_suggestions WHERE status = 'pending' ORDER BY submitted_at ASC")
    .all<OrgSuggestion>();
  return result.results ?? [];
}

export async function getOrgSuggestionById(db: D1Database, id: string): Promise<OrgSuggestion | null> {
  const row = await db.prepare('SELECT * FROM org_suggestions WHERE id = ?').bind(id).first<OrgSuggestion>();
  return row ?? null;
}

export async function updateOrgSuggestionStatus(
  db: D1Database,
  id: string,
  status: OrgSuggestionStatus,
): Promise<OrgSuggestion | null> {
  await db.prepare('UPDATE org_suggestions SET status = ? WHERE id = ?').bind(status, id).run();
  return getOrgSuggestionById(db, id);
}

// ---------- Shared-address handling ----------

export async function listOtherCampsAtAddress(
  db: D1Database,
  address: string,
  city: string,
  zip: string,
  excludeId?: string,
): Promise<Camp[]> {
  const today = todayDateISO();
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved'
         AND p.session_end_date >= ?
         AND LOWER(TRIM(o.address)) = LOWER(TRIM(?))
         AND LOWER(TRIM(o.city))    = LOWER(TRIM(?))
         AND TRIM(o.zip)            = TRIM(?)
         ${excludeId ? 'AND p.id != ?' : ''}
       ORDER BY p.session_start_date ASC`,
    )
    .bind(...(excludeId ? [today, address, city, zip, excludeId] : [today, address, city, zip]))
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
      `${CAMP_SELECT}
       WHERE p.pcd_status IN ('approved', 'pending')
         AND LOWER(TRIM(o.address)) = LOWER(TRIM(?))
         AND LOWER(TRIM(o.city))    = LOWER(TRIM(?))
         AND TRIM(o.zip)            = TRIM(?)
       ORDER BY p.name ASC`,
    )
    .bind(address, city, zip)
    .all<Camp>();
  return result.results ?? [];
}

// ---------- Verified flag + hero photo ----------

export type CampVerificationBlockCode = 'not_found' | 'not_approved' | 'source_missing' | 'source_not_https';

export class CampVerificationBlockedError extends Error {
  constructor(readonly code: CampVerificationBlockCode) {
    super(`camp verification blocked: ${code}`);
    this.name = 'CampVerificationBlockedError';
  }
}

export function campVerificationBlock(camp: Camp | null): CampVerificationBlockCode | null {
  if (!camp) return 'not_found';
  if (camp.status !== 'approved') return 'not_approved';
  const source = camp.registration_url || camp.website_url;
  if (!camp.source_domain || !source) return 'source_missing';
  try {
    if (new URL(source).protocol !== 'https:') return 'source_not_https';
  } catch {
    return 'source_not_https';
  }
  return null;
}

export async function setVerified(db: D1Database, id: string, verified: boolean): Promise<void> {
  if (verified) {
    const blocked = campVerificationBlock(await getCampById(db, id));
    if (blocked) throw new CampVerificationBlockedError(blocked);
  }
  await db
    .prepare(`UPDATE programs
                SET verified = ?,
                    last_verified_at = CASE WHEN ? = 1 THEN ? ELSE last_verified_at END
              WHERE id = ?`)
    .bind(verified ? 1 : 0, verified ? 1 : 0, nowIso(), id)
    .run();
}

export async function setFeatured(
  db: D1Database,
  id: string,
  featured: boolean,
  featuredOrder?: number | null,
  featuredUntil?: string | null,
): Promise<void> {
  await db
    .prepare(
      `UPDATE programs SET featured = ?, featured_order = ?, featured_until = ? WHERE id = ?`,
    )
    .bind(featured ? 1 : 0, featuredOrder ?? null, featuredUntil ?? null, id)
    .run();
}

export async function setHeroPhotoKey(db: D1Database, id: string, key: string | null): Promise<void> {
  await db
    .prepare('UPDATE programs SET hero_photo_key = ? WHERE id = ?')
    .bind(key, id)
    .run();
}

// ---------- Geocoding cache ----------
// ActivityRadar's geocoded_addresses schema uses address_key (canonical string)
// as the primary key — simpler than the hash + canonical pair in the old PCD schema.

const canonicalAddress = (address: string, city: string, state: string, zip: string): string =>
  `${address.trim().toLowerCase()}|${city.trim().toLowerCase()}|${state.trim().toUpperCase()}|${zip.trim()}`;

export async function getCachedGeocode(
  db: D1Database,
  address: string,
  city: string,
  state: string,
  zip: string,
): Promise<{ lat: number; lon: number } | null> {
  const key = canonicalAddress(address, city, state, zip);
  const row = await db
    .prepare('SELECT latitude, longitude FROM geocoded_addresses WHERE address_key = ?')
    .bind(key)
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
  const key = canonicalAddress(address, city, state, zip);
  await db
    .prepare(
      `INSERT INTO geocoded_addresses (address_key, latitude, longitude, geocoded_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(address_key) DO UPDATE SET
         latitude = excluded.latitude,
         longitude = excluded.longitude,
         geocoded_at = excluded.geocoded_at`,
    )
    .bind(key, lat, lon, nowIso())
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

// ---------- Trust-tier auto-approve ----------

export async function shouldAutoApprove(db: D1Database, email: string): Promise<boolean> {
  const submitter = await getSubmitter(db, email);
  if (!submitter) return false;
  return submitter.trust_level === 'trusted';
}

// ---------- Zip-code radius search ----------

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

// ---------- Reviews ----------

export interface NewReviewInput {
  id: string;
  camp_id: string;
  reviewer_email: string;
  reviewer_display_name: string | null;
  rating: number;
  body: string;
  submitted_at: string;
}

export function prepareReviewInsert(db: D1Database, review: NewReviewInput): D1PreparedStatement {
  return db
    .prepare(
      `INSERT INTO camp_reviews
         (id, camp_id, reviewer_email, reviewer_display_name, rating, body, status, submitted_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
    )
    .bind(review.id, review.camp_id, review.reviewer_email, review.reviewer_display_name, review.rating, review.body, review.submitted_at);
}

export async function insertReview(db: D1Database, review: NewReviewInput): Promise<void> {
  await prepareReviewInsert(db, review).run();
}

export async function listApprovedReviewsForCamp(db: D1Database, campId: string): Promise<CampReview[]> {
  const result = await db
    .prepare(
      "SELECT * FROM camp_reviews WHERE camp_id = ? AND status = 'approved' ORDER BY submitted_at DESC",
    )
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
      'User-Agent': 'parentcoachdesk.com camps directory (support@parentcoachdesk.com)',
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

// ---------- Fuzzy dedup ----------

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
  const result = await db
    .prepare(
      `${CAMP_SELECT} WHERE p.pcd_status IN ('approved', 'pending', 'rejected')`,
    )
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
    if (c.status === 'rejected') continue;

    const cCity = c.city.trim().toLowerCase();
    const cState = c.state.trim().toUpperCase();
    const cName = c.name.trim().toLowerCase();
    const cNormName = normalizeCampName(c.name);
    const cOrgKey = extractOrgKey(c.website_url);

    if (cName === candidate.name.trim().toLowerCase() && cCity === candidateCity && cState === candidateState) {
      set(c, 'exact-name-city'); continue;
    }
    if (cNormName && cNormName === candidateNormName && cCity === candidateCity && cState === candidateState) {
      set(c, 'normalized-name-city'); continue;
    }
    if (candidateOrgKey && cOrgKey && cOrgKey === candidateOrgKey) {
      set(c, 'same-website'); continue;
    }
    if (
      candidateAddress && candidateZip &&
      c.address.trim().toLowerCase() === candidateAddress &&
      cCity === candidateCity &&
      c.zip.trim() === candidateZip
    ) {
      set(c, 'same-address'); continue;
    }
  }

  return Array.from(seen.values());
}

/**
 * Bulk counterpart to findFuzzyCampMatches, added 2026-07-20.
 *
 * The admin queue page (queue.astro) was calling findFuzzyCampMatches once
 * per pending camp — each call re-running its own `WHERE pcd_status IN
 * (approved, pending, rejected)` D1 query against the whole comparison pool.
 * With N pending camps and that same pool size M, the page issued N separate
 * D1 subrequests and did O(N*M) work re-deriving the same per-row normalized
 * name/city/state/orgKey on every single call. Once the pending queue grew
 * past a few dozen rows (exactly what a daily evergreen-extraction pipeline
 * landing pcd_status='pending' rows does if nobody's approving them), this
 * blew past Workers per-request subrequest/CPU limits and the whole queue
 * page started 500ing (Cloudflare 1102 "Worker exceeded resource limits").
 *
 * This version fetches the comparison pool exactly once, precomputes each
 * row's derived fields exactly once, and then matches every candidate against
 * that single in-memory pool — one D1 round trip total, no matter how many
 * candidates are pending. Matching logic is intentionally kept identical to
 * findFuzzyCampMatches (same four reasons, same precedence), so results for
 * a given candidate are the same whichever function computed them.
 */
export async function findFuzzyCampMatchesBulk(
  db: D1Database,
  candidates: Array<{
    id: string;
    name: string;
    city: string;
    state: string;
    zip?: string | null;
    address?: string | null;
    website_url?: string | null;
  }>,
): Promise<Map<string, FuzzyMatchResult[]>> {
  const out = new Map<string, FuzzyMatchResult[]>();
  if (candidates.length === 0) return out;

  const result = await db
    .prepare(`${CAMP_SELECT} WHERE p.pcd_status IN ('approved', 'pending', 'rejected')`)
    .all<Camp>();
  const all = result.results ?? [];

  // Precompute each comparison row's derived fields once, not once per candidate.
  const pool = all.map((c) => ({
    camp: c,
    cCity: c.city.trim().toLowerCase(),
    cState: c.state.trim().toUpperCase(),
    cNameLower: c.name.trim().toLowerCase(),
    cNormName: normalizeCampName(c.name),
    cOrgKey: extractOrgKey(c.website_url),
    cAddressLower: c.address.trim().toLowerCase(),
    cZip: c.zip.trim(),
  }));

  for (const candidate of candidates) {
    const candidateNormName = normalizeCampName(candidate.name);
    const candidateNameLower = candidate.name.trim().toLowerCase();
    const candidateCity = candidate.city.trim().toLowerCase();
    const candidateState = candidate.state.trim().toUpperCase();
    const candidateOrgKey = extractOrgKey(candidate.website_url ?? null);
    const candidateAddress = (candidate.address ?? '').trim().toLowerCase();
    const candidateZip = (candidate.zip ?? '').trim();

    const seen = new Map<string, FuzzyMatchResult>();
    const set = (camp: Camp, reason: FuzzyMatchResult['reason']) => {
      if (!seen.has(camp.id)) seen.set(camp.id, { camp, reason });
    };

    for (const row of pool) {
      if (
        row.camp.status === 'rejected' &&
        row.camp.reject_reason_code === 'dead-url' &&
        candidate.website_url &&
        row.camp.website_url &&
        row.camp.website_url.trim().toLowerCase() === candidate.website_url.trim().toLowerCase()
      ) {
        set(row.camp, 'previously-rejected-dead-url');
      }
    }

    for (const row of pool) {
      if (row.camp.status === 'rejected') continue;

      if (row.cNameLower === candidateNameLower && row.cCity === candidateCity && row.cState === candidateState) {
        set(row.camp, 'exact-name-city'); continue;
      }
      if (row.cNormName && row.cNormName === candidateNormName && row.cCity === candidateCity && row.cState === candidateState) {
        set(row.camp, 'normalized-name-city'); continue;
      }
      if (candidateOrgKey && row.cOrgKey && row.cOrgKey === candidateOrgKey) {
        set(row.camp, 'same-website'); continue;
      }
      if (
        candidateAddress && candidateZip &&
        row.cAddressLower === candidateAddress &&
        row.cCity === candidateCity &&
        row.cZip === candidateZip
      ) {
        set(row.camp, 'same-address'); continue;
      }
    }

    out.set(candidate.id, Array.from(seen.values()));
  }

  return out;
}

// ---------- URL health ----------

export async function updateUrlHealth(
  db: D1Database,
  id: string,
  status: UrlHealthStatus,
  statusCode: number | null,
): Promise<void> {
  await db
    .prepare(
      `UPDATE programs
       SET url_health_status = ?, url_last_checked_at = ?, url_last_status_code = ?
       WHERE id = ?`,
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
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved'
         AND o.website_url IS NOT NULL
         AND (p.url_last_checked_at IS NULL OR p.url_last_checked_at < ?)
       ORDER BY p.url_last_checked_at ASC NULLS FIRST
       LIMIT ?`,
    )
    .bind(beforeIso, limit)
    .all<Camp>();
  return result.results ?? [];
}

export async function listStaleCamps(
  db: D1Database,
  beforeDate: string,
  limit = 25,
): Promise<Camp[]> {
  // 101 permits archiveStaleCamps to fetch a 100-row batch plus one backlog sentinel.
  const boundedLimit = Math.min(101, Math.max(1, Math.floor(limit)));
  const result = await db
    .prepare(
      `${CAMP_SELECT}
       WHERE p.pcd_status = 'approved' AND p.session_end_date < ?
       ORDER BY p.session_end_date ASC, p.id ASC
       LIMIT ?`,
    )
    .bind(beforeDate, boundedLimit)
    .all<Camp>();
  return result.results ?? [];
}

export async function archiveStaleCamps(
  db: D1Database,
  todayDate: string,
  reviewer: string,
  limit = 25,
): Promise<{ archived: number; hasMore: boolean }> {
  const boundedLimit = Math.min(100, Math.max(1, Math.floor(limit)));
  // Fetch one extra row to signal backlog without a second count query.
  const stale = await listStaleCamps(db, todayDate, boundedLimit + 1);
  const batch = stale.slice(0, boundedLimit);
  for (const c of batch) {
    await rejectCamp(db, c.id, reviewer, 'auto-archived past-date', 'past-date');
  }
  return { archived: batch.length, hasMore: stale.length > boundedLimit };
}

// ---------- Domain quality ----------
// ActivityRadar's domain_quality schema was extended in migration 0013 to add
// submitted_count, high_confidence_count, low_confidence_count, last_seen_at.

export async function upsertDomainQuality(
  db: D1Database,
  domain: string | null,
  outcome: DomainQualityOutcome,
  confidence?: ConfidenceLevel,
): Promise<void> {
  if (!domain) return;
  const now = nowIso();
  const submittedDelta   = outcome === 'submitted' ? 1 : 0;
  const approvedDelta    = outcome === 'approved'  ? 1 : 0;
  const rejectedDelta    = outcome === 'rejected'  ? 1 : 0;
  const highDelta        = outcome === 'submitted' && confidence === 'high' ? 1 : 0;
  const lowDelta         = outcome === 'submitted' && confidence === 'low'  ? 1 : 0;

  await db
    .prepare(
      `INSERT INTO domain_quality
         (domain, trust_score, approved_count, rejected_count, blocked,
          submitted_count, high_confidence_count, low_confidence_count, last_seen_at, updated_at)
       VALUES (?, 50, ?, ?, 0, ?, ?, ?, ?, ?)
       ON CONFLICT(domain) DO UPDATE SET
         approved_count        = approved_count        + ?,
         rejected_count        = rejected_count        + ?,
         submitted_count       = submitted_count       + ?,
         high_confidence_count = high_confidence_count + ?,
         low_confidence_count  = low_confidence_count  + ?,
         last_seen_at          = excluded.last_seen_at,
         updated_at            = excluded.updated_at`,
    )
    .bind(
      domain,
      approvedDelta, rejectedDelta,
      submittedDelta, highDelta, lowDelta,
      now, now,
      approvedDelta, rejectedDelta,
      submittedDelta, highDelta, lowDelta,
    )
    .run();
}

export async function listDomainQuality(db: D1Database): Promise<DomainQuality[]> {
  const result = await db
    .prepare(
      `SELECT domain, submitted_count, approved_count, rejected_count,
              high_confidence_count, low_confidence_count, last_seen_at, notes
       FROM domain_quality
       ORDER BY submitted_count DESC, last_seen_at DESC`,
    )
    .all<DomainQuality>();
  return result.results ?? [];
}

export async function getDomainQuality(db: D1Database, domain: string): Promise<DomainQuality | null> {
  const row = await db
    .prepare(
      `SELECT domain, submitted_count, approved_count, rejected_count,
              high_confidence_count, low_confidence_count, last_seen_at, notes
       FROM domain_quality WHERE domain = ?`,
    )
    .bind(domain)
    .first<DomainQuality>();
  return row ?? null;
}
