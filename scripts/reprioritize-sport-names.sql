-- Boost enrichment_queue priority for orgs with a sport name in their title.
-- Priority 20 sits above the state-tier max (10), so these run before any
-- state-based org regardless of where they are.
-- Run after seed-enrichment-queue.sql has already populated the queue.
--
-- Run:
--   npx wrangler d1 execute activity-radar --remote --file scripts/reprioritize-sport-names.sql

UPDATE enrichment_queue
SET priority = 20
WHERE org_id IN (
  SELECT id FROM organizations
  WHERE latitude IS NOT NULL
    AND (
      LOWER(name) LIKE '%soccer%'
      OR LOWER(name) LIKE '%football%'
      OR LOWER(name) LIKE '%basketball%'
      OR LOWER(name) LIKE '%baseball%'
      OR LOWER(name) LIKE '%softball%'
      OR LOWER(name) LIKE '%volleyball%'
      OR LOWER(name) LIKE '%swimming%'
      OR LOWER(name) LIKE '%swim%'
      OR LOWER(name) LIKE '%tennis%'
      OR LOWER(name) LIKE '%lacrosse%'
      OR LOWER(name) LIKE '%hockey%'
      OR LOWER(name) LIKE '%wrestling%'
      OR LOWER(name) LIKE '%gymnastics%'
      OR LOWER(name) LIKE '%gymnastic%'
      OR LOWER(name) LIKE '%golf%'
      OR LOWER(name) LIKE '%rugby%'
      OR LOWER(name) LIKE '%cheer%'
      OR LOWER(name) LIKE '%track%'
      OR LOWER(name) LIKE '%cross country%'
      OR LOWER(name) LIKE '%karate%'
      OR LOWER(name) LIKE '%judo%'
      OR LOWER(name) LIKE '%martial art%'
      OR LOWER(name) LIKE '%dance%'
      OR LOWER(name) LIKE '%archery%'
      OR LOWER(name) LIKE '%bowling%'
      OR LOWER(name) LIKE '%skating%'
      OR LOWER(name) LIKE '%skate%'
      OR LOWER(name) LIKE '%lacrosse%'
      OR LOWER(name) LIKE '%rowing%'
      OR LOWER(name) LIKE '%crew%'
      OR LOWER(name) LIKE '%fencing%'
      OR LOWER(name) LIKE '%cycling%'
      OR LOWER(name) LIKE '%triathlon%'
      OR LOWER(name) LIKE '%aquatic%'
    )
);
