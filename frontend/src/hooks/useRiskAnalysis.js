import { useEffect, useState } from "react";

import {
  fetchTenantRisk,
  fetchHighRiskTenants,
  fetchRiskAssessments,
  refreshTenantRisk,
} from "../api/riskApi";

/*
==========================================
TENANT RISK HOOK
==========================================

Used for:

- Tenant risk assessment
- Risk score
- Risk level
- Risk indicators
- Risk conditions

==========================================
*/

export function useTenantRisk(tenantId) {
  const [risk, setRisk] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadRisk = async () => {
    if (!tenantId) {
      return;
    }

    try {
      setLoading(true);

      setError(null);

      const data = await fetchTenantRisk(tenantId);

      setRisk(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================
  REFRESH TENANT RISK
  ==========================================
  */

  const refreshRisk = async () => {
    if (!tenantId) {
      return;
    }

    try {
      setLoading(true);

      setError(null);

      const data = await refreshTenantRisk(tenantId);

      setRisk(data);

      return data;
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

    refresh: refreshRisk,
  };
}

/*
==========================================
HIGH RISK TENANTS HOOK
==========================================

Used for:

- High risk tenant table
- Risk dashboard

==========================================
*/

export function useHighRiskTenants() {
  const [tenants, setTenants] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadHighRiskTenants = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await fetchHighRiskTenants();

      setTenants(data ?? []);
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

/*
==========================================
ALL RISK ASSESSMENTS HOOK
==========================================

Used for:

- Risk Dashboard summary
- Risk analytics
- Risk history

==========================================
*/

export function useRiskAssessments() {
  const [risks, setRisks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadRisks = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await fetchRiskAssessments();

      setRisks(data ?? []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRisks();
  }, []);

  return {
    risks,

    loading,

    error,

    reload: loadRisks,
  };
}
