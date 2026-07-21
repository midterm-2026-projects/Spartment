import { useState, useEffect } from "react";

import { fetchTenantRisk, fetchHighRiskTenants } from "../api/riskApi";

export function useTenantRisk(tenantId) {
  const [risk, setRisk] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tenantId) {
      return;
    }

    const loadRisk = async () => {
      try {
        setLoading(true);

        const data = await fetchTenantRisk(tenantId);

        setRisk(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRisk();
  }, [tenantId]);

  return {
    risk,

    loading,

    error,
  };
}

export function useHighRiskTenants() {
  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadHighRiskTenants = async () => {
    try {
      setLoading(true);

      const data = await fetchHighRiskTenants();

      setTenants(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHighRiskTenants();
  }, []);

  return {
    tenants,

    loading,

    error,

    reload: loadHighRiskTenants,
  };
}
