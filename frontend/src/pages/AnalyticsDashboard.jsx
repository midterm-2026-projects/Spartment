import { useEffect, useState } from "react";

import { getAnalytics } from "../api/analyticsApi";

import Loading from "../components/Loading";

import ErrorMessage from "../components/ErrorMessage";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);

        setError(null);

        const data = await getAnalytics();

        setAnalytics(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!analytics) {
    return null;
  }

  return (
    <div>
      <h1>Analytics Dashboard</h1>

      <div>
        <h2>Total Revenue</h2>

        <p>₱{analytics.totalRevenue}</p>
      </div>

      <div>
        <h2>Occupancy Rate</h2>

        <p>{analytics.occupancyRate}%</p>
      </div>

      <div>
        <h2>Payment Status</h2>

        <p>Paid: {analytics.paymentStatus.paid}</p>

        <p>Pending: {analytics.paymentStatus.pending}</p>

        <p>Overdue: {analytics.paymentStatus.overdue}</p>
      </div>
    </div>
  );
}
