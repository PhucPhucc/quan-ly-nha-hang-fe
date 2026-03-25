import type { InventorySettingsInput } from "@/lib/zod-schemas/inventory";
import type { InventorySettings } from "@/types/Inventory";
import { InventoryCostMethod } from "@/types/Inventory";

export const DEFAULT_INVENTORY_SETTINGS: InventorySettingsInput = {
  expiryWarningDays: 7,
  defaultLowStockThreshold: 0,
  autoDeductOnCompleted: true,
  costMethod: InventoryCostMethod.WeightedAverage,
  maxCostRecalcDays: 31,
  openingStockImportCooldownHours: 0,
};

export function getInventorySettingsFormValues(
  settings?: Partial<InventorySettings> | null
): InventorySettingsInput {
  return {
    expiryWarningDays: settings?.expiryWarningDays ?? DEFAULT_INVENTORY_SETTINGS.expiryWarningDays,
    defaultLowStockThreshold:
      settings?.defaultLowStockThreshold ?? DEFAULT_INVENTORY_SETTINGS.defaultLowStockThreshold,
    autoDeductOnCompleted:
      settings?.autoDeductOnCompleted ?? DEFAULT_INVENTORY_SETTINGS.autoDeductOnCompleted,
    costMethod: settings?.costMethod ?? DEFAULT_INVENTORY_SETTINGS.costMethod,
    maxCostRecalcDays: settings?.maxCostRecalcDays ?? DEFAULT_INVENTORY_SETTINGS.maxCostRecalcDays,
    openingStockImportCooldownHours:
      settings?.openingStockImportCooldownHours ??
      DEFAULT_INVENTORY_SETTINGS.openingStockImportCooldownHours,
  };
}
