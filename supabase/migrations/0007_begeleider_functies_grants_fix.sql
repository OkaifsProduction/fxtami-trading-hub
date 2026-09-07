-- Ami Legal: sluit een gat in migratie 0006 — de EXECUTE-rechten op de
-- drie begeleider-functies waren enkel expliciet ingetrokken bij "public",
-- niet bij "anon" specifiek. Supabase kent standaard, via
-- "alter default privileges", EXECUTE op nieuwe functies in het
-- "public"-schema rechtstreeks toe aan zowel "anon" als "authenticated" —
-- los van wat aan de PUBLIC-pseudorol wordt toegekend/ontnomen. Omdat 0006
-- bij de functies enkel "revoke ... from public" deed (in plaats van het
-- patroon dat bij de twee nieuwe TABELLEN wél gebruikt is, met expliciet
-- "from anon" én "from authenticated"), bleef een anonieme aanroeper
-- toegang houden tot de functies.
--
-- Bevestigd via test tegen productie: een anonieme aanroep van
-- begeleider_mijn_dossiers() gaf geen foutmelding — enkel toevallig een
-- lege rij-set terug, omdat auth.uid() voor een anonieme sessie null is en
-- dus nooit matcht. Geen data is hierdoor gelekt, maar de weigering die er
-- hoort te zijn was er niet. Deze migratie herstelt exact hetzelfde
-- expliciete patroon als de tabellen: intrekken bij zowel "anon" als
-- "authenticated", en enkel "authenticated" opnieuw toekennen.
--
-- Puur een rechten-correctie: geen schema-, kolom- of gedragswijziging.

revoke execute on function public.begeleider_mijn_dossiers() from anon;
revoke execute on function public.begeleider_mijn_dossiers() from authenticated;
grant execute on function public.begeleider_mijn_dossiers() to authenticated;

revoke execute on function public.begeleider_dossier_detail(uuid) from anon;
revoke execute on function public.begeleider_dossier_detail(uuid) from authenticated;
grant execute on function public.begeleider_dossier_detail(uuid) to authenticated;

revoke execute on function public.begeleider_dossier_aanvragen(uuid) from anon;
revoke execute on function public.begeleider_dossier_aanvragen(uuid) from authenticated;
grant execute on function public.begeleider_dossier_aanvragen(uuid) to authenticated;

-- De trigger-functie is sowieso nooit rechtstreeks aanroepbaar (Postgres
-- staat "select trg_...()" niet toe voor functies van het type "trigger"),
-- maar voor consistentie en least-privilege ontnemen we ook hier expliciet
-- elk EXECUTE-recht aan anon/authenticated.
revoke execute on function public.trg_dossier_gesloten_intrekken_begeleiders() from anon;
revoke execute on function public.trg_dossier_gesloten_intrekken_begeleiders() from authenticated;
