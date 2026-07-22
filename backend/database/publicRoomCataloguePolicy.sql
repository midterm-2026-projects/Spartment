-- Run once in the Supabase SQL Editor for existing databases.
-- Allows guests to see room availability without exposing resident data.

alter table public.rooms enable row level security;

drop policy if exists "Public can view available rooms" on public.rooms;
drop policy if exists "Public can view room catalogue" on public.rooms;

create policy "Public can view room catalogue"
on public.rooms
for select
to anon, authenticated
using (true);
