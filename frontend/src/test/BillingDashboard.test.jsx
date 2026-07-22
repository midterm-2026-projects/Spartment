import { describe, expect, it } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";

import { http, HttpResponse } from "msw";

import { server } from "../mocks/server.js";

import BillingDashboard from "../pages/BillingDashboard.jsx";

describe("Billing Dashboard", () => {
  it("should display billing information successfully", async () => {
    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Billing Summary")).toBeInTheDocument();

      expect(screen.getAllByText(/6050/)).toHaveLength(2);

      expect(screen.getByText("Unpaid")).toBeInTheDocument();
    });
  });

  it("should display billing charges correctly", async () => {
    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByText("₱5000")).toBeInTheDocument();

      expect(screen.getByText("₱200")).toBeInTheDocument();

      expect(screen.getByText("₱850")).toBeInTheDocument();
    });
  });

  it("should display payment history", async () => {
    render(<BillingDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Payment History")).toBeInTheDocument();
    });
  });

  it("should display error message when billing API fails", async () => {
    server.use(
      http.get(
        "http://localhost:5000/api/billing/tenant/:tenantId",

        () => {
          return HttpResponse.error();
        },
      ),
    );

    render(<BillingDashboard />);

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to retrieve billing information/i),
      ).toBeInTheDocument();
    });
  });
});
