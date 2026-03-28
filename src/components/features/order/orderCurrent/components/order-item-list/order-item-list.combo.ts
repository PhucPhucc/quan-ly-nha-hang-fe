import { OrderItem } from "@/types/Order";

import {
  getComboNameFromNote,
  getComboParentOrderItemId,
  normalizeComboName,
} from "./order-item-list.parsers";
import { ComboDisplayMap } from "./order-item-list.types";

export const buildComboDisplayMap = (remoteItems: OrderItem[]): ComboDisplayMap => {
  const orderItemIds = new Set(remoteItems.map((item) => item.orderItemId));
  const parentIdByChildId = new Map<string, string>();
  const childrenByParentId = new Map<string, OrderItem[]>();
  const normalizedNameByOrderItemId = new Map<string, string>();
  const candidateParentsByName = new Map<string, OrderItem[]>();

  remoteItems.forEach((item) => {
    const normalizedName = normalizeComboName(item.itemNameSnapshot);
    normalizedNameByOrderItemId.set(item.orderItemId, normalizedName);

    if (!normalizedName) {
      return;
    }

    const existingCandidates = candidateParentsByName.get(normalizedName) ?? [];
    existingCandidates.push(item);
    candidateParentsByName.set(normalizedName, existingCandidates);
  });

  const pushChildToParent = (childItem: OrderItem, parentOrderItemId: string): void => {
    if (childItem.orderItemId === parentOrderItemId) {
      return;
    }

    parentIdByChildId.set(childItem.orderItemId, parentOrderItemId);
    const existingChildren = childrenByParentId.get(parentOrderItemId) ?? [];
    existingChildren.push(childItem);
    childrenByParentId.set(parentOrderItemId, existingChildren);
  };

  remoteItems.forEach((item) => {
    const parentOrderItemId = getComboParentOrderItemId(item);
    if (!parentOrderItemId || !orderItemIds.has(parentOrderItemId)) {
      return;
    }

    pushChildToParent(item, parentOrderItemId);
  });

  remoteItems.forEach((item) => {
    if (parentIdByChildId.has(item.orderItemId)) {
      return;
    }

    const comboNameFromNote = getComboNameFromNote(item.itemNote);
    const normalizedComboName = normalizeComboName(comboNameFromNote);
    if (!normalizedComboName) {
      return;
    }

    const exactCandidates = candidateParentsByName.get(normalizedComboName) ?? [];

    const priorityExactCandidate = exactCandidates.find(
      (candidate) =>
        candidate.orderItemId !== item.orderItemId &&
        !parentIdByChildId.has(candidate.orderItemId) &&
        (candidate.unitPriceSnapshot > 0 || !candidate.isFreeItem)
    );

    const fallbackExactCandidate = exactCandidates.find(
      (candidate) =>
        candidate.orderItemId !== item.orderItemId && !parentIdByChildId.has(candidate.orderItemId)
    );

    const fuzzyCandidate = remoteItems.find((candidate) => {
      if (candidate.orderItemId === item.orderItemId) {
        return false;
      }

      if (parentIdByChildId.has(candidate.orderItemId)) {
        return false;
      }

      const candidateNormalizedName = normalizedNameByOrderItemId.get(candidate.orderItemId) ?? "";

      return (
        candidateNormalizedName.length > 0 &&
        (candidateNormalizedName.includes(normalizedComboName) ||
          normalizedComboName.includes(candidateNormalizedName))
      );
    });

    const resolvedParent = priorityExactCandidate ?? fallbackExactCandidate ?? fuzzyCandidate;
    if (!resolvedParent) {
      return;
    }

    pushChildToParent(item, resolvedParent.orderItemId);
  });

  return { parentIdByChildId, childrenByParentId };
};
