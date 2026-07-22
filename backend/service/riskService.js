import {
  createRiskRecord,
  getHighRiskRecords,
  getRiskByTenant,
  getRiskRecords,
} from "../model/riskModel.js";

import {
  generateTenantRiskAssessment,
  generateSystemRiskAssessment,
} from "./riskAnalysisService.js";

/*
|--------------------------------------------------------------------------
| Analyze Tenant Risk
|--------------------------------------------------------------------------
|
| Flow:
|
| Controller
|    |
| riskService
|    |
| riskAnalysisService
|    |
| riskModel
|    |
| Supabase
|
|--------------------------------------------------------------------------
*/

export async function analyzeTenantRisk(tenantId) {
  const assessment = await generateTenantRiskAssessment(tenantId);

  const savedRisk = await createRiskRecord(assessment);

  return savedRisk;
}

/*
|--------------------------------------------------------------------------
| Analyze System Risk
|--------------------------------------------------------------------------
|
| Checks:
|
| - Room vacancy
| - Revenue problems
| - Billing issues
|
|--------------------------------------------------------------------------
*/

export async function analyzeSystemRisk() {
  const assessment = await generateSystemRiskAssessment();

  const savedRisk = await createRiskRecord(assessment);

  return savedRisk;
}

/*
|--------------------------------------------------------------------------
| Get Tenant Risk
|--------------------------------------------------------------------------
*/

export async function getTenantRisk(tenantId) {
  return await getRiskByTenant(tenantId);
}

/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
*/

export async function getHighRiskTenants() {
  return await getHighRiskRecords();
}

/*
|--------------------------------------------------------------------------
| Get All Risk Records
|--------------------------------------------------------------------------
*/

export async function getAllRiskRecords() {
  return await getRiskRecords();
}
