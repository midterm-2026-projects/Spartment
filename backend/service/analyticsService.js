import { getBillingInformation } from "../model/billingModel.js";
import { getRooms } from "../model/roomModel.js";
import { getTenants } from "../model/tenantModel.js";
import { getRecommendations } from "../model/recommendationModel.js";

const monthKey = (value) => String(value || "").slice(0, 7);

export async function fetchAnalyticsData() {
  let billing, rooms, tenants, recommendations;
  try {
    [billing, rooms, tenants, recommendations] = await Promise.all([
      getBillingInformation(), getRooms(), getTenants(), getRecommendations(),
    ]);
  } catch {
    throw new Error("Failed to retrieve analytics information.");
  }

  const monthly = new Map();
  for (const bill of billing) {
    const key = monthKey(bill.billing_period);
    if (!key) continue;
    const point = monthly.get(key) || { month:key, forecast:0, actual:0 };
    point.forecast += Number(bill.total_amount || 0);
    point.actual += Number(bill.paid_amount || 0);
    monthly.set(key, point);
  }
  const revenueTrend = [...monthly.values()].sort((a,b)=>a.month.localeCompare(b.month)).slice(-8);
  const occupancy = rooms.reduce((all,room)=>{const key=String(room.status||"Unknown");all[key]=(all[key]||0)+1;return all;},{});
  const paymentStatus = billing.reduce((all,bill)=>{const status=String(bill.status||"Unpaid");all[status]=(all[status]||0)+1;return all;},{});
  const tenantGrowth = tenants.reduce((all,tenant)=>{const key=monthKey(tenant.created_at);if(key)all[key]=(all[key]||0)+1;return all;},{});
  let cumulative=0;
  const growth=Object.entries(tenantGrowth).sort(([a],[b])=>a.localeCompare(b)).map(([month,count])=>({month,count:(cumulative+=count)}));
  const totalForecast=revenueTrend.reduce((sum,item)=>sum+item.forecast,0), totalActual=revenueTrend.reduce((sum,item)=>sum+item.actual,0);

  return {
    totalRevenue: totalActual,
    forecastRevenue: totalForecast,
    variance: totalForecast ? Number((((totalActual-totalForecast)/totalForecast)*100).toFixed(1)) : 0,
    occupancyRate: rooms.length ? Number((((occupancy.Occupied||0)/rooms.length)*100).toFixed(1)) : 0,
    totalTenants: tenants.filter((tenant)=>String(tenant.status).toLowerCase()==="active").length,
    revenueTrend, occupancy, paymentStatus, tenantGrowth:growth,
    recommendations: recommendations.filter((item)=>String(item.status).toLowerCase()==="active").slice(0,6),
  };
}
