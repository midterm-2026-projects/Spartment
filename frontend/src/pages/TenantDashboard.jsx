import { useEffect, useState } from "react";

import { getTenantInformation } from "../api/tenantApi";

import { useTenantRisk } from "../hooks/useRiskAnalysis";

import TenantHeader from "../components/TenantHeader";
import TenantInfoCards from "../components/TenantInfoCards";
import PaymentHistory from "../components/PaymentHistory";

import RiskStatusCard from "../components/RiskStatusCard";
import RiskIndicatorList from "../components/RiskIndicatorList";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function TenantDashboard() {
  const [tenantData, setTenantData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTenant() {
      try {
        const data = await getTenantInformation(1);

        setTenantData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTenant();
  }, []);

  const {
    risk,

    loading: riskLoading,
  } = useTenantRisk(tenantData?.tenant?.id);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!tenantData) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <TenantHeader tenant={tenantData.tenant} />

      <TenantInfoCards
        room={{
          ...tenantData.room,

          riskLevel: risk?.riskLevel,
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {riskLoading ? (
          <p>Loading risk analysis...</p>
        ) : (
          <RiskStatusCard risk={risk} />
        )}

        <RiskIndicatorList indicators={risk?.indicators || []} />
      </div>

      <PaymentHistory payments={tenantData.payments} />
    </div>
  );
}
