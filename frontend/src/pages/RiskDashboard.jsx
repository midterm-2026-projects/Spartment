import { useHighRiskTenants } from "../hooks/useRiskAnalysis";

import HighRiskTenantTable from "../components/HighRiskTenantTable";
import RiskIndicatorList from "../components/RiskIndicatorList";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function RiskDashboard() {
  const { tenants, loading, error } = useHighRiskTenants();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tenant Risk Monitoring</h1>

      <HighRiskTenantTable tenants={tenants} />

      <RiskIndicatorList riskData={tenants} />
    </div>
  );
}
