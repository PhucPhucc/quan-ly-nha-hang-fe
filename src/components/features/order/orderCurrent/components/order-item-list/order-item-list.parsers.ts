import { OrderItem } from "@/types/Order";

import { COMBO_NOTE_PATTERN, COMBO_PARENT_ORDER_ITEM_ID_FIELDS } from "./order-item-list.constants";

export const normalizeComboName = (value?: string): string => {
  if (!value) return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\(combo\)|\(set\s*menu\)|\(set\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const getComboNameFromNote = (note?: string): string | undefined => {
  if (!note) return undefined;
  const match = COMBO_NOTE_PATTERN.exec(note);
  if (!match?.[1]) return undefined;
  const comboName = match[1].trim();
  return comboName.length > 0 ? comboName : undefined;
};

export const getDisplayNote = (note?: string): string | undefined => {
  if (!note) return undefined;
  const cleaned = note.replace(COMBO_NOTE_PATTERN, "").trim();
  return cleaned.length > 0 ? cleaned : undefined;
};

export const getComboParentOrderItemId = (item: OrderItem): string | undefined => {
  const rawItem = item as unknown as Record<string, unknown>;

  for (const field of COMBO_PARENT_ORDER_ITEM_ID_FIELDS) {
    const value = rawItem[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return undefined;
};

export const getRemoteItemTotal = (item: OrderItem): number => {
  const optionExtraTotal =
    item.optionGroups
      ?.flatMap((group) => group.optionValues)
      .reduce(
        (sum, optionValue) =>
          sum + Number(optionValue.extraPriceSnapshot || 0) * (optionValue.quantity || 1),
        0
      ) || 0;

  return item.unitPriceSnapshot + optionExtraTotal;
};
