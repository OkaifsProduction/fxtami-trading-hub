-- Ami Legal Phase 1: klanten en dossiers.
-- Zelfde beveiligingspatroon als requests: RLS aan, vier eigenaar-scoped
-- policies per tabel, expliciete grants (enkel authenticated, geen anon).
--
-- Verwijderbeleid (bewust): klanten.id en dossiers.id worden gerefereerd met
-- "on delete restrict", niet "on delete cascade". Een klant of dossier met
-- nog gekoppelde dossiers/aanvragen kan dus niet per ongeluk mee verwijderd
-- worden — Postgres weigert de delete totdat de onderliggende rijen expliciet
-- weg zijn. Archiveren (in plaats van verwijderen) is het bedoelde toekomstige
-- UX-patroon hiervoor.

create table if not exists public.klanten (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  naam text not null check (char_length(naam) between 1 and 120),
  email text check (email is null or char_length(email) <= 200),
  telefoon text check (telefoon is null or char_length(telefoon) <= 50),
  adres text check (adres is null or char_length(adres) <= 300),
  extra_info text check (extra_info is null or char_length(extra_info) <= 2000),
  created_at timestamptz not null default now()
);

create index if not exists klanten_user_id_idx on public.klanten (user_id);
create index if not exists klanten_naam_idx on public.klanten (naam);

alter table public.klanten enable row level security;

create policy "klanten_select_own"
  on public.klanten for select
  using (auth.uid() = user_id);

create policy "klanten_insert_own"
  on public.klanten for insert
  with check (auth.uid() = user_id);

create policy "klanten_update_own"
  on public.klanten for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "klanten_delete_own"
  on public.klanten for delete
  using (auth.uid() = user_id);

revoke all on public.klanten from anon;
revoke all on public.klanten from authenticated;
grant select, insert, update, delete on public.klanten to authenticated;


create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  klant_id uuid not null references public.klanten (id) on delete restrict,
  titel text not null check (char_length(titel) between 1 and 200),
  omschrijving text check (omschrijving is null or char_length(omschrijving) <= 4000),
  status text not null default 'open' check (status in ('open', 'afgehandeld')),
  created_at timestamptz not null default now()
);

create index if not exists dossiers_user_id_idx on public.dossiers (user_id);
create index if not exists dossiers_klant_id_idx on public.dossiers (klant_id);

alter table public.dossiers enable row level security;

create policy "dossiers_select_own"
  on public.dossiers for select
  using (auth.uid() = user_id);

-- Een dossier mag alleen aan een klant gekoppeld worden die van dezelfde
-- gebruiker is — anders zou iemand (met een geraden klant-UUID) een dossier
-- aan andermans klant kunnen hangen, ook al zien ze die klant nooit terug.
create policy "dossiers_insert_own"
  on public.dossiers for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.klanten k
      where k.id = klant_id and k.user_id = auth.uid()
    )
  );

create policy "dossiers_update_own"
  on public.dossiers for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.klanten k
      where k.id = klant_id and k.user_id = auth.uid()
    )
  );

create policy "dossiers_delete_own"
  on public.dossiers for delete
  using (auth.uid() = user_id);

revoke all on public.dossiers from anon;
revoke all on public.dossiers from authenticated;
grant select, insert, update, delete on public.dossiers to authenticated;
