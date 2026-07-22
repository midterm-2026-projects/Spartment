import { supabase } from "../config/supabaseClient.js";

/*
|--------------------------------------------------------------------------
| Create Risk Indicators
|--------------------------------------------------------------------------
| Saves multiple indicators connected to a risk assessment
|--------------------------------------------------------------------------
*/

export async function createRiskIndicators(riskAssessmentId, indicators) {
  if (!indicators || indicators.length === 0) {
    return [];
  }

  const records = indicators.map((indicator) => ({
    risk_assessment_id: riskAssessmentId,

    indicator_name: indicator.name,

    indicator_value: indicator.value ?? null,

    description: indicator.description ?? null,

    created_at: new Date(),
  }));

  const { data, error } = await supabase

    .from("risk_indicators")

    .insert(records)

    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Get Indicators By Risk Assessment
|--------------------------------------------------------------------------
*/

export async function getIndicatorsByRisk(riskAssessmentId) {
  const { data, error } = await supabase

    .from("risk_indicators")

    .select("*")

    .eq("risk_assessment_id", riskAssessmentId)

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
| Delete Existing Indicators
|--------------------------------------------------------------------------
| Used before regenerating risk analysis
|--------------------------------------------------------------------------
*/

export async function deleteRiskIndicators(riskAssessmentId) {
  const { error } = await supabase

    .from("risk_indicators")

    .delete()

    .eq("risk_assessment_id", riskAssessmentId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

/*
|--------------------------------------------------------------------------
| Replace Risk Indicators
|--------------------------------------------------------------------------
| Refresh workflow:
|
| 1. Delete old indicators
| 2. Insert new indicators
|--------------------------------------------------------------------------
*/

export async function replaceRiskIndicators(riskAssessmentId, indicators) {
  await deleteRiskIndicators(riskAssessmentId);

  return await createRiskIndicators(riskAssessmentId, indicators);
}
