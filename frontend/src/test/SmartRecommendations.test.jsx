import { describe, it, expect } from "vitest";

import { render, screen } from "@testing-library/react";

import SmartRecommendations from "../components/SmartRecommendations";

describe("Smart Recommendations", () => {
  it("should display recommendation information correctly", () => {
    const recommendations = [
      {
        id: "recommendation-001",

        title: "Overdue Payments Detected",

        description: "Send payment reminders to tenants with overdue balances.",

        priority: "High",

        category: "Payment",

        status: "Active",

        risk_condition: "Repeated late payments",

        tenant_id: "tenant-001",

        room_id: "room-101",
      },
    ];

    render(<SmartRecommendations recommendations={recommendations} />);

    expect(screen.getByText("Smart Recommendations")).toBeInTheDocument();

    expect(screen.getByText("Overdue Payments Detected")).toBeInTheDocument();

    expect(
      screen.getByText(
        "Send payment reminders to tenants with overdue balances.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Repeated late payments")).toBeInTheDocument();
  });

  it("should display recommendation priority and category", () => {
    const recommendations = [
      {
        id: 1,

        title: "Improve Occupancy",

        description: "Review vacant rooms.",

        priority: "Medium",

        category: "Occupancy",

        status: "Active",
      },
    ];

    render(<SmartRecommendations recommendations={recommendations} />);

    expect(screen.getByText("Medium")).toBeInTheDocument();

    expect(screen.getByText("Occupancy")).toBeInTheDocument();
  });

  it("should display multiple recommendations", () => {
    const recommendations = [
      {
        id: 1,

        title: "Payment Reminder",

        description: "Notify overdue tenants.",

        priority: "High",

        category: "Payment",

        status: "Active",
      },

      {
        id: 2,

        title: "Vacancy Warning",

        description: "Several rooms remain vacant.",

        priority: "Low",

        category: "Occupancy",

        status: "Active",
      },
    ];

    render(<SmartRecommendations recommendations={recommendations} />);

    expect(screen.getByText("Payment Reminder")).toBeInTheDocument();

    expect(screen.getByText("Vacancy Warning")).toBeInTheDocument();
  });

  it("should display empty state when no recommendations exist", () => {
    render(<SmartRecommendations recommendations={[]} />);

    expect(
      screen.getByText("No recommendations available."),
    ).toBeInTheDocument();
  });
});
