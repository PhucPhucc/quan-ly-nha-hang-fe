import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { importOpeningStockSchema } from "@/lib/zod-schemas/inventory";
import { inventoryService } from "@/services/inventory.service";

import type { OpeningStockEntryValues } from "./components/openingStockEntry.types";
import { invalidateInventoryQueries } from "./inventoryQueryInvalidation";
import { buildImportOpeningStockInput } from "./openingStockEntry.utils";

const { OPENING_STOCK } = UI_TEXT.INVENTORY;

type HandleSaveParams = {
  entryItems: OpeningStockEntryValues;
  confirmOverwrite?: boolean;
};

function isOverwriteConfirmationError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const normalizedMessage = error.message.toLowerCase();

  return (
    normalizedMessage.includes("xac nhan ghi de") ||
    normalizedMessage.includes("xác nhận ghi đè") ||
    normalizedMessage.includes("ton kho") ||
    normalizedMessage.includes("tồn kho")
  );
}

export function useOpeningStockSubmit() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ entryItems, confirmOverwrite = false }: HandleSaveParams) => {
      const payload = buildImportOpeningStockInput(entryItems, confirmOverwrite);
      const validation = importOpeningStockSchema.safeParse(payload);

      if (!validation.success) {
        throw new Error(validation.error.issues[0]?.message || OPENING_STOCK.VALIDATION_REQUIRED);
      }

      const response = await inventoryService.importOpeningStock(validation.data);

      if (!response.isSuccess) {
        throw new Error(response.message || UI_TEXT.API.NETWORK_ERROR);
      }

      return response;
    },
    onSuccess: async () => {
      queryClient.setQueryData(["inventory-settings"], (current) => ({
        ...((typeof current === "object" && current !== null ? current : {}) as Record<
          string,
          unknown
        >),
        openingStockStatus: 2,
        lockedAt: new Date().toISOString(),
      }));

      await invalidateInventoryQueries(queryClient);
      toast.success(OPENING_STOCK.SUCCESS_IMPORT);
    },
    onError: (error) => {
      if (isOverwriteConfirmationError(error)) {
        return;
      }

      toast.error(error instanceof Error ? error.message : UI_TEXT.API.NETWORK_ERROR);
    },
  });

  return {
    handleSave: (entryItems: OpeningStockEntryValues, confirmOverwrite = false) =>
      mutation.mutate({ entryItems, confirmOverwrite }),
    handleSaveAsync: (entryItems: OpeningStockEntryValues, confirmOverwrite = false) =>
      mutation.mutateAsync({ entryItems, confirmOverwrite }),
    saving: mutation.isPending,
    isOverwriteConfirmationError,
  };
}
