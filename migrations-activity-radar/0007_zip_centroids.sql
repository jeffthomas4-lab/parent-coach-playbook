-- Migration: 0007_zip_centroids
-- A reusable ZIP -> lat/lng lookup table. Lets any org (the IRS stubs first, and
-- future imports) be geocoded by a single UPDATE join on zip, with no per-row
-- geocoding API calls. Seeded from a free ZIP centroid file (Census ZCTA
-- gazetteer) via scripts/build_zip_centroids.py.

CREATE TABLE zip_centroids (
  zip       TEXT PRIMARY KEY,   -- 5-digit ZIP / ZCTA
  latitude  REAL NOT NULL,
  longitude REAL NOT NULL,
  city      TEXT,
  state     TEXT
);
