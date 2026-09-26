-- Reservations and contact messages used to be inserted straight from the
-- browser with the public `anon` key. They now go through the site's own
-- endpoint (netlify/functions/submit.mts), which validates them and writes
-- with the service role key, so the public role needs no access at all.
--
-- After this migration every table is closed to the public API: only the
-- Netlify Functions (service role) and the Supabase dashboard can read or
-- write. Run it once, after 0001_init.sql.

drop policy if exists "anon can create reservations" on public.reservations;
drop policy if exists "anon can create contact messages" on public.contact_messages;

-- RLS stays enabled; with no policies left, the anon and authenticated roles
-- match no rows for any operation. (The service role bypasses RLS by design.)
alter table public.reservations enable row level security;
alter table public.contact_messages enable row level security;

create index if not exists reservations_created_at_idx on public.reservations(created_at desc);
create index if not exists contact_messages_created_at_idx on public.contact_messages(created_at desc);
