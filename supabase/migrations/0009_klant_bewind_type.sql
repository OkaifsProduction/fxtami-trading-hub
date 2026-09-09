-- Ami Legal: vervang klant_type (natuurlijk_persoon/rechtspersoon) door
-- bewind_type — dit kantoor behandelt uitsluitend bewind (beschermd
-- statuut), altijd voor een natuurlijke persoon; het onderscheid
-- natuurlijk_persoon/rechtspersoon was hier nooit van toepassing. De
-- daadwerkelijk relevante juridische classificatie is het type bewind:
-- over de goederen, over de persoon, of beide.
--
-- Puur additief: klant_type zelf wordt hier NIET verwijderd of gewijzigd —
-- geen enkele bestaande kolom of rij wordt aangeraakt. De kolom blijft
-- gewoon bestaan maar wordt vanaf nu niet meer gebruikt door de app; een
-- latere, aparte opruim-migratie kan hem laten vallen als gewenst.

alter table public.klanten
  add column if not exists bewind_type text
    check (bewind_type is null or bewind_type in ('goederen', 'persoon', 'beide'));

-- Geen RLS-wijziging nodig: de bestaande policies ("auth.uid() = user_id")
-- gelden automatisch voor de nieuwe kolom, net als voor elke andere kolom
-- op deze tabel.
