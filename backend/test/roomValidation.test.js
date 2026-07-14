import {
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { validateRoomSearch } from "../validation/roomValidation.js";

describe("Room Validation", () => {
  beforeEach(() => {});

  it("should validate room search successfully", () => {
    // Arrange
    const search = "Room 101";

    // Act & Assert
    expect(() =>
      validateRoomSearch(search)
    ).not.toThrow();
  });

  it("should validate room status search successfully", () => {
    // Arrange
    const search = "Occupied";

    // Act & Assert
    expect(() =>
      validateRoomSearch(search)
    ).not.toThrow();
  });

  it("should throw an error when the room search is empty", () => {
    // Arrange
    const search = "";

    // Act & Assert
    expect(() =>
      validateRoomSearch(search)
    ).toThrow("Room search is required.");
  });

  it("should throw an error when the room search contains only spaces", () => {
    // Arrange
    const search = "     ";

    // Act & Assert
    expect(() =>
      validateRoomSearch(search)
    ).toThrow("Room search is required.");
  });

  it("should throw an error when the room search is null", () => {
    // Arrange
    const search = null;

    // Act & Assert
    expect(() =>
      validateRoomSearch(search)
    ).toThrow("Room search is required.");
  });

  it("should throw an error when the room search is undefined", () => {
    // Arrange
    const search = undefined;

    // Act & Assert
    expect(() =>
      validateRoomSearch(search)
    ).toThrow("Room search is required.");
  });
});