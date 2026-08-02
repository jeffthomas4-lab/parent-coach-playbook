-- Idempotent provider receipt ledger for authenticated external editorial
-- integrations. Raw article bodies and credentials are deliberately excluded;
-- full content remains recoverable from the provider API and Git history.

-- IF NOT EXISTS is intentional. Migration 0028 is an unrelated, intentionally
-- held PII schema. This table can be applied as an exact standalone additive
-- change; a later normal ledger replay after 0028 is approved remains a no-op.
CREATE TABLE IF NOT EXISTS external_article_receipts (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK(provider = 'babylovegrowth'),
  provider_article_id TEXT NOT NULL CHECK(length(provider_article_id) BETWEEN 1 AND 80),
  source TEXT NOT NULL CHECK(source IN ('webhook', 'api_reconciliation')),
  payload_sha256 TEXT NOT NULL CHECK(length(payload_sha256) = 64),
  provider_created_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN (
    'received', 'held', 'processing', 'published', 'quarantined', 'retryable_failure'
  )),
  target_slug TEXT NOT NULL CHECK(length(target_slug) BETWEEN 1 AND 120),
  target_route TEXT,
  github_commit_sha TEXT,
  published_at TEXT,
  last_error_code TEXT CHECK(last_error_code IS NULL OR length(last_error_code) <= 80),
  updated_at TEXT NOT NULL,
  UNIQUE(provider, provider_article_id, payload_sha256)
);

CREATE INDEX IF NOT EXISTS idx_external_article_receipts_status
  ON external_article_receipts(status, received_at);

CREATE INDEX IF NOT EXISTS idx_external_article_receipts_provider_article
  ON external_article_receipts(provider, provider_article_id, received_at DESC);
