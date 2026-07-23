-- Migration: 0018_camp_info_requests
--
-- Supports the admin queue's "More info" action: instead of Approve
-- (publish immediately) or Reject (drop from queue), an admin can leave a
-- freeform note asking for something specific (e.g. "need actual camp name,
-- dates, etc.") and the camp is pulled out of the visible pending queue while
-- an unattended research task looks for it. On resolution the task either
-- fills in what it can find and clears these columns (camp reappears in the
-- pending queue for a normal approve/reject decision), or, if it can't find
-- what was asked for, rejects the camp outright (standing rule: one research
-- attempt only, no retry loop — a failed lookup drops the camp from the
-- queue just like a normal reject).
--
-- info_requested_at / info_requested_by / info_request_notes are set together
-- by POST /api/admin/camps/:id/request-info. info_request_resolved_at is set
-- by the research task once it's done with this camp, whichever way it goes.
-- A camp with info_requested_at set and info_request_resolved_at still NULL
-- is "out for research" and is excluded from listPendingCamps so it doesn't
-- show to the admin mid-flight.
--
-- Forward-only, additive columns only. Never destructive.
--
-- Apply to remote:
--   npx wrangler d1 execute activity-radar --file=./migrations/0018_camp_info_requests.sql --remote

ALTER TABLE programs ADD COLUMN info_requested_at TEXT;
ALTER TABLE programs ADD COLUMN info_requested_by TEXT;
ALTER TABLE programs ADD COLUMN info_request_notes TEXT;
ALTER TABLE programs ADD COLUMN info_request_resolved_at TEXT;
