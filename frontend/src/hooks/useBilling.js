import { useState } from "react";

import {
  getAllBilling,
  getTenantBilling,
  updateBillingStatus,
} from "../api/billingApi";

export default function useBilling() {
  const [billing, setBilling] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchBilling = async () => {
    try {
      setLoading(true);

      setError(null);

      const response = await getAllBilling();

      setBilling(response.data ?? response);

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantBilling = async (tenantId) => {
    try {
      setLoading(true);

      setError(null);

      const response = await getTenantBilling(tenantId);

      setBilling(response.data ?? response);

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const markBillingPaid = async (id) => {
    return await updateBillingStatus(id, "Paid");
  };

  return {
    billing,

    loading,

    error,

    fetchBilling,

    fetchTenantBilling,

    markBillingPaid,
  };
}
