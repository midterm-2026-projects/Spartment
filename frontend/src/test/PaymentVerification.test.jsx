import { describe, it, expect, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import PaymentVerificationTable from "../components/PaymentVerificationTable.jsx";

describe("Payment Verification", () => {
  it("should display pending payments", () => {
    render(
      <PaymentVerificationTable
        payments={[
          {
            id: 1,

            amount: 6050,

            verification_status: "Pending",
          },
        ]}
      />,
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
