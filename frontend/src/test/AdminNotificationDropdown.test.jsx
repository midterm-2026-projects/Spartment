import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdminNotificationDropdown from "../components/AdminNotificationDropdown";

describe("AdminNotificationDropdown", () => {
  const notifications = [
    {
      id: 1,
      category: "Payment",
      message: "Tenant payment is overdue.",
      status: "Unread",
    },
    {
      id: 2,
      category: "Lease",
      message: "Lease expires in 7 days.",
      status: "Unread",
    },
    {
      id: 3,
      category: "Maintenance",
      message: "New maintenance request submitted.",
      status: "Read",
    },
  ];

  it("should render the admin notifications heading", () => {
    // Arrange
    render(
      <AdminNotificationDropdown
        notifications={notifications}
        onMarkAsRead={vi.fn()}
      />
    );

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
    render(
      <AdminNotificationDropdown
        notifications={notifications}
        onMarkAsRead={vi.fn()}
      />
    );

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
    render(
      <AdminNotificationDropdown
        notifications={notifications}
        onMarkAsRead={vi.fn()}
      />
    );

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /admin notifications/i,
      })
    );

    // Assert
    const indicators = screen.getAllByTestId(
      "unread-indicator"
    );

    expect(indicators).toHaveLength(2);
  });
});