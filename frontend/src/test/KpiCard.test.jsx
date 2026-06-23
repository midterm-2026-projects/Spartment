import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KpiCard from "../components/KpiCard";

describe("KpiCard Component", () => {
  it("should render the title when a title is provided", () => {
    // Arrange
    render(
      <KpiCard
        title="Monthly Revenue"
        value="₱39,000"
        subtitle="+9%"
      />
    );

    // Act
    const title = screen.getByText("Monthly Revenue");

    // Assert
    expect(title).toBeInTheDocument();
  });

  it("should not render a title when no title is provided", () => {
    // Arrange
    render(
      <KpiCard
        title=""
        value="₱39,000"
        subtitle="+9%"
      />
    );

    // Act
    const title = screen.queryByText("Monthly Revenue");

    // Assert
    expect(title).not.toBeInTheDocument();
  });

  it("should render the value when a value is provided", () => {
    // Arrange
    render(
      <KpiCard
        title="Monthly Revenue"
        value="₱39,000"
        subtitle="+9%"
      />
    );

    // Act
    const value = screen.getByText("₱39,000");

    // Assert
    expect(value).toBeInTheDocument();
  });

  it("should render 0 and hide the subtitle when no value is provided", () => {
    // Arrange
    render(
      <KpiCard
        title="Monthly Revenue"
        value=""
        subtitle="+9%"
      />
    );

    // Act
    const value = screen.getByText("0");
    const subtitle = screen.queryByText("+9%");

    // Assert
    expect(value).toBeInTheDocument();
    expect(subtitle).not.toBeInTheDocument();
  });
});