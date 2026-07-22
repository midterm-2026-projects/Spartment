-- Idempotent demo account seed. It never changes an existing real tenant.
-- The demo tenant is inactive so it may safely reference an occupied room.

do $$
declare
  demo_user_id uuid;
  demo_inquiry_id uuid;
  demo_tenant_id uuid;
  demo_room_id uuid;
begin
  select id into demo_room_id from public.rooms
  order by case when room_number = '101' then 0 else 1 end, room_number limit 1;
  if demo_room_id is null then raise exception 'Create at least one room first.'; end if;

  select id into demo_user_id from public.users
  where lower(email) = 'tenant.demo@spartment.local';
  if demo_user_id is null then
    insert into public.users (name,email,username,password_hash,role,status)
    values ('Demo Tenant','tenant.demo@spartment.local','tenant.demo',
      '$2b$12$M9JhQBEYt7JyFnKsuD8qo.KhUHL8J98wp6cDRkcn0QRd9u2z6Rs6m','tenant','Active')
    returning id into demo_user_id;
  else
    update public.users set
      password_hash='$2b$12$M9JhQBEYt7JyFnKsuD8qo.KhUHL8J98wp6cDRkcn0QRd9u2z6Rs6m', status='Active'
    where id=demo_user_id;
  end if;

  select id into demo_tenant_id from public.tenants where user_id=demo_user_id;
  if demo_tenant_id is null then
    select id into demo_inquiry_id from public.inquiries
    where lower(email)='tenant.demo@spartment.local' limit 1;
    if demo_inquiry_id is null then
      insert into public.inquiries
        (name,email,contact,room_id,type,move_in_date,message,status,reviewed_at)
      values
        ('Demo Tenant','tenant.demo@spartment.local','09000000000',demo_room_id,
         'Room Inquiry',current_date,'Tenant portal demo account','Approved',now())
      returning id into demo_inquiry_id;
    end if;
    insert into public.tenants
      (inquiry_id,user_id,room_id,full_name,email,contact,status,move_in_date)
    values
      (demo_inquiry_id,demo_user_id,demo_room_id,'Demo Tenant',
       'tenant.demo@spartment.local','09000000000','Inactive',current_date);
  end if;
end $$;
