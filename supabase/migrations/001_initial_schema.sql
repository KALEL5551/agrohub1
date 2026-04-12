-- ============================================================
-- AgriTrade Africa — Complete Database Schema
-- Run this in Supabase SQL editor or as migration file
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for fast text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('farmer', 'supplier', 'buyer', 'admin');
CREATE TYPE product_category AS ENUM ('agriculture', 'electronics', 'books', 'services', 'other');
CREATE TYPE product_status AS ENUM ('draft', 'pending_review', 'active', 'suspended', 'out_of_stock');
CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'payment_held',       -- escrow active
  'processing',
  'shipped',
  'in_customs',
  'out_for_delivery',
  'delivered',
  'disputed',
  'refunded',
  'cancelled'
);
CREATE TYPE payment_method AS ENUM ('mtn_momo', 'airtel_money', 'card', 'bank_transfer', 'ussd');
CREATE TYPE verification_level AS ENUM ('unverified', 'email_verified', 'kyc_basic', 'kyc_full', 'trusted_supplier');
CREATE TYPE shipping_zone AS ENUM ('domestic_ug', 'east_africa', 'africa', 'international');
CREATE TYPE rfq_status AS ENUM ('open', 'bidding', 'awarded', 'completed', 'cancelled');

-- ============================================================
-- USERS & PROFILES
-- ============================================================

CREATE TABLE profiles (
  id                UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role              user_role NOT NULL DEFAULT 'buyer',
  full_name         TEXT NOT NULL,
  phone             TEXT,
  email             TEXT,
  avatar_url        TEXT,
  bio               TEXT,
  district          TEXT,                -- Uganda district (Kampala, Mbale, Gulu...)
  country           TEXT NOT NULL DEFAULT 'Uganda',
  verification_level verification_level NOT NULL DEFAULT 'unverified',
  kyc_document_url  TEXT,               -- ID scan stored in Supabase Storage
  kyc_reviewed_at   TIMESTAMPTZ,
  kyc_reviewed_by   UUID REFERENCES profiles(id),
  language          TEXT NOT NULL DEFAULT 'en',  -- 'en', 'lg' (Luganda), 'sw' (Swahili)
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  total_orders      INTEGER NOT NULL DEFAULT 0,
  total_sales       INTEGER NOT NULL DEFAULT 0,
  rating            NUMERIC(3,2),        -- 0.00 - 5.00
  review_count      INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE supplier_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_name        TEXT NOT NULL,
  company_website     TEXT,
  company_country     TEXT NOT NULL,
  company_description TEXT,
  business_reg_number TEXT,
  tax_id              TEXT,
  logo_url            TEXT,
  banner_url          TEXT,
  min_order_usd       NUMERIC(10,2),
  response_time_hours INTEGER,           -- avg hours to respond
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at         TIMESTAMPTZ,
  verified_by         UUID REFERENCES profiles(id),
  verification_docs   JSONB,             -- array of document URLs
  categories          product_category[],
  total_listings      INTEGER NOT NULL DEFAULT 0,
  completed_orders    INTEGER NOT NULL DEFAULT 0,
  rating              NUMERIC(3,2),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id       UUID NOT NULL REFERENCES profiles(id),
  category          product_category NOT NULL,
  subcategory       TEXT,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  images            TEXT[],              -- Supabase Storage URLs
  price_usd         NUMERIC(10,2) NOT NULL,
  price_ugx         NUMERIC(12,2),       -- calculated from USD daily
  currency          TEXT NOT NULL DEFAULT 'USD',
  min_order_qty     INTEGER NOT NULL DEFAULT 1,
  unit              TEXT NOT NULL DEFAULT 'piece',   -- kg, gram, piece, lot, set
  stock_qty         INTEGER,
  sku               TEXT,
  origin_country    TEXT,
  status            product_status NOT NULL DEFAULT 'pending_review',
  reviewed_by       UUID REFERENCES profiles(id),
  reviewed_at       TIMESTAMPTZ,
  attributes        JSONB,              -- flexible: germination_rate, voltage, datasheet_url
  tags              TEXT[],
  search_vector     TSVECTOR,           -- full-text search
  view_count        INTEGER NOT NULL DEFAULT 0,
  order_count       INTEGER NOT NULL DEFAULT 0,
  rating            NUMERIC(3,2),
  shipping_weight_kg NUMERIC(8,3),
  shipping_zones    shipping_zone[],
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update search vector
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english',
    COALESCE(NEW.title, '') || ' ' ||
    COALESCE(NEW.description, '') || ' ' ||
    COALESCE(NEW.subcategory, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION products_search_vector_update();

-- ============================================================
-- ORDERS & ESCROW
-- ============================================================

CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number      TEXT NOT NULL UNIQUE,  -- AT-2026-000001
  buyer_id          UUID NOT NULL REFERENCES profiles(id),
  supplier_id       UUID NOT NULL REFERENCES profiles(id),
  status            order_status NOT NULL DEFAULT 'pending_payment',

  -- Line items (snapshot at order time, not FK to avoid drift)
  items             JSONB NOT NULL,        -- [{product_id, title, qty, unit_price_usd, image}]
  subtotal_usd      NUMERIC(10,2) NOT NULL,
  shipping_cost_usd NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee_usd  NUMERIC(10,2) NOT NULL DEFAULT 0,  -- your commission
  markup_usd        NUMERIC(10,2) NOT NULL DEFAULT 0,   -- your shipping markup
  total_usd         NUMERIC(10,2) NOT NULL,
  total_ugx         NUMERIC(14,2),

  -- Payment
  payment_method    payment_method,
  payment_ref       TEXT,                 -- Flutterwave transaction ID
  paid_at           TIMESTAMPTZ,
  escrow_released   BOOLEAN NOT NULL DEFAULT FALSE,
  escrow_released_at TIMESTAMPTZ,
  escrow_released_by UUID REFERENCES profiles(id),

  -- Shipping
  shipping_address  JSONB NOT NULL,       -- {name, phone, district, address_line, city, country}
  shipping_carrier  TEXT,                 -- 'DHL', 'Sendy', 'local_courier'
  tracking_number   TEXT,
  tracking_url      TEXT,
  shipped_at        TIMESTAMPTZ,
  estimated_delivery DATE,
  delivered_at      TIMESTAMPTZ,
  delivery_confirmed_at TIMESTAMPTZ,

  -- Logistics stages (for tracking UI)
  logistics_stages  JSONB,               -- [{stage, location, timestamp, note}]

  -- Dispute
  disputed_at       TIMESTAMPTZ,
  dispute_reason    TEXT,
  dispute_resolved_at TIMESTAMPTZ,
  dispute_resolved_by UUID REFERENCES profiles(id),
  dispute_resolution TEXT,

  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number() RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'AT-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
    LPAD((nextval('order_number_seq'))::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_number_seq START 1;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- RFQ (Request for Quotation) — for bulk/rare items
-- ============================================================

CREATE TABLE rfqs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id        UUID NOT NULL REFERENCES profiles(id),
  category        product_category NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  quantity        INTEGER NOT NULL,
  unit            TEXT NOT NULL,
  target_price_usd NUMERIC(10,2),
  destination     TEXT NOT NULL,
  required_by     DATE,
  status          rfq_status NOT NULL DEFAULT 'open',
  awarded_bid_id  UUID,
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE rfq_bids (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id          UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
  supplier_id     UUID NOT NULL REFERENCES profiles(id),
  price_usd       NUMERIC(10,2) NOT NULL,
  shipping_usd    NUMERIC(10,2) NOT NULL DEFAULT 0,
  lead_time_days  INTEGER NOT NULL,
  notes           TEXT,
  is_awarded      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(rfq_id, supplier_id)
);

ALTER TABLE rfqs ADD CONSTRAINT rfqs_awarded_bid_fk
  FOREIGN KEY (awarded_bid_id) REFERENCES rfq_bids(id);

-- ============================================================
-- CHAT / MESSAGING
-- ============================================================

CREATE TABLE chat_rooms (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID REFERENCES orders(id),   -- NULL = pre-order negotiation
  rfq_id        UUID REFERENCES rfqs(id),
  participant_a UUID NOT NULL REFERENCES profiles(id),  -- buyer
  participant_b UUID NOT NULL REFERENCES profiles(id),  -- supplier
  last_message  TEXT,
  last_message_at TIMESTAMPTZ,
  unread_a      INTEGER NOT NULL DEFAULT 0,
  unread_b      INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(participant_a, participant_b, order_id)
);

CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id     UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id   UUID NOT NULL REFERENCES profiles(id),
  content     TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',  -- 'text', 'image', 'voice', 'system', 'offer'
  attachment_url TEXT,
  offer_data  JSONB,    -- for 'offer' type: {product_id, qty, price_usd}
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      UUID NOT NULL REFERENCES orders(id) UNIQUE,
  reviewer_id   UUID NOT NULL REFERENCES profiles(id),
  reviewed_id   UUID NOT NULL REFERENCES profiles(id),  -- supplier
  product_id    UUID REFERENCES products(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title         TEXT,
  body          TEXT,
  images        TEXT[],
  response      TEXT,     -- supplier's response
  response_at   TIMESTAMPTZ,
  is_verified   BOOLEAN NOT NULL DEFAULT TRUE,  -- from real order
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SHIPPING QUOTES (cache from DHL/logistics APIs)
-- ============================================================

CREATE TABLE shipping_quotes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  origin_country  TEXT NOT NULL,
  dest_country    TEXT NOT NULL DEFAULT 'Uganda',
  dest_district   TEXT,
  weight_kg       NUMERIC(8,3) NOT NULL,
  carrier         TEXT NOT NULL,
  service_type    TEXT NOT NULL,  -- 'express', 'standard', 'economy'
  base_cost_usd   NUMERIC(10,2) NOT NULL,
  platform_markup_usd NUMERIC(10,2) NOT NULL,
  total_cost_usd  NUMERIC(10,2) GENERATED ALWAYS AS (base_cost_usd + platform_markup_usd) STORED,
  transit_days_min INTEGER NOT NULL,
  transit_days_max INTEGER NOT NULL,
  valid_until     TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PLATFORM CONFIG (admin-controlled settings)
-- ============================================================

CREATE TABLE platform_config (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  description TEXT,
  updated_by  UUID REFERENCES profiles(id),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_config (key, value, description) VALUES
  ('commission_rate',   '0.10',           'Platform commission as decimal (10%)'),
  ('shipping_markup',   '{"min": 5, "max_pct": 0.15}', 'Min $5 or 15% of shipping cost'),
  ('escrow_auto_release_days', '14',      'Auto-release escrow if no dispute after delivery'),
  ('supported_currencies', '["USD","UGX","KES","TZS"]', 'Supported currencies'),
  ('usd_to_ugx_rate',   '3750',           'Approximate exchange rate (update daily)');

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,  -- 'order_update', 'message', 'rfq_bid', 'payment', etc.
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB,           -- {order_id, message_id, etc.}
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES (performance critical)
-- ============================================================

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_supplier ON products(supplier_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_search ON products USING GIN(search_vector);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_supplier ON orders(supplier_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_messages_room ON messages(room_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfq_bids ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Public profiles visible" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Own profile editable" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: active products public, supplier edits own
CREATE POLICY "Active products visible" ON products FOR SELECT
  USING (status = 'active' OR supplier_id = auth.uid());
CREATE POLICY "Supplier manages own products" ON products FOR ALL
  USING (supplier_id = auth.uid());
CREATE POLICY "Admin manages all products" ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders: buyer and supplier can see their orders
CREATE POLICY "Own orders visible" ON orders FOR SELECT
  USING (buyer_id = auth.uid() OR supplier_id = auth.uid());
CREATE POLICY "Admin sees all orders" ON orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Buyer creates order" ON orders FOR INSERT
  WITH CHECK (buyer_id = auth.uid());

-- Messages: only room participants
CREATE POLICY "Room participants read messages" ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE id = room_id
      AND (participant_a = auth.uid() OR participant_b = auth.uid())
    )
  );
CREATE POLICY "Sender inserts messages" ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Notifications: own only
CREATE POLICY "Own notifications" ON notifications FOR ALL
  USING (user_id = auth.uid());

-- Reviews: public read, order owner writes
CREATE POLICY "Public reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Buyer writes review" ON reviews FOR INSERT
  WITH CHECK (reviewer_id = auth.uid());

-- RFQs: public read (category browsing), own write
CREATE POLICY "Public RFQs visible" ON rfqs FOR SELECT USING (status = 'open');
CREATE POLICY "Own RFQ manageable" ON rfqs FOR ALL USING (buyer_id = auth.uid());

CREATE POLICY "Suppliers bid on RFQs" ON rfq_bids FOR INSERT
  WITH CHECK (supplier_id = auth.uid());
CREATE POLICY "Own bids visible" ON rfq_bids FOR SELECT
  USING (supplier_id = auth.uid() OR
    EXISTS (SELECT 1 FROM rfqs WHERE id = rfq_id AND buyer_id = auth.uid()));

-- ============================================================
-- UPDATED_AT TRIGGER (applies to any table with updated_at)
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
