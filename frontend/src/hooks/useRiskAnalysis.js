import { useState, useEffect } from "react";

import { fetchTenantRisk, fetchHighRiskTenants } from "../api/riskApi";

export function useTenantRisk(tenantId) {
  const [risk, setRisk] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadRisk = async () => {
    if (!tenantId) return;

    try {
      setLoading(true);

      const response = await fetchTenantRisk(tenantId);

      setRisk(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisk();
  }, [tenantId]);

  return {
    risk,

    loading,

    error,

    reload: loadRisk,
  };
}

export function useHighRiskTenants() {
  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadHighRiskTenants = async () => {
    try {
      setLoading(true);

      const response = await fetchHighRiskTenants();

      setTenants(response.data);
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
