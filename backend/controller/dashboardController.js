import { getRooms } from "../model/roomModel.js";
import { getTenants } from "../model/tenantModel.js";
import { getPayments } from "../model/paymentModel.js";
import { getBillingInformation } from "../model/billingModel.js";
import { fetchDashboardMetrics } from "../service/dashboardService.js";

export async function getDashboardMetrics(_req, res) {
  try {
    const [rooms, tenants, payments, billings] = await Promise.all([getRooms(), getTenants(), getPayments(), getBillingInformation()]);
    const data = await fetchDashboardMetrics({ rooms, tenants, payments, billings });
    return res.json({ success: true, data });
  } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
}
