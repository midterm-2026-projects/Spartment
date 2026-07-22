-- Idempotent demo data for the admin Billing page.
-- Run this in the Supabase SQL editor. Re-running it will not duplicate rows.
begin;

with active_tenants as (
  select
    t.id as tenant_id,
    t.room_id,
    coalesce(r.monthly_rent, 6500)::numeric(12,2) as rent,
    row_number() over (order by t.created_at, t.id) as rn
  from public.tenants t
  join public.rooms r on r.id = t.room_id
  where lower(t.status) = 'active'
), missing_bills as (
  select a.*
  from active_tenants a
  where not exists (
    select 1
    from public.billings b
    where b.tenant_id = a.tenant_id
      and b.billing_period = date_trunc('month', current_date)::date
  )
)
insert into public.billings (
  tenant_id, room_id, billing_period, due_date,
  total_amount, paid_amount, remaining_balance, status
)
select
  tenant_id,
  room_id,
  date_trunc('month', current_date)::date,
  (date_trunc('month', current_date) + interval '14 days')::date,
  rent,
  case
    when rn % 4 = 1 then rent
    when rn % 4 = 0 then round(rent / 2, 2)
    else 0
  end,
  case
    when rn % 4 = 1 then 0
    when rn % 4 = 0 then rent - round(rent / 2, 2)
    else rent
  end,
  case
    when rn % 4 = 1 then 'Paid'
    when rn % 4 = 2 then 'Unpaid'
    when rn % 4 = 3 then 'Overdue'
    else 'Partially Paid'
  end
from missing_bills;

insert into public.utility_billings (
  billing_id, tenant_id, water_amount, electricity_amount, internet_amount
)
select
  b.id,
  b.tenant_id,
  (180 + (row_number() over (order by b.tenant_id) * 10))::numeric(12,2),
  (720 + (row_number() over (order by b.tenant_id) * 35))::numeric(12,2),
  0
from public.billings b
where b.billing_period = date_trunc('month', current_date)::date
  and not exists (
    select 1 from public.utility_billings u where u.billing_id = b.id
  );

commit;

-- Verification
select
  b.billing_period,
  count(*) as bills,
  sum(b.total_amount) as billed,
  sum(b.paid_amount) as collected,
  sum(b.remaining_balance) filter (where b.status in ('Unpaid','Partially Paid')) as pending,
  sum(b.remaining_balance) filter (where b.status = 'Overdue') as late
from public.billings b
where b.billing_period = date_trunc('month', current_date)::date
group by b.billing_period;
