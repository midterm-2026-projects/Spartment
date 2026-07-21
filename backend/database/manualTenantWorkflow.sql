-- ============================================================
-- MANUAL TENANT CREATION WORKFLOW
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Add inquiry relationship to tenants
-- ------------------------------------------------------------

alter table public.tenants
add column if not exists inquiry_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'tenants_inquiry_id_fkey'
  ) then
    alter table public.tenants
    add constraint tenants_inquiry_id_fkey
    foreign key (inquiry_id)
    references public.inquiries(id)
    on delete set null;
  end if;
end
$$;

create unique index if not exists tenants_inquiry_id_unique
on public.tenants(inquiry_id)
where inquiry_id is not null;

-- ------------------------------------------------------------
-- Approve inquiry only
-- ------------------------------------------------------------

create or replace function public.approve_inquiry(
  p_inquiry_id uuid,
  p_reviewed_by uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiry public.inquiries%rowtype;
begin
  select *
  into v_inquiry
  from public.inquiries
  where id = p_inquiry_id
  for update;

  if not found then
    raise exception 'Inquiry not found';
  end if;

  if v_inquiry.status <> 'Pending' then
    raise exception 'Only pending inquiries can be approved';
  end if;

  update public.inquiries
  set
    status = 'Approved',
    reviewed_by = p_reviewed_by,
    reviewed_at = now(),
    updated_at = now()
  where id = p_inquiry_id;

  return jsonb_build_object(
    'inquiry_id', p_inquiry_id,
    'status', 'Approved',
    'reviewed_by', p_reviewed_by
  );
end;
$$;

-- ------------------------------------------------------------
-- Reject inquiry only
-- ------------------------------------------------------------

create or replace function public.reject_inquiry(
  p_inquiry_id uuid,
  p_reviewed_by uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiry public.inquiries%rowtype;
begin
  select *
  into v_inquiry
  from public.inquiries
  where id = p_inquiry_id
  for update;

  if not found then
    raise exception 'Inquiry not found';
  end if;

  if v_inquiry.status <> 'Pending' then
    raise exception 'Only pending inquiries can be rejected';
  end if;

  update public.inquiries
  set
    status = 'Rejected',
    reviewed_by = p_reviewed_by,
    reviewed_at = now(),
    updated_at = now()
  where id = p_inquiry_id;

  return jsonb_build_object(
    'inquiry_id', p_inquiry_id,
    'status', 'Rejected',
    'reviewed_by', p_reviewed_by
  );
end;
$$;

-- ------------------------------------------------------------
-- Manually create tenant from approved inquiry
-- ------------------------------------------------------------

create or replace function public.create_tenant_from_approved_inquiry(
  p_inquiry_id uuid,
  p_full_name text,
  p_email text,
  p_contact text,
  p_room_id uuid,
  p_username text,
  p_password_hash text,
  p_created_by uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiry public.inquiries%rowtype;
  v_room public.rooms%rowtype;
  v_user_id uuid;
  v_tenant_id uuid;
begin
  select *
  into v_inquiry
  from public.inquiries
  where id = p_inquiry_id
  for update;

  if not found then
    raise exception 'Inquiry not found';
  end if;

  if v_inquiry.status <> 'Approved' then
    raise exception 'Only approved inquiries can create tenant accounts';
  end if;

  if exists (
    select 1
    from public.tenants
    where inquiry_id = p_inquiry_id
  ) then
    raise exception 'A tenant account has already been created for this inquiry';
  end if;

  if exists (
    select 1
    from public.users
    where lower(email) = lower(trim(p_email))
  ) then
    raise exception 'Email is already registered';
  end if;

  if exists (
    select 1
    from public.users
    where lower(username) = lower(trim(p_username))
  ) then
    raise exception 'Username is already registered';
  end if;

  select *
  into v_room
  from public.rooms
  where id = p_room_id
  for update;

  if not found then
    raise exception 'Room not found';
  end if;

  if v_room.status <> 'Available' then
    raise exception 'Room is not available';
  end if;

  insert into public.users (
    name,
    email,
    username,
    password_hash,
    role,
    status,
    created_at,
    updated_at
  )
  values (
    trim(p_full_name),
    lower(trim(p_email)),
    trim(p_username),
    p_password_hash,
    'tenant',
    'Active',
    now(),
    now()
  )
  returning id into v_user_id;

  insert into public.tenants (
    user_id,
    inquiry_id,
    room_id,
    full_name,
    email,
    contact,
    status,
    move_in_date,
    created_at,
    updated_at
  )
  values (
    v_user_id,
    p_inquiry_id,
    p_room_id,
    trim(p_full_name),
    lower(trim(p_email)),
    nullif(trim(coalesce(p_contact, '')), ''),
    'Active',
    coalesce(v_inquiry.move_in_date, current_date),
    now(),
    now()
  )
  returning id into v_tenant_id;

  update public.rooms
  set
    status = 'Occupied',
    updated_at = now()
  where id = p_room_id;

  insert into public.notifications (
    user_id,
    title,
    message,
    type,
    is_read,
    created_at
  )
  values (
    v_user_id,
    'Tenant account created',
    'Your tenant account has been created successfully.',
    'tenant_account',
    false,
    now()
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'user_id', v_user_id,
    'inquiry_id', p_inquiry_id,
    'room_id', p_room_id,
    'room_status', 'Occupied',
    'created_by', p_created_by
  );
end;
$$;

grant execute on function public.approve_inquiry(uuid, uuid)
to authenticated;

grant execute on function public.reject_inquiry(uuid, uuid)
to authenticated;

grant execute on function public.create_tenant_from_approved_inquiry(
  uuid,
  text,
  text,
  text,
  uuid,
  text,
  text,
  uuid
)
to authenticated;