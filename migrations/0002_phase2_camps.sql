-- Migration: 0002_phase2_camps
-- Phase 2 additions: verified flag, photo key, geocoding cache, reviews.

-- A "verified" flag for camps we have personally vetted.
ALTER TABLE camps ADD COLUMN verified INTEGER NOT NULL DEFAULT 0;

-- Optional R2 object key for the camp's hero photo.
ALTER TABLE camps ADD COLUMN hero_photo_key TEXT;

-- Geocoding cache. Hash of the canonicalized address → lat/lon.
-- Avoids hitting Nominatim more than once per identical address.
CREATE TABLE geocoded_addresses (
  address_hash TEXT PRIMARY KEY,
  address_canonical TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  cached_at TEXT NOT NULL
);

-- Camp reviews. Light moderation: pending → approved | rejected.
CREATE TABLE camp_reviews (
  id TEXT PRIMARY KEY,
  camp_id TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  reviewer_display_name TEXT,
  rating INTEGER NOT NULL, -- 1-5
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  submitted_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,
  FOREIGN KEY (camp_id) REFERENCES camps(id)
);

CREATE INDEX idx_reviews_camp ON camp_reviews(camp_id);
CREATE INDEX idx_reviews_status ON camp_reviews(status);
CREATE INDEX idx_camps_verified ON camps(verified);
