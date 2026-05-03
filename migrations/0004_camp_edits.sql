-- Migration: 0004_camp_edits
-- Adds an audit trail for admin edits to camp records, and a route for updating
-- arbitrary fields after a camp is live (typo in name, wrong URL, etc).

ALTER TABLE camps ADD COLUMN last_edited_at TEXT;
ALTER TABLE camps ADD COLUMN last_edited_by TEXT;
