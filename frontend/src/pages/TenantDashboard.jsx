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

function getStoredTenantId() {
  const directTenantId = localStorage.getItem("tenantId");

  if (directTenantId) {
    return directTenantId;
  }

  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return "";
  }

  try {
    const user = JSON.parse(storedUser);

    return user.tenantId || user.tenant_id || user.tenant?.id || "";
  } catch {
    return "";
  }
}

function normalizeTenantResponse(response) {
  const data = response?.data || response || {};

  return {
    tenant: data.tenant || data.tenantData || data,

    room: data.room || data.tenant?.room || null,

    billing:
      data.billing || data.currentBilling || data.current_billing || null,

    payments:
      data.payments || data.paymentHistory || data.payment_history || [],
  };
}

export default function TenantDashboard({ tenantId: providedTenantId }) {
  const tenantId = providedTenantId || getStoredTenantId();

  const [tenantData, setTenantData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTenant() {
      if (!tenantId) {
        if (active) {
          setError("Tenant ID was not found. Please log in again.");

          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        setError("");

        const response = await getTenantInformation(tenantId);

        if (active) {
          setTenantData(normalizeTenantResponse(response));
        }
      } catch (error) {
        if (active) {
          setError(error.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTenant();

    return () => {
      active = false;
    };
  }, [tenantId]);

  const resolvedTenantId =
    tenantData?.tenant?.id ||
    tenantData?.tenant?.tenantId ||
    tenantData?.tenant?.tenant_id ||
    tenantId;

  const {
    risk,
    loading: riskLoading,
    error: riskError,
  } = useTenantRisk(resolvedTenantId);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!tenantData?.tenant) {
    return <EmptyState />;
  }

  return (
    <main className="mx-auto max-w-6xl p-6">
      <TenantHeader tenant={tenantData.tenant} />

      <TenantInfoCards
        tenant={tenantData.tenant}
        room={tenantData.room}
        billing={tenantData.billing}
        risk={risk}
      />

      {riskError ? (
        <div className="mb-5">
          <ErrorMessage message={riskError} />
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {riskLoading ? (
          <div className="rounded-xl border bg-white p-5">
            <p className="text-gray-500">Loading risk analysis...</p>
          </div>
        ) : (
          <RiskStatusCard risk={risk} />
        )}

        <RiskIndicatorList indicators={risk?.indicators || []} />
      </div>

      <div className="mt-6">
        <PaymentHistory payments={tenantData.payments || []} />
      </div>
    </main>
  );
}
