-- Migration: 0008_suggestions
-- Org suggestion submissions from the public.
CREATE TABLE org_suggestions (
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

CREATE INDEX idx_suggestions_status ON org_suggestions(status);
