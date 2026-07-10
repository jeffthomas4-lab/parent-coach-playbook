-- Geocode organizations by ZIP centroid. Reusable: run any time after loading
-- new org stubs. Fills lat/lng only where missing, only where the ZIP is known.
-- One set-based UPDATE, no per-row API calls. Requires zip_centroids (migration 0007).

UPDATE organizations
SET latitude  = (SELECT z.latitude  FROM zip_centroids z WHERE z.zip = organizations.zip),
    longitude = (SELECT z.longitude FROM zip_centroids z WHERE z.zip = organizations.zip)
WHERE latitude IS NULL
  AND zip IS NOT NULL
  AND zip IN (SELECT zip FROM zip_centroids);
