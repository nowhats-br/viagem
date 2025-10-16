/*
# [Limpeza de Dados de Teste]
Este script apaga todos os registros das tabelas 'reservations' e 'passengers'.

## Query Description: [Esta operação removerá permanentemente todos os dados de reservas e passageiros existentes no banco de dados. É destinada a limpar o ambiente de teste antes de entrar em produção. Recomenda-se fazer um backup se houver algum dado que precise ser preservado.]

## Metadata:
- Schema-Category: "Dangerous"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Tables affected: public.reservations, public.passengers

## Security Implications:
- RLS Status: Not affected
- Policy Changes: No
- Auth Requirements: Admin privileges required to run TRUNCATE.

## Performance Impact:
- Indexes: Not affected
- Triggers: Will be fired if any exist.
- Estimated Impact: Low performance impact during execution, but high data impact.
*/
TRUNCATE TABLE public.reservations, public.passengers RESTART IDENTITY CASCADE;
