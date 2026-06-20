-- The Vault Room member-beta initial schema.
-- Apply with Supabase CLI/MCP after project selection. Every exposed table has RLS.

create schema if not exists private;

create type public.member_role as enum ('member', 'moderator', 'admin');
create type public.item_privacy as enum ('public', 'members', 'private');
create type public.trade_status as enum ('draft', 'open', 'review', 'accepted', 'declined', 'expired', 'cancelled');
create type public.event_status as enum ('draft', 'open', 'waitlist', 'full', 'cancelled');
create type public.group_buy_status as enum ('interest', 'quote_needed', 'admin_review', 'closed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text not null unique check (length(handle) between 3 and 32),
  display_name text,
  crew_role text not null default 'Member',
  location text not null default 'Cape Town',
  avatar_url text,
  privacy item_privacy not null default 'members',
  collection_value_zar numeric(12, 2) not null default 0,
  battle_points integer not null default 0,
  trade_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role public.member_role not null default 'member',
  status text not null default 'active' check (status in ('pending', 'active', 'suspended')),
  invited_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  character text not null,
  set_name text not null,
  card_number text not null,
  year integer,
  language text not null default 'Unknown',
  rarity text not null default 'Unknown',
  variant text not null default 'Standard',
  tcg_reference_url text,
  created_at timestamptz not null default now(),
  unique (set_name, card_number, variant, language)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Main Collection',
  privacy public.item_privacy not null default 'members',
  created_at timestamptz not null default now()
);

create table public.collection_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid not null references public.collections(id) on delete cascade,
  card_id uuid not null references public.cards(id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  grade_company text,
  grade text,
  cert_number text,
  status text not null default 'owned' check (status in ('owned', 'inbound', 'watchlist', 'offer')),
  privacy public.item_privacy not null default 'members',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.card_assets (
  id uuid primary key default gen_random_uuid(),
  card_id uuid references public.cards(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete cascade,
  storage_path text not null,
  asset_type text not null check (asset_type in ('card_image', 'slab_image', 'video', 'proof', 'fan_asset')),
  provenance text not null,
  private_use_only boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.price_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  url text not null,
  source_type text not null check (source_type in ('official', 'market', 'competitive', 'manual', 'local')),
  requires_key boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.price_snapshots (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  source_id uuid not null references public.price_sources(id) on delete cascade,
  currency text not null default 'ZAR',
  low numeric(12, 2),
  mid numeric(12, 2),
  high numeric(12, 2),
  confidence text not null default 'low' check (confidence in ('low', 'medium', 'high')),
  retrieved_at timestamptz not null default now(),
  raw_ref text
);

create table public.watchlist_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  card_id uuid references public.cards(id) on delete set null,
  label text not null,
  target_price_zar numeric(12, 2),
  priority integer not null default 3 check (priority between 1 and 5),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.trade_offers (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id uuid references public.profiles(id) on delete set null,
  seeking text not null,
  offering text not null,
  status public.trade_status not null default 'draft',
  expires_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trade_offer_items (
  id uuid primary key default gen_random_uuid(),
  trade_offer_id uuid not null references public.trade_offers(id) on delete cascade,
  collection_item_id uuid references public.collection_items(id) on delete set null,
  side text not null check (side in ('offered', 'requested')),
  label text not null,
  quantity integer not null default 1 check (quantity > 0)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  venue text not null,
  format text not null,
  capacity integer not null default 16 check (capacity > 0),
  status public.event_status not null default 'draft',
  notes text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'going' check (status in ('going', 'waitlist', 'cancelled')),
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.rankings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  season text not null default 'member-beta',
  battle_points integer not null default 0,
  collection_value_zar numeric(12, 2) not null default 0,
  specialty text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, season)
);

create table public.group_buys (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  target text not null,
  status public.group_buy_status not null default 'interest',
  interest_count integer not null default 0,
  notes text not null default '',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_url text not null,
  source_id text,
  summary text not null,
  post_date date not null default current_date,
  visibility public.item_privacy not null default 'public',
  created_at timestamptz not null default now()
);

create table public.asset_manifest (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  drive_file_id text,
  local_path text,
  usage_note text not null,
  private_use_only boolean not null default true,
  provenance text not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id uuid,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

create index collection_items_collection_idx on public.collection_items(collection_id);
create index collection_items_card_idx on public.collection_items(card_id);
create index price_snapshots_card_idx on public.price_snapshots(card_id, retrieved_at desc);
create index trade_offers_from_idx on public.trade_offers(from_user_id, status);
create index event_rsvps_event_idx on public.event_rsvps(event_id);
create index rankings_season_points_idx on public.rankings(season, battle_points desc);

create or replace function private.member_role_for(user_uuid uuid)
returns public.member_role
language sql
security definer
set search_path = public
stable
as $$
  select role from memberships where user_id = user_uuid and status = 'active'
$$;

create or replace function private.is_moderator_or_admin(user_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(private.member_role_for(user_uuid) in ('moderator', 'admin'), false)
$$;

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.cards enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;
alter table public.card_assets enable row level security;
alter table public.price_sources enable row level security;
alter table public.price_snapshots enable row level security;
alter table public.watchlist_items enable row level security;
alter table public.trade_offers enable row level security;
alter table public.trade_offer_items enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.rankings enable row level security;
alter table public.group_buys enable row level security;
alter table public.news_posts enable row level security;
alter table public.asset_manifest enable row level security;
alter table public.audit_logs enable row level security;
alter table public.moderation_reports enable row level security;

create policy "profiles visible to members" on public.profiles
  for select using (auth.uid() is not null and (privacy <> 'private' or id = auth.uid()));
create policy "profiles insert self" on public.profiles
  for insert with check (id = auth.uid());
create policy "profiles update self" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "memberships self or moderators read" on public.memberships
  for select using (user_id = auth.uid() or private.is_moderator_or_admin(auth.uid()));
create policy "memberships moderators manage" on public.memberships
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "cards read members" on public.cards
  for select using (auth.uid() is not null);
create policy "cards moderators write" on public.cards
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "collections read by owner or members visibility" on public.collections
  for select using (owner_id = auth.uid() or (auth.uid() is not null and privacy in ('public', 'members')));
create policy "collections owner write" on public.collections
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "collection items read by collection access" on public.collection_items
  for select using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id
      and (c.owner_id = auth.uid() or (auth.uid() is not null and c.privacy in ('public', 'members')))
    )
  );
create policy "collection items owner write" on public.collection_items
  for all using (
    exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.collections c where c.id = collection_id and c.owner_id = auth.uid())
  );

create policy "card assets owner or members read" on public.card_assets
  for select using (owner_id = auth.uid() or auth.uid() is not null);
create policy "card assets owner write" on public.card_assets
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "price sources read members" on public.price_sources
  for select using (auth.uid() is not null);
create policy "price sources moderators write" on public.price_sources
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));
create policy "price snapshots read members" on public.price_snapshots
  for select using (auth.uid() is not null);
create policy "price snapshots moderators write" on public.price_snapshots
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "watchlist owner access" on public.watchlist_items
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "trade offers parties or members read open" on public.trade_offers
  for select using (from_user_id = auth.uid() or to_user_id = auth.uid() or (auth.uid() is not null and status in ('open', 'review')));
create policy "trade offers owner write" on public.trade_offers
  for all using (from_user_id = auth.uid()) with check (from_user_id = auth.uid());
create policy "trade offer items read by offer access" on public.trade_offer_items
  for select using (
    exists (
      select 1 from public.trade_offers o
      where o.id = trade_offer_id
      and (o.from_user_id = auth.uid() or o.to_user_id = auth.uid() or (auth.uid() is not null and o.status in ('open', 'review')))
    )
  );
create policy "trade offer items owner write" on public.trade_offer_items
  for all using (
    exists (select 1 from public.trade_offers o where o.id = trade_offer_id and o.from_user_id = auth.uid())
  ) with check (
    exists (select 1 from public.trade_offers o where o.id = trade_offer_id and o.from_user_id = auth.uid())
  );

create policy "events read public and members" on public.events
  for select using (status <> 'draft' or private.is_moderator_or_admin(auth.uid()));
create policy "events moderators write" on public.events
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));
create policy "event rsvps own read write" on public.event_rsvps
  for all using (user_id = auth.uid() or private.is_moderator_or_admin(auth.uid())) with check (user_id = auth.uid() or private.is_moderator_or_admin(auth.uid()));

create policy "rankings read members" on public.rankings
  for select using (auth.uid() is not null);
create policy "rankings moderators write" on public.rankings
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "group buys read members" on public.group_buys
  for select using (auth.uid() is not null);
create policy "group buys moderators write" on public.group_buys
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "news public read" on public.news_posts
  for select using (visibility = 'public' or auth.uid() is not null);
create policy "news moderators write" on public.news_posts
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "asset manifest members read" on public.asset_manifest
  for select using (auth.uid() is not null);
create policy "asset manifest moderators write" on public.asset_manifest
  for all using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));

create policy "audit moderators read" on public.audit_logs
  for select using (private.is_moderator_or_admin(auth.uid()));
create policy "moderation reports reporter or moderators" on public.moderation_reports
  for select using (reporter_id = auth.uid() or private.is_moderator_or_admin(auth.uid()));
create policy "moderation reports create members" on public.moderation_reports
  for insert with check (reporter_id = auth.uid());
create policy "moderation reports moderators update" on public.moderation_reports
  for update using (private.is_moderator_or_admin(auth.uid())) with check (private.is_moderator_or_admin(auth.uid()));
