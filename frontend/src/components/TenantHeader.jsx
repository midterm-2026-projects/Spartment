export default function TenantHeader({
  tenant = {
    name: "Juan Dela Cruz",
    contact: "09123456789",
    email: "juan@email.com",
  },
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h1 className="text-3xl font-bold" aria-label="Tenant Portal">
        Tenant Portal
      </h1>

      <p className="text-gray-500 mt-1">
        Welcome to your tenant dashboard.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-sm text-gray-500">Tenant Name</h2>
          <p className="font-semibold">{tenant.name}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Contact Number</h2>
          <p>{tenant.contact}</p>
        </div>

        <div>
          <h2 className="text-sm text-gray-500">Email Address</h2>
          <p>{tenant.email}</p>
        </div>
      </div>
    </div>
  );
}