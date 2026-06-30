import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "../components/DashboardHeader";

describe("Header Component", () => {
  it("renders the dashboard title", () => {
    render(<Header />);

    expect(
      screen.getByText("Revenue Monitoring Dashboard")
    ).toBeInTheDocument();
  });

  it("renders the dashboard subtitle", () => {
    render(<Header />);

    expect(
      screen.getByText(
        "Monitor monthly revenue, occupancy, active tenants, and late payments."
      )
    ).toBeInTheDocument();
  });
});