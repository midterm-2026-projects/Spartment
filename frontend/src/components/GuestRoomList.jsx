import GuestRoomCard from "./GuestRoomCard";

export default function GuestRoomList({
  rooms = [],
  onInquiry,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading rooms...</div>
    );
  }

  if (rooms.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold">Available Rooms</h2>

        <div className="mt-5 rounded-xl border bg-white p-8 text-center text-gray-500">
          No rooms are currently available.
        </div>
      </section>
    );
  }

  const floors = rooms.reduce((groups, room) => {
    const label = room.floor || room.floor_number || String(room.roomNumber || room.room_number || "").charAt(0) || "Other";
    groups[label] = [...(groups[label] || []), room];
    return groups;
  }, {});

  return Object.entries(floors).map(([floor, floorRooms]) => (
    <section className="room-floor" key={floor}>
      <h2>Floor <span>{floor}</span></h2>
      <div className="room-grid">
        {floorRooms.map((room) => (
          <GuestRoomCard key={room.id || room.roomId} room={room} onInquiry={onInquiry} />
        ))}
      </div>
    </section>
  ));
}
