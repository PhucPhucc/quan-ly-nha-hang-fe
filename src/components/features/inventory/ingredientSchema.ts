import * as z from "zod";

import { InventoryUnit } from "@/types/Inventory";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  code: z.string().min(1, "Mã không được để trống"),
  unit: z.nativeEnum(InventoryUnit),
  // Stock and cost are system-managed; keep for display only.
  currentStock: z.number().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  lowStockThreshold: z.number().min(0),
  costPrice: z.number().min(0),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
