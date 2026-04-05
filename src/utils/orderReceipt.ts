import { useTableStore } from "@/store/useTableStore";
import { OrderItemOptionGroup } from "@/types/Order";

export interface ReceiptOptionItem {
  label: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderTableDisplay {
  tableNumber?: number;
  tableCode?: string;
  areaName?: string;
  areaCodePrefix?: string;
  tableLabel?: string;
}

export const resolveOrderTableDisplay = (tableId?: string | null): OrderTableDisplay => {
  if (!tableId) {
    return {};
  }

  const { tables, areas } = useTableStore.getState();
  const table = tables.find((item) => item.tableId === tableId);
  if (table) {
    const area = areas.find((item) => item.areaId === table.areaId);
    const tableCode = table.tableCode || (table.tableNumber ? String(table.tableNumber) : "");
    const areaName = area?.name || area?.codePrefix;
    const tableLabel = areaName
      ? `${areaName} - ${tableCode ? `Bàn ${tableCode}` : `Bàn ${table.tableNumber}`}`
      : tableCode
        ? `Bàn ${tableCode}`
        : `Bàn ${table.tableNumber}`;

    return {
      tableNumber: table.tableNumber,
      tableCode,
      areaName: area?.name,
      areaCodePrefix: area?.codePrefix,
      tableLabel,
    };
  }

  const legacyTableNumber = Number.parseInt(tableId, 10);
  return Number.isFinite(legacyTableNumber)
    ? {
        tableNumber: legacyTableNumber,
        tableLabel: `Bàn ${legacyTableNumber}`,
      }
    : {};
};

export const resolveOrderTableNumber = (tableId?: string | null): number | undefined =>
  resolveOrderTableDisplay(tableId).tableNumber;

export const buildReceiptOptionItems = (
  groups?: OrderItemOptionGroup[],
  fallback?: string
): ReceiptOptionItem[] => {
  const optionItems =
    groups?.flatMap((group) =>
      group.optionValues.map((value) => {
        const quantity = value.quantity || 1;
        const unitPrice = Number(value.extraPriceSnapshot || 0);
        return {
          label: `${group.groupNameSnapshot}: ${value.labelSnapshot}`,
          quantity,
          unitPrice,
          lineTotal: unitPrice * quantity,
        };
      })
    ) ?? [];

  if (optionItems.length > 0) {
    return optionItems;
  }

  if (!fallback) {
    return [];
  }

  return fallback
    .split(/[;\n,]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((label) => ({
      label,
      quantity: 1,
      unitPrice: 0,
      lineTotal: 0,
    }));
};
