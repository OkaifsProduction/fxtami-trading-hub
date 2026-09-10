-- Ami Legal: begeleidersbeheer vanuit de interne app (fase 2).
--
-- UITGANGSPUNT: de begeleider-beveiliging uit 0006/0007 is getest en werkt.
-- Deze migratie raakt daar niets van aan. Onaangeroerd blijven:
--   - begeleider_mijn_dossiers(), begeleider_dossier_detail(uuid),
--     begeleider_dossier_aanvragen(uuid)  — geen enkele regel gewijzigd
--   - de trigger dossier_gesloten_intrekken_begeleiders
--   - policy "begeleider_profiles_select_own"
--   - alle policies op klanten / dossiers / requests
--   - de kolom begeleider_profiles.actief, die alle drie de functies
--     controleren — semantiek blijft exact hetzelfde
-- Er komt uitsluitend een SCHRIJFWEG bij voor intern personeel, plus een
-- uitnodigingsspoor. Volledig additief.
--
-- WAAROM EEN APARTE UITNODIGINGSTABEL
-- begeleider_profiles.id is de primary key én een foreign key naar
-- auth.users(id). Een profiel kan dus per definitie pas bestaan nadat het
-- Auth-account bestaat. Een "uitgenodigd maar nog niet geactiveerd"-begeleider
-- past daar niet in. Die primary key veranderen zou het hart raken van de
-- werkende beveiliging (de functies matchen op begeleider_id = auth.uid()).
-- Daarom een aparte tabel voor uitnodigingen, en blijft begeleider_profiles
-- exact wat het is: de lijst van échte, bestaande begeleideraccounts.
--
-- ROLMODEL
-- Tot nu toe was "intern" een negatie: iedereen zonder begeleider-profiel.
-- Dat is onhoudbaar zodra intern personeel schrijfrechten krijgt (één stray
-- account = volledig begeleidersbeheer). Hier komt een positieve tabel
-- intern_personeel + is_intern(). Een latere rol BESCHERMDE_PERSOON volgt
-- exact hetzelfde patroon: één tabel + één is_x()-functie, zonder dat er iets
-- bestaands herbouwd moet worden. Die rol wordt hier NIET gebouwd.
--
-- GRANTS
-- Migratie 0007 leerde dat Supabase via "alter default privileges" standaard
-- rechten geeft aan zowel anon als authenticated, en dat "revoke from public"
-- dat niet dekt. Elke tabel en functie hieronder trekt daarom expliciet in
-- bij anon én authenticated, en kent daarna gericht toe.


-- ============ intern_personeel ============
-- Positieve, expliciete lijst van interne Ami Legal-medewerkers.
-- id = het Supabase Auth user-id, zelfde patroon als begeleider_profiles.
--
-- RLS aan met BEWUST NUL policies en NUL grants — precies zoals
-- dossier_begeleiders. De tabel is dus nooit rechtstreeks bevraagbaar, ook
-- niet door intern personeel zelf. De enige weg erlangs is is_intern()
-- hieronder, die enkel een boolean over de aanroeper zelf teruggeeft en dus
-- niets over collega's prijsgeeft.
create table if not exists public.intern_personeel (
  id uuid primary key references auth.users (id) on delete cascade,
  naam text not null check (char_length(naam) between 1 and 200),
  actief boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.intern_personeel enable row level security;

revoke all on public.intern_personeel from anon;
revoke all on public.intern_personeel from authenticated;


-- Centrale rolcheck. "security definer" omdat intern_personeel zelf
-- onbereikbaar is voor authenticated; "stable" zodat Postgres het resultaat
-- binnen één query mag hergebruiken (deze functie komt in elke policy
-- hieronder voor); "set search_path" tegen search-path-hijacking.
create or replace function public.is_intern()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.intern_personeel ip
    where ip.id = auth.uid()
      and ip.actief = true
  );
$$;

revoke execute on function public.is_intern() from anon;
revoke execute on function public.is_intern() from authenticated;
grant execute on function public.is_intern() to authenticated;


-- ============ Seeding van het bestaande interne account ============
-- Geen e-mailadres hardgecodeerd: intern personeel is af te leiden uit de
-- productiedata zelf — het zijn de accounts die vandaag al klanten, dossiers
-- of aanvragen bezitten (klanten.user_id enz.), en die geen begeleider zijn.
-- Dat is per definitie exact de huidige interne gebruiker.
--
-- De "raise exception" is een veiligheidsrem: zonder geseede rij zou
-- is_intern() voor iedereen false teruggeven en zou de interne app na de
-- frontend-deploy voor niemand meer toegankelijk zijn. Dan stopt deze
-- migratie liever luid, vóórdat er iets gewijzigd is.
do $$
declare
  v_aantal integer;
begin
  insert into public.intern_personeel (id, naam)
  select u.id, coalesce(u.email, 'Intern personeel')
  from auth.users u
  where u.id in (
      select user_id from public.klanten
      union
      select user_id from public.dossiers
      union
      select user_id from public.requests
    )
    and not exists (
      select 1 from public.begeleider_profiles bp where bp.id = u.id
    )
  on conflict (id) do nothing;

  select count(*) into v_aantal from public.intern_personeel;

  if v_aantal = 0 then
    raise exception
      'Geen intern account gevonden om te seeden. Er is blijkbaar nog geen '
      'gebruiker die klanten/dossiers/aanvragen bezit. Voeg de interne '
      'gebruiker handmatig toe aan public.intern_personeel voordat de '
      'frontend gedeployed wordt, anders is de interne app voor niemand '
      'toegankelijk.';
  end if;

  raise notice 'intern_personeel bevat nu % rij(en).', v_aantal;
end $$;


-- ============ begeleider_profiles: weergavevelden ============
-- Alle drie nullable en zonder default: geen enkele bestaande rij verandert
-- van betekenis, en de bestaande functies (die enkel naam/organisatie/actief
-- gebruiken) merken hier niets van.
--
-- "email" is een gedenormaliseerde weergavekopie. De autoriteit blijft
-- auth.users.email; deze kopie wordt bij activatie daaruit overgenomen en
-- dient enkel om de lijst te kunnen tonen (de app mag auth.users niet lezen).
alter table public.begeleider_profiles
  add column if not exists email text
    check (email is null or (email = lower(email) and char_length(email) <= 200)),
  add column if not exists uitgenodigd_at timestamptz,
  add column if not exists geactiveerd_at timestamptz;

-- Bestaande profielen zijn per definitie al geactiveerd (ze bestaan alleen
-- omdat het Auth-account bestaat). Zonder deze backfill zou de nieuwe lijst
-- ze als "Uitgenodigd" tonen, wat feitelijk onjuist is. E-mail wordt
-- meegenomen uit auth.users, zodat de bestaande testbegeleider meteen
-- correct in het overzicht staat.
update public.begeleider_profiles bp
set geactiveerd_at = coalesce(bp.geactiveerd_at, bp.created_at),
    email = coalesce(bp.email, lower(u.email))
from auth.users u
where u.id = bp.id
  and (bp.geactiveerd_at is null or bp.email is null);

-- Intern personeel mag de begeleiderslijst zien en beheren. De bestaande
-- policy "begeleider_profiles_select_own" blijft naast deze staan: policies
-- van hetzelfde commando worden met OR gecombineerd, dus een begeleider
-- behoudt exact de toegang die hij vandaag heeft (enkel zijn eigen rij).
drop policy if exists "begeleider_profiles_select_intern" on public.begeleider_profiles;
create policy "begeleider_profiles_select_intern"
  on public.begeleider_profiles for select
  using (public.is_intern());

-- Update dient om te deactiveren/heractiveren en om naam/organisatie te
-- corrigeren. Geen insert-policy: profielen ontstaan uitsluitend via
-- begeleider_activeer_mijn_account() hieronder, nooit rechtstreeks vanuit de
-- app. Geen delete-policy: offboarden gebeurt met actief = false, want een
-- verwijderd profiel zou de betrokkene terug naar "geen begeleider" duwen.
drop policy if exists "begeleider_profiles_update_intern" on public.begeleider_profiles;
create policy "begeleider_profiles_update_intern"
  on public.begeleider_profiles for update
  using (public.is_intern())
  with check (public.is_intern());

-- De revoke/grant hieronder reproduceert exact de bestaande situatie uit 0006
-- (enkel select) en voegt daar een KOLOM-gebonden update aan toe. Zelfs met de
-- policy hierboven kan een client dus nooit id, email of de tijdstempels
-- aanpassen — enkel deze drie velden.
revoke all on public.begeleider_profiles from anon;
revoke all on public.begeleider_profiles from authenticated;
grant select on public.begeleider_profiles to authenticated;
grant update (naam, organisatie, actief) on public.begeleider_profiles to authenticated;


-- ============ dossier_begeleiders: schrijfweg voor intern personeel ============
-- Deze tabel had bewust nul policies: toewijzen gebeurde tot nu toe enkel via
-- de service-role in de SQL-editor. Daar komt nu een strak afgebakende weg
-- voor intern personeel bij. Voor de begeleider zelf verandert er niets: er
-- komt geen enkele policy die op auth.uid() = begeleider_id matcht, dus de
-- tabel blijft voor hem volledig onbereikbaar.
--
-- De eigendomscheck op dossiers zit in elke policy: een toewijzing kan alleen
-- gemaakt of gewijzigd worden voor een dossier dat van de aanroeper zelf is.
-- Vandaag is er één intern account, maar hiermee kan een tweede interne
-- medewerker later nooit via een geraden UUID aan andermans dossier komen.
-- Default op een bestaande, nullable kolom: verandert geen enkele bestaande
-- rij en geen enkel bestaand codepad (de activatiefunctie vult de waarde zelf
-- expliciet in). Hierdoor hoeft de app het veld nooit mee te sturen, en kan
-- ze het dus ook niet vervalsen — de policy hieronder eist immers dat het
-- gelijk is aan auth.uid().
alter table public.dossier_begeleiders
  alter column toegekend_door set default auth.uid();

drop policy if exists "dossier_begeleiders_select_intern" on public.dossier_begeleiders;
create policy "dossier_begeleiders_select_intern"
  on public.dossier_begeleiders for select
  using (
    public.is_intern()
    and exists (
      select 1 from public.dossiers d
      where d.id = dossier_id and d.user_id = auth.uid()
    )
  );

-- "toegekend_door = auth.uid()" wordt hier afgedwongen in plaats van
-- overgelaten aan de client: anders zou een toewijzing op naam van iemand
-- anders geschreven kunnen worden, wat het auditspoor waardeloos maakt.
drop policy if exists "dossier_begeleiders_insert_intern" on public.dossier_begeleiders;
create policy "dossier_begeleiders_insert_intern"
  on public.dossier_begeleiders for insert
  with check (
    public.is_intern()
    and toegekend_door = auth.uid()
    and exists (
      select 1 from public.dossiers d
      where d.id = dossier_id and d.user_id = auth.uid()
    )
    and exists (
      select 1 from public.begeleider_profiles bp where bp.id = begeleider_id
    )
  );

-- Intrekken = actief op false zetten (met revoked_at), niet verwijderen, zodat
-- traceerbaar blijft wie ooit toegang had. Vandaar update en geen delete.
drop policy if exists "dossier_begeleiders_update_intern" on public.dossier_begeleiders;
create policy "dossier_begeleiders_update_intern"
  on public.dossier_begeleiders for update
  using (
    public.is_intern()
    and exists (
      select 1 from public.dossiers d
      where d.id = dossier_id and d.user_id = auth.uid()
    )
  )
  with check (
    public.is_intern()
    and exists (
      select 1 from public.dossiers d
      where d.id = dossier_id and d.user_id = auth.uid()
    )
  );

revoke all on public.dossier_begeleiders from anon;
revoke all on public.dossier_begeleiders from authenticated;
grant select, insert on public.dossier_begeleiders to authenticated;
grant update (actief, revoked_at) on public.dossier_begeleiders to authenticated;


-- ============ begeleider_uitnodigingen ============
-- Een uitnodiging bestaat vóór het Auth-account. Zodra de uitgenodigde
-- persoon voor het eerst inlogt, wordt ze omgezet in een echt
-- begeleider_profiles-record (zie de activatiefunctie onderaan).
--
-- Bewust geen enkele policy voor de begeleider zelf: deze tabel bevat de
-- e-mailadressen van alle uitgenodigde organisaties. Enkel intern personeel
-- kan hem lezen; de uitgenodigde raakt er uitsluitend indirect aan, via de
-- security definer-activatiefunctie.
create table if not exists public.begeleider_uitnodigingen (
  id uuid primary key default gen_random_uuid(),
  email text not null
    check (email = lower(email) and char_length(email) between 3 and 200),
  naam text not null check (char_length(naam) between 1 and 120),
  organisatie text check (organisatie is null or char_length(organisatie) <= 200),
  status text not null default 'open'
    check (status in ('open', 'geaccepteerd', 'ingetrokken')),
  aangemaakt_door uuid not null default auth.uid() references auth.users (id) on delete cascade,
  begeleider_id uuid references public.begeleider_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  geaccepteerd_at timestamptz
);

-- Partieel uniek: hooguit één OPENSTAANDE uitnodiging per e-mailadres, maar
-- iemand die ooit uitgenodigd en later ingetrokken werd, kan opnieuw
-- uitgenodigd worden. Een gewone unique zou dat blokkeren.
create unique index if not exists begeleider_uitnodigingen_open_email_idx
  on public.begeleider_uitnodigingen (email)
  where status = 'open';

create index if not exists begeleider_uitnodigingen_status_idx
  on public.begeleider_uitnodigingen (status);

alter table public.begeleider_uitnodigingen enable row level security;

drop policy if exists "begeleider_uitnodigingen_select_intern" on public.begeleider_uitnodigingen;
create policy "begeleider_uitnodigingen_select_intern"
  on public.begeleider_uitnodigingen for select
  using (public.is_intern());

drop policy if exists "begeleider_uitnodigingen_insert_intern" on public.begeleider_uitnodigingen;
create policy "begeleider_uitnodigingen_insert_intern"
  on public.begeleider_uitnodigingen for insert
  with check (public.is_intern() and aangemaakt_door = auth.uid());

-- Enkel om in te trekken (status -> 'ingetrokken'). De overgang naar
-- 'geaccepteerd' gebeurt uitsluitend in de activatiefunctie.
drop policy if exists "begeleider_uitnodigingen_update_intern" on public.begeleider_uitnodigingen;
create policy "begeleider_uitnodigingen_update_intern"
  on public.begeleider_uitnodigingen for update
  using (public.is_intern())
  with check (public.is_intern());

revoke all on public.begeleider_uitnodigingen from anon;
revoke all on public.begeleider_uitnodigingen from authenticated;
grant select, insert on public.begeleider_uitnodigingen to authenticated;
grant update (status) on public.begeleider_uitnodigingen to authenticated;


-- ============ uitnodiging_dossiers ============
-- De dossiers die intern personeel bij het uitnodigen alvast aanvinkt. Ze
-- worden pas echte toewijzingen (rijen in dossier_begeleiders) op het moment
-- dat de begeleider zijn account activeert. Tot dan bestaat er dus nog geen
-- enkele toegang — een uitnodiging alleen geeft niets.
create table if not exists public.uitnodiging_dossiers (
  id uuid primary key default gen_random_uuid(),
  uitnodiging_id uuid not null
    references public.begeleider_uitnodigingen (id) on delete cascade,
  dossier_id uuid not null references public.dossiers (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (uitnodiging_id, dossier_id)
);

create index if not exists uitnodiging_dossiers_uitnodiging_idx
  on public.uitnodiging_dossiers (uitnodiging_id);

alter table public.uitnodiging_dossiers enable row level security;

-- Zowel de uitnodiging als het dossier moeten van de aanroeper zijn.
drop policy if exists "uitnodiging_dossiers_select_intern" on public.uitnodiging_dossiers;
create policy "uitnodiging_dossiers_select_intern"
  on public.uitnodiging_dossiers for select
  using (
    public.is_intern()
    and exists (
      select 1 from public.begeleider_uitnodigingen bu
      where bu.id = uitnodiging_id and bu.aangemaakt_door = auth.uid()
    )
  );

drop policy if exists "uitnodiging_dossiers_insert_intern" on public.uitnodiging_dossiers;
create policy "uitnodiging_dossiers_insert_intern"
  on public.uitnodiging_dossiers for insert
  with check (
    public.is_intern()
    and exists (
      select 1 from public.begeleider_uitnodigingen bu
      where bu.id = uitnodiging_id and bu.aangemaakt_door = auth.uid()
    )
    and exists (
      select 1 from public.dossiers d
      where d.id = dossier_id and d.user_id = auth.uid()
    )
  );

-- Hier mag delete wél: dit is voorbereidend staging-materiaal van vóór de
-- activatie, geen toegangshistoriek. Een vergissing bij het aanvinken moet
-- gewoon weggehaald kunnen worden.
drop policy if exists "uitnodiging_dossiers_delete_intern" on public.uitnodiging_dossiers;
create policy "uitnodiging_dossiers_delete_intern"
  on public.uitnodiging_dossiers for delete
  using (
    public.is_intern()
    and exists (
      select 1 from public.begeleider_uitnodigingen bu
      where bu.id = uitnodiging_id and bu.aangemaakt_door = auth.uid()
    )
  );

revoke all on public.uitnodiging_dossiers from anon;
revoke all on public.uitnodiging_dossiers from authenticated;
grant select, insert, delete on public.uitnodiging_dossiers to authenticated;


-- ============ Activatie door de begeleider zelf ============
-- Wordt aangeroepen door de uitgenodigde persoon na zijn eerste login. Draait
-- als "security definer" omdat hij in tabellen moet schrijven die voor hem
-- volstrekt onbereikbaar zijn (begeleider_profiles, dossier_begeleiders,
-- begeleider_uitnodigingen).
--
-- WAAROM DIT VEILIG IS
-- De functie vertrouwt geen enkele parameter — ze heeft er ook geen. Het
-- e-mailadres wordt uit auth.users gehaald op basis van auth.uid(), dus uit
-- de door Supabase Auth geverifieerde sessie, niet uit iets wat de client
-- meestuurt. Er is dus geen enkele manier om de uitnodiging van iemand anders
-- te claimen.
--
-- email_confirmed_at moet bovendien gezet zijn. Zonder die controle zou
-- iemand die zelf een account aanmaakt op een uitgenodigd adres, zonder ooit
-- toegang tot die mailbox te hebben, de uitnodiging kunnen inpikken. Dit
-- werkt ook als de projectinstellingen ooit onbedoeld self-signup toelaten.
--
-- Geeft true terug als er iets geactiveerd is, anders false. Nooit een
-- foutmelding die verklapt of een e-mailadres wel of niet uitgenodigd is.
create or replace function public.begeleider_activeer_mijn_account()
returns boolean
language plpgsql
security definer
volatile
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_bevestigd timestamptz;
  v_uitnodiging public.begeleider_uitnodigingen%rowtype;
begin
  if v_uid is null then
    return false;
  end if;

  select lower(u.email), u.email_confirmed_at
    into v_email, v_bevestigd
  from auth.users u
  where u.id = v_uid;

  if v_email is null or v_bevestigd is null then
    return false;
  end if;

  select * into v_uitnodiging
  from public.begeleider_uitnodigingen
  where email = v_email
    and status = 'open'
  limit 1;

  if not found then
    return false;
  end if;

  -- Het profiel. "on conflict" dekt het geval waarin er al een profiel
  -- bestaat (bv. handmatig aangemaakt via de SQL-editor, zoals de
  -- testbegeleider): dan wordt dat profiel gerespecteerd en enkel aangevuld,
  -- nooit gedeactiveerd of overschreven.
  insert into public.begeleider_profiles
    (id, naam, organisatie, email, uitgenodigd_at, geactiveerd_at, actief)
  values
    (v_uid, v_uitnodiging.naam, v_uitnodiging.organisatie, v_email,
     v_uitnodiging.created_at, now(), true)
  on conflict (id) do update
    set email = coalesce(begeleider_profiles.email, excluded.email),
        uitgenodigd_at = coalesce(begeleider_profiles.uitgenodigd_at, excluded.uitgenodigd_at),
        geactiveerd_at = coalesce(begeleider_profiles.geactiveerd_at, excluded.geactiveerd_at);

  -- De aangevinkte dossiers worden nu pas echte toewijzingen. Dossiers die
  -- intussen verdwenen zijn, vallen weg via de cascade op uitnodiging_dossiers.
  insert into public.dossier_begeleiders
    (dossier_id, begeleider_id, actief, toegekend_door)
  select ud.dossier_id, v_uid, true, v_uitnodiging.aangemaakt_door
  from public.uitnodiging_dossiers ud
  where ud.uitnodiging_id = v_uitnodiging.id
  on conflict (dossier_id, begeleider_id) do update
    set actief = true,
        revoked_at = null;

  update public.begeleider_uitnodigingen
  set status = 'geaccepteerd',
      geaccepteerd_at = now(),
      begeleider_id = v_uid
  where id = v_uitnodiging.id;

  return true;
end;
$$;

revoke execute on function public.begeleider_activeer_mijn_account() from anon;
revoke execute on function public.begeleider_activeer_mijn_account() from authenticated;
grant execute on function public.begeleider_activeer_mijn_account() to authenticated;
