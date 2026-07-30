// The audited tables do not all live in one database. Only trust_cases sits in
// the operational database (PCD_OPS_DB); the other six are still in the shared
// directory database (DB, activity-radar). Pointing the whole audit at a single
// binding made six of the seven rows report "Not installed" — a privacy report
// that quietly says nothing. Each policy therefore names its own binding and
// the audit routes the query to the database that actually holds the table.
export type RetentionAuditBinding = 'DB' | 'PCD_OPS_DB';

export interface RetentionAuditPolicy {
  domain: string;
  table: string;
  binding: RetentionAuditBinding;
  dateColumn: string;
  personalDataPredicate: string;
  reviewAfterDays: number;
  disposition: 'proposal-only' | 'counsel-required';
}

export interface RetentionAuditResult extends RetentionAuditPolicy {
  tablePresent: boolean;
  totalPersonalRecords: number | null;
  recordsPastReviewHorizon: number | null;
  oldestRecordAt: string | null;
  error: 'query-failed' | 'database-unavailable' | null;
}

/** Only the bindings the audit reads. Either may be absent at runtime. */
export interface RetentionAuditDatabases {
  DB?: D1Database;
  PCD_OPS_DB?: D1Database;
}

// Review horizons are not deletion authorization. Any deletion workflow needs
// an approved policy, hold logic, bounded dry run, recovery proof, and explicit
// production-data approval.
export const RETENTION_AUDIT_POLICIES: readonly RetentionAuditPolicy[] = [
  { domain: 'Sanitized search demand', table: 'search_events', binding: 'DB', dateColumn: 'created_at', personalDataPredicate: '1 = 1', reviewAfterDays: 90, disposition: 'proposal-only' },
  { domain: 'Directory suggestions', table: 'org_suggestions', binding: 'DB', dateColumn: 'submitted_at', personalDataPredicate: 'submitter_email IS NOT NULL', reviewAfterDays: 180, disposition: 'counsel-required' },
  { domain: 'Camp claims', table: 'camp_claims', binding: 'DB', dateColumn: 'submitted_at', personalDataPredicate: 'claimant_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Camp reviews', table: 'camp_reviews', binding: 'DB', dateColumn: 'submitted_at', personalDataPredicate: 'reviewer_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Trust and rights cases', table: 'trust_cases', binding: 'PCD_OPS_DB', dateColumn: 'submitted_at', personalDataPredicate: 'requester_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Public program submissions', table: 'programs', binding: 'DB', dateColumn: 'submitted_at', personalDataPredicate: 'submitted_by_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Submitter registry', table: 'submitters', binding: 'DB', dateColumn: 'last_submitted_at', personalDataPredicate: 'email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
] as const;

interface CountRow { total_records: number; aging_records: number; oldest_record_at: string | null }

interface Catalog { tables: Set<string>; unreadable: boolean }

const BINDINGS: readonly RetentionAuditBinding[] = ['DB', 'PCD_OPS_DB'] as const;

// Every statement this module issues is a SELECT. The audit reports; it never
// deletes, updates, or migrates.
async function readCatalog(db: D1Database | undefined): Promise<Catalog | null> {
  if (!db) return null;
  try {
    const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all<{ name: string }>();
    return { tables: new Set((tables.results ?? []).map((row) => row.name)), unreadable: false };
  } catch {
    // The catalog read itself failed, so table presence is unknown. Report the
    // failure rather than claiming the tables are not installed.
    return { tables: new Set(), unreadable: true };
  }
}

export async function runRetentionAudit(
  databases: RetentionAuditDatabases | undefined,
  now = new Date(),
): Promise<RetentionAuditResult[]> {
  const catalogs = new Map<RetentionAuditBinding, Catalog | null>();
  for (const binding of BINDINGS) {
    catalogs.set(binding, await readCatalog(databases?.[binding]));
  }

  return await Promise.all(RETENTION_AUDIT_POLICIES.map(async (policy): Promise<RetentionAuditResult> => {
    const empty = { totalPersonalRecords: null, recordsPastReviewHorizon: null, oldestRecordAt: null };
    const db = databases?.[policy.binding];
    const catalog = catalogs.get(policy.binding) ?? null;
    if (!db || !catalog) return { ...policy, tablePresent: false, ...empty, error: 'database-unavailable' };
    if (catalog.unreadable) return { ...policy, tablePresent: false, ...empty, error: 'query-failed' };
    const base = { ...policy, tablePresent: catalog.tables.has(policy.table) };
    if (!base.tablePresent) return { ...base, ...empty, error: null };
    const cutoff = new Date(now.getTime() - policy.reviewAfterDays * 86_400_000).toISOString();
    try {
      const row = await db.prepare(
        `SELECT COUNT(*) AS total_records,
                COALESCE(SUM(CASE WHEN datetime(${policy.dateColumn}) < datetime(?) THEN 1 ELSE 0 END), 0) AS aging_records,
                MIN(${policy.dateColumn}) AS oldest_record_at
           FROM ${policy.table}
          WHERE ${policy.personalDataPredicate}`,
      ).bind(cutoff).first<CountRow>();
      return { ...base, totalPersonalRecords: Number(row?.total_records ?? 0), recordsPastReviewHorizon: Number(row?.aging_records ?? 0), oldestRecordAt: row?.oldest_record_at ?? null, error: null };
    } catch {
      return { ...base, ...empty, error: 'query-failed' };
    }
  }));
}
