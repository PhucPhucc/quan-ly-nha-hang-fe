import { z } from "zod";

export const inventorySettingsSchema = z.object({
  expiryWarningDays: z.number().min(1, "Số ngày cảnh báo phải ≥ 1"),
  defaultLowStockThreshold: z.number().min(0, "Ngưỡng cảnh báo phải ≥ 0"),
  autoDeductOnCompleted: z.boolean(),
  costMethod: z.string(),
  maxCostRecalcDays: z
    .number()
    .min(1, "Số ngày tối đa phải ≥ 1")
    .max(365, "Số ngày tối đa phải ≤ 365"),
});

export type InventorySettingsInput = z.infer<typeof inventorySettingsSchema>;

export const openingStockItemSchema = z.object({
  ingredientId: z.string().uuid(),
  initialQuantity: z.number().min(0, "Số lượng phải ≥ 0"),
  costPrice: z.number().min(0, "Đơn giá phải ≥ 0").optional(),
});

export const importOpeningStockSchema = z.object({
  items: z.array(openingStockItemSchema).min(1, "Phải có ít nhất 1 nguyên vật liệu"),
});

export type ImportOpeningStockInput = z.infer<typeof importOpeningStockSchema>;
