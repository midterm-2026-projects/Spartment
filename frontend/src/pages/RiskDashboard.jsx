import { useHighRiskTenants } from "../hooks/useRiskAnalysis";

import HighRiskTenantTable from "../components/HighRiskTenantTable";
import RiskIndicatorList from "../components/RiskIndicatorList";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function RiskDashboard() {
  const { tenants, loading, error, reload } = useHighRiskTenants();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Tenant Risk Monitoring
        </h1>

        <EmptyState />
      </div>
    );
  }

  const indicators = tenants.flatMap((tenant) => tenant.indicators ?? []);

  return (
    <main
      className="
        max-w-6xl
        mx-auto
        p-6
      "
    >
      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >
        <h1
          className="
            text-2xl
            font-bold
          "
        >
          Tenant Risk Monitoring
        </h1>

        <button
          onClick={reload}
          className="
            rounded-lg
            bg-blue-600
            px-4
            py-2
            text-white
          "
        >
          Refresh
        </button>
      </div>

      <HighRiskTenantTable tenants={tenants} />

      <div
        className="
          mt-6
        "
      >
        <RiskIndicatorList indicators={indicators} />
      </div>
    </main>
  );
}
