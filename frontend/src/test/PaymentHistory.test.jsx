import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PaymentHistory from "../components/PaymentHistory";

describe("PaymentHistory", () => {
  const payments = [
    {
      month: "January",
      amount: "₱5,000",
      status: "Paid",
    },
    {
      month: "February",
      amount: "₱5,000",
      status: "Pending",
    },
  ];

  it("should render the Payment History section", () => {
    // Arrange
    render(<PaymentHistory payments={payments} />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /payment history/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/month/i)).toBeInTheDocument();
    expect(screen.getByText(/amount/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });

  it("should display payment history records", () => {
    // Arrange
    render(<PaymentHistory payments={payments} />);

    // Assert
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("February")).toBeInTheDocument();
    expect(screen.getAllByText("₱5,000")).toHaveLength(2);
    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should display a message when there is no payment history", () => {
    // Arrange
    render(<PaymentHistory payments={[]} />);

    // Assert
    expect(
      screen.getByText(/no payment history found/i)
    ).toBeInTheDocument();
  });
});