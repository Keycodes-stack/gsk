create extension if not exists vector;

create table if not exists public.research_conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.research_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.research_conversations(id) on delete cascade,
  role text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.research_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  conversation_id uuid references public.research_conversations(id) on delete set null,
  source_name text,
  source_url text,
  source_type text not null default 'research_paper',
  authors text,
  published_at date,
  file_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.research_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.research_documents(id) on delete cascade,
  conversation_id uuid references public.research_conversations(id) on delete set null,
  chunk_index integer not null default 0,
  chunk_text text not null,
  page_number integer,
  section_name text,
  content_hash text not null,
  embedding vector(768),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.research_messages(id) on delete cascade,
  title text,
  url text,
  snippet text,
  source_date date,
  last_updated date,
  result_rank integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.research_messages add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.research_documents add column if not exists conversation_id uuid references public.research_conversations(id) on delete set null;
alter table public.research_documents add column if not exists source_name text;
alter table public.research_documents add column if not exists source_url text;
alter table public.research_documents add column if not exists source_type text default 'research_paper';
alter table public.research_documents add column if not exists authors text;
alter table public.research_documents add column if not exists published_at date;
alter table public.research_documents add column if not exists file_path text;
alter table public.research_documents add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.research_chunks add column if not exists conversation_id uuid references public.research_conversations(id) on delete set null;
alter table public.research_chunks add column if not exists page_number integer;
alter table public.research_chunks add column if not exists section_name text;
alter table public.research_chunks add column if not exists content_hash text;
alter table public.research_chunks add column if not exists embedding vector(768);
alter table public.research_chunks add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.research_sources add column if not exists metadata jsonb not null default '{}'::jsonb;

-- PostgreSQL cannot change a function's OUT return type in-place.
drop function if exists public.match_research_chunks(vector, uuid, integer, double precision);

create or replace function public.match_research_chunks(
  query_embedding vector(768),
  match_conversation_id uuid default null,
  match_count integer default 8,
  similarity_threshold double precision default 0.35
)
returns table (
  id uuid,
  document_id uuid,
  conversation_id uuid,
  chunk_index integer,
  chunk_text text,
  page_number integer,
  section_name text,
  content_hash text,
  similarity double precision,
  title text,
  source_name text,
  source_url text,
  source_type text
)
language sql
stable
as $$
  select
    c.id,
    c.document_id,
    c.conversation_id,
    c.chunk_index,
    c.chunk_text,
    c.page_number,
    c.section_name,
    c.content_hash,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.title,
    d.source_name,
    d.source_url,
    d.source_type
  from public.research_chunks c
  join public.research_documents d on d.id = c.document_id
  where c.embedding is not null
    and (match_conversation_id is null or c.conversation_id = match_conversation_id)
    and 1 - (c.embedding <=> query_embedding) >= similarity_threshold
  order by c.embedding <=> query_embedding
  limit greatest(match_count, 1);
$$;

create index if not exists idx_research_documents_source_url on public.research_documents(source_url);
create index if not exists idx_research_documents_conversation on public.research_documents(conversation_id);
create index if not exists idx_research_chunks_document on public.research_chunks(document_id);
create index if not exists idx_research_chunks_conversation on public.research_chunks(conversation_id);
create index if not exists idx_research_chunks_embedding_hnsw on public.research_chunks using hnsw (embedding vector_cosine_ops);
