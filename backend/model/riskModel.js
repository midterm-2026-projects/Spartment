import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Create Risk Assessment
|--------------------------------------------------------------------------
| Saves generated risk analysis result
|--------------------------------------------------------------------------
*/

export async function createRiskRecord(data) {
  const {
    tenantId,
    roomId,
    billingId,
    riskScore,
    riskLevel,
    riskCategory,
    sourceCondition,
    indicators,
    assessmentDate,
  } = data;

  const { data: risk, error } = await supabase

    .from("risk_assessments")

    .insert({
      tenant_id: tenantId,

      room_id: roomId,

      billing_id: billingId,

      risk_score: riskScore,

      risk_level: riskLevel,

      risk_category: riskCategory,

      source_condition: sourceCondition,

      assessment_date: assessmentDate || new Date(),
    })

    .select()

    .single();

  if (error) {
    throw new Error(error.message);
  }

  /*
  |
  | Save risk indicators
  |
  */

  if (indicators && indicators.length > 0) {
    const indicatorRecords = indicators.map((indicator) => ({
      risk_assessment_id: risk.id,

      indicator_name: indicator.name,

      indicator_value: indicator.value,

      description: indicator.description,
    }));

    const { error: indicatorError } = await supabase

      .from("risk_indicators")

      .insert(indicatorRecords);

    if (indicatorError) {
      throw new Error(indicatorError.message);
    }
  }

  return risk;
}

/*
|--------------------------------------------------------------------------
| Get Risk Assessment By Tenant
|--------------------------------------------------------------------------
*/

export async function getRiskByTenant(tenantId) {
  const { data, error } = await supabase

    .from("risk_assessments")

    .select(
      `

      *,

      risk_indicators(*)

    `,
    )

    .eq("tenant_id", tenantId)

    .order("assessment_date", {
      ascending: false,
    })

    .limit(1)

    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
*/

export async function getHighRiskRecords() {
  const { data, error } = await supabase

    .from("risk_assessments")

    .select(
      `

      *,

      tenants(
        full_name,
        email
      )

    `,
    )

    .eq("risk_level", "High")

    .order("risk_score", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Get All Risk Records
|--------------------------------------------------------------------------
*/

export async function getRiskRecords() {
  const { data, error } = await supabase

    .from("risk_assessments")

    .select(
      `

      *,

      tenants(
        full_name
      ),

      risk_indicators(*)

    `,
    )

    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Update Risk Status
|--------------------------------------------------------------------------
*/

export async function updateRiskStatus(id, status) {
  const { data, error } = await supabase

    .from("risk_assessments")

    .update({
      status,

      updated_at: new Date(),
    })

    .eq("id", id)

    .select()

    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
