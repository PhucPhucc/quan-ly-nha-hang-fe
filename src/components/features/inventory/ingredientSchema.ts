import * as z from "zod";

import { InventoryUnit } from "@/types/Inventory";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  code: z.string().min(1, "Mã không được để trống"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  unit: z.nativeEnum(InventoryUnit),
  lowStockThreshold: z.number().min(0),
  costPrice: z.number().min(0),
  description: z.string().optional(),
  isActive: z.boolean(),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
