import {
  getBillingInformation,
  createBillingRecord,
  getTenantBilling,
  getBillingById,
  updateBillingRecord,
} from "../model/billingModel.js";

/*
|--------------------------------------------------------------------------
| Get All Billing
|--------------------------------------------------------------------------
*/

export async function fetchBillingInformation() {
  try {
    return await getBillingInformation();
  } catch (error) {
    throw new Error("Failed to retrieve billing information.");
  }
}

/*
|--------------------------------------------------------------------------
| Create Billing
|--------------------------------------------------------------------------
| Business calculation only.
|--------------------------------------------------------------------------
*/

export async function generateBilling({
  tenantId,

  roomId,

  billingType = "Rent",

  totalAmount,

  billingPeriod,

  dueDate,
}) {
  if (!tenantId) {
    throw new Error("Tenant ID is required.");
  }

  if (!roomId) {
    throw new Error("Room ID is required.");
  }

  if (totalAmount < 0) {
    throw new Error("Billing amount cannot be negative.");
  }

  return await createBillingRecord({
    tenantId,

    roomId,

    billingType,

    billingPeriod: billingPeriod ?? new Date(),

    dueDate,

    totalAmount,

    paidAmount: 0,

    remainingBalance: totalAmount,

    status: "Unpaid",
  });
}

/*
|--------------------------------------------------------------------------
| Tenant Billing History
|--------------------------------------------------------------------------
*/

export async function getBillingByTenant(tenantId) {
  return await getTenantBilling(tenantId);
}

/*
|--------------------------------------------------------------------------
| Get Single Billing
|--------------------------------------------------------------------------
*/

export async function fetchBillingById(billingId) {
  return await getBillingById(billingId);
}

/*
|--------------------------------------------------------------------------
| Update Billing
|--------------------------------------------------------------------------
*/

export async function updateBillingPaymentStatus(billingId, status) {
  return await updateBillingRecord(
    billingId,

    {
      status,
    },
  );
}
