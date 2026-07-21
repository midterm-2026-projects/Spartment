import RoomAvailabilityBadge from "./RoomAvailabilityBadge";

function getRoomNumber(room) {
  return room.roomNumber || room.room_number || room.name || "Unknown";
}

function getRoomPrice(room) {
  return room.monthlyRent ?? room.monthly_rent ?? room.rent ?? room.price ?? 0;
}

export default function GuestRoomCard({ room, onInquiry }) {
  const status = String(room?.status || "").toLowerCase();

  const available = status === "available";

  const roomNumber = getRoomNumber(room);
  const price = getRoomPrice(room);

  return (
    <article className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {roomNumber.toLowerCase().startsWith("room")
            ? roomNumber
            : `Room ${roomNumber}`}
        </h2>

        <RoomAvailabilityBadge status={room.status} />
      </div>

      <div className="mt-4 space-y-1 text-gray-700">
        <p>
          Monthly Rent:{" "}
          <span className="font-semibold">
            ₱{Number(price).toLocaleString()}
          </span>
        </p>

        {room.capacity ? <p>Capacity: {room.capacity}</p> : null}
      </div>

      <button
        type="button"
        disabled={!available}
        onClick={() => onInquiry?.(room)}
        className={
          available
            ? "mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            : "mt-5 w-full cursor-not-allowed rounded-lg bg-gray-300 px-4 py-2 text-gray-600"
        }
      >
        {available ? "Send Inquiry" : "Unavailable"}
      </button>
    </article>
  );
}
