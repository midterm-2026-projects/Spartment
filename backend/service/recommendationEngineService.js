import { getHighRiskRecords } from "../model/riskModel.js";

import {
  createRecommendation,
  getActiveRecommendations,
} from "../model/recommendationModel.js";

/*
|--------------------------------------------------------------------------
| Generate Recommendations
|--------------------------------------------------------------------------
|
| Reads risk assessments
| Creates smart recommendations
|
|--------------------------------------------------------------------------
*/

export async function generateRecommendations() {
  try {
    const risks = await getHighRiskRecords();

    if (!risks || risks.length === 0) {
      return [];
    }

    const recommendations = [];

    for (const risk of risks) {
      let recommendation;

      /*
      |--------------------------------------------------------------------------
      | High Risk Payment Recommendation
      |--------------------------------------------------------------------------
      */

      if (risk.riskLevel === "High") {
        recommendation = await createRecommendation({
          riskAssessmentId: risk.id,

          tenantId: risk.tenantId,

          title: "Payment Follow Up Required",

          description:
            "Tenant has high payment risk. Review payment behavior and contact tenant.",

          priority: "High",

          category: "Payment",

          sourceCondition: "High Risk Tenant",
        });
      }

      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    return recommendations;
  } catch (error) {
    throw new Error("Failed to generate recommendations.");
  }
}

/*
|--------------------------------------------------------------------------
| Get Active Recommendations
|--------------------------------------------------------------------------
*/

export async function getRecommendations() {
  try {
    return await getActiveRecommendations();
  } catch (error) {
    throw new Error("Failed to retrieve recommendations.");
  }
}
