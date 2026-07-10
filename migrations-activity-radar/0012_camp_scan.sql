-- Migration: 0012_camp_scan
-- Secondary enrichment pass: detect camp programs on org websites.
-- camp_scan_queue is fed automatically when the enrichment worker finds a website_url.
-- camp_detected and camp_url on organizations store the findings.

ALTER TABLE organizations ADD COLUMN camp_detected INTEGER NOT NULL DEFAULT 0;
ALTER TABLE organizations ADD COLUMN camp_url TEXT;

CREATE TABLE camp_scan_queue (
  id          TEXT PRIMARY KEY,
  org_id      TEXT NOT NULL UNIQUE,
  website_url TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending',
  attempts    INTEGER NOT NULL DEFAULT 0,
  camp_detected INTEGER,  -- NULL = not yet scanned, 0 = no camps found, 1 = camps found
  camp_url    TEXT,
  scanned_at  TEXT,
  created_at  TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE INDEX idx_csq_status ON camp_scan_queue(status);
