export default function BillingSummaryCards({ billing = {} }) {
  return (
    <div>
      <h2>Billing Summary</h2>

      <div>
        <div>
          <h3>Rent</h3>

          <p>₱{billing.rentAmount ?? 0}</p>
        </div>

        <div>
          <h3>Water</h3>

          <p>₱{billing.waterBill ?? 0}</p>
        </div>

        <div>
          <h3>Electricity</h3>

          <p>₱{billing.electricityBill ?? 0}</p>
        </div>

        <div>
          <h3>Total Amount</h3>

          <p>₱{billing.totalAmount ?? 0}</p>
        </div>

        <div>
          <h3>Status</h3>

          <p>{billing.status ?? "Unavailable"}</p>
        </div>
      </div>
    </div>
  );
}
