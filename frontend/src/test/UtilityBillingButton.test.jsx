import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import UtilityBillingButton from "../components/UtilityBillingButton";
import UtilityBillingCards from "../components/UtilityBillingCards";

describe("UtilityBillingButton", () => {
  it("should render the Utility Billing button successfully", () => {
    // Arrange
    render(<UtilityBillingButton />);

    // Act
    const button = screen.getByRole("button", {
      name: /utility billing/i,
    });

    // Assert
    expect(button).toBeInTheDocument();
  });

  it("should call onClick when the Utility Billing button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <UtilityBillingButton onClick={handleClick} />
    );

    const button = screen.getByRole("button", {
      name: /utility billing/i,
    });

    // Act
    await user.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should display the Electricity, Water, and Combined Utilities cards successfully", async () => {
    // Arrange
    const user = userEvent.setup();

    function TestComponent() {
      const [showCards, setShowCards] = useState(false);

      return (
        <>
          <UtilityBillingButton
            onClick={() => setShowCards(true)}
          />

          {showCards && <UtilityBillingCards />}
        </>
      );
    }

    render(<TestComponent />);

    const button = screen.getByRole("button", {
      name: /utility billing/i,
    });

    // Act
    await user.click(button);

    // Assert
    expect(
      screen.getByText(/electricity/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/^water$/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/combined utilities/i)
    ).toBeInTheDocument();
  });
});