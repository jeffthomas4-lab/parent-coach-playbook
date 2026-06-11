-- Migration 0009: featured listings infrastructure
--
-- featured: 0/1 boolean. Camp appears in the featured section when 1
--           AND featured_until >= today (or featured_until IS NULL).
-- featured_order: Lower number = higher position. NULL sorts last.
-- featured_until: YYYY-MM-DD expiry date. NULL = no expiry (permanent
--                 until manually toggled off).

ALTER TABLE camps ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE camps ADD COLUMN featured_order INTEGER;
ALTER TABLE camps ADD COLUMN featured_until TEXT;
