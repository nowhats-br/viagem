/*
# [Add Index to Passengers Document]
This operation adds a database index to the `document` column of the `passengers` table.

## Query Description: [This operation creates an index on the `document` (CPF) column. This will significantly speed up queries that search for reservations by a passenger's CPF, such as the "Consultar Reserva" feature. This is a non-destructive operation and has no impact on existing data. It is highly recommended for performance as the number of passengers grows.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: `public.passengers`
- Column: `document`
- Action: Adds an index `idx_passengers_document`.

## Security Implications:
- RLS Status: [No Change]
- Policy Changes: [No]
- Auth Requirements: [None]

## Performance Impact:
- Indexes: [Added]
- Triggers: [No Change]
- Estimated Impact: [Positive. Significantly improves lookup performance on the `passengers` table when filtering by the `document` column. Write performance will have a negligible decrease, which is an acceptable trade-off.]
*/

CREATE INDEX IF NOT EXISTS idx_passengers_document ON public.passengers (document);
