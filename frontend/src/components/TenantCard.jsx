function getTenantName(tenant) {
  return (
    tenant.fullName ||
    tenant.full_name ||
    tenant.name ||
    tenant.user?.fullName ||
    tenant.user?.full_name ||
    "Unknown tenant"
  );
}

function getTenantEmail(tenant) {
  return tenant.email || tenant.user?.email || "No email";
}

function getRoomNumber(tenant) {
  return (
    tenant.room?.roomNumber ||
    tenant.room?.room_number ||
    tenant.roomNumber ||
    tenant.room_number ||
    tenant.room ||
    "Not assigned"
  );
}

function getRent(tenant) {
  return (
    tenant.monthlyRent ??
    tenant.monthly_rent ??
    tenant.room?.monthlyRent ??
    tenant.room?.monthly_rent ??
    tenant.rent ??
    0
  );
}

export default function TenantCard({ tenant, onView }) {
  if (!tenant) {
    return null;
  }

  const status = tenant.status || "Active";

  const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    suspended: "bg-red-100 text-red-700",
  };

  const statusClass =
    statusStyles[String(status).toLowerCase()] || statusStyles.active;

  return (
    <article className="rounded-xl border bg-white p-5 shadow">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold">{getTenantName(tenant)}</h2>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass}`}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Email:</span> {getTenantEmail(tenant)}
        </p>

        <p>
          <span className="font-semibold">Room:</span> {getRoomNumber(tenant)}
        </p>

        <p>
          <span className="font-semibold">Monthly Rent:</span> ₱
          {Number(getRent(tenant)).toLocaleString()}
        </p>

        <p>
          <span className="font-semibold">Move-in Date:</span>{" "}
          {tenant.moveInDate || tenant.move_in_date || "Not available"}
        </p>
      </div>

      {onView ? (
        <button
          type="button"
          onClick={() => onView(tenant)}
          className="mt-5 rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
        >
          View Details
        </button>
      ) : null}
    </article>
  );
}
