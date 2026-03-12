import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventoryService";

import { InventorySettingsForm } from "../InventorySettingsForm";

// Mock services and toast
vi.mock("@/services/inventoryService", () => ({
  inventoryService: {
    getInventorySettings: vi.fn(),
    updateInventorySettings: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const { SETTINGS } = UI_TEXT.INVENTORY;

describe("InventorySettingsForm", () => {
  it("should render and load settings", async () => {
    vi.mocked(inventoryService.getInventorySettings).mockResolvedValue({
      isSuccess: true,
      data: {
        expiryWarningDays: 10,
        defaultLowStockThreshold: 5,
        autoDeductOnCompleted: true,
        costMethod: "Bình quân gia quyền",
        maxCostRecalcDays: 30,
      },
    });

    render(<InventorySettingsForm />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(SETTINGS.EXPIRY_WARNING)).toHaveValue(10);
      expect(screen.getByLabelText(SETTINGS.LOW_STOCK_THRESHOLD)).toHaveValue(5);
    });
  });

  it("should submit form successfully", async () => {
    const mockUpdate = vi.mocked(inventoryService.updateInventorySettings).mockResolvedValue({
      isSuccess: true,
      data: true,
    });

    const user = userEvent.setup();
    render(<InventorySettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(SETTINGS.EXPIRY_WARNING)).toBeInTheDocument();
    });

    const expiryInput = screen.getByLabelText(SETTINGS.EXPIRY_WARNING);
    await user.clear(expiryInput);
    await user.type(expiryInput, "15");

    const saveBtn = screen.getByRole("button", { name: UI_TEXT.BUTTON.SAVE_CHANGES });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          expiryWarningDays: 15,
        })
      );
      expect(toast.success).toHaveBeenCalledWith(SETTINGS.SUCCESS_UPDATE);
    });
  });
});
