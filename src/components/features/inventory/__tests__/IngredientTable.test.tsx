import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { inventoryService } from "@/services/inventoryService";
import { AlertThresholdStatus, InventoryUnit } from "@/types/Inventory";

import { IngredientTable } from "../IngredientTable";

// Mock the service
vi.mock("@/services/inventoryService", () => ({
  inventoryService: {
    getIngredients: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("IngredientTable", () => {
  it("should display loading skeletons initially", () => {
    // Force loading state
    vi.mocked(inventoryService.getIngredients).mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<IngredientTable />);
    // Since we use shadcn Skeleton, it doesn't expose a specific standard role by default, but we can check if table isn't present
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should display empty state if no ingredients", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: { items: [], totalCount: 0, currentPage: 1, pageSize: 20, totalPages: 1 },
    });

    renderWithProviders(<IngredientTable />);

    const emptyMsg = await screen.findByText(/Chưa có nguyên liệu/i);
    expect(emptyMsg).toBeInTheDocument();
  });

  it("should display table rows with ingredients", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: {
        items: [
          {
            id: "1",
            name: "Potato",
            sku: "SKU-P",
            category: "Veg",
            unit: InventoryUnit.KG,
            currentStock: 50,
            lowStockThreshold: 10,
            costPerUnit: 2,
            status: AlertThresholdStatus.NORMAL,
            updatedAt: "",
          },
        ],
        totalCount: 1,
        currentPage: 1,
        pageSize: 20,
        totalPages: 1,
      },
    });

    renderWithProviders(<IngredientTable />);

    const cell = await screen.findByText("Potato");
    expect(cell).toBeInTheDocument();
    expect(screen.getByText("SKU-P")).toBeInTheDocument();
  });
});
