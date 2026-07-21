// D1 query helpers for the /admin/data-quality drill-down page.
//
// operations-status.ts's "Directory data quality" component reports aggregate
// counts for a fixed set of quality problems on approved `programs` rows.
// This file is the row-level counterpart: it fetches the actual offending
// programs behind each aggregate metric, and applies the narrow, whitelisted
// fixes the admin page offers per issue type.
//
// Every read here joins organizations directly (LEFT JOIN, since a program's
// organization_id is expected but a dangling reference should surface as
// nulls, not vanish the row) rather than reusing camps-db.ts's getCampById,
// because that helper COALESCEs age_min/age_max to 0 and never selects the
// raw `price` column — both of which would mask the exact rows this page
// exists to surface.
//
// Every write sets updated_at, last_edited_at, and last_edited_by so these
// fixes leave the same audit trail as the admin camp-edit form.

import { extractDomain, rejectCamp } from './camps-db';

export interface ProgramIssueRow {
  id: string;
  name: string;
  organization_name: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  age_min: number | null;
  age_max: number | null;
  session_start_date: string | null;
  session_end_date: string | null;
  price: number | null;
  registration_url: string | null;
  source_domain: string | null;
  verified: 0 | 1;
  last_verified_at: string | null;
  url_last_checked_at: string | null;
}

export interface DuplicateGroup {
  dedupe_key: string;
  members: ProgramIssueRow[];
}

export interface DataQualityReport {
  age_missing: ProgramIssueRow[];
  age_impossible: ProgramIssueRow[];
  dates_missing: ProgramIssueRow[];
  dates_reversed: ProgramIssueRow[];
  negative_price: ProgramIssueRow[];
  registration_url_missing: ProgramIssueRow[];
  registration_url_non_https: ProgramIssueRow[];
  source_domain_missing: ProgramIssueRow[];
  verified_without_timestamp: ProgramIssueRow[];
  verified_invalid_timestamp: ProgramIssueRow[];
  verified_future_timestamp: ProgramIssueRow[];
  duplicates: DuplicateGroup[];
  url_never_checked: { rows: ProgramIssueRow[]; total: number };
}

// Cap on the url_never_checked list — roughly 1450 approved rows carry a null
// url_last_checked_at in production, far too many to list one-by-one. Every
// other issue type here is a genuine data-contract violation and stays small
// in practice, so those are listed in full.
const URL_NEVER_CHECKED_LIMIT = 50;

const ISSUE_SELECT = `
  SELECT p.id, p.name, o.name AS organization_name, o.city, o.state, o.address,
         p.age_min, p.age_max, p.session_start_date, p.session_end_date, p.price,
         p.registration_url, p.source_domain, p.verified, p.last_verified_at, p.url_last_checked_at
    FROM programs p LEFT JOIN organizations o ON o.id = p.organization_id
`;

async function issueRows(db: D1Database, whereClause: string, limit?: number): Promise<ProgramIssueRow[]> {
  const sql = `${ISSUE_SELECT} WHERE p.pcd_status = 'approved' AND (${whereClause}) ORDER BY p.name${
    limit ? ` LIMIT ${limit}` : ''
  }`;
  const res = await db.prepare(sql).all<ProgramIssueRow>();
  return res.results ?? [];
}

async function countWhere(db: D1Database, whereClause: string): Promise<number> {
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM programs p WHERE p.pcd_status = 'approved' AND (${whereClause})`)
    .first<{ n: number }>();
  return Number(row?.n ?? 0);
}

async function getDuplicateGroups(db: D1Database): Promise<DuplicateGroup[]> {
  const sql = `
    WITH keyed AS (
      SELECT p.id, p.name, o.name AS organization_name, o.city, o.state, o.address,
             p.age_min, p.age_max, p.session_start_date, p.session_end_date, p.price,
             p.registration_url, p.source_domain, p.verified, p.last_verified_at, p.url_last_checked_at,
             lower(trim(COALESCE(p.name, ''))) || char(31) ||
             lower(trim(COALESCE(o.city, ''))) || char(31) ||
             upper(trim(COALESCE(o.state, ''))) || char(31) ||
             lower(trim(COALESCE(o.address, ''))) || char(31) ||
             COALESCE(p.session_start_date, '') || char(31) || COALESCE(p.session_end_date, '') AS dedupe_key
        FROM programs p LEFT JOIN organizations o ON o.id = p.organization_id
       WHERE p.pcd_status = 'approved'
    )
    SELECT * FROM keyed WHERE dedupe_key IN (
      SELECT dedupe_key FROM keyed GROUP BY dedupe_key HAVING COUNT(*) > 1
    ) ORDER BY dedupe_key, id
  `;
  const res = await db.prepare(sql).all<ProgramIssueRow & { dedupe_key: string }>();
  const rows = res.results ?? [];
  const groups = new Map<string, ProgramIssueRow[]>();
  for (const row of rows) {
    const { dedupe_key, ...rest } = row;
    if (!groups.has(dedupe_key)) groups.set(dedupe_key, []);
    groups.get(dedupe_key)!.push(rest as ProgramIssueRow);
  }
  return Array.from(groups.entries()).map(([dedupe_key, members]) => ({ dedupe_key, members }));
}

/** Full report behind every "Directory data quality" aggregate metric. */
export async function getDataQualityReport(db: D1Database): Promise<DataQualityReport> {
  const [
    age_missing,
    age_impossible,
    dates_missing,
    dates_reversed,
    negative_price,
    registration_url_missing,
    registration_url_non_https,
    source_domain_missing,
    verified_without_timestamp,
    verified_invalid_timestamp,
    verified_future_timestamp,
    duplicates,
    urlNeverCheckedRows,
    urlNeverCheckedTotal,
  ] = await Promise.all([
    issueRows(db, 'p.age_min IS NULL OR p.age_max IS NULL'),
    issueRows(db, 'p.age_min < 0 OR p.age_max > 25 OR p.age_min > p.age_max'),
    issueRows(db, 'p.session_start_date IS NULL OR p.session_end_date IS NULL'),
    issueRows(db, 'p.session_start_date > p.session_end_date'),
    issueRows(db, 'p.price < 0'),
    issueRows(db, `p.registration_url IS NULL OR trim(p.registration_url) = ''`),
    issueRows(db, `p.registration_url IS NOT NULL AND lower(p.registration_url) NOT LIKE 'https://%'`),
    issueRows(db, `p.source_domain IS NULL OR trim(p.source_domain) = ''`),
    issueRows(db, `p.verified = 1 AND p.last_verified_at IS NULL`),
    issueRows(db, `p.verified = 1 AND p.last_verified_at IS NOT NULL AND datetime(p.last_verified_at) IS NULL`),
    issueRows(db, `p.verified = 1 AND p.last_verified_at IS NOT NULL AND datetime(p.last_verified_at) > datetime('now')`),
    getDuplicateGroups(db),
    issueRows(db, 'p.url_last_checked_at IS NULL', URL_NEVER_CHECKED_LIMIT),
    countWhere(db, 'p.url_last_checked_at IS NULL'),
  ]);

  return {
    age_missing,
    age_impossible,
    dates_missing,
    dates_reversed,
    negative_price,
    registration_url_missing,
    registration_url_non_https,
    source_domain_missing,
    verified_without_timestamp,
    verified_invalid_timestamp,
    verified_future_timestamp,
    duplicates,
    url_never_checked: { rows: urlNeverCheckedRows, total: urlNeverCheckedTotal },
  };
}

export async function getProgramById(db: D1Database, id: string): Promise<ProgramIssueRow | null> {
  const row = await db.prepare(`${ISSUE_SELECT} WHERE p.id = ?`).bind(id).first<ProgramIssueRow>();
  return row ?? null;
}

// ---------- Fixes ----------
// Every fix returns true only when a row actually changed (D1's reported
// change count), so the API route can tell "fixed" apart from "nothing to do".

function touch(sets: string[], vals: unknown[], editorEmail: string, now: string): void {
  sets.push('updated_at = ?');
  vals.push(now);
  sets.push('last_edited_at = ?');
  vals.push(now);
  sets.push('last_edited_by = ?');
  vals.push(editorEmail);
}

async function runUpdate(db: D1Database, sets: string[], vals: unknown[], id: string): Promise<boolean> {
  vals.push(id);
  const res = await db.prepare(`UPDATE programs SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
  return (res.meta?.changes ?? 0) > 0;
}

export async function setAge(db: D1Database, id: string, ageMin: number, ageMax: number, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['age_min = ?', 'age_max = ?'];
  const vals: unknown[] = [ageMin, ageMax];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function setDates(
  db: D1Database,
  id: string,
  startDate: string,
  endDate: string,
  editorEmail: string,
): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['session_start_date = ?', 'session_end_date = ?'];
  const vals: unknown[] = [startDate, endDate];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function swapDates(db: D1Database, id: string, editorEmail: string): Promise<boolean> {
  const existing = await getProgramById(db, id);
  if (!existing || !existing.session_start_date || !existing.session_end_date) return false;
  return setDates(db, id, existing.session_end_date, existing.session_start_date, editorEmail);
}

export async function setPrice(db: D1Database, id: string, price: number, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['price = ?'];
  const vals: unknown[] = [price];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function clearPrice(db: D1Database, id: string, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['price = NULL'];
  const vals: unknown[] = [];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function setRegistrationUrl(db: D1Database, id: string, url: string, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['registration_url = ?'];
  const vals: unknown[] = [url];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function upgradeToHttps(db: D1Database, id: string, editorEmail: string): Promise<boolean> {
  const existing = await getProgramById(db, id);
  if (!existing?.registration_url || !/^http:\/\//i.test(existing.registration_url)) return false;
  const upgraded = existing.registration_url.replace(/^http:\/\//i, 'https://');
  return setRegistrationUrl(db, id, upgraded, editorEmail);
}

export async function setSourceDomain(db: D1Database, id: string, domain: string, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['source_domain = ?'];
  const vals: unknown[] = [domain];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function deriveSourceDomain(db: D1Database, id: string, editorEmail: string): Promise<boolean> {
  const existing = await getProgramById(db, id);
  if (!existing?.registration_url) return false;
  const domain = extractDomain(existing.registration_url);
  if (!domain) return false;
  return setSourceDomain(db, id, domain, editorEmail);
}

export async function stampVerified(db: D1Database, id: string, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['last_verified_at = ?'];
  const vals: unknown[] = [now];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

export async function unverify(db: D1Database, id: string, editorEmail: string): Promise<boolean> {
  const now = new Date().toISOString();
  const sets = ['verified = 0'];
  const vals: unknown[] = [];
  touch(sets, vals, editorEmail, now);
  return runUpdate(db, sets, vals, id);
}

/** Rejects an extra duplicate-group member. Delegates to camps-db's guarded rejectCamp. */
export async function rejectAsDuplicate(
  db: D1Database,
  id: string,
  editorEmail: string,
): Promise<{ camp: unknown | null; transitioned: boolean }> {
  return rejectCamp(db, id, editorEmail, 'Rejected as duplicate from the data quality drill-down.', 'duplicate');
}
