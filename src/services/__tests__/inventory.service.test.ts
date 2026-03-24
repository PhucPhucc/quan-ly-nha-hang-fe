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
        costMethod: "WeightedAverage",
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

  it("calls getInventoryGroups with the groups endpoint", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: [],
    });

    await inventoryService.getInventoryGroups();

    expect(apiFetch).toHaveBeenCalledWith("/inventory/groups");
  });

  it("calls generateIngredientCode with encoded name query", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: "HANH-TAY",
    });

    await inventoryService.generateIngredientCode("Hanh tay");

    expect(apiFetch).toHaveBeenCalledWith("/ingredients/generate-code?name=Hanh+tay");
  });

  it("reads generated ingredient code from object payloads", async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      isSuccess: true,
      data: { code: "HANH-TAY-01" },
    });

    const result = await inventoryService.generateIngredientCode("Hanh tay");

    expect(result).toEqual({
      isSuccess: true,
      data: "HANH-TAY-01",
    });
  });

  it("falls back to local code when generateIngredientCode fails", async () => {
    vi.mocked(apiFetch).mockRejectedValue(
      new Error("Employee not found with the specified code and current role.")
    );

    const result = await inventoryService.generateIngredientCode("Hanh tay");

    expect(result).toEqual({
      isSuccess: true,
      data: "HANHTAY",
    });
  });
});
