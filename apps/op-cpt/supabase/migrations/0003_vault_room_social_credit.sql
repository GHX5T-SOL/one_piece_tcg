-- The Vault Room social, member dashboard, and Vault Credit beta groundwork.
-- These tables are safe to apply after 0001/0002. They do not activate public lending or payments.

create table if not exists public.vault_social_posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  visibility public.item_privacy not null default 'members',
  title text not null,
  body text not null,
  attached_product_id text references public.vault_products(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vault_member_listings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  product_id text references public.vault_products(id) on delete set null,
  title text not null,
  asking_price_zar integer check (asking_price_zar >= 0),
  trade_open boolean not null default true,
  visibility public.item_privacy not null default 'members',
  status text not null default 'draft' check (status in ('draft', 'review', 'live', 'reserved', 'sold', 'cancelled')),
  proof_note text not null default '',
  moderator_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vault_direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create table if not exists public.vault_points_ledger (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null,
  reason text not null,
  source_type text not null default 'manual',
  source_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.vault_credit_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  applicant_name text,
  contact_channel text not null default 'whatsapp',
  collateral_summary text not null,
  requested_amount_zar integer check (requested_amount_zar >= 0),
  status text not null default 'waitlist' check (status in ('waitlist', 'review', 'declined', 'paused', 'approved_subject_to_terms', 'closed')),
  reviewer_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vault_social_posts enable row level security;
alter table public.vault_member_listings enable row level security;
alter table public.vault_direct_messages enable row level security;
alter table public.vault_points_ledger enable row level security;
alter table public.vault_credit_requests enable row level security;

drop policy if exists "members read visible social posts" on public.vault_social_posts;
create policy "members read visible social posts"
  on public.vault_social_posts for select
  using (visibility = 'public' or auth.uid() = profile_id or private.is_moderator_or_admin(auth.uid()));

drop policy if exists "members manage own social posts" on public.vault_social_posts;
create policy "members manage own social posts"
  on public.vault_social_posts for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists "members read visible listings" on public.vault_member_listings;
create policy "members read visible listings"
  on public.vault_member_listings for select
  using (visibility = 'public' or auth.uid() = profile_id or private.is_moderator_or_admin(auth.uid()));

drop policy if exists "members manage own listings" on public.vault_member_listings;
create policy "members manage own listings"
  on public.vault_member_listings for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

drop policy if exists "members read own direct messages" on public.vault_direct_messages;
create policy "members read own direct messages"
  on public.vault_direct_messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id or private.is_moderator_or_admin(auth.uid()));

drop policy if exists "members send direct messages" on public.vault_direct_messages;
create policy "members send direct messages"
  on public.vault_direct_messages for insert
  with check (auth.uid() = sender_id);

drop policy if exists "members read own points" on public.vault_points_ledger;
create policy "members read own points"
  on public.vault_points_ledger for select
  using (auth.uid() = profile_id or private.is_moderator_or_admin(auth.uid()));

drop policy if exists "members create own vault credit waitlist requests" on public.vault_credit_requests;
create policy "members create own vault credit waitlist requests"
  on public.vault_credit_requests for insert
  with check (auth.uid() = profile_id or profile_id is null);

drop policy if exists "members read own vault credit requests" on public.vault_credit_requests;
create policy "members read own vault credit requests"
  on public.vault_credit_requests for select
  using (auth.uid() = profile_id or private.is_moderator_or_admin(auth.uid()));

create index if not exists vault_social_posts_profile_idx on public.vault_social_posts(profile_id, created_at desc);
create index if not exists vault_member_listings_status_idx on public.vault_member_listings(status, created_at desc);
create index if not exists vault_direct_messages_recipient_idx on public.vault_direct_messages(recipient_id, created_at desc);
create index if not exists vault_points_profile_idx on public.vault_points_ledger(profile_id, created_at desc);
create index if not exists vault_credit_requests_status_idx on public.vault_credit_requests(status, created_at desc);
