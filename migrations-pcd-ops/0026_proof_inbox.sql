-- Public "share your experience" intake for the /proof page, per 15-07
-- Social Proof Page Standard, "Collecting the proof: the inbox," method 2
-- (on-site form). Rows here are raw, unmoderated submissions -- the published
-- page (src/data/proof.json) never reads this table directly. A person runs
-- `node scripts/proof.mjs pull` to sync new rows into src/data/proof-inbox.json
-- as status "new", then reviews them the same as any other candidate:
-- `list`, `approve`/`reject`, `promote`.
--
-- Same shape as trust_cases (migration 0011): an app-generated TEXT id, a
-- caller-supplied intake_key for idempotent retries, and a request_fingerprint
-- so a replayed submission with the same key but different content is
-- rejected as a conflict rather than silently overwritten.
--
-- This migration is additive and intentionally unapplied, same as 0023-0025
-- in this directory. Do not apply it remotely and do not point production
-- code at it as a hard dependency until reviewed and approved per this
-- directory's README. The matching route (src/pages/api/proof-submit.ts) is
-- gated behind PROOF_SUBMIT_ENABLED and fails closed (503) with no binding
-- or before this table exists.
CREATE TABLE IF NOT EXISTS proof_inbox (
  id TEXT PRIMARY KEY,
  quote TEXT NOT NULL CHECK (length(quote) BETWEEN 1 AND 2000),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  context TEXT CHECK (context IS NULL OR length(context) <= 200),
  source TEXT NOT NULL DEFAULT 'form' CHECK (source IN (
    'google', 'yelp', 'facebook', 'instagram', 'x',
    'email', 'sms', 'form', 'screenshot', 'other'
  )),
  source_url TEXT CHECK (source_url IS NULL OR length(source_url) <= 2048),
  -- Product/feature slug, meant to match a src/data/proof.json group id.
  -- Not constrained by CHECK: the group list can grow without a migration,
  -- and scripts/proof.mjs promote already warns and falls back to
  -- "site-wide" for anything that does not match a real group.
  product TEXT CHECK (product IS NULL OR length(product) <= 60),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  -- Idempotent-retry support, same pattern as trust_cases.intake_key /
  -- request_fingerprint. NULL intake_key is allowed and does not collide
  -- under the unique index below (SQLite treats each NULL as distinct).
  intake_key TEXT,
  request_fingerprint TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_proof_inbox_intake_key
  ON proof_inbox(intake_key) WHERE intake_key IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_proof_inbox_status_created
  ON proof_inbox(status, created_at DESC);
