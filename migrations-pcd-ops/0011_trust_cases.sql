-- Durable public trust intake for corrections, removals, privacy, copyright,
-- accessibility, and other non-emergency requests. Applying this migration to
-- any remote D1 database requires separate review and explicit approval.
CREATE TABLE IF NOT EXISTS trust_cases (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN (
    'listing_correction', 'listing_removal', 'privacy', 'copyright',
    'accessibility', 'safety_concern', 'other'
  )),
  target_url TEXT,
  camp_slug TEXT,
  requester_email TEXT NOT NULL,
  requester_name TEXT,
  description TEXT NOT NULL,
  desired_resolution TEXT,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  due_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed')),
  submitted_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  acknowledged_at TEXT,
  acknowledged_by TEXT,
  resolved_at TEXT,
  resolved_by TEXT,
  resolution_code TEXT CHECK (resolution_code IS NULL OR resolution_code IN (
    'corrected', 'removed', 'fulfilled', 'no_action', 'duplicate',
    'out_of_scope', 'referred'
  )),
  resolution_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_trust_cases_status_submitted
  ON trust_cases(status, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_trust_cases_camp_slug
  ON trust_cases(camp_slug, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_trust_cases_status_due
  ON trust_cases(status, due_at ASC);

-- Append-only lifecycle history. Application code may insert but never update
-- or delete these records. Do not place request descriptions or email bodies
-- in event notes; the case row is the protected home for requester content.
CREATE TABLE IF NOT EXISTS trust_case_events (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES trust_cases(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'submitted', 'acknowledged', 'status_changed', 'resolved', 'closed',
    'suppression_proposed', 'suppression_activated', 'suppression_lifted'
  )),
  actor TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  resolution_code TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_trust_case_events_case_created
  ON trust_case_events(case_id, created_at ASC);

-- A removal decision is not enough to prevent a later importer from restoring
-- the same content. Suppression activation remains a separately approved
-- production action; agents may only create proposals.
CREATE TABLE IF NOT EXISTS content_suppressions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES trust_cases(id),
  camp_slug TEXT,
  target_url TEXT,
  reason_code TEXT NOT NULL CHECK (reason_code IN (
    'rights_request', 'operator_request', 'duplicate', 'unsafe_source',
    'legal_hold', 'other'
  )),
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'active', 'lifted')),
  proposed_by TEXT NOT NULL,
  proposed_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  lifted_by TEXT,
  lifted_at TEXT,
  CHECK (camp_slug IS NOT NULL OR target_url IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_content_suppressions_lookup
  ON content_suppressions(status, camp_slug, target_url);
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_suppressions_one_live_scope
  ON content_suppressions(COALESCE(camp_slug, ''), COALESCE(target_url, ''))
  WHERE status IN ('proposed', 'active');
