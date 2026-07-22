-- Admin dashboard demo data. Safe to run more than once.
begin;

do $$
declare
  v_admin uuid;
  v_tenant uuid;
  v_room uuid;
  v_billing uuid;
  v_payment uuid;
  v_risk uuid;
begin
  select id into v_admin from public.users
  where lower(email) = 'admin.demo@spartment.local';
  if v_admin is null then
    raise exception 'Create admin.demo@spartment.local before running this seed.';
  end if;

  -- Prefer a tenant that is already active. This avoids violating the
  -- one-active-tenant-per-room constraint when demo and real tenants share a room.
  select t.id, t.room_id into v_tenant, v_room
  from public.tenants t
  order by case when lower(t.status) = 'active' then 0 else 1 end, t.created_at
  limit 1;
  if v_tenant is null then raise exception 'Create at least one tenant first.'; end if;

  update public.rooms set status = 'Occupied' where id = v_room;

  select id into v_billing from public.billings
  where tenant_id = v_tenant and billing_period = date_trunc('month', current_date)::date
  order by created_at desc limit 1;
  if v_billing is null then
    insert into public.billings
      (tenant_id, room_id, billing_period, due_date, total_amount, paid_amount,
       remaining_balance, status)
    values
      (v_tenant, v_room, date_trunc('month',current_date)::date,
       current_date - 5, 6500, 0, 6500, 'Overdue')
    returning id into v_billing;
  else
    update public.billings set total_amount=6500, paid_amount=0,
      remaining_balance=6500, due_date=current_date-5, status='Overdue'
    where id=v_billing;
  end if;

  select id into v_payment from public.payments
  where payment_reference='ADMIN-DASHBOARD-DEMO' limit 1;
  if v_payment is null then
    insert into public.payments
      (billing_id,tenant_id,amount,payment_method,payment_reference,
       verification_status,payment_date)
    values
      (v_billing,v_tenant,39000,'Cash','ADMIN-DASHBOARD-DEMO',
       'Verified',now())
    returning id into v_payment;
  end if;

  delete from public.notifications
  where user_id=v_admin and title like '[Dashboard Demo]%';
  insert into public.notifications (user_id,title,message,type,is_read,created_at) values
    (v_admin,'[Dashboard Demo] Payment received','A verified payment was recorded for the current period.','Information',false,now()-interval '2 hours'),
    (v_admin,'[Dashboard Demo] Late payment alert','A tenant billing statement is overdue.','Information',false,now()-interval '5 hours'),
    (v_admin,'[Dashboard Demo] Maintenance request','A tenant submitted a maintenance concern.','Information',false,now()-interval '1 day'),
    (v_admin,'[Dashboard Demo] New inquiry','A guest is interested in an available room.','Inquiry',false,now()-interval '1 day');

  select id into v_risk from public.risk_assessments
  where tenant_id=v_tenant and source_condition='Admin dashboard demo seed' limit 1;
  if v_risk is null then
    insert into public.risk_assessments
      (tenant_id,room_id,billing_id,payment_id,risk_score,risk_level,
       risk_category,source_condition,status)
    values
      (v_tenant,v_room,v_billing,v_payment,75,'High','Payment',
       'Admin dashboard demo seed','Active')
    returning id into v_risk;
  end if;

  -- The live schema permits only one active recommendation for each
  -- tenant + risk assessment + category combination.
  delete from public.recommendations
  where risk_assessment_id = v_risk;
  insert into public.recommendations
    (risk_assessment_id,tenant_id,title,description,priority,
     category,status,generated_date)
  values
    (v_risk,v_tenant,'Follow up on late payments',
     'A tenant is past due. Send a payment reminder today.','High','Payment','Active',now()),
    (v_risk,v_tenant,'Review vacant room availability',
     'Promote available rooms to recent customer inquiries.','Medium','Occupancy','Active',now()),
    (v_risk,v_tenant,'Revenue tracking on target',
     'Verified collections have been added for this month.','Low','Revenue','Active',now());
end $$;

commit;
