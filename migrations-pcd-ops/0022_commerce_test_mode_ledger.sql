-- Provider-neutral test-mode commerce ledger. No card data, checkout URL,
-- payment secret, or live processor configuration is stored here.
CREATE TABLE commerce_products (
  id TEXT PRIMARY KEY,
  product_code TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','active','retired')),
  fulfillment_kind TEXT NOT NULL CHECK(fulfillment_kind IN ('enhanced_profile','featured_placement','sponsorship','package')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE commerce_prices (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES commerce_products(id),
  currency TEXT NOT NULL CHECK(length(currency) = 3),
  amount_minor INTEGER NOT NULL CHECK(amount_minor >= 0),
  status TEXT NOT NULL CHECK(status IN ('draft','active','retired')),
  provider_price_reference TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(product_id, currency, amount_minor, status)
);

CREATE TABLE commerce_checkout_attempts (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES customer_organizations(id),
  customer_user_id TEXT REFERENCES customer_users(id),
  price_id TEXT NOT NULL REFERENCES commerce_prices(id),
  provider_code TEXT NOT NULL,
  provider_checkout_reference TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL CHECK(state IN ('created','open','completed','expired','cancelled')),
  idempotency_key TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  completed_at TEXT,
  CHECK(state <> 'completed' OR completed_at IS NOT NULL)
);

CREATE INDEX idx_commerce_checkout_attempts_org ON commerce_checkout_attempts(organization_id, state, created_at);

CREATE TABLE commerce_orders (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES customer_organizations(id),
  customer_user_id TEXT REFERENCES customer_users(id),
  checkout_attempt_id TEXT UNIQUE REFERENCES commerce_checkout_attempts(id),
  price_id TEXT NOT NULL REFERENCES commerce_prices(id),
  provider_code TEXT NOT NULL,
  provider_order_reference TEXT NOT NULL UNIQUE,
  amount_minor INTEGER NOT NULL CHECK(amount_minor >= 0),
  currency TEXT NOT NULL CHECK(length(currency) = 3),
  state TEXT NOT NULL CHECK(state IN ('pending','paid','fulfillment_pending','fulfilled','cancelled','refunded','disputed')),
  created_at TEXT NOT NULL,
  paid_at TEXT,
  fulfilled_at TEXT,
  CHECK(state NOT IN ('paid','fulfillment_pending','fulfilled','refunded','disputed') OR paid_at IS NOT NULL)
);

CREATE INDEX idx_commerce_orders_org ON commerce_orders(organization_id, state, created_at);

CREATE TABLE commerce_payment_events (
  id TEXT PRIMARY KEY,
  provider_code TEXT NOT NULL,
  provider_event_id TEXT NOT NULL,
  payload_sha256 TEXT NOT NULL CHECK(length(payload_sha256) = 64),
  event_type TEXT NOT NULL,
  signature_verified_at TEXT NOT NULL,
  received_at TEXT NOT NULL,
  processing_state TEXT NOT NULL CHECK(processing_state IN ('received','processed','failed','conflict','dead_letter')),
  processed_at TEXT,
  error_code TEXT,
  UNIQUE(provider_code, provider_event_id)
);

CREATE TABLE commerce_entitlements (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES customer_organizations(id),
  order_id TEXT NOT NULL REFERENCES commerce_orders(id),
  product_code TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('pending','active','suspended','revoked','expired')),
  starts_at TEXT,
  ends_at TEXT,
  granted_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(order_id, product_code),
  CHECK(state <> 'active' OR starts_at IS NOT NULL)
);

CREATE TABLE commerce_refunds (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES commerce_orders(id),
  provider_code TEXT NOT NULL,
  provider_request_reference TEXT NOT NULL UNIQUE,
  provider_refund_reference TEXT UNIQUE,
  amount_minor INTEGER NOT NULL CHECK(amount_minor > 0),
  state TEXT NOT NULL CHECK(state IN ('requested','pending','succeeded','failed','cancelled')),
  reason_code TEXT NOT NULL,
  requested_by_staff_ref TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  completed_at TEXT,
  CHECK(state <> 'succeeded' OR completed_at IS NOT NULL)
);

CREATE TABLE commerce_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT REFERENCES customer_organizations(id),
  order_id TEXT REFERENCES commerce_orders(id),
  event_type TEXT NOT NULL,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('customer','staff','provider','system')),
  actor_ref TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK(outcome IN ('created','approved','rejected','processed','failed','reconciled')),
  reason_code TEXT,
  occurred_at TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE
);

-- Commerce status, entitlement, and payment evidence are intentionally
-- separate from directory verification, organic ranking, and editorial truth.
