-- Ami Legal: bijkomende identificatiegegevens + familie/vertrouwenspersoon
-- op klanten, zoals genoteerd op de fysieke kaft van het bewinddossier.
--
-- Puur additief: vijf nieuwe, nullable kolommen. Geen bestaande kolom of
-- rij wordt aangeraakt.

alter table public.klanten
  add column if not exists rolnummer text
    check (rolnummer is null or char_length(rolnummer) <= 50),
  add column if not exists geboortedatum date,
  add column if not exists vertrouwenspersoon_naam text
    check (vertrouwenspersoon_naam is null or char_length(vertrouwenspersoon_naam) <= 120),
  add column if not exists vertrouwenspersoon_telefoon text
    check (vertrouwenspersoon_telefoon is null or char_length(vertrouwenspersoon_telefoon) <= 50),
  add column if not exists familieleden text
    check (familieleden is null or char_length(familieleden) <= 2000);

-- Geen RLS-wijziging nodig: de bestaande policies ("auth.uid() = user_id")
-- gelden automatisch voor de nieuwe kolommen.
