/*
# [Update Auth and Add Phone]
This migration script introduces a `phone` column to the `passengers` table to store contact information and updates the authentication mechanism to use a secure PIN.

## Query Description: [This operation alters the `passengers` table to add a new `phone` column, which is nullable. It also creates a new `auth_settings` table to securely store the admin PIN. This change is non-destructive to existing data but adds new fields that the application will use.]

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- **Table `passengers`**:
  - Adds column `phone` (type `text`, nullable).
- **Table `auth_settings`**:
  - Creates a new table to store key-value settings.
  - Inserts the admin PIN into this table.

## Security Implications:
- RLS Status: Enabled on `passengers`. A new policy will be needed if `phone` access should be restricted.
- Policy Changes: No
- Auth Requirements: The new `auth_settings` table will be used for admin authentication.

## Performance Impact:
- Indexes: None added or removed.
- Triggers: None added or removed.
- Estimated Impact: Negligible performance impact.
*/

-- Add phone column to passengers table
ALTER TABLE public.passengers
ADD COLUMN phone TEXT;

-- Create a table for authentication settings
CREATE TABLE IF NOT EXISTS public.auth_settings (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on the new table
ALTER TABLE public.auth_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for auth_settings
-- Allow admin users to read all settings
CREATE POLICY "Allow admin read access"
ON public.auth_settings
FOR SELECT
USING (auth.role() = 'service_role');

-- Insert the admin PIN
-- Replace '253102' with a new secure PIN if needed
INSERT INTO public.auth_settings (key, value)
VALUES ('admin_pin', '253102')
ON CONFLICT (key) DO NOTHING;
