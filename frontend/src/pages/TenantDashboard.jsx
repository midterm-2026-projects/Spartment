import { useEffect, useState } from "react";

import { getTenantInformation } from "../api/tenantApi";

import TenantHeader from "../components/TenantHeader";
import TenantInfoCards from "../components/TenantInfoCards";
import PaymentHistory from "../components/PaymentHistory";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function TenantDashboard() {
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTenantInformation() {
      try {
        const data = await getTenantInformation(1);

        setTenantData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTenantInformation();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  if (!tenantData) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <TenantHeader tenant={tenantData.tenant} />

      <TenantInfoCards room={tenantData.room} />

      <PaymentHistory payments={tenantData.payments} />
    </div>
  );
}