import { useEffect } from "react";

import useBilling from "../hooks/useBilling";

import Loading from "../components/Loading";

import ErrorMessage from "../components/ErrorMessage";

import EmptyState from "../components/EmptyState";

import BillingSummaryCards from "../components/BillingSummaryCards";

import PaymentHistory from "../components/PaymentHistory";

export default function BillingDashboard() {
  const {
    billing,

    loading,

    error,

    fetchTenantBilling,
  } = useBilling();

  useEffect(() => {
    fetchTenantBilling(1).catch(() => {});
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!billing) {
    return <EmptyState />;
  }

  return (
    <div>
      <h1>Billing Dashboard</h1>

      <BillingSummaryCards billing={billing} />

      <PaymentHistory payments={billing.payments || []} />
    </div>
  );
}
