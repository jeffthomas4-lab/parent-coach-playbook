-- Migration: 0010_enrichment_org_fields
-- Enrichment tracking columns for the scheduled enrichment worker.
-- website_url, phone, description, and social_urls already exist on organizations
-- from 0001_core_graph.sql. Only the two tracking columns are new here.

ALTER TABLE organizations ADD COLUMN last_enriched_at TEXT;
ALTER TABLE organizations ADD COLUMN enrichment_confidence REAL NOT NULL DEFAULT 0;
