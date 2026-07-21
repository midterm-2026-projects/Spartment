begin;

create extension if not exists pgcrypto;

-- =========================================================
-- USERS
-- =========================================================
-- Stores administrator and tenant login accounts.
-- Passwords must already be hashed by the backend before
-- inserting them into password_hash.
-- =========================================================

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  email text not null,
  username text,
  password_hash text not null,

  role text not null default 'tenant',
  status text not null default 'Active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint users_name_not_empty
    check (length(trim(name)) > 0),

  constraint users_email_not_empty
    check (length(trim(email)) > 0),

  constraint users_password_hash_not_empty
    check (length(trim(password_hash)) > 0),

  constraint users_role_check
    check (
      role in (
        'admin',
        'tenant'
      )
    ),

  constraint users_status_check
    check (
      status in (
        'Active',
        'Inactive',
        'Suspended'
      )
    )
);

create unique index if not exists users_email_unique_idx
on public.users (lower(email));

create unique index if not exists users_username_unique_idx
on public.users (lower(username))
where username is not null;

-- =========================================================
-- ROOMS
-- =========================================================

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),

  room_number text not null,
  room_type text,
  description text,

  monthly_rent numeric(12, 2) not null default 0,

  status text not null default 'Available',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint rooms_room_number_not_empty
    check (length(trim(room_number)) > 0),

  constraint rooms_monthly_rent_check
    check (monthly_rent >= 0),

  constraint rooms_status_check
    check (
      status in (
        'Available',
        'Reserved',
        'Occupied',
        'Maintenance',
        'Inactive'
      )
    )
);

create unique index if not exists rooms_room_number_unique_idx
on public.rooms (lower(room_number));

create index if not exists rooms_status_idx
on public.rooms (status);

-- =========================================================
-- INQUIRIES
-- =========================================================
-- A guest selects a room and submits an inquiry.
-- The selected room is stored only through room_id.
-- =========================================================

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  email text not null,
  contact text,

  room_id uuid not null,

  type text not null,
  move_in_date date,
  message text,

  status text not null default 'Pending',

  reviewed_by uuid,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint inquiries_room_fk
    foreign key (room_id)
    references public.rooms(id)
    on update cascade
    on delete restrict,

  constraint inquiries_reviewed_by_fk
    foreign key (reviewed_by)
    references public.users(id)
    on update cascade
    on delete set null,

  constraint inquiries_name_not_empty
    check (length(trim(name)) > 0),

  constraint inquiries_email_not_empty
    check (length(trim(email)) > 0),

  constraint inquiries_type_not_empty
    check (length(trim(type)) > 0),

  constraint inquiries_status_check
    check (
      status in (
        'Pending',
        'Approved',
        'Rejected'
      )
    ),

  constraint inquiries_review_state_check
    check (
      (
        status = 'Pending'
        and reviewed_at is null
      )
      or
      (
        status in ('Approved', 'Rejected')
        and reviewed_at is not null
      )
    )
);

create index if not exists inquiries_email_idx
on public.inquiries (lower(email));

create index if not exists inquiries_status_idx
on public.inquiries (status);

create index if not exists inquiries_room_id_idx
on public.inquiries (room_id);

create index if not exists inquiries_created_at_idx
on public.inquiries (created_at desc);

-- Prevent the same email from creating multiple pending
-- inquiries for the same room.
create unique index if not exists
  inquiries_one_pending_per_email_room_idx
on public.inquiries (
  lower(email),
  room_id
)
where status = 'Pending';

-- =========================================================
-- TENANTS
-- =========================================================
-- Tenant login information is stored in users.
-- Tenant-specific profile information is stored here.
-- =========================================================

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),

  inquiry_id uuid not null,
  user_id uuid not null,
  room_id uuid not null,

  full_name text not null,
  email text not null,
  contact text,

  status text not null default 'Active',

  move_in_date date,
  move_out_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint tenants_inquiry_fk
    foreign key (inquiry_id)
    references public.inquiries(id)
    on update cascade
    on delete restrict,

  constraint tenants_user_fk
    foreign key (user_id)
    references public.users(id)
    on update cascade
    on delete restrict,

  constraint tenants_room_fk
    foreign key (room_id)
    references public.rooms(id)
    on update cascade
    on delete restrict,

  constraint tenants_full_name_not_empty
    check (length(trim(full_name)) > 0),

  constraint tenants_email_not_empty
    check (length(trim(email)) > 0),

  constraint tenants_status_check
    check (
      status in (
        'Active',
        'Inactive',
        'Moved Out'
      )
    ),

  constraint tenants_move_out_date_check
    check (
      move_out_date is null
      or move_in_date is null
      or move_out_date >= move_in_date
    )
);

create unique index if not exists tenants_inquiry_unique_idx
on public.tenants (inquiry_id);

create unique index if not exists tenants_user_unique_idx
on public.tenants (user_id);

create unique index if not exists tenants_email_unique_idx
on public.tenants (lower(email));

create index if not exists tenants_room_id_idx
on public.tenants (room_id);

create index if not exists tenants_status_idx
on public.tenants (status);

-- Only one active tenant can occupy a room.
create unique index if not exists
  tenants_one_active_tenant_per_room_idx
on public.tenants (room_id)
where status = 'Active';

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),

  user_id uuid,
  tenant_id uuid,
  inquiry_id uuid,

  title text not null,
  message text not null,

  type text not null default 'Information',
  is_read boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint notifications_user_fk
    foreign key (user_id)
    references public.users(id)
    on update cascade
    on delete cascade,

  constraint notifications_tenant_fk
    foreign key (tenant_id)
    references public.tenants(id)
    on update cascade
    on delete cascade,

  constraint notifications_inquiry_fk
    foreign key (inquiry_id)
    references public.inquiries(id)
    on update cascade
    on delete cascade,

  constraint notifications_title_not_empty
    check (length(trim(title)) > 0),

  constraint notifications_message_not_empty
    check (length(trim(message)) > 0),

  constraint notifications_type_check
    check (
      type in (
        'Information',
        'Inquiry',
        'Approval',
        'Rejection',
        'Account'
      )
    )
);

create index if not exists notifications_user_id_idx
on public.notifications (user_id);

create index if not exists notifications_tenant_id_idx
on public.notifications (tenant_id);

create index if not exists notifications_inquiry_id_idx
on public.notifications (inquiry_id);

create index if not exists notifications_is_read_idx
on public.notifications (is_read);

create index if not exists notifications_created_at_idx
on public.notifications (created_at desc);

-- =========================================================
-- UPDATED-AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;

-- =========================================================
-- UPDATED-AT TRIGGERS
-- =========================================================

drop trigger if exists users_set_updated_at
on public.users;

create trigger users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

drop trigger if exists rooms_set_updated_at
on public.rooms;

create trigger rooms_set_updated_at
before update on public.rooms
for each row
execute function public.set_updated_at();

drop trigger if exists inquiries_set_updated_at
on public.inquiries;

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row
execute function public.set_updated_at();

drop trigger if exists tenants_set_updated_at
on public.tenants;

create trigger tenants_set_updated_at
before update on public.tenants
for each row
execute function public.set_updated_at();

drop trigger if exists notifications_set_updated_at
on public.notifications;

create trigger notifications_set_updated_at
before update on public.notifications
for each row
execute function public.set_updated_at();

-- =========================================================
-- APPROVE INQUIRY AND CREATE TENANT
-- =========================================================
-- This function completes the following transaction:
--
-- 1. Validate the administrator.
-- 2. Lock and validate the inquiry.
-- 3. Lock and validate the selected room.
-- 4. Create the tenant login account.
-- 5. Create the tenant profile.
-- 6. Approve the selected inquiry.
-- 7. Mark the room as occupied.
-- 8. Reject other pending inquiries for that room.
-- 9. Create a notification.
--
-- The backend must hash the password before calling this
-- function. Never send or store a plain-text password.
-- =========================================================

create or replace function public.approve_inquiry_and_create_tenant(
  p_inquiry_id uuid,
  p_reviewed_by uuid,
  p_username text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inquiry public.inquiries%rowtype;
  v_room public.rooms%rowtype;
  v_admin public.users%rowtype;
  v_user public.users%rowtype;
  v_tenant public.tenants%rowtype;
begin
  if p_inquiry_id is null then
    raise exception 'Inquiry ID is required';
  end if;

  if p_reviewed_by is null then
    raise exception 'Reviewer ID is required';
  end if;

  if p_username is null or length(trim(p_username)) = 0 then
    raise exception 'Tenant username is required';
  end if;

  if p_password_hash is null or length(trim(p_password_hash)) = 0 then
    raise exception 'Tenant password hash is required';
  end if;

  select *
  into v_admin
  from public.users
  where id = p_reviewed_by
    and role = 'admin'
    and status = 'Active';

  if not found then
    raise exception 'Active administrator account not found';
  end if;

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

  select *
  into v_room
  from public.rooms
  where id = v_inquiry.room_id
  for update;

  if not found then
    raise exception 'Selected room not found';
  end if;

  if v_room.status <> 'Available' then
    raise exception 'Selected room is no longer available';
  end if;

  if exists (
    select 1
    from public.tenants
    where inquiry_id = v_inquiry.id
  ) then
    raise exception 'A tenant has already been created for this inquiry';
  end if;

  if exists (
    select 1
    from public.tenants
    where room_id = v_room.id
      and status = 'Active'
  ) then
    raise exception 'The selected room already has an active tenant';
  end if;

  if exists (
    select 1
    from public.users
    where lower(email) = lower(v_inquiry.email)
  ) then
    raise exception 'A user account already exists for this email';
  end if;

  if exists (
    select 1
    from public.users
    where username is not null
      and lower(username) = lower(trim(p_username))
  ) then
    raise exception 'The selected username is already in use';
  end if;

  insert into public.users (
    name,
    email,
    username,
    password_hash,
    role,
    status
  )
  values (
    trim(v_inquiry.name),
    lower(trim(v_inquiry.email)),
    trim(p_username),
    p_password_hash,
    'tenant',
    'Active'
  )
  returning *
  into v_user;

  insert into public.tenants (
    inquiry_id,
    user_id,
    room_id,
    full_name,
    email,
    contact,
    status,
    move_in_date
  )
  values (
    v_inquiry.id,
    v_user.id,
    v_room.id,
    trim(v_inquiry.name),
    lower(trim(v_inquiry.email)),
    nullif(trim(v_inquiry.contact), ''),
    'Active',
    v_inquiry.move_in_date
  )
  returning *
  into v_tenant;

  update public.inquiries
  set
    status = 'Approved',
    reviewed_by = v_admin.id,
    reviewed_at = now()
  where id = v_inquiry.id;

  update public.rooms
  set status = 'Occupied'
  where id = v_room.id;

  update public.inquiries
  set
    status = 'Rejected',
    reviewed_by = v_admin.id,
    reviewed_at = now()
  where room_id = v_room.id
    and id <> v_inquiry.id
    and status = 'Pending';

  insert into public.notifications (
    user_id,
    tenant_id,
    inquiry_id,
    title,
    message,
    type,
    is_read
  )
  values (
    v_user.id,
    v_tenant.id,
    v_inquiry.id,
    'Tenant Account Created',
    'Your inquiry was approved and your tenant account was created.',
    'Approval',
    false
  );

  return jsonb_build_object(
    'inquiryId', v_inquiry.id,
    'userId', v_user.id,
    'tenantId', v_tenant.id,
    'roomId', v_room.id,
    'roomNumber', v_room.room_number,
    'username', v_user.username,
    'status', 'Approved'
  );
end;
$$;

-- =========================================================
-- REJECT INQUIRY
-- =========================================================

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
  v_admin public.users%rowtype;
begin
  if p_inquiry_id is null then
    raise exception 'Inquiry ID is required';
  end if;

  if p_reviewed_by is null then
    raise exception 'Reviewer ID is required';
  end if;

  select *
  into v_admin
  from public.users
  where id = p_reviewed_by
    and role = 'admin'
    and status = 'Active';

  if not found then
    raise exception 'Active administrator account not found';
  end if;

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
    reviewed_by = v_admin.id,
    reviewed_at = now()
  where id = v_inquiry.id
  returning *
  into v_inquiry;

  insert into public.notifications (
    inquiry_id,
    title,
    message,
    type,
    is_read
  )
  values (
    v_inquiry.id,
    'Inquiry Rejected',
    'The submitted room inquiry was rejected.',
    'Rejection',
    false
  );

  return jsonb_build_object(
    'inquiryId', v_inquiry.id,
    'status', v_inquiry.status
  );
end;
$$;

-- =========================================================
-- ROOM AVAILABILITY VIEW
-- =========================================================

create or replace view public.available_rooms_view
with (security_invoker = true)
as
select
  id,
  room_number,
  room_type,
  description,
  monthly_rent,
  status,
  created_at,
  updated_at
from public.rooms
where status = 'Available';

-- =========================================================
-- TENANT DETAILS VIEW
-- =========================================================

create or replace view public.tenant_details_view
with (security_invoker = true)
as
select
  t.id,
  t.inquiry_id,
  t.user_id,
  t.room_id,
  t.full_name,
  t.email,
  t.contact,
  t.status,
  t.move_in_date,
  t.move_out_date,
  t.created_at,
  t.updated_at,

  u.username,
  u.role as user_role,
  u.status as account_status,

  r.room_number,
  r.room_type,
  r.monthly_rent,
  r.status as room_status
from public.tenants t
inner join public.users u
  on u.id = t.user_id
inner join public.rooms r
  on r.id = t.room_id;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.users enable row level security;
alter table public.rooms enable row level security;
alter table public.inquiries enable row level security;
alter table public.tenants enable row level security;
alter table public.notifications enable row level security;

-- =========================================================
-- PUBLIC ROOM POLICY
-- =========================================================
-- Anonymous and authenticated public users may only retrieve
-- available rooms.
-- =========================================================

drop policy if exists
  "Public can view available rooms"
on public.rooms;

create policy
  "Public can view available rooms"
on public.rooms
for select
to anon, authenticated
using (status = 'Available');

-- =========================================================
-- PUBLIC INQUIRY POLICY
-- =========================================================
-- Guests may submit inquiries.
-- They cannot read, update, or delete inquiries directly.
-- =========================================================

drop policy if exists
  "Public can submit pending inquiries"
on public.inquiries;

create policy
  "Public can submit pending inquiries"
on public.inquiries
for insert
to anon, authenticated
with check (
  status = 'Pending'
  and reviewed_by is null
  and reviewed_at is null
);

-- =========================================================
-- DATABASE PERMISSIONS
-- =========================================================

grant usage on schema public
to anon, authenticated, service_role;

revoke all
on public.users,
   public.rooms,
   public.inquiries,
   public.tenants,
   public.notifications
from anon, authenticated;

grant select
on public.rooms
to anon, authenticated;

grant insert
on public.inquiries
to anon, authenticated;

grant select, insert, update, delete
on public.users,
   public.rooms,
   public.inquiries,
   public.tenants,
   public.notifications
to service_role;

grant select
on public.available_rooms_view,
   public.tenant_details_view
to service_role;

grant select
on public.available_rooms_view
to anon, authenticated;

revoke all
on function public.approve_inquiry_and_create_tenant(
  uuid,
  uuid,
  text,
  text
)
from public, anon, authenticated;

grant execute
on function public.approve_inquiry_and_create_tenant(
  uuid,
  uuid,
  text,
  text
)
to service_role;

revoke all
on function public.reject_inquiry(
  uuid,
  uuid
)
from public, anon, authenticated;

grant execute
on function public.reject_inquiry(
  uuid,
  uuid
)
to service_role;

-- =========================================================
-- INITIAL ROOM DATA
-- =========================================================

insert into public.rooms (
  room_number,
  room_type,
  description,
  monthly_rent,
  status
)
values
  (
    '101',
    'Standard',
    'Standard apartment room',
    6500,
    'Available'
  ),
  (
    '102',
    'Standard',
    'Standard apartment room',
    6500,
    'Available'
  ),
  (
    '103',
    'Standard',
    'Standard apartment room',
    6500,
    'Available'
  )
on conflict do nothing;

commit;