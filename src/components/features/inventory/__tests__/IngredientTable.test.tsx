import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { inventoryService } from "@/services/inventory.service";
import { AlertThresholdStatus, InventoryUnit } from "@/types/Inventory";

import { IngredientTable } from "../IngredientTable";

vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    getIngredients: vi.fn(),
    getInventorySettings: vi.fn(),
  },
}));

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("IngredientTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(inventoryService.getInventorySettings).mockResolvedValue({
      isSuccess: true,
      data: {
        expiryWarningDays: 7,
        defaultLowStockThreshold: 0,
        autoDeductOnCompleted: true,
        costMethod: "WeightedAverage",
        maxCostRecalcDays: 31,
        openingStockStatus: 2,
        lockedAt: new Date().toISOString(),
      },
    });
  });

  it("should display loading skeletons initially", () => {
    vi.mocked(inventoryService.getIngredients).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<IngredientTable />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should display empty state if no ingredients", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: { items: [], totalCount: 0, currentPage: 1, pageSize: 20, totalPages: 1 },
    });

    renderWithProviders(<IngredientTable />);

    expect(await screen.findByText("Chưa có nguyên liệu")).toBeInTheDocument();
  });

  it("should display table rows with ingredients", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: {
        items: [
          {
            ingredientId: "1",
            name: "Potato",
            code: "SKU-P",
            unit: InventoryUnit.KG,
            currentStock: 50,
            lowStockThreshold: 10,
            costPrice: 2,
            status: AlertThresholdStatus.NORMAL,
            updatedAt: "",
            isActive: true,
          },
        ],
        totalCount: 1,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      },
    });

    renderWithProviders(<IngredientTable />);

    expect(await screen.findByText("Potato")).toBeInTheDocument();
    expect(screen.getByText("SKU-P")).toBeInTheDocument();
  });

  it("should show opening stock reminder when inventory has not been initialized", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: { items: [], totalCount: 0, currentPage: 1, pageSize: 20, totalPages: 1 },
    });

    vi.mocked(inventoryService.getInventorySettings).mockResolvedValue({
      isSuccess: true,
      data: {
        expiryWarningDays: 7,
        defaultLowStockThreshold: 0,
        autoDeductOnCompleted: true,
        costMethod: "WeightedAverage",
        maxCostRecalcDays: 31,
        openingStockStatus: 1,
        lockedAt: null,
      },
    });

    renderWithProviders(<IngredientTable />);

    expect(await screen.findByText("Bạn chưa nhập số dư đầu kỳ")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Đi đến nhập số dư" })).toHaveAttribute(
      "href",
      "/manager/inventory/opening-stock"
    );
  });

  it("should still show opening stock reminder when settings cannot be loaded", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: { items: [], totalCount: 0, currentPage: 1, pageSize: 20, totalPages: 1 },
    });

    vi.mocked(inventoryService.getInventorySettings).mockRejectedValue(
      new Error("Settings unavailable")
    );

    renderWithProviders(<IngredientTable />);

    expect(await screen.findByText("Bạn chưa nhập số dư đầu kỳ")).toBeInTheDocument();
  });
});
