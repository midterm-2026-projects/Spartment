export default function BillingSummaryCards({ billing = {} }) {
  const rent = billing.rentAmount ?? billing.rent_amount ?? 0;

  const water = billing.waterBill ?? billing.water_bill ?? 0;

  const electricity = billing.electricityBill ?? billing.electricity_bill ?? 0;

  const total = billing.totalAmount ?? billing.total_amount ?? 0;

  const status = billing.status ?? "Unavailable";

  return (
    <section
      className="
      bg-white
      rounded-xl
      shadow
      p-6
      "
    >
      <h2 className="text-xl font-bold mb-4">Billing Summary</h2>

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-5
        gap-4
        "
      >
        <div>
          <h3>Rent</h3>

          <p>₱{rent}</p>
        </div>

        <div>
          <h3>Water</h3>

          <p>₱{water}</p>
        </div>

        <div>
          <h3>Electricity</h3>

          <p>₱{electricity}</p>
        </div>

        <div>
          <h3>Total Amount</h3>

          <p>₱{total}</p>
        </div>

        <div>
          <h3>Status</h3>

          <p>{status}</p>
        </div>
      </div>
    </section>
  );
}
