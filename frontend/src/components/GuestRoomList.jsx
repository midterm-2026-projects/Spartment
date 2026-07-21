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

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Available Rooms</h2>

        <p className="mt-1 text-gray-500">
          Select an available room to submit an inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
          <GuestRoomCard
            key={room.id || room.roomId}
            room={room}
            onInquiry={onInquiry}
          />
        ))}
      </div>
    </section>
  );
}
