/*
# [Operation Name]
Create Routes and Trips Tables

## Query Description: [This operation creates two new tables, `routes` and `trips`, to manage bus travel information. The `routes` table stores origin and destination pairs, while the `trips` table stores specific journey details like departure/arrival times and price, linking back to a route. This is a foundational change for the trip search functionality. No existing data will be affected as these are new tables.]

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Creates table `public.routes`
- Creates table `public.trips`
- Adds columns to `public.routes`: id, origin, destination, created_at
- Adds columns to `public.trips`: id, route_id, departure_time, arrival_time, price, created_at
- Adds foreign key constraint from `trips.route_id` to `routes.id`

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Public read access will be enabled for both tables.

## Performance Impact:
- Indexes: Primary keys are indexed by default.
- Triggers: None
- Estimated Impact: Low, as tables are new and will be small initially.
*/

-- Create the routes table
CREATE TABLE public.routes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    origin text NOT NULL,
    destination text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT routes_pkey PRIMARY KEY (id)
);

-- Enable RLS for the routes table
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to routes
CREATE POLICY "Allow public read access to routes"
ON public.routes
FOR SELECT
USING (true);


-- Create the trips table
CREATE TABLE public.trips (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    route_id uuid NOT NULL,
    departure_time timestamp with time zone NOT NULL,
    arrival_time timestamp with time zone NOT NULL,
    price numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT trips_pkey PRIMARY KEY (id),
    CONSTRAINT trips_route_id_fkey FOREIGN KEY (route_id) REFERENCES public.routes(id) ON DELETE CASCADE
);

-- Enable RLS for the trips table
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trips
CREATE POLICY "Allow public read access to trips"
ON public.trips
FOR SELECT
USING (true);
