import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TenantNotificationDropdown from "../components/TenantNotificationDropdown";

describe("TenantNotificationDropdown", () => {
  it("should render the tenant notifications heading", () => {
    // Arrange
    render(<TenantNotificationDropdown />);

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /tenant notifications/i,
      })
    );

    // Assert
    expect(
      screen.getByRole("heading", {
        name: "Tenant Notifications",
      })
    ).toBeInTheDocument();
  });

  it("should display all tenant notification messages", () => {
    // Arrange
    render(<TenantNotificationDropdown />);

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /tenant notifications/i,
      })
    );

    // Assert
    expect(
      screen.getByText("Your payment is due tomorrow.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Your maintenance request is being processed."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Lease renewal is available.")
    ).toBeInTheDocument();
  });

  it("should display unread notification indicators", () => {
    // Arrange
    render(<TenantNotificationDropdown />);

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /tenant notifications/i,
      })
    );

    const indicators = screen.getAllByTestId(
      "unread-indicator"
    );

    // Assert
    expect(indicators).toHaveLength(2);
  });
});