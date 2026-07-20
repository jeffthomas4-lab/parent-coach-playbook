-- Migration: 0014_programs_staging
-- Holding table for the evergreen extraction pipeline (and any future
-- automated program-discovery pipeline). Added 2026-07-20.
--
-- Why: the evergreen extraction task was writing accepted programs straight
-- into the live `programs` table as pcd_status='pending'. Those rows sit in
-- Jeff's admin moderation queue (/admin/camps/queue) exactly like a parent's
-- own camp submission, unfiltered. Two problems came from that on 2026-07-20:
--   1. Jeff never wanted to eyeball raw, un-vetted scrape output one row at a
--      time — he asked for a holding place he doesn't have to look at, with
--      Claude doing a verification pass before anything reaches his queue.
--   2. The unattended queue growth (55 evergreen rows, all still pending,
--      nobody moderating them at machine speed) was the direct cause of the
--      admin queue page's Cloudflare 1102 "Worker exceeded resource limits"
--      crash that same day — see camps-db.ts findFuzzyCampMatchesBulk.
--
-- New flow: extraction writes here (programs_staging), never to `programs`.
-- A separate verify-and-promote pass (evergreen_verify.py) applies the
-- CAMPS_APPROVAL_THRESHOLD.md bar plus the extraction's own per-program
-- confidence/needs_review, and only rows that clear it get INSERT OR IGNORE
-- promoted into the live `programs` table as pcd_status='pending' — so they
-- still land in Jeff's existing queue and still need his human approval
-- click. The standing instruction (CAMPS_APPROVAL_THRESHOLD.md, "Standing
-- instruction" section) is that publication always requires that Access-
-- gated human approval; this table adds an earlier, invisible-to-Jeff filter
-- in front of it, it does not remove the gate.
--
-- Rows that fail verification just stay here with verification_status=
-- 'rejected' — they never touch `programs` and never show up anywhere Jeff
-- looks. Idempotent: slug is unique, so re-running an extraction pass on an
-- already-staged program is a no-op (INSERT OR IGNORE), matching the
-- existing pattern for the live `programs` table.

CREATE TABLE programs_staging (
  id                    TEXT PRIMARY KEY,
  organization_id       TEXT NOT NULL,
  slug                  TEXT NOT NULL,
  name                  TEXT NOT NULL,
  program_type          TEXT NOT NULL DEFAULT 'camp',
  activity_category     TEXT NOT NULL DEFAULT 'other',
  categories            TEXT,
  description           TEXT,
  age_min               INTEGER,
  age_max               INTEGER,
  season                TEXT,
  day_or_overnight      TEXT,
  registration_url      TEXT,
  record_source         TEXT NOT NULL DEFAULT 'evergreen_extract',
  source_domain         TEXT,

  -- What the extraction pass itself reported, carried through untouched.
  extract_confidence    INTEGER NOT NULL DEFAULT 0,   -- the program-level `confidence` field from EVERGREEN-PROMPT.md
  extract_needs_review  INTEGER NOT NULL DEFAULT 0,   -- the org-level `needs_review` flag from the same extraction row
  extract_notes         TEXT,                          -- the org-level `notes` field, kept for whoever reviews this row

  -- What the (separate) verification pass decides.
  verification_status   TEXT NOT NULL DEFAULT 'unverified',  -- unverified | verified | rejected
  verification_notes    TEXT,
  verified_at            TEXT,
  promoted_program_id    TEXT,   -- id of the row this became in the live `programs` table, once promoted
  promoted_at            TEXT,

  extracted_at           TEXT NOT NULL,   -- when the extraction agent produced this row
  created_at             TEXT NOT NULL,
  updated_at             TEXT NOT NULL,

  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE UNIQUE INDEX idx_programs_staging_slug ON programs_staging(slug);
CREATE INDEX idx_programs_staging_verification_status ON programs_staging(verification_status);
CREATE INDEX idx_programs_staging_org ON programs_staging(organization_id);
