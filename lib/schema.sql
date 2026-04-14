-- Syfts.ai Database Schema (Vercel Postgres / Neon)

CREATE TABLE IF NOT EXISTS sports (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  sport_id INTEGER NOT NULL REFERENCES sports(id),
  category TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  specs JSONB DEFAULT '{}',
  previous_version_slug TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  store_id INTEGER NOT NULL REFERENCES stores(id),
  current_price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2) NOT NULL,
  discount_pct INTEGER NOT NULL,
  affiliate_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, store_id)
);

CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  price NUMERIC(10,2) NOT NULL,
  store_id INTEGER NOT NULL REFERENCES stores(id),
  recorded_at DATE DEFAULT CURRENT_DATE,
  UNIQUE(product_id, recorded_at)
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id),
  price_threshold NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
