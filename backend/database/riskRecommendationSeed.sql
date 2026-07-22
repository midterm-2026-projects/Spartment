begin;


-- ============================================================
-- RISK & RECOMMENDATION SEED DATA
-- Week 5 Day 2 Objective 3
--
-- Requires:
-- users
-- tenants
-- rooms
-- billings
-- payments
-- ============================================================



-- ============================================================
-- SAMPLE RISK ASSESSMENTS
-- ============================================================


do $$


declare


    v_tenant uuid;

    v_room uuid;

    v_billing uuid;

    v_payment uuid;


    v_low_risk uuid;

    v_medium_risk uuid;

    v_high_risk uuid;



begin



-- ============================================================
-- GET EXISTING TENANT DATA
-- ============================================================


select id

into v_tenant

from public.tenants

limit 1;



select room_id

into v_room

from public.tenants

where id = v_tenant;



select id

into v_billing

from public.billings

where tenant_id = v_tenant

limit 1;



select id

into v_payment

from public.payments

where tenant_id = v_tenant

limit 1;





if v_tenant is null then


    raise notice

    'No tenant data available. Insert tenant seed first.';


    return;


end if;




-- ============================================================
-- LOW RISK ASSESSMENT
-- ============================================================


insert into public.risk_assessments
(

    tenant_id,

    room_id,

    billing_id,

    payment_id,


    risk_score,


    risk_level,


    risk_category,


    source_condition,


    status

)

values

(

    v_tenant,

    v_room,

    v_billing,

    v_payment,


    15,


    'Low',


    'Payment',


    'Tenant payments are consistent and on time.',


    'Active'

)


returning id

into v_low_risk;




insert into public.risk_indicators

(

    risk_assessment_id,

    indicator,

    severity

)

values

(

    v_low_risk,

    'No late payment history detected.',

    'Low'

);





insert into public.recommendations

(

    risk_assessment_id,

    tenant_id,

    title,

    description,

    priority,

    category,

    status

)

values

(

    v_low_risk,

    v_tenant,


    'Maintain Payment Behavior',


    'Continue monitoring tenant payment consistency.',


    'Low',


    'Payment',


    'Active'

);







-- ============================================================
-- MEDIUM RISK ASSESSMENT
-- ============================================================


insert into public.risk_assessments

(

    tenant_id,

    room_id,

    billing_id,

    payment_id,


    risk_score,


    risk_level,


    risk_category,


    source_condition,


    status

)

values

(

    v_tenant,

    v_room,

    v_billing,

    v_payment,


    55,


    'Medium',


    'Billing',


    'Tenant has increasing unpaid balance.',


    'Active'

)


returning id

into v_medium_risk;






insert into public.risk_indicators

(

    risk_assessment_id,

    indicator,

    severity

)

values

(

    v_medium_risk,


    'Outstanding balance increased during billing cycle.',


    'Medium'

);






insert into public.recommendations

(

    risk_assessment_id,

    tenant_id,

    title,

    description,

    priority,

    category,

    status

)

values

(

    v_medium_risk,


    v_tenant,


    'Review Outstanding Balance',


    'Contact tenant regarding pending balance settlement.',


    'Medium',


    'Billing',


    'Active'

);







-- ============================================================
-- HIGH RISK ASSESSMENT
-- ============================================================


insert into public.risk_assessments

(

    tenant_id,

    room_id,

    billing_id,

    payment_id,


    risk_score,


    risk_level,


    risk_category,


    source_condition,


    status

)

values

(

    v_tenant,

    v_room,

    v_billing,

    v_payment,


    90,


    'High',


    'Payment',


    'Multiple late payments detected.',


    'Active'

)


returning id

into v_high_risk;






insert into public.risk_indicators

(

    risk_assessment_id,

    indicator,

    severity

)

values

(

    v_high_risk,


    'Repeated late payment behavior detected.',


    'High'

),


(

    v_high_risk,


    'Outstanding unpaid balance exceeded threshold.',


    'High'

);






insert into public.recommendations

(

    risk_assessment_id,

    tenant_id,

    title,

    description,

    priority,

    category,

    status

)

values

(

    v_high_risk,


    v_tenant,


    'Create Payment Arrangement',


    'Tenant requires immediate payment follow-up and arrangement.',


    'High',


    'Payment',


    'Active'

);






end $$;




-- ============================================================
-- RECOMMENDATION HISTORY SAMPLE
-- ============================================================


insert into public.recommendation_history

(

    recommendation_id,

    previous_status,

    new_status,

    action

)


select


    id,


    'Active',


    'Resolved',


    'Previous recommendation resolved during testing.'


from public.recommendations


where priority = 'Low'


limit 1;




commit;