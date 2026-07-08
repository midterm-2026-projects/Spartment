import { useState } from "react";

export default function AddTenantModal({
  open,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    assignedRoom: "",
    password: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);

    setForm({
      fullName: "",
      email: "",
      assignedRoom: "",
      password: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-2xl font-bold">
          Add Tenant
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="block mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="block mb-1">
              Assigned Room
            </label>

            <input
              type="text"
              name="assignedRoom"
              value={form.assignedRoom}
              onChange={handleChange}
              placeholder="Room Number"
              className="w-full rounded border p-2"
            />
          </div>

          <div>
            <label className="block mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded border p-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Create Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}