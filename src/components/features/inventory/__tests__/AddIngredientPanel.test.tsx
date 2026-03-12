import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { inventoryService } from "@/services/inventoryService";
import { AlertThresholdStatus, InventoryUnit } from "@/types/Inventory";

import { AddIngredientPanel } from "../AddIngredientPanel";

// Mock the service
vi.mock("@/services/inventoryService", () => ({
  inventoryService: {
    addIngredient: vi.fn(),
  },
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
};

describe("AddIngredientPanel", () => {
  it("should render the trigger button", () => {
    renderWithProviders(<AddIngredientPanel />);
    expect(screen.getByRole("button", { name: /Add New Ingredient/i })).toBeInTheDocument();
  });

  it("should open drawer and submit valid form", async () => {
    const mockAdd = vi.mocked(inventoryService.addIngredient).mockResolvedValue({
      isSuccess: true,
      data: {
        id: "new-1",
        name: "Apple",
        sku: "APPLE",
        unit: InventoryUnit.KG,
        currentStock: 5,
        lowStockThreshold: 10,
        costPerUnit: 5,
        status: AlertThresholdStatus.NORMAL,
        updatedAt: "",
      },
    });

    const user = userEvent.setup();
    renderWithProviders(<AddIngredientPanel />);

    // Open drawer
    await user.click(screen.getByRole("button", { name: /Add New Ingredient/i }));

    // Wait for drawer to open and find elements
    const nameInput = await screen.findByLabelText(/Ingredient Name/i);
    expect(nameInput).toBeInTheDocument();

    // Fill form
    await user.type(nameInput, "Apple");
    await user.type(screen.getByLabelText(/SKU \/ Barcode/i), "APPLE");
    const qtyInput = screen.getByLabelText(/Current Stock/i);
    await user.clear(qtyInput);
    await user.type(qtyInput, "5");
    await user.selectOptions(screen.getByLabelText(/Base Unit/i), "kg");

    const costInput = screen.getByLabelText(/Average Cost Per Unit/i);
    await user.clear(costInput);
    await user.type(costInput, "2.5");

    // Submit
    await user.click(screen.getByRole("button", { name: /Lưu nguyên liệu/i }));

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Apple",
          sku: "APPLE",
          currentStock: 5,
          unit: "kg",
          costPerUnit: 2.5,
        })
      );
    });
  });
});
