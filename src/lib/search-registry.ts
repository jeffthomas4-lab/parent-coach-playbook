// Query helpers for the camp-search domain registry.
// Backs the /api/camps/search-priority endpoint and the markdown generators.

import type { D1Database } from '@cloudflare/workers-types';

export type SearchResult =
  | 'unknown'
  | 'camps_extracted'
  | 'partial'
  | 'blocked'
  | 'stale_listings'
  | 'no_camps';

export interface SearchDomain {
  domain: string;
  organization: string | null;
  area_covered: string;
  last_checked: string | null;
  result: SearchResult;
  camps_pulled: number;
  next_recheck_after: string | null;
  notes: string | null;
  permanent_skip: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface SearchAnchor {
  slug: string;
  city: string;
  radius_miles: number;
  status: 'not_started' | 'in_progress' | 'saturated' | 'diminishing' | 'paused';
  last_batch_at: string | null;
  next_batch_after: string | null;
  notes: string | null;
  ring: number;
  position: number;
}

export interface SearchBatch {
  id: string;
  batch_date: string;
  anchor_slug: string;
  source_file: string | null;
  rows_imported: number;
  rows_rejected: number;
  notes: string | null;
}

const SLIM_NOTE_LEN = 80;

/** Truncate a note for the LLM-facing slim view. */
export function slimNote(note: string | null): string {
  if (!note) return '';
  const flat = note.replace(/\s+/g, ' ').trim();
  return flat.length <= SLIM_NOTE_LEN ? flat : flat.slice(0, SLIM_NOTE_LEN - 1) + '…';
}

/** True if this domain matches the anchor (by area_covered substring). */
export function inAnchor(domain: SearchDomain, anchorSlug: string): boolean {
  return domain.area_covered.split(',').map((s) => s.trim()).includes(anchorSlug)
    || domain.area_covered.toLowerCase().includes(anchorSlug.toLowerCase().replace('-', ' '));
}

/** All domains, ordered by domain name. */
export async function listAllDomains(db: D1Database): Promise<SearchDomain[]> {
  const result = await db
    .prepare(`SELECT * FROM search_domains ORDER BY domain ASC`)
    .all<SearchDomain>();
  return result.results ?? [];
}

/** Domains scoped to a single anchor. */
export async function listDomainsForAnchor(
  db: D1Database,
  anchorSlug: string,
): Promise<SearchDomain[]> {
  const all = await listAllDomains(db);
  return all.filter((d) => inAnchor(d, anchorSlug));
}

/** Domains where next_recheck_after is on or before today. */
export async function listRecheckDue(
  db: D1Database,
  anchorSlug: string,
  today: string,
): Promise<SearchDomain[]> {
  const scoped = await listDomainsForAnchor(db, anchorSlug);
  return scoped.filter(
    (d) =>
      !d.permanent_skip &&
      d.next_recheck_after !== null &&
      d.next_recheck_after <= today &&
      d.result !== 'no_camps',
  );
}

/**
 * Domains the LLM should NOT visit at all. Returned as bare domain strings so
 * the JSON payload stays small even when the list is large.
 */
export async function listSkipDomains(
  db: D1Database,
  anchorSlug: string,
  today: string,
): Promise<string[]> {
  const scoped = await listDomainsForAnchor(db, anchorSlug);
  const skip = scoped.filter((d) => {
    if (d.permanent_skip) return true;
    if (d.result === 'no_camps') return true;
    if (d.next_recheck_after && d.next_recheck_after > today) return true;
    return false;
  });
  return skip.map((d) => d.domain).sort();
}

/** Anchor row by slug. */
export async function getAnchor(db: D1Database, slug: string): Promise<SearchAnchor | null> {
  const row = await db
    .prepare(`SELECT * FROM search_anchors WHERE slug = ?`)
    .bind(slug)
    .first<SearchAnchor>();
  return row ?? null;
}

/** Insert or update a domain. */
export async function upsertDomain(
  db: D1Database,
  d: Omit<SearchDomain, 'created_at' | 'updated_at'>,
): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO search_domains
         (domain, organization, area_covered, last_checked, result, camps_pulled,
          next_recheck_after, notes, permanent_skip, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(domain) DO UPDATE SET
         organization = excluded.organization,
         area_covered = excluded.area_covered,
         last_checked = excluded.last_checked,
         result = excluded.result,
         camps_pulled = excluded.camps_pulled,
         next_recheck_after = excluded.next_recheck_after,
         notes = excluded.notes,
         permanent_skip = excluded.permanent_skip,
         updated_at = excluded.updated_at`,
    )
    .bind(
      d.domain,
      d.organization,
      d.area_covered,
      d.last_checked,
      d.result,
      d.camps_pulled,
      d.next_recheck_after,
      d.notes,
      d.permanent_skip,
      now,
      now,
    )
    .run();
}

export async function upsertAnchor(
  db: D1Database,
  a: Omit<SearchAnchor, never>,
): Promise<void> {
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO search_anchors
         (slug, city, radius_miles, status, last_batch_at, next_batch_after, notes, ring, position, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET
         city = excluded.city,
         radius_miles = excluded.radius_miles,
         status = excluded.status,
         last_batch_at = excluded.last_batch_at,
         next_batch_after = excluded.next_batch_after,
         notes = excluded.notes,
         ring = excluded.ring,
         position = excluded.position,
         updated_at = excluded.updated_at`,
    )
    .bind(
      a.slug,
      a.city,
      a.radius_miles,
      a.status,
      a.last_batch_at,
      a.next_batch_after,
      a.notes,
      a.ring,
      a.position,
      now,
      now,
    )
    .run();
}
