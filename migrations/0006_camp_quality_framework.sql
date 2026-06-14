-- 0006_camp_quality_framework.sql
--
-- Adds the quality + dedup + source-tracking layer to the camps repository.
-- All ALTER TABLE lines are commented out because these columns already exist
-- in the production D1 database (added outside the migration framework).

-- ALTER TABLE camps ADD COLUMN confidence TEXT NOT NULL DEFAULT 'medium'
--   CHECK (confidence IN ('high', 'medium', 'low'));
-- ALTER TABLE camps ADD COLUMN source_domain TEXT;
-- ALTER TABLE camps ADD COLUMN reject_reason_code TEXT
--   CHECK (reject_reason_code IS NULL OR reject_reason_code IN (
--     'duplicate', 'dead-url', 'unverifiable-address', 'missing-required-field',
--     'off-brand', 'past-date', 'aggregator-source', 'low-confidence', 'spam', 'other'
--   ));
-- ALTER TABLE camps ADD COLUMN url_health_status TEXT NOT NULL DEFAULT 'unchecked'
--   CHECK (url_health_status IN ('unchecked', 'live', 'dead', 'timeout', 'redirect'));
-- ALTER TABLE camps ADD COLUMN url_last_checked_at TEXT;
-- ALTER TABLE camps ADD COLUMN url_last_status_code INTEGER;

CREATE TABLE IF NOT EXISTS domain_quality (
  domain TEXT PRIMARY KEY,
  submitted_count INTEGER NOT NULL DEFAULT 0,
  approved_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  high_confidence_count INTEGER NOT NULL DEFAULT 0,
  low_confidence_count INTEGER NOT NULL DEFAULT 0,
  last_seen_at TEXT NOT NULL,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_camps_source_domain ON camps(source_domain);
CREATE INDEX IF NOT EXISTS idx_camps_confidence ON camps(confidence);
CREATE INDEX IF NOT EXISTS idx_camps_url_health ON camps(url_health_status);
CREATE INDEX IF NOT EXISTS idx_camps_reject_reason ON camps(reject_reason_code);
CREATE INDEX IF NOT EXISTS idx_camps_status_endate ON camps(status, end_date);
