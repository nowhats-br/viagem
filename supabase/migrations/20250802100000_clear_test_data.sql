/*
# [Operação de Limpeza]
Limpa todos os dados de teste das tabelas de reservas e passageiros.

## Query Description:
ATENÇÃO: Esta operação é DESTRUTIVA e irá apagar PERMANENTEMENTE todas as reservas e todos os passageiros cadastrados no sistema. Esta ação não pode ser desfeita. Recomenda-se fazer um backup dos dados caso queira restaurá-los no futuro. Use este script apenas para limpar o ambiente de teste antes de iniciar o uso em produção.

## Metadata:
- Schema-Category: "Dangerous"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Tabela Afetada: public.reservations
- Tabela Afetada: public.passengers

## Security Implications:
- RLS Status: Não aplicável
- Policy Changes: Não
- Auth Requirements: Requer permissões de administrador (superuser) no banco de dados.

## Performance Impact:
- Indexes: Não afetados
- Triggers: Não afetados
- Estimated Impact: A operação é rápida, mas resultará na perda total dos dados das tabelas mencionadas.
*/

-- Limpa todas as linhas das tabelas de passageiros e reservas,
-- reiniciando as sequências de ID e lidando com as chaves estrangeiras.
TRUNCATE TABLE public.reservations, public.passengers RESTART IDENTITY CASCADE;
