export default function PaymentVerificationModal({
  payment,
  open,
  onClose,
  onConfirm,
}) {
  if (!open) {
    return null;
  }

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
        <h2 className="text-xl font-bold">Verify Payment</h2>

        <div className="mt-4">
          <p>
            Tenant:
            <b>{payment?.tenant_id}</b>
          </p>

          <p>
            Amount:
            <b>₱{payment?.amount}</b>
          </p>

          <p>
            Method:
            <b>{payment?.payment_method}</b>
          </p>
        </div>

        <div
          className="
          flex
          justify-end
          gap-2
          mt-5
        "
        >
          <button
            onClick={onClose}
            className="
            bg-gray-200
            px-4
            py-2
            rounded
            "
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(payment.id)}
            className="
            bg-green-600
            text-white
            px-4
            py-2
            rounded
            "
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
