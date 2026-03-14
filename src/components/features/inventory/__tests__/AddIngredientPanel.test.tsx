import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { inventoryService } from "@/services/inventory.service";
import { AlertThresholdStatus, InventoryUnit } from "@/types/Inventory";

import { AddIngredientPanel } from "../AddIngredientPanel";

// Mock the service
vi.mock("@/services/inventory.service", () => ({
  inventoryService: {
    addIngredient: vi.fn(),
    generateIngredientCode: vi.fn(),
    getInventorySettings: vi.fn(),
  },
}));

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("AddIngredientPanel", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );

    vi.mocked(inventoryService.getInventorySettings).mockResolvedValue({
      isSuccess: true,
      data: {
        expiryWarningDays: 7,
        defaultLowStockThreshold: 3,
        autoDeductOnCompleted: true,
        costMethod: "WeightedAverage",
        maxCostRecalcDays: 31,
      },
    });

    vi.mocked(inventoryService.generateIngredientCode).mockResolvedValue({
      isSuccess: true,
      data: "APPLE-AUTO",
    });
  });

  it("should render the trigger button", () => {
    renderWithProviders(<AddIngredientPanel />);
    expect(screen.getByRole("button", { name: /Thêm nguyên liệu mới/i })).toBeInTheDocument();
  });

  it("should open drawer and submit valid form", async () => {
    const mockAdd = vi.mocked(inventoryService.addIngredient).mockResolvedValue({
      isSuccess: true,
      data: {
        id: "new-1",
        name: "Apple",
        sku: "APPLE-AUTO",
        unit: InventoryUnit.KG,
        currentStock: 0,
        lowStockThreshold: 3,
        costPerUnit: 0,
        status: AlertThresholdStatus.NORMAL,
        updatedAt: "",
      },
    });

    const user = userEvent.setup();
    renderWithProviders(<AddIngredientPanel />);

    // Open drawer
    await user.click(screen.getByRole("button", { name: /Thêm nguyên liệu mới/i }));

    // Wait for drawer to open and find elements
    const dialog = await screen.findByRole("dialog");
    const textboxes = within(dialog).getAllByRole("textbox");
    const nameInput = textboxes[0];
    const codeInput = textboxes[1];
    expect(nameInput).toBeInTheDocument();

    // Fill form
    await user.type(nameInput, "Apple");
    await waitFor(() => {
      expect(codeInput).toHaveValue("APPLE-AUTO");
    });

    const spinbuttons = within(dialog).getAllByRole("spinbutton");
    const qtyInput = spinbuttons[0];
    expect(qtyInput).toHaveAttribute("readonly");
    await user.selectOptions(within(dialog).getByRole("combobox"), "kg");

    const costInput = spinbuttons[1];
    expect(costInput).toHaveAttribute("readonly");

    // Submit
    await user.click(screen.getByRole("button", { name: /Lưu nguyên liệu/i }));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(inventoryService.generateIngredientCode).toHaveBeenCalledWith("Apple");
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Apple",
          code: "APPLE-AUTO",
          unit: "kg",
          lowStockThreshold: 3,
          description: "",
          isActive: true,
        })
      );
    });
  });

  it("should fallback to local code if generate API fails", async () => {
    vi.mocked(inventoryService.generateIngredientCode).mockResolvedValue({
      isSuccess: true,
      data: "HANHTAY",
    });

    const user = userEvent.setup();
    renderWithProviders(<AddIngredientPanel />);

    await user.click(screen.getByRole("button", { name: /Thêm nguyên liệu mới/i }));

    const dialog = await screen.findByRole("dialog");
    const textboxes = within(dialog).getAllByRole("textbox");
    const nameInput = textboxes[0];
    const codeInput = textboxes[1];

    await user.type(nameInput, "Hanh tay");

    await waitFor(() => {
      expect(codeInput).toHaveValue("HANHTAY");
    });
  });
});
