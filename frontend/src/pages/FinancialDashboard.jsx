import BillingSummaryCards from "../components/BillingSummaryCards";
import PaymentStatusCard from "../components/PaymentStatusCard";
import RevenueTrendCard from "../components/RevenueTrendCard";
import HighRiskTenantTable from "../components/HighRiskTenantTable";

export default function FinancialDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>

      <BillingSummaryCards />

      <PaymentStatusCard />

      <RevenueTrendCard revenueTrend={[]} />

      <HighRiskTenantTable tenants={[]} />
    </div>
  );
}
