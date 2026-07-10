-- Seed enrichment queue with geocoded unverified orgs, tiered by state youth population.
-- Priority drives processing order: higher = enriched first.
-- Run: npx wrangler d1 execute activity-radar --remote --file scripts/seed-enrichment-queue.sql
--
-- Tier 1 (10): CA TX FL NY           — largest youth populations nationally
-- Tier 2  (8): IL PA OH GA NC MI     — major secondary markets
-- Tier 3  (6): NJ VA WA AZ MA TN    — strong regional density
-- Tier 4  (4): IN MO MD CO WI MN SC  — solid mid-tier states
-- Tier 5  (2): everything else
--
-- Only orgs with lat/lng are seeded — without coordinates they won't appear
-- in radius search even after promotion.

INSERT OR IGNORE INTO enrichment_queue (id, org_id, priority, status, attempts, created_at)
SELECT
  hex(randomblob(16)),
  id,
  CASE state
    WHEN 'CA' THEN 10 WHEN 'TX' THEN 10 WHEN 'FL' THEN 10 WHEN 'NY' THEN 10
    WHEN 'IL' THEN 8  WHEN 'PA' THEN 8  WHEN 'OH' THEN 8  WHEN 'GA' THEN 8
    WHEN 'NC' THEN 8  WHEN 'MI' THEN 8
    WHEN 'NJ' THEN 6  WHEN 'VA' THEN 6  WHEN 'WA' THEN 6  WHEN 'AZ' THEN 6
    WHEN 'MA' THEN 6  WHEN 'TN' THEN 6
    WHEN 'IN' THEN 4  WHEN 'MO' THEN 4  WHEN 'MD' THEN 4  WHEN 'CO' THEN 4
    WHEN 'WI' THEN 4  WHEN 'MN' THEN 4  WHEN 'SC' THEN 4
    ELSE 2
  END,
  'pending',
  0,
  datetime('now')
FROM organizations
WHERE record_status = 'unverified'
  AND latitude IS NOT NULL;
