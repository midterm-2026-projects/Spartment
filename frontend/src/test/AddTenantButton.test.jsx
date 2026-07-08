import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";

import AddTenantButton from "../components/AddTenantButton";
import AddTenantModal from "../components/AddTenantModal";

describe("AddTenantButton", () => {
  it("should render the Add Tenant button correctly", () => {
    // Arrange
    render(<AddTenantButton onClick={() => {}} />);

    // Assert
    expect(
      screen.getByRole("button", {
        name: /add tenant/i,
      })
    ).toBeInTheDocument();
  });

  it("should call onClick when the Add Tenant button is clicked", async () => {
    // Arrange
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<AddTenantButton onClick={onClick} />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /add tenant/i,
      })
    );

    // Assert
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should open the Add Tenant module when clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    function Wrapper() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <AddTenantButton
            onClick={() => setOpen(true)}
          />

          <AddTenantModal
            open={open}
            onClose={() => setOpen(false)}
            onSubmit={vi.fn()}
          />
        </>
      );
    }

    render(<Wrapper />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /add tenant/i,
      })
    );

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /add tenant/i,
      })
    ).toBeInTheDocument();
  });
});