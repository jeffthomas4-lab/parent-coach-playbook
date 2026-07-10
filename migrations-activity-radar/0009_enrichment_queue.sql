-- Migration: 0009_enrichment_queue
-- Demand-triggered enrichment queue. One slot per org (UNIQUE on org_id).
-- Priority climbs with every search hit so high-demand orgs get enriched first.
-- status: pending -> processing -> done | failed
-- After 3 failed attempts the row is marked failed and left for manual review.

CREATE TABLE enrichment_queue (
  id                TEXT PRIMARY KEY,
  org_id            TEXT NOT NULL UNIQUE,
  priority          INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'pending',
  attempts          INTEGER NOT NULL DEFAULT 0,
  last_attempted_at TEXT,
  enriched_at       TEXT,
  created_at        TEXT NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE INDEX idx_enq_status_priority ON enrichment_queue(status, priority DESC);
