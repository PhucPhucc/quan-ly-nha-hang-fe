import { describe, expect, it, vi } from "vitest";

import { apiFetch } from "@/services/api";

import { inventoryService } from "../inventory.service";

vi.mock("@/services/api", () => ({
  apiFetch: vi.fn(),
}));

describe("inventoryService", () => {
  it("calls getInventorySettings with the settings endpoint", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: {
        expiryWarningDays: 7,
        defaultLowStockThreshold: 0,
        autoDeductOnCompleted: true,
        costMethod: "Bình quân gia quyền",
        maxCostRecalcDays: 31,
      },
    });

    await inventoryService.getInventorySettings();

    expect(apiFetch).toHaveBeenCalledWith("/inventory/settings");
  });

  it("calls updateInventorySettings with PUT payload", async () => {
    const payload = {
      expiryWarningDays: 14,
      defaultLowStockThreshold: 3,
      autoDeductOnCompleted: false,
      costMethod: "FIFO",
      maxCostRecalcDays: 45,
    };

    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: true,
    });

    await inventoryService.updateInventorySettings(payload);

    expect(apiFetch).toHaveBeenCalledWith("/inventory/settings", {
      method: "PUT",
      body: payload,
    });
  });
});
