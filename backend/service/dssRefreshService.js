import { analyzeTenantRisk, analyzeSystemRisk } from "./riskService.js";

import { generateRecommendations } from "./recommendationService.js";

import { getRiskRecords } from "../model/riskModel.js";

/*
|--------------------------------------------------------------------------
| Refresh Tenant DSS
|--------------------------------------------------------------------------
|
| Used after:
|
| - Payment verification
| - Payment rejection
| - Billing status changes
|
|--------------------------------------------------------------------------
*/

export async function refreshTenantDSS(tenantId) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Recalculate Risk
    |--------------------------------------------------------------------------
    */

    const risk = await analyzeTenantRisk(tenantId);

    /*
    |--------------------------------------------------------------------------
    | Generate Recommendations
    |--------------------------------------------------------------------------
    */

    const recommendations = await generateRecommendations();

    return {
      success: true,

      tenantId,

      risk,

      recommendations,

      refreshedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`Failed to refresh tenant DSS: ${error.message}`);
  }
}

/*
|--------------------------------------------------------------------------
| Refresh System DSS
|--------------------------------------------------------------------------
|
| Used after:
|
| - Revenue changes
| - Room occupancy changes
| - Vacancy changes
|
|--------------------------------------------------------------------------
*/

export async function refreshSystemDSS() {
  try {
    const risk = await analyzeSystemRisk();

    const recommendations = await generateRecommendations();

    return {
      success: true,

      risk,

      recommendations,

      refreshedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`Failed to refresh system DSS: ${error.message}`);
  }
}

/*
|--------------------------------------------------------------------------
| Refresh All DSS Records
|--------------------------------------------------------------------------
|
| Admin manual refresh
|
|--------------------------------------------------------------------------
*/

export async function refreshAllDSS() {
  try {
    const risks = await getRiskRecords();

    const recommendations = await generateRecommendations();

    return {
      success: true,

      totalRiskRecords: risks.length,

      totalRecommendations: recommendations.length,

      refreshedAt: new Date(),
    };
  } catch (error) {
    throw new Error(`Failed to refresh DSS records: ${error.message}`);
  }
}
