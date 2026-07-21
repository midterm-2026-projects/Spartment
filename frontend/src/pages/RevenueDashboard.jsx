import { useEffect, useState } from "react";

import { getDashboardMetrics } from "../api/dashboardApi";

import Header from "../components/Header";
import KpiCard from "../components/KpiCard";

import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

export default function RevenueDashboard() {
  const [metrics, setMetrics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);

        setError(null);

        const response = await getDashboardMetrics();

        setMetrics(response);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!metrics) {
    return <EmptyState />;
  }

  return (
    <div>
      <Header />

      <div>
        <KpiCard
          title="Collected Revenue"
          value={`₱${metrics.collectedRevenue}`}
          subtitle="Paid Payments"
        />

        <KpiCard
          title="Pending Payments"
          value={metrics.pendingPayments}
          subtitle="Awaiting Payment"
        />

        <KpiCard
          title="Late Payments"
          value={metrics.latePayments}
          subtitle="Overdue Accounts"
        />
      </div>
    </div>
  );
}
