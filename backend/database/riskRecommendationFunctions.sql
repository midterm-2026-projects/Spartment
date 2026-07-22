begin;


-- ============================================================
-- GENERATE RISK ASSESSMENT
-- ============================================================
-- Calculates tenant risk based on:
--
-- 1. Late payments
-- 2. Outstanding balances
-- 3. Payment behavior
--
-- ============================================================


create or replace function public.generate_risk_assessment(

    p_tenant_id uuid

)

returns jsonb

language plpgsql

security definer

set search_path = public

as $$


declare


    v_late_payments integer;

    v_balance numeric;


    v_score numeric;

    v_level text;

    v_category text;


    v_risk_id uuid;



begin



    if p_tenant_id is null then

        raise exception

        'Tenant ID is required';

    end if;




    -- ========================================================
    -- GET PAYMENT BEHAVIOR
    -- ========================================================


    select

        count(*)


    into

        v_late_payments


    from public.payments p


    join public.billings b

    on b.id = p.billing_id


    where p.tenant_id = p_tenant_id

    and (

        b.status = 'Overdue'

        or

        p.verification_status = 'Rejected'

    );






    -- ========================================================
    -- GET BALANCE
    -- ========================================================


    select

        coalesce(

            sum(remaining_balance),

            0

        )


    into

        v_balance


    from public.billings


    where tenant_id = p_tenant_id;






    -- ========================================================
    -- RISK SCORING
    -- ========================================================



    v_score := 0;



    if v_late_payments >= 3 then


        v_score := v_score + 60;


    elsif v_late_payments > 0 then


        v_score := v_score + 30;


    end if;




    if v_balance >= 5000 then


        v_score := v_score + 40;


    elsif v_balance > 0 then


        v_score := v_score + 20;


    end if;





    if v_score >= 70 then


        v_level := 'High';


    elsif v_score >= 40 then


        v_level := 'Medium';


    else


        v_level := 'Low';


    end if;




    if v_late_payments > 0 then


        v_category := 'Payment';


    else


        v_category := 'Billing';


    end if;






    -- ========================================================
    -- INSERT RISK ASSESSMENT
    -- ========================================================



    insert into public.risk_assessments

    (

        tenant_id,

        risk_score,

        risk_level,

        risk_category,

        source_condition

    )


    values

    (

        p_tenant_id,

        v_score,

        v_level,

        v_category,


        concat(

            'Late payments: ',

            v_late_payments,

            ', Outstanding balance: ',

            v_balance

        )

    )


    returning id

    into v_risk_id;







    -- ========================================================
    -- INSERT INDICATORS
    -- ========================================================



    if v_late_payments > 0 then


        insert into public.risk_indicators

        (

            risk_assessment_id,

            indicator,

            severity

        )


        values

        (

            v_risk_id,


            concat(

                v_late_payments,

                ' late payment record(s) detected.'

            ),


            v_level

        );


    end if;





    if v_balance > 0 then


        insert into public.risk_indicators

        (

            risk_assessment_id,

            indicator,

            severity

        )


        values

        (

            v_risk_id,


            concat(

                'Outstanding balance: ',

                v_balance

            ),


            v_level

        );


    end if;







    return jsonb_build_object

    (

        'risk_id',

        v_risk_id,


        'tenant_id',

        p_tenant_id,


        'score',

        v_score,


        'level',

        v_level

    );



end;

$$;






-- ============================================================
-- GENERATE RECOMMENDATION
-- ============================================================
-- Creates recommendation based on risk level.
--
-- ============================================================



create or replace function public.generate_recommendation(

    p_risk_assessment_id uuid

)


returns jsonb


language plpgsql


security definer


set search_path = public


as $$


declare


    v_risk public.risk_assessments%rowtype;


    v_recommendation_id uuid;



begin



    select *

    into v_risk


    from public.risk_assessments


    where id = p_risk_assessment_id;



    if not found then


        raise exception

        'Risk assessment not found';


    end if;







    -- prevent duplicate active recommendation


    if exists

    (

        select 1

        from public.recommendations


        where risk_assessment_id = p_risk_assessment_id


        and status = 'Active'

    )

    then


        return jsonb_build_object

        (

            'message',

            'Recommendation already exists'

        );


    end if;







    insert into public.recommendations

    (

        risk_assessment_id,

        tenant_id,

        title,

        description,

        priority,

        category

    )


    values

    (

        v_risk.id,


        v_risk.tenant_id,



        case


            when v_risk.risk_level = 'High'

            then 'Immediate Tenant Review Required'


            when v_risk.risk_level = 'Medium'

            then 'Monitor Tenant Account'


            else 'Maintain Current Payment Behavior'


        end,




        case


            when v_risk.risk_level = 'High'

            then 'Contact tenant and create payment resolution plan.'



            when v_risk.risk_level = 'Medium'

            then 'Monitor billing activity and payment schedule.'



            else 'Continue normal monitoring.'



        end,



        v_risk.risk_level,


        v_risk.risk_category


    )


    returning id

    into v_recommendation_id;






    return jsonb_build_object

    (

        'recommendation_id',

        v_recommendation_id,


        'status',

        'created'

    );



end;

$$;






-- ============================================================
-- REFRESH TENANT DSS
-- ============================================================


create or replace function public.refresh_tenant_dss(

    p_tenant_id uuid

)


returns jsonb


language plpgsql


security definer


set search_path = public


as $$


declare


    v_risk jsonb;


    v_recommendation jsonb;



begin



    -- expire old active recommendations


    update public.recommendations


    set

        status = 'Inactive',

        updated_at = now()


    where tenant_id = p_tenant_id


    and status = 'Active';






    -- generate new assessment


    select public.generate_risk_assessment(

        p_tenant_id

    )

    into v_risk;






    -- generate recommendation


    select public.generate_recommendation(

        (v_risk->>'risk_id')::uuid

    )

    into v_recommendation;







    return jsonb_build_object

    (

        'risk',

        v_risk,


        'recommendation',

        v_recommendation

    );



end;

$$;






-- ============================================================
-- PERMISSIONS
-- ============================================================



revoke all

on function public.generate_risk_assessment(uuid)

from public, anon, authenticated;



grant execute

on function public.generate_risk_assessment(uuid)

to service_role;





revoke all

on function public.generate_recommendation(uuid)

from public, anon, authenticated;



grant execute

on function public.generate_recommendation(uuid)

to service_role;





revoke all

on function public.refresh_tenant_dss(uuid)

from public, anon, authenticated;



grant execute

on function public.refresh_tenant_dss(uuid)

to service_role;



commit;