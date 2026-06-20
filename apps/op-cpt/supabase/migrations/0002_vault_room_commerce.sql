create table if not exists public.vault_products (
  id text primary key,
  sku text not null unique,
  slug text not null unique,
  name text not null,
  universe text not null,
  category text not null,
  product_type text not null,
  public_description text not null,
  price_zar integer not null check (price_zar >= 0),
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'In stock',
  visible boolean not null default true,
  featured boolean not null default false,
  ask_only boolean not null default false,
  image_url text,
  internal_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vault_orders (
  id uuid primary key default gen_random_uuid(),
  checkout_reference text not null unique,
  status text not null default 'claim',
  subtotal_zar integer not null check (subtotal_zar >= 0),
  customer_profile_id uuid references public.profiles(id) on delete set null,
  contact_note text,
  payment_provider text not null default 'yoco',
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vault_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.vault_orders(id) on delete cascade,
  product_id text not null references public.vault_products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_zar integer not null check (unit_price_zar >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.vault_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  venue text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  public_description text not null,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.vault_events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'going',
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create table if not exists public.vault_auction_items (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.vault_products(id) on delete cascade,
  current_bid_zar integer not null default 0,
  ends_at timestamptz,
  status text not null default 'preview',
  created_at timestamptz not null default now()
);

create table if not exists public.vault_grade_lab_orders (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  card_name text not null,
  card_number text,
  service_status text not null default 'intake',
  public_result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vault_products enable row level security;
alter table public.vault_orders enable row level security;
alter table public.vault_order_items enable row level security;
alter table public.vault_events enable row level security;
alter table public.vault_event_rsvps enable row level security;
alter table public.vault_auction_items enable row level security;
alter table public.vault_grade_lab_orders enable row level security;

drop policy if exists "visible products are readable" on public.vault_products;
create policy "visible products are readable"
  on public.vault_products for select
  using (visible = true);

drop policy if exists "visible events are readable" on public.vault_events;
create policy "visible events are readable"
  on public.vault_events for select
  using (visible = true);

drop policy if exists "auction previews are readable" on public.vault_auction_items;
create policy "auction previews are readable"
  on public.vault_auction_items for select
  using (true);

drop policy if exists "members read own rsvps" on public.vault_event_rsvps;
create policy "members read own rsvps"
  on public.vault_event_rsvps for select
  using (auth.uid() = profile_id);

drop policy if exists "members manage own rsvps" on public.vault_event_rsvps;
create policy "members manage own rsvps"
  on public.vault_event_rsvps for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists "members read own grade orders" on public.vault_grade_lab_orders;
create policy "members read own grade orders"
  on public.vault_grade_lab_orders for select
  using (auth.uid() = profile_id);
