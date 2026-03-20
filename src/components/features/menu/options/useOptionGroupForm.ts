import { useEffect, useState } from "react";
import { toast } from "sonner";

import { UI_TEXT } from "@/lib/UI_Text";
import { optionService } from "@/services/optionService";
import { OptionGroup } from "@/types/Menu";

import { DraftItem, draftToApiItem, itemToDraft, makeDraftId } from "./types/optionGroupForm";

interface UseOptionGroupFormProps {
  open: boolean;
  editingGroup: OptionGroup | null;
  onSuccess: (group: OptionGroup) => void;
  onOpenChange: (open: boolean) => void;
}

export function useOptionGroupForm({
  open,
  editingGroup,
  onSuccess,
  onOpenChange,
}: UseOptionGroupFormProps) {
  const isEditing = !!editingGroup;

  const [name, setName] = useState("");
  const [optionType, setOptionType] = useState<"1" | "2">("1");
  const [isActive, setIsActive] = useState(true);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [saving, setSaving] = useState(false);

  // Reset / populate form on open
  useEffect(() => {
    if (!open) return;
    if (editingGroup) {
      setName(editingGroup.name);
      setOptionType(String(editingGroup.optionType) as "1" | "2");
      setIsActive(editingGroup.isActive);
      setItems((editingGroup.optionItems ?? []).map(itemToDraft));
    } else {
      setName("");
      setOptionType("1");
      setIsActive(true);
      setItems([]);
    }
  }, [open, editingGroup]);

  // --- Item helpers ---
  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { draftId: makeDraftId(), label: "", extraPrice: 0, sortOrder: prev.length, isActive: true },
    ]);

  const removeItem = (draftId: string) =>
    setItems((prev) => prev.filter((i) => i.draftId !== draftId));

  const updateItem = (draftId: string, patch: Partial<DraftItem>) =>
    setItems((prev) => prev.map((i) => (i.draftId === draftId ? { ...i, ...patch } : i)));

  const moveItem = (idx: number, direction: "up" | "down") => {
    const next = [...items];
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next.map((item, i) => ({ ...item, sortOrder: i })));
  };

  // --- Validation ---
  const validate = (): string | null => {
    if (!name.trim()) return UI_TEXT.MENU.OPTIONS.VALIDATE_NAME_REQUIRED;
    if (items.length === 0) return UI_TEXT.MENU.OPTIONS.VALIDATE_ITEMS_MIN;
    for (const item of items) {
      if (!item.label.trim()) return UI_TEXT.MENU.OPTIONS.VALIDATE_ITEM_LABEL;
    }
    return null;
  };

  const buildSavedItem = (
    item: DraftItem,
    index: number,
    optionGroupId: string,
    optionItemId?: string
  ): NonNullable<OptionGroup["optionItems"]>[number] => ({
    optionItemId: optionItemId ?? item.optionItemId ?? "",
    optionGroupId,
    label: item.label.trim(),
    value: item.label.trim().toLowerCase().replace(/\s+/g, "-"),
    extraPrice: item.extraPrice,
    sortOrder: index,
    isActive: item.isActive,
  });

  const syncOptionItems = async (
    optionGroupId: string
  ): Promise<NonNullable<OptionGroup["optionItems"]>> => {
    const savedItems: NonNullable<OptionGroup["optionItems"]> = [];
    const existingItemIds = new Set(
      (editingGroup?.optionItems ?? []).map((item) => item.optionItemId).filter(Boolean)
    );
    const currentItemIds = new Set(items.map((item) => item.optionItemId).filter(Boolean));

    for (const existingItemId of existingItemIds) {
      if (!currentItemIds.has(existingItemId)) {
        const deleteResponse = await optionService.deleteOptionItem(existingItemId);
        if (!deleteResponse.isSuccess) {
          throw new Error(`Failed to delete option item ${existingItemId}`);
        }
      }
    }

    for (const [index, item] of items.entries()) {
      if (item.optionItemId) {
        const updateResponse = await optionService.updateOptionItem(item.optionItemId, {
          label: item.label,
          extraPrice: item.extraPrice,
          isActive: item.isActive,
        });

        if (!updateResponse.isSuccess) {
          throw new Error(`Failed to update option item ${item.optionItemId}`);
        }

        savedItems.push(
          buildSavedItem(
            item,
            index,
            optionGroupId,
            updateResponse.data?.optionItemId ?? item.optionItemId
          )
        );
        continue;
      }

      const createResponse = await optionService.createOptionItem({
        optionGroupId,
        label: item.label,
        extraPrice: item.extraPrice,
        isActive: item.isActive,
      });

      if (!createResponse.isSuccess) {
        throw new Error(`Failed to create option item ${item.label}`);
      }

      savedItems.push(
        buildSavedItem(item, index, optionGroupId, createResponse.data?.optionItemId)
      );
    }

    return savedItems;
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setSaving(true);
    try {
      const groupId = editingGroup?.optionGroupId ?? "";
      const payload: Partial<OptionGroup> = {
        name: name.trim(),
        optionType: Number(optionType) as OptionGroup["optionType"],
        isActive,
        optionItems: items.map((item, idx) => draftToApiItem(item, idx, groupId)),
      };

      const response =
        isEditing && editingGroup
          ? await optionService.updateReusable(editingGroup.optionGroupId, payload)
          : await optionService.createReusable(payload);

      if (response.isSuccess) {
        const responseGroupId = response.data?.optionGroupId ?? "";
        const savedGroupId =
          (isEditing && editingGroup?.optionGroupId) || responseGroupId || groupId;
        const savedItems =
          savedGroupId && items.length > 0 ? await syncOptionItems(savedGroupId) : [];

        toast.success(
          isEditing ? UI_TEXT.MENU.OPTIONS.EDIT_SUCCESS : UI_TEXT.MENU.OPTIONS.CREATE_SUCCESS
        );
        onSuccess({
          ...(editingGroup ?? { optionGroupId: savedGroupId }),
          name: name.trim(),
          optionType: Number(optionType) as OptionGroup["optionType"],
          isActive,
          optionItems: savedItems.length > 0 ? savedItems : payload.optionItems,
        });
        onOpenChange(false);
      } else {
        toast.error(UI_TEXT.COMMON.ERROR_UNKNOWN);
      }
    } catch {
      toast.error(UI_TEXT.COMMON.ERROR_UNKNOWN);
    } finally {
      setSaving(false);
    }
  };

  return {
    isEditing,
    name,
    setName,
    optionType,
    setOptionType,
    isActive,
    setIsActive,
    items,
    saving,
    addItem,
    removeItem,
    updateItem,
    moveItem,
    handleSubmit,
  };
}
