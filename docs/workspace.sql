-- A-ORG-2 — THE WORKSPACE (v2.7.0; owner ruling: "Go with supabase")
-- One-time setup for a NEW Supabase project. Run in the SQL editor.
-- (The owner's original project received this as migration
--  a2_workspace_write_codes + its search_path fix on 17 Sep 2026.)
--
-- The model:
--   · one row per BOARD in a2_records; the row carries the whole working set;
--   · anyone with the project URL + publishable key READS a board (viewers);
--   · WRITES go only through a2_save(), which checks the board's WRITE CODE
--     in the database — the publishable key alone cannot modify a board;
--   · a board with no code is OPEN; the first save that carries a code LOCKS
--     the board with it. Editors hold the code; viewers never see it.

create extension if not exists pgcrypto;

create table if not exists public.a2_records (
  id text primary key,
  data jsonb,
  updated_at timestamptz,
  updated_by text,
  write_code_hash text
);
alter table public.a2_records add column if not exists write_code_hash text;
alter table public.a2_records enable row level security;

-- viewers read; nobody writes directly (a2_save is the only door)
drop policy if exists "a2 board select" on public.a2_records;
create policy "a2 board select" on public.a2_records for select using (true);
drop policy if exists "a2 board insert" on public.a2_records;
drop policy if exists "a2 board update" on public.a2_records;

-- live mirroring across devices
do $$ begin
  alter publication supabase_realtime add table public.a2_records;
exception when duplicate_object then null; end $$;

create or replace function public.a2_save(p_board text, p_code text, p_data jsonb, p_client text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions   -- pgcrypto lives in "extensions" on Supabase
as $$
declare
  v_hash text;
  v_new  text;
begin
  if p_board is null or length(p_board) < 1 or length(p_board) > 40 then
    raise exception 'bad board name';
  end if;
  if p_data is null or pg_column_size(p_data) > 4000000 then
    raise exception 'bad payload';
  end if;
  v_new := case when coalesce(p_code, '') <> ''
                then encode(digest(p_code, 'sha256'), 'hex') else null end;

  select write_code_hash into v_hash from public.a2_records where id = p_board;

  if not found then
    -- first writer creates the board; a carried code locks it from birth
    insert into public.a2_records (id, data, updated_at, updated_by, write_code_hash)
    values (p_board, p_data, now(), p_client, v_new);
    return true;
  end if;

  if v_hash is null then
    -- an OPEN board: any key-holder saves (the pre-v2.7.0 behavior); the
    -- first save that carries a code locks the board with it
    update public.a2_records
       set data = p_data, updated_at = now(), updated_by = p_client,
           write_code_hash = coalesce(v_new, write_code_hash)
     where id = p_board;
    return true;
  end if;

  if v_new is null or v_new <> v_hash then
    raise exception 'write code required';
  end if;

  update public.a2_records
     set data = p_data, updated_at = now(), updated_by = p_client
   where id = p_board;
  return true;
end;
$$;

revoke all on function public.a2_save(text, text, jsonb, text) from public;
grant execute on function public.a2_save(text, text, jsonb, text) to anon, authenticated;
