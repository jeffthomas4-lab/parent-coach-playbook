-- Migration: 0011_yelp_fields
-- Yelp Fusion enrichment columns. yelp_id drives the daily worker's skip logic:
--   NULL    = not yet searched
--   'none'  = searched, no confident match found
--   <id>    = matched Yelp business id
-- yelp_rating and yelp_review_count are denormalized from trust_signals for
-- easy sorting and display without an extra join.
-- price_tier stores Yelp's "$" / "$$" / "$$$" / "$$$$" for future filter use.

ALTER TABLE organizations ADD COLUMN yelp_id TEXT;
ALTER TABLE organizations ADD COLUMN yelp_rating REAL;
ALTER TABLE organizations ADD COLUMN yelp_review_count INTEGER;
ALTER TABLE organizations ADD COLUMN price_tier TEXT;

CREATE INDEX idx_org_yelp ON organizations(yelp_id);
