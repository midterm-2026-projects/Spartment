import { useState } from "react";

import AddTenantModal from "../components/AddTenantModal";
import CredentialDisplay from "../components/CredentialDisplay";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

import useTenantCreation from "../hooks/useTenantCreation";
import useRooms from "../hooks/useRooms";

export default function TenantCreation({ inquiry = null, onTenantCreated }) {
  const {
    rooms,
    loading: roomsLoading,
    error: roomsError,
    refetch: refetchRooms,
  } = useRooms();

  const {
    registerTenant,
    tenant,
    billing,
    credentials,
    loading: tenantLoading,
    error: tenantError,
    clear,
  } = useTenantCreation();

  const [modalOpen, setModalOpen] = useState(Boolean(inquiry));

  const [pageError, setPageError] = useState("");

  const handleOpen = () => {
    clear();

    setPageError("");

    setModalOpen(true);
  };

  const handleClose = () => {
    if (tenantLoading) {
      return;
    }

    setModalOpen(false);
  };

  const handleCreateTenant = async (tenantData) => {
    try {
      setPageError("");

      const response = await registerTenant(tenantData);

      setModalOpen(false);

      await refetchRooms();

      const createdTenant = response?.data?.tenant || response?.tenant || null;

      onTenantCreated?.(createdTenant);
    } catch (error) {
      setPageError(error.message);
    }
  };

  if (!inquiry && !tenant) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Tenant Creation</h1>

          <p className="mt-1 text-gray-500">
            Tenant accounts must be created from an approved inquiry.
          </p>
        </div>

        <EmptyState />
      </main>
    );
  }

  const error = pageError || tenantError || roomsError;

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Tenant Creation</h1>

          <p className="mt-1 text-gray-500">
            Create a tenant account from the approved inquiry.
          </p>
        </div>

        {inquiry && !modalOpen ? (
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Open Tenant Form
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mb-5">
          <ErrorMessage message={error} />
        </div>
      ) : null}

      <AddTenantModal
        open={modalOpen}
        inquiry={inquiry}
        rooms={rooms}
        loading={tenantLoading || roomsLoading}
        error={tenantError}
        onClose={handleClose}
        onSubmit={handleCreateTenant}
      />

      {credentials ? <CredentialDisplay credentials={credentials} /> : null}

      {tenant ? (
        <section className="mt-6 rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold">Tenant Information</h2>

          <div className="mt-3 space-y-1">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {tenant.fullName ||
                tenant.full_name ||
                tenant.name ||
                "Not available"}
            </p>

            <p>
              <span className="font-semibold">Email:</span>{" "}
              {tenant.email || tenant.user?.email || "Not available"}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              {tenant.status || "Active"}
            </p>
          </div>
        </section>
      ) : null}

      {billing ? (
        <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-xl font-bold text-blue-900">
            Initial Billing Created
          </h2>

          <div className="mt-3 space-y-1 text-blue-800">
            <p>
              <span className="font-semibold">Total:</span> ₱
              {Number(
                billing.totalAmount ??
                  billing.total_amount ??
                  billing.amount ??
                  0,
              ).toLocaleString()}
            </p>

            <p>
              <span className="font-semibold">Status:</span>{" "}
              {billing.status || "Pending"}
            </p>

            <p>
              <span className="font-semibold">Due Date:</span>{" "}
              {billing.dueDate || billing.due_date || "Not available"}
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
