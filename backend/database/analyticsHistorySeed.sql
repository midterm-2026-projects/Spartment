-- Adds six months of idempotent billing history for Analytics & Reports.
-- Run in Supabase SQL Editor when the revenue charts have only one month.
begin;

with months as (
  select generate_series(1, 6) as months_ago
), active_tenants as (
  select t.id tenant_id, t.room_id, coalesce(r.monthly_rent,6500)::numeric(12,2) rent,
         row_number() over(order by t.created_at,t.id) rn
  from public.tenants t join public.rooms r on r.id=t.room_id
  where lower(t.status)='active'
), candidates as (
  select a.*, (date_trunc('month',current_date)-(m.months_ago||' months')::interval)::date period
  from active_tenants a cross join months m
)
insert into public.billings
  (tenant_id,room_id,billing_period,due_date,total_amount,paid_amount,remaining_balance,status)
select tenant_id,room_id,period,(period+interval '14 days')::date,rent,
  case when (rn+extract(month from period)::int)%5=0 then 0 else rent end,
  case when (rn+extract(month from period)::int)%5=0 then rent else 0 end,
  case when (rn+extract(month from period)::int)%5=0 then 'Overdue' else 'Paid' end
from candidates c
where not exists (
  select 1 from public.billings b
  where b.tenant_id=c.tenant_id and b.billing_period=c.period
);

commit;

select billing_period,sum(total_amount) forecast,sum(paid_amount) actual
from public.billings
group by billing_period
order by billing_period;
