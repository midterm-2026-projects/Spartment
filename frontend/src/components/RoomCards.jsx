import RoomAvailabilityBadge from "./RoomAvailabilityBadge";

function getRoomNumber(room) {
  return room.roomNumber || room.room_number || room.name || "Unknown room";
}

function getMonthlyRent(room) {
  return room.monthlyRent ?? room.monthly_rent ?? room.rent ?? room.price ?? 0;
}

function getTenantName(room) {
  return (
    room.tenant?.fullName ||
    room.tenant?.full_name ||
    room.tenant?.name ||
    room.tenantName ||
    room.tenant_name ||
    "No tenant"
  );
}

export default function RoomCards({ room, onEdit }) {
  if (!room) {
    return null;
  }

  const monthlyRent = getMonthlyRent(room);

  return (
    <article className="rounded-xl border bg-white p-5 shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{getRoomNumber(room)}</h2>

          <div className="mt-2">
            <RoomAvailabilityBadge status={room.status} />
          </div>
        </div>

        {onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(room)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Edit
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-2 text-gray-700">
        <p>
          <span className="font-semibold">Tenant:</span> {getTenantName(room)}
        </p>

        <p>
          <span className="font-semibold">Monthly Rent:</span> ₱
          {Number(monthlyRent).toLocaleString()}
        </p>

        {room.capacity ? (
          <p>
            <span className="font-semibold">Capacity:</span> {room.capacity}
          </p>
        ) : null}
      </div>
    </article>
  );
}
