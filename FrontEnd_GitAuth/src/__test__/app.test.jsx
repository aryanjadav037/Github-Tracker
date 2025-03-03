/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App"; // Adjust the import path if needed

describe("App Component", () => {
  test("renders the GitHubConnection component", () => {
    render(<App />);

    // Check if the GitHubConnection component is rendered
    expect(screen.getByText("Connect to GitHub")).toBeInTheDocument();
  });
});
