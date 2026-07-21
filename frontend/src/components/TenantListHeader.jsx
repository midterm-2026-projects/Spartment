import AddTenantButton from "./AddTenantButton";

export default function TenantListHeader({
  tenantCount = 0,
  onAddTenant,
  showAddButton = false,
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold">Tenant List</h1>

        <p className="mt-1 text-gray-500">
          View and manage all registered tenants.
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Total tenants: {tenantCount}
        </p>
      </div>

      {showAddButton ? <AddTenantButton onClick={onAddTenant} /> : null}
    </div>
  );
}
