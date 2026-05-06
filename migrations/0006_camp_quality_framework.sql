-- 0006_camp_quality_framework.sql
--
-- Adds the quality + dedup + source-tracking layer to the camps repository.
-- Goal: every camp coming in carries a confidence score, a source domain,
-- and a URL health status. Rejected camps carry a structured reason code
-- so we can learn what's failing. A new domain_quality table aggregates
-- per-source submission outcomes over time.
--
-- Apply with:
--   npx wrangler d1 execute parent-coach-playbook --file=./migrations/0006_camp_quality_framework.sql --remote
--
-- Idempotent against re-runs: ALTER TABLE ADD COLUMN errors if column exists,
-- so check Cloudflare D1 first (or use a fresh DB).

-- 1. Confidence scoring on every camp.
--    high   = all required fields directly verified from the camp's own page
--    medium = one or more fields inferred (date parsed from free text, price
--             missing but contact listed, etc.)
--    low    = pulled from an aggregator, several fields inferred, or the
--             submitter explicitly flagged uncertainty
ALTER TABLE camps ADD COLUMN confidence TEXT NOT NULL DEFAULT 'medium'
  CHECK (confidence IN ('high', 'medium', 'low'));

-- 2. The domain the camp was scraped from (or 'manual' for direct submissions).
--    Used by the source-quality dashboard and to attribute approvals/rejections.
ALTER TABLE camps ADD COLUMN source_domain TEXT;

-- 3. Structured rejection reason. Filled in when an admin rejects a camp.
--    Lets us track top failure modes per quarter without parsing free-text notes.
ALTER TABLE camps ADD COLUMN reject_reason_code TEXT
  CHECK (reject_reason_code IS NULL OR reject_reason_code IN (
    'duplicate',
    'dead-url',
    'unverifiable-address',
    'missing-required-field',
    'off-brand',
    'past-date',
    'aggregator-source',
    'low-confidence',
    'spam',
    'other'
  ));

-- 4. URL health for the registration / website link.
--    Set on submission (initial check) and refreshed by a periodic sweep.
ALTER TABLE camps ADD COLUMN url_health_status TEXT NOT NULL DEFAULT 'unchecked'
  CHECK (url_health_status IN ('unchecked', 'live', 'dead', 'timeout', 'redirect'));
ALTER TABLE camps ADD COLUMN url_last_checked_at TEXT;
ALTER TABLE camps ADD COLUMN url_last_status_code INTEGER;

-- 5. Per-source aggregated quality. Updated on every submit/approve/reject.
--    The source-quality dashboard reads from this table.
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
