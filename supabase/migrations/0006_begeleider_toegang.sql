-- Ami Legal: externe begeleider-toegang (fase 1 — uitsluitend lezen).
--
-- Volledig additief: geen enkele bestaande tabel, policy of grant wordt
-- gewijzigd. Twee nieuwe tabellen (begeleider_profiles, dossier_begeleiders)
-- en drie "security definer"-functies vormen de ENIGE toegangsweg voor
-- externe begeleiders. Er komt bewust GEEN RLS-policy op klanten/dossiers/
-- requests die een begeleider rechtstreeks toegang geeft: RLS filtert enkel
-- rijen, niet kolommen — een rechtstreekse policy zou bij een directe
-- API/Supabase-call alle kolommen tonen (e-mail, telefoon, interne notities,
-- omschrijving). De functies hieronder retourneren daarom expliciet enkel
-- de vooraf goedgekeurde, minimale kolommenset.
--
-- Rolmodel: geen aparte "rol"-vlag om te synchroniseren. Of iemand een
-- begeleider is, volgt puur uit het bestaan van een rij in
-- begeleider_profiles (id = auth.uid()). Intern personeel blijft exact
-- zoals nu: volledige toegang tot hun eigen klanten/dossiers/aanvragen via
-- de bestaande policies, die hier niet worden aangeraakt.
--
-- Provisioning: begeleider_profiles en dossier_begeleiders zijn NIET
-- schrijfbaar door "authenticated" (zie grants onderaan elke sectie) —
-- deze rijen worden uitsluitend door intern personeel aangemaakt/gewijzigd
-- via de Supabase service-role (dashboard of admin-script), nooit via de
-- app zelf. Dat sluit zelf-toewijzing/privilege-escalatie door een
-- begeleider volledig uit.

-- ============ begeleider_profiles ============
-- Eén rij per extern account. id = het Supabase Auth user-id van de
-- begeleider zelf (geen apart surrogaatveld), zo is elke check gewoon
-- "id = auth.uid()". "actief" is de account-brede noodstop (los van de
-- per-dossier toewijzingen hieronder) voor volledige offboarding.
create table if not exists public.begeleider_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  naam text not null check (char_length(naam) between 1 and 120),
  organisatie text check (organisatie is null or char_length(organisatie) <= 200),
  actief boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.begeleider_profiles enable row level security;

-- Een begeleider mag enkel zijn eigen profiel lezen (bv. voor een
-- "welkom, Jane"-koptekst in de portal). Geen insert/update/delete-policy.
create policy "begeleider_profiles_select_own"
  on public.begeleider_profiles for select
  using (id = auth.uid());

revoke all on public.begeleider_profiles from anon;
revoke all on public.begeleider_profiles from authenticated;
grant select on public.begeleider_profiles to authenticated;


-- ============ dossier_begeleiders ============
-- Koppeltabel: welke begeleider heeft (actief) toegang tot welk dossier.
-- Many-to-many: één begeleider kan meerdere dossiers krijgen, één dossier
-- kan in theorie meerdere begeleiders hebben.
--
-- "on delete cascade" op beide kolommen is bewust anders dan het
-- "on delete restrict"-patroon van klanten/dossiers/requests: deze tabel is
-- pure toegangsmetadata, geen inhoudelijk dossierstuk. Verdwijnt het
-- dossier of het begeleider-profiel, dan hoort de toewijzing gewoon mee te
-- verdwijnen — geen weesrijen, geen verweesde toegang.
--
-- "actief" + "revoked_at": intrekken gebeurt door actief=false te zetten,
-- niet door de rij te verwijderen — zo blijft een spoor bewaard van wie
-- ooit toegang had tot welk dossier, en wanneer dat werd ingetrokken.
create table if not exists public.dossier_begeleiders (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers (id) on delete cascade,
  begeleider_id uuid not null references public.begeleider_profiles (id) on delete cascade,
  actief boolean not null default true,
  toegekend_door uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (dossier_id, begeleider_id)
);

create index if not exists dossier_begeleiders_begeleider_actief_idx
  on public.dossier_begeleiders (begeleider_id, actief);
create index if not exists dossier_begeleiders_dossier_idx
  on public.dossier_begeleiders (dossier_id);

alter table public.dossier_begeleiders enable row level security;

-- Bewust GEEN enkele policy voor "authenticated": deze tabel is nooit
-- rechtstreeks bevraagbaar via de app of door de begeleider zelf.
-- Toewijzingen beheert intern personeel via de service-role; begeleiders
-- "zien" het resultaat ervan uitsluitend indirect, via de functies
-- hieronder.
revoke all on public.dossier_begeleiders from anon;
revoke all on public.dossier_begeleiders from authenticated;


-- ============ Automatische intrekking bij sluiting ============
-- Zodra een dossier op status 'gesloten' gezet wordt, verliest elke
-- actieve begeleider-toewijzing op dat dossier meteen zijn toegang. Dit is
-- een harde garantie via trigger, geen los stapje dat intern personeel
-- apart moet onthouden. Andere, nog actieve toewijzingen van diezelfde
-- begeleider op andere dossiers blijven onaangeroerd.
create or replace function public.trg_dossier_gesloten_intrekken_begeleiders()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if new.status = 'gesloten' and old.status is distinct from 'gesloten' then
    update public.dossier_begeleiders
    set actief = false, revoked_at = now()
    where dossier_id = new.id and actief = true;
  end if;
  return new;
end;
$$;

drop trigger if exists dossier_gesloten_intrekken_begeleiders on public.dossiers;
create trigger dossier_gesloten_intrekken_begeleiders
  after update of status on public.dossiers
  for each row
  execute function public.trg_dossier_gesloten_intrekken_begeleiders();


-- ============ Externe leesfuncties (enige toegangsweg voor begeleiders) ============
-- "security definer" + een expliciete auth.uid()-check binnenin: de functie
-- draait met verhoogde rechten om over klanten/dossiers/requests heen te
-- kunnen lezen (die tabellen hebben geen policy die een begeleider ooit
-- toelaat), maar retourneert zelf uitsluitend rijen waarvoor de aanroepende
-- gebruiker een actieve toewijzing heeft ÉN een actief begeleider-profiel,
-- en uitsluitend de vooraf goedgekeurde, minimale kolommen.
-- "set search_path" voorkomt search-path-hijacking van deze
-- verhoogde-rechten-functies (vaste Postgres-beveiligingspraktijk voor
-- security definer).

-- "Mijn dossiers"-overzicht.
create or replace function public.begeleider_mijn_dossiers()
returns table (
  dossier_id uuid,
  klant_naam text,
  dossier_titel text,
  dossier_status text,
  dossier_aangemaakt timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    d.id,
    k.naam,
    d.titel,
    d.status,
    d.created_at
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  join public.dossiers d on d.id = db.dossier_id
  join public.klanten k on k.id = d.klant_id
  where db.begeleider_id = auth.uid()
    and db.actief = true
    and bp.actief = true;
$$;

revoke all on function public.begeleider_mijn_dossiers() from public;
grant execute on function public.begeleider_mijn_dossiers() to authenticated;


-- Detail van één dossier — retourneert niets als er geen actieve
-- toewijzing bestaat voor deze gebruiker op dit dossier (geen foutmelding
-- die het bestaan van het dossier zou verklappen, gewoon een lege rij-set).
create or replace function public.begeleider_dossier_detail(p_dossier_id uuid)
returns table (
  dossier_id uuid,
  klant_naam text,
  dossier_titel text,
  dossier_status text,
  dossier_aangemaakt timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    d.id,
    k.naam,
    d.titel,
    d.status,
    d.created_at
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  join public.dossiers d on d.id = db.dossier_id
  join public.klanten k on k.id = d.klant_id
  where db.begeleider_id = auth.uid()
    and db.actief = true
    and bp.actief = true
    and d.id = p_dossier_id;
$$;

revoke all on function public.begeleider_dossier_detail(uuid) from public;
grant execute on function public.begeleider_dossier_detail(uuid) to authenticated;


-- Aanvragen binnen dat dossier — enkel status + bedragen, geen extra_info.
create or replace function public.begeleider_dossier_aanvragen(p_dossier_id uuid)
returns table (
  aanvraag_id uuid,
  requested_amount numeric,
  granted_amount numeric,
  status text,
  aangemaakt timestamptz
)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select
    r.id,
    r.requested_amount,
    r.granted_amount,
    r.status,
    r.created_at
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  join public.requests r on r.dossier_id = db.dossier_id
  where db.begeleider_id = auth.uid()
    and db.actief = true
    and bp.actief = true
    and db.dossier_id = p_dossier_id
  order by r.created_at desc;
$$;

revoke all on function public.begeleider_dossier_aanvragen(uuid) from public;
grant execute on function public.begeleider_dossier_aanvragen(uuid) to authenticated;
