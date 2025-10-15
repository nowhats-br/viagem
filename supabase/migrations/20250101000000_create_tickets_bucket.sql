/*
# [Criação do Bucket de Armazenamento de Passagens]
Este script cria um novo "bucket" (repositório de arquivos) no Supabase Storage chamado "tickets" e configura as permissões necessárias para o compartilhamento de passagens em PDF.

## Query Description:
- **Criação do Bucket:** Cria um bucket público chamado `tickets`. Sendo público, qualquer pessoa com o link direto para um arquivo poderá visualizá-lo. Isso é essencial para o compartilhamento via WhatsApp.
- **Política de Upload:** Cria uma política de segurança que permite que apenas usuários autenticados (neste caso, a lógica da aplicação) possam fazer o upload de novos arquivos (passagens em PDF) para este bucket. Isso protege o bucket contra uploads não autorizados.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (o bucket e a política podem ser removidos manualmente)

## Structure Details:
- **storage.buckets:** Adiciona uma nova entrada para 'tickets'.
- **storage.objects:** Adiciona uma nova política de segurança para inserção (INSERT).

## Security Implications:
- **RLS Status:** Não aplicável diretamente, mas cria políticas de acesso para o Storage.
- **Policy Changes:** Sim, adiciona uma nova política para o `storage.objects`.
- **Auth Requirements:** A política de upload requer que a operação seja feita por um usuário/serviço autenticado.

## Performance Impact:
- **Indexes:** Nenhum.
- **Triggers:** Nenhum.
- **Estimated Impact:** Nenhum impacto perceptível no desempenho do banco de dados.
*/

-- Cria o bucket 'tickets' e o torna público para leitura.
-- O ON CONFLICT garante que o script não falhe se o bucket já existir.
INSERT INTO storage.buckets (id, name, public)
VALUES ('tickets', 'tickets', true)
ON CONFLICT (id) DO NOTHING;

-- Remove a política antiga, se existir, para evitar conflitos.
DROP POLICY IF EXISTS "Allow authenticated uploads to tickets" ON storage.objects;

-- Permite que usuários autenticados (ou a aplicação usando a chave de serviço) façam upload de arquivos.
CREATE POLICY "Allow authenticated uploads to tickets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'tickets' );
