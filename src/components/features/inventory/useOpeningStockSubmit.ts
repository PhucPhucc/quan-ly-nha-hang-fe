import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { importOpeningStockSchema } from "@/lib/zod-schemas/inventory";
import { inventoryService } from "@/services/inventory.service";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";
import { buildImportOpeningStockInput } from "./openingStockEntry.utils";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

export function useOpeningStockSubmit() {
  const mutation = useMutation({
    mutationFn: async (entryItems: OpeningStockEntryValues) => {
      const payload = buildImportOpeningStockInput(entryItems);
      const validation = importOpeningStockSchema.safeParse(payload);

      if (!validation.success) {
        throw new Error(validation.error.issues[0]?.message || OPENING_STOCK.VALIDATION_REQUIRED);
      }

      const response = await inventoryService.importOpeningStock(validation.data);

      if (!response.isSuccess) {
        throw new Error(response.message || UI_TEXT.API.NETWORK_ERROR);
      }
    },
    onSuccess: () => {
      toast.success(OPENING_STOCK.SUCCESS_IMPORT);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    },
  });

  return {
    handleSave: mutation.mutate,
    saving: mutation.isPending,
  };
}
