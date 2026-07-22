import { useState } from "react";

import { getDashboardMetrics } from "../api/dashboardApi";

export default function useFinancialDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await getDashboardMetrics();

      setDashboard(data);

      return data;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,

    loading,

    error,

    fetchDashboard,
  };
}
