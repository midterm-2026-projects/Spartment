import { useState } from "react";

import { submitInquiry } from "../api/inquiryApi";

export default function useInquiry() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const createInquiry = async (inquiryData) => {
    try {
      setLoading(true);

      setError("");
      setSuccess("");

      const response = await submitInquiry(inquiryData);

      setSuccess(response.message || "Inquiry submitted successfully.");

      return response;
    } catch (error) {
      setError(error.message);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess("");
    setError("");
  };

  return {
    createInquiry,
    loading,
    success,
    error,
    reset,
  };
}
