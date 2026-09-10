-- Da Vinci — core tables for reservations, contact messages, and online orders.
-- Run this once against your Supabase project (SQL Editor, or `supabase db push`).

create extension if not exists "pgcrypto";

-- ============ Reservations ============
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  party_size int not null check (party_size between 1 and 20),
  reservation_date date not null,
  reservation_time time not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;

-- Guests can submit a reservation request; nobody can read them back over the
-- public API (the restaurant reviews them in the Supabase dashboard, which
-- uses the privileged postgres role and bypasses RLS).
create policy "anon can create reservations"
  on public.reservations for insert
  to anon
  with check (true);

-- ============ Contact messages ============
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "anon can create contact messages"
  on public.contact_messages for insert
  to anon
  with check (true);

-- ============ Orders ============
-- No anon policies at all: only the Netlify functions (using the Supabase
-- service role key, which bypasses RLS) may read or write orders. This keeps
-- pricing and order status tamper-proof — the browser never inserts an order
-- or sets its own total.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  fulfillment_type text not null default 'pickup' check (fulfillment_type in ('pickup', 'delivery')),
  delivery_address text,
  notes text,
  subtotal_cents int not null,
  total_cents int not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'fulfilled')),
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_id text not null,
  item_name text not null,
  unit_price_cents int not null,
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists reservations_date_idx on public.reservations(reservation_date);
