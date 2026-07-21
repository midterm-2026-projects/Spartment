import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import AddTenantModal from "../components/AddTenantModal";

describe("AddTenantModal", () => {
  const inquiryId = "11111111-1111-4111-8111-111111111111";

  const roomId = "22222222-2222-4222-8222-222222222222";

  const approvedInquiry = {
    id: inquiryId,
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    contact: "09123456789",
    roomId,
    status: "Approved",
  };

  const availableRooms = [
    {
      id: roomId,
      roomNumber: "Room 101",
      monthlyRent: 6500,
      status: "Available",
    },
  ];

  it("should render the Add Tenant modal", () => {
    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /add tenant/i,
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/contact/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/assigned room/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/default password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create tenant/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    ).toBeInTheDocument();
  });

  it("should prefill inquiry information", () => {
    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Juan Dela Cruz");

    expect(screen.getByLabelText(/^email$/i)).toHaveValue("juan@example.com");

    expect(screen.getByLabelText(/contact/i)).toHaveValue("09123456789");

    expect(screen.getByLabelText(/assigned room/i)).toHaveValue(roomId);

    expect(
      screen.getByRole("option", {
        name: /room 101.*6,500/i,
      }),
    ).toBeInTheDocument();
  });

  it("should allow the user to edit all editable fields", async () => {
    const user = userEvent.setup();

    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const name = screen.getByLabelText(/full name/i);

    const email = screen.getByLabelText(/^email$/i);

    const contact = screen.getByLabelText(/contact/i);

    const room = screen.getByLabelText(/assigned room/i);

    const username = screen.getByLabelText(/username/i);

    const password = screen.getByLabelText(/default password/i);

    await user.clear(name);
    await user.type(name, "John Doe");

    await user.clear(email);
    await user.type(email, "john@email.com");

    await user.clear(contact);
    await user.type(contact, "09999999999");

    await user.selectOptions(room, roomId);

    await user.type(username, "johndoe");

    await user.type(password, "password123");

    expect(name).toHaveValue("John Doe");

    expect(email).toHaveValue("john@email.com");

    expect(contact).toHaveValue("09999999999");

    expect(room).toHaveValue(roomId);

    expect(username).toHaveValue("johndoe");

    expect(password).toHaveValue("password123");
  });

  it("should allow the user to delete text from text fields", async () => {
    const user = userEvent.setup();

    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    const name = screen.getByLabelText(/full name/i);

    const email = screen.getByLabelText(/^email$/i);

    const contact = screen.getByLabelText(/contact/i);

    const username = screen.getByLabelText(/username/i);

    const password = screen.getByLabelText(/default password/i);

    await user.type(username, "johndoe");

    await user.type(password, "password123");

    await user.clear(name);
    await user.clear(email);
    await user.clear(contact);
    await user.clear(username);
    await user.clear(password);

    expect(name).toHaveValue("");
    expect(email).toHaveValue("");
    expect(contact).toHaveValue("");
    expect(username).toHaveValue("");
    expect(password).toHaveValue("");
  });

  it("should add a tenant when Create Tenant is clicked", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const name = screen.getByLabelText(/full name/i);

    const email = screen.getByLabelText(/^email$/i);

    const contact = screen.getByLabelText(/contact/i);

    await user.clear(name);
    await user.type(name, "John Doe");

    await user.clear(email);
    await user.type(email, "john@email.com");

    await user.clear(contact);
    await user.type(contact, "09999999999");

    await user.selectOptions(screen.getByLabelText(/assigned room/i), roomId);

    await user.type(screen.getByLabelText(/username/i), "johndoe");

    await user.type(screen.getByLabelText(/default password/i), "password123");

    await user.click(
      screen.getByRole("button", {
        name: /create tenant/i,
      }),
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledWith({
      inquiryId,
      fullName: "John Doe",
      email: "john@email.com",
      contact: "09999999999",
      roomId,
      username: "johndoe",
      password: "password123",
    });
  });

  it("should not submit when required fields are missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AddTenantModal
        open
        inquiry={{
          id: inquiryId,
          name: "",
          email: "",
          contact: "",
          roomId: "",
        }}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /create tenant/i,
      }),
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should call onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={onClose}
        onSubmit={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should display an error message", () => {
    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        error="A tenant already exists."
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "A tenant already exists.",
    );
  });

  it("should disable actions while loading", () => {
    render(
      <AddTenantModal
        open
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /creating/i,
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: /cancel/i,
      }),
    ).toBeDisabled();
  });

  it("should display a message and disable creation when no rooms are available", () => {
    render(
      <AddTenantModal
        open
        inquiry={{
          ...approvedInquiry,
          roomId: "",
        }}
        rooms={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText(/no available rooms found/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /create tenant/i,
      }),
    ).toBeDisabled();
  });

  it("should not render when open is false", () => {
    render(
      <AddTenantModal
        open={false}
        inquiry={approvedInquiry}
        rooms={availableRooms}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
