import AddTenantModal from "../components/AddTenantModal";
import CredentialDisplay from "../components/CredentialDisplay";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

import useTenantCreation from "../hooks/useTenantCreation";

export default function TenantCreation() {
  const {
    registerTenant,

    tenant,

    billing,

    loading,

    error,
  } = useTenantCreation();

  if (loading) {
    return <Loading />;
  }

  const credentials = tenant && {
    email: tenant.email,

    password: tenant.password || tenant.temporaryPassword,
  };

  return (
    <div>
      <h1>Tenant Creation</h1>

      {error && <ErrorMessage message={error} />}

      <AddTenantModal onSubmit={registerTenant} />

      {credentials && <CredentialDisplay credentials={credentials} />}

      {billing && (
        <div>
          <h2>Initial Billing Created</h2>

          <p>
            Total: <span>₱{billing.totalAmount}</span>
          </p>

          <p>
            Status: <span>{billing.status}</span>
          </p>
        </div>
      )}
    </div>
  );
}
