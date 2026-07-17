-- Payload-bound idempotency for public trust intake. This migration is additive
-- and intentionally unapplied. Remote application requires exact-target review,
-- backup/restore evidence, and separate production approval.
ALTER TABLE trust_cases ADD COLUMN intake_key TEXT;
ALTER TABLE trust_cases ADD COLUMN request_fingerprint TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_trust_cases_intake_key
  ON trust_cases(intake_key)
  WHERE intake_key IS NOT NULL;
