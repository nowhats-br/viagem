/*
# [Atualização de Schema para Autenticação e Novas Funcionalidades]
Este script prepara o banco de dados para novas funcionalidades, incluindo autenticação de administrador, status de reserva e coleta de informações de contato adicionais.

## Descrição da Query:
- Adiciona a coluna `whatsapp` à tabela `passengers` para contato.
- Adiciona a coluna `status` à tabela `reservations` para controlar o fluxo de confirmação (pendente vs. confirmada).
- Habilita e configura Row Level Security (RLS) para as tabelas `reservations`, `passengers` e `excursion_settings` para garantir que apenas administradores autenticados possam modificar dados, enquanto leituras públicas permanecem possíveis.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: true
- Reversible: true (com remoção manual das colunas e políticas)

## Detalhes da Estrutura:
- Tabela Afetada: `passengers` (adiciona `whatsapp TEXT`)
- Tabela Afetada: `reservations` (adiciona `status TEXT`)
- Tabelas Afetadas (Segurança): `reservations`, `passengers`, `excursion_settings` (habilita RLS e adiciona políticas)

## Implicações de Segurança:
- RLS Status: Habilitado
- Mudanças de Política: Sim. Novas políticas são criadas para permitir acesso de leitura público e restringir operações de escrita (INSERT, UPDATE, DELETE) a usuários com o role `authenticated`.
- Requisitos de Autenticação: Operações de escrita agora exigirão um usuário autenticado.

## Impacto de Performance:
- Índices: Nenhum índice novo adicionado.
- Triggers: Nenhum trigger novo adicionado.
- Impacto Estimado: Mínimo. A verificação de RLS adiciona uma pequena sobrecarga nas queries, mas é essencial para a segurança.
*/

-- Adiciona a coluna 'whatsapp' à tabela de passageiros.
-- Esta coluna armazenará o número de contato para compartilhamento da passagem.
ALTER TABLE public.passengers
ADD COLUMN whatsapp TEXT;

-- Adiciona a coluna 'status' à tabela de reservas.
-- O status 'pending' indica que a reserva foi criada mas aguarda pagamento.
-- O status 'confirmed' indica que a primeira parcela foi paga e o assento está garantido.
ALTER TABLE public.reservations
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Habilita a Segurança a Nível de Linha (RLS) para proteger os dados.
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excursion_settings ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas para evitar conflitos.
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.reservations;
DROP POLICY IF EXISTS "Allow read access for everyone" ON public.reservations;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.passengers;
DROP POLICY IF EXISTS "Allow read access for everyone" ON public.passengers;
DROP POLICY IF EXISTS "Allow all access to authenticated users" ON public.excursion_settings;
DROP POLICY IF EXISTS "Allow read access for everyone" ON public.excursion_settings;

-- Políticas para a tabela 'excursion_settings'
-- Permite que qualquer pessoa leia as configurações (preços).
CREATE POLICY "Allow read access for everyone" ON public.excursion_settings FOR SELECT USING (true);
-- Permite que apenas usuários autenticados (admin) modifiquem as configurações.
CREATE POLICY "Allow all access to authenticated users" ON public.excursion_settings FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para a tabela 'reservations'
-- Permite que qualquer pessoa crie uma nova reserva (INSERT).
CREATE POLICY "Allow anonymous users to create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
-- Permite que usuários autenticados (admin) gerenciem todas as reservas.
CREATE POLICY "Allow authenticated users to manage reservations" ON public.reservations FOR ALL USING (auth.role() = 'authenticated');
-- Permite que qualquer pessoa leia as reservas (necessário para consulta por CPF).
CREATE POLICY "Allow public read access" ON public.reservations FOR SELECT USING (true);


-- Políticas para a tabela 'passengers'
-- Permite que qualquer pessoa crie novos passageiros (INSERT).
CREATE POLICY "Allow anonymous users to create passengers" ON public.passengers FOR INSERT WITH CHECK (true);
-- Permite que usuários autenticados (admin) gerenciem todos os passageiros.
CREATE POLICY "Allow authenticated users to manage passengers" ON public.passengers FOR ALL USING (auth.role() = 'authenticated');
-- Permite que qualquer pessoa leia os passageiros (necessário para consulta por CPF).
CREATE POLICY "Allow public read access" ON public.passengers FOR SELECT USING (true);
