-- 小管家 Supabase 私人数据库结构
-- 使用方法：Supabase Dashboard -> SQL Editor -> New query -> 粘贴并运行

create table if not exists public.little_steward_accounts (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  type text not null,
  kind text not null check (kind in ('asset', 'liability')),
  value numeric not null default 0,
  note text default '',
  updated date not null default current_date,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.little_steward_savings (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  month text not null,
  amount numeric not null default 0,
  note text default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.little_steward_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  title text not null,
  body text not null,
  date date not null default current_date,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.little_steward_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'AUD',
  updated_at timestamptz not null default now()
);

create table if not exists public.little_steward_plans (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null default 'default',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.little_steward_vault (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null default 'default',
  salt text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.little_steward_accounts enable row level security;
alter table public.little_steward_savings enable row level security;
alter table public.little_steward_notes enable row level security;
alter table public.little_steward_settings enable row level security;
alter table public.little_steward_plans enable row level security;
alter table public.little_steward_vault enable row level security;

drop policy if exists "Users manage own accounts" on public.little_steward_accounts;
drop policy if exists "Users manage own savings" on public.little_steward_savings;
drop policy if exists "Users manage own notes" on public.little_steward_notes;
drop policy if exists "Users manage own settings" on public.little_steward_settings;
drop policy if exists "Users manage own plans" on public.little_steward_plans;
drop policy if exists "Users manage own vault" on public.little_steward_vault;

create policy "Users manage own accounts"
on public.little_steward_accounts
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own savings"
on public.little_steward_savings
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own notes"
on public.little_steward_notes
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own settings"
on public.little_steward_settings
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own plans"
on public.little_steward_plans
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage own vault"
on public.little_steward_vault
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
