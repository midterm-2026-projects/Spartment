import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import AddTenantModal from "../components/AddTenantModal";

describe("AddTenantModal", () => {
  it("should render the Add Tenant module", () => {
    // Arrange
    render(
      <AddTenantModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /add tenant/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter full name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/room number/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter password/i)
    ).toBeInTheDocument();
  });

  it("should allow the user to type into all text fields", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <AddTenantModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const name = screen.getByPlaceholderText(/enter full name/i);
    const email = screen.getByPlaceholderText(/enter email/i);
    const room = screen.getByPlaceholderText(/room number/i);
    const password = screen.getByPlaceholderText(/enter password/i);

    // Act
    await user.type(name, "John Doe");
    await user.type(email, "john@email.com");
    await user.type(room, "Room 101");
    await user.type(password, "password123");

    // Assert
    expect(name).toHaveValue("John Doe");
    expect(email).toHaveValue("john@email.com");
    expect(room).toHaveValue("Room 101");
    expect(password).toHaveValue("password123");
  });

  it("should allow the user to delete text from all text fields", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <AddTenantModal
        open={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    const name = screen.getByPlaceholderText(/enter full name/i);

    await user.type(name, "John Doe");

    // Act
    await user.clear(name);

    // Assert
    expect(name).toHaveValue("");
  });

  it("should add a tenant when Create Tenant is clicked", async () => {
    // Arrange
    const user = userEvent.setup();

    const onSubmit = vi.fn();

    render(
      <AddTenantModal
        open={true}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    await user.type(
      screen.getByPlaceholderText(/enter full name/i),
      "John Doe"
    );

    await user.type(
      screen.getByPlaceholderText(/enter email/i),
      "john@email.com"
    );

    await user.type(
      screen.getByPlaceholderText(/room number/i),
      "Room 101"
    );

    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "password123"
    );

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /create tenant/i,
      })
    );

    // Assert
    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledWith({
      fullName: "John Doe",
      email: "john@email.com",
      assignedRoom: "Room 101",
      password: "password123",
    });
  });
});