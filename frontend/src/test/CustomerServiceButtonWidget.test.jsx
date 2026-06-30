import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import CustomerServiceButtonWidget from "../components/CustomerServiceButtonWidget";

describe("CustomerServiceButtonWidget", () => {
  it("should render the Customer Service button", () => {
    // Arrange
    render(<CustomerServiceButtonWidget />);

    // Act
    const button = screen.getByRole("button", {
      name: /customer service/i,
    });

    // Assert
    expect(button).toBeInTheDocument();
  });

  it("should call the onClick function when the button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <CustomerServiceButtonWidget onClick={handleClick} />
    );

    const button = screen.getByRole("button", {
      name: /customer service/i,
    });

    // Act
    await user.click(button);

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should open the Customer Service window when the button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    function TestComponent() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <CustomerServiceButtonWidget
            onClick={() => setOpen(true)}
          />

          {open && <h2>Customer Service Window</h2>}
        </>
      );
    }

    render(<TestComponent />);

    const button = screen.getByRole("button", {
      name: /customer service/i,
    });

    // Act
    await user.click(button);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /customer service window/i,
      })
    ).toBeInTheDocument();
  });
});