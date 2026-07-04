-- Migration: 0009_org_suggestions
-- Lighter-weight "suggest an organization" intake, distinct from /camps/submit
-- (which requires full program detail: exact dates, address, description).
-- This is for someone who knows an org runs camps/leagues but doesn't have
-- the specifics — a lead for admin to research and turn into a full listing.
--
-- Same table shape as ActivityRadar's migration 0008_suggestions.sql (this
-- project shares the `activity-radar` D1 with ActivityRadar; IF NOT EXISTS
-- makes this a no-op if that migration already ran against this database).
CREATE TABLE IF NOT EXISTS org_suggestions (
  id              TEXT PRIMARY KEY,
  org_name        TEXT NOT NULL,
  org_website     TEXT,
  org_city        TEXT,
  org_state       TEXT,
  activity_type   TEXT,
  submitter_email TEXT,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'reviewed' | 'imported'
  submitted_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_suggestions_status ON org_suggestions(status);
