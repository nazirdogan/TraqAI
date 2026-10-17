-- The Person They Keep: buyers, settings, and the 10-minute email cron.
-- Project: Traq Collective (hfblasofaxnrpyvlvrrg). Safe to re-run.

-- ---------------------------------------------------------------------------
-- Tables. RLS on with no policies, and no grants to anon/authenticated, so
-- only the service role (the site's server routes) can read or write them.
-- ---------------------------------------------------------------------------

create table if not exists public.keep_buyers (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  email text not null,
  first_name text not null default 'there',
  created_at timestamptz not null default now(),
  sent_confirm_at timestamptz,
  sent_zoom_at timestamptz,
  sent_reminder_at timestamptz,
  sent_replay_at timestamptz,
  -- One email per Checkout Session (the session id is already unique; this
  -- states the pairing explicitly).
  unique (stripe_session_id, email)
);

-- Exactly one row, edited by hand in the Supabase table editor.
create table if not exists public.keep_settings (
  id boolean primary key default true check (id),
  zoom_url text,
  replay_url text,
  skool_url text,
  updated_at timestamptz not null default now()
);
insert into public.keep_settings (id) values (true) on conflict (id) do nothing;

alter table public.keep_buyers enable row level security;
alter table public.keep_settings enable row level security;
revoke all on public.keep_buyers, public.keep_settings from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Cron: pg_cron calls the site every 10 minutes through pg_net. The bearer
-- secret is read from Supabase Vault at call time (stored separately as
-- 'keep_cron_secret', never in this file), and must equal CRON_SECRET on
-- Vercel.
-- ---------------------------------------------------------------------------

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('keep-email-cron')
where exists (select 1 from cron.job where jobname = 'keep-email-cron');

select cron.schedule(
  'keep-email-cron',
  '*/10 * * * *',
  $$
  select net.http_post(
    url := 'https://traqcollective.com/api/keep/cron',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'keep_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);
