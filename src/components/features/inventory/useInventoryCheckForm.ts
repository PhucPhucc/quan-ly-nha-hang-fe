import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { inventoryService } from "@/services/inventory.service";
import { CreateInventoryCheckRequest, InventoryCheckItem } from "@/types/Inventory";

export function useInventoryCheckForm(id?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = !id || id === "new";

  const [checkDate, setCheckDate] = useState<Date>(new Date());
  const [note, setNote] = useState("");
  const [items, setItems] = useState<Partial<InventoryCheckItem>[]>([]);

  // 1. Fetch data if editing
  const { data: detailData, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["inventory-check", id],
    queryFn: () => (id && !isNew ? inventoryService.getInventoryCheckDetail(id) : null),
    enabled: !!id && !isNew,
  });

  // 2. Fetch create-form snapshot if new
  const { data: createFormData, isLoading: isLoadingCreateForm } = useQuery({
    queryKey: ["inventory-check-create-form"],
    queryFn: () => inventoryService.getInventoryCheckCreateForm(),
    enabled: isNew,
  });

  const isInitialized = useRef(false);

  useEffect(() => {
    if (detailData?.isSuccess && detailData.data && !isInitialized.current) {
      const d = detailData.data;
      Promise.resolve().then(() => {
        setCheckDate(new Date(d.checkDate));
        setNote(d.note || "");
        setItems(d.items);
      });
      isInitialized.current = true;
    }
  }, [detailData]);

  useEffect(() => {
    if (isNew && createFormData?.isSuccess && createFormData.data && !isInitialized.current) {
      Promise.resolve().then(() => {
        setItems(createFormData.data);
      });
      isInitialized.current = true;
    }
  }, [isNew, createFormData]);

  const updatePhysicalQty = useCallback((ingredientId: string, val: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.ingredientId === ingredientId) {
          const physicalQuantity = val;
          const bookQuantity = item.bookQuantity || 0;
          return {
            ...item,
            physicalQuantity,
            differenceQuantity: physicalQuantity - bookQuantity,
          };
        }
        return item;
      })
    );
  }, []);

  const updateReason = useCallback((ingredientId: string, reason: string) => {
    setItems((prev) =>
      prev.map((item) => (item.ingredientId === ingredientId ? { ...item, reason } : item))
    );
  }, []);

  const createMutation = useMutation({
    mutationFn: (data: CreateInventoryCheckRequest) => inventoryService.createInventoryCheck(data),
    onSuccess: (res) => {
      if (res.isSuccess) {
        toast.success(UI_TEXT.INVENTORY.CHECK.CREATE.SUCCESS_SAVE);
        queryClient.invalidateQueries({ queryKey: ["inventory-checks"] });
        router.push("/manager/inventory/check");
      }
    },
  });

  const processMutation = useMutation({
    mutationFn: (id: string) => inventoryService.processInventoryCheck(id),
    onSuccess: (res) => {
      if (res.isSuccess) {
        toast.success(UI_TEXT.INVENTORY.CHECK.CREATE.SUCCESS_PROCESS);
        queryClient.invalidateQueries({ queryKey: ["inventory-checks"] });
        queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        router.push("/manager/inventory/check");
      }
    },
  });

  const handleSaveDraft = async () => {
    const payload: CreateInventoryCheckRequest = {
      checkDate: checkDate.toISOString(),
      note,
      items: items.map((i) => ({
        ingredientId: i.ingredientId!,
        physicalQuantity: i.physicalQuantity || 0,
        reason: i.reason,
      })),
    };
    createMutation.mutate(payload);
  };

  const handleProcess = async () => {
    // If new, must save then process (usually backend handles this together or as separate steps)
    // Architect analysis says process command exists
    if (isNew) {
      const res = await inventoryService.createInventoryCheck({
        checkDate: checkDate.toISOString(),
        note,
        items: items.map((i) => ({
          ingredientId: i.ingredientId!,
          physicalQuantity: i.physicalQuantity || 0,
          reason: i.reason,
        })),
      });
      if (res.isSuccess && res.data) {
        processMutation.mutate(res.data.inventoryCheckId);
      }
    } else if (id) {
      processMutation.mutate(id);
    }
  };

  return {
    isNew,
    check: detailData?.data,
    isLoading: isLoadingDetail || isLoadingCreateForm,
    checkDate,
    setCheckDate,
    note,
    setNote,
    items,
    updatePhysicalQty,
    updateReason,
    handleSaveDraft,
    handleProcess,
    isSaving: createMutation.isPending || processMutation.isPending,
  };
}
