import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { inventoryService } from "@/services/inventory.service";

import { InventoryReportTable } from "../InventoryReportTable";

vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    getInventoryReport: vi.fn(),
  },
}));

// Mock DateRangePicker
vi.mock("@/components/shared/DateRangePicker", () => ({
  DateRangePicker: () => <div data-testid="date-range-picker" />,
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("InventoryReportTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display inventory report information", async () => {
    const mockReportItem = {
      ingredientId: "ing-1",
      ingredientCode: "SKU-TEST",
      ingredientName: "Test Ingredient",
      unit: "KG",
      openingStock: 10,
      totalStockIn: 5,
      totalStockOut: 2,
      totalSaleDeduction: 1,
      closingStock: 12,
      averageUnitCost: 1000,
      closingStockValue: 12000,
      totalOutbound: 3,
    };

    vi.mocked(inventoryService.getInventoryReport).mockResolvedValue({
      isSuccess: true,
      data: {
        items: [mockReportItem],
        totalCount: 1,
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
      },
    });

    renderWithProviders(<InventoryReportTable />);

    expect(await screen.findByText("Test Ingredient")).toBeInTheDocument();
    expect(screen.getByText("SKU-TEST")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText(/12,000/)).toBeInTheDocument();
  });
});
