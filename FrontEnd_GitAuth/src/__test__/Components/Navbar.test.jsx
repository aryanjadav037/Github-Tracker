/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../../Components/Navbar"; // Adjust the import path
import { vi } from "vitest";
import axios from "axios";

// Mock axios to prevent real API calls
vi.mock("axios");

describe("Navbar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders organization and repository dropdowns", () => {
    render(<Navbar />);
    
    expect(screen.getByText("Select Organization")).toBeInTheDocument();
    expect(screen.getByText("Select Repository")).toBeInTheDocument();
  });

  test("fetches and displays organizations", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ login: "org1" }, { login: "org2" }] });

    await act(async () => {
      render(<Navbar />);
    });

    await waitFor(() => screen.getByText("org1"));
    expect(screen.getByText("org1")).toBeInTheDocument();
    expect(screen.getByText("org2")).toBeInTheDocument();
  });

  test("updates repository dropdown when an organization is selected", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ login: "org1" }] }); // Organizations
    axios.get.mockResolvedValueOnce({ data: [{ name: "repo1" }, { name: "repo2" }] }); // Repositories

    await act(async () => {
      render(<Navbar />);
    });

    // Wait for organizations to load
    await waitFor(() => screen.getByText("org1"));

    // Select an organization
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "org1" } });

    // Wait for repositories to load
    await waitFor(() => screen.getByText("repo1"));
    expect(screen.getByText("repo1")).toBeInTheDocument();
    expect(screen.getByText("repo2")).toBeInTheDocument();
  });

  test("switches views when buttons are clicked", async () => {
    axios.get.mockResolvedValueOnce({ data: [{ login: "org1" }] });
    axios.get.mockResolvedValueOnce({ data: [{ name: "repo1" }] });

    await act(async () => {
      render(<Navbar />);
    });

    // Select an organization and repository
    fireEvent.change(screen.getAllByRole("combobox")[0], { target: { value: "org1" } });
    await waitFor(() => screen.getByText("repo1"));
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "repo1" } });

    // Click "View Commits"
    fireEvent.click(screen.getByRole("button", { name: /View Commits/i }));
    expect(screen.getByRole("button", { name: /View Commits/i })).toHaveClass("active");

    // Click "View Pull Requests"
    fireEvent.click(screen.getByRole("button", { name: /View Pull Requests/i }));
    expect(screen.getByRole("button", { name: /View Pull Requests/i })).toHaveClass("active");

    // Click "View Issues"
    fireEvent.click(screen.getByRole("button", { name: /View Issues/i }));
    expect(screen.getByRole("button", { name: /View Issues/i })).toHaveClass("active");

    // Click "View Changelogs"
    fireEvent.click(screen.getByRole("button", { name: /View Changelogs/i }));
    expect(screen.getByRole("button", { name: /View Changelogs/i })).toHaveClass("active");
  });
});
