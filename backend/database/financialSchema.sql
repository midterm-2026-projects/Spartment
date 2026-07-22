begin;

create extension if not exists pgcrypto;


-- =========================================================
-- BILLINGS TABLE
-- =========================================================

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


    billing_type text not null
        default 'Rent',


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


    constraint billing_total_amount_check
        check(total_amount >= 0),


    constraint billing_paid_amount_check
        check(paid_amount >= 0),


    constraint billing_balance_check
        check(remaining_balance >= 0),



    constraint billing_status_check
        check(
            status in
            (
                'Unpaid',
                'Partially Paid',
                'Paid',
                'Overdue',
                'Cancelled'
            )
        ),



    constraint billing_type_check
        check(
            billing_type in
            (
                'Rent',
                'Utility',
                'Combined'
            )
        )

);



create index if not exists
billings_tenant_idx
on public.billings(tenant_id);



create index if not exists
billings_status_idx
on public.billings(status);



create index if not exists
billings_period_idx
on public.billings(billing_period desc);




-- =========================================================
-- UTILITY BILLINGS TABLE
-- =========================================================

create table if not exists public.utility_billings (

    id uuid primary key default gen_random_uuid(),


    billing_id uuid not null,


    electricity_amount numeric(12,2)
        not null
        default 0,


    water_amount numeric(12,2)
        not null
        default 0,


    total_amount numeric(12,2)
        not null
        default 0,


    created_at timestamptz
        not null
        default now(),


    updated_at timestamptz
        not null
        default now(),



    constraint utility_billings_fk
        foreign key(billing_id)
        references public.billings(id)
        on delete cascade,



    constraint electricity_amount_check
        check(electricity_amount >= 0),


    constraint water_amount_check
        check(water_amount >= 0),


    constraint utility_total_check
        check(total_amount >= 0)

);



-- =========================================================
-- PAYMENTS TABLE
-- =========================================================

create table if not exists public.payments (

    id uuid primary key default gen_random_uuid(),


    billing_id uuid not null,

    tenant_id uuid not null,


    amount numeric(12,2)
        not null,


    payment_method text
        not null
        default 'Cash',


    payment_reference text,


    verification_status text
        not null
        default 'Pending',


    payment_status text
        not null
        default 'Pending',



    payment_date timestamptz
        not null
        default now(),



    verified_by uuid,


    verified_at timestamptz,



    created_at timestamptz
        not null
        default now(),


    updated_at timestamptz
        not null
        default now(),



    constraint payments_billing_fk
        foreign key(billing_id)
        references public.billings(id)
        on delete restrict,



    constraint payments_tenant_fk
        foreign key(tenant_id)
        references public.tenants(id)
        on delete restrict,



    constraint payments_verified_by_fk
        foreign key(verified_by)
        references public.users(id)
        on delete set null,



    constraint payment_amount_check
        check(amount > 0),



    constraint payment_method_check
        check(
            payment_method in
            (
                'Cash',
                'GCash',
                'Bank Transfer'
            )
        ),



    constraint payment_verification_check
        check(
            verification_status in
            (
                'Pending',
                'Verified',
                'Rejected'
            )
        ),



    constraint payment_status_check
        check(
            payment_status in
            (
                'Pending',
                'Completed',
                'Rejected'
            )
        )

);



-- Prevent duplicate payment references

create unique index if not exists
payments_reference_unique_idx

on public.payments(payment_reference)

where payment_reference is not null;



create index if not exists
payments_billing_idx
on public.payments(billing_id);



create index if not exists
payments_tenant_idx
on public.payments(tenant_id);





-- =========================================================
-- PAYMENT TRANSACTIONS TABLE
-- =========================================================

create table if not exists public.payment_transactions (

    id uuid primary key default gen_random_uuid(),


    payment_id uuid not null,


    transaction_type text not null,


    amount numeric(12,2)
        not null,


    description text,


    created_at timestamptz
        not null
        default now(),



    constraint payment_transactions_fk
        foreign key(payment_id)
        references public.payments(id)
        on delete cascade,



    constraint transaction_amount_check
        check(amount > 0)

);



-- =========================================================
-- UPDATED AT TRIGGERS
-- =========================================================


drop trigger if exists billings_updated_at
on public.billings;


create trigger billings_updated_at

before update
on public.billings

for each row

execute function public.set_updated_at();



drop trigger if exists payments_updated_at
on public.payments;


create trigger payments_updated_at

before update
on public.payments

for each row

execute function public.set_updated_at();



drop trigger if exists utility_billings_updated_at
on public.utility_billings;


create trigger utility_billings_updated_at

before update
on public.utility_billings

for each row

execute function public.set_updated_at();




-- =========================================================
-- RLS
-- =========================================================


alter table public.billings enable row level security;

alter table public.payments enable row level security;

alter table public.utility_billings enable row level security;

alter table public.payment_transactions enable row level security;



-- Backend uses service role

grant select,insert,update,delete

on public.billings,
   public.payments,
   public.utility_billings,
   public.payment_transactions

to service_role;



commit;