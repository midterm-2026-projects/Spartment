/*
|--------------------------------------------------------------------------
| Billing Model
|--------------------------------------------------------------------------
| Responsible for:
| - storing billing records
| - retrieving billing records
| - updating billing status
|
| Business calculations are handled in service layer.
|--------------------------------------------------------------------------
*/

let billingRecords = [];

/*
|--------------------------------------------------------------------------
| Create Billing Record
|--------------------------------------------------------------------------
*/

export async function createBillingRecord(billingData) {
  const newBilling = {
    id: billingRecords.length + 1,

    tenantId: billingData.tenantId,

    billingType: billingData.billingType || "initial",

    billingDate: billingData.billingDate,

    dueDate: billingData.dueDate,

    rentAmount: billingData.rentAmount || 0,

    waterBill: billingData.waterBill || 0,

    electricityBill: billingData.electricityBill || 0,

    totalAmount: billingData.totalAmount || 0,

    status: billingData.status || "Pending",

    createdAt: new Date(),
  };

  billingRecords.push(newBilling);

  return newBilling;
}

/*
|--------------------------------------------------------------------------
| Get Billing Information
|--------------------------------------------------------------------------
*/

export async function getBillingInformation() {
  return billingRecords;
}

/*
|--------------------------------------------------------------------------
| Get Tenant Billing History
|--------------------------------------------------------------------------
*/

export async function getTenantBilling(tenantId) {
  return billingRecords.filter((billing) => billing.tenantId == tenantId);
}

/*
|--------------------------------------------------------------------------
| Get Billing By ID
|--------------------------------------------------------------------------
*/

export async function getBillingById(billingId) {
  return billingRecords.find((billing) => billing.id == billingId);
}

/*
|--------------------------------------------------------------------------
| Update Billing Status
|--------------------------------------------------------------------------
*/

export async function updateBillingStatus(billingId, status) {
  const billing = billingRecords.find((item) => item.id == billingId);

  if (!billing) {
    throw new Error("Billing record not found");
  }

  billing.status = status;

  return billing;
}

/*
|--------------------------------------------------------------------------
| Reset Billing Data
|--------------------------------------------------------------------------
| Used for testing
|--------------------------------------------------------------------------
*/

export async function resetBillingRecords() {
  billingRecords = [];
}
