-- First-party log of affiliate-redirect clicks (/go/[slug]) for attribution
-- and reporting. No PII: no IP address, no full user agent, and no full
-- referrer URL or query string -- only the referring host and the coarse
-- CF-IPCountry geo signal are captured.
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  campaign TEXT,
  retailer TEXT,
  clicked_at TEXT NOT NULL,
  referrer_host TEXT,
  country TEXT
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_slug ON affiliate_clicks(slug);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
