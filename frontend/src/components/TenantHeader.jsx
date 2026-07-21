export default function TenantHeader({ tenant = {} }) {
  const tenantName =
    tenant.fullName ||
    tenant.full_name ||
    tenant.name ||
    tenant.username ||
    "Tenant";

  const contactNumber =
    tenant.contactNumber ||
    tenant.contact_number ||
    tenant.contact ||
    tenant.phone ||
    tenant.phoneNumber ||
    tenant.phone_number ||
    "Not available";

  const email = tenant.email || tenant.user?.email || "Not available";

  return (
    <header className="mb-6 rounded-xl bg-white p-6 shadow">
      <h1 aria-label="Tenant Portal" className="text-3xl font-bold">
        Tenant Portal
      </h1>

      <p className="mt-1 text-gray-500">Welcome to your tenant dashboard.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <h2 className="text-sm text-gray-500">Tenant Name</h2>

          <p className="font-semibold">{tenantName}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Contact Number</h2>

          <p>{contactNumber}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Email Address</h2>

          <p>{email}</p>
        </div>
      </div>
    </header>
  );
}
