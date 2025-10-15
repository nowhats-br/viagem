/*
# Criação das Tabelas de Reservas e Passageiros
Este script cria as tabelas `reservations` e `passengers` para armazenar permanentemente os dados das reservas feitas no sistema.

## Descrição da Query:
- **`reservations`**: Armazena os detalhes gerais de cada reserva, como o valor total, método de pagamento e a viagem associada.
- **`passengers`**: Armazena os dados de cada passageiro vinculado a uma reserva, incluindo nome, documento e assento escolhido.
- **RLS (Row Level Security)**: Políticas de segurança são ativadas para garantir que, no futuro, os usuários só possam ver suas próprias reservas.

## Metadados:
- Categoria do Esquema: "Estrutural"
- Nível de Impacto: "Baixo"
- Requer Backup: false
- Reversível: true

## Detalhes da Estrutura:
- **Tabela Criada:** `public.reservations`
  - Colunas: `id`, `created_at`, `total_amount`, `payment_method`, `installments`, `paid_installments`, `trip_id`
- **Tabela Criada:** `public.passengers`
  - Colunas: `id`, `created_at`, `reservation_id`, `name`, `document`, `seat_type`, `seat_number`

## Implicações de Segurança:
- Status RLS: Habilitado em ambas as tabelas.
- Mudanças de Política: Nenhuma política definida inicialmente, acesso total para `service_role`.
- Requisitos de Autenticação: Nenhum para esta migração.

## Impacto no Desempenho:
- Índices: Chaves primárias e estrangeiras são indexadas automaticamente.
- Triggers: Nenhum.
- Impacto Estimado: Mínimo. A criação de tabelas não afeta o desempenho das queries existentes.
*/

-- Habilita a extensão pgcrypto se ainda não estiver habilitada, para gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

-- Tabela para armazenar as reservas
CREATE TABLE public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('pix', 'credit-card')),
    installments INTEGER NOT NULL,
    paid_installments INTEGER NOT NULL DEFAULT 0,
    trip_id INTEGER REFERENCES public.trips(id) ON DELETE SET NULL
);

-- Habilita Row Level Security para a tabela de reservas
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Comentários sobre a tabela e colunas
COMMENT ON TABLE public.reservations IS 'Armazena os detalhes de cada reserva de passagem.';
COMMENT ON COLUMN public.reservations.total_amount IS 'Valor total da reserva.';
COMMENT ON COLUMN public.reservations.payment_method IS 'Método de pagamento escolhido (pix ou credit-card).';
COMMENT ON COLUMN public.reservations.installments IS 'Número total de parcelas.';
COMMENT ON COLUMN public.reservations.paid_installments IS 'Número de parcelas já pagas.';
COMMENT ON COLUMN public.reservations.trip_id IS 'Referência à viagem associada a esta reserva.';


-- Tabela para armazenar os passageiros de cada reserva
CREATE TABLE public.passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    document TEXT NOT NULL,
    seat_type TEXT NOT NULL CHECK (seat_type IN ('leito', 'semi-leito')),
    seat_number INTEGER NOT NULL
);

-- Habilita Row Level Security para a tabela de passageiros
ALTER TABLE public.passengers ENABLE ROW LEVEL SECURITY;

-- Cria um índice na chave estrangeira para otimizar as buscas
CREATE INDEX idx_passengers_reservation_id ON public.passengers(reservation_id);

-- Comentários sobre a tabela e colunas
COMMENT ON TABLE public.passengers IS 'Armazena os dados dos passageiros associados a uma reserva.';
COMMENT ON COLUMN public.passengers.reservation_id IS 'Referência à reserva a qual este passageiro pertence.';
COMMENT ON COLUMN public.passengers.name IS 'Nome completo do passageiro.';
COMMENT ON COLUMN public.passengers.document IS 'Documento do passageiro (CPF, RG, etc.).';
COMMENT ON COLUMN public.passengers.seat_number IS 'Número do assento escolhido pelo passageiro.';
