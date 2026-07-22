begin;


-- ============================================================
-- DSS WORKFLOW TRIGGERS
--
-- Automatically refresh:
-- - Risk Assessment
-- - Recommendations
--
-- Trigger sources:
-- - Payment verification update
-- - Billing status update
-- - Room occupancy update
--
-- ============================================================




-- ============================================================
-- PAYMENT UPDATE TRIGGER
-- ============================================================
-- When payment status changes:
-- Verified
-- Rejected
--
-- Refresh tenant DSS
-- ============================================================


create or replace function public.trigger_payment_dss_refresh()

returns trigger

language plpgsql

security definer

set search_path = public

as $$


begin



    if (

        old.verification_status

        is distinct from

        new.verification_status

    )

    then


        perform public.refresh_tenant_dss(

            new.tenant_id

        );


    end if;




    return new;



end;

$$;





drop trigger if exists payment_dss_refresh_trigger

on public.payments;




create trigger payment_dss_refresh_trigger


after update

on public.payments


for each row


execute function public.trigger_payment_dss_refresh();








-- ============================================================
-- BILLING UPDATE TRIGGER
-- ============================================================
-- Refresh when:
--
-- Remaining balance changes
-- Status changes
--
-- ============================================================


create or replace function public.trigger_billing_dss_refresh()

returns trigger


language plpgsql


security definer


set search_path = public


as $$


begin




    if

    (

        old.status

        is distinct from

        new.status


        or


        old.remaining_balance

        is distinct from

        new.remaining_balance

    )

    then



        perform public.refresh_tenant_dss(

            new.tenant_id

        );



    end if;




    return new;



end;

$$;







drop trigger if exists billing_dss_refresh_trigger

on public.billings;





create trigger billing_dss_refresh_trigger


after update


on public.billings


for each row


execute function public.trigger_billing_dss_refresh();








-- ============================================================
-- ROOM OCCUPANCY TRIGGER
-- ============================================================
-- Detect:
--
-- Available
-- Occupied
-- Maintenance
--
-- ============================================================


create or replace function public.trigger_room_dss_refresh()

returns trigger


language plpgsql


security definer


set search_path = public


as $$


declare


    tenant_record record;



begin




    if

    (

        old.status

        is distinct from

        new.status

    )

    then




        for tenant_record in


            select id

            from public.tenants

            where room_id = new.id


        loop



            perform public.refresh_tenant_dss(

                tenant_record.id

            );



        end loop;



    end if;




    return new;



end;

$$;







drop trigger if exists room_dss_refresh_trigger

on public.rooms;






create trigger room_dss_refresh_trigger


after update


on public.rooms


for each row


execute function public.trigger_room_dss_refresh();








-- ============================================================
-- MANUAL SYSTEM REFRESH FUNCTION
-- ============================================================
-- Used by:
--
-- Admin dashboard refresh button
-- Scheduled jobs
-- Testing
--
-- ============================================================


create or replace function public.refresh_all_dss()


returns jsonb


language plpgsql


security definer


set search_path = public


as $$


declare


    tenant_record record;


    total integer := 0;



begin




    for tenant_record in


        select id

        from public.tenants

        where status = 'Active'


    loop



        perform public.refresh_tenant_dss(

            tenant_record.id

        );



        total := total + 1;



    end loop;




    return jsonb_build_object

    (

        'processed_tenants',

        total,


        'status',

        'completed'

    );



end;

$$;







-- ============================================================
-- PERMISSIONS
-- ============================================================



revoke all

on function public.refresh_all_dss()

from public, anon, authenticated;



grant execute

on function public.refresh_all_dss()

to service_role;



commit;