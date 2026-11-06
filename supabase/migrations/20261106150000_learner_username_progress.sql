-- Username accounts and saved practice progress.
-- Login ids look like name@learners.localhost. That host is not a mailbox.
-- The static site never receives the service-role key.
-- Keep the domain in sync with assets/progress-sync.js EMAIL_DOMAIN.

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to authenticated, service_role, supabase_auth_admin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  created_at timestamptz not null default pg_catalog.now(),
  constraint profiles_username_format check (username ~ '^[a-z][a-z0-9_]{2,19}$'),
  constraint profiles_username_unique unique (username)
);

comment on table public.profiles is
  'Public username for Revision Flashcards. The auth email is an internal login id.';

create table public.learner_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  badges jsonb not null default '{}'::jsonb,
  profile jsonb not null default '{}'::jsonb,
  mastery jsonb not null default '{}'::jsonb,
  match_best jsonb not null default '{}'::jsonb,
  timed_best jsonb not null default '{}'::jsonb,
  last_place jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default pg_catalog.now(),
  constraint learner_progress_objects check (
    jsonb_typeof(badges) = 'object'
    and jsonb_typeof(profile) = 'object'
    and jsonb_typeof(mastery) = 'object'
    and jsonb_typeof(match_best) = 'object'
    and jsonb_typeof(timed_best) = 'object'
    and jsonb_typeof(last_place) = 'object'
  ),
  constraint learner_progress_size check (
    octet_length(badges::text) < 200000
    and octet_length(profile::text) < 4000
    and octet_length(mastery::text) < 200000
    and octet_length(match_best::text) < 20000
    and octet_length(timed_best::text) < 20000
    and octet_length(last_place::text) < 4000
  )
);

comment on table public.learner_progress is
  'Badges, mastery, nickname, and last flashcard for one learner account.';

create index learner_progress_updated_idx on public.learner_progress (updated_at desc);

create table private.signup_attempts (
  id bigint generated always as identity primary key,
  ip text not null,
  created_at timestamptz not null default pg_catalog.now()
);

create index signup_attempts_ip_created_idx
  on private.signup_attempts (ip, created_at desc);

alter table public.profiles enable row level security;
alter table public.learner_progress enable row level security;
alter table private.signup_attempts enable row level security;

revoke all on public.profiles from public, anon, authenticated;
revoke all on public.learner_progress from public, anon, authenticated;
revoke all on private.signup_attempts from public, anon, authenticated, service_role;

grant select on public.profiles to authenticated, service_role;
grant select, insert, update on public.learner_progress to authenticated;

create or replace function private.session_is_current()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.sessions as s
    where s.user_id = (select auth.uid())
      and s.id = nullif((select auth.jwt() ->> 'session_id'), '')::uuid
  );
$$;

create or replace function private.claim_session()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
  sid uuid := nullif((select auth.jwt() ->> 'session_id'), '')::uuid;
begin
  if uid is null or sid is null then
    return false;
  end if;
  if not exists (
    select 1
    from auth.sessions as s
    where s.id = sid
      and s.user_id = uid
  ) then
    return false;
  end if;
  delete from auth.sessions as s
  where s.user_id = uid
    and s.id <> sid;
  return true;
end;
$$;

create or replace function private.touch_learner_progress()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

create trigger learner_progress_touch
  before update on public.learner_progress
  for each row
  execute function private.touch_learner_progress();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  uname text := lower(btrim(coalesce(new.raw_user_meta_data ->> 'username', '')));
  expected text;
begin
  if uname !~ '^[a-z][a-z0-9_]{2,19}$' then
    raise exception 'invalid username';
  end if;
  expected := uname || '@learners.localhost';
  if lower(new.email) is distinct from expected then
    raise exception 'invalid username';
  end if;
  if exists (select 1 from public.profiles where username = uname) then
    raise exception 'username taken';
  end if;
  insert into public.profiles (id, username)
  values (new.id, uname);
  if new.email_confirmed_at is null then
    update auth.users
    set email_confirmed_at = pg_catalog.now()
    where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();

create or replace function private.keep_login_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    raise exception 'login id cannot be changed';
  end if;
  return new;
end;
$$;

create trigger lock_login_email
  before update of email on auth.users
  for each row
  execute function private.keep_login_email();

create or replace function private.signup_allowed(client_ip text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  clean text := left(coalesce(client_ip, ''), 64);
  recent integer;
begin
  if clean = '' then
    clean := 'unknown';
  end if;
  delete from private.signup_attempts
  where created_at < pg_catalog.now() - interval '2 days';
  select count(*) into recent
  from private.signup_attempts
  where ip = clean
    and created_at > pg_catalog.now() - interval '1 hour';
  if recent >= 8 then
    return false;
  end if;
  insert into private.signup_attempts (ip) values (clean);
  return true;
end;
$$;

create or replace function public.session_is_current()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.session_is_current();
$$;

create or replace function public.claim_session()
returns boolean
language sql
volatile
security invoker
set search_path = ''
as $$
  select private.claim_session();
$$;

create or replace function public.signup_allowed(client_ip text)
returns boolean
language sql
volatile
security invoker
set search_path = ''
as $$
  select private.signup_allowed(client_ip);
$$;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy learner_progress_select
  on public.learner_progress
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select private.session_is_current())
  );

create policy learner_progress_insert
  on public.learner_progress
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (select private.session_is_current())
  );

create policy learner_progress_update
  on public.learner_progress
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    and (select private.session_is_current())
  )
  with check (
    user_id = (select auth.uid())
    and (select private.session_is_current())
  );

revoke all on function private.session_is_current() from public, anon, authenticated, service_role;
revoke all on function private.claim_session() from public, anon, authenticated, service_role;
revoke all on function private.touch_learner_progress() from public, anon, authenticated, service_role;
revoke all on function private.handle_new_user() from public, anon, authenticated, service_role;
revoke all on function private.keep_login_email() from public, anon, authenticated, service_role;
revoke all on function private.signup_allowed(text) from public, anon, authenticated, service_role;
revoke all on function public.session_is_current() from public, anon, authenticated, service_role;
revoke all on function public.claim_session() from public, anon, authenticated, service_role;
revoke all on function public.signup_allowed(text) from public, anon, authenticated, service_role;

grant execute on function private.session_is_current() to authenticated;
grant execute on function private.claim_session() to authenticated;
grant execute on function private.touch_learner_progress() to authenticated;
grant execute on function private.handle_new_user() to supabase_auth_admin;
grant execute on function private.keep_login_email() to supabase_auth_admin;
grant execute on function private.signup_allowed(text) to service_role;
grant execute on function public.session_is_current() to authenticated;
grant execute on function public.claim_session() to authenticated;
grant execute on function public.signup_allowed(text) to service_role;
