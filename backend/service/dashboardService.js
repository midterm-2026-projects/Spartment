import { getRiskRecords } from "../model/riskModel.js";

import { getRecommendations } from "../model/recommendationModel.js";

/*
|--------------------------------------------------------------------------
| Fetch Dashboard Metrics
|--------------------------------------------------------------------------
|
| Responsible for dashboard summary only.
|
| Includes:
|
| - Revenue
| - Occupancy
| - Tenants
| - Payments
| - DSS Summary
|
|--------------------------------------------------------------------------
*/

export async function fetchDashboardMetrics({
  rooms,

  tenants,

  payments,
  billings = [],
}) {
  try {
    /*
    |--------------------------------------------------------------------------
    | Room Metrics
    |--------------------------------------------------------------------------
    */

    const occupiedRooms = rooms.filter(
      (room) => String(room.status).toLowerCase() === "occupied",
    ).length;

    const occupancy =
      rooms.length === 0 ? 0 : Math.round((occupiedRooms / rooms.length) * 100);

    /*
    |--------------------------------------------------------------------------
    | Tenant Metrics
    |--------------------------------------------------------------------------
    */

    const activeTenants = tenants.filter(
      (tenant) => String(tenant.status).toLowerCase() === "active",
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Revenue Metrics
    |--------------------------------------------------------------------------
    */

    const monthlyRevenue = payments.reduce(
      (
        total,

        payment,
      ) => total + Number(payment.amount ?? 0),

      0,
    );

    /*
    |--------------------------------------------------------------------------
    | Payment Risk Metrics
    |--------------------------------------------------------------------------
    */

    const latePayments = billings.length
      ? billings.filter((billing) => String(billing.status).toLowerCase() === "overdue").length
      : payments.filter((payment) => ["late", "overdue"].includes(String(payment.status || payment.payment_status).toLowerCase())).length;

    /*
    |--------------------------------------------------------------------------
    | DSS DATA
    |--------------------------------------------------------------------------
    */

    const risks = await getRiskRecords();

    const recommendations = await getRecommendations();

    return {
      /*
      |--------------------------------------------------------------------------
      | Business Metrics
      |--------------------------------------------------------------------------
      */

      monthlyRevenue: `₱${monthlyRevenue.toLocaleString()}`,

      occupancy: `${occupancy}%`,

      activeTenants,

      latePayments,

      /*
      |--------------------------------------------------------------------------
      | Risk Dashboard
      |--------------------------------------------------------------------------
      */

      riskSummary: {
        total: risks.length,

        high: risks.filter((risk) => risk.riskLevel === "High").length,

        medium: risks.filter((risk) => risk.riskLevel === "Medium").length,

        low: risks.filter((risk) => risk.riskLevel === "Low").length,
      },

      /*
      |--------------------------------------------------------------------------
      | Recommendation Dashboard
      |--------------------------------------------------------------------------
      */

      recommendationSummary: {
        total: recommendations.length,

        active: recommendations.filter(
          (recommendation) => recommendation.status === "Active",
        ).length,

        highPriority: recommendations.filter(
          (recommendation) => recommendation.priority === "High",
        ).length,

        mediumPriority: recommendations.filter(
          (recommendation) => recommendation.priority === "Medium",
        ).length,

        lowPriority: recommendations.filter(
          (recommendation) => recommendation.priority === "Low",
        ).length,
      },
    };
  } catch (error) {
    throw new Error("Failed to retrieve dashboard metrics.");
  }
}
