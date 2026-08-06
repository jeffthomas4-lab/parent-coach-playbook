-- Seed: competitor catalog for the competitor-intelligence subsystem
-- (migrations-activity-radar/0016_competitor_intelligence.sql).
--
-- This is seed data, not a schema migration. Apply it with
-- `wrangler d1 execute --file`, never with `migrations apply`, matching the
-- convention this folder already uses for camp-data seeds (see the top-level
-- README's "Migrating the camps data" section).
--
-- Uses INSERT OR IGNORE, so it is safe to re-run and will never clobber a row
-- an admin has already touched (a status changed by hand, a migration_
-- difficulty corrected after real research, etc.).
--
-- SportsGravy is the only platform here with real fingerprint patterns today
-- (src/lib/intel/competitors/sportsgravy.ts), so it seeds as 'active'. The
-- rest seed as 'watch': real platforms Jeff tracks, no detection patterns
-- written yet, kept in the catalog so the admin UI's competitor filter is
-- useful from day one instead of showing one row.
--
-- syncCompetitorCatalog() in src/lib/intel/store.ts also upserts every
-- competitor that has a definition file under src/lib/intel/competitors/ on
-- every sweep run. That sync is what keeps a defined competitor's
-- display_name/canonical_domain/category/migration_difficulty correct going
-- forward; this seed exists for catalog completeness (so watch-status
-- platforms with no definition file yet still show up), not as the source
-- of truth for any row syncCompetitorCatalog also writes.
--
-- Where a value below was not confirmed against the vendor's live site this
-- session, it is left NULL rather than guessed.

INSERT OR IGNORE INTO competitors (id, display_name, canonical_domain, category, status, migration_difficulty, notes, created_at, updated_at)
VALUES
  ('sportsgravy', 'SportsGravy', 'sportsgravy.com', 'club_management', 'active', 'medium', NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('teamsnap', 'TeamSnap', 'teamsnap.com', 'club_management', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('sportsengine', 'SportsEngine', 'sportsengine.com', 'club_management', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('leagueapps', 'LeagueApps', 'leagueapps.com', 'registration', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('teamlinkt', 'TeamLinkt', 'teamlinkt.com', 'club_management', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('crossbar', 'Crossbar', 'crossbarapp.com', 'communications', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('stackteamapp', 'Stack Team App', 'teamapp.com', 'club_management', 'watch', NULL, 'stackteamapp.com redirects to teamapp.com as of 2026-08-06 (rebrand to Team App, Team Mates Pty Ltd). canonical_domain reflects the live redirect target, not the id.', '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('sportsplus', 'SportsPlus', 'sportsplus.app', 'club_management', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('jerseywatch', 'Jersey Watch', 'jerseywatch.com', 'website', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('playmetrics', 'PlayMetrics', 'playmetrics.com', 'club_management', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('byga', 'Byga', 'byga.net', 'club_management', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z'),
  ('gamechanger', 'GameChanger', 'gc.com', 'streaming', 'watch', NULL, NULL, '2026-08-06T00:00:00.000Z', '2026-08-06T00:00:00.000Z');
