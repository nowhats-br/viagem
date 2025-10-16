/*
# [Operation Name]
Adicionar Datas da Excursão nas Configurações

[Description of what this operation does]
Este script adiciona colunas para data de início e fim da excursão na tabela `excursion_settings` e preenche os valores padrão para a viagem de Janeiro de 2026. Isso torna as datas da viagem dinâmicas e gerenciáveis pelo sistema, em vez de estarem fixas no código.

## Query Description: [Write a clear, informative message that:
1. Explains the impact on existing data
2. Highlights potential risks or safety concerns
3. Suggests precautions (e.g., backup recommendations)
4. Uses non-technical language when possible
5. Keeps it concise but comprehensive
Example: "Esta operação irá modificar a tabela de configurações da excursão para incluir datas de início e fim. Os registros existentes serão atualizados com as datas padrão '06/01/2026' e '10/01/2026'. Nenhum dado será perdido."]

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabela Afetada: `public.excursion_settings`
- Colunas Adicionadas:
  - `start_date` (DATE)
  - `end_date` (DATE)

## Security Implications:
- RLS Status: Habilitado (Presumido)
- Policy Changes: Não
- Auth Requirements: Acesso de administrador para modificar a tabela.

## Performance Impact:
- Indexes: Nenhum
- Triggers: Nenhum
- Estimated Impact: Mínimo. A alteração na tabela é rápida e a atualização afeta apenas uma linha.
*/

-- Adicionar coluna para a data de início da excursão
ALTER TABLE public.excursion_settings
ADD COLUMN start_date DATE;

-- Adicionar coluna para a data de fim da excursão
ALTER TABLE public.excursion_settings
ADD COLUMN end_date DATE;

-- Atualizar a linha de configuração existente com as datas da viagem
UPDATE public.excursion_settings
SET start_date = '2026-01-06', end_date = '2026-01-10'
WHERE id = 1;
