import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import { DashboardStats } from "@/types/salesAnalytics.types";

import { StatsGrid } from "../StatsGrid";

describe("StatsGrid", () => {
  const mockStats: DashboardStats = {
    totalRevenue: 1000000,
    revenueGrowth: 15.5,
    totalOrders: 100,
    avgOrderValue: 10000,
  };

  it("renders all statistics correctly", () => {
    render(<StatsGrid stats={mockStats} />);

    expect(screen.getByText("Tổng doanh thu")).toBeInTheDocument();
    expect(screen.getByText("1.000.000₫")).toBeInTheDocument();
    expect(screen.getByText("Tổng số đơn")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Giá trị trung bình")).toBeInTheDocument();
    expect(screen.getByText("10.000₫")).toBeInTheDocument();
  });

  it("shows growth percentage with trending icon", () => {
    render(<StatsGrid stats={mockStats} />);
    expect(screen.getByText("15.5%")).toBeInTheDocument();
  });

  it("shows loading state when requested", () => {
    render(<StatsGrid stats={mockStats} loading={true} />);
    expect(screen.getAllByText("...")).toHaveLength(3);
  });
});
