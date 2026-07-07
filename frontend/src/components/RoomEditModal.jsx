import { useEffect, useState } from "react";

export default function RoomEditModal({
  open,
  room,
  onClose,
  onSubmit,
}) {
  const [status, setStatus] = useState("");
  const [rent, setRent] = useState("");

  useEffect(() => {
    if (room) {
      setStatus(room.status);
      setRent(room.rent);
    }
  }, [room]);

  if (!open || !room) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...room,
      status,
      rent,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Edit {room.roomNumber}
            </h2>

            <p className="mt-2 text-gray-500">
              Update room information.
              Tenant assignment is managed in
              Tenants.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mt-8">
          <div className="flex justify-between border-b pb-4">
            <span className="text-gray-500">
              Assigned Tenant
            </span>

            <span className="font-semibold">
              {room.tenant}
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6"
        >
          <div>
            <label className="mb-2 block font-semibold uppercase text-gray-500">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option>Vacant</option>
              <option>Occupied</option>
              <option>Reserved</option>
              <option>Maintenance</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold uppercase text-gray-500">
              Monthly Rent (₱)
            </label>

            <input
              type="number"
              value={rent}
              onChange={(e) =>
                setRent(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <p className="text-sm text-gray-500">
            Note: Utility charges
            (water, electricity,
            internet) are billed
            separately based on the
            provider's rates.
          </p>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-2 text-white"
            >
              Save Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}