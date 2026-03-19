import { OptionGroup, OptionItem } from "@/types/Menu";

// --- Shared draft type used across form sub-components ---
export interface DraftItem {
  draftId: string;
  optionItemId?: string; // undefined = new
  label: string;
  extraPrice: number;
  sortOrder: number;
  isActive: boolean;
}

export function makeDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function itemToDraft(item: OptionItem, idx: number): DraftItem {
  return {
    draftId: makeDraftId(),
    optionItemId: item.optionItemId,
    label: item.label,
    extraPrice: item.extraPrice,
    sortOrder: item.sortOrder ?? idx,
    isActive: item.isActive ?? true,
  };
}

// Converts payload optionItems for API
export function draftToApiItem(item: DraftItem, idx: number, optionGroupId: string): OptionItem {
  return {
    optionItemId: item.optionItemId ?? "",
    optionGroupId,
    label: item.label.trim(),
    value: item.label.trim().toLowerCase().replace(/\s+/g, "-"),
    extraPrice: item.extraPrice,
    sortOrder: idx,
    isActive: item.isActive,
  };
}

export interface OptionGroupFormState {
  name: string;
  optionType: "1" | "2";
  isActive: boolean;
  items: DraftItem[];
  saving: boolean;
}

export interface OptionGroupFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingGroup: OptionGroup | null;
  onSuccess: (group: OptionGroup) => void;
}
