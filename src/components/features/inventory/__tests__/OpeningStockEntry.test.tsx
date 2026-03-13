import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { InventoryUnit } from "@/types/Inventory";

import { OpeningStockEntry } from "../OpeningStockEntry";

// Mock services and toast
vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    getIngredients: vi.fn(),
    importOpeningStock: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createQueryClient();

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("OpeningStockEntry", () => {
  const mockIngredients = [
    {
      ingredientId: "550e8400-e29b-41d4-a716-446655440000",
      name: "Cà chua",
      code: "TOMATO",
      unit: InventoryUnit.KG,
      currentStock: 10,
      costPrice: 20000,
      isActive: true,
      updatedAt: "",
      lowStockThreshold: 5,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render and load ingredients", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: {
        items: mockIngredients,
        totalCount: 1,
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
      },
    });

    renderWithProviders(<OpeningStockEntry />);

    await waitFor(() => {
      expect(screen.getByText("Cà chua")).toBeInTheDocument();
      expect(screen.getByText("TOMATO")).toBeInTheDocument();
    });
  });

  it("should handle quantity changes and submit", async () => {
    vi.mocked(inventoryService.getIngredients).mockResolvedValue({
      isSuccess: true,
      data: {
        items: mockIngredients,
        totalCount: 1,
        pageSize: 10,
        currentPage: 1,
        totalPages: 1,
      },
    });

    const mockImport = vi.mocked(inventoryService.importOpeningStock).mockResolvedValue({
      isSuccess: true,
      data: true,
    });

    const user = userEvent.setup();
    renderWithProviders(<OpeningStockEntry />);

    await waitFor(() => {
      expect(screen.getByText("Cà chua")).toBeInTheDocument();
    });

    const inputs = screen.getAllByRole("spinbutton"); // quantity and cost inputs
    const qtyInput = inputs[0];

    await user.clear(qtyInput);
    await user.type(qtyInput, "20");

    const saveBtn = screen.getByRole("button", { name: OPENING_STOCK.BTN_SAVE });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockImport).toHaveBeenCalledWith({
        items: [
          expect.objectContaining({
            ingredientId: "550e8400-e29b-41d4-a716-446655440000",
            initialQuantity: 20,
          }),
        ],
      });
      expect(toast.success).toHaveBeenCalledWith(OPENING_STOCK.SUCCESS_IMPORT);
    });
  });
});
