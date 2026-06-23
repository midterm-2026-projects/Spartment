import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotificationTable from "../components/NotificationTable";

describe("NotificationTable", () => {
  it("should render the notification table headers", () => {
    // Arrange
    render(<NotificationTable />);

    // Act
    const typeHeader = screen.getByText("Notification Type");
    const messageHeader = screen.getByText("Message");
    const timestampHeader = screen.getByText("Timestamp");

    // Assert
    expect(typeHeader).toBeInTheDocument();
    expect(messageHeader).toBeInTheDocument();
    expect(timestampHeader).toBeInTheDocument();
  });

  it("should display an empty notification table when there are no notifications", () => {
    // Arrange
    render(<NotificationTable notifications={[]} />);

    // Act
    const rows = screen.getAllByRole("row");

    // Assert
    expect(rows).toHaveLength(1);
  });

  it("should display notification records in the table", () => {
    // Arrange
    render(<NotificationTable />);

    // Act
    const paymentNotification = screen.getByText(
      "Tenant payment due tomorrow"
    );

    // Assert
    expect(paymentNotification).toBeInTheDocument();
  });

  it("should display the latest notification at the top of the table", () => {
    // Arrange
    render(<NotificationTable />);

    // Act
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1];

    // Assert
    expect(
      within(firstDataRow).getByText("Payment Due")
    ).toBeInTheDocument();

    expect(
      within(firstDataRow).getByText("2026-06-23")
    ).toBeInTheDocument();
  });
});