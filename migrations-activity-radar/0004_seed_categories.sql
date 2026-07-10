-- Migration: 0004_seed_categories
-- Seeds the controlled activity-category vocabulary from OS chapter 07-05.
-- Free-text activity types create a long-tail problem ("soccer", "youth soccer",
-- "U10 soccer" are one category). The migration script maps scraped sport strings
-- onto these canonical slugs.
--
-- Parent categories give the hierarchy used by category landing pages.

-- Parent categories
INSERT INTO activity_categories (id, slug, name, parent_category_id, description) VALUES
  ('cat-sports',   'sports',   'Sports',            NULL, 'Team and individual athletics'),
  ('cat-arts',     'arts',     'Arts',              NULL, 'Visual, performing, and creative arts'),
  ('cat-stem',     'stem',     'STEM',              NULL, 'Science, technology, engineering, math'),
  ('cat-camp',     'camp',     'Camps',             NULL, 'Multi-activity day and overnight camps'),
  ('cat-other',    'other',    'Other',             NULL, 'Uncategorized activities');

-- Leaf categories (controlled vocabulary)
INSERT INTO activity_categories (id, slug, name, parent_category_id, description) VALUES
  ('cat-soccer',          'soccer',           'Soccer',             'cat-sports', NULL),
  ('cat-basketball',      'basketball',       'Basketball',         'cat-sports', NULL),
  ('cat-swimming',        'swimming',         'Swimming',           'cat-sports', NULL),
  ('cat-gymnastics',      'gymnastics',       'Gymnastics',         'cat-sports', NULL),
  ('cat-martial-arts',    'martial_arts',     'Martial Arts',       'cat-sports', NULL),
  ('cat-baseball',        'baseball_softball','Baseball / Softball','cat-sports', NULL),
  ('cat-volleyball',      'volleyball',       'Volleyball',         'cat-sports', NULL),
  ('cat-football',        'football',         'Football',           'cat-sports', NULL),
  ('cat-tennis',          'tennis',           'Tennis',             'cat-sports', NULL),
  ('cat-track-field',     'track_field',      'Track & Field',      'cat-sports', NULL),
  ('cat-dance',           'dance',            'Dance',              'cat-arts',   NULL),
  ('cat-arts-crafts',     'arts_crafts',      'Arts & Crafts',      'cat-arts',   NULL),
  ('cat-music',           'music',            'Music',              'cat-arts',   NULL),
  ('cat-theater',         'theater',          'Theater',            'cat-arts',   NULL),
  ('cat-coding-stem',     'coding_stem',      'Coding & STEM',      'cat-stem',   NULL),
  ('cat-camp-general',    'camp_general',     'General Camp',       'cat-camp',   NULL),
  ('cat-camp-sports',     'camp_sports',      'Sports Camp',        'cat-camp',   NULL),
  ('cat-camp-stem',       'camp_stem',        'STEM Camp',          'cat-camp',   NULL),
  ('cat-camp-arts',       'camp_arts',        'Arts Camp',          'cat-camp',   NULL);
