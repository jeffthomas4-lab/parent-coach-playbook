export interface RetentionAuditPolicy {
  domain: string;
  table: string;
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
  error: 'query-failed' | null;
}

// Review horizons are not deletion authorization. Any deletion workflow needs
// an approved policy, hold logic, bounded dry run, recovery proof, and explicit
// production-data approval.
export const RETENTION_AUDIT_POLICIES: readonly RetentionAuditPolicy[] = [
  { domain: 'Sanitized search demand', table: 'search_events', dateColumn: 'created_at', personalDataPredicate: '1 = 1', reviewAfterDays: 90, disposition: 'proposal-only' },
  { domain: 'Directory suggestions', table: 'org_suggestions', dateColumn: 'submitted_at', personalDataPredicate: 'submitter_email IS NOT NULL', reviewAfterDays: 180, disposition: 'counsel-required' },
  { domain: 'Camp claims', table: 'camp_claims', dateColumn: 'submitted_at', personalDataPredicate: 'claimant_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Camp reviews', table: 'camp_reviews', dateColumn: 'submitted_at', personalDataPredicate: 'reviewer_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Trust and rights cases', table: 'trust_cases', dateColumn: 'submitted_at', personalDataPredicate: 'requester_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Public program submissions', table: 'programs', dateColumn: 'submitted_at', personalDataPredicate: 'submitted_by_email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
  { domain: 'Submitter registry', table: 'submitters', dateColumn: 'last_submitted_at', personalDataPredicate: 'email IS NOT NULL', reviewAfterDays: 365, disposition: 'counsel-required' },
] as const;

interface CountRow { total_records: number; aging_records: number; oldest_record_at: string | null }

export async function runRetentionAudit(db: D1Database, now = new Date()): Promise<RetentionAuditResult[]> {
  const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all<{ name: string }>();
  const present = new Set((tables.results ?? []).map((row) => row.name));

  return await Promise.all(RETENTION_AUDIT_POLICIES.map(async (policy): Promise<RetentionAuditResult> => {
    const base = { ...policy, tablePresent: present.has(policy.table) };
    if (!base.tablePresent) return { ...base, totalPersonalRecords: null, recordsPastReviewHorizon: null, oldestRecordAt: null, error: null };
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
      return { ...base, totalPersonalRecords: null, recordsPastReviewHorizon: null, oldestRecordAt: null, error: 'query-failed' };
    }
  }));
}
