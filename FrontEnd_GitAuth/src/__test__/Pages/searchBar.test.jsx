/* eslint-disable no-undef */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../../Pages/SearchBar"; // Adjust the import path if needed
import { vi } from "vitest";

describe("SearchBar Component", () => {
  test("renders the search bar correctly", () => {
    render(<SearchBar onFilterChange={() => {}} />);

    const inputElement = screen.getByPlaceholderText("Filter...");
    expect(inputElement).toBeInTheDocument();
  });

  test("calls onFilterChange when typing", () => {
    const mockOnFilterChange = vi.fn();
    render(<SearchBar onFilterChange={mockOnFilterChange} />);

    const inputElement = screen.getByPlaceholderText("Filter...");
    
    // Simulate typing
    fireEvent.change(inputElement, { target: { value: "test" } });

    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });
});
