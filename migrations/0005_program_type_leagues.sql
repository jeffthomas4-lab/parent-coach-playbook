-- Migration: 0005_program_type_leagues
-- Adds league support to the camps table. Same table, type discriminator.
--
-- Existing rows default to program_type='camp' so the migration is non-breaking.
-- Leagues use the same name/sport/age/location/description/price/contact columns.
-- League-specific fields:
--   registration_deadline: nullable date (YYYY-MM-DD) for the signup cutoff
--   schedule_text:         nullable free-form schedule (e.g., "Practice Tue/Thu 6-7:30, games Saturdays")
-- Camp-specific fields (day_or_overnight, lunch_included, aftercare_available) stay
-- on the table but are ignored when program_type='league'.

ALTER TABLE camps ADD COLUMN program_type TEXT NOT NULL DEFAULT 'camp';
ALTER TABLE camps ADD COLUMN registration_deadline TEXT;
ALTER TABLE camps ADD COLUMN schedule_text TEXT;

CREATE INDEX idx_camps_program_type ON camps(program_type);
