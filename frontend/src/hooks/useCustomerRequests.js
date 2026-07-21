import { useCallback, useEffect, useState } from "react";

import {
  getCustomerRequests,
  approveRequest,
  rejectRequest,
} from "../api/customerRequestApi";

export default function useCustomerRequests() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [processingId, setProcessingId] = useState("");

  const [error, setError] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomerRequests();

      const data = Array.isArray(response) ? response : response?.data || [];

      setRequests(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = async (id) => {
    try {
      setProcessingId(id);

      await approveRequest(id);

      await fetchRequests();
    } finally {
      setProcessingId("");
    }
  };

  const reject = async (id) => {
    try {
      setProcessingId(id);

      await rejectRequest(id);

      await fetchRequests();
    } finally {
      setProcessingId("");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    processingId,
    error,
    approve,
    reject,
    refetch: fetchRequests,
  };
}
