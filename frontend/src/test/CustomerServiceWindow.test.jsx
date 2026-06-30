import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import CustomerServiceWindow from "../components/CustomerServiceWindow";

describe("CustomerServiceWindow", () => {
  it("should render the Customer Service window", () => {
    // Arrange
    render(<CustomerServiceWindow />);

    // Act
    const heading = screen.getByRole("heading", {
      name: /spartment assistant/i,
    });

    // Assert
    expect(heading).toBeInTheDocument();
  });

  it("should render the close button", () => {
    // Arrange
    render(<CustomerServiceWindow />);

    // Act
    const closeButton = screen.getByRole("button", {
      name: /x/i,
    });

    // Assert
    expect(closeButton).toBeInTheDocument();
  });

  it("should call the onClose function when the close button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <CustomerServiceWindow onClose={handleClose} />
    );

    const closeButton = screen.getByRole("button", {
      name: /x/i,
    });

    // Act
    await user.click(closeButton);

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});