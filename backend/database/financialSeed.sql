begin;

create extension if not exists pgcrypto;


-- ============================================================
-- FINANCIAL SEED DATA
-- Week 5 Day 2 Objective 2
--
-- Creates:
-- Paid billing
-- Unpaid billing
-- Partially Paid billing
-- Overdue billing
--
-- Creates:
-- Verified payment
-- Pending payment
-- Rejected payment
-- ============================================================



-- ============================================================
-- GET EXISTING TENANTS
-- ============================================================


do $$

declare


v_tenant_1 uuid;
v_tenant_2 uuid;
v_tenant_3 uuid;


v_room_1 uuid;
v_room_2 uuid;
v_room_3 uuid;


v_paid_bill uuid;
v_partial_bill uuid;
v_unpaid_bill uuid;
v_overdue_bill uuid;


begin



-- ============================================================
-- FETCH EXISTING DATA
-- ============================================================


select id

into v_tenant_1

from public.tenants

order by created_at

limit 1;



select id

into v_room_1

from public.rooms

order by created_at

limit 1;



select id

into v_tenant_2

from public.tenants

order by created_at

offset 1

limit 1;



select id

into v_room_2

from public.rooms

order by created_at

offset 1

limit 1;



select id

into v_tenant_3

from public.tenants

order by created_at

offset 2

limit 1;



select id

into v_room_3

from public.rooms

order by created_at

offset 2

limit 1;



if v_tenant_1 is null then

raise exception
'No tenants found. Create tenant accounts first.';

end if;



-- ============================================================
-- PAID BILLING
-- ============================================================


insert into public.billings(

tenant_id,

room_id,

billing_period,

due_date,

total_amount,

paid_amount,

remaining_balance,

status

)

values(

v_tenant_1,

v_room_1,

'2026-01-01',

'2026-01-15',

6500,

6500,

0,

'Paid'

)

returning id

into v_paid_bill;



insert into public.payments(

billing_id,

tenant_id,

amount,

payment_method,

payment_reference,

verification_status,

payment_date

)

values(

v_paid_bill,

v_tenant_1,

6500,

'GCash',

'PAY-PAID-001',

'Verified',

'2026-01-10'

);



-- ============================================================
-- PARTIALLY PAID BILLING
-- ============================================================


insert into public.billings(

tenant_id,

room_id,

billing_period,

due_date,

total_amount,

paid_amount,

remaining_balance,

status

)

values(

v_tenant_2,

v_room_2,

'2026-02-01',

'2026-02-15',

7000,

3000,

4000,

'Partially Paid'

)

returning id

into v_partial_bill;



insert into public.payments(

billing_id,

tenant_id,

amount,

payment_method,

payment_reference,

verification_status,

payment_date

)

values(

v_partial_bill,

v_tenant_2,

3000,

'Cash',

'PAY-PARTIAL-001',

'Verified',

'2026-02-10'

);



-- ============================================================
-- UNPAID BILLING
-- ============================================================


insert into public.billings(

tenant_id,

room_id,

billing_period,

due_date,

total_amount,

paid_amount,

remaining_balance,

status

)

values(

v_tenant_3,

v_room_3,

'2026-03-01',

'2026-03-15',

6500,

0,

6500,

'Unpaid'

)

returning id

into v_unpaid_bill;



-- ============================================================
-- OVERDUE BILLING
-- ============================================================


insert into public.billings(

tenant_id,

room_id,

billing_period,

due_date,

total_amount,

paid_amount,

remaining_balance,

status

)

values(

v_tenant_1,

v_room_1,

'2025-12-01',

'2025-12-15',

6500,

0,

6500,

'Overdue'

)

returning id

into v_overdue_bill;



-- ============================================================
-- PENDING PAYMENT
-- ============================================================


insert into public.payments(

billing_id,

tenant_id,

amount,

payment_method,

payment_reference,

verification_status

)

values(

v_unpaid_bill,

v_tenant_3,

6500,

'Online Payment',

'PAY-PENDING-001',

'Pending'

);



-- ============================================================
-- REJECTED PAYMENT
-- ============================================================


insert into public.payments(

billing_id,

tenant_id,

amount,

payment_method,

payment_reference,

verification_status

)

values(

v_overdue_bill,

v_tenant_1,

6500,

'GCash',

'PAY-REJECTED-001',

'Rejected'

);



-- ============================================================
-- UTILITY BILLING SAMPLE
-- ============================================================


insert into public.utility_billings(

billing_id,

tenant_id,

water_amount,

electricity_amount,

internet_amount

)

values(

v_paid_bill,

v_tenant_1,

500,

1200,

800

);



end $$;



commit;