-- Ami Legal: tabel voor aanvragen, met rijbeveiliging per medewerker (auth.uid()).

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  purpose text not null check (char_length(purpose) between 1 and 200),
  requested_amount numeric(12, 2) not null check (requested_amount > 0),
  granted_amount numeric(12, 2) check (granted_amount is null or granted_amount >= 0),
  status text not null default 'open' check (status in ('open', 'afgehandeld')),
  extra_info text check (extra_info is null or char_length(extra_info) <= 4000),
  created_at timestamptz not null default now()
);

create index if not exists requests_user_id_idx on public.requests (user_id);
create index if not exists requests_created_at_idx on public.requests (created_at desc);

alter table public.requests enable row level security;

-- Elke medewerker ziet, wijzigt en verwijdert enkel zijn eigen dossiers.
create policy "requests_select_own"
  on public.requests for select
  using (auth.uid() = user_id);

create policy "requests_insert_own"
  on public.requests for insert
  with check (auth.uid() = user_id);

create policy "requests_update_own"
  on public.requests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "requests_delete_own"
  on public.requests for delete
  using (auth.uid() = user_id);

-- Expliciete grants: enkel aangemelde gebruikers (authenticated), geen anonieme toegang.
revoke all on public.requests from anon;
revoke all on public.requests from authenticated;
grant select, insert, update, delete on public.requests to authenticated;
