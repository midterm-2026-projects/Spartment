import { useState } from "react";

import {
  createPayment,
  verifyPayment,
  rejectPayment,
  getPaymentHistory,
  getPaymentMetrics,
} from "../api/paymentApi";

export default function usePayments() {
  const [payments, setPayments] = useState([]);

  const [metrics, setMetrics] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchPayments = async (tenantId) => {
    try {
      setLoading(true);

      const response = await getPaymentHistory(tenantId);

      setPayments(response.data);

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitTenantPayment = async (paymentData) => {
    try {
      return await createPayment(paymentData);
    } catch (error) {
      setError(error.message);

      throw error;
    }
  };

  const approvePayment = async (paymentId, verifiedBy) => {
    try {
      return await verifyPayment(
        paymentId,

        {
          verifiedBy,
        },
      );
    } catch (error) {
      setError(error.message);

      throw error;
    }
  };

  const declinePayment = async (paymentId, rejectedBy) => {
    try {
      return await rejectPayment(
        paymentId,

        {
          rejectedBy,
        },
      );
    } catch (error) {
      setError(error.message);

      throw error;
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await getPaymentMetrics();

      setMetrics(response.data);

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    }
  };

  return {
    payments,

    metrics,

    loading,

    error,

    fetchPayments,

    submitTenantPayment,

    approvePayment,

    declinePayment,

    fetchMetrics,
  };
}
