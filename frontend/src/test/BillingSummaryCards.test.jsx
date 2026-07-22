import { render, screen } from "@testing-library/react";

import { describe, it, expect } from "vitest";

import BillingSummaryCards from "../components/BillingSummaryCards.jsx";

describe("Billing Summary Cards", () => {
  it("should display billing summary information", () => {
    const billing = {
      rentAmount: 5000,

      waterBill: 200,

      electricityBill: 850,

      totalAmount: 6050,

      status: "Unpaid",
    };

    render(<BillingSummaryCards billing={billing} />);

    expect(screen.getByText("Billing Summary")).toBeInTheDocument();

    expect(screen.getByText("Rent")).toBeInTheDocument();

    expect(screen.getByText("Total Amount")).toBeInTheDocument();

    expect(screen.getByText("₱6050")).toBeInTheDocument();

    expect(screen.getByText("Unpaid")).toBeInTheDocument();
  });

  it("should display default values", () => {
    render(<BillingSummaryCards />);

    expect(screen.getAllByText("₱0")).toHaveLength(4);

    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });
});
