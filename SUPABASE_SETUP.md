# Supabase Cloud Sync & GitHub Pages Deployment Guide

## 1. Run this SQL in Supabase SQL Editor
Create a free project at https://supabase.com (select Mumbai `ap-south-1`), open **SQL Editor -> New query**, and run:

```sql
create table if not exists public.app_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz default now()
);

alter table public.app_state enable row level security;

create policy "Allow app read/write access"
  on public.app_state
  for all
  using (true)
  with check (true);

alter publication supabase_realtime add table public.app_state;
```

## 2. Configure GitHub Secrets
1. In Supabase, go to **Project Settings -> API** and copy `Project URL` and `anon public` key.
2. In your GitHub repo, go to **Settings -> Secrets and variables -> Actions -> New repository secret** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Go to **Settings -> Pages -> Source** and select **GitHub Actions**.

## 3. Initial Admin Credentials
- **Username:** `admin`
- **Password:** `password`
*(Change your password immediately after first login via the sidebar profile key icon).*
