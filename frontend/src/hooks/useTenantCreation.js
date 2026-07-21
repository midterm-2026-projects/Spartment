import { useState } from "react";

import { createTenant } from "../api/tenantCreationApi";

export default function useTenantCreation() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const [tenant, setTenant] = useState(null);

  const [billing, setBilling] = useState(null);

  const registerTenant = async (tenantData) => {
    try {
      setLoading(true);

      setError(null);

      const response = await createTenant(tenantData);

      /*
      Backend response:

      {
        message,
        data:{
          tenant,
          billing
        }
      }

      */

      setTenant(response.data.tenant);

      setBilling(response.data.billing);

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    registerTenant,

    tenant,

    billing,

    loading,

    error,
  };
}
