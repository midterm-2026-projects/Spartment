import {
  getBillingInformation,
  createBillingRecord,
  getTenantBilling,
  updateBillingStatus,
} from "../model/billingModel.js";

/*
|--------------------------------------------------------------------------
| Fetch Billing Information
|--------------------------------------------------------------------------
*/

export async function fetchBillingInformation() {
  try {
    const billing = await getBillingInformation();

    return billing;
  } catch (error) {
    throw new Error("Failed to retrieve billing information.");
  }
}

/*
|--------------------------------------------------------------------------
| Generate Billing
|--------------------------------------------------------------------------
| Handles:
| - Initial tenant billing
| - Monthly tenant billing
|
| Billing Formula:
|
| Total =
| Rent + Water + Electricity
|
| Electricity amount is entered manually
| by admin.
|--------------------------------------------------------------------------
*/

export async function generateBilling({
  tenantId,

  billingType = "initial",

  rentAmount = 5000,

  waterBill = 200,

  electricityBill = 0,
}) {
  try {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }

    const totalAmount = rentAmount + waterBill + electricityBill;

    const billing = await createBillingRecord({
      tenantId,

      billingType,

      billingDate: new Date(),

      dueDate: generateDueDate(),

      rentAmount,

      waterBill,

      electricityBill,

      totalAmount,

      status: "Pending",
    });

    return billing;
  } catch (error) {
    throw new Error(error.message);
  }
}

/*
|--------------------------------------------------------------------------
| Generate Due Date
|--------------------------------------------------------------------------
*/

function generateDueDate() {
  const date = new Date();

  date.setDate(date.getDate() + 10);

  return date;
}

/*
|--------------------------------------------------------------------------
| Get Tenant Billing History
|--------------------------------------------------------------------------
*/

export async function getBillingByTenant(tenantId) {
  try {
    return await getTenantBilling(tenantId);
  } catch (error) {
    throw new Error("Failed to retrieve tenant billing.");
  }
}

/*
|--------------------------------------------------------------------------
| Update Billing Status
|--------------------------------------------------------------------------
*/

export async function updateBillingPaymentStatus(
  billingId,

  status,
) {
  try {
    return await updateBillingStatus(
      billingId,

      status,
    );
  } catch (error) {
    throw new Error("Failed to update billing status.");
  }
}
