import { useEffect, useState } from "react";

import { getDashboardMetrics } from "../api/dashboardApi";

import Loading from "../components/Loading";

import ErrorMessage from "../components/ErrorMessage";

export default function RevenueDashboard() {
  const [metrics, setMetrics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);

        setError(null);

        const data = await getDashboardMetrics();

        setMetrics(data);
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

  return (
    <div>
      <h1>Revenue Dashboard</h1>

      <div>
        <h2>Collected Revenue</h2>

        <p>₱{metrics?.collectedRevenue ?? 0}</p>
      </div>

      <div>
        <h2>Pending Payments</h2>

        <p>{metrics?.pendingPayments ?? 0}</p>
      </div>

      <div>
        <h2>Late Payments</h2>

        <p>{metrics?.latePayments ?? 0}</p>
      </div>
    </div>
  );
}
