export default function RoomCards({
  room = {
    roomNumber: "Room 101",
    status: "Occupied",
    tenant: "Maria Santos",
    rent: 6500,
  },
  onEdit,
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {room.roomNumber}
          </h2>

          <p className="text-sm text-gray-500">
            {room.status}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(room)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Edit
        </button>
      </div>

      <div className="mt-5 space-y-2">
        <p>
          <span className="font-semibold">
            Tenant:
          </span>{" "}
          {room.tenant}
        </p>

        <p>
          <span className="font-semibold">
            Monthly Rent:
          </span>{" "}
          ₱{room.rent}
        </p>
      </div>
    </div>
  );
}