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

vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    getIngredients: vi.fn(),
    getInventorySettings: vi.fn(),
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
      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  it("should ask for overwrite confirmation before submitting existing stock", async () => {
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
      data: {
        updatedCount: 1,
        transactionCount: 1,
        updatedAt: new Date().toISOString(),
      },
    });

    const user = userEvent.setup();
    renderWithProviders(<OpeningStockEntry />);

    await waitFor(() => {
      expect(screen.getByText("Cà chua")).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole("button", { name: OPENING_STOCK.BTN_SAVE });
    await user.click(saveBtn);

    expect(screen.getByText("Xác nhận ghi đè tồn kho")).toBeInTheDocument();
    expect(screen.getByText("NVL này đã có tồn kho. Bạn có chắc muốn ghi đè?")).toBeInTheDocument();
    expect(mockImport).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Xác nhận ghi đè" }));

    await waitFor(() => {
      expect(mockImport).toHaveBeenCalledWith({
        items: [
          expect.objectContaining({
            ingredientId: "550e8400-e29b-41d4-a716-446655440000",
            initialQuantity: 10,
          }),
        ],
        confirmOverwrite: true,
      });
      expect(toast.success).toHaveBeenCalledWith(OPENING_STOCK.SUCCESS_IMPORT);
    });
  });

  it("should disable inputs and save button when opening stock is locked", async () => {
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

    renderWithProviders(<OpeningStockEntry />);

    await waitFor(() => {
      expect(screen.getByText("Số dư đầu kỳ đã khóa")).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole("button", { name: OPENING_STOCK.BTN_SAVE });
    const inputs = screen.getAllByRole("spinbutton");

    expect(saveBtn).toBeDisabled();
    expect(inputs[0]).toBeDisabled();
    expect(inputs[1]).toBeDisabled();
  });

  it("should lock the screen after submitting opening stock successfully", async () => {
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

    vi.mocked(inventoryService.getInventorySettings)
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValue({
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

    vi.mocked(inventoryService.importOpeningStock).mockResolvedValue({
      isSuccess: true,
      data: {
        updatedCount: 1,
        transactionCount: 1,
        updatedAt: new Date().toISOString(),
      },
    });

    const user = userEvent.setup();
    renderWithProviders(<OpeningStockEntry />);

    await waitFor(() => {
      expect(screen.getByText("TOMATO")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: OPENING_STOCK.BTN_SAVE }));
    await user.click(screen.getByRole("button", { name: "Xác nhận ghi đè" }));

    await waitFor(() => {
      expect(screen.getByText("Số dư đầu kỳ đã khóa")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: OPENING_STOCK.BTN_SAVE })).toBeDisabled();
    });
  });
  it("should keep showing loading state until inventory settings are loaded", async () => {
    let resolveSettings:
      | ((value: Awaited<ReturnType<typeof inventoryService.getInventorySettings>>) => void)
      | undefined;

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

    vi.mocked(inventoryService.getInventorySettings).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSettings = resolve;
        })
    );

    renderWithProviders(<OpeningStockEntry />);

    expect(screen.queryByText("TOMATO")).not.toBeInTheDocument();

    resolveSettings?.({
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

    await waitFor(() => {
      expect(screen.getByText("TOMATO")).toBeInTheDocument();
    });
  });
});
