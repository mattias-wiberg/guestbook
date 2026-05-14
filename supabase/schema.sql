create schema if not exists "guestbook";

grant USAGE on schema guestbook to anon, authenticated, service_role;

alter default privileges for role postgres in schema guestbook grant all on tables to anon, authenticated, service_role;

alter default privileges for role postgres in schema guestbook grant all on sequences to anon, authenticated, service_role;

alter default privileges for role postgres in schema guestbook revoke EXECUTE on functions from public;

create table guestbook.profiles (
  id uuid primary key default auth.uid() references auth.users (id) on DELETE cascade on UPDATE cascade,
  email text unique not null
);

alter table guestbook.profiles
  enable row level security;

create or replace function guestbook.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to guestbook
as $function$
begin
  insert into guestbook.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$function$;

create trigger on_auth_user_created after insert on auth.users for each row execute function guestbook.handle_new_user();

revoke EXECUTE on function guestbook.handle_new_user() from public;

create or replace function guestbook.handle_user_updated()
returns trigger
language plpgsql
security definer
set search_path to guestbook
as $function$
begin
  update guestbook.profiles
  set email = new.email
  where id = new.id;
  return new;
end;
$function$;

create trigger on_auth_user_updated
after update
on auth.users
for each row
when (old.email is distinct from new.email)
execute function guestbook.handle_user_updated();

revoke EXECUTE on function guestbook.handle_user_updated() from public;

create table guestbook.posts (
  id uuid primary key default gen_random_uuid(),
  title varchar not null,
  message varchar not null,
  created_at timestamp with time zone not null default NOW(),
  created_by uuid not null default auth.uid() references guestbook.profiles (id) on DELETE cascade on UPDATE cascade
);

alter table guestbook.posts
  enable row level security;

create policy "Profiles readable only if user has a post" 
  on guestbook.profiles
  as permissive
  for select
  to public
using (exists (select 1 from guestbook.posts where guestbook.posts.created_by = guestbook.profiles.id));

create policy "Enable delete for users if creator of post"
  on guestbook.posts
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));

create policy "Enable insert for users based on user_id"
  on guestbook.posts
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = created_by));

create policy "Enable read access for all users"
  on guestbook.posts
  as permissive
  for select
  to public
using (true);

create policy "Users can only edit their own posts"
  on guestbook.posts
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));