import { useState } from "react";

import { createTenant } from "../api/tenantCreationApi";

export default function useTenantCreation() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [tenant, setTenant] = useState(null);

  const [billing, setBilling] = useState(null);

  const [credentials, setCredentials] = useState(null);

  const registerTenant = async (tenantData) => {
    try {
      setLoading(true);

      setError("");

      const response = await createTenant(tenantData);

      const data = response.data || response;

      setTenant(data.tenant || null);

      setBilling(data.billing || null);

      setCredentials({
        username: tenantData.username,
        email: tenantData.email,
        password: tenantData.password,
      });

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setTenant(null);
    setBilling(null);
    setCredentials(null);
    setError("");
  };

  return {
    registerTenant,
    tenant,
    billing,
    credentials,
    loading,
    error,
    clear,
  };
}
