-- Additive-only columns backing the /admin/link-health/ per-row actions:
-- "Recheck now" (writes back through the existing status columns, see
-- worker-link-checker/schema.sql), "Mark resolved" (resolved_at/resolved_by),
-- and "Replace URL" (suggested_replacement).
--
-- The link_health table's url values are sourced from repo markdown content
-- files, not the other way around, so writing a replacement URL here cannot
-- change a published page by itself. suggested_replacement is a staged
-- suggestion the /admin/link-health/ dashboard renders next to source_files
-- so the fix is a copy-paste into those files, never an automatic content edit.
--
-- Forward-only, ALTER TABLE ADD COLUMN only. Never destructive.

ALTER TABLE link_health ADD COLUMN resolved_at TEXT;
ALTER TABLE link_health ADD COLUMN resolved_by TEXT;
ALTER TABLE link_health ADD COLUMN suggested_replacement TEXT;
