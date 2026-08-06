// Shared query-parameter validation and read-only enrichment helpers for the
// competitor-intelligence admin API (src/pages/api/admin/intel/**).
//
// Not part of the src/lib/intel/** contract (config/store/pipeline/scoring/
// types) — that module tree is owned by a different workstream. This file
// only helps the admin routes clamp/validate untrusted query params before
// they reach a store call, and enrich store rows with the minimal org/
// competitor display fields the admin page needs (Pre-Launch Security Gate
// item 7: scope every list response to what the page needs, nothing more).

export type ParamResult<T> = { ok: true; value: T } | { ok: false; error: string };

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

/** limit: optional positive integer, clamped to [1, 200], default 50. Garbage input is rejected, not silently defaulted. */
export function parseLimit(raw: string | null): ParamResult<number> {
  if (raw === null || raw === '') return { ok: true, value: DEFAULT_LIMIT };
  if (!/^\d+$/.test(raw)) return { ok: false, error: 'limit must be a non-negative integer' };
  const n = Number(raw);
  if (!Number.isSafeInteger(n) || n < 1) return { ok: false, error: 'limit must be a positive integer' };
  return { ok: true, value: Math.min(n, MAX_LIMIT) };
}

/** offset: optional non-negative integer, default 0. Garbage input is rejected. */
export function parseOffset(raw: string | null): ParamResult<number> {
  if (raw === null || raw === '') return { ok: true, value: 0 };
  if (!/^\d+$/.test(raw)) return { ok: false, error: 'offset must be a non-negative integer' };
  const n = Number(raw);
  if (!Number.isSafeInteger(n) || n < 0) return { ok: false, error: 'offset must be a non-negative integer' };
  return { ok: true, value: n };
}

/** A bounded integer query param (e.g. minConfidence 0-100, minPriority 0-100). */
export function parseBoundedInt(raw: string | null, min: number, max: number, label: string): ParamResult<number | undefined> {
  if (raw === null || raw === '') return { ok: true, value: undefined };
  if (!/^-?\d+$/.test(raw)) return { ok: false, error: `${label} must be an integer between ${min} and ${max}` };
  const n = Number(raw);
  if (!Number.isSafeInteger(n) || n < min || n > max) return { ok: false, error: `${label} must be an integer between ${min} and ${max}` };
  return { ok: true, value: n };
}

/** A query param that must be one of a fixed allowlist of strings, or absent. */
export function parseEnumParam<T extends string>(raw: string | null, allowed: readonly T[], label: string): ParamResult<T | undefined> {
  if (raw === null || raw === '') return { ok: true, value: undefined };
  if (!(allowed as readonly string[]).includes(raw)) {
    return { ok: false, error: `${label} must be one of: ${allowed.join(', ')}` };
  }
  return { ok: true, value: raw as T };
}

/** competitorId: lowercase slug identifier, matching how competitors.id is minted (see COMPETITOR_DEFINITIONS). */
export function parseCompetitorId(raw: string | null): ParamResult<string | undefined> {
  if (raw === null || raw === '') return { ok: true, value: undefined };
  const trimmed = raw.trim().toLowerCase();
  if (!/^[a-z0-9_-]{1,64}$/.test(trimmed)) return { ok: false, error: 'competitorId is not a valid identifier' };
  return { ok: true, value: trimmed };
}

// USPS state/territory codes. organizations.state is stored as a two-letter code.
const US_STATE_CODES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY', 'DC', 'PR', 'GU', 'VI', 'AS', 'MP',
]);

/** state: two-letter USPS code, or absent. */
export function parseStateParam(raw: string | null): ParamResult<string | undefined> {
  if (raw === null || raw === '') return { ok: true, value: undefined };
  const upper = raw.trim().toUpperCase();
  if (!US_STATE_CODES.has(upper)) return { ok: false, error: 'state must be a valid two-letter USPS code' };
  return { ok: true, value: upper };
}

export interface OrgSummary {
  name: string;
  city: string | null;
  state: string | null;
  website_url: string | null;
}

/**
 * Batch-fetch the minimal organization display fields (name/city/state/
 * website_url) for a set of org ids. Never selects anything beyond those four
 * columns — org_tech_stack and intel_review_queue rows only carry an org_id,
 * and the admin page needs a human-readable label for it, nothing more.
 */
export async function fetchOrgSummaries(db: D1Database, orgIds: readonly (string | null)[]): Promise<Map<string, OrgSummary>> {
  const ids = Array.from(new Set(orgIds.filter((id): id is string => typeof id === 'string' && id.length > 0)));
  const out = new Map<string, OrgSummary>();
  if (ids.length === 0) return out;
  const placeholders = ids.map(() => '?').join(',');
  const { results } = await db
    .prepare(`SELECT id, name, city, state, website_url FROM organizations WHERE id IN (${placeholders})`)
    .bind(...ids)
    .all<{ id: string; name: string; city: string | null; state: string | null; website_url: string | null }>();
  for (const row of results) {
    out.set(row.id, { name: row.name, city: row.city, state: row.state, website_url: row.website_url });
  }
  return out;
}

/**
 * Batch-fetch competitor display names for a set of competitor ids. Only
 * selects id + display_name — the admin page never needs the full catalog
 * row (notes, migration_difficulty, etc.) just to label a detection.
 */
export async function fetchCompetitorNames(db: D1Database, competitorIds: readonly (string | null)[]): Promise<Map<string, string>> {
  const ids = Array.from(new Set(competitorIds.filter((id): id is string => typeof id === 'string' && id.length > 0)));
  const out = new Map<string, string>();
  if (ids.length === 0) return out;
  const placeholders = ids.map(() => '?').join(',');
  const { results } = await db
    .prepare(`SELECT id, display_name FROM competitors WHERE id IN (${placeholders})`)
    .bind(...ids)
    .all<{ id: string; display_name: string }>();
  for (const row of results) out.set(row.id, row.display_name);
  return out;
}
