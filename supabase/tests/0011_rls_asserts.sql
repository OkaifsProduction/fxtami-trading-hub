-- Ami Legal: securitytests voor begeleidersbeheer (migratie 0011).
--
-- HOE UITVOEREN
-- Plak dit volledige bestand in de Supabase SQL Editor en voer het uit,
-- NADAT 0011 gedraaid heeft. Het script eindigt met ROLLBACK: alles wat het
-- onderweg schrijft (deactiveren, dubbele toewijzing proberen) wordt weer
-- teruggedraaid. Er blijft dus niets van achter in de productiedata.
--
-- Elke test doet zich voor als een echte gebruiker via "set local role" plus
-- de bijbehorende JWT-claims, precies zoals PostgREST dat doet bij een
-- API-aanroep. Daarmee test dit de database zelf — de laag waar de
-- beveiliging werkelijk zit — en niet de frontend-routing.
--
-- Elk blok zoekt zijn eigen ids op terwijl het nog als postgres draait, en
-- wisselt pas daarna van rol. Bewust geen gedeelde temp-tabel: na "set role"
-- is het temp-schema niet betrouwbaar toegankelijk.
--
-- Bij succes zie je enkel "OK"-meldingen. Eén enkele "FAAL" stopt het script.

begin;

-- ============ 0. Voorwaarden ============
do $$
declare
  v_intern uuid;
  v_begeleider uuid;
  v_dossier uuid;
  v_ander uuid;
begin
  select ip.id into v_intern from public.intern_personeel ip where ip.actief limit 1;

  select db.begeleider_id, db.dossier_id into v_begeleider, v_dossier
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief
  limit 1;

  select d.id into v_ander
  from public.dossiers d
  where not exists (
    select 1 from public.dossier_begeleiders db
    where db.dossier_id = d.id and db.actief
  )
  limit 1;

  if v_intern is null then
    raise exception 'Geen actief intern account gevonden — is migratie 0011 uitgevoerd?';
  end if;
  if v_begeleider is null then
    raise exception 'Geen actieve begeleider met een toegewezen dossier gevonden. Voer eerst 0008 uit, of nodig een begeleider uit en laat die activeren.';
  end if;

  raise notice 'Context OK. Niet-toegewezen dossier beschikbaar: %',
    coalesce(v_ander::text, 'nee — test 7b wordt overgeslagen');
end $$;


-- ============ 1-3. Begeleider ziet geen enkele interne tabelrij ============
do $$
declare
  v_begeleider uuid;
  v_klanten int; v_dossiers int; v_requests int;
begin
  select db.begeleider_id into v_begeleider
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_begeleider, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  select count(*) into v_klanten from public.klanten;
  select count(*) into v_dossiers from public.dossiers;
  select count(*) into v_requests from public.requests;

  execute 'reset role';

  if v_klanten <> 0 then raise exception 'FAAL 1: begeleider ziet % klantrijen', v_klanten; end if;
  if v_dossiers <> 0 then raise exception 'FAAL 2: begeleider ziet % dossierrijen', v_dossiers; end if;
  if v_requests <> 0 then raise exception 'FAAL 3: begeleider ziet % aanvraagrijen', v_requests; end if;
  raise notice 'OK 1-3: begeleider ziet 0 klanten, 0 dossiers, 0 aanvragen (lijstpunt 8)';
end $$;


-- ============ 4-5. Begeleider kan de beheertabellen niet lezen ============
do $$
declare
  v_begeleider uuid;
  v_toewijzingen int; v_uitnodigingen int; v_is_intern boolean;
begin
  select db.begeleider_id into v_begeleider
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_begeleider, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  select count(*) into v_toewijzingen from public.dossier_begeleiders;
  select count(*) into v_uitnodigingen from public.begeleider_uitnodigingen;
  select public.is_intern() into v_is_intern;

  execute 'reset role';

  if v_toewijzingen <> 0 then raise exception 'FAAL 4: begeleider ziet % toewijzingen', v_toewijzingen; end if;
  if v_uitnodigingen <> 0 then raise exception 'FAAL 4: begeleider ziet % uitnodigingen', v_uitnodigingen; end if;
  if v_is_intern then raise exception 'FAAL 5: is_intern() geeft true voor een begeleider'; end if;
  raise notice 'OK 4-5: begeleider ziet geen toewijzingen/uitnodigingen en is niet intern (lijstpunt 1)';
end $$;


-- ============ 6. intern_personeel is voor niemand rechtstreeks leesbaar ============
do $$
declare
  v_begeleider uuid;
  v_geweigerd boolean := false;
begin
  select db.begeleider_id into v_begeleider
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_begeleider, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  begin
    perform 1 from public.intern_personeel;
  exception when insufficient_privilege then
    v_geweigerd := true;
  end;

  execute 'reset role';

  if not v_geweigerd then raise exception 'FAAL 6: intern_personeel is leesbaar voor authenticated'; end if;
  raise notice 'OK 6: intern_personeel wordt geweigerd (geen grant, geen policy)';
end $$;


-- ============ 7. Directe UUID naar een niet-toegewezen dossier ============
-- De kern van de begeleiderbeveiliging: het toegewezen dossier komt door, elk
-- ander dossier geeft een lege rij-set — geen foutmelding, dus ook geen hint
-- dat dat dossier bestaat.
do $$
declare
  v_begeleider uuid; v_dossier uuid; v_ander uuid;
  v_eigen int; v_andere int; v_andere_aanvragen int;
begin
  select db.begeleider_id, db.dossier_id into v_begeleider, v_dossier
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  select d.id into v_ander
  from public.dossiers d
  where not exists (
    select 1 from public.dossier_begeleiders db
    where db.dossier_id = d.id and db.actief
  )
  limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_begeleider, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  select count(*) into v_eigen from public.begeleider_dossier_detail(v_dossier);

  if v_ander is not null then
    select count(*) into v_andere from public.begeleider_dossier_detail(v_ander);
    select count(*) into v_andere_aanvragen from public.begeleider_dossier_aanvragen(v_ander);
  end if;

  execute 'reset role';

  if v_eigen <> 1 then raise exception 'FAAL 7a: toegewezen dossier geeft % rijen i.p.v. 1', v_eigen; end if;
  raise notice 'OK 7a: begeleider ziet zijn toegewezen dossier (lijstpunt 5)';

  if v_ander is null then
    raise notice 'OVERGESLAGEN 7b: er is geen niet-toegewezen dossier om mee te testen';
  else
    if v_andere <> 0 then raise exception 'FAAL 7b: niet-toegewezen dossier geeft % rijen', v_andere; end if;
    if v_andere_aanvragen <> 0 then raise exception 'FAAL 7b: aanvragen van een niet-toegewezen dossier geven % rijen', v_andere_aanvragen; end if;
    raise notice 'OK 7b: directe UUID naar een ander dossier geeft niets (lijstpunten 6 en 7)';
  end if;
end $$;


-- ============ 8. Begeleider kan zichzelf geen toegang geven ============
do $$
declare
  v_begeleider uuid; v_dossier uuid; v_ander uuid;
  v_geweigerd boolean := false; v_gewijzigd int;
begin
  select db.begeleider_id, db.dossier_id into v_begeleider, v_dossier
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  select d.id into v_ander
  from public.dossiers d
  where not exists (
    select 1 from public.dossier_begeleiders db
    where db.dossier_id = d.id and db.actief
  )
  limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_begeleider, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  begin
    insert into public.dossier_begeleiders (dossier_id, begeleider_id, actief)
    values (coalesce(v_ander, v_dossier), v_begeleider, true);
  exception when insufficient_privilege or check_violation or unique_violation then
    v_geweigerd := true;
  end;

  -- Zichzelf heractiveren moet eveneens onmogelijk zijn: de eigen-rij-policy
  -- op begeleider_profiles geldt uitsluitend voor select, dus de update raakt
  -- nul rijen in plaats van te slagen.
  with poging as (
    update public.begeleider_profiles set actief = true
    where id = v_begeleider
    returning 1
  )
  select count(*) into v_gewijzigd from poging;

  execute 'reset role';

  if not v_geweigerd then raise exception 'FAAL 8a: begeleider kon zichzelf een dossier toewijzen'; end if;
  if v_gewijzigd <> 0 then raise exception 'FAAL 8b: begeleider kon zijn eigen profiel wijzigen'; end if;
  raise notice 'OK 8: begeleider kan zichzelf geen toegang geven en zijn eigen profiel niet wijzigen';
end $$;


-- ============ 9. Intern personeel heeft wél beheertoegang ============
do $$
declare
  v_intern uuid; v_is_intern boolean; v_profielen int;
begin
  select ip.id into v_intern from public.intern_personeel ip where ip.actief limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_intern, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  select public.is_intern() into v_is_intern;
  select count(*) into v_profielen from public.begeleider_profiles;

  execute 'reset role';

  if not v_is_intern then raise exception 'FAAL 9a: is_intern() geeft false voor intern personeel'; end if;
  if v_profielen < 1 then raise exception 'FAAL 9b: intern personeel ziet geen enkele begeleider'; end if;
  raise notice 'OK 9: intern personeel is intern en ziet de begeleiderslijst (lijstpunten 2 en 9)';
end $$;


-- ============ 10. Dubbele toewijzing wordt geweigerd ============
do $$
declare
  v_intern uuid; v_begeleider uuid; v_dossier uuid;
  v_geweigerd boolean := false;
begin
  select ip.id into v_intern from public.intern_personeel ip where ip.actief limit 1;

  select db.begeleider_id, db.dossier_id into v_begeleider, v_dossier
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_intern, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';

  begin
    insert into public.dossier_begeleiders (dossier_id, begeleider_id, actief)
    values (v_dossier, v_begeleider, true);
  exception when unique_violation then
    v_geweigerd := true;
  end;

  execute 'reset role';

  if not v_geweigerd then raise exception 'FAAL 10: dubbele toewijzing werd toegelaten'; end if;
  raise notice 'OK 10: dubbele toewijzing wordt geweigerd door de unique-constraint (lijstpunt 10)';
end $$;


-- ============ 11. Gedeactiveerde begeleider verliest alles ineens ============
-- De ROLLBACK onderaan maakt dit weer ongedaan.
do $$
declare
  v_intern uuid; v_begeleider uuid; v_dossiers int;
begin
  select ip.id into v_intern from public.intern_personeel ip where ip.actief limit 1;

  select db.begeleider_id into v_begeleider
  from public.dossier_begeleiders db
  join public.begeleider_profiles bp on bp.id = db.begeleider_id
  where db.actief and bp.actief limit 1;

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_intern, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  update public.begeleider_profiles set actief = false where id = v_begeleider;
  execute 'reset role';

  perform set_config('request.jwt.claims',
    json_build_object('sub', v_begeleider, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
  select count(*) into v_dossiers from public.begeleider_mijn_dossiers();
  execute 'reset role';

  if v_dossiers <> 0 then
    raise exception 'FAAL 11: gedeactiveerde begeleider ziet nog % dossiers', v_dossiers;
  end if;
  raise notice 'OK 11: gedeactiveerde begeleider ziet 0 dossiers (lijstpunten 4 en 11)';
end $$;


-- ============ 12. Anoniem verkeer wordt geweigerd ============
-- Regressietest op migratie 0007: deze functies mogen niet stilzwijgend
-- uitvoerbaar zijn voor anon.
do $$
declare
  v_geweigerd_mijn boolean := false;
  v_geweigerd_intern boolean := false;
begin
  perform set_config('request.jwt.claims', json_build_object('role', 'anon')::text, true);
  execute 'set local role anon';

  begin
    perform * from public.begeleider_mijn_dossiers();
  exception when insufficient_privilege then
    v_geweigerd_mijn := true;
  end;

  begin
    perform public.is_intern();
  exception when insufficient_privilege then
    v_geweigerd_intern := true;
  end;

  execute 'reset role';

  if not v_geweigerd_mijn then raise exception 'FAAL 12a: anon kan begeleider_mijn_dossiers() uitvoeren'; end if;
  if not v_geweigerd_intern then raise exception 'FAAL 12b: anon kan is_intern() uitvoeren'; end if;
  raise notice 'OK 12: anon wordt op beide functies geweigerd';
end $$;


do $$
begin
  raise notice '----------------------------------------';
  raise notice 'Alle tests geslaagd. Alles wordt nu teruggedraaid.';
  raise notice '----------------------------------------';
end $$;

rollback;
