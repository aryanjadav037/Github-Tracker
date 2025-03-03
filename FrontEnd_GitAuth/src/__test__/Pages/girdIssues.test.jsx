/* eslint-disable no-undef */
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import IssuesGrid from "../../Pages/gridIssues"; // Adjust the import path if needed
import { vi } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("IssuesGrid Component", () => {
  const mockData = {
    data: [
      {
        number: 101,
        title: "Fix login bug",
        user: { login: "johnDoe" },
        state: "open",
        comments: 5,
        created_at: "2025-03-01T12:00:00Z",
        updated_at: "2025-03-02T15:00:00Z",
        html_url: "https://github.com/example/issues/101",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders grid and search bar", async () => {
    await act(async () => {
      render(<IssuesGrid org="test-org" repo="test-repo" />);
    });

    expect(screen.getByPlaceholderText("Filter...")).toBeInTheDocument();
  });

  test("shows loading state initially", async () => {
    axios.get.mockResolvedValueOnce(new Promise(() => {})); // Simulate a pending API request

    await act(async () => {
      render(<IssuesGrid org="test-org" repo="test-repo" />);
    });

    // Ensure the skeleton loader appears
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  test("fetches and displays issues", async () => {
    axios.get.mockResolvedValueOnce(mockData);

    await act(async () => {
      render(<IssuesGrid org="test-org" repo="test-repo" />);
    });

    await waitFor(() => screen.getByText("Fix login bug"));
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("johnDoe")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  test("filters issues based on search input", async () => {
    axios.get.mockResolvedValueOnce(mockData);

    await act(async () => {
      render(<IssuesGrid org="test-org" repo="test-repo" />);
    });

    await waitFor(() => screen.getByText("Fix login bug"));

    // Simulate searching for an issue title
    fireEvent.change(screen.getByPlaceholderText("Filter..."), { target: { value: "login" } });

    // Ensure the issue is still displayed after filtering
    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
  });
});
