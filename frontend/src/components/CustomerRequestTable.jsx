import AddTenantButton from "./AddTenantButton";

function normalizeStatus(status) {
  return String(status || "Pending").toLowerCase();
}

function getRequestName(request) {
  return (
    request.guestName ||
    request.fullName ||
    request.full_name ||
    request.name ||
    "Unknown"
  );
}

function getRequestRoom(request) {
  return (
    request.room?.roomNumber ||
    request.room?.room_number ||
    request.roomNumber ||
    request.room_number ||
    request.requestedRoom ||
    request.preferredRoom ||
    "Not specified"
  );
}

function getStatusClasses(status) {
  const normalizedStatus = normalizeStatus(status);

  if (normalizedStatus === "approved") {
    return "bg-green-100 text-green-700";
  }

  if (normalizedStatus === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
}

export default function CustomerRequestTable({
  requests = [],
  onApprove,
  onReject,
  onAddTenant,
  processingId = "",
}) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
        No customer inquiries found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="w-full min-w-[950px] border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Name</th>

            <th className="p-3 text-left">Email</th>

            <th className="p-3 text-left">Contact</th>

            <th className="p-3 text-left">Room</th>

            <th className="p-3 text-left">Move-in Date</th>

            <th className="p-3 text-left">Message</th>

            <th className="p-3 text-left">Status</th>

            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => {
            const status = normalizeStatus(request.status);

            const isPending = status === "pending";

            const isApproved = status === "approved";

            const isProcessing = processingId === request.id;

            const tenantAlreadyCreated = Boolean(
              request.tenantId || request.tenant_id || request.tenant,
            );

            return (
              <tr key={request.id} className="border-t align-top">
                <td className="p-3 font-medium">{getRequestName(request)}</td>

                <td className="p-3">{request.email || "—"}</td>

                <td className="p-3">{request.contact || "—"}</td>

                <td className="p-3">{getRequestRoom(request)}</td>

                <td className="p-3">
                  {request.moveInDate || request.move_in_date || "—"}
                </td>

                <td className="max-w-xs p-3">{request.message || "—"}</td>

                <td className="p-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClasses(
                      request.status,
                    )}`}
                  >
                    {request.status || "Pending"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => onApprove?.(request.id)}
                          className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isProcessing ? "Processing..." : "Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => onReject?.(request.id)}
                          className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}

                    {isApproved ? (
                      <AddTenantButton
                        disabled={tenantAlreadyCreated || isProcessing}
                        label={
                          tenantAlreadyCreated ? "Tenant Added" : "Add Tenant"
                        }
                        onClick={() => onAddTenant?.(request)}
                      />
                    ) : null}

                    {!isPending && !isApproved ? (
                      <span className="text-sm text-gray-500">
                        No available action
                      </span>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
