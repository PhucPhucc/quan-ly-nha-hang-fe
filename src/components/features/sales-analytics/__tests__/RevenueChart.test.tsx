import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { RevenueChart } from "../RevenueChart";

describe("RevenueChart", () => {
  const mockData = [
    { date: "01/01", revenue: 100000, orderCount: 10 },
    { date: "02/01", revenue: 200000, orderCount: 20 },
  ];

  it("renders chart correctly", () => {
    render(<RevenueChart data={mockData} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("shows loading state when requested", () => {
    const { container } = render(<RevenueChart data={[]} loading={true} />);
    const loadingIndicators = container.querySelectorAll(".animate-pulse");
    expect(loadingIndicators.length).toBeGreaterThan(0);
  });
});
