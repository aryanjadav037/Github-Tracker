/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SkeletonLoader from "../../Pages/SkeletonLoader"; // Adjust the import path if needed

describe("SkeletonLoader Component", () => {
  test("renders the skeleton loader correctly", () => {
    render(<SkeletonLoader />);

    const skeletonElement = screen.getByTestId("skeleton-loader");
    expect(skeletonElement).toBeInTheDocument();
  });
});
