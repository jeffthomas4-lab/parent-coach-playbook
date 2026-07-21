// Admin-maintained skip-list for low-quality source domains.
//
// Backs /admin/source-quality's "Add to skip-list" / "Unskip" actions and the
// per-domain "Reject all pending from this domain" bulk action. Enforced at
// POST /api/camps/submit (see src/pages/api/camps/submit.ts) so a domain
// added here cannot land a new submission going forward — both the CSV
// import script and the Claude-in-Chrome workflow post through that same
// endpoint, so this is the single enforcement point for both paths.
//
// Table: migrations/0017_domain_skip_list.sql.

import type { D1Database } from '@cloudflare/workers-types';

export interface DomainSkipEntry {
  domain: string;
  reason: string | null;
  added_by: string | null;
  added_at: string;
}

const nowIso = () => new Date().toISOString();

/** True when this exact domain (already normalized: lowercase, no www.) is skip-listed. */
export async function isDomainSkipListed(db: D1Database, domain: string | null | undefined): Promise<boolean> {
  if (!domain) return false;
  const row = await db
    .prepare('SELECT domain FROM domain_skip_list WHERE domain = ?')
    .bind(domain)
    .first<{ domain: string }>();
  return !!row;
}

export async function getSkipListEntry(db: D1Database, domain: string): Promise<DomainSkipEntry | null> {
  const row = await db
    .prepare('SELECT domain, reason, added_by, added_at FROM domain_skip_list WHERE domain = ?')
    .bind(domain)
    .first<DomainSkipEntry>();
  return row ?? null;
}

/** All skip-listed domains, keyed by domain, for the source-quality page to merge into its table. */
export async function listSkipListedDomains(db: D1Database): Promise<Map<string, DomainSkipEntry>> {
  const result = await db
    .prepare('SELECT domain, reason, added_by, added_at FROM domain_skip_list')
    .all<DomainSkipEntry>();
  const out = new Map<string, DomainSkipEntry>();
  for (const row of result.results ?? []) out.set(row.domain, row);
  return out;
}

/** Insert or update (upsert) a skip-list entry. Re-adding an already-listed domain refreshes the reason/added_by/added_at. */
export async function addDomainToSkipList(
  db: D1Database,
  domain: string,
  reason: string,
  addedBy: string,
): Promise<void> {
  const now = nowIso();
  await db
    .prepare(
      `INSERT INTO domain_skip_list (domain, reason, added_by, added_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(domain) DO UPDATE SET
         reason = excluded.reason,
         added_by = excluded.added_by,
         added_at = excluded.added_at`,
    )
    .bind(domain, reason, addedBy, now)
    .run();
}

export async function removeDomainFromSkipList(db: D1Database, domain: string): Promise<void> {
  await db.prepare('DELETE FROM domain_skip_list WHERE domain = ?').bind(domain).run();
}

/**
 * Bulk-rejects every still-pending program whose source_domain matches, for
 * the "Reject all pending from this domain" destructive action. Scoped to
 * pcd_status = 'pending' only — already-approved or already-rejected rows are
 * left alone. Returns the number of rows actually transitioned, so the caller
 * can report an honest affected count even if some were already decided.
 */
export async function bulkRejectPendingByDomain(
  db: D1Database,
  domain: string,
  reviewer: string,
  reasonCode: string,
  notes: string,
): Promise<number> {
  const now = nowIso();
  const result = await db
    .prepare(
      `UPDATE programs
       SET pcd_status = 'rejected', record_status = 'inactive', awaiting_review = 0,
           reviewed_by = ?, reviewed_at = ?, review_notes = ?, reject_reason_code = ?
       WHERE source_domain = ? AND pcd_status = 'pending'`,
    )
    .bind(reviewer, now, notes, reasonCode, domain)
    .run();
  return Number(result?.meta?.changes ?? 0);
}
