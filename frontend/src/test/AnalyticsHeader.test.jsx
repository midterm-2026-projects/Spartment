import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AnalyticsHeader from "../components/AnalyticsHeader";

describe("AnalyticsHeader", () => {
  it("should render the Analytics & Report header and sub-header successfully", () => {
    // Arrange
    render(<AnalyticsHeader />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /analytics & reports/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /insights, trends, and prescriptive recommendations/i
      )
    ).toBeInTheDocument();
  });
});