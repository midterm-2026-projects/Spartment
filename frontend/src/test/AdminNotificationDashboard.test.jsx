import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

vi.mock("../api/notificationApi", () => ({
  getNotifications: vi.fn(),
  updateNotification: vi.fn(),
}));

import {
  getNotifications,
  updateNotification,
} from "../api/notificationApi";

import AdminNotificationDashboard from "../pages/AdminNotificationDashboard";

describe("Admin Notification Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve active notifications successfully from the backend", async () => {
    // Arrange
    getNotifications.mockResolvedValue([
      {
        id: 1,
        category: "Payment",
        message: "Tenant payment is overdue.",
        status: "Unread",
      },
    ]);

    // Act
    render(<AdminNotificationDashboard />);

    // Assert
    await waitFor(() => {
      expect(getNotifications).toHaveBeenCalled();
    });
  });

  it("should display payment, lease, room, and maintenance notifications correctly", async () => {
    // Arrange
    getNotifications.mockResolvedValue([
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
        status: "Unread",
      },
    ]);

    // Act
    render(<AdminNotificationDashboard />);

    await waitFor(() => {
      fireEvent.click(
        screen.getByText("Admin Notifications")
      );
    });

    // Assert
    expect(
      screen.getByText("Tenant payment is overdue.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Lease expires in 7 days.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "New maintenance request submitted."
      )
    ).toBeInTheDocument();
  });

  it("should update the notification status from Unread to Read successfully", async () => {
    // Arrange
    getNotifications.mockResolvedValue([
      {
        id: 1,
        message: "Tenant payment is overdue.",
        status: "Unread",
      },
    ]);

    updateNotification.mockResolvedValue({
      id: 1,
      status: "Read",
    });

    // Act
    render(<AdminNotificationDashboard />);

    await waitFor(() => {
      fireEvent.click(
        screen.getByText("Admin Notifications")
      );
    });

    fireEvent.click(
      screen.getByText("Mark as Read")
    );

    // Assert
    await waitFor(() => {
      expect(updateNotification).toHaveBeenCalledWith(1);
    });
  });

  it("should display an appropriate message when notification information is unavailable", async () => {
    // Arrange
    getNotifications.mockRejectedValue(
      new Error("Database Error")
    );

    // Act
    render(<AdminNotificationDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong.")
      ).toBeInTheDocument();
    });
  });
}
);