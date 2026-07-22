import { useState } from "react";

export default function GenerateBillingModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    tenantId: "",
    roomId: "",
    billingType: "Rent",
    totalAmount: 0,
    billingPeriod: "",
    dueDate: "",
  });

  if (!open) {
    return null;
  }

  const submit = () => {
    onSubmit(form);
  };

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/40
      flex
      items-center
      justify-center
    "
    >
      <div
        className="
        bg-white
        rounded-xl
        p-6
        w-96
      "
      >
        <h2 className="text-xl font-bold mb-4">Generate Billing</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) =>
              setForm({
                ...form,
                [key]: e.target.value,
              })
            }
            className="
                border
                w-full
                p-2
                mb-2
                rounded
                "
          />
        ))}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="
            px-4
            py-2
            rounded
            bg-gray-200
            "
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="
            px-4
            py-2
            rounded
            bg-blue-600
            text-white
            "
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
