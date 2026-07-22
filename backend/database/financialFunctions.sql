begin;

-- ============================================================
-- FINANCIAL FUNCTIONS
-- Week 5 Day 2 Objective 2
--
-- Handles:
-- - Billing creation
-- - Payment verification
-- - Payment rejection
-- - Balance recalculation
-- - Billing status updates
-- - Overdue billing updates
-- - Notification creation
--
-- All critical financial updates happen atomically.
-- ============================================================



-- ============================================================
-- CREATE BILLING RECORD
-- ============================================================


create or replace function public.create_billing_record(

  p_tenant_id uuid,

  p_room_id uuid,

  p_billing_period date,

  p_due_date date,

  p_total_amount numeric

)

returns jsonb

language plpgsql

security definer

set search_path = public

as $$


declare

  v_billing_id uuid;


begin


  if p_total_amount < 0 then

    raise exception
    'Billing amount cannot be negative';

  end if;



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

    p_tenant_id,

    p_room_id,

    p_billing_period,

    p_due_date,

    p_total_amount,

    0,

    p_total_amount,

    case

      when p_due_date < current_date

      then 'Overdue'

      else 'Unpaid'

    end

  )

  returning id

  into v_billing_id;



  insert into public.notifications(

    tenant_id,

    title,

    message,

    type,

    is_read

  )

  values(

    p_tenant_id,

    'New Billing Created',

    'A new billing statement has been generated.',

    'Information',

    false

  );



  return jsonb_build_object(

    'billing_id',

    v_billing_id,

    'status',

    'created'

  );


end;

$$;



-- ============================================================
-- RECALCULATE BILLING BALANCE
-- ============================================================


create or replace function public.recalculate_billing_balance(

  p_billing_id uuid

)

returns jsonb

language plpgsql

security definer

set search_path = public

as $$


declare

  v_total numeric;

  v_paid numeric;

  v_remaining numeric;

  v_status text;


begin



  select

    total_amount

  into

    v_total

  from public.billings

  where id = p_billing_id

  for update;



  if not found then

    raise exception
    'Billing record not found';

  end if;



  select

    coalesce(sum(amount),0)

  into

    v_paid

  from public.payments

  where billing_id = p_billing_id

  and verification_status = 'Verified';



  v_remaining := v_total - v_paid;



  if v_remaining <= 0 then


    v_remaining := 0;

    v_status := 'Paid';


  elsif v_paid > 0 then


    v_status := 'Partially Paid';


  elsif exists(

    select 1

    from public.billings

    where id = p_billing_id

    and due_date < current_date

  ) then


    v_status := 'Overdue';


  else


    v_status := 'Unpaid';


  end if;



  update public.billings

  set

    paid_amount = v_paid,

    remaining_balance = v_remaining,

    status = v_status,

    updated_at = now()


  where id = p_billing_id;



  return jsonb_build_object(

    'billing_id',

    p_billing_id,

    'paid_amount',

    v_paid,

    'remaining_balance',

    v_remaining,

    'status',

    v_status

  );


end;

$$;



-- ============================================================
-- VERIFY PAYMENT
-- ============================================================


create or replace function public.verify_payment(

  p_payment_id uuid,

  p_verified_by uuid

)

returns jsonb

language plpgsql

security definer

set search_path = public

as $$


declare

  v_payment public.payments%rowtype;

  v_billing_status text;


begin



  select *

  into v_payment

  from public.payments

  where id = p_payment_id

  for update;



  if not found then

    raise exception
    'Payment not found';

  end if;



  if v_payment.verification_status <> 'Pending' then

    raise exception
    'Only pending payments can be verified';

  end if;



  update public.payments

  set

    verification_status = 'Verified',

    updated_at = now()

  where id = p_payment_id;



  insert into public.payment_transactions(

    payment_id,

    transaction_type,

    old_status,

    new_status,

    processed_by

  )

  values(

    p_payment_id,

    'Verified',

    'Pending',

    'Verified',

    p_verified_by

  );



  perform public.recalculate_billing_balance(

    v_payment.billing_id

  );



  select status

  into v_billing_status

  from public.billings

  where id = v_payment.billing_id;



  insert into public.notifications(

    tenant_id,

    title,

    message,

    type,

    is_read

  )

  values(

    v_payment.tenant_id,

    'Payment Verified',

    'Your payment has been verified successfully.',

    'Information',

    false

  );



  return jsonb_build_object(

    'payment_id',

    p_payment_id,

    'status',

    'Verified',

    'billing_status',

    v_billing_status

  );


end;

$$;



-- ============================================================
-- REJECT PAYMENT
-- ============================================================


create or replace function public.reject_payment(

  p_payment_id uuid,

  p_rejected_by uuid

)

returns jsonb

language plpgsql

security definer

set search_path = public

as $$


declare

  v_payment public.payments%rowtype;


begin



  select *

  into v_payment

  from public.payments

  where id = p_payment_id

  for update;



  if not found then

    raise exception
    'Payment not found';

  end if;



  if v_payment.verification_status <> 'Pending' then

    raise exception
    'Only pending payments can be rejected';

  end if;



  update public.payments

  set

    verification_status = 'Rejected',

    updated_at = now()

  where id = p_payment_id;



  insert into public.payment_transactions(

    payment_id,

    transaction_type,

    old_status,

    new_status,

    processed_by

  )

  values(

    p_payment_id,

    'Rejected',

    'Pending',

    'Rejected',

    p_rejected_by

  );



  perform public.recalculate_billing_balance(

    v_payment.billing_id

  );



  insert into public.notifications(

    tenant_id,

    title,

    message,

    type,

    is_read

  )

  values(

    v_payment.tenant_id,

    'Payment Rejected',

    'Your payment submission was rejected.',

    'Information',

    false

  );



  return jsonb_build_object(

    'payment_id',

    p_payment_id,

    'status',

    'Rejected'

  );


end;

$$;



-- ============================================================
-- UPDATE OVERDUE BILLINGS
-- ============================================================


create or replace function public.update_overdue_billings()

returns integer

language plpgsql

security definer

set search_path = public

as $$


declare

  v_count integer;


begin



  update public.billings

  set

    status = 'Overdue',

    updated_at = now()


  where

    due_date < current_date

    and remaining_balance > 0

    and status in(

      'Unpaid',

      'Partially Paid'

    );



  get diagnostics v_count = row_count;



  return v_count;


end;

$$;



-- ============================================================
-- PERMISSIONS
-- ============================================================


revoke all

on function public.create_billing_record(
uuid,
uuid,
date,
date,
numeric
)

from public, anon, authenticated;



grant execute

on function public.create_billing_record(
uuid,
uuid,
date,
date,
numeric
)

to service_role;



revoke all

on function public.verify_payment(
uuid,
uuid
)

from public, anon, authenticated;



grant execute

on function public.verify_payment(
uuid,
uuid
)

to service_role;



revoke all

on function public.reject_payment(
uuid,
uuid
)

from public, anon, authenticated;



grant execute

on function public.reject_payment(
uuid,
uuid
)

to service_role;



grant execute

on function public.recalculate_billing_balance(
uuid
)

to service_role;



grant execute

on function public.update_overdue_billings()

to service_role;



commit;