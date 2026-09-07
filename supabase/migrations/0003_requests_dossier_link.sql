-- Ami Legal Phase 1: koppel aanvragen aan dossiers.
--
-- dossier_id is voorlopig NULLABLE en de oude "name"/"purpose" kolommen
-- blijven bestaan (nu ook nullable) als veilig terugvalmechanisme. Ze worden
-- pas in een latere migratie (0004, nog niet aangemaakt) verwijderd, nadat de
-- nieuwe structuur in productie getest en bevestigd is. Deze migratie zelf
-- verwijdert of overschrijft geen bestaande kolommen — enkel toevoegen en
-- backfillen.

alter table public.requests
  add column if not exists dossier_id uuid references public.dossiers (id) on delete restrict;

create index if not exists requests_dossier_id_idx on public.requests (dossier_id);

-- Backfill: elke bestaande aanvraag zonder dossier_id krijgt een nieuwe klant
-- (naam = requests.name) en een nieuw dossier (titel = requests.purpose,
-- status = requests.status), gekoppeld aan dezelfde eigenaar (user_id) als de
-- aanvraag zelf. Elke aanvraag krijgt zijn eigen klant+dossier — er wordt niet
-- geprobeerd rijen met dezelfde naam samen te voegen, om te garanderen dat
-- geen enkele bestaande aanvraag verloren gaat of per ongeluk aan de
-- verkeerde klant gekoppeld wordt. Dit dekt o.a. de bestaande productierij
-- "Janssen Danny" / "Terugreis van Marokko".
do $$
declare
  r record;
  new_klant_id uuid;
  new_dossier_id uuid;
begin
  for r in
    select id, user_id, name, purpose, status
    from public.requests
    where dossier_id is null
  loop
    insert into public.klanten (user_id, naam)
    values (r.user_id, r.name)
    returning id into new_klant_id;

    insert into public.dossiers (user_id, klant_id, titel, status)
    values (r.user_id, new_klant_id, r.purpose, r.status)
    returning id into new_dossier_id;

    update public.requests
    set dossier_id = new_dossier_id
    where id = r.id;
  end loop;
end $$;

-- Na de backfill hierboven heeft elke bestaande rij een dossier_id. Nieuwe
-- aanvragen worden vanaf nu via de applicatie altijd met een dossier_id
-- aangemaakt, dus "name"/"purpose" hoeven niet langer verplicht te zijn.
alter table public.requests
  alter column name drop not null,
  alter column purpose drop not null;

-- dossier_id mag alleen verwijzen naar een dossier van dezelfde gebruiker.
drop policy if exists "requests_insert_own" on public.requests;
create policy "requests_insert_own"
  on public.requests for insert
  with check (
    auth.uid() = user_id
    and (
      dossier_id is null
      or exists (
        select 1 from public.dossiers d
        where d.id = dossier_id and d.user_id = auth.uid()
      )
    )
  );

drop policy if exists "requests_update_own" on public.requests;
create policy "requests_update_own"
  on public.requests for update
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and (
      dossier_id is null
      or exists (
        select 1 from public.dossiers d
        where d.id = dossier_id and d.user_id = auth.uid()
      )
    )
  );
