-- Ami Legal Phase 2.3: aanvraagworkflow met statussen.
--
-- Scheidt het statusmodel van dossiers en aanvragen, die tot nu toe dezelfde
-- twee waarden deelden ('open'/'afgehandeld'). Vanaf nu:
--   - requests.status krijgt een volledige workflow: open, in_behandeling,
--     goedgekeurd, geweigerd, afgehandeld.
--   - dossiers.status blijft strikt open/gesloten (een zaakstatus, los van
--     de goedkeurings-workflow van de individuele aanvragen erin).
--
-- Geverifieerd tegen productie vlak voor deze migratie geschreven werd: alle
-- bestaande rijen op beide tabellen staan op 'open', dus zowel de verbreding
-- (requests) als de vernauwing (dossiers, die 'afgehandeld' als geldige
-- waarde verliest) zijn veilig zonder enige data te hoeven aanpassen. Geen
-- ADD COLUMN, geen UPDATE, geen RLS-wijziging — enkel de CHECK-constraints
-- worden vervangen.

alter table public.requests
  drop constraint if exists requests_status_check;
alter table public.requests
  add constraint requests_status_check
  check (status in ('open', 'in_behandeling', 'goedgekeurd', 'geweigerd', 'afgehandeld'));

alter table public.dossiers
  drop constraint if exists dossiers_status_check;
alter table public.dossiers
  add constraint dossiers_status_check
  check (status in ('open', 'gesloten'));
