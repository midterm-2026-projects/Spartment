import { render, screen } from "@testing-library/react";

import { describe, it, expect } from "vitest";

import PaymentStatusCard from "../components/PaymentStatusCard.jsx";

describe("Payment Status Card", () => {
  it("should display payment metrics correctly", () => {
    const metrics = {
      collectedRevenue: 50000,

      pendingPayments: 5,

      latePayments: 0,
    };

    render(<PaymentStatusCard metrics={metrics} />);

    expect(screen.getByText("Payment Status")).toBeInTheDocument();

    expect(screen.getByText(/Collected Revenue/)).toBeInTheDocument();

    expect(screen.getByText("₱50000")).toBeInTheDocument();

    expect(screen.getByText(/Pending Payments/)).toBeInTheDocument();

    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText(/Late Payments/)).toBeInTheDocument();
  });

  it("should display zero values", () => {
    render(
      <PaymentStatusCard
        metrics={{
          collectedRevenue: 0,

          pendingPayments: 0,

          latePayments: 0,
        }}
      />,
    );

    expect(screen.getByText("₱0")).toBeInTheDocument();
  });
});
