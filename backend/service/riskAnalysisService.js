import { getPayments, getPaymentsByTenant } from "../model/paymentModel.js";

import { getTenantById, getTenants } from "../model/tenantModel.js";

import { fetchBillingRecords } from "../model/billingModel.js";

import { fetchRooms } from "../model/roomModel.js";

/*
|--------------------------------------------------------------------------
| Generate Tenant Risk Assessment
|--------------------------------------------------------------------------
|
| Analyzes:
|
| - Payment behavior
| - Late payments
| - Outstanding balance
| - Billing status
| - Tenant activity
|
|--------------------------------------------------------------------------
*/

export async function generateTenantRiskAssessment(tenantId) {
  const payments = await getPaymentsByTenant(tenantId);

  const tenant = await getTenantById(tenantId);

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  let riskScore = 0;

  let riskLevel = "Low";

  let indicators = [];

  let latePayments = 0;

  let unpaidBalance = 0;

  payments.forEach((payment) => {
    /*
    |--------------------------------------------------------------------------
    | Late Payment Detection
    |--------------------------------------------------------------------------
    */

    if (
      payment.status === "Late" ||
      payment.verification_status === "Rejected"
    ) {
      latePayments++;

      riskScore += 20;

      indicators.push({
        condition: "Late Payment Behavior",

        description: "Tenant has delayed or rejected payments.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Pending / unpaid balance
    |--------------------------------------------------------------------------
    */

    const isPending =
      payment.status === "Pending" ||
      payment.verification_status === "Pending";

    const outstandingAmount = Number(
      payment.pending_amount ??
        payment.remaining_balance ??
        (payment.verification_status === "Pending" ? payment.amount : 0),
    );

    if (isPending && outstandingAmount > 0) {
      unpaidBalance += outstandingAmount;

      riskScore += 10;

      indicators.push({
        condition: "Outstanding Payment",

        description: `Pending balance detected: ₱${outstandingAmount}`,
      });
    }
  });

  /*
  |--------------------------------------------------------------------------
  | Tenant Status Risk
  |--------------------------------------------------------------------------
  */

  if (tenant.status !== "Active") {
    riskScore += 15;

    indicators.push({
      condition: "Inactive Tenant",

      description: "Tenant account is inactive.",
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Calculate Risk Level
  |--------------------------------------------------------------------------
  */

  if (riskScore >= 60) {
    riskLevel = "High";
  } else if (riskScore >= 30) {
    riskLevel = "Medium";
  } else {
    riskLevel = "Low";
  }

  if (indicators.length === 0) {
    indicators.push({
      condition: "No Risk Detected",

      description: "Payment behavior is normal.",
    });
  }

  return {
    tenantId,

    riskScore,

    riskLevel,

    riskCategory: determineRiskCategory(riskLevel),

    sourceCondition: indicators.map((item) => item.condition),

    indicators,

    latePayments,

    unpaidBalance,

    assessmentDate: new Date(),
  };
}

/*
|--------------------------------------------------------------------------
| Generate System Risk Assessment
|--------------------------------------------------------------------------
|
| Checks:
|
| - Room occupancy
| - Vacancy
| - Revenue
|
|--------------------------------------------------------------------------
*/

export async function generateSystemRiskAssessment() {
  const rooms = await fetchRooms();

  const billings = await fetchBillingRecords();

  let riskScore = 0;

  let indicators = [];

  /*
  |--------------------------------------------------------------------------
  | Vacancy Risk
  |--------------------------------------------------------------------------
  */

  const vacantRooms = rooms.filter((room) => room.status === "Available");

  if (vacantRooms.length > 0) {
    riskScore += 20;

    indicators.push({
      condition: "Room Vacancy",

      description: `${vacantRooms.length} vacant rooms detected.`,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Revenue Risk
  |--------------------------------------------------------------------------
  */

  const overdueBills = billings.filter(
    (billing) => billing.status === "Overdue",
  );

  if (overdueBills.length > 0) {
    riskScore += 30;

    indicators.push({
      condition: "Revenue Risk",

      description: `${overdueBills.length} overdue billing records.`,
    });
  }

  let riskLevel = "Low";

  if (riskScore >= 60) {
    riskLevel = "High";
  } else if (riskScore >= 30) {
    riskLevel = "Medium";
  }

  return {
    riskScore,

    riskLevel,

    riskCategory: determineRiskCategory(riskLevel),

    sourceCondition: indicators.map((item) => item.condition),

    indicators,

    assessmentDate: new Date(),
  };
}

/*
|--------------------------------------------------------------------------
| Risk Category Mapper
|--------------------------------------------------------------------------
*/

function determineRiskCategory(level) {
  switch (level) {
    case "High":
      return "Critical";

    case "Medium":
      return "Warning";

    default:
      return "Stable";
  }
}
