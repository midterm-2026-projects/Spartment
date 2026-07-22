import { getPayments } from "../model/paymentModel.js";

import { getRevenueBillingRecords } from "../model/billingModel.js";

/*
|--------------------------------------------------------------------------
| Financial Dashboard Metrics
|--------------------------------------------------------------------------
*/

export async function getFinancialMetrics() {
  const bills = await getRevenueBillingRecords();

  const payments = await getPayments();

  return {
    totalBilled: bills.reduce(
      (sum, bill) => sum + Number(bill.total_amount),
      0,
    ),

    totalCollected: payments

      .filter((payment) => payment.verification_status === "Verified")

      .reduce(
        (sum, payment) => sum + Number(payment.amount),

        0,
      ),

    outstandingBalance: bills.reduce(
      (sum, bill) => sum + Number(bill.remaining_balance),

      0,
    ),

    billingStatusCount: {
      paid: bills.filter((b) => b.status === "Paid").length,

      unpaid: bills.filter((b) => b.status === "Unpaid").length,

      partial: bills.filter((b) => b.status === "Partially Paid").length,

      overdue: bills.filter((b) => b.status === "Overdue").length,
    },
  };
}
