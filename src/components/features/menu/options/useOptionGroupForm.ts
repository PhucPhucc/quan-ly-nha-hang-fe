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
        toast.success(
          isEditing ? UI_TEXT.MENU.OPTIONS.EDIT_SUCCESS : UI_TEXT.MENU.OPTIONS.CREATE_SUCCESS
        );
        onSuccess({
          ...(editingGroup ?? { optionGroupId: response.data ?? "" }),
          name: name.trim(),
          optionType: Number(optionType) as OptionGroup["optionType"],
          isActive,
          optionItems: payload.optionItems,
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
