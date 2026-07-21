import { useEffect, useState } from "react";

const INITIAL_FORM = {
  name: "",
  email: "",
  contact: "",
  roomId: "",
  type: "Room Inquiry",
  moveInDate: "",
  message: "",
};

function getRoomId(room) {
  return room?.id || room?.roomId || "";
}

function getRoomLabel(room) {
  return room?.roomNumber || room?.room_number || room?.name || "";
}

export default function InquiryForm({
  selectedRoom,
  rooms = [],
  handleSubmit,
  onSubmit,
  onBack,
  loading = false,
  error = "",
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!selectedRoom) {
      return;
    }

    setForm((currentForm) => ({
      ...currentForm,
      roomId: getRoomId(selectedRoom),
    }));
  }, [selectedRoom]);

  const update = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      roomId: form.roomId,
      type: form.type.trim(),
      moveInDate: form.moveInDate,
      message: form.message.trim(),
    };

    const submitHandler = onSubmit || handleSubmit;

    if (!submitHandler) {
      return;
    }

    await submitHandler(payload);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow"
    >
      <div className="mb-5">
        <h2 className="text-2xl font-bold">Room Inquiry</h2>

        <p className="mt-1 text-gray-500">
          Complete the form to request a room.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-4">
        <div>
          <label htmlFor="inquiry-name" className="mb-1 block font-medium">
            Full Name
          </label>

          <input
            id="inquiry-name"
            name="name"
            value={form.name}
            onChange={update}
            required
            className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="inquiry-email" className="mb-1 block font-medium">
            Email
          </label>

          <input
            id="inquiry-email"
            name="email"
            type="email"
            value={form.email}
            onChange={update}
            required
            className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="inquiry-contact" className="mb-1 block font-medium">
            Contact
          </label>

          <input
            id="inquiry-contact"
            name="contact"
            type="tel"
            value={form.contact}
            onChange={update}
            placeholder="09XXXXXXXXX"
            required
            className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="inquiry-room" className="mb-1 block font-medium">
            Preferred Room
          </label>

          <select
            id="inquiry-room"
            name="roomId"
            value={form.roomId}
            onChange={update}
            required
            className="w-full rounded-lg border bg-white p-2.5 outline-none focus:border-blue-500"
          >
            <option value="">Select a room</option>

            {rooms
              .filter(
                (room) =>
                  String(room.status || "").toLowerCase() === "available",
              )
              .map((room) => {
                const roomId = getRoomId(room);

                return (
                  <option key={roomId} value={roomId}>
                    {getRoomLabel(room)}
                  </option>
                );
              })}
          </select>
        </div>

        <div>
          <label htmlFor="inquiry-type" className="mb-1 block font-medium">
            Inquiry Type
          </label>

          <select
            id="inquiry-type"
            name="type"
            value={form.type}
            onChange={update}
            required
            className="w-full rounded-lg border bg-white p-2.5 outline-none focus:border-blue-500"
          >
            <option value="Room Inquiry">Room Inquiry</option>

            <option value="Reservation Inquiry">Reservation Inquiry</option>

            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="inquiry-move-in-date"
            className="mb-1 block font-medium"
          >
            Preferred Move-in Date
          </label>

          <input
            id="inquiry-move-in-date"
            name="moveInDate"
            type="date"
            value={form.moveInDate}
            onChange={update}
            required
            className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="inquiry-message" className="mb-1 block font-medium">
            Message
          </label>

          <textarea
            id="inquiry-message"
            name="message"
            value={form.message}
            onChange={update}
            rows={4}
            required
            className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Back
          </button>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
