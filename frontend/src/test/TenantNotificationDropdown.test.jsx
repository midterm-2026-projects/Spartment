import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TenantNotificationDropdown from "../components/TenantNotificationDropdown";

describe("TenantNotificationDropdown", () => {
  const notifications = [
    {
      id: 1,
      category: "Payment",
      message: "Your payment is due tomorrow.",
      status: "Unread",
    },
    {
      id: 2,
      category: "Maintenance",
      message: "Your maintenance request is being processed.",
      status: "Read",
    },
    {
      id: 3,
      category: "Lease",
      message: "Lease renewal is available.",
      status: "Unread",
    },
  ];

  it("should render the tenant notifications heading", () => {
    // Arrange
    render(
      <TenantNotificationDropdown
        notifications={notifications}
        onMarkAsRead={vi.fn()}
      />
    );

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
    render(
      <TenantNotificationDropdown
        notifications={notifications}
        onMarkAsRead={vi.fn()}
      />
    );

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
    render(
      <TenantNotificationDropdown
        notifications={notifications}
        onMarkAsRead={vi.fn()}
      />
    );

    // Act
    fireEvent.click(
      screen.getByRole("button", {
        name: /tenant notifications/i,
      })
    );

    // Assert
    const indicators = screen.getAllByTestId(
      "unread-indicator"
    );

    expect(indicators).toHaveLength(2);
  });
});