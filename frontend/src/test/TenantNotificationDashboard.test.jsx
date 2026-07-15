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

import TenantNotificationDashboard from "../pages/TenantNotificationDashboard";

describe("Tenant Notification Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should retrieve active notifications successfully from the backend", async () => {
    // Arrange
    getNotifications.mockResolvedValue([
      {
        id: 1,
        message: "Your payment is due tomorrow.",
        status: "Unread",
      },
    ]);

    // Act
    render(<TenantNotificationDashboard />);

    // Assert
    await waitFor(() => {
      expect(getNotifications).toHaveBeenCalled();
    });
  });

  it("should display tenant notifications correctly", async () => {
    // Arrange
    getNotifications.mockResolvedValue([
      {
        id: 1,
        message: "Your payment is due tomorrow.",
        status: "Unread",
      },
      {
        id: 2,
        message:
          "Your maintenance request is being processed.",
        status: "Read",
      },
      {
        id: 3,
        message:
          "Lease renewal is available.",
        status: "Unread",
      },
    ]);

    // Act
    render(<TenantNotificationDashboard />);

    await waitFor(() => {
      fireEvent.click(
        screen.getByText("Tenant Notifications")
      );
    });

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
      screen.getByText(
        "Lease renewal is available."
      )
    ).toBeInTheDocument();
  });

  it("should update the notification status from Unread to Read successfully", async () => {
    // Arrange
    getNotifications.mockResolvedValue([
      {
        id: 1,
        message: "Your payment is due tomorrow.",
        status: "Unread",
      },
    ]);

    updateNotification.mockResolvedValue({
      id: 1,
      status: "Read",
    });

    // Act
    render(<TenantNotificationDashboard />);

    await waitFor(() => {
      fireEvent.click(
        screen.getByText("Tenant Notifications")
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
    render(<TenantNotificationDashboard />);

    // Assert
    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong.")
      ).toBeInTheDocument();
    });
  });
});