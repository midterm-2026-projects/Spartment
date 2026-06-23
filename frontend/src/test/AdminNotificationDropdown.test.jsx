import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AdminNotificationDropdown from "../components/AdminNotificationDropdown";

describe("AdminNotificationDropdown", () => {
  it("should render the admin notifications heading", () => {
    // Arrange
    render(<AdminNotificationDropdown />);

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /admin notifications/i,
      })
    );

    // Assert
    expect(
      screen.getByRole("heading", {
        name: "Admin Notifications",
      })
    ).toBeInTheDocument();
  });

  it("should display all admin notification messages", () => {
    // Arrange
    render(<AdminNotificationDropdown />);

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /admin notifications/i,
      })
    );

    // Assert
    expect(
      screen.getByText("Tenant payment is overdue.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Lease expires in 7 days.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("New maintenance request submitted.")
    ).toBeInTheDocument();
  });

  it("should display unread notification indicators", () => {
    // Arrange
    render(<AdminNotificationDropdown />);

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /admin notifications/i,
      })
    );

    const indicators = screen.getAllByTestId(
      "unread-indicator"
    );

    // Assert
    expect(indicators).toHaveLength(2);
  });
});