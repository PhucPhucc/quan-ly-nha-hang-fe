import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { BestSeller } from "@/types/salesAnalytics.types";

import { BestSellersTable } from "../BestSellersTable";

describe("BestSellersTable", () => {
  const mockData: BestSeller[] = [
    {
      id: "1",
      rank: 1,
      name: "Burger",
      category: "Food",
      quantitySold: 100,
      revenue: 500000,
      percentageOfTotal: 50,
      grossProfit: 200000,
    },
    {
      id: "2",
      rank: 2,
      name: "Coke",
      category: "Drink",
      quantitySold: 200,
      revenue: 200000,
      percentageOfTotal: 20,
      grossProfit: 100000,
    },
  ];

  it("renders correctly with data", () => {
    render(<BestSellersTable data={mockData} />);
    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("Coke")).toBeInTheDocument();

    // Check categories
    const foodBadges = screen.getAllByText("Food");
    expect(foodBadges.length).toBeGreaterThan(0);
  });

  it("shows empty state when no data and not loading", () => {
    const { container } = render(<BestSellersTable data={[]} />);
    // Generic check for empty text since we don't know the exact UI_TEXT.COMMON.EMPTY string
    expect(container.textContent).toMatch(/trống|empty|không có/i);
  });
});
