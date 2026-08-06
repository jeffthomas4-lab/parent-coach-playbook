// Row types and shared unions for the competitor intelligence schema
// (migrations-activity-radar/0016_competitor_intelligence.sql). No logic here, no imports
// from the rest of the repo — this file is the type contract that both the
// D1 read/write layer and the crawler/scorer code build against.

export type SignalType =
  | 'script_src'
  | 'link_href'
  | 'html_text'
  | 'meta'
  | 'url_pattern'
  | 'header'
  | 'dns_cname'
  | 'manual';

export type StackCategory =
  | 'club_management'
  | 'registration'
  | 'website'
  | 'payments'
  | 'streaming'
  | 'communications';

export type StackStatus = 'detected' | 'confirmed' | 'rejected' | 'lapsed';

export type RunType = 'org_sweep' | 'competitor_property' | 'manual';

export type RunStatus = 'proposed' | 'approved' | 'running' | 'complete' | 'failed' | 'cancelled';

export type ReviewReason = 'low_confidence' | 'conflicting_signals' | 'org_unmatched' | 'negative_pattern_conflict';

export type ReviewStatus = 'pending' | 'accepted' | 'rejected';

export type ChangeType = 'first_detected' | 'switched' | 'lapsed' | 'confidence_changed' | 'confirmed' | 'rejected';

export type MigrationDifficulty = 'low' | 'medium' | 'high';

/** Max length of a stored evidence snippet. Enforced in app code, not SQL. */
export const MAX_MATCHED_VALUE_LENGTH = 500;

export const STACK_CATEGORIES: readonly StackCategory[] = [
  'club_management',
  'registration',
  'website',
  'payments',
  'streaming',
  'communications',
];

export const SIGNAL_TYPES: readonly SignalType[] = [
  'script_src',
  'link_href',
  'html_text',
  'meta',
  'url_pattern',
  'header',
  'dns_cname',
  'manual',
];

export interface CompetitorRow {
  id: string;
  display_name: string;
  canonical_domain: string | null;
  category: string;
  status: string;
  migration_difficulty: MigrationDifficulty | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrgTechSignalRow {
  id: number;
  run_id: string;
  org_id: string | null;
  domain: string;
  competitor_id: string;
  signal_type: SignalType;
  pattern_id: string;
  matched_value: string | null;
  weight: number;
  source_url: string;
  observed_at: string;
}

export interface OrgTechStackRow {
  id: string;
  org_id: string;
  category: StackCategory;
  competitor_id: string | null;
  confidence: number;
  status: StackStatus;
  first_detected_at: string;
  last_confirmed_at: string;
  evidence_count: number;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
}

export interface OrgTechHistoryRow {
  id: number;
  org_id: string;
  category: string;
  from_competitor_id: string | null;
  to_competitor_id: string | null;
  change_type: ChangeType;
  from_confidence: number | null;
  to_confidence: number | null;
  run_id: string | null;
  detected_at: string;
}

export interface IntelRunRow {
  id: string;
  run_type: RunType;
  status: RunStatus;
  requested_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  started_at: string | null;
  finished_at: string | null;
  targets_planned: number;
  targets_fetched: number;
  targets_skipped: number;
  signals_found: number;
  error_code: string | null;
  notes: string | null;
  created_at: string;
}

export interface IntelReviewQueueRow {
  id: string;
  org_id: string | null;
  domain: string;
  competitor_id: string;
  category: string;
  confidence: number;
  reason: ReviewReason;
  evidence_json: string | null;
  status: ReviewStatus;
  run_id: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
}

export interface OrgOpportunityScoreRow {
  org_id: string;
  migration_difficulty: number | null;
  org_size_score: number | null;
  tech_maturity: number | null;
  switch_likelihood: number | null;
  revenue_estimate_usd: number | null;
  priority: number;
  rationale: string | null;
  scoring_version: number;
  scored_at: string;
}

export interface IntelFetchLogRow {
  domain: string;
  path: string;
  last_fetched_at: string;
  status_code: number | null;
  etag: string | null;
  last_modified: string | null;
  content_hash: string | null;
  robots_allowed: 0 | 1;
  robots_checked_at: string | null;
}
