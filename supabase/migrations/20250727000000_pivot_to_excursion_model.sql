/*
          # [Pivot to Excursion Model]
          This migration restructures the database to support a single-excursion reservation model instead of a multi-trip search system. It removes obsolete tables and adds new structures for settings and passenger information.

          ## Query Description: [This operation will remove the 'trips' and 'routes' tables, which are no longer needed. It creates a new 'excursion_settings' table to store prices and modifies the 'passengers' table to include 'city' and 'pastor_name'. Data in the old tables will be lost, but they are not relevant to the new model. This is a necessary step to align the database with the new application requirements.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - DROPPED TABLES: `trips`, `routes`
          - CREATED TABLE: `excursion_settings` (id, setting_name, leito_price, semi_leito_price)
          - ALTERED TABLE `reservations`: Dropped column `trip_id`
          - ALTERED TABLE `passengers`: Added columns `city`, `pastor_name`
          
          ## Security Implications:
          - RLS Status: Enabled on `excursion_settings`
          - Policy Changes: Yes, new read-only policy for `excursion_settings`
          - Auth Requirements: None for this migration.
          
          ## Performance Impact:
          - Indexes: Default indexes on new primary keys.
          - Triggers: None.
          - Estimated Impact: Low. The changes are structural and affect tables that are either new or will be used differently.
          */

-- Step 1: Drop the old tables that are no longer needed for the excursion model.
-- These tables were for a multi-trip search system, which is being replaced.
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS routes;

-- Step 2: Create a table to hold global settings for the excursion, like prices.
-- This allows the admin to configure values without changing the code.
CREATE TABLE IF NOT EXISTS excursion_settings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    setting_name TEXT UNIQUE NOT NULL,
    leito_price NUMERIC(10, 2) NOT NULL DEFAULT 189.99,
    semi_leito_price NUMERIC(10, 2) NOT NULL DEFAULT 119.99,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Insert a default row of settings.
-- This ensures the application has price values to work with immediately.
-- ON CONFLICT prevents errors if this script is run more than once.
INSERT INTO excursion_settings (setting_name, leito_price, semi_leito_price)
VALUES ('default', 189.99, 119.99)
ON CONFLICT (setting_name) DO NOTHING;

-- Step 4: Remove the now-obsolete 'trip_id' column from the 'reservations' table.
ALTER TABLE reservations
DROP COLUMN IF EXISTS trip_id;

-- Step 5: Add the new required fields to the 'passengers' table.
ALTER TABLE passengers
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS pastor_name TEXT;

-- Step 6: Enable Row Level Security on the new settings table.
ALTER TABLE excursion_settings ENABLE ROW LEVEL SECURITY;

-- Step 7: Create a policy to allow anyone to read the settings.
-- This is necessary for the frontend to fetch the prices for Leito and Semi-Leito seats.
CREATE POLICY "Allow public read access to settings" ON excursion_settings
FOR SELECT USING (true);

-- Step 8: Ensure the admin role can manage the settings.
CREATE POLICY "Allow admin full access to settings" ON excursion_settings
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
