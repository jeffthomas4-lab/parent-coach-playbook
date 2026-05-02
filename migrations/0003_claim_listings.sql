-- Migration: 0003_claim_listings
-- Adds the "claim my listing" feature. Camps can be claimed by their owner
-- for a small annual fee, unlocking self-edit access, a logo, and a gallery.

ALTER TABLE camps ADD COLUMN is_claimed INTEGER NOT NULL DEFAULT 0;
ALTER TABLE camps ADD COLUMN claimed_by_email TEXT;
ALTER TABLE camps ADD COLUMN claim_paid_until TEXT;     -- ISO date when the paid window ends
ALTER TABLE camps ADD COLUMN logo_key TEXT;             -- R2 key for camp logo
ALTER TABLE camps ADD COLUMN gallery_keys TEXT;         -- JSON array of R2 keys for gallery photos
ALTER TABLE camps ADD COLUMN registration_url TEXT;     -- direct registration link (claimed only)

-- Pending claim requests. Submitter requests claim, admin verifies, payment is collected
-- out-of-band (Stripe payment link or invoice), then admin marks claim as paid + active.
CREATE TABLE camp_claims (
  id TEXT PRIMARY KEY,
  camp_id TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  claimant_name TEXT,
  organization TEXT,
  phone TEXT,
  notes TEXT,                                            -- free-form (proof of ownership, role at the camp)
  status TEXT NOT NULL DEFAULT 'pending',                -- 'pending' | 'verified' | 'paid' | 'rejected'
  payment_amount_cents INTEGER,
  payment_method TEXT,                                   -- 'stripe' | 'invoice' | 'manual'
  submitted_at TEXT NOT NULL,
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,
  FOREIGN KEY (camp_id) REFERENCES camps(id)
);

CREATE INDEX idx_claims_camp ON camp_claims(camp_id);
CREATE INDEX idx_claims_status ON camp_claims(status);
CREATE INDEX idx_camps_claimed ON camps(is_claimed);
