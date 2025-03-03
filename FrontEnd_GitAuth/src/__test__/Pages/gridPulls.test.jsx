/* eslint-disable no-undef */
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PullsGrid from "../../Pages/gridPulls"; // Adjust the import path if needed
import { vi } from "vitest";
import axios from "axios";

vi.mock("axios");

describe("PullsGrid Component", () => {
  const mockData = {
    data: [
      {
        number: 42,
        title: "Improve performance",
        user: { login: "devUser" },
        state: "open",
        created_at: "2025-03-01T12:00:00Z",
        updated_at: "2025-03-02T15:00:00Z",
        html_url: "https://github.com/example/pulls/42",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders grid and search bar", async () => {
    await act(async () => {
      render(<PullsGrid org="test-org" repo="test-repo" />);
    });

    expect(screen.getByPlaceholderText("Filter...")).toBeInTheDocument();
  });

  test("shows loading state initially", async () => {
    axios.get.mockResolvedValueOnce(new Promise(() => {})); // Simulate pending API request

    await act(async () => {
      render(<PullsGrid org="test-org" repo="test-repo" />);
    });

    // Ensure the skeleton loader appears
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  test("fetches and displays pull requests", async () => {
    axios.get.mockResolvedValueOnce(mockData);

    await act(async () => {
      render(<PullsGrid org="test-org" repo="test-repo" />);
    });

    await waitFor(() => screen.getByText("Improve performance"));
    expect(screen.getByText("Improve performance")).toBeInTheDocument();
    expect(screen.getByText("devUser")).toBeInTheDocument();
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  test("filters pull requests based on search input", async () => {
    axios.get.mockResolvedValueOnce(mockData);

    await act(async () => {
      render(<PullsGrid org="test-org" repo="test-repo" />);
    });

    await waitFor(() => screen.getByText("Improve performance"));

    // Simulate searching for PR title
    fireEvent.change(screen.getByPlaceholderText("Filter..."), { target: { value: "performance" } });

    // Ensure PR is still displayed after filtering
    expect(screen.getByText("Improve performance")).toBeInTheDocument();
  });
});
