begin;

create extension if not exists pgcrypto;

-- ============================================================
-- FINANCIAL WORKFLOW DATABASE
-- Week 5 Day 2 Objective 2
--
-- Adds:
-- - Billing
-- - Payments
-- - Payment Transactions
-- - Utility Billing
--
-- Existing source of truth:
-- users
-- tenants
-- rooms
-- notifications
-- ============================================================


-- ============================================================
-- BILLINGS
-- ============================================================

create table if not exists public.billings (

  id uuid primary key default gen_random_uuid(),

  tenant_id uuid not null,
  room_id uuid not null,

  billing_period date not null,

  due_date date not null,

  total_amount numeric(12,2)
    not null
    default 0,

  paid_amount numeric(12,2)
    not null
    default 0,

  remaining_balance numeric(12,2)
    not null
    default 0,


  status text not null
    default 'Unpaid',


  created_at timestamptz
    not null
    default now(),

  updated_at timestamptz
    not null
    default now(),



  constraint billings_tenant_fk
    foreign key (tenant_id)
    references public.tenants(id)
    on update cascade
    on delete restrict,


  constraint billings_room_fk
    foreign key (room_id)
    references public.rooms(id)
    on update cascade
    on delete restrict,


  constraint billings_total_amount_check
    check(total_amount >= 0),


  constraint billings_paid_amount_check
    check(paid_amount >= 0),


  constraint billings_remaining_balance_check
    check(remaining_balance >= 0),


  constraint billings_paid_not_exceed_total_check
    check(
      paid_amount <= total_amount
    ),


  constraint billings_status_check
    check(
      status in (
        'Unpaid',
        'Partially Paid',
        'Paid',
        'Overdue',
        'Cancelled'
      )
    )

);



create index if not exists billings_tenant_idx
on public.billings(tenant_id);


create index if not exists billings_room_idx
on public.billings(room_id);


create index if not exists billings_status_idx
on public.billings(status);


create index if not exists billings_period_idx
on public.billings(billing_period);



-- ============================================================
-- PAYMENTS
-- ============================================================

create table if not exists public.payments (

  id uuid primary key default gen_random_uuid(),


  billing_id uuid not null,

  tenant_id uuid not null,


  amount numeric(12,2)
    not null,


  payment_method text not null,


  payment_reference text not null,


  verification_status text
    not null
    default 'Pending',


  payment_date timestamptz
    not null
    default now(),


  created_at timestamptz
    not null
    default now(),


  updated_at timestamptz
    not null
    default now(),



  constraint payments_billing_fk
    foreign key (billing_id)
    references public.billings(id)
    on update cascade
    on delete restrict,


  constraint payments_tenant_fk
    foreign key (tenant_id)
    references public.tenants(id)
    on update cascade
    on delete restrict,


  constraint payments_amount_check
    check(amount > 0),


  constraint payments_reference_not_empty
    check(
      length(trim(payment_reference)) > 0
    ),


  constraint payments_method_check
    check(
      payment_method in (
        'Cash',
        'GCash',
        'Bank Transfer',
        'Online Payment'
      )
    ),


  constraint payments_verification_check
    check(
      verification_status in (
        'Pending',
        'Verified',
        'Rejected'
      )
    )

);



create unique index if not exists payments_reference_unique_idx
on public.payments(payment_reference);



create index if not exists payments_billing_idx
on public.payments(billing_id);


create index if not exists payments_tenant_idx
on public.payments(tenant_id);


create index if not exists payments_status_idx
on public.payments(verification_status);



-- ============================================================
-- PAYMENT TRANSACTIONS
-- ============================================================

create table if not exists public.payment_transactions (

  id uuid primary key default gen_random_uuid(),


  payment_id uuid not null,


  transaction_type text not null,


  old_status text,


  new_status text,


  processed_by uuid,


  created_at timestamptz
    not null
    default now(),



  constraint payment_transactions_payment_fk
    foreign key(payment_id)
    references public.payments(id)
    on update cascade
    on delete cascade,


  constraint payment_transactions_user_fk
    foreign key(processed_by)
    references public.users(id)
    on update cascade
    on delete set null,


  constraint payment_transactions_type_check
    check(
      transaction_type in (
        'Created',
        'Verified',
        'Rejected'
      )
    )

);



create index if not exists payment_transactions_payment_idx
on public.payment_transactions(payment_id);



-- ============================================================
-- UTILITY BILLINGS
-- ============================================================

create table if not exists public.utility_billings (

  id uuid primary key default gen_random_uuid(),


  billing_id uuid not null,

  tenant_id uuid not null,


  water_amount numeric(12,2)
    not null
    default 0,


  electricity_amount numeric(12,2)
    not null
    default 0,


  internet_amount numeric(12,2)
    not null
    default 0,



  created_at timestamptz
    not null
    default now(),


  updated_at timestamptz
    not null
    default now(),



  constraint utility_billings_billing_fk
    foreign key(billing_id)
    references public.billings(id)
    on update cascade
    on delete cascade,


  constraint utility_billings_tenant_fk
    foreign key(tenant_id)
    references public.tenants(id)
    on update cascade
    on delete restrict,


  constraint utility_amounts_check
    check(
      water_amount >= 0
      and electricity_amount >= 0
      and internet_amount >= 0
    )

);



create index if not exists utility_billings_billing_idx
on public.utility_billings(billing_id);



-- ============================================================
-- UPDATED AT TRIGGERS
-- Uses existing set_updated_at()
-- ============================================================


drop trigger if exists billings_set_updated_at
on public.billings;


create trigger billings_set_updated_at
before update on public.billings
for each row
execute function public.set_updated_at();



drop trigger if exists payments_set_updated_at
on public.payments;


create trigger payments_set_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();



drop trigger if exists utility_billings_set_updated_at
on public.utility_billings;


create trigger utility_billings_set_updated_at
before update on public.utility_billings
for each row
execute function public.set_updated_at();



-- ============================================================
-- FINANCIAL VIEWS
-- ============================================================


create or replace view public.tenant_billing_statement_view
with(security_invoker = true)
as

select

b.id as billing_id,

b.tenant_id,

t.full_name,

r.room_number,

b.billing_period,

b.due_date,

b.total_amount,

b.paid_amount,

b.remaining_balance,

b.status,

b.created_at

from public.billings b

join public.tenants t
on t.id = b.tenant_id

join public.rooms r
on r.id = b.room_id;



create or replace view public.tenant_payment_history_view
with(security_invoker = true)
as

select

p.id as payment_id,

p.tenant_id,

t.full_name,

p.amount,

p.payment_method,

p.payment_reference,

p.verification_status,

p.payment_date


from public.payments p

join public.tenants t

on t.id = p.tenant_id;



create or replace view public.financial_dashboard_view
with(security_invoker = true)
as


select

count(*) as total_billings,


sum(total_amount)
as total_billed,


sum(
case

when status = 'Paid'
then total_amount

else 0

end
)
as total_collected,


sum(remaining_balance)
as outstanding_balance


from public.billings;



-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================


alter table public.billings
enable row level security;


alter table public.payments
enable row level security;


alter table public.payment_transactions
enable row level security;


alter table public.utility_billings
enable row level security;



-- ============================================================
-- TENANT BILLING ACCESS
-- ============================================================


drop policy if exists
"Tenant can view own bills"
on public.billings;


create policy
"Tenant can view own bills"

on public.billings

for select

to authenticated

using(

tenant_id in(

select id

from public.tenants

where user_id = auth.uid()

)

);



drop policy if exists
"Tenant can view own payments"
on public.payments;


create policy
"Tenant can view own payments"

on public.payments

for select

to authenticated

using(

tenant_id in(

select id

from public.tenants

where user_id = auth.uid()

)

);



-- ============================================================
-- SERVICE ROLE ACCESS
-- ============================================================


grant select,insert,update,delete

on public.billings,

public.payments,

public.payment_transactions,

public.utility_billings

to service_role;



grant select

on public.financial_dashboard_view,

public.tenant_billing_statement_view,

public.tenant_payment_history_view

to service_role;



commit;