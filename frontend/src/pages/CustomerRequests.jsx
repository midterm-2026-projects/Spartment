import { useState } from "react";

import useCustomerRequests from "../hooks/useCustomerRequests";
import useTenantCreation from "../hooks/useTenantCreation";
import useRooms from "../hooks/useRooms";

import CustomerRequestTable from "../components/CustomerRequestTable";
import AddTenantModal from "../components/AddTenantModal";
import CredentialDisplay from "../components/CredentialDisplay";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function CustomerRequests() {
  const {
    requests,
    loading: requestsLoading,
    processingId,
    error: requestsError,
    approve,
    reject,
    refetch: refetchRequests,
  } = useCustomerRequests();

  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
    refetch: refetchRooms,
  } = useRooms();

  const {
    registerTenant,
    credentials,
    billing,
    loading: tenantLoading,
    error: tenantError,
    clear: clearTenantCreation,
  } = useTenantCreation();

  const [selectedInquiry, setSelectedInquiry] =
    useState(null);

  const [actionError, setActionError] =
    useState("");

  const handleApprove = async (inquiryId) => {
    try {
      setActionError("");

      await approve(inquiryId);
    } catch (error) {
      setActionError(error.message);
    }
  };

  const handleReject = async (inquiryId) => {
    try {
      setActionError("");

      await reject(inquiryId);
    } catch (error) {
      setActionError(error.message);
    }
  };

  const handleOpenTenantModal = (inquiry) => {
    setActionError("");

    clearTenantCreation();

    setSelectedInquiry(inquiry);
  };

  const handleCloseTenantModal = () => {
    if (tenantLoading) {
      return;
    }

    setSelectedInquiry(null);
  };

  const handleCreateTenant = async (
    tenantData,
  ) => {
    try {
      setActionError("");

      await registerTenant(tenantData);

      setSelectedInquiry(null);

      await Promise.all([
        refetchRequests(),
        refetchRooms(),
      ]);
    } catch (error) {
      setActionError(error.message);
    }
  };

  if (requestsLoading) {
    return <Loading />;
  }

  const pageError =
    actionError ||
    requestsError ||
    roomsError;

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Customer Requests
        </h1>

        <p className="mt-1 text-gray-500">
          Review inquiries, approve or reject
          requests, and create tenant accounts from
          approved inquiries.
        </p>
      </div>

      {pageError ? (
        <div className="mb-5">
          <ErrorMessage message={pageError} />
        </div>
      ) : null}

      <CustomerRequestTable
        requests={requests}
        processingId={processingId}
        onApprove={handleApprove}
        onReject={handleReject}
        onAddTenant={handleOpenTenantModal}
      />

      <AddTenantModal
        open={Boolean(selectedInquiry)}
        inquiry={selectedInquiry}
        rooms={rooms}
        loading={
          tenantLoading || roomsLoading
        }
        error={tenantError}
        onClose={handleCloseTenantModal}
        onSubmit={handleCreateTenant}
      />

      {credentials ? (
        <div className="mt-6">
          <CredentialDisplay
            credentials={credentials}
          />
        </div>
      ) : null}

      {billing ? (
        <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-xl font-bold text-blue-900">
            Initial Billing Created
          </h2>

          <div className="mt-3 space-y-1 text-blue-800">
            <p>
              <span className="font-semibold">
                Total:
              </span>{" "}
              ₱
              {Number(
                billing.totalAmount ??
                  billing.total_amount ??
                  billing.amount ??
                  0,
              ).toLocaleString()}
            </p>

            <p>
              <span className="font-semibold">
                Status:
              </span>{" "}
              {billing.status || "Pending"}
            </p>

            <p>
              <span className="font-semibold">
                Due Date:
              </span>{" "}
              {billing.dueDate ||
                billing.due_date ||
                "Not available"}
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}