-- Ami Legal Phase 2.2: klantbeheer uitbreiden.
--
-- Puur additief: drie nieuwe, nullable-of-default kolommen op public.klanten.
-- Geen bestaande kolom wordt aangeraakt, hernoemd of verwijderd. De bestaande
-- klant "Janssen Danny" krijgt automatisch klant_type = null,
-- identificatienummer = null, gearchiveerd = false — precies zoals hij nu al
-- zichtbaar is, dus geen enkel bestaand gedrag verandert voor bestaande data.
--
-- Dit is NIET de eerder besproken toekomstige migratie die "name"/"purpose"
-- op requests zou verwijderen — dat blijft apart en is nog niet aangemaakt.

alter table public.klanten
  add column if not exists klant_type text
    check (klant_type is null or klant_type in ('natuurlijk_persoon', 'rechtspersoon')),
  add column if not exists identificatienummer text
    check (identificatienummer is null or char_length(identificatienummer) <= 50),
  add column if not exists gearchiveerd boolean not null default false;

-- Index voor de "toon gearchiveerde klanten"-toggle: de standaardweergave
-- filtert op gearchiveerd = false, dit versnelt die query naarmate het
-- aantal klanten groeit.
create index if not exists klanten_gearchiveerd_idx on public.klanten (gearchiveerd);

-- Geen RLS-wijziging nodig: de bestaande policies ("auth.uid() = user_id")
-- gelden automatisch voor de nieuwe kolommen, net als voor elke andere
-- kolom op deze tabel.
