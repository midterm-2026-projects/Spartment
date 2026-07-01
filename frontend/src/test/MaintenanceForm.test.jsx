import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import MaintenanceForm from "../components/MaintenanceForm";

describe("MaintenanceForm", () => {
  it("should render the Maintenance form with all required input fields", () => {
    // Arrange
    render(<MaintenanceForm />);

    // Assert
    expect(
      screen.getByRole("heading", {
        name: /spartment assistant/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/room number/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/issue/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/description/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /back/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /send/i,
      })
    ).toBeInTheDocument();
  });

  it("should allow the user to fill all text fields", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<MaintenanceForm />);

    const room = screen.getByLabelText(/room number/i);
    const issue = screen.getByLabelText(/issue/i);
    const description = screen.getByLabelText(/description/i);

    // Act
    await user.type(room, "205");
    await user.type(issue, "Leaking faucet");
    await user.type(
      description,
      "The faucet has been leaking since yesterday."
    );

    // Assert
    expect(room).toHaveValue("205");
    expect(issue).toHaveValue("Leaking faucet");
    expect(description).toHaveValue(
      "The faucet has been leaking since yesterday."
    );
  });

  it("should allow the user to delete all entered text", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<MaintenanceForm />);

    const room = screen.getByLabelText(/room number/i);
    const issue = screen.getByLabelText(/issue/i);
    const description = screen.getByLabelText(/description/i);

    await user.type(room, "205");
    await user.type(issue, "Leaking faucet");
    await user.type(
      description,
      "The faucet has been leaking since yesterday."
    );

    // Act
    await user.clear(room);
    await user.clear(issue);
    await user.clear(description);

    // Assert
    expect(room).toHaveValue("");
    expect(issue).toHaveValue("");
    expect(description).toHaveValue("");
  });
});