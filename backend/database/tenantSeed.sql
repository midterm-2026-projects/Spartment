begin;

create extension if not exists pgcrypto;


do $$

declare

v_admin_id uuid;

v_user_1 uuid;
v_user_2 uuid;
v_user_3 uuid;

v_room_1 uuid;
v_room_2 uuid;
v_room_3 uuid;

v_inquiry_1 uuid;
v_inquiry_2 uuid;
v_inquiry_3 uuid;


begin


-- ============================================================
-- ADMIN
-- ============================================================

insert into public.users
(
name,
email,
username,
password_hash,
role,
status
)

values
(
'System Administrator',
'admin@spartment.com',
'admin',
'$2b$10$abcdefghijklmnopqrstuv',
'admin',
'Active'
)

on conflict(lower(email))
do update

set email = excluded.email

returning id into v_admin_id;



-- ============================================================
-- GET ROOMS
-- ============================================================


select id
into v_room_1
from public.rooms
order by created_at
limit 1;


select id
into v_room_2
from public.rooms
order by created_at
offset 1
limit 1;


select id
into v_room_3
from public.rooms
order by created_at
offset 2
limit 1;



if v_room_1 is null
or v_room_2 is null
or v_room_3 is null then

raise exception 'Need at least 3 rooms';

end if;



-- ============================================================
-- CREATE INQUIRIES
-- ============================================================


insert into public.inquiries
(
name,
email,
contact,
room_id,
type,
move_in_date,
message,
status,
reviewed_by,
reviewed_at
)

values
(
'Juan Dela Cruz',
'juan@gmail.com',
'09170000001',
v_room_1,
'Reservation',
'2026-01-01',
'Interested in room.',
'Approved',
v_admin_id,
now()
)

returning id into v_inquiry_1;



insert into public.inquiries
(
name,
email,
contact,
room_id,
type,
move_in_date,
message,
status,
reviewed_by,
reviewed_at
)

values
(
'Maria Santos',
'maria@gmail.com',
'09170000002',
v_room_2,
'Reservation',
'2026-01-01',
'Interested in room.',
'Approved',
v_admin_id,
now()
)

returning id into v_inquiry_2;



insert into public.inquiries
(
name,
email,
contact,
room_id,
type,
move_in_date,
message,
status,
reviewed_by,
reviewed_at
)

values
(
'Pedro Reyes',
'pedro@gmail.com',
'09170000003',
v_room_3,
'Reservation',
'2026-01-01',
'Interested in room.',
'Approved',
v_admin_id,
now()
)

returning id into v_inquiry_3;



-- ============================================================
-- CREATE USERS
-- ============================================================


insert into public.users
(
name,
email,
username,
password_hash,
role,
status
)

values
(
'Juan Dela Cruz',
'juan@gmail.com',
'juan',
'$2b$10$tenantpasswordhash1',
'tenant',
'Active'
)

returning id into v_user_1;



insert into public.users
(
name,
email,
username,
password_hash,
role,
status
)

values
(
'Maria Santos',
'maria@gmail.com',
'maria',
'$2b$10$tenantpasswordhash2',
'tenant',
'Active'
)

returning id into v_user_2;



insert into public.users
(
name,
email,
username,
password_hash,
role,
status
)

values
(
'Pedro Reyes',
'pedro@gmail.com',
'pedro',
'$2b$10$tenantpasswordhash3',
'tenant',
'Active'
)

returning id into v_user_3;



-- ============================================================
-- CREATE TENANTS
-- ============================================================


insert into public.tenants
(
inquiry_id,
user_id,
room_id,
full_name,
email,
contact,
status,
move_in_date
)

values
(
v_inquiry_1,
v_user_1,
v_room_1,
'Juan Dela Cruz',
'juan@gmail.com',
'09170000001',
'Active',
'2026-01-01'
);



insert into public.tenants
(
inquiry_id,
user_id,
room_id,
full_name,
email,
contact,
status,
move_in_date
)

values
(
v_inquiry_2,
v_user_2,
v_room_2,
'Maria Santos',
'maria@gmail.com',
'09170000002',
'Active',
'2026-01-01'
);



insert into public.tenants
(
inquiry_id,
user_id,
room_id,
full_name,
email,
contact,
status,
move_in_date
)

values
(
v_inquiry_3,
v_user_3,
v_room_3,
'Pedro Reyes',
'pedro@gmail.com',
'09170000003',
'Active',
'2026-01-01'
);



-- ============================================================
-- UPDATE ROOMS
-- ============================================================


update public.rooms

set status='Occupied'

where id in
(
v_room_1,
v_room_2,
v_room_3
);



end $$;


commit;