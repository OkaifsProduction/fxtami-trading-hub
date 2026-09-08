-- Ami Legal: testkoppeling voor het externe begeleider-portaal.
--
-- Doel: test-begeleider@amilegal.test toegang geven tot het bestaande
-- dossier van klant "Janssen Danny" ("Terugreis van Marokko"), zodat de
-- begeleider-portal end-to-end getest kan worden met bestaande, reeds
-- aanwezige testdata.
--
-- Volledig additief en idempotent (veilig opnieuw uit te voeren):
-- - Geen enkele bestaande klant-, dossier- of aanvraagrij wordt gewijzigd.
-- - Geen nieuwe Auth-gebruiker wordt aangemaakt — dat kan alleen via
--   Supabase Dashboard > Authentication (zie rapport), niet via SQL.
-- - Gebruikt uitsluitend de bestaande tabellen/kolommen uit migratie 0006
--   (begeleider_profiles, dossier_begeleiders); geen schema- of RLS-
--   wijziging.
--
-- VOORWAARDE: de Auth-gebruiker met e-mail test-begeleider@amilegal.test
-- moet al bestaan (Supabase Dashboard > Authentication > Add user) vóórdat
-- je dit bestand uitvoert. Zo niet, dan stopt dit script met een duidelijke
-- foutmelding en verandert er niets.

do $$
declare
  v_begeleider_user_id uuid;
  v_dossier_id uuid;
  v_klant_naam text := 'Janssen Danny';
  v_dossier_titel text := 'Terugreis van Marokko';
begin
  -- 1. Zoek de Auth-gebruiker op e-mail. Bestaat die nog niet, dan is de
  --    volgorde niet gevolgd (Auth-gebruiker moet er eerst zijn).
  select id into v_begeleider_user_id
  from auth.users
  where email = 'test-begeleider@amilegal.test'
  limit 1;

  if v_begeleider_user_id is null then
    raise exception
      'Auth-gebruiker test-begeleider@amilegal.test bestaat nog niet. '
      'Maak die eerst aan via Supabase Dashboard > Authentication > Add user, '
      'en voer dit bestand daarna opnieuw uit.';
  end if;

  -- 2. Begeleider-profiel aanmaken/heractiveren voor deze gebruiker.
  --    Upsert: veilig opnieuw uit te voeren, overschrijft geen andere
  --    velden dan naam/organisatie/actief.
  insert into public.begeleider_profiles (id, naam, organisatie, actief)
  values (v_begeleider_user_id, 'Test Begeleider', 'Testorganisatie', true)
  on conflict (id) do update
    set naam = excluded.naam,
        organisatie = excluded.organisatie,
        actief = true;

  -- 3. Zoek het bestaande dossier van Janssen Danny op (geen nieuwe klant-
  --    of dossierrij — enkel lezen).
  select d.id into v_dossier_id
  from public.dossiers d
  join public.klanten k on k.id = d.klant_id
  where k.naam = v_klant_naam
    and d.titel = v_dossier_titel
  limit 1;

  if v_dossier_id is null then
    raise exception
      'Geen dossier "%" gevonden voor klant "%". Controleer of de klant-/'
      'dossiernaam nog overeenkomt met de bestaande productiedata.',
      v_dossier_titel, v_klant_naam;
  end if;

  -- 4. Koppel de begeleider aan dat ene dossier. Upsert: als de koppeling
  --    ooit ingetrokken was (actief=false), wordt ze hier heractiveerd.
  insert into public.dossier_begeleiders (dossier_id, begeleider_id, actief, revoked_at)
  values (v_dossier_id, v_begeleider_user_id, true, null)
  on conflict (dossier_id, begeleider_id) do update
    set actief = true,
        revoked_at = null;

  raise notice 'OK: test-begeleider@amilegal.test is gekoppeld aan dossier "%" van klant "%".',
    v_dossier_titel, v_klant_naam;
end $$;

-- Optioneel, ter controle na het uitvoeren (los te draaien):
-- select bp.naam, k.naam as klant_naam, d.titel as dossier_titel, db.actief
-- from public.dossier_begeleiders db
-- join public.begeleider_profiles bp on bp.id = db.begeleider_id
-- join public.dossiers d on d.id = db.dossier_id
-- join public.klanten k on k.id = d.klant_id
-- where bp.id = (select id from auth.users where email = 'test-begeleider@amilegal.test');
