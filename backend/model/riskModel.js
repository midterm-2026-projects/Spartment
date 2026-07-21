let riskRecords = [];

/*
|--------------------------------------------------------------------------
| Save Tenant Risk Analysis
|--------------------------------------------------------------------------
*/

export async function createRiskRecord(data) {
  const riskRecord = {
    id: riskRecords.length + 1,

    tenantId: data.tenantId,

    riskLevel: data.riskLevel,

    indicators: data.indicators || [],

    latePayments: data.latePayments || 0,

    unpaidBalance: data.unpaidBalance || 0,

    createdAt: new Date(),
  };

  riskRecords.push(riskRecord);

  return riskRecord;
}

/*
|--------------------------------------------------------------------------
| Get Risk Record By Tenant
|--------------------------------------------------------------------------
*/

export async function getRiskByTenant(tenantId) {
  return riskRecords.find((risk) => risk.tenantId == tenantId);
}

/*
|--------------------------------------------------------------------------
| Get High Risk Tenants
|--------------------------------------------------------------------------
*/

export async function getHighRiskRecords() {
  return riskRecords.filter((risk) => risk.riskLevel === "High");
}

/*
|--------------------------------------------------------------------------
| Get All Risk Records
|--------------------------------------------------------------------------
*/

export async function getRiskRecords() {
  return riskRecords;
}
