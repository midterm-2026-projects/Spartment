import { render, screen } from "@testing-library/react";

import { describe, it, expect } from "vitest";

import PaymentHistory from "../components/PaymentHistory.jsx";

describe("PaymentHistory", () => {
  const payments = [
    {
      id: 1,

      paymentDate: "2026-07-20",

      amount: 6050,

      paymentMethod: "Cash",

      status: "Paid",
    },

    {
      id: 2,

      paymentDate: "2026-06-20",

      amount: 5200,

      paymentMethod: "Cash",

      status: "Pending",
    },
  ];

  it("should render payment history section", () => {
    render(<PaymentHistory payments={payments} />);

    expect(screen.getByText("Payment History")).toBeInTheDocument();
  });

  it("should display payment records correctly", () => {
    render(<PaymentHistory payments={payments} />);

    expect(screen.getByText("7/20/2026")).toBeInTheDocument();

    expect(screen.getByText("6/20/2026")).toBeInTheDocument();

    expect(screen.getByText("₱6050")).toBeInTheDocument();

    expect(screen.getByText("₱5200")).toBeInTheDocument();

    expect(screen.getAllByText("Cash")).toHaveLength(2);

    expect(screen.getByText("Paid")).toBeInTheDocument();

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should display empty state when no payments exist", () => {
    render(<PaymentHistory payments={[]} />);

    expect(screen.getByText("No payment history found.")).toBeInTheDocument();
  });
});
