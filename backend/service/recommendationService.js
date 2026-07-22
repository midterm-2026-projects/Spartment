import { getRiskRecords } from "../model/riskModel.js";

import {
  getRecommendations,
  getRecommendationsByTenant,
  updateRecommendationStatus,
} from "../model/recommendationModel.js";

import { generateRecommendations as runRecommendationEngine } from "./recommendationEngineService.js";

/*
|--------------------------------------------------------------------------
| Generate Recommendations
|--------------------------------------------------------------------------
|
| Main recommendation generator
|
| Flow:
|
| Risk Records
|      |
|      ↓
| Recommendation Engine
|      |
|      ↓
| Recommendation Model
|
|--------------------------------------------------------------------------
*/

export async function generateRecommendations() {
  const risks = await getRiskRecords();

  if (!risks || risks.length === 0) {
    return [];
  }

  return runRecommendationEngine();
}

/*
|--------------------------------------------------------------------------
| Generate Recommendation For Specific Risk
|--------------------------------------------------------------------------
*/

export async function generateRiskRecommendation(risk) {
  if (!risk) return null;
  return runRecommendationEngine();
}

export async function saveRecommendations() {
  return generateRecommendations();
}

/*
|--------------------------------------------------------------------------
| Get All Recommendations
|--------------------------------------------------------------------------
*/

export async function getAllRecommendations() {
  return await getRecommendations();
}

/*
|--------------------------------------------------------------------------
| Get Tenant Recommendations
|--------------------------------------------------------------------------
*/

export async function getTenantRecommendations(tenantId) {
  return await getRecommendationsByTenant(tenantId);
}

/*
|--------------------------------------------------------------------------
| Resolve Recommendation
|--------------------------------------------------------------------------
|
| Used when recommendation is completed
|
|--------------------------------------------------------------------------
*/

export async function resolveRecommendation(recommendationId) {
  return await updateRecommendationStatus(
    recommendationId,

    "Resolved",
  );
}

/*
|--------------------------------------------------------------------------
| Close Recommendation
|--------------------------------------------------------------------------
|
| Used for outdated recommendations
|
|--------------------------------------------------------------------------
*/

export async function closeRecommendation(recommendationId) {
  return await updateRecommendationStatus(
    recommendationId,

    "Inactive",
  );
}
