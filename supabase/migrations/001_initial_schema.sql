create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'plus', 'family', 'business')),
  created_at timestamptz not null default now()
);

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scan_type text not null check (scan_type in ('message', 'url', 'transaction', 'email')),
  content_preview text,
  content_hash text,
  risk_score integer not null check (risk_score between 0 and 100),
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  verdict text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_created_idx on public.scans (user_id, created_at desc);
alter table public.profiles enable row level security;
alter table public.scans enable row level security;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.scans from anon, authenticated;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, delete on table public.scans to authenticated;

create policy "profile_select_own" on public.profiles for select to authenticated using (auth.uid() is not null and auth.uid() = id);
create policy "profile_insert_own" on public.profiles for insert to authenticated with check (auth.uid() is not null and auth.uid() = id);
create policy "profile_update_own" on public.profiles for update to authenticated using (auth.uid() is not null and auth.uid() = id) with check (auth.uid() is not null and auth.uid() = id);
create policy "profile_delete_own" on public.profiles for delete to authenticated using (auth.uid() is not null and auth.uid() = id);
create policy "scan_select_own" on public.scans for select to authenticated using (auth.uid() is not null and auth.uid() = user_id);
create policy "scan_insert_own" on public.scans for insert to authenticated with check (auth.uid() is not null and auth.uid() = user_id);
create policy "scan_delete_own" on public.scans for delete to authenticated using (auth.uid() is not null and auth.uid() = user_id);
