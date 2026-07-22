import RoomAvailabilityBadge from "./RoomAvailabilityBadge";

export default function GuestRoomCard({ room, onInquiry }) {
  const status = String(room?.status || "Unknown");
  const available = status.toLowerCase() === "available";
  const number = room.roomNumber || room.room_number || room.name || "Unknown";
  const price = room.monthlyRent ?? room.monthly_rent ?? room.rent ?? room.price ?? 0;
  const floor = room.floor || room.floor_number || String(number).charAt(0) || "—";

  return (
    <article className="room-card">
      <div className="room-card__visual" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M6 21V5.5A1.5 1.5 0 0 1 7.5 4h7A1.5 1.5 0 0 1 16 5.5V21M9 8h4m-4 4h4m-4 4h4m3-6h1.5a1.5 1.5 0 0 1 1.5 1.5V21M4 21h16" />
        </svg>
      </div>
      <div className="room-card__title">
        <div><h3>{String(number).toLowerCase().startsWith("room") ? number : `Room ${number}`}</h3><p>Floor {floor}</p></div>
        <RoomAvailabilityBadge status={status} />
      </div>
      <p className="room-card__price">₱{Number(price).toLocaleString()}<small>/mo</small></p>
      <button type="button" disabled={!available} onClick={() => onInquiry?.(room)}>
        <span aria-hidden="true">◯</span> {available ? "Inquire" : "Unavailable"}
      </button>
    </article>
  );
}
