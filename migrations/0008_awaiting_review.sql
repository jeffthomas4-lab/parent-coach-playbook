-- Migration: 0008_awaiting_review
--
-- Adds an `awaiting_review` flag to camps. The flag lets bulk imports go LIVE
-- on the public site immediately (status='approved') while still surfacing in
-- the admin queue until an admin clicks approve. This way the camps are
-- discoverable by parents the moment they land, but Jeff still gets a
-- camp-by-camp review pass to catch anything off.
--
-- The public listing query is unchanged: it filters status='approved'. The
-- admin queue query now includes both status='pending' rows AND any row with
-- awaiting_review=1 regardless of status. Approving an admin queue row clears
-- the flag.
--
-- Apply with:
--   npx wrangler d1 execute parent-coach-playbook --file=./migrations/0008_awaiting_review.sql --remote

-- ALTER TABLE camps ADD COLUMN awaiting_review INTEGER NOT NULL DEFAULT 0
  CHECK (awaiting_review IN (0, 1));

CREATE INDEX IF NOT EXISTS idx_camps_awaiting_review ON camps(awaiting_review);
