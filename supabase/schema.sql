-- ============================================================
-- Car Dealer Website — Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  status        TEXT NOT NULL DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'sold', 'reserved')),
  make          TEXT NOT NULL,
  model         TEXT NOT NULL,
  variant       TEXT,
  year          INT NOT NULL,
  price         NUMERIC(12,2),
  mileage       INT,
  body_type     TEXT,
  transmission  TEXT,
  fuel_type     TEXT,
  colour        TEXT,
  vin           TEXT,
  stock_number  TEXT,
  description   TEXT,
  is_import     BOOLEAN NOT NULL DEFAULT false,
  images        TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type           TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'car_quote', 'import_quote')),
  car_id         UUID REFERENCES cars(id) ON DELETE SET NULL,
  department     TEXT,
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT,
  message        TEXT,
  budget         TEXT,
  location       TEXT,
  contact_pref   TEXT[],
  preferred_time TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on cars
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Cars: anyone can read
CREATE POLICY "Cars are publicly readable"
  ON cars FOR SELECT USING (true);

-- Cars: only service role (admin) can insert/update/delete
CREATE POLICY "Admins can manage cars"
  ON cars FOR ALL USING (auth.role() = 'service_role');

-- Enquiries: anyone can insert (form submissions)
CREATE POLICY "Anyone can submit enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);

-- Enquiries: only service role can read
CREATE POLICY "Admins can read enquiries"
  ON enquiries FOR SELECT USING (auth.role() = 'service_role');

-- ============================================================
-- Storage Bucket + Policies
-- ============================================================
-- In Supabase Dashboard → Storage → Create bucket named: car-images
-- Set it to PUBLIC so image URLs work without auth
-- INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Allow authenticated users (admin) to upload images
CREATE POLICY "Authenticated users can upload car images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'car-images');

-- Allow authenticated users to update/replace images
CREATE POLICY "Authenticated users can update car images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'car-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete car images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'car-images');

-- Allow public to read/view images (needed for public URLs to work)
CREATE POLICY "Car images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'car-images');
