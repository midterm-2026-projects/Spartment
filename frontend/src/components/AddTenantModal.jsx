import { useEffect, useState } from "react";

const INITIAL_FORM = {
  inquiryId: "",
  fullName: "",
  email: "",
  contact: "",
  roomId: "",
  username: "",
  password: "",
};

function getInquiryRoomId(inquiry) {
  return inquiry?.roomId || inquiry?.room_id || inquiry?.room?.id || "";
}

function getRoomLabel(room) {
  return room.roomNumber || room.room_number || room.name || `Room ${room.id}`;
}

function getRoomPrice(room) {
  return room.monthlyRent ?? room.monthly_rent ?? room.rent ?? room.price;
}

export default function AddTenantModal({
  open,
  inquiry,
  rooms = [],
  onClose,
  onSubmit,
  loading = false,
  error = "",
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm({
      inquiryId: inquiry?.id || "",
      fullName: inquiry?.fullName || inquiry?.full_name || inquiry?.name || "",
      email: inquiry?.email || "",
      contact: inquiry?.contact || "",
      roomId: getInquiryRoomId(inquiry),
      username: "",
      password: "",
    });
  }, [open, inquiry]);

  if (!open) {
    return null;
  }

  const availableRooms = rooms.filter((room) => {
    const status = String(room.status || "").toLowerCase();

    return status === "available";
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.inquiryId ||
      !form.fullName.trim() ||
      !form.email.trim() ||
      !form.roomId ||
      !form.username.trim() ||
      !form.password
    ) {
      return;
    }

    await onSubmit?.({
      inquiryId: form.inquiryId,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      contact: form.contact.trim(),
      roomId: form.roomId,
      username: form.username.trim(),
      password: form.password,
    });
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setForm(INITIAL_FORM);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-tenant-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 id="add-tenant-title" className="text-2xl font-bold">
            Add Tenant
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Create an account from the approved inquiry.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="inquiryId" value={form.inquiryId} />

          <div>
            <label
              htmlFor="tenant-full-name"
              className="mb-1 block font-medium"
            >
              Full Name
            </label>

            <input
              id="tenant-full-name"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tenant-email" className="mb-1 block font-medium">
              Email
            </label>

            <input
              id="tenant-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tenant-contact" className="mb-1 block font-medium">
              Contact
            </label>

            <input
              id="tenant-contact"
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tenant-room" className="mb-1 block font-medium">
              Assigned Room
            </label>

            <select
              id="tenant-room"
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border bg-white p-2.5 outline-none focus:border-blue-500"
            >
              <option value="">Select an available room</option>

              {availableRooms.map((room) => {
                const roomId = room.id || room.roomId;

                const price = getRoomPrice(room);

                return (
                  <option key={roomId} value={roomId}>
                    {getRoomLabel(room)}
                    {price ? ` — ₱${Number(price).toLocaleString()}` : ""}
                  </option>
                );
              })}
            </select>

            {availableRooms.length === 0 ? (
              <p className="mt-1 text-sm text-red-600">
                No available rooms found.
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="tenant-username" className="mb-1 block font-medium">
              Username
            </label>

            <input
              id="tenant-username"
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
              autoComplete="off"
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tenant-password" className="mb-1 block font-medium">
              Default Password
            </label>

            <input
              id="tenant-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum of 8 characters"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border p-2.5 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || availableRooms.length === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Tenant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
